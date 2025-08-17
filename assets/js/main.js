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
        window.location.href = "/search/";
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

    // Inject Umami analytics if configured globally
    try {
      const umami = window.UMAMI_WEBSITE_ID;
      if (umami && !document.querySelector('script[data-umami]')) {
        const s = document.createElement('script');
        s.async = true;
        s.defer = true;
        s.setAttribute('data-umami', 'true');
        s.setAttribute('data-website-id', umami);
        s.src = (window.UMAMI_HOST || 'https://cloud.umami.is') + '/script.js';
        document.head.appendChild(s);
      }
    } catch {}

    // Post-load enhancements: share URLs and webmentions list
    try {
      const currentUrl = (function(){
        try { return window.SITE_URL ? new URL(location.pathname, window.SITE_URL).toString() : location.href; }
        catch { return location.href; }
      })();
      const title = (document.querySelector('h1')?.textContent || document.title || '').trim();
      document.querySelectorAll('[data-share]')?.forEach((a) => {
        const t = a.getAttribute('data-share');
        if (t === 'x') a.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
        if (t === 'linkedin') a.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
      });
      const wmEl = document.getElementById('webmentions');
      if (wmEl) {
        fetch('/webmentions.json', { cache: 'no-store' }).then(r => r.json()).then(data => {
          const items = (data.children || []).filter(m => (m['wm-target'] || '').replace(/\/?$/, '/') === currentUrl.replace(/\/?$/, '/'));
          if (!items.length) { wmEl.innerHTML = '<p class="muted">No mentions yet.</p>'; return; }
          wmEl.innerHTML = items.map(m => {
            const author = (m.author && (m.author.name || m.author.url || '')) || '';
            const url = m['url'] || m['wm-source'] || '#';
            const content = (m.content && (m.content.text || m.content.markdown || '')) || '';
            return `<div class="mention"><p><a href="${url}" rel="nofollow noopener">${author}</a></p><p class="muted">${content}</p></div>`;
          }).join('');
        }).catch(()=>{});
      }
      // Build a consistent, single-source-of-truth navigation on every page
      try {
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
          const nav = document.querySelector('header .nav');
          if (nav) {
            const path = window.location.pathname || '/';
            if (path.startsWith('/admin/')) { /* keep admin nav untouched */ return; }
            
            const base = (path === '/' || path === '/index.html' || path === '') ? '' : '../';
            const active = (() => {
              const p = path.toLowerCase();
              if (p.includes('/services')) return 'services';
              if (p.includes('/projects')) return 'projects';
              if (p.includes('/books')) return 'books';
              if (p.includes('/links')) return 'links';
              if (p.includes('/cv')) return 'cv';
              if (p.includes('/contact')) return 'contact';
              if (p.includes('/products')) return 'products';
              return 'home';
            })();

            const items = [
              { href: base + 'services/', text: 'Services', section: 'services' },
              { href: base + 'projects/', text: 'Projects', section: 'projects' },
              { href: base + 'books/', text: 'Books', section: 'books' },
              { href: base + 'links/', text: 'Links', section: 'links' },
              { href: base + 'cv/', text: 'CV / About', section: 'cv' },
              { href: base + 'contact/', text: 'Contact', section: 'contact' }
            ];
            // Optionally show Products in the menu if enabled
            if (window.FEATURE_PRODUCTS) {
              // insert before Contact for predictable placement
              items.splice(items.length - 1, 0, { href: base + 'products/', text: 'Products', section: 'products' });
            }

            // Clear any existing content and rebuild
            nav.innerHTML = '';
            items.forEach(item => {
              const link = document.createElement('a');
              link.className = `nav-link ${item.section === active ? 'active' : ''}`;
              link.href = item.href;
              link.setAttribute('aria-current', item.section === active);
              link.textContent = item.text;
              nav.appendChild(link);
            });
            
            console.log('Navigation rebuilt with', items.length, 'items, active:', active);
          }
        }, 50);
      } catch (err) {
        console.warn('Failed to rebuild navigation:', err);
      }
      // Progressive reveal animations using IntersectionObserver (respects reduced motion)
      try {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
          document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('is-visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
          });
        } else if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries, obs) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const target = entry.target;

              // If this is a stagger container, set delays on children and flag container visible
              if (target.classList.contains('reveal-stagger')) {
                const children = Array.from(target.children);
                children.forEach((child, i) => child.style.setProperty('--reveal-delay', `${Math.min(i * 80, 600)}ms`));
                target.classList.add('is-visible');
                obs.unobserve(target);
                continue;
              }

              // Otherwise reveal the target element itself
              target.classList.add('is-visible');
              obs.unobserve(target);
            }
          }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
          document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-stagger').forEach(el => observer.observe(el));
        } else {
          document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-stagger').forEach(el => el.classList.add('is-visible'));
        }
      } catch {}
      // Referral tracking param preservation
      try {
        const refKey = window.REFERRAL_PARAM || 'ref';
        const refVal = new URLSearchParams(location.search).get(refKey);
        if (refVal) {
          sessionStorage.setItem('ref', refVal);
          document.querySelectorAll('a[href^="/"]').forEach(a => {
            const url = new URL(a.getAttribute('href'), location.origin);
            url.searchParams.set(refKey, refVal);
            a.setAttribute('href', url.pathname + url.search + url.hash);
          });
        }
      } catch {}

  // Global conversion CTAs: sticky button and header book link
  try {
    const bookUrl = window.CALENDLY_URL || '';
    if (bookUrl) {
      // Header book link
      const header = document.querySelector('header .header-actions');
      if (header && !document.getElementById('book-top')) {
        const a = document.createElement('a');
        a.id = 'book-top';
        a.className = 'btn';
        a.href = bookUrl; a.textContent = 'Book call';
        header.prepend(a);
      }
      // Sticky bottom-right CTA
      if (!document.getElementById('sticky-book')) {
        const btn = document.createElement('a');
        btn.id = 'sticky-book';
        btn.href = bookUrl; btn.textContent = 'Book a 30‑min call';
        btn.style.position = 'fixed';
        btn.style.right = '16px'; btn.style.bottom = '16px';
        btn.style.zIndex = '60';
        btn.style.padding = '10px 12px'; btn.style.borderRadius = '12px';
        btn.style.background = 'color-mix(in oklab, var(--bg) 85%, transparent)';
        btn.style.border = '1px solid color-mix(in oklab, var(--fg) 16%, transparent)';
        btn.style.fontFamily = 'JetBrains Mono, ui-monospace'; btn.style.fontSize = '12px';
        btn.style.color = 'var(--fg)'; btn.style.textDecoration = 'none';
        btn.onmouseenter = () => btn.style.boxShadow = '0 0 0 1px var(--matrix-neo), inset 0 0 12px rgba(0,255,149,.08)';
        btn.onmouseleave = () => btn.style.boxShadow = 'none';
        document.body.appendChild(btn);
      }
    }
  } catch {}
    } catch {}
  })();
} catch (err) {
  console.error('Script error:', err);
}
// Expand/collapse service summaries (progressive enhancement)
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Track CTA clicks (Umami, if available)
    document.querySelectorAll('.track-cta').forEach((el) => {
      el.addEventListener('click', () => {
        try { if (window.umami && typeof window.umami.track === 'function') window.umami.track('cta_click', { id: (el.textContent || '').trim() }); } catch {}
      });
    });
    document.querySelectorAll('[data-expand]')?.forEach(a => {
      a.addEventListener('click', () => {
        const id = a.getAttribute('data-expand');
        const panel = document.getElementById('exp-' + id);
        if (!panel) return;
        const isHidden = panel.hasAttribute('hidden');
        if (isHidden) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      });
    });
    const toggle = document.getElementById('expand-toggle');
    toggle?.addEventListener('click', () => {
      const panels = Array.from(document.querySelectorAll('.exp'));
      const anyHidden = panels.some(p => p.hasAttribute('hidden'));
      panels.forEach(p => anyHidden ? p.removeAttribute('hidden') : p.setAttribute('hidden',''));
      toggle.textContent = anyHidden ? 'Collapse all' : 'Expand all';
    });
    // Inline book and hero buttons respect CALENDLY_URL
    document.querySelectorAll('.book-svc, #book-hero').forEach(b => {
      const u = window.CALENDLY_URL || '';
      if (u) b.setAttribute('href', u); else b.remove();
    });
  } catch {}
});