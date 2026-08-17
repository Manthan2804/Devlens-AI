import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Code2,
  FolderKanban,
  Sparkles,
  Radar as RadarIcon,
  Target,
  Map as MapIcon,
  Users,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { Dock, DockItem, DockIcon, DockLabel } from "../components/core/dock";

const C = {
  bg: "#f4efe3",
  bgAlt: "#ece3d1",
  surface: "#ffffff",
  surface2: "#faf6ec",
  border: "rgba(20,18,14,0.1)",
  borderStrong: "rgba(20,18,14,0.18)",
  ink: "#111009",
  inkAlt: "#1b1912",
  text: "#15130e",
  textMuted: "#726b5a",
  textFaint: "#a89f8a",
  amber: "#e8933a",
  amberDeep: "#c96f1f",
  emerald: "#1f9d6f",
  rose: "#d9647a",
  red: "#c94a3f",
};

const GRADIENT = `linear-gradient(135deg, ${C.amber} 0%, ${C.emerald} 100%)`;
const fontDisplay = "'Space Grotesk', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "resume", label: "Resume Analyzer", icon: FileText },
      { id: "github", label: "Code Portfolio", icon: Code2 },
      { id: "projects", label: "Projects", icon: FolderKanban },
    ],
  },
  {
    label: "Guidance",
    items: [
      { id: "coach", label: "AI Career Coach", icon: Sparkles, badge: "AI" },
      { id: "radar", label: "Skill Radar", icon: RadarIcon },
      { id: "readiness", label: "Interview Readiness", icon: Target },
      { id: "roadmap", label: "Learning Roadmap", icon: MapIcon },
    ],
  },
  {
    label: "Share",
    items: [{ id: "recruiter", label: "Recruiter Preview", icon: Users }],
  },
];

// Quick-access items surfaced on the floating dock — the sections used most
// often, not the full nav tree (that stays in the sidebar).
const DOCK_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "github", label: "Code Portfolio", icon: Code2 },
  { id: "coach", label: "AI Coach", icon: Sparkles },
  { id: "radar", label: "Skill Radar", icon: RadarIcon },
  { id: "readiness", label: "Readiness", icon: Target },
];

const TITLES = {
  overview: "Overview",
  resume: "Resume Analyzer",
  github: "Code Portfolio",
  projects: "Projects",
  coach: "AI Career Coach",
  radar: "Skill Radar",
  readiness: "Interview Readiness",
  roadmap: "Learning Roadmap",
  recruiter: "Recruiter Preview",
};

