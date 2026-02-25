import { useData } from "@/context/DataContext";
import { Clock, CheckCircle2, AlertCircle, ShieldAlert, Cpu, Terminal, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function History() {
    const { data } = useData();

    // Enhancing history items with more enterprise context
    const historyItems = data.length > 0 ? data : [
        { id: 1, action: "Enterprise Report Orchestrated", user: "Neural Core", time: "2 mins ago", type: "system", status: "success", detail: "Automated fulfillment sync completed for all nodes." },
        { id: 2, action: "Merchant Database Ingested", user: "Devon Lane", time: "1 hour ago", type: "user", status: "success", detail: "Uploaded 2,500 new transaction records into the PK-COD matrix." },
        { id: 3, action: "Encryption Anomaly Detected", user: "Firewall-A1", time: "3 hours ago", type: "security", status: "warning", detail: "Sub-optimal handshake from unknown IP. Access restricted." },
        { id: 4, action: "Settlement Protocol Updated", user: "Treasury Bot", time: "Yesterday", type: "system", status: "success", detail: "Re-aligned Courier-Bank reconciliation logic to 14A Cycle." },
    ];

    const getIconColor = (type: string) => {
        switch (type) {
            case 'security': return 'text-rose-400 bg-rose-500/10';
            case 'user': return 'text-blue-400 bg-blue-500/10';
            case 'system': return 'text-purple-400 bg-purple-500/10';
            default: return 'text-emerald-400 bg-emerald-500/10';
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-400 uppercase italic tracking-tighter">
                        Operation Log
                    </h1>
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em] mt-1 flex items-center gap-2">
                        <Terminal size={14} className="text-purple-500" />
                        System Pulse & Transaction History
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl text-white transition-all outline-none">
                        Export Logs
                    </button>
                    <button className="px-5 py-3 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/20 text-[10px] font-black uppercase tracking-widest rounded-2xl text-rose-400 transition-all outline-none">
                        Purge Memory
                    </button>
                </div>
            </div>

            {/* System Status Banner */}
            <div className="p-8 bg-gradient-to-r from-purple-900/40 via-purple-900/20 to-transparent border border-purple-500/20 rounded-[2.5rem] flex items-center justify-between backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                    <Cpu size={120} className="text-white" />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-500/20">
                        <Layers size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">System Integrity Optimal</h3>
                        <p className="text-xs text-purple-300 font-bold uppercase tracking-widest mt-0.5">All neural nodes synchronized // 0.04ms average latency</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 relative z-10">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Status: Master</span>
                    <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <div className="bg-secondary/20 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute top-0 left-[51px] w-px h-full bg-white/5" />

                <div className="space-y-12 relative z-10">
                    {historyItems.map((item: any, i) => (
                        <div key={i} className="flex gap-8 group">
                            {/* Icon Indicator */}
                            <div className="relative">
                                <div className={cn(
                                    "w-10 h-10 rounded-[1rem] flex items-center justify-center z-10 relative transition-transform group-hover:scale-110",
                                    getIconColor(item.type || 'system'),
                                    "border border-white/10 shadow-lg"
                                )}>
                                    {item.type === 'security' ? <ShieldAlert size={18} /> :
                                        item.type === 'user' ? <Terminal size={18} /> : <Clock size={18} />}
                                </div>
                                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Content Block */}
                            <div className="flex-1 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.05] hover:border-white/10 transition-all group-hover:translate-x-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <h4 className="text-base font-black text-white uppercase italic tracking-tighter group-hover:text-purple-400 transition-colors">
                                            {data.length > 0 ? "Neural Node Update" : item.action}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-black text-purple-300 uppercase tracking-widest">{item.user}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Instance-A2</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                            {data.length > 0 ? "Just now" : item.time}
                                        </span>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            (!data.length && item.status === "warning") ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        )}>
                                            {(!data.length && item.status === "warning") ? "Anomaly" : "Verified"}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-purple-100/60 leading-relaxed font-medium">
                                    {data.length > 0
                                        ? `Automated processing cycle for Data Cluster #${i + 1}. Integrity check verified across all distributed nodes.`
                                        : item.detail
                                    }
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
