import { promises as fs } from 'node:fs';
import path from 'node:path';
import { readFile as readFileCb } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import PDFDocument from 'pdfkit';

const require = createRequire(import.meta.url);

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE_URL = process.env.SITE_URL || 'https://example.com';
const WEBMENTION_DOMAIN = process.env.WEBMENTION_DOMAIN || '';

function toUrl(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return `${SITE_URL}/${normalized}`.replace(/\/+$/, '/');
}

async function readFileSafe(file) {
  try { return await fs.readFile(file, 'utf8'); } catch { return ''; }
}

function parseFrontMatter(text) {
  if (!/^---\n/.test(text)) return null;
  const endIndex = text.indexOf('\n---');
  if (endIndex === -1) return null;
  const yaml = text.slice(4, endIndex).trim();
  const meta = {};
  yaml.split(/\n+/).forEach(line => {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) return;
    const key = m[1].trim();
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  });
  return meta;
}

function extract(regex, text) {
  const m = text.match(regex);
  return m ? (m[1] || '').trim() : '';
}

async function collectEntries(dir, type) {
  // type: 'essay' | 'project'
  const full = path.join(root, dir);
  const entries = [];
  const files = await fs.readdir(full);
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    if (file === 'index.html') continue;
    const abs = path.join(full, file);
    const rel = path.relative(root, abs);
    const stat = await fs.stat(abs);
    const text = await readFileSafe(abs);

    let title = '';
    let description = '';
    let dateIso = '';

    // Try HTML doc extraction
    if (/<!doctype html>/i.test(text)) {
      title = extract(/<h1[^>]*>([\s\S]*?)<\/h1>/i, text) || extract(/<title>([\s\S]*?)<\/title>/i, text);
      description = extract(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i, text);
      dateIso = extract(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/i, text);
    }

    // Fallback to front matter
    if (!title) {
      const fm = parseFrontMatter(text);
      if (fm) {
        title = fm.title || title || file.replace(/\.html$/, '');
        description = fm.description || description;
        dateIso = fm.date || dateIso;
      }
    }

    const lastmod = dateIso ? new Date(dateIso) : stat.mtime;
    entries.push({
      type,
      rel,
      pathAbs: abs,
      url: `${SITE_URL}/${rel.replace(/\\/g,'/')}`,
      title: title || file.replace(/\.html$/, ''),
      description: description || '',
      date: lastmod,
    });
  }
  return entries.sort((a,b) => b.date - a.date);
}

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function writeSitemap({ essays, projects }) {
  const staticPages = [
    { loc: `${SITE_URL}/`, lastmod: new Date() },
    { loc: `${SITE_URL}/essays/`, lastmod: new Date() },
    { loc: `${SITE_URL}/projects/`, lastmod: new Date() },
    { loc: `${SITE_URL}/search/`, lastmod: new Date() },
    { loc: `${SITE_URL}/services/`, lastmod: new Date() },
    { loc: `${SITE_URL}/products/`, lastmod: new Date() },
    { loc: `${SITE_URL}/speaking/`, lastmod: new Date() },
    { loc: `${SITE_URL}/press/`, lastmod: new Date() },
    { loc: `${SITE_URL}/community/`, lastmod: new Date() },
    { loc: `${SITE_URL}/privacy/`, lastmod: new Date() },
    { loc: `${SITE_URL}/terms/`, lastmod: new Date() },
    { loc: `${SITE_URL}/links/`, lastmod: new Date() },
    { loc: `${SITE_URL}/cv/`, lastmod: new Date() },
    { loc: `${SITE_URL}/contact/`, lastmod: new Date() },
  ];

  const formatUrl = (loc, date) => `  <url><loc>${xmlEscape(loc)}</loc><lastmod>${date.toISOString()}</lastmod></url>`;

  const items = [
    ...staticPages.map(p => formatUrl(p.loc, p.lastmod)),
    ...essays.map(e => formatUrl(e.url, e.date)),
    ...projects.map(p => formatUrl(p.url, p.date)),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
  await fs.writeFile(path.join(root, 'sitemap.xml'), xml, 'utf8');
}

async function writeRss({ essays }) {
  const lastBuildDate = new Date();
  const channelTitle = 'Vincent Viitala — Essays';
  const siteLink = SITE_URL + '/';
  const channelDesc = 'Essays on metaphysics, AI ethics, consciousness, and tools for thought.';

  const items = essays.map(e => `    <item>\n      <title>${xmlEscape(e.title)}</title>\n      <link>${xmlEscape(e.url)}</link>\n      <guid>${xmlEscape(e.url)}</guid>\n      <pubDate>${e.date.toUTCString()}</pubDate>\n      <description>${xmlEscape(e.description)}</description>\n    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${xmlEscape(channelTitle)}</title>\n    <link>${xmlEscape(siteLink)}</link>\n    <description>${xmlEscape(channelDesc)}</description>\n    <language>en-us</language>\n    <lastBuildDate>${lastBuildDate.toISOString()}</lastBuildDate>\n${items}\n  </channel>\n</rss>\n`;

  await fs.writeFile(path.join(root, 'rss.xml'), xml, 'utf8');
}

async function writeJsonFeed({ essays }){
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Vincent Viitala — Essays',
    home_page_url: SITE_URL + '/',
    feed_url: SITE_URL + '/feed.json',
    description: 'Essays on metaphysics, AI ethics, consciousness, and tools for thought.',
    items: essays.map(e => ({
      id: e.url,
      url: e.url,
      title: e.title,
      content_text: e.description,
      date_published: e.date.toISOString(),
    }))
  };
  await fs.writeFile(path.join(root, 'feed.json'), JSON.stringify(feed, null, 2), 'utf8');
}

async function ensureOgImages({ essays }){
  // Generate a simple OG card per essay using satori + resvg
  try {
    const satori = (await import('satori')).default;
    const { Resvg } = await import('@resvg/resvg-js');
    const outDir = path.join(root, 'assets', 'img', 'og');
    await fs.mkdir(outDir, { recursive: true });

    const fontData = await fs.readFile(path.join(root, 'assets', 'css', 'fonts', 'Inter-Regular.woff')).catch(()=>null);
    for (const e of essays) {
      const svg = await satori(
        {
          type: 'div',
          props: {
            style: { width: '1200px', height: '630px', display: 'flex', background: '#050807', color: '#e6f5ef', padding: '56px', fontFamily: 'Inter' },
            children: [
              { type: 'div', props: { style: { fontSize: '44px', fontWeight: 700, lineHeight: 1.2 }, children: e.title } },
              { type: 'div', props: { style: { marginTop: '16px', fontSize: '24px', opacity: .85 }, children: e.description || '' } },
              { type: 'div', props: { style: { marginTop: 'auto', fontSize: '18px', opacity: .8 }, children: 'vincentviitala.com' } },
            ]
          }
        },
        { width: 1200, height: 630, fonts: fontData ? [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }] : [] }
      );
      const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
      const slug = e.rel.split('/').pop().replace(/\.html$/, '');
      await fs.writeFile(path.join(outDir, `${slug}.png`), png);
    }
  } catch (err) {
    // Non-fatal; skip OG generation if deps not available
    console.warn('OG generation skipped:', err?.message || err);
  }
}

