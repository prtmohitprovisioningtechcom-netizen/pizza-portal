import { MenuView } from "@/features/products/MenuView";
import { notFound } from "next/navigation";
import { Restaurant } from "@/lib/models/Restaurant";

type Params = {
  params: Promise<{ slug: string }>;
};

const RESERVED = new Set([
  "admin",
  "api",
  "order",
  "r",
  "login",
  "register",
  "partner",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "_next",
]);

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  if (RESERVED.has(slug.toLowerCase())) return { title: "Not Found" };
  const restaurant = await Restaurant.findBySlug(slug);
  if (!restaurant) return { title: "Store Not Found" };
  return {
    title: `${restaurant.name} | Order Online`,
    description: `Order fresh hot food and pizza directly from ${restaurant.name}. Fast doorstep delivery.`,
  };
}

export default async function DirectRestaurantStorePage({ params }: Params) {
  const { slug } = await params;
  if (RESERVED.has(slug.toLowerCase())) {
    notFound();
  }

  const restaurant = await Restaurant.findBySlug(slug);
  if (!restaurant) {
    notFound();
  }

  return <MenuView restaurantSlug={restaurant.slug} />;
}
