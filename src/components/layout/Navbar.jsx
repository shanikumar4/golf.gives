import { Link, useNavigate } from "react-router-dom";
import { LogOut, Bell, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useApp } from "../../hooks/useApp";

export function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const { resetApp } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        resetApp();
        navigate("/login");
    };

    return (
        <header className="h-16 border-b border-surface-border bg-surface/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-6 gap-4">
            <button onClick={onMenuClick} className="lg:hidden text-white/50 hover:text-white">
                <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
                <button className="relative p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="h-6 w-px bg-surface-border" />
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-semibold text-sm">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:block text-sm text-white/70">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}