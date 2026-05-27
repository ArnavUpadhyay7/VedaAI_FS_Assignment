"use client";

import Image from "next/image";
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
    <aside className="hidden h-full w-[280px] shrink-0 flex-col rounded-2xl bg-white px-4 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] lg:flex">
      <div className="mb-6 px-1">
        <Image
          src="/vedaai_logo.png"
          alt="VedaAI"
          width={110}
          height={34}
          className="h-8 w-auto object-contain"
          priority
        />
      </div>

      <Button
        asChild
        className="mb-6 h-10 w-full gap-2 rounded-full border border-[#F97316] bg-[#1C1C1C] text-sm text-white shadow-[0_0_0_1px_#F97316] hover:bg-[#111111]"
      >
        <Link href="/assignments/create">
          <Image
            src="/create_button_icon.png"
            alt=""
            width={14}
            height={14}
            className="size-3.5 object-contain"
          />
          Create Assignment
        </Link>
      </Button>

      <nav className="flex flex-1 flex-col justify-center gap-0.5">
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
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#4B5563] transition-colors hover:bg-[#F3F4F6]",
                isActive && "bg-[#F3F4F6] text-[#111827]"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge !== undefined && (
                <span className="min-w-[22px] rounded-full bg-[#F97316] px-1.5 py-0.5 text-center text-xs text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t border-[#F3F4F6] pt-4">
        <Link
          href="#"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#4B5563] transition-colors hover:bg-[#F3F4F6]"
        >
          <Settings className="size-4" />
          Settings
        </Link>
        <div className="flex items-center gap-2.5 rounded-xl bg-[#F9FAFB] p-2.5">
          <Image
            src="/school_logo.png"
            alt="Delhi Public School"
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-xs text-[#111827]">Delhi Public School</p>
            <p className="truncate text-xs text-[#6B7280]">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
