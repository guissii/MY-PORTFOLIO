import { useEffect, useMemo, useState } from 'react';
import { projects } from '@/data/projects';

type ProjectDetailsPageProps = {
  slug: string;
};

export default function ProjectDetailsPage({ slug }: ProjectDetailsPageProps) {
  const project = projects.find((item) => item.slug === slug);
  const [blobImageMap, setBlobImageMap] = useState<Record<string, string>>({});

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
              <article className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#C9A227', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '6px' }}>Role</div>
                <p style={{ color: '#E5E2F2', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.55 }}>{project.role}</p>
              </article>
              <article className="rounded-xl p-4 md:col-span-2" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#C9A227', fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '6px' }}>Vue d ensemble</div>
                <p style={{ color: '#E5E2F2', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.65 }}>{project.overview}</p>
              </article>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <article className="rounded-xl p-4" style={{ backgroundColor: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.3)' }}>
                <h2 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '10px' }}>Points forts</h2>
                <ul className="space-y-2">
                  {project.highlights.map((item) => (
                    <li key={`${project.slug}-${item}`} style={{ color: '#DAD5EA', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.55 }}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '10px' }}>Stack technique</h2>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={`${project.slug}-stack-${item}`}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: '#D8D8E8',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '999px',
                        padding: '5px 11px',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <article className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'rgba(13,11,30,0.72)', border: '1px solid rgba(201,162,39,0.28)' }}>
              <h2 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '12px' }}>Architecture technique</h2>
              <ul className="space-y-2">
                {project.architecture.map((item) => (
                  <li key={`${project.slug}-arch-${item}`} style={{ color: '#E0DBEE', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.65 }}>
                    • {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: '#F0E6FF', fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '12px' }}>Description technique detaillee</h2>
              <div className="space-y-3">
                {project.technicalDescription.map((paragraph) => (
                  <p
                    key={`${project.slug}-tech-${paragraph.slice(0, 24)}`}
                    style={{
                      color: '#D7D2E6',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      lineHeight: 1.8,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={`${project.slug}-${tag}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#D8D8E8',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '999px',
                    padding: '5px 11px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

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
