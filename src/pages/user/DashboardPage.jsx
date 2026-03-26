import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { winnerService } from "../../services/winnerService";
import { Activity, Heart, CreditCard, Trophy, ChevronRight } from "lucide-react";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { Button } from "../../components/ui/Button";
import { formatters } from "../../utils/formatters";

export function DashboardPage() {
    
    const { user } = useAuth();
    const { dashboard, fetchDashboard, isLoadingDash, dashError } = useApp();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => { 
        if (!dashboard) fetchDashboard(); 
    }, []);

    const handleUploadProof = async (e) => {
        const file = e.target.files[0];
        if (!file || !dashboard?.latestResult) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("winnerId", dashboard.latestResult._id);

        setUploading(true);
        try {
            await winnerService.uploadProof(formData);
            toast.success("Proof uploaded successfully! Awaiting Admin verification.");
            await fetchDashboard();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload proof");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = null;
        }
    };

    if (isLoadingDash && !dashboard) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    }
    if (dashError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-white/50">{dashError}</p>
                <Button onClick={fetchDashboard} variant="secondary">Retry</Button>
            </div>
        );
    }
    
   // DashboardPage.jsx mein change karein:
const sub = dashboard?.subscription;
const scores = dashboard?.scores || [];
const charity = dashboard?.charity;
const latestDraw = dashboard?.latestDraw;
const latestResult = dashboard?.latestResult;
const history = dashboard?.participationHistory || [];

