import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../ui/Spinner";

export function ProtectedRoute({ adminOnly = false }) {
    const { isAuthenticated, isAdmin, isInitialized } = useAuth();
    const location = useLocation();

    if (!isInitialized) return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}