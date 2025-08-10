// Wrap in try-catch to prevent script errors from hanging the page
try {
(function () {
  const root = document.documentElement;
  root.setAttribute("data-theme", "matrix");
    
    // Simple command palette
  const overlay = document.getElementById("cmdk-overlay");
  const input = document.getElementById("cmdk-input");
  const list = document.getElementById("cmdk-list");
  const openBtn = document.getElementById("cmdk");
  const closeBtn = document.getElementById("cmdk-close");

  function openPalette() {
    if (!overlay) return;
    overlay.hidden = false;
      input?.focus();
  }
    
  function closePalette() {
    if (!overlay) return;
    overlay.hidden = true;
      if (input) input.value = "";
  }

  function runAction(action) {
    if (!action) return;
    if (action.startsWith("go:")) {
      window.location.href = action.slice(3);
    } else if (action === "search") {
        window.location.href = "essays/?q=";
    }
    closePalette();
  }

    // Basic keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
        if (overlay?.hidden) openPalette();
        else closePalette();
    }
    if (e.key === "Escape") closePalette();
  });

    // Click handlers
    openBtn?.addEventListener("click", openPalette);
    closeBtn?.addEventListener("click", closePalette);
    list?.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    runAction(li.getAttribute("data-action"));
  });

    // Focus mode toggle
    document.addEventListener('keydown', (e) => {
      if (e.key?.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        root.classList.toggle('focus-mode');
      }
    });
  })();
} catch (err) {
  console.error('Script error:', err);
}