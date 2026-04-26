import Navigation from '@/sections/Navigation';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import SkillsSection from '@/sections/SkillsSection';
import TimelineSection from '@/sections/TimelineSection';
import ProjectsSection from '@/sections/ProjectsSection';
import HackathonsSection from '@/sections/HackathonsSection';
import CertsSection from '@/sections/CertsSection';
import ContactSection from '@/sections/ContactSection';
import FloatingButtons from '@/components/FloatingButtons';
import NeuralNetworkCanvas from '@/components/NeuralNetworkCanvas';

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#08091A' }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkCanvas />
      </div>
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
        <FloatingButtons />
      </div>
    </div>
  );
}
