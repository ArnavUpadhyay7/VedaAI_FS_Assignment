"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Mic, Plus } from "lucide-react";
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
    dueDate,
    instructions,
    questionTypes,
    file,
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
      formData.append("dueDate", parsed.data.dueDate.toISOString());
      formData.append("instructions", parsed.data.instructions);
      formData.append(
        "questionTypes",
        JSON.stringify(parsed.data.questionTypes)
      );
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
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#111827]">
            Assignment Details
          </h2>
          <p className="text-sm text-[#6B7280]">
            Basic information about your assignment.
          </p>
        </div>

        <div className="space-y-6">
          <FileUploadZone
            file={file}
            onFileChange={setFile}
            error={fieldErrors.file}
          />

          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 block text-sm font-medium text-[#374151]"
            >
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
              className="h-10 rounded-xl border-[#E5E7EB] bg-white"
            />
            {fieldErrors.dueDate && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.dueDate}</p>
            )}
          </div>

          <div>
            <div className="mb-3 hidden grid-cols-[1fr_auto_140px_140px] gap-3 text-xs font-medium text-[#6B7280] lg:grid">
              <span>Question Type</span>
              <span />
              <span>No. of Questions</span>
              <span>Marks</span>
            </div>

            <div className="space-y-4">
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

            <Button
              type="button"
              variant="outline"
              className="mt-4 rounded-full"
              onClick={addQuestionType}
            >
              <Plus className="size-4" />
              Add Question Type
            </Button>

            <div className="mt-4 flex justify-end gap-6 text-sm text-[#6B7280]">
              <span>Total Questions: {questionsTotal}</span>
              <span>Total Marks: {marksTotal}</span>
            </div>
            {fieldErrors.questionTypes && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.questionTypes}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Generate a question paper for 3 hour exam duration for CBSE Grade 8 Science..."
                className="min-h-32 rounded-xl border-[#E5E7EB] pr-10"
              />
              <Mic className="pointer-events-none absolute right-3 bottom-3 size-4 text-[#9CA3AF]" />
            </div>
            {fieldErrors.instructions && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.instructions}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
          onClick={() => router.push("/assignments")}
        >
          ← Previous
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-xl bg-[#1F2937] px-6 text-white hover:bg-[#111827]"
        >
          {isSubmitting ? "Creating…" : "Next →"}
        </Button>
      </div>
    </form>
  );
}
