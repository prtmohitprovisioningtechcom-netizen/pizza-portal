"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Upload, ArrowLeft, Lock, Copy, Check, ExternalLink } from "lucide-react";
import {
  fetchSettings,
  updateSettings,
  type SiteSettingsDTO,
} from "@/services/settings";
import { uploadImage } from "@/services/products";

const BANNER_LABELS = [
  "Banner 1 (left / top on mobile)",
  "Banner 2 (center)",
  "Banner 3 (right)",
] as const;

const emptySettings = (): SiteSettingsDTO => ({
  heroImages: ["", "", ""],
  restaurantAddress: "",
  restaurantInstruction: "",
  restaurantPhone: "",
  paymentQrImage: "",
});

export default function AdminSettingsPage() {
  const [s, setS] = useState<SiteSettingsDTO>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef0 = useRef<HTMLInputElement>(null);
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const qrFileRef = useRef<HTMLInputElement>(null);
  const fileRefs = [fileRef0, fileRef1, fileRef2] as const;
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadingQr, setUploadingQr] = useState(false);

  const setSlot = (index: number, value: string) => {
    setS((prev) => {
      const heroImages: [string, string, string] = [...prev.heroImages];
      heroImages[index] = value;
      return { ...prev, heroImages };
    });
  };

  const [adminInfo, setAdminInfo] = useState<{
    restaurantId: number;
    restaurantSlug: string;
    username: string;
  } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsData, meRes] = await Promise.all([
        fetchSettings(),
        fetch("/api/admin/me").then((r) => r.json()).catch(() => null),
      ]);
      setS(settingsData);
      if (meRes?.ok) {
        setAdminInfo({
          restaurantId: meRes.restaurantId,
          restaurantSlug: meRes.restaurantSlug,
          username: meRes.username,
        });
      }
    } catch {
      setMsg("Failed to load settings — check your login and database connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploadingIdx(index);
    setMsg(null);
    try {
      const url = await uploadImage(file);
      setSlot(index, url);
    } catch {
      setMsg("Upload failed — try again.");
    } finally {
      setUploadingIdx(null);
    }
  };

  const onQrUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingQr(true);
    setMsg(null);
    try {
      const url = await uploadImage(file);
      setS((p) => ({ ...p, paymentQrImage: url }));
    } catch {
      setMsg("QR upload failed — try again.");
    } finally {
      setUploadingQr(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await updateSettings(s);
      setMsg("Settings saved — refresh the homepage and order tracking to see changes.");
    } catch {
      setMsg("Save fail — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">Site settings</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-neutral-600">
          Hero banners, outlet details, and payment QR. The menu navbar is edited under{" "}
          <span className="font-semibold text-neutral-800">Navbar</span> in the sidebar.
        </p>
      </div>

      {msg && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {msg}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <>
          {/* Store Identification & Permanent Slug URL (Read-Only) */}
          <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                    <Lock className="h-4 w-4 text-neutral-600" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      Store Public Web Address (Slug URL)
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Unique identifier & permanent storefront link for your customers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                  <Lock className="h-3 w-3" />
                  Locked • Read Only
                </span>
                {adminInfo?.restaurantSlug && (
                  <a
                    href={`/${adminInfo.restaurantSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit Live Store
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Store URL Slug
                  </span>
                  <div className="flex items-center gap-2 font-mono text-sm font-bold text-neutral-900 bg-white border border-neutral-200/90 rounded-lg px-3 py-2 w-full max-w-md">
                    <span className="text-neutral-400 select-none">/</span>
                    <span className="text-[#e60000]">{adminInfo?.restaurantSlug || "pizzahub"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && adminInfo?.restaurantSlug) {
                        const fullUrl = `${window.location.origin}/${adminInfo.restaurantSlug}`;
                        navigator.clipboard.writeText(fullUrl);
                        setCopiedSlug(true);
                        setTimeout(() => setCopiedSlug(false), 2000);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 px-3.5 py-2 text-xs font-semibold transition shadow-sm"
                  >
                    {copiedSlug ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied Store Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-neutral-300" />
                        <span>Copy Storefront URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-neutral-500 border-t border-neutral-200/60 pt-2.5">
                ℹ️ <strong>Permanent URL Notice:</strong> To protect customer bookmarks, QR codes, delivery aggregators, and search engine listings, store URL slugs cannot be altered once created.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6"
              >
                <p className="text-sm font-semibold text-neutral-800">
                  {BANNER_LABELS[i]}
                </p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <button
                    type="button"
                    onClick={() =>
                      uploadingIdx === null && fileRefs[i].current?.click()
                    }
                    disabled={uploadingIdx !== null}
                    className="flex w-full shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e60000]/40 bg-linear-to-br from-[#fff8f5] to-[#fdf6e8] px-4 py-4 text-center transition hover:border-[#e60000]/70 disabled:opacity-50 sm:w-40"
                  >
                    <Upload className="h-7 w-7 text-[#e60000]" />
                    <span className="mt-1.5 text-xs font-medium text-neutral-700">
                      Upload
                    </span>
                    <input
                      ref={fileRefs[i]}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        onUpload(i, e.target.files?.[0] ?? null)
                      }
                    />
                    {uploadingIdx === i && (
                      <span className="mt-2 text-xs text-[#e60000]">
                        Upload…
                      </span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="block text-xs font-semibold uppercase text-neutral-500">
                      Image URL (you can paste directly)
                      <input
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                        value={s.heroImages[i]}
                        onChange={(e) => setSlot(i, e.target.value)}
                        placeholder="/uploads/banner1.jpg"
                      />
                    </label>
                    {s.heroImages[i].trim() ? (
                      <div className="relative mt-2 aspect-21/9 w-full max-w-xl overflow-hidden rounded-xl bg-neutral-100">
                        <Image
                          src={s.heroImages[i].trim()}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized={
                            s.heroImages[i].startsWith("http") ||
                            s.heroImages[i].startsWith("//")
                          }
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">
                        No image yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-neutral-900">
              Outlet & order tracking
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Customers will see the address, instructions, and QR code on their order tracking page.
            </p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase text-neutral-500">
                  Restaurant phone (Call / WhatsApp)
                </span>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  value={s.restaurantPhone}
                  onChange={(e) =>
                    setS((p) => ({ ...p, restaurantPhone: e.target.value }))
                  }
                  placeholder="Enter contact number"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase text-neutral-500">
                  Restaurant address
                </span>
                <textarea
                  rows={2}
                  className="mt-1 w-full resize-none rounded-xl border px-3 py-2 text-sm"
                  value={s.restaurantAddress}
                  onChange={(e) =>
                    setS((p) => ({ ...p, restaurantAddress: e.target.value }))
                  }
                  placeholder="Full outlet address…"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase text-neutral-500">
                  Restaurant instruction (UPI / owner note)
                </span>
                <textarea
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border px-3 py-2 text-sm"
                  value={s.restaurantInstruction}
                  onChange={(e) =>
                    setS((p) => ({
                      ...p,
                      restaurantInstruction: e.target.value,
                    }))
                  }
                  placeholder="Short payment note or UPI instructions…"
                />
              </label>

              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500">
                  Payment QR image
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <button
                    type="button"
                    onClick={() =>
                      !uploadingQr && qrFileRef.current?.click()
                    }
                    disabled={uploadingQr}
                    className="flex w-full shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-4 text-center text-sm disabled:opacity-50 sm:w-40"
                  >
                    <Upload className="mx-auto h-7 w-7 text-[#e60000]" />
                    <span className="mt-1.5 text-xs font-medium">
                      {uploadingQr ? "Upload…" : "Upload QR"}
                    </span>
                    <input
                      ref={qrFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        onQrUpload(e.target.files?.[0] ?? null)
                      }
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <input
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      value={s.paymentQrImage}
                      onChange={(e) =>
                        setS((p) => ({
                          ...p,
                          paymentQrImage: e.target.value,
                        }))
                      }
                      placeholder="/uploads/qr.png"
                    />
                    {s.paymentQrImage.trim() ? (
                      <div className="relative mt-2 h-36 w-36 overflow-hidden rounded-xl border bg-white">
                        <Image
                          src={s.paymentQrImage.trim()}
                          alt=""
                          fill
                          className="object-contain p-2"
                          unoptimized={
                            s.paymentQrImage.startsWith("http") ||
                            s.paymentQrImage.startsWith("//")
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={saveAll}
              className="rounded-full bg-[#e60000] px-8 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save all settings"}
            </button>
            <button
              type="button"
              onClick={load}
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold"
            >
              Reload from server
            </button>
          </div>
        </>
      )}
    </div>
  );
}
