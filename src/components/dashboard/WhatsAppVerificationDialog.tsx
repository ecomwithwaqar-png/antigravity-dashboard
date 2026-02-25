import { useState } from "react";
import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import {
    MessageSquare,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Languages,
    User,
    ClipboardCheck
} from "lucide-react";

interface WhatsAppVerificationDialogProps {
    order: any;
    onClose: () => void;
}

export function WhatsAppVerificationDialog({ order, onClose }: WhatsAppVerificationDialogProps) {
    const { waTemplates, verifyOrder, formatCurrency } = useData();
    const [selectedLang, setSelectedLang] = useState<"urdu" | "english">("urdu");

    const customerName = order.customer || "Customer";
    const orderId = order.order_id || order.id || "N/A";
    const amount = order.revenue || order.total || order.amount || 0;
    const phone = order.phone || "";

    const template = waTemplates[selectedLang];
    const message = template
        .replace("{customer}", customerName)
        .replace("{order_id}", orderId)
        .replace("{amount}", String(amount))
        .replace("{store}", "Our Store");

    const handleSend = () => {
        const cleanPhone = phone.replace(/[^0-9]/g, "");
        const finalPhone = cleanPhone.startsWith("0") ? "92" + cleanPhone.slice(1) : cleanPhone.startsWith("92") ? cleanPhone : "92" + cleanPhone;

        const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
        // We don't verify automatically on send, we wait for user to confirm if it was actually verified
    };

    const handleVerify = (status: "Confirmed" | "Canceled") => {
        verifyOrder(orderId, status);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1625] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-tight">WhatsApp Confirmation</h3>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Order Verification Bridge</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                        <XCircle size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Info Mini Card */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <User size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white uppercase">{customerName}</span>
                                <span className="text-[10px] text-muted-foreground">{phone || "No Phone Detected"}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-emerald-400">{formatCurrency(amount)}</p>
                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Total Bill</p>
                        </div>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 gap-1">
                        <button
                            onClick={() => setSelectedLang("urdu")}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                selectedLang === "urdu" ? "bg-purple-600 text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Languages size={14} />
                            Urdu Template
                        </button>
                        <button
                            onClick={() => setSelectedLang("english")}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                selectedLang === "english" ? "bg-purple-600 text-white shadow-lg" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Languages size={14} />
                            English
                        </button>
                    </div>

                    {/* Message Preview */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest ml-1">Message Preview</label>
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl relative group">
                            <p className="text-xs text-emerald-100/90 leading-relaxed italic">
                                "{message}"
                            </p>
                        </div>
                    </div>

                    {/* Primary Action */}
                    <button
                        onClick={handleSend}
                        disabled={!phone}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20"
                    >
                        <ExternalLink size={18} />
                        Launch WhatsApp Web
                    </button>

                    {/* Audit Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => handleVerify("Canceled")}
                            className="py-3 border border-rose-500/20 bg-rose-500/5 rounded-xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            <XCircle size={14} />
                            Mark Rejected
                        </button>
                        <button
                            onClick={() => handleVerify("Confirmed")}
                            className="py-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={14} />
                            Mark Confirmed
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-white/[0.04] border-t border-white/5 flex items-center justify-center gap-2 text-[8px] text-muted-foreground uppercase font-black tracking-[0.3em]">
                    <ClipboardCheck size={10} className="text-purple-400" />
                    <span>Treasury Audit Protocol v1.0</span>
                </div>
            </div>
        </div>
    );
}
