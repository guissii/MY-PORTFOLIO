import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/* ── SVG icons for the 3 specialties bar ── */
const BrainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 1 4-4z" />
    <path d="M8 8v2a4 4 0 0 0 8 0V8" />
    <path d="M6 14a6 6 0 0 0 12 0" />
    <path d="M12 14v8" />
    <circle cx="8" cy="10" r="1" fill="#C8962A" />
    <circle cx="16" cy="10" r="1" fill="#C8962A" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CloudIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    <path d="M12 13v4M9 15l3-3 3 3" />
  </svg>
);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Top nav (inline hero nav)
    tl.fromTo(navRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 }, 0);

    // Subtitle
    tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3);

    // Name — letter stagger
    if (titleRef.current) {
      const children = titleRef.current.querySelectorAll('.name-letter');
      tl.fromTo(children, { opacity: 0, y: 40, rotateX: -15 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.025 }, 0.5);
    }

    // Description
    tl.fromTo(descRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 1.3);

    // Buttons
    tl.fromTo(btnsRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 1.6);

    // Bottom bar
    tl.fromTo(bottomRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.9);
  }, []);

  const scrollToWork = () => {
    gsap.to(window, { duration: 1.2, scrollTo: { y: '#projets', offsetY: 60 }, ease: 'power3.inOut' });
  };

  // Split text into individual spans for letter stagger
  const splitText = (text: string, color: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="name-letter inline-block" style={{ color }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #070a12 0%, #05070d 100%)',
      }}
    >
      <div className="absolute inset-0 hero-bg" />
      
      {/* Very light mask ONLY on the far left edge just to keep text readable, COMPLETELY transparent on the right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.6) 40%, transparent 60%)',
        }}
      />
      
      {/* Subtle fade at the very bottom to blend with the next section */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '20vh',
          background: 'linear-gradient(180deg, transparent 0%, #05070d 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col justify-between" style={{ minHeight: '100vh' }}>

        {/* Top nav (inline hero nav) */}
        <div ref={navRef} className="flex items-center justify-between px-6 md:px-12 pt-6" style={{ opacity: 0 }}>
          <button
            onClick={() => gsap.to(window, { duration: 1, scrollTo: { y: '#hero', offsetY: 60 }, ease: 'power3.inOut' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
            aria-label="Aller à l'accueil"
          >
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <text x="4" y="18" fontFamily="'Space Grotesk', sans-serif" fontSize="16" fontWeight="600" fill="#C8962A" letterSpacing="-1">M</text>
              <text x="14" y="34" fontFamily="'Space Grotesk', sans-serif" fontSize="16" fontWeight="600" fill="#C8962A" letterSpacing="-1">G</text>
            </svg>
          </button>

          <div
            className="hidden md:flex items-center gap-8"
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(8, 11, 20, 0.55)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
            }}
          >
            {[
              { label: 'Accueil', href: '#hero', active: true },
              { label: 'À propos', href: '#about' },
              { label: 'Expertises', href: '#competences' },
              { label: 'Projets', href: '#projets' },
              { label: 'Contact', href: '#contact' },
            ].map((item) => (
              <button key={item.href} className="nav-link flex items-center gap-1.5"
                onClick={() => gsap.to(window, { duration: 1, scrollTo: { y: item.href, offsetY: 60 }, ease: 'power3.inOut' })}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: item.active ? 500 : 400,
                  color: item.active ? '#C8962A' : '#8a94a6',
                  background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => { if (!item.active) e.currentTarget.style.color = '#D4A843'; }}
                onMouseLeave={(e) => { if (!item.active) e.currentTarget.style.color = '#8a94a6'; }}
              >
                {item.active && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C8962A' }} />}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main hero content — LEFT */}
        <div className="flex-1 flex items-center px-6 md:px-12 lg:px-16" style={{ maxWidth: '700px' }}>
          <div>
            {/* Subtitle */}
            <div ref={subtitleRef} style={{
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '3px', color: '#8a94a6',
              marginBottom: '16px', opacity: 0,
            }}>
              Ingénieur en Systèmes Communicants &<br />Sécurité Numérique
            </div>

            {/* Name — BIG */}
            <div ref={titleRef} style={{ marginBottom: '20px', perspective: '800px' }}>
              <div style={{
                fontFamily: 'var(--font-title)', fontSize: 'clamp(52px, 10vw, 90px)',
                fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px',
              }}>
                {splitText('Mohammed', '#f1f5f9')}
              </div>
              <div style={{
                fontFamily: 'var(--font-title)', fontSize: 'clamp(52px, 10vw, 90px)',
                fontWeight: 700, lineHeight: 1.05, letterSpacing: '-2px',
              }}>
                {splitText('Guissi', '#C8962A')}
              </div>
              <div style={{ width: '64px', height: '2px', backgroundColor: '#C8962A', marginTop: '14px', opacity: 0.85 }} />
            </div>

            {/* Description */}
            <div ref={descRef} style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7,
              color: '#8a94a6', maxWidth: '460px', marginBottom: '32px', opacity: 0,
            }}>
              Spécialisé en <span style={{ color: '#C8962A', fontWeight: 500 }}>Intelligence Artificielle</span>, cybersécurité,
              MLOps et infrastructure Cloud/DevOps.
            </div>

            {/* Buttons */}
            <div ref={btnsRef} className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
              <button onClick={scrollToWork} style={{
                fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '1px',
                color: '#080B14', backgroundColor: '#C8962A',
                border: '1px solid #C8962A', borderRadius: '6px',
                padding: '14px 28px', cursor: 'pointer', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(200,150,42,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Découvrir mon travail
                <span>→</span>
              </button>


            </div>
          </div>
        </div>

        {/* Bottom specialties bar */}
        <div ref={bottomRef} className="px-6 md:px-12 pb-8" style={{ opacity: 0 }}>
          <div className="flex flex-wrap gap-8 items-center" style={{ borderTop: '1px solid rgba(200,150,42,0.1)', paddingTop: '20px' }}>
            {[
              { icon: <BrainIcon />, label: 'IA & MACHINE', sub: 'LEARNING' },
              { icon: <ShieldIcon />, label: 'CYBERSÉCURITÉ', sub: '' },
              { icon: <CloudIcon />, label: 'DEVOPS & CLOUD', sub: '' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3" style={{ cursor: 'default' }}>
                <div style={{ opacity: 0.7 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#e2e8f0', lineHeight: 1.3 }}>
                    {item.label}
                  </div>
                  {item.sub && (
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#e2e8f0', lineHeight: 1.3 }}>
                      {item.sub}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-6">
            <div className="scroll-chevron">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
