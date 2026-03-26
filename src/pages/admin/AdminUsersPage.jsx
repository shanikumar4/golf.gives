import { useEffect, useState } from "react";
import { Trash2, Search, RefreshCw, AlertCircle, UserX } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { formatters } from "../../utils/formatters";

export function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [search, setSearch] = useState("");
    const [rawRes, setRawRes] = useState(null); // dev debug

    const load = async () => {
        setLoading(true);
        setError(null);
        setRawRes(null);

        try {
            const res = await adminService.getUsers();

            // Log raw response so we can see exact shape
            console.log("[AdminUsers] raw response:", res);
            setRawRes(res);

            // Handle every possible response shape
            let list = [];
            if (Array.isArray(res)) list = res;
            else if (Array.isArray(res?.users)) list = res.users;
            else if (Array.isArray(res?.data)) list = res.data;
            else if (Array.isArray(res?.result)) list = res.result;
            else {
                // If none matched, log and show error
                console.warn("[AdminUsers] unexpected response shape:", res);
                setError(`Unexpected response shape. Check console. Keys: ${Object.keys(res || {}).join(", ")}`);
                setLoading(false);
                return;
            }

            setUsers(list);
            setFiltered(list);
        } catch (err) {
            console.error("[AdminUsers] API error:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Failed to load users";

            // Show specific HTTP error info
            const status = err.response?.status;
            setError(status ? `${status} — ${msg}` : msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        if (!search.trim()) { setFiltered(users); return; }
        const q = search.toLowerCase();
        setFiltered(
            users.filter((u) =>
                u.fullName?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q)
            )
        );
    }, [search, users]);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader count={null}    />
                <div className="rounded-2xl border border-white/10 p-12 flex flex-col items-center gap-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <Spinner size="lg" />
                    <p className="text-white/40 text-sm">Loading users from server…</p>
                </div>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader count={null} />

                <div className="rounded-2xl border p-10 flex flex-col items-center gap-4 text-center"
                    style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
                    <AlertCircle className="h-10 w-10 text-red-400" />
                    <div>
                        <p className="text-white font-medium mb-1">Failed to load users</p>
                        <p className="text-red-300 text-sm font-mono">{error}</p>
                    </div>
                    <Button onClick={load} variant="secondary">
                        <RefreshCw className="h-4 w-4" /> Retry
                    </Button>
                </div>

                {/* Dev debug panel */}
                {import.meta.env.DEV && rawRes && (
                    <details className="rounded-xl border border-white/10 p-4" open>
                        <summary className="text-white/40 text-xs cursor-pointer select-none">
                            🛠 Dev: Raw API response
                        </summary>
                        <pre className="mt-3 text-green-400 text-xs overflow-auto max-h-60">
                            {JSON.stringify(rawRes, null, 2)}
                        </pre>
                    </details>
                )}

                {/* Troubleshooting guide */}
                <div className="rounded-2xl border border-white/10 p-6 space-y-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <p className="text-white/60 text-sm font-medium">🔍 Troubleshooting checklist:</p>
                    <ul className="space-y-2 text-white/40 text-sm list-none">
                        <li>→ Open DevTools → Network tab → look for <code className="text-green-400">/api/admin/users</code> request</li>
                        <li>→ Check status code: <span className="text-yellow-400">401</span> = token invalid/expired, <span className="text-red-400">403</span> = not admin, <span className="text-red-400">500</span> = server error</li>
                        <li>→ Check your <code className="text-green-400">VITE_API_BASE_URL</code> in <code className="text-green-400">.env</code> is correct</li>
                        <li>→ Make sure your account has <code className="text-green-400">role: "admin"</code> in the database</li>
                    </ul>
                </div>
            </div>
        );
    }

    // ── Success ──────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <PageHeader count={users.length} />
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users…"
                            className="pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 rounded-xl outline-none transition-colors focus:border-green-500"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                            }}
                        />
                    </div>
                    <Button variant="secondary" size="sm" onClick={load}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <UserX className="h-10 w-10 text-white/20" />
                        <p className="text-white/40 text-sm">
                            {search ? `No users matching "${search}"` : "No users found"}
                        </p>
                        {search && (
                            <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                                Clear search
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    {["Name", "Email", "Role", "Joined",].map((h) => (
                                        <th key={h} className="text-left text-white/40 text-xs font-medium px-6 py-3 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => {
                                    const id = u._id || u.id;
                                    return (
                                        <tr
                                            key={id}
                                            className="border-b border-white/10 last:border-0 transition-colors"
                                            style={{ backgroundColor: "transparent" }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                        >
                                            {/* Name */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-semibold flex-shrink-0">
                                                        {u.fullName?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                    <span className="text-white text-sm font-medium">{u.fullName || "—"}</span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4 text-white/60 text-sm">{u.email || "—"}</td>

                                            {/* Role */}
                                            <td className="px-6 py-4">
                                                <Badge variant={u.role === "admin" ? "warning" : "muted"}>
                                                    {u.role || "user"}
                                                </Badge>
                                            </td>

                                            {/* Joined */}
                                            <td className="px-6 py-4 text-white/60 text-sm">
                                                {u.createdAt ? formatters.date(u.createdAt) : "—"}
                                            </td>


                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Dev debug panel */}
            {import.meta.env.DEV && (
                <details className="rounded-xl border border-white/10 p-4">
                    <summary className="text-white/40 text-xs cursor-pointer select-none">
                        🛠 Dev: Raw users response ({users.length} users)
                    </summary>
                    <pre className="mt-3 text-green-400 text-xs overflow-auto max-h-60">
                        {JSON.stringify(users.slice(0, 3), null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────────────────────────
function PageHeader({ count }) {
    return (
        <div>
            <h1 className="text-3xl text-white mb-1"
                style={{ fontFamily: "var(--font-display, serif)" }}>
                Users
            </h1>
            <p className="text-white/50">
                {count === null ? "Loading…" : `${count} registered user${count !== 1 ? "s" : ""}`}
            </p>
        </div>
    );
}