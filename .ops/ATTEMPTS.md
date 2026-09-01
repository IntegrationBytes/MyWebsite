# ATTEMPTS — append-only log. Never rewrite history here.

## Iteration 0 — baseline reconnaissance
**Approach:** Read the whole site, deploy pipeline, and CV before changing
anything. Wrote `.ops/verify.sh` as the objective done-condition and ran it
cold to establish a truthful baseline.
**Result:** VERIFY: FAIL. Sections C, F, G pass. A, B, D, E, H, I, J, K fail.
**Learned:**
- The single biggest conversion defect is not design, it is a dead form.
  No amount of copywriting fixes a form that throws leads away.
- The repo root is the deploy root, so lead data cannot live at root.
- Vincent's credibility assets are real but *thin on client proof*: the
  honest lever is his unusual profile (registered a business at 15, family
  business with 700+ SME clients, Maastricht DS&AI) plus risk reversal —
  not invented case studies.
**Exhausted?** No. This was reconnaissance, not an attempt at the goal.

## Iteration 1 — fix the conversion path before touching copy
**Approach:** Treat the funnel as plumbing, not persuasion. Find and fix every
place a motivated visitor could fail to reach Vincent, then instrument.
**Result:** verify.sh sections A–G all PASS (were: A,B,D,E failing).
Browser-tested with Playwright against a live local server, both paths:
  - server 501 -> visitor told "Opening your email app…", mailto fired.  PASS
  - server 200 -> visitor told "Got it — I'll reply within 24 hours".    PASS
  - never claims success without a 2xx.                                  PASS
**What was actually broken (all confirmed by grep/browser, not assumed):**
1. All 3 contact forms discarded every submission while showing a success
   message. `window.LEADS_WEBHOOK_URL` was referenced 6 times, defined 0 times.
2. The "Or reach me directly / I respond same day" block showed NO email address.
3. LinkedIn links on all 3 contact pages pointed to `https://www.linkedin.com/`
   (the generic homepage), not his profile. GitHub link similarly generic in 1 file.
4. 3 pages had no analytics at all; 15 pages lacked OG tags, so every link
   shared in WhatsApp/LinkedIn/Slack rendered as a bare grey URL.
5. Zero conversion instrumentation existed. Now 129 tracked elements.
6. Homepage booking depended entirely on a third-party Cal.com JS embed with
   no fallback: ad-blocker or CSP failure = an empty 700px box.
**Corrected mid-iteration:** I first read the homepage #contact section as a
dead end. It was not — the `#cal-inline` div carries a JS-booted embed that my
text extraction stripped. The real (narrower) defect was the missing fallback.
**Learned:** The site's problem was never persuasion. A visitor who was fully
sold had no reliable way to reach him. Copy was never the bottleneck.
**Exhausted?** No — this line of work paid off and is complete for now.

## Iteration 2 — build a qualifier, not a brochure
**Approach:** Ship an ROI calculator as the lead magnet. For an offer whose
whole logic is "the workflow costs more than the build", the calculator IS
the pitch — and it can honestly disqualify prospects, which for a seller
with no case studies buys more credibility than any claim on the page.
**Result:** `/en/roi/` + `/fi/laskuri/` shipped. Browser-tested across three
scenarios in both languages. Small prospects get told to buy an off-the-shelf
tool and the booking CTA is hidden from them.
**What testing exposed — the important part:** my payback formula was wrong,
in the direction that flattered the offer. I used
`(build + 12*retainer) / monthly saving`. The retainer recurs for as long as
the agents run, so it must be netted off BEFORE the build repays:
`build / (monthly saving - retainer)`. On a EUR113,400/yr workflow that moves
the answer from 17 months to 28. At a EUR6k/mo retainer the surplus goes
negative and payback never arrives — a case the naive formula hid entirely.
**Consequence, written up in .ops/ECONOMICS.md:** the guarantee published on
the homepage would fire on deals that went WELL, not just bad ones, and it
has no cap, metric, measurer or end date. That is now the single largest
commercial risk on the site. Also: the real ICP filter is 2-3 FTE on ONE
repetitive workflow, not headcount or revenue.
**Learned:** building the tool was worth more than the tool. I would not have
found the pricing flaw by reading the offer; I found it by making the numbers
compute.
**Exhausted?** No — complete and successful.

