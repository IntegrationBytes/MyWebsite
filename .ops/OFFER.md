<!-- Produced by the revenue-offer workflow: four independent designs
     (productised pipeline, own-vs-rent, family-channel, fastest-cash), each
     scored by three adversarial personas - a burned Finnish SME owner, a
     veteran solo consultant, and a competitor asked to undercut it - then
     synthesised. Scores: productised-pipeline 28.3, own-vs-rent 26.7,
     fastest-cash 24.7, family-channel 20.7.

     SUPERSEDES the cost-side offer, which survives as Rung 5 and is archived
     in .ops/OFFER-build-rung5.md. Market rationale: .ops/MARKET.md. -->

# OFFER — Signal Run

> **This document replaced the previous offer after Vincent said he can also do
> AI sales and marketing.** The old offer sold cost-side agent builds: a EUR4,500
> diagnostic into a EUR29-79k build, with payback measured over twelve months.
> That is the hardest possible sale for someone with no case studies, and
> `.ops/ECONOMICS.md` showed it only qualifies companies with 2-3 FTE on one
> repetitive workflow.
>
> **What changed the answer:** the obvious alternative - an AI marketing or GEO
> service - is a trap. `.ops/MARKET.md` documents why: Finnish GEO starts at
> EUR149/month with established agencies already holding the position, and
> Wannado Marketing already sells it. So this offer sells neither builds nor
> monthly marketing labour. It sells **a checkable file**, and the proof is the
> run already sitting in this repo.

## The one-line version

> **"Ostat tarkistettavan tiedoston, et kuukausilaskua."**
> *(You buy a checkable file, not a monthly invoice.)*

The moat is not the technology. It is the disclosure: he publishes the
fabrication rate of his own machine - 8 of 32 contact routes, exactly 25% -
and a competitor copying that move has to open their own error rate first.

## The ladder at a glance

| Rung | Name | Price | Duration |
|---|---|---|---|
| 0 | Artifact Walkthrough | EUR 0 | 30 min |
| 1 | Proof Ten | EUR 1,200 | 3 business days |
| 2 | Signal Run 30 | EUR 3,500 | 7 business days |
| 2.5 | Trigger Density Check | EUR 600 | 2 business days |
| 3 | Standing Run | EUR 2,400/month | rolling, 3-month min |
| 4 | Install Sprint | EUR 4,500 | 10 business days |
| 5 | The Build | EUR 29k / 49k / 79k | 45 / 75 / 110 days |

Rung 2.5 is the one to notice. Its job is to measure whether the client's niche
actually produces enough signals to sustain a monthly cadence, and it is
explicitly allowed to conclude **"do not buy the retainer."** That is the same
failure mode `ECONOMICS.md` caught in the old offer, caught a second time before
it could be sold.

---

# SIGNAL RUN — final offer

**Version:** final · drafted 31.08.2026 · all prices EUR, ex-VAT (FI domestic 25.5%; EU cross-border B2B reverse charge)
**Evidence base:** every number below was recomputed from `/home/user/MyWebsite/.ops/leads.csv`, `/home/user/MyWebsite/.ops/url_check.txt`, `/home/user/MyWebsite/.ops/ECONOMICS.md`, `/home/user/MyWebsite/.ops/MARKET.md`, `/home/user/MyWebsite/.ops/WARM.md`. Where an earlier draft's number was wrong, the corrected number is used and the error is named.

---

## 0. The single rule this document obeys

**No number appears in a sales conversation that has not been recomputed from the file that morning.** The previous draft claimed "62 cited URLs." The file cites **55**. That one inflated number was found by three separate reviewers inside four minutes, and in an offer whose entire differentiator is "audit me," an inflated headline is not a rounding error — it is the pitch detonating in the room. Every count below is the output of a script, and the script ships with the file.

---

## 1. The positioning line

> **"Every agency in this market bills you monthly for work you cannot check. I sell a fixed-price file of named Finnish decision-makers where every single claim ships with a timestamped snapshot of the page it came from, is auditable in forty minutes, and is refundable at €117 a row — and I publish the addresses my own machine invented before I caught them."**

Finnish, for the front page:

> **"Ostat tarkistettavan tiedoston, et kuukausilaskua."**
> *(You buy a checkable file, not a monthly invoice.)*

**Why a €390/month competitor cannot say this back.** To publish a fabrication rate, they would first have to measure their own — and none of them do. Vincent's is measured: **8 of 32 contact routes (25.0%) proposed by the model were pattern guesses that appeared on no page the company publishes.** They are flagged in the `verified` column as `corrected`, the specific fabrication is named in `verification_note`, and the discards ship with the file. A competitor copying this move has to open their own error rate first. That is the moat: not the technology, the disclosure.

**Who it is sold to:** Finnish B2B companies of roughly 20–250 staff whose buyers are other companies, who already do outbound in some form, and whose sector produces public, dated events (acquisitions, funding, factory investments, named-role hiring). Explicitly *not* sold to companies whose buyers are consumers or housing companies, and not to anyone whose real need is AI visibility — see §9.

---

## 2. The artifact, restated with correct numbers

This is the whole pitch, and it costs €0 to deliver because it already exists.

| Measured on the self-run | Verified count | How to verify it live |
|---|---|---|
| Finnish companies delivered | **32** | `wc -l leads.csv` |
| Contact route found verbatim on a page that was fetched | **24 (75.0%)** | `verified` column = `exact` |
| Contact route machine-proposed, caught as fabricated, corrected or dropped | **8 (25.0%)** | `verified` column = `corrected`, fabrication named per row |
| Reachable by published email / direct phone / named form | **19 / 10 / 3** | `contact_type` column |
| Distinct source URLs cited across the 32 rows | **55** | dedupe of `source_url` + `trigger_source_url` |
| Of those 55, individually fetch-checked and logged | **55 (100%)** | `url_check.txt` |
| Further URLs checked for candidates that were **rejected and never shipped** | **9** | `url_check.txt` lines not cited by any row |
| ICP fit graded strong / moderate / weak | **15 / 14 / 3** | `icp_fit` column |
| Triggers carrying an explicit day-month-year date | **14** | 11 of them ≤120 days old; 3 are 125–189 days old |
| Triggers dated to a month or year but not a day | **11** | |
| Triggers that are a **standing condition, not a dated event** | **7** | e.g. continuous back-office hiring |
| First-touch drafts written, each opening on that company's own signal | **15** (12 cold, 1 warm, 1 channel, 1 buy-box) | `.ops/outreach/` |
| Elapsed time | **one overnight run** | |

