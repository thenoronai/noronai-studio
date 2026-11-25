// Örnek çekimler: "What If Your Elevator Cable Snapped?" için kitin parçalarının birlikte nasıl
// kullanıldığını gösterir; içerik bu stüdyoya ait orijinal tasarımdır.
//  A · Lobi, gece mavisi: iki karakter asansör önünde (sakin kahraman, alaycı iş arkadaşı)
//  B · Kabin içi, tehlike ışığı: dehşet yüzü, yatık kadraj
//  C · Bina dışı, altın saat: alçak açı, ışık hüzmesi, uzun gölgeler
//  D · Ev içi, gece: ay ışığı (pencere gobosu) + sıcak abajur, yoğun dekor, üniformalı ikinci karakter
//  K · Kadro sayfası: 8 kıyafet/şapka/ifade örneği (16:9 render edin: node render.mjs K 1600 900)
//  Y · Yüz ifadesi sayfası: SHORTS-FORMULU 6.2'deki 12 kimlik (node render.mjs Y 1600 1200)
//  L · Işık hazırı sayfası: aynı set, istenen hazır (node render.mjs L 540 960 0 hazir=neon-gece)
import * as THREE from 'three';
import { sahneKur, kameraAyarla, itme } from './sahne.js';
import { isikUygula } from './isik.js';
import { karakterYap, ifadeAyarla, kolPoz, IFADELER } from './karakter.js';
import { zemin, karoDoku, kutu, silindir, tabela, isikHuzmesi, toz, pratikIsik, sehir, bitki } from './set.js';
import { sonIslem } from './post.js';
import { duvarKagidi, ahsap, tugla } from './dokular.js';
import { koltuk, lamba, pencere, perde, kapi, kitaplik, cerceve, hali, masa, kupa, asiliAmpul } from './esyalar.js';

