#!/usr/bin/env python3
"""Kelime zamanlarından altyazı grupları ve .srt üretir (TARZ-REHBERI.md Kural seti 2A).

Kullanım:
    python3 araclar/altyazi.py --words voice/<slug>/words.json --out <klasör> [--slug <slug>] [--kaydir 5.0]

Çıktılar:
    <klasör>/captions.json   [{"text", "startMs", "endMs"}]  -> altyazi/CaptionTrack.tsx
    <klasör>/subtitles_<slug>_en.srt

Kurallar: grup en çok 2 kelime ve 12 karakter; noktalamadan (. , ! ? : ; …) sonra yeni grup; sayı
birimiyle birlikte kalır ("a million", "10 km"); zaman kelime zaman damgalarından (tahmini eşit aralık
yok); grup bir sonraki gruba kadar ekranda kalır ama 0,25 sn'yi aşan sessizlikte kapanır (konuşma
yokken altyazı görünmez). --kaydir: ses videoya göre geç başlıyorsa (ör. 5 sn uyarı kartı) saniye.
words.json: [{"w","s","e"}] (saniye); "word"/"start"/"end" anahtarları da kabul edilir.
"""
import argparse
import json
import os
import re

EN_COK_KELIME = 2
EN_COK_KARAKTER = 12
SESSIZLIK_SN = 0.25
NOKTALAMA = re.compile(r"[.,!?:;…]$")
SAYI = re.compile(r"^[$€£]?\d[\d.,]*%?$|^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|"
                  r"twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|a)$", re.I)
BIRIM = re.compile(r"^(thousand|million|billion|trillion|hundred|percent|km|m|kg|g|cm|mm|mph|kmh|"
                   r"km/h|dollars?|euros?|pounds?|years?|days?|hours?|minutes?|seconds?|feet|meters?|miles?)[.,!?]?$", re.I)


def oku(path):
    with open(path, encoding="utf-8") as fh:
        W = json.load(fh)
    out = []
    for x in W:
        w = str(x.get("w", x.get("word", ""))).strip()
        if not w:
            continue
        s = float(x.get("s", x.get("start", 0)))
        e = float(x.get("e", x.get("end", s)))
        out.append((w, s, max(e, s)))
    return out


def grupla(kelimeler):
    """[(kelime, s, e)] -> [(metin, s, e)]"""
    gruplar, cur = [], []
    def kapat():
        if cur:
            gruplar.append((" ".join(k for k, _, _ in cur), cur[0][1], cur[-1][2]))
            cur.clear()
    for i, (w, s, e) in enumerate(kelimeler):
        if cur:
            metin = " ".join(k for k, _, _ in cur) + " " + w
            birlikte = SAYI.match(cur[-1][0]) and BIRIM.match(w) and len(cur) == 1
            dolu = len(cur) >= EN_COK_KELIME or len(metin) > EN_COK_KARAKTER
            bosluk = s - cur[-1][2] > SESSIZLIK_SN
            sonraki = kelimeler[i + 1][0] if i + 1 < len(kelimeler) else ""
            bolunur = SAYI.match(w) and BIRIM.match(sonraki)  # sayı bir sonraki gruba birimiyle gitsin
            if bosluk or (dolu and not birlikte) or (bolunur and not birlikte):
                kapat()
        cur.append((w, s, e))
        if NOKTALAMA.search(w):
            kapat()
    kapat()
    return gruplar


def zamanla(gruplar, kaydir=0.0):
    """Her grup bir sonrakinin başına kadar kalır; arada sessizlik varsa kendi sonunda kapanır."""
    out = []
    for i, (t, s, e) in enumerate(gruplar):
        son = e
        if i + 1 < len(gruplar):
            sonraki = gruplar[i + 1][1]
            son = sonraki if sonraki - e <= SESSIZLIK_SN else e
        out.append({"text": t, "startMs": round((s + kaydir) * 1000), "endMs": round((max(son, s + 0.05) + kaydir) * 1000)})
    return out


def srt_zaman(ms):
    h, ms = divmod(int(ms), 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def srt(parcalar):
    return "\n".join(f"{i}\n{srt_zaman(p['startMs'])} --> {srt_zaman(p['endMs'])}\n{p['text']}\n"
                     for i, p in enumerate(parcalar, 1))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--words", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--slug", default="video")
    ap.add_argument("--kaydir", type=float, default=0.0)
    a = ap.parse_args()
    parcalar = zamanla(grupla(oku(a.words)), a.kaydir)
    os.makedirs(a.out, exist_ok=True)
    with open(os.path.join(a.out, "captions.json"), "w", encoding="utf-8") as fh:
        json.dump(parcalar, fh, ensure_ascii=False, indent=1)
    with open(os.path.join(a.out, f"subtitles_{a.slug}_en.srt"), "w", encoding="utf-8") as fh:
        fh.write(srt(parcalar))
    uzun = [p["text"] for p in parcalar if len(p["text"]) > EN_COK_KARAKTER]
    print(f"{len(parcalar)} grup yazıldı" + (f"; 12 karakteri aşan tek kelimeler: {uzun[:5]}" if uzun else ""))


if __name__ == "__main__":
    main()
