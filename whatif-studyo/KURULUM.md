# Kurulum (ajan için)

1. **Ön koşullar:** Node.js 22+, Python 3.11+, FFmpeg, Google Chrome. Eksik olanı kullanıcıya
   söyle ve işletim sistemine uygun kurulum komutunu öner (macOS: `brew install node ffmpeg`;
   Windows: `winget install OpenJS.NodeJS Gyan.FFmpeg Google.Chrome Python.Python.3.12`;
   Linux: paket yöneticisi). Kullanıcının onayı olmadan kurma.
2. **Stüdyo klasörü:** Kullanıcıya diskte nerede duracağını sor. İçinde `studio/` (Remotion
   projesi), `voice/`, `pipeline/`, `exports/` olsun. Remotion projesi yoksa
   `npx create-video@latest` ile boş bir proje aç, `three`, `@react-three/fiber`,
   `@remotion/three` paketlerini ekle. Windows'ta PowerShell yürütme ilkesi `npm`'i engellerse
   `npm.cmd` kullan.
3. **Seslendirme:** Kullanıcının seçtiği motoru ve sesi `Kanal.md` içine yaz. Bulut TTS
   kullanılacaksa anahtarı kullanıcı **kendi makinesinde** ortam değişkenine koyar
   (ör. `GEMINI_API_KEY`). Anahtarı sohbete yazdırma, dosyaya kaydetme, deftere yazma.
4. **Render ayarı:** Eşzamanlılık (4K için 2-3), parça sayısı ve düşük öncelikle arka planda
   başlatma tercihini `Araclar.md` içine yaz.
5. **Çeşitlilik denetleyicisi:** `araclar/cesitlilik.py` yalnız Python standart kütüphanesi
   kullanır; kurulum gerekmez. `python3 araclar/cesitlilik.py --help`.
   **Shorts araçları:** `araclar/shorts_olcum.py` ve `araclar/ses_sec.py` FFmpeg ve `numpy`
   ister (`python3 -m pip install numpy`; kullanıcının onayıyla). `ses_sec.py` Gemini API'ye
   istek atar ve anahtarı yalnız `GEMINI_API_KEY` ortam değişkeninden okur.
6. **Sahne kiti:** `cd whatif-studyo/sahne-kiti && npm install` (three 0.187.0 ve başsız önizleme
   için puppeteer-core; kullanıcının onayıyla). `node render.mjs` örnek kareleri `cikti/` altına
   yazar; Chrome yolu bulunamazsa `CHROME_YOLU` ortam değişkeni verilir. Kit modülleri Remotion
   projesine kopyalanabilir ya da oradan içe aktarılabilir (RENDER-RECETESI 7).
7. Kurulan sürümleri ve tarihi `Araclar.md` içine yaz.
