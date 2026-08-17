import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Download,
  AlertTriangle,
  Check,
  X,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Loader2,
  ScanLine,
  GraduationCap,
  Briefcase,
  Award,
} from "lucide-react";

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

const MOCK = {
  fileName: "priya_sharma_resume.pdf",
  pages: 1,
  scores: { resume: 82, ats: 88, grammar: 91, readinessContribution: 34 },
  profile: {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, IN",
    linkedin: "linkedin.com/in/priyasharma",
    education: [{ school: "RV College of Engineering", degree: "B.E. Computer Science", year: "2022 – 2026" }],
    experience: [
      { role: "Frontend Intern", org: "Nimbus Labs", duration: "May 2025 – Jul 2025" },
      { role: "Open Source Contributor", org: "DevTools Collective", duration: "Jan 2025 – Present" },
    ],
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL", "Git"],
    certifications: ["Meta Frontend Developer", "AWS Cloud Practitioner"],
  },
  ats: [
    { label: "Parseable format (no images/columns)", pass: true },
    { label: "Standard section headers", pass: true },
    { label: "Consistent date formatting", pass: false },
    { label: "No tables or text boxes", pass: true },
    { label: "Contact info in body text", pass: true },
  ],
  bullets: [
    {
      original: "Worked on the checkout flow for the company's e-commerce app.",
      issue: "weak",
      note: "Passive verb, no measurable impact.",
      suggestion: "Rebuilt the checkout flow for a 40K-user e-commerce app, cutting drop-off by 18%.",
    },
    {
      original: "Helped with debugging issues in the React codebase.",
      issue: "weak",
      note: "Vague scope — quantify what and how many.",
      suggestion: "Resolved 25+ open bugs in a 60K-line React codebase, reducing crash reports by 30%.",
    },
    {
      original: "Built and deployed a full-stack task management app using React and Node.js.",
      issue: "strong",
      note: "Clear scope, concrete stack, action-first.",
      suggestion: null,
    },
  ],
  missingSkills: ["Docker", "System Design", "CI/CD", "Unit Testing", "AWS"],
  actionVerbs: [
    { weak: "Worked on", strong: "Engineered" },
    { weak: "Helped with", strong: "Led" },
    { weak: "Was responsible for", strong: "Owned" },
    { weak: "Did", strong: "Executed" },
  ],
  checklist: [
    "Add measurable impact to 2 more bullet points",
    "Fix inconsistent date formatting across sections",
    "Shorten summary section to 2 lines",
    "Add a link to your deployed capstone project",
    "List Docker and one cloud platform under skills",
  ],
};

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

function ScoreCard({ label, value, accent, suffix = "/100" }) {
  return (
    <Card className="transition-transform duration-200 hover:-translate-y-0.5">
      <span style={{ fontFamily: fontMono, fontSize: 10.5, letterSpacing: 0.6, color: C.textFaint }}>{label.toUpperCase()}</span>
      <div className="flex items-baseline gap-1.5 mt-3">
        <span style={{ fontFamily: fontDisplay, fontSize: 30, fontWeight: 700, color: C.text }}>{value}</span>
        <span style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted }}>{suffix}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mt-4" style={{ background: C.surface2 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ height: "100%", background: accent }} />
      </div>
    </Card>
  );
}

function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const handleFiles = (files) => {
    if (files && files[0]) onFile(files[0]);
  };

  return (
    <Card
      className="flex flex-col items-center justify-center text-center"
      style={{ border: `1.5px dashed ${dragging ? C.amberDeep : C.borderStrong}`, background: dragging ? "rgba(232,147,58,0.06)" : C.surface, padding: "70px 24px", transition: "all 0.15s ease" }}
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center"
      >
        <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 56, height: 56, background: "rgba(217,100,122,0.14)" }}>
          <Upload size={24} style={{ color: C.rose }} />
        </div>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Drop your resume here</h3>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 340, lineHeight: 1.6 }}>
          PDF only, up to 5MB. We'll extract your skills, experience, and education, then score it against
          real ATS criteria.
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 mt-7 transition-transform duration-200 hover:scale-105"
          style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: "#fff", background: C.ink, padding: "11px 20px", borderRadius: 99 }}
        >
          <FileText size={15} /> Choose a file
        </button>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <p style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint, marginTop: 16 }}>
          Nothing is shared with recruiters until you choose to share it
        </p>
      </div>
    </Card>
  );
}

