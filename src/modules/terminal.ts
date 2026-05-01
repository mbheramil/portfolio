// Tiny in-page terminal. Easter egg.
import { site } from '../content';

export function initTerminal() {
  const term  = document.getElementById('term') as HTMLElement | null;
  const body  = document.getElementById('termBody') as HTMLElement | null;
  const form  = document.getElementById('termForm') as HTMLFormElement | null;
  const input = document.getElementById('termInput') as HTMLInputElement | null;
  const close = document.getElementById('termClose');
  if (!term || !body || !form || !input) return;

  function print(html: string, cls = 'out') {
    if (!body) return;
    const div = document.createElement('div');
    div.className = cls;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  const banner = `
    <pre style="color:var(--accent);margin:0 0 6px;line-height:1.2">
 ┌──────────────────────────────────────┐
 │  guest@mbheramil:~$ welcome aboard   │
 └──────────────────────────────────────┘</pre>
    type <b>help</b> to see commands.`;

  function reset() {
    if (!body) return;
    body.innerHTML = '';
    print(banner);
  }
  reset();

  const cmds: Record<string, (args: string[]) => void> = {
    help: () => print(`
      <b>available commands:</b><br>
      &nbsp;<b>about</b>     — about me<br>
      &nbsp;<b>stack</b>     — show tech stack<br>
      &nbsp;<b>projects</b>  — list projects<br>
      &nbsp;<b>email</b>     — email me<br>
      &nbsp;<b>resume</b>    — download résumé<br>
      &nbsp;<b>social</b>    — links<br>
      &nbsp;<b>theme</b>     — toggle accent color<br>
      &nbsp;<b>matrix</b>    — 🟢<br>
      &nbsp;<b>clear</b>     — clear screen<br>
      &nbsp;<b>exit</b>      — close terminal`),
    about: () => print(`${site.role}. ${site.hero.sub}`),
    stack: () => {
      const groups = site.stack.map(g => `<b>${g.group}:</b> ${g.items.join(', ')}`).join('<br>');
      print(groups);
    },
    projects: () => {
      const lines = site.projects.map((p, i) => `${String(i + 1).padStart(2, '0')}. <b>${p.title}</b> · ${p.year} — ${p.tagline}`).join('<br>');
      print(lines);
    },
    email: () => { print(`opening mail client → ${site.email}`, 'out ok'); window.location.href = `mailto:${site.email}`; },
    resume: () => { print(`downloading résumé...`, 'out ok'); window.location.href = site.resumeUrl; },
    social: () => print(site.socials.map(s => `<b>${s.label}</b> → ${s.url}`).join('<br>')),
    theme: () => {
      const accents = ['#00ffd1', '#ff7849', '#a78bfa', '#f5cf00', '#ff5470'];
      const cur = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const i = accents.indexOf(cur);
      const next = accents[(i + 1) % accents.length];
      document.documentElement.style.setProperty('--accent', next);
      print(`accent → ${next}`, 'out ok');
    },
    matrix: () => {
      print('engaging matrix mode...', 'out ok');
      runMatrix();
    },
    clear: () => reset(),
    exit:  () => { if (term) term.hidden = true; },
    sudo:  () => print('nice try.', 'out ok'),
    ls:    () => print('about/   work/   stack/   process/   contact/'),
    whoami:() => print('guest. you might want to <b>contact</b> me to fix that.')
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    print(raw, 'cmd');
    const [c, ...args] = raw.split(/\s+/);
    const fn = cmds[c.toLowerCase()];
    if (fn) fn(args);
    else print(`command not found: <b>${c}</b>. type <b>help</b>.`);
    input.value = '';
  });

  close?.addEventListener('click', () => { term.hidden = true; });
  // Esc closes when terminal is focused
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') term.hidden = true; });
}

// Tiny matrix rain easter egg overlay
function runMatrix() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:140;pointer-events:none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize(); window.addEventListener('resize', resize);

  const fontSize = 14;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = new Array(cols).fill(1);
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ01';
  let frame = 0;
  const stop = setTimeout(() => { cancel = true; canvas.remove(); }, 8000);
  let cancel = false;

  function draw() {
    if (cancel || !ctx) return;
    ctx.fillStyle = 'rgba(5,6,10,.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;
    ctx.fillStyle = '#00ffd1';
    for (let i = 0; i < drops.length; i++) {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(c, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    frame = requestAnimationFrame(draw);
  }
  draw();
  // ensure cleanup
  setTimeout(() => { cancel = true; cancelAnimationFrame(frame); canvas.remove(); clearTimeout(stop); }, 8200);
}
