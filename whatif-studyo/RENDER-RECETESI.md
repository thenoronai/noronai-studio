# Render reçetesi: referans görünümü kod ile üretmek

Bu dosya SHORTS-FORMULU.md 6'daki görsel dilin sayısal karşılığıdır. Uygulaması `sahne-kiti/`
klasöründedir (Three.js r187, saf JavaScript, React gerekmez); ölçümü `araclar/shorts_olcum.py`
yapar. Değerler, referans kanalın 18 Short'undan alınan 198 karenin ölçümüyle ve kitin bu
değerlerle render edilmiş örnek kareleriyle karşılaştırılarak ayarlandı (25 Kasım 2026).
Kitin örnek kareleri: `node sahne-kiti/render.mjs` (bkz. `sahne-kiti/BENIOKU.md`).

Başka kanaldan yalnız mekanizma alınır: karakter, set, tabela adı, palet sırası ve hikâye bu stüdyonundur
(KUTUPHANE.md tekrar kuralları, SHORTS-FORMULU 6 giriş).

## 1. Hedef görünüm

**Işıklı, dekoru yoğun 3B set içinde kalın konturlu, düz renkli 2B karakter.**

- **Karakter:** ışıksız düz dolgu, koyu kalın kontur, hafif yumuşak gölgeleme ve ışığa bakan kenarda
  ince kenar ışığı; sahnenin ışık rengini alır (gece leylak-mavi, abajur altında sıcak).
- **Set:** gerçek ölçekli 3B mekân; duvar dokusu, mobilya, tabela, pencere arkasında manzara, ön planda
  bulanık nesne. Boş duvar ve boş zemin yok.
- **Işık:** her karede görünen bir pratik kaynak (ampul, abajur, tabela, pencere), havada toz ya da
  hüzme, turuncu ↔ mavi zıtlığı.
- **Kamera:** göz hizası ya da hafif alçak, sığ alan derinliği, sürekli yavaş itme.
- **Son işlem:** yalnız ışık kaynakları parlar; kare sise boğulmaz; hafif vinyet ve gren.

## 2. Ölçülen hedef

