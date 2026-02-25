import { useRef, useState } from "react";
import { Upload, FileText, X, Database } from "lucide-react";
import { useData } from "@/context/DataContext";
import { cn } from "@/lib/utils";

export function DataUpload() {
    const { uploadData, data, clearData, columns } = useData();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "text/csv") {
            uploadData(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadData(file);
        }
    };

    if (data.length > 0) {
        return (
            <div className="bg-secondary/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Data Connected</h3>
                            <p className="text-xs text-muted-foreground">{data.length} records loaded</p>
                        </div>
                    </div>
                    <button
                        onClick={clearData}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-red-400"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Detected Columns</div>
                    <div className="flex flex-wrap gap-2">
                        {columns.slice(0, 5).map(col => (
                            <span key={col} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-xs text-purple-200">
                                {col}
                            </span>
                        ))}
                        {columns.length > 5 && (
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-xs text-muted-foreground">
                                +{columns.length - 5} more
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "bg-secondary/20 p-8 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-secondary/30",
                isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-purple-500/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileSelect}
            />

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="text-purple-400" size={32} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Upload Data Source</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
                Drag & drop your CSV file here to feed real data into the dashboard
            </p>

            <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                <FileText size={12} />
                <span>Supports .CSV format</span>
            </div>
        </div>
    );
}
