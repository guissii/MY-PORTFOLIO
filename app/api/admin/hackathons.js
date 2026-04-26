import { list, put } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOCAL_DIR = path.resolve(process.cwd(), '.cache', 'local-admin');
const LOCAL_HACKATHONS_PATH = path.join(LOCAL_DIR, 'hackathons.json');

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

async function readHackathons() {
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (hasBlobToken) {
    try {
      const hackathons = await readHackathonsFromBlob();
      if (hackathons) return hackathons;
    } catch {
      // Fall back to local.
    }
  }
  const local = await readJsonFile(LOCAL_HACKATHONS_PATH);
  return Array.isArray(local) ? local : null;
}

function normalizeHackathons(hackathons) {
  if (!Array.isArray(hackathons)) return null;
  const normalized = [];
  for (const item of hackathons) {
    if (!item || typeof item !== 'object') return null;
    if (!item.slug || typeof item.slug !== 'string') return null;
    if (!item.name || typeof item.name !== 'string') return null;
    normalized.push({
      slug: item.slug,
      name: item.name,
      result: typeof item.result === 'string' ? item.result : '',
      period: typeof item.period === 'string' ? item.period : '',
      detail: typeof item.detail === 'string' ? item.detail : '',
      coverImagePathname: typeof item.coverImagePathname === 'string' ? item.coverImagePathname : '',
    });
  }
  return normalized;
}

export default async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD) {
    return res
      .status(500)
      .json({ error: 'ADMIN_PASSWORD non configure. Ajoutez-le dans Vercel (Environment Variables) ou dans app/.env.local, puis redeploy/relancez.' });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const hackathons = await readHackathons();
      if (!hackathons) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true, hackathons });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Read failed' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { hackathons } = req.body || {};
      const normalized = normalizeHackathons(hackathons);
      if (!normalized) return res.status(400).json({ error: 'hackathons must be an array of valid hackathon objects' });

      const payload = JSON.stringify(normalized, null, 2);
      const buffer = Buffer.from(payload, 'utf-8');
      if (buffer.byteLength > 400 * 1024) {
        return res.status(400).json({ error: 'Payload too large' });
      }

      const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
      if (hasBlobToken) {
        const blob = await put('data/hackathons.json', buffer, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json; charset=utf-8',
        });

        return res.status(200).json({ ok: true, url: blob.url, pathname: blob.pathname });
      }

      await writeJsonFile(LOCAL_HACKATHONS_PATH, normalized);
      return res.status(200).json({ ok: true, pathname: 'local/hackathons.json' });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Save failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
