import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import {
    Facebook, Building2, Target,
    ArrowRight, Loader2, X, ChevronRight, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetaAccountPickerProps {
    onClose: () => void;
}

export function MetaAccountPicker({ onClose }: MetaAccountPickerProps) {
    const {
        fbAuth, metaBusinesses, metaAdAccounts,
        loginWithFacebook, fetchMetaBusinesses, fetchMetaAdAccounts,
        connectMetaAds, logoutFacebook, currency
    } = useData();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"login" | "business" | "account">("login");

    useEffect(() => {
        if (fbAuth) {
            setStep("business");
            fetchMetaBusinesses();
        } else {
            setStep("login");
        }
    }, [fbAuth, fetchMetaBusinesses]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await loginWithFacebook();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBusiness = (id: string) => {
        setLoading(true);
        fetchMetaAdAccounts(id).then(() => {
            setStep("account");
            setLoading(false);
        });
    };

    const handleSelectAccount = (accId: string) => {
        const account = metaAdAccounts.find(a => a.id === accId);
        // Strip 'act_' prefix if present, connectMetaAds expects the raw ID or specific format
        const cleanId = accId.replace('act_', '');

        // Use detected currency or fallback to dashboard currency
        const detectedCurrency = (account?.currency as any) || currency;

        connectMetaAds(cleanId, fbAuth?.accessToken || "", detectedCurrency);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60">
            <div className="w-full max-w-lg bg-[#0f0a1a] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="relative p-6 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Facebook className="text-white fill-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Meta Ads Connection</h3>
                            <p className="text-sm text-muted-foreground">Select your advertising account</p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-6">
                        <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === "login" ? "bg-blue-500" : "bg-blue-500/20")}></div>
                        <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === "business" ? "bg-blue-500" : "bg-blue-500/20")}></div>
                        <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === "account" ? "bg-blue-500" : "bg-blue-500/20")}></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[300px] flex flex-col justify-center">
                    {step === "login" && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-600/5">
                                <Facebook size={40} className="text-blue-500 fill-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-semibold text-white">Continue with Facebook</h4>
                                <p className="text-sm text-muted-foreground px-12">
                                    Authenticate directly with Meta to see all your Business Managers and Ad Accounts.
                                </p>
                            </div>
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Facebook fill="white" size={18} /> Login with Facebook</>}
                            </button>
                        </div>
                    )}

                    {step === "business" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Business Manager</span>
                                <button onClick={logoutFacebook} className="text-[10px] text-red-400 hover:underline">Switch User</button>
                            </div>

                            {loading ? (
                                <div className="py-12 flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                    <span className="text-sm text-muted-foreground">Fetching Businesses...</span>
                                </div>
                            ) : metaBusinesses.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {metaBusinesses.map(bm => (
                                        <button
                                            key={bm.id}
                                            onClick={() => handleSelectBusiness(bm.id)}
                                            className={cn(
                                                "group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all text-left",
                                                bm.id === 'me' && "border-blue-500/20 bg-blue-500/5"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                    bm.id === 'me' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20"
                                                )}>
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-white">{bm.name}</span>
                                                        {bm.id === 'me' && (
                                                            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded tracking-widest">USER</span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {bm.id === 'me' ? "Accounts not in a Business Manager" : `ID: ${bm.id}`}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-white/20 group-hover:text-blue-500 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center space-y-3">
                                    <Globe className="mx-auto text-white/10" size={48} />
                                    <p className="text-sm text-muted-foreground">No Business Managers found for this account.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {step === "account" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <button onClick={() => setStep("business")} className="text-xs text-blue-400 hover:underline">← Businesses</button>
                                <span className="text-xs text-muted-foreground">/ Select Ad Account</span>
                            </div>

                            {loading ? (
                                <div className="py-12 flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                    <span className="text-sm text-muted-foreground">Fetching Ad Accounts...</span>
                                </div>
                            ) : metaAdAccounts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {metaAdAccounts.map(acc => (
                                        <button
                                            key={acc.id}
                                            onClick={() => handleSelectAccount(acc.id)}
                                            className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-2xl transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20">
                                                    <Target size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">{acc.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-[10px] text-muted-foreground">ID: {acc.id}</div>
                                                        <div className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1 rounded">{acc.currency}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-medium text-emerald-400">Connect</span>
                                                <ArrowRight size={14} className="text-emerald-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-muted-foreground">No Ad Accounts found under this Business.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white/5 border-t border-white/5">
                    <p className="text-[10px] text-center text-muted-foreground">
                        Secure connection via Meta Graph API v18.0. Your data is encrypted and handled according to privacy standards.
                    </p>
                </div>
            </div>
        </div>
    );
}
