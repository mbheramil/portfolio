// Contact form handler — uses EmailJS browser SDK.
// Falls back to a mailto: link if EmailJS isn't fully configured.
import { site } from '../content';

declare global {
  interface Window {
    emailjs?: {
      init: (opts: { publicKey: string }) => void;
      sendForm: (serviceId: string, templateId: string, form: HTMLFormElement) => Promise<{ status: number; text: string }>;
      send:     (serviceId: string, templateId: string, params: Record<string, unknown>) => Promise<{ status: number; text: string }>;
    };
  }
}

const EMAILJS_SDK = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

let sdkLoading: Promise<void> | null = null;
function loadEmailJS(): Promise<void> {
  if (window.emailjs) return Promise.resolve();
  if (sdkLoading) return sdkLoading;
  sdkLoading = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = EMAILJS_SDK;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(s);
  });
  return sdkLoading;
}

export function initContactForm() {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const status = document.getElementById('cformStatus') as HTMLElement | null;
  if (!form || !status) return;

  // Custom project-type dropdown
  const dd      = document.getElementById('projectTypeDropdown');
  const ddBtn   = document.getElementById('projectTypeBtn');
  const ddList  = document.getElementById('projectTypeList');
  const ddVal   = document.getElementById('projectTypeVal');
  const ddInput = form.querySelector<HTMLInputElement>('input[name="project_type"]');
  if (dd && ddBtn && ddList && ddVal && ddInput) {
    ddBtn.addEventListener('click', () => {
      const open = dd.classList.toggle('open');
      ddBtn.setAttribute('aria-expanded', String(open));
    });
    ddList.addEventListener('click', (e) => {
      const li = (e.target as HTMLElement).closest<HTMLLIElement>('li');
      if (!li) return;
      ddVal.textContent = li.textContent || '';
      ddInput.value = li.dataset.value || '';
      ddList.querySelectorAll('li').forEach(l => l.removeAttribute('aria-selected'));
      li.setAttribute('aria-selected', 'true');
      dd.classList.remove('open');
      ddBtn.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target as Node)) {
        dd.classList.remove('open');
        ddBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const cfg = site.emailjs;
  const useEmailJS = !!(cfg.publicKey && cfg.serviceId && cfg.templateId);

  const setStatus = (msg: string, kind: 'idle' | 'ok' | 'err' | 'loading' = 'idle') => {
    status.textContent = msg;
    status.dataset.state = kind;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot — bots fill this, humans don't
    const hp = (form.elements.namedItem('_gotcha') as HTMLInputElement)?.value;
    if (hp) return;

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

    // Map UI values → friendlier service labels for the email
    const serviceLabel: Record<string, string> = {
      wordpress: 'WordPress site',
      shopify:   'Shopify store',
      wix:       'Wix site',
      duda:      'Duda site',
      ai:        'AI integration / chatbot',
      cloud:     'Cloud setup (GCP / AWS)',
      custom:    'Custom build',
      other:     'Something else'
    };
    const service = serviceLabel[ptype] || ptype;
    const time = new Date().toLocaleString(undefined, {
      dateStyle: 'medium', timeStyle: 'short'
    });

    // Inject template variables as hidden fields so EmailJS sendForm picks them up
    setHidden(form, 'service',      service);
    setHidden(form, 'service_type', service);
    setHidden(form, 'time',         time);

    form.classList.add('is-loading');
    setStatus('sending…', 'loading');

    // ── Mailto fallback ──
    if (!useEmailJS) {
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

    // ── EmailJS submission ──
    try {
      await loadEmailJS();
      if (!window.emailjs) throw new Error('emailjs unavailable');
      window.emailjs.init({ publicKey: cfg.publicKey });

      // 1. Send notification to me
      await window.emailjs.sendForm(cfg.serviceId, cfg.templateId, form);

      // 2. Send auto-reply to the sender (if configured) — non-blocking
      if (cfg.autoReplyTemplateId) {
        window.emailjs.sendForm(cfg.serviceId, cfg.autoReplyTemplateId, form)
          .catch((e) => console.warn('auto-reply failed:', e));
      }

      form.reset();
      setStatus('message sent. i\'ll be in touch within 24 hours.', 'ok');
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message ? err.message : 'something went wrong. try email instead.';
      setStatus(msg.toLowerCase(), 'err');
    } finally {
      form.classList.remove('is-loading');
    }
  });
}

function setHidden(form: HTMLFormElement, name: string, value: string) {
  let input = form.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    form.appendChild(input);
  }
  input.value = value;
}
