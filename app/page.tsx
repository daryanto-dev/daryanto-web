"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
      else setChecking(false);
    });
  }, [router]);

  if (checking) return null;

  return (
    <div className="container" style={{ maxWidth: 480, marginTop: 80, textAlign: "center" }}>
      <h1 style={{ color: "#d4af37", fontSize: 26 }}>DARYANTO BOT</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Member area untuk mengelola lisensi & download EA.
      </p>
      <a className="btn" href="/login">
        Login / Daftar
      </a>
    </div>
  );
}
