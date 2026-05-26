"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAssignmentStore } from "@/store/assignment-store";

export function AssignmentsToolbar() {
  const searchQuery = useAssignmentStore((state) => state.searchQuery);
  const setSearchQuery = useAssignmentStore((state) => state.setSearchQuery);

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        variant="outline"
        className="h-10 w-fit rounded-xl border-[#E5E7EB] bg-white"
      >
        <Filter className="size-4" />
        Filter By
      </Button>
      <div className="relative w-full sm:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9CA3AF]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Assignment"
          className="h-10 rounded-xl border-[#E5E7EB] bg-white pl-9"
        />
      </div>
    </div>
  );
}
