import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Sparkles,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowLeft,
  Download,
} from "lucide-react";
import type { About } from "@shared/schema";

export default function AboutPage() {
  const { data: about, isLoading } = useQuery<About | null>({
    queryKey: ["/api/about"],
  });

  const socialIcons: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
    email: Mail,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Portfolio</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/gallery">
              <Button variant="ghost" size="sm" data-testid="button-back-gallery">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Gallery
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-48 h-48 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="h-10 w-48 bg-muted rounded animate-pulse mx-auto md:mx-0" />
                  <div className="h-6 w-64 bg-muted rounded animate-pulse mx-auto md:mx-0" />
                  <div className="h-24 bg-muted rounded animate-pulse" />
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
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {about.photoUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20">
                      <img
                        src={about.photoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </motion.div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold mb-3"
                    data-testid="text-about-title"
                  >
                    {about.title || "About Me"}
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
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {about.bio}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {about.skills && about.skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {about.skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                      >
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {about.socialLinks && Object.keys(about.socialLinks as object).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h2 className="text-2xl font-bold mb-4">Connect</h2>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(about.socialLinks as Record<string, string>).map(([key, url]) => {
                      const Icon = socialIcons[key] || Globe;
                      return (
                        <Button
                          key={key}
                          variant="outline"
                          size="default"
                          asChild
                          data-testid={`button-social-${key}`}
                        >
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <Icon className="h-4 w-4 mr-2" />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {about.resumeUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button size="lg" asChild data-testid="button-download-resume">
                    <a href={about.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-5 w-5 mr-2" />
                      Download Resume
                    </a>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">About section coming soon</h2>
              <p className="text-muted-foreground">
                The portfolio owner hasn't added their bio yet.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
