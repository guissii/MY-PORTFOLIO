import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experienceItems = [
  {
    period: 'Juin 2025 — Juil 2025',
    title: 'Stagiaire IA, Operations IT & Cybersécurité',
    org: 'ALTEN Maroc · Fes, Maroc',
    description:
      'Conception et déploiement de SAGU : pipeline NLP complet (CamemBERT + PyTorch) en production industrielle. Classification automatique de tickets clients — 96% precision, 94.8% rappel sur 8 349 tickets. Module IDS intelligent (ML) pour detection d\'anomalies reseau. Systeme de correlation d\'alertes SIEM assiste par IA.',
    tags: ['Python', 'PyTorch', 'CamemBERT', 'Streamlit', 'Docker'],
  },
  {
    period: 'Fev 2026 — Present',
    title: 'Contributeur IA',
    org: 'Alignerr · San Francisco, CA',
    description:
      'Evaluation de la qualite de prompts techniques pour LM Arena V2. Annotation de sorties LLM dans le cadre du RLHF. Redaction de prompts complexes et notation selon des criteres rigoureux. Contribution active a l\'alignement de modeles IA de grande envergure.',
    tags: ['RLHF', 'LLM', 'Prompt Engineering', 'Evaluation IA'],
  },
  {
    period: 'Dec 2024 — Present',
    title: 'Freelance — Developpement IA, Web & Cybersécurité',
    org: 'Independant · Fes, Maroc',
    description:
      'Conception et déploiement de sites web professionnels from scratch. Developpement d\'agents IA autonomes (LLM, Prompt Engineering). Integration de solutions IPS/IDS basees ML. Deploiement conteneurise avec CI/CD automatise.',
    tags: ['React', 'TypeScript', 'Docker', 'LLM', 'CI/CD'],
  },
  {
    period: '2023 — Present',
    title: 'Enseignant — Cours de Soutien',
    org: 'Cours particuliers · Fes, Maroc',
    description:
      'Accompagnement d\'etudiants CPGE et 1ere annee ingenierie en Mathematiques et Physique. Pedagogie adaptee, vulgarisation technique, suivi personnalise.',
    tags: [],
  },
];