async function writeWebmentions(){
  if (!WEBMENTION_DOMAIN) return;
  try {
    const api = `https://webmention.io/api/mentions.jf2?domain=${encodeURIComponent(WEBMENTION_DOMAIN)}&per-page=2000`;
    const res = await fetch(api);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    await fs.writeFile(path.join(root, 'webmentions.json'), JSON.stringify(json, null, 2), 'utf8');
    console.log(`Fetched webmentions for ${WEBMENTION_DOMAIN}:`, (json.children||[]).length);
  } catch (err) {
    console.warn('Webmentions fetch skipped/failed:', err?.message || err);
  }
}

async function main() {
  const essays = await collectEntries('essays', 'essay');
  const projects = await collectEntries('projects', 'project');
  await writeSitemap({ essays, projects });
  await writeRss({ essays });
  await writeJsonFeed({ essays });
  await ensureOgImages({ essays });
  await writeWebmentions();
  await highlightCodeBlocks([...essays, ...projects]);
  await generateServicePdfs();
  console.log(`Generated sitemap.xml and rss.xml for`, essays.length, 'essays and', projects.length, 'projects');
}

async function highlightCodeBlocks(entries){
  try {
    const { codeToHtml } = await import('shiki');
    const theme = 'github-dark-dimmed';
    for (const e of entries){
      try {
        let html = await fs.readFile(e.pathAbs, 'utf8');
        if (!/<pre><code[\s\S]*?<\/code><\/pre>/i.test(html)) continue;
        if (/class="shiki"/i.test(html)) continue; // already highlighted
        const re = /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi;
        let out = '';
        let lastIndex = 0;
        let match;
        while ((match = re.exec(html))) {
          out += html.slice(lastIndex, match.index);
          const raw = match[1]
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
          const highlighted = await codeToHtml(raw, { lang: 'js', theme });
          out += highlighted;
          lastIndex = match.index + match[0].length;
        }
        out += html.slice(lastIndex);
        await fs.writeFile(e.pathAbs, out, 'utf8');
      } catch {}
    }
  } catch (err) {
    console.warn('Shiki highlight skipped:', err?.message || err);
  }
}

