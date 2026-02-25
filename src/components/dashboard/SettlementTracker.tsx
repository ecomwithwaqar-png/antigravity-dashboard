import { useState } from "react";
import {
    Wallet,
    FileCheck,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    FileSearch,
    ChevronRight,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { toast } from "react-hot-toast";

export function SettlementTracker() {
    const { metrics, formatCurrency } = useData();
    const [reconcileStep, setReconcileStep] = useState<"idle" | "upload" | "process" | "result">("idle");
    const [discrepancies, setDiscrepancies] = useState<any[]>([]);

    // Simulation of Expected vs Settled for the UI
    const expected = metrics.cashInTransit;
    const settled = expected * 0.88;
    const gap = expected - settled;

    const startReconcile = () => {
        setReconcileStep("process");

        // Complex logic simulation
        setTimeout(() => {
            const simulatedDiscrepancies = [
                { id: "#12891", amount: 4500, reason: "Payment Lag", status: "In Transit" },
                { id: "#12844", amount: 3200, reason: "Courier Theft/Loss", status: "Delivered (Unpaid)" },
                { id: "#12790", amount: 8900, reason: "Admin Error", status: "Confirmed (Unsettled)" },
            ];
            setDiscrepancies(simulatedDiscrepancies);
            setReconcileStep("result");
            toast.success(`Found ${simulatedDiscrepancies.length} discrepancies during neural audit.`);
        }, 2500);
    };

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-6 backdrop-blur-md group hover:border-purple-500/20 transition-all duration-500 shadow-2xl relative overflow-hidden">
            {/* Structural Background Glimmer */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Settlement Audit</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Active Audit Cycle</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cycle 4.2</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-bold">Updated Hourly</span>
                </div>
            </div>

            <div className="space-y-5">
                <div className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover/item:text-white transition-colors">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Expected Yield</span>
                            <span className="text-xs font-bold text-white uppercase">Courier Pipeline</span>
                        </div>
                    </div>
                    <span className="text-sm font-black text-white font-mono">{formatCurrency(expected)}</span>
                </div>

                <div className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <FileCheck size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Bank Realized</span>
                            <span className="text-xs font-bold text-white uppercase">Settled Cash</span>
                        </div>
                    </div>
                    <span className="text-sm font-black text-emerald-400 font-mono">{formatCurrency(settled)}</span>
                </div>

                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="absolute h-full bg-emerald-500 transition-all duration-1000"
                        style={{ width: `${(settled / (expected || 1)) * 100}%` }}
                    />
                    <div
                        className="absolute h-full w-4 bg-white/20 blur-md animate-shimmer"
                        style={{ left: `${(settled / (expected || 1)) * 100}%` }}
                    />
                </div>

                <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-between group/gap relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover/gap:opacity-100 transition-opacity" />
                    <div className="flex flex-col relative z-10">
                        <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Unreconciled Gap</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-bold">Needs Audit Action</span>
                    </div>
                    <span className="text-base font-black text-rose-500 relative z-10 font-mono">-{formatCurrency(gap)}</span>
                </div>
            </div>

            <div className="mt-8">
                {reconcileStep === "idle" && (
                    <button
                        onClick={() => setReconcileStep("upload")}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95 group/btn"
                    >
                        Initiate Neural Reconcile
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                )}

                {reconcileStep === "upload" && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 bg-white/[0.02]">
                            <FileSearch size={32} className="text-blue-400" />
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-center">
                                Drop Courier Excel/CSV Statement here
                            </p>
                            <button
                                onClick={startReconcile}
                                className="px-6 py-2 bg-white text-black font-black uppercase text-[9px] tracking-widest rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Process Audit
                            </button>
                        </div>
                        <button onClick={() => setReconcileStep("idle")} className="w-full text-[9px] font-black text-muted-foreground uppercase tracking-widest">Cancel Audit</button>
                    </div>
                )}

                {reconcileStep === "process" && (
                    <div className="flex flex-col items-center py-8 gap-4 animate-in fade-in">
                        <RefreshCw size={32} className="text-blue-400 animate-spin" />
                        <div className="text-center">
                            <p className="text-[10px] text-white font-black uppercase tracking-widest">Cross-Referencing Order IDs...</p>
                            <p className="text-[9px] text-muted-foreground mt-1">Verifying Delivered vs Bank-Statement</p>
                        </div>
                    </div>
                )}

                {reconcileStep === "result" && (
                    <div className="space-y-4 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Audit Complete: 3 Gaps</span>
                        </div>
                        <div className="space-y-2">
                            {discrepancies.map(d => (
                                <div key={d.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between group/row hover:border-rose-500/30 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-white">{d.id}</span>
                                        <span className="text-[8px] text-rose-400 font-black uppercase tracking-tighter">{d.reason}</span>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <span className="text-[10px] font-black text-white font-mono">{formatCurrency(d.amount)}</span>
                                        <AlertTriangle size={12} className="text-rose-500 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setReconcileStep("idle")}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
                        >
                            Reset Audit Engine
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
