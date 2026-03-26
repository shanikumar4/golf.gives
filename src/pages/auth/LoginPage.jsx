import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function LoginPage() {
    const { login, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Standard React States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Navigation Logic
    useEffect(() => {
        if (isAuthenticated) {
            let targetPath = location.state?.from?.pathname || "/dashboard";
            // Force admin strictly to their portal regardless of original routing constraints
            if (isAdmin) targetPath = "/admin";
            
            navigate(targetPath, { replace: true });
        }
    }, [isAuthenticated, isAdmin, navigate, location]);

    // 2. Custom Submit Handler
    const handleFormSubmit = async (e) => {
        e.preventDefault(); 
        setErrorMsg("");

        if (!email.includes("@")) {
            setErrorMsg("Invalid email format");
            return;
        }
        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            const result = await login({ email, password });
            
            if (result.success) {
                toast.success("Welcome back!");
            } else {
                toast.error(result.error || "Login failed");
                setErrorMsg(result.error || "Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex">
            {/* Left panel - WAPAS AA GAYA! 🎉 */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-surface to-surface-card relative overflow-hidden flex-col justify-center px-16">
                <div className="absolute inset-0 bg-gradient-radial from-brand-500/10 via-transparent to-transparent" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white" fill="white" />
                        </div>
                        <span className="font-display text-2xl text-white">GolfGives</span>
                    </div>
                    <h1 className="font-display text-5xl text-white leading-tight mb-6">
                        Play golf.<br />
                        <span className="gradient-text">Change lives.</span>
                    </h1>
                    <p className="text-white/50 text-lg leading-relaxed">
                        Every swing you take contributes to causes that matter. Join thousands of golfers making a difference.
                    </p>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="font-display text-3xl text-white mb-2">Sign in</h2>
                        <p className="text-white/50">Welcome back to GolfGives</p>
                    </div>

                    {/* Error Message Display */}
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
                            {errorMsg}
                        </div>
                    )}

                    {/* Form with standard onSubmit */}
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <Input 
                            label="Email" 
                            type="email" 
                            icon={Mail} 
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input 
                            label="Password" 
                            type="password" 
                            icon={Lock} 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-white/40 text-sm">
                        No account?{" "}
                        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}