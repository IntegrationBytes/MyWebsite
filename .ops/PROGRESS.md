# PROGRESS — current best state

Updated: iteration 1

## Verification status
`bash .ops/verify.sh` → **FAIL** — but all 7 SITE sections (A–G) now PASS.
Only the lead-list sections (H, I, J) remain, and both workflows are still running.

## Checklist (each item has its own check in verify.sh)
- [x] G — ops state blocked from public serving (`_redirects`)
- [x] C — all internal links resolve
- [x] F — no fabricated social proof / placeholders
- [x] A — contact forms deliver leads (browser-tested, both paths)
- [x] B — booking CTA on every page + non-JS fallback
- [x] D — analytics + meta + OG + canonical on every page
- [x] E — conversion events instrumented (129 elements)
- [ ] H — leads.csv >= 30 complete rows
- [ ] I — every lead source_url verified live
- [ ] J — OFFER.md + >=10 outreach drafts
- [x] K — loop state files current

## Proven findings (observed in command output, not assumed)
1. **Lead capture is dead sitewide.** `en/contact`, `fi/ota-yhteytta`,
   `es/contacto` all wrap delivery in `if (window.LEADS_WEBHOOK_URL)`.
   `grep -c LEADS_WEBHOOK_URL assets/js/config.js` → **0**. The variable is
   never defined, so `fetch` never fires, yet the success message
   "Got it — I'll be in touch within 24 hours" is shown unconditionally.
   Every form submission the site has ever received was discarded silently.
2. `deploy.yml` publishes `directory: ./` — the whole repo root is public.
   Any file at root is downloadable. Ops state must stay in `.ops/`.
3. 3 pages ship with no analytics: `en/results`, `es/resultados`,
   `fi/tulokset`. 12 pages have no OG tags (dead link previews when shared).
4. Zero conversion event instrumentation exists. Umami is loaded but no
   CTA click, form start, or booking event is tracked anywhere.

## Owner profile (from CV, authoritative)
Vincent Viitala. Finnish. Business registered 2019 at age 15 (Aiferno,
sole trader). Founding shareholder TopicalBase Oy 2024–2025. Family
business Wannado.fi: ~60 assistants, 700+ SME clients, 12 years operating.
BSc Data Science & AI, Maastricht, graduating 06/2026. Thesis: SULO
knowledge-graph extraction w/ self-correcting pipeline (Prof. Dumontier).
Lukio valedictorian, Fuengirola Spain. FI native / EN fluent / ES A2.
**One** prior paid AI consulting engagement. No named client case studies.
