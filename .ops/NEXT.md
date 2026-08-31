# NEXT — the single next attempt, written BEFORE attempting it

## Where this stands
`bash .ops/verify.sh` → **VERIFY: PASS**. The offer changed mid-session from
cost-side agent builds to **Signal Run** — selling a checkable file rather than
monthly labour. See `.ops/OFFER.md`; the old build survives as Rung 5 in
`.ops/OFFER-build-rung5.md`; the market reasoning is in `.ops/MARKET.md`.

## Next attempt — the pre-flight in OFFER.md §2b

The offer's whole differentiator is *"audit me."* Four errors in the artifact
have already been found and fixed (the 62-vs-55 URL count, the Festum quote that
contained the address it disproved, two paywalled size claims, and 31 rows still
priced against the abandoned offer). §2b lists what remains, roughly six hours:

1. **Build `leads_showcase.csv`** — a redacted copy for prospects. Drop
   `est_deal_size` and `pain_hypothesis`; drop private commentary such as the
   Balanco note *"DO NOT PITCH AI."* **Keep `verification_note`** — that column
   is the product. Handing a stranger the raw file publishes his pricing model
   and his private opinions about named Finnish companies.
2. **Strengthen `url_check.txt` into a real evidence bundle** — per URL: fetch
   timestamp, HTTP status, body hash, stored snapshot. Right now it records that
   a page was fetched and matched the company, which is honest but thinner than
   "audit me" implies, and the §5 guarantee is arbitrated on those snapshots.
3. **Type the trigger field** — `trigger_type` ∈ {`dated_event`, `period_event`,
   `standing_condition`} plus `trigger_date`. The self-run is 14 / 11 / 7. The
   acceptance gates in §4 must promise what the machine actually produces; the
   earlier draft's "every trigger dated within 120 days" is a gate his own
   showcase fails.
4. **Write the one-page DPA / processing note.** He circulates named
   individuals' business contact data with commercial profiling attached.
   "Available on request" means it does not exist.

## Then
5. Rewrite the three offer-bearing pages (`/en/services/`, `/fi/palvelut/`,
   `/es/servicios/`) around the Signal Run ladder. They still sell the old
   cost-side offer, so the site currently contradicts `OFFER.md`.
6. Merge the 39 staged leads (`.ops/leads-staged.md`) against the **new** ICP —
   the five questions in `.ops/LEADS-RERANK.md`, not the old FTE test. Note the
   rule that fell out of the re-rank: the buyer's own ICP must be
   Finland-resident, because the pipeline has only ever been run on Finnish
   sources. That demotes ATA Gears, Hydroline and Eilakaisla out of Tier A.
7. Write buy-box drafts for the remaining acquirers (TANOMA, Asuntopehtoori,
   Tietomylly, Fluxio, Festum) on the Balanco pattern.

## Do NOT
- Do not send anything. Drafts only; Vincent approves each batch.
- Do not build a monthly GEO/AI-visibility retainer. `.ops/MARKET.md` documents
  why: €149–390/month incumbents, and Wannado Marketing already sells it.
- Do not send the Balanco draft without the three real sample targets attached.
  The samples are the product; the email is the wrapper.
- Do not quote any `UNVERIFIED_third_party` size figure back to a company.

## Open questions for Vincent
1. **Approve outreach batches?** Everything waits on him.
2. **Is the Cal.com link live?** Still unverified from here — Cal.com blocks
   crawlers. Every CTA on the site points at it.
3. **Set `LEADS_WEBHOOK` or `RESEND_API_KEY`** in Cloudflare so the form
   delivers server-side instead of falling back to mailto.
4. **Wannado conversation** — the wholesale structure in `OFFER.md` §7 needs his
   family's agreement on IP and payment terms before anything is built on it.
