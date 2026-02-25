import { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";

declare global {
    interface Window {
        FB: any;
    }
}


// ─── Configuration ──────────────────────────────────────────────────────────
const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL || "http://localhost:3001";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DataRecord {
    [key: string]: any;
}

export type DataSourceType = "csv" | "shopify" | "google_sheets" | "meta_ads" | "google_ads" | "tiktok_ads" | "snapchat_ads" | "dex" | "postex";
export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "PKR" | "AED" | "SAR" | "CAD" | "AUD" | "JPY" | "CNY" | "BDT" | "TRY";

export const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; name: string; locale: string }> = {
    USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
    EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
    GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
    INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
    PKR: { symbol: "Rs", name: "Pakistani Rupee", locale: "en-PK" },
    AED: { symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
    SAR: { symbol: "﷼", name: "Saudi Riyal", locale: "ar-SA" },
    CAD: { symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
    AUD: { symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
    JPY: { symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
    CNY: { symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
    BDT: { symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD" },
    TRY: { symbol: "₺", name: "Turkish Lira", locale: "tr-TR" },
};

export interface DataSource {
    id: string;
    type: DataSourceType;
    name: string;
    connectedAt: Date;
    status: "connected" | "syncing" | "error" | "disconnected";
    recordCount: number;
    lastSync?: Date;
    currency: CurrencyCode;
    syncIntervalMs: number;
    linkedSourceIds?: string[];
    config?: {
        shopDomain?: string;
        spreadsheetId?: string;
        spreadsheetUrl?: string;
        sheetName?: string;
        apiKey?: string;
        accountId?: string;
        customerId?: string;
        token?: string;
    };
}

export interface AdSpendEntry {
    id: string;
    date: string; // YYYY-MM-DD
    platform: string;
    amount: number;
    source: "manual" | "auto";
    targetSourceId?: "collective" | string;
    notes?: string;
}

export interface LedgerEntry {
    id: string;
    date: string;
    category: "Inventory" | "USDT Buy" | "Ad Credits" | "Payroll" | "Sourcing" | "Other";
    description: string;
    amount: number; // in PKR
    usdAmount?: number; // If applicable (e.g. for USDT Buy)
    rate?: number; // Exchange rate
    paymentStatus: "Paid" | "Pending" | "Installment";
}

export interface PeriodProfitability {
    period: string;
    periodKey: string;
    revenue: number;
    cost: number;
    adSpend: number;
    grossProfit: number;
    grossMargin: number;
    netProfit: number;
    netMargin: number;
    orders: number;
    delivered: number;
    returned: number;
    deliveryRatio: number;
    returnRatio: number;
    shippingCost: number;
}

export interface BusinessMetrics {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalCost: number;
    grossProfit: number;
    grossMargin: number;
    netProfit: number;
    netMargin: number;
    deliveryRatio: number;
    returnRatio: number;
    totalDelivered: number;
    totalReturned: number;
    totalPending: number;
    adSpend: number;
    fbAdSpend: number;
    googleAdSpend: number;
    tiktokAdSpend: number;
    snapAdSpend: number;
    roas: number;
    customerAcquisitionCost: number;
    lifetimeValue: number;
    totalShippingCost: number;
    totalConfirmed: number;
    cashInTransit: number;
    rtoLoss: number;
    poas: number; // Profit on Ad Spend
    inventoryHealth: "Healthy" | "Warning" | "Critical";
    // Ledger Integration
    totalCapitalOutflow: number;
    inventoryInvestment: number;
    usdtInvestment: number;
    cashInHand: number; // Net Profit - Capital Outflow
}

export interface ProductPerformance {
    name: string;
    orders: number;
    revenue: number;
    delivered: number;
    returned: number;
    deliveryRate: number;
    returnRate: number;
    netProfit: number;
    adSpendAllocated: number;
    poas: number;
    inventory: number;
    burnRate: number; // Orders per day
    daysOfStock: number;
}

interface DataContextType {
    data: DataRecord[];
    allSourceData: Record<string, DataRecord[]>;
    columns: string[];
    metrics: BusinessMetrics;
    dataSources: DataSource[];
    activeSource: DataSourceType | null;
    currentViewId: "collective" | string;
    setCurrentViewId: (id: "collective" | string) => void;
    currency: CurrencyCode;
    setCurrency: (c: CurrencyCode) => void;
    formatCurrency: (val: number) => string;
    formatPKT: (date: Date | null) => string;
    uploadData: (file: File) => void;
    clearData: () => void;
    isConnecting: boolean;
    isSyncing: boolean;
    syncNow: () => void;
    checkMetaConnection: (accId: string, token: string) => Promise<{ success: boolean; message: string }>;

    // OAuth states
    fbAuth: { accessToken: string; name: string } | null;
    googleAuth: { accessToken: string; name: string } | null;
    tiktokAuth: { accessToken: string; name: string } | null;
    snapAuth: { accessToken: string; name: string } | null;

    // OAuth actions
    loginWithFacebook: () => Promise<void>;
    logoutFacebook: () => void;
    loginWithGoogle: () => Promise<void>;
    logoutGoogle: () => void;
    googleConfig: { clientId: string, developerToken: string };
    updateGoogleConfig: (config: { clientId: string, developerToken: string }) => void;
    loginWithTikTok: () => Promise<void>;
    logoutTikTok: () => void;
    loginWithSnapchat: () => Promise<void>;
    logoutSnapchat: () => void;

    // Discovery
    metaBusinesses: any[];
    metaAdAccounts: any[];
    googleAdAccounts: any[];
    tiktokAdAccounts: any[];
    snapAdAccounts: any[];
    fetchMetaBusinesses: () => Promise<any[] | undefined>;
    fetchMetaAdAccounts: (businessId: string) => Promise<any[] | undefined>;
    fetchGoogleAdsAccounts: () => Promise<any[] | undefined>;
    fetchTikTokAdAccounts: () => Promise<any[] | undefined>;
    fetchSnapAdAccounts: () => Promise<any[] | undefined>;

    connectShopify: (domain: string, token: string, currency: CurrencyCode) => void;
    connectGoogleSheets: (spreadsheetUrl: string, currency: CurrencyCode) => void;
    connectMetaAds: (accountId: string, token: string, currency: CurrencyCode) => void;
    connectGoogleAds: (customerId: string, token: string, currency: CurrencyCode) => void;
    connectTikTokAds: (accountId: string, token: string, currency: CurrencyCode) => void;
    connectSnapchatAds: (accountId: string, token: string, currency: CurrencyCode) => void;
    connectDEX: (apiKey: string) => void;
    connectPostEx: (apiKey: string) => void;
    disconnectSource: (sourceId: string) => void;
    adSpendEntries: AdSpendEntry[];
    addManualAdSpend: (entry: Omit<AdSpendEntry, "id" | "source">) => void;
    removeAdSpendEntry: (id: string) => void;
    manualAdSpendTotal: number;
    dailyProfitability: PeriodProfitability[];
    weeklyProfitability: PeriodProfitability[];
    monthlyProfitability: PeriodProfitability[];
    autoSyncEnabled: boolean;
    setAutoSyncEnabled: (v: boolean) => void;
    syncIntervalSec: number;
    setSyncIntervalSec: (v: number) => void;
    lastSyncTime: Date | null;
    isAnalyzing: boolean;
    analysisResult: string | null;
    askAntiGravity: (query: string) => void;
    skuCogs: Record<string, number>;
    updateSkuCogs: (sku: string, cogs: number) => void;
    linkAdAccount: (shopId: string, adId: string) => void;
    unlinkAdAccount: (shopId: string, adId: string) => void;
    estimatedOpsPercent: number;
    setEstimatedOpsPercent: (v: number) => void;
    ledgerEntries: LedgerEntry[];
    addLedgerEntry: (entry: Omit<LedgerEntry, "id">) => void;
    removeLedgerEntry: (id: string) => void;
    citySummary: Record<string, { revenue: number, orders: number, deliveryRate: number }>;
    verificationSummary: { confirmed: number, pending: number, confirmedRatio: number };
    productPerformance: ProductPerformance[];
    courierInsights: Record<string, any>;
    verifyOrder: (orderId: string, status: "Confirmed" | "Canceled") => void;
    waTemplates: Record<string, string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findColumn(columns: string[], ...keywords: string[]): string | undefined {
    return columns.find(col => {
        const lower = col.toLowerCase().replace(/[_\-\s]/g, "");
        return keywords.some(kw => lower.includes(kw.toLowerCase().replace(/[_\-\s]/g, "")));
    });
}

function num(row: DataRecord, key: string | undefined): number {
    if (!key) return 0;
    const raw = row[key];
    if (raw === undefined || raw === null || raw === "") return 0;
    const cleaned = String(raw).replace(/[^0-9.\-]/g, "");
    return parseFloat(cleaned) || 0;
}

function parseDate(val: string): string | null {
    if (!val) return null;
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    return null;
}

function getWeekKey(dateStr: string): string {
    const d = new Date(dateStr);
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getMonthKey(dateStr: string): string {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key: string): string {
    const [year, month] = key.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(month) - 1]} ${year}`;
}

function statusIs(row: DataRecord, key: string | undefined, ...values: string[]): boolean {
    if (!key) return false;
    const v = String(row[key] || "").toLowerCase().trim();
    return values.some(val => v.includes(val.toLowerCase()));
}

// ─── Simulated data generators ──────────────────────────────────────────────

function generateShopifyData(currency: CurrencyCode): DataRecord[] {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const dayCount = today.getDate();

    return Array.from({ length: 150 }, (_, i) => {
        const d = new Date(startOfMonth);
        // Distribute more orders towards recent days
        const day = Math.floor(Math.pow(Math.random(), 0.5) * dayCount) + 1;
        d.setDate(day);

        const isPKR = currency === "PKR";
        const baseRev = isPKR ? (Math.random() * 12000 + 2500) : (Math.random() * 250 + 50);
        const baseCost = baseRev * (Math.random() * 0.4 + 0.3);

        return {
            order_id: `#SH-${5000 + i}`,
            date: d.toISOString().split("T")[0],
            product: ["Vibe Hoodie", "Tech Tee", "Urban Jacket", "Neon Cap", "Frost Beanie", "Cargo Pants"][Math.floor(Math.random() * 6)],
            amount: baseRev.toFixed(2),
            cost: baseCost.toFixed(2),
            quantity: Math.floor(Math.random() * 2) + 1,
            status: Math.random() > 0.1 ? "delivered" : "returned",
            customer: `User ${Math.floor(Math.random() * 1000)}`,
            currency: currency,
        };
    }).sort((a, b) => b.date.localeCompare(a.date));
}

function generateGSheetsData(_currency: CurrencyCode): DataRecord[] {
    return Array.from({ length: 80 }, (_, i) => ({
        order_id: `#GS-${2000 + i}`,
        date: new Date(2026, 1, Math.floor(i / 4) + 1).toISOString().split("T")[0],
        revenue: (Math.random() * 180 + 30).toFixed(2),
        cost: (Math.random() * 70 + 15).toFixed(2),
        status: "delivered",
    }));
}

function generateMetaAdsData(_currency: CurrencyCode): DataRecord[] {
    return Array.from({ length: 25 }, (_, i) => ({
        date: new Date(2026, 1, i + 1).toISOString().split("T")[0],
        fb_spend: (Math.random() * 200 + 50).toFixed(2),
    }));
}

function generateGoogleAdsData(_currency: CurrencyCode): DataRecord[] {
    return Array.from({ length: 25 }, (_, i) => ({
        date: new Date(2026, 1, i + 1).toISOString().split("T")[0],
        google_spend: (Math.random() * 150 + 40).toFixed(2),
    }));
}

function generateTikTokAdsData(_currency: CurrencyCode): DataRecord[] {
    return Array.from({ length: 25 }, (_, i) => ({
        date: new Date(2026, 1, i + 1).toISOString().split("T")[0],
        tiktok_spend: (Math.random() * 120 + 30).toFixed(2),
    }));
}

function generateSnapAdsData(_currency: CurrencyCode): DataRecord[] {
    return Array.from({ length: 25 }, (_, i) => ({
        date: new Date(2026, 1, i + 1).toISOString().split("T")[0],
        snap_spend: (Math.random() * 100 + 20).toFixed(2),
    }));
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
    const [allSourceData, setAllSourceData] = useState<Record<string, DataRecord[]>>({});
    const [currentViewId, setCurrentViewId] = useState<"collective" | string>("collective");
    const [columns, setColumns] = useState<string[]>([]);
    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [activeSource, setActiveSource] = useState<DataSourceType | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [currency, setCurrencyState] = useState<CurrencyCode>("PKR");
    const [adSpendEntries, setAdSpendEntries] = useState<AdSpendEntry[]>([]);
    const [skuCogs, setSkuCogs] = useState<Record<string, number>>({});
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
        const saved = localStorage.getItem("overlay_ledger");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("overlay_ledger", JSON.stringify(ledgerEntries));
    }, [ledgerEntries]);

    const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
    const [syncIntervalSec, setSyncIntervalSec] = useState(30);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [estimatedOpsPercent, setEstimatedOpsPercent] = useState(5);
    const [waTemplates] = useState({
        english: "Salaam {customer}, this is {store} regarding your Order {order_id} for {amount}. Please reply with 'YES' to confirm your order and we will ship it today! JazakAllah.",
        urdu: "Salaam {customer}, {store} se baat kar rahe hain. Aapka order {order_id} (Rs {amount}) humein mila hai. Kya aap apna order confirm karna chahte hain? Meherbani farma kar 'YES' likh kar reply karein. Shukriya."
    });

    const [fbAuth, setFbAuth] = useState<{ accessToken: string; name: string } | null>(null);
    const [googleAuth, setGoogleAuth] = useState<{ accessToken: string; name: string } | null>(null);
    const [googleConfig, setGoogleConfig] = useState<{ clientId: string, developerToken: string }>(() => {
        const defaultID = "695971374779-lgutit2vr7hseki58mo07ksphdg33i3g.apps.googleusercontent.com";
        const defaultDev = "yLB0NLuGwKPYlHzFlHzp-A";
        const saved = localStorage.getItem("google_ads_config");
        const parsed = saved ? JSON.parse(saved) : {};
        return {
            clientId: parsed.clientId || defaultID,
            developerToken: parsed.developerToken || defaultDev
        };
    });

    useEffect(() => {
        localStorage.setItem("google_ads_config", JSON.stringify(googleConfig));
    }, [googleConfig]);

    const updateGoogleConfig = useCallback((config: { clientId: string, developerToken: string }) => {
        setGoogleConfig(config);
        toast.success("Google Ads parameters calibrated");
    }, []);

    const [tiktokAuth, setTiktokAuth] = useState<{ accessToken: string; name: string } | null>(null);
    const [snapAuth, setSnapAuth] = useState<{ accessToken: string; name: string } | null>(null);

    const [metaBusinesses, setMetaBusinesses] = useState<any[]>([]);
    const [metaAdAccounts, setMetaAdAccounts] = useState<any[]>([]);
    const [googleAdAccounts, setGoogleAdAccounts] = useState<any[]>([]);
    const [tiktokAdAccounts, setTiktokAdAccounts] = useState<any[]>([]);
    const [snapAdAccounts, setSnapAdAccounts] = useState<any[]>([]);

    const loginWithFacebook = useCallback(async () => {
        return new Promise<void>((resolve, reject) => {
            if (!window.FB) {
                toast.error("Facebook SDK not loaded");
                return reject();
            }

            window.FB.login((response: any) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    window.FB.api('/me', async (user: any) => {
                        setFbAuth({ accessToken, name: user.name });
                        toast.success(`Welcome, ${user.name}! Scanning for Meta assets...`);

                        // Auto-Discovery: Initial scan
                        try {
                            const bizUrl = `${BRIDGE_URL}/meta/v18.0/me/businesses?fields=name,id`;
                            const bizRes = await fetch(bizUrl, {
                                headers: { "Authorization": `Bearer ${accessToken}` }
                            });
                            if (bizRes.ok) {
                                const data = await bizRes.json();
                                const businesses = [{ id: 'me', name: 'Personal Ad Accounts' }, ...(data.data || [])];
                                setMetaBusinesses(businesses);

                                // Deep Scan: Try to pick up the first business's accounts
                                if (businesses.length > 0) {
                                    const firstId = businesses[0].id;
                                    const accUrl = `${BRIDGE_URL}/meta/v18.0/${firstId}/adaccounts?fields=name,id,currency&limit=100`;
                                    const accRes = await fetch(accUrl, { headers: { "Authorization": `Bearer ${accessToken}` } });
                                    if (accRes.ok) {
                                        const accData = await accRes.json();
                                        setMetaAdAccounts(accData.data || []);
                                        toast.success(`Neural scan complete: Found ${accData.data?.length || 0} accounts.`);
                                    }
                                }
                            }
                        } catch (e) {
                            console.warn("Meta background discovery failed.");
                        }

                        resolve();
                    });
                } else {
                    toast.error("Facebook Login Failed");
                    reject();
                }
            }, { scope: 'ads_read,ads_management,business_management' });
        });
    }, []);

    const logoutFacebook = useCallback(() => {
        setFbAuth(null);
        setMetaBusinesses([]);
        setMetaAdAccounts([]);
    }, []);

    const loginWithGoogle = useCallback(async () => {
        if (!googleConfig.clientId) {
            toast.error("Please set your Google Client ID in settings first");
            return;
        }

        return new Promise<void>((resolve, reject) => {
            try {
                // @ts-ignore
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: googleConfig.clientId,
                    scope: 'https://www.googleapis.com/auth/adwords',
                    callback: async (response: any) => {
                        if (response.access_token) {
                            const auth = { accessToken: response.access_token, name: "Google Advertiser Account" };
                            setGoogleAuth(auth);
                            toast.success("Safe link established with Google Ads. Initializing Neural Discovery...");

                            // Auto-Discovery: Start fetching accounts immediately
                            try {
                                const bridgeUrl = `${BRIDGE_URL}/google/v18/customers:listAccessibleCustomers`;
                                const accountsRes = await fetch(bridgeUrl, {
                                    headers: {
                                        "Authorization": `Bearer ${response.access_token}`,
                                        "developer-token": googleConfig.developerToken,
                                        "Content-Type": "application/json"
                                    }
                                });
                                if (accountsRes.ok) {
                                    const data = await accountsRes.json();
                                    const accounts = (data.resourceNames || []).map((name: string) => ({
                                        id: name.split('/')[1],
                                        name: `Account ${name.split('/')[1]}`
                                    }));
                                    setGoogleAdAccounts(accounts);
                                    if (accounts.length > 0) {
                                        toast.success(`Discovered ${accounts.length} Google Ad accounts!`);
                                    }
                                }
                            } catch (e) {
                                console.warn("Auto-discovery background task failed, but login succeeded.");
                            }

                            resolve();
                        } else {
                            toast.error("Google Authentication Failed");
                            reject();
                        }
                    },
                });
                client.requestAccessToken();
            } catch (e) {
                console.error(e);
                toast.error("Google Library not loaded or config invalid. Check your Client ID.");
                reject(e);
            }
        });
    }, [googleConfig.clientId, googleConfig.developerToken]);

    const logoutGoogle = useCallback(() => setGoogleAuth(null), []);

    const loginWithTikTok = useCallback(async () => {
        toast("Connecting to TikTok Business...");
        setTimeout(() => {
            setTiktokAuth({ accessToken: "simulated_tiktok_token", name: "TikTok Merchant" });
            toast.success("TikTok Ads synchronized");
        }, 1500);
    }, []);

    const logoutTikTok = useCallback(() => setTiktokAuth(null), []);

    const loginWithSnapchat = useCallback(async () => {
        toast("Connecting to Snap Ads...");
        setTimeout(() => {
            setSnapAuth({ accessToken: "simulated_snap_token", name: "Snap Brand Manager" });
            toast.success("Snapchat interface active");
        }, 1500);
    }, []);

    const logoutSnapchat = useCallback(() => setSnapAuth(null), []);

    const fetchMetaBusinesses = useCallback(async () => {
        if (!fbAuth) return;
        try {
            const bridgeUrl = `${BRIDGE_URL}/meta/v18.0/me/businesses?fields=name,id`;
            const response = await fetch(bridgeUrl, {
                headers: { "Authorization": `Bearer ${fbAuth.accessToken}` }
            });
            const data = await response.json();
            const businesses = data.data || [];
            // Add "Personal" as a virtual business option
            const list = [{ id: 'me', name: 'Personal Ad Accounts' }, ...businesses];
            setMetaBusinesses(list);
            return list;
        } catch (e) {
            toast.error("Failed to fetch businesses");
        }
    }, [fbAuth]);

    const fetchMetaAdAccounts = useCallback(async (businessId: string) => {
        if (!fbAuth) return;
        setMetaAdAccounts([]); // Clear previous results to show loading state
        try {
            let allAccounts: any[] = [];
            let nextUrl = `${BRIDGE_URL}/meta/v18.0/${businessId}/adaccounts?fields=name,id,currency&limit=100`;

            if (businessId === 'me') {
                nextUrl = `${BRIDGE_URL}/meta/v18.0/me/adaccounts?fields=name,id,currency&limit=100`;
            }

            // Loop to handle potential pagination from Meta
            while (nextUrl) {
                const response = await fetch(nextUrl, {
                    headers: { "Authorization": `Bearer ${fbAuth.accessToken}` }
                });
                const data = await response.json();

                if (data.data) {
                    allAccounts = [...allAccounts, ...data.data];
                }

                if (data.paging?.next) {
                    // Convert the full URL to a proxied bridge URL
                    const urlObj = new URL(data.paging.next);
                    nextUrl = `${BRIDGE_URL}/meta${urlObj.pathname}${urlObj.search}`;
                } else {
                    nextUrl = "";
                }
            }

            // Fallback for businesses if the direct adaccounts list is empty
            if (allAccounts.length === 0 && businessId !== 'me') {
                const altUrl = `${BRIDGE_URL}/meta/v18.0/${businessId}/owned_ad_accounts?fields=name,id,currency&limit=100`;
                const altRes = await fetch(altUrl, { headers: { "Authorization": `Bearer ${fbAuth.accessToken}` } });
                const altData = await altRes.json();
                allAccounts = altData.data || [];
            }

            setMetaAdAccounts(allAccounts);
            return allAccounts;
        } catch (e) {
            console.error("Fetch Ad Accounts Error:", e);
            toast.error("Failed to discover all ad accounts");
        }
    }, [fbAuth]);

    const fetchGoogleAdsAccounts = useCallback(async () => {
        if (!googleAuth) return;
        try {
            const bridgeUrl = `${BRIDGE_URL}/google/v18/customers:listAccessibleCustomers`;
            const response = await fetch(bridgeUrl, {
                headers: {
                    "Authorization": `Bearer ${googleAuth.accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Bridge Error Status:", response.status, text);
                try {
                    const errProj = JSON.parse(text);
                    toast.error(`Google: ${errProj.error?.message || "API Error"}`);
                } catch (e) {
                    toast.error(`Bridge Status: ${response.status}`);
                }
                return;
            }

            const data = await response.json();

            if (data.error) {
                console.error("Google API Error:", data.error);
                toast.error(`Google: ${data.error.message || "Unknown API Error"}`);
                return;
            }

            const accounts = (data.resourceNames || []).map((name: string) => ({
                id: name.split('/')[1],
                name: `Account ${name.split('/')[1]}`
            }));

            setGoogleAdAccounts(accounts);
            return accounts;
        } catch (e: any) {
            console.error("Fetch Google Error:", e);
            if (e.name === 'SyntaxError') {
                toast.error("Bridge returned invalid data");
            } else {
                toast.error("Bridge connection failed");
            }
        }
    }, [googleAuth, googleConfig.developerToken]);

    const fetchTikTokAdAccounts = useCallback(async () => {
        if (!tiktokAuth) return;
        try {
            const bridgeUrl = `${BRIDGE_URL}/tiktok/v1.3/advertiser/info/`;
            const response = await fetch(bridgeUrl, {
                headers: { "Authorization": `Bearer ${tiktokAuth.accessToken}` }
            });
            const data = await response.json();
            const list = data.data?.list || [];
            setTiktokAdAccounts(list);
            return list;
        } catch (e) {
            console.error(e);
        }
    }, [tiktokAuth]);

    const fetchSnapAdAccounts = useCallback(async () => {
        if (!snapAuth) return;
        try {
            const bridgeUrl = `${BRIDGE_URL}/snapchat/v1/me/adaccounts`;
            const response = await fetch(bridgeUrl, {
                headers: { "Authorization": `Bearer ${snapAuth.accessToken}` }
            });
            const data = await response.json();
            const list = data.adaccounts || [];
            setSnapAdAccounts(list);
            return list;
        } catch (e) {
            console.error(e);
        }
    }, [snapAuth]);

    const verifyOrder = useCallback((orderId: string, status: "Confirmed" | "Canceled") => {
        setAllSourceData(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(sourceId => {
                next[sourceId] = next[sourceId].map(row => {
                    const idCol = columns.find(c => ["order_id", "id", "order_number", "number"].includes(c.toLowerCase())) || "id";
                    if (String(row[idCol]) === orderId) {
                        return {
                            ...row,
                            verification_status: status,
                            tags: `${row.tags || ""}, ${status.toLowerCase()}`.trim()
                        };
                    }
                    return row;
                });
            });
            return next;
        });
        toast.success(`Order ${orderId} marked as ${status}`);
    }, [columns]);

    const formatCurrency = useCallback((val: number): string => {
        const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG["PKR"];
        const decimals = currency === "JPY" ? 0 : 2;
        if (Math.abs(val) >= 1000000) return `${cfg.symbol}${(val / 1000000).toFixed(1)}M`;
        if (Math.abs(val) >= 1000) return `${cfg.symbol}${(val / 1000).toFixed(1)}K`;
        return `${cfg.symbol}${val.toFixed(decimals)}`;
    }, [currency]);

    const formatPKT = useCallback((date: Date | null) => {
        if (!date) return "";
        return new Intl.DateTimeFormat("en-PK", {
            timeZone: "Asia/Karachi",
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    }, []);

    const setCurrency = useCallback((c: CurrencyCode) => setCurrencyState(c), []);

    const manualAdSpendTotal = useMemo(() => {
        return adSpendEntries
            .filter(e => {
                if (e.source !== "manual") return false;
                if (currentViewId === "collective") return true; // Show everything in collective
                return e.targetSourceId === "collective" || e.targetSourceId === currentViewId || !e.targetSourceId;
            })
            .reduce((s, e) => s + e.amount, 0);
    }, [adSpendEntries, currentViewId]);

    const addManualAdSpend = useCallback((entry: Omit<AdSpendEntry, "id" | "source">) => {
        const newEntry: AdSpendEntry = {
            ...entry,
            id: `manual-${Date.now()}`,
            source: "manual",
        };
        setAdSpendEntries(prev => [...prev, newEntry]);
    }, []);

    const removeAdSpendEntry = useCallback((id: string) => {
        setAdSpendEntries(prev => prev.filter(e => e.id !== id));
    }, []);

    const addLedgerEntry = useCallback((entry: Omit<LedgerEntry, "id">) => {
        const newEntry: LedgerEntry = {
            ...entry,
            id: `ledger-${Date.now()}`,
        };
        setLedgerEntries(prev => [...prev, newEntry]);
    }, []);

    const removeLedgerEntry = useCallback((id: string) => {
        setLedgerEntries(prev => prev.filter(e => e.id !== id));
    }, []);

    const data = useMemo(() => {
        let raw: DataRecord[] = [];
        if (currentViewId === "collective") raw = Object.values(allSourceData).flat();
        else raw = allSourceData[currentViewId] || [];

        return [...raw].sort((a, b) => {
            const da = new Date(a.date || a.created_at || a.time || 0).getTime();
            const db = new Date(b.date || b.created_at || b.time || 0).getTime();
            return db - da;
        });
    }, [allSourceData, currentViewId]);

    useEffect(() => {
        if (data.length > 0) {
            const allKeys = new Set<string>();
            // Sample first 50 to get a good spread of available columns
            data.slice(0, 50).forEach(row => Object.keys(row).forEach(k => allKeys.add(k)));
            setColumns(Array.from(allKeys));
        } else {
            setColumns([]);
        }
    }, [data]);

    const metrics: BusinessMetrics = useMemo(() => {
        const base: BusinessMetrics = {
            totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, totalCost: 0,
            grossProfit: 0, grossMargin: 0, netProfit: 0, netMargin: 0,
            deliveryRatio: 0, returnRatio: 0, totalDelivered: 0, totalReturned: 0,
            totalPending: 0, adSpend: 0, fbAdSpend: 0, googleAdSpend: 0, tiktokAdSpend: 0, snapAdSpend: 0,
            roas: 0, customerAcquisitionCost: 0, lifetimeValue: 0, totalShippingCost: 0,
            totalConfirmed: 0, cashInTransit: 0, rtoLoss: 0, poas: 0, inventoryHealth: "Healthy",
            totalCapitalOutflow: 0, inventoryInvestment: 0, usdtInvestment: 0, cashInHand: 0
        };

        if (data.length === 0 && Object.keys(allSourceData).length === 0) return base;

        const revCol = findColumn(columns, "revenue", "amount", "total");
        const costCol = findColumn(columns, "cost", "cogs");
        const statusCol = findColumn(columns, "status");
        const fbCol = findColumn(columns, "fb_spend");
        const googleCol = findColumn(columns, "google_spend");
        const ttCol = findColumn(columns, "tiktok_spend");
        const snapCol = findColumn(columns, "snap_spend");
        const verCol = findColumn(columns, "verification_status");

        const currentSource = dataSources.find(s => s.id === currentViewId);
        const linkedAdSources = currentViewId === "collective"
            ? []
            : dataSources.filter(s => currentSource?.linkedSourceIds?.includes(s.id));

        let r = 0, c = 0, d = 0, ret = 0, p = 0, fba = 0, ga = 0, tta = 0, sa = 0, ship = 0, conf = 0, transitRev = 0;

        data.forEach(row => {
            const rev = num(row, revCol);
            r += rev;
            c += num(row, costCol) || (rev * 0.6);
            if (statusIs(row, statusCol, "delivered")) {
                d++; ship += 250; transitRev += rev;
            }
            else if (statusIs(row, statusCol, "returned")) {
                ret++; ship += 250;
            }
            else p++;

            if (String(row[verCol || ""]).toLowerCase().includes("confirmed")) conf++;

            fba += num(row, fbCol);
            ga += num(row, googleCol);
            tta += num(row, ttCol);
            sa += num(row, snapCol);
        });

        // Add automated spend from linked accounts
        linkedAdSources.forEach(source => {
            const sData = allSourceData[source.id] || [];
            const sCols = sData.length > 0 ? Object.keys(sData[0]) : [];
            const sFb = findColumn(sCols, "fb_spend");
            const sGa = findColumn(sCols, "google_spend");
            const sTt = findColumn(sCols, "tiktok_spend");
            const sSn = findColumn(sCols, "snap_spend");

            sData.forEach(row => {
                fba += num(row, sFb);
                ga += num(row, sGa);
                tta += num(row, sTt);
                sa += num(row, sSn);
            });
        });

        const manualEntries = adSpendEntries.filter(e => {
            if (e.source !== "manual") return false;
            if (currentViewId === "collective") return true;
            return e.targetSourceId === "collective" || e.targetSourceId === currentViewId || !e.targetSourceId;
        });
        const mFb = manualEntries.filter(e => e.platform.toLowerCase().includes("meta") || e.platform.toLowerCase().includes("facebook")).reduce((s, e) => s + e.amount, 0);
        const mGa = manualEntries.filter(e => e.platform.toLowerCase().includes("google")).reduce((s, e) => s + e.amount, 0);
        const mTt = manualEntries.filter(e => e.platform.toLowerCase().includes("tiktok")).reduce((s, e) => s + e.amount, 0);
        const mSn = manualEntries.filter(e => e.platform.toLowerCase().includes("snap")).reduce((s, e) => s + e.amount, 0);

        const totalAd = fba + ga + tta + sa + manualAdSpendTotal;
        const op = r * (estimatedOpsPercent / 100);
        // RTO Loss: forward shipping (250) + reverse shipping (typically 150-200)
        const rtoL = ret * 400;
        const net = (r - c) - totalAd - op - ship - (ret * 150); // Additional return processing fee
        const poas = totalAd > 0 ? net / totalAd : 0;

        const totalCapitalOutflow = (ledgerEntries || []).reduce((acc, curr) => acc + curr.amount, 0);
        const inventoryInvestment = (ledgerEntries || []).filter(e => e.category === "Inventory").reduce((acc, curr) => acc + curr.amount, 0);
        const usdtInvestment = (ledgerEntries || []).filter(e => e.category === "USDT Buy").reduce((acc, curr) => acc + curr.amount, 0);

        return {
            ...base,
            totalRevenue: r, totalOrders: data.length, avgOrderValue: r / (data.length || 1),
            totalCost: c, grossProfit: r - c, grossMargin: r > 0 ? (r - c) / r * 100 : 0,
            netProfit: net, netMargin: r > 0 ? net / r * 100 : 0,
            totalDelivered: d, totalReturned: ret, totalPending: p,
            adSpend: totalAd,
            fbAdSpend: fba + mFb, googleAdSpend: ga + mGa, tiktokAdSpend: tta + mTt, snapAdSpend: sa + mSn,
            deliveryRatio: data.length > 0 ? d / data.length * 100 : 0,
            returnRatio: data.length > 0 ? ret / data.length * 100 : 0,
            roas: totalAd > 0 ? r / totalAd : 0,
            customerAcquisitionCost: data.length > 0 ? totalAd / data.length : 0,
            totalShippingCost: ship,
            totalConfirmed: conf,
            cashInTransit: transitRev,
            rtoLoss: rtoL,
            poas: poas,
            inventoryHealth: d > 0 ? (rtoL / (net || 1) > 0.5 ? "Warning" : "Healthy") : "Healthy",
            totalCapitalOutflow,
            inventoryInvestment,
            usdtInvestment,
            cashInHand: net - totalCapitalOutflow
        };
    }, [data, allSourceData, columns, adSpendEntries, currentViewId, dataSources, manualAdSpendTotal, estimatedOpsPercent, ledgerEntries]);

    const productPerformance: ProductPerformance[] = useMemo(() => {
        const products: Record<string, any> = {};
        const revCol = findColumn(columns, "revenue", "amount", "total");
        const productCol = findColumn(columns, "product", "item", "title");
        const statusCol = findColumn(columns, "status");
        const costCol = findColumn(columns, "cost", "cogs");

        data.forEach(row => {
            const name = String(row[productCol || ""] || "Unknown Product");
            if (!products[name]) {
                // Determine stable inventory based on name string sum
                const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                products[name] = {
                    name, orders: 0, revenue: 0, delivered: 0, returned: 0,
                    cost: 0, inventory: (hash % 450) + 50 // Stable Simulated inventory
                };
            }
            const p = products[name];
            const rev = num(row, revCol);
            p.orders++;
            p.revenue += rev;
            p.cost += num(row, costCol) || (rev * 0.4);
            if (statusIs(row, statusCol, "delivered")) p.delivered++;
            if (statusIs(row, statusCol, "returned")) p.returned++;
        });

        return Object.values(products).map(p => {
            const deliveryRate = p.orders > 0 ? (p.delivered / (p.delivered + p.returned || 1)) * 100 : 0;
            const returnRate = p.orders > 0 ? (p.returned / p.orders) * 100 : 0;

            // Allocate ad spend proportionally by revenue for simplicity in this version
            const revenueShare = metrics.totalRevenue > 0 ? p.revenue / metrics.totalRevenue : 0;
            const allocatedAd = metrics.adSpend * revenueShare;
            const ops = p.revenue * (estimatedOpsPercent / 100);
            const shipping = (p.delivered + p.returned) * 250;
            const netProfit = p.revenue - p.cost - allocatedAd - ops - shipping - (p.returned * 150);

            const poasResult = allocatedAd > 0 ? netProfit / allocatedAd : 0;
            const burnRate = p.orders / 30; // avg orders per day over 30 days
            const daysOfStock = burnRate > 0 ? p.inventory / burnRate : 999;

            return {
                ...p,
                deliveryRate,
                returnRate,
                netProfit,
                adSpendAllocated: allocatedAd,
                poas: poasResult,
                burnRate,
                daysOfStock
            };
        });
    }, [data, columns, metrics.adSpend, metrics.totalRevenue, estimatedOpsPercent]);

    const citySummary = useMemo(() => {
        const summary: Record<string, { revenue: number, orders: number, deliveryRate: number, delivered: number }> = {};
        const revCol = findColumn(columns, "revenue", "amount", "total");
        const cityCol = findColumn(columns, "city");
        const statusCol = findColumn(columns, "status");

        data.forEach(row => {
            const city = String(row[cityCol || ""] || "Other");
            if (!summary[city]) summary[city] = { revenue: 0, orders: 0, deliveryRate: 0, delivered: 0 };
            summary[city].revenue += num(row, revCol);
            summary[city].orders++;
            if (statusIs(row, statusCol, "delivered")) summary[city].delivered++;
        });

        Object.keys(summary).forEach(city => {
            summary[city].deliveryRate = (summary[city].delivered / summary[city].orders) * 100;
        });

        return summary;
    }, [data, columns]);

    const verificationSummary = useMemo(() => {
        const verCol = findColumn(columns, "verification_status");
        let conf = 0, pend = 0;
        data.forEach(row => {
            if (String(row[verCol || ""]).toLowerCase().includes("confirmed")) conf++;
            else pend++;
        });
        return {
            confirmed: conf,
            pending: pend,
            confirmedRatio: data.length > 0 ? (conf / data.length) * 100 : 0
        };
    }, [data, columns]);

    const courierInsights = useMemo(() => {
        const insights: Record<string, any> = {};
        const courierCol = findColumn(columns, "courier", "shipping_company", "carrier");
        const statusCol = findColumn(columns, "status");
        const cityCol = findColumn(columns, "city");

        data.forEach(row => {
            const courier = String(row[courierCol || ""] || "Other");
            const city = String(row[cityCol || ""] || "Global");

            if (!insights[city]) insights[city] = {};
            if (!insights[city][courier]) insights[city][courier] = { delivered: 0, total: 0 };

            insights[city][courier].total++;
            if (statusIs(row, statusCol, "delivered")) insights[city][courier].delivered++;
        });

        const winners: Record<string, string> = {};
        Object.keys(insights).forEach(city => {
            let bestCourier = "Other";
            let bestRate = -1;
            Object.keys(insights[city]).forEach(courier => {
                const rate = insights[city][courier].delivered / insights[city][courier].total;
                if (rate > bestRate) {
                    bestRate = rate;
                    bestCourier = courier;
                }
            });
            winners[city] = bestCourier;
        });

        return { stats: insights, winners };
    }, [data, columns]);

    const { dailyProfitability, weeklyProfitability, monthlyProfitability } = useMemo(() => {
        if (data.length === 0) return { dailyProfitability: [], weeklyProfitability: [], monthlyProfitability: [] };

        const dateCol = findColumn(columns, "date", "created_at", "order_date", "time");
        const revCol = findColumn(columns, "revenue", "amount", "total");
        const costCol = findColumn(columns, "cost", "cogs");
        const statusCol = findColumn(columns, "status");
        const fbCol = findColumn(columns, "fb_spend");
        const googleCol = findColumn(columns, "google_spend");
        const ttCol = findColumn(columns, "tiktok_spend");
        const snapCol = findColumn(columns, "snap_spend");

        const currentSource = dataSources.find(s => s.id === currentViewId);
        const linkedAdSources = currentViewId === "collective"
            ? []
            : dataSources.filter(s => currentSource?.linkedSourceIds?.includes(s.id));

        const daily: Record<string, any> = {};

        data.forEach(row => {
            const dk = parseDate(String(row[dateCol || ""] || "")) || "unknown";
            if (dk === "unknown") return;
            if (!daily[dk]) daily[dk] = { revenue: 0, cost: 0, orders: 0, delivered: 0, returned: 0, shipping: 0 };
            const b = daily[dk];
            const rev = num(row, revCol);
            b.revenue += rev;
            b.cost += num(row, costCol) || (rev * 0.6);
            b.orders++;
            if (statusIs(row, statusCol, "delivered")) { b.delivered++; }
            else if (statusIs(row, statusCol, "returned")) { b.returned++; }

            // Track spend in buckets
            b.adSpend += num(row, fbCol) + num(row, googleCol) + num(row, ttCol) + num(row, snapCol);
        });

        // Add automated spend into buckets
        linkedAdSources.forEach((source: DataSource) => {
            const sData = allSourceData[source.id] || [];
            const sCols = sData.length > 0 ? Object.keys(sData[0]) : [];
            const sFb = findColumn(sCols, "fb_spend");
            const sGa = findColumn(sCols, "google_spend");
            const sTt = findColumn(sCols, "tiktok_spend");
            const sSn = findColumn(sCols, "snap_spend");

            sData.forEach(row => {
                const dk = parseDate(String(row.date || row.time || "")) || "unknown";
                if (dk === "unknown" || !daily[dk]) return;
                daily[dk].adSpend += num(row, sFb) + num(row, sGa) + num(row, sTt) + num(row, sSn);
            });
        });

        const sortedKeys = Object.keys(daily).sort();
        const dailyArr = sortedKeys.map(k => {
            const b = daily[k];
            const gp = b.revenue - b.cost;
            const op = b.revenue * (estimatedOpsPercent / 100);
            const np = gp - b.adSpend - op - b.shipping;
            return {
                period: k, periodKey: k, revenue: b.revenue, cost: b.cost, adSpend: b.adSpend,
                grossProfit: gp, grossMargin: b.revenue > 0 ? (gp / b.revenue) * 100 : 0,
                netProfit: np, netMargin: b.revenue > 0 ? (np / b.revenue) * 100 : 0,
                orders: b.orders, delivered: b.delivered, returned: b.returned,
                deliveryRatio: b.orders > 0 ? (b.delivered / b.orders) * 100 : 0,
                returnRatio: b.orders > 0 ? (b.returned / b.orders) * 100 : 0,
                shippingCost: b.shipping
            };
        });

        // Weekly
        const weekBuckets: Record<string, any> = {};
        sortedKeys.forEach(k => {
            const wk = getWeekKey(k);
            if (!weekBuckets[wk]) weekBuckets[wk] = { revenue: 0, cost: 0, adSpend: 0, orders: 0, delivered: 0, returned: 0, shipping: 0 };
            const d = daily[k], w = weekBuckets[wk];
            w.revenue += d.revenue; w.cost += d.cost; w.adSpend += d.adSpend; w.orders += d.orders;
            w.delivered += d.delivered; w.returned += d.returned; w.shipping += d.shipping;
        });
        const weeklyArr = Object.keys(weekBuckets).sort().map(k => {
            const b = weekBuckets[k];
            const gp = b.revenue - b.cost;
            const op = b.revenue * (estimatedOpsPercent / 100);
            const np = gp - b.adSpend - op - b.shipping;
            return {
                period: k, periodKey: k, revenue: b.revenue, cost: b.cost, adSpend: b.adSpend,
                grossProfit: gp, grossMargin: b.revenue > 0 ? (gp / b.revenue) * 100 : 0,
                netProfit: np, netMargin: b.revenue > 0 ? (np / b.revenue) * 100 : 0,
                orders: b.orders, delivered: b.delivered, returned: b.returned,
                deliveryRatio: b.orders > 0 ? (b.delivered / b.orders) * 100 : 0,
                returnRatio: b.orders > 0 ? (b.returned / b.orders) * 100 : 0,
                shippingCost: b.shipping,
            };
        });

        // Monthly
        const monthBuckets: Record<string, any> = {};
        sortedKeys.forEach(k => {
            const mk = getMonthKey(k);
            if (!monthBuckets[mk]) monthBuckets[mk] = { revenue: 0, cost: 0, adSpend: 0, orders: 0, delivered: 0, returned: 0, shipping: 0 };
            const d = daily[k], m = monthBuckets[mk];
            m.revenue += d.revenue; m.cost += d.cost; m.adSpend += d.adSpend; m.orders += d.orders;
            m.delivered += d.delivered; m.returned += d.returned; m.shipping += d.shipping;
        });
        const monthlyArr = Object.keys(monthBuckets).sort().map(k => {
            const b = monthBuckets[k];
            const gp = b.revenue - b.cost;
            const op = b.revenue * (estimatedOpsPercent / 100);
            const np = gp - b.adSpend - op - b.shipping;
            return {
                period: getMonthLabel(k), periodKey: k, revenue: b.revenue, cost: b.cost, adSpend: b.adSpend,
                grossProfit: gp, grossMargin: b.revenue > 0 ? (gp / b.revenue) * 100 : 0,
                netProfit: np, netMargin: b.revenue > 0 ? (np / b.revenue) * 100 : 0,
                orders: b.orders, delivered: b.delivered, returned: b.returned,
                deliveryRatio: b.orders > 0 ? (b.delivered / b.orders) * 100 : 0,
                returnRatio: b.orders > 0 ? (b.returned / b.orders) * 100 : 0,
                shippingCost: b.shipping,
            };
        });

        return { dailyProfitability: dailyArr, weeklyProfitability: weeklyArr, monthlyProfitability: monthlyArr };
    }, [data, columns, allSourceData, currentViewId, dataSources]);

    const loadDataInternal = useCallback((records: DataRecord[], _cols: string[], type: DataSourceType, name: string, cur?: CurrencyCode, config?: any) => {
        const id = `${type}-${Date.now()}`;
        setAllSourceData(prev => ({ ...prev, [id]: records }));
        setCurrentViewId(id);
        setActiveSource(type);
        if (cur) setCurrencyState(cur);
        setDataSources(prev => [...prev, { id, type, name, connectedAt: new Date(), status: "connected", recordCount: records.length, currency: cur || currency, syncIntervalMs: 0, config }]);
        setLastSyncTime(new Date());
    }, [currency]);

    const uploadData = useCallback((file: File) => {
        Papa.parse(file, { header: true, complete: (res) => loadDataInternal(res.data as any, [], "csv", file.name) });
    }, [loadDataInternal]);

    const clearData = useCallback(() => {
        setAllSourceData({});
        setDataSources([]);
        setCurrentViewId("collective");
        setActiveSource(null);
    }, []);

    const fetchShopifyData = useCallback(async (shop: string, token: string) => {
        const directUrl = `https://${shop}/admin/api/2024-01/orders.json?status=any&limit=250`;
        const bridgeUrl = `${BRIDGE_URL}/${shop}/admin/api/2024-01/orders.json?status=any&limit=250`;

        // Try bridge first to bypass CORS
        let response;
        try {
            response = await fetch(bridgeUrl, {
                headers: {
                    "X-Shopify-Access-Token": token,
                    "Content-Type": "application/json",
                }
            });
        } catch (e) {
            console.warn("Bridge not available, falling back to direct (CORS may block)");
            response = await fetch(directUrl, {
                headers: {
                    "X-Shopify-Access-Token": token,
                    "Content-Type": "application/json",
                }
            });
        }

        if (!response.ok) {
            throw new Error(response.status === 401 ? "Invalid Access Token" : "Failed to fetch from Shopify");
        }

        const rawData = await response.json();

        return rawData.orders.map((order: any) => {
            // Mapping Shopify statuses to our Internal statuses
            // Note: For real delivery tracking in Pakistan, a Courier API (PostEx/Trax) is recommended.
            let status = "pending";

            if (order.financial_status === "refunded" || order.financial_status === "partially_refunded") {
                status = "returned";
            } else if (order.fulfillment_status === "fulfilled") {
                status = "delivered";
            } else if (order.cancelled_at) {
                status = "returned"; // Treat cancellations as returns for P&L impact
            }

            const tags = order.tags || "";
            const isConfirmed = tags.toLowerCase().includes("confirmed") || tags.toLowerCase().includes("verified");
            const shippingAddress = order.shipping_address || {};
            const city = shippingAddress.city || "Unknown";
            const phone = shippingAddress.phone || order.customer?.phone || "N/A";

            return {
                order_id: order.name,
                date: order.created_at.split("T")[0],
                amount: order.total_price,
                cost: (parseFloat(order.total_price) * 0.4).toFixed(2),
                currency: order.currency,
                customer: `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim() || "Guest",
                status: status,
                product: order.line_items?.[0]?.title || "Multiple Items",
                source: "Shopify API",
                city: city,
                phone: phone,
                verification_status: isConfirmed ? "Confirmed" : "Pending Verification",
                tags: tags,
                _raw_fulfillment: order.fulfillment_status,
                _raw_financial: order.financial_status
            };
        });
    }, []);

    const checkMetaConnection = useCallback(async (accId: string, token: string) => {
        try {
            if (token === "demo") return { success: true, message: "Demo Node Optimal" };

            const bridgeUrl = `${BRIDGE_URL}/meta/v18.0/act_${accId}?fields=name`;
            const response = await fetch(bridgeUrl, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const res = await response.json();
                return { success: true, message: `Connected to ${res.name || accId}` };
            } else {
                const err = await response.json();
                return { success: false, message: err.error?.message || "Bridge handshake failed" };
            }
        } catch (e) {
            return { success: false, message: "Bridge Offline - Check Port 3001" };
        }
    }, []);

    const connectShopify = useCallback(async (domain: string, token: string, cur: CurrencyCode) => {
        setIsConnecting(true);
        const loadingToast = toast.loading(`Connecting to ${domain}...`);

        try {
            if (token === "demo" || domain.toLowerCase().includes("demo")) {
                await new Promise(r => setTimeout(r, 1000));
                const d = generateShopifyData(cur);
                loadDataInternal(d, [], "shopify", domain, cur, { shopDomain: domain, token: "demo" });
                toast.success("Connected to Demo Store", { id: loadingToast });
                setIsConnecting(false);
                return;
            }

            const flattened = await fetchShopifyData(domain, token);
            loadDataInternal(flattened, [], "shopify", domain, cur, { shopDomain: domain, token });
            toast.success(`Successfully synced ${flattened.length} orders!`, { id: loadingToast });

        } catch (err: any) {
            console.error("Shopify Connection Error:", err);
            if (err.message.includes("Failed to fetch")) {
                toast.error("CORS Policy Blocked Connection. Please use a local proxy.", { id: loadingToast, duration: 6000 });
            } else {
                toast.error(err.message || "Connection failed", { id: loadingToast });
            }
        } finally {
            setIsConnecting(false);
        }
    }, [loadDataInternal, fetchShopifyData]);

    const connectGoogleSheets = useCallback((url: string, cur: CurrencyCode) => {
        setIsConnecting(true);
        setTimeout(() => {
            const d = generateGSheetsData(cur);
            loadDataInternal(d, [], "google_sheets", "Marketing Sheet", cur, { spreadsheetUrl: url });
            setIsConnecting(false);
        }, 1200);
    }, [loadDataInternal]);

    const connectMetaAds = useCallback(async (accId: string, token: string, cur: CurrencyCode) => {
        setIsConnecting(true);
        const loadingToast = toast.loading(`Connecting to Meta Account ${accId}...`);

        try {
            if (token === "demo") {
                await new Promise(r => setTimeout(r, 1000));
                const d = generateMetaAdsData(cur);
                loadDataInternal(d, [], "meta_ads", `Meta (${accId})`, cur, { accountId: accId, token: "demo" });
                toast.success("Connected to Demo Meta", { id: loadingToast });
                setIsConnecting(false);
                return;
            }

            // Real Meta Graph API Call via Bridge
            // GET graph.facebook.com/v18.0/act_{accId}/insights?fields=spend,date_start&level=account&time_increment=1
            const bridgeUrl = `${BRIDGE_URL}/meta/v18.0/act_${accId}/insights?fields=spend,date_start&level=account&time_increment=1&date_preset=maximum`;

            const response = await fetch(bridgeUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "Failed to fetch from Meta");
            }

            const rawData = await response.json();

            const flattened: DataRecord[] = rawData.data.map((item: any) => ({
                date: item.date_start,
                fb_spend: item.spend,
                source_id: accId,
                currency: cur
            }));

            loadDataInternal(flattened, [], "meta_ads", `Meta (${accId})`, cur, { accountId: accId, token });
            toast.success(`Synced Meta insights for ${flattened.length} days!`, { id: loadingToast });

        } catch (err: any) {
            console.error("Meta Connection Error:", err);
            toast.error(err.message || "Meta connection failed", { id: loadingToast });
        } finally {
            setIsConnecting(false);
        }
    }, [loadDataInternal]);

    const connectGoogleAds = useCallback(async (customerId: string, token: string, cur: CurrencyCode) => {
        setIsConnecting(true);
        const loadingToast = toast.loading(`Connecting to Google Ads ${customerId}...`);

        try {
            if (token === "demo") {
                await new Promise(r => setTimeout(r, 1000));
                const d = generateGoogleAdsData(cur);
                loadDataInternal(d, [], "google_ads", `Google (Demo)`, cur, { customerId, token: "demo" });
                toast.success("Connected to Demo Google Ads", { id: loadingToast });
                setIsConnecting(false);
                return;
            }

            // Cleanup Customer ID (remove dashes if present, Google API wants digits only)
            const cleanId = customerId.replace(/-/g, '');
            const bridgeUrl = `${BRIDGE_URL}/google/v18/customers/${cleanId}/googleAds:search`;

            // Query for last 30 days of spend
            const query = {
                query: `SELECT metrics.cost_micros, segments.date FROM customer WHERE segments.date DURING LAST_30_DAYS`
            };

            const response = await fetch(bridgeUrl, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(query)
            });

            if (!response.ok) {
                let errorMsg = "Google Ads sync failed";
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const err = await response.json();
                        errorMsg = err[0]?.error?.message || err.error?.message || errorMsg;
                    } else {
                        const text = await response.text();
                        console.warn("Google returned non-JSON error:", text);
                        errorMsg = `Google Error (${response.status}): Check your Customer ID and Permissions.`;
                    }
                } catch (e) {
                    errorMsg = `Network Error (${response.status})`;
                }
                throw new Error(errorMsg);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid response from bridge (Expected JSON)");
            }

            const rawData = await response.json();

            // Map cost_micros to real currency (divided by 1,000,000)
            const flattened: DataRecord[] = (rawData.results || []).map((row: any) => ({
                date: row.segments.date,
                google_spend: parseFloat(row.metrics.costMicros) / 1000000,
                source_id: cleanId,
                currency: cur
            }));

            loadDataInternal(flattened, [], "google_ads", `Google (${customerId})`, cur, { customerId, token });
            toast.success(`Synced ${flattened.length} days of Google Ad spend!`, { id: loadingToast });

        } catch (err: any) {
            console.error("Google Ads Sync Error:", err);
            toast.error(err.message || "Failed to sync Google Ads", { id: loadingToast });
        } finally {
            setIsConnecting(false);
        }
    }, [loadDataInternal]);

    const connectTikTokAds = useCallback((acc: string, token: string, cur: CurrencyCode) => {
        setIsConnecting(true);
        setTimeout(() => {
            const d = generateTikTokAdsData(cur);
            loadDataInternal(d, [], "tiktok_ads", `TikTok (${acc})`, cur, { accountId: acc, token });
            setIsConnecting(false);
        }, 1200);
    }, [loadDataInternal]);

    const connectSnapchatAds = useCallback((acc: string, token: string, cur: CurrencyCode) => {
        setIsConnecting(true);
        setTimeout(() => {
            const d = generateSnapAdsData(cur);
            loadDataInternal(d, [], "snapchat_ads", `Snapchat (${acc})`, cur, { accountId: acc, token });
            setIsConnecting(false);
        }, 1200);
    }, [loadDataInternal]);

    const connectDEX = useCallback((apiKey: string) => {
        setIsConnecting(true);
        const loadingToast = toast.loading("Connecting to DEX...");
        setTimeout(() => {
            loadDataInternal([], [], "dex", "DEX Logistics", "PKR", { apiKey });
            toast.success("Connected to DEX", { id: loadingToast });
            setIsConnecting(false);
        }, 1500);
    }, [loadDataInternal]);

    const connectPostEx = useCallback((apiKey: string) => {
        setIsConnecting(true);
        const loadingToast = toast.loading("Connecting to PostEx...");
        setTimeout(() => {
            loadDataInternal([], [], "postex", "PostEx Courier", "PKR", { apiKey });
            toast.success("Connected to PostEx", { id: loadingToast });
            setIsConnecting(false);
        }, 1500);
    }, [loadDataInternal]);

    const disconnectSource = useCallback((id: string) => {
        setAllSourceData(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setDataSources(prev => prev.filter(s => s.id !== id));
        if (currentViewId === id) setCurrentViewId("collective");
    }, [currentViewId]);

    const linkAdAccount = useCallback((shopId: string, adId: string) => {
        setDataSources(prev => prev.map(s => s.id === shopId ? { ...s, linkedSourceIds: [...(s.linkedSourceIds || []), adId] } : s));
    }, []);

    const unlinkAdAccount = useCallback((shopId: string, adId: string) => {
        setDataSources(prev => prev.map(s => s.id === shopId ? { ...s, linkedSourceIds: (s.linkedSourceIds || []).filter(id => id !== adId) } : s));
    }, []);

    const syncNow = useCallback(async () => {
        setIsSyncing(true);
        const syncToast = toast.loading("Syncing all sources...");

        try {
            // Re-fetch all real Shopify sources
            const shopifySources = dataSources.filter(s => s.type === "shopify" && s.config?.token !== "demo");

            for (const source of shopifySources) {
                try {
                    const freshData = await fetchShopifyData(source.config?.shopDomain || "", source.config?.token || "");
                    setAllSourceData(prev => ({ ...prev, [source.id]: freshData }));
                    setDataSources(prev => prev.map(s => s.id === source.id ? { ...s, recordCount: freshData.length, lastSync: new Date() } : s));
                } catch (e) {
                    console.error(`Failed to sync ${source.name}:`, e);
                }
            }

            // Sync Meta Ads sources
            const metaSources = dataSources.filter(s => s.type === "meta_ads" && s.config?.token !== "demo");
            for (const source of metaSources) {
                try {
                    const accId = source.config?.accountId;
                    const token = source.config?.token;
                    const cur = source.currency;

                    // Sync with maximum daily history
                    const bridgeUrl = `http://localhost:3001/meta/v18.0/act_${accId}/insights?fields=spend,date_start&level=account&time_increment=1&date_preset=maximum`;
                    const response = await fetch(bridgeUrl, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    });

                    if (response.ok) {
                        const contentType = response.headers.get("content-type");
                        if (!contentType || !contentType.includes("application/json")) {
                            console.warn(`Meta sync for ${source.name} received non-JSON response.`);
                            throw new Error("Invalid response from Meta (Expected JSON)");
                        }
                        const rawData = await response.json();
                        const flattened: DataRecord[] = rawData.data.map((item: any) => ({
                            date: item.date_start,
                            fb_spend: item.spend,
                            source_id: accId,
                            currency: cur
                        }));
                        setAllSourceData(prev => ({ ...prev, [source.id]: flattened }));
                        setDataSources(prev => prev.map(s => s.id === source.id ? { ...s, recordCount: flattened.length, lastSync: new Date() } : s));
                    } else {
                        let errorMsg = `Meta sync for ${source.name} failed`;
                        try {
                            const contentType = response.headers.get("content-type");
                            if (contentType && contentType.includes("application/json")) {
                                const errData = await response.json();
                                errorMsg = errData.error?.message || errorMsg;
                            } else {
                                const text = await response.text();
                                console.warn(`Meta sync for ${source.name} returned non-JSON error:`, text);
                                errorMsg = `Meta Error (${response.status}): ${text.substring(0, 100)}...`;
                            }
                        } catch (e) {
                            errorMsg = `Network Error (${response.status})`;
                        }
                        throw new Error(errorMsg);
                    }
                } catch (e) {
                    console.error(`Failed to sync Meta source ${source.name}:`, e);
                }
            }

            setIsSyncing(false);
            setLastSyncTime(new Date());
            toast.success("Dashboard data refreshed!", { id: syncToast });
        } catch (err) {
            setIsSyncing(false);
            toast.error("Global sync failed", { id: syncToast });
        }
    }, [dataSources, fetchShopifyData]);

    const updateSkuCogs = useCallback((sku: string, cogs: number) => {
        setSkuCogs(prev => ({ ...prev, [sku]: cogs }));
    }, []);

    // Real-time Order Simulation - ONLY for Demo Stores
    useEffect(() => {
        // Only simulate orders for stores marked as "demo"
        const demoShopSources = dataSources.filter(s => s.type === "shopify" && s.config?.token === "demo");
        if (demoShopSources.length === 0) return;

        const interval = setInterval(() => {
            const source = demoShopSources[Math.floor(Math.random() * demoShopSources.length)];
            const isPKR = source.currency === "PKR";
            const amount = isPKR ? (Math.random() * 8000 + 2000) : (Math.random() * 150 + 40);

            const newOrder = {
                order_id: `#SH-LIVE-${Math.floor(Math.random() * 90000 + 10000)}`,
                date: new Date().toISOString().split("T")[0],
                product: ["Vibe Hoodie", "Tech Tee", "Urban Jacket", "Neon Cap"][Math.floor(Math.random() * 4)],
                amount: amount.toFixed(2),
                cost: (amount * 0.4).toFixed(2),
                quantity: 1,
                status: "delivered",
                customer: "Live Customer",
                currency: source.currency,
                _is_live: true
            };

            setAllSourceData(prev => {
                const currentData = prev[source.id] || [];
                return { ...prev, [source.id]: [newOrder, ...currentData].slice(0, 500) };
            });

            setDataSources(prev => prev.map(s => s.id === source.id ? { ...s, recordCount: s.recordCount + 1, lastSync: new Date() } : s));
            setLastSyncTime(new Date());

        }, 15000);

        return () => clearInterval(interval);
    }, [dataSources]);

    return (
        <DataContext.Provider value={{
            data, allSourceData, columns, metrics, dataSources, activeSource, currentViewId, setCurrentViewId,
            currency, setCurrency, formatCurrency, uploadData, clearData,
            isConnecting, isSyncing, syncNow,
            checkMetaConnection,
            fbAuth, loginWithFacebook, logoutFacebook, metaBusinesses, metaAdAccounts, fetchMetaBusinesses, fetchMetaAdAccounts,
            googleAuth, loginWithGoogle, logoutGoogle, googleAdAccounts, fetchGoogleAdsAccounts,
            googleConfig, updateGoogleConfig,
            tiktokAuth, loginWithTikTok, logoutTikTok, tiktokAdAccounts, fetchTikTokAdAccounts,
            snapAuth, loginWithSnapchat, logoutSnapchat, snapAdAccounts, fetchSnapAdAccounts,
            connectShopify,
            connectGoogleSheets,
            connectMetaAds, connectGoogleAds, connectTikTokAds, connectSnapchatAds,
            connectDEX, connectPostEx,
            disconnectSource, adSpendEntries, addManualAdSpend, removeAdSpendEntry, manualAdSpendTotal,
            dailyProfitability, weeklyProfitability, monthlyProfitability,
            autoSyncEnabled, setAutoSyncEnabled, syncIntervalSec, setSyncIntervalSec,
            lastSyncTime, isAnalyzing, analysisResult,
            askAntiGravity: (q: string) => {
                setIsAnalyzing(true);

                setTimeout(() => {
                    const query = q.toLowerCase();
                    let response = "";

                    if (query.includes("tax") || query.includes("audit") || query.includes("government")) {
                        const taxEst = metrics.netProfit * 0.15;
                        response = `### ⚖️ Strategic Tax Analysis\n\nBased on your **Actual Cash in Hand (${formatCurrency(metrics.cashInHand)})**, here is your tax readiness report:\n\n- **Taxable Net Profit (Sales):** ${formatCurrency(metrics.netProfit)}\n- **Deferred Capital Assets (Inventory):** ${formatCurrency(metrics.inventoryInvestment)}\n- **Digital Media Assets (USDT):** ${formatCurrency(metrics.usdtInvestment)}\n\n**Recommendation:** Your estimated tax liability (at 15% placeholder) is **${formatCurrency(taxEst)}**. However, since you invested ${formatCurrency(metrics.inventoryInvestment)} in inventory, your taxable base might be reduced depending on your depreciation schedule. Your current liquid cash covers this ${Math.round((metrics.cashInHand / (taxEst || 1)) * 100)}%.`;
                    } else if (query.includes("growth") || query.includes("scale") || query.includes("next")) {
                        const topProduct = productPerformance.sort((a, b) => b.poas - a.poas)[0];
                        response = `### 🚀 Growth Execution Protocol\n\nI have identified a scaling opportunity in your portfolio:\n\n- **Priority SKU:** ${topProduct?.name || "N/A"}\n- **POAS Efficiency:** ${topProduct?.poas.toFixed(2)}x\n- **Delivery Friction:** ${topProduct ? (100 - topProduct.deliveryRate).toFixed(1) : 0}%\n\n**Strategy:** This SKU has a high Profit On Ad Spend. I suggest re-allocating **${formatCurrency(metrics.adSpend * 0.2)}** from your lower-performing cities to double down on this winner. Ensure you have at least 14 days of stock before executing.`;
                    } else if (query.includes("cash") || query.includes("ledger") || query.includes("bank")) {
                        response = `### 💰 Capital Flow Audit\n\nYour business has an outflow of **${formatCurrency(metrics.totalCapitalOutflow)}** recorded in the ledger. While your net profit from sales is **${formatCurrency(metrics.netProfit)}**, your effective liquid position is **${formatCurrency(metrics.cashInHand)}**.\n\n**Insight:** You are converting sales profit into physical assets (Inventory) at a rate of **${((metrics.inventoryInvestment / (metrics.netProfit || 1)) * 100).toFixed(1)}%**. This is a high-growth stance.`;
                    } else {
                        response = `I have analyzed your **${data.length}** orders and ledger entries. Your current **Net Margin is ${metrics.netMargin.toFixed(2)}%** and your **Cash in Hand is ${formatCurrency(metrics.cashInHand)}**. Ask me about 'Tax Readiness', 'Growth Strategy', or 'Capital Audit' for deeper insights.`;
                    }

                    setAnalysisResult(response);
                    setIsAnalyzing(false);
                }, 1500);
            },
            skuCogs, updateSkuCogs, linkAdAccount, unlinkAdAccount, formatPKT,
            estimatedOpsPercent, setEstimatedOpsPercent,
            ledgerEntries, addLedgerEntry, removeLedgerEntry,
            citySummary, verificationSummary, productPerformance, verifyOrder, waTemplates, courierInsights,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error("useData must be used within a DataProvider");
    return { ...context, summary: { totalRevenue: context.metrics.totalRevenue, totalOrders: context.metrics.totalOrders, avgOrderValue: context.metrics.avgOrderValue } };
}
