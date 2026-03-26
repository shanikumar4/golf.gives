import { clsx } from "clsx";
import { Spinner } from "./Spinner";

const variants = {
    primary: "bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-600 hover:to-brand-500 text-white shadow-lg shadow-brand-500/25 border border-white/10 hover:shadow-brand-500/40",
    secondary: "glass hover:bg-white/10 text-white",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
    ghost: "hover:bg-white/5 text-white/70 hover:text-white",
};
const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5", lg: "px-7 py-3.5 text-lg" };

export function Button({ variant = "primary", size = "md", isLoading, disabled, children, className, ...props }) {
    return (
        <button
            disabled={disabled || isLoading}
            className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]",
                "relative overflow-hidden",
                variants[variant], sizes[size], className
            )}
            {...props}
        >
            {/* Glossy overlay for primary button */}
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none opacity-50" />
            )}
            {isLoading && <Spinner size="sm" />}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
}