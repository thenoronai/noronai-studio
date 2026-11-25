#!/usr/bin/env python3
"""Shorts ölçüm aracı: bitmiş bir Shorts'u referans hedeflerle karşılaştırır.

Kullanım:
    python3 araclar/shorts_olcum.py --video final.mp4 [--words voice/<slug>/words.json] [--json rapor.json]
    python3 araclar/shorts_olcum.py --kareler kalite/*.png      # yalnız görsel: render önizleme kareleri

Ölçtükleri (yalnız ffmpeg/ffprobe ve numpy gerekir):
  - süre, çözünürlük, kare hızı
  - ses: entegre yükseklik (LUFS), gerçek tepe (dBTP), LRA
  - kurgu: sert kesmeler (zaman, sayı, ilk kesme), hızlı kamera hareketleri, açılıştaki ilk
    görsel değişim, hareketsiz bekleme (donma) aralıkları
  - anlatım (words.json varsa): kelime/dk (toplam ve konuşurken), ilk kelimenin başlangıcı,
    son kelimeden sonra kalan süre, duraklama medyanı, 250 ms'yi geçen duraklamalar, en uzun duraklama
  - görsel (11 kare, videonun %4–94'ü): parlaklık, kontrast, renklilik, karanlık alan oranı, detay
    yoğunluğu, düzlük ve sahneler arası sıcak/soğuk ışık değişimi (RENDER-RECETESI.md 8)

words.json biçimi: [{"w": "If", "s": 0.12, "e": 0.25}, ...]  (saniye). "word"/"start"/"end" anahtarları da kabul edilir.

Hedefler SHORTS-FORMULU.md bölüm 8'deki ölçümlerden gelir (referans kanalın 33 Short'u, Ekim–Kasım 2026).
Çıkış kodu: FAIL varsa 1, yoksa 0.
"""
import argparse
import json
import re
import subprocess
import sys

import numpy as np

# ---- Hedefler (SHORTS-FORMULU.md "Ölçülebilir hedefler" tablosu ile aynı tutun) ----
HEDEF = {
    "sure_sn": (38, 67),            # 38–66 sn arası medyan ~10 Mn; 31–35 sn ve 68–78 sn videolar düştü
    "lufs": (-15.0, -13.0),         # YouTube'un ölçtüğü içerik yüksekliği -14,0/-14,1
    "tepe_dbtp_max": -1.0,
    "kelime_dk": (190, 250),        # referans medyanı 210 (P10–P90 186–231)
    "kelime_dk_konusurken": (240, 305),  # referans medyanı 279 (P10–P90 240–311)
    "ilk_kelime_sn_max": 0.4,       # ses ilk karelerde başlar
    "son_kelimeden_sonra_sn_max": 0.8,  # video son kelimeyle biter
    "duraklama_medyan_ms_max": 200,  # referans medyanı 160 ms (P90 170)
    "en_uzun_duraklama_ms_max": 450,  # referansta 400 ms'yi geçen duraklama video başına 0–1
    "ilk_gorsel_degisim_sn_max": 1.5,  # ilk 1,5 sn içinde kamera/karakter hareketi ya da kesme
    "donma_sn_max": 0.5,            # her bekleme yavaşça iten bir kamera taşır
    "sert_kesme_max": 10,           # referans medyanı 1 (P90 6, en çok 11)
    "sert_kesme_aralik_sn_min": 3.0,  # son 10 sn dışında; finaldeki hızlanan kesmeler serbest
    "hizli_kamera_hareketi_min": 10,  # referans medyanı 19 (P10–P90 10–26); her biri bir sesle başlar
}
HAREKET_ESIGI = 12.0  # 54x96 gri karede ortalama kare farkı; referans ölçümüyle aynı eşik

# ---- Görsel hedefler (RENDER-RECETESI.md 8 ile aynı tutun) ----
# Referans: 18 Short x 11 kare, video başına medyan (25 Kasım 2026). Kare 540x960'a indirilir,
# 4x4 kutu ortalamasıyla 135x240 yapılır, altyazı bandı (yüksekliğin %64–77'si) dışlanır.
HEDEF_GORSEL = {
    "parlaklik": (55, 165),         # ortalama luma 0-255; referans 55–161 (medyan 112); kanal 28–51
    "kontrast_min": 38,             # luma std; referans 38,6–61,6 (medyan 48,7); kanal 20–38
    "renklilik_min": 34,            # Hasler–Süsstrunk; referans 34,8–90 (medyan 69); kanal 21–34
    "karanlik_oran_max": 0.25,      # luma<35 piksel oranı; referans medyanı 0,04 (yalnız iki karanlık temalı video 0,44–0,47)
    "detay_min": 0.08,              # Sobel>160 piksel oranı; referans 0,06–0,21 (medyan 0,12); kanal 0,04–0,12
    "duzluk_max": 0.70,             # Sobel<20 piksel oranı; referans 0,45–0,67; kanal 0,79–0,87
    "sicak_soguk_degisim_min": 15,  # kare başı ortalama (R−B) std'si; referans 15,7–75 (medyan 42); kanal 11–20
}
GORSEL_ORANLAR = [0.04, 0.13, 0.22, 0.31, 0.40, 0.49, 0.58, 0.67, 0.76, 0.85, 0.94]
ALTYAZI_BANDI = (0.64, 0.77)


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.stdout + p.stderr


