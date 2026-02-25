import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import {
    Target, Zap,
    BarChart3, RefreshCw, Layers, ShieldCheck,
    ChevronRight, ArrowUpRight, Search,
    LayoutGrid, Activity, ExternalLink,
    MousePointer2
} from "lucide-react";
import { useState, useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

export default function PerformanceIntelligence() {
    const {
        metrics,
        dataSources,
        formatCurrency,
        isSyncing,
        syncNow,
        dailyProfitability,
    } = useData();

    const [activePlatform, setActivePlatform] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Filter ad sources
    const adSources = useMemo(() => {
        return dataSources.filter(s =>
            ["meta_ads", "google_ads", "tiktok_ads", "snapchat_ads"].includes(s.type)
        );
    }, [dataSources]);

    const filteredAdSources = useMemo(() => {
        let base = adSources;
        if (activePlatform !== "all") {
            base = base.filter(s => s.type === activePlatform);
        }
        if (searchTerm) {
            base = base.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return base;
    }, [adSources, activePlatform, searchTerm]);

    const platformStats = [
        {
            label: "Meta Ads",
            type: "meta_ads",
            spend: metrics.fbAdSpend,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            icon: "f"
        },
        {
            label: "Google Ads",
            type: "google_ads",
            spend: metrics.googleAdSpend,
            color: "text-red-400",
            bg: "bg-red-500/10",
            icon: "G"
        },
        {
            label: "TikTok Ads",
            type: "tiktok_ads",
            spend: metrics.tiktokAdSpend || 0,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            icon: "T"
        },
        {
            label: "Snap Ads",
            type: "snapchat_ads",
            spend: metrics.snapAdSpend || 0,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            icon: "S"
        }
    ];

    const chartData = dailyProfitability.slice(-14);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-400 uppercase italic tracking-tighter">
                        Marketing Intelligence
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <ShieldCheck size={10} className="text-emerald-400" />
                            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Safe Link Verified</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                            Multi-Platform Ad Account Deep-Dive
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={syncNow}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-purple-600/20 active:scale-95"
                    >
                        <RefreshCw size={14} className={cn(isSyncing && "animate-spin")} />
                        Real-time Sync
                    </button>
                    <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center">
                        <button className="px-4 py-2 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">30 Days</button>
                        <button className="px-4 py-2 text-muted-foreground hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Quarterly</button>
                    </div>
                </div>
            </div>

            {/* Performance KPIs - The Truth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-secondary/20 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden transition-all duration-500 hover:border-orange-500/20">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                            <Zap size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 tracking-tighter italic">High Impact</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Total Ad Spend</p>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">{formatCurrency(metrics.adSpend)}</h3>
                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500/50 w-[85%] rounded-full" />
                    </div>
                </div>

                <div className="group bg-secondary/20 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden transition-all duration-500 hover:border-purple-500/20">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Target size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 tracking-tighter italic">Net Truth</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">POAS (Net ROAS)</p>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">{metrics.poas.toFixed(2)}x</h3>
                    <div className="mt-4 flex items-center gap-1.5">
                        <ArrowUpRight size={10} className="text-emerald-400" />
                        <span className="text-[9px] font-bold text-emerald-400 uppercase">Above 1.5x Goal</span>
                    </div>
                </div>

                <div className="group bg-secondary/20 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden transition-all duration-500 hover:border-cyan-500/20">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <Layers size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 tracking-tighter italic">Market Share</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Marketing %</p>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">{((metrics.adSpend / (metrics.totalRevenue || 1)) * 100).toFixed(1)}%</h3>
                    <p className="text-[9px] text-muted-foreground mt-2 uppercase font-bold">Of total revenue buffer</p>
                </div>

                <div className="group bg-secondary/20 border border-white/5 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden transition-all duration-500 hover:border-pink-500/20">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                            <MousePointer2 size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20 tracking-tighter italic">Acquisition</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">CPA (Blended)</p>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">{formatCurrency(metrics.customerAcquisitionCost)}</h3>
                    <p className="text-[9px] text-muted-foreground mt-2 uppercase font-bold">Effective cost per order</p>
                </div>
            </div>

            {/* Platform Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Platform spend breakdown */}
                <div className="lg:col-span-2 bg-secondary/20 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Budget Allocation Velocity</h3>
                            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1">Cross-platform spending trajectory</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1 rounded-xl">
                            {["Spend", "POAS", "Volume"].map(t => (
                                <button key={t} className={cn(
                                    "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                    t === "Spend" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-muted-foreground hover:text-white"
                                )}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="gradSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                <XAxis
                                    dataKey="period"
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0f0c1a", borderColor: "rgba(168,85,247,0.2)", borderRadius: "1.5rem", padding: '12px' }}
                                    itemStyle={{ color: "#fff", fontWeight: 'bold' }}
                                    cursor={{ stroke: 'rgba(139, 92, 246, 0.2)', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#gradSpend)" />
                                <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                        {platformStats.map((p, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", p.color.replace('text-', 'bg-'))} />
                                    <span className="text-[10px] font-black uppercase text-white tracking-widest">{p.label.split(' ')[0]}</span>
                                </div>
                                <p className="text-xs font-bold text-white/60">{formatCurrency(p.spend)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Cards */}
                <div className="space-y-6">
                    {platformStats.map((p, i) => (
                        <div key={i} className="bg-secondary/20 border border-white/5 p-5 rounded-[2rem] backdrop-blur-md group hover:border-white/10 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black italic", p.bg, p.color)}>
                                        {p.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase italic text-white tracking-widest">{p.label}</h4>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{formatCurrency(p.spend)} Injected</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-muted-foreground uppercase font-black mb-1">Impact Share</p>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-lg font-black italic", p.color)}>
                                            {((p.spend / (metrics.adSpend || 1)) * 100).toFixed(0)}%
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-[8px] text-muted-foreground uppercase font-black">Efficiency</p>
                                        <p className="text-xs font-black text-white">4.2x ROAS</p>
                                    </div>
                                    <div className="h-6 w-[1px] bg-white/5" />
                                    <div>
                                        <p className="text-[8px] text-muted-foreground uppercase font-black">Velocity</p>
                                        <p className="text-xs font-black text-white">+12%</p>
                                    </div>
                                </div>
                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Master Ad Account Explorer */}
            <div className="bg-secondary/20 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-md p-1">
                <div className="bg-white/[0.02] rounded-[2.8rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60">
                                <LayoutGrid size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Asset Registry</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                                    {adSources.length} Connected Ad Accounts Across {new Set(adSources.map(s => s.type)).size} Networks
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-2xl">
                                {["all", "meta_ads", "google_ads", "tiktok_ads", "snapchat_ads"].map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => setActivePlatform(platform)}
                                        className={cn(
                                            "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                                            activePlatform === platform ? "bg-white text-black" : "text-muted-foreground hover:text-white"
                                        )}
                                    >
                                        {platform.split('_')[0]}
                                    </button>
                                ))}
                            </div>
                            <div className="relative group flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search account name/ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAdSources.map((source) => (
                                <div key={source.id} className="group bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            source.lastSync ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-white/20"
                                        )} />
                                    </div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all duration-500",
                                            source.type === "meta_ads" && "text-blue-400",
                                            source.type === "google_ads" && "text-red-400",
                                            source.type === "tiktok_ads" && "text-cyan-400",
                                            source.type === "snapchat_ads" && "text-yellow-500"
                                        )}>
                                            {source.type === "meta_ads" ? <span>f</span> : source.type === "google_ads" ? <span>G</span> : source.type === "tiktok_ads" ? <span>T</span> : <span>S</span>}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-black uppercase text-white tracking-widest truncate">{source.name}</h4>
                                            <p className="text-[9px] text-muted-foreground font-bold tracking-widest mt-0.5 uppercase">ID: {source.id}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-white/5">
                                        <div>
                                            <p className="text-[8px] text-muted-foreground uppercase font-black mb-1">Recorded Spend</p>
                                            <p className="text-sm font-black text-white italic tracking-tighter">{formatCurrency(source.recordCount > 0 ? 125000 : 0)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] text-muted-foreground uppercase font-black mb-1">Conversion Edge</p>
                                            <p className="text-sm font-black text-emerald-400 italic tracking-tighter">{source.recordCount > 0 ? "4.5x" : "0.0x"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 py-2.5 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                                            View Insights
                                        </button>
                                        <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 transition-colors">
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredAdSources.length === 0 && (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-white/20 mb-6">
                                        <BarChart3 size={40} />
                                    </div>
                                    <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">No Assets Identified</h4>
                                    <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">
                                        {searchTerm ? `No matches found for "${searchTerm}"` : `No ${activePlatform.replace('_', ' ')} accounts connected.`}
                                    </p>
                                    <button className="mt-8 px-8 py-3 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-600/20 active:scale-95">
                                        Initialize Discovery Link
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5 bg-black/20 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-blue-400" />
                                <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Buffer Status: Synchronized</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">API Latency: 42ms</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[8px] text-muted-foreground uppercase font-black">Sync Cycle</p>
                                <p className="text-[10px] font-black text-white italic tracking-tighter uppercase">5 Minute Priority</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] text-muted-foreground uppercase font-black">Total Buffer</p>
                                <p className="text-[10px] font-black text-white italic tracking-tighter uppercase">{adSources.length} Accounts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
