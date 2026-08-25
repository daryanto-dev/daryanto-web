"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MatrixRain from "../MatrixRain";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") || "";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { setError(error.message); return; }
      router.push(intent ? `/dashboard?intent=${intent}` : "/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) { setError(error.message); return; }
      setInfo("Akun berhasil dibuat. Cek email verifikasi, lalu login.");
      setMode("login");
    }
  }

  return (
    <div className="mx-auth-card">
      <div className="mx-logo" style={{ justifyContent: "center", marginBottom: 16 }}>
        <span>DARYANTOBOT</span><span style={{ color: "#00FF88" }}>_PRO</span><span className="cursor" />
      </div>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(0,255,136,0.6)", textAlign: "center", marginBottom: 18 }}>
        SYSTEM: SUPABASE SECURED // VER: 15.0_ONLINE
      </div>

      {intent && (
        <div className="mx-intent-badge">
          INTENT: {intent.toUpperCase()} // {intent === "demo" ? "Gratis 30 hari" : intent === "premium" ? "Rp 499K / Tahun" : "Rp 1.499JT Lifetime"}
        </div>
      )}

      <div className="mx-tabs">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>[ LOGIN ]</button>
        <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>[ DAFTAR ]</button>
      </div>

      {error && <div className="mx-msg" style={{ borderColor: "rgba(255,80,80,0.4)", color: "#ff6b6b", background: "rgba(255,80,80,0.08)" }}>{"> ERROR: " + error}</div>}
      {info && <div className="mx-msg">{"> " + info}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mx-field"><label>EMAIL</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trader@exness.com" className="mx-input" /></div>
        <div className="mx-field"><label>PASSWORD</label><input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="minimal 6 karakter" className="mx-input" /></div>
        <button className="mx-btn-solid mx-glow-green" type="submit" disabled={loading} style={{ width: "100%", height: 44, justifyContent: "center", marginTop: 8 }}>
          {loading ? "[ PROCESSING... ]" : mode === "login" ? "▶ LOGIN" : "▶ BUAT AKUN"}
        </button>
      </form>

      <div className="mx-terminal-hint">{"> auth.supabase.co // secure // 1 license = 1 akun MT5"}</div>
      <a href="/" className="mx-back">← Kembali ke landing</a>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-root">
      <MatrixRain />
      <div className="mx-grid-bg" />
      <div className="mx-auth-wrap">
        <Suspense fallback={<div style={{ color: "#00FF88", fontFamily: "JetBrains Mono" }}>[ LOADING AUTH... ]</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
