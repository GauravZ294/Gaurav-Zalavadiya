/** One kangaroo crossing per home document; starts after the intro and in view. */
(() => {
  'use strict';
  const hero = document.querySelector('#hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let played = false;
  let inView = false;
  let artworkReady = false;
  let observer;
  let introObserver;
  function play() {
    if (played || !artworkReady || !inView || document.hidden || document.querySelector('#gz-splash')) return;
    played = true;
    observer?.disconnect();
    introObserver?.disconnect();
    document.removeEventListener('visibilitychange', play);
    const stage = document.createElement('div');
    stage.className = 'roo-stage';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = `<div class="roo-traveller"><div class="roo-hop"><img class="roo-art" src="assets/img/kangaroo-realistic.webp" alt="" width="640" height="416" decoding="async" draggable="false"></div></div>`;
    hero.append(stage);
    const remove = () => stage.remove();
    stage.querySelector('.roo-traveller').addEventListener('animationend', event => {
      if (event.animationName === 'roo-cross') remove();
    });
    // Also clean up when animations are disabled by a browser or stylesheet.
    setTimeout(remove, 2800);
  }
  // Decode the cutout before starting the 2.5-second appearance.
  const artwork = new Image();
  artwork.onload = () => { artworkReady = true; play(); };
  artwork.onerror = () => {
    observer?.disconnect();
    introObserver?.disconnect();
    document.removeEventListener('visibilitychange', play);
  };
  introObserver = new MutationObserver(play);
  introObserver.observe(document.body, { childList: true });
  document.addEventListener('visibilitychange', play);
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      play();
    }, { threshold: .15 });
    observer.observe(hero);
  } else { inView = true; play(); }
  artwork.src = 'assets/img/kangaroo-realistic.webp';
})();
