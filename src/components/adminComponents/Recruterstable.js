import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Box, Typography, TextField, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, Avatar,MenuItem
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const FONT = "'Outfit', sans-serif";
const DARK = "#111827";
const G400 = "#6B7280";
const G100 = "#F3F4F6";
const INDIGO = "#6366F1";
const INDIGO_LIGHT = "#EEF2FF";

const EMPTY_FORM = { firstName: "", lastName: "", email: "", password: "", assignedCategoryId: "" };

function StatusChip({ status }) {
  const active = status === "Actif" || status === true; // Handle potential boolean or string
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      px: 1.5, py: 0.4,
      bgcolor: active ? "#ECFDF5" : "#FEF2F2",
      color: active ? "#10B981" : "#EF4444",
      borderRadius: "6px", fontSize: 12, fontWeight: 700, fontFamily: FONT,
      width: "fit-content",
    }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: active ? "#10B981" : "#EF4444" }} />
      {active ? "Actif" : "Inactif"}
    </Box>
  );
}

function initials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

const AVATAR_COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

export default function RecrutersTable() {
  const [recruters, setRecruters] = useState([]); // Array of HR members
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});


  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/allCategories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  fetchCategories();
}, []);


  const fetchHr = async () => {
    try {
      const res = await api.get("/api/users/my-hr", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Use the 'hrMembers' key from your backend response
      setRecruters(res.data.hrMembers || []);
    } catch (err) {
      console.error("Error fetching HR:", err);
    }
  };

  useEffect(() => {
    fetchHr();
  }, []);

  const filtered = recruters.filter(r =>
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setErrors({}); setDialog({ mode: "add" }); };
  
  const openEdit = (row) => { 
    setForm({ 
        firstName: row.firstName, 
        lastName: row.lastName, 
        email: row.email, 
        assignedCategoryId: row.assignedCategoryId,
        password: "" // Don't load existing password for security
    }); 
    setErrors({}); 
    setDialog({ mode: "edit", id: row.id }); 
  };

  const handleSave = async () => {
    try {
      if (dialog.mode === "add") {
        await api.post("/api/users/create-hr", form, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await api.put(`/api/users/update-hr/${dialog.id}`, form, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      setDialog(null);
      fetchHr(); // Refresh list
    } catch (err) {
      setErrors({ api: err.response?.data?.error || "Une erreur est survenue" });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/users/delete-hr/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDeleteTarget(null);
      fetchHr();
    } catch (err) {
      console.error(err);
    }
  };

  const field = (key, label, type = "text") => (
    <TextField
      key={key}
      label={label}
      type={type}
      size="small"
      fullWidth
      value={form[key]}
      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
      error={!!errors[key]}
      helperText={errors[key]}
      sx={{ "& .MuiOutlinedInput-root": { fontFamily: FONT, fontSize: 14 }, "& label": { fontFamily: FONT, fontSize: 14 } }}
    />
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');`}</style>

      <Box sx={{ background: "#fff", borderRadius: "12px", border: `1px solid #E5E7EB`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2, borderBottom: `1px solid ${G100}` }}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: DARK, fontFamily: FONT }}>Recruteurs</Typography>
            <Typography sx={{ fontSize: 12, color: G400, fontFamily: FONT }}>{recruters.length} recruteurs au total</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: G400 }} /></InputAdornment>,
                sx: { fontFamily: FONT, fontSize: 13, borderRadius: "8px" }
              }}
              sx={{ width: 200 }}
            />
            <Button
              onClick={openAdd}
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ background: INDIGO, borderRadius: "8px", fontFamily: FONT, fontSize: 13, fontWeight: 600, textTransform: "none", px: 2, boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}
            >
              Ajouter
            </Button>
          </Box>
        </Box>

        {/* Column headers */}
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 100px", px: 3, py: 1.5, borderBottom: `1px solid ${G100}`, bgcolor: "#FAFAFA" }}>
          {["Recruteur", "Email", "Département", "Statut", "Actions"].map(h => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 700, color: G400, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</Typography>
          ))}
        </Box>

        {/* Rows */}
        {filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ color: G400, fontFamily: FONT, fontSize: 14 }}>Aucun recruteur trouvé</Typography>
          </Box>
        ) : filtered.map((row, i) => (
          <Box key={row.id} sx={{
            display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 100px",
            alignItems: "center", px: 3, py: 1.5,
            borderBottom: i < filtered.length - 1 ? `1px solid ${G100}` : "none",
            "&:hover": { bgcolor: "#FAFAFA" }, transition: "background 0.15s",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length], fontFamily: FONT }}>
                {initials(row.firstName, row.lastName)}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: FONT }}>{row.firstName} {row.lastName}</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 13, color: G400, fontFamily: FONT }}>{row.email}</Typography>
            <Typography sx={{ fontSize: 13, color: DARK, fontWeight: 500, fontFamily: FONT }}>
                {row.assignedCategory?.name || "N/A"}
            </Typography>
            <StatusChip status="Actif" />
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: INDIGO, "&:hover": { bgcolor: INDIGO_LIGHT } }}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => setDeleteTarget(row)} sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Add / Edit Dialog */}
      <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "12px", fontFamily: FONT } }}>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {dialog?.mode === "add" ? "Ajouter un recruteur" : "Modifier le recruteur"}
          <IconButton size="small" onClick={() => setDialog(null)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>
          {field("firstName", "Prénom")}
          {field("lastName", "Nom")}
          {field("email", "Email")}
          {field("password", "Mot de passe", "password")}
          <TextField
            select
            label="Département"
            size="small"
            fullWidth
            value={form.assignedCategoryId}
            onChange={(e) => setForm({ ...form, assignedCategoryId: e.target.value })}
            SelectProps={{ native: false }}
            sx={{
              "& .MuiOutlinedInput-root": { fontFamily: FONT, fontSize: 14 },
              "& label": { fontFamily: FONT, fontSize: 14 }
            }}
          >
            <MenuItem value="" sx={{ fontFamily: FONT, fontSize: 14 }}>
              <em>Aucun</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id} sx={{ fontFamily: FONT, fontSize: 14 }}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          {errors.api && <Typography color="error" variant="caption">{errors.api}</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDialog(null)} sx={{ fontFamily: FONT, textTransform: "none", color: G400, borderRadius: "8px" }}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" sx={{ fontFamily: FONT, textTransform: "none", background: INDIGO, borderRadius: "8px", fontWeight: 600, boxShadow: "none", "&:hover": { background: "#4F46E5", boxShadow: "none" } }}>
            {dialog?.mode === "add" ? "Ajouter" : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "12px" } }}>
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: DARK }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: FONT, fontSize: 14, color: G400 }}>
            Voulez-vous vraiment supprimer <strong style={{ color: DARK }}>{deleteTarget?.firstName} {deleteTarget?.lastName}</strong> ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ fontFamily: FONT, textTransform: "none", color: G400, borderRadius: "8px" }}>Annuler</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ fontFamily: FONT, textTransform: "none", background: "#EF4444", borderRadius: "8px", fontWeight: 600, boxShadow: "none", "&:hover": { background: "#DC2626", boxShadow: "none" } }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}