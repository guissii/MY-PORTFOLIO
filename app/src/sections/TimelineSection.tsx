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
      'Genie des Systemes Communicants & Securite Numerique. Candidature double diplome ENSIM — Interaction Personnes-Systemes.',
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
  const experienceLineRef = useRef<HTMLDivElement>(null);
  const formationLineRef = useRef<HTMLDivElement>(null);
  const experienceCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const formationCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const lines = [
        { ref: experienceLineRef, triggerId: '#experience' },
        { ref: formationLineRef, triggerId: '#formation' },
      ];

      lines.forEach(({ ref, triggerId }) => {
        if (!ref.current) return;
        const triggerEl = section.querySelector(triggerId);
        if (!triggerEl) return;
        gsap.fromTo(
          ref.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: triggerEl,
              start: 'top 75%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      });

      const animateCards = (cards: (HTMLDivElement | null)[]) => {
        cards.forEach((card) => {
          if (!card) return;
          gsap.from(card, {
            y: 16,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          });
        });
      };

      animateCards(experienceCardRefs.current);
      animateCards(formationCardRefs.current);
    }, section);

    return () => {
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
      <div className="mx-auto" style={{ maxWidth: '980px' }}>
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

        <div
          className="rounded-2xl p-6 md:p-10"
          style={{
            background:
              'radial-gradient(1000px 600px at 20% -10%, rgba(255, 215, 0, 0.08), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(124, 58, 237, 0.12), transparent 55%), rgba(13, 11, 30, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            <div id="experience">
              <div className="mb-7">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.18em',
                    color: '#FFD700',
                    marginBottom: '10px',
                  }}
                >
                  EXPERIENCE
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#F0E6FF',
                    lineHeight: 1.15,
                  }}
                >
                  Un fil “signal” clair et lisible
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#8A7A9A',
                    marginTop: '10px',
                    lineHeight: 1.65,
                  }}
                >
                  Chaque poste = une station. Lecture rapide, sans effet lourd.
                </p>
              </div>

              <div className="relative">
                <div
                  ref={experienceLineRef}
                  className="absolute left-3 top-0 bottom-0 w-px origin-top"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,215,0,0.95) 0%, rgba(255,215,0,0.18) 100%)',
                    transform: 'scaleY(0)',
                  }}
                />

                <div className="space-y-6">
                  {experienceItems.map((item, i) => (
                    <div key={item.title} className="relative pl-10">
                      <div
                        className="absolute left-3 top-6 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: '#FFD700',
                          boxShadow: '0 0 0 6px rgba(255, 215, 0, 0.12)',
                        }}
                      />

                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: '#FFD700',
                          backgroundColor: 'rgba(255, 215, 0, 0.08)',
                          border: '1px solid rgba(255, 215, 0, 0.18)',
                          borderRadius: '999px',
                          padding: '6px 10px',
                          width: 'fit-content',
                          marginBottom: '10px',
                        }}
                      >
                        {item.period}
                      </div>

                      <div
                        ref={(el) => {
                          experienceCardRefs.current[i] = el;
                        }}
                        className="rounded-xl p-5"
                        style={{
                          backgroundColor: 'rgba(8, 9, 26, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '18px',
                            fontWeight: 650,
                            color: '#F0E6FF',
                            lineHeight: 1.25,
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
                            marginBottom: item.tags.length > 0 ? '12px' : 0,
                          }}
                        >
                          {item.description}
                        </p>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={`${item.title}-${tag}`}
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '11px',
                                  color: '#E9DEFF',
                                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                                  border: '1px solid rgba(124, 58, 237, 0.22)',
                                  borderRadius: '999px',
                                  padding: '5px 10px',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="formation">
              <div className="mb-7">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.18em',
                    color: '#7C3AED',
                    marginBottom: '10px',
                  }}
                >
                  FORMATION
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#F0E6FF',
                    lineHeight: 1.15,
                  }}
                >
                  Une seconde ligne, plus “academique”
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#8A7A9A',
                    marginTop: '10px',
                    lineHeight: 1.65,
                  }}
                >
                  Même logique de stations, mais avec un accent différent.
                </p>
              </div>

              <div className="relative">
                <div
                  ref={formationLineRef}
                  className="absolute left-3 top-0 bottom-0 w-px origin-top"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(124,58,237,0.95) 0%, rgba(124,58,237,0.18) 100%)',
                    transform: 'scaleY(0)',
                  }}
                />

                <div className="space-y-6">
                  {formationItems.map((item, i) => (
                    <div key={item.title} className="relative pl-10">
                      <div
                        className="absolute left-3 top-6 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: '#7C3AED',
                          boxShadow: '0 0 0 6px rgba(124, 58, 237, 0.14)',
                        }}
                      />

                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: '#E9DEFF',
                          backgroundColor: 'rgba(124, 58, 237, 0.12)',
                          border: '1px solid rgba(124, 58, 237, 0.22)',
                          borderRadius: '999px',
                          padding: '6px 10px',
                          width: 'fit-content',
                          marginBottom: '10px',
                        }}
                      >
                        {item.period}
                      </div>

                      <div
                        ref={(el) => {
                          formationCardRefs.current[i] = el;
                        }}
                        className="rounded-xl p-5"
                        style={{
                          backgroundColor: 'rgba(8, 9, 26, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '18px',
                            fontWeight: 650,
                            color: '#F0E6FF',
                            lineHeight: 1.25,
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
                            marginBottom: item.tags.length > 0 ? '12px' : 0,
                          }}
                        >
                          {item.description}
                        </p>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={`${item.title}-${tag}`}
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '11px',
                                  color: '#FFD700',
                                  backgroundColor: 'rgba(255, 215, 0, 0.08)',
                                  border: '1px solid rgba(255, 215, 0, 0.18)',
                                  borderRadius: '999px',
                                  padding: '5px 10px',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
