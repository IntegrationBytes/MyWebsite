/**
 * Cloudflare Pages Function — POST /api/lead
 *
 * Delivers a contact-form submission. Configure ONE of these environment
 * variables in the Cloudflare Pages dashboard (Settings -> Environment variables):
 *
 *   LEADS_WEBHOOK   a URL to POST the JSON to (Slack incoming webhook, Make,
 *                   Zapier, n8n, Airtable automation — anything that accepts JSON)
 *   RESEND_API_KEY  a Resend API key; the lead is emailed to LEADS_TO
 *   LEADS_TO        destination address (default vincent@wannado.fi)
 *
 * With none of them set this returns 501, and the browser falls back to a
 * pre-filled mailto:. It never returns 2xx without actually delivering —
 * that is the whole point of this file.
 */

const CORS = { 'content-type': 'application/json' };
const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: CORS });

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  // Honeypot: a bot fills every field, a human never sees this one.
  if (data && typeof data.website === 'string' && data.website.trim() !== '') {
    return json({ ok: true }, 200); // silently absorb, do not tip off the bot
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'name and a valid email are required' }, 400);
  }

  const lead = {
    name,
    email,
    company: String(data.company || '').trim(),
    phone: String(data.phone || '').trim(),
    service: String(data.service || '').trim(),
    message: String(data.message || '').slice(0, 4000),
    lang: String(data.lang || '').slice(0, 5),
    path: String(data.path || '').slice(0, 200),
    ref: String(data.ref || '').slice(0, 300),
    received: new Date().toISOString(),
    country: request.headers.get('cf-ipcountry') || '',
  };

  const lines = Object.entries(lead).map(([k, v]) => `${k}: ${v}`).join('\n');

  if (env.LEADS_WEBHOOK) {
    const r = await fetch(env.LEADS_WEBHOOK, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // `text` makes this work as-is with a Slack incoming webhook.
      body: JSON.stringify({ ...lead, text: `New lead from ${lead.company || lead.name}\n${lines}` }),
    });
    if (!r.ok) return json({ error: `webhook returned ${r.status}` }, 502);
    return json({ ok: true }, 200);
  }

  if (env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.LEADS_FROM || 'leads@vincentviitala.com',
        to: env.LEADS_TO || 'vincent@wannado.fi',
        reply_to: lead.email,
        subject: `Lead: ${lead.company || lead.name} (${lead.service || 'no service selected'})`,
        text: lines,
      }),
    });
    if (!r.ok) return json({ error: `resend returned ${r.status}` }, 502);
    return json({ ok: true }, 200);
  }

  // Nothing configured. Say so honestly so the client can fall back to mailto.
  return json({ error: 'no delivery channel configured' }, 501);
}

// Only onRequestPost is exported: Cloudflare Pages returns 405 automatically for
// any other method. Exporting onRequest as well would override this handler for
// every method, including POST.
