import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const IconMail = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconLinkedin = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const IconGithub = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 20 5a4.9 4.9 0 0 0-.1-3.7S18.7.9 16 2.7a13.4 13.4 0 0 0-7 0C6.3.9 5.1 1.3 5.1 1.3A4.9 4.9 0 0 0 5 5a5.3 5.3 0 0 0-1.3 3.7c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 0 0-.9 2.6V22"/></svg>;
const IconMap = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconGlobe = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;
const IconStar = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const languages = [
  { name: 'Français', level: 'C1' },
  { name: 'Anglais', level: 'B2' },
  { name: 'Arabe', level: 'NATIF' },
];

const interests = ['Veille tech', 'Hackathons', 'Open source', 'IA & DevOps', 'Sport'];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from('.ct-anim', { y: 35, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 65%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:guissimohammed04@gmail.com?subject=Portfolio&body=${encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
  };

  return (
    <section ref={sectionRef} id="contact" className="relative w-full overflow-hidden" style={{ padding: 'calc(var(--section-pad-y) * 0.8) 0', backgroundColor: '#05070d' }}>
      
      {/* Background Image Setup */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'url(/projects-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1
        }} 
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(5,7,12,0.1) 0%, rgba(5,7,12,0.4) 70%, rgba(5,7,12,0.8) 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-[150px] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(5,7,12,1) 0%, transparent 100%)' }} />

      <div className="mx-auto relative z-10" style={{ maxWidth: '1100px', padding: '0 var(--section-pad-x)' }}>
        
        <div className="text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.5 }} />
            <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Discutons-en</span>
            <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.5 }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(48px, 6vw, 64px)', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.1, letterSpacing: '-1.5px' }}>Contact</h2>
        </div>
        
        <div className="text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ marginBottom: '64px' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#C8962A', fontWeight: 500, marginBottom: '12px' }}>Travaillons ensemble</span>
          <div style={{ width: '40px', height: '1px', backgroundColor: '#C8962A', opacity: 0.6 }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
            <form onSubmit={handleSubmit} className="group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ 
                padding: '40px 36px', 
                background: 'rgba(10, 12, 18, 0.65)',
                borderRadius: '12px',
                border: '1px solid rgba(200,150,42,0.15)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(200,150,42,0.6)';
                e.currentTarget.style.boxShadow = 'inset 0 40px 60px -40px rgba(200,150,42,0.25), 0 10px 40px -10px rgba(200,150,42,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(200,150,42,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {['name', 'email'].map((f) => (
                <div key={f} style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '10px', color: '#e2e8f0', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Votre {f === 'name' ? 'nom' : 'email'}
                  </label>
                  <input type={f === 'email' ? 'email' : 'text'} placeholder={f === 'name' ? 'Votre nom' : 'Votre email'}
                    value={form[f as keyof typeof form]} onChange={(e) => setForm((d) => ({ ...d, [f]: e.target.value }))}
                    style={{ 
                      width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(200,150,42,0.3)', 
                      padding: '8px 0', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94a3b8', outline: 'none', transition: 'all 0.3s' 
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#C8962A'; e.currentTarget.style.color = '#f1f5f9'; }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(200,150,42,0.3)'; e.currentTarget.style.color = '#94a3b8'; }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '10px', color: '#e2e8f0', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Votre message
                </label>
                <textarea placeholder="Votre message" rows={3} value={form.message}
                  onChange={(e) => setForm((d) => ({ ...d, message: e.target.value }))}
                  style={{ 
                    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(200,150,42,0.3)', 
                    padding: '8px 0', fontFamily: 'var(--font-body)', fontSize: '14px', color: '#94a3b8', outline: 'none', resize: 'none', transition: 'all 0.3s' 
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#C8962A'; e.currentTarget.style.color = '#f1f5f9'; }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'rgba(200,150,42,0.3)'; e.currentTarget.style.color = '#94a3b8'; }}
                />
              </div>
              <button type="submit" style={{
                  background: '#C8962A', border: 'none', color: '#05070d', borderRadius: '6px',
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '2px', padding: '14px 28px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 15px rgba(200,150,42,0.5)'; e.currentTarget.style.background = '#e3af3d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = '#C8962A'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                ENVOYER <span>→</span>
              </button>
            </form>

          {/* RIGHT: INFOS */}
          <div className="flex flex-col justify-center space-y-8 pl-4 lg:pl-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {[
              { label: 'Email', text: 'guissimohammed04@gmail.com', href: 'mailto:guissimohammed04@gmail.com', Icon: IconMail },
              { label: 'Telephone', text: '+212 649 878 763', href: 'tel:+212649878763', Icon: IconPhone },
              { label: 'LinkedIn', text: 'linkedin.com/in/mohammed-guissi', href: 'https://www.linkedin.com/in/mohammed-guissi-05a503319/', Icon: IconLinkedin },
              { label: 'GitHub', text: 'github.com/guissii', href: 'https://github.com/guissii', Icon: IconGithub },
              { label: 'Localisation', text: 'Fes, Maroc', href: '', Icon: IconMap },
            ].map((info) => (
              <div key={info.label} className="flex items-center gap-6 group cursor-pointer">
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(200,150,42,0.5)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8962A', transition: 'all 0.3s' 
                }}
                className="group-hover:bg-[#C8962A] group-hover:text-[#05070d] group-hover:shadow-[0_0_15px_rgba(200,150,42,0.5)]">
                  <info.Icon />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#C8962A', marginBottom: '8px', fontWeight: 600 }}>{info.label}</div>
                  {info.href ? (
                    <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#f1f5f9', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#C8962A')} onMouseLeave={(e) => (e.currentTarget.style.color = '#f1f5f9')}
                    >{info.text}</a>
                  ) : <span style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#f1f5f9' }}>{info.text}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
            <div className="group relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ 
                padding: '36px', 
                background: 'rgba(10, 12, 18, 0.65)',
                borderRadius: '12px',
                border: '1px solid rgba(200,150,42,0.15)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(200,150,42,0.6)';
                e.currentTarget.style.boxShadow = 'inset 0 40px 60px -40px rgba(200,150,42,0.25), 0 10px 40px -10px rgba(200,150,42,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(200,150,42,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
                <span style={{ color: '#C8962A' }}><IconGlobe /></span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: '#C8962A', fontWeight: 600 }}>Langues</span>
              </div>
              <div className="flex flex-col">
                {languages.map((l, idx) => (
                  <div key={l.name} className="flex items-center justify-between py-4" style={{ borderBottom: idx === languages.length - 1 ? 'none' : '1px solid rgba(200,150,42,0.1)' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#e2e8f0' }}>{l.name}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#C8962A', border: '1px solid rgba(200,150,42,0.3)', padding: '4px 10px', borderRadius: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>{l.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ 
                padding: '36px', 
                background: 'rgba(10, 12, 18, 0.65)',
                borderRadius: '12px',
                border: '1px solid rgba(200,150,42,0.15)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(200,150,42,0.6)';
                e.currentTarget.style.boxShadow = 'inset 0 40px 60px -40px rgba(200,150,42,0.25), 0 10px 40px -10px rgba(200,150,42,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(200,150,42,0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-3" style={{ marginBottom: '28px' }}>
                <span style={{ color: '#C8962A' }}><IconStar /></span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: '#C8962A', fontWeight: 600 }}>Interets</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {interests.map((i) => (
                  <span key={i} style={{ 
                    fontFamily: 'var(--font-body)', fontSize: '11px', color: '#C8962A', border: '1px solid rgba(200,150,42,0.3)', 
                    padding: '6px 14px', borderRadius: '4px', letterSpacing: '0.5px', transition: 'all 0.3s' 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C8962A'; e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(200,150,42,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,150,42,0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >{i}</span>
                ))}
              </div>
            </div>
          
        </div>
      </div>
    </section>
  );
}
