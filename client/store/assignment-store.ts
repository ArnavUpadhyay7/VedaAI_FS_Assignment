"use client";

import { create } from "zustand";
import { deleteAssignment as deleteAssignmentApi, fetchAssignments } from "@/lib/api";
import type { Assignment, AssignmentStatus } from "@/lib/types";

export type StatusFilter = "all" | AssignmentStatus;
export type DateFilter = "all" | "upcoming" | "past";

interface AssignmentStore {
  assignments: Assignment[];
  searchQuery: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  isLoading: boolean;
  error: string | null;
  loadAssignments: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setDateFilter: (filter: DateFilter) => void;
  clearFilters: () => void;
  updateAssignmentStatus: (
    id: string,
    status: AssignmentStatus,
    resultId?: string
  ) => void;
  upsertAssignment: (assignment: Assignment) => void;
  removeAssignment: (id: string) => Promise<void>;
}

export function filterAssignments(
  assignments: Assignment[],
  searchQuery: string,
  statusFilter: StatusFilter,
  dateFilter: DateFilter
): Assignment[] {
  const query = searchQuery.trim().toLowerCase();

  return assignments.filter((assignment) => {
    const searchMatch = !query || matchesSearch(assignment, query);
    const statusMatch =
      statusFilter === "all" || assignment.status === statusFilter;
    const dateMatch = matchesDateFilter(assignment, dateFilter);
    return searchMatch && statusMatch && dateMatch;
  });
}

function matchesSearch(assignment: Assignment, query: string): boolean {
  const haystack = [
    assignment.instructions,
    ...assignment.questionTypes.map((q) => q.type),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function matchesDateFilter(assignment: Assignment, filter: DateFilter): boolean {
  if (filter === "all") return true;

  const due = new Date(assignment.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filter === "upcoming") return due >= today;
  return due < today;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  searchQuery: "",
  statusFilter: "all",
  dateFilter: "all",
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
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setDateFilter: (filter) => set({ dateFilter: filter }),
  clearFilters: () =>
    set({ searchQuery: "", statusFilter: "all", dateFilter: "all" }),

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

  removeAssignment: async (id) => {
    await deleteAssignmentApi(id);
    set((state) => ({
      assignments: state.assignments.filter((a) => a._id !== id),
    }));
  },
}));
