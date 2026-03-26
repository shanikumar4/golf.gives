import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/user/DashboardPage";
import { ScoreEntryPage } from "../pages/user/ScoreEntryPage";
import { CharitySelectionPage } from "../pages/user/CharitySelectionPage";
import { SubscriptionPage } from "../pages/user/SubscriptionPage";
import { WinningsPage } from "../pages/user/WinningsPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { AdminCharitiesPage } from "../pages/admin/AdminCharitiesPage";
import { AdminDrawPage } from "../pages/admin/AdminDrawPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { LandingPage } from "../pages/LandingPage";

const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    {
        element: <ProtectedRoute />,
        children: [{
            element: <AppLayout />,
            children: [
                { path: "/dashboard", element: <DashboardPage /> },
                { path: "/scores", element: <ScoreEntryPage /> },
                { path: "/charity", element: <CharitySelectionPage /> },
                { path: "/subscription", element: <SubscriptionPage /> },
                { path: "/winnings", element: <WinningsPage /> },
            ],
        }],
    },
    {
        element: <ProtectedRoute adminOnly />,
        children: [{
            element: <AppLayout isAdmin />,
            children: [
                { path: "/admin", element: <AdminDashboardPage /> },
                { path: "/admin/users", element: <AdminUsersPage /> },
                { path: "/admin/charities", element: <AdminCharitiesPage /> },
                { path: "/admin/draw", element: <AdminDrawPage /> },
            ],
        }],
    },
    { path: "*", element: <NotFoundPage /> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}