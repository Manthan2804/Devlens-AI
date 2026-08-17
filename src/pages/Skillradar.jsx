import React, { useState } from "react";
import { motion } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { Radar as RadarIcon, Check, AlertTriangle, TrendingUp, TrendingDown, Info } from "lucide-react";

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
/*  Mock skill data — the 10 categories from the spec                  */
/* ------------------------------------------------------------------ */

const SKILLS = [
  { category: "Frontend", score: 84, benchmark: 70, note: "Strong React/TypeScript fundamentals, consistent across projects." },
  { category: "Backend", score: 61, benchmark: 65, note: "Solid REST API basics, but limited exposure to service architecture." },
  { category: "Databases", score: 58, benchmark: 60, note: "Comfortable with PostgreSQL queries, no schema design experience shown." },
  { category: "DSA", score: 45, benchmark: 68, note: "Weakest area — few graph/DP problems in your practice history." },
  { category: "DevOps", score: 32, benchmark: 50, note: "No CI/CD or containerization shown across your repos yet." },
  { category: "Cloud", score: 28, benchmark: 55, note: "No cloud deployments detected — this is holding your readiness back." },
  { category: "AI", score: 66, benchmark: 45, note: "Above average — you've shipped an AI-powered project already." },
  { category: "Testing", score: 39, benchmark: 58, note: "Only 1 of 6 repos has meaningful test coverage." },
  { category: "Version Control", score: 88, benchmark: 72, note: "Clean commit history and consistent branching across projects." },
  { category: "Problem Solving", score: 70, benchmark: 65, note: "Good bug-fix track record based on commit patterns." },
];

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

function scoreColor(v) {
  return v >= 75 ? C.emerald : v >= 50 ? C.amberDeep : C.red;
}

/* ------------------------------------------------------------------ */
/*  Custom tooltip for the radar chart                                  */
/* ------------------------------------------------------------------ */

function RadarTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg px-3 py-2.5" style={{ background: C.ink, boxShadow: "0 14px 30px -12px rgba(0,0,0,0.4)" }}>
      <p style={{ fontFamily: fontDisplay, fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{d.category}</p>
      <p style={{ fontFamily: fontMono, fontSize: 11, color: C.amber, marginTop: 2 }}>You: {d.score}</p>
      <p style={{ fontFamily: fontMono, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Benchmark: {d.benchmark}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Radar chart card                                                    */
/* ------------------------------------------------------------------ */

function RadarCard({ data, compare, setCompare }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <RadarIcon size={15} style={{ color: C.textMuted }} />
          <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>Skill radar</h3>
        </div>
        <button
          onClick={() => setCompare((c) => !c)}
          className="flex items-center gap-2 transition-all duration-200"
          style={{
            fontFamily: fontBody,
            fontSize: 12,
            fontWeight: 600,
            color: compare ? "#fff" : C.textMuted,
            background: compare ? C.ink : C.surface2,
            border: `1px solid ${compare ? C.ink : C.border}`,
            padding: "6px 12px",
            borderRadius: 99,
          }}
        >
          <span className="rounded-full" style={{ width: 6, height: 6, background: compare ? C.emerald : C.textFaint }} />
          Compare to target role
        </button>
      </div>

      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveContainer>
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke={C.border} />
            <PolarAngleAxis dataKey="category" tick={{ fontFamily: fontBody, fontSize: 11.5, fill: C.textMuted }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontFamily: fontMono, fontSize: 9, fill: C.textFaint }} axisLine={false} tickCount={5} />
            {compare && (
              <Radar name="Target role" dataKey="benchmark" stroke={C.rose} fill="transparent" strokeWidth={1.5} strokeDasharray="4 3" />
            )}
            <Radar name="You" dataKey="score" stroke={C.amberDeep} fill={C.amber} fillOpacity={0.35} strokeWidth={2} />
            <Tooltip content={<RadarTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 justify-center mt-2">
        <div className="flex items-center gap-2">
          <div style={{ width: 10, height: 10, borderRadius: 3, background: C.amber }} />
          <span style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textMuted }}>You</span>
        </div>
        {compare && (
          <div className="flex items-center gap-2">
            <div style={{ width: 10, height: 2, background: C.rose }} />
            <span style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textMuted }}>Target role benchmark</span>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Strengths / weak areas                                              */
/* ------------------------------------------------------------------ */

function HighlightCard({ icon: Icon, title, tone, items }) {
  const toneColor = tone === "emerald" ? C.emerald : C.amberDeep;
  return (
    <Card>
      <CardHeader icon={Icon} title={title} right={<Badge tone={tone}>{items.length}</Badge>} />
      <div className="flex flex-col gap-3.5">
        {items.map((it) => (
          <div key={it.category} className="flex items-start gap-2.5">
            <div className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ width: 18, height: 18, background: toneColor + "1e" }}>
              {tone === "emerald" ? <Check size={10} style={{ color: toneColor }} /> : <AlertTriangle size={10} style={{ color: toneColor }} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 600 }}>{it.category}</span>
                <span style={{ fontFamily: fontMono, fontSize: 11, color: toneColor }}>{it.score}</span>
              </div>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted, marginTop: 2, lineHeight: 1.5 }}>{it.note}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Full breakdown grid                                                 */
/* ------------------------------------------------------------------ */

function BreakdownCard({ data }) {
  return (
    <Card>
      <CardHeader icon={Info} title="All categories" />
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
        {data.map((d) => (
          <div key={d.category}>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text }}>{d.category}</span>
              <span style={{ fontFamily: fontMono, fontSize: 11.5, color: C.textMuted }}>{d.score}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.score}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: scoreColor(d.score) }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary stat row                                                    */
/* ------------------------------------------------------------------ */

function SummaryStats({ data }) {
  const avg = Math.round(data.reduce((s, d) => s + d.score, 0) / data.length);
  const strongest = [...data].sort((a, b) => b.score - a.score)[0];
  const weakest = [...data].sort((a, b) => a.score - b.score)[0];

  const items = [
    { label: "Average score", value: avg, icon: RadarIcon, color: C.amberDeep },
    { label: "Strongest area", value: strongest.category, sub: strongest.score, icon: TrendingUp, color: C.emerald },
    { label: "Weakest area", value: weakest.category, sub: weakest.score, icon: TrendingDown, color: C.red },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <Card key={it.label} className="flex items-center gap-3.5">
          <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: it.color + "18" }}>
            <it.icon size={17} style={{ color: it.color }} />
          </div>
          <div>
            <span style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 0.5, color: C.textFaint }}>{it.label.toUpperCase()}</span>
            <div className="flex items-baseline gap-1.5">
              <span style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>{it.value}</span>
              {it.sub !== undefined && <span style={{ fontFamily: fontMono, fontSize: 12, color: it.color }}>{it.sub}</span>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function SkillRadar() {
  const [compare, setCompare] = useState(false);

  const strengths = SKILLS.filter((s) => s.score >= 75).sort((a, b) => b.score - a.score);
  const weakAreas = SKILLS.filter((s) => s.score < 50).sort((a, b) => a.score - b.score);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Skill Radar</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          Ten categories, one chart — built from your resume, GitHub, and project analysis combined.
        </p>
      </div>

      <SummaryStats data={SKILLS} />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RadarCard data={SKILLS} compare={compare} setCompare={setCompare} />
        </div>
        <div className="flex flex-col gap-5">
          <HighlightCard icon={Check} title="Strengths" tone="emerald" items={strengths} />
          <HighlightCard icon={AlertTriangle} title="Weak areas" tone="amber" items={weakAreas} />
        </div>
      </div>

      <BreakdownCard data={SKILLS} />
    </div>
  );
}