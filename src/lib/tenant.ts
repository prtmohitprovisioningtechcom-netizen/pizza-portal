import { Restaurant, type RestaurantDoc } from "@/lib/models/Restaurant";
import { getAdminSession } from "@/lib/admin-auth";

export async function resolveRestaurant(
  request?: Request
): Promise<RestaurantDoc | null> {
  // 1. Check URL search params
  if (request) {
    try {
      const url = new URL(request.url);
      const slug = url.searchParams.get("slug") || url.searchParams.get("restaurantSlug");
      if (slug) {
        const r = await Restaurant.findBySlug(slug);
        if (r) return r;
      }
      const id = url.searchParams.get("restaurantId");
      if (id) {
        const r = await Restaurant.findById(id);
        if (r) return r;
      }
      const headerSlug = request.headers.get("x-restaurant-slug");
      if (headerSlug) {
        const r = await Restaurant.findBySlug(headerSlug);
        if (r) return r;
      }
    } catch {
      // ignore URL parsing error
    }
  }

  // 2. Check Admin Session cookie
  try {
    const session = await getAdminSession();
    if (session?.restaurantId) {
      const r = await Restaurant.findById(session.restaurantId);
      if (r) return r;
    }
  } catch {
    // ignore
  }

  // 3. Fallback to default restaurant (pizzahub / id 1)
  const defaultRestaurant =
    (await Restaurant.findBySlug("pizzahub")) ||
    (await Restaurant.findById(1));

  return defaultRestaurant;
}
