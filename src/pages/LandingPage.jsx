import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { TextEffect } from "../components/core/text-effect";
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
  GitBranch,
  ScanLine,
  GraduationCap,
  Users,
  Search,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens — v3: warm cream editorial theme, replacing the      */
/*  dark SaaS look. Bold black type, soft pastel depth, dark ink       */
/*  accents for nav/buttons/contrast bands.                            */
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
  cream: "#f4efe3",
  amber: "#e8933a",
  amberDeep: "#c96f1f",
  emerald: "#1f9d6f",
  rose: "#d9647a",
};

const GRADIENT = `linear-gradient(135deg, ${C.amber} 0%, ${C.emerald} 100%)`;
const fontDisplay = "'Space Grotesk', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";

/* ------------------------------------------------------------------ */
/*  Small decorative primitives                                        */
/* ------------------------------------------------------------------ */

function LogoMark({ size = 26, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.emerald} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke={light ? "rgba(255,255,255,0.25)" : C.border} strokeWidth="3" />
      <path d="M16 3 A13 13 0 0 1 27.25 21.5" fill="none" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" />
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

function GaugeArc({ value = 78, size = 130, stroke = 11 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius * 1.5;
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
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.border} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={circumference * 0.25} strokeLinecap="round" />
        <defs>
          <linearGradient id="gaugeGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.amber} />
            <stop offset="100%" stopColor={C.emerald} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#gaugeGradLight)" strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.2s linear" }} />
      </svg>
      <div style={{ marginTop: -size * 0.62 }} className="flex flex-col items-center">
        <span style={{ fontFamily: fontDisplay, color: C.text, fontSize: size * 0.26, fontWeight: 700 }}>{display}</span>
        <span style={{ fontFamily: fontMono, color: C.textMuted, fontSize: 10, letterSpacing: 1 }}>SCORE</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Nav — flush dark bar, editorial-product style                      */
/* ------------------------------------------------------------------ */

function NavLink({ children }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative"
      style={{ fontFamily: fontBody, color: hover ? "#fff" : "rgba(255,255,255,0.68)", fontSize: 13.5, transition: "color 0.2s ease" }}
    >
      {children}
      <span
        className="absolute left-0 -bottom-1.5 h-[1.5px] w-full origin-left"
        style={{ background: GRADIENT, transform: hover ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.25s ease" }}
      />
    </a>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Product", "How it works", "For recruiters", "Pricing"];

  return (
    <motion.div
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 relative"
      style={{
        background: scrolled ? "rgba(17,16,9,0.92)" : C.ink,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 12px 34px -18px rgba(0,0,0,0.5)" : "none",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div
        className="max-w-6xl mx-auto flex items-center justify-between px-6"
        style={{ height: scrolled ? 56 : 64, transition: "height 0.3s ease" }}
      >
        <div className="hidden md:flex items-center gap-7">
          {links.slice(0, 2).map((l) => (
            <NavLink key={l}>{l}</NavLink>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex items-center gap-2 md:absolute md:left-1/2 md:-translate-x-1/2 cursor-pointer"
        >
          <div className="nav-logo-glow rounded-full">
            <LogoMark light />
          </div>
          <span style={{ fontFamily: fontDisplay, color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>
            DEVLENS<span style={{ color: C.amber }}>AI</span>
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-5">
          <button className="transition-transform duration-200 hover:scale-110" style={{ color: "rgba(255,255,255,0.7)" }}>
            <Search size={16} />
          </button>
          <button className="transition-transform duration-200 hover:scale-110" style={{ color: "rgba(255,255,255,0.7)" }}>
            <User size={16} />
          </button>
          <button
            className="transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontFamily: fontBody,
              background: C.amber,
              color: C.ink,
              fontSize: 13,
              fontWeight: 700,
              padding: "9px 18px",
              borderRadius: 99,
              boxShadow: "0 8px 22px -8px rgba(232,147,58,0.7)",
            }}
          >
            GET SCORE
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} style={{ color: "#fff" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* animated gradient hairline under the bar */}
      <div className="nav-shimmer" style={{ height: 2 }} />

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex flex-col gap-4 px-6 py-5">
              {links.map((l) => (
                <a key={l} href="#" style={{ fontFamily: fontBody, color: "rgba(255,255,255,0.75)", fontSize: 15 }}>{l}</a>
              ))}
              <button style={{ fontFamily: fontBody, background: C.amber, color: C.ink, fontSize: 14, fontWeight: 700, padding: "10px 18px", borderRadius: 99 }}>GET SCORE</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

  );
}

/* ------------------------------------------------------------------ */
/*  Hero — laptop mockup + floating score orb, scattered bold type     */
/* ------------------------------------------------------------------ */

function StatChip({ label, value, style }) {
  return (
    <div
      className="absolute rounded-full flex items-center gap-2 px-3.5 py-2"
      style={{ background: C.surface, border: `1px solid ${C.borderStrong}`, boxShadow: "0 12px 30px -12px rgba(20,18,14,0.25)", ...style }}
    >
      <div style={{ width: 6, height: 6, borderRadius: 99, background: C.emerald }} />
      <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textMuted }}>{label}</span>
      <span style={{ fontFamily: fontDisplay, fontSize: 13, color: C.text, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="relative" style={{ width: 380 }}>
      {/* screen */}
      <div
        className="relative rounded-t-2xl overflow-hidden"
        style={{ background: C.ink, padding: "16px 16px 0", boxShadow: "0 40px 80px -30px rgba(20,18,14,0.45)" }}
      >
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <div style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.25)" }} />
          <div style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.25)" }} />
          <div style={{ width: 7, height: 7, borderRadius: 99, background: C.emerald }} />
        </div>
        <div className="relative rounded-t-lg overflow-hidden" style={{ background: C.inkAlt, height: 230 }}>
          {/* abstract dashboard impression */}
          <div className="absolute inset-0 p-4 flex flex-col gap-2.5">
            <div style={{ width: "40%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.14)" }} />
            <div className="flex gap-2 mt-2">
              {[0.7, 0.45, 0.85].map((v, i) => (
                <div key={i} className="flex-1 rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ width: "60%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.18)" }} />
                  <div className="h-1.5 rounded-full mt-2.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div style={{ height: "100%", width: `${v * 100}%`, background: GRADIENT }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 rounded-lg mt-1" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
          {/* overlay big scattered type, like the reference product shots */}
          <div className="absolute" style={{ top: 14, left: 16 }}>
            <span style={{ fontFamily: fontDisplay, fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              Score.
            </span>
          </div>
          <div className="absolute" style={{ bottom: 14, right: 16, textAlign: "right" }}>
            <span style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              Ready.
            </span>
          </div>
        </div>
      </div>
      {/* base/keyboard */}
      <div
        className="relative"
        style={{
          height: 14,
          background: `linear-gradient(180deg, ${C.ink}, ${C.inkAlt})`,
          borderRadius: "0 0 8px 8px",
        }}
      />
      <div className="mx-auto" style={{ width: "42%", height: 6, background: C.inkAlt, borderRadius: "0 0 6px 6px" }} />
    </div>
  );
}

/* A tilted ring made from a masked conic-gradient — reads as a thin 3D    */
/* band circling the sphere once rotated on its X axis.                    */
function Ring({ size, tint, rotateZ }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        top: "50%",
        left: "50%",
        width: size,
        height: size,
        marginTop: -size / 2,
        marginLeft: -size / 2,
        background: `conic-gradient(from 0deg, ${tint}00, ${tint}, ${tint}00 55%, ${tint}cc, ${tint}00)`,
        WebkitMaskImage: "radial-gradient(farthest-side, transparent 60%, black 63%, black 68%, transparent 71%)",
        maskImage: "radial-gradient(farthest-side, transparent 60%, black 63%, black 68%, transparent 71%)",
        transform: `rotateX(78deg) rotateZ(${rotateZ}deg)`,
      }}
    />
  );
}

/* The interactive centerpiece — drag it to spin, or leave it and it       */
/* idles with a slow auto-rotate. The rings stand in for the three data    */
/* sources (resume / GitHub / skills) feeding the one score at the core.   */
function InteractiveObject() {
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const [rotY, setRotY] = useState(24);
  const rotYRef = useRef(24);

  useEffect(() => {
    let raf;
    const loop = () => {
      if (!draggingRef.current) {
        rotYRef.current += 0.12;
        setRotY(rotYRef.current);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    rotYRef.current += dx * 0.6;
    setRotY(rotYRef.current);
  };
  const stopDrag = () => {
    draggingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center" style={{ perspective: 1000 }}>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: 320,
          height: 320,
          transformStyle: "preserve-3d",
          transform: `rotateX(-10deg) rotateY(${rotY}deg)`,
          touchAction: "none",
        }}
      >
        <Ring size={310} tint={C.amber} rotateZ={0} />
        <Ring size={260} tint={C.rose} rotateZ={55} />
        <Ring size={212} tint={C.emerald} rotateZ={-55} />
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            top: "50%",
            left: "50%",
            width: 164,
            height: 164,
            marginTop: -82,
            marginLeft: -82,
            background: `radial-gradient(circle at 32% 28%, #fff3da, ${C.amber} 40%, ${C.emerald} 100%)`,
            boxShadow: "0 34px 70px -18px rgba(232,147,58,0.55), 0 10px 26px -6px rgba(20,18,14,0.32)",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{ width: 60, height: 42, top: 22, left: 30, background: "rgba(255,255,255,0.55)", filter: "blur(11px)" }}
          />
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: fontDisplay, fontSize: 40, fontWeight: 700, color: C.ink }}>84</span>
            <span style={{ fontFamily: fontMono, fontSize: 10.5, color: "rgba(17,16,9,0.6)", letterSpacing: 1 }}>READY</span>
          </div>
        </div>
      </div>
      <p style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, marginTop: 16, letterSpacing: 0.5 }}>
        DRAG TO EXPLORE
      </p>
      <div className="flex items-center gap-4 mt-2">
        {[
          { c: C.amber, l: "Resume" },
          { c: C.rose, l: "GitHub" },
          { c: C.emerald, l: "Skills" },
        ].map((it) => (
          <div key={it.l} className="flex items-center gap-1.5">
            <div style={{ width: 6, height: 6, borderRadius: 99, background: it.c }} />
            <span style={{ fontFamily: fontBody, fontSize: 11, color: C.textMuted }}>{it.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden" style={{ background: C.bg, paddingTop: 70, paddingBottom: 40 }}>
      {/* slow rotating soft sheen behind the headline */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 900,
          height: 900,
          top: -420,
          left: "50%",
          marginLeft: -450,
          background: `conic-gradient(from 0deg, ${C.amber}14, transparent 25%, ${C.emerald}12 50%, transparent 75%, ${C.rose}10 100%)`,
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      {/* soft pastel depth blobs, drifting slowly instead of sitting static */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 500, height: 500, top: -180, left: "10%", background: C.amber, opacity: 0.14, filter: "blur(140px)" }}
        animate={{ x: [0, 26, 0], y: [0, -18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 460, height: 460, top: -140, right: "8%", background: C.emerald, opacity: 0.14, filter: "blur(140px)" }}
        animate={{ x: [0, -22, 0], y: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 320, height: 320, bottom: -160, left: "38%", background: C.rose, opacity: 0.1, filter: "blur(130px)" }}
        animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-10">
        <TextEffect
          per="word"
          as="h1"
          preset="blur"
          delay={0.05}
          speedReveal={1.3}
          className="text-center mx-auto block"
          style={{
            fontFamily: fontDisplay,
            fontSize: "clamp(2rem, 5vw, 3.6rem)",
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 780,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Can you believe your resume is already telling recruiters this?
        </TextEffect>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mx-auto mt-5"
          style={{ fontFamily: fontBody, fontSize: 15.5, color: C.textMuted, maxWidth: 480, lineHeight: 1.6 }}
        >
          DevLens AI reads your resume and GitHub together, then hands you one honest readiness score —
          no guesswork, no fluff.
        </motion.p>
      </div>

      {/* laptop backdrop, faded and pushed behind the interactive object */}
      <div className="relative flex justify-center mt-8" style={{ opacity: 0.5, transform: "scale(0.78)" }}>
        <LaptopMockup />
      </div>

      {/* the interactive centerpiece */}
      <div className="relative flex justify-center" style={{ marginTop: -230 }}>
        <div className="relative">
          <InteractiveObject />
          <StatChip label="ATS" value="91%" style={{ top: 50, left: -120 }} />
          <StatChip label="GitHub" value="71" style={{ top: 160, right: -124 }} />
          <StatChip label="Resume" value="82" style={{ bottom: 60, left: -114 }} />
        </div>
      </div>

      {/* reflection */}
      <div className="relative flex justify-center pointer-events-none" style={{ marginTop: -6 }}>
        <div
          style={{
            width: 340,
            height: 80,
            transform: "scaleY(-1)",
            opacity: 0.14,
            maskImage: "linear-gradient(180deg, black, transparent)",
            WebkitMaskImage: "linear-gradient(180deg, black, transparent)",
            background: C.ink,
            borderRadius: "50%",
          }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 text-center mt-10">
        <p style={{ fontFamily: fontMono, fontSize: 12, color: C.textFaint, letterSpacing: 0.4 }}>
          JUST UPLOAD YOUR RESUME — IT'S THAT EASY 🎯
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button style={{ fontFamily: fontBody, background: C.ink, color: "#fff", fontSize: 14.5, fontWeight: 700, padding: "13px 24px", borderRadius: 99 }} className="flex items-center gap-2">
            Analyze my profile <ArrowRight size={16} />
          </button>
          <button style={{ fontFamily: fontBody, background: "transparent", color: C.text, fontSize: 14.5, fontWeight: 600, padding: "13px 22px", borderRadius: 99, border: `1.5px solid ${C.borderStrong}` }}>
            See a sample report
          </button>
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
    { value: 2, suffix: "min", label: "average scan time" },
    { value: 40, suffix: "+", label: "signals read per profile" },
    { value: 10, suffix: "", label: "skill categories mapped" },
    { value: 1, suffix: "", label: "score recruiters see first" },
  ];
  return (
    <div style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((it) => (
          <div key={it.label} className="text-center md:text-left">
            <div style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, color: C.text }}>
              <CountUp target={it.value} suffix={it.suffix} />
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
      style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 16px 40px -24px rgba(20,18,14,0.18)" }}
    >
      <div className="flex items-center justify-center rounded-xl mb-5" style={{ width: 40, height: 40, background: accent + "1c", border: `1px solid ${accent}35` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: C.text }}>{title}</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
  );
}

function Features() {
  return (
    <div style={{ background: C.bg }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span style={{ fontFamily: fontMono, fontSize: 12, color: C.amberDeep, letterSpacing: 1 }}>THE MODULES</span>
          <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(1.7rem, 3vw, 2.3rem)", fontWeight: 700, color: C.text, marginTop: 10, letterSpacing: "-0.01em" }}>
            Every signal a recruiter checks, checked first.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard icon={FileText} accent={C.amberDeep} title="Resume analyzer" desc="ATS compatibility, weak bullet points, and missing skills — flagged line by line with rewrite suggestions." />
          <FeatureCard icon={Code2} accent={C.rose} title="Code portfolio scan" desc="Commit patterns, README quality, and project diversity, read in context — not just a repo count." />
          <FeatureCard icon={Target} accent={C.emerald} title="Project quality score" desc="Architecture, testing, and deployment checked per project, with what to fix before it's reviewed." />
          <FeatureCard icon={Sparkles} accent={C.amberDeep} title="AI career coach" desc="Type a target company. Get the missing skills, the roadmap, and the exact projects to build next." big />
          <FeatureCard icon={RadarIcon} accent={C.rose} title="Skill radar" desc="Ten categories, one chart — from DSA to DevOps — so you know exactly where the gaps are." />
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
    { n: "01", title: "Connect", desc: "Upload your resume and link your GitHub. Takes about thirty seconds, nothing to configure.", icon: GitBranch },
    { n: "02", title: "Analyze", desc: "DevLens reads every signal — code, commits, bullet points — and scores your profile in under 2 minutes.", icon: ScanLine },
    { n: "03", title: "Improve", desc: "Get a prioritized action list, not just a grade. Fix the three things that move your score most.", icon: Check },
  ];
  return (
    <div style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <span style={{ fontFamily: fontMono, fontSize: 12, color: C.amberDeep, letterSpacing: 1 }}>THE PROCESS</span>
        <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(1.7rem, 3vw, 2.3rem)", fontWeight: 700, color: C.text, marginTop: 10, marginBottom: 50 }}>
          Three steps. No guesswork.
        </h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-0 right-0" style={{ height: 1, background: C.border, marginLeft: "16.6%", marginRight: "16.6%" }} />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontFamily: fontMono, fontSize: 13, color: "#fff", background: GRADIENT, width: 26, height: 26, borderRadius: 99 }} className="flex items-center justify-center flex-shrink-0">
                  {s.n.slice(1)}
                </span>
                <s.icon size={16} style={{ color: C.textMuted }} />
              </div>
              <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>{s.title}</h3>
              <p style={{ fontFamily: fontBody, fontSize: 14, color: C.textMuted, marginTop: 8, lineHeight: 1.6, maxWidth: 300 }}>{s.desc}</p>
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
              <button key={t} onClick={() => setTab(t)} style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, padding: "9px 22px", borderRadius: 99, color: tab === t ? "#fff" : C.textMuted, background: tab === t ? C.ink : "transparent", transition: "all 0.25s ease" }}>
                {t === "students" ? "For students" : "For recruiters"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center justify-center rounded-xl mb-6" style={{ width: 44, height: 44, background: C.rose + "1c" }}>
                <active.icon size={20} style={{ color: C.rose }} />
              </div>
              <h3 style={{ fontFamily: fontDisplay, fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", fontWeight: 700, color: C.text, lineHeight: 1.25, maxWidth: 440 }}>
                {active.title}
              </h3>
              <div className="flex flex-col gap-3.5 mt-7">
                {active.points.map((p) => (
                  <div key={p} className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 18, height: 18, background: C.emerald + "22", marginTop: 2 }}>
                      <Check size={11} style={{ color: C.emerald }} />
                    </div>
                    <span style={{ fontFamily: fontBody, fontSize: 14.5, color: C.textMuted, lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="rounded-2xl p-8 flex items-center justify-center gap-8" style={{ background: C.surface, border: `1px solid ${C.border}`, width: "100%", maxWidth: 380, boxShadow: "0 20px 50px -28px rgba(20,18,14,0.25)" }}>
                <GaugeArc value={tab === "students" ? 76 : 88} size={130} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA — dark ink band for a contrast bookend against the       */
/*  cream page                                                         */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <div className="relative overflow-hidden py-28" style={{ background: C.ink }}>
      <div className="absolute rounded-full pointer-events-none" style={{ width: 700, height: 700, top: "-30%", left: "50%", transform: "translateX(-50%)", background: `radial-gradient(circle, ${C.amber}22, transparent 65%)`, filter: "blur(40px)" }} />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(1.9rem, 4vw, 2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          Your GitHub already tells a story.
          <br />
          Let's make sure it's the right one.
        </h2>
        <p style={{ fontFamily: fontBody, fontSize: 15.5, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
          Free to run. One score. Ten minutes of your time, maybe less.
        </p>
        <button style={{ fontFamily: fontBody, background: C.amber, color: C.ink, fontSize: 15, fontWeight: 700, padding: "14px 26px", borderRadius: 99 }} className="mt-9 inline-flex items-center gap-2">
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
          <span style={{ fontFamily: fontDisplay, color: C.text, fontWeight: 700, fontSize: 15 }}>
            DevLens<span style={{ color: C.amberDeep }}>AI</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          {["Product", "Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}>{l}</a>
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

        .nav-logo-glow { transition: filter 0.3s ease; filter: drop-shadow(0 0 0 rgba(232,147,58,0)); }
        .nav-logo-glow:hover { filter: drop-shadow(0 0 10px rgba(232,147,58,0.7)); }

        .nav-shimmer {
          background: linear-gradient(90deg, transparent, ${C.amber}, ${C.emerald}, transparent);
          background-size: 200% 100%;
          animation: shimmerMove 6s linear infinite;
          opacity: 0.55;
        }
        @keyframes shimmerMove {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .grain-layer {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: multiply;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-[70] grain-layer" />
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