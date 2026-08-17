import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  ExternalLink,
  Sparkles,
  Check,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Layers,
  Server,
  Rocket,
  Plus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens — matched to the rest of the app                     */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Mock data — 11 criteria per project, grouped into 3 categories      */
/* ------------------------------------------------------------------ */

const MOCK_PROJECTS = [
  {
    id: "devlens-ai",
    name: "DevLens AI",
    tagline: "AI-powered portfolio analyzer",
    stack: ["React", "FastAPI", "PostgreSQL"],
    score: 86,
    status: "Deployed",
    repoUrl: "github.com/priya-dev/devlens-ai",
    liveUrl: "devlens-ai.vercel.app",
    criteria: {
      originality: 88,
      complexity: 82,
      uiQuality: 90,
      backendArchitecture: 78,
      authentication: 74,
      databaseDesign: 80,
      apiIntegrations: 85,
      deployment: 92,
      documentation: 88,
      testing: 58,
      scalability: 70,
    },
    recommendations: [
      "Add unit tests for the scoring engine — currently the weakest area",
      "Document the API endpoints with a Swagger/OpenAPI spec",
      "Add rate limiting before opening this up to more users",
    ],
  },
  {
    id: "task-flow",
    name: "Task Flow",
    tagline: "Full-stack task management app",
    stack: ["React", "Node.js", "MongoDB"],
    score: 61,
    status: "Not deployed",
    repoUrl: "github.com/priya-dev/task-flow",
    liveUrl: null,
    criteria: {
      originality: 55,
      complexity: 60,
      uiQuality: 68,
      backendArchitecture: 62,
      authentication: 65,
      databaseDesign: 58,
      apiIntegrations: 50,
      deployment: 20,
      documentation: 40,
      testing: 30,
      scalability: 45,
    },
    recommendations: [
      "Deploy this — an undeployed project reads as unfinished to recruiters",
      "Add a README covering setup, screenshots, and what makes it different",
      "This is a common project idea — add one feature that makes it stand out",
    ],
  },
  {
    id: "ml-notebooks",
    name: "ML Notebooks",
    tagline: "Coursework and experiments in Python",
    stack: ["Python", "Jupyter", "scikit-learn"],
    score: 39,
    status: "Stale",
    repoUrl: "github.com/priya-dev/ml-notebooks",
    liveUrl: null,
    criteria: {
      originality: 45,
      complexity: 50,
      uiQuality: 10,
      backendArchitecture: 20,
      authentication: 0,
      databaseDesign: 15,
      apiIntegrations: 20,
      deployment: 10,
      documentation: 35,
      testing: 25,
      scalability: 30,
    },
    recommendations: [
      "Turn your strongest notebook into a small deployed demo or API",
      "Add markdown context to notebooks explaining the problem and results",
      "Consider whether this belongs on your profile as-is, or as a rewritten project",
    ],
  },
];

