import { NextResponse } from "next/server";
import { verifySuperAdminSession } from "@/lib/superadmin-session";

export async function GET() {
  const session = await verifySuperAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      id: Number(session.sub),
      username: session.username,
      name: session.name,
      role: session.staffRole || "superadmin",
    },
  });
}
