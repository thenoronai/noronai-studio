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
