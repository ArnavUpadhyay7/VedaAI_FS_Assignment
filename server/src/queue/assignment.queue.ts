import { Queue } from "bullmq";
import { getBullMqConnection } from "../config/redis";

export const ASSIGNMENT_QUEUE_NAME = "assignment-generation";

export const assignmentQueue = new Queue(ASSIGNMENT_QUEUE_NAME, {
  connection: getBullMqConnection(),
});

export async function enqueueAssignmentJob(assignmentId: string): Promise<void> {
  await assignmentQueue.add(
    "generate",
    { assignmentId },
    {
      attempts: 2,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  );
}
