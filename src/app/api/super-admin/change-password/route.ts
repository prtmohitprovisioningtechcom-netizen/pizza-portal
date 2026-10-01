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
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Find current super admin
    const admin = await SuperAdmin.findById(session.sub);
    if (!admin) {
      return NextResponse.json({ error: "Super Admin account not found." }, { status: 404 });
    }

    // Verify current password if provided
    if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!match) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    }

    // Hash new password and save
    const newHash = await bcrypt.hash(newPassword, 10);
    const updated = await SuperAdmin.updatePassword(admin.id, newHash);
    if (!updated) {
      return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Super Admin password updated successfully!",
    });
  } catch (err: any) {
    console.error("Super Admin change password error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
