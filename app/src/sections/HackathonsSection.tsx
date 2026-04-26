import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const hackathons = [
  {
    name: 'Hackathon Sante IA',
    result: 'Lauréat - MedTriage AI',
    period: '2025',
    detail: 'Conception d un triage medical intelligent avec pipeline TypeScript + Python + FastAPI.',
  },
  {
    name: 'Hackathon Cyber & IA',
    result: 'Finaliste - DeepTrue',
    period: '2025',
    detail: 'Prototype de detection deepfakes et verification de desinformation en temps reel.',
  },
  {
    name: 'AI Agents Challenge',
    result: 'Top Projet - Agents IA autonomes',
    period: '2026',
    detail: 'Orchestration multi-outils LLM avec chaines d actions, observabilite et API externes.',
  },
];

export default function HackathonsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from('.hackathon-card', {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hackathons"
      style={{
        backgroundColor: 'transparent',
        padding: 'var(--section-pad-y) var(--section-pad-x)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--container-max)' }}>
        <div className="text-center mb-12">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#C9A227',
              letterSpacing: '0.2em',
              marginBottom: '12px',
            }}
          >
            HACKATHONS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(34px, 5vw, 64px)',
              fontWeight: 700,
              color: '#F0E6FF',
              lineHeight: 1.1,
            }}
          >
            Competitions & Challenges
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((item) => (
            <article
              key={item.name}
              className="hackathon-card rounded-2xl p-6 transition-all duration-300"
              style={{
                backgroundColor: '#0D0B1E',
                border: '1px solid rgba(201, 162, 39, 0.25)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#C9A227',
                  marginBottom: '10px',
                }}
              >
                {item.period}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#F0E6FF',
                  marginBottom: '6px',
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: '#D4C58D',
                  marginBottom: '8px',
                }}
              >
                {item.result}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#BEB9CF',
                  lineHeight: 1.6,
                }}
              >
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
