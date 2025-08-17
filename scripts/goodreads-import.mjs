/**
 * Goodreads Import Script
 * Processes Goodreads CSV export and generates book data with cover images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GoodreadsImporter {
  constructor() {
    this.books = [];
    this.categories = {
      'artificial-intelligence': 'ai',
      'machine-learning': 'ai',
      'technology': 'ai',
      'computer-science': 'ai',
      'programming': 'ai',
      'philosophy': 'philosophy',
      'psychology': 'philosophy',
      'consciousness': 'philosophy',
      'business': 'business',
      'entrepreneurship': 'business',
      'startup': 'business',
      'science': 'science',
      'physics': 'science',
      'biology': 'science',
      'mathematics': 'science'
    };
  }

  /**
   * Parse Goodreads CSV export
   * Download from: https://www.goodreads.com/review/import
   * Save as: goodreads_library_export.csv
   */
  parseCsv(csvPath) {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    console.log('📚 Processing Goodreads export...');
    console.log(`📊 Found ${lines.length - 1} books in export`);
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const values = this.parseCSVLine(line);
      const book = this.createBookFromRow(headers, values);
      
      // Filter for high-quality books only
      if (book && book.rating >= 4 && book.title.length > 0) {
        this.books.push(book);
      }
    }
    
    console.log(`✅ Imported ${this.books.length} books (4+ star rating)`);
    console.log(`🏆 Top rated: ${this.books.filter(b => b.rating === 5).length} five-star books`);
    return this.books;
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }

  createBookFromRow(headers, values) {
    const getField = (fieldName) => {
      const index = headers.findIndex(h => h.toLowerCase().includes(fieldName.toLowerCase()));
      return index !== -1 ? values[index]?.replace(/"/g, '').trim() : '';
    };

    const title = getField('title');
    const author = getField('author');
    const isbn = getField('isbn') || getField('isbn13');
    const rating = parseFloat(getField('rating')) || 0;
    const shelves = getField('shelves') || getField('bookshelves');
    const review = getField('review') || getField('body');
    
    if (!title || !author) return null;

    return {
      id: Date.now() + Math.random(),
      title: title,
      author: author,
      isbn: isbn,
      rating: rating,
      category: this.categorizeBook(shelves, title, author),
      description: this.generateDescription(review, title, author),
      size: this.assignSize(),
      cover: null // Will be populated by getCoverImage
    };
  }

  categorizeBook(shelves, title, author) {
    const text = `${shelves} ${title} ${author}`.toLowerCase();
    
    for (const [keyword, category] of Object.entries(this.categories)) {
      if (text.includes(keyword)) {
        return category;
      }
    }
    
    return 'philosophy'; // Default category
  }

  generateDescription(review, title, author) {
    if (review && review.length > 50) {
      return review.substring(0, 200) + '...';
    }
    
    // Generate a simple description if no review
    return `A thoughtful exploration by ${author} that has influenced my thinking and approach to complex problems.`;
  }

  assignSize() {
    const sizes = ['small', 'medium', 'large', 'featured'];
    const weights = [0.4, 0.35, 0.2, 0.05]; // More small/medium, fewer large/featured
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < sizes.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return sizes[i];
      }
    }
    
    return 'medium';
  }

  /**
   * Get cover image URL with fallback strategy
   */
  async getCoverImage(book) {
    if (!book.isbn) return null;
    
    // Try Open Library first (free, unlimited)
    const openLibraryUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
    
    try {
      const response = await fetch(openLibraryUrl, { method: 'HEAD' });
      if (response.ok) {
        return openLibraryUrl;
      }
    } catch (error) {
      console.log(`❌ Cover not found for: ${book.title}`);
    }
    
    return null; // Will use placeholder
  }

  /**
   * Generate the books.js file with your Goodreads data
   */
  async generateBooksFile(outputPath) {
    console.log('🖼️  Fetching cover images...');
    
    // Add cover images with rate limiting
    for (let i = 0; i < this.books.length; i++) {
      const book = this.books[i];
      book.cover = await this.getCoverImage(book);
      
      // Progress indicator
      if (i % 10 === 0) {
        console.log(`📖 Processed ${i}/${this.books.length} books`);
      }
      
      // Rate limiting: 1 request per 100ms
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const jsContent = `/**
 * Books Data - Generated from Goodreads Export
 * Generated on: ${new Date().toISOString()}
 * Total books: ${this.books.length}
 */

const GOODREADS_BOOKS = ${JSON.stringify(this.books, null, 2)};

// Update the BooksManager to use this data
class BooksManager {
  constructor() {
    this.books = GOODREADS_BOOKS;
    this.filteredBooks = [];
    this.currentPage = 1;
    this.booksPerPage = 12;
    this.currentCategory = 'all';
    
    this.initializeBooks();
    this.setupEventListeners();
  }

  initializeBooks() {
    // Sort by rating (highest first)
    this.books.sort((a, b) => b.rating - a.rating);
    this.filteredBooks = [...this.books];
    this.renderBooks();
    this.updatePagination();
  }

  // ... rest of the BooksManager methods remain the same
  ${this.getBooksManagerMethods()}
}

// Initialize the books manager when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new BooksManager();
});`;

    fs.writeFileSync(outputPath, jsContent);
    console.log(`✅ Generated books file: ${outputPath}`);
    console.log(`📊 Stats:`);
    console.log(`   - Total books: ${this.books.length}`);
    console.log(`   - With covers: ${this.books.filter(b => b.cover).length}`);
    console.log(`   - Categories: ${Object.values(this.books.reduce((acc, book) => { acc[book.category] = true; return acc; }, {})).length}`);
  }

  getBooksManagerMethods() {
    // Return the rest of the BooksManager methods from the original file
    return `
  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleFilterChange(btn.dataset.category);
      });
    });

    // Pagination buttons
    document.getElementById('prev-page')?.addEventListener('click', () => {
      this.goToPreviousPage();
    });

    document.getElementById('next-page')?.addEventListener('click', () => {
      this.goToNextPage();
    });
  }

  handleFilterChange(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });

    this.currentCategory = category;
    this.currentPage = 1;
    this.filterBooks();
    this.renderBooks();
    this.updatePagination();
  }

  filterBooks() {
    if (this.currentCategory === 'all') {
      this.filteredBooks = [...this.books];
    } else {
      this.filteredBooks = this.books.filter(book => book.category === this.currentCategory);
    }
  }

  getCurrentPageBooks() {
    const startIndex = (this.currentPage - 1) * this.booksPerPage;
    const endIndex = startIndex + this.booksPerPage;
    return this.filteredBooks.slice(startIndex, endIndex);
  }

  renderBooks() {
    const container = document.getElementById('books-grid');
    if (!container) return;

    const currentBooks = this.getCurrentPageBooks();
    
    container.innerHTML = currentBooks.map(book => this.createBookCard(book)).join('');

    container.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', () => {
        this.handleBookClick(parseInt(card.dataset.bookId));
      });
    });
  }

  createBookCard(book) {
    const stars = this.generateStars(book.rating);
    const coverContent = book.cover 
      ? \`<img src="\${book.cover}" alt="\${book.title} cover" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\\"book-cover-placeholder\\\">\${book.title}</div>'">\`
      : \`<div class="book-cover-placeholder">\${book.title}</div>\`;

    return \`
      <div class="book-card size-\${book.size}" data-book-id="\${book.id}">
        <div class="book-cover">
          \${coverContent}
        </div>
        <div class="book-info">
          <div class="book-category">\${this.getCategoryDisplayName(book.category)}</div>
          <h3 class="book-title">\${book.title}</h3>
          <div class="book-author">by \${book.author}</div>
          <p class="book-description">\${book.description}</p>
          <div class="book-rating">
            <span class="book-stars">\${stars}</span>
            <span class="book-rating-text">\${book.rating}/5</span>
          </div>
        </div>
      </div>
    \`;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  getCategoryDisplayName(category) {
    const categoryMap = {
      'ai': 'AI & Technology',
      'philosophy': 'Philosophy',
      'business': 'Business',
      'science': 'Science'
    };
    return categoryMap[category] || category;
  }

  handleBookClick(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      console.log('Book clicked:', book);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderBooks();
      this.updatePagination();
      this.scrollToTop();
    }
  }

  goToNextPage() {
    const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderBooks();
      this.updatePagination();
      this.scrollToTop();
    }
  }

  updatePagination() {
    const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
    
    document.getElementById('page-current').textContent = this.currentPage;
    document.getElementById('page-total').textContent = totalPages;
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages;
    }
  }

  scrollToTop() {
    const booksGrid = document.getElementById('books-grid');
    if (booksGrid) {
      booksGrid.scrollIntoView({ behavior: 'smooth' });
    }
  }`;
  }
}

// Usage example
async function main() {
  const importer = new GoodreadsImporter();
  
  // You'll need to place your goodreads_library_export.csv in the scripts folder
  const csvPath = path.join(__dirname, 'goodreads_library_export.csv');
  const outputPath = path.join(__dirname, '..', 'assets', 'js', 'books-goodreads.js');
  
  if (!fs.existsSync(csvPath)) {
    console.log('❌ Please download your Goodreads library export CSV and place it at:');
    console.log(`   ${csvPath}`);
    console.log('📥 Download from: https://www.goodreads.com/review/import');
    return;
  }

  try {
    importer.parseCsv(csvPath);
    await importer.generateBooksFile(outputPath);
    
    console.log('\\n🎉 Import complete!');
    console.log('📝 Next steps:');
    console.log('   1. Update books/index.html to use books-goodreads.js instead of books.js');
    console.log('   2. Test the import at http://localhost:8000/books/');
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default GoodreadsImporter;