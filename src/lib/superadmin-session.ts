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
  staffRole: "superadmin" | "operator" | "support";
}

export async function createSuperAdminToken(
  adminId: number | string,
  username: string,
  name: string,
  staffRole: string = "superadmin"
): Promise<string> {
  const normalizedRole =
    staffRole === "operator" || staffRole === "support" ? staffRole : "superadmin";

  return await new SignJWT({
    sub: String(adminId),
    username,
    name,
    role: "super_admin",
    staffRole: normalizedRole,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function jsonWithSuperAdminSession(
  adminId: number | string,
  username: string,
  name: string,
  staffRole: string = "superadmin"
): Promise<NextResponse> {
  const normalizedRole =
    staffRole === "operator" || staffRole === "support" ? staffRole : "superadmin";

  const token = await createSuperAdminToken(adminId, username, name, normalizedRole);
  const res = NextResponse.json({
    ok: true,
    user: { id: adminId, username, name, role: "super_admin", staffRole: normalizedRole },
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

    const staffRole = (payload.staffRole as string) || "superadmin";
    const normalizedRole =
      staffRole === "operator" || staffRole === "support" ? staffRole : "superadmin";

    return {
      sub: String(payload.sub),
      username: String(payload.username || ""),
      name: String(payload.name || "Super Admin"),
      role: "super_admin",
      staffRole: normalizedRole,
    };
  } catch {
    return null;
  }
}
