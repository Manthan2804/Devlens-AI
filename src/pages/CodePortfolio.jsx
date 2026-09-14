import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileData } from "../context/ProfileDataContext";
import {
  Code2,
  GitBranch,
  Star,
  GitCommit,
  BookOpen,
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
  Users as UsersIcon,
  Calendar,
  Link2,
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

const LANG_COLORS = {
  TypeScript: "#3b82f6",
  JavaScript: C.amber,
  Python: C.emerald,
  CSS: C.rose,
};
const LANG_PALETTE = [C.amber, C.emerald, C.rose, "#6366f1", "#0ea5e9", "#84cc16", "#a855f7"];
function langColor(name) {
  if (!name) return C.textFaint;
  if (LANG_COLORS[name]) return LANG_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return LANG_PALETTE[Math.abs(hash) % LANG_PALETTE.length];
}

/* ------------------------------------------------------------------ */
/*  Real GitHub API integration                                        */
/*                                                                      */
/*  Uses GitHub's public REST API — no backend or auth token needed,   */
/*  since these endpoints send CORS headers for browser use. The       */
/*  catch: unauthenticated requests are capped at 60/hour per IP, so   */
/*  each scan is kept economical (profile + repos + events + README    */
/*  checks on just the top 5 repos ≈ 8 requests total).                 */
/* ------------------------------------------------------------------ */

const GITHUB_API = "https://api.github.com";

class GithubFetchError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // "not_found" | "rate_limited" | "network" | "unknown"
  }
}

async function ghFetch(url) {
  let res;
  try {
    res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  } catch {
    throw new GithubFetchError("network", "Network error reaching GitHub.");
  }
  if (res.status === 404) throw new GithubFetchError("not_found", "Not found");
  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") throw new GithubFetchError("rate_limited", "Rate limited");
    throw new GithubFetchError("forbidden", "Forbidden");
  }
  if (!res.ok) throw new GithubFetchError("unknown", `GitHub API error ${res.status}`);
  return res.json();
}

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function timeAgo(dateStr) {
  const days = daysSince(dateStr);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

// Builds an 18-week x 7-day activity grid ending today from public events —
// GitHub's Events API only exposes recent activity (no auth = no full
// yearly calendar), so this is a real but recency-limited approximation.
function buildHeatmapFromEvents(events) {
  const counts = {};
  events.forEach((e) => {
    const day = e.created_at.slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  });
  const weeks = [];
  const today = new Date();
  for (let w = 17; w >= 0; w--) {
    const week = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + d));
      const key = date.toISOString().slice(0, 10);
      week.push(Math.min(4, counts[key] || 0));
    }
    weeks.push(week);
  }
  return weeks;
}

function buildInsights({ repos, repositories, consistencyScore, readmeHits }) {
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (repos.length >= 15) {
    strengths.push(`${repos.length} public repos show consistent, long-term activity`);
  } else if (repos.length > 0) {
    strengths.push(`${repos.length} public repo${repos.length === 1 ? "" : "s"} on your profile`);
  }

  const topStarred = [...repositories].sort((a, b) => b.stars - a.stars)[0];
  if (topStarred && topStarred.stars > 0) {
    strengths.push(`Top project "${topStarred.name}" has ${topStarred.stars} star${topStarred.stars === 1 ? "" : "s"}`);
  }

  const langSet = new Set(repos.map((r) => r.language).filter(Boolean));
  if (langSet.size >= 3) strengths.push(`Language diversity across ${langSet.size} languages`);
  if (!strengths.length) strengths.push("Profile is public and readable — a foundation to build from");

  const missingReadmeCount = readmeHits.filter((h) => !h).length;
  if (missingReadmeCount > 0) weaknesses.push(`${missingReadmeCount} of ${readmeHits.length} top repos are missing a README`);
  if (consistencyScore < 40) weaknesses.push("Commit activity shows long gaps in the recent window");
  if (!repos.some((r) => r.homepage)) weaknesses.push("No repos have a live demo link set");
  if (!weaknesses.length) weaknesses.push("No major gaps found in the signals we can check publicly");

  if (missingReadmeCount > 0) suggestions.push(`Add a README to your ${missingReadmeCount} repo${missingReadmeCount === 1 ? "" : "s"} missing one`);
  suggestions.push("Pin your strongest repos to your GitHub profile");
  if (consistencyScore < 50) suggestions.push("Commit more regularly — recruiters read consistency almost as much as volume");
  if (!repos.some((r) => r.homepage)) suggestions.push("Add a live demo link to at least one project");

  return { strengths, weaknesses, suggestions };
}

