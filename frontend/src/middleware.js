// middleware.js
import { NextResponse } from "next/server";

// Middleware function
export function middleware(request) {
  const url = request.nextUrl.clone(); // Clone for safe mutation
  const state = url.searchParams.get("state"); // Get query param

  // If state is missing, empty, or only spaces, redirect to home
  if (!state || state.trim() === "") {
    url.pathname = "/"; // Redirect to homepage
    url.search = ""; // Optional: clear query params
    return NextResponse.redirect(url);
  }

  // If state exists, allow request to continue
  return NextResponse.next();
}

// Specify paths where this middleware runs
export const config = {
  matcher: ["/results/:path*"], // Run on /results and all its subpaths
};
