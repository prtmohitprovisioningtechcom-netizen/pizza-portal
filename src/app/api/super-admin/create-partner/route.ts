import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { verifySuperAdminSession } from "@/lib/superadmin-session";
import { Restaurant } from "@/lib/models/Restaurant";
import { Admin } from "@/lib/models/Admin";
import { NavbarSettings } from "@/lib/models/NavbarSettings";
import { SiteSettings } from "@/lib/models/SiteSettings";

export async function POST(request: Request) {
  try {
    const session = await verifySuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Super Admin login required." }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    let slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const ownerName = typeof body.ownerName === "string" ? body.ownerName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = typeof body.role === "string" && body.role ? body.role.trim() : "admin";
    const status = body.status === "active" ? "active" : "pending";
    const paymentStatus = body.paymentStatus === "paid" ? "paid" : "pending";
    const paymentAmount = Number(body.paymentAmount) || 0;
    const paymentNotes = typeof body.paymentNotes === "string" ? body.paymentNotes.trim() : "";
    const monthlyFee = Number(body.monthlyFee) || 1500;
    const billingDueDate = body.billingDueDate ? String(body.billingDueDate).slice(0, 10) : null;
    const subscriptionStatus = body.subscriptionStatus || (paymentStatus === "paid" ? "active" : "expired");

    if (!name) {
      return NextResponse.json({ error: "Restaurant / Partner name is required" }, { status: 400 });
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (!slug || slug.length < 2) {
      return NextResponse.json({ error: "Valid store slug is required (e.g. 'my-cafe')" }, { status: 400 });
    }

    const reservedSlugs = [
      "admin",
      "super-admin",
      "api",
      "order",
      "stores",
      "features",
      "how-it-works",
      "faq",
      "login",
      "register",
    ];
    if (reservedSlugs.includes(slug)) {
      return NextResponse.json({ error: `Slug '/${slug}' is reserved for system routes.` }, { status: 400 });
    }

    const slugTaken = await Restaurant.slugExists(slug);
    if (slugTaken) {
      return NextResponse.json(
        { error: `Store URL slug '/${slug}' is already taken. Please choose another.` },
        { status: 409 }
      );
    }

    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Admin login username must be at least 3 characters." }, { status: 400 });
    }

    const adminExists = await Admin.exists({ username });
    if (adminExists) {
      return NextResponse.json(
        { error: `Username '${username}' is already registered. Please choose another.` },
        { status: 409 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // 1. Create Restaurant
    const restaurant = await Restaurant.create({
      name,
      slug,
      ownerName,
      phone,
      email,
      status,
      paymentStatus,
      paymentAmount,
      paymentNotes: paymentNotes || `Created by Super Admin (@${session.username})`,
      monthlyFee,
      billingDueDate,
      subscriptionStatus,
    });

    // 2. Create Admin user with specified role
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      username,
      passwordHash,
      restaurantId: restaurant.id,
      role,
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
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
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
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // Clean start - no default categories forced!

    return NextResponse.json({
      ok: true,
      restaurant,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      message: `Partner '${name}' created successfully with status '${status}' and role '${role}'!`,
    });
  } catch (err: any) {
    console.error("Super Admin create partner error:", err);
    if (err?.code === "ER_DUP_ENTRY" || err?.message?.includes("Duplicate entry")) {
      return NextResponse.json(
        { error: "This store slug URL or username already exists. Please choose a different unique slug." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
