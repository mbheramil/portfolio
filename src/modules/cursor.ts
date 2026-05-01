// Custom cursor with magnetic + link-hover states.
export function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;
  const cur = document.getElementById('cursor');
  if (!cur) return;

  let tx = 0, ty = 0, x = 0, y = 0;
  const lerp = 0.18;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  function tick() {
    x += (tx - x) * lerp;
    y += (ty - y) * lerp;
    cur!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Hover state
  const linkSel = '[data-cursor="link"], a, button, input, textarea, select';
  document.addEventListener('mouseover', (e) => {
    const t = e.target as HTMLElement;
    if (t && t.closest && t.closest(linkSel)) cur.classList.add('is-link');
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target as HTMLElement;
    if (t && t.closest && t.closest(linkSel)) cur.classList.remove('is-link');
  });
  window.addEventListener('mousedown', () => cur.classList.add('is-press'));
  window.addEventListener('mouseup',   () => cur.classList.remove('is-press'));
  document.addEventListener('mouseleave', () => cur.style.opacity = '0');
  document.addEventListener('mouseenter', () => cur.style.opacity = '1');
}
