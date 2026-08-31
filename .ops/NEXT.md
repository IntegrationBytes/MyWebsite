# NEXT — the single next attempt, written BEFORE attempting it

## Next attempt
Wait for the two running workflows, then land their output:

1. When `lead-hunt` (wf_33f89bfb-eb5) returns: write every surviving lead to
   `.ops/leads.csv` with the exact columns verify.sh requires, then
   **independently re-check every `source_url`** with a real fetch and write the
   result to `.ops/url_check.txt` (one line per URL, the word `DEAD` on any that
   fails). Do not take the sweep agents' word for it — the verification pass
   inside the workflow is a second opinion, not proof, and section I exists
   precisely to stop unverified URLs reaching Vincent.

2. When `offer-and-convert` (wf_4119c54b-f5f) returns: write `.ops/OFFER.md`.
   Check its guarantee wording against `.ops/ECONOMICS.md` before accepting it —
   any guarantee that can fire on a *successful* deal is wrong regardless of how
   well it is written. It needs: a hard cap in euros, a defined success metric,
   a named measurer, a measurement cadence, an end date, and voiding conditions.

3. Then write one outreach draft per Tier A/B lead into `.ops/outreach/`,
   starting with `00-warm-*` (the dormant July 2025 thread) and `01-channel-*`
   (Wannado). Every draft opens with that company's specific observed trigger.
   If a draft's first line would work for a different company unchanged, it is
   a bad draft — rewrite it.

4. Re-run `bash .ops/verify.sh`. Fix whatever still fails.

## Do NOT do
- Do not send any email. Drafts only. Vincent approves each batch.
- Do not invent a lead, a person, an email, or a URL to make section H pass.
  Thirty real leads is the target; twelve real leads and an honest note beats
  thirty with eighteen fabrications, and fabrication makes the whole list
  worthless because he cannot tell which ones are real.
- Do not quote the current uncapped guarantee in any outreach draft.

## Open questions for Vincent (blockers, but nothing waits on them)
1. **Approve outreach batches?** Everything is prepared to one-click-send.
   Sending cold mail from your address is outward-facing and hard to reverse,
   so it waits for you.
2. **Is the Cal.com link live?** <https://cal.com/vincent-viitala-xkqj0c/30min>
   could not be verified from this environment (Cal.com blocks crawlers, and
   the egress proxy blocks direct fetches). Five-second check for you, and
   everything downstream depends on it.
3. **Set `LEADS_WEBHOOK` or `RESEND_API_KEY`** in the Cloudflare Pages dashboard
   so the form delivers server-side instead of falling back to mailto.
4. **The guarantee needs a decision from you**, not from me — it is your
   liability. See `.ops/ECONOMICS.md` §"Three consequences".
