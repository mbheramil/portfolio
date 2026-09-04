// Numbers the nav links (and section headers) from whatever is actually present.
// Sections can be removed at runtime — e.g. Lab disappears when no tools are
// defined — so hardcoded 01..05 would leave gaps.
export function numberNav() {
  const links = document.querySelectorAll<HTMLAnchorElement>('.nav__links a');
  links.forEach((a, i) => {
    const num = a.querySelector('.nav__num');
    if (num) num.textContent = String(i + 1).padStart(2, '0');
  });

  // The element's own text is the label — "work" becomes "01 / work".
  document.querySelectorAll<HTMLElement>('[data-sec-num]').forEach((el, i) => {
    const label = (el.textContent || '').replace(/^\d+\s*\/\s*/, '');
    el.textContent = `${String(i + 1).padStart(2, '0')} / ${label}`;
  });
}
