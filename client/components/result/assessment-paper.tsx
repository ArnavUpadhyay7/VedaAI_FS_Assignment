import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { SCHOOL_NAME } from "@/lib/constants";
import { totalMarks, totalQuestions } from "@/lib/format";
import type { AssessmentResult, Assignment, Question } from "@/lib/types";

interface AssessmentPaperProps {
  result: AssessmentResult;
  assignment: Assignment;
}

function optionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

function QuestionItem({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  return (
    <li className="border-b border-[#F3F4F6] pb-5 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
            <span className="text-base font-semibold text-[#111827]">
              {index + 1}.
            </span>
            <DifficultyBadge difficulty={question.difficulty} />
          </div>
          <p className="text-sm leading-7 text-[#111827] sm:text-[15px]">
            {question.text}
          </p>
          {question.options && question.options.length > 0 && (
            <ul className="mt-3 space-y-2 pl-1">
              {question.options.map((option, optIndex) => (
                <li
                  key={`${index}-opt-${optIndex}`}
                  className="flex gap-2 text-sm leading-6 text-[#374151]"
                >
                  <span className="font-semibold text-[#111827]">
                    {optionLabel(optIndex)})
                  </span>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="shrink-0 text-sm font-medium text-[#6B7280] sm:pt-1 sm:text-right">
          [{question.marks} Marks]
        </p>
      </div>
    </li>
  );
}

export function AssessmentPaper({ result, assignment }: AssessmentPaperProps) {
  const maxMarks = totalMarks(assignment.questionTypes);
  const questionCount = totalQuestions(assignment.questionTypes);

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-8 md:p-10">
      <header className="border-b border-[#E5E7EB] pb-6 text-center">
        <h1 className="text-lg font-bold tracking-tight text-[#111827] sm:text-2xl">
          {SCHOOL_NAME}
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">AI Generated Assessment</p>
      </header>

      <div className="mt-5 flex flex-col gap-2 text-sm text-[#374151] sm:flex-row sm:items-center sm:justify-between">
        <span>Time Allowed: Based on {questionCount} questions</span>
        <span className="font-semibold text-[#111827]">
          Maximum Marks: {maxMarks}
        </span>
      </div>

      <p className="mt-4 text-center text-sm italic text-[#6B7280]">
        All questions are compulsory unless stated otherwise.
      </p>

      <section className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 sm:p-5">
        <div className="grid gap-4 text-sm sm:grid-cols-1 md:grid-cols-3 md:gap-5">
          <label className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <span className="shrink-0 font-medium text-[#374151]">Name:</span>
            <span className="h-7 flex-1 border-b border-[#9CA3AF]" />
          </label>
          <label className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <span className="shrink-0 font-medium text-[#374151]">
              Roll Number:
            </span>
            <span className="h-7 flex-1 border-b border-[#9CA3AF]" />
          </label>
          <label className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <span className="shrink-0 font-medium text-[#374151]">
              Section:
            </span>
            <span className="h-7 flex-1 border-b border-[#9CA3AF]" />
          </label>
        </div>
      </section>

      {result.sections.map((section, sectionIndex) => (
        <section key={`${section.title}-${sectionIndex}`} className="mt-10">
          <h2 className="text-center text-base font-bold text-[#111827] sm:text-lg">
            {section.title || `Section ${String.fromCharCode(65 + sectionIndex)}`}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm italic leading-relaxed text-[#6B7280]">
            {section.instruction}
          </p>

          <ol className="mt-8 space-y-5">
            {section.questions.map((question, index) => (
              <QuestionItem
                key={`${section.title}-${index}`}
                question={question}
                index={index}
              />
            ))}
          </ol>
        </section>
      ))}

      <p className="mt-12 text-center text-base font-bold text-[#111827]">
        End of Question Paper
      </p>
    </div>
  );
}
