"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Pizza,
  Store,
  Home,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Sun,
  Moon,
  Lock,
  Clock,
  Sparkles,
  Smartphone,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function HowItWorksPage() {
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
            <Link href="/features" className="hover:text-red-500 transition">
              Features
            </Link>
            <Link href="/how-it-works" className="text-[#e60000] font-bold">
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
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-10">
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
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
            From Registration to Taking Orders in Minutes
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Our streamlined onboarding process is automated, secure, and requires zero technical skills.
          </p>
        </div>

        {/* 3 Detailed Steps */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className={`rounded-3xl border p-6 relative flex flex-col justify-between transition-colors ${
            isDark ? "bg-[#11131a] border-neutral-800" : "bg-white border-neutral-200 shadow-lg"
          }`}>
            <div>
              <span className={`font-black text-5xl absolute top-4 right-6 select-none opacity-20 ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>
                01
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/20 text-[#e60000] mb-5">
                <Store className="h-6 w-6" />
              </div>
              <h2 className={`font-black text-xl mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                1. Register Your Store
              </h2>
              <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Enter your Restaurant Name, choose your unique URL slug (e.g. <span className="font-mono text-orange-500 font-bold">/royal-pizza</span>), and set your private Admin credentials.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-500/10 text-xs font-semibold text-orange-500 flex items-center gap-1">
              <span>Setup time: 2 mins</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div className={`rounded-3xl border p-6 relative flex flex-col justify-between transition-colors ${
            isDark ? "bg-[#11131a] border-neutral-800" : "bg-white border-neutral-200 shadow-lg"
          }`}>
            <div>
              <span className={`font-black text-5xl absolute top-4 right-6 select-none opacity-20 ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>
                02
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className={`font-black text-xl mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                2. Admin Verification
              </h2>
              <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Our Super Admin team verifies your phone number and confirms your account. Once approved, your store URL and Kitchen Admin login are immediately activated.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-500/10 text-xs font-semibold text-purple-400 flex items-center gap-1">
              <span>Fast verification</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div className={`rounded-3xl border p-6 relative flex flex-col justify-between transition-colors ${
            isDark ? "bg-[#11131a] border-neutral-800" : "bg-white border-neutral-200 shadow-lg"
          }`}>
            <div>
              <span className={`font-black text-5xl absolute top-4 right-6 select-none opacity-20 ${isDark ? "text-neutral-600" : "text-neutral-400"}`}>
                03
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 mb-5">
                <QrCode className="h-6 w-6" />
              </div>
              <h2 className={`font-black text-xl mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
                3. Share & Receive Orders
              </h2>
              <p className={`text-xs leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Place your URL in your Instagram bio, WhatsApp catalog, or print table QR codes. Receive direct customer orders with 0% commission!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-500/10 text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <span>0% Commission Forever</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className={`p-8 rounded-3xl border text-center space-y-4 ${
          isDark ? "bg-linear-to-b from-[#11131a] to-neutral-950 border-neutral-800" : "bg-white border-neutral-200 shadow-xl"
        }`}>
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-neutral-900"}`}>
            Ready to Begin?
          </h2>
          <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Launch your restaurant brand today and keep 100% of your order profit.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#e60000] to-orange-600 px-7 py-3 text-xs font-bold text-white shadow-lg hover:scale-105 transition"
            >
              <Store className="h-4 w-4" />
              <span>Launch Your Store Now</span>
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
