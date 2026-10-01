import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { Admin } from "@/lib/models/Admin";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin login required." }, { status: 401 });
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

    // Find the admin
    const admin = await Admin.findById(session.adminId);
    if (!admin) {
      return NextResponse.json({ error: "Admin account not found." }, { status: 404 });
    }

    // Verify current password if provided
    if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!match) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    const updated = await Admin.updatePassword(admin.id, newHash);
    if (!updated) {
      return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Password changed successfully!",
    });
  } catch (err: any) {
    console.error("Admin change password error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
