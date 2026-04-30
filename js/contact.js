/* ─── js/contact.js ───────────────────────────────────────
   EmailJS contact form handler.
   Reads all credentials from window.SiteConfig.emailjs.
   ─────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const C = window.SiteConfig;
  if (!C || !C.emailjs) { console.warn('contact.js: SiteConfig.emailjs missing'); return; }

  const { publicKey, serviceId, templateIncoming, templateAutoReply } = C.emailjs;

  if (typeof emailjs === 'undefined') { console.warn('contact.js: emailjs not loaded'); return; }

  emailjs.init(publicKey);

  const form      = document.getElementById('contactForm');
  const statusEl  = document.getElementById('formStatus');
  if (!form) return;

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className   = 'form-status form-status--' + type;
    statusEl.style.display = 'block';
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Sending…';
    setStatus('', 'info');

    const data = {
      name:    form.querySelector('[name="name"]').value.trim(),
      email:   form.querySelector('[name="email"]').value.trim(),
      subject: (form.querySelector('[name="service"]') || {}).value || '(no subject)',
      message: form.querySelector('[name="message"]').value.trim(),
    };

    try {
      // Email to site owner
      await emailjs.send(serviceId, templateIncoming, data);
      // Auto-reply to sender
      await emailjs.send(serviceId, templateAutoReply, data);

      setStatus('Message sent! I\'ll get back to you within 24 hours.', 'success');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('Something went wrong. Please email directly at ' + C.email, 'error');
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Send Message';
    }
  });

})();
