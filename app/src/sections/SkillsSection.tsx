import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GOLD = '#C9A227';

const hardSkills = [
  {
    title: 'IA / ML',
    skills: 'Python · PyTorch · TensorFlow · CamemBERT · NLP · LangChain · FastAPI · Streamlit · Scikit-learn · Agents IA · LLM · Prompt Engineering',
    icon: 'brain',
  },
  {
    title: 'DevOps / Cloud',
    skills: 'Docker · GitHub Actions · CI/CD · Linux · GNS3 · VPN · Monitoring · Bash · Virtualisation',
    icon: 'gear',
  },
  {
    title: 'Reseaux',
    skills: 'GNS3 · Cisco IOS · Wireshark · Nmap · VPN · PKI · Zero Trust · IDS/IPS · VLAN · Routage · Switching · Protocoles TCP/IP',
    icon: 'network',
  },
];

const softSkills = [
  {
    title: 'Leadership & management',
    description: "Fondateur d'association, coordination d'equipes",
    icon: 'crown',
  },
  {
    title: 'Communication technique',
    description: 'Vulgarisation, presentations, pedagogie',
    icon: 'chat',
  },
  {
    title: 'Travail en equipe agile',
    description: 'Collaboration cross-fonctionnelle, sprints',
    icon: 'team',
  },
  {
    title: 'Autonomie operationnelle',
    description: '20+ projets livres de facon independante',
    icon: 'rocket',
  },
  {
    title: 'Rigueur scientifique',
    description: 'Heritage CPGE MP, methode analytique',
    icon: 'atom',
  },
];

function HardSkillIcon({ type }: { type: string }) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      stroke={GOLD}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === 'brain' && (
        <>
          <path d="M28 20c-6 0-11 5-11 11 0 4 2 8 5 10-2 2-3 4-3 7 0 6 5 11 11 11h20c6 0 11-5 11-11 0-3-1-5-3-7 3-2 5-6 5-10 0-6-5-11-11-11-3 0-6 1-8 3-2-2-5-3-8-3-3 0-6 1-8 3-2-2-5-3-8-3Z" />
          <path d="M40 23v34M31 30h9M40 38h10M28 46h12M40 50h11" />
        </>
      )}
      {type === 'gear' && (
        <>
          <circle cx="40" cy="40" r="10" />
          <path d="M40 16v8M40 56v8M16 40h8M56 40h8M23 23l6 6M51 51l6 6M57 23l-6 6M29 51l-6 6" />
          <circle cx="40" cy="40" r="22" />
        </>
      )}
      {type === 'network' && (
        <>
          <circle cx="16" cy="40" r="6" />
          <circle cx="40" cy="18" r="6" />
          <circle cx="64" cy="40" r="6" />
          <circle cx="40" cy="62" r="6" />
          <path d="M22 36 34 22M46 22 58 36M58 44 46 58M34 58 22 44M22 40h36M40 24v32" />
        </>
      )}
    </svg>
  );
}

function SoftSkillIcon({ type }: { type: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke={GOLD}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === 'crown' && <path d="M6 30h28l-2-14-8 7-4-10-4 10-8-7-2 14Z" />}
      {type === 'chat' && (
        <>
          <path d="M8 10h24a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H18l-8 6v-6H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" />
          <path d="M13 19h14M13 24h9" />
        </>
      )}
      {type === 'team' && (
        <>
          <circle cx="13" cy="15" r="4" />
          <circle cx="27" cy="15" r="4" />
          <path d="M6 31c1-5 5-8 10-8s9 3 10 8M20 16h1" />
        </>
      )}
      {type === 'rocket' && (
        <>
          <path d="M24 8c6 3 8 9 8 15l-8 3-8-8 3-8c6 0 11 2 15 8Z" />
          <path d="M16 18 9 25M13 27l-4 4M26 26l4 4M20 21l-6 6" />
        </>
      )}
      {type === 'atom' && (
        <>
          <circle cx="20" cy="20" r="2.5" />
          <ellipse cx="20" cy="20" rx="12" ry="5" />
          <ellipse cx="20" cy="20" rx="12" ry="5" transform="rotate(60 20 20)" />
          <ellipse cx="20" cy="20" rx="12" ry="5" transform="rotate(-60 20 20)" />
        </>
      )}
    </svg>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from('.hard-skill-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
        },
      });

      gsap.fromTo(
        '.soft-skill-card',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#soft-skills',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="competences"
      style={{
        backgroundColor: 'transparent',
        padding: 'var(--section-pad-y) var(--section-pad-x)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 'var(--container-max)' }}>
        {/* Header */}
        <div className="text-center mb-12">
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
            COMPETENCES
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 700,
              color: '#F0E6FF',
              lineHeight: 1.1,
            }}
          >
            Hard Skills
          </h2>
        </div>

        {/* Hard Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {hardSkills.map((domain) => (
            <article
              key={domain.title}
              className="hard-skill-card rounded-2xl p-6 md:p-7 text-center"
              style={{
                backgroundColor: 'rgba(13, 11, 30, 0.72)',
                border: '1px solid rgba(201, 162, 39, 0.3)',
              }}
            >
              <div className="flex justify-center mb-5">
                <HardSkillIcon type={domain.icon} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#F0E6FF',
                    marginBottom: '10px',
                  }}
                >
                  {domain.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: '#8A7A9A',
                    lineHeight: 1.7,
                  }}
                >
                  {domain.skills}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div id="soft-skills" className="mt-12 scroll-mt-24">
          <div
            className="text-center"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#FFD700',
              letterSpacing: '0.2em',
              marginBottom: '12px',
            }}
          >
            SOFT SKILLS
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            {softSkills.map((skill) => (
              <article
                key={skill.title}
                className="soft-skill-card w-[220px] rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300"
                style={{
                  backgroundColor: '#0D0B1E',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '1px solid #C9A227';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(201,162,39,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(201, 162, 39, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="mb-3">
                  <SoftSkillIcon type={skill.icon} />
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#F0E6FF',
                    marginBottom: '8px',
                  }}
                >
                  {skill.title}
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: '#D0CFDF',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                  title={skill.description}
                >
                  {skill.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
