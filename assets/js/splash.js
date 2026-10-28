/** Automatic portfolio loading splash; inner-page effects remain unchanged. */
(function () {
  "use strict";
  const splash = document.getElementById('gz-splash');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (splash) {
    const started = performance.now();
    const minimumDuration = reducedMotion ? 250 : 1800;
    let closed = false;
    let finishTimer;
    let safetyTimer;
    splash.hidden = false;
    document.body.classList.add('splash-open');
    function closeSplash() {
      if (closed) return;
      closed = true;
      clearTimeout(finishTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener('load', onLoaded);
      document.removeEventListener('keydown', onKeydown);
      document.body.classList.remove('splash-open');
      splash.classList.add('is-leaving');
      setTimeout(() => { splash.hidden = true; }, reducedMotion ? 0 : 350);
    }
    function onLoaded() {
      finishTimer = setTimeout(closeSplash, Math.max(0, minimumDuration - (performance.now() - started)));
    }
    function onKeydown(event) {
      if (event.key === 'Escape' || event.key === 'Tab') closeSplash();
    }
    document.addEventListener('keydown', onKeydown);
    safetyTimer = setTimeout(closeSplash, 5000);
    if (document.readyState === 'complete') onLoaded();
    else window.addEventListener('load', onLoaded, { once: true });
  }

})();
