import { Banner } from "@cloudflare/kumo/components/banner";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

export function Flash({ message }: { message?: string }) {
  if (!message) return null;
  const isError = message.startsWith("error:");
  const text = isError
    ? message.slice(6)
    : message.startsWith("ok:")
      ? message.slice(3)
      : message;
  return (
    <Banner
      className="mb-4"
      size="sm"
      variant={isError ? "error" : "default"}
      icon={
        isError ? (
          <WarningCircleIcon weight="fill" className="size-4" />
        ) : (
          <CheckCircleIcon weight="fill" className="size-4" />
        )
      }
      title={text}
    />
  );
}
