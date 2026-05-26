"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AssessmentPaper } from "@/components/result/assessment-paper";
import { ResultHeader } from "@/components/result/result-header";
import { fetchAssignment, fetchResult } from "@/lib/api";
import { useAssignmentSocket } from "@/hooks/use-assignment-socket";
import type { AssessmentResult, Assignment } from "@/lib/types";

export default function AssignmentResultPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [assignmentData, resultData] = await Promise.all([
        fetchAssignment(assignmentId),
        fetchResult(assignmentId),
      ]);

      if (assignmentData.status !== "completed") {
        router.replace(`/assignments/${assignmentId}`);
        return;
      }

      setAssignment(assignmentData);
      setResult(resultData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load result");
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId, router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useAssignmentSocket({
    assignmentId,
    onStatusChange: (status) => {
      if (status === "processing" || status === "queued") {
        router.push(`/assignments/${assignmentId}`);
      }
      if (status === "completed") {
        void loadData();
      }
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout headerTitle="Create New" backHref="/assignments">
        <p className="py-20 text-center text-sm text-[#6B7280]">
          Loading question paper…
        </p>
      </DashboardLayout>
    );
  }

  if (error || !assignment || !result) {
    return (
      <DashboardLayout headerTitle="Create New" backHref="/assignments">
        <p className="py-20 text-center text-sm text-red-600">
          {error ?? "Result not available yet"}
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout headerTitle="Create New" backHref="/assignments">
      <ResultHeader
        instructions={assignment.instructions}
        pdfUrl={result.pdfUrl}
        onRegenerate={() => router.push("/assignments/create")}
      />
      <AssessmentPaper result={result} assignment={assignment} />
    </DashboardLayout>
  );
}
