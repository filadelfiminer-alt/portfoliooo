import { useEffect, useState, useRef, useCallback } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    speed: number;
    angle: number;
  }>>([]);

  const initParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: 2 + Math.random() * 3,
        speed: 0.2 + Math.random() * 0.3,
        angle: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    setMounted(true);
    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [initParticles]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles if not already done
    if (particlesRef.current.length === 0) {
      initParticles();
    }

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check dark mode on each frame for proper theme switching
      const isDark = document.documentElement.classList.contains('dark');

      const mouseX = mousePos.x * canvas.width;
      const mouseY = mousePos.y * canvas.height;

      // Update and draw particles
      particlesRef.current.forEach((p, i) => {
        // Gentle floating motion
        p.angle += p.speed * 0.02;
        const floatX = Math.sin(p.angle) * 20;
        const floatY = Math.cos(p.angle * 0.7) * 15;

        // Calculate distance to mouse
        const targetX = (p.baseX / 100) * canvas.width + floatX;
        const targetY = (p.baseY / 100) * canvas.height + floatY;
        const dx = mouseX - targetX;
        const dy = mouseY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        // Attract particles toward cursor
        let attractX = 0;
        let attractY = 0;
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 40;
          attractX = (dx / dist) * force;
          attractY = (dy / dist) * force;
        }

        p.x = targetX + attractX;
        p.y = targetY + attractY;

        // Draw particle
        const alpha = isDark ? 0.6 : 0.4;
        const glow = isDark ? 0.3 : 0.2;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(167, 139, 250, ${glow})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(192, 132, 252, 0.8)' : 'rgba(139, 92, 246, 0.6)';
        ctx.fill();
      });

      // Draw connection lines between nearby particles
      const lineAlpha = isDark ? 0.15 : 0.1;
      ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
      ctx.lineWidth = 1;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = (1 - dist / 120) * lineAlpha;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw lines from cursor to nearby particles
      const cursorLineAlpha = isDark ? 0.25 : 0.18;
      particlesRef.current.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * cursorLineAlpha;
          ctx.strokeStyle = `rgba(192, 132, 252, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [mousePos, initParticles]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/40 to-fuchsia-50/30 dark:from-slate-950 dark:via-violet-950/40 dark:to-fuchsia-950/30" />
      
      {/* Aurora layers */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      
      {/* Interactive canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0"
        style={{ opacity: 0.9 }}
      />
      
      {/* Subtle noise texture */}
      <div className="noise-overlay" />
      
      <style>{`
        .aurora {
          position: absolute;
          filter: blur(100px);
          opacity: 0.5;
        }
        
        .aurora-1 {
          width: 80%;
          height: 50%;
          top: -10%;
          left: -10%;
          background: linear-gradient(
            135deg,
            rgba(124, 58, 237, 0.15) 0%,
            rgba(167, 139, 250, 0.10) 50%,
            transparent 100%
          );
          animation: aurora-drift-1 45s ease-in-out infinite;
        }
        
        .aurora-2 {
          width: 70%;
          height: 60%;
          bottom: -15%;
          right: -10%;
          background: linear-gradient(
            -45deg,
            rgba(192, 132, 252, 0.12) 0%,
            rgba(232, 121, 249, 0.08) 50%,
            transparent 100%
          );
          animation: aurora-drift-2 50s ease-in-out infinite;
        }
        
        .dark .aurora-1 {
          background: linear-gradient(
            135deg,
            rgba(124, 58, 237, 0.25) 0%,
            rgba(167, 139, 250, 0.15) 50%,
            transparent 100%
          );
        }
        
        .dark .aurora-2 {
          background: linear-gradient(
            -45deg,
            rgba(192, 132, 252, 0.20) 0%,
            rgba(232, 121, 249, 0.12) 50%,
            transparent 100%
          );
        }
        
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, 20px) rotate(3deg); }
        }
        
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-25px, -15px) rotate(-2deg); }
        }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        
        .dark .noise-overlay {
          opacity: 0.04;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .aurora {
            animation: none !important;
          }
          canvas {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
