import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Restaurant } from "@/lib/models/Restaurant";
import { Admin } from "@/lib/models/Admin";
import { NavbarSettings } from "@/lib/models/NavbarSettings";
import { SiteSettings } from "@/lib/models/SiteSettings";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    let slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const ownerName = typeof body.ownerName === "string" ? body.ownerName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Restaurant name is required (min 2 chars)" },
        { status: 400 }
      );
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "URL slug can only contain letters, numbers, and hyphens (-)" },
        { status: 400 }
      );
    }

    const reserved = ["admin", "api", "order", "login", "register", "partner", "r", "super-admin", "superadmin"];
    if (reserved.includes(slug)) {
      return NextResponse.json(
        { error: `The URL '${slug}' is reserved. Please pick another one.` },
        { status: 400 }
      );
    }

    if (await Restaurant.slugExists(slug)) {
      return NextResponse.json(
        { error: "This restaurant URL is already taken. Please try another name or slug." },
        { status: 409 }
      );
    }

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: "Admin username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // 1. Create Restaurant with status 'pending' and paymentStatus 'pending'
    const restaurant = await Restaurant.create({
      name,
      slug,
      ownerName,
      phone,
      email,
      status: "pending",
      paymentStatus: "pending",
      paymentAmount: 0,
    });

    // 2. Create Admin user
    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({
      username,
      passwordHash,
      restaurantId: restaurant.id,
      role: "admin",
    });

    // 3. Create default Navbar Settings
    await NavbarSettings.findOneAndUpdate(
      { key: "main", restaurantId: restaurant.id },
      {
        $set: {
          brand: name,
          tagline: "Fresh, Hot & Delicious",
          phone: phone,
          logoUrl: "",
        },
      }
    );

    // 4. Create default Site Settings
    await SiteSettings.findOneAndUpdate(
      { key: "main", restaurantId: restaurant.id },
      {
        $set: {
          heroImages: ["", "", ""],
          restaurantAddress: "",
          restaurantInstruction: "Order fresh and get fast doorstep delivery!",
          restaurantPhone: phone,
          paymentQrImage: "",
        },
      }
    );

    // No hardcoded default categories - partner starts clean with their own categories.

    // Return response informing the partner that their store is registered and pending Super Admin verification
    return NextResponse.json({
      ok: true,
      pending: true,
      restaurantId: restaurant.id,
      restaurantSlug: restaurant.slug,
      message: `Registration received for '${name}'! Your store is pending Super Admin verification & payment confirmation. Once activated, your storefront and admin login will be live.`,
    });
  } catch (e: any) {
    console.error("Partner register error:", e);
    if (e?.code === "ER_DUP_ENTRY" || e?.message?.includes("Duplicate entry")) {
      return NextResponse.json(
        { error: "This restaurant URL slug or username is already taken. Please choose another unique slug." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to register restaurant partner" },
      { status: 500 }
    );
  }
}
