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

        <footer
          style={{
            borderTop: '1px solid rgba(139, 92, 246, 0.1)',
            padding: '40px 0',
            textAlign: 'center',
          }}
        >
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
