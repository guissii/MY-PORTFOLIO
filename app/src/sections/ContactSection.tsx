import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Github, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const contactItems = [
  {
    icon: Mail,
    label: 'guissimohammed04@gmail.com',
    href: 'mailto:guissimohammed04@gmail.com',
  },
  {
    icon: Phone,
    label: '+212 649 878 763',
    href: 'tel:+212649878763',
  },
  {
    icon: Globe,
    label: 'mohammedguissi.com',
    href: 'https://mohammedguissi.com',
  },
  {
    icon: Github,
    label: 'github.com/guissii',
    href: 'https://github.com/guissii',
  },
  {
    icon: MapPin,
    label: 'Fes, Maroc',
    href: '#',
  },
];

const languages = [
  { name: 'Francais', level: 'C1' },
  { name: 'Anglais', level: 'C1 (technique)' },
  { name: 'Arabe', level: 'Natif' },
];

const interests = [
  'Veille technologique',
  'Hackathons nationaux/internationaux',
  'CTF & challenges securite',
  'Developpement open source',
  'Veille IA & DevOps',
  'Sport & discipline',
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title word-by-word reveal
      gsap.from(titleWordsRef.current.filter(Boolean), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      // Contact items
      gsap.from('.contact-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
        },
      });

      // Social buttons
      gsap.from('.social-btn-contact', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        backgroundColor: 'transparent',
        padding: '120px var(--section-pad-x) 60px',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--container-max)' }}>
        {/* Dramatic Title */}
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 10vw, 140px)',
              lineHeight: 1,
            }}
          >
            <span className="block">
              <span
                ref={(el) => { titleWordsRef.current[0] = el; }}
                style={{ color: '#F0E6FF' }}
              >
                Tr
              </span>
              <span
                ref={(el) => { titleWordsRef.current[1] = el; }}
                style={{ color: '#F0E6FF', fontWeight: 700 }}
              >
                availlons
              </span>
            </span>
            <span
              ref={(el) => { titleWordsRef.current[2] = el; }}
              className="block"
              style={{ color: '#FFD700' }}
            >
              ENSEMBLE
            </span>
          </h2>
        </div>

        {/* Contact Info Row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-10">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="contact-item flex flex-col items-center gap-2 group"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Icon size={32} color="#FFD700" />
                <span
                  className="group-hover:underline transition-all"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: '#C8B8D8',
                  }}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4 mb-20">
          <a
            href="https://www.linkedin.com/in/mohammed-guissi-05a503319/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn-contact inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: '#0A66C2' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <a
            href="https://wa.me/212649878763"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn-contact inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <div
            className="p-8 rounded-2xl"
            style={{
              backgroundColor: 'rgba(42, 10, 46, 0.5)',
              border: '1px solid rgba(255, 215, 0, 0.1)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 500,
                color: '#FFD700',
                letterSpacing: '0.2em',
                marginBottom: '14px',
              }}
            >
              LANGUES
            </div>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center justify-between gap-6">
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#F0E6FF',
                    }}
                  >
                    {lang.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.12)',
                      border: '1px solid rgba(255, 215, 0, 0.15)',
                      borderRadius: '999px',
                      padding: '6px 12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-8 rounded-2xl"
            style={{
              backgroundColor: 'rgba(42, 10, 46, 0.5)',
              border: '1px solid rgba(255, 215, 0, 0.1)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 500,
                color: '#FFD700',
                letterSpacing: '0.2em',
                marginBottom: '14px',
              }}
            >
              INTERETS
            </div>
            <div className="flex flex-wrap gap-2.5">
              {interests.map((interest) => (
                <span
                  key={interest}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    borderRadius: '999px',
                    padding: '8px 14px',
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255, 215, 0, 0.1)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: '#8A7A9A',
            }}
          >
            © 2026 Mohammed Guissi. Tous droits reserves.
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: '#8A7A9A',
            }}
          >
            Conçu avec passion a Fes, Maroc
          </span>
        </div>
      </div>
    </section>
  );
}
