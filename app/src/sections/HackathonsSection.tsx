import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hackathons as defaultHackathons, type HackathonItem } from '@/data/hackathons';
import Tilt3D from '@/components/Tilt3D';

gsap.registerPlugin(ScrollTrigger);

export default function HackathonsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<HackathonItem[]>(defaultHackathons);
  const sorted = useMemo(() => [...items].sort((a, b) => String(b.period).localeCompare(String(a.period))), [items]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from('.h-anim', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => { const t = setTimeout(() => ScrollTrigger.refresh(), 0); return () => clearTimeout(t); }, [items.length]);
  useEffect(() => { (async () => { try { const r = await fetch('/api/public/hackathons'); const d = await r.json(); if (r.ok && Array.isArray(d?.hackathons) && d.hackathons.length) setItems(d.hackathons); } catch { return; } })(); }, []);

  const openHackathon = (slug: string) => {
    window.location.hash = `/hackathons/${slug}`;
  };

  return (
    <section ref={sectionRef} id="hackathons" className="relative w-full overflow-hidden" style={{ padding: 'calc(var(--section-pad-y) * 0.8) 0', backgroundColor: '#05070d' }}>
      
      {/* Background Image Setup using the same wave background */}
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
      
      {/* Light radial mask to let the gold shine everywhere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(5,7,12,0.05) 0%, rgba(5,7,12,0.3) 70%, rgba(5,7,12,0.8) 100%)',
        }}
      />
      
      {/* Top and Bottom explicit fade */}
      <div className="absolute inset-x-0 top-0 h-[150px] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(5,7,12,1) 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-[150px] pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(5,7,12,1) 0%, transparent 100%)' }} />

      <div className="mx-auto relative z-10" style={{ maxWidth: '1100px', padding: '0 var(--section-pad-x)' }}>
        
        <div style={{ marginBottom: '56px', marginLeft: '8px' }}>
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Compétitions</span>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.5 }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.5px' }}>Hackathons</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {sorted.map((item, i) => (
            <Tilt3D key={item.slug} intensity={6} scale={1.03}>
              <article className="hack-card cursor-pointer group" style={{ 
                padding: '36px', 
                position: 'relative', 
                overflow: 'hidden',
                background: 'rgba(10, 12, 18, 0.65)',
                borderRadius: '12px',
                border: '1px solid rgba(200,150,42,0.15)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.4s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
                onClick={() => openHackathon(item.slug)}
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

                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#C8962A', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>{item.period}</div>
                
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '25px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px', lineHeight: 1.3 }}>{item.name}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#C8962A', marginBottom: '20px', fontWeight: 500 }}>{item.result}</p>
                
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, flexGrow: 1, marginBottom: '32px' }}>
                  {item.detail.length > 200 ? item.detail.substring(0, 200) + '...' : item.detail}
                </p>
                
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#C8962A', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  VOIR DETAILS <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-2">→</span>
                </div>
              </article>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