function lobi(s) {
  const { sahne } = s;
  isikUygula(sahne, s.renderer, 'gece-mavi', { hedef: new THREE.Vector3(0, 1, -0.5), alan: 7 });
  zemin(sahne, { renk: 0x9aa3b5, cilali: true, yansima: 0.22, desen: karoDoku('#7d7a86', '#6a6774', 8, 14) });
  // arka duvar, lambri, süpürgelik
  kutu(sahne, { w: 9, h: 3.6, d: 0.3, renk: 0xb7a07f, z: -2.15, kontur: false, purluluk: 0.8 });
  kutu(sahne, { w: 9, h: 1.0, d: 0.34, renk: 0x6e4f39, z: -2.1, kontur: false, purluluk: 0.6 });
  kutu(sahne, { w: 9, h: 0.12, d: 0.4, renk: 0x2a2026, z: -2.05, kontur: false });
  // asansör: çerçeve + iki metal kapı + ortadaki çizgi
  kutu(sahne, { w: 1.7, h: 2.55, d: 0.12, renk: 0x4a3524, z: -1.95, metal: 0.4, purluluk: 0.45 });
  for (const sx of [-1, 1]) kutu(sahne, { w: 0.68, h: 2.3, d: 0.06, renk: 0xc9cfd8, x: sx * 0.345, z: -1.86, metal: 0.9, purluluk: 0.28, kontur: true });
  // kat göstergesi ve çağırma düğmesi (parlak)
  tabela(sahne, { metin: '12 ▲', w: 0.7, h: 0.26, zemin: '#1a0e05', yazi: '#ffb43a', parlak: true, guc: 3.2, y: 2.82, z: -1.88, font: 'bold 150px Arial' });
  const panel = kutu(sahne, { w: 0.16, h: 0.34, d: 0.05, renk: 0x8f949c, x: 1.05, y: 1.05, z: -1.95, metal: 0.8, purluluk: 0.35 });
  const dugme = new THREE.Mesh(new THREE.CircleGeometry(0.035, 20), new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0xffc04a, emissiveIntensity: 4 }));
  dugme.position.set(1.05, 1.25, -1.92); sahne.add(dugme);
  // bina adı tabelası (mekânın adını veren sahne yazısı)
  tabela(sahne, { metin: 'HALLER TOWER', w: 2.4, h: 0.34, zemin: '#2b2116', yazi: '#f3d9a4', kenar: '#16110b', y: 3.25, z: -1.97, font: 'bold 130px Georgia' });
  // aplikler: pratik ışık + hüzme + toz
  for (const sx of [-1, 1]) {
    silindir(sahne, { r: 0.07, r2: 0.13, h: 0.22, renk: 0xffe2a8, x: sx * 1.55, y: 2.05, z: -1.92, emissive: 0xffc27a, emissiveGuc: 2.5, kontur: true });
    pratikIsik(sahne, { x: sx * 1.55, y: 2.0, z: -1.45, renk: 0xffb866, guc: 1.6, menzil: 4, ampul: false });
    isikHuzmesi(sahne, { tepe: [sx * 1.55, 2.12, -1.85], taban: [sx * 1.4, 0, -1.2], r1: 0.1, r2: 0.75, renk: 0xffc27a, guc: 0.22 });
  }
  toz(sahne, { n: 260, merkez: [0, 1.6, -1.2], alan: [3.4, 2.6, 1.4], boyut: 0.025 });
  // tavan ve ışık panelleri
  kutu(sahne, { w: 9, h: 0.1, d: 6, renk: 0x9a9384, y: 3.55, z: -0.5, kontur: false, golge: false });
  for (const zz of [-1.2, 0.6]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.5), new THREE.MeshStandardMaterial({ color: 0xdfeaff, emissive: 0xcfe0ff, emissiveIntensity: 1.3 })); p.rotation.x = Math.PI / 2; p.position.set(0, 3.54, zz); sahne.add(p); }
  // sağda pencere şeridi ve arkada gece şehri
  kutu(sahne, { w: 0.9, h: 2.8, d: 0.05, renk: 0x0d1430, x: 2.2, y: 0.3, z: -2.0, kontur: true, metal: 0.2, purluluk: 0.1, emissive: 0x0a1020 });
  sehir(sahne, { z: -10, genislik: 20, adet: 16 });
  // dekor yoğunluğu: tablo, saat, çöp kutusu, "ıslak zemin" uyarısı (ön plan)
  for (const [x, renk1, renk2] of [[-2.25, '#f2b880', '#5b8fd0'], [2.95, '#9fd0a0', '#e07a5f']]) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 192; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 192); gr.addColorStop(0, renk2); gr.addColorStop(1, renk1); g.fillStyle = gr; g.fillRect(0, 0, 256, 192);
    g.fillStyle = 'rgba(40,60,40,0.85)'; g.beginPath(); g.moveTo(0, 192); g.quadraticCurveTo(90, 90, 170, 150); g.quadraticCurveTo(220, 120, 256, 140); g.lineTo(256, 192); g.fill();
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
    const f = kutu(sahne, { w: 0.9, h: 0.68, d: 0.05, renk: 0x3b2a1e, x, y: 1.55, z: -1.97 });
    const resim = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.56), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.8 })); resim.position.set(x, 1.89, -1.94); sahne.add(resim);
  }
  const saat = silindir(sahne, { r: 0.22, h: 0.05, renk: 0xf4efe6, x: 1.78, y: 2.6, z: -1.98 }); saat.rotation.x = Math.PI / 2; saat.position.y = 2.82;
  silindir(sahne, { r: 0.17, r2: 0.2, h: 0.5, renk: 0x50555e, x: -1.75, z: -1.55, metal: 0.6, purluluk: 0.4 });
  const uyari = new THREE.Group(); uyari.position.set(1.05, 0, 1.15); uyari.rotation.y = -0.35; sahne.add(uyari);
  for (const sx of [-1, 1]) { const ayak = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.025), new THREE.MeshStandardMaterial({ color: 0xf2c230, roughness: 0.55 })); ayak.position.set(0, 0.3, sx * 0.08); ayak.rotation.x = sx * 0.16; ayak.castShadow = true; uyari.add(ayak); }
  tabela(uyari, { satirlar: ['CAUTION', 'WET FLOOR'], w: 0.36, h: 0.3, zemin: '#f2c230', yazi: '#1b1b1b', kenar: '#f2c230', y: 0.36, z: 0.11, font: 'bold 110px Arial' });
  // ön plan bitkisi (alan derinliğiyle bulanık) ve arka bank
  bitki(sahne, { x: -1.05, z: 1.6, olcek: 1.25 });
  kutu(sahne, { w: 1.2, h: 0.45, d: 0.45, renk: 0x5a3b2a, x: -2.3, z: -1.6, purluluk: 0.6 });
  // karakterler: sakin kahraman (turuncu, yan ayrık) ve alaycı iş arkadaşı (mor, kıvırcık)
  const dave = karakterYap({ ust: 0xe8812f, alt: 0x394062, sac: 0x5a3a22, sacStil: 'yan-ayrik', aksesuar: 'kravat' });
  dave.position.set(-0.42, 0, 0.15); sahne.add(dave); ifadeAyarla(dave, 'emin');
  const is = karakterYap({ ust: 0x7b4bd0, alt: 0x2c2c3c, sac: 0x1d1a22, sacStil: 'kivircik', ten: 0xe9c7a4, boy: 1.66 });
  is.position.set(0.5, 0, 0.45); sahne.add(is); ifadeAyarla(is, 'alayci'); kolPoz(is, 0.25, 1.2);
  isikUygula(sahne, s.renderer, 'gece-mavi', { hedef: new THREE.Vector3(0, 1, -0.5), alan: 7 }); // tonları yeni parçalara da uygula
  return { kamera: { konum: [0.05, 1.12, 4.25], hedef: [0.02, 1.5, -0.6] }, kameraSon: { konum: [0.05, 1.14, 3.8], hedef: [0.02, 1.5, -0.6] }, dof: { odak: 3.95, aciklik: 0.0012, maks: 0.006 } };
}

