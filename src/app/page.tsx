"use client";

import { useEffect, useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Store,
  Pizza,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ChefHat,
  TrendingUp,
  ExternalLink,
  Lock,
  UtensilsCrossed,
  Globe,
  Loader2,
  Zap,
  Percent,
  Clock,
  Laptop,
  Layers,
  ChevronDown,
  HelpCircle,
  QrCode,
  Share2,
  X,
} from "lucide-react";
import { http } from "@/services/http";

interface RestaurantItem {
  id: number;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  status: string;
  createdAt?: string;
}

export default function PlatformLandingPage() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Modal State for "Launch Store"
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Registration Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Open FAQ accordion index
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const router = useRouter();
  const restNameId = useId();
  const restSlugId = useId();
  const ownerNameId = useId();
  const phoneId = useId();
  const adminUserId = useId();
  const adminPassId = useId();

  // Auto-generate slug when name changes unless manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const loadRestaurants = async () => {
    try {
      const { data } = await http.get<RestaurantItem[]>("/api/restaurants");
      setRestaurants(data);
    } catch {
      // ignore
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await http.post<{ ok: boolean; restaurantSlug?: string }>(
        "/api/partner/register",
        {
          name,
          slug,
          ownerName,
          phone,
          username,
          password,
        }
      );

      if (res.data.ok) {
        setSuccessMsg(`Congratulations! '${name}' is registered. Redirecting to your Admin Dashboard...`);
        await loadRestaurants();
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Failed to register partner restaurant. Please try again.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Partner banne ke baad mujhe kya-kya milega?",
      a: "Jaise hi aap register karenge, aapko turant 2 cheezein milengi: (1) Aapka apna branded Customer Storefront URL (/r/[your-slug]) jahan customers direct order kar sakte hain, aur (2) Aapka dedicated Admin Panel (/admin) jahan se aap apna menu, categories, offers, banners aur live kitchen orders manage kar sakte hain.",
    },
    {
      q: "Kya isme koi hidden commission ya platform fee hai?",
      a: "Bilkul nahi! Swiggy/Zomato jaise aggregators 25-30% commission lete hain, lekin hamare portal par 0% commission hai. 100% kamai seedha aapki hoti hai.",
    },
    {
      q: "Kya main apne products aur prices khud badal sakta hoon?",
      a: "Haan! Aapke Admin Dashboard me Products aur Categories ka full access milta hai. Aap jab chahein naya pizza/dish add kar sakte hain, price change kar sakte hain, ya out-of-stock mark kar sakte hain.",
    },
    {
      q: "Customers mere restaurant par order kaise karenge?",
      a: "Aapko ek unique link milta hai jaise `/r/pizzahub`. Aap is link ko WhatsApp, Instagram bio, ya QR code sticker bana kar tables par laga sakte hain. Customers bina kisi app download kiye browser me menu dekh kar direct order karenge.",
    },
    {
      q: "Kya ek hi platform par doosre restaurants mera data dekh sakte hain?",
      a: "Nahi, hamara multi-tenant database har partner ka data 100% isolate rakhta hai. Kisi bhi partner ko doosre partner ke orders, menu ya customer details ka access nahi hota.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-sans selection:bg-[#e60000] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0f1117]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-[#e60000] to-orange-500 text-white shadow-lg shadow-red-500/25 group-hover:scale-105 transition">
              <Pizza className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block leading-tight">
                Pizza<span className="text-[#e60000]">Hub</span>{" "}
                <span className="text-xs bg-red-950 border border-red-800 text-red-300 font-semibold px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">
                  Partner OS
                </span>
              </span>
              <span className="text-[10px] font-medium text-neutral-400">
                Multi-Tenant Restaurant Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-300">
            <a href="#whats-included" className="hover:text-white transition">
              What You Get
            </a>
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#live-stores" className="hover:text-white transition">
              Live Stores ({restaurants.length})
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900/80 px-4 py-2 text-xs font-bold text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800 transition"
            >
              <Lock className="h-3.5 w-3.5 text-neutral-400" />
              Partner Login
            </Link>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/30 hover:opacity-95 transition cursor-pointer"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Launch Store</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Image on top, Headline & Actions below */}
      <section className="relative overflow-hidden pt-6 pb-20 md:pt-10 md:pb-24">
        {/* Ambient background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-orange-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          {/* 1. Full-Width Visual Showcase Banner Image ON TOP */}
          <div className="mx-auto max-w-5xl relative">
            <div className="relative group rounded-3xl border border-neutral-800/80 bg-neutral-900/70 p-2 sm:p-3 shadow-2xl shadow-black/90 backdrop-blur-md overflow-hidden">
              {/* Top gradient highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-orange-500 to-amber-400 rounded-t-3xl" />

              {/* Floating Top Badge */}
              <div className="absolute top-5 left-5 z-20 hidden sm:flex items-center gap-2 rounded-full border border-neutral-700/80 bg-neutral-950/90 px-4 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Customer Storefront + Dedicated Kitchen Admin Included</span>
              </div>

              {/* The Cinematic High-Tech Visual Banner */}
              <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-950">
                <img
                  src="/partner-platform-hero.jpg"
                  alt="Restaurant Partner Platform - Admin Dashboard & Customer Storefront"
                  className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                />
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-neutral-950/20" />
              </div>

              {/* Floating Bottom Action Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-neutral-800/90 bg-neutral-950/95 p-3 sm:px-5 sm:py-3 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-[#e60000] border border-red-500/30">
                    <ChefHat className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">Ready to get your restaurant online?</p>
                    <p className="text-[11px] text-neutral-400">Setup takes only 2 minutes • 0% commission</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#e60000] to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:opacity-90 transition cursor-pointer"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Launch My Restaurant Store</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Headline & Action Buttons BELOW the Image */}
          <div className="mt-12 sm:mt-16 mx-auto max-w-4xl text-center space-y-5">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12]">
              <span className="block text-white drop-shadow-sm">
                Launch Your Branded Restaurant Store
              </span>
              <span className="block mt-1 sm:mt-2 bg-linear-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent font-black tracking-tight drop-shadow-md">
                in 2 Minutes.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Get your custom ordering link (<span className="text-orange-400 font-mono font-bold">/r/your-slug</span>) and a dedicated live kitchen admin dashboard. Direct orders with 100% profit.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] transition cursor-pointer"
              >
                <Store className="h-4 w-4" />
                <span>Launch Your Store (Free)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/r/pizzahub"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-6 py-3.5 text-sm font-bold text-neutral-200 shadow-sm hover:bg-neutral-800 hover:border-neutral-600 transition"
              >
                <UtensilsCrossed className="h-4 w-4 text-[#e60000]" />
                <span>Preview Demo Store</span>
              </Link>
            </div>

            {/* Clean Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold">
              <span className="rounded-full bg-neutral-900/90 border border-neutral-800 px-3 py-1 text-neutral-300">
                🚀 <span className="font-mono text-white">/r/[your-slug]</span>
              </span>
              <span className="rounded-full bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 text-emerald-400">
                💰 0% Commission
              </span>
              <span className="rounded-full bg-orange-950/70 border border-orange-800/80 px-3 py-1 text-orange-400">
                🔒 Isolated Admin
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Dialog: "Launch Store" / Partner Registration Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl shadow-red-950/40">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-orange-500 to-amber-400 rounded-t-3xl" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600/20 text-[#e60000] border border-red-500/30">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-xl text-white">Partner Registration</h2>
                <p className="text-xs text-neutral-400">Launch your store in 2 minutes</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label htmlFor={restNameId} className="block text-xs font-semibold text-neutral-300 mb-1">
                  Restaurant Name *
                </label>
                <input
                  id={restNameId}
                  required
                  type="text"
                  placeholder="e.g. Royal Pizza Hub or Domino Delight"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#e60000] focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor={restSlugId} className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Unique Store URL *
                </label>
                <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden focus-within:border-[#e60000] focus-within:ring-1 focus-within:ring-red-500">
                  <span className="px-3 text-xs text-neutral-400 font-mono select-none bg-neutral-800/80 border-r border-neutral-700/80 py-2.5">
                    /r/
                  </span>
                  <input
                    id={restSlugId}
                    required
                    type="text"
                    placeholder="royal-pizza"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                      setSlugEdited(true);
                    }}
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Customers will order at: <span className="font-mono text-orange-400">/r/{slug || "your-slug"}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor={ownerNameId} className="block text-xs font-semibold text-neutral-300 mb-1">
                    Owner Name
                  </label>
                  <input
                    id={ownerNameId}
                    type="text"
                    placeholder="Mohit Kumar"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#e60000]"
                  />
                </div>
                <div>
                  <label htmlFor={phoneId} className="block text-xs font-semibold text-neutral-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#e60000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-neutral-800/80">
                <div>
                  <label htmlFor={adminUserId} className="block text-xs font-semibold text-neutral-300 mb-1">
                    Admin Username *
                  </label>
                  <input
                    id={adminUserId}
                    required
                    minLength={3}
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#e60000]"
                  />
                </div>
                <div>
                  <label htmlFor={adminPassId} className="block text-xs font-semibold text-neutral-300 mb-1">
                    Admin Password *
                  </label>
                  <input
                    id={adminPassId}
                    required
                    minLength={6}
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#e60000]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-red-950/80 p-2.5 text-xs text-red-300 border border-red-800/80">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl bg-emerald-950/80 p-2.5 text-xs text-emerald-300 border border-emerald-800/80 font-medium">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-linear-to-r from-[#e60000] to-orange-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 hover:opacity-95 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting Up Your Store & Admin…
                  </>
                ) : (
                  <>
                    Launch My Restaurant Store
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-400 mt-2">
                Already a registered partner?{" "}
                <Link href="/admin/login" className="text-orange-400 font-semibold hover:underline">
                  Login to Admin
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* What You Get: The 2 Core Deliverables */}
      <section id="whats-included" className="py-20 bg-neutral-950 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e60000]">
              Partner Superpowers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Ek Hi Registration Se Milenge 2 Powerful Portals
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-3 leading-relaxed">
              Jab aap partner bante hain, toh hamara platform aapke restaurant ke liye turant
              ek <strong>Customer Storefront</strong> aur ek <strong>Kitchen Admin Panel</strong> generate kar deta hai.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Box 1: Customer Storefront */}
            <div className="rounded-3xl border border-neutral-800 bg-[#12141c] p-6 sm:p-8 flex flex-col justify-between hover:border-red-500/40 transition">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/15 text-[#e60000] border border-red-500/30">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-red-950 border border-red-800 px-3 py-1 text-xs font-bold text-red-300">
                    Portal 1: Customer Store
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-white">
                  Aapka Branded Online Storefront
                </h3>
                <p className="text-xs font-mono text-orange-400 mt-1">
                  URL: http://your-domain/r/[your-slug]
                </p>

                <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
                  Har partner ko unke restaurant ka custom URL milta hai. Customer is link par
                  jaakar direct live menu dekh sakte hain, pizza customise kar sakte hain, cart me add karke checkout kar sakte hain.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Instant Category filtering (Pizzas, Beverages, Combos, Sides)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Rich product images, veg/non-veg badges, crust & size options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Integrated live Cart & instant Order Checkout</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Live Order Tracking Page (/r/[slug]/order/[id])</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">Ready out of the box</span>
                <Link
                  href="/r/pizzahub"
                  className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition"
                >
                  <span>Preview Storefront</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Box 2: Dedicated Admin Panel */}
            <div className="rounded-3xl border border-neutral-800 bg-[#12141c] p-6 sm:p-8 flex flex-col justify-between hover:border-orange-500/40 transition">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600/15 text-orange-400 border border-orange-500/30">
                    <Laptop className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-orange-950 border border-orange-800 px-3 py-1 text-xs font-bold text-orange-300">
                    Portal 2: Kitchen & Store Admin
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-white">
                  Aapka Dedicated Admin Dashboard
                </h3>
                <p className="text-xs font-mono text-orange-400 mt-1">
                  URL: http://your-domain/admin
                </p>

                <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
                  Aapka secured back-office jahan se aap apne restaurant ka pura operation control karte hain.
                  Dusre restaurants ka data bilkul isolated rehta hai.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Real-time Live Orders Dashboard with sound & status tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Add, edit, delete menu dishes, pricing & categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Upload custom promotional banners & announcement marquis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Navbar settings, store logo & business contact customization</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">Secured with JWT</span>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
                >
                  <Lock className="h-3 w-3" />
                  <span>Partner Admin Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works: 3 Steps */}
      <section id="how-it-works" className="py-20 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e60000]">
              Simple 3 Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Kaise Kaam Karta Hai Yeh System?
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Zero technical skills required. Aapka restaurant turant live hota hai.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 relative">
              <span className="font-black text-5xl text-neutral-800 absolute top-4 right-6 select-none">
                01
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-[#e60000] mb-4">
                <Store className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-white">1. Launch Store Form</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Launch Store button click karke Restaurant Name, Store Slug, aur Admin Username/Password dalein. 1 click me store create ho jata hai.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 relative">
              <span className="font-black text-5xl text-neutral-800 absolute top-4 right-6 select-none">
                02
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400 mb-4">
                <ChefHat className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-white">2. Add Dishes & Pricing</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Apne Admin Panel me login karein. Categories (Pizzas, Drinks, Combos) banayein aur dishes add karein photo aur prices ke saath.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 relative">
              <span className="font-black text-5xl text-neutral-800 absolute top-4 right-6 select-none">
                03
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 mb-4">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-white">3. Share URL & Start Orders</h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Apna link (/r/[your-slug]) WhatsApp aur Instagram par share karein ya table QR code banayein. Direct 0% commission orders receive karein!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Partner Stores Directory */}
      <section id="live-stores" className="py-20 bg-neutral-950 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#e60000]">
                Active Network
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                Live Partner Restaurants
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Platform par registered restaurants ka live storefront dekhein.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-bold text-neutral-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{restaurants.length} Registered Partner Restaurant{restaurants.length === 1 ? "" : "s"}</span>
            </div>
          </div>

          {loadingList ? (
            <div className="py-16 text-center text-neutral-500 flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading partner restaurants…</span>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-800 p-12 text-center text-neutral-500">
              Koi restaurant registered nahi hai. Launch Store button se pehla restaurant register karein!
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl border border-neutral-800 bg-[#12141c] p-6 shadow-lg hover:border-neutral-700 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-[#e60000] border border-neutral-800 group-hover:scale-105 transition">
                        <Store className="h-5 w-5" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 text-[11px] font-bold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Live Store
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xl text-white group-hover:text-red-400 transition">
                      {r.name}
                    </h3>
                    <p className="text-xs font-mono text-orange-400 mt-1">/r/{r.slug}</p>
                    {r.phone && (
                      <p className="text-xs text-neutral-400 mt-3">
                        Contact: <span className="text-neutral-200">{r.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                    <Link
                      href={`/r/${r.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
                    >
                      <span>Visit Store</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>

                    <Link
                      href={`/r/${r.slug}/admin`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition"
                    >
                      <Lock className="h-3 w-3" />
                      <span>Admin</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* FAQs */}
      <section id="faq" className="py-20 bg-neutral-950 border-t border-neutral-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e60000]">
              Got Questions?
            </span>
            <h2 className="text-3xl font-black text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-[#12141c] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-red-400 transition cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-[#e60000]" : "text-neutral-500"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 border-t border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-red-600/20 via-orange-600/20 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Take Your Restaurant Online?
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Abhi register karein aur 2 minute me apna branded food ordering website aur kitchen admin dashboard shuru karein!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-red-600/30 hover:scale-105 transition cursor-pointer"
            >
              <Store className="h-4 w-4" />
              <span>Launch Your Store Now (Free)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/90 px-6 py-4 text-sm font-bold text-neutral-200 hover:bg-neutral-800 transition"
            >
              <Lock className="h-4 w-4 text-orange-400" />
              <span>Partner Admin Login</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-10 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e60000] text-white">
              <Pizza className="h-4 w-4" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">PizzaHub Partner Platform</p>
              <p className="text-[11px] text-neutral-500">Multi-Tenant Restaurant SaaS Infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-neutral-400">
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <a href="#whats-included" className="hover:text-white">What You Get</a>
            <Link href="/r/pizzahub" className="hover:text-white">Demo Store</Link>
            <Link href="/admin/login" className="hover:text-white">Admin Login</Link>
          </div>

          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
