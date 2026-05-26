"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AssignmentCard } from "@/components/assignments/assignment-card";
import { AssignmentEmpty } from "@/components/assignments/assignment-empty";
import { AssignmentsToolbar } from "@/components/assignments/assignments-toolbar";
import { StatusDot } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useAssignmentStore } from "@/store/assignment-store";

export default function AssignmentsPage() {
  const loadAssignments = useAssignmentStore((state) => state.loadAssignments);
  const isLoading = useAssignmentStore((state) => state.isLoading);
  const error = useAssignmentStore((state) => state.error);
  const filteredAssignments = useAssignmentStore((state) =>
    state.filteredAssignments()
  );

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const hasAssignments = filteredAssignments.length > 0;
  const showEmpty = !isLoading && !error && filteredAssignments.length === 0;

  return (
    <DashboardLayout headerTitle="Assignment" showBack={false}>
      <div className="lg:rounded-2xl lg:bg-white lg:p-6 lg:shadow-sm lg:ring-1 lg:ring-black/5">
        <div className="mb-6 flex items-start gap-3">
          <StatusDot status="completed" />
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">Assignments</h1>
            <p className="text-sm text-[#6B7280]">
              Manage and create assignments for your classes.
            </p>
          </div>
        </div>

        {!showEmpty && <AssignmentsToolbar />}

        {isLoading && (
          <p className="py-12 text-center text-sm text-[#6B7280]">
            Loading assignments…
          </p>
        )}

        {error && (
          <p className="py-12 text-center text-sm text-red-600">{error}</p>
        )}

        {showEmpty && <AssignmentEmpty />}

        {hasAssignments && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </div>
        )}

        {hasAssignments && (
          <div className="mt-8 flex justify-center pb-4 lg:pb-0">
            <Button
              asChild
              className="h-10 rounded-xl bg-[#1F2937] px-5 text-white hover:bg-[#111827]"
            >
              <Link href="/assignments/create">
                <Plus className="size-4" />
                Create Assignment
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Link
        href="/assignments/create"
        className="fixed right-4 bottom-20 z-30 flex size-12 items-center justify-center rounded-full bg-[#F97316] text-white shadow-lg lg:hidden"
        aria-label="Create assignment"
      >
        <Plus className="size-6" />
      </Link>
    </DashboardLayout>
  );
}
