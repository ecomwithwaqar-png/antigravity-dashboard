import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import { DataProvider } from "@/context/DataContext";

import Reports from "@/pages/Reports";
import Performance from "@/pages/Performance";
import History from "@/pages/History";
import LiveFeed from "@/pages/LiveFeed";
import Scale from "@/pages/Scale";
import Ledger from "@/pages/Ledger";
import PerformanceIntelligence from "@/pages/PerformanceIntelligence";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthPage from "@/pages/Auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-[#020205] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
    );
    if (!user) return <Navigate to="/auth" replace />;
    return <Outlet />;
};

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <DataProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/auth" element={<AuthPage />} />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Layout />}>
                                    <Route index element={<Dashboard />} />
                                    <Route path="performance" element={<PerformanceIntelligence />} />
                                    <Route path="intelligence" element={<Performance />} />
                                    <Route path="reports" element={<Reports />} />
                                    <Route path="history" element={<History />} />
                                    <Route path="live" element={<LiveFeed />} />
                                    <Route path="scale" element={<Scale />} />
                                    <Route path="ledger" element={<Ledger />} />
                                    <Route path="profile" element={<div className="p-10 font-bold text-2xl text-muted-foreground">User Profile</div>} />
                                    <Route path="inbox" element={<div className="p-10 font-bold text-2xl text-muted-foreground">Inbox</div>} />
                                    <Route path="help" element={<div className="p-10 font-bold text-2xl text-muted-foreground">Help Center</div>} />
                                    <Route path="settings" element={<div className="p-10 font-bold text-2xl text-muted-foreground">Settings</div>} />
                                </Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </DataProvider>
            </AuthProvider>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#1e1b4b",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px"
                    }
                }}
            />
        </ThemeProvider>
    );
}

export default App;
