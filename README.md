## Matrix as Maya — Static Site

Vanilla HTML/CSS/JS site with Decap CMS (`/admin`), plus a small generator that builds `sitemap.xml` and `rss.xml` from `essays/` and `projects/`.

### Local dev

```bash
npx serve . -l 8101   # or any static server
```

### Content build

```bash
SITE_URL=https://yourdomain.com npm run build
```

### Deploy to GitHub Pages

1. Create a repo and push this folder.
2. Enable Pages: Settings → Pages → Source: GitHub Actions.
3. Optional: set repository variable `SITE_URL` to your canonical URL.

Workflow: `.github/workflows/deploy.yml` builds `sitemap.xml` and `rss.xml`, then publishes everything to Pages.

### Analytics with Prometheus + Grafana (outline)

Static sites don’t expose server metrics. To use Prometheus/Grafana for page views:

- Add a tiny beacon script that POSTs a hit to a collector (Edge function, tiny Node server, or a Pushgateway) with fields: path, referrer, user-agent hash, ts.
- Collector exposes a `/metrics` endpoint exporting counters/histograms Prometheus scrapes.
- Grafana dashboards visualize `page_views_total{path=...}` etc.

This repo includes a noop beacon you can enable via an environment variable. See `assets/js/beacon.js`.
