import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const navItems = [
  { label: 'A PROPOS', href: '#about' },
  { label: 'COMPETENCES', href: '#competences' },
  { label: 'SOFT SKILLS', href: '#soft-skills' },
  { label: 'PARCOURS', href: '#parcours' },
  { label: 'PROJETS', href: '#projets' },
  { label: 'HACKATHONS', href: '#hackathons' },
  { label: 'CERTIFS', href: '#certifications' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navigation() {
  const [visible, setVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, [visible]);

  const scrollTo = (id: string) => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: id, offsetY: 60 },
      ease: 'power3.inOut',
    });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 opacity-0 -translate-y-full"
      style={{
        backgroundColor: 'rgba(42, 10, 46, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-5 md:px-10 h-14"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        <button
          onClick={() => scrollTo('#hero')}
          className="font-display text-xl tracking-wide"
          style={{ color: '#FFD700' }}
        >
          MG
        </button>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="relative font-mono text-xs tracking-wider transition-colors duration-300 hover:text-gold-bright"
              style={{ color: '#C8B8D8' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#C8B8D8';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <MobileMenu scrollTo={scrollTo} />
      </div>
    </nav>
  );
}

function MobileMenu({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-1 p-2"
        aria-label="Menu"
      >
        <span
          className="block w-5 h-0.5 transition-transform duration-300"
          style={{
            backgroundColor: '#FFD700',
            transform: open ? 'rotate(45deg) translateY(3px)' : 'none',
          }}
        />
        <span
          className="block w-5 h-0.5 transition-opacity duration-300"
          style={{
            backgroundColor: '#FFD700',
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block w-5 h-0.5 transition-transform duration-300"
          style={{
            backgroundColor: '#FFD700',
            transform: open ? 'rotate(-45deg) translateY(-3px)' : 'none',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-14 left-0 right-0 p-4 flex flex-col gap-3"
          style={{
            backgroundColor: 'rgba(42, 10, 46, 0.95)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                scrollTo(item.href);
                setOpen(false);
              }}
              className="text-left font-mono text-sm py-2 px-4 rounded-lg transition-colors"
              style={{ color: '#C8B8D8' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#C8B8D8';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
