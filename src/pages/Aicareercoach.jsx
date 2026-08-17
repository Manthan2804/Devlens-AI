import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Check,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Code2,
  Layers,
  Award,
  CalendarCheck,
  ChevronDown,
  ArrowRight,
  Building2,
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

const QUICK_COMPANIES = ["Microsoft", "Google", "Amazon", "Stripe", "Netflix"];

/* ------------------------------------------------------------------ */
/*  Mock plan generator — stands in for the real LLM call              */
/* ------------------------------------------------------------------ */

function buildMockPlan(company) {
  return {
    company,
    gapScore: 68,
    haveSkills: ["React", "TypeScript", "REST APIs", "Git", "PostgreSQL"],
    needSkills: ["System Design", "Distributed Systems", "Kubernetes", "gRPC"],
    missingSkills: ["System Design", "Distributed Systems", "Kubernetes"],
    suggestedProjects: [
      {
        name: "Rate-limited API gateway",
        why: `${company} interviews lean hard on distributed systems — a small gateway with rate limiting and caching demonstrates that directly.`,
        stack: ["Go or Node.js", "Redis", "Docker"],
      },
      {
        name: "Real-time collaborative editor",
        why: "Shows you can handle concurrency and conflict resolution — a common theme in system design rounds.",
        stack: ["WebSockets", "CRDTs", "React"],
      },
      {
        name: "Deploy an existing project on Kubernetes",
        why: "You already have working projects — redeploying one on K8s closes a real gap without starting from scratch.",
        stack: ["Kubernetes", "Docker", "Helm"],
      },
    ],
    dsaRoadmap: [
      "Arrays & two-pointer patterns",
      "Hash maps & sliding window",
      "Trees & graph traversal (BFS/DFS)",
      "Dynamic programming fundamentals",
      "Heaps & priority queues",
      "Union-Find & graph algorithms",
    ],
    systemDesignRoadmap: [
      "Load balancing & horizontal scaling",
      "Caching strategies (write-through, write-back)",
      "Database sharding & replication",
      "Message queues & async processing",
      "Rate limiting & API gateways",
      "Designing for consistency vs. availability",
    ],
    certifications: [
      { name: "AWS Certified Solutions Architect", provider: "Amazon Web Services" },
      { name: "Certified Kubernetes Application Developer", provider: "CNCF" },
    ],
    interviewPlan: [
      `Research ${company}'s engineering blog for the systems they actually talk about`,
      "Do 2 mock system design interviews focused on scalability",
      "Drill DSA topics above — 45 min/day, timed",
      "Prepare 3 STAR stories from your strongest project",
      `Review ${company}'s leveling guide so you know what bar you're aiming for`,
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Small primitives                                                    */
/* ------------------------------------------------------------------ */

function Badge({ children, tone = "amber" }) {
  const map = {
    amber: { bg: "rgba(232,147,58,0.14)", fg: C.amberDeep },
    rose: { bg: "rgba(217,100,122,0.14)", fg: C.rose },
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

function CardHeader({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={15} style={{ color: C.textMuted }} />}
        <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>{title}</h3>
      </div>
      {right}
    </div>
  );
}

function Checklist({ items, storageKey }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <button key={storageKey + i} onClick={() => toggle(i)} className="flex items-start gap-2.5 text-left">
          <div
            className="flex items-center justify-center rounded-md flex-shrink-0 mt-0.5"
            style={{ width: 16, height: 16, border: `1.5px solid ${checked[i] ? C.emerald : C.borderStrong}`, background: checked[i] ? C.emerald : "transparent", transition: "all 0.15s ease" }}
          >
            {checked[i] && <Check size={11} style={{ color: "#fff" }} />}
          </div>
          <span style={{ fontFamily: fontBody, fontSize: 12.5, color: checked[i] ? C.textFaint : C.textMuted, textDecoration: checked[i] ? "line-through" : "none", lineHeight: 1.5 }}>
            {item}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty / input state                                                 */
/* ------------------------------------------------------------------ */

function CompanyInput({ onGenerate }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <Card className="flex flex-col items-center justify-center text-center" style={{ padding: "64px 24px" }}>
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 56, height: 56, background: "rgba(232,147,58,0.14)" }}>
        <Sparkles size={24} style={{ color: C.amberDeep }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Where do you want to work?</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 380, lineHeight: 1.6 }}>
        Type a target company and DevLens builds a gap analysis, a project list, and a full prep plan
        against what they actually look for.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onGenerate(value.trim());
        }}
        className="flex items-center gap-2.5 mt-7"
        style={{ width: 340, maxWidth: "100%" }}
      >
        <div
          className="flex-1 rounded-full flex items-center gap-2 px-4"
          style={{ height: 46, background: C.surface2, border: `1.5px solid ${focused ? C.amberDeep : C.border}`, transition: "border-color 0.15s ease" }}
        >
          <Building2 size={15} style={{ color: C.textFaint, flexShrink: 0 }} />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Microsoft"
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
        {QUICK_COMPANIES.map((c) => (
          <button
            key={c}
            onClick={() => onGenerate(c)}
            className="transition-transform duration-200 hover:scale-105"
            style={{ fontFamily: fontBody, fontSize: 12, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "6px 13px", borderRadius: 99 }}
          >
            {c}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Generating state                                                    */
/* ------------------------------------------------------------------ */

function GeneratingState({ company }) {
  const steps = [
    `Reading what ${company} actually hires for`,
    "Mapping your skills against the gap",
    "Drafting a DSA + system design roadmap",
    "Curating project ideas and certifications",
  ];
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
        <Sparkles size={22} style={{ color: C.text }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: C.text }}>Building your {company} prep plan</h3>
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
/*  Tab: Gap analysis                                                    */
/* ------------------------------------------------------------------ */

function GapTab({ plan }) {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <CardHeader icon={Check} title="Skills you already have" />
        <div className="flex flex-wrap gap-2">
          {plan.haveSkills.map((s) => (
            <span key={s} className="flex items-center gap-1.5" style={{ fontFamily: fontBody, fontSize: 12, color: C.emerald, background: "rgba(31,157,111,0.1)", padding: "5px 11px", borderRadius: 99 }}>
              <Check size={11} /> {s}
            </span>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader icon={AlertTriangle} title="Gaps to close" />
        <div className="flex flex-wrap gap-2">
          {plan.needSkills.map((s) => (
            <span key={s} style={{ fontFamily: fontBody, fontSize: 12, color: C.amberDeep, border: `1px dashed rgba(201,111,31,0.45)`, padding: "5px 11px", borderRadius: 99 }}>
              + {s}
            </span>
          ))}
        </div>
        <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint, marginTop: 12, lineHeight: 1.5 }}>
          Pulled from patterns in {plan.company}'s job descriptions and interview reports — not found on
          your resume or GitHub yet.
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Roadmap                                                        */
/* ------------------------------------------------------------------ */

function RoadmapTab({ plan }) {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <CardHeader icon={Code2} title="DSA roadmap" right={<Badge tone="amber">6 topics</Badge>} />
        <Checklist items={plan.dsaRoadmap} storageKey="dsa" />
      </Card>
      <Card>
        <CardHeader icon={Layers} title="System design roadmap" right={<Badge tone="emerald">6 topics</Badge>} />
        <Checklist items={plan.systemDesignRoadmap} storageKey="sysdesign" />
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Suggested projects                                             */
/* ------------------------------------------------------------------ */

function ProjectsTab({ plan }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <Card>
      <CardHeader icon={Sparkles} title="Suggested projects" right={<Badge tone="faint">{plan.suggestedProjects.length} ideas</Badge>} />
      <div className="flex flex-col gap-3">
        {plan.suggestedProjects.map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={p.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.surface2 }}>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left" onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                <span style={{ fontFamily: fontBody, fontSize: 13.5, color: C.text, fontWeight: 600, flex: 1 }}>{p.name}</span>
                <ChevronDown size={15} style={{ color: C.textFaint, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1">
                      <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, lineHeight: 1.6, marginBottom: 10 }}>{p.why}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <span key={s} style={{ fontFamily: fontMono, fontSize: 11, color: C.text, background: C.surface, border: `1px solid ${C.border}`, padding: "3px 9px", borderRadius: 99 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Interview prep                                                  */
/* ------------------------------------------------------------------ */

function InterviewPrepTab({ plan }) {
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader icon={Award} title="Recommended certifications" />
        <div className="grid sm:grid-cols-2 gap-3">
          {plan.certifications.map((c) => (
            <div key={c.name} className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: "rgba(232,147,58,0.14)" }}>
                <Award size={15} style={{ color: C.amberDeep }} />
              </div>
              <div>
                <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, fontWeight: 600, lineHeight: 1.4 }}>{c.name}</p>
                <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint, marginTop: 2 }}>{c.provider}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader icon={CalendarCheck} title="Interview preparation plan" />
        <Checklist items={plan.interviewPlan} storageKey="prep" />
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page header + tabs                                                  */
/* ------------------------------------------------------------------ */

function PageHeader({ hasPlan, company, gapScore, onReset }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>AI Career Coach</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          {hasPlan ? (
            <span style={{ fontFamily: fontMono, fontSize: 12 }}>
              Target: {company} · gap score {gapScore}/100
            </span>
          ) : (
            "Type a target company and get missing skills, projects, and a full interview prep plan."
          )}
        </p>
      </div>
      {hasPlan && (
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

function Tabs({ tabs, active, setActive }) {
  return (
    <div className="inline-flex rounded-full p-1 mb-5" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          style={{
            fontFamily: fontBody,
            fontSize: 12.5,
            fontWeight: 700,
            padding: "8px 16px",
            borderRadius: 99,
            color: active === t.id ? "#fff" : C.textMuted,
            background: active === t.id ? C.ink : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "gap", label: "Gap Analysis" },
  { id: "roadmap", label: "Roadmap" },
  { id: "projects", label: "Projects" },
  { id: "prep", label: "Interview Prep" },
];

export default function AiCareerCoach() {
  const [stage, setStage] = useState("empty"); // empty | generating | data
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState(null);
  const [tab, setTab] = useState("gap");

  const handleGenerate = (name) => {
    setCompany(name);
    setStage("generating");
    setTimeout(() => {
      setPlan(buildMockPlan(name));
      setStage("data");
      setTab("gap");
    }, 2600);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader hasPlan={stage === "data"} company={company} gapScore={plan?.gapScore} onReset={() => setStage("empty")} />

      <AnimatePresence mode="wait">
        {stage === "empty" && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CompanyInput onGenerate={handleGenerate} />
          </motion.div>
        )}

        {stage === "generating" && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GeneratingState company={company} />
          </motion.div>
        )}

        {stage === "data" && plan && (
          <motion.div key="data" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Tabs tabs={TABS} active={tab} setActive={setTab} />
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {tab === "gap" && <GapTab plan={plan} />}
                {tab === "roadmap" && <RoadmapTab plan={plan} />}
                {tab === "projects" && <ProjectsTab plan={plan} />}
                {tab === "prep" && <InterviewPrepTab plan={plan} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}