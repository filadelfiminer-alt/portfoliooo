import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
  variant?: "gradient" | "aurora" | "mesh";
}

export function AnimatedBackground({ variant = "gradient" }: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (variant === "aurora") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="aurora-bg" />
        <style>{`
          .aurora-bg {
            position: absolute;
            inset: 0;
            background: 
              linear-gradient(125deg, 
                #667eea 0%, 
                #764ba2 25%, 
                #f093fb 50%, 
                #667eea 75%,
                #764ba2 100%);
            background-size: 400% 400%;
            animation: aurora-shift 15s ease infinite;
            opacity: 0.4;
          }
          
          .dark .aurora-bg {
            opacity: 0.25;
          }
          
          @keyframes aurora-shift {
            0%, 100% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
          }
        `}</style>
        
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <style>{`
          .aurora-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            will-change: transform;
          }
          
          .dark .aurora-orb {
            opacity: 0.3;
          }
          
          .aurora-orb-1 {
            width: 50vw;
            height: 50vw;
            top: -10%;
            left: -10%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            animation: float-1 20s ease-in-out infinite;
          }
          
          .aurora-orb-2 {
            width: 40vw;
            height: 40vw;
            bottom: -5%;
            right: -5%;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            animation: float-2 25s ease-in-out infinite;
          }
          
          .aurora-orb-3 {
            width: 35vw;
            height: 35vw;
            top: 40%;
            left: 30%;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            animation: float-3 18s ease-in-out infinite;
          }
          
          @keyframes float-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(5vw, 3vw) scale(1.1); }
            66% { transform: translate(-3vw, 5vw) scale(0.95); }
          }
          
          @keyframes float-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-4vw, -3vw) scale(1.05); }
            66% { transform: translate(3vw, -4vw) scale(1.1); }
          }
          
          @keyframes float-3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(3vw, -3vw) scale(1.15); }
          }
        `}</style>
      </div>
    );
  }

  if (variant === "mesh") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="mesh-gradient" />
        <style>{`
          .mesh-gradient {
            position: absolute;
            inset: 0;
            background: 
              radial-gradient(at 40% 20%, #667eea 0px, transparent 50%),
              radial-gradient(at 80% 0%, #764ba2 0px, transparent 50%),
              radial-gradient(at 0% 50%, #4facfe 0px, transparent 50%),
              radial-gradient(at 80% 50%, #f093fb 0px, transparent 50%),
              radial-gradient(at 0% 100%, #667eea 0px, transparent 50%),
              radial-gradient(at 80% 100%, #00f2fe 0px, transparent 50%);
            opacity: 0.4;
            animation: mesh-move 30s ease infinite;
          }
          
          .dark .mesh-gradient {
            opacity: 0.2;
          }
          
          @keyframes mesh-move {
            0%, 100% { 
              background-position: 0% 0%, 100% 0%, 0% 50%, 100% 50%, 0% 100%, 100% 100%; 
            }
            50% { 
              background-position: 100% 0%, 0% 0%, 100% 50%, 0% 50%, 100% 100%, 0% 100%; 
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="gradient-flow" />
      <style>{`
        .gradient-flow {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            #667eea 0deg,
            #764ba2 60deg,
            #f093fb 120deg,
            #f5576c 180deg,
            #4facfe 240deg,
            #00f2fe 300deg,
            #667eea 360deg
          );
          animation: rotate-gradient 20s linear infinite;
          opacity: 0.3;
          filter: blur(100px);
        }
        
        .dark .gradient-flow {
          opacity: 0.15;
        }
        
        @keyframes rotate-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="glow-orb glow-1" />
      <div className="glow-orb glow-2" />
      <style>{`
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          will-change: transform;
        }
        
        .glow-1 {
          width: 40vw;
          height: 40vw;
          top: 10%;
          left: 20%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          opacity: 0.5;
          animation: pulse-1 8s ease-in-out infinite;
        }
        
        .dark .glow-1 {
          opacity: 0.25;
        }
        
        .glow-2 {
          width: 35vw;
          height: 35vw;
          bottom: 20%;
          right: 15%;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          opacity: 0.4;
          animation: pulse-2 10s ease-in-out infinite;
        }
        
        .dark .glow-2 {
          opacity: 0.2;
        }
        
        @keyframes pulse-1 {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        .dark @keyframes pulse-1 {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.1); opacity: 0.35; }
        }
        
        @keyframes pulse-2 {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
