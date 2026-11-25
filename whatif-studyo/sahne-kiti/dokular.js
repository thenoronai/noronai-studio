// Yordamsal dokular (canvas): duvar kâğıdı, ahşap, tuğla, taş, halı, gece/gündüz pencere manzarası.
// Hepsi tekrarlanabilir (RepeatWrapping), sRGB ve tohumlu: aynı ayar = aynı kare.
import * as THREE from 'three';

export function tohumlu(seed = 1) { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function doku(cv, tekrar = [1, 1]) {
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...tekrar); t.anisotropy = 8; return t;
}
function tuval(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }

// tip: 'serit' (çizgili), 'damask' (madalyonlu), 'kare' (ekose)
export function duvarKagidi({ zemin = '#6e5060', desen = '#80606f', cizgi = '#5c4250', tip = 'damask', tekrar = [4, 2] } = {}) {
  const [c, g] = tuval(256, 256); g.fillStyle = zemin; g.fillRect(0, 0, 256, 256);
  if (tip === 'serit' || tip === 'damask') { g.fillStyle = cizgi; for (let x = 0; x < 256; x += 64) { g.fillRect(x, 0, 6, 256); g.fillRect(x + 12, 0, 2, 256); } }
  if (tip === 'damask') {
    g.fillStyle = desen;
    for (const [cx, cy] of [[38, 64], [38, 192], [102, 0], [102, 128], [102, 256], [166, 64], [166, 192], [230, 0], [230, 128], [230, 256]]) {
      g.beginPath(); g.ellipse(cx, cy, 14, 22, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(cx, cy - 34); g.lineTo(cx + 8, cy - 22); g.lineTo(cx, cy - 18); g.lineTo(cx - 8, cy - 22); g.fill();
      g.beginPath(); g.moveTo(cx, cy + 34); g.lineTo(cx + 8, cy + 22); g.lineTo(cx, cy + 18); g.lineTo(cx - 8, cy + 22); g.fill();
    }
  }
  if (tip === 'kare') { g.globalAlpha = 0.35; g.fillStyle = desen; for (let i = 0; i < 256; i += 32) { g.fillRect(i, 0, 12, 256); g.fillRect(0, i, 256, 12); } g.globalAlpha = 1; }
  return doku(c, tekrar);
}

export function ahsap({ renk = '#7a4a2a', koyu = '#5a3218', tahta = 6, tekrar = [3, 3], seed = 11 } = {}) {
  const r = tohumlu(seed); const [c, g] = tuval(512, 512); const h = 512 / tahta;
  for (let i = 0; i < tahta; i++) {
    const ton = new THREE.Color(renk).offsetHSL(0, (r() - 0.5) * 0.06, (r() - 0.5) * 0.07);
    g.fillStyle = '#' + ton.getHexString(); g.fillRect(0, i * h, 512, h);
    g.strokeStyle = koyu; g.globalAlpha = 0.28; g.lineWidth = 1.2;
    for (let k = 0; k < 7; k++) { const y0 = i * h + r() * h; const a = 2 + r() * 4, f = 0.01 + r() * 0.02; g.beginPath(); for (let x = 0; x <= 512; x += 8) g.lineTo(x, y0 + Math.sin(x * f + k) * a); g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = koyu; g.fillRect(0, i * h, 512, 3);
    const ek = r() * 512; g.fillRect(ek, i * h, 3, h); // tahta ek yeri
  }
  return doku(c, tekrar);
}

export function tugla({ renk = '#8a3b2a', harc = '#c9b8a6', tekrar = [3, 3], seed = 5 } = {}) {
  const r = tohumlu(seed); const [c, g] = tuval(256, 256); g.fillStyle = harc; g.fillRect(0, 0, 256, 256);
  for (let y = 0, s = 0; y < 256; y += 32, s++) for (let x = (s % 2) * -32; x < 256; x += 64) {
    g.fillStyle = '#' + new THREE.Color(renk).offsetHSL(0, 0, (r() - 0.5) * 0.12).getHexString(); g.fillRect(x + 3, y + 3, 58, 26);
  }
  return doku(c, tekrar);
}

export function tas({ renk = '#8d8a83', harc = '#5f5b55', tekrar = [2, 2], seed = 9 } = {}) {
  const r = tohumlu(seed); const [c, g] = tuval(512, 512); g.fillStyle = harc; g.fillRect(0, 0, 512, 512);
  for (let y = 0, s = 0; y < 512; y += 96, s++) for (let x = (s % 2) * -64; x < 512; x += 128) {
    g.fillStyle = '#' + new THREE.Color(renk).offsetHSL(0, 0, (r() - 0.5) * 0.14).getHexString(); g.fillRect(x + 4, y + 4, 120, 88);
    g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(x + 4, y + 4, 120, 6);
  }
  return doku(c, tekrar);
}

export function haliDokusu({ renkler = ['#7a2a2a', '#c9a24a', '#2a3a6a', '#7a2a2a', '#e8d9b0'] } = {}) {
  const [c, g] = tuval(512, 512);
  renkler.forEach((rk, i) => { g.fillStyle = rk; g.beginPath(); g.arc(256, 256, 256 - i * 46, 0, Math.PI * 2); g.fill(); });
  g.strokeStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 24; i++) { g.beginPath(); g.arc(256, 256, 30 + i * 9.5, 0, Math.PI * 2); g.stroke(); }
  const t = doku(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}

// Pencereden görünen manzara: 'gece' (ay, yıldız, ışıklı şehir) ya da 'gun' (gök, bulut, uzak bina)
export function manzara({ tip = 'gece', seed = 4 } = {}) {
  const r = tohumlu(seed); const [c, g] = tuval(512, 512);
  const gr = g.createLinearGradient(0, 0, 0, 512);
  if (tip === 'gece') { gr.addColorStop(0, '#0a1230'); gr.addColorStop(1, '#2a3f7a'); } else { gr.addColorStop(0, '#4f8fe0'); gr.addColorStop(1, '#bfe0ff'); }
  g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  if (tip === 'gece') {
    g.fillStyle = '#fff'; for (let i = 0; i < 60; i++) { g.globalAlpha = 0.4 + r() * 0.6; g.fillRect(r() * 512, r() * 300, 2, 2); } g.globalAlpha = 1;
    const ay = g.createRadialGradient(380, 110, 10, 380, 110, 90); ay.addColorStop(0, 'rgba(255,250,230,1)'); ay.addColorStop(0.35, 'rgba(255,250,230,0.9)'); ay.addColorStop(0.4, 'rgba(200,220,255,0.25)'); ay.addColorStop(1, 'rgba(200,220,255,0)');
    g.fillStyle = ay; g.fillRect(250, 0, 262, 240);
  } else {
    g.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 5; i++) { const x = r() * 512, y = 60 + r() * 160; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(x + k * 22, y + (k % 2) * 6, 30, 16, 0, 0, Math.PI * 2); g.fill(); } }
  }
  for (let i = 0; i < 9; i++) {
    const w = 40 + r() * 70, h = 120 + r() * 220, x = i * 58 - 20 + r() * 20;
    g.fillStyle = tip === 'gece' ? '#101a3c' : '#7c8fae'; g.fillRect(x, 512 - h, w, h);
    for (let yy = 512 - h + 10; yy < 500; yy += 16) for (let xx = x + 6; xx < x + w - 8; xx += 12) if (r() < (tip === 'gece' ? 0.4 : 0.15)) { g.fillStyle = tip === 'gece' ? '#ffd28a' : '#dfe9f5'; g.fillRect(xx, yy, 6, 8); }
  }
  const t = doku(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
}

// Pencere ızgarası gobosu: SpotLight.map ile yere pencere şeklinde ışık lekesi düşürür
export function pencereGobo({ bolme = [2, 2], cerceve = 0.08 } = {}) {
  const [c, g] = tuval(256, 256); g.fillStyle = '#000'; g.fillRect(0, 0, 256, 256);
  const pay = 256 * 0.18, w = 256 - pay * 2, f = 256 * cerceve * 0.5; g.fillStyle = '#fff';
  for (let i = 0; i < bolme[0]; i++) for (let k = 0; k < bolme[1]; k++) g.fillRect(pay + i * w / bolme[0] + f, pay + k * w / bolme[1] + f, w / bolme[0] - 2 * f, w / bolme[1] - 2 * f);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Basit tablo resmi (çerçeve içi): 'manzara' ya da 'portre'
export function tabloResmi({ tip = 'manzara', seed = 2 } = {}) {
  const r = tohumlu(seed); const [c, g] = tuval(256, 192);
  if (tip === 'portre') {
    g.fillStyle = '#3b2f2a'; g.fillRect(0, 0, 256, 192); g.fillStyle = '#d9b48f'; g.beginPath(); g.arc(128, 80, 38, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#5a2e2e'; g.fillRect(72, 122, 112, 70);
  } else {
    const gr = g.createLinearGradient(0, 0, 0, 192); gr.addColorStop(0, '#e9a66b'); gr.addColorStop(0.55, '#f6d8a8'); gr.addColorStop(0.56, '#5f7f4f'); gr.addColorStop(1, '#3d5a35');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 192); g.fillStyle = 'rgba(60,70,90,0.8)';
    g.beginPath(); g.moveTo(0, 110); for (let x = 0; x <= 256; x += 32) g.lineTo(x, 70 + r() * 40); g.lineTo(256, 110); g.fill();
  }
  return doku(c);
}
