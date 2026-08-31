/* Agent ROI calculator.
 *
 * Deliberately conservative. It is a qualification tool first and a sales tool
 * second: when the numbers do not justify a build, it says so plainly and tells
 * the visitor not to buy. That costs a few unqualified calls and buys the
 * credibility that a seller with no case studies cannot otherwise get.
 *
 * Every assumption is shown on the page. No hidden multipliers.
 */
(function () {
  'use strict';

  // Share of a workflow's manual hours an agent realistically absorbs, by type.
  // Ranges, not point estimates — the low end is what to plan against.
  var COVERAGE = {
    document:  { lo: 0.55, hi: 0.80, label: { en: 'Document / invoice / form processing', fi: 'Dokumenttien, laskujen ja lomakkeiden käsittely' } },
    inbox:     { lo: 0.40, hi: 0.65, label: { en: 'Email triage, quoting and order intake', fi: 'Sähköpostin käsittely, tarjoukset ja tilaukset' } },
    support:   { lo: 0.35, hi: 0.60, label: { en: 'Customer support and ticket handling', fi: 'Asiakaspalvelu ja tikettien käsittely' } },
    dataentry: { lo: 0.60, hi: 0.85, label: { en: 'Data entry and system-to-system copying', fi: 'Tiedon syöttö ja siirto järjestelmien välillä' } },
    research:  { lo: 0.30, hi: 0.55, label: { en: 'Research, screening and summarising', fi: 'Selvitystyö, seulonta ja tiivistäminen' } },
    scheduling:{ lo: 0.40, hi: 0.65, label: { en: 'Scheduling, dispatch and coordination', fi: 'Aikataulutus, ohjaus ja koordinointi' } }
  };

  var T = {
    en: {
      cur: '€', yr: '/year', mo: 'months',
      manualCost: 'What this workflow costs you now',
      saved: 'Realistic annual saving once agents run it',
      payback: 'Payback on a build at this size',
      verdictStrong: 'Worth building. The build pays for itself inside a year, on top of the retainer.',
      verdictOk: 'Worth building, but it is a two-year decision, not a one-year one.',
      verdictSlow: 'Marginal. It works eventually, but a smaller build or a lower retainer would make this a much better deal for you — ask me to price it that way.',
      verdictWeak: 'Not at this size. A build this large would not pay for itself here, and I would tell you that on the call rather than sell you one.',
      verdictEaten: 'The retainer would eat the entire saving. At this workflow size you should not be paying a monthly retainer at all — ask me for a build-only engagement, or a smaller one.',
      verdictTiny: 'Too small to justify a build. Buy an off-the-shelf tool instead — you do not need me.',
      surplusLabel: 'Left over each month after the retainer',
      recommend: 'Suggested engagement',
      notWorth: 'What I would say instead',
      assumptions: 'Assumptions used'
    },
    fi: {
      cur: '€', yr: '/vuosi', mo: 'kk',
      manualCost: 'Mitä tämä työnkulku maksaa nyt',
      saved: 'Realistinen vuosisäästö agenttien hoitaessa sen',
      payback: 'Takaisinmaksuaika tämän kokoiselle rakennukselle',
      verdictStrong: 'Kannattaa rakentaa. Rakennus maksaa itsensä takaisin alle vuodessa, jatkosopimuksen päälle.',
      verdictOk: 'Kannattaa rakentaa, mutta tämä on kahden vuoden päätös, ei yhden.',
      verdictSlow: 'Rajatapaus. Toimii lopulta, mutta pienempi rakennus tai matalampi jatkosopimus tekisi tästä sinulle selvästi paremman diilin — pyydä minua hinnoittelemaan se niin.',
      verdictWeak: 'Ei tämän kokoisena. Näin iso rakennus ei maksaisi itseään takaisin täällä, ja sanoisin sen puhelussa sen sijaan että myisin sellaisen.',
      verdictEaten: 'Jatkosopimus söisi koko säästön. Tämän kokoisessa työnkulussa sinun ei pitäisi maksaa kuukausimaksua lainkaan — pyydä pelkkää rakennusta tai pienempää kokonaisuutta.',
      verdictTiny: 'Liian pieni perustellakseen rakennuksen. Osta valmis työkalu — et tarvitse minua.',
      surplusLabel: 'Jää käteen kuukaudessa jatkosopimuksen jälkeen',
      recommend: 'Ehdotettu toimeksianto',
      notWorth: 'Mitä sanoisin sen sijaan',
      assumptions: 'Käytetyt oletukset'
    }
  };

  function money(n, cur) {
    return cur + Math.round(n).toLocaleString('fi-FI').replace(/ /g, ' ');
  }

  function calc(v) {
    // Fully-loaded cost, not salary: employer contributions, tooling, management,
    // desk. 1.4x is the conservative Finnish figure; salary alone flatters the case.
    var loaded = v.hourly * 1.4;
    var annualHours = v.people * v.hours * 45;          // 45 working weeks, not 52
    var manual = annualHours * loaded;

    var cov = COVERAGE[v.type] || COVERAGE.document;
    // Plan against the low end. The high end is shown only as the upper bound.
    var savedLo = manual * cov.lo;
    var savedHi = manual * cov.hi;

    // Running cost of the agents themselves: inference, hosting, and the human
    // review time that any honest deployment still needs.
    var runCost = savedLo * 0.18;
    var netLo = savedLo - runCost;
    var netHi = savedHi - (savedHi * 0.18);

    // Payback, done properly. The retainer is not a one-off — it recurs for as
    // long as the agents run, so it must be netted off the monthly saving BEFORE
    // the build fee is paid back. Dividing first-year cost by monthly saving
    // (the obvious formula) understates payback badly and can hide the case
    // where the retainer swallows the entire saving and payback never arrives.
    var build = v.build;
    var monthlySaving = netLo / 12;
    var surplus = monthlySaving - v.retainer;
    var payback = surplus > 0 ? build / surplus : Infinity;

    return { manual: manual, savedLo: netLo, savedHi: netHi, payback: payback,
             annualHours: annualHours, loaded: loaded, cov: cov,
             monthlySaving: monthlySaving, surplus: surplus, runCost: runCost,
             firstYearCost: build + v.retainer * 12 };
  }

  function verdict(r, t) {
    if (r.manual < 60000)  return { key: 'tiny',     text: t.verdictTiny,     cls: 'roi-verdict-bad' };
    if (r.surplus <= 0)    return { key: 'eaten',    text: t.verdictEaten,    cls: 'roi-verdict-bad' };
    if (r.payback <= 12)   return { key: 'strong',   text: t.verdictStrong,   cls: 'roi-verdict-good' };
    if (r.payback <= 24)   return { key: 'ok',       text: t.verdictOk,       cls: 'roi-verdict-ok' };
    if (r.payback <= 36)   return { key: 'slow',     text: t.verdictSlow,     cls: 'roi-verdict-ok' };
    return { key: 'weak', text: t.verdictWeak, cls: 'roi-verdict-bad' };
  }

  function init() {
    var form = document.getElementById('roi-form');
    if (!form) return;
    var lang = document.documentElement.lang === 'fi' ? 'fi' : 'en';
    var t = T[lang];
    var out = document.getElementById('roi-out');
    var fired = false;

    function read() {
      var g = function (n) { var el = form.elements[n]; return el ? el.value : ''; };
      return {
        people:   Math.max(0, parseFloat(g('people'))   || 0),
        hours:    Math.max(0, parseFloat(g('hours'))    || 0),
        hourly:   Math.max(0, parseFloat(g('hourly'))   || 0),
        type:     g('type') || 'document',
        build:    parseFloat(g('build'))    || 35000,
        retainer: parseFloat(g('retainer')) || 3000
      };
    }

    function render() {
      var v = read();
      if (!v.people || !v.hours || !v.hourly) { out.innerHTML = ''; return; }
      var r = calc(v);
      var vd = verdict(r, t);

      // Report the calculation honestly, including the running cost that most
      // vendors leave out of their ROI pages.
      out.innerHTML =
        '<div class="roi-result ' + vd.cls + '">' +
          '<p class="roi-verdict">' + vd.text + '</p>' +
          '<div class="roi-figures">' +
            '<div class="roi-fig"><span class="roi-fig-label">' + t.manualCost + '</span>' +
              '<span class="roi-fig-value">' + money(r.manual, t.cur) + ' ' + t.yr + '</span></div>' +
            '<div class="roi-fig"><span class="roi-fig-label">' + t.saved + '</span>' +
              '<span class="roi-fig-value">' + money(r.savedLo, t.cur) + ' – ' + money(r.savedHi, t.cur) + ' ' + t.yr + '</span></div>' +
            (vd.key !== 'tiny'
              ? '<div class="roi-fig"><span class="roi-fig-label">' + t.surplusLabel + '</span>' +
                '<span class="roi-fig-value">' + money(r.surplus, t.cur) + '</span></div>'
              : '') +
            (isFinite(r.payback) && vd.key !== 'tiny'
              ? '<div class="roi-fig"><span class="roi-fig-label">' + t.payback + '</span>' +
                '<span class="roi-fig-value">' + Math.round(r.payback) + ' ' + t.mo + '</span></div>'
              : '') +
          '</div>' +
          '<details class="roi-assumptions"><summary>' + t.assumptions + '</summary><ul>' +
            '<li>' + Math.round(r.annualHours).toLocaleString('fi-FI') + ' h/' + (lang === 'fi' ? 'vuosi' : 'year') +
              ' (' + v.people + ' × ' + v.hours + ' h/' + (lang === 'fi' ? 'vko' : 'wk') + ' × 45 ' +
              (lang === 'fi' ? 'työviikkoa' : 'working weeks') + ')</li>' +
            '<li>' + (lang === 'fi' ? 'Kokonaiskustannus' : 'Fully-loaded cost') + ' ' + money(r.loaded, t.cur) +
              '/h (' + (lang === 'fi' ? 'palkka' : 'wage') + ' ' + money(v.hourly, t.cur) + ' × 1,4)</li>' +
            '<li>' + (lang === 'fi' ? 'Agenttien kattavuus' : 'Agent coverage') + ' ' +
              Math.round(r.cov.lo * 100) + '–' + Math.round(r.cov.hi * 100) + '%</li>' +
            '<li>' + (lang === 'fi' ? 'Agenttien ajokustannus ja ihmisen tarkistusaika' : 'Agent running cost and human review time') +
              ' 18% (' + money(r.runCost, t.cur) + t.yr + ') ' +
              (lang === 'fi' ? 'vähennetty säästöstä' : 'deducted from the saving') + '</li>' +
            '<li>' + (lang === 'fi' ? 'Ensimmäisen vuoden kokonaishinta' : 'First-year total cost') + ' ' +
              money(r.firstYearCost, t.cur) + '</li>' +
            '<li>' + (lang === 'fi'
              ? 'Takaisinmaksu = rakennus ÷ (kuukausisäästö − jatkosopimus). Jatkosopimus on jatkuva kulu, joten se vähennetään ENNEN kuin rakennus alkaa maksaa itseään takaisin.'
              : 'Payback = build ÷ (monthly saving − retainer). The retainer recurs for as long as the agents run, so it is netted off BEFORE the build starts paying itself back.') + '</li>' +
          '</ul></details>' +
        '</div>';

      // Carry the visitor's own numbers into the booking, so the call starts
      // from their figures instead of a blank page.
      var cta = document.getElementById('roi-cta');
      if (cta) {
        cta.hidden = (vd.key === 'tiny');
        var link = cta.querySelector('a[data-roi-book]');
        if (link) {
          var note = (lang === 'fi'
            ? 'Laskurin luvut: ' + v.people + ' hlö × ' + v.hours + ' h/vko, ' + COVERAGE[v.type].label.fi +
              '. Nykykustannus ' + money(r.manual, t.cur) + '/v.'
            : 'From the calculator: ' + v.people + ' people × ' + v.hours + ' h/wk on ' + COVERAGE[v.type].label.en +
              '. Current cost ' + money(r.manual, t.cur) + '/yr.');
          link.href = (window.BOOK_URL || 'https://cal.com/vincent-viitala-xkqj0c/30min') +
                      '?notes=' + encodeURIComponent(note);
        }
      }

      if (!fired) {
        fired = true;
        if (window.trackEvent) window.trackEvent('roi-calculated', { lang: lang });
      }
      if (window.trackEvent) {
        window.trackEvent('roi-verdict', { verdict: vd.key, lang: lang });
      }
    }

    form.addEventListener('input', render);
    form.addEventListener('change', render);
    form.addEventListener('submit', function (e) { e.preventDefault(); render(); });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
