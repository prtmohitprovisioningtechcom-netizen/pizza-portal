import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface CategoryDoc {
  _id: string;
  id: number;
  name: string;
  sortOrder: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(r: RowDataPacket): CategoryDoc {
  return {
    _id: String(r.id),
    id: r.id,
    name: r.name,
    sortOrder: r.sortOrder ?? 0,
    image: r.image ?? "",
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const Category = {
  find() {
    return {
      sort(_sortObj?: Record<string, number>) {
        return {
          async lean(): Promise<CategoryDoc[]> {
            const rows = await query<RowDataPacket[]>(
              "SELECT id, name, sortOrder, image, createdAt, updatedAt FROM categories ORDER BY sortOrder ASC, name ASC"
            );
            return rows.map(mapRow);
          },
          async then(resolve: (val: CategoryDoc[]) => void, reject?: (reason: any) => void) {
            try {
              const rows = await query<RowDataPacket[]>(
                "SELECT id, name, sortOrder, image, createdAt, updatedAt FROM categories ORDER BY sortOrder ASC, name ASC"
              );
              resolve(rows.map(mapRow));
            } catch (err) {
              if (reject) reject(err);
            }
          },
        };
      },
    };
  },

  findOne(filter?: { name?: string }) {
    let sortDesc = false;

    const runner = {
      sort(sortObj?: Record<string, number>) {
        if (sortObj?.sortOrder === -1) sortDesc = true;
        return runner;
      },
      select(_fields?: string) {
        return runner;
      },
      async lean(): Promise<CategoryDoc | null> {
        let sql = "SELECT id, name, sortOrder, image, createdAt, updatedAt FROM categories";
        const params: any[] = [];
        if (filter?.name) {
          sql += " WHERE name = ?";
          params.push(filter.name);
        }
        if (sortDesc) {
          sql += " ORDER BY sortOrder DESC";
        }
        sql += " LIMIT 1";

        const rows = await query<RowDataPacket[]>(sql, params);
        if (!rows || rows.length === 0) return null;
        return mapRow(rows[0]);
      },
      then(resolve: (val: CategoryDoc | null) => void, reject?: (reason: any) => void) {
        return runner.lean().then(resolve, reject);
      },
    };

    return runner;
  },

  findById(id: unknown) {
    const numId = Number(id);
    return {
      async lean(): Promise<CategoryDoc | null> {
        if (!numId || isNaN(numId)) return null;
        const rows = await query<RowDataPacket[]>(
          "SELECT id, name, sortOrder, image, createdAt, updatedAt FROM categories WHERE id = ? LIMIT 1",
          [numId]
        );
        if (!rows || rows.length === 0) return null;
        return mapRow(rows[0]);
      },
      async then(resolve: (val: CategoryDoc | null) => void, reject?: (reason: any) => void) {
        try {
          if (!numId || isNaN(numId)) return resolve(null);
          const rows = await query<RowDataPacket[]>(
            "SELECT id, name, sortOrder, image, createdAt, updatedAt FROM categories WHERE id = ? LIMIT 1",
            [numId]
          );
          resolve(rows && rows.length > 0 ? mapRow(rows[0]) : null);
        } catch (err) {
          if (reject) reject(err);
        }
      },
    };
  },

  async create(data: {
    name: string;
    sortOrder?: number;
    image?: string;
  }): Promise<CategoryDoc> {
    const sortOrder = data.sortOrder ?? 0;
    const image = data.image ?? "";
    const result = await execute<ResultSetHeader>(
      "INSERT INTO categories (name, sortOrder, image) VALUES (?, ?, ?)",
      [data.name.trim(), sortOrder, image]
    );
    return {
      _id: String(result.insertId),
      id: result.insertId,
      name: data.name.trim(),
      sortOrder,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async findByIdAndUpdate(
    id: unknown,
    data: { name?: string; sortOrder?: number; image?: string },
    _options?: Record<string, unknown>
  ): Promise<CategoryDoc | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;

    const fields: string[] = [];
    const values: any[] = [];
    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name.trim());
    }
    if (data.sortOrder !== undefined) {
      fields.push("sortOrder = ?");
      values.push(Number(data.sortOrder));
    }
    if (data.image !== undefined) {
      fields.push("image = ?");
      values.push(data.image);
    }
    if (fields.length > 0) {
      values.push(numId);
      await execute(
        `UPDATE categories SET ${fields.join(", ")}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );
    }

    const rows = await query<RowDataPacket[]>(
      "SELECT id, name, sortOrder, image, createdAt, updatedAt FROM categories WHERE id = ? LIMIT 1",
      [numId]
    );
    if (!rows || rows.length === 0) return null;
    return mapRow(rows[0]);
  },

  async findByIdAndDelete(id: unknown): Promise<boolean> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return false;
    const result = await execute<ResultSetHeader>(
      "DELETE FROM categories WHERE id = ?",
      [numId]
    );
    return result.affectedRows > 0;
  },
};
