"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

export function Header({
  title = "Assignment",
  showBack = true,
  backHref = "/assignments",
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white px-4 py-3 lg:rounded-t-2xl lg:border-0 lg:px-0 lg:pt-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#F97316] text-xs font-bold text-white">
            V
          </div>
          <span className="font-semibold">VedaAI</span>
        </div>

        {showBack && (
          <Button variant="ghost" size="icon-sm" asChild className="hidden lg:inline-flex">
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        )}

        <div className="hidden items-center gap-2 lg:flex">
          {showBack && pathname !== "/assignments" && (
            <Button variant="ghost" size="icon-sm" asChild className="lg:hidden">
              <Link href={backHref}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          )}
          <h1 className="text-sm font-medium text-[#6B7280]">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="size-4" />
        </Button>
        <button
          type="button"
          className="hidden items-center gap-2 rounded-full border border-[#E5E7EB] px-2 py-1 lg:flex"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[#E5E7EB] text-xs font-semibold">
            JD
          </span>
          <span className="text-sm font-medium">John Doe</span>
          <ChevronDown className="size-4 text-[#6B7280]" />
        </button>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </div>
    </header>
  );
}
