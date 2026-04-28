import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt3D from '@/components/Tilt3D';

gsap.registerPlugin(ScrollTrigger);

const experienceItems = [
  { period: 'JUIN 2025 — JUIL 2025', title: 'Stagiaire IA, Operations IT & Cybersécurité', org: 'ALTEN Maroc · Fes', description: 'Pipeline NLP complet (CamemBERT + PyTorch) en production. Classification auto de tickets — 96% precision sur 8 349 tickets. Module IDS intelligent (ML).', tags: ['Python', 'PyTorch', 'CamemBERT', 'Docker'] },
  { period: 'FEV 2026 — PRESENT', title: 'Contributeur IA', org: 'Alignerr · San Francisco', description: 'Evaluation de prompts pour LM Arena V2. Annotation LLM (RLHF). Alignement de modeles IA.', tags: ['RLHF', 'LLM', 'Prompt Engineering'] },
  { period: 'DEC 2024 — PRESENT', title: 'Freelance — IA, Web & Cyber', org: 'Independant · Fes', description: 'Sites web pro. Agents IA autonomes. Solutions IPS/IDS ML. CI/CD automatise.', tags: ['React', 'Docker', 'LLM'] },
  { period: '2023 — PRESENT', title: 'Enseignant — Soutien', org: 'Cours particuliers · Fes', description: 'Maths et Physique bac. Pedagogie adaptee.', tags: [] },
];

const formationItems = [
  { period: '2024 — PRESENT', title: 'Cycle Ingenieur — ENSA Fes', org: 'ENSA Fes', description: 'Genie des Systemes Communicants & Securite Numerique.', tags: ['Systemes Communicants', 'Securite'] },
  { period: '2022 — 2024', title: 'CPGE MP', org: 'Classes Preparatoires', description: 'Parcours intensif. Top 2 en 2eme annee.', tags: ['CPGE', 'Maths', 'Physique'] },
];

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const expLineRef = useRef<HTMLDivElement>(null);
  const formLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      [expLineRef, formLineRef].forEach((ref) => {
        if (!ref.current) return;
        const parent = ref.current.closest('[data-tl]');
        if (!parent) return;
        gsap.fromTo(ref.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: parent, start: 'top 75%', end: 'bottom 80%', scrub: 1 } });
      });
      section.querySelectorAll('.tl-card').forEach((card) => {
        gsap.from(card, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%' } });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const renderTL = (items: typeof experienceItems, lineRef: React.RefObject<HTMLDivElement | null>, title: string) => (
    <div data-tl className="mb-12">
      {/* Title */}
      <div className="mb-12 pl-2">
        <h3 style={{ 
          fontFamily: 'var(--font-title)', 
          fontSize: 'clamp(28px, 4vw, 32px)', 
          color: '#f1f5f9', 
          marginBottom: '10px' 
        }}>
          {title}
        </h3>
        <div style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, #C8962A 0%, #ffdf85 40%, transparent 100%)',
          opacity: 0.8,
          boxShadow: '0 0 10px #C8962A'
        }} />
      </div>

      <div className="relative pl-3">
        {/* The Golden Line */}
        <div ref={lineRef as React.RefObject<HTMLDivElement>} className="absolute left-3 top-0 bottom-0 w-px origin-top" 
          style={{ background: 'linear-gradient(180deg, #C8962A, rgba(200,150,42,0.05))', transform: 'scaleY(0)' }} 
        />
        
        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.title} className="relative pl-10">
              
              {/* Golden glowing dot */}
              <div className="absolute left-3 top-2 -translate-x-[50%] w-[13px] h-[13px] rounded-full flex items-center justify-center bg-transparent" 
                style={{ border: '1px solid rgba(200,150,42,0.4)', left: '0px' }}
              >
                <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: '#C8962A', boxShadow: '0 0 10px 2px #C8962A' }} />
              </div>
              
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#C8962A', letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>{item.period}</div>
              
              <Tilt3D intensity={3} scale={1.01}>
                <div className="tl-card card-dark" style={{ 
                  padding: '24px', 
                  background: 'rgba(10, 12, 18, 0.65)',
                  border: '1px solid rgba(200,150,42,0.2)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', fontWeight: 500, color: '#f1f5f9', lineHeight: 1.3, marginBottom: '6px' }}>{item.title}</h4>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#C8962A', marginBottom: '16px', opacity: 0.9 }}>{item.org}</div>
                  
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.8, marginBottom: item.tags.length ? '16px' : 0 }}>{item.description}</p>
                  
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <span key={`${item.title}-${t}`} style={{ 
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
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Tilt3D>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="parcours" className="relative w-full overflow-hidden" style={{ padding: 'calc(var(--section-pad-y) * 0.8) 0', backgroundColor: '#05070d' }}>
      
      {/* Background Image Setup */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'url(/about-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9
        }} 
      />
      
      {/* Mask it a bit with a gradient down */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(5,7,12,0.98) 0%, rgba(5,7,12,0.92) 20%, rgba(5,7,12,0.65) 60%, rgba(5,7,12,0.15) 100%)',
        }}
      />

      <div className="mx-auto relative z-10" style={{ maxWidth: '1100px', padding: '0 var(--section-pad-x)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {renderTL(experienceItems, expLineRef, 'Expérience')}
          {renderTL(formationItems, formLineRef, 'Formation')}
        </div>
      </div>
    </section>
  );
}
