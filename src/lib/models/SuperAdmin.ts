import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface SuperAdminDoc {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(r: RowDataPacket): SuperAdminDoc {
  return {
    id: r.id,
    username: r.username,
    passwordHash: r.passwordHash,
    name: r.name ?? "Super Administrator",
    email: r.email ?? "",
    phone: r.phone ?? "",
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const SuperAdmin = {
  async findByUsername(username: string): Promise<SuperAdminDoc | null> {
    const u = username.trim();
    const rows = await query<RowDataPacket[]>(
      "SELECT id, username, passwordHash, name, email, phone, createdAt, updatedAt FROM super_admins WHERE username = ? LIMIT 1",
      [u]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findById(id: number | string): Promise<SuperAdminDoc | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;
    const rows = await query<RowDataPacket[]>(
      "SELECT id, username, passwordHash, name, email, phone, createdAt, updatedAt FROM super_admins WHERE id = ? LIMIT 1",
      [numId]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async create(data: {
    username: string;
    passwordHash: string;
    name: string;
    email?: string;
    phone?: string;
  }): Promise<SuperAdminDoc> {
    const result = await execute<ResultSetHeader>(
      "INSERT INTO super_admins (username, passwordHash, name, email, phone) VALUES (?, ?, ?, ?, ?)",
      [
        data.username.trim(),
        data.passwordHash,
        data.name.trim(),
        data.email?.trim() ?? "",
        data.phone?.trim() ?? "",
      ]
    );
    return {
      id: result.insertId,
      username: data.username.trim(),
      passwordHash: data.passwordHash,
      name: data.name.trim(),
      email: data.email?.trim() ?? "",
      phone: data.phone?.trim() ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};
