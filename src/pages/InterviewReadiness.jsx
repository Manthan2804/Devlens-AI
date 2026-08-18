import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Code2,
  FolderKanban,
  Radar as RadarIcon,
  Layers,
  Activity,
  BookOpen,
  ChevronDown,
  Check,
  ArrowUpRight,
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

/* ------------------------------------------------------------------ */
/*  Tiers + factor data                                                 */
/* ------------------------------------------------------------------ */

const TIERS = [
  { name: "Beginner", min: 0 },
  { name: "Improving", min: 26 },
  { name: "Internship Ready", min: 46 },
  { name: "Interview Ready", min: 66 },
  { name: "Top Candidate", min: 83 },
];

const FACTORS = [
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    weight: 20,
    score: 88,
    summary: "ATS-compatible, strong action verbs, one weak section.",
    detail: "Your resume scores well on formatting and ATS parseability. The main drag is 2 bullet points still missing measurable impact — fixing those would push this factor above 90.",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Code2,
    weight: 20,
    score: 75,
    summary: "Consistent activity, but 2 of 3 top repos lack a README.",
    detail: "Commit history shows real, sustained work — that's the strongest signal here. Missing READMEs on your secondary projects are the single biggest thing holding this score back.",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    weight: 20,
    score: 72,
    summary: "Strong flagship project, two others need deployment.",
    detail: "DevLens AI itself is a strong signal — deployed, documented, tested. Task Flow and ML Notebooks are dragging the average down since neither is deployed or fully documented.",
  },
  {
    id: "skills",
    label: "Technical Skills",
    icon: RadarIcon,
    weight: 15,
    score: 78,
    summary: "Strong frontend and version control, weak on DevOps/Cloud.",
    detail: "Your skill radar shows real strength in frontend work and Git discipline. Cloud and DevOps are your two lowest categories — closing those gaps has the highest leverage on this score.",
  },
  {
    id: "portfolio",
    label: "Portfolio Completeness",
    icon: Layers,
    weight: 10,
    score: 65,
    summary: "Missing certifications and a recruiter-facing summary.",
    detail: "You have the raw material — projects, skills, activity — but no single place ties it together yet. A completed Recruiter Preview page would meaningfully lift this.",
  },
  {
    id: "activity",
    label: "Activity",
    icon: Activity,
    weight: 10,
    score: 70,
    summary: "Regular commits, with a few multi-week gaps.",
    detail: "Your contribution graph shows healthy activity most weeks, but a few multi-week gaps stand out. Recruiters read consistency almost as much as volume.",
  },
  {
    id: "documentation",
    label: "Documentation",
    icon: BookOpen,
    weight: 5,
    score: 60,
    summary: "Flagship project well-documented, others are not.",
    detail: "Smallest weight, but an easy win — writing a README for your two undocumented repos would take under an hour and close this gap almost entirely.",
  },
];

function computeScore(factors) {
  const weighted = factors.reduce((sum, f) => sum + (f.weight * f.score) / 100, 0);
  return Math.round(weighted);
}

function getTier(score) {
  return [...TIERS].reverse().find((t) => score >= t.min) || TIERS[0];
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

function ScoreRing({ value, size = 168, stroke = 14 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.border} strokeWidth={stroke} />
        <defs>
          <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.amber} />
            <stop offset="100%" stopColor={C.emerald} />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#readinessGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{ fontFamily: fontDisplay, fontSize: size * 0.26, fontWeight: 700, color: C.text }}>{value}</span>
        <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint, letterSpacing: 1 }}>/ 100</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function ReadinessHero({ score, tier }) {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-8" style={{ padding: "32px" }}>
      <ScoreRing value={score} />
      <div className="flex-1 text-center md:text-left">
        <span
          className="inline-block"
          style={{ fontFamily: fontMono, fontSize: 11, letterSpacing: 0.8, color: C.emerald, background: "rgba(31,157,111,0.12)", padding: "4px 12px", borderRadius: 99 }}
        >
          {tier.name.toUpperCase()}
        </span>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 24, fontWeight: 700, color: C.text, marginTop: 12 }}>
          You're interview ready — with room to reach Top Candidate.
        </h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, lineHeight: 1.6, maxWidth: 480 }}>
          Your score is a weighted blend of your resume, GitHub activity, project quality, technical
          skills, portfolio completeness, activity, and documentation — stronger than 68% of profiles at
          your experience level.
        </p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Tier ladder                                                         */
