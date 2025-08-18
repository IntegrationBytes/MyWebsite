import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = (process.env.SITE_URL && process.env.SITE_URL.replace(/\/$/, '')) || 'https://vincentviitala.com';

function xmlEscape(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }

async function main(){
  const root = path.join(__dirname, '..');
  const dataFile = path.join(root, 'assets', 'data', 'books-selected.json');
  const books = JSON.parse(await fs.promises.readFile(dataFile, 'utf-8'));
  const items = books.map(b => ({
    title: `${b.title} — Review & Notes`,
    url: `${SITE_URL}/books/reviews/${encodeURIComponent(b.slug)}.html`,
    desc: (b.my_review && String(b.my_review).slice(0,220)) || `${b.title} by ${b.author}`,
    date: new Date()
  }));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Vincent Viitala — Book Reviews</title>\n    <link>${SITE_URL}/books/</link>\n    <description>Reviews and notes on AI, business, philosophy, and science books.</description>\n    ${items.map(i=>`<item><title>${xmlEscape(i.title)}</title><link>${xmlEscape(i.url)}</link><guid>${xmlEscape(i.url)}</guid><description>${xmlEscape(i.desc)}</description><pubDate>${new Date().toUTCString()}</pubDate></item>`).join('')}\n  </channel>\n</rss>\n`;

  const json = { version: 'https://jsonfeed.org/version/1.1', title: 'Vincent Viitala — Book Reviews', home_page_url: `${SITE_URL}/books/`, feed_url: `${SITE_URL}/books/feed.json`, items: items.map(i => ({ id: i.url, url: i.url, title: i.title, content_text: i.desc, date_published: new Date().toISOString() })) };

  await fs.promises.writeFile(path.join(root, 'books', 'reviews.xml'), rss, 'utf-8');
  await fs.promises.writeFile(path.join(root, 'books', 'feed.json'), JSON.stringify(json, null, 2), 'utf-8');
  console.log('✅ Generated books RSS and JSON feeds');
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(err=>{ console.error(err); process.exit(1); });


