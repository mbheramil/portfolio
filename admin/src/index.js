/**
 * admin.mbheramil.com — Cloudflare Worker
 * Handles: GitHub OAuth, content CRUD API, image uploads (R2),
 * contact submissions, chat logs, analytics, AI proxy, dashboard SPA.
 *
 * Bindings (set in wrangler.toml or dashboard):
 *   DB        — D1 database
 *   IMAGES    — R2 bucket
 *   SESSIONS  — KV namespace
 *   AI        — Workers AI binding
 *   GITHUB_CLIENT_ID     — secret
 *   GITHUB_CLIENT_SECRET — secret
 *   ALLOWED_GITHUB_USER  — secret (e.g. "mbheramil")
 *   SESSION_SECRET       — secret (random 32+ char string)
 */

import { dashboardHTML } from './dashboard.html.js';

const ALLOWED_ORIGINS = [
  'https://mbheramil.com',
  'https://www.mbheramil.com',
  'https://admin.mbheramil.com',
  'http://localhost:8788',
  'http://localhost:8787',
  'http://127.0.0.1:5500',
];

// ─── Helpers ───────────────────────────────────────────────
const json = (data, init = {}) => new Response(JSON.stringify(data), {
  status: init.status || 200,
  headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
});

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allow,
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
  const cookie = req.headers.get('Cookie') || '';
  const match  = cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookieHeader(name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
  parts.push('Path=/');
  parts.push('HttpOnly');
  parts.push('Secure');
  parts.push('SameSite=Lax');
  if (opts.domain) parts.push(`Domain=${opts.domain}`);
  return parts.join('; ');
}

async function requireAuth(req, env) {
  const sid = getCookie(req, 'sid');
  if (!sid) return null;
  const session = await env.SESSIONS.get('sess:' + sid, 'json');
  if (!session) return null;
  if (session.user !== env.ALLOWED_GITHUB_USER) return null;
  return session;
}

// ─── GitHub OAuth ──────────────────────────────────────────
async function githubLogin(req, env) {
  const url = new URL(req.url);
  const state = crypto.randomUUID();
  await env.SESSIONS.put('oauth:' + state, '1', { expirationTtl: 600 });
  const redirect = `${url.origin}/auth/callback`;
  const auth = new URL('https://github.com/login/oauth/authorize');
  auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  auth.searchParams.set('redirect_uri', redirect);
  auth.searchParams.set('scope', 'read:user');
  auth.searchParams.set('state', state);
  return Response.redirect(auth.toString(), 302);
}

async function githubCallback(req, env) {
  const url   = new URL(req.url);
  const code  = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return new Response('Missing code/state', { status: 400 });

  const stored = await env.SESSIONS.get('oauth:' + state);
  if (!stored) return new Response('Invalid state', { status: 400 });
  await env.SESSIONS.delete('oauth:' + state);

  // Exchange code for token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method:  'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri:  `${url.origin}/auth/callback`,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return new Response('OAuth failed: ' + JSON.stringify(tokenData), { status: 400 });
  }

  // Fetch user
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': 'Bearer ' + tokenData.access_token,
      'User-Agent':    'mbheramil-admin',
      'Accept':        'application/vnd.github+json',
    },
  });
  const user = await userRes.json();

  if (user.login !== env.ALLOWED_GITHUB_USER) {
    return new Response(`Forbidden: ${user.login} is not authorised.`, { status: 403 });
  }

  // Create session
  const sid = crypto.randomUUID();
  await env.SESSIONS.put('sess:' + sid, JSON.stringify({
    user:   user.login,
    avatar: user.avatar_url,
    name:   user.name,
    iat:    Date.now(),
  }), { expirationTtl: 60 * 60 * 24 * 30 }); // 30 days

  return new Response(null, {
    status: 302,
    headers: {
      'Location':   '/',
      'Set-Cookie': setCookieHeader('sid', sid, { maxAge: 60 * 60 * 24 * 30 }),
    },
  });
}

async function logout(req, env) {
  const sid = getCookie(req, 'sid');
  if (sid) await env.SESSIONS.delete('sess:' + sid);
  return new Response(null, {
    status: 302,
    headers: {
      'Location':   '/',
      'Set-Cookie': setCookieHeader('sid', '', { maxAge: 0 }),
    },
  });
}

// ─── Public content API ────────────────────────────────────
async function getAllContent(env) {
  const settingsRows = await env.DB.prepare('SELECT key, value FROM settings').all();
  const itemsRows    = await env.DB.prepare('SELECT id, type, position, data FROM items ORDER BY type, position').all();

  const settings = {};
  for (const r of settingsRows.results) {
    try { settings[r.key] = JSON.parse(r.value); }
    catch { settings[r.key] = r.value; }
  }

  const items = {};
  for (const r of itemsRows.results) {
    if (!items[r.type]) items[r.type] = [];
    let data;
    try { data = JSON.parse(r.data); } catch { data = {}; }
    items[r.type].push({ id: r.id, position: r.position, ...data });
  }

  return { settings, items };
}

