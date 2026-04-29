import Navigation from '@/sections/Navigation';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import SkillsSection from '@/sections/SkillsSection';
import TimelineSection from '@/sections/TimelineSection';
import ProjectsSection from '@/sections/ProjectsSection';
import HackathonsSection from '@/sections/HackathonsSection';
import CertsSection from '@/sections/CertsSection';
import ContactSection from '@/sections/ContactSection';
import Preloader from '@/components/Preloader';

const IconMail = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconLinkedin = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <Preloader />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <TimelineSection />
          <ProjectsSection />
          <HackathonsSection />
          <CertsSection />
          <ContactSection />
        </main>

        <div
          style={{
            position: 'fixed',
            right: '22px',
            bottom: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 60,
          }}
        >
          <a
            href="mailto:guissimohammed04@gmail.com"
            aria-label="Email"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '999px',
              border: '1px solid rgba(200,150,42,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C8962A',
              background: 'rgba(5, 7, 13, 0.35)',
              backdropFilter: 'blur(10px)',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C8962A';
              e.currentTarget.style.color = '#05070d';
              e.currentTarget.style.boxShadow = '0 0 18px rgba(200,150,42,0.45)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(5, 7, 13, 0.35)';
              e.currentTarget.style.color = '#C8962A';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <IconMail />
          </a>
          <a
            href="https://www.linkedin.com/in/mohammed-guissi-05a503319/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '999px',
              border: '1px solid rgba(200,150,42,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C8962A',
              background: 'rgba(5, 7, 13, 0.35)',
              backdropFilter: 'blur(10px)',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C8962A';
              e.currentTarget.style.color = '#05070d';
              e.currentTarget.style.boxShadow = '0 0 18px rgba(200,150,42,0.45)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(5, 7, 13, 0.35)';
              e.currentTarget.style.color = '#C8962A';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <IconLinkedin />
          </a>
        </div>

        <footer
          style={{
            borderTop: '1px solid rgba(139, 92, 246, 0.1)',
            padding: '40px 0',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '14px' }}>
            <a
              href="mailto:guissimohammed04@gmail.com"
              aria-label="Email"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '999px',
                border: '1px solid rgba(200,150,42,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C8962A',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C8962A';
                e.currentTarget.style.color = '#05070d';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(200,150,42,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#C8962A';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <IconMail />
            </a>
            <a
              href="https://www.linkedin.com/in/mohammed-guissi-05a503319/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '999px',
                border: '1px solid rgba(200,150,42,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C8962A',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C8962A';
                e.currentTarget.style.color = '#05070d';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(200,150,42,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#C8962A';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <IconLinkedin />
            </a>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
          >
            © 2026 Mohammed Guissi — Tous droits reserves
          </p>
        </footer>
      </div>
    </div>
  );
}
