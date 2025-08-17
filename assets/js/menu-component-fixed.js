/**
 * Fixed Menu Component - No Dynamic Path Detection
 * Uses a simple, reliable approach with hardcoded menu structure
 */

class MenuComponent {
  constructor(container) {
    this.container = container;
    this.render();
  }

  /**
   * Get the correct base path for navigation links
   */
  getBasePath() {
    const path = window.location.pathname;
    // If we're at root (/ or /index.html), no prefix needed
    if (path === '/' || path === '/index.html' || path === '') {
      return '';
    }
    // Otherwise, we need to go up one level
    return '../';
  }

  /**
   * Determine which menu item should be active
   */
  getActiveSection() {
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('/services/') || path.includes('/services')) return 'services';
    if (path.includes('/projects/') || path.includes('/projects')) return 'projects';
    if (path.includes('/books/') || path.includes('/books')) return 'books';
    if (path.includes('/links/') || path.includes('/links')) return 'links';
    if (path.includes('/cv/') || path.includes('/cv')) return 'cv';
    if (path.includes('/contact/') || path.includes('/contact')) return 'contact';
    if (path.includes('/products/') || path.includes('/products')) return 'products';
    
    return 'home'; // default
  }

  /**
   * Render the menu with consistent structure
   */
  render() {
    if (!this.container) {
      console.error('Menu container not found');
      return;
    }

    const basePath = this.getBasePath();
    const activeSection = this.getActiveSection();
    
    console.log('Menu render - Path:', window.location.pathname, 'Base:', basePath, 'Active:', activeSection);

    // FIXED menu structure - never changes
    const menuItems = [
      { href: basePath + 'services/', text: 'Services', section: 'services' },
      { href: basePath + 'projects/', text: 'Projects', section: 'projects' },
      { href: basePath + 'books/', text: 'Books', section: 'books' },
      { href: basePath + 'links/', text: 'Links', section: 'links' },
      { href: basePath + 'cv/', text: 'CV / About', section: 'cv' },
      { href: basePath + 'contact/', text: 'Contact', section: 'contact' }
    ];

    // Generate HTML
    const menuHTML = menuItems.map(item => {
      const isActive = item.section === activeSection;
      return `<a class="nav-link ${isActive ? 'active' : ''}" 
                 href="${item.href}" 
                 aria-current="${isActive}">
                ${item.text}
              </a>`;
    }).join('');

    this.container.innerHTML = menuHTML;
    console.log('Menu rendered with', menuItems.length, 'items, active:', activeSection);
  }
}

// Initialize menu when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing fixed menu component...');
  
  const navContainer = document.querySelector('.nav');
  if (navContainer) {
    window.menuComponent = new MenuComponent(navContainer);
  } else {
    console.error('Navigation container not found');
  }
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MenuComponent;
}