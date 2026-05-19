import { useState } from "react";
import { Box, Typography, Switch, Button, Divider, TextField } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

const FONT = "'Outfit', sans-serif";
const INDIGO = "#6366F1";
const DARK = "#111827";
const G400 = "#6B7280";
const G100 = "#F3F4F6";

function SectionCard({ icon, title, children }) {
  return (
    <Box sx={{ background: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${G100}`, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ color: INDIGO }}>{icon}</Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: DARK, fontFamily: FONT }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, borderBottom: `1px solid ${G100}`, "&:last-child": { borderBottom: "none", pb: 0 } }}>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: DARK, fontFamily: FONT }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: 12, color: G400, fontFamily: FONT }}>{sub}</Typography>}
      </Box>
      <Switch
        checked={checked}
        onChange={onChange}
        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: INDIGO }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: INDIGO } }}
      />
    </Box>
  );
}

function Field({ label, ...props }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: G400, fontFamily: FONT }}>{label}</Typography>
      <TextField size="small" fullWidth {...props}
        sx={{ "& .MuiOutlinedInput-root": { fontFamily: FONT, fontSize: 14, borderRadius: "8px", "&:hover fieldset": { borderColor: "#A5B4FC" }, "&.Mui-focused fieldset": { borderColor: INDIGO } } }}
      />
    </Box>
  );
}

export default function Parametres() {
  const [notifs, setNotifs] = useState({ email: true, push: false, recrutement: true, rapports: false });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState(null);
  const [lang, setLang] = useState("fr");

  const toggle = key => setNotifs(p => ({ ...p, [key]: !p[key] }));

  const handlePwd = () => {
    if (!pwd.current || !pwd.next || !pwd.confirm) { setPwdMsg({ type: "error", text: "Veuillez remplir tous les champs." }); return; }
    if (pwd.next !== pwd.confirm) { setPwdMsg({ type: "error", text: "Les mots de passe ne correspondent pas." }); return; }
    if (pwd.next.length < 8) { setPwdMsg({ type: "error", text: "Le mot de passe doit contenir au moins 8 caractères." }); return; }
    // PUT /api/auth/password
    setPwdMsg({ type: "success", text: "Mot de passe mis à jour avec succès." });
    setPwd({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwdMsg(null), 4000);
  };

  return (
    <Box sx={{ maxWidth: 780, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');`}</style>

      <Box>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: DARK, fontFamily: FONT }}>Paramètres</Typography>
        <Typography sx={{ fontSize: 13, color: G400, fontFamily: FONT }}>Gérez vos préférences et la sécurité de votre compte.</Typography>
      </Box>

      {/* Notifications */}
      <SectionCard icon={<NotificationsOutlinedIcon fontSize="small" />} title="Notifications">
        <ToggleRow label="Notifications par email" sub="Recevoir les alertes par email" checked={notifs.email} onChange={() => toggle("email")} />
        <ToggleRow label="Notifications push" sub="Recevoir les alertes dans le navigateur" checked={notifs.push} onChange={() => toggle("push")} />
        <ToggleRow label="Activité de recrutement" sub="Nouvelles candidatures, matches" checked={notifs.recrutement} onChange={() => toggle("recrutement")} />
        <ToggleRow label="Rapports hebdomadaires" sub="Résumé des performances chaque lundi" checked={notifs.rapports} onChange={() => toggle("rapports")} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} sx={{ background: INDIGO, borderRadius: "8px", fontFamily: FONT, fontSize: 13, fontWeight: 600, textTransform: "none", boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}>
            Enregistrer
          </Button>
        </Box>
      </SectionCard>

      {/* Mot de passe */}
      <SectionCard icon={<LockOutlinedIcon fontSize="small" />} title="Sécurité — Changer le mot de passe">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Field label="Mot de passe actuel" type="password" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Field label="Nouveau mot de passe" type="password" value={pwd.next} onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} />
            <Field label="Confirmer le mot de passe" type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
          </Box>
          {pwdMsg && (
            <Typography sx={{ fontSize: 13, fontFamily: FONT, color: pwdMsg.type === "error" ? "#EF4444" : "#10B981" }}>
              {pwdMsg.type === "error" ? "✕" : "✓"} {pwdMsg.text}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handlePwd} variant="contained" startIcon={<LockOutlinedIcon />} sx={{ background: INDIGO, borderRadius: "8px", fontFamily: FONT, fontSize: 13, fontWeight: 600, textTransform: "none", boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}>
              Mettre à jour
            </Button>
          </Box>
        </Box>
      </SectionCard>

      {/* Langue */}
      <SectionCard icon={<LanguageOutlinedIcon fontSize="small" />} title="Langue et région">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: DARK, fontFamily: FONT }}>Langue de l'interface</Typography>
            <Typography sx={{ fontSize: 12, color: G400, fontFamily: FONT }}>Choisissez la langue d'affichage du tableau de bord</Typography>
          </Box>
          <Box component="select" value={lang} onChange={e => setLang(e.target.value)}
            sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", px: 1.5, py: 1, fontSize: 13, fontFamily: FONT, color: DARK, outline: "none", cursor: "pointer", bgcolor: "#FAFAFA" }}>
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="ar">🇲🇦 العربية</option>
          </Box>
        </Box>
      </SectionCard>

      {/* Danger zone */}
      <Box sx={{ background: "#FEF2F2", borderRadius: "12px", border: "1px solid #FECACA", p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#991B1B", fontFamily: FONT }}>Zone de danger</Typography>
          <Typography sx={{ fontSize: 12, color: "#B91C1C", fontFamily: FONT }}>La suppression du compte est irréversible.</Typography>
        </Box>
        <Button variant="outlined" sx={{ borderColor: "#EF4444", color: "#EF4444", borderRadius: "8px", fontFamily: FONT, fontSize: 13, fontWeight: 600, textTransform: "none", "&:hover": { background: "#FEE2E2", borderColor: "#DC2626" } }}>
          Supprimer le compte
        </Button>
      </Box>
    </Box>
  );
}