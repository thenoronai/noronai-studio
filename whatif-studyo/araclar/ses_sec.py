#!/usr/bin/env python3
"""Gemini TTS ile anlatıcı sesi seçme ve doğrulama aracı.

Ne yapar:
  1) (isteğe bağlı) SHORTS-FORMULU.md'deki tarifle bir "Voice Design" sesi oluşturur (--tasarla).
  2) Aynı deneme metnini aday seslerle seslendirir (hazır sesler ve/veya tasarlanmış ses kimliği).
  3) Her çıktıyı ölçer: kelime/dk, perde medyanı ve aralığı (yarım ton), duraklamalar.
  4) Referans hedeflere uzaklığa göre sıralar ve en yakını önerir.

Anahtar: GEMINI_API_KEY ortam değişkeninde durur. Bu araç anahtarı ekrana ya da dosyaya yazmaz.

Örnek:
  export GEMINI_API_KEY=...            # kullanıcı kendi makinesinde
  python3 araclar/ses_sec.py --tasarla --out voice_test/
  python3 araclar/ses_sec.py --sesler Puck,Fenrir,Sadachbia,Laomedeia,voice_abc123 --out voice_test/
  python3 araclar/ses_sec.py --olc kayit.wav --metin metin.txt   # yalnız ölçüm (API gerekmez)

Notlar:
  - Model varsayılanı gemini-3.8-flash-tts (Voice Design yalnız 3.8 modellerinde). Model adları değişebilir;
    hata alırsan https://ai.google.dev/gemini-api/docs/speech-generation sayfasından güncel adı al.
  - Ücretli bir servis: kullanıcının onayı olmadan çalıştırma (SKILL.md "Sınırlar").
"""
import argparse
import base64
import json
import os
import re
import struct
import sys
import urllib.request
import wave

import numpy as np

API = "https://generativelanguage.googleapis.com/v1beta"

# Referans anlatıcının ölçülen değerleri (SHORTS-FORMULU.md, "Anlatıcı" tablosu)
HEDEF = {"kelime_dk": 280, "aralik_yt": 11.1, "duraklama_medyan_ms": 160, "duraklama_400ms_ustu": 0}

# Voice Design tarifi (orijinal bir ses: kimseyi taklit etmez, yalnız anlatım karakterini tarif eder)
TASARIM = {
    "type": "prompted",
    "display_name": "WhatIf Anlatici",
    "prompted": {
        "input": ("A bright, energetic young adult male storyteller with a clear American accent. "
                  "Fast but natural, like telling an unbelievable true story to a friend: "
                  "lively pitch movement, crisp consonants, a smile in the voice, playful disbelief "
                  "on surprising facts, no announcer or movie-trailer tone, no breathiness."),
        "language_code": "en-US",
        "gender": "male",
        "pitch": "high",
        "persona": "Narrator",
        "context": "Fast animated YouTube Shorts storytelling",
    },
}

# Deneme metni: referans yapısında, ORİJİNAL cümleler (kanca, alaycı, soru, açıklama, son cümle)
DENEME = ("If you sneeze on the Moon, your helmet fogs up for an entire hour. "
          "You see, the new guy laughs it off. It's just a sneeze. What's it going to do? "
          "Then the fog creeps across the glass, and he can't see his own boots. "
          "So how does one tiny sneeze blind a grown astronaut? "
          "Well, inside that helmet there's no wind at all, so every drop just hangs there, "
          "like breath on a cold car window that never clears.")


def key():
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        sys.exit("GEMINI_API_KEY ortam değişkeni yok. Kullanıcı kendi makinesinde tanımlamalı.")
    return k


def post(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"Content-Type": "application/json", "x-goog-api-key": key()})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read())


def tasarla(out):
    r = post(f"{API}/voices", {"voice": TASARIM, "store": True})
    vid = r.get("id") or r.get("name", "").split("/")[-1]
    sample = (r.get("sample_audio") or r.get("sampleAudio") or {}).get("data")
    if sample:
        with open(os.path.join(out, "tasarim_ornek.wav"), "wb") as fh:
            fh.write(base64.b64decode(sample))
    print("Tasarlanan ses kimliği:", vid)
    return vid


