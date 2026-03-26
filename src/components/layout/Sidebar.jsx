import { NavLink } from "react-router-dom";
import { LayoutDashboard, Target, Heart, CreditCard, Trophy, Users, Leaf, Shuffle, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { clsx } from "clsx";
import { Link } from "react-router-dom";

const userNav = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/scores", icon: Target, label: "Scores" },
    { to: "/charity", icon: Heart, label: "Charity" },
    { to: "/subscription", icon: CreditCard, label: "Subscription" },
    { to: "/winnings", icon: Trophy, label: "Winnings" },
];
const adminNav = [
    { to: "/admin", icon: LayoutDashboard, label: "Overview" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/charities", icon: Leaf, label: "Charities" },
    { to: "/admin/draw", icon: Shuffle, label: "Draw" },
];

export function Sidebar({ isOpen, onClose }) {
    const { isAdmin } = useAuth();
    const nav = isAdmin ? adminNav : userNav;

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

            <aside className={clsx(
                "fixed top-0 left-0 h-full w-64 bg-surface border-r border-surface-border z-40",
                "flex flex-col transition-transform duration-300",
                "lg:translate-x-0 lg:static lg:z-auto",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-surface-border">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center">
                            <Heart className="h-4 w-4 text-white" fill="white" />
                        </div>
                        <span className="font-display text-lg text-white">GolfGives</span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {nav.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/dashboard" || to === "/admin"}
                            onClick={onClose}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-brand-500/15 text-brand-400 border border-brand-500/20"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {isAdmin && (
                    <div className="p-4 border-t border-surface-border">
                        <Badge className="w-full justify-center" variant="warning">Admin Mode</Badge>
                    </div>
                )}
            </aside>
        </>
    );
}

// quick inline badge
function Badge({ children, variant, className }) {
    return <span className={clsx("inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", className)}>{children}</span>;
}