**The four examples he reads aloud, all source-verified:** Balanco Oy's 17.08.2026 acquisition of Accotilit, where Balanco's own headline says the technology shift drove the deal; Yle's 27.08.2026 report of Finnglass launching a €12M defence-driven investment; Eltrea taking Vaaka Partners money on 21.05.2026 while simultaneously buying a competitor; Fluxio hiring a bookkeeper to do *lainaosuuslaskenta* and *ostoreskontra* by hand across 280+ staff.

**The line that closes the call:**
> *"That is not a case study about a client. It is the product, run on me, including the parts it got wrong. I will run the identical thing on your ICP and you will have it in seven working days — and you will be able to break it for money."*

---

## 2b. PRE-FLIGHT — nine fixes, roughly six hours, before a single email is sent

The artifact is the offer. If a prospect audits it and finds what three reviewers found in four minutes, the offer is dead on the first call. **None of these are optional and all are cheap.**

| # | Fix | Why |
|---|---|---|
| 1 | **Row 1 (Festum) contradicts itself.** `verification_note` says `janne.euren@festum.fi` was pattern-guessed and not on the page; `source_quote` — the verbatim-from-page field — contains that exact address. Truncate the quote to what the fetched page actually publishes, or re-fetch and correct the note. | It is the first row of the file he reads aloud as proof his verification works. |
| 2 | **Change 62 → 55 everywhere.** In `PROGRESS.md` (which says 44), in any deck, on the site. State it as: *"55 cited URLs, all 55 fetch-checked; 9 more checked for candidates I rejected."* | Three numbers for one metric, and it is the metric the credibility rests on. |
| 3 | **Fix the ICP split: 15 strong / 14 moderate / 3 weak.** The earlier draft transposed it to 14/15. | Fourth wrong number in a pitch that says "count it yourself." |
| 4 | **Strike the two `asiakastieto.fi/taloustiedot` size claims** (LTP Logistics, Varova). His own log says *"loads, but financials are behind a paywall — the size figure is NOT substantiated by this page."* Replace with a page that proves it, or downgrade the size evidence to what is provable. | "Confirmed live" must never mean "the URL returned something." |
| 5 | **Rebuild `url_check.txt` as an evidence bundle**: per URL — fetch timestamp (UTC), HTTP status code, SHA-256 of the response body, and a stored PNG/PDF snapshot. Not one status code exists in the current log. | This is what makes the guarantee in §5 safe rather than fatal. See §5. |
| 6 | **Re-label the trigger field honestly:** `trigger_type` ∈ {`dated_event`, `period_event`, `standing_condition`} and `trigger_date`. 14 / 11 / 7 on the self-run. Then the gate in §4 promises what the machine actually produces. | The old gate said "every trigger dated within 120 days." His own showcase fails it. Never write a contractual gate your best work fails. |
| 7 | **Produce a redacted showcase copy** (`leads_showcase.csv`): drop `est_deal_size`, drop `pain_hypothesis`, drop private commentary such as the Balanco note *"DO NOT PITCH AI: they have an AI director."* Keep `verification_note` — that column is the product. | Handing a stranger the raw file publishes his own pricing model and his private opinions about twelve named Finnish companies, several of whom will hear about it. |
| 8 | **Write the DPA and the processing note.** One page: controller/processor roles, categories (business-role contact data published by the company itself), retention, deletion on request, sub-processors named (search/fetch API, model provider, storage). "Available on request" means it does not exist. | He circulates named individuals' data with commercial profiling attached. This is also the exact provenance argument he uses against competitors. |
| 9 | **Delete every mention of the old build guarantee** from drafts and site. `ECONOMICS.md` proves it fires on deals that go well: a €113,400/yr workflow at a €3k retainer takes 28 months to repay a €35k build. | It is the largest uncapped liability he owns. Replaced in §3, Rung 5. |

The 12 cold drafts also still sell the abandoned €4,500 Sprint and carry cost-side `est_deal_size` values. **Rewrite the offer paragraph in all 12 to the Rung 1 / Rung 2 ladder before sending.** That is a find-and-replace on one paragraph, not a rewrite.

---

## 3. The ladder

Six rungs. Each has a price, a duration, a deliverable list, and one written trigger that moves the buyer up. Nothing above Rung 2 is ever mentioned in a first email.

| Rung | Name | Price | Duration | Sold when |
|---|---|---|---|---|
| 0 | Artifact Walkthrough | **€0** | 30 min | Always. Zero delivery cost. |
| 1 | **Proof Ten** | **€1,200** | 3 business days | They are interested and have never bought from him. 100% credited to Rung 2 within 21 days. |
| 2 | **Signal Run 30** | **€3,500** | 7 business days | Default product. Signal Run 60: **€5,900 / 12 business days**. |
| 2.5 | **Trigger Density Check** | **€600** | 2 business days | Before anyone is allowed to buy Rung 3. It can, and often should, end in "do not buy the retainer." |
| 3 | **Standing Run** | **€2,400/month**, 3-month minimum | Rolling monthly | Only after a delivered Rung 2 **and** a Density Check ≥12 qualifying signals/month. |
| 4 | **Install Sprint** | **€4,500** | 10 business days | They say "stop selling us rows, put this inside our stack." Credited in full against Rung 5 within 21 days. |
| 5 | **The Build** — Foundation / Core / Sovereign | **€29,000 / €49,000 / €79,000** | 45 / 75 / 110 calendar days | Only after Rung 4, and never as a first purchase. |