async function fetchGithubProfile(rawUsername) {
  const username = rawUsername.replace(/^@/, "").trim();
  const user = await ghFetch(`${GITHUB_API}/users/${username}`);

  const reposRaw = await ghFetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=pushed`);
  const repos = (Array.isArray(reposRaw) ? reposRaw : []).filter((r) => !r.fork);

  let events = [];
  try {
    const ev = await ghFetch(`${GITHUB_API}/users/${username}/events/public?per_page=100`);
    events = Array.isArray(ev) ? ev : [];
  } catch {
    events = []; // events endpoint failing shouldn't sink the whole scan
  }

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 5);

  const readmeHits = await Promise.all(
    topRepos.map(async (r) => {
      try {
        const res = await fetch(`${GITHUB_API}/repos/${username}/${r.name}/readme`);
        return res.ok;
      } catch {
        return false;
      }
    })
  );

  const langCounts = {};
  repos.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });
  const langEntries = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
  const totalLangRepos = langEntries.reduce((s, [, c]) => s + c, 0) || 1;
  let languages = langEntries.slice(0, 4).map(([name, count]) => ({ name, pct: Math.round((count / totalLangRepos) * 100) }));
  const otherPct = 100 - languages.reduce((s, l) => s + l.pct, 0);
  if (otherPct > 0 && langEntries.length > 4) languages.push({ name: "Other", pct: otherPct });
  if (!languages.length) languages = [{ name: "No public repos with a set language", pct: 100 }];

  const activeDays = new Set(events.map((e) => e.created_at.slice(0, 10)));
  const observedWindowDays = 60; // conservative — Events API doesn't guarantee a full 90-day history
  const consistencyScore = Math.min(100, Math.round((activeDays.size / observedWindowDays) * 100));

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const repoScore = Math.min(100, Math.round((repos.length / 30) * 100));
  const popularityScore = Math.min(100, Math.round(user.followers * 2 + totalStars * 1.5));
  const readmeScore = readmeHits.length ? Math.round((readmeHits.filter(Boolean).length / readmeHits.length) * 100) : 0;
  const diversityScore = Math.min(100, langEntries.length * 15);
  const githubScore = Math.round(repoScore * 0.25 + popularityScore * 0.25 + consistencyScore * 0.3 + readmeScore * 0.2);

  const repositories = topRepos.map((r, i) => {
    const hasReadme = readmeHits[i];
    const score = Math.min(
      100,
      Math.round(
        (r.description ? 20 : 0) +
          (hasReadme ? 30 : 0) +
          (r.homepage ? 15 : 0) +
          Math.min(25, r.stargazers_count * 3) +
          (daysSince(r.pushed_at) < 60 ? 10 : 0)
      )
    );
    let strength = null;
    let weakness = null;
    if (score >= 65) {
      strength = hasReadme
        ? "Has a clear README and recent activity — reads well to a recruiter."
        : "Active and starred, but would score higher with a README.";
    } else {
      weakness = !hasReadme
        ? "No README — recruiters won't know what this project does or how to run it."
        : daysSince(r.pushed_at) > 150
        ? "Stale — no recent commits, and it may read as abandoned."
        : "Limited signals (no description, no live link) to show this project's quality.";
    }
    return {
      name: r.name,
      desc: r.description || "No description set",
      lang: r.language || "—",
      stars: r.stargazers_count,
      lastCommit: timeAgo(r.pushed_at),
      score,
      hasReadme,
      strength,
      weakness,
    };
  });

  const insights = buildInsights({ repos, repositories, consistencyScore, readmeHits });

  return {
    username: user.login,
    joined: new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    repos: user.public_repos,
    followers: user.followers,
    contributionsThisYear: activeDays.size, // approximation from public events, not a true yearly total
    scores: { github: githubScore, readme: readmeScore, consistency: consistencyScore, diversity: diversityScore },
    languages,
    repositories,
    heatmap: buildHeatmapFromEvents(events),
    ...insights,
  };
}

/* ------------------------------------------------------------------ */
/*  Small primitives (matches ResumeAnalyzer's local component kit)    */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Empty / connect state                                              */
/* ------------------------------------------------------------------ */

function ConnectZone({ onConnect }) {
  const [username, setUsername] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <Card className="flex flex-col items-center justify-center text-center" style={{ padding: "64px 24px" }}>
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 56, height: 56, background: "rgba(217,100,122,0.14)" }}>
        <Code2 size={24} style={{ color: C.rose }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>Connect your GitHub</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 380, lineHeight: 1.6 }}>
        We'll read your repos, commit patterns, and README quality — not just a star count. Nothing is
        posted or changed on your account.
      </p>

      <button
        disabled
        title="OAuth requires a backend to hold the client secret — use the username field below for now"
        className="flex items-center gap-2 mt-7"
        style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: C.textFaint, background: C.surface2, padding: "11px 20px", borderRadius: 99, cursor: "not-allowed" }}
      >
        <Link2 size={15} /> Connect with GitHub OAuth (coming soon)
      </button>

      <div className="flex items-center gap-3 my-5" style={{ width: 280, maxWidth: "100%" }}>
        <div className="flex-1 h-px" style={{ background: C.border }} />
        <span style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint }}>OR</span>
        <div className="flex-1 h-px" style={{ background: C.border }} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (username.trim()) onConnect(username.trim());
        }}
        className="flex items-center gap-2.5"
        style={{ width: 320, maxWidth: "100%" }}
      >
        <div
          className="flex-1 rounded-full flex items-center gap-2 px-4"
          style={{ height: 44, background: C.surface2, border: `1.5px solid ${focused ? C.amberDeep : C.border}`, transition: "border-color 0.15s ease" }}
        >
          <span style={{ fontFamily: fontMono, fontSize: 13, color: C.textFaint }}>github.com/</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="username"
            style={{ fontFamily: fontBody, fontSize: 13.5, color: C.text, background: "transparent", border: "none", outline: "none", width: "100%" }}
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
          style={{ width: 44, height: 44, background: C.text, color: "#fff", flexShrink: 0 }}
        >
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint }}>TRY:</span>
        {["torvalds", "gaearon", "sindresorhus"].map((u) => (
          <button
            key={u}
            onClick={() => onConnect(u)}
            className="transition-transform duration-200 hover:scale-105"
            style={{ fontFamily: fontMono, fontSize: 11.5, color: C.text, background: C.surface2, border: `1px solid ${C.border}`, padding: "4px 11px", borderRadius: 99 }}
          >
            @{u}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Analyzing state                                                     */
/* ------------------------------------------------------------------ */

function AnalyzingState({ username }) {
  const steps = ["Fetching repositories", "Reading commit history", "Scoring README quality", "Mapping language diversity"];
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
        <ScanLine size={22} style={{ color: C.text }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 17, fontWeight: 700, color: C.text }}>Analyzing @{username}</h3>
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

/* ------------------------------------------------------------------ */
/*  Error state                                                         */
/* ------------------------------------------------------------------ */

function ErrorState({ onRetry, title, message }) {
  return (
    <Card
      className="flex flex-col items-center text-center"
      style={{ background: "rgba(201,74,63,0.05)", border: `1px solid rgba(201,74,63,0.28)`, padding: "60px 24px" }}
    >
      <div className="rounded-full flex items-center justify-center mb-5" style={{ width: 52, height: 52, background: "rgba(201,74,63,0.14)" }}>
        <AlertTriangle size={22} style={{ color: C.red }} />
      </div>
      <h3 style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.text }}>{title || "Couldn't find that profile"}</h3>
      <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 8, maxWidth: 340, lineHeight: 1.6 }}>
        {message || "Double check the username, or make sure the profile isn't private. Public repos are all we need."}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 mt-7 transition-transform duration-200 hover:scale-105"
        style={{ fontFamily: fontBody, fontSize: 13.5, fontWeight: 700, color: C.text, background: C.surface, border: `1px solid ${C.borderStrong}`, padding: "10px 18px", borderRadius: 99 }}
      >
        <RefreshCw size={14} /> Try another username
      </button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Data state — sub components                                        */
/* ------------------------------------------------------------------ */

function ProfileSummaryCard({ data }) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{ width: 52, height: 52, background: GRADIENT }}
        >
          <span style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: "#fff" }}>
            {data.username.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 style={{ fontFamily: fontDisplay, fontSize: 16, fontWeight: 700, color: C.text }}>@{data.username}</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            <div className="flex items-center gap-1.5">
              <GitBranch size={12} style={{ color: C.textFaint }} />
              <span style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted }}>{data.repos} repos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon size={12} style={{ color: C.textFaint }} />
              <span style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted }}>{data.followers} followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} style={{ color: C.textFaint }} />
              <span style={{ fontFamily: fontBody, fontSize: 12, color: C.textMuted }}>joined {data.joined}</span>
            </div>
          </div>
        </div>
        <Badge tone="emerald">{data.contributionsThisYear} this year</Badge>
      </div>
    </Card>
  );
}

function ContributionGraphCard({ heatmap }) {
  const cellColor = (v) => {
    if (v === 0) return C.surface2;
    const stops = ["#f5d6ae", "#eab074", "#dd8a45", C.emerald];
    return stops[Math.min(v - 1, 3)];
  };
  return (
    <Card>
      <CardHeader icon={GitCommit} title="Contribution graph" right={<Badge tone="faint">last 18 weeks</Badge>} />
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {heatmap.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div key={di} style={{ width: 11, height: 11, borderRadius: 3, background: cellColor(day) }} title={`${day} contributions`} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        <span style={{ fontFamily: fontBody, fontSize: 11, color: C.textFaint }}>Less</span>
        {[0, 1, 2, 3, 4].map((v) => (
          <div key={v} style={{ width: 10, height: 10, borderRadius: 2.5, background: cellColor(v) }} />
        ))}
        <span style={{ fontFamily: fontBody, fontSize: 11, color: C.textFaint }}>More</span>
      </div>
    </Card>
  );
}

function RepoCard({ repos }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <Card>
      <CardHeader
        icon={BookOpen}
        title="Repository breakdown"
        right={<Badge tone="amber">{repos.filter((r) => !r.hasReadme).length} missing READMEs</Badge>}
      />
      <div className="flex flex-col gap-3">
        {repos.map((r, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={r.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.surface2 }}>
              <button className="w-full flex items-start gap-3 px-4 py-3.5 text-left" onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                <div className="rounded-full flex-shrink-0 mt-1.5" style={{ width: 8, height: 8, background: langColor(r.lang) }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontFamily: fontMono, fontSize: 13, color: C.text, fontWeight: 600 }}>{r.name}</span>
                    <div className="flex items-center gap-1">
                      <Star size={11} style={{ color: C.amberDeep }} />
                      <span style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textMuted }}>{r.stars}</span>
                    </div>
                    <span style={{ fontFamily: fontBody, fontSize: 11.5, color: C.textFaint }}>· {r.lastCommit}</span>
                  </div>
                  <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, marginTop: 3 }}>{r.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span style={{ fontFamily: fontMono, fontSize: 12, color: C.text }}>{r.score}</span>
                  <ChevronDown size={15} style={{ color: C.textFaint, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1">
                      {r.strength && (
                        <div className="rounded-lg px-3.5 py-3 flex items-start gap-2.5" style={{ background: "rgba(31,157,111,0.06)", border: "1px solid rgba(31,157,111,0.22)" }}>
                          <Check size={13} style={{ color: C.emerald, marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{r.strength}</p>
                        </div>
                      )}
                      {r.weakness && (
                        <div className="rounded-lg px-3.5 py-3 flex items-start gap-2.5" style={{ background: "rgba(232,147,58,0.07)", border: "1px solid rgba(232,147,58,0.22)" }}>
                          <AlertTriangle size={13} style={{ color: C.amberDeep, marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{r.weakness}</p>
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

function LanguagesCard({ languages }) {
  return (
    <Card>
      <CardHeader icon={Code2} title="Languages" />
      <div className="flex h-2.5 rounded-full overflow-hidden mb-4" style={{ background: C.surface2 }}>
        {languages.map((l) => (
          <div key={l.name} style={{ width: `${l.pct}%`, background: langColor(l.name) }} />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {languages.map((l) => (
          <div key={l.name} className="flex items-center gap-2.5">
            <div style={{ width: 8, height: 8, borderRadius: 99, background: langColor(l.name) }} />
            <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.text, flex: 1 }}>{l.name}</span>
            <span style={{ fontFamily: fontMono, fontSize: 12, color: C.textMuted }}>{l.pct}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ListCard({ icon, title, items, tone }) {
  const toneColor = { emerald: C.emerald, amber: C.amberDeep }[tone];
  const ToneIcon = tone === "emerald" ? Check : AlertTriangle;
  return (
    <Card>
      <CardHeader icon={icon} title={title} />
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <div key={it} className="flex items-start gap-2.5">
            <ToneIcon size={13} style={{ color: toneColor, marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontFamily: fontBody, fontSize: 12.5, color: C.textMuted, lineHeight: 1.55 }}>{it}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SuggestionsCard({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  const doneCount = Object.values(checked).filter(Boolean).length;
  return (
    <Card>
      <CardHeader
        icon={Sparkles}
        title="Suggestions"
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

/* ------------------------------------------------------------------ */
/*  Page header                                                         */
/* ------------------------------------------------------------------ */

function PageHeader({ stage, username, onReplace }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.text }}>Code Portfolio</h2>
        <p style={{ fontFamily: fontBody, fontSize: 13.5, color: C.textMuted, marginTop: 4 }}>
          {stage === "data" ? (
            <span style={{ fontFamily: fontMono, fontSize: 12 }}>@{username} · public repos only</span>
          ) : (
            "Connect GitHub to see commit patterns, README quality, and project diversity."
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
            <RefreshCw size={13} /> Reconnect
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

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function CodePortfolio() {
  const [stage, setStage] = useState("empty"); // empty | analyzing | data | error
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState({ title: "", message: "" });
  const { setGithubData } = useProfileData();

  const handleConnect = useCallback(
    async (name) => {
      setUsername(name);
      setStage("analyzing");
      try {
        const data = await fetchGithubProfile(name);
        setResult(data);
        setStage("data");
        setGithubData({
          username: data.username,
          repos: data.repos,
          followers: data.followers,
          contributionsThisYear: data.contributionsThisYear,
          scores: data.scores,
          topLanguage: data.languages[0]?.name,
        });
      } catch (err) {
        const kind = err?.kind || "unknown";
        if (kind === "not_found") {
          setError({ title: "Couldn't find that profile", message: `No public GitHub profile found for "${name}". Double check the username.` });
        } else if (kind === "rate_limited") {
          setError({ title: "GitHub rate limit reached", message: "Unauthenticated requests are capped at 60/hour by GitHub. Wait a bit and try again." });
        } else if (kind === "network") {
          setError({ title: "Couldn't reach GitHub", message: "Check your connection and try again." });
        } else {
          setError({ title: "Something went wrong", message: "Couldn't complete the scan — try again in a moment." });
        }
        setStage("error");
      }
    },
    [setGithubData]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader stage={stage} username={result?.username || username} onReplace={() => setStage("empty")} />

      <AnimatePresence mode="wait">
        {stage === "empty" && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ConnectZone onConnect={handleConnect} />
            <button
              onClick={() => {
                setError({ title: "Couldn't find that profile", message: 'No public GitHub profile found for "private-user". Double check the username.' });
                setStage("error");
              }}
              style={{ fontFamily: fontMono, fontSize: 11, color: C.textFaint, marginTop: 14 }}
            >
              (dev) preview error state — no API call →
            </button>
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalyzingState username={username} />
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState title={error.title} message={error.message} onRetry={() => setStage("empty")} />
          </motion.div>
        )}

        {stage === "data" && result && (
          <motion.div key="data" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard label="GitHub score" value={result.scores.github} accent={GRADIENT} />
              <ScoreCard label="README quality" value={result.scores.readme} accent={C.amber} />
              <ScoreCard label="Consistency" value={result.scores.consistency} accent={C.emerald} />
              <ScoreCard label="Project diversity" value={result.scores.diversity} accent={C.rose} />
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 flex flex-col gap-5">
                <ProfileSummaryCard data={result} />
                <ContributionGraphCard heatmap={result.heatmap} />
                <RepoCard repos={result.repositories} />
              </div>
              <div className="flex flex-col gap-5">
                <LanguagesCard languages={result.languages} />
                <ListCard icon={Check} title="Strengths" items={result.strengths} tone="emerald" />
                <ListCard icon={AlertTriangle} title="Weaknesses" items={result.weaknesses} tone="amber" />
                <SuggestionsCard items={result.suggestions} />
              </div>
            </div>

            <p style={{ fontFamily: fontMono, fontSize: 10.5, color: C.textFaint, textAlign: "center" }}>
              Scores are heuristics computed from public GitHub data — not an official rating. Activity graph
              reflects recent public events only, not a full year.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}