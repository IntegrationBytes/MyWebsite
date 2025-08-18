import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(){
  const satori = (await import('satori')).default;
  const { Resvg } = await import('@resvg/resvg-js');
  const root = path.join(__dirname, '..');
  const jsonPath = path.join(root, 'assets', 'data', 'books-selected.json');
  const outDir = path.join(root, 'assets', 'img', 'og', 'books');
  if (!fs.existsSync(jsonPath)) { console.error('Missing books-selected.json'); process.exit(1); }
  const books = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  await fs.promises.mkdir(outDir, { recursive: true });
  // Use system sans as fallback if custom font missing
  let fontData = null;
  try {
    // Try to load a web-safe font shipped with resvg-js examples; if unavailable, skip fonts
    const possible = [
      path.join(root, 'assets', 'fonts', 'Inter-Regular.ttf'),
      '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
      '/System/Library/Fonts/SFNS.ttf'
    ];
    for (const p of possible){
      if (fs.existsSync(p)) { fontData = await fs.promises.readFile(p); break; }
    }
  } catch {}
  let count = 0;
  for (const b of books){
    const slug = b.slug || (b.title||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    const svg = await satori({
      type: 'div',
      props: { style: { width: '1200px', height: '630px', display: 'flex', flexDirection:'column', background: '#050807', color: '#E6F5EF', padding: '56px', fontFamily: 'Inter' }, children: [
        { type:'div', props: { style: { fontSize: '42px', fontWeight: 700, lineHeight: 1.2 }, children: b.title }},
        { type:'div', props: { style: { marginTop:'12px', fontSize: '24px', opacity:.85 }, children: (b.author ? `by ${b.author}` : '') }},
        { type:'div', props: { style: { marginTop: 'auto', fontSize: '18px', opacity: .8 }, children: 'vincentviitala.com/books/' }}
      ] }
    }, { width: 1200, height: 630, fonts: fontData ? [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }] : [] });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
    await fs.promises.writeFile(path.join(outDir, `${slug}.png`), png);
    count++;
  }
  console.log(`✅ Generated ${count} book OG images at ${outDir}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { console.error(err); process.exit(1); });
}


