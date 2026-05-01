// Konami code easter egg → matrix rain.
export function initEaster() {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let i = 0;
  window.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === seq[i]) {
      i++;
      if (i === seq.length) {
        i = 0;
        triggerMatrix();
      }
    } else {
      i = k === seq[0] ? 1 : 0;
    }
  });
}

function triggerMatrix() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:140;pointer-events:none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize(); window.addEventListener('resize', resize);
  const fs = 14;
  const cols = Math.floor(canvas.width / fs);
  const drops = new Array(cols).fill(1);
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ01';
  let raf = 0, cancel = false;
  setTimeout(() => { cancel = true; cancelAnimationFrame(raf); canvas.remove(); }, 7000);
  const draw = () => {
    if (cancel || !ctx) return;
    ctx.fillStyle = 'rgba(5,6,10,.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fs}px JetBrains Mono, monospace`;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00ffd1';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, drops[i] * fs);
      if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    raf = requestAnimationFrame(draw);
  };
  draw();
}
