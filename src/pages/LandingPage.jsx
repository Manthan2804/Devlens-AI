import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Code2,
  FileText,
  Radar as RadarIcon,
  Target,
  Sparkles,
  ArrowRight,
  Check,
  Menu,
  X,
  ScanLine,
  GitBranch,
  GraduationCap,
  Users,
} from "lucide-react";
/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
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
};

const GRADIENT = `linear-gradient(90deg, ${C.amber} 0%, ${C.emerald} 100%)`;
const fontDisplay = "'Space Grotesk', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";

/* ------------------------------------------------------------------ */
/*  Small reusable primitives                                          */
/* ------------------------------------------------------------------ */

function GaugeArc({ value = 78, size = 120, stroke = 10, label, sub }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius * 1.5; // 270deg arc
  const offset = circumference - (display / 100) * circumference;

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(135deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={C.border}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.amber} />
            <stop offset="100%" stopColor={C.emerald} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <div style={{ marginTop: -size * 0.62 }} className="flex flex-col items-center">
        <span style={{ fontFamily: fontDisplay, color: C.text, fontSize: size * 0.26, fontWeight: 600 }}>
          {display}
        </span>
        {label && (
          <span style={{ fontFamily: fontMono, color: C.textMuted, fontSize: 10, letterSpacing: 1 }}>
            {label}
          </span>
        )}
      </div>
      {sub && (
        <span style={{ fontFamily: fontBody, color: C.textMuted, fontSize: 13, marginTop: 6 }}>{sub}</span>
      )}
    </div>
  );
}

function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.emerald} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke={C.border} strokeWidth="3" />
      <path
        d="M16 3 A13 13 0 0 1 27.25 21.5"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.5" fill="url(#logoGrad)" />
    </svg>
  );
}

