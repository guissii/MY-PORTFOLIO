import { list } from '@vercel/blob';

function isAuthorized(req) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];
  return Boolean(configuredPassword) && providedPassword === configuredPassword;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await list({ prefix: 'projects/' });
    return res.status(200).json({
      ok: true,
      images: result.blobs.map((item) => ({
        url: item.url,
        pathname: item.pathname,
        size: item.size,
        uploadedAt: item.uploadedAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'List failed' });
  }
}
