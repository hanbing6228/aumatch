import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

// Build a lightweight, edge-safe auth instance from the shared config only
// (no Prisma / bcrypt) so the middleware bundle stays Edge-compatible.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;
  const path = nextUrl.pathname;

  const isAdmin = path.startsWith("/admin");

  if (isAdmin && !isLoggedIn) {
    const url = new URL("/portal", nextUrl);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }
  if (isAdmin && role !== "ADMIN" && role !== "CONCIERGE") {
    return NextResponse.redirect(new URL("/portal", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
