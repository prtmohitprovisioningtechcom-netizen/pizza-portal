import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ADMIN_TOKEN_COOKIE } from "@/lib/admin-constants";
import { getJwtSecret } from "@/lib/jwt-secret";

export { ADMIN_TOKEN_COOKIE } from "@/lib/admin-constants";

export interface AdminSessionData {
  adminId: string;
  username: string;
  restaurantId: number;
  restaurantSlug: string;
}

export async function getAdminSession(): Promise<AdminSessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      adminId: String(payload.sub ?? ""),
      username: String(payload.u ?? ""),
      restaurantId: Number(payload.rId ?? 1),
      restaurantSlug: String(payload.slug ?? "pizzahub"),
    };
  } catch {
    return null;
  }
}

export async function isAdminSession(): Promise<boolean> {
  const session = await getAdminSession();
  return Boolean(session);
}

export function adminJsonResponse(message: string, status = 401) {
  return Response.json({ error: message }, { status });
}
