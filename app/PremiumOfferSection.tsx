"use client";

const BROKER_REF_LINK = "https://one.exnessonelink.com/a/ur59lmpmyz";
const TELEGRAM_USERNAME = "daryantobot";

const claimHref = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(
  [
    "Halo Admin, saya mau klaim PREMIUM GRATIS lewat program partner broker.",
    "",
    "• Sudah daftar via link partner: Ya",
    "• Sudah deposit min $10: Ya",
    "• Nama  : (belum diisi)",
    "• Email : (belum diisi)",
    "• ID Akun Broker : (belum diisi)",
    "",
    "Berikut saya lampirkan screenshot bukti deposit.",
  ].join("\n")
)}`;

export default function PremiumOfferSection() {
  return (
    <section className="mx-section" id="premium-gratis">
      <div className="promo-card">
        <div className="promo-badge">PROGRAM PARTNER BROKER</div>
        <h2 className="promo-title">
          Dapatkan <span style={{ color: "#00FF88" }}>PREMIUM GRATIS</span> — Bukan Beli Lisensi
        </h2>
        <p className="promo-sub">
          Daftar akun trading lewat link partner broker rekomendasi kami, deposit minimal <b style={{ color: "#fff" }}>$10</b>,
          lisensi Premium DaryantoBot Pro (senilai Rp 499.000) langsung kami kasih gratis — bukan diskon, gratis penuh.
        </p>

        <div className="promo-steps">
          <div className="promo-step">
            <div className="promo-step-num">1</div>
            <div>
              <div className="promo-step-title">Daftar via Link Partner</div>
              <div className="promo-step-desc">Buka akun trading baru lewat link broker resmi kami di bawah.</div>
            </div>
          </div>
          <div className="promo-step">
            <div className="promo-step-num">2</div>
            <div>
              <div className="promo-step-title">Deposit Minimal $10</div>
              <div className="promo-step-desc">Dana masuk langsung ke akun broker milik kamu sendiri, bukan ke kami.</div>
            </div>
          </div>
          <div className="promo-step">
            <div className="promo-step-num">3</div>
            <div>
              <div className="promo-step-title">Kirim Bukti ke Admin</div>
              <div className="promo-step-desc">Screenshot akun & bukti deposit, kirim via Telegram untuk klaim Premium gratis.</div>
            </div>
          </div>
        </div>

        <div className="promo-cta-row">
          <a href={BROKER_REF_LINK} target="_blank" rel="noopener noreferrer" className="mx-btn-solid mx-glow-green" style={{ height: 48, padding: "0 26px", justifyContent: "center" }}>
            ▶ Daftar Broker Sekarang
          </a>
          <a href={claimHref} target="_blank" rel="noopener noreferrer" className="mx-btn-outline" style={{ height: 48, padding: "0 26px", justifyContent: "center" }}>
            Sudah Deposit? Klaim Premium
          </a>
        </div>

        <div className="promo-disclosure">
          * Link di atas adalah tautan afiliasi/partner — kami menerima komisi dari broker jika kamu mendaftar & trading lewat link ini,
          ini tidak menambah biaya trading kamu sama sekali. Deposit sepenuhnya masuk ke akun broker atas nama kamu sendiri, bukan ke
          rekening kami. Trading forex/crypto mengandung risiko kehilangan modal — lakukan riset sendiri sebelum deposit.
        </div>
      </div>
    </section>
  );
}
