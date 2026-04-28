import { useEffect, useMemo, useState } from 'react';
import { projects as defaultProjects, type ProjectItem } from '@/data/projects';
import MediaGallery from '@/components/MediaGallery';
import gsap from 'gsap';

type ProjectDetailsPageProps = {
  slug: string;
};

export default function ProjectDetailsPage({ slug }: ProjectDetailsPageProps) {
  const [projectItems, setProjectItems] = useState<ProjectItem[]>(defaultProjects);
  const [blobImageMap, setBlobImageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
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

  useEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      gsap.from('.proj-anim', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#05070d' }}>
        <div className="text-center">
          <h1 style={{ color: '#f1f5f9', fontFamily: 'var(--font-title)', fontSize: '36px', marginBottom: '10px' }}>
            Projet introuvable
          </h1>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '/';
            }}
            className="px-6 py-3 rounded-lg transition-all duration-300 glow-tag"
            style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '13px', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              cursor: 'pointer'
            }}
          >
            Retour accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', padding: '84px var(--section-pad-x)' }}>
      {/* Background ambient match */}
      <div className="absolute inset-0 pointer-events-none hero-bg opacity-30" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(8,11,20,0.4) 0%, rgba(8,11,20,0.85) 70%, rgba(8,11,20,1) 100%)' }} />
      
      <div className="mx-auto max-w-[980px] relative z-10">
        <div className="proj-anim mb-8">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '/';
            }}
            className="px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-3 group glow-tag"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> RETOUR AU PORTFOLIO
          </button>
        </div>

        <div className="proj-anim">
          <div className="rounded-2xl overflow-hidden card-dark project-card-lux" style={{ 
              background: 'rgba(15, 20, 32, 0.75)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
            <div className="h-[280px] md:h-[420px] relative overflow-hidden group">
              {resolvedImage ? (
                <img src={resolvedImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-card) 40%, rgba(200,150,42,0.2) 100%)' }}
                />
              )}
              {/* Fade out image bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(15, 20, 32, 0.75) 100%)' }} />
            </div>

            <div className="p-8 md:p-12 -mt-10 relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className="glow-tag px-3 py-1 text-[11px] uppercase tracking-[1.5px] font-semibold"
                >
                  {project.category}
                </span>
                <span style={{ color: '#475569', fontSize: '12px' }}>•</span>
                <span style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '13px' }}>{project.realizationDate}</span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 600,
                  color: '#f1f5f9',
                  lineHeight: 1.15,
                  marginBottom: '16px',
                  letterSpacing: '-1px'
                }}
              >
                {project.title}
              </h1>

              <div style={{ width: '60px', height: '2px', backgroundColor: '#C8962A', opacity: 0.6, marginBottom: '24px' }} />

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#C8962A',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                }}
              >
                {project.subtitle}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: '#e2e8f0',
                  lineHeight: 1.9,
                  marginBottom: '40px',
                }}
              >
                {singleParagraph}
              </p>

              <MediaGallery slug={project.slug} collection="projects" fallbackImage={resolvedImage} />

              <div className="flex flex-wrap gap-4 mt-8">
                {project.github && project.github !== '#' && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(200,150,42,0.2)] hover:shadow-[0_0_30px_rgba(200,150,42,0.4)] hover:-translate-y-1"
                    style={{
                      color: '#05070d',
                      backgroundColor: 'var(--gold)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      textDecoration: 'none'
                    }}
                  >
                    Voir Github
                  </a>
                )}
                {project.link && project.link !== '#' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 glow-tag hover:-translate-y-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      textDecoration: 'none'
                    }}
                  >
                    Voir Action
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
