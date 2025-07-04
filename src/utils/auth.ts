import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: number;
  email: string;
}

export function signJwt(
  payload: JwtPayload,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h", ...options });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenPayload(token: string): JwtPayload | null {
  return verifyJwt(token);
}

export function requireAuth(
  req: NextRequest
): { payload: { userId: number; email: string } } | { response: NextResponse } {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return {
      response: NextResponse.json({ error: "Not authorized" }, { status: 401 }),
    };
  }
  const payload = getTokenPayload(token);
  if (!payload?.userId) {
    return {
      response: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
  return { payload };
}
