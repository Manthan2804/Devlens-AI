import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileData } from "../context/ProfileDataContext";
import {
  Users,
  Sparkles,
  Download,
  Link2,
  Check,
  Loader2,
  GitBranch,
  FileText,
  Star,
  MapPin,
  Mail,
  Eye,
  EyeOff,
  Lock,
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
/*  Mock profile data — pulled together from the other pages           */
/* ------------------------------------------------------------------ */

const STATIC_PROFILE = {
  name: "Priya Sharma",
  tagline: "Frontend-leaning Full Stack Developer",
  location: "Bengaluru, IN",
  email: "priya.sharma@email.com",
  summary:
    "A frontend-leaning full-stack developer with hands-on React and TypeScript experience, backed by a shipped, deployed AI project. Strongest in UI craft and version control discipline — currently closing gaps in cloud infrastructure and system design.",
  fallbackSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Git"],
  projectTaglines: {
    "DevLens AI": { tagline: "AI-powered portfolio analyzer", stack: ["React", "FastAPI"] },
    "Task Flow": { tagline: "Full-stack task management app", stack: ["React", "Node.js"] },
    "ML Notebooks": { tagline: "Coursework and experiments in Python", stack: ["Python"] },
  },
  resumeHighlights: [
    "Rebuilt the checkout flow for a 40K-user e-commerce app, cutting drop-off by 18%",
    "Resolved 25+ open bugs in a 60K-line React codebase, reducing crash reports by 30%",
  ],
};

function tierForScore(score) {
  if (score >= 83) return "Top Candidate";
  if (score >= 66) return "Interview Ready";
  if (score >= 46) return "Internship Ready";
  if (score >= 26) return "Improving";
  return "Beginner";
}

// Merges the qualitative shell above with real numbers from shared profile
// data — the parts that come from actually running the other analyzers.
function buildLiveProfile({ resume, github, skills, projects, readinessScore }) {
  const topSkills = skills.filter((s) => s.score >= 60).sort((a, b) => b.score - a.score).map((s) => s.category);
  const bestProjects = [...projects.items]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((p) => ({
      name: p.name,
      score: p.score,
      ...(STATIC_PROFILE.projectTaglines[p.name] || { tagline: "", stack: [] }),
    }));

  return {
    ...STATIC_PROFILE,
    readiness: { score: readinessScore, tier: tierForScore(readinessScore) },
    skills: topSkills.length ? topSkills.slice(0, 6) : STATIC_PROFILE.fallbackSkills,
    bestProjects,
    github: {
      username: github.username,
      repos: github.repos,
      followers: github.followers,
      contributions: github.contributionsThisYear,
      topLanguage: github.topLanguage,
    },
    resumeHighlights: resume.strongBullets?.length ? resume.strongBullets : STATIC_PROFILE.resumeHighlights,
  };
}

const SECTION_DEFS = [
  { id: "summary", label: "Technical Summary" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Best Projects" },
  { id: "github", label: "GitHub Highlights" },
  { id: "resume", label: "Resume Highlights" },
  { id: "readiness", label: "Interview Readiness" },
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
/*  Empty / generate state                                              */
/* ------------------------------------------------------------------ */

function GenerateState({ onGenerate }) {
  const [loading, setLoading] = useState(false);
  return (
    <Card className="flex flex-col items-center justify-center text-center" style={{ padding: "64px 24px" }}>
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 56, height: 56, background: "rgba(217,100,122,0.14)" }}>
        <Users size={24} style={{ color: C.rose }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Build your recruiter profile</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 380, lineHeight: 1.6 }}>
        One clean summary pulled from your resume, GitHub, and projects — a technical summary, your best
        work, and your readiness score, in the shape a recruiter actually wants to see.
      </p>
      <button
        onClick={() => {
          setLoading(true);
          setTimeout(onGenerate, 1600);
        }}
        disabled={loading}
        className="flex items-center gap-2 mt-7 transition-transform duration-200 hover:scale-105"
        style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: "#fff", background: C.ink, padding: "11px 20px", borderRadius: 99, opacity: loading ? 0.75 : 1 }}
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {loading ? "Writing your summary…" : "Generate recruiter preview"}
      </button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Section toggle panel                                                */
