"use client";

import Link from "next/link";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { assignmentTitle, formatDisplayDate } from "@/lib/format";
import type { Assignment } from "@/lib/types";

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const title = assignmentTitle(assignment.instructions);
  const href =
    assignment.status === "completed"
      ? `/assignments/${assignment._id}/result`
      : `/assignments/${assignment._id}`;

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      <div className="mb-8 flex items-start justify-between gap-3">
        <Link href={href} className="group flex-1">
          <h3 className="text-base font-semibold text-[#111827] group-hover:text-[#F97316]">
            {title}
          </h3>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={href}>View Assignment</Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" disabled>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1 text-xs text-[#6B7280]">
          <p>Assigned on : {formatDisplayDate(assignment.createdAt)}</p>
          <p>Due : {formatDisplayDate(assignment.dueDate)}</p>
        </div>
        <StatusBadge status={assignment.status} />
      </div>
    </article>
  );
}
