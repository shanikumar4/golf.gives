import { forwardRef } from "react";
import { clsx } from "clsx";

export const Input = forwardRef(function Input({ label, error, icon: Icon, className, ...props }, ref) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-white/70">{label}</label>}
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />}
                <input
                    ref={ref}
                    className={clsx(
                        "w-full rounded-xl bg-surface-muted border border-surface-border px-4 py-3",
                        "text-white placeholder:text-white/30 outline-none",
                        "focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all",
                        Icon && "pl-10",
                        error && "border-red-500/50 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}); 