import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import { TagFilter } from "@/components/TagFilter";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Settings, LogOut, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Portfolio</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/about">
              <Button variant="ghost" size="sm" data-testid="button-nav-about">
                About
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" data-testid="button-nav-contact">
                Contact
              </Button>
            </Link>
            <PDFDownloadButton
              projects={filteredProjects}
              aboutContent={aboutContent}
              ownerName={aboutContent?.title || "Portfolio"}
              variant="ghost"
              size="sm"
            />
            <ThemeToggle />
            {user?.isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="button-admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" asChild data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                My Work
              </h1>
              <p className="text-xl text-muted-foreground">
                A collection of my creative projects and professional work.
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

        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  {user?.isAdmin
                    ? "Start by adding your first project"
                    : "Check back later for new work"}
                </p>
                {user?.isAdmin && (
                  <Button asChild data-testid="button-add-first-project">
                    <Link href="/admin">Add Project</Link>
                  </Button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTag || "all"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Creative Portfolio</p>
        </div>
      </footer>
    </div>
  );
}
