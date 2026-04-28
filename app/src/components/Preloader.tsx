import { useEffect, useState } from 'react';

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Fast initial mount
    const t1 = setTimeout(() => setStage(1), 100);
    // Stage 2: Fade out logo
    const t2 = setTimeout(() => setStage(2), 1200);
    // Stage 3: Remove from DOM or notify parent
    const t3 = setTimeout(() => {
      setStage(3);
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (stage === 3) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070d] pointer-events-none transition-opacity duration-700 ease-in-out"
      style={{ opacity: stage >= 2 ? 0 : 1 }}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ 
          background: 'radial-gradient(circle at center, rgba(200,150,42,0.15) 0%, rgba(5,7,12,1) 50%)',
          opacity: stage >= 1 ? 1 : 0
        }} 
      />
      
      <div 
        className="relative z-10 flex flex-col items-center transition-all duration-1000 ease-out"
        style={{
          transform: stage >= 1 ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          opacity: stage >= 1 ? 1 : 0
        }}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 relative"
          style={{ 
            background: 'linear-gradient(135deg, var(--gold), #ffdf85)',
            boxShadow: '0 0 30px rgba(200,150,42,0.4), inset 0 0 10px rgba(0,0,0,0.2)'
          }}
        >
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>
          <span 
            className="font-serif text-2xl text-[#05070d] font-bold tracking-tighter" 
            style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.4)' }}
          >
            MG
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-1 h-1 rounded-full bg-[var(--gold)] animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 rounded-full bg-[var(--gold)] animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 rounded-full bg-[var(--gold)] animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <span 
          className="mt-4 text-[10px] uppercase tracking-[4px] text-[#C8962A]/70 font-semibold"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Loading
        </span>
      </div>
    </div>
  );
}
