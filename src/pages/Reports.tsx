import { useData } from "@/context/DataContext";
import { useState, useMemo } from "react";
import {
    Download,
    Search,
    Filter,
    FileSpreadsheet,
    Clock,
    Zap,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Sparkles,
    ChevronRight,
    FileType,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function Reports() {
    const { data, columns, metrics } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [reportType, setReportType] = useState<"all" | "performance" | "logistics" | "financial">("all");
    const [isExporting, setIsExporting] = useState(false);

    const filteredData = useMemo(() => {
        let base = data;
        if (searchTerm) {
            base = base.filter(row =>
                Object.values(row).some(val =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        return base;
    }, [data, searchTerm]);

    const handleAutomatedExport = (type: string) => {
        setIsExporting(true);
        const loadingToast = toast.loading(`Generating automated ${type} report...`);

        setTimeout(() => {
            // Simulation of sophisticated export logic
            const headers = columns.join(",");
            const rows = filteredData.map(row => columns.map(col => `"${row[col] || ""}"`).join(","));
            const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");

            const link = document.createElement("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", `enterprise_${type.toLowerCase()}_${new Date().toISOString().split("T")[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`${type} Report automated and downloaded!`, { id: loadingToast });
            setIsExporting(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header section with automated status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 italic tracking-tighter">
                        REPORT ORCHESTRATION
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                            Automated Data Engine Active
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center relative">
                        {/* Amazing Slider for Options */}
                        <div
                            className="absolute bg-purple-600 rounded-xl transition-all duration-300 ease-out z-0 h-[calc(100%-8px)]"
                            style={{
                                width: '25%',
                                left: reportType === "all" ? '4px' : reportType === "performance" ? '25%' : reportType === "logistics" ? '50%' : '75%',
                                transform: reportType === "all" ? 'translateX(0)' : reportType === "performance" ? 'translateX(0)' : reportType === "logistics" ? 'translateX(0)' : 'translateX(0)'
                            }}
                        />
                        {["all", "performance", "logistics", "financial"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setReportType(type as any)}
                                className={cn(
                                    "relative z-10 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 w-24",
                                    reportType === type ? "text-white" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Automation Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-6 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Zap size={24} />
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-black uppercase text-emerald-400">Active Task</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">Daily Fulfillment Sync</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Automated CSV reconciliation for your COD warehouse. Exported every 24 hours.</p>
                    <button
                        onClick={() => handleAutomatedExport("Fulfillment")}
                        className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        Trigger Manual Run
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-6 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-black uppercase text-blue-400">Scheduled</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">Financial Audit Export</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Comprehensive P&L and Ledger breakdown for weekly shareholder review.</p>
                    <button
                        onClick={() => handleAutomatedExport("Financial")}
                        className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        Preview Audit
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="bg-secondary/20 border border-white/5 rounded-[2rem] p-6 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Sparkles size={24} />
                        </div>
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-[9px] font-black uppercase text-amber-400">AI Enabled</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">SKU Profitability Matrix</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Prescriptive report highlighting which SKUs to scale based on current trajectory.</p>
                    <button
                        onClick={() => handleAutomatedExport("SKU_Logic")}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        Generate Logic Report
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Main Data Table */}
            <div className="bg-secondary/20 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <FileType size={20} className="text-purple-400" />
                            <span className="text-xs font-black uppercase tracking-widest">Master Data Feed</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {filteredData.length} Indexed Transactions
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search any attribute..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                            />
                        </div>
                        <button
                            disabled={isExporting}
                            onClick={() => handleAutomatedExport("Bulk")}
                            className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-purple-200 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {data.length > 0 ? (
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground sticky top-0 z-20">
                                <tr>
                                    {columns.slice(0, 8).map((col) => (
                                        <th key={col} className="px-6 py-4 border-b border-white/5 font-black whitespace-nowrap">
                                            {col.replace('_', ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredData.slice(0, 50).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.04] transition-all group">
                                        {columns.slice(0, 8).map((col) => {
                                            const val = String(row[col] || "");
                                            const isStatus = col.toLowerCase().includes('status');
                                            const isAmount = col.toLowerCase().includes('amount') || col.toLowerCase().includes('revenue');

                                            return (
                                                <td key={`${idx}-${col}`} className="px-6 py-5 whitespace-nowrap text-[11px] font-medium transition-colors">
                                                    {isStatus ? (
                                                        <div className={cn(
                                                            "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter w-fit border",
                                                            val.toLowerCase().includes('delivered') ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                                val.toLowerCase().includes('return') ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                                    "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                        )}>
                                                            {val}
                                                        </div>
                                                    ) : isAmount ? (
                                                        <span className="font-mono text-white font-bold">{val}</span>
                                                    ) : (
                                                        <span className="text-white/60 group-hover:text-white transition-colors">{val}</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[400px] p-10 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 group hover:scale-110 transition-transform duration-500">
                                <FileSpreadsheet className="text-muted-foreground group-hover:text-purple-400" size={40} />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">Neural Data Pipeline Empty</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mt-2 font-medium">
                                No records found in the active buffer. Connect a Shopify or CSV source to activate automated reporting.
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        Showing top {Math.min(filteredData.length, 50)} priority records
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Clock size={14} />
                            Cycle: Every 24H
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle size={14} />
                            Retention: 90 Days
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
