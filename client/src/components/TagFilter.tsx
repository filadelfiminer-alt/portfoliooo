import { motion } from "framer-motion";
import { Filter } from "lucide-react";

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
      className="sticky top-16 z-40 py-4"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg shadow-violet-500/5">
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">Фильтр</span>
          </div>
          
          <div className="w-px h-6 bg-border/50 hidden sm:block" />
          
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTag(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedTag === null
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/25"
                  : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              data-testid="button-filter-all"
            >
              Все
            </motion.button>
            
            {tags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/25"
                    : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-testid={`button-filter-${tag}`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
