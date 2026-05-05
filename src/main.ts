import './styles/main.css';
import { renderContent } from './modules/sections';
import { initCursor } from './modules/cursor';
import { initHero } from './modules/hero';
import { initScroll } from './modules/scroll';
import { initPalette } from './modules/palette';
import { initTerminal } from './modules/terminal';
import { initEaster } from './modules/easter';
import { initContactForm } from './modules/contact-form';

// Boot sequence
const boot     = document.getElementById('boot');
const bootFill = document.getElementById('bootFill');

function loadProgress(toPct: number, ms = 200): Promise<void> {
  return new Promise((resolve) => {
    if (!bootFill) return resolve();
    bootFill.style.transition = `width ${ms}ms cubic-bezier(.22,.61,.36,1)`;
    bootFill.style.width = `${toPct}%`;
    setTimeout(resolve, ms);
  });
}

async function boot_() {
  await loadProgress(20, 220);
  renderContent();
  await loadProgress(55, 220);
  initCursor();
  initScroll();
  initPalette();
  initTerminal();
  initEaster();
  initContactForm();
  await loadProgress(80, 200);
  initHero();
  await loadProgress(100, 220);
  await new Promise((r) => setTimeout(r, 120));
  document.body.classList.add('is-loaded');
  if (boot) {
    boot.classList.add('hide');
    setTimeout(() => boot.remove(), 700);
  }

  // If the page was loaded with a hash (e.g. /#contact from case page),
  // scroll to that section once content is rendered. The browser's native
  // hash scroll fires before the boot animation finishes, so it lands on
  // an empty/hidden page — re-scroll here.
  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }
}

// Mobile menu
const burger = document.getElementById('navBurger');
const mm     = document.getElementById('mm');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mm?.classList.toggle('open');
});
mm?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  burger?.classList.remove('open');
  mm.classList.remove('open');
}));

// Smooth-scroll for in-page anchors (accounts for fixed nav)
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
  if (!a) return;
  const id = a.getAttribute('href')!.slice(1);
  if (!id) return;
  const t = document.getElementById(id);
  if (!t) return;
  e.preventDefault();
  t.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

boot_();
