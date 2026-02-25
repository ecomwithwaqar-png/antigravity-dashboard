import { useState } from "react";
import { useData } from "@/context/DataContext";
import { CURRENCY_CONFIG } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import {
    TrendingUp, TrendingDown, DollarSign, Package,
    Truck, RotateCcw, Target, Percent,
    PiggyBank, BarChart3, Zap, Users,
    Calendar, CalendarDays, CalendarRange, Wallet, Coins
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

import { AdSpendManager } from "./AdSpendManager";
import { SkuCogsManager } from "./SkuCogsManager";

// ─── Metric Tile ─────────────────────────────────────────────────────────────

interface MetricTileProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
    trend?: "up" | "down" | "neutral";
    trendLabel?: string;
    size?: "normal" | "large";
    glowColor?: string;
}

function MetricTile({
    label, value, icon, iconColor, iconBg,
    trend, trendLabel, size = "normal", glowColor,
}: MetricTileProps) {
    return (
        <div className={cn(
            "relative rounded-2xl border border-white/5 bg-secondary/20 backdrop-blur-sm p-5 group hover:border-white/10 transition-all duration-500 overflow-hidden",
            size === "large" && "md:col-span-2"
        )}>
            {glowColor && (
                <div className={cn(
                    "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700",
                    glowColor
                )} />
            )}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
                    <p className={cn(
                        "font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70",
                        size === "large" ? "text-3xl" : "text-2xl"
                    )}>
                        {value}
                    </p>
                    {trend && trendLabel && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className={cn(
                                "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                                trend === "up" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                    : trend === "down" ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                        : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                            )}>
                                {trend === "up" ? <TrendingUp size={10} /> : trend === "down" ? <TrendingDown size={10} /> : <Target size={10} />}
                                {trendLabel}
                            </span>
                        </div>
                    )}
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110", iconBg)}>
                    <span className={iconColor}>{icon}</span>
                </div>
            </div>
        </div>
    );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
            <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} style={{ width: `${pct}%` }} />
        </div>
    );
}

// ─── Profitability Timeline ──────────────────────────────────────────────────

type TimeGranularity = "daily" | "weekly" | "monthly";

