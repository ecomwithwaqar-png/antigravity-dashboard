import { LayoutDashboard, FileText, History, Radio, LogOut, Zap, Activity, Shield, BarChart3, Globe, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const mainNavigation = [
    { icon: LayoutDashboard, label: "Command Center", href: "/" },
    { icon: Zap, label: "Marketing Intel", href: "/performance" },
    { icon: Activity, label: "Ops Intelligence", href: "/intelligence" },
];

const analyticTools = [
    { icon: BarChart3, label: "Execution Engine", href: "/scale" },
    { icon: FileText, label: "Report Builder", href: "/reports" },
    { icon: Wallet, label: "Capital Ledger", href: "/ledger" },
];

const utilityItems = [
    { icon: History, label: "Audit Log", href: "/history" },
    { icon: Radio, label: "Terminal Live", href: "/live" },
    { icon: Globe, label: "Global Status", href: "/status" },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-72 border-r border-white/5 bg-[#0a0a0c]/80 backdrop-blur-2xl h-screen sticky top-0 flex flex-col p-6 hidden md:flex shrink-0">
            {/* Brand */}
            <div className="flex items-center gap-4 mb-12 px-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/20 rotate-3">
                    <Shield size={22} className="text-white" />
                </div>
                <div>
                    <span className="font-black text-xl text-white tracking-tighter">ANTI-GRAVITY</span>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest leading-none">Intelligence OS</p>
                </div>
            </div>

            <nav className="flex-1 space-y-10 overflow-y-auto pr-2 custom-scrollbar">
                {/* Section 1: Core */}
                <div>
                    <h3 className="text-[10px] font-black text-white/30 px-3 mb-4 uppercase tracking-[0.2em]">Core Systems</h3>
                    <ul className="space-y-1.5">
                        {mainNavigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-400 group relative",
                                            isActive ? "text-white" : "text-white/40 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/5 border border-purple-500/20 rounded-2xl z-0" />
                                        )}
                                        <item.icon size={18} className={cn("relative z-10 transition-all duration-300", isActive ? "text-purple-400 scale-110" : "group-hover:text-white")} />
                                        <span className="text-[11px] font-black uppercase tracking-widest relative z-10 font-sans">{item.label}</span>
                                        {isActive && <div className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Section 2: Financials */}
                <div>
                    <h3 className="text-[10px] font-black text-white/30 px-3 mb-4 uppercase tracking-[0.2em]">Wealth & Scale</h3>
                    <ul className="space-y-1.5">
                        {analyticTools.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-400 group relative",
                                            isActive ? "text-white shadow-xl shadow-purple-500/5 bg-white/5" : "text-white/40 hover:text-white"
                                        )}
                                    >
                                        <item.icon size={18} className={cn("transition-all duration-300", isActive ? "text-purple-400" : "group-hover:text-white")} />
                                        <span className="text-[11px] font-black uppercase tracking-widest font-sans">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Section 3: Records */}
                <div>
                    <h3 className="text-[10px] font-black text-white/30 px-3 mb-4 uppercase tracking-[0.2em]">Data Records</h3>
                    <ul className="space-y-1.5">
                        {utilityItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-400 group relative",
                                            isActive ? "text-white shadow-xl shadow-purple-500/5 bg-white/5" : "text-white/40 hover:text-white"
                                        )}
                                    >
                                        <item.icon size={18} className={cn("transition-all duration-300", isActive ? "text-purple-400" : "group-hover:text-white")} />
                                        <span className="text-[11px] font-black uppercase tracking-widest font-sans">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* Bottom Profile */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 px-2 mb-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 p-0.5 group-hover:border-purple-500 transition-colors">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-white/10" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white uppercase truncate">Waqar Ahmed</p>
                        <p className="text-[9px] text-white/40 font-bold uppercase truncate">Founder Status</p>
                    </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                    <LogOut size={14} />
                    Terminal Exit
                </button>
            </div>
        </aside>
    );
}
