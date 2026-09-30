import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB, isMongoConfigured } from "@/lib/mongodb";
import { Admin } from "@/lib/models/Admin";
import { Restaurant } from "@/lib/models/Restaurant";
import { jsonWithAdminSession } from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json(
        {
          error:
            "Database not configured. Set MYSQL_DATABASE / MYSQL_HOST in .env, phir dev server restart.",
        },
        { status: 503 }
      );
    }
    await connectDB();
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const restaurantSlug = typeof body.restaurantSlug === "string" ? body.restaurantSlug.trim().toLowerCase() : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    let restaurantId: number | undefined;
    if (restaurantSlug) {
      const rest = await Restaurant.findBySlug(restaurantSlug);
      if (rest) restaurantId = rest.id;
    }

    const admin = await Admin.findOne({ username, restaurantId }).lean();
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const r = await Restaurant.findById(admin.restaurantId);
    const slug = r?.slug ?? "pizzahub";

    return jsonWithAdminSession(String(admin._id), admin.username, admin.restaurantId, slug);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
