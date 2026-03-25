import { Navigate } from 'react-router-dom';

export const AppRedirect = () => <Navigate to="/app/dashboard" replace />;
export const AdminRedirect = () => <Navigate to="/admin/dashboard" replace />;
