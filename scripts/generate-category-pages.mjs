import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function chunk(arr, size){ const out=[]; for(let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }

function pageHtml({ category, books, page, totalPages }){
  const title = `${category} Books — Reviews`;
  const desc = `Curated ${category} books with summaries and reviews.`;
  const list = books.map(b => `<li><a href="/books/reviews/${encodeURIComponent(b.slug)}.html">${escapeHtml(b.title)}</a> — <span class="muted">${escapeHtml(b.author||'')}</span></li>`).join('');
  const relPrev = page>1 ? `<link rel="prev" href="./${page-1===1?'':`page/${page-1}/`}" />` : '';
  const relNext = page<totalPages ? `<link rel="next" href="./page/${page+1}/" />` : '';
  const pag = Array.from({length: totalPages}, (_,i)=>i+1).map(i => i===page?`<span class="tag">${i}</span>`:`<a class="tag" href="${i===1?'./':`./page/${i}/`}">${i}</a>`).join(' ');
  return `<!doctype html>
<html lang="en" data-theme="matrix">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="/books/${encodeURIComponent(category)}/${page===1?'':`page/${page}/`}">
  ${relPrev}
  ${relNext}
  <link rel="stylesheet" href="../../assets/css/styles.css">
  <link rel="stylesheet" href="../../assets/css/books.css">
</head>
<body>
<header class="site-header" role="banner"><div class="container header-inner"><a class="brand" href="../../"><span class="glyph">◇</span> Vincent Viitala</a></div></header>
<main class="container" role="main">
  <nav class="breadcrumb"><a href="../../books/">Books</a> → <span>${escapeHtml(category)}</span></nav>
  <h1>${escapeHtml(title)}</h1>
  <ul>${list}</ul>
  <div style="margin-top:16px;">${pag}</div>
</main>
</body>
</html>`;
}

async function main(){
  const root = path.join(__dirname, '..');
  const dataFile = path.join(root, 'assets', 'data', 'books-selected.json');
  const books = JSON.parse(await fs.promises.readFile(dataFile, 'utf-8'));
  const byCat = books.reduce((acc,b)=>{ const c=(b.category||'philosophy'); (acc[c] = acc[c]||[]).push(b); return acc; },{});
  const outBase = path.join(root, 'books');
  for (const [cat, list] of Object.entries(byCat)){
    const dir = path.join(outBase, cat);
    await fs.promises.mkdir(dir, { recursive: true });
    const pages = chunk(list, 20);
    for (let i=0;i<pages.length;i++){
      const pdir = i===0 ? dir : path.join(dir, 'page', String(i+1));
      await fs.promises.mkdir(pdir, { recursive: true });
      const html = pageHtml({ category: cat, books: pages[i], page: i+1, totalPages: pages.length });
      await fs.promises.writeFile(path.join(pdir, 'index.html'), html, 'utf-8');
    }
  }
  console.log('✅ Generated category pages');
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(err=>{ console.error(err); process.exit(1); });


