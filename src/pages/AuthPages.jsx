import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens — kept identical to the rest of the app              */
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
/*  Small primitives                                                    */
/* ------------------------------------------------------------------ */

function LogoMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="authLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.emerald} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill="none" stroke={C.border} strokeWidth="3" />
      <path d="M16 3 A13 13 0 0 1 27.25 21.5" fill="none" stroke="url(#authLogoGrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.5" fill="url(#authLogoGrad)" />
    </svg>
  );
}

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.92c1.7-1.57 2.68-3.88 2.68-6.64z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34C2.44 15.98 5.48 18 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72c-.18-.54-.28-1.11-.28-1.72s.1-1.18.28-1.72V4.94H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.06l3.01-2.34z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function FloatingInput({ label, type = "text", value, onChange, error, icon: Icon, showToggle, name }) {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const active = focused || (value && value.length > 0);
  const inputType = showToggle ? (reveal ? "text" : "password") : type;

  return (
    <div className="w-full">
      <div
        className="relative rounded-xl"
        style={{
          border: `1px solid ${error ? C.red : focused ? C.indigo : C.border}`,
          background: C.surface,
          transition: "border-color 0.15s ease",
        }}
      >
        <div className="flex items-center gap-2.5 px-3.5" style={{ height: 54 }}>
          <Icon size={16} style={{ color: error ? C.red : focused ? C.indigo : C.textFaint, flexShrink: 0 }} />
          <div className="relative flex-1 h-full flex items-center">
            <label
              style={{
                position: "absolute",
                left: 0,
                fontFamily: fontBody,
                color: error ? C.red : C.textFaint,
                fontSize: active ? 10.5 : 14,
                top: active ? 6 : "50%",
                transform: active ? "none" : "translateY(-50%)",
                transition: "all 0.15s ease",
                letterSpacing: active ? 0.3 : 0,
                pointerEvents: "none",
              }}
            >
              {label}
            </label>
            <input
              name={name}
              type={inputType}
              value={value}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                fontFamily: fontBody,
                fontSize: 14,
                color: C.text,
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                paddingTop: active ? 14 : 0,
              }}
            />
          </div>
          {showToggle && (
            <button type="button" onClick={() => setReveal((r) => !r)} style={{ color: C.textFaint, flexShrink: 0 }}>
              {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.red, marginTop: 6, marginLeft: 2 }}>{error}</p>
      )}
    </div>
  );
}

function RoleToggle({ role, setRole }) {
  const options = [
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "recruiter", label: "Recruiter", icon: Users },
  ];
  return (
    <div className="flex gap-2.5">
      {options.map((o) => {
        const isActive = role === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setRole(o.id)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl"
            style={{
              height: 46,
              border: `1px solid ${isActive ? C.indigo : C.border}`,
              background: isActive ? C.indigoSoft : C.surface,
              transition: "all 0.15s ease",
            }}
          >
            <o.icon size={15} style={{ color: isActive ? C.indigo : C.textMuted }} />
            <span
              style={{
                fontFamily: fontBody,
                fontSize: 13.5,
                fontWeight: 600,
                color: isActive ? C.text : C.textMuted,
              }}
            >
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ background: C.border }} />
      <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>OR</span>
      <div className="flex-1 h-px" style={{ background: C.border }} />
    </div>
  );
}

function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full"
      style={{
        fontFamily: fontBody,
        fontSize: 14.5,
        fontWeight: 600,
        color: C.bg,
        background: C.text,
        height: 48,
        borderRadius: 10,
        opacity: loading ? 0.75 : 1,
      }}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Branding panel (shared)                                             */
/* ------------------------------------------------------------------ */

