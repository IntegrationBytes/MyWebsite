/**
 * Extract selected books from Goodreads CSV and output a JSON array
 * Fields: title, author, my_rating, average_rating, publisher, year_published, num_pages, my_review
 * Also includes: isbn13, isbn, cover_url, slug (to support covers and review pages)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, '"')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      // Toggle quote state, or handle escaped quotes
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map(v => v.replace(/^"|"$/g, '').trim());
}

function findHeaderIndex(headers, needle) {
  const idx = headers.findIndex(h => h.toLowerCase() === needle.toLowerCase());
  if (idx !== -1) return idx;
  return headers.findIndex(h => h.toLowerCase().includes(needle.toLowerCase()));
}

function readCsv(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split(/\r?\n/).filter(l => l.length > 0);
  const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
  const rows = lines.slice(1).map(parseCSVLine);
  return { headers, rows };
}

// Desired books (title and optional author hints for disambiguation)
const desiredBooks = [
  { title: 'The Lean Startup' },
  { title: 'Zero to One' },
  { title: 'The Hard Thing About Hard Things' },
  { title: "Good to Great" },
  { title: 'Blue Ocean Strategy' },
  { title: 'Rework' },
  { title: 'Venture Deals' },
  { title: 'Crossing the Chasm' },
  { title: 'Influence' },
  { title: 'Never Split the Difference' },
  { title: 'Artificial Intelligence: A Modern Approach' },
  { title: 'Superintelligence' },
  { title: 'Life 3.0' },
  { title: 'AI Superpowers' },
  { title: 'Human Compatible' },
  { title: 'Weapons of Math Destruction' },
  { title: 'The Second Machine Age' },
  { title: 'Thinking, Fast and Slow' },
  { title: 'The Black Swan' },
  { title: 'Nudge' },
  { title: 'Predictably Irrational' },
  { title: 'Antifragile' },
  { title: "Man's Search for Meaning" },
  { title: 'Flow' },
  { title: 'Mindset' },
  { title: "Quiet" },
  { title: 'Sapiens' },
  { title: 'Shoe Dog' },
  { title: 'Steve Jobs' },
  { title: 'Endurance' },
  { title: 'Guns, Germs, and Steel' },
  { title: 'Titan' },
  { title: 'Meditations' },
  { title: 'The Art of War' },
  { title: 'Principles: Life and Work' },
  { title: 'Homo Deus' },
  { title: 'The Sovereign Individual' },
  { title: 'The 7 Habits of Highly Effective People' },
  { title: 'Think and Grow Rich' },
  { title: 'Deep Work' },
  { title: 'Atomic Habits' },
  { title: 'Getting Things Done' },
  { title: 'The Power of Habit' },
  { title: '1984' },
  { title: 'Brave New World' },
  { title: 'Atlas Shrugged' },
  { title: 'Dune' },
  { title: 'The Fountainhead' },
  { title: 'Snow Crash' },
  { title: 'The Algorithm Design Manual' },
  { title: 'Cracking the Coding Interview' },
  { title: 'Introduction to Algorithms' },
  { title: 'The Clean Coder' },
  { title: 'Algorithms', authorHint: 'Sedgewick' },
  { title: 'Grokking Algorithms' },
  { title: 'Algorithms to Live By' },
  { title: 'The Master Algorithm' }
];

function matchTitleAuthor(row, headers, desired) {
  const idxTitle = findHeaderIndex(headers, 'Title');
  const idxAuthor = findHeaderIndex(headers, 'Author');
  const rowTitle = row[idxTitle] || '';
  const rowAuthor = row[idxAuthor] || '';
  const nRowTitle = normalize(rowTitle);
  const nRowAuthor = normalize(rowAuthor);
  const nDesiredTitle = normalize(desired.title);

  // Match if title contains or equals, to allow subtitle variations
  const titleMatch = nRowTitle === nDesiredTitle || nRowTitle.startsWith(nDesiredTitle) || nRowTitle.includes(nDesiredTitle);

  if (!titleMatch) return false;

  if (desired.authorHint) {
    return nRowAuthor.includes(normalize(desired.authorHint));
  }

  // Special cases for known title variants
  if (nDesiredTitle.startsWith('cracking the coding interview')) {
    return nRowTitle.includes('cracking the coding interview');
  }

  return true;
}

async function main() {
  const csvPath = path.join(__dirname, '..', 'goodreads_library_export.csv');
  const outDir = path.join(__dirname, '..', 'assets', 'data');
  const outPath = path.join(outDir, 'books-selected.json');

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at ${csvPath}`);
    process.exit(1);
  }

  const { headers, rows } = readCsv(csvPath);

  const iTitle = findHeaderIndex(headers, 'Title');
  const iAuthor = findHeaderIndex(headers, 'Author');
  const iMyRating = findHeaderIndex(headers, 'My Rating');
  const iAvgRating = findHeaderIndex(headers, 'Average Rating');
  const iPublisher = findHeaderIndex(headers, 'Publisher');
  const iYear = findHeaderIndex(headers, 'Year Published');
  const iPages = findHeaderIndex(headers, 'Number of Pages');
  const iReview = findHeaderIndex(headers, 'My Review');
  const iISBN = findHeaderIndex(headers, 'ISBN');
  const iISBN13 = findHeaderIndex(headers, 'ISBN13');

  const results = [];

  for (const desired of desiredBooks) {
    const match = rows.find(row => matchTitleAuthor(row, headers, desired));
    if (!match) {
      // Push a placeholder with nulls to keep it visible in the UI
      results.push({
        title: desired.title,
        author: null,
        my_rating: null,
        average_rating: null,
        publisher: null,
        year_published: null,
        num_pages: null,
        my_review: '',
        isbn: null,
        isbn13: null,
        cover_url: null,
        slug: slugify(desired.title)
      });
      continue;
    }

    const title = (match[iTitle] || '').replace(/\"/g, '"');
    const author = (match[iAuthor] || '').replace(/\"/g, '"');
    const myRating = (match[iMyRating] || '').toString();
    const avgRating = (match[iAvgRating] || '').toString();
    const publisher = (match[iPublisher] || '').toString();
    const year = (match[iYear] || '').toString();
    const pages = (match[iPages] || '').toString();
    const review = (match[iReview] || '').toString();
    const isbn = (match[iISBN] || '').replace(/[^0-9Xx]/g, '') || null;
    const isbn13 = (match[iISBN13] || '').replace(/[^0-9]/g, '') || null;
    const coverUrl = isbn13 ? `https://covers.openlibrary.org/b/isbn/${isbn13}-M.jpg` : (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null);

    results.push({
      title,
      author,
      my_rating: myRating === '' ? null : myRating,
      average_rating: avgRating === '' ? null : avgRating,
      publisher: publisher === '' ? null : publisher,
      year_published: year === '' ? null : year,
      num_pages: pages === '' ? null : pages,
      my_review: review,
      isbn,
      isbn13,
      cover_url: coverUrl,
      slug: slugify(`${title}-${author}`)
    });
  }

  ensureDir(outDir);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Wrote ${results.length} books to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


