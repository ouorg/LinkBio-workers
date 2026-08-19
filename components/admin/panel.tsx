import { cn } from "@/lib/utils";

/**
 * Admin card surface — plain divs only.
 * Compound client-library cards can serialize as $undefined under RSC
 * on OpenNext/Workers and crash the admin payload.
 */
export function AdminPanel({
  title,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  if (title != null && title !== "") {
    return (
      <div
        className={cn(
          "flex w-full flex-col overflow-visible rounded-[var(--admin-radius)] bg-admin-elevated text-base ring-1 ring-admin-border",
          className,
        )}
      >
        <div className="flex items-center gap-2 rounded-t-[var(--admin-radius)] bg-admin-elevated px-4 pt-4 pb-2 text-base font-medium text-admin-muted">
          {title}
        </div>
        <div
          className={cn(
            "relative flex flex-col gap-2 overflow-visible rounded-[var(--admin-radius)] bg-admin-surface p-4 text-inherit ring-1 ring-admin-line",
            bodyClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-visible rounded-[var(--admin-radius)] bg-admin-surface p-4 shadow-xs ring-1 ring-admin-line",
        className,
      )}
    >
      {children}
    </div>
  );
}
