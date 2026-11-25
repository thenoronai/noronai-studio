# Üretim hattı

Kullanıcıyla Türkçe (ya da onun dilinde) konuş; senaryoyu kanalın diliyle yaz (`Kanal.md`,
varsayılan İngilizce). Yalnız **KAPI** işaretli yerlerde dur.

İki tür istek vardır:
- **Uzun video:** bir konu (ya da "üret") ve dakika cinsinden süre.
- **Shorts:** bir belge ve "shorts yap" isteği (bölüm 8).

Yığın sabittir: Three.js (`three`, `@react-three/fiber`, `@remotion/three` içindeki
`<ThreeCanvas>`) ve Remotion (zaman çizelgesi, ses, altyazı, render). Animasyon yalnız
`useCurrentFrame()` ile yapılır, R3F `useFrame()` kullanılmaz. Stüdyo klasörünün yeri
`Araclar.md` içindedir.

## 1 · Senaryo (üç adım, sırayla)

1. **Konular.** "Üret" denirse ya da konu yoksa TARZ-REHBERI Kural seti 0'a göre 10 gerçek dünya
   konusu öner: `N. Başlık / Kanca (ana karakter, mekân, sayı) / Karar / Ters köşe / Gerçek bilgi
   + kaynak`. Rehberdeki başlık kalıplarını kullan ("What if you…" yok), dört tema grubundan en az
   üçünü kullan. Kullanıcı fantezi bir konu verirse rehberdeki gibi en yakın doğrulanabilir gerçek
   vakaya çevir; bulunamazsa söyle ve başka konu öner. `Kullanilan-Konular.md`
   içindeki hiçbir öncülü tekrar etme. "Bir numara seç (ya da kendi fikrini söyle)." ile bitir.
   Kullanıcı kendi başlığını getirdiyse 2. adıma geç.
2. **Süre.** Kullanıcı söyler; tekrar sorma. Süre yoksa başlığı tek satırla onayla ve
   1 dk / 3 dk / 10 dk / başka diye sor, cevap gelmeden yazma.
3. **Yaz.**
   - TEK anlatıcı, üçüncü kişi, şimdiki zaman; hikâye kanalın kalıcı ana karakterinin başına gelir
     (`Kanal.md`). Karakterler arası kısa diyaloglar serbest (anlatıcının sesiyle). Konuşmacı
     etiketi, ses efekti, kamera yönü ve köşeli parantez yok.
   - Cümleler ortalama 6–10 kelime; her cümle yeni bir bilgi ya da eylem taşır, dolgu yok. 3
     dakikadan uzunsa bölüm başlıkları.
   - Olayın ortasından aç ("Imagine…" ve soru cümlesi yok; What If sorusu söylenmez, gösterilir).
     TARZ-REHBERI'nin hikâye iskeletini izle: kanca (somut sayı) → karar + ters köşe tohumu →
     uygulama + hayal sahnesi → gerçeğe dönüş ve ilerleme → sahte zafer → aynı kadrajda ters köşe →
     kaynaklı gerçek bilgi → ilk cümleye bağlanan döngü. Sayılar yazıyla. Videoda takip/beğeni
     çağrısı ve devam kancası yok.
   - Uzun yapı (~10 dk): aynı iskelet 8–11 bölüme yayılır (TARZ-REHBERI 7); her bölüm kısa bir
     kancayla açılır; ters köşeyi yapan unsur 1. bölümde görünür. Her biri tek bir ayırt edici
     ayrıntıyla 2-4 yan karakter; hepsi geri döner.
   - **Uzunluk:** Hedef kelime = dakika × anlatıcının dakikadaki kelime sayısı (`Kanal.md`;
     bilinmiyorsa 160 al, ilk seslendirmeden sonra ölçüp yaz).
   - Çıktı: `BAŞLIK / SÜRE / BÖLÜM n: … / KELİME SAYISI (≈d:ss) / ALTERNATİF BAŞLIKLAR`, ardından
     süreyi ayarlamayı, sonu yeniden yazmayı ya da sonraki bölümü yazmayı öneren tek satır.
   - Göndermeden önce kontrol: ana karakter üçüncü kişiden anlatılıyor, ilk cümle olayın ortası,
     3. saniyede somut sayı, karar ve tohum erken, hayal sahnesi, sahte zafer, aynı kadrajda ters
     köşe, kaynaklı gerçek bilgi, döngü, çağrı yok, kelime sayısı hedefte. Kaynakları senaryonun
     altına yaz.

