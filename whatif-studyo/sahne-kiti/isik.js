// Işık hazırları: SHORTS-FORMULU.md 6.4'teki kimliklerin Three.js karşılığı.
// Her hazır: gökyüzü gradyanı, yarıküre ışığı, anahtar (yönlü, gölgeli) ışık, dolgu, sis,
// pozlama, parlama (bloom), renk düzeltme ve 2B karakterlere uygulanan ışık tonu.
// Değerler sRGB hex; güçler three.js fiziksel birimlerinde (r155+). Ayar aralıkları RENDER-RECETESI.md'de.
import * as THREE from 'three';

export const ISIK = {
  gunduz: {
    karakterGolge: 0.1, karakterKenar: 0.15, karakterParlaklik: 0.95,
    ortam: 0.4,
    gok: [0x7fbdf5, 0xdff0ff], hemi: [0xd6ecff, 0x9c8a6c, 1.6],
    anahtar: { renk: 0xfff0d8, guc: 3.2, yon: [0.55, 1.0, 0.65], golgeYumusak: 3 },
    dolgu: { renk: 0xbcd6ff, guc: 0.5, yon: [-0.7, 0.4, 0.6] },
    sis: { renk: 0xd8ecff, yogunluk: 0.010 }, pozlama: 1.0,
    bloom: { guc: 0.3, yaricap: 0.12, esik: 2.4, tavan: 6 },
    grade: { lift: [0.035, 0.035, 0.045], gamma: [1, 1, 1], gain: [1.03, 1.0, 0.97], doygunluk: 1.15, sicaklik: 0.04, vinyet: 0.16, grain: 0.012 },
    karakterTon: [1.0, 1.0, 1.0],
  },
  'altin-saat': {
    karakterGolge: 0.16, karakterKenar: 0.35, karakterParlaklik: 0.92,
    ortam: 0.3,
    gok: [0xf08a6a, 0xffd9a0], hemi: [0xffcfa0, 0x5e4a74, 1.3],
    anahtar: { renk: 0xffa766, guc: 3.6, yon: [-0.85, 0.32, 0.4], golgeYumusak: 4 },
    dolgu: { renk: 0x8f9cff, guc: 0.45, yon: [0.8, 0.5, 0.5] },
    sis: { renk: 0xffbf96, yogunluk: 0.022 }, pozlama: 1.05,
    bloom: { guc: 0.4, yaricap: 0.15, esik: 1.8, tavan: 5 },
    grade: { lift: [0.05, 0.03, 0.05], gamma: [1, 1, 1.03], gain: [1.07, 1.0, 0.93], doygunluk: 1.18, sicaklik: 0.10, vinyet: 0.24, grain: 0.014 },
    karakterTon: [1.06, 0.94, 0.86],
  },
  'gece-mavi': {
    karakterGolge: 0.16, karakterKenar: 0.45, karakterParlaklik: 0.85,
    ortam: 0.12,
    gok: [0x0b1534, 0x26407a], hemi: [0x5a78c8, 0x14141e, 0.55],
    anahtar: { renk: 0x9cbcff, guc: 1.4, yon: [0.35, 1.0, 0.5], golgeYumusak: 3 },
    dolgu: { renk: 0xffb066, guc: 0.0, yon: [-0.5, 0.4, 0.6] },
    sis: { renk: 0x1e2e5e, yogunluk: 0.030 }, pozlama: 1.15,
    bloom: { guc: 0.55, yaricap: 0.15, esik: 1.0 },
    grade: { lift: [0.04, 0.05, 0.10], gamma: [1, 1, 0.96], gain: [0.94, 0.99, 1.08], doygunluk: 1.12, sicaklik: -0.10, vinyet: 0.32, grain: 0.016 },
    karakterTon: [0.84, 0.88, 1.0],
  },
  'neon-gece': {
    karakterGolge: 0.18, karakterKenar: 0.55, karakterParlaklik: 0.85,
    ortam: 0.12,
    gok: [0x12051f, 0x3a1252], hemi: [0x8a4ad0, 0x10061a, 0.8],
    anahtar: { renk: 0xd07bff, guc: 1.2, yon: [-0.4, 1.0, 0.5], golgeYumusak: 2 },
    dolgu: { renk: 0x38e6ff, guc: 0.6, yon: [0.7, 0.3, 0.5] },
    sis: { renk: 0x2a0f45, yogunluk: 0.035 }, pozlama: 1.15,
    bloom: { guc: 0.7, yaricap: 0.2, esik: 0.9 },
    grade: { lift: [0.06, 0.03, 0.09], gamma: [1, 1, 1], gain: [1.02, 0.95, 1.08], doygunluk: 1.25, sicaklik: -0.02, vinyet: 0.34, grain: 0.018 },
    karakterTon: [0.92, 0.72, 1.0],
  },
  'tek-ampul': {
    karakterGolge: 0.24, karakterKenar: 0.2, karakterParlaklik: 0.9,
    ortam: 0.06,
    gok: [0x08070a, 0x17130f], hemi: [0x5a4a3a, 0x050405, 0.35],
    anahtar: { renk: 0xffc27a, guc: 2.2, yon: [0.05, 1.0, 0.15], golgeYumusak: 2 },
    dolgu: { renk: 0x6a7aa0, guc: 0.12, yon: [-0.6, 0.3, 0.7] },
    sis: { renk: 0x16110c, yogunluk: 0.045 }, pozlama: 1.1,
    bloom: { guc: 0.55, yaricap: 0.15, esik: 1.0 },
    grade: { lift: [0.035, 0.025, 0.02], gamma: [1, 1, 1], gain: [1.06, 1.0, 0.9], doygunluk: 1.05, sicaklik: 0.10, vinyet: 0.48, grain: 0.02 },
    karakterTon: [1.0, 0.86, 0.68],
  },
  floresan: {
    karakterGolge: 0.1, karakterKenar: 0.12, karakterParlaklik: 0.95,
    ortam: 0.4,
    gok: [0xdfe8ea, 0xf4f7f6], hemi: [0xe8f6ff, 0x7a8a88, 1.4],
    anahtar: { renk: 0xeefaff, guc: 2.4, yon: [0.1, 1.0, 0.2], golgeYumusak: 5 },
    dolgu: { renk: 0xd0f0e8, guc: 0.4, yon: [-0.6, 0.4, 0.6] },
    sis: { renk: 0xdde8e6, yogunluk: 0.016 }, pozlama: 1.0,
    bloom: { guc: 0.3, yaricap: 0.12, esik: 2.4, tavan: 6 },
    grade: { lift: [0.03, 0.04, 0.04], gamma: [1, 1, 1], gain: [0.98, 1.02, 1.0], doygunluk: 0.98, sicaklik: -0.04, vinyet: 0.2, grain: 0.012 },
    karakterTon: [0.95, 1.0, 1.0],
  },
  dijital: {
    karakterGolge: 0.16, karakterKenar: 0.45, karakterParlaklik: 0.88,
    ortam: 0.15,
    gok: [0x140a3c, 0x3b2a9c], hemi: [0x7b6cff, 0x0a0626, 0.9],
    anahtar: { renk: 0xa79cff, guc: 1.3, yon: [0.2, 1.0, 0.6], golgeYumusak: 2 },
    dolgu: { renk: 0x41f0ff, guc: 0.5, yon: [-0.7, 0.3, 0.5] },
    sis: { renk: 0x251766, yogunluk: 0.03 }, pozlama: 1.1,
    bloom: { guc: 0.7, yaricap: 0.2, esik: 0.9 },
    grade: { lift: [0.05, 0.03, 0.12], gamma: [1, 1, 0.96], gain: [0.98, 0.96, 1.1], doygunluk: 1.2, sicaklik: -0.08, vinyet: 0.3, grain: 0.014 },
    karakterTon: [0.8, 0.78, 1.05],
  },
  tehlike: {
    karakterGolge: 0.22, karakterKenar: 0.35, karakterParlaklik: 0.9,
    ortam: 0.1,
    gok: [0x1a0404, 0x3c0a0a], hemi: [0xff5a4a, 0x120404, 0.7],
    anahtar: { renk: 0xff3b2e, guc: 2.0, yon: [0.6, 0.8, 0.5], golgeYumusak: 1 },
    dolgu: { renk: 0x3a5cff, guc: 0.25, yon: [-0.7, 0.2, 0.6] },
    sis: { renk: 0x2a0606, yogunluk: 0.03 }, pozlama: 1.1,
    bloom: { guc: 0.55, yaricap: 0.15, esik: 1.0 },
    grade: { lift: [0.06, 0.02, 0.02], gamma: [1, 1, 1], gain: [1.1, 0.92, 0.92], doygunluk: 1.2, sicaklik: 0.05, vinyet: 0.45, grain: 0.02 },
    karakterTon: [1.0, 0.62, 0.6],
  },
};

