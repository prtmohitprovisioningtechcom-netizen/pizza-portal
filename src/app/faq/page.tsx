"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pizza,
  Store,
  Home,
  ChevronDown,
  Sun,
  Moon,
  Lock,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  const faqs = [
    {
      q: "What happens after I submit my restaurant registration?",
      a: "Our Super Admin team immediately reviews your application and reaches out on your contact number to verify your details and process your onboarding. Once verified, your custom URL (/[your-slug]) and private Kitchen Admin (/admin) are activated instantly.",
    },
    {
      q: "What do I get once my restaurant is activated?",
      a: "Upon activation, you receive two fully integrated systems: (1) Your own branded Customer Storefront URL (/[your-slug]) where diners browse and order directly, and (2) A secure, private Kitchen & Store Admin Panel (/admin) to manage your dishes, pricing, discounts, marketing banners, and live kitchen orders in real time.",
    },
    {
      q: "Are there any hidden order commissions?",
      a: "Zero! Unlike third-party delivery apps that slice off 25% to 32% on every single dish, our platform operates on 0% order commission. You keep 100% of your earnings and receive direct orders from your customers.",
    },
    {
      q: "Can I update my menu, pricing, and availability anytime?",
      a: "Yes, completely. From your Admin Dashboard, you have full real-time control to add new pizzas, sides, and beverages, adjust prices, introduce discount deals, or toggle items out-of-stock instantly.",
    },
    {
      q: "Can other restaurants access my customer data or sales figures?",
      a: "Never. Our multi-tenant architecture guarantees complete database-level isolation. Each partner's orders, menu, customer names, phone numbers, and operational data are 100% private and protected.",
    },
    {
      q: "How do customers order at our dine-in tables?",
      a: "Every restaurant partner gets their personalized high-resolution QR code. You can print table standees or stickers. Customers simply scan the QR code with their phone camera to open your menu, select toppings, and place orders directly to your kitchen.",
    },
    {
      q: "How does the Kitchen Display System (KDS) notify our cooks?",
      a: "The Kitchen Admin Dashboard features real-time incoming order audio alerts and status workflows. When a customer places an order, a chime rings and the order card appears immediately with all dish details, crust options, and delivery address.",
    },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#0a0c10] text-white" : "bg-neutral-50 text-neutral-900"}`}>
      {/* Navbar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl transition-colors border-b ${isDark ? "bg-[#0a0c10]/90 border-neutral-800/80" : "bg-white/90 border-neutral-200"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-[#e60000] to-orange-500 text-white shadow-lg shadow-red-500/25 group-hover:scale-105 transition">
              <Pizza className="h-5 w-5" />
            </div>
            <div>
              <span className={`font-extrabold text-xl tracking-tight block leading-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
                Pizza<span className="text-[#e60000]">Hub</span>{" "}
                <span className="text-[10px] bg-red-950/80 border border-red-800/80 text-red-300 font-semibold px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">
                  Partner Hub
                </span>
              </span>
              <span className={`text-[10px] font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                Restaurant Partner & Merchant Network
              </span>
            </div>
          </Link>

          <nav className={`hidden md:flex items-center gap-6 text-xs font-semibold ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
            <Link href="/" className="hover:text-red-500 transition flex items-center gap-1.5">
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
            <Link href="/faq" className="text-[#e60000] font-bold">
              FAQs
            </Link>
            <Link href="/super-admin/login" className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Super Admin</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
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
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-10">
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

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#e60000] px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" />
            Support & Clarifications
          </span>
          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Everything you need to know about our multi-tenant partner operating system.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3.5">
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition overflow-hidden ${
                  isDark
                    ? "bg-[#12141c] border-neutral-800"
                    : "bg-white border-neutral-200 shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={`w-full flex items-center justify-between p-5 text-left text-sm font-bold transition cursor-pointer ${
                    isOpen ? "text-[#e60000]" : isDark ? "text-white hover:text-red-400" : "text-neutral-900 hover:text-red-500"
                  }`}
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-[#e60000]" : "text-neutral-400"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className={`px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                    isDark ? "text-neutral-400 border-neutral-800/80" : "text-neutral-600 border-neutral-100"
                  }`}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className={`p-8 rounded-3xl border text-center space-y-4 ${
          isDark ? "bg-linear-to-b from-[#11131a] to-neutral-950 border-neutral-800" : "bg-white border-neutral-200 shadow-xl"
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-neutral-900"}`}>
            Have more questions?
          </h2>
          <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Get in touch with our Super Admin support team or register your restaurant to explore the portal.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:scale-105 transition"
            >
              <Store className="h-4 w-4" />
              <span>Launch Your Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
