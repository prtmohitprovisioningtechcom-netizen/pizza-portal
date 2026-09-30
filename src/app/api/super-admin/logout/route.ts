import { NextResponse } from "next/server";
import { SUPER_ADMIN_COOKIE } from "@/lib/superadmin-session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SUPER_ADMIN_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return res;
}
