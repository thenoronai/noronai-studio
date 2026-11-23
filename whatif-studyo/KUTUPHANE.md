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
| `motions/` | Pozların üstüne ikincil hareketli klipler: koşma, sinme, zıplama, düşme, tökezleme, kapı çalma, bakma, irkilme, titreme, bayılma, yüzme, süzülme, tırmanma, çömelme, taşıma, fırlatma, dans, hızlı yazma, sarılma, itme, çekme; yüz oyunculuğu (ifade eğrileri, dudak, göz kırpma, ter, gözyaşı) |
| `sets/` | Modüllerden kurulan mekânlar; günün saati, hava ve hasar varyantları; her birinde kendiliğinden hareket eden bir öğe ve hareketli bir arka plan katmanı |
| `props/` | Hikâye nesneleri |
| `fx/` | Yağmur, kar, toz, duman, ateş, kıvılcım, kabarcık, parıltı, bozulma, ışık hüzmesi, titreme |
| `cards/` | 2B arayüz ve kinetik kartlar |
| `sfx/` | numpy/ffmpeg ile sentezlenen sesler (telifsiz): darbe, vınlama, yükselen, vurgu, bildirim, telefon, klavye, kapı, zemine göre ayak sesi, kalp atışı, nefes, bozulma, parazit, alarm, saat, kalabalık, rüzgâr, yağmur, su, sualtı, sonar, gürültü, ortam yatakları. Her ses en az üç varyasyonla. Kullanıcının eklediği lisanslı paketler `public/sfx/ext/` altına, lisanslarıyla kataloğa. |

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