function ProfitabilityTimeline() {
    const { dailyProfitability, weeklyProfitability, monthlyProfitability, formatCurrency, currency, data } = useData();
    const [granularity, setGranularity] = useState<TimeGranularity>("daily");
    const sym = CURRENCY_CONFIG?.[currency]?.symbol || "$";

    const hasData = data.length > 0;

    const timeData = granularity === "daily" ? dailyProfitability
        : granularity === "weekly" ? weeklyProfitability
            : monthlyProfitability;

    // Demo data for when no data is loaded
    const demoData = [
        { period: "Feb 17", revenue: 4200, grossProfit: 1680, netProfit: 1290, orders: 15 },
        { period: "Feb 18", revenue: 3800, grossProfit: 1520, netProfit: 1180, orders: 12 },
        { period: "Feb 19", revenue: 5100, grossProfit: 2040, netProfit: 1585, orders: 18 },
        { period: "Feb 20", revenue: 4700, grossProfit: 1880, netProfit: 1455, orders: 16 },
        { period: "Feb 21", revenue: 6200, grossProfit: 2480, netProfit: 1920, orders: 22 },
        { period: "Feb 22", revenue: 5500, grossProfit: 2200, netProfit: 1705, orders: 19 },
        { period: "Feb 23", revenue: 4900, grossProfit: 1960, netProfit: 1540, orders: 17 },
    ];

    const chartData = hasData ? (timeData as any) : demoData;

    // Summary of best/worst periods
    const bestPeriod = chartData.length > 0
        ? chartData.reduce((a: any, b: any) => (b.netProfit > a.netProfit ? b : a))
        : null;
    const worstPeriod = chartData.length > 0
        ? chartData.reduce((a: any, b: any) => (b.netProfit < a.netProfit ? b : a))
        : null;

    const tabs: { key: TimeGranularity; label: string; icon: React.ReactNode }[] = [
        { key: "daily", label: "Daily", icon: <Calendar size={12} /> },
        { key: "weekly", label: "Weekly", icon: <CalendarDays size={12} /> },
        { key: "monthly", label: "Monthly", icon: <CalendarRange size={12} /> },
    ];

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl backdrop-blur-sm p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-purple-400" />
                        Profitability Timeline
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {hasData ? "Computed from your data" : "Demo — connect a source"}
                    </p>
                </div>
                <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/5">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setGranularity(tab.key)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                granularity === tab.key
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Highlights */}
            {bestPeriod && worstPeriod && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-emerald-400 font-semibold uppercase mb-1">Best Period</p>
                        <p className="text-sm font-bold text-white">{bestPeriod.period}</p>
                        <p className="text-xs text-emerald-300">{formatCurrency(bestPeriod.netProfit)} net profit</p>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-rose-400 font-semibold uppercase mb-1">Lowest Period</p>
                        <p className="text-sm font-bold text-white">{worstPeriod.period}</p>
                        <p className="text-xs text-rose-300">{formatCurrency(worstPeriod.netProfit)} net profit</p>
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradNetProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="period" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${sym}${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e1b4b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                            itemStyle={{ color: "#fff" }}
                            formatter={(value: number) => [`${sym}${value.toFixed(2)}`, ""]}
                            labelStyle={{ color: "#a78bfa" }}
                        />
                        <Legend wrapperStyle={{ fontSize: "10px" }} />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#gradRevenue)" />
                        <Area type="monotone" dataKey="grossProfit" name="Gross Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gradProfit)" />
                        <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#gradNetProfit)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Tabular breakdown */}
            {chartData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/5 text-muted-foreground">
                                <th className="text-left py-2 px-2 font-medium">Period</th>
                                <th className="text-right py-2 px-2 font-medium">Revenue</th>
                                <th className="text-right py-2 px-2 font-medium">Gross</th>
                                <th className="text-right py-2 px-2 font-medium">Net</th>
                                <th className="text-right py-2 px-2 font-medium">Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-2 px-2 text-white/80 font-medium">{row.period}</td>
                                    <td className="py-2 px-2 text-right text-white">{formatCurrency(row.revenue)}</td>
                                    <td className="py-2 px-2 text-right text-emerald-400">{formatCurrency(row.grossProfit)}</td>
                                    <td className={cn("py-2 px-2 text-right font-medium", row.netProfit >= 0 ? "text-cyan-400" : "text-rose-400")}>
                                        {formatCurrency(row.netProfit)}
                                    </td>
                                    <td className="py-2 px-2 text-right text-white/60">{row.orders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── Main Metrics Overview ──────────────────────────────────────────────────

interface MetricsOverviewProps {
    view?: "all" | "pillars" | "detailed";
}

export function MetricsOverview({ view = "all" }: MetricsOverviewProps) {
    const { metrics, data, formatCurrency, currency } = useData();
    const hasData = data.length > 0;
    const m = metrics;
    const fmt = (val: number | undefined) => formatCurrency(val || 0);

    if (view === "pillars") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricTile label="Total Revenue" value={fmt(m.totalRevenue)} icon={<DollarSign size={18} />} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" trend="up" trendLabel={hasData ? "Live" : "+10%"} glowColor="bg-emerald-500" />
                <MetricTile label="Net Profit" value={fmt(m.netProfit)} icon={<Target size={18} />} iconColor="text-purple-400" iconBg="bg-purple-500/10" trend={m.netMargin > 20 ? "up" : m.netMargin > 10 ? "neutral" : "down"} trendLabel={`${m.netMargin.toFixed(1)}%`} glowColor="bg-purple-500" />
                <MetricTile label="Cash in Hand" value={fmt(m.cashInHand)} icon={<Wallet size={18} />} iconColor="text-cyan-400" iconBg="bg-cyan-500/10" trend="neutral" trendLabel="After Ledger" glowColor="bg-cyan-500" />
                <MetricTile label="Total ROAS" value={`${m.roas.toFixed(1)}x`} icon={<Zap size={18} />} iconColor="text-orange-400" iconBg="bg-orange-500/10" trend={m.roas > 3 ? "up" : "down"} trendLabel={m.roas > 3 ? "Healthy" : "Low"} glowColor="bg-orange-500" />
                <MetricTile label="Overall CAC" value={fmt(m.customerAcquisitionCost)} icon={<Users size={18} />} iconColor="text-pink-400" iconBg="bg-pink-500/10" trend={m.customerAcquisitionCost < 20 ? "up" : "down"} trendLabel={m.customerAcquisitionCost < 20 ? "Optimal" : "High"} glowColor="bg-pink-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <BarChart3 size={18} className="text-purple-400" />
                        Detailed Performance
                        <span className="text-xs text-muted-foreground font-normal ml-1">({CURRENCY_CONFIG?.[currency]?.symbol || "$"} {currency})</span>
                    </h3>
                </div>
            </div>

            {/* Revenue & Profitability */}
            <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <DollarSign size={12} className="text-emerald-400" />
                    Revenue & Profitability Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricTile label="Gross Profit" value={fmt(m.grossProfit)} icon={<PiggyBank size={18} />} iconColor="text-green-400" iconBg="bg-green-500/10" trend={m.grossMargin > 30 ? "up" : "down"} trendLabel={`${m.grossMargin.toFixed(1)}% margin`} glowColor="bg-green-500" />
                    <MetricTile label="Avg. Order Value" value={fmt(m.avgOrderValue)} icon={<Package size={18} />} iconColor="text-blue-400" iconBg="bg-blue-500/10" trend="up" trendLabel={`${m.totalOrders} orders`} glowColor="bg-blue-500" />
                    <MetricTile label="Shipping Cost" value={fmt(m.totalShippingCost)} icon={<Truck size={18} />} iconColor="text-blue-300" iconBg="bg-blue-500/10" trend="neutral" trendLabel="200 per order" glowColor="bg-blue-400" />
                    <MetricTile label="Est. Lifetime Value" value={fmt(m.lifetimeValue)} icon={<TrendingUp size={18} />} iconColor="text-cyan-400" iconBg="bg-cyan-500/10" trend="up" trendLabel={`${(m.lifetimeValue / (m.customerAcquisitionCost || 1)).toFixed(1)}x CAC`} glowColor="bg-cyan-500" />
                </div>
            </div>

            {/* Capital & Cash Flow */}
            <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Wallet size={12} className="text-purple-400" />
                    Capital & Cash Flow Tally
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricTile label="Capital Outflow" value={fmt(m.totalCapitalOutflow)} icon={<TrendingDown size={18} />} iconColor="text-rose-400" iconBg="bg-rose-500/10" trend="neutral" trendLabel="From Ledger" glowColor="bg-rose-500" />
                    <MetricTile label="Inventory Invest" value={fmt(m.inventoryInvestment)} icon={<Package size={18} />} iconColor="text-blue-400" iconBg="bg-blue-500/10" trend="neutral" trendLabel="Asset value" glowColor="bg-blue-500" />
                    <MetricTile label="Actual Cash" value={fmt(m.cashInHand)} icon={<Wallet size={18} />} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" trend="neutral" trendLabel="Take home" glowColor="bg-emerald-500" />
                    <MetricTile label="USDT Volume" value={fmt(m.usdtInvestment)} icon={<Coins size={18} />} iconColor="text-amber-400" iconBg="bg-amber-500/10" trend="neutral" trendLabel="Digital capital" glowColor="bg-amber-500" />
                </div>
            </div>

            {/* Delivery & Returns */}
            <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Truck size={12} className="text-blue-400" />
                    Operations & Fulfillment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative rounded-2xl border border-white/5 bg-secondary/20 backdrop-blur-sm p-5 group hover:border-white/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Delivery Ratio</p>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Truck size={14} className="text-emerald-400" /></div>
                        </div>
                        <p className="text-2xl font-bold text-white">{m.deliveryRatio.toFixed(1)}%</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{m.totalDelivered} of {m.totalOrders} delivered</p>
                        <MiniBar value={m.deliveryRatio} max={100} color="bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    </div>
                    <div className="relative rounded-2xl border border-white/5 bg-secondary/20 backdrop-blur-sm p-5 group hover:border-white/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Return Ratio</p>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center"><RotateCcw size={14} className="text-rose-400" /></div>
                        </div>
                        <p className="text-2xl font-bold text-white">{m.returnRatio.toFixed(1)}%</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{m.totalReturned} returned / refunded</p>
                        <MiniBar value={m.returnRatio} max={30} color="bg-gradient-to-r from-rose-500 to-rose-400" />
                    </div>
                    <div className="relative rounded-2xl border border-white/5 bg-secondary/20 backdrop-blur-sm p-5 group hover:border-white/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Orders</p>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Package size={14} className="text-amber-400" /></div>
                        </div>
                        <p className="text-2xl font-bold text-white">{m.totalPending || 0}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">Awaiting fulfillment</p>
                        <MiniBar value={m.totalPending || 0} max={m.totalOrders || 1} color="bg-gradient-to-r from-amber-500 to-amber-400" />
                    </div>
                    <div className="relative rounded-2xl border border-white/5 bg-secondary/20 backdrop-blur-sm p-5 group hover:border-white/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gross Margin</p>
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Percent size={14} className="text-purple-400" /></div>
                        </div>
                        <p className="text-2xl font-bold text-white">{m.grossMargin.toFixed(1)}%</p>
                        <p className="text-[11px] text-muted-foreground mt-1">Efficiency ratio</p>
                        <MiniBar value={m.grossMargin} max={100} color="bg-gradient-to-r from-purple-500 to-purple-400" />
                    </div>
                </div>
            </div>

            {/* Ad Spend & SKU Management */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <AdSpendManager />
                    <SkuCogsManager />
                </div>
                <div className="lg:col-span-3">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MetricTile label="Total Ad Spend" value={fmt(m.adSpend)} icon={<Zap size={18} />} iconColor="text-orange-400" iconBg="bg-orange-500/10" trend={m.roas > 3 ? "up" : "down"} trendLabel={`${m.roas.toFixed(1)}x ROAS`} glowColor="bg-orange-500" />
                            <MetricTile label="Marketing Share" value={`${((m.adSpend / (m.totalRevenue || 1)) * 100).toFixed(1)}%`} icon={<Percent size={18} />} iconColor="text-pink-400" iconBg="bg-pink-500/10" trend="neutral" trendLabel="of Revenue" glowColor="bg-pink-500" />
                        </div>

                        {(m.fbAdSpend > 0 || m.googleAdSpend > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <span className="font-bold text-lg">f</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">Meta Spend</p>
                                            <p className="text-xl font-bold text-white">{fmt(m.fbAdSpend)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Share</p>
                                        <p className="text-sm font-semibold text-blue-400">{((m.fbAdSpend / (m.adSpend || 1)) * 100).toFixed(0)}%</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                                            <span className="font-bold text-lg">G</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">Google Spend</p>
                                            <p className="text-xl font-bold text-white">{fmt(m.googleAdSpend)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground uppercase font-medium">Share</p>
                                        <p className="text-sm font-semibold text-red-400">{((m.googleAdSpend / (m.adSpend || 1)) * 100).toFixed(0)}%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profitability Timeline */}
            <ProfitabilityTimeline />
        </div>
    );
}