## Iteration 3 — QA sweep and warm-channel research
**Approach:** Audit all 18 pages in a real browser (heading order, alt text,
labels, empty links, JS errors) and separately search 14 months of Vincent's
mail for warm leads.
**Result:** Site came back clean except one real defect — the service <select>
on all three contact forms had no accessible name, so screen reader users
heard nothing describing the most conversion-critical control on the site.
Fixed. Mail search found only four genuine business threads in 14 months.
**Learned:** there is no dormant pipeline to harvest; cold outreach cannot be
avoided. But one dormant thread is genuinely worth reviving, and Wannado
already sells AI services, which makes it a live channel rather than a cold
ask. Recorded in .ops/WARM.md.
**Exhausted?** No.

## Iteration 4 — verify every lead myself instead of trusting the agents
**Approach:** The lead-hunt workflow has its own adversarial verifier, but the
machine has 4 CPUs so workflow concurrency is 2, and ~98 queued agents means
hours. Rather than gamble the deliverable on it finishing, I re-fetched every
cited page myself via Exa (batched, far faster than agents) and checked whether
the claimed contact string literally appears on it.
**Result:** 25 leads in leads.csv, 44 cited URLs positively confirmed live.
verify.sh sections A-G2, I, J, K all PASS. Only H fails: 25 leads, need 30.
**What the check caught — the reason it exists:**
- Festum: janne.euren@festum.fi was NOT on the cited page. Pattern-guessed.
- Stremet: matias.soini@stremet.fi likewise absent; page names Janne Mannisto.
- Feon, Huhtala: same, repointed to published routes.
- Isannointitalo: phone off by two digits (...9962 vs published ...9922).
- Tocca: I was WRONG to flag it - the number IS published, on proff.fi.
  Verification has to run in both directions or it just becomes a different bias.
- Eilakaisla: EUR1.8M revenue, 14 staff. Below the ICP floor. Demoted.
- 4 leads dropped as unverifiable. An unconfirmed contact route is not a lead.
**Also fixed a false PASS in my own checker:** section H counted lines with
wc -l, but quoted CSV fields contain newlines, so 20 leads read as 96 and the
check passed. A check that cannot fail is not a check.
**Learned:** roughly a quarter of agent-supplied email addresses were guessed
from a name pattern rather than read off a page. The companies and the triggers
were consistently real - the fabrication was concentrated entirely in contact
details, which is exactly the field that bounces and burns sender reputation.
**Exhausted?** No. The approach works; it is just gated on the sweep finishing.

## Iteration 5 — close out: hero rewrite, 32 verified leads, VERIFY PASS
**Approach:** Applied the offer workflow's conversion output (hero rewrite,
guarantee wording matching the capped clause) and verified the remaining
lead-hunt slices myself as they landed.
**Result:** `bash .ops/verify.sh` -> **VERIFY: PASS**. All sections A-K green.
32 verified leads, 62 cited URLs positively confirmed live, 14 outreach drafts.
**Caught in my own work:** the instrumentation pass I ran in iteration 1 gave
the ROI calculator link data-umami-event="cta-book" - the same event as the
booking button. Calculator clicks would have been counted as bookings and the
conversion data would have been wrong from the first visitor. Now cta-roi.
**Hero:** measured before/after in a browser. The primary CTA now sits above
the fold at 1280x860 and at 390x844; on the phone viewport it previously did
not. Price, timeframe, ownership and the capped guarantee are all above the
fold, where a 76-word paragraph used to be.
**Learned:** the agent-supplied leads were reliable about companies and
triggers and unreliable about email addresses specifically - roughly a
quarter were guessed from a name pattern. Every trigger I checked was real
and correctly dated, several within the last two weeks.
**Exhausted?** Goal met. Remaining work is Vincent's decisions, not mine.

