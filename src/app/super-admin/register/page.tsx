"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Home,
  Lock,
  User,
  Phone,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { http } from "@/services/http";

export default function SuperAdminRegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await http.post<{ ok: boolean }>("/api/super-admin/register", {
        username,
        password,
        name,
        phone,
      });

      if (res.data.ok) {
        router.push("/super-admin");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to register Super Admin";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-white flex flex-col justify-between overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* Ambient background mesh glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/15 blur-[160px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 right-10 w-[500px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -left-32 w-[400px] h-[400px] bg-pink-600/10 blur-[140px] rounded-full" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-md hover:border-neutral-700 hover:text-white transition"
          >
            <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform text-neutral-400 group-hover:text-purple-400" />
            <span>Home</span>
          </Link>
          <Link
            href="/super-admin/login"
            className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-800/80 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-md hover:border-neutral-700 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign In</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-950/30 px-3.5 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="tracking-wide">Super Admin Console</span>
        </div>
      </header>

      {/* Registration Card */}
      <main className="relative z-10 mx-auto w-full max-w-md px-4 py-8 my-auto">
        <div className="relative rounded-3xl border border-neutral-800/90 bg-neutral-900/80 p-6 sm:p-9 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
          {/* Top glowing gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 via-indigo-500 to-pink-500 rounded-t-3xl" />

          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-purple-600/25 to-indigo-600/25 text-purple-400 border border-purple-500/30 mb-4 shadow-lg shadow-purple-500/20">
              <UserPlus className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Register Super Admin
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
              Create a new master administrator account with full platform permissions
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Full Name
                </label>
                <span className="text-[10px] text-neutral-500 font-mono">Required</span>
              </div>
              <div className="group relative flex items-center rounded-2xl border border-neutral-700/80 bg-neutral-950/80 p-1.5 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:bg-neutral-950 transition-all duration-200 shadow-inner">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 group-focus-within:bg-purple-600/20 group-focus-within:border-purple-500/40 group-focus-within:text-purple-300 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohit Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Phone Number
                </label>
                <span className="text-[10px] text-neutral-500 font-mono">Optional</span>
              </div>
              <div className="group relative flex items-center rounded-2xl border border-neutral-700/80 bg-neutral-950/80 p-1.5 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:bg-neutral-950 transition-all duration-200 shadow-inner">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 group-focus-within:bg-purple-600/20 group-focus-within:border-purple-500/40 group-focus-within:text-purple-300 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Super Admin Username
                </label>
                <span className="text-[10px] text-neutral-500 font-mono">Min 3 chars</span>
              </div>
              <div className="group relative flex items-center rounded-2xl border border-neutral-700/80 bg-neutral-950/80 p-1.5 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:bg-neutral-950 transition-all duration-200 shadow-inner">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 group-focus-within:bg-purple-600/20 group-focus-within:border-purple-500/40 group-focus-within:text-purple-300 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder="e.g. masteradmin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Master Password
                </label>
                <span className="text-[10px] text-neutral-500 font-mono">Min 6 chars</span>
              </div>
              <div className="group relative flex items-center rounded-2xl border border-neutral-700/80 bg-neutral-950/80 p-1.5 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:bg-neutral-950 transition-all duration-200 shadow-inner">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 group-focus-within:bg-purple-600/20 group-focus-within:border-purple-500/40 group-focus-within:text-purple-300 transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer mr-0.5"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-950/80 p-3 text-xs text-red-300 border border-red-800/80 flex items-start gap-2">
                <span className="font-bold text-red-400">Error:</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-purple-600 via-indigo-600 to-pink-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Super Admin Account…</span>
                </>
              ) : (
                <>
                  <span>Create Super Admin Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center">
            <p className="text-xs text-neutral-400">
              Already have credentials?{" "}
              <Link
                href="/super-admin/login"
                className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition"
              >
                Sign In to Super Admin
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center py-5 text-xs text-neutral-500">
        PizzaHub Multi-Tenant Super Administrator Console • Secure TLS 1.3
      </footer>
    </div>
  );
}
