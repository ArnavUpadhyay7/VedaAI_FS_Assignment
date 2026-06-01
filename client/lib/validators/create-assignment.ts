import { z } from "zod";

export const questionTypeRowSchema = z.object({
  type: z.string().min(1, "Select a question type"),
  count: z.number().int().min(1, "At least 1 question"),
  marks: z.number().min(1, "Marks must be at least 1"),
});

export const createAssignmentSchema = z.object({
  class: z.string().min(1, "Class is required"),
  subject: z.string().min(1, "Subject is required"),
  dueDate: z.date({ message: "Due date is required" }),
  instructions: z
    .string()
    .min(10, "Please add more detail in additional information"),
  questionTypes: z
    .array(questionTypeRowSchema)
    .min(1, "Add at least one question type"),
});

export type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;
