import { useState, useEffect } from "react";
import { Shuffle, Calculator, Coins, CheckCircle, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { drawService } from "../../services/drawService";
import { winnerService } from "../../services/winnerService";
import { configService } from "../../services/configService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { formatters } from "../../utils/formatters";

export function AdminDrawPage() {
    const [running, setRunning] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [totalPool, setTotalPool] = useState("");
    const [activeConfigPool, setActiveConfigPool] = useState(null);
    const [updatingPool, setUpdatingPool] = useState(false);
    
    const [drawData, setDrawData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await drawService.getLatest();
            setDrawData(data?.draw ? data : null);
            
            try {
                const config = await configService.get();
                setActiveConfigPool(config.activePrizePool);
                if (!totalPool) setTotalPool(config.activePrizePool); // Auto-fill distribution
            } catch (err) {
                console.warn("Config API not ready", err);
                setActiveConfigPool(0);
            }

        } catch (err) {
            toast.error("Failed to load draw data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const runDraw = async () => {
        setRunning(true);
        try {
            await drawService.run({});
            toast.success("Draw generated successfully!");
            await loadData();
        } catch (err) { toast.error(err.response?.data?.message || "Draw failed"); }
        finally { setRunning(false); }
    };

    const calculate = async () => {
        setCalculating(true);
        try {
            await winnerService.calculate({});
            toast.success("Winners calculated for latest draw!");
            await loadData();
        } catch (err) { toast.error(err.response?.data?.message || "Failed to calculate winners"); }
        finally { setCalculating(false); }
    };

    const handleSetPool = async () => {
        if (!totalPool || Number(totalPool) <= 0) return toast.error("Enter a valid amount");
        setUpdatingPool(true);
        try {
            await configService.setPool(totalPool);
            toast.success("Active Prize Pool updated for the cycle!");
            await loadData();
        } catch (error) { toast.error("Failed to update prize pool config"); }
        finally { setUpdatingPool(false); }
    };

    const verifyProof = async (winnerId, statusValue) => {
        setVerifying(winnerId);
        try {
            await winnerService.verify({ winnerId, status: statusValue });
            toast.success(`Winner ${statusValue}!`);
            await loadData();
        } catch (err) { toast.error(err.response?.data?.message || "Verification failed"); }
        finally { setVerifying(null); }
    };

    const inputStyle = {
        backgroundColor: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl text-white mb-1 font-display">Draw Management</h1>
                    <p className="text-white/50">Execute draws, calculate winners, and distribute correct prize splits</p>
                </div>
                <Button variant="secondary" onClick={loadData} isLoading={isLoading}>
                    <RefreshCcw className="h-4 w-4" /> Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actions Panel */}
                <div className="space-y-4">
                    <Card>
                        <h3 className="font-semibold text-white mb-4 flex items-center justify-between">
                            Phase 0: Set Prize Pool
                            {activeConfigPool > 0 && (
                                <Badge variant="success">Current: {formatters.currency(activeConfigPool)}</Badge>
                            )}
                        </h3>
                        <p className="text-white/50 text-sm mb-4">Declare the active monetary prize pool for the upcoming draw so users can see it.</p>
                        <div className="flex gap-2">
                            <input 
                                value={totalPool} 
                                onChange={(e) => setTotalPool(e.target.value)}
                                placeholder="Total Pool (£)" 
                                type="number"
                                className="flex-1 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-green-500 min-w-0"
                                style={inputStyle} 
                            />
                            <Button onClick={handleSetPool} isLoading={updatingPool} className="shrink-0 bg-brand-500 hover:bg-brand-600 text-white border-0">
                                Set Pool
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-white mb-4">Phase 1: Generate Draw</h3>
                        <p className="text-white/50 text-sm mb-4">Randomly draw the 5 winning numbers for this cycle. Generates a new draw record.</p>
                        <Button onClick={runDraw} isLoading={running} variant="secondary" className="w-full">
                            <Shuffle className="h-4 w-4" /> Generate New Draw
                        </Button>
                    </Card>

                    <Card>
                        <h3 className="font-semibold text-white mb-4">Phase 2: Calculate Winners</h3>
                        <p className="text-white/50 text-sm mb-4">Cross-reference all user scores against the *latest* draw numbers. Identifies 3, 4, and 5-match winners.</p>
                        <Button onClick={calculate} isLoading={calculating} variant="secondary" className="w-full">
                            <Calculator className="h-4 w-4" /> Calculate Winners (Latest Draw)
                        </Button>
                    </Card>
                </div>

                {/* Status & Dashboard View */}
                <div className="space-y-4 text-white">
                    {drawData ? (
                        <>
                            <Card className="border-brand-500/30 bg-brand-500/5 mb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-brand-400">Latest Draw Result</h3>
                                    <span className="text-white/50 text-sm">{formatters.date(drawData.draw.date || drawData.draw.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-4 justify-center py-4 bg-black/20 rounded-xl border border-white/5">
                                    {drawData.draw.winningNumbers.map((n, i) => (
                                        <div key={i} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full charity-gradient shadow shadow-brand-500/20 flex flex-col items-center justify-center border border-brand-500/20">
                                            <span className="font-display sm:text-lg text-white font-bold">{n}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm mt-4 text-center">
                                    <div className="bg-surface-muted p-2 rounded-lg border border-white/5">
                                        <p className="text-white/50 uppercase text-xs font-semibold mb-1">Total Entrants</p>
                                        <p className="text-lg font-semibold">{drawData.participants}</p>
                                    </div>
                                    <div className="bg-surface-muted p-2 rounded-lg border border-white/5">
                                        <p className="text-white/50 uppercase text-xs font-semibold mb-1">Total Winners</p>
                                        <p className="text-lg font-semibold">{drawData.winners?.length || 0}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="flex-1">
                                <h3 className="font-semibold mb-4">Calculated Winners</h3>
                                {!drawData.winners?.length ? (
                                    <p className="text-white/30 text-sm text-center py-8">No winners calculated yet or no matches found.</p>
                                ) : (
                                    <div className="space-y-2 overflow-y-auto max-h-96 pr-2 custom-scrollbar">
                                        {drawData.winners.map(w => (
                                            <div key={w._id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-sm">
                                                <div>
                                                    <p className="font-semibold">{w.user?.fullName || w.user?.name || "Unknown User"}</p>
                                                    <p className="text-white/50 text-xs mt-0.5">{w.matchCount} Matches</p>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <span className="font-bold text-brand-400">{formatters.currency(w.prize || 0)}</span>
                                                    <div className="flex flex-col items-end gap-2 mt-1">
                                                        <Badge variant={w.status === "verified" || w.status === "approved" || w.status === "paid" ? "success" : "muted"}>
                                                            {w.status}
                                                        </Badge>
                                                        {w.status === 'pending' && w.proofImage && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <a 
                                                                    href={w.proofImage.startsWith('http') ? w.proofImage : `http://localhost:5000/${w.proofImage}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="text-xs text-brand-400 hover:text-brand-300 underline mr-2"
                                                                >
                                                                    View Image
                                                                </a>
                                                                <Button size="xs" variant="secondary" className="bg-green-500/20 text-green-400 hover:bg-green-500/30" isLoading={verifying === w._id} onClick={() => verifyProof(w._id, "approved")}>
                                                                    <CheckCircle className="h-3 w-3 mr-1" /> Approve
                                                                </Button>
                                                                <Button size="xs" variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10" isLoading={verifying === w._id} onClick={() => verifyProof(w._id, "rejected")}>
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </>
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center text-center p-12">
                            <Shuffle className="h-12 w-12 text-white/10 mb-4" />
                            <p className="text-white/50">No draws found in database.</p>
                            <p className="text-white/30 text-sm mt-2">Generate your first draw on the left.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}