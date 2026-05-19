import React, { useState, useEffect } from "react";
import { Box, Typography, Card, MenuItem, Select, CircularProgress } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import api from "../../services/api";

// ─────────────────────────────────────────────────────────────────────────────
//  STATIC CHART DATA (not yet from backend)
// ─────────────────────────────────────────────────────────────────────────────
const MONTHLY = [
  { x: "Jan", v: 120 }, { x: "Feb", v: 360 }, { x: "Mar", v: 195 },
  { x: "Apr", v: 150 }, { x: "May", v: 140 }, { x: "Jun", v: 110 },
  { x: "Jul", v: 80  }, { x: "Aug", v: 155 }, { x: "Sep", v: 130 },
  { x: "Oct", v: 370 }, { x: "Nov", v: 255 }, { x: "Dec", v: 90  },
];
const YEARLY = [
  { x: "2020", v: 800  }, { x: "2021", v: 1200 }, { x: "2022", v: 1800 },
  { x: "2023", v: 2400 }, { x: "2024", v: 3200 }, { x: "2025", v: 3782 },
];
const HR_TABLE = [
  { name: "Alice M.",  offers: 24, cands: 630, hired: 14 },
  { name: "Karim B.",  offers: 20, cands: 520, hired: 11 },
  { name: "Sofia R.",  offers: 18, cands: 480, hired: 9  },
  { name: "Tom V.",    offers: 15, cands: 390, hired: 8  },
  { name: "Nadia C.",  offers: 12, cands: 320, hired: 6  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  STATUS → COLOR MAP
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  pending:  "#4361EE",
  accepted: "#06D6A0",
  rejected: "#FFB703",
};

// ─────────────────────────────────────────────────────────────────────────────
//  STYLE TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const BLUE  = "#4361EE";
const GREEN = "#06D6A0";
const AMBER = "#FFB703";
const WHITE = "#FFFFFF";
const G100  = "#F3F4F6";
const G200  = "#E5E7EB";
const G400  = "#9CA3AF";
const DARK  = "#111827";
const FONT  = "'DM Sans', sans-serif";

const cardStyle = {
  background: WHITE,
  borderRadius: "16px",
  border: `1px solid ${G100}`,
  boxShadow: "0 1px 3px rgba(0,0,0,.05)",
};

const TT   = { borderRadius: 10, border: `1px solid ${G200}`, fontFamily: FONT, fontSize: 13 };
const TICK = { fontFamily: FONT, fontSize: 12, fill: G400 };

// ─────────────────────────────────────────────────────────────────────────────
//  COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, change }) {
  return (
    <Card elevation={0} sx={{ ...cardStyle, p: "20px 20px 22px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <Box sx={{ width: 42, height: 42, borderRadius: "11px", background: G100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: 13, color: G400, fontFamily: FONT, mt: "2px" }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: DARK, fontFamily: FONT, lineHeight: 1 }}>
          {value}
        </Typography>
        {change && (
          <Box sx={{
            px: "8px", py: "3px", borderRadius: "6px",
            background: change.positive ? "#ECFDF5" : "#FEF2F2",
          }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: FONT, color: change.positive ? "#10B981" : "#EF4444" }}>
              {change.positive ? "↑" : "↓"} {change.value}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}

function Gauge({ pct }) {
  const W = 220, H = 140;
  const cx = 110, cy = 115, r = 80;
  const S = 220;
  const E = 320;
  const ARC = E - S;

  const pt = (deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  const arcPath = (from, to) => {
    const [sx, sy] = pt(from);
    const [ex, ey] = pt(to);
    return `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
  };

  const fillEnd = S + (pct / 100) * ARC;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      <path d={arcPath(S, E)} fill="none" stroke={G200} strokeWidth="14" strokeLinecap="round" />
      <path d={arcPath(S, fillEnd)} fill="none" stroke={BLUE} strokeWidth="14" strokeLinecap="round" />
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: DARK, fontFamily: FONT }}>
        {pct}%
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: 12, fontWeight: 600, fill: "#10B981", fontFamily: FONT }}>
        +10%
      </text>
    </svg>
  );
}

function SectionCard({ title, action, children }) {
  return (
    <Card elevation={0} sx={{ ...cardStyle, p: "22px 22px 18px", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "18px" }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: DARK, fontFamily: FONT }}>
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [view, setView]     = useState("monthly");
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Read token from wherever your app stores it (adjust as needed)
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
    else {
      setError("No auth token found");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Typography sx={{ color: "#EF4444", fontFamily: FONT }}>{error || "No data available"}</Typography>
      </Box>
    );
  }

  // ── Derived data from backend response ──────────────────────────────────────
  const STATS = {
    totalHRs: stats?.kpis?.totalHR ?? 0,
    totalOffers: stats?.kpis?.totalOffers ?? 0,
    activeOffers: stats?.kpis?.activeOffers ?? 0,
    totalCandidatures: stats?.kpis?.totalApplications ?? 0,
    monthlyTarget: 75,
  };

  const PIE_DATA = stats.charts.applicationsByStatus.map((item) => ({
  name: item.status,
  value: item._count._all,
  color: STATUS_COLOR[item.status] ?? "#CBD5E1",
}));

  const chartData = stats?.charts?.applicationsByMonth ?? [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>

      {/* ── ROW 1: Stats (Left) & Target (Right) ── */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: "24px",
        flexWrap: "wrap",
      }}>
        {/* Statistics Group */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "18px",
          flexGrow: 1,
          "@media (max-width: 1400px)": { gridTemplateColumns: "repeat(2, 1fr)" },
          "@media (max-width: 600px)":  { gridTemplateColumns: "1fr" },
        }}>
          <StatCard
            icon="👥"
            label="Total Candidatures"
            value={STATS.totalCandidatures.toLocaleString()}
            change={{ positive: true, value: "vs last month" }}
          />
          <StatCard
            icon="📋"
            label="Total Offers"
            value={STATS.totalOffers}
            change={{ positive: true, value: "vs last month" }}
          />
          <StatCard
            icon="🟢"
            label="Active Offers"
            value={STATS.activeOffers}
            change={{ positive: true, value: "vs last month" }}
          />
          <StatCard
            icon="🧑‍💼"
            label="HR Managers"
            value={STATS.totalHRs}
            change={{ positive: true, value: "vs last month" }}
          />
        </Box>

        {/* Target Card */}
        <Card elevation={0} sx={{
          ...cardStyle,
          p: "24px",
          width: "420px",
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 1100px)": { width: "100%" },
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: DARK }}>Monthly Target</Typography>
              <Typography sx={{ fontSize: 12, color: G400 }}>Target you've set for each month</Typography>
            </Box>
            <Typography sx={{ color: G400, cursor: "pointer" }}>•••</Typography>
          </Box>

          <Box sx={{ flex: 1, display: "flex", alignItems: "center", py: 2 }}>
            <Gauge pct={STATS.monthlyTarget} />
          </Box>

          <Typography sx={{ fontSize: 12, color: G400, textAlign: "center", mb: 3 }}>
            You have <b>{STATS.activeOffers}</b> active offers right now.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2, borderTop: `1px solid ${G100}` }}>
            {[
              { l: "Total Offers",  v: STATS.totalOffers,       u: true  },
              { l: "Active",        v: STATS.activeOffers,       u: true  },
              { l: "Applications",  v: STATS.totalCandidatures,  u: true  },
            ].map((item, i) => (
              <Box key={i} sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: 11, color: G400, fontWeight: 600 }}>{item.l}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: DARK }}>
                  {item.v}{" "}
                  <span style={{ color: item.u ? "#10B981" : "#EF4444", fontSize: 10 }}>
                    {item.u ? "▲" : "▼"}
                  </span>
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>

      {/* ── ROW 2: Bar Chart & Pie Chart ── */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "24px",
        "@media (max-width: 1100px)": { gridTemplateColumns: "1fr" },
      }}>
        <SectionCard
          title="Candidatures Over Time"
          action={
            <Select
              value={view}
              onChange={(e) => setView(e.target.value)}
              size="small"
              sx={{ fontSize: 12, fontFamily: FONT, borderRadius: "8px", height: 32, minWidth: 110 }}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          }
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={G100} vertical={false} />
              <XAxis dataKey="x" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} width={35} />
              <Tooltip cursor={{ fill: G100 }} contentStyle={TT} />
              <Bar dataKey="v" fill={BLUE} radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Application Status">
          {PIE_DATA.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={PIE_DATA} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                    {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={TT} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", mt: 2 }}>
                {PIE_DATA.map((item) => (
                  <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                    <Typography sx={{ fontSize: 11, color: G400, fontFamily: FONT }}>
                      {item.name} ({item.value})
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Typography sx={{ fontSize: 13, color: G400, fontFamily: FONT, textAlign: "center", mt: 4 }}>
              No application data yet
            </Typography>
          )}
        </SectionCard>
      </Box>

      {/* ── ROW 3: HR Performance ── */}
      <SectionCard title="HR Performance">
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 100px", pb: 1, borderBottom: `1px solid ${G100}`, mb: 1 }}>
          {["HR Manager", "Offers", "Candidatures", "Hired"].map((h) => (
            <Typography key={h} sx={{ fontSize: 12, fontWeight: 600, color: G400, fontFamily: FONT }}>{h}</Typography>
          ))}
        </Box>
        {stats?.hrPerformance?.map((hr, i) => (
          <Box
            key={hr.hrId}
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 100px",
              alignItems: "center",
              py: 1.5,
              borderBottom:
                i < stats.hrPerformance.length - 1
                  ? `1px solid ${G100}`
                  : "none",
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: DARK, fontFamily: FONT }}>
              {hr.name}
            </Typography>

            <Typography sx={{ fontSize: 13, color: DARK, fontFamily: FONT }}>
              {hr.offers}
            </Typography>

            <Typography sx={{ fontSize: 13, color: DARK, fontFamily: FONT }}>
              {hr.candidatures}
            </Typography>

            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "#ECFDF5",
                color: "#10B981",
                borderRadius: "6px",
                width: "fit-content",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              ✓ {hr.hired}
            </Box>
          </Box>
        ))}
      </SectionCard>

    </Box>
  );
}