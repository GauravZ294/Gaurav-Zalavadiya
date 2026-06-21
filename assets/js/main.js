/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
    document.body.classList.toggle('mobile-nav-open');
  }
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
  }

  /**
   * Desktop sidebar collapse
   */
  const desktopSidebarToggleBtn = document.querySelector('.desktop-sidebar-toggle');

  function setDesktopSidebarState(collapsed) {
    document.body.classList.toggle('sidebar-collapsed', collapsed);

    if (!desktopSidebarToggleBtn) return;

    const icon = desktopSidebarToggleBtn.querySelector('i');
    desktopSidebarToggleBtn.setAttribute('aria-expanded', String(!collapsed));
    desktopSidebarToggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');

    if (icon) {
      icon.className = collapsed ? 'bi bi-chevron-right' : 'bi bi-list';
    }
  }

  if (desktopSidebarToggleBtn) {
    const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    setDesktopSidebarState(sidebarCollapsed);

    desktopSidebarToggleBtn.addEventListener('click', () => {
      const collapsed = !document.body.classList.contains('sidebar-collapsed');
      setDesktopSidebarState(collapsed);
      localStorage.setItem('sidebar-collapsed', String(collapsed));
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Smooth scroll with consistent offset
   */
  const getScrollTargetPosition = (hash) => {
    const section = document.querySelector(hash);
    if (!section) return null;
    const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop || 0, 10);
    return section.offsetTop - scrollMarginTop;
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const targetTop = getScrollTargetPosition(hash);
      if (targetTop === null) return;
      e.preventDefault();
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader - handled by GZ splash (see splash.js)
   */

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Theme toggle (dark/light)
   */
  const themeToggleBtn = document.querySelector('#theme-toggle');

  function applyTheme(theme) {
    const mode = theme === 'dark' ? 'dark' : 'light';
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${mode}`);
    document.body.setAttribute('data-theme', mode);

    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector('i');
      const label = themeToggleBtn.querySelector('span');
      if (mode === 'dark') {
        if (icon) icon.className = 'bi bi-sun';
        if (label) label.textContent = 'Light Mode';
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        if (icon) icon.className = 'bi bi-moon-stars';
        if (label) label.textContent = 'Dark Mode';
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  const storedTheme = localStorage.getItem('preferred-theme');
  applyTheme(storedTheme || 'light');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('preferred-theme', nextTheme);
    });
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Reveal animations with staggered delays
   */
  function initRevealOnScroll() {
    const revealTargets = document.querySelectorAll([
      '.section-title',
      '.stats .stats-item',
      '.resume .resume-item',
      '.services .service-item',
      '.contact .info-item',
      '.portfolio .portfolio-item'
    ].join(','));

    revealTargets.forEach((el, index) => {
      el.classList.add('reveal-on-scroll');
      const isPortfolioItem = el.classList.contains('portfolio-item');
      const delayStep = isPortfolioItem ? 70 : 40;
      const maxDelay = isPortfolioItem ? 320 : 200;
      el.style.transitionDelay = `${Math.min(index * delayStep, maxDelay)}ms`;
    });

    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    revealTargets.forEach((el) => observer.observe(el));
  }
  window.addEventListener('load', initRevealOnScroll);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    item.dataset.animated = 'false';
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        if (item.dataset.animated === 'true') return;
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
        item.dataset.animated = 'true';
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let targetTop = getScrollTargetPosition(window.location.hash);
          if (targetTop === null) return;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Button click micro interaction
   */
  document.querySelectorAll('.btn, .php-email-form button[type="submit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.add('is-clicked');
      setTimeout(() => btn.classList.remove('is-clicked'), 220);
    });
  });

})();
