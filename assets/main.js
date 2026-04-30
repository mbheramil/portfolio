/* ──────────────────────────────────────────────────────────
   mbheramil.com — frontend
   Fetches all content from admin worker and renders.
   ────────────────────────────────────────────────────────── */

const API_BASE = 'https://admin.mbheramil.com';

// ─── Tiny DOM helpers ──────────────────────────────────────
const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const h  = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
  }
  return el;
};

// ─── Inline SVG icons ──────────────────────────────────────
const ICONS = {
  layers:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  plug:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0V8z"/><path d="M12 18v4"/></svg>',
  search:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>',
  shop:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l3 12h11l3-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>',
  grid:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.3c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm12.5 10.3h-3v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v4.73z"/></svg>',
  github:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/></svg>',
  twitter:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  youtube:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></svg>',
  mail:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
};
const icon = name => ICONS[name] || ICONS.sparkles;

// ─── Theme tokens from CMS ─────────────────────────────────
function applyTheme(theme = {}) {
  const root = document.documentElement;
  if (theme.bg)      root.style.setProperty('--bg', theme.bg);
  if (theme.text)    root.style.setProperty('--text', theme.text);
  if (theme.muted)   root.style.setProperty('--muted', theme.muted);
  if (theme.border)  root.style.setProperty('--border', theme.border);
  if (theme.accent)  root.style.setProperty('--accent', theme.accent);
  if (theme.accent2) root.style.setProperty('--accent2', theme.accent2);
}

// ─── Render hero ───────────────────────────────────────────
function renderHero(s, items) {
  if (s.hero) {
    if (s.hero.tagline)  $('#heroTagline').textContent  = s.hero.tagline;
    if (s.hero.headline) $('#heroHeadline').textContent = s.hero.headline;
    if (s.hero.subline)  $('#heroSubline').textContent  = s.hero.subline;
    if (s.hero.intro)    $('#heroIntro').textContent    = s.hero.intro;
  }
  if (s.personal?.availableForWork) $('#heroTag').hidden = false;

  // Stats
  const stats = items.stat || [];
  const grid = $('#heroStats');
  grid.innerHTML = '';
  if (!stats.length) { grid.style.display = 'none'; return; }
  for (const st of stats) {
    grid.appendChild(h('div', { class: 'stat' },
      h('div', { class: 'stat__num' }, String(st.value || 0), st.suffix ? h('small', {}, st.suffix) : null),
      h('div', { class: 'stat__lbl' }, st.label || '')
    ));
  }
}

