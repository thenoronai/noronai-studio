// Set dekoru: mobilya, lamba, pencere, kapı, kitaplık, tablo, halı, perde. Her fonksiyon bir Group
// döndürür (x, y, z, ry ile yerleşir); parçalar kutu/silindir ile kurulur, kontur çizgisi kendiliğinden gelir.
// Yoğunluk kuralı (RENDER-RECETESI 4): bir iç mekân karesinde en az 3 ön plan, 8 orta plan, 1 arka plan katmanı.
import * as THREE from 'three';
import { kutu, silindir, isikHuzmesi, konturEkle } from './set.js';
import { haliDokusu, manzara, pencereGobo, tabloResmi, tohumlu } from './dokular.js';

function grup(sahne, x, y, z, ry) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; sahne.add(g); return g; }

export function masa(sahne, { x = 0, y = 0, z = 0, ry = 0, w = 1.0, d = 0.6, h = 0.75, renk = 0x6b4128 } = {}) {
  const g = grup(sahne, x, y, z, ry);
  kutu(g, { w, h: 0.05, d, renk, y: h - 0.05, purluluk: 0.55 });
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) kutu(g, { w: 0.05, h: h - 0.05, d: 0.05, renk, x: sx * (w / 2 - 0.06), z: sz * (d / 2 - 0.06), purluluk: 0.6 });
  return g;
}

export function sandalye(sahne, { x = 0, y = 0, z = 0, ry = 0, renk = 0x7a4a2c } = {}) {
  const g = grup(sahne, x, y, z, ry);
  kutu(g, { w: 0.44, h: 0.05, d: 0.42, renk, y: 0.43 });
  kutu(g, { w: 0.44, h: 0.48, d: 0.04, renk, y: 0.48, z: -0.19 });
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) kutu(g, { w: 0.04, h: 0.43, d: 0.04, renk, x: sx * 0.19, z: sz * 0.18 });
  return g;
}

export function koltuk(sahne, { x = 0, y = 0, z = 0, ry = 0, renk = 0x8a2f3a, ahsap = 0x4a2c1a } = {}) {
  const g = grup(sahne, x, y, z, ry);
  kutu(g, { w: 0.9, h: 0.32, d: 0.8, renk, y: 0.1, purluluk: 0.9 });
  kutu(g, { w: 0.9, h: 0.62, d: 0.2, renk, y: 0.42, z: -0.3, purluluk: 0.9 });
  for (const sx of [-1, 1]) kutu(g, { w: 0.16, h: 0.3, d: 0.8, renk, x: sx * 0.37, y: 0.42, purluluk: 0.9 });
  kutu(g, { w: 0.58, h: 0.1, d: 0.56, renk: new THREE.Color(renk).offsetHSL(0, 0, 0.06).getHex(), y: 0.42, z: 0.06, purluluk: 0.95 });
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) kutu(g, { w: 0.06, h: 0.1, d: 0.06, renk: ahsap, x: sx * 0.38, z: sz * 0.33, kontur: false });
  return g;
}

// Abajur / ayaklı lamba: abajur içi parlar, altına sıcak nokta ışık konur
// Not: VSM gölge haritası nokta ışıkta gölge desteklemez; gölgeyi anahtar ışık ya da spot verir (golge=true yalnız PCF'de işe yarar).
export function lamba(sahne, { x = 0, y = 0, z = 0, boy = 1.5, renk = 0xffc27a, abajur = 0xf1dcae, guc = 1.4, golge = false } = {}) {
  const g = grup(sahne, x, y, z, 0);
  silindir(g, { r: 0.16, r2: 0.12, h: 0.04, renk: 0x2a2420, metal: 0.5, purluluk: 0.4 });
  silindir(g, { r: 0.018, h: boy - 0.3, renk: 0x2a2420, y: 0.04, metal: 0.6, purluluk: 0.4, kontur: false });
  const s = silindir(g, { r: 0.26, r2: 0.16, h: 0.3, renk: abajur, y: boy - 0.3, emissive: renk, emissiveGuc: 0.9, purluluk: 0.9, seg: 28 });
  s.material.side = THREE.DoubleSide;
  const l = new THREE.PointLight(renk, guc, 6, 2); l.position.set(0, boy - 0.2, 0); l.castShadow = golge;
  if (golge) { l.shadow.mapSize.set(512, 512); l.shadow.bias = -0.002; l.shadow.radius = 4; }
  g.add(l); g.userData.isik = l; return g;
}

