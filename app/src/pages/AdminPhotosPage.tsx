import { useMemo, useState } from 'react';
import { projects } from '@/data/projects';

type BlobImage = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const payload = result.includes(',') ? result.split(',')[1] : '';
      if (!payload) {
        reject(new Error('Encodage image invalide'));
        return;
      }
      resolve(payload);
    };
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.readAsDataURL(file);
  });

export default function AdminPhotosPage() {
  const [password, setPassword] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [images, setImages] = useState<BlobImage[]>([]);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const slugOptions = useMemo(() => projects.map((p) => ({ slug: p.slug, title: p.title })), []);

  const loadImages = async () => {
    if (!password) {
      setStatus('Entrez le mot de passe admin.');
      return;
    }
    setLoading(true);
    setStatus('Chargement des images...');
    try {
      const res = await fetch('/api/admin/list-images', {
        method: 'GET',
        headers: { 'x-admin-password': password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de chargement');
      setImages(data.images || []);
      setStatus('Images chargees.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (!password || !selectedSlug || !selectedFile) {
      setStatus('Mot de passe, projet et fichier sont obligatoires.');
      return;
    }
    if (!selectedFile.type.startsWith('image/')) {
      setStatus('Le fichier doit etre une image.');
      return;
    }
    setLoading(true);
    setStatus('Upload en cours...');
    try {
      const base64Data = await fileToBase64(selectedFile);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          slug: selectedSlug,
          contentType: selectedFile.type,
          base64Data,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload echoue');
      setStatus(`Image ajoutee: ${data.pathname}`);
      setSelectedFile(null);
      await loadImages();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload echoue');
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (url: string) => {
    if (!password) {
      setStatus('Entrez le mot de passe admin.');
      return;
    }
    setLoading(true);
    setStatus('Suppression en cours...');
    try {
      const res = await fetch('/api/admin/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Suppression echouee');
      setStatus('Image supprimee.');
      await loadImages();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Suppression echouee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ minHeight: '100vh', padding: '84px var(--section-pad-x)' }}>
      <div className="mx-auto max-w-[1100px]">
        <button
          type="button"
          onClick={() => {
            window.location.hash = '/';
          }}
          className="mb-6 px-4 py-2 rounded-lg"
          style={{ border: '1px solid rgba(201,162,39,0.5)', color: '#C9A227', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        >
          ← RETOUR
        </button>

        <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#0D0B1E', border: '1px solid rgba(201,162,39,0.25)' }}>
          <h1 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px,4vw,46px)', marginBottom: '8px' }}>
            Admin Photos Projets
          </h1>
          <p style={{ color: '#BEBAD0', fontFamily: 'var(--font-body)', marginBottom: '18px' }}>
            Upload et suppression des petites images projet via Vercel Blob.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="md:col-span-2 rounded-lg px-3 py-2"
              style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="rounded-lg px-3 py-2"
              style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {slugOptions.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={loadImages}
              disabled={loading}
              className="rounded-lg px-3 py-2"
              style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
            >
              Rafraichir
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="rounded-lg px-3 py-2"
              style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
            />
            <button
              type="button"
              onClick={uploadImage}
              disabled={loading}
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
            >
              Ajouter/Remplacer
            </button>
          </div>

          <p style={{ color: '#D2CDDE', fontFamily: 'var(--font-body)', fontSize: '13px', marginBottom: '16px' }}>{status}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <article key={img.url} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.14)', backgroundColor: '#17142A' }}>
                <img src={img.url} alt={img.pathname} className="w-full h-[170px] object-cover" loading="lazy" />
                <div className="p-3">
                  <div className="truncate" style={{ color: '#F0E6FF', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '6px' }}>
                    {img.pathname}
                  </div>
                  <div style={{ color: '#BEBAD0', fontSize: '12px', marginBottom: '8px' }}>
                    {(img.size / 1024).toFixed(1)} KB · {new Date(img.uploadedAt).toLocaleDateString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteImage(img.url)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: '#7F1D1D', color: '#FEE2E2', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
