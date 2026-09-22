// POST /api/join  { phone: "4155550123", source?: "landing-desktop" }
// Stores a US phone number on the Supabase waitlist. Service-role key stays
// server-side; the waitlist table has RLS on with no policies, so this route
// is the only way in.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 10 digits, or 11 leading with the US country code.
function toE164(input) {
  const d = String(input == null ? '' : input).replace(/\D/g, '');
  const local = d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
  if (local.length !== 10) return null;
  if (local[0] === '0' || local[0] === '1') return null; // no valid US area code starts with 0 or 1
  return '+1' + local;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('join: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const phone_e164 = toE164(body.phone);
  if (!phone_e164) return res.status(400).json({ error: 'invalid_phone' });

  const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'landing';

  const r = await fetch(SUPABASE_URL + '/rest/v1/waitlist', {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: 'Bearer ' + SERVICE_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ phone_e164, source }),
  });

  // Already signed up: unique violation on phone_e164. Same outcome for the visitor.
  if (r.status === 409) return res.status(200).json({ ok: true, already: true });

  if (!r.ok) {
    console.error('join: supabase insert failed', r.status, await r.text());
    return res.status(502).json({ error: 'upstream_error' });
  }

  return res.status(200).json({ ok: true });
};
