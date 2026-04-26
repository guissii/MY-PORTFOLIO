import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects as defaultProjects, type ProjectItem } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

const gradientByCategory: Record<string, string> = {
  IA: 'linear-gradient(135deg, #2A1745 0%, #C9A227 100%)',
  DevOps: 'linear-gradient(135deg, #0E1A38 0%, #22D3EE 100%)',
  Web: 'linear-gradient(135deg, #0B1A1A 0%, #10B981 100%)',
  Cyber: 'linear-gradient(135deg, #1A1F36 0%, #4B5563 100%)',
  Mobile: 'linear-gradient(135deg, #1E1633 0%, #7C3AED 100%)',
  Reseaux: 'linear-gradient(135deg, #0F2133 0%, #1D4ED8 100%)',
  'Cyber/Reseaux': 'linear-gradient(135deg, #1C2438 0%, #2563EB 100%)',
};

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 20 5a4.9 4.9 0 0 0-.1-3.7S18.7.9 16 2.7a13.4 13.4 0 0 0-7 0C6.3.9 5.1 1.3 5.1 1.3A4.9 4.9 0 0 0 5 5a5.3 5.3 0 0 0-1.3 3.7c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v7h-7" />
      <path d="M3 10V3h7" />
      <path d="M3 3l7 7" />
      <path d="M3 21h7v-7" />
    </svg>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>(defaultProjects);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [blobImageMap, setBlobImageMap] = useState<Record<string, string>>({});

  const visibleProjects = useMemo(() => projectItems.filter((p) => !p.hidden), [projectItems]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

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

  const resolveImage = (slug: string, image?: string) => blobImageMap[slug] || image || '';
  const shouldRenderImage = (slug: string, image?: string) => Boolean(image) && !brokenImages[slug];

  const openProject = (slug: string) => {
    const base = window.location.href.split('#')[0] || '';
    window.location.replace(`${base}#/projets/${slug}`);
  };

  return (
    <section
      ref={sectionRef}
      id="projets"
      style={{
        backgroundColor: 'transparent',
        padding: 'var(--section-pad-y) var(--section-pad-x)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--container-max)' }}>
        <div className="text-center mb-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#C9A227',
              letterSpacing: '0.2em',
              marginBottom: '12px',
            }}
          >
            PROJETS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(40px, 7vw, 90px)',
              fontWeight: 700,
              color: '#F0E6FF',
              lineHeight: 1.1,
            }}
          >
            Projets
          </h2>
        </div>

        {visibleProjects.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: '#0D0B1E', border: '1px solid rgba(255,255,255,0.12)', color: '#D2CDDE', fontFamily: 'var(--font-body)' }}
          >
            Aucun projet.
          </div>
        ) : (
          <>
            <article
              className="project-card rounded-3xl overflow-hidden relative cursor-pointer group"
              style={{ backgroundColor: '#0D0B1E', border: '1px solid rgba(201,162,39,0.22)' }}
              onClick={() => openProject(visibleProjects[0].slug)}
            >
              {shouldRenderImage(visibleProjects[0].slug, resolveImage(visibleProjects[0].slug, visibleProjects[0].image)) ? (
                <img
                  src={resolveImage(visibleProjects[0].slug, visibleProjects[0].image)}
                  alt={visibleProjects[0].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                  onError={() => setBrokenImages((prev) => ({ ...prev, [visibleProjects[0].slug]: true }))}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: gradientByCategory[visibleProjects[0].category] || gradientByCategory.Web }}
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(13,11,30,0.92) 0%, rgba(13,11,30,0.55) 45%, rgba(13,11,30,0.92) 100%)',
                }}
              />
              <div className="relative p-6 md:p-10 flex flex-col min-h-[420px]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#BEBAD0' }}>{visibleProjects[0].lastUpdate}</span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px, 4vw, 46px)',
                    fontWeight: 700,
                    color: '#F0E6FF',
                    lineHeight: 1.1,
                    marginBottom: '10px',
                    maxWidth: '720px',
                  }}
                >
                  {visibleProjects[0].title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: '#D2CDDE', fontSize: '15px', lineHeight: 1.7, maxWidth: '720px' }}>
                  {visibleProjects[0].subtitle}
                </p>

                <div className="mt-auto pt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="px-5 py-2 rounded-full transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      backgroundColor: '#C9A227',
                      color: '#0D0B1E',
                    }}
                  >
                    Voir details
                  </button>
                  <div className="flex items-center gap-3 ml-auto">
                    {visibleProjects[0].github && visibleProjects[0].github !== '#' && (
                      <a
                        href={visibleProjects[0].github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300"
                        style={{ color: '#F0E6FF' }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A227')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#F0E6FF')}
                      >
                        <GitHubIcon />
                      </a>
                    )}
                    {visibleProjects[0].link && visibleProjects[0].link !== '#' && (
                      <a
                        href={visibleProjects[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300"
                        style={{ color: '#F0E6FF' }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A227')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#F0E6FF')}
                      >
                        <ExternalIcon />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.slice(1).map((project) => (
                <article
                  key={project.slug}
                  className="project-card rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 group"
                  style={{ backgroundColor: '#0D0B1E', border: '1px solid rgba(255,255,255,0.12)' }}
                  onClick={() => openProject(project.slug)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div className="relative h-[190px]">
                    {shouldRenderImage(project.slug, resolveImage(project.slug, project.image)) ? (
                      <img
                        src={resolveImage(project.slug, project.image)}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        onError={() => setBrokenImages((prev) => ({ ...prev, [project.slug]: true }))}
                      />
                    ) : (
                      <div className="absolute inset-0" style={{ background: gradientByCategory[project.category] || gradientByCategory.Web }} />
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,11,30,0.2) 0%, rgba(13,11,30,0.92) 100%)' }} />
                  </div>

                  <div className="p-5">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600, color: '#F0E6FF', marginBottom: '6px' }}>
                      {project.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', color: '#C8C8D8', fontSize: '13px', lineHeight: 1.65, marginBottom: '12px' }}>
                      {project.subtitle}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#BEBAD0' }}>{project.lastUpdate}</span>
                      <div className="flex items-center gap-3">
                        {project.github && project.github !== '#' && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-300"
                            style={{ color: '#F0E6FF' }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A227')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#F0E6FF')}
                          >
                            <GitHubIcon />
                          </a>
                        )}
                        {project.link && project.link !== '#' && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-300"
                            style={{ color: '#F0E6FF' }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A227')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#F0E6FF')}
                          >
                            <ExternalIcon />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
