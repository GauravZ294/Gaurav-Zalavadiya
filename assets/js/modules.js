/** Small page-specific interactions for the static multi-page portfolio. */
(() => {
  'use strict';
  // Preserve existing one-page bookmarks after moving the modules to pages.
  const legacyPages = {
    '#about': 'about.html', '#skills': 'skills.html', '#resume': 'experience.html',
    '#portfolio': 'projects.html', '#services': 'services.html', '#contact': 'contact.html'
  };
  if (document.body.classList.contains('index-page') && legacyPages[window.location.hash]) {
    window.location.replace(legacyPages[window.location.hash]);
    return;
  }
  const controls = document.querySelector('.project-controls');
  if (controls) {
    const buttons = [...controls.querySelectorAll('[data-project-filter]')];
    const search = document.getElementById('project-search');
    const cards = [...document.querySelectorAll('.project-grid > [data-project-type]')];
    const count = document.getElementById('project-result-count');
    const empty = document.getElementById('project-empty');
    let filter = 'all';
    function applyFilters() {
      const query = search.value.trim().toLocaleLowerCase();
      let total = 0;
      cards.forEach(card => {
        const typeMatches = filter === 'all' || card.dataset.projectType === filter;
        const matches = typeMatches && card.textContent.toLocaleLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) {
          total++;
          // Search/filter changes must never leave a visible card unrevealed.
          card.querySelector('.portfolio-content')?.classList.add('studio-visible');
        }
      });
      count.textContent = `${total} ${total === 1 ? 'project' : 'projects'}`;
      empty.hidden = total > 0;
      buttons.forEach(button => {
        const selected = button.dataset.projectFilter === filter;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.projectFilter;
      applyFilters();
    }));
    search.addEventListener('input', applyFilters);
    document.getElementById('project-reset').addEventListener('click', () => {
      filter = 'all'; search.value = ''; applyFilters(); search.focus();
    });
    applyFilters();
  }
  const subject = document.getElementById('subject-field');
  const service = new URLSearchParams(window.location.search).get('service');
  if (subject && service && service.length < 100) subject.value = `Enquiry: ${service}`;
})();
