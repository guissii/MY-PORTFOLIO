import { useEffect, useMemo, useState } from 'react';
import { projects as defaultProjects, type ProjectItem } from '@/data/projects';
import { hackathons as defaultHackathons, type HackathonItem } from '@/data/hackathons';

type BlobImage = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

type AdminAuth = {
  username: string;
  password: string;
};

type AnalyticsSnapshot = {
  updatedAt: string;
  total: number;
  byCountry: Record<string, number>;
  byDay?: Record<string, number>;
  byPath?: Record<string, number>;
};

const ADMIN_AUTH_STORAGE_KEY = 'admin_auth_v1';

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

const splitComma = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const buildProjectParagraphFallback = (project: ProjectItem) => {
  const chunks: string[] = [];
  const push = (value: unknown) => {
    const v = String(value || '').trim();
    if (v) chunks.push(v);
  };
  push(project.role);
  push(project.overview);
  if (Array.isArray(project.highlights) && project.highlights.length > 0) push(project.highlights.join('; '));
  if (Array.isArray(project.stack) && project.stack.length > 0) push(project.stack.join(', '));
  if (Array.isArray(project.architecture) && project.architecture.length > 0) push(project.architecture.join('; '));
  if (Array.isArray(project.technicalDescription) && project.technicalDescription.length > 0) push(project.technicalDescription.join(' '));
  return chunks.join(' ');
};

