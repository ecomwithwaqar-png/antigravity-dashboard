import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useData } from "@/context/DataContext";
import { CURRENCY_CONFIG } from "@/context/DataContext";

const demoData = [
    { period: "Day 1", revenue: 1200 },
    { period: "Day 2", revenue: 2100 },
    { period: "Day 3", revenue: 1800 },
    { period: "Day 4", revenue: 3200 },
    { period: "Day 5", revenue: 2400 },
    { period: "Day 6", revenue: 2800 },
    { period: "Day 7", revenue: 3400 },
];

export function RevenueChart() {
    const { dailyProfitability, data, currency } = useData();
    const hasData = data.length > 0;
    const chartData = hasData ? dailyProfitability : demoData;
    const sym = CURRENCY_CONFIG?.[currency]?.symbol || "$";

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1e1b4b] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-2xl">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">{payload[0].payload.period}</p>
                    <p className="text-sm font-bold text-purple-400">{sym}{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[320px] w-full relative group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-lg text-white">Revenue Growth</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Daily Performance</p>
                </div>
                {!hasData && (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                        DEMO MODE
                    </span>
                )}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="strokeRevenue" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="period"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={['dataMin - 500', 'dataMax + 500']}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139, 92, 246, 0.2)', strokeWidth: 2 }} />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="url(#strokeRevenue)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Decorative glow element */}
            <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700"></div>
        </div>
    );
}

