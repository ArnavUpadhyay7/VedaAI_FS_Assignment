"use client";

import { create } from "zustand";
import { fetchAssignments } from "@/lib/api";
import type { Assignment, AssignmentStatus } from "@/lib/types";

interface AssignmentStore {
  assignments: Assignment[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  loadAssignments: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  updateAssignmentStatus: (
    id: string,
    status: AssignmentStatus,
    resultId?: string
  ) => void;
  upsertAssignment: (assignment: Assignment) => void;
  filteredAssignments: () => Assignment[];
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  searchQuery: "",
  isLoading: false,
  error: null,

  loadAssignments: async () => {
    set({ isLoading: true, error: null });
    try {
      const assignments = await fetchAssignments();
      set({ assignments, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load assignments",
      });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  updateAssignmentStatus: (id, status, resultId) => {
    set((state) => ({
      assignments: state.assignments.map((item) =>
        item._id === id ? { ...item, status, ...(resultId ? { resultId } : {}) } : item
      ),
    }));
  },

  upsertAssignment: (assignment) => {
    set((state) => {
      const exists = state.assignments.some((a) => a._id === assignment._id);
      if (exists) {
        return {
          assignments: state.assignments.map((a) =>
            a._id === assignment._id ? assignment : a
          ),
        };
      }
      return { assignments: [assignment, ...state.assignments] };
    });
  },

  filteredAssignments: () => {
    const { assignments, searchQuery } = get();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return assignments;
    return assignments.filter((item) =>
      item.instructions.toLowerCase().includes(query)
    );
  },
}));
