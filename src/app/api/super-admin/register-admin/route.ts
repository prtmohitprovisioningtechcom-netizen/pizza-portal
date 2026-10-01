import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifySuperAdminSession } from "@/lib/superadmin-session";
import { SuperAdmin } from "@/lib/models/SuperAdmin";

export async function POST(request: Request) {
  try {
    const session = await verifySuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Super Admin login required." }, { status: 401 });
    }

    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const role = typeof body.role === "string" && body.role ? body.role.trim() : "superadmin";

    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
    }

    const existing = await SuperAdmin.findByUsername(username);
    if (existing) {
      return NextResponse.json({ error: `Super Admin with username '${username}' already exists.` }, { status: 409 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await SuperAdmin.create({
      username,
      passwordHash,
      name: name || username,
      email,
      phone,
      role,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: newAdmin.id,
        username: newAdmin.username,
        name: newAdmin.name,
        role: newAdmin.role,
      },
      message: `Administrator '${newAdmin.name}' created with role '${role}'!`,
    });
  } catch (err: any) {
    console.error("Register admin error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
