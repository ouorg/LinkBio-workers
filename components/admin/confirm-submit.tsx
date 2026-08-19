"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Button } from "@/components/base/button";
import { ConfirmDialog } from "@/components/base/dialog";

/**
 * Submit button with optional Base UI confirm dialog.
 * First click opens the dialog; confirm then submits the parent form.
 */
export function ConfirmSubmitButton({
  confirmMessage,
  confirmTitle,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  children,
  ...props
}: ComponentProps<typeof Button> & {
  confirmMessage?: string;
  confirmTitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const hiddenRef = useRef<HTMLButtonElement>(null);

  if (!confirmMessage) {
    return (
      <Button type="submit" {...props}>
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button type="button" {...props} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <button ref={hiddenRef} type="submit" hidden tabIndex={-1} aria-hidden="true" />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={confirmTitle || confirmMessage}
        description={confirmTitle ? confirmMessage : undefined}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={() => hiddenRef.current?.click()}
      />
    </>
  );
}