/* ------------------------------------------------------------------ */

function SectionToggles({ visible, setVisible }) {
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-5">
        <Eye size={15} style={{ color: C.textMuted }} />
        <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>What recruiters see</h3>
      </div>
      <div className="flex flex-col gap-1">
        {SECTION_DEFS.map((s) => {
          const isOn = visible[s.id];
          return (
            <button
              key={s.id}
              onClick={() => setVisible((v) => ({ ...v, [s.id]: !v[s.id] }))}
              className="flex items-center justify-between px-2 py-2.5 rounded-lg transition-colors duration-150"
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: fontBody, fontSize: 13, color: isOn ? C.text : C.textFaint }}>{s.label}</span>
              {isOn ? <Eye size={14} style={{ color: C.emerald }} /> : <EyeOff size={14} style={{ color: C.textFaint }} />}
            </button>
          );
        })}
      </div>
      <div className="flex items-start gap-2.5 mt-5 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
        <Lock size={13} style={{ color: C.textFaint, marginTop: 2, flexShrink: 0 }} />
        <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint, lineHeight: 1.5 }}>
          Nothing is public until you copy the link below. Turning a section off here hides it from
          recruiters immediately.
        </p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Share actions                                                       */
/* ------------------------------------------------------------------ */

function ShareActions() {
  const [copied, setCopied] = useState(false);
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-4">
        <Link2 size={15} style={{ color: C.textMuted }} />
        <h3 style={{ fontFamily: fontDisplay, fontSize: 15, fontWeight: 700, color: C.text }}>Share</h3>
      </div>
      <div className="rounded-lg flex items-center gap-2 px-3 py-2.5 mb-3" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: fontMono, fontSize: 11.5, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          devlens.ai/p/priya-sharma
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          className="flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 700, color: "#fff", background: C.ink, padding: "10px 16px", borderRadius: 99 }}
        >
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? "Link copied" : "Copy shareable link"}
        </button>
        <button
          className="flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          style={{ fontFamily: fontBody, fontSize: 13, fontWeight: 600, color: C.text, background: C.surface, border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 99 }}
        >
          <Download size={14} /> Download PDF report
        </button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Preview sections                                                    */
/* ------------------------------------------------------------------ */

function PreviewSection({ children }) {
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginTop: 20 }}>
      {children}
    </div>
  );
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <Icon size={13} style={{ color: C.textFaint }} />
      <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, letterSpacing: 0.6 }}>{children.toUpperCase()}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The preview card itself — framed like a real shared page            */
/* ------------------------------------------------------------------ */