const GROUPS = [
  {
    label: "Design & complexity",
    icon: Layers,
    accent: C.amberDeep,
    keys: [
      ["originality", "Originality"],
      ["complexity", "Complexity"],
      ["uiQuality", "UI quality"],
    ],
  },
  {
    label: "Engineering",
    icon: Server,
    accent: C.emerald,
    keys: [
      ["backendArchitecture", "Backend architecture"],
      ["authentication", "Authentication"],
      ["databaseDesign", "Database design"],
      ["apiIntegrations", "API integrations"],
    ],
  },
  {
    label: "Delivery",
    icon: Rocket,
    accent: C.rose,
    keys: [
      ["deployment", "Deployment"],
      ["documentation", "Documentation"],
      ["testing", "Testing"],
      ["scalability", "Scalability"],
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Small primitives                                                    */
/* ------------------------------------------------------------------ */

function Badge({ children, tone = "amber" }) {
  const map = {
    amber: { bg: "rgba(232,147,58,0.14)", fg: C.amberDeep },
    rose: { bg: "rgba(217,100,122,0.14)", fg: C.rose },
    emerald: { bg: "rgba(31,157,111,0.14)", fg: C.emerald },
    red: { bg: "rgba(201,74,63,0.14)", fg: C.red },
    faint: { bg: C.surface2, fg: C.textMuted },
  };
  const t = map[tone];
  return (
    <span style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 0.4, color: t.fg, background: t.bg, padding: "3px 9px", borderRadius: 99 }}>
      {children}
    </span>
  );
}

function statusTone(status) {
  if (status === "Deployed") return "emerald";
  if (status === "Stale") return "red";
  return "amber";
}

function Card({ children, style, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-5 md:p-6 ${className}`}
      style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 14px 36px -26px rgba(20,18,14,0.2)", ...style }}
    >
      {children}
    </div>
  );
}

function ScoreRing({ value, size = 56, stroke = 5 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? C.emerald : value >= 50 ? C.amberDeep : C.red;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.border} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <span className="absolute" style={{ fontFamily: fontDisplay, fontSize: size * 0.3, fontWeight: 700, color: C.text }}>
        {value}
      </span>
    </div>
  );
}

function CriteriaBar({ label, value }) {
  const color = value >= 75 ? C.emerald : value >= 50 ? C.amberDeep : C.red;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text }}>{label}</span>
        <span style={{ fontFamily: fontMono, fontSize: 11.5, color: C.textMuted }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ height: "100%", background: color }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty / import state                                                */
/* ------------------------------------------------------------------ */

function EmptyState({ onImport }) {
  const [loading, setLoading] = useState(false);
  return (
    <Card className="flex flex-col items-center justify-center text-center" style={{ padding: "64px 24px" }}>
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 56, height: 56, background: "rgba(217,100,122,0.14)" }}>
        <FolderKanban size={24} style={{ color: C.rose }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>No projects analyzed yet</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 380, lineHeight: 1.6 }}>
        Pull in the repos from your Code Portfolio scan, or add a project by hand. We'll score each one
        across design, engineering, and delivery.
      </p>
      <div className="flex flex-wrap gap-3 mt-7 justify-center">
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(onImport, 1600);
          }}
          disabled={loading}
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: "#fff", background: C.ink, padding: "11px 20px", borderRadius: 99, opacity: loading ? 0.75 : 1 }}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <FolderKanban size={15} />}
          {loading ? "Importing…" : "Import from Code Portfolio"}
        </button>
        <button
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 600, color: C.text, background: "transparent", border: `1.5px solid ${C.borderStrong}`, padding: "11px 20px", borderRadius: 99 }}
        >
          <Plus size={15} /> Add manually
        </button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Project list (left column)                                          */
/* ------------------------------------------------------------------ */

function ProjectListItem({ project, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 transition-all duration-150"
      style={{
        background: active ? C.ink : C.surface,
        border: `1px solid ${active ? C.ink : C.border}`,
        boxShadow: active ? "0 14px 30px -16px rgba(17,16,9,0.4)" : "0 10px 26px -22px rgba(20,18,14,0.2)",
      }}
    >
      <div className="flex items-center gap-3">
        <ScoreRing value={project.score} size={44} stroke={4} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 style={{ fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, color: active ? "#fff" : C.text }}>{project.name}</h4>
          </div>
          <p style={{ fontFamily: fontBody, fontSize: 11.5, color: active ? "rgba(255,255,255,0.6)" : C.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {project.tagline}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.stack.slice(0, 3).map((s) => (
          <span
            key={s}
            style={{
              fontFamily: fontMono,
              fontSize: 10,
              color: active ? "rgba(255,255,255,0.75)" : C.textMuted,
              background: active ? "rgba(255,255,255,0.1)" : C.surface2,
              padding: "2px 7px",
              borderRadius: 99,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Project detail (right column)                                       */
/* ------------------------------------------------------------------ */

function ProjectDetail({ project }) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-5"
    >
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <ScoreRing value={project.score} size={64} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 style={{ fontFamily: fontDisplay, fontSize: 19, fontWeight: 700, color: C.text }}>{project.name}</h3>
                <Badge tone={statusTone(project.status)}>{project.status}</Badge>
              </div>
              <p style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted, marginTop: 4 }}>{project.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.stack.map((s) => (
                  <span key={s} style={{ fontFamily: fontBody, fontSize: 12, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "3px 10px", borderRadius: 99 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a
              href="#"
              className="flex items-center gap-1.5 transition-transform duration-200 hover:scale-105"
              style={{ fontFamily: fontBody, fontSize: 12, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "7px 12px", borderRadius: 99 }}
            >
              <FolderKanban size={13} /> Repo
            </a>
            {project.liveUrl && (
              <a
                href="#"
                className="flex items-center gap-1.5 transition-transform duration-200 hover:scale-105"
                style={{ fontFamily: fontBody, fontSize: 12, color: "#fff", background: C.ink, padding: "7px 12px", borderRadius: 99 }}
              >
                <ExternalLink size={13} /> Live
              </a>
            )}
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-5">
        {GROUPS.map((group) => (
          <Card key={group.label}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: group.accent + "18" }}>
                <group.icon size={14} style={{ color: group.accent }} />
              </div>
              <h4 style={{ fontFamily: fontDisplay, fontSize: 13.5, fontWeight: 700, color: C.text }}>{group.label}</h4>
            </div>
            <div className="flex flex-col gap-4">
              {group.keys.map(([key, label]) => (
                <CriteriaBar key={key} label={label} value={project.criteria[key]} />
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-2.5 mb-5">
          <Sparkles size={15} style={{ color: C.amberDeep }} />
          <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>Recommendations</h3>
        </div>
        <div className="flex flex-col gap-3">
          {project.recommendations.map((r) => (
            <div key={r} className="flex items-start gap-2.5">
              <AlertTriangle size={13} style={{ color: C.amberDeep, marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, lineHeight: 1.55 }}>{r}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page header                                                         */
/* ------------------------------------------------------------------ */

function PageHeader({ hasProjects, count, onReset }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Projects</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          {hasProjects ? (
            <span style={{ fontFamily: fontMono, fontSize: 12 }}>{count} projects scored across 11 criteria</span>
          ) : (
            "Every project, scored on design, engineering, and delivery — not just whether it runs."
          )}
        </p>
      </div>
      {hasProjects && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 self-start sm:self-auto transition-transform duration-200 hover:scale-105"
          style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 600, color: C.text, background: C.surface, border: `1px solid ${C.border}`, padding: "9px 14px", borderRadius: 99 }}
        >
          <RefreshCw size={13} /> Re-import
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function ProjectsPage() {
  const [imported, setImported] = useState(false);
  const [selectedId, setSelectedId] = useState(MOCK_PROJECTS[0].id);

  const selected = MOCK_PROJECTS.find((p) => p.id === selectedId) || MOCK_PROJECTS[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader hasProjects={imported} count={MOCK_PROJECTS.length} onReset={() => setImported(false)} />

      <AnimatePresence mode="wait">
        {!imported ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState onImport={() => setImported(true)} />
          </motion.div>
        ) : (
          <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-4 gap-5">
            <div className="lg:col-span-1 flex flex-col gap-3">
              {MOCK_PROJECTS.map((p) => (
                <ProjectListItem key={p.id} project={p} active={p.id === selectedId} onClick={() => setSelectedId(p.id)} />
              ))}
            </div>
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <ProjectDetail key={selected.id} project={selected} />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}