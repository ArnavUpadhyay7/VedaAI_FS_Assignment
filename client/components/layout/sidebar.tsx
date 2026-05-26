"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useAssignmentStore } from "@/store/assignment-store";

export function Sidebar() {
  const pathname = usePathname();
  const assignmentCount = useAssignmentStore((state) => state.assignments.length);

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 lg:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#F97316] text-sm font-bold text-white">
          V
        </div>
        <span className="text-lg font-semibold tracking-tight">VedaAI</span>
      </div>

      <Button
        asChild
        className="mb-6 h-10 w-full rounded-xl bg-[#1F2937] text-white hover:bg-[#111827]"
      >
        <Link href="/assignments/create">+ Create Assignment</Link>
      </Button>

      <nav className="flex flex-1 flex-col gap-1">
        {MAIN_NAV.map((item) => {
          const isActive =
            item.href !== "#" &&
            (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const badge =
            item.label === "Assignments" && assignmentCount > 0
              ? assignmentCount
              : item.badge;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4B5563] transition-colors",
                isActive && "bg-[#F3F4F6] text-[#111827]"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge !== undefined && (
                <span className="rounded-full bg-[#F97316] px-2 py-0.5 text-xs font-semibold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-[#E5E7EB] pt-4">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#4B5563]"
        >
          <Settings className="size-4" />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#E5E7EB] text-xs font-semibold">
            DP
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#111827]">
              Delhi Public School
            </p>
            <p className="truncate text-xs text-[#6B7280]">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
