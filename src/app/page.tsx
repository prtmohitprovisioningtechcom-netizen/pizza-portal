"use client";

import { useEffect, useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        setSuccessMsg(`Congratulations! '${name}' registered successfully! Redirecting...`);
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

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900 font-sans selection:bg-[#e60000] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e60000] text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition">
              <Pizza className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 block leading-tight">
                Pizza<span className="text-[#e60000]">Hub</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Partner Network
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
            >
              <Lock className="h-3.5 w-3.5" />
              Partner Admin
            </Link>

            <a
              href="#register"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#e60000] px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/30 hover:bg-red-700 transition"
            >
              <Store className="h-3.5 w-3.5" />
              Join as Partner
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-bold text-[#e60000]">
                <Sparkles className="h-3.5 w-3.5" />
                Multi-Tenant Restaurant Platform
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl md:text-6xl leading-[1.1]">
                Launch Your Restaurant & Pizza Store in{" "}
                <span className="text-[#e60000] underline decoration-red-200 underline-offset-8">
                  2 Minutes
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Har restaurant partner ko milta hai unka <strong>apna custom storefront URL</strong>,
                digital menu, and powerful <strong>admin order portal</strong>. Instant customer ordering,
                0% commissions, aur complete store control.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#register"
                  className="inline-flex items-center gap-2 rounded-full bg-[#e60000] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-500/30 hover:bg-red-700 hover:shadow-red-500/40 transition"
                >
                  <Store className="h-4 w-4" />
                  Register Your Restaurant
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/r/pizzahub"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-bold text-neutral-800 shadow-sm hover:bg-neutral-50 transition"
                >
                  <UtensilsCrossed className="h-4 w-4 text-[#e60000]" />
                  View Live Demo Store
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-200/80 text-left">
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Custom URL</p>
                  <p className="text-sm font-bold text-neutral-900 mt-0.5">/r/[your-slug]</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Setup Time</p>
                  <p className="text-sm font-bold text-[#e60000] mt-0.5">Instant 2 Min</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Admin Control</p>
                  <p className="text-sm font-bold text-neutral-900 mt-0.5">100% Isolated</p>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Register Box */}
            <div id="register" className="lg:col-span-5 scroll-mt-24">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-red-100 rounded-bl-full pointer-events-none -mr-8 -mt-8 opacity-60"></div>

                <div className="flex items-center gap-2.5 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-[#e60000]">
                    <ChefHat className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-neutral-900">Partner Onboarding</h2>
                    <p className="text-xs text-neutral-500">Create your store & admin account</p>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label htmlFor={restNameId} className="block text-xs font-semibold text-neutral-600 mb-1">
                      Restaurant Name *
                    </label>
                    <input
                      id={restNameId}
                      required
                      type="text"
                      placeholder="e.g. Domino Delight or Royal Pizza"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#e60000] focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor={restSlugId} className="block text-xs font-semibold text-neutral-600 mb-1">
                      Store URL Slug *
                    </label>
                    <div className="flex items-center rounded-xl border border-neutral-300 bg-neutral-50 overflow-hidden focus-within:border-[#e60000] focus-within:ring-2 focus-within:ring-red-500/20">
                      <span className="px-3 text-xs text-neutral-500 font-mono select-none">/r/</span>
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
                        className="w-full bg-transparent px-2 py-2.5 text-sm outline-none font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Customer link: <span className="font-mono text-neutral-600">/r/{slug || "your-slug"}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor={ownerNameId} className="block text-xs font-semibold text-neutral-600 mb-1">
                        Owner Name
                      </label>
                      <input
                        id={ownerNameId}
                        type="text"
                        placeholder="Mohit Kumar"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#e60000] focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                    <div>
                      <label htmlFor={phoneId} className="block text-xs font-semibold text-neutral-600 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        id={phoneId}
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#e60000] focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-neutral-100">
                    <div>
                      <label htmlFor={adminUserId} className="block text-xs font-semibold text-neutral-600 mb-1">
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
                        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#e60000] focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                    <div>
                      <label htmlFor={adminPassId} className="block text-xs font-semibold text-neutral-600 mb-1">
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
                        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#e60000] focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {successMsg && (
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-700 border border-emerald-200 font-medium">
                      {successMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-[#e60000] py-3 text-sm font-bold text-white shadow-lg shadow-red-500/25 hover:bg-red-700 disabled:opacity-60 transition flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Store & Admin…
                      </>
                    ) : (
                      <>
                        Launch My Restaurant Store
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Partner Stores Directory */}
      <section className="py-14 bg-white border-y border-neutral-200/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e60000]">
                Active Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                Explore Partner Restaurants
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Every partner has their own dedicated storefront and admin panel on this platform.
              </p>
            </div>

            <div className="text-sm font-semibold text-neutral-600 bg-neutral-100 px-4 py-2 rounded-full self-start md:self-auto">
              {restaurants.length} Registered Partner{restaurants.length === 1 ? "" : "s"}
            </div>
          </div>

          {loadingList ? (
            <div className="py-12 text-center text-neutral-400">Loading restaurants…</div>
          ) : restaurants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
              No restaurants created yet. Be the first to register above!
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-neutral-200 bg-[#faf8f5] p-5 shadow-sm hover:shadow-md hover:border-neutral-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#e60000] border border-neutral-200 shadow-xs">
                        <Store className="h-5 w-5" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Live
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-neutral-900">{r.name}</h3>
                    <p className="text-xs font-mono text-[#e60000] mt-0.5">/r/{r.slug}</p>
                    {r.phone && (
                      <p className="text-xs text-neutral-500 mt-2">Phone: {r.phone}</p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-200/80 flex items-center justify-between gap-2">
                    <Link
                      href={`/r/${r.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
                    >
                      Visit Store
                      <ExternalLink className="h-3 w-3" />
                    </Link>

                    <Link
                      href={`/r/${r.slug}/admin`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#e60000] transition"
                    >
                      Admin Login &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e60000]">
              Built for Scale
            </span>
            <h2 className="text-3xl font-extrabold text-neutral-900 mt-1">
              Everything Your Food Business Needs
            </h2>
            <p className="text-neutral-600 text-sm mt-2">
              Run multiple brands or franchise partners on one single high-speed system with MySQL.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#e60000] mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Custom Store URL</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Har partner ko unke restaurant ka custom URL milta hai (e.g. <code>/r/pizzahub</code>).
                Apna brand banner, logo aur phone number display karein.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#e60000] mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Isolated Admin Panel</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Partner admins apne store ke alawa dusre store ka data nahi dekh sakte.
                Menu, categories, orders sabhi 100% secure aur separated hain.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#e60000] mb-4">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Live Kitchen Orders</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Real-time kitchen order dashboard with status tracking (Pending &rarr; Accepted &rarr; Delivered).
                Direct customer WhatsApp / Call integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PizzaHub Platform. Multi-Tenant Restaurant System.</p>
          <div className="flex items-center gap-4">
            <Link href="/r/pizzahub" className="hover:text-neutral-900">Demo Store</Link>
            <Link href="/admin/login" className="hover:text-neutral-900">Partner Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
