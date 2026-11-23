# NöronAI Studio

**A "What If" video studio with memory.** From a topic or a document it produces a stickman,
single-narrator What If video, and after every episode it writes your channel's rules, used
topics, characters and lessons into its own notebook. By episode ten it knows everything it did
not know in episode one, and it repeats nothing.

[Türkçe](README.md) · [Architecture (TR)](docs/MIMARI.md) · [MIT licence](LICENSE)

NöronAI Studio is an add-on for [AvenoxBeyin](https://github.com/avenoxai/avenoxbeyin), the
open-source second-brain system by [@Avenoxai](https://x.com/Avenoxai). AvenoxBeyin keeps the
memory; NöronAI Studio does the production.

## What it does

Topic ideas that were never used before → single-narrator script sized to the runtime → TTS
voice-over and sentence timing → a design brief from the script → a per-episode cast for your
approval → Three.js + Remotion shots, effects and sound design → quality checks (frozen shots,
black frames, floating objects, repetition) → 4K long-form or vertical Shorts render → everything
learned is written back to your vault.

## The notebook

| File | Keeps |
| --- | --- |
| `Kanal.md` | Tone, narrator voice, reading speed, bans, current style summary |
| `Kullanilan-Konular.md` | Every topic made, so new ideas never repeat |
| `Kadro.md` | Each character's approved look |
| `Kullanim-Gunlugu.md` | Sets, wardrobe, accessories, motions and sound used per episode |
| `Dersler.md` | Dated corrections and quality failures |

Before rendering, `araclar/cesitlilik.py` reads the usage log and enforces the no-repeat rules:
the lead's look never repeats, sets and wardrobe from the last three episodes are off limits, and
every episode must add new items to the library. Standard library Python, with tests.

## Install

Requirements: a vault with [AvenoxBeyin](https://github.com/avenoxai/avenoxbeyin) installed, an
AI client such as Claude Code or Codex, Node.js 22+, Python 3.11+, FFmpeg and Chrome.

1. Install AvenoxBeyin.
2. Download this repo (green **Code** button › **Download ZIP**) and unzip it.
3. In your vault folder: `python3 beyin.py skill-import --source /path/to/noronai-studio/whatif-studyo`
4. Tell your agent **"stüdyoyu kur"** (set up the studio).

The skill's instructions are in Turkish; scripts are written in your channel's language.

## Safety

No API keys in the repo or the notebook: the TTS key stays in an environment variable on your
own machine. Heavy media stays outside the vault. Publishing, uploads and paid services always
need your approval.

## Credits

Memory layer and notebook approach: [AvenoxBeyin](https://github.com/avenoxai/avenoxbeyin) and
its `video-motoru` package by [@Avenoxai](https://x.com/Avenoxai) (MIT), see
[NOTICE.md](NOTICE.md). Production pipeline: developed and tested on real, published episodes.

Made by [@thenoronai](https://x.com/thenoronai) · Nöron Zeka
