# Değişiklikler

## 0.4.0 · 2026-11-25

- **Tarz rehberi:** `whatif-studyo/TARZ-REHBERI.md`. Ricks Clips'in en çok izlenen Reel'inin kare kare
  incelenmesinden ve hesabın 28 Reel'inin konu analizinden çıkan kurallar: gerçek dünya konusu ve
  kaynak zorunluluğu (Kural seti 0), olayın ortasından kanca, kalıcı ana karakter ve üçüncü kişi
  anlatıcı, karar → hayal → sahte zafer → aynı kadrajda ters köşe → gerçek bilgi → döngü iskeleti,
  1–1,5 sn'de bir kesme ve fade yasağı, gömülü kelime altyazısı ölçüleri (2A), başlık/açıklama/etiket
  kuralları, render öncesi 12 maddelik kontrol listesi; uzun videoya ölçekleme (7. bölüm). Her video
  için geçerli; diğer dosyalarla çeliştiğinde öncelik bu dosyada.
- **Altyazı:** `whatif-studyo/altyazi/CaptionTrack.tsx` (Montserrat Black, 4K için `olcek`) ve
  `araclar/altyazi.py` (words.json → en çok 2 kelime / 12 karakterlik gruplar, sayı-birim birlikte,
  sessizlikte kapanma, `captions.json` + `.srt`). Testleri `tests/test_altyazi.py` (6).
- **Ölçüm:** `shorts_olcum.py` sert kesme üst sınırı ve kesme aralığı yerine çekim sayısı (≥ süre ×
  0,6) ve en uzun çekim (≤ 3 sn) ölçer (WARN).
- **SKILL, URETIM, KALITE, SHORTS-FORMULU ve şablonlar** rehbere bağlandı: KALITE kural 2 (fade yok),
  9 (≤ 0,3 sn duraklama), 11 (açılış ve döngü kapanışı, her video), yeni 13–15 (altyazı, konu ve kaynak,
  kontrol listesi); `Kanal.md` ana karakter alanı; `BOLUM-NOTU.md` kaynaklar ve kontrol listesi.

## 0.3.0 · 2026-11-25

- **Render reçetesi:** `whatif-studyo/RENDER-RECETESI.md`. Referans görünümün (ışıklı 3B set içinde düz
  2B karakter) sayısal tarifi: karakter oranları ve yumuşak gölgeleme, set katmanları ve dekor
  yoğunluğu, sekiz ışık hazırının tüm değerleri, kamera ve kompozisyon, son işlem zinciri, görsel
  ölçüm hedefleri ve sorun giderme tablosu. Değerler referans kanalın 198 karesinin ölçümüyle
  karşılaştırılarak ayarlandı.
- **Sahne kiti:** `whatif-studyo/sahne-kiti/` (Three.js 0.187.0). Işık hazırları, 2B karakter
  (5 kıyafet, 4 şapka, 5 saç, 3 aksesuar, 12 ifade, ifadeye bağlı ten), set parçaları, mobilya,
  yordamsal dokular, pencere gobosu, son işlem ve başsız render (`node render.mjs`); örnek çekimler
  A–D, kadro (K), ifade (Y) ve ışık hazırı (L) sayfaları. Tüm tasarımlar bu stüdyoya ait.
- **Görsel ölçüm:** `araclar/shorts_olcum.py` videodan 11 kare alıp parlaklık, kontrast, renklilik,
  karanlık alan, detay, düzlük ve sahneler arası sıcak/soğuk değişimini ölçer (WARN); `--kareler`
  ile render önizleme kareleri ölçülür. Testleri `tests/test_shorts_olcum.py` (6 yeni),
  kit tutarlılık testleri `tests/sahne_kiti.test.mjs`.
- **KALITE.md** kural 12 (görsel ölçüm), **SHORTS-FORMULU.md** 8. tabloya görsel satırlar,
  **URETIM.md** 4–5, **SKILL.md**, **KUTUPHANE.md**, **KURULUM.md** kite bağlandı.

## 0.2.0 · 2026-11-25

- **Shorts formülü:** `whatif-studyo/SHORTS-FORMULU.md`. Bir kanalın 33 Short'unun (46 günde
  305,8 Mn izlenme) kare kare ve ses izi ölçümünden çıkarıldı: biçim, senaryo vuruşları ve What If
  uyarlaması, anlatıcı ölçüleri ve Gemini TTS (Voice Design) tarifi, kurgu ve sahne geçişleri, ses
  tasarımı, karakter / yüz ifadesi / hareket / ışık / altyazı kütüphanesi, yayın ayarları, ölçülebilir
  hedefler ve konu listesi. İçerik, karakter ve senaryo kopyalanmadı; örnekler bu stüdyo için yazıldı.
- **Araçlar:** `araclar/shorts_olcum.py` (bitmiş Shorts'u hedeflerle karşılaştırır, FAIL'de çıkış
  kodu 1) ve `araclar/ses_sec.py` (Gemini Voice Design ile kanal sesi tasarlar, adayları ölçüp
  sıralar). Testleri: `tests/test_shorts_olcum.py`.
- **URETIM.md 8** Shorts bölümü formüle bağlandı (biçim 1080×1920/30 fps, 45–65 sn, alaycı replik
  izni, ölçüm ve yayın paketi adımları).
- **KALITE.md:** kural 2 ve 9'a Shorts ekleri, yeni kural 10 (Shorts ölçümü) ve 11 (açılış ve
  kapanış), ilk üç Shorts'tan çıkan ders.
- **KUTUPHANE.md:** ifade ve hareket kimlikleri, ışık hazırları, ek çekim kartları, 2B efektler,
  `captions/` altyazı hazırı, pop/tık ve parıltı/çan sesleri; kanal markasının tekrar kuralı dışında
  kaldığı yazıldı.
- **Şablonlar:** `Kanal.md` (Shorts sesi ve okuma hızı, kanal markası alanları, Yayın bölümü),
  `BOLUM-NOTU.md` (Shorts ölçümü, yayın paketi, performans).

## 0.1.0 · 2026-11-23

- İlk sürüm: `whatif-studyo` skill'i (üretim hattı, kalite kuralları, kütüphane ve tekrar
  kuralları), Stüdyo defteri şablonları ve `araclar/cesitlilik.py` tekrar denetleyicisi (testleriyle).
