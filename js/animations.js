/* ─── js/animations.js ────────────────────────────────────
   Scroll reveal, stat counters, typewriter, hero globe,
   3-D card tilt, and page preloader.
   ─────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const C = window.SiteConfig || {};

  /* ── SCROLL REVEAL ────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const siblings = [...el.parentElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')];
      const idx      = siblings.indexOf(el);
      setTimeout(() => el.classList.add('in'), idx * 90);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  const counters   = document.querySelectorAll('.stat__num[data-target]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const start  = performance.now();
      const tick   = now => {
        const pct  = Math.min((now - start) / dur, 1);
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

  /* ── TYPEWRITER ───────────────────────────────────────── */
  (function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const phrases = (C.typewriterPhrases && C.typewriterPhrases.length)
      ? C.typewriterPhrases
      : ['amazing web experiences.'];

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

  /* ── INTERACTIVE GLOBE ────────────────────────────────── */
  (function initGlobe() {
    const canvas = document.getElementById('heroGlobe');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let CW, CH, cx, cy, R;

    // Use tool names from config for globe tags
    const TAGS = (C.tools && C.tools.length)
      ? C.tools.map(t => t.name)
      : ['PHP','CSS3','HTML5','JavaScript','WordPress','AWS','React','SEO','Shopify','Wix','REST API','GPT-4','WooCommerce','Node.js'];

    const N = 180;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = [];

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const t = golden * i;
      pts.push({ ox: Math.cos(t) * r, oy: y, oz: Math.sin(t) * r, tag: null });
    }
    TAGS.forEach((tag, i) => { pts[Math.round(i * N / TAGS.length)].tag = tag; });

    let rotX = 0.25, rotY = 0, tgtX = 0.25, mouseOffX = 0, autoY = 0, onHero = false;

    const heroEl = document.getElementById('home');
    if (heroEl) {
      heroEl.addEventListener('mousemove', e => {
        const r   = heroEl.getBoundingClientRect();
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

      const front   = projected.filter(p => !p.tag && p.rz > 0);
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

  /* ── 3-D CARD TILT ────────────────────────────────────── */
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── PRELOADER ────────────────────────────────────────── */
  const preloader     = document.getElementById('preloader');
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

})();
