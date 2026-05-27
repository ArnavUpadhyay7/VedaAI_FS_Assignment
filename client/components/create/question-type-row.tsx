"use client";

import { ChevronDown, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUESTION_TYPE_OPTIONS } from "@/lib/constants";
import type { QuestionTypeRow } from "@/store/create-form-store";

interface QuestionTypeRowProps {
  row: QuestionTypeRow;
  canRemove: boolean;
  onUpdate: (
    patch: Partial<Pick<QuestionTypeRow, "type" | "count" | "marks">>
  ) => void;
  onRemove: () => void;
}

function Stepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="flex h-10 w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-8 rounded-lg"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-3.5 text-[#6B7280]" />
      </Button>
      <span className="min-w-6 text-center text-sm text-[#111827]">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-8 rounded-lg"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-3.5 text-[#6B7280]" />
      </Button>
    </div>
  );
}

export function QuestionTypeRowComponent({
  row,
  canRemove,
  onUpdate,
  onRemove,
}: QuestionTypeRowProps) {
  return (
    <>
      {/* ── MOBILE card layout ── */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 lg:hidden">
        {/* Row 1: select + X */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={row.type}
              onChange={(e) => onUpdate({ type: e.target.value })}
              className="h-10 w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white pl-3 pr-9 text-sm font-medium text-[#111827] outline-none focus:border-[#1C1C1C]"
            >
              {QUESTION_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9CA3AF]" />
          </div>

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827]"
              aria-label="Remove question type"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Row 2: steppers with labels */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1.5 text-xs text-[#6B7280]">No. of Questions</p>
            <Stepper value={row.count} onChange={(count) => onUpdate({ count })} />
          </div>
          <div>
            <p className="mb-1.5 text-xs text-[#6B7280]">Marks</p>
            <Stepper value={row.marks} onChange={(marks) => onUpdate({ marks })} min={1} />
          </div>
        </div>
      </div>

      {/* ── DESKTOP flat row layout ── */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_28px_140px_140px] lg:items-center lg:gap-3">
        {/* Select */}
        <div className="relative">
          <select
            value={row.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="h-10 w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white pl-3 pr-9 text-sm text-[#111827] outline-none transition-colors hover:border-[#9CA3AF] focus:border-[#1C1C1C]"
          >
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9CA3AF]" />
        </div>

        {/* Remove */}
        <div className="flex justify-center">
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="flex size-7 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
              aria-label="Remove question type"
            >
              <X className="size-4" />
            </button>
          ) : (
            <span className="size-7" />
          )}
        </div>

        {/* No. of questions stepper */}
        <Stepper value={row.count} onChange={(count) => onUpdate({ count })} />

        {/* Marks stepper */}
        <Stepper value={row.marks} onChange={(marks) => onUpdate({ marks })} min={1} />
      </div>
    </>
  );
}