def seslendir(voice, text, model, style, path):
    vc = {"prebuiltVoiceConfig": {"voiceName": voice}} if not voice.startswith(("voice_", "voicekey_")) else {"voice": voice}
    part = {"text": text}
    if style:
        part["speechMetadata"] = {"style": style}
    body = {"contents": [{"parts": [part]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": vc}}}
    r = post(f"{API}/models/{model}:generateContent", body)
    inline = r["candidates"][0]["content"]["parts"][0]["inlineData"]
    data = base64.b64decode(inline["data"])
    mime = inline.get("mimeType", "")
    if data[:4] == b"RIFF":
        with open(path, "wb") as fh:
            fh.write(data)
    else:  # ham 24 kHz 16 bit mono PCM
        rate = int(re.search(r"rate=(\d+)", mime).group(1)) if "rate=" in mime else 24000
        with wave.open(path, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(data)
    return path


def oku_wav(path):
    with wave.open(path, "rb") as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype=np.int16 if sw == 2 else np.int32).astype(np.float32)
    if ch > 1:
        x = x.reshape(-1, ch).mean(axis=1)
    x /= np.abs(x).max() + 1e-9
    if sr != 16000:  # basit yeniden örnekleme
        t = np.arange(0, len(x) / sr, 1 / 16000)
        x = np.interp(t, np.arange(len(x)) / sr, x)
    return x.astype(np.float32), 16000


def yin(seg, sr=16000, fmin=70, fmax=400, th=0.1):
    tmin, tmax = int(sr / fmax), int(sr / fmin)
    W = len(seg) - tmax
    if W < 200:
        return 0
    d = np.array([np.sum((seg[:W] - seg[t:t + W]) ** 2) for t in range(1, tmax + 1)])
    cm = d * np.arange(1, tmax + 1) / np.maximum(np.cumsum(d), 1e-9)
    for t in range(tmin, tmax):
        if cm[t - 1] < th:
            while t < tmax - 1 and cm[t] < cm[t - 1]:
                t += 1
            return sr / t
    return 0


def olc(path, text):
    x, sr = oku_wav(path)
    hop, win = 160, 400
    n = (len(x) - win) // hop
    e = np.array([10 * np.log10(np.mean(x[i * hop:i * hop + win] ** 2) + 1e-10) for i in range(n)])
    konus = e > (np.percentile(e, 90) - 25)
    # duraklamalar (ilk ve son konuşma arasındaki 120 ms+ sessizlikler)
    idx = np.where(konus)[0]
    p = []
    if len(idx):
        run = 0
        for v in konus[idx[0]:idx[-1] + 1]:
            if not v:
                run += 1
            else:
                if run * 10 >= 120:
                    p.append(run * 10)
                run = 0
    # perde: konuşulan karelerde 40 ms pencere, 20 ms adım
    f0 = []
    for i in range(0, n, 2):
        if konus[i]:
            s = i * hop
            f = yin(x[s:s + 640 + 229])
            if f:
                f0.append(12 * np.log2(f / 100))
    f0 = np.array(f0)
    if len(f0) > 10:
        med = np.median(f0)
        f0 = f0[np.abs(f0 - med) < 7]
    words = len(re.findall(r"[A-Za-z0-9']+", text))
    konus_sn = konus.sum() * hop / sr
    return {"sure_sn": round(len(x) / sr, 2), "kelime_dk": round(words / (len(x) / sr) * 60),
            "kelime_dk_konusurken": round(words / max(konus_sn, 0.1) * 60),
            "perde_medyan_hz": round(100 * 2 ** (np.median(f0) / 12)) if len(f0) else None,
            "aralik_yt": round(float(np.percentile(f0, 90) - np.percentile(f0, 10)), 1) if len(f0) else None,
            "duraklama_sayisi": len(p), "duraklama_medyan_ms": int(np.median(p)) if p else 0,
            "duraklama_400ms_ustu": sum(1 for v in p if v >= 400)}


def uzaklik(m):
    s = abs(m["kelime_dk_konusurken"] - HEDEF["kelime_dk"]) / HEDEF["kelime_dk"]
    if m["aralik_yt"]:
        s += abs(m["aralik_yt"] - HEDEF["aralik_yt"]) / HEDEF["aralik_yt"]
    s += 0.2 * m["duraklama_400ms_ustu"]
    return round(s, 3)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sesler", default="Puck,Fenrir,Sadachbia,Laomedeia,Zephyr")
    ap.add_argument("--model", default="gemini-3.8-flash-tts")
    ap.add_argument("--stil", default="fast, bright and playful storytelling")
    ap.add_argument("--metin", help="deneme metni dosyası (yoksa yerleşik metin)")
    ap.add_argument("--tasarla", action="store_true", help="önce Voice Design ile ses oluştur ve adaylara ekle")
    ap.add_argument("--olc", help="yalnız bu WAV'ı ölç (API çağrısı yok)")
    ap.add_argument("--out", default="voice_test")
    a = ap.parse_args()
    text = DENEME
    if a.metin:
        with open(a.metin, encoding="utf-8") as fh:
            text = fh.read().strip()
    if a.olc:
        m = olc(a.olc, text)
        m["uzaklik"] = uzaklik(m)
        print(json.dumps(m, ensure_ascii=False, indent=1))
        return
    os.makedirs(a.out, exist_ok=True)
    adaylar = [s.strip() for s in a.sesler.split(",") if s.strip()]
    if a.tasarla:
        adaylar.insert(0, tasarla(a.out))
    sonuc = []
    for v in adaylar:
        path = os.path.join(a.out, f"{v}.wav")
        try:
            seslendir(v, text, a.model, a.stil, path)
            m = olc(path, text)
            m["ses"], m["uzaklik"] = v, uzaklik(m)
            sonuc.append(m)
            print(f"{v}: {m}")
        except Exception as e:  # bir ses başarısız olursa diğerlerine devam
            print(f"{v}: HATA {e}")
    sonuc.sort(key=lambda m: m["uzaklik"])
    with open(os.path.join(a.out, "sonuc.json"), "w", encoding="utf-8") as fh:
        json.dump(sonuc, fh, ensure_ascii=False, indent=1)
    if sonuc:
        print("\nEn yakın ses:", sonuc[0]["ses"], "— dinleyip onay al, sonra Kanal.md'ye yaz.")


if __name__ == "__main__":
    main()
