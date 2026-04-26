import { list, put } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const LOCAL_DIR = path.resolve(process.cwd(), '.cache', 'local-admin');
const LOCAL_PROJECTS_PATH = path.join(LOCAL_DIR, 'projects.json');

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

async function readProjectsFromBlob() {
  const result = await list({ prefix: 'data/' });
  const blob = result.blobs.find((item) => item.pathname === 'data/projects.json');
  if (!blob?.url) return null;
  const response = await fetch(blob.url);
  if (!response.ok) return null;
  const json = await response.json();
  if (!Array.isArray(json)) return null;
  return json;
}

async function readProjects() {
  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (hasBlobToken) {
    try {
      const projects = await readProjectsFromBlob();
      if (projects) return projects;
    } catch {
      // Fall back to local.
    }
  }
  const local = await readJsonFile(LOCAL_PROJECTS_PATH);
  return Array.isArray(local) ? local : null;
}

function normalizeProjects(projects) {
  if (!Array.isArray(projects)) return null;
  const normalized = [];
  for (const item of projects) {
    if (!item || typeof item !== 'object') return null;
    if (!item.slug || typeof item.slug !== 'string') return null;
    if (!item.title || typeof item.title !== 'string') return null;
    normalized.push({
      ...item,
      description: typeof item.description === 'string' ? item.description : '',
      hidden: Boolean(item.hidden),
      coverImagePathname: typeof item.coverImagePathname === 'string' ? item.coverImagePathname : '',
    });
  }
  return normalized;
}

export default async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD non configure. Ajoutez-le dans app/.env.local puis relancez le serveur.' });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const projects = await readProjects();
      if (!projects) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true, projects });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Read failed' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { projects } = req.body || {};
      const normalized = normalizeProjects(projects);
      if (!normalized) return res.status(400).json({ error: 'projects must be an array of valid project objects' });

      const payload = JSON.stringify(normalized, null, 2);
      const buffer = Buffer.from(payload, 'utf-8');
      if (buffer.byteLength > 900 * 1024) {
        return res.status(400).json({ error: 'Payload too large' });
      }

      const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
      if (hasBlobToken) {
        const blob = await put('data/projects.json', buffer, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json; charset=utf-8',
        });
        return res.status(200).json({ ok: true, url: blob.url, pathname: blob.pathname });
      }

      await writeJsonFile(LOCAL_PROJECTS_PATH, normalized);
      return res.status(200).json({ ok: true, pathname: 'local/projects.json' });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Save failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
