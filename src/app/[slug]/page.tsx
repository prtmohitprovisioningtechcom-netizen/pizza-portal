import { MenuView } from "@/features/products/MenuView";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Restaurant } from "@/lib/models/Restaurant";
import { Clock, Store, ArrowLeft, ShieldAlert } from "lucide-react";

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
  "super-admin",
  "superadmin",
  "features",
  "how-it-works",
  "stores",
  "faq",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "_next",
]);

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  if (RESERVED.has(slug.toLowerCase())) return { title: "Not Found" };
  const restaurant = await Restaurant.findBySlugAny(slug);
  if (!restaurant) return { title: "Store Not Found" };
  return {
    title: `${restaurant.name} | Order Online`,
    description: `Order fresh hot food directly from ${restaurant.name}.`,
  };
}

export default async function DirectRestaurantStorePage({ params }: Params) {
  const { slug } = await params;
  if (RESERVED.has(slug.toLowerCase())) {
    notFound();
  }

  const restaurant = await Restaurant.findBySlugAny(slug);
  if (!restaurant) {
    notFound();
  }

  // If store is pending Super Admin verification
  if (restaurant.status === "pending") {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-neutral-800 bg-[#11131a] p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-orange-500 to-red-500" />
          
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-5">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/80 border border-amber-800/80 px-3 py-1 text-xs font-bold text-amber-300 mb-3">
            <Clock className="h-3.5 w-3.5" />
            Pending Verification & Activation
          </span>

          <h1 className="text-2xl font-black text-white">{restaurant.name}</h1>
          <p className="text-xs font-mono text-orange-400 mt-1">/{restaurant.slug}</p>

          <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
            This restaurant storefront has been registered and is currently awaiting Super Admin verification. Online ordering will be live immediately upon approval.
          </p>

          <div className="mt-6 pt-5 border-t border-neutral-800/80 flex flex-col gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 py-2.5 text-xs font-bold text-neutral-200 hover:bg-neutral-800 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e60000] to-orange-600 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Partner Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if store subscription is expired or unpaid
  const isExpired = Boolean(
    restaurant.paymentStatus !== "paid" ||
    restaurant.subscriptionStatus === "expired" ||
    restaurant.subscriptionStatus === "suspended" ||
    (restaurant.billingDueDate && new Date(`${restaurant.billingDueDate}T23:59:59`) < new Date())
  );

  // If store is suspended/inactive or expired
  if (restaurant.status !== "active" || isExpired) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-neutral-800 bg-[#11131a] p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/20 text-[#e60000] border border-red-500/30 mb-5">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black text-white">{restaurant.name}</h1>
          <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
            This restaurant storefront is currently inactive or service is suspended. Please contact store administration.
          </p>

          <div className="mt-6 pt-5 border-t border-neutral-800 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-5 py-2.5 text-xs font-bold text-neutral-200 hover:bg-neutral-800 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <MenuView restaurantSlug={restaurant.slug} />;
}
