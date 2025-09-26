import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  (req) => {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to home page and auth pages without authentication
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/auth")) {
          return true;
        }
        
        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets like .png, .jpg, .jpeg, .svg, .gif, .webp
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)",
  ],
};
