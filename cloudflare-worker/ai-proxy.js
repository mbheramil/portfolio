/**
 * Cloudflare Worker — OpenAI AI Proxy for mbheramil.com
 *
 * SETUP STEPS:
 * 1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste this entire file into the editor
 * 3. Click "Save and Deploy"
 * 4. Go to the Worker → Settings → Variables → Add variable:
 *      Name:  OPENAI_API_KEY
 *      Value: (paste your OpenAI API key here — do NOT commit keys to git)
 *      ✅ Tick "Encrypt" (makes it a secret — never visible again after saving)
 * 5. Copy the worker URL (e.g. https://ai-proxy.YOUR-NAME.workers.dev)
 * 6. Paste it into js/chat.js as WORKER_URL
 *
 * SECURITY:
 * - Key is stored encrypted server-side; never exposed to browsers
 * - Only requests from mbheramil.com (and localhost for dev) are accepted
 * - Rate-limited to 30 requests per IP per minute
 */

const ALLOWED_ORIGINS = [
  'https://mbheramil.com',
  'https://www.mbheramil.com',
  'http://localhost',
  'http://127.0.0.1',
];

// Simple in-memory rate limiter (resets per Worker instance)
const rateLimitMap = new Map();
const RATE_LIMIT    = 30;   // max requests
const RATE_WINDOW   = 60000; // per 60 seconds (ms)

function checkRateLimit(ip) {
  const now  = Date.now();
  const data = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - data.start > RATE_WINDOW) {
    // Window expired — reset
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }
  if (data.count >= RATE_LIMIT) return false;

  data.count++;
  rateLimitMap.set(ip, data);
  return true;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // ── CORS preflight ─────────────────────────────────
    if (request.method === 'OPTIONS') {
      if (!ALLOWED_ORIGINS.includes(origin)) {
        return new Response('Forbidden', { status: 403 });
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // ── Only allow POST ─────────────────────────────────
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // ── Origin check ────────────────────────────────────
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    // ── Rate limit ──────────────────────────────────────
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } }
      );
    }

    // ── Parse body ──────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } }
      );
    }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } }
      );
    }

    // ── Forward to OpenAI ────────────────────────────────
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        messages,
        max_tokens:  350,
        temperature: 0.75,
      }),
    });

    const data = await openaiResp.json();

    if (!openaiResp.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || 'OpenAI error' }),
        { status: openaiResp.status, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  },
};
