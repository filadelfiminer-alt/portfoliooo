import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Portfolio</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-about">
              <a href="/about">About</a>
            </Button>
            <Button variant="ghost" size="sm" asChild data-testid="button-nav-contact">
              <a href="/contact">Contact</a>
            </Button>
            <ThemeToggle />
            <Button asChild data-testid="button-login">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="min-h-screen flex items-center justify-center pt-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Creative Portfolio</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Showcase Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Best Work
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                A beautiful portfolio platform to display your creative projects. 
                Easy to manage, stunning to view.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button size="lg" asChild className="px-8" data-testid="button-get-started">
                  <a href="/api/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-view-gallery">
                  <a href="/gallery">View Gallery</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="gallery" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Work
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Sign in to create your own stunning portfolio and showcase your projects.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-video rounded-xl bg-card border border-card-border overflow-hidden group"
                >
                  <div className="h-full w-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">Your Project {i}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Create your professional portfolio in minutes. 
                Upload your work, customize your gallery, and share with the world.
              </p>
              <Button size="lg" asChild data-testid="button-create-portfolio">
                <a href="/api/login">
                  Create Your Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Creative Portfolio Platform</p>
        </div>
      </footer>
    </div>
  );
}
