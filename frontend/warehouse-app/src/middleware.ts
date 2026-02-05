import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);

export const config = {
  matcher: [
    "/profile",
    "/dashboard/:path*",
    "/ecommerce/assisted-shopping/history/:path*",
    "/ecommerce/orders/:path*",
    "/dashboard/pickup-request/:path*",
    "/dashboard/share-otp/:path*",
    "/dashboard/shipments/:path*",
    "/dashboard/packages/:path*",
  ],
};
