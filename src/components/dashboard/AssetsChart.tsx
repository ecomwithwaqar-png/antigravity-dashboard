import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useData } from "@/context/DataContext";
import { useMemo } from "react";

export function AssetsChart() {
    const { data, columns, formatCurrency } = useData();
    const hasData = data.length > 0;

    const chartData = useMemo(() => {
        if (!hasData) {
            return [
                { name: "Electronics", value: 353000, color: "#8b5cf6" },
                { name: "Home", value: 120000, color: "#c084fc" },
                { name: "Beauty", value: 80000, color: "#fb923c" },
            ];
        }

        const categoryCol = columns.find(c => ["category", "type", "tag", "collection"].includes(c.toLowerCase()));
        const revenueCol = columns.find(c => ["revenue", "amount", "total", "price"].includes(c.toLowerCase()));

        const stats: Record<string, number> = {};
        data.forEach(row => {
            const cat = categoryCol ? String(row[categoryCol] || "Others") : "Others";
            const rev = revenueCol ? Number(row[revenueCol]) || 0 : 0;
            stats[cat] = (stats[cat] || 0) + rev;
        });

        const colors = ["#8b5cf6", "#a78bfa", "#c084fc", "#fb923c", "#fca5a5"];
        return Object.entries(stats)
            .map(([name, value], i) => ({
                name,
                value,
                color: colors[i % colors.length]
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [data, columns, hasData]);

    const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="h-[320px] w-full relative group">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-lg text-white">Revenue Mix</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">By Category</p>
                </div>
                {!hasData && (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                        DEMO
                    </span>
                )}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center top-10 pointer-events-none z-10">
                <div className="text-2xl font-bold text-white tracking-tight">
                    {totalValue >= 1000000
                        ? `$${(totalValue / 1000000).toFixed(1)}M`
                        : `$${(totalValue / 1000).toFixed(0)}K`}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Total Sales</div>
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                        stroke="rgba(0,0,0,0.2)"
                        strokeWidth={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#1e1b4b] border border-white/10 p-2 rounded-lg shadow-xl">
                                        <p className="text-[10px] text-purple-300 font-bold uppercase">{payload[0].name}</p>
                                        <p className="text-xs font-bold text-white">{formatCurrency(payload[0].value as number)}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Percentage labels */}
            <div className="flex justify-center gap-4 mt-1 flex-wrap">
                {chartData.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] text-white/60 font-medium">
                            {Math.round((item.value / totalValue) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

