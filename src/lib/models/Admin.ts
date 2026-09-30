import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface AdminDoc {
  _id: string;
  id: number;
  username: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Admin = {
  findOne({ username }: { username: string }) {
    const fetchDoc = async (): Promise<AdminDoc | null> => {
      const rows = await query<RowDataPacket[]>(
        "SELECT id, username, passwordHash, createdAt, updatedAt FROM admins WHERE username = ? LIMIT 1",
        [username]
      );
      if (!rows || rows.length === 0) return null;
      const r = rows[0];
      return {
        _id: String(r.id),
        id: r.id,
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

  async exists({ username }: { username: string }): Promise<boolean> {
    const rows = await query<RowDataPacket[]>(
      "SELECT id FROM admins WHERE username = ? LIMIT 1",
      [username]
    );
    return Boolean(rows && rows.length > 0);
  },

  async countDocuments(): Promise<number> {
    const rows = await query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM admins"
    );
    return Number(rows?.[0]?.count ?? 0);
  },

  async create({
    username,
    passwordHash,
  }: {
    username: string;
    passwordHash: string;
  }): Promise<AdminDoc> {
    const result = await execute<ResultSetHeader>(
      "INSERT INTO admins (username, passwordHash) VALUES (?, ?)",
      [username, passwordHash]
    );
    return {
      _id: String(result.insertId),
      id: result.insertId,
      username,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};
