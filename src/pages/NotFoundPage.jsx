import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6"
            style={{ backgroundColor: "#0f1117" }}>
            <p className="text-8xl font-bold text-white/10 mb-4" style={{ fontFamily: "var(--font-display, serif)" }}>
                404
            </p>
            <h1 className="text-3xl text-white mb-2" style={{ fontFamily: "var(--font-display, serif)" }}>
                Page not found
            </h1>
            <p className="text-white/50 mb-8">This page doesn't exist or was moved.</p>
            <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
            </Link>
        </div>
    );
}