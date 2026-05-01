// Single source of truth. Edit this file to update the site.

export const site = {
  name: 'mbheramil',
  role: 'Full-stack web developer',
  email: 'hello@mbheramil.com',
  status: 'available · q3 2026',
  resumeUrl: '/resume.pdf', // drop your file in /public/resume.pdf

  // ───────── Contact form (EmailJS) ─────────
  // Sign in at https://emailjs.com → Email Services → copy your service ID
  // Email Templates → copy template ID. Account → API Keys → copy Public Key.
  // If any field is empty, the form falls back to a mailto: link.
  emailjs: {
    publicKey:  '',  // e.g. 'aBcD1234EfGh5678'
    serviceId:  '',  // e.g. 'service_xxxxxxx'
    templateId: ''   // e.g. 'template_xxxxxxx'
  },

  hero: {
    sub: 'I build fast, beautiful websites on WordPress & Shopify — with cloud infrastructure (Google Cloud, AWS) and AI integrations baked in when you need them.'
  },

  marquee: [
    'wordpress',
    'shopify',
    'wix',
    'duda',
    'google cloud',
    'aws',
    'AI integration',
    'e-commerce',
    'custom themes',
    'woocommerce',
    'liquid',
    'php',
    'automation'
  ],

  socials: [] as { label: string; url: string }[],

  // ───────── Projects ─────────
  projects: [
    {
      id: 'project-one',
      title: 'Project One',
      tagline: 'A short, punchy line about what it is.',
      year: '2026',
      role: 'design + build',
      stack: ['typescript', 'react', 'node', 'postgres'],
      cover: '#0a1118', // hex color or url('/...')
      url: '#',
      summary:
        'Replace this with a real description. Talk about the problem, the constraint, and the outcome — not the tools.',
      // ─── case-study fields (optional; project links to /case.html?p=<id> when present) ───
      caseStudy: {
        client: 'Self-initiated',
        timeline: '6 weeks',
        team: 'solo',
        live: '#',
        repo: '#',
        gallery: ['#0a1118', '#11161e', '#0a1118'], // hex or '/cover.png'
        sections: [
          { heading: 'context', body: 'What was the problem we were solving? Replace this paragraph in src/content.ts when you have real content. Talk about the user, the constraint, and what success looked like.' },
          { heading: 'approach', body: 'How did you tackle it? Describe the design and engineering moves you made — and the tradeoffs you accepted.' },
          { heading: 'outcome', body: 'What shipped? What changed? Numbers help: latency, conversion, time saved, anything measurable.' }
        ]
      }
    },
    {
      id: 'project-two',
      title: 'Project Two',
      tagline: 'Another short, punchy summary.',
      year: '2025',
      role: 'full stack',
      stack: ['next.js', 'cloudflare', 'd1'],
      cover: '#0e1a14',
      url: '#',
      summary:
        'A second placeholder project. Edit src/content.ts to swap in real work.',
      caseStudy: {
        client: 'Acme Co.',
        timeline: '3 months',
        team: '2 engineers + 1 designer',
        live: '#',
        repo: '#',
        gallery: ['#0e1a14', '#0c1c16', '#0e1a14'],
        sections: [
          { heading: 'context', body: 'Placeholder.' },
          { heading: 'approach', body: 'Placeholder.' },
          { heading: 'outcome', body: 'Placeholder.' }
        ]
      }
    },
    {
      id: 'project-three',
      title: 'Project Three',
      tagline: 'One sentence pitch.',
      year: '2025',
      role: 'engineering',
      stack: ['three.js', 'glsl', 'vite'],
      cover: '#181029',
      url: '#',
      summary:
        'Third placeholder. The site is wired so adding a project = adding an entry here.',
      caseStudy: {
        client: 'Internal tool',
        timeline: '2 weeks',
        team: 'solo',
        live: '#',
        repo: '#',
        gallery: ['#181029', '#1c1230', '#181029'],
        sections: [
          { heading: 'context', body: 'Placeholder.' },
          { heading: 'approach', body: 'Placeholder.' },
          { heading: 'outcome', body: 'Placeholder.' }
        ]
      }
    }
  ],

  // ───────── Stack ─────────
  stack: [
    {
      group: 'wordpress',
      items: ['custom themes', 'plugins', 'woocommerce', 'gutenberg blocks', 'ACF', 'php', 'multisite']
    },
    {
      group: 'shopify',
      items: ['liquid', 'shopify plus', 'app integrations', 'metafields', 'storefront API']
    },
    {
      group: 'other platforms',
      items: ['wix', 'duda', 'webflow', 'squarespace']
    },
    {
      group: 'development',
      items: ['javascript', 'react', 'node', 'rest APIs', 'git']
    },
    {
      group: 'cloud',
      items: ['google cloud', 'aws', 'cloud functions', 'storage buckets', 'cloud DNS', 'IAM', 'CI/CD']
    },
    {
      group: 'AI integration',
      items: ['openai API', 'gemini API', 'claude API', 'chatbots', 'RAG / embeddings', 'AI workflows', 'automation']
    }
  ],

  // ───────── Process ─────────
  process: [
    {
      n: '01',
      title: 'discover',
      body: 'Understand the goal, the constraints, and what success looks like. Asking the right questions saves weeks.'
    },
    {
      n: '02',
      title: 'shape',
      body: 'Sketch the smallest version that proves the idea. Wireframes, prototypes, technical spike. No big-bang plans.'
    },
    {
      n: '03',
      title: 'build',
      body: 'Ship in tight loops. Every commit deployable. Polish stays a first-class citizen, not an afterthought.'
    },
    {
      n: '04',
      title: 'iterate',
      body: 'Real users hit production. We watch what happens, learn, and tighten. The work is never finished, only released.'
    }
  ]
};

export type Site = typeof site;
