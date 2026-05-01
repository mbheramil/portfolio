import './styles/main.css';
import { site } from './content';
import { initCursor } from './modules/cursor';
import { initPalette } from './modules/palette';

const root = document.getElementById('caseRoot') as HTMLElement;

const params = new URLSearchParams(window.location.search);
const slug = params.get('p') || '';
const project = site.projects.find((p) => p.id === slug);

document.getElementById('footYear')!.textContent = String(new Date().getFullYear());

// Mobile menu (shared)
const burger = document.getElementById('navBurger');
const mm = document.getElementById('mm');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mm?.classList.toggle('open');
});

initCursor();
initPalette();

if (!project) {
  root.innerHTML = `
    <section class="case-empty">
      <span class="case-num">404 / not_found</span>
      <h1>This project doesn't exist.</h1>
      <p>The link may be wrong, or the project hasn't been published yet.</p>
      <a href="/" class="btn btn--primary" data-cursor="link"><span>← back to all work</span></a>
    </section>`;
} else {
  document.getElementById('caseTitle')!.textContent = `${project.title} — case study · mbheramil`;
  document.getElementById('caseMeta')!.setAttribute('content', project.tagline);

  const cs = project.caseStudy;
  const cover = project.cover.startsWith('#')
    ? `background:${project.cover}`
    : `background:center/cover no-repeat ${project.cover}`;

  const idx = site.projects.findIndex((p) => p.id === slug);
  const next = site.projects[(idx + 1) % site.projects.length];

  const galleryHtml = cs?.gallery?.map((g) => {
    const style = g.startsWith('#')
      ? `background:${g}`
      : `background:center/cover no-repeat ${g}`;
    return `<figure class="case-gallery__item" style="${style}"></figure>`;
  }).join('') || '';

  const sectionsHtml = cs?.sections?.map((s, i) => `
    <section class="case-section">
      <span class="case-num">0${i + 1} / ${escapeHtml(s.heading)}</span>
      <p>${escapeHtml(s.body)}</p>
    </section>
  `).join('') || '';

  root.innerHTML = `
    <header class="case-hero">
      <span class="case-num">case study</span>
      <h1 class="case-hero__title">${escapeHtml(project.title)}</h1>
      <p class="case-hero__tag">${escapeHtml(project.tagline)}</p>
      <dl class="case-meta">
        ${metaRow('client',   cs?.client)}
        ${metaRow('year',     project.year)}
        ${metaRow('role',     project.role)}
        ${metaRow('timeline', cs?.timeline)}
        ${metaRow('team',     cs?.team)}
      </dl>
      <div class="case-hero__cta">
        ${cs?.live && cs.live !== '#' ? `<a href="${escapeAttr(cs.live)}" target="_blank" rel="noopener" class="btn btn--primary" data-cursor="link"><span>view live ↗</span></a>` : ''}
        ${cs?.repo && cs.repo !== '#' ? `<a href="${escapeAttr(cs.repo)}" target="_blank" rel="noopener" class="btn btn--ghost" data-cursor="link"><span>source ↗</span></a>` : ''}
      </div>
    </header>

    <figure class="case-cover" style="${cover}"></figure>

    <article class="case-body">
      <p class="case-summary">${escapeHtml(project.summary)}</p>
      ${sectionsHtml}
      <section class="case-section">
        <span class="case-num">stack</span>
        <div class="case-stack">${project.stack.map((s) => `<span>${escapeHtml(s)}</span>`).join('')}</div>
      </section>
      ${galleryHtml ? `
        <section class="case-section case-section--full">
          <span class="case-num">gallery</span>
          <div class="case-gallery">${galleryHtml}</div>
        </section>` : ''}
    </article>

    <nav class="case-next">
      <span class="case-num">next →</span>
      <a href="/case.html?p=${encodeURIComponent(next.id)}" class="case-next__link" data-cursor="link">
        <span class="case-next__title">${escapeHtml(next.title)}</span>
        <span class="case-next__tag">${escapeHtml(next.tagline)}</span>
      </a>
    </nav>
  `;
}

function metaRow(label: string, value: string | undefined): string {
  if (!value) return '';
  return `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  } as Record<string, string>)[c]!);
}
function escapeAttr(s: string) { return escapeHtml(s); }
