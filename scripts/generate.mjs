import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE_URL = process.env.SITE_URL || 'https://example.com';

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

async function main() {
  const essays = await collectEntries('essays', 'essay');
  const projects = await collectEntries('projects', 'project');
  await writeSitemap({ essays, projects });
  await writeRss({ essays });
  console.log(`Generated sitemap.xml and rss.xml for`, essays.length, 'essays and', projects.length, 'projects');
}

main().catch(err => { console.error(err); process.exit(1); });


