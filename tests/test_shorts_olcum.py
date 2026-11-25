import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(HERE, "..", "whatif-studyo", "araclar", "shorts_olcum.py")
sys.path.insert(0, os.path.dirname(TOOL))

try:
    import numpy  # noqa: F401
    import shorts_olcum  # noqa: E402
    HAVE_NUMPY = True
except ImportError:  # CI'da numpy yoksa yalnız ilgili testler atlanır
    HAVE_NUMPY = False

HAVE_FFMPEG = shutil.which("ffmpeg") is not None and shutil.which("ffprobe") is not None


def words_file(words):
    f = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8")
    json.dump(words, f)
    f.close()
    return f.name


@unittest.skipUnless(HAVE_NUMPY, "numpy yok")
class KelimeTest(unittest.TestCase):
    def test_hiz_ve_duraklama(self):
        # 60 sn'de 220 kelime, eşit aralıklı, bir tane 600 ms duraklama
        w, t = [], 0.1
        for i in range(220):
            w.append({"w": f"k{i}", "s": round(t, 3), "e": round(t + 0.2, 3)})
            t += 0.27 + (0.6 if i == 100 else 0.0)
        r = shorts_olcum.word_metrics(words_file(w), 60.0)
        self.assertEqual(r["kelime"], 220)
        self.assertEqual(r["kelime_dk"], 220)
        self.assertEqual(r["duraklama_250ms_ustu"], 1)
        self.assertGreaterEqual(r["en_uzun_duraklama_ms"], 600)
        self.assertEqual(r["duraklama_medyan_ms"], 70)  # 270 ms adım - 200 ms kelime

    def test_degerlendirme(self):
        r = {"sure_sn": 60.0, "lufs": -14.0, "tepe_dbtp": -1.5, "ilk_gorsel_degisim_sn": 0.2,
             "en_uzun_donma_sn": 0.2, "en_kisa_kesme_araligi_sn": 5.0, "kelime_dk": 225,
             "kelime_dk_konusurken": 285, "ilk_kelime_sn": 0.1, "son_kelimeden_sonra_sn": 0.3,
             "en_uzun_duraklama_ms": 300}
        self.assertTrue(all(s == "PASS" for s, _, _ in shorts_olcum.judge(r)))
        r["lufs"] = -20.0
        self.assertIn("FAIL", [s for s, _, _ in shorts_olcum.judge(r)])

    def test_uyarilar(self):
        r = {"sure_sn": 60.0, "lufs": -14.0, "tepe_dbtp": -1.5, "ilk_gorsel_degisim_sn": 0.2,
             "en_uzun_donma_sn": 0.2, "sert_kesme": 14, "en_kisa_kesme_araligi_sn": 1.0,
             "kelime_dk": 225, "kelime_dk_konusurken": 285, "ilk_kelime_sn": 0.1,
             "son_kelimeden_sonra_sn": 0.3, "en_uzun_duraklama_ms": 300, "duraklama_medyan_ms": 280}
        res = {label: st for st, label, _ in shorts_olcum.judge(r)}
        self.assertEqual(res["Sert kesme sayısı"], "WARN")
        self.assertEqual(res["Duraklama medyanı (ms)"], "WARN")
        self.assertNotIn("FAIL", res.values())  # uyarılar teslimi durdurmaz


