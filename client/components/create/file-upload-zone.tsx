"use client";

import { useRef } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
];

export function FileUploadZone({
  file,
  onFileChange,
  error,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(selected: FileList | null) {
    const next = selected?.[0];
    if (!next) return;

    if (!ACCEPTED_TYPES.includes(next.type)) {
      onFileChange(null);
      return;
    }

    onFileChange(next);
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-[#FAFAFA] px-6 py-12 text-center transition-colors hover:border-[#9CA3AF]",
          error && "border-red-300"
        )}
      >
        <CloudUpload className="mb-4 size-10 text-[#9CA3AF]" strokeWidth={1.5} />
        <p className="text-sm text-[#111827]">
          Choose a file or drag & drop it here
        </p>
        <p className="mt-1 text-xs text-[#6B7280]">
          PDF or text files, up to 10MB
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 h-9 rounded-lg border-[#E5E7EB] bg-white px-4 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse Files
        </Button>
        {file && (
          <p className="mt-3 text-xs text-[#F97316]">{file.name}</p>
        )}
      </div>
      <p className="mt-2 text-xs text-[#6B7280]">
        Upload images of your preferred document/image
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md,text/plain,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
