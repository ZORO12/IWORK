import React, { useState } from "react";
import {
  AppBar, Toolbar, Box, Typography, InputBase, IconButton,
  Avatar, Badge, Tooltip, Menu, MenuItem, Divider, Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const SIDEBAR_WIDTH = 260;

export default function TopBar({ onMenuToggle, onNavigate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);

  const handleUserMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleNavigate = (page) => {
    handleUserMenuClose();
    onNavigate?.(page);
  };

  const handleSignOut = () => {
    handleUserMenuClose();
    localStorage.clear();
    window.location.href = "/";
  };

  // Read user info from JWT
  function getUserFromToken() {
    try {
      const token = localStorage.getItem("token")
                 || localStorage.getItem("access_token")
                 || localStorage.getItem("jwt");
      if (!token) return { userName: "Admin", userEmail: "admin@iwork.com" };

      const payload = JSON.parse(atob(token.split(".")[1]));

      // Support common backend naming conventions
      const userName =
        payload.name           ||   // full name
        payload.fullName       ||
        payload.full_name      ||
        payload.username       ||   // username
        payload.user_name      ||
        payload.prenom + (payload.nom ? " " + payload.nom : "") ||  // French fields
        payload.firstName + (payload.lastName ? " " + payload.lastName : "") ||
        payload.sub            ||   // JWT standard subject
        "Admin";

      const userEmail =
        payload.email          ||
        payload.mail           ||
        payload.emailAddress   ||
        payload.email_address  ||
        "—";

      return { userName: userName.trim(), userEmail };
    } catch (_) {
      return { userName: "Admin", userEmail: "admin@iwork.com" };
    }
  }

  const { userName, userEmail } = getUserFromToken();

  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { sm: `${SIDEBAR_WIDTH}px` },
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #F3F4F6",
        color: "#111827",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, sm: 3 }, display: "flex", alignItems: "center", gap: 2 }}>

        {/* Left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: "9px", background: "linear-gradient(135deg, #6366F1, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }}>
              <BarChartOutlinedIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "16px", color: "#111827", letterSpacing: "-0.02em" }}>IWORK</Typography>
          </Box>
          <IconButton onClick={onMenuToggle} size="small" sx={{ border: "1px solid #E5E7EB", borderRadius: "8px", width: 36, height: 36, color: "#6B7280", "&:hover": { backgroundColor: "#F3F4F6" } }}>
            <MenuIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Search */}
        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #E5E7EB", borderRadius: "10px", px: 1.5, py: 0.6, gap: 1, backgroundColor: "#FAFAFA", width: { xs: "100%", sm: 300 }, maxWidth: 340, transition: "border-color 0.2s, box-shadow 0.2s", "&:focus-within": { borderColor: "#A5B4FC", boxShadow: "0 0 0 3px rgba(99,102,241,0.1)", backgroundColor: "#fff" } }}>
          <SearchIcon sx={{ color: "#9CA3AF", fontSize: 18, flexShrink: 0 }} />
          <InputBase placeholder="Rechercher ou taper une commande..." sx={{ flex: 1, fontSize: "13.5px", fontFamily: "'Outfit', sans-serif", color: "#374151", "& input::placeholder": { color: "#9CA3AF" } }} />
          <Chip label="⌘K" size="small" sx={{ height: 20, fontSize: "11px", fontWeight: 600, bgcolor: "#F3F4F6", color: "#6B7280", borderRadius: "5px", border: "1px solid #E5E7EB", fontFamily: "monospace", "& .MuiChip-label": { px: 0.8 } }} />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Mode sombre" arrow>
            <IconButton size="small" sx={{ width: 38, height: 38, borderRadius: "50%", color: "#6B7280", "&:hover": { backgroundColor: "#F3F4F6" } }}>
              <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Notifications" arrow>
            <IconButton size="small" sx={{ width: 38, height: 38, borderRadius: "50%", color: "#6B7280", "&:hover": { backgroundColor: "#F3F4F6" } }}>
              <Badge overlap="circular" variant="dot" sx={{ "& .MuiBadge-dot": { backgroundColor: "#F97316", width: 8, height: 8, border: "1.5px solid #fff", borderRadius: "50%", top: 2, right: 2 } }}>
                <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip> */}

          <Box sx={{ width: "1px", height: 28, bgcolor: "#E5E7EB", mx: 0.5 }} />

          <Box onClick={handleUserMenuOpen} sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", borderRadius: "10px", px: 1, py: 0.5, "&:hover": { backgroundColor: "#F3F4F6" }, transition: "background-color 0.15s" }}>
            <Avatar sx={{ width: 34, height: 34, border: "2px solid #E5E7EB", fontSize: "13px", fontWeight: 700, bgcolor: "#6366F1", fontFamily: "'Outfit', sans-serif" }}>
              {initials}
            </Avatar>
            <Typography sx={{ fontSize: "13.5px", fontWeight: 600, color: "#111827", fontFamily: "'Outfit', sans-serif", display: { xs: "none", md: "block" } }}>
              {userName}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 17, color: "#9CA3AF", display: { xs: "none", md: "block" }, transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </Box>
        </Box>
      </Toolbar>

      {/* Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1, minWidth: 210, borderRadius: "12px", border: "1px solid #F3F4F6",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            "& .MuiMenuItem-root": { fontSize: "13.5px", fontFamily: "'Outfit', sans-serif", color: "#374151", borderRadius: "8px", mx: 0.5, px: 1.5, py: 1, gap: 1.5, "&:hover": { backgroundColor: "#F3F4F6" } },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#111827", fontFamily: "'Outfit', sans-serif" }}>{userName}</Typography>
          <Typography sx={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'Outfit', sans-serif" }}>{userEmail}</Typography>
        </Box>

        <Divider sx={{ borderColor: "#F3F4F6", my: 0.5 }} />

        <MenuItem onClick={() => handleNavigate("MonProfil")}>
          <PersonOutlineIcon sx={{ fontSize: 17, color: "#6B7280" }} />
          Mon Profil
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("Parametres")}>
          <SettingsOutlinedIcon sx={{ fontSize: 17, color: "#6B7280" }} />
          Paramètres
        </MenuItem>

        <Divider sx={{ borderColor: "#F3F4F6", my: 0.5 }} />

        <MenuItem onClick={handleSignOut} sx={{ color: "#EF4444 !important" }}>
          <LogoutOutlinedIcon sx={{ fontSize: 17, color: "#EF4444" }} />
          Se déconnecter
        </MenuItem>
      </Menu>
    </AppBar>
  );
}