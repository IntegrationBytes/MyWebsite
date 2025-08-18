/**
 * Compatibility shim: render selected Goodreads books
 * This mirrors books-selected.js so older pages referencing books-goodreads.js keep working.
 */
(function(){
  function createStars(value){
    const rating = parseFloat(value || '0') || 0;
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
  }

  function createCard(book){
    const coverContent = book.cover_url
      ? `<img src="${book.cover_url}" alt="${book.title} cover" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\"book-cover-placeholder\">${book.title}</div>'">`
      : `<div class="book-cover-placeholder">${book.title}</div>`;
    const myStars = createStars(book.my_rating);
    const avgStars = createStars(book.average_rating);

    const hover = `
      <div class="hover-details" aria-hidden="true">
        <div class="hover-inner">
          <div class="hover-title">${book.title}</div>
          <div class="hover-author">by ${book.author || 'Unknown'}</div>
          <div class="hover-meta">
            <div><strong>My rating:</strong> ${myStars} <span class="book-rating-text">${book.my_rating || '—'}/5</span></div>
            <div><strong>Average:</strong> ${avgStars} <span class="book-rating-text">${book.average_rating || '—'}/5</span></div>
            <div><strong>Publisher:</strong> ${book.publisher || '—'}</div>
            <div><strong>Year:</strong> ${book.year_published || '—'}</div>
            <div><strong>Pages:</strong> ${book.num_pages || '—'}</div>
          </div>
          ${book.my_review ? `<p class="hover-review">${String(book.my_review).slice(0,180)}${String(book.my_review).length>180?'…':''}</p>` : ''}
          <a class="btn btn-ghost small" href="/books/review.html?slug=${encodeURIComponent(book.slug)}">Read review →</a>
        </div>
      </div>`;

    return `
      <div class="book-card size-medium" data-slug="${book.slug}">
        <div class="book-cover">${coverContent}</div>
        <div class="book-info">
          <div class="book-category">Selected</div>
          <h3 class="book-title">${book.title}</h3>
          <div class="book-author">by ${book.author || 'Unknown'}</div>
          <div class="book-rating">
            <span class="book-stars">${myStars}</span>
            <span class="book-rating-text">${book.my_rating || '—'}/5</span>
          </div>
        </div>
        ${hover}
      </div>`;
  }

  async function render(){
    const grid = document.getElementById('books-grid');
    if (!grid) return;
    try {
      const res = await fetch('/assets/data/books-selected.json?ts=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      data.sort((a,b) => (parseFloat(b.my_rating||0)-parseFloat(a.my_rating||0)) || a.title.localeCompare(b.title));
      grid.innerHTML = data.map(createCard).join('');

      grid.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if ((e.target).closest && (e.target).closest('a')) return;
          const slug = card.getAttribute('data-slug');
          if (slug) window.location.href = `/books/review.html?slug=${encodeURIComponent(slug)}`;
        });
      });
    } catch (err) {
      grid.innerHTML = '<p class="muted">Failed to load books.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})();


