import { NextResponse } from "next/server";
import { Restaurant } from "@/lib/models/Restaurant";

export async function GET() {
  try {
    const list = await Restaurant.findAllActive();
    const response = NextResponse.json(list);
    response.headers.set("Cache-Control", "private, no-store, must-revalidate");
    return response;
  } catch (e) {
    console.error("Fetch restaurants error:", e);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}
