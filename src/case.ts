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
    : `background:url('${project.cover}') center/cover no-repeat`;

  const idx = site.projects.findIndex((p) => p.id === slug);
  const next = site.projects[(idx + 1) % site.projects.length];

  const galleryItems = cs?.gallery || [];
  let imgIdx = -1;
  const galleryHtml = galleryItems.map((g) => {
    const isImg = !g.startsWith('#');
    const style = isImg
      ? `background:url('${g}') center/cover no-repeat`
      : `background:${g}`;
    if (isImg) imgIdx++;
    const cls = isImg ? 'case-gallery__item case-gallery__item--clickable' : 'case-gallery__item';
    const cursor = isImg ? ' data-cursor="link"' : '';
    const lb = isImg ? ` data-lb="${imgIdx}"` : '';
    return `<figure class="${cls}" style="${style}"${cursor}${lb}></figure>`;
  }).join('');

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
        ${hasLink(cs?.live) ? `<a href="${escapeAttr(cs!.live!)}" target="_blank" rel="noopener" class="btn btn--primary" data-cursor="link"><span>view live ↗</span></a>` : ''}
        ${hasLink(cs?.repo) ? `<a href="${escapeAttr(cs!.repo!)}" target="_blank" rel="noopener" class="btn btn--ghost" data-cursor="link"><span>source ↗</span></a>` : ''}
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

  // ── Lightbox ──
  initLightbox(galleryItems.filter(g => !g.startsWith('#')));
}

function initLightbox(images: string[]) {
  if (!images.length) return;

  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = `
    <button class="lb__close" aria-label="Close" data-cursor="link">×</button>
    <button class="lb__nav lb__nav--prev" aria-label="Previous" data-cursor="link">‹</button>
    <button class="lb__nav lb__nav--next" aria-label="Next" data-cursor="link">›</button>
    <img class="lb__img" alt="">
    <span class="lb__count"></span>
  `;
  document.body.appendChild(lb);

  const img   = lb.querySelector('.lb__img') as HTMLImageElement;
  const count = lb.querySelector('.lb__count') as HTMLElement;
  let cur = 0;

  function show(i: number) {
    cur = (i + images.length) % images.length;
    img.src = images[cur];
    count.textContent = `${cur + 1} / ${images.length}`;
  }
  function open(i: number) { show(i); lb.classList.add('lb--open'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('lb--open'); document.body.style.overflow = ''; }

  document.querySelectorAll<HTMLElement>('.case-gallery__item--clickable').forEach((el) => {
    el.addEventListener('click', () => {
      open(Number(el.dataset.lb || 0));
    });
  });

  lb.querySelector('.lb__close')!.addEventListener('click', close);
  lb.querySelector('.lb__nav--prev')!.addEventListener('click', (e) => { e.stopPropagation(); show(cur - 1); });
  lb.querySelector('.lb__nav--next')!.addEventListener('click', (e) => { e.stopPropagation(); show(cur + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('lb--open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
}

function metaRow(label: string, value: string | undefined): string {
  if (!value) return '';
  return `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function hasLink(v: string | undefined | null): boolean {
  if (!v) return false;
  const t = v.trim();
  return t.length > 0 && t !== '#';
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  } as Record<string, string>)[c]!);
}
function escapeAttr(s: string) { return escapeHtml(s); }
