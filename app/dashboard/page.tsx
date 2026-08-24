"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, EDGE_URL } from "@/lib/supabaseClient";

const EA_BUCKET = "ea-builds";
const EA_FILENAME = "DARYANTO_BOT_LICENSED.ex5";

type LicenseRow = {
  id: string;
  license_key: string;
  status: string;
  account_login: number | null;
  broker_name: string | null;
  expires_at: string | null;
  issued_at: string;
  products: { name: string; tier: string } | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [claimKey, setClaimKey] = useState("");
  const [claimMsg, setClaimMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [claiming, setClaiming] = useState(false);

  async function loadData() {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      router.replace("/login");
      return;
    }
    setUserEmail(session.user.email ?? "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();
    setIsAdmin(profile?.role === "admin");

    const { data: lic } = await supabase
      .from("licenses")
      .select("id, license_key, status, account_login, broker_name, expires_at, issued_at, products(name, tier)")
      .eq("owner_id", session.user.id)
      .order("issued_at", { ascending: false });

    setLicenses((lic as any) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setClaiming(true);
    setClaimMsg(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    try {
      const res = await fetch(`${EDGE_URL}/claim-license`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ license_key: claimKey.trim() }),
      });
      const json = await res.json();
      setClaimMsg({ ok: json.ok, text: json.message || (json.ok ? "Berhasil" : "Gagal") });
      if (json.ok) {
        setClaimKey("");
        loadData();
      }
    } catch {
      setClaimMsg({ ok: false, text: "Gagal menghubungi server. Coba lagi." });
    }
    setClaiming(false);
  }

  async function handleDownload() {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    if (uid) {
      await supabase.from("downloads").insert({ user_id: uid });
    }
    const { data } = supabase.storage.from(EA_BUCKET).getPublicUrl(EA_FILENAME);
    window.open(data.publicUrl, "_blank");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  function statusBadge(status: string, expiresAt: string | null) {
    const expired = expiresAt && new Date(expiresAt) < new Date();
    const cls = expired ? "expired" : status;
    const label = expired ? "expired" : status;
    return <span className={`badge ${cls}`}>{label}</span>;
  }

  if (loading) return <div className="container">Memuat...</div>;

  return (
    <>
      <div className="topbar">
        <div className="brand">DARYANTO BOT</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="muted">{userEmail}</span>
          {isAdmin && (
            <a className="btn secondary" href="/dashboard/admin">
              Admin Panel
            </a>
          )}
          <button className="btn secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2>Download EA</h2>
          <p className="muted">
            Satu file EA berlaku untuk semua tier (Demo/Premium/VIP) - tier ditentukan otomatis dari license
            key yang kamu masukkan di Inputs EA saat dipasang di chart.
          </p>
          <button className="btn" onClick={handleDownload}>
            Download DARYANTO_BOT.ex5
          </button>
        </div>

        <div className="card">
          <h2>Klaim License Baru</h2>
          <p className="muted">Masukkan license key yang diberikan admin, biar muncul di daftar bawah.</p>
          {claimMsg && <div className={`msg ${claimMsg.ok ? "success" : "error"}`}>{claimMsg.text}</div>}
          <form onSubmit={handleClaim} className="row">
            <div>
              <input
                placeholder="DARY-XXXX-XXXX-XXXX"
                value={claimKey}
                onChange={(e) => setClaimKey(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: "0 0 auto" }}>
              <button className="btn" type="submit" disabled={claiming}>
                {claiming ? "Memproses..." : "Klaim"}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2>License Saya</h2>
          {licenses.length === 0 ? (
            <p className="muted">Belum ada license yang diklaim.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>MT5 Account</th>
                  <th>Expired</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((l) => (
                  <tr key={l.id}>
                    <td className="mono">{l.license_key}</td>
                    <td>
                      <span className={`badge ${l.products?.tier ?? ""}`}>{l.products?.tier ?? "-"}</span>
                    </td>
                    <td>{statusBadge(l.status, l.expires_at)}</td>
                    <td className="mono">{l.account_login ?? <span className="muted">belum dipakai</span>}</td>
                    <td>{l.expires_at ? new Date(l.expires_at).toLocaleDateString("id-ID") : "Lifetime"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
