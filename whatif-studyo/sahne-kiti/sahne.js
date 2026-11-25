// Sahne kurulumu: 9:16 render ayarları, ortam yansıması, gölge türü, kamera ve kamera hareketleri.
// Kurgu kuralları SHORTS-FORMULU.md 4: kamera hiç durmaz (bekleme itmesi), geçişler hızlı ve "ease-out".
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function sahneKur({ genislik = 1080, yukseklik = 1920, tuval = null } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas: tuval || undefined, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1); renderer.setSize(genislik, yukseklik, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;      // çizgi film renklerini doygun tutar
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; // yumuşak gölge (shadow.radius)
  const sahne = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  sahne.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; sahne.environmentIntensity = 0.3;
  const kamera = new THREE.PerspectiveCamera(58, genislik / yukseklik, 0.05, 200); // dikey 58° ≈ 35 mm eşdeğeri
  return { renderer, sahne, kamera, genislik, yukseklik };
}

export const yumusat = {
  disari: (t) => 1 - Math.pow(1 - t, 3),                  // ease-out (patlayıp sönen hareket)
  disariSert: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  icDis: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

// Kamera durumu: konum + bakılan nokta + yatıklık (derece) + FOV
export function kameraAyarla(kamera, { konum, hedef, yatik = 0, fov = null }) {
  kamera.position.set(...konum); kamera.lookAt(new THREE.Vector3(...hedef));
  if (yatik) kamera.rotateZ(THREE.MathUtils.degToRad(yatik));
  if (fov) { kamera.fov = fov; kamera.updateProjectionMatrix(); }
}

// Bekleme itmesi: kare başına %0,15–0,35 yaklaşma (SHORTS-FORMULU 4) → t saniyede konum
export function itme(a, hedef, t, { hizKare = 0.0025, fps = 30 } = {}) {
  const k = 1 - Math.pow(1 - hizKare, t * fps); const A = new THREE.Vector3(...a), H = new THREE.Vector3(...hedef);
  return A.lerp(H, k).toArray();
}

// İki kamera durumu arasında hızlı geçiş (uçuş, hızlı çevirme): 0–1 arası u, ease-out
export function gecis(d1, d2, u, ease = yumusat.disariSert) {
  const e = ease(Math.min(1, Math.max(0, u)));
  const k = new THREE.Vector3(...d1.konum).lerp(new THREE.Vector3(...d2.konum), e).toArray();
  const h = new THREE.Vector3(...d1.hedef).lerp(new THREE.Vector3(...d2.hedef), e).toArray();
  return { konum: k, hedef: h, yatik: (d1.yatik || 0) * (1 - e) + (d2.yatik || 0) * e };
}