// Tavandan sarkan çıplak ampul (tek-ampul hazırının pratik kaynağı); t ile hafif salınır
export function asiliAmpul(sahne, { x = 0, y = 2.6, z = 0, kablo = 0.7, renk = 0xffd28a, guc = 2.2, golge = false, abajur = null } = {}) {
  const g = grup(sahne, x, y, z, 0);
  const k = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, kablo, 6), new THREE.MeshBasicMaterial({ color: 0x111111 })); k.position.y = -kablo / 2; g.add(k);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 14), new THREE.MeshStandardMaterial({ color: renk, emissive: renk, emissiveIntensity: 6 })); b.position.y = -kablo - 0.05; g.add(b);
  if (abajur !== null) { const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.3, 0.22, 28, 1, true), new THREE.MeshStandardMaterial({ color: abajur, roughness: 0.8, side: THREE.DoubleSide, emissive: renk, emissiveIntensity: 0.25 }));
    sh.position.y = -kablo + 0.02; g.add(sh); konturEkle(sh, 0.008); }
  const l = new THREE.PointLight(renk, guc, 7, 2); l.position.y = -kablo - 0.08; l.castShadow = golge;
  if (golge) { l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.002; l.shadow.radius = 3; }
  g.add(l); g.userData.guncelle = (t) => { g.rotation.z = Math.sin(t * 1.3) * 0.04; };
  return g;
}

// Pencere: çerçeve + manzara camı + (isteğe bağlı) içeri vuran ay/güneş ışığı (gobo'lu spot) ve hüzme
export function pencere(sahne, { x = 0, y = 1.0, z = 0, ry = 0, w = 1.1, h = 1.4, disari = 'gece', isik = true, isikRenk = 0x9fbaff, isikGuc = 14, hedef = [0, 0, 2.2], cerceve = 0xe9e2d4 } = {}) {
  const g = grup(sahne, x, y, z, ry);
  const cam = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: manzara({ tip: disari }), toneMapped: true }));
  cam.position.set(0, h / 2, -0.02); g.add(cam);
  const t = 0.07;
  kutu(g, { w: w + 2 * t, h: t, d: 0.1, renk: cerceve, y: -t }); kutu(g, { w: w + 2 * t, h: t, d: 0.1, renk: cerceve, y: h });
  for (const sx of [-1, 1]) kutu(g, { w: t, h: h, d: 0.1, renk: cerceve, x: sx * (w / 2 + t / 2) });
  kutu(g, { w: 0.035, h: h, d: 0.06, renk: cerceve, kontur: false }); kutu(g, { w: w, h: 0.035, d: 0.06, renk: cerceve, y: h / 2 - 0.0175, kontur: false });
  kutu(g, { w: w + 0.3, h: 0.05, d: 0.22, renk: cerceve, y: -t - 0.05, z: 0.06 }); // denizlik
  if (isik) {
    const s = new THREE.SpotLight(isikRenk, isikGuc, 14, 0.36, 0.3, 1.6); s.position.set(0, h * 0.5 + 2.4, -1.4);
    s.map = pencereGobo(); s.castShadow = true; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -0.0008; s.shadow.radius = 3; // gobo yalnız gölge açıkken çalışır
    const hd = new THREE.Object3D(); hd.position.set(hedef[0], hedef[1] - y, hedef[2]); g.add(hd); s.target = hd; g.add(s);
    isikHuzmesi(g, { tepe: [0, h * 0.55, 0.05], taban: [hedef[0] * 0.8, -y + 0.02, hedef[2] * 0.8], r1: w * 0.45, r2: w * 0.75, renk: isikRenk, guc: 0.10 });
    g.userData.isik = s;
  }
  return g;
}

export function perde(sahne, { x = 0, y = 0, z = 0, ry = 0, w = 0.5, h = 2.2, renk = 0x7b2234, kivrim = 6 } = {}) {
  const g = grup(sahne, x, y, z, ry);
  const geo = new THREE.PlaneGeometry(w, h, kivrim * 8, 1); const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getX(i) / w + 0.5) * kivrim * Math.PI * 2) * 0.035);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: renk, roughness: 0.95, side: THREE.DoubleSide })); m.position.y = h / 2; m.castShadow = true; m.receiveShadow = true; g.add(m);
  return g;
}

