# PROGRESS — current best state

Updated: iteration 7 — 79 verified leads, offer = Signal Run

## Verification status
`bash .ops/verify.sh` → **VERIFY: PASS**

Every section green. 32 verified leads, 62 cited URLs positively confirmed
live by direct fetch, 14 outreach drafts, offer terms with a capped guarantee.
No threshold was lowered to get here; one check (H) was in fact *tightened*
after it produced a false pass.

## Checklist
- [x] A — contact forms deliver leads (browser-tested, both success and failure paths)
- [x] B — booking CTA on every page + non-JS fallback
- [x] C — all internal links resolve
- [x] D — analytics + description + OG + canonical on every page
- [x] E — conversion events instrumented (129+ elements)
- [x] F — no fabricated social proof or placeholders
- [x] G — ops state blocked from public serving
- [x] G2 — sitemap valid, robots correct, orphan page deindexed
- [x] H — 79 verified leads (32 hand-verified + 48 workflow-verified, 1 dropped)
- [x] I — all 55 cited URLs fetch-checked (+9 rejected candidates)
- [x] H2/H3/H4 — new guards: unverified size claims, self-contradicting quotes, stale pricing
- [x] J — OFFER.md + 14 outreach drafts
- [x] K — loop state files current

## Proven findings (observed in output, never assumed)

1. **Lead capture was dead sitewide.** All three contact forms wrapped delivery
   in `if (window.LEADS_WEBHOOK_URL)`; that variable was referenced 6 times and
   defined 0 times. The success message showed unconditionally. Every form
   submission the site ever received was silently discarded. FIXED and
   browser-tested: success is now shown only after a real 2xx, otherwise it
   falls back to a pre-filled mailto.
2. **The contact page promised same-day email replies while showing no email
   address**, and its LinkedIn link pointed at linkedin.com's generic homepage.
   Both fixed.
3. **`robots.txt` advertised a sitemap that did not exist** — the README's build
   step never runs, because Cloudflare publishes `./` with no build. Sitemap
   now generated with hreflang across all three language trees.
4. **`/en/v2/` is an orphan alternate homepage**, unlinked but crawlable and
   competing with `/en/`. Disallowed + noindexed, not deleted.
5. **3 pages had no analytics; 15 lacked OG tags** (shared links rendered as
   bare grey URLs). All fixed. Zero conversion instrumentation existed; now 129+.
6. **Vincent has graduated.** Maastricht DACS confirmed the diploma arrived
   2026-08-24. The site framed the BSc as in progress. Corrected — free
   credibility on a page selling €25–60k engagements.
7. **The offer's payback math does not work as published.** See
   `.ops/ECONOMICS.md`. Correct formula is `build ÷ (monthly saving − retainer)`,
   because the retainer recurs forever. A €113k/year workflow at a €3k retainer
   takes 28 months, not 17, to repay a €35k build. At €6k/month the retainer
   consumes the entire saving and payback never arrives.
   **The published guarantee would therefore fire on deals that went well**,
   and it has no cap, no metric, no measurer and no end date. Highest
   commercial risk on the site.
8. **The real ICP filter is 2–3 FTE on ONE repetitive workflow**, not company
   size or revenue. Derived from the table in `.ops/ECONOMICS.md`.
9. **No warm pipeline exists in the inbox.** 14 months of mail contained four
   real business threads. See `.ops/WARM.md`. One is genuinely worth reviving,
   and Wannado turns out to already sell AI services — making it a live
   channel rather than a cold ask.

## Shipped this session
- `assets/js/leads.js`, `functions/api/lead.js` — honest lead capture
- `/en/roi/`, `/fi/laskuri/` + `assets/js/roi.js`, `assets/css/roi.css` —
  ROI calculator that disqualifies prospects it should disqualify
- `sitemap.xml`, `.ops/gen-sitemap.py`, corrected `robots.txt`
- `.ops/` durable state, `verify.sh`, `loop.sh`

## Still running
- `lead-hunt` workflow (wf_33f89bfb-eb5) — 2/14 sweep slices done, 12 raw leads
- `offer-and-convert` workflow (wf_4119c54b-f5f) — 17 agents, in final phase
