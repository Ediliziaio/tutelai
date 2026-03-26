import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredArea: 'app' | 'admin';
}

export function ProtectedRoute({ children, requiredArea }: ProtectedRouteProps) {
  const { user, profile, tenant, loading, impersonating } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#185FA5]" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredArea === 'admin') {
    if (profile.role !== 'superadmin') {
      return <Navigate to="/app/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // requiredArea === 'app'
  // SuperAdmin can enter app area only when impersonating a tenant
  if (profile.role === 'superadmin' && !impersonating) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirect to onboarding if not completed
  if (tenant && !tenant.onboarding_completato && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
