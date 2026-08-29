"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MatrixRain from "./MatrixRain";
import TradeChartHero from "./TradeChartHero";

const MODULES = [
  { id: "M01", icon: "◆", title: "BOS / CHoCH Detection", desc: "Deteksi break of structure dan change of character otomatis buat baca arah trend terkini, bukan tebak-tebakan.", meta: "Structure engine" },
  { id: "M02", icon: "▣", title: "Order Block & FVG", desc: "Kalibrasi otomatis berbasis ATR - zona supply/demand & fair value gap menyesuaikan volatilitas tiap simbol.", meta: "Zone confluence" },
  { id: "M03", icon: "▲", title: "Multi-Timeframe Trend", desc: "Panel MTF menampilkan bias M1/M5/M15/H1 sekaligus, biar kamu gak entry lawan arus timeframe besar.", meta: "MTF alignment" },
  { id: "M04", icon: "◈", title: "Harmonic Pattern Scan", desc: "Deteksi Gartley, Bat, Butterfly, Crab, dan AB=CD otomatis di setiap candle baru.", meta: "Pattern recognition" },
  { id: "M05", icon: "★", title: "Smart Confluence Score", desc: "Tiap sinyal dinilai dari 14 faktor - structure, HTF bias, liquidity sweep, zone, session, spread, dan lainnya.", meta: "Skor 0-14" },
  { id: "M06", icon: "◎", title: "SNIPER Mode (VIP)", desc: "Konfirmasi tambahan di TF lebih tinggi (H4) khusus setup presisi tinggi dengan RR lebih lebar - eksklusif tier VIP.", meta: "High-precision tier" },
];