// ─── Typewriter ────────────────────────────────────────────
function startTypewriter(items) {
  const el = $('#typewriter');
  const phrases = (items.typewriter || []).map(t => t.text).filter(Boolean);
  if (!phrases.length) { el.textContent = 'great products'; return; }
  let i = 0, j = 0, deleting = false;
  function tick() {
    const p = phrases[i];
    if (!deleting) {
      el.textContent = p.slice(0, ++j);
      if (j === p.length) { deleting = true; setTimeout(tick, 1700); return; }
    } else {
      el.textContent = p.slice(0, --j);
      if (j === 0) { deleting = false; i = (i + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 35 : 75);
  }
  tick();
}

// ─── About ─────────────────────────────────────────────────
function renderAbout(s, items) {
  if (s.about?.heading) $('#aboutHeading').textContent = s.about.heading;
  const txt = $('#aboutText');
  txt.innerHTML = '';
  for (const p of (items.about_para || [])) txt.appendChild(h('p', {}, p.text || ''));

  const sk = $('#aboutSkills');
  sk.innerHTML = '';
  for (const s2 of (items.skill || [])) sk.appendChild(h('span', { class: 'skill' }, s2.name || ''));
}

// ─── Services ──────────────────────────────────────────────
function renderServices(items) {
  const g = $('#servicesGrid');
  g.innerHTML = '';
  for (const s of (items.service || [])) {
    g.appendChild(h('div', { class: 'service reveal' },
      h('div', { class: 'service__num' }, s.num || ''),
      h('div', { class: 'service__icon', html: icon(s.icon) }),
      h('h3', { class: 'service__title' }, s.title || ''),
      h('p',  { class: 'service__desc' }, s.desc || ''),
      h('div', { class: 'service__tags' }, ...(s.tags || []).map(t => h('span', { class: 'service__tag' }, t)))
    ));
  }
}

// ─── Tools ─────────────────────────────────────────────────
function renderTools(items) {
  const g = $('#toolsList');
  g.innerHTML = '';
  for (const t of (items.tool || [])) {
    const dot = h('span', { class: 'tool__dot' });
    if (typeof t.hue === 'number') dot.style.background = `hsl(${t.hue}, 70%, 55%)`;
    g.appendChild(h('div', { class: 'tool reveal' }, dot, t.name || ''));
  }
}

// ─── Projects + filter ─────────────────────────────────────
let allProjects = [];
function renderProjects(items) {
  allProjects = items.project || [];
  const cats = ['All', ...new Set(allProjects.map(p => p.category).filter(Boolean))];
  const fb = $('#filterButtons');
  fb.innerHTML = '';
  cats.forEach((c, i) => {
    const btn = h('button', { class: 'filter' + (i === 0 ? ' active' : ''), 'data-cat': c }, c);
    btn.addEventListener('click', () => {
      $$('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawProjects(c);
    });
    fb.appendChild(btn);
  });
  drawProjects('All');
}
function drawProjects(cat) {
  const g = $('#projectsGrid');
  g.innerHTML = '';
  const list = cat === 'All' ? allProjects : allProjects.filter(p => p.category === cat);
  for (const p of list) {
    const imgStyle = p.image
      ? { backgroundImage: `url(${p.image})` }
      : { background: `linear-gradient(135deg, hsl(${p.hue||220},70%,60%), hsl(${(p.hue||220)+40},70%,55%))` };
    const card = h('a', { class: 'project reveal', href: p.url || '#', target: p.url ? '_blank' : '_self', rel: 'noopener' },
      h('div', { class: 'project__img', style: imgStyle, loading: 'lazy' }),
      h('div', { class: 'project__body' },
        p.category ? h('div', { class: 'project__cat' }, p.category) : null,
        h('h3', { class: 'project__title' }, p.title || ''),
        h('p', { class: 'project__desc' }, p.desc || ''),
        h('div', { class: 'project__tags' }, ...(p.tags || []).map(t => h('span', { class: 'project__tag' }, t)))
      )
    );
    g.appendChild(card);
  }
  observeReveal();
}

// ─── Process ───────────────────────────────────────────────
function renderProcess(items) {
  const g = $('#processGrid');
  g.innerHTML = '';
  for (const p of (items.process || [])) {
    g.appendChild(h('div', { class: 'process reveal' },
      h('div', { class: 'process__num' }, p.num || ''),
      h('h3', { class: 'process__title' }, p.title || ''),
      h('p', { class: 'process__desc' }, p.desc || '')
    ));
  }
}

// ─── Contact form ──────────────────────────────────────────
function renderContact(s, items) {
  if (s.contact?.heading) $('#contactHeading').textContent = s.contact.heading;
  if (s.contact?.sub)     $('#contactSub').textContent     = s.contact.sub;
  const sel = $('#serviceSelect');
  sel.innerHTML = '<option value="">Select a service…</option>';
  for (const sv of (items.service || [])) {
    sel.appendChild(h('option', { value: sv.title || '' }, sv.title || ''));
  }
  sel.appendChild(h('option', { value: 'Other' }, 'Something else'));
}

$('#contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const status = $('#formStatus');
  const data = Object.fromEntries(new FormData(form));
  status.hidden = false;
  status.className = 'form-status';
  status.textContent = 'Sending…';
  try {
    const res = await fetch(API_BASE + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    status.classList.add('success');
    status.textContent = "Thanks! I'll get back to you within 24 hours.";
    form.reset();
  } catch (err) {
    status.classList.add('error');
    status.textContent = 'Something went wrong. Email me directly: ' + ($('#footerEmail').textContent || '');
  }
});

// ─── Footer + social ───────────────────────────────────────
function renderFooter(s, items) {
  if (s.personal?.name) {
    $('#footerName').textContent = s.personal.name;
    $('#navLogo').textContent    = s.personal.name;
  }
  if (s.personal?.email) $('#footerEmail').textContent = s.personal.email;
  const soc = $('#footerSocial');
  soc.innerHTML = '';
  if (s.personal?.email) {
    soc.appendChild(h('a', { href: 'mailto:' + s.personal.email, 'aria-label': 'Email', html: ICONS.mail }));
  }
  for (const item of (items.social || [])) {
    soc.appendChild(h('a', {
      href: item.url || '#', target: '_blank', rel: 'noopener',
      'aria-label': item.name || '',
      html: icon(item.icon),
    }));
  }
}

// ─── SEO / page title ──────────────────────────────────────
function applySeo(s) {
  if (s.seo?.title) document.title = s.seo.title;
  if (s.seo?.description) {
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', s.seo.description);
  }
  // OG / Twitter
  const title = s.seo?.title || s.personal?.name || '';
  const desc  = s.seo?.description || '';
  const img   = s.og?.image || '';
  const set = (id, attr, v) => { const el = document.getElementById(id); if (el && v) el.setAttribute(attr, v); };
  set('ogTitle','content', title); set('ogDesc','content', desc); set('ogImage','content', img);
  set('twTitle','content', title); set('twDesc','content', desc); set('twImage','content', img);
  // JSON-LD
  const ld = {
    '@context': 'https://schema.org', '@type': 'Person',
    name: s.personal?.name || '', jobTitle: s.personal?.title || '',
    email: s.personal?.email ? 'mailto:' + s.personal.email : undefined,
    url: s.personal?.website || 'https://mbheramil.com',
    address: s.personal?.location ? { '@type': 'PostalAddress', addressLocality: s.personal.location } : undefined,
  };
  const ldEl = document.getElementById('jsonld');
  if (ldEl) ldEl.textContent = JSON.stringify(ld);
}

// ─── Testimonials ──────────────────────────────────────────
function renderTestimonials(items) {
  const list = items.testimonial || [];
  const sec = document.getElementById('testimonials');
  if (!list.length) return;
  sec.hidden = false;
  const g = document.getElementById('testimonialsGrid');
  g.innerHTML = '';
  for (const t of list) {
    const initials = (t.name || '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
    g.appendChild(h('div', { class: 'testimonial reveal' },
      h('p', { class: 'testimonial__quote' }, t.quote || ''),
      h('div', { class: 'testimonial__who' },
        h('div', { class: 'testimonial__avatar', style: t.avatar ? { backgroundImage: `url(${t.avatar})` } : {} }, t.avatar ? '' : initials),
        h('div', {},
          h('div', { class: 'testimonial__name' }, t.name || ''),
          h('div', { class: 'testimonial__role' }, t.role || '')
        )
      )
    ));
  }
}

// ─── Pricing ───────────────────────────────────────────────
function renderPricing(items) {
  const list = items.pricing || [];
  const sec = document.getElementById('pricing');
  if (!list.length) return;
  sec.hidden = false;
  const g = document.getElementById('pricingGrid');
  g.innerHTML = '';
  for (const p of list) {
    const featured = p.featured === true || p.featured === 'true';
    const card = h('div', { class: 'pricing-card reveal' + (featured ? ' pricing-card--featured' : '') });
    if (featured) card.appendChild(h('div', { class: 'pricing-card__badge' }, 'Most popular'));
    card.appendChild(h('div', { class: 'pricing-card__name' }, p.name || ''));
    card.appendChild(h('div', { class: 'pricing-card__desc' }, p.desc || ''));
    card.appendChild(h('div', { class: 'pricing-card__price' },
      (typeof p.price === 'string' && /\d/.test(p.price)) ? '$' + p.price : (p.price || ''),
      p.unit ? h('small', {}, ' ' + p.unit) : null
    ));
    const ul = h('ul', { class: 'pricing-card__features' });
    for (const f of (p.features || [])) ul.appendChild(h('li', {}, f));
    card.appendChild(ul);
    card.appendChild(h('a', { class: 'btn ' + (featured ? 'btn--primary' : 'btn--ghost'), href: '#contact' }, p.cta || 'Get started'));
    g.appendChild(card);
  }
}

// ─── FAQ ───────────────────────────────────────────────────
function renderFAQ(items) {
  const list = items.faq || [];
  const sec = document.getElementById('faq');
  if (!list.length) return;
  sec.hidden = false;
  const g = document.getElementById('faqList');
  g.innerHTML = '';
  for (const f of list) {
    const item = h('div', { class: 'faq-item reveal' });
    const q = h('button', { class: 'faq-item__q' }, f.q || '');
    const a = h('div', { class: 'faq-item__a' }, f.a || '');
    q.addEventListener('click', () => item.classList.toggle('open'));
    item.append(q, a);
    g.appendChild(item);
  }
}

// ─── Newsletter ────────────────────────────────────────────
function setupNewsletter(features) {
  if (features?.newsletter === false) return;
  const sec = document.getElementById('newsletter');
  sec.hidden = false;
  const form = document.getElementById('newsletterForm');
  const status = document.getElementById('newsletterStatus');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.email.value.trim();
    status.hidden = false;
    status.className = 'newsletter__status';
    status.textContent = 'Subscribing…';
    try {
      const res = await fetch(API_BASE + '/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'site' }),
      });
      if (!res.ok) throw new Error(await res.text());
      status.classList.add('success');
      status.textContent = 'Thanks! You\'re subscribed.';
      form.reset();
    } catch {
      status.classList.add('error');
      status.textContent = 'Could not subscribe. Try again.';
    }
  });
}

// ─── Dark mode (disabled — keep light only) ────────────────
function setupTheme() {
  document.documentElement.removeAttribute('data-theme');
  try { localStorage.removeItem('theme'); } catch(e) {}
}

// ─── Scroll progress ───────────────────────────────────────
function setupScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const tick = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = max > 0 ? ((h.scrollTop / max) * 100) + '%' : '0%';
  };
  document.addEventListener('scroll', tick, { passive: true });
  tick();
}

