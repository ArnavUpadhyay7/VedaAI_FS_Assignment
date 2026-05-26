import { Result } from "../models/Result";
import type { ValidatedAiOutput } from "../validators/aiOutput.validator";

export async function createResult(assignmentId: string, output: ValidatedAiOutput) {
  return Result.create({
    assignmentId,
    sections: output.sections,
  });
}

export async function getResultByAssignmentId(assignmentId: string) {
  return Result.findOne({ assignmentId });
}

export async function updateResultPdfUrl(resultId: string, pdfUrl: string) {
  return Result.findByIdAndUpdate(resultId, { pdfUrl }, { returnDocument: "after" });
}

export async function deleteResultByAssignmentId(assignmentId: string) {
  return Result.deleteOne({ assignmentId });
}
