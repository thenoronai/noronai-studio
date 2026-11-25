// Son işlem zinciri: Render → (ortam perdeleme) → parlama → alan derinliği → ton eşleme ve sRGB → renk düzeltme.
// Renk düzeltme (lift / gamma / gain, doygunluk, sıcaklık, vinyet, gren) ekran uzayında çalışır;
// değerler ışık hazırından gelir (isik.js grade).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export const RenkDuzeltme = {
  uniforms: {
    tDiffuse: { value: null }, lift: { value: new THREE.Vector3() }, gamma: { value: new THREE.Vector3(1, 1, 1) },
    gain: { value: new THREE.Vector3(1, 1, 1) }, doygunluk: { value: 1 }, sicaklik: { value: 0 }, vinyet: { value: 0.2 },
    grain: { value: 0.01 }, zaman: { value: 0 }, oran: { value: 9 / 16 },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec3 lift; uniform vec3 gamma; uniform vec3 gain; uniform float doygunluk; uniform float sicaklik;
    uniform float vinyet; uniform float grain; uniform float zaman; uniform float oran; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec3 col = c.rgb;
      col = col*gain + lift*(1.0-col); col = pow(max(col, 0.0), 1.0/gamma);
      float l = dot(col, vec3(0.2126,0.7152,0.0722)); col = mix(vec3(l), col, doygunluk);
      col += vec3(sicaklik, sicaklik*0.25, -sicaklik)*0.5*l;
      vec2 d = vUv-0.5; d.x *= oran*1.78; float v = 1.0 - vinyet*smoothstep(0.25, 0.85, length(d)*1.3); col *= v;
      float n = fract(sin(dot(vUv*vec2(12.9898,78.233) + zaman, vec2(1.0,1.0)))*43758.5453); col += (n-0.5)*grain;
      gl_FragColor = vec4(clamp(col,0.0,1.0), c.a); }`,
};

// sonIslem(renderer, sahne, kamera, {genislik, yukseklik, dof:{odak, aciklik, maks}, ao})
export function sonIslem(renderer, sahne, kamera, { genislik, yukseklik, dof = null, ao = false } = {}) {
  const h = sahne.userData.hazir;
  const comp = new EffectComposer(renderer); comp.setSize(genislik, yukseklik);
  comp.addPass(new RenderPass(sahne, kamera));
  if (ao) { const g = new GTAOPass(sahne, kamera, genislik, yukseklik); g.blendIntensity = 0.8; comp.addPass(g); }
  const bloom = new UnrealBloomPass(new THREE.Vector2(genislik, yukseklik), h.bloom.guc, h.bloom.yaricap, h.bloom.esik); comp.addPass(bloom);
  // Parlama girdisini kırp: duvara çok yakın pratik ışıkların HDR sıcak noktaları (değer 20-50) tüm kareyi
  // sise boğmasın. Renk tonu korunur; yalnız parlamaya giden kopya kırpılır, ana görüntü değişmez.
  const hp = bloom.materialHighPassFilter;
  hp.fragmentShader = hp.fragmentShader.replace('vec4 texel = texture2D( tDiffuse, vUv );',
    `vec4 texel = texture2D( tDiffuse, vUv ); float enCok = max(max(texel.r, texel.g), texel.b); texel.rgb *= min(1.0, ${(h.bloom.tavan ?? 2.5).toFixed(2)} / max(enCok, 1e-4));`);
  hp.needsUpdate = true; bloom.highPassUniforms.smoothWidth.value = h.bloom.yumusak ?? 0.35;
  let bokeh = null;
  if (dof) { bokeh = new BokehPass(sahne, kamera, { focus: dof.odak, aperture: dof.aciklik ?? 0.0025, maxblur: dof.maks ?? 0.008 }); comp.addPass(bokeh); }
  comp.addPass(new OutputPass());
  const rd = new ShaderPass(RenkDuzeltme); const u = rd.uniforms, gr = h.grade;
  u.lift.value.set(...gr.lift); u.gamma.value.set(...gr.gamma); u.gain.value.set(...gr.gain);
  u.doygunluk.value = gr.doygunluk; u.sicaklik.value = gr.sicaklik; u.vinyet.value = gr.vinyet; u.grain.value = gr.grain; u.oran.value = genislik / yukseklik;
  comp.addPass(rd);
  return { comp, bloom, bokeh, renkDuzeltme: rd };
}
