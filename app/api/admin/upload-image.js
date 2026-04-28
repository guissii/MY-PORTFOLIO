import { put } from '@vercel/blob';
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

async function writeJsonFile(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

function isAuthorized(req) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const configuredUsername = process.env.ADMIN_USERNAME;
  const providedPassword = req.headers['x-admin-password'];
  const providedUsername = req.headers['x-admin-username'];
  if (!configuredPassword) return false;
  if (configuredUsername) {
    return providedPassword === configuredPassword && providedUsername === configuredUsername;
  }
  return providedPassword === configuredPassword;
}

const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

function isAllowedMime(contentType) {
  if (!contentType || typeof contentType !== 'string') return false;
  return ALLOWED_MIMES.has(contentType.toLowerCase().trim());
}

function extensionFromMime(contentType) {
  const ct = String(contentType).toLowerCase().trim();
  if (ct === 'image/png') return 'png';
  if (ct === 'image/webp') return 'webp';
  if (ct === 'image/gif') return 'gif';
  if (ct === 'image/avif') return 'avif';
  if (ct === 'image/svg+xml') return 'svg';
  if (ct === 'application/pdf') return 'pdf';
  if (ct === 'application/vnd.ms-powerpoint') return 'ppt';
  if (ct === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'pptx';
  if (ct.startsWith('image/')) return 'jpg';
  return 'bin';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return res
      .status(500)
      .json({ error: 'ADMIN_PASSWORD non configure. Ajoutez-le dans Vercel (Environment Variables) ou dans app/.env.local, puis redeploy/relancez.' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { slug, contentType, base64Data, collection } = req.body || {};
    if (!slug || !base64Data || !contentType) {
      return res.status(400).json({ error: 'slug, contentType and base64Data are required' });
    }

    if (!isAllowedMime(contentType)) {
      return res.status(400).json({ error: 'Type de fichier non supporté. Formats acceptés : Images (jpg, png, webp), PDF, PowerPoint (ppt, pptx).' });
    }

    const effectiveCollection = collection === 'hackathons' ? 'hackathons' : 'projects';
    const ext = extensionFromMime(contentType);
    const normalizedSlug = String(slug).toLowerCase();
    const pathname =
      effectiveCollection === 'hackathons' ? `hackathons/${normalizedSlug}/${Date.now()}.${ext}` : `projects/${normalizedSlug}/${Date.now()}.${ext}`;
    const buffer = Buffer.from(String(base64Data), 'base64');

    const isDocument = String(contentType).includes('pdf') || String(contentType).includes('powerpoint') || String(contentType).includes('presentation');
    const maxSize = isDocument ? 10 * 1024 * 1024 : 4 * 1024 * 1024; // 10MB for docs, 4MB for images
    if (buffer.byteLength > maxSize) {
      return res.status(400).json({ error: `Fichier trop volumineux (max ${isDocument ? '10' : '4'}MB)` });
    }

    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (hasBlobToken) {
      const blob = await put(pathname, buffer, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: String(contentType),
      });

      return res.status(200).json({ ok: true, url: blob.url, pathname: blob.pathname });
    }

    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN non configure sur Vercel. Ajoutez-le dans les variables d environnement puis redeployez.' });
    }

    const existing = await readJsonFile(LOCAL_IMAGES_PATH);
    const images = Array.isArray(existing) ? existing : [];
    const uploadedAt = new Date().toISOString();
    const url = `data:${String(contentType)};base64,${String(base64Data)}`;

    const nextImages = [
      {
        url,
        pathname,
        size: buffer.byteLength,
        uploadedAt,
      },
      ...images,
    ];

    await writeJsonFile(LOCAL_IMAGES_PATH, nextImages);
    return res.status(200).json({ ok: true, url, pathname });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Upload failed' });
  }
}
