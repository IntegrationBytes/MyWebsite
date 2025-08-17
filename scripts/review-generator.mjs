/**
 * Book Review Generator for SEO Traffic
 * Selects top 50 books and creates detailed review pages for traffic generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BookReviewGenerator {
  constructor() {
    this.reviewPrompts = {
      ai: {
        intro: "As an AI engineer with practical experience building systems,",
        themes: ["technical implementation", "real-world applications", "ethical implications", "future predictions"],
        questions: [
          "How does this book's vision align with current AI development?",
          "What practical insights can engineers apply today?",
          "Where does the author get it right, and where do they miss the mark?",
          "How has this book influenced my own AI work?"
        ]
      },
      philosophy: {
        intro: "From the perspective of someone building the future intersection of human and machine intelligence,",
        themes: ["consciousness", "meaning", "decision-making", "human nature"],
        questions: [
          "How does this philosophical framework apply to AI development?",
          "What does this mean for human-AI collaboration?",
          "How do these ideas shape product decisions?",
          "What would the author think about current AI progress?"
        ]
      },
      business: {
        intro: "Having founded and exited a 7-person fintech company,",
        themes: ["execution", "market dynamics", "leadership", "innovation"],
        questions: [
          "How does this apply to AI-first companies?",
          "What would I do differently knowing this?",
          "How do these principles scale in the AI era?",
          "What's the author's best tactical advice?"
        ]
      },
      science: {
        intro: "As someone who bridges theoretical knowledge with practical engineering,",
        themes: ["methodology", "discovery", "complexity", "systems thinking"],
        questions: [
          "How does this scientific thinking apply to AI research?",
          "What patterns can we apply to technology development?",
          "How does this change how we approach problems?",
          "What are the implications for AI safety?"
        ]
      }
    };
  }

  /**
   * Select top 50 books for reviews based on rating, impact potential, and SEO value
   */
  selectBooksForReviews(books) {
    console.log('🎯 Selecting books for detailed reviews...');
    
    // Score books for review potential
    const scoredBooks = books.map(book => ({
      ...book,
      reviewScore: this.calculateReviewScore(book)
    }));

    // Sort by review score and select top 50
    const selectedBooks = scoredBooks
      .sort((a, b) => b.reviewScore - a.reviewScore)
      .slice(0, 50);

    console.log(`✅ Selected ${selectedBooks.length} books for reviews`);
    console.log(`📈 Score range: ${selectedBooks[selectedBooks.length-1].reviewScore.toFixed(2)} - ${selectedBooks[0].reviewScore.toFixed(2)}`);
    
    return selectedBooks;
  }

  calculateReviewScore(book) {
    let score = 0;
    
    // Rating weight (5-star = 10 points, 4-star = 7 points)
    score += book.rating === 5 ? 10 : 7;
    
    // Popular/searchable authors (bonus points)
    const popularAuthors = [
      'yuval noah harari', 'daniel kahneman', 'nassim nicholas taleb',
      'nick bostrom', 'pedro domingos', 'max tegmark', 'brian christian',
      'peter thiel', 'clayton christensen', 'douglas hofstadter',
      'richard dawkins', 'steven pinker', 'malcolm gladwell'
    ];
    
    if (popularAuthors.some(author => book.author.toLowerCase().includes(author))) {
      score += 15;
    }
    
    // SEO-friendly titles (shorter, more searchable)
    if (book.title.length < 30) score += 5;
    if (book.title.length < 20) score += 3;
    
    // Evergreen topics bonus
    const evergreenTerms = [
      'intelligence', 'future', 'thinking', 'human', 'technology',
      'startup', 'innovation', 'consciousness', 'evolution', 'learning'
    ];
    
    const titleLower = book.title.toLowerCase();
    evergreenTerms.forEach(term => {
      if (titleLower.includes(term)) score += 2;
    });
    
    return score;
  }

  /**
   * Generate AI-assisted review prompts for Claude
   */
  generateReviewPrompts(selectedBooks) {
    console.log('✍️  Generating review prompts...');
    
    const prompts = selectedBooks.map(book => {
      const category = this.reviewPrompts[book.category] || this.reviewPrompts.philosophy;
      
      return {
        book: book,
        prompt: this.createDetailedPrompt(book, category),
        seoKeywords: this.generateSEOKeywords(book),
        suggestedLength: '800-1200 words'
      };
    });

    return prompts;
  }

  createDetailedPrompt(book, categoryData) {
    return `Write a detailed, personal book review for "${book.title}" by ${book.author}.

${categoryData.intro} here's my perspective on this book:

REVIEW STRUCTURE:
1. **Hook** (2-3 sentences): Why this book matters now
2. **Core Thesis** (100 words): What's the main argument/insight?
3. **Key Takeaways** (300-400 words): 3-4 specific insights with examples
4. **Personal Application** (200-300 words): How I've applied these ideas in my work
5. **Critical Analysis** (200-250 words): What works, what doesn't, missing pieces
6. **Bottom Line** (100 words): Who should read this and why

KEY THEMES TO EXPLORE:
${categoryData.themes.map(theme => `- ${theme}`).join('\n')}

GUIDING QUESTIONS:
${categoryData.questions.map(q => `- ${q}`).join('\n')}

TONE: 
- Personal but authoritative
- Technical but accessible
- Honest about limitations
- Connect to current AI/tech trends
- Include specific examples from my experience

AUDIENCE: 
- AI engineers and entrepreneurs
- Technical decision makers
- People interested in the intersection of technology and [${book.category}]

Make it feel like a conversation with a colleague who's actually read and applied the book's ideas in real work.`;
  }

  generateSEOKeywords(book) {
    const baseKeywords = [
      `${book.title.toLowerCase()} review`,
      `${book.author.toLowerCase()} book review`,
      `${book.title.toLowerCase()} summary`,
      `best ${book.category} books`,
      `${book.category} book recommendations`
    ];

    // Add AI-specific keywords
    const aiKeywords = [
      'ai engineer reading list',
      'technology book reviews',
      'startup founder books',
      'artificial intelligence books'
    ];

    return [...baseKeywords, ...aiKeywords];
  }

  /**
   * Generate individual review page templates
   */
  generateReviewPages(reviewPrompts) {
    console.log('📄 Generating review page templates...');
    
    const reviewsDir = path.join(__dirname, '..', 'books', 'reviews');
    if (!fs.existsSync(reviewsDir)) {
      fs.mkdirSync(reviewsDir, { recursive: true });
    }

    reviewPrompts.forEach((item, index) => {
      const book = item.book;
      const slug = this.createSlug(book.title);
      const filepath = path.join(reviewsDir, `${slug}.html`);
      
      const html = this.createReviewPageTemplate(book, item);
      fs.writeFileSync(filepath, html);
      
      if (index % 10 === 0) {
        console.log(`📝 Generated ${index + 1}/${reviewPrompts.length} review pages`);
      }
    });

    console.log(`✅ Generated ${reviewPrompts.length} review page templates`);
  }

  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  createReviewPageTemplate(book, promptData) {
    const slug = this.createSlug(book.title);
    const keywords = promptData.seoKeywords.join(', ');
    
    return `<!doctype html>
<html lang="en" data-theme="matrix">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${book.title} Review - Vincent Viitala's Take on ${book.author}'s Masterpiece</title>
  <meta name="description" content="Detailed review of ${book.title} by ${book.author}. AI engineer's perspective on key insights, practical applications, and why this ${book.category} book matters for tech leaders." />
  <meta name="keywords" content="${keywords}" />
  <meta name="theme-color" content="#050807" />
  <link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="/books/reviews/${slug}/">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${book.title} Review - Insights for AI Engineers">
  <meta property="og:description" content="Detailed review of ${book.title} by ${book.author} from an AI engineer's perspective. Key takeaways and practical applications.">
  <meta property="og:url" content="/books/reviews/${slug}/">
  <meta property="og:image" content="../../assets/img/og-default.svg">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${book.title} Review - AI Engineer's Perspective">
  <meta name="twitter:description" content="My detailed take on ${book.author}'s ${book.title} and how it applies to modern AI development.">
  
  <!-- Fonts and Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@300;400;600&family=Source+Serif+4:opsz@8..60&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/css/styles.css">
  <link rel="stylesheet" href="../../assets/css/books.css">
  
  <!-- Scripts -->
  <script defer src="../../assets/js/config.js"></script>
  <script defer src="../../assets/js/menu-component-fixed.js"></script>
  <script defer src="../../assets/js/main.js"></script>
  <script defer src="../../assets/js/beacon.js"></script>
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Book",
      "name": "${book.title}",
      "author": {
        "@type": "Person",
        "name": "${book.author}"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "${book.rating}",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Vincent Viitala",
      "jobTitle": "AI Engineer",
      "url": "https://example.com"
    },
    "datePublished": "${new Date().toISOString().split('T')[0]}",
    "reviewBody": "Detailed review coming soon..."
  }
  </script>
</head>

<body>
<header class="site-header" role="banner">
  <div class="container header-inner">
    <a class="brand" href="../../"><span class="glyph">◇</span> Vincent Viitala</a>
    <nav aria-label="Primary" class="nav">
      <!-- Menu items will be populated by menu-component.js -->
    </nav>
    <div class="header-actions">
      <button id="cmdk" class="btn btn-ghost" aria-label="Open Command Palette (Ctrl/⌘K)"><span>⌘K</span></button>
    </div>
  </div>
</header>

<main class="container" role="main">
  <article class="book-review">
    <header class="review-header">
      <nav class="breadcrumb">
        <a href="../../books/">Books</a> → <span>Review</span>
      </nav>
      
      <div class="book-meta">
        <div class="book-cover-large">
          ${book.cover ? `<img src="${book.cover}" alt="${book.title} cover" loading="eager">` : `<div class="book-cover-placeholder">${book.title}</div>`}
        </div>
        <div class="book-details">
          <h1>${book.title}</h1>
          <p class="book-author">by ${book.author}</p>
          <div class="book-rating">
            <span class="book-stars">${this.generateStars(book.rating)}</span>
            <span class="rating-text">${book.rating}/5 stars</span>
          </div>
          <div class="book-category">
            <span class="badge">${this.getCategoryDisplayName(book.category)}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="review-content">
      <div class="review-placeholder">
        <h2>📝 Review Coming Soon</h2>
        <p>I'm currently working on a detailed review of this book. Check back soon for:</p>
        <ul>
          <li>Key insights and takeaways</li>
          <li>How I've applied these ideas in my AI work</li>
          <li>Critical analysis and limitations</li>
          <li>Who should (and shouldn't) read this book</li>
        </ul>
        
        <div class="callout">
          <div class="title">Want the review faster?</div>
          <p>If you're particularly interested in my take on this book, <a href="../../contact/">let me know</a> and I'll prioritize it.</p>
        </div>
      </div>

      <!-- TODO: Replace with actual review content -->
      <!--
      CLAUDE PROMPT FOR THIS REVIEW:
      ${promptData.prompt.replace(/\n/g, '\n      ')}
      -->
    </div>

    <footer class="review-footer">
      <div class="related-books">
        <h3>Related Books</h3>
        <p>If you found this review helpful, you might also enjoy my reviews of other ${book.category} books.</p>
        <a href="../" class="btn">Browse All Book Reviews</a>
      </div>
    </footer>
  </article>
</main>

<footer class="site-footer" role="contentinfo">
  <div class="container footer-inner">
    <div class="left">
      <p class="muted">© 2025 Vincent Viitala</p>
      <p class="muted">AI engineer building dependable systems. Available for challenging work.</p>
    </div>
    <div class="right">
      <a href="https://github.com/" target="_blank" rel="noopener" class="tag">GitHub</a>
      <a href="https://www.linkedin.com/" target="_blank" rel="noopener" class="tag">LinkedIn</a>
      <a href="../../contact/" class="tag">Contact</a>
    </div>
  </div>
</footer>

</body>
</html>`;
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

  /**
   * Generate review prompts file for Claude
   */
  generateReviewPromptsFile(reviewPrompts) {
    const promptsFile = path.join(__dirname, 'review-prompts.json');
    
    const promptsData = {
      generated: new Date().toISOString(),
      totalBooks: reviewPrompts.length,
      prompts: reviewPrompts.map((item, index) => ({
        id: index + 1,
        slug: this.createSlug(item.book.title),
        book: {
          title: item.book.title,
          author: item.book.author,
          rating: item.book.rating,
          category: item.book.category
        },
        prompt: item.prompt,
        seoKeywords: item.seoKeywords,
        suggestedLength: item.suggestedLength,
        filepath: `books/reviews/${this.createSlug(item.book.title)}.html`
      }))
    };

    fs.writeFileSync(promptsFile, JSON.stringify(promptsData, null, 2));
    console.log(`✅ Generated review prompts file: ${promptsFile}`);
    
    return promptsData;
  }
}

