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
    <li className="pb-6 last:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-7 text-[#111827] sm:text-[15px]">
            <span className="text-[#111827]">{index + 1}. </span>
            <DifficultyBadge difficulty={question.difficulty} />{" "}
            {question.text}
          </p>
          {question.options && question.options.length > 0 && (
            <ul className="mt-4 space-y-2 pl-4 sm:pl-6">
              {question.options.map((option, optIndex) => (
                <li
                  key={`${index}-opt-${optIndex}`}
                  className="flex gap-2 text-sm leading-6 text-[#374151]"
                >
                  <span className="text-[#111827]">
                    {optionLabel(optIndex)})
                  </span>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="shrink-0 text-sm text-[#6B7280] sm:pl-4 sm:text-right">
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
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:p-8 md:p-10">
      <header className="border-b border-[#E5E7EB] pb-6 text-center">
        <h1 className="text-xl text-[#111827] sm:text-2xl">{SCHOOL_NAME}</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Subject: Assessment</p>
        <p className="text-sm text-[#6B7280]">Class: —</p>
      </header>

      <div className="mt-5 flex flex-col gap-1 text-sm text-[#374151] sm:flex-row sm:justify-between">
        <span>Time Allowed: Based on {questionCount} questions</span>
        <span className="text-[#111827]">Maximum Marks: {maxMarks}</span>
      </div>

      <p className="mt-4 text-sm text-[#111827]">
        All questions are compulsory unless stated otherwise.
      </p>

      <section className="mt-6 space-y-4 border border-[#E5E7EB] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8">
          <label className="flex min-w-[140px] flex-1 items-end gap-2">
            <span className="shrink-0 text-[#374151]">Name:</span>
            <span className="h-6 flex-1 border-b border-[#9CA3AF]" />
          </label>
          <label className="flex min-w-[140px] flex-1 items-end gap-2">
            <span className="shrink-0 text-[#374151]">Roll Number:</span>
            <span className="h-6 flex-1 border-b border-[#9CA3AF]" />
          </label>
        </div>
        <label className="flex items-end gap-2 text-sm">
          <span className="shrink-0 text-[#374151]">Class:</span>
          <span className="h-6 w-16 border-b border-[#9CA3AF]" />
          <span className="text-[#374151]">Section:</span>
          <span className="h-6 flex-1 border-b border-[#9CA3AF]" />
        </label>
      </section>

      {result.sections.map((section, sectionIndex) => (
        <section
          key={`${section.title}-${sectionIndex}`}
          className="mt-10 border-t border-[#F3F4F6] pt-8 first:border-t-0 first:pt-0"
        >
          <h2 className="text-center text-base text-[#111827] sm:text-lg">
            {section.title || `Section ${String.fromCharCode(65 + sectionIndex)}`}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm italic text-[#6B7280]">
            {section.instruction}
          </p>

          <ol className="mt-6 list-none space-y-6 pl-0">
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

      <p className="mt-12 text-center text-base text-[#111827]">
        End of Question Paper
      </p>
    </div>
  );
}
