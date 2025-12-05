import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import {
  CreativeSparkIcon,
  ContactEnvelopeIcon,
} from "@/components/CustomIcons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Copy, Check } from "lucide-react";
import { SiTelegram, SiDiscord } from "react-icons/si";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const copyDiscord = async () => {
    const discordNick = "filadelfi";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(discordNick);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = discordNick;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedDiscord(true);
      toast({
        title: "Скопировано!",
        description: "Discord ник скопирован в буфер обмена",
      });
      setTimeout(() => setCopiedDiscord(false), 2000);
    } catch {
      toast({
        title: "Discord",
        description: discordNick,
      });
    }
  };

  const contacts = [
    {
      name: "Telegram",
      value: "@Filadelfi_lolz",
      url: "https://t.me/Filadelfi_lolz",
      icon: SiTelegram,
      color: "bg-[#0088cc]",
      shadowColor: "shadow-[#0088cc]/25",
      hoverShadow: "hover:shadow-[#0088cc]/30",
    },
    {
      name: "Discord",
      value: "filadelfi",
      icon: SiDiscord,
      color: "bg-[#5865F2]",
      shadowColor: "shadow-[#5865F2]/25",
      hoverShadow: "hover:shadow-[#5865F2]/30",
      copyable: true,
    },
    {
      name: "LOLZ.LIVE",
      value: "Профиль",
      url: "https://lolz.live/slivi/",
      icon: ExternalLink,
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      shadowColor: "shadow-orange-500/25",
      hoverShadow: "hover:shadow-orange-500/30",
    },
  ];

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
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <ContactEnvelopeIcon size={20} className="text-primary" />
                <span className="text-sm font-medium text-primary">Связаться со мной</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Контакты</h1>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                Свяжитесь со мной любым удобным способом
              </p>
            </div>

            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass-card overflow-visible">
                    <CardContent className="p-0">
                      {contact.copyable ? (
                        <button
                          onClick={copyDiscord}
                          className="w-full flex items-center gap-4 p-6 group cursor-pointer text-left"
                          data-testid={`contact-${contact.name.toLowerCase()}`}
                        >
                          <div className={`p-4 rounded-xl ${contact.color} shadow-lg ${contact.shadowColor} ${contact.hoverShadow} transition-all group-hover:scale-105`}>
                            <contact.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{contact.name}</h3>
                            <p className="text-muted-foreground truncate">{contact.value}</p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                            {copiedDiscord ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                            <span className="text-sm">{copiedDiscord ? "Скопировано" : "Копировать"}</span>
                          </div>
                        </button>
                      ) : (
                        <a
                          href={contact.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-6 group"
                          data-testid={`contact-${contact.name.toLowerCase()}`}
                        >
                          <div className={`p-4 rounded-xl ${contact.color} shadow-lg ${contact.shadowColor} ${contact.hoverShadow} transition-all group-hover:scale-105`}>
                            <contact.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{contact.name}</h3>
                            <p className="text-muted-foreground truncate">{contact.value}</p>
                          </div>
                          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground text-sm">
                Отвечаю в течение 24 часов
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
