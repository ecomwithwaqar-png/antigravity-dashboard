import { useData } from "@/context/DataContext";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import { TrendingUp, Activity, Target, Zap, Waves, ShieldCheck, Gauge, ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function Performance() {
    const { data, metrics, formatCurrency, productPerformance } = useData();

    const chartData = useMemo(() => {
        if (data.length === 0) return [];
        return data.map((item, i) => ({
            name: i + 1,
            value: parseFloat(item.revenue || item.amount || "0"),
            efficiency: 70 + Math.random() * 20,
            volume: 200 + Math.random() * 800
        }));
    }, [data]);

    const performanceStats = [
        { label: "Net Performance", value: "+14.8%", sub: "Above Benchmark", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Ops Efficiency", value: "96.4%", sub: "Logistics Peak", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Growth Index", value: "3.8x", sub: "Scale Ready", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10" },
        { label: "Target ROAS", value: "4.2", sub: "Marketing Goal", icon: Target, color: "text-orange-400", bg: "bg-orange-500/10" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-400 uppercase italic tracking-tighter">
                        Performance Intelligence
                    </h1>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em] mt-1 flex items-center gap-2">
                        <Waves size={14} className="text-purple-500" />
                        Strategic Metric Deep-Dive
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1 rounded-2xl">
                    <button className="px-4 py-2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-600/20">Live Sync</button>
                    <button className="px-4 py-2 text-muted-foreground hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">7D View</button>
                    <button className="px-4 py-2 text-muted-foreground hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">30D View</button>
                </div>
            </div>

            {/* Performance Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceStats.map((stat, i) => (
                    <div key={i} className="group bg-secondary/20 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md relative overflow-hidden transition-all duration-500 hover:border-purple-500/20">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                                <p className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1 font-bold uppercase">
                                    <ArrowUpRight size={10} className="text-emerald-500" />
                                    {stat.sub}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* High Octane Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Trend Line */}
                <div className="lg:col-span-2 bg-secondary/20 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col space-y-8 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Growth Velocity</h3>
                            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1">Real-time revenue scalability audit</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <Gauge size={12} className="text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">Optimal Flow</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="performanceGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0f0c1a", borderColor: "rgba(168,85,247,0.2)", borderRadius: "1.5rem", padding: '12px' }}
                                    itemStyle={{ color: "#c084fc", fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#c084fc" strokeWidth={4} fillOpacity={1} fill="url(#performanceGrad)" />
                                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Efficiency Gauge */}
                <div className="bg-secondary/20 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col space-y-8">
                    <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Network Precision</h3>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1">Operational delivery hit-rate</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-10">
                        <div className="relative flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full border-[10px] border-white/5 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-5xl font-black italic tracking-tighter">96.4</span>
                                    <span className="text-xl font-black block text-muted-foreground">%</span>
                                </div>
                            </div>
                            <svg className="absolute w-56 h-56 -rotate-90">
                                <circle
                                    cx="112" cy="112" r="95"
                                    fill="transparent"
                                    stroke="url(#efficiencyGrad)"
                                    strokeWidth="10"
                                    strokeDasharray="600"
                                    strokeDashoffset={600 - (600 * 0.96)}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="efficiencyGrad" x1="1" y1="0" x2="0" y2="0">
                                        <stop offset="0%" stopColor="#c084fc" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Trust Factor</span>
                                </div>
                                <span className="text-[10px] font-black uppercase text-emerald-400">High Reliability</span>
                            </div>
                            <p className="text-[9px] text-muted-foreground uppercase leading-relaxed font-bold">Your current fulfillment precision is benchmarking 14% higher than regional COD competitors.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Efficiency Table Preview */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/60">
                        <Activity size={20} />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Efficiency Matrix</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {productPerformance.slice(0, 3).map((p, i) => (
                        <div key={i} className="p-6 bg-black/20 rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">{p.name}</span>
                                <span className="text-xs font-black text-white">{Math.round(p.deliveryRate)}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                    style={{ width: `${p.deliveryRate}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