async function generateServicePdfs(){
  try {
    const outDir = path.join(root, 'assets', 'pdf');
    await fs.mkdir(outDir, { recursive: true });
    // Helper: PDFKit standard fonts use WinAnsi encoding; sanitize special glyphs
    const sanitizePdfText = (t = '') => t
      .replace(/→/g, '->')
      .replace(/[‑–—]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[’]/g, "'")
      .replace(/•/g, '-');

    // Visual tokens
    const BRAND = { fg: '#0BAF6C', hair: '#00FF95', text: '#0A0F0D' };
    const CTA_URL = 'https://calendly.com/viitala-vincent/30min';

    // Service catalog with pricing and persuasive content
    const services = [
      {
        id: 'linkedin',
        title: 'LinkedIn Thought-Leadership',
        desc: 'Brand-aligned generator, weekly cadence, human review, and scheduling.',
        price: '$2,500 pilot (4 weeks)',
        benefits: [
          'Voice kit + prompts tuned to founders/PMs',
          'Weekly content calendar & visuals',
          'Distribution playbook for engagement'
        ],
        audience: [
          'Founders and solo creators with limited time',
          'B2B startups (1–50 employees) building credibility',
          'Leaders seeking consistent weekly presence'
        ],
        proof: [
          '2–4× posting cadence maintained',
          'Engagement rate uplift within 4 weeks',
          'Inbound demos attributed to social content'
        ],
        why: [
          'Brand voice captured once, reused through templates',
          'Editorial calendar + assets keep cadence predictable',
          'Human review loop prevents off-tone posts'
        ],
        results: [
          '2–4x more posts with consistent tone',
          'Lift in profile visits and follows',
          'First inbound leads from social'
        ]
      },
      {
        id: 'videokb',
        title: 'Video -> Knowledge',
        desc: 'Pipeline from audio/video to notes, FAQs, snippets, and semantic search.',
        price: '$3,500 pilot (2 weeks)',
        benefits: [
          'Chapters + executive notes',
          'FAQ + snippet library for reuse',
          'Private semantic search over your corpus'
        ],
        audience: [
          'Content teams repurposing webinars/AMAs',
          'Education/enablement teams needing searchable notes',
          'Creators with large backlogs of video/audio'
        ],
        proof: [
          '50–70% faster show-note production',
          'Reusable FAQs reduce duplicate questions',
          'Private search increases knowledge reuse'
        ],
        why: [
          'Accurate transcription + diarization → reliable chunks',
          'Topic/FAQ extraction tuned to your domain',
          'Embeddings + simple UI make recall fast'
        ],
        results: [
          '50–70% faster from recording to publishable notes',
          'FAQ library answers repeat questions internally',
          'Search adoption across team'
        ]
      },
      {
        id: 'leadgen',
        title: 'AI Lead Gen Engine',
        desc: 'LLM-powered research, enrichment, and warm intro scoring for ICPs.',
        price: '$7,500 pilot (3-4 weeks)',
        benefits: [
          'Ideal customer profiles + scoring',
          'Personalized first-touch drafts',
          'Optional rev-share'
        ],
        audience: [
          'Founders/Heads of Sales at seed–Series A',
          'Outbound teams without full-time research ops',
          'B2B products with narrow ICPs'
        ],
        proof: [
          '20–40% higher reply rates on first touch',
          'Clean, enriched accounts for SDRs',
          'Repeatable weekly pipeline generation'
        ],
        why: [
          'Multi-source research + enrichment for precision',
          'De-duplication and scoring prioritize warmest leads',
          'Templates inject context without sounding robotic'
        ],
        results: [
          '20–40% lift in replies on pilot sequences',
          'Research time per account cut by hours',
          'More meetings booked from the same send volume'
        ]
      },
      {
        id: 'support',
        title: 'Support Automation',
        desc: 'RAG over docs, intent routing, macros, and CSAT tracking.',
        price: '$8,500 pilot (4 weeks)',
        benefits: [
          'Deflection without hallucinations',
          'Agent assist with suggested replies',
          'CSAT & containment measured weekly'
        ],
        audience: [
          'Support leaders with >300 tickets/month',
          'Teams with a maintained help center/FAQ',
          'Orgs aiming for 1st-response <6 minutes'
        ],
        proof: [
          '15–45% deflection on top intents',
          'First-response time reduction',
          'Measured CSAT lift via macros'
        ],
        why: [
          'Intent detection routes to macros or knowledge',
          'RAG with guardrails prevents hallucinations',
          'Shadow mode + human review before automation'
        ],
        results: [
          'Deflection on top intents within 2–4 weeks',
          'Lower TTR and escalations',
          'CSAT stable or improved with suggestions'
        ]
      },
      {
        id: 'copilots',
        title: 'Ops Copilots',
        desc: 'Internal GPT tools for sales, success, finance; summaries, QA, reporting.',
        price: '$6,500 pilot (3 weeks)',
        benefits: [ 'Secure internal tools', 'Audit trails + human-in-the-loop', 'Real-time reporting hooks' ],
        audience: [ 'RevOps/CS/Finance ops with repetitive workflows', 'Leaders needing faster reporting & QA', 'SMBs without in-house tooling bandwidth' ],
        proof: [ 'Hours saved per rep weekly', 'Reduction in QA cycle time', 'Higher reporting freshness' ],
        why: [ 'Action whitelists + approvals keep changes safe', 'UI built around one or two high-value workflows', 'Analytics built-in for iteration' ],
        results: [ '2–5 hours saved per user weekly', 'QA cycles down from days to hours', 'Team adoption >60% in pilot cohort' ]
      },
      {
        id: 'search',
        title: 'Search & Insights',
        desc: 'Private semantic search across knowledge silos; RAG for teams.',
        price: '$6,000 pilot (2-3 weeks)',
        benefits: [ 'Unified index across docs/repos', 'Tuned ranking + filters', 'Usage dashboards + alerts' ],
        audience: [ 'Engineering/Product orgs with fragmented docs', 'Enablement teams needing a single source of truth', 'Teams with Slack/drive/wiki sprawl' ],
        proof: [ 'Search success rate increase', 'Lower time-to-answer for internal questions', 'Adoption across multiple teams' ],
        why: [ 'Connectors normalize docs with per-doc ACLs', 'Embedding + lexical blend for relevance', 'Feedback loop tunes synonyms and ranking' ],
        results: [ 'Higher search success on common queries', 'Faster time-to-answer for engineers', 'Reductions in repeated Slack questions' ]
      },
      {
        id: 'programmatic',
        title: 'SEO + Programmatic Pages',
        desc: 'Data-driven page generation with quality guardrails and human QA.',
        price: '$9,500 pilot (4 weeks)',
        benefits: [ 'Schema + templates', 'Guardrails + human QA loop', 'Publish pipeline + OG images' ],
        audience: [ 'Growth/Content leads with structured data', 'Marketplaces/directories needing long-tail pages', 'Startups with limited content bandwidth' ],
        proof: [ 'Indexation of hundreds of long-tail pages', 'Non-branded organic traffic growth', 'Measured conversions from long-tail' ],
        why: [ 'Templates + schema enforce quality at scale', 'Guardrails prevent thin/duplicative pages', 'OG image pipeline improves CTR' ],
        results: [ 'Hundreds of pages indexed', 'Non-brand impressions rise on long-tail', 'Long-tail conversions attributed' ]
      },
      {
        id: 'pipelines',
        title: 'Data Pipelines',
        desc: 'ETL to warehouse; self-serve dashboards; anomaly alerts.',
        price: '$7,500 pilot (3-4 weeks)',
        benefits: [ 'Ingest + model + tests', 'Dashboards + alerts', 'Docs + handover' ],
        audience: [ 'Ops/Analytics leads unifying SaaS data', 'Teams migrating to a modern warehouse', 'Leaders who need daily KPIs' ],
        proof: [ 'Reliable daily refresh', 'Alerting on anomalies', 'Executive dashboard adoption' ],
        why: [ 'dbt models + tests catch breakage early', 'Source connectors monitored for freshness', 'Dashboards tied to owners and SLOs' ],
        results: [ 'Freshness SLO met >95%', 'Fewer broken dashboards', 'Executives view daily KPIs' ]
      },
      {
        id: 'docs',
        title: 'Auto-Generated Docs',
        desc: 'Code->docs pipelines, Shiki-rendered guides, OG images at build.',
        price: '$4,500 pilot (2 weeks)',
        benefits: [ 'Code-to-docs pipeline', 'Searchable guides', 'OG images & versioning' ],
        audience: [ 'DevRel/Docs teams with understaffing', 'Engineering teams with poor doc coverage', 'Open-source maintainers' ],
        proof: [ 'Doc coverage improved each release', 'Reduced onboarding questions', 'Consistent OG/social previews' ],
        why: [ 'Docs generated at build ensure freshness', 'Syntax-highlighted guides improve readability', 'OG images boost sharing' ],
        results: [ 'Coverage grows each release', 'Onboarding questions decline', 'Blog/social shares increase' ]
      },
      {
        id: 'meeting',
        title: 'Meeting Memory',
        desc: 'Summaries, actions, CRM enrichment, and follow-up nudges.',
        price: '$3,500 pilot (2 weeks)',
        benefits: [ 'Accurate summaries', 'Action extraction', 'CRM sync + nudges' ],
        audience: [ 'Sales/Success managers overseeing many calls', 'Founders juggling customer discovery', 'Internal enablement teams' ],
        proof: [ 'Follow-up time cut significantly', 'More reliable action tracking', 'Cleaner CRM notes' ],
        why: [ 'Speaker diarization + timestamps → reliable notes', 'Action extraction mapped to your CRM fields', 'Next-day nudges close loops' ],
        results: [ 'Faster follow-ups with checklists', 'Richer structured notes in CRM', 'Better handoffs between teams' ]
      },
      {
        id: 'ds',
        title: 'Data Science',
        desc: 'Forecasting, churn, pricing, and experimentation frameworks.',
        price: '$6,500 discovery (2 weeks)',
        benefits: [ 'Clear problem framing', 'Baseline model + metrics', 'Roadmap for iteration' ],
        audience: [ 'Growth/Product leaders framing a data problem', 'CFO/COO seeking forecasting clarity', 'Teams needing an experimentation framework' ],
        proof: [ 'Baseline model shipped in discovery', 'Metric definitions & guardrails agreed', 'Roadmap with confidence bands' ],
        why: [ 'Baseline first to avoid premature complexity', 'Clear metrics + guardrails prevent metric drift', 'Experiment design bakes in power analysis' ],
        results: [ 'Forecast error (MAPE) reduced vs naive', 'Churn/pricing model with AUC/Lift targets', 'Experiment plan with sample sizes' ]
      },
      {
        id: 'salesqa',
        title: 'Sales Call QA & Coaching',
        desc: 'Objection tagging, playbook nudges, CRM notes, follow-up drafts.',
        price: '$5,000 pilot (2-3 weeks)',
        benefits: [ 'Auto summaries + tags', 'Coaching nudges', 'Follow-up draft emails' ],
        audience: [ 'Sales leaders coaching at scale', 'Enablement teams standardizing process', 'Teams with <10 managers per 100 reps' ],
        proof: [ 'Higher adherence to talk tracks', 'Consistent tagging for analytics', 'Shorter time-to-follow-up' ],
        why: [ 'Defined taxonomy + QA forms keep tags useful', 'Real-time cues nudge reps—not distract', 'Follow-up generator accelerates next steps' ],
        results: [ 'More consistent talk-track adherence', 'Useful analytics from clean tags', 'Faster follow-up execution' ]
      },
      {
        id: 'compliance',
        title: 'Compliance & Risk Monitor',
        desc: 'PII/license scanning and policy drift detection with tasks.',
        price: '$6,500 pilot (3 weeks)',
        benefits: [ 'Repo/doc scanning', 'Drift alerts with fixes', 'Weekly status reports' ],
        audience: [ 'Security/Eng leaders with SOC2/GDPR needs', 'Legal teams tracking license obligations', 'Startups shipping fast across teams' ],
        proof: [ 'Issues deduped & triaged weekly', 'Policy drift detected early', 'Lower audit friction' ],
        why: [ 'Static/dynamic scanners + rules cover common risks', 'LLM classifiers reduce false positives', 'Weekly batches keep noise manageable' ],
        results: [ 'Risk issues closed weekly', 'Policy drift flagged early', 'Smoother SOC2 renewal' ]
      },
      {
        id: 'partnerships',
        title: 'Partnership Pages @ Scale',
        desc: 'Programmatic partner pages, OGs, templated outreach assets.',
        price: '$5,500 pilot (3 weeks)',
        benefits: [ 'Template system + data model', 'OG + assets autogeneration', 'Review workflow' ],
        audience: [ 'BizDev/Partnerships teams with long partner lists', 'Startups doing directory or integration pages', 'Marketers seeking partner-led SEO' ],
        proof: [ 'Pages shipped in bulk with QC', 'Better partner outreach conversion', 'Consistent on-brand assets' ],
        why: [ 'Single schema ensures consistent partner pages', 'Assets + OGs autogenerate per partner', 'Change review prevents regressions' ],
        results: [ 'Dozens to hundreds of partner pages live', 'Higher reply rate to partner outreach', 'On-brand assets everywhere' ]
      }
    ];

    for (const service of services){
      const file = path.join(outDir, `${service.id}.pdf`);
      await new Promise((resolve) => {
        const doc = new PDFDocument({ size: 'A4', margin: 56 });
        const stream = doc.pipe(require('fs').createWriteStream(file));
        
        // Utilities for section styling
        let pageNumber = 1;
        const drawHeader = () => {
          doc.save();
          doc.rect(0, 0, doc.page.width, 64).fill('#0A0F0D');
          // Brand left
          doc.fillColor(BRAND.hair).font('Helvetica-Bold').fontSize(14).text('Vincent Viitala — Services', 56, 18, { align: 'left' });
          // Service title left, under brand for balance
          doc.fillColor('#6EE7B7').font('Helvetica').fontSize(10).text(sanitizePdfText(service.title), 56, 36, { align: 'left' });
          doc.restore();
          // Establish a consistent top content position below the header
          doc.y = Math.max(doc.y, 92);
        };
        const drawFooter = () => {
          const footerY = doc.page.height - 56;
          doc.save();
          doc.fillColor('#9CA3AF').font('Helvetica').fontSize(9);
          doc.text('vincentviitala.com', 56, footerY, { align: 'left', lineBreak: false });
          doc.text(`Page ${pageNumber}`, 0, footerY, { align: 'center', lineBreak: false });
          doc.text('Results-focused pilots. Privacy-respecting, with human-in-the-loop QA.', -56, footerY, { align: 'right', lineBreak: false });
          doc.restore();
        };
        // We will call drawHeader()/drawFooter() manually to avoid recursive page events

        const bottom = () => doc.page.height - 72;
        const ensureSpace = (h) => {
          if (doc.y + h <= bottom()) return;
          drawFooter();
          doc.addPage();
          pageNumber += 1;
          drawHeader();
        };
        const hr = () => {
          ensureSpace(12);
          doc.moveTo(56, doc.y + 2).lineTo(doc.page.width - 56, doc.y + 2).strokeColor('#D1D5DB').opacity(0.6).stroke().opacity(1);
          doc.moveDown(0.6);
        };
        const section = (title) => {
          ensureSpace(30);
          doc.fillColor(BRAND.text).font('Helvetica-Bold').fontSize(14).text(sanitizePdfText(title));
          hr();
        };
        const measureCardHeight = (title, lines, width) => {
          const text = [title ? `${title}\n` : '', ...(lines||[])].filter(Boolean).map(sanitizePdfText).join('\n');
          return doc.heightOfString(text, { width: width - 24, align: 'left' }) + 24;
        };
        const card = (title, lines, width = doc.page.width - 112) => {
          const x0 = 56;
          const y0 = doc.y + 8;
          const h = measureCardHeight(title, lines, width);
          ensureSpace(h + 24);
          // Background card (solid light brand tint for print/readability)
          doc.save();
          doc.roundedRect(x0, y0, width, h, 8).fill('#EAFBF3').strokeColor('#A7F3D0').lineWidth(0.6).stroke();
          // Text
          doc.fillColor(BRAND.text).font('Helvetica-Bold').fontSize(12).text(sanitizePdfText(title||''), x0 + 12, y0 + 10, { width: width - 24 });
          doc.font('Helvetica').fontSize(12).fillColor('#111111').text(lines.map(s => `• ${sanitizePdfText(s)}`).join('\n'), x0 + 12, y0 + 26, { width: width - 24 });
          doc.restore();
          // Advance cursor to below the card
          doc.y = y0 + h + 12;
        };

        // Header and hero
        drawHeader();

        // Title and description
        doc.fillColor(BRAND.text).font('Helvetica-Bold').fontSize(28)
          .text(sanitizePdfText(service.title), { align: 'left' });
        doc.moveDown(0.5);
        doc.fillColor('#3a3a3a').font('Helvetica').fontSize(12)
          .text(sanitizePdfText(service.desc), { align: 'left' });

        // Price callout (higher contrast)
        const priceCallout = (label) => {
          ensureSpace(60);
          const width = 360;
          const height = 58;
          const x = 56;
          const y = doc.y;
          doc.save();
          doc.roundedRect(x, y, width, height, 10)
            .fill(BRAND.fg)
            .strokeColor(BRAND.hair)
            .lineWidth(1)
            .stroke();
          doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(18)
            .text(sanitizePdfText(label), x + 14, y + 18);
          doc.restore();
          doc.y = y + height + 14;
        };
        priceCallout(`Pilot: ${service.price}`);

        // Outcomes / Benefits
        const benefits = (service.benefits && service.benefits.length) ? service.benefits : [
          'Fast pilot; measurable outcomes', 'Automation with human review loop', 'Clear data boundaries and privacy'
        ];
        section('What you get');
        card('', benefits);
        ensureSpace(24);

        // Differentiators (service-specific when available)
        section('Why this works');
        const whyLines = (service.why && service.why.length) ? service.why : [
          'Tight, time-boxed pilots that prove value quickly',
          'Guardrails against hallucinations and privacy leaks',
          'Human-in-the-loop checkpoints at key decision points'
        ];
        card('', whyLines);
        ensureSpace(24);

        // Two-column proof & ICP fit
        const colGap = 12;
        const colWidth = (doc.page.width - 112 - colGap) / 2;
        const cardAtFixed = (x, y, width, title, lines) => {
          const text = [title ? `${title}\n` : '', ...(lines||[])].filter(Boolean).map(sanitizePdfText).join('\n');
          const h = doc.heightOfString(text, { width: width - 24, align: 'left' }) + 24;
          doc.save();
          const g = doc.linearGradient(x, y, x, y + h);
          g.stop(0, '#FFFFFF');
          g.stop(1, '#F4FFF9');
          doc.roundedRect(x, y, width, h, 8).fill(g).strokeColor('#D1FAE5').lineWidth(0.6).stroke();
          doc.fillColor(BRAND.text).font('Helvetica-Bold').fontSize(12).text(sanitizePdfText(title||''), x + 12, y + 10, { width: width - 24 });
          doc.font('Helvetica').fontSize(12).fillColor('#111111').text(lines.map(s => `• ${sanitizePdfText(s)}`).join('\n'), x + 12, y + 26, { width: width - 24 });
          doc.restore();
          return h;
        };

        section('Fit & proof');
        const leftLines = (service.audience && service.audience.length ? service.audience : [
          'Teams with clear KPIs and ownership',
          'Leaders who want measurable outcomes in weeks',
          'Stakeholders willing to iterate fast'
        ]);
        const rightLines = (service.proof && service.proof.length ? service.proof : [
          'Rapid pilot results within 2–4 weeks',
          'Operationalized with guardrails',
          'Simple weekly KPI snapshots'
        ]);
        const leftH = measureCardHeight('Who this is for', leftLines, colWidth);
        const rightH = measureCardHeight('Proof points', rightLines, colWidth);
        const usedH = Math.max(leftH, rightH);
        ensureSpace(usedH + 32);
        const yStart = doc.y + 8;
        cardAtFixed(56, yStart, colWidth, 'Who this is for', leftLines);
        cardAtFixed(56 + colWidth + colGap, yStart, colWidth, 'What we will validate', rightLines);
        doc.y = yStart + usedH + 16;

        // Pricing tiers
        const tiers = [
          { name: 'Pilot', price: service.price, includes: ['Scoping + setup', 'Configured prototype', 'Weekly check-ins'] },
          { name: 'Core', price: 'From $12,000', includes: ['Hardened deployment', 'Dashboards + alerts', 'Team training'] },
          { name: 'Scale', price: 'From $25,000', includes: ['SLA & observability', 'Security reviews', 'Roadmap and ongoing tuning'] },
        ];
        // Keep pricing header with at least the first card; if not enough space for all, move entire block to next page
        const pricingHeight = tiers
          .map(t => measureCardHeight(`${t.name} — ${sanitizePdfText(t.price)}`, t.includes, doc.page.width - 112))
          .reduce((a,b)=>a+b,0) + (tiers.length * 12);
        // Anticipate header + block; avoid orphaned header at page bottom
        ensureSpace(pricingHeight + 36);
        section('Pricing tiers');
        for (const t of tiers) {
          card(`${t.name} — ${sanitizePdfText(t.price)}`, t.includes);
        }

        // Add a second page for implementation and case study
        drawFooter();
        doc.addPage();
        pageNumber += 1;
        drawHeader();

        section('Implementation plan (2–4 weeks)');
        card('', [
          'Week 0: Kickoff, access, success criteria',
          'Week 1: Prototype in your environment',
          'Week 2: Pilot live with guardrails + KPI dashboard',
          'Week 3+: Iterate, harden, and handover'
        ]);

        section('Target outcomes');
        const resultsLines = (service.results && service.results.length) ? service.results : [
          'Reduce manual effort in one key workflow',
          'Improve time-to-answer or lead velocity on a defined path',
          'Establish weekly KPI snapshot with baseline'
        ];
        card('Pilot outcomes we aim to achieve:', resultsLines);
        doc.font('Helvetica-Oblique').fillColor('#6B7280').text(sanitizePdfText('Targets are set together in Week 0. This is not a promise of results.'));

        section('Security & data boundaries');
        card('', [
          'No model training on your data by default',
          'Row-level guards + audit trails',
          'PII handling policy and access minimization'
        ]);

        // CTA + light guarantee
        section('Next step');
        ensureSpace(96);
        const ctaY = doc.y + 8;
        const ctaH = 72;
        const ctaW = doc.page.width - 112;
        doc.save();
        doc.roundedRect(56, ctaY, ctaW, ctaH, 10).fill('#0A0F0D');
        doc.fillColor(BRAND.hair).font('Helvetica-Bold').fontSize(14).text('Book a 30‑min scoping call', 72, ctaY + 16);
        doc.fillColor(BRAND.fg).font('Helvetica').fontSize(12).text(CTA_URL, 72, ctaY + 36);
        doc.restore();
        doc.y = ctaY + ctaH + 8;
        doc.fillColor('#374151').font('Helvetica-Oblique').fontSize(11)
          .text(sanitizePdfText('If we cannot demonstrate movement on the agreed KPI by the end of Week 2, cancel the pilot with no further obligation.'));

        // Finalize
        drawFooter();
        doc.end();
        stream.on('finish', resolve);
      });
    }
  } catch (err) {
    console.warn('Service PDFs generation skipped:', err?.message || err);
  }
}

main().catch(err => { console.error(err); process.exit(1); });


