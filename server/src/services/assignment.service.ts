import fs from "fs";
import { Assignment } from "../models/Assignment";
import type { CreateAssignmentInput } from "../validators/assignment.validator";
import type { IUploadedFile } from "../models/Assignment";
import { deleteResultByAssignmentId } from "./result.service";
import { deletePdfForAssignment } from "./pdf.service";

interface CreateAssignmentParams extends CreateAssignmentInput {
  uploadedFile?: IUploadedFile;
}

export async function createAssignment(params: CreateAssignmentParams) {
  return Assignment.create({
    class: params.class,
    subject: params.subject,
    dueDate: params.dueDate,
    instructions: params.instructions,
    questionTypes: params.questionTypes,
    uploadedFile: params.uploadedFile,
    status: "queued",
  });
}

export async function listAssignments() {
  return Assignment.find().sort({ createdAt: -1 });
}

export async function getAssignmentById(id: string) {
  return Assignment.findById(id);
}

export async function renameAssignment(id: string, title: string) {
  return Assignment.findByIdAndUpdate(
    id,
    { title },
    { returnDocument: "after" }
  );
}

export async function updateAssignmentStatus(
  id: string,
  status: "queued" | "processing" | "completed" | "failed",
  resultId?: string
) {
  return Assignment.findByIdAndUpdate(
    id,
    { status, ...(resultId ? { resultId } : {}) },
    { returnDocument: "after" }
  );
}

export async function deleteAssignment(id: string) {
  const assignment = await Assignment.findById(id);
  if (!assignment) return null;

  if (assignment.uploadedFile?.path && fs.existsSync(assignment.uploadedFile.path)) {
    fs.unlinkSync(assignment.uploadedFile.path);
  }

  deletePdfForAssignment(id);
  await deleteResultByAssignmentId(id);
  await Assignment.findByIdAndDelete(id);

  return assignment;
}
