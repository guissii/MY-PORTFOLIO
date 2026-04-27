import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hackathons as defaultHackathons, type HackathonItem } from '@/data/hackathons';

gsap.registerPlugin(ScrollTrigger);

export default function HackathonsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<HackathonItem[]>(defaultHackathons);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => String(b.period).localeCompare(String(a.period)));
    return copy;
  }, [items]);

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
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 0);
    return () => window.clearTimeout(t);
  }, [items.length, Object.keys(imageMap).length]);

  useEffect(() => {
    const loadHackathons = async () => {
      try {
        const res = await fetch('/api/public/hackathons');
        const data = await res.json();
        if (res.ok && Array.isArray(data?.hackathons) && data.hackathons.length > 0) {
          setItems(data.hackathons);
        }
      } catch {
        // keep fallback silently
      }
    };
    loadHackathons();
  }, []);

  useEffect(() => {
    const loadHackathonImages = async () => {
      try {
        const res = await fetch('/api/public/hackathon-images');
        const data = await res.json();
        if (res.ok && data?.images) {
          setImageMap(data.images);
        }
      } catch {
        // keep empty map silently
      }
    };
    loadHackathonImages();
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
          {sorted.map((item) => (
            <article
              key={item.slug}
              className="hackathon-card rounded-2xl p-6 transition-all duration-300"
              style={{
                backgroundColor: '#0D0B1E',
                border: '1px solid rgba(201, 162, 39, 0.25)',
              }}
            >
              <div className="mb-4 overflow-hidden rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.12)', backgroundColor: '#17142A' }}>
                {imageMap[item.slug] ? (
                  <img src={imageMap[item.slug]} alt={item.name} className="w-full h-[140px] object-cover" loading="lazy" />
                ) : (
                  <div
                    className="w-full h-[140px]"
                    style={{ background: 'linear-gradient(135deg, rgba(141,95,255,0.35) 0%, rgba(201,162,39,0.25) 100%)' }}
                  />
                )}
              </div>
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
