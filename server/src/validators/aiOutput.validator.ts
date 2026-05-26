import { z } from "zod";

const questionSchema = z.object({
  text: z.string().min(1),
  difficulty: z.string().min(1),
  marks: z.number().min(0),
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
