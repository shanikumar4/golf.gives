import { useEffect, useState } from "react";
import { Users, Leaf, Trophy, Activity, RefreshCw, AlertCircle } from "lucide-react";
import { adminService } from "../../services/adminService";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { Button } from "../../components/ui/Button";

export function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setLoading(true);
        setError(null);

        try {
            // Run independently so one failure doesn't kill the other
            const [usersResult, dashResult] = await Promise.allSettled([
                adminService.getUsers(),
                adminService.getDashboardStats(),
            ]);

            const users = usersResult.status === "fulfilled"
                ? (usersResult.value?.users || usersResult.value || [])
                : [];

            const dash = dashResult.status === "fulfilled"
                ? (dashResult.value?.dashboard || dashResult.value || {})
                : {};

            // Log raw responses so you can see what fields your backend actually returns
            console.log("[AdminDashboard] users response:", usersResult);
            console.log("[AdminDashboard] dash response:", dashResult);

            setStats({ users, dash });
        } catch (err) {
            console.error("[AdminDashboard] unexpected error:", err);
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-white mb-1"
                        style={{ fontFamily: "var(--font-display, serif)" }}>
                        Admin Overview
                    </h1>
                    <p className="text-white/50">Loading platform data…</p>
                </div>

                {/* Skeleton cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 p-6 animate-pulse"
                            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-3 w-20 rounded-full bg-white/10" />
                                <div className="h-9 w-9 rounded-xl bg-white/10" />
                            </div>
                            <div className="h-8 w-16 rounded-lg bg-white/10" />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center py-8 gap-3">
                    <Spinner size="md" />
                    <span className="text-white/40 text-sm">Fetching data from server…</span>
                </div>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-white mb-1"
                        style={{ fontFamily: "var(--font-display, serif)" }}>
                        Admin Overview
                    </h1>
                </div>
                <div
                    className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border"
                    style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
                >
                    <AlertCircle className="h-10 w-10 text-red-400" />
                    <p className="text-white/60">{error}</p>
                    <Button onClick={load} variant="secondary">
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // ── Resolve tile values safely ───────────────────────────────────────────
    // Uses fallback chain so it works regardless of what your backend returns
    const userCount = Array.isArray(stats.users) ? stats.users.length : (stats.dash?.totalUsers ?? "—");
    const activeSubs = stats.dash?.activeSubscriptions
        ?? stats.dash?.active_subscriptions
        ?? stats.dash?.subscriptions
        ?? (Array.isArray(stats.users) ? stats.users.filter((u) => u.subscription?.status === 'active')?.length : undefined)
        ?? "—";
    const charityCount = stats.dash?.totalCharities
        ?? stats.dash?.total_charities
        ?? stats.dash?.charities
        ?? "—";
    const drawCount = stats.dash?.totalDraws
        ?? stats.dash?.total_draws
        ?? stats.dash?.draws
        ?? "—";

    const colorMap = {
        blue: { bg: "rgba(59,130,246,0.1)", text: "#60a5fa" },
        green: { bg: "rgba(34,197,94,0.1)", text: "#4ade80" },
        teal: { bg: "rgba(20,184,166,0.1)", text: "#2dd4bf" },
        yellow: { bg: "rgba(234,179,8,0.1)", text: "#facc15" },
    };

    const tiles = [
        { label: "Total Users", value: userCount, icon: Users, color: "blue" },
        { label: "Active Subs", value: activeSubs, icon: Activity, color: "green" },
        { label: "Charities", value: charityCount, icon: Leaf, color: "teal" },
        { label: "Total Draws", value: drawCount, icon: Trophy, color: "yellow" },
    ];

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl text-white mb-1"
                        style={{ fontFamily: "var(--font-display, serif)" }}>
                        Admin Overview
                    </h1>
                    <p className="text-white/50">Platform health at a glance</p>
                </div>
                <Button variant="secondary" size="sm" onClick={load}>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stat Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {tiles.map(({ label, value, icon: Icon, color }) => {
                    const c = colorMap[color];
                    return (
                        <Card key={label}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white/50 text-sm">{label}</span>
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: c.bg }}
                                >
                                    <Icon className="h-4 w-4" style={{ color: c.text }} />
                                </div>
                            </div>
                            <p className="text-3xl font-semibold text-white">{value}</p>
                        </Card>
                    );
                })}
            </div>

            {/* Raw dashboard data (dev helper — remove in production) */}
            {import.meta.env.DEV && stats.dash && Object.keys(stats.dash).length > 0 && (
                <details className="rounded-xl border border-white/10 p-4">
                    <summary className="text-white/40 text-xs cursor-pointer select-none">
                        🛠 Dev: Raw dashboard response keys
                    </summary>
                    <pre className="mt-3 text-green-400 text-xs overflow-auto">
                        {JSON.stringify(stats.dash, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}