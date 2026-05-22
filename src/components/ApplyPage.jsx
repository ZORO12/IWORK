import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from "../services/api";

/* ── Design tokens (matches Feed.jsx) ── */
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
  red:       "#e53e3e",
  redLight:  "#fff5f5",
};
const font  = "'DM Sans', sans-serif";
const serif = "'Playfair Display', serif";

/* ── Inject fonts / keyframes once ── */
if (!document.getElementById("ap-fonts")) {
  const l = document.createElement("link");
  l.id = "ap-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}
if (!document.getElementById("ap-kf")) {
  const s = document.createElement("style");
  s.id = "ap-kf";
  s.textContent = `
    @keyframes ap-rise    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ap-spin    { to{transform:rotate(360deg)} }
    @keyframes ap-pop     { 0%{opacity:0;transform:scale(.92) translateY(12px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes ap-check   { 0%{stroke-dashoffset:50} 100%{stroke-dashoffset:0} }
    @keyframes ap-shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
    .ap-field:focus-within label { color:${T.teal}; }
  `;
  document.head.appendChild(s);
}

/* ── Small helpers ── */
const Field = ({ label, name, type = "text", value, onChange, error, placeholder, readOnly, textarea }) => {
  const [focused, setFocused] = useState(false);
  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: `1.5px solid ${error ? T.red : focused ? T.teal : T.border}`,
    borderRadius: "10px", padding: textarea ? "14px 16px" : "0 16px",
    height: textarea ? "auto" : "48px", minHeight: textarea ? "110px" : undefined,
    fontFamily: font, fontSize: "15px", color: readOnly ? T.muted : T.charcoal,
    background: readOnly ? T.cream : T.white,
    outline: "none", resize: textarea ? "vertical" : undefined,
    transition: "border-color .2s, box-shadow .2s",
    boxShadow: focused ? `0 0 0 3px ${T.tealGlow}` : "none",
  };
  return (
    <div className="ap-field" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: focused ? T.teal : T.charcoal, letterSpacing: ".3px", transition: "color .2s" }}>
        {label} {readOnly && <span style={{ fontSize: "11px", color: T.muted, fontWeight: 400 }}>(depuis votre profil)</span>}
      </label>
      {textarea ? (
        <textarea
          name={name} value={value} onChange={onChange} placeholder={placeholder}
          readOnly={readOnly} style={inputStyle} rows={4}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} readOnly={readOnly} style={inputStyle}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      )}
      {error && <span style={{ fontSize: "12px", color: T.red }}>{error}</span>}
    </div>
  );
};

