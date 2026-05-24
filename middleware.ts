import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|lock|api/lock|_vercel).*)"],
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("cp-auth")?.value;
  if (!cookie) {
    return redirectToLock(req);
  }

  const expected = await sha256Hex(password);
  if (cookie !== expected) {
    return redirectToLock(req);
  }

  return NextResponse.next();
}

function redirectToLock(req: NextRequest) {
  const url = req.nextUrl.clone();
  const target = url.pathname + url.search + url.hash;
  url.pathname = "/lock";
  url.searchParams.set("next", target || "/");
  return NextResponse.redirect(url);
}
