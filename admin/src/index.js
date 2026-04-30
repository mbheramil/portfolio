/**
 * admin.mbheramil.com — Cloudflare Worker
 * Bindings: DB (D1), IMAGES (R2), SESSIONS (KV), AI (Workers AI)
 * Secrets: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ALLOWED_GITHUB_USER, SESSION_SECRET
 */

import { dashboardHTML, dashboardJS } from './dashboard.html.js';

const ALLOWED_ORIGINS = [
  'https://mbheramil.com',
  'https://www.mbheramil.com',
  'https://admin.mbheramil.com',
  'http://localhost:8788',
  'http://localhost:8787',
  'http://127.0.0.1:5500',
];
const SITE_ORIGIN = 'https://mbheramil.com';

// ─── Helpers ───────────────────────────────────────────────
const json = (data, init = {}) => new Response(JSON.stringify(data), {
  status: init.status || 200,
  headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
});
const text = (body, init = {}) => new Response(body, {
  status: init.status || 200,
  headers: { 'Content-Type': 'text/plain; charset=utf-8', ...(init.headers || {}) },
});
const xml = (body) => new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
const html = (body) => new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}
function withCors(res, origin) {
  const headers = new Headers(res.headers);
  Object.entries(corsHeaders(origin)).forEach(([k, v]) => headers.set(k, v));
  return new Response(res.body, { status: res.status, headers });
}
function getCookie(req, name) {
  const c = req.headers.get('Cookie') || '';
  const m = c.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookieHeader(name, value, opts = {}) {
  const p = [`${name}=${encodeURIComponent(value)}`];
  if (opts.maxAge !== undefined) p.push(`Max-Age=${opts.maxAge}`);
  p.push('Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax');
  return p.join('; ');
}
const slugify = (s) => (s || '').toString().toLowerCase().trim()
  .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const escapeHTML = (s) => (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function requireAuth(req, env) {
  const sid = getCookie(req, 'sid');
  if (!sid) return null;
  const session = await env.SESSIONS.get('sess:' + sid, 'json');
  if (!session || session.user !== env.ALLOWED_GITHUB_USER) return null;
  session._sid = sid;
  return session;
}

// ─── Rate limiting ─────────────────────────────────────────
async function rateLimit(env, key, max, windowSec) {
  const now = Math.floor(Date.now() / 1000);
  const bucket = `rl:${key}:${Math.floor(now / windowSec)}`;
  const cur = parseInt((await env.SESSIONS.get(bucket)) || '0', 10);
  if (cur >= max) return false;
  await env.SESSIONS.put(bucket, String(cur + 1), { expirationTtl: windowSec * 2 });
  return true;
}

// ─── Audit log ─────────────────────────────────────────────
async function audit(env, user, action, resource, diff, req) {
  const ip = req?.headers.get('CF-Connecting-IP') || '';
  await env.DB.prepare(
    'INSERT INTO audit_log (user, action, resource, diff, ip) VALUES (?, ?, ?, ?, ?)'
  ).bind(user || '', action, resource, diff ? JSON.stringify(diff).slice(0, 4000) : null, ip).run().catch(() => {});
}

// ─── GitHub OAuth ──────────────────────────────────────────
async function githubLogin(req, env) {
  const url = new URL(req.url);
  const state = crypto.randomUUID();
  await env.SESSIONS.put('oauth:' + state, '1', { expirationTtl: 600 });
  const auth = new URL('https://github.com/login/oauth/authorize');
  auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  auth.searchParams.set('redirect_uri', `${url.origin}/auth/callback`);
  auth.searchParams.set('scope', 'read:user');
  auth.searchParams.set('state', state);
  return Response.redirect(auth.toString(), 302);
}

async function githubCallback(req, env) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return new Response('Missing code/state', { status: 400 });
  const stored = await env.SESSIONS.get('oauth:' + state);
  if (!stored) return new Response('Invalid state', { status: 400 });
  await env.SESSIONS.delete('oauth:' + state);

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/auth/callback`,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return new Response('OAuth failed', { status: 400 });

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': 'Bearer ' + tokenData.access_token,
      'User-Agent': 'mbheramil-admin',
      'Accept': 'application/vnd.github+json',
    },
  });
  const user = await userRes.json();
  if (user.login !== env.ALLOWED_GITHUB_USER) {
    return new Response(`Forbidden: ${user.login} not authorised`, { status: 403 });
  }

  const sid = crypto.randomUUID();
  await env.SESSIONS.put('sess:' + sid, JSON.stringify({
    user: user.login, avatar: user.avatar_url, name: user.name, iat: Date.now(),
    ua: req.headers.get('User-Agent') || '', ip: req.headers.get('CF-Connecting-IP') || '',
  }), { expirationTtl: 60 * 60 * 24 * 30 });

  await audit(env, user.login, 'login', 'auth', null, req);

  return new Response(null, {
    status: 302,
    headers: { 'Location': '/', 'Set-Cookie': setCookieHeader('sid', sid, { maxAge: 60 * 60 * 24 * 30 }) },
  });
}

async function logout(req, env) {
  const sid = getCookie(req, 'sid');
  if (sid) await env.SESSIONS.delete('sess:' + sid);
  return new Response(null, {
    status: 302,
    headers: { 'Location': '/', 'Set-Cookie': setCookieHeader('sid', '', { maxAge: 0 }) },
  });
}

// ─── Public content ────────────────────────────────────────
async function getAllContent(env) {
  const settingsRows = await env.DB.prepare('SELECT key, value FROM settings').all();
  const now = Math.floor(Date.now() / 1000);
  // Filter scheduled items
  const itemsRows = await env.DB.prepare(
    "SELECT id, type, position, data FROM items WHERE COALESCE(CAST(json_extract(data,'$.publishAt') AS INTEGER), 0) <= ? ORDER BY type, position"
  ).bind(now).all();

  const settings = {};
  for (const r of settingsRows.results) {
    try { settings[r.key] = JSON.parse(r.value); } catch { settings[r.key] = r.value; }
  }
  delete settings.admin;
  delete settings.ai_prompt;

  const items = {};
  for (const r of itemsRows.results) {
    if (!items[r.type]) items[r.type] = [];
    let data;
    try { data = JSON.parse(r.data); } catch { data = {}; }
    items[r.type].push({ id: r.id, position: r.position, ...data });
  }
  return { settings, items };
}

async function getSetting(env, key) {
  const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
  if (!row) return null;
  try { return JSON.parse(row.value); } catch { return row.value; }
}

// ─── Submissions ───────────────────────────────────────────
async function submitContact(req, env) {
  const ip = req.headers.get('CF-Connecting-IP') || '';
  if (!await rateLimit(env, 'contact:' + ip, 5, 3600)) {
    return json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }
  const body = await req.json();
  if (body.website || body._hp) return json({ ok: true }); // honeypot
  if (!body.email || !body.message) return json({ error: 'email and message required' }, { status: 400 });

  const ua = req.headers.get('User-Agent') || '';
  const result = await env.DB.prepare(
    'INSERT INTO submissions (name, email, service, message, ip, ua) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(body.name || '', body.email, body.service || '', body.message, ip, ua).run();

  notifyContactSubmission(env, { id: result.meta.last_row_id, ...body, ip }).catch(() => {});
  return json({ ok: true });
}

async function notifyContactSubmission(env, sub) {
  const cfg = await getSetting(env, 'admin');
  if (!cfg?.notify_on_submit || !cfg.email) return;
  await sendEmail(env, {
    to: cfg.email,
    subject: `New contact: ${sub.name || sub.email}`,
    html: `
      <h2>New portfolio submission</h2>
      <p><b>Name:</b> ${escapeHTML(sub.name || '-')}</p>
      <p><b>Email:</b> <a href="mailto:${escapeHTML(sub.email)}">${escapeHTML(sub.email)}</a></p>
      <p><b>Service:</b> ${escapeHTML(sub.service || '-')}</p>
      <p><b>Message:</b></p><blockquote>${escapeHTML(sub.message).replace(/\n/g,'<br>')}</blockquote>
      <hr><small>IP: ${escapeHTML(sub.ip)} · <a href="https://admin.mbheramil.com/">Open dashboard</a></small>
    `,
  });
}

async function sendEmail(env, { to, subject, html }) {
  const from = 'noreply@mbheramil.com';
  const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: 'mbheramil.com' },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });
  if (!res.ok) throw new Error('mail: ' + res.status + ' ' + (await res.text()));
}

// ─── AI chat with system prompt ────────────────────────────
async function aiProxy(req, env) {
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
  if (!await rateLimit(env, 'chat:' + ip, 30, 3600)) {
    return json({ error: 'Rate limit. Please try again later.' }, { status: 429 });
  }
  const body = await req.json();
  const { messages, sessionId } = body;
  if (!Array.isArray(messages) || !messages.length) return json({ error: 'messages required' }, { status: 400 });

  const sys = await buildAiContext(env);
  const fullMessages = [{ role: 'system', content: sys }, ...messages.filter(m => m.role !== 'system')];

  try {
    const cfg = await getSetting(env, 'ai_prompt');
    const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: fullMessages,
      max_tokens: 350,
      temperature: cfg?.temperature ?? 0.7,
    });
    const reply = response.response;
    const userMsg = messages[messages.length - 1]?.content || '';
    await env.DB.prepare(
      'INSERT INTO chat_logs (session_id, user_message, ai_response, ip) VALUES (?, ?, ?, ?)'
    ).bind(sessionId || '', userMsg, reply, ip).run().catch(() => {});
    return json({ choices: [{ message: { role: 'assistant', content: reply } }] });
  } catch (err) {
    return json({ error: 'AI error: ' + err.message }, { status: 500 });
  }
}

async function buildAiContext(env) {
  const { settings, items } = await getAllContent(env);
  const cfg = await getSetting(env, 'ai_prompt');
  const tpl = cfg?.system || 'You are an assistant for {name}, a {title}.';
  const sys = tpl
    .replace(/\{name\}/g, settings.personal?.name || 'mbheramil')
    .replace(/\{title\}/g, settings.personal?.title || 'developer');
  const services = (items.service || []).map(s => `- ${s.title}: ${s.desc || ''}`).join('\n');
  const tools = (items.tool || []).map(t => t.name).join(', ');
  const projects = (items.project || []).slice(0, 6)
    .map(p => `- ${p.title} (${p.category || ''}): ${p.desc || ''}`).join('\n');
  return `${sys}

## Services I offer:
${services}

## Tech I use:
${tools}

## Recent projects:
${projects}

## Contact:
Email: ${settings.personal?.email || ''}
For pricing or scope, encourage visitors to use the contact form on the site.`;
}

// ─── AI assist (improve text, generate from URL) ───────────
async function aiAssist(req, env, mode) {
  const body = await req.json();
  let messages;
  if (mode === 'improve') {
    const { text, label } = body;
    if (!text) return json({ error: 'text required' }, { status: 400 });
    messages = [
      { role: 'system', content: 'You are a copywriter. Improve the text below — keep the same meaning but make it sharper, friendlier, more concise. Reply with ONLY the improved text, no preamble, no quotes.' },
      { role: 'user', content: `Field: ${label || 'text'}\n\nOriginal:\n${text}` },
    ];
  } else if (mode === 'project') {
    const { url } = body;
    if (!url) return json({ error: 'url required' }, { status: 400 });
    let pageText = '';
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'mbheramil-bot/1.0' } });
      const t = await r.text();
      pageText = t.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 3000);
    } catch { pageText = '(could not fetch)'; }
    messages = [
      { role: 'system', content: 'You generate portfolio project entries. Reply ONLY with valid JSON: {"title":"…","desc":"1-2 sentence summary","category":"WordPress|SEO|AI|Shopify|Wix|Plugin|Web","tags":["tag1","tag2","tag3"]}. No preamble, no markdown.' },
      { role: 'user', content: `URL: ${url}\nPage content:\n${pageText}` },
    ];
  } else {
    return json({ error: 'unknown mode' }, { status: 400 });
  }
  const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', { messages, max_tokens: 500 });
  const out = response.response.trim();
  if (mode === 'project') {
    const m = out.match(/\{[\s\S]*\}/);
    if (m) { try { return json(JSON.parse(m[0])); } catch {} }
    return json({ error: 'AI returned invalid JSON', raw: out }, { status: 500 });
  }
  return json({ text: out });
}

// ─── Analytics ─────────────────────────────────────────────
async function trackPageview(req, env) {
  const body = await req.json().catch(() => ({}));
  const ua = req.headers.get('User-Agent') || '';
  const country = req.cf?.country || '';
  const device = body.device || (/mobile/i.test(ua) ? 'mobile' : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop');
  await env.DB.prepare(
    'INSERT INTO pageviews (path, referrer, ua, country, device) VALUES (?, ?, ?, ?, ?)'
  ).bind(body.path || '/', body.referrer || '', ua, country, device).run();
  return json({ ok: true });
}

async function getAnalytics(env) {
  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
  const total = await env.DB.prepare('SELECT COUNT(*) AS c FROM pageviews WHERE created_at >= ?').bind(since).first();
  const byDay = await env.DB.prepare("SELECT strftime('%Y-%m-%d', created_at, 'unixepoch') AS day, COUNT(*) AS c FROM pageviews WHERE created_at >= ? GROUP BY day ORDER BY day").bind(since).all();
  const byPath = await env.DB.prepare('SELECT path, COUNT(*) AS c FROM pageviews WHERE created_at >= ? GROUP BY path ORDER BY c DESC LIMIT 10').bind(since).all();
  const byDevice = await env.DB.prepare('SELECT device, COUNT(*) AS c FROM pageviews WHERE created_at >= ? GROUP BY device').bind(since).all();
  const byCountry = await env.DB.prepare("SELECT country, COUNT(*) AS c FROM pageviews WHERE created_at >= ? AND country != '' GROUP BY country ORDER BY c DESC LIMIT 10").bind(since).all();
  return json({ total: total.c, byDay: byDay.results, byPath: byPath.results, byDevice: byDevice.results, byCountry: byCountry.results });
}

// ─── Image uploads ─────────────────────────────────────────
async function uploadImage(req, env) {
  const ct = req.headers.get('Content-Type') || '';
  if (!ct.startsWith('image/')) return json({ error: 'must be image' }, { status: 400 });
  const ext = ct.split('/')[1].split(';')[0].replace('jpeg', 'jpg');
  const key = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  await env.IMAGES.put(key, req.body, { httpMetadata: { contentType: ct } });
  return json({ url: `https://admin.mbheramil.com/img/${key}`, key });
}

async function serveImage(env, key) {
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('etag', obj.httpEtag);
  return new Response(obj.body, { headers });
}

// ─── Posts (blog) ──────────────────────────────────────────
async function listPosts(env, includeDrafts = false) {
  const now = Math.floor(Date.now() / 1000);
  const rows = includeDrafts
    ? await env.DB.prepare('SELECT * FROM posts ORDER BY COALESCE(publish_at, created_at) DESC').all()
    : await env.DB.prepare("SELECT * FROM posts WHERE status='published' AND (publish_at IS NULL OR publish_at <= ?) ORDER BY COALESCE(publish_at, created_at) DESC LIMIT 50").bind(now).all();
  return rows.results.map(p => ({
    id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, cover: p.cover,
    tags: p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    status: p.status, publish_at: p.publish_at, created_at: p.created_at,
    body_md: p.body_md,
  }));
}

async function getPost(env, slug) {
  const row = await env.DB.prepare("SELECT * FROM posts WHERE slug=? AND status='published'").bind(slug).first();
  if (!row) return null;
  const now = Math.floor(Date.now() / 1000);
  if (row.publish_at && row.publish_at > now) return null;
  return { ...row, tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
}

function md(s) {
  if (!s) return '';
  let out = escapeHTML(s);
  out = out.replace(/```([\s\S]*?)```/g, (_, c) => `<pre><code>${c.trim()}</code></pre>`);
  out = out.replace(/^### (.+)$/gm, '<h3>$1</h3>')
           .replace(/^## (.+)$/gm, '<h2>$1</h2>')
           .replace(/^# (.+)$/gm, '<h1>$1</h1>');
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
           .replace(/\*(.+?)\*/g, '<em>$1</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  out = out.replace(/(^- .+(?:\n- .+)*)/gm, m => '<ul>' + m.split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('') + '</ul>');
  out = out.split(/\n{2,}/).map(p => /^<(h\d|ul|pre|blockquote)/.test(p) ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
  return out;
}

// ─── Newsletter ────────────────────────────────────────────
async function newsletterSubscribe(req, env) {
  const ip = req.headers.get('CF-Connecting-IP') || '';
  if (!await rateLimit(env, 'news:' + ip, 5, 3600)) return json({ error: 'rate limit' }, { status: 429 });
  const body = await req.json();
  const email = (body.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'invalid email' }, { status: 400 });
  await env.DB.prepare(
    "INSERT INTO subscribers (email, source, ip) VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET status='active'"
  ).bind(email, body.source || 'site', ip).run();
  return json({ ok: true });
}

// ─── Sitemap / Robots / RSS ────────────────────────────────
async function sitemapXml(env) {
  const posts = await listPosts(env);
  const urls = [`${SITE_ORIGIN}/`, `${SITE_ORIGIN}/blog.html`, ...posts.map(p => `${SITE_ORIGIN}/blog.html?p=${p.slug}`)];
  return xml(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`);
}

function robotsTxt() {
  return text(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${SITE_ORIGIN}/sitemap.xml
`);
}

async function rssXml(env) {
  const posts = await listPosts(env);
  const { settings } = await getAllContent(env);
  const siteTitle = settings.seo?.title || settings.personal?.name || 'mbheramil.com';
  const items = posts.slice(0, 20).map(p => `
    <item>
      <title>${escapeHTML(p.title)}</title>
      <link>${SITE_ORIGIN}/blog.html?p=${p.slug}</link>
      <guid>${SITE_ORIGIN}/blog.html?p=${p.slug}</guid>
      <pubDate>${new Date((p.publish_at || p.created_at) * 1000).toUTCString()}</pubDate>
      <description>${escapeHTML(p.excerpt || '')}</description>
    </item>`).join('');
  return xml(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${escapeHTML(siteTitle)}</title>
<link>${SITE_ORIGIN}</link>
<description>${escapeHTML(settings.seo?.description || '')}</description>
${items}
</channel></rss>`);
}

// ─── Cron daily digest ─────────────────────────────────────
async function dailyDigest(env) {
  const cfg = await getSetting(env, 'admin');
  if (!cfg?.notify_daily_digest || !cfg.email) return;

  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24;
  const subs = await env.DB.prepare('SELECT COUNT(*) AS c FROM submissions WHERE created_at >= ?').bind(since).first();
  const chats = await env.DB.prepare('SELECT COUNT(*) AS c FROM chat_logs WHERE created_at >= ?').bind(since).first();
  const views = await env.DB.prepare('SELECT COUNT(*) AS c FROM pageviews WHERE created_at >= ?').bind(since).first();
  const recent = await env.DB.prepare('SELECT * FROM submissions WHERE created_at >= ? ORDER BY created_at DESC LIMIT 5').bind(since).all();

  const subsHtml = recent.results.map(s =>
    `<li><b>${escapeHTML(s.name || s.email)}</b> — ${escapeHTML((s.message||'').slice(0,100))}</li>`
  ).join('') || '<li><i>No new submissions</i></li>';

  await sendEmail(env, {
    to: cfg.email,
    subject: `mbheramil.com — daily digest (${views.c} views)`,
    html: `<h2>Last 24 hours</h2>
      <ul>
        <li><b>${views.c}</b> page views</li>
        <li><b>${subs.c}</b> contact submissions</li>
        <li><b>${chats.c}</b> AI chat messages</li>
      </ul>
      <h3>Recent submissions</h3><ul>${subsHtml}</ul>
      <p><a href="https://admin.mbheramil.com/">Open dashboard →</a></p>`,
  }).catch(e => console.log('digest err', e.message));
}

// ─── Router ────────────────────────────────────────────────
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const path = url.pathname;

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });

    try {
      // Auth
      if (path === '/auth/login') return githubLogin(req, env);
      if (path === '/auth/callback') return githubCallback(req, env);
      if (path === '/auth/logout') return logout(req, env);
      if (path === '/auth/me') {
        const s = await requireAuth(req, env);
        return withCors(json(s ? { user: s.user, avatar: s.avatar, name: s.name } : null), origin);
      }

      // Public read
      if (path === '/api/content' && req.method === 'GET') return withCors(json(await getAllContent(env)), origin);
      if (path === '/api/posts' && req.method === 'GET') {
        const posts = await listPosts(env);
        return withCors(json(posts.map(({ body_md, ...rest }) => rest)), origin);
      }
      const postMatch = path.match(/^\/api\/posts\/([^/]+)$/);
      if (postMatch && req.method === 'GET') {
        const post = await getPost(env, postMatch[1]);
        if (!post) return withCors(json({ error: 'not found' }, { status: 404 }), origin);
        return withCors(json({ ...post, body_html: md(post.body_md) }), origin);
      }

      // Public write
      if (path === '/api/contact' && req.method === 'POST') return withCors(await submitContact(req, env), origin);
      if (path === '/api/chat' && req.method === 'POST') return withCors(await aiProxy(req, env), origin);
      if (path === '/api/track' && req.method === 'POST') return withCors(await trackPageview(req, env), origin);
      if (path === '/api/newsletter' && req.method === 'POST') return withCors(await newsletterSubscribe(req, env), origin);

      // SEO files
      if (path === '/sitemap.xml') return sitemapXml(env);
      if (path === '/robots.txt') return robotsTxt();
      if (path === '/rss.xml' || path === '/feed.xml') return rssXml(env);

      // Images
      if (path.startsWith('/img/')) return serveImage(env, decodeURIComponent(path.slice(5)));

      // Admin
      if (path.startsWith('/api/admin/')) {
        const session = await requireAuth(req, env);
        if (!session) return withCors(json({ error: 'unauthorized' }, { status: 401 }), origin);
        const u = session.user;

        const settingMatch = path.match(/^\/api\/admin\/setting\/(.+)$/);
        if (settingMatch && req.method === 'PUT') {
          const value = await req.json();
          await env.DB.prepare(
            "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime('%s','now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at"
          ).bind(settingMatch[1], JSON.stringify(value)).run();
          await audit(env, u, 'update', 'settings:' + settingMatch[1], value, req);
          return withCors(json({ ok: true }), origin);
        }

        if (path === '/api/admin/items' && req.method === 'POST') {
          const body = await req.json();
          let pos = body.position;
          if (pos === undefined) {
            const r = await env.DB.prepare('SELECT COALESCE(MAX(position), -1) + 1 AS n FROM items WHERE type=?').bind(body.type).first();
            pos = r.n;
          }
          const r = await env.DB.prepare('INSERT INTO items (type, position, data) VALUES (?,?,?)').bind(body.type, pos, JSON.stringify(body.data)).run();
          await audit(env, u, 'create', `items:${body.type}:${r.meta.last_row_id}`, body.data, req);
          return withCors(json({ id: r.meta.last_row_id }), origin);
        }
        const itemMatch = path.match(/^\/api\/admin\/items\/(\d+)$/);
        if (itemMatch) {
          const id = parseInt(itemMatch[1], 10);
          if (req.method === 'PUT') {
            const body = await req.json();
            await env.DB.prepare("UPDATE items SET data=?, updated_at=strftime('%s','now') WHERE id=?").bind(JSON.stringify(body.data), id).run();
            await audit(env, u, 'update', 'items:' + id, body.data, req);
            return withCors(json({ ok: true }), origin);
          }
          if (req.method === 'DELETE') {
            await env.DB.prepare('DELETE FROM items WHERE id=?').bind(id).run();
            await audit(env, u, 'delete', 'items:' + id, null, req);
            return withCors(json({ ok: true }), origin);
          }
        }
        if (path === '/api/admin/reorder' && req.method === 'POST') {
          const body = await req.json();
          const stmts = body.ids.map((id, idx) => env.DB.prepare('UPDATE items SET position=? WHERE id=? AND type=?').bind(idx, id, body.type));
          await env.DB.batch(stmts);
          return withCors(json({ ok: true }), origin);
        }

        if (path === '/api/admin/upload' && req.method === 'POST') return withCors(await uploadImage(req, env), origin);

        if (path === '/api/admin/submissions' && req.method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200').all();
          return withCors(json(r.results), origin);
        }
        const subDel = path.match(/^\/api\/admin\/submissions\/(\d+)$/);
        if (subDel && req.method === 'DELETE') {
          await env.DB.prepare('DELETE FROM submissions WHERE id=?').bind(parseInt(subDel[1], 10)).run();
          return withCors(json({ ok: true }), origin);
        }

        if (path === '/api/admin/chats' && req.method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM chat_logs ORDER BY created_at DESC LIMIT 500').all();
          return withCors(json(r.results), origin);
        }

        if (path === '/api/admin/analytics' && req.method === 'GET') return withCors(await getAnalytics(env), origin);

        // Posts
        if (path === '/api/admin/posts' && req.method === 'GET') return withCors(json(await listPosts(env, true)), origin);
        if (path === '/api/admin/posts' && req.method === 'POST') {
          const body = await req.json();
          const slug = body.slug || slugify(body.title);
          const r = await env.DB.prepare(
            'INSERT INTO posts (slug, title, excerpt, cover, body_md, tags, status, publish_at) VALUES (?,?,?,?,?,?,?,?)'
          ).bind(slug, body.title || '', body.excerpt || '', body.cover || '', body.body_md || '', (body.tags || []).join(','), body.status || 'draft', body.publish_at || null).run();
          await audit(env, u, 'create', 'posts:' + r.meta.last_row_id, { slug, title: body.title }, req);
          return withCors(json({ id: r.meta.last_row_id, slug }), origin);
        }
        const postEdit = path.match(/^\/api\/admin\/posts\/(\d+)$/);
        if (postEdit) {
          const id = parseInt(postEdit[1], 10);
          if (req.method === 'PUT') {
            const body = await req.json();
            await env.DB.prepare(
              "UPDATE posts SET slug=?, title=?, excerpt=?, cover=?, body_md=?, tags=?, status=?, publish_at=?, updated_at=strftime('%s','now') WHERE id=?"
            ).bind(body.slug, body.title, body.excerpt || '', body.cover || '', body.body_md || '', (body.tags || []).join(','), body.status || 'draft', body.publish_at || null, id).run();
            await audit(env, u, 'update', 'posts:' + id, { slug: body.slug }, req);
            return withCors(json({ ok: true }), origin);
          }
          if (req.method === 'DELETE') {
            await env.DB.prepare('DELETE FROM posts WHERE id=?').bind(id).run();
            await audit(env, u, 'delete', 'posts:' + id, null, req);
            return withCors(json({ ok: true }), origin);
          }
        }

        // Subscribers
        if (path === '/api/admin/subscribers' && req.method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all();
          return withCors(json(r.results), origin);
        }
        const sub2Del = path.match(/^\/api\/admin\/subscribers\/(\d+)$/);
        if (sub2Del && req.method === 'DELETE') {
          await env.DB.prepare('DELETE FROM subscribers WHERE id=?').bind(parseInt(sub2Del[1], 10)).run();
          return withCors(json({ ok: true }), origin);
        }

        // Audit log
        if (path === '/api/admin/audit' && req.method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200').all();
          return withCors(json(r.results), origin);
        }

        // Sessions
        if (path === '/api/admin/sessions' && req.method === 'GET') {
          const list = await env.SESSIONS.list({ prefix: 'sess:' });
          const out = [];
          for (const k of list.keys) {
            const s = await env.SESSIONS.get(k.name, 'json');
            if (s) out.push({ id: k.name.slice(5), user: s.user, ua: s.ua || '', ip: s.ip || '', iat: s.iat, current: k.name.slice(5) === session._sid });
          }
          return withCors(json(out), origin);
        }
        const sessDel = path.match(/^\/api\/admin\/sessions\/(.+)$/);
        if (sessDel && req.method === 'DELETE') {
          await env.SESSIONS.delete('sess:' + sessDel[1]);
          await audit(env, u, 'delete', 'session:' + sessDel[1], null, req);
          return withCors(json({ ok: true }), origin);
        }

        // Export
        if (path === '/api/admin/export' && req.method === 'GET') {
          const settings = await env.DB.prepare('SELECT * FROM settings').all();
          const items = await env.DB.prepare('SELECT * FROM items').all();
          const posts = await env.DB.prepare('SELECT * FROM posts').all();
          const subs = await env.DB.prepare('SELECT * FROM submissions').all();
          const subscribers = await env.DB.prepare('SELECT * FROM subscribers').all();
          return withCors(new Response(JSON.stringify({
            exported_at: new Date().toISOString(),
            settings: settings.results, items: items.results, posts: posts.results,
            submissions: subs.results, subscribers: subscribers.results,
          }, null, 2), {
            headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="mbheramil-export-${Date.now()}.json"` },
          }), origin);
        }

        // AI assist
        if (path === '/api/admin/ai/improve' && req.method === 'POST') return withCors(await aiAssist(req, env, 'improve'), origin);
        if (path === '/api/admin/ai/project' && req.method === 'POST') return withCors(await aiAssist(req, env, 'project'), origin);

        // Trigger digest manually
        if (path === '/api/admin/test-digest' && req.method === 'POST') {
          await dailyDigest(env);
          return withCors(json({ ok: true }), origin);
        }
      }

      if (path === '/' || path === '/index.html') {
        const session = await requireAuth(req, env);
        if (!session) return html(loginPageHTML());
        return html(dashboardHTML);
      }

      if (path === '/dashboard.js') {
        const session = await requireAuth(req, env);
        if (!session) return new Response('// unauthorized', { status: 401, headers: { 'Content-Type': 'application/javascript; charset=utf-8' } });
        return new Response(dashboardJS, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store' } });
      }

      return new Response('Not found', { status: 404 });
    } catch (err) {
      return withCors(json({ error: err.message, stack: err.stack }, { status: 500 }), origin);
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(dailyDigest(env));
  },
};

function loginPageHTML() {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sign in — mbheramil admin</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font:16px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#f8fafc;min-height:100vh;display:grid;place-items:center;color:#0f172a}
  .card{background:#fff;padding:48px 40px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.05),0 10px 40px rgba(0,0,0,.06);max-width:400px;width:90%;text-align:center}
  h1{font-size:1.5rem;margin-bottom:8px;font-weight:600}
  p{color:#64748b;margin-bottom:32px;font-size:.95rem}
  a.btn{display:inline-flex;align-items:center;gap:10px;padding:12px 24px;background:#0f172a;color:#fff;border-radius:8px;text-decoration:none;font-weight:500;transition:.2s;font-size:.95rem}
  a.btn:hover{background:#1e293b;transform:translateY(-1px)}
  svg{width:20px;height:20px}
</style></head><body>
<div class="card">
  <h1>Admin Dashboard</h1>
  <p>Sign in with GitHub to manage your portfolio.</p>
  <a class="btn" href="/auth/login">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.2.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/></svg>
    Continue with GitHub
  </a>
</div></body></html>`;
}