function LogoMark({ size = 26, light = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="dashLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.emerald} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke={light ? "rgba(255,255,255,0.22)" : C.border} strokeWidth="3" />
      <path d="M16 3 A13 13 0 0 1 27.25 21.5" fill="none" stroke="url(#dashLogoGrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="url(#dashLogoGrad)" />
    </svg>
  );
}

function Badge({ children, tone = "amber" }) {
  const map = {
    amber: { bg: "rgba(232,147,58,0.14)", fg: C.amberDeep },
    rose: { bg: "rgba(217,100,122,0.14)", fg: C.rose },
    emerald: { bg: "rgba(31,157,111,0.14)", fg: C.emerald },
    faint: { bg: C.surface2, fg: C.textMuted },
  };
  const t = map[tone];
  return (
    <span style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: 0.5, color: t.fg, background: t.bg, padding: "2px 7px", borderRadius: 99 }}>
      {children}
    </span>
  );
}

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeId = location.pathname === "/dashboard" ? "overview" : location.pathname.split("/dashboard/")[1];
  const width = collapsed ? 76 : 250;

  const goTo = (id) => {
    navigate(id === "overview" ? "/dashboard" : `/dashboard/${id}`);
    setMobileOpen(false);
  };

  const content = (
    <div className="h-full flex flex-col" style={{ width, background: C.ink, borderRight: "1px solid rgba(255,255,255,0.08)", transition: "width 0.25s ease" }}>
      <div className="flex items-center gap-2.5 px-5" style={{ height: 64, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <LogoMark />
        {!collapsed && (
          <span style={{ fontFamily: fontDisplay, color: "#fff", fontWeight: 700, fontSize: 15.5, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
            DEVLENS<span style={{ color: C.amber }}>AI</span>
          </span>
        )}
        <button className="md:hidden ml-auto" onClick={() => setMobileOpen(false)} style={{ color: "rgba(255,255,255,0.6)" }}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            {!collapsed && (
              <div style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 1, color: "rgba(255,255,255,0.32)", padding: "0 10px", marginBottom: 8 }}>
                {section.label.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(item.id)}
                    className="flex items-center gap-3 relative transition-colors duration-150"
                    style={{
                      padding: collapsed ? "10px" : "9px 10px",
                      borderRadius: 9,
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && <span className="absolute left-0 top-1.5 bottom-1.5" style={{ width: 3, borderRadius: 3, background: GRADIENT }} />}
                    <item.icon size={17} style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)", flexShrink: 0 }} />
                    {!collapsed && (
                      <span style={{ fontFamily: fontBody, fontSize: 13.5, color: isActive ? "#fff" : "rgba(255,255,255,0.62)", fontWeight: isActive ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto"><Badge tone="amber">{item.badge}</Badge></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pb-3">
        {!collapsed && (
          <div className="rounded-xl p-3.5 mb-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: fontMono, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>READINESS</span>
              <span style={{ fontFamily: fontMono, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>—</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div style={{ height: "100%", width: "0%", background: GRADIENT }} />
            </div>
            <p style={{ fontFamily: fontBody, fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 8, lineHeight: 1.4 }}>
              Connect a profile to see your score
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden md:flex items-center gap-2 w-full transition-colors duration-150"
          style={{ padding: "8px 10px", borderRadius: 8, color: "rgba(255,255,255,0.55)", justifyContent: collapsed ? "center" : "flex-start", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed && <span style={{ fontFamily: fontBody, fontSize: 12.5 }}>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block flex-shrink-0" style={{ height: "100vh", position: "sticky", top: 0 }}>
        {content}
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.25, ease: "easeOut" }} className="md:hidden fixed left-0 top-0 bottom-0 z-50">
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Topbar({ title, setMobileOpen, demoState, setDemoState }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex items-center gap-4 px-5 sticky top-0 z-30" style={{ height: 64, background: "rgba(244,239,227,0.88)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}>
      <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{ color: C.text }}>
        <Menu size={20} />
      </button>

      <h1 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{title}</h1>

      <div className="hidden sm:flex items-center gap-2 rounded-full px-3.5 ml-2" style={{ background: C.surface, border: `1px solid ${C.border}`, height: 38, width: 280, maxWidth: "100%" }}>
        <Search size={14} style={{ color: C.textFaint }} />
        <input placeholder="Search projects, skills, reports…" style={{ fontFamily: fontBody, fontSize: 13, color: C.text, background: "transparent", border: "none", outline: "none", width: "100%" }} />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden lg:flex items-center rounded-full p-0.5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {["empty", "loading", "data", "error"].map((s) => (
            <button
              key={s}
              onClick={() => setDemoState(s)}
              className="transition-all duration-200"
              style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 0.3, padding: "5px 10px", borderRadius: 99, color: demoState === s ? "#fff" : C.textFaint, background: demoState === s ? C.ink : "transparent" }}
            >
              {s}
            </button>
          ))}
        </div>

        <button className="relative flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110" style={{ width: 36, height: 36, background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}>
          <Bell size={16} />
          <span className="absolute rounded-full" style={{ width: 6, height: 6, background: C.amber, top: 8, right: 9 }} />
        </button>

        <div className="relative" ref={menuRef}>
          <button className="flex items-center gap-2 transition-transform duration-200 hover:scale-105" onClick={() => setMenuOpen((o) => !o)}>
            <div className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32, background: GRADIENT, boxShadow: "0 6px 16px -6px rgba(232,147,58,0.6)" }}>
              <span style={{ fontFamily: fontDisplay, fontSize: 12.5, fontWeight: 700, color: "#fff" }}>PS</span>
            </div>
            <ChevronDown size={14} style={{ color: C.textMuted }} className="hidden sm:block" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 rounded-xl overflow-hidden"
                style={{ width: 190, background: C.surface, border: `1px solid ${C.borderStrong}`, boxShadow: "0 24px 55px -20px rgba(20,18,14,0.3)" }}
              >
                <div className="px-3.5 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 600 }}>Priya Sharma</div>
                  <div style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>priya@devlens.ai</div>
                </div>
                {[
                  { icon: User, label: "Profile" },
                  { icon: Settings, label: "Settings" },
                  { icon: LogOut, label: "Sign out" },
                ].map((it) => (
                  <button
                    key={it.label}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 transition-colors duration-150"
                    style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <it.icon size={14} />
                    {it.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating quick-access dock — magnifies on hover, jumps straight to */
/*  a section via the router. Complements the sidebar, doesn't replace */
/*  it — sidebar has the full tree, dock has the frequently-used ones. */
/* ------------------------------------------------------------------ */
function QuickDock() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeId = location.pathname === "/dashboard" ? "overview" : location.pathname.split("/dashboard/")[1];

  return (
    <div className="hidden md:block fixed bottom-5 left-1/2 -translate-x-1/2 z-40" style={{ marginLeft: 88 }}>
      <Dock
        className="shadow-2xl"
        style={{ background: C.ink, border: "1px solid rgba(255,255,255,0.1)" }}
        magnification={56}
        panelHeight={54}
      >
        {DOCK_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <DockItem
              key={item.id}
              onClick={() => navigate(item.id === "overview" ? "/dashboard" : `/dashboard/${item.id}`)}
              active={isActive}
              className="transition-colors duration-150"
              style={{ background: isActive ? "rgba(232,147,58,0.18)" : "transparent" }}
            >
              <DockLabel style={{ background: C.ink, color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
                {item.label}
              </DockLabel>
              <DockIcon>
                <item.icon className="h-full w-full" style={{ color: isActive ? C.amber : "rgba(255,255,255,0.65)" }} />
              </DockIcon>
            </DockItem>
          );
        })}
      </Dock>
    </div>
  );
}

export default function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoState, setDemoState] = useState("data");
  const location = useLocation();
  const activeId = location.pathname === "/dashboard" ? "overview" : location.pathname.split("/dashboard/")[1];

  return (
    <div className="flex" style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${C.amber}55; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.borderStrong}; border-radius: 99px; }
        .grain-layer-dash {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          mix-blend-mode: multiply;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-[70] grain-layer-dash" />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <Topbar title={TITLES[activeId] || "Overview"} setMobileOpen={setMobileOpen} demoState={demoState} setDemoState={setDemoState} />
        <div className="p-5 md:p-7" style={{ paddingBottom: 100 }}>
          <Outlet context={{ demoState }} />
        </div>
      </div>

      <QuickDock />
    </div>
  );
}