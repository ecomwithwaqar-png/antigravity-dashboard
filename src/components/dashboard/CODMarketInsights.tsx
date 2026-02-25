import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import {
    ShieldAlert,
    MapPin,
    Truck,
    PhoneCall,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Clock
} from "lucide-react";

export function CODMarketInsights() {
    const { metrics, citySummary, verificationSummary, formatCurrency } = useData();
    const m = metrics;

    // Get top 5 cities by order count
    const topCities = Object.entries(citySummary)
        .sort((a, b) => b[1].orders - a[1].orders)
        .slice(0, 5);

    const riskMetrics = [
        {
            label: "Cash in Transit",
            value: m.cashInTransit,
            sub: "Delivered but not settled",
            icon: Truck,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            label: "RTO Recovery Leak",
            value: m.rtoLoss,
            sub: "Shipping + Return fees lost",
            icon: TrendingDown,
            color: "text-rose-400",
            bg: "bg-rose-500/10"
        },
        {
            label: "Confirmation Gap",
            value: verificationSummary.pending,
            sub: "Requires Confirm-Call (CC)",
            icon: PhoneCall,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            isCount: true
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk & Operational Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {riskMetrics.map((rm) => (
                    <div key={rm.label} className="bg-secondary/20 border border-white/5 rounded-2xl p-5 backdrop-blur-sm group hover:border-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", rm.bg)}>
                                <rm.icon size={20} className={rm.color} />
                            </div>
                            {rm.label.includes("RTO") && (
                                <div className="p-1 rounded bg-rose-500/20 text-[10px] text-rose-400 animate-pulse">
                                    High Leakage
                                </div>
                            )}
                        </div>
                        <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{rm.label}</h4>
                        <p className="text-xl font-bold text-white mt-1">
                            {rm.isCount ? rm.value : formatCurrency(rm.value)}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{rm.sub}</p>
                    </div>
                ))}

                {/* Verification Health Card */}
                <div className="md:col-span-3 bg-secondary/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ShieldAlert size={120} className="text-white" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ShieldAlert size={18} className="text-purple-400" />
                                Operational Health (PK-COD)
                            </h3>
                            <p className="text-xs text-muted-foreground">Verification & confirmation ratio for current orders</p>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Confirmed</p>
                                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                    <CheckCircle2 size={14} />
                                    <span>{verificationSummary.confirmed}</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Unconfirmed</p>
                                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                    <Clock size={14} />
                                    <span>{verificationSummary.pending}</span>
                                </div>
                            </div>
                            <div className="text-center pl-8 border-l border-white/5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">CC Ratio</p>
                                <p className="text-xl font-black text-white">{Math.round(verificationSummary.confirmedRatio)}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Funnel Progress Bar */}
                    <div className="mt-6 h-2 bg-white/5 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `${verificationSummary.confirmedRatio}%` }}
                        />
                        <div
                            className="h-full bg-amber-500/40 transition-all duration-1000"
                            style={{ width: `${100 - verificationSummary.confirmedRatio}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* City Performance Leaderboard */}
            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col group hover:border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-purple-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-tighter">City Hotspots</h3>
                    </div>
                    <AlertTriangle size={14} className="text-white/20" />
                </div>

                <div className="space-y-4 flex-1">
                    {topCities.map(([city, data], idx) => (
                        <div key={city} className="flex flex-col gap-1.5 group/city">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-white/80 flex items-center gap-2">
                                    <span className="text-[10px] text-white/20">0{idx + 1}</span>
                                    {city}
                                </span>
                                <span className={cn(
                                    "font-mono font-bold",
                                    data.deliveryRate > 80 ? "text-emerald-400" : data.deliveryRate > 60 ? "text-amber-400" : "text-rose-400"
                                )}>
                                    {Math.round(data.deliveryRate)}% DLV
                                </span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000 delay-300 shadow-sm",
                                        data.deliveryRate > 80 ? "bg-emerald-500" : data.deliveryRate > 60 ? "bg-amber-500" : "bg-rose-500"
                                    )}
                                    style={{ width: `${data.deliveryRate}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 px-0.5">
                                <span>{data.orders} Orders</span>
                                <span>{formatCurrency(data.revenue)}</span>
                            </div>
                        </div>
                    ))}

                    {topCities.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-10">
                            <MapPin size={40} className="mb-2" />
                            <p className="text-xs">Connect Shopify to see city-wise performance</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>High Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>High RTO Risk</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
