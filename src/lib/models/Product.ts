import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { ProductVariantItem } from "@/types";

export interface ProductDoc {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId?: number | string | { _id: string; name: string } | null;
  category: string;
  image: string;
  isVeg: boolean;
  variants: ProductVariantItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

function parseVariants(raw: unknown): ProductVariantItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapRow(r: RowDataPacket, populateCat = true): ProductDoc {
  const variants = parseVariants(r.variants);
  let categoryId: ProductDoc["categoryId"] = r.categoryId != null ? r.categoryId : null;
  let category = r.category ?? "";

  if (populateCat && r.categoryName) {
    category = r.categoryName;
    categoryId = {
      _id: String(r.categoryId),
      name: r.categoryName,
    };
  } else if (categoryId != null) {
    categoryId = String(categoryId);
  }

  return {
    _id: String(r.id),
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    price: Number(r.price),
    categoryId,
    category,
    image: r.image ?? "",
    isVeg: Boolean(r.isVeg),
    variants,
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const Product = {
  find(filter?: { category?: string }) {
    let shouldPopulate = false;
    let sortDirection = "ASC";

    const runner = {
      populate(_opts?: { path: string; select?: string }) {
        shouldPopulate = true;
        return runner;
      },
      sort(sortObj?: Record<string, number>) {
        if (sortObj?.createdAt === -1) {
          sortDirection = "DESC";
        } else {
          sortDirection = "ASC";
        }
        return runner;
      },
      async lean(): Promise<ProductDoc[]> {
        const sql = `
          SELECT p.*, c.name as categoryName 
          FROM products p 
          LEFT JOIN categories c ON p.categoryId = c.id
          ${filter?.category ? "WHERE p.category = ? OR c.name = ?" : ""}
          ORDER BY p.createdAt ${sortDirection}
        `;
        const params = filter?.category ? [filter.category, filter.category] : [];
        const rows = await query<RowDataPacket[]>(sql, params);
        return rows.map((r) => mapRow(r, shouldPopulate));
      },
      then(resolve: (val: ProductDoc[]) => void, reject?: (reason: any) => void) {
        return runner.lean().then(resolve, reject);
      },
    };

    return runner;
  },

  findById(id: unknown) {
    const numId = Number(id);
    let shouldPopulate = false;

    const runner = {
      populate(_opts?: { path: string; select?: string }) {
        shouldPopulate = true;
        return runner;
      },
      async lean(): Promise<ProductDoc | null> {
        if (!numId || isNaN(numId)) return null;
        const sql = `
          SELECT p.*, c.name as categoryName 
          FROM products p 
          LEFT JOIN categories c ON p.categoryId = c.id
          WHERE p.id = ? LIMIT 1
        `;
        const rows = await query<RowDataPacket[]>(sql, [numId]);
        if (!rows || rows.length === 0) return null;
        return mapRow(rows[0], shouldPopulate);
      },
      then(resolve: (val: ProductDoc | null) => void, reject?: (reason: any) => void) {
        return runner.lean().then(resolve, reject);
      },
    };

    return runner;
  },

  async create(data: {
    name: string;
    description?: string;
    price: number;
    categoryId?: unknown;
    category: string;
    image?: string;
    isVeg?: boolean;
    variants?: ProductVariantItem[];
  }) {
    const catIdNum = data.categoryId ? Number(data.categoryId) : null;
    const variantsJson = JSON.stringify(data.variants ?? []);
    const isVeg = data.isVeg === false ? 0 : 1;

    const result = await execute<ResultSetHeader>(
      `INSERT INTO products (name, description, price, categoryId, category, image, isVeg, variants) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name.trim(),
        data.description ?? "",
        data.price,
        catIdNum && !isNaN(catIdNum) ? catIdNum : null,
        data.category.trim(),
        data.image ?? "",
        isVeg,
        variantsJson,
      ]
    );

    const doc: ProductDoc = {
      _id: String(result.insertId),
      id: result.insertId,
      name: data.name.trim(),
      description: data.description ?? "",
      price: data.price,
      categoryId: catIdNum ? String(catIdNum) : undefined,
      category: data.category.trim(),
      image: data.image ?? "",
      isVeg: Boolean(data.isVeg ?? true),
      variants: data.variants ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      ...doc,
      toObject: () => doc,
    };
  },

  findByIdAndUpdate(
    id: unknown,
    data: Record<string, unknown>,
    _options?: Record<string, unknown>
  ) {
    const numId = Number(id);
    let shouldPopulate = false;

    const runner = {
      populate(_opts?: { path: string; select?: string }) {
        shouldPopulate = true;
        return runner;
      },
      async lean(): Promise<ProductDoc | null> {
        if (!numId || isNaN(numId)) return null;

        const fields: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
          fields.push("name = ?");
          values.push(String(data.name).trim());
        }
        if (data.description !== undefined) {
          fields.push("description = ?");
          values.push(String(data.description).trim());
        }
        if (data.price !== undefined) {
          fields.push("price = ?");
          values.push(Number(data.price));
        }
        if ("categoryId" in data) {
          const cid = data.categoryId ? Number(data.categoryId) : null;
          fields.push("categoryId = ?");
          values.push(cid && !isNaN(cid) ? cid : null);
        }
        if (data.category !== undefined) {
          fields.push("category = ?");
          values.push(String(data.category).trim());
        }
        if (data.image !== undefined) {
          fields.push("image = ?");
          values.push(String(data.image).trim());
        }
        if (data.isVeg !== undefined) {
          fields.push("isVeg = ?");
          values.push(data.isVeg ? 1 : 0);
        }
        if (data.variants !== undefined) {
          fields.push("variants = ?");
          values.push(JSON.stringify(data.variants));
        }

        if (fields.length > 0) {
          values.push(numId);
          await execute(
            `UPDATE products SET ${fields.join(", ")}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            values
          );
        }

        const sql = `
          SELECT p.*, c.name as categoryName 
          FROM products p 
          LEFT JOIN categories c ON p.categoryId = c.id
          WHERE p.id = ? LIMIT 1
        `;
        const rows = await query<RowDataPacket[]>(sql, [numId]);
        if (!rows || rows.length === 0) return null;
        return mapRow(rows[0], shouldPopulate);
      },
      then(resolve: (val: ProductDoc | null) => void, reject?: (reason: any) => void) {
        return runner.lean().then(resolve, reject);
      },
    };

    return runner;
  },

