import { MenuView } from "@/features/products/MenuView";
import { notFound } from "next/navigation";
import { Restaurant } from "@/lib/models/Restaurant";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const restaurant = await Restaurant.findBySlug(slug);
  if (!restaurant) return { title: "Store Not Found" };
  return {
    title: `${restaurant.name} | Order Online`,
    description: `Order fresh hot pizza & food directly from ${restaurant.name}. Fast delivery to your doorstep.`,
  };
}

export default async function RestaurantStorePage({ params }: Params) {
  const { slug } = await params;
  const restaurant = await Restaurant.findBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  return <MenuView restaurantSlug={restaurant.slug} />;
}
