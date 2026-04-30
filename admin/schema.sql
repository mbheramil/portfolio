-- ─── D1 Schema ─────────────────────────────────────────────
-- All site content as a key/value JSON store + relational tables
-- where lists need ordering (services, projects, etc.)
-- ──────────────────────────────────────────────────────────

-- Singleton settings (key → JSON value)
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Ordered lists: services, tools, projects, process_steps, social, quick_questions, stats, skills, typewriter_phrases, about_paragraphs
CREATE TABLE IF NOT EXISTS items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT NOT NULL,       -- 'service', 'tool', 'project', 'process', 'social', 'quick_question', 'stat', 'skill', 'typewriter', 'about_para'
  position   INTEGER NOT NULL DEFAULT 0,
  data       TEXT NOT NULL,       -- JSON blob of fields
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type, position);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT,
  email      TEXT,
  service    TEXT,
  message    TEXT,
  ip         TEXT,
  ua         TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

-- AI chat conversation logs
CREATE TABLE IF NOT EXISTS chat_logs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id   TEXT,
  user_message TEXT,
  ai_response  TEXT,
  ip           TEXT,
  created_at   INTEGER DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_logs(session_id, created_at);

-- Page view analytics (lightweight)
CREATE TABLE IF NOT EXISTS pageviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  path       TEXT,
  referrer   TEXT,
  ua         TEXT,
  country    TEXT,
  device     TEXT,        -- 'mobile' | 'desktop' | 'tablet'
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_pv_created ON pageviews(created_at);

-- ─── SEED DATA ─────────────────────────────────────────────

-- Settings (singletons)
INSERT OR REPLACE INTO settings (key, value) VALUES
  ('personal',    '{"name":"Mike Bheramil","title":"Web Developer & Digital Architect","email":"contactme@mbheramil.com","location":"Available Worldwide · Remote","website":"https://mbheramil.com","availableForWork":true}'),
  ('hero',        '{"tagline":"Building the","headline":"Digital Future","subline":"One Pixel at a Time.","intro":"I build"}'),
  ('about',       '{"heading":"About Me"}'),
  ('contact',     '{"heading":"Let''s Build Something","sub":"Got a project in mind? Drop me a line."}'),
  ('theme',       '{"mode":"light","accent":"#2563eb","accent2":"#7c3aed","bg":"#ffffff","text":"#0f172a","muted":"#64748b","border":"#e2e8f0"}'),
  ('emailjs',     '{"publicKey":"UULH9QgHeTzlkTg9k","serviceId":"mysite","templateIncoming":"template_xhg31tn","templateAutoReply":"template_7a5ksoj"}'),
  ('seo',         '{"title":"Mike Bheramil — Web Developer & Digital Architect","description":"Full-stack web developer specialising in WordPress, custom plugins, AI integration, Shopify and SEO."}');

-- Stats
INSERT INTO items (type, position, data) VALUES
  ('stat', 0, '{"value":120,"suffix":"+","label":"Projects Delivered"}'),
  ('stat', 1, '{"value":6,"suffix":"+","label":"Years Experience"}'),
  ('stat', 2, '{"value":98,"suffix":"%","label":"Client Satisfaction"}');

-- Typewriter phrases
INSERT INTO items (type, position, data) VALUES
  ('typewriter', 0, '{"text":"blazing-fast WordPress sites."}'),
  ('typewriter', 1, '{"text":"custom plugins that scale."}'),
  ('typewriter', 2, '{"text":"AI-powered web apps."}'),
  ('typewriter', 3, '{"text":"SEO strategies that rank."}'),
  ('typewriter', 4, '{"text":"Shopify stores that convert."}'),
  ('typewriter', 5, '{"text":"stunning Wix experiences."}');

-- About paragraphs
INSERT INTO items (type, position, data) VALUES
  ('about_para', 0, '{"text":"I''m a full-stack web developer who bridges design thinking with technical precision. From building lightning-fast WordPress sites and bespoke plugins to architecting AI-powered solutions — I help businesses grow their digital footprint."}'),
  ('about_para', 1, '{"text":"Whether you need a high-converting Shopify store, a polished Wix experience, or an SEO strategy that drives real organic traffic — I deliver results that go beyond the brief."}');

-- Skills
INSERT INTO items (type, position, data) VALUES
  ('skill', 0, '{"name":"WordPress"}'),
  ('skill', 1, '{"name":"Custom PHP Plugins"}'),
  ('skill', 2, '{"name":"React / JS"}'),
  ('skill', 3, '{"name":"Shopify Liquid"}'),
  ('skill', 4, '{"name":"Wix Velo"}'),
  ('skill', 5, '{"name":"SEO / Analytics"}'),
  ('skill', 6, '{"name":"AI / ChatGPT API"}'),
  ('skill', 7, '{"name":"REST APIs"}'),
  ('skill', 8, '{"name":"WooCommerce"}'),
  ('skill', 9, '{"name":"Performance Opt."}');

