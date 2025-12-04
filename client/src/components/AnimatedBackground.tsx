import { useEffect, useState, useRef, useCallback } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    mousePos.current = { x, y };
  }, []);

  const updateParallax = useCallback(() => {
    if (containerRef.current) {
      const { x, y } = mousePos.current;
      containerRef.current.style.setProperty('--mx', String(x));
      containerRef.current.style.setProperty('--my', String(y));
    }
    animationRef.current = requestAnimationFrame(updateParallax);
  }, []);

  useEffect(() => {
    setMounted(true);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window;
    
    if (!prefersReducedMotion && !isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      animationRef.current = requestAnimationFrame(updateParallax);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, updateParallax]);

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ '--mx': '0', '--my': '0' } as React.CSSProperties}
    >
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-200/40 via-purple-100/30 to-fuchsia-200/40 dark:from-violet-950/60 dark:via-purple-950/50 dark:to-fuchsia-950/60" />
      
      {/* Animated mesh gradient - follows cursor gently */}
      <div className="mesh-bg" />
      
      {/* Soft floating orbs - follow cursor with parallax */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      {/* Subtle glowing lines */}
      <div className="glow-line glow-line-1" />
      <div className="glow-line glow-line-2" />
      
      {/* Gentle floating particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${(i % 5) + 1}`} style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${20 + Math.random() * 15}s`
          }} />
        ))}
      </div>
      
      <style>{`
        .mesh-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 60% at 30% 30%, rgba(167, 139, 250, 0.25), transparent 60%),
            radial-gradient(ellipse 70% 50% at 70% 70%, rgba(192, 132, 252, 0.2), transparent 60%),
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139, 92, 246, 0.15), transparent 60%);
          animation: mesh-shift 30s ease-in-out infinite;
          transform: translate(
            calc(var(--mx, 0) * 15px),
            calc(var(--my, 0) * 15px)
          );
          transition: transform 0.3s ease-out;
        }
        
        .dark .mesh-bg {
          background: 
            radial-gradient(ellipse 80% 60% at 30% 30%, rgba(139, 92, 246, 0.35), transparent 60%),
            radial-gradient(ellipse 70% 50% at 70% 70%, rgba(167, 139, 250, 0.25), transparent 60%),
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124, 58, 237, 0.2), transparent 60%);
        }
        
        @keyframes mesh-shift {
          0%, 100% { 
            filter: hue-rotate(0deg);
          }
          50% { 
            filter: hue-rotate(15deg);
          }
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
          pointer-events: none;
          transition: transform 0.4s ease-out;
        }
        
        .orb-1 {
          width: 500px;
          height: 500px;
          top: -10%;
          left: -5%;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, transparent 70%);
          animation: float-1 25s ease-in-out infinite;
          transform: translate(
            calc(var(--mx, 0) * 25px),
            calc(var(--my, 0) * 25px)
          );
        }
        
        .orb-2 {
          width: 400px;
          height: 400px;
          bottom: -5%;
          right: -5%;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%);
          animation: float-2 30s ease-in-out infinite;
          transform: translate(
            calc(var(--mx, 0) * -20px),
            calc(var(--my, 0) * -20px)
          );
        }
        
        .orb-3 {
          width: 350px;
          height: 350px;
          top: 40%;
          left: 50%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
          animation: float-3 22s ease-in-out infinite;
          transform: translate(
            calc(-50% + var(--mx, 0) * 30px),
            calc(-50% + var(--my, 0) * 30px)
          );
        }
        
        .dark .orb-1 { 
          background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
        }
        .dark .orb-2 { 
          background: radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, transparent 70%);
        }
        .dark .orb-3 { 
          background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%);
        }
        
        @keyframes float-1 {
          0%, 100% { margin-left: 0; margin-top: 0; }
          25% { margin-left: 30px; margin-top: 20px; }
          50% { margin-left: 15px; margin-top: 40px; }
          75% { margin-left: -15px; margin-top: 20px; }
        }
        
        @keyframes float-2 {
          0%, 100% { margin-right: 0; margin-bottom: 0; }
          33% { margin-right: -25px; margin-bottom: -20px; }
          66% { margin-right: -40px; margin-bottom: -10px; }
        }
        
        @keyframes float-3 {
          0%, 100% { margin-left: 0; margin-top: 0; }
          50% { margin-left: 25px; margin-top: -30px; }
        }
        
        .glow-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.4), rgba(192, 132, 252, 0.4), transparent);
          opacity: 0.5;
          transition: transform 0.5s ease-out;
        }
        
        .dark .glow-line {
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), rgba(167, 139, 250, 0.5), transparent);
          opacity: 0.6;
        }
        
        .glow-line-1 {
          width: 35%;
          top: 35%;
          left: 15%;
          transform: rotate(-12deg) translate(
            calc(var(--mx, 0) * 10px),
            calc(var(--my, 0) * 10px)
          );
          animation: line-float-1 15s ease-in-out infinite;
        }
        
        .glow-line-2 {
          width: 25%;
          top: 65%;
          right: 20%;
          transform: rotate(15deg) translate(
            calc(var(--mx, 0) * -8px),
            calc(var(--my, 0) * -8px)
          );
          animation: line-float-2 18s ease-in-out infinite;
        }
        
        @keyframes line-float-1 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        @keyframes line-float-2 {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .particles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          opacity: 0.4;
          animation: particle-float 25s ease-in-out infinite;
        }
        
        .particle-1 { background: rgba(167, 139, 250, 0.6); width: 4px; height: 4px; }
        .particle-2 { background: rgba(192, 132, 252, 0.5); }
        .particle-3 { background: rgba(139, 92, 246, 0.6); width: 4px; height: 4px; }
        .particle-4 { background: rgba(167, 139, 250, 0.5); }
        .particle-5 { background: rgba(124, 58, 237, 0.4); width: 5px; height: 5px; }
        
        .dark .particle-1 { background: rgba(167, 139, 250, 0.5); }
        .dark .particle-2 { background: rgba(192, 132, 252, 0.4); }
        .dark .particle-3 { background: rgba(139, 92, 246, 0.5); }
        .dark .particle-4 { background: rgba(167, 139, 250, 0.4); }
        .dark .particle-5 { background: rgba(124, 58, 237, 0.5); }
        
        @keyframes particle-float {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            opacity: 0.5;
          }
          50% { 
            transform: translate(30px, -40px);
            opacity: 0.4;
          }
          75% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