def probe(video):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
               "stream=width,height,r_frame_rate:format=duration", "-of", "json", video])
    j = json.loads(out[out.index("{"):])
    st = j["streams"][0]
    num, den = st["r_frame_rate"].split("/")
    return {"genislik": st["width"], "yukseklik": st["height"], "fps": round(float(num) / float(den), 2),
            "sure_sn": round(float(j["format"]["duration"]), 2)}


def loudness(video):
    out = run(["ffmpeg", "-nostats", "-i", video, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"])
    tail = out[out.rfind("Summary:"):] if "Summary:" in out else out
    def grab(pat):
        m = re.search(pat, tail)
        return float(m.group(1)) if m else None
    return {"lufs": grab(r"I:\s+(-?[\d.]+) LUFS"), "lra": grab(r"LRA:\s+(-?[\d.]+) LU"),
            "tepe_dbtp": grab(r"Peak:\s+(-?[\d.]+) dBFS")}


def frames_gray(video, fps=30, w=54, h=96):
    """Küçük gri kareler (hareket ve kesme ölçümü için)."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vf",
                          f"fps={fps},scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True).stdout
    n = len(raw) // (w * h)
    return np.frombuffer(raw[: n * w * h], dtype=np.uint8).reshape(n, h, w).astype(np.float32), fps


def video_metrics(video):
    F, fps = frames_gray(video)
    if len(F) < 3:
        return {}
    d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))            # kare farkı
    hist = np.stack([np.histogram(f, bins=32, range=(0, 256))[0] / f.size for f in F])
    hd = np.abs(np.diff(hist, axis=0)).sum(axis=1)
    cuts = []
    for i in range(1, len(d) - 1):
        nb = max(d[i - 1], d[i + 1])
        if (d[i] > 16 and hd[i] > 0.2 and d[i] > 2.5 * nb) or (d[i] > 38 and hd[i] > 0.35 and d[i] > 1.6 * nb):
            cuts.append(round((i + 1) / fps, 2))
    # ilk görsel değişim: ilk karede başlayan durgunluk ne zaman bozuluyor
    first_change = next((round((i + 1) / fps, 2) for i, v in enumerate(d) if v > 1.2), None)
    # donma: kare farkı 0.35'in altında kalan ardışık aralıklar
    still = d < 0.35
    holds, i = [], 0
    while i < len(still):
        if still[i]:
            j = i
            while j + 1 < len(still) and still[j + 1]:
                j += 1
            dur = (j - i + 1) / fps
            if dur >= 0.3:
                holds.append((round(i / fps, 2), round(dur, 2)))
            i = j + 1
        else:
            i += 1
    son = len(F) / fps - 10.0
    ic = [c for c in cuts if c < son]               # finaldeki hızlanan kesmeler aralık kuralına girmez
    gaps = np.diff([0.0] + ic) if ic else np.array([])
    # hızlı kamera hareketi: kesme olmayan, en az 3 kare süren yüksek kare farkı (54x96 gri, 0-255)
    cut_idx = {int(round(c * fps)) - 1 for c in cuts}
    fast = [(v >= HAREKET_ESIGI and i not in cut_idx) for i, v in enumerate(d)]
    moves, i = [], 0
    while i < len(fast):
        if fast[i]:
            j = i
            while j + 1 < len(fast) and (fast[j + 1] or (j + 2 < len(fast) and fast[j + 2])):
                j += 1
            if j - i + 1 >= 3:
                moves.append((round(i / fps, 2), round((j - i + 1) / fps, 2)))
            i = j + 1
        else:
            i += 1
    return {"sert_kesme": len(cuts), "kesmeler": cuts, "ilk_kesme_sn": cuts[0] if cuts else None,
            "en_kisa_kesme_araligi_sn": round(float(gaps[1:].min()), 2) if len(gaps) > 1 else None,
            "ilk_gorsel_degisim_sn": first_change, "donmalar": holds,
            "hizli_kamera_hareketi": len(moves), "hareketler": moves,
            "en_uzun_donma_sn": max((h[1] for h in holds), default=0.0),
            "hareket_ortalama": round(float(d.mean()), 2)}


def kare_istatistik(rgb, bant=ALTYAZI_BANDI):
    """540x960x3 (uint8) kare -> görsel ölçüler. Referans ölçümüyle birebir aynı formüller."""
    a = np.asarray(rgb, dtype=np.float64)[..., :3]
    H, W = a.shape[:2]
    if (H, W) != (960, 540):
        raise ValueError(f"kare 540x960 olmalı, geldi {W}x{H}")
    k = a.reshape(H // 4, 4, W // 4, 4, 3).mean(axis=(1, 3))
    h, w = k.shape[:2]
    R, G, B = k[..., 0], k[..., 1], k[..., 2]
    Y = 0.2126 * R + 0.7152 * G + 0.0722 * B
    satir = np.arange(h)
    tut = ~((satir >= bant[0] * h) & (satir < bant[1] * h)) if bant else np.ones(h, bool)
    m = np.repeat(tut[:, None], w, axis=1)
    y, r, g, b = Y[m], R[m], G[m], B[m]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    s = np.where(mx > 0, (mx - mn) / np.where(mx > 0, mx, 1), 0)
    rg, yb = r - g, 0.5 * (r + g) - b
    gx = (-Y[:-2, :-2] - 2 * Y[1:-1, :-2] - Y[2:, :-2] + Y[:-2, 2:] + 2 * Y[1:-1, 2:] + Y[2:, 2:])
    gy = (-Y[:-2, :-2] - 2 * Y[:-2, 1:-1] - Y[:-2, 2:] + Y[2:, :-2] + 2 * Y[2:, 1:-1] + Y[2:, 2:])
    mag = np.hypot(gx, gy)[tut[:-2] & tut[1:-1] & tut[2:]]
    return {"parlaklik": float(y.mean()), "kontrast": float(y.std()), "doygunluk": float(s.mean()),
            "renklilik": float(np.hypot(rg.std(), yb.std()) + 0.3 * np.hypot(rg.mean(), yb.mean())),
            "sicaklik": float((r - b).mean()), "karanlik_oran": float((y < 35).mean()),
            "parlak_oran": float((y > 220).mean()), "detay": float((mag > 160).mean()), "duzluk": float((mag < 20).mean())}


def gorsel_ozet(istatistikler):
    """Kare ölçülerinden video özeti: medyanlar + sahneler arası sıcak/soğuk değişimi."""
    if not istatistikler:
        return {}
    med = lambda key: round(float(np.median([x[key] for x in istatistikler])), 3)
    ozet = {k: med(k) for k in ("parlaklik", "kontrast", "doygunluk", "renklilik", "karanlik_oran", "parlak_oran", "detay", "duzluk")}
    ozet["sicak_soguk_degisim"] = round(float(np.std([x["sicaklik"] for x in istatistikler])), 1)
    ozet["kare_sayisi"] = len(istatistikler)
    return ozet


def video_kareleri(video, sure):
    """Videonun %4–94'ünden 11 kareyi 540x960 RGB olarak döndürür."""
    kareler = []
    for f in GORSEL_ORANLAR:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{sure * f:.3f}", "-i", video, "-frames:v", "1",
                              "-vf", "scale=540:960:flags=area,format=rgb24", "-f", "rawvideo", "-"], capture_output=True).stdout
        if len(raw) >= 540 * 960 * 3:
            kareler.append(np.frombuffer(raw[: 540 * 960 * 3], dtype=np.uint8).reshape(960, 540, 3))
    return kareler


