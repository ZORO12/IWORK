import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Collapse,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Badge,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Search,
  Work,
  Person,
  Email,
  BusinessCenter,
  CalendarToday,
  PeopleAlt,
  FilterList,
} from "@mui/icons-material";
import api from "../../services/api";

// ── Utility ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ✅ Helper — builds full name from firstName + lastName
function fullName(author) {
  return `${author?.firstName || ""} ${author?.lastName || ""}`.trim() || "Inconnu";
}

const AVATAR_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6",
];
function avatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ── OfferCard ─────────────────────────────────────────────────────────────────
function OfferCard({ offer }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: "14px 16px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        border: "1px solid #F3F4F6",
        transition: "box-shadow 0.18s, border-color 0.18s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(99,102,241,0.10)",
          borderColor: "#C7D2FE",
        },
      }}
    >
      <Avatar
        src={offer.company?.logo}
        variant="rounded"
        sx={{
          width: 42, height: 42,
          bgcolor: "#EEF2FF", color: "#6366f1",
          fontWeight: 700, fontSize: 14, flexShrink: 0,
          border: "1px solid #E0E7FF",
        }}
      >
        {getInitials(offer.company?.name || "?")}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
            color: "#111827", whiteSpace: "nowrap", overflow: "hidden",
            textOverflow: "ellipsis", maxWidth: 260,
          }}>
            {offer.title}
          </Typography>
          {offer.category?.name && (
            <Chip label={offer.category.name} size="small" sx={{
              fontSize: "11px", height: 20, backgroundColor: "#EEF2FF",
              color: "#4F46E5", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, border: "none",
            }} />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <BusinessCenter sx={{ fontSize: 12, color: "#9CA3AF" }} />
            <Typography sx={{ fontSize: "12px", color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
              {offer.company?.name || "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 12, color: "#9CA3AF" }} />
            <Typography sx={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
              {timeAgo(offer.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PeopleAlt sx={{ fontSize: 12, color: "#9CA3AF" }} />
            <Typography sx={{ fontSize: "12px", color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
              {offer._count?.applications ?? 0} candidature{offer._count?.applications !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{
        width: 8, height: 8, borderRadius: "50%",
        backgroundColor: "#10B981", flexShrink: 0, mt: "6px",
        boxShadow: "0 0 0 3px #D1FAE5",
      }} />
    </Box>
  );
}

// ── AuthorBlock ───────────────────────────────────────────────────────────────
function AuthorBlock({ group, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const { author, offers } = group;

  return (
    <Box sx={{
      borderRadius: "14px", border: "1px solid #E5E7EB",
      overflow: "hidden", backgroundColor: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <Box
        onClick={() => setOpen((p) => !p)}
        sx={{
          display: "flex", alignItems: "center", gap: 2,
          p: "14px 20px", cursor: "pointer",
          backgroundColor: open ? "#F5F3FF" : "#fff",
          borderBottom: open ? "1px solid #EDE9FE" : "none",
          transition: "background-color 0.15s",
          "&:hover": { backgroundColor: "#F5F3FF" },
        }}
      >
        {/* ✅ Bug 2 fixed — {getInitials(...)} not plain text */}
        <Avatar sx={{
          width: 40, height: 40, bgcolor: avatarColor(author.id),
          fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
        }}>
          {getInitials(fullName(author))}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person sx={{ fontSize: 14, color: "#6B7280" }} />
            {/* ✅ Bug 3 fixed — fullName() instead of author.name */}
            <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              {fullName(author)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Email sx={{ fontSize: 12, color: "#9CA3AF" }} />
            <Typography sx={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
              {author.email}
            </Typography>
          </Box>
        </Box>

        <Badge badgeContent={offers.length} sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "#6366F1", color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11,
          },
        }}>
          <Work sx={{ fontSize: 20, color: "#9CA3AF" }} />
        </Badge>

        {open
          ? <ExpandLess sx={{ color: "#6366F1", fontSize: 20 }} />
          : <ExpandMore sx={{ color: "#9CA3AF", fontSize: 20 }} />
        }
      </Box>

      <Collapse in={open} timeout="auto">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: "16px" }}>
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OffersList({ companyId }) {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (!companyId) {
      setError("Company ID manquant.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    api.get(`/api/jobs/job/grouped-by-author/${companyId}`)
      .then((res) => { setGrouped(res.data); setLoading(false); })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || "Failed to fetch offers");
        setLoading(false);
      });
  }, [companyId]);

  const allCategories = useMemo(() => {
    const cats = new Set();
    Object.values(grouped).forEach((g) =>
      g.offers.forEach((o) => { if (o.category?.name) cats.add(o.category.name); })
    );
    return Array.from(cats).sort();
  }, [grouped]);

  // ✅ Bug 1 fixed — search uses fullName() not author.name
  const filteredEntries = useMemo(() => {
    return Object.entries(grouped)
      .map(([authorId, group]) => {
        const q = search.toLowerCase();
        const filteredOffers = group.offers.filter((o) => {
          const matchesSearch =
            !q ||
            o.title?.toLowerCase().includes(q) ||
            fullName(group.author).toLowerCase().includes(q);
          const matchesCategory =
            categoryFilter === "all" || o.category?.name === categoryFilter;
          return matchesSearch && matchesCategory;
        });
        return [authorId, { ...group, offers: filteredOffers }];
      })
      .filter(([, group]) => group.offers.length > 0);
  }, [grouped, search, categoryFilter]);

  const totalOffers = Object.values(grouped).reduce((sum, g) => sum + g.offers.length, 0);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
      <CircularProgress sx={{ color: "#6366F1" }} />
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</Alert>
  );

  return (
    <Box sx={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: "22px", fontWeight: 700, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
            Offres d'emploi
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
            {totalOffers} offre{totalOffers !== 1 ? "s" : ""} active{totalOffers !== 1 ? "s" : ""} —{" "}
            {Object.keys(grouped).length} recruteur{Object.keys(grouped).length !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Search + Filter */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            placeholder="Rechercher recruteur ou offre…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "10px", fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", backgroundColor: "#F9FAFB",
                "& fieldset": { borderColor: "#E5E7EB" },
                "&:hover fieldset": { borderColor: "#C7D2FE !important" },
                "&.Mui-focused fieldset": { borderColor: "#6366F1 !important" },
              },
            }}
            sx={{ width: 240 }}
          />

          {/* ✅ Category filter */}
          <FormControl size="small">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              displayEmpty
              startAdornment={<FilterList sx={{ fontSize: 16, color: "#9CA3AF", mr: 0.5 }} />}
              sx={{
                borderRadius: "10px", fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", backgroundColor: "#F9FAFB", minWidth: 170,
                "& fieldset": { borderColor: "#E5E7EB" },
                "&:hover fieldset": { borderColor: "#C7D2FE !important" },
                "&.Mui-focused fieldset": { borderColor: "#6366F1 !important" },
              }}
            >
              <MenuItem value="all" sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                Toutes catégories
              </MenuItem>
              {allCategories.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Groups */}
      {filteredEntries.length === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 1 }}>
          <Work sx={{ fontSize: 40, color: "#E5E7EB" }} />
          <Typography sx={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
            Aucune offre trouvée
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredEntries.map(([authorId, group], index) => (
            <AuthorBlock key={authorId} group={group} defaultOpen={index === 0} />
          ))}
        </Box>
      )}
    </Box>
  );
}