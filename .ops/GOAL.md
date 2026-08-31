# GOAL — never edited

## Owner
Vincent Viitala — vincent@wannado.fi / viitala.vincent@gmail.com
Site: vincentviitala.com (repo: IntegrationBytes/MyWebsite)

## Goal
Two deliverables, both verifiable:

A. **Website converts.** vincentviitala.com turns qualified SME traffic into
   booked strategy calls. Not "looks better" — measurably instrumented,
   with a single dominant conversion action per page and a working lead
   capture path that does not silently drop submissions.

B. **A real, contactable lead list.** Named SME decision-makers in Finland
   and the US who plausibly buy a €25–60k agent build + €2–6k/mo retainer,
   each with: real company, real named person, publicly-published contact
   route, a source URL proving both, and a specific observed trigger
   (why them, why now).

## Verification — the ONLY definition of done

    bash .ops/verify.sh

Success: exit code 0 and the line `VERIFY: PASS` printed.
Every individual check inside must print PASS.

I do not decide when this is done. That script decides.

## Hard constraints (violating any = the work is worthless)
1. **No invented people, companies, emails, or URLs.** Every lead's source
   URL must have been actually fetched and returned real content. A lead
   with an unverified contact route is not a lead.
2. **No invented metrics or client results on the website.** Vincent has
   one prior AI consulting engagement (Aiferno) and no named client
   case studies. The site must never imply otherwise.
3. **No outreach is SENT without Vincent's explicit per-batch approval.**
   Drafts are prepared to one-click-send state. Sending is his call.
4. Never weaken, skip, or delete a check in verify.sh to make it pass.
5. Never report a result not actually observed in command output.
