import fs from "fs";
import { Worker } from "bullmq";
import { env } from "../config/env";
import { ASSIGNMENT_QUEUE_NAME } from "../queue/assignment.queue";
import { Assignment } from "../models/Assignment";
import { buildAssessmentPrompt } from "../services/prompt.service";
import { generateAssessment } from "../services/openRouter.service";
import { createResult } from "../services/result.service";
import { updateAssignmentStatus } from "../services/assignment.service";
import { emitAssignmentEvent } from "../socket/index";

function cleanupUploadedFile(filePath?: string): void {
  if (!filePath) return;
  fs.unlink(filePath, () => undefined);
}

export function startAssignmentWorker(): Worker {
  const worker = new Worker(
    ASSIGNMENT_QUEUE_NAME,
    async (job) => {
      const { assignmentId } = job.data as { assignmentId: string };

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error("Assignment not found");
      }

      await updateAssignmentStatus(assignmentId, "processing");
      emitAssignmentEvent("assignment:processing", assignmentId);

      const prompt = buildAssessmentPrompt(assignment);
      const aiOutput = await generateAssessment(prompt);
      const result = await createResult(assignmentId, aiOutput);

      await updateAssignmentStatus(assignmentId, "completed", result._id.toString());
      cleanupUploadedFile(assignment.uploadedFile?.path);

      emitAssignmentEvent("assignment:completed", assignmentId, {
        resultId: result._id.toString(),
      });
    },
    { connection: { url: env.REDIS_URL } }
  );

  worker.on("failed", async (job, err) => {
    const assignmentId = job?.data?.assignmentId as string | undefined;
    if (!assignmentId) return;

    console.error(`Assignment job failed [${assignmentId}]:`, err.message);

    const assignment = await Assignment.findById(assignmentId);
    await updateAssignmentStatus(assignmentId, "failed");
    cleanupUploadedFile(assignment?.uploadedFile?.path);

    emitAssignmentEvent("assignment:failed", assignmentId, {
      message: err.message,
    });
  });

  return worker;
}
