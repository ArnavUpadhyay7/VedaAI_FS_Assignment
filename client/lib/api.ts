import { API_URL } from "./constants";
import type {
  ApiError,
  ApiSuccess,
  AssessmentResult,
  Assignment,
} from "./types";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const json = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || !json.success) {
    const message =
      "message" in json ? json.message : "Something went wrong";
    throw new Error(message);
  }

  return json.data;
}

export function fetchAssignments(): Promise<Assignment[]> {
  return request<Assignment[]>("/api/assignments");
}

export function fetchAssignment(id: string): Promise<Assignment> {
  return request<Assignment>(`/api/assignments/${id}`);
}

export function fetchResult(assignmentId: string): Promise<AssessmentResult> {
  return request<AssessmentResult>(`/api/results/${assignmentId}`);
}

export function createAssignment(formData: FormData): Promise<Assignment> {
  return request<Assignment>("/api/assignments", {
    method: "POST",
    body: formData,
  });
}

export function deleteAssignment(id: string): Promise<{ id: string }> {
  return request<{ id: string }>(`/api/assignments/${id}`, {
    method: "DELETE",
  });
}

export function getPdfDownloadUrl(pdfUrl?: string): string | null {
  if (!pdfUrl) return null;
  if (pdfUrl.startsWith("http")) return pdfUrl;
  return `${API_URL}${pdfUrl.startsWith("/") ? pdfUrl : `/${pdfUrl}`}`;
}
