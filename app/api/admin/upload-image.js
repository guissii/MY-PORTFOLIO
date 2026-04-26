import { put } from '@vercel/blob';

function isAuthorized(req) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];
  return Boolean(configuredPassword) && providedPassword === configuredPassword;
}

function extensionFromMime(contentType) {
  if (contentType === 'image/png') return 'png';
  if (contentType === 'image/webp') return 'webp';
  return 'jpg';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { slug, contentType, base64Data } = req.body || {};
    if (!slug || !base64Data || !contentType) {
      return res.status(400).json({ error: 'slug, contentType and base64Data are required' });
    }

    if (!String(contentType).startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    const ext = extensionFromMime(contentType);
    const pathname = `projects/${String(slug).toLowerCase()}.${ext}`;
    const buffer = Buffer.from(String(base64Data), 'base64');

    if (buffer.byteLength > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large (max 2MB)' });
    }

    const blob = await put(pathname, buffer, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: String(contentType),
    });

    return res.status(200).json({ ok: true, url: blob.url, pathname: blob.pathname });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Upload failed' });
  }
}
