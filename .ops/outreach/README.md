# Outreach — rules, sequencing, and how to send these

**Nothing in this folder has been sent.** Every draft is prepared to
one-click-send state and waits for Vincent. Sending cold mail from his address
is outward-facing and hard to reverse: a bad first batch burns both the domain
reputation and the prospect. He approves each batch.

---

## Legal basis (checked, not assumed)

**Finland.** The Act on Electronic Communications Services (917/2014):
- **§202** — electronic direct marketing **to an organisation** is permitted
  *unless the organisation has expressly opted out*. No prior consent needed.
- **§200** — direct marketing **to a natural person** requires prior consent.

So: mail addressed to a company in its business capacity is lawful on an
opt-out basis. Every message must still carry a working opt-out line, and
under GDPR Art. 6(1)(f) the legitimate-interest basis needs the mail to be
genuinely relevant to that company's business. Prefer published role addresses
(`info@`, `myynti@`, a contact form) over an individual's personal work
address; where a named person is used, address them in their business role.

**United States.** CAN-SPAM permits cold B2B email provided: headers and the
"from" line are accurate, the subject is not deceptive, a valid physical
postal address is included, and opt-out is honoured within 10 business days.

**Practical consequence:** every draft here ends with a one-line opt-out and,
for US recipients, a postal address. Do not delete those lines.

Sources: [DLA Piper — Electronic marketing in Finland](https://www.dlapiperdataprotection.com/?t=electronic-marketing&c=FI),
[Lexology — Electronic marketing and internet use in Finland](https://www.lexology.com/library/detail.aspx?g=55ae3cb9-542d-4341-92dd-b848ea17e3dc)

---

## Send order — best odds first

Work top to bottom. Do not start at the cold list.

1. **`00-warm-*.md` — the warm re-open.** One dormant thread from July 2025 with
   someone who already wanted to build an AI product with Vincent. Highest
   probability of a reply in the whole set. Send this first, personally, and
   do not templatise it.
2. **`01-channel-*.md` — Wannado as a channel.** Wannado already sells AI
   services and already runs an AI funding-analysis bot, and has ~700 SME
   clients. This is an internal conversation, not outreach: one packaged
   offer sold *through* the family business beats 100 cold emails. Costs
   nothing, and the trust is already there.
3. **`1x-*.md` — verified cold leads**, in the tier order set by the lead list.

## Volume discipline

Send **no more than 15–20 cold mails per day** from a personal address, and
send them in small batches spread over the day. A sudden burst of 100 from an
address with no sending history is the fastest way to land in spam and poison
the domain for every future message.

## What makes these drafts different

Each cold draft opens with the **specific observed trigger** for that company —
a job posting, a funding round, a published service page — not a generic
compliment. If a draft's first line could be pasted into a different company's
email unchanged, it is a bad draft and should be rewritten.

## The one number to put in front of them

From `.ops/ECONOMICS.md`: the qualifying question is not company size, it is
**whether they have 2–3 full-time-equivalent people on one repetitive
workflow.** Every draft should reference the specific workflow believed to
be costing them that, and invite correction. Being wrong about it out loud
starts a better conversation than being vague.

## Before sending anything

1. Confirm the Cal.com link works: <https://cal.com/vincent-viitala-xkqj0c/30min>
   (it could not be verified from the build environment — Cal.com blocks crawlers).
2. Set `LEADS_WEBHOOK` or `RESEND_API_KEY` in the Cloudflare Pages dashboard so
   the contact form delivers server-side. Until then it falls back to mailto,
   which works but is a worse experience for someone you just emailed.
3. Re-read `.ops/OFFER.md` — in particular the guarantee wording. Do not send
   outreach quoting the current uncapped guarantee.
