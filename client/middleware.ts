import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt");

  
  

  if (!token) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }
  return NextResponse.rewrite(request.url);
}

export const config = {
  matcher: "/((?!login|register|_next/static|_next/image|favicon.ico).*)",
};
