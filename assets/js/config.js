// Runtime configuration for integrations. Safe to commit; no secrets here.
// Fill these in to enable features. Leave empty to disable.

window.SITE_URL = window.SITE_URL || 'https://example.com';

// Analytics (Umami)
window.UMAMI_WEBSITE_ID = window.UMAMI_WEBSITE_ID || '7085dcec-ca13-4cab-9cdf-4edf79ca1e05';
window.UMAMI_HOST = window.UMAMI_HOST || 'https://cloud.umami.is';
// Session analytics / heatmaps (optional)
window.CLARITY_ID = window.CLARITY_ID || '';

// Comments (Giscus)
window.GISCUS_REPO = window.GISCUS_REPO || '';
window.GISCUS_REPO_ID = window.GISCUS_REPO_ID || '';
window.GISCUS_CATEGORY = window.GISCUS_CATEGORY || '';
window.GISCUS_CATEGORY_ID = window.GISCUS_CATEGORY_ID || '';
window.GISCUS_MAPPING = window.GISCUS_MAPPING || 'pathname';
window.GISCUS_LANG = window.GISCUS_LANG || 'en';

// Newsletter (Listmonk)
window.LISTMONK_URL = window.LISTMONK_URL || 'http://localhost:9000';
window.LISTMONK_LIST_ID = window.LISTMONK_LIST_ID || '';

// Webmentions
window.WEBMENTION_IO_DOMAIN = window.WEBMENTION_IO_DOMAIN || '';
// For local share URLs
window.SITE_URL = window.SITE_URL || (typeof location !== 'undefined' ? location.origin : '');

// Feature toggles (set true to activate modules & navigation)
window.FEATURE_SERVICES = window.FEATURE_SERVICES ?? true;      // enabled by default
window.FEATURE_PRESS = window.FEATURE_PRESS ?? false;
window.FEATURE_SPEAKING = window.FEATURE_SPEAKING ?? false;
window.FEATURE_COMMUNITY = window.FEATURE_COMMUNITY ?? false;
window.FEATURE_STATUS = window.FEATURE_STATUS ?? false;
window.FEATURE_PRODUCTS = window.FEATURE_PRODUCTS ?? true;
window.FEATURE_BUSINESS = window.FEATURE_BUSINESS ?? true;
window.FEATURE_AB_TEST = window.FEATURE_AB_TEST ?? true;
window.FEATURE_HELLOBAR = window.FEATURE_HELLOBAR ?? true;
window.FEATURE_EXIT_INTENT = window.FEATURE_EXIT_INTENT ?? true;

// Integrations for optional modules
window.CALENDLY_URL = window.CALENDLY_URL || 'https://calendly.com/viitala-vincent/30min';
window.STATUS_PAGE_URL = window.STATUS_PAGE_URL || '';
window.REFERRAL_PARAM = window.REFERRAL_PARAM || 'ref';
window.UMAMI_SHARE_URL = window.UMAMI_SHARE_URL || 'https://cloud.umami.is/share/h70PNBtiP39f10fD/vincentviitala.com';

// Lead capture endpoints (optional)
window.LEADS_WEBHOOK_URL = window.LEADS_WEBHOOK_URL || '';
window.LISTMONK_LEADS_LIST_ID = window.LISTMONK_LEADS_LIST_ID || '';
window.LEADS_ADMIN_JSON_URL = window.LEADS_ADMIN_JSON_URL || '';

// Admin/ops panel (hidden from public nav by default; access at /admin/)
window.FEATURE_OPS = window.FEATURE_OPS ?? false;

// HubSpot (optional embedded form instead of local lead form)
window.HUBSPOT_PORTAL_ID = window.HUBSPOT_PORTAL_ID || '';
window.HUBSPOT_FORM_GUID = window.HUBSPOT_FORM_GUID || '';

// Optional purchase links per product id (defaults to Calendly if not specified)
window.PRODUCT_LINKS = window.PRODUCT_LINKS || {};


