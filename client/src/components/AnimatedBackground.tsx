import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "waves" | "aurora" | "blobs" | "cosmic";
  intensity?: "subtle" | "medium" | "vibrant";
  interactive?: boolean;
}

export function AnimatedBackground({
  variant = "cosmic",
  intensity = "vibrant",
  interactive = true,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animationRef = useRef<number>();

  const intensityConfig = {
    subtle: { opacity: 0.4, speed: 0.3, blur: 80 },
    medium: { opacity: 0.6, speed: 0.5, blur: 100 },
    vibrant: { opacity: 0.85, speed: 0.7, blur: 120 },
  };

  const config = intensityConfig[intensity];

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { 
        x: (e.clientX / window.innerWidth) * 2 - 1, 
        y: (e.clientY / window.innerHeight) * 2 - 1 
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  if (variant === "cosmic") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        
        <motion.div
          className="absolute w-[150vw] h-[150vh] -top-1/4 -left-1/4"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 50%, 
                hsla(270, 100%, 65%, ${config.opacity * 0.4}) 0%, 
                hsla(250, 100%, 55%, ${config.opacity * 0.2}) 30%,
                transparent 70%)
            `,
            filter: `blur(${config.blur}px)`,
          }}
          animate={{
            x: [0, 100, -50, 80, 0],
            y: [0, -80, 60, -40, 0],
            scale: [1, 1.2, 0.95, 1.15, 1],
            rotate: [0, 5, -3, 4, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[120vw] h-[120vh] -bottom-1/4 -right-1/4"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 50% 50%, 
                hsla(320, 100%, 60%, ${config.opacity * 0.35}) 0%, 
                hsla(290, 100%, 50%, ${config.opacity * 0.15}) 40%,
                transparent 70%)
            `,
            filter: `blur(${config.blur}px)`,
          }}
          animate={{
            x: [0, -120, 60, -80, 0],
            y: [0, 100, -70, 50, 0],
            scale: [1, 1.15, 1.25, 1.1, 1],
            rotate: [0, -8, 5, -4, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[100vw] h-[100vh] top-0 left-1/4"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 50% 50%, 
                hsla(200, 100%, 60%, ${config.opacity * 0.3}) 0%, 
                hsla(180, 100%, 50%, ${config.opacity * 0.1}) 50%,
                transparent 70%)
            `,
            filter: `blur(${config.blur * 0.8}px)`,
          }}
          animate={{
            x: [0, 80, -100, 40, 0],
            y: [0, 60, -40, 80, 0],
            scale: [1, 1.3, 1.1, 1.25, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[80vw] h-[80vh] top-1/3 right-1/4"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, 
                hsla(45, 100%, 65%, ${config.opacity * 0.25}) 0%, 
                hsla(30, 100%, 55%, ${config.opacity * 0.1}) 40%,
                transparent 60%)
            `,
            filter: `blur(${config.blur * 0.9}px)`,
          }}
          animate={{
            x: [0, -60, 90, -30, 0],
            y: [0, -50, 30, -70, 0],
            scale: [1, 1.2, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${20 + i * 15}vw`,
              height: `${20 + i * 15}vh`,
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
              background: `radial-gradient(circle, 
                hsla(${260 + i * 30}, 100%, 70%, ${config.opacity * 0.15}) 0%, 
                transparent 70%)`,
              filter: `blur(${60 + i * 20}px)`,
            }}
            animate={{
              x: [0, 30 * (i % 2 === 0 ? 1 : -1), -20 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, -25 * (i % 2 === 0 ? 1 : -1), 35 * (i % 2 === 0 ? 1 : -1), 0],
              scale: [1, 1.1 + i * 0.05, 0.95, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}

        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, hsla(270, 80%, 60%, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, hsla(320, 80%, 60%, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 10%, hsla(200, 80%, 60%, 0.08) 0%, transparent 40%)
            `,
          }}
        />

        <motion.div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              transparent 0%, 
              hsla(260, 50%, 50%, 0.03) 50%, 
              hsla(280, 50%, 40%, 0.05) 100%)`,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.6, 0.9, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-background" />
        
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={`hsla(270, 100%, 65%, ${config.opacity * 0.3})`} />
              <stop offset="50%" stopColor={`hsla(320, 100%, 60%, ${config.opacity * 0.2})`} />
              <stop offset="100%" stopColor={`hsla(200, 100%, 60%, ${config.opacity * 0.15})`} />
            </linearGradient>
            <linearGradient id="wave-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`hsla(200, 100%, 60%, ${config.opacity * 0.25})`} />
              <stop offset="50%" stopColor={`hsla(270, 100%, 65%, ${config.opacity * 0.2})`} />
              <stop offset="100%" stopColor={`hsla(320, 100%, 60%, ${config.opacity * 0.15})`} />
            </linearGradient>
            <filter id="wave-blur">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>
          
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
            fill="url(#wave-gradient-1)"
            filter="url(#wave-blur)"
            style={{ transformOrigin: "center" }}
            animate={{
              d: [
                "M0,60 Q20,40 50,55 T100,45 L100,100 L0,100 Z",
                "M0,45 Q30,65 50,40 T100,60 L100,100 L0,100 Z",
                "M0,55 Q25,35 50,60 T100,40 L100,100 L0,100 Z",
                "M0,60 Q20,40 50,55 T100,45 L100,100 L0,100 Z",
              ],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.path
            d="M0,70 Q30,50 60,70 T100,60 L100,100 L0,100 Z"
            fill="url(#wave-gradient-2)"
            filter="url(#wave-blur)"
            style={{ opacity: 0.7 }}
            animate={{
              d: [
                "M0,65 Q35,80 60,60 T100,75 L100,100 L0,100 Z",
                "M0,75 Q25,55 60,80 T100,55 L100,100 L0,100 Z",
                "M0,60 Q40,75 60,55 T100,70 L100,100 L0,100 Z",
                "M0,65 Q35,80 60,60 T100,75 L100,100 L0,100 Z",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </svg>

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${8 + i * 3}vw`,
              height: `${8 + i * 3}vw`,
              left: `${5 + i * 12}%`,
              bottom: `${10 + (i % 3) * 20}%`,
              background: `radial-gradient(circle, 
                hsla(${250 + i * 20}, 100%, 65%, ${config.opacity * 0.2}) 0%, 
                transparent 70%)`,
              filter: `blur(${40 + i * 10}px)`,
            }}
            animate={{
              y: [0, -30 - i * 5, 0],
              x: [0, 15 * (i % 2 === 0 ? 1 : -1), 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "blobs") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-background" />
        
        <motion.div
          className="absolute w-[60vw] h-[60vw] -top-[20vw] -left-[20vw]"
          style={{
            background: `radial-gradient(circle, 
              hsla(270, 100%, 60%, ${config.opacity * 0.5}) 0%, 
              hsla(290, 100%, 55%, ${config.opacity * 0.3}) 40%,
              transparent 70%)`,
            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
            filter: `blur(${config.blur}px)`,
          }}
          animate={{
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "50% 50% 40% 60% / 60% 40% 50% 40%",
              "60% 40% 50% 50% / 50% 60% 40% 60%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
            ],
            x: [0, 50, 30, 0],
            y: [0, 30, 60, 0],
            rotate: [0, 10, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[50vw] h-[50vw] -bottom-[15vw] -right-[15vw]"
          style={{
            background: `radial-gradient(circle, 
              hsla(320, 100%, 60%, ${config.opacity * 0.45}) 0%, 
              hsla(340, 100%, 55%, ${config.opacity * 0.25}) 40%,
              transparent 70%)`,
            borderRadius: "60% 40% 30% 70% / 50% 60% 40% 50%",
            filter: `blur(${config.blur}px)`,
          }}
          animate={{
            borderRadius: [
              "60% 40% 30% 70% / 50% 60% 40% 50%",
              "40% 60% 50% 50% / 60% 40% 60% 40%",
              "50% 50% 60% 40% / 40% 50% 50% 60%",
              "60% 40% 30% 70% / 50% 60% 40% 50%",
            ],
            x: [0, -60, -30, 0],
            y: [0, -40, -70, 0],
            rotate: [0, -15, 8, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[40vw] h-[40vw] top-[20%] right-[10%]"
          style={{
            background: `radial-gradient(circle, 
              hsla(200, 100%, 60%, ${config.opacity * 0.4}) 0%, 
              hsla(180, 100%, 55%, ${config.opacity * 0.2}) 40%,
              transparent 70%)`,
            borderRadius: "50% 50% 40% 60% / 40% 60% 50% 50%",
            filter: `blur(${config.blur * 0.8}px)`,
          }}
          animate={{
            borderRadius: [
              "50% 50% 40% 60% / 40% 60% 50% 50%",
              "60% 40% 50% 50% / 50% 50% 40% 60%",
              "40% 60% 60% 40% / 60% 40% 50% 50%",
              "50% 50% 40% 60% / 40% 60% 50% 50%",
            ],
            x: [0, -40, 50, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[35vw] h-[35vw] bottom-[30%] left-[15%]"
          style={{
            background: `radial-gradient(circle, 
              hsla(50, 100%, 60%, ${config.opacity * 0.3}) 0%, 
              hsla(40, 100%, 55%, ${config.opacity * 0.15}) 40%,
              transparent 70%)`,
            borderRadius: "45% 55% 55% 45% / 55% 45% 55% 45%",
            filter: `blur(${config.blur * 0.7}px)`,
          }}
          animate={{
            borderRadius: [
              "45% 55% 55% 45% / 55% 45% 55% 45%",
              "55% 45% 45% 55% / 45% 55% 45% 55%",
              "50% 50% 50% 50% / 50% 50% 50% 50%",
              "45% 55% 55% 45% / 55% 45% 55% 45%",
            ],
            x: [0, 30, -20, 0],
            y: [0, -25, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  if (variant === "aurora") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg,
                transparent 0%,
                hsla(270, 100%, 60%, ${config.opacity * 0.15}) 20%,
                hsla(200, 100%, 55%, ${config.opacity * 0.2}) 40%,
                hsla(160, 100%, 50%, ${config.opacity * 0.15}) 60%,
                transparent 80%
              )
            `,
            filter: `blur(${config.blur * 1.5}px)`,
          }}
          animate={{
            y: [0, -50, 50, -30, 0],
            scaleY: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.6, 1, 0.7, 0.9, 0.6],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: "150%",
              height: `${15 + i * 5}%`,
              left: "-25%",
              top: `${10 + i * 12}%`,
              background: `linear-gradient(90deg,
                transparent 0%,
                hsla(${250 + i * 20}, 100%, 60%, ${config.opacity * (0.15 - i * 0.02)}) 20%,
                hsla(${280 + i * 15}, 100%, 55%, ${config.opacity * (0.2 - i * 0.02)}) 50%,
                hsla(${200 + i * 25}, 100%, 50%, ${config.opacity * (0.15 - i * 0.02)}) 80%,
                transparent 100%
              )`,
              filter: `blur(${60 + i * 15}px)`,
              transform: `rotate(${-5 + i * 2}deg)`,
            }}
            animate={{
              x: [0, 100 * (i % 2 === 0 ? 1 : -1), -50 * (i % 2 === 0 ? 1 : -1), 0],
              opacity: [0.5 + i * 0.05, 1, 0.6, 0.8, 0.5 + i * 0.05],
              scaleX: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}

        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 100% 50% at 50% 0%, 
              hsla(270, 100%, 70%, ${config.opacity * 0.1}) 0%, 
              transparent 50%)`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.4, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  return null;
}
