import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import { Trophy, ShoppingBag } from "lucide-react";

export function ProductLeaderboard() {
    const { productPerformance, formatCurrency } = useData();

    const topProducts = [...productPerformance]
        .sort((a, b) => b.netProfit - a.netProfit)
        .slice(0, 5);

    if (productPerformance.length === 0) return null;

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden flex flex-col h-full group/card transition-all duration-500 hover:border-white/10">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center group-hover/card:rotate-12 transition-transform">
                        <Trophy size={14} className="text-yellow-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">SKU P&L Audit</h4>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/40 font-bold uppercase tracking-widest">
                    Real-time Audit
                </div>
            </div>

            <div className="flex-1 p-5 space-y-6">
                {topProducts.map((item, i) => {
                    const stockStatus = item.daysOfStock < 3 ? "text-rose-400" : item.daysOfStock < 7 ? "text-amber-400" : "text-emerald-400";

                    return (
                        <div key={item.name} className="relative group/item">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all group-hover/item:scale-110",
                                        i === 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                            i === 1 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                                                "bg-white/5 text-white/40 border border-white/5"
                                    )}>
                                        {i + 1}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] font-bold text-white truncate max-w-[130px] group-hover/item:text-purple-300 transition-colors">
                                            {item.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[9px] font-bold",
                                                item.deliveryRate > 80 ? "text-emerald-400/60" : "text-rose-400/60"
                                            )}>
                                                {Math.round(item.deliveryRate)}% DLV
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className={cn("text-[8px] font-bold uppercase", stockStatus)}>
                                                {item.daysOfStock < 1 ? "OOS" : `${Math.round(item.daysOfStock)}d stock`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn("text-xs font-black", item.netProfit > 0 ? "text-emerald-400" : "text-rose-400")}>
                                        {formatCurrency(item.netProfit)}
                                    </p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-black">Net Takehome</p>
                                </div>
                            </div>

                            {/* Stock & Return Risk Bar */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-1000", item.daysOfStock < 5 ? "bg-rose-500" : "bg-emerald-500")}
                                        style={{ width: `${Math.min((item.daysOfStock / 30) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-1000", item.returnRate > 30 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-blue-500")}
                                        style={{ width: `${item.returnRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 bg-white/[0.04] border-t border-white/5 flex items-center justify-between text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
                <div className="flex items-center gap-1">
                    <ShoppingBag size={10} className="text-purple-400" />
                    <span>Top 5 by Net Profit</span>
                </div>
                <div className="flex items-center gap-1 text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>High RTO ALERT</span>
                </div>
            </div>
        </div>
    );
}