  async findByIdAndDelete(id: unknown): Promise<{ ok: boolean } | null> {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;
    const result = await execute<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [numId]
    );
    if (result.affectedRows === 0) return null;
    return { ok: true };
  },

  async updateMany(filter: any, update: any): Promise<{ modifiedCount: number }> {
    const sets = update.$set || update;
    const fields: string[] = [];
    const values: any[] = [];

    if (sets.category !== undefined) {
      fields.push("category = ?");
      values.push(sets.category);
    }
    if (sets.categoryId !== undefined) {
      const cid = Number(sets.categoryId);
      fields.push("categoryId = ?");
      values.push(cid && !isNaN(cid) ? cid : null);
    }

    if (fields.length === 0) return { modifiedCount: 0 };

    const wheres: string[] = [];
    if (filter.categoryId !== undefined) {
      const cid = Number(filter.categoryId);
      wheres.push("categoryId = ?");
      values.push(cid && !isNaN(cid) ? cid : null);
    }
    if (filter.category !== undefined) {
      wheres.push("category = ?");
      values.push(filter.category);
    }
    if (filter.$or) {
      // e.g. [{ categoryId: null }, { categoryId: { $exists: false } }]
      wheres.push("categoryId IS NULL");
    }

    const whereClause = wheres.length > 0 ? `WHERE ${wheres.join(" AND ")}` : "";
    const sql = `UPDATE products SET ${fields.join(", ")}, updatedAt = CURRENT_TIMESTAMP ${whereClause}`;
    const result = await execute<ResultSetHeader>(sql, values);
    return { modifiedCount: result.affectedRows };
  },

  async deleteMany(filter: any): Promise<{ deletedCount: number }> {
    let whereClause = "";
    const values: any[] = [];

    if (filter.$or && Array.isArray(filter.$or)) {
      const conditions: string[] = [];
      for (const cond of filter.$or) {
        if (cond.categoryId !== undefined) {
          const cid = Number(cond.categoryId);
          if (cid && !isNaN(cid)) {
            conditions.push("categoryId = ?");
            values.push(cid);
          }
        }
        if (cond.category !== undefined) {
          conditions.push("category = ?");
          values.push(cond.category);
        }
      }
      if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(" OR ")}`;
      }
    }

    const sql = `DELETE FROM products ${whereClause}`;
    const result = await execute<ResultSetHeader>(sql, values);
    return { deletedCount: result.affectedRows };
  },
};
