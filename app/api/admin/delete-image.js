import { del } from '@vercel/blob';

function isAuthorized(req) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];
  return Boolean(configuredPassword) && providedPassword === configuredPassword;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { url } = req.body || {};
    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    await del(String(url));
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Delete failed' });
  }
}
