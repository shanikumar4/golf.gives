import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Heart, Activity, ArrowRight, ShieldCheck, Coins } from "lucide-react";
import { charityService } from "../services/charityService";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";

export function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();
    const [charities, setCharities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCharities = async () => {
            try {
                const data = await charityService.getAll();
                setCharities(data?.charities?.slice(0, 3) || data?.slice(0, 3) || []);
            } catch (error) {
                console.error("Error fetching charities:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCharities();
    }, []);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
           navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate, user]);

    return (
        <div className="min-h-screen bg-surface selection:bg-brand-500/30">
            {/* Top Navigation */}
            <nav className="border-b border-white/5 bg-surface/50 backdrop-blur-md fixed top-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <Heart className="h-5 w-5 text-white" fill="white" />
                        </div>
                        <span className="font-display text-2xl text-white tracking-tight">GolfGives</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                            Sign In
                        </Link>
                        <Button onClick={() => navigate("/register")} className="shadow-sm shadow-brand-500/10 hover:shadow-md hover:shadow-brand-500/20 transition-all">
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 relative flex flex-col items-center text-center">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
                
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                        Change the world through golf
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-display text-white mb-8 leading-[1.1] tracking-tight">
                        Turn every swing into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
                            a winning impact.
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                        GolfGives is the ultimate subscription platform where you submit your golf scores, enter our weekly cash draw, and seamlessly donate a percentage of your winnings to a charity you love.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" onClick={() => navigate("/register")} className="px-8 h-14 text-lg w-full sm:w-auto shadow-md shadow-brand-500/10 hover:shadow-lg hover:shadow-brand-500/20 transition-all group">
                            Start Playing Now
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })} className="px-8 h-14 text-lg w-full sm:w-auto bg-surface-muted/50 backdrop-blur-sm border-white/10 hover:bg-white/5">
                            How it Works
                        </Button>
                    </div>
                </div>
                
                {/* Hero Dashboard Preview (Abstract) */}
                <div className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-surface-card p-2 shadow-2xl relative z-10 transform perspective-1000 rotateX-12 scale-95 opacity-90 mx-auto">
                    <div className="h-64 md:h-96 w-full rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-center items-center gap-6 overflow-hidden relative">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                         <div className="flex gap-4 items-center">
                            {[7, 12, 45, 8, 22].map((n, i) => (
                                <div key={i} className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-brand-500/20 shadow-[0_0_30px_rgba(var(--brand-500-rgb),0.3)] flex items-center justify-center border border-brand-500/50 backdrop-blur-md">
                                    <span className="font-display text-2xl md:text-4xl text-white">{n}</span>
                                </div>
                            ))}
                         </div>
                         <p className="text-brand-400 font-semibold tracking-widest uppercase text-sm">Validating Winning Numbers</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 px-6 relative border-t border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-surface pointer-events-none" />
                {/* Abstract Line graphics */}
                <div className="absolute left-10 top-20 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-brand-500/10 to-transparent hidden xl:block" />
                <div className="absolute right-10 top-20 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-brand-500/10 to-transparent hidden xl:block" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display text-white mb-4">How GolfGives Works</h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">Four simple steps to win cash prizes and support charitable foundations globally.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard 
                            step="01"
                            icon={Activity}
                            title="Play & Score"
                            desc="Go out and play a round of golf. Submit 5 specific metrics or scores from your round onto our secure platform."
                        />
                        <StepCard 
                            step="02"
                            icon={ShieldCheck}
                            title="Enter the Draw"
                            desc="Those 5 numbers become your lottery ticket. At the end of the week, the Admin generates the official winning numbers."
                        />
                        <StepCard 
                            step="03"
                            icon={Trophy}
                            title="Match & Win"
                            desc="Match 3, 4, or 5 numbers to win a cash prize from our active cycle pool. Upload your scorecard to prove your score."
                        />
                        <StepCard 
                            step="04"
                            icon={Heart}
                            title="Make an Impact"
                            desc="Pledge a percentage (min 10%) of your tier 4/5 winnings to a verified charity. We automatically split the prize."
                        />
                    </div>
                </div>
            </section>

            {/* Charities Section */}
            <section className="py-24 px-6 relative border-t border-white/5 bg-surface/50">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-display text-white mb-4">Supporting Real Causes</h2>
                            <p className="text-white/50 text-lg leading-relaxed">
                                Our platform empowers you to redirect a portion of your actual golf winnings to officially verified foundations. You win, they win.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate("/register")} className="shrink-0 flex items-center gap-2">
                            View All Charities <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full" />
                        </div>
                    ) : charities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {charities.map((charity) => (
                                <div key={charity._id} className="bg-surface-card border border-white/5 rounded-2xl p-6 hover:border-brand-500/50 transition-colors group">
                                    <div className="h-48 w-full rounded-xl bg-surface-muted mb-6 overflow-hidden flex items-center justify-center relative">
                                        {charity.image ? (
                                            <img src={charity.image} alt={charity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <Heart className="h-12 w-12 text-white/10" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <span className="absolute bottom-4 left-4 font-bold text-white text-lg">{charity.name}</span>
                                    </div>
                                    <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">
                                        {charity.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-white/40">Verified charities actively loading into the network.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 px-6 relative overflow-hidden bg-surface-card border-t border-white/5">
                {/* Glowing Background Orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />
                
                {/* Subtle Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay opacity-[0.05]" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10 py-8">
                    <h2 className="text-4xl md:text-5xl font-display text-white mb-6">Ready to hit the green?</h2>
                    <p className="text-white/60 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Create your account today, submit your first scorecard, and start winning cash while helping those in need.
                    </p>
                    <Button onClick={() => navigate("/register")} size="lg" className="px-10 h-14 text-lg shadow-md shadow-brand-500/10 bg-brand-500 hover:bg-brand-600 text-white border border-brand-400/20 transition-all hover:-translate-y-0.5">
                        Create Free Account
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-8 border-t border-white/5 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-brand-500" fill="currentColor" />
                    <span className="font-display text-lg text-white tracking-tight">GolfGives</span>
                </div>
                <p className="text-white/30 text-xs">
                    © {new Date().getFullYear()} GolfGives Platform. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

function StepCard({ step, icon: Icon, title, desc }) {
    return (
        <div className="relative overflow-hidden p-6 bg-surface-muted border border-white/5 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
            <span className="absolute -top-6 -right-2 text-8xl font-display font-black text-white/[0.03] select-none pointer-events-none">
                {step}
            </span>
            <div className="h-12 w-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-white/60 leading-relaxed text-sm">
                {desc}
            </p>
        </div>
    );
}
