---
name: whatif-studyo
description: Hafızalı "What If" video stüdyosu. Bir konudan ya da belgeden yuvarlak kafalı çöp adam karakterli, tek anlatıcılı bir What If videosu üretir (senaryo, seslendirme, Three.js + Remotion, kalite kontrol, 4K render) ve her bölümde kanalın kurallarını, kullanılan konuları, karakterleri ve dersleri AvenoxBeyin kasasındaki Stüdyo defterine yazar. Tetik - "what if videosu", "yeni bölüm", "konu üret", "shorts yap", "shorts ölç", "anlatıcı sesi seç", "sahne kur", "ışık hazırı", "kadro sayfası", "görsel ölç", "stüdyoyu kur", "kadro", "çeşitlilik kontrolü", "kanal defteri". Kullanma - tek not kaydetmek veya kasada aramak (beyin), kurulum sorunu (beyin-doktor), What If dışı genel video (video-motoru).
---

# What If stüdyosu

Bu skill iki şeyi birleştirir:

- **Üretim hattı:** Bir "What If" konusunu ya da belgesini baştan sona bitmiş bir videoya çeviren
  adımlar. Ayrıntılar [URETIM.md](URETIM.md), kalite kuralları [KALITE.md](KALITE.md),
  karakter, set ve ses kütüphanesi [KUTUPHANE.md](KUTUPHANE.md). Shorts'un ölçülmüş formülü
  (senaryo vuruşları, anlatıcı ve Gemini TTS tarifi, kurgu, ses tasarımı, görsel dil, yayın
  ayarları, hedef sayılar) [SHORTS-FORMULU.md](SHORTS-FORMULU.md). Görselin sayısal reçetesi
  (2B karakter, set yoğunluğu, ışık hazırları, kamera, son işlem, görsel ölçüm)
  [RENDER-RECETESI.md](RENDER-RECETESI.md); çalışan kodu ve örnek kareleri `sahne-kiti/`.
- **Hafıza:** Kanalın kuralları, kullanılmış konular, karakter görünüşleri, bölüm bölüm ne
  kullanıldığı ve öğrenilen dersler, kullanıcının AvenoxBeyin kasasındaki `Studyo` defterinde
  durur. Bir konuşmada öğrenilen şey bir sonraki bölümde kendiliğinden geçerli olur.

Stüdyo hazır bir kanal kimliği getirmez. İlk bölümde yalnız varsayılan What If biçimini bilir
(tek anlatıcı, "sen" diye anlatım, çöp adam karakterler). Onuncu bölümde kanalın tonunu, sevdiği
konu tiplerini, kullanılmış her konuyu ve hiçbir karakterin iki kez aynı giyinmediğini bilir.

## Defter

Defter vault'ta `Studyo` adlı klasördedir. Yerini bilmiyorsan vault'ta `Studyo/Kanal.md`
dosyasını ara. Yoksa "İlk çalıştırma" bölümüne geç.

| Dosya | Ne tutar | Ne zaman yazılır |
| --- | --- | --- |
| `Kanal.md` | Kanal adı, ton, anlatıcı sesi, format, yasaklar, tarz özeti | Kanal hakkında yeni bir şey öğrenince |
| `Dersler.md` | Tarihli dersler ve kalite hataları, en yenisi üstte | Kullanıcı düzeltince, kalite kontrol yeni bir hata türü bulunca |
| `Kullanilan-Konular.md` | Yapılmış her konu ve öncülü | Bir senaryo onaylanınca |
| `Kadro.md` | Her karakterin onaylı görünüşü ve durumu | Kadro kapısında onay gelince |
| `Kullanim-Gunlugu.md` | Bölüm bölüm kullanılan set, kıyafet, aksesuar, hareket, ses kimlikleri | Bölüm render'a gitmeden önce |
| `Kutuphane.md` | Kütüphane kökü ve kategori özetleri | Kütüphaneye yeni öğe eklenince |
| `Araclar.md` | Stüdyo klasörü, kurulu sürümler, seslendirme ayarı, render ayarı | Bir şey kurunca ya da değişince |
| `Acik-Isler.md` | "Bir dahaki bölüme" kalanlar | Bölüm biterken |

Her bölüm ayrıca `Studyo/Bolumler/<slug>.md` içinde bir bölüm notu taşır
(`sablonlar/BOLUM-NOTU.md`).

Ağır dosyalar (ses, render, kütüphane kodu ve önizlemeleri) vault'a girmez; stüdyo klasöründe
durur. Defterde yalnız yolları ve kimlikleri yazar.

## İlk çalıştırma

1. [KURULUM.md](KURULUM.md) adımlarını uygula. Eksik olanı kullanıcıya söyle; onun adımı olanı
   (hesap açmak, anahtar girmek) onun yerine yapma.
