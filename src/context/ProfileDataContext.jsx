import React, { createContext, useContext, useState } from "react";

const ProfileDataContext = createContext(null);

/* ------------------------------------------------------------------ */
/*  Default seed data — what the app shows before any real analysis    */
/*  has been run. Each analyzer page overwrites its slice with fresh   */
/*  results once you actually use it, via the setters below.           */
/* ------------------------------------------------------------------ */

const DEFAULT_RESUME = {
  analyzed: false,
  fileName: "priya_sharma_resume.pdf",
  scores: { resume: 82, ats: 88, grammar: 91 },
  missingSkills: ["Docker", "System Design", "CI/CD", "Unit Testing", "AWS"],
  strongBullets: [
    "Rebuilt the checkout flow for a 40K-user e-commerce app, cutting drop-off by 18%",
    "Resolved 25+ open bugs in a 60K-line React codebase, reducing crash reports by 30%",
  ],
};

const DEFAULT_GITHUB = {
  analyzed: false,
  username: "priya-dev",
  repos: 34,
  followers: 58,
  contributionsThisYear: 412,
  scores: { github: 71, readme: 58, consistency: 74, diversity: 82 },
  topLanguage: "TypeScript",
};

const DEFAULT_PROJECTS = {
  imported: false,
  items: [
    { id: "devlens-ai", name: "DevLens AI", score: 86, deployed: true },
    { id: "task-flow", name: "Task Flow", score: 61, deployed: false },
    { id: "ml-notebooks", name: "ML Notebooks", score: 39, deployed: false },
  ],
};

const DEFAULT_SKILLS = [
  { category: "Frontend", score: 84 },
  { category: "Backend", score: 61 },
  { category: "Databases", score: 58 },
  { category: "DSA", score: 45 },
  { category: "DevOps", score: 32 },
  { category: "Cloud", score: 28 },
  { category: "AI", score: 66 },
  { category: "Testing", score: 39 },
  { category: "Version Control", score: 88 },
  { category: "Problem Solving", score: 70 },
];

/* ------------------------------------------------------------------ */
/*  Derived helpers                                                     */
/* ------------------------------------------------------------------ */

function average(nums) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function ProfileDataProvider({ children }) {
  const [resume, setResumeState] = useState(DEFAULT_RESUME);
  const [github, setGithubState] = useState(DEFAULT_GITHUB);
  const [projects, setProjectsState] = useState(DEFAULT_PROJECTS);
  const [skills, setSkillsState] = useState(DEFAULT_SKILLS);

  // Each analyzer page calls these with its real (mock) results once it
  // finishes running — merges over the defaults rather than requiring the
  // caller to pass every field.
  const setResumeData = (data) => setResumeState((prev) => ({ ...prev, ...data, analyzed: true }));
  const setGithubData = (data) => setGithubState((prev) => ({ ...prev, ...data, analyzed: true }));
  const setProjectsData = (items) => setProjectsState({ imported: true, items });
  const setSkillsData = (items) => setSkillsState(items);

  const projectAvg = average(projects.items.map((p) => p.score));
  const skillAvg = average(skills.map((s) => s.score));

  // The single number Interview Readiness (and Overview) build from —
  // recomputes automatically whenever any underlying page updates its data.
  const readinessFactors = [
    { id: "resume", label: "Resume", weight: 25, score: resume.scores.resume },
    { id: "github", label: "GitHub", weight: 25, score: github.scores.github },
    { id: "projects", label: "Projects", weight: 25, score: projectAvg },
    { id: "skills", label: "Technical Skills", weight: 25, score: skillAvg },
  ];
  const readinessScore = Math.round(readinessFactors.reduce((sum, f) => sum + (f.weight * f.score) / 100, 0));

  const value = {
    resume,
    github,
    projects,
    skills,
    setResumeData,
    setGithubData,
    setProjectsData,
    setSkillsData,
    projectAvg,
    skillAvg,
    readinessFactors,
    readinessScore,
  };

  return <ProfileDataContext.Provider value={value}>{children}</ProfileDataContext.Provider>;
}

export function useProfileData() {
  const ctx = useContext(ProfileDataContext);
  if (!ctx) throw new Error("useProfileData must be used inside <ProfileDataProvider>");
  return ctx;
}