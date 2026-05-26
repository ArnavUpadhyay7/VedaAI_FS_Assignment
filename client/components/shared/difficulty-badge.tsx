import { cn } from "@/lib/utils";

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  moderate: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
  challenging: "bg-red-100 text-red-800",
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const key = difficulty.toLowerCase();
  const style =
    difficultyStyles[key] ?? "bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-xs font-medium",
        style
      )}
    >
      [{difficulty}]
    </span>
  );
}
