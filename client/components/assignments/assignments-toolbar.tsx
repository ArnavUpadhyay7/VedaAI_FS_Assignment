"use client";

import { Filter, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAssignmentStore,
  type DateFilter,
  type StatusFilter,
} from "@/store/assignment-store";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Generating" },
  { value: "queued", label: "Queued" },
  { value: "failed", label: "Failed" },
];

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All dates" },
  { value: "upcoming", label: "Upcoming due dates" },
  { value: "past", label: "Past due dates" },
];

export function AssignmentsToolbar() {
  const searchQuery = useAssignmentStore((state) => state.searchQuery);
  const statusFilter = useAssignmentStore((state) => state.statusFilter);
  const dateFilter = useAssignmentStore((state) => state.dateFilter);
  const setSearchQuery = useAssignmentStore((state) => state.setSearchQuery);
  const setStatusFilter = useAssignmentStore((state) => state.setStatusFilter);
  const setDateFilter = useAssignmentStore((state) => state.setDateFilter);
  const clearFilters = useAssignmentStore((state) => state.clearFilters);

  const hasActiveFilters =
    searchQuery.trim() !== "" || statusFilter !== "all" || dateFilter !== "all";

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 shrink-0 gap-2 rounded-xl border-[#E5E7EB] bg-white px-4 text-sm text-[#111827]"
          >
            <Filter className="size-4 text-[#6B7280]" />
            Filter By
            {hasActiveFilters && (
              <span className="size-2 rounded-full bg-[#F97316]" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Due date</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={dateFilter}
            onValueChange={(value) => setDateFilter(value as DateFilter)}
          >
            {DATE_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          {hasActiveFilters && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={clearFilters}
              >
                <X className="size-4" />
                Clear filters
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9CA3AF]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Assignment"
          className="h-10 w-full rounded-xl border-[#E5E7EB] bg-white pl-9 text-sm"
        />
      </div>
    </div>
  );
}
