/** Branded vector intro: first visit and reload, skipped on internal navigation. */
(() => {
  'use strict';
  if (document.getElementById('gz-splash')) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preview = new URLSearchParams(window.location.search).get('splash') === 'preview';
  const navigation = performance.getEntriesByType('navigation')[0];
  try {
    if (sessionStorage.getItem('gz-intro-seen') === 'v2' && navigation?.type !== 'reload' && !preview) return;
    sessionStorage.setItem('gz-intro-seen', 'v2');
  } catch { /* The intro still works when browser storage is unavailable. */ }
  const splash = document.createElement('div');
  splash.id = 'gz-splash';
  splash.setAttribute('role', 'dialog');
  splash.setAttribute('aria-modal', 'true');
  splash.setAttribute('aria-labelledby', 'zs-name');
  splash.setAttribute('aria-describedby', 'zs-status');
  splash.innerHTML = "<div class=\"zs-top\"><span class=\"zs-brand\">GZ <span>/ PORTFOLIO</span></span><button type=\"button\" class=\"zs-skip\">Skip intro <span aria-hidden=\"true\">↗</span></button></div>\n<div class=\"zs-content\"><svg class=\"zs-art\" viewBox=\"0 0 600 340\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><defs><radialGradient id=\"zs-halo\"><stop stop-color=\"#377ed5\" stop-opacity=\".24\"/><stop offset=\"1\" stop-color=\"#377ed5\" stop-opacity=\"0\"/></radialGradient><linearGradient id=\"zs-blue\" x1=\"190\" y1=\"60\" x2=\"410\" y2=\"270\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#8edbff\"/><stop offset=\"1\" stop-color=\"#4c80e5\"/></linearGradient></defs><ellipse cx=\"300\" cy=\"170\" rx=\"215\" ry=\"155\" fill=\"url(#zs-halo)\"/><g class=\"zs-signals\"><circle class=\"zs-wave zs-wave-one\" cx=\"300\" cy=\"170\" r=\"100\" stroke=\"#6eb8ff\" stroke-opacity=\".2\"/><circle class=\"zs-wave zs-wave-two\" cx=\"300\" cy=\"170\" r=\"100\" stroke=\"#6eb8ff\" stroke-opacity=\".2\"/></g><g class=\"zs-orbit\"><circle cx=\"300\" cy=\"170\" r=\"128\" stroke=\"#599eea\" stroke-opacity=\".3\" stroke-dasharray=\"3 12\"/><circle cx=\"300\" cy=\"42\" r=\"4\" fill=\"#81d5f1\"/><circle cx=\"428\" cy=\"170\" r=\"3\" fill=\"#67a9fc\"/></g><ellipse cx=\"300\" cy=\"170\" rx=\"185\" ry=\"67\" transform=\"rotate(-22 300 170)\" stroke=\"#668bc0\" stroke-opacity=\".3\"/><circle cx=\"300\" cy=\"170\" r=\"83\" stroke=\"url(#zs-blue)\" stroke-width=\"1.3\"/><ellipse cx=\"300\" cy=\"170\" rx=\"83\" ry=\"30\" stroke=\"#5f9bdd\" stroke-opacity=\".35\"/><ellipse cx=\"300\" cy=\"170\" rx=\"35\" ry=\"83\" stroke=\"#5f9bdd\" stroke-opacity=\".35\"/><path d=\"M217 170H383M300 87V253\" stroke=\"#5f9bdd\" stroke-opacity=\".25\"/><g transform=\"translate(268 138)\"><rect width=\"64\" height=\"64\" rx=\"17\" fill=\"#0c1729\" stroke=\"#5485bf\"/><path d=\"M28 21H20L13 28v12l7 6h10V33H22\" stroke=\"#85ceff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M37 21h15L36 46h16\" stroke=\"#e4f4ff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><path class=\"zs-dash\" d=\"M98 170H211M389 170H502M300 257V293\" stroke=\"#6ab8fa\" stroke-opacity=\".45\" stroke-dasharray=\"5 8\"/><g transform=\"translate(65 130)\"><g class=\"zs-float\"><rect width=\"70\" height=\"70\" rx=\"19\" fill=\"#11233b\" stroke=\"#3f689b\"/><path d=\"m26 23-12 12 12 12m18-24 12 12-12 12m-5-30-8 36\" stroke=\"#87c7ff\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></g><g transform=\"translate(466 130)\"><g class=\"zs-float zs-float-late\"><rect width=\"70\" height=\"70\" rx=\"19\" fill=\"#112a36\" stroke=\"#356d7b\"/><path d=\"M35 16 19 23v12c0 11 16 20 16 20s16-9 16-20V23l-16-7Z\" stroke=\"#7ad9d7\" stroke-width=\"2\"/><path d=\"m27 34 6 6 12-13\" stroke=\"#7ad9d7\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></g><g transform=\"translate(274 267)\"><rect width=\"52\" height=\"42\" rx=\"12\" fill=\"#152037\" stroke=\"#496598\"/><path d=\"M17 12h18v18H17zM12 16h5m-5 10h5m18-10h5m-5 10h5M22 7v5m8-5v5m-8 18v5m8-5v5\" stroke=\"#9fbcff\" stroke-width=\"1.5\"/><path d=\"m22 21 3 3 6-7\" stroke=\"#9fbcff\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></g><path class=\"zs-speed\" d=\"M20 87h43m-29 10h38M535 245h44m-26 10h36\" stroke=\"#5f8fc5\" stroke-opacity=\".35\" stroke-linecap=\"round\"/></svg>\n<p class=\"zs-eyebrow\">AI DEVELOPMENT <span>/</span> QUALITY ENGINEERING</p><h1 id=\"zs-name\">Gaurav <span>Zalavadiya</span></h1><p class=\"zs-tagline\">Intelligent ideas. Reliable experiences.</p><div class=\"zs-loading\"><div class=\"zs-loading-label\"><span id=\"zs-status\" role=\"status\" aria-live=\"polite\">Bringing ideas online</span><span class=\"zs-percent\" aria-hidden=\"true\">00%</span></div><div class=\"zs-track\" role=\"progressbar\" aria-label=\"Introduction progress\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\"><span class=\"zs-fill\"></span></div><div class=\"zs-steps\" aria-hidden=\"true\"><span>IDEA</span><span>CODE</span><span>QUALITY</span><span>READY</span></div></div></div><span class=\"zs-bottom\">A LITTLE CODE. A LOT OF CARE.</span>";
  document.body.prepend(splash);
  document.body.classList.add('splash-open');
  const fill = splash.querySelector('.zs-fill');
  const track = splash.querySelector('.zs-track');
  const percent = splash.querySelector('.zs-percent');
  const status = splash.querySelector('#zs-status');
  const skip = splash.querySelector('.zs-skip');
  const steps = [...splash.querySelectorAll('.zs-steps span')];
  const siblings = new Map();
  let closed = false, finishing = false, frame = 0, completionTimer = 0;
  let pageReady = document.readyState === 'complete';
  let lastPercent = -1, lastStage = -1;
  const started = performance.now();
  const duration = reducedMotion ? 250 : 1650;
  const messages = ['Bringing ideas online', 'Connecting code & intelligence', 'Preparing the experience', 'Ready to explore'];
  function blockBackground() {
    if (closed) return;
    [...document.body.children].forEach(element => {
      if (element === splash || element.tagName === 'SCRIPT' || siblings.has(element)) return;
      siblings.set(element, element.inert);
      element.inert = true;
    });
  }
  function update(value) {
    const rounded = Math.max(0, Math.min(100, Math.floor(value)));
    if (rounded === lastPercent) return;
    lastPercent = rounded;
    fill.style.transform = 'scaleX(' + rounded / 100 + ')';
    track.setAttribute('aria-valuenow', String(rounded));
    percent.textContent = String(rounded).padStart(2, '0') + '%';
    const stage = rounded === 100 ? 3 : Math.min(2, Math.floor(rounded / 34));
    if (stage !== lastStage) {
      lastStage = stage;
      status.textContent = messages[stage];
      steps.forEach((element, index) => element.classList.toggle('is-ready', index <= stage));
    }
  }
  function close(userInitiated = false) {
    if (closed) return;
    closed = true;
    clearTimeout(safetyTimer);
    clearTimeout(completionTimer);
    cancelAnimationFrame(frame);
    window.removeEventListener('load', onLoad);
    document.removeEventListener('DOMContentLoaded', blockBackground);
    document.removeEventListener('keydown', onKeydown, true);
    document.removeEventListener('visibilitychange', onVisibility);
    siblings.forEach((previous, element) => { element.inert = previous; });
    document.body.classList.remove('splash-open');
    splash.classList.add('is-leaving');
    if (userInitiated && splash.contains(document.activeElement)) {
      document.querySelector('#header .logo')?.focus({ preventScroll: true });
    }
    setTimeout(() => splash.remove(), reducedMotion ? 0 : 300);
  }
  function complete() {
    if (finishing || closed) return;
    finishing = true;
    cancelAnimationFrame(frame);
    update(100);
    completionTimer = setTimeout(() => close(), reducedMotion ? 0 : 230);
  }
  function tick(now) {
    if (closed || finishing) return;
    const elapsed = now - started;
    update(pageReady ? Math.min(100, elapsed / duration * 100) : Math.min(88, elapsed / duration * 88));
    if (pageReady && elapsed >= duration) { complete(); return; }
    frame = requestAnimationFrame(tick);
  }
  function onLoad() { pageReady = true; }
  function onKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      close(true);
    }
  }
  function onVisibility() { if (document.hidden) close(); }
  const safetyTimer = setTimeout(complete, 4500);
  skip.addEventListener('click', () => close(true));
  document.addEventListener('keydown', onKeydown, true);
  document.addEventListener('visibilitychange', onVisibility);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', blockBackground, { once: true });
  else blockBackground();
  window.addEventListener('load', onLoad, { once: true });
  skip.focus({ preventScroll: true });
  update(0);
  frame = requestAnimationFrame(tick);
})();
