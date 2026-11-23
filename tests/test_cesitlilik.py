import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(HERE, "..", "whatif-studyo", "araclar", "cesitlilik.py")
sys.path.insert(0, os.path.dirname(TOOL))
import cesitlilik  # noqa: E402

HEAD = "| bolum | tarih | ana_gorunus | sets | wardrobe | accessories | looks | motions | sfx_beds | palette | yeni | tekrar_izinli |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n"
NEW_OK = ", ".join(
    [f"sets:s{i}" for i in range(3)] + [f"wardrobe:w{i}" for i in range(4)] + [f"accessories:a{i}" for i in range(6)]
    + [f"motions:m{i}" for i in range(4)] + ["fx:f0"] + [f"sfx:x{i}" for i in range(8)]
)


def row(slug, look, sets, ward, acc, new=NEW_OK, allowed=""):
    return f"| {slug} | 2026-11-01 | {look} | {sets} | {ward} | {acc} | hair1 | run, jump | bed1 | p1 | {new} | {allowed} |\n"


def write(text):
    f = tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8")
    f.write("# Kullanım günlüğü\n\n" + HEAD + text)
    f.close()
    return f.name


class CesitlilikTest(unittest.TestCase):
    def run_tool(self, path, slug):
        return subprocess.run([sys.executable, TOOL, "--gunluk", path, "--bolum", slug], capture_output=True, text=True)

    def test_first_episode_passes(self):
        p = write(row("ep1", "lookA", "flat", "hoodie", "phone"))
        r = self.run_tool(p, "ep1")
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_repeated_lead_look_fails(self):
        p = write(row("ep1", "lookA", "flat", "hoodie", "phone") + row("ep2", "lookA", "lab", "coat", "badge"))
        r = self.run_tool(p, "ep2")
        self.assertEqual(r.returncode, 1)
        self.assertIn("ana karakter", r.stdout)

    def test_recent_set_fails_unless_allowed(self):
        base = row("ep1", "lookA", "flat", "hoodie", "phone")
        p = write(base + row("ep2", "lookB", "flat", "coat", "badge"))
        self.assertEqual(self.run_tool(p, "ep2").returncode, 1)
        p = write(base + row("ep2", "lookB", "flat", "coat", "badge", allowed="flat"))
        rows = cesitlilik.read_table(p)
        fails, _ = cesitlilik.check(rows, "ep2")
        self.assertFalse([f for f in fails if f.startswith("sets:") and "son 3" in f])

    def test_minimum_new_items(self):
        p = write(row("ep1", "lookA", "flat", "hoodie", "phone", new="sets:s1"))
        r = self.run_tool(p, "ep1")
        self.assertEqual(r.returncode, 1)
        self.assertIn("yeni wardrobe", r.stdout)

    def test_bad_table(self):
        p = write("| ep1 | eksik |\n")
        self.assertEqual(self.run_tool(p, "ep1").returncode, 2)

    def test_template_parses(self):
        t = os.path.join(HERE, "..", "whatif-studyo", "sablonlar", "Kullanim-Gunlugu.md")
        self.assertEqual(cesitlilik.read_table(t), [])


if __name__ == "__main__":
    unittest.main()