function kabin(s) {
  const { sahne } = s;
  isikUygula(sahne, s.renderer, 'tehlike', { hedef: new THREE.Vector3(0, 1.3, 0), alan: 4 });
  zemin(sahne, { renk: 0x4a4a52, cilali: false });
  // kabin duvarları (fırçalanmış metal) ve tutamak
  // fırçalanmış metal paneller: dikey derzli doku
  const cvp = document.createElement('canvas'); cvp.width = 512; cvp.height = 512; const gp = cvp.getContext('2d');
  gp.fillStyle = '#c4c8cf'; gp.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 400; i++) { gp.fillStyle = `rgba(255,255,255,${0.03 + (i % 7) * 0.006})`; gp.fillRect(0, (i * 37) % 512, 512, 1); }
  gp.fillStyle = '#7d828b'; for (const x of [0, 170, 340]) gp.fillRect(x, 0, 5, 512);
  const panelDoku = new THREE.CanvasTexture(cvp); panelDoku.colorSpace = THREE.SRGBColorSpace;
  const arka = kutu(sahne, { w: 2.2, h: 2.6, d: 0.08, renk: 0xffffff, z: -0.9, metal: 0.45, purluluk: 0.4, kontur: false }); arka.material.map = panelDoku;
  for (const sx of [-1, 1]) { const yan = kutu(sahne, { w: 0.08, h: 2.6, d: 2.4, renk: 0xf0f0f0, x: sx * 1.1, z: 0.2, metal: 0.45, purluluk: 0.4, kontur: false }); yan.material.map = panelDoku; }
  kutu(sahne, { w: 2.1, h: 0.05, d: 0.06, renk: 0xb7bcc4, y: 0.86, z: -0.82, metal: 1, purluluk: 0.25, kontur: false });
  // kırmızı acil durum lambası + düğme paneli
  silindir(sahne, { r: 0.12, h: 0.06, renk: 0xff2a1a, y: 2.5, z: -0.6, emissive: 0xff2010, emissiveGuc: 6 });
  pratikIsik(sahne, { x: 0, y: 2.3, z: 0.2, renk: 0xff3020, guc: 2.5, menzil: 5, ampul: false });
  const p = tabela(sahne, { satirlar: ['12', '11', '10'], w: 0.22, h: 0.5, zemin: '#0b0b0e', yazi: '#ff5a3c', parlak: true, guc: 2, x: 0.85, y: 1.45, z: -0.84, font: 'bold 160px Arial' });
  const dave = karakterYap({ ust: 0xe8812f, alt: 0x394062, sac: 0x5a3a22, sacStil: 'yan-ayrik', aksesuar: 'kravat' });
  dave.position.set(-0.05, 0, 0.1); sahne.add(dave); ifadeAyarla(dave, 'dehset'); kolPoz(dave, 2.65, 2.65);
  isikUygula(sahne, s.renderer, 'tehlike', { hedef: new THREE.Vector3(0, 1.3, 0), alan: 4 });
  return { kamera: { konum: [0.12, 1.36, 1.6], hedef: [-0.02, 1.38, 0], yatik: 6, fov: 50 }, dof: { odak: 1.5, aciklik: 0.003, maks: 0.008 } };
}

