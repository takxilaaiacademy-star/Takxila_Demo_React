import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Everything except /auth needs a logged-in user, so the app opens on the login page.
export default function ProtectedRoute() {
  const { isAuthed } = useAuth();
  const loc = useLocation();
  if (!isAuthed) return <Navigate to="/auth" replace state={{ from: loc.pathname + loc.search }} />;
  return <Outlet />;
}
