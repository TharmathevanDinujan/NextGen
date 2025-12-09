import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const adminRoutes = ["/admin"];
  const studentRoutes = ["/student"];
  const instructorRoutes = ["/instructor"];

  // Check if route is protected
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isStudentRoute = studentRoutes.some((route) => pathname.startsWith(route));
  const isInstructorRoute = instructorRoutes.some((route) => pathname.startsWith(route));

  // For protected routes, we'll handle authentication on the client side
  // because we're using localStorage which is only available client-side
  // The actual route protection will be in the page components

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/instructor/:path*",
  ],
};