function AnalyzingState({ fileName }) {
  const steps = ["Extracting text", "Reading structure", "Scoring ATS compatibility", "Checking bullet points"];
  const [stepIdx, setStepIdx] = useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, steps.length - 1));
    }, 650);
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
        <ScanLine size={22} style={{ color: C.text }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: C.text }}>Analyzing {fileName}</h3>
      <div className="flex flex-col gap-2.5 mt-6" style={{ width: 260 }}>
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

function ErrorState({ onRetry }) {
  return (
    <Card
      className="flex flex-col items-center text-center"
      style={{ background: "rgba(201,74,63,0.05)", border: `1px solid rgba(201,74,63,0.28)`, padding: "60px 24px" }}
    >
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 52, height: 52, background: "rgba(201,74,63,0.14)" }}>
        <AlertTriangle size={22} style={{ color: C.red }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Couldn't read that file</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 340, lineHeight: 1.6 }}>
        The PDF might be scanned as an image or password-protected. Try exporting a fresh copy from Word or
        Google Docs.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 mt-7 transition-transform duration-200 hover:scale-105"
        style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: C.text, background: C.surface, border: `1px solid ${C.borderStrong}`, padding: "10px 18px", borderRadius: 99 }}
      >
        <RefreshCw size={14} /> Try another file
      </button>
    </Card>
  );
}