## Iteration 6 — the offer changes; four errors found in my own work
**Approach:** Vincent said he can also do AI sales and marketing and that the
offer may change. Checked the obvious move before designing for it, then ran
four independent offer designs judged by three adversarial personas.
**What the market check found:** the obvious move is a trap. Finnish GEO is
commoditised at EUR149-390/month with incumbents already holding the "free AI
visibility report" lead-magnet position, AND Wannado Marketing already sells
GEO hourly. A Vincent-branded GEO service would compete with his own family
business in a market where his one real advantage - that he builds systems -
counts for nothing. Written up in .ops/MARKET.md.
**Result:** .ops/OFFER.md replaced. Signal Run: sell a checkable file, not
monthly labour. Rungs EUR0 / 1,200 / 3,500 / 600 / 2,400-mo / 4,500 / 29-79k.
The old cost-side build survives as Rung 5 (.ops/OFFER-build-rung5.md).
Judges scored productised-pipeline 28.3, own-vs-rent 26.7, fastest-cash 24.7,
family-channel 20.7.
**The best idea was not mine:** eight leads are active acquirers with public
numeric growth mandates. For them the product is acquisition-target
origination, not customer leads - competing against M&A advisors at 3-5% of
deal value, which makes a fixed fee a rounding error. Balanco verified end to
end: EUR35M-by-2027 against ~EUR18M, ~10 acquisitions needed, and the buyer is
Antti Voittonen who negotiates them and owns 16%, not the country manager I
had on file.
**FOUR ERRORS THE REVIEW FOUND IN MY OWN WORK - the important part:**
1. I published "62 source URLs confirmed live" on both proof pages. The rows
   cite 55; url_check.txt has 64 lines because 9 are rejected candidates. 62
   was neither number, on a page whose entire argument is "audit me."
2. The Festum row's source_quote - the verbatim-from-page field - contained
   the very address its own note calls fabricated.
3. Varova and LTP carried size figures sourced to asiakastieto pages my own
   log records as paywalled and NOT substantiating them.
4. Sweeping for that pattern: 12 of 16 size claims cite a third-party data
   source with no corresponding URL in the log.
Plus a fifth the re-rank caught: 31 of 32 est_deal_size values still priced
the abandoned cost-side offer, inside the file meant to be shown to prospects.
**Learned:** an offer built on "check my work" raises the cost of my own
sloppiness enormously. Three reviewers found the 62 in four minutes. Added
harness checks H2, H3 and H4 so each class of error fails the build rather
than reaching a prospect.
**Exhausted?** No. Pre-flight items remain, listed in NEXT.md.

## Iteration 7 — lead-hunt lands (95 agents, 3.1h); I was wrong about the paywall
**Approach:** Integrate the completed lead-hunt workflow: 69 adversarially
verified survivors, 7 refuted. All 7 rejections were on commercial FIT, not
fabrication - the sweep agents' factual work held up under attack.
**MY ERROR, found by the workflow contradicting me:** I had withdrawn Varova's
and LTP's size claims as "paywalled, NOT substantiated". The workflow's verifier
reported fetching those exact pages and quoted verbatim financials. I refetched
with a larger character budget and the verifier was right: asiakastieto.fi
publishes headline revenue/headcount/margin/equity PUBLICLY, below the login
boilerplate. My original check used maxCharacters=350 and stopped above the
data. I withdrew two TRUE claims and reported the withdrawal to Vincent.
Both restored with verbatim quotes; the url_check lines corrected.
**Lesson that generalises:** a truncated fetch is not a negative result. "I did
not see it" was recorded as "it is not there." The same 350-char default is
probably why several proff.fi and finder.fi claims are still labelled
unverified - those sites use the same public-headline pattern.
**Spot-check of the workflow's own verification:** 8 URLs sampled at random,
8/8 live and matching. That is why the merged URLs are logged as verified by
the workflow rather than by me, with the provenance stated per line.
**Result:** 79 leads (was 32), 179 URLs logged, VERIFY: PASS.
- 1 lead dropped (Kittle Property Group): its only contact source was a
  login-walled LinkedIn profile, so the contact route cannot be confirmed.
- 2 leads had their trigger citation repointed off LinkedIn and the trigger
  itself marked UNCONFIRMED rather than quietly kept.
- 39 of 79 size claims are labelled UNVERIFIED_third_party - honest, and a
  known follow-up now that the public-headline pattern is understood.
- Section I rescoped to judge only URLs a shipped row actually cites; an
  UNKNOWN line for an uncited URL is a record of diligence, not a defect.
**Exhausted?** No. Remaining: re-verify the 39 unverified size claims using the
public-headline pattern, and re-score all 79 against the new revenue-side test.
