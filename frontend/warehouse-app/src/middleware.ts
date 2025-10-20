import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect specific routes, not all routes
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (pathname === "/" || pathname.startsWith("/ecommerce") || pathname.startsWith("/sign-in") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  
  // For protected routes, let NextAuth handle authentication
  // Don't interfere with the authentication flow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/assisted-shopping/:path*",
    "/shipment/:path*"
  ],
};
