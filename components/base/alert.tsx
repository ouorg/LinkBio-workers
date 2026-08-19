import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Alert({
  title,
  variant = "default",
  className,
}: {
  title: string;
  variant?: "default" | "error";
  className?: string;
}) {
  const Icon = variant === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "mb-4 flex items-start gap-2 rounded-[var(--admin-radius)] px-3 py-2 text-sm ring-1",
        variant === "error"
          ? "bg-admin-danger-bg text-admin-danger ring-admin-danger/20"
          : "bg-admin-success-bg text-admin-success ring-admin-success/20",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="min-w-0 leading-5">{title}</p>
    </div>
  );
}
