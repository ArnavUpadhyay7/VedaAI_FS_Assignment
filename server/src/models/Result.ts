import { Schema, model, type Types } from "mongoose";

export interface IQuestion {
  text: string;
  difficulty: string;
  marks: number;
  options?: string[];
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IResult {
  _id: Types.ObjectId;
  assignmentId: Types.ObjectId;
  sections: ISection[];
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    difficulty: { type: String, required: true },
    marks: { type: Number, required: true, min: 0 },
    options: { type: [String], required: false },
  },
  { _id: false }
);

const sectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { _id: false }
);

const resultSchema = new Schema<IResult>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      unique: true,
    },
    sections: { type: [sectionSchema], required: true },
    pdfUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export const Result = model<IResult>("Result", resultSchema);
