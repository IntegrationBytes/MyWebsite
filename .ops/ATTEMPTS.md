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
