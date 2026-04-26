import { list } from '@vercel/blob';

function slugFromPathname(pathname) {
  const match = pathname.match(/^projects\/(.+)\.(jpg|jpeg|png|webp)$/i);
  return match ? match[1] : '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await list({ prefix: 'projects/' });
    const imageMap = {};
    for (const item of result.blobs) {
      const slug = slugFromPathname(item.pathname);
      if (slug) imageMap[slug] = item.url;
    }
    return res.status(200).json({ ok: true, images: imageMap });
  } catch {
    return res.status(200).json({ ok: true, images: {} });
  }
}
