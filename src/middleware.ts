import { NextResponse } from "next/server";

export default function middleware(request: Request) {
  const token = request.headers.get("cookie")?.includes("authjs.session-token");
  const { pathname } = new URL(request.url);

  const isPrivatePage = pathname.startsWith("/dash");

  if (token && !isPrivatePage) {
    return NextResponse.redirect(new URL("/dash", request.url));
  }

  if (!token && isPrivatePage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dash/:path*",
  ],
};
