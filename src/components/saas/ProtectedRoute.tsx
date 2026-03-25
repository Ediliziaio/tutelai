import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredArea: 'admin' | 'app';
}

export const ProtectedRoute = ({ children, requiredArea }: ProtectedRouteProps) => {
  const { user, isAdmin, isCliente, tenant, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin trying to access /app → redirect to /admin
  if (requiredArea === 'app' && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Client trying to access /admin → redirect to /app
  if (requiredArea === 'admin' && isCliente) {
    return <Navigate to="/app" replace />;
  }

  // Client with incomplete onboarding → redirect to /onboarding (unless already there)
  if (requiredArea === 'app' && isCliente && tenant && !tenant.onboarding_completato && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
