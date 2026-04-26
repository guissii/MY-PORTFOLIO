import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const techTags = [
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'MLOps',
  'Cybersécurité',
  'DevOps',
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // AI Visualization Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const LINE_COUNT = isMobile ? 200 : 400;
    let animId = 0;
    let time = 0;
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resize();

    const lines: {
      baseX: number;
      amplitude: number;
      frequency: number;
      phase: number;
      speed: number;
      opacity: number;
      yOffset: number;
    }[] = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      lines.push({
        baseX: Math.random(),
        amplitude: Math.random() * 40 + 10,
        frequency: Math.random() * 2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        yOffset: Math.random(),
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      time += 0.008;
      const w = canvas.width / Math.min(window.devicePixelRatio, 2);
      const h = canvas.height / Math.min(window.devicePixelRatio, 2);

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2A0A2E');
      grad.addColorStop(1, '#3D1A45');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const rotation = time * 0.3;
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      for (const line of lines) {
        ctx.strokeStyle = `rgba(255, 215, 0, ${line.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();

        for (let t = 0; t < 1; t += 0.01) {
          const xBase = line.baseX * w;
          const yBase = t * h;

          // 3D sine wave
          const waveZ = Math.sin(t * line.frequency * Math.PI * 2 + line.phase + time * line.speed);
          const waveY = Math.cos(t * line.frequency * Math.PI + line.phase) * line.amplitude;

          // 3D projection
          const x3d = xBase + waveY * cosR - waveZ * 30 * sinR;
          const y3d = yBase + waveY * sinR + waveZ * 30 * cosR + line.yOffset * 20;

          // Mouse repel
          const dx = x3d - mouse.x;
          const dy = y3d - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let finalX = x3d;
          let finalY = y3d;
          if (dist < 100 && dist > 0) {
            const force = (1 - dist / 100) * 30;
            finalX += (dx / dist) * force;
            finalY += (dy / dist) * force;
          }

          if (t === 0) {
            ctx.moveTo(finalX, finalY);
          } else {
            ctx.lineTo(finalX, finalY);
          }
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };
    window.addEventListener('resize', debouncedResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const animateElements = rightRef.current?.querySelectorAll('.animate-in');
      if (!animateElements || animateElements.length === 0) return;
      gsap.from(animateElements, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      gsap.from('.tech-tag', {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.4)',
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
      id="about"
      style={{
        backgroundColor: 'transparent',
        padding: 'var(--section-pad-y) var(--section-pad-x)',
      }}
    >
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-16 items-center"
        style={{ maxWidth: 'var(--container-max)' }}
      >
        {/* Left — Canvas */}
        <div ref={leftRef} className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              pointerEvents: 'auto',
            }}
            role="img"
            aria-label="Visualisation abstraite de flux de donnees IA"
          />
        </div>

        {/* Right — Content */}
        <div ref={rightRef}>
          <div
            className="animate-in"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#FFD700',
              letterSpacing: '0.2em',
              marginBottom: '16px',
            }}
          >
            A PROPOS
          </div>

          <h2
            className="animate-in"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, 56px)',
              fontWeight: 700,
              color: '#F0E6FF',
              lineHeight: 1.1,
              marginBottom: '18px',
            }}
          >
            De l'Algebre aux Reseaux de Neurones
          </h2>

          <p
            className="animate-in"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: '#C8B8D8',
              lineHeight: 1.75,
              marginBottom: '20px',
            }}
          >
            Eleve ingenieur en Genie des Systemes Communicants & Securite Numerique et freelance,
            je combine IA appliquee, NLP, DevOps et cybersécurite pour concevoir des solutions
            fiables de bout en bout : conception, experimentation, deploiement et optimisation
            continue. Mon objectif est de livrer des produits techniques performants, mesurables
            et utiles en contexte reel.
          </p>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {techTags.map((tag) => (
              <span
                key={tag}
                className="tech-tag"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: '#FFD700',
                  backgroundColor: '#5A2D66',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '20px',
                  padding: '8px 18px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Download CV */}
          <a
            href="/CV_Mohammed_GUISSI_ENSIM_v2.pdf"
            download
            className="animate-in inline-block px-8 py-4 rounded-lg font-mono text-sm tracking-wider transition-all duration-300 hover:scale-[1.03]"
            style={{
              backgroundColor: '#FFD700',
              color: '#2A0A2E',
              fontWeight: 500,
              letterSpacing: '0.1em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B8860B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFD700';
            }}
          >
            TELECHARGER MON CV ↓
          </a>
        </div>
      </div>
    </section>
  );
}
