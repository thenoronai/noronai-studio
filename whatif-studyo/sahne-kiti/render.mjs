// Başsız (headless) render: örnek çekimleri PNG olarak cikti/ klasörüne yazar.
// Kullanım:  node render.mjs [çekimler=A,B,C,D] [genişlik=1080] [yükseklik=1920] [t=0] [bayraklar]
// Örnek:     node render.mjs A,D 1080 1920          ·   node render.mjs K 1600 900
//            node render.mjs A 540 960 0 post=0     (son işlemsiz teşhis karesi)
// Chrome yolu: CHROME_YOLU ortam değişkeni ya da bilinen kurulum yolları. GPU yoksa yazılım WebGL'e
// (SwiftShader) düşer; zorlamak için SAHNE_KITI_YAZILIM=1.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const kok = path.dirname(fileURLToPath(import.meta.url));
const [cekimler = 'A,B,C,D', w = '1080', h = '1920', t = '0', ek = ''] = process.argv.slice(2);
const TUR = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.hdr': 'application/octet-stream', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json' };
const sunucu = http.createServer((istek, yanit) => {
  const yol = path.normalize(path.join(kok, decodeURIComponent(new URL(istek.url, 'http://x').pathname)));
  if (!yol.startsWith(kok + path.sep) || !fs.existsSync(yol) || fs.statSync(yol).isDirectory()) { yanit.writeHead(404); return yanit.end(); }
  yanit.writeHead(200, { 'Content-Type': TUR[path.extname(yol)] || 'application/octet-stream' }); fs.createReadStream(yol).pipe(yanit);
});
await new Promise((ok) => sunucu.listen(0, '127.0.0.1', ok));
const port = sunucu.address().port;

const adaylar = [process.env.CHROME_YOLU, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'].filter(Boolean);
const chrome = adaylar.find((p) => fs.existsSync(p));
if (!chrome) { console.error('Chrome bulunamadı; CHROME_YOLU ortam değişkenini ayarlayın.'); process.exit(2); }
const args = ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'];
if (process.env.SAHNE_KITI_YAZILIM === '1') args.push('--use-angle=swiftshader');
if (typeof process.getuid === 'function' && process.getuid() === 0) args.push('--no-sandbox'); // yalnız root kapsayıcılarda

const cikti = path.join(kok, 'cikti'); fs.mkdirSync(cikti, { recursive: true });
const tarayici = await puppeteer.launch({ executablePath: chrome, headless: true, args });
let hata = 0;
try {
  for (const c of cekimler.split(',')) {
    const sayfa = await tarayici.newPage(); await sayfa.setViewport({ width: +w, height: +h });
    sayfa.on('console', (m) => { const s = m.text(); if (/HATA|Error/.test(s)) console.log('  sayfa:', s); });
    const t0 = Date.now();
    await sayfa.goto(`http://127.0.0.1:${port}/ornek.html?cekim=${c}&w=${w}&h=${h}&t=${t}${ek ? '&' + ek : ''}`);
    await sayfa.waitForFunction('window.__done === true', { timeout: 300000 });
    const err = await sayfa.evaluate('window.__err');
    if (err) { console.log(`${c}: HATA ${err}`); hata++; await sayfa.close(); continue; }
    const dosya = path.join(cikti, `cekim_${c}${ek ? '_' + ek.replace(/[=&]/g, '') : ''}.png`);
    await sayfa.screenshot({ path: dosya });
    console.log(`${c}: ${path.relative(kok, dosya)} · ${((Date.now() - t0) / 1000).toFixed(1)} sn`);
    await sayfa.close();
  }
} finally { await tarayici.close(); sunucu.close(); }
process.exit(hata ? 1 : 0);
