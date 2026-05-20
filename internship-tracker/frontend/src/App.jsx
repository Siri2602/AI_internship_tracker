import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIToolsPage from './pages/AIToolsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function AppLayout({ children }) {
  return <Sidebar>{children}</Sidebar>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes — redirect to login if not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"    element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/applications" element={<AppLayout><ApplicationsPage /></AppLayout>} />
          <Route path="/analytics"    element={<AppLayout><AnalyticsPage /></AppLayout>} />
          <Route path="/ai-tools"     element={<AppLayout><AIToolsPage /></AppLayout>} />
          <Route path="/settings"     element={<AppLayout><SettingsPage /></AppLayout>} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
