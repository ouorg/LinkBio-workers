import { NextResponse, type NextRequest } from "next/server";
import { SECURITY_HEADERS } from "@/lib/security";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  // Soft gate: full auth check happens in pages (needs bindings).
  // Redirect bare /admin/login CSRF cookies are set in layout.
  void req;
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
