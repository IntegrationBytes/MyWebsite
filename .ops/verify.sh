#!/usr/bin/env bash
# The ONLY definition of done. Never weaken a check to make it pass.
cd "$(dirname "$0")/.." || exit 1
FAIL=0
ok(){ printf '  PASS  %s\n' "$1"; }
no(){ printf '  FAIL  %s\n' "$1"; FAIL=1; }
sec(){ printf '\n== %s ==\n' "$1"; }

PAGES=$(find en fi es -name index.html | sort)

sec "A. SITE — lead capture must not silently drop leads"
# The form must not be able to "succeed" without a delivery endpoint.
BAD=0
for f in en/contact/index.html fi/ota-yhteytta/index.html es/contacto/index.html; do
  [ -f "$f" ] || { no "$f missing"; BAD=1; continue; }
  # A form whose success message fires regardless of endpoint = silent drop.
  if grep -q 'if (window.LEADS_WEBHOOK_URL)' "$f"; then no "$f: success shown even with no endpoint (silent lead drop)"; BAD=1; fi
  grep -q 'assets/js/leads.js' "$f" || { no "$f: does not load leads.js (the module that refuses to fake success)"; BAD=1; }
  grep -q 'mailto:' "$f" || { no "$f: no direct-email fallback"; BAD=1; }
done
grep -q 'LEADS_ENDPOINT' assets/js/config.js || { no "config.js defines no LEADS_ENDPOINT"; BAD=1; }
grep -q 'r.ok' assets/js/leads.js || { no "leads.js does not gate success on a 2xx response"; BAD=1; }
[ -f functions/api/lead.js ] || { no "no server-side delivery function"; BAD=1; }
[ $BAD -eq 0 ] && ok "all 3 forms load leads.js, gate success on 2xx, and fall back to mailto"

sec "B. SITE — every page has one primary CTA and it resolves"
BAD=0
for f in $PAGES; do
  grep -q 'cal.com\|BOOK_URL\|data-cal-link\|cal-inline\|href="/en/contact\|ota-yhteytta\|/contacto\|#contact' "$f" || { no "$f: no path to booking"; BAD=1; }
done
[ $BAD -eq 0 ] && ok "every page carries a booking CTA"

sec "C. SITE — no broken internal links"
BAD=0
for f in $PAGES 404.html index.html; do
  for href in $(grep -o 'href="/[^"#?]*"' "$f" | sed 's/href="//;s/"//' | sort -u); do
    p=".${href}"
    [ -d "$p" ] && p="${p%/}/index.html"
    case "$href" in */) : ;; esac
    if [ ! -e "$p" ] && [ ! -e ".${href}/index.html" ] && [ ! -e ".${href}" ]; then
      no "$f -> $href (missing)"; BAD=1
    fi
  done
done
[ $BAD -eq 0 ] && ok "all internal links resolve"

sec "D. SITE — analytics + meta on every page"
BAD=0
for f in $PAGES; do
  grep -q 'umami\|config.js' "$f" || { no "$f: no analytics"; BAD=1; }
  grep -q 'name="description"' "$f" || { no "$f: no meta description"; BAD=1; }
  grep -q 'og:title' "$f" || { no "$f: no OG tags"; BAD=1; }
done
[ $BAD -eq 0 ] && ok "analytics + description + OG on every page"

sec "E. SITE — conversion instrumentation is wired"
BAD=0
grep -q 'trackEvent\|data-umami-event' assets/js/config.js 2>/dev/null || { no "no event-tracking helper in config.js"; BAD=1; }
CNT=$(grep -ro 'data-umami-event' --include=*.html . | wc -l | tr -d ' ')
[ "$CNT" -ge 15 ] || { no "only $CNT tracked CTAs (need >=15)"; BAD=1; }
[ $BAD -eq 0 ] && ok "conversion events instrumented ($CNT tracked elements)"

sec "F. SITE — no unverifiable claims"
BAD=0
if grep -rniE 'trusted by [0-9]|[0-9]+\+? (happy )?clients|[0-9]+ companies served|case stud(y|ies) *:' --include=*.html en fi es 2>/dev/null | grep -v 'no case stud' | head -3 | grep -q .; then
  no "unverifiable client-volume claim found"; BAD=1
fi
grep -rq 'lorem ipsum\|TODO\|FIXME\|Lorem' --include=*.html en fi es && { no "placeholder text shipped"; BAD=1; }
[ $BAD -eq 0 ] && ok "no fabricated social proof or placeholders"

sec "G. SITE — ops files are not publicly served"
BAD=0
grep -q '/.ops/' _redirects || { no "_redirects does not block /.ops/"; BAD=1; }
[ $BAD -eq 0 ] && ok "ops state blocked from public serving"

