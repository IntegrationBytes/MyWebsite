(function(){
  const STORAGE_KEY = 'admin_guides_v1';
  const NOTES_KEY = 'admin_service_notes_v1';
  const defaultGuides = [
    {
      id: 'leadgen',
      title: 'AI Lead Gen Engine — Prompt pack',
      starters: [
        'ICP explainer: "You are a research assistant. Our ICP = {industry}, {company size}, {geo}. List 10 sources to find these accounts with pros/cons."',
        'Company research: "Given {company url}, extract: product, buyer, team size, tech used, recent news. Return JSON."',
        'First-touch draft: "Write a 120-word email for {persona} at {company}. Use 1 insight from research. CTA: quick intro call. No fluff."'
      ],
      checklist: [ 'Define ICP & geo', 'Pick 2 enrichers + dedupe rules', 'Write 2 first-touch templates', 'Set reply tracking' ]
    },
    {
      id: 'support',
      title: 'Support Automation — Prompt pack',
      starters: [
        'Intent def: "Classify ticket into one of {top intents}. Return {intent, confidence}."',
        'Macro suggestions: "Given ticket {text}, propose 2 macro responses with variables filled. Keep to our tone guidelines: {style}."',
        'Doc gap: "Given unresolved tickets for 7 days, propose 3 doc updates that would have answered them."'
      ],
      checklist: [ 'List top 20 intents', 'Map each to macro or doc', 'Enable shadow mode', 'Weekly CSAT/containment review' ]
    },
    {
      id: 'programmatic',
      title: 'Programmatic SEO — Prompt pack',
      starters: [
        'Schema design: "We need a template for {page type}. Propose fields and validation. Examples: ..."',
        'Outline: "Using fields {fields}, draft an outline with H1-H3 and 3 bullets/section."',
        'QA: "Given generated page text, check for duplication against {canon url}. Return issues and fixes."'
      ],
      checklist: [ 'Define template fields', 'Edge-case content rules', 'Human review checklist', 'OG image rules' ]
    },
    {
      id: 'search',
      title: 'Search & Insights — Prompt pack',
      starters: [
        'Synonyms: "From top 100 failed queries, propose synonyms/redirects with confidence."',
        'Answer style: "Given docs {links}, answer succinctly and cite 2 sources with anchors."',
        'Ranking QA: "Given query {q} and results {r}, suggest re-ranking signals to improve top 3."'
      ],
      checklist: [ 'Connect 2 sources', 'Add synonyms file', 'Collect failed queries', 'Weekly tuning review' ]
    },
    {
      id: 'meeting',
      title: 'Meeting Memory — Prompt pack',
      starters: [
        'Summary: "Summarize call into: goals, decisions, risks, actions (owner, due date)."',
        'Email draft: "Write a follow-up email recapping decisions and actions. Keep to 120 words."'
      ],
      checklist: [ 'Choose CRM fields', 'Define action labels', 'Set nudge cadence' ]
    }
  ];

  function loadGuides(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||''); } catch { return null; }
  }
  function saveGuides(data){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }
  function loadNotes(){
    try { return JSON.parse(localStorage.getItem(NOTES_KEY)||'{}'); } catch { return {}; }
  }
  function saveNotes(data){
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(data)); } catch {}
  }
  function currentGuides(){ return loadGuides() || defaultGuides; }

  function render(list){
    const el = document.getElementById('guides');
    const edit = document.getElementById('edit-mode')?.checked;
    const notes = loadNotes();
    el.innerHTML = list.map((g, idx) => `
      <div class="card">
        <div class="small-label">${g.id}</div>
        <h3>${g.title}</h3>
        <details open>
          <summary>Prompt starters</summary>
          ${edit ? `<textarea data-field="starters" data-idx="${idx}" style="width:100%; min-height:120px;">${g.starters.join('\n')}</textarea>` : `<pre><code>${g.starters.map(s=>`- ${s}`).join('\n')}</code></pre>`}
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">${g.starters.map(s=>`<button class="btn small" data-copy="${encodeURIComponent(s)}">Copy</button>`).join('')}</div>
        </details>
        <details>
          <summary>Implementation checklist</summary>
          ${edit ? `<textarea data-field="checklist" data-idx="${idx}" style="width:100%; min-height:80px;">${g.checklist.join('\n')}</textarea>` : `<ul class="list">${g.checklist.map(i=>`<li>• ${i}</li>`).join('')}</ul>`}
        </details>
        <details>
          <summary>Accumulated notes</summary>
          <textarea data-note="${g.id}" style="width:100%; min-height:90px;">${(notes[g.id]||'')}</textarea>
          <div class="small-label">These notes are private and stored locally in this browser.</div>
        </details>
      </div>`).join('');

    // Bind copy buttons
    el.querySelectorAll('[data-copy]')?.forEach(b => {
      b.addEventListener('click', () => {
        const text = decodeURIComponent(b.getAttribute('data-copy')||'');
        navigator.clipboard?.writeText(text);
        b.textContent = 'Copied'; setTimeout(()=> b.textContent = 'Copy', 1200);
      });
    });
    // Persist notes live
    el.querySelectorAll('textarea[data-note]')?.forEach(t => {
      t.addEventListener('input', () => { const n = loadNotes(); n[t.getAttribute('data-note')] = t.value; saveNotes(n); });
    });
  }

  function exportMarkdown(){
    const gs = currentGuides();
    const md = gs.map(g => `### ${g.title}\n\n#### Prompt starters\n${g.starters.map(s=>`- ${s}`).join('\n')}\n\n#### Checklist\n${g.checklist.map(c=>`- ${c}`).join('\n')}`).join('\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'guides_prompts.md'; a.click();
  }
  function exportNotes(){
    const blob = new Blob([JSON.stringify(loadNotes(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'service_notes.json'; a.click();
  }

  document.addEventListener('DOMContentLoaded', () => {
    render(currentGuides());
    const q = document.getElementById('q');
    q?.addEventListener('input', () => {
      const v = (q.value||'').toLowerCase(); const gs = currentGuides();
      render(gs.filter(g => g.title.toLowerCase().includes(v) || g.id.includes(v)));
    });
    document.getElementById('export-md')?.addEventListener('click', exportMarkdown);
    document.getElementById('export-notes')?.addEventListener('click', exportNotes);
    document.getElementById('edit-mode')?.addEventListener('change', () => render(currentGuides()));
    // Save on blur from edit areas
    document.addEventListener('blur', (e) => {
      const ta = e.target; if (!(ta instanceof HTMLTextAreaElement)) return;
      const field = ta.getAttribute('data-field'); const idx = ta.getAttribute('data-idx');
      if (!field || idx==null) return;
      const gs = currentGuides();
      const lines = ta.value.split(/\n+/).map(s=>s.trim()).filter(Boolean);
      gs[Number(idx)][field] = lines;
      saveGuides(gs);
    }, true);
  });
})();


