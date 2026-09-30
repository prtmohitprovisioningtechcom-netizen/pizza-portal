import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { adminJsonResponse, getAdminSession } from "@/lib/admin-auth";
import { toProductDTO } from "@/lib/product-dto";
import { resolveProductWrite } from "@/lib/product-payload";
import { resolveRestaurant } from "@/lib/tenant";

export async function GET(request: Request) {
  try {
    await connectDB();
    const restaurant = await resolveRestaurant(request);
    const rId = restaurant?.id ?? 1;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const filter: { category?: string; restaurantId: number } = {
      restaurantId: rId,
    };
    if (category) filter.category = category;

    const docs = await Product.find(filter)
      .populate({ path: "categoryId", select: "name" })
      .sort({ createdAt: 1 })
      .lean();

    const products = docs.map((d) =>
      toProductDTO({
        ...d,
        _id: d._id,
        variants: d.variants as { label: string; price: number }[] | undefined,
      })
    );
    const response = NextResponse.json(products);
    response.headers.set(
      "Cache-Control",
      "private, no-store, must-revalidate"
    );
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return adminJsonResponse("Unauthorized");
  }
  try {
    await connectDB();
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = await resolveProductWrite(body);
    if (!parsed) {
      return NextResponse.json(
        { error: "name, category, and valid price (or types with prices) required" },
        { status: 400 }
      );
    }
    const doc = await Product.create({
      ...parsed,
      restaurantId: session.restaurantId,
    });
    return NextResponse.json(toProductDTO(doc.toObject()), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