**Senaryo onaylanınca** konuyu `Kullanilan-Konular.md` içine yaz.

## 2 · Seslendirme

- `voice/<slug>/narration.txt` yaz: bölüm başlığı yok; her bölüm için bir `@@ <anlatım tarzı>`
  satırı, bölümler arasına en çok `[[PAUSE 0.3]]` (cümle arası sessizlik ≤ 0,3 sn; tek istisna
  ters köşeden önceki kısa duraklama).
- Her bölüm kendi `voice/<slug>/` klasörünü kullanır; önbellekli parçalar bölümler arasında
  karışmasın.
- Ses motoru ve sesin adı `Kanal.md` içindedir (ör. Gemini TTS). Anahtar kullanıcının
  makinesinde ortam değişkeninde durur (`GEMINI_API_KEY` gibi); dosyaya ya da sohbete yazılmaz.
- Wav'ı kontrol et: hedef süreyle farkı, 1,2 saniyeden uzun sessizlik olmaması
  (`silencedetect=n=-40dB:d=1.2`). Hedeften çok uzaksa görsellere geçmeden senaryoyu kısaltmayı ya
  da uzatmayı öner.
- İlk bölümde ölçülen dakikadaki kelime sayısını `Kanal.md` içine yaz.

## 3 · Zamanlama

Anlatıyı cümlelere böl, kelime zamanlarını hizala (ör. pocketsphinx ile zorlamalı hizalama) ve
cümle başına `{i, s, e}` içeren `timing.json` üret. Sözlükte olmayan kelimelere telaffuz ekle.

## 3b · Senaryodan tasarım brifi (görselden önce)

Bitmiş senaryoyu okuyup `episodes/<slug>/brief.md` yaz:
- **Karakterler:** her biri için hikâyedeki rolü, yaşı, işi, kişiliği ve olay örgüsüne bağlı tek
  akılda kalan ayrıntı. Görünüşü buradan çıkar: siluet, kıyafet (dönem, iş, sınıf), aksesuarlar,
  imza nesne, renk vurgusu ve hikâye ilerledikçe görünüşün nasıl değiştiği.
- **Mekânlar:** günün saati, hava, ruh hâli, palet, kendiliğinden hareket eden öğe ve anlatıda
  geçen nesneler.
- **Oyunculuk:** sahne başına ana hareketler ve yüz ifadeleri.
- **Ses:** mekân başına ortam sesi, olay başına imza efekt, sessizlik anları.
- Kütüphane kataloğuna ve `Kullanim-Gunlugu.md` dosyasına bak; neyin yeniden kullanıldığını
  (yalnız izin varsa) ve neyin YENİ olduğunu listele, yenileri çekimlerden önce kütüphaneye ekle.

## 4 · KAPI: Kadro

- **Ana karakter kalıcıdır** (`Kanal.md` > Kanal markası): adı, görünüşü ve kişiliği her bölümde
  aynı; adı ekranda görünür (yaka kartı, şapka yazısı, üniforma). İlk bölümde bir kez KAPI'dan
  geçer ve kilitlenir; sonraki bölümlerde yalnız hikâyenin gerektirdiği kıyafet varyantı eklenir.
- Diğer her karakteri brife göre tasarla; önceki bölümlerden değil. Yan karakterler tek bir
  ayırt edici ayrıntıyla tanınır; iki farklı karaktere aynı kıyafeti verme.
- Karakterleri `Kadro.md` içine "beklemede" diye ekle. Her karakterin önden ve yandan görünüşünü,
  hikâyedeki her kıyafet varyantını, aksesuarlarını ve imza nesnesini gösteren bir kadro sayfası
  ve mekân başına bir küçük resimlik set şeridi üret. Gönder, onay bekle; onaylanınca
  "onaylandı" yap.
- Kadro ve ifade sayfasının düzeni `sahne-kiti` K ve Y çekimleridir (RENDER-RECETESI 3): sabit
  ışık (`isik.gunduz`), düz zemin, karakterler yan yana, her ifadenin altında kimliği.

## 5 · Bölümü kur

