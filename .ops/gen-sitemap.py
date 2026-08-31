#!/usr/bin/env python3
"""Generate sitemap.xml with hreflang alternates.

The Cloudflare deploy publishes ./ directly and runs no build step, so the
sitemap the README describes was never produced — robots.txt has been pointing
crawlers at a 404. This script is run manually (or from a pre-commit) and its
output is committed.
"""
import os, glob, re, datetime, sys

SITE = "https://vincentviitala.com"
# Pages that must not be indexed: orphan drafts, alternates.
EXCLUDE = {"en/v2/index.html"}

pages = sorted(p for p in
               glob.glob("en/**/index.html", recursive=True) +
               glob.glob("fi/**/index.html", recursive=True) +
               glob.glob("es/**/index.html", recursive=True)
               if p not in EXCLUDE)

# Group translations of the same page so each entry can declare its alternates.
GROUPS = [
    ("home",     {"en": "en/index.html",           "fi": "fi/index.html",            "es": "es/index.html"}),
    ("services", {"en": "en/services/index.html",  "fi": "fi/palvelut/index.html",   "es": "es/servicios/index.html"}),
    ("results",  {"en": "en/results/index.html",   "fi": "fi/tulokset/index.html",   "es": "es/resultados/index.html"}),
    ("contact",  {"en": "en/contact/index.html",   "fi": "fi/ota-yhteytta/index.html","es": "es/contacto/index.html"}),
    ("cv",       {"en": "en/cv/index.html",        "fi": "fi/cv/index.html"}),
    ("roi",      {"en": "en/roi/index.html",       "fi": "fi/laskuri/index.html"}),
]
in_group = {p for _, g in GROUPS for p in g.values()}
today = datetime.date.today().isoformat()

def url(p):
    return SITE + "/" + os.path.dirname(p) + "/"

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
       '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']

out += ['  <url>', f'    <loc>{SITE}/</loc>', f'    <lastmod>{today}</lastmod>',
        '    <priority>1.0</priority>', '  </url>']

for name, group in GROUPS:
    for lang, p in group.items():
        if not os.path.exists(p):
            print(f"  warn: {p} listed in group '{name}' but missing", file=sys.stderr); continue
        out += ['  <url>', f'    <loc>{url(p)}</loc>', f'    <lastmod>{today}</lastmod>',
                f'    <priority>{"0.9" if name in ("home","services") else "0.7"}</priority>']
        for alt_lang, alt_p in group.items():
            if os.path.exists(alt_p):
                out.append(f'    <xhtml:link rel="alternate" hreflang="{alt_lang}" href="{url(alt_p)}"/>')
        if os.path.exists(group.get("en", "")):
            out.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{url(group["en"])}"/>')
        out.append('  </url>')

for p in pages:
    if p in in_group: continue
    out += ['  <url>', f'    <loc>{url(p)}</loc>', f'    <lastmod>{today}</lastmod>',
            '    <priority>0.5</priority>', '  </url>']

out.append('</urlset>')
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(out) + "\n")
n = "\n".join(out).count("<loc>")
print(f"sitemap.xml written: {n} URLs")
