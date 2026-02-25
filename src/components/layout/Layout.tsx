import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-background to-background selection:bg-purple-500/30">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen relative z-0 scrollbar-hide pb-20 md:pb-8">
                <div className="max-w-[1600px] mx-auto p-4 md:p-8 pt-6">
                    <Header />
                    <div className="mt-4 md:mt-8">
                        <Outlet />
                    </div>
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
