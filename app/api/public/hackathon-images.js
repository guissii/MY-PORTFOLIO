import { list } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOCAL_DIR = path.resolve(process.cwd(), '.cache', 'local-admin');
const LOCAL_IMAGES_PATH = path.join(LOCAL_DIR, 'images.json');
const LOCAL_HACKATHONS_PATH = path.join(LOCAL_DIR, 'hackathons.json');

async function readJsonFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readHackathonsFromBlob() {
  const result = await list({ prefix: 'data/' });
  const blob = result.blobs.find((item) => item.pathname === 'data/hackathons.json');
  if (!blob?.url) return null;
  const response = await fetch(blob.url);
  if (!response.ok) return null;
  const json = await response.json();
  if (!Array.isArray(json)) return null;
  return json;
}

function slugFromPathname(pathname) {
  const match = pathname.match(/^hackathons\/([^/]+)\/.+\.(jpg|jpeg|png|webp)$/i);
  return match ? match[1] : '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const imageMap = {};
    const latestBySlug = {};
    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (hasBlobToken) {
      const result = await list({ prefix: 'hackathons/' });
      const hackathonList = await readHackathonsFromBlob();
      const coverBySlug = {};
      if (Array.isArray(hackathonList)) {
        for (const h of hackathonList) {
          if (h?.slug && typeof h.slug === 'string' && h?.coverImagePathname && typeof h.coverImagePathname === 'string') {
            coverBySlug[h.slug] = h.coverImagePathname;
          }
        }
      }
      for (const item of result.blobs) {
        const slug = slugFromPathname(item.pathname);
        if (!slug) continue;
        const coverPath = coverBySlug[slug];
        if (coverPath && item.pathname === coverPath) {
          imageMap[slug] = item.url;
          latestBySlug[slug] = Number.POSITIVE_INFINITY;
          continue;
        }
        if (imageMap[slug] && latestBySlug[slug] === Number.POSITIVE_INFINITY) continue;
        const uploadedAt = item.uploadedAt ? new Date(item.uploadedAt).getTime() : 0;
        const prev = latestBySlug[slug] || 0;
        if (uploadedAt >= prev) {
          latestBySlug[slug] = uploadedAt;
          imageMap[slug] = item.url;
        }
      }
      return res.status(200).json({ ok: true, images: imageMap });
    }

    const existing = await readJsonFile(LOCAL_IMAGES_PATH);
    const images = Array.isArray(existing) ? existing : [];
    const hackathonList = await readJsonFile(LOCAL_HACKATHONS_PATH);
    const coverBySlug = {};
    if (Array.isArray(hackathonList)) {
      for (const h of hackathonList) {
        if (h?.slug && typeof h.slug === 'string' && h?.coverImagePathname && typeof h.coverImagePathname === 'string') {
          coverBySlug[h.slug] = h.coverImagePathname;
        }
      }
    }
    for (const item of images) {
      const pathname = String(item?.pathname || '');
      const slug = slugFromPathname(pathname);
      if (!slug) continue;
      const coverPath = coverBySlug[slug];
      if (coverPath && pathname === coverPath) {
        if (item?.url) imageMap[slug] = String(item.url);
        latestBySlug[slug] = Number.POSITIVE_INFINITY;
        continue;
      }
      if (imageMap[slug] && latestBySlug[slug] === Number.POSITIVE_INFINITY) continue;
      const uploadedAt = item?.uploadedAt ? new Date(String(item.uploadedAt)).getTime() : 0;
      const prev = latestBySlug[slug] || 0;
      if (uploadedAt >= prev) {
        latestBySlug[slug] = uploadedAt;
        if (item?.url) imageMap[slug] = String(item.url);
      }
    }
    return res.status(200).json({ ok: true, images: imageMap });
  } catch {
    return res.status(200).json({ ok: true, images: {} });
  }
}
