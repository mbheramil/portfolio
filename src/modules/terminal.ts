// Tiny in-page terminal. Easter egg.
import { site } from '../content';
import { runMatrix } from './easter';
import { escapeHtml } from './html';

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
    about: () => print(escapeHtml(`${site.role}. ${site.hero.sub}`)),
    stack: () => {
      const groups = site.stack.map(g => `<b>${escapeHtml(g.group)}:</b> ${escapeHtml(g.items.join(', '))}`).join('<br>');
      print(groups);
    },
    projects: () => {
      const lines = site.projects.map((p, i) => `${String(i + 1).padStart(2, '0')}. <b>${escapeHtml(p.title)}</b> · ${escapeHtml(p.year)} · ${escapeHtml(p.tagline)}`).join('<br>');
      print(lines);
    },
    email: () => { print(`opening mail client → ${site.email}`, 'out ok'); window.location.href = `mailto:${site.email}`; },
    resume: () => {
      if (!site.resumeUrl) { print('no résumé uploaded yet, try <b>email</b>.'); return; }
      print('downloading résumé...', 'out ok');
      window.location.href = site.resumeUrl;
    },
    social: () => print(site.socials.map(s => `<b>${escapeHtml(s.label)}</b> → ${escapeHtml(s.url)}`).join('<br>')),
    theme: () => {
      const accents = ['#f0a648', '#7b8fa3', '#c4785a', '#9aa87c', '#d4b483'];
      const cur = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const i = accents.indexOf(cur);
      const next = accents[(i + 1) % accents.length];
      const root = document.documentElement;
      root.style.setProperty('--accent', next);
      // --accent-rgb backs every rgba() tint, so it has to move with --accent.
      const [r, g, b] = [1, 3, 5].map(o => parseInt(next.slice(o, o + 2), 16));
      root.style.setProperty('--accent-rgb', `${r},${g},${b}`);
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
    print(escapeHtml(raw), 'cmd');
    const [c, ...args] = raw.split(/\s+/);
    const fn = cmds[c.toLowerCase()];
    if (fn) fn(args);
    else print(`command not found: <b>${escapeHtml(c)}</b>. type <b>help</b>.`);
    input.value = '';
  });

  close?.addEventListener('click', () => { term.hidden = true; });
  // Esc closes when terminal is focused
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') term.hidden = true; });
}
