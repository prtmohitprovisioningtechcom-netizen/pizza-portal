"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Pizza,
  Smartphone,
  Laptop,
  QrCode,
  CheckCircle2,
  Lock,
  Store,
  Home,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  ShoppingBag,
  BellRing,
  Flame,
  UtensilsCrossed,
  ArrowLeft,
} from "lucide-react";

export default function FeaturesPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<"storefront" | "kitchen" | "menu" | "qrcode">("storefront");

  useEffect(() => {
    const saved = localStorage.getItem("platform_theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("platform_theme", next);
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#0a0c10] text-white" : "bg-neutral-50 text-neutral-900"}`}>
      {/* Navbar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl transition-colors border-b ${isDark ? "bg-[#0a0c10]/90 border-neutral-800/80" : "bg-white/90 border-neutral-200"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-13 w-13 sm:h-15 sm:w-15 shrink-0 overflow-hidden rounded-full ring-2.5 ring-[#ffde00] bg-white shadow-md group-hover:scale-105 transition">
              <Image
                src="/kya-khaugey.png"
                alt="Khaoge Kya?"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 52px, 60px"
                priority
              />
            </div>
            <div>
              <span className={`font-black text-xl tracking-tight block leading-tight ${isDark ? "text-white" : "text-[#0b2545]"}`}>
                KHA<span className="text-[#e51b24]">OGE</span> KYA<span className="text-[#e51b24]">?</span>
              </span>
              <span className={`text-[10px] font-bold tracking-wide uppercase ${isDark ? "text-[#ffde00]/90" : "text-[#e51b24]"}`}>
                Good Food For Good Moments
              </span>
            </div>
          </Link>

          <nav className={`hidden md:flex items-center gap-6 text-xs font-semibold ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
            <Link href="/" className="hover:text-red-500 transition flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <Link href="/features" className="text-[#e60000] font-bold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Features</span>
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
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
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

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Launch Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-12">
        <div>
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              isDark
                ? "border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 shadow-xs"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← Back to Home</span>
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#e60000] px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Platform Capabilities
          </span>
          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
            Engineered for High-Growth Restaurant Brands
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Discover every feature included in your Partner OS: direct customer storefronts, live kitchen displays, real-time menu management, and contactless table QR codes.
          </p>

          {/* Interactive Switcher */}
          <div className={`flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl border max-w-xl mx-auto mt-6 ${isDark ? "bg-neutral-900/80 border-neutral-800" : "bg-neutral-100 border-neutral-200"}`}>
            <button
              type="button"
              onClick={() => setActiveTab("storefront")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "storefront"
                  ? "bg-[#e60000] text-white shadow-md"
                  : isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Customer Store</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kitchen")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "kitchen"
                  ? "bg-[#e60000] text-white shadow-md"
                  : isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>Kitchen KDS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("menu")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "menu"
                  ? "bg-[#e60000] text-white shadow-md"
                  : isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Pizza className="h-3.5 w-3.5" />
              <span>Menu Manager</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("qrcode")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "qrcode"
                  ? "bg-[#e60000] text-white shadow-md"
                  : isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Table QR</span>
            </button>
          </div>
        </div>

        {/* Tab Showcase Card */}
        <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors ${
          isDark ? "bg-[#11131a] border-neutral-800" : "bg-white border-neutral-200"
        }`}>
          {activeTab === "storefront" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#e60000] px-3 py-1 text-xs font-bold">
                  <Smartphone className="h-3.5 w-3.5" />
                  Direct Online Ordering
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Mobile-Optimized Storefront
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                  Every partner receives a clean direct link (<span className="text-orange-500 font-mono font-bold">/[your-slug]</span>) where customers can browse dishes, customize pizza toppings, and checkout in seconds without app downloads.
                </p>
                <ul className={`space-y-2.5 text-xs ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Instant Category filtering (Pizzas, Burgers, Sides, Beverages)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Crust selection, cheese burst upgrades & size pricing (Regular, Medium, Large)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Fast live cart and instant order tracking</span>
                  </li>
                </ul>
              </div>

              <div className={`lg:col-span-6 rounded-2xl border p-5 shadow-xl ${isDark ? "bg-neutral-900/90 border-neutral-800" : "bg-neutral-50 border-neutral-200"}`}>
                <div className="flex items-center justify-between border-b pb-3 mb-4 text-xs">
                  <span className="font-mono text-orange-500 font-bold">https://portal.com/your-slug</span>
                  <span className="text-emerald-500 font-bold">● Active Store</span>
                </div>
                <div className="space-y-3">
                  <div className={`rounded-xl border p-3 flex items-center justify-between ${isDark ? "bg-neutral-950 border-neutral-800" : "bg-white border-neutral-200"}`}>
                    <div>
                      <p className={`text-xs font-bold ${isDark ? "text-white" : "text-neutral-900"}`}>Tandoori Paneer Delight</p>
                      <p className="text-[10px] text-neutral-400">Crispy crust, spicy paneer & capsicum</p>
                      <p className="text-xs font-black text-orange-500 font-mono mt-0.5">₹349</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#e60000] text-white text-[11px] font-bold">+ Add</span>
                  </div>
                  <div className={`rounded-xl border p-2.5 flex items-center justify-between text-xs ${isDark ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Cart: 1 Item (₹349)
                    </span>
                    <span className="font-bold text-white bg-emerald-600 px-3 py-1 rounded-md text-[10px]">
                      Checkout →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "kitchen" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1 text-xs font-bold">
                  <Laptop className="h-3.5 w-3.5" />
                  Kitchen Display System (KDS)
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Live Kitchen Dispatch
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                  Audio chime alerts sound immediately as new orders arrive. Staff can progress tickets from Pending to Preparing, Out for Delivery, and Delivered.
                </p>
              </div>

              <div className={`lg:col-span-6 rounded-2xl border p-5 shadow-xl ${isDark ? "bg-neutral-900/90 border-neutral-800" : "bg-neutral-50 border-neutral-200"}`}>
                <div className="flex items-center justify-between border-b pb-3 mb-4 text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-500">
                    <BellRing className="h-3.5 w-3.5 animate-pulse" />
                    Kitchen Live Ticket
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-500 font-bold px-2.5 py-0.5 rounded-full">
                    Preparing
                  </span>
                </div>
                <div className={`rounded-xl border p-3.5 space-y-2 ${isDark ? "bg-neutral-950 border-neutral-800" : "bg-white border-neutral-200"}`}>
                  <p className="text-xs font-bold">#ORD-1042 • Rohan Sharma</p>
                  <p className="text-[11px] text-neutral-400">1x Farmhouse Special Pizza (Large), 1x Garlic Bread</p>
                  <p className="text-xs font-mono font-bold text-orange-500">Total: ₹589 • COD</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "menu" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 text-xs font-bold">
                  <Pizza className="h-3.5 w-3.5" />
                  Full Menu Autonomy
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Instant Menu & Pricing Updates
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                  No waiting for third-party aggregator approval. Add dishes, change prices, toggle out-of-stock items, and upload promo banners instantly.
                </p>
              </div>

              <div className={`lg:col-span-6 rounded-2xl border p-5 shadow-xl ${isDark ? "bg-neutral-900/90 border-neutral-800" : "bg-neutral-50 border-neutral-200"}`}>
                <div className="flex items-center justify-between border-b pb-3 mb-4 text-xs">
                  <span className="font-bold">Live Dish Editor</span>
                  <span className="text-emerald-500 text-[11px] font-bold">Syncs Instantly</span>
                </div>
                <div className={`rounded-xl border p-3.5 space-y-2 ${isDark ? "bg-neutral-950 border-neutral-800" : "bg-white border-neutral-200"}`}>
                  <p className="text-xs font-bold">Double Cheese Margherita Pizza</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1.5 rounded bg-neutral-500/10 font-mono">Reg: ₹199</div>
                    <div className="p-1.5 rounded bg-neutral-500/10 font-mono">Med: ₹349</div>
                    <div className="p-1.5 rounded bg-neutral-500/10 font-mono">Lrg: ₹499</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "qrcode" && (
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1 text-xs font-bold">
                  <QrCode className="h-3.5 w-3.5" />
                  Table Standee QR
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-neutral-900"}`}>
                  Contactless Dine-In Ordering
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                  Print table standees with your unique QR code. Guests scan with any camera, order on their phones, and tickets go straight to your kitchen.
                </p>
              </div>

              <div className={`lg:col-span-6 rounded-2xl border p-6 text-center shadow-xl ${isDark ? "bg-neutral-900/90 border-neutral-800" : "bg-neutral-50 border-neutral-200"}`}>
                <div className="p-3 rounded-2xl bg-white shadow-xl inline-block mb-3">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/pizzahub"
                    alt="Sample QR Code"
                    className="w-36 h-36 mx-auto"
                  />
                </div>
                <p className="font-extrabold text-sm">Scan to Order • Table Standee</p>
                <p className="text-xs text-orange-500 font-mono mt-0.5">http://localhost:3000/pizzahub</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-10 text-xs transition-colors border-t ${isDark ? "bg-neutral-950 border-neutral-800 text-neutral-500" : "bg-neutral-100 border-neutral-200 text-neutral-600"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-extrabold text-sm">PizzaHub Partner Platform</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-red-500">Home</Link>
            <Link href="/features" className="hover:text-red-500">Features</Link>
            <Link href="/how-it-works" className="hover:text-red-500">How It Works</Link>
            <Link href="/stores" className="hover:text-red-500">Live Stores</Link>
            <Link href="/faq" className="hover:text-red-500">FAQs</Link>
          </div>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
