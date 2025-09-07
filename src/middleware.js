// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // no special behavior here; withAuth will attach token
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // if no token -> not logged in
        if (!token) return false;

        const pathname = req.nextUrl.pathname;

        // protect admin routes (only allow if role === 'admin')
        if (pathname.startsWith("/admin")) {
          return token.role === "admin";
        }

        // protect provider dashboard
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/my-services") ||
          pathname.startsWith("/bookings")
        ) {
          // provider or admin can access
          return token.role === "provider" || token.role === "admin";
        }

        // protect customer-only routes if you want, else return true
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/my-services/:path*",
    "/bookings/:path*",
  ],
};
