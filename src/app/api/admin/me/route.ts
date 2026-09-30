import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { Restaurant } from "@/lib/models/Restaurant";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not logged in" }, { status: 401 });
  }

  let restaurantName = "Partner Restaurant";
  try {
    const r = await Restaurant.findById(session.restaurantId);
    if (r) {
      restaurantName = r.name;
    }
  } catch {
    // fallback
  }

  return NextResponse.json({
    ok: true,
    admin: {
      id: session.adminId,
      username: session.username,
      restaurantId: session.restaurantId,
      restaurantSlug: session.restaurantSlug,
      restaurantName,
    },
  });
}
