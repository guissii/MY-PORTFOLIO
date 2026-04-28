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
 * Returns ALL media files (images, PDFs, PPTx) for a given collection and slug.
 * GET /api/public/media?collection=projects&slug=my-project
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const passedCollection = String(req.query?.collection || '').trim();
    const collectionName = passedCollection === 'hackathons' ? 'hackathons' : 'projects';
    const slug = String(req.query?.slug || '').trim().toLowerCase();
    if (!slug) {
      return res.status(200).json({ ok: true, media: [] });
    }

    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const media = [];

    if (hasBlobToken) {
      try {
        const result = await list({ prefix: `${collectionName}/${slug}/` });
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
        // Blob listing failed
      }
      return res.status(200).json({ ok: true, media });
    }

    const existing = await readJsonFile(LOCAL_IMAGES_PATH);
    const images = Array.isArray(existing) ? existing : [];
    for (const item of images) {
      const pathname = String(item?.pathname || '');
      if (pathname.startsWith(`${collectionName}/${slug}/`) || pathname.startsWith(`${collectionName}/${slug}.`)) {
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
    return res.status(200).json({ ok: true, media: [] });
  }
}
