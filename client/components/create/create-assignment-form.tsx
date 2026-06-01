"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadZone } from "./file-upload-zone";
import { QuestionTypeRowComponent } from "./question-type-row";
import { createAssignment } from "@/lib/api";
import { totalMarks, totalQuestions } from "@/lib/format";
import { createAssignmentSchema } from "@/lib/validators/create-assignment";
import { useCreateFormStore } from "@/store/create-form-store";
import { useAssignmentStore } from "@/store/assignment-store";
import { joinAssignmentRoom } from "@/lib/socket";

export function CreateAssignmentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const {
    className,
    subject,
    dueDate,
    instructions,
    questionTypes,
    file,
    setClassName,
    setSubject,
    setDueDate,
    setInstructions,
    setFile,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    reset,
  } = useCreateFormStore();

  const upsertAssignment = useAssignmentStore((state) => state.upsertAssignment);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const parsed = createAssignmentSchema.safeParse({
      class: className,
      subject,
      dueDate,
      instructions,
      questionTypes: questionTypes.map(({ type, count, marks }) => ({
        type,
        count,
        marks,
      })),
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        errors[key] = issue.message;
      }
      setFieldErrors(errors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("class", parsed.data.class);
      formData.append("subject", parsed.data.subject);
      formData.append("dueDate", parsed.data.dueDate.toISOString());
      formData.append("instructions", parsed.data.instructions);
      formData.append("questionTypes", JSON.stringify(parsed.data.questionTypes));
      if (file) formData.append("file", file);

      const assignment = await createAssignment(formData);
      upsertAssignment(assignment);
      joinAssignmentRoom(assignment._id);
      reset();
      toast.success("Assignment created — generating questions…");
      router.push(`/assignments/${assignment._id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create assignment"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const questionsTotal = totalQuestions(questionTypes);
  const marksTotal = totalMarks(questionTypes);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg text-[#111827]">Assignment Details</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Basic information about your assignment.
          </p>
        </div>

        <div className="space-y-6">
          <FileUploadZone
            file={file}
            onFileChange={setFile}
            error={fieldErrors.file}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="class" className="mb-2 block text-sm text-[#374151]">
                Class
              </label>
              <Input
                id="class"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. 10"
                className="h-10 rounded-xl border-[#E5E7EB] bg-white"
              />
              {fieldErrors.class && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.class}</p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm text-[#374151]">
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="h-10 rounded-xl border-[#E5E7EB] bg-white"
              />
              {fieldErrors.subject && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.subject}</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="mb-2 block text-sm text-[#374151]">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate ? format(dueDate, "yyyy-MM-dd") : ""}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => {
                const value = e.target.value;
                setDueDate(value ? new Date(`${value}T00:00:00`) : undefined);
              }}
              className="h-10 rounded-xl border-[#E5E7EB] bg-white text-center"
            />
            {fieldErrors.dueDate && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.dueDate}</p>
            )}
          </div>

          {/* Question Types */}
          <div>
            {/* Desktop column headers */}
            <div className="mb-3 hidden gap-3 text-xs text-[#6B7280] lg:grid lg:grid-cols-[1fr_28px_140px_140px]">
              <span>Question Type</span>
              <span />
              <span>No. of Questions</span>
              <span>Marks</span>
            </div>

            {/* Mobile section label */}
            <p className="mb-3 text-sm font-semibold text-[#111827] lg:hidden">
              Question Type
            </p>

            <div className="space-y-3">
              {questionTypes.map((row) => (
                <QuestionTypeRowComponent
                  key={row.id}
                  row={row}
                  canRemove={questionTypes.length > 1}
                  onUpdate={(patch) => updateQuestionType(row.id, patch)}
                  onRemove={() => removeQuestionType(row.id)}
                />
              ))}
            </div>

            {/* Add Question Type */}
            <button
              type="button"
              className="mt-4 flex items-center gap-2 text-sm text-[#111827] cursor-pointer"
              onClick={addQuestionType}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-[#1C1C1C] text-white">
                <Plus className="size-3.5" />
              </span>
              Add Question Type
            </button>

            {/* Totals — stacked on mobile, inline on desktop */}
            <div className="mt-4 flex flex-col items-end gap-1 text-sm text-[#6B7280] lg:flex-row lg:justify-end lg:gap-6">
              <span>Total Questions: {questionsTotal}</span>
              <span>Total Marks: {marksTotal}</span>
            </div>

            {fieldErrors.questionTypes && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.questionTypes}</p>
            )}
          </div>

          {/* Additional Information */}
          <div>
            <label className="mb-2 block text-sm text-[#374151]">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="min-h-32 resize-none rounded-xl border-[#E5E7EB] bg-white pb-10 pr-10 text-sm"
              />
            </div>
            {fieldErrors.instructions && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.instructions}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl border-[#E5E7EB] bg-white px-5 cursor-pointer"
          onClick={() => router.push("/assignments")}
        >
          ← Previous
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-xl bg-[#1C1C1C] px-6 text-white hover:bg-[#111111] cursor-pointer"
        >
          {isSubmitting ? "Creating…" : "Next →"}
        </Button>
      </div>
    </form>
  );
}
