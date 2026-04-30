// Dashboard SPA — embedded as a string and served by the worker.
// All HTML/CSS/JS lives here as one file.

export const dashboardHTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin — mbheramil</title>
<style>
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0 }
  :root {
    --bg: #f8fafc; --panel: #fff; --text: #0f172a; --muted: #64748b;
    --border: #e2e8f0; --accent: #2563eb; --accent2: #7c3aed;
    --green: #10b981; --red: #ef4444; --amber: #f59e0b;
  }
  html, body { height: 100%; overflow: hidden }
  body { font: 14px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif; background: var(--bg); color: var(--text); }
  a { color: var(--accent); text-decoration: none }
  button { font: inherit; cursor: pointer; border: none; background: none; color: inherit }
  input, textarea, select { font: inherit; color: inherit; width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; background: #fff; transition: border-color .15s, box-shadow .15s }
  input:focus, textarea:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(37,99,235,.12) }
  textarea { resize: vertical; min-height: 70px; font-family: inherit }

  .layout { display: grid; grid-template-columns: 240px 1fr; height: 100vh; }

  /* Sidebar */
  .sidebar { background: var(--panel); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
  .sidebar__brand { padding: 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px }
  .sidebar__brand img { width: 32px; height: 32px; border-radius: 50% }
  .sidebar__brand b { font-size: .95rem }
  .sidebar__brand small { display:block; color: var(--muted); font-size: .75rem }
  .sidebar__nav { flex: 1; padding: 8px; overflow-y: auto }
  .sidebar__group { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); padding: 14px 12px 6px; font-weight: 600 }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; color: var(--text); font-size: .88rem; width: 100%; text-align: left; transition: background .15s }
  .nav-item:hover { background: #f1f5f9 }
  .nav-item.active { background: var(--accent); color: #fff }
  .nav-item svg { width: 16px; height: 16px; flex-shrink: 0 }
  .sidebar__foot { padding: 12px; border-top: 1px solid var(--border); display: flex; gap: 8px }
  .sidebar__foot button { padding: 8px 12px; border-radius: 6px; font-size: .82rem; flex: 1 }
  .btn-preview { background: #f1f5f9 } .btn-preview:hover { background: #e2e8f0 }
  .btn-logout { background: #fef2f2; color: var(--red) } .btn-logout:hover { background: #fee2e2 }

  /* Main */
  .main { display: flex; flex-direction: column; overflow: hidden }
  .topbar { padding: 14px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--panel) }
  .topbar h1 { font-size: 1.05rem; font-weight: 600 }
  .topbar__actions { display: flex; gap: 8px }
  .toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 18px; background: var(--text); color: #fff; border-radius: 8px; font-size: .85rem; box-shadow: 0 10px 25px rgba(0,0,0,.15); transform: translateY(100px); opacity: 0; transition: .3s; z-index: 1000 }
  .toast.show { transform: translateY(0); opacity: 1 }
  .toast.error { background: var(--red) }
  .toast.success { background: var(--green) }

  .content { flex: 1; overflow-y: auto; padding: 24px 32px 64px; max-width: 1100px; width: 100%; margin: 0 auto }
  .page-title { font-size: 1.4rem; font-weight: 600; margin-bottom: 4px }
  .page-sub { color: var(--muted); margin-bottom: 24px; font-size: .9rem }

  /* Cards */
  .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 20px }
  .card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border) }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px }
  .row.full { grid-template-columns: 1fr }
  label { display: block }
  label > span { display: block; font-size: .8rem; color: var(--muted); margin-bottom: 4px; font-weight: 500 }
  .checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 0 }
  .checkbox input { width: auto; margin: 0 }

  /* Buttons */
  .btn { padding: 8px 16px; border-radius: 6px; font-weight: 500; font-size: .85rem; transition: .15s; display: inline-flex; align-items: center; gap: 6px }
  .btn-primary { background: var(--accent); color: #fff } .btn-primary:hover { background: #1d4ed8 }
  .btn-secondary { background: #f1f5f9; color: var(--text) } .btn-secondary:hover { background: #e2e8f0 }
  .btn-danger { background: #fef2f2; color: var(--red) } .btn-danger:hover { background: #fee2e2 }
  .btn-small { padding: 6px 10px; font-size: .78rem }

  /* Item lists (services, projects, etc.) */
  .item-list { display: flex; flex-direction: column; gap: 10px }
  .item { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; transition: border-color .15s, box-shadow .15s }
  .item:hover { border-color: #cbd5e1 }
  .item.dragging { opacity: .5 }
  .item.expanded { display: block }
  .item.expanded .item__head { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; margin-bottom: 14px }
  .item__drag { color: var(--muted); cursor: grab; font-size: 1.2rem; user-select: none }
  .item__drag:active { cursor: grabbing }
  .item__title { font-weight: 500; font-size: .9rem }
  .item__sub   { font-size: .78rem; color: var(--muted); margin-top: 2px }
  .item__actions { display: flex; gap: 6px }
  .item__form { display: grid; gap: 12px }
  .empty { text-align: center; padding: 40px; color: var(--muted); border: 2px dashed var(--border); border-radius: 8px }

  /* Tags input */
  .tags-input { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; border: 1px solid var(--border); border-radius: 6px; background: #fff; min-height: 40px }
  .tags-input input { border: none; flex: 1; min-width: 120px; padding: 4px 6px }
  .tags-input input:focus { box-shadow: none }
  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: #eff6ff; color: var(--accent); border-radius: 4px; font-size: .78rem }
  .tag button { color: var(--accent); padding: 0 2px }

  /* Tables */
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid var(--border) }
  th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: .85rem }
  th { background: #f8fafc; font-weight: 600; font-size: .78rem; color: var(--muted); text-transform: uppercase; letter-spacing: .04em }
  tr:last-child td { border-bottom: none }

  /* Stats */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px }
  .stat-box { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 18px }
  .stat-box .v { font-size: 1.6rem; font-weight: 600; margin-top: 4px }
  .stat-box .l { color: var(--muted); font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; font-weight: 600 }

  /* Preview */
  .preview-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.6); z-index: 100; display: none; backdrop-filter: blur(4px) }
  .preview-overlay.open { display: flex; align-items: center; justify-content: center; padding: 20px }
  .preview-frame { background: #fff; width: 100%; height: 100%; max-width: 1280px; border-radius: 12px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.3); display: flex; flex-direction: column }
  .preview-head { padding: 12px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between }
  .preview-head__device { display: flex; gap: 4px }
  .preview-head__device button { padding: 6px 10px; border-radius: 6px; font-size: .8rem; background: #f1f5f9 }
  .preview-head__device button.active { background: var(--accent); color: #fff }
  .preview-body { flex: 1; display: grid; place-items: center; background: #f1f5f9; padding: 20px }
  .preview-iframe-wrap { transition: width .3s, height .3s; background: #fff; box-shadow: 0 10px 40px rgba(0,0,0,.1); border-radius: 8px; overflow: hidden }
  .preview-iframe-wrap iframe { width: 100%; height: 100%; border: none }
  .preview-iframe-wrap.desktop { width: 100%; height: 100%; max-width: 1280px; max-height: 800px }
  .preview-iframe-wrap.tablet  { width: 768px; height: 1024px; max-height: calc(100vh - 160px) }
  .preview-iframe-wrap.mobile  { width: 390px; height: 844px;  max-height: calc(100vh - 160px) }

  /* Color picker */
  .color-row { display: flex; align-items: center; gap: 8px }
  .color-row input[type=color] { width: 40px; height: 40px; padding: 2px; cursor: pointer }
  .color-row input[type=text] { flex: 1; font-family: ui-monospace, monospace }

  /* Loading */
  .loading { display: grid; place-items: center; padding: 60px; color: var(--muted) }
  .spinner { width: 24px; height: 24px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite }
  @keyframes spin { to { transform: rotate(360deg) } }
</style>
</head>
<body>

<div class="layout">
  <aside class="sidebar">
    <div class="sidebar__brand">
      <img id="userAvatar" src="" alt="">
      <div><b id="userName">Loading...</b><small>Admin</small></div>
    </div>
    <nav class="sidebar__nav" id="sidebarNav"></nav>
    <div class="sidebar__foot">
      <button class="btn-preview" id="btnPreview">👁 Preview</button>
      <button class="btn-logout" onclick="location.href='/auth/logout'">Logout</button>
    </div>
  </aside>

  <main class="main">
    <div class="topbar">
      <h1 id="pageTitle">Dashboard</h1>
      <div class="topbar__actions" id="topActions"></div>
    </div>
    <div class="content" id="content"><div class="loading"><div class="spinner"></div></div></div>
  </main>
</div>

<!-- Preview overlay -->
<div class="preview-overlay" id="previewOverlay">
  <div class="preview-frame">
    <div class="preview-head">
      <strong>Live Preview</strong>
      <div class="preview-head__device">
        <button data-d="desktop" class="active">🖥 Desktop</button>
        <button data-d="tablet">📱 Tablet</button>
        <button data-d="mobile">📱 Mobile</button>
        <button onclick="document.getElementById('previewOverlay').classList.remove('open')" style="margin-left:12px;background:#fef2f2;color:#ef4444">✕ Close</button>
      </div>
    </div>
    <div class="preview-body">
      <div class="preview-iframe-wrap desktop" id="previewWrap">
        <iframe id="previewFrame" src=""></iframe>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
// ─── State ──────────────────────────────────────────────────
const API = location.origin;
const FRONTEND_URL = 'https://mbheramil.com';
let state = { settings: {}, items: {}, currentSection: 'personal' };

// ─── Helpers ────────────────────────────────────────────────
const $ = sel => document.querySelector(sel);
const h = (tag, props = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value' || k === 'checked') el[k] = v;
    else el.setAttribute(k, v);
  }
  for (const kid of kids) {
    if (kid == null || kid === false) continue;
    el.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
  }
  return el;
};

function toast(msg, type = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 2400);
}

async function api(path, opts = {}) {
  const res = await fetch(API + path, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}

async function loadContent() {
  const data = await api('/api/content');
  state.settings = data.settings || {};
  state.items    = data.items || {};
}

// ─── Sections config ────────────────────────────────────────
const SECTIONS = [
  { group: 'Site Content', id: 'personal',  label: 'Personal Info',  icon: '👤', kind: 'setting', key: 'personal',
    fields: [
      { name: 'name',     label: 'Name' },
      { name: 'title',    label: 'Title / Role' },
      { name: 'email',    label: 'Email', type: 'email' },
      { name: 'location', label: 'Location' },
      { name: 'website',  label: 'Website URL' },
      { name: 'availableForWork', label: 'Available for work', type: 'checkbox' },
    ]
  },
  { group: 'Site Content', id: 'hero', label: 'Hero Section', icon: '🎯', kind: 'setting', key: 'hero',
    fields: [
      { name: 'tagline',  label: 'Tagline (line 1)' },
      { name: 'headline', label: 'Headline (gradient line)' },
      { name: 'subline',  label: 'Subline (line 3)' },
      { name: 'intro',    label: 'Typewriter intro (e.g. "I build")' },
    ],
    extras: ['typewriter', 'stat']
  },
  { group: 'Site Content', id: 'about', label: 'About', icon: '📖', kind: 'setting', key: 'about',
    fields: [{ name: 'heading', label: 'Section heading' }],
    extras: ['about_para', 'skill']
  },
  { group: 'Site Content', id: 'services',  label: 'Services',   icon: '🛠', kind: 'items', type: 'service' },
  { group: 'Site Content', id: 'tools',     label: 'Tech Stack', icon: '⚡', kind: 'items', type: 'tool' },
  { group: 'Site Content', id: 'projects',  label: 'Projects',   icon: '💼', kind: 'items', type: 'project' },
  { group: 'Site Content', id: 'process',   label: 'Process',    icon: '🔄', kind: 'items', type: 'process' },
  { group: 'Site Content', id: 'social',    label: 'Social Links', icon: '🔗', kind: 'items', type: 'social' },
  { group: 'Site Content', id: 'contact',   label: 'Contact', icon: '✉️', kind: 'setting', key: 'contact',
    fields: [
      { name: 'heading', label: 'Heading' },
      { name: 'sub',     label: 'Sub-heading' },
    ]
  },

  { group: 'Settings', id: 'theme', label: 'Theme & Colours', icon: '🎨', kind: 'theme' },
  { group: 'Settings', id: 'seo',   label: 'SEO',   icon: '🔍', kind: 'setting', key: 'seo',
    fields: [
      { name: 'title',       label: 'Page title (browser tab)' },
      { name: 'description', label: 'Meta description', type: 'textarea' },
    ]
  },
  { group: 'Settings', id: 'ai',    label: 'AI Chat', icon: '🤖', kind: 'items', type: 'quick_question',
    description: 'Quick-question buttons shown in the AI chat widget.'
  },

  { group: 'Insights', id: 'submissions', label: 'Submissions', icon: '📥', kind: 'submissions' },
  { group: 'Insights', id: 'chats',       label: 'Chat Logs',   icon: '💬', kind: 'chats' },
  { group: 'Insights', id: 'analytics',   label: 'Analytics',   icon: '📊', kind: 'analytics' },
];

// Item field schemas
const ITEM_FIELDS = {
  service: [
    { name: 'num',   label: 'Number', placeholder: '01' },
    { name: 'title', label: 'Title' },
    { name: 'desc',  label: 'Description', type: 'textarea' },
    { name: 'tags',  label: 'Tags', type: 'tags' },
    { name: 'icon',  label: 'Icon name', placeholder: 'layers, plug, search, sparkles, shop, grid' },
  ],
  tool: [
    { name: 'name', label: 'Tool / tech name' },
    { name: 'hue',  label: 'Hue (0-360)', type: 'number' },
  ],
  project: [
    { name: 'title',    label: 'Title' },
    { name: 'desc',     label: 'Description', type: 'textarea' },
    { name: 'category', label: 'Category', placeholder: 'WordPress, SEO, AI, Shopify, Wix, Plugin' },
    { name: 'tags',     label: 'Tags', type: 'tags' },
    { name: 'url',      label: 'Project URL', placeholder: '#' },
    { name: 'image',    label: 'Image', type: 'image' },
    { name: 'hue',      label: 'Background hue (0-360)', type: 'number' },
  ],
  process: [
    { name: 'num',   label: 'Step number', placeholder: '01' },
    { name: 'title', label: 'Step title' },
    { name: 'desc',  label: 'Description', type: 'textarea' },
  ],
  social: [
    { name: 'name', label: 'Platform name' },
    { name: 'url',  label: 'URL' },
    { name: 'icon', label: 'Icon', placeholder: 'linkedin, github, twitter, instagram, youtube' },
  ],
  quick_question: [
    { name: 'label',    label: 'Button label', placeholder: 'Pricing?' },
    { name: 'question', label: 'Full question to send' },
  ],
  typewriter:  [{ name: 'text', label: 'Phrase' }],
  stat:        [
    { name: 'value',  label: 'Number', type: 'number' },
    { name: 'suffix', label: 'Suffix (e.g. +, %)' },
    { name: 'label',  label: 'Label' },
  ],
  about_para:  [{ name: 'text', label: 'Paragraph', type: 'textarea' }],
  skill:       [{ name: 'name', label: 'Skill' }],
};

const ITEM_LABELS = {
  service: { single: 'Service', titleField: 'title' },
  tool:    { single: 'Tool',    titleField: 'name' },
  project: { single: 'Project', titleField: 'title' },
  process: { single: 'Process step', titleField: 'title' },
  social:  { single: 'Social link', titleField: 'name' },
  quick_question: { single: 'Quick question', titleField: 'label' },
  typewriter:  { single: 'Phrase', titleField: 'text' },
  stat:        { single: 'Stat', titleField: 'label' },
  about_para:  { single: 'Paragraph', titleField: 'text' },
  skill:       { single: 'Skill', titleField: 'name' },
};

// ─── Render sidebar ─────────────────────────────────────────
function renderSidebar() {
  const nav = $('#sidebarNav');
  nav.innerHTML = '';
  let lastGroup = null;
  for (const s of SECTIONS) {
    if (s.group !== lastGroup) {
      nav.appendChild(h('div', { class: 'sidebar__group' }, s.group));
      lastGroup = s.group;
    }
    const btn = h('button', {
      class: 'nav-item' + (s.id === state.currentSection ? ' active' : ''),
      onclick: () => navigate(s.id),
    }, h('span', {}, s.icon), s.label);
    nav.appendChild(btn);
  }
}

function navigate(id) {
  state.currentSection = id;
  renderSidebar();
  renderPage();
}

// ─── Render page ────────────────────────────────────────────
function renderPage() {
  const sec = SECTIONS.find(s => s.id === state.currentSection);
  if (!sec) return;
  $('#pageTitle').textContent = sec.label;
  $('#topActions').innerHTML = '';
  const c = $('#content');
  c.innerHTML = '';
  c.appendChild(h('div', { class: 'page-title' }, sec.label));
  if (sec.description) c.appendChild(h('div', { class: 'page-sub' }, sec.description));

  if (sec.kind === 'setting') renderSetting(sec, c);
  else if (sec.kind === 'items') renderItems(sec.type, c);
  else if (sec.kind === 'theme') renderTheme(c);
  else if (sec.kind === 'submissions') renderSubmissions(c);
  else if (sec.kind === 'chats') renderChats(c);
  else if (sec.kind === 'analytics') renderAnalytics(c);

  if (sec.extras) {
    for (const t of sec.extras) {
      const wrap = h('div');
      wrap.appendChild(h('div', { class: 'page-title', style: 'margin-top:32px;font-size:1.1rem' }, ITEM_LABELS[t].single + 's'));
      c.appendChild(wrap);
      renderItems(t, c);
    }
  }
}

// ─── Setting form ───────────────────────────────────────────
function renderSetting(sec, c) {
  const data = { ...(state.settings[sec.key] || {}) };
  const card = h('div', { class: 'card' });
  card.appendChild(h('h3', {}, sec.label + ' fields'));

  for (const f of sec.fields) {
    const row = h('div', { class: 'row full' });
    if (f.type === 'checkbox') {
      const wrap = h('label', { class: 'checkbox' });
      const input = h('input', { type: 'checkbox', checked: !!data[f.name] });
      input.addEventListener('change', () => data[f.name] = input.checked);
      wrap.append(input, document.createTextNode(' ' + f.label));
      row.appendChild(wrap);
    } else if (f.type === 'textarea') {
      const lab = h('label', {});
      lab.appendChild(h('span', {}, f.label));
      const ta = h('textarea', {}, data[f.name] || '');
      ta.addEventListener('input', () => data[f.name] = ta.value);
      lab.appendChild(ta);
      row.appendChild(lab);
    } else {
      const lab = h('label', {});
      lab.appendChild(h('span', {}, f.label));
      const inp = h('input', { type: f.type || 'text', value: data[f.name] || '', placeholder: f.placeholder || '' });
      inp.addEventListener('input', () => data[f.name] = inp.value);
      lab.appendChild(inp);
      row.appendChild(lab);
    }
    card.appendChild(row);
  }

  const save = h('button', { class: 'btn btn-primary', onclick: async () => {
    save.disabled = true; save.textContent = 'Saving...';
    try {
      await api('/api/admin/setting/' + sec.key, { method: 'PUT', body: JSON.stringify(data) });
      state.settings[sec.key] = data;
      toast('Saved', 'success');
    } catch (e) { toast(e.message, 'error'); }
    save.disabled = false; save.textContent = '💾 Save';
  }}, '💾 Save');
  card.appendChild(save);
  c.appendChild(card);
}

// ─── Items list (services, projects, etc.) ──────────────────
function renderItems(type, c) {
  const items = state.items[type] || [];
  const fields = ITEM_FIELDS[type] || [];
  const titleField = ITEM_LABELS[type]?.titleField || fields[0]?.name;
  const single = ITEM_LABELS[type]?.single || type;

  const list = h('div', { class: 'item-list' });

  items.forEach((item, idx) => {
    const elItem = h('div', { class: 'item', draggable: 'true', 'data-id': item.id });
    elItem.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item.id);
      elItem.classList.add('dragging');
    });
    elItem.addEventListener('dragend', () => elItem.classList.remove('dragging'));
    elItem.addEventListener('dragover', e => e.preventDefault());
    elItem.addEventListener('drop', async e => {
      e.preventDefault();
      const dragId = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (dragId === item.id) return;
      const arr = state.items[type];
      const fromIdx = arr.findIndex(x => x.id === dragId);
      const toIdx   = arr.findIndex(x => x.id === item.id);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      try {
        await api('/api/admin/reorder', { method: 'POST', body: JSON.stringify({ type, ids: arr.map(x => x.id) }) });
        toast('Reordered', 'success');
        renderPage();
      } catch (err) { toast(err.message, 'error'); }
    });

    const titleText = item[titleField] || '(untitled)';
    const subText = fields.find(f => f.name === 'desc')
      ? (item.desc || '').slice(0, 80) + (item.desc?.length > 80 ? '…' : '')
      : '';

    elItem.appendChild(h('span', { class: 'item__drag' }, '⋮⋮'));
    const titleBox = h('div');
    titleBox.appendChild(h('div', { class: 'item__title' }, titleText));
    if (subText) titleBox.appendChild(h('div', { class: 'item__sub' }, subText));
    elItem.appendChild(titleBox);

    const actions = h('div', { class: 'item__actions' });
    actions.appendChild(h('button', { class: 'btn btn-secondary btn-small', onclick: () => editItem(type, item) }, 'Edit'));
    actions.appendChild(h('button', { class: 'btn btn-danger btn-small', onclick: async () => {
      if (!confirm('Delete this ' + single.toLowerCase() + '?')) return;
      try {
        await api('/api/admin/items/' + item.id, { method: 'DELETE' });
        await loadContent();
        renderPage();
        toast('Deleted', 'success');
      } catch (e) { toast(e.message, 'error'); }
    }}, 'Delete'));
    elItem.appendChild(actions);
    list.appendChild(elItem);
  });

  if (!items.length) list.appendChild(h('div', { class: 'empty' }, 'No ' + single.toLowerCase() + 's yet. Click + Add below.'));

  c.appendChild(list);
  c.appendChild(h('button', {
    class: 'btn btn-primary',
    style: 'margin-top:14px',
    onclick: () => editItem(type, null),
  }, '+ Add ' + single));
}

// ─── Edit / create item modal ───────────────────────────────
function editItem(type, item) {
  const fields = ITEM_FIELDS[type] || [];
  const isNew  = !item;
  const data   = item ? { ...item } : {};

  const overlay = h('div', { class: 'preview-overlay open', style: 'background:rgba(15,23,42,.5)' });
  const form = h('div', { class: 'card', style: 'width:520px;max-width:90vw;max-height:90vh;overflow-y:auto;background:#fff' });
  form.appendChild(h('h3', {}, (isNew ? 'New ' : 'Edit ') + (ITEM_LABELS[type]?.single || type)));

  for (const f of fields) {
    const lab = h('label', {});
    lab.appendChild(h('span', {}, f.label));
    let input;
    if (f.type === 'textarea') {
      input = h('textarea', { rows: 3 }, data[f.name] || '');
      input.addEventListener('input', () => data[f.name] = input.value);
    } else if (f.type === 'tags') {
      input = renderTagsInput(data, f.name);
    } else if (f.type === 'image') {
      input = renderImageInput(data, f.name);
    } else {
      input = h('input', { type: f.type || 'text', value: data[f.name] ?? '', placeholder: f.placeholder || '' });
      input.addEventListener('input', () => {
        data[f.name] = f.type === 'number' ? parseFloat(input.value) || 0 : input.value;
      });
    }
    lab.appendChild(input);
    form.appendChild(lab);
    form.appendChild(h('div', { style: 'height:10px' }));
  }

  const actions = h('div', { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:18px' });
  actions.appendChild(h('button', { class: 'btn btn-secondary', onclick: () => overlay.remove() }, 'Cancel'));
  actions.appendChild(h('button', { class: 'btn btn-primary', onclick: async () => {
    try {
      // Strip internal fields
      const payload = { ...data };
      delete payload.id; delete payload.position;
      if (isNew) {
        await api('/api/admin/items', { method: 'POST', body: JSON.stringify({ type, data: payload }) });
      } else {
        await api('/api/admin/items/' + item.id, { method: 'PUT', body: JSON.stringify({ data: payload }) });
      }
      await loadContent();
      overlay.remove();
      renderPage();
      toast(isNew ? 'Created' : 'Saved', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }}, 'Save'));
  form.appendChild(actions);

  overlay.appendChild(form);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ─── Tags input ─────────────────────────────────────────────
function renderTagsInput(data, key) {
  data[key] = data[key] || [];
  const wrap = h('div', { class: 'tags-input' });
  const refresh = () => {
    wrap.innerHTML = '';
    data[key].forEach((tag, i) => {
      const t = h('span', { class: 'tag' }, tag,
        h('button', { onclick: () => { data[key].splice(i,1); refresh(); } }, '×')
      );
      wrap.appendChild(t);
    });
    const inp = h('input', { type: 'text', placeholder: 'Type tag, press Enter' });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && inp.value.trim()) {
        e.preventDefault();
        data[key].push(inp.value.trim());
        refresh();
      }
    });
    wrap.appendChild(inp);
    inp.focus();
  };
  refresh();
  return wrap;
}

// ─── Image upload input ─────────────────────────────────────
function renderImageInput(data, key) {
  const wrap = h('div');
  const preview = h('div', { style: 'margin-bottom:8px' });
  const update = () => {
    preview.innerHTML = '';
    if (data[key]) {
      preview.appendChild(h('img', { src: data[key], style: 'max-width:200px;border-radius:6px;border:1px solid var(--border)' }));
    }
  };
  update();

  const input = h('input', { type: 'text', value: data[key] || '', placeholder: 'Image URL or upload below' });
  input.addEventListener('input', () => { data[key] = input.value; update(); });

  const fileBtn = h('input', { type: 'file', accept: 'image/*' });
  fileBtn.addEventListener('change', async () => {
    const file = fileBtn.files[0];
    if (!file) return;
    try {
      const res = await fetch(API + '/api/admin/upload', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': file.type }, body: file,
      });
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      data[key] = j.url;
      input.value = j.url;
      update();
      toast('Uploaded', 'success');
    } catch (e) { toast('Upload failed: ' + e.message, 'error'); }
  });

  wrap.append(preview, input, h('div', { style: 'height:8px' }), fileBtn);
  return wrap;
}

// ─── Theme editor ───────────────────────────────────────────
function renderTheme(c) {
  const data = { ...(state.settings.theme || {}) };
  const card = h('div', { class: 'card' });
  card.appendChild(h('h3', {}, 'Site theme'));

  const colorFields = [
    { name: 'accent',  label: 'Primary accent' },
    { name: 'accent2', label: 'Secondary accent' },
    { name: 'bg',      label: 'Background' },
    { name: 'text',    label: 'Text' },
    { name: 'muted',   label: 'Muted text' },
    { name: 'border',  label: 'Border' },
  ];

  for (const f of colorFields) {
    const row = h('label', { class: 'row full' });
    row.appendChild(h('span', {}, f.label));
    const cr = h('div', { class: 'color-row' });
    const colorInp = h('input', { type: 'color', value: data[f.name] || '#000000' });
    const textInp = h('input', { type: 'text', value: data[f.name] || '' });
    colorInp.addEventListener('input', () => { data[f.name] = colorInp.value; textInp.value = colorInp.value; });
    textInp.addEventListener('input',  () => { data[f.name] = textInp.value;  if (/^#[0-9a-f]{6}$/i.test(textInp.value)) colorInp.value = textInp.value; });
    cr.append(colorInp, textInp);
    row.appendChild(cr);
    card.appendChild(row);
  }

  card.appendChild(h('button', { class: 'btn btn-primary', style: 'margin-top:14px', onclick: async () => {
    try {
      await api('/api/admin/setting/theme', { method: 'PUT', body: JSON.stringify(data) });
      state.settings.theme = data;
      toast('Theme saved', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }}, '💾 Save Theme'));
  c.appendChild(card);
}

// ─── Submissions ────────────────────────────────────────────
async function renderSubmissions(c) {
  c.appendChild(h('div', { class: 'loading' }, h('div', { class: 'spinner' })));
  try {
    const rows = await api('/api/admin/submissions');
    c.innerHTML = '';
    c.appendChild(h('div', { class: 'page-title' }, 'Contact submissions'));
    c.appendChild(h('div', { class: 'page-sub' }, rows.length + ' submissions, newest first'));
    if (!rows.length) { c.appendChild(h('div', { class: 'empty' }, 'No submissions yet.')); return; }
    const table = h('table');
    const thead = h('thead');
    thead.innerHTML = '<tr><th>Date</th><th>Name</th><th>Email</th><th>Service</th><th>Message</th><th></th></tr>';
    table.appendChild(thead);
    const tbody = h('tbody');
    for (const r of rows) {
      const tr = h('tr');
      tr.append(
        h('td', {}, new Date(r.created_at * 1000).toLocaleString()),
        h('td', {}, r.name || '-'),
        h('td', {}, h('a', { href: 'mailto:' + r.email }, r.email || '-')),
        h('td', {}, r.service || '-'),
        h('td', { style:'max-width:280px' }, (r.message || '').slice(0, 120) + (r.message?.length > 120 ? '…' : '')),
        h('td', {}, h('button', { class: 'btn btn-danger btn-small', onclick: async () => {
          if (!confirm('Delete?')) return;
          await api('/api/admin/submissions/' + r.id, { method: 'DELETE' });
          renderPage();
        }}, 'Delete')),
      );
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    c.appendChild(table);
  } catch (e) { c.innerHTML = ''; c.appendChild(h('div', { class: 'empty' }, 'Error: ' + e.message)); }
}

// ─── Chat logs ──────────────────────────────────────────────
async function renderChats(c) {
  c.appendChild(h('div', { class: 'loading' }, h('div', { class: 'spinner' })));
  try {
    const rows = await api('/api/admin/chats');
    c.innerHTML = '';
    c.appendChild(h('div', { class: 'page-title' }, 'AI chat logs'));
    c.appendChild(h('div', { class: 'page-sub' }, rows.length + ' messages logged'));
    if (!rows.length) { c.appendChild(h('div', { class: 'empty' }, 'No chats yet.')); return; }
    for (const r of rows) {
      const card = h('div', { class: 'card' });
      card.appendChild(h('div', { style: 'color:var(--muted);font-size:.78rem;margin-bottom:8px' }, new Date(r.created_at * 1000).toLocaleString() + ' · ' + (r.ip || '')));
      card.appendChild(h('div', { style: 'background:#eff6ff;padding:10px;border-radius:6px;margin-bottom:6px' }, h('b', {}, '👤 '), r.user_message));
      card.appendChild(h('div', { style: 'background:#f8fafc;padding:10px;border-radius:6px' }, h('b', {}, '🤖 '), r.ai_response));
      c.appendChild(card);
    }
  } catch (e) { c.innerHTML = ''; c.appendChild(h('div', { class: 'empty' }, 'Error: ' + e.message)); }
}

// ─── Analytics ──────────────────────────────────────────────
async function renderAnalytics(c) {
  c.appendChild(h('div', { class: 'loading' }, h('div', { class: 'spinner' })));
  try {
    const a = await api('/api/admin/analytics');
    c.innerHTML = '';
    c.appendChild(h('div', { class: 'page-title' }, 'Analytics — last 30 days'));

    const grid = h('div', { class: 'stat-grid' });
    grid.appendChild(h('div', { class: 'stat-box' }, h('div', { class: 'l' }, 'Total views'), h('div', { class: 'v' }, a.total)));
    const mob = a.byDevice.find(d => d.device === 'mobile')?.c || 0;
    const desk = a.byDevice.find(d => d.device === 'desktop')?.c || 0;
    grid.appendChild(h('div', { class: 'stat-box' }, h('div', { class: 'l' }, 'Mobile'), h('div', { class: 'v' }, mob)));
    grid.appendChild(h('div', { class: 'stat-box' }, h('div', { class: 'l' }, 'Desktop'), h('div', { class: 'v' }, desk)));
    c.appendChild(grid);

    if (a.byPath.length) {
      const card = h('div', { class: 'card' });
      card.appendChild(h('h3', {}, 'Top pages'));
      const table = h('table');
      table.innerHTML = '<thead><tr><th>Path</th><th style="text-align:right">Views</th></tr></thead>';
      const tb = h('tbody');
      for (const r of a.byPath) {
        tb.appendChild(h('tr', {}, h('td', {}, r.path), h('td', { style:'text-align:right' }, r.c)));
      }
      table.appendChild(tb);
      card.appendChild(table);
      c.appendChild(card);
    }

    if (a.byCountry.length) {
      const card = h('div', { class: 'card' });
      card.appendChild(h('h3', {}, 'Top countries'));
      const table = h('table');
      table.innerHTML = '<thead><tr><th>Country</th><th style="text-align:right">Views</th></tr></thead>';
      const tb = h('tbody');
      for (const r of a.byCountry) {
        tb.appendChild(h('tr', {}, h('td', {}, r.country), h('td', { style:'text-align:right' }, r.c)));
      }
      table.appendChild(tb);
      card.appendChild(table);
      c.appendChild(card);
    }
  } catch (e) { c.innerHTML = ''; c.appendChild(h('div', { class: 'empty' }, 'Error: ' + e.message)); }
}

// ─── Preview overlay ────────────────────────────────────────
$('#btnPreview').addEventListener('click', () => {
  $('#previewFrame').src = FRONTEND_URL + '?_=' + Date.now();
  $('#previewOverlay').classList.add('open');
});
document.querySelectorAll('.preview-head__device button[data-d]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preview-head__device button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $('#previewWrap').className = 'preview-iframe-wrap ' + btn.dataset.d;
  });
});

// ─── Init ───────────────────────────────────────────────────
(async function init() {
  try {
    const me = await api('/auth/me');
    if (!me) { location.href = '/auth/login'; return; }
    $('#userName').textContent = me.name || me.user;
    $('#userAvatar').src = me.avatar;
    await loadContent();
    renderSidebar();
    renderPage();
  } catch (e) {
    $('#content').innerHTML = '<div class="empty">Failed to load: ' + e.message + '</div>';
  }
})();
</script>
</body></html>`;
