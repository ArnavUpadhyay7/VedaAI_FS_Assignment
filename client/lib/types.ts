export type AssignmentStatus = "queued" | "processing" | "completed" | "failed";

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface UploadedFile {
  originalName: string;
  path: string;
  mimeType: string;
}

export interface Assignment {
  _id: string;
  dueDate: string;
  questionTypes: QuestionType[];
  instructions: string;
  uploadedFile?: UploadedFile;
  status: AssignmentStatus;
  resultId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  text: string;
  difficulty: string;
  marks: number;
}

export interface AssessmentSection {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface AssessmentResult {
  _id: string;
  assignmentId: string;
  sections: AssessmentSection[];
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

export type SocketAssignmentEvent =
  | "assignment:queued"
  | "assignment:processing"
  | "assignment:completed"
  | "assignment:failed";

export interface SocketPayload {
  assignmentId: string;
  resultId?: string;
  message?: string;
}
