# Books Section

A curated collection of books with dynamic pagination and varied visual layouts.

## Features

- **Varied Sizes**: Books display in different card sizes (small, medium, large, featured) for visual interest
- **Categories**: Filter books by AI & Technology, Philosophy, Business, Science
- **Pagination**: 12 books per page with next/previous navigation
- **Responsive Design**: Adapts to different screen sizes
- **Cover Placeholders**: Generates attractive placeholders when book covers aren't available

## How to Add Books

Edit the `books` array in `/assets/js/books.js`:

```javascript
{
  id: 16,
  title: "Your Book Title",
  author: "Author Name",
  category: "ai", // ai, philosophy, business, science
  description: "Brief description of the book",
  rating: 4.5,
  size: "medium", // small, medium, large, featured
  cover: "assets/img/books/your-book-cover.jpg" // or null for placeholder
}
```

## Size Guidelines

- **small**: Single column, 280px height
- **medium**: Single column, 320px height  
- **large**: Two columns, 240px height, horizontal layout
- **featured**: Two columns, 360px height, larger text

## Integration

The books section uses the reusable menu component system. To add it to other pages:

1. Include the menu component script: `<script defer src="assets/js/menu-component.js"></script>`
2. The Books menu item will automatically appear in the navigation

## Customization

The books section can be easily customized by:
- Modifying the CSS in `/assets/css/books.css`
- Adjusting the book data structure in `/assets/js/books.js`
- Changing the pagination settings (`booksPerPage` property)
- Adding new categories to the filter system