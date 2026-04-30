/* ─── data/config.js ──────────────────────────────────────
   ALL site content lives here.
   Edit this file to update your portfolio — no need to
   touch any HTML or logic files.
   ─────────────────────────────────────────────────────── */

window.SiteConfig = {

  /* ── PERSONAL INFO ──────────────────────────────────── */
  name:     'Mayur Bheramil',
  title:    'Web Developer & Digital Architect',
  email:    'contactme@mbheramil.com',
  location: 'Available Worldwide · Remote',
  website:  'https://mbheramil.com',
  availableForWork: true,          // shows "Available for new projects" tag

  /* ── HERO TYPEWRITER PHRASES ─────────────────────────── */
  // Add or remove phrases freely
  typewriterPhrases: [
    'blazing-fast WordPress sites.',
    'custom plugins that scale.',
    'AI-powered web apps.',
    'SEO strategies that rank.',
    'Shopify stores that convert.',
    'stunning Wix experiences.',
  ],

  /* ── STATS (hero section counters) ──────────────────── */
  stats: [
    { value: 120, suffix: '+', label: 'Projects Delivered' },
    { value: 6,   suffix: '+', label: 'Years Experience'   },
    { value: 98,  suffix: '%', label: 'Client Satisfaction' },
  ],

  /* ── ABOUT ──────────────────────────────────────────── */
  about: {
    // Each string becomes a <p> paragraph in the About section
    paragraphs: [
      "I'm a full-stack web developer who bridges design thinking with technical precision. From building lightning-fast WordPress sites and bespoke plugins to architecting AI-powered solutions — I help businesses grow their digital footprint.",
      "Whether you need a high-converting Shopify store, a polished Wix experience, or an SEO strategy that drives real organic traffic — I deliver results that go beyond the brief.",
    ],
    // Skill tags displayed in the About section
    skills: [
      'WordPress', 'Custom PHP Plugins', 'React / JS',
      'Shopify Liquid', 'Wix Velo', 'SEO / Analytics',
      'AI / ChatGPT API', 'REST APIs', 'WooCommerce', 'Performance Opt.',
    ],
  },

  /* ── SERVICES ───────────────────────────────────────── */
  // Each service becomes a card. Add/remove objects to add/remove cards.
  services: [
    {
      num:   '01',
      title: 'WordPress Development',
      desc:  'Custom themes, full-site editing, WooCommerce stores, and high-performance WordPress builds tailored to your brand.',
      tags:  ['Custom Themes', 'WooCommerce', 'ACF'],
      icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    },
    {
      num:   '02',
      title: 'Custom Plugin Development',
      desc:  'Bespoke WordPress plugins engineered for your specific workflow — from simple widgets to complex SaaS-grade functionality.',
      tags:  ['PHP / OOP', 'REST API', 'Hooks & Filters'],
      icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`,
    },
    {
      num:   '03',
      title: 'SEO Strategy',
      desc:  'Data-driven SEO audits, technical optimization, keyword strategy, and content frameworks that rank and convert.',
      tags:  ['Technical SEO', 'Core Web Vitals', 'Schema'],
      icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>`,
    },
    {
      num:   '04',
      title: 'AI Integration',
      desc:  'Embed AI into your website — chatbots, content generation, recommendation engines, and automation pipelines powered by OpenAI.',
      tags:  ['OpenAI API', 'Chatbots', 'Automation'],
      icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 0c2.76 0 5 4.48 5 10S14.76 22 12 22 7 17.52 7 12 9.24 2 12 2zm-10 10h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10A15.3 15.3 0 018 12a15.3 15.3 0 014-10z"/></svg>`,
    },
    {
      num:   '05',
      title: 'Shopify Development',
      desc:  'Custom Shopify storefronts, Liquid theme development, app integrations, and conversion-focused UX for growing e-commerce brands.',
      tags:  ['Liquid', 'Shopify CLI', 'Headless'],
      icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    },
    {
      num:   '06',
      title: 'Wix Development',
      desc:  'Professional Wix websites and advanced Wix Velo (Corvid) development — custom code, databases, APIs, and third-party integrations.',
      tags:  ['Wix Velo', 'Wix Stores', 'Custom Code'],
      icon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/><path d="M4 12h5M15 12h5M12 4v5M12 15v5"/></svg>`,
    },
  ],

  /* ── TOOLS / TECH STACK ─────────────────────────────── */
  // hue: color hue (0-360) for the dot glow
  tools: [
    { name: 'PHP',          hue: 210 },
    { name: 'CSS3',         hue: 220 },
    { name: 'HTML5',        hue: 20  },
    { name: 'JavaScript',   hue: 50  },
    { name: 'WordPress',    hue: 200 },
    { name: 'Google Cloud', hue: 210 },
    { name: 'AWS',          hue: 25  },
    { name: 'Shopify',      hue: 120 },
    { name: 'Wix Velo',     hue: 260 },
    { name: 'React',        hue: 190 },
    { name: 'Node.js',      hue: 100 },
    { name: 'OpenAI API',   hue: 280 },
    { name: 'REST API',     hue: 350 },
    { name: 'WooCommerce',  hue: 30  },
    { name: 'Elementor',    hue: 160 },
    { name: 'ACF',          hue: 320 },
    { name: 'Git',          hue: 240 },
  ],

  /* ── PROJECTS ───────────────────────────────────────── */
  // category: used for the filter buttons (must match exactly)
  // hue: background color of the project image (0-360)
  // url: link when clicking the project (use '#' if not ready)
  // tags: array of label strings shown on the card
  projects: [
    {
      category: 'WordPress',
      hue:      200,
      url:      '#',
      tags:     ['WordPress', 'WooCommerce'],
      title:    'E-Commerce Platform Rebuild',
      desc:     'Full WooCommerce overhaul with custom checkout flow, performance tuning to 95+ PageSpeed, and integrated inventory management plugin.',
    },
    {
      category: 'SEO',
      hue:      260,
      url:      '#',
      tags:     ['SEO', 'Analytics'],
      title:    '300% Organic Traffic Growth',
      desc:     '12-month SEO campaign for a B2B SaaS company — technical audit, content silo strategy, Core Web Vitals fix — tripled organic sessions.',
    },
    {
      category: 'AI',
      hue:      150,
      url:      '#',
      tags:     ['AI', 'Plugin'],
      title:    'AI Content Assistant Plugin',
      desc:     'WordPress plugin integrating GPT-4 for on-demand blog drafting, meta descriptions, and product copy — saving clients 10+ hours/week.',
    },
    {
      category: 'Shopify',
      hue:      30,
      url:      '#',
      tags:     ['Shopify', 'E-Commerce'],
      title:    'Custom Shopify Fashion Store',
      desc:     'Bespoke Liquid theme for a luxury fashion brand — custom size guide app, lookbook feature, multi-currency, and 4.2s → 1.1s load time.',
    },
    {
      category: 'Wix',
      hue:      320,
      url:      '#',
      tags:     ['Wix Velo', 'API'],
      title:    'Booking & CRM on Wix',
      desc:     'Wix Velo-powered booking platform with custom CRM dashboard, automated email triggers, and third-party calendar sync via REST API.',
    },
    {
      category: 'Plugin',
      hue:      90,
      url:      '#',
      tags:     ['Plugin', 'SaaS'],
      title:    'Multi-Tenant SaaS Plugin',
      desc:     'Complex WordPress multisite plugin with subscription tiers, Stripe billing, role management, and white-label capabilities for agencies.',
    },
  ],

  /* ── SOCIAL LINKS ───────────────────────────────────── */
  // Set url to '#' to hide the link visually, or remove the entry
  social: [
    {
      name: 'LinkedIn',
      url:  '#',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    },
    {
      name: 'GitHub',
      url:  '#',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`,
    },
    {
      name: 'Twitter / X',
      url:  '#',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    },
  ],

  /* ── EMAILJS ────────────────────────────────────────── */
  emailjs: {
    publicKey:        'UULH9QgHeTzlkTg9k',
    serviceId:        'mysite',
    templateIncoming: 'template_xhg31tn',  // email YOU receive
    templateAutoReply:'template_7a5ksoj',  // email CUSTOMER receives
  },

  /* ── AI CHAT WIDGET ──────────────────────────────────── */
  ai: {
    // Paste your OpenAI API key here to enable the chat widget
    openaiKey: 'YOUR_OPENAI_API_KEY_HERE',
    quickQuestions: [
      { label: 'Services?', question: 'What services do you offer?' },
      { label: 'Pricing?',  question: 'How much does a WordPress site cost?' },
      { label: 'Shopify?',  question: 'Can you build a custom Shopify store?' },
      { label: 'SEO?',      question: 'What is your SEO process?' },
    ],
  },

};