function disari(s) {
  const { sahne } = s;
  isikUygula(sahne, s.renderer, 'altin-saat', { hedef: new THREE.Vector3(0, 3, -3), alan: 14 });
  zemin(sahne, { renk: 0xb9a48c, cilali: false, desen: karoDoku('#c7b59b', '#b8a68e', 6, 20) });
  // kule: cam cephe + asansör kuyusu şeridi
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 1024; const g = cv.getContext('2d');
  g.fillStyle = '#5b6f8f'; g.fillRect(0, 0, 256, 1024);
  let tohum = 7; const rnd = () => (tohum = (tohum * 16807) % 2147483647) / 2147483647;
  for (let y = 8; y < 1024; y += 40) for (let x = 8; x < 256; x += 32) { g.fillStyle = rnd() < 0.3 ? '#ffd9a0' : '#9fb6d6'; g.fillRect(x, y, 24, 30); }
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
  const kule = new THREE.Mesh(new THREE.BoxGeometry(5, 26, 4), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.25, metalness: 0.3, emissive: 0xffffff, emissiveMap: tx, emissiveIntensity: 0.18 }));
  kule.position.set(0, 13, -6); kule.castShadow = true; kule.receiveShadow = true; sahne.add(kule);
  kutu(sahne, { w: 0.9, h: 26, d: 0.3, renk: 0xcfe3f5, x: 1.6, y: 0, z: -3.9, metal: 0.2, purluluk: 0.08, emissive: 0x6a88a8, emissiveGuc: 0.25 });
  // giriş saçağı ve bina adı
  kutu(sahne, { w: 3.6, h: 0.25, d: 1.4, renk: 0x3a2c22, y: 3.0, z: -3.4 });
  tabela(sahne, { metin: 'HALLER TOWER', w: 3.0, h: 0.42, zemin: '#2b2116', yazi: '#f3d9a4', kenar: '#16110b', y: 3.38, z: -2.72, font: 'bold 130px Georgia' });
  kutu(sahne, { w: 2.0, h: 2.6, d: 0.1, renk: 0x1d2633, z: -3.95, metal: 0.3, purluluk: 0.15, emissive: 0x2a3240, emissiveGuc: 0.6 });
  // ağaçlar
  for (const [x, z, o] of [[-3.2, -2.5, 1.2], [3.4, -2.8, 1.0], [-4.6, 0.5, 1.4]]) {
    silindir(sahne, { r: 0.12, h: 2.2 * o, renk: 0x5a3e2b, x, z });
    const t = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 * o, 1), new THREE.MeshStandardMaterial({ color: 0x5d8f45, roughness: 0.85, flatShading: true }));
    t.position.set(x, 2.6 * o, z); t.castShadow = true; sahne.add(t);
  }
  sehir(sahne, { z: -30, genislik: 60, adet: 22, renk: 0x6a5a7a, pencere: '#ffe2a8' });
  isikHuzmesi(sahne, { tepe: [-9, 9, -6], taban: [1, 0, 0], r1: 0.4, r2: 3.2, renk: 0xffb46a, guc: 0.06 });
  toz(sahne, { n: 220, merkez: [0, 2, -1], alan: [6, 4, 4], boyut: 0.04, renk: 0xffd7a0 });
  const dave = karakterYap({ ust: 0xe8812f, alt: 0x394062, sac: 0x5a3a22, sacStil: 'yan-ayrik', aksesuar: 'kravat' });
  dave.position.set(-0.5, 0, -1.2); sahne.add(dave); ifadeAyarla(dave, 'mutlu'); kolPoz(dave, 0.3, 0.3);
  const is = karakterYap({ ust: 0x7b4bd0, alt: 0x2c2c3c, sac: 0x1d1a22, sacStil: 'kivircik', ten: 0xe9c7a4, boy: 1.66 });
  is.position.set(0.45, 0, -1.05); sahne.add(is); ifadeAyarla(is, 'sinirli'); kolPoz(is, 1.2, 0.2);
  isikUygula(sahne, s.renderer, 'altin-saat', { hedef: new THREE.Vector3(0, 3, -3), alan: 14 });
  return { kamera: { konum: [0.3, 0.55, 4.2], hedef: [0.1, 4.2, -3] }, dof: null };
}

