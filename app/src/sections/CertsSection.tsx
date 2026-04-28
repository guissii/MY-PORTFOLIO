import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt3D from '@/components/Tilt3D';

gsap.registerPlugin(ScrollTrigger);

const certs = [
  { name: 'Cybersecurity', issuer: 'Cisco' },
  { name: 'Network Technician', issuer: 'Cisco' },
  { name: 'JavaScript Essentials', issuer: 'Cisco' },
  { name: 'Operations Reseaux', issuer: 'ISOC' },
  { name: 'Security Awareness', issuer: 'KnowBe4' },
];

const engagements = [
  { role: 'TRESORIER & CO-FONDATEUR', org: 'Club NeuroSec — ENSA Fes', period: '2024 — Present', detail: "Premier club IA & Cybersécurité au Maroc. Workshops, CTF et conferences." },
  { role: 'PRESIDENT', org: 'Olympiade Fes', period: '2024 — Present', detail: "Tournois sportifs et jeux estudiantins regionaux." },
  { role: 'OPEN SOURCE', org: 'GitHub', period: '2024 — Present', detail: '400+ commits, 20+ projets from scratch.' },
];

export default function CertsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from('.cert-it', { y: 20, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%' } });
      gsap.from('.eng-it', { y: 25, opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="certifications" className="relative w-full overflow-hidden" style={{ padding: 'calc(var(--section-pad-y) * 0.8) 0', backgroundColor: '#05070d' }}>
      
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
      
      {/* Light radial mask to let the gold shine everywhere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(5,7,12,0.1) 0%, rgba(5,7,12,0.4) 70%, rgba(5,7,12,0.8) 100%)',
        }}
      />
      
      {/* Top and Bottom explicit fade */}
      <div className="absolute inset-x-0 top-0 h-[150px] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(5,7,12,1) 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-[150px] pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(5,7,12,1) 0%, transparent 100%)' }} />

      <div className="mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 relative z-10" style={{ maxWidth: '1100px', padding: '0 var(--section-pad-x)' }}>
        
        {/* LEFT COLUMN */}
        <div>
          <div style={{ marginBottom: '40px', marginLeft: '4px' }}>
            <div className="flex items-center gap-4 mb-4">
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Reconnaissance</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.5 }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.5px' }}>Certifications</h2>
          </div>
          
          <div className="card-dark group relative overflow-hidden" style={{ 
              padding: '32px 36px', 
              background: 'rgba(10, 12, 18, 0.65)',
              borderRadius: '12px',
              border: '1px solid rgba(200,150,42,0.15)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid rgba(200,150,42,0.6)';
              e.currentTarget.style.boxShadow = 'inset 0 40px 60px -40px rgba(200,150,42,0.25), 0 10px 40px -10px rgba(200,150,42,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid rgba(200,150,42,0.15)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {certs.map((c, idx) => (
              <div key={c.name} className="cert-it flex items-center justify-between py-6" style={{ borderBottom: idx === certs.length - 1 ? 'none' : '1px solid rgba(200,150,42,0.1)' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '18px', color: '#f1f5f9', fontWeight: 400, marginBottom: '6px' }}>{c.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#C8962A', fontWeight: 500 }}>{c.issuer}</div>
                </div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid rgba(200,150,42,0.6)', flexShrink: 0, transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C8962A'; e.currentTarget.style.boxShadow = '0 0 12px rgba(200,150,42,0.8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2, marginBottom: '32px', paddingTop: '10px' }}>
            Leadership & Impact
          </h2>
          <div className="flex flex-col gap-8">
            {engagements.map((e) => (
              <div key={e.org} className="eng-it">
                <Tilt3D intensity={6} scale={1.02}>
                  <div className="cursor-pointer group flex flex-col justify-center" style={{ 
                      padding: '36px 32px', 
                      background: 'rgba(10, 12, 18, 0.65)',
                      borderRadius: '12px',
                      border: '1px solid rgba(200,150,42,0.15)',
                      backdropFilter: 'blur(12px)',
                      transition: 'all 0.4s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(200,150,42,0.6)';
                      e.currentTarget.style.boxShadow = 'inset 0 40px 60px -40px rgba(200,150,42,0.25), 0 10px 40px -10px rgba(200,150,42,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(200,150,42,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#C8962A', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: 600 }}>{e.role}</div>
                    <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: 600, color: '#f1f5f9', marginBottom: '10px' }}>{e.org}</h3>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#C8962A', marginBottom: '16px' }}>{e.period}</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{e.detail}</p>
                  </div>
                </Tilt3D>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
