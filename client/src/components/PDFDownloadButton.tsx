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
  ownerName = "Portfolio",
  variant = "outline",
  size = "default",
  className,
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (projects.length === 0) {
      toast({
        title: "No projects to export",
        description: "Add some projects first to generate a PDF.",
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
      link.download = `${ownerName.replace(/\s+/g, "_")}_Portfolio.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Generated",
        description: "Your portfolio PDF has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
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
      {isGenerating ? "Generating..." : "Export PDF"}
    </Button>
  );
}
