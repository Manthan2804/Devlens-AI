import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardShell from "./pages/DashboardShell";
import AuthPages from "./pages/AuthPages";
import Overview from "./pages/Overview";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import CodePortfolio from "./pages/CodePortfolio";
import ProjectsPage from "./pages/ProjectsPage";
import AiCareerCoach from "./pages/AiCareerCoach";
import SkillRadar from "./pages/SkillRadar";
import InterviewReadiness from "./pages/InterviewReadiness";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/dashboard" element={<DashboardShell />}>
          <Route index element={<Overview />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="github" element={<CodePortfolio />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="coach" element={<AiCareerCoach />} />
          <Route path="radar" element={<SkillRadar />} />
          <Route path="readiness" element={<InterviewReadiness />} />
          <Route path="roadmap" element={<PlaceholderPage label="Learning Roadmap" />} />
          <Route path="recruiter" element={<PlaceholderPage label="Recruiter Preview" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;