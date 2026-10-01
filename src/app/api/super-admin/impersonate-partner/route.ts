import { NextResponse } from "next/server";
import { verifySuperAdminSession } from "@/lib/superadmin-session";
import { Restaurant } from "@/lib/models/Restaurant";
import { Admin } from "@/lib/models/Admin";
import { jsonWithAdminSession } from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    const superAdminSession = await verifySuperAdminSession();
    if (!superAdminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Super Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const restaurantId = Number(body.restaurantId);
    if (!restaurantId || isNaN(restaurantId)) {
      return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json({ error: "Partner restaurant not found" }, { status: 404 });
    }

    let admin = await Admin.findByRestaurantId(restaurantId);
    if (!admin) {
      // Auto-fallback: check if admin with same owner name / default exists
      return NextResponse.json(
        { error: "No admin credentials found for this partner store. Please reset partner password first." },
        { status: 404 }
      );
    }

    return await jsonWithAdminSession(
      String(admin.id),
      admin.username,
      restaurant.id,
      restaurant.slug
    );
  } catch (error) {
    console.error("Super Admin partner impersonation error:", error);
    return NextResponse.json(
      { error: "Failed to establish partner session" },
      { status: 500 }
    );
  }
}
