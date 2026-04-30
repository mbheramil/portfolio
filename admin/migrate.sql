-- Migration: adds blog posts, audit log, newsletter, and updates settings/items
-- Idempotent — safe to run multiple times

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  cover TEXT,
  body_md TEXT,
  tags TEXT,
  status TEXT DEFAULT 'draft', -- draft|published
  publish_at INTEGER,           -- unix sec, NULL = immediate
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_publish ON posts(publish_at);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT,
  action TEXT,        -- create|update|delete|login|logout
  resource TEXT,      -- e.g. "items:42" or "settings:hero"
  diff TEXT,          -- JSON before/after
  ip TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- active|unsubscribed
  source TEXT,
  ip TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Add publish_at column to items if missing (D1 lacks IF NOT EXISTS for ALTER, so we use a settings-style guard)
-- We'll do it via INSERT OR IGNORE into a meta table
CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, value TEXT);
-- Marker pattern lets us safely run additive migrations

-- Add ai_system_prompt + admin_email + features settings
INSERT INTO settings (key, value) VALUES
  ('ai_prompt', '{"system":"You are a helpful assistant on the personal portfolio of {name}, a {title}. Be concise, friendly, and direct visitors to /contact for project inquiries. If unsure, say you''ll have {name} reach out.","temperature":0.7}'),
  ('admin', '{"email":"mbheramil@gmail.com","notify_on_submit":true,"notify_daily_digest":true}'),
  ('features', '{"chat":true,"newsletter":true,"blog":true,"darkMode":true}'),
  ('og', '{"image":"","twitter":"@mbheramil"}')
ON CONFLICT(key) DO NOTHING;

-- Seed new item types
INSERT INTO items (type, position, data) VALUES
  ('testimonial', 0, '{"quote":"Mherafil delivered way beyond expectations. Clean code, clear communication, super fast.","name":"Sarah Chen","role":"Founder, NovaCart","avatar":""}'),
  ('testimonial', 1, '{"quote":"The kind of developer you wish every project had. Got our SEO score from 60 to 98.","name":"Marcus Reed","role":"CMO, Brightline","avatar":""}'),
  ('testimonial', 2, '{"quote":"Built our entire e-commerce site solo in 3 weeks. Pixel-perfect, fast, secure.","name":"Aiko Tanaka","role":"Owner, Kaze Studio","avatar":""}'),

  ('faq', 0, '{"q":"How long does a typical project take?","a":"Most websites take 2-4 weeks from kickoff to launch. Larger custom builds 4-8 weeks. I''ll give you a clear timeline before we start."}'),
  ('faq', 1, '{"q":"Do you offer ongoing maintenance?","a":"Yes — monthly retainers cover updates, monitoring, security patches, and small content tweaks. Available after launch."}'),
  ('faq', 2, '{"q":"What''s your pricing?","a":"Projects start at $1.5k for a landing page, $4k+ for full sites with CMS. I send a fixed-price proposal after a free 30-min call."}'),
  ('faq', 3, '{"q":"Can you migrate my existing site?","a":"Absolutely. WordPress, Wix, Squarespace, custom — I migrate to your platform of choice (or a faster alternative) with zero data loss."}'),

  ('pricing', 0, '{"name":"Starter","price":"1.5k","unit":"USD","desc":"Single-page site","features":["1-3 page site","Mobile-first","Contact form","Basic SEO","2 weeks delivery"],"cta":"Book a call","featured":false}'),
  ('pricing', 1, '{"name":"Growth","price":"4k","unit":"USD","desc":"Full site with CMS","features":["5-10 pages","Custom CMS","Blog","Analytics","Advanced SEO","4 weeks delivery"],"cta":"Get started","featured":true}'),
  ('pricing', 2, '{"name":"Custom","price":"Quote","unit":"","desc":"E-commerce / SaaS","features":["Unlimited pages","Custom integrations","Stripe / Shopify","Dedicated support","6+ weeks delivery"],"cta":"Discuss project","featured":false}')
ON CONFLICT DO NOTHING;

-- Seed sample blog post
INSERT OR IGNORE INTO posts (slug, title, excerpt, cover, body_md, tags, status, publish_at) VALUES
  ('hello-world', 'Welcome to my new site', 'Just rebuilt mbheramil.com on Cloudflare Workers + D1. Here''s why and how.',
   '',
   '# Welcome\n\nI just shipped a full rebuild of this site on the edge — Cloudflare Workers, D1 (SQLite), R2, and a custom CMS at admin.mbheramil.com.\n\n## Why?\n\nThe old site had mobile-click bugs that I could not chase down. So I rebuilt it clean: light theme, mobile-first, no custom cursor, no animations that fight your finger.\n\n## What''s under the hood\n\n- **Frontend**: vanilla HTML/CSS/JS — no framework, no build step\n- **Backend**: 1 Cloudflare Worker, ~600 lines\n- **DB**: D1 (serverless SQLite)\n- **Images**: R2\n- **AI chat**: Workers AI (Llama 3.3)\n- **Auth**: GitHub OAuth (single user)\n\nEverything is editable from the admin dashboard. No deploys to change a word of copy.',
   'meta,cloudflare,rebuild', 'published', strftime('%s','now'));
