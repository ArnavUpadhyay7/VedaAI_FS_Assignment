import { format, parseISO } from "date-fns";

export function formatDisplayDate(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd-MM-yyyy");
}

export function formatAssignedDate(value: string): string {
  return formatDisplayDate(value);
}

export function assignmentTitle(instructions: string, maxLength = 42): string {
  const trimmed = instructions.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}

export function totalQuestions(
  questionTypes: { count: number }[]
): number {
  return questionTypes.reduce((sum, item) => sum + item.count, 0);
}

export function totalMarks(
  questionTypes: { count: number; marks: number }[]
): number {
  return questionTypes.reduce((sum, item) => sum + item.count * item.marks, 0);
}
