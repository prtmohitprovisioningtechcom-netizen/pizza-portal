import type { CategoryDTO, ProductDTO } from "@/types";
import { http } from "./http";

export type MenuPayload = {
  categories: CategoryDTO[];
  products: ProductDTO[];
  restaurant?: {
    id: number;
    name: string;
    slug: string;
    phone: string;
  } | null;
};

/**
 * One request = categories + products in sync. Cache-busted so browser/proxy never serves stale menu.
 */
export async function fetchMenu(slug?: string): Promise<MenuPayload> {
  const { data } = await http.get<MenuPayload>("/api/menu", {
    params: {
      _t: Date.now(),
      ...(slug ? { slug } : {}),
    },
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return data;
}
