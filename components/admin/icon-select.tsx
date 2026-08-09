import { BUILTIN_ICONS, normalizeIconId } from "@/lib/icons";
import { Label } from "@cloudflare/kumo/components/label";

/**
 * Server-friendly select for built-in icons (native select → FormData).
 * Unknown current values are kept as an extra option so edit does not clobber them.
 */
export function IconSelect({
  id,
  name = "icon",
  label,
  defaultValue = "link",
  className,
}: {
  id: string;
  name?: string;
  label: string;
  defaultValue?: string;
  className?: string;
}) {
  const current = normalizeIconId(defaultValue || "link");
  const known = BUILTIN_ICONS.some((i) => i.id === current);

  return (
    <div className={className ?? "space-y-2"}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block size-8 shrink-0 rounded-md border border-kumo-hairline bg-kumo-control"
          style={{
            maskImage: `url(/icons/${known ? current : "link"}.svg)`,
            WebkitMaskImage: `url(/icons/${known ? current : "link"}.svg)`,
            maskSize: "1.25rem",
            WebkitMaskSize: "1.25rem",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            backgroundColor: "var(--text-color-kumo-default, currentColor)",
          }}
        />
        <select
          id={id}
          name={name}
          defaultValue={known ? current : current}
          className="admin-select min-w-0 flex-1"
        >
          {!known && current ? (
            <option value={current}>
              {current} (custom)
            </option>
          ) : null}
          {BUILTIN_ICONS.map((icon) => (
            <option key={icon.id} value={icon.id}>
              {icon.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
