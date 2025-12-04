import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ArrowRight, ArrowDown, Code2, Palette, Lightbulb, Sparkles, Star, Heart, ExternalLink, Github, Mail, MessageCircle } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import type { Project, About } from "@shared/schema";

export default function Landing() {
  const [secretClicks, setSecretClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [typingPhase, setTypingPhase] = useState(0); // 0: hidden, 1: typing dots, 2: message
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: aboutContent } = useQuery<About>({
    queryKey: ["/api/about"],
  });

  const publishedProjects = projects.filter(p => p.published);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant notification tone
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Two-tone notification (like iMessage)
      oscillator1.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      oscillator1.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.1); // C6
      oscillator2.frequency.setValueAtTime(1318.5, audioContext.currentTime); // E6
      oscillator2.frequency.setValueAtTime(1568, audioContext.currentTime + 0.1); // G6
      
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      
      // Smooth volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.12);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.25);
      
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.25);
      oscillator2.stop(audioContext.currentTime + 0.25);
    } catch (e) {
      // Audio not supported
    }
  };

  // Show greeting with typing animation
  useEffect(() => {
    // Phase 1: Show typing indicator
    const timer1 = setTimeout(() => {
      setTypingPhase(1);
    }, 500);
    
    // Phase 2: Show message with sound
    const timer2 = setTimeout(() => {
      setTypingPhase(2);
      playNotificationSound();
    }, 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (secretClicks >= 7) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 4000);
      setSecretClicks(0);
    }
  }, [secretClicks]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 15,
        delay: i * 0.1
      }
    })
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Secret Easter Egg */}
      {showSecret && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-8 py-5 rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-2xl shadow-violet-500/50"
        >
          <div className="flex items-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Star className="h-7 w-7" />
            </motion.div>
            <span className="font-bold text-lg">Ты нашёл секрет! Ты особенный!</span>
            <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
          </div>
        </motion.div>
      )}
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer select-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSecretClicks(prev => prev + 1)}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-7 w-7 text-violet-500" />
            </motion.div>
            <span className="font-display font-bold text-xl tracking-tight">
              {aboutContent?.title || "Портфолио"}
            </span>
          </motion.div>
          
          <nav className="flex items-center gap-1 flex-wrap">
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-works">
              <a href="#works">Работы</a>
            </Button>
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-about">
              <Link href="/about">Обо мне</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-contact">
              <Link href="/contact">Контакты</Link>
            </Button>
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" asChild className="ml-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0" data-testid="button-login">
                <a href="/api/login">Войти</a>
              </Button>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="min-h-screen flex items-center justify-center pt-16 relative px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Avatar/Photo */}
              {aboutContent?.photoUrl && (
                <motion.div
                  variants={itemVariants}
                  className="mb-8"
                >
                  <motion.div 
                    className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-violet-500/30 ring-offset-4 ring-offset-background"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <img 
                      src={aboutContent.photoUrl} 
                      alt="Фото" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Greeting - Message Style with Typing Effect */}
              <div className="mb-6 min-h-[70px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {typingPhase === 1 && (
                    <motion.div 
                      key="typing"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="inline-flex items-center gap-3 px-5 py-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-violet-500/30 shadow-xl shadow-violet-500/10"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <motion.div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground mb-1">печатает...</span>
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-violet-500"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-violet-500"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.12 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-violet-500"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.24 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {typingPhase === 2 && (
                    <motion.div 
                      key="message"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="inline-flex items-center gap-3 px-5 py-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-violet-500/30 shadow-xl shadow-violet-500/10"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <motion.div
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-muted-foreground mb-0.5">сейчас</span>
                        <p className="font-medium text-foreground">
                          Привет, я{" "}
                          <span className="font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                            Filadelfi
                          </span>
                        </p>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                        className="ml-2 relative"
                      >
                        {/* Glowing background */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-md"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Rotating stars container */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="relative"
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                        </motion.div>
                        {/* Orbiting mini sparkles */}
                        <motion.div
                          className="absolute -top-1 -right-1"
                          animate={{ 
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-fuchsia-400" />
                        </motion.div>
                        <motion.div
                          className="absolute -bottom-0.5 -left-1"
                          animate={{ 
                            scale: [1, 0.7, 1],
                            opacity: [0.8, 0.4, 0.8]
                          }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
                        >
                          <Sparkles className="w-2 h-2 text-violet-400" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Heading */}
              <motion.h1 
                variants={itemVariants}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.1] tracking-tight"
              >
                <span className="block text-foreground">Создаю</span>
                <motion.span 
                  className="block mt-2"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{
                    backgroundSize: "200% 200%",
                    backgroundImage: "linear-gradient(90deg, #8b5cf6, #d946ef, #ec4899, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  цифровые чудеса
                </motion.span>
              </motion.h1>

              {/* Bio */}
              <motion.p 
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                {aboutContent?.bio || "Дизайнер и разработчик. Превращаю идеи в красивые цифровые продукты."}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    asChild 
                    className="px-8 py-6 text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0 shadow-xl shadow-violet-500/25" 
                    data-testid="button-view-works"
                  >
                    <a href="#works">
                      Смотреть работы
                      <ArrowDown className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="px-8 py-6 text-base border-2"
                    data-testid="button-contact-me"
                  >
                    <Link href="/contact">
                      Написать мне
                      <Mail className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Skills Icons */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-8 mt-16"
              >
                {[
                  { icon: Code2, label: "Код" },
                  { icon: Palette, label: "Дизайн" },
                  { icon: Lightbulb, label: "Идеи" },
                ].map((skill, i) => (
                  <motion.div
                    key={skill.label}
                    className="flex flex-col items-center gap-2 text-muted-foreground"
                    whileHover={{ scale: 1.1, y: -5, color: "hsl(var(--foreground))" }}
                  >
                    <skill.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{skill.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a href="#works" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xs font-medium">Листай</span>
              <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-2">
                <motion.div
                  className="w-1.5 h-2.5 rounded-full bg-current"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </a>
          </motion.div>
        </motion.section>

        {/* Works Section */}
        <section id="works" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-500 dark:text-violet-400 text-sm font-medium mb-4"
              >
                Портфолио
              </motion.span>
              <h2 
                className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6"
              >
                Мои{" "}
                <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  работы
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Избранные проекты, над которыми я работал
              </p>
            </motion.div>

            {publishedProjects.length > 0 ? (
              <>
                {/* Infinite Scrolling Carousel */}
                <div className="relative overflow-hidden py-4">
                  {/* Gradient fade edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                  
                  {/* Scrolling track */}
                  <motion.div
                    className="flex gap-6"
                    animate={{ x: [0, -1920] }}
                    transition={{
                      x: {
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                      }
                    }}
                  >
                    {/* Duplicate projects for seamless loop */}
                    {[...publishedProjects, ...publishedProjects, ...publishedProjects].map((project, i) => (
                      <motion.div
                        key={`${project.id}-${i}`}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group relative flex-shrink-0 w-[320px] md:w-[380px] bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                        onClick={() => window.location.href = '/gallery'}
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          {project.imageUrl ? (
                            <img 
                              src={project.imageUrl} 
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
                              <div className="text-center">
                                <Sparkles className="h-12 w-12 text-violet-400 mx-auto mb-2" />
                                <span className="text-violet-300 font-medium">{project.title.charAt(0)}</span>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">{project.title}</h3>
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-xs font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <motion.div 
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <ExternalLink className="h-5 w-5 text-white" />
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-violet-500" />
                </div>
                <p className="text-xl text-muted-foreground mb-6">
                  Скоро здесь появятся мои работы
                </p>
                <Button asChild variant="outline" data-testid="button-login-to-add">
                  <a href="/api/login">Войти чтобы добавить</a>
                </Button>
              </motion.div>
            )}

            {publishedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" asChild className="px-8" data-testid="button-all-works">
                    <Link href="/gallery">
                      Все работы
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center p-10 md:p-16 rounded-3xl bg-gradient-to-br from-violet-600/10 via-fuchsia-600/5 to-pink-600/10 border border-violet-500/20 relative overflow-hidden"
            >
              <motion.div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-violet-500/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <motion.h2
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                className="font-display relative z-10 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6"
              >
                Есть идея?{" "}
                <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Давай обсудим!
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative z-10 text-lg text-muted-foreground mb-10"
              >
                Всегда открыт для интересных проектов и сотрудничества
              </motion.p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Button 
                  size="lg" 
                  asChild 
                  className="px-10 py-7 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0 shadow-xl shadow-violet-500/25"
                  data-testid="button-contact-cta"
                >
                  <Link href="/contact">
                    Написать мне
                    <Mail className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-muted-foreground cursor-pointer"
              onClick={() => setSecretClicks(prev => prev + 1)}
            >
              <Sparkles className="h-5 w-5 text-violet-500" />
              <span className="font-medium">{aboutContent?.title || "Портфолио"}</span>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Сделано с <Heart className="inline h-3 w-3 text-pink-500" /> 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
