import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: "neutral" | "success" | "danger";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium leading-none",
        variant === "success" && "bg-admin-success-bg text-admin-success",
        variant === "danger" && "bg-admin-danger-bg text-admin-danger",
        variant === "neutral" && "bg-admin-tint text-admin-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