// ─── Admin content API ─────────────────────────────────────
async function adminUpdateSetting(env, key, value) {
  await env.DB.prepare(
    'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime(\'%s\',\'now\')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at'
  ).bind(key, JSON.stringify(value)).run();
}

async function adminCreateItem(env, type, data, position) {
  if (position === undefined) {
    const row = await env.DB.prepare('SELECT COALESCE(MAX(position), -1) + 1 AS next FROM items WHERE type = ?').bind(type).first();
    position = row.next;
  }
  const result = await env.DB.prepare(
    'INSERT INTO items (type, position, data) VALUES (?, ?, ?)'
  ).bind(type, position, JSON.stringify(data)).run();
  return result.meta.last_row_id;
}

async function adminUpdateItem(env, id, data) {
  await env.DB.prepare(
    'UPDATE items SET data = ?, updated_at = strftime(\'%s\',\'now\') WHERE id = ?'
  ).bind(JSON.stringify(data), id).run();
}

async function adminDeleteItem(env, id) {
  await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(id).run();
}

async function adminReorderItems(env, type, ids) {
  const stmts = ids.map((id, idx) =>
    env.DB.prepare('UPDATE items SET position = ? WHERE id = ? AND type = ?').bind(idx, id, type)
  );
  await env.DB.batch(stmts);
}

// ─── Submissions ───────────────────────────────────────────
async function submitContact(req, env) {
  const body = await req.json();
  const ip   = req.headers.get('CF-Connecting-IP') || '';
  const ua   = req.headers.get('User-Agent') || '';
  await env.DB.prepare(
    'INSERT INTO submissions (name, email, service, message, ip, ua) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(body.name || '', body.email || '', body.service || '', body.message || '', ip, ua).run();
  return json({ ok: true });
}

// ─── AI proxy (Workers AI) ─────────────────────────────────
async function aiProxy(req, env) {
  const body = await req.json();
  const { messages, sessionId } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'messages required' }, { status: 400 });
  }
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown';

  try {
    const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages,
      max_tokens: 350,
    });
    const reply = response.response;

    // Log
    const userMsg = messages[messages.length - 1]?.content || '';
    await env.DB.prepare(
      'INSERT INTO chat_logs (session_id, user_message, ai_response, ip) VALUES (?, ?, ?, ?)'
    ).bind(sessionId || '', userMsg, reply, ip).run().catch(() => {});

    return json({ choices: [{ message: { role: 'assistant', content: reply } }] });
  } catch (err) {
    return json({ error: 'AI error: ' + err.message }, { status: 500 });
  }
}

// ─── Analytics ─────────────────────────────────────────────
async function trackPageview(req, env) {
  const body = await req.json().catch(() => ({}));
  const ua = req.headers.get('User-Agent') || '';
  const country = req.cf?.country || '';
  const device = /mobile/i.test(ua) ? 'mobile' : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';
  await env.DB.prepare(
    'INSERT INTO pageviews (path, referrer, ua, country, device) VALUES (?, ?, ?, ?, ?)'
  ).bind(body.path || '/', body.referrer || '', ua, country, device).run();
  return json({ ok: true });
}

async function getAnalytics(env) {
  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30; // last 30 days
  const total = await env.DB.prepare('SELECT COUNT(*) AS c FROM pageviews WHERE created_at >= ?').bind(since).first();
  const byDay = await env.DB.prepare(
    "SELECT strftime('%Y-%m-%d', created_at, 'unixepoch') AS day, COUNT(*) AS c FROM pageviews WHERE created_at >= ? GROUP BY day ORDER BY day"
  ).bind(since).all();
  const byPath = await env.DB.prepare(
    'SELECT path, COUNT(*) AS c FROM pageviews WHERE created_at >= ? GROUP BY path ORDER BY c DESC LIMIT 10'
  ).bind(since).all();
  const byDevice = await env.DB.prepare(
    'SELECT device, COUNT(*) AS c FROM pageviews WHERE created_at >= ? GROUP BY device'
  ).bind(since).all();
  const byCountry = await env.DB.prepare(
    'SELECT country, COUNT(*) AS c FROM pageviews WHERE created_at >= ? AND country != \'\' GROUP BY country ORDER BY c DESC LIMIT 10'
  ).bind(since).all();
  return json({
    total: total.c,
    byDay: byDay.results,
    byPath: byPath.results,
    byDevice: byDevice.results,
    byCountry: byCountry.results,
  });
}

// ─── Image uploads (R2) ────────────────────────────────────
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

