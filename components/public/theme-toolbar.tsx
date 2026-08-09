"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColorMode } from "@/lib/types";
import type { LocalePref } from "@/lib/prefs";
import { COLOR_COOKIE, COLOR_STORAGE_KEY, LOCALE_COOKIE } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type Labels = {
  color: string;
  system: string;
  light: string;
  dark: string;
  locale: string;
  auto: string;
  zh: string;
  en: string;
};

const YEAR = 31536000;

function setCookie(name: string, value: string) {
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  let s = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${YEAR}; SameSite=Lax`;
  if (secure) s += "; Secure";
  document.cookie = s;
}

function applyColor(mode: ColorMode) {
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.classList.toggle("light", mode === "light");
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute("content", mode === "system" ? "light dark" : mode);
  try {
    localStorage.setItem(COLOR_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  setCookie(COLOR_COOKIE, mode);
}

export function ThemeToolbar({
  colorMode,
  localePref,
  labels,
}: {
  colorMode: ColorMode;
  localePref: LocalePref;
  labels: Labels;
}) {
  const router = useRouter();
  const colorLabel =
    colorMode === "light" ? labels.light : colorMode === "dark" ? labels.dark : labels.system;
  const localeShort = localePref === "zh-CN" ? "中" : localePref === "en" ? "EN" : "Auto";
  const localeLabel =
    localePref === "zh-CN" ? labels.zh : localePref === "en" ? labels.en : labels.auto;

  const ColorIcon = colorMode === "light" ? Sun : colorMode === "dark" ? Moon : Monitor;

  const btnClass = cn(
    "theme-toolbar-btn shrink-0 rounded-full border border-border/80",
    "bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70",
    "shadow-sm",
  );

  return (
    <aside className="theme-toolbar" aria-label="Display preferences">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className={btnClass}
            aria-label={`${labels.color}: ${colorLabel}`}
          >
            <ColorIcon className="h-4 w-4 shrink-0" />
            <span className="hidden max-w-[7rem] truncate sm:inline">{colorLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[60] min-w-[9.5rem]"
        >
          <DropdownMenuLabel>{labels.color}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(
            [
              ["system", labels.system],
              ["light", labels.light],
              ["dark", labels.dark],
            ] as const
          ).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              className={cn(colorMode === value && "font-semibold text-primary")}
              onSelect={() => {
                applyColor(value);
                router.refresh();
              }}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className={btnClass}
            aria-label={`${labels.locale}: ${localeLabel}`}
          >
            <span className="inline-flex h-5 min-w-7 shrink-0 items-center justify-center rounded-md bg-primary/15 px-1 text-[11px] font-bold">
              {localeShort}
            </span>
            <span className="hidden max-w-[7rem] truncate sm:inline">{localeLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[60] min-w-[9.5rem]"
        >
          <DropdownMenuLabel>{labels.locale}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(
            [
              ["auto", labels.auto],
              ["zh-CN", labels.zh],
              ["en", labels.en],
            ] as const
          ).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              className={cn(localePref === value && "font-semibold text-primary")}
              onSelect={() => {
                setCookie(LOCALE_COOKIE, value);
                location.reload();
              }}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
