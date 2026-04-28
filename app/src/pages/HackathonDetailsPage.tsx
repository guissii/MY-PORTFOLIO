import { useEffect, useMemo, useState } from 'react';
import { hackathons as defaultHackathons, type HackathonItem } from '@/data/hackathons';
import MediaGallery from '@/components/MediaGallery';
import gsap from 'gsap';

type HackathonDetailsPageProps = {
  slug: string;
};

export default function HackathonDetailsPage({ slug }: HackathonDetailsPageProps) {
  const [items, setItems] = useState<HackathonItem[]>(defaultHackathons);

  useEffect(() => {
    // Scroll au top dès le montage pour qu'on ne reste pas en bas
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch('/api/public/hackathons');
        const data = await res.json();
        if (res.ok && Array.isArray(data?.hackathons) && data.hackathons.length > 0) {
          setItems(data.hackathons);
        }
      } catch {
        // Keep local fallback silently
      }
    };
    loadItems();
  }, []);

  const hackathon = useMemo(() => items.find((item) => item.slug === slug), [items, slug]);

  const resolvedImage = useMemo(() => {
    if (!hackathon) return '';
    return hackathon.coverImagePathname || '';
  }, [hackathon]);

  useEffect(() => {
    if (!hackathon) return;
    const ctx = gsap.context(() => {
      gsap.from('.proj-anim', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, [hackathon]);

  if (!hackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#05070d' }}>
        <div className="text-center">
          <h1 style={{ color: '#f1f5f9', fontFamily: 'var(--font-title)', fontSize: '36px', marginBottom: '10px' }}>
            Hackathon introuvable
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
                <img src={resolvedImage} alt={hackathon.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-card) 40%, rgba(200,150,42,0.2) 100%)' }}
                >
                  <span style={{ fontFamily: 'var(--font-title)', fontSize: '48px', color: 'rgba(200,150,42,0.2)', fontWeight: 'bold' }}>
                    HACKATHON
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(15, 20, 32, 0.75) 100%)' }} />
            </div>

            <div className="p-8 md:p-12 -mt-10 relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className="glow-tag px-3 py-1 text-[11px] uppercase tracking-[1.5px] font-semibold"
                >
                  {hackathon.result}
                </span>
                <span style={{ color: '#475569', fontSize: '12px' }}>•</span>
                <span style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600 }}>{hackathon.period}</span>
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
                {hackathon.name}
              </h1>

              <div style={{ width: '60px', height: '2px', backgroundColor: '#C8962A', opacity: 0.6, marginBottom: '32px' }} />

              <div className="text-content space-y-6">
                <p 
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    color: '#cbd5e1',
                    lineHeight: 1.8,
                    fontWeight: 300
                  }}
                >
                  {hackathon.detail}
                </p>
              </div>

              <MediaGallery slug={hackathon.slug} collection="hackathons" fallbackImage={resolvedImage} />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
