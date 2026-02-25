import { LayoutDashboard, Zap, Activity, FileText, TrendingUp, Wallet, History, Radio, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mobileItems = [
    { icon: LayoutDashboard, label: "Home", href: "/" },
    { icon: Zap, label: "Marketing", href: "/performance" },
    { icon: Activity, label: "Ops", href: "/intelligence" },
    { icon: Wallet, label: "Ledger", href: "/ledger" },
];

export function MobileNav() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-purple-500/20 z-50 md:hidden pb-safe">
                <div className="flex justify-around items-center h-16">
                    {mobileItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-all duration-300",
                                    isActive ? "text-purple-400" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive && "scale-110")} />
                                <span className="text-[10px] font-medium uppercase tracking-tighter">{item.label}</span>
                                {isActive && <div className="absolute bottom-0 w-8 h-1 bg-purple-500 rounded-t-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex flex-col items-center gap-1 text-muted-foreground"
                    >
                        <Menu size={20} />
                        <span className="text-[10px] font-medium uppercase tracking-tighter">More</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Full Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-[60] md:hidden animate-in fade-in slide-in-from-bottom duration-300">
                    <div className="p-8 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 font-sans tracking-tight">ANTI-GRAVITY</span>
                            <button onClick={() => setIsMenuOpen(false)} className="w-12 h-12 rounded-full border border-purple-500/20 flex items-center justify-center text-white">
                                <span className="text-2xl">×</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: LayoutDashboard, label: "Overview", href: "/" },
                                { icon: Zap, label: "Marketing Intel", href: "/performance" },
                                { icon: Activity, label: "Ops Intelligence", href: "/intelligence" },
                                { icon: FileText, label: "Report builder", href: "/reports" },
                                { icon: TrendingUp, label: "Scaling CC", href: "/scale" },
                                { icon: Wallet, label: "Payment Ledger", href: "/ledger" },
                                { icon: History, label: "History", href: "/history" },
                                { icon: Radio, label: "Live feed", href: "/live" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all active:scale-95"
                                >
                                    <item.icon size={24} className="mb-3 text-purple-400" />
                                    <span className="text-xs font-bold text-center text-white/80">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20">
                                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center font-bold">W</div>
                                <div>
                                    <p className="font-bold text-white">Waqar Ahmed</p>
                                    <p className="text-xs text-purple-300/70">Founder Account</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
