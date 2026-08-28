"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MatrixRain from "../MatrixRain";

const TELEGRAM_USERNAME = "daryantobot";

const PACKAGES: Record<string, { label: string; price: number; priceLabel: string; period: string }> = {
  premium: { label: "PREMIUM (1 Tahun)", price: 499000, priceLabel: "Rp 499.000", period: "1 Tahun • semua simbol" },
  vip: { label: "VIP (Lifetime)", price: 1499000, priceLabel: "Rp 1.499.000", period: "Sekali bayar • seumur hidup" },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") || "premium";

  const [tierKey, setTierKey] = useState(PACKAGES[initialTier] ? initialTier : "premium");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || "");
        const metaName = (data.user.user_metadata as any)?.full_name;
        if (metaName) setNama(metaName);
      }
    });
  }, []);

  const pkg = PACKAGES[tierKey];

  const buildMessage = () => {
    return [
      "Halo Admin, saya ingin membeli paket:",
      "",
      `• Paket : ${pkg.label}`,
      `• Harga : ${pkg.priceLabel}`,
      `• Nama  : ${nama.trim() || "(belum diisi)"}`,
      `• Email : ${email.trim() || "(belum diisi)"}`,
      "",
      "Mohon diproses. Berikut bukti pembayaran (lampirkan gambar).",
    ].join("\n");
  };

  const telegramHref = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(buildMessage())}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-root">
      <MatrixRain />
      <div className="mx-grid-bg" />

      <header className="mx-header">
        <div className="mx-header-inner">
          <a href="/" className="mx-logo" style={{ textDecoration: "none" }}>
            <span>DARYANTOBOT</span><span style={{ color: "#00FF88" }}>_PRO</span><span className="cursor" />
          </a>
          <a href="/#pricing" className="mx-btn-outline">← Kembali ke Paket</a>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 64px", fontFamily: "JetBrains Mono" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(0,255,136,0.7)" }}>PAYMENT GATEWAY</div>
          <h1 style={{ marginTop: 10, fontWeight: 900, fontSize: "clamp(22px,5vw,32px)" }}>
            Selesaikan <span style={{ color: "#00FF88" }}>Pembayaran</span>
          </h1>
          <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            Transaksi QRIS Aman • Terenkripsi <span style={{ color: "rgba(255,180,0,0.8)" }}>• Admin Aktif 12.00 – 23.00 WIB</span>
          </div>
        </div>

        {/* PILIH PAKET */}
        <div style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(10,10,10,0.9)", padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 12 }}>PAKET</div>
          <div style={{ display: "flex", gap: 10 }}>
            {Object.entries(PACKAGES).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setTierKey(key)}
                className={tierKey === key ? "mx-btn-solid mx-glow-green" : "mx-btn-outline"}
                style={{ flex: 1, justifyContent: "center", height: 44 }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            {pkg.label} — <span style={{ color: "#00FF88", fontWeight: 700 }}>{pkg.priceLabel}</span> ({pkg.period})
          </div>
        </div>

        {/* IDENTITAS */}
        <div style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(10,10,10,0.9)", padding: 20, marginBottom: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 12 }}>IDENTITAS PEMBELI</div>
          <div className="mx-field" style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, color: "#00FF88" }}>NAMA</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kamu" className="mx-input" style={{ marginTop: 6 }} />
          </div>
          <div className="mx-field">
            <label style={{ fontSize: 10, color: "#00FF88" }}>EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" className="mx-input" style={{ marginTop: 6 }} />
          </div>
        </div>

        {/* QR PAYMENT */}
        <div style={{ border: "1px solid rgba(0,255,136,0.25)", background: "rgba(10,10,10,0.95)", padding: 20, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 4 }}>SCAN QRIS UNTUK BAYAR</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
            Total: <span style={{ color: "#00FF88", fontWeight: 700 }}>{pkg.priceLabel}</span>
          </div>
          <img
            src="/qris-payment.jpg"
            alt="QRIS Payment"
            style={{ maxWidth: 260, width: "100%", margin: "0 auto", display: "block", border: "4px solid #fff" }}
          />
          <div style={{ marginTop: 14, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            Bisa dibayar pakai GoPay, OVO, DANA, ShopeePay, m-Banking — semua aplikasi berlogo QRIS.
          </div>
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,180,0,0.4)", color: "rgba(255,180,0,0.9)", fontSize: 10, padding: "4px 10px" }}>
            <span className="mx-dot" style={{ background: "rgba(255,180,0,0.9)" }} />
            STATUS: AWAITING PAYMENT
          </div>
        </div>

        {/* VERIFICATION NOTICE */}
        <div style={{ border: "1px solid rgba(255,180,0,0.3)", background: "rgba(255,180,0,0.06)", padding: 16, marginBottom: 24 }}>
          <div style={{ fontWeight: 900, fontSize: 11, color: "rgba(255,180,0,0.9)", marginBottom: 6, letterSpacing: "0.1em" }}>VERIFICATION NOTICE</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            Setelah pembayaran, kirimkan bukti pembayaran dan paket yang dipilih kepada admin lewat Telegram.
            Tanpa kedua informasi tersebut, transaksi belum dapat diverifikasi atau diproses. License key akan
            dikirim manual oleh admin setelah pembayaran dikonfirmasi — lalu klaim key-nya di halaman dashboard.
          </div>
        </div>

        {/* PESAN OTOMATIS PREVIEW */}
        <div style={{ border: "1px solid rgba(255,255,255,0.12)", background: "#0a0a0a", padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.6)" }}>FORMAT PESAN TELEGRAM</div>
            <button onClick={handleCopy} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 9, padding: "3px 8px", cursor: "pointer" }}>
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 11.5, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>{buildMessage()}</pre>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-btn-solid mx-glow-green"
            style={{ flex: 1, minWidth: 220, justifyContent: "center", height: 48, textDecoration: "none" }}
          >
            ▶ Bayar / Konfirmasi via Telegram
          </a>
          <a href="/login" className="mx-btn-outline" style={{ flex: 1, minWidth: 220, justifyContent: "center", height: 48, textDecoration: "none" }}>
            Sudah Punya License? Login &amp; Klaim
          </a>
        </div>
        <div style={{ marginTop: 16, fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
          Admin Telegram: @{TELEGRAM_USERNAME}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ color: "#00FF88", fontFamily: "JetBrains Mono", padding: 40 }}>[ LOADING... ]</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
