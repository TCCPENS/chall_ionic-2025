import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseAuthCookie, verifyJwt } from "./utils/jwt";

export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = parseAuthCookie(request.headers.get("cookie") || "");
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    const payload = await verifyJwt(token);
    if (!payload) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("authToken");
      return res;
    }
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', request.url))
}

export const config = { matcher: ["/admin/:path*"] };
