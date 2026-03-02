// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  // 1. Get the authentication status from our Zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 2. If the user is NOT logged in, redirect them to the Login page
  // 'replace' prevents them from going back to the protected page using the browser's back button
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they are logged in, render the requested child route (Outlet)
  return <Outlet />;
}