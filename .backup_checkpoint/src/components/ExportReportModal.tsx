import React, { useState, useMemo } from "react";
import { SavedIsopsephyItem } from "../types";
import {
  FileText,
  Printer,
  Copy,
  Download,
  Check,
  X,
  FileCode,
  Layers,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedIsopsephyItem[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  savedItems,
}) => {
  const [reportTitle, setReportTitle] = useState<string>(
    "Αναλυτική Έκθεση Ισοψηφικής & Λεξαριθμικής Έρευνας"
  );
  const [researcherName, setResearcherName] = useState<string>("Ιωάννης Βελούδος");
  const [copied, setCopied] = useState<boolean>(false);

  // Aggregated Report Metrics
  const stats = useMemo(() => {
    const totalCount = savedItems.length;
    const uniqueValues = new Set(savedItems.map((i) => i.value)).size;
    const sumAll = savedItems.reduce((acc, i) => acc + i.value, 0);

    const rootCounts: Record<number, number> = {};
    savedItems.forEach((i) => {
      rootCounts[i.root] = (rootCounts[i.root] || 0) + 1;
    });

    return {
      totalCount,
      uniqueValues,
      sumAll,
      rootCounts,
    };
  }, [savedItems]);

  // Markdown format generator
  const markdownContent = useMemo(() => {
    const dateStr = new Date().toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let md = `# ${reportTitle}\n\n`;
    md += `**Ερευνητής:** ${researcherName}  \n`;
    md += `**Ημερομηνία Έκδοσης:** ${dateStr}  \n`;
    md += `**Σύνολο Αρχειοθετημένων Στοιχείων:** ${stats.totalCount}  \n`;
    md += `**Μοναδικές Αριθμητικές Τιμές:** ${stats.uniqueValues}  \n\n`;
    md += `---\n\n`;

    md += `## 1. Σύνοψη Πυθαγόρειων Πυθμένων (Ρίζες 1-9)\n\n`;
    md += `| Πυθμένας | Πλήθος Στοιχείων | Ποσοστό |\n`;
    md += `| :---: | :---: | :---: |\n`;
    for (let r = 1; r <= 9; r++) {
      const count = stats.rootCounts[r] || 0;
      const pct = stats.totalCount > 0 ? ((count / stats.totalCount) * 100).toFixed(1) : "0";
      md += `| **${r}** | ${count} | ${pct}% |\n`;
    }
    md += `\n---\n\n`;

    md += `## 2. Πλήρες Ευρετήριο Ισοψηφικών Στοιχείων\n\n`;
    md += `| Κείμενο / Λέξη | Τιμή | Ιωνικά | Πυθμένας | Κατηγορία | Σημειώσεις |\n`;
    md += `| :--- | :---: | :---: | :---: | :--- | :--- |\n`;

    savedItems.forEach((item) => {
      md += `| **${item.text}** | ${item.value} | ${item.greekNumeral} | ${item.root} | ${item.category || "-"} | ${item.notes || "-"} |\n`;
    });

    md += `\n---\n\n`;
    md += `*Δημιουργήθηκε αυτόματα από την εφαρμογή «Λεξάριθμος - Αρχαία Ελληνική Ισοψηφία».*\n`;

    return md;
  }, [reportTitle, researcherName, savedItems, stats]);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isopsephy-research-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const data = {
      title: reportTitle,
      researcher: researcherName,
      generatedAt: new Date().toISOString(),
      statistics: stats,
      items: savedItems,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isopsephy-archive-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#12100d] border border-[#3d3020] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#e8dfd1]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b2217] bg-[#17140f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#281f15] border border-[#c89b3c]/40 text-[#e6c670]">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#f5ecd8]">
                Εξαγωγή Αναλυτικής Αναφοράς Έρευνας
              </h3>
              <p className="text-xs font-serif text-[#8c7e6c]">
                Προεπισκόπηση, εξαγωγή σε Markdown, JSON ή απευθείας εκτύπωση σε PDF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#221b14] hover:bg-[#33281c] text-[#a69680] hover:text-[#f5ecd8] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Inputs for Title & Researcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif text-[#8c7e6c] mb-1">
                Τίτλος Αναφοράς:
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#3d3121] text-[#f5ecd8] font-serif text-sm focus:outline-none focus:border-[#e6c670]"
              />
            </div>
            <div>
              <label className="block text-xs font-serif text-[#8c7e6c] mb-1">
                Όνομα Ερευνητή:
              </label>
              <input
                type="text"
                value={researcherName}
                onChange={(e) => setResearcherName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#3d3121] text-[#f5ecd8] font-serif text-sm focus:outline-none focus:border-[#e6c670]"
              />
            </div>
          </div>

          {/* Printable Document Preview Area */}
          <div className="p-6 rounded-2xl bg-[#0b0907] border border-[#2b2116] space-y-5 print:p-0 print:bg-white print:text-black font-serif">
            {/* Header Document */}
            <div className="border-b border-[#281f15] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#e6c670] print:text-black">
                {reportTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#8c7e6c] mt-2 print:text-gray-600">
                <span><strong>Ερευνητής:</strong> {researcherName}</span>
                <span>•</span>
                <span><strong>Ημερομηνία:</strong> {new Date().toLocaleDateString("el-GR")}</span>
                <span>•</span>
                <span><strong>Σύνολο:</strong> {stats.totalCount} στοιχεία</span>
              </div>
            </div>

            {/* Quick Root Distribution */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#c89b3c] print:text-gray-800">
                Κατανομή Πυθαγόρειων Πυθμένων (1-9):
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => (
                  <div key={r} className="p-2 rounded-lg bg-[#17130e] border border-[#2d2318] print:border-gray-300">
                    <div className="text-[10px] text-[#8c7e6c]">Ρίζα {r}</div>
                    <div className="text-sm font-bold text-[#f5ecd8] print:text-black">
                      {stats.rootCounts[r] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#c89b3c] print:text-gray-800">
                Αρχειοθετημένα Λεξαριθμικά Στοιχεία:
              </h4>
              <div className="overflow-x-auto max-h-60 overflow-y-auto border border-[#2d2318] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1a1510] text-[#8c7e6c] border-b border-[#2d2318] sticky top-0">
                    <tr>
                      <th className="p-2.5">Λέξη / Φράση</th>
                      <th className="p-2.5 text-center">Ισοψηφία</th>
                      <th className="p-2.5 text-center">Ιωνικά</th>
                      <th className="p-2.5 text-center">Πυθμένας</th>
                      <th className="p-2.5">Κατηγορία</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#241c14]">
                    {savedItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#14100c]">
                        <td className="p-2.5 font-bold text-[#f5ecd8]">{item.text}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-[#e6c670]">{item.value}</td>
                        <td className="p-2.5 text-center font-mono">{item.greekNumeral}</td>
                        <td className="p-2.5 text-center font-mono">{item.root}</td>
                        <td className="p-2.5 text-[#8c7e6c]">{item.category || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#2b2217] bg-[#17140f] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 rounded-xl bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-xs font-serif text-[#e6c670] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Αντιγράφηκε!" : "Αντιγραφή Markdown"}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2 rounded-xl bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-xs font-serif text-[#d6c7b2] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Λήψη .MD</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-2 rounded-xl bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-xs font-serif text-[#d6c7b2] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>Λήψη JSON</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#9c762b] hover:to-[#dbaa45] text-black font-serif font-bold text-xs shadow-lg shadow-[#c89b3c]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Εκτύπωση / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
