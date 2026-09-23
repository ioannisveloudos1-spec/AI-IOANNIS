import React, { useState, useMemo, useRef, useEffect } from "react";
import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { SavedIsopsephyItem } from "../types";
import appLogoImg from "../assets/images/ego_eimi_logo_1787417709332.jpg";
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
  Image as ImageIcon,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  HelpCircle,
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
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfStatus, setPdfStatus] = useState<string>("");
  const [isPreviewA4, setIsPreviewA4] = useState<boolean>(false);
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [reportEstimatedPages, setReportEstimatedPages] = useState<number>(1);

  const printReportRef = useRef<HTMLDivElement>(null);

  // Calculate estimated A4 pages dynamically based on rendered height
  useEffect(() => {
    if (printReportRef.current) {
      // 860px width standard A4 equivalent height is approx 1216px per page (297/210 ratio)
      const h = printReportRef.current.scrollHeight || printReportRef.current.offsetHeight || 600;
      const pages = Math.max(1, Math.ceil(h / 1180));
      setReportEstimatedPages(pages);
    }
  }, [savedItems, reportTitle, researcherName, isPreviewA4]);

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
    md += `**Εφαρμογή:** ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ — ΕΓΩ ΕΙΜΙ (Αρχαία Ελληνική Ισοψηφία & Λεξάριθμοι)  \n`;
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
    md += `*Δημιουργήθηκε αυτόματα από την εφαρμογή «ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ - ΕΓΩ ΕΙΜΙ | Αρχαία Ελληνική Ισοψηφία & Λεξάριθμοι».*\n`;

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
      brand: "ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ - ΕΓΩ ΕΙΜΙ",
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

  // Helper to get clean file base name
  const getReportFileName = (ext: "pdf" | "png" | "jpg") => {
    const cleanTitle = reportTitle
      .replace(/[^a-zA-Z0-9α-ωΑ-Ωά-ώΆ-Ώ]/g, "_")
      .slice(0, 32);
    return `${cleanTitle || "Ekthesi_Isopsephias"}_${Date.now()}.${ext}`;
  };

  // Capture options for clear, full-width export without clipping
  const getReportCaptureOptions = (node: HTMLElement) => {
    // Exact desktop-width standard (860px) ensures clean margins, readable text, and correct proportions
    const captureWidth = Math.max(node.scrollWidth, node.offsetWidth, 860);
    const captureHeight = Math.max(node.scrollHeight, node.offsetHeight, 600);

    return {
      cacheBust: true,
      pixelRatio: 2,
      width: captureWidth,
      height: captureHeight,
      style: {
        transform: "none",
        margin: "0",
        maxWidth: "none",
        maxHeight: "none",
        width: `${captureWidth}px`,
        boxSizing: "border-box",
      },
    };
  };

  // Direct PDF Export with Logo & proper A4 proportions
  const handleDownloadPdf = async () => {
    if (!printReportRef.current) return;
    setIsExportingPdf(true);
    setPdfStatus("Δημιουργία εγγράφου PDF (A4)...");

    try {
      const options = getReportCaptureOptions(printReportRef.current);
      const dataUrl = await toPng(printReportRef.current, options);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const printWidth = pdfWidth - margin * 2;
      const usablePageHeight = pdfHeight - margin * 2;

      const imgProps = pdf.getImageProperties(dataUrl);
      const totalPrintHeight = (imgProps.height * printWidth) / imgProps.width;

      if (totalPrintHeight <= usablePageHeight) {
        pdf.addImage(dataUrl, "PNG", margin, margin, printWidth, totalPrintHeight, undefined, "FAST");
      } else {
        // Multi-page slicing for long reports
        let heightLeft = totalPrintHeight;
        let position = margin;

        pdf.addImage(dataUrl, "PNG", margin, position, printWidth, totalPrintHeight, undefined, "FAST");
        heightLeft -= usablePageHeight;

        while (heightLeft > 0) {
          position = margin - (totalPrintHeight - heightLeft);
          pdf.addPage();
          pdf.addImage(dataUrl, "PNG", margin, position, printWidth, totalPrintHeight, undefined, "FAST");
          heightLeft -= usablePageHeight;
        }
      }

      pdf.save(getReportFileName("pdf"));
      setPdfStatus("Το έγγραφο PDF αποθηκεύτηκε επιτυχώς!");
      setTimeout(() => setPdfStatus(""), 3500);
    } catch (err) {
      console.error("PDF generation error:", err);
      setPdfStatus("Σφάλμα κατά την εξαγωγή PDF. Δοκιμάστε την 'Εκτύπωση / PDF'.");
      setTimeout(() => setPdfStatus(""), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Direct PNG Export for Report
  const handleDownloadPng = async () => {
    if (!printReportRef.current) return;
    setIsExportingPdf(true);
    setPdfStatus("Δημιουργία εικόνας PNG...");

    try {
      const options = getReportCaptureOptions(printReportRef.current);
      const dataUrl = await toPng(printReportRef.current, options);
      const a = document.createElement("a");
      a.download = getReportFileName("png");
      a.href = dataUrl;
      a.click();
      setPdfStatus("Η εικόνα PNG αποθηκεύτηκε επιτυχώς!");
      setTimeout(() => setPdfStatus(""), 3500);
    } catch (err) {
      console.error("PNG generation error:", err);
      setPdfStatus("Σφάλμα κατά την εξαγωγή PNG.");
      setTimeout(() => setPdfStatus(""), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Direct JPG Export for Report
  const handleDownloadJpg = async () => {
    if (!printReportRef.current) return;
    setIsExportingPdf(true);
    setPdfStatus("Δημιουργία εικόνας JPG...");

    try {
      const options = {
        ...getReportCaptureOptions(printReportRef.current),
        quality: 0.95,
      };
      const dataUrl = await toJpeg(printReportRef.current, options);
      const a = document.createElement("a");
      a.download = getReportFileName("jpg");
      a.href = dataUrl;
      a.click();
      setPdfStatus("Η εικόνα JPG αποθηκεύτηκε επιτυχώς!");
      setTimeout(() => setPdfStatus(""), 3500);
    } catch (err) {
      console.error("JPG generation error:", err);
      setPdfStatus("Σφάλμα κατά την εξαγωγή JPG.");
      setTimeout(() => setPdfStatus(""), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="export-report-modal fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static" style={{ zIndex: 100 }}>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#12100d] border border-[#3d3020] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#e8dfd1] print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b2217] bg-[#17140f] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#281f15] border border-[#c89b3c]/40 text-[#e6c670]">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#f5ecd8]">
                Εξαγωγή Αναλυτικής Αναφοράς Έρευνας
              </h3>
              <p className="text-xs font-serif text-[#8c7e6c]">
                Προεπισκόπηση, εξαγωγή σε PDF με το λογότυπο, Markdown, JSON ή εκτύπωση
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 print:p-0 print:overflow-visible">
          {/* Inputs for Title & Researcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
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

          {/* PRINT PREVIEW / VIEWPORT MODE TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#18130e] border border-[#2e2316] print:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewA4(!isPreviewA4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isPreviewA4
                    ? "bg-[#c89b3c] text-black shadow-[#c89b3c]/20"
                    : "bg-[#251d14] hover:bg-[#34271c] text-[#f5ecd8] border border-[#443625]"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isPreviewA4 ? "Προσομοίωση A4 (Ενεργή)" : "Προεπισκόπηση Σελίδας A4"}</span>
              </button>

              <div className="text-[11px] text-[#a69680] font-serif hidden sm:flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  Εκτίμηση: <strong>{reportEstimatedPages} {reportEstimatedPages === 1 ? "σελίδα" : "σελίδες"} A4</strong> (210×297mm)
                </span>
              </div>
            </div>

            {/* Zoom Controls (only shown or active during A4 preview mode) */}
            {isPreviewA4 && (
              <div className="flex items-center gap-1.5 bg-[#0e0c0a] px-2 py-1 rounded-lg border border-[#34271c]">
                <span className="text-[10px] text-[#8c7e6c] font-mono mr-1">Κλίμακα:</span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((prev) => Math.max(50, prev - 10))}
                  className="p-1 rounded hover:bg-[#251d14] text-[#a69680] hover:text-[#f5ecd8]"
                  title="Σμίκρυνση"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-bold text-[#e6c670] w-10 text-center">
                  {previewZoom}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((prev) => Math.min(130, prev + 10))}
                  className="p-1 rounded hover:bg-[#251d14] text-[#a69680] hover:text-[#f5ecd8]"
                  title="Μεγέθυνση"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewZoom(previewZoom === 100 ? 75 : 100)}
                  className="px-1.5 py-0.5 ml-1 text-[10px] rounded bg-[#251d14] hover:bg-[#34271c] text-[#d6c7b2] font-mono"
                  title="Επαναφορά κλίμακας"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* VIEWPORT SIMULATION CONTAINER */}
          <div
            className={`transition-all duration-300 print:p-0 print:m-0 print:bg-transparent ${
              isPreviewA4
                ? "flex flex-col items-center justify-start overflow-x-auto p-4 sm:p-6 bg-[#080705] rounded-2xl border-2 border-dashed border-[#c89b3c]/30"
                : "w-full"
            }`}
          >
            {isPreviewA4 && (
              <div className="w-full max-w-[860px] mb-3 flex items-center justify-between text-xs text-[#c89b3c] font-serif print:hidden">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#241c14] border border-[#c89b3c]/40 font-mono text-[11px] font-bold">
                    A4 Portrait Standard (210mm × 297mm)
                  </span>
                  <span className="text-[#8c7e6c] text-[11px]">
                    — Εμφάνιση όπως ακριβώς θα τυπωθεί / εξαχθεί
                  </span>
                </div>
                <div className="text-[11px] text-[#8c7e6c]">
                  Αναλογία 1 : 1.414
                </div>
              </div>
            )}

            {/* Printable Document Preview Area with App Logo at Top */}
            <div
              ref={printReportRef}
              id="printable-report-content"
              className={`space-y-5 font-serif shadow-2xl transition-all duration-200 avoid-break-inside ${
                isPreviewA4
                  ? "w-full max-w-[860px] min-h-[1180px] p-8 sm:p-12 bg-[#0d0b09] border-2 border-[#d4af37]/60 rounded-xl relative shadow-[#000000]/80 print:shadow-none print:border-none print:p-4 print:bg-white print:text-black"
                  : "w-full p-6 sm:p-8 rounded-2xl bg-[#0b0907] border border-[#2b2116] shadow-inner print:p-4 print:bg-white print:border-none print:text-black"
              }`}
              style={{
                pageBreakInside: "avoid",
                breakInside: "avoid",
                transform: isPreviewA4 && previewZoom !== 100 ? `scale(${previewZoom / 100})` : "none",
                transformOrigin: "top center",
              }}
            >
              {/* Watermark badge when in A4 preview */}
              {isPreviewA4 && (
                <div className="absolute top-3 right-4 px-2 py-0.5 rounded bg-[#1a140d]/80 border border-[#c89b3c]/30 text-[10px] font-mono text-[#c89b3c] pointer-events-none print:hidden">
                  A4 PROPORTION • 210×297mm
                </div>
              )}
            {/* APPLICATION LOGO & BRAND HEADER */}
            <div
              className="flex items-center justify-between pb-4 border-b border-[#281f15] print:border-gray-300 avoid-break-inside"
              style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#8a6825] via-[#e6c670] to-[#c89b3c] shadow-lg shadow-[#c89b3c]/20 shrink-0 print:border-2 print:border-[#8a6825]">
                  <img
                    src={appLogoImg}
                    alt="ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ ΕΓΩ ΕΙΜΙ"
                    className="w-full h-full object-cover rounded-full filter contrast-110"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-serif font-black tracking-wide text-[#f5ecd8] print:text-black">
                      ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#241a10] border border-[#c89b3c]/50 text-[#e6c670] font-mono font-bold tracking-widest print:bg-gray-100 print:text-black print:border-gray-400">
                      ΕΓΩ ΕΙΜΙ
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-serif text-[#a69680] tracking-wider print:text-gray-600">
                    Αρχαία Ελληνική Ισοψηφία & Λεξάριθμοι
                  </span>
                </div>
              </div>

              <div className="text-right hidden sm:block print:block">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#c89b3c] print:text-gray-800 font-bold">
                  ✦ ΕΠΙΣΗΜΗ ΕΚΘΕΣΗ ΕΡΕΥΝΑΣ ✦
                </div>
                <div className="text-[10px] font-mono text-[#8c7e6c] print:text-gray-500">
                  {new Date().toLocaleDateString("el-GR", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </div>

            {/* Header Document */}
            <div className="border-b border-[#281f15] pb-4 print:border-gray-300">
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
            <div
              className="space-y-2 avoid-break-inside"
              style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#c89b3c] print:text-gray-800">
                Κατανομή Πυθαγόρειων Πυθμένων (1-9):
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => (
                  <div
                    key={r}
                    className="p-2 rounded-lg bg-[#17130e] border border-[#2d2318] print:border-gray-300 print:bg-gray-50 avoid-break-inside"
                    style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
                  >
                    <div className="text-[10px] text-[#8c7e6c] print:text-gray-600">Ρίζα {r}</div>
                    <div className="text-sm font-bold text-[#f5ecd8] print:text-black">
                      {stats.rootCounts[r] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

              {/* Items Table */}
              <div
                className="space-y-2 avoid-break-inside"
                style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#c89b3c] print:text-gray-800">
                    Αρχειοθετημένα Λεξαριθμικά Στοιχεία ({savedItems.length}):
                  </h4>
                  {isPreviewA4 && (
                    <span className="text-[10px] text-[#8c7e6c] font-mono print:hidden">
                      Πλήρης έκταση σελίδας
                    </span>
                  )}
                </div>
                <div className={`border border-[#2d2318] rounded-xl print:max-h-none print:overflow-visible print:border-gray-300 ${
                  isPreviewA4 ? "overflow-visible max-h-none" : "overflow-x-auto max-h-64 overflow-y-auto"
                }`}>
                  <table className="w-full text-left text-xs" style={{ pageBreakInside: "auto" }}>
                    <thead className={`bg-[#1a1510] text-[#8c7e6c] border-b border-[#2d2318] print:static print:bg-gray-100 print:text-black print:border-gray-300 ${
                      isPreviewA4 ? "static" : "sticky top-0"
                    }`} style={{ pageBreakInside: "avoid" }}>
                      <tr>
                        <th className="p-2.5">Λέξη / Φράση</th>
                        <th className="p-2.5 text-center">Ισοψηφία</th>
                        <th className="p-2.5 text-center">Ιωνικά</th>
                        <th className="p-2.5 text-center">Πυθμένας</th>
                        <th className="p-2.5">Κατηγορία</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#241c14] print:divide-gray-200">
                      {savedItems.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-[#14100c] print:hover:bg-transparent avoid-break-inside"
                          style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
                        >
                          <td className="p-2.5 font-bold text-[#f5ecd8] print:text-black">{item.text}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-[#e6c670] print:text-black">{item.value}</td>
                          <td className="p-2.5 text-center font-mono print:text-black">{item.greekNumeral}</td>
                          <td className="p-2.5 text-center font-mono print:text-black">{item.root}</td>
                          <td className="p-2.5 text-[#8c7e6c] print:text-gray-700">{item.category || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            {/* Document Signature Footer */}
            <div
              className="pt-3 border-t border-[#241c14] flex items-center justify-between text-[11px] text-[#8c7e6c] print:border-gray-300 print:text-gray-600 avoid-break-inside"
              style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
            >
              <span>ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ — ΕΓΩ ΕΙΜΙ</span>
              <span>Αρχαία Ελληνική Ισοψηφία & Λεξάριθμοι</span>
            </div>
          </div>
        </div>
      </div>

        {/* Status Message */}
        {pdfStatus && (
          <div className="px-5 py-2 bg-[#201810] border-t border-[#3a2c1a] text-xs text-[#e6c670] font-serif flex items-center justify-between print:hidden">
            <span>{pdfStatus}</span>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#2b2217] bg-[#17140f] flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct JPG Download */}
            <button
              onClick={handleDownloadJpg}
              disabled={isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-[#f5ecd8] font-serif font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              title="Λήψη της αναφοράς ως εικόνα JPG"
            >
              <Download className="w-3.5 h-3.5 text-[#e6c670]" />
              <span>JPG</span>
            </button>

            {/* Direct PNG Download */}
            <button
              onClick={handleDownloadPng}
              disabled={isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-[#f5ecd8] font-serif font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              title="Λήψη της αναφοράς ως εικόνα PNG"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#e6c670]" />
              <span>PNG</span>
            </button>

            {/* Direct PDF Download with App Logo */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded-xl bg-[#241c14] hover:bg-[#33281c] border border-[#c89b3c]/60 text-[#f5ecd8] font-serif font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              title="Άμεση λήψη αρχείου PDF A4 με το λογότυπο της εφαρμογής"
            >
              <Download className="w-4 h-4 text-[#e6c670]" />
              <span>{isExportingPdf ? "Δημιουργία..." : "📄 PDF (A4)"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#9c762b] hover:to-[#dbaa45] text-black font-serif font-bold text-xs shadow-lg shadow-[#c89b3c]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Εκτύπωση</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

