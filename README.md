## Matrix as Maya — Static Site

Vanilla HTML/CSS/JS site with Decap CMS (`/admin`), plus a small generator that builds `sitemap.xml` and `rss.xml` from `essays/` and `projects/`.

### Local dev

```bash
npx serve . -l 8101   # or any static server
```

### Content build

```bash
SITE_URL=https://yourdomain.com \
WEBMENTION_DOMAIN=yourdomain.com \
npm run build
```

### Deploy to GitHub Pages

1. Create a repo and push this folder.
2. Enable Pages: Settings → Pages → Source: GitHub Actions.
3. Optional: set repository variable `SITE_URL` to your canonical URL.

Workflow: `.github/workflows/deploy.yml` builds `sitemap.xml` and `rss.xml`, then publishes everything to Pages.

### Analytics

- Umami: set `window.UMAMI_WEBSITE_ID` (and optional `window.UMAMI_HOST`) in `assets/js/config.js`.
- Page views beacon remains optional via `assets/js/beacon.js` with `data-endpoint`.

### Comments

- Giscus: set `window.GISCUS_*` values in `assets/js/config.js` to enable embeds on essay pages and in `view.html`.

### Search

- Pagefind: the build adds a static index under `/_pagefind`. Use the Search page at `/search/`.

### Feeds & OG images
- Add business modules (feature toggles)

Runtime configuration lives in `assets/js/config.js`. You can enable/disable modules without code changes:

- `FEATURE_SERVICES` (default true): exposes `/services/` and adds “Services” to nav.
- `FEATURE_SPEAKING` (default false): exposes `/speaking/` and adds “Speaking” to nav.
- `FEATURE_PRESS` (default false): exposes `/press/` and adds “Press” to nav.
- `FEATURE_COMMUNITY` (default false): exposes `/community/` and adds it to nav.
- `FEATURE_STATUS` (default false): adds a “Status” link to nav if `STATUS_PAGE_URL` is set.

Other integration variables:

- `CALENDLY_URL`: used by Services/Speaking “Book” buttons if set.
- `STATUS_PAGE_URL`: external status page link.
- `REFERRAL_PARAM` (default `ref`): when present in the URL, it’s preserved across internal links for attribution.

Activation steps:

1) Edit `assets/js/config.js` and set the toggles and URLs you need.
2) Optionally add assets to `press/` and set download links.
3) Rebuild: `SITE_URL=https://yourdomain npm run build`.


- Build writes `rss.xml` and `feed.json`. It also attempts OG images under `assets/img/og/*.png`. If font missing, OG generation is skipped.

