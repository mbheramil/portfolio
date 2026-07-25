// Konami code easter egg → matrix rain. runMatrix is also used by the terminal.
export function initEaster() {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let i = 0;
  window.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === seq[i]) {
      i++;
      if (i === seq.length) {
        i = 0;
        runMatrix();
      }
    } else {
      i = k === seq[0] ? 1 : 0;
    }
  });
}

let matrixRunning = false;
export function runMatrix() {
  if (matrixRunning) return;
  matrixRunning = true;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:140;pointer-events:none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); matrixRunning = false; return; }
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize(); window.addEventListener('resize', resize);
  const fs = 14;
  const cols = Math.floor(canvas.width / fs);
  const drops = new Array(cols).fill(1);
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ01';
  let raf = 0, cancel = false;
  setTimeout(() => {
    cancel = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    canvas.remove();
    matrixRunning = false;
  }, 7000);
  const draw = () => {
    if (cancel || !ctx) return;
    ctx.fillStyle = 'rgba(14,14,16,.09)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fs}px JetBrains Mono, monospace`;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f0a648';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, drops[i] * fs);
      if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    raf = requestAnimationFrame(draw);
  };
  draw();
}
