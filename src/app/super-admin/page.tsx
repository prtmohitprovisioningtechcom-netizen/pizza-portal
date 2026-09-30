"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Home,
  Store,
  CheckCircle2,
  Clock,
  Ban,
  DollarSign,
  Search,
  ExternalLink,
  MessageCircle,
  Trash2,
  LogOut,
  RefreshCw,
  Loader2,
  AlertCircle,
  Eye,
  Check,
  X,
  CreditCard,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import { http } from "@/services/http";

interface RestaurantItem {
  id: number;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  email: string;
  status: "active" | "pending" | "inactive" | "suspended";
  paymentStatus: "paid" | "pending" | "failed";
  paymentAmount: number;
  paymentNotes: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SummaryData {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  paidCount: number;
  pendingPaymentCount: number;
  totalRevenue: number;
}

export default function SuperAdminDashboard() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    paidCount: 0,
    pendingPaymentCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "active" | "suspended">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminName, setAdminName] = useState("Super Admin");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const router = useRouter();

  // Check auth session & load data
  const loadData = async () => {
    setLoading(true);
    try {
      const meRes = await http.get<{ authenticated: boolean; user?: { name: string } }>(
        "/api/super-admin/me"
      );
      if (!meRes.data.authenticated) {
        router.push("/super-admin/login");
        return;
      }
      if (meRes.data.user?.name) {
        setAdminName(meRes.data.user.name);
      }

      const res = await http.get<{
        ok: boolean;
        restaurants: RestaurantItem[];
        summary: SummaryData;
      }>("/api/super-admin/restaurants");

      if (res.data.ok) {
        setRestaurants(res.data.restaurants);
        setSummary(res.data.summary);
      }
    } catch {
      router.push("/super-admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await http.post("/api/super-admin/logout");
      router.push("/super-admin/login");
    } catch {
      router.push("/super-admin/login");
    }
  };

  const updateRestaurant = async (
    id: number,
    updates: {
      status?: "active" | "pending" | "inactive" | "suspended";
      paymentStatus?: "paid" | "pending" | "failed";
      paymentAmount?: number;
      paymentNotes?: string;
    },
    message: string
  ) => {
    setUpdatingId(id);
    setActionSuccessMsg(null);
    try {
      const res = await http.patch<{ ok: boolean; restaurant: RestaurantItem }>(
        "/api/super-admin/restaurants",
        { id, ...updates }
      );
      if (res.data.ok) {
        setActionSuccessMsg(message);
        setTimeout(() => setActionSuccessMsg(null), 3000);
        await loadData();
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to update restaurant status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (r: RestaurantItem) => {
    if (!confirm(`Are you sure you want to permanently delete '${r.name}' (/${r.slug})?`)) {
      return;
    }
    setUpdatingId(r.id);
    try {
      const res = await http.delete(`/api/super-admin/restaurants?id=${r.id}`);
      if (res.data.ok) {
        setActionSuccessMsg(`Restaurant '${r.name}' has been deleted.`);
        setTimeout(() => setActionSuccessMsg(null), 3000);
        await loadData();
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete restaurant");
    } finally {
      setUpdatingId(null);
    }
  };

  const openWhatsApp = (r: RestaurantItem) => {
    if (!r.phone) return;
    const cleanPhone = r.phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${r.ownerName || "Partner"}! This is Super Admin regarding your restaurant "${r.name}" on our PizzaHub Partner Platform. We received your registration for /${r.slug}. Let's complete your verification & payment to activate your store.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`, "_blank");
  };

  // Filtered restaurants
  const filteredList = useMemo(() => {
    return restaurants.filter((r) => {
      // Tab filter
      if (filterTab === "pending" && r.status !== "pending") return false;
      if (filterTab === "active" && r.status !== "active") return false;
      if (filterTab === "suspended" && r.status !== "suspended" && r.status !== "inactive")
        return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = r.name.toLowerCase().includes(q);
        const matchSlug = r.slug.toLowerCase().includes(q);
        const matchOwner = r.ownerName.toLowerCase().includes(q);
        const matchPhone = r.phone.includes(q);
        return matchName || matchSlug || matchOwner || matchPhone;
      }
      return true;
    });
  }, [restaurants, filterTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white font-sans selection:bg-purple-600 selection:text-white pb-20">
      {/* Top Super Admin Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#07090e]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-purple-600 via-indigo-600 to-pink-600 text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white block leading-tight">
                Super Admin <span className="text-purple-400">Console</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                Master Portal • Partner Approvals & Payments
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
            >
              <Home className="h-3.5 w-3.5 text-purple-400" />
              <span>Home</span>
            </Link>

            <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-300 bg-purple-950/70 border border-purple-800/80 px-3 py-1 rounded-full">
                👤 {adminName}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-red-400 hover:bg-red-950/40 hover:border-red-800 transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 space-y-8">
        {/* Success Action Notification */}
        {actionSuccessMsg && (
          <div className="rounded-2xl border border-emerald-800/80 bg-emerald-950/80 p-3.5 text-xs font-bold text-emerald-300 flex items-center justify-between shadow-xl animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMsg(null)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Registered */}
          <div className="rounded-3xl border border-neutral-800 bg-[#10121b] p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Total Partners
              </span>
              <div className="h-8 w-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Store className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono mt-3">{summary.total}</p>
            <p className="text-[11px] text-neutral-500 mt-1">All registered restaurants</p>
          </div>

          {/* Card 2: Pending Verification (HIGH PRIORITY) */}
          <div className="rounded-3xl border border-amber-900/60 bg-amber-950/20 p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                Pending Verification
              </span>
              <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-300 font-mono mt-3">{summary.pending}</p>
            <p className="text-[11px] text-amber-400/80 mt-1">Awaiting your approval & payment</p>
          </div>

          {/* Card 3: Active & Live */}
          <div className="rounded-3xl border border-neutral-800 bg-[#10121b] p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Active & Live
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400 font-mono mt-3">{summary.active}</p>
            <p className="text-[11px] text-neutral-500 mt-1">Taking online customer orders</p>
          </div>

          {/* Card 4: Payments Paid */}
          <div className="rounded-3xl border border-neutral-800 bg-[#10121b] p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Paid Partners
              </span>
              <div className="h-8 w-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-indigo-300 font-mono mt-3">
              {summary.paidCount}{" "}
              <span className="text-xs text-neutral-500 font-normal">/ {summary.total}</span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Setup fee or subscription paid</p>
          </div>
        </div>

        {/* Partners Management Section */}
        <div className="rounded-3xl border border-neutral-800 bg-[#10121b] p-6 shadow-2xl space-y-6">
          {/* Controls Bar: Filters & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900 border border-neutral-800">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterTab === "all"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                All ({summary.total})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("pending")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  filterTab === "pending"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-amber-400 hover:text-amber-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Pending ({summary.pending})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("active")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterTab === "active"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-emerald-400 hover:text-emerald-300"
                }`}
              >
                Active ({summary.active})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("suspended")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterTab === "suspended"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-red-400 hover:text-red-300"
                }`}
              >
                Suspended ({summary.suspended})
              </button>
            </div>

            {/* Search & Refresh */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search partner by name, slug, phone…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 pl-9 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                title="Refresh List"
                className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table / Cards */}
          {loading ? (
            <div className="py-20 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <p className="text-xs">Loading partner restaurants…</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center text-neutral-500">
              <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No restaurants match this filter.</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try clearing your search query "{searchQuery}".</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredList.map((r) => {
                const isPending = r.status === "pending";
                const isActive = r.status === "active";
                const isPaid = r.paymentStatus === "paid";
                const isUpdating = updatingId === r.id;

                return (
                  <div
                    key={r.id}
                    className={`rounded-2xl border p-5 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                      isPending
                        ? "border-amber-900/60 bg-amber-950/10 hover:border-amber-700/80"
                        : isActive
                        ? "border-neutral-800 bg-neutral-950/80 hover:border-neutral-700"
                        : "border-red-900/60 bg-red-950/10 hover:border-red-800"
                    }`}
                  >
                    {/* Left: Info */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-black text-lg text-white">{r.name}</h3>

                        {/* Store Status Pill */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950 border border-amber-800 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                            <Clock className="h-3 w-3" />
                            Pending Verification
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Active & Live
                          </span>
                        )}
                        {!isPending && !isActive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-950 border border-red-800 px-2.5 py-0.5 text-[11px] font-bold text-red-400">
                            <Ban className="h-3 w-3" />
                            Suspended
                          </span>
                        )}

                        {/* Payment Status Pill */}
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-900 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                            💰 Payment: Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-950/80 border border-red-900 px-2.5 py-0.5 text-[11px] font-bold text-red-300">
                            ⚠️ Payment: Pending
                          </span>
                        )}
                      </div>

                      {/* Store URL & Contact Details */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                        <Link
                          href={`/${r.slug}`}
                          target="_blank"
                          className="font-mono text-purple-300 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>/{r.slug}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>

                        {r.ownerName && (
                          <span className="flex items-center gap-1 text-neutral-300">
                            <User className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{r.ownerName}</span>
                          </span>
                        )}

                        {r.phone && (
                          <span className="flex items-center gap-1 text-neutral-300 font-mono">
                            <Phone className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{r.phone}</span>
                          </span>
                        )}

                        {r.createdAt && (
                          <span className="flex items-center gap-1 text-neutral-500 text-[11px]">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t border-neutral-800/80 lg:border-t-0">
                      {/* WhatsApp Chat Button */}
                      {r.phone && (
                        <button
                          type="button"
                          onClick={() => openWhatsApp(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs font-bold text-emerald-300 hover:bg-emerald-900/40 transition cursor-pointer"
                          title="Contact partner on WhatsApp to confirm payment"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      {/* Toggle Payment Status */}
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateRestaurant(
                            r.id,
                            { paymentStatus: isPaid ? "pending" : "paid" },
                            `Payment marked as ${isPaid ? "Pending" : "Paid"} for '${r.name}'`
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          isPaid
                            ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white"
                            : "bg-amber-950/80 border-amber-800 text-amber-300 hover:bg-amber-900"
                        }`}
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>{isPaid ? "Mark Unpaid" : "Mark as Paid"}</span>
                      </button>

                      {/* Account Verification & Status Actions */}
                      {isPending && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateRestaurant(
                              r.id,
                              { status: "active", paymentStatus: "paid" },
                              `Partner '${r.name}' approved & activated! Storefront and Admin are now live.`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:opacity-90 transition cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Verify & Activate</span>
                        </button>
                      )}

                      {isActive && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateRestaurant(
                              r.id,
                              { status: "suspended" },
                              `Partner '${r.name}' has been suspended.`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-red-400 hover:bg-red-950/30 hover:border-red-800 transition cursor-pointer"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          <span>Suspend</span>
                        </button>
                      )}

                      {!isPending && !isActive && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateRestaurant(
                              r.id,
                              { status: "active" },
                              `Partner '${r.name}' re-activated.`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-emerald-400 hover:bg-emerald-900 transition cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Re-Activate</span>
                        </button>
                      )}

                      {/* Delete Action (Protected for ID 1) */}
                      {r.id !== 1 && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleDelete(r)}
                          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition cursor-pointer"
                          title="Delete Partner"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
