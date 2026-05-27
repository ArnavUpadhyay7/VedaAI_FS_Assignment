"use client";

import Image from "next/image";
import Link from "next/link";
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
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)] lg:px-5 lg:py-3.5">
      {/* Left */}
      <div className="flex items-center gap-2">
        {/* Mobile: logo image only */}
        <div className="lg:hidden">
          <Image
            src="/vedaai_logo.png"
            alt="VedaAI"
            width={100}
            height={30}
            className="h-7 w-auto object-contain"
            priority
          />
        </div>

        {/* Desktop: back arrow + grid icon + title */}
        <div className="hidden items-center gap-2 lg:flex">
          {showBack && (
            <Button variant="ghost" size="icon-sm" asChild className="-ml-1">
              <Link href={backHref}>
                <ArrowLeft className="size-4 text-[#6B7280]" />
              </Link>
            </Button>
          )}
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className="shrink-0 text-[#9CA3AF]"
          >
            <rect x="0.5" y="0.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
            <rect x="9" y="0.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
            <rect x="0.5" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" />
            <rect x="9" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" />
          </svg>
          <span className="text-sm font-medium text-[#6B7280]">{title}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="size-4" />
          </Button>
          <span className="pointer-events-none absolute right-1.5 top-1.5 size-2 rounded-full bg-[#F97316] ring-2 ring-white" />
        </div>

        {/* Desktop: user pill */}
        <button
          type="button"
          className="hidden items-center gap-2 rounded-full border border-[#E5E7EB] py-1 pl-1 pr-2.5 lg:flex"
        >
          <div className="size-7 overflow-hidden rounded-full">
            <Image
              src="/profile_logo.png"
              alt="John Doe"
              width={28}
              height={28}
              className="size-7 object-cover"
            />
          </div>
          <span className="text-sm font-medium text-[#111827]">John Doe</span>
          <ChevronDown className="size-3.5 text-[#6B7280]" />
        </button>

        {/* Mobile: avatar + hamburger */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <div className="size-8 overflow-hidden rounded-full ring-2 ring-[#E5E7EB]">
            <Image
              src="/profile_logo.png"
              alt="John Doe"
              width={32}
              height={32}
              className="size-8 object-cover"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}