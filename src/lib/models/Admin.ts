import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface AdminDoc {
  _id: string;
  id: number;
  restaurantId: number;
  username: string;
  passwordHash: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Admin = {
  findOne({
    username,
    restaurantId,
  }: {
    username: string;
    restaurantId?: number | string;
  }) {
    const fetchDoc = async (): Promise<AdminDoc | null> => {
      let sql =
        "SELECT id, restaurantId, username, passwordHash, role, createdAt, updatedAt FROM admins WHERE username = ?";
      const params: any[] = [username];

      if (restaurantId !== undefined) {
        sql += " AND restaurantId = ?";
        params.push(Number(restaurantId));
      }

      sql += " LIMIT 1";

      const rows = await query<RowDataPacket[]>(sql, params);
      if (!rows || rows.length === 0) return null;
      const r = rows[0];
      return {
        _id: String(r.id),
        id: r.id,
        restaurantId: Number(r.restaurantId ?? 1),
        username: r.username,
        passwordHash: r.passwordHash,
        role: r.role ?? "admin",
        createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
        updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
      };
    };

    return {
      lean: fetchDoc,
      then(resolve: (val: AdminDoc | null) => void, reject?: (reason: any) => void) {
        return fetchDoc().then(resolve, reject);
      },
    };
  },

  async findById(id: number | string): Promise<AdminDoc | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;
    const rows = await query<RowDataPacket[]>(
      "SELECT id, restaurantId, username, passwordHash, role, createdAt, updatedAt FROM admins WHERE id = ? LIMIT 1",
      [numId]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      _id: String(r.id),
      id: r.id,
      restaurantId: Number(r.restaurantId ?? 1),
      username: r.username,
      passwordHash: r.passwordHash,
      role: r.role ?? "admin",
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    };
  },

  async findByRestaurantId(restaurantId: number | string): Promise<AdminDoc | null> {
    const rId = Number(restaurantId);
    if (!rId || isNaN(rId)) return null;
    const rows = await query<RowDataPacket[]>(
      "SELECT id, restaurantId, username, passwordHash, role, createdAt, updatedAt FROM admins WHERE restaurantId = ? ORDER BY id ASC LIMIT 1",
      [rId]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      _id: String(r.id),
      id: r.id,
      restaurantId: Number(r.restaurantId ?? 1),
      username: r.username,
      passwordHash: r.passwordHash,
      role: r.role ?? "admin",
      createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
    };
  },

  async exists({
    username,
    restaurantId,
  }: {
    username: string;
    restaurantId?: number | string;
  }): Promise<boolean> {
    let sql = "SELECT id FROM admins WHERE username = ?";
    const params: any[] = [username];
    if (restaurantId !== undefined) {
      sql += " AND restaurantId = ?";
      params.push(Number(restaurantId));
    }
    sql += " LIMIT 1";
    const rows = await query<RowDataPacket[]>(sql, params);
    return Boolean(rows && rows.length > 0);
  },

  async countDocuments(restaurantId?: number | string): Promise<number> {
    let sql = "SELECT COUNT(*) as count FROM admins";
    const params: any[] = [];
    if (restaurantId !== undefined) {
      sql += " WHERE restaurantId = ?";
      params.push(Number(restaurantId));
    }
    const rows = await query<RowDataPacket[]>(sql, params);
    return Number(rows?.[0]?.count ?? 0);
  },

  async create({
    username,
    passwordHash,
    restaurantId = 1,
    role = "admin",
  }: {
    username: string;
    passwordHash: string;
    restaurantId?: number | string;
    role?: string;
  }): Promise<AdminDoc> {
    const rId = Number(restaurantId) || 1;
    const rRole = role?.trim() || "admin";
    const result = await execute<ResultSetHeader>(
      "INSERT INTO admins (username, passwordHash, restaurantId, role) VALUES (?, ?, ?, ?)",
      [username, passwordHash, rId, rRole]
    );
    return {
      _id: String(result.insertId),
      id: result.insertId,
      restaurantId: rId,
      username,
      passwordHash,
      role: rRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async updatePassword(id: number | string, passwordHash: string): Promise<boolean> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return false;
    await execute("UPDATE admins SET passwordHash = ?, updatedAt = NOW() WHERE id = ?", [
      passwordHash,
      numId,
    ]);
    return true;
  },

  async updatePasswordByRestaurant(restaurantId: number | string, passwordHash: string): Promise<boolean> {
    const rId = Number(restaurantId);
    if (!rId || isNaN(rId)) return false;
    await execute("UPDATE admins SET passwordHash = ?, updatedAt = NOW() WHERE restaurantId = ?", [
      passwordHash,
      rId,
    ]);
    return true;
  },
};
