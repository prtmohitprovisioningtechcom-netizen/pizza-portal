import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface AdminDoc {
  _id: string;
  id: number;
  restaurantId: number;
  username: string;
  passwordHash: string;
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
        "SELECT id, restaurantId, username, passwordHash, createdAt, updatedAt FROM admins WHERE username = ?";
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
  }: {
    username: string;
    passwordHash: string;
    restaurantId?: number | string;
  }): Promise<AdminDoc> {
    const rId = Number(restaurantId) || 1;
    const result = await execute<ResultSetHeader>(
      "INSERT INTO admins (username, passwordHash, restaurantId) VALUES (?, ?, ?)",
      [username, passwordHash, rId]
    );
    return {
      _id: String(result.insertId),
      id: result.insertId,
      restaurantId: rId,
      username,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};
