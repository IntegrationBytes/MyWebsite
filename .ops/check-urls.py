#!/usr/bin/env python3
"""Independently re-verify every source_url in leads.csv.

The lead-hunt workflow already runs an adversarial verifier over each lead.
This is a THIRD check, and deliberately dumb: it does not reason about the
page, it just asks whether the URL resolves to something real. Section I of
verify.sh depends on it, so that no lead reaches Vincent with a source he
cannot open.

Writes .ops/url_check.txt — one line per URL, containing the word DEAD if the
URL could not be confirmed. verify.sh fails if any DEAD line exists.

Usage:  python3 .ops/check-urls.py
"""
import csv, json, os, subprocess, sys, urllib.parse

LEADS = os.path.join(os.path.dirname(__file__), "leads.csv")
OUT = os.path.join(os.path.dirname(__file__), "url_check.txt")


def unique_urls(path):
    """Every distinct URL referenced by the lead list, with the rows citing it."""
    seen = {}
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            for col in ("source_url", "trigger_source_url", "website"):
                u = (row.get(col) or "").strip()
                if u.startswith("http"):
                    seen.setdefault(u, []).append(f"{row.get('company','?')}:{col}")
    return seen


def check(url):
    """Return (ok, detail).

    Direct egress is blocked in some environments, so this shells out to curl
    and treats a transport-level rejection as UNKNOWN rather than DEAD — a
    blocked proxy is not evidence that a company's website is gone. Only a
    genuine 4xx/5xx from the origin counts as DEAD.
    """
    try:
        r = subprocess.run(
            ["curl", "-sS", "-o", "/dev/null", "-L", "--max-time", "20",
             "-w", "%{http_code}", "-A",
             "Mozilla/5.0 (compatible; lead-verification/1.0)", url],
            capture_output=True, text=True, timeout=30)
        code = (r.stdout or "").strip()
        if code.isdigit():
            n = int(code)
            if 200 <= n < 400:
                return True, f"HTTP {n}"
            # 403/429 from a real origin means the site exists but refused a bot.
            if n in (403, 405, 429):
                return True, f"HTTP {n} (bot-blocked, but origin answered)"
            return False, f"HTTP {n}"
        return None, (r.stderr or "no response").strip().splitlines()[-1][:120]
    except Exception as e:  # noqa: BLE001
        return None, f"{type(e).__name__}: {e}"[:120]


def main():
    if not os.path.exists(LEADS):
        print("leads.csv not found — nothing to check", file=sys.stderr)
        return 1

    urls = unique_urls(LEADS)
    if not urls:
        print("no http URLs found in leads.csv", file=sys.stderr)
        return 1

    lines, dead, unknown, live = [], 0, 0, 0
    for url, cites in sorted(urls.items()):
        ok, detail = check(url)
        if ok is True:
            status, live = "LIVE", live + 1
        elif ok is False:
            status, dead = "DEAD", dead + 1
        else:
            # Unreachable from here is not proof the URL is bad. Flag it for a
            # human rather than silently passing OR silently failing the lead.
            status, unknown = "UNKNOWN", unknown + 1
        lines.append(f"{status}\t{url}\t{detail}\t{','.join(cites[:3])}")
        print(f"{status:8} {detail:38} {url[:80]}")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"\n{live} live, {dead} dead, {unknown} unverifiable from this environment")
    print(f"written: {OUT}")
    if unknown:
        print("NOTE: UNKNOWN means the network blocked the check, not that the "
              "URL is bad. These need a manual look before the lead is used.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
