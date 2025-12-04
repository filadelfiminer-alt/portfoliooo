import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { PortfolioPDF } from "./PortfolioPDF";
import type { Project, About } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PDFDownloadButtonProps {
  projects: Project[];
  aboutContent?: About | null;
  ownerName?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PDFDownloadButton({
  projects,
  aboutContent,
  ownerName = "Портфолио",
  variant = "outline",
  size = "default",
  className,
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (projects.length === 0) {
      toast({
        title: "Нет проектов для экспорта",
        description: "Сначала добавьте проекты для создания PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const blob = await pdf(
        <PortfolioPDF
          projects={projects}
          aboutContent={aboutContent}
          ownerName={ownerName}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${ownerName.replace(/\s+/g, "_")}_Портфолио.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF создан",
        description: "Портфолио успешно загружено.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF. Попробуйте ещё раз.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isGenerating}
      className={className}
      data-testid="button-download-pdf"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {isGenerating ? "Создание..." : "Скачать PDF"}
    </Button>
  );
}
