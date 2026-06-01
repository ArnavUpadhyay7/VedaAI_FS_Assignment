"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { assignmentTitle, formatDisplayDate } from "@/lib/format";
import { useAssignmentStore } from "@/store/assignment-store";
import type { Assignment } from "@/lib/types";

interface AssignmentCardProps {
  assignment: Assignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const removeAssignment = useAssignmentStore((state) => state.removeAssignment);
  const renameAssignment = useAssignmentStore((state) => state.renameAssignment);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(
    assignment.title ?? assignmentTitle(assignment.instructions, 48)
  );

  const title = assignment.title ?? assignmentTitle(assignment.instructions, 48);
  const href =
    assignment.status === "completed"
      ? `/assignments/${assignment._id}/result`
      : `/assignments/${assignment._id}`;

  function openRenameDialog() {
    setRenameValue(title);
    setIsRenameOpen(true);
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();

    const nextTitle = renameValue.trim();
    if (!nextTitle) {
      toast.error("Assignment name cannot be empty");
      return;
    }

    setIsRenaming(true);
    try {
      await renameAssignment(assignment._id, nextTitle);
      setIsRenameOpen(false);
      toast.success("Assignment renamed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to rename assignment"
      );
    } finally {
      setIsRenaming(false);
    }
  }

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
    <>
      <article className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="mb-12 flex items-start justify-between gap-2">
          <Link href={href} className="group min-w-0 flex-1 pr-2">
            <h3 className="text-[15px] font-semibold leading-snug text-[#111827] group-hover:text-[#F97316]">
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
              <DropdownMenuItem onSelect={openRenameDialog}>
                <Pencil className="size-4" />
                Rename
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
          <span>
            <span className="font-semibold text-[#111827]">Assigned on</span> :{" "}
            {formatDisplayDate(assignment.createdAt)}
          </span>
          <span className="text-[#111827]">
            <span className="font-semibold">Due</span> :{" "}
            {formatDisplayDate(assignment.dueDate)}
          </span>
        </div>
      </article>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <form onSubmit={(e) => void handleRename(e)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Rename Assignment</DialogTitle>
            </DialogHeader>
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="h-10 rounded-xl border-[#E5E7EB] bg-white"
              autoFocus
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsRenameOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isRenaming}
                className="rounded-xl bg-[#1C1C1C] text-white hover:bg-[#111111]"
              >
                {isRenaming ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
