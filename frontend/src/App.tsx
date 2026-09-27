import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { DemandRadarPage } from './pages/DemandRadarPage';
import { PublicTransparencyPage } from './pages/PublicTransparencyPage';
import { HelpFaqsPage } from './pages/HelpFaqsPage';
import { PlatformGuidelinesPage } from './pages/PlatformGuidelinesPage';
import { ContactSupportPage } from './pages/ContactSupportPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthEntryPage } from './pages/AuthEntryPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { ChallengeStudioPage } from './pages/ChallengeStudioPage';
import { StartupProfilePage } from './pages/StartupProfilePage';
import { ApplyChallengePage } from './pages/ApplyChallengePage';
import { EvaluationWorkspacePage } from './pages/EvaluationWorkspacePage';
import { PilotSandboxPage } from './pages/PilotSandboxPage';
import { ContractsPaymentsPage } from './pages/ContractsPaymentsPage';
import { EvidenceValidationPage } from './pages/EvidenceValidationPage';
import { ProcurementScalePage } from './pages/ProcurementScalePage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { NotificationsPage } from './pages/NotificationsPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#146EF5] selection:text-white">
      {/* Navbar includes UtilityBar and PublicHeader */}
      <Navbar />

      {/* Main Content Container: Full Width for Landing Page, Standard Padded Container for Workspace/Subpages */}
      <div className={`flex-1 w-full ${isHomePage ? '' : 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        <main className="w-full">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
            <Route path="/public-transparency" element={<PublicTransparencyPage />} />
            <Route path="/help-faqs" element={<HelpFaqsPage />} />
            <Route path="/platform-guidelines" element={<PlatformGuidelinesPage />} />
            <Route path="/contact-support" element={<ContactSupportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth-entry" element={<AuthEntryPage />} />

            {/* Authenticated Routes with Role Guards */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/demand-radar" element={<ProtectedRoute allowedRoles={['Startup']}><DemandRadarPage /></ProtectedRoute>} />
            <Route path="/challenge-studio" element={<ProtectedRoute allowedRoles={['Government Department', 'Administrator']}><ChallengeStudioPage /></ProtectedRoute>} />
            <Route path="/startup-profile" element={<ProtectedRoute allowedRoles={['Startup', 'Administrator']}><StartupProfilePage /></ProtectedRoute>} />
            <Route path="/challenges/:id/apply" element={<ProtectedRoute allowedRoles={['Startup']}><ApplyChallengePage /></ProtectedRoute>} />
            <Route path="/evaluation-workspace" element={<ProtectedRoute allowedRoles={['Evaluator', 'Administrator']}><EvaluationWorkspacePage /></ProtectedRoute>} />
            <Route path="/pilot-sandbox" element={<ProtectedRoute allowedRoles={['Government Department', 'Startup', 'Evaluator', 'Independent Validator', 'Administrator']}><PilotSandboxPage /></ProtectedRoute>} />
            <Route path="/contracts-payments" element={<ProtectedRoute allowedRoles={['Government Department', 'Startup', 'Administrator']}><ContractsPaymentsPage /></ProtectedRoute>} />
            <Route path="/evidence-validation" element={<ProtectedRoute allowedRoles={['Independent Validator', 'Startup', 'Administrator']}><EvidenceValidationPage /></ProtectedRoute>} />
            <Route path="/procurement-scale" element={<ProtectedRoute allowedRoles={['Government Department', 'Administrator']}><ProcurementScalePage /></ProtectedRoute>} />
            <Route path="/audit-trail" element={<ProtectedRoute allowedRoles={['Government Department', 'Administrator']}><AuditTrailPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
