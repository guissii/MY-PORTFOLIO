import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const techStack = ['AWS / GCP / Azure', 'Kubernetes / Docker', 'ML Ops / AI', 'Cybersécurité'];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    gsap.set(avatarRef.current, { opacity: 0, scale: 0.92, y: -10 });
    gsap.set(contentRef.current, { opacity: 0, y: 20 });
    gsap.set(chipsRef.current, { opacity: 0, y: 16 });

    tl.to(avatarRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
      .to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .to(
        chipsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.35'
      );

    gsap.to(avatarRef.current, {
      y: -8,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 pt-20 pb-12 md:pt-24 md:pb-16 min-h-[100dvh] flex items-center">
        <div className="w-full flex flex-col items-center text-center">
          <div ref={avatarRef} className="relative mb-6 sm:mb-7">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                transform: 'scale(1.35)',
                background: 'radial-gradient(circle, rgba(141,95,255,0.28) 0%, rgba(99,102,241,0.1) 45%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            <div
              className="relative rounded-full border border-[#8059ff] flex items-center justify-center"
              style={{
                width: 'clamp(160px, 30vw, 230px)',
                height: 'clamp(160px, 30vw, 230px)',
                boxShadow: '0 0 30px rgba(128,89,255,0.25), inset 0 0 18px rgba(128,89,255,0.2)',
                background: 'rgba(11, 14, 35, 0.66)',
                backdropFilter: 'blur(3px)',
              }}
            >
              <img
                src="/profile.jpeg"
                alt="Mohammed Guissi"
                className="w-[82%] h-[82%] rounded-full object-cover border border-[#9a7dff]/40"
              />
            </div>
            <span
              className="absolute rounded-full border-2 border-[#1f2937]"
              style={{
                width: '18px',
                height: '18px',
                right: '4%',
                bottom: '14%',
                backgroundColor: '#39ff88',
                boxShadow: '0 0 16px rgba(57,255,136,0.8)',
              }}
            />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#37dc90]/30 bg-[#0f2a28]/40 text-[#49f2a2]">
            <span className="w-2 h-2 rounded-full bg-[#49f2a2]" />
            <span className="text-sm sm:text-base font-medium">Disponible pour missions</span>
          </div>

          <div ref={contentRef} className="max-w-[850px]">
            <h1 className="font-black tracking-tight text-[#f4f3ff] text-[34px] leading-[0.95] sm:text-[50px] md:text-[66px]">
              Mohammed GICUIDSI
            </h1>
            <h2
              className="mt-1 font-black tracking-tight text-[42px] leading-[0.95] sm:text-[58px] md:text-[74px]"
              style={{
                backgroundImage: 'linear-gradient(90deg, #8d5fff 0%, #c5a9ff 50%, #ffd38f 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              AI Specialist
            </h2>

            <p className="mt-4 mx-auto max-w-[760px] text-[#d4d6ea] text-[15px] leading-[1.55] sm:text-[17px] md:text-[19px]">
              Eleve ingenieur en systemes communicants et securite numerique / Freelance IA & DevOps.
              Je construis des solutions robustes, de la data au deploiement.
            </p>
          </div>

          <div ref={chipsRef} className="mt-8 w-full max-w-[860px] flex flex-wrap items-center justify-center gap-3">
            {techStack.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-xl border border-[#6c56b3]/45 bg-[#14162d]/75 text-[#b9bfe8] text-sm sm:text-base"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
