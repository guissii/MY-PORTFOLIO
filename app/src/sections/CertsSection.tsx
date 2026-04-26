import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Award, FileCheck, Lock, Monitor } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  { name: 'Cybersecurity', issuer: 'Cisco', Icon: Shield },
  { name: 'Network Technician', issuer: 'Cisco', Icon: Monitor },
  { name: 'JavaScript Essentials', issuer: 'Cisco', Icon: FileCheck },
  { name: 'Operations Reseaux', issuer: 'ISOC', Icon: Award },
  { name: 'Security Awareness', issuer: 'KnowBe4', Icon: Lock },
];

const engagements = [
  {
    role: 'Tresorier & Co-fondateur',
    org: 'Club NeuroSec — ENSA Fes',
    period: '2024 — Present',
    detail:
      "Premier club au Maroc dedie a l'intersection Intelligence Artificielle & Cybersécurité. Organisation de workshops, CTF et conferences.",
    Icon: Lock,
  },
  {
    role: 'President',
    org: 'Olympiade Fes',
    period: '2024 — Present',
    detail:
      "Fondateur et president de l'association dediee a l'organisation de tournois sportifs et jeux estudiantins au niveau regional.",
    Icon: Award,
  },
  {
    role: 'Contributeur Open Source',
    org: 'GitHub',
    period: '2024 — Present',
    detail:
      '400+ commits en 2025-2026, 20+ projets developpes et deployes from scratch. Contributeur actif a des projets open source.',
    Icon: Shield,
  },
];

export default function CertsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from('.cert-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      gsap.from('.engage-card', {
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      style={{
        backgroundColor: 'transparent',
        padding: '80px var(--section-pad-x)',
      }}
    >
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        {/* Left — Certifications */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#FFD700',
              letterSpacing: '0.2em',
              marginBottom: '12px',
            }}
          >
            CERTIFICATIONS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 700,
              color: '#F0E6FF',
              lineHeight: 1.1,
              marginBottom: '32px',
            }}
          >
            Diplomes & Certifs
          </h2>

          <div className="space-y-0">
            {certifications.map((cert) => {
              const Icon = cert.Icon;
              return (
                <div
                  key={cert.name}
                  className="cert-item flex items-center gap-4 py-4"
                  style={{
                    borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                  >
                    <Icon size={18} color="#FFD700" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '16px',
                        color: '#F0E6FF',
                        fontWeight: 500,
                      }}
                    >
                      {cert.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: '#8A7A9A',
                      }}
                    >
                      {cert.issuer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Engagements */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#FFD700',
              letterSpacing: '0.2em',
              marginBottom: '12px',
            }}
          >
            ENGAGEMENTS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 700,
              color: '#F0E6FF',
              lineHeight: 1.1,
              marginBottom: '32px',
            }}
          >
            Leadership & Impact
          </h2>

          <div className="space-y-4">
            {engagements.map((eng) => {
              const Icon = eng.Icon;
              return (
                <div
                  key={eng.org}
                  className="engage-card p-6 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(42, 10, 46, 0.5)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={16} color="#FFD700" />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: '#FFD700',
                      }}
                    >
                      {eng.role}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#F0E6FF',
                      marginBottom: '2px',
                    }}
                  >
                    {eng.org}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: '#8A7A9A',
                      marginBottom: '8px',
                    }}
                  >
                    {eng.period}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: '#C8B8D8',
                      lineHeight: 1.7,
                    }}
                  >
                    {eng.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
