import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifySuperAdminSession } from "@/lib/superadmin-session";
import { Admin } from "@/lib/models/Admin";
import { Restaurant } from "@/lib/models/Restaurant";

export async function POST(request: Request) {
  try {
    const session = await verifySuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Super Admin login required." }, { status: 401 });
    }

    const body = await request.json();
    const restaurantId = Number(body.restaurantId);
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!restaurantId || isNaN(restaurantId)) {
      return NextResponse.json({ error: "Valid restaurant ID is required." }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
    }

    const admin = await Admin.findByRestaurantId(restaurantId);
    if (!admin) {
      return NextResponse.json({ error: "Admin user for this restaurant not found." }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    const success = await Admin.updatePassword(admin.id, passwordHash);

    if (!success) {
      return NextResponse.json({ error: "Failed to update partner password." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: `Password reset successfully for '${restaurant.name}' (@${admin.username})!`,
    });
  } catch (err: any) {
    console.error("Reset partner password error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
