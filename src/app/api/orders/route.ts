import { NextResponse } from "next/server";
import { connectDB, isValidId } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { adminJsonResponse, getAdminSession, isAdminSession } from "@/lib/admin-auth";
import { MIN_ORDER_AMOUNT } from "@/lib/order-constants";
import { generateOrderNumber } from "@/lib/order-number";
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

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return adminJsonResponse("Unauthorized");
  }
  try {
    await connectDB();
    const docs = await Order.find({ restaurantId: session.restaurantId })
      .sort({ createdAt: -1 })
      .lean();
    const orders = docs.map((d) =>
      toDTO({
        _id: d._id,
        orderNumber: d.orderNumber,
        customerName: d.customerName,
        customerPhone: d.customerPhone,
        customerAddress: d.customerAddress,
        items: d.items,
        totalAmount: d.totalAmount,
        status: d.status,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })
    );
    return NextResponse.json(orders);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { items, customerName, customerPhone, customerAddress, restaurantSlug } = body as {
      items?: Array<{
        productId: string;
        name: string;
        quantity: number;
        price: number;
      }>;
      customerName?: string;
      customerPhone?: string;
      customerAddress?: string;
      restaurantSlug?: string;
    };
    if (!items?.length) {
      return NextResponse.json({ error: "items required" }, { status: 400 });
    }
    const name = String(customerName ?? "").trim();
    const phone = String(customerPhone ?? "").trim();
    const address = String(customerAddress ?? "").trim();
    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "Name, mobile and address are required" },
        { status: 400 }
      );
    }
    for (const it of items) {
      if (!isValidId(it.productId)) {
        return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
      }
    }
    const totalAmount = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    if (totalAmount < MIN_ORDER_AMOUNT) {
      return NextResponse.json(
        {
          error: "minimum_order",
          minAmount: MIN_ORDER_AMOUNT,
          message: `Minimum order value is ₹ ${MIN_ORDER_AMOUNT}. Add more items to checkout.`,
        },
        { status: 400 }
      );
    }

    const { Restaurant } = await import("@/lib/models/Restaurant");
    const { resolveRestaurant } = await import("@/lib/tenant");
    const restaurant =
      (restaurantSlug ? await Restaurant.findBySlug(restaurantSlug) : null) ||
      (await resolveRestaurant(request));
    const rId = restaurant?.id ?? 1;

    let orderNumber = generateOrderNumber();
    let doc;
    try {
      doc = await Order.create({
        orderNumber,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount,
        status: "pending",
        restaurantId: rId,
      });
    } catch (e: any) {
      if (
        e?.code === 11000 ||
        e?.code === "ER_DUP_ENTRY" ||
        e?.errno === 1062
      ) {
        orderNumber = generateOrderNumber();
        doc = await Order.create({
          orderNumber,
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount,
          status: "pending",
          restaurantId: rId,
        });
      } else {
        throw e;
      }
    }
    return NextResponse.json(toDTO(doc), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
