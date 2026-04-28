import { useRef, useCallback } from 'react';

/**
 * Tilt3D — Wrapper component that adds interactive 3D tilt on mouse move.
 * Each card tilts based on local mouse position over it.
 */

interface Tilt3DProps {
  children: React.ReactNode;
  intensity?: number; // max tilt degrees (default 8)
  scale?: number;     // hover scale (default 1.02)
  className?: string;
  style?: React.CSSProperties;
}

export default function Tilt3D({
  children,
  intensity = 8,
  scale = 1.02,
  className = '',
  style = {},
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = ref.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current!.style.transform =
        `perspective(800px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(${scale}, ${scale}, 1)`;
    });
  }, [intensity, scale]);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (ref.current) {
      ref.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      ref.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      setTimeout(() => {
        if (ref.current) ref.current.style.transition = 'transform 0.08s ease-out';
      }, 500);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      ref.current.style.transition = 'transform 0.08s ease-out';
    }
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