const c = (hex) => new THREE.Color(hex);

function gradyanDoku(ust, alt) {
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256;
  const g = cv.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#' + c(ust).getHexString()); gr.addColorStop(1, '#' + c(alt).getHexString());
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Hazırı sahneye uygular; oluşturduğu ışıkları döndürür (anahtar ışığın gölge kamerası hedefe göre ayarlanır).
// karakterTon: çekime özel karakter tonu (ör. gece sahnesinde sıcak abajur ışığı altında duran karakter)
export function isikUygula(sahne, renderer, ad, { hedef = new THREE.Vector3(0, 1, 0), alan = 8, karakterTon = null } = {}) {
  const h0 = ISIK[ad]; if (!h0) throw new Error('Bilinmeyen ışık hazırı: ' + ad);
  const h = karakterTon ? { ...h0, karakterTon } : h0;
  sahne.userData.isik?.forEach((o) => sahne.remove(o));
  sahne.background = gradyanDoku(h.gok[0], h.gok[1]);
  sahne.fog = new THREE.FogExp2(h.sis.renk, h.sis.yogunluk);
  renderer.toneMappingExposure = h.pozlama;
  const hemi = new THREE.HemisphereLight(h.hemi[0], h.hemi[1], h.hemi[2]);
  const anahtar = new THREE.DirectionalLight(h.anahtar.renk, h.anahtar.guc);
  const y = new THREE.Vector3(...h.anahtar.yon).normalize().multiplyScalar(alan);
  anahtar.position.copy(hedef).add(y); anahtar.target.position.copy(hedef);
  anahtar.castShadow = true; anahtar.shadow.mapSize.set(2048, 2048);
  const sc = anahtar.shadow.camera; sc.left = -alan; sc.right = alan; sc.top = alan; sc.bottom = -alan; sc.near = 0.5; sc.far = alan * 3;
  anahtar.shadow.bias = -0.0004; anahtar.shadow.normalBias = 0.02; anahtar.shadow.radius = h.anahtar.golgeYumusak;
  const dolgu = new THREE.DirectionalLight(h.dolgu.renk, h.dolgu.guc);
  dolgu.position.copy(hedef).add(new THREE.Vector3(...h.dolgu.yon).normalize().multiplyScalar(alan));
  const isiklar = [hemi, anahtar, anahtar.target, dolgu];
  isiklar.forEach((o) => sahne.add(o));
  sahne.environmentIntensity = h.ortam ?? 0.3;
  sahne.userData.isik = isiklar; sahne.userData.hazir = h; sahne.userData.hazirAd = ad;
  // 2B karakterlerin düz renklerini sahne ışığına göre tonla
  // Karakterler ışıksız (MeshBasic) çizilir: pozlamadan bağımsız kalsınlar diye ton / pozlama ile ölçeklenir,
  // böylece açık ten gece sahnesinde beyaza patlamaz (karakterParlaklik ≈ 0,85–0,95).
  const kt = h.karakterTon.map((v) => v * (h.karakterParlaklik ?? 0.9) / h.pozlama);
  sahne.userData.karakterCarpan = kt;
  sahne.traverse((o) => o.userData?.duzRenk && o.material?.color?.copy(new THREE.Color(o.userData.duzRenk)).multiply(new THREE.Color(...kt)));
  karakterGolgesi(sahne, h);
  return { hemi, anahtar, dolgu, hazir: h };
}

// 2B gölgeleme yönü/gücü: anahtar ışığın ekran düzlemindeki yönü (karakterler kameraya bakar),
// kenar ışığı rengi anahtar ışığın rengi. Hazır karakterGolge / karakterKenar verirse onlar kullanılır.
export function karakterGolgesi(sahne, h = sahne.userData.hazir) {
  if (!h) return;
  const yon = new THREE.Vector2(h.anahtar.yon[0], h.anahtar.yon[1]); if (yon.lengthSq() < 1e-6) yon.set(0, 1); yon.normalize();
  sahne.traverse((o) => { const u = o.userData?.golge; if (!u) return;
    u.uYon.value.copy(yon); u.uKenarRenk.value.set(h.anahtar.renk); u.uGuc.value = h.karakterGolge ?? 0.14; u.uKenar.value = h.karakterKenar ?? 0.25; });
}
