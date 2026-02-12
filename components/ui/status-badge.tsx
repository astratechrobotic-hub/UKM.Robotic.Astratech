import { cn } from "@/lib/utils";
import type { JobDeskStatus } from "@/types";

interface StatusBadgeProps {
  status: JobDeskStatus;
  className?: string;
}

const statusConfig: Record<
  JobDeskStatus,
  { label: string; className: string }
> = {
  todo: {
    label: "Todo",
    className: "bg-slate-100 text-slate-700 border-slate-300",
  },
  doing: {
    label: "Doing",
    className: "bg-blue-100 text-blue-700 border-blue-300",
  },
  done: {
    label: "Done",
    className: "bg-green-100 text-green-700 border-green-300",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

