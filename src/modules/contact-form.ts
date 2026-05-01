// Contact form handler. Submits to Formspree if site.formEndpoint is set,
// otherwise falls back to a mailto: link.
import { site } from '../content';

export function initContactForm() {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const status = document.getElementById('cformStatus') as HTMLElement | null;
  if (!form || !status) return;

  const setStatus = (msg: string, kind: 'idle' | 'ok' | 'err' | 'loading' = 'idle') => {
    status.textContent = msg;
    status.dataset.state = kind;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot
    const hp = (form.elements.namedItem('_gotcha') as HTMLInputElement)?.value;
    if (hp) return;

    // Native validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name    = String(data.get('name') || '');
    const email   = String(data.get('email') || '');
    const ptype   = String(data.get('project_type') || '');
    const budget  = String(data.get('budget') || '');
    const message = String(data.get('message') || '');

    form.classList.add('is-loading');
    setStatus('sending…', 'loading');

    // ── Mailto fallback (no endpoint configured) ──
    if (!site.formEndpoint) {
      const subject = `New project enquiry — ${name}`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Project type: ${ptype}\n` +
        `Budget: ${budget}\n\n` +
        `${message}\n`;
      window.location.href =
        `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      form.classList.remove('is-loading');
      setStatus('opening your email app…', 'ok');
      return;
    }

    // ── Formspree submission ──
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        form.reset();
        setStatus('message sent. i\'ll be in touch within 24 hours.', 'ok');
      } else {
        const j = await res.json().catch(() => ({}));
        const msg = (j && (j.error || (j.errors && j.errors[0]?.message))) || 'something went wrong. try email instead.';
        setStatus(msg, 'err');
      }
    } catch {
      setStatus('network error. try email instead.', 'err');
    } finally {
      form.classList.remove('is-loading');
    }
  });
}
