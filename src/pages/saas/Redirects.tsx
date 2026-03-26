import { Navigate } from 'react-router-dom';
export function AppRedirect() { return <Navigate to="/app/dashboard" replace />; }
export function AdminRedirect() { return <Navigate to="/admin/dashboard" replace />; }
