"use client";

import * as React from "react";
import { Field } from "@base-ui/react/field";
import { cn } from "@/lib/utils";

export const fieldControlClass = cn(
  "flex w-full rounded-[var(--admin-radius-control)] bg-admin-control px-3 py-2 text-sm text-admin-text",
  "ring-1 ring-admin-line placeholder:text-admin-muted",
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-admin-focus",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export function FieldRoot({ className, ...props }: React.ComponentProps<typeof Field.Root>) {
  return <Field.Root className={cn("flex min-w-0 flex-col gap-1.5", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.ComponentProps<typeof Field.Label>) {
  return <Field.Label className={cn("text-sm font-medium text-admin-text", className)} {...props} />;
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof Field.Description>) {
  return <Field.Description className={cn("text-xs text-admin-muted", className)} {...props} />;
}

export function FieldError({ className, ...props }: React.ComponentProps<typeof Field.Error>) {
  return <Field.Error className={cn("text-xs text-admin-danger", className)} {...props} />;
}

export type InputProps = React.ComponentProps<"input"> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function Input({ id, className, label, description, ...props }: InputProps) {
  return (
    <FieldRoot>
      {label != null && label !== "" ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
      <Field.Control
        id={id}
        render={<input className={cn(fieldControlClass, "h-10", className)} {...props} />}
      />
      {description != null && description !== "" ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}
    </FieldRoot>
  );
}

export type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function Textarea({ id, className, label, description, ...props }: TextareaProps) {
  return (
    <FieldRoot>
      {label != null && label !== "" ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
      <Field.Control
        id={id}
        render={
          <textarea className={cn(fieldControlClass, "min-h-24 resize-y", className)} {...props} />
        }
      />
      {description != null && description !== "" ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}
    </FieldRoot>
  );
}

export const InputArea = Textarea;
