import { useState } from "react";
import { useData } from "@/context/DataContext";
import { CURRENCY_CONFIG, CurrencyCode, DataSourceType } from "@/context/DataContext";
import {
    Link2, Unlink, RefreshCw, CheckCircle2, AlertCircle,
    Loader2, ExternalLink, ChevronDown, ChevronUp, Zap,
    Timer, Play, Globe, X, Plus, Facebook,
    Music, Ghost, Chrome,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MetaAccountPicker } from "./MetaAccountPicker";
import { GoogleAdsPicker } from "./GoogleAdsPicker";
import { ShopifyPicker } from "./ShopifyPicker";


// ─── Icons ───────────────────────────────────────────────────────────────────

function ShopifyIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M15.337 3.217c-.042-.023-.09-.023-.132-.005a.184.184 0 0 0-.088.084c-.125.217-.28.552-.398.96-1.102-.34-2.377-.562-3.146-.562-.072 0-.136.002-.192.005C10.93 2.802 10.12 2.4 9.404 2.4c-.042 0-.084.002-.126.005C7.77 2.507 6.6 4.11 5.985 6.24c-.84.258-1.434.44-1.506.465-.468.147-.483.162-.546.606C3.873 7.69 2.4 19.2 2.4 19.2l10.35 1.8V3.287c-.474.018-.92.288-.92.288-.456-.342-.96-.342-.96-.342l-.534-.016zM11.76 5.4c0 .036-.684.21-1.428.486C10.824 4.224 11.52 3.48 11.76 3.48V5.4zm-2.16-1.44c.252 0 .84.504.948 2.1-.648.2-1.356.42-2.064.636C9.024 5.016 9.3 3.96 9.6 3.96zm-.72 5.76c.066 1.068 2.862 1.302 3.018 3.81.12 1.974-1.05 3.324-2.742 3.426-2.034.12-3.156-1.074-3.156-1.074l.432-1.83s1.122.846 2.016.792c.588-.036.798-.516.78-.852-.084-1.392-2.364-1.308-2.508-3.606-.12-1.932 1.146-3.894 3.942-4.074.534-.036 1.062.048 1.062.048l-.924 3.462s-.464-.21-1.014-.174c-.81.054-.822.564-.81.69z" />
            <path d="M16.8 3.12c-.006 0-.012.003-.018.003.006-.003.012-.003.018-.003zM16.794 3.126s-.33.096-.87.258c-.096-.312-.216-.672-.384-1.008-.57-1.074-1.398-1.638-2.412-1.644h-.006c-.072 0-.138.006-.21.012.03-.036.06-.066.09-.102C13.656.036 14.388-.174 15 .12c.948.45 1.422 1.836 1.794 3.006z" />
            <path d="M18.6 19.08l4.8-1.08S20.79 4.14 20.772 4.026c-.018-.114-.108-.174-.18-.18-.072-.006-1.476-.024-1.476-.024s-.972-.948-1.332-1.308v16.566z" />
        </svg>
    );
}

function GoogleSheetsIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" />
            <path d="M8 15H16V17H8V15Z" opacity="0.6" />
            <path d="M8 11H16V13H8V11Z" opacity="0.6" />
        </svg>
    );
}

// ─── Currency Selector ───────────────────────────────────────────────────────

