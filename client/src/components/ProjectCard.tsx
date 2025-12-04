import type { Project } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index: number;
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-card border border-card-border transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
      data-testid={`card-project-${project.id}`}
    >
      <div className="aspect-video overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-4xl text-muted-foreground">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 transition-all duration-300 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">Открыть проект</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags && project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-1" data-testid={`text-project-title-${project.id}`}>
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {project.shortDescription || project.description}
        </p>
        {project.year && (
          <p className="text-xs text-muted-foreground mt-3">{project.year}</p>
        )}
      </div>
    </motion.article>
  );
}
