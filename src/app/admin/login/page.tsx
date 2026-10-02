"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isAxiosError } from "axios";
import { ArrowLeft, LayoutDashboard, ArrowRight } from "lucide-react";
import { http } from "@/services/http";

type Mode = "login" | "register";

function errMsg(e: unknown, fallback: string) {
  if (isAxiosError(e) && e.response?.data && typeof e.response.data === "object") {
    const d = e.response.data as { error?: string };
    if (d.error) return d.error;
  }
  return fallback;
}

export default function AdminLoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [canRegister, setCanRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<{ username: string; restaurantName?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    http
      .get<{ ok: boolean; admin?: { username: string; restaurantName?: string } }>("/api/admin/me")
      .then((res) => {
        if (res.data?.ok && res.data.admin) {
          setActiveSession(res.data.admin);
        }
      })
      .catch(() => {});

    (async () => {
      try {
        const { data } = await http.get<{ canRegister: boolean }>(
          "/api/admin/register-status"
        );
        setCanRegister(data.canRegister);
        if (data.canRegister) {
          setMode("register");
        } else {
          setMode("login");
        }
      } catch {
        // keep current mode
      }
    })();
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#faf8f5] p-4 font-body">
      <div className="w-full max-w-md space-y-4">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← Back to Home</span>
          </Link>

          {activeSession && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#e60000] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#cc0000] transition"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Go to Dashboard →</span>
            </Link>
          )}
        </div>

        {activeSession && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
            <div>
              <p className="font-bold">Active Session Detected</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Logged in as <strong>@{activeSession.username}</strong> ({activeSession.restaurantName || "Partner"})
              </p>
            </div>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition flex items-center gap-1"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
        <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-neutral-100">
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full ring-3 ring-[#ffde00] bg-white shadow-lg">
            <Image
              src="/kya-khaugey.png"
              alt="Khaoge Kya?"
              fill
              className="object-cover"
              sizes="72px"
              priority
            />
          </div>
          <div>
            <h1 className="font-navbar-brand text-2xl font-black text-[#0b2545] leading-tight">
              KHA<span className="text-[#e51b24]">OGE</span> KYA<span className="text-[#e51b24]">?</span>
            </h1>
            <p className="text-[11px] font-bold text-[#e51b24] uppercase tracking-wider">
              Partner Admin Portal
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {mode === "register" ? "Create Admin Account" : "Partner Sign In"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {mode === "register"
                ? "Setup your restaurant management login"
                : "Manage your menu, orders and settings"}
            </p>
          </div>
          {canRegister && (
            <div className="flex rounded-full bg-neutral-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMsg(null);
                }}
                className={`rounded-full px-3 py-1 transition ${
                  mode === "login"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setMsg(null);
                }}
                className={`rounded-full px-3 py-1 transition ${
                  mode === "register"
                    ? "bg-[#e60000] text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {mode === "login" ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setMsg(null);
              setLoading(true);
              try {
                await http.post("/api/admin/login", { username, password });
                router.push("/admin");
                router.refresh();
              } catch (e) {
                setMsg(errMsg(e, "Invalid username or password."));
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Username
              </label>
              <input
                required
                autoComplete="username"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-[#e60000]/30 focus:ring-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Password
              </label>
              <input
                required
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-[#e60000]/30 focus:ring-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#e60000] py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setMsg(null);
              setLoading(true);
              try {
                await http.post("/api/admin/register", {
                  username,
                  password,
                  confirmPassword,
                });
                router.push("/admin");
                router.refresh();
              } catch (e) {
                setMsg(errMsg(e, "Register failed."));
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Username
              </label>
              <input
                required
                minLength={3}
                autoComplete="username"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-[#e60000]/30 focus:ring-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="new username"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Password
              </label>
              <input
                required
                minLength={6}
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-[#e60000]/30 focus:ring-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Confirm password
              </label>
              <input
                required
                minLength={6}
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-[#e60000]/30 focus:ring-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !canRegister}
              className="w-full rounded-full bg-[#e60000] py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
        )}

        {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
