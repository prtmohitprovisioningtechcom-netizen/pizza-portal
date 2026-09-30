import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface RestaurantDoc {
  id: number;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
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
    status: r.status ?? "active",
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const Restaurant = {
  async findBySlug(slug: string): Promise<RestaurantDoc | null> {
    const s = slug.trim().toLowerCase();
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, createdAt, updatedAt FROM restaurants WHERE slug = ? AND status = 'active' LIMIT 1",
      [s]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findById(id: number | string): Promise<RestaurantDoc | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, createdAt, updatedAt FROM restaurants WHERE id = ? LIMIT 1",
      [numId]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findAllActive(): Promise<RestaurantDoc[]> {
    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, slug, ownerName, phone, email, status, createdAt, updatedAt FROM restaurants WHERE status = 'active' ORDER BY createdAt DESC"
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
  }): Promise<RestaurantDoc> {
    const s = data.slug.trim().toLowerCase();
    const result = await execute<ResultSetHeader>(
      "INSERT INTO restaurants (name, slug, ownerName, phone, email, status) VALUES (?, ?, ?, ?, ?, 'active')",
      [
        data.name.trim(),
        s,
        data.ownerName?.trim() ?? "",
        data.phone?.trim() ?? "",
        data.email?.trim() ?? "",
      ]
    );

    return {
      id: result.insertId,
      name: data.name.trim(),
      slug: s,
      ownerName: data.ownerName?.trim() ?? "",
      phone: data.phone?.trim() ?? "",
      email: data.email?.trim() ?? "",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};