sec "G2. SITE — crawlability"
BAD=0
[ -f sitemap.xml ] || { no "robots.txt advertises a sitemap that does not exist"; BAD=1; }
grep -q 'sitemap.xml' robots.txt || { no "robots.txt does not reference sitemap"; BAD=1; }
python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('sitemap.xml')" 2>/dev/null || { no "sitemap.xml is not valid XML"; BAD=1; }
grep -q 'noindex' en/v2/index.html || { no "orphan /en/v2/ is indexable and competes with /en/"; BAD=1; }
[ $BAD -eq 0 ] && ok "sitemap valid, robots correct, orphan page deindexed"

sec "H. LEADS — file exists and is well-formed"
L=.ops/leads.csv
if [ ! -f "$L" ]; then no "leads.csv missing"; else
  # Count PARSED CSV rows, not lines: quoted fields contain newlines, so wc -l
  # over-counts wildly and would pass this check with a fraction of the leads.
  ROWS=$(python3 -c "import csv,sys;print(sum(1 for _ in csv.DictReader(open('$L',newline='',encoding='utf-8'))))")
  [ "$ROWS" -ge 30 ] && ok "$ROWS leads present (need >=30)" || no "only $ROWS verified leads (need >=30)"
  HDR=$(head -1 "$L")
  for col in company country person role contact_route source_url trigger icp_fit; do
    echo "$HDR" | grep -q "$col" || no "leads.csv missing column: $col"
  done
  # no empty required cells
  python3 - "$L" <<'PY'
import csv,sys
req=["company","country","person","role","contact_route","source_url","trigger","icp_fit"]
bad=0;seen=set();n=0
with open(sys.argv[1],newline='',encoding='utf-8') as f:
    for r in csv.DictReader(f):
        n+=1
        for c in req:
            if not (r.get(c) or "").strip():
                print(f"  FAIL  row {n} ({r.get('company','?')}): empty {c}");bad=1
        if not (r.get("source_url","")).startswith("http"):
            print(f"  FAIL  row {n}: source_url not a URL");bad=1
        k=(r.get("company","").strip().lower())
        if k in seen: print(f"  FAIL  duplicate company: {k}");bad=1
        seen.add(k)
print("  PASS  all lead rows complete, unique, with http source_url" if not bad else "")
sys.exit(bad)
PY
  [ $? -ne 0 ] && FAIL=1
fi

sec "H2. LEADS — no size claim leans on an unchecked source"
python3 - <<'PYS'
import csv,re,sys,os
if not os.path.exists(".ops/leads.csv"): sys.exit(0)
rows=list(csv.DictReader(open(".ops/leads.csv",newline="",encoding="utf-8")))
if "size_verified" not in rows[0]:
    print("  FAIL  leads.csv has no size_verified column"); sys.exit(1)
checked=set()
for line in open(".ops/url_check.txt",encoding="utf-8"):
    parts=line.split("\t")
    if len(parts)>1: checked.add(parts[1].strip())
SRC=re.compile(r"(asiakastieto|finder\.fi|profinder|proff\.fi|kauppalehti|LinkedIn)",re.I)
bad=0
for r in rows:
    m=SRC.search(r["size_evidence"])
    if not m: continue
    key=m.group(1).lower().split(".")[0]
    urls=[u for u in (r["source_url"],r["trigger_source_url"]) if key in u.lower()]
    ok = bool(urls) and all(u in checked for u in urls)
    if not ok and r["size_verified"]!="UNVERIFIED_third_party":
        print(f"  FAIL  {r['company'][:34]}: size cites {m.group(1)} with no checked URL and is not labelled unverified")
        bad=1
    if ok and r["size_verified"]=="UNVERIFIED_third_party":
        print(f"  FAIL  {r['company'][:34]}: labelled unverified but its source URL IS checked")
        bad=1
    # A quote field must never contain a contact route the note says was fabricated.
if not bad: print("  PASS  every third-party size claim is either source-checked or labelled unverified")
sys.exit(bad)
PYS
[ $? -ne 0 ] && FAIL=1

sec "H3. LEADS — no row quotes an address it also calls fabricated"
python3 - <<'PYQ'
import csv,re,sys,os
if not os.path.exists(".ops/leads.csv"): sys.exit(0)
bad=0
for r in csv.DictReader(open(".ops/leads.csv",newline="",encoding="utf-8")):
    note=r["verification_note"].lower()
    for addr in re.findall(r"[a-z0-9._%%+-]+@[a-z0-9.-]+\.[a-z]{2,}", r["source_quote"], re.I):
        if addr.lower() in note and ("was not on the page" in note or "pattern-guessed" in note or "fabricat" in note):
            if addr.lower() != r["contact_route"].lower():
                print(f"  FAIL  {r['company'][:34]}: source_quote contains {addr}, which the note calls fabricated")
                bad=1
if not bad: print("  PASS  no source_quote contains an address its own note disproves")
sys.exit(bad)
PYQ
[ $? -ne 0 ] && FAIL=1

