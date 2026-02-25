import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import {
    Store, Zap, Loader2, X, ShieldCheck, ExternalLink, Key, Globe
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ShopifyPickerProps {
    onClose: () => void;
}

export function ShopifyPicker({ onClose }: ShopifyPickerProps) {
    const { connectShopify, currency } = useData();
    const [domain, setDomain] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);


    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'SHOPIFY_AUTH_SUCCESS') {
                const { token, shop } = event.data;
                const finalDomain = shop.includes(".") ? shop : `${shop}.myshopify.com`;

                setDomain(shop);
                setToken(token);
                setStep(2);

                // One-Click Auto Connect: Initiate sync immediately after handshake
                toast.success("Security handshake complete! Establishing Neural Sync...");
                setLoading(true);

                (async () => {
                    try {
                        await connectShopify(finalDomain, token, currency);
                        onClose();
                    } catch (err: any) {
                        console.error("Auto-sync failed:", err);
                        setLoading(false);
                        toast.error(err.message || "Sync failed");
                    }
                })();
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [connectShopify, currency, onClose]);

    const handleOneClick = () => {
        if (!domain) {
            toast.error("Enter your store domain first");
            return;
        }
        const shop = domain.includes(".myshopify.com") ? domain : `${domain}.myshopify.com`;
        const bridgeUrl = `http://localhost:3001/shopify/auth?shop=${shop}`;
        window.open(bridgeUrl, 'ShopifyAuth', 'width=600,height=800');
    };

    const handleConnect = async () => {
        const finalDomain = domain.includes(".") ? domain : `${domain}.myshopify.com`;

        if (token !== "demo" && !token.startsWith("shpat_") && !token.startsWith("shpk_")) {
            toast.error("Invalid token format");
            return;
        }

        setLoading(true);
        try {
            await connectShopify(finalDomain.trim(), token.trim(), currency);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60">
            <div className="w-full max-w-lg bg-[#0f0a1a] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="relative p-6 border-b border-white/5 bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Store className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Shopify Neural Connect</h3>
                            <p className="text-sm text-muted-foreground">Automated Asset Synchronization</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="flex gap-2 mb-4">
                        {[1, 2].map(i => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/5'}`}
                            />
                        ))}
                    </div>

                    {step === 1 ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Store Address</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <input
                                            type="text"
                                            placeholder="store-name.myshopify.com"
                                            value={domain}
                                            onChange={e => setDomain(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={handleOneClick}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-white shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <Zap size={18} className="fill-current" />
                                        One-Click App Install
                                    </button>

                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-muted-foreground transition-all border border-white/5"
                                    >
                                        Manual Token Entry
                                    </button>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex gap-3">
                                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    Neural Connect uses Shopify's secure OAuth flow. Your credentials never leave our SSL-proxied bridge.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 flex justify-between">
                                    <span>Sync Token</span>
                                    {domain && (
                                        <button
                                            onClick={() => window.open(`https://${domain}/admin/settings/apps/development`, '_blank')}
                                            className="text-[10px] lowercase font-normal opacity-50 flex items-center gap-1 hover:opacity-100 transition-opacity"
                                        >
                                            Get token <ExternalLink size={10} />
                                        </button>
                                    )}
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                    <input
                                        type="password"
                                        placeholder="shpat_xxxxxxxxxxxxxxxx"
                                        value={token}
                                        onChange={e => setToken(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-white transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConnect}
                                    disabled={loading || !token}
                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-white shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} /> Establish Sync</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white/5 border-t border-white/5">
                    <p className="text-[10px] text-center text-muted-foreground">
                        Account Multi-Link Enabled. You can add unlimited stores.
                    </p>
                </div>
            </div>
        </div>
    );
}
