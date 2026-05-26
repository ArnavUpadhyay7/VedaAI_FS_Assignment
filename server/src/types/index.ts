export type AssignmentStatus = "queued" | "processing" | "completed" | "failed";

export interface QuestionTypeInput {
  type: string;
  count: number;
  marks: number;
}

export interface QuestionOutput {
  text: string;
  difficulty: string;
  marks: number;
  options?: string[];
}

export interface SectionOutput {
  title: string;
  instruction: string;
  questions: QuestionOutput[];
}

export interface AiAssessmentOutput {
  sections: SectionOutput[];
}