// Usage
async function main() {
  // This assumes you've already run the Goodreads import
  const booksFile = path.join(__dirname, '..', 'assets', 'js', 'books-goodreads.js');
  
  if (!fs.existsSync(booksFile)) {
    console.log('❌ Please run the Goodreads import first to generate books-goodreads.js');
    return;
  }

  // Extract books data from the generated file
  const booksContent = fs.readFileSync(booksFile, 'utf-8');
  const booksMatch = booksContent.match(/const GOODREADS_BOOKS = (\[.*?\]);/s);
  
  if (!booksMatch) {
    console.log('❌ Could not find GOODREADS_BOOKS in the generated file');
    return;
  }

  const books = JSON.parse(booksMatch[1]);
  
  const generator = new BookReviewGenerator();
  
  console.log('🚀 Starting book review generation process...');
  
  // Select top 50 books for reviews
  const selectedBooks = generator.selectBooksForReviews(books);
  
  // Generate review prompts
  const reviewPrompts = generator.generateReviewPrompts(selectedBooks);
  
  // Generate review page templates
  generator.generateReviewPages(reviewPrompts);
  
  // Generate prompts file for Claude
  const promptsData = generator.generateReviewPromptsFile(reviewPrompts);
  
  console.log('\\n🎉 Review system generated!');
  console.log('📊 Summary:');
  console.log(`   - Selected ${selectedBooks.length} books for reviews`);
  console.log(`   - Generated ${reviewPrompts.length} review prompts`);
  console.log(`   - Created review page templates in books/reviews/`);
  console.log('\\n📝 Next steps:');
  console.log('   1. Review the prompts in scripts/review-prompts.json');
  console.log('   2. Use Claude to write the actual reviews');
  console.log('   3. Replace placeholder content in the HTML files');
  console.log('   4. Update books/index.html to link to reviews');
  console.log('   5. Add to sitemap.xml for SEO');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default BookReviewGenerator;