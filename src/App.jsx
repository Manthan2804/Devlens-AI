import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardShell from "./pages/DashboardShell";
import AuthPages from "./pages/AuthPages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/dashboard" element={<DashboardShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;