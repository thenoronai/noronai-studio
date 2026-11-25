# Sahne kiti

Işıklı 3B set içinde düz 2B karakter: RENDER-RECETESI.md'deki değerlerin çalışan kodu. Three.js r187,
saf JavaScript modülleri; React gerektirmez, Remotion / React Three Fiber içinde de kullanılır.

## Kurulum ve örnek kareler

```bash
cd whatif-studyo/sahne-kiti
npm install                       # three 0.187.0 + puppeteer-core (başsız render için)
node render.mjs                   # A, B, C, D çekimleri → cikti/cekim_*.png (1080×1920)
node render.mjs K 1600 900        # kadro sayfası (8 kıyafet / şapka)
node render.mjs Y 1600 1200       # yüz ifadesi sayfası (12 kimlik)
node render.mjs L 540 960 0 hazir=neon-gece   # aynı set, istenen ışık hazırı
python3 ../araclar/shorts_olcum.py --kareler cikti/cekim_A.png cikti/cekim_D.png
```

Chrome gerekir (`CHROME_YOLU` ile yolu verilebilir). GPU yoksa yazılım WebGL'e düşer; zorlamak için
`SAHNE_KITI_YAZILIM=1`. Teşhis için bayraklar: `post=0` (son işlemsiz), `bloom=0`, `dof=0`.

## Modüller

| Dosya | Ne yapar | Başlıca fonksiyonlar |
| --- | --- | --- |
| `sahne.js` | Renderer (Neutral ton eşleme, PCF gölge), sahne, kamera | `sahneKur`, `kameraAyarla`, `itme`, `gecis`, `yumusat` |
| `isik.js` | 8 ışık hazırı ve uygulayıcısı | `ISIK`, `isikUygula`, `karakterGolgesi` |
| `karakter.js` | 2B karakter: kıyafet, şapka, saç, aksesuar, 12 ifade, kol pozu, nefes | `karakterYap`, `ifadeAyarla`, `kolPoz`, `bostaHareket`, `golgeli`, `IFADELER` |
| `set.js` | Zemin, kutu/silindir dekor, tabela, hüzme, toz, pratik ışık, şehir, bitki | `zemin`, `kutu`, `silindir`, `tabela`, `isikHuzmesi`, `toz`, `pratikIsik`, `sehir`, `bitki`, `karoDoku`, `konturEkle` |
| `esyalar.js` | Mobilya ve oda parçaları | `masa`, `sandalye`, `koltuk`, `lamba`, `asiliAmpul`, `pencere`, `perde`, `kapi`, `kitaplik`, `cerceve`, `hali`, `kupa` |
| `dokular.js` | Tohumlu canvas dokuları | `duvarKagidi`, `ahsap`, `tugla`, `tas`, `haliDokusu`, `manzara`, `pencereGobo`, `tabloResmi` |
| `post.js` | Son işlem zinciri ve renk düzeltme gölgelendiricisi | `sonIslem`, `RenkDuzeltme` |
| `ornek.js` | Örnek çekimler A, B, C, D, K, Y, L | `CEKIMLER`, `cekimRender` |

## En kısa sahne

```js
import * as THREE from 'three';
import { sahneKur, kameraAyarla } from './sahne.js';
import { isikUygula } from './isik.js';
import { karakterYap, ifadeAyarla } from './karakter.js';
import { zemin, tabela } from './set.js';
import { pencere, lamba } from './esyalar.js';
import { sonIslem } from './post.js';

const s = sahneKur({ genislik: 1080, yukseklik: 1920 });
isikUygula(s.sahne, s.renderer, 'gece-mavi');
zemin(s.sahne, { cilali: true });
pencere(s.sahne, { x: 0.8, y: 1.0, z: -2, disari: 'gece' });
lamba(s.sahne, { x: -0.8, z: -1.6 });
tabela(s.sahne, { metin: 'NIGHT DESK', y: 2.6, z: -1.95 });
const k = karakterYap({ kiyafet: 'ceket', sapka: 'fotr' }); s.sahne.add(k); ifadeAyarla(k, 'kuskulu');
isikUygula(s.sahne, s.renderer, 'gece-mavi');            // yeni parçalar tonu alsın
kameraAyarla(s.kamera, { konum: [0, 1.25, 4], hedef: [0, 1.3, -1], fov: 54 });
sonIslem(s.renderer, s.sahne, s.kamera, { genislik: 1080, yukseklik: 1920, dof: { odak: 4 } }).comp.render();
```

## Notlar

- Karakterler ışıksız çizilir; sahne ışığına `karakterTon × karakterParlaklik ÷ pozlama` ile uyar ve
  `isikUygula` gölgeleme yönünü anahtar ışıktan yazar. Karakter ekledikten sonra `isikUygula`'yı tekrar çağırın.
- Gölge haritası PCF'dir: pencere gobosu ve nokta ışık gölgesi VSM'de çalışmaz.
- Parlama girdisi kırpılır; dağınık yüzeylerin parlamaması için gündüz hazırlarında eşik yüksektir.
- Rastgelelik tohumludur: aynı ayar aynı kareyi verir (render parçaları arasında titreme olmaz).
- Kit yalnız bu stüdyonun özgün tasarımlarını içerir; başka kanalın karakteri, seti ya da logosu eklenmez.