function ProfileCard({ profile }) {
  return (
    <Card>
      <CardHeader icon={FileText} title="Extracted profile" />
      <h4 style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, color: C.text }}>{profile.name}</h4>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
        {[
          { icon: Mail, val: profile.email },
          { icon: Phone, val: profile.phone },
          { icon: MapPin, val: profile.location },
          { icon: Briefcase, val: profile.linkedin },
        ].map((it) => (
          <div key={it.val} className="flex items-center gap-1.5">
            <it.icon size={12} style={{ color: C.textFaint }} />
            <span style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted }}>{it.val}</span>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <GraduationCap size={13} style={{ color: C.textFaint }} />
            <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, letterSpacing: 0.5 }}>EDUCATION</span>
          </div>
          {profile.education.map((e) => (
            <div key={e.school} className="mb-2">
              <p style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 500 }}>{e.degree}</p>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted }}>
                {e.school} · {e.year}
              </p>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Briefcase size={13} style={{ color: C.textFaint }} />
            <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, letterSpacing: 0.5 }}>EXPERIENCE</span>
          </div>
          {profile.experience.map((e) => (
            <div key={e.role} className="mb-2">
              <p style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 500 }}>{e.role}</p>
              <p style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted }}>
                {e.org} · {e.duration}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2.5">
          <Award size={13} style={{ color: C.textFaint }} />
          <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, letterSpacing: 0.5 }}>SKILLS &amp; CERTIFICATIONS</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span key={s} style={{ fontFamily: fontBody, fontSize: 12, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "4px 10px", borderRadius: 99 }}>
              {s}
            </span>
          ))}
          {profile.certifications.map((c) => (
            <span key={c} style={{ fontFamily: fontBody, fontSize: 12, color: C.amberDeep, background: "rgba(232,147,58,0.12)", padding: "4px 10px", borderRadius: 99 }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function BulletCard({ bullets }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <Card>
      <CardHeader
        icon={Sparkles}
        title="Bullet point analysis"
        right={<Badge tone="amber">{bullets.filter((b) => b.issue === "weak").length} need work</Badge>}
      />
      <div className="flex flex-col gap-3">
        {bullets.map((b, i) => {
          const isOpen = openIdx === i;
          const weak = b.issue === "weak";
          return (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.surface2 }}>
              <button className="w-full flex items-start gap-3 px-4 py-3.5 text-left" onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                <div className="rounded-full flex-shrink-0 mt-1" style={{ width: 8, height: 8, background: weak ? C.amber : C.emerald }} />
                <p style={{ fontFamily: fontBody, fontSize: 13, color: C.text, lineHeight: 1.5, flex: 1 }}>{b.original}</p>
                <ChevronDown
                  size={15}
                  style={{ color: C.textFaint, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1">
                      <p style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted, marginBottom: b.suggestion ? 10 : 0 }}>
                        {weak ? b.note : "This one already reads well — clear scope, strong verb, concrete stack."}
                      </p>
                      {b.suggestion && (
                        <div className="rounded-lg px-3.5 py-3 flex items-start gap-2.5" style={{ background: "rgba(31,157,111,0.06)", border: "1px solid rgba(31,157,111,0.22)" }}>
                          <Sparkles size={13} style={{ color: C.emerald, marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{b.suggestion}</p>
                        </div>
                      )}
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

function AtsCard({ items, score }) {
  return (
    <Card>
      <CardHeader icon={Check} title="ATS compatibility" right={<Badge tone="emerald">{score}/100</Badge>} />
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2.5">
            {it.pass ? <Check size={14} style={{ color: C.emerald, flexShrink: 0 }} /> : <X size={14} style={{ color: C.red, flexShrink: 0 }} />}
            <span style={{ fontFamily: fontBody, fontSize: 12.5, color: it.pass ? C.textMuted : C.text }}>{it.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MissingSkillsCard({ skills }) {
  return (
    <Card>
      <CardHeader icon={AlertTriangle} title="Missing skills" />
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span key={s} style={{ fontFamily: fontBody, fontSize: 12, color: C.amberDeep, border: `1px dashed rgba(201,111,31,0.45)`, padding: "4px 10px", borderRadius: 99 }}>
            + {s}
          </span>
        ))}
      </div>
      <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint, marginTop: 12, lineHeight: 1.5 }}>
        Common in job descriptions for roles matching your target — not found on your resume or GitHub.
      </p>
    </Card>
  );
}

function ActionVerbsCard({ verbs }) {
  return (
    <Card>
      <CardHeader icon={Sparkles} title="Action verb upgrades" />
      <div className="flex flex-col gap-2.5">
        {verbs.map((v) => (
          <div key={v.weak} className="flex items-center gap-2.5">
            <span style={{ fontFamily: fontMono, fontSize: 12, color: C.textFaint, textDecoration: "line-through" }}>{v.weak}</span>
            <ArrowRight size={12} style={{ color: C.textFaint }} />
            <span style={{ fontFamily: fontMono, fontSize: 12, color: C.emerald, fontWeight: 600 }}>{v.strong}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ChecklistCard({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <Card>
      <CardHeader
        icon={Check}
        title="Improvement checklist"
        right={<span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>{doneCount}/{items.length}</span>}
      />
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

function PageHeader({ stage, fileName, onReplace }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Resume Analyzer</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          {stage === "data" ? (
            <span style={{ fontFamily: fontMono, fontSize: 12 }}>
              {fileName} · {MOCK.pages} page
            </span>
          ) : (
            "Upload a PDF to get your ATS score, weak bullet points, and missing skills."
          )}
        </p>
      </div>
      {stage === "data" && (
        <div className="flex gap-2.5">
          <button
            onClick={onReplace}
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 600, color: C.text, background: C.surface, border: `1px solid ${C.border}`, padding: "9px 14px", borderRadius: 99 }}
          >
            <RefreshCw size={13} /> Replace
          </button>
          <button
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
            style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: "#fff", background: C.ink, padding: "9px 16px", borderRadius: 99 }}
          >
            <Download size={13} /> Export report
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [stage, setStage] = useState("empty"); // empty | analyzing | data | error
  const [fileName, setFileName] = useState("");

  const handleFile = useCallback((file) => {
    if (file.type !== "application/pdf") {
      setFileName(file.name);
      setStage("error");
      return;
    }
    setFileName(file.name);
    setStage("analyzing");
    setTimeout(() => setStage("data"), 2800);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader stage={stage} fileName={fileName} onReplace={() => setStage("empty")} />

      <AnimatePresence mode="wait">
        {stage === "empty" && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UploadZone onFile={handleFile} />
            <button
              onClick={() => {
                setFileName("scanned_resume.pdf");
                setStage("error");
              }}
              style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint, marginTop: 14 }}
            >
              (dev) preview error state →
            </button>
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalyzingState fileName={fileName} />
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState onRetry={() => setStage("empty")} />
          </motion.div>
        )}

        {stage === "data" && (
          <motion.div key="data" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard label="Resume score" value={MOCK.scores.resume} accent={GRADIENT} />
              <ScoreCard label="ATS compatibility" value={MOCK.scores.ats} accent={C.emerald} />
              <ScoreCard label="Grammar & format" value={MOCK.scores.grammar} accent={C.rose} />
              <ScoreCard label="Readiness contribution" value={MOCK.scores.readinessContribution} accent={C.amber} suffix=" pts" />
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 flex flex-col gap-5">
                <ProfileCard profile={MOCK.profile} />
                <BulletCard bullets={MOCK.bullets} />
              </div>
              <div className="flex flex-col gap-5">
                <AtsCard items={MOCK.ats} score={MOCK.scores.ats} />
                <MissingSkillsCard skills={MOCK.missingSkills} />
                <ActionVerbsCard verbs={MOCK.actionVerbs} />
                <ChecklistCard items={MOCK.checklist} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}