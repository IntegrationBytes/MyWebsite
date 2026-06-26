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

    // Inject Microsoft Clarity if configured
    try {
      const clarity = window.CLARITY_ID || '';
      if (clarity && !window.clarity) {
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", clarity);
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
              if (p.includes('/business')) return 'business';
              if (p.includes('/case-studies')) return 'case-studies';
              if (p.includes('/faq')) return 'faq';
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
              // Inserted via feature flag to keep menu flexible
              // Placed immediately after Services for business-facing users
              // (falls back to omission if disabled)
              ...(window.FEATURE_BUSINESS ? [{ href: base + 'business/', text: 'Solutions', section: 'business' }] : []),
              { href: base + 'projects/', text: 'Projects', section: 'projects' },
              { href: base + 'case-studies/', text: 'Case Studies', section: 'case-studies' },
              { href: base + 'faq/', text: 'FAQ', section: 'faq' },
              { href: base + 'books/', text: 'Books', section: 'books' },
              { href: base + 'links/', text: 'Links', section: 'links' },
              { href: base + 'cv/', text: 'About', section: 'cv' },
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

            // Update mobile menu navigation if it exists
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav) {
              mobileNav.innerHTML = '';
              items.forEach(item => {
                const link = document.createElement('a');
                link.className = `nav-link ${item.section === active ? 'active' : ''}`;
                link.href = item.href;
                link.setAttribute('aria-current', item.section === active);
                link.textContent = item.text;
                mobileNav.appendChild(link);
              });
              console.log('Mobile navigation updated with', items.length, 'items');
            } else {
              console.warn('Mobile navigation container not found for updating - will retry');
              // Retry after a short delay to ensure mobile menu is created
              setTimeout(() => {
                const retryMobileNav = document.querySelector('.mobile-nav');
                if (retryMobileNav) {
                  retryMobileNav.innerHTML = '';
                  items.forEach(item => {
                    const link = document.createElement('a');
                    link.className = `nav-link ${item.section === active ? 'active' : ''}`;
                    link.href = item.href;
                    link.setAttribute('aria-current', item.section === active);
                    link.textContent = item.text;
                    retryMobileNav.appendChild(link);
                  });
                  console.log('Mobile navigation updated on retry with', items.length, 'items');
                } else {
                  console.error('Mobile navigation container still not found after retry');
                }
              }, 200);
            }

            // Ensure Command Palette contains Solutions entry and targeted variants + Case Studies/FAQ
            try {
              const cmdkList = document.getElementById('cmdk-list');
              if (cmdkList && window.FEATURE_BUSINESS) {
                const businessAction = `go:${base}business/`;
                const exists = cmdkList.querySelector(`li[data-action="${businessAction}"]`);
                if (!exists) {
                  const li = document.createElement('li');
                  li.setAttribute('data-action', businessAction);
                  li.textContent = 'Solutions';
                  const searchLi = cmdkList.querySelector('li[data-action="search"]');
                  if (searchLi) cmdkList.insertBefore(li, searchLi); else cmdkList.appendChild(li);
                }

                // Targeted variants
                const businessTargets = [
                  { text: 'Solutions: SMB Owners', path: `${base}business/smb/` },
                  { text: 'Solutions: B2B SaaS', path: `${base}business/saas/` },
                  { text: 'Solutions: Agencies', path: `${base}business/agencies/` },
                  { text: 'Solutions: E-commerce', path: `${base}business/ecommerce/` },
                  { text: 'Solutions: Professional Services', path: `${base}business/professional-services/` }
                ];
                const searchLi = cmdkList.querySelector('li[data-action="search"]');
                for (const t of businessTargets) {
                  const action = 'go:' + t.path;
                  if (!cmdkList.querySelector(`li[data-action="${action}"]`)) {
                    const li = document.createElement('li');
                    li.setAttribute('data-action', action);
                    li.textContent = t.text;
                    if (searchLi) cmdkList.insertBefore(li, searchLi); else cmdkList.appendChild(li);
                  }
                }
                // Case Studies & FAQ
                const extra = [
                  { text: 'Case Studies', path: `${base}case-studies/` },
                  { text: 'FAQ', path: `${base}faq/` },
                  { text: 'About', path: `${base}cv/` }
                ];
                for (const t of extra) {
                  const action = 'go:' + t.path;
                  if (!cmdkList.querySelector(`li[data-action="${action}"]`)) {
                    const li = document.createElement('li'); li.setAttribute('data-action', action); li.textContent = t.text;
                    const searchLi2 = cmdkList.querySelector('li[data-action="search"]');
                    if (searchLi2) cmdkList.insertBefore(li, searchLi2); else cmdkList.appendChild(li);
                  }
                }
              }
            } catch {}

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
      // Defensive fallback: if reveal never ran, force content visible
      try {
        setTimeout(() => {
          const nodes = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-stagger');
          // If first content area still fully transparent, reveal all
          const needsReveal = Array.from(nodes).slice(0, 3).some(n => getComputedStyle(n).opacity === '0');
          if (needsReveal) nodes.forEach(n => { n.classList.add('is-visible'); n.style.opacity = '1'; n.style.transform = 'none'; });
        }, 350);
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

      // Mobile menu functionality - delayed to ensure navigation is built first
    try {
      setTimeout(() => {
        console.log('Initializing mobile menu...');
        // Create mobile menu toggle button
        const headerInner = document.querySelector('.header-inner');
        console.log('Header inner found:', !!headerInner);
        if (headerInner && !document.getElementById('mobile-menu-toggle')) {
          const toggleBtn = document.createElement('button');
          toggleBtn.id = 'mobile-menu-toggle';
          toggleBtn.className = 'mobile-menu-toggle';
          toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          `;
          headerInner.appendChild(toggleBtn);
          console.log('Mobile menu toggle button created');

          // Create mobile menu overlay
          if (!document.getElementById('mobile-menu-overlay')) {
            console.log('Creating mobile menu overlay...');
            const overlay = document.createElement('div');
            overlay.id = 'mobile-menu-overlay';
            overlay.className = 'mobile-menu-overlay';
            overlay.setAttribute('aria-hidden', 'true');

            const overlayContent = document.createElement('div');
            overlayContent.className = 'mobile-menu-content';

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.className = 'mobile-menu-close';
            closeButton.setAttribute('aria-label', 'Close navigation menu');
            closeButton.innerHTML = '×';
            overlayContent.appendChild(closeButton);

            // Create mobile navigation container (will be populated by nav rebuild)
            const mobileNav = document.createElement('nav');
            mobileNav.className = 'mobile-nav';
            overlayContent.appendChild(mobileNav);

            overlay.appendChild(overlayContent);
            document.body.appendChild(overlay);
            console.log('Mobile menu overlay created successfully');

            // Immediately populate mobile nav with current navigation items
            const currentNav = document.querySelector('header .nav');
            if (currentNav) {
              const navItems = currentNav.querySelectorAll('.nav-link');
              if (navItems.length > 0) {
                mobileNav.innerHTML = '';
                navItems.forEach(item => {
                  const clone = item.cloneNode(true);
                  mobileNav.appendChild(clone);
                });
                console.log('Mobile nav populated immediately with', navItems.length, 'items');
              } else {
                // Fallback: Create default navigation items
                console.log('No existing nav items found, creating default items');
                const base = (window.location.pathname === '/' || window.location.pathname === '/index.html') ? '' : '../';
                const defaultItems = [
                  { href: base + 'services/', text: 'Services', section: 'services' },
                  ...(window.FEATURE_BUSINESS ? [{ href: base + 'business/', text: 'For Business', section: 'business' }] : []),
                  { href: base + 'projects/', text: 'Projects', section: 'projects' },
                  { href: base + 'books/', text: 'Books', section: 'books' },
                  { href: base + 'links/', text: 'Links', section: 'links' },
                  { href: base + 'cv/', text: 'CV / About', section: 'cv' },
                  { href: base + 'contact/', text: 'Contact', section: 'contact' }
                ];

                mobileNav.innerHTML = '';
                defaultItems.forEach(item => {
                  const link = document.createElement('a');
                  link.className = 'nav-link';
                  link.href = item.href;
                  link.textContent = item.text;
                  mobileNav.appendChild(link);
                });
                console.log('Mobile nav populated with fallback items');
              }
            }

            // Mobile menu toggle functionality
            function toggleMobileMenu() {
              const isOpen = overlay.getAttribute('aria-hidden') === 'false';
              console.log('Toggle mobile menu - Current state:', isOpen ? 'open' : 'closed');

              toggleBtn.setAttribute('aria-expanded', !isOpen);
              overlay.setAttribute('aria-hidden', isOpen);

              if (!isOpen) {
                // Opening menu
                console.log('Opening mobile menu');
                document.body.style.overflow = 'hidden';
                overlay.style.display = 'block';
                // Force reflow
                overlay.offsetHeight;
                overlay.classList.add('open');

                // Debug: Check if mobile nav has content
                const mobileNav = overlay.querySelector('.mobile-nav');
                if (mobileNav) {
                  console.log('Mobile nav found with', mobileNav.children.length, 'children');
                  console.log('Mobile nav content:', mobileNav.innerHTML);
                } else {
                  console.warn('Mobile nav not found in overlay');
                }
              } else {
                // Closing menu
                console.log('Closing mobile menu');
                document.body.style.overflow = '';
                overlay.classList.remove('open');
                setTimeout(() => {
                  overlay.style.display = 'none';
                }, 300); // Match CSS transition duration
              }
            }

            // Event listeners
            toggleBtn.addEventListener('click', toggleMobileMenu);

            // Close menu when clicking close button
            closeButton.addEventListener('click', toggleMobileMenu);

            // Close menu when clicking overlay background
            overlay.addEventListener('click', (e) => {
              if (e.target === overlay) {
                toggleMobileMenu();
              }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
                toggleMobileMenu();
              }
            });

            // Close menu when clicking mobile nav links
            overlay.addEventListener('click', (e) => {
              if (e.target.classList.contains('nav-link')) {
                toggleMobileMenu();
              }
            });
          }
        }
      }, 100); // Delay to ensure navigation rebuild is complete
    } catch (err) {
      console.warn('Failed to initialize mobile menu:', err);
    }

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
          a.href = bookUrl; a.textContent = 'Book your AI strategy call';
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
    // Hello bar for capacity on business pages (non-hover, no tooltip)
    try {
      if (window.FEATURE_HELLOBAR && (location.pathname||'').includes('/business')){
        if (!document.getElementById('hello-bar')){
          const bar = document.createElement('div');
          bar.id = 'hello-bar';
          bar.style.position = 'sticky'; bar.style.top = '64px'; bar.style.zIndex = '40';
          bar.style.padding = '8px 12px'; bar.style.textAlign = 'center';
          bar.style.background = 'color-mix(in oklab, var(--bg) 92%, transparent)';
          bar.style.borderBottom = '1px solid color-mix(in oklab, var(--fg) 10%, transparent)';
          const span = document.createElement('span');
          span.className = 'small-label';
          span.textContent = 'Capacity: 1–2 pilots at a time. Next start: within 2 weeks.';
          // Ensure no title/tooltip is set to avoid hover glitch
          span.removeAttribute('title');
          bar.appendChild(span);
          const container = document.querySelector('main');
          container?.prepend(bar);
        }
      }
    } catch {}
    // Exit intent lead magnet (simple)
    try {
      if (window.FEATURE_EXIT_INTENT && !sessionStorage.getItem('leadmag-shown')){
        const showLeadmag = () => {
          sessionStorage.setItem('leadmag-shown','1');
          const ov = document.createElement('div'); ov.id='leadmag'; ov.style.position='fixed'; ov.style.inset='0'; ov.style.background='rgba(0,0,0,.6)'; ov.style.zIndex='80';
          const panel = document.createElement('div'); panel.className='card'; panel.style.position='absolute'; panel.style.left='50%'; panel.style.top='10%'; panel.style.transform='translateX(-50%)'; panel.style.width='min(680px, 94vw)'; panel.style.padding='16px';
          panel.innerHTML = '<h2>Free: 4‑Week AI Pilot Checklist</h2><p class="muted">Get the steps, roles, and risks to ship an AI pilot that moves a KPI.</p>';
          const form = document.createElement('form'); form.style.display='grid'; form.style.gap='8px'; form.innerHTML = '<input type="email" placeholder="you@example.com" required><button class="btn" type="submit">Send it</button><span class="muted" id="lm-status"></span>';
          const close = document.createElement('button'); close.className='btn btn-ghost small'; close.textContent='Close'; close.style.float='right'; close.onclick = ()=>document.body.removeChild(ov);
          panel.prepend(close); panel.appendChild(form); ov.appendChild(panel); ov.addEventListener('click', (e)=>{ if(e.target===ov) close.click(); }); document.body.appendChild(ov);
          form.addEventListener('submit', (e)=>{ e.preventDefault(); document.getElementById('lm-status').textContent='Thanks — check your inbox.'; try{ window.umami?.track?.('leadmag_submit'); }catch{} });
        };
        document.addEventListener('mouseleave', (e)=>{ if (e.clientY<=0) showLeadmag(); }, { once:true });
      }
    } catch {}
  // URL normalization: strip UTMs and enforce trailing slash on top-level sections
  try {
    const url = new URL(location.href);
    const params = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];
    let touched = false;
    params.forEach(p => { if (url.searchParams.has(p)) { url.searchParams.delete(p); touched = true; } });
    // Fix accidental double path like /business/business/
    if (url.pathname === '/business/business/') { url.pathname = '/business/'; touched = true; }
    // Enforce trailing slash for section indexes (e.g., /books)
    if (/^\/(books|services|business|case-studies|faq|projects|links|cv|contact)\/?$/.test(url.pathname)) {
      if (!url.pathname.endsWith('/')) { url.pathname += '/'; touched = true; }
    }
    if (touched) {
      const canonical = url.pathname + (url.search || '') + (url.hash || '');
      const link = document.createElement('link'); link.rel='canonical'; link.href=canonical; document.head.appendChild(link);
      history.replaceState({}, '', canonical);
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
    // Additional CRO instrumentation
    try {
      const hero = document.getElementById('book-hero');
      hero?.addEventListener('click', () => { try { window.umami?.track?.('hero_cta_click'); } catch {} });
    } catch {}
    document.querySelectorAll('[data-expand]')?.forEach(a => {
      a.addEventListener('click', () => {
        const id = a.getAttribute('data-expand');
        const panel = document.getElementById('exp-' + id);
        if (!panel) return;
        const isHidden = panel.hasAttribute('hidden');
        if (isHidden) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
        try { window.umami?.track?.('service_card_open', { id }); } catch {}
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
    // On Business pages, show an embedded scheduler overlay with 3 qualifying questions
    try {
      if ((location.pathname || '').toLowerCase().includes('/business')) {
        const ensureCalScript = () => new Promise((resolve) => {
          if (window.Cal) return resolve();
          // Official Cal.com embed loader (defines window.Cal, loads embed.js async)
          (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal, ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var ns = ar[1]; api.q = api.q || []; if (typeof ns === 'string') { cal.ns[ns] = cal.ns[ns] || api; p(cal.ns[ns], ar); p(cal, ['initNamespace', ns]); } else { p(cal, ar); } return; } p(cal, ar); }; })(window, (window.CAL_ORIGIN || 'https://app.cal.com') + '/embed/embed.js', 'init');
          try { window.Cal('init', { origin: window.CAL_ORIGIN || 'https://app.cal.com' }); } catch {}
          resolve();
        });

        const createOverlay = () => {
          if (document.getElementById('scheduler-overlay')) return document.getElementById('scheduler-overlay');
          const overlay = document.createElement('div');
          overlay.id = 'scheduler-overlay';
          overlay.setAttribute('aria-hidden', 'true');
          overlay.style.position = 'fixed'; overlay.style.inset = '0'; overlay.style.background = 'rgba(0,0,0,.5)';
          overlay.style.display = 'none'; overlay.style.zIndex = '70';

          const panel = document.createElement('div');
          panel.className = 'card';
          panel.style.position = 'absolute'; panel.style.left = '50%'; panel.style.top = '6%';
          panel.style.transform = 'translateX(-50%)'; panel.style.width = 'min(860px, 96vw)'; panel.style.maxHeight = '88vh'; panel.style.overflow = 'auto'; panel.style.padding = '16px';

          const close = document.createElement('button');
          close.className = 'btn btn-ghost small'; close.textContent = 'Close';
          close.style.float = 'right'; close.addEventListener('click', () => { overlay.style.display = 'none'; overlay.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; });
          panel.appendChild(close);

          const h2 = document.createElement('h2'); h2.textContent = 'Book a 30‑min AI roadmap call'; panel.appendChild(h2);
          const p = document.createElement('p'); p.className = 'muted'; p.textContent = 'Takes ~45 seconds. These questions focus our time on your business outcomes.'; panel.appendChild(p);

          const progress = document.createElement('div');
          progress.id = 'sched-progress';
          progress.className = 'small-label';
          progress.textContent = 'Step 1 of 2';
          progress.style.margin = '6px 0 8px';
          panel.appendChild(progress);

          const form = document.createElement('form'); form.id = 'scheduler-form'; form.style.display = 'grid'; form.style.gap = '10px';
          form.innerHTML = `
            <label class="small-label">What outcome are you aiming for?</label>
            <select name="outcome" required>
              <option value="">Select…</option>
              <option>More qualified pipeline</option>
              <option>Reduce support tickets</option>
              <option>Automate internal busywork</option>
              <option>Other</option>
            </select>
            <span class="muted" style="font-size:12px;">Why this matters: it helps us target the highest‑impact opportunity first.</span>

            <label class="small-label">Biggest constraint right now?</label>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:8px;">
              <label class="tag"><input type="checkbox" name="constraints" value="Limited team time" style="margin-right:6px;"> Limited team time</label>
              <label class="tag"><input type="checkbox" name="constraints" value="Data scattered" style="margin-right:6px;"> Data scattered</label>
              <label class="tag"><input type="checkbox" name="constraints" value="Tool limitations" style="margin-right:6px;"> Tool limitations</label>
              <label class="tag"><input type="checkbox" name="constraints" value="Budget guardrails" style="margin-right:6px;"> Budget guardrails</label>
              <label class="tag"><input type="checkbox" name="constraints" value="Not sure yet" style="margin-right:6px;"> Not sure yet</label>
            </div>
            <span class="muted" style="font-size:12px;">This shows where to design around risks.</span>

            <label class="small-label">Team size</label>
            <select name="team_size" required>
              <option value="">Select…</option>
              <option>1–10</option>
              <option>11–50</option>
              <option>51–200</option>
              <option>200+</option>
            </select>

            <label class="small-label">Desired timeframe</label>
            <select name="timeframe" required>
              <option value="">Select…</option>
              <option>ASAP (this month)</option>
              <option>1–2 months</option>
              <option>This quarter</option>
              <option>Exploring options</option>
            </select>

            <label class="small-label">How will we measure success?</label>
            <select name="success" required>
              <option value="">Select…</option>
              <option>SQLs per SDR</option>
              <option>CSAT / ticket deflection</option>
              <option>Cycle time reduction</option>
              <option>Cost saved / hours saved</option>
              <option>Other</option>
            </select>
            <input type="text" name="notes" placeholder="Optional: any context (e.g., ‘HubSpot + Zendesk; EU market; 2 SDRs’)" />
            <button class="btn" type="submit">Continue → Schedule</button>
            <span id="sched-status" class="muted" aria-live="polite"></span>
          `;
          panel.appendChild(form);

          const calendlyWrap = document.createElement('div'); calendlyWrap.id = 'calendly-inline'; calendlyWrap.style.marginTop = '12px'; panel.appendChild(calendlyWrap);

          overlay.appendChild(panel);
          overlay.addEventListener('click', (e) => { if (e.target === overlay) close.click(); });
          // Close on Escape
          overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') close.click(); });
          document.body.appendChild(overlay);

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try { window.umami?.track?.('scheduler_submit'); } catch {}
            const calLink = window.CAL_LINK || '';
            if (!calLink) { document.getElementById('sched-status').textContent = 'Scheduler unavailable. Please use Contact.'; return; }
            await ensureCalScript();
            // Move to step 2
            progress.textContent = 'Step 2 of 2';
            const existing = document.getElementById('sched-next'); if (existing) existing.remove();
            const next = document.createElement('div');
            next.id = 'sched-next';
            next.innerHTML = '<div class="callout console"><div class="title">What to expect</div><ul class="muted"><li>We\'ll clarify your goal and constraints</li><li>We\'ll map a 4‑week pilot with a clear KPI</li><li>If it\'s a fit, we\'ll agree on next steps. Otherwise, I\'ll send a brief summary you can use internally.</li></ul></div>';
            panel.insertBefore(next, calendlyWrap);
            // Show inline scheduler (Cal.com)
            calendlyWrap.innerHTML = '';
            calendlyWrap.style.minHeight = '620px';
            try { panel.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
            // Initialize inline Cal.com widget
            try { window.Cal && window.Cal('inline', { elementOrSelector: '#calendly-inline', calLink: calLink, layout: 'month_view' }); window.Cal && window.Cal('ui', { theme: window.CAL_THEME || 'dark', layout: 'month_view' }); } catch {}
          });

          // Reset function so every open starts fresh
          overlay.resetWizard = () => {
            try {
              const prog = document.getElementById('sched-progress'); if (prog) prog.textContent = 'Step 1 of 2';
              const next = document.getElementById('sched-next'); if (next) next.remove();
              const cal = document.getElementById('calendly-inline'); if (cal) cal.innerHTML = '';
              document.getElementById('sched-status')?.textContent = '';
              document.getElementById('scheduler-form')?.reset();
              panel.scrollTop = 0;
            } catch {}
          };

          return overlay;
        };

        const openOverlay = (e) => { e.preventDefault(); const ov = createOverlay(); ov.resetWizard?.(); ov.style.display = 'block'; ov.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; };
        document.querySelectorAll('#book-hero, .book-svc').forEach(el => { el.addEventListener('click', openOverlay); });
      }
    } catch {}
  } catch {}
});