import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getJwtSecret } from "@/lib/jwt-secret";

export const SUPER_ADMIN_COOKIE = "pizza_super_admin_jwt";

export interface SuperAdminTokenPayload {
  sub: string;
  username: string;
  name: string;
  role: "super_admin";
}

export async function createSuperAdminToken(
  adminId: number | string,
  username: string,
  name: string
): Promise<string> {
  return await new SignJWT({
    sub: String(adminId),
    username,
    name,
    role: "super_admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function jsonWithSuperAdminSession(
  adminId: number | string,
  username: string,
  name: string
): Promise<NextResponse> {
  const token = await createSuperAdminToken(adminId, username, name);
  const res = NextResponse.json({
    ok: true,
    user: { id: adminId, username, name, role: "super_admin" },
  });

  res.cookies.set(SUPER_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}

export async function verifySuperAdminSession(
  tokenString?: string | null
): Promise<SuperAdminTokenPayload | null> {
  try {
    let token = tokenString;
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get(SUPER_ADMIN_COOKIE)?.value;
    }
    if (!token) return null;

    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.role !== "super_admin") return null;

    return {
      sub: String(payload.sub),
      username: String(payload.username || ""),
      name: String(payload.name || "Super Admin"),
      role: "super_admin",
    };
  } catch {
    return null;
  }
}
