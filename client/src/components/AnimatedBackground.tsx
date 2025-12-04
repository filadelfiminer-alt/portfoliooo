import { useEffect, useState, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
    
    // Generate random particles
    particlesRef.current = [...Array(10)].map((_, i) => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 3 + Math.random() * 2,
      delay: i * 4,
    }));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Smooth mouse following
  useEffect(() => {
    const animate = () => {
      setSmoothMouse(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.08,
        y: prev.y + (mousePos.y - prev.y) * 0.08,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mousePos]);

  if (!mounted) return null;

  const normalizedX = (smoothMouse.x - 0.5) * 2;
  const normalizedY = (smoothMouse.y - 0.5) * 2;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/50 to-fuchsia-50/30 dark:from-slate-950 dark:via-violet-950/50 dark:to-fuchsia-950/30" />
      
      {/* Aurora ribbon 1 */}
      <div 
        className="aurora aurora-1"
        style={{
          transform: `translate(${normalizedX * 12}px, ${normalizedY * 12}px)`
        }}
      />
      
      {/* Aurora ribbon 2 */}
      <div 
        className="aurora aurora-2"
        style={{
          transform: `translate(${normalizedX * -10}px, ${normalizedY * -10}px)`
        }}
      />
      
      {/* Soft orbs */}
      <div 
        className="orb orb-1"
        style={{
          transform: `translate(${normalizedX * 15}px, ${normalizedY * 15}px)`
        }}
      />
      <div 
        className="orb orb-2"
        style={{
          transform: `translate(${normalizedX * -12}px, ${normalizedY * -12}px)`
        }}
      />
      <div 
        className="orb orb-3"
        style={{
          transform: `translate(${normalizedX * 10}px, ${normalizedY * 10}px)`
        }}
      />
      
      {/* Glowing lines */}
      <div 
        className="glow-line glow-line-1"
        style={{
          transform: `rotate(-15deg) translate(${normalizedX * 8}px, ${normalizedY * 8}px)`
        }}
      />
      <div 
        className="glow-line glow-line-2"
        style={{
          transform: `rotate(12deg) translate(${normalizedX * -6}px, ${normalizedY * -6}px)`
        }}
      />
      
      {/* Floating particles */}
      <div className="particles-container">
        {particlesRef.current.map((p, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              transform: `translate(${normalizedX * (6 + i % 4)}px, ${normalizedY * (6 + i % 4)}px)`
            }} 
          />
        ))}
      </div>
      
      {/* Cursor spotlight */}
      <div 
        className="spotlight"
        style={{
          left: `${smoothMouse.x * 100}%`,
          top: `${smoothMouse.y * 100}%`,
        }}
      />
      
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      <style>{`
        .aurora {
          position: absolute;
          filter: blur(80px);
          opacity: 0.6;
          transition: transform 0.4s ease-out;
        }
        
        .aurora-1 {
          width: 120%;
          height: 50%;
          top: -20%;
          left: -10%;
          background: linear-gradient(
            135deg,
            rgba(124, 58, 237, 0.12) 0%,
            rgba(167, 139, 250, 0.10) 25%,
            rgba(192, 132, 252, 0.08) 50%,
            rgba(232, 121, 249, 0.06) 75%,
            transparent 100%
          );
          animation: aurora-flow-1 60s ease-in-out infinite;
        }
        
        .aurora-2 {
          width: 100%;
          height: 60%;
          bottom: -20%;
          right: -10%;
          background: linear-gradient(
            -45deg,
            rgba(192, 132, 252, 0.10) 0%,
            rgba(139, 92, 246, 0.08) 30%,
            rgba(124, 58, 237, 0.06) 60%,
            transparent 100%
          );
          animation: aurora-flow-2 55s ease-in-out infinite;
        }
        
        .dark .aurora-1 {
          background: linear-gradient(
            135deg,
            rgba(124, 58, 237, 0.18) 0%,
            rgba(167, 139, 250, 0.14) 25%,
            rgba(192, 132, 252, 0.10) 50%,
            rgba(232, 121, 249, 0.08) 75%,
            transparent 100%
          );
        }
        
        .dark .aurora-2 {
          background: linear-gradient(
            -45deg,
            rgba(192, 132, 252, 0.14) 0%,
            rgba(139, 92, 246, 0.12) 30%,
            rgba(124, 58, 237, 0.08) 60%,
            transparent 100%
          );
        }
        
        @keyframes aurora-flow-1 {
          0%, 100% { 
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(20px) translateY(15px) rotate(2deg);
          }
          50% { 
            transform: translateX(10px) translateY(25px) rotate(-1deg);
          }
          75% {
            transform: translateX(-15px) translateY(10px) rotate(1deg);
          }
        }
        
        @keyframes aurora-flow-2 {
          0%, 100% { 
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          33% {
            transform: translateX(-18px) translateY(-12px) rotate(-2deg);
          }
          66% { 
            transform: translateX(12px) translateY(-20px) rotate(1deg);
          }
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          transition: transform 0.35s ease-out;
        }
        
        .orb-1 {
          width: 380px;
          height: 380px;
          top: 5%;
          left: 10%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
          animation: orb-drift-1 65s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 320px;
          height: 320px;
          bottom: 15%;
          right: 15%;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.10) 0%, transparent 70%);
          animation: orb-drift-2 58s ease-in-out infinite;
        }
        
        .orb-3 {
          width: 280px;
          height: 280px;
          top: 50%;
          left: 50%;
          margin-left: -140px;
          margin-top: -140px;
          background: radial-gradient(circle, rgba(232, 121, 249, 0.08) 0%, transparent 70%);
          animation: orb-drift-3 70s ease-in-out infinite;
        }
        
        .dark .orb-1 { background: radial-gradient(circle, rgba(139, 92, 246, 0.16) 0%, transparent 70%); }
        .dark .orb-2 { background: radial-gradient(circle, rgba(192, 132, 252, 0.14) 0%, transparent 70%); }
        .dark .orb-3 { background: radial-gradient(circle, rgba(232, 121, 249, 0.12) 0%, transparent 70%); }
        
        @keyframes orb-drift-1 {
          0%, 100% { margin-left: 0; margin-top: 0; }
          50% { margin-left: 25px; margin-top: 20px; }
        }
        
        @keyframes orb-drift-2 {
          0%, 100% { margin-right: 0; margin-bottom: 0; }
          50% { margin-right: -20px; margin-bottom: -15px; }
        }
        
        @keyframes orb-drift-3 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .glow-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(139, 92, 246, 0.20), 
            rgba(192, 132, 252, 0.25), 
            rgba(232, 121, 249, 0.20), 
            transparent
          );
          transition: transform 0.4s ease-out;
        }
        
        .dark .glow-line {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(139, 92, 246, 0.28), 
            rgba(192, 132, 252, 0.32), 
            rgba(232, 121, 249, 0.28), 
            transparent
          );
        }
        
        .glow-line-1 {
          width: 45%;
          top: 30%;
          left: 10%;
          animation: line-glow-1 14s ease-in-out infinite;
        }
        
        .glow-line-2 {
          width: 35%;
          top: 70%;
          right: 15%;
          animation: line-glow-2 18s ease-in-out infinite;
        }
        
        @keyframes line-glow-1 {
          0%, 100% { opacity: 0.3; width: 45%; }
          50% { opacity: 0.7; width: 55%; }
        }
        
        @keyframes line-glow-2 {
          0%, 100% { opacity: 0.2; width: 35%; }
          50% { opacity: 0.6; width: 42%; }
        }
        
        .particles-container {
          position: absolute;
          inset: 0;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 6px rgba(139, 92, 246, 0.3);
          animation: particle-float 50s ease-in-out infinite;
          transition: transform 0.3s ease-out;
        }
        
        .dark .particle {
          background: rgba(192, 132, 252, 0.6);
          box-shadow: 0 0 8px rgba(192, 132, 252, 0.4);
        }
        
        @keyframes particle-float {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.4;
          }
          25% {
            transform: translate(8px, -12px);
            opacity: 0.7;
          }
          50% { 
            transform: translate(15px, -20px);
            opacity: 0.5;
          }
          75% {
            transform: translate(6px, -28px);
            opacity: 0.6;
          }
        }
        
        .spotlight {
          position: absolute;
          width: 500px;
          height: 500px;
          margin-left: -250px;
          margin-top: -250px;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.08) 0%,
            rgba(192, 132, 252, 0.04) 30%,
            transparent 60%
          );
          pointer-events: none;
          transition: left 0.1s ease-out, top 0.1s ease-out;
        }
        
        .dark .spotlight {
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.12) 0%,
            rgba(192, 132, 252, 0.06) 30%,
            transparent 60%
          );
        }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        
        .dark .noise-overlay {
          opacity: 0.05;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .aurora, .orb, .glow-line, .particle, .spotlight {
            animation: none !important;
            transition: none !important;
          }
          .spotlight { display: none; }
        }
      `}</style>
    </div>
  );
}
