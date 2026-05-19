import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../components/adminComponents/Sidebar";
import TopBar from "../components/adminComponents/Topbar";
import Dashboard from "../components/adminComponents/Dashboard";
import ChatAssistant from "../components/adminComponents/ChatAssistant";
import RecrutersTable from "../components/adminComponents/Recruterstable";
import CompanyProfile from "../components/adminComponents/CompanyProfile";
import OffersList from "../components/adminComponents/OffersList";

// ── Import your real page components here ─────────────────────────────────────
// import DashboardPage from "./pages/DashboardPage";
// import CalendarPage from "./pages/CalendarPage";

const SIDEBAR_WIDTH = 260;

// ── Temporary placeholder — replace with your real page components ────────────
function PlaceholderPage({ title }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#111827",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>
        This is the {title} page. Replace this with your real component.
      </Typography>
    </Box>
  );
}


// ── Get companyId from localStorage (set this during login) ──
  const companyId = localStorage.getItem("companyId");

// ── Page map: connect each sidebar label to a component ───────────────────────
// Replace <PlaceholderPage /> with your real imported components, e.g:
// Dashboard: <DashboardPage />,
const pageMap = {
  // Dashboard
  // Dashboard:           <PlaceholderPage title="Dashboard" />,
  Dashboard:           <Dashboard />,
  Statistiques:        <Dashboard />,
  Analytics:           <PlaceholderPage title="Analytics" />,
  Overview:            <PlaceholderPage title="Overview" />,
  Reports:             <PlaceholderPage title="Reports" />,
  // AI Assistant
  "AI Assistant":      <PlaceholderPage title="AI Assistant" />,
  AiWorkAssistant:     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100%" }}><ChatAssistant /></div>,
  Chat:                <ChatAssistant />,
  Touteslesoffres:     <OffersList companyId={companyId} />,
  //Recruteurs: 
  "Recruteurs":         <PlaceholderPage title="Recruteurs" />,
  Recruteurs:           <RecrutersTable />,
  "Company Profile":    <PlaceholderPage title="Company Profile" />,
  Profile:              <CompanyProfile />,
  // Chat:                <PlaceholderPage title="Chat" />,
  Prompts:             <PlaceholderPage title="Prompts" />,
  History:             <PlaceholderPage title="History" />,
  "User Profile":      <PlaceholderPage title="User Profile" />,
  // Pages
  Pages:               <PlaceholderPage title="Pages" />,
  "404":               <PlaceholderPage title="404" />,
  "500":               <PlaceholderPage title="500" />,
  Maintenance:         <PlaceholderPage title="Maintenance" />,
  "Coming Soon":       <PlaceholderPage title="Coming Soon" />,
  // Layouts
  Layouts:             <PlaceholderPage title="Layouts" />,
  "Sidebar Left":      <PlaceholderPage title="Sidebar Left" />,
  "Sidebar Right":     <PlaceholderPage title="Sidebar Right" />,
  "Full Width":        <PlaceholderPage title="Full Width" />,
};

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleMenuToggle = () => setMobileOpen((prev) => !prev);

  const currentPage = pageMap[activeItem.replace(/\s+/g, "")] || <PlaceholderPage title={activeItem} />;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F9FAFB" }}>

      {/* ── Sidebar ── */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeItem={activeItem}
        onSelect={setActiveItem}
      />

      {/* ── Main Area ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          // ml: { sm: `${SIDEBAR_WIDTH}px` },
        }}
      >
        {/* ── TopBar ── */}
        <TopBar onMenuToggle={handleMenuToggle} />

        {/* ── Dynamic Page Content ── */}
        <Box component="main" sx={{ flexGrow: 1, mt: "64px", p: 3 }}>
          {currentPage}
        </Box>
      </Box>

    </Box>
  );
}