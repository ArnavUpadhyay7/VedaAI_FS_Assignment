import { Schema, model, type Types } from "mongoose";
import type { AssignmentStatus } from "../types";

export interface IUploadedFile {
  originalName: string;
  path: string;
  mimeType: string;
}

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment {
  _id: Types.ObjectId;
  title?: string;
  dueDate: Date;
  questionTypes: IQuestionType[];
  class: string;
  subject: string;
  instructions: string;
  uploadedFile?: IUploadedFile;
  status: AssignmentStatus;
  resultId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionTypeSchema = new Schema<IQuestionType>(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const uploadedFileSchema = new Schema<IUploadedFile>(
  {
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: false },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [questionTypeSchema], required: true },
    class: { type: String, required: true },
    subject: { type: String, required: true },
    instructions: { type: String, required: true },
    uploadedFile: { type: uploadedFileSchema, required: false },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },
    resultId: { type: Schema.Types.ObjectId, ref: "Result", required: false },
  },
  { timestamps: true }
);

export const Assignment = model<IAssignment>("Assignment", assignmentSchema);
