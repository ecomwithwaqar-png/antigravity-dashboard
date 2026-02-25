import { Search, Bell, Settings2 } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function Header() {
    const { setTheme, theme } = useTheme();

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between py-6 px-1 gap-6">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div>
                    <div className="flex items-center gap-2 text-white mb-1">
                        <span className="text-2xl animate-wave origin-bottom-right inline-block">🚀</span>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Waqar Ahmed</h1>
                    </div>
                    <p className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                {/* Mobile Search/Settings Mini Toggle could go here if needed, but we have MobileNav */}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-secondary/50 border border-purple-500/10 focus:border-purple-500/50 rounded-full py-2.5 pl-10 pr-4 w-64 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder:text-muted-foreground/70"
                    />
                </div>

                <button className="w-10 h-10 rounded-full bg-secondary/50 border border-purple-500/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300 relative group">
                    <Settings2 size={20} />
                    <span className="absolute inset-0 rounded-full bg-purple-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </button>

                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-10 h-10 rounded-full bg-secondary/50 border border-purple-500/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300 group"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-background shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                </button>
            </div>
        </header>
    );
}
