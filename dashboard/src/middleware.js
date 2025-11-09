// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { cookies, nextUrl } = request;
  const token = cookies.get("access_token_realEstate")?.value;

  const signInUrl = new URL("/signIn", request.url);
  const homeUrl = new URL("/", request.url);

  // ✅ Public routes (no auth required)
  if (
    nextUrl.pathname.startsWith("/signIn") ||
    nextUrl.pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // 🚫 Redirect to signIn if not authenticated (including root path '/')
  if (!token) {
    // If trying to access root without auth, redirect to signin
    if (nextUrl.pathname === "/") {
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.redirect(signInUrl);
  }

  try {
    // ✅ Verify token with backend
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/dashboard/accessor`, {
      headers: { Cookie: `access_token_realEstate=${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`❌ Invalid token: ${res.status}`);
      cookies.delete("access_token_realEstate");
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

    // 🏢 Restrict Backoffice to Admins and Managers
    if (path.startsWith("/backoffice")) {
      if (!["admin", "manager"].includes(user.role)) {
        console.warn(`🚫 Unauthorized role '${user.role}' for /backoffice`);
        return NextResponse.redirect(homeUrl);
      }
    }

    // 🏠 Restrict /listing access to verified agents only
    if (path.startsWith("/listing")) {
      if (!user.isVerifiedAgent) {
        console.warn("🚫 Unverified agent tried accessing /listing");
        return NextResponse.redirect(homeUrl);
      }
    }

    // ⚠️ Prevent verified agents from accessing /createAgentProfile
    if (path.startsWith("/createAgentProfile")) {
      if (user.isVerifiedAgent) {
        console.warn("🚫 Verified agent tried accessing /createAgentProfile");
        return NextResponse.redirect(homeUrl);
      }
    }

  } catch (error) {
    console.error("💥 Middleware error:", error);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // ✅ Protect all routes except assets and public routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico)).*)",
  ],
};