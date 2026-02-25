import { useState } from "react";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { AssetsChart } from "@/components/dashboard/AssetsChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { DataUpload } from "@/components/dashboard/DataUpload";
import { AntiGravityAI } from "@/components/dashboard/AntiGravityAI";
import { IntegrationsPanel } from "@/components/dashboard/IntegrationsPanel";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { useData } from "@/context/DataContext";
import { FinancialPLSummary } from "@/components/dashboard/FinancialPLSummary";
import { ProductLeaderboard } from "@/components/dashboard/ProductLeaderboard";
import { DashboardViewSelector } from "@/components/dashboard/DashboardViewSelector";
import { CODMarketInsights } from "@/components/dashboard/CODMarketInsights";
import { PredictiveAnalytics } from "@/components/dashboard/PredictiveAnalytics";
import { SettlementTracker } from "@/components/dashboard/SettlementTracker";
import { LogisticsSmartRouter } from "@/components/dashboard/LogisticsSmartRouter";
import { Tabs } from "@/components/ui/tabs-premium";
import { LayoutDashboard, Zap, Activity, Database } from "lucide-react";

export default function Dashboard() {
    const { data, lastSyncTime, formatPKT } = useData();
    const [activeTab, setActiveTab] = useState("overview");
    const hasData = data.length > 0;

    const tabs = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "operations", label: "Operations", icon: Activity },
        { id: "intelligence", label: "Intelligence", icon: Zap },
        { id: "data", label: "Connect", icon: Database },
    ];

    return (
        <div className="space-y-6 pb-24 md:pb-0">
            {/* Header & View Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Suite</h1>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Predictive business intelligence for PK-COD</span>
                        {lastSyncTime && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span>Updated: {formatPKT(lastSyncTime)} PKT</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {hasData && <DashboardViewSelector />}
                </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            <div className="mt-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <MetricsOverview view="pillars" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <RevenueChart />
                                <MetricsOverview view="detailed" />
                            </div>
                            <div className="lg:col-span-1 space-y-6">
                                <AntiGravityAI />
                                <RecentSales />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "operations" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <ProductLeaderboard />
                            <ActivityChart />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <LogisticsSmartRouter />
                            <SettlementTracker />
                        </div>
                    </div>
                )}

                {activeTab === "intelligence" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CODMarketInsights />
                            <PredictiveAnalytics />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <FinancialPLSummary />
                            </div>
                            <div className="lg:col-span-2">
                                <AssetsChart />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "data" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                        <DataUpload />
                        <IntegrationsPanel />
                    </div>
                )}
            </div>
        </div>
    );
}
