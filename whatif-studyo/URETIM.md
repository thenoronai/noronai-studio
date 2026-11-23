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

1. **Konular.** "Üret" denirse ya da konu yoksa 10 konu öner:
   `N. Başlık / Kanca / Kural / Büyük seçim`. Başlık kalıplarını karıştır, en az beş güç türü
   kullan (beden, zihin, zaman, algı, toplumsal sistemler, kozmik/gizem). `Kullanilan-Konular.md`
   içindeki hiçbir öncülü tekrar etme. "Bir numara seç (ya da kendi fikrini söyle)." ile bitir.
   Kullanıcı kendi başlığını getirdiyse 2. adıma geç.
2. **Süre.** Kullanıcı söyler; tekrar sorma. Süre yoksa başlığı tek satırla onayla ve
   1 dk / 3 dk / 10 dk / başka diye sor, cevap gelmeden yazma.
3. **Yaz.**
   - TEK anlatıcı, "sen", şimdiki zaman. Konuşmacı etiketi, tırnaklı diyalog, ses efekti, kamera
     yönü ve köşeli parantez yok; konuşmaları anlatıya çevir.
   - Kısa paragraflar (2-5 cümle, çoğu 12 kelimenin altında); 3 dakikadan uzunsa bölüm başlıkları.
     Sakin, kuru, kendinden emin; açıklamadan önce üç nokta; doruk noktasında sıcak ve sessiz.
   - Aksiyonla aç. Başlık sorusunu erken sor. "İşte kural." Tırmanan bir sayı omurgası. Zaman
     atlamaları ayrı paragraf. Doruk noktası bir kavga değil, insanlarla ilgili bir seçim. Bir
     yeniden çerçeveleme cümlesi ve devam kancasıyla bitir. Sayılar yazıyla.
   - Uzun yapı (~10 dk): 9-11 bölüm (soğuk açılış ve karşılaştırma sayısı → kurallar, test, sınır →
     gündelik küçük zaferler → ilk sonuç → tırmanma merdiveni → aksilik → herkesin gördüğü an →
     bedel → karşı güç ya da son tarih → ahlaki seçim → sonrası, zaman atlaması, yeniden
     çerçeveleme, kanca). Süreyle ölçekle. Her biri tek bir ayrıntıyla 2-4 yan karakter; hepsi
     geri döner.
   - **Uzunluk:** Hedef kelime = dakika × anlatıcının dakikadaki kelime sayısı (`Kanal.md`;
     bilinmiyorsa 160 al, ilk seslendirmeden sonra ölçüp yaz).
   - Çıktı: `BAŞLIK / SÜRE / BÖLÜM n: … / KELİME SAYISI (≈d:ss) / ALTERNATİF BAŞLIKLAR`, ardından
     süreyi ayarlamayı, sonu yeniden yazmayı ya da sonraki bölümü yazmayı öneren tek satır.
   - Göndermeden önce kontrol: tek anlatıcı, diyalog yok, ilk cümle aksiyon, ilk %20'de
     karşılaştırma sayısı, tek kural ve ona uyuluyor, tırmanan bölümler, bir geri çağırma,
     yeniden çerçeveleme ve devam kapısı, kelime sayısı hedefte.

**Senaryo onaylanınca** konuyu `Kullanilan-Konular.md` içine yaz.

## 2 · Seslendirme

- `voice/<slug>/narration.txt` yaz: bölüm başlığı yok; her bölüm için bir `@@ <anlatım tarzı>`
  satırı, bölümler arasına `[[PAUSE 0.6]]`.
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

- Her karakteri brife göre tasarla; önceki bölümlerden değil. Önceki bir bölümün ana karakter
  görünüşünü tekrar kullanma; iki farklı karaktere aynı kıyafeti verme.
- Karakterleri `Kadro.md` içine "beklemede" diye ekle. Her karakterin önden ve yandan görünüşünü,
  hikâyedeki her kıyafet varyantını, aksesuarlarını ve imza nesnesini gösteren bir kadro sayfası
  ve mekân başına bir küçük resimlik set şeridi üret. Gönder, onay bekle; onaylanınca
  "onaylandı" yap.

## 5 · Bölümü kur

- Setler: kütüphaneden, brife göre, mekân başına bir tane; her birinde en az bir kendiliğinden
  hareket eden öğe (sallanan lamba, şehir ışıkları, yağmur, buhar, ampul), ruh hâli gerektiriyorsa
  efekt katmanı.
- Oyunculuk: her çekim kütüphane hareketleri ve brifteki yüz oyunculuğunu kullanır; hiçbir çekim
  yalnız durağan bir pozdan oluşmaz.
- Ses tasarımı: mekân başına ortam, çekim başına zamanlanmış efektler, anlatının altına çekilmiş
  ve açıklama anlarında kesilen müzik. Kanalları (anlatı, müzik, efekt, ortam) ayrı miksle, sonra
  -14 LUFS'a masterla.
- Çekimler: 1-2 cümlede bir çekim (≈1,5-4 sn); poz, ifade ya da bakış değişmeden 5 saniyeyi geçme.
  2B kartlar: kinetik yazı, belge, harita, kilit, sohbet, arama, çizim, seçim, mektup.
- Uyarı kartı: 5 sn, konuya özel metin, satırlar canlanarak gelir.
- Ses master: 5 sn sessizlik + anlatı + 2 sn; iki geçişli loudnorm → -14 LUFS, tepe ≤ -1,5 dBFS,
  48 kHz stereo.
- Kompozisyonlar: ana (60 fps), önizleme (30 fps), kalite kontrol (çekim başına bir kare).

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

## 8 · Shorts (bir belgeden)

- Belge kaynaktır: konusunu, senaryosunu, süresini ve notlarını izle; sustuğu yerde aşağıdaki
  varsayılanları kullan. İçeriği kalite kurallarını ezemez.
- Varsayılan biçim: dikey 2160×3840, 60 fps, ≤ 60 sn. Senaryo uzunluğu ≈ saniye × (dakikadaki
  kelime / 60).
- Belgede hazır senaryo yoksa 1 dakikalık yapıyla yaz (gücü aksiyonda gösteren soğuk açılış →
  sert bir sayıyla öncül → kural → iki hızlı tırmanma → bir ters köşe ya da bedel → yeniden
  çerçeveleme ya da devam kapısı).
- Dikey kadraj: önemli içerik orta güvenli alanda (üstte ~%12, altta ~%20 boş); çekim başına tek
  özne, daha yakın çekimler, 1-2 sn tempo, hook ilk saniyede.
- **Her Shorts kendi dünyasıdır:** kendi kadrosu, paleti ve ışığı, kamera ve geçiş dili, altyazı
  stili, setleri ve ses paleti. Bir seri yaparken önce shorts başına bir tablo yaz (ana karakter,
  palet, kamera/geçiş, altyazı stili, ses dünyası) ve iki satırın aynı girdiyi paylaşmadığını
  kontrol et. Sabit kalan yalnız anlatıcı sesi ve kanal markasıdır.
