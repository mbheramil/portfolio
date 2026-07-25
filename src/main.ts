import './styles/main.css';
import { renderContent } from './modules/sections';
import { initHero } from './modules/hero';
import { initScroll } from './modules/scroll';
import { initPalette } from './modules/palette';
import { initTerminal } from './modules/terminal';
import { initEaster } from './modules/easter';
import { initContactForm } from './modules/contact-form';
import { numberNav } from './modules/nav-numbers';

renderContent();   // may remove the Lab section + its nav links
numberNav();       // …so number the nav only after that
initScroll();
initPalette();
initTerminal();
initEaster();
initContactForm();
initHero();
document.body.classList.add('is-loaded');

// Module scripts are deferred, so the browser's native hash scroll fires before
// renderContent() has filled the sections — re-scroll once they exist.
if (window.location.hash) {
  const el = document.getElementById(window.location.hash.slice(1));
  if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
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