function ProfilePreview({ visible, profile }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.borderStrong}`, boxShadow: "0 24px 60px -30px rgba(20,18,14,0.3)" }}>
      {/* fake browser chrome for shareability realism */}
      <div className="flex items-center gap-2 px-4" style={{ height: 42, background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex gap-1.5">
          <div style={{ width: 8, height: 8, borderRadius: 99, background: C.borderStrong }} />
          <div style={{ width: 8, height: 8, borderRadius: 99, background: C.borderStrong }} />
          <div style={{ width: 8, height: 8, borderRadius: 99, background: C.borderStrong }} />
        </div>
        <div className="flex-1 flex justify-center">
          <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>devlens.ai/p/priya-sharma</span>
        </div>
      </div>

      <div style={{ background: C.surface, padding: "32px" }}>
        {/* header — always visible */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 60, height: 60, background: GRADIENT }}>
              <span style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: "#fff" }}>PS</span>
            </div>
            <div>
              <h2 style={{ fontFamily: fontDisplay, fontSize: 21, fontWeight: 700, color: C.text }}>{profile.name}</h2>
              <p style={{ fontFamily: fontBody, fontSize: 13, color: C.textMuted, marginTop: 2 }}>{profile.tagline}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} style={{ color: C.textFaint }} />
                  <span style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint }}>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={11} style={{ color: C.textFaint }} />
                  <span style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint }}>{profile.email}</span>
                </div>
              </div>
            </div>
          </div>
          {visible.readiness && (
            <div className="flex flex-col items-end flex-shrink-0">
              <span style={{ fontFamily: fontDisplay, fontSize: 28, fontWeight: 700, color: C.text }}>{profile.readiness.score}</span>
              <Badge tone="emerald">{profile.readiness.tier}</Badge>
            </div>
          )}
        </div>

        <AnimatePresence>
          {visible.summary && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <PreviewSection>
                <SectionLabel icon={Sparkles}>Technical Summary</SectionLabel>
                <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}>{profile.summary}</p>
              </PreviewSection>
            </motion.div>
          )}

          {visible.skills && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <PreviewSection>
                <SectionLabel icon={FileText}>Skills</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span key={s} style={{ fontFamily: fontBody, fontSize: 12, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "4px 11px", borderRadius: 99 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </PreviewSection>
            </motion.div>
          )}

          {visible.projects && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <PreviewSection>
                <SectionLabel icon={Star}>Best Projects</SectionLabel>
                <div className="grid sm:grid-cols-2 gap-3">
                  {profile.bestProjects.map((p) => (
                    <div key={p.name} className="rounded-xl p-3.5" style={{ background: C.surface2, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: fontBody, fontSize: 13, color: C.text, fontWeight: 600 }}>{p.name}</span>
                        <span style={{ fontFamily: fontMono, fontSize: 12, color: C.amberDeep }}>{p.score}</span>
                      </div>
                      <p style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textMuted, marginTop: 2 }}>{p.tagline}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.stack.map((s) => (
                          <span key={s} style={{ fontFamily: fontMono, fontSize: 10, color: C.textMuted, background: C.surface, padding: "2px 7px", borderRadius: 99 }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PreviewSection>
            </motion.div>
          )}

          {visible.github && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <PreviewSection>
                <SectionLabel icon={GitBranch}>GitHub Highlights</SectionLabel>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    { label: "repos", value: profile.github.repos },
                    { label: "followers", value: profile.github.followers },
                    { label: "contributions this year", value: profile.github.contributions },
                    { label: "top language", value: profile.github.topLanguage },
                  ].map((it) => (
                    <div key={it.label}>
                      <span style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, color: C.text }}>{it.value}</span>
                      <p style={{ fontFamily: fontBody, fontSize: 11, color: C.textFaint }}>{it.label}</p>
                    </div>
                  ))}
                </div>
              </PreviewSection>
            </motion.div>
          )}

          {visible.resume && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <PreviewSection>
                <SectionLabel icon={FileText}>Resume Highlights</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {profile.resumeHighlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5">
                      <div className="rounded-full flex-shrink-0 mt-1.5" style={{ width: 5, height: 5, background: C.amberDeep }} />
                      <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </PreviewSection>
            </motion.div>
          )}
        </AnimatePresence>

        <PreviewSection>
          <div className="flex items-center justify-center gap-2">
            <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint }}>Generated by</span>
            <span style={{ fontFamily: fontDisplay, fontSize: 12, fontWeight: 700, color: C.text }}>
              DevLens<span style={{ color: C.amberDeep }}>AI</span>
            </span>
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function RecruiterPreview() {
  const [generated, setGenerated] = useState(false);
  const [visible, setVisible] = useState({
    summary: true,
    skills: true,
    projects: true,
    github: true,
    resume: true,
    readiness: true,
  });
  const profileData = useProfileData();
  const liveProfile = buildLiveProfile(profileData);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Recruiter Preview</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          {generated ? "What a recruiter sees when they open your link." : "One shareable page, built from everything DevLens knows about you."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!generated ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GenerateState onGenerate={() => setGenerated(true)} />
          </motion.div>
        ) : (
          <motion.div key="data" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <ProfilePreview visible={visible} profile={liveProfile} />
            </div>
            <div className="flex flex-col gap-5">
              <SectionToggles visible={visible} setVisible={setVisible} />
              <ShareActions />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}