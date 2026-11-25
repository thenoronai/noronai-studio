# Üretim kütüphanesi ve tekrar kuralları

Ortak bir kütüphane her bölümle büyür. Hiçbir öğe bölümden bölüme tekrar etmez: her öğe o
bölümün senaryosundan ve hikâyesinden tasarlanır.

Kod stüdyo klasöründe `library/` altında, sesler `public/sfx/` altında durur. Her öğenin bir
kimliği, etiketleri (ruh hâli, mekân, dönem, tür, palet) ve bir önizlemesi vardır; hepsi
`library/catalog.json` içinde listelenir. Vault'taki `Kutuphane.md` yalnız kökü ve kategori
özetlerini tutar.

| Klasör | İçerik |
| --- | --- |
| `wardrobe/` | Üst, alt, ayakkabı, dış giyim, üniforma; renk, desen, yıpranma ve kalıp parametreli, katmanlanabilir |
| `accessories/` | Baş (şapka, kask, kulaklık, maske), yüz (gözlük, göz bandı, yara), boyun/gövde (kravat, atkı, rozet, çanta, kemer), eller (saat, yüzük, eldiven) ve el nesneleri (telefon, çanta, fener, anahtar, fincan, not) |
| `looks/` | Saç, sakal, kaş, çil, makyaj ve beden varyantları (yalnız boy ve en; kafa, çizgi ve yüz kuralları sabit) |
| `motions/` | Pozların üstüne ikincil hareketli klipler: koşma, sinme, zıplama, düşme, tökezleme, kapı çalma, bakma, irkilme, titreme, bayılma, yüzme, süzülme, tırmanma, çömelme, taşıma, fırlatma, dans, hızlı yazma, sarılma, itme, çekme, omuz silkme, nesneyi kameraya gösterme, tezgâhtan kaydırma, ısırma, uyuyakalma; yüz oyunculuğu (ifade eğrileri, dudak, göz kırpma, ter, gözyaşı). Shorts için ifade kimlikleri (`yuz.emin`, `yuz.alayci`, `yuz.saskin`, `yuz.dehset` …) ve hareket zamanlamaları SHORTS-FORMULU.md 6.2–6.3'te |
| `sets/` | Modüllerden kurulan mekânlar; günün saati, hava ve hasar varyantları; her birinde kendiliğinden hareket eden bir öğe, hareketli bir arka plan katmanı ve mekânın adını veren bir sahne yazısı (tabela, afiş, ekran). Işık hazırları (`isik.gunduz`, `isik.altin-saat`, `isik.gece-mavi`, `isik.neon-gece`, `isik.tek-ampul`, `isik.floresan`, `isik.dijital`, `isik.tehlike`) set varyantıdır: SHORTS-FORMULU.md 6.4 |
| `props/` | Hikâye nesneleri |
| `fx/` | Yağmur, kar, toz, duman, ateş, kıvılcım, kabarcık, parıltı, bozulma, ışık hüzmesi, titreme; 2B çizgi film işaretleri: hız çizgisi, darbe patlaması, ter damlası, buhar, soru ve ünlem işareti, "Z", kalp |
| `cards/` | 2B arayüz ve kinetik kartlar. Shorts ek çekimleri: teknik çizim (blueprint), kesit (deri, beyin, toprak altı, makine içi), röntgen ve termal kamera, hava durumu ya da uyarı arayüzü, harita, büyük sayaç, sözleşme ve küçük yazısı, takvim ve fotoğraf yığını, mantar pano ve ip, değerlendirme kartı |
| `captions/` | Altyazı hazırı: kanalın tek kelime altyazı stili (yazı tipi, boyut, kontur, gölge, konum, zamanlama). Kanal markasıdır; tekrar kurallarının dışındadır. Tarif: SHORTS-FORMULU.md 6.7 |
| `sfx/` | numpy/ffmpeg ile sentezlenen sesler (telifsiz): darbe, vınlama, yükselen, vurgu, bildirim, telefon, klavye, kapı, zemine göre ayak sesi, kalp atışı, nefes, bozulma, parazit, alarm, saat, kalabalık, rüzgâr, yağmur, su, sualtı, sonar, gürültü, ortam yatakları; Shorts için ayrıca pop/tık (nesne belirmesi, yazı), parıltı/çan (fikir, sihirli an), hıza göre 150–600 ms whoosh (kamera hareketi), bas vuruşu (ifşa) ve kısa riser (gizem sorusundan önce). Her ses en az üç varyasyonla. Kullanıcının eklediği lisanslı paketler `public/sfx/ext/` altına, lisanslarıyla kataloğa. |

`sahne-kiti/` bu kütüphanenin tohumudur: kıyafet (`gomlek`, `ceket`, `uniforma`, `cubbe`, `elbise`),
şapka (`kep`, `tac`, `fotr`, `bere`), saç, 12 yüz ifadesi, mobilya ve oda parçaları, yordamsal dokular,
sekiz ışık hazırı ve son işlem zinciri. Kitten türetilen her yeni öğe kendi kimliğiyle `library/`
içine taşınır ve kataloğa yazılır; kitin kendisi bölümden bölüme değişmeyen araçtır, tekrar
kurallarına girmez (ışık hazırının kimliği girer).

## Tekrar kuralları

`araclar/cesitlilik.py`, vault'taki `Kullanim-Gunlugu.md` dosyasından kontrol eder; render'dan
önce geçmek zorunludur.

- Ana karakterin tam görünüşü (saç + kıyafet + aksesuar + palet) önceki hiçbir bölümle aynı
  olamaz.
- Son 3 bölümde kullanılmış set, kıyafet parçası, aksesuar ya da ortam sesi kullanılmaz; yalnız
  kullanıcının istediği tekrarlayan bir karaktere ya da seriye aitse kullanılabilir.
- Her bölüm kütüphaneye en az şunları ekler: 3 set (ya da farklı mekânların yeni varyantları),
  4 kıyafet parçası, 6 aksesuar ya da nesne, 4 hareket, 1 efekt, 8 ses efekti. Yeni öğeler bölüm
  klasöründe değil, `library/` içinde kurulur.
- Önceki herhangi bir bölümle kimlik örtüşmesi her kategoride %25'in altında kalır.

Bir videonun içindeki tekrar serbesttir (aynı daire, aynı ana karakter, aynı kıyafet), hikâye
gerektiriyorsa.

Kanal markası tekrar kurallarının dışındadır ve her videoda aynı kalır: anlatıcı sesi, karakter
çizim kuralları (kafa, çizgi, yüz), altyazı hazırı ve varsa logo. İzleyici kanalı bunlardan tanır;
geri kalan her şey (kadro, kıyafet, set, palet, ışık hazırı, kamera yolları, ses paleti) her videoda
yenidir. YouTube'un "genel ya da tekrarlayan içerik" kuralı (Temmuz 2026) şablonla üretilmiş gibi
görünen videoları para kazanmaktan çıkarır; bu ayrım kanalı hem tanınır hem de çeşitli tutar.
