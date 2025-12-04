import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { TagFilter } from "@/components/TagFilter";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Loader2, Sparkles, Settings, User, Mail, Home as HomeIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import type { Project, About } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: aboutContent } = useQuery<About>({
    queryKey: ["/api/about"],
  });

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects.filter((p) => p.published);
    return projects.filter(
      (p) => p.published && p.tags?.includes(selectedTag)
    );
  }, [projects, selectedTag]);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="h-7 w-7 text-violet-500" />
            </motion.div>
            <span className="font-display font-bold text-xl tracking-tight">
              {aboutContent?.title || "Портфолио"}
            </span>
          </Link>
          
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-home">
              <Link href="/">
                <HomeIcon className="h-4 w-4 mr-1.5" />
                Главная
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-about">
              <Link href="/about">
                <User className="h-4 w-4 mr-1.5" />
                Обо мне
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-contact">
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-1.5" />
                Контакты
              </Link>
            </Button>
            <PDFDownloadButton
              projects={filteredProjects}
              aboutContent={aboutContent}
              ownerName={aboutContent?.title || "Портфолио"}
              variant="ghost"
              size="sm"
            />
            <ThemeToggle />
            {user?.isAdmin && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="default" size="sm" asChild className="ml-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0" data-testid="button-admin">
                  <Link href="/admin">
                    <Settings className="h-4 w-4 mr-1.5" />
                    Управление
                  </Link>
                </Button>
              </motion.div>
            )}
            <Button variant="ghost" size="sm" asChild data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="h-4 w-4 mr-1.5" />
                Выйти
              </a>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="pt-16 relative z-10">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 dark:text-violet-400 text-sm font-medium mb-6"
              >
                Галерея работ
              </motion.span>
              
              <h1 
                className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                  Мои проекты
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Коллекция моих творческих проектов и профессиональных работ. 
                Каждый проект — это уникальная история.
              </p>
            </motion.div>
          </div>
        </section>

        {allTags.length > 0 && (
          <TagFilter
            tags={allTags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        )}

        <section className="py-12 pb-24">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-10 w-10 text-violet-500" />
                </motion.div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <motion.div 
                  className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-14 w-14 text-violet-500" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold mb-3">
                  Проектов пока нет
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  {user?.isAdmin
                    ? "Добавьте свой первый проект"
                    : "Скоро здесь появятся работы"}
                </p>
                {user?.isAdmin && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 border-0" data-testid="button-add-first-project">
                      <Link href="/admin">Добавить проект</Link>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTag || "all"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => setSelectedProject(project)}
                      index={index}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <footer className="border-t border-white/5 py-10 mt-12 bg-background/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <Sparkles className="h-5 w-5 text-violet-500" />
            <span className="font-medium">{aboutContent?.title || "Творческое Портфолио"}</span>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
