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
    <div className="flex h-10 items-center rounded-xl border border-[#E5E7EB] bg-white">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="min-w-8 text-center text-sm font-medium">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-3.5" />
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
    <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3 lg:border-0 lg:bg-transparent lg:p-0">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280] lg:hidden">
            Question Type
          </label>
          <select
            value={row.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm outline-none focus:border-[#9CA3AF]"
          >
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mt-6 lg:mt-2"
            onClick={onRemove}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">
            No. of Questions
          </label>
          <Stepper
            value={row.count}
            onChange={(count) => onUpdate({ count })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">
            Marks
          </label>
          <Stepper
            value={row.marks}
            onChange={(marks) => onUpdate({ marks })}
            min={1}
          />
        </div>
      </div>
    </div>
  );
}
