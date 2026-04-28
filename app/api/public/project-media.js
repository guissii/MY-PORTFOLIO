import { list } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOCAL_DIR = path.resolve(process.cwd(), '.cache', 'local-admin');
const LOCAL_IMAGES_PATH = path.join(LOCAL_DIR, 'images.json');

async function readJsonFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Returns ALL media files (images, PDFs, PPTx) for a given project slug.
 * GET /api/public/project-media?slug=my-project
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const slug = String(req.query?.slug || '').trim().toLowerCase();
    if (!slug) {
      return res.status(200).json({ ok: true, media: [] });
    }

    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const media = [];

    if (hasBlobToken) {
      // Fetch from Vercel Blob — prefix-search for all files under projects/<slug>/
      try {
        const result = await list({ prefix: `projects/${slug}/` });
        for (const item of result.blobs) {
          if (!item?.url || !item?.pathname) continue;
          media.push({
            url: item.url,
            pathname: item.pathname,
            size: item.size || 0,
            uploadedAt: item.uploadedAt || new Date().toISOString(),
          });
        }
      } catch {
        // Blob listing failed — return empty gracefully
      }
      return res.status(200).json({ ok: true, media });
    }

    // Local fallback — read from cache
    const existing = await readJsonFile(LOCAL_IMAGES_PATH);
    const images = Array.isArray(existing) ? existing : [];
    for (const item of images) {
      const pathname = String(item?.pathname || '');
      // Match files that start with projects/<slug>/
      if (pathname.startsWith(`projects/${slug}/`) || pathname.startsWith(`projects/${slug}.`)) {
        if (item?.url) {
          media.push({
            url: String(item.url),
            pathname,
            size: item?.size || 0,
            uploadedAt: item?.uploadedAt || new Date().toISOString(),
          });
        }
      }
    }
    return res.status(200).json({ ok: true, media });
  } catch {
    // Total fallback — never crash the API
    return res.status(200).json({ ok: true, media: [] });
  }
}
