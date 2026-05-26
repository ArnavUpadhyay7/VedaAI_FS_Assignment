"use client";

import { create } from "zustand";
import type { QuestionType } from "@/lib/types";

export interface QuestionTypeRow extends QuestionType {
  id: string;
}

interface CreateFormStore {
  dueDate: Date | undefined;
  instructions: string;
  questionTypes: QuestionTypeRow[];
  file: File | null;
  setDueDate: (date: Date | undefined) => void;
  setInstructions: (value: string) => void;
  setFile: (file: File | null) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (
    id: string,
    patch: Partial<Pick<QuestionType, "type" | "count" | "marks">>
  ) => void;
  reset: () => void;
}

function createRow(): QuestionTypeRow {
  return {
    id: crypto.randomUUID(),
    type: "Multiple Choice Questions",
    count: 1,
    marks: 5,
  };
}

const defaultRows = [createRow()];

export const useCreateFormStore = create<CreateFormStore>((set) => ({
  dueDate: undefined,
  instructions: "",
  questionTypes: defaultRows,
  file: null,

  setDueDate: (date) => set({ dueDate: date }),
  setInstructions: (value) => set({ instructions: value }),
  setFile: (file) => set({ file }),

  addQuestionType: () =>
    set((state) => ({
      questionTypes: [...state.questionTypes, createRow()],
    })),

  removeQuestionType: (id) =>
    set((state) => ({
      questionTypes:
        state.questionTypes.length === 1
          ? state.questionTypes
          : state.questionTypes.filter((row) => row.id !== id),
    })),

  updateQuestionType: (id, patch) =>
    set((state) => ({
      questionTypes: state.questionTypes.map((row) =>
        row.id === id ? { ...row, ...patch } : row
      ),
    })),

  reset: () =>
    set({
      dueDate: undefined,
      instructions: "",
      questionTypes: [createRow()],
      file: null,
    }),
}));
