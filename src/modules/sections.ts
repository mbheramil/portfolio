// Renders content sections from src/content.ts so future edits = edit content.ts.
import { site } from '../content';

export function renderContent() {
  const $ = (id: string) => document.getElementById(id);

  // Status / hero sub / footer year / email
  const status = $('statusText'); if (status) status.textContent = site.status;
  const sub = $('heroSub'); if (sub) sub.dataset.text = site.hero.sub;
  const year = $('footYear'); if (year) year.textContent = String(new Date().getFullYear());
  const emailVal = $('contactEmailVal'); if (emailVal) emailVal.textContent = site.email;
  const contactEmail = $('contactEmail') as HTMLAnchorElement | null;
  if (contactEmail) {
    contactEmail.href = `mailto:${site.email}`;
    contactEmail.addEventListener('click', async (e) => {
      e.preventDefault();
      try { await navigator.clipboard.writeText(site.email); } catch {}
      contactEmail.classList.add('copied');
      setTimeout(() => contactEmail.classList.remove('copied'), 1800);
      setTimeout(() => { window.location.href = `mailto:${site.email}`; }, 250);
    });
  }
  const resume = $('contactResume') as HTMLAnchorElement | null;
  if (resume) resume.href = site.resumeUrl;

  // Marquee
  const m = $('marqueeTrack');
  if (m) {
    const items = site.marquee.map(t => `<span>${t}</span>`).join('');
    m.innerHTML = items + items; // duplicate for seamless loop
  }

  // Work
  const work = $('workList');
  if (work) {
    work.innerHTML = site.projects.map((p, i) => `
      <a class="work-item reveal" href="/case.html?p=${encodeURIComponent(p.id)}" data-cursor="link">
        <span class="work-item__num">0${i + 1}</span>
        <div>
          <h3 class="work-item__title">${escapeHtml(p.title)} <em>—</em> ${escapeHtml(p.tagline)}</h3>
          <p class="work-item__detail">${escapeHtml(p.summary)}</p>
          <div class="work-item__stack">${p.stack.map(s => `<span>${escapeHtml(s)}</span>`).join('')}</div>
        </div>
        <span class="work-item__role">${escapeHtml(p.role)}</span>
        <span class="work-item__year">${escapeHtml(p.year)}</span>
        <div class="work-item__hover" style="background:${p.cover.startsWith('#') ? p.cover : `center/cover no-repeat ${p.cover}`}"></div>
      </a>
    `).join('');

    // Floating preview follows cursor inside hovered item
    work.querySelectorAll<HTMLElement>('.work-item').forEach((it) => {
      const hov = it.querySelector<HTMLElement>('.work-item__hover');
      if (!hov) return;
      it.addEventListener('mousemove', (e) => {
        const rect = it.getBoundingClientRect();
        hov.style.left = `${e.clientX - rect.left}px`;
        hov.style.top  = `${e.clientY - rect.top}px`;
      });
    });
  }

  // Stack
  const stack = $('stackGrid');
  if (stack) {
    stack.innerHTML = site.stack.map(g => `
      <article class="stack-card reveal">
        <span class="stack-card__group">${escapeHtml(g.group)}</span>
        <div class="stack-card__items">${g.items.map(i => `<span>${escapeHtml(i)}</span>`).join('')}</div>
      </article>
    `).join('');
  }

  // Process
  const process = $('processList');
  if (process) {
    process.innerHTML = site.process.map(p => `
      <article class="process-card reveal">
        <span class="process-card__num">${escapeHtml(p.n)}</span>
        <h3 class="process-card__title">${escapeHtml(p.title)}</h3>
        <p class="process-card__body">${escapeHtml(p.body)}</p>
      </article>
    `).join('');
  }

  // Socials
  const socials = $('contactSocials');
  if (socials) {
    socials.innerHTML = site.socials.map(s =>
      `<a href="${s.url}" target="_blank" rel="noopener" data-cursor="link">${escapeHtml(s.label)} ↗</a>`
    ).join('');
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  } as Record<string, string>)[c]!);
}
