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

// --- Contact + lead delivery ---
// CONTACT_EMAIL is shown on the contact pages and is the mailto: fallback target,
// so a lead is never lost even when no endpoint is configured.
window.CONTACT_EMAIL  = window.CONTACT_EMAIL  || 'vincent@wannado.fi';

// Server-side delivery. /api/lead is a Cloudflare Pages Function (see functions/api/lead.js).
// It forwards to whatever you set as the LEADS_WEBHOOK (or RESEND_API_KEY) environment
// variable in the Cloudflare dashboard. Until you set one it returns 501 and the form
// falls back to mailto: — it never pretends a lead was delivered.
window.LEADS_ENDPOINT = window.LEADS_ENDPOINT || '/api/lead';

// --- Conversion tracking ---
// One helper so every CTA reports through the same path. Elements carrying
// data-umami-event are tracked automatically by Umami; this is for JS-driven events.
window.trackEvent = function (name, data) {
  try { if (window.umami && window.umami.track) window.umami.track(name, data || {}); }
  catch (e) { /* analytics must never break the page */ }
};

// Booking clicks are the money event: fire one wherever a Cal.com link is clicked,
// no matter which page or which button.
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('a[href*="cal.com"]');
  if (a) window.trackEvent('booking-click', { path: location.pathname, label: (a.textContent || '').trim().slice(0, 40) });
}, true);

// Scroll depth on the long sales pages tells you where readers fall off.
(function () {
  var hits = {}, marks = [25, 50, 75, 90];
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = (window.scrollY / h) * 100;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (pct >= m && !hits[m]) { hits[m] = 1; window.trackEvent('scroll-depth', { depth: m, path: location.pathname }); }
    }
  }, { passive: true });
})();
