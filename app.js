/* ─── app.js ─────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── CURSOR ─────────────────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });

  /* ── NAV SCROLL ─────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ────────────────────────────────────────── */
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = [...el.parentElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')];
        const idx = siblings.indexOf(el);
        setTimeout(() => el.classList.add('in'), idx * 90);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  const counters = document.querySelectorAll('.stat__num[data-target]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const start  = performance.now();

      const tick = (now) => {
        const pct = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - pct, 3);
        el.textContent = Math.floor(ease * target);
        if (pct < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObs.observe(el));

  /* ── ACTIVE NAV LINK ────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const activeObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => activeObs.observe(s));

  /* ── CONTACT FORM ───────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        note.textContent = 'Please fill in all required fields.';
        note.className   = 'form-note error';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.textContent = 'Please enter a valid email address.';
        note.className   = 'form-note error';
        return;
      }

      const btn = form.querySelector('.btn--primary');
      btn.disabled = true;
      btn.querySelector('.btn-text').textContent = 'Sending…';

      const data = { name, email, message, service: form.service.value };

      fetch('https://formspree.io/f/mqenzowe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(json => {
          if (json.ok) {
            note.textContent = '✓ Message sent! I\'ll be in touch within 24 hours.';
            note.className   = 'form-note success';
            form.reset();
          } else {
            note.textContent = 'Something went wrong. Please try again.';
            note.className   = 'form-note error';
          }
        })
        .catch(() => {
          note.textContent = 'Network error. Please try again.';
          note.className   = 'form-note error';
        })
        .finally(() => {
          btn.disabled = false;
          btn.querySelector('.btn-text').textContent = 'Send Message';
        });
    });
  }

  /* ── SMOOTH SCROLL OFFSET ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── PRELOADER ──────────────────────────────────────────── */
  const preloader    = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderPct  = document.getElementById('preloaderPct');
  if (preloader) {
    let pct = 0;
    const step = () => {
      pct += Math.random() * 18 + 6;
      if (pct >= 100) {
        pct = 100;
        preloaderFill.style.width = '100%';
        preloaderPct.textContent  = '100%';
        setTimeout(() => {
          preloader.classList.add('done');
          setTimeout(() => preloader.remove(), 550);
        }, 250);
        return;
      }
      preloaderFill.style.width = pct + '%';
      preloaderPct.textContent  = Math.floor(pct) + '%';
      setTimeout(step, 80 + Math.random() * 60);
    };
    step();
  }

  /* ── TYPEWRITER ─────────────────────────────────────────── */
  (function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const phrases = [
      'blazing-fast WordPress sites.',
      'custom plugins that scale.',
      'AI-powered web apps.',
      'SEO strategies that rank.',
      'Shopify stores that convert.',
      'stunning Wix experiences.',
    ];
    let pi = 0, ci = 0, deleting = false;
    const TSPEED = 58, DSPEED = 28, PAUSE = 2200;
    function tick() {
      const phrase = phrases[pi];
      if (!deleting) {
        el.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(tick, PAUSE); return; }
      } else {
        el.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); return; }
      }
      setTimeout(tick, deleting ? DSPEED : TSPEED);
    }
    tick();
  })();

  /* ── INTERACTIVE GLOBE ──────────────────────────────────── */
  (function initGlobe() {
    const canvas = document.getElementById('heroGlobe');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let CW, CH, cx, cy, R;

    const TAGS = [
      'PHP', 'CSS3', 'HTML5', 'JavaScript', 'WordPress',
      'AWS', 'React', 'SEO', 'Shopify', 'Wix',
      'REST API', 'GPT-4', 'WooCommerce', 'Google Cloud', 'Node.js', 'Python',
    ];
    const N = 180;
    const golden = Math.PI * (3 - Math.sqrt(5));

    // Fibonacci-sphere lattice
    const pts = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const t = golden * i;
      pts.push({ ox: Math.cos(t) * r, oy: y, oz: Math.sin(t) * r, tag: null });
    }
    TAGS.forEach((tag, i) => { pts[Math.round(i * N / TAGS.length)].tag = tag; });

    let rotX = 0.25, rotY = 0;
    let tgtX = 0.25, mouseOffX = 0;
    let autoY = 0, onHero = false;

    const heroEl = document.getElementById('home');
    if (heroEl) {
      heroEl.addEventListener('mousemove', e => {
        const r = heroEl.getBoundingClientRect();
        mouseOffX = ((e.clientX - r.left) / r.width  - 0.5) * 1.5;
        tgtX      = ((e.clientY - r.top)  / r.height - 0.5) * 1.2;
        onHero    = true;
      });
      heroEl.addEventListener('mouseleave', () => { onHero = false; });
    }

    function rotPt(p, rx, ry) {
      const x1 =  p.ox * Math.cos(ry) + p.oz * Math.sin(ry);
      const z1 = -p.ox * Math.sin(ry) + p.oz * Math.cos(ry);
      const y2 =  p.oy * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 =  p.oy * Math.sin(rx) + z1 * Math.cos(rx);
      return { x: x1, y: y2, z: z2 };
    }

    function rrect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y,     x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x,     y + h, r);
      ctx.arcTo(x,     y + h, x,     y,     r);
      ctx.arcTo(x,     y,     x + w, y,     r);
      ctx.closePath();
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      CW = rect.width  || 480;
      CH = rect.height || 480;
      canvas.width  = CW * dpr;
      canvas.height = CH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = CW / 2; cy = CH / 2;
      R  = Math.min(CW, CH) * 0.38;
    }

    function draw() {
      ctx.clearRect(0, 0, CW, CH);
      autoY += 0.004;
      const tgtY = onHero ? autoY + mouseOffX : autoY;
      rotX += ((onHero ? tgtX : 0.25) - rotX) * 0.04;
      rotY += (tgtY - rotY) * 0.04;

      const projected = pts.map(p => {
        const r = rotPt(p, rotX, rotY);
        return { ...p, sx: cx + r.x * R, sy: cy + r.y * R, rz: r.z, depth: (r.z + 1) * 0.5 };
      });
      projected.sort((a, b) => a.rz - b.rz);

      // Connecting lines between near front-facing dots
      const front = projected.filter(p => !p.tag && p.rz > 0);
      const thresh2 = (R * 0.23) ** 2;
      for (let i = 0; i < front.length; i++) {
        for (let j = i + 1; j < front.length; j++) {
          const dx = front[i].sx - front[j].sx;
          const dy = front[i].sy - front[j].sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < thresh2) {
            const fade = (1 - Math.sqrt(d2) / (R * 0.23)) * front[i].depth * 0.2;
            ctx.beginPath();
            ctx.moveTo(front[i].sx, front[i].sy);
            ctx.lineTo(front[j].sx, front[j].sy);
            ctx.strokeStyle = `rgba(0,212,255,${fade})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      // Dots and labels
      projected.forEach(p => {
        if (!p.tag) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(0.4, p.depth * 2.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,212,255,${p.depth * 0.75 + 0.05})`;
          ctx.fill();
        } else {
          if (p.rz < -0.45) return;
          const a  = Math.min(1, (p.rz + 0.55) * 1.6);
          const fs = Math.round(8 + p.depth * 5);
          ctx.font = `600 ${fs}px 'Space Mono', monospace`;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          const tw = ctx.measureText(p.tag).width;
          const px = 9, py = 5, bw = tw + px * 2, bh = fs + py * 2;
          const cc = p.rz > 0 ? '0,212,255' : '168,85,247';
          ctx.fillStyle   = `rgba(${cc},${0.11 * a})`;
          ctx.strokeStyle = `rgba(${cc},${0.55 * a})`;
          ctx.lineWidth   = 0.8;
          rrect(p.sx - bw / 2, p.sy - bh / 2, bw, bh, 4);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = `rgba(${cc},${a})`;
          ctx.fillText(p.tag, p.sx, p.sy);
        }
      });

      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
  })();

  /* ── 3-D CARD TILT ──────────────────────────────────────── */
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── PROJECT FILTER ─────────────────────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.classList.remove('hidden', 'reveal-filter');
          void card.offsetWidth;
          card.classList.add('reveal-filter');
        } else {
          card.classList.add('hidden');
          card.classList.remove('reveal-filter');
        }
      });
    });
  });

  /* ── AI CHAT WIDGET ─────────────────────────────────────── */
  (function initAIChat() {
    // ─── CONFIG: paste your OpenAI key here ──────────────────
    // WARNING: for production, proxy this through your own server
    // so the key is never exposed in client-side code.
    const OPENAI_KEY = 'YOUR_OPENAI_API_KEY_HERE';
    // ─────────────────────────────────────────────────────────

    const SYSTEM_PROMPT = `You are an AI assistant embedded in a web developer's portfolio website.
The developer's specialties: WordPress development, custom WordPress plugin development, Shopify theme development, Wix (Velo) development, SEO strategy, AI integrations (OpenAI API), React, PHP, Node.js, Google Cloud, AWS.
You help website visitors understand the developer's services, provide rough ballpark estimates, explain technologies used, and encourage them to get in touch for a proper quote.
Keep answers concise (2-4 sentences max), helpful, and professional. If asked about pricing always say it depends on scope and encourage contacting via the form. Never invent specific project examples you don't know about.`;

    const fab      = document.getElementById('aiFab');
    const panel    = document.getElementById('aiPanel');
    const closeBtn = document.getElementById('aiClose');
    const messages = document.getElementById('aiMessages');
    const form     = document.getElementById('aiForm');
    const input    = document.getElementById('aiInput');
    const badge    = document.getElementById('aiBadge');
    const quickBtns = document.querySelectorAll('.ai-quick');

    if (!fab || !panel) return;

    const history = [{ role: 'system', content: SYSTEM_PROMPT }];
    let open = false;

    function openPanel() {
      open = true;
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('visible'));
      fab.querySelector('.ai-fab__icon--open').hidden  = true;
      fab.querySelector('.ai-fab__icon--close').hidden = false;
      badge.style.display = 'none';
      input.focus();
    }
    function closePanel() {
      open = false;
      panel.classList.remove('visible');
      panel.addEventListener('transitionend', () => { if (!open) panel.hidden = true; }, { once: true });
      fab.querySelector('.ai-fab__icon--open').hidden  = false;
      fab.querySelector('.ai-fab__icon--close').hidden = true;
    }

    fab.addEventListener('click', () => open ? closePanel() : openPanel());
    closeBtn.addEventListener('click', closePanel);

    function addMsg(role, text) {
      const div = document.createElement('div');
      div.className = `ai-msg ai-msg--${role === 'user' ? 'user' : 'bot'}`;
      div.innerHTML = `<div class="ai-msg__bubble">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    function addTyping() {
      const div = document.createElement('div');
      div.className = 'ai-msg ai-msg--bot ai-msg--typing';
      div.innerHTML = '<div class="ai-msg__bubble"><span class="ai-dots"><span></span><span></span><span></span></span></div>';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    async function sendMessage(userText) {
      if (!userText.trim()) return;
      document.getElementById('aiQuickBtns').style.display = 'none';

      addMsg('user', userText);
      history.push({ role: 'user', content: userText });
      input.value = '';
      input.disabled = true;

      const typingEl = addTyping();

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: history,
            max_tokens: 200,
            temperature: 0.7,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I couldn\'t get a response.';
        history.push({ role: 'assistant', content: reply });
        typingEl.remove();
        addMsg('assistant', reply);

      } catch (err) {
        typingEl.remove();
        if (OPENAI_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
          addMsg('assistant', '⚠️ Please set your OpenAI API key in app.js to enable the AI assistant.');
        } else {
          addMsg('assistant', `⚠️ Something went wrong: ${err.message}`);
        }
      } finally {
        input.disabled = false;
        input.focus();
      }
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      sendMessage(input.value);
    });

    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => sendMessage(btn.dataset.q));
    });
  })();

})();