function ev(s) {
  const { sahne } = s;
  isikUygula(sahne, s.renderer, 'gece-mavi', { hedef: new THREE.Vector3(0, 1, -1), alan: 6 });
  // oda kabuğu: duvar kâğıdı + lambri + ahşap zemin + tavan (duvarlar gölge düşürmez: pencere ışığı içeri girsin)
  const zm = new THREE.Mesh(new THREE.PlaneGeometry(9, 8), new THREE.MeshStandardMaterial({ map: ahsap({ renk: '#8a5a36', tekrar: [3, 3] }), roughness: 0.55 }));
  zm.rotation.x = -Math.PI / 2; zm.position.z = 0.5; zm.receiveShadow = true; sahne.add(zm);
  const arka = kutu(sahne, { w: 7, h: 3.2, d: 0.2, renk: 0xffffff, z: -2.3, kontur: false, golge: false }); arka.material.map = duvarKagidi({ zemin: '#b4967a', desen: '#c4a88b', cizgi: '#9c7e62', tekrar: [6, 3] });
  const sol = kutu(sahne, { w: 0.2, h: 3.2, d: 6, renk: 0xffffff, x: -2.9, z: 0.6, kontur: false, golge: false }); sol.material.map = duvarKagidi({ zemin: '#ab8d72', desen: '#bb9f83', cizgi: '#95775c', tekrar: [5, 3] });
  kutu(sahne, { w: 7, h: 0.95, d: 0.24, renk: 0x5a3822, z: -2.28, kontur: false, golge: false, purluluk: 0.5 });
  kutu(sahne, { w: 7, h: 0.05, d: 0.28, renk: 0x3e2616, y: 0.95, z: -2.28, kontur: false, golge: false });
  kutu(sahne, { w: 7, h: 0.12, d: 6, renk: 0xd9ccb6, y: 3.2, z: 0.6, kontur: false, golge: false });
  kutu(sahne, { w: 7, h: 0.14, d: 0.3, renk: 0xe8dcc6, y: 3.06, z: -2.2, kontur: false, golge: false });
  // pencere (ay ışığı + gobo), perdeler
  pencere(sahne, { x: 0.75, y: 1.05, z: -2.17, w: 1.1, h: 1.35, disari: 'gece', isikGuc: 45, hedef: [-0.35, 0, 2.0] });
  perde(sahne, { x: 0.02, y: 0.35, z: -2.08, w: 0.42, h: 2.5, renk: 0x6e1f2c }); perde(sahne, { x: 1.48, y: 0.35, z: -2.08, w: 0.42, h: 2.5, renk: 0x6e1f2c });
  kutu(sahne, { w: 2.0, h: 0.05, d: 0.05, renk: 0x3a2416, x: 0.75, y: 2.85, z: -2.06 });
  // sol köşe: kitaplık, koltuk, ayaklı lamba, sehpa, tablolar
  kitaplik(sahne, { x: -2.05, z: -2.0, w: 1.1, h: 2.1 });
  koltuk(sahne, { x: -1.25, z: -1.25, ry: 0.35, renk: 0x2f5a5a });
  lamba(sahne, { x: -0.55, z: -1.75, boy: 1.55, guc: 1.6 });
  asiliAmpul(sahne, { x: 0.2, y: 3.2, z: -0.9, kablo: 0.55, guc: 1.1, abajur: 0xe9d6b0 });
  masa(sahne, { x: -0.35, z: -0.95, w: 0.5, d: 0.5, h: 0.55 }); kupa(sahne, { x: -0.3, y: 0.55, z: -0.9 });
  cerceve(sahne, { x: -1.0, y: 2.35, z: -2.18, w: 0.62, h: 0.46, tip: 'manzara' });
  cerceve(sahne, { x: 2.1, y: 2.45, z: -2.18, w: 0.36, h: 0.46, tip: 'portre', renk: 0x5a4a2a });
  const saat = silindir(sahne, { r: 0.17, h: 0.04, renk: 0xf2ead8, x: -0.1, y: 0, z: -2.16 }); saat.rotation.x = Math.PI / 2; saat.position.y = 2.6;
  kapi(sahne, { x: 2.45, z: -2.16 });
  hali(sahne, { x: 0.25, z: -0.35, r: 1.25, renkler: ['#5e2b2b', '#9c844e', '#3c4560', '#5e2b2b', '#cdbf9c'] });
  bitki(sahne, { x: 1.85, z: -1.75, olcek: 1.1 });
  toz(sahne, { n: 220, merkez: [0.3, 1.2, -0.8], alan: [1.6, 2.0, 2.2], boyut: 0.02, renk: 0xcfe0ff });
  // karakterler: kahraman (gömlek) ve kapıcı (üniforma + kep)
  const dave = karakterYap({ ust: 0xe8812f, alt: 0x394062, sac: 0x5a3a22, sacStil: 'yan-ayrik', aksesuar: 'kravat' });
  dave.position.set(0.05, 0, -0.35); sahne.add(dave); ifadeAyarla(dave, 'kuskulu'); kolPoz(dave, 0.15, 0.6);
  const kapici = karakterYap({ ust: 0x2c3f6e, alt: 0x1d2440, sac: 0x9a9a9a, sacStil: 'kel', ten: 0xd9a47c, kiyafet: 'uniforma', sapka: 'kep', boy: 1.62 });
  kapici.position.set(1.55, 0, -1.25); sahne.add(kapici); ifadeAyarla(kapici, 'sinirli'); kolPoz(kapici, 0.1, 1.35);
  isikUygula(sahne, s.renderer, 'gece-mavi', { hedef: new THREE.Vector3(0, 1, -1), alan: 6, karakterTon: [0.98, 0.92, 0.9] });
  return { kamera: { konum: [0.25, 1.22, 4.1], hedef: [0.2, 1.12, -1.2], fov: 52 }, dof: { odak: 4.45, aciklik: 0.0012, maks: 0.006 } };
}

