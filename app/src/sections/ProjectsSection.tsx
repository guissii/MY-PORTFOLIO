import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects as defaultProjects, type ProjectItem } from '@/data/projects';
import Tilt3D from '@/components/Tilt3D';

gsap.registerPlugin(ScrollTrigger);

function GitHubIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 20 5a4.9 4.9 0 0 0-.1-3.7S18.7.9 16 2.7a13.4 13.4 0 0 0-7 0C6.3.9 5.1 1.3 5.1 1.3A4.9 4.9 0 0 0 5 5a5.3 5.3 0 0 0-1.3 3.7c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 0 0-.9 2.6V22" /></svg>;
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>(defaultProjects);

  const visibleProjects = useMemo(() => projectItems.filter((p) => !p.hidden), [projectItems]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from('.p-anim', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => { (async () => { try { const r = await fetch('/api/public/projects'); const d = await r.json(); if (r.ok && Array.isArray(d?.projects) && d.projects.length) setProjectItems(d.projects); } catch { return; } })(); }, []);

  const openProject = (slug: string) => {
    window.location.hash = `/projets/${slug}`;
  };

  return (
    <section ref={sectionRef} id="projets" className="relative w-full overflow-hidden" style={{ padding: 'calc(var(--section-pad-y) * 0.8) 0', backgroundColor: '#05070d' }}>
      
      {/* Background Image Setup */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'url(/projects-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1 // Full visibility
        }} 
      />
      
      {/* Very light mask just to ensure text pop without eating the image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(5,7,12,0.1) 0%, rgba(5,7,12,0.4) 70%, rgba(5,7,12,0.8) 100%)',
        }}
      />
      
      {/* Top and Bottom gentle fade */}
      <div className="absolute inset-x-0 top-0 h-[150px] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(5,7,12,1) 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-[150px] pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(5,7,12,1) 0%, transparent 100%)' }} />

      <div className="mx-auto relative z-10" style={{ maxWidth: '1100px', padding: '0 var(--section-pad-x)' }}>
        
        <div style={{ marginBottom: '56px', marginLeft: '8px' }}>
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Réalisations</span>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.5 }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.5px' }}>Projets</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
          {visibleProjects.map((project, i) => (
            <Tilt3D key={project.slug} intensity={6} scale={1.02}>
              <article className="proj-card cursor-pointer group" style={{ 
                padding: '36px', 
                position: 'relative', 
                overflow: 'hidden',
                background: 'rgba(10, 12, 18, 0.6)',
                borderRadius: '12px',
                border: '1px solid rgba(200,150,42,0.15)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.4s ease'
              }}
                onClick={() => openProject(project.slug)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(200,150,42,0.6)';
                  e.currentTarget.style.boxShadow = 'inset 0 40px 60px -40px rgba(200,150,42,0.25), 0 10px 40px -10px rgba(200,150,42,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(200,150,42,0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Huge faded background number */}
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '64px', fontWeight: 300, color: 'rgba(200,150,42,0.1)', position: 'absolute', top: '16px', right: '24px', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: 500, color: '#f1f5f9', marginBottom: '10px', lineHeight: 1.3 }}>{project.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px', maxWidth: '85%' }}>{project.subtitle}</p>

                <div className="flex flex-wrap gap-2" style={{ marginBottom: '32px' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{ 
                      fontFamily: 'var(--font-body)', 
                      fontSize: '9.5px', 
                      textTransform: 'uppercase', 
                      padding: '4px 8px', 
                      border: '1px solid rgba(200,150,42,0.3)', 
                      backgroundColor: 'rgba(200,150,42,0.03)', 
                      color: '#C8962A', 
                      borderRadius: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#C8962A', letterSpacing: '1px' }}>
                    Voir le projet <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </span>
                  {project.github && project.github !== '#' && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ color: '#C8962A', transition: 'transform 0.3s' }}
                      onClick={(e) => e.stopPropagation()} 
                      className="hover:scale-110"
                    ><GitHubIcon /></a>
                  )}
                </div>
              </article>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
