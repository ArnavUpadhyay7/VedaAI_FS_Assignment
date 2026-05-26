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

export function buildAssessmentPrompt(assignment: IAssignment): string {
  const questionSummary = assignment.questionTypes
    .map((q) => `- ${q.count} ${q.type} question(s), ${q.marks} marks each`)
    .join("\n");

  const fileSection = assignment.uploadedFile
    ? `\nReference material:\n${readUploadedContent(
        assignment.uploadedFile.path,
        assignment.uploadedFile.mimeType
      )}`
    : "";

  return `Create an academic assessment with the following requirements.

Due date: ${assignment.dueDate.toISOString()}
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
          "marks": number
        }
      ]
    }
  ]
}

Rules:
- Create one section per question type listed above.
- Each section must contain exactly the requested number of questions for that type.
- Use the marks specified for each question type.
- Questions must be clear, unique, and aligned with the instructions.
- Do not include any keys outside the schema.`;
}
