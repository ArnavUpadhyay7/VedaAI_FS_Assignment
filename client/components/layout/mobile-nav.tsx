"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOBILE_NAV } from "@/lib/constants";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl bg-[#212121] px-1 py-2 lg:hidden">
      {MOBILE_NAV.map((item) => {
        const isActive =
          item.href !== "#" &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-[10px] font-medium transition-colors",
              isActive ? "text-white" : "text-[#9CA3AF]"
            )}
          >
            <div className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-colors",
              isActive && "bg-[#374151]"
            )}>
              <item.icon className="size-5" />
            </div>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}