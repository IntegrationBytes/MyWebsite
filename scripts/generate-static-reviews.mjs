/**
 * Generate static book review pages with SEO meta and update sitemap.xml
 * Source: assets/data/books-selected.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = (process.env.SITE_URL && process.env.SITE_URL.replace(/\/$/, '')) || 'https://vincentviitala.com';

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }
function slugify(str){ return String(str||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

function pickRelated(books, current){
  const sameAuthor = books.filter(b => b.author && current.author && b.author === current.author && b.slug !== current.slug).slice(0,3);
  const sameCategory = books.filter(b => b.category === current.category && b.slug !== current.slug).slice(0,5);
  const combined = [...sameAuthor, ...sameCategory.filter(b => !sameAuthor.find(a=>a.slug===b.slug))].slice(0,6);
  return combined;
}

function buildHtml(book, allBooks){
  const title = escapeHtml(book.title);
  const author = escapeHtml(book.author || 'Unknown');
  const descRaw = book.my_review && String(book.my_review).trim().length > 0
    ? String(book.my_review).replace(/\s+/g,' ').slice(0, 220)
    : `Review and summary of ${title} by ${author} — key ideas, notes, quotes, and why it matters.`;
  const description = escapeHtml(descRaw);
  const slug = book.slug || slugify(`${book.title}-${book.author}`);
  const pathUrl = `/books/reviews/${slug}.html`;
  const canonical = `${SITE_URL}${pathUrl}`;
  const cover = book.cover_url || `${SITE_URL}/assets/img/og-default.svg`;
  const year = escapeHtml(book.year_published || '');
  const publisher = escapeHtml(book.publisher || '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: book.author ? { '@type': 'Person', name: book.author } : undefined,
    isbn: book.isbn13 || book.isbn || undefined,
    image: book.cover_url || undefined,
    datePublished: book.year_published || undefined,
    publisher: book.publisher || undefined,
    url: canonical,
    review: book.my_review ? [{
      '@type': 'Review',
      reviewBody: book.my_review,
      reviewRating: book.my_rating ? { '@type': 'Rating', ratingValue: String(book.my_rating), bestRating: '5' } : undefined
    }] : undefined,
    aggregateRating: book.average_rating ? { '@type':'AggregateRating', ratingValue: String(book.average_rating), bestRating: '5' } : undefined
  };

  const related = pickRelated(allBooks, book).map(r => `<li><a href="/books/reviews/${encodeURIComponent(r.slug || slugify(`${r.title}-${r.author}`))}.html">${escapeHtml(r.title)}</a></li>`).join('');

  return `<!doctype html>
<html lang="en" data-theme="matrix">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Review, Summary, and Notes</title>
  <meta name="description" content="${description}" />
  <meta name="theme-color" content="#050807" />
  <link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title} — Review, Summary, and Notes">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${cover}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} — Review, Summary, and Notes">
  <meta name="twitter:description" content="${description}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@300;400;600&family=Source+Serif+4:opsz@8..60&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/css/styles.css">
  <link rel="stylesheet" href="../../assets/css/books.css">
  <script defer src="../../assets/js/config.js"></script>
  <script defer src="../../assets/js/main.js"></script>
</head>
<body>
<header class="site-header" role="banner">
  <div class="container header-inner">
    <a class="brand" href="../../"><span class="glyph">◇</span> Vincent Viitala</a>
    <nav aria-label="Primary" class="nav"></nav>
    <div class="header-actions">
      <a id="book-top" class="btn" href="${typeof window === 'undefined' ? '' : (window.CALENDLY_URL || '')}">Book call</a>
    </div>
  </div>
  </header>
<main class="container" role="main">
  <article class="book-review">
    <header class="review-header">
      <nav class="breadcrumb"><a href="../">Books</a> → <span>${title}</span></nav>
      <div class="book-meta">
        <div class="book-cover-large">
          ${book.cover_url ? `<img src="${book.cover_url}" alt="${title} cover" loading="eager">` : `<div class="book-cover-placeholder">${title}</div>`}
        </div>
        <div class="book-details">
          <h1>${title}</h1>
          <div class="book-author">by ${author}</div>
          <div class="book-rating"><span class="book-stars">${'★'.repeat(Math.floor(parseFloat(book.my_rating||0)))}${parseFloat(book.my_rating||0)%1>=0.5?'☆':''}${'☆'.repeat(5-Math.floor(parseFloat(book.my_rating||0))-(parseFloat(book.my_rating||0)%1>=0.5?1:0))}</span><span class="rating-text"> ${escapeHtml(book.my_rating || '—')}/5 (avg ${escapeHtml(book.average_rating || '—')})</span></div>
          <div class="muted">${publisher || '—'} ${year ? `• ${year}` : ''} ${book.num_pages ? `• ${escapeHtml(book.num_pages)} pages` : ''}</div>
        </div>
      </div>
    </header>
    <div class="review-content">
      ${book.my_review ? escapeHtml(book.my_review).replace(/\n/g,'<br>') : `<div class="review-placeholder"><h2>No long review yet</h2><p>Goodreads notes will appear here if present.</p></div>`}
      <hr>
      <h3>Related books</h3>
      <ul>${related}</ul>
    </div>
  </article>
</main>
<footer class="site-footer" role="contentinfo">
  <div class="container footer-inner">
    <div class="left"><p class="muted">© 2025 Vincent Viitala</p><p class="muted">AI engineer building dependable systems. Available for challenging work.</p></div>
    <div class="right"><a href="https://github.com/" target="_blank" rel="noopener" class="tag">GitHub</a><a href="https://www.linkedin.com/" target="_blank" rel="noopener" class="tag">LinkedIn</a><a href="../../contact/" class="tag">Contact</a></div>
  </div>
</footer>
</body>
</html>`;
}

function updateSitemap(books){
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  let xml = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf-8') : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n';
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const existing = new Set();
  let m; while ((m = locRegex.exec(xml)) !== null) existing.add(m[1]);
  const base = (() => {
    // Infer base from first entry, fallback to example.com
    const first = [...existing][0] || 'https://example.com/';
    const u = new URL(first);
    return `${u.protocol}//${u.host}`;
  })();

  const add = (url) => existing.add(url);
  const now = new Date().toISOString();

  add(`${base}/books/`);
  for (const b of books){
    const slug = b.slug || slugify(`${b.title}-${b.author}`);
    add(`${base}/books/reviews/${slug}.html`);
  }

  // Rebuild XML
  const urls = Array.from(existing);
  const body = urls.map(u => `  <url><loc>${u}</loc><lastmod>${now}</lastmod></url>`).join('\n');
  const newXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.writeFileSync(sitemapPath, newXml);
  console.log(`🗺️  Updated sitemap with ${urls.length} URLs at ${sitemapPath}`);
}

async function main(){
  const jsonPath = path.join(__dirname, '..', 'assets', 'data', 'books-selected.json');
  const outDir = path.join(__dirname, '..', 'books', 'reviews');
  if (!fs.existsSync(jsonPath)) { console.error('Missing books-selected.json'); process.exit(1); }
  const books = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  ensureDir(outDir);
  // Normalize categories if missing
  for (const b of books){
    if (!b.category){
      const t = (b.title||'').toLowerCase();
      const hit = (s)=>t.includes(s);
      b.category = (hit('startup')||hit('habit')||hit('business')||hit('chasm')||hit('good to great')) ? 'business'
        : (hit('algorithm')||hit('intelligence')||hit('machine')||hit('coding')||hit('programming')) ? 'ai'
        : (hit('sapiens')||hit('guns, germs, and steel')) ? 'science'
        : 'philosophy';
    }
  }
  let count = 0;
  for (const b of books){
    const slug = b.slug || slugify(`${b.title}-${b.author}`);
    const html = buildHtml(b, books);
    fs.writeFileSync(path.join(outDir, `${slug}.html`), html);
    count++;
  }
  console.log(`✅ Wrote ${count} static review pages to ${outDir}`);
  updateSitemap(books);
  console.log('Tip: Run OG generation and category pages after this step if needed.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { console.error(err); process.exit(1); });
}