function kostum(s) {
  const { sahne } = s;
  isikUygula(sahne, s.renderer, 'gunduz', { hedef: new THREE.Vector3(0, 1, 0), alan: 6 });
  zemin(sahne, { renk: 0xd8d2c4 });
  kutu(sahne, { w: 9, h: 4, d: 0.2, renk: 0xe9e1cf, z: -1.6, kontur: false, golge: false });
  const kadro = [
    { ust: 0xe8812f, alt: 0x394062, aksesuar: 'kravat' },
    { ust: 0x2f3b55, alt: 0x22283a, kiyafet: 'ceket', sacStil: 'kakul', sac: 0x2a1d14, aksesuar: 'kravat' },
    { ust: 0x2c3f6e, alt: 0x1d2440, kiyafet: 'uniforma', sapka: 'kep', sacStil: 'kel', ten: 0xd9a47c },
    { ust: 0x3a4e9a, kiyafet: 'cubbe', sacStil: 'topuz', sac: 0x1a1414, kemer: 0xe0b84a },
    { ust: 0x8a2f5a, kiyafet: 'elbise', sacStil: 'kivircik', sac: 0x6a3a1a, ten: 0xe9c7a4, alt: 0x5a1f3a },
    { ust: 0x6e2a2a, kiyafet: 'cubbe', sapka: 'tac', sacStil: 'kel', ten: 0xf0d2b0, kemer: 0xe8b33a },
    { ust: 0x4a5a3a, alt: 0x3a3226, kiyafet: 'ceket', sapka: 'fotr', ic: 0xe9e2d0 },
    { ust: 0x2f7a6a, alt: 0x2a2a3a, sapka: 'bere', aksesuar: 'gozluk', sacStil: 'yan-ayrik' },
  ];
  const ifade = ['emin', 'alayci', 'sinirli', 'mutlu', 'saskin', 'kuskulu', 'notr', 'uykulu'];
  kadro.forEach((o, i) => { const k = karakterYap(o); k.position.set((i - 3.5) * 0.78, 0, 0); sahne.add(k); ifadeAyarla(k, ifade[i]); });
  isikUygula(sahne, s.renderer, 'gunduz', { hedef: new THREE.Vector3(0, 1, 0), alan: 6 });
  return { kamera: { konum: [0, 1.0, 7.4], hedef: [0, 0.98, 0], fov: 30 }, dof: null };
}

