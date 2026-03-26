import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import { charityService } from "../../services/charityService";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";

const schema = z.object({
    name: z.string().min(2, "Min 2 chars"),
    description: z.string().min(10, "Min 10 chars"),
});

export function AdminCharitiesPage() {
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

    const load = () => {
        charityService.getAll()
            .then((d) => setCharities(d?.charities || d || []))
            .catch(() => toast.error("Failed to load"))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const onSubmit = async (data) => {
        try {
            await adminService.addCharity(data);
            toast.success("Charity added!");
            reset(); load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add");
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl text-white mb-1" style={{ fontFamily: "var(--font-display, serif)" }}>Charities</h1>
                <p className="text-white/50">Manage available charities for users</p>
            </div>

            <Card>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-400" /> Add New Charity
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Charity Name" placeholder="e.g. Red Cross" error={errors.name?.message} {...register("name")} />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-white/70">Description</label>
                        <textarea rows={3} placeholder="Brief description of the charity's mission..."
                            className="w-full rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-green-500 resize-none transition-colors"
                            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                            {...register("description")}
                        />
                        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                    </div>
                    <Button type="submit" isLoading={isSubmitting}>Add Charity</Button>
                </form>
            </Card>

            <Card>
                <h3 className="font-semibold text-white mb-4">Active Charities ({charities.length})</h3>
                {loading ? <Spinner /> : (
                    <div className="space-y-3">
                        {charities.map((c) => (
                            <div key={c._id || c.id} className="flex items-start gap-3 p-3 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                    <Heart className="h-4 w-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">{c.name}</p>
                                    <p className="text-white/50 text-xs mt-0.5">{c.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}