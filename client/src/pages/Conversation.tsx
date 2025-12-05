import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Send,
  ArrowLeft,
  MessageSquare,
  Loader2,
  User,
  Clock,
  CheckCircle,
  Shield,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ConversationReply {
  id: string;
  authorType: 'user' | 'admin';
  content: string;
  createdAt: string;
}

interface ConversationData {
  name: string;
  subject: string | null;
  originalMessage: string;
  hasReply: boolean;
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  replies: ConversationReply[];
  canReply: boolean;
  replyBlockedReason?: string;
}

export default function ConversationPage() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [replyText, setReplyText] = useState("");

  const { data: conversation, isLoading, error } = useQuery<ConversationData>({
    queryKey: ["/api/conversation", token],
    queryFn: async () => {
      const res = await fetch(`/api/conversation/${token}`);
      if (!res.ok) throw new Error("Conversation not found");
      return res.json();
    },
    enabled: !!token,
  });

  const replyMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", `/api/conversation/${token}/reply`, { message });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Не удалось отправить ответ");
      }
      return res;
    },
    onSuccess: () => {
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversation", token] });
      toast({
        title: "Отправлено",
        description: "Ваш ответ отправлен",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      replyMutation.mutate(replyText.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Беседа не найдена</h2>
              <p className="text-muted-foreground mb-4">
                Возможно, ссылка устарела или была удалена.
              </p>
              <Link href="/contact">
                <Button>Написать новое сообщение</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4" />
                На главную
              </Button>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Ваша беседа</h1>
              <p className="text-muted-foreground">
                {conversation.subject || "Без темы"}
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{conversation.name}</span>
                  <span className="mx-2">-</span>
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(conversation.createdAt), "d MMM yyyy, HH:mm", { locale: ru })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Ваше сообщение:</p>
                  <p className="whitespace-pre-wrap">{conversation.originalMessage}</p>
                </div>

                {conversation.adminReply && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 ml-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Ответ от автора:
                      </p>
                      {conversation.repliedAt && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {format(new Date(conversation.repliedAt), "d MMM, HH:mm", { locale: ru })}
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{conversation.adminReply}</p>
                  </div>
                )}

                {conversation.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${
                      reply.authorType === 'user'
                        ? "bg-primary/10 border border-primary/20 mr-8"
                        : "bg-green-500/10 border border-green-500/20 ml-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {reply.authorType === 'user' ? (
                        <>
                          <User className="h-4 w-4 text-primary" />
                          <p className="text-sm font-medium text-primary">Вы:</p>
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 text-green-500" />
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">Автор:</p>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {format(new Date(reply.createdAt), "d MMM, HH:mm", { locale: ru })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {conversation.hasReply && conversation.canReply && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Ответить
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Напишите ваш ответ..."
                      rows={4}
                      maxLength={2000}
                      className="resize-none"
                      data-testid="input-conversation-reply"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {replyText.length}/2000 символов
                      </span>
                      <Button
                        type="submit"
                        disabled={!replyText.trim() || replyMutation.isPending}
                        className="gap-2"
                        data-testid="button-send-conversation-reply"
                      >
                        {replyMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Отправить
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {conversation.hasReply && !conversation.canReply && conversation.replyBlockedReason && (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>{conversation.replyBlockedReason}</p>
                </CardContent>
              </Card>
            )}

            {!conversation.hasReply && (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>Ожидание ответа от автора...</p>
                  <p className="text-sm mt-1">Вы получите возможность ответить после получения ответа.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
