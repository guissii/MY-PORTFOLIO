import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/data/projects';

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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});
  const [blobImageMap, setBlobImageMap] = useState<Record<string, string>>({});

  const dots = useMemo(() => projects.map((_, i) => i), []);

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
    const slider = sliderRef.current;
    if (!slider) return;
    const onScroll = () => {
      const card = slider.querySelector('.project-card') as HTMLElement | null;
      if (!card) return;
      const cardStyle = window.getComputedStyle(slider);
      const gap = Number.parseFloat(cardStyle.columnGap || cardStyle.gap || '0');
      const step = card.offsetWidth + gap;
      if (step <= 0) return;
      const index = Math.round(slider.scrollLeft / step);
      setActiveDot(Math.max(0, Math.min(projects.length - 1, index)));
    };
    slider.addEventListener('scroll', onScroll, { passive: true });
    return () => slider.removeEventListener('scroll', onScroll);
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

  const scrollSlider = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction === 'right' ? slider.clientWidth * 0.9 : -slider.clientWidth * 0.9,
      behavior: 'smooth',
    });
  };

  const visibleTags = (tags: string[]) => tags.slice(0, 3);
  const extraCount = (tags: string[]) => Math.max(0, tags.length - 3);

  const resolveImage = (slug: string, image?: string) => blobImageMap[slug] || image || '';
  const useImage = (index: number, image?: string) => Boolean(image) && !brokenImages[index];

  const openProject = (slug: string) => {
    window.location.hash = `/projets/${slug}`;
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

        <div className="relative">
          <button
            type="button"
            aria-label="Precedent"
            onClick={() => scrollSlider('left')}
            className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center transition-all duration-300"
            style={{ border: '1px solid #C9A227', color: '#C9A227', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A227';
              e.currentTarget.style.color = '#0D0B1E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#C9A227';
            }}
          >
            {'<'}
          </button>

          <div
            ref={sliderRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {projects.map((project, i) => (
              <article
                key={project.title}
                className="project-card shrink-0 h-[400px] rounded-2xl overflow-hidden transition-transform duration-300 group cursor-pointer w-[calc(83.333%-4px)] max-w-[320px] md:w-[calc((100%-24px)/2)] md:max-w-none lg:w-[calc((100%-48px)/3)]"
                style={{
                  backgroundColor: '#0D0B1E',
                  border: '1px solid rgba(201,162,39,0.2)',
                  scrollSnapAlign: 'start',
                }}
                onClick={() => openProject(project.slug)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.border = '1px solid rgba(201,162,39,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '1px solid rgba(201,162,39,0.2)';
                }}
              >
                <div className="relative h-[60%]">
                  {useImage(i, resolveImage(project.slug, project.image)) ? (
                    <img
                      src={resolveImage(project.slug, project.image)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => setBrokenImages((prev) => ({ ...prev, [i]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: gradientByCategory[project.category] || gradientByCategory.Web }} />
                  )}
                  <span
                    className="absolute top-3 right-3 px-2 py-1 rounded-md"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#C9A227',
                      backgroundColor: 'rgba(201,162,39,0.18)',
                      border: '1px solid rgba(201,162,39,0.32)',
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                <div className="h-[40%] p-4 flex flex-col" style={{ backgroundColor: '#0D0B1E' }}>
                  <h3
                    className="truncate"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: '#F0E6FF',
                      fontSize: '16px',
                      fontWeight: 500,
                      marginBottom: '6px',
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="truncate"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: '#C8C8D8',
                      fontSize: '13px',
                      marginBottom: '10px',
                    }}
                  >
                    {project.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {visibleTags(project.tags).map((tag) => (
                      <span
                        key={`${project.title}-${tag}`}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: '#D8D8E8',
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          borderRadius: '999px',
                          padding: '4px 10px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {extraCount(project.tags) > 0 && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: '#A6A6B8',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '999px',
                          padding: '4px 10px',
                        }}
                      >
                        +{extraCount(project.tags)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-end gap-3">
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
              </article>
            ))}
          </div>

          <button
            type="button"
            aria-label="Suivant"
            onClick={() => scrollSlider('right')}
            className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center transition-all duration-300"
            style={{ border: '1px solid #C9A227', color: '#C9A227', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A227';
              e.currentTarget.style.color = '#0D0B1E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#C9A227';
            }}
          >
            {'>'}
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {dots.map((dot) => (
            <span
              key={`dot-${dot}`}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: activeDot === dot ? '#C9A227' : 'transparent',
                border: `1px solid ${activeDot === dot ? '#C9A227' : 'rgba(201,162,39,0.5)'}`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
