"use client";

import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AssignmentStatus } from "@/lib/types";

const progressByStatus: Record<AssignmentStatus, number> = {
  queued: 20,
  processing: 65,
  completed: 100,
  failed: 0,
};

const messages: Record<AssignmentStatus, string> = {
  queued: "Your assignment is queued. We'll start generating shortly.",
  processing: "AI is building your question paper. This usually takes a few seconds.",
  completed: "Your assessment is ready to view.",
  failed: "Something went wrong while generating. Please try again.",
};

interface GenerationStatusProps {
  status: AssignmentStatus;
  assignmentId: string;
  onRegenerate?: () => void;
}

export function GenerationStatus({
  status,
  assignmentId,
  onRegenerate,
}: GenerationStatusProps) {
  const isLoading = status === "queued" || status === "processing";

  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
      {isLoading && (
        <Loader2 className="mx-auto mb-4 size-10 animate-spin text-[#F97316]" />
      )}
      <div className="mb-4 flex justify-center">
        <StatusBadge status={status} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-[#111827]">
        {status === "completed"
          ? "Generation complete"
          : status === "failed"
            ? "Generation failed"
            : "Generating assessment"}
      </h2>
      <p className="mb-6 text-sm text-[#6B7280]">{messages[status]}</p>

      {isLoading && (
        <Progress value={progressByStatus[status]} className="mb-6 h-2" />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {status === "completed" && (
          <Button asChild className="rounded-xl bg-[#1F2937]">
            <Link href={`/assignments/${assignmentId}/result`}>
              View Question Paper
            </Link>
          </Button>
        )}
        {status === "failed" && (
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={onRegenerate}
            >
              <RefreshCw className="size-4" />
              Regenerate
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/assignments/create">Create New</Link>
            </Button>
          </>
        )}
        {isLoading && (
          <Button variant="outline" disabled className="rounded-xl">
            Please wait…
          </Button>
        )}
      </div>
    </div>
  );
}
