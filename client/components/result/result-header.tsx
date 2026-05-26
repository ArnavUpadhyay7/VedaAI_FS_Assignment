"use client";

import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getPdfDownloadUrl } from "@/lib/api";

interface ResultHeaderProps {
  instructions: string;
  onRegenerate: () => void;
  pdfUrl?: string;
}

export function ResultHeader({
  instructions,
  onRegenerate,
  pdfUrl,
}: ResultHeaderProps) {
  function handleDownload() {
    const url = getPdfDownloadUrl(pdfUrl);
    if (!url) {
      toast.error("PDF is not available yet. Please try again shortly.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = "assessment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const preview = instructions.trim().slice(0, 120);

  return (
    <div className="mb-6 rounded-2xl bg-[#1F2937] p-5 text-white sm:p-6">
      <p className="text-sm leading-relaxed text-[#E5E7EB]">
        Certainly! Here is your customized question paper based on your
        requirements: {preview}
        {instructions.length > 120 ? "…" : ""}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10"
          onClick={handleDownload}
        >
          <Download className="size-4" />
          Download as PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10"
          onClick={onRegenerate}
        >
          <RefreshCw className="size-4" />
          Regenerate
        </Button>
      </div>
    </div>
  );
}
