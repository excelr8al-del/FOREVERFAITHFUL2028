export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({ error: 'JSON required.' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'Invalid request.' }); }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid request.' });
  if (body.website) return res.status(400).json({ error: 'Unable to accept this submission.' });
  const { name, email, consent } = body;
  if (typeof name !== 'string' || !name.trim() || name.length > 80 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || consent !== true) return res.status(400).json({ error: 'Enter your name, a valid email address, and your consent.' });
  const url = process.env.SIGNUP_WEBHOOK_URL;
  if (!url) return res.status(503).json({ error: 'Campaign signup is not open yet. Please check back soon.' });
  try {
    if (new URL(url).protocol !== 'https:') throw new Error('HTTPS required');
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.SIGNUP_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.SIGNUP_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), consent: true, consentText: 'I agree to receive campaign emails. I can unsubscribe at any time.', source: 'paul-lopez-2028', submittedAt: new Date().toISOString() }), signal: AbortSignal.timeout(10000), redirect: 'error' });
    if (!response.ok) throw new Error('Signup provider rejected submission');
    return res.status(200).json({ success: true });
  } catch { return res.status(502).json({ error: 'We couldn’t complete your signup. Please try again later.' }); }
}
