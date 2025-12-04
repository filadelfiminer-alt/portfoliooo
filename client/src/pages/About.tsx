import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import {
  CreativeSparkIcon,
  UserProfileIcon,
  PortfolioIcon,
  ExternalLinkIcon,
  DownloadIcon,
} from "@/components/CustomIcons";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowLeft,
} from "lucide-react";
import type { About } from "@shared/schema";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  email: Mail,
};

const socialLabels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Сайт",
  email: "Почта",
};

function SocialLinks({ links }: { links: Record<string, string> }) {
  const entries = Object.entries(links);
  if (entries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <ExternalLinkIcon size={24} className="text-primary" />
        Связь
      </h2>
      <div className="flex flex-wrap gap-4">
        {entries.map(([key, url]) => {
          const Icon = socialIcons[key] || Globe;
          const label = socialLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <Button
              key={key}
              variant="outline"
              size="default"
              asChild
              className="gap-2 card-hover-lift"
              data-testid={`button-social-${key}`}
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Icon className="h-5 w-5" />
                {label}
              </a>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const { data: about, isLoading } = useQuery<About | null>({
    queryKey: ["/api/about"],
  });

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <CreativeSparkIcon className="h-7 w-7 text-primary" size={28} />
              </motion.div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Портфолио
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-gallery">
                <ArrowLeft className="h-4 w-4" />
                Галерея
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-48 h-48 rounded-full bg-muted/50 animate-pulse shimmer" />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="h-10 w-48 bg-muted/50 rounded animate-pulse mx-auto md:mx-0" />
                  <div className="h-6 w-64 bg-muted/50 rounded animate-pulse mx-auto md:mx-0" />
                  <div className="h-24 bg-muted/50 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ) : about ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                {about.photoUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20 pulse-glow">
                      <img
                        src={about.photoUrl}
                        alt="Фото профиля"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div 
                      className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CreativeSparkIcon className="h-7 w-7 text-white" size={28} animate={false} />
                    </motion.div>
                  </motion.div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                  >
                    <UserProfileIcon size={18} className="text-primary" />
                    <span className="text-sm font-medium text-primary">Обо мне</span>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
                    data-testid="text-about-title"
                  >
                    {about.title || "Обо мне"}
                  </motion.h1>
                  {about.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-muted-foreground mb-6"
                      data-testid="text-about-subtitle"
                    >
                      {about.subtitle}
                    </motion.p>
                  )}
                  {about.bio && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="prose prose-lg dark:prose-invert max-w-none"
                      data-testid="text-about-bio"
                    >
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                        {about.bio}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {about.skills && (about.skills as string[]).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass-card rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <PortfolioIcon size={24} className="text-primary" />
                    Навыки
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {(about.skills as string[]).map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                      >
                        <Badge variant="secondary" className="text-sm px-4 py-2 bg-primary/10 border border-primary/20 text-foreground">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {about.socialLinks ? (
                <SocialLinks links={about.socialLinks as Record<string, string>} />
              ) : null}

              {about.resumeUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button size="lg" asChild className="glass-button text-primary-foreground gap-3" data-testid="button-download-resume">
                    <a href={about.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <DownloadIcon size={20} animate={false} />
                      Скачать резюме
                    </a>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div 
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center pulse-glow"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <UserProfileIcon className="h-12 w-12 text-primary" size={48} />
              </motion.div>
              <h2 className="text-2xl font-bold mb-3">Раздел скоро появится</h2>
              <p className="text-muted-foreground text-lg">
                Информация об авторе пока не добавлена.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
