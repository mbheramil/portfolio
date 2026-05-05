// Renders content sections from src/content.ts so future edits = edit content.ts.
import { site } from '../content';

interface Tool {
  id?: string;
  name: string;
  type?: string;
  tagline?: string;
  description?: string;
  stack?: string[];
  icon?: string;
  cover?: string;
  demoUrl?: string;
  demoNote?: string;
  repoUrl?: string;
}

function hasLink(v: string | undefined | null): boolean {
  if (!v) return false;
  const t = v.trim();
  return t.length > 0 && t !== '#';
}

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
        <div class="work-item__hover" style="background:${p.cover.startsWith('#') ? p.cover : `url('${p.cover}') center/cover no-repeat`}"></div>
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

  // Lab — custom plugins & builds
  const lab = $('labGrid');
  const tools = ((site as unknown) as { tools?: Tool[] }).tools || [];
  if (lab) {
    if (tools.length === 0) {
      lab.closest('.section')?.remove();
    } else {
      lab.innerHTML = tools.map(t => {
        const coverStyle = t.cover
          ? (t.cover.startsWith('#') ? `background:${t.cover}` : `background:url('${t.cover}') center/cover no-repeat`)
          : '';
        const stackHtml = (t.stack || []).map(s => `<span>${escapeHtml(s)}</span>`).join('');
        const demoBtn = hasLink(t.demoUrl)
          ? `<a href="${escapeAttr(t.demoUrl!)}" target="_blank" rel="noopener" class="lab-card__btn lab-card__btn--primary" data-cursor="link"><span>try demo</span><span class="lab-card__arrow">↗</span></a>`
          : '';
        const repoBtn = hasLink(t.repoUrl)
          ? `<a href="${escapeAttr(t.repoUrl!)}" target="_blank" rel="noopener" class="lab-card__btn" data-cursor="link"><span>source</span><span class="lab-card__arrow">↗</span></a>`
          : '';
        const note = t.demoNote ? `<p class="lab-card__note">${escapeHtml(t.demoNote)}</p>` : '';
        const typeLabel = t.type ? escapeHtml(t.type) : 'tool';
        const cover = coverStyle
          ? `<div class="lab-card__cover" style="${coverStyle}"></div>`
          : `<div class="lab-card__cover lab-card__cover--icon">${escapeHtml(t.icon || '⚡')}</div>`;
        return `
          <article class="lab-card reveal">
            ${cover}
            <div class="lab-card__body">
              <span class="lab-card__type">${typeLabel}</span>
              <h3 class="lab-card__title">${escapeHtml(t.name)}</h3>
              <p class="lab-card__tag">${escapeHtml(t.tagline || '')}</p>
              ${t.description ? `<p class="lab-card__desc">${escapeHtml(t.description)}</p>` : ''}
              ${stackHtml ? `<div class="lab-card__stack">${stackHtml}</div>` : ''}
              ${(demoBtn || repoBtn) ? `<div class="lab-card__actions">${demoBtn}${repoBtn}</div>` : ''}
              ${note}
            </div>
          </article>`;
      }).join('');
    }
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

  // Socials — hide the whole card if there are none
  const socials = $('contactSocials');
  if (socials) {
    if (site.socials.length === 0) {
      socials.closest('.contact-card')?.remove();
    } else {
      socials.innerHTML = site.socials.map(s =>
        `<a href="${s.url}" target="_blank" rel="noopener" data-cursor="link">${escapeHtml(s.label)} ↗</a>`
      ).join('');
    }
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  } as Record<string, string>)[c]!);
}
function escapeAttr(s: string) { return escapeHtml(s); }