def gorsel_metrics(video, sure):
    return {"gorsel": gorsel_ozet([kare_istatistik(k) for k in video_kareleri(video, sure)])}


def png_kareleri(yollar):
    """Render önizleme kareleri (PNG/JPG) -> 540x960 RGB; ffmpeg ile ölçeklenir (Pillow gerekmez)."""
    kareler = []
    for p in yollar:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-frames:v", "1", "-vf", "scale=540:960:flags=area,format=rgb24",
                              "-f", "rawvideo", "-"], capture_output=True).stdout
        if len(raw) >= 540 * 960 * 3:
            kareler.append(np.frombuffer(raw[: 540 * 960 * 3], dtype=np.uint8).reshape(960, 540, 3))
    return kareler


def word_metrics(path, duration):
    with open(path, encoding="utf-8") as fh:
        W = json.load(fh)
    norm = []
    for x in W:
        w = x.get("w", x.get("word", ""))
        s = float(x.get("s", x.get("start", 0)))
        e = float(x.get("e", x.get("end", s)))
        norm.append((w, s, e))
    if not norm:
        return {}
    speak = sum(max(0.0, e - s) for _, s, e in norm)
    pauses = [round((norm[i + 1][1] - norm[i][2]) * 1000) for i in range(len(norm) - 1)]
    long_p = [p for p in pauses if p > 250]
    span = norm[-1][2] - norm[0][1]
    return {"kelime": len(norm), "kelime_dk": round(len(norm) / duration * 60),
            "kelime_dk_konusurken": round(len(norm) / max(1e-6, span - sum(p for p in long_p) / 1000) * 60),
            "ilk_kelime_sn": round(norm[0][1], 2), "son_kelimeden_sonra_sn": round(duration - norm[-1][2], 2),
            "duraklama_250ms_ustu": len(long_p), "en_uzun_duraklama_ms": max(pauses, default=0),
            "duraklama_medyan_ms": int(np.median([p for p in pauses if p >= 60])) if any(p >= 60 for p in pauses) else 0,
            "konusma_suresi_sn": round(speak, 1)}


