"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MatrixRain from "../MatrixRain";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [inputKey, setInputKey] = useState("");
  const [eaUrl, setEaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [overallStats, setOverallStats] = useState<any>(null);
  const [tierStats, setTierStats] = useState<any[]>([]);

  const ADMIN_EMAILS = ["daryanto.id@gmail.com", "daryanto.store@gmail.com", "linasofah44@gmail.com"];

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      // EA url
      const { data } = supabase.storage.from("ea-builds").getPublicUrl("DARYANTO_BOT.ex5");
      setEaUrl(data.publicUrl);
      loadLicenses(user.id);
      loadStats();
    })();
  }, []);

  const loadStats = async () => {
    const { data: overall } = await supabase.from("signal_stats_overall").select("*").single();
    if (overall) setOverallStats(overall);
    const { data: byTier } = await supabase.from("signal_stats_by_tier").select("*").order("tier");
    if (byTier) setTierStats(byTier);
  };

  const loadLicenses = async (uid?: string) => {
    const id = uid || user?.id;
    if (!id) return;
    const { data, error } = await supabase.from("licenses").select("*").eq("user_id", id).order("created_at", { ascending: false });
    if (!error && data) setLicenses(data);
  };

  const handleKlaim = async () => {
    if (!inputKey.trim()) return;
    setLoading(true);
    const key = inputKey.trim().toUpperCase();

    const { data: lic, error: e1 } = await supabase.from("licenses").select("*").eq("license_key", key).maybeSingle();
    if (e1) { setLoading(false); alert("Error cek key: " + e1.message); return; }
    if (!lic) { setLoading(false); alert("Key tidak ditemukan: " + key); return; }
    if (lic.user_id) { setLoading(false); alert("Key sudah dipakai oleh: " + (lic.email_buyer||"user lain")); return; }

    const { error: e2 } = await supabase.from("licenses").update({
      user_id: user.id,
      email_buyer: user.email,
      claimed_at: new Date().toISOString()
    }).eq("license_key", key);

    setLoading(false);
    if (e2) { alert("Gagal klaim - RLS belum fix: " + e2.message + "\n\nRUN SQL yang aku kasih di admin untuk UPDATE policy"); return; }

    alert("Berhasil klaim: " + key + " [" + lic.tier + "]");
    setInputKey("");
    loadLicenses();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

  if (!user) return null;

  return (
    <main className="mx-root">
      <MatrixRain />
      <div className="mx-grid-bg" />
      <header className="mx-header"><div className="mx-header-inner">
        <div className="mx-logo"><span>DARYANTOBOT</span><span style={{color:"#00FF88"}}>_PRO</span><span className="cursor"/></div>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <span style={{fontFamily:"JetBrains Mono", fontSize:11, color:"rgba(255,255,255,0.6)"}}>{user.email}</span>
          {ADMIN_EMAILS.includes(user.email) && <a href="/dashboard/admin" className="mx-btn-outline" style={{borderColor:"#00FF88", color:"#00FF88"}}>$ Admin</a>}
          <button onClick={handleLogout} className="mx-btn-outline">Logout</button>
        </div>
      </div></header>

      <div style={{maxWidth:900, margin:"0 auto", padding:"32px 24px", fontFamily:"JetBrains Mono"}}>
        {/* PERFORMANCE STATS */}
        <div style={{border:"1px solid rgba(0,255,136,0.25)", background:"rgba(10,10,10,0.95)", padding:20, marginBottom:16}}>
          <div style={{fontWeight:900, fontSize:13, marginBottom:4}}>[PERFORMANCE_MATRIX]</div>
          <div style={{fontSize:10.5, color:"rgba(255,255,255,0.55)", marginBottom:16, lineHeight:1.6}}>
            Data asli dari log sinyal EA (real-time), bukan angka karangan. Win rate rendah tidak selalu berarti rugi —
            tergantung rasio TP:SL tiap sinyal, bukan cuma menang/kalahnya.
          </div>

          {!overallStats ? (
            <div style={{fontSize:11, color:"rgba(255,255,255,0.4)"}}>Memuat data...</div>
          ) : overallStats.total_closed === 0 ? (
            <div style={{fontSize:11, color:"rgba(255,255,255,0.4)"}}>Belum ada sinyal yang selesai (closed) untuk ditampilkan.</div>
          ) : (
            <>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px,1fr))", gap:12, marginBottom:18}}>
                <div>
                  <div style={{fontSize:9.5, color:"rgba(255,255,255,0.5)"}}>TOTAL SIGNAL CLOSED</div>
                  <div style={{fontSize:22, fontWeight:900, color:"#fff"}}>{overallStats.total_closed}</div>
                </div>
                <div>
                  <div style={{fontSize:9.5, color:"rgba(255,255,255,0.5)"}}>WIN RATE</div>
                  <div style={{fontSize:22, fontWeight:900, color:"#00FF88"}}>{overallStats.win_rate_pct}%</div>
                </div>
                <div>
                  <div style={{fontSize:9.5, color:"rgba(255,255,255,0.5)"}}>WIN / LOSS</div>
                  <div style={{fontSize:22, fontWeight:900, color:"#fff"}}>{overallStats.wins} / {overallStats.losses}</div>
                </div>
                <div>
                  <div style={{fontSize:9.5, color:"rgba(255,255,255,0.5)"}}>SYMBOLS TRACKED</div>
                  <div style={{fontSize:22, fontWeight:900, color:"#fff"}}>{overallStats.symbols_tracked}</div>
                </div>
              </div>

              <div style={{fontSize:10, fontWeight:800, color:"rgba(255,255,255,0.6)", marginBottom:8, letterSpacing:"0.05em"}}>BREAKDOWN PER TIER SINYAL</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
                      <th style={{textAlign:"left", padding:"6px 8px", color:"rgba(255,255,255,0.5)"}}>TIER</th>
                      <th style={{textAlign:"right", padding:"6px 8px", color:"rgba(255,255,255,0.5)"}}>CLOSED</th>
                      <th style={{textAlign:"right", padding:"6px 8px", color:"rgba(255,255,255,0.5)"}}>WIN</th>
                      <th style={{textAlign:"right", padding:"6px 8px", color:"rgba(255,255,255,0.5)"}}>LOSS</th>
                      <th style={{textAlign:"right", padding:"6px 8px", color:"rgba(255,255,255,0.5)"}}>WIN RATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tierStats.map((t) => (
                      <tr key={t.tier} style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                        <td style={{padding:"6px 8px", fontWeight:800}}>{t.tier}</td>
                        <td style={{padding:"6px 8px", textAlign:"right"}}>{t.total_closed}</td>
                        <td style={{padding:"6px 8px", textAlign:"right", color:"#00FF88"}}>{t.wins}</td>
                        <td style={{padding:"6px 8px", textAlign:"right", color:"#FF4757"}}>{t.losses}</td>
                        <td style={{padding:"6px 8px", textAlign:"right", fontWeight:800}}>{t.win_rate_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* DOWNLOAD */}
        <div style={{border:"1px solid rgba(255,255,255,0.12)", background:"rgba(10,10,10,0.9)", padding:20, marginBottom:16}}>
          <div style={{fontWeight:900, fontSize:13, marginBottom:6}}>DOWNLOAD_EA.EX5</div>
          <div style={{fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:16}}>Satu file untuk semua tier. Tier auto dari license key.</div>
          <a href={eaUrl} target="_blank" className="mx-btn-solid mx-glow-green" style={{display:"inline-block", padding:"10px 18px", fontSize:12, textDecoration:"none"}}>▼ Download EA</a>
          <div style={{fontSize:9, color:"rgba(255,255,255,0.55)", marginTop:10, wordBreak:"break-all"}}>{eaUrl}</div>

          <div style={{marginTop:14, border:"1px solid rgba(0,255,136,0.3)", background:"rgba(0,255,136,0.05)", padding:12}}>
            <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:8}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
                <path d="M12 2 L20 5.5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5.5 L12 2 Z" fill="rgba(0,255,136,0.12)" stroke="#00FF88" strokeWidth="1.4"/>
                <path d="M8 12 L11 15 L16.5 8.5" stroke="#00FF88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span style={{color:"#00FF88", fontWeight:900, fontSize:11}}>VIRUSTOTAL VERIFIED</span>
              <span style={{fontSize:10, color:"rgba(255,255,255,0.58)"}}>0 / 60 engine mendeteksi ancaman</span>
            </div>
            <div style={{fontSize:9.5, color:"rgba(255,255,255,0.5)", wordBreak:"break-all", marginBottom:6}}>
              SHA-256: 38811b7bcac1c703288cfb37f8fde2a40a26f5dcd28700d282509e28c6ee1287
            </div>
            <a href="https://www.virustotal.com/gui/file/38811b7bcac1c703288cfb37f8fde2a40a26f5dcd28700d282509e28c6ee1287/detection" target="_blank" rel="noopener noreferrer" style={{fontSize:10, color:"#00FF88"}}>
              Lihat laporan lengkap di VirusTotal →
            </a>
          </div>
        </div>

        {/* KLAIM */}
        <div style={{border:"1px solid rgba(0,255,136,0.25)", background:"rgba(10,10,10,0.95)", padding:20, marginBottom:16}}>
          <div style={{fontWeight:900, fontSize:13, marginBottom:6}}>KLAIM LICENSE BARU</div>
          <div style={{fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:16}}>Masukkan key dari admin.</div>

          <ol className="dash-steps">
            <li><b>Tunggu key dari Admin.</b> Setelah pembayaran/deposit kamu diverifikasi, Admin kirim license key ke chat Telegram kamu (format <code>DARY-XXXX-XXXX-XXXX</code>).</li>
            <li><b>Salin (copy)</b> key tersebut dari chat Telegram.</li>
            <li><b>Tempel (paste)</b> di kolom input di bawah ini.</li>
            <li>Klik tombol <b>KLAIM</b> — kalau berhasil, license langsung aktif dan muncul di daftar "LICENSE SAYA" di bawah.</li>
          </ol>

          <div style={{display:"flex", gap:8, marginTop:14}}>
            <input value={inputKey} onChange={e=>setInputKey(e.target.value.toUpperCase())} placeholder="DARY-XXXX-XXXX-XXXX" className="mx-input" style={{flex:1, height:42, textTransform:"uppercase"}} onKeyDown={e=> e.key==="Enter" && handleKlaim()}/>
            <button onClick={handleKlaim} disabled={loading || !inputKey} className="mx-btn-solid" style={{height:42, padding:"0 22px"}}>{loading?"[... ]":"KLAIM"}</button>
          </div>

          <div style={{marginTop:12, fontSize:10.5, color:"rgba(255,255,255,0.58)"}}>
            Belum punya key atau belum dapat balasan Admin?{" "}
            <a href="https://t.me/daryantobot" target="_blank" rel="noopener noreferrer" style={{color:"#00FF88"}}>Chat Admin di Telegram →</a>
          </div>
        </div>

        {/* LIST */}
        <div style={{border:"1px solid rgba(255,255,255,0.12)", background:"rgba(10,10,10,0.9)", padding:20}}>
          <div style={{fontWeight:900, fontSize:13, marginBottom:12}}>LICENSE SAYA [{licenses.length}]</div>
          {licenses.length===0 ? (
            <div style={{border:"1px dashed rgba(255,255,255,0.2)", padding:12, fontSize:11, color:"rgba(255,255,255,0.58)"}}>[ ] Belum ada license</div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {licenses.map((l:any,i:number)=>(
                <div key={i} style={{border:"1px solid rgba(0,255,136,0.2)", padding:12, display:"flex", justifyContent:"space-between", alignItems:"center", background:"#0a0a0a"}}>
                  <div>
                    <div style={{color:"#00FF88", fontSize:13, fontWeight:700}}>{l.license_key}</div>
                    <div style={{fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:4}}>Tier: {l.tier} | Exp: {l.expired_at? new Date(l.expired_at).toLocaleDateString(): "Lifetime"} | Status: {l.status}</div>
                  </div>
                  <span style={{border:"1px solid rgba(0,255,136,0.3)", padding:"4px 8px", fontSize:10}}>{l.tier}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
