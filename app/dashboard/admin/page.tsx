"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MatrixRain from "../../MatrixRain";

export default function AdminPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [activations, setActivations] = useState<any[]>([]);
  const [tier, setTier] = useState("Premium");
  const [emailBuyer, setEmailBuyer] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data: lic } = await supabase.from("licenses").select("*").order("created_at", { ascending: false });
    const { data: act } = await supabase.from("activations").select("*").order("last_online", { ascending: false }).limit(10);
    if (lic) setLicenses(lic);
    if (act) setActivations(act);
  };

  useEffect(() => { load(); }, []);

  const genKey = () => {
    const s = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DARY-${s()}-${s()}-${s()}${Math.floor(Math.random()*99)}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    const key = genKey();
    const expired = tier === "VIP" || tier.includes("Lifetime") ? null : new Date(Date.now() + 365*24*60*60*1000).toISOString();
    const { error } = await supabase.from("licenses").insert({
      license_key: key,
      tier: tier.replace(" (365 hari)", ""),
      status: "active",
      expired_at: expired,
      email_buyer: emailBuyer || null,
      catatan: catatan || null,
    });
    setLoading(false);
    if (error) alert(error.message);
    else { setEmailBuyer(""); setCatatan(""); load(); }
  };

  return (
    <div className="mx-root">
      <MatrixRain />
      <div className="mx-grid-bg" />
      <header className="mx-header"><div className="mx-header-inner">
        <div className="mx-logo"><span>DARYANTO BOT</span><span style={{color:"#00FF88"}}> - ADMIN</span><span className="cursor"/></div>
        <div style={{display:"flex",gap:8}}><a href="/dashboard" className="mx-btn-outline">Member View</a><a href="/" className="mx-btn-outline">$ Landing</a></div>
      </div></header>

      <div style={{maxWidth:1280, margin:"0 auto", padding:"20px 24px"}}>
        {/* STATS */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20}}>
          {[
            {label:"Total License", val: licenses.length},
            {label:"Aktif (30 menit terakhir)", val: activations.filter((a:any)=> new Date().getTime() - new Date(a.last_online).getTime() < 30*60*1000).length},
            {label:"Total Download", val: "0/0/0"},
            {label:"Demo / Premium / VIP", val: `${licenses.filter(l=>l.tier==="Demo").length} / ${licenses.filter(l=>l.tier==="Premium").length} / ${licenses.filter(l=>l.tier==="VIP").length}`},
          ].map((s,i)=>(
            <div key={i} style={{border:"1px solid rgba(0,255,136,0.2)", background:"#0a0a0a", padding:"12px", fontFamily:"JetBrains Mono"}}>
              <div style={{fontSize:10, color:"rgba(255,255,255,0.4)"}}>{s.label}</div>
              <div style={{fontSize:20, fontWeight:700, color:"#00FF88", marginTop:4}}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* GENERATE */}
        <div style={{border:"1px solid rgba(0,255,136,0.3)", background:"#0a0a0a", padding:20, marginBottom:20}}>
          <h2 style={{fontFamily:"JetBrains Mono", fontSize:18, fontWeight:900, marginBottom:12}}>Generate License Baru</h2>
          <div style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"end", fontFamily:"JetBrains Mono", fontSize:12}}>
            <div><label style={{fontSize:10,color:"#00FF88"}}>Tier</label><br/>
              <select value={tier} onChange={e=>setTier(e.target.value)} className="mx-input" style={{height:36, width:200}}>
                <option>Demo</option><option>Premium (365 hari)</option><option>VIP</option><option>Lifetime</option>
              </select>
            </div>
            <div><label style={{fontSize:10,color:"#00FF88"}}>Email buyer (opsional)</label><br/>
              <input value={emailBuyer} onChange={e=>setEmailBuyer(e.target.value)} placeholder="Kosongkan kalau belum tau" className="mx-input" style={{height:36, width:260}}/>
            </div>
            <div><label style={{fontSize:10,color:"#00FF88"}}>Catatan (opsional)</label><br/>
              <input value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder="mis. nama buyer" className="mx-input" style={{height:36, width:260}}/>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="mx-btn-solid mx-glow-green" style={{height:36, padding:"0 20px"}}>{loading?"[ GENERATING... ]":"Generate"}</button>
          </div>
        </div>

        {/* TABLE LICENSE */}
        <div style={{border:"1px solid rgba(255,255,255,0.1)", background:"#0a0a0a", padding:16, overflowX:"auto"}}>
          <h3 style={{fontFamily:"JetBrains Mono", marginBottom:12}}>Semua License ({licenses.length})</h3>
          <table style={{width:"100%", fontFamily:"JetBrains Mono", fontSize:11, borderCollapse:"collapse"}}>
            <thead><tr style={{color:"rgba(255,255,255,0.4)", borderBottom:"1px solid rgba(255,255,255,0.1)"}}><th style={{textAlign:"left", padding:"8px"}}>Key</th><th>Tier</th><th>Status</th><th>MT5 Account</th><th>Broker</th><th>Expired</th><th>Catatan</th></tr></thead>
            <tbody>{licenses.map((l:any,i:number)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}><td style={{padding:"8px", color:"#00FF88"}}>{l.license_key}</td><td>{l.tier}</td><td><span className="mx-dot"/>{l.status}</td><td>{l.mt5_account||"-"}</td><td>{l.broker||"-"}</td><td>{l.expired_at? new Date(l.expired_at).toLocaleDateString(): "Lifetime"}</td><td>{l.catatan||"-"}</td></tr>
            ))}</tbody>
          </table>
        </div>

        {/* AKTIVASI TERBARU */}
        <div style={{border:"1px solid rgba(255,255,255,0.1)", background:"#0a0a0a", padding:16, marginTop:16, overflowX:"auto"}}>
          <h3 style={{fontFamily:"JetBrains Mono", marginBottom:12}}>Aktivasi Terbaru ({activations.length})</h3>
          <table style={{width:"100%", fontFamily:"JetBrains Mono", fontSize:11, borderCollapse:"collapse"}}>
            <thead><tr style={{color:"rgba(255,255,255,0.4)", borderBottom:"1px solid rgba(255,255,255,0.1)"}}><th style={{textAlign:"left", padding:"8px"}}>License</th><th>MT5 Account</th><th>Broker</th><th>Symbol</th><th>Terakhir Online</th><th>Status</th></tr></thead>
            <tbody>{activations.map((a:any,i:number)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}><td style={{padding:"8px", color:"rgba(255,255,255,0.7)"}}>{a.license_key}</td><td>{a.mt5_account}</td><td>{a.broker}</td><td>{a.symbol}</td><td>{a.last_online? new Date(a.last_online).toLocaleString(): "-"}</td><td style={{color: new Date().getTime() - new Date(a.last_online).getTime() < 10*60*1000 ? "#00FF88":"rgba(255,255,255,0.4)"}}>{new Date().getTime() - new Date(a.last_online).getTime() < 10*60*1000 ? "online":"offline"}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
