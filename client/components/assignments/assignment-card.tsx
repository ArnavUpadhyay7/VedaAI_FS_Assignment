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

  const title = assignmentTitle(assignment.instructions, 48);
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
    <article className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mb-12 flex items-start justify-between gap-2">
        <Link href={href} className="group min-w-0 flex-1 pr-2">
          <h3 className="text-[15px] leading-snug text-[#111827] group-hover:text-[#F97316]">
            {title}
          </h3>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0 text-[#6B7280]">
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

      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <span>Assigned on : {formatDisplayDate(assignment.createdAt)}</span>
        <span className="text-[#111827]">
          Due : {formatDisplayDate(assignment.dueDate)}
        </span>
      </div>
    </article>
  );
}
