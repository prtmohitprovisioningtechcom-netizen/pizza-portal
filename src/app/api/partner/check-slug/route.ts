import { NextResponse } from "next/server";
import { Restaurant } from "@/lib/models/Restaurant";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = (searchParams.get("slug") || "").trim().toLowerCase();

    if (!slug || slug.length < 2) {
      return NextResponse.json({ available: false, error: "Too short" }, { status: 400 });
    }

    const reserved = [
      "admin",
      "super-admin",
      "superadmin",
      "api",
      "order",
      "orders",
      "stores",
      "features",
      "how-it-works",
      "faq",
      "login",
      "register",
      "partner",
      "r",
    ];

    if (reserved.includes(slug)) {
      return NextResponse.json({ available: false, reason: "reserved" });
    }

    const exists = await Restaurant.slugExists(slug);
    return NextResponse.json({
      available: !exists,
      slug,
      reason: exists ? "taken" : "ok",
    });
  } catch (e) {
    console.error("Check slug error:", e);
    return NextResponse.json({ error: "Failed to check slug availability" }, { status: 500 });
  }
}
