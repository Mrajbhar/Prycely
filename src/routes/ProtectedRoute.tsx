import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../features/auth/useAuth';

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Never redirect while the boot refresh is still deciding.
  if (status === 'idle') {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner className="size-6 text-brand" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    // Remember where they were headed, so login can send them back.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}