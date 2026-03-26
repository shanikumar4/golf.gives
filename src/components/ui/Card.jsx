import { clsx } from "clsx";
export function Card({ children, className, hover = false }) {
    return (
        <div className={clsx(
            "rounded-2xl glass p-6 relative overflow-hidden transition-all duration-300",
            hover && "glass-hover cursor-pointer",
            className
        )}>
            {/* Subtle inner light effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}