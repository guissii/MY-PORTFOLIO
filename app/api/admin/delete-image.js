import { del } from '@vercel/blob';
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD non configure. Ajoutez-le dans app/.env.local puis relancez le serveur.' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { url } = req.body || {};
    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (hasBlobToken) {
      await del(String(url));
      return res.status(200).json({ ok: true });
    }

    if (process.env.VERCEL) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN non configure sur Vercel. Ajoutez-le dans les variables d environnement puis redeployez.' });
    }

    const existing = await readJsonFile(LOCAL_IMAGES_PATH);
    const images = Array.isArray(existing) ? existing : [];
    const next = images.filter((img) => String(img?.url || '') !== String(url));
    await writeJsonFile(LOCAL_IMAGES_PATH, next);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Delete failed' });
  }
}
