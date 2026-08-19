"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-[4px]",
        "bg-admin-control text-admin-primary-fg ring-1 ring-admin-line",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-focus",
        "data-checked:bg-admin-primary data-checked:ring-admin-primary",
        "data-unchecked:bg-admin-control",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex text-current data-unchecked:hidden">
        <Check className="size-3" strokeWidth={3} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}

export function CheckboxField({
  name,
  value = "1",
  defaultChecked,
  children,
  className,
}: {
  name: string;
  value?: string;
  defaultChecked?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex items-center gap-2 text-sm text-admin-text", className)}>
      <Checkbox name={name} value={value} defaultChecked={defaultChecked} />
      <span>{children}</span>
    </label>
  );
}
