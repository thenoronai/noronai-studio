// Sahne kiti tutarlılık testleri: node --test tests/sahne_kiti.test.mjs
// (önce: cd whatif-studyo/sahne-kiti && npm install). Tarayıcı gerektirmez.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ISIK } from '../whatif-studyo/sahne-kiti/isik.js';
import { IFADELER } from '../whatif-studyo/sahne-kiti/karakter.js';

const formul = fs.readFileSync(new URL('../whatif-studyo/SHORTS-FORMULU.md', import.meta.url), 'utf8');

test('ışık hazırları SHORTS-FORMULU 6.4 ile aynı', () => {
  const belge = [...formul.matchAll(/`isik\.([a-z-]+)`/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(belge)].sort(), Object.keys(ISIK).sort());
});

test('yüz ifadeleri SHORTS-FORMULU 6.2 ile aynı', () => {
  const belge = [...formul.matchAll(/`yuz\.([a-z]+)`/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(belge)].sort(), [...IFADELER].sort());
});

test('hazır değerleri reçete aralığında', () => {
  for (const [ad, h] of Object.entries(ISIK)) {
    for (const k of ['gok', 'hemi', 'anahtar', 'dolgu', 'sis', 'pozlama', 'bloom', 'grade', 'karakterTon']) assert.ok(k in h, `${ad}.${k}`);
    assert.ok(h.pozlama >= 0.8 && h.pozlama <= 1.4, `${ad} pozlama`);
    assert.ok(h.bloom.guc > 0 && h.bloom.guc <= 1, `${ad} parlama gücü`);
    assert.ok(h.bloom.yaricap <= 0.3, `${ad}: geniş parlama kareyi sise boğar`);
    assert.ok(h.bloom.esik >= 0.8, `${ad}: düşük eşikte dağınık yüzeyler parlar`);
    const enAcik = (h.karakterParlaklik ?? 0.9) * Math.max(...h.karakterTon);
    assert.ok(enAcik <= 1.0, `${ad}: açık ten beyaza patlar (${enAcik.toFixed(2)})`);
    assert.ok(h.grade.vinyet >= 0.1 && h.grade.vinyet <= 0.5, `${ad} vinyet`);
  }
});
