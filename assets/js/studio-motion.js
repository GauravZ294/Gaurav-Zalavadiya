/** Progressive enhancement: content remains visible if motion is unavailable. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const backdrop = document.createElement('div');
  backdrop.className = 'ambient-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = '<span class="ambient-orbit ambient-orbit-one"></span><span class="ambient-orbit ambient-orbit-two"></span><span class="ambient-orbit ambient-orbit-three"></span><span class="ambient-grid"></span>';
  document.body.prepend(backdrop);
  const motionToggle = document.createElement('button');
  motionToggle.type = 'button';
  motionToggle.className = 'motion-toggle';
  let effectsPaused = reduceMotion.matches;
  let stopCursor = () => {};
  function applyMotionPreference() {
    document.body.classList.toggle('effects-paused', effectsPaused);
    if (effectsPaused) stopCursor();
    motionToggle.textContent = effectsPaused ? 'Resume animation' : 'Pause animation';
    motionToggle.setAttribute('aria-pressed', String(effectsPaused));
    motionToggle.disabled = reduceMotion.matches;
    motionToggle.title = reduceMotion.matches ? 'Animation disabled by your reduced-motion preference' : 'Control background and decorative animation';
  }
  motionToggle.addEventListener('click', () => {
    effectsPaused = !effectsPaused;
    applyMotionPreference();
  });
  reduceMotion.addEventListener('change', event => {
    effectsPaused = event.matches;
    applyMotionPreference();
  });
  applyMotionPreference();
  document.body.appendChild(motionToggle);

  // A lightweight, mouse-only code cursor. It never replaces the native cursor.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pointer = document.createElement('div');
  pointer.className = 'portfolio-pointer';
  pointer.setAttribute('aria-hidden', 'true');
  pointer.innerHTML = '<span class="pointer-center"></span><span class="pointer-label">&lt;/&gt;</span>';
  if (finePointer.matches && !reduceMotion.matches) document.body.appendChild(pointer);
  const pointerLabel = pointer.querySelector('.pointer-label');
  let pointerFrame = 0;
  let targetX = 0, targetY = 0, cursorX = 0, cursorY = 0;
  let pointerVisible = false;
  function hidePointer() {
    pointerVisible = false;
    pointer.classList.remove('is-visible', 'is-action', 'is-down');
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
  }
  stopCursor = hidePointer;
  function drawPointer() {
    if (!pointerVisible || effectsPaused || document.hidden) { hidePointer(); return; }
    cursorX += (targetX - cursorX) * 0.24;
    cursorY += (targetY - cursorY) * 0.24;
    pointer.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    if (Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY) > 0.15) {
      pointerFrame = requestAnimationFrame(drawPointer);
    } else pointerFrame = 0;
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || reduceMotion.matches || effectsPaused) {
      hidePointer(); return;
    }
    if (!pointer.isConnected) document.body.appendChild(pointer);
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) {
      hidePointer(); return;
    }
    targetX = event.clientX; targetY = event.clientY;
    if (!pointerVisible) { cursorX = targetX; cursorY = targetY; }
    pointerVisible = true;
    const action = event.target.closest('a, button, [role="tab"], .portfolio-filters li');
    pointer.classList.add('is-visible');
    pointer.classList.toggle('is-action', Boolean(action));
    pointerLabel.textContent = action ? (action.matches('a') ? 'OPEN' : 'GO') : '</>';
    if (!pointerFrame) pointerFrame = requestAnimationFrame(drawPointer);
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && pointerVisible) pointer.classList.add('is-down');
  }, { passive: true });
  document.addEventListener('pointerup', () => pointer.classList.remove('is-down'), { passive: true });
  document.documentElement.addEventListener('pointerleave', hidePointer);
  window.addEventListener('blur', hidePointer);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hidePointer(); });
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hidePointer(); });
  finePointer.addEventListener('change', () => { if (!finePointer.matches) hidePointer(); });
  const header = document.getElementById('header');
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let queued = false;
  function updateScroll() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
    header?.classList.toggle('scrolled', window.scrollY > 20);
    queued = false;
  }
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      if (!queued) { queued = true; requestAnimationFrame(updateScroll); }
    }).observe(document.body);
  }
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('page-idle', document.hidden);
  });
  updateScroll();

  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-title, .portfolio-content, .resume-item, .service-item, .profession-focus-item, .about .content, .about-portrait');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('studio-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 25px 0px' });
    targets.forEach((element, index) => {
      element.classList.add('studio-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 3 * 75, 150)}ms`);
      observer.observe(element);
    });
    document.body.classList.add('motion-ready');
    reduceMotion.addEventListener('change', event => {
      if (event.matches) {
        document.body.classList.remove('motion-ready');
        observer.disconnect();
      }
    });
  }

  const ribbon = document.querySelector('.expertise-ribbon');
  if (ribbon && !reduceMotion.matches && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      ribbon.classList.toggle('ribbon-visible', entries[0].isIntersecting);
    }).observe(ribbon);
  }

  const workflowTabs = [...document.querySelectorAll('.workflow-tabs [role="tab"]')];
  function selectWorkflow(index, focusTab = false) {
    workflowTabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focusTab) workflowTabs[index].focus();
  }
  workflowTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectWorkflow(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % workflowTabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + workflowTabs.length - 1) % workflowTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = workflowTabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectWorkflow(next, true); }
    });
  });

  // Hide the mobile menu after a visitor chooses a destination or presses Escape.
  function closeMenu(restoreFocus = false) {
    const wasOpen = header?.classList.contains('header-show');
    header?.classList.remove('header-show');
    document.body.classList.remove('mobile-nav-open');
    const toggle = document.querySelector('.header-toggle');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.classList.remove('bi-x');
    toggle?.classList.add('bi-list');
    if (restoreFocus === true && wasOpen) toggle?.focus({ preventScroll: true });
  }
  document.querySelectorAll('#navmenu a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.addEventListener('click', event => {
    if (header?.classList.contains('header-show') && !header.contains(event.target)) closeMenu();
  });
  window.matchMedia('(max-width: 991px)').addEventListener('change', event => {
    if (!event.matches) closeMenu();
  });
})();
