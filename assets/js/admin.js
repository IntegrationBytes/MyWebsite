(async function(){
  // Umami shared dashboard embed (optional)
  try {
    const target = document.getElementById('umami');
    if (target) {
      if (window.UMAMI_SHARE_URL) {
        target.innerHTML = `<iframe src="${window.UMAMI_SHARE_URL}" style="width:100%;height:400px;border:1px solid rgba(255,255,255,.1);border-radius:12px;"></iframe>`;
      } else {
        target.innerHTML = '<p class="muted">Set UMAMI_SHARE_URL to display charts.</p>';
      }
    }
  } catch {}

  // Leads listing from JSON (optional)
  try {
    const target = document.getElementById('leads');
    if (target) {
      if (window.LEADS_ADMIN_JSON_URL) {
        const res = await fetch(window.LEADS_ADMIN_JSON_URL, { cache:'no-store' });
        const leads = await res.json();
        target.innerHTML = (leads||[]).slice(0,50).map(l => `
          <div class="card">
            <div class="small-label">${new Date(l.ts||Date.now()).toLocaleString()}</div>
            <div>${l.name||''} — ${l.email||''}</div>
            <div class="muted">${(l.details||'').slice(0,200)}</div>
          </div>`).join('');
      } else {
        target.innerHTML = '<p class="muted">Set LEADS_ADMIN_JSON_URL to list captured leads.</p>';
      }
    }
  } catch { const t = document.getElementById('leads'); if (t) t.innerHTML = '<p class="muted">Failed to load leads.</p>'; }

  // Webmentions
  try {
    const target = document.getElementById('wm');
    if (target) {
      const r = await fetch('/webmentions.json', { cache:'no-store' });
      const data = await r.json();
      const items = (data.children||[]).slice(0,10);
      target.innerHTML = items.map(m => `<div class="card"><div>${(m.author&&m.author.name)||''}</div><a class="muted" href="${m.url||m['wm-source']||'#'}">${m['wm-prop']||''}</a></div>`).join('');
    }
  } catch {}

  // Content audit: list pages from sitemap with missing meta/headers
  async function runAudit(){
    try {
      const target = document.getElementById('audit');
      if (!target) return;
      target.innerHTML = '<p class="muted">Scanning…</p>';
      const res = await fetch('../sitemap.xml', { cache: 'no-store' });
      const xml = await res.text();
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const urls = Array.from(doc.querySelectorAll('url loc')).map(n=>n.textContent||'');
      const rows = [];
      for (const u of urls) {
        try {
          const r = await fetch(new URL(u, location.origin).pathname, { cache: 'no-store' });
          const html = await r.text();
          const d = new DOMParser().parseFromString(html, 'text/html');
          const h1 = (d.querySelector('h1')?.textContent||'').trim();
          const desc = d.querySelector('meta[name="description"]')?.getAttribute('content')||'';
          const hasOg = !!d.querySelector('meta[property="og:image"],meta[name="twitter:image"]');
          const issues = [];
          if (!h1) issues.push('missing h1');
          if (!desc) issues.push('missing description');
          if (!hasOg) issues.push('missing og image');
          rows.push({ u, h1, desc: !!desc, og: hasOg, issues });
        } catch {}
      }
      const onlyIssues = document.getElementById('audit-only-issues')?.checked;
      const filtered = onlyIssues ? rows.filter(r => r.issues.length) : rows;
      const summary = `${rows.filter(r=>!r.h1).length} missing h1 • ${rows.filter(r=>!r.desc).length} missing description • ${rows.filter(r=>!r.og).length} missing og image`;
      const sEl = document.getElementById('audit-summary'); if (sEl) sEl.textContent = summary;
      target.innerHTML = filtered.length ? filtered.map(r => `
        <div class="card">
          <div class="small-label">${r.u}</div>
          <div>${r.issues.length ? r.issues.map(i=>`<span class='badge'>${i}</span>`).join(' ') : '<span class="badge">ok</span>'}</div>
        </div>`).join('') : '<p class="muted">No issues detected.</p>';
      // bind export
      document.getElementById('audit-export')?.addEventListener('click', () => {
        const csv = ['url,missing_h1,missing_description,missing_og'].concat(rows.map(r=>`${r.u},${!r.h1},${!r.desc},${!r.og}`)).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'content_audit.csv'; a.click();
      }, { once: true });
    } catch {}
  }
  try {
    if (document.getElementById('audit')) {
      await runAudit();
      document.getElementById('audit-only-issues')?.addEventListener('change', runAudit);
      document.getElementById('audit-rescan')?.addEventListener('click', runAudit);
    }
  } catch {}

  // Tools: quick links and actions
  try {
    const target = document.getElementById('tools');
    if (target) {
      target.innerHTML = `
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <a class="btn small" href="./services.html">Service playbooks</a>
          <a class="btn small" href="../services/">View Services page</a>
          <a class="btn small" href="../assets/pdf/leadgen.pdf" target="_blank">Leadgen PDF</a>
          <button class="btn small" id="rebuild">Rebuild content</button>
        </div>`;
      document.getElementById('rebuild')?.addEventListener('click', async ()=>{
        try {
          await fetch('/scripts/generate.mjs', { method:'HEAD', cache:'no-store' });
          alert('Run `npm run build:content` locally to rebuild. In production, wire this to a webhook.');
        } catch { alert('Trigger not available in static environment.'); }
      });
    }
  } catch {}

  // Service PDFs list
  try {
    const target = document.getElementById('pdfs');
    if (target) {
      const pdfs = ['leadgen','support','copilots','search','programmatic','pipelines','docs','meeting','ds','salesqa','compliance','partnerships','linkedin','videokb'];
      target.innerHTML = pdfs.map(id => `<a class="tag" href="../assets/pdf/${id}.pdf" target="_blank">${id}.pdf</a>`).join(' ');
    }
  } catch {}
})();


