import { cn } from "@/lib/utils";

/**
 * Admin card surface — plain divs only (no Kumo LayerCard.Primary/Secondary).
 * Compound subcomponents on client modules can serialize as $undefined under RSC
 * on OpenNext/Workers and crash the admin payload.
 */
export function AdminPanel({
  title,
  children,
  className,
  bodyClassName,
}: {
  /** Optional header row (was LayerCard.Secondary) */
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  if (title != null && title !== "") {
    return (
      <div
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-lg bg-kumo-elevated text-base ring ring-kumo-hairline",
          className,
        )}
      >
        <div className="-my-2 flex items-center gap-2 bg-kumo-elevated p-4 text-base font-medium text-kumo-subtle">
          {title}
        </div>
        <div
          className={cn(
            "relative flex flex-col gap-2 overflow-hidden rounded-lg bg-kumo-base p-4 pr-3 text-inherit ring ring-kumo-fill",
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
        "overflow-hidden rounded-lg bg-kumo-base p-4 shadow-xs ring ring-kumo-line",
        className,
      )}
    >
      {children}
    </div>
  );
}
