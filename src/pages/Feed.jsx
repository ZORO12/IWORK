import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { City } from 'country-state-city';

/* ── Design tokens ── */
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
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";
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
    @keyframes iw-fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    /* Scrollbar */
    .iw-scroll::-webkit-scrollbar { width:4px }
    .iw-scroll::-webkit-scrollbar-track { background:transparent }
    .iw-scroll::-webkit-scrollbar-thumb { background:${T.border}; border-radius:4px }
  `;
  document.head.appendChild(s);
}

export default function Feed() {
  const navigate = useNavigate();
  const [userName,    setUserName]    = useState(null);
  const [jobs,        setJobs]        = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [cityInput,   setCityInput]   = useState("");
  const [selectedCity,setSelectedCity]= useState(null);
  const [showDropdown,setShowDropdown]= useState(false);
  const [hov, setHov] = useState({});
  const h = (k, v) => setHov(p => ({ ...p, [k]: v }));

  const cityData = useMemo(() =>
    City.getCitiesOfCountry("MA").map(c => ({ label: c.name, value: c.name }))
  , []);

  const filteredCities = useMemo(() => {
    if (!cityInput) return [];
    return cityData.filter(c => c.label.toLowerCase().startsWith(cityInput.toLowerCase())).slice(0, 6);
  }, [cityInput, cityData]);

  const handleSearch = useCallback(async () => {
    try {
      const params = {};
      if (searchTerm)  params.search   = searchTerm;
      if (selectedCity) params.location = selectedCity.value;
      const res = await api.get("/api/jobs", { params });
      setJobs(res.data);
      setSelectedJob(res.data.length > 0 ? res.data[0] : null);
    } catch (err) { console.error("Erreur recherche", err); }
  }, [searchTerm, selectedCity]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
          setUserName(`${data.firstName} ${data.lastName}`);
        } catch { localStorage.removeItem("token"); }
      }
      handleSearch();
    })();
  }, [handleSearch]);

  // const handleApply = (jobId) => {
  //   if (!localStorage.getItem("token")) navigate("/auth", { state: { mode:"login" } });
  //   else console.log("Postuler:", jobId);
  // };
  const handleApply = (job) => {
  if (!localStorage.getItem("token")) navigate("/auth", { state: { mode: "login" } });
  else navigate(`/apply/${job.id}`, { state: { job } }); // pass job to skip extra fetch
};

  const TAGS = ["Développeur","Marketing","Design","Finance","RH"];

  return (
    <div style={{ fontFamily:font, background:T.cream, minHeight:"100vh", color:T.charcoal }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:T.charcoal, height:"64px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 48px", boxShadow:"0 1px 0 rgba(255,255,255,.07)",
      }}>
        <span style={{ fontFamily:serif, fontSize:"24px", fontWeight:700, color:"#fff", letterSpacing:"2px" }}>
          <span style={{ color:T.teal }}>i</span>work
        </span>

        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          {userName ? (
            <>
              <span
                onClick={() => navigate('/profile')}
                onMouseEnter={() => h("user",true)} onMouseLeave={() => h("user",false)}
                style={{
                  display:"flex", alignItems:"center", gap:"8px",
                  color: hov.user ? "#fff" : "rgba(255,255,255,.8)",
                  fontSize:"14px", fontWeight:500, cursor:"pointer",
                  padding:"6px 12px", borderRadius:"8px",
                  background: hov.user ? "rgba(255,255,255,.08)" : "transparent",
                  transition:"all .2s",
                }}
              >
                <span style={{
                  width:"30px", height:"30px", borderRadius:"50%",
                  background:T.teal, color:"#fff",
                  fontWeight:700, fontSize:"13px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>{userName.charAt(0)}</span>
                {userName}
              </span>
              <button
                onMouseEnter={() => h("out",true)} onMouseLeave={() => h("out",false)}
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                style={{
                  background: hov.out ? "rgba(220,70,70,.1)" : "transparent",
                  border:`1px solid ${hov.out ? "rgba(220,80,80,.5)" : "rgba(255,255,255,.2)"}`,
                  color: hov.out ? "#f88" : "rgba(255,255,255,.65)",
                  padding:"8px 16px", borderRadius:"8px",
                  fontFamily:font, fontSize:"14px", cursor:"pointer", transition:"all .2s",
                }}
              >Déconnexion</button>
            </>
          ) : (
            <>
              <button
                onMouseEnter={() => h("login",true)} onMouseLeave={() => h("login",false)}
                onClick={() => navigate('/auth', { state:{ mode:'login' } })}
                style={{
                  background: hov.login ? "rgba(255,255,255,.08)" : "transparent",
                  border:`1px solid ${hov.login ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.22)"}`,
                  color: hov.login ? "#fff" : "rgba(255,255,255,.75)",
                  padding:"8px 18px", borderRadius:"8px",
                  fontFamily:font, fontSize:"14px", fontWeight:500, cursor:"pointer", transition:"all .2s",
                }}
              >Connexion</button>
              <button
                onMouseEnter={() => h("reg",true)} onMouseLeave={() => h("reg",false)}
                onClick={() => navigate('/auth', { state:{ mode:'register' } })}
                style={{
                  background: hov.reg ? T.tealDark : T.teal,
                  border:"none", color:"#fff",
                  padding:"8px 20px", borderRadius:"8px",
                  fontFamily:font, fontSize:"14px", fontWeight:600, cursor:"pointer",
                  transition:"all .2s",
                  transform: hov.reg ? "translateY(-1px)" : "none",
                  boxShadow: hov.reg ? `0 4px 16px ${T.tealGlow}` : "none",
                }}
              >Inscription</button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        background:T.charcoal,
        padding:"72px 48px 64px",
        position:"relative", overflow:"hidden",
      }}>
        {/* glow blobs */}
        <div style={{ position:"absolute", top:"-80px", right:"-100px", width:"500px", height:"500px",
          background:`radial-gradient(circle, ${T.tealGlow} 0%, transparent 65%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-100px", left:"25%", width:"400px", height:"400px",
          background:"radial-gradient(circle, rgba(30,168,156,0.08) 0%, transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:"760px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"12px", fontWeight:600, letterSpacing:"3px", textTransform:"uppercase", color:T.teal, marginBottom:"16px" }}>
            Trouvez votre prochain rôle
          </p>
          <h1 style={{ fontFamily:serif, fontSize:"clamp(34px,5vw,54px)", fontWeight:700, color:"#fff", lineHeight:1.15, marginBottom:"40px" }}>
            Des milliers d'offres<br/><em style={{ fontStyle:"italic", color:T.teal }}>au Maroc</em>
          </h1>

          {/* Search bar */}
          <div style={{
            display:"flex", alignItems:"center",
            background:T.white, borderRadius:"16px",
            padding:"6px", boxShadow:"0 20px 60px rgba(0,0,0,.22)",
          }}>
            {/* Keyword */}
            <div style={{ display:"flex", alignItems:"center", flex:2, padding:"0 16px", gap:"10px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" width="18" height="18" style={{ flexShrink:0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text" placeholder="Poste, mots-clés ou entreprise…"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ border:"none", outline:"none", fontFamily:font, fontSize:"15px", color:T.charcoal, width:"100%", background:"transparent", padding:"12px 0" }}
              />
            </div>

            <div style={{ width:"1px", height:"36px", background:T.border, flexShrink:0 }}/>

            {/* City */}
            <div style={{ display:"flex", alignItems:"center", flex:1, padding:"0 16px", gap:"10px", position:"relative" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" width="18" height="18" style={{ flexShrink:0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                type="text" placeholder="Ville ou région…"
                value={cityInput}
                onChange={e => { setCityInput(e.target.value); setShowDropdown(true); setSelectedCity(null); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                style={{ border:"none", outline:"none", fontFamily:font, fontSize:"15px", color:T.charcoal, width:"100%", background:"transparent", padding:"12px 0" }}
              />
              {showDropdown && filteredCities.length > 0 && (
                <div style={{
                  position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
                  background:T.white, border:`1px solid ${T.border}`,
                  borderRadius:"12px", boxShadow:"0 8px 32px rgba(0,0,0,.1)", zIndex:200, overflow:"hidden",
                }}>
                  {filteredCities.map(city => (
                    <div
                      key={city.value}
                      onMouseDown={() => { setSelectedCity(city); setCityInput(city.label); setShowDropdown(false); }}
                      style={{ padding:"11px 16px", fontSize:"14px", color:T.charcoal, cursor:"pointer", transition:"background .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = T.cream}
                      onMouseLeave={e => e.currentTarget.style.background = T.white}
                    >{city.label}</div>
                  ))}
                </div>
              )}
            </div>

            <button
              onMouseEnter={() => h("search",true)} onMouseLeave={() => h("search",false)}
              onClick={handleSearch}
              style={{
                background: hov.search ? T.tealDark : T.teal,
                border:"none", color:"#fff",
                padding:"14px 28px", borderRadius:"12px",
                fontFamily:font, fontSize:"15px", fontWeight:600, cursor:"pointer",
                transition:"all .2s", whiteSpace:"nowrap", flexShrink:0,
                transform: hov.search ? "translateY(-1px)" : "none",
              }}
            >Rechercher</button>
          </div>

          {/* Quick tags */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginTop:"20px" }}>
            {TAGS.map(tag => (
              <span
                key={tag}
                onClick={() => { setSearchTerm(tag); setTimeout(handleSearch, 0); }}
                onMouseEnter={e => { e.currentTarget.style.background = T.tealGlow; e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.color = T.teal; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; e.currentTarget.style.color = "rgba(255,255,255,.7)"; }}
                style={{
                  background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.18)",
                  color:"rgba(255,255,255,.7)", padding:"5px 14px", borderRadius:"999px",
                  fontSize:"13px", cursor:"pointer", transition:"all .2s",
                }}
              >{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOARD ── */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"36px 48px 80px" }}>
        <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:T.muted, marginBottom:"20px" }}>
          {jobs.length} offre{jobs.length !== 1 ? "s" : ""} trouvée{jobs.length !== 1 ? "s" : ""}
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:"24px", alignItems:"start" }}>

          {/* ── JOB LIST ── */}
          <div className="iw-scroll" style={{ display:"flex", flexDirection:"column", gap:"10px", maxHeight:"calc(100vh - 220px)", overflowY:"auto", paddingRight:"4px" }}>
            {jobs.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:T.muted }}>
                <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</div>
                <p style={{ fontSize:"14px", lineHeight:1.6 }}>Aucune offre trouvée.<br/>Essayez d'autres mots-clés.</p>
              </div>
            ) : jobs.map(job => {
              const active = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  style={{
                    background: active ? T.charcoal : T.white,
                    border:`1.5px solid ${active ? T.charcoal : T.border}`,
                    borderRadius:"12px", padding:"18px",
                    display:"flex", alignItems:"center", gap:"14px",
                    cursor:"pointer", transition:"all .2s",
                    transform: active ? "translateX(4px)" : "translateX(0)",
                    boxShadow: active ? "0 8px 32px rgba(51,61,66,.15)" : "0 2px 8px rgba(51,61,66,.05)",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.transform = "translateX(2px)"; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateX(0)"; }}}
                >
                  {/* logo */}
                  <div style={{
                    width:"44px", height:"44px", borderRadius:"10px", flexShrink:0,
                    background: active ? "rgba(255,255,255,.12)" : T.tealLight,
                    border:`1px solid ${active ? "rgba(255,255,255,.2)" : T.teal+"33"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:serif, fontSize:"18px", fontWeight:700,
                    color: active ? "#fff" : T.teal,
                  }}>
                    {(job.company?.name || "C").charAt(0)}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"15px", fontWeight:600, color: active ? "#fff" : T.charcoal, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:"3px" }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize:"13px", color: active ? "rgba(255,255,255,.6)" : T.muted, marginBottom:"8px" }}>
                      {job.company?.name}
                    </div>
                    <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                      {[job.location, job.type].filter(Boolean).map(tag => (
                        <span key={tag} style={{
                          fontSize:"11px", fontWeight:500,
                          background: active ? "rgba(255,255,255,.12)" : T.tealLight,
                          border:`1px solid ${active ? "rgba(255,255,255,.2)" : T.teal+"33"}`,
                          color: active ? "rgba(255,255,255,.75)" : T.tealDark,
                          padding:"3px 8px", borderRadius:"999px",
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <span style={{ fontSize:"20px", color: active ? T.teal : T.light }}>›</span>
                </div>
              );
            })}
          </div>

          {/* ── JOB DETAIL ── */}
          <div style={{ position:"sticky", top:"80px" }}>
            {selectedJob ? (
              <div style={{
                background:T.white, border:`1.5px solid ${T.border}`,
                borderRadius:"20px", padding:"36px",
                boxShadow:"0 2px 8px rgba(51,61,66,.06)",
                animation:"iw-fade-in .25s ease",
              }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:"16px", marginBottom:"20px" }}>
                  <div style={{
                    width:"56px", height:"56px", borderRadius:"14px", flexShrink:0,
                    background:T.charcoal, color:T.teal,
                    fontFamily:serif, fontSize:"22px", fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {(selectedJob.company?.name || "C").charAt(0)}
                  </div>
                  <div>
                    <h2 style={{ fontFamily:serif, fontSize:"24px", fontWeight:700, color:T.charcoal, lineHeight:1.25, marginBottom:"4px" }}>
                      {selectedJob.title}
                    </h2>
                    <p style={{ fontSize:"15px", fontWeight:500, color:T.muted }}>{selectedJob.company?.name}</p>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"28px" }}>
                  {[
                    selectedJob.location && `📍 ${selectedJob.location}`,
                    selectedJob.type     && `💼 ${selectedJob.type}`,
                    selectedJob.salary   && `💰 ${selectedJob.salary}`,
                  ].filter(Boolean).map(b => (
                    <span key={b} style={{
                      fontSize:"13px", fontWeight:500,
                      background:T.tealLight, border:`1px solid ${T.teal}33`,
                      color:T.tealDark, padding:"6px 14px", borderRadius:"999px",
                    }}>{b}</span>
                  ))}
                </div>

                {/* Apply button */}
                <button
                  onMouseEnter={() => h("apply",true)} onMouseLeave={() => h("apply",false)}
                  onClick={() => handleApply(selectedJob)}
                  style={{
                    width:"100%", border:"none",
                    background: hov.apply ? T.tealDark : T.teal,
                    color:"#fff", padding:"16px 24px", borderRadius:"12px",
                    fontFamily:font, fontSize:"16px", fontWeight:600, cursor:"pointer",
                    transition:"all .22s", marginBottom:"28px",
                    transform: hov.apply ? "translateY(-2px)" : "none",
                    boxShadow: hov.apply ? `0 8px 24px ${T.tealGlow}` : "none",
                  }}
                >Postuler maintenant →</button>

                <div style={{ height:"1px", background:T.border, marginBottom:"28px" }}/>

                <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:T.muted, marginBottom:"14px" }}>
                  Description du poste
                </p>
                <div className="iw-scroll" style={{ fontSize:"15px", lineHeight:1.75, color:T.charcoal, whiteSpace:"pre-line", maxHeight:"45vh", overflowY:"auto" }}>
                  {selectedJob.description}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign:"center", padding:"80px 20px", color:T.muted,
                background:T.white, border:`1.5px dashed ${T.border}`, borderRadius:"20px",
              }}>
                <div style={{ fontSize:"32px", marginBottom:"12px", color:T.light }}>←</div>
                <p style={{ fontSize:"15px", lineHeight:1.6 }}>Sélectionnez une offre<br/>pour voir les détails</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}