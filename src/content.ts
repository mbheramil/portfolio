// Single source of truth. Edit this file to update the site.

export const site = {
  name: 'mbheramil',
  role: 'Full-stack web developer',
  email: 'hello@mbheramil.com',
  status: 'available · q3 2026',
  resumeUrl: '/resume.pdf', // drop your file in /public/resume.pdf

  hero: {
    sub: 'I design and build fast, interactive, well-crafted websites and web apps — from idea to production.'
  },

  marquee: [
    'typescript',
    'react',
    'node',
    'postgres',
    'three.js',
    'tailwind',
    'cloudflare',
    'shaders',
    'design systems',
    'performance',
    'a11y',
    'ux'
  ],

  socials: [
    { label: 'github',   url: 'https://github.com/mbheramil' },
    { label: 'twitter',  url: 'https://twitter.com/' },
    { label: 'linkedin', url: 'https://www.linkedin.com/' }
  ],

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
        'Replace this with a real description. Talk about the problem, the constraint, and the outcome — not the tools.'
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
        'A second placeholder project. Edit src/content.ts to swap in real work.'
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
        'Third placeholder. The site is wired so adding a project = adding an entry here.'
    }
  ],

  // ───────── Stack ─────────
  stack: [
    {
      group: 'frontend',
      items: ['typescript', 'react', 'next.js', 'svelte', 'tailwind', 'vite']
    },
    {
      group: 'backend',
      items: ['node', 'hono', 'postgres', 'redis', 'drizzle', 'rest + rpc']
    },
    {
      group: 'infra',
      items: ['cloudflare', 'workers', 'd1', 'r2', 'github actions', 'docker']
    },
    {
      group: 'craft',
      items: ['three.js', 'glsl shaders', 'gsap', 'figma', 'a11y', 'design systems']
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
