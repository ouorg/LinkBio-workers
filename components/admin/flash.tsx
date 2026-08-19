"use client";

import { useEffect } from "react";
import { Alert } from "@/components/base/alert";
import { FLASH_COOKIE } from "@/lib/flash-constants";

function clearFlashCookie() {
  try {
    document.cookie = `${FLASH_COOKIE}=; Path=/admin; Max-Age=0; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function Flash({ message }: { message?: string }) {
  useEffect(() => {
    if (message) clearFlashCookie();
  }, [message]);

  if (!message) return null;
  const isError = message.startsWith("error:");
  const text = isError
    ? message.slice(6)
    : message.startsWith("ok:")
      ? message.slice(3)
      : message;
  return <Alert title={text} variant={isError ? "error" : "default"} />;
}