export default function AdminPhotosPage() {
  const [auth, setAuth] = useState<AdminAuth | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [mode, setMode] = useState<'projects' | 'hackathons' | 'stats'>('projects');
  const [panel, setPanel] = useState<'content' | 'photos'>('content');
  const [projectItems, setProjectItems] = useState<ProjectItem[]>(defaultProjects);
  const [selectedSlug, setSelectedSlug] = useState(defaultProjects[0]?.slug ?? '');
  const [hackathonItems, setHackathonItems] = useState<HackathonItem[]>(defaultHackathons);
  const [selectedHackathonSlug, setSelectedHackathonSlug] = useState(defaultHackathons[0]?.slug ?? '');
  const [projectSearch, setProjectSearch] = useState('');
  const [hackathonSearch, setHackathonSearch] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [images, setImages] = useState<BlobImage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<ProjectItem | null>(null);
  const [hackathonDraft, setHackathonDraft] = useState<HackathonItem | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newHackathonSlug, setNewHackathonSlug] = useState('');
  const [newHackathonName, setNewHackathonName] = useState('');
  const [bootstrapped, setBootstrapped] = useState(false);

  const authHeaders = useMemo(() => {
    if (!auth?.password) return null;
    const headers: Record<string, string> = { 'x-admin-password': auth.password };
    if (auth.username) headers['x-admin-username'] = auth.username;
    return headers;
  }, [auth]);

  const slugOptions = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    const base = projectItems.map((p) => ({ slug: p.slug, title: p.title, hidden: Boolean(p.hidden) }));
    if (!q) return base;
    return base.filter((item) => item.slug.toLowerCase().includes(q) || item.title.toLowerCase().includes(q));
  }, [projectItems, projectSearch]);
  const hackathonOptions = useMemo(() => {
    const q = hackathonSearch.trim().toLowerCase();
    const base = hackathonItems.map((h) => ({ slug: h.slug, name: h.name }));
    if (!q) return base;
    return base.filter((item) => item.slug.toLowerCase().includes(q) || item.name.toLowerCase().includes(q));
  }, [hackathonItems, hackathonSearch]);

  const selectedProject = useMemo(
    () => projectItems.find((p) => p.slug === selectedSlug) ?? null,
    [projectItems, selectedSlug]
  );
  const selectedHackathon = useMemo(
    () => hackathonItems.find((h) => h.slug === selectedHackathonSlug) ?? null,
    [hackathonItems, selectedHackathonSlug]
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AdminAuth> | null;
      if (!parsed || typeof parsed !== 'object') return;
      if (typeof parsed.password !== 'string') return;
      const username = typeof parsed.username === 'string' ? parsed.username : '';
      setAuth({ username, password: parsed.password });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (!auth) {
        sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        return;
      }
      sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(auth));
    } catch {
      // ignore
    }
  }, [auth]);

  useEffect(() => {
    if (selectedSlug && selectedProject) return;
    if (projectItems.length === 0) return;
    setSelectedSlug(projectItems[0].slug);
  }, [projectItems, selectedProject, selectedSlug]);

  useEffect(() => {
    if (selectedHackathonSlug && selectedHackathon) return;
    if (hackathonItems.length === 0) return;
    setSelectedHackathonSlug(hackathonItems[0].slug);
  }, [hackathonItems, selectedHackathon, selectedHackathonSlug]);

  useEffect(() => {
    if (!selectedProject) {
      setDraft(null);
      return;
    }
    const cloned = JSON.parse(JSON.stringify(selectedProject)) as ProjectItem;
    const existing = typeof cloned.description === 'string' ? cloned.description.trim() : '';
    if (!existing) {
      cloned.description = buildProjectParagraphFallback(cloned);
    }
    setDraft(cloned);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedHackathon) {
      setHackathonDraft(null);
      return;
    }
    setHackathonDraft(JSON.parse(JSON.stringify(selectedHackathon)) as HackathonItem);
  }, [selectedHackathon]);

  useEffect(() => {
    if (!authHeaders || bootstrapped) return;
    setBootstrapped(true);
    (async () => {
      try {
        setStatus('Chargement...');
        await fetchProjects(authHeaders);
        await fetchHackathons(authHeaders);
        try {
          const snapshot = await fetchAnalytics(authHeaders);
          setAnalytics(snapshot);
        } catch {
          setAnalytics(null);
        }
        if (panel === 'photos') {
          await loadImages();
        }
        setStatus('Connecte.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Chargement echoue');
      }
    })();
  }, [authHeaders, bootstrapped, panel]);

  useEffect(() => {
    if (!authHeaders) return;
    if (panel !== 'photos') return;
    if (mode === 'stats') return;
    loadImages();
  }, [authHeaders, panel, mode, selectedSlug, selectedHackathonSlug]);

  const fetchProjects = async (headers: Record<string, string>) => {
    const res = await fetch('/api/admin/projects', {
      method: 'GET',
      headers,
    });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('API admin indisponible. Verifiez que le serveur est relance.');
    }
    if (res.status === 401) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Identifiants invalides');
    }
    if (res.status === 404) {
      setProjectItems(defaultProjects);
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Erreur de chargement');
    if (!Array.isArray(data.projects)) throw new Error('Format projets invalide');
    setProjectItems(data.projects);
  };

  const fetchHackathons = async (headers: Record<string, string>) => {
    const res = await fetch('/api/admin/hackathons', {
      method: 'GET',
      headers,
    });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('API admin indisponible. Verifiez que le serveur est relance.');
    }
    if (res.status === 401) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Identifiants invalides');
    }
    if (res.status === 404) {
      setHackathonItems(defaultHackathons);
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Erreur de chargement');
    if (!Array.isArray(data.hackathons)) throw new Error('Format hackathons invalide');
    setHackathonItems(data.hackathons);
  };

  const fetchAnalytics = async (headers: Record<string, string>): Promise<AnalyticsSnapshot> => {
    const res = await fetch('/api/admin/analytics', {
      method: 'GET',
      headers,
    });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('API admin indisponible. Verifiez que le serveur est relance.');
    }
    if (res.status === 401) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Identifiants invalides');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Erreur de chargement');
    if (!data?.analytics || typeof data.analytics !== 'object') {
      throw new Error('Format analytics invalide');
    }
    const raw = data.analytics as AnalyticsSnapshot;
    return {
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
      total: Number.isFinite(raw.total) ? Number(raw.total) : 0,
      byCountry: raw.byCountry && typeof raw.byCountry === 'object' ? (raw.byCountry as Record<string, number>) : {},
      byDay: raw.byDay && typeof raw.byDay === 'object' ? (raw.byDay as Record<string, number>) : {},
      byPath: raw.byPath && typeof raw.byPath === 'object' ? (raw.byPath as Record<string, number>) : {},
    };
  };

  const fetchImages = async (headers: Record<string, string>, prefix?: string): Promise<BlobImage[]> => {
    const query = prefix ? `?prefix=${encodeURIComponent(prefix)}` : '';
    const res = await fetch(`/api/admin/list-images${query}`, {
      method: 'GET',
      headers,
    });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('API admin indisponible. Verifiez que le serveur est relance.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Erreur de chargement');
    return Array.isArray(data.images) ? data.images : [];
  };

  const signIn = async () => {
    const username = loginUsername.trim();
    const password = loginPassword;
    if (!password) {
      setStatus('Mot de passe obligatoire.');
      return;
    }
    setLoading(true);
    setStatus('Connexion...');
    try {
      const headers: Record<string, string> = { 'x-admin-password': password };
      if (username) headers['x-admin-username'] = username;
      await fetchProjects(headers);
      await fetchHackathons(headers);
      try {
        const snapshot = await fetchAnalytics(headers);
        setAnalytics(snapshot);
      } catch {
        setAnalytics(null);
      }
      try {
        const imgs = await fetchImages(headers, 'projects/');
        setImages(imgs);
      } catch {
        setImages([]);
      }
      setAuth({ username, password });
      setStatus('Connecte.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Connexion echouee');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setAuth(null);
    setLoginPassword('');
    setSelectedFiles([]);
    setFileInputKey((k) => k + 1);
    setImages([]);
    setMode('projects');
    setPanel('content');
    setStatus('Deconnecte.');
  };

  const loadProjects = async () => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    setLoading(true);
    setStatus('Chargement des projets...');
    try {
      await fetchProjects(authHeaders);
      setStatus('Projets charges.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadHackathons = async () => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    setLoading(true);
    setStatus('Chargement des hackathons...');
    try {
      await fetchHackathons(authHeaders);
      setStatus('Hackathons charges.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const saveProjects = async () => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    setLoading(true);
    setStatus('Sauvegarde des projets...');
    try {
      const effectiveProjects = draft ? projectItems.map((p) => (p.slug === draft.slug ? draft : p)) : projectItems;
      if (draft) {
        setProjectItems(effectiveProjects);
      }
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ projects: effectiveProjects }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sauvegarde echouee');
      setStatus('Projets sauvegardes.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Sauvegarde echouee');
    } finally {
      setLoading(false);
    }
  };

  const saveHackathons = async () => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    setLoading(true);
    setStatus('Sauvegarde des hackathons...');
    try {
      const effectiveHackathons = hackathonDraft
        ? hackathonItems.map((h) => (h.slug === hackathonDraft.slug ? hackathonDraft : h))
        : hackathonItems;

      if (hackathonDraft) {
        setHackathonItems(effectiveHackathons);
      }
      const res = await fetch('/api/admin/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ hackathons: effectiveHackathons }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sauvegarde echouee');
      setStatus('Hackathons sauvegardes.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Sauvegarde echouee');
    } finally {
      setLoading(false);
    }
  };

  const applyDraft = () => {
    if (!draft) {
      setStatus('Aucun projet selectionne.');
      return;
    }
    setProjectItems((prev) => prev.map((p) => (p.slug === draft.slug ? draft : p)));
    setStatus('Modifications appliquees (pensez a sauvegarder).');
  };

  const applyHackathonDraft = () => {
    if (!hackathonDraft) {
      setStatus('Aucun hackathon selectionne.');
      return;
    }
    setHackathonItems((prev) => prev.map((h) => (h.slug === hackathonDraft.slug ? hackathonDraft : h)));
    setStatus('Modifications appliquees (pensez a sauvegarder).');
  };

  const createProject = () => {
    const slug = newSlug.trim().toLowerCase();
    const title = newTitle.trim();
    if (!slug || !title) {
      setStatus('Nouveau projet: slug et titre sont obligatoires.');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setStatus('Slug invalide: utilisez seulement a-z, 0-9 et -');
      return;
    }
    if (projectItems.some((p) => p.slug === slug)) {
      setStatus('Slug deja utilise.');
      return;
    }
    const now = new Date();
    const month = now.toLocaleDateString('fr-FR', { month: 'long' });
    const year = now.getFullYear();
    const newItem: ProjectItem = {
      slug,
      title,
      subtitle: '',
      category: 'Web',
      tags: [],
      github: '',
      link: '',
      image: '',
      hidden: false,
      coverImagePathname: '',
      description: '',
      realizationDate: `${month} ${year}`,
      lastUpdate: `${month} ${year}`,
      role: '',
      overview: '',
      highlights: [],
      stack: [],
      architecture: [],
      technicalDescription: [],
    };
    setProjectItems((prev) => [newItem, ...prev]);
    setSelectedSlug(slug);
    setNewSlug('');
    setNewTitle('');
    setStatus('Projet cree (pensez a sauvegarder).');
  };

  const deleteProject = () => {
    if (!selectedProject) {
      setStatus('Aucun projet selectionne.');
      return;
    }
    const ok = window.confirm(`Supprimer le projet "${selectedProject.title}" ?`);
    if (!ok) return;
    setProjectItems((prev) => prev.filter((p) => p.slug !== selectedProject.slug));
    setStatus('Projet supprime (pensez a sauvegarder).');
  };

  const createHackathon = () => {
    const slug = newHackathonSlug.trim().toLowerCase();
    const name = newHackathonName.trim();
    if (!slug || !name) {
      setStatus('Nouveau hackathon: slug et nom sont obligatoires.');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setStatus('Slug invalide: utilisez seulement a-z, 0-9 et -');
      return;
    }
    if (hackathonItems.some((h) => h.slug === slug)) {
      setStatus('Slug deja utilise.');
      return;
    }
    const newItem: HackathonItem = {
      slug,
      name,
      period: '',
      result: '',
      detail: '',
    };
    setHackathonItems((prev) => [newItem, ...prev]);
    setSelectedHackathonSlug(slug);
    setNewHackathonSlug('');
    setNewHackathonName('');
    setStatus('Hackathon cree (pensez a sauvegarder).');
  };

  const deleteHackathon = () => {
    if (!selectedHackathon) {
      setStatus('Aucun hackathon selectionne.');
      return;
    }
    const ok = window.confirm(`Supprimer le hackathon "${selectedHackathon.name}" ?`);
    if (!ok) return;
    setHackathonItems((prev) => prev.filter((h) => h.slug !== selectedHackathon.slug));
    setStatus('Hackathon supprime (pensez a sauvegarder).');
  };

  const setCoverImage = (pathname: string) => {
    if (mode === 'projects') {
      if (!selectedProject) {
        setStatus('Aucun projet selectionne.');
        return;
      }
      setProjectItems((prev) => prev.map((p) => (p.slug === selectedProject.slug ? { ...p, coverImagePathname: pathname } : p)));
      setDraft((prev) => (prev && prev.slug === selectedProject.slug ? { ...prev, coverImagePathname: pathname } : prev));
      setStatus('Couverture definie (pensez a sauvegarder).');
      return;
    }
    if (!selectedHackathon) {
      setStatus('Aucun hackathon selectionne.');
      return;
    }
    setHackathonItems((prev) => prev.map((h) => (h.slug === selectedHackathon.slug ? { ...h, coverImagePathname: pathname } : h)));
    setHackathonDraft((prev) => (prev && prev.slug === selectedHackathon.slug ? { ...prev, coverImagePathname: pathname } : prev));
    setStatus('Couverture definie (pensez a sauvegarder).');
  };

  const loadImages = async () => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    if (mode === 'stats') {
      setStatus('Mode stats.');
      return;
    }
    setLoading(true);
    setStatus('Chargement des images...');
    try {
      if (mode === 'hackathons') {
        const prefix = selectedHackathonSlug ? `hackathons/${selectedHackathonSlug.toLowerCase()}/` : 'hackathons/';
        const imgs = await fetchImages(authHeaders, prefix);
        setImages(imgs);
      } else {
        const slug = selectedSlug.toLowerCase();
        const folderPrefix = slug ? `projects/${slug}/` : 'projects/';
        let imgs = await fetchImages(authHeaders, folderPrefix);
        if (slug && imgs.length === 0) {
          const all = await fetchImages(authHeaders, 'projects/');
          imgs = all.filter((img) => {
            const p = String(img?.pathname || '');
            return p.startsWith(`projects/${slug}/`) || p.startsWith(`projects/${slug}.`);
          });
        }
        setImages(imgs);
      }
      setStatus('Images chargees.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    setLoading(true);
    setStatus('Chargement des statistiques...');
    try {
      const snapshot = await fetchAnalytics(authHeaders);
      setAnalytics(snapshot);
      setStatus('Stats chargees.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    const slug = mode === 'hackathons' ? selectedHackathonSlug : selectedSlug;
    if (!slug || selectedFiles.length === 0) {
      setStatus(mode === 'hackathons' ? 'Hackathon et fichiers sont obligatoires.' : 'Projet et fichiers sont obligatoires.');
      return;
    }
    setLoading(true);
    setStatus('Upload en cours...');
    try {
      for (let i = 0; i < selectedFiles.length; i += 1) {
        const file = selectedFiles[i];
        if (!file.type.startsWith('image/')) {
          throw new Error('Tous les fichiers doivent etre des images.');
        }
        setStatus(`Upload ${i + 1}/${selectedFiles.length}...`);
        const base64Data = await fileToBase64(file);

        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify({
            collection: mode,
            slug,
            contentType: file.type,
            base64Data,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload echoue');
      }
      setStatus('Upload termine.');
      setSelectedFiles([]);
      setFileInputKey((k) => k + 1);
      await loadImages();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload echoue');
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (url: string) => {
    if (!authHeaders) {
      setStatus('Connectez-vous.');
      return;
    }
    setLoading(true);
    setStatus('Suppression en cours...');
    try {
      const res = await fetch('/api/admin/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
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

        {!auth ? (
          <div className="rounded-2xl p-6 md:p-10" style={{ backgroundColor: '#0D0B1E', border: '1px solid rgba(201,162,39,0.25)' }}>
            <h1 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px,4vw,46px)', marginBottom: '8px' }}>
              Admin
            </h1>
            <p style={{ color: '#BEBAD0', fontFamily: 'var(--font-body)', marginBottom: '18px' }}>
              Connexion requise pour acceder au panneau d administration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <input
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Identifiant"
                className="rounded-lg px-3 py-2"
                style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                autoComplete="username"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Mot de passe"
                className="rounded-lg px-3 py-2"
                style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={signIn}
                disabled={loading}
                className="rounded-lg px-4 py-2"
                style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
              >
                Se connecter
              </button>
            </div>

            <p style={{ color: '#D2CDDE', fontFamily: 'var(--font-body)', fontSize: '13px' }}>{status}</p>
          </div>
        ) : (
        <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#0D0B1E', border: '1px solid rgba(201,162,39,0.25)' }}>
          <h1 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px,4vw,46px)', marginBottom: '8px' }}>
            Admin
          </h1>
          <p style={{ color: '#BEBAD0', fontFamily: 'var(--font-body)', marginBottom: '18px' }}>
            {mode === 'stats'
              ? 'Statistiques de visites (pays d origine).'
              : mode === 'hackathons'
                ? 'Gestion des hackathons + photos.'
                : 'Gestion des projets (contenu + images) via Vercel Blob.'}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div style={{ color: '#BEBAD0', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              Connecte: {auth.username}
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={loading}
              className="rounded-lg px-4 py-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F0E6FF', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.14)' }}
            >
              Deconnexion
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setMode('projects');
                setPanel('content');
                setImages([]);
                setStatus('');
              }}
              disabled={loading}
              className="rounded-lg px-4 py-2"
              style={{
                backgroundColor: mode === 'projects' ? '#C9A227' : 'rgba(255,255,255,0.08)',
                color: mode === 'projects' ? '#0D0B1E' : '#F0E6FF',
                fontFamily: 'var(--font-mono)',
                border: mode === 'projects' ? '1px solid rgba(201,162,39,0.5)' : '1px solid rgba(255,255,255,0.14)',
              }}
            >
              Projets
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('hackathons');
                setPanel('content');
                setImages([]);
                setStatus('');
              }}
              disabled={loading}
              className="rounded-lg px-4 py-2"
              style={{
                backgroundColor: mode === 'hackathons' ? '#C9A227' : 'rgba(255,255,255,0.08)',
                color: mode === 'hackathons' ? '#0D0B1E' : '#F0E6FF',
                fontFamily: 'var(--font-mono)',
                border: mode === 'hackathons' ? '1px solid rgba(201,162,39,0.5)' : '1px solid rgba(255,255,255,0.14)',
              }}
            >
              Hackathons
            </button>
            <button
              type="button"
              onClick={async () => {
                setMode('stats');
                setPanel('content');
                setImages([]);
                setStatus('');
                await loadAnalytics();
              }}
              disabled={loading}
              className="rounded-lg px-4 py-2"
              style={{
                backgroundColor: mode === 'stats' ? '#C9A227' : 'rgba(255,255,255,0.08)',
                color: mode === 'stats' ? '#0D0B1E' : '#F0E6FF',
                fontFamily: 'var(--font-mono)',
                border: mode === 'stats' ? '1px solid rgba(201,162,39,0.5)' : '1px solid rgba(255,255,255,0.14)',
              }}
            >
              Stats
            </button>
          </div>

          {mode !== 'stats' && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                type="button"
                onClick={() => setPanel('content')}
                disabled={loading}
                className="rounded-lg px-4 py-2"
                style={{
                  backgroundColor: panel === 'content' ? '#C9A227' : 'rgba(255,255,255,0.08)',
                  color: panel === 'content' ? '#0D0B1E' : '#F0E6FF',
                  fontFamily: 'var(--font-mono)',
                  border: panel === 'content' ? '1px solid rgba(201,162,39,0.5)' : '1px solid rgba(255,255,255,0.14)',
                }}
              >
                Contenu
              </button>
              <button
                type="button"
                onClick={() => setPanel('photos')}
                disabled={loading}
                className="rounded-lg px-4 py-2"
                style={{
                  backgroundColor: panel === 'photos' ? '#C9A227' : 'rgba(255,255,255,0.08)',
                  color: panel === 'photos' ? '#0D0B1E' : '#F0E6FF',
                  fontFamily: 'var(--font-mono)',
                  border: panel === 'photos' ? '1px solid rgba(201,162,39,0.5)' : '1px solid rgba(255,255,255,0.14)',
                }}
              >
                Photos
              </button>
            </div>
          )}

          {mode === 'stats' ? (
            <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: '#17142A', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div style={{ color: '#C9A227', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Visites</div>
                  <div style={{ color: '#BEBAD0', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    Maj: {analytics?.updatedAt ? new Date(analytics.updatedAt).toLocaleString() : '—'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={loadAnalytics}
                  disabled={loading}
                  className="rounded-lg px-4 py-2"
                  style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
                >
                  Rafraichir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl p-4" style={{ backgroundColor: '#0D0B1E', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ color: '#BEBAD0', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>Total</div>
                  <div style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: '22px' }}>{analytics?.total ?? 0}</div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="grid grid-cols-2 px-4 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#BEBAD0', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  <div>Pays</div>
                  <div style={{ textAlign: 'right' }}>Vues</div>
                </div>
                {(Object.entries(analytics?.byCountry ?? {}) as Array<[string, number]>)
                  .sort((a, b) => Number(b[1]) - Number(a[1]))
                  .map(([country, count]) => (
                    <div key={country} className="grid grid-cols-2 px-4 py-2" style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{country}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'right' }}>{count}</div>
                    </div>
                  ))}
                {Object.keys(analytics?.byCountry ?? {}).length === 0 && (
                  <div className="px-4 py-3" style={{ backgroundColor: '#0D0B1E', color: '#BEBAD0', fontFamily: 'var(--font-body)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    Aucune donnee pour le moment.
                  </div>
                )}
              </div>
            </div>
          ) : mode === 'projects' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Rechercher (slug ou titre)"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <select
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="md:col-span-1 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {slugOptions.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.title}
                      {item.hidden ? ' (masque)' : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={async () => {
                    setPanel('photos');
                    await loadImages();
                  }}
                  disabled={loading}
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
                >
                  Images
                </button>
                <button
                  type="button"
                  onClick={loadProjects}
                  disabled={loading}
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F0E6FF', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.14)' }}
                >
                  Rafraichir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="Nouveau slug (ex: mon-projet)"
                  className="md:col-span-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nouveau titre"
                  className="md:col-span-3 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <button
                  type="button"
                  onClick={createProject}
                  disabled={loading}
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
                >
                  Creer
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input
                  value={hackathonSearch}
                  onChange={(e) => setHackathonSearch(e.target.value)}
                  placeholder="Rechercher (slug ou nom)"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <select
                  value={selectedHackathonSlug}
                  onChange={(e) => setSelectedHackathonSlug(e.target.value)}
                  className="md:col-span-1 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {hackathonOptions.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={async () => {
                    setPanel('photos');
                    await loadImages();
                  }}
                  disabled={loading}
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
                >
                  Photos
                </button>
                <button
                  type="button"
                  onClick={loadHackathons}
                  disabled={loading}
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F0E6FF', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.14)' }}
                >
                  Rafraichir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
                <input
                  value={newHackathonSlug}
                  onChange={(e) => setNewHackathonSlug(e.target.value)}
                  placeholder="Nouveau slug (ex: hackathon-2026)"
                  className="md:col-span-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={newHackathonName}
                  onChange={(e) => setNewHackathonName(e.target.value)}
                  placeholder="Nom hackathon"
                  className="md:col-span-3 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <button
                  type="button"
                  onClick={createHackathon}
                  disabled={loading}
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
                >
                  Creer
                </button>
              </div>
            </>
          )}

          {panel === 'content' && mode === 'projects' && draft && (
            <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: '#17142A', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div style={{ color: '#C9A227', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    Edition projet
                  </div>
                  <div style={{ color: '#BEBAD0', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    slug: {draft.slug}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={applyDraft}
                    disabled={loading}
                    className="rounded-lg px-4 py-2"
                    style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
                  >
                    Appliquer
                  </button>
                  <button
                    type="button"
                    onClick={saveProjects}
                    disabled={loading}
                    className="rounded-lg px-4 py-2"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F0E6FF', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.14)' }}
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    onClick={deleteProject}
                    disabled={loading}
                    className="rounded-lg px-4 py-2"
                    style={{ backgroundColor: '#7F1D1D', color: '#FEE2E2', fontFamily: 'var(--font-mono)' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
                  placeholder="Titre"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={draft.subtitle}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, subtitle: e.target.value } : prev))}
                  placeholder="Sous-titre"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={draft.category}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, category: e.target.value } : prev))}
                  placeholder="Categorie (Web/IA/...)"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <label
                  className="rounded-lg px-3 py-2 flex items-center gap-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(draft.hidden)}
                    onChange={(e) => setDraft((prev) => (prev ? { ...prev, hidden: e.target.checked } : prev))}
                  />
                  Masquer sur landing
                </label>
                <input
                  value={draft.tags.join(', ')}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, tags: splitComma(e.target.value) } : prev))}
                  placeholder="Tags (separes par virgule)"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={draft.github}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, github: e.target.value } : prev))}
                  placeholder="Lien GitHub"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={draft.link}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, link: e.target.value } : prev))}
                  placeholder="Lien demo"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={draft.image}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, image: e.target.value } : prev))}
                  placeholder="Image fallback (ex: /projects/xxx.jpg)"
                  className="md:col-span-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={draft.realizationDate}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, realizationDate: e.target.value } : prev))}
                  placeholder="Date realisation"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={draft.lastUpdate}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, lastUpdate: e.target.value } : prev))}
                  placeholder="Derniere maj"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <textarea
                  value={draft.description || ''}
                  onChange={(e) => setDraft((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
                  placeholder="Description (un seul paragraphe)"
                  className="md:col-span-2 rounded-lg px-3 py-2 min-h-[180px]"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
              </div>
            </div>
          )}

          {panel === 'content' && mode === 'hackathons' && hackathonDraft && (
            <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: '#17142A', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div style={{ color: '#C9A227', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    Edition hackathon
                  </div>
                  <div style={{ color: '#BEBAD0', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    slug: {hackathonDraft.slug}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={applyHackathonDraft}
                    disabled={loading}
                    className="rounded-lg px-4 py-2"
                    style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
                  >
                    Appliquer
                  </button>
                  <button
                    type="button"
                    onClick={saveHackathons}
                    disabled={loading}
                    className="rounded-lg px-4 py-2"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F0E6FF', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.14)' }}
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    onClick={deleteHackathon}
                    disabled={loading}
                    className="rounded-lg px-4 py-2"
                    style={{ backgroundColor: '#7F1D1D', color: '#FEE2E2', fontFamily: 'var(--font-mono)' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  value={hackathonDraft.name}
                  onChange={(e) => setHackathonDraft((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                  placeholder="Nom"
                  className="md:col-span-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={hackathonDraft.period}
                  onChange={(e) => setHackathonDraft((prev) => (prev ? { ...prev, period: e.target.value } : prev))}
                  placeholder="Periode (ex: 2026)"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <input
                  value={hackathonDraft.result}
                  onChange={(e) => setHackathonDraft((prev) => (prev ? { ...prev, result: e.target.value } : prev))}
                  placeholder="Resultat"
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
                <textarea
                  value={hackathonDraft.detail}
                  onChange={(e) => setHackathonDraft((prev) => (prev ? { ...prev, detail: e.target.value } : prev))}
                  placeholder="Details"
                  className="md:col-span-2 rounded-lg px-3 py-2 min-h-[120px]"
                  style={{ backgroundColor: '#0D0B1E', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
                />
              </div>
            </div>
          )}

          {panel === 'photos' && (
            <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: '#17142A', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div style={{ color: '#BEBAD0', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  Dossier: {mode === 'hackathons' ? `hackathons/${selectedHackathonSlug.toLowerCase()}/` : `projects/${selectedSlug.toLowerCase()}/`}
                </div>
                <button
                  type="button"
                  onClick={loadImages}
                  disabled={loading}
                  className="rounded-lg px-3 py-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F0E6FF', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.14)' }}
                >
                  Rafraichir images
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                className="rounded-lg px-3 py-2"
                style={{ backgroundColor: '#17142A', color: '#F0E6FF', border: '1px solid rgba(255,255,255,0.12)' }}
              />
              <button
                type="button"
                onClick={uploadImage}
                disabled={loading || selectedFiles.length === 0}
                className="rounded-lg px-4 py-2"
                style={{ backgroundColor: '#C9A227', color: '#0D0B1E', fontFamily: 'var(--font-mono)' }}
              >
                Ajouter ({selectedFiles.length})
              </button>
              </div>
            </div>
          )}

          <div
            className="rounded-xl px-4 py-3 mb-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#D2CDDE',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
            }}
          >
            {status || 'Pret.'}
          </div>

          {panel === 'photos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => {
                const currentCover =
                  mode === 'hackathons' ? selectedHackathon?.coverImagePathname : selectedProject?.coverImagePathname;
                const isCover = Boolean(currentCover) && currentCover === img.pathname;
                return (
                  <article
                    key={img.url}
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: isCover ? '1px solid rgba(201,162,39,0.6)' : '1px solid rgba(255,255,255,0.14)',
                      backgroundColor: '#17142A',
                    }}
                  >
                    <img src={img.url} alt={img.pathname} className="w-full h-[170px] object-cover" loading="lazy" />
                    <div className="p-3">
                      <div className="truncate" style={{ color: '#F0E6FF', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '6px' }}>
                        {img.pathname}
                      </div>
                      <div style={{ color: '#BEBAD0', fontSize: '12px', marginBottom: '10px' }}>
                        {(img.size / 1024).toFixed(1)} KB · {new Date(img.uploadedAt).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setCoverImage(img.pathname)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-lg"
                          style={{
                            backgroundColor: isCover ? 'rgba(201,162,39,0.18)' : 'rgba(255,255,255,0.08)',
                            color: isCover ? '#C9A227' : '#F0E6FF',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            border: isCover ? '1px solid rgba(201,162,39,0.32)' : '1px solid rgba(255,255,255,0.14)',
                          }}
                        >
                          {isCover ? 'Couverture' : 'Definir cover'}
                        </button>
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
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        )}
      </div>
    </section>
  );
}
