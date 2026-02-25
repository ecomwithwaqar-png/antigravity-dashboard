import { useData } from "@/context/DataContext";
import {
    Truck,
    Zap,
    Navigation,
    ShieldCheck,
    MapPin,
    ArrowRightCircle,
    BarChart
} from "lucide-react";

export function LogisticsSmartRouter() {
    const { courierInsights } = useData();
    const { winners, stats } = courierInsights;

    // Get top 5 cities with most data
    const topCities = Object.keys(winners)
        .sort((a, b) => {
            const totalA = Object.values(stats[a]).reduce((acc: number, curr: any) => acc + curr.total, 0);
            const totalB = Object.values(stats[b]).reduce((acc: number, curr: any) => acc + curr.total, 0);
            return totalB - totalA;
        })
        .slice(0, 4);

    if (topCities.length === 0) return null;

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-white/10 transition-all duration-500">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Navigation size={14} className="text-blue-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-white uppercase tracking-tight">Logistics Smart-Router</h4>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} />
                    Auto-Prescriptive
                </div>
            </div>

            <div className="p-5 space-y-6">
                <div className="space-y-4">
                    {topCities.map((city) => {
                        const winner = winners[city];
                        const courierStats = stats[city][winner];
                        const rate = (courierStats.delivered / courierStats.total) * 100;

                        return (
                            <div key={city} className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group/city hover:bg-white/[0.08] transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <MapPin size={14} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase">{city}</p>
                                            <p className="text-[9px] text-muted-foreground font-bold">Recommended Route</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <ShieldCheck size={12} />
                                            <span className="text-sm font-black">{Math.round(rate)}% Success</span>
                                        </div>
                                        <p className="text-[8px] text-muted-foreground uppercase font-black">Historical Delivery</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 rounded bg-purple-600/20 text-[10px] font-black text-purple-400 uppercase border border-purple-500/20">
                                            {winner}
                                        </div>
                                        <ArrowRightCircle size={10} className="text-muted-foreground" />
                                        <span className="text-[10px] text-white/60 font-medium">Best Performer</span>
                                    </div>
                                    <button className="text-[9px] text-blue-400 font-black uppercase tracking-widest hover:text-blue-300 transition-colors">
                                        Route 100%
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3">
                    <BarChart size={16} className="text-indigo-400 mt-1 shrink-0" />
                    <div>
                        <p className="text-[10px] text-indigo-200/90 font-bold leading-relaxed">
                            Pro Tip: Switch to {winners[topCities[0]]} for {topCities[0]} orders to reduce RTO by an estimated 12% this week.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white/[0.04] border-t border-white/5 flex items-center justify-center gap-2 text-[8px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                <Truck size={10} className="text-blue-400" />
                <span>Logistics optimization protocol v2.1</span>
            </div>
        </div>
    );
}
