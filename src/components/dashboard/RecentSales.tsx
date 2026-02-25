import { MoreHorizontal, Users, CheckCircle2, Phone, MessageSquare, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { useState } from "react";
import { WhatsAppVerificationDialog } from "./WhatsAppVerificationDialog";

const demoSales = [
    { id: 1, order_id: "OR-1001", name: "Ahmed Sheikh", platform: "Shopify", date: "Today", status: "Delivered", amount: 4500, city: "Karachi", phone: "03211234567", verified: true },
    { id: 2, order_id: "OR-1002", name: "Sara Malik", platform: "Shopify", date: "Today", status: "Pending", amount: 1800, city: "Lahore", phone: "03009876543", verified: false },
    { id: 3, order_id: "OR-1003", name: "Irfan Khan", platform: "Shopify", date: "Yesterday", status: "Delivered", amount: 6200, city: "Islamabad", phone: "03125554443", verified: true },
    { id: 4, order_id: "OR-1004", name: "Zeba Ali", platform: "Shopify", date: "Yesterday", status: "Returned", amount: 2400, city: "Faisalabad", phone: "0345", verified: false },
];

export function RecentSales() {
    const { data, columns, formatCurrency, courierInsights } = useData();
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const hasData = data.length > 0;
    const { winners } = courierInsights;

    const isValidPKPhone = (phone: string) => {
        const clean = phone.replace(/\D/g, "");
        if (clean.length < 10) return false;
        if (clean.startsWith("92")) return clean.length === 12;
        if (clean.startsWith("0")) return clean.length === 11;
        if (clean.length === 10) return true;
        return false;
    };

    // Try to get actual recent sales from data
    const salesData = hasData ? data.slice(0, 6).map((row, i) => {
        const nameCol = columns.find(c => ["name", "customer", "user"].includes(c.toLowerCase()));
        const statusCol = columns.find(c => ["status", "fulfillment", "state"].includes(c.toLowerCase()));
        const revenueCol = columns.find(c => ["revenue", "amount", "total", "price"].includes(c.toLowerCase()));
        const cityCol = columns.find(c => ["city", "location"].includes(c.toLowerCase()));
        const phoneCol = columns.find(c => ["phone", "mobile", "contact"].includes(c.toLowerCase()));

        const id = row.order_id || row.order_number || row.id;
        const today = new Date().toISOString().split("T")[0];
        const dateVal = row.date || row.created_at || "Recent";
        const phone = String(row[phoneCol || ""] || "");
        const status = statusCol ? String(row[statusCol]) : "Pending";
        const isVerified = (row.verification_status === "Confirmed") || (row.tags || "").toLowerCase().includes("confirmed");

        return {
            id: id,
            order_id: id,
            name: nameCol ? String(row[nameCol]) : "Customer " + (i + 1),
            platform: row.source || (row._is_live ? "Live Web" : "System"),
            date: dateVal === today ? "Today" : dateVal,
            status: status,
            amount: revenueCol ? Number(row[revenueCol]) : 0,
            city: row[cityCol || ""] || "Unknown",
            phone: phone,
            isPhoneValid: isValidPKPhone(phone),
            isVerified: isVerified,
            isLive: !!row._is_live,
            _raw: row
        };
    }) : demoSales.map(s => ({ ...s, isPhoneValid: isValidPKPhone(s.phone), isVerified: s.verified }));

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Users size={18} className="text-purple-400" />
                    <h3 className="font-semibold text-lg uppercase tracking-tighter">Order Flow</h3>
                </div>
                {!hasData && (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        DEMO MODE
                    </span>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                    <thead className="text-muted-foreground font-medium text-[10px] uppercase tracking-wider">
                        <tr>
                            <th className="pb-2">Order / Location</th>
                            <th className="pb-2">Contact Info</th>
                            <th className="pb-2">Verification</th>
                            <th className="pb-2">Status</th> {/* Added new header */}
                            <th className="pb-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((sale: any) => (
                            <tr key={sale.id} className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300">
                                <td className="py-3 px-4 rounded-l-xl border-l border-t border-b border-white/5">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-white text-xs">{sale.name}</span>
                                            {sale.isLive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-muted-foreground uppercase">{sale.city} • {sale.platform}</span>
                                            {sale.status?.toLowerCase().includes("pending") && winners[sale.city] && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                                    <Navigation size={8} className="text-emerald-400" />
                                                    <span className="text-[8px] text-emerald-400 font-black uppercase tracking-tighter">Rec: {winners[sale.city]}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 border-t border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-6 h-6 rounded flex items-center justify-center transition-all group-hover:scale-110",
                                            sale.isPhoneValid ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                        )}>
                                            <Phone size={12} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-mono text-white/70">{sale.phone || "No Number"}</span>
                                            {!sale.isPhoneValid && sale.phone && (
                                                <span className="text-[8px] text-rose-400 font-bold uppercase">Invalid Format</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 border-t border-b border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        {sale.isVerified ? (
                                            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-full">
                                                <CheckCircle2 size={10} />
                                                <span>CONFIRMED</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedOrder(sale)}
                                                className="flex items-center gap-2 text-[10px] text-amber-400 font-black bg-amber-500/5 border border-amber-500/20 px-2.5 py-1 rounded-full hover:bg-amber-500/10 hover:border-amber-500/40 transition-all active:scale-95"
                                            >
                                                <MessageSquare size={10} />
                                                <span>WHATSAPP NEEDED</span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4 rounded-r-xl border-r border-t border-b border-white/5 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-white text-xs">{formatCurrency(sale.amount)}</span>
                                            <span className={cn(
                                                "text-[9px] font-bold uppercase tracking-widest",
                                                sale.status?.toLowerCase().includes("delivered") ? "text-emerald-400" :
                                                    sale.status?.toLowerCase().includes("return") ? "text-rose-400" : "text-amber-400"
                                            )}>
                                                {sale.status}
                                            </span>
                                        </div>
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <WhatsAppVerificationDialog
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

