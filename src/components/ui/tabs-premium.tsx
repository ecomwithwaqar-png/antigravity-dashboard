import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    label: string;
    icon?: any;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={cn("flex flex-wrap gap-2 p-1.5 bg-secondary/30 backdrop-blur-md border border-white/5 rounded-2xl w-fit", className)}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
                            isActive ? "text-white" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon && <tab.icon size={16} />}
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
