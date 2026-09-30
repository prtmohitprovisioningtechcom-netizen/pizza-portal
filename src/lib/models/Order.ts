import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { OrderItemDTO, OrderStatus } from "@/types";

export interface OrderDoc {
  _id: string;
  id: number;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

function parseItems(raw: unknown): Array<{
  productId: string;
  name: string;
  quantity: number;
  price: number;
}> {
  if (!raw) return [];
  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.map((i: any) => ({
    productId: String(i.productId ?? ""),
    name: String(i.name ?? ""),
    quantity: Number(i.quantity ?? 1),
    price: Number(i.price ?? 0),
  }));
}

function mapRow(r: RowDataPacket): OrderDoc {
  return {
    _id: String(r.id),
    id: r.id,
    orderNumber: r.orderNumber ?? undefined,
    customerName: r.customerName ?? "",
    customerPhone: r.customerPhone ?? "",
    customerAddress: r.customerAddress ?? "",
    items: parseItems(r.items),
    totalAmount: Number(r.totalAmount ?? 0),
    status: (r.status ?? "pending") as OrderStatus,
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const Order = {
  find() {
    return {
      sort(_sortObj?: Record<string, number>) {
        return {
          async lean(): Promise<OrderDoc[]> {
            const rows = await query<RowDataPacket[]>(
              "SELECT id, orderNumber, customerName, customerPhone, customerAddress, items, totalAmount, status, createdAt, updatedAt FROM orders ORDER BY createdAt DESC"
            );
            return rows.map(mapRow);
          },
          then(resolve: (val: OrderDoc[]) => void, reject?: (reason: any) => void) {
            return this.lean().then(resolve, reject);
          },
        };
      },
    };
  },

  findOne({ orderNumber }: { orderNumber?: string }) {
    return {
      async lean(): Promise<OrderDoc | null> {
        if (!orderNumber) return null;
        const rows = await query<RowDataPacket[]>(
          "SELECT id, orderNumber, customerName, customerPhone, customerAddress, items, totalAmount, status, createdAt, updatedAt FROM orders WHERE orderNumber = ? LIMIT 1",
          [orderNumber]
        );
        if (!rows || rows.length === 0) return null;
        return mapRow(rows[0]);
      },
      then(resolve: (val: OrderDoc | null) => void, reject?: (reason: any) => void) {
        return this.lean().then(resolve, reject);
      },
    };
  },

  async create(data: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: Array<{
      productId: unknown;
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    status?: OrderStatus;
  }): Promise<OrderDoc> {
    const itemsJson = JSON.stringify(
      data.items.map((i) => ({
        productId: String(i.productId),
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      }))
    );

    const result = await execute<ResultSetHeader>(
      `INSERT INTO orders (orderNumber, customerName, customerPhone, customerAddress, items, totalAmount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.orderNumber,
        data.customerName,
        data.customerPhone,
        data.customerAddress,
        itemsJson,
        data.totalAmount,
        data.status ?? "pending",
      ]
    );

    return {
      _id: String(result.insertId),
      id: result.insertId,
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      items: parseItems(itemsJson),
      totalAmount: data.totalAmount,
      status: (data.status ?? "pending") as OrderStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async findByIdAndUpdate(
    id: unknown,
    data: { status?: string },
    _options?: Record<string, unknown>
  ): Promise<OrderDoc | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;

    if (data.status) {
      await execute(
        "UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [data.status, numId]
      );
    }

    const rows = await query<RowDataPacket[]>(
      "SELECT id, orderNumber, customerName, customerPhone, customerAddress, items, totalAmount, status, createdAt, updatedAt FROM orders WHERE id = ? LIMIT 1",
      [numId]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findByIdAndDelete(id: unknown): Promise<{ ok: boolean } | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;
    const result = await execute<ResultSetHeader>(
      "DELETE FROM orders WHERE id = ?",
      [numId]
    );
    if (result.affectedRows === 0) return null;
    return { ok: true };
  },
};
