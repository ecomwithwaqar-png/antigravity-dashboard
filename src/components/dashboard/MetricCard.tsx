import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";

interface MetricCardProps {
    title: string;
    value: string;
    subValue?: string;
    trend: "up" | "down";
    trendValue: string;
    color?: "purple" | "pink" | "blue" | "default";
    delay?: number;
}

// import { motion } from "framer-motion";

export function MetricCard({ title, value, subValue, trend, trendValue, color = "default" }: MetricCardProps) {
    const isUp = trend === "up";

    const gradients = {
        default: "from-secondary/50 to-secondary/30",
        purple: "from-purple-500/20 to-purple-900/20 border-purple-500/30",
        pink: "from-pink-500/20 to-pink-900/20 border-pink-500/30",
        blue: "from-blue-500/20 to-blue-900/20 border-blue-500/30",
    };

    return (
        <div
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5, delay: delay * 0.1 }}
            className={cn(
                "rounded-2xl p-6 border backdrop-blur-md relative overflow-hidden group",
                color === "default" ? "bg-secondary/20 border-white/5" : `bg-gradient-to-br ${gradients[color]}`
            )}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h3 className="text-muted-foreground text-sm font-medium mb-4">{title}</h3>

            <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    {value}
                </span>
                {subValue && <span className="text-sm text-muted-foreground mb-1.5">{subValue}</span>}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium">
                <span className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5",
                    isUp ? "text-emerald-400" : "text-rose-400"
                )}>
                    {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {trendValue}
                </span>
                <span className="text-muted-foreground/60">
                    {isUp ? "more then avg" : "less then avg"}
                </span>
            </div>
        </div>
    );
}
