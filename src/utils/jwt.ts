import { jwtVerify, SignJWT } from "jose";
import cookie from "cookie";

const SECRET = process.env.JWT_SECRET;
const key = new TextEncoder().encode(SECRET);

export function parseAuthCookie(cookieHeader?: string | null): string | null {
  if (!cookieHeader) return null;
  try {
    const parsed = cookie.parse(cookieHeader);
    return parsed.authToken || null;
  } catch {
    return null;
  }
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as Record<string, any>;
  } catch {
    return null;
  }
}

export async function signJwt(payload: Record<string, any>, expiresInSec = 3600) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(key);
  return jwt;
}
