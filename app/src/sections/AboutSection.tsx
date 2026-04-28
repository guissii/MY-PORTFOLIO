import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* --- Icons for Tags --- */
const DeepLearningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const NLPIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const VisionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MLOpsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 8v8" />
    <path d="M16 8v8" />
    <path d="M16 16c2 2 5 2 7 0V8c-2-2-5-2-7 0L8 16c-2 2-5 2-7 0V8c2-2 5-2 7 0l8 8z" />
  </svg>
);

const CyberIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const DevOpsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);


/* --- Canvas Component --- */
function Interactive3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId = 0, time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const GRID = 20; // Reduced density for a less compact, breathable look
    const project = (x3: number, y3: number, z3: number, w: number, h: number) => { 
      const s = 650 / (650 + z3); // Wider viewing angle
      return { x: w / 2 + x3 * s, y: h / 2 + y3 * s + 60, s }; 
    };

    const render = () => {
      time += 0.012; // Faster animation
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      ctx.clearRect(0, 0, w, h);
      
      const rotX = (my - 0.5) * 0.5, rotY = (mx - 0.5) * 0.8;
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX), cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      
      const pts: { sx: number; sy: number; z: number }[][] = [];
      
      for (let i = 0; i <= GRID; i++) {
        pts[i] = [];
        for (let j = 0; j <= GRID; j++) {
          const px = (i / GRID - 0.5) * 800, pz = (j / GRID - 0.5) * 800; // MUCH LARGER SPACE
          const dist = Math.sqrt(px * px + pz * pz);
          const py = Math.sin(dist * 0.018 - time * 2.5) * 80 + Math.sin(px * 0.012 + time * 1.5) * 40; // BIG WAVES
          
          let x1 = px, y1 = py, z1 = pz;
          const rx = x1 * cosY - z1 * sinY; const rz = x1 * sinY + z1 * cosY; x1 = rx; z1 = rz;
          const ry = y1 * cosX - z1 * sinX; const rz2 = y1 * sinX + z1 * cosX; y1 = ry; z1 = rz2 + 250;
          
          const p = project(x1, y1, z1, w, h); 
          pts[i][j] = { sx: p.x, sy: p.y, z: z1 };
        }
      }
      
      ctx.lineWidth = 0.8;
      for (let i = 0; i <= GRID; i++) for (let j = 0; j < GRID; j++) {
        const a = pts[i][j], b = pts[i][j + 1]; const d = 1 - ((a.z + b.z) / 2 - 50) / 600;
        if (d > 0) {
          ctx.strokeStyle = `rgba(200,150,42,${Math.max(0.04, Math.min(0.5, d))})`; 
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      }
      for (let j = 0; j <= GRID; j++) for (let i = 0; i < GRID; i++) {
        const a = pts[i][j], b = pts[i + 1][j]; const d = 1 - ((a.z + b.z) / 2 - 50) / 600;
        if (d > 0) {
          ctx.strokeStyle = `rgba(200,150,42,${Math.max(0.04, Math.min(0.5, d))})`; 
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      }
      for (let i = 0; i <= GRID; i += 2) for (let j = 0; j <= GRID; j += 2) {
        const p = pts[i][j]; const d = 1 - (p.z - 50) / 600;
        if (d > 0) {
          ctx.fillStyle = `rgba(255,223,133,${Math.max(0.2, Math.min(0.9, d))})`; 
          ctx.beginPath(); ctx.arc(p.sx, p.sy, Math.max(1.5, 4.5 * d), 0, Math.PI * 2); ctx.fill();
        }
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    const obs = new ResizeObserver(resize); 
    if (canvas.parentElement) obs.observe(canvas.parentElement);
    return () => { cancelAnimationFrame(animId); obs.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} onMouseMove={handleMouseMove} className="cursor-crosshair absolute inset-0 w-full h-full" />;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from('.about-anim', { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative w-full overflow-hidden" style={{ minHeight: '100vh', padding: 'var(--section-pad-y) 0', backgroundColor: '#05070d' }}>
      
      {/* Background Image Setup using the user's custom 'about-bg.png' */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'url(/about-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1 // Full visibility for the gold effects
        }} 
      />
      
      {/* Very gentle gradient just to ensure the white text is perfectly readable, but letting the gold shine */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(8,11,20,0.85) 0%, rgba(8,11,20,0.4) 45%, transparent 100%)',
        }}
      />

      <div className="mx-auto relative z-10" style={{ maxWidth: 'var(--container-max)', padding: '0 var(--section-pad-x)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT PART - TEXT */}
          <div>
            <div className="about-anim flex items-center gap-4 mb-4">
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>À Propos</span>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.5 }} />
            </div>
            
            <h2 className="about-anim" style={{ 
              fontFamily: 'var(--font-title)', 
              fontSize: 'clamp(36px, 5vw, 56px)', 
              fontWeight: 600, 
              color: '#f1f5f9', 
              lineHeight: 1.15, 
              marginBottom: '24px', 
              letterSpacing: '-0.5px' 
            }}>
              De l'Algèbre<br/>
              aux Réseaux<br/>
              <span style={{ color: '#C8962A', fontStyle: 'italic', fontFamily: 'Georgia, serif', letterSpacing: '0px' }}>
                de Neurones
              </span>
            </h2>

            <p className="about-anim" style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '15px', 
              lineHeight: 1.8, 
              color: '#94a3b8', 
              marginBottom: '36px' 
            }}>
              Élève ingénieur en Génie des Systèmes Communicants & Sécurité Numérique et freelance, je combine{' '}
              <strong style={{ color: '#C8962A', fontWeight: 600 }}>IA appliquée, NLP, DevOps</strong> et cybersécurité pour concevoir des solutions fiables de bout en bout : conception, expérimentation, déploiement et optimisation continue.
            </p>

            <div className="about-anim flex flex-wrap gap-x-4 gap-y-4">
              {[
                { title: 'DEEP LEARNING', icon: <DeepLearningIcon /> },
                { title: 'NLP', icon: <NLPIcon /> },
                { title: 'COMPUTER VISION', icon: <VisionIcon /> },
                { title: 'MLOPS', icon: <MLOpsIcon /> },
                { title: 'CYBERSÉCURITÉ', icon: <CyberIcon /> },
                { title: 'DEVOPS', icon: <DevOpsIcon /> },
              ].map((tag) => (
                <div key={tag.title} className="flex items-center gap-2" style={{
                  border: '1px solid rgba(200,150,42,0.3)',
                  backgroundColor: 'rgba(200,150,42,0.03)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: 'var(--gold)',
                }}>
                  {tag.icon}
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', marginTop: '1px' }}>
                    {tag.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PART - CANVAS */}
          <div className="about-anim relative" style={{
             border: '1px solid rgba(200,150,42,0.2)',
             borderRadius: '16px',
             background: 'linear-gradient(180deg, rgba(8,11,20,0.6) 0%, rgba(200,150,42,0.05) 100%)',
             overflow: 'hidden'
          }}>
            {/* The Huge 3D view area */}
            <div className="relative w-full" style={{ height: '550px' }}>
              <Interactive3DCanvas />
              
              {/* Interaction Top Right Box */}
              <div className="absolute top-6 right-6 p-4 hidden md:block" style={{
                background: 'rgba(5, 7, 13, 0.4)',
                border: '1px solid rgba(200, 150, 42, 0.2)',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
                pointerEvents: 'none'
              }}>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#C8962A', fontWeight: 600, letterSpacing: '1px' }}>INTERACTION</span>
                  <div style={{ background: '#C8962A', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#05070d' }}>ON</span>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}/>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M5 9v6a7 7 0 0 0 14 0V9a7 7 0 0 0-14 0z"/><path d="M12 5v4"/></svg>
                     <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Bougez votre souris</span>
                  </li>
                  <li className="flex items-center gap-2">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                     <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Pointez un point</span>
                  </li>
                  <li className="flex items-center gap-2">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                     <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Découvrez la data</span>
                  </li>
                </ul>
              </div>

              {/* Subtle top/bottom fade to blend with borders */}
              <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{
                height: '100px',
                background: 'linear-gradient(0deg, rgba(8,11,20,0.8) 0%, transparent 100%)'
              }} />
              <div className="absolute inset-x-0 top-0 pointer-events-none" style={{
                height: '100px',
                background: 'linear-gradient(180deg, rgba(8,11,20,0.8) 0%, transparent 100%)'
              }} />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
