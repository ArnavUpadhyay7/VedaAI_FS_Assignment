"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { assignmentTitle, formatDisplayDate } from "@/lib/format";
import { useAssignmentStore } from "@/store/assignment-store";
import type { Assignment } from "@/lib/types";

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const removeAssignment = useAssignmentStore((state) => state.removeAssignment);
  const [isDeleting, setIsDeleting] = useState(false);

  const title = assignmentTitle(assignment.instructions);
  const href =
    assignment.status === "completed"
      ? `/assignments/${assignment._id}/result`
      : `/assignments/${assignment._id}`;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await removeAssignment(assignment._id);
      toast.success("Assignment deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete assignment"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      <div className="mb-10 flex items-start justify-between gap-3">
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
            <DropdownMenuItem
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void handleDelete()}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-[#6B7280]">
        <p>Assigned on : {formatDisplayDate(assignment.createdAt)}</p>
        <p>Due : {formatDisplayDate(assignment.dueDate)}</p>
      </div>
    </article>
  );
}
