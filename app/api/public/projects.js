import { list } from '@vercel/blob';
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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const projects = await readProjects();
    if (!projects) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ ok: true, projects });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Read failed' });
  }
}