def judge(r):
    out = []
    def rng(key, val, lo, hi, label):
        if val is None:
            return
        ok = lo <= val <= hi
        out.append(("PASS" if ok else "FAIL", label, f"{val} (hedef {lo}–{hi})"))
    def mx(key, val, lim, label, warn=False):
        if val is None:
            return
        ok = val <= lim
        out.append(("PASS" if ok else ("WARN" if warn else "FAIL"), label, f"{val} (en çok {lim})"))
    rng("sure_sn", r["sure_sn"], *HEDEF["sure_sn"], "Süre (sn)")
    rng("lufs", r.get("lufs"), *HEDEF["lufs"], "Ses yüksekliği (LUFS)")
    mx("tepe", r.get("tepe_dbtp"), HEDEF["tepe_dbtp_max"], "Gerçek tepe (dBTP)")
    mx("ilk_degisim", r.get("ilk_gorsel_degisim_sn"), HEDEF["ilk_gorsel_degisim_sn_max"], "İlk görsel değişim (sn)")
    mx("donma", r.get("en_uzun_donma_sn"), HEDEF["donma_sn_max"], "En uzun hareketsiz bekleme (sn)", warn=True)
    if r.get("hizli_kamera_hareketi") is not None:
        ok = r["hizli_kamera_hareketi"] >= HEDEF["hizli_kamera_hareketi_min"]
        out.append(("PASS" if ok else "WARN", "Hızlı kamera hareketi (adet)",
                    f"{r['hizli_kamera_hareketi']} (en az {HEDEF['hizli_kamera_hareketi_min']}; geçişlerin çoğu kamera hareketi)"))
    if r.get("sert_kesme") is not None:
        mx("kesme", r["sert_kesme"], HEDEF["sert_kesme_max"], "Sert kesme sayısı", warn=True)
    if r.get("en_kisa_kesme_araligi_sn") is not None:
        ok = r["en_kisa_kesme_araligi_sn"] >= HEDEF["sert_kesme_aralik_sn_min"]
        out.append(("PASS" if ok else "WARN", "Sert kesmeler arası en kısa aralık (sn)",
                    f"{r['en_kisa_kesme_araligi_sn']} (en az {HEDEF['sert_kesme_aralik_sn_min']}, son 10 sn hariç; sık kesme yerine kamera geçişi)"))
    if "kelime_dk" in r:
        rng("wpm", r["kelime_dk"], *HEDEF["kelime_dk"], "Kelime/dk (toplam)")
        rng("wpmv", r["kelime_dk_konusurken"], *HEDEF["kelime_dk_konusurken"], "Kelime/dk (konuşurken)")
        mx("ilk", r["ilk_kelime_sn"], HEDEF["ilk_kelime_sn_max"], "İlk kelime (sn)")
        mx("son", r["son_kelimeden_sonra_sn"], HEDEF["son_kelimeden_sonra_sn_max"], "Son kelimeden sonra (sn)")
        mx("pz", r["en_uzun_duraklama_ms"], HEDEF["en_uzun_duraklama_ms_max"], "En uzun duraklama (ms)", warn=True)
        if r.get("duraklama_medyan_ms"):
            mx("pzm", r["duraklama_medyan_ms"], HEDEF["duraklama_medyan_ms_max"], "Duraklama medyanı (ms)", warn=True)
    out.extend(gorsel_judge(r.get("gorsel")))
    return out