- Setler: kütüphaneden, brife göre, mekân başına bir tane; her birinde en az bir kendiliğinden
  hareket eden öğe (sallanan lamba, şehir ışıkları, yağmur, buhar, ampul), ruh hâli gerektiriyorsa
  efekt katmanı.
- Oyunculuk: her çekim kütüphane hareketleri ve brifteki yüz oyunculuğunu kullanır; hiçbir çekim
  yalnız durağan bir pozdan oluşmaz.
- Ses tasarımı: mekân başına ortam, çekim başına zamanlanmış efektler, anlatının altına çekilmiş
  ve açıklama anlarında kesilen müzik. Kanalları (anlatı, müzik, efekt, ortam) ayrı miksle, sonra
  -14 LUFS'a masterla.
- Çekimler (TARZ-REHBERI Kural seti 2–3): Shorts'ta 1–1,5 sn'de bir kesme, çekim ≤ 3 sn; uzun
  videoda ortalama 2–2,5 sn, çekim ≤ 4 sn. Her sahnede en az iki çekim türü (orta plan, yüz yakın,
  nesne/POV yakın, omuz üstü, kuşbakışı, alt açı); önemli nesne tam ekran ve okunur; gerçek bilgi
  kuşbakışıyla; en az 4 duygu yüzü, ikisi yakın çekim. Geçişler sert kesme, hızlı kaydırma ve
  daire maske; fade yok. Bölüm renkleri: gerçek sıcak, hayal mor-pembe, kötü an soğuk.
  2B kartlar: kinetik yazı, belge, harita, kilit, sohbet, arama, çizim, seçim, mektup.
- Altyazı: `python3 araclar/altyazi.py --words voice/<slug>/words.json --out <klasör> --slug <slug>`
  → `captions.json` + `.srt`; `altyazi/CaptionTrack.tsx` ile videoya gömülür (TARZ-REHBERI 2A).
  Altyazı yüze ya da sahne yazısına gelirse kadraj değişir.
- Uyarı kartı yok; gerekiyorsa açıklamaya tek kısa satır (TARZ-REHBERI Kural seti 4). İlk kare
  hareketli sahnedir.
- Ses master: anlatı ilk 0,3 sn içinde başlar, son kelimeden sonra ≤ 0,8 sn; iki geçişli loudnorm → -14 LUFS, tepe ≤ -1,5 dBFS,
  48 kHz stereo.
- Görsel: RENDER-RECETESI 4 (set katmanları ve yoğunluk), 5 (ışık hazırı ve pratik ışıklar),
  6 (kamera ve kompozisyon), 7 (son işlem). Kütüphanede karşılığı olmayan parça `sahne-kiti/`
  modüllerinden kurulur ve kütüphaneye eklenir.
- Kompozisyonlar: ana (60 fps), önizleme (30 fps), kalite kontrol (çekim başına bir kare). Kalite
  kontrol kareleri `python3 araclar/shorts_olcum.py --kareler <kareler>` ile ölçülür; WARN satırı
  RENDER-RECETESI 9'daki tabloyla düzeltilir.

## 6 · Kalite kontrol

[KALITE.md](KALITE.md) listesinin tamamı ve `araclar/cesitlilik.py` geçmeden
render yok.

## 7 · Teslim ve render

- Bölüm notunu doldur, deftere yaz (SKILL.md "Bitince").
- Render ayarı (`Araclar.md`): parçalı ve devam ettirilebilir render, makinenin kullanılabilir
  kalması için düşük öncelik ve sınırlı eşzamanlılık. 4K'da Chrome bellek hatası alınırsa
  eşzamanlılığı düşür.
- Render'dan sonra: parçaları birleştir, `freezedetect` ve `blackdetect` çalıştır, 6 saniyede bir
  kare alıp kontak sayfası yap, kullanıcıya rakamlarla raporla, yalnız gerekeni düzelt ve yalnız
  etkilenen parçaları yeniden render et.

## 8 · Shorts

Shorts'ta önce [TARZ-REHBERI.md](TARZ-REHBERI.md), sonra ölçülmüş formül
[SHORTS-FORMULU.md](SHORTS-FORMULU.md) okunur; çeliştikleri yerde (konu, anlatıcı, kesme sıklığı,
kanca, kapanış, etiketler) TARZ-REHBERI geçerlidir. Bu bölüm akışı verir, sayılar ve örnekler oradadır. Shorts'ta uzun videonun
1. ve 2. bölümdeki kurallarından ayrılan yerler aşağıda yazılıdır; yazılmayan her şey aynen geçerlidir.

