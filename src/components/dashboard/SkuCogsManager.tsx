import { useState } from "react";
import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import { Tag, Edit3, Check, X, Search } from "lucide-react";

export function SkuCogsManager() {
    const { skuCogs, updateSkuCogs, formatCurrency, data, columns } = useData();
    const [isExpanded, setIsExpanded] = useState(false);
    const [search, setSearch] = useState("");
    const [editingSku, setEditingSku] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    // Get unique SKUs from data manually if possible
    const skuCol = columns.find(c => ["sku", "variant", "product_id"].includes(c.toLowerCase()));
    const uniqueSkus = Array.from(new Set(data.map(d => String(d[skuCol || "sku"] || "")).filter(s => s && s !== "undefined")));

    const filteredSkus = uniqueSkus.filter(s => s.toLowerCase().includes(search.toLowerCase()));

    const handleSave = (sku: string) => {
        const val = parseFloat(editValue);
        if (!isNaN(val)) {
            updateSkuCogs(sku, val);
        }
        setEditingSku(null);
    };

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <Tag size={16} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-sm font-semibold text-white">SKU COGS Overrides</h4>
                        <p className="text-[10px] text-muted-foreground">Manually set cost per SKU to override data</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                        {Object.keys(skuCogs).length} set
                    </span>
                    <Edit3 size={14} className={cn("text-white/40 transition-transform", isExpanded && "rotate-180")} />
                </div>
            </button>

            {isExpanded && (
                <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                        <input
                            type="text"
                            placeholder="Search SKUs..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-colors"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {filteredSkus.length === 0 ? (
                            <p className="text-center py-4 text-xs text-muted-foreground italic">No SKUs found in active data</p>
                        ) : (
                            filteredSkus.map(sku => (
                                <div key={sku} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-xs font-medium text-white truncate">{sku}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            Current: <span className="text-orange-300/70">{skuCogs[sku] ? formatCurrency(skuCogs[sku]) : "Using column data"}</span>
                                        </p>
                                    </div>

                                    {editingSku === sku ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                autoFocus
                                                type="number"
                                                value={editValue}
                                                onChange={e => setEditValue(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSave(sku)}
                                                className="w-16 bg-[#1a1625] border border-orange-500/50 rounded px-1.5 py-1 text-xs text-white focus:outline-none"
                                            />
                                            <button onClick={() => handleSave(sku)} className="p-1 hover:text-emerald-400 transition-colors">
                                                <Check size={14} />
                                            </button>
                                            <button onClick={() => setEditingSku(null)} className="p-1 hover:text-rose-400 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingSku(sku);
                                                setEditValue(skuCogs[sku]?.toString() || "");
                                            }}
                                            className="px-2 py-1 rounded bg-white/5 text-[10px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            Set Cost
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {Object.keys(skuCogs).length > 0 && (
                        <div className="pt-2 border-t border-white/5">
                            <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Active Overrides</h5>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(skuCogs).map(([sku, cost]) => (
                                    <div key={sku} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-200">
                                        <span>{sku}: {formatCurrency(cost)}</span>
                                        <button onClick={() => updateSkuCogs(sku, undefined as any)} className="hover:text-rose-400">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
