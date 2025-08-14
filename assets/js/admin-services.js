(function(){
  const services = [
    {
      id: 'leadgen',
      title: 'AI Lead Gen Engine',
      kpis: ['Replies %', 'Meetings booked', 'Delivered leads/week'],
      stack: ['Python/TypeScript', 'Playwright + Scrapers', 'OpenAI/Claude', 'PostgreSQL/SQLite', 'Listmonk/HubSpot optional'],
      integrations: ['LinkedIn Sales Navigator (export/manual)', 'Apollo/Clay/Peopledatalabs', 'Email provider (SES/Resend)', 'CRMs: HubSpot/Pipedrive'],
      security: ['Respect robots/ToS; throttle; proxy pool', 'PII minimization; encrypt tokens', 'Audit logs for outreach'],
      plan: [
        'Define ICP and geo; list sources & enrichers',
        'Implement research + enrichment + dedupe jobs',
        'Draft first-touch templates with variables',
        'Ship pilot; measure replies/positives; handover'
      ]
    },
    {
      id: 'support',
      title: 'Support Automation',
      kpis: ['Containment %', 'CSAT', 'Avg first-response time'],
      stack: ['RAG: pgvector/FAISS', 'Node/Express API', 'Worker queue (Bull/Temporal optional)', 'Observability: OpenTelemetry'],
      integrations: ['Zendesk/Intercom/Freshdesk', 'Docs (GitHub, Notion, Confluence)', 'Auth (JWT/OAuth)'],
      security: ['No training on customer data by default', 'PII redaction; role‑based access', 'Prompt logging with hashing'],
      plan: [
        'Map top intents/deflection candidates',
        'Index docs; craft tools (macros, handoff rules)',
        'Shadow mode, then gated assist',
        'Gradual automation; weekly KPI review'
      ]
    },
    {
      id: 'copilots',
      title: 'Ops Copilots',
      kpis: ['Hours saved/user', 'Quality score', 'Adoption %'],
      stack: ['Next.js or Vanilla Web Components', 'Node/Express', 'LLM via SDK', 'Postgres/SQLite'],
      integrations: ['Google Sheets/Drive', 'Slack/Email', 'Internal APIs'],
      security: ['Silo per tenant', 'Human‑in‑the‑loop approval', 'Action whitelists'],
      plan: ['Choose 1–2 high‑leverage workflows', 'Ship secure MVP', 'Collect feedback logs', 'Harden + roll out']
    },
    {
      id: 'search',
      title: 'Search & Insights',
      kpis: ['Search success rate', 'Time‑to‑answer', 'Adoption'],
      stack: ['Indexers + normalizers', 'Embeddings store (pgvector/Qdrant)', 'Rerank (Cross‑Encoder)', 'Pagefind for public'],
      integrations: ['GitHub, Notion, Confluence, Google Drive'],
      security: ['Per‑doc ACLs; signed URLs', 'PII filters', 'Access logs'],
      plan: ['Connect sources', 'Index + dedupe', 'Tune ranking & filters', 'Ship dashboard + feedback']
    },
    {
      id: 'programmatic',
      title: 'SEO + Programmatic Pages',
      kpis: ['Indexed pages', 'Non‑brand impressions', 'CVR'],
      stack: ['Node static site (this repo style)', 'Templates + data model', 'OG image pipeline (satori/resvg)'],
      integrations: ['Search Console', 'Analytics (Umami/GA4)'],
      security: ['Change review flow', 'Content QA queue'],
      plan: ['Define schema & slots', 'Build generator + QA rules', 'Publish batch', 'Monitor indexing + iterate']
    },
    {
      id: 'pipelines',
      title: 'Data Pipelines',
      kpis: ['Freshness SLO', 'Failed jobs', 'Dashboard usage'],
      stack: ['Airbyte/Singer/Custom pulls', 'dbt transforms', 'Warehouse (Postgres/BigQuery/Snowflake)'],
      integrations: ['SaaS sources (Stripe, HubSpot, GitHub, etc.)'],
      security: ['Secrets in env/valut', 'Row‑level policies', 'Tests per model'],
      plan: ['Map sources/owners', 'Create staging + marts', 'Dashboards + anomaly alerts', 'Docs + handover']
    },
    {
      id: 'docs',
      title: 'Auto‑Generated Docs',
      kpis: ['Coverage %', 'Doc build time', 'Searchable topics'],
      stack: ['Shiki highlighting', 'MDX/Markdown pipeline', 'OG image generation'],
      integrations: ['GitHub Actions/CI'],
      security: ['No secrets in examples; review CI artifacts'],
      plan: ['Extract code comments', 'Generate guides', 'Link to search', 'Publish previews per PR']
    },
    {
      id: 'meeting',
      title: 'Meeting Memory',
      kpis: ['Time to follow‑up', 'Tasks captured', 'CRM completeness'],
      stack: ['Transcription API', 'LLM summary/actions', 'CRM SDK'],
      integrations: ['Zoom/GMeet', 'HubSpot/Salesforce'],
      security: ['Data retention policy', 'Speaker consent notes'],
      plan: ['Capture audio/artifacts', 'Summaries + actions', 'Push to CRM', 'Nudges next day']
    },
    {
      id: 'ds',
      title: 'Data Science',
      kpis: ['Forecast error (MAPE)', 'Lift vs baseline', 'Experiment power'],
      stack: ['Python (pandas, statsmodels, sklearn)', 'Notebooks + reports', 'Feature store optional'],
      integrations: ['Warehouse connectors'],
      security: ['PII handling; anonymization', 'Model cards'],
      plan: ['Frame problem + metrics', 'Baseline model', 'Backtests', 'Roadmap']
    },
    {
      id: 'salesqa',
      title: 'Sales Call QA & Coaching',
      kpis: ['Talk track adherence', 'Objection resolution', 'Time‑to‑follow‑up'],
      stack: ['Transcribe + diarize', 'LLM tagger', 'CRM integration'],
      integrations: ['Gong/Zoom', 'HubSpot/Salesforce'],
      security: ['PII redaction', 'Access based on team'],
      plan: ['Define taxonomy', 'Auto‑tag+summary', 'Coach nudges', 'Weekly review']
    },
    {
      id: 'compliance',
      title: 'Compliance & Risk Monitor',
      kpis: ['Issues opened/closed', 'Time‑to‑remediate', 'Policy drift score'],
      stack: ['Scanners (trufflehog, custom rules)', 'LLM classifiers', 'Task queue + reporter'],
      integrations: ['GitHub, GDrive, Slack'],
      security: ['Read‑only scopes', 'PII minimization'],
      plan: ['Pick repos/dirs', 'Run scanners weekly', 'Open issues + tasks', 'Report with trends']
    },
    {
      id: 'partnerships',
      title: 'Partnership Pages @ Scale',
      kpis: ['Pages shipped', 'Partner responses', 'Organic clicks'],
      stack: ['Templates + datasets', 'Email outreach generator', 'OG image generator'],
      integrations: ['Search Console', 'CRM/Outreach tool'],
      security: ['Brand/usage approvals'],
      plan: ['Define template', 'Import partner data', 'Generate + review', 'Publish + outreach sequence']
    }
  ];

  function render(list){
    const el = document.getElementById('playbooks');
    el.innerHTML = list.map(s => `
      <div class="card">
        <div class="small-label">${s.id}</div>
        <h3>${s.title}</h3>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          ${s.kpis.map(k=>`<span class="pill">KPI: ${k}</span>`).join('')}
        </div>
        <details open>
          <summary>Stack</summary>
          <ul class="list">${s.stack.map(i=>`<li>• ${i}</li>`).join('')}</ul>
        </details>
        <details>
          <summary>Integrations</summary>
          <ul class="list">${s.integrations.map(i=>`<li>• ${i}</li>`).join('')}</ul>
        </details>
        <details>
          <summary>Security</summary>
          <ul class="list">${s.security.map(i=>`<li>• ${i}</li>`).join('')}</ul>
        </details>
        <details>
          <summary>Implementation plan</summary>
          <ol class="list checklist">${s.plan.map(i=>`<li>✅ ${i}</li>`).join('')}</ol>
        </details>
      </div>
    `).join('');
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify(services, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'service_playbooks.json'; a.click();
  }
  function exportMarkdown(){
    const md = services.map(s => `## ${s.title}\n\n- **KPIs**: ${s.kpis.join(', ')}\n- **Stack**: ${s.stack.join(', ')}\n- **Integrations**: ${s.integrations.join(', ')}\n- **Security**: ${s.security.join(', ')}\n- **Plan**:\n${s.plan.map(p=>`  1. ${p}`).join('\n')}`).join('\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'service_playbooks.md'; a.click();
  }

  document.addEventListener('DOMContentLoaded', () => {
    render(services);
    const q = document.getElementById('q');
    q?.addEventListener('input', () => {
      const v = (q.value||'').toLowerCase();
      render(services.filter(s => s.title.toLowerCase().includes(v) || s.id.includes(v)));
    });
    document.getElementById('export-json')?.addEventListener('click', exportJSON);
    document.getElementById('export-md')?.addEventListener('click', exportMarkdown);
  });
})();



