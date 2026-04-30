/* ─── js/filter.js ────────────────────────────────────────
   Project filter logic.
   Must run AFTER render.js has populated the grid.
   ─────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const filtersEl = document.getElementById('workFilters');
  const gridEl    = document.getElementById('workGrid');
  if (!filtersEl || !gridEl) return;

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    gridEl.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });

})();
