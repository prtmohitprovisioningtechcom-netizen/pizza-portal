import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Restaurant } from "@/lib/models/Restaurant";
import { Admin } from "@/lib/models/Admin";
import { NavbarSettings } from "@/lib/models/NavbarSettings";
import { SiteSettings } from "@/lib/models/SiteSettings";
import { Category } from "@/lib/models/Category";
import { jsonWithAdminSession } from "@/lib/admin-session";

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

    const reserved = ["admin", "api", "order", "login", "register", "partner", "r"];
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

    // 1. Create Restaurant
    const restaurant = await Restaurant.create({
      name,
      slug,
      ownerName,
      phone,
      email,
    });

    // 2. Create Admin user
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      username,
      passwordHash,
      restaurantId: restaurant.id,
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
          restaurantInstruction: "Order fresh pizza and get fast doorstep delivery!",
          restaurantPhone: phone,
          paymentQrImage: "",
        },
      }
    );

    // 5. Create default categories
    await Category.create({
      name: "Pizzas",
      sortOrder: 1,
      image: "",
      restaurantId: restaurant.id,
    });
    await Category.create({
      name: "Beverages",
      sortOrder: 2,
      image: "",
      restaurantId: restaurant.id,
    });

    // 6. Return response with session cookie and restaurant info
    const res = await jsonWithAdminSession(
      String(admin._id),
      admin.username,
      restaurant.id,
      restaurant.slug
    );

    return res;
  } catch (e) {
    console.error("Partner register error:", e);
    return NextResponse.json(
      { error: "Failed to register restaurant partner" },
      { status: 500 }
    );
  }
}
