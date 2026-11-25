import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "whatif-studyo", "araclar"))
import altyazi  # noqa: E402


def k(metin, t0=0.0, adim=0.3):
    out, t = [], t0
    for w in metin.split():
        out.append((w, round(t, 3), round(t + 0.25, 3)))
        t += adim
    return out


class GruplamaTest(unittest.TestCase):
    def test_en_cok_iki_kelime_ve_noktalama(self):
        g = [t for t, _, _ in altyazi.grupla(k("He scans a ticket. The screen says yes."))]
        self.assertEqual(g, ["He scans", "a ticket.", "The screen", "says yes."])
        self.assertTrue(all(len(x.split()) <= 2 for x in g))

    def test_on_iki_karakter_siniri(self):
        g = [t for t, _, _ in altyazi.grupla(k("unbelievable winnings"))]
        self.assertEqual(g, ["unbelievable", "winnings"])

    def test_sayi_birimiyle_kalir(self):
        g = [t for t, _, _ in altyazi.grupla(k("worth a million dollars"))]
        self.assertIn("a million", g)

    def test_sessizlikte_kapanir(self):
        kel = [("Wait", 0.0, 0.3), ("now", 1.2, 1.5)]
        p = altyazi.zamanla(altyazi.grupla(kel))
        self.assertEqual(len(p), 2)
        self.assertEqual(p[0]["endMs"], 300)  # 0,9 sn sessizlikte altyazı görünmez

    def test_bitisik_gruplar_arada_bosluk_birakmaz(self):
        p = altyazi.zamanla(altyazi.grupla(k("one two three four")), kaydir=5.0)
        self.assertEqual(p[0]["startMs"], 5000)
        self.assertEqual(p[0]["endMs"], p[1]["startMs"])

    def test_srt_bicimi(self):
        s = altyazi.srt([{"text": "Hi.", "startMs": 3723004, "endMs": 3724000}])
        self.assertIn("01:02:03,004 --> 01:02:04,000", s)


if __name__ == "__main__":
    unittest.main()
