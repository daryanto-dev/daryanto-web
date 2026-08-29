"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TELEGRAM_USERNAME = "daryantobot";

function defaultMessageFor(pathname: string, tier: string | null): string {
  if (pathname.startsWith("/checkout")) {
    const label = tier === "vip" ? "VIP" : tier === "premium" ? "PREMIUM" : "";
    return label
      ? `Halo Admin, saya mau tanya soal pembayaran paket ${label} sebelum lanjut checkout.`
      : "Halo Admin, saya mau tanya soal pembayaran sebelum lanjut checkout.";
  }
  if (pathname.startsWith("/dashboard/admin")) {
    return "Halo, ada kendala di panel admin.";
  }
  if (pathname.startsWith("/dashboard")) {
    return "Halo Admin, saya butuh bantuan soal akun/license di dashboard saya.";
  }
  if (pathname.startsWith("/login")) {
    return "Halo Admin, saya ada kendala waktu login/daftar akun.";
  }
  return "Halo Admin, saya mau tanya-tanya soal DaryantoBot Pro.";
}

function AdminChatButtonInner() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier");

  const href = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(
    defaultMessageFor(pathname, tier)
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Admin via Telegram"
      className="mx-admin-chat mx-glow-green"
    >
      <span className="mx-admin-chat-icon">
        <svg width="24" height="24" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M175.9 63.6 43.6 114.7c-9 3.6-8.9 8.6-1.6 10.8l33.9 10.6 78.6-49.6c3.7-2.3 7.1-1 4.3 1.5l-63.6 57.4h0l-2.3 33.9c3.4 0 4.9-1.5 6.7-3.3l16.1-15.6 33.5 24.7c6.2 3.4 10.6 1.6 12.1-5.7l22-103.5c2.1-9-3.4-13-11.4-9.3z"
            fill="#000"
          />
        </svg>
      </span>
      <span className="mx-admin-chat-label">Chat Admin</span>
    </a>
  );
}

export default function AdminChatButton() {
  return (
    <Suspense fallback={null}>
      <AdminChatButtonInner />
    </Suspense>
  );
}
