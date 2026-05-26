import Link from "next/link";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssignmentEmpty() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-black/5">
      <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-[#F3F4F6]">
        <FileSearch className="size-14 text-[#9CA3AF]" strokeWidth={1.25} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-[#111827]">
        No assignments yet
      </h2>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-[#6B7280]">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let
        AI assist with grading.
      </p>
      <Button
        asChild
        className="h-10 rounded-xl bg-[#1F2937] px-5 text-white hover:bg-[#111827]"
      >
        <Link href="/assignments/create">+ Create Your First Assignment</Link>
      </Button>
    </div>
  );
}
