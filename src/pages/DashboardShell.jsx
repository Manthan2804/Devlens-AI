import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  Link2,
  AlertTriangle,
  RefreshCw,
  Menu,
  X,
  ArrowRight,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens — kept identical to the landing page                 */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#0a0d14",
  bgAlt: "#0d1119",
  surface: "#12161f",
  surface2: "#161b26",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#e9ebf2",
  textMuted: "#8a91a6",
  textFaint: "#565d70",
  indigo: "#6c8ef5",
  indigoSoft: "rgba(108,142,245,0.14)",
  amber: "#f5a623",
  emerald: "#34d399",
  red: "#f16565",
};

const GRADIENT = `linear-gradient(90deg, ${C.amber} 0%, ${C.emerald} 100%)`;
const fontDisplay = "'Space Grotesk', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";

/* ------------------------------------------------------------------ */
/*  Nav data                                                            */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Small primitives                                                   */
/* ------------------------------------------------------------------ */

function LogoMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="dashLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.emerald} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke={C.border} strokeWidth="3" />
      <path d="M16 3 A13 13 0 0 1 27.25 21.5" fill="none" stroke="url(#dashLogoGrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="url(#dashLogoGrad)" />
    </svg>
  );
}

function Skeleton({ w = "100%", h = 14, r = 6 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: `linear-gradient(90deg, ${C.surface2} 25%, ${C.border} 50%, ${C.surface2} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

function Badge({ children, tone = "indigo" }) {
  const map = {
    indigo: { bg: C.indigoSoft, fg: C.indigo },
    amber: { bg: "rgba(245,166,35,0.14)", fg: C.amber },
    emerald: { bg: "rgba(52,211,153,0.14)", fg: C.emerald },
    faint: { bg: C.surface2, fg: C.textMuted },
  };
  const t = map[tone];
  return (
    <span
      style={{
        fontFamily: fontMono,
        fontSize: 10,
        letterSpacing: 0.5,
        color: t.fg,
        background: t.bg,
        padding: "2px 7px",
        borderRadius: 99,
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const width = collapsed ? 76 : 250;

  const content = (
    <div
      className="h-full flex flex-col"
      style={{ width, background: C.bgAlt, borderRight: `1px solid ${C.border}`, transition: "width 0.25s ease" }}
    >
      {/* logo row */}
      <div className="flex items-center gap-2.5 px-5" style={{ height: 64, borderBottom: `1px solid ${C.border}` }}>
        <LogoMark />
        {!collapsed && (
          <span style={{ fontFamily: fontDisplay, color: C.text, fontWeight: 600, fontSize: 16, whiteSpace: "nowrap" }}>
            DevLens<span style={{ color: C.amber }}>AI</span>
          </span>
        )}
        <button className="md:hidden ml-auto" onClick={() => setMobileOpen(false)} style={{ color: C.textMuted }}>
          <X size={18} />
        </button>
      </div>

      {/* nav */}
      <div className="flex-1 overflow-y-auto py-5 px-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-6">
            {!collapsed && (
              <div
                style={{
                  fontFamily: fontMono,
                  fontSize: 10.5,
                  letterSpacing: 1,
                  color: C.textFaint,
                  padding: "0 10px",
                  marginBottom: 8,
                }}
              >
                {section.label.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActive(item.id);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 relative"
                    style={{
                      padding: collapsed ? "10px" : "9px 10px",
                      borderRadius: 9,
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: isActive ? C.surface : "transparent",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5"
                        style={{ width: 3, borderRadius: 3, background: GRADIENT }}
                      />
                    )}
                    <item.icon size={17} style={{ color: isActive ? C.text : C.textMuted, flexShrink: 0 }} />
                    {!collapsed && (
                      <span
                        style={{
                          fontFamily: fontBody,
                          fontSize: 13.5,
                          color: isActive ? C.text : C.textMuted,
                          fontWeight: isActive ? 600 : 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto">
                        <Badge tone="amber">{item.badge}</Badge>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* readiness mini + collapse toggle */}
      <div className="px-3 pb-3">
        {!collapsed && (
          <div className="rounded-xl p-3.5 mb-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: fontMono, fontSize: 10, color: C.textFaint, letterSpacing: 0.5 }}>
                READINESS
              </span>
              <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textMuted }}>—</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
              <div style={{ height: "100%", width: "0%", background: GRADIENT }} />
            </div>
            <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint, marginTop: 8, lineHeight: 1.4 }}>
              Connect a profile to see your score
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden md:flex items-center gap-2 w-full"
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            color: C.textMuted,
            justifyContent: collapsed ? "center" : "flex-start",
            border: `1px solid ${C.border}`,
          }}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed && <span style={{ fontFamily: fontBody, fontSize: 12.5 }}>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <div className="hidden md:block flex-shrink-0" style={{ height: "100vh", position: "sticky", top: 0 }}>
        {content}
      </div>
      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Topbar                                                              */
/* ------------------------------------------------------------------ */

function Topbar({ title, setMobileOpen, demoState, setDemoState }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div
      className="flex items-center gap-4 px-5 sticky top-0 z-30"
      style={{
        height: 64,
        background: "rgba(10,13,20,0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{ color: C.text }}>
        <Menu size={20} />
      </button>

      <h1 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>
        {title}
      </h1>

      <div
        className="hidden sm:flex items-center gap-2 rounded-lg px-3 ml-2"
        style={{ background: C.surface, border: `1px solid ${C.border}`, height: 36, width: 280, maxWidth: "100%" }}
      >
        <Search size={14} style={{ color: C.textFaint }} />
        <input
          placeholder="Search projects, skills, reports…"
          style={{
            fontFamily: fontBody,
            fontSize: 13,
            color: C.text,
            background: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* demo state switcher — dev-only helper for previewing shell states */}
        <div
          className="hidden lg:flex items-center rounded-full p-0.5"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          {["empty", "loading", "data", "error"].map((s) => (
            <button
              key={s}
              onClick={() => setDemoState(s)}
              style={{
                fontFamily: fontMono,
                fontSize: 10.5,
                letterSpacing: 0.3,
                padding: "5px 10px",
                borderRadius: 99,
                color: demoState === s ? C.bg : C.textFaint,
                background: demoState === s ? C.text : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          className="relative flex items-center justify-center rounded-lg"
          style={{ width: 36, height: 36, border: `1px solid ${C.border}`, color: C.textMuted }}
        >
          <Bell size={16} />
          <span
            className="absolute rounded-full"
            style={{ width: 6, height: 6, background: C.amber, top: 8, right: 9 }}
          />
        </button>

        <div className="relative" ref={menuRef}>
          <button className="flex items-center gap-2" onClick={() => setMenuOpen((o) => !o)}>
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 32, height: 32, background: GRADIENT }}
            >
              <span style={{ fontFamily: fontDisplay, fontSize: 12.5, fontWeight: 700, color: C.bg }}>PS</span>
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
                style={{ width: 190, background: C.surface, border: `1px solid ${C.borderStrong}`, boxShadow: "0 20px 50px -12px rgba(0,0,0,0.6)" }}
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
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5"
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
/*  Score card (data / loading / empty variants)                       */
/* ------------------------------------------------------------------ */

function ScoreCard({ label, value, accent, state }) {
  if (state === "loading") {
    return (
      <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <Skeleton w={90} h={11} />
        <div className="mt-4">
          <Skeleton w={60} h={28} />
        </div>
        <div className="mt-4">
          <Skeleton w="100%" h={6} r={99} />
        </div>
      </div>
    );
  }

  const hasData = state === "data";
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <span style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 0.6, color: C.textFaint }}>
        {label.toUpperCase()}
      </span>
      <div className="flex items-baseline gap-1.5 mt-3">
        <span style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 600, color: hasData ? C.text : C.textFaint }}>
          {hasData ? value : "—"}
        </span>
        {hasData && <span style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}>/100</span>}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mt-4" style={{ background: C.surface2 }}>
        <div
          style={{
            height: "100%",
            width: hasData ? `${value}%` : "0%",
            background: accent,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      {!hasData && (
        <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint, marginTop: 10 }}>Not connected yet</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty / Error states                                                */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center text-center px-6"
      style={{
        background: C.surface,
        border: `1px dashed ${C.borderStrong}`,
        padding: "60px 24px",
      }}
    >
      <div
        className="rounded-full flex items-center justify-center mb-5"
        style={{ width: 52, height: 52, background: C.indigoSoft }}
      >
        <Upload size={22} style={{ color: C.indigo }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: C.text }}>
        Nothing to analyze yet
      </h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 360, lineHeight: 1.6 }}>
        Upload a resume and connect your GitHub to see your scores, your skill radar, and your interview
        readiness in one place.
      </p>
      <div className="flex flex-wrap gap-3 mt-7 justify-center">
        <button
          className="flex items-center gap-2"
          style={{
            fontFamily: fontBody,
            fontSize: 13.5,
            fontWeight: 600,
            color: C.bg,
            background: C.text,
            padding: "10px 18px",
            borderRadius: 8,
          }}
        >
          <Upload size={15} /> Upload resume
        </button>
        <button
          className="flex items-center gap-2"
          style={{
            fontFamily: fontBody,
            fontSize: 13.5,
            fontWeight: 500,
            color: C.text,
            background: "transparent",
            border: `1px solid ${C.borderStrong}`,
            padding: "10px 18px",
            borderRadius: 8,
          }}
        >
          <Link2 size={15} /> Connect GitHub
        </button>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center text-center"
      style={{
        background: "rgba(241,101,101,0.05)",
        border: `1px solid rgba(241,101,101,0.25)`,
        padding: "60px 24px",
      }}
    >
      <div
        className="rounded-full flex items-center justify-center mb-5"
        style={{ width: 52, height: 52, background: "rgba(241,101,101,0.14)" }}
      >
        <AlertTriangle size={22} style={{ color: C.red }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: C.text }}>
        Couldn't load your analysis
      </h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 360, lineHeight: 1.6 }}>
        The last scan didn't finish. Your resume and GitHub connection are safe — try running it again.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 mt-7"
        style={{
          fontFamily: fontBody,
          fontSize: 13.5,
          fontWeight: 600,
          color: C.text,
          background: C.surface2,
          border: `1px solid ${C.borderStrong}`,
          padding: "10px 18px",
          borderRadius: 8,
        }}
      >
        <RefreshCw size={14} /> Retry analysis
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Insight feed item                                                   */
/* ------------------------------------------------------------------ */

function InsightRow({ tone, title, desc, state }) {
  const toneColor = { amber: C.amber, indigo: C.indigo, emerald: C.emerald }[tone];
  if (state === "loading") {
    return (
      <div className="flex items-start gap-3 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <Skeleton w={28} h={28} r={8} />
        <div className="flex-1">
          <Skeleton w="60%" h={12} />
          <div className="mt-2">
            <Skeleton w="90%" h={11} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ width: 28, height: 28, background: toneColor + "18" }}
      >
        <Sparkles size={13} style={{ color: toneColor }} />
      </div>
      <div>
        <p style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 500 }}>{title}</p>
        <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, marginTop: 3, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Overview page                                                       */
/* ------------------------------------------------------------------ */

function Overview({ demoState }) {
  const scores = [
    { label: "Resume", value: 82, accent: C.amber },
    { label: "GitHub", value: 71, accent: C.indigo },
    { label: "ATS", value: 88, accent: C.emerald },
    { label: "Portfolio", value: 65, accent: C.amber },
  ];

  const insights = [
    { tone: "amber", title: "Add a README to 3 top repos", desc: "Repos without a README score lower on portfolio quality." },
    { tone: "indigo", title: "Quantify 2 resume bullets", desc: "Recruiters scan for numbers first — add impact metrics." },
    { tone: "emerald", title: "Deploy your capstone project", desc: "A live link adds more weight than a repo link alone." },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 600, color: C.text }}>
            Welcome back, Priya
          </h2>
          <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
            {demoState === "empty" && "Let's get your first profile analyzed."}
            {demoState === "loading" && "Running your latest scan…"}
            {demoState === "data" && "Here's where things stand today."}
            {demoState === "error" && "Something interrupted your last scan."}
          </p>
        </div>
        <button
          className="flex items-center gap-2 self-start sm:self-auto"
          style={{
            fontFamily: fontBody,
            fontSize: 13,
            fontWeight: 600,
            color: C.bg,
            background: C.text,
            padding: "9px 16px",
            borderRadius: 8,
          }}
        >
          Run new scan <ArrowRight size={14} />
        </button>
      </div>

      {/* score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((s) => (
          <ScoreCard key={s.label} label={s.label} value={s.value} accent={s.accent} state={demoState} />
        ))}
      </div>

      {/* main content: left empty/error/data, right insight feed */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {demoState === "empty" && <EmptyState />}
          {demoState === "error" && <ErrorState onRetry={() => {}} />}
          {demoState === "loading" && (
            <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <Skeleton w={160} h={13} />
              <div className="mt-6 flex flex-col gap-4">
                <Skeleton w="100%" h={10} />
                <Skeleton w="85%" h={10} />
                <Skeleton w="92%" h={10} />
                <Skeleton w="70%" h={10} />
              </div>
            </div>
          )}
          {demoState === "data" && (
            <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-5">
                <h3 style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 600, color: C.text }}>
                  Interview readiness
                </h3>
                <Badge tone="emerald">Interview Ready</Badge>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <span style={{ fontFamily: fontDisplay, fontSize: 44, fontWeight: 700, color: C.text }}>76</span>
                  <span style={{ fontFamily: fontBody, fontSize: 14, color: C.textMuted }}>/100</span>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
                    <div style={{ height: "100%", width: "76%", background: GRADIENT }} />
                  </div>
                  <p style={{ fontFamily: fontBody, fontSize: 12, color: C.textFaint, marginTop: 8 }}>
                    Stronger than 68% of profiles at your experience level
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-1">
            <h3 style={{ fontFamily: fontDisplay, fontSize: 14.5, fontWeight: 600, color: C.text }}>
              AI recommendations
            </h3>
            {demoState === "data" && <Badge tone="indigo">3 new</Badge>}
          </div>
          <div className="flex flex-col mt-2">
            {demoState === "loading" ? (
              <>
                <InsightRow state="loading" />
                <InsightRow state="loading" />
                <InsightRow state="loading" />
              </>
            ) : demoState === "empty" || demoState === "error" ? (
              <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textFaint, padding: "16px 0" }}>
                Recommendations will show up here after your first scan.
              </p>
            ) : (
              insights.map((it) => <InsightRow key={it.title} {...it} state="data" />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder page for not-yet-built sections                        */
/* ------------------------------------------------------------------ */

function PlaceholderPage({ label }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center text-center"
      style={{ background: C.surface, border: `1px dashed ${C.border}`, padding: "80px 24px" }}
    >
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 600, color: C.text }}>{label}</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13, color: C.textFaint, marginTop: 8 }}>
        This section is next up on the build list.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

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

export default function DashboardShell() {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoState, setDemoState] = useState("data");

  return (
    <div className="flex" style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${C.amber}55; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>

      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0">
        <Topbar title={TITLES[active]} setMobileOpen={setMobileOpen} demoState={demoState} setDemoState={setDemoState} />
        <div className="p-5 md:p-7">
          {active === "overview" ? <Overview demoState={demoState} /> : <PlaceholderPage label={TITLES[active]} />}
        </div>
      </div>
    </div>
  );
}
