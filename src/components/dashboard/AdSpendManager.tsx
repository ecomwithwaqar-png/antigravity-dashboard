import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Zap, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdSpendManager() {
    const { adSpendEntries, addManualAdSpend, removeAdSpendEntry, manualAdSpendTotal, formatCurrency, dataSources, currentViewId } = useData();
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [platform, setPlatform] = useState("Facebook Ads");
    const [amount, setAmount] = useState("");
    const [targetSourceId, setTargetSourceId] = useState<string>("collective");
    const [notes, setNotes] = useState("");

    const shopSources = dataSources.filter(s => s.type === "shopify" || s.type === "csv" || s.type === "google_sheets");

    const handleAdd = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;
        addManualAdSpend({
            date,
            platform,
            amount: val,
            notes: notes || undefined,
            targetSourceId: targetSourceId === "collective" ? "collective" : targetSourceId
        } as any);
        setAmount("");
        setNotes("");
        setShowForm(false);
    };

    const manualEntries = adSpendEntries.filter(e => e.source === "manual" && (e.targetSourceId === "collective" || e.targetSourceId === currentViewId || !e.targetSourceId));
    const autoEntries = adSpendEntries.filter(e => e.source === "auto");

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl backdrop-blur-sm p-5 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex items-center relative h-10 overflow-hidden">
                <div
                    className="absolute bg-orange-600 rounded-lg transition-all duration-300 ease-out z-0 h-[calc(100%-8px)]"
                    style={{
                        width: 'calc(50% - 4px)',
                        left: showForm ? 'calc(50% + 2px)' : '4px',
                    }}
                />
                <button
                    onClick={() => setShowForm(false)}
                    className={cn(
                        "relative z-10 flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                        !showForm ? "text-white" : "text-muted-foreground hover:text-white"
                    )}
                >
                    <Zap size={10} />
                    Auto Feed
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    className={cn(
                        "relative z-10 flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                        showForm ? "text-white" : "text-muted-foreground hover:text-white"
                    )}
                >
                    <Plus size={10} />
                    Manual Entry
                </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Manual ({currentViewId === "collective" ? "Collective" : "Current Shop"})</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(manualAdSpendTotal)}</p>
                    <p className="text-[10px] text-muted-foreground">{manualEntries.length} entries</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Auto (In-Data)</p>
                    <p className="text-lg font-bold text-white">
                        {formatCurrency(autoEntries.reduce((s, e) => s + e.amount, 0))}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{autoEntries.length} sources</p>
                </div>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="space-y-3 bg-white/5 rounded-xl p-3 border border-white/5 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block uppercase">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block uppercase">Amount</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block uppercase">Platform</label>
                            <select
                                value={platform}
                                onChange={e => setPlatform(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="Meta Ads">Meta Ads</option>
                                <option value="Google Ads">Google Ads</option>
                                <option value="TikTok Ads">TikTok Ads</option>
                                <option value="Snapchat Ads">Snapchat Ads</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block uppercase">Target View</label>
                            <select
                                value={targetSourceId}
                                onChange={e => setTargetSourceId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="collective">All Stores (Collective)</option>
                                {shopSources.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block uppercase">Notes (optional)</label>
                        <input
                            type="text"
                            placeholder="Campaign details..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!amount || parseFloat(amount) <= 0}
                        className="w-full py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white transition-all disabled:opacity-30 shadow-lg shadow-orange-500/20"
                    >
                        Save Ad Spend Entry
                    </button>
                </div>
            )}

            {/* Recent manual entries */}
            {manualEntries.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Recent Manual</p>
                    {manualEntries.slice(-5).reverse().map(e => (
                        <div key={e.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-white/40">{e.date}</span>
                                <span className="text-xs text-white/80">{e.platform}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-orange-300">{formatCurrency(e.amount)}</span>
                                <button onClick={() => removeAdSpendEntry(e.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
