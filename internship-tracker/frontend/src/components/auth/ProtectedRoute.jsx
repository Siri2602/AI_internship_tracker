import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

export function ProtectedRoute() {
  const { token } = useAuthStore();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicRoute() {
  const { token } = useAuthStore();
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
