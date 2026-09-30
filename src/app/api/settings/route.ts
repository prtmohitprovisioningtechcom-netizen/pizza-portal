import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/lib/models/SiteSettings";
import { adminJsonResponse, getAdminSession } from "@/lib/admin-auth";
import { resolveRestaurant } from "@/lib/tenant";

const KEY = "main";

function normalizeHeroImages(raw: unknown): [string, string, string] {
  const arr = Array.isArray(raw) ? raw : [];
  const urls = arr
    .slice(0, 3)
    .map((x) => (typeof x === "string" ? x.trim() : ""));
  while (urls.length < 3) urls.push("");
  return [urls[0] ?? "", urls[1] ?? "", urls[2] ?? ""];
}

function str(raw: unknown): string {
  return typeof raw === "string" ? raw.trim() : "";
}

type PublicSettings = {
  heroImages: [string, string, string];
  restaurantAddress: string;
  restaurantInstruction: string;
  restaurantPhone: string;
  paymentQrImage: string;
};

function fromDoc(
  doc: {
    heroImages?: string[];
    restaurantAddress?: string | null;
    restaurantInstruction?: string | null;
    restaurantPhone?: string | null;
    paymentQrImage?: string | null;
  } | null
): PublicSettings {
  const heroImages: [string, string, string] = doc?.heroImages?.length
    ? normalizeHeroImages(doc.heroImages)
    : ["", "", ""];
  return {
    heroImages,
    restaurantAddress: (doc?.restaurantAddress ?? "").trim(),
    restaurantInstruction: (doc?.restaurantInstruction ?? "").trim(),
    restaurantPhone: (doc?.restaurantPhone ?? "").trim(),
    paymentQrImage: (doc?.paymentQrImage ?? "").trim(),
  };
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const restaurant = await resolveRestaurant(request);
    const rId = restaurant?.id ?? 1;

    let doc = await SiteSettings.findOne({ key: KEY, restaurantId: rId }).lean();
    if (!doc && restaurant) {
      doc = await SiteSettings.findOneAndUpdate(
        { key: KEY, restaurantId: rId },
        {
          $set: {
            heroImages: ["", "", ""],
            restaurantPhone: restaurant.phone,
            restaurantAddress: "",
            restaurantInstruction: "Order fresh pizza and get fast doorstep delivery!",
            paymentQrImage: "",
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
        heroImages: ["", "", ""] as [string, string, string],
        restaurantAddress: "",
        restaurantInstruction: "",
        restaurantPhone: "",
        paymentQrImage: "",
        error: "settings_unavailable",
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
    const heroImages = normalizeHeroImages(body.heroImages);
    const restaurantAddress = str(body.restaurantAddress);
    const restaurantInstruction = str(body.restaurantInstruction);
    const restaurantPhone = str(body.restaurantPhone);
    const paymentQrImage = str(body.paymentQrImage);

    await SiteSettings.findOneAndUpdate(
      { key: KEY, restaurantId: session.restaurantId },
      {
        $set: {
          heroImages,
          restaurantAddress,
          restaurantInstruction,
          restaurantPhone,
          paymentQrImage,
        },
      }
    );
    return NextResponse.json({
      ok: true,
      heroImages,
      restaurantAddress,
      restaurantInstruction,
      restaurantPhone,
      paymentQrImage,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
