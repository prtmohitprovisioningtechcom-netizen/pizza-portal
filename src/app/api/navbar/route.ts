import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { NavbarSettings } from "@/lib/models/NavbarSettings";
import { adminJsonResponse, getAdminSession } from "@/lib/admin-auth";
import { resolveRestaurant } from "@/lib/tenant";

const KEY = "main";

function str(raw: unknown): string {
  return typeof raw === "string" ? raw.trim() : "";
}

export type NavbarPublicDTO = {
  logoUrl: string;
  brand: string;
  tagline: string;
  phone: string;
};

function fromDoc(doc: {
  logoUrl?: string | null;
  brand?: string | null;
  tagline?: string | null;
  phone?: string | null;
} | null): NavbarPublicDTO {
  return {
    logoUrl: (doc?.logoUrl ?? "").trim() || "/kya-khaugey.png",
    brand: (doc?.brand ?? "").trim() || "Khaoge Kya?",
    tagline: (doc?.tagline ?? "").trim() || "Good Food For Good Moments",
    phone: (doc?.phone ?? "").trim(),
  };
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const restaurant = await resolveRestaurant(request);
    const rId = restaurant?.id ?? 1;

    let doc = await NavbarSettings.findOne({ key: KEY, restaurantId: rId }).lean();
    if (!doc && restaurant) {
      doc = await NavbarSettings.findOneAndUpdate(
        { key: KEY, restaurantId: rId },
        {
          $set: {
            brand: restaurant.name || "Khaoge Kya?",
            phone: restaurant.phone,
            tagline: "Good Food For Good Moments",
            logoUrl: "/kya-khaugey.png",
          },
        }
      );
    }

    const response = NextResponse.json(fromDoc(doc));
    response.headers.set(
      "Cache-Control",
      "private, no-store, must-revalidate"
    );
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        logoUrl: "/kya-khaugey.png",
        brand: "Khaoge Kya?",
        tagline: "Good Food For Good Moments",
        phone: "",
        error: "navbar_unavailable",
      },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return adminJsonResponse("Unauthorized");
  }
  try {
    await connectDB();
    const body = await request.json();
    const logoUrl = str(body.logoUrl);
    const brand = str(body.brand);
    const tagline =
      body.tagline === undefined || body.tagline === null
        ? ""
        : String(body.tagline).trim();
    const phone = str(body.phone);

    await NavbarSettings.findOneAndUpdate(
      { key: KEY, restaurantId: session.restaurantId },
      { $set: { logoUrl, brand, tagline, phone } }
    );
    return NextResponse.json({
      ok: true,
      logoUrl,
      brand,
      tagline,
      phone,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save navbar" }, { status: 500 });
  }
}