// ─── Reveal-on-scroll ──────────────────────────────────────
let observer;
function observeReveal() {
  if (!observer) {
    observer = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  }
  $$('.reveal:not(.in)').forEach(el => observer.observe(el));
}

// ─── Nav scroll + mobile menu ──────────────────────────────
const nav = $('#nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

const burger = $('#navBurger'), mobileMenu = $('#mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

// ─── AI Chat widget ────────────────────────────────────────
function setupChat(items) {
  const chat = $('#chat');
  chat.hidden = false;
  const panel = $('#chatPanel'),
        fab = $('#chatFab'),
        close = $('#chatClose'),
        msgs = $('#chatMessages'),
        input = $('#chatInput'),
        send = $('#chatSend'),
        quick = $('#chatQuick');

  fab.addEventListener('click', () => panel.classList.toggle('open'));
  close.addEventListener('click', () => panel.classList.remove('open'));

  // Greeting
  msgs.appendChild(h('div', { class: 'msg msg--bot' }, "Hi! I'm Mherafil's AI assistant. Ask me about services, pricing, or tech."));

  // Quick questions
  quick.innerHTML = '';
  for (const q of (items.quick_question || [])) {
    quick.appendChild(h('button', { onclick: () => sendMessage(q.question || q.label || '') }, q.label || q.question || ''));
  }

  async function sendMessage(text) {
    text = (text || input.value || '').trim();
    if (!text) return;
    input.value = '';
    msgs.appendChild(h('div', { class: 'msg msg--user' }, text));
    msgs.scrollTop = msgs.scrollHeight;
    const thinking = h('div', { class: 'msg msg--bot' }, '…');
    msgs.appendChild(thinking);
    msgs.scrollTop = msgs.scrollHeight;
    try {
      const res = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
      });
      const j = await res.json();
      const reply = j.choices?.[0]?.message?.content || j.error || 'Sorry, no response.';
      thinking.textContent = reply;
    } catch (e) {
      thinking.textContent = 'Network error. Please try again.';
    }
    msgs.scrollTop = msgs.scrollHeight;
  }
  send.addEventListener('click', () => sendMessage());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
}

