// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { cookies, nextUrl } = request;
  const token = cookies.get("access_token_realEstate")?.value;

  const signInUrl = new URL("/signIn", request.url);
  const homeUrl = new URL("/", request.url);

  // ⚙️ Environment-aware API URL

  if (!token && !nextUrl.pathname.startsWith("/signIn")) {
    return NextResponse.redirect(signInUrl);
  }

  // ✅ Skip auth validation for public routes
  if (
    nextUrl.pathname.startsWith("/signIn") ||
    nextUrl.pathname.startsWith("/public") ||
    nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  if (token) {
    try {
      const res = await fetch(`${process.env.BACKEND_API_URL}/api/dashboard/accessor`, {
        headers: { Cookie: `access_token_realEstate=${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error(`❌ Invalid token: ${res.status}`);
        cookies.delete("access_token_realEstate"); // clear invalid cookie
        return NextResponse.redirect(signInUrl);
      }

      const data = await res.json();
      const user = data?.user;

      if (!user || !user.role) {
        console.warn("⚠️ Missing or invalid user data:", data);
        cookies.delete("access_token_realEstate");
        return NextResponse.redirect(signInUrl);
      }

      const path = nextUrl.pathname;

      if (path.startsWith("/backoffice")) {
        if (!["admin", "manager"].includes(user.role)) {
          console.warn(`🚫 Unauthorized: ${user.role} → /backoffice`);
          return NextResponse.redirect(homeUrl);
        }
      }

      if (path.startsWith("/listing")) {
        if (!user.isVerifiedAgent) {
          console.warn("🚫 Agent not verified → /listing");
          return NextResponse.redirect(homeUrl);
        }
      }
    } catch (error) {
      console.error("💥 Middleware error:", error);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)).*)",
  ],
};