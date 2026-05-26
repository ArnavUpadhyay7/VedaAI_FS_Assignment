import { z } from "zod";

const questionSchema = z
  .object({
    text: z.string().min(1),
    difficulty: z.string().min(1),
    marks: z.number().min(0),
    options: z.array(z.string().min(1)).min(2).optional(),
  })
  .superRefine((question, ctx) => {
    if (question.options && question.options.length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "MCQ questions must include at least 2 options",
        path: ["options"],
      });
    }
  });

const sectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(questionSchema).min(1),
});

export const aiOutputSchema = z.object({
  sections: z.array(sectionSchema).min(1),
});

export type ValidatedAiOutput = z.infer<typeof aiOutputSchema>;