function GaugeArc({ value = 76, size = 150, stroke = 11 }) {
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius * 1.5;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(135deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.25}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="authGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.emerald} />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#authGaugeGrad)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrandingPanel({ mode }) {
  const heroRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 40 });
  const onMouseMove = useCallback((e) => {
    const rect = heroRef.current.getBoundingClientRect();
    setGlow({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }, []);

  const points =
    mode === "login"
      ? [
          "Pick up right where your last scan left off",
          "Your readiness score, updated every time you push code",
          "One dashboard for resume, GitHub, and interview prep",
        ]
      : [
          "A full profile scan in under 2 minutes",
          "Know exactly what's missing before you apply",
          "Free for students — always",
        ];

  return (
    <div
      ref={heroRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden hidden lg:flex flex-col justify-between"
      style={{ background: C.bgAlt, padding: "48px 44px", height: "100%" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 30% 30%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 30%, black 10%, transparent 75%)",
          opacity: 0.5,
        }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 420, height: 420, top: -120, left: "-10%", background: C.amber, opacity: 0.16, filter: "blur(120px)" }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: 380, height: 380, bottom: -100, right: "-8%", background: C.indigo, opacity: 0.16, filter: "blur(120px)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(500px circle at ${glow.x}% ${glow.y}%, rgba(108,142,245,0.07), transparent 70%)` }}
      />

      <div className="relative flex items-center gap-2.5">
        <LogoMark />
        <span style={{ fontFamily: fontDisplay, color: C.text, fontWeight: 600, fontSize: 17 }}>
          DevLens<span style={{ color: C.amber }}>AI</span>
        </span>
      </div>

      <div className="relative">
        <div className="flex justify-center mb-8">
          <div className="relative flex flex-col items-center">
            <GaugeArc value={mode === "login" ? 84 : 62} />
            <div className="absolute flex flex-col items-center" style={{ top: "38%" }}>
              <span style={{ fontFamily: fontDisplay, fontSize: 34, fontWeight: 700, color: C.text }}>
                {mode === "login" ? 84 : 62}
              </span>
              <span style={{ fontFamily: fontMono, fontSize: 10, color: C.textMuted, letterSpacing: 1 }}>READINESS</span>
            </div>
          </div>
        </div>
        <h2
          style={{
            fontFamily: fontDisplay,
            fontSize: 24,
            fontWeight: 600,
            color: C.text,
            lineHeight: 1.3,
            maxWidth: 380,
          }}
        >
          {mode === "login" ? "Your dashboard remembers where you left off." : "Every great profile starts with one honest score."}
        </h2>
        <div className="flex flex-col gap-3 mt-7">
          {points.map((p) => (
            <div key={p} className="flex items-start gap-2.5">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 18, height: 18, background: C.emerald + "20", marginTop: 2 }}
              >
                <Check size={11} style={{ color: C.emerald }} />
              </div>
              <span style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: fontMono, fontSize: 11.5, color: C.textFaint }} className="relative">
        Built for students, engineers, and the recruiters who read their code.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Login form                                                          */
/* ------------------------------------------------------------------ */

function LoginForm({ switchMode }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.email) errs.email = "Enter your email";
    else if (!/\S+@\S+\.\S+/.test(values.email)) errs.email = "That doesn't look like a valid email";
    if (!values.password) errs.password = "Enter your password";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1200);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div
          className="rounded-full flex items-center justify-center mb-5"
          style={{ width: 52, height: 52, background: "rgba(52,211,153,0.14)" }}
        >
          <Check size={22} style={{ color: C.emerald }} />
        </div>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: C.text }}>Signed in</h3>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 6 }}>
          Taking you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FloatingInput name="email" label="Email address" icon={Mail} value={values.email} onChange={handleChange} error={errors.email} />
      <FloatingInput
        name="password"
        label="Password"
        icon={Lock}
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        showToggle
      />
      <div className="flex items-center justify-between -mt-1">
        <label className="flex items-center gap-2">
          <input type="checkbox" style={{ accentColor: C.indigo }} />
          <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted }}>Remember me</span>
        </label>
        <a href="#" style={{ fontFamily: fontBody, fontSize: 12.5, color: C.indigo }}>
          Forgot password?
        </a>
      </div>
      <PrimaryButton type="submit" loading={loading}>
        Sign in <ArrowRight size={16} />
      </PrimaryButton>
      <Divider />
      <button
        type="button"
        className="flex items-center justify-center gap-2.5 w-full"
        style={{
          fontFamily: fontBody,
          fontSize: 14,
          fontWeight: 500,
          color: C.text,
          background: C.surface,
          border: `1px solid ${C.border}`,
          height: 48,
          borderRadius: 10,
        }}
      >
        <GoogleG /> Continue with Google
      </button>
      <p style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 4 }}>
        Don't have an account?{" "}
        <button type="button" onClick={switchMode} style={{ color: C.indigo, fontWeight: 600 }}>
          Sign up
        </button>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Signup form                                                         */
/* ------------------------------------------------------------------ */

