import { query, execute } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface NavbarSettingsDoc {
  _id: string;
  id: number;
  key: string;
  logoUrl: string;
  brand: string;
  tagline: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(r: RowDataPacket): NavbarSettingsDoc {
  return {
    _id: String(r.id),
    id: r.id,
    key: r.setting_key ?? "main",
    logoUrl: r.logoUrl ?? "",
    brand: r.brand ?? "",
    tagline: r.tagline ?? "",
    phone: r.phone ?? "",
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const NavbarSettings = {
  findOne({ key }: { key?: string } = {}) {
    const k = key ?? "main";
    return {
      async lean(): Promise<NavbarSettingsDoc | null> {
        const rows = await query<RowDataPacket[]>(
          "SELECT id, setting_key, logoUrl, brand, tagline, phone, createdAt, updatedAt FROM navbar_settings WHERE setting_key = ? LIMIT 1",
          [k]
        );
        if (!rows || rows.length === 0) return null;
        return mapRow(rows[0]);
      },
      then(resolve: (val: NavbarSettingsDoc | null) => void, reject?: (reason: any) => void) {
        return this.lean().then(resolve, reject);
      },
    };
  },

  async findOneAndUpdate(
    { key }: { key?: string },
    update: { $set: { logoUrl?: string; brand?: string; tagline?: string; phone?: string } },
    _opts?: Record<string, unknown>
  ): Promise<NavbarSettingsDoc> {
    const k = key ?? "main";
    const data = update.$set || update;
    const logoUrl = data.logoUrl ?? "";
    const brand = data.brand ?? "";
    const tagline = data.tagline ?? "";
    const phone = data.phone ?? "";

    await execute(
      `INSERT INTO navbar_settings (setting_key, logoUrl, brand, tagline, phone)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         logoUrl = VALUES(logoUrl),
         brand = VALUES(brand),
         tagline = VALUES(tagline),
         phone = VALUES(phone),
         updatedAt = CURRENT_TIMESTAMP`,
      [k, logoUrl, brand, tagline, phone]
    );

    const rows = await query<RowDataPacket[]>(
      "SELECT id, setting_key, logoUrl, brand, tagline, phone, createdAt, updatedAt FROM navbar_settings WHERE setting_key = ? LIMIT 1",
      [k]
    );
    return mapRow(rows[0]);
  },
};