### Rung 0 — Artifact Walkthrough — €0, 30 minutes
**Delivered:** screen-share of the real `leads_showcase.csv`, the evidence bundle, the reject log, and the correction log. The prospect names any three rows; Vincent opens the stored snapshot for each on the call.
**In:** the file, the numbers in §2, the honest credentials statement in §7.
**Out:** no advice on their business, no ICP work, no proposal, no pricing of anything above Rung 2.
**Conversion mechanic:** *"Give me your ICP in two sentences and I will run ten of them for €1,200, delivered Thursday. If you would rather see thirty, that is €3,500 and the €1,200 comes off it."*

### Rung 1 — Proof Ten — €1,200, 3 business days
**Why it exists:** €1,200 is a single signature in a Finnish SME. €3,500 sometimes requires the other shareholder. It is the door in the wall — and because it is 100% credited, it is a deposit dressed as a test.
**Delivered:**
1. **10 companies**, all six acceptance gates (§4) passed, zero duplicates, zero suppression-list hits.
2. **10 named decision-makers** with role. **At least 6 of 10 reachable by an email address published on a page that was fetched**; the rest by direct phone line or a named contact form. (Self-run: 19/32 = 59.4%.)
3. **≥20 cited source URLs**, one proving the contact route, one proving the signal, each with timestamp, HTTP status, body hash and stored snapshot.
4. **10 signals**, each typed (`dated_event` / `period_event` / `standing_condition`) with a verbatim quote and the URL. **At least 6 of 10 must be `dated_event` ≤120 days.**
5. **3 first-touch drafts**, Finnish or English, each opening on that company's own signal, each passing the swap test (§4).
6. **The reject log** — every company examined and thrown out, with the reason.
7. 15-minute recorded voice-note handover instead of a call.
**Out:** no sending, no calling, no strategy, no CRM work, no ICP invention.
**Price per row: €120.** **Conversion mechanic:** the invoice for Rung 2 arrives with €1,200 already deducted, valid 21 days, no negotiation.

