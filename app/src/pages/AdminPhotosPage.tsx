import { useEffect, useMemo, useState } from 'react';
import { projects as defaultProjects, type ProjectItem } from '@/data/projects';
import { hackathons as defaultHackathons, type HackathonItem } from '@/data/hackathons';


import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

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

  const coerceMode = (value: string): 'projects' | 'hackathons' | 'stats' => {
    if (value === 'projects' || value === 'hackathons' || value === 'stats') return value;
    return 'projects';
  };

  const coercePanel = (value: string): 'content' | 'photos' => {
    if (value === 'photos' || value === 'content') return value;
    return 'content';
  };

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
    const ALLOWED_EXTS = /\.(jpg|jpeg|png|gif|webp|avif|svg|pdf|ppt|pptx)$/i;
    const ALLOWED_TYPES = ['image/', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    setLoading(true);
    setStatus('Upload en cours...');
    try {
      for (let i = 0; i < selectedFiles.length; i += 1) {
        const file = selectedFiles[i];
        const nameOk = ALLOWED_EXTS.test(file.name);
        const typeOk = ALLOWED_TYPES.some(t => file.type.startsWith(t) || file.type === t);
        if (!nameOk && !typeOk) {
          throw new Error(`Fichier "${file.name}" non supporté. Formats acceptés : Images, PDF, PowerPoint.`);
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


  const renderLogin = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md bg-[var(--bg-card)] border-[var(--border)] text-[#f1f5f9] card-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none hero-glow bg-[var(--gold)] opacity-5 blur-3xl rounded-full scale-150"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-title)' }}>Espace Admin</CardTitle>
          <CardDescription className="text-[#cbd5e1] font-sans">Connexion requise pour accéder au panneau d'administration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs uppercase tracking-wider text-[#cbd5e1]">Identifiant</Label>
            <Input id="username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Identifiant" className="bg-[#080b14] border-[var(--border)] text-[#f1f5f9] focus:ring-1 focus:ring-[var(--gold)]" autoComplete="username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-[#cbd5e1]">Mot de passe</Label>
            <Input id="password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="***" className="bg-[#080b14] border-[var(--border)] text-[#f1f5f9] focus:ring-1 focus:ring-[var(--gold)]" autoComplete="current-password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 relative z-10">
          <Button onClick={signIn} disabled={loading} className="w-full glow-tag py-5 text-xs tracking-widest">{loading ? 'Connexion en cours...' : 'Se connecter'}</Button>
          {status && <p className="text-sm text-[#D2CDDE] text-center font-mono mt-2">{status}</p>}
        </CardFooter>
      </Card>
    </div>
  );

  const renderStats = () => {
    const data = (Object.entries(analytics?.byCountry ?? {}) as Array<[string, number]>)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .map(([country, views]) => ({ country, views }));

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f1f5f9]">Statistiques Globales</h2>
            <p className="text-sm text-[#cbd5e1]">Dernière mise à jour : {analytics?.updatedAt ? new Date(analytics.updatedAt).toLocaleString() : '—'}</p>
          </div>
          <Button onClick={loadAnalytics} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white">Rafraîchir</Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#05070d] border-[rgba(200,150,42,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8962A] rounded-full opacity-5 -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[#cbd5e1] text-sm font-medium">Vues Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#f1f5f9]">{analytics?.total ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#05070d] border-[rgba(200,150,42,0.15)]">
          <CardHeader>
            <CardTitle className="text-[#f1f5f9]">Vues par pays</CardTitle>
            <CardDescription className="text-[#cbd5e1]">
              Répartition géographique des visiteurs de votre portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.length > 0 ? (
              <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="country" stroke="#cbd5e1" tick={{fill: '#cbd5e1'}} angle={-45} textAnchor="end" />
                    <YAxis stroke="#cbd5e1" tick={{fill: '#cbd5e1'}} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: 'rgba(10, 12, 18, 0.75)', borderColor: 'rgba(200,150,42,0.15)', color: '#f1f5f9', borderRadius: '8px' }}
                      itemStyle={{ color: '#C8962A', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="views" name="Vues" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.country === 'MA' ? '#10b981' : entry.country === 'FR' ? '#3b82f6' : '#C8962A'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-[#cbd5e1] border-t border-[rgba(255,255,255,0.05)] mt-4">Aucune donnée pour le moment.</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProjectForm = () => {
    if (!draft) return null;
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f1420] p-5 rounded-xl border border-[rgba(200,150,42,0.15)] shadow-lg">
          <div>
            <h3 className="text-xl font-bold text-[#C8962A] tracking-tight">{draft.title}</h3>
            <span className="text-xs text-[#cbd5e1] font-mono opacity-80 mt-1 block">slug: {draft.slug}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={applyDraft} disabled={loading} className="bg-[#C8962A] text-[#05070d] hover:bg-[#b08d22] glow-tag px-6">Appliquer modifs</Button>
            <Button onClick={saveProjects} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white px-6">Sauvegarder</Button>
            <Button onClick={deleteProject} disabled={loading} variant="destructive" className="bg-red-900/80 hover:bg-red-900 text-red-100 px-6">Sup.</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-[#05070d] border-[rgba(200,150,42,0.15)] lg:col-span-2 shadow-none">
            <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.06)]"><CardTitle className="text-[#f1f5f9] text-base">Informations Générales</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Titre</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
                <div className="space-y-2"><Label>Sous-titre / Rôle</Label><Input value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
                <div className="space-y-2"><Label>Catégorie</Label><Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
                <div className="space-y-2"><Label>Date réalisation</Label><Input value={draft.realizationDate} onChange={(e) => setDraft({ ...draft, realizationDate: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
              </div>
              <div className="space-y-2">
                <Label>Description Complète</Label>
                <Textarea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9] min-h-[160px] font-sans resize-y" />
              </div>
              <div className="space-y-2">
                <Label>Tags (séparés par virgule)</Label>
                <Input value={draft.tags.join(', ')} onChange={(e) => setDraft({ ...draft, tags: splitComma(e.target.value) })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9] font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#05070d] border-[rgba(200,150,42,0.15)] shadow-none">
            <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.06)]"><CardTitle className="text-[#f1f5f9] text-base">Liens & Médias</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Lien GitHub</Label><Input value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
              <div className="space-y-2"><Label>Lien Démo</Label><Input value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
              <div className="space-y-2">
                <Label>Image de couverture (fallback)</Label>
                <Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" placeholder="/images/projects/..." />
              </div>
              <div className="flex items-center space-x-2 pt-4 bg-[#080b14] p-3 rounded-md border border-[rgba(255,255,255,0.05)]">
                <Checkbox id="hidden-proj" checked={Boolean(draft.hidden)} onCheckedChange={(checked) => setDraft({ ...draft, hidden: Boolean(checked) })} className="border-[rgba(255,255,255,0.3)] data-[state=checked]:bg-[#C8962A] data-[state=checked]:text-[#05070d]" />
                <label htmlFor="hidden-proj" className="text-sm font-medium leading-none text-[#f1f5f9] cursor-pointer">Masquer sur l'accueil</label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderPhotos = (collectionInfo: { type: 'projects'|'hackathons', slug: string, currentCover: string | undefined }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-[rgba(10, 12, 18, 0.75)] border-[rgba(200,150,42,0.15)]">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.05)]">
          <div className="space-y-1">
            <CardTitle className="text-base text-[#f1f5f9]">Galerie Médias</CardTitle>
            <CardDescription className="text-[#cbd5e1] font-mono text-xs">Path: {collectionInfo.type}/{collectionInfo.slug}/</CardDescription>
            <p className="text-[10px] text-[#C8962A]/60 mt-1" style={{ fontFamily: 'var(--font-body)' }}>📷 Photos : 16:9, 1920×1080, JPG/WebP recommandé &nbsp;|&nbsp; 📄 PDF/PPT acceptés (max 10MB)</p>
          </div>
          <Button onClick={loadImages} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white">Rafraîchir images</Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[rgba(255,255,255,0.02)] p-2 rounded-lg border border-[rgba(255,255,255,0.05)]">
            <Input key={fileInputKey} type="file" accept="image/*,.pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} className="bg-[#05070d] border-[rgba(200,150,42,0.15)] text-[#f1f5f9] cursor-pointer file:text-[#C8962A]" />
            <Button onClick={uploadImage} disabled={loading || selectedFiles.length === 0} className="w-full sm:w-auto bg-[#C8962A] text-[#05070d] hover:bg-[#b08d22] whitespace-nowrap">Uploader ({selectedFiles.length})</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => {
          const isCover = Boolean(collectionInfo.currentCover) && collectionInfo.currentCover === img.pathname;
          return (
            <Card key={img.url} className={`bg-[rgba(10, 12, 18, 0.75)] border ${isCover ? 'border-[#C8962A] shadow-[0_0_15px_rgba(200,150,42,0.2)]' : 'border-[rgba(200,150,42,0.15)]'} overflow-hidden flex flex-col`}>
              <div className="relative aspect-video w-full bg-black/60 group overflow-hidden">
                <img src={img.url} alt={img.pathname} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                {isCover && <div className="absolute top-2 right-2 bg-[#C8962A] text-[#05070d] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider backdrop-blur-sm">Couverture</div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10, 12, 18, 0.75)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-3 pb-2 flex-grow">
                <p className="text-[#e2e8f0] text-xs font-mono truncate mb-1" title={img.pathname}>{img.pathname.split('/').pop()}</p>
                <p className="text-[#888] font-mono text-[10px]">{(img.size / 1024).toFixed(0)} KB • {new Date(img.uploadedAt).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex flex-nowrap gap-2 mt-auto">
                <Button onClick={() => setCoverImage(img.pathname)} disabled={loading || isCover} variant={isCover ? 'secondary' : 'outline'} size="sm" className={`text-xs flex-1 h-8 px-2 ${isCover ? 'bg-[#C8962A]/20 text-[#C8962A] hover:bg-[#C8962A]/30' : 'border-[rgba(255,255,255,0.1)] hover:bg-white/5 text-[#cbd5e1]'}`}>{isCover ? 'Actuelle' : 'Cover'}</Button>
                <Button onClick={() => deleteImage(img.url)} disabled={loading} variant="destructive" size="sm" className="bg-red-900/50 hover:bg-red-900 text-red-200 text-xs h-8 px-3 border border-red-900/50">Del</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-[#f1f5f9] selection:bg-[#C8962A] selection:text-[#05070d] bg-[var(--bg)] font-sans">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 pointer-events-none hero-bg opacity-15" />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top, rgba(8,11,20,0.6) 0%, rgba(8,11,20,0.98) 100%)' }} />

      {/* Admin Navbar */}
      <header className="fixed top-0 inset-x-0 h-[72px] z-[60] border-b border-[var(--border)] flex items-center justify-between px-6 md:px-12 bg-[#080b14]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg text-[#05070d] font-bold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', boxShadow: '0 0 15px rgba(200,150,42,0.3)' }}>
            MG
          </div>
          <span style={{ fontFamily: 'var(--font-title)', fontSize: '20px', color: '#f1f5f9', letterSpacing: '0.5px', fontWeight: 600 }}>Espace Privé</span>
        </div>
        
        <div className="flex items-center gap-6">
          {auth && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium text-[#e2e8f0] font-sans">{auth.username}</span>
              <div className="w-px h-4 bg-[var(--border-hover)] mx-1"></div>
              <button onClick={signOut} className="text-[12px] text-[#cbd5e1] hover:text-[var(--gold)] uppercase tracking-wider font-semibold transition-colors">Déconnexion</button>
            </div>
          )}
          <button
            type="button"
            onClick={() => window.location.hash = '/'}
            className="px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-3 group glow-tag"
            style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Portfolio
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-[100px] pb-20 px-4 md:px-8 mx-auto max-w-[1400px]">
        {!auth ? renderLogin() : (
          <div className="space-y-6 fade-in animate-in duration-700">
            <div className="border border-[var(--border)] bg-[#0f1420]/60 backdrop-blur-md p-8 rounded-2xl mb-2 flex flex-col md:flex-row md:items-center justify-between gap-6 card-dark">
              <div>
                <h1 className="text-4xl md:text-4xl font-bold mb-2 text-[#f1f5f9]" style={{ fontFamily: 'var(--font-title)', letterSpacing: '-0.5px' }}>Administration Centralisée</h1>
                <p className="text-[#8a94a6] max-w-2xl text-sm leading-relaxed font-sans">Gérez le contenu de votre portfolio et suivez vos statistiques de trafic depuis cette interface unifiée et sécurisée.</p>
              </div>
            </div>

            <Tabs value={mode} onValueChange={(val) => { const next = coerceMode(val); setMode(next); setPanel('content'); setImages([]); setStatus(''); if (next === 'stats') loadAnalytics(); }} className="w-full">
              
              <div className="sticky top-[72px] z-40 bg-[#080b14]/90 backdrop-blur-lg pt-4 pb-4 -mx-4 sm:mx-0 px-4 sm:px-0 mb-6 border-b border-[rgba(255,255,255,0.05)] w-[calc(100%+2rem)] sm:w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <TabsList className="bg-[var(--bg-card)] border border-[var(--border)] p-1.5 rounded-xl shadow-sm overflow-x-auto flex-nowrap hide-scrollbar flex-shrink-0">
                  <TabsTrigger value="projects" className="rounded-lg data-[state=active]:bg-[#C8962A] data-[state=active]:text-[#05070d] px-6 md:px-8 py-2 md:py-2.5 transition-all text-sm font-semibold tracking-wide">Projets</TabsTrigger>
                  <TabsTrigger value="hackathons" className="rounded-lg data-[state=active]:bg-[#C8962A] data-[state=active]:text-[#05070d] px-6 md:px-8 py-2 md:py-2.5 transition-all text-sm font-semibold tracking-wide">Hackathons</TabsTrigger>
                  <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-[#C8962A] data-[state=active]:text-[#05070d] px-6 md:px-8 py-2 md:py-2.5 transition-all text-sm font-semibold tracking-wide">Statistiques</TabsTrigger>
                </TabsList>
                
                <div className="bg-[#0f1420]/50 border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2 flex items-center justify-between text-xs text-[#8a94a6] gap-3 backdrop-blur-sm card-dark w-full md:w-auto h-11">
                  <div className="flex items-center gap-2 max-w-[200px] sm:max-w-max truncate">
                    <span>État:</span>
                    <strong className={status ? "font-mono text-[var(--gold)] font-medium truncate" : "font-mono text-emerald-400 font-medium truncate"}>{status || 'Prêt pour modifications'}</strong>
                  </div>
                  {loading && <span className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded text-[#cbd5e1] border border-white/5 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse"></span> Sync...</span>}
                </div>
              </div>

              <TabsContent value="stats" className="mt-0 outline-none">
                {renderStats()}
              </TabsContent>

              <TabsContent value="projects" className="mt-0 outline-none">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
                  <div className="w-full lg:w-[28%] xl:w-1/4 space-y-6 flex-shrink-0 lg:sticky lg:top-[160px] lg:self-start">
                    <Card className="bg-[var(--bg-card)] border-[var(--border)] shadow-xl card-dark">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#f1f5f9] text-xs font-bold tracking-widest uppercase">Sélecteur de Projet</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <Input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Chercher via tag ou titre..." className="bg-[rgba(10, 12, 18, 0.75)] border-[var(--border)] text-[#f1f5f9] text-sm h-10 focus:ring-1 focus:ring-[var(--gold)] placeholder:text-[#5a6478]" />
                        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                          {slugOptions.map((item) => (
                            <button key={item.slug} onClick={() => setSelectedSlug(item.slug)} className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all flex items-center justify-between group ${selectedSlug === item.slug ? 'bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--border-hover)]' : 'text-[#8a94a6] hover:bg-white/5 border border-transparent'}`}>
                              <span className="truncate pr-2 font-medium">{item.title}</span> 
                              {item.hidden && <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${selectedSlug === item.slug ? 'bg-[var(--gold)]/20 text-[var(--gold)]' : 'bg-white/10 text-[#5a6478]'}`}>Caché</span>}
                            </button>
                          ))}
                        </div>
                        <Button onClick={loadProjects} disabled={loading} variant="outline" className="w-full border-[var(--border)] text-[#cbd5e1] hover:bg-[var(--gold-dim)] hover:text-[#f1f5f9] hover:border-[var(--border-hover)] mt-2 h-10 text-xs transition-colors">Recharger de la base</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#05070d] border-[rgba(255,255,255,0.08)] shadow-lg">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#f1f5f9] text-sm font-semibold tracking-wide uppercase">Créer un Nouveau</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Identifiant (slug)</Label>
                          <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="mon-super-projet" className="bg-[rgba(10, 12, 18, 0.75)] border-[rgba(255,255,255,0.1)] text-[#f1f5f9] text-sm font-mono h-9" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Titre du projet</Label>
                          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titre d'affichage" className="bg-[rgba(10, 12, 18, 0.75)] border-[rgba(255,255,255,0.1)] text-[#f1f5f9] text-sm h-9" />
                        </div>
                        <Button onClick={createProject} disabled={loading || !newSlug || !newTitle} className="w-full bg-[#e2e8f0] text-[#05070d] hover:bg-white transition-colors h-9">Ajouter l'entrée</Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="w-full lg:w-[72%] xl:w-3/4">
                    {selectedProject && (
                      <Tabs value={panel} onValueChange={(v) => { const next = coercePanel(v); setPanel(next); if (next === 'photos') loadImages(); }} className="w-full">
                        <TabsList className="bg-[rgba(10, 12, 18, 0.75)] border border-[rgba(255,255,255,0.08)] w-full justify-start rounded-b-none border-b-0 pb-0 pt-2 px-2 h-auto flex gap-1 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.3)]">
                          <TabsTrigger value="content" className="data-[state=active]:bg-[#05070d] data-[state=active]:border-[rgba(200,150,42,0.15)] data-[state=active]:border-b-[#05070d] data-[state=active]:text-[#f1f5f9] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none">Données & Textes</TabsTrigger>
                          <TabsTrigger value="photos" className="data-[state=active]:bg-[#05070d] data-[state=active]:border-[rgba(200,150,42,0.15)] data-[state=active]:border-b-[#05070d] data-[state=active]:text-[#f1f5f9] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none flex items-center gap-2">
                             Galerie <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded leading-none text-[#cbd5e1]">Blob</span>
                          </TabsTrigger>
                        </TabsList>
                        <div className="bg-[#05070d] border border-[rgba(200,150,42,0.15)] rounded-lg rounded-tl-none p-5 sm:p-7 min-h-[500px] shadow-xl relative z-10 -mt-[1px]">
                          <TabsContent value="content" className="mt-0 outline-none">{renderProjectForm()}</TabsContent>
                          <TabsContent value="photos" className="mt-0 outline-none">{renderPhotos({ type: 'projects', slug: selectedSlug, currentCover: selectedProject.coverImagePathname })}</TabsContent>
                        </div>
                      </Tabs>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hackathons" className="mt-0 outline-none">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
                  <div className="w-full lg:w-[28%] xl:w-1/4 space-y-6 flex-shrink-0 lg:sticky lg:top-[160px] lg:self-start">
                    <Card className="bg-[var(--bg-card)] border-[var(--border)] shadow-xl card-dark">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#f1f5f9] text-xs font-bold tracking-widest uppercase">Sélecteur Hackathon</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <Input value={hackathonSearch} onChange={(e) => setHackathonSearch(e.target.value)} placeholder="Chercher via nom..." className="bg-[rgba(10, 12, 18, 0.75)] border-[var(--border)] text-[#f1f5f9] text-sm h-10 focus:ring-1 focus:ring-[var(--gold)] placeholder:text-[#5a6478]" />
                        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                          {hackathonOptions.map((item) => (
                            <button key={item.slug} onClick={() => setSelectedHackathonSlug(item.slug)} className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all flex items-center justify-between group ${selectedHackathonSlug === item.slug ? 'bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--border-hover)]' : 'text-[#8a94a6] hover:bg-white/5 border border-transparent'}`}>
                              <span className="truncate pr-2 font-medium">{item.name}</span>
                            </button>
                          ))}
                        </div>
                        <Button onClick={loadHackathons} disabled={loading} variant="outline" className="w-full border-[var(--border)] text-[#cbd5e1] hover:bg-[var(--gold-dim)] hover:text-[#f1f5f9] hover:border-[var(--border-hover)] mt-2 h-10 text-xs transition-colors">Recharger de la base</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[var(--bg-card)] border-[var(--border)] shadow-xl card-dark">
                      <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.04)] bg-white/[0.02]"><CardTitle className="text-[#f1f5f9] text-xs font-bold tracking-widest uppercase">Créer un Nouveau</CardTitle></CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Identifiant (slug)</Label>
                          <Input value={newHackathonSlug} onChange={(e) => setNewHackathonSlug(e.target.value)} placeholder="inno-hack-2026" className="bg-[rgba(10, 12, 18, 0.75)] border-[rgba(255,255,255,0.1)] text-[#f1f5f9] text-sm font-mono h-9" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#888]">Nom complet</Label>
                          <Input value={newHackathonName} onChange={(e) => setNewHackathonName(e.target.value)} placeholder="Inno Hackathon" className="bg-[rgba(10, 12, 18, 0.75)] border-[rgba(255,255,255,0.1)] text-[#f1f5f9] text-sm h-9" />
                        </div>
                        <Button onClick={createHackathon} disabled={loading || !newHackathonSlug || !newHackathonName} className="w-full bg-[#e2e8f0] text-[#05070d] hover:bg-white transition-colors h-9">Ajouter l'entrée</Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="w-full lg:w-[72%] xl:w-3/4">
                    {selectedHackathon && hackathonDraft && (
                      <Tabs value={panel} onValueChange={(v) => { const next = coercePanel(v); setPanel(next); if (next === 'photos') loadImages(); }} className="w-full">
                        <TabsList className="bg-[rgba(10, 12, 18, 0.75)] border border-[rgba(255,255,255,0.08)] w-full justify-start rounded-b-none border-b-0 pb-0 pt-2 px-2 h-auto flex gap-1 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.3)]">
                          <TabsTrigger value="content" className="data-[state=active]:bg-[#05070d] data-[state=active]:border-[rgba(200,150,42,0.15)] data-[state=active]:border-b-[#05070d] data-[state=active]:text-[#f1f5f9] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none">Données Hackathon</TabsTrigger>
                          <TabsTrigger value="photos" className="data-[state=active]:bg-[#05070d] data-[state=active]:border-[rgba(200,150,42,0.15)] data-[state=active]:border-b-[#05070d] data-[state=active]:text-[#f1f5f9] text-[#8f8ba8] border border-transparent rounded-b-none py-2.5 px-6 font-medium text-sm transition-none flex items-center gap-2">
                             Galerie <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded leading-none text-[#cbd5e1]">Blob</span>
                          </TabsTrigger>
                        </TabsList>
                        <div className="bg-[#05070d] border border-[rgba(200,150,42,0.15)] rounded-lg rounded-tl-none p-5 sm:p-7 min-h-[500px] shadow-xl relative z-10 -mt-[1px]">
                          <TabsContent value="content" className="mt-0 outline-none space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f1420] p-5 rounded-xl border border-[rgba(200,150,42,0.15)] shadow-lg">
                              <div>
                                <h3 className="text-xl font-bold text-[#C8962A] tracking-tight">{hackathonDraft.name}</h3>
                                <span className="text-xs text-[#cbd5e1] font-mono opacity-80 mt-1 block">slug: {hackathonDraft.slug}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <Button onClick={applyHackathonDraft} disabled={loading} className="bg-[#C8962A] text-[#05070d] hover:bg-[#b08d22]">Appliquer</Button>
                                <Button onClick={saveHackathons} disabled={loading} variant="outline" className="border-[rgba(255,255,255,0.14)] text-white hover:bg-white/10 hover:text-white">Sauvegarder</Button>
                                <Button onClick={deleteHackathon} disabled={loading} variant="destructive" className="bg-red-900/80 hover:bg-red-900 text-red-100">Sup.</Button>
                              </div>
                            </div>
                            
                            <Card className="bg-[#05070d] border-[rgba(200,150,42,0.15)] shadow-none">
                              <CardHeader className="pb-3 border-b border-[rgba(255,255,255,0.06)]"><CardTitle className="text-[#f1f5f9] text-base">Informations</CardTitle></CardHeader>
                              <CardContent className="space-y-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2"><Label>Nom global</Label><Input value={hackathonDraft.name} onChange={(e) => setHackathonDraft({ ...hackathonDraft, name: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
                                  <div className="space-y-2"><Label>Date / Période</Label><Input value={hackathonDraft.period} onChange={(e) => setHackathonDraft({ ...hackathonDraft, period: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9]" /></div>
                                  <div className="space-y-2 md:col-span-2"><Label>Résultat ou Place</Label><Input value={hackathonDraft.result} onChange={(e) => setHackathonDraft({ ...hackathonDraft, result: e.target.value })} className="bg-[rgba(200,150,42,0.05)] border-[rgba(200,150,42,0.3)] text-[#C8962A] font-medium" /></div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Bref résumé ou infos complémentaires</Label>
                                  <Textarea value={hackathonDraft.detail || ''} onChange={(e) => setHackathonDraft({ ...hackathonDraft, detail: e.target.value })} className="bg-[#080b14] border-[rgba(200,150,42,0.15)] text-[#f1f5f9] min-h-[160px] font-sans" />
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          <TabsContent value="photos" className="mt-0 outline-none">{renderPhotos({ type: 'hackathons', slug: selectedHackathonSlug, currentCover: selectedHackathon?.coverImagePathname })}</TabsContent>
                        </div>
                      </Tabs>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
