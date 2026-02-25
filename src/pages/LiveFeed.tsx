import { useData } from "@/context/DataContext";
import {
    Radio,
    Zap,
    ShieldCheck,
    Ship,
    Flame,
    Navigation,
    ShoppingBag,
    Trophy
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LiveFeed() {
    const { data, metrics, formatCurrency } = useData();
    const [liveOrders, setLiveOrders] = useState<any[]>([]);

    // Performance metrics for the "Race"
    const deliveredCount = metrics.totalDelivered;
    const returnedCount = metrics.totalReturned;
    const totalCount = metrics.totalOrders || 1;

    const deliveryRatio = (deliveredCount / totalCount) * 100;
    const returnRatio = (returnedCount / totalCount) * 100;

    // Daily Goal simulation (Target: 1.5M PKR or specified)
    const dailyTarget = 1500000;
    const dailyProgress = (metrics.totalRevenue / dailyTarget) * 100;
    const isGoalAchieved = dailyProgress >= 100;

    useEffect(() => {
        if (data.length > 0) {
            // Take initial batch
            setLiveOrders(data.slice(0, 10));

            // Simulate real-time arrival of orders from existing data pool
            const interval = setInterval(() => {
                const randomOrder = data[Math.floor(Math.random() * data.length)];
                const orderWithTime = {
                    ...randomOrder,
                    _liveTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    _isNew: true
                };

                setLiveOrders(prev => {
                    const next = [orderWithTime, ...prev.map(o => ({ ...o, _isNew: false }))];
                    return next.slice(0, 8);
                });
            }, 8000);

            return () => clearInterval(interval);
        }
    }, [data]);

    return (
        <div className="min-h-screen -mt-10 pt-10 pb-20 space-y-8 bg-[#0a0514] text-white">
            {/* Top War Room Ticker */}
            <div className="bg-purple-600/10 border-y border-purple-500/20 py-2 overflow-hidden relative">
                <div className="flex animate-infinite-scroll whitespace-nowrap gap-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/60">
                            <Navigation size={12} className="rotate-90" />
                            <span>System Active // PK-COD Node Status: Optimal</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Global Settlement Sync: 100%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 lg:px-0">

                {/* Main Action Panel */}
                <div className="lg:col-span-2 space-y-8">
                    {/* The Executive Target Card */}
                    <div className={cn(
                        "relative overflow-hidden rounded-[2.5rem] p-10 border transition-all duration-1000",
                        isGoalAchieved
                            ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                            : "bg-white/[0.02] border-white/5 shadow-2xl"
                    )}>
                        {/* Achieve Glow */}
                        {isGoalAchieved && (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent animate-pulse" />
                        )}

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Daily Profit Target</h2>
                                    <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Consolidated Enterprise Revenue</p>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border-2 animate-bounce transition-colors",
                                    isGoalAchieved ? "border-emerald-500 text-emerald-400" : "border-white/10 text-white/20"
                                )}>
                                    <Trophy size={32} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-0">
                                        <span className="text-7xl font-black tracking-tighter text-white">
                                            {formatCurrency(metrics.totalRevenue)}
                                        </span>
                                        <span className="text-xl font-bold text-white/20 block">/ {formatCurrency(dailyTarget)}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-5xl font-black italic",
                                            isGoalAchieved ? "text-emerald-400" : "text-purple-400"
                                        )}>
                                            {dailyProgress.toFixed(0)}%
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Achieved</p>
                                    </div>
                                </div>

                                {/* Mega Progress Bar */}
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={cn(
                                            "h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(168,85,247,0.5)]",
                                            isGoalAchieved ? "bg-emerald-500" : "bg-gradient-to-r from-purple-600 to-indigo-500"
                                        )}
                                        style={{ width: `${Math.min(dailyProgress, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Logistics Race */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-purple-500/10 transition-colors">
                                <Ship size={80} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter">Delivery Force</h3>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-5xl font-black tracking-tighter">{deliveredCount}</span>
                                    <span className="text-xs text-muted-foreground block uppercase font-bold tracking-widest">Confirmed Logistics Success</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                        style={{ width: `${deliveryRatio}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-rose-500/10 transition-colors">
                                <Flame size={80} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                                        <Zap size={20} />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter text-rose-400">RTO Leakage</h3>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-5xl font-black tracking-tighter text-rose-400">{returnedCount}</span>
                                    <span className="text-xs text-muted-foreground block uppercase font-bold tracking-widest">Active Profit Loss</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                                        style={{ width: `${returnRatio}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Activity Column */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Live Transaction Stream</h3>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-4">
                        {liveOrders.map((order, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all duration-500",
                                    order._isNew
                                        ? "bg-purple-600/20 border-purple-500/40 scale-[1.02] shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                                        : "bg-white/5 border-white/5 opacity-80"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                            <ShoppingBag size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase">{order.customer || "Order #" + (order.order_id || i)}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{order.city || "Pakistan"}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-emerald-400">{formatCurrency(order.revenue || order.amount || 0)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                    <span className="text-[9px] text-muted-foreground font-mono">{order._liveTime || "00:00:00"}</span>
                                    <div className="flex items-center gap-1">
                                        <Radio size={10} className="text-purple-400 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">Captured</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {liveOrders.length === 0 && (
                            <div className="py-20 text-center opacity-20">
                                <Zap size={48} className="mx-auto mb-4" />
                                <p className="text-xs uppercase font-black tracking-widest">Awaiting Pulse...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