// ── Efek ketik untuk headline hero ──
function TypedLine({ text, speed = 55, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <>{shown}</>;
}

// ── Wrapper fade-in + slide-up saat elemen masuk viewport ──
function RevealBox({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? "mx-reveal-visible" : "mx-reveal"}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [line2Visible, setLine2Visible] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
      else setChecking(false);
    });
  }, [router]);
  if (checking) return null;

  return (
    <div className="mx-root">
      <MatrixRain />
      <div className="mx-grid-bg" />
      <header className="mx-header">
        <div className="mx-header-inner">
          <div className="mx-logo"><span>DARYANTOBOT</span><span className="mx-glow-text" style={{color:"#00FF88"}}>_PRO</span><span className="cursor" /></div>
          <div className="mx-status-strip">
            <span className="hide-mobile"><span className="mx-dot" />SYSTEM: ONLINE</span>
            <span className="hide-mobile">LICENSE: SUPABASE SECURED</span>
            <span style={{color:"rgba(0,255,136,0.7)"}}>VER: 15.0_ONLINE</span>
          </div>
          <div style={{display:"flex",gap:10}}>
            <a href="#pricing" className="mx-btn-outline">$ Harga</a>
            <a href="/login" className="mx-btn-solid mx-glow-green">▶ Login Dashboard</a>
          </div>
        </div>
      </header>

      <section className="mx-hero">
        <div className="mx-badge"><span><span className="mx-dot" style={{boxShadow:"0 0 8px #00FF88"}} /><span style={{color:"#00FF88"}}>SIGNAL_ENGINE</span></span><span style={{width:1,height:16,background:"rgba(0,255,136,0.3)"}} /><span style={{color:"rgba(255,255,255,0.7)"}}>MULTI-TIER LICENSE SYSTEM</span></div>

        <h1 className="mx-h1">
          <span className="l1">
            <TypedLine text="AUTO SIGNAL" onDone={() => setLine2Visible(true)} />
            <span className="mx-type-cursor" />
          </span>
          <span className={`l2 ${line2Visible ? "mx-l2-visible" : "mx-l2-hidden"}`}>BUKAN AUTO TEBAK, INI MESIN DETEKSI
            ENTRY SEBELUM
            MARKET BERGERAK.</span>
        </h1>

        <div className="mx-terminal-line"><span className="prompt">&gt;</span> Sinyal Trading MT5 - manual entry, EA tidak buka order sendiri // lisensi online per-akun // tier Demo/Premium/VIP // performa tercatat otomatis & transparan</div>
        <div className="mx-cta-row">
          <a href="#pricing" className="mx-btn-solid mx-glow-green" style={{height:48,padding:"0 28px",fontSize:14}}>▶ Lihat Paket Bot</a>
          <a href="/login?intent=demo" className="mx-btn-outline" style={{height:48,padding:"0 28px",fontSize:13}}>[ ] Coba Demo (XAUUSD, 30 Hari)</a>
        </div>
        <TradeChartHero />
        <div className="mx-float-cards">
          <div className="mx-float-card accent"><div className="row"><span>XAUUSD • M15 • Struktur</span><span style={{color:"#00FF88"}}>BOS ✓</span></div><div className="big">Smart Confluence Score</div><div style={{marginTop:8,height:4,background:"rgba(255,255,255,0.1)"}}><div style={{height:"100%",width:"74%",background:"#00FF88"}} /></div></div>
          <div className="mx-float-card cyan" style={{animationDelay:"0.5s"}}><div className="row"><span>LICENSE • 1 KEY = 1 AKUN</span><span style={{color:"#00FFFF"}}>LOCKED</span></div><div className="big">Anti Share/Bajak</div><div style={{marginTop:8,height:4,background:"rgba(255,255,255,0.1)"}}><div style={{height:"100%",width:"100%",background:"#00FFFF"}} /></div></div>
          <div className="mx-float-card" style={{animationDelay:"1s"}}><div className="row"><span>PERFORMANCE_LOG</span><span>WIN/LOSS TRACKED</span></div><div className="big">Data Real, Bukan Klaim</div><div style={{marginTop:8,display:"flex",gap:6}}><span style={{fontSize:9,padding:"2px 6px",background:"rgba(0,255,136,0.2)",color:"#00FF88",border:"1px solid rgba(0,255,136,0.3)"}}>AUTO LOG</span><span style={{fontSize:9,padding:"2px 6px",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.1)"}}>PER TIER</span></div></div>
        </div>
      </section>

      <section className="mx-section">
        <RevealBox>
          <div className="mx-section-head"><h2 className="mx-section-title">MODULES<span className="accent">.SYS</span> <span style={{fontSize:14,color:"rgba(255,255,255,0.2)"}}>6_ACTIVE</span></h2><span style={{fontSize:11,color:"rgba(0,255,136,0.5)"}}>STATUS: ARMED</span></div>
        </RevealBox>
        <div className="mx-modules-grid">
          {MODULES.map((mod, idx) => (
            <RevealBox key={mod.id} delay={idx * 80}>
              <div className="mx-module-card">
                <div className="top"><span className="icon">{mod.icon}</span><span className="idtag">{mod.id}</span></div>
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
                <div style={{marginTop:16,fontSize:10,color:"rgba(0,255,255,0.6)",borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:12}}>{mod.meta}</div>
              </div>
            </RevealBox>
          ))}
        </div>
      </section>

      <section className="mx-section" id="pricing">
        <RevealBox>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{fontSize:11,letterSpacing:"0.3em",color:"rgba(0,255,136,0.7)"}}>PRICING_TABLE // CHOOSE_YOUR_TIER</div>
            <h2 style={{marginTop:12,fontWeight:900,fontSize:"clamp(28px,5vw,48px)"}}>DEPLOY BOT <span style={{color:"#00FF88"}}>SEKARANG</span></h2>
            <p style={{marginTop:12,fontSize:12,color:"rgba(255,255,255,0.4)"}}>Lisensi online resmi • 1 license = 1 akun MT5 • validasi real-time • Garansi setting ulang</p>
          </div>
        </RevealBox>
        <div className="mx-pricing-grid">
          <RevealBox delay={0}>
            <div className="mx-price-card">
              <div className="mx-price-tier">DEMO</div>
              <div className="mx-price-amount"><span className="num">Gratis</span><span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>/ 30 hari</span></div>
              <div className="mx-price-features">
                <div className="feat"><span className="chk">✓</span> Simbol XAUUSD saja</div>
                <div className="feat"><span className="chk">✓</span> Sinyal sampai tier STRONG</div>
                <div className="feat"><span className="chk">✓</span> Semua indikator visual aktif</div>
                <div className="feat" style={{color:"rgba(255,255,255,0.35)"}}>✕ Alert Telegram</div>
                <div className="feat" style={{color:"rgba(255,255,255,0.35)"}}>✕ Manajemen posisi otomatis</div>
              </div>
              <a href="/login?intent=demo" className="mx-btn-outline" style={{marginTop:24,justifyContent:"center"}}>Coba Demo</a>
            </div>
          </RevealBox>

          <RevealBox delay={120}>
            <div className="mx-price-card popular">
              <div className="mx-price-badge">PALING DIPILIH • HEMAT 50%</div>
              <div className="mx-price-tier">PREMIUM</div>
              <div className="mx-price-amount">
                <div style={{display:"flex",alignItems:"baseline",gap:8}}><span className="num" style={{color:"#00FF88"}}>Rp 499.000</span><span style={{fontSize:12,color:"rgba(255,255,255,0.5)",textDecoration:"line-through"}}>Rp 999.000</span></div>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>/ 1 Tahun • semua simbol</span>
              </div>
              <div className="mx-price-features">
                <div className="feat"><span className="chk">✓</span> Semua simbol, tanpa lock</div>
                <div className="feat"><span className="chk">✓</span> Sinyal sampai tier A+</div>
                <div className="feat"><span className="chk">✓</span> Alert Telegram real-time</div>
                <div className="feat"><span className="chk">✓</span> Manajemen posisi (BE/Trailing/Partial)</div>
                <div className="feat" style={{color:"rgba(255,255,255,0.35)"}}>✕ SNIPER Mode</div>
              </div>
              <a href="/checkout?tier=premium" className="mx-btn-solid mx-glow-green" style={{marginTop:24,justifyContent:"center"}}>Ambil Premium</a>
            </div>
          </RevealBox>

          <RevealBox delay={240}>
            <div className="mx-price-card">
              <div className="mx-price-tier">VIP • LIFETIME</div>
              <div className="mx-price-amount">
                <div style={{display:"flex",alignItems:"baseline",gap:8}}><span className="num">Rp 1.499.000</span><span style={{fontSize:12,color:"rgba(255,255,255,0.5)",textDecoration:"line-through"}}>Rp 2.999.000</span></div>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>/ sekali bayar • update selamanya</span>
              </div>
              <div className="mx-price-features">
                <div className="feat"><span className="chk">✓</span> Semua fitur Premium</div>
                <div className="feat"><span className="chk">✓</span> Sinyal tier SNIPER (paling ketat)</div>
                <div className="feat"><span className="chk">✓</span> Konfirmasi H4 khusus swing/long</div>
                <div className="feat"><span className="chk">✓</span> Prioritas alert</div>
                <div className="feat"><span className="chk">✓</span> Lisensi seumur hidup</div>
              </div>
              <a href="/checkout?tier=vip" className="mx-btn-outline" style={{marginTop:24,justifyContent:"center"}}>Ambil VIP</a>
            </div>
          </RevealBox>
        </div>
      </section>

      <section className="mx-section">
        <RevealBox>
          <div style={{border:"1px solid rgba(0,255,136,0.2)",background:"#000",padding:24,textAlign:"center"}}>
            <div style={{fontSize:11,letterSpacing:"0.2em",color:"rgba(0,255,136,0.6)"}}>[PERFORMANCE_MATRIX]</div>
            <p style={{marginTop:12,fontSize:13,color:"rgba(255,255,255,0.6)",maxWidth:560,marginLeft:"auto",marginRight:"auto"}}>Setiap sinyal tercatat otomatis (win/loss per tier) lewat sistem tracking real-time. Statistik performa akan tampil transparan di dashboard begitu data cukup terkumpul - bukan klaim yang dikarang di landing page.</p>
          </div>
        </RevealBox>
      </section>
      <footer className="mx-footer">DARYANTOBOT_PRO — Sinyal manual entry, EA tidak membuka order otomatis. Bukan nasihat finansial. Risiko trading ditanggung pengguna.</footer>
    </div>
  );
}