// ─── Page tracking ─────────────────────────────────────────
function track() {
  const isMobile = matchMedia('(max-width: 768px)').matches;
  fetch(API_BASE + '/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: location.pathname, device: isMobile ? 'mobile' : 'desktop', referrer: document.referrer || '' }),
  }).catch(() => {});
}

// ─── Init ──────────────────────────────────────────────────
(async function init() {
  try {
    const res = await fetch(API_BASE + '/api/content', { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.statusText);
    const { settings = {}, items = {} } = await res.json();

    applyTheme(settings.theme);
    applySeo(settings);
    renderHero(settings, items);
    startTypewriter(items);
    renderAbout(settings, items);
    renderServices(items);
    renderTools(items);
    renderProjects(items);
    renderProcess(items);
    renderTestimonials(items);
    renderPricing(items);
    renderFAQ(items);
    renderContact(settings, items);
    setupNewsletter(settings.features);
    renderFooter(settings, items);
    if (settings.features?.chat !== false) setupChat(items);
    setupTheme();
    setupScrollProgress();
    observeReveal();
    track();
    // Hide skeleton
    const skel = document.getElementById('pageSkeleton');
    if (skel) { skel.classList.add('hide'); setTimeout(() => skel.remove(), 400); }
  } catch (e) {
    console.error('Failed to load site content:', e);
    $('#heroTagline').textContent = 'Site is loading…';
    $('#heroHeadline').textContent = 'Please refresh';
    $('#heroSubline').textContent = '';
    const skel = document.getElementById('pageSkeleton');
    if (skel) skel.classList.add('hide');
  }
})();