export function kapi(sahne, { x = 0, y = 0, z = 0, ry = 0, renk = 0x5b3a26, cerceve = 0x3a2416 } = {}) {
  const g = grup(sahne, x, y, z, ry);
  kutu(g, { w: 0.92, h: 2.05, d: 0.05, renk, purluluk: 0.55 });
  for (const [px, py] of [[-0.2, 1.35], [0.2, 1.35], [-0.2, 0.35], [0.2, 0.35]]) kutu(g, { w: 0.3, h: py > 1 ? 0.55 : 0.75, d: 0.02, renk: new THREE.Color(renk).offsetHSL(0, 0, -0.05).getHex(), x: px, y: py, z: 0.03, purluluk: 0.6 });
  const tokmak = silindir(g, { r: 0.03, h: 0.05, renk: 0xd9b45a, x: 0.36, y: 1.0, z: 0.05, metal: 1, purluluk: 0.3, kontur: false }); tokmak.rotation.x = Math.PI / 2;
  kutu(g, { w: 1.08, h: 0.08, d: 0.08, renk: cerceve, y: 2.05 }); for (const sx of [-1, 1]) kutu(g, { w: 0.08, h: 2.05, d: 0.08, renk: cerceve, x: sx * 0.5 });
  return g;
}

export function kitaplik(sahne, { x = 0, y = 0, z = 0, ry = 0, w = 1.0, h = 2.0, d = 0.32, renk = 0x5a3820, raf = 5, seed = 3 } = {}) {
  const r = tohumlu(seed); const g = grup(sahne, x, y, z, ry);
  kutu(g, { w, h, d: 0.03, renk, z: -d / 2 });
  for (const sx of [-1, 1]) kutu(g, { w: 0.04, h, d, renk, x: sx * (w / 2 - 0.02) });
  const kitapRenk = [0x8a2f2f, 0x2f4f8a, 0x2f7a4a, 0xc9a24a, 0x6a3f8a, 0xd9d2c0, 0x3a3a3a, 0xb5602a];
  for (let i = 0; i <= raf; i++) {
    const yy = i * (h - 0.04) / raf; kutu(g, { w, h: 0.03, d, renk, y: yy, kontur: i === 0 || i === raf });
    if (i === raf) break;
    let xx = -w / 2 + 0.06;
    while (xx < w / 2 - 0.1) {
      const bw = 0.03 + r() * 0.035, bh = 0.2 + r() * 0.13; if (r() < 0.12) { xx += 0.08; continue; }
      kutu(g, { w: bw, h: bh, d: d * 0.8, renk: kitapRenk[Math.floor(r() * kitapRenk.length)], x: xx + bw / 2, y: yy + 0.03, z: 0.01, purluluk: 0.8, kontur: false });
      xx += bw + 0.004;
    }
  }
  return g;
}

export function cerceve(sahne, { x = 0, y = 1.6, z = 0, ry = 0, w = 0.6, h = 0.45, tip = 'manzara', renk = 0x8a6a2a, seed = 2 } = {}) {
  const g = grup(sahne, x, y, z, ry);
  kutu(g, { w: w + 0.08, h: h + 0.08, d: 0.04, renk, y: -h / 2 - 0.04, metal: 0.6, purluluk: 0.35 });
  const r = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tabloResmi({ tip, seed }), roughness: 0.8 })); r.position.z = 0.025; g.add(r);
  return g;
}

export function hali(sahne, { x = 0, z = 0, r = 1.0, renkler } = {}) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 64), new THREE.MeshStandardMaterial({ map: haliDokusu(renkler ? { renkler } : {}), roughness: 1 }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.006, z); m.receiveShadow = true; sahne.add(m); return m;
}

export function kupa(sahne, { x = 0, y = 0.75, z = 0, renk = 0xe8e0d0 } = {}) {
  const k = silindir(sahne, { r: 0.045, h: 0.1, renk, x, y, z, purluluk: 0.4 });
  const kulp = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.008, 8, 16), k.material); kulp.position.set(0.05, 0, 0); kulp.rotation.y = Math.PI / 2; k.add(kulp);
  return k;
}
