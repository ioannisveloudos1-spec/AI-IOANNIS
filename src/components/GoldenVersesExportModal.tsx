import React, { useState, useRef, useMemo } from "react";
import { toPng, toBlob } from "html-to-image";
import jsPDF from "jspdf";
import {
  GoldenVerseSection,
  PYTHAGORAS_INTRODUCTION,
  FOOTNOTES,
  GOLDEN_VERSES_SECTIONS,
} from "../data/goldenVerses";
import {
  FileText,
  Download,
  Image as ImageIcon,
  Copy,
  Printer,
  Check,
  X,
  Sparkles,
  BookOpen,
  Layers,
  Palette,
  Eye,
  Settings,
  ScrollText,
  HelpCircle,
  Edit3,
} from "lucide-react";

export type ExportTheme = "parchment" | "clean-white" | "dark-obsidian";
export type VersesLayout = "columns" | "interleaved";
export type ExportScope = "current" | "all" | "ethical" | "metaphysical" | string;

interface GoldenVersesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSections: GoldenVerseSection[];
  initialLevelFilter?: "all" | "ethical" | "metaphysical";
  activeSectionId?: string | null;
}

export const GoldenVersesExportModal: React.FC<GoldenVersesExportModalProps> = ({
  isOpen,
  onClose,
  currentSections,
  initialLevelFilter = "all",
  activeSectionId = null,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);

  // Scope of export
  const [scope, setScope] = useState<ExportScope>(
    activeSectionId || (initialLevelFilter !== "all" ? initialLevelFilter : "current")
  );

  // Content toggles
  const [includeIntro, setIncludeIntro] = useState<boolean>(true);
  const [includeAncient, setIncludeAncient] = useState<boolean>(true);
  const [includeModern, setIncludeModern] = useState<boolean>(true);
  const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
  const [includeIsopsephy, setIncludeIsopsephy] = useState<boolean>(true);
  const [includeFootnotes, setIncludeFootnotes] = useState<boolean>(true);
  const [includePersonalNotes, setIncludePersonalNotes] = useState<boolean>(false);

  // Styling options
  const [theme, setTheme] = useState<ExportTheme>("parchment");
  const [layout, setLayout] = useState<VersesLayout>("columns");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");

  // Custom metadata
  const [docTitle, setDocTitle] = useState<string>("Προσωπικό Δελτίο Μελέτης — Χρυσά Έπη");
  const [researcherName, setResearcherName] = useState<string>("Μελετητής Πυθαγορείου Φιλοσοφίας");
  const [personalNotesText, setPersonalNotesText] = useState<string>(
    "Ημερήσιος στοχασμός & πρακτική εφαρμογή των παραγγελμάτων: Αυτοκυριαρχία, εχεμύθεια και τριπλή βραδινή ανασκόπηση."
  );

  // Action states
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Determine sections to render
  const sectionsToExport = useMemo(() => {
    if (scope === "all") {
      return GOLDEN_VERSES_SECTIONS;
    }
    if (scope === "ethical") {
      return GOLDEN_VERSES_SECTIONS.filter((s) => s.level === "ethical");
    }
    if (scope === "metaphysical") {
      return GOLDEN_VERSES_SECTIONS.filter((s) => s.level === "metaphysical");
    }
    if (scope === "current") {
      return currentSections.length > 0 ? currentSections : GOLDEN_VERSES_SECTIONS;
    }
    // Specific section ID
    const found = GOLDEN_VERSES_SECTIONS.find((s) => s.id === scope);
    return found ? [found] : currentSections;
  }, [scope, currentSections]);

  // Date formatting
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  if (!isOpen) return null;

  // Theme styling definitions
  const themeClasses = {
    parchment: {
      wrapper: "bg-[#fbf7ee] text-[#2c2214] border-[#d8c29d]",
      headerBg: "bg-gradient-to-b from-[#f5ecd7] to-[#ede1c5] border-[#d5be96]",
      titleColor: "text-[#4a2e0e]",
      subtitleColor: "text-[#7a5828]",
      badgeBg: "bg-[#ebd9b8] text-[#543b18] border-[#cbb38b]",
      cardBg: "bg-[#fdfaf3] border-[#e0ceb1]",
      ancientText: "text-[#3b2710] font-serif",
      modernText: "text-[#544026] font-serif",
      noteBg: "bg-[#f4ebe0] border-[#d6be9f] text-[#4d361c]",
      divider: "border-[#d8c5a4]",
      accentBg: "bg-[#ebd7b0] text-[#42290a]",
    },
    "clean-white": {
      wrapper: "bg-white text-[#1a1a1a] border-[#e5e5e5]",
      headerBg: "bg-[#fafafa] border-[#e5e5e5]",
      titleColor: "text-[#111111]",
      subtitleColor: "text-[#555555]",
      badgeBg: "bg-[#f0f0f0] text-[#333333] border-[#dcdcdc]",
      cardBg: "bg-white border-[#e0e0e0]",
      ancientText: "text-[#111111] font-serif",
      modernText: "text-[#333333] font-serif",
      noteBg: "bg-[#f9f9f9] border-[#e2e2e2] text-[#333333]",
      divider: "border-[#e5e5e5]",
      accentBg: "bg-[#f2f2f2] text-[#111111]",
    },
    "dark-obsidian": {
      wrapper: "bg-[#14100c] text-[#f2e7d5] border-[#3d2f1f]",
      headerBg: "bg-gradient-to-b from-[#211a13] to-[#18130e] border-[#423220]",
      titleColor: "text-[#f7e4ba]",
      subtitleColor: "text-[#d1b585]",
      badgeBg: "bg-[#2d2216] text-[#e8c88e] border-[#5e472a]",
      cardBg: "bg-[#1b1510] border-[#382a1b]",
      ancientText: "text-[#f5ead7] font-serif",
      modernText: "text-[#d9c9b1] font-serif",
      noteBg: "bg-[#241c14] border-[#4a3723] text-[#dfcdb5]",
      divider: "border-[#382a1b]",
      accentBg: "bg-[#332517] text-[#f0d49e]",
    },
  }[theme];

  // Font size configuration
  const fontClasses = {
    sm: { ancient: "text-xs", modern: "text-xs", meta: "text-[10px]" },
    md: { ancient: "text-sm sm:text-base", modern: "text-xs sm:text-sm", meta: "text-xs" },
    lg: { ancient: "text-base sm:text-lg", modern: "text-sm sm:text-base", meta: "text-sm" },
  }[fontSize];

  // Download high-res PNG image
  const handleDownloadPng = async () => {
    if (!documentRef.current) return;
    setIsExportingPng(true);
    setStatusMessage("Δημιουργία εικόνας υψηλής ανάλυσης...");
    try {
      const dataUrl = await toPng(documentRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
      });
      const link = document.createElement("a");
      const cleanTitle = docTitle.replace(/[^a-zA-Z0-9α-ωΑ-Ωά-ώΆ-Ώ]/g, "_").slice(0, 30);
      link.download = `${cleanTitle || "Pythagorean_Verses"}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setStatusMessage("Η εικόνα PNG δημιουργήθηκε και αποθηκεύτηκε επιτυχώς!");
      setTimeout(() => setStatusMessage(""), 3500);
    } catch (err) {
      console.error("PNG export error:", err);
      setStatusMessage("Σφάλμα κατά την εξαγωγή της εικόνας. Δοκιμάστε ξανά.");
    } finally {
      setIsExportingPng(false);
    }
  };

  // Copy PNG image to clipboard
  const handleCopyPng = async () => {
    if (!documentRef.current) return;
    setIsExportingPng(true);
    setStatusMessage("Αντιγραφή εικόνας στο πρόχειρο...");
    try {
      const blob = await toBlob(documentRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
      });
      if (!blob) throw new Error("Could not create blob");

      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        setCopiedSuccess(true);
        setStatusMessage("Η εικόνα αντιγράφηκε επιτυχώς στο πρόχειρο!");
        setTimeout(() => {
          setCopiedSuccess(false);
          setStatusMessage("");
        }, 3000);
      } else {
        // Fallback to downloading
        await handleDownloadPng();
      }
    } catch (err) {
      console.error("Clipboard copy error:", err);
      setStatusMessage("Η άμεση αντιγραφή δεν υποστηρίζεται. Χρησιμοποιήστε λήψη PNG.");
    } finally {
      setIsExportingPng(false);
    }
  };

  // Export as multi-page PDF Document
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setIsExportingPdf(true);
    setStatusMessage("Δημιουργία εγγράφου PDF (A4)...");
    try {
      const dataUrl = await toPng(documentRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.98,
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      // Add subsequent pages if document is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      const cleanTitle = docTitle.replace(/[^a-zA-Z0-9α-ωΑ-Ωά-ώΆ-Ώ]/g, "_").slice(0, 30);
      pdf.save(`${cleanTitle || "Pythagoras_Study_Sheet"}_${Date.now()}.pdf`);

      setStatusMessage("Το έγγραφο PDF δημιουργήθηκε και αποθηκεύτηκε επιτυχώς!");
      setTimeout(() => setStatusMessage(""), 3500);
    } catch (err) {
      console.error("PDF generation error:", err);
      setStatusMessage("Σφάλμα κατά τη δημιουργία του PDF. Δοκιμάστε ξανά.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Native Browser Print Dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="golden-verses-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#120f0c] border border-amber-800/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/60 bg-[#1a140e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-300 shadow-md">
              <ScrollText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100">
                  Εξαγωγή Πλαισίου Μελέτης (PDF & Εικόνα)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-900/40 text-amber-300 border border-amber-700/40">
                  Χρυσά Έπη Πυθαγόρα
                </span>
              </div>
              <p className="text-xs font-serif text-amber-300/70">
                Δημιουργία εξατομικευμένου φύλλου μελέτης με εισαγωγή, πρωτότυπους στίχους, ερμηνεία & επεξηγήσεις
              </p>
            </div>
          </div>

          <button
            id="close-export-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#221a13] hover:bg-[#34271c] text-amber-300/80 hover:text-amber-100 transition-colors cursor-pointer border border-amber-900/50"
            title="Κλείσιμο παραθύρου εξαγωγής"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (Grid on large screens: Controls on Left, Live Preview on Right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-amber-900/50">
          {/* Controls Column (5 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 space-y-5 bg-[#16120e] overflow-y-auto">
            {/* Scope Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-200">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Πλαίσιο Στίχων (Εύρος Εξαγωγής):</span>
              </label>
              <select
                id="export-scope-selector"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#201811] border border-amber-700/50 text-amber-100 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="current">Τρέχουσα Προβολή ({currentSections.length} ενότητες)</option>
                <option value="all">Όλο το Έργο (Όλοι οι 71 Στίχοι)</option>
                <option value="ethical">Α. Ηθικό Επίπεδο (Στίχοι 1 - 49a)</option>
                <option value="metaphysical">Β. Μεταφυσικό Επίπεδο (Στίχοι 49b - 71)</option>
                <optgroup label="Συγκεκριμένη Ενότητα:">
                  {GOLDEN_VERSES_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      Στίχοι {sec.range}: {sec.title.slice(0, 42)}...
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Elements to Include (Checkboxes) */}
            <div className="space-y-2.5 pt-2 border-t border-amber-900/40">
              <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Στοιχεία προς Συμπερίληψη:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs font-serif">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#201811] border border-amber-900/40 hover:bg-[#281f15] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeIntro}
                    onChange={(e) => setIncludeIntro(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-100 font-medium">Εισαγωγή & Πυθαγόρειο Πλαίσιο</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#201811] border border-amber-900/40 hover:bg-[#281f15] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAncient}
                    onChange={(e) => setIncludeAncient(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-100 font-medium">Αρχαίοι Στίχοι (Πολυτονικό)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#201811] border border-amber-900/40 hover:bg-[#281f15] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeModern}
                    onChange={(e) => setIncludeModern(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-100 font-medium">Νεοελληνική Ερμηνευτική Απόδοση</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#201811] border border-amber-900/40 hover:bg-[#281f15] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExplanations}
                    onChange={(e) => setIncludeExplanations(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-100 font-medium">Φιλοσοφικές Επεξηγήσεις & Σχόλια</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#201811] border border-amber-900/40 hover:bg-[#281f15] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeIsopsephy}
                    onChange={(e) => setIncludeIsopsephy(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-100 font-medium">Ισοψηφικοί Λεξάριθμοι & Κλείδες</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#201811] border border-amber-900/40 hover:bg-[#281f15] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFootnotes}
                    onChange={(e) => setIncludeFootnotes(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-100 font-medium">Ετυμολογικές Υποσημειώσεις</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#201811] border border-amber-900/40 hover:bg-[#281f15] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePersonalNotes}
                    onChange={(e) => setIncludePersonalNotes(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-amber-100 font-medium">Προσωπικές Σημειώσεις Μελέτης</span>
                </label>
              </div>
            </div>

            {/* Layout and Theme Settings */}
            <div className="space-y-3 pt-2 border-t border-amber-900/40">
              <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Αισθητική & Διάταξη:</span>
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTheme("parchment")}
                  className={`px-2 py-1.5 rounded-lg text-xs font-serif transition-colors cursor-pointer border ${
                    theme === "parchment"
                      ? "bg-[#ebd9b8] text-[#4a2e0e] font-bold border-[#cbb38b]"
                      : "bg-[#201811] text-amber-300/80 border-amber-900/40 hover:text-amber-100"
                  }`}
                  title="Ζεστή Πυθαγόρεια Περγαμηνή"
                >
                  📜 Περγαμηνή
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("clean-white")}
                  className={`px-2 py-1.5 rounded-lg text-xs font-serif transition-colors cursor-pointer border ${
                    theme === "clean-white"
                      ? "bg-white text-black font-bold border-gray-400"
                      : "bg-[#201811] text-amber-300/80 border-amber-900/40 hover:text-amber-100"
                  }`}
                  title="Λευκό Χαρτί για καθαρή εκτύπωση"
                >
                  📄 Λευκό Print
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark-obsidian")}
                  className={`px-2 py-1.5 rounded-lg text-xs font-serif transition-colors cursor-pointer border ${
                    theme === "dark-obsidian"
                      ? "bg-amber-600 text-black font-bold border-amber-400"
                      : "bg-[#201811] text-amber-300/80 border-amber-900/40 hover:text-amber-100"
                  }`}
                  title="Σκοτεινό Μυσταγωγικό"
                >
                  🌌 Σκοτεινό
                </button>
              </div>

              {/* Verses presentation layout */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[11px] font-serif text-amber-300/70">Διάταξη Στίχων:</span>
                <div className="flex items-center bg-[#201811] p-0.5 rounded-lg border border-amber-900/40">
                  <button
                    type="button"
                    onClick={() => setLayout("columns")}
                    className={`px-2 py-1 rounded text-xs font-serif transition-colors cursor-pointer ${
                      layout === "columns" ? "bg-amber-700 text-white font-bold" : "text-amber-300"
                    }`}
                  >
                    Δίστηλη
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout("interleaved")}
                    className={`px-2 py-1 rounded text-xs font-serif transition-colors cursor-pointer ${
                      layout === "interleaved" ? "bg-amber-700 text-white font-bold" : "text-amber-300"
                    }`}
                  >
                    Εναλλάξ
                  </button>
                </div>
              </div>

              {/* Font size */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-serif text-amber-300/70">Μέγεθος Γραμματοσειράς:</span>
                <div className="flex items-center bg-[#201811] p-0.5 rounded-lg border border-amber-900/40">
                  {(["sm", "md", "lg"] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-0.5 rounded text-xs font-serif transition-colors cursor-pointer ${
                        fontSize === sz ? "bg-amber-700 text-white font-bold" : "text-amber-300"
                      }`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Researcher Fields */}
            <div className="space-y-3 pt-2 border-t border-amber-900/40">
              <div>
                <label className="block text-[11px] font-serif text-amber-300/80 mb-1">
                  Τίτλος Εγγράφου Μελέτης:
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#201811] border border-amber-800/40 text-amber-100 text-xs font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] font-serif text-amber-300/80 mb-1">
                  Όνομα Μελετητή:
                </label>
                <input
                  type="text"
                  value={researcherName}
                  onChange={(e) => setResearcherName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#201811] border border-amber-800/40 text-amber-100 text-xs font-serif"
                />
              </div>

              {includePersonalNotes && (
                <div>
                  <label className="block text-[11px] font-serif text-amber-300/80 mb-1 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>Προσωπικές Σημειώσεις:</span>
                  </label>
                  <textarea
                    value={personalNotesText}
                    onChange={(e) => setPersonalNotesText(e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded-lg bg-[#201811] border border-amber-800/40 text-amber-100 text-xs font-serif resize-none"
                    placeholder="Γράψτε εδώ τις προσωπικές σας σημειώσεις ή ημερήσιο στοχασμό..."
                  />
                </div>
              )}
            </div>

            {/* Quick Export Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-amber-900/40">
              <span className="text-xs font-serif font-bold text-amber-300">
                Μορφές Εξαγωγής:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="export-pdf-btn"
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf || isExportingPng}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-amber-900 hover:from-red-600 hover:to-amber-800 text-white font-serif font-bold text-xs shadow-lg cursor-pointer transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
                  title="Λήψη του πλήρους εγγράφου μελέτης σε μορφή PDF (A4)"
                >
                  <FileText className="w-4 h-4 text-red-200" />
                  <span>{isExportingPdf ? "Εξαγωγή PDF..." : "📄 Λήψη PDF (A4)"}</span>
                </button>

                <button
                  id="export-png-btn"
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isExportingPdf || isExportingPng}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-600 text-white font-serif font-bold text-xs shadow-lg cursor-pointer transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
                  title="Λήψη εικόνας υψηλής ανάλυσης (PNG 2x)"
                >
                  <ImageIcon className="w-4 h-4 text-amber-200" />
                  <span>{isExportingPng ? "Δημιουργία PNG..." : "🖼️ Λήψη Εικόνας"}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="copy-image-btn"
                  type="button"
                  onClick={handleCopyPng}
                  disabled={isExportingPdf || isExportingPng}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#221a13] hover:bg-[#34271c] border border-amber-700/50 text-amber-200 font-serif text-xs cursor-pointer transition-colors"
                  title="Αντιγραφή εικόνας στο πρόχειρο"
                >
                  {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedSuccess ? "Αντιγράφηκε!" : "Αντιγραφή Εικόνας"}</span>
                </button>

                <button
                  id="print-sheet-btn"
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#221a13] hover:bg-[#34271c] border border-amber-700/50 text-amber-200 font-serif text-xs cursor-pointer transition-colors"
                  title="Άμεση εκτύπωση μέσω του περιηγητή"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Εκτύπωση</span>
                </button>
              </div>

              {statusMessage && (
                <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-700/50 text-[11px] font-serif text-amber-200 text-center animate-in fade-in">
                  {statusMessage}
                </div>
              )}
            </div>
          </div>

          {/* Live Document Preview Column (7 Cols) */}
          <div className="lg:col-span-8 p-3 sm:p-5 md:p-6 bg-[#0c0a08] overflow-y-auto max-h-[82vh] flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 text-xs font-serif text-amber-400/80 px-2">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Προεπισκόπηση Εγγράφου Μελέτης:</span>
              </span>
              <span className="text-[11px] text-amber-500/70">
                {sectionsToExport.length} ενότητες • {sectionsToExport.reduce((acc, s) => acc + s.ancientLines.length, 0)} στίχοι
              </span>
            </div>

            {/* The Actual Rendered Document Container to Capture */}
            <div
              ref={documentRef}
              id="pythagorean-study-document"
              className={`w-full max-w-[850px] p-6 sm:p-8 md:p-10 rounded-2xl border shadow-2xl space-y-6 transition-all ${themeClasses.wrapper}`}
              style={{ fontFamily: "'Cinzel', 'EB Garamond', Georgia, serif" }}
            >
              {/* Pythagorean Sacred Document Header */}
              <div className={`p-6 rounded-xl border text-center space-y-2.5 ${themeClasses.headerBg}`}>
                <div className="inline-flex items-center justify-center p-2 rounded-full border border-amber-600/40 bg-amber-500/10 mb-1">
                  <span className="text-xl">🏛️</span>
                </div>
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-wider uppercase ${themeClasses.titleColor}`}>
                  {docTitle}
                </h1>
                <p className={`text-xs sm:text-sm font-serif italic ${themeClasses.subtitleColor}`}>
                  «ΤΑ ΧΡΥΣΑ ΕΠΗ ΤΟΥ ΠΥΘΑΓΟΡΑ» — Η Ιερά Παρακαταθήκη των Πυθαγορείων
                </p>

                {/* Meta details bar */}
                <div className="flex items-center justify-center gap-3 flex-wrap pt-2 text-[11px] font-mono border-t border-amber-900/20">
                  <span>Ημερομηνία: {formattedDate}</span>
                  <span>•</span>
                  <span>Μελετητής: {researcherName}</span>
                  <span>•</span>
                  <span>
                    Εύρος: {scope === "all" ? "Στίχοι 1 - 71 (Πλήρες)" : `${sectionsToExport.length} Ενότητες`}
                  </span>
                </div>
              </div>

              {/* 4 Pillars of Pythagorean Way of Life (if intro is enabled) */}
              {includeIntro && (
                <div className={`p-4 rounded-xl border space-y-3 ${themeClasses.cardBg}`}>
                  <div className="flex items-center gap-2 border-b pb-2 border-amber-900/20">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <h2 className={`text-sm sm:text-base font-bold ${themeClasses.titleColor}`}>
                      Φιλοσοφικό Πλαίσιο & Το Ομακοείον του Κρότωνος
                    </h2>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${themeClasses.modernText}`}>
                    {PYTHAGORAS_INTRODUCTION.sections[0].text}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
                    <div className={`p-2 rounded-lg border ${themeClasses.badgeBg}`}>
                      <div className="font-bold">Α. Ηθικό Επίπεδο</div>
                      <div className="text-[10px] opacity-80">Στίχοι 1 – 49a</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${themeClasses.badgeBg}`}>
                      <div className="font-bold">Β. Μεταφυσικό</div>
                      <div className="text-[10px] opacity-80">Στίχοι 49b – 71</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${themeClasses.badgeBg}`}>
                      <div className="font-bold">Ιερά Τετρακτύς</div>
                      <div className="text-[10px] opacity-80">ΤΕΤΡΑΚΤΥΣ = 1251</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${themeClasses.badgeBg}`}>
                      <div className="font-bold">Έσχατος Σκοπός</div>
                      <div className="text-[10px] opacity-80">«Θεὸς ἄμβροτος»</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verses Sections List */}
              <div className="space-y-6">
                {sectionsToExport.map((sec) => (
                  <div
                    key={sec.id}
                    className={`p-4 sm:p-5 rounded-xl border space-y-4 ${themeClasses.cardBg}`}
                  >
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b pb-2.5 border-amber-900/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${themeClasses.badgeBg}`}>
                            Στίχοι {sec.range}
                          </span>
                          <span className="text-[11px] font-serif uppercase tracking-wider opacity-75">
                            {sec.levelName}
                          </span>
                        </div>
                        <h3 className={`text-sm sm:text-base font-bold mt-1 ${themeClasses.titleColor}`}>
                          {sec.title}
                        </h3>
                      </div>
                    </div>

                    {/* Verses Content based on selected layout */}
                    {layout === "columns" ? (
                      /* Dual-Column Layout */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Ancient Text Column */}
                        {includeAncient && (
                          <div className="space-y-1.5 pr-2 md:border-r border-amber-900/20">
                            <div className="text-[11px] font-bold uppercase tracking-wider opacity-75 pb-1">
                              Πρωτότυπο Αρχαίο Κείμενο (Δακτυλικό Εξάμετρο)
                            </div>
                            {sec.ancientLines.map((line, idx) => {
                              const lineNum = sec.startLine + idx;
                              return (
                                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="shrink-0 w-5 text-right text-[10px] font-mono opacity-60 pt-0.5">
                                    {lineNum}
                                  </span>
                                  <p className={`${fontClasses.ancient} ${themeClasses.ancientText} font-serif`}>
                                    {line}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Modern Translation Column */}
                        {includeModern && (
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-bold uppercase tracking-wider opacity-75 pb-1">
                              Νεοελληνική Ερμηνευτική Απόδοση
                            </div>
                            {sec.modernLines.map((line, idx) => {
                              const lineNum = sec.startLine + idx;
                              return (
                                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="shrink-0 w-5 text-right text-[10px] font-mono opacity-60 pt-0.5">
                                    {lineNum}
                                  </span>
                                  <p className={`${fontClasses.modern} ${themeClasses.modernText} font-serif italic`}>
                                    {line}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Interleaved Layout (Line by line) */
                      <div className="space-y-3">
                        {sec.ancientLines.map((line, idx) => {
                          const lineNum = sec.startLine + idx;
                          const modernLine = sec.modernLines[idx];
                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-lg border ${themeClasses.noteBg} space-y-1`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="shrink-0 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-900/20">
                                  {lineNum}
                                </span>
                                {includeAncient && (
                                  <p className={`${fontClasses.ancient} ${themeClasses.ancientText} font-serif font-medium`}>
                                    {line}
                                  </p>
                                )}
                              </div>
                              {includeModern && modernLine && (
                                <p className={`pl-7 ${fontClasses.modern} ${themeClasses.modernText} font-serif italic`}>
                                  {modernLine}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanations & Key Terms */}
                    {includeIsopsephy && sec.keyTerms && sec.keyTerms.length > 0 && (
                      <div className="pt-2 border-t border-amber-900/20 space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Πυθαγόρειοι Όροι & Ισοψηφικές Κλείδες:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {sec.keyTerms.map((term, tIdx) => (
                            <div
                              key={tIdx}
                              className={`p-2 rounded-lg border text-xs ${themeClasses.noteBg} flex items-start gap-2`}
                            >
                              <div className="shrink-0 font-mono font-bold px-1.5 py-0.5 rounded bg-amber-700/20 text-amber-800">
                                {term.word} = {term.value}
                              </div>
                              <div className="text-[11px] leading-tight opacity-90">
                                {term.explanation}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Notes & Footnotes */}
                    {includeExplanations && sec.notes && sec.notes.length > 0 && (
                      <div className={`p-2.5 rounded-lg text-xs border ${themeClasses.noteBg} space-y-1`}>
                        <div className="font-bold opacity-80 text-[11px]">Φιλοσοφική Επεξήγηση:</div>
                        {sec.notes.map((n, nIdx) => (
                          <div key={nIdx} className="leading-relaxed opacity-90 text-[11px]">
                            {n}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Extended Footnotes Analysis (if enabled) */}
              {includeFootnotes && (
                <div className={`p-4 sm:p-5 rounded-xl border space-y-3 ${themeClasses.cardBg}`}>
                  <div className="flex items-center gap-2 border-b pb-2 border-amber-900/20">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <h3 className={`text-sm sm:text-base font-bold ${themeClasses.titleColor}`}>
                      Ετυμολογικό & Μυσταγωγικό Υπόμνημα (Ιεροκλέους)
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    {FOOTNOTES.map((fn, fIdx) => (
                      <div key={fIdx} className={`p-3 rounded-lg border ${themeClasses.noteBg} space-y-1.5`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap font-bold">
                          <span className="text-amber-800">{fn.term} ({fn.contextVerse})</span>
                          <span className="text-[10px] opacity-75">{fn.subtitle}</span>
                        </div>
                        <div className="italic text-[11px] leading-relaxed opacity-95">
                          {fn.freeTranslation}
                        </div>
                        <div className="text-[11px] leading-relaxed opacity-90 pt-1 border-t border-amber-900/10">
                          {fn.philosophicalMeaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Study Notes Box (if enabled) */}
              {includePersonalNotes && personalNotesText.trim() && (
                <div className={`p-4 sm:p-5 rounded-xl border space-y-2 ${themeClasses.cardBg}`}>
                  <div className="flex items-center gap-2 border-b pb-2 border-amber-900/20">
                    <Edit3 className="w-4 h-4 text-amber-700" />
                    <h3 className={`text-sm sm:text-base font-bold ${themeClasses.titleColor}`}>
                      Προσωπικές Σημειώσεις & Ημερήσιος Στοχασμός Μελετητή
                    </h3>
                  </div>
                  <p className={`text-xs sm:text-sm font-serif italic whitespace-pre-wrap leading-relaxed ${themeClasses.modernText}`}>
                    {personalNotesText}
                  </p>
                </div>
              )}

              {/* Document Sacred Footer */}
              <div className={`pt-4 border-t text-center space-y-1.5 ${themeClasses.divider} text-xs opacity-75`}>
                <p className="font-serif italic font-bold">
                  «ἔσσεαι ἀθάνατος, θεὸς ἄμβροτος, οὐκέτι θνητός»
                </p>
                <p className="text-[10px] font-mono">
                  Πυθαγόρεια Ισοψηφία & Χρυσά Έπη • Προσωπικό Αρχείο Μελέτης • {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
