#!/usr/bin/env python3
"""Tekrar kontrolü (no-repeat check) for the What If studio.

Reads the usage log table in the vault (Studyo/Kullanim-Gunlugu.md) and checks one episode
against the earlier ones:

  1. the lead's full look never repeats an earlier episode
  2. no set, wardrobe piece, accessory or ambience bed from the previous 3 episodes,
     unless listed in that episode's `tekrar_izinli` column
  3. the episode adds at least the minimum new library items per category
  4. ID overlap with any single earlier episode stays under 25% per category

Standard library only. Exit code 0 = pass, 1 = fail, 2 = input error.

  python3 cesitlilik.py --gunluk <vault>/Studyo/Kullanim-Gunlugu.md --bolum <slug>
"""
import argparse
import sys

CATS = ["sets", "wardrobe", "accessories", "looks", "motions", "sfx_beds", "palette"]
RECENT_LOCKED = ["sets", "wardrobe", "accessories", "sfx_beds"]
MIN_NEW = {"sets": 3, "wardrobe": 4, "accessories": 6, "motions": 4, "fx": 1, "sfx": 8}
NEW_ALIASES = {"props": "accessories"}   # props count toward the accessories/props minimum
OVERLAP_MAX = 0.25
RECENT_N = 3


def ids(cell):
    return {x.strip() for x in cell.split(",") if x.strip() and x.strip() != "-"}


def read_table(path):
    rows, header = [], None
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line.startswith("|"):
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if header is None:
                header = cells
                continue
            if all(set(c) <= set("-: ") for c in cells):
                continue
            if len(cells) != len(header):
                raise ValueError(f"satır sütun sayısı tutmuyor: {line}")
            rows.append(dict(zip(header, cells)))
    if header is None:
        raise ValueError("tablo bulunamadı")
    missing = [c for c in ["bolum", "ana_gorunus", "yeni", "tekrar_izinli"] + CATS if c not in header]
    if missing:
        raise ValueError("eksik sütunlar: " + ", ".join(missing))
    return rows


def check(rows, slug):
    idx = next((i for i, r in enumerate(rows) if r["bolum"] == slug), None)
    if idx is None:
        return [f"'{slug}' günlükte yok"], []
    cur, earlier = rows[idx], rows[:idx]
    allowed = ids(cur["tekrar_izinli"])
    fails, notes = [], []

    look = cur["ana_gorunus"].strip()
    if look and look != "-":
        for r in earlier:
            if r["ana_gorunus"].strip() == look:
                fails.append(f"ana karakter görünüşü '{look}' daha önce {r['bolum']} bölümünde kullanıldı")

    for r in earlier[-RECENT_N:]:
        for c in RECENT_LOCKED:
            clash = (ids(cur[c]) & ids(r[c])) - allowed
            if clash:
                fails.append(f"{c}: {', '.join(sorted(clash))} son {RECENT_N} bölümden {r['bolum']} içinde kullanıldı")

    for r in earlier:
        for c in CATS:
            a = ids(cur[c])
            if not a:
                continue
            ratio = len(a & ids(r[c])) / len(a)
            if ratio >= OVERLAP_MAX:
                fails.append(f"{c}: {r['bolum']} ile örtüşme %{round(ratio * 100)} (sınır %{int(OVERLAP_MAX * 100)})")

    added = {}
    for item in ids(cur["yeni"]):
        if ":" not in item:
            notes.append(f"'yeni' sütununda kategorisiz kimlik: {item} (kategori:kimlik yaz)")
            continue
        cat = item.split(":", 1)[0].strip()
        cat = NEW_ALIASES.get(cat, cat)
        added[cat] = added.get(cat, 0) + 1
    for cat, need in MIN_NEW.items():
        if added.get(cat, 0) < need:
            fails.append(f"yeni {cat}: {added.get(cat, 0)} (en az {need})")
    return fails, notes


def main():
    ap = argparse.ArgumentParser(description="What If stüdyosu tekrar kontrolü")
    ap.add_argument("--gunluk", required=True, help="Kullanim-Gunlugu.md yolu")
    ap.add_argument("--bolum", required=True, help="kontrol edilecek bölümün slug'ı")
    a = ap.parse_args()
    try:
        rows = read_table(a.gunluk)
    except (OSError, ValueError) as e:
        print(f"HATA: {e}")
        return 2
    fails, notes = check(rows, a.bolum)
    for n in notes:
        print("NOT:", n)
    if fails:
        print(f"GEÇMEDİ ({len(fails)}):")
        for f in fails:
            print(" -", f)
        return 1
    print(f"GEÇTİ: {a.bolum}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
