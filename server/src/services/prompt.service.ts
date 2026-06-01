import fs from "fs";
import type { IAssignment } from "../models/Assignment";

function readUploadedContent(filePath: string, mimeType: string): string {
  if (mimeType === "application/pdf") {
    return "[PDF uploaded — use assignment instructions and question requirements as primary context]";
  }

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "[Could not read uploaded file]";
  }
}

function isMcqType(type: string): boolean {
  return type.toLowerCase().includes("multiple choice");
}

export function buildAssessmentPrompt(assignment: IAssignment): string {
  const questionSummary = assignment.questionTypes
    .map((q) => {
      const mcqNote = isMcqType(q.type)
        ? " (each question must include exactly 4 options labeled A–D)"
        : "";
      return `- ${q.count} ${q.type} question(s), ${q.marks} marks each${mcqNote}`;
    })
    .join("\n");

  const fileSection = assignment.uploadedFile
    ? `\nReference material:\n${readUploadedContent(
        assignment.uploadedFile.path,
        assignment.uploadedFile.mimeType
      )}`
    : "";

  return `Create an academic assessment with the following requirements.

Due date: ${assignment.dueDate.toISOString()}
Class: ${assignment.class}
Subject: ${assignment.subject}
Instructions: ${assignment.instructions}

Question requirements:
${questionSummary}
${fileSection}

Return JSON in exactly this shape:
{
  "sections": [
    {
      "title": "string",
      "instruction": "string",
      "questions": [
        {
          "text": "string",
          "difficulty": "easy | medium | hard",
          "marks": number,
          "options": ["option A text", "option B text", "option C text", "option D text"]
        }
      ]
    }
  ]
}

Rules:
- Create one section per question type listed above.
- Each section must contain exactly the requested number of questions for that type.
- Use the marks specified for each question type.
- Use the provided class and subject as core context for syllabus level, terminology, and question difficulty, even when the instructions are brief.
- For Multiple Choice Questions, every question MUST include an "options" array with exactly 4 distinct answer choices.
- For non-MCQ question types, omit the "options" field entirely.
- Questions must be clear, unique, and aligned with the instructions.
- Do not include any keys outside the schema.`;
}
