import "./globals.css";
import AdminChatButton from "./AdminChatButton";

const SITE_URL = "https://daryanto-web-ra9i.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DaryantoBot Pro — Sinyal Trading MT5 (BOS/CHoCH, Multi-Timeframe)",
    template: "%s — DaryantoBot Pro",
  },
  description:
    "Sinyal trading MT5 berbasis deteksi struktur harga (BOS/CHoCH), order block, dan multi-timeframe. Manual entry, EA tidak buka order otomatis. Tier Demo/Premium/VIP.",
  openGraph: {
    title: "DaryantoBot Pro — Sinyal Trading MT5",
    description: "Mesin deteksi entry sebelum market bergerak. Manual entry, transparan, performa tercatat otomatis.",
    url: SITE_URL,
    siteName: "DaryantoBot Pro",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DaryantoBot Pro — Sinyal Trading MT5",
    description: "Mesin deteksi entry sebelum market bergerak. Manual entry, transparan.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <AdminChatButton />
      </body>
    </html>
  );
}
