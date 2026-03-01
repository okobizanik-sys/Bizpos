import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  // console.log(nextUrl.origin)
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
  // console.log(token, "token from middleware", userRole);

  const response = NextResponse.next();

  // Set branch ID in cookies if it exists
  if (userBranchId && typeof userBranchId === "string") {
    response.cookies.set("branch_id", userBranchId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated && nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Redirect authenticated users accessing "/dashboard" to their respective dashboards
  if (isAuthenticated && nextUrl.pathname === "/dashboard") {
    const dashboardRoute =
      userRole === "ADMIN" ? "/admin/dashboard" : "/staff/dashboard";
    return NextResponse.redirect(new URL(dashboardRoute, nextUrl.origin));
  }

  // Restrict admin-specific routes
  const adminRoutes = ["/admin", "/sales", "/staffs", "/settings"];
  if (adminRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl.origin));
    }
  }

  // Restrict staff-specific routes
  // if (nextUrl.pathname.startsWith("/staff") && userRole !== "STAFF") {
  //   return NextResponse.redirect(new URL("/", nextUrl.origin));
  // }

  // Enforce default pagination for product inventories
  if (
    nextUrl.pathname === "/inventories/products" &&
    !nextUrl.searchParams.get("page")
  ) {
    return NextResponse.redirect(
      new URL(
        "/inventories/products?page=1&per_page=10&sort=id%3Adesc",
        nextUrl.origin
      )
    );
  }
  if (
    nextUrl.pathname === "/orders/orders-list" &&
    !nextUrl.searchParams.get("page")
  ) {
    return NextResponse.redirect(
      new URL(
        `/orders/orders-list?page=1&per_page=10&sort=id%3Adesc`,
        // `/orders/orders-list?branch_id=${userBranchId}&page=1&per_page=10&sort=id%3Adesc`,
        nextUrl.origin
      )
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
