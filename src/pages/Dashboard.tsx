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

export default function Dashboard() {
    const { data, lastSyncTime, formatPKT } = useData();
    const hasData = data.length > 0;

    return (
        <div className="space-y-6">
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

            {/* Executive KPIs (The 4 Pillars) */}
            <MetricsOverview view="pillars" />

            {/* Pakistan COD Market Insights & Predictive Intelligence */}
            <div className="space-y-6">
                <CODMarketInsights />
                <PredictiveAnalytics />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Side Management Column (P&L + SKU Ops) */}
                <div className="lg:col-span-1 space-y-6">
                    <FinancialPLSummary />
                    <ProductLeaderboard />
                    <LogisticsSmartRouter />
                    <SettlementTracker />
                </div>

                {/* Main Growth & Marketing Column */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AntiGravityAI />
                        <div className="space-y-6">
                            <DataUpload />
                            <IntegrationsPanel />
                        </div>
                    </div>

                    <div className="bg-secondary/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <RevenueChart />
                    </div>

                    {/* Detailed Metrics Detail */}
                    <MetricsOverview view="detailed" />
                </div>
            </div>

            {/* Bottom Row - Activity & Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-secondary/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <AssetsChart />
                </div>
                <div className="lg:col-span-1 bg-secondary/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <RecentSales />
                </div>
                <div className="lg:col-span-1 bg-secondary/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <ActivityChart />
                </div>
            </div>
        </div>
    );
}
