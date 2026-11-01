const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/splash.js'), 'utf8');

function createIntro({ seen = false, type = 'navigate', ready = 'complete', reduced = false, storageBlocked = false } = {}) {
  let now = 0, nextId = 1;
  const timers = new Map(), frames = new Map();
  const documentListeners = new Map(), windowListeners = new Map();
  const add = (map, name, fn) => { if (!map.has(name)) map.set(name, new Set()); map.get(name).add(fn); };
  const remove = (map, name, fn) => map.get(name)?.delete(fn);
  let document;
  function node() {
    const attributes = {}, listeners = new Map(), classes = new Set();
    return {
      tagName: 'DIV', inert: false, style: {}, children: [], attributes, listeners,
      classList: {
        add: (...names) => names.forEach(n => classes.add(n)),
        remove: (...names) => names.forEach(n => classes.delete(n)),
        contains: name => classes.has(name),
        toggle(name, on) { if (on === undefined) on = !classes.has(name); on ? classes.add(name) : classes.delete(name); }
      },
      setAttribute(name, value) { attributes[name] = value; },
      getAttribute(name) { return attributes[name]; },
      addEventListener(name, fn) { add(listeners, name, fn); },
      focus() { document.activeElement = this; },
      contains(element) { return this === element || Object.values(this.parts || {}).includes(element); },
      remove() { document.body.children = document.body.children.filter(c => c !== this); },
      set innerHTML(value) {
        this.parts = Object.fromEntries(['.zs-fill', '.zs-track', '.zs-percent', '#zs-status', '.zs-skip'].map(k => [k, node()]));
        this.steps = Array.from({ length: 4 }, node);
        this.markup = value;
      },
      querySelector(selector) { return this.parts?.[selector]; },
      querySelectorAll() { return this.steps || []; }
    };
  }
  const background = node(), alreadyInert = node(), brand = node();
  alreadyInert.inert = true;
  const body = node();
  body.children = [background, alreadyInert];
  body.prepend = element => body.children.unshift(element);
  document = {
    body, readyState: ready, activeElement: body, hidden: false,
    createElement: node,
    getElementById: id => body.children.find(c => c.id === id),
    querySelector: selector => selector === '#header .logo' ? brand : null,
    addEventListener: (name, fn) => add(documentListeners, name, fn),
    removeEventListener: (name, fn) => remove(documentListeners, name, fn)
  };
  const storage = new Map(seen ? [['gz-intro-seen', 'v2']] : []);
  const context = {
    document, URLSearchParams,
    window: {
      location: { search: '' },
      matchMedia: () => ({ matches: reduced }),
      addEventListener: (name, fn) => add(windowListeners, name, fn),
      removeEventListener: (name, fn) => remove(windowListeners, name, fn)
    },
    performance: { now: () => now, getEntriesByType: () => [{ type }] },
    sessionStorage: {
      getItem(key) { if (storageBlocked) throw new Error('Storage unavailable'); return storage.get(key); },
      setItem(key, value) { storage.set(key, value); }
    },
    setTimeout(fn, delay) { const id = nextId++; timers.set(id, { at: now + delay, fn }); return id; },
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame(fn) { const id = nextId++; frames.set(id, fn); return id; },
    cancelAnimationFrame: id => frames.delete(id)
  };
  vm.runInNewContext(source, context);
  return {
    document, background, alreadyInert, brand,
    splash: () => document.getElementById('gz-splash'),
    emit(name, event = {}) { [...(documentListeners.get(name) || [])].forEach(fn => fn(event)); },
    advance(duration) {
      const end = now + duration;
      while (now < end) {
        now = Math.min(end, now + 20);
        [...timers].forEach(([id, timer]) => { if (timer.at <= now) { timers.delete(id); timer.fn(); } });
        const current = [...frames]; frames.clear(); current.forEach(([, fn]) => fn(now));
      }
    }
  };
}

{
  const intro = createIntro();
  assert.ok(intro.splash());
  assert.equal(intro.background.inert, true);
  intro.advance(1700);
  assert.equal(intro.splash().querySelector('.zs-track').getAttribute('aria-valuenow'), '100');
  assert.equal(intro.splash().querySelector('.zs-fill').style.transform, 'scaleX(1)');
  intro.advance(600);
  assert.equal(intro.splash(), undefined);
  assert.equal(intro.document.body.classList.contains('splash-open'), false);
  assert.equal(intro.background.inert, false);
  assert.equal(intro.alreadyInert.inert, true);
}
assert.equal(createIntro({ seen: true }).splash(), undefined, 'Internal navigation skips the intro');
assert.ok(createIntro({ seen: true, type: 'reload' }).splash(), 'Reload displays the intro again');
{
  const intro = createIntro({ ready: 'loading' });
  intro.emit('DOMContentLoaded');
  intro.advance(5200);
  assert.equal(intro.splash(), undefined, 'Timeout releases a page even if load never fires');
  assert.equal(intro.background.inert, false);
}
for (const key of ['Escape', 'Tab']) {
  const intro = createIntro(); let prevented = false;
  intro.emit('keydown', { key, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(intro.document.activeElement, intro.brand);
  intro.advance(350);
  assert.equal(intro.splash(), undefined);
}
{
  const intro = createIntro();
  [...intro.splash().querySelector('.zs-skip').listeners.get('click')][0]();
  intro.advance(350);
  assert.equal(intro.splash(), undefined, 'Skip closes the intro');
}
{
  const intro = createIntro({ reduced: true }); intro.advance(500);
  assert.equal(intro.splash(), undefined, 'Reduced motion uses a short introduction');
}
{
  const intro = createIntro({ storageBlocked: true }); intro.advance(2500);
  assert.equal(intro.splash(), undefined, 'Blocked storage does not trap the page');
}
console.log('PASS: splash progress, dismissal, inert restoration, navigation, reload, timeout, keyboard, skip, reduced motion, and storage fallback.');