/* ------------------------------------------------------------------ */

function TierLadder({ score, tier }) {
  const nextTier = TIERS[TIERS.findIndex((t) => t.name === tier.name) + 1];
  const pointsToNext = nextTier ? nextTier.min - score : null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Target size={15} style={{ color: C.textMuted }} />
          <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>Readiness ladder</h3>
        </div>
        {nextTier && (
          <span style={{ fontFamily: fontMono, fontSize: 11.5, color: C.amberDeep }}>
            {pointsToNext} pts to {nextTier.name}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: "100%", background: GRADIENT }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {TIERS.map((t) => {
            const isPast = score >= t.min;
            const isCurrent = t.name === tier.name;
            return (
              <div key={t.name} className="flex flex-col items-center" style={{ width: `${100 / TIERS.length}%` }}>
                <div
                  className="rounded-full mb-1.5"
                  style={{
                    width: isCurrent ? 10 : 7,
                    height: isCurrent ? 10 : 7,
                    background: isPast ? C.amberDeep : C.borderStrong,
                    boxShadow: isCurrent ? `0 0 0 4px rgba(232,147,58,0.18)` : "none",
                  }}
                />
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: 10.5,
                    textAlign: "center",
                    color: isCurrent ? C.text : isPast ? C.textMuted : C.textFaint,
                    fontWeight: isCurrent ? 700 : 500,
                    lineHeight: 1.3,
                  }}
                >
                  {t.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Factor breakdown                                                    */
/* ------------------------------------------------------------------ */

function scoreColor(v) {
  return v >= 75 ? C.emerald : v >= 50 ? C.amberDeep : C.red;
}

function FactorRow({ factor, isOpen, onClick }) {
  const contribution = Math.round((factor.weight * factor.score) / 100);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.surface2 }}>
      <button className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left" onClick={onClick}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: scoreColor(factor.score) + "18" }}>
          <factor.icon size={15} style={{ color: scoreColor(factor.score) }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontFamily: fontBody, fontSize: 13.5, color: C.text, fontWeight: 600 }}>{factor.label}</span>
            <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint }}>weight {factor.weight}%</span>
          </div>
          <p style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {factor.summary}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:block text-right">
            <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>contributes</span>
            <div style={{ fontFamily: fontMono, fontSize: 13, color: C.text, fontWeight: 600 }}>+{contribution}</div>
          </div>
          <span style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, color: scoreColor(factor.score) }}>{factor.score}</span>
          <ChevronDown size={15} style={{ color: C.textFaint, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                <div style={{ height: "100%", width: `${factor.score}%`, background: scoreColor(factor.score) }} />
              </div>
              <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, lineHeight: 1.6 }}>{factor.detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FactorBreakdown({ factors }) {
  const [openId, setOpenId] = useState(factors[0].id);
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>How this score is built</h3>
        <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>weighted average</span>
      </div>
      <div className="flex flex-col gap-3">
        {factors.map((f) => (
          <FactorRow key={f.id} factor={f} isOpen={openId === f.id} onClick={() => setOpenId(openId === f.id ? null : f.id)} />
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Action plan                                                         */
/* ------------------------------------------------------------------ */

function ActionPlan({ nextTierName }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  const items = [
    "Add a README to Task Flow and ML Notebooks",
    "Deploy Task Flow so it's live, not just a repo",
    "Close the Cloud and DevOps gaps flagged on your Skill Radar",
    "Finish your Recruiter Preview page for a complete portfolio",
  ];
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-5">
        <ArrowUpRight size={15} style={{ color: C.amberDeep }} />
        <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>
          Path to {nextTierName || "the next tier"}
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)} className="flex items-start gap-2.5 text-left">
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
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function InterviewReadiness() {
  const score = computeScore(FACTORS);
  const tier = getTier(score);
  const tierIdx = TIERS.findIndex((t) => t.name === tier.name);
  const nextTier = TIERS[tierIdx + 1];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Interview Readiness</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          One score, built from everything DevLens knows about your profile.
        </p>
      </div>

      <ReadinessHero score={score} tier={tier} />
      <TierLadder score={score} tier={tier} />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <FactorBreakdown factors={FACTORS} />
        </div>
        <ActionPlan nextTierName={nextTier?.name} />
      </div>
    </div>
  );
}