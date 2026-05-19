import { useState } from "react";
import { Box, Typography, Avatar, Button, TextField, Divider, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

const FONT = "'Outfit', sans-serif";
const INDIGO = "#6366F1";
const DARK = "#111827";
const G400 = "#6B7280";
const G100 = "#F3F4F6";

// Read from JWT
function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const p = JSON.parse(atob(token.split(".")[1]));
      return { name: p.name || p.username || "Admin", email: p.email || "admin@iwork.com", role: p.role || "Administrateur" };
    }
  } catch (_) {}
  return { name: "Admin", email: "admin@iwork.com", role: "Administrateur" };
}

function SectionCard({ title, children }) {
  return (
    <Box sx={{ background: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${G100}` }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: DARK, fontFamily: FONT }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: G400, fontFamily: FONT }}>{label}</Typography>
      <TextField
        size="small"
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": { fontFamily: FONT, fontSize: 14, borderRadius: "8px",
            "&.Mui-disabled": { background: G100 },
            "&:hover fieldset": { borderColor: "#A5B4FC" },
            "&.Mui-focused fieldset": { borderColor: INDIGO },
          },
        }}
      />
    </Box>
  );
}

export default function MonProfil() {
  const user = getUserFromToken();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: "", poste: user.role, bio: "" });
  const [saved, setSaved] = useState(false);

  const f = (key) => ({ value: form[key], onChange: e => { setForm(p => ({ ...p, [key]: e.target.value })); setSaved(false); } });

  const handleSave = () => {
    // PUT /api/profile with form data
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Box sx={{ maxWidth: 780, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');`}</style>

      {/* Header card */}
      <Box sx={{ background: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <Box sx={{ height: 90, background: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)" }} />
        <Box sx={{ px: 3, pb: 3, display: "flex", alignItems: "flex-end", gap: 2, mt: "-36px" }}>
          <Box sx={{ position: "relative" }}>
            <Avatar sx={{ width: 72, height: 72, border: "3px solid #fff", fontSize: 24, fontWeight: 700, bgcolor: "#4F46E5", fontFamily: FONT, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
              {initials}
            </Avatar>
            <Tooltip title="Changer la photo">
              <IconButton size="small" sx={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, bgcolor: INDIGO, color: "#fff", border: "2px solid #fff", "&:hover": { bgcolor: "#4F46E5" } }}>
                <CameraAltOutlinedIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: DARK, fontFamily: FONT }}>{form.name}</Typography>
            <Typography sx={{ fontSize: 13, color: G400, fontFamily: FONT }}>{form.poste} · {form.email}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Info personnelle */}
      <SectionCard title="Informations personnelles">
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
          <Field label="Nom complet" {...f("name")} />
          <Field label="Email" {...f("email")} type="email" />
          <Field label="Téléphone" {...f("phone")} />
          <Field label="Poste" {...f("poste")} />
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: G400, fontFamily: FONT, mb: 0.5 }}>Bio</Typography>
          <TextField
            multiline rows={3} fullWidth size="small"
            placeholder="Décrivez-vous en quelques mots..."
            value={form.bio}
            onChange={e => { setForm(p => ({ ...p, bio: e.target.value })); setSaved(false); }}
            sx={{ "& .MuiOutlinedInput-root": { fontFamily: FONT, fontSize: 14, borderRadius: "8px", "&:hover fieldset": { borderColor: "#A5B4FC" }, "&.Mui-focused fieldset": { borderColor: INDIGO } } }}
          />
        </Box>
      </SectionCard>

      {/* Save */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
        {saved && <Typography sx={{ fontSize: 13, color: "#10B981", fontFamily: FONT, alignSelf: "center" }}>✓ Modifications enregistrées</Typography>}
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          sx={{ background: INDIGO, borderRadius: "8px", fontFamily: FONT, fontSize: 13, fontWeight: 600, textTransform: "none", px: 2.5, boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}
        >
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
}