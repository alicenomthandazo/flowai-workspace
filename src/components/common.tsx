import { AlertTriangle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; cls: string; dot: string }> = {
    high: {
      label: "High priority",
      cls: "bg-destructive/10 text-destructive border-destructive/25",
      dot: "●",
    },
    medium: {
      label: "Medium priority",
      cls: "bg-warning/15 text-warning-foreground border-warning/40 dark:text-warning",
      dot: "◆",
    },
    low: {
      label: "Low priority",
      cls: "bg-success/12 text-success border-success/30",
      dot: "▲",
    },
  };
  const v = map[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
        v.cls,
      )}
    >
      <span aria-hidden>{v.dot}</span>
      {v.label.replace(" priority", "")}
      <span className="sr-only">{v.label}</span>
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/8 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-destructive">
            We couldn&apos;t complete that request. Please try again.
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
          Try Again
        </Button>
      )}
    </div>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground"
    >
      <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
      {label}
    </div>
  );
}
