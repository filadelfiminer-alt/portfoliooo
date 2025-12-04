import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagFilter({ tags, selectedTag, onSelectTag }: TagFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-md py-4 border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">Фильтр:</span>
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer transition-all"
            onClick={() => onSelectTag(null)}
            data-testid="button-filter-all"
          >
            Все
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer transition-all"
              onClick={() => onSelectTag(tag)}
              data-testid={`button-filter-${tag}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
