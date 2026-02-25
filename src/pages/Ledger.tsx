import { useData, LedgerEntry } from "@/context/DataContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Plus,
    Trash2,
    DollarSign,
    Briefcase,
    ShoppingCart,
    Coins,
    ArrowDownCircle,
    Calendar,
    Filter,
    FileText,
    TrendingDown,
    Wallet
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Ledger() {
    const { ledgerEntries, addLedgerEntry, removeLedgerEntry, metrics, formatCurrency } = useData();
    const [isAdding, setIsAdding] = useState(false);

    const [newEntry, setNewEntry] = useState<Omit<LedgerEntry, "id">>({
        date: new Date().toISOString().split("T")[0],
        category: "Other",
        description: "",
        amount: 0,
        paymentStatus: "Paid"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEntry.amount <= 0 || !newEntry.description) {
            toast.error("Please provide description and amount");
            return;
        }
        addLedgerEntry(newEntry);
        setIsAdding(false);
        setNewEntry({
            date: new Date().toISOString().split("T")[0],
            category: "Other",
            description: "",
            amount: 0,
            paymentStatus: "Paid"
        });
        toast.success("Capital outflow recorded");
    };

    const categories = [
        { id: "Inventory", icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-500/10" },
        { id: "USDT Buy", icon: Coins, color: "text-amber-400", bg: "bg-amber-500/10" },
        { id: "Ad Credits", icon: DollarSign, color: "text-purple-400", bg: "bg-purple-500/10" },
        { id: "Payroll", icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { id: "Sourcing", icon: ArrowDownCircle, color: "text-orange-400", bg: "bg-orange-500/10" },
        { id: "Other", icon: FileText, color: "text-gray-400", bg: "bg-gray-500/10" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                        <Wallet size={100} className="text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Business Net Profit</p>
                    <h2 className="text-3xl font-black text-white">{formatCurrency(metrics.netProfit)}</h2>
                    <p className="text-[9px] text-emerald-400/80 mt-2 font-bold flex items-center gap-1">
                        <Plus size={10} /> After RTO & Ops overhead
                    </p>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:-rotate-12 transition-transform">
                        <TrendingDown size={100} className="text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400/60 mb-1">Total Capital Outflow</p>
                    <h2 className="text-3xl font-black text-rose-400">{formatCurrency(metrics.totalCapitalOutflow)}</h2>
                    <p className="text-[9px] text-rose-400/80 mt-2 font-bold flex items-center gap-1">
                        <Minus size={10} /> Inventory, USDT & Ops Ledger
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group border-purple-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1">Actual Cash in Hand</p>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter">{formatCurrency(metrics.cashInHand)}</h2>
                    <p className="text-[9px] text-purple-300/80 mt-2 font-bold uppercase tracking-widest">Global Financial Truth</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Enterprise Ledger</h3>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">Operational & Capital Expenditure</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                    {isAdding ? "Cancel" : "Record Outflow"}
                    {!isAdding && <Plus size={14} />}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md animate-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                value={newEntry.date}
                                onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Category</label>
                            <select
                                value={newEntry.category}
                                onChange={e => setNewEntry({ ...newEntry, category: e.target.value as any })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Amount (PKR)</label>
                            <input
                                type="number"
                                placeholder="E.g. 50000"
                                value={newEntry.amount || ""}
                                onChange={e => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-1 flex items-end">
                            <button type="submit" className="w-full h-[46px] bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-purple-200 transition-all active:scale-95">
                                Submit Transaction
                            </button>
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Description</label>
                            <input
                                type="text"
                                placeholder="E.g. Bulk purchase of 100 Vibe Hoodies from supplier"
                                value={newEntry.description}
                                onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-secondary/20 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <FileText size={18} className="text-purple-400" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Transaction Log</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                            <Filter size={12} />
                            Filter by Category
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            <tr>
                                <th className="px-8 py-4">Transaction Date</th>
                                <th className="px-8 py-4">Category</th>
                                <th className="px-8 py-4">Description</th>
                                <th className="px-8 py-4 text-right">Amount (Outflow)</th>
                                <th className="px-8 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {ledgerEntries.map((entry) => {
                                const cat = categories.find(c => c.id === entry.category) || categories[5];
                                return (
                                    <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-muted-foreground" />
                                                <span className="text-xs font-medium text-white/80 font-mono">{entry.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={cn("px-3 py-1 rounded-full border w-fit flex items-center gap-2", cat.bg, cat.color, "border-white/5")}>
                                                <cat.icon size={10} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{entry.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 max-w-md">
                                            <p className="text-xs text-white/60 font-medium truncate group-hover:text-white transition-colors capitalize">
                                                {entry.description}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-sm font-black text-rose-400 font-mono">
                                                -{formatCurrency(entry.amount)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button
                                                onClick={() => removeLedgerEntry(entry.id)}
                                                className="p-2 hover:bg-rose-500/10 text-white/10 hover:text-rose-400 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {ledgerEntries.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center opacity-20">
                                            <Wallet size={48} className="mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">No capital outflows recorded</p>
                                            <p className="text-[10px] mt-2">Record your inventory buys and USDT transactions here</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Minus({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            width={size || 16}
            height={size || 16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
