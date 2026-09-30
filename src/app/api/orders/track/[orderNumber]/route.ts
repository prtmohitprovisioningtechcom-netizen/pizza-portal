import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import type { OrderDTO, OrderItemDTO } from "@/types";

function toDTO(doc: {
  _id: string;
  orderNumber?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}): OrderDTO {
  return {
    _id: doc._id,
    orderNumber: doc.orderNumber ?? undefined,
    customerName: doc.customerName ?? undefined,
    customerPhone: doc.customerPhone ?? undefined,
    customerAddress: doc.customerAddress ?? undefined,
    items: doc.items.map(
      (i): OrderItemDTO => ({
        productId: i.productId,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })
    ),
    totalAmount: doc.totalAmount,
    status: doc.status as OrderDTO["status"],
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

type Params = { params: Promise<{ orderNumber: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { orderNumber: raw } = await params;
    const orderNumber = decodeURIComponent(raw ?? "").trim();
    if (!orderNumber) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    await connectDB();
    const doc = await Order.findOne({ orderNumber }).lean();
    if (!doc) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      toDTO({
        _id: doc._id,
        orderNumber: doc.orderNumber,
        customerName: doc.customerName,
        customerPhone: doc.customerPhone,
        customerAddress: doc.customerAddress,
        items: doc.items,
        totalAmount: doc.totalAmount,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
  }
}
