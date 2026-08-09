import { ensureCsrfCookie } from "./actions";

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  await ensureCsrfCookie();
  return <>{children}</>;
}
