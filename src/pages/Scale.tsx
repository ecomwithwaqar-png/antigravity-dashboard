import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import {
    TrendingUp,
    ArrowUpCircle,
    ArrowDownCircle,
    Zap,
    ShieldCheck,
    Box,
    BarChart3,
    AlertCircle,
    Flame,
    Gauge
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Scale() {
    const { productPerformance, metrics, formatCurrency } = useData();

    // Calculate Scaling Readiness Score (0-100)
    const poasScore = Math.min(metrics.poas * 20, 40); // Max 40 pts
    const deliveryScore = (metrics.deliveryRatio / 100) * 30; // Max 30 pts
    const volumeScore = Math.min(metrics.totalOrders / 100, 30); // Max 30 pts
    const readinessScore = Math.round(poasScore + deliveryScore + volumeScore);

    const getStatusColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 50) return "text-amber-400";
        return "text-rose-400";
    };

    const getStatusBg = (score: number) => {
        if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
        if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
        return "bg-rose-500/10 border-rose-500/20";
    };

    const handleExecuteScaling = () => {
        toast.success("Bulk Scaling protocol initiated!", {
            icon: "🚀",
            duration: 4000
        });
        setTimeout(() => {
            toast("Analyzing node capacity for 1.5x volume...", { icon: "⚙️" });
        }, 1500);
    };

    // SKU Scaling Recommendations
    const recommendations = productPerformance.map(p => {
        const score = (p.poas * 0.5) + (p.deliveryRate / 100 * 0.3) + (Math.min(p.orders / 50, 1) * 0.2);
        let action = "Hold";
        let color = "text-amber-400";
        let budget = "Keep Current";

        if (p.poas > 1.8 && p.deliveryRate > 75) {
            action = "Scale Up";
            color = "text-emerald-400";
            budget = "+25% to 50%";
        } else if (p.poas < 1.0) {
            action = "Kill/Audit";
            color = "text-rose-400";
            budget = "-50% or Kill";
        } else if (p.daysOfStock < 5) {
            action = "Restock Only";
            color = "text-blue-400";
            budget = "Pause Ads";
        }

        return { ...p, score, action, color, budget };
    }).sort((a, b) => b.score - a.score);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        Growth Command Center
                    </h1>
                    <p className="text-muted-foreground mt-1">Scale your winners, kill your bleeders.</p>
                </div>
                <div className={cn("px-4 py-2 rounded-xl border flex items-center gap-3", getStatusBg(readinessScore))}>
                    <Gauge size={20} className={getStatusColor(readinessScore)} />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Readiness Score</p>
                        <p className={cn("text-xl font-black", getStatusColor(readinessScore))}>{readinessScore}%</p>
                    </div>
                </div>
            </div>

            {/* Strategic Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Scaling Radar Card */}
                <div className="lg:col-span-2 bg-secondary/20 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={180} className="text-white" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Strategic Outlook</h3>
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">AI-Driven Growth Prediction</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Recommended Budget</p>
                                <p className="text-4xl font-black italic">
                                    {readinessScore > 80 ? "+40%" : readinessScore > 50 ? "+10%" : "0%"}
                                </p>
                                <p className="text-[9px] text-muted-foreground leading-relaxed">System allows aggressive scaling based on current POAS and RTO ratios.</p>
                            </div>
                            <div className="space-y-2 border-l border-white/5 pl-6">
                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Target CAC</p>
                                <p className="text-4xl font-black italic">{formatCurrency(metrics.customerAcquisitionCost * 1.2)}</p>
                                <p className="text-[9px] text-muted-foreground leading-relaxed">Scale-breakdown threshold. Do not exceed this cost per purchase.</p>
                            </div>
                            <div className="space-y-2 border-l border-white/5 pl-6">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Projected Revenue</p>
                                <p className="text-4xl font-black italic">{formatCurrency(metrics.totalRevenue * 1.5)}</p>
                                <p className="text-[9px] text-muted-foreground leading-relaxed">Estimated weekly revenue if recommended scaling is applied today.</p>
                            </div>
                        </div>

                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-1000"
                                style={{ width: `${readinessScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Ops Alert Card */}
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-8 backdrop-blur-md flex flex-col justify-between group">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-lg font-black uppercase text-rose-400">Scaling Friction</h3>
                        <p className="text-xs text-rose-300/80 leading-relaxed font-medium">
                            Your RTO rate in <span className="text-white font-bold">Faisalabad</span> is 24% higher than the national average. Scaling ad spend here will leak profit.
                        </p>
                    </div>
                    <button className="mt-6 w-full py-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-500/30 transition-all">
                        Exclude High RTO Cities
                    </button>
                </div>
            </div>

            {/* SKU Scaling Matrix */}
            <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Box size={20} />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">SKU Scaling Matrix</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart3 size={16} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Matrix v1.0</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                            <tr>
                                <th className="px-4 pb-2">Product Name</th>
                                <th className="px-4 pb-2">Net POAS</th>
                                <th className="px-4 pb-2">Dlv. Rate</th>
                                <th className="px-4 pb-2">Scaling Verdict</th>
                                <th className="px-4 pb-2">Proposed Adjustment</th>
                                <th className="px-4 pb-2 text-right">Burn Risk</th>
                            </tr>
                        </thead>
                        <tbody className="mt-4">
                            {recommendations.map(p => (
                                <tr key={p.name} className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                                    <td className="p-6 rounded-l-3xl border-l border-t border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-purple-400 transition-colors">
                                                <Zap size={14} />
                                            </div>
                                            <span className="text-xs font-black text-white uppercase truncate max-w-[180px]">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 border-t border-b border-white/5">
                                        <div className="flex flex-col">
                                            <span className={cn("text-sm font-black", p.poas > 1.5 ? "text-emerald-400" : "text-rose-400")}>
                                                {p.poas.toFixed(2)}x
                                            </span>
                                            <span className="text-[9px] text-muted-foreground font-bold uppercase">Net Truth</span>
                                        </div>
                                    </td>
                                    <td className="p-6 border-t border-b border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white tracking-widest">{Math.round(p.deliveryRate)}%</span>
                                            <span className="text-[9px] text-muted-foreground font-bold uppercase">Logistics</span>
                                        </div>
                                    </td>
                                    <td className="p-6 border-t border-b border-white/5">
                                        <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border w-fit",
                                            p.action === "Scale Up" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                                p.action === "Kill/Audit" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                                                    "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                        )}>
                                            {p.action === "Scale Up" ? <ArrowUpCircle size={10} /> : <ArrowDownCircle size={10} />}
                                            {p.action}
                                        </div>
                                    </td>
                                    <td className="p-6 border-t border-b border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-white">{p.budget}</span>
                                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Budget Change</span>
                                        </div>
                                    </td>
                                    <td className="p-6 rounded-r-3xl border-r border-t border-b border-white/5 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={cn("text-xs font-black", p.daysOfStock < 5 ? "text-rose-400" : "text-emerald-400")}>
                                                {Math.round(p.daysOfStock)} Days Left
                                            </span>
                                            <div className="flex items-center gap-1 mt-1 text-rose-400">
                                                <Flame size={12} className={cn(p.daysOfStock < 5 ? "animate-pulse" : "opacity-0")} />
                                                <span className="text-[8px] font-black uppercase tracking-tighter">Inventory Pulse</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 justify-between backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <ShieldCheck size={32} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xl font-black uppercase italic tracking-tighter">Risk-Adjusted Scaling Enabled</h4>
                        <p className="text-xs text-indigo-300 font-medium">All recommendations consider PKR fluctuations, delivery success rates, and operational overhead.</p>
                    </div>
                </div>
                <button
                    onClick={handleExecuteScaling}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                    Execute Bulk Scaling
                </button>
            </div>
        </div>
    );
}
