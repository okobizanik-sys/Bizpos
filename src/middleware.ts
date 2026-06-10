import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  const publicPaths = ["/", "/unauthorized"];
  const isAuthRoute = pathname.startsWith("/api/auth");
  const isPublicApiRoute = pathname.startsWith("/api/settings");
  const isOtherApiRoute = pathname.startsWith("/api/");

  if (isAuthRoute || isPublicApiRoute || isOtherApiRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET!,
    secureCookie: process.env.NODE_ENV === "production",
    salt:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const isAuthenticated = !!token;
  const userRole = token?.role;
  const userBranchId =
    token?.branchId || request.cookies.get("branch_id")?.value;
  const dashboardRoute =
    userRole === "ADMIN" ? "/admin/dashboard" : "/staff/dashboard";

  if (publicPaths.includes(pathname)) {
    if (pathname === "/" && isAuthenticated) {
      return NextResponse.redirect(new URL(dashboardRoute, nextUrl.origin));
    }

    return NextResponse.next();
  }

  const response = NextResponse.next();

  if (userBranchId && typeof userBranchId === "string") {
    response.cookies.set("branch_id", userBranchId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(dashboardRoute, nextUrl.origin));
  }

  const adminRoutes = ["/admin", "/sales", "/staffs", "/settings"];
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
    }
  }

  if (
    pathname === "/inventories/products" &&
    !nextUrl.searchParams.get("page")
  ) {
    return NextResponse.redirect(
      new URL(
        "/inventories/products?page=1&per_page=10&sort=id%3Adesc",
        nextUrl.origin,
      ),
    );
  }
  if (pathname === "/orders/orders-list" && !nextUrl.searchParams.get("page")) {
    return NextResponse.redirect(
      new URL(
        `/orders/orders-list?page=1&per_page=10&sort=id%3Adesc`,
        nextUrl.origin,
      ),
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
