// Lightweight scroll reveal + nav scroll state. No GSAP needed.
export function initScroll() {
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal-on-scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  document.querySelectorAll<HTMLElement>('.reveal, [data-reveal]').forEach((el) => io.observe(el));

  // Hero subtitle typewriter
  const sub = document.getElementById('heroSub');
  if (sub) {
    const text = sub.dataset.text || '';
    if (text) {
      let i = 0;
      sub.textContent = '';
      const caret = document.createElement('span');
      caret.className = 'tw-c';
      sub.appendChild(caret);
      const step = () => {
        if (i >= text.length) return;
        caret.before(document.createTextNode(text[i++]));
        setTimeout(step, 18 + Math.random() * 18);
      };
      setTimeout(step, 900);
    }
  }
}
