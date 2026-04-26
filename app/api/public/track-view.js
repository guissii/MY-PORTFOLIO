import { list, put } from '@vercel/blob';
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

async function writeJsonFile(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
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

function getCountryCode(req) {
  const headers = req.headers || {};
  const raw =
    headers['x-vercel-ip-country'] ||
    headers['x-vercel-ip-country-code'] ||
    headers['cf-ipcountry'] ||
    headers['x-country'] ||
    '';
  const code = String(raw || '').trim().toUpperCase();
  if (!code) return process.env.VERCEL ? 'XX' : 'LOCAL';
  if (code.length !== 2) return 'XX';
  return code;
}

function getDayStamp() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const country = getCountryCode(req);
    const day = getDayStamp();
    const { path: providedPath } = req.body || {};
    const pagePath = typeof providedPath === 'string' && providedPath.length <= 200 ? providedPath : '';

    const existing = await readAnalytics();
    const analytics = existing && typeof existing === 'object' ? existing : {};
    const byCountry = analytics.byCountry && typeof analytics.byCountry === 'object' ? analytics.byCountry : {};
    const byDay = analytics.byDay && typeof analytics.byDay === 'object' ? analytics.byDay : {};
    const byPath = analytics.byPath && typeof analytics.byPath === 'object' ? analytics.byPath : {};

    const total = Number.isFinite(analytics.total) ? Number(analytics.total) : 0;

    byCountry[country] = (Number(byCountry[country]) || 0) + 1;
    byDay[day] = (Number(byDay[day]) || 0) + 1;
    if (pagePath) byPath[pagePath] = (Number(byPath[pagePath]) || 0) + 1;

    const next = {
      updatedAt: new Date().toISOString(),
      total: total + 1,
      byCountry,
      byDay,
      byPath,
    };

    const payload = JSON.stringify(next, null, 2);
    const buffer = Buffer.from(payload, 'utf-8');

    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (hasBlobToken) {
      await put('data/analytics.json', buffer, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json; charset=utf-8',
      });
      return res.status(200).json({ ok: true });
    }

    await writeJsonFile(LOCAL_ANALYTICS_PATH, next);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Track failed' });
  }
}
