"use client";

import type { LinkItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExternalLink, Github, Globe, Link2, Mail } from "lucide-react";

function iconFor(name: string) {
  const n = name.toLowerCase();
  if (n === "github") return Github;
  if (n === "globe" || n === "website") return Globe;
  if (n === "mail" || n === "email") return Mail;
  if (n === "link") return Link2;
  return ExternalLink;
}

export function LinkList({
  links,
  emptyLabel,
}: {
  links: LinkItem[];
  emptyLabel: string;
}) {
  const enabled = links
    .filter((l) => l.enabled && l.url)
    .sort((a, b) => a.order - b.order);

  if (!enabled.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <nav className="theme-links flex w-full max-w-md flex-col gap-3" aria-label="Links">
      {enabled.map((link) => {
        const Icon = iconFor(link.icon);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-link-id={link.id}
            onClick={() => {
              try {
                navigator.sendBeacon("/api/click", JSON.stringify({ id: link.id }));
              } catch {
                void fetch("/api/click", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: link.id }),
                  keepalive: true,
                });
              }
            }}
            className={cn(
              "theme-link group flex items-center gap-3 border border-border bg-card/80 px-4 py-3.5",
              "text-sm font-medium shadow-sm transition",
              "hover:border-primary/40 hover:bg-card hover:shadow-md",
            )}
          >
            <Icon className="theme-link-icon h-5 w-5 shrink-0 opacity-80 group-hover:text-primary" />
            <span className="flex-1 truncate text-left">{link.title}</span>
            <ExternalLink className="theme-link-external h-4 w-4 opacity-40" />
          </a>
        );
      })}
    </nav>
  );
}
