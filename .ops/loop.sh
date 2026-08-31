#!/usr/bin/env bash
# Layer 2: the restartable loop.
#
# A single Claude session cannot run all night — context windows and cloud
# sessions both cap out. This gives each iteration a FRESH context and carries
# state in files instead, exiting the moment verification passes.
#
#   bash .ops/loop.sh          # up to 40 iterations
#   MAX=10 bash .ops/loop.sh   # or fewer
#
# Run it inside tmux on a VPS, or as a scheduled task:
#   tmux new -d -s vv 'bash .ops/loop.sh 2>&1 | tee .ops/loop.log'
#
# --dangerously-skip-permissions is only safe inside an isolated VM or
# container. That isolation is the actual price of running unattended.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
MAX="${MAX:-40}"

PROMPT='Read .ops/GOAL.md, .ops/PROGRESS.md, .ops/ATTEMPTS.md and .ops/NEXT.md.
Do exactly ONE iteration of the loop defined in .ops/GOAL.md, then stop:
 1. Attempt what NEXT.md says.
 2. Run: bash .ops/verify.sh   and record the REAL output.
 3. Append to ATTEMPTS.md: the approach, the actual result, what you learned.
 4. Update PROGRESS.md with the current best state.
 5. Write the single next attempt into NEXT.md. Never leave NEXT.md without one.
 6. git add -A && git commit && git push -u origin claude/durable-state-loop-78gh5c

Anti-cheating rules, absolute:
 - Never modify verify.sh to make it pass. Never weaken or delete a check.
 - Never invent a company, person, email or URL. Every lead needs a source URL
   you actually fetched. An unverified contact route is not a lead.
 - Never claim a result you did not observe in real command output.
 - Never send email or contact anyone. Prepare drafts only; Vincent sends.
 - If the same approach has failed 3 times, record it in ATTEMPTS.md as
   EXHAUSTED and put a structurally different approach in NEXT.md.
 - "This is harder than expected" is not a stopping condition.
 - If genuinely blocked, write the specific blocker in NEXT.md as a question
   for Vincent, then keep working on any other part of the goal.'

for i in $(seq 1 "$MAX"); do
  echo ""
  echo "════════ iteration $i/$MAX ════════"
  claude -p "$PROMPT" --dangerously-skip-permissions
  if bash .ops/verify.sh | tail -1 | grep -q '^VERIFY: PASS$'; then
    echo ""
    echo "✅ VERIFY: PASS on iteration $i — stopping."
    exit 0
  fi
  echo "── still failing, continuing ──"
done

echo ""
echo "⏹  Reached MAX=$MAX iterations without passing."
echo "   Read .ops/ATTEMPTS.md — the map of what was tried is the deliverable."
bash .ops/verify.sh
exit 1
