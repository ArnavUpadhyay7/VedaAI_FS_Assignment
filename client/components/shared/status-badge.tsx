import { cn } from "@/lib/utils";
import type { AssignmentStatus } from "@/lib/types";

const statusConfig: Record<
  AssignmentStatus,
  { label: string; className: string; dotClassName: string }
> = {
  queued: {
    label: "Queued",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    dotClassName: "bg-amber-500",
  },
  processing: {
    label: "Generating",
    className: "bg-orange-50 text-orange-800 border-orange-200",
    dotClassName: "bg-orange-500 animate-pulse",
  },
  completed: {
    label: "Ready",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClassName: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-800 border-red-200",
    dotClassName: "bg-red-500",
  },
};

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dotClassName)} />
      {config.label}
    </span>
  );
}

export function StatusDot({ status }: { status: AssignmentStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn("inline-block size-2.5 rounded-full", config.dotClassName)}
      title={config.label}
    />
  );
}