const displayPercentage = charity?.percentage || user?.charityPercentage ||  user?.percentage || 0;

    return (
        <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl md:text-3xl text-white">
                    Hello, <span className="gradient-text break-all sm:break-normal">{user?.fullName?.split(" ")[0]}</span> 👋
                </h1>
                <p className="text-white/50 mt-1">Here's your impact overview</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    icon={CreditCard} label="Subscription"
                    value={sub?.plan || "Inactive"}
                    sub={sub?.endDate || sub?.expiresAt ? `Expires ${formatters.date(sub.endDate || sub.expiresAt)}` : "Not active"}
                    variant={sub?.status === 'active' ? "success" : "muted"}
                    href="/subscription"
                />
                <StatCard
                    icon={Activity} label="Last Score"
                    value={scores[0]?.value ?? "—"}
                    sub={scores[0]?.date ? formatters.date(scores[0].date) : "No scores yet"}
                    variant="info"
                    href="/scores"
                />
                <StatCard
                    icon={Heart} label="Charity"
                    value={charity?.name || "None selected"}
                    sub={displayPercentage > 0 ? `${displayPercentage}% allocated` : "Select a charity"}
                    variant="success"
                    href="/charity"
                />
                <StatCard
                    icon={Trophy} label="Winnings"
                    value={dashboard?.totalWinnings ? formatters.currency(dashboard.totalWinnings) : "£0"}
                    sub={`${dashboard?.wins || 0} win${dashboard?.wins !== 1 ? "s" : ""} total`}
                    variant="warning"
                    href="/winnings"
                />
            </div>

            {/* Active Prize Pool Banner */}
            {dashboard?.activePrizePool > 0 && (
                <div className="bg-brand-500/10 border border-brand-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between shadow-[0_0_30px_rgba(var(--brand-500-rgb),0.2)]">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                            <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-white/60 text-sm font-medium">Upcoming Draw Jackpot</p>
                            <p className="text-white text-2xl font-display font-bold">{formatters.currency(dashboard.activePrizePool)}</p>
                        </div>
                    </div>
                    <Badge variant="success" className="mt-3 md:mt-0 animate-pulse">Active Cycle Pot</Badge>
                </div>
            )}

            {/* Latest Draw Visualizer */}
            {latestDraw && (
                <Card className={latestResult?.status !== 'lost' && latestResult?.matchCount >= 3 ? "border-brand-500/50 bg-brand-500/5" : ""}>
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-white mb-2">Latest Draw Results</h3>
                            <div className="flex items-center gap-2 mb-3">
                                {latestDraw.winningNumbers.map((n, i) => (
                                    <div key={i} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full charity-gradient shadow flex items-center justify-center border border-brand-500/20">
                                        <span className="font-display sm:text-lg text-white font-bold">{n}</span>
                                    </div>
                                ))}
                            </div>
                            <span className="text-white/40 text-xs">Drawn on {formatters.date(latestDraw.createdAt)}</span>
                        </div>
                        
                        <div className="bg-surface-muted p-5 rounded-2xl border border-white/5 flex-1 max-w-sm">
                            {!latestResult ? (
                                <p className="text-white/50 text-sm italic">You did not have an active score during this draw cycle.</p>
                            ) : latestResult.status === 'lost' ? (
                                <div className="space-y-1">
                                    <p className="text-lg font-semibold text-white/80">Better luck next time! 🏌️‍♂️</p>
                                    <p className="text-white/50 text-sm">You matched <span className="font-bold text-white">{latestResult.matchCount}</span> numbers.</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <Badge variant="success" className="mb-2 uppercase text-[10px] tracking-wide">Winner!</Badge>
                                    <p className="text-2xl font-display text-brand-400">{formatters.currency(latestResult.prize || 0)}</p>
                                    <p className="text-white/70 text-sm">You matched <span className="font-bold text-white">{latestResult.matchCount}</span> numbers!</p>
                                    <p className="text-white/40 text-xs mt-2 capitalize">Status: {latestResult.status}</p>

                                    {latestResult.status === 'rejected' && !latestResult.proofImage && (
                                        <p className="text-red-400 text-xs mt-3 flex items-center gap-1.5 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                                            <Activity className="h-4 w-4 flex-shrink-0" /> 
                                            <span>Your previous proof was rejected. Please upload a clearer image.</span>
                                        </p>
                                    )}

                                    {(latestResult.status === 'pending' || latestResult.status === 'rejected') && !latestResult.proofImage && (
                                        <div className="mt-3">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                ref={fileInputRef} 
                                                onChange={handleUploadProof} 
                                            />
                                            <Button 
                                                size="sm" 
                                                isLoading={uploading} 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full bg-brand-500 hover:bg-brand-600 text-white"
                                            >
                                                Upload Scorecard Proof
                                            </Button>
                                        </div>
                                    )}
                                    {latestResult.status === 'pending' && latestResult.proofImage && (
                                        <p className="text-brand-400 text-xs mt-3 flex items-center gap-1.5 p-2 bg-brand-500/10 rounded-lg border border-brand-500/20">
                                            <Activity className="h-3 w-3 animate-pulse" /> 
                                            Proof uploaded. Awaiting Admin verification!
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Score History</h3>
                        <Link to="/scores" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
                            Add Score <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    {scores.length === 0 ? (
                        <p className="text-white/40 text-sm py-4 text-center">No scores submitted yet</p>
                    ) : (
                        <div className="space-y-2">
                            {scores.map((s, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                                    <span className="text-white/60 text-sm">{formatters.date(s.date)}</span>
                                    <span className="text-white font-semibold">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Charity Info Elevated */}
                <Card className="border-brand-500/30 overflow-hidden relative">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="font-semibold text-white text-lg">Your Charity Impact</h3>
                        <Link to="/charity" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1 font-medium bg-brand-500/10 px-3 py-1.5 rounded-lg transition-colors hover:bg-brand-500/20">
                            Manage <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {charity ? (
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-start gap-4 p-5 rounded-2xl charity-gradient border border-brand-500/20 glass hover:scale-[1.02] transition-transform duration-300">
                                <div className="h-12 w-12 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/10">
                                    <Heart className="h-6 w-6 text-brand-400 animate-pulse-glow" fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-white font-display text-xl">{charity.name}</p>
                                    <div className="mt-2 inline-flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-md border border-white/5">
                                        <span className="text-brand-400 font-bold">{displayPercentage}%</span>
                                        <span className="text-white/60 text-sm">of any prize won goes here</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 relative z-10">
                            <div className="h-16 w-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                <Heart className="h-6 w-6 text-white/20" />
                            </div>
                            <p className="text-white/40 text-sm mb-4 max-w-xs mx-auto">No charity selected. Any potential winnings currently go fully to you.</p>
                            <Button size="sm" onClick={() => {}}>
                                <Link to="/charity">Choose a Cause</Link>
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Participation Summary */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Participation Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-surface-muted border border-white/5">
                            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Status</p>
                            <p className="text-white font-medium flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${sub?.status === 'active' ? 'bg-brand-500' : 'bg-red-500'}`}></div>
                                {sub?.status === 'active' ? "Active" : "Inactive"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-muted border border-white/5">
                            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Scores Submitted</p>
                            <p className="text-white font-medium">{scores.length} / 5</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-muted border border-white/5">
                            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Total Wins</p>
                            <p className="text-white font-medium">{dashboard?.wins || 0}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-muted border border-white/5">
                            <p className="text-white/50 text-xs uppercase tracking-wider font-semibold mb-1">Charity Given</p>
                            <p className="text-white font-medium">{formatters.currency((dashboard?.totalWinnings || 0) * (displayPercentage / 100))}</p>
                        </div>
                    </div>
                </Card>

                {/* Participation History */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Participation History</h3>
                    </div>
                    {history.length === 0 ? (
                        <p className="text-white/40 text-sm py-4 text-center">No draw history yet.</p>
                    ) : (
                        <div className="space-y-2 overflow-y-auto max-h-64 custom-scrollbar pr-2">
                            {history.map((h, i) => (
                                <div key={h._id || i} className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-white/5">
                                    <div>
                                        <p className="text-white text-sm font-medium">{formatters.date(h.createdAt)}</p>
                                        <p className="text-white/50 text-xs">Matched: {h.matchCount}/5</p>
                                    </div>
                                    <div className="text-right">
                                        {h.status !== 'lost' && h.matchCount >= 3 ? (
                                            <>
                                                <p className="text-brand-400 font-bold text-sm">{formatters.currency(h.prize || 0)}</p>
                                                <Badge variant="success" className="uppercase text-[8px]">{h.status}</Badge>
                                            </>
                                        ) : (
                                            <span className="text-white/30 text-xs uppercase font-medium tracking-wide">Lost</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, sub, variant, href }) {
    return (
        <Link to={href}>
            <Card hover className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">{label}</span>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${variant === "success" ? "bg-brand-500/15 text-brand-400" :
                        variant === "info" ? "bg-blue-500/15 text-blue-400" :
                            variant === "warning" ? "bg-yellow-500/15 text-yellow-400" :
                                "bg-white/5 text-white/30"
                        }`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <div>
                    <p className="text-2xl font-semibold text-white truncate">{value}</p>
                    <p className="text-white/40 text-xs mt-0.5">{sub}</p>
                </div>
            </Card>
        </Link>
    );
}