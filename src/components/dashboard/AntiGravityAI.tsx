import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, Loader2, Gauge, Scale, TrendingUp, Wallet } from "lucide-react";
import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";

export function AntiGravityAI() {
    const { askAntiGravity, isAnalyzing, analysisResult } = useData();
    const [query, setQuery] = useState("");
    const resultRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        askAntiGravity(query);
        setQuery("");
    };

    useEffect(() => {
        if (analysisResult && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [analysisResult]);

    const strategicCommands = [
        { id: "tax", label: "Tax Readiness", icon: Scale, color: "text-amber-400", bg: "bg-amber-400/10", prompt: "Run a tax readiness and liability audit." },
        { id: "growth", label: "Growth Protocol", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10", prompt: "Generate a growth scaling execution protocol." },
        { id: "capital", label: "Capital Flow", icon: Wallet, color: "text-cyan-400", bg: "bg-cyan-400/10", prompt: "Audit my capital flow and cash in hand." },
        { id: "trends", label: "SKU Insights", icon: Gauge, color: "text-purple-400", bg: "bg-purple-400/10", prompt: "Analyze SKU performance and retention trends." },
    ];

    return (
        <div className="h-full flex flex-col bg-secondary/20 rounded-[2rem] border border-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-900/40 via-purple-900/20 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse">
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-base uppercase italic tracking-tighter">AntiGravity Strategic Core</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Enterprise Reasoning Active</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 min-h-[400px] scrollbar-hide">
                {!analysisResult && !isAnalyzing && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group hover:scale-110 transition-transform duration-500">
                            <Bot size={40} className="text-purple-400/50 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2">Awaiting Neural Input</h4>
                        <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mb-8">
                            Select a strategic protocol or issue a custom directive for business analysis.
                        </p>

                        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                            {strategicCommands.map(cmd => (
                                <button
                                    key={cmd.id}
                                    onClick={() => askAntiGravity(cmd.prompt)}
                                    className="flex flex-col items-start p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all group text-left"
                                >
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", cmd.bg, cmd.color)}>
                                        <cmd.icon size={16} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{cmd.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {analysisResult && (
                    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex-shrink-0 flex items-center justify-center mt-1 border border-purple-500/20">
                            <Bot size={20} className="text-purple-400" />
                        </div>
                        <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5 text-sm text-purple-50 leading-relaxed shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
                            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-purple-100/80">
                                {analysisResult.split('\n').map((line, i) => (
                                    <p key={i} className={cn(line.startsWith('###') && "text-purple-400 font-black text-lg mt-4 mb-2")}>
                                        {line.replace('### ', '')}
                                    </p>
                                ))}
                            </div>
                            <div ref={resultRef} />
                        </div>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                            <Bot size={20} className="text-purple-400" />
                        </div>
                        <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5 text-sm flex items-center gap-3 text-purple-300 font-bold uppercase tracking-widest">
                            <Loader2 size={16} className="animate-spin" />
                            Computing Strategic Matrix...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 p-b-6 border-t border-white/5 bg-black/40">
                <form onSubmit={handleSubmit} className="relative group/form">
                    <div className="absolute inset-0 bg-purple-600/5 blur-xl group-focus-within/form:bg-purple-600/10 transition-all duration-500 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Initiate strategic directive..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-muted-foreground/50 relative z-10"
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || isAnalyzing}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20 active:scale-90 shadow-lg shadow-purple-600/20"
                    >
                        <Send size={16} />
                    </button>
                </form>
                <div className="mt-3 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-purple-500" />
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Tax Review Ready</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-purple-500" />
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Growth Audit Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
