import { clsx } from "clsx";
const variants = {
    success: "bg-brand-500/10 text-brand-400 border-brand-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    muted: "bg-white/5 text-white/50 border-white/10",
};
export function Badge({ variant = "muted", children }) {
    return (
        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant])}>
            {children}
        </span>
    );
}