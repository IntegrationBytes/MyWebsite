(function(){
  try {
    // Opt-in via data-beacon-endpoint on <script> tag or global BEACON_ENDPOINT
    const currentScript = document.currentScript;
    const endpoint = (currentScript && currentScript.getAttribute('data-endpoint')) || window.BEACON_ENDPOINT;
    if (!endpoint) return;

    function hashUA(ua){
      let h = 0; for (let i=0;i<ua.length;i++) { h = Math.imul(31, h) + ua.charCodeAt(i) | 0; } return (h>>>0).toString(36);
    }

    const payload = {
      path: location.pathname,
      ref: document.referrer ? new URL(document.referrer).hostname : '',
      ua: hashUA(navigator.userAgent || ''),
      ts: Date.now(),
    };

    navigator.sendBeacon?.(endpoint, new Blob([JSON.stringify(payload)], { type: 'application/json' }))
      || fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
  } catch {}
})();


