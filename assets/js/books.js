/**
 * Books Section JavaScript
 * Handles book display, filtering, pagination, and dynamic sizing
 */

class BooksManager {
  constructor() {
    this.books = [];
    this.filteredBooks = [];
    this.currentPage = 1;
    this.booksPerPage = 12;
    this.currentCategory = 'all';
    
    this.initializeBooks();
    this.setupEventListeners();
  }

  initializeBooks() {
    // Sample book data with varied metadata for demonstration
    this.books = [
      {
        id: 1,
        title: "The Alignment Problem",
        author: "Brian Christian",
        category: "ai",
        description: "How can we build AI systems that learn what we value and behave in accordance with those values?",
        rating: 4.5,
        size: "featured",
        cover: null // Will use placeholder
      },
      {
        id: 2,
        title: "Superintelligence",
        author: "Nick Bostrom",
        category: "ai",
        description: "What happens when machines surpass humans in general intelligence?",
        rating: 4.3,
        size: "large",
        cover: null
      },
      {
        id: 3,
        title: "The Innovator's Dilemma",
        author: "Clayton Christensen",
        category: "business",
        description: "Why great companies fail when they encounter certain types of market and technology change.",
        rating: 4.4,
        size: "medium",
        cover: null
      },
      {
        id: 4,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        category: "philosophy",
        description: "A groundbreaking tour of the mind and explains the two systems that drive the way we think.",
        rating: 4.6,
        size: "small",
        cover: null
      },
      {
        id: 5,
        title: "The Structure of Scientific Revolutions",
        author: "Thomas S. Kuhn",
        category: "science",
        description: "How scientific knowledge advances through paradigm shifts rather than gradual accumulation.",
        rating: 4.2,
        size: "medium",
        cover: null
      },
      {
        id: 6,
        title: "Gödel, Escher, Bach",
        author: "Douglas Hofstadter",
        category: "philosophy",
        description: "An eternal golden braid exploring consciousness, meaning, and the nature of intelligence.",
        rating: 4.7,
        size: "large",
        cover: null
      },
      {
        id: 7,
        title: "Zero to One",
        author: "Peter Thiel",
        category: "business",
        description: "Notes on startups, or how to build the future by creating something truly new.",
        rating: 4.1,
        size: "small",
        cover: null
      },
      {
        id: 8,
        title: "The Master Algorithm",
        author: "Pedro Domingos",
        category: "ai",
        description: "How the quest for the ultimate learning algorithm will remake our world.",
        rating: 4.0,
        size: "medium",
        cover: null
      },
      {
        id: 9,
        title: "Antifragile",
        author: "Nassim Nicholas Taleb",
        category: "philosophy",
        description: "Things that gain from disorder and how to thrive in an uncertain world.",
        rating: 4.3,
        size: "small",
        cover: null
      },
      {
        id: 10,
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "business",
        description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
        rating: 4.2,
        size: "medium",
        cover: null
      },
      {
        id: 11,
        title: "Life 3.0",
        author: "Max Tegmark",
        category: "ai",
        description: "Being human in the age of artificial intelligence and what it means for our future.",
        rating: 4.4,
        size: "featured",
        cover: null
      },
      {
        id: 12,
        title: "The Selfish Gene",
        author: "Richard Dawkins",
        category: "science",
        description: "A view of evolution and natural selection from the gene's point of view.",
        rating: 4.5,
        size: "small",
        cover: null
      },
      {
        id: 13,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "philosophy",
        description: "A brief history of humankind and how we became the dominant species on Earth.",
        rating: 4.6,
        size: "large",
        cover: null
      },
      {
        id: 14,
        title: "The Pragmatic Programmer",
        author: "David Thomas & Andrew Hunt",
        category: "ai",
        description: "Your journey to mastery in the art and craft of programming.",
        rating: 4.5,
        size: "medium",
        cover: null
      },
      {
        id: 15,
        title: "Complexity",
        author: "Mitchell Waldrop",
        category: "science",
        description: "The emerging science at the edge of order and chaos.",
        rating: 4.1,
        size: "small",
        cover: null
      }
    ];

    this.filteredBooks = [...this.books];
    this.renderBooks();
    this.updatePagination();
  }

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
    // Update active filter button
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

    // Add click handlers for book cards
    container.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', () => {
        this.handleBookClick(parseInt(card.dataset.bookId));
      });
    });
  }

  createBookCard(book) {
    const stars = this.generateStars(book.rating);
    const coverContent = book.cover 
      ? `<img src="${book.cover}" alt="${book.title} cover" loading="lazy">`
      : `<div class="book-cover-placeholder">${book.title}</div>`;

    return `
      <div class="book-card size-${book.size}" data-book-id="${book.id}">
        <div class="book-cover">
          ${coverContent}
        </div>
        <div class="book-info">
          <div class="book-category">${this.getCategoryDisplayName(book.category)}</div>
          <h3 class="book-title">${book.title}</h3>
          <div class="book-author">by ${book.author}</div>
          <p class="book-description">${book.description}</p>
          <div class="book-rating">
            <span class="book-stars">${stars}</span>
            <span class="book-rating-text">${book.rating}/5</span>
          </div>
        </div>
      </div>
    `;
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
      // For now, just log the book click
      // In a real implementation, this could open a modal, navigate to a detail page, etc.
      console.log('Book clicked:', book);
      
      // You could implement a modal or redirect to a book detail page here
      // Example: window.location.href = `book-detail.html?id=${book.id}`;
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
  }
}

// Initialize the books manager when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new BooksManager();
});