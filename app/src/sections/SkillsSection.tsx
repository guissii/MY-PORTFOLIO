import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt3D from '@/components/Tilt3D';

gsap.registerPlugin(ScrollTrigger);

/* --- Icons --- */
const BrainIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2a4 4 0 0 1 4-4z" />
    <path d="M8 8v2a4 4 0 0 0 8 0V8" />
    <path d="M6 14a6 6 0 0 0 12 0" />
    <path d="M12 14v8" />
    <circle cx="8" cy="10" r="1" fill="#C8962A" />
    <circle cx="16" cy="10" r="1" fill="#C8962A" />
  </svg>
);

const CloudIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    <path d="M12 14v4M9 16l3-3 3 3" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const categories = [
  { 
    label: 'IA / ML', 
    icon: <BrainIcon />,
    skills: ['Python · PyTorch · TensorFlow', 'CamemBERT · NLP · LangChain', 'LLM · Prompt Engineering · Agents IA', 'Scikit-learn · Computer Vision', 'Streamlit · MLflow · ONNX'] 
  },
  { 
    label: 'DEVOPS / CLOUD', 
    icon: <CloudIcon />,
    skills: ['Docker · Kubernetes · Helm', 'GitHub Actions · CI/CD · ArgoCD', 'AWS · GCP · Azure', 'Linux · Bash · Virtualisation', 'FastAPI · React · TypeScript'] 
  },
  { 
    label: 'RESEAUX / CYBER', 
    icon: <ShieldIcon />,
    skills: ['GNS3 · Cisco IOS · Wireshark', 'Nmap · VPN · PKI · Zero Trust', 'IDS/IPS · SIEM · Monitoring', 'VLAN · Routage · TCP/IP', 'SOC · Pentest · Hardening'] 
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP removed for mobile reliability
  }, []);

  return (
    <section
      ref={sectionRef}
      id="competences"
      className="relative w-full overflow-x-hidden"
      style={{ padding: 'calc(var(--section-pad-y) * 0.8) 0', background: '#05070d' }}
    >
      
      {/* Background Image Setup (Uses exact image from Hero-bg) */}
      <div className="absolute inset-0 skills-bg" />
      
      {/* Very light mask ONLY on the far left edge just to keep text readable, COMPLETELY transparent on right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(5,7,12,0.95) 0%, rgba(5,7,12,0.6) 40%, transparent 60%)',
        }}
      />

      <div className="mx-auto relative z-10 w-full" style={{ maxWidth: 'var(--container-max)', padding: '0 var(--section-pad-x)' }}>
        <div ref={contentRef} className="w-full lg:w-[50%] xl:w-[45%]">
          
          {/* Header */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-4">
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Compétences</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.5 }} />
            </div>
            <h2 style={{ 
              fontFamily: 'var(--font-title)', 
              fontSize: 'clamp(42px, 6vw, 48px)', 
              color: '#f1f5f9', 
              fontWeight: 400,
              marginBottom: '10px'
            }}>
              Expertise Technique
            </h2>
          </div>

          {/* Hard Skills Cards - Stacked vertically on the left side to NOT hide the face */}
          <div className="grid grid-cols-1 gap-6 relative z-20">
            {categories.map((cat) => (
              <div key={cat.label} className="animate-in fade-in slide-in-from-bottom-6 duration-700 mt-2">
                <Tilt3D intensity={5} scale={1.02}>
                  <div className="card-dark flex flex-col" style={{ 
                    padding: '30px 28px', 
                    background: 'rgba(5, 7, 13, 0.75)',
                    border: '1px solid rgba(200,150,42,0.25)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                    height: '100%',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.4)'
                  }}>
                    {/* Header of the card */}
                    <div className="flex items-center gap-3 mb-6">
                      {cat.icon}
                      <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '14px', fontWeight: 600, color: '#C8962A', letterSpacing: '1px' }}>
                        {cat.label}
                      </h3>
                    </div>
                    
                    {/* List of skills */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2">
                       {/* Distribute skills in 2 small columns inside the card to save vertical height space */}
                      {cat.skills.map((skill) => (
                         <li key={skill} style={{ 
                           fontFamily: 'var(--font-body)', fontSize: '12px', color: '#cbd5e1', 
                           display: 'flex', alignItems: 'center', gap: '10px'
                         }}>
                           <span style={{ 
                             width: '4px', height: '4px', borderRadius: '50%', 
                             backgroundColor: '#C8962A', flexShrink: 0,
                             boxShadow: '0 0 6px #C8962A'
                           }} />
                           <span style={{ opacity: 0.9, fontWeight: 300, lineHeight: 1.4 }}>
                             {skill}
                           </span>
                         </li>
                      ))}
                    </ul>
                  </div>
                </Tilt3D>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
