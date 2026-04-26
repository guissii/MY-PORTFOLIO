import { list } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOCAL_DIR = path.resolve(process.cwd(), '.cache', 'local-admin');
const LOCAL_ANALYTICS_PATH = path.join(LOCAL_DIR, 'analytics.json');

async function readJsonFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readAnalyticsFromBlob() {
  const result = await list({ prefix: 'data/' });
  const blob = result.blobs.find((item) => item.pathname === 'data/analytics.json');
  if (!blob?.url) return null;
  const response = await fetch(blob.url);
  if (!response.ok) return null;
  const json = await response.json();
  if (!json || typeof json !== 'object') return null;
  return json;
}

async function readAnalytics() {
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (hasBlobToken) {
    try {
      const analytics = await readAnalyticsFromBlob();
      if (analytics) return analytics;
    } catch {
    }
  }
  const local = await readJsonFile(LOCAL_ANALYTICS_PATH);
  return local && typeof local === 'object' ? local : null;
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
  if (req.method !== 'GET') {
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
    const analytics = await readAnalytics();
    if (!analytics) {
      return res.status(200).json({
        ok: true,
        analytics: { updatedAt: '', total: 0, byCountry: {}, byDay: {}, byPath: {} },
      });
    }
    return res.status(200).json({ ok: true, analytics });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Read failed' });
  }
}
