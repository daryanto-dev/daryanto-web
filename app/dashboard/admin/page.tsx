"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MatrixRain from "../../MatrixRain";

export default function AdminPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [activations, setActivations] = useState<any[]>([]);
  const [eaFiles, setEaFiles] = useState<any[]>([]);
  const [tier, setTier] = useState("Premium (365 hari)");
  const [emailBuyer, setEmailBuyer] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data: lic } = await supabase.from("licenses").select("*").order("created_at", { ascending: false });
    const { data: act } = await supabase.from("activations").select("*").order("last_online", { ascending: false }).limit(20);
    const { data: files } = await supabase.storage.from("ea-builds").list("", { sortBy: { column: "created_at", order: "desc" } });
    if (lic) setLicenses(lic);
    if (act) setActivations(act);
    if (files) setEaFiles(files);
  };

  useEffect(() => { load(); }, []);

  const genKey = () => {
    const s = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DARY-${s()}-${s()}-${s()}${Math.floor(Math.random() * 89 + 10)}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    const key = genKey();
    let cleanTier = "Premium";
    if (tier.toLowerCase().includes("demo")) cleanTier = "Demo";
    else if (tier.toLowerCase().includes("vip") || tier.toLowerCase().includes("lifetime")) cleanTier = "VIP";
    else cleanTier = "Premium";

    const expired = cleanTier === "VIP"? null : cleanTier === "Demo"? new Date(Date.now() + 30*24*60*60*1000).toISOString() : new Date(Date.now() + 365*24*60*60*1000).toISOString();

    const { error } = await supabase.from("licenses").insert({
      license_key: key,
      tier: cleanTier,
      status: "active",
      expired_at: expired,
      email_buyer: emailBuyer || null,
      catatan: catatan || null,
    });
    setLoading(false);
    if (error) alert(error.message);
    else { setEmailBuyer(""); setCatatan(""); load(); }
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = "DARYANTO_BOT.ex5";
    const { error } = await supabase.storage.from("ea-builds").upload(fileName, file, { upsert: true });
    setUploading(false);
    if (error) alert(error.message);
    else { alert("Upload sukses: " + fileName); load(); }
  };

  const copyKey = (k: string) => { navigator.clipboard.writeText(k); alert("Copied: " + k); };

  // STATS FIX
  const demo = licenses.filter(l => l.tier?.toLowerCase().includes("demo")).length;
  const prem = licenses.filter(l => l.tier?.toLowerCase().includes("premium")).length;
  const vip = licenses.filter(l => { const t = l.tier?.toLowerCase()||""; return t.includes("vip") || t.includes("lifetime"); }).length;

  return (
    <main className="mx-root">
      <MatrixRain />
      <div className="mx-grid-bg" />
      <header className="mx-header"><div className="mx-header-inner">
        <div className="mx-logo"><span>DARYANTO BOT</span><span style={{color:"#00FF88"}}> - ADMIN</span><span className="cursor"/></div>
        <div style={{display:"flex",gap:8}}>
          <label className="mx-btn-outline" style={{cursor:"pointer"}}>{uploading?"[ UPLOADING... ]":"▲ Upload EA.ex5"}<input type="file" accept=".ex5" onChange={handleUpload} style={{display:"none"}}/></label>
          <a href="/dashboard" className="mx-btn-outline">Member View</a>
          <a href="/" className="mx-btn-outline">$ Landing</a>
        </div>
      </div></header>

      <div style={{maxWidth:1280, margin:"0 auto", padding:"20px 24px"}}>
        {/* STATS */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:20}}>
          <div style={{border:"1px solid rgba(0,255,136,0.2)", background:"#0a0a0a", padding:"14px", fontFamily:"JetBrains Mono"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.58)"}}>Total License</div><div style={{fontSize:22,fontWeight:800,color:"#00FF88"}}>{licenses.length}</div></div>
          <div style={{border:"1px solid rgba(0,255,136,0.2)", background:"#0a0a0a", padding:"14px", fontFamily:"JetBrains Mono"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.58)"}}>Aktif (30 menit terakhir)</div><div style={{fontSize:22,fontWeight:800,color:"#00FFFF"}}>{activations.length}</div></div>
          <div style={{border:"1px solid rgba(0,255,136,0.2)", background:"#0a0a0a", padding:"14px", fontFamily:"JetBrains Mono"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.58)"}}>Total Download</div><div style={{fontSize:22,fontWeight:800,color:"#00FF88"}}>{eaFiles.length} file</div><div style={{fontSize:9,color:"rgba(255,255,255,0.55)",marginTop:4}}>{eaFiles[0]?.name||"-"}</div></div>
          <div style={{border:"1px solid rgba(0,255,136,0.2)", background:"#0a0a0a", padding:"14px", fontFamily:"JetBrains Mono"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.58)"}}>Demo / Premium / VIP</div><div style={{fontSize:22,fontWeight:800,color:"#00FF88"}}>{demo} / {prem} / {vip}</div></div>
        </div>

        {/* GENERATE */}
        <div style={{border:"1px solid rgba(0,255,136,0.3)", background:"rgba(10,10,10,0.95)", padding:20, marginBottom:20}}>
          <h2 style={{fontFamily:"JetBrains Mono", fontSize:16, fontWeight:900, marginBottom:14, letterSpacing:"0.1em"}}>Generate License Baru</h2>
          <div style={{display:"flex", gap:12, flexWrap:"wrap", alignItems:"end", fontFamily:"JetBrains Mono", fontSize:12}}>
            <div><label style={{fontSize:10,color:"#00FF88"}}>Tier</label><br/>
              <select value={tier} onChange={e=>setTier(e.target.value)} className="mx-input" style={{height:38, width:200, marginTop:6}}>
                <option>Demo</option><option>Premium (365 hari)</option><option>VIP</option><option>Lifetime</option>
              </select>
            </div>
            <div><label style={{fontSize:10,color:"#00FF88"}}>Email buyer (opsional)</label><br/>
              <input value={emailBuyer} onChange={e=>setEmailBuyer(e.target.value)} placeholder="Kosongkan kalau belum tau" className="mx-input" style={{height:38, width:280, marginTop:6}}/>
            </div>
            <div><label style={{fontSize:10,color:"#00FF88"}}>Catatan (opsional)</label><br/>
              <input value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder="mis. nama buyer" className="mx-input" style={{height:38, width:260, marginTop:6}}/>
            </div>
            <button onClick={handleGenerate} disabled={loading} className="mx-btn-solid mx-glow-green" style={{height:38, padding:"0 22px"}}>{loading?"[ GENERATING... ]":"Generate"}</button>
          </div>
        </div>

        {/* TABLE LICENSE */}
        <div style={{border:"1px solid rgba(255,255,255,0.1)", background:"#0a0a0a", padding:16, overflowX:"auto"}}>
          <h3 style={{fontFamily:"JetBrains Mono", fontSize:13, marginBottom:12}}>Semua License ({licenses.length})</h3>
          <table style={{width:"100%", fontFamily:"JetBrains Mono", fontSize:11, borderCollapse:"collapse"}}>
            <thead><tr style={{color:"rgba(255,255,255,0.58)", borderBottom:"1px solid rgba(255,255,255,0.1)"}}><th style={{textAlign:"left",padding:"10px 8px"}}>Key</th><th>Tier</th><th>Status</th><th>MT5 Account</th><th>Broker</th><th>Expired</th><th>Catatan</th><th>Action</th></tr></thead>
            <tbody>{licenses.map((l:any,i:number)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}><td style={{padding:"10px 8px", color:"#00FF88", cursor:"pointer"}} onClick={()=>copyKey(l.license_key)} title="Klik untuk copy">{l.license_key}</td><td><span style={{border:"1px solid rgba(0,255,136,0.3)", padding:"2px 6px", fontSize:10}}>{l.tier}</span></td><td><span className="mx-dot"/>{l.status}</td><td>{l.mt5_account||"-"}</td><td>{l.broker||"-"}</td><td>{l.expired_at? new Date(l.expired_at).toLocaleDateString(): "Lifetime"}</td><td style={{maxWidth:120, overflow:"hidden", textOverflow:"ellipsis"}}>{l.catatan||"-"}</td><td><button onClick={()=>copyKey(l.license_key)} style={{background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontSize:9, padding:"2px 6px", cursor:"pointer"}}>COPY</button></td></tr>
            ))}</tbody>
          </table>
        </div>

        {/* AKTIVASI */}
        <div style={{border:"1px solid rgba(255,255,255,0.1)", background:"#0a0a0a", padding:16, marginTop:16, overflowX:"auto"}}>
          <h3 style={{fontFamily:"JetBrains Mono", fontSize:13, marginBottom:12}}>Aktivasi Terbaru ({activations.length})</h3>
          <table style={{width:"100%", fontFamily:"JetBrains Mono", fontSize:11, borderCollapse:"collapse"}}>
            <thead><tr style={{color:"rgba(255,255,255,0.58)", borderBottom:"1px solid rgba(255,255,255,0.1)"}}><th style={{textAlign:"left",padding:"8px"}}>License</th><th>MT5 Account</th><th>Broker</th><th>Symbol</th><th>Terakhir Online</th><th>Status</th></tr></thead>
            <tbody>{activations.map((a:any,i:number)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}><td style={{padding:"8px"}}>{a.license_key?.slice(0,18)}...</td><td>{a.mt5_account}</td><td>{a.broker}</td><td>{a.symbol}</td><td>{a.last_online? new Date(a.last_online).toLocaleString(): "-"}</td><td style={{color:"#00FF88"}}>● online</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
