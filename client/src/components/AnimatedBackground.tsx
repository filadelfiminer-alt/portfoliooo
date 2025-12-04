import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId: number;
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        lastX += (x - lastX) * 0.1;
        lastY += (y - lastY) * 0.1;
        setMousePos({ x: lastX, y: lastY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Very soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-purple-400/[0.04] to-fuchsia-500/[0.05] dark:from-purple-900/[0.15] dark:via-violet-900/[0.12] dark:to-fuchsia-900/[0.10]" />
      
      {/* Soft mesh - barely moves with cursor */}
      <div 
        className="mesh-bg"
        style={{
          transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`
        }}
      />
      
      {/* Soft orb 1 */}
      <div 
        className="orb orb-1"
        style={{
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`
        }}
      />
      
      {/* Soft orb 2 */}
      <div 
        className="orb orb-2"
        style={{
          transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`
        }}
      />
      
      {/* Very faint line */}
      <div 
        className="glow-line"
        style={{
          transform: `rotate(-8deg) translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`
        }}
      />
      
      {/* Few soft particles */}
      <div className="particles-container">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i * 17) % 60}%`,
              animationDelay: `${i * 8}s`,
              width: `${3 + (i % 2)}px`,
              height: `${3 + (i % 2)}px`,
            }} 
          />
        ))}
      </div>
      
      <style>{`
        .mesh-bg {
          position: absolute;
          inset: -20%;
          background: 
            radial-gradient(ellipse 70% 50% at 25% 25%, rgba(124, 58, 237, 0.08), transparent 55%),
            radial-gradient(ellipse 60% 60% at 75% 75%, rgba(192, 132, 252, 0.06), transparent 55%);
          animation: mesh-drift 70s ease-in-out infinite;
          transition: transform 0.4s ease-out;
        }
        
        .dark .mesh-bg {
          background: 
            radial-gradient(ellipse 70% 50% at 25% 25%, rgba(124, 58, 237, 0.12), transparent 55%),
            radial-gradient(ellipse 60% 60% at 75% 75%, rgba(167, 139, 250, 0.09), transparent 55%);
        }
        
        @keyframes mesh-drift {
          0%, 100% { 
            margin-left: 0; 
            margin-top: 0;
          }
          50% { 
            margin-left: 12px; 
            margin-top: 10px;
          }
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
          transition: transform 0.4s ease-out;
        }
        
        .orb-1 {
          width: 400px;
          height: 400px;
          top: -5%;
          left: -5%;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.10) 0%, transparent 70%);
          animation: orb-float-1 60s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 350px;
          height: 350px;
          bottom: 0%;
          right: -5%;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.08) 0%, transparent 70%);
          animation: orb-float-2 65s ease-in-out infinite;
        }
        
        .dark .orb-1 { 
          background: radial-gradient(circle, rgba(124, 58, 237, 0.14) 0%, transparent 70%);
        }
        .dark .orb-2 { 
          background: radial-gradient(circle, rgba(167, 139, 250, 0.11) 0%, transparent 70%);
        }
        
        @keyframes orb-float-1 {
          0%, 100% { margin-left: 0; margin-top: 0; }
          50% { margin-left: 14px; margin-top: 12px; }
        }
        
        @keyframes orb-float-2 {
          0%, 100% { margin-right: 0; margin-bottom: 0; }
          50% { margin-right: -10px; margin-bottom: -8px; }
        }
        
        .glow-line {
          position: absolute;
          width: 30%;
          height: 1px;
          top: 40%;
          left: 20%;
          background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.12), rgba(192, 132, 252, 0.10), transparent);
          opacity: 0.2;
          transition: transform 0.4s ease-out;
          animation: line-fade 16s ease-in-out infinite;
        }
        
        .dark .glow-line {
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.18), rgba(167, 139, 250, 0.14), transparent);
          opacity: 0.25;
        }
        
        @keyframes line-fade {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.28; }
        }
        
        .particles-container {
          position: absolute;
          inset: 0;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.12);
          animation: particle-drift 50s ease-in-out infinite;
        }
        
        .dark .particle {
          background: rgba(167, 139, 250, 0.15);
        }
        
        @keyframes particle-drift {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% { 
            transform: translate(12px, -16px);
            opacity: 0.5;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .mesh-bg, .orb, .glow-line, .particle {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
