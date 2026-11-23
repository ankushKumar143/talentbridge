import React from 'react';
import { useAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import RecruiterLayout from './layouts/RecruiterLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { VerifyEmail, ForgotPassword, ResetPassword } from './pages/AccountActions';

// Student Pages
import StudentOverview from './pages/student/StudentOverview';
import StudentProfile from './pages/student/StudentProfile';
import StudentResume from './pages/student/StudentResume';
import StudentFindJobs from './pages/student/StudentFindJobs';
import StudentRecommendedJobs from './pages/student/StudentRecommendedJobs';
import StudentApplications from './pages/student/StudentApplications';
import StudentSavedJobs from './pages/student/StudentSavedJobs';
import StudentSkills from './pages/student/StudentSkills';
import StudentSettings from './pages/student/StudentSettings';

// Recruiter Pages
import RecruiterOverview from './pages/recruiter/RecruiterOverview';
import RecruiterPostJob from './pages/recruiter/RecruiterPostJob';
import RecruiterManageJobs from './pages/recruiter/RecruiterManageJobs';
import RecruiterApplications from './pages/recruiter/RecruiterApplications';
import RecruiterCandidates from './pages/recruiter/RecruiterCandidates';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import RecruiterSettings from './pages/recruiter/RecruiterSettings';

function RoleGate({ role, children }) {
  const { currentUser, authLoading } = useAuth();
  if (authLoading) return <div className="min-h-screen grid place-items-center text-sm text-mute">Loading your account…</div>;
  if (!currentUser) return <Navigate to={`/login?role=${role}`} replace />;
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'student' ? '/student/overview' : '/recruiter/overview'} replace />;
  return children;
}
export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <ApplicationProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Landing & Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Student Dashboard Routes */}
                <Route path="/student" element={<RoleGate role="student"><StudentLayout /></RoleGate>}>
                  <Route index element={<Navigate to="/student/overview" replace />} />
                  <Route path="overview" element={<StudentOverview />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="resume" element={<StudentResume />} />
                  <Route path="jobs" element={<StudentFindJobs />} />
                  <Route path="recommended" element={<StudentRecommendedJobs />} />
                  <Route path="applications" element={<StudentApplications />} />
                  <Route path="saved" element={<StudentSavedJobs />} />
                  <Route path="skills" element={<StudentSkills />} />
                  <Route path="settings" element={<StudentSettings />} />
                </Route>

                {/* Recruiter Dashboard Routes */}
                <Route path="/recruiter" element={<RoleGate role="recruiter"><RecruiterLayout /></RoleGate>}>
                  <Route index element={<Navigate to="/recruiter/overview" replace />} />
                  <Route path="overview" element={<RecruiterOverview />} />
                  <Route path="jobs/new" element={<RecruiterPostJob />} />
                  <Route path="jobs" element={<RecruiterManageJobs />} />
                  <Route path="applications" element={<RecruiterApplications />} />
                  <Route path="candidates" element={<RecruiterCandidates />} />
                  <Route path="profile" element={<RecruiterProfile />} />
                  <Route path="settings" element={<RecruiterSettings />} />
                </Route>

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </ApplicationProvider>
      </JobProvider>
    </AuthProvider>
  );
}


