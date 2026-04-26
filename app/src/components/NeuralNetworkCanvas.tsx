import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulsePhase: number;
  isPulseNode: boolean;
}

export default function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 250 : 600;
    const CONNECTION_DIST = 120;
    const MAX_CONNECTIONS = isMobile ? 2 : 3;
    const PULSE_NODE_COUNT = isMobile ? 4 : 7;
    const MOUSE_RADIUS = 150;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
          isPulseNode: i < PULSE_NODE_COUNT,
        });
      }
      particlesRef.current = particles;
    };

    resize();
    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      const particles = particlesRef.current;
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2 + 0.5,
          opacity: 0.8,
          pulsePhase: 0,
          isPulseNode: false,
        });
      }
      if (particles.length > PARTICLE_COUNT + 100) {
        particlesRef.current = particles.slice(-PARTICLE_COUNT);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timeRef.current += dt;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Perlin-like movement
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Mouse attraction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 1) {
            const force = (1 - dist / MOUSE_RADIUS) * 0.3;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Fade out burst particles
        if (particles.length > PARTICLE_COUNT && i >= PARTICLE_COUNT) {
          p.opacity *= 0.985;
        }
      }

      // Remove faded particles
      if (particles.length > PARTICLE_COUNT) {
        particlesRef.current = particles.filter(
          (p, i) => i < PARTICLE_COUNT || p.opacity > 0.01
        );
      }

      // Draw connections
      const activeParticles = particlesRef.current;
      ctx.strokeStyle = '#FFD700';
      for (let i = 0; i < activeParticles.length; i++) {
        const p = activeParticles[i];
        let connections = 0;
        for (let j = i + 1; j < activeParticles.length && connections < MAX_CONNECTIONS; j++) {
          const dx = p.x - activeParticles[j].x;
          const dy = p.y - activeParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15 * Math.min(p.opacity, activeParticles[j].opacity);
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(activeParticles[j].x, activeParticles[j].y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw particles
      for (const p of activeParticles) {
        const time = timeRef.current;
        let pulseBrightness = 0;

        if (p.isPulseNode) {
          const pulse = Math.sin(time * 2 + p.pulsePhase);
          pulseBrightness = pulse > 0.7 ? (pulse - 0.7) * 2 : 0;
        }

        const alpha = p.opacity + pulseBrightness * 0.4;
        ctx.globalAlpha = Math.min(alpha, 1);

        // Glow
        if (p.isPulseNode && pulseBrightness > 0.1) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 6);
          gradient.addColorStop(0, `rgba(255, 215, 0, ${pulseBrightness * 0.3})`);
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (p.isPulseNode ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resize();
      initParticles();
    };
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 200);
    };
    window.addEventListener('resize', debouncedResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
      role="img"
      aria-label="Réseau de neurones animé — visualisation de réseau de neurones artificiel"
    />
  );
}