2. Kullanıcıya iki şey sor: defter vault'ta nereye kurulsun, stüdyo klasörü diskte nerede dursun.
   `Studyo` klasörünü aç, `sablonlar/` içindeki dosyaları (`BOLUM-NOTU.md` dışındakileri) oraya
   kopyala, `Bolumler/` klasörünü oluştur. Stüdyo klasörünü `Araclar.md` içine yaz.
3. Kanal görüşmesi yap. Soruları `Kanal.md` başlıklarından al, bir seferde en çok üç soru sor.
   Cevaplanmayan başlığı boş bırak; tahminle doldurma.
4. Kullanıcının daha önce yaptığı bölümler varsa adlarını ve öncüllerini iste,
   `Kullanilan-Konular.md` içine yaz. Tekrar kontrolü buna dayanır.

## Her bölümde

**Başlarken.** `Kanal.md` dosyasının tamamını, `Acik-Isler.md` dosyasını, `Kullanilan-Konular.md`
listesini ve `Dersler.md` içindeki `[kalıcı]` satırlarla birlikte en yeni 20 dersi oku. Konu
önerirken ya da senaryo yazarken `Kullanilan-Konular.md` içindeki hiçbir öncülü tekrar etme.
Alt ajan kullanıyorsan ilgili dersleri ve yasakları brifine koy; "deftere bak" deme.

**Üretirken.** [URETIM.md](URETIM.md) adımlarını sırayla izle. **KAPI** işaretli yerlerde dur ve
kullanıcıya göster. Kapılar dışında soru sorma; varsayılanı uygula ve bölüm notuna yaz. Shorts'ta
senaryodan önce [SHORTS-FORMULU.md](SHORTS-FORMULU.md) dosyasının tamamını oku. Set, ışık,
karakter ya da kamera kurmadan önce [RENDER-RECETESI.md](RENDER-RECETESI.md) dosyasını oku;
kütüphanede karşılığı olmayan parçaya `sahne-kiti/` modüllerinden başla.

**Render'dan önce.** `araclar/cesitlilik.py` ile tekrar kontrolünü çalıştır
(`python3 araclar/cesitlilik.py --gunluk <vault>/Studyo/Kullanim-Gunlugu.md --bolum <slug>`).
Geçmeyen bölüm render'a gitmez. [KALITE.md](KALITE.md) listesinin tamamı geçmeden teslim yok.
Shorts'ta render'dan sonra `araclar/shorts_olcum.py` çalışır; FAIL veren Shorts teslim edilmez.
Kalite kontrol kareleri render'dan önce `shorts_olcum.py --kareler` ile ölçülür (görsel satırlar WARN).

**Geri bildirim gelince.** Düzeltmeyi yap, aynı turda deftere yaz. Bir hata türü ilk kez
görüldüyse `Dersler.md` içine bir kalite kuralı olarak ekle; aynı hata ikinci kez çıkarsa
`[kalıcı]` yap ve `KALITE.md` için bir değişiklik öner.

**Bitince.** `Kanal.md` içindeki "Tarz özeti"ni yeniden yaz (eklenmez, yeniden yazılır). Bölüm
notunu doldur. Konuyu `Kullanilan-Konular.md`, kimlikleri `Kullanim-Gunlugu.md`, yeni kütüphane
öğelerini `Kutuphane.md`, yarım kalanları `Acik-Isler.md` içine taşı. Alt ajanlar deftere
kendileri yazmaz; defteri tek el yazar.

## Not alma kuralları

- **Biçim:** `- YYYY-AA-GG [bölüm-slug] Ne öğrenildi. Neden: kullanıcının gerekçesi.`
- **Kullanıcının sözünü koru.** Kendi yorumunu "Yorum:" diye ayır.
- **Tek seferlik istek ders değildir.** "Bu bölümde gece olsun" o bölümün notudur; "hep gece
  olsun" derstir. Emin değilsen bir kez sor.
- **Onay da derstir.** Beğenilen sahnenin neyinin beğenildiğini yaz.
- **Çelişki.** Eski dersi silme, üstünü çiz ve yanına yenisinin tarihini yaz.
- **Gizlilik.** Deftere API anahtarı, token ya da parola yazma; yalnız nerede durduklarını yaz.

## Sınırlar

- Yayınlama, yükleme ve mesaj gönderme kullanıcının açık onayını ister.
- Ücretli servis (bulut render, ücretli ses ya da görsel üretimi) kullanmadan önce sor.
- Seslendirme anahtarını kullanıcı kendi makinesinde ortam değişkenine koyar; sohbete yazdırma.
- Gerçek kişilerin yüzünü ya da başkasının telifli karakterini çizme. Karakterler bu stüdyonun
  kütüphanesinden ve senaryodan doğar.
- Başka kanallardan stil öğrenirken mekanizmayı al, karakteri ve içeriği kopyalama.
