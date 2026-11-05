import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return <div className="loading-screen" role="status">Checking your sign-in…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
