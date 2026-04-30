/* ─── js/render.js ────────────────────────────────────────
   Reads window.SiteConfig and renders all dynamic sections
   into the DOM. Runs before any other module.
   ─────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const C = window.SiteConfig;
  if (!C) { console.error('SiteConfig not loaded'); return; }

  /* ── HERO STATS ─────────────────────────────────────── */
  const statsEl = document.getElementById('heroStats');
  if (statsEl) {
    statsEl.innerHTML = C.stats.map((s, i) => `
      ${i > 0 ? '<div class="stat__divider"></div>' : ''}
      <div class="stat">
        <span class="stat__num" data-target="${s.value}">0</span><span class="stat__plus">${s.suffix}</span>
        <span class="stat__label">${s.label}</span>
      </div>`).join('');
  }

  /* ── ABOUT PARAGRAPHS ────────────────────────────────── */
  const aboutTextEl = document.getElementById('aboutText');
  if (aboutTextEl) {
    aboutTextEl.innerHTML = C.about.paragraphs
      .map(p => `<p class="about__text">${p}</p>`)
      .join('');
  }

  /* ── SKILLS ─────────────────────────────────────────── */
  const skillsEl = document.getElementById('skillsGrid');
  if (skillsEl) {
    skillsEl.innerHTML = C.about.skills
      .map(s => `<div class="skill-tag">${s}</div>`)
      .join('');
  }

  /* ── SERVICES ────────────────────────────────────────── */
  const servicesEl = document.getElementById('servicesGrid');
  if (servicesEl) {
    servicesEl.innerHTML = C.services.map(s => `
      <div class="service-card reveal-up">
        <div class="service-card__num">${s.num}</div>
        <div class="service-card__icon">${s.icon}</div>
        <h3 class="service-card__title">${s.title}</h3>
        <p class="service-card__desc">${s.desc}</p>
        <div class="service-card__tags">
          ${s.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>`).join('');
  }

  /* ── TOOLS ───────────────────────────────────────────── */
  const toolsEl = document.getElementById('toolsGrid');
  if (toolsEl) {
    toolsEl.innerHTML = C.tools.map(t => `
      <div class="tool-item reveal-up">
        <div class="tool-item__inner">
          <div class="tool-dot" style="--c:${t.hue}"></div>
          <span class="tool-name">${t.name}</span>
        </div>
      </div>`).join('');
  }

  /* ── PROJECTS ────────────────────────────────────────── */
  const workEl = document.getElementById('workGrid');
  if (workEl) {
    workEl.innerHTML = C.projects.map(p => `
      <div class="project-card reveal-up" data-category="${p.category}">
        <div class="project-card__img">
          <div class="project-card__img-bg" style="--hue:${p.hue}"></div>
          <div class="project-card__overlay">
            <a href="${p.url}" class="project-link" aria-label="View project" ${p.url !== '#' ? 'target="_blank" rel="noopener"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
        </div>
        <div class="project-card__body">
          <div class="project-card__meta">
            ${p.tags.map(t => `<span class="project-cat">${t}</span>`).join('')}
          </div>
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.desc}</p>
        </div>
      </div>`).join('');
  }

  /* ── PROJECT FILTER BUTTONS ──────────────────────────── */
  const filtersEl = document.getElementById('workFilters');
  if (filtersEl) {
    const cats = [...new Set(C.projects.map(p => p.category))];
    filtersEl.innerHTML = `
      <button class="filter-btn active" data-filter="all">All</button>
      ${cats.map(c => `<button class="filter-btn" data-filter="${c}">${c}</button>`).join('')}`;
  }

  /* ── SOCIAL LINKS ────────────────────────────────────── */
  const socialEl = document.getElementById('socialLinks');
  if (socialEl) {
    socialEl.innerHTML = C.social.map(s => `
      <a href="${s.url}" class="social-link" aria-label="${s.name}"
         ${s.url !== '#' ? 'target="_blank" rel="noopener"' : ''}>
        ${s.icon}
      </a>`).join('');
  }

  /* ── CONTACT EMAIL ───────────────────────────────────── */
  const emailEl = document.getElementById('contactEmail');
  if (emailEl) emailEl.textContent = C.email;

  /* ── CONTACT LOCATION ────────────────────────────────── */
  const locationEl = document.getElementById('contactLocation');
  if (locationEl) locationEl.textContent = C.location;

  /* ── AI QUICK QUESTION BUTTONS ───────────────────────── */
  const quickBtnsEl = document.getElementById('aiQuickBtns');
  if (quickBtnsEl && C.ai) {
    quickBtnsEl.innerHTML = C.ai.quickQuestions
      .map(q => `<button class="ai-quick" data-q="${q.question}">${q.label}</button>`)
      .join('');
  }

})();