const formationItems = [
  {
    period: '2024 — Present',
    title: 'Cycle Ingenieur',
    org: 'ENSA de Fes',
    description:
      'Genie des Systemes Communicants & Securite Numerique. Top 30 de l\'annee, Top 10 en 2eme annee. Candidature double diplome ENSIM — Interaction Personnes-Systemes.',
    tags: ['ENSA Fes', 'Systemes Communicants', 'Securite Numerique'],
  },
  {
    period: '2022 — 2024',
    title: 'CPGE MP — Mathematiques-Physique',
    org: 'Classes Preparatoires',
    description:
      'Parcours intensif en mathematiques et physique. Classe 2eme promotion (Top 2) en 2eme annee.',
    tags: ['CPGE', 'Mathematiques', 'Physique'],
  },
];

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const formationWrapRef = useRef<HTMLDivElement>(null);
  const formationTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Timeline line grows on scroll
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }

      // Cards animate in
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const isLeft = i % 2 === 0;
        gsap.from(card, {
          x: isLeft ? -40 : 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
          },
        });
      });

      // Formation horizontal scroll (left -> right) on desktop
      mm.add('(min-width: 768px)', () => {
        const wrap = formationWrapRef.current;
        const track = formationTrackRef.current;
        if (!wrap || !track) return;

        gsap.from(track, {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: wrap,
            start: 'top 80%',
          },
        });

        gsap.to(track, {
          x: () => {
            const maxShift = Math.max(0, track.scrollWidth - wrap.clientWidth);
            return -maxShift;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top+=80',
            end: () => {
              const maxShift = Math.max(0, track.scrollWidth - wrap.clientWidth);
              return `+=${Math.max(maxShift, 220)}`;
            },
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
    }, section);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="parcours"
      style={{
        backgroundColor: 'transparent',
        padding: 'var(--section-pad-y) var(--section-pad-x)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="text-center mb-20">
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
            PARCOURS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 700,
              color: '#F0E6FF',
              lineHeight: 1.1,
            }}
          >
            Experience & Formation
          </h2>
        </div>

        {/* Experience */}
        <div className="text-center mb-10">
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(24px, 3vw, 34px)',
              color: '#FFD700',
              fontWeight: 600,
            }}
          >
            Experience
          </h3>
        </div>

        <div className="relative">
          {/* Center Line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 origin-top"
            style={{
              backgroundColor: '#FFD700',
              transform: 'scaleY(0)',
            }}
          />

          {/* Items */}
          <div className="space-y-12">
            {experienceItems.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex items-start ${
                    isLeft
                      ? 'md:flex-row'
                      : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Node */}
                  <div
                    className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-6 z-10"
                    style={{
                      backgroundColor: '#FFD700',
                      border: '3px solid #3D1A45',
                    }}
                  />

                  {/* Card */}
                  <div
                    ref={(el) => { cardRefs.current[i] = el; }}
                    className={`ml-10 md:ml-0 md:w-[45%] ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}
                  >
                    <div
                      className="p-6 rounded-xl"
                      style={{
                        backgroundColor: 'rgba(42, 10, 46, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 215, 0, 0.15)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: '#FFD700',
                          marginBottom: '8px',
                        }}
                      >
                        {item.period}
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#F0E6FF',
                          marginBottom: '4px',
                        }}
                      >
                        {item.title}
                      </h3>
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: '#8A7A9A',
                          marginBottom: '8px',
                        }}
                      >
                        {item.org}
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          color: '#C8B8D8',
                          lineHeight: 1.7,
                          marginBottom: item.tags.length > 0 ? '12px' : 0,
                        }}
                      >
                        {item.description}
                      </p>
                      {item.tags.length > 0 && (
                        <div className={`flex flex-wrap gap-1.5 ${isLeft ? 'md:justify-end' : ''}`}>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: '#FFD700',
                                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                                borderRadius: '4px',
                                padding: '4px 10px',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formation */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(24px, 3vw, 34px)',
                color: '#FFD700',
                fontWeight: 600,
              }}
            >
              Formation
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: '#8A7A9A',
                marginTop: '8px',
              }}
            >
              Defilement horizontal de gauche vers la droite avec le scroll
            </p>
          </div>

          {/* Mobile: vertical cards for clean scrolling */}
          <div className="md:hidden space-y-4">
            {formationItems.map((item) => (
              <article
                key={`mobile-${item.title}`}
                className="rounded-xl p-5"
                style={{
                  backgroundColor: 'rgba(42, 10, 46, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 215, 0, 0.15)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: '#FFD700',
                    marginBottom: '8px',
                  }}
                >
                  {item.period}
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#F0E6FF',
                    marginBottom: '6px',
                  }}
                >
                  {item.title}
                </h4>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: '#8A7A9A',
                    marginBottom: '10px',
                  }}
                >
                  {item.org}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#C8B8D8',
                    lineHeight: 1.7,
                    marginBottom: '12px',
                  }}
                >
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={`mobile-tag-${tag}`}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderRadius: '4px',
                        padding: '4px 10px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Desktop: horizontal scroll synced with vertical wheel */}
          <div ref={formationWrapRef} className="relative hidden md:block overflow-hidden">
            <div ref={formationTrackRef} className="flex gap-8 w-max pb-2 px-1">
              {formationItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl p-6 min-w-[460px] max-w-[520px]"
                  style={{
                    backgroundColor: 'rgba(42, 10, 46, 0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: '#FFD700',
                      marginBottom: '8px',
                    }}
                  >
                    {item.period}
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '22px',
                      fontWeight: 600,
                      color: '#F0E6FF',
                      marginBottom: '6px',
                    }}
                  >
                    {item.title}
                  </h4>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: '#8A7A9A',
                      marginBottom: '10px',
                    }}
                  >
                    {item.org}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: '#C8B8D8',
                      lineHeight: 1.7,
                      marginBottom: '12px',
                    }}
                  >
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: '#FFD700',
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                          borderRadius: '4px',
                          padding: '4px 10px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