-- Services
INSERT INTO items (type, position, data) VALUES
  ('service', 0, '{"num":"01","title":"WordPress Development","desc":"Custom themes, full-site editing, WooCommerce stores, and high-performance WordPress builds tailored to your brand.","tags":["Custom Themes","WooCommerce","ACF"],"icon":"layers"}'),
  ('service', 1, '{"num":"02","title":"Custom Plugin Development","desc":"Bespoke WordPress plugins engineered for your specific workflow — from simple widgets to complex SaaS-grade functionality.","tags":["PHP / OOP","REST API","Hooks & Filters"],"icon":"plug"}'),
  ('service', 2, '{"num":"03","title":"SEO Strategy","desc":"Data-driven SEO audits, technical optimization, keyword strategy, and content frameworks that rank and convert.","tags":["Technical SEO","Core Web Vitals","Schema"],"icon":"search"}'),
  ('service', 3, '{"num":"04","title":"AI Integration","desc":"Embed AI into your website — chatbots, content generation, recommendation engines, and automation pipelines powered by OpenAI.","tags":["OpenAI API","Chatbots","Automation"],"icon":"sparkles"}'),
  ('service', 4, '{"num":"05","title":"Shopify Development","desc":"Custom Shopify storefronts, Liquid theme development, app integrations, and conversion-focused UX for growing e-commerce brands.","tags":["Liquid","Shopify CLI","Headless"],"icon":"shop"}'),
  ('service', 5, '{"num":"06","title":"Wix Development","desc":"Professional Wix websites and advanced Wix Velo (Corvid) development — custom code, databases, APIs, and third-party integrations.","tags":["Wix Velo","Wix Stores","Custom Code"],"icon":"grid"}');

-- Tools / tech stack
INSERT INTO items (type, position, data) VALUES
  ('tool', 0,  '{"name":"PHP","hue":210}'),
  ('tool', 1,  '{"name":"CSS3","hue":220}'),
  ('tool', 2,  '{"name":"HTML5","hue":20}'),
  ('tool', 3,  '{"name":"JavaScript","hue":50}'),
  ('tool', 4,  '{"name":"WordPress","hue":200}'),
  ('tool', 5,  '{"name":"Google Cloud","hue":210}'),
  ('tool', 6,  '{"name":"AWS","hue":25}'),
  ('tool', 7,  '{"name":"Shopify","hue":120}'),
  ('tool', 8,  '{"name":"Wix Velo","hue":260}'),
  ('tool', 9,  '{"name":"React","hue":190}'),
  ('tool', 10, '{"name":"Node.js","hue":100}'),
  ('tool', 11, '{"name":"OpenAI API","hue":280}'),
  ('tool', 12, '{"name":"REST API","hue":350}'),
  ('tool', 13, '{"name":"WooCommerce","hue":30}'),
  ('tool', 14, '{"name":"Elementor","hue":160}'),
  ('tool', 15, '{"name":"ACF","hue":320}'),
  ('tool', 16, '{"name":"Git","hue":240}');

-- Projects
INSERT INTO items (type, position, data) VALUES
  ('project', 0, '{"category":"WordPress","hue":200,"url":"#","tags":["WordPress","WooCommerce"],"title":"E-Commerce Platform Rebuild","desc":"Full WooCommerce overhaul with custom checkout flow, performance tuning to 95+ PageSpeed, and integrated inventory management plugin.","image":""}'),
  ('project', 1, '{"category":"SEO","hue":260,"url":"#","tags":["SEO","Analytics"],"title":"300% Organic Traffic Growth","desc":"12-month SEO campaign for a B2B SaaS company — technical audit, content silo strategy, Core Web Vitals fix — tripled organic sessions.","image":""}'),
  ('project', 2, '{"category":"AI","hue":150,"url":"#","tags":["AI","Plugin"],"title":"AI Content Assistant Plugin","desc":"WordPress plugin integrating GPT-4 for on-demand blog drafting, meta descriptions, and product copy — saving clients 10+ hours/week.","image":""}'),
  ('project', 3, '{"category":"Shopify","hue":30,"url":"#","tags":["Shopify","E-Commerce"],"title":"Custom Shopify Fashion Store","desc":"Bespoke Liquid theme for a luxury fashion brand — custom size guide app, lookbook feature, multi-currency, and 4.2s → 1.1s load time.","image":""}'),
  ('project', 4, '{"category":"Wix","hue":320,"url":"#","tags":["Wix Velo","API"],"title":"Booking & CRM on Wix","desc":"Wix Velo-powered booking platform with custom CRM dashboard, automated email triggers, and third-party calendar sync via REST API.","image":""}'),
  ('project', 5, '{"category":"Plugin","hue":90,"url":"#","tags":["Plugin","SaaS"],"title":"Multi-Tenant SaaS Plugin","desc":"Complex WordPress multisite plugin with subscription tiers, Stripe billing, role management, and white-label capabilities for agencies.","image":""}');

-- Process steps
INSERT INTO items (type, position, data) VALUES
  ('process', 0, '{"num":"01","title":"Discover","desc":"We start with a deep-dive call to understand your goals, audience, and constraints. I''ll audit any existing setup and map the project."}'),
  ('process', 1, '{"num":"02","title":"Design","desc":"Wireframes and visual direction. You see exactly what you''re getting before a single line of code is written."}'),
  ('process', 2, '{"num":"03","title":"Build","desc":"Clean, performant, well-documented code. Daily progress updates and a staging URL you can review at any time."}'),
  ('process', 3, '{"num":"04","title":"Launch","desc":"Full QA, performance optimization, SEO setup, and a smooth handover with documentation. I stick around for support post-launch."}');

-- Social links
INSERT INTO items (type, position, data) VALUES
  ('social', 0, '{"name":"LinkedIn","url":"#","icon":"linkedin"}'),
  ('social', 1, '{"name":"GitHub","url":"#","icon":"github"}'),
  ('social', 2, '{"name":"Twitter","url":"#","icon":"twitter"}');

-- AI chat quick questions
INSERT INTO items (type, position, data) VALUES
  ('quick_question', 0, '{"label":"Services?","question":"What services do you offer?"}'),
  ('quick_question', 1, '{"label":"Pricing?","question":"How much does a WordPress site cost?"}'),
  ('quick_question', 2, '{"label":"Shopify?","question":"Can you build a custom Shopify store?"}'),
  ('quick_question', 3, '{"label":"SEO?","question":"What is your SEO process?"}');
