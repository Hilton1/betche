import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((request) => {
  const isLogged = !!request.auth;
  const { pathname } = request.nextUrl;

  const isPrivatePage = pathname.startsWith('/dash');

  if (isLogged && !isPrivatePage) {
    return NextResponse.redirect(new URL('/dash', request.nextUrl));
  }

  if (!isLogged && isPrivatePage) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

});

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dash',
    '/dash/:path',
  ]
}
