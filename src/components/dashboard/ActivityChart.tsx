import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useData } from "@/context/DataContext";

const demoData = [
    { period: "Mon", revenue: 4000, spend: 2400 },
    { period: "Tue", revenue: 3000, spend: 1398 },
    { period: "Wed", revenue: 2000, spend: 5800 },
    { period: "Thu", revenue: 2780, spend: 3908 },
    { period: "Fri", revenue: 1890, spend: 4800 },
    { period: "Sat", revenue: 2390, spend: 3800 },
    { period: "Sun", revenue: 3490, spend: 4300 },
];

export function ActivityChart() {
    const { dailyProfitability, data, formatCurrency } = useData();
    const hasData = data.length > 0;
    const chartData = hasData ? dailyProfitability.slice(-7).map(d => ({
        period: d.period.split(" ")[0], // Short format
        revenue: d.revenue,
        spend: (d as any).adSpend || 0 // Assuming adSpend might be in the timeline or derived
    })) : demoData;

    return (
        <div className="h-[320px] w-full group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-lg text-white">Ad Efficiency</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Revenue vs Spend</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tight">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                        <span className="text-white/60">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        <span className="text-white/60">Spend</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={6}>
                    <XAxis
                        dataKey="period"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#1e1b4b] border border-white/10 p-3 rounded-xl shadow-2xl space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{payload[0].payload.period}</p>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[10px] text-purple-300">Revenue:</span>
                                            <span className="text-xs font-bold text-white">{formatCurrency(payload[0].value as number)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[10px] text-orange-300">Spend:</span>
                                            <span className="text-xs font-bold text-white">{formatCurrency(payload[1].value as number)}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                        barSize={10}
                        className="transition-all duration-300 group-hover:opacity-100 opacity-80"
                    />
                    <Bar
                        dataKey="spend"
                        fill="#fb923c"
                        radius={[4, 4, 0, 0]}
                        barSize={10}
                        className="transition-all duration-300 group-hover:opacity-100 opacity-60"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

