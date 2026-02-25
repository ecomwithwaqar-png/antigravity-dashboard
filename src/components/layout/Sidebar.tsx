import { LayoutDashboard, FileText, History, Radio, TrendingUp, Wallet, User, Inbox, HelpCircle, Settings, LogOut, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Zap, label: "Marketing Intel", href: "/performance" },
    { icon: Activity, label: "Ops Intelligence", href: "/intelligence" },
    { icon: FileText, label: "Report builder", href: "/reports" },
    { icon: TrendingUp, label: "Scaling CC", href: "/scale" },
    { icon: Wallet, label: "Payment Ledger", href: "/ledger" },
    { icon: History, label: "History", href: "/history" },
    { icon: Radio, label: "Live feed", href: "/live" },
];

const generalItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Inbox, label: "Inbox", href: "/inbox" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 border-r border-purple-500/20 bg-background/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col p-4 hidden md:flex">
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                    Overlay
                </span>
            </div>

            <nav className="flex-1 space-y-8">
                <div>
                    <h3 className="text-xs font-medium text-muted-foreground px-2 mb-3 uppercase tracking-wider">Main</h3>
                    <ul className="space-y-1 relative">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "text-white"
                                                : "text-muted-foreground hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] z-0" />
                                        )}
                                        <div className="relative z-10 flex items-center gap-3">
                                            <item.icon size={18} className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-white/40 group-hover:text-white")} />
                                            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-medium text-muted-foreground px-2 mb-3 uppercase tracking-wider">General</h3>
                    <ul className="space-y-1">
                        {generalItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                                            isActive
                                                ? "bg-gradient-to-r from-purple-500/20 to-purple-500/5 text-purple-300 border-l-2 border-purple-500"
                                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon size={18} className={cn(isActive && "text-purple-400")} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white">Go Pro</h4>
                        <button className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors">
                            <span className="sr-only">Dismiss</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <p className="text-xs text-purple-200/70 mb-3">Use premium features to professionally monitor your business.</p>
                    <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02]">
                        Try Now
                    </button>
                </div>
            </div>
            {/* User Profile Mini */}
            <div className="mt-6 flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 p-[2px]">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="rounded-full bg-background" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Devon Lane</p>
                    <p className="text-xs text-muted-foreground truncate">lane@gmail.com</p>
                </div>
                <button className="text-muted-foreground hover:text-white">
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    );
}
