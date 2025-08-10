(function(){
  // Respect user's reduced motion preference, allow override via hash or localStorage
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const override = (location.hash && /(^|[#&?])fx(=on)?/i.test(location.hash)) || localStorage.getItem('fx') === 'on';
  if (reduce && !override) return;

  const canvas = document.getElementById('code-rain');
  if (!canvas) return; // only run on pages that include the canvas

  const ctx = canvas.getContext('2d');
  // Cap DPR to keep text drawing cheap (lower if reduced motion override)
  const dpr = Math.min(reduce && override ? 1 : 1.5, window.devicePixelRatio || 1);
  const glyphs = '01△◇◈⌘✧⟂⊙∴'.split('');

  let W = 0, H = 0;
  let colWidth = Math.floor(14 * dpr);
  let maxColumns = reduce && override ? 40 : 72; // safety cap
  let yPositions = [];
  let lastTs = 0;
  let paused = false;

  function resize(){
    const b = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(b.width * dpr));
    canvas.height = Math.max(1, Math.floor(b.height * dpr));
    W = canvas.width; H = canvas.height;
    const count = Math.min(maxColumns, Math.max(8, Math.floor(W / colWidth)));
    yPositions = new Array(count).fill(0).map(()=> (-Math.random() * H));
    ctx.font = `${Math.floor(14*dpr)}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  document.addEventListener('visibilitychange', ()=>{ paused = document.hidden; });

  function draw(ts){
    if (paused) { lastTs = ts; return; }
    const dt = Math.min(66, ts - lastTs || 16);
    if (ts - lastTs < (reduce && override ? 66 : 40)) return; // throttle
    lastTs = ts;

    // fade trail
    ctx.fillStyle = 'rgba(5,8,7,0.08)';
    ctx.fillRect(0,0,W,H);

    const cols = yPositions.length;
    const speed = (reduce && override ? 70 : 120) * dpr; // px/sec
    for (let i=0;i<cols;i++){
      const x = i * colWidth;
      const y = yPositions[i];
      ctx.fillStyle = 'rgba(0,255,149,0.65)';
      ctx.fillText(glyphs[(Math.random()*glyphs.length)|0], x, y);
      const ny = y + speed * (dt/1000);
      yPositions[i] = (ny > H + 20) ? (-Math.random()*H*0.5) : ny;
    }
  }

  function tick(ts){
    try { draw(ts||0); } catch {}
    requestAnimationFrame(tick);
  }
  // Start immediately for visibility
  requestAnimationFrame(tick);
})();