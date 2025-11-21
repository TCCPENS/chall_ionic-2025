import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { signJwt } from "@/utils/jwt";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body || {};
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const res = await query(
    "SELECT id, username FROM users WHERE username = $1 AND password = crypt($2, password)",
    [username, password]
  );
  if (res.rowCount === 0) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const user = res.rows[0];
  const token = await signJwt({ userId: user.id, username: user.username }, Number(process.env.JWT_EXPIRES_IN || 3600));

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set({
    name: "authToken",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Number(process.env.JWT_EXPIRES_IN || 3600),
  });

  return response;
}
