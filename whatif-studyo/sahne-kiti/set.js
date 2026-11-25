// Set parçaları: zemin (cilalı/ıslak yansımalı), kutu dekorlar (kontur çizgili), tabela ve ekran,
// ışık hüzmesi, toz zerreleri, pratik ışıklar, arka plan şehir. SHORTS-FORMULU.md 6.4–6.5 kuralları:
// her mekânın adını veren bir sahne yazısı, kendiliğinden hareket eden en az bir öğe, ön plan nesnesi.
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

const std = (renk, { purluluk = 0.7, metal = 0, emissive = 0x000000, emissiveGuc = 1 } = {}) =>
  new THREE.MeshStandardMaterial({ color: renk, roughness: purluluk, metalness: metal, emissive, emissiveIntensity: emissiveGuc });

// Kontur: ters yüzlü, biraz büyütülmüş siyah kopya (inverted hull)
export function konturEkle(mesh, kalinlik = 0.02, renk = 0x14141a) {
  const k = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color: renk, side: THREE.BackSide }));
  const b = new THREE.Box3().setFromBufferAttribute(mesh.geometry.attributes.position); const s = new THREE.Vector3(); b.getSize(s);
  k.scale.set(1 + 2 * kalinlik / Math.max(s.x, 1e-3), 1 + 2 * kalinlik / Math.max(s.y, 1e-3), 1 + 2 * kalinlik / Math.max(s.z, 1e-3));
  mesh.add(k); return k;
}

export function kutu(sahne, { w = 1, h = 1, d = 1, renk = 0xcccccc, x = 0, y = 0, z = 0, ry = 0, kontur = true, golge = true, ...mat } = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std(renk, mat));
  m.position.set(x, y + h / 2, z); m.rotation.y = ry; m.castShadow = golge; m.receiveShadow = true;
  if (kontur) konturEkle(m, 0.012); sahne.add(m); return m;
}

export function silindir(sahne, { r = 0.3, r2 = null, h = 1, renk = 0xcccccc, x = 0, y = 0, z = 0, kontur = true, seg = 24, ...mat } = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r2 ?? r, r, h, seg), std(renk, mat));
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; if (kontur) konturEkle(m, 0.012); sahne.add(m); return m;
}

// Zemin; cilali=true → altında yansıtıcı (Reflector), üstte yarı saydam cilalı yüzey
export function zemin(sahne, { renk = 0x8a8f99, boyut = 40, cilali = false, yansima = 0.18, desen = null } = {}) {
  const geo = new THREE.PlaneGeometry(boyut, boyut);
  const mat = std(renk, { purluluk: cilali ? 0.35 : 0.85 });
  if (desen) { mat.map = desen; }
  if (cilali) { mat.transparent = true; mat.opacity = 1 - yansima; }
  const z = new THREE.Mesh(geo, mat); z.rotation.x = -Math.PI / 2; z.receiveShadow = true; sahne.add(z);
  if (cilali) {
    const r = new Reflector(geo, { textureWidth: 320, textureHeight: 320, color: 0x888888, clipBias: 0.003 }); // düşük çözünürlük = yumuşak yansıma
    r.rotation.x = -Math.PI / 2; r.position.y = -0.002; sahne.add(r);
  }
  return z;
}

// Karo deseni dokusu (zemin, duvar)
export function karoDoku(renk1 = '#c9c2b6', renk2 = '#b8b0a3', n = 8, tekrar = 10) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d'); const s = 512 / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? renk1 : renk2; g.fillRect(i * s, j * s, s, s); }
  g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 3; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, 512); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(512, i * s); g.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(tekrar, tekrar); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

// Tabela / ekran: metinli düzlem; parlak=true → kendinden ışıklı (bloom'a girer)
export function tabela(sahne, { metin = 'LOBBY', w = 1.6, h = 0.4, zemin = '#1c2a3a', yazi = '#ffffff', kenar = '#0c0f14', parlak = false, guc = 2.5, x = 0, y = 2, z = 0, ry = 0, font = 'bold 120px Arial', satirlar = null } = {}) {
  const cv = document.createElement('canvas'); const oran = w / h; cv.width = 1024; cv.height = Math.round(1024 / oran); const g = cv.getContext('2d');
  g.fillStyle = kenar; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = zemin; const p = Math.round(cv.height * 0.08); g.fillRect(p, p, cv.width - 2 * p, cv.height - 2 * p);
  g.fillStyle = yazi; g.textAlign = 'center'; g.textBaseline = 'middle';
  const lines = satirlar || [metin]; const fs = Math.min(parseInt(font.match(/(\d+)px/)[1]), Math.floor((cv.height - 2 * p) / lines.length * 0.8));
  g.font = font.replace(/\d+px/, fs + 'px');
  lines.forEach((l, i) => g.fillText(l, cv.width / 2, p + (cv.height - 2 * p) * (i + 0.5) / lines.length));
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const mat = parlak ? new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: guc, roughness: 0.6 }) : new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), [std(0x111111), std(0x111111), std(0x111111), std(0x111111), mat, std(0x111111)]);
  m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = true; sahne.add(m); konturEkle(m, 0.01); return m;
}

