import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ── Design tokens (logo-matched) ── */
const T = {
  teal:      "#2ec4b6",
  tealDark:  "#1fa89c",
  tealLight: "#e6f9f8",
  tealGlow:  "rgba(46,196,182,0.18)",
  charcoal:  "#333d42",
  mid:       "#4a5568",
  muted:     "#8896a5",
  light:     "#b0bec5",
  border:    "#e4eaee",
  cream:     "#f5fafa",
  white:     "#ffffff",
};

const font  = "'DM Sans', sans-serif";
const serif = "'Playfair Display', serif";

/* Inject Google Fonts once */
if (!document.getElementById("iw-fonts")) {
  const l = document.createElement("link");
  l.id = "iw-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

/* Inject keyframes once */
if (!document.getElementById("iw-kf")) {
  const s = document.createElement("style");
  s.id = "iw-kf";
  s.textContent = `
    @keyframes iw-rise    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes iw-spin    { to{transform:rotate(360deg)} }
    @keyframes iw-pulse   { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(1.07);opacity:1} }
    @keyframes iw-shimmer { 0%,100%{opacity:.3} 50%{opacity:.7} }
  `;
  document.head.appendChild(s);
}

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [hov, setHov] = useState({});
  const h = (k, v) => setHov(p => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data);
      } catch { /* silent */ } finally { setLoading(false); }
    })();
  }, []);

  const initials  = userData ? `${userData.firstName?.[0]??''}${userData.lastName?.[0]??''}` : '…';
  const roleLabel = { employer:"Recruteur", admin:"Administrateur" }[userData?.role] ?? "Candidat";
  const joinDate  = new Date(userData?.createdAt ?? Date.now())
    .toLocaleDateString("fr-MA", { year:"numeric", month:"long", day:"numeric" });

  return (
    <div style={{ fontFamily:font, background:T.cream, minHeight:"100vh", color:T.charcoal }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:T.charcoal, height:"64px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 48px", boxShadow:"0 1px 0 rgba(255,255,255,.07)",
      }}>
        <span
          onClick={() => navigate('/feed')}
          style={{ fontFamily:serif, fontSize:"24px", fontWeight:700, color:"#fff", letterSpacing:"2px", cursor:"pointer" }}
        >
          <span style={{ color:T.teal }}>i</span>work
        </span>
        <button
          onMouseEnter={() => h("back",true)} onMouseLeave={() => h("back",false)}
          onClick={() => navigate('/feed')}
          style={{
            display:"flex", alignItems:"center", gap:"8px",
            background: hov.back ? "rgba(255,255,255,.1)" : "transparent",
            border:`1px solid ${hov.back ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)"}`,
            color: hov.back ? "#fff" : "rgba(255,255,255,.7)",
            padding:"8px 16px", borderRadius:"8px",
            fontFamily:font, fontSize:"14px", fontWeight:500, cursor:"pointer", transition:"all .2s",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour aux offres
        </button>
      </nav>

      {/* ── BODY ── */}
      <div style={{
        maxWidth:"1100px", margin:"0 auto",
        padding:"48px 48px 80px",
        display:"grid", gridTemplateColumns:"260px 1fr", gap:"28px", alignItems:"start",
      }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          background:T.charcoal, borderRadius:"20px",
          padding:"36px 28px", textAlign:"center",
          position:"sticky", top:"88px", overflow:"hidden",
        }}>
          {/* glow */}
          <div style={{
            position:"absolute", top:"-60px", right:"-60px",
            width:"200px", height:"200px",
            background:`radial-gradient(circle, ${T.tealGlow} 0%, transparent 70%)`,
            pointerEvents:"none",
          }}/>

          {/* Avatar */}
          <div style={{ position:"relative", width:"96px", height:"96px", margin:"0 auto 20px" }}>
            <div style={{
              width:"96px", height:"96px", borderRadius:"50%",
              background:`linear-gradient(135deg, ${T.teal} 0%, ${T.tealDark} 100%)`,
              color:"#fff", fontFamily:serif, fontSize:"30px", fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative", zIndex:1,
            }}>{initials}</div>
            <div style={{
              position:"absolute", inset:"-4px", borderRadius:"50%",
              border:`2px solid ${T.teal}55`,
              animation:"iw-pulse 3s ease-in-out infinite",
            }}/>
          </div>

          {loading ? (
            <div style={{ marginBottom:"28px" }}>
              <div style={{ background:"rgba(255,255,255,.12)", borderRadius:"6px", width:"80%", height:"22px", margin:"0 auto 10px", animation:"iw-shimmer 1.5s ease-in-out infinite" }}/>
              <div style={{ background:"rgba(255,255,255,.12)", borderRadius:"6px", width:"50%", height:"14px", margin:"0 auto", animation:"iw-shimmer 1.5s ease-in-out infinite" }}/>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily:serif, fontSize:"20px", fontWeight:700, color:"#fff", marginBottom:"8px", lineHeight:1.2 }}>
                {userData?.firstName} {userData?.lastName}
              </h1>
              <span style={{
                display:"inline-block",
                background:T.tealGlow, border:`1px solid ${T.teal}55`,
                color:T.teal, fontSize:"11px", fontWeight:600,
                letterSpacing:"2px", textTransform:"uppercase",
                padding:"5px 14px", borderRadius:"999px", marginBottom:"28px",
              }}>{roleLabel}</span>
            </>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <button
              onMouseEnter={() => h("edit",true)} onMouseLeave={() => h("edit",false)}
              style={{
                width:"100%", border:"none",
                background: hov.edit ? T.tealDark : T.teal,
                color:"#fff", padding:"12px", borderRadius:"10px",
                fontFamily:font, fontSize:"14px", fontWeight:600, cursor:"pointer",
                transition:"all .2s",
                transform: hov.edit ? "translateY(-1px)" : "none",
                boxShadow: hov.edit ? `0 6px 18px ${T.tealGlow}` : "none",
              }}
            >Modifier le profil</button>
            <button
              onMouseEnter={() => h("out",true)} onMouseLeave={() => h("out",false)}
              onClick={() => { localStorage.clear(); navigate('/feed'); }}
              style={{
                width:"100%",
                background: hov.out ? "rgba(220,70,70,.09)" : "transparent",
                border:`1px solid ${hov.out ? "rgba(220,80,80,.5)" : "rgba(255,255,255,.15)"}`,
                color: hov.out ? "#f88" : "rgba(255,255,255,.5)",
                padding:"11px", borderRadius:"10px",
                fontFamily:font, fontSize:"14px", cursor:"pointer", transition:"all .2s",
              }}
            >Déconnexion</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
          {loading ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"16px", padding:"60px", color:T.muted }}>
              <div style={{
                width:"36px", height:"36px",
                border:`3px solid ${T.border}`, borderTopColor:T.teal,
                borderRadius:"50%", animation:"iw-spin .8s linear infinite",
              }}/>
              <p>Chargement du profil…</p>
            </div>
          ) : (
            <>
              {/* Info Card */}
              <Card delay={0}>
                <CardHeader eyebrow="Informations personnelles"/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
                  <InfoItem label="Prénom"        value={userData?.firstName} />
                  <InfoItem label="Nom"           value={userData?.lastName}  />
                  <InfoItem label="Adresse e-mail" value={userData?.email} full />
                  <InfoItem label="Rôle"          value={roleLabel}           />
                  <InfoItem label="Membre depuis" value={joinDate}            />
                </div>
              </Card>

              {/* Stats Card */}
              <Card delay={80}>
                <CardHeader eyebrow="Activité"/>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:T.border, borderRadius:"12px", overflow:"hidden" }}>
                  {[["0","Candidatures"],["0","Offres sauvegardées"],["0","Entretiens"]].map(([n,l]) => (
                    <div key={l} style={{ background:T.white, padding:"24px 20px", textAlign:"center" }}>
                      <span style={{ display:"block", fontFamily:serif, fontSize:"36px", fontWeight:700, color:T.teal, lineHeight:1, marginBottom:"6px" }}>{n}</span>
                      <span style={{ display:"block", fontSize:"12px", fontWeight:500, color:T.muted, textTransform:"uppercase", letterSpacing:"1px" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Documents Card */}
              <Card delay={160}>
                <CardHeader eyebrow="Documents" action="+ Ajouter"/>
                <div style={{ textAlign:"center", padding:"28px 20px", color:T.muted }}>
                  <div style={{ fontSize:"36px", marginBottom:"12px" }}>📄</div>
                  <p style={{ fontSize:"14px", lineHeight:1.7, marginBottom:"20px" }}>
                    Aucun document ajouté.<br/>Importez votre CV pour postuler plus vite.
                  </p>
                  <UploadBtn />
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function Card({ children, delay = 0 }) {
  return (
    <section style={{
      background: T.white, border:`1.5px solid ${T.border}`,
      borderRadius:"20px", padding:"28px 32px",
      boxShadow:"0 2px 8px rgba(51,61,66,.06)",
      animation:`iw-rise .35s ease ${delay}ms both`,
    }}>{children}</section>
  );
}

function CardHeader({ eyebrow, action }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      marginBottom:"22px", paddingBottom:"16px", borderBottom:`1px solid ${T.border}`,
    }}>
      <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:T.muted }}>{eyebrow}</span>
      {action && (
        <button style={{
          fontSize:"13px", fontWeight:600, color:T.charcoal,
          background:T.cream, border:`1px solid ${T.border}`,
          padding:"5px 14px", borderRadius:"8px", cursor:"pointer", fontFamily:font,
        }}>{action}</button>
      )}
    </div>
  );
}

function InfoItem({ label, value, full }) {
  return (
    <div style={full ? { gridColumn:"1 / -1" } : {}}>
      <span style={{ display:"block", fontSize:"11px", fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", color:T.light, marginBottom:"5px" }}>{label}</span>
      <span style={{ display:"block", fontSize:"15px", fontWeight:500, color:T.charcoal }}>{value ?? "—"}</span>
    </div>
  );
}

function UploadBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.teal : "transparent",
        border:`1.5px solid ${T.teal}`, color: hov ? "#fff" : T.teal,
        padding:"10px 24px", borderRadius:"10px",
        fontFamily:font, fontSize:"14px", fontWeight:600,
        cursor:"pointer", transition:"all .2s",
        transform: hov ? "translateY(-1px)" : "none",
      }}
    >Importer un CV</button>
  );
}