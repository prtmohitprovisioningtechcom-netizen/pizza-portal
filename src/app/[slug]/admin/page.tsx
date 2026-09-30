import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { Restaurant } from "@/lib/models/Restaurant";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function DirectTenantAdminRedirectPage({ params }: Params) {
  const { slug } = await params;
  const restaurant = await Restaurant.findBySlug(slug);
  if (!restaurant) redirect("/");

  const session = await getAdminSession();
  if (session && session.restaurantSlug === slug) {
    redirect("/admin");
  }

  redirect(`/admin/login?slug=${encodeURIComponent(slug)}`);
}
