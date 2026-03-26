import { useEffect, useState } from "react";
import { Check, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { subscriptionService } from "../../services/subscriptionService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { formatters } from "../../utils/formatters";
import { clsx } from "clsx";
import { useApp } from "../../hooks/useApp";

const PLANS = [
    { key: "monthly", label: "Monthly", price: "£9.99", period: "/mo", features: ["Enter 5 scores/month", "Charity allocation", "Monthly draw entry"] },
    { key: "yearly", label: "Yearly", price: "£89.99", period: "/yr", features: ["Everything in Monthly", "2 months free", "Priority draw entry", "Annual summary report"], popular: true },
];

export function SubscriptionPage() {
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activating, setActivating] = useState(null);
    const { fetchDashboard } = useApp();

    useEffect(() => {
        subscriptionService.getStatus()
            .then((d) => setStatus(d?.subscription || d))
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);

    const activate = async (plan) => {
        setActivating(plan);
        try {
            await subscriptionService.activate({ plan });
            const d = await subscriptionService.getStatus();
            setStatus(d?.subscription || d);
            toast.success(`${plan} plan activated!`);
            // Refresh global dashboard state in background
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || "Activation failed");
        } finally {
            setActivating(null);
        }
    };

    const handleRenew = async () => {
        setActivating("renew");
        try {
            await subscriptionService.activate({ plan: status.plan });
            const d = await subscriptionService.getStatus();
            setStatus(d?.subscription || d);
            toast.success(`Subscription renewed successfully!`);
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || "Renewal failed");
        } finally {
            setActivating(null);
        }
    };

    if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="font-display text-3xl text-white mb-1">Subscription</h1>
                <p className="text-white/50">Choose a plan to participate in monthly draws</p>
            </div>

            {status?.status === 'active' && (
                <Card className="border-brand-500/30 bg-brand-500/5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-brand-400" />
                            </div>
                            <div>
                                <p className="text-white font-semibold capitalize">{status.plan} Plan</p>
                                <p className="text-white/50 text-sm">Active until {formatters.date(status.endDate || status.expiresAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="success">Active</Badge>
                            <Button 
                                size="sm" 
                                variant="secondary" 
                                isLoading={activating === 'renew'} 
                                onClick={handleRenew}
                                className="border border-brand-500/30 hover:border-brand-500 hover:text-brand-400 transition-colors"
                            >
                                Renew Now
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {PLANS.map((plan) => (
                    <div key={plan.key} className={clsx(
                        "relative rounded-2xl border p-6 flex flex-col",
                        plan.popular
                            ? "bg-gradient-to-b from-brand-500/10 to-surface-card border-brand-500/40"
                            : "bg-surface-card border-surface-border"
                    )}>
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                            </div>
                        )}
                        <div className="mb-4">
                            <h3 className="text-white font-semibold text-lg">{plan.label}</h3>
                            <div className="flex items-end gap-1 mt-2">
                                <span className="font-display text-4xl text-white">{plan.price}</span>
                                <span className="text-white/40 mb-1">{plan.period}</span>
                            </div>
                        </div>
                        <ul className="space-y-2 flex-1 mb-6">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                                    <Check className="h-4 w-4 text-brand-400 flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <Button
                            variant={plan.popular ? "primary" : "secondary"}
                            isLoading={activating === plan.key}
                            disabled={status?.status === 'active' && status?.plan === plan.key}
                            onClick={() => activate(plan.key)}
                            className="w-full"
                        >
                            {status?.status === 'active' && status?.plan === plan.key ? "Current Plan" : `Activate ${plan.label}`}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}