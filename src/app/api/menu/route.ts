import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { categoryDocToDTO } from "@/lib/category-dto";
import { toProductDTO } from "@/lib/product-dto";
import { resolveRestaurant } from "@/lib/tenant";

export async function GET(request: Request) {
  try {
    await connectDB();
    const restaurant = await resolveRestaurant(request);
    const rId = restaurant?.id ?? 1;

    const [catDocs, productDocs] = await Promise.all([
      Category.find({ restaurantId: rId }).sort({ sortOrder: 1, name: 1 }).lean(),
      Product.find({ restaurantId: rId })
        .populate({ path: "categoryId", select: "name" })
        .sort({ createdAt: 1 })
        .lean(),
    ]);

    const categories = catDocs.map((d) =>
      categoryDocToDTO({ ...d, _id: d._id })
    );
    const products = productDocs.map((d) =>
      toProductDTO({
        ...d,
        _id: d._id,
        variants: d.variants as { label: string; price: number }[] | undefined,
      })
    );

    const res = NextResponse.json({
      categories,
      products,
      restaurant: restaurant
        ? {
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
            phone: restaurant.phone,
          }
        : null,
    });
    res.headers.set("Cache-Control", "private, no-store, must-revalidate");
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}
