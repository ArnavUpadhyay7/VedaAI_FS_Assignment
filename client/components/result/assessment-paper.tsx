import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { SCHOOL_NAME } from "@/lib/constants";
import { totalMarks, totalQuestions } from "@/lib/format";
import type { AssessmentResult, Assignment } from "@/lib/types";

interface AssessmentPaperProps {
  result: AssessmentResult;
  assignment: Assignment;
}

export function AssessmentPaper({ result, assignment }: AssessmentPaperProps) {
  const maxMarks = totalMarks(assignment.questionTypes);
  const questionCount = totalQuestions(assignment.questionTypes);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-10">
      <header className="border-b border-[#E5E7EB] pb-6 text-center">
        <h1 className="text-xl font-bold text-[#111827] sm:text-2xl">
          {SCHOOL_NAME}
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          AI Generated Assessment
        </p>
      </header>

      <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-[#374151]">
        <span>Time Allowed: Based on {questionCount} questions</span>
        <span className="font-semibold">Maximum Marks: {maxMarks}</span>
      </div>

      <p className="mt-4 text-sm italic text-[#6B7280]">
        All questions are compulsory unless stated otherwise.
      </p>

      <section className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <label className="flex items-center gap-2">
            Name:
            <span className="h-6 flex-1 border-b border-[#9CA3AF]" />
          </label>
          <label className="flex items-center gap-2">
            Roll Number:
            <span className="h-6 flex-1 border-b border-[#9CA3AF]" />
          </label>
          <label className="flex items-center gap-2">
            Section:
            <span className="h-6 flex-1 border-b border-[#9CA3AF]" />
          </label>
        </div>
      </section>

      {result.sections.map((section, sectionIndex) => (
        <section key={section.title} className="mt-8">
          <h2 className="text-center text-lg font-bold text-[#111827]">
            {section.title || `Section ${String.fromCharCode(65 + sectionIndex)}`}
          </h2>
          <p className="mt-2 text-center text-sm italic text-[#6B7280]">
            {section.instruction}
          </p>

          <ol className="mt-6 space-y-5">
            {section.questions.map((question, index) => (
              <li
                key={`${section.title}-${index}`}
                className="flex flex-wrap items-start gap-2 text-sm leading-relaxed text-[#111827]"
              >
                <span className="font-semibold">{index + 1}.</span>
                <DifficultyBadge difficulty={question.difficulty} />
                <span className="flex-1">{question.text}</span>
                <span className="ml-auto shrink-0 font-medium text-[#6B7280]">
                  [{question.marks} Marks]
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="mt-10 text-center text-base font-bold text-[#111827]">
        End of Question Paper
      </p>
    </div>
  );
}
