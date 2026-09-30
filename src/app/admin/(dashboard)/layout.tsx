"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Receipt,
  Images,
  PanelTop,
  ExternalLink,
  Store,
} from "lucide-react";
import { AdminLogoutButton } from "@/components/layout/AdminLogoutButton";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/navbar", label: "Navbar", icon: PanelTop },
  { href: "/admin/settings", label: "Site", icon: Images },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
];

interface AdminInfo {
  id: string;
  username: string;
  restaurantId: number;
  restaurantSlug: string;
  restaurantName: string;
}

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && data.admin) {
          setAdminInfo(data.admin);
        }
      })
      .catch(() => {});
  }, []);

  const storeUrl = adminInfo?.restaurantSlug
    ? `/${adminInfo.restaurantSlug}`
    : "/";

  return (
    <div className="min-h-dvh bg-neutral-50 font-body text-neutral-900">
      <div className="flex flex-col md:flex-row">
        <aside className="border-b border-neutral-200 bg-white md:min-h-dvh md:w-64 md:border-b-0 md:border-r md:shadow-sm">
          {/* Header */}
          <div className="border-b border-neutral-100 p-5">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
                title="Go to Multi-Restaurant Platform Home"
              >
                ← Platform Home
              </Link>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-[#e60000]">
                Partner Portal
              </span>
              <h2 className="mt-2 text-xl font-black text-neutral-900 leading-tight">
                {adminInfo?.restaurantName || "Ad Pizza Hub"}
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                /{adminInfo?.restaurantSlug || "pizzahub"}
              </p>
            </div>

            {/* Direct Link to Live Storefront */}
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-900 py-2.5 px-3 text-xs font-bold text-white shadow-sm hover:bg-[#e60000] transition-colors"
            >
              <Store className="h-4 w-4" />
              <span>View Live Store</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex flex-row gap-2 overflow-x-auto px-3 py-3 md:flex-col md:space-y-1 md:px-3 md:py-4">
            {nav.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin" || pathname === "/admin/(dashboard)"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap md:whitespace-normal ${
                    isActive
                      ? "bg-linear-to-r from-[#e60000]/10 to-transparent text-[#e60000] shadow-sm border-l-4 border-[#e60000]"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="hidden flex-1 md:block" />

          {/* User & Logout */}
          <div className="border-t border-neutral-100 p-3 md:border-t md:p-4">
            {adminInfo?.username && (
              <div className="mb-2 px-2 text-xs text-neutral-500">
                Logged in as: <span className="font-semibold text-neutral-800">@{adminInfo.username}</span>
              </div>
            )}
            <AdminLogoutButton />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
