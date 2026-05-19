import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

// MUI Icons
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const SIDEBAR_WIDTH = 260;



const menuSections = [
  {
    title: "VUE D'ENSEMBLE",
    items: [
      {
        label: "Tableau de Bord",
        icon: <DashboardOutlinedIcon fontSize="small" />,
        children: ["Statistiques", "Activités Récentes"],
      },
      {
        label: "IA Assistant",
        icon: <SmartToyOutlinedIcon fontSize="small" />,
        badge: "BETA",
        children: ["Ai Work Assistant","Matching Candidats", "Analyse d'Offres"],
      },
    ],
  },
  {
    title: "GESTION",
    items: [
      {
        label: "Recruteurs",
        icon: <PeopleOutlinedIcon fontSize="small" />,
      },
      {
        label: "Entreprise",
        icon: <CorporateFareOutlinedIcon fontSize="small" />,
        children: ["Profile"],
      },
      {
        label: "Offres d'Emploi",
        icon: <BusinessCenterOutlinedIcon fontSize="small" />,
        badge: "12", // Example of showing count
        children: ["Toutes les offres", "En attente", "Archivées"],
      },
      {
        label: "Candidatures",
        icon: <DescriptionOutlinedIcon fontSize="small" />,
        children: ["Nouvelles", "Entretiens", "Refusées"],
      },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [
      {
        label: "Paramètres",
        icon: <SettingsOutlinedIcon fontSize="small" />,
      },
      {
        label: "Support Chat",
        icon: <ChatBubbleOutlineIcon fontSize="small" />,
      },
    ],
  },
];

function NavItem({ item, activeItem, onSelect }) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeItem === item.label;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      onSelect(item.label);
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: "8px",
          mx: 1,
          mb: 0.3,
          px: 1.5,
          py: 1,
          backgroundColor: isActive ? "#EEF2FF" : "transparent",
          color: isActive ? "#4F46E5" : "#374151",
          "&:hover": {
            backgroundColor: isActive ? "#EEF2FF" : "#F3F4F6",
          },
          transition: "background-color 0.15s ease",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 34,
            color: isActive ? "#4F46E5" : "#6B7280",
          }}
        >
          {item.icon}
        </ListItemIcon>

        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: "13.5px",
            fontWeight: isActive ? 600 : 500,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
          }}
        />

        {item.badge && (
          <Chip
            label={item.badge}
            size="small"
            sx={{
              height: 20,
              fontSize: "10px",
              fontWeight: 700,
              bgcolor: "#DCFCE7",
              color: "#16A34A",
              borderRadius: "5px",
              mr: hasChildren ? 0.5 : 0,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        )}

        {hasChildren && (
          <Box sx={{ color: "#9CA3AF", display: "flex", alignItems: "center" }}>
            {open ? <ExpandLess sx={{ fontSize: 17 }} /> : <ExpandMore sx={{ fontSize: 17 }} />}
          </Box>
        )}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map((child) => (
              <ListItemButton
                key={child}
                onClick={() => onSelect(child)}
                sx={{
                  borderRadius: "8px",
                  mx: 1,
                  mb: 0.2,
                  py: 0.7,
                  pl: 5.5,
                  backgroundColor: activeItem === child ? "#EEF2FF" : "transparent",
                  color: activeItem === child ? "#4F46E5" : "#6B7280",
                  "&:hover": {
                    backgroundColor: activeItem === child ? "#EEF2FF" : "#F3F4F6",
                  },
                  transition: "background-color 0.15s ease",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: activeItem === child ? "#4F46E5" : "#D1D5DB",
                    mr: 1.5,
                    flexShrink: 0,
                  }}
                />
                <ListItemText
                  primary={child}
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight: activeItem === child ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function Sidebar({ mobileOpen, onClose, activeItem, onSelect }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid #F0F0F0",
          backgroundColor: "#FFFFFF",
          overflowX: "hidden",
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2.5, py: 2.5, borderBottom: "1px solid #F3F4F6" }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/iwork_symb.png"
            alt="iWork Logo"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#3A3A3A",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            "& span": {
              color: "#4DCFCA", // teal accent matching your logo
            },
          }}
        >
          i<span>w</span>ork
        </Typography>
      </Box>

      {/* Nav Sections */}
      <Box sx={{ overflowY: "auto", flex: 1, py: 1.5 }}>
        {menuSections.map((section, si) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            <Typography
              sx={{
                px: 2.5,
                py: 1,
                fontSize: "11px",
                fontWeight: 600,
                color: "#9CA3AF",
                letterSpacing: "0.08em",
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "uppercase",
              }}
            >
              {section.title}
            </Typography>

            <List disablePadding>
              {section.items.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  activeItem={activeItem}
                  onSelect={onSelect}
                />
              ))}
            </List>

            {si < menuSections.length - 1 && <Divider sx={{ mt: 1, borderColor: "#F3F4F6" }} />}
          </Box>
        ))}
      </Box>

      {/* Footer User Info */}
      <Box sx={{ borderTop: "1px solid #F3F4F6", px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #818CF8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          T
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#111827" }} noWrap>
            Thomas Admin
          </Typography>
          <Typography sx={{ fontSize: "11.5px", color: "#9CA3AF" }} noWrap>
            admin@tailadmin.com
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}