@unittest.skipUnless(HAVE_NUMPY and HAVE_FFMPEG, "numpy ya da ffmpeg yok")
class VideoTest(unittest.TestCase):
    def test_kesme_ve_donma(self):
        d = tempfile.mkdtemp()
        out = os.path.join(d, "t.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y",
                        "-f", "lavfi", "-i", "testsrc2=s=540x960:r=30:d=4",
                        "-f", "lavfi", "-i", "color=c=blue:s=540x960:r=30:d=3",
                        "-f", "lavfi", "-i", "sine=f=220:d=7",
                        "-filter_complex", "[0:v][1:v]concat=n=2:v=1[v]", "-map", "[v]", "-map", "2:a",
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "30", "-c:a", "aac", "-shortest", out],
                       check=True)
        m = shorts_olcum.video_metrics(out)
        self.assertEqual(m["sert_kesme"], 1)
        self.assertAlmostEqual(m["kesmeler"][0], 4.0, delta=0.1)
        self.assertGreaterEqual(m["en_uzun_donma_sn"], 2.5)  # mavi ekran donma sayılmalı

    def test_kamera_hareketi(self):
        # 1. ile 2. saniye arasında hızlı yatay kaydırma: tek hareket, kesme yok
        d = tempfile.mkdtemp()
        out = os.path.join(d, "pan.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "testsrc2=s=3000x960:r=30:d=4",
                        "-vf", "crop=540:960:x='if(between(t,1,2),(t-1)*2400,if(gt(t,2),2400,0))':y=0",
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", out], check=True)
        m = shorts_olcum.video_metrics(out)
        self.assertEqual(m["sert_kesme"], 0)
        self.assertEqual(m["hizli_kamera_hareketi"], 1)
        self.assertAlmostEqual(m["hareketler"][0][0], 1.0, delta=0.15)


if __name__ == "__main__":
    unittest.main()


def _renkli_kare(seed=3):
    """Gök gradyanı + konturlu renkli kutular: referans bandına düşmesi beklenen yapay kare."""
    import numpy as np
    rng = np.random.default_rng(seed)
    k = np.zeros((960, 540, 3), dtype=np.float64)
    k[:] = np.linspace([70, 110, 190], [240, 170, 110], 960)[:, None, :]
    for _ in range(60):
        h, w = rng.integers(30, 160, 2)
        y, x = rng.integers(0, 960 - h), rng.integers(0, 540 - w)
        k[y:y + h, x:x + w] = 0
        k[y + 6:y + h - 6, x + 6:x + w - 6] = rng.integers(40, 255, 3)
    return k.astype(np.uint8)


@unittest.skipUnless(HAVE_NUMPY, "numpy yok")
class GorselTest(unittest.TestCase):
    def test_karanlik_duz_kare_uyari_verir(self):
        import numpy as np
        g = shorts_olcum.gorsel_ozet([shorts_olcum.kare_istatistik(np.full((960, 540, 3), 20, np.uint8))] * 6)
        self.assertAlmostEqual(g["parlaklik"], 20, delta=0.5)
        self.assertEqual(g["karanlik_oran"], 1.0)
        self.assertEqual(g["detay"], 0.0)
        res = {label: st for st, label, _ in shorts_olcum.gorsel_judge(g)}
        for anahtar in ("parlaklık", "kontrast", "renklilik", "karanlık", "detay", "düz alan", "sıcak/soğuk"):
            self.assertTrue(any(anahtar in l and st == "WARN" for l, st in res.items()), anahtar)
        self.assertNotIn("FAIL", res.values())  # görsel ölçüler yalnız uyarır

    def test_renkli_detayli_kare_gecer(self):
        x = shorts_olcum.kare_istatistik(_renkli_kare())
        self.assertTrue(55 <= x["parlaklik"] <= 165, x)
        self.assertGreaterEqual(x["kontrast"], 38)
        self.assertGreaterEqual(x["renklilik"], 34)
        self.assertGreaterEqual(x["detay"], 0.08)
        self.assertLessEqual(x["duzluk"], 0.70)

    def test_altyazi_bandi_dislanir(self):
        import numpy as np
        k = np.full((960, 540, 3), 128, np.uint8)
        for y in range(640, 728, 16):  # yalnız altyazı bandında siyah-beyaz şeritler (yazı benzeri)
            k[y:y + 8, 60:480] = 255
            k[y + 8:y + 16, 60:480] = 0
        self.assertEqual(shorts_olcum.kare_istatistik(k)["detay"], 0.0)
        self.assertGreater(shorts_olcum.kare_istatistik(k, bant=None)["detay"], 0.0)

    def test_sicak_soguk_degisimi(self):
        import numpy as np
        sicak = np.zeros((960, 540, 3), np.uint8); sicak[:] = (220, 150, 80)
        soguk = np.zeros((960, 540, 3), np.uint8); soguk[:] = (70, 110, 200)
        degisken = shorts_olcum.gorsel_ozet([shorts_olcum.kare_istatistik(k) for k in [sicak, soguk] * 3])
        tekduze = shorts_olcum.gorsel_ozet([shorts_olcum.kare_istatistik(sicak)] * 6)
        self.assertGreaterEqual(degisken["sicak_soguk_degisim"], 15)
        self.assertLess(tekduze["sicak_soguk_degisim"], 15)

    def test_yanlis_boyut_reddedilir(self):
        import numpy as np
        with self.assertRaises(ValueError):
            shorts_olcum.kare_istatistik(np.zeros((480, 270, 3), np.uint8))

    @unittest.skipUnless(HAVE_FFMPEG, "ffmpeg yok")
    def test_video_kareleri_olceklenir(self):
        d = tempfile.mkdtemp()
        try:
            v = os.path.join(d, "renk.mp4")
            subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=c=0x808080:s=1080x1920:d=2:r=30",
                            "-pix_fmt", "yuv420p", v], check=True)
            g = shorts_olcum.gorsel_metrics(v, 2.0)["gorsel"]
            self.assertEqual(g["kare_sayisi"], 11)
            self.assertAlmostEqual(g["parlaklik"], 128, delta=4)
            png = os.path.join(d, "k.png")
            subprocess.run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=c=0x202020:s=1080x1920:d=0.1", "-frames:v", "1", png], check=True)
            k = shorts_olcum.png_kareleri([png])
            self.assertEqual(len(k), 1)
            self.assertEqual(shorts_olcum.kare_istatistik(k[0])["karanlik_oran"], 1.0)
        finally:
            shutil.rmtree(d)