function ifadeler(s) { // yüz ifadesi sayfası: 12 kimlik, yalnız kafalar (node render.mjs Y 1600 1200)
  const { sahne } = s;
  isikUygula(sahne, s.renderer, 'gunduz', { hedef: new THREE.Vector3(0, 0, 0), alan: 6 });
  kutu(sahne, { w: 12, h: 8, d: 0.2, renk: 0xe9e1cf, y: -4, z: -1.0, kontur: false, golge: false });
  const tenler = [0xf4dcc4, 0xe9c7a4, 0xd9a47c, 0xf0d2b0];
  IFADELER.forEach((ad, i) => {
    const sat = Math.floor(i / 4), sut = i % 4; const x = (sut - 1.5) * 0.78, y = 0.85 - sat * 0.85;
    const k = karakterYap({ ten: tenler[i % 4], sacStil: ['yan-ayrik', 'kivircik', 'kakul', 'topuz'][(i + sat) % 4], sac: [0x5a3a22, 0x1d1a22, 0x8a5a2a, 0x2a1d14][i % 4] });
    const { govde, kafa } = k.userData; govde.children.forEach((c) => (c.visible = c === kafa)); k.children.forEach((c) => (c.visible = c === govde));
    k.position.set(x, y - 1.335, 0); sahne.add(k); ifadeAyarla(k, ad);
    tabela(sahne, { metin: 'yuz.' + ad, w: 0.56, h: 0.11, zemin: '#2b2f3a', yazi: '#f4f1ea', kenar: '#2b2f3a', x, y: y - 0.39, z: 0.05, font: 'bold 120px Arial' });
  });
  sahne.traverse((o) => { if (o.isMesh) o.castShadow = false; }); // sayfada etiket gölgesi istenmez
  isikUygula(sahne, s.renderer, 'gunduz', { hedef: new THREE.Vector3(0, 0, 0), alan: 6 });
  return { kamera: { konum: [0, 0.02, 6.2], hedef: [0, 0.0, 0], fov: 28 }, dof: null };
}

