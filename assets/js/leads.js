/* Lead capture — never claims success it did not achieve.
 *
 * Delivery order:
 *   1. POST to window.LEADS_ENDPOINT (set it in config.js or via the Cloudflare
 *      Pages Function at /api/lead). Success is shown ONLY on a 2xx response.
 *   2. If that is unavailable or fails, fall back to a pre-filled mailto: so the
 *      lead still reaches Vincent's inbox.
 * There is deliberately no third path where the visitor is told "got it" and the
 * message goes nowhere. That bug cost every form fill this site ever received.
 */
(function () {
  'use strict';

  var EMAIL = (window.CONTACT_EMAIL || 'vincent@wannado.fi');

  var T = {
    en: {
      sending:  'Sending…',
      ok:       "Got it — I'll reply within 24 hours, usually much sooner.",
      mailto:   'Opening your email app — press send and it reaches me. Not working? Write to ' + EMAIL,
      fail:     'That did not send. Please email me directly at ' + EMAIL + ' — I read every one.',
      subject:  'Strategy call request'
    },
    fi: {
      sending:  'Lähetetään…',
      ok:       'Kiitos — vastaan vuorokauden sisällä, yleensä paljon nopeammin.',
      mailto:   'Avaan sähköpostiohjelmasi — paina lähetä, niin viesti tulee minulle. Jos se ei aukea, kirjoita osoitteeseen ' + EMAIL,
      fail:     'Lähetys ei onnistunut. Laita sähköpostia suoraan: ' + EMAIL + ' — luen jokaisen viestin.',
      subject:  'Yhteydenotto — strategiapuhelu'
    },
    es: {
      sending:  'Enviando…',
      ok:       'Recibido — te respondo en menos de 24 horas, normalmente mucho antes.',
      mailto:   'Abriendo tu correo — pulsa enviar y me llega. ¿No se abre? Escríbeme a ' + EMAIL,
      fail:     'No se pudo enviar. Escríbeme directamente a ' + EMAIL + ' — leo todos los mensajes.',
      subject:  'Solicitud de llamada estratégica'
    }
  };

  function track(name, data) {
    try { if (window.umami && window.umami.track) window.umami.track(name, data || {}); } catch (e) {}
  }

  function mailtoFor(data, t) {
    var body = Object.keys(data)
      .filter(function (k) { return k.charAt(0) !== '_' && String(data[k]).trim() !== ''; })
      .map(function (k) { return k + ': ' + data[k]; })
      .join('\n');
    return 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(t.subject + ' — ' + (data.company || data.name || '')) +
      '&body=' + encodeURIComponent(body);
  }

  function wire(form) {
    var lang = form.getAttribute('data-lang') || document.documentElement.lang || 'en';
    var t = T[lang] || T.en;
    var msg = form.querySelector('.form-msg');
    var btn = form.querySelector('button[type=submit]');
    var btnText = btn ? btn.textContent : '';
    var started = false;

    // Fire once, when the visitor actually starts filling the form. This is the
    // number that tells you whether the form or the traffic is the problem.
    form.addEventListener('input', function () {
      if (started) return;
      started = true;
      track('lead-form-start', { lang: lang });
    }, true);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      data.lang = lang;
      data.path = location.pathname;
      data.ref = document.referrer || '';
      data.ts = new Date().toISOString();

      if (msg) { msg.textContent = t.sending; msg.className = 'muted form-msg'; }
      if (btn) { btn.disabled = true; }

      function release() { if (btn) { btn.disabled = false; btn.textContent = btnText; } }

      function fallbackToMail(reason) {
        track('lead-form-mailto', { lang: lang, reason: reason });
        if (msg) { msg.textContent = t.mailto; msg.className = 'muted form-msg'; }
        release();
        try { window.location.href = mailtoFor(data, t); }
        catch (err) { if (msg) msg.textContent = t.fail; }
      }

      var endpoint = window.LEADS_ENDPOINT;
      if (!endpoint) { fallbackToMail('no-endpoint'); return; }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        // Only here — after a real 2xx — do we tell the visitor it arrived.
        track('lead-form-submit', { lang: lang, service: data.service || '' });
        if (msg) { msg.textContent = t.ok; msg.className = 'form-msg form-msg-ok'; }
        form.reset();
        release();
      }).catch(function (err) {
        fallbackToMail(String(err && err.message || err));
      });
    });
  }

  function init() {
    var forms = document.querySelectorAll('form.lead-form');
    for (var i = 0; i < forms.length; i++) wire(forms[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
