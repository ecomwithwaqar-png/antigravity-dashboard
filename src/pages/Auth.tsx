import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Github } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("Welcome back to AntiGravity");
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast.success("Identity registered! Check your email.");
            }
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 border border-white/5 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                            <Lock className="text-white" size={24} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">AntiGravity <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Neural</span></h1>
                    <p className="text-muted-foreground mt-2 text-sm">Secure biometric-grade authentication</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${isLogin ? 'bg-white/10 text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${!isLogin ? 'bg-white/10 text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                        >
                            Signup
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold ml-1">E-Mail Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold ml-1">Secret Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>{isLogin ? "Authenticate" : "Create Identity"} <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0f15] px-2 text-muted-foreground tracking-widest">Neural Proxy</span></div>
                    </div>

                    <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                        <Github size={20} />
                        Continue with GitHub
                    </button>
                </div>

                <p className="text-center mt-8 text-muted-foreground text-xs px-8 leading-relaxed">
                    By authenticating, you agree to our <a href="#" className="text-white hover:underline underline-offset-4">Handshake Protocol</a> and <a href="#" className="text-white hover:underline underline-offset-4">Neural Privacy Terms</a>.
                </p>
            </motion.div>
        </div>
    );
}
