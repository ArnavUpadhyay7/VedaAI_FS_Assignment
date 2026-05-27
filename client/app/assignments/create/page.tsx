"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CreateAssignmentForm } from "@/components/create/create-assignment-form";

export default function CreateAssignmentPage() {
  return (
    <DashboardLayout headerTitle="Assignment" backHref="/assignments">
      <div
        className="px-5 py-5 lg:px-6 lg:py-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        <div className="mb-5 flex items-start gap-2.5">
          <div>
            <h1 className="text-2xl text-[#111827]">Create Assignment</h1>
            <p className="mt-0.5 text-sm text-[#6B7280]">
              Set up a new assignment for your students.
            </p>
          </div>
        </div>

        <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
          <div className="h-full w-1/2 rounded-full bg-[#1C1C1C]" />
        </div>

        <CreateAssignmentForm />

        <div className="mt-6 text-center lg:hidden">
          <Link href="/assignments" className="text-sm text-[#6B7280] underline">
            Back to assignments
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}