import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map as MapIcon,
  ArrowRight,
  Check,
  Loader2,
  RefreshCw,
  ChevronDown,
  PlayCircle,
  BookOpen,
  FileText,
  Code2,
  Sparkles,
  Target,
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

const CURRENT_SKILLS = ["React", "HTML", "CSS", "JavaScript"];
const QUICK_ROLES = ["Full Stack Developer", "Backend Developer", "ML Engineer", "DevOps Engineer"];

const RESOURCE_ICON = { video: PlayCircle, article: FileText, docs: BookOpen };

/* ------------------------------------------------------------------ */
/*  Mock roadmap generator                                              */
/* ------------------------------------------------------------------ */

function buildMockRoadmap(role) {
  return {
    role,
    weeks: [
      {
        title: "Backend fundamentals",
        goal: `Get comfortable building a server from scratch — the foundation everything else in this ${role} roadmap builds on.`,
        resources: [
          { type: "docs", title: "Node.js official guide", provider: "nodejs.org" },
          { type: "video", title: "Express.js crash course", provider: "YouTube" },
        ],
        problems: ["Build a REST API with 4 CRUD endpoints", "Add basic error handling middleware"],
        project: "A simple notes API with Express",
      },
      {
        title: "Databases & data modeling",
        goal: "Learn to design a schema that won't fall apart the moment your app grows past a toy project.",
        resources: [
          { type: "docs", title: "PostgreSQL tutorial", provider: "postgresql.org" },
          { type: "article", title: "Database normalization explained", provider: "freeCodeCamp" },
        ],
        problems: ["Design a schema for a blog with users, posts, comments", "Write 5 queries using JOINs"],
        project: "Connect your notes API to a real PostgreSQL database",
      },
      {
        title: "Authentication & security",
        goal: "Every full-stack app needs this — and it's one of the most common interview whiteboard topics.",
        resources: [
          { type: "article", title: "JWT authentication explained", provider: "Auth0 blog" },
          { type: "video", title: "Password hashing with bcrypt", provider: "YouTube" },
        ],
        problems: ["Implement signup/login with hashed passwords", "Add JWT-protected routes"],
        project: "Add auth to your notes API",
      },
      {
        title: "Full-stack integration",
        goal: "Connect the React skills you already have to the backend you just built — this is where it clicks.",
        resources: [
          { type: "docs", title: "Fetch API & React Query docs", provider: "tanstack.com" },
          { type: "article", title: "Handling loading & error states in React", provider: "Kent C. Dodds" },
        ],
        problems: ["Build a React frontend for your notes API", "Handle loading, error, and empty states"],
        project: "Ship a working full-stack notes app",
      },
      {
        title: "Testing & deployment",
        goal: "An untested, undeployed project reads as unfinished — this week closes both gaps.",
        resources: [
          { type: "docs", title: "Vitest / Jest getting started", provider: "vitest.dev" },
          { type: "article", title: "Deploying full-stack apps on Render", provider: "render.com" },
        ],
        problems: ["Write tests for your 4 API endpoints", "Deploy frontend and backend live"],
        project: "Deployed, tested version of your notes app",
      },
      {
        title: "Capstone project",
        goal: "Put everything together into one project that's actually worth putting on your resume.",
        resources: [
          { type: "article", title: "What makes a strong portfolio project", provider: "DevLens AI" },
        ],
        problems: ["Scope a project bigger than a CRUD notes app", "Ship it deployed, tested, and documented"],
        project: "Your new flagship full-stack project",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Small primitives                                                    */
/* ------------------------------------------------------------------ */

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

function Badge({ children, tone = "amber" }) {
  const map = {
    amber: { bg: "rgba(232,147,58,0.14)", fg: C.amberDeep },
    emerald: { bg: "rgba(31,157,111,0.14)", fg: C.emerald },
    faint: { bg: C.surface2, fg: C.textMuted },
  };
  const t = map[tone];
  return (
    <span style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 0.4, color: t.fg, background: t.bg, padding: "3px 9px", borderRadius: 99 }}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Input state                                                         */
/* ------------------------------------------------------------------ */

function RoleInput({ onGenerate }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <Card className="flex flex-col items-center justify-center text-center" style={{ padding: "60px 24px" }}>
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 56, height: 56, background: "rgba(31,157,111,0.14)" }}>
        <MapIcon size={24} style={{ color: C.emerald }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Where are you headed?</h3>

      <div className="flex items-center gap-2 flex-wrap justify-center mt-5">
        <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint, letterSpacing: 0.5 }}>CURRENT SKILLS</span>
        {CURRENT_SKILLS.map((s) => (
          <span key={s} style={{ fontFamily: fontBody, fontSize: 12, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "3px 10px", borderRadius: 99 }}>
            {s}
          </span>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onGenerate(value.trim());
        }}
        className="flex items-center gap-2.5 mt-6"
        style={{ width: 360, maxWidth: "100%" }}
      >
        <div
          className="flex-1 rounded-full flex items-center gap-2 px-4"
          style={{ height: 46, background: C.surface2, border: `1.5px solid ${focused ? C.amberDeep : C.border}`, transition: "border-color 0.15s ease" }}
        >
          <Target size={15} style={{ color: C.textFaint, flexShrink: 0 }} />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Full Stack Developer"
            style={{ fontFamily: fontBody, fontSize: 13.5, color: C.text, background: "transparent", border: "none", outline: "none", width: "100%" }}
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
          style={{ width: 46, height: 46, background: C.ink, color: "#fff", flexShrink: 0 }}
        >
          <ArrowRight size={17} />
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        {QUICK_ROLES.map((r) => (
          <button
            key={r}
            onClick={() => onGenerate(r)}
            className="transition-transform duration-200 hover:scale-105"
            style={{ fontFamily: fontBody, fontSize: 12, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "6px 13px", borderRadius: 99 }}
          >
            {r}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Generating state                                                    */
/* ------------------------------------------------------------------ */

function GeneratingState({ role }) {
  const steps = ["Comparing your skills against the target", "Sequencing topics by dependency", "Curating resources and practice problems", "Building your capstone project idea"];
  const [stepIdx, setStepIdx] = useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setStepIdx((i) => Math.min(i + 1, steps.length - 1)), 650);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="flex flex-col items-center text-center" style={{ padding: "60px 24px" }}>
      <div className="relative flex items-center justify-center mb-6" style={{ width: 64, height: 64 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{ border: `2.5px solid transparent`, borderTopColor: C.amber, borderRightColor: C.emerald }}
        />
        <MapIcon size={22} style={{ color: C.text }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: C.text }}>
        Mapping your path to {role}
      </h3>
      <div className="flex flex-col gap-2.5 mt-6" style={{ width: 300 }}>
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2.5">
            {i < stepIdx ? (
              <Check size={14} style={{ color: C.emerald, flexShrink: 0 }} />
            ) : i === stepIdx ? (
              <Loader2 size={14} style={{ color: C.amberDeep, flexShrink: 0 }} className="animate-spin" />
            ) : (
              <div style={{ width: 14, height: 14, borderRadius: 99, border: `1.5px solid ${C.border}`, flexShrink: 0 }} />
            )}
            <span style={{ fontFamily: fontBody, fontSize: 13, color: i <= stepIdx ? C.text : C.textFaint, textAlign: "left" }}>{s}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress summary                                                    */
/* ------------------------------------------------------------------ */

function ProgressSummary({ role, total, done }) {
  const pct = Math.round((done / total) * 100);
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, background: "rgba(31,157,111,0.14)" }}>
            <Sparkles size={14} style={{ color: C.emerald }} />
          </div>
          <div>
            <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>Path to {role}</h3>
            <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>{done} of {total} weeks complete</span>
          </div>
        </div>
        <span style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: C.text }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ height: "100%", background: GRADIENT }} />
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Week timeline                                                       */
/* ------------------------------------------------------------------ */

function WeekCard({ week, index, isOpen, isDone, onToggleOpen, onToggleDone, isLast }) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={onToggleDone}
          className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200"
          style={{
            width: 34,
            height: 34,
            background: isDone ? GRADIENT : C.surface,
            border: `1.5px solid ${isDone ? "transparent" : C.borderStrong}`,
            zIndex: 1,
          }}
        >
          {isDone ? <Check size={15} style={{ color: "#fff" }} /> : <span style={{ fontFamily: fontMono, fontSize: 12, color: C.textMuted }}>{index + 1}</span>}
        </button>
        {!isLast && <div className="flex-1" style={{ width: 2, background: isDone ? C.emerald : C.border, minHeight: 24 }} />}
      </div>

      <div className="flex-1 pb-6 min-w-0">
        <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 12px 30px -24px rgba(20,18,14,0.2)" }}>
          <button className="w-full flex items-start gap-3 px-4 py-3.5 text-left" onClick={onToggleOpen}>
            <div className="flex-1 min-w-0">
              <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, letterSpacing: 0.5 }}>WEEK {index + 1}</span>
              <h4 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text, marginTop: 2 }}>{week.title}</h4>
            </div>
            <ChevronDown size={16} style={{ color: C.textFaint, flexShrink: 0, marginTop: 4, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="px-4 pb-5 flex flex-col gap-4" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                  <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, lineHeight: 1.6 }}>{week.goal}</p>

                  <div>
                    <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, letterSpacing: 0.5 }}>LEARNING RESOURCES</span>
                    <div className="flex flex-col gap-2 mt-2">
                      {week.resources.map((r) => {
                        const Icon = RESOURCE_ICON[r.type] || FileText;
                        return (
                          <div key={r.title} className="flex items-center gap-2.5">
                            <Icon size={13} style={{ color: C.amberDeep, flexShrink: 0 }} />
                            <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text }}>{r.title}</span>
                            <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>· {r.provider}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, letterSpacing: 0.5 }}>PRACTICE PROBLEMS</span>
                    <div className="flex flex-col gap-2 mt-2">
                      {week.problems.map((p) => (
                        <div key={p} className="flex items-start gap-2.5">
                          <Code2 size={13} style={{ color: C.emerald, marginTop: 1.5, flexShrink: 0 }} />
                          <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg px-3.5 py-3 flex items-start gap-2.5" style={{ background: "rgba(232,147,58,0.07)", border: "1px solid rgba(232,147,58,0.2)" }}>
                    <Sparkles size={13} style={{ color: C.amberDeep, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontFamily: fontMono, fontSize: 10, color: C.amberDeep, letterSpacing: 0.5 }}>RECOMMENDED PROJECT</span>
                      <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, marginTop: 2 }}>{week.project}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page header                                                         */
/* ------------------------------------------------------------------ */

function PageHeader({ hasRoadmap, onReset }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Learning Roadmap</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          {hasRoadmap ? "Week-by-week, from where you are to where you're headed." : "Tell us your target role — we'll build the path to get there."}
        </p>
      </div>
      {hasRoadmap && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 self-start sm:self-auto transition-transform duration-200 hover:scale-105"
          style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 600, color: C.text, background: C.surface, border: `1px solid ${C.border}`, padding: "9px 14px", borderRadius: 99 }}
        >
          <RefreshCw size={13} /> New target
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function LearningRoadmap() {
  const [stage, setStage] = useState("empty"); // empty | generating | data
  const [roadmap, setRoadmap] = useState(null);
  const [openIdx, setOpenIdx] = useState(0);
  const [doneWeeks, setDoneWeeks] = useState({});

  const handleGenerate = (role) => {
    setStage("generating");
    setTimeout(() => {
      setRoadmap(buildMockRoadmap(role));
      setDoneWeeks({});
      setOpenIdx(0);
      setStage("data");
    }, 2600);
  };

  const doneCount = Object.values(doneWeeks).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader hasRoadmap={stage === "data"} onReset={() => setStage("empty")} />

      <AnimatePresence mode="wait">
        {stage === "empty" && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RoleInput onGenerate={handleGenerate} />
          </motion.div>
        )}

        {stage === "generating" && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GeneratingState role={roadmap?.role || "your goal"} />
          </motion.div>
        )}

        {stage === "data" && roadmap && (
          <motion.div key="data" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            <ProgressSummary role={roadmap.role} total={roadmap.weeks.length} done={doneCount} />
            <div>
              {roadmap.weeks.map((week, i) => (
                <WeekCard
                  key={i}
                  week={week}
                  index={i}
                  isOpen={openIdx === i}
                  isDone={!!doneWeeks[i]}
                  onToggleOpen={() => setOpenIdx(openIdx === i ? -1 : i)}
                  onToggleDone={() => setDoneWeeks((d) => ({ ...d, [i]: !d[i] }))}
                  isLast={i === roadmap.weeks.length - 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}