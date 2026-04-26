import { useEffect, useMemo, useState } from 'react';
import { projects as defaultProjects, type ProjectItem } from '@/data/projects';

type ProjectDetailsPageProps = {
  slug: string;
};

export default function ProjectDetailsPage({ slug }: ProjectDetailsPageProps) {
  const [projectItems, setProjectItems] = useState<ProjectItem[]>(defaultProjects);
  const [blobImageMap, setBlobImageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/public/projects');
        const data = await res.json();
        if (res.ok && Array.isArray(data?.projects) && data.projects.length > 0) {
          setProjectItems(data.projects);
        }
      } catch {
        // Keep local fallback projects silently.
      }
    };
    loadProjects();
  }, []);

  const project = useMemo(() => projectItems.find((item) => item.slug === slug), [projectItems, slug]);

  useEffect(() => {
    const loadBlobImages = async () => {
      try {
        const res = await fetch('/api/public/project-images');
        const data = await res.json();
        if (res.ok && data?.images) {
          setBlobImageMap(data.images);
        }
      } catch {
        // Keep local fallback images silently.
      }
    };
    loadBlobImages();
  }, []);

  const resolvedImage = useMemo(() => {
    if (!project) return '';
    return blobImageMap[project.slug] || project.image || '';
  }, [blobImageMap, project]);

  const singleParagraph = useMemo(() => {
    if (!project) return '';
    const direct = typeof project.description === 'string' ? project.description.trim() : '';
    if (direct) return direct;
    const safeJoin = (items: unknown, sep: string) => {
      if (!Array.isArray(items)) return '';
      return items.map((v) => String(v || '').trim()).filter(Boolean).join(sep);
    };

    const parts: string[] = [];

    const role = String(project.role || '').trim();
    if (role) parts.push(`Role: ${role}.`);

    const overview = String(project.overview || '').trim();
    if (overview) parts.push(overview.endsWith('.') ? overview : `${overview}.`);

    const highlights = safeJoin(project.highlights, '; ');
    if (highlights) parts.push(`Points forts: ${highlights}.`);

    const stack = safeJoin(project.stack, ', ');
    if (stack) parts.push(`Stack: ${stack}.`);

    const architecture = safeJoin(project.architecture, '; ');
    if (architecture) parts.push(`Architecture: ${architecture}.`);

    const tech = safeJoin(project.technicalDescription, ' ');
    if (tech) parts.push(tech.endsWith('.') ? tech : `${tech}.`);

    return parts.join(' ');
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#08091A' }}>
        <div className="text-center">
          <h1 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: '36px', marginBottom: '10px' }}>
            Projet introuvable
          </h1>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '/';
            }}
            className="px-5 py-2 rounded-lg"
            style={{ color: '#0D0B1E', backgroundColor: '#C9A227', fontFamily: 'var(--font-mono)' }}
          >
            Retour accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <section style={{ minHeight: '100vh', backgroundColor: 'transparent', padding: '84px var(--section-pad-x)' }}>
      <div className="mx-auto max-w-[980px]">
        <button
          type="button"
          onClick={() => {
            window.location.hash = '/';
          }}
          className="mb-8 px-4 py-2 rounded-lg transition-colors duration-300"
          style={{
            border: '1px solid rgba(201, 162, 39, 0.5)',
            color: '#C9A227',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.08em',
          }}
        >
          ← RETOUR AUX PROJETS
        </button>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(201,162,39,0.28)', backgroundColor: '#0D0B1E' }}>
          <div className="h-[280px] md:h-[360px]">
            {resolvedImage ? (
              <img src={resolvedImage} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: 'linear-gradient(135deg, #1B2140 0%, #2F3A6A 40%, #C9A227 100%)' }}
              />
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#C9A227',
                  letterSpacing: '0.08em',
                }}
              >
                {project.category}
              </span>
              <span style={{ color: '#8A7A9A', fontSize: '12px' }}>•</span>
              <span style={{ color: '#B8B3CC', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Realisation: {project.realizationDate}</span>
              <span style={{ color: '#8A7A9A', fontSize: '12px' }}>•</span>
              <span style={{ color: '#B8B3CC', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Maj: {project.lastUpdate}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4vw, 46px)',
                fontWeight: 700,
                color: '#F0E6FF',
                lineHeight: 1.12,
                marginBottom: '10px',
              }}
            >
              {project.title}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: '#C9C5D9',
                lineHeight: 1.7,
                marginBottom: '22px',
              }}
            >
              {project.subtitle}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: '#E5E2F2',
                lineHeight: 1.85,
                marginBottom: '22px',
              }}
            >
              {singleParagraph}
            </p>

            <div className="flex flex-wrap gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg transition-colors duration-300"
                  style={{
                    color: '#0D0B1E',
                    backgroundColor: '#C9A227',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                  }}
                >
                  Voir GitHub
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg transition-colors duration-300"
                  style={{
                    color: '#F0E6FF',
                    border: '1px solid rgba(201,162,39,0.5)',
                    backgroundColor: 'transparent',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                  }}
                >
                  Voir Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
