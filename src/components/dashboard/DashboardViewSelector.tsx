import { useData } from "@/context/DataContext";
import { LayoutGrid, ShoppingBag, BarChart3, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DashboardViewSelector() {
    const { dataSources, currentViewId, setCurrentViewId } = useData();
    const [isOpen, setIsOpen] = useState(false);

    const shopSources = dataSources.filter(s => s.type === "shopify" || s.type === "csv" || s.type === "google_sheets");
    const currentView = currentViewId === "collective"
        ? { name: "Collective Dashboard", type: "collective" }
        : dataSources.find(s => s.id === currentViewId) || { name: "Singular View", type: "singular" };

    return (
        <div className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white"
            >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    {currentViewId === "collective" ? <LayoutGrid size={18} /> : <ShoppingBag size={18} />}
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold leading-tight">Current View</p>
                    <p className="text-sm font-semibold truncate max-w-[150px]">{currentView.name}</p>
                </div>
                <ChevronDown size={16} className={cn("text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1625]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="px-3 py-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-2 mb-2">Main Views</p>
                            <button
                                onClick={() => { setCurrentViewId("collective"); setIsOpen(false); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                    currentViewId === "collective" ? "bg-purple-500/20 text-purple-300" : "text-white/70 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <LayoutGrid size={16} />
                                <span className="text-sm font-medium">Collective Dashboard</span>
                            </button>
                        </div>

                        {shopSources.length > 0 && (
                            <div className="px-3 py-2 border-t border-white/5">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-2 mb-2">Individual Stores</p>
                                <div className="space-y-1">
                                    {shopSources.map(source => (
                                        <button
                                            key={source.id}
                                            onClick={() => { setCurrentViewId(source.id); setIsOpen(false); }}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                                currentViewId === source.id ? "bg-purple-500/20 text-purple-300" : "text-white/70 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            <ShoppingBag size={16} />
                                            <div className="text-left">
                                                <p className="text-sm font-medium truncate">{source.name}</p>
                                                <p className="text-[10px] opacity-50 uppercase">{source.type}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="px-3 py-2 border-t border-white/5 bg-white/[0.02]">
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 cursor-not-allowed text-xs font-medium">
                                <BarChart3 size={14} />
                                Compare Views (Waitlist)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
