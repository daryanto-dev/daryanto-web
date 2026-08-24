"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setInfo("Akun berhasil dibuat. Kamu bisa langsung login sekarang.");
      setMode("login");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 60 }}>
      <h1 style={{ textAlign: "center", color: "#d4af37" }}>DARYANTO BOT</h1>
      <div className="card" style={{ marginTop: 20 }}>
        <div className="tabs">
          <a className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} style={{ cursor: "pointer", flex: 1, textAlign: "center" }}>
            Login
          </a>
          <a className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} style={{ cursor: "pointer", flex: 1, textAlign: "center" }}>
            Daftar
          </a>
        </div>

        {error && <div className="msg error">{error}</div>}
        {info && <div className="msg success">{info}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="minimal 6 karakter" />
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Memproses..." : mode === "login" ? "Login" : "Buat Akun"}
          </button>
        </form>
      </div>
    </div>
  );
}
