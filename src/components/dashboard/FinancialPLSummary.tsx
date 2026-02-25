import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign, ArrowRight, Info, PieChart } from "lucide-react";

export function FinancialPLSummary() {
    const { metrics, formatCurrency, estimatedOpsPercent, setEstimatedOpsPercent } = useData();
    const m = metrics;

    const sections = [
        { label: "Gross Revenue", value: m.totalRevenue, sub: "Total sales value", color: "text-white" },
        { label: "Cost of Goods", value: -m.totalCost, sub: "Manufacturing costs", color: "text-rose-400" },
        { label: "Shipping/Fulfillment", value: -m.totalShippingCost, sub: "Logistics costs", color: "text-rose-400" },
        { label: "Gross Profit", value: m.grossProfit, sub: "Pre-marketing profit", color: "text-emerald-400", highlight: true },
        { label: "Ad Spend", value: -m.adSpend, sub: "Paid acquisition", color: "text-rose-400" },
        {
            label: "Estimated Ops",
            value: -(m.totalRevenue * (estimatedOpsPercent / 100)),
            sub: `${estimatedOpsPercent}% overhead est.`,
            color: "text-rose-400/70",
            isOps: true
        },
        { label: "Net Profit (Sales)", value: m.netProfit, sub: "Before capital outflow", color: "text-white/60", highlight: true },
        { label: "Ledger Outflow", value: -m.totalCapitalOutflow, sub: "Inventory/USDT/Ops", color: "text-rose-400" },
        { label: "Cash in Hand", value: m.cashInHand, sub: "Final balance", color: "text-cyan-400", highlight: true, bold: true },
    ];

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden flex flex-col h-full group/card transition-all duration-500 hover:border-white/10">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                        <DollarSign size={14} className="text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">Financial Summary</h4>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 font-medium">
                    <TrendingUp size={10} />
                    <span>Real-time</span>
                </div>
            </div>

            <div className="p-5 flex-1 space-y-3">
                {/* Margin Gauge */}
                <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                            <circle
                                cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="4"
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * Math.min(Math.max(m.netMargin, 0), 100)) / 100}
                                className={cn(
                                    "transition-all duration-1000 ease-out",
                                    m.netMargin > 20 ? "text-emerald-400" : m.netMargin > 10 ? "text-amber-400" : "text-rose-400"
                                )}
                            />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white">{Math.round(m.netMargin)}%</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Net Margin</p>
                        <p className="text-sm font-bold text-white">
                            {m.netMargin > 20 ? "Highly Profitable" : m.netMargin > 10 ? "Healthy" : "Low Margin"}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {sections.map((s) => (
                        <div key={s.label} className={cn(
                            "flex items-center justify-between group py-0.5",
                            s.highlight && "pt-2 mt-1 border-t border-white/5",
                            s.bold && "pt-2"
                        )}>
                            <div className="flex flex-col">
                                <span className={cn("text-xs font-medium", s.highlight ? "text-white" : "text-muted-foreground")}>
                                    {s.label}
                                </span>
                                {s.isOps && (
                                    <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEstimatedOpsPercent(Math.max(0, estimatedOpsPercent - 0.5))}
                                            className="w-4 h-4 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-white"
                                        >-</button>
                                        <span className="text-[10px] text-white/40 font-mono">{estimatedOpsPercent}%</span>
                                        <button
                                            onClick={() => setEstimatedOpsPercent(estimatedOpsPercent + 0.5)}
                                            className="w-4 h-4 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[10px] text-white"
                                        >+</button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs font-bold font-mono",
                                    s.color
                                )}>
                                    {s.value < 0 ? `- ${formatCurrency(Math.abs(s.value))}` : formatCurrency(s.value)}
                                </span>
                                {s.highlight && <ArrowRight size={10} className="text-white/10 group-hover:text-white/40 transition-colors" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-white/[0.04] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    <PieChart size={12} className="text-purple-400" />
                    <span>Real-time P&L</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-white/40 group relative cursor-help">
                    <Info size={10} />
                    <span>Cost Breakdown</span>
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black/90 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[9px] text-white/70 shadow-2xl">
                        Adjust "Ops" by hovering over it. Includes COGS, Shipping, and acquisition spend.
                    </div>
                </div>
            </div>
        </div>
    );
}

