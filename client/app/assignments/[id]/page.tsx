"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GenerationStatus } from "@/components/assignments/generation-status";
import { fetchAssignment } from "@/lib/api";
import { useAssignmentSocket } from "@/hooks/use-assignment-socket";
import { joinAssignmentRoom } from "@/lib/socket";
import type { Assignment, AssignmentStatus } from "@/lib/types";

export default function AssignmentStatusPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [status, setStatus] = useState<AssignmentStatus>("queued");
  const [isLoading, setIsLoading] = useState(true);

  const loadAssignment = useCallback(async () => {
    try {
      const data = await fetchAssignment(assignmentId);
      setAssignment(data);
      setStatus(data.status);

      if (data.status === "completed") {
        router.replace(`/assignments/${assignmentId}/result`);
      }
    } catch {
      setAssignment(null);
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId, router]);

  useEffect(() => {
    joinAssignmentRoom(assignmentId);
    const t = window.setTimeout(() => {
      void loadAssignment();
    }, 0);
    return () => window.clearTimeout(t);
  }, [assignmentId, loadAssignment]);

  useAssignmentSocket({
    assignmentId,
    onStatusChange: (nextStatus, resultId) => {
      setStatus(nextStatus);
      setAssignment((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              ...(resultId ? { resultId } : {}),
            }
          : prev
      );

      if (nextStatus === "completed") {
        router.push(`/assignments/${assignmentId}/result`);
      }
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout headerTitle="Assignment" backHref="/assignments">
        <p className="py-20 text-center text-sm text-[#6B7280]">Loading…</p>
      </DashboardLayout>
    );
  }

  if (!assignment) {
    return (
      <DashboardLayout headerTitle="Assignment" backHref="/assignments">
        <p className="py-20 text-center text-sm text-red-600">
          Assignment not found
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout headerTitle="Assignment" backHref="/assignments">
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-5 py-8">
        <GenerationStatus
          status={status}
          assignmentId={assignmentId}
          onRegenerate={() => router.push("/assignments/create")}
        />
      </div>
    </DashboardLayout>
  );
}
