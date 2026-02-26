import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useData } from "@/context/DataContext";
import {
    Chrome, Target,
    ArrowRight, Loader2, X, AlertCircle, ShieldCheck
} from "lucide-react";

interface GoogleAdsPickerProps {
    onClose: () => void;
}

export function GoogleAdsPicker({ onClose }: GoogleAdsPickerProps) {
    const {
        googleAuth, googleAdAccounts,
        fetchGoogleAdsAccounts,
        connectGoogleAds, logoutGoogle, currency,
        googleConfig, saveIntegration, connectWithNango
    } = useData();

    const [loading, setLoading] = useState(false);
    const hasConfig = googleConfig.clientId && googleConfig.developerToken;

    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        if (googleAuth) {
            if (googleAdAccounts.length > 0) {
                // One-click Auto Connection: If only one account discovered, link it immediately
                if (googleAdAccounts.length === 1 && !connecting) {
                    handleSelectAccount(googleAdAccounts[0].id);
                    return;
                }
            } else {
                setLoading(true);
                fetchGoogleAdsAccounts().finally(() => setLoading(false));
            }
        }
    }, [googleAuth, googleAdAccounts.length]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await connectWithNango('google-ads', {}, currency);
            toast.success("Neuro-Link confirmed with Google. Discovering accounts...");
            fetchGoogleAdsAccounts();
        } catch (e: any) {
            console.error(e);
            if (!e.message?.includes("User closed")) {
                toast.error("Google Login failed. Connection aborted.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAccount = (id: string) => {
        const account = googleAdAccounts.find(a => a.id === id);
        setConnecting(true);
        connectGoogleAds(id, googleAuth?.accessToken || "", currency);

        // Save to Supabase for persistence
        saveIntegration(
            'google',
            id,
            account?.name || `Google Ads ${id}`,
            googleAuth?.accessToken || "",
            { currency }
        );

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60">
            <div className="w-full max-w-lg bg-[#0f0a1a] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="relative p-6 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-orange-600/10">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Chrome className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Google Ads Direct</h3>
                            <p className="text-sm text-muted-foreground">Native Account Discovery</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[300px] flex flex-col justify-center">
                    {!googleAuth ? (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-600/5">
                                <ShieldCheck size={40} className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-semibold text-white">One-Click Google Login</h4>
                                <p className="text-sm text-muted-foreground px-12">
                                    Authenticate directly with your Google account to see all managed Ads IDs.
                                </p>
                            </div>
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-white shadow-xl shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Chrome size={18} /> Login with Google</>}
                            </button>

                            {!hasConfig && (
                                <p className="text-[10px] text-muted-foreground mt-4 px-10 leading-relaxed italic">
                                    Note: You can pre-configure your API keys in <code className="text-red-400">shopify-bridge.cjs</code> for a zero-prompt experience.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Account</span>
                                <button onClick={logoutGoogle} className="text-[10px] text-red-400 hover:underline">Sign Out</button>
                            </div>

                            {loading ? (
                                <div className="py-12 flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-red-500" size={32} />
                                    <span className="text-sm text-muted-foreground">Fetching Data...</span>
                                </div>
                            ) : googleAdAccounts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {googleAdAccounts.map(acc => (
                                        <button
                                            key={acc.id}
                                            onClick={() => handleSelectAccount(acc.id)}
                                            className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/30 rounded-2xl transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20">
                                                    <Target size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">{acc.name}</div>
                                                    <div className="text-[10px] text-muted-foreground">CID: {acc.id}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-medium text-red-400">Connect</span>
                                                <ArrowRight size={14} className="text-red-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center space-y-4">
                                    <div className="space-y-2">
                                        <AlertCircle className="mx-auto text-red-500/50" size={32} />
                                        <p className="text-sm text-muted-foreground px-6">Automatic account discovery returned no results.</p>
                                        <p className="text-[10px] text-muted-foreground px-10">This can happen if your account has no CID associated or if the API connection is restricted.</p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 space-y-3 text-left">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Manual Connect</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="10-digit ID (e.g. 123-456-7890)"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = e.currentTarget.value.trim();
                                                        if (val.replace(/-/g, '').length === 10 || val === 'demo') {
                                                            handleSelectAccount(val);
                                                        } else {
                                                            toast.error("Invalid Customer ID. Use 10 digits.");
                                                        }
                                                    }
                                                }}
                                                id="manual-cid-input"
                                            />
                                            <button
                                                onClick={() => {
                                                    const input = document.getElementById('manual-cid-input') as HTMLInputElement;
                                                    const val = input.value.trim();
                                                    if (val.replace(/-/g, '').length === 10 || val === 'demo') {
                                                        handleSelectAccount(val);
                                                    } else {
                                                        toast.error("Invalid Customer ID. Use 10 digits.");
                                                    }
                                                }}
                                                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-semibold transition-all"
                                            >
                                                Link
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white/5 border-t border-white/5">
                    <p className="text-[10px] text-center text-muted-foreground">
                        Secure SSL-Proxied Connection. No sensitive tokens are logged.
                    </p>
                </div>
            </div>
        </div>
    );
}
