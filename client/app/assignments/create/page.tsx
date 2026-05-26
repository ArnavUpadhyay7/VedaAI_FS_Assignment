"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CreateAssignmentForm } from "@/components/create/create-assignment-form";

export default function CreateAssignmentPage() {
  return (
    <DashboardLayout headerTitle="Assignment" backHref="/assignments">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">
          Create Assignment
        </h1>
        <p className="text-sm text-[#6B7280]">
          Set up a new assignment for your students.
        </p>
      </div>

      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
        <div className="h-full w-1/2 rounded-full bg-[#1F2937]" />
      </div>

      <CreateAssignmentForm />

      <div className="mt-6 text-center lg:hidden">
        <Link href="/assignments" className="text-sm text-[#6B7280] underline">
          Back to assignments
        </Link>
      </div>
    </DashboardLayout>
  );
}
