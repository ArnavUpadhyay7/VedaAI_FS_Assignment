"use client";

import { Minus, Plus, X } from "lucide-react";
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
    <div className="grid gap-3 lg:grid-cols-[1fr_28px_140px_140px] lg:items-end lg:gap-3">
      <div className="min-w-0">
        <label className="mb-1.5 block text-xs text-[#6B7280] lg:sr-only">
          Question Type
        </label>
        <select
          value={row.type}
          onChange={(e) => onUpdate({ type: e.target.value })}
          className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#9CA3AF]"
        >
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end lg:justify-center lg:pb-1">
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex size-7 items-center justify-center text-[#9CA3AF] hover:text-[#111827]"
            aria-label="Remove question type"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="lg:contents">
        <div className="grid grid-cols-2 gap-3 lg:contents">
          <div>
            <label className="mb-1.5 block text-xs text-[#6B7280]">
              No. of Questions
            </label>
            <Stepper value={row.count} onChange={(count) => onUpdate({ count })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-[#6B7280]">Marks</label>
            <Stepper
              value={row.marks}
              onChange={(marks) => onUpdate({ marks })}
              min={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