function CountUp({ target, decimals = 0, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1200;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(eased * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav                                                                 */
/* ------------------------------------------------------------------ */

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Product", "How it works", "For recruiters", "Pricing"];
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: "blur(14px)",
        background: scrolled ? "rgba(10,13,20,0.75)" : "rgba(10,13,20,0.0)",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span style={{ fontFamily: fontDisplay, color: C.text, fontWeight: 600, fontSize: 17 }}>
            DevLens<span style={{ color: C.amber }}>AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              style={{ fontFamily: fontBody, color: C.textMuted, fontSize: 14 }}
              className="hover:opacity-100 transition-opacity"
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a href="#" style={{ fontFamily: fontBody, color: C.textMuted, fontSize: 14 }}>
            Sign in
          </a>
          <button
            style={{
              fontFamily: fontBody,
              background: C.text,
              color: C.bg,
              fontSize: 14,
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: 8,
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Get your score
          </button>
        </div>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} style={{ color: C.text }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}` }}
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              {links.map((l) => (
                <a key={l} href="#" style={{ fontFamily: fontBody, color: C.textMuted, fontSize: 15 }}>
                  {l}
                </a>
              ))}
              <button
                style={{
                  fontFamily: fontBody,
                  background: C.text,
                  color: C.bg,
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "10px 18px",
                  borderRadius: 8,
                }}
              >
                Get your score
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */

function ScanCard() {
  const rows = [
    { label: "Resume score", value: 82, id: "res" },
    { label: "Code2 score", value: 71, id: "git" },
    { label: "Readiness", value: 76, id: "read" },
  ];
  const [scanY, setScanY] = useState(0);
  useEffect(() => {
    let raf;
    const loop = (t) => {
      setScanY((Math.sin(t / 1400) + 1) * 50);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(18,22,31,0.7)",
        border: `1px solid ${C.borderStrong}`,
        backdropFilter: "blur(20px)",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
        width: "100%",
        maxWidth: 380,
      }}
    >
      {/* scanning beam */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: `${scanY}%`,
          height: 60,
          background: `linear-gradient(180deg, transparent, ${C.indigoSoft}, transparent)`,
        }}
      />
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <ScanLine size={15} style={{ color: C.indigo }} />
          <span style={{ fontFamily: fontMono, fontSize: 12, color: C.textMuted, letterSpacing: 0.5 }}>
            analyzing_profile.log
          </span>
        </div>
        <div className="flex gap-1.5">
          <div style={{ width: 7, height: 7, borderRadius: 99, background: C.textFaint }} />
          <div style={{ width: 7, height: 7, borderRadius: 99, background: C.textFaint }} />
          <div style={{ width: 7, height: 7, borderRadius: 99, background: C.emerald }} />
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-center gap-3 mb-5">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: C.surface2,
              border: `1px solid ${C.border}`,
            }}
            className="flex items-center justify-center"
          >
            <Code2 size={17} style={{ color: C.text }} />
          </div>
          <div>
            <div style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 600 }}>
              /priya-dev · 34 repos
            </div>
            <div style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>
              last commit 2h ago
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3">
              <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, width: 92 }}>
                {r.label}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.value}%` }}
                  transition={{ duration: 1.1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                  style={{ height: "100%", background: GRADIENT }}
                />
              </div>
              <span style={{ fontFamily: fontMono, fontSize: 12, color: C.text, width: 24, textAlign: "right" }}>
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg px-3.5 py-3 flex items-start gap-2.5"
          style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}
        >
          <Sparkles size={14} style={{ color: C.amber, marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
            <span style={{ color: C.text }}>3 quick wins found:</span> add a README to your top repo, quantify 2
            resume bullets, deploy your capstone project live.
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  const heroRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 30 });

  const onMouseMove = useCallback((e) => {
    const rect = heroRef.current.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={heroRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden"
      style={{ background: C.bg, paddingTop: 150, paddingBottom: 90 }}
    >
      {/* grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)",
          opacity: 0.5,
        }}
      />
      {/* aurora blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 480,
          height: 480,
          top: -160,
          left: "8%",
          background: C.amber,
          opacity: 0.14,
          filter: "blur(120px)",
        }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 420,
          height: 420,
          top: -80,
          right: "6%",
          background: C.indigo,
          opacity: 0.16,
          filter: "blur(120px)",
        }}
      />
      {/* mouse glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at ${glow.x}% ${glow.y}%, rgba(108,142,245,0.06), transparent 70%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6"
            style={{ border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)" }}
          >
            <div style={{ width: 6, height: 6, borderRadius: 99, background: C.emerald }} />
            <span style={{ fontFamily: fontMono, fontSize: 12, color: C.textMuted, letterSpacing: 0.3 }}>
              now reading resumes + GitHub together
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: fontDisplay,
              fontSize: "clamp(2.1rem, 4.4vw, 3.4rem)",
              fontWeight: 600,
              color: C.text,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Know if you're ready
            <br />
            before the recruiter
            <br />
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              finds out you're not.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontFamily: fontBody, fontSize: 16.5, color: C.textMuted, lineHeight: 1.6, maxWidth: 460 }}
            className="mt-5"
          >
            DevLens AI reads your resume, your GitHub, and every project in between — then tells you exactly
            what's missing, in the order that matters most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mt-8"
          >
            <button
              style={{
                fontFamily: fontBody,
                background: C.text,
                color: C.bg,
                fontSize: 14.5,
                fontWeight: 600,
                padding: "13px 22px",
                borderRadius: 9,
              }}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Analyze my profile <ArrowRight size={16} />
            </button>
            <button
              style={{
                fontFamily: fontBody,
                background: "transparent",
                color: C.text,
                fontSize: 14.5,
                fontWeight: 500,
                padding: "13px 20px",
                borderRadius: 9,
                border: `1px solid ${C.borderStrong}`,
              }}
              className="hover:bg-white/5 transition-colors"
            >
              See a sample report
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ fontFamily: fontMono, fontSize: 12, color: C.textFaint, marginTop: 18 }}
          >
            No spam. No fluff. Your readiness score in under 2 minutes.
          </motion.p>
        </div>

        <div className="flex justify-center md:justify-end">
          <ScanCard />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats strip                                                        */
/* ------------------------------------------------------------------ */

function Stats() {
  const items = [
    { value: 2, suffix: "min", label: "average scan time", decimals: 0 },
    { value: 40, suffix: "+", label: "signals read per profile", decimals: 0 },
    { value: 10, suffix: "", label: "skill categories mapped", decimals: 0 },
    { value: 1, suffix: "", label: "score recruiters see first", decimals: 0 },
  ];
  return (
    <div style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((it) => (
          <div key={it.label} className="text-center md:text-left">
            <div style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 600, color: C.text }}>
              <CountUp target={it.value} decimals={it.decimals} suffix={it.suffix} />
            </div>
            <div style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted, marginTop: 4 }}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Features bento                                                     */
/* ------------------------------------------------------------------ */

function FeatureCard({ icon: Icon, title, desc, big, accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl p-6 relative overflow-hidden ${big ? "md:col-span-2" : ""}`}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderStrong)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
    >
      <div
        className="flex items-center justify-center rounded-xl mb-5"
        style={{ width: 40, height: 40, background: accent + "18", border: `1px solid ${accent}30` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 600, color: C.text }}>{title}</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, lineHeight: 1.6 }}>
        {desc}
      </p>
    </motion.div>
  );
}

function Features() {
  return (
    <div style={{ background: C.bg }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span style={{ fontFamily: fontMono, fontSize: 12, color: C.amber, letterSpacing: 1 }}>THE MODULES</span>
          <h2
            style={{
              fontFamily: fontDisplay,
              fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
              fontWeight: 600,
              color: C.text,
              marginTop: 10,
              letterSpacing: "-0.01em",
            }}
          >
            Every signal a recruiter checks, checked first.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            icon={FileText}
            accent={C.amber}
            title="Resume analyzer"
            desc="ATS compatibility, weak bullet points, and missing skills — flagged line by line with rewrite suggestions."
          />
          <FeatureCard
            icon={Code2}
            accent={C.indigo}
            title="Code2 portfolio scan"
            desc="Commit patterns, README quality, and project diversity, read in context — not just a repo count."
          />
          <FeatureCard
            icon={Target}
            accent={C.emerald}
            title="Project quality score"
            desc="Architecture, testing, and deployment checked per project, with what to fix before it's reviewed."
          />
          <FeatureCard
            icon={Sparkles}
            accent={C.amber}
            title="AI career coach"
            desc="Type a target company. Get the missing skills, the roadmap, and the exact projects to build next."
            big
          />
          <FeatureCard
            icon={RadarIcon}
            accent={C.indigo}
            title="Skill radar"
            desc="Ten categories, one chart — from DSA to DevOps — so you know exactly where the gaps are."
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Connect",
      desc: "Upload your resume and link your GitHub. Takes about thirty seconds, nothing to configure.",
      icon: GitBranch,
    },
    {
      n: "02",
      title: "Analyze",
      desc: "DevLens reads every signal — code, commits, bullet points — and scores your profile in under 2 minutes.",
      icon: ScanLine,
    },
    {
      n: "03",
      title: "Improve",
      desc: "Get a prioritized action list, not just a grade. Fix the three things that move your score most.",
      icon: Check,
    },
  ];
  return (
    <div style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <span style={{ fontFamily: fontMono, fontSize: 12, color: C.amber, letterSpacing: 1 }}>THE PROCESS</span>
        <h2
          style={{
            fontFamily: fontDisplay,
            fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
            fontWeight: 600,
            color: C.text,
            marginTop: 10,
            marginBottom: 50,
          }}
        >
          Three steps. No guesswork.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div
            className="hidden md:block absolute top-6 left-0 right-0"
            style={{ height: 1, background: C.border, marginLeft: "16.6%", marginRight: "16.6%" }}
          />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span
                  style={{
                    fontFamily: fontMono,
                    fontSize: 13,
                    color: C.bg,
                    background: GRADIENT,
                    width: 26,
                    height: 26,
                    borderRadius: 99,
                  }}
                  className="flex items-center justify-center flex-shrink-0"
                >
                  {s.n.slice(1)}
                </span>
                <s.icon size={16} style={{ color: C.textMuted }} />
              </div>
              <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: C.text }}>{s.title}</h3>
              <p style={{ fontFamily: fontBody, fontSize: 14, color: C.textMuted, marginTop: 8, lineHeight: 1.6, maxWidth: 300 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Audience toggle                                                     */
/* ------------------------------------------------------------------ */

function Audience() {
  const [tab, setTab] = useState("students");
  const content = {
    students: {
      icon: GraduationCap,
      title: "Find the 3 things holding your resume back — before a recruiter does.",
      points: [
        "See your interview readiness score across five tiers, from Beginner to Top Candidate",
        "Get a week-by-week roadmap toward the role you actually want",
        "Know which project to build next, not just which skill to learn",
      ],
    },
    recruiters: {
      icon: Users,
      title: "Skip the guesswork. See a readiness score instead of a wall of repos.",
      points: [
        "One recruiter-friendly profile: best projects, real strengths, honest gaps",
        "A downloadable PDF report you can share across your hiring team",
        "Compare candidates on the same scale, not on resume formatting",
      ],
    },
  };
  const active = content[tab];

  return (
    <div style={{ background: C.bg }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full p-1" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            {["students", "recruiters"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontFamily: fontBody,
                  fontSize: 13.5,
                  fontWeight: 600,
                  padding: "9px 22px",
                  borderRadius: 99,
                  color: tab === t ? C.bg : C.textMuted,
                  background: tab === t ? C.text : "transparent",
                  transition: "all 0.25s ease",
                }}
              >
                {t === "students" ? "For students" : "For recruiters"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div
                className="flex items-center justify-center rounded-xl mb-6"
                style={{ width: 44, height: 44, background: C.indigoSoft }}
              >
                <active.icon size={20} style={{ color: C.indigo }} />
              </div>
              <h3
                style={{
                  fontFamily: fontDisplay,
                  fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                  fontWeight: 600,
                  color: C.text,
                  lineHeight: 1.25,
                  maxWidth: 440,
                }}
              >
                {active.title}
              </h3>
              <div className="flex flex-col gap-3.5 mt-7">
                {active.points.map((p) => (
                  <div key={p} className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ width: 18, height: 18, background: C.emerald + "20", marginTop: 2 }}
                    >
                      <Check size={11} style={{ color: C.emerald }} />
                    </div>
                    <span style={{ fontFamily: fontBody, fontSize: 14.5, color: C.textMuted, lineHeight: 1.5 }}>
                      {p}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div
                className="rounded-2xl p-8 flex items-center justify-center gap-8"
                style={{ background: C.surface, border: `1px solid ${C.border}`, width: "100%", maxWidth: 380 }}
              >
                <GaugeArc value={tab === "students" ? 76 : 88} size={130} label="SCORE" sub="Interview Ready" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <div className="relative overflow-hidden py-28" style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 700,
          height: 700,
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          background: `radial-gradient(circle, ${C.amber}14, transparent 65%)`,
          filter: "blur(40px)",
        }}
      />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <h2
          style={{
            fontFamily: fontDisplay,
            fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
            fontWeight: 600,
            color: C.text,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          Your GitHub already tells a story.
          <br />
          Let's make sure it's the right one.
        </h2>
        <p style={{ fontFamily: fontBody, fontSize: 15.5, color: C.textMuted, marginTop: 16 }}>
          Free to run. One score. Ten minutes of your time, maybe less.
        </p>
        <button
          style={{
            fontFamily: fontBody,
            background: C.text,
            color: C.bg,
            fontSize: 15,
            fontWeight: 600,
            padding: "14px 26px",
            borderRadius: 9,
          }}
          className="mt-9 inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          Get my readiness score <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <div style={{ background: C.bg }} className="py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <LogoMark size={22} />
          <span style={{ fontFamily: fontDisplay, color: C.text, fontWeight: 600, fontSize: 15 }}>
            DevLens<span style={{ color: C.amber }}>AI</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          {["Product", "Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}>
              {l}
            </a>
          ))}
        </div>
        <span style={{ fontFamily: fontMono, fontSize: 12, color: C.textFaint }}>© 2026 DevLens AI</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function DevLensLanding() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${C.amber}55; }
      `}</style>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Audience />
      <FinalCTA />
      <Footer />
    </div>
  );
}