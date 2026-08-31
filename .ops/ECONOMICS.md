# Offer economics — the numbers behind who can actually buy this

Derived while building the ROI calculator, then checked by hand. This is the
most consequential finding of the session, and it is arithmetic, not opinion.

## The correction that started it

The obvious payback formula is `(build + 12 × retainer) ÷ monthly saving`.
That formula is wrong, and it flatters the offer.

The retainer does not stop after a year. It recurs for as long as the agents
run, so it must be netted off the monthly saving **before** the build fee
begins repaying:

    payback (months) = build ÷ (monthly net saving − monthly retainer)

If the retainer is larger than the monthly saving, payback never arrives at all
— a case the naive formula hides completely.

**Worked example.** 4 people × 15 h/week on invoice processing at €30/h gross:
- Manual cost: **€113,400/year** (45 working weeks, wages × 1.4 fully loaded)
- Net saving after 18% agent running + human review cost: **€51,143/year** = €4,262/month
- At a €3,000/month retainer, surplus = **€1,262/month**
- Build payback on €35k = **28 months**, not the 17 the naive formula gives.

Sensitivity at that same workflow size:

| Retainer | Monthly surplus | Build payback |
|---|---|---|
| €2,000 | €2,262 | 15 months |
| €3,000 | €1,262 | 28 months |
| €4,000 | €262 | 134 months |
| €6,000 | −€1,738 | **never** |

## What this means: the ICP is narrower than "SMEs"

Manual workflow value needed for a **12-month** build payback:

| Build | Retainer | Document work | Data entry | Email/quoting | Support |
|---|---|---|---|---|---|
| €25k | €2k | €109k | €100k | €149k | €171k |
| €25k | €3k | €135k | €124k | €186k | €213k |
| €35k | €3k | €157k | €144k | €216k | €247k |
| €60k | €3k | €213k | €195k | €293k | €334k |
| €60k | €6k | €293k | €268k | €402k | €460k |

At a fully-loaded €42/h, one FTE ≈ €71k/year. So:

> **The qualifying question is not "how big is the company".
> It is: do they have at least 2–3 full-time-equivalent people on ONE
> repetitive workflow?**

That is a far sharper targeting filter than employee count or revenue, and it
is often observable from the outside — job postings for the same back-office
role repeated, a named team ("invoice processing team"), published service
descriptions.

## Three consequences for the offer as currently published

1. **The €6k/month top of the retainer band is unsellable against a single
   workflow.** It only works once several agents are live and the savings base
   has compounded. It should be priced as a function of agents in production,
   not offered up front.

2. **The guarantee is likely to trigger on normal deals, not just bad ones.**
   The site currently promises: *"If the first agent I ship during the Build
   hasn't paid for itself within 12 months of running, I keep refunding the
   AgentOps retainer until it does."* The table above shows that a **€113k/year
   workflow — a genuinely large one — does not repay a €35k build within 12
   months at a €3k retainer.** So the guarantee would fire on a deal that went
   well. Combined with having no cap, no defined success metric, no named
   measurer and no end date, this is the single largest commercial risk on the
   site. It needs a hard cap, a defined metric, and a defined measurement owner
   before it is shown to another prospect.

3. **Lead with build-only for smaller clients.** For a workflow in the
   €60k–€120k range, a build with no retainer (or a much smaller support fee)
   pays back fast and honestly. Attaching a €3k/month retainer to that size of
   client turns a good deal into a bad one, and a smart buyer will see it.

## How this is reflected on the site
`/en/roi/` and `/fi/laskuri/` implement the corrected formula, show the monthly
surplus explicitly, and return a "the retainer would eat the entire saving"
verdict when surplus ≤ 0 — telling the visitor to ask for a build-only
engagement instead. Every assumption is printed on the page.
