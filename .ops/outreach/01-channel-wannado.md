# 01 — The Wannado channel (internal). Highest-value play in this whole folder.

**This is not outreach. It is a conversation to have at home.** It is placed
second only because the warm re-open takes five minutes and this takes a
meeting. In expected value it is worth more than the entire cold list.

---

## The facts, verified from Wannado's own pages (not assumed)

Fetched from `wannado.fi` and `wannado.fi/hinnasto/`:

| Service | Published rate |
|---|---|
| Assistant services (*virtuaaliassari*) | **from €42/h** |
| Outsourced customer service | **from €38/h** |
| Personnel services | from €42/h |
| Outsourced marketing manager | from €85/h |
| Strategy & development | from €142/h |

Their own description of the assistant product, verbatim:

> *"Kaikki rutiinityöt, mitkä hoituu ilman kummempaa koulutusta ja wifin
> välityksellä."*
> (All routine work that can be done without special training, over wifi.)

And the model, verbatim: *"Maksat vain tehdystä työstä"* — billed hourly,
*"minuuttien tarkkuudella"*, no commitments, 12 years of operation, ~60
assistants, 700+ SME clients.

They also already sell AI: Wannado Marketing Oy lists **"tekoäly"** among its
services, and `hinnasto/` carries a live AI funding-analysis bot
(*"Haluatko maksuttoman analyysin yrityksesi rahoitusmahdollisuuksista?
Vastaa noin 20 kysymykseen…"*).

## Why this matters more than any cold lead

Three things follow from those facts, and each is worth more than a lead list.

**1. Wannado's product is literally the thing agents automate.**
A company whose core offering is "humans doing routine work over wifi, billed
by the minute" is the purest possible fit for agent infrastructure. Vincent
does not have to explain the problem — they sell the problem.

**2. Wannado's invoicing system already contains a pre-qualified lead list.**
`.ops/ECONOMICS.md` establishes that the qualifying question is *"do they have
2–3 FTE on one repetitive workflow?"* — which is normally hard to see from
outside a company. Wannado can answer it exactly, for 700 SMEs, from billing
data it already holds: **which clients buy the most assistant hours, on what
kind of task.** A client buying 20 h/week of assistant time is spending
~€37,800/year (42 × 20 × 45) on outsourced routine work, with the hours
already itemised. That is a better-qualified list than anything cold research
can produce, and it costs one database query.

**3. The obvious objection has a real answer.**
Agents cannibalise billable assistant hours, so the naive pitch — "let me
automate your assistants away" — attacks their revenue and will be refused,
correctly. The right framing is throughput, not replacement:

> An agent does not remove the SuperAssari. It lets one SuperAssari carry
> two or three clients instead of one, at the same billed rate.

At an hourly-billing model, capacity recovered is margin. Illustratively — and
these are *assumptions to replace with Wannado's real figures, not claims*:
60 assistants × 1,000 billed hours × €42 ≈ €2.5M of billed work. Recovering
even 15% of that capacity for higher-value hours is worth several hundred
thousand euros a year, against a build in the €25–60k range.

## The ask

Not "let me sell to your clients". In order:

1. **Make Wannado itself client #1.** One workflow, one build, run inside the
   family business, measured honestly. This solves the single biggest problem
   Vincent has — he has no case study — and it solves it with a client who
   will not sue him, on a workflow he can observe directly.
2. **Then productise it.** The same agent, sold once, replicates across
   Wannado's clients who share the workflow. That is the "many verifiable
   pieces" shape that scales; a bespoke €40k build per SME is not.
3. **Ask for the billing cut, not for introductions.** The specific ask:
   *"Which ten clients bought the most assistant hours last year, and on what
   task?"* That question is answerable in an afternoon and is worth more than
   a month of cold outreach.
4. **Agree the commercial terms before building anything.** Family business or
   not, write down who owns the IP, whether Vincent may sell the same agent to
   non-Wannado clients, and what he is paid. Undocumented family arrangements
   are how founders lose their own work. Do this first, not after it succeeds.

## Talking points for the conversation

- Lead with their own numbers, not the technology. €42/h × the hours their
  biggest client buys = the size of the prize, in their language.
- Name the cannibalisation risk yourself, before they do. Raising it first is
  what makes the throughput framing credible rather than evasive.
- Point at the funding-analysis bot: they already proved they will ship an AI
  product to their own audience. This is the second one, not the first.
- Ask for one workflow, not a transformation. A finished small thing beats a
  proposed large thing, especially inside a family business where a failed
  large thing is awkward at Christmas.

## What NOT to do

- Do not present the €25–60k Build and €2–6k/month retainer as-is internally.
  Per `.ops/ECONOMICS.md`, that retainer structure is wrong for a single
  workflow anyway, and pricing a family business off a public rate card starts
  an argument about the number instead of the work.
- Do not promise a headcount reduction. It is the wrong goal, it frightens the
  assistants, and it is not where the money is.
