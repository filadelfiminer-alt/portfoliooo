import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import {
  CreativeSparkIcon,
  ContactEnvelopeIcon,
  UserProfileIcon,
} from "@/components/CustomIcons";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Send,
  ArrowLeft,
  CheckCircle,
  Mail,
  User,
  MessageSquare,
  Loader2,
} from "lucide-react";
import type { About } from "@shared/schema";

const contactFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const { data: about } = useQuery<About | null>({
    queryKey: ["/api/about"],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте позже.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant="waves" intensity="medium" interactive />

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
                Есть вопрос или хотите сотрудничать? Напишите мне, и я отвечу в ближайшее время.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="glass-card border-green-500/20">
                  <CardContent className="pt-12 pb-12 text-center">
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-3">Сообщение отправлено!</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                      Спасибо за ваше сообщение. Я свяжусь с вами в ближайшее время.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="gap-2" data-testid="button-send-another">
                      <MessageSquare className="h-4 w-4" />
                      Отправить ещё
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="glass-card">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl flex items-center justify-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Отправить сообщение
                  </CardTitle>
                  <CardDescription className="text-base">
                    Заполните форму ниже, и я отвечу как можно скорее.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Имя
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ваше имя"
                                  className="bg-background/50"
                                  {...field}
                                  data-testid="input-contact-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="ваш@email.com"
                                  className="bg-background/50"
                                  {...field}
                                  data-testid="input-contact-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Тема (необязательно)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="О чём ваше сообщение?"
                                className="bg-background/50"
                                {...field}
                                data-testid="input-contact-subject"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              Сообщение
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Расскажите о вашем проекте или идее..."
                                rows={6}
                                className="bg-background/50 resize-none"
                                {...field}
                                data-testid="input-contact-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full glass-button text-primary-foreground gap-2"
                        size="lg"
                        disabled={submitMutation.isPending}
                        data-testid="button-submit-contact"
                      >
                        {submitMutation.isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Отправить сообщение
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
