import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileDataProvider } from "./context/ProfileDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import LearningRoadmap from "./pages/LearningRoadmap";
import RecruiterPreview from "./pages/RecruiterPreview";

function App() {
  return (
    <AuthProvider>
      <ProfileDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPages />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="resume" element={<ResumeAnalyzer />} />
              <Route path="github" element={<CodePortfolio />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="coach" element={<AiCareerCoach />} />
              <Route path="radar" element={<SkillRadar />} />
              <Route path="readiness" element={<InterviewReadiness />} />
              <Route path="roadmap" element={<LearningRoadmap />} />
              <Route path="recruiter" element={<RecruiterPreview />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProfileDataProvider>
    </AuthProvider>
  );
}

export default App;