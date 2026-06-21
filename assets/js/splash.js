/**
 * GZ Splash Screen & Animation Engine
 * Portfolio - Gaurav Zalavadiya
 */

(function () {
  "use strict";

  /* ============================================================
     1. GZ SPLASH SCREEN WITH PARTICLES CANVAS
     ============================================================ */

  const splash = document.getElementById('gz-splash');
  const canvas = document.getElementById('gz-canvas');

  // --- Particle canvas for splash ---
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resizeCanvas() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createParticle() {
      return {
        x: randomBetween(0, w),
        y: randomBetween(0, h),
        r: randomBetween(1, 3),
        dx: randomBetween(-0.5, 0.5),
        dy: randomBetween(-1.5, -0.4),
        opacity: randomBetween(0.3, 0.9),
        color: Math.random() > 0.5 ? '#ff2b2b' : '#ff8c00',
        life: 0,
        maxLife: randomBetween(80, 180),
      };
    }

    for (let i = 0; i < 80; i++) {
      const p = createParticle();
      p.life = randomBetween(0, p.maxLife);
      particles.push(p);
    }

    function drawCanvas() {
      ctx.clearRect(0, 0, w, h);

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,43,43,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p, idx) => {
        const alpha = p.opacity * (1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.dx;
        p.y += p.dy;
        p.life++;

        if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > w + 10) {
          particles[idx] = createParticle();
          particles[idx].y = h + 5;
        }
      });
    }

    let splashRAF;
    function animateSplash() {
      drawCanvas();
      splashRAF = requestAnimationFrame(animateSplash);
    }
    animateSplash();

    // --- Hide splash after 2.8s ---
    window.addEventListener('load', function () {
      setTimeout(function () {
        if (splash) {
          splash.classList.add('hidden');
          setTimeout(function () {
            splash.style.display = 'none';
            cancelAnimationFrame(splashRAF);
          }, 900);
        }
      }, 2800);
    });

    // Failsafe: hide after 5s regardless
    setTimeout(function () {
      if (splash && !splash.classList.contains('hidden')) {
        splash.classList.add('hidden');
        setTimeout(() => { splash.style.display = 'none'; cancelAnimationFrame(splashRAF); }, 900);
      }
    }, 5000);
  }

  /* ============================================================
     2. PAGE FLOATING PARTICLES (after splash)
     ============================================================ */

  function initPageParticles() {
    const container = document.getElementById('page-particles');
    if (!container) return;

    const colors = ['rgba(255,43,43,0.4)', 'rgba(255,140,0,0.3)', 'rgba(255,255,255,0.2)'];
    const count = 25;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'particle-dot';
      const size = Math.random() * 4 + 2;
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 8}s;
      `;
      container.appendChild(dot);
    }
  }

  setTimeout(initPageParticles, 3200);

  /* ============================================================
     3. CURSOR GLOW TRAIL
     ============================================================ */

  function initCursorGlow() {
    if (window.innerWidth < 768) return; // skip on mobile

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    const trails = [];
    for (let i = 0; i < 6; i++) {
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      t.style.opacity = (1 - i * 0.15).toString();
      t.style.width = (8 - i) + 'px';
      t.style.height = (8 - i) + 'px';
      document.body.appendChild(t);
      trails.push({ el: t, x: 0, y: 0 });
    }

    let mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      glow.style.left = mx + 'px';
      glow.style.top = my + 'px';
    });

    let trailPositions = Array(trails.length).fill({ x: 0, y: 0 });
    function animTrail() {
      for (let i = trails.length - 1; i > 0; i--) {
        trailPositions[i] = { ...trailPositions[i - 1] };
      }
      trailPositions[0] = { x: mx, y: my };

      trails.forEach((t, i) => {
        t.el.style.left = trailPositions[i].x + 'px';
        t.el.style.top = trailPositions[i].y + 'px';
      });
      requestAnimationFrame(animTrail);
    }
    animTrail();
  }

  setTimeout(initCursorGlow, 3400);

  /* ============================================================
     4. SECTION REVEAL WITH GLOW FLASH
     ============================================================ */

  function initSectionReveal() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'sectionEnter 0.8s cubic-bezier(0.22,1,0.36,1) both';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('section').forEach(s => observer.observe(s));
  }

  setTimeout(initSectionReveal, 3200);

  /* ============================================================
     5. STAT COUNTER - Glow pulse when visible
     ============================================================ */

  function initStatsGlow() {
    const statItems = document.querySelectorAll('.stats-item');
    if (!statItems.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'sectionEnter 0.6s ease both';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statItems.forEach((item, i) => {
      item.style.animationDelay = (i * 0.1) + 's';
      obs.observe(item);
    });
  }

  setTimeout(initStatsGlow, 3200);

  /* ============================================================
     6. TYPING CURSOR ENHANCED GLOW
     ============================================================ */

  function enhanceTypedCursor() {
    const cursor = document.querySelector('.typed-cursor');
    if (cursor) {
      cursor.style.cssText += 'color: #ff2b2b; text-shadow: 0 0 12px rgba(255,43,43,0.9);';
    }
  }
  setTimeout(enhanceTypedCursor, 3500);

  /* ============================================================
     7. PROGRESS BARS - Animated fill on scroll
     ============================================================ */

  function initProgressBarsAnim() {
    const bars = document.querySelectorAll('.progress-bar');
    if (!bars.length || !('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = parseInt(bar.getAttribute('aria-valuenow') || 0);
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(0.22,1,0.36,1)';
            bar.style.width = target + '%';
          }, 200);
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(b => obs.observe(b));
  }

  setTimeout(initProgressBarsAnim, 3200);

})();
