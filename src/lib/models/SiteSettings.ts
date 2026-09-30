import { query, execute } from "@/lib/db";
import type { RowDataPacket } from "mysql2/promise";

export interface SiteSettingsDoc {
  _id: string;
  id: number;
  restaurantId: number;
  key: string;
  heroImages: string[];
  restaurantAddress: string;
  restaurantInstruction: string;
  restaurantPhone: string;
  paymentQrImage: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function parseHeroImages(raw: unknown): string[] {
  if (!raw) return ["", "", ""];
  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return ["", "", ""];
    }
  }
  if (!Array.isArray(parsed)) return ["", "", ""];
  const urls = parsed.slice(0, 3).map((x) => String(x ?? "").trim());
  while (urls.length < 3) urls.push("");
  return urls;
}

function mapRow(r: RowDataPacket): SiteSettingsDoc {
  return {
    _id: String(r.id),
    id: r.id,
    restaurantId: Number(r.restaurantId ?? 1),
    key: r.setting_key ?? "main",
    heroImages: parseHeroImages(r.heroImages),
    restaurantAddress: r.restaurantAddress ?? "",
    restaurantInstruction: r.restaurantInstruction ?? "",
    restaurantPhone: r.restaurantPhone ?? "",
    paymentQrImage: r.paymentQrImage ?? "",
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  };
}

export const SiteSettings = {
  findOne({
    key,
    restaurantId = 1,
  }: {
    key?: string;
    restaurantId?: number | string;
  } = {}) {
    const k = key ?? "main";
    const rId = Number(restaurantId) || 1;
    return {
      async lean(): Promise<SiteSettingsDoc | null> {
        const rows = await query<RowDataPacket[]>(
          "SELECT id, restaurantId, setting_key, heroImages, restaurantAddress, restaurantInstruction, restaurantPhone, paymentQrImage, createdAt, updatedAt FROM site_settings WHERE setting_key = ? AND restaurantId = ? LIMIT 1",
          [k, rId]
        );
        if (!rows || rows.length === 0) return null;
        return mapRow(rows[0]);
      },
      then(resolve: (val: SiteSettingsDoc | null) => void, reject?: (reason: any) => void) {
        return this.lean().then(resolve, reject);
      },
    };
  },

  async updateOne(_filter: any, _update: any): Promise<void> {
    // No-op
  },

  async findOneAndUpdate(
    {
      key,
      restaurantId = 1,
    }: {
      key?: string;
      restaurantId?: number | string;
    },
    update: {
      $set: {
        heroImages?: string[];
        restaurantAddress?: string;
        restaurantInstruction?: string;
        restaurantPhone?: string;
        paymentQrImage?: string;
      };
    },
    _opts?: Record<string, unknown>
  ): Promise<SiteSettingsDoc> {
    const k = key ?? "main";
    const rId = Number(restaurantId) || 1;
    const data = update.$set || update;
    const heroImagesJson = JSON.stringify(parseHeroImages(data.heroImages));
    const restaurantAddress = data.restaurantAddress ?? "";
    const restaurantInstruction = data.restaurantInstruction ?? "";
    const restaurantPhone = data.restaurantPhone ?? "";
    const paymentQrImage = data.paymentQrImage ?? "";

    await execute(
      `INSERT INTO site_settings (restaurantId, setting_key, heroImages, restaurantAddress, restaurantInstruction, restaurantPhone, paymentQrImage)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         heroImages = VALUES(heroImages),
         restaurantAddress = VALUES(restaurantAddress),
         restaurantInstruction = VALUES(restaurantInstruction),
         restaurantPhone = VALUES(restaurantPhone),
         paymentQrImage = VALUES(paymentQrImage),
         updatedAt = CURRENT_TIMESTAMP`,
      [
        rId,
        k,
        heroImagesJson,
        restaurantAddress,
        restaurantInstruction,
        restaurantPhone,
        paymentQrImage,
      ]
    );

    const rows = await query<RowDataPacket[]>(
      "SELECT id, restaurantId, setting_key, heroImages, restaurantAddress, restaurantInstruction, restaurantPhone, paymentQrImage, createdAt, updatedAt FROM site_settings WHERE setting_key = ? AND restaurantId = ? LIMIT 1",
      [k, rId]
    );
    return mapRow(rows[0]);
  },
};