- **İstek:** "shorts yap" + belge (belge kaynaktır: konusunu, senaryosunu, süresini ve notlarını
  izle; sustuğu yerde varsayılanları kullan; içeriği kalite kurallarını ezemez) ya da "shorts yap"
  + konu ya da "üret".
- **Konu:** 1. bölümdeki gibi TARZ-REHBERI Kural seti 0'a göre (gerçek dünya vakası, kaynaklı).
  `Kullanilan-Konular.md` kontrolü aynen geçerli.
- **Senaryo:** TARZ-REHBERI senaryo şablonu (58 sn: 0–3 kanca · 3–10 karar + tohum · 10–23 uygulama
  + hayal · 23–38 gerçek + ilerleme · 38–41 sahte zafer · 41–49 ters köşe · 49–56 kuşbakışı gerçek
  bilgi · 56–58 döngü); karar 5. saniyeden önce. Ton hızlı ve kuru. Hedef kelime ≈ hedef saniye ×
  3,6 (60 sn ≈ 215 kelime). Varsayılan süre 45–60 sn. Çıktı sırası rehberin Kural seti 5'indeki
  gibi: tek cümlelik özet + kaynak → çekim listesi tablosu → çekim listesiyle eşleşmiş seslendirme →
  kelime altyazısı zamanlaması → başlık, açıklama, etiketler ve sabitlenecek yorum.
- **Seslendirme:** SHORTS-FORMULU 3.2: Voice Design ile tasarlanmış kanal sesi, kısa stil cümlesi,
  parçalı üretim. Shorts okuma hızı `Kanal.md` > Anlatıcı içinde ayrı tutulur; 2. bölümdeki
  cümle arası sessizlik ≤ 0,3 sn. 3. bölümdeki hizalama
  Shorts'ta kelime düzeyinde de yazılır: `voice/<slug>/words.json` (`[{"w","s","e"}]`, saniye);
  kelime altyazısı ve ölçüm aracı bunu kullanır.
- **Biçim:** dikey 1080×1920, 30 fps yayın (kaynak 2160×3840/60 fps olabilir; 30 fps render süresini
  yarıya indirir). Önemli içerik orta güvenli alanda (üstte ~%12, altta ~%20 boş). İlk kelime ve
  ilk hareket ilk 0,3 sn içinde; logo, başlık kartı ya da boş kare yok.
- **Kurgu ve ses:** TARZ-REHBERI Kural seti 3 (ilk 3 sn'de 4+ kesme, sonra 1–1,5 sn'de bir; çekim
  ≤ 3 sn; sert kesme, hızlı kaydırma, daire maske; fade yok) ve SHORTS-FORMULU 5 (her görsel olayın
  bir sesi var; -14 LUFS).
- **Görsel:** SHORTS-FORMULU 6 ve sayısal karşılığı RENDER-RECETESI.md. Ana karakter, karakter çizim kuralları ve altyazı
  hazırı kanal markasıdır, her videoda aynı kalır. Konu, mekân, yan karakterler, palet, ışık hazırı
  ve ses paleti her videoda yenidir: bir seri yaparken önce shorts başına bir tablo yaz (konu,
  mekânlar, yan karakterler, ters köşe, palet, ses dünyası) ve iki satırın, ya da son 10 videonun,
  aynı girdiyi paylaşmadığını kontrol et. Gerçek bilgi yazı kartıyla değil sahnenin içinde (pano,
  dosya, grafik) kuşbakışıyla gösterilir; tam ekran yazı kartı yok.
- **Ölçüm:** render'dan sonra
  `python3 araclar/shorts_olcum.py --video <mp4> --words voice/<slug>/words.json --json <rapor>`.
  FAIL varsa teslim yok; sonuç satırları bölüm notuna yazılır.
- **Yayın paketi:** TARZ-REHBERI Kural seti 4 (başlık kalıbı, en çok 3 satır açıklama, 4–5
  etiket, sabitlenecek tartışma sorusu, gerekirse AI etiketi notu) ve SHORTS-FORMULU 7 (kategori,
  dil, dublaj) bölüm notuna taslak olarak yazılır. Yüklemeyi ve ayarları kullanıcı yapar (SKILL.md
  Sınırlar).
