// Düz 2B karakter (yuvarlak kafa, çubuk kol-bacak, kıyafetle tanımlanan gövde), 3B sahnenin içinde.
// Kurallar SHORTS-FORMULU.md 6.1–6.3: boy ≈ 3,5 kafa, kalın koyu kontur, göz bebeksiz nokta gözler,
// ifadeyi kaş ve göz kapağı taşır, rol = kıyafet + tek aksesuar. Renkler sahne ışığıyla tonlanır
// (isik.js karakterTon), gölgeyi görünmez bir gövde kopyası düşürür.
import * as THREE from 'three';

const SIYAH = 0x15151c;
const KONTUR = 0.022;

function duz(renk, z, { siyah = false } = {}) {
  const m = new THREE.MeshBasicMaterial({ color: renk, side: THREE.DoubleSide, fog: true });
  m.toneMapped = true;
  return { m, z, siyah };
}

function mesh(geo, renk, z, parent, ad, golge = null) {
  const { m } = duz(renk, z);
  const me = new THREE.Mesh(geo, m);
  me.position.z = z; me.userData.duzRenk = renk; me.name = ad || '';
  me.renderOrder = Math.round(z * 1000);
  if (golge !== null) golgeli(me, golge);
  parent.add(me);
  return me;
}

// Yumuşak 2B gölgeleme: düz dolgu, ışık yönüne göre %±(guc) aydınlanır, gölge kenarı koyulaşır ve ışığa
// bakan kenarda ince bir kenar ışığı (rim) belirir. kare: 0 = daire/oval, 1 = dikdörtgen biçimli parça.
// Yön, renk ve güç isikUygula() tarafından hazırdan (anahtar ışık) yazılır.
export function golgeli(me, kare = 0) {
  me.geometry.computeBoundingBox(); const bb = me.geometry.boundingBox;
  const u = {
    uYon: { value: new THREE.Vector2(-0.45, 0.89) }, uKare: { value: kare },
    uMerkez: { value: new THREE.Vector2((bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2) },
    uYaricap: { value: new THREE.Vector2(Math.max(1e-3, (bb.max.x - bb.min.x) / 2), Math.max(1e-3, (bb.max.y - bb.min.y) / 2)) },
    uGuc: { value: 0.14 }, uKenar: { value: 0.25 }, uKenarRenk: { value: new THREE.Color(0xffffff) },
  };
  me.userData.golge = u;
  me.material.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = 'varying vec2 vYerel;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vYerel = position.xy;');
    sh.fragmentShader = 'uniform vec2 uYon; uniform vec2 uMerkez; uniform vec2 uYaricap; uniform float uGuc; uniform float uKenar; uniform float uKare; uniform vec3 uKenarRenk; varying vec2 vYerel;\n' +
      sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        vec2 q = (vYerel - uMerkez) / uYaricap;
        float r = mix(length(q), max(abs(q.x), abs(q.y)), uKare);
        float isik = clamp(dot(normalize(uYon), q), -1.0, 1.0);
        diffuseColor.rgb *= 1.0 + uGuc * isik - uGuc * 0.8 * smoothstep(0.6, 1.0, r) * (1.0 - max(isik, 0.0));
        float kenar = smoothstep(0.8, 0.97, r) * smoothstep(0.25, 0.85, isik);
        diffuseColor.rgb += uKenarRenk * uKenar * kenar * 0.5;`);
  };
  me.material.customProgramCacheKey = () => 'karakterGolge';
  return me;
}

// Alt ortası orijinde yamuk (cübbe, elbise); üst köşeler yuvarlak
function yamuk(wUst, wAlt, h, r = 0.09) {
  const s = new THREE.Shape(); s.moveTo(-wAlt / 2, 0); s.lineTo(wAlt / 2, 0); s.lineTo(wUst / 2, h - r); s.quadraticCurveTo(wUst / 2, h, wUst / 2 - r, h);
  s.lineTo(-wUst / 2 + r, h); s.quadraticCurveTo(-wUst / 2, h, -wUst / 2, h - r); s.closePath(); return new THREE.ShapeGeometry(s, 12);
}
function vYaka(w, d) { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, -d); s.closePath(); return new THREE.ShapeGeometry(s); }

function yuvarlakDikdortgen(w, h, r) {
  const s = new THREE.Shape(); const x = -w / 2, y = 0;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ShapeGeometry(s, 12);
}

function cubuk(uzunluk, kalinlik) { // aşağı sarkan uzuv: pivot üst uçta
  const g = new THREE.PlaneGeometry(kalinlik, uzunluk); g.translate(0, -uzunluk / 2, 0); return g;
}

function yay(r, aci0, aci1, kalinlik, seg = 24) { // ağız, kaş, göz kapağı çizgisi
  const s = new THREE.Shape(); const pts = [];
  for (let i = 0; i <= seg; i++) { const a = aci0 + (aci1 - aci0) * i / seg; pts.push([Math.cos(a), Math.sin(a)]); }
  pts.forEach(([x, y], i) => (i ? s.lineTo(x * (r + kalinlik / 2), y * (r + kalinlik / 2)) : s.moveTo(x * (r + kalinlik / 2), y * (r + kalinlik / 2))));
  for (let i = pts.length - 1; i >= 0; i--) s.lineTo(pts[i][0] * (r - kalinlik / 2), pts[i][1] * (r - kalinlik / 2));
  return new THREE.ShapeGeometry(s);
}

const SAC = {
  kakul: (r) => { const s = new THREE.Shape(); s.absarc(0, 0, r * 1.04, Math.PI * 0.05, Math.PI * 0.95, false); s.quadraticCurveTo(-r * 0.2, r * 0.45, r * 0.95, r * 0.25); return new THREE.ShapeGeometry(s, 24); },
  'yan-ayrik': (r) => { const s = new THREE.Shape(); s.absarc(0, 0, r * 1.05, Math.PI * 0.02, Math.PI * 0.98, false); s.quadraticCurveTo(-r * 0.6, r * 0.55, r * 0.15, r * 0.62); s.quadraticCurveTo(r * 0.6, r * 0.55, r, r * 0.05); return new THREE.ShapeGeometry(s, 24); },
  kivircik: (r) => { const s = new THREE.Shape(); const n = 9; s.moveTo(r * 1.02, r * 0.05);
    for (let i = 1; i <= n; i++) { const a0 = Math.PI * (i - 1) / n, a1 = Math.PI * i / n, am = (a0 + a1) / 2;
      s.quadraticCurveTo(Math.cos(am) * r * 1.32, Math.sin(am) * r * 1.32, Math.cos(a1) * r * 1.05, Math.sin(a1) * r * 1.05); }
    s.quadraticCurveTo(0, r * 0.5, r * 1.02, r * 0.05); return new THREE.ShapeGeometry(s, 16); },
  topuz: (r) => { const s = new THREE.Shape(); s.absarc(0, 0, r * 1.04, Math.PI * 0.04, Math.PI * 0.96, false); s.quadraticCurveTo(0, r * 0.55, r, r * 0.08);
    const b = new THREE.Shape(); b.absarc(0, r * 1.18, r * 0.32, 0, Math.PI * 2, false); return new THREE.ShapeGeometry([s, b], 24); },
  kel: () => null,
};

// karakterYap({ten, ust, alt, sac, sacStil, boy, aksesuar}) → THREE.Group (ayaklar orijinde, +Z kameraya bakar)
// kiyafet: 'gomlek' | 'ceket' | 'uniforma' | 'cubbe' | 'elbise'; sapka: null | 'kep' | 'tac' | 'fotr' | 'bere'
// ic: ceket içi gömlek ve yaka rengi; kemer: kuşak/kemer rengi (cübbe, elbise, üniforma)
export function karakterYap({ ten = 0xf4dcc4, ust = 0xe8812f, alt = 0x3a3f58, sac = 0x5a3a22, sacStil = 'yan-ayrik', boy = 1.7, aksesuar = null,
  kiyafet = 'gomlek', sapka = null, ic = 0xf4f1ea, kemer = null, sapkaRenk = null } = {}) {
  const k = new THREE.Group(); k.name = 'karakter';
  const olc = boy / 1.7; const govde = new THREE.Group(); govde.scale.setScalar(olc); k.add(govde);
  const R = 0.245, basY = 1.335;
  // bacaklar ve ayaklar
  for (const sx of [-1, 1]) {
    mesh(cubuk(0.5, 0.05), SIYAH, 0.000, govde).position.set(sx * 0.075, 0.53, 0.000);
    const ayak = mesh(yuvarlakDikdortgen(0.14, 0.055, 0.027), SIYAH, 0.001, govde); ayak.position.set(sx * 0.105, 0.0, 0.001);
  }
  // gövde: kıyafet (kontur + dolgu) ve alt kısım
  govdeKiyafet(govde, kiyafet, { ust, alt, ic, kemer });
  // kollar (omuzdan pivot)
  const kollar = [];
  for (const sx of [-1, 1]) {
    const kol = new THREE.Group(); kol.position.set(sx * 0.205, 0.98, 0.009); govde.add(kol);
    mesh(cubuk(0.44, 0.048), SIYAH, 0, kol); const el = mesh(new THREE.CircleGeometry(0.038, 16), SIYAH, 0.001, kol); el.position.y = -0.44;
    kol.rotation.z = sx * 0.12; kollar.push(kol);
  }
  // kafa
  const kafa = new THREE.Group(); kafa.position.set(0, basY, 0.012); govde.add(kafa);
  mesh(new THREE.CircleGeometry(R + KONTUR, 48), SIYAH, 0.000, kafa);
  mesh(new THREE.CircleGeometry(R, 48), ten, 0.002, kafa, 'ten', 0);
  const sacGeo = SAC[sacStil]?.(R);
  if (sacGeo) { mesh(sacGeo, sac, 0.006, kafa, 'sac', 0).position.y = R * 0.02; }
  if (sapka) sapkaEkle(kafa, sapka, R, sapkaRenk);
  const yuz = new THREE.Group(); yuz.position.z = 0.008; kafa.add(yuz);
  if (aksesuar) aksesuarEkle(kafa, govde, aksesuar, R);
  k.userData = { kafa, yuz, kollar, govde, ten, R, ifade: null };
  // gölge düşüren görünmez gövde
  const golge = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.0, 4, 12), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
  golge.position.y = 0.75 * olc; golge.scale.set(olc, olc, 0.5 * olc); golge.castShadow = true; k.add(golge);
  // temas gölgesi
  const temas = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), new THREE.MeshBasicMaterial({ map: temasDokusu(), transparent: true, depthWrite: false, opacity: 0.55 }));
  temas.rotation.x = -Math.PI / 2; temas.position.y = 0.004; temas.scale.set(olc, olc * 0.45, 1); temas.renderOrder = -1; k.add(temas);
  ifadeAyarla(k, 'notr');
  return k;
}

let _temas;
function temasDokusu() {
  if (_temas) return _temas;
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,0.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); _temas = new THREE.CanvasTexture(cv); return _temas;
}

function govdeKiyafet(govde, tip, { ust, alt, ic, kemer }) {
  const K = KONTUR;
  if (tip === 'cubbe' || tip === 'elbise') {
    const y0 = tip === 'cubbe' ? 0.05 : 0.27, h = 1.03 - y0, wa = tip === 'cubbe' ? 0.64 : 0.68;
    mesh(yamuk(0.44 + 2 * K, wa + 2 * K, h + 2 * K, 0.12), SIYAH, 0.004, govde).position.set(0, y0 - K, 0.004);
    mesh(yamuk(0.44, wa, h, 0.11), ust, 0.006, govde, 'ust', 1).position.set(0, y0, 0.006);
    const by = tip === 'cubbe' ? 0.62 : 0.66, bw = 0.44 + (wa - 0.44) * (1.03 - by) / h;
    mesh(yuvarlakDikdortgen(bw, 0.065, 0.01), kemer ?? (tip === 'cubbe' ? 0xd9a640 : alt), 0.007, govde, 'kemer', 1).position.set(0, by, 0.007);
    mesh(vYaka(0.15, 0.13), ic, 0.0075, govde, 'yaka').position.set(0, 1.03, 0.0075);
    return;
  }
  mesh(yuvarlakDikdortgen(0.44 + K * 2, 0.56 + K * 2, 0.12), SIYAH, 0.004, govde).position.set(0, 0.47 - K, 0.004);
  mesh(yuvarlakDikdortgen(0.44, 0.56, 0.11), ust, 0.006, govde, 'ust', 1).position.set(0, 0.47, 0.006);
  mesh(yuvarlakDikdortgen(0.44, 0.12, 0.05), alt, 0.007, govde, 'alt', 1).position.set(0, 0.47, 0.007);
  if (tip === 'ceket') {
    mesh(vYaka(0.2, 0.25), SIYAH, 0.0072, govde).position.set(0, 1.035, 0.0072);
    mesh(vYaka(0.165, 0.215), ic, 0.0074, govde, 'yaka').position.set(0, 1.03, 0.0074);
    for (const y of [0.74, 0.66]) mesh(new THREE.CircleGeometry(0.012, 12), SIYAH, 0.0076, govde).position.set(0, y, 0.0076);
  }
  if (tip === 'uniforma') {
    mesh(yuvarlakDikdortgen(0.44, 0.06, 0.01), kemer ?? 0x23232b, 0.0072, govde, 'kemer', 1).position.set(0, 0.59, 0.0072);
    mesh(yuvarlakDikdortgen(0.06, 0.05, 0.01), 0xe0b84a, 0.0074, govde).position.set(0, 0.595, 0.0074);
    for (const y of [0.72, 0.82, 0.92]) for (const sx of [-1, 1]) mesh(new THREE.CircleGeometry(0.011, 12), 0xe0b84a, 0.0074, govde).position.set(sx * 0.055, y, 0.0074);
    mesh(new THREE.CircleGeometry(0.03, 5), 0xe0b84a, 0.0074, govde, 'rozet').position.set(-0.13, 0.9, 0.0074);
    mesh(vYaka(0.12, 0.08), ic, 0.0074, govde, 'yaka').position.set(0, 1.03, 0.0074);
  }
}

function sapkaEkle(kafa, tip, R, renk) {
  const z = 0.011, K = KONTUR;
  const iki = (geo, geoK, rk, x, y, ad, kare = 0.5) => { mesh(geoK, SIYAH, z, kafa).position.set(x, y - K, z); return mesh(geo, rk, z + 0.0005, kafa, ad, kare).position.set(x, y, z + 0.0005); };
  if (tip === 'kep') {
    const rk = renk ?? 0x1f2a4a;
    iki(yuvarlakDikdortgen(0.5, 0.17, 0.06), yuvarlakDikdortgen(0.5 + 2 * K, 0.17 + 2 * K, 0.07), rk, 0, R * 0.52, 'sapka', 1);
    mesh(yuvarlakDikdortgen(0.4, 0.05, 0.025), SIYAH, z + 0.001, kafa).position.set(0, R * 0.5, z + 0.001);
    mesh(new THREE.CircleGeometry(0.03, 6), 0xe0b84a, z + 0.0012, kafa).position.set(0, R * 0.52 + 0.1, z + 0.0012);
  } else if (tip === 'tac') {
    const s = new THREE.Shape(); const w = 0.36, h0 = 0.07, h1 = 0.17; s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h1);
    for (let i = 4; i >= 0; i--) { const x0 = -w / 2 + w * i / 4; s.lineTo(x0 + (i < 4 ? w / 8 : 0), i < 4 ? h0 : h1); if (i > 0) s.lineTo(x0, h1); }
    s.lineTo(-w / 2, h1); s.closePath(); const g = new THREE.ShapeGeometry(s); const gk = g.clone(); gk.scale(1.12, 1.15, 1); gk.translate(0, -0.006, 0);
    iki(g, gk, renk ?? 0xe8b33a, 0, R * 0.78, 'sapka', 0.5);
    for (const x of [-0.1, 0, 0.1]) mesh(new THREE.CircleGeometry(0.018, 12), 0xc0283a, z + 0.001, kafa).position.set(x, R * 0.78 + 0.035, z + 0.001);
  } else if (tip === 'fotr') {
    const rk = renk ?? 0x3a2c22;
    iki(yuvarlakDikdortgen(0.36, 0.2, 0.07), yuvarlakDikdortgen(0.36 + 2 * K, 0.2 + 2 * K, 0.08), rk, 0, R * 0.78, 'sapka', 1);
    mesh(yuvarlakDikdortgen(0.36, 0.045, 0.005), 0x1a1410, z + 0.001, kafa).position.set(0, R * 0.8, z + 0.001);
    iki(yuvarlakDikdortgen(0.66, 0.05, 0.025), yuvarlakDikdortgen(0.66 + 2 * K, 0.05 + 2 * K, 0.035), rk, 0, R * 0.72, 'sapkaKenar', 1);
  } else if (tip === 'bere') {
    const rk = renk ?? 0xb83a3a; const s = new THREE.Shape(); s.absarc(0, 0, R * 1.08, 0, Math.PI, false); s.closePath();
    const g = new THREE.ShapeGeometry(s, 24); const gk = g.clone(); gk.scale(1.08, 1.08, 1);
    iki(g, gk, rk, 0, R * 0.3, 'sapka', 0);
    mesh(yuvarlakDikdortgen(0.56, 0.08, 0.03), new THREE.Color(rk).offsetHSL(0, 0, -0.08).getHex(), z + 0.001, kafa, 'sapkaBant', 1).position.set(0, R * 0.26, z + 0.001);
    mesh(new THREE.CircleGeometry(0.05, 16), 0xf2efe6, z + 0.001, kafa).position.set(0, R * 0.3 + R * 1.08, z + 0.001);
  }
}

function aksesuarEkle(kafa, govde, ad, R) {
  if (ad === 'gozluk') { for (const sx of [-1, 1]) { const g = mesh(yay(0.055, 0, Math.PI * 2, 0.014, 32), SIYAH, 0.012, kafa); g.position.set(sx * 0.085, 0.03, 0.012); }
    mesh(new THREE.PlaneGeometry(0.06, 0.012), SIYAH, 0.012, kafa).position.set(0, 0.035, 0.012); }
  if (ad === 'kravat') { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0.04, -0.06); s.lineTo(0.02, -0.28); s.lineTo(0, -0.33); s.lineTo(-0.02, -0.28); s.lineTo(-0.04, -0.06); s.closePath();
    mesh(new THREE.ShapeGeometry(s), 0xb3262e, 0.0085, govde, 'kravat').position.set(0, 1.02, 0.0085); }
  if (ad === 'kask') { const s = new THREE.Shape(); s.absarc(0, 0.02, R * 1.12, 0, Math.PI, false); s.lineTo(R * 1.3, 0.02); s.lineTo(R * 1.12, 0.02);
    mesh(new THREE.ShapeGeometry(s, 24), 0xf2c230, 0.011, kafa, 'kask').position.y = R * 0.15; }
}

// İfadeler: SHORTS-FORMULU.md 6.2 kimlikleri
export const IFADELER = ['notr', 'emin', 'alayci', 'saskin', 'dehset', 'kuskulu', 'sinirli', 'aci', 'hasta', 'mutlu', 'aglayan', 'uykulu'];
// İfadeye bağlı ten rengi (SHORTS-FORMULU 6.2: acı = kızarık, hasta = yeşil-mavi, sinirli = hafif kızarık)
const TEN_KAYMA = { aci: [0xe0533f, 0.55], hasta: [0x8fc7a0, 0.55], sinirli: [0xe8806a, 0.22] };

export function ifadeAyarla(k, ad) {
  const { yuz, R, ten, kafa } = k.userData; yuz.clear(); k.userData.ifade = ad;
  const tenMesh = kafa.children.find((o) => o.name === 'ten');
  if (tenMesh) { const ky = TEN_KAYMA[ad]; tenMesh.userData.duzRenk = ky ? new THREE.Color(ten).lerp(new THREE.Color(ky[0]), ky[1]).getHex() : ten; }
  const gx = 0.082, gy = 0.035, my = -0.095;
  const add = (geo, renk, x, y, z = 0, rot = 0) => { const m = mesh(geo, renk, z, yuz); m.position.set(x, y, z); m.rotation.z = rot; return m; };
  const nokta = (x, y, r = 0.03) => add(new THREE.CircleGeometry(r, 20), SIYAH, x, y, 0.001);
  const beyazGoz = (x, y, r = 0.055, br = 0.018, bx = 0, by = 0) => { add(new THREE.CircleGeometry(r + 0.01, 24), SIYAH, x, y, 0.001); add(new THREE.CircleGeometry(r, 24), 0xffffff, x, y, 0.002); add(new THREE.CircleGeometry(br, 16), SIYAH, x + bx, y + by, 0.003); };
  const kas = (x, y, rot, w = 0.075) => add(new THREE.PlaneGeometry(w, 0.016), SIYAH, x, y, 0.002, rot);
  const kapak = (x, y, r = 0.034) => add(new THREE.CircleGeometry(r, 20, 0, Math.PI), ten, x, y - 0.002, 0.004); // gözün üst yarısını örter
  const agizDuz = (w = 0.1, rot = 0, x = 0) => add(new THREE.PlaneGeometry(w, 0.016), SIYAH, x, my, 0.002, rot);
  const gulus = (r = 0.07, a0 = Math.PI * 1.15, a1 = Math.PI * 1.85, x = 0, y = my + 0.05) => add(yay(r, a0, a1, 0.017), SIYAH, x, y, 0.002);
  switch (ad) {
    case 'emin': nokta(-gx, gy); nokta(gx, gy); kapak(-gx, gy); kapak(gx, gy); gulus(0.06, Math.PI * 1.25, Math.PI * 1.9, 0.015); break;
    case 'alayci': nokta(-gx, gy); nokta(gx, gy); kapak(-gx, gy); kapak(gx, gy); kas(gx, gy + 0.075, 0.35); kas(-gx, gy + 0.06, -0.05); gulus(0.07, Math.PI * 1.45, Math.PI * 1.95, 0.03, my + 0.06); break;
    case 'saskin': beyazGoz(-gx, gy + 0.005); beyazGoz(gx, gy + 0.005); kas(-gx, gy + 0.1, 0.15); kas(gx, gy + 0.1, -0.15); add(new THREE.RingGeometry(0.018, 0.034, 20), SIYAH, 0, my - 0.01, 0.002); break;
    case 'dehset': { beyazGoz(-gx, gy + 0.01, 0.065, 0.014); beyazGoz(gx, gy + 0.01, 0.065, 0.014); kas(-gx, gy + 0.115, 0.3); kas(gx, gy + 0.115, -0.3);
      add(yuvarlakDikdortgen(0.16, 0.06, 0.02), SIYAH, 0, my - 0.04, 0.002); const d = add(yuvarlakDikdortgen(0.14, 0.042, 0.012), 0xffffff, 0, my - 0.031, 0.003);
      for (let i = -2; i <= 2; i++) add(new THREE.PlaneGeometry(0.007, 0.042), SIYAH, i * 0.026, my - 0.01, 0.004);
      add(terDamlasi(), 0x9fd8ff, R * 0.85, R * 0.55, 0.005); break; }
    case 'kuskulu': nokta(-gx, gy, 0.026); nokta(gx, gy, 0.026); kapak(-gx, gy + 0.004); kapak(gx, gy + 0.004); kas(gx, gy + 0.055, -0.25); kas(-gx, gy + 0.065, 0.05); agizDuz(0.08, -0.12, 0.02); break;
    case 'sinirli': nokta(-gx, gy - 0.005); nokta(gx, gy - 0.005); kas(-gx, gy + 0.05, -0.45); kas(gx, gy + 0.05, 0.45); agizDuz(0.11); break;
    case 'mutlu': add(yay(0.032, 0.15, Math.PI - 0.15, 0.016), SIYAH, -gx, gy - 0.005, 0.002); add(yay(0.032, 0.15, Math.PI - 0.15, 0.016), SIYAH, gx, gy - 0.005, 0.002); gulus(0.085, Math.PI * 1.1, Math.PI * 1.9); break;
    case 'aci': { // sıkılmış gözler (> <), dalgalı ağız, kulaklardan buhar
      for (const sx of [-1, 1]) { kas(sx * gx, gy + 0.012, sx * 0.5, 0.05); kas(sx * gx, gy - 0.012, -sx * 0.5, 0.05);
        for (let i = 0; i < 3; i++) add(new THREE.CircleGeometry(0.022 + i * 0.008, 14), 0xf4f4f4, sx * (R + 0.04 + i * 0.045), 0.02 + i * 0.05, 0.003); }
      for (let i = 0; i < 4; i++) add(new THREE.PlaneGeometry(0.035, 0.014), SIYAH, -0.052 + i * 0.035, my - 0.01, 0.002, i % 2 ? 0.5 : -0.5);
      break; }
    case 'hasta': // ağır kapaklar, göz altı, eğri ağız, soğuk ter
      nokta(-gx, gy - 0.004, 0.024); nokta(gx, gy - 0.004, 0.024); kapak(-gx, gy + 0.006, 0.036); kapak(gx, gy + 0.006, 0.036);
      add(yay(0.03, Math.PI * 1.15, Math.PI * 1.85, 0.008), 0x6a8a74, -gx, gy - 0.01, 0.002); add(yay(0.03, Math.PI * 1.15, Math.PI * 1.85, 0.008), 0x6a8a74, gx, gy - 0.01, 0.002);
      for (let i = 0; i < 4; i++) add(new THREE.PlaneGeometry(0.03, 0.012), SIYAH, -0.045 + i * 0.03, my - 0.015, 0.002, i % 2 ? 0.45 : -0.45);
      add(terDamlasi(), 0x9fd8ff, -R * 0.82, R * 0.45, 0.005); break;
    case 'aglayan': // kapalı üzgün gözler, iki gözyaşı çizgisi, aşağı kıvrık ağız
      add(yay(0.032, Math.PI * 1.15, Math.PI * 1.85, 0.016), SIYAH, -gx, gy + 0.012, 0.002); add(yay(0.032, Math.PI * 1.15, Math.PI * 1.85, 0.016), SIYAH, gx, gy + 0.012, 0.002);
      kas(-gx, gy + 0.075, 0.3); kas(gx, gy + 0.075, -0.3);
      for (const sx of [-1, 1]) add(new THREE.PlaneGeometry(0.022, 0.17), 0x7cc8ff, sx * gx, gy - 0.085, 0.0025);
      add(yay(0.06, Math.PI * 0.2, Math.PI * 0.8, 0.017), SIYAH, 0, my - 0.06, 0.002); break;
    case 'uykulu': add(new THREE.PlaneGeometry(0.06, 0.014), SIYAH, -gx, gy - 0.005, 0.002); add(new THREE.PlaneGeometry(0.06, 0.014), SIYAH, gx, gy - 0.005, 0.002); gulus(0.05, Math.PI * 1.3, Math.PI * 1.7); break;
    default: nokta(-gx, gy); nokta(gx, gy); agizDuz(0.1); // notr
  }
  // yeni parçalar mevcut ışık tonunu alsın
  let kok = k; while (kok.parent) kok = kok.parent;
  const ton = kok.userData?.karakterCarpan;
  if (ton) { yuz.traverse((o) => o.userData?.duzRenk && o.material.color.copy(new THREE.Color(o.userData.duzRenk)).multiply(new THREE.Color(...ton)));
    if (tenMesh) tenMesh.material.color.copy(new THREE.Color(tenMesh.userData.duzRenk)).multiply(new THREE.Color(...ton)); }
  else if (tenMesh) tenMesh.material.color.set(tenMesh.userData.duzRenk);
}

function terDamlasi() { const s = new THREE.Shape(); s.moveTo(0, 0.05); s.quadraticCurveTo(0.03, 0.0, 0.0, -0.02); s.quadraticCurveTo(-0.03, 0.0, 0, 0.05); return new THREE.ShapeGeometry(s, 12); }

// Kol pozu (radyan, 0 = aşağı sarkık; pozitif = dışa doğru kalkar)
export function kolPoz(k, sol, sag) { const [a, b] = k.userData.kollar; a.rotation.z = -sol; b.rotation.z = sag; }

// Boşta hareket: nefes (%1–2 ölçek), göz kırpma; t saniye
export function bostaHareket(k, t, { faz = 0 } = {}) {
  const g = k.userData.govde; const n = 1 + 0.012 * Math.sin((t + faz) * Math.PI * 2 / 2.6);
  g.scale.y = g.scale.x * n;
}
