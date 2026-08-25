"use client";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import MatrixRain from "../MatrixRain";

function DashboardContent(){
  const router=useRouter();
  const [user,setUser]=useState<any>(null);
  const [licenses,setLicenses]=useState<any[]>([]);
  const [keyInput,setKeyInput]=useState("");
  const [eaUrl,setEaUrl]=useState("");

  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{
      if(!data.session) router.replace("/login");
      else {
        setUser(data.session.user);
        const {data:lic}=await supabase.from("licenses").select("*").eq("user_id",data.session.user.id);
        if(lic) setLicenses(lic);
        const {data: pub}=supabase.storage.from("ea-builds").getPublicUrl("DARYANTO_BOT.ex5");
        if(pub) setEaUrl(pub.publicUrl);
      }
    });
  },[]);

  const claim=async()=>{
    const {data,error}=await supabase.from("licenses").select("*").eq("license_key",keyInput).single();
    if(!data){alert("License tidak ditemukan");return;}
    if(data.user_id){alert("Sudah diklaim");return;}
    await supabase.from("licenses").update({user_id:user.id,claimed_at:new Date().toISOString()}).eq("id",data.id);
    location.reload();
  };

  if(!user) return null;
  return (
    <>
      <header className="mx-header"><div className="mx-header-inner">
        <div className="mx-logo"><span>DARYANTOBOT</span><span style={{color:"#00FF88"}}>_PRO</span></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,fontFamily:"JetBrains Mono"}}>{user.email}</span><a href="/dashboard/admin" className="mx-btn-outline">$ Admin</a><button onClick={async()=>{await supabase.auth.signOut(); router.replace("/");}} className="mx-btn-outline">Logout</button></div>
      </div></header>
      <div className="mx-dash-wrap">
        <div className="mx-dash-card"><h3>DOWNLOAD_EA.EX5</h3><p>Satu file untuk semua tier. Tier auto dari license key.</p><a href={eaUrl||"/DARYANTO_BOT.ex5"} className="mx-btn-solid mx-glow-green" style={{marginTop:14,height:40,padding:"0 18px",display:"inline-flex"}}>▼ Download EA</a></div>
        <div className="mx-dash-card"><h3>KLAIM LICENSE BARU</h3><p>Masukkan key dari admin.</p><div style={{display:"flex",gap:10,marginTop:14}}><input value={keyInput} onChange={e=>setKeyInput(e.target.value.toUpperCase())} placeholder="DARY-XXXX-XXXX-XXXX" className="mx-input" style={{flex:1}}/><button onClick={claim} className="mx-btn-solid" style={{height:42,padding:"0 20px"}}>KLAIM</button></div></div>
        <div className="mx-dash-card"><h3>LICENSE SAYA [{licenses.length}]</h3>{licenses.length===0?<div style={{marginTop:12,fontFamily:"JetBrains Mono",fontSize:11,color:"rgba(255,255,255,0.4)",border:"1px dashed rgba(255,255,255,0.15)",padding:12}}>[ ] Belum ada license</div>:licenses.map((l,i)=><div key={i} style={{marginTop:8,fontFamily:"JetBrains Mono",fontSize:12}}><span style={{color:"#00FF88"}}>{l.license_key}</span> - {l.tier}</div>)}</div>
      </div>
    </>
  );
}

export default function Dashboard(){
  return <div className="mx-root"><MatrixRain/><div className="mx-grid-bg"/><Suspense><DashboardContent/></Suspense></div>
}
