"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@cloudflare/kumo/components/button";
import { Label } from "@cloudflare/kumo/components/label";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import {
  BUILTIN_ICONS,
  normalizeIconId,
  resolveLinkIconSrc,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

function IconGlyph({
  src,
  className,
  size = 20,
}: {
  src: string;
  className?: string;
  size?: number;
}) {
  const isRemote = /^https?:\/\//i.test(src);
  if (isRemote) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={cn("object-contain opacity-90", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/**
 * Icon picker aligned with admin Kumo chrome:
 * - left preview updates live
 * - dropdown list rows show SVG preview + label
 * - hidden input for Server Action FormData
 */
export function IconSelect({
  id,
  name = "icon",
  label,
  defaultValue = "link",
  /** Format custom/unknown icon labels, e.g. t("admin.links.icon.custom", { id }) */
  formatCustomLabel,
  className,
}: {
  id?: string;
  name?: string;
  label: string;
  defaultValue?: string;
  formatCustomLabel?: (id: string) => string;
  className?: string;
}) {
  const autoId = useId();
  const fieldId = id || `icon-select-${autoId}`;
  const listboxId = `${fieldId}-listbox`;

  const initial = normalizeIconId(defaultValue || "link");
  const knownIds = useMemo(() => new Set(BUILTIN_ICONS.map((i) => i.id)), []);
  const isKnownInitial = knownIds.has(initial as (typeof BUILTIN_ICONS)[number]["id"]);

  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  type Option = { id: string; label: string; file: string };
  const options = useMemo((): Option[] => {
    const list: Option[] = BUILTIN_ICONS.map((i) => ({
      id: i.id,
      label: i.label,
      file: i.file,
    }));
    if (!isKnownInitial && initial) {
      list.unshift({
        id: initial,
        label: formatCustomLabel ? formatCustomLabel(initial) : initial,
        file: resolveLinkIconSrc(initial),
      });
    }
    return list;
  }, [initial, isKnownInitial, formatCustomLabel]);

  const selected = options.find((o) => o.id === value) || options[0]!;
  const previewSrc = resolveLinkIconSrc(selected.id);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <input type="hidden" name={name} value={value} />

      <div className="flex items-stretch gap-2">
        {/* Live preview */}
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg",
            "bg-kumo-control text-kumo-default ring ring-kumo-line",
          )}
          title={selected.label}
        >
          <IconGlyph src={previewSrc} size={22} className="text-kumo-strong" />
        </div>

        {/* Trigger */}
        <div className="relative min-w-0 flex-1">
          <Button
            id={fieldId}
            type="button"
            variant="secondary"
            className="h-11 w-full justify-between gap-2 px-3"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex min-w-0 items-center gap-2">
              <IconGlyph src={previewSrc} size={16} className="text-kumo-default" />
              <span className="truncate text-left text-sm font-medium text-kumo-default">
                {selected.label}
              </span>
              <span className="truncate font-mono text-xs text-kumo-subtle">({selected.id})</span>
            </span>
            <CaretDownIcon
              className={cn(
                "size-4 shrink-0 text-kumo-subtle transition-transform",
                open && "rotate-180",
              )}
            />
          </Button>

          {open ? (
            <div
              id={listboxId}
              role="listbox"
              aria-label={label}
              className={cn(
                "absolute left-0 right-0 z-50 mt-1.5 max-h-64 overflow-auto rounded-lg",
                "border border-kumo-hairline bg-kumo-base p-1 shadow-lg ring ring-kumo-line",
              )}
            >
              {options.map((icon) => {
                const src = resolveLinkIconSrc(icon.id);
                const active = icon.id === value;
                return (
                  <button
                    key={icon.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors",
                      "hover:bg-kumo-tint focus-visible:bg-kumo-tint focus-visible:outline-none",
                      active && "bg-kumo-tint font-medium text-kumo-strong",
                    )}
                    onClick={() => {
                      setValue(icon.id);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md",
                        "bg-kumo-control text-kumo-default ring ring-kumo-hairline",
                      )}
                    >
                      <IconGlyph src={src} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-kumo-default">{icon.label}</span>
                      <span className="block truncate font-mono text-[11px] text-kumo-subtle">
                        {icon.id}
                      </span>
                    </span>
                    {active ? (
                      <CheckIcon className="size-4 shrink-0 text-kumo-strong" weight="bold" />
                    ) : (
                      <span className="size-4 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
