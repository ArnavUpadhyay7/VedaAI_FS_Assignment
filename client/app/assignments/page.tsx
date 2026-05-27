"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AssignmentCard } from "@/components/assignments/assignment-card";
import { AssignmentEmpty } from "@/components/assignments/assignment-empty";
import { AssignmentsToolbar } from "@/components/assignments/assignments-toolbar";
import { Button } from "@/components/ui/button";
import {
  filterAssignments,
  useAssignmentStore,
} from "@/store/assignment-store";

export default function AssignmentsPage() {
  const loadAssignments = useAssignmentStore((state) => state.loadAssignments);
  const isLoading = useAssignmentStore((state) => state.isLoading);
  const error = useAssignmentStore((state) => state.error);
  const assignments = useAssignmentStore((state) => state.assignments);
  const searchQuery = useAssignmentStore((state) => state.searchQuery);
  const statusFilter = useAssignmentStore((state) => state.statusFilter);
  const dateFilter = useAssignmentStore((state) => state.dateFilter);

  const filteredAssignments = useMemo(
    () => filterAssignments(assignments, searchQuery, statusFilter, dateFilter),
    [assignments, searchQuery, statusFilter, dateFilter]
  );

  const hasAnyAssignments = assignments.length > 0;
  const showEmpty = !isLoading && !error && !hasAnyAssignments;
  const showNoResults =
    !isLoading && !error && hasAnyAssignments && filteredAssignments.length === 0;

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  return (
    <DashboardLayout headerTitle="Assignment" showBack={false}>
      <div className="px-5 py-5 lg:px-6 lg:py-6">
        {hasAnyAssignments && (
          <div className="mb-6 flex items-start gap-2.5">
            <div>
              <h1 className="text-2xl text-[#111827]">Assignments</h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>
        )}

        {hasAnyAssignments && <AssignmentsToolbar />}

        {isLoading && (
          <p className="py-12 text-center text-sm text-[#6B7280]">
            Loading assignments…
          </p>
        )}

        {error && (
          <p className="py-12 text-center text-sm text-red-600">{error}</p>
        )}

        {showEmpty && <AssignmentEmpty />}

        {showNoResults && (
          <p className="py-12 text-center text-sm text-[#6B7280]">
            No assignments match your search or filters.
          </p>
        )}

        {filteredAssignments.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </div>
        )}

        {filteredAssignments.length > 0 && (
          <div className="mt-10 hidden justify-center lg:flex">
            <Button
              asChild
              className="h-10 gap-2 rounded-full bg-[#1C1C1C] px-5 text-sm text-white hover:bg-[#111111]"
            >
              <Link href="/assignments/create">
                <Image
                  src="/create_button_icon.png"
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 object-contain"
                />
                Create Assignment
              </Link>
            </Button>
          </div>
        )}
      </div>

      {hasAnyAssignments && (
        <Link
          href="/assignments/create"
          className="fixed right-4 bottom-20 z-30 flex size-12 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] ring-1 ring-black/5 lg:hidden"
          aria-label="Create assignment"
        >
          <Image
            src="/create_button_icon.png"
            alt=""
            width={20}
            height={20}
            className="size-5 object-contain"
          />
        </Link>
      )}
    </DashboardLayout>
  );
}
