import { z } from "zod";

const questionTypeSchema = z.object({
  type: z.string().min(1),
  count: z.coerce.number().int().min(1),
  marks: z.coerce.number().min(0),
});

export const createAssignmentSchema = z.object({
  dueDate: z.coerce.date(),
  instructions: z.string().min(1),
  questionTypes: z
    .union([z.string(), z.array(questionTypeSchema)])
    .transform((value, ctx) => {
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value) as unknown;
          const result = z.array(questionTypeSchema).safeParse(parsed);
          if (!result.success) {
            ctx.addIssue({ code: "custom", message: "Invalid questionTypes JSON" });
            return z.NEVER;
          }
          return result.data;
        } catch {
          ctx.addIssue({ code: "custom", message: "questionTypes must be valid JSON" });
          return z.NEVER;
        }
      }
      return value;
    }),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
