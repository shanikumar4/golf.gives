import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Target, Info } from "lucide-react";
import toast from "react-hot-toast";
import { scoreService } from "../../services/scoreService";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { formatters } from "../../utils/formatters";
import { useApp } from "../../hooks/useApp";

const schema = z.object({
    score: z.coerce.number().int()
        .min(1, "Minimum score is 1")
        .max(45, "Maximum score is 45"),
});

export function ScoreEntryPage() {
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { fetchDashboard, dashboard } = useApp();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

    const loadScores = async () => {
        try {
            const data = await scoreService.get();
            setScores(data?.scores || data || []);
        } catch { toast.error("Failed to load scores"); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadScores(); }, []);

    const onSubmit = async (data) => {
        try {
            // Frontend se { score: 40 } aa raha hai, par backend ko { value: 40 } chahiye.
            await scoreService.submit({ value: data.score });

            toast.success("Score submitted!");
            reset();
            loadScores();
            // Refresh global dashboard state in background
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit score");
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="font-display text-3xl text-white mb-1">Score Entry</h1>
                <p className="text-white/50">Submit your latest golf score (last 5 kept)</p>
            </div>

            {dashboard?.subscription?.status !== 'active' ? (
                <Card className="border-red-500/30">
                    <div className="text-center py-6">
                        <h3 className="text-white font-semibold text-lg mb-2">Subscription Required</h3>
                        <p className="text-white/50 text-sm mb-4">You must have an active subscription to submit golf scores.</p>
                        <Link to="/subscription">
                            <Button>Activate Subscription</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <Card>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-white font-medium text-sm">Rolling Score System</p>
                            <p className="text-blue-200/70 text-sm mt-0.5">Your 5 most recent scores form your handicap. Adding a 6th score automatically replaces your oldest score.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Golf Score (1 - 45)"
                            type="number"
                            icon={Target}
                            placeholder="e.g. 36"
                            error={errors.score?.message}
                            {...register("score")}
                        />
                        <Button type="submit" isLoading={isSubmitting} className="w-full">
                            Submit Score
                        </Button>
                    </form>
                </Card>
            )}

            <Card>
                <h3 className="font-semibold text-white mb-4">Your Score History</h3>
                {isLoading ? (
                    <div className="flex justify-center py-6"><Spinner /></div>
                ) : scores.length === 0 ? (
                    <p className="text-white/40 text-sm text-center py-6">No scores submitted yet. Add your first score above.</p>
                ) : (
                    <div className="space-y-2">
                        {scores.map((s, i) => {
                            const isOldest = i === scores.length - 1 && scores.length === 5;
                            return (
                                <div key={i} className={`relative p-4 rounded-xl flex items-center justify-between border transition-all ${isOldest ? 'bg-red-500/5 border-red-500/10 opacity-70' : 'bg-surface-muted border-white/5'}`}>

                                    {/* 'Latest' Tag */}
                                    {i === 0 && (
                                        <span className="absolute top-1.5 right-1.5 text-[8px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse-glow">
                                            Latest
                                        </span>
                                    )}

                                    {/* 'Oldest' Tag */}
                                    {isOldest && (
                                        <span className="absolute -top-2 left-4 text-[10px] font-medium text-red-400 bg-surface-card border border-red-500/20 px-2 py-0.5 rounded-md">
                                            Next to go
                                        </span>
                                    )}

                                    {/* Left Side: Date */}
                                    <span className="text-white/60 text-sm mt-1">{formatters.date(s.date || s.createdAt)}</span>

                                    {/* Right Side: Score */}
                                    <span className={`text-2xl font-semibold ${isOldest ? 'text-white/50' : 'text-white'}`}>{s.value}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}