// Işık hüzmesi: tepeden yere genişleyen koni, toplamalı (additive) yumuşak geçiş
export function isikHuzmesi(sahne, { tepe = [0, 3, 0], taban = [0, 0, 0], r1 = 0.08, r2 = 0.9, renk = 0xffd9a0, guc = 0.35 } = {}) {
  const a = new THREE.Vector3(...tepe), b = new THREE.Vector3(...taban); const L = a.distanceTo(b);
  const geo = new THREE.CylinderGeometry(r1, r2, L, 48, 1, true); geo.translate(0, -L / 2, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    uniforms: { renk: { value: new THREE.Color(renk) }, guc: { value: guc }, L: { value: L } },
    vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = position.y; vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 renk; uniform float guc; uniform float L; varying float vY; varying vec3 vN; varying vec3 vV;
      void main(){ float t = clamp(-vY/L,0.0,1.0); float kenar = pow(abs(dot(vN,vV)),1.6); float a = guc*kenar*(1.0-t)*smoothstep(0.0,0.12,t); gl_FragColor = vec4(renk*a, a); }`,
  });
  const m = new THREE.Mesh(geo, mat); m.position.copy(a); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), b.clone().sub(a).normalize());
  sahne.add(m); return m;
}

// Toz zerreleri (ışık hüzmesinde süzülen); t ile güncellenir
export function toz(sahne, { n = 300, merkez = [0, 1.5, 0], alan = [2, 3, 2], renk = 0xfff1d0, boyut = 0.02 } = {}) {
  const pos = new Float32Array(n * 3); const tohum = new Float32Array(n);
  for (let i = 0; i < n; i++) { pos[i * 3] = merkez[0] + (Math.random() - 0.5) * alan[0]; pos[i * 3 + 1] = merkez[1] + (Math.random() - 0.5) * alan[1]; pos[i * 3 + 2] = merkez[2] + (Math.random() - 0.5) * alan[2]; tohum[i] = Math.random() * 100; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const cv = document.createElement('canvas'); cv.width = cv.height = 32; const g = cv.getContext('2d'); const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
  const p = new THREE.Points(geo, new THREE.PointsMaterial({ color: renk, size: boyut, map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 }));
  p.userData.guncelle = (t) => { const a = geo.attributes.position; for (let i = 0; i < n; i++) { a.array[i * 3 + 1] += Math.sin(t * 0.5 + tohum[i]) * 0.0008; a.array[i * 3] += Math.cos(t * 0.3 + tohum[i]) * 0.0006; } a.needsUpdate = true; };
  sahne.add(p); return p;
}

// Pratik ışık: görünür ampul/aplik + nokta ışık
export function pratikIsik(sahne, { x = 0, y = 2.5, z = 0, renk = 0xffc27a, guc = 6, menzil = 6, ampul = true, boyut = 0.08 } = {}) {
  const l = new THREE.PointLight(renk, guc, menzil, 2); l.position.set(x, y, z); sahne.add(l); // duvardan en az 0,4 m uzak koy
  if (ampul) { const b = new THREE.Mesh(new THREE.SphereGeometry(boyut, 16, 12), new THREE.MeshStandardMaterial({ color: renk, emissive: renk, emissiveIntensity: 4 })); b.position.copy(l.position); sahne.add(b); }
  return l;
}

// Pencere arkası gece şehri: ışıklı pencereli bina siluetleri (arka plan katmanı)
export function sehir(sahne, { z = -12, genislik = 24, adet = 14, renk = 0x1b2547, pencere = '#ffd28a', seed = 3 } = {}) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const g = new THREE.Group();
  for (let i = 0; i < adet; i++) {
    const w = 1 + rnd() * 2.2, h = 3 + rnd() * 9, x = -genislik / 2 + (i + rnd() * 0.5) * genislik / adet;
    const cv = document.createElement('canvas'); cv.width = 64; cv.height = Math.round(64 * h / w); const c = cv.getContext('2d');
    c.fillStyle = '#' + new THREE.Color(renk).getHexString(); c.fillRect(0, 0, cv.width, cv.height);
    for (let yy = 6; yy < cv.height - 4; yy += 10) for (let xx = 6; xx < 60; xx += 10) if (rnd() < 0.45) { c.fillStyle = pencere; c.globalAlpha = 0.5 + rnd() * 0.5; c.fillRect(xx, yy, 5, 6); c.globalAlpha = 1; }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.9, roughness: 1 }));
    m.position.set(x, h / 2, z - rnd() * 3); g.add(m);
  }
  sahne.add(g); return g;
}

// Saksı bitkisi (ön plan nesnesi için)
export function bitki(sahne, { x = 0, z = 0, olcek = 1, saksi = 0xb5654a, yaprak = 0x3f8f4f } = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(olcek); sahne.add(g);
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.42, 20), std(saksi, { purluluk: 0.8 })); s.position.y = 0.21; s.castShadow = true; konturEkle(s, 0.01); g.add(s);
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; const y = new THREE.Mesh(new THREE.SphereGeometry(0.16 + (i % 3) * 0.03, 12, 10), std(yaprak, { purluluk: 0.75 }));
    y.position.set(Math.cos(a) * 0.14, 0.62 + (i % 3) * 0.13, Math.sin(a) * 0.14); y.scale.set(1, 1.35, 0.6); y.rotation.y = a; y.castShadow = true; g.add(y); }
  return g;
}