// ─── Router ────────────────────────────────────────────────
export default {
  async fetch(req, env, ctx) {
    const url    = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const path   = url.pathname;

    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    try {
      // ── Auth routes ────────────────────────────────────────
      if (path === '/auth/login')    return githubLogin(req, env);
      if (path === '/auth/callback') return githubCallback(req, env);
      if (path === '/auth/logout')   return logout(req, env);
      if (path === '/auth/me') {
        const session = await requireAuth(req, env);
        return withCors(json(session ? { user: session.user, avatar: session.avatar, name: session.name } : null), origin);
      }

      // ── Public read ────────────────────────────────────────
      if (path === '/api/content' && req.method === 'GET') {
        const data = await getAllContent(env);
        return withCors(json(data), origin);
      }

      // ── Public write (rate-limited) ────────────────────────
      if (path === '/api/contact' && req.method === 'POST')   return withCors(await submitContact(req, env), origin);
      if (path === '/api/chat' && req.method === 'POST')      return withCors(await aiProxy(req, env), origin);
      if (path === '/api/track' && req.method === 'POST')     return withCors(await trackPageview(req, env), origin);

      // ── Image serving ──────────────────────────────────────
      if (path.startsWith('/img/')) {
        const key = decodeURIComponent(path.slice(5));
        return serveImage(env, key);
      }

      // ── Admin routes (require auth) ────────────────────────
      if (path.startsWith('/api/admin/')) {
        const session = await requireAuth(req, env);
        if (!session) return withCors(json({ error: 'unauthorized' }, { status: 401 }), origin);

        // POST /api/admin/setting/:key
        const settingMatch = path.match(/^\/api\/admin\/setting\/(.+)$/);
        if (settingMatch && req.method === 'PUT') {
          const value = await req.json();
          await adminUpdateSetting(env, settingMatch[1], value);
          return withCors(json({ ok: true }), origin);
        }

        // /api/admin/items?type=service  GET
        // /api/admin/items              POST { type, data, position? }
        if (path === '/api/admin/items' && req.method === 'POST') {
          const body = await req.json();
          const id = await adminCreateItem(env, body.type, body.data, body.position);
          return withCors(json({ id }), origin);
        }

        // /api/admin/items/:id  PUT/DELETE
        const itemMatch = path.match(/^\/api\/admin\/items\/(\d+)$/);
        if (itemMatch) {
          const id = parseInt(itemMatch[1], 10);
          if (req.method === 'PUT') {
            const body = await req.json();
            await adminUpdateItem(env, id, body.data);
            return withCors(json({ ok: true }), origin);
          }
          if (req.method === 'DELETE') {
            await adminDeleteItem(env, id);
            return withCors(json({ ok: true }), origin);
          }
        }

        // /api/admin/reorder  POST { type, ids: [] }
        if (path === '/api/admin/reorder' && req.method === 'POST') {
          const body = await req.json();
          await adminReorderItems(env, body.type, body.ids);
          return withCors(json({ ok: true }), origin);
        }

        // Image upload
        if (path === '/api/admin/upload' && req.method === 'POST') {
          return withCors(await uploadImage(req, env), origin);
        }

        // Submissions list
        if (path === '/api/admin/submissions' && req.method === 'GET') {
          const rows = await env.DB.prepare('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200').all();
          return withCors(json(rows.results), origin);
        }
        const subDel = path.match(/^\/api\/admin\/submissions\/(\d+)$/);
        if (subDel && req.method === 'DELETE') {
          await env.DB.prepare('DELETE FROM submissions WHERE id = ?').bind(parseInt(subDel[1], 10)).run();
          return withCors(json({ ok: true }), origin);
        }

        // Chat logs
        if (path === '/api/admin/chats' && req.method === 'GET') {
          const rows = await env.DB.prepare('SELECT * FROM chat_logs ORDER BY created_at DESC LIMIT 500').all();
          return withCors(json(rows.results), origin);
        }

        // Analytics
        if (path === '/api/admin/analytics' && req.method === 'GET') {
          return withCors(await getAnalytics(env), origin);
        }
      }

      // ── Dashboard SPA ──────────────────────────────────────
      if (path === '/' || path === '/index.html') {
        const session = await requireAuth(req, env);
        if (!session) {
          // Show login page
          return new Response(loginPageHTML(), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
        return new Response(dashboardHTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      return new Response('Not found', { status: 404 });
    } catch (err) {
      return withCors(json({ error: err.message, stack: err.stack }, { status: 500 }), origin);
    }
  },
};

// ─── Login page ────────────────────────────────────────────
function loginPageHTML() {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sign in — mbheramil admin</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0 }
  body { font: 16px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif; background:#f8fafc; min-height:100vh; display:grid; place-items:center; color:#0f172a }
  .card { background:#fff; padding:48px 40px; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,.05),0 10px 40px rgba(0,0,0,.06); max-width:400px; width:90%; text-align:center }
  h1 { font-size:1.5rem; margin-bottom:8px; font-weight:600 }
  p { color:#64748b; margin-bottom:32px; font-size:.95rem }
  a.btn { display:inline-flex; align-items:center; gap:10px; padding:12px 24px; background:#0f172a; color:#fff; border-radius:8px; text-decoration:none; font-weight:500; transition:.2s; font-size:.95rem }
  a.btn:hover { background:#1e293b; transform:translateY(-1px) }
  svg { width:20px; height:20px }
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