sec "H4. LEADS — no row still prices the retired cost-side offer"
python3 - <<'PYD'
import csv,sys,os
if not os.path.exists(".ops/leads.csv"): sys.exit(0)
bad=[r["company"] for r in csv.DictReader(open(".ops/leads.csv",newline="",encoding="utf-8"))
     if "AgentOps" in r["est_deal_size"] or "build +" in r["est_deal_size"].lower()]
for c in bad[:5]: print(f"  FAIL  {c[:40]}: est_deal_size still quotes the abandoned build+retainer pricing")
if not bad: print("  PASS  every row prices against the current Signal Run ladder")
sys.exit(1 if bad else 0)
PYD
[ $? -ne 0 ] && FAIL=1

sec "I. LEADS — every source_url was actually reachable"
if [ -f .ops/url_check.txt ]; then
  DEAD=$(grep -c 'DEAD' .ops/url_check.txt || true)
  # UNKNOWN must fail too. If the network blocks the checker, every line comes
  # back UNKNOWN and a DEAD-only test would pass vacuously - a check that does
  # not check. Every URL must be positively confirmed, not merely not-refuted.
  UNK=$(grep -c 'UNKNOWN' .ops/url_check.txt || true)
  TOT=$(wc -l < .ops/url_check.txt | tr -d ' ')
  if [ "$DEAD" -eq 0 ] && [ "$UNK" -eq 0 ]; then
    ok "$TOT source URLs positively confirmed live"
  else
    [ "$DEAD" -gt 0 ] && no "$DEAD dead source URLs"
    [ "$UNK" -gt 0 ] && no "$UNK source URLs never actually confirmed (network blocked the check)"
  fi
  # Cross-check: every URL cited in leads.csv must appear in url_check.txt.
  python3 - <<'PYX'
import csv,sys,os
if os.path.exists(".ops/leads.csv"):
    cited=set()
    for r in csv.DictReader(open(".ops/leads.csv",newline="",encoding="utf-8")):
        for c in ("source_url","trigger_source_url"):
            u=(r.get(c) or "").strip()
            if u.startswith("http"): cited.add(u)
    checked=set()
    for line in open(".ops/url_check.txt",encoding="utf-8"):
        parts=line.split("\t")
        if len(parts)>1: checked.add(parts[1].strip())
    missing=cited-checked
    if missing:
        for m in list(missing)[:5]: print(f"  FAIL  cited but never checked: {m}")
        sys.exit(1)
    print("  PASS  every URL cited in leads.csv appears in url_check.txt")
PYX
  [ $? -ne 0 ] && FAIL=1
else
  no ".ops/url_check.txt missing (URLs never verified)"
fi

sec "J. OFFER + OUTREACH artifacts exist"
for f in .ops/OFFER.md .ops/outreach/README.md; do
  [ -s "$f" ] && ok "$f present" || no "$f missing/empty"
done
DRAFTS=$(find .ops/outreach -name "*.md" 2>/dev/null | grep -v README | wc -l | tr -d " ")
[ -z "$DRAFTS" ] && DRAFTS=0
[ "$DRAFTS" -ge 10 ] && ok "$DRAFTS outreach drafts ready" || no "only $DRAFTS outreach drafts (need >=10)"

sec "J2. SHOWCASE — safe to hand to a stranger"
python3 - <<'PYW'
import csv,re,sys,os
sc=".ops/leads_showcase.csv"
if not os.path.exists(sc): print("  FAIL  leads_showcase.csv missing"); sys.exit(1)
blob=open(sc,encoding="utf-8").read()
rows=list(csv.DictReader(open(".ops/leads.csv",newline="",encoding="utf-8")))
bad=0
for c in ("contact_route","pain_hypothesis","est_deal_size"):
    if c in blob.splitlines()[0]:
        print(f"  FAIL  showcase exposes column {c}"); bad=1
leak=[r["contact_route"] for r in rows
      if r["contact_route"] and not r["contact_route"].startswith("http") and r["contact_route"] in blob]
if leak: print(f"  FAIL  {len(leak)} contact routes leaked into showcase, e.g. {leak[0]}"); bad=1
if re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", blob):
    print("  FAIL  an email address survives in the showcase"); bad=1
if re.search(r"DO NOT PITCH|do NOT quote it back", blob, re.I):
    print("  FAIL  a private aside survives in the showcase"); bad=1
n=sum(1 for _ in csv.DictReader(open(sc,newline="",encoding="utf-8")))
if n != len(rows): print(f"  FAIL  showcase has {n} rows, leads.csv has {len(rows)}"); bad=1
if not bad: print(f"  PASS  showcase carries all {n} rows with every contact route withheld")
sys.exit(bad)
PYW
[ $? -ne 0 ] && FAIL=1

sec "K. STATE — loop files current"
for f in .ops/GOAL.md .ops/PROGRESS.md .ops/ATTEMPTS.md .ops/NEXT.md; do
  [ -s "$f" ] && ok "$f" || no "$f missing/empty"
done

printf '\n'
if [ $FAIL -eq 0 ]; then echo "VERIFY: PASS"; exit 0; else echo "VERIFY: FAIL"; exit 1; fi