`shorts_olcum.py` 11 kareyi (videonun %4–94'ü) 540×960'a indirir, 4×4 kutu ortalamasıyla 135×240 yapar
ve altyazı bandını (yüksekliğin %64–77'si) dışarıda bırakır. Referans sütunu 18 videonun video başına
medyanlarının medyanı ve P10–P90 aralığıdır; kanal sütunu IF Theory Flix'in ilk üç Shorts'u (en düşük–en
yüksek); kit sütunu `sahne-kiti` örnek çekimleri A–D.

| Ölçü | Tanım | Referans | IF Theory Flix | Kit (A–D) | Hedef (araçta WARN) |
| --- | --- | --- | --- | --- | --- |
| Parlaklık | ortalama luma (0–255) | 112 (66–138) | 50 (28–51) | 91 | 55–165 |
| Kontrast | luma standart sapması | 48,7 (43–57) | 35 (20–38,5) | 47,9 | ≥ 38 |
| Renklilik | Hasler–Süsstrunk | 69 (38–83) | 31 (21–34) | 60 | ≥ 34 |
| Karanlık alan | luma < 35 piksel oranı | 0,04 (0,01–0,18) | 0,33 (0,31–0,90) | 0,11 | ≤ 0,25 |
| Detay yoğunluğu | Sobel > 160 piksel oranı | 0,118 (0,097–0,178) | 0,045 (0,041–0,120) | 0,117 | ≥ 0,08 |
| Düz alan | Sobel < 20 piksel oranı | 0,54 (0,47–0,61) | 0,85 (0,79–0,87) | 0,55 | ≤ 0,70 |
| Sıcak/soğuk değişimi | karelerin (R−B) ortalamasının std'si | 42 (22–63) | 19,5 (11–20) | 41 | ≥ 15 |

Palet: referans karelerinde doygunluk ağırlıklı ton dağılımının %42'si kırmızı-turuncu-sarı (0–60°),
%43'ü camgöbeği-mavi (180–270°); yeşil ve mor azdır. Kare kare bakınca kontrast hiç düşmez, sahneler
sıcak ve soğuk arasında gidip gelir; karanlık sahnelerde bile karakterin yüzü orta tonda kalır.

## 3. Karakter (2B)

| Ölçü | Değer (boy 1,7 birim = 1,7 m) |
| --- | --- |
| Kafa | yarıçap 0,245 (çap boyun %29'u), merkez 1,335 |
| Gövde | 0,44 × 0,56, alt kenar 0,47; köşe yarıçapı 0,11 |
| Kol / bacak | 0,048 / 0,05 kalınlıkta çubuk; kol 0,44 (omuzdan pivot, 0,98), bacak 0,5 |
| Kontur | 0,022 (kafa yarıçapının %9'u), #15151c |
| Malzeme | ışıksız (`MeshBasicMaterial`), renk = tasarım rengi × karakter tonu × karakter parlaklığı ÷ pozlama |
| Yumuşak gölgeleme | ışık yönünde ±%10–24 ton farkı, gölge kenarı koyulaşır; kenar ışığı anahtar ışığın renginde (güç 0,12–0,55) |
| Gölge | görünmez kapsül gölge düşürür; ayak altında yumuşak temas gölgesi |

- **Kıyafet:** `gomlek`, `ceket` (V yaka + iç gömlek + düğme), `uniforma` (kemer, toka, iki sıra düğme,
  rozet), `cubbe` (bileğe kadar, kuşaklı), `elbise` (dize kadar, bel bantlı). **Şapka:** `kep`, `tac`,
  `fotr`, `bere`. **Aksesuar:** `kravat`, `gozluk`, `kask`. **Saç:** `kakul`, `yan-ayrik`, `kivircik`,
  `topuz`, `kel`. Rol = kıyafet + tek aksesuar (SHORTS-FORMULU 6.1).
- **Yüz:** 12 kimlik (`yuz.notr` … `yuz.uykulu`, SHORTS-FORMULU 6.2); `aci` teni kızartır, `hasta`
  yeşile çeker, `sinirli` hafif kızartır.
- **Ten:** varsayılan #f4dcc4. Çok açık ten (#f2e6d8 ve üstü) gece hazırlarında griye kaçar.
- **Kadro ve ifade sayfası:** `node render.mjs K 1600 900` (8 kıyafet) ve `node render.mjs Y 1600 1200`
  (12 ifade). URETIM.md 4 KAPI'daki kadro sayfası bu düzende üretilir.

## 4. Set

- **Ölçek:** metre. Kapı 0,92 × 2,05; masa 0,75 yüksek; tavan 3,2–3,5.
- **Katmanlar (her karede):** ön planda 1–3 nesne (alan derinliğiyle bulanık), orta planda en az 8 dekor
  parçası, arkada bir uzak katman (pencere manzarası, şehir silueti, gökyüzü gradyanı). Mekânın adını
  veren bir sahne yazısı ve kendiliğinden hareket eden en az bir öğe (toz, salınan ampul, şehir ışıkları).
- **Kitteki parçalar:** `zemin` (cilalı yansımalı ya da desenli), `kutu`, `silindir`, `tabela` (parlayan ya
  da düz, çok satırlı), `isikHuzmesi`, `toz`, `pratikIsik`, `sehir`, `bitki`; `esyalar.js`: `masa`,
  `sandalye`, `koltuk`, `lamba`, `asiliAmpul`, `pencere` (manzara + gobo'lu ay/güneş ışığı), `perde`,
  `kapi`, `kitaplik`, `cerceve`, `hali`, `kupa`.
- **Dokular (`dokular.js`, tohumlu):** `duvarKagidi` (damask, şerit, ekose), `ahsap`, `tugla`, `tas`,
  `karoDoku`, `haliDokusu`, `manzara` (gece/gün), `pencereGobo`, `tabloResmi`.
- **Malzeme:** duvar pürüzlülük 0,8; ahşap 0,5–0,6; metal metalness 0,45–1, pürüzlülük 0,25–0,4; cilalı
  zemin yansıması 0,18–0,25 (yansıma dokusu 320 px: bilerek yumuşak).
- **Kontur:** dekorda 0,012 (ters yüz kabuğu); duvar, zemin, tavan konturlu değildir.
- **Duvar ve tavan gölge düşürmez** (`golge: false`): pencereden ve dışarıdan gelen ışık içeri girer.
- **Hazır varlık (isteğe bağlı):** dekor yoğunluğunu artırmak için CC0 modeller ve dokular kullanılabilir:
  Poly Haven (HDRI, doku, model), ambientCG (doku), Kenney ve Quaternius (stilize model). GLTFLoader ile
  yüklenir, gölge açılır, kontur `konturEkle` ile verilir. Lisans CC0 olsa da `Kaynaklar.md`'ye adı ve
  bağlantısı yazılır; ticari kullanımı yasak (NC) ya da lisansı belirsiz varlık kullanılmaz; başka bir
  kanalın karakteri, seti, logosu ya da görseli asla kullanılmaz.

## 5. Işık hazırları

Kimlikler SHORTS-FORMULU 6.4 ile aynıdır; değerler `sahne-kiti/isik.js` dosyasından üretildi. Güçler
three.js fiziksel birimlerindedir (r155+); renkler sRGB.

| Hazır | Gök (üst → alt) | Anahtar ışık (renk, güç, yön x,y,z) | Yarıküre (gök, yer, güç) | Ortam (env) | Sis (renk, yoğunluk) | Pozlama | Parlama (güç / yarıçap / eşik / tavan) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `isik.gunduz` | #7fbdf5 → #dff0ff | #fff0d8, 3,2, (0,55; 1; 0,65) | #d6ecff, #9c8a6c, 1,6 | 0,4 | #d8ecff, 0,01 | 1 | 0,3 / 0,12 / 2,4 / 6 |
| `isik.altin-saat` | #f08a6a → #ffd9a0 | #ffa766, 3,6, (-0,85; 0,32; 0,4) | #ffcfa0, #5e4a74, 1,3 | 0,3 | #ffbf96, 0,022 | 1,05 | 0,4 / 0,15 / 1,8 / 5 |
| `isik.gece-mavi` | #0b1534 → #26407a | #9cbcff, 1,4, (0,35; 1; 0,5) | #5a78c8, #14141e, 0,55 | 0,12 | #1e2e5e, 0,03 | 1,15 | 0,55 / 0,15 / 1 / 2,5 |
| `isik.neon-gece` | #12051f → #3a1252 | #d07bff, 1,2, (-0,4; 1; 0,5) | #8a4ad0, #10061a, 0,8 | 0,12 | #2a0f45, 0,035 | 1,15 | 0,7 / 0,2 / 0,9 / 2,5 |
| `isik.tek-ampul` | #08070a → #17130f | #ffc27a, 2,2, (0,05; 1; 0,15) | #5a4a3a, #050405, 0,35 | 0,06 | #16110c, 0,045 | 1,1 | 0,55 / 0,15 / 1 / 2,5 |
| `isik.floresan` | #dfe8ea → #f4f7f6 | #eefaff, 2,4, (0,1; 1; 0,2) | #e8f6ff, #7a8a88, 1,4 | 0,4 | #dde8e6, 0,016 | 1 | 0,3 / 0,12 / 2,4 / 6 |
| `isik.dijital` | #140a3c → #3b2a9c | #a79cff, 1,3, (0,2; 1; 0,6) | #7b6cff, #0a0626, 0,9 | 0,15 | #251766, 0,03 | 1,1 | 0,7 / 0,2 / 0,9 / 2,5 |
| `isik.tehlike` | #1a0404 → #3c0a0a | #ff3b2e, 2, (0,6; 0,8; 0,5) | #ff5a4a, #120404, 0,7 | 0,1 | #2a0606, 0,03 | 1,1 | 0,55 / 0,15 / 1 / 2,5 |

| Hazır | Lift (r; g; b) | Gain (r; g; b) | Doygunluk | Sıcaklık | Vinyet | Gren | Karakter tonu (r; g; b) | Karakter parlaklığı | Gölgeleme / kenar ışığı |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `isik.gunduz` | 0,035; 0,035; 0,045 | 1,03; 1; 0,97 | 1,15 | 0,04 | 0,16 | 0,012 | 1; 1; 1 | 0,95 | 0,1 / 0,15 |
| `isik.altin-saat` | 0,05; 0,03; 0,05 | 1,07; 1; 0,93 | 1,18 | 0,1 | 0,24 | 0,014 | 1,06; 0,94; 0,86 | 0,92 | 0,16 / 0,35 |
| `isik.gece-mavi` | 0,04; 0,05; 0,1 | 0,94; 0,99; 1,08 | 1,12 | -0,1 | 0,32 | 0,016 | 0,84; 0,88; 1 | 0,85 | 0,16 / 0,45 |
| `isik.neon-gece` | 0,06; 0,03; 0,09 | 1,02; 0,95; 1,08 | 1,25 | -0,02 | 0,34 | 0,018 | 0,92; 0,72; 1 | 0,85 | 0,18 / 0,55 |
| `isik.tek-ampul` | 0,035; 0,025; 0,02 | 1,06; 1; 0,9 | 1,05 | 0,1 | 0,48 | 0,02 | 1; 0,86; 0,68 | 0,9 | 0,24 / 0,2 |
| `isik.floresan` | 0,03; 0,04; 0,04 | 0,98; 1,02; 1 | 0,98 | -0,04 | 0,2 | 0,012 | 0,95; 1; 1 | 0,95 | 0,1 / 0,12 |
| `isik.dijital` | 0,05; 0,03; 0,12 | 0,98; 0,96; 1,1 | 1,2 | -0,08 | 0,3 | 0,014 | 0,8; 0,78; 1,05 | 0,88 | 0,16 / 0,45 |
| `isik.tehlike` | 0,06; 0,02; 0,02 | 1,1; 0,92; 0,92 | 1,2 | 0,05 | 0,45 | 0,02 | 1; 0,62; 0,6 | 0,9 | 0,22 / 0,35 |

- **Pratik ışık:** `PointLight`, sönüm 2, güç 1–3, duvardan en az 0,4 m uzakta (yakınsa duvarda 20–50
  değerinde sıcak nokta oluşur ve tüm kare parlar). Görünen ampul emissive 4–6, abajur içi 0,9.
- **Pencere ışığı:** `SpotLight` 40–70, açı 0,36 rad, yarı gölge 0,3, `pencereGobo` haritası. Gobo yalnız
  gölge açıkken çalışır ve **PCF** gölge haritası ister (VSM'de spot gobosu ve nokta ışık gölgesi çalışmaz).
- **Karakter tonu:** hazırdan gelir; çekime özel değiştirilebilir (`isikUygula(..., { karakterTon })`):
  gece odasında abajur altında duran karakter için ör. [0,98; 0,92; 0,9].
- **Sıra:** karakterler ve dekor eklendikten sonra `isikUygula` bir kez daha çağrılır (yeni parçalar tonu
  ve gölgeleme yönünü alır).

## 6. Kamera ve kompozisyon

| Ayar | Değer |
| --- | --- |
| Biçim | 1080 × 1920, 30 fps, piksel oranı 1 |
| Dikey görüş açısı | geniş 56–60°, orta 50–56°, yakın 45–50°; kadro sayfası 28–30° |
| Kamera yüksekliği | 1,1–1,3 m (karakter göz hizası 1,33); dış çekim alçak açı 0,5 m |
| Kafa konumu | kare yüksekliğinin %35–50'si |
| Altyazı bandı | %64–77 boş kalır: yüz, tabela yazısı ve ana eylem bu banda girmez |
| Alan derinliği | odak = kamera–özne mesafesi; açıklık orta planda 0,0012, yakın planda 0,003–0,004; en çok bulanıklık 0,006–0,01 |
| İtme | 0,0025 birim/kare (30 fps'te 0,075 m/sn); her bekleme bir hareket taşır |
| Yatık kadraj | 5–6°, yalnız tehlike anlarında |
| Dehşet yakın planı | yüz kare genişliğinin %45–55'i, video başına bir kez |

## 7. Son işlem zinciri

Render → (isteğe bağlı GTAO) → parlama → alan derinliği → OutputPass (Neutral ton eşleme + sRGB) →
renk düzeltme (lift / gamma / gain, doygunluk, sıcaklık, vinyet, gren). `post.js` içindeki `sonIslem()`.

- **Parlama girdisi kırpılır** (tavan 2,5–6, ton korunur): yalnız parlamaya giden kopya kırpılır, ana
  görüntü değişmez. Gece hazırlarında eşik 1,0; gündüzde 1,8–2,4 (yoksa güneş alan duvar da parlar).
  Yarıçap 0,12–0,2: büyük yarıçap kareyi sise boğar.
- **Renderer:** `NeutralToneMapping`, `PCFShadowMap`, anahtar gölge 2048 (spot 1024), `shadow.radius` 1–5,
  ortam ışığı `RoomEnvironment` (yoğunluk hazırdan, 0,06–0,4).
- **Render süresi:** GPU'suz yazılım WebGL'de 1080 × 1920 kare başına 2,5–5 sn. 60 sn'lik Shorts
  (1800 kare) GPU'lu makinede render edilmeli (Remotion'da `--gl` ayarı); yazılım WebGL yalnız önizleme
  karesi içindir.

### Remotion ve React Three Fiber ile kullanım

Kit saf Three.js nesneleri döndürür; `<ThreeCanvas>` içinde `<primitive object={...} />` ile eklenir,
kurulum `useThree()` ile alınan `scene` ve `gl` üzerinde bir kez yapılır, zamanlı her şey
`useCurrentFrame()` ile sürülür:

```jsx
const { scene, gl } = useThree();
const kare = useCurrentFrame();
const set = useMemo(() => { const g = new THREE.Group(); /* zemin(g, …), pencere(g, …), karakterYap(…) */ return g; }, []);
useLayoutEffect(() => { isikUygula(scene, gl, 'gece-mavi', { hedef: new THREE.Vector3(0, 1, -1) }); }, [scene, gl]);
set.traverse((o) => o.userData?.guncelle?.(kare / 30)); // toz, salınan ampul
return <primitive object={set} />;
```

Son işlem için iki yol var. (1) `@react-three/postprocessing`: `Bloom` (intensity = güç, luminanceThreshold
= eşik, luminanceSmoothing 0,35, mipmapBlur, radius ≈ yarıçap), `DepthOfField`, `Vignette` (darkness =
vinyet), `Noise` (opacity = gren), `ToneMapping` (NEUTRAL) ve `RenkDuzeltme` gölgelendiricisinden bir
özel efekt. (2) Kitin `sonIslem()` zincirini olduğu gibi kullanmak. Bu iki yol bu ortamda Remotion içinde
denenmedi; denenen yol `sahne-kiti/render.mjs` ile başsız render'dır. İlk kullanımda bir kareyi iki yolla
render edip `shorts_olcum.py --kareler` ile karşılaştırın; sayılar 8. bölümdeki aralıkta kalmalı.

## 8. Görsel ölçüm (kalite kontrol)

- **Önizlemede:** her çekimden bir kare (URETIM.md 5 "kalite kontrol" kompozisyonu) →
  `python3 araclar/shorts_olcum.py --kareler kalite/*.png`. Kare başına sayılar ve özet yazılır.
- **Bitmiş videoda:** `shorts_olcum.py --video final.mp4` görsel ölçüyü kendiliğinden ekler
  (`--gorsel-yok` ile atlanır).
- Görsel ölçüler WARN düzeyindedir: karanlık temalı bir bölüm karanlık alan sınırını bilerek aşabilir;
  aşıldığında bölüm notuna nedeni yazılır.
- Eşikler `HEDEF_GORSEL` sözlüğündedir; 2. bölümdeki tabloyla aynı tutulur.

## 9. Sorun giderme

| Belirti | Neden | Çözüm |
| --- | --- | --- |
| Kare sise boğulmuş, her şey süt beyazı | Parlama eşiği düşük ya da yarıçap büyük; duvara yakın pratik ışık | Eşiği gündüzde 1,8–2,4 yap, yarıçapı ≤ 0,2; pratik ışığı duvardan 0,4 m uzaklaştır, gücü 1–3 |
| Açık ten beyaza patlıyor | Pozlama × ton > 1 | `karakterParlaklik` 0,85–0,95; çekime özel `karakterTon` |
| Pencere ışığı yere düşmüyor | VSM gölge haritası, duvar gölge düşürüyor | PCF; duvar `golge: false`; spot `castShadow` açık |
| Karanlık alan > 0,25 | Tavan ve üst duvar ışıksız, kamera fazla yukarı bakıyor | Tavan rengi açık, sarkık ampul ya da aplik, görüş açısını 52°'ye indir |
| Düz alan > 0,70 (çoğu yakın plan) | Arkada dokusuz yüzey | Dokulu panel, derinlikte dekor, hüzme ya da toz |
| Detay < 0,08 | Set seyrek | 4. bölümdeki katman sayıları; hazır CC0 varlık |
| Yansıma keskin ve dikkat dağıtıyor | Yansıma dokusu yüksek çözünürlüklü | 256–384 px, yansıma ≤ 0,25 |
| Sahneler arası değişim < 15 | Tek mekân, tek hazır | Mekân değiştikçe hazır değiştir (sıcak ↔ soğuk) |

## 10. Bir sahneyi kurma sırası

1. Brifteki mekân ve saatten ışık hazırını seç (SHORTS-FORMULU 6.4).
2. Kabuk: zemin, dokulu duvarlar, tavan (duvar ve tavan gölge düşürmez).
3. Uzak katman: pencere manzarası, şehir ya da gökyüzü.
4. Orta plan: en az 8 dekor parçası ve mekânın adını veren sahne yazısı.
5. Pratik ışıklar ve kendiliğinden hareket eden bir öğe.
6. Ön plan: 1–3 nesne.
7. Karakterler: kadro sayfasındaki kıyafet, ifade ve kol pozu; ardından `isikUygula` tekrar.
8. Kamera: 6. bölümdeki görüş açısı, yükseklik ve kompozisyon.
9. Son işlem: `sonIslem(..., { dof })`.
10. Ölç: `shorts_olcum.py --kareler`; WARN varsa 9. bölümdeki tabloya bak.