const Spinner = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "ap-spin .7s linear infinite" }}>
    <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2.5"/>
    <path d="M10 2a8 8 0 0 1 8 8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const SuccessBanner = ({ jobTitle, companyName, email, onBack }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 999,
    background: "rgba(30,40,44,.7)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
  }}>
    <div style={{
      background: T.white, borderRadius: "24px", padding: "48px 40px",
      maxWidth: "440px", width: "100%", textAlign: "center",
      boxShadow: "0 32px 80px rgba(0,0,0,.18)",
      animation: "ap-pop .4s cubic-bezier(.34,1.56,.64,1)",
    }}>
      {/* Checkmark circle */}
      <div style={{
        width: "80px", height: "80px", borderRadius: "50%",
        background: T.tealLight, margin: "0 auto 24px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="25" r="24" fill={T.teal}/>
          <polyline
            points="13,26 21,34 37,16" fill="none" stroke="#fff"
            strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="50" strokeDashoffset="0"
            style={{ animation: "ap-check .5s .2s ease both" }}
          />
        </svg>
      </div>

      <h2 style={{ fontFamily: serif, fontSize: "26px", color: T.charcoal, marginBottom: "10px" }}>
        Candidature envoyée !
      </h2>
      <p style={{ fontSize: "15px", color: T.muted, lineHeight: 1.7, marginBottom: "8px" }}>
        Vous avez postulé avec succès à <strong style={{ color: T.charcoal }}>{jobTitle}</strong> chez{" "}
        <strong style={{ color: T.charcoal }}>{companyName}</strong>.
      </p>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: T.tealLight, border: `1px solid ${T.teal}33`,
        borderRadius: "999px", padding: "8px 16px", margin: "12px 0 28px",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2" width="16" height="16">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <span style={{ fontSize: "13px", fontWeight: 500, color: T.tealDark }}>
          Confirmation envoyée à {email}
        </span>
      </div>

      <button
        onClick={onBack}
        style={{
          width: "100%", border: "none",
          background: T.charcoal, color: "#fff",
          padding: "14px 24px", borderRadius: "12px",
          fontFamily: font, fontSize: "15px", fontWeight: 600, cursor: "pointer",
        }}
      >
        Retour aux offres →
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ApplyPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { jobId } = useParams(); // Route: /apply/:jobId

  // Job info passed via router state (from Feed) or fetched
  const jobFromState = location.state?.job;
  const [job, setJob] = useState(jobFromState || null);

  const [form, setForm] = useState({
    firstName:    "",
    lastName:     "",
    email:        "",
    phone:        "",
    coverLetter:  "",
    cvUrl:        "",
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [serverError, setServerError] = useState("");
  const [hov, setHov] = useState({});
  const h = (k, v) => setHov(p => ({ ...p, [k]: v }));
  const shakeRef = useRef(null);

  /* ── Load user profile + job (if not in state) ── */
  useEffect(() => {
  let mounted = true;

  (async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { state: { mode: "login" } });
      return;
    }

    try {
      const [userRes, jobRes] = await Promise.all([
        api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        !job
          ? api.get(`/api/jobs/${jobId}`)
          : Promise.resolve({ data: job }),
      ]);

      const u = userRes.data;

      if (mounted) {
        setForm((f) => ({
          ...f,
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          phone: u.phone || "",
          cvUrl: u.curriculum_vitae || "",
        }));

        if (!job) {
          setJob(jobRes.data);
        }
      }
    } catch (err) {
      console.error(err);
      navigate("/feed");
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  })();

  return () => {
    mounted = false;
  };
}, [job, jobId, navigate]);
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim())  e.lastName  = "Nom requis";
    if (!form.email.trim())     e.email     = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide";
    if (!form.cvUrl.trim())     e.cvUrl     = "Lien CV requis — veuillez d'abord l'uploader dans votre profil";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      if (shakeRef.current) {
        shakeRef.current.style.animation = "none";
        void shakeRef.current.offsetHeight;
        shakeRef.current.style.animation = "ap-shake .35s ease";
      }
      return;
    }

    setSubmitting(true);
    setServerError("");
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/api/applications/apply/${jobId}`,
        { jobId, coverLetter: form.coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Une erreur est survenue.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) return (
    <div style={{ fontFamily: font, background: T.cream, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: T.muted }}>
        <svg width="32" height="32" viewBox="0 0 32 32" style={{ animation: "ap-spin .7s linear infinite", marginBottom: "16px" }}>
          <circle cx="16" cy="16" r="13" fill="none" stroke={T.border} strokeWidth="3"/>
          <path d="M16 3a13 13 0 0 1 13 13" fill="none" stroke={T.teal} strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <p style={{ fontSize: "14px" }}>Chargement de votre profil…</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: font, background: T.cream, minHeight: "100vh", color: T.charcoal }}>

      {/* Success overlay */}
      {success && (
        <SuccessBanner
          jobTitle={job?.title}
          companyName={job?.company?.name}
          email={form.email}
          onBack={() => navigate("/")}
        />
      )}

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: T.charcoal, height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", boxShadow: "0 1px 0 rgba(255,255,255,.07)",
      }}>
        <span
          onClick={() => navigate("/")}
          style={{ fontFamily: serif, fontSize: "24px", fontWeight: 700, color: "#fff", letterSpacing: "2px", cursor: "pointer" }}
        >
          <span style={{ color: T.teal }}>i</span>work
        </span>

        <button
          onMouseEnter={() => h("back", true)} onMouseLeave={() => h("back", false)}
          onClick={() => navigate(-1)}
          style={{
            background: hov.back ? "rgba(255,255,255,.08)" : "transparent",
            border: `1px solid ${hov.back ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.18)"}`,
            color: hov.back ? "#fff" : "rgba(255,255,255,.7)",
            padding: "8px 18px", borderRadius: "8px",
            fontFamily: font, fontSize: "14px", cursor: "pointer", transition: "all .2s",
            display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Retour
        </button>
      </nav>

      {/* ── HERO STRIP ── */}
      <div style={{ background: T.charcoal, padding: "48px 48px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-80px", width: "400px", height: "400px",
          background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 65%)`, pointerEvents: "none" }}/>

        <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1, animation: "ap-rise .4s ease" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: T.teal, marginBottom: "12px" }}>
            Candidature
          </p>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
            {job?.title || "Postuler à l'offre"}
          </h1>
          {job && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
                background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: serif, fontSize: "16px", fontWeight: 700, color: T.teal,
              }}>{(job.company?.name || "C").charAt(0)}</div>
              <span style={{ fontSize: "15px", color: "rgba(255,255,255,.75)", fontWeight: 500 }}>{job.company?.name}</span>
              {[job.location, job.type].filter(Boolean).map(tag => (
                <span key={tag} style={{
                  fontSize: "12px", fontWeight: 500,
                  background: T.tealGlow, border: `1px solid ${T.teal}55`,
                  color: T.teal, padding: "4px 12px", borderRadius: "999px",
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FORM ── */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 48px 80px", animation: "ap-rise .5s .1s ease both" }}>

        {/* Info notice */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "12px",
          background: T.tealLight, border: `1px solid ${T.teal}33`,
          borderRadius: "12px", padding: "14px 18px", marginBottom: "32px",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="2" width="18" height="18" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{ fontSize: "13px", color: T.tealDark, lineHeight: 1.6, margin: 0 }}>
            Vos informations ont été pré-remplies depuis votre profil. Vous pouvez les modifier avant d'envoyer votre candidature.
          </p>
        </div>

        <div ref={shakeRef} style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: "20px", padding: "36px", boxShadow: "0 2px 16px rgba(51,61,66,.07)" }}>

          {/* Section: Informations personnelles */}
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>
            Informations personnelles
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <Field label="Prénom" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} placeholder="Votre prénom" />
            <Field label="Nom" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} placeholder="Votre nom" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
            <Field label="Adresse e-mail" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} placeholder="vous@exemple.com" readOnly />
            <Field label="Téléphone" name="phone" type="tel" value={form.phone} onChange={onChange} error={errors.phone} placeholder="+212 6 00 00 00 00" />
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: T.border, margin: "0 0 28px" }}/>

          {/* Section: CV */}
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>
            Curriculum Vitae
          </p>

          <div style={{ marginBottom: "28px" }}>
            <Field
              label="Lien vers votre CV"
              name="cvUrl" value={form.cvUrl} onChange={onChange} error={errors.cvUrl}
              placeholder="https://..." readOnly={!!form.cvUrl}
            />
            {form.cvUrl && (
              <a href={form.cvUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "13px", color: T.teal, textDecoration: "none", fontWeight: 500 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Voir mon CV →
              </a>
            )}
            {!form.cvUrl && (
              <p style={{ fontSize: "13px", color: T.red, marginTop: "8px" }}>
                Vous n'avez pas encore de CV dans votre profil.{" "}
                <span onClick={() => navigate("/profile")} style={{ color: T.teal, cursor: "pointer", textDecoration: "underline" }}>
                  Mettre à jour mon profil
                </span>
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: T.border, margin: "0 0 28px" }}/>

          {/* Section: Lettre de motivation */}
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>
            Lettre de motivation <span style={{ textTransform: "none", fontWeight: 400, color: T.light }}>(optionnelle)</span>
          </p>

          <div style={{ marginBottom: "32px" }}>
            <Field
              label="Votre message au recruteur"
              name="coverLetter" value={form.coverLetter} onChange={onChange}
              placeholder={`Bonjour,\n\nJe vous contacte pour exprimer mon intérêt pour ce poste…`}
              textarea
            />
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: T.redLight, border: `1px solid ${T.red}33`,
              borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" width="16" height="16" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: "14px", color: T.red }}>{serverError}</span>
            </div>
          )}

          {/* Submit */}
          <button
            onMouseEnter={() => h("submit", true)} onMouseLeave={() => h("submit", false)}
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%", border: "none",
              background: submitting ? T.muted : hov.submit ? T.tealDark : T.teal,
              color: "#fff", padding: "17px 24px", borderRadius: "12px",
              fontFamily: font, fontSize: "16px", fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "all .22s",
              transform: hov.submit && !submitting ? "translateY(-2px)" : "none",
              boxShadow: hov.submit && !submitting ? `0 8px 28px ${T.tealGlow}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            }}
          >
            {submitting ? <><Spinner /> Envoi en cours…</> : "Envoyer ma candidature →"}
          </button>

          <p style={{ textAlign: "center", fontSize: "12px", color: T.muted, marginTop: "14px" }}>
            Un email de confirmation sera envoyé à <strong>{form.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}