import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const navItems = [
  { label: 'Accueil', href: '#hero', active: true },
  { label: 'À propos', href: '#about' },
  { label: 'Expertises', href: '#competences' },
  { label: 'Projets', href: '#projets' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = () => setVisible(window.scrollY > window.innerHeight * 0.3);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (navRef.current) gsap.to(navRef.current, { y: visible ? 0 : -100, opacity: visible ? 1 : 0, duration: 0.5, ease: 'power3.out' });
  }, [visible]);

  const scrollTo = (id: string) => {
    gsap.to(window, { duration: 1.2, scrollTo: { y: id, offsetY: 60 }, ease: 'power3.inOut' });
    setMobileOpen(false);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 opacity-0 -translate-y-full"
      style={{ backgroundColor: 'rgba(8, 11, 20, 0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,150,42,0.08)' }}>
      <div className="mx-auto flex items-center justify-between px-6 md:px-10" style={{ maxWidth: 'var(--container-max)', height: '60px' }}>
        {/* MG Monogram */}
        <button onClick={() => scrollTo('#hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <text x="4" y="18" fontFamily="'Space Grotesk', sans-serif" fontSize="16" fontWeight="600" fill="#C8962A" letterSpacing="-1">M</text>
            <text x="14" y="34" fontFamily="'Space Grotesk', sans-serif" fontSize="16" fontWeight="600" fill="#C8962A" letterSpacing="-1">G</text>
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button key={item.href} onClick={() => scrollTo(item.href)} className="nav-link flex items-center gap-2"
              style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: item.active ? '#C8962A' : '#8a94a6', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s', fontWeight: item.active ? 500 : 400 }}
              onMouseEnter={(e) => { if (!item.active) e.currentTarget.style.color = '#D4A843'; }}
              onMouseLeave={(e) => { if (!item.active) e.currentTarget.style.color = '#8a94a6'; }}
            >
              {item.active && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C8962A' }} />}
              {item.label}
            </button>
          ))}
        </div>

        <button className="md:hidden flex flex-col items-center justify-center gap-[6px] p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <span className="menu-line" style={{ transform: mobileOpen ? 'rotate(45deg) translateY(3.5px)' : 'none' }} />
          <span className="menu-line" style={{ opacity: mobileOpen ? 0 : 1 }} />
          <span className="menu-line" style={{ transform: mobileOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none' }} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden" style={{ backgroundColor: 'rgba(8,11,20,0.95)', backdropFilter: 'blur(20px)', padding: '20px 24px' }}>
          {navItems.map((item) => (
            <button key={item.href} onClick={() => scrollTo(item.href)} className="block w-full text-left py-3"
              style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: item.active ? '#C8962A' : '#8a94a6', background: 'none', border: 'none', borderBottom: '1px solid rgba(200,150,42,0.06)', cursor: 'pointer' }}
            >{item.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}
