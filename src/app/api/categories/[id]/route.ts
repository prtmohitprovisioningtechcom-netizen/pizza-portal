import { NextResponse } from "next/server";
import { connectDB, isValidId } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { adminJsonResponse, isAdminSession } from "@/lib/admin-auth";
import { categoryDocToDTO } from "@/lib/category-dto";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminSession())) {
    return adminJsonResponse("Unauthorized");
  }
  try {
    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const body = await request.json();
    const existing = await Category.findById(id).lean();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const oldName = existing.name;

    const doc = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cid = Number(id);
    if (doc.name !== oldName) {
      // Every product linked to this category (by id)
      await Product.updateMany(
        { categoryId: cid },
        { $set: { category: doc.name } }
      );
      // Legacy rows that only store the old name string (no categoryId)
      await Product.updateMany(
        { category: oldName },
        { $set: { category: doc.name } }
      );
    }

    // Link products that match this category’s name but still lack categoryId
    await Product.updateMany(
      {
        category: doc.name,
        $or: [{ categoryId: null }],
      },
      { $set: { categoryId: cid } }
    );

    return NextResponse.json(categoryDocToDTO(doc));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminSession())) {
    return adminJsonResponse("Unauthorized");
  }
  try {
    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const existing = await Category.findById(id).lean();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cid = Number(id);
    const name = String(existing.name).trim();
    const productResult = await Product.deleteMany({
      $or: [{ categoryId: cid }, { category: name }, { category: existing.name }],
    });

    await Category.findByIdAndDelete(id);
    return NextResponse.json({
      ok: true,
      productsDeleted: productResult.deletedCount,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
