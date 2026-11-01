const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('assets/js/hero-visitor.js', 'utf8');
function setup({ reduced = false, splash = true, heroExists = true } = {}) {
  let intersection, mutation, timeout, stage, image, count = 0;
  const listeners = new Map();
  const hero = { append(el) { stage = el; count++; } };
  const document = {
    body: {}, hidden: false,
    querySelector(s) { return s === '#hero' ? (heroExists ? hero : null) : splash; },
    addEventListener(name, fn) { listeners.set(name, fn); },
    removeEventListener(name) { listeners.delete(name); },
    createElement() { return { setAttribute() {}, remove() { this.removed = true; }, querySelector() { return { addEventListener(name, fn) { stage.end = fn; } }; } }; }
  };
  class IntersectionObserver { constructor(fn) { intersection = fn; } observe() {} disconnect() {} }
  class MutationObserver { constructor(fn) { mutation = fn; } observe() {} disconnect() {} }
  class Image { constructor() { image = this; } }
  vm.runInNewContext(source, { document, window: { matchMedia: () => ({ matches: reduced }), IntersectionObserver }, IntersectionObserver, MutationObserver, Image, setTimeout(fn) { timeout = fn; } });
  return { document, imageReady() { image?.onload(); }, imageError() { image?.onerror(); }, view() { intersection?.([{ isIntersecting: true }]); }, dismiss() { splash = false; mutation?.(); }, get stage() { return stage; }, get count() { return count; }, timeout() { timeout?.(); }, visible() { listeners.get('visibilitychange')?.(); } };
}
const run = setup();
run.view();
assert.equal(run.count, 0, 'wait for splash to close');
run.dismiss();
assert.equal(run.count, 0, 'wait for image to load');
run.imageReady();
assert.equal(run.count, 1);
run.stage.end({ animationName: 'roo-bound' });
assert.equal(run.stage.removed, undefined, 'child hop ending must not remove crossing');
run.stage.end({ animationName: 'roo-cross' });
assert.equal(run.stage.removed, true);
run.view(); run.dismiss();
assert.equal(run.count, 1, 'must not repeat on scrolling or DOM changes');
const hidden = setup({ splash: false });
hidden.imageReady(); hidden.document.hidden = true; hidden.view(); assert.equal(hidden.count, 0);
hidden.document.hidden = false; hidden.visible(); assert.equal(hidden.count, 1);
hidden.timeout(); assert.equal(hidden.stage.removed, true);
const reduced = setup({ reduced: true }); reduced.view(); reduced.dismiss(); assert.equal(reduced.count, 0);
const inner = setup({ heroExists: false }); inner.view(); inner.dismiss(); assert.equal(inner.count, 0);
const failed = setup({ splash: false }); failed.view(); failed.imageError(); assert.equal(failed.count, 0);
assert.match(fs.readFileSync('assets/css/hero-visitor.css', 'utf8'), /roo-cross 2\.5s/);
console.log('PASS: visitor waits for splash and visibility, crosses once, cleans up, and respects reduced motion.');