function CurrencySelect({ value, onChange, compact = false }: { value: CurrencyCode; onChange: (c: CurrencyCode) => void; compact?: boolean }) {
    const [open, setOpen] = useState(false);
    const currencies = Object.entries(CURRENCY_CONFIG) as [CurrencyCode, typeof CURRENCY_CONFIG[CurrencyCode]][];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white",
                    compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
                )}
            >
                <Globe size={compact ? 10 : 12} className="text-purple-400" />
                <span className="font-medium">{CURRENCY_CONFIG[value].symbol} {value}</span>
                <ChevronDown size={10} className={cn("transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1 left-0 z-50 bg-[#1a1625] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1 max-h-48 overflow-y-auto w-52 backdrop-blur-xl">
                        {currencies.map(([code, cfg]) => (
                            <button
                                key={code}
                                onClick={() => { onChange(code); setOpen(false); }}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors flex items-center justify-between",
                                    value === code ? "text-purple-300 bg-purple-500/10" : "text-white/70"
                                )}
                            >
                                <span>{cfg.symbol} {cfg.name}</span>
                                <span className="text-white/30 text-[10px]">{code}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Integration Card ────────────────────────────────────────────────────────

interface IntegrationCardProps {
    type: DataSourceType;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    borderColor: string;
}

function IntegrationCard({
    type, icon, title, description,
    color, gradientFrom, gradientTo, borderColor,
}: IntegrationCardProps) {
    const {
        dataSources, connectShopify, connectGoogleSheets, connectMetaAds, connectGoogleAds,
        connectTikTokAds, connectSnapchatAds, connectDEX, connectPostEx, disconnectSource,
        isConnecting, syncNow, isSyncing,
        loginWithTikTok, loginWithSnapchat, saveIntegration
    } = useData();
    const [expanded, setExpanded] = useState(false);
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("PKR");
    const [showPicker, setShowPicker] = useState(false);
    const [showGooglePicker, setShowGooglePicker] = useState(false);
    const [showShopifyPicker, setShowShopifyPicker] = useState(false);

    const sources = dataSources.filter(s => s.type === type);
    const hasConnections = sources.length > 0;

    const handleConnect = () => {
        if (!input1.trim()) return;
        const onSuccess = () => {
            setInput1("");
            setInput2("");
            setExpanded(false);
        };

        if (type === "shopify") {
            connectShopify(input1.trim(), input2.trim(), selectedCurrency);
            saveIntegration('shopify', input1.trim(), input1.trim().split('.')[0], input2.trim(), { shopDomain: input1.trim(), currency: selectedCurrency });
            onSuccess();
        } else if (type === "dex") {
            connectDEX(input1.trim());
            onSuccess();
        } else if (type === "postex") {
            connectPostEx(input1.trim());
            onSuccess();
        } else if (type === "google_sheets") {
            connectGoogleSheets(input1.trim(), selectedCurrency);
            onSuccess();
        } else if (type === "meta_ads") {
            connectMetaAds(input1.trim(), input2.trim(), selectedCurrency);
            saveIntegration('meta', input1.trim(), `Meta Account ${input1.trim()}`, input2.trim(), { currency: selectedCurrency });
            onSuccess();
        } else if (type === "google_ads") {
            connectGoogleAds(input1.trim(), input2.trim(), selectedCurrency);
            saveIntegration('google', input1.trim(), `Google Ads ${input1.trim()}`, input2.trim(), { currency: selectedCurrency });
            onSuccess();
        } else if (type === "tiktok_ads") {
            connectTikTokAds(input1.trim(), input2.trim(), selectedCurrency);
            onSuccess();
        } else if (type === "snapchat_ads") {
            connectSnapchatAds(input1.trim(), input2.trim(), selectedCurrency);
            onSuccess();
        }
    };

    return (
        <div className={cn(
            "rounded-2xl border backdrop-blur-sm transition-all duration-500 overflow-hidden group",
            hasConnections
                ? `bg-gradient-to-br ${gradientFrom} ${gradientTo} ${borderColor}`
                : "bg-secondary/20 border-white/5 hover:border-white/10"
        )}>
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                            hasConnections ? `bg-white/20 ${color}` : "bg-white/5 text-muted-foreground"
                        )}>
                            {icon}
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">{title}</h4>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                    </div>

                    {hasConnections ? (
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 size={10} />
                                {sources.length} Linked
                            </span>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                {expanded ? <X size={14} /> : <Plus size={14} />}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-xs font-medium text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                        >
                            <Link2 size={12} />
                            Connect
                            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                    )}
                </div>

                {/* Connected Sources List */}
                {hasConnections && (
                    <div className="space-y-2 mt-4 pt-3 border-t border-white/10">
                        {sources.map(s => (
                            <div key={s.id} className="flex items-center justify-between group/item">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-white/90">{s.name}</span>
                                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                                        <span>{s.recordCount} records</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                        <span>{s.lastSync ? new Date(s.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                        <span>{CURRENCY_CONFIG[s.currency].symbol} {s.currency}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <button
                                        onClick={syncNow}
                                        disabled={isSyncing}
                                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white"
                                        title="Sync Now"
                                    >
                                        <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                                    </button>
                                    <button
                                        onClick={() => disconnectSource(s.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors text-white/30 hover:text-red-400"
                                        title="Disconnect"
                                    >
                                        <Unlink size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Expandable connect form */}
            <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-5 pb-5 space-y-3">
                    <div className="h-px bg-white/5" />
                    {type === "shopify" && (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-muted-foreground font-medium mb-1 block">API Admin Token</label>
                                <input
                                    type="password"
                                    placeholder="shpat_xxxxxxxxxxxxxxxx"
                                    value={input2}
                                    onChange={e => setInput2(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    )}
                    {type === "google_sheets" && (
                        <div>
                            <label className="text-xs text-muted-foreground font-medium mb-1 block">Spreadsheet URL</label>
                            <input
                                type="text"
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                value={input1}
                                onChange={e => setInput1(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                            <p className="text-xs text-muted-foreground/60 mt-1.5 flex items-center gap-1">
                                <ExternalLink size={10} />
                                Sheet must be publicly accessible or shared
                            </p>
                        </div>
                    )}
                    {(type === "dex" || type === "postex") && (
                        <div>
                            <label className="text-xs text-muted-foreground font-medium mb-1 block">API Key</label>
                            <input
                                type="password"
                                placeholder="Enter API Key"
                                value={input1}
                                onChange={e => setInput1(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                            <p className="text-[10px] text-muted-foreground/60 mt-1">Found in your {type === "dex" ? "DEX" : "PostEx"} Portal</p>
                        </div>
                    )}
                    {(type === "meta_ads" || type === "google_ads" || type === "tiktok_ads" || type === "snapchat_ads") && (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-muted-foreground font-medium mb-1 block">
                                    {type === "google_ads" ? "Customer ID" : "Ad Account ID"}
                                </label>
                                <input
                                    type="text"
                                    placeholder={type === "google_ads" ? "xxx-xxx-xxxx" : "act_xxxxxxxxxxxxxxxxx"}
                                    value={input1}
                                    onChange={e => setInput1(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground font-medium mb-1 block">API Access Token</label>
                                <input
                                    type="password"
                                    placeholder="Enter Access Token"
                                    value={input2}
                                    onChange={e => setInput2(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                                <p className="text-[10px] text-muted-foreground/60 mt-1">Use 'demo' for mock data</p>
                            </div>
                        </div>
                    )}

                    {/* Direct Login for Shopify */}
                    {type === "shopify" && (
                        <div className="pb-4 border-b border-white/5 mb-4">
                            <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 block">Direct Integration</label>
                            <button
                                onClick={() => setShowShopifyPicker(true)}
                                className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <ShopifyIcon />
                                Connect Shopify Store
                            </button>
                            <p className="text-[10px] text-center text-muted-foreground mt-3 italic">
                                Use your store .myshopify.com domain and Admin API token.
                            </p>
                        </div>
                    )}

                    {/* Direct Login for Meta */}
                    {type === "meta_ads" && (
                        <div className="pb-4 border-b border-white/5 mb-4">
                            <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 block">Direct Auth</label>
                            <button
                                onClick={() => setShowPicker(true)}
                                className="w-full py-3 rounded-xl text-xs font-bold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 mb-1"
                            >
                                <Facebook size={14} fill="currentColor" />
                                Login with Facebook Account
                            </button>
                            <div className="flex items-center gap-2 mt-4 mb-1">
                                <div className="h-px flex-1 bg-white/5" />
                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">or manual link</span>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                        </div>
                    )}

                    {/* Direct Login for Google, TikTok, Snap */}
                    {(["google_ads", "tiktok_ads", "snapchat_ads"].includes(type)) && (
                        <div className="pb-4 border-b border-white/5 mb-4">
                            <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 block">Direct Auth</label>
                            <button
                                onClick={() => {
                                    if (type === "google_ads") setShowGooglePicker(true);
                                    if (type === "tiktok_ads") loginWithTikTok();
                                    if (type === "snapchat_ads") loginWithSnapchat();
                                }}
                                className={cn(
                                    "w-full py-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all active:scale-95",
                                    type === "google_ads" ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20" :
                                        type === "tiktok_ads" ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/20" :
                                            "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 border-yellow-500/20"
                                )}
                            >
                                {type === "google_ads" && <Chrome size={14} />}
                                {type === "tiktok_ads" && <Music size={14} />}
                                {type === "snapchat_ads" && <Ghost size={14} />}
                                <span>Sign in with {title.split(' ')[0]}</span>
                            </button>
                            <div className="flex items-center gap-2 mt-4 mb-1">
                                <div className="h-px flex-1 bg-white/5" />
                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">or manual link</span>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>
                        </div>
                    )}

                    {/* Currency selector in form */}
                    <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Account Currency</label>
                        <CurrencySelect value={selectedCurrency} onChange={setSelectedCurrency} />
                    </div>

                    <button
                        onClick={handleConnect}
                        disabled={isConnecting || !input1.trim()}
                        className={cn(
                            "w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300",
                            input1.trim()
                                ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/20"
                                : "bg-white/5 text-white/30 cursor-not-allowed"
                        )}
                    >
                        {isConnecting ? (
                            <><Loader2 size={14} className="animate-spin" /> Connecting...</>
                        ) : (
                            <><Zap size={14} /> {hasConnections ? "Add Another" : "Connect"} {title}</>
                        )}
                    </button>
                </div>
            </div>

            {showPicker && <MetaAccountPicker onClose={() => setShowPicker(false)} />}
            {showGooglePicker && <GoogleAdsPicker onClose={() => setShowGooglePicker(false)} />}
            {showShopifyPicker && <ShopifyPicker onClose={() => setShowShopifyPicker(false)} />}
        </div>
    );
}

// ─── Source Linking ──────────────────────────────────────────────────────────

function SourceLinking() {
    const { dataSources, currentViewId, linkAdAccount, unlinkAdAccount } = useData();
    const currentSource = dataSources.find(s => s.id === currentViewId);

    // Only show for stores/csv/sheets that are the current view
    const isShopView = currentViewId !== "collective" && currentSource && ["shopify", "csv", "google_sheets"].includes(currentSource.type);

    if (!isShopView || !currentSource) return null;

    const connectedAdSources = dataSources.filter(s => ["meta_ads", "google_ads", "tiktok_ads", "snapchat_ads"].includes(s.type));
    const linkedIds = currentSource.linkedSourceIds || [];
    const unlinkedAdSources = connectedAdSources.filter(s => !linkedIds.includes(s.id));

    return (
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
                <Link2 size={16} className="text-purple-400" />
                <span className="text-xs font-semibold text-white">Linked Ad Accounts</span>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed">
                Ad spend from linked automated accounts will be attributed to <span className="text-purple-300 font-medium">{currentSource.name}</span>.
            </p>

            <div className="space-y-2">
                {linkedIds.length > 0 ? (
                    linkedIds.map(id => {
                        const adSource = dataSources.find(s => s.id === id);
                        if (!adSource) return null;
                        return (
                            <div key={id} className="flex items-center justify-between bg-white/5 px-2.5 py-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    <span className="text-xs text-white/90">{adSource.name}</span>
                                </div>
                                <button
                                    onClick={() => unlinkAdAccount(currentViewId, id)}
                                    className="text-white/30 hover:text-red-400 transition-colors"
                                >
                                    <Unlink size={12} />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-[10px] text-white/20 italic py-2 text-center border border-dashed border-white/10 rounded-lg">
                        No ad accounts linked
                    </div>
                )}
            </div>

            {unlinkedAdSources.length > 0 && (
                <div className="pt-2">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1.5">Available to Link</p>
                    <div className="grid grid-cols-1 gap-1.5">
                        {unlinkedAdSources.map(s => (
                            <button
                                key={s.id}
                                onClick={() => linkAdAccount(currentViewId, s.id)}
                                className="flex items-center justify-between bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg text-xs text-white/60 hover:text-white transition-all border border-white/5"
                            >
                                <span>{s.name}</span>
                                <Link2 size={10} className="text-purple-400" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Auto-Sync Control ──────────────────────────────────────────────────────

function AutoSyncControl() {
    const {
        autoSyncEnabled, setAutoSyncEnabled,
        syncIntervalSec, setSyncIntervalSec,
        lastSyncTime, syncNow, isSyncing, activeSource,
    } = useData();

    if (!activeSource || activeSource === "csv") return null;

    return (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl backdrop-blur-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Timer size={14} className="text-purple-400" />
                    <span className="text-xs font-semibold text-white">Auto-Sync</span>
                </div>
                <button
                    onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                    className={cn(
                        "relative w-10 h-5 rounded-full transition-all duration-300",
                        autoSyncEnabled
                            ? "bg-gradient-to-r from-purple-600 to-purple-500"
                            : "bg-white/10"
                    )}
                >
                    <div className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300",
                        autoSyncEnabled ? "left-[22px]" : "left-0.5"
                    )} />
                </button>
            </div>

            {autoSyncEnabled && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] text-muted-foreground font-medium">Interval:</label>
                        <select
                            value={syncIntervalSec}
                            onChange={e => setSyncIntervalSec(Number(e.target.value))}
                            className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[10px] text-white focus:outline-none focus:border-purple-500/50"
                        >
                            <option value={15}>15 sec</option>
                            <option value={30}>30 sec</option>
                            <option value={60}>1 min</option>
                            <option value={300}>5 min</option>
                            <option value={600}>10 min</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>
                            Last: {lastSyncTime ? lastSyncTime.toLocaleTimeString() : "Never"}
                        </span>
                    </div>
                </div>
            )}

            <button
                onClick={syncNow}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-medium bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/5"
            >
                {isSyncing ? (
                    <><RefreshCw size={10} className="animate-spin" /> Syncing...</>
                ) : (
                    <><Play size={10} /> Sync Now</>
                )}
            </button>
        </div>
    );
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

export function IntegrationsPanel() {
    const { dataSources, currency, setCurrency } = useData();
    const connectedCount = dataSources.filter(s => s.status === "connected").length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Link2 size={18} className="text-purple-400" />
                        Data Integrations
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Connect sources for real-time metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CurrencySelect value={currency} onChange={setCurrency} compact />
                    {connectedCount > 0 && (
                        <span className="text-xs font-medium text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                            {connectedCount} live
                        </span>
                    )}
                </div>
            </div>

            <IntegrationCard
                type="shopify"
                icon={<ShopifyIcon />}
                title="Shopify"
                description="Sync orders, products & metrics"
                color="text-green-400"
                gradientFrom="from-green-500/10"
                gradientTo="to-green-900/10"
                borderColor="border-green-500/20"
            />

            <IntegrationCard
                type="dex"
                icon={<div className="font-bold text-lg text-orange-400">D</div>}
                title="DEX Logistics"
                description="Real-time delivery & RTO tracking"
                color="text-orange-400"
                gradientFrom="from-orange-600/10"
                gradientTo="to-orange-900/10"
                borderColor="border-orange-500/20"
            />

            <IntegrationCard
                type="postex"
                icon={<div className="font-bold text-lg text-cyan-400">P</div>}
                title="PostEx Courier"
                description="Automated COD status synchronization"
                color="text-cyan-400"
                gradientFrom="from-cyan-600/10"
                gradientTo="to-cyan-900/10"
                borderColor="border-cyan-500/20"
            />

            <IntegrationCard
                type="google_sheets"
                icon={<GoogleSheetsIcon />}
                title="Google Sheets"
                description="Import data from spreadsheets"
                color="text-blue-400"
                gradientFrom="from-blue-500/10"
                gradientTo="to-blue-900/10"
                borderColor="border-blue-500/20"
            />

            <IntegrationCard
                type="meta_ads"
                icon={<div className="font-bold text-lg">f</div>}
                title="Meta Ads"
                description="Connect Facebook & Instagram spend"
                color="text-blue-400"
                gradientFrom="from-blue-600/10"
                gradientTo="to-blue-900/10"
                borderColor="border-blue-400/20"
            />

            <IntegrationCard
                type="google_ads"
                icon={<div className="font-bold text-lg">G</div>}
                title="Google Ads"
                description="Sync Search & Display performance"
                color="text-red-400"
                gradientFrom="from-red-600/10"
                gradientTo="to-red-900/10"
                borderColor="border-red-400/20"
            />

            <IntegrationCard
                type="tiktok_ads"
                icon={<div className="font-bold">TT</div>}
                title="TikTok Ads"
                description="Viral campaign metrics"
                color="text-pink-400"
                gradientFrom="from-pink-600/10"
                gradientTo="to-pink-900/10"
                borderColor="border-pink-400/20"
            />

            <IntegrationCard
                type="snapchat_ads"
                icon={<div className="font-bold text-yellow-300">S</div>}
                title="Snapchat Ads"
                description="Lens & AR performance"
                color="text-yellow-400"
                gradientFrom="from-yellow-600/10"
                gradientTo="to-yellow-900/10"
                borderColor="border-yellow-400/20"
            />

            {/* Source Linking - Store specific */}
            <SourceLinking />

            {/* Auto-Sync Controls */}
            <AutoSyncControl />

            {connectedCount === 0 && (
                <div className="text-center py-3">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50">
                        <AlertCircle size={12} />
                        <span>Or upload a CSV file from the upload area</span>
                    </div>
                </div>
            )}
        </div>
    );
}
