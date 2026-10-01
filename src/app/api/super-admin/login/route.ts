import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SuperAdmin } from "@/lib/models/SuperAdmin";
import { jsonWithSuperAdminSession } from "@/lib/superadmin-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const superAdmin = await SuperAdmin.findByUsername(username);
    if (!superAdmin) {
      return NextResponse.json(
        { error: "Invalid Super Admin credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, superAdmin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Super Admin credentials" },
        { status: 401 }
      );
    }

    return await jsonWithSuperAdminSession(
      superAdmin.id,
      superAdmin.username,
      superAdmin.name,
      superAdmin.role || "superadmin"
    );
  } catch (e) {
    console.error("Super Admin login error:", e);
    return NextResponse.json(
      { error: "Super Admin authentication failed" },
      { status: 500 }
    );
  }
}
