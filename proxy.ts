import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("portfolio_admin_token")?.value;

  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/register";
  const isAdminDashboard =
    pathname === "/admin" || (pathname.startsWith("/admin/") && !isAuthPage);

  // If trying to access admin dashboard without token, redirect to login
  if (isAdminDashboard && !token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting login or register, redirect to admin dashboard
  if (isAuthPage && token) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
