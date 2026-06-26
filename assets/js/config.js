// Minimal config for High-Ticket B2B AI Consulting Site
// Only essential integrations: Analytics + Booking (Cal.com)

window.UMAMI_WEBSITE_ID = window.UMAMI_WEBSITE_ID || '7085dcec-ca13-4cab-9cdf-4edf79ca1e05';
window.UMAMI_HOST = window.UMAMI_HOST || 'https://cloud.umami.is';

// --- Booking (Cal.com) ---
// Single source of truth: change the event in ONE place and every embed +
// button across the site follows. `CAL_LINK` is the path after cal.com/.
window.CAL_LINK   = window.CAL_LINK   || 'vincent-viitala-xkqj0c/30min';
window.CAL_ORIGIN = window.CAL_ORIGIN || 'https://app.cal.com';
window.CAL_THEME  = window.CAL_THEME  || 'dark'; // site uses a dark design system
window.BOOK_URL   = window.BOOK_URL   || ('https://cal.com/' + window.CAL_LINK);
window.CALENDLY_URL = window.BOOK_URL; // back-compat alias for legacy button code

// Boot the inline scheduler on any page that has a #cal-inline container.
// config.js is loaded with `defer`, so the DOM is parsed by the time this runs.
(function bootCalInline() {
  if (!document.getElementById('cal-inline')) return; // page has no scheduler
  // Official Cal.com embed loader (defines window.Cal and loads embed.js async)
  (function (C, A, L) {
    var p = function (a, ar) { a.q.push(ar); };
    var d = C.document;
    C.Cal = C.Cal || function () {
      var cal = C.Cal, ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
      if (ar[0] === L) {
        var api = function () { p(api, arguments); };
        var namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
        else { p(cal, ar); }
        return;
      }
      p(cal, ar);
    };
  })(window, window.CAL_ORIGIN + '/embed/embed.js', 'init');

  window.Cal('init', { origin: window.CAL_ORIGIN });
  window.Cal('inline', { elementOrSelector: '#cal-inline', calLink: window.CAL_LINK, layout: 'month_view' });
  window.Cal('ui', { hideEventTypeDetails: false, layout: 'month_view', theme: window.CAL_THEME });
})();
