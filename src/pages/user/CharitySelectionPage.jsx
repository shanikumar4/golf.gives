import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Check } from "lucide-react";
import toast from "react-hot-toast";
import { charityService } from "../../services/charityService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { clsx } from "clsx";
import { useApp } from "../../hooks/useApp";

const schema = z.object({
    charityId: z.string({
        required_error: "Please select a charity from the list above.",
        invalid_type_error: "Please select a charity."
    }).min(1, "Please select a charity from the list above."),
    percentage: z.coerce.number()
        .min(10, "Minimum 10% allocation is required")
        .max(100, "Percentage must be between 10 and 100"),
});

export function CharitySelectionPage() {
    const [charities, setCharities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const { fetchDashboard } = useApp();

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { percentage: 10, charityId: "" },
    });

    const percentageValue = watch("percentage");

    useEffect(() => {
        charityService.getAll()
            .then((data) => setCharities(data?.charities || data || []))
            .catch(() => toast.error("Failed to load charities"))
            .finally(() => setIsLoading(false));
    }, []);

    const selectCharity = (id) => {
        setSelectedId(id);
        setValue("charityId", id);
    };

    const onSubmit = async (data) => {
        try {
            await charityService.select(data);
            toast.success("Charity selection saved!");
            // Refresh global dashboard state in background
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save selection");
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="font-display text-3xl text-white mb-1">Choose Your Cause</h1>
                <p className="text-white/50">Select a charity and decide what percentage of your prize goes to them</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Charity Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {charities.map((c) => (
                            <button key={c._id || c.id} type="button" onClick={() => selectCharity(c._id || c.id)}
                                className={clsx(
                                    "text-left p-5 rounded-2xl border transition-all",
                                    selectedId === (c._id || c.id)
                                        ? "bg-brand-500/15 border-brand-500/50"
                                        : "bg-surface-card border-surface-border hover:border-brand-500/30"
                                )}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                                        <Heart className="h-5 w-5 text-brand-400" />
                                    </div>
                                    {selectedId === (c._id || c.id) && (
                                        <div className="h-5 w-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-white font-semibold mt-3">{c.name}</h4>
                                <p className="text-white/50 text-sm mt-1 line-clamp-2">{c.description}</p>
                            </button>
                        ))}
                    </div>
                    {errors.charityId && <p className="text-red-400 text-sm">{errors.charityId.message}</p>}

                    {/* Percentage */}
                    <Card>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Prize Allocation Percentage
                        </label>
                        <div className="flex items-center gap-4">
                            {/* Slider Input */}
                            <input
                                type="range" min="10" max="100" step="1"
                                value={percentageValue}
                                onChange={(e) => setValue("percentage", Number(e.target.value), { shouldValidate: true })}
                                className="flex-1 accent-brand-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />

                            {/* Number Input */}
                            <div className="flex items-center gap-1 w-24">
                                <input
                                    type="number" min="10" max="100"
                                    value={percentageValue}
                                    onChange={(e) => setValue("percentage", Number(e.target.value), { shouldValidate: true })}
                                    className="w-16 bg-surface-muted border border-surface-border rounded-lg px-2 py-1.5 text-white text-center outline-none focus:border-brand-500 font-display text-lg"
                                />
                                <span className="text-white/50 font-medium">%</span>
                            </div>
                        </div>

                        {/* Interactive Impact Visualizer */}
                        <div className="mt-8 p-4 rounded-xl charity-gradient border border-brand-500/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="relative z-10">
                                <p className="text-white/70 text-sm mb-1">Impact Preview</p>
                                <p className="text-white text-sm">
                                    If you win a <span className="font-semibold text-white">£1,000</span> prize pot:
                                </p>
                                <div className="flex items-end gap-3 mt-3">
                                    <div className="flex-1">
                                        <div className="text-brand-400 font-display text-3xl">
                                            £{((percentageValue || 10) / 100 * 1000).toFixed(0)}
                                        </div>
                                        <p className="text-brand-400/70 text-xs">goes to charity</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/10 mx-2"></div>
                                    <div className="flex-1 text-right">
                                        <div className="text-white font-display text-3xl">
                                            £{((100 - (percentageValue || 10)) / 100 * 1000).toFixed(0)}
                                        </div>
                                        <p className="text-white/50 text-xs">you keep</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {errors.percentage && <p className="text-red-400 text-xs mt-1">{errors.percentage.message}</p>}
                    </Card>

                    <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full">
                        Save Charity Selection
                    </Button>
                </form>
            )}
        </div>
    );
}