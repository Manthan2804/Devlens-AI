import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Upload, Link2, AlertTriangle, RefreshCw, Sparkles, ArrowRight } from "lucide-react";

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

function Badge({ children, tone = "amber" }) {
  const map = {
    amber: { bg: "rgba(232,147,58,0.14)", fg: C.amberDeep },
    rose: { bg: "rgba(217,100,122,0.14)", fg: C.rose },
    emerald: { bg: "rgba(31,157,111,0.14)", fg: C.emerald },
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

function ScoreCard({ label, value, accent, state }) {
  if (state === "loading") {
    return (
      <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 14px 36px -26px rgba(20,18,14,0.2)" }}>
        <Skeleton w={90} h={11} />
        <div className="mt-4"><Skeleton w={60} h={28} /></div>
        <div className="mt-4"><Skeleton w="100%" h={6} r={99} /></div>
      </div>
    );
  }
  const hasData = state === "data";
  return (
    <div
      className="rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
      style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 14px 36px -26px rgba(20,18,14,0.2)" }}
    >
      <span style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 0.6, color: C.textFaint }}>{label.toUpperCase()}</span>
      <div className="flex items-baseline gap-1.5 mt-3">
        <span style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, color: hasData ? C.text : C.textFaint }}>
          {hasData ? value : "—"}
        </span>
        {hasData && <span style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}>/100</span>}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mt-4" style={{ background: C.surface2 }}>
        <div style={{ height: "100%", width: hasData ? `${value}%` : "0%", background: accent, transition: "width 0.6s ease" }} />
      </div>
      {!hasData && <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint, marginTop: 10 }}>Not connected yet</p>}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl flex flex-col items-center justify-center text-center px-6" style={{ background: C.surface, border: `1.5px dashed ${C.borderStrong}`, padding: "60px 24px" }}>
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 52, height: 52, background: "rgba(217,100,122,0.14)" }}>
        <Upload size={22} style={{ color: C.rose }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Nothing to analyze yet</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 360, lineHeight: 1.6 }}>
        Upload a resume and connect your GitHub to see your scores, your skill radar, and your interview readiness in one place.
      </p>
      <div className="flex flex-wrap gap-3 mt-7 justify-center">
        <button className="flex items-center gap-2 transition-transform duration-200 hover:scale-105" style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: "#fff", background: C.ink, padding: "10px 18px", borderRadius: 99 }}>
          <Upload size={15} /> Upload resume
        </button>
        <button className="flex items-center gap-2 transition-transform duration-200 hover:scale-105" style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 600, color: C.text, background: "transparent", border: `1.5px solid ${C.borderStrong}`, padding: "10px 18px", borderRadius: 99 }}>
          <Link2 size={15} /> Connect GitHub
        </button>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="rounded-2xl flex flex-col items-center justify-center text-center" style={{ background: "rgba(201,74,63,0.05)", border: `1px solid rgba(201,74,63,0.28)`, padding: "60px 24px" }}>
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 52, height: 52, background: "rgba(201,74,63,0.14)" }}>
        <AlertTriangle size={22} style={{ color: C.red }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Couldn't load your analysis</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 360, lineHeight: 1.6 }}>
        The last scan didn't finish. Your resume and GitHub connection are safe — try running it again.
      </p>
      <button onClick={onRetry} className="flex items-center gap-2 mt-7 transition-transform duration-200 hover:scale-105" style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: C.text, background: C.surface, border: `1px solid ${C.borderStrong}`, padding: "10px 18px", borderRadius: 99 }}>
        <RefreshCw size={14} /> Retry analysis
      </button>
    </div>
  );
}

function InsightRow({ tone, title, desc, state }) {
  const toneColor = { amber: C.amberDeep, rose: C.rose, emerald: C.emerald }[tone];
  if (state === "loading") {
    return (
      <div className="flex items-start gap-3 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <Skeleton w={28} h={28} r={8} />
        <div className="flex-1">
          <Skeleton w="60%" h={12} />
          <div className="mt-2"><Skeleton w="90%" h={11} /></div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 28, height: 28, background: toneColor + "1c" }}>
        <Sparkles size={13} style={{ color: toneColor }} />
      </div>
      <div>
        <p style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 600 }}>{title}</p>
        <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, marginTop: 3, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

export default function Overview() {
  const { demoState } = useOutletContext();

  const scores = [
    { label: "Resume", value: 82, accent: C.amber },
    { label: "GitHub", value: 71, accent: C.rose },
    { label: "ATS", value: 88, accent: C.emerald },
    { label: "Portfolio", value: 65, accent: C.amber },
  ];
  const insights = [
    { tone: "amber", title: "Add a README to 3 top repos", desc: "Repos without a README score lower on portfolio quality." },
    { tone: "rose", title: "Quantify 2 resume bullets", desc: "Recruiters scan for numbers first — add impact metrics." },
    { tone: "emerald", title: "Deploy your capstone project", desc: "A live link adds more weight than a repo link alone." },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Welcome back, Priya</h2>
          <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
            {demoState === "empty" && "Let's get your first profile analyzed."}
            {demoState === "loading" && "Running your latest scan…"}
            {demoState === "data" && "Here's where things stand today."}
            {demoState === "error" && "Something interrupted your last scan."}
          </p>
        </div>
        <button className="flex items-center gap-2 self-start sm:self-auto transition-transform duration-200 hover:scale-105" style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: "#fff", background: C.ink, padding: "9px 16px", borderRadius: 99 }}>
          Run new scan <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((s) => (
          <ScoreCard key={s.label} label={s.label} value={s.value} accent={s.accent} state={demoState} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {demoState === "empty" && <EmptyState />}
          {demoState === "error" && <ErrorState onRetry={() => {}} />}
          {demoState === "loading" && (
            <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 14px 36px -26px rgba(20,18,14,0.2)" }}>
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
            <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 14px 36px -26px rgba(20,18,14,0.2)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 style={{ fontFamily: fontDisplay, fontSize: 15.5, fontWeight: 700, color: C.text }}>Interview readiness</h3>
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

        <div className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 14px 36px -26px rgba(20,18,14,0.2)" }}>
          <div className="flex items-center justify-between mb-1">
            <h3 style={{ fontFamily: fontDisplay, fontSize: 14.5, fontWeight: 700, color: C.text }}>AI recommendations</h3>
            {demoState === "data" && <Badge tone="rose">3 new</Badge>}
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