import { useState, useEffect } from "react";
import type { Project, ProjectImage } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch gallery images when project changes
  useEffect(() => {
    if (project?.id) {
      fetch(`/api/projects/${project.id}/images`)
        .then((res) => res.json())
        .then((images) => {
          setGalleryImages(images);
          setCurrentImageIndex(0);
        })
        .catch((error) => {
          console.error("Error fetching gallery images:", error);
          setGalleryImages([]);
        });
    } else {
      setGalleryImages([]);
      setCurrentImageIndex(0);
    }
  }, [project?.id]);

  if (!project) return null;

  // Combine main image with gallery images for a unified carousel
  const allImages = [
    ...(project.imageUrl ? [{ id: "main", imageUrl: project.imageUrl, caption: null }] : []),
    ...galleryImages,
  ];

  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-50 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
                data-testid="button-close-modal"
              >
                <X className="h-4 w-4" />
              </Button>

              {allImages.length > 0 && (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={allImages[currentImageIndex]?.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                  
                  {hasMultipleImages && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        onClick={goToPrevious}
                        data-testid="button-prev-image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        onClick={goToNext}
                        data-testid="button-next-image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {allImages.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/40 hover:bg-white/60"
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                            data-testid={`button-image-dot-${index}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="p-8">
                <DialogHeader className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <DialogTitle className="text-3xl font-bold" data-testid="text-modal-project-title">
                    {project.title}
                  </DialogTitle>
                  {project.role && (
                    <p className="text-muted-foreground mt-2">
                      {project.role} {project.year && `• ${project.year}`}
                    </p>
                  )}
                </DialogHeader>

                <div className="space-y-6">
                  {project.description && (
                    <div>
                      <h4 className="font-semibold mb-2">О проекте</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.description}
                      </p>
                    </div>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Технологии</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-4">
                    {project.externalUrl && (
                      <Button asChild data-testid="button-view-live">
                        <a
                          href={project.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Смотреть проект
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" asChild data-testid="button-view-github">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          Исходный код
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
