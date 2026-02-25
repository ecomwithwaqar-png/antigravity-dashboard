import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import {
    TrendingUp,
    Zap,
    Flame,
    Target,
    AlertCircle,
    BarChart3
} from "lucide-react";

export function PredictiveAnalytics() {
    const { metrics, productPerformance } = useData();

    const poasValue = metrics.poas;
    const poasStatus = poasValue > 2 ? "Healthy" : poasValue > 1 ? "At Risk" : "Unprofitable";

    // Products that will run out of stock in < 10 days
    const burnRisks = productPerformance.filter(p => p.daysOfStock < 10).sort((a, b) => a.daysOfStock - b.daysOfStock);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marketing Profit Audit */}
            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm group hover:border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-purple-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Marketing Profit Audit (POAS)</h3>
                    </div>
                    <div className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        poasStatus === "Healthy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            poasStatus === "At Risk" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    )}>
                        {poasStatus}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">ROAS (Platform)</p>
                        <p className="text-xl font-bold text-white">{metrics.roas.toFixed(2)}x</p>
                        <p className="text-[9px] text-muted-foreground mt-1 text-emerald-400/60 font-medium">Platform Data</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group/poas border-purple-500/10">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/poas:opacity-100 transition-opacity" />
                        <p className="text-[10px] text-purple-300 uppercase font-bold mb-1">POAS (Net Truth)</p>
                        <p className="text-xl font-bold text-white tracking-tighter">{metrics.poas.toFixed(2)}x</p>
                        <p className="text-[9px] text-muted-foreground mt-1 text-purple-400/60 font-medium italic">After RTO & Ops</p>
                    </div>
                </div>

                <div className="mt-6 flex items-start gap-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                    <Zap size={14} className="text-indigo-400 mt-1 shrink-0" />
                    <p className="text-[10px] text-indigo-300/80 leading-relaxed italic font-medium">
                        {metrics.poas > 1.5
                            ? "Scaling recommended. Your net margins can absorb higher CAC."
                            : metrics.poas > 0
                                ? "Optimization needed. Profit is being leaked via RTO. Audit confirm-calls."
                                : "Marketing is burning cash. High RTO has decimated your platform ROAS."}
                    </p>
                </div>
            </div>

            {/* Inventory velocity */}
            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm group hover:border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Flame size={18} className="text-rose-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Stock Burn & Velocity</h3>
                    </div>
                    <AlertCircle size={14} className="text-rose-400/30" />
                </div>

                <div className="space-y-4">
                    {burnRisks.slice(0, 3).map(p => (
                        <div key={p.name} className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5 relative group/item">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate max-w-[150px]">{p.name}</span>
                                <span className={cn(
                                    "text-[10px] font-black",
                                    p.daysOfStock < 3 ? "text-rose-500 uppercase italic animate-pulse" : "text-amber-400"
                                )}>
                                    {Math.round(p.daysOfStock)}d LEFT
                                </span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full transition-all duration-1000", p.daysOfStock < 5 ? "bg-rose-500" : "bg-amber-500")}
                                    style={{ width: `${Math.min((p.daysOfStock / 10) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-[8px] text-muted-foreground uppercase font-black tracking-widest">
                                <span>{p.inventory} UNITS</span>
                                <span>{p.burnRate.toFixed(1)} / DAY</span>
                            </div>
                        </div>
                    ))}

                    {burnRisks.length === 0 && (
                        <div className="py-8 text-center opacity-20 flex flex-col items-center">
                            <BarChart3 size={40} className="mb-2" />
                            <p className="text-[10px] uppercase font-black tracking-[4px]">Stock Levels Healthy</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-2">
                    <button className="flex-1 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-[9px] font-black text-purple-300 hover:bg-purple-600/30 transition-all uppercase tracking-widest">
                        Reorder List
                    </button>
                    <button className="px-4 py-2 border border-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                        <TrendingUp size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
