import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { TagFilter } from "@/components/TagFilter";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { 
  CreativeSparkIcon, 
  PortfolioIcon,
  UserProfileIcon,
  ContactEnvelopeIcon,
  SettingsGearIcon,
} from "@/components/CustomIcons";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant="cosmic" intensity="vibrant" interactive />

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
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
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/about">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-nav-about">
                <UserProfileIcon size={18} animate={false} />
                Обо мне
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-nav-contact">
                <ContactEnvelopeIcon size={18} animate={false} />
                Контакты
              </Button>
            </Link>
            <PDFDownloadButton
              projects={filteredProjects}
              aboutContent={aboutContent}
              ownerName={aboutContent?.title || "Портфолио"}
              variant="ghost"
              size="sm"
            />
            <ThemeToggle />
            {user?.isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2 glass-button text-primary-foreground" data-testid="button-admin">
                  <SettingsGearIcon size={16} animate={false} />
                  Управление
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" asChild className="gap-2" data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="h-4 w-4" />
                Выйти
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 relative z-10">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <PortfolioIcon size={20} className="text-primary" />
                <span className="text-sm font-medium text-primary">Творческие работы</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Мои работы</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Коллекция моих творческих проектов и профессиональных работ. 
                Каждый проект — это уникальная история и новый опыт.
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
                  <Loader2 className="h-10 w-10 text-primary" />
                </motion.div>
              </div>
            ) : filteredProjects.length === 0 ? (
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
                  <CreativeSparkIcon className="h-12 w-12 text-primary" size={48} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">Проектов пока нет</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  {user?.isAdmin
                    ? "Добавьте свой первый проект"
                    : "Скоро здесь появятся удивительные работы"}
                </p>
                {user?.isAdmin && (
                  <Button asChild size="lg" className="glass-button text-primary-foreground" data-testid="button-add-first-project">
                    <Link href="/admin">Добавить проект</Link>
                  </Button>
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
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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

      <footer className="border-t border-border/50 py-10 mt-12 bg-background/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <CreativeSparkIcon size={20} className="text-primary" />
            <span className="font-medium">Творческое Портфолио</span>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
