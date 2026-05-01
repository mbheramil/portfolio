// Cmd/Ctrl+K command palette. Fuzzy-ish substring search over a registered command list.
import { site } from '../content';

interface Cmd {
  id: string;
  label: string;
  hint?: string;
  icon?: string;
  run: () => void;
}

let commands: Cmd[] = [];
let active = 0;
let filtered: Cmd[] = [];

export function initPalette(extra: Cmd[] = []) {
  const root  = document.getElementById('palette') as HTMLElement;
  const back  = document.getElementById('paletteBack');
  const input = document.getElementById('paletteInput') as HTMLInputElement;
  const list  = document.getElementById('paletteList') as HTMLUListElement;
  if (!root || !input || !list) return;

  const goto = (id: string) => () => {
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  commands = [
    { id: 'g-work', label: 'Go to Work', hint: 'section', icon: '→', run: goto('work') },
    { id: 'g-stack', label: 'Go to Stack', hint: 'section', icon: '→', run: goto('stack') },
    { id: 'g-process', label: 'Go to Process', hint: 'section', icon: '→', run: goto('process') },
    { id: 'g-contact', label: 'Go to Contact', hint: 'section', icon: '→', run: goto('contact') },
    { id: 'a-email', label: `Email ${site.email}`, hint: 'action', icon: '✉', run: () => { window.location.href = `mailto:${site.email}`; close(); } },
    { id: 'a-copy-email', label: 'Copy email address', hint: 'action', icon: '⎘', run: async () => { await navigator.clipboard.writeText(site.email); close(); } },
    { id: 'a-resume', label: 'Download résumé', hint: 'action', icon: '↓', run: () => { window.location.href = site.resumeUrl; close(); } },
    { id: 'a-source', label: 'View site source on GitHub', hint: 'external', icon: '↗', run: () => { window.open('https://github.com/mbheramil/mbheramil.github.io', '_blank'); close(); } },
    { id: 'a-terminal', label: 'Open terminal', hint: 'easter-egg', icon: '_', run: () => { close(); openTerminal(); } },
    ...extra
  ];

  function open() {
    root.hidden = false;
    input.value = '';
    active = 0;
    render('');
    requestAnimationFrame(() => input.focus());
    document.body.style.overflow = 'hidden';
  }
  function close() {
    root.hidden = true;
    document.body.style.overflow = '';
  }

  function render(q: string) {
    const query = q.trim().toLowerCase();
    filtered = !query
      ? commands
      : commands.filter((c) => c.label.toLowerCase().includes(query) || (c.hint || '').includes(query));
    if (active >= filtered.length) active = 0;

    list.innerHTML = filtered.length
      ? filtered.map((c, i) => `
          <li data-i="${i}" class="${i === active ? 'active' : ''}">
            <span class="ico">${c.icon || '·'}</span>
            <span>${c.label}</span>
            <span class="meta">${c.hint || ''}</span>
          </li>`).join('')
      : `<li><span class="ico">!</span><span class="empty">No matches</span></li>`;
  }

  input.addEventListener('input', () => render(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); render(input.value); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); render(input.value); }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[active]?.run(); }
    else if (e.key === 'Escape') { close(); }
  });

  list.addEventListener('mousemove', (e) => {
    const li = (e.target as HTMLElement).closest('li');
    if (!li) return;
    const i = +(li.getAttribute('data-i') || '-1');
    if (i >= 0 && i !== active) { active = i; render(input.value); }
  });
  list.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest('li');
    if (!li) return;
    const i = +(li.getAttribute('data-i') || '-1');
    if (i >= 0) filtered[i]?.run();
  });

  back?.addEventListener('click', close);

  // Hotkey
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.hidden ? open() : close(); }
    else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA' && root.hidden) {
      e.preventDefault(); open();
    }
  });

  document.getElementById('navCmd')?.addEventListener('click', open);
  document.getElementById('mmCmd')?.addEventListener('click', open);
  document.getElementById('footCmd')?.addEventListener('click', open);
}

function openTerminal() {
  const term = document.getElementById('term');
  if (term) term.hidden = false;
  setTimeout(() => (document.getElementById('termInput') as HTMLInputElement)?.focus(), 80);
}