### Rung 2 — Signal Run 30 — €3,500, 7 business days
**Delivered:** one CSV in their column schema or his, one evidence bundle, one reject log, one 60-minute handover call.
1. **30 companies**, all six gates, zero duplicates, zero suppression-list hits.
2. **30 named decision-makers** with role. **≥17 of 30 reachable by a published email address.**
3. **≥55 cited source URLs** — at least one per claim, two per company wherever two distinct pages exist. *(The old draft promised "minimum two per company / ≥60 URLs." The self-run cites 55 across 32 companies — 1.72 each — and in 9 of 32 companies the contact page and the signal page are the same page. Promising a density he has never hit, on a stranger's ICP, under a clock, was the single most dangerous sentence in the previous version.)*
4. **30 typed signals** with verbatim quote and source. **≥18 of 30 must be `dated_event` ≤120 days**; the remainder may be `period_event` or `standing_condition`, each labelled as such.
5. **ICP fit graded per row**, reason stated: **≥14 of 30 graded strong, ≤3 graded weak.** (Self-run: 15 strong, 3 weak of 32.)
6. **12 first-touch drafts**, each passing the swap test.
7. **The reject log.** Expect 60–90 companies examined for 30 shipped.
8. The compliance note: Act on Electronic Communications Services 917/2014 §202 — direct marketing to an *organisation* is lawful on an opt-out basis in Finland; §200 — to a natural person it is not. Every draft ships with a working opt-out line already in it.
**Signal Run 60 — €5,900:** 60 companies, ≥100 cited URLs, 20 drafts, 12 business days, 90-minute handover. €98/row.
**Price per row: €117.** **Conversion mechanic:** the handover call ends with one question — *"Do you want to know whether this niche produces enough signals to be worth a monthly cadence? That is a €600 Density Check and it may well tell you no."*

### Rung 2.5 — Trigger Density Check — €600, 2 business days
**The rung that stops the retainer from being a lie.** Acquisitions, funding rounds and factory investments happen once or twice a year per company. A Finnish niche of 150 firms does not produce 30 dated events every month forever — month 1 harvests a backlog and looks brilliant, month 3 collapses, and the volume promise then fires on a system that is working perfectly. That is exactly the failure mode `ECONOMICS.md` already caught once.
**Delivered:** trailing-12-month signal count for their defined ICP, month by month, by signal type, with sources; the measured monthly floor; a written recommendation that is **allowed to be "do not buy the Standing Run."**
**Conversion mechanic:** if measured density ≥12 qualifying signals/month → Standing Run offered at a volume band derived from that measurement. If <12 → he says so in writing and sells a repeat Signal Run quarterly instead. The €600 is credited against the first Standing Run month.

### Rung 3 — Standing Run — €2,400/month, 3-month minimum, then rolling
**This is the ARR rung, and it is deliberately not gated on the client owning a sequencer.** The previous design gated its only recurring revenue on the client's reply data — but a 20–60 person Finnish SME owns no warmed domain, no sequencer and no SDR, so the reply data would never exist and the ladder terminated at a one-off CSV.
**Delivered monthly:**
1. Rows written **directly into their HubSpot/Pipedrive as tasks** — not a Drive folder — assigned to a named owner, with the signal, the quote, the source link and the snapshot attached.
2. Volume band set by the Density Check: **up to 25 rows/month, with a contractual floor at 60% of measured density.** If a month lands below the floor, the shortfall is credited at **€95/row** against the next invoice. He never guarantees a fixed volume of other companies' news.
3. 10 drafts/month, swap-tested.
4. Monthly 45-minute review: what got replies, what to change in the ICP, what to stop targeting.
5. Suppression-list maintenance and de-duplication across all prior months.
**Out:** sending, calling, meeting-booking — all three are available and all three are bought from Wannado (§6), not from Vincent.
**Conversion mechanic:** month 3 review. *"You are spending €2,400 a month renting this from me and about €420 a month on Wannado hours to work it. If you want it inside your own stack, running on your own cloud at roughly €100–250 a month, that is Rung 4."*

### Rung 4 — Install Sprint — €4,500, 10 business days
**Delivered:** the workflow register scored, a working prototype running on a copy of **their** data, an authenticated connection proven against the ugly system (their ERP, their CRM), a signed baseline measurement, and a **fixed Build price with no range in it**. Credited in full against Rung 5 if signed within 21 days.
**Maximum exposure: €4,500, one client at a time.**
**Conversion mechanic:** the Sprint readout *is* the Build proposal. If the boring part is not tractable, he says so and the Sprint has still paid for itself for both sides.

### Rung 5 — The Build — €29,000 / €49,000 / €79,000
**How the existing agent-infrastructure Build survives:** it stops being the front door and becomes the exit. Nobody is quoted €29k in a first conversation — from a 22-year-old with one paid engagement and no references, the install is not a rung, it is a fantasy, and mentioning it early makes the €1,200 look like bait. It is now reachable only from a delivered Rung 2 or 3 plus a paid Rung 4, which means by the time the number is said aloud, the buyer has already bought from him twice and audited the output once.

**Tier assignment is mechanical, not negotiated** (unchanged from `OFFER.md`, which got this right):
- **Sovereign €79,000** — any *one* of: regulated sector; on-prem or "no US-owned cloud"; >250 employees; contractual pen-test/security questionnaire; GDPR Art. 9 data in scope. 110 days.
- **Core €49,000** — any *two* of: ERP without a modern REST API; >100 employees; 3+ departments in scope; staging environment required; 3 agents at signature. 75 days.
- **Foundation €29,000** — everything else: one department, SaaS-only stack, ≤4 connectors from the certified list. 45 days.

**What is being sold at this rung, in one sentence:** *"Osta kone, älä kuukausilaskua"* — the client owns the engine, it runs in their cloud on their keys at roughly €100–250/month of metered running cost, and it keeps running if they never speak to Vincent again.

**Honest crossover, published in the proposal, not hidden:**

| Option | 36-month cash | Own anything at the end? |
|---|---|---|
| GEO/marketing retainer €400/mo | €14,400 | No |
| Standing Run €2,400/mo | €86,400 | No |
| SDR agency €2,500/mo | €90,000 | No |
| Wannado marketing manager, 20 h/mo @ €85 | €61,200 | No — but you get a human |
| **Foundation Build + €390/mo Care** | **€43,040** | **Yes** |
| **Foundation Build, self-run** | **€29,000 + ~€150/mo = €34,400** | **Yes** |

The crossover against the Standing Run is **month 17**. Say that out loud; a buyer who does the arithmetic and finds it already on the page stops looking for the trick.

**Post-build, three options, one of them genuinely free:**
- **Self-run — €0/month to Vincent.** Repo, runbook, admin training, their keys. The €0 option is what makes "you own it" true rather than a slogan.
- **Care plan — €390/month.** Model/API updates, connector repairs when a source system changes, monthly 60-minute review, 2 hours of changes. Monthly cancellable, 30 days' notice. Framed as insurance on machinery you own.
- **Operator hours — routed to Wannado**, €38–85/h.

**The Build guarantee — capped, metered, ended.** Replacing the uncapped ROI promise that `ECONOMICS.md` proved would fire on successful deals:
> Acceptance is defined at signature as a written set of golden cases per agent (60 for Core, 40 for Foundation) and a named accuracy threshold. If the agents do not pass acceptance within 30 days of the delivery date, Vincent works without further fee until they do **or refunds 25% of the Build fee, capped at €12,000, at the Client's election.** Measurement is the golden-case suite, run by the Client's named owner, on the Client's data. The obligation ends at acceptance or at day 90, whichever is first. **No promise is made about business outcomes, savings, or payback period** — the arithmetic for those is published at `/en/roi/` and it is deliberately unflattering.

---

## 4. Scope boundaries and acceptance gates

### The six gates — contractual, per row, enforced by script
A row is not billable unless all six hold. This is the same gate set the self-run passes **after** the §2b fixes — and it has been rewritten so that it does.

| # | Gate |
|---|---|
| 1 | Company matches the ICP definition frozen in writing at the 45-minute kickoff. |
| 2 | A named person with a stated role at that company. |
| 3 | A contact route **published by the company on a page that was fetched**, delivered with the URL, the verbatim sentence it appears in, and the snapshot. **No pattern-guessed addresses ever ship.** If `firstname.lastname@` was inferred and not seen, the row ships with the published route (which may be a role address or a direct line) or does not ship — and the inference is recorded in the correction log either way. |
| 4 | A signal, **typed and dated**: `dated_event` (day-month-year, ≤120 days), `period_event` (month or year stated), or `standing_condition` (an observable, ongoing state such as continuous hiring into a named back-office role). Verbatim quote plus source URL for all three types. **No login-walled sources** — LinkedIn posts that cannot be re-fetched were rejected in the self-run and will be rejected here. |
| 5 | Independent size evidence with its source, **where the source page itself states the figure.** A page that loads but paywalls the number does not satisfy this gate. |
| 6 | Every URL in the row returned **2xx at the delivery timestamp**, logged with status code, UTC timestamp, body hash and stored snapshot. |

**The swap test** (drafts only): if a draft's first paragraph still works with a different company's name pasted in, it is rewritten before delivery.

### Explicitly OUT of scope, every rung below Rung 5

- **No sending.** He does not touch your domain, DNS, mailbox warming, sequencer or deliverability. Drafts arrive as text, one click from send. Sender reputation and consent are yours.
- **No calling, no appointment setting, no booked-meeting guarantee.** He sells verified inputs. If you want the calls made, buy Wannado hours (§6) — he will make the introduction and take no margin on it.
- **No reply rate, meeting or revenue guarantee, at any rung, ever.**
- **No CRM cleanup or enrichment of your existing database.** Separate quote.
- **No ICP strategy or positioning work.** The kickoff freezes an ICP; it does not invent your positioning. Positioning is a separate €1,400 half-day.
- **No ads, no SEO, and no GEO / tekoälyoptimointi / AI-näkyvyys.** If what you need is to be found by AI assistants, he introduces you to **Wannado Marketing Oy**, who have sold exactly that, hourly, since 27.05.2026. **He does not quote against them and does not resell it.** That sentence is in the terms, in writing.
- **No purchased lists, no scraped private profiles, no login-walled sources.** Business-role contact data published by the company itself, only. DPA attached to the contract, not "available on request."
- **No monthly commitment below Rung 3**, and no Rung 3 without a Density Check.

---

## 5. The guarantee — entry rung, capped, snapshot-arbitrated, closed in 10 business days

The previous version handed the buyer a free-run exploit: strike 7 rows for link rot that is nobody's fault, elect refund, keep €3,500 of work. Every clause below exists to close a specific hole a reviewer drove a truck through.

> ### The audit guarantee
>
> **1. Evidence is date-locked.** Delivery includes, for every cited URL: the UTC fetch timestamp, the HTTP status code, a SHA-256 hash of the response body, and a stored snapshot (PNG or PDF) of the page as it was at delivery. **The snapshot is the arbiter.** A page that changes, moves, blocks bots, or dies after the delivery timestamp is not a strike, because the snapshot proves what it said. This single clause removes link rot, corporate proxies, 403s and job changes from the buyer's strike list without removing anything the buyer actually paid for.
>
> **2. Window.** Within **10 business days** of the delivery timestamp, in **one consolidated claim**, you may strike any row where:
> - (a) the contact route does not appear in the delivered snapshot of the cited page;
> - (b) the quoted signal statement does not appear in the delivered snapshot of the cited page;
> - (c) a cited URL did not return 2xx at the delivery timestamp per the log;
> - (d) the company is a duplicate, or was on the suppression list you supplied at kickoff.
>
> **3. Strikes must be evidenced.** Each strike names the row, the ground (a–d), and quotes the element that fails. An unevidenced strike is not a strike.
>
> **4. Remedy — replacement first.** For the **first 3 struck rows**: replacement within 5 business days, **or** refund of €117 per row (€120 Proof Ten · €98 Signal Run 60), **your choice**. For **struck rows 4 and above**: replacement within 5 business days. A refund of €117 per row is payable only if a replacement is not delivered inside that window.
>
> **5. Threshold.** If **more than 6 of 30 rows** (2 of 10 · 12 of 60) are struck and upheld, **the entire fee is refunded**, the engagement ends, and the delivered file and all copies are deleted or returned. **You do not keep a file you were fully refunded for.**
>
> **6. Lateness.** €250 for each business day past the contracted delivery day, **capped at €750**. There is no lateness clause that refunds the whole fee, because one bout of flu should not convert a week of work into free work.
>
> **7. Cap and remedy.** Total liability is capped at the fee paid. One claim. Sole and exclusive remedy.
>
> **8. What is NOT guaranteed, stated plainly:** reply rates, meetings, pipeline, revenue. I guarantee the input, because the input is the part I control.

**Say this out loud in the pitch:** *"Thirty rows, roughly 55 links and 55 snapshots. About forty minutes. A guarantee you can actually exercise is worth more than one you cannot — and this one closes in ten working days, not twelve months."*

**Payment.** Signal Run: 50% at kickoff, 50% within 7 days of delivery. Proof Ten: 100% up front (it is fully refundable under the row rule anyway). Standing Run: monthly in advance. Build: 30/40/30 against milestones.

---

## 6. Delivery spec — what one person actually does, hour by hour

**Signal Run 30, 7 business days, one operator.** M = manual (Vincent), A = automated (pipeline).

| Day | Work | M/A | His hours |
|---|---|---|---|
| **0** | Kickoff call, 45 min. ICP frozen in writing: sector, size band, geography, buyer role, signal types that count, suppression list received. Signed by both. | M | **1.0** |
| **1** | Candidate sweep: search + fetch across registry, industry press, job boards, company news pages → 150–250 candidates. Machine ICP scoring. | A | — |
| **1** | Reject-rule tuning after eyeballing the first 40 scores; kill obviously wrong sectors before the expensive stage runs. | M | **1.5** |
| **2** | Signal extraction and typing across surviving candidates; date parsing; 120-day filter; verbatim quote capture. | A | — |
| **2** | Signal review: is this actually an event, or the machine's opinion about a careers page? Downgrade or type it honestly. | M | **2.0** |
| **3** | Contact resolution: named person, role, published route. Every proposed address checked against the fetched page body. | A | — |
| **3** | **The verification pass — the expensive, non-automatable hour.** Every `corrected` flag is set here. ~2–3 min per surviving candidate × ~60. | M | **2.5** |
| **4** | Evidence bundle: re-fetch every cited URL, log status + UTC timestamp + SHA-256, store snapshot. | A | — |
| **4** | 10% spot-check of the bundle by hand; reject log compiled and written up. | M | **1.5** |
| **5** | Gate script over all rows; failures pulled; replacements pulled from the reserve pool. | A | — |
| **5** | Rework the gate failures. This is the day the file becomes shippable. | M | **2.5** |
| **6** | 12 drafts, first pass generated from each row's own signal. | A | — |
| **6** | Rewrite every draft by hand; run the swap test on all 12; kill any that passes it. | M | **2.5** |
| **7** | Package into their column schema, final gate run, deliver. 60-minute handover call. | M | **2.0** |
| | **Total operator time** | | **15.5 h** |

**Unit economics, honestly:** €3,500 ÷ 15.5 h = **€226/h effective**, against direct running cost (search/fetch API + model tokens + storage) estimated at **€70–140 per run** — a figure to *measure on run #1 and publish*, not to assume. Gross margin ≈ **96%**. Proof Ten: 5.5–6.5 h, **€185–218/h**.

**Why that rate is defensible when a Wannado assistant is €42/h:** it is not a labour rate. €3,500 buys 15.5 hours of work **plus a €117-per-row cash liability that the assistant hours do not carry.** State this before the buyer works it out — see the disqualifier in §9.

### Capacity limits — published, and treated as hard

One person cannot run open-ended concurrent audit windows. These constraints are in the terms so a buyer knows why the slot calendar exists:

- **Maximum 2 deliveries per week** (Tuesday and Thursday slots).
- **Maximum 3 open audit windows at any time.** A fourth Signal Run is booked into the next free delivery slot; slots are shown at sale.
- **Replacement SLA is 5 business days, not 3.**
- **Declared blackout weeks**, published at the start of each quarter (Finnish July, exam/travel weeks). No delivery date lands in a blackout week.
- **Ceiling at full load: 8 Signal Runs/month = €28,000 gross.** He should not plan on it; plan on 2–4.

---

## 7. The Wannado structure — distribution and delivery capacity, not a competitor

Wannado is 12 years old, ~60 assistants, 700+ SME clients, published rates €42/h assistant, €38/h outsourced customer service, €75/h digital marketing, €85/h outsourced marketing manager, €142/h strategy. Wannado Marketing Oy has sold *tekoälyoptimointi (GEO)* hourly since 27.05.2026.

Two threats and two assets sit in that paragraph, and one written agreement resolves all four.

**Threat 1 (already handled):** competing on GEO. Routed away — see the boundary rule below.
**Threat 2 (missed in earlier drafts):** the direct substitute for Signal Run is not a GEO agency, it is **80 hours of a Wannado assistant at €42/h = €3,360**, which hand-builds a comparable file. This must be answered explicitly rather than hoped past — see §9.

### The one-page agreement, signed, four clauses

**Clause 1 — The boundary.**
Vincent does not quote, sell or resell GEO / AI-optimointi / AI visibility, to anyone, ever. Every such enquiry is introduced to Wannado Marketing, **free, no referral fee** — the fee is the non-compete. In return, Wannado does not sell verified-signal lead runs under its own brand except at the wholesale price in Clause 3.

**Clause 2 — Wannado is client #1, at cost.**
The first pilot, specifically: **one Signal Run 30 delivered free of charge for one of Wannado's *Kansainvälistyminen* clients** — a Finnish SME entering Germany, Sweden or the USA, which is precisely a company that needs named buyers in a market where it knows nobody, and which Wannado already sells sales and market-research support to.
Consideration instead of cash: **(a)** a named, quotable result approved by the client, released within 30 days of delivery; **(b)** one 20-minute reference call per quarter for four quarters; **(c)** access to one anonymised billing query — *which Wannado clients buy the most assistant hours, on what task* — which answers `ECONOMICS.md`'s qualifying question ("2–3 FTE on one repetitive workflow?") for 700 SMEs from data Wannado already holds. That query is worth more than any cold list Vincent can build.

**Clause 3 — Wholesale, with a floor.**
Wannado may resell Signal Run to its own clients at **€2,450 wholesale** (30% channel discount) on Signal Run 30 and **€4,130** on Signal Run 60, invoiced by Wannado to the client at whatever it likes. **Floor price €2,450 — no discount below it, ever**, because under that the verification pass and the reject log stop being profitable and the entire differentiator dies. 14 days net, Wannado to Vincent, on delivery. Domestic Finnish supply: 25.5% VAT applies both ways.

**Clause 4 — The Send Desk (this is the recurring revenue, and it is not Vincent's).**
Every Signal Run and Standing Run client is offered the human layer **from Wannado, invoiced by Wannado, at Wannado's published rates**: sending and reply handling at €38/h outsourced customer service, calling and follow-up at €42/h assistant, campaign oversight at €85/h. Typical load ~10 h/month ≈ **€420/month**. **Vincent takes 0% margin on those hours.** He is paid in distribution, not commission — which keeps the family relationship clean and removes the "he sells the ingredient and disclaims the meal" objection, because the meal is on the menu, cooked by people who cook for a living.

**IP, stated once and unambiguously.**
Vincent (Aiferno) owns the pipeline, the code, the prompts, the gate scripts and all derivative improvements, in every scenario. **The client owns the delivered data outright**, perpetually, with no licence-back and no restriction. Wannado receives a non-exclusive right to **resell the output**, not the system: no source access, no derivative works, no white-labelling of the software. If Wannado wants the machine itself, that is a Rung 5 Foundation Build at an internal family price of **€19,000**, stated once and never used as a public reference price, licensed for Wannado-internal use with no right to resell the software.

**Governance:** signed, on paper, before the pilot starts. The purpose of writing it down is not distrust; it is that unwritten family arrangements become dinner-table disputes at exactly the moment they start producing money.

---

## 8. What replaces case studies on day one

He has zero named clients, zero testimonials and one prior paid AI consulting engagement. **He says that sentence out loud, first, in every conversation**, because a 22-year-old who volunteers it is believed about everything else. These seven assets replace the case study, and they exist today:

1. **The corrected showcase file** — `leads_showcase.csv`, 32 rows, redacted per §2b#7. The demo, the case study and the deliverable are the same object.
2. **The evidence bundle** — 55 cited URLs, each with status, UTC timestamp, body hash and stored snapshot. The audit is invited, and it survives being taken up.
3. **The reject log** — companies examined and thrown out, with reasons, plus the **9 URLs checked for candidates that never shipped.** *"Nobody fakes their own rejects"* — every reviewer independently named this as the strongest asset in the whole offer.
4. **The correction log** — **8 of 32 (25.0%)** machine-proposed contact routes caught as fabrications, each named specifically. This is a competitor-proof credential: copying it requires publishing your own error rate, and nobody has measured theirs.
5. **The disqualifying ROI calculator** — live at `/en/roi/` and `/fi/laskuri/`, implementing the corrected payback formula from `ECONOMICS.md`, which tells small prospects not to buy and hides the booking button from them. An agency that built a tool to turn business away is a different species from one that did not.
6. **`ECONOMICS.md` itself** — the arithmetic that proved his *own previously published guarantee would fire on deals that went well*, found and published against his own interest. Hand it over. It is the most persuasive document he owns.
7. **The credentials, stated exactly and never embellished:** BSc Data Science & Artificial Intelligence, Maastricht University — **graduated, diploma confirmed 24.08.2026** (thesis: SULO knowledge-graph extraction with a self-correcting pipeline — the same self-correction pattern that produces the correction log); **registered his own business, Aiferno, in 2019 at age 15**; founding shareholder and board member of TopicalBase Oy, a B2B marketplace, 2024–2025; grew up inside a 12-year, ~60-assistant, 700-client services business. **One paid AI consulting engagement. No client case studies. No testimonials.** Never "we." Never a team. Never an implied client.

**The live-audit invitation, which is the actual close:** *"Pick any three rows. I will open the stored snapshot for each one on this call. If any of the three fails, I will tell you which of my own gates it failed and why it shipped anyway."*

---

## 9. The 30-day plan

**Assumption stated honestly:** zero pipeline, zero references, one operator, ~35 working hours available per week.

### Week 1 (days 1–7) — fix the artifact, sign the family agreement, open the warm doors
- **Days 1–2:** all nine §2b pre-flight fixes. Rewrite the offer paragraph in the 12 cold drafts. Publish the corrected numbers on the site. Confirm the Cal.com link resolves and that the Cloudflare Pages lead webhook is actually set (per `PROGRESS.md`, without it the form silently falls back to mailto).
- **Day 3:** contacts 1–3 below.
- **Days 4–5:** Wannado agreement signed; the *Kansainvälistyminen* pilot client named; the billing query run.
- **Days 6–7:** first cold batch, **15–20 mails/day, spread through the day, from a personal address with no sending history.** Contacts 4–10.
- **Target:** 3 walkthrough calls booked, 1 Proof Ten sold. **Cash: €1,200.**

### Week 2 (days 8–14) — deliver, and let them audit
- Deliver Proof Ten #1 (3 days). Send the evidence bundle and invite the audit explicitly.
- Deliver the free Wannado pilot Signal Run 30. Collect the quotable result in writing on delivery day, not later.
- 15–20 cold mails/day continues; second-touch on week-1 non-repliers (one follow-up, never three).
- **Target:** 2 more Proof Tens, first Signal Run 30 sold. **Cash: €2,400 + €1,750 (50% kickoff) = €4,150.**

### Week 3 (days 15–21) — first paid Signal Run, first Density Check
- Deliver Signal Run 30 #1 across the week per §6.
- Convert one Proof Ten to a Signal Run using the €1,200 credit.
- Sell the first Trigger Density Check off a delivered run.
- **Target: Cash: €1,750 balance + €2,300 net upgrade + €600 = €4,650.**

### Week 4 (days 22–30) — convert to cadence, and refill
- Handover calls; Standing Run offered **only** where the Density Check cleared 12/month.
- Ask every delivered client for one introduction — not a testimonial, an introduction. Introductions convert; testimonials from a first client are worth little and cost goodwill to obtain.
- Wannado pilot result written up as the first quotable line; wholesale channel opened to Wannado's account managers with a one-page internal sheet.
- Refill the top of the funnel: 60 first-touches sent in the month, 40 remaining leads staged from `leads-staged.md`.

**Realistic 30-day cash, three scenarios (ex-VAT):**

| | Sold | Cash in 30 days |
|---|---|---|
| **Floor** | 2 Proof Tens | **€2,400** |
| **Base** | 3 Proof Tens + 1 Signal Run 30 + 1 Density Check | **€7,700** |
| **Upside** | 4 Proof Tens + 2 Signal Runs + 1 Density Check + 1 Standing Run month | **€16,900** |

Base case exit rate into month 2: 1 Standing Run (€2,400/mo) + a slot calendar with 2–3 Signal Runs booked. **No €58,500 first-month projection appears anywhere in this document, because there is no honest way to produce one.**

### The first ten people, in order

Odds first, cold last. Contacts 4–10 are drawn from `leads.csv` and are all `icp_fit = strong`; contact routes are as verified in the file.

| # | Who | Route | Why first | Instrument |
|---|---|---|---|---|
| 1 | **KP Liimatainen** | address in the July 2025 Gmail thread | The single genuinely warm contact in 14 months of mail. Five messages, real back-and-forth, progressed to scheduling Teams calls, then went quiet ~13 months ago. He wrote that no *täsmä tarjoaja* exists for the Nordic market. He already wanted to build with Vincent. | `.ops/outreach/00-warm-liimatainen.md`. Personal, never templatised. Angle: *"I graduated, I packaged it, here is a finished thing I could not have shown you last year."* |
| 2 | **Wannado — managing director (family)** | in person | Clauses 1–4 of §6, the pilot, and the billing query. Worth more in expected value than the entire cold list. Costs one meeting. | `.ops/outreach/01-channel-wannado.md`. Frame as throughput, never replacement: *one SuperAssari carries two or three clients at the same billed rate.* |
| 3 | **Wannado Marketing — managing director** | in person / phone | The GEO non-compete and the two-way referral. Removes the commodity trap and the family conflict in one conversation. | One page, Clause 1. |
| 4 | **Antti Voittonen**, Kasvu- ja kehitysjohtaja, Balanco Oy | `antti.voittonen@balanco.fi` — `exact` | Owns 16% of the group, runs the acquisitions, and Balanco's own 17.08.2026 headline says a technology shift drove the Accotilit deal. Highest-value single message in the folder. | `.ops/outreach/02-balanco-buybox.md`. **Do not pitch generic AI — they have an AI director.** Pitch the acquisition target buy-box. |
| 5 | **Roope Oksanen**, Apuvoima Pirkanmaa Oy | `roope.oksanen@apuvoima.com` — `exact` | Strong fit; launched a second staffing brand (Hunaja Works) — a founder in expansion mode, needing buyers in a new market. | `.ops/outreach/21-apuvoima.md`, offer paragraph updated to Proof Ten. |
| 6 | **Pasi Pesonen**, Isännöintipalvelu Isarvo Oy | `pasi.pesonen@isarvo.fi` — `exact` | Continuous, published back-office recruiting — the `standing_condition` signal that `ECONOMICS.md` says is the real qualifier. | New draft off the Isarvo row. |
| 7 | **Matti Tuominen**, LTP Logistics Oy | `matti.tuominen@ltplogistics.fi` — `exact` | Cut 21 of 116 people in a year: a capacity squeeze with no new headcount coming. | **Fix the paywalled size claim first (§2b#4)** — do not cite a page that does not prove the number. |
| 8 | **Kalle Grönqvist**, Fluxio Group | contact form, `fluxiogroup.fi` | 280+ staff, hiring a bookkeeper to do *lainaosuuslaskenta* and *ostoreskontra* by hand. The cleanest agent-shaped pain in the file. | Form message, short, one question. Lower reply odds than email — send it, expect less. |
| 9 | **Ilkka Saarimaa**, ATA Gears Oy | `+358 44 333 3919` — `exact` | A €17M machinery and automation investment underway right now. | **Phone, not email.** A phone-only row is a call, not a mail-merge. |
| 10 | **Jarmo Manninen**, Tocca Group Oy | `+358 40 593 7474` — `exact` | Growth eating margin across four duplicated back offices. | **Phone.** |

*Reserve, in order:* Mikko Vihanto (Varova, phone — fix the paywalled size claim first), Vesa Keskilä (V-S Isännöintitalo, switchboard — call), Janne Eurén (Festum — **only after row 1 is fixed**; and note the published route is `info@festum.fi`, a front desk, so treat it as a call).

**Handling rule for front-desk rows:** 4 of the 32 rows resolve to `info@` / `toimisto@` and 10 to switchboard numbers. Those are **calls, not emails**, and they are labelled as such in the delivered file. Never present a switchboard number as a "verified route to the decision-maker" — that claim is checkable in ninety seconds by anyone with a receptionist, and being caught on it costs more than the row is worth.

---

## 10. What he must NOT do

1. **Do not launch a GEO / AI-optimointi / AI-näkyvyys retainer.** Verified live pricing: Silta AI **€149/mo** (claiming *"yli 300 yritystä luottaa meihin"*), Markkinointi Ukkonen from **€150/mo**, Frank **€390–600** starter to **€1,500–2,500+** full, plus Netello (25 years of SEO), Grapevine, Brandteam. A solo entrant at €150–500/mo needs 50+ retained clients to earn a living, in a volume business, as the least-credentialled participant. Route every enquiry to Wannado Marketing, in writing, and take no fee for it.
2. **Do not build the free AI-visibility report as a lead magnet.** Frank already leads with exactly that. The position is taken; the artifact walkthrough is the better magnet and nobody else can offer it.
3. **Do not mention €29k / €49k / €79k in a first email or a first call.** From a seller with one paid engagement, it makes the €1,200 look like bait. The Build exists at the top of the ladder specifically so it is never the first number said.
4. **Do not quote a number he has not recomputed that morning.** The "62" cost him three reviewers' confidence in four minutes. One wrong count kills an offer whose entire premise is "count it yourself."
5. **Do not write a gate his own showcase fails.** Every contractual gate in §4 was rewritten to what the file actually produces (14 dated / 11 period / 7 standing), not to what sounds impressive.
6. **Never let a buyer keep a fully refunded file**, and never give unconditional buyer's-choice refunds past the third row. Both were free-run exploits; §5 closes them.
7. **Never guarantee a fixed monthly volume of other companies' news.** Sell the Density Check first and let it say no. Month 3 collapse on a working system is how a good product acquires a bad reputation.
8. **Do not exceed 3 open audit windows or 2 deliveries per week**, and declare blackout weeks in advance. A solo operator with four overlapping SLAs and one bout of flu refunds everyone simultaneously.
9. **Do not send the raw `leads.csv` to anyone.** It contains his own deal-size estimates, his private hypotheses about named Finnish companies, and lines like *"DO NOT PITCH AI: they have an AI director."* Ship the redacted showcase copy only, with the DPA attached.
10. **Do not compete with a Wannado assistant on price.** 80 hours at €42/h is €3,360 and produces a comparable file. When a prospect works this out — and one will — the answer is a disqualifier, not a defence: *"If what you want is a list, buy 80 assistant hours from Wannado, it is €3,360 and they are good at it. What I sell is the same list with a €117-per-row refund attached and my own fabrication rate published. If that liability is not worth €140 to you, buy the hours and I will introduce you."*
11. **Never claim experience he does not have.** No "clients," no "we," no implied team, no invented case study, no "trusted by." One paid engagement, zero named clients, zero testimonials — said first, in his own words, every time.
12. **Never write another uncapped or unmetered guarantee.** `ECONOMICS.md` already proved the last one would have fired on deals that went well. Every guarantee gets a cap, a metric, a named measurer and an end date.
13. **Do not discount below €2,450** (Signal Run 30 wholesale floor). Under it, the verification pass and the reject log — the only two things a €390/mo competitor cannot copy — stop paying for themselves.
14. **Do not take a Build from a client who has not first bought and audited a Signal Run.** A fixed-price €29k build for a stranger, delivered solo, against an undocumented ERP, is the one mistake in this document that cannot be recovered from.

---

## 11. One-page summary for the wall

| Rung | Price | Days | Gross margin | First-30-day realistic count |
|---|---|---|---|---|
| Artifact Walkthrough | €0 | 0.5 | — | 6–10 |
| **Proof Ten** | **€1,200** | 3 | ~96% | **3** |
| **Signal Run 30** | **€3,500** | 7 | ~96% | **1** |
| Signal Run 60 | €5,900 | 12 | ~95% | 0 |
| Trigger Density Check | €600 | 2 | ~93% | 1 |
| Standing Run | €2,400/mo | rolling | ~94% | 0–1 (month 2) |
| Install Sprint | €4,500 | 10 | ~90% | 0 |
| Build — Foundation / Core / Sovereign | €29k / €49k / €79k | 45 / 75 / 110 | 80–88% | 0 |

**Sell the strike list and the refund, not the row count. Sell the €1,200 door, not the €29,000 room. Route GEO to Wannado, in writing, on day three. And never say a number you have not recounted that morning.**