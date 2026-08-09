import { Alert } from "@/components/ui/alert";

export function Flash({ message }: { message?: string }) {
  if (!message) return null;
  const isError = message.startsWith("error:");
  const text = isError
    ? message.slice(6)
    : message.startsWith("ok:")
      ? message.slice(3)
      : message;
  return <Alert variant={isError ? "destructive" : "success"} className="mb-4">{text}</Alert>;
}
