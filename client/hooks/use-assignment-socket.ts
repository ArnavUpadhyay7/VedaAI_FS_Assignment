"use client";

import { useEffect } from "react";
import { joinAssignmentRoom, subscribeToAssignmentEvents } from "@/lib/socket";
import { useAssignmentStore } from "@/store/assignment-store";
import type { AssignmentStatus } from "@/lib/types";

interface UseAssignmentSocketOptions {
  assignmentId?: string;
  onStatusChange?: (status: AssignmentStatus, resultId?: string) => void;
}

export function useAssignmentSocket({
  assignmentId,
  onStatusChange,
}: UseAssignmentSocketOptions): void {
  const updateAssignmentStatus = useAssignmentStore(
    (state) => state.updateAssignmentStatus
  );

  useEffect(() => {
    const unsubscribe = subscribeToAssignmentEvents({
      onQueued: ({ assignmentId: id }) => {
        updateAssignmentStatus(id, "queued");
        if (id === assignmentId) onStatusChange?.("queued");
      },
      onProcessing: ({ assignmentId: id }) => {
        updateAssignmentStatus(id, "processing");
        if (id === assignmentId) onStatusChange?.("processing");
      },
      onCompleted: ({ assignmentId: id, resultId }) => {
        updateAssignmentStatus(id, "completed", resultId);
        if (id === assignmentId) onStatusChange?.("completed", resultId);
      },
      onFailed: ({ assignmentId: id }) => {
        updateAssignmentStatus(id, "failed");
        if (id === assignmentId) onStatusChange?.("failed");
      },
    });

    return unsubscribe;
  }, [assignmentId, onStatusChange, updateAssignmentStatus]);

  useEffect(() => {
    if (assignmentId) {
      joinAssignmentRoom(assignmentId);
    }
  }, [assignmentId]);
}
