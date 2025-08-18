/**
 * Render selected Goodreads books from JSON
 */
(function(){
  let allBooks = [];
  let filteredBooks = [];
  let currentCategory = 'all';
  let currentPage = 1;
  let booksPerPage = 12;
  function escapeHtml(s){
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function createStars(value){
    const rating = parseFloat(value || '0') || 0;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
  }

  function assignCategory(title){
    const t = (title || '').toLowerCase();
    const isAny = (...parts) => parts.some(p => t.includes(p));
    if (isAny('artificial intelligence', 'superintelligence', 'life 3.0', 'ai superpowers', 'human compatible', 'second machine age', 'master algorithm', 'algorithm design manual', 'cracking the coding interview', 'introduction to algorithms', 'clean coder', 'grokking algorithms', 'algorithms to live by')) return 'ai';
    if (isAny('lean startup', 'zero to one', 'hard thing about hard things', 'good to great', 'blue ocean strategy', 'rework', 'venture deals', 'crossing the chasm', 'never split the difference', 'influence', 'shoe dog', 'principles', 'sovereign individual', '7 habits', 'seven habits', 'think and grow rich', 'deep work', 'atomic habits', 'getting things done', 'power of habit')) return 'business';
    if (isAny('thinking, fast and slow', 'black swan', 'nudge', 'predictably irrational', 'antifragile', "man's search for meaning", 'flow', 'mindset', 'quiet', 'meditations', 'art of war', 'homo deus', 'atlas shrugged', 'the fountainhead', '1984', 'animal farm', 'brave new world', 'snow crash', 'dune')) return 'philosophy';
    if (isAny('weapons of math destruction', 'sapiens', 'guns, germs, and steel', 'endurance', 'steve jobs', 'titan')) return 'science';
    return 'philosophy';
  }

  // Deterministic sizing based on slug/title (stable across refreshes)
  function hashToUnit(str){
    const s = String(str || '');
    let h = 2166136261 >>> 0; // FNV-1a 32-bit
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    // Fold to [0,1)
    return (h >>> 0) / 4294967296;
  }

  function assignSize(seed){
    const sizes = ['small','medium','large','featured'];
    const weights = [0.4, 0.4, 0.17, 0.03];
    const r = hashToUnit(seed);
    let acc = 0;
    for (let i=0;i<sizes.length;i++){ acc += weights[i]; if (r < acc) return sizes[i]; }
    return 'medium';
  }

  function createCard(book){
    const safeTitle = escapeHtml(book.title);
    const coverContent = book.cover_url
      ? `<img src="${book.cover_url}" alt="${safeTitle} cover" loading="lazy">`
      : `<div class="book-cover-placeholder">${safeTitle}</div>`;
    const myStars = createStars(book.my_rating);
    const avgStars = createStars(book.average_rating);

    const hover = `
      <div class="hover-details" aria-hidden="true">
        <div class="hover-inner">
          <div class="hover-title">${safeTitle}</div>
          <div class="hover-author">by ${escapeHtml(book.author || 'Unknown')}</div>
          <div class="hover-meta">
            <div><strong>My rating:</strong> ${myStars} <span class="book-rating-text">${book.my_rating || '—'}/5</span></div>
            <div><strong>Average:</strong> ${avgStars} <span class="book-rating-text">${book.average_rating || '—'}/5</span></div>
            <div><strong>Publisher:</strong> ${book.publisher || '—'}</div>
            <div><strong>Year:</strong> ${book.year_published || '—'}</div>
            <div><strong>Pages:</strong> ${book.num_pages || '—'}</div>
          </div>
          ${book.my_review ? `<p class="hover-review">${escapeHtml(String(book.my_review).slice(0,180))}${String(book.my_review).length>180?'…':''}</p>` : ''}
          <a class="btn btn-ghost small" href="review.html?slug=${encodeURIComponent(book.slug)}">Read review →</a>
        </div>
      </div>`;

    return `
      <div class="book-card size-${book.size || 'medium'}" data-slug="${book.slug}">
        <div class="book-cover">${coverContent}</div>
        <div class="book-info">
          <div class="book-category">${categoryLabel(book.category)}</div>
          <h3 class="book-title">${safeTitle}</h3>
          <div class="book-author">by ${escapeHtml(book.author || 'Unknown')}</div>
          <div class="book-rating">
            <span class="book-stars">${myStars}</span>
            <span class="book-rating-text">${book.my_rating || '—'}/5</span>
          </div>
        </div>
        ${hover}
      </div>`;
  }

  function categoryLabel(cat){
    const map = { ai: 'AI & Technology', philosophy: 'Philosophy', business: 'Business', science: 'Science' };
    return map[cat] || 'Selected';
  }

  function applyFilters(){
    if (currentCategory === 'all') filteredBooks = [...allBooks];
    else filteredBooks = allBooks.filter(b => b.category === currentCategory);
  }

  function getPageSlice(){
    const start = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(start, start + booksPerPage);
  }

  function updatePagination(){
    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
    const elCur = document.getElementById('page-current');
    const elTot = document.getElementById('page-total');
    if (elCur) elCur.textContent = String(Math.min(currentPage, totalPages));
    if (elTot) elTot.textContent = String(totalPages);
    const prev = document.getElementById('prev-page');
    const next = document.getElementById('next-page');
    if (prev) prev.disabled = currentPage <= 1;
    if (next) next.disabled = currentPage >= totalPages;
  }

  function attachControls(){
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category') || 'all';
        currentPage = 1;
        applyFilters();
        renderGrid();
        updatePagination();
      });
    });
    document.getElementById('prev-page')?.addEventListener('click', () => { if (currentPage>1){ currentPage--; renderGrid(); updatePagination(); }});
    document.getElementById('next-page')?.addEventListener('click', () => { const totalPages = Math.ceil(filteredBooks.length / booksPerPage); if (currentPage<totalPages){ currentPage++; renderGrid(); updatePagination(); }});
  }

  function renderGrid(){
    const grid = document.getElementById('books-grid');
    if (!grid) return;
    const pageBooks = getPageSlice();
    grid.innerHTML = pageBooks.map(createCard).join('');

    grid.querySelectorAll('.book-cover img').forEach(img => {
      img.addEventListener('error', () => {
        const parent = img.parentElement;
        if (!parent) return;
        const title = escapeHtml((img.getAttribute('alt') || '').replace(/\s+cover$/, ''));
        parent.innerHTML = `<div class=\"book-cover-placeholder\">${title}</div>`;
      }, { once: true });
    });

    grid.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if ((e.target).closest && (e.target).closest('a')) return;
        const slug = card.getAttribute('data-slug');
        if (slug) window.location.href = `reviews/${encodeURIComponent(slug)}.html`;
      });
    });
  }

  async function render(){
    const grid = document.getElementById('books-grid');
    if (!grid) return;
    try {
      const res = await fetch('../assets/data/books-selected.json?ts=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      allBooks = data.map(b => ({
        ...b,
        category: b.category || assignCategory(b.title),
        size: b.size || assignSize(b.slug || b.title)
      }));
      allBooks.sort((a,b) => (parseFloat(b.my_rating||0)-parseFloat(a.my_rating||0)) || a.title.localeCompare(b.title));
      applyFilters();
      attachControls();
      renderGrid();
      updatePagination();
    } catch (err) {
      grid.innerHTML = '<p class="muted">Failed to load books.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})();


