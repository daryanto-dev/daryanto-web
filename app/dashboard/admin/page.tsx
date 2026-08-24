"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, EDGE_URL } from "@/lib/supabaseClient";

type LicenseRow = {
  id: string;
  license_key: string;
  status: string;
  account_login: number | null;
  broker_name: string | null;
  expires_at: string | null;
  issued_at: string;
  notes: string | null;
  products: { name: string; tier: string } | null;
};

type ActivationRow = {
  id: string;
  account_login: number;
  broker_name: string | null;
  symbol: string | null;
  first_seen_at: string;
  last_heartbeat_at: string;
  licenses: { license_key: string } | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [activations, setActivations] = useState<ActivationRow[]>([]);
  const [totalDownloads, setTotalDownloads] = useState(0);

  const [productCode, setProductCode] = useState("PREMIUM");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function loadAll() {
    const { data: lic } = await supabase
      .from("licenses")
      .select("id, license_key, status, account_login, broker_name, expires_at, issued_at, notes, products(name, tier)")
      .order("issued_at", { ascending: false })
      .limit(200);
    setLicenses((lic as any) ?? []);

    const { data: act } = await supabase
      .from("activations")
      .select("id, account_login, broker_name, symbol, first_seen_at, last_heartbeat_at, licenses(license_key)")
      .order("last_heartbeat_at", { ascending: false })
      .limit(200);
    setActivations((act as any) ?? []);

    const { count } = await supabase.from("downloads").select("*", { count: "exact", head: true });
    setTotalDownloads(count ?? 0);
  }

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        router.replace("/dashboard");
        return;
      }
      setAllowed(true);
      setChecking(false);
      loadAll();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setGenMsg(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    try {
      const res = await fetch(`${EDGE_URL}/generate-license`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          product_code: productCode,
          owner_email: ownerEmail.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setGenMsg({ ok: true, text: `Berhasil: ${json.license.license_key}` });
        setOwnerEmail("");
        setNotes("");
        loadAll();
      } else {
        setGenMsg({ ok: false, text: json.message || "Gagal generate license" });
      }
    } catch {
      setGenMsg({ ok: false, text: "Gagal menghubungi server." });
    }
    setGenerating(false);
  }

  function isOnline(lastHeartbeat: string) {
    const diffMin = (Date.now() - new Date(lastHeartbeat).getTime()) / 60000;
    return diffMin <= 30;
  }

  if (checking || !allowed) return <div className="container">Memuat...</div>;

  const countByTier = (tier: string) => licenses.filter((l) => l.products?.tier === tier).length;
  const activeCount = activations.filter((a) => isOnline(a.last_heartbeat_at)).length;

  return (
    <>
      <div className="topbar">
        <div className="brand">DARYANTO BOT - ADMIN</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a className="btn secondary" href="/dashboard">
            Member View
          </a>
        </div>
      </div>

      <div className="container">
        <div className="stat-grid">
          <div className="stat-box">
            <div className="num">{licenses.length}</div>
            <div className="lbl">Total License</div>
          </div>
          <div className="stat-box">
            <div className="num">{activeCount}</div>
            <div className="lbl">Aktif (30 menit terakhir)</div>
          </div>
          <div className="stat-box">
            <div className="num">{totalDownloads}</div>
            <div className="lbl">Total Download</div>
          </div>
          <div className="stat-box">
            <div className="num">{countByTier("demo")}/{countByTier("premium")}/{countByTier("vip")}</div>
            <div className="lbl">Demo / Premium / VIP</div>
          </div>
        </div>

        <div className="card">
          <h2>Generate License Baru</h2>
          {genMsg && <div className={`msg ${genMsg.ok ? "success" : "error"}`}>{genMsg.text}</div>}
          <form onSubmit={handleGenerate}>
            <div className="row">
              <div>
                <label>Tier</label>
                <select value={productCode} onChange={(e) => setProductCode(e.target.value)}>
                  <option value="DEMO">Demo (30 hari, XAUUSD only)</option>
                  <option value="PREMIUM">Premium (365 hari)</option>
                  <option value="VIP">VIP (Lifetime)</option>
                </select>
              </div>
              <div>
                <label>Email buyer (opsional)</label>
                <input
                  type="email"
                  placeholder="Kosongkan kalau belum tau"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Catatan (opsional)</label>
                <input placeholder="mis. nama buyer" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div style={{ flex: "0 0 auto" }}>
                <label>&nbsp;</label>
                <button className="btn" type="submit" disabled={generating}>
                  {generating ? "Membuat..." : "Generate"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Semua License ({licenses.length})</h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>MT5 Account</th>
                  <th>Broker</th>
                  <th>Expired</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((l) => (
                  <tr key={l.id}>
                    <td className="mono">{l.license_key}</td>
                    <td>
                      <span className={`badge ${l.products?.tier ?? ""}`}>{l.products?.tier ?? "-"}</span>
                    </td>
                    <td>
                      <span className={`badge ${l.status}`}>{l.status}</span>
                    </td>
                    <td className="mono">{l.account_login ?? "-"}</td>
                    <td>{l.broker_name ?? "-"}</td>
                    <td>{l.expires_at ? new Date(l.expires_at).toLocaleDateString("id-ID") : "Lifetime"}</td>
                    <td className="muted">{l.notes ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>Aktivasi Terbaru ({activations.length})</h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>License</th>
                  <th>MT5 Account</th>
                  <th>Broker</th>
                  <th>Symbol</th>
                  <th>Terakhir Online</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activations.map((a) => (
                  <tr key={a.id}>
                    <td className="mono">{a.licenses?.license_key ?? "-"}</td>
                    <td className="mono">{a.account_login}</td>
                    <td>{a.broker_name ?? "-"}</td>
                    <td>{a.symbol ?? "-"}</td>
                    <td>{new Date(a.last_heartbeat_at).toLocaleString("id-ID")}</td>
                    <td>
                      <span className={`badge ${isOnline(a.last_heartbeat_at) ? "online" : "offline"}`}>
                        {isOnline(a.last_heartbeat_at) ? "online" : "offline"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
