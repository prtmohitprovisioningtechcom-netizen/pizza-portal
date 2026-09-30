import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface RestaurantDoc {
  id: number;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  email: string;
  status: "active" | "pending" | "inactive" | "suspended";
  paymentStatus: "paid" | "pending" | "failed";
  paymentAmount: number;
  paymentNotes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(r: RowDataPacket): RestaurantDoc {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    ownerName: r.ownerName ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    status: (r.status as RestaurantDoc["status"]) ?? "pending",
    paymentStatus: (r.paymentStatus as RestaurantDoc["paymentStatus"]) ?? "pending",
    paymentAmount: Number(r.paymentAmount ?? 0),
    paymentNotes: r.paymentNotes ?? "",
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const Restaurant = {
  async findBySlug(slug: string): Promise<RestaurantDoc | null> {
    const s = slug.trim().toLowerCase();
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, paymentStatus, paymentAmount, paymentNotes, createdAt, updatedAt FROM restaurants WHERE slug = ? AND status = 'active' LIMIT 1",
      [s]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findBySlugAny(slug: string): Promise<RestaurantDoc | null> {
    const s = slug.trim().toLowerCase();
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, paymentStatus, paymentAmount, paymentNotes, createdAt, updatedAt FROM restaurants WHERE slug = ? LIMIT 1",
      [s]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findById(id: number | string): Promise<RestaurantDoc | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, paymentStatus, paymentAmount, paymentNotes, createdAt, updatedAt FROM restaurants WHERE id = ? LIMIT 1",
      [numId]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findAllActive(): Promise<RestaurantDoc[]> {
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, paymentStatus, paymentAmount, paymentNotes, createdAt, updatedAt FROM restaurants WHERE status = 'active' ORDER BY createdAt DESC"
    );
    return rows.map(mapRow);
  },

  async findAll(): Promise<RestaurantDoc[]> {
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, paymentStatus, paymentAmount, paymentNotes, createdAt, updatedAt FROM restaurants ORDER BY createdAt DESC"
    );
    return rows.map(mapRow);
  },

  async slugExists(slug: string): Promise<boolean> {
    const s = slug.trim().toLowerCase();
    const rows = await query<RowDataPacket[]>(
      "SELECT id FROM restaurants WHERE slug = ? LIMIT 1",
      [s]
    );
    return Boolean(rows && rows.length > 0);
  },

  async create(data: {
    name: string;
    slug: string;
    ownerName?: string;
    phone?: string;
    email?: string;
    status?: "active" | "pending" | "inactive" | "suspended";
    paymentStatus?: "paid" | "pending" | "failed";
    paymentAmount?: number;
    paymentNotes?: string;
  }): Promise<RestaurantDoc> {
    const s = data.slug.trim().toLowerCase();
    const status = data.status ?? "pending";
    const paymentStatus = data.paymentStatus ?? "pending";
    const paymentAmount = data.paymentAmount ?? 0;
    const paymentNotes = data.paymentNotes ?? "";

    const result = await execute<ResultSetHeader>(
      "INSERT INTO restaurants (name, slug, ownerName, phone, email, status, paymentStatus, paymentAmount, paymentNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.name.trim(),
        s,
        data.ownerName?.trim() ?? "",
        data.phone?.trim() ?? "",
        data.email?.trim() ?? "",
        status,
        paymentStatus,
        paymentAmount,
        paymentNotes,
      ]
    );

    return {
      id: result.insertId,
      name: data.name.trim(),
      slug: s,
      ownerName: data.ownerName?.trim() ?? "",
      phone: data.phone?.trim() ?? "",
      email: data.email?.trim() ?? "",
      status,
      paymentStatus,
      paymentAmount,
      paymentNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async updateStatus(
    id: number | string,
    updates: {
      status?: "active" | "pending" | "inactive" | "suspended";
      paymentStatus?: "paid" | "pending" | "failed";
      paymentAmount?: number;
      paymentNotes?: string;
    }
  ): Promise<boolean> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return false;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.status !== undefined) {
      fields.push("status = ?");
      values.push(updates.status);
    }
    if (updates.paymentStatus !== undefined) {
      fields.push("paymentStatus = ?");
      values.push(updates.paymentStatus);
    }
    if (updates.paymentAmount !== undefined) {
      fields.push("paymentAmount = ?");
      values.push(updates.paymentAmount);
    }
    if (updates.paymentNotes !== undefined) {
      fields.push("paymentNotes = ?");
      values.push(updates.paymentNotes);
    }

    if (fields.length === 0) return true;

    values.push(numId);
    const sql = `UPDATE restaurants SET ${fields.join(", ")} WHERE id = ?`;
    await execute(sql, values);
    return true;
  },

  async delete(id: number | string): Promise<boolean> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return false;
    await execute("DELETE FROM restaurants WHERE id = ?", [numId]);
    return true;
  },
};