function isikSayfasi(s, hazir = 'gece-mavi') { // aynı küçük set, sekiz ışık hazırı (node render.mjs L 540 960 0 hazir=tek-ampul)
  const { sahne } = s; const gece = !['gunduz', 'altin-saat', 'floresan'].includes(hazir);
  isikUygula(sahne, s.renderer, hazir, { hedef: new THREE.Vector3(0, 1, -0.5), alan: 6 });
  zemin(sahne, { renk: 0x8f8a84, cilali: true, yansima: 0.2, desen: karoDoku('#77736e', '#66625e', 8, 12) });
  const duvar = kutu(sahne, { w: 6, h: 3.4, d: 0.2, renk: 0xffffff, z: -1.9, kontur: false, golge: false }); duvar.material.map = tugla({ tekrar: [5, 3] });
  pencere(sahne, { x: 1.0, y: 1.0, z: -1.78, w: 0.9, h: 1.2, disari: gece ? 'gece' : 'gun', isik: false });
  kapi(sahne, { x: -1.35, z: -1.77 });
  tabela(sahne, { metin: 'OPEN', w: 0.7, h: 0.26, zemin: '#2a0d14', yazi: '#ff5a7a', parlak: true, guc: 3, x: 1.0, y: 2.55, z: -1.77, font: 'bold 150px Arial' });
  asiliAmpul(sahne, { x: -0.1, y: 3.4, z: -0.6, kablo: 0.9, guc: hazir === 'tek-ampul' ? 2.4 : 0.8 });
  bitki(sahne, { x: 1.9, z: -1.3, olcek: 1.0 }); masa(sahne, { x: 0.75, z: -1.05, w: 0.7, d: 0.45, h: 0.72 }); kupa(sahne, { x: 0.8, y: 0.72, z: -1.0 });
  toz(sahne, { n: 160, merkez: [0, 1.6, -0.6], alan: [2.4, 2.2, 1.5], boyut: 0.022 });
  const k = karakterYap({ ust: 0x2f3b55, alt: 0x22283a, kiyafet: 'ceket', sacStil: 'kakul', sac: 0x2a1d14, aksesuar: 'kravat' });
  k.position.set(-0.2, 0, -0.3); sahne.add(k); ifadeAyarla(k, 'emin'); kolPoz(k, 0.1, 0.35);
  isikUygula(sahne, s.renderer, hazir, { hedef: new THREE.Vector3(0, 1, -0.5), alan: 6 });
  return { kamera: { konum: [0.1, 1.25, 3.4], hedef: [0.1, 1.3, -1], fov: 54 }, dof: { odak: 3.7, aciklik: 0.0012, maks: 0.005 } };
}

export const CEKIMLER = { A: lobi, B: kabin, C: disari, D: ev, K: kostum, Y: ifadeler, L: isikSayfasi };

export async function cekimRender(ad, { genislik = 540, yukseklik = 960, t = 0, tuval = null, bayrak = {} } = {}) {
  const s = sahneKur({ genislik, yukseklik, tuval });
  const c = CEKIMLER[ad](s, bayrak.hazir);
  const kam = c.kameraSon ? { ...c.kamera, konum: itme(c.kamera.konum, c.kameraSon.konum, t) } : c.kamera;
  kameraAyarla(s.kamera, kam);
  s.sahne.traverse((o) => o.userData?.guncelle?.(t));
  if (bayrak.post === '0') { s.renderer.render(s.sahne, s.kamera); return s; }
  const { comp, bloom } = sonIslem(s.renderer, s.sahne, s.kamera, { genislik, yukseklik, dof: bayrak.dof === '0' ? null : c.dof });
  if (bayrak.bloom === '0') bloom.enabled = false;
  comp.render();
  return s;
}