function SignupForm({ switchMode }) {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [role, setRole] = useState("student");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.name) errs.name = "Enter your full name";
    if (!values.email) errs.email = "Enter your email";
    else if (!/\S+@\S+\.\S+/.test(values.email)) errs.email = "That doesn't look like a valid email";
    if (!values.password) errs.password = "Choose a password";
    else if (values.password.length < 8) errs.password = "At least 8 characters";
    if (values.confirm !== values.password || !values.confirm) errs.confirm = "Passwords don't match";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (!agreed) {
      setErrors((e2) => ({ ...e2, terms: "Please accept the terms to continue" }));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1200);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div
          className="rounded-full flex items-center justify-center mb-5"
          style={{ width: 52, height: 52, background: "rgba(52,211,153,0.14)" }}
        >
          <Check size={22} style={{ color: C.emerald }} />
        </div>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 600, color: C.text }}>Account created</h3>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 6, maxWidth: 280 }}>
          Welcome to DevLens AI. Let's take a look at your first profile scan.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <RoleToggle role={role} setRole={setRole} />
      <FloatingInput name="name" label="Full name" icon={User} value={values.name} onChange={handleChange} error={errors.name} />
      <FloatingInput name="email" label="Email address" icon={Mail} value={values.email} onChange={handleChange} error={errors.email} />
      <FloatingInput
        name="password"
        label="Password"
        icon={Lock}
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        showToggle
      />
      <FloatingInput
        name="confirm"
        label="Confirm password"
        icon={Lock}
        value={values.confirm}
        onChange={handleChange}
        error={errors.confirm}
        showToggle
      />
      <label className="flex items-start gap-2.5 -mt-1">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ accentColor: C.indigo, marginTop: 2 }}
        />
        <span style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
          I agree to the <a href="#" style={{ color: C.indigo }}>Terms of Service</a> and{" "}
          <a href="#" style={{ color: C.indigo }}>Privacy Policy</a>
        </span>
      </label>
      {errors.terms && <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.red, marginTop: -8 }}>{errors.terms}</p>}
      <PrimaryButton type="submit" loading={loading}>
        Create account <ArrowRight size={16} />
      </PrimaryButton>
      <Divider />
      <button
        type="button"
        className="flex items-center justify-center gap-2.5 w-full"
        style={{
          fontFamily: fontBody,
          fontSize: 14,
          fontWeight: 500,
          color: C.text,
          background: C.surface,
          border: `1px solid ${C.border}`,
          height: 48,
          borderRadius: 10,
        }}
      >
        <GoogleG /> Continue with Google
      </button>
      <p style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 4 }}>
        Already have an account?{" "}
        <button type="button" onClick={switchMode} style={{ color: C.indigo, fontWeight: 600 }}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function AuthPages() {
  const [mode, setMode] = useState("login");

  return (
    <div className="grid lg:grid-cols-2" style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${C.amber}55; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <BrandingPanel mode={mode} />

      <div className="flex flex-col justify-center px-6 sm:px-14 py-14 relative">
        <a
          href="#"
          className="flex items-center gap-1.5 mb-10 lg:hidden"
          style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}
        >
          <ArrowLeft size={14} /> Back to home
        </a>
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <LogoMark />
          <span style={{ fontFamily: fontDisplay, color: C.text, fontWeight: 600, fontSize: 17 }}>
            DevLens<span style={{ color: C.amber }}>AI</span>
          </span>
        </div>

        <div className="w-full mx-auto" style={{ maxWidth: 380 }}>
          <a
            href="#"
            className="hidden lg:flex items-center gap-1.5 mb-8"
            style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}
          >
            <ArrowLeft size={14} /> Back to home
          </a>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} style={{ color: C.amber }} />
            <span style={{ fontFamily: fontMono, fontSize: 11.5, color: C.textFaint, letterSpacing: 0.5 }}>
              {mode === "login" ? "WELCOME BACK" : "GET STARTED — IT'S FREE"}
            </span>
          </div>
          <h1 style={{ fontFamily: fontDisplay, fontSize: 26, fontWeight: 600, color: C.text, marginBottom: 8 }}>
            {mode === "login" ? "Sign in to DevLens AI" : "Create your account"}
          </h1>
          <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginBottom: 28 }}>
            {mode === "login"
              ? "Pick up your readiness score right where you left it."
              : "Two minutes to your first interview readiness score."}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {mode === "login" ? (
                <LoginForm switchMode={() => setMode("signup")} />
              ) : (
                <SignupForm switchMode={() => setMode("login")} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
