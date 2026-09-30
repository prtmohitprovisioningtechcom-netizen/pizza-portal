"use client";

import { useEffect, useState, useId } from "react";
import Link from "next/link";
import {
  Store,
  Pizza,
  Home,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  Lock,
  X,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Clock,
  Loader2,
  Star,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { http } from "@/services/http";

export default function PlatformLandingPage() {
  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Modal State for "Launch Store"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);
  const [registeredStoreData, setRegisteredStoreData] = useState<{ name: string; slug: string; phone: string } | null>(null);

  // Registration Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const restNameId = useId();
  const restSlugId = useId();
  const ownerNameId = useId();
  const phoneId = useId();
  const adminUserId = useId();
  const adminPassId = useId();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("platform_theme") as "dark" | "light" | null;
      if (saved) setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("platform_theme", next);
  };

  const isDark = theme === "dark";

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await http.post<{ ok: boolean; pending?: boolean; restaurantSlug?: string; message?: string }>(
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
        setRegisteredStoreData({ name, slug, phone });
        setRegistrationComplete(true);
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

  const resetModal = () => {
    setIsModalOpen(false);
    setRegistrationComplete(false);
    setName("");
    setSlug("");
    setSlugEdited(false);
    setOwnerName("");
    setPhone("");
    setUsername("");
    setPassword("");
    setErrorMsg(null);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#e60000] selection:text-white ${
      isDark ? "bg-[#0a0c10] text-white" : "bg-neutral-50 text-neutral-900"
    }`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl transition-colors ${
        isDark ? "bg-[#0a0c10]/90 border-b border-neutral-800/60" : "bg-white/90 border-b border-neutral-200/80"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-[#e60000] to-orange-500 text-white shadow-lg shadow-red-500/25 group-hover:scale-105 transition">
              <Pizza className="h-5 w-5" />
            </div>
            <div>
              <span className={`font-extrabold text-xl tracking-tight block leading-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
                Pizza<span className="text-[#e60000]">Hub</span>{" "}
                <span className="text-[10px] bg-red-950/80 border border-red-800/80 text-red-300 font-semibold px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">
                  Partner OS
                </span>
              </span>
              <span className={`text-[10px] font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                Multi-Tenant Restaurant Platform
              </span>
            </div>
          </Link>

          <nav className={`hidden md:flex items-center gap-6 text-xs font-semibold ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
            <Link href="/" className="hover:text-red-500 transition flex items-center gap-1.5 font-bold">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <Link href="/features" className="hover:text-red-500 transition">
              Features
            </Link>
            <Link href="/how-it-works" className="hover:text-red-500 transition">
              How It Works
            </Link>
            <Link href="/stores" className="hover:text-red-500 transition flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Stores</span>
            </Link>
            <Link href="/faq" className="hover:text-red-500 transition">
              FAQs
            </Link>
            <Link href="/super-admin/login" className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Super Admin</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isDark
                  ? "border-neutral-800 bg-neutral-900 text-amber-300 hover:bg-neutral-800"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 shadow-sm"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              href="/admin/login"
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                isDark
                  ? "border-neutral-800 bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 shadow-sm"
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-neutral-400" />
              <span>Partner Login</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setRegistrationComplete(false);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/30 hover:opacity-95 hover:scale-[1.02] transition cursor-pointer"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Launch Store</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Image ON TOP, Headline & Action Buttons BELOW */}
      <section className="relative overflow-hidden pt-6 pb-20 md:pt-10 md:pb-24">
        {/* Ambient background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[160px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[280px] bg-orange-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          {/* 1. Full-Width Visual Showcase Banner Image ON TOP */}
          <div className="mx-auto max-w-5xl relative">
            <div className={`relative group rounded-3xl p-2 sm:p-3 shadow-2xl backdrop-blur-md overflow-hidden border ${
              isDark ? "bg-neutral-900/70 border-neutral-800/80 shadow-black/80" : "bg-white/80 border-neutral-200 shadow-xl"
            }`}>
              {/* Top gradient highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-orange-500 to-amber-400 rounded-t-3xl" />

              {/* The Cinematic High-Tech Visual Banner */}
              <div className={`relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden rounded-2xl border ${
                isDark ? "border-neutral-800/90 bg-neutral-950" : "border-neutral-200 bg-neutral-100"
              }`}>
                <img
                  src="/partner-platform-hero.jpg"
                  alt=""
                  className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className={`absolute inset-0 ${isDark ? "bg-linear-to-t from-neutral-950/70 via-transparent to-neutral-950/20" : "bg-linear-to-t from-neutral-900/30 via-transparent to-transparent"}`} />
              </div>

              {/* Floating Bottom Action Bar */}
              <div className={`absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl p-3 sm:px-5 sm:py-3 shadow-2xl backdrop-blur-md border ${
                isDark ? "bg-neutral-950/95 border-neutral-800/90" : "bg-white/95 border-neutral-200"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-[#e60000] border border-red-500/30">
                    <ChefHat className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-bold leading-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
                      Ready to get your restaurant online?
                    </p>
                    <p className={`text-[11px] ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                      Register in 2 minutes • Verified partner onboarding
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRegistrationComplete(false);
                    setIsModalOpen(true);
                  }}
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
          <div className="mt-10 sm:mt-14 mx-auto max-w-5xl text-center space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2]">
              <span className={`block whitespace-normal sm:whitespace-nowrap drop-shadow-sm ${isDark ? "text-white" : "text-neutral-900"}`}>
                Launch Your Branded Restaurant Store
              </span>
              <span className="block mt-1 sm:mt-2 bg-linear-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent font-black tracking-tight drop-shadow-md">
                in 2 Minutes.
              </span>
            </h1>

            <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
              Get your custom ordering link (<span className="text-orange-500 font-mono font-bold">/[your-slug]</span>) and a dedicated live kitchen admin dashboard. Direct orders with 100% profit.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRegistrationComplete(false);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/30 hover:scale-105 transition cursor-pointer"
              >
                <Store className="h-4 w-4" />
                <span>Launch Your Store (Free)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/pizzahub"
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold shadow-sm transition ${
                  isDark
                    ? "border-neutral-700 bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800"
                    : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                <UtensilsCrossed className="h-4 w-4 text-[#e60000]" />
                <span>Preview Demo Store</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards: Direct Links to Dedicated Pages */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/features"
              className={`p-5 rounded-3xl border transition-all duration-200 hover:scale-[1.02] group ${
                isDark ? "bg-[#11131a] border-neutral-800/80 hover:border-red-500/40" : "bg-white border-neutral-200 hover:border-red-500/40 shadow-sm"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600/15 text-[#e60000] mb-3">
                <Store className="h-5 w-5" />
              </div>
              <h3 className={`font-black text-base group-hover:text-red-500 transition ${isDark ? "text-white" : "text-neutral-900"}`}>
                Platform Features →
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Explore the customer storefront, kitchen display, and menu manager.
              </p>
            </Link>

            <Link
              href="/how-it-works"
              className={`p-5 rounded-3xl border transition-all duration-200 hover:scale-[1.02] group ${
                isDark ? "bg-[#11131a] border-neutral-800/80 hover:border-orange-500/40" : "bg-white border-neutral-200 hover:border-orange-500/40 shadow-sm"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600/15 text-orange-500 mb-3">
                <ChefHat className="h-5 w-5" />
              </div>
              <h3 className={`font-black text-base group-hover:text-orange-500 transition ${isDark ? "text-white" : "text-neutral-900"}`}>
                How It Works →
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Simple 3-step setup: register, get verified, and take direct orders.
              </p>
            </Link>

            <Link
              href="/stores"
              className={`p-5 rounded-3xl border transition-all duration-200 hover:scale-[1.02] group ${
                isDark ? "bg-[#11131a] border-neutral-800/80 hover:border-emerald-500/40" : "bg-white border-neutral-200 hover:border-emerald-500/40 shadow-sm"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600/15 text-emerald-500 mb-3">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <h3 className={`font-black text-base group-hover:text-emerald-500 transition ${isDark ? "text-white" : "text-neutral-900"}`}>
                Live Stores Directory →
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Browse active restaurant partner storefronts and table QR codes.
              </p>
            </Link>

            <Link
              href="/faq"
              className={`p-5 rounded-3xl border transition-all duration-200 hover:scale-[1.02] group ${
                isDark ? "bg-[#11131a] border-neutral-800/80 hover:border-purple-500/40" : "bg-white border-neutral-200 hover:border-purple-500/40 shadow-sm"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600/15 text-purple-400 mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className={`font-black text-base group-hover:text-purple-400 transition ${isDark ? "text-white" : "text-neutral-900"}`}>
                Got Questions? →
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Read answers about 0% commission, domains, and data isolation.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section (No harsh borders, smooth transition) */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/20 px-3.5 py-1 text-xs font-bold text-red-400">
            <ChefHat className="h-3.5 w-3.5 text-[#e60000]" />
            <span>Join Forward-Thinking Restaurant Partners</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
            Ready to Take Your Restaurant Online?
          </h2>

          <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
            Register today and launch your branded food ordering website and kitchen admin dashboard in just 2 minutes!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                setRegistrationComplete(false);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/30 hover:scale-105 transition cursor-pointer"
            >
              <Store className="h-4 w-4" />
              <span>Launch Your Store Now (Free)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/admin/login"
              className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold transition ${
                isDark ? "border-neutral-700 bg-neutral-900/90 text-neutral-200 hover:bg-neutral-800" : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
              }`}
            >
              <Lock className="h-4 w-4 text-orange-400" />
              <span>Partner Admin Login</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Food Categories Showcase Section (Pizzas, Snacks, Meals/Khana Bagera) */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Built for Every Restaurant Concept
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
              Pizzas, Snacks, Burgers & Full-Course Meals
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Whether you run a specialty pizzeria, a fast-casual snack & burger joint, or a family dining multi-cuisine restaurant ("Khana Bagera") — our platform adapts seamlessly to your cuisine.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Pizzas & Italian */}
            <div className={`rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group ${
              isDark ? "bg-[#11131a] border-neutral-800" : "bg-white border-neutral-200"
            }`}>
              <div>
                <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-900">
                  <img
                    src="/food-pizza.jpg"
                    alt="Pizzas & Italian Dining Showcase"
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-950/90 border border-red-700/80 px-3 py-1 text-[11px] font-bold text-red-300 backdrop-blur-md">
                      🍕 Pizzerias & Italian
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className={`font-black text-xl ${isDark ? "text-white" : "text-neutral-900"}`}>
                    Pizzas, Crusts & Italian Bistros
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Designed for artisan pizzerias & cloud kitchens. Supports crust customization (Cheese Burst, Thin Crust), gourmet toppings, and size pricing (Regular, Medium, Large).
                  </p>
                  <ul className={`text-[11px] space-y-1.5 pt-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Veg & Non-Veg badge tagging</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Extra cheese & dipping sauce add-ons</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/pizzahub"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-[#e60000] to-orange-600 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
                >
                  <span>Explore Pizza Demo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Snacks, Burgers & Fast Food */}
            <div className={`rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group ${
              isDark ? "bg-[#11131a] border-neutral-800" : "bg-white border-neutral-200"
            }`}>
              <div>
                <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-900">
                  <img
                    src="/food-snacks.jpg"
                    alt="Snacks, Burgers & Fast Food Showcase"
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-950/90 border border-orange-700/80 px-3 py-1 text-[11px] font-bold text-orange-300 backdrop-blur-md">
                      🍔 Cafes & Fast Food
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className={`font-black text-xl ${isDark ? "text-white" : "text-neutral-900"}`}>
                    Burgers, Snacks & Quick Bites
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Engineered for quick-service burger points, cafe snack bars, loaded fries, cold shakes, and wraps. Ultra-fast add-to-cart and speedy checkout flow.
                  </p>
                  <ul className={`text-[11px] space-y-1.5 pt-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Meal combos & beverage pairing</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Instant mobile cart & table QR ordering</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationComplete(false);
                    setIsModalOpen(true);
                  }}
                  className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition cursor-pointer ${
                    isDark ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  <Store className="h-3.5 w-3.5 text-orange-500" />
                  <span>Launch Snack & Cafe Store</span>
                </button>
              </div>
            </div>

            {/* Card 3: Multi-Cuisine Meals ("Khana Bagera") */}
            <div className={`rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group ${
              isDark ? "bg-[#11131a] border-neutral-800" : "bg-white border-neutral-200"
            }`}>
              <div>
                <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-900">
                  <img
                    src="/food-meals.jpg"
                    alt="Multi-Cuisine Meals and Indian Dining Showcase"
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/90 border border-emerald-700/80 px-3 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
                      🍛 Meals & Dining ("Khana")
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className={`font-black text-xl ${isDark ? "text-white" : "text-neutral-900"}`}>
                    Meals, Curries & Fine Dining
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Ideal for full-service family dining restaurants, dhaba eateries, and multi-cuisine kitchens serving fragrant biryanis, gravies, thalis, and tandoori specials.
                  </p>
                  <ul className={`text-[11px] space-y-1.5 pt-2 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Full multi-course category menus</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Contactless table standee ordering</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationComplete(false);
                    setIsModalOpen(true);
                  }}
                  className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition cursor-pointer ${
                    isDark ? "border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  <Store className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Launch Restaurant Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Loved by Restaurant Owners) */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#e60000] px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              Partner Success Stories
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
              Loved by Restaurant Owners
            </h2>
            <p className={`text-xs sm:text-sm max-w-lg mx-auto leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Hear from culinary entrepreneurs who switched from third-party commission cuts to direct orders.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-colors ${
              isDark ? "bg-[#12141c] border-neutral-800" : "bg-white border-neutral-200"
            }`}>
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed italic ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  "We were paying over ₹40,000 every month in commissions to delivery apps. Launching our own store link cut our aggregator dependence dramatically. We now get 60% of our orders directly on our custom link with 0% commission!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-500/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-600/20 text-[#e60000] font-bold flex items-center justify-center">
                  RP
                </div>
                <div>
                  <p className={`text-xs font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>Rahul Patel</p>
                  <p className="text-[11px] text-neutral-400">Founder, Royal Pizza Hub</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-colors ${
              isDark ? "bg-[#12141c] border-neutral-800" : "bg-white border-neutral-200"
            }`}>
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed italic ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  "The table QR code feature is incredible for our dine-in cafe guests. Customers scan the table standee, choose their burger toppings & shakes, and the kitchen receives tickets with audio chimes immediately."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-500/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-600/20 text-orange-500 font-bold flex items-center justify-center">
                  MS
                </div>
                <div>
                  <p className={`text-xs font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>Mohit Sharma</p>
                  <p className="text-[11px] text-neutral-400">Owner, Crust & Slice Cafe</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between transition-colors ${
              isDark ? "bg-[#12141c] border-neutral-800" : "bg-white border-neutral-200"
            }`}>
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed italic ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  "What I love most for our dining restaurant is owning customer phone numbers. With aggregators, customer numbers were hidden. Now we have our own database and send weekend thali and curry specials on WhatsApp!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-500/10 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-600/20 text-emerald-500 font-bold flex items-center justify-center">
                  AK
                </div>
                <div>
                  <p className={`text-xs font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>Ananya Kapoor</p>
                  <p className="text-[11px] text-neutral-400">Owner, Royal Rasoi & Dining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 text-xs transition-colors ${
        isDark ? "bg-[#07090e] text-neutral-500" : "bg-neutral-100 text-neutral-600"
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e60000] text-white">
              <Pizza className="h-4 w-4" />
            </div>
            <div>
              <p className={`font-extrabold text-sm ${isDark ? "text-white" : "text-neutral-900"}`}>PizzaHub Partner Platform</p>
              <p className="text-[11px] text-neutral-400">Multi-Tenant Restaurant SaaS Infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/features" className="hover:text-red-500">Features</Link>
            <Link href="/how-it-works" className="hover:text-red-500">How It Works</Link>
            <Link href="/stores" className="hover:text-red-500">Live Stores</Link>
            <Link href="/faq" className="hover:text-red-500">FAQs</Link>
            <Link href="/super-admin/login" className="text-purple-400 hover:text-purple-300 font-bold">Super Admin</Link>
          </div>

          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>

      {/* Modal Dialog: "Launch Store" / Partner Registration Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors ${
            isDark ? "bg-neutral-950 border-neutral-800 text-white shadow-red-950/40" : "bg-white border-neutral-200 text-neutral-900 shadow-2xl"
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-orange-500 to-amber-400 rounded-t-3xl" />

            <button
              type="button"
              onClick={resetModal}
              className={`absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border transition cursor-pointer ${
                isDark ? "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white" : "border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <X className="h-4 w-4" />
            </button>

            {registrationComplete && registeredStoreData ? (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  <Clock className="h-8 w-8 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    Registration Received
                  </span>
                  <h2 className="text-2xl font-black">
                    {registeredStoreData.name}
                  </h2>
                  <p className="font-mono text-xs text-orange-500 font-bold">/{registeredStoreData.slug}</p>
                </div>

                <div className={`p-4 rounded-2xl border text-left text-xs space-y-2 ${
                  isDark ? "border-neutral-800 bg-neutral-900/80 text-neutral-300" : "border-neutral-200 bg-neutral-50 text-neutral-700"
                }`}>
                  <p className="font-bold text-amber-500 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Pending Super Admin Verification & Payment</span>
                  </p>
                  <p className="leading-relaxed text-[11px] opacity-80">
                    Thank you for registering! Our platform super administrator will review your application and contact you at <strong className="font-mono">{registeredStoreData.phone || "your number"}</strong> to confirm payment and activate your store.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#e60000] to-orange-600 text-xs font-bold text-white hover:opacity-95 transition cursor-pointer"
                  >
                    Done (Close)
                  </button>
                  <Link
                    href="/super-admin/login"
                    className="px-4 py-2.5 rounded-xl border border-purple-800/80 bg-purple-950/60 text-xs font-bold text-purple-300 hover:bg-purple-900 transition"
                  >
                    Super Admin Login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5 pr-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600/20 text-[#e60000] border border-red-500/30">
                    <ChefHat className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-xl">Partner Registration</h2>
                    <p className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                      Launch your store • Verified onboarding
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label htmlFor={restNameId} className="block text-xs font-semibold mb-1">
                      Restaurant Name *
                    </label>
                    <input
                      id={restNameId}
                      required
                      type="text"
                      placeholder="e.g. Royal Pizza Hub or Domino Delight"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                        isDark ? "border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500 focus:border-[#e60000]" : "border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:border-[#e60000]"
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor={restSlugId} className="block text-xs font-semibold mb-1">
                      Your Unique Store URL *
                    </label>
                    <div className={`flex items-center rounded-xl border overflow-hidden ${
                      isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-300 bg-white"
                    }`}>
                      <span className={`px-3 text-xs font-mono select-none py-2.5 border-r ${
                        isDark ? "text-neutral-400 bg-neutral-800/80 border-neutral-700/80" : "text-neutral-500 bg-neutral-100 border-neutral-200"
                      }`}>
                        /
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
                        className="w-full bg-transparent px-3 py-2.5 text-sm outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor={ownerNameId} className="block text-xs font-semibold mb-1">
                        Owner Name
                      </label>
                      <input
                        id={ownerNameId}
                        type="text"
                        placeholder="Mohit Kumar"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${
                          isDark ? "border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500" : "border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor={phoneId} className="block text-xs font-semibold mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id={phoneId}
                        required
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${
                          isDark ? "border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500" : "border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 gap-2.5 pt-1 border-t ${
                    isDark ? "border-neutral-800" : "border-neutral-200"
                  }`}>
                    <div>
                      <label htmlFor={adminUserId} className="block text-xs font-semibold mb-1">
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
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${
                          isDark ? "border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500" : "border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor={adminPassId} className="block text-xs font-semibold mb-1">
                        Admin Password *
                      </label>
                      <div className="relative">
                        <input
                          id={adminPassId}
                          required
                          minLength={6}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full rounded-xl border pl-3 pr-8 py-2 text-sm outline-none ${
                            isDark ? "border-neutral-800 bg-neutral-900 text-white placeholder-neutral-500" : "border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl bg-red-950/80 p-2.5 text-xs text-red-300 border border-red-800/80">
                      {errorMsg}
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
                        Submitting Application…
                      </>
                    ) : (
                      <>
                        Submit Partner Application
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className={`text-[11px] text-center mt-2 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                    Already an approved partner?{" "}
                    <Link href="/admin/login" className="text-orange-500 font-semibold hover:underline">
                      Login to Admin
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
