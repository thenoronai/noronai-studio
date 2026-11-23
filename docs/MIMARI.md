# Mimari

```mermaid
flowchart LR
    U["Sen"] -->|"konu, notlar, onay"| A["AI ajanı<br/>(Claude Code, Codex...)"]
    A -->|"okur: kanal, dersler,<br/>kullanılan konular"| V["Vault · Studyo defteri<br/>(AvenoxBeyin)"]
    A -->|"üretir"| S["Stüdyo klasörü<br/>Remotion + Three.js,<br/>kütüphane, ses"]
    S -->|"kullanılan kimlikler"| V
    V -->|"cesitlilik.py"| Q{"Tekrar<br/>kontrolü"}
    Q -->|"geçti"| R["4K render / Shorts"]
    R -->|"dersler, tarz özeti"| V
```

- **Vault (AvenoxBeyin):** Hafıza. Düz Markdown; Obsidian'da açılır, elle düzeltilebilir, başka bir
  AI istemcisi de aynı notları okur.
- **Stüdyo klasörü:** Ağır her şey: Remotion projesi, kütüphane kodu ve önizlemeleri, ses,
  render'lar. Vault'u şişirmez.
- **Skill (`whatif-studyo`):** Ajanın ne zaman okuyup ne zaman yazacağını ve üretim hattını
  anlatır. Kanala özel hiçbir şey taşımaz; her şeyi defterden öğrenir.

## Akış

1. **Başlarken:** `Kanal.md`, `Acik-Isler.md`, `Kullanilan-Konular.md` ve son dersler okunur.
2. **Üretirken:** `URETIM.md` adımları; yalnız senaryo, kadro ve taslakta onay istenir.
3. **Render'dan önce:** `KALITE.md` listesi ve `cesitlilik.py`.
4. **Bitince:** Tarz özeti yeniden yazılır, bölüm notu doldurulur, kimlikler günlüğe işlenir.
