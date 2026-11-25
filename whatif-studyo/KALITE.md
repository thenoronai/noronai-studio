# Kalite kuralları

Bunlar geçmeden teslim yok. Her kural gerçek bir bölümde yaşanmış bir hatadan doğdu. Yeni bir
hata türü çıktığında önce `Dersler.md` içine yazılır; ikinci kez çıkarsa buraya kural olarak
eklenmesi önerilir.

1. **Donmuş çekim yok.** Her 3B çekimde gerçek bir kamera hareketi (≈%20 itme ve sürüklenme) ve
   her oyuncuda boşta yaşam (salınım, bakışlar) olur. 2B kartlar hafif bir canlılık katmanıyla
   sarılır: yalnız kaydırma ve tek bir döşenmiş toz katmanı (4K kartı her karede yeniden
   ölçeklemek ya da parçacık başına öğe kullanmak render süresini katlar).
   Kontrol: `ffmpeg -i video.mp4 -vf "fps=6,scale=480:-1,freezedetect=n=0.003:d=1.5" -f null -`
   → 2 saniyeyi geçen donma sıfır olmalı.
2. **Sert kesme yok.** Çekimler 0,3 sn bindirilir: aynı mekân → çözülme, yeni mekân ya da bölüm →
   hızlı kaydırma, kartlar → yakınlaşma. Çekimler arasında siyah kare olmaz.
   **Shorts'ta:** geçişlerin çoğu sesli kamera hareketidir (pencereden ya da kapıdan geçerek uçuş,
   hareket eden nesneyi takip, hızlı çevirme); çözülme yalnız mekân ya da zaman değişiminde, 6–8
   kare. Sert kesme yalnız büyük atlamada (gece → sabah, içeri → uzak bir yer) ve seyrek: referans
   medyanı video başına 1, en çok ~10; her biri bir sesle (whoosh ya da vuruş) gelir. Finaldeki
   hızlanan kısa kesme dizisi bu sayının istisnasıdır.
3. **Oturan herkes bir şeyin üstünde oturur.** Rig oturma pozuna kendiliğinden sandalye, tabure ya
   da bank ekler; yatak ve kanepe gibi seti çizen oturaklar ayrıca işaretlenir.
4. **Dizüstü bilgisayar her zaman ellerin tam altındadır** ve yüzü kapatmayacak kadar küçüktür.
5. **Oturan oyuncuların önündeki masa** gövdeyi ve yüzü kapatmayacak yüksekliktedir.
6. **Hiçbir şey havada durmaz.** Ayaklar yerde ya da oturakta. Arayüz ve sahne yazıları kadrajın
   içinde kalır. Kinetik kartların ilk satırı ilk kareden görünür.
7. **Kalite kontrol kareleri:** teslimden önce çekim başına bir kare çeyrek çözünürlükte render
   edilir, 8×4 kontak sayfalarına döşenir, her çekime bakılır, düzeltilir, yeniden bakılır.
   Bulutta tam 4K render yapılmaz; hedef video başına tek 4K render.
8. **Çeşitlilik:** `araclar/cesitlilik.py` geçer.
9. **Ses:** 1,2 saniyeden uzun istenmeyen sessizlik yok; master -14 LUFS, tepe ≤ -1,5 dBFS.
   **Shorts'ta:** anlatıda 0,45 saniyeyi geçen duraklama yok; müzik yatağı konuşmanın 10–16 dB
   altında ve hiç susmaz; her kamera hareketi ve sert kesme bir sesle başlar.
10. **Shorts ölçümü:** `araclar/shorts_olcum.py` FAIL vermez (süre, -14 LUFS, gerçek tepe, ilk
    kelime ≤ 0,4 sn, son kelimeden sonra ≤ 0,8 sn, kelime/dk, ilk görsel değişim ≤ 1,5 sn). WARN
    satırları bölüm notuna yazılır ve gerekçesi verilir.
11. **Shorts açılışı ve kapanışı:** ilk kare hikâyenin içindedir (logo, başlık kartı, siyah ya da boş
    kare yok); kanca soru değil olmuş gibi söylenir ve ilk 10 saniyede cevaplanmaz; video son
    kelimede biter, öğüt, özet ya da "abone ol" cümlesi yok. Tam ekran yazı kartı video başına en
    çok 2 sn; mekanizma sahnenin içinde gösterilir.

12. **Görsel ölçüm:** kalite kontrol kareleri ve bitmiş Shorts `shorts_olcum.py` görsel satırlarından
    geçer: parlaklık 55–165, kontrast ≥ 38, renklilik ≥ 34, karanlık alan ≤ 0,25, detay ≥ 0,08, düz
    alan ≤ 0,70, sahneler arası sıcak/soğuk değişimi ≥ 15 (RENDER-RECETESI 2 ve 8). Her karede görünen
    bir pratik ışık kaynağı ve mekânın adını veren bir sahne yazısı vardır; altyazı bandında (kare
    yüksekliğinin %64–77'si) yüz ya da ana eylem yoktur. Karanlık temalı bölüm sınırı bilerek
    aşabilir; WARN satırı gerekçesiyle bölüm notuna yazılır.

## Bu kuralların doğduğu hatalar

- Bir incelemede 846 saniyenin ~438 saniyesi donuktu; yalnız sert kesmeler vardı; hiçbir yerde
  sandalye yoktu; dizüstü karakterden uzaktaydı; bir panel kadraj dışına taşıyordu; bir karakter
  çitin üstünde havada duruyordu; uyarı kartı 8 saniye durağandı.
- Dakikada 140 kelime varsayımı 13 dakika hedeflenen bölümü 9:59 yaptı (gerçek okuma hızı
  ~185'ti) → okuma hızı ilk seslendirmeden ölçülür ve defterde tutulur.
- 4K'da yüksek eşzamanlılık Chrome'u bellek hatasına düşürdü → parçalı render, düşük eşzamanlılık.
- Ağır canlılık katmanı kart ağırlıklı bölümleri ~4 kat yavaşlattı → hafif katman.
- Karakterler, setler ve sesler bölümler arasında tekrar ediyordu → ortak kütüphane, senaryodan
  tasarım brifi ve tekrar kontrolü.
- Kasım 2026'daki ilk üç Shorts 9, 26 ve 93 izlenmede kaldı; izleyicilerin %57–75'i ilk saniyelerde
  kaydırıp geçti. Ölçüm: iki videoda sürenin yarısı tam ekran yazı kartı, hızlı kamera hareketi 0–9
  (referansta 19), kanca soru ve 6–11. saniyede cevaplanıyor, iki video öğütle bitiyor, duraklamalar 400–600 ms,
  müzik konuşmanın ~18 dB altında, kelime altyazısı yok. Aynı ay on milyonlarca izlenen referans
  Shorts'larda bunların hiçbiri yok → kural 2, 9, 10 ve 11'in Shorts ekleri ve SHORTS-FORMULU.md.
- Aynı üç Shorts'un kareleri ölçüldü: ortalama parlaklık 28–51 (referans 66–138), renklilik 21–34
  (referans 38–83), karenin %31–90'ı neredeyse siyah (referansta %1–18), detay yoğunluğu referansın
  üçte biri, sahneler arası ışık değişimi yok denecek kadar az → kural 12, RENDER-RECETESI.md ve
  `sahne-kiti/`.
