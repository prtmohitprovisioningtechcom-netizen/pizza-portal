"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: "light" | "dark" | "pill" | "subtle";
}

export function BackButton({
  href,
  label = "Back",
  className = "",
  variant = "pill",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (href) {
      // If href provided, allow default Link or router.push
      return;
    }
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const variantStyles = {
    pill: "inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-xs hover:bg-neutral-50 hover:text-neutral-900 transition-all active:scale-95",
    dark: "inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 text-xs font-bold text-neutral-300 shadow-xs hover:border-neutral-700 hover:text-white hover:bg-neutral-800 transition-all active:scale-95",
    light: "inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition-all",
    subtle: "inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors",
  };

  const style = `${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={style}>
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={style}>
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
