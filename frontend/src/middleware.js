// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { cookies, nextUrl } = request;
  const token = cookies.get("user_token_realEstate")?.value;
  const url = nextUrl.clone();
  const path = nextUrl.pathname;
  const protectedPaths = [
    "/profile",
  ];

  if (
    !token &&
    protectedPaths.some((p) => nextUrl.pathname.startsWith(p))
  ) {
  return NextResponse.redirect(new URL("/signIn", nextUrl));
  }

  if (path.startsWith("/results")) {
    const state = url.searchParams.get("state");
    if (!state || state.trim() === "") {
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/results/:path*", "/profile/:path*"],
};