def gorsel_judge(g):
    """Görsel ölçüler kural değil yön göstericidir: hepsi WARN düzeyindedir."""
    out = []
    if not g:
        return out
    H = HEDEF_GORSEL
    def warn(ok, label, val):
        out.append(("PASS" if ok else "WARN", label, val))
    lo, hi = H["parlaklik"]
    warn(lo <= g["parlaklik"] <= hi, "Görsel: parlaklık (luma medyanı)", f"{g['parlaklik']:.1f} (hedef {lo}–{hi})")
    warn(g["kontrast"] >= H["kontrast_min"], "Görsel: kontrast (luma std)", f"{g['kontrast']:.1f} (en az {H['kontrast_min']})")
    warn(g["renklilik"] >= H["renklilik_min"], "Görsel: renklilik", f"{g['renklilik']:.1f} (en az {H['renklilik_min']})")
    warn(g["karanlik_oran"] <= H["karanlik_oran_max"], "Görsel: karanlık alan oranı",
         f"{g['karanlik_oran']:.3f} (en çok {H['karanlik_oran_max']}; karanlık temalı bölümde bilerek aşılabilir)")
    warn(g["detay"] >= H["detay_min"], "Görsel: detay yoğunluğu", f"{g['detay']:.3f} (en az {H['detay_min']}; set dekoru seyrek)" if g["detay"] < H["detay_min"] else f"{g['detay']:.3f} (en az {H['detay_min']})")
    warn(g["duzluk"] <= H["duzluk_max"], "Görsel: düz alan oranı", f"{g['duzluk']:.3f} (en çok {H['duzluk_max']})")
    if g.get("kare_sayisi", 0) >= 5:
        warn(g["sicak_soguk_degisim"] >= H["sicak_soguk_degisim_min"], "Görsel: sahneler arası sıcak/soğuk değişimi",
             f"{g['sicak_soguk_degisim']:.1f} (en az {H['sicak_soguk_degisim_min']}; mekân ve ışık hazırı değişmeli)")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video")
    ap.add_argument("--words")
    ap.add_argument("--json")
    ap.add_argument("--kareler", nargs="+", help="yalnız görsel ölçüm: render önizleme kareleri (PNG/JPG)")
    ap.add_argument("--gorsel-yok", action="store_true", help="videoda görsel ölçümü atla")
    a = ap.parse_args()
    if a.kareler:
        ist = [kare_istatistik(k) for k in png_kareleri(a.kareler)]
        print(f"# Görsel ölçüm: {len(ist)} kare")
        for yol, x in zip(a.kareler, ist):
            print(f"{yol}: parlaklık {x['parlaklik']:.0f} · kontrast {x['kontrast']:.0f} · renklilik {x['renklilik']:.0f} · "
                  f"karanlık {x['karanlik_oran']:.2f} · detay {x['detay']:.3f} · düzlük {x['duzluk']:.2f} · sıcaklık {x['sicaklik']:+.0f}")
        g = gorsel_ozet(ist)
        res = gorsel_judge(g)
        for st, label, val in res:
            print(f"[{st}] {label}: {val}")
        if a.json:
            with open(a.json, "w", encoding="utf-8") as fh:
                json.dump({"gorsel": g, "kareler": ist, "sonuc": res}, fh, ensure_ascii=False, indent=1)
        sys.exit(0)
    if not a.video:
        ap.error("--video ya da --kareler gerekli")
    r = probe(a.video)
    r.update(loudness(a.video))
    r.update(video_metrics(a.video))
    if not a.gorsel_yok:
        r.update(gorsel_metrics(a.video, r["sure_sn"]))
    if a.words:
        r.update(word_metrics(a.words, r["sure_sn"]))
    res = judge(r)
    print(f"# Shorts ölçümü: {a.video}")
    print(f"{r['genislik']}x{r['yukseklik']} · {r['fps']} fps · {r['sure_sn']} sn · sert kesme {r.get('sert_kesme')} · "
          f"ilk kesme {r.get('ilk_kesme_sn')} sn · hızlı kamera hareketi {r.get('hizli_kamera_hareketi')}")
    for st, label, val in res:
        print(f"[{st}] {label}: {val}")
    if r.get("donmalar"):
        print("Hareketsiz beklemeler (başlangıç sn, süre sn):", r["donmalar"][:12])
    if a.json:
        with open(a.json, "w", encoding="utf-8") as fh:
            json.dump({"olcum": r, "sonuc": res}, fh, ensure_ascii=False, indent=1)
    sys.exit(1 if any(s == "FAIL" for s, _, _ in res) else 0)


if __name__ == "__main__":
    main()
