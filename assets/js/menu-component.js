/**
 * Reusable Menu Component System
 * Allows easy addition of new menu items with consistent styling and behavior
 */

class MenuComponent {
  constructor(container) {
    this.container = container;
    this.menuItems = [];
  }

  /**
   * Add a menu item to the navigation
   * @param {Object} item - Menu item configuration
   * @param {string} item.href - Link URL
   * @param {string} item.text - Display text
   * @param {string} item.current - Whether this is the current page
   * @param {string} item.id - Optional ID for the menu item
   */
  addMenuItem(item) {
    this.menuItems.push(item);
    this.render();
  }

  /**
   * Remove a menu item by href
   * @param {string} href - The href of the item to remove
   */
  removeMenuItem(href) {
    this.menuItems = this.menuItems.filter(item => item.href !== href);
    this.render();
  }

  /**
   * Set the active menu item
   * @param {string} href - The href of the active item
   */
  setActive(href) {
    this.menuItems.forEach(item => {
      item.current = item.href === href;
    });
    this.render();
  }

  /**
   * Initialize menu with default items
   */
  initializeDefault() {
    // More robust subdirectory detection
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment !== '');
    
    // If we have any path segments, we're in a subdirectory
    const isInSubdirectory = pathSegments.length > 0 && !currentPath.endsWith('.html');
    const basePath = isInSubdirectory ? '../' : '';
    
    console.log('Menu init - Path:', currentPath, 'Segments:', pathSegments, 'InSubdir:', isInSubdirectory, 'BasePath:', basePath);
    
    // ALWAYS maintain this exact order
    const defaultItems = [
      { href: basePath + 'services/', text: 'Services', current: false, section: 'services' },
      { href: basePath + 'projects/', text: 'Projects', current: false, section: 'projects' },
      { href: basePath + 'books/', text: 'Books', current: false, section: 'books' },
      { href: basePath + 'links/', text: 'Links', current: false, section: 'links' },
      { href: basePath + 'cv/', text: 'CV / About', current: false, section: 'cv' },
      { href: basePath + 'contact/', text: 'Contact', current: false, section: 'contact' }
    ];

    this.menuItems = defaultItems;
    this.setActiveFromCurrentPath();
    this.render();
  }

  /**
   * Automatically set active item based on current path
   */
  setActiveFromCurrentPath() {
    const currentPath = window.location.pathname;
    console.log('Setting active state for path:', currentPath);
    
    this.menuItems.forEach(item => {
      // Use the section property if available, otherwise extract from href
      const sectionName = item.section || item.href.match(/(?:\.\.\/)?([^\/]+)\/?$/)?.[1] || '';
      
      // Check if current path contains this section
      const isActive = currentPath.includes('/' + sectionName + '/') || 
                      currentPath.includes('/' + sectionName) ||
                      (currentPath === '/' && sectionName === 'home');
      
      item.current = isActive;
      console.log(`→ ${item.text} (${sectionName}): ${isActive ? 'ACTIVE' : 'inactive'}`);
    });
  }

  /**
   * Render the menu
   */
  render() {
    if (!this.container) {
      console.error('Menu container not found!');
      return;
    }

    console.log('Rendering menu with', this.menuItems.length, 'items:', this.menuItems.map(i => i.text));

    const menuHTML = this.menuItems.map(item => `
      <a class="nav-link ${item.current ? 'active' : ''}" 
         href="${item.href}" 
         aria-current="${item.current}"
         ${item.id ? `id="${item.id}"` : ''}>
        ${item.text}
      </a>
    `).join('');

    this.container.innerHTML = menuHTML;
    console.log('Menu rendered successfully');
  }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing menu component...');
  
  const navContainer = document.querySelector('.nav');
  if (navContainer) {
    console.log('Nav container found, creating menu component');
    window.menuComponent = new MenuComponent(navContainer);
    window.menuComponent.initializeDefault();
  } else {
    console.error('Nav container (.nav) not found in DOM!');
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MenuComponent;
}