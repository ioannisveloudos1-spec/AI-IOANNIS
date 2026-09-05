import React, { useState, useRef, useMemo, useEffect } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { SavedIsopsephyItem } from "../types";
import { AppTheme, APP_THEMES, getInitialTheme } from "../utils/theme";
import { ANCIENT_GREEK_FONTS, getInitialAncientFont } from "../utils/greekFonts";
import {
  FileText,
  Download,
  Printer,
  X,
  Sparkles,
  Palette,
  Type,
  Check,
  Layers,
  Calendar,
  User,
  Hash,
  Scale,
  Settings2,
  Table as TableIcon,
  Filter,
} from "lucide-react";

export type ExportScope = "all" | "selected" | "words" | "phrases" | "filtered";
export type PaperOrientation = "portrait" | "landscape";

interface ArchivePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedIsopsephyItem[];
  filteredItems: SavedIsopsephyItem[];
  selectedItemIds: Set<string>;
  currentAppTheme?: AppTheme;
  currentAppFontId?: string;
}

// Visual theme palettes matching the application's 6 themes
export interface ExportThemePalette {
  id: AppTheme;
  name: string;
  isLight: boolean;
  bgPage: string;
  bgCard: string;
  bgSubtle: string;
  borderPrimary: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  tableRowEven: string;
  tableRowOdd: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  meanderColor: string;
}

const THEME_PALETTES: Record<AppTheme, ExportThemePalette> = {
  "dark-ancient": {
    id: "dark-ancient",
    name: "1. Κλασική / Νυχτερινή",
    isLight: false,
    bgPage: "#0e0c0a",
    bgCard: "#181410",
    bgSubtle: "#241c14",
    borderPrimary: "#c89b3c",
    borderSubtle: "#3d2f21",
    textPrimary: "#f5ecd8",
    textSecondary: "#d8c8b0",
    textMuted: "#9c8973",
    accent: "#ffd700",
    tableHeaderBg: "#221a12",
    tableHeaderText: "#ffd700",
    tableRowEven: "#13100c",
    tableRowOdd: "#19140f",
    badgeBg: "#2c2014",
    badgeText: "#ffd700",
    badgeBorder: "#5c4322",
    meanderColor: "#c89b3c",
  },
  parchment: {
    id: "parchment",
    name: "2. Αρχαιοελληνική Περγαμηνή",
    isLight: true,
    bgPage: "#f8f4ec",
    bgCard: "#ffffff",
    bgSubtle: "#f2e7d7",
    borderPrimary: "#bfa37c",
    borderSubtle: "#d8c9b3",
    textPrimary: "#38200d",
    textSecondary: "#593617",
    textMuted: "#7c5c3e",
    accent: "#8c5307",
    tableHeaderBg: "#eddcc6",
    tableHeaderText: "#38200d",
    tableRowEven: "#ffffff",
    tableRowOdd: "#f9f5ee",
    badgeBg: "#f2e4d0",
    badgeText: "#5e3810",
    badgeBorder: "#caa97f",
    meanderColor: "#8c5307",
  },
  "ancient-calligraphy": {
    id: "ancient-calligraphy",
    name: "3. Αρχαιοελληνική Καλλιγραφία",
    isLight: true,
    bgPage: "#faf5eb",
    bgCard: "#ffffff",
    bgSubtle: "#f3e8d7",
    borderPrimary: "#b59263",
    borderSubtle: "#d9c4a7",
    textPrimary: "#2e1a0a",
    textSecondary: "#523014",
    textMuted: "#754b27",
    accent: "#7a491e",
    tableHeaderBg: "#ebd6bc",
    tableHeaderText: "#2e1a0a",
    tableRowEven: "#ffffff",
    tableRowOdd: "#faf4e8",
    badgeBg: "#f1deca",
    badgeText: "#4d280b",
    badgeBorder: "#c9a982",
    meanderColor: "#7a491e",
  },
  solar: {
    id: "solar",
    name: "4. Ηλιακή (Solar)",
    isLight: true,
    bgPage: "#fffcf0",
    bgCard: "#ffffff",
    bgSubtle: "#fef3c7",
    borderPrimary: "#d97706",
    borderSubtle: "#fcd34d",
    textPrimary: "#3b1e00",
    textSecondary: "#78350f",
    textMuted: "#92400e",
    accent: "#d97706",
    tableHeaderBg: "#fef3c7",
    tableHeaderText: "#78350f",
    tableRowEven: "#ffffff",
    tableRowOdd: "#fffbeb",
    badgeBg: "#fde68a",
    badgeText: "#78350f",
    badgeBorder: "#f59e0b",
    meanderColor: "#d97706",
  },
  ethereal: {
    id: "ethereal",
    name: "5. Αιθέρικη (Ethereal)",
    isLight: false,
    bgPage: "#060913",
    bgCard: "#0c1222",
    bgSubtle: "#141f36",
    borderPrimary: "#38bdf8",
    borderSubtle: "#1e3a8a",
    textPrimary: "#f0f9ff",
    textSecondary: "#bae6fd",
    textMuted: "#7dd3fc",
    accent: "#38bdf8",
    tableHeaderBg: "#112040",
    tableHeaderText: "#38bdf8",
    tableRowEven: "#090e1c",
    tableRowOdd: "#0d152a",
    badgeBg: "#13254b",
    badgeText: "#7dd3fc",
    badgeBorder: "#2563eb",
    meanderColor: "#38bdf8",
  },
  "cyber-tech": {
    id: "cyber-tech",
    name: "6. Τεχνολογίας (Cyber-Tech)",
    isLight: false,
    bgPage: "#080d14",
    bgCard: "#101724",
    bgSubtle: "#162133",
    borderPrimary: "#10b981",
    borderSubtle: "#064e3b",
    textPrimary: "#ecfeff",
    textSecondary: "#a7f3d0",
    textMuted: "#6ee7b7",
    accent: "#10b981",
    tableHeaderBg: "#122b24",
    tableHeaderText: "#10b981",
    tableRowEven: "#0c131f",
    tableRowOdd: "#101928",
    badgeBg: "#0e2e25",
    badgeText: "#34d399",
    badgeBorder: "#059669",
    meanderColor: "#10b981",
  },
};

// SVG Greek Meander pattern border component
const GreekMeanderBorder: React.FC<{ color: string; height?: number }> = ({
  color,
  height = 10,
}) => (
  <svg
    className="w-full select-none"
    style={{ height: `${height}px` }}
    viewBox="0 0 360 10"
    fill="none"
    preserveAspectRatio="repeat-x"
  >
    <defs>
      <pattern
        id={`meander-pat-${color.replace(/[^a-zA-Z0-9]/g, "")}`}
        x="0"
        y="0"
        width="20"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0,9 H9 V5 H4 V2 H13 V9 H20 V1 H2 V4 H11 V7 H18 V9"
          stroke={color}
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="square"
        />
      </pattern>
    </defs>
    <rect
      width="100%"
      height="10"
      fill={`url(#meander-pat-${color.replace(/[^a-zA-Z0-9]/g, "")})`}
      opacity="0.85"
    />
  </svg>
);

export const ArchivePdfExportModal: React.FC<ArchivePdfExportModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  filteredItems,
  selectedItemIds,
  currentAppTheme,
  currentAppFontId,
}) => {
  // Determine active initial theme and font
  const defaultTheme = currentAppTheme || getInitialTheme();
  const defaultFontId = currentAppFontId || getInitialAncientFont();

  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(defaultTheme);
  const [selectedFontId, setSelectedFontId] = useState<string>(defaultFontId);
  const [scope, setScope] = useState<ExportScope>(
    selectedItemIds.size > 0 ? "selected" : "all"
  );
  const [orientation, setOrientation] = useState<PaperOrientation>("portrait");
  const [itemsPerPage, setItemsPerPage] = useState<number>(14);

  // Metadata options
  const [docTitle, setDocTitle] = useState<string>(
    "ΘΗΣΑΥΡΟΣ ΛΕΞΑΡΙΘΜΩΝ & ΙΣΟΨΗΦΙΩΝ"
  );
  const [researcherName, setResearcherName] = useState<string>(
    "Ιωάννης Βελούδος"
  );
  const [subtitle, setSubtitle] = useState<string>(
    "Αρχείον Ελληνικής Ιωνικής Αριθμήσεως, Πυθμένων & Μυστικών Λόγων"
  );

  // Column / Section toggles
  const [includeStats, setIncludeStats] = useState<boolean>(true);
  const [includeNotes, setIncludeNotes] = useState<boolean>(true);
  const [includeCategory, setIncludeCategory] = useState<boolean>(true);
  const [includeGreekNumeral, setIncludeGreekNumeral] = useState<boolean>(true);
  const [includeRoot, setIncludeRoot] = useState<boolean>(true);

  // Action status
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [previewPage, setPreviewPage] = useState<number>(0);

  // Page container references for multi-page PDF generation
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync with current app theme when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentAppTheme) setSelectedTheme(currentAppTheme);
      if (currentAppFontId) setSelectedFontId(currentAppFontId);
    }
  }, [isOpen, currentAppTheme, currentAppFontId]);

  // Adjust items per page based on orientation & stats
  useEffect(() => {
    if (orientation === "landscape") {
      setItemsPerPage(11);
    } else {
      setItemsPerPage(14);
    }
  }, [orientation]);

  // Selected Font Object
  const selectedFont = useMemo(() => {
    return (
      ANCIENT_GREEK_FONTS.find((f) => f.id === selectedFontId) ||
      ANCIENT_GREEK_FONTS[0]
    );
  }, [selectedFontId]);

  // Selected Palette
  const palette = useMemo(() => {
    return THEME_PALETTES[selectedTheme] || THEME_PALETTES["dark-ancient"];
  }, [selectedTheme]);

  // Determine items to export based on scope
  const itemsToExport = useMemo(() => {
    switch (scope) {
      case "selected":
        return savedItems.filter((i) => selectedItemIds.has(i.id));
      case "words":
        return savedItems.filter((i) => !i.isPhrase);
      case "phrases":
        return savedItems.filter((i) => i.isPhrase);
      case "filtered":
        return filteredItems;
      case "all":
      default:
        return savedItems;
    }
  }, [scope, savedItems, filteredItems, selectedItemIds]);

  // Aggregated Statistics
  const stats = useMemo(() => {
    const totalCount = itemsToExport.length;
    const wordsCount = itemsToExport.filter((i) => !i.isPhrase).length;
    const phrasesCount = itemsToExport.filter((i) => i.isPhrase).length;
    const uniqueValues = new Set(itemsToExport.map((i) => i.value)).size;
    const values = itemsToExport.map((i) => i.value);
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const sumAll = values.reduce((acc, v) => acc + v, 0);
    const avgValue = totalCount > 0 ? Math.round(sumAll / totalCount) : 0;

    const rootCounts: Record<number, number> = {};
    for (let r = 1; r <= 9; r++) rootCounts[r] = 0;
    itemsToExport.forEach((i) => {
      const r = i.root || 1;
      rootCounts[r] = (rootCounts[r] || 0) + 1;
    });

    return {
      totalCount,
      wordsCount,
      phrasesCount,
      uniqueValues,
      maxValue,
      minValue,
      sumAll,
      avgValue,
      rootCounts,
    };
  }, [itemsToExport]);

  // Split items into pages
  // Page 1 gets fewer items if stats are shown
  const pagesData = useMemo(() => {
    if (itemsToExport.length === 0) return [[]];

    const firstPageCapacity = includeStats
      ? Math.max(6, itemsPerPage - 4)
      : itemsPerPage;
    const subsequentCapacity = itemsPerPage + 2;

    const pages: SavedIsopsephyItem[][] = [];
    let currentIdx = 0;

    // First page
    pages.push(itemsToExport.slice(0, firstPageCapacity));
    currentIdx += firstPageCapacity;

    // Subsequent pages
    while (currentIdx < itemsToExport.length) {
      pages.push(
        itemsToExport.slice(currentIdx, currentIdx + subsequentCapacity)
      );
      currentIdx += subsequentCapacity;
    }

    return pages;
  }, [itemsToExport, itemsPerPage, includeStats]);

  const totalPages = pagesData.length;

  // Formatted date string
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  if (!isOpen) return null;

  // Multi-page PDF Export via jsPDF & html-to-image
  const handleDownloadPdf = async () => {
    if (itemsToExport.length === 0) {
      alert("Δεν υπάρχουν στοιχεία προς εξαγωγή.");
      return;
    }

    setIsExportingPdf(true);
    setStatusMessage("Δημιουργία εγγράφου PDF υψηλής ευκρίνειας...");

    try {
      const isLandscape = orientation === "landscape";
      const pdf = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfPageWidth = isLandscape ? 297 : 210;
      const pdfPageHeight = isLandscape ? 210 : 297;

      for (let i = 0; i < pagesData.length; i++) {
        const pageEl = pageRefs.current[i];
        if (!pageEl) continue;

        setStatusMessage(`Επεξεργασία σελίδας ${i + 1} από ${pagesData.length}...`);

        const dataUrl = await toPng(pageEl, {
          cacheBust: true,
          pixelRatio: 2.2,
          quality: 1,
        });

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          dataUrl,
          "PNG",
          0,
          0,
          pdfPageWidth,
          pdfPageHeight,
          undefined,
          "FAST"
        );
      }

      const cleanTitle = docTitle
        .replace(/[^a-zA-Z0-9α-ωΑ-Ωά-ώΆ-Ώ]/g, "_")
        .slice(0, 32);
      pdf.save(`${cleanTitle || "Thesauros_Lexarithmon"}_${Date.now()}.pdf`);

      setStatusMessage("Το έγγραφο PDF δημιουργήθηκε και αποθηκεύτηκε επιτυχώς!");
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err) {
      console.error("PDF generation error:", err);
      setStatusMessage("Σφάλμα κατά τη δημιουργία του PDF. Παρακαλώ δοκιμάστε ξανά.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="archive-pdf-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl max-h-[96vh] bg-[#120f0c] border border-amber-800/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/60 bg-[#1a140e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-300 shadow-md">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100">
                  Εξαγωγή Θησαυρού σε Έγγραφο PDF
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50 font-mono">
                  {itemsToExport.length} στοιχεία
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#241a10] text-[#ffd700] border border-[#ffd700]/30 font-serif">
                  Θέμα: {palette.name}
                </span>
              </div>
              <p className="text-xs text-amber-300/70 font-sans">
                Κομψή μορφοποίηση A4 με μαίανδρο, πλήρη τυπογραφία και απόλυτη χρωματική αρμονία
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-black/40 hover:bg-amber-950 border border-amber-900/60 text-amber-300/80 hover:text-amber-100 transition-colors cursor-pointer"
              title="Κλείσιμο"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two columns (Left: Options, Right: Live Document Preview) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#0d0a08]">
          {/* Controls Sidebar (4 cols on lg) */}
          <div className="lg:col-span-4 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-amber-900/40 bg-[#16120e] space-y-5 overflow-y-auto max-h-[85vh] gold-scrollbar text-xs">
            {/* 1. Theme Selection */}
            <div className="space-y-2">
              <label className="font-serif font-bold text-amber-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  Χρωματικό Θέμα PDF
                </span>
                {selectedTheme === currentAppTheme && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-700/40">
                    Τρέχον Επιλεγμένο
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {APP_THEMES.map((th) => {
                  const isCur = selectedTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedTheme(th.id)}
                      className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isCur
                          ? "bg-amber-950/80 border-amber-400 text-amber-100 shadow-sm ring-1 ring-amber-400/40"
                          : "bg-black/30 hover:bg-black/50 border-amber-900/40 text-amber-300/70"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border"
                        style={{
                          backgroundColor: th.bgPreview,
                          borderColor: th.borderPreview,
                        }}
                      />
                      <span className="truncate text-[11px] font-serif">
                        {th.name.replace(/^\d+\.\s*/, "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Ancient Greek Typography */}
            <div className="space-y-2">
              <label className="font-serif font-bold text-amber-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  Αρχαιοελληνική Γραμματοσειρά
                </span>
                {selectedFontId === currentAppFontId && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-700/40">
                    Τρέχουσα
                  </span>
                )}
              </label>
              <select
                value={selectedFontId}
                onChange={(e) => setSelectedFontId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-amber-800/60 text-amber-100 font-serif text-xs outline-none focus:border-amber-400"
              >
                {ANCIENT_GREEK_FONTS.map((font) => (
                  <option key={font.id} value={font.id} className="bg-[#18130e] text-amber-100">
                    {font.name} — {font.category}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Export Scope */}
            <div className="space-y-2">
              <label className="font-serif font-bold text-amber-200 flex items-center gap-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                Πεδίο Εξαγωγής
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setScope("all")}
                  className={`px-2 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    scope === "all"
                      ? "bg-amber-950/90 border-amber-400 text-amber-100 font-bold"
                      : "bg-black/30 hover:bg-black/50 border-amber-900/40 text-amber-300/70"
                  }`}
                >
                  Όλα ({savedItems.length})
                </button>
                <button
                  type="button"
                  disabled={selectedItemIds.size === 0}
                  onClick={() => setScope("selected")}
                  className={`px-2 py-1.5 rounded-lg border text-left transition-colors ${
                    selectedItemIds.size === 0
                      ? "opacity-40 cursor-not-allowed border-amber-950 text-amber-400/40"
                      : scope === "selected"
                      ? "bg-amber-950/90 border-amber-400 text-amber-100 font-bold cursor-pointer"
                      : "bg-black/30 hover:bg-black/50 border-amber-900/40 text-amber-300/70 cursor-pointer"
                  }`}
                >
                  Επιλεγμένα ({selectedItemIds.size})
                </button>
                <button
                  type="button"
                  onClick={() => setScope("words")}
                  className={`px-2 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    scope === "words"
                      ? "bg-amber-950/90 border-amber-400 text-amber-100 font-bold"
                      : "bg-black/30 hover:bg-black/50 border-amber-900/40 text-amber-300/70"
                  }`}
                >
                  Μόνο Λέξεις ({savedItems.filter((i) => !i.isPhrase).length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope("phrases")}
                  className={`px-2 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    scope === "phrases"
                      ? "bg-amber-950/90 border-amber-400 text-amber-100 font-bold"
                      : "bg-black/30 hover:bg-black/50 border-amber-900/40 text-amber-300/70"
                  }`}
                >
                  Μόνο Φράσεις ({savedItems.filter((i) => i.isPhrase).length})
                </button>
              </div>
            </div>

            {/* 4. Paper Orientation */}
            <div className="space-y-2">
              <label className="font-serif font-bold text-amber-200 flex items-center gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Προσανατολισμός Σελίδας A4
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation("portrait")}
                  className={`px-3 py-1.5 rounded-lg border text-center font-serif transition-colors cursor-pointer ${
                    orientation === "portrait"
                      ? "bg-amber-950/90 border-amber-400 text-amber-100 font-bold"
                      : "bg-black/30 hover:bg-black/50 border-amber-900/40 text-amber-300/70"
                  }`}
                >
                  Κάθετος (Portrait)
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation("landscape")}
                  className={`px-3 py-1.5 rounded-lg border text-center font-serif transition-colors cursor-pointer ${
                    orientation === "landscape"
                      ? "bg-amber-950/90 border-amber-400 text-amber-100 font-bold"
                      : "bg-black/30 hover:bg-black/50 border-amber-900/40 text-amber-300/70"
                  }`}
                >
                  Οριζόντιος (Landscape)
                </button>
              </div>
            </div>

            {/* 5. Document Titles */}
            <div className="space-y-2">
              <label className="font-serif font-bold text-amber-200 flex items-center gap-1.5 text-xs">
                <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                Στοιχεία Εγγράφου
              </label>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] text-amber-300/60">Τίτλος Εγγράφου:</span>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-black/40 border border-amber-900/50 text-amber-100 text-xs font-serif outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-amber-300/60">Ερευνητής:</span>
                  <input
                    type="text"
                    value={researcherName}
                    onChange={(e) => setResearcherName(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-black/40 border border-amber-900/50 text-amber-100 text-xs font-serif outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-amber-300/60">Υπότιτλος:</span>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-black/40 border border-amber-900/50 text-amber-100 text-xs font-serif outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* 6. Content Elements Toggles */}
            <div className="space-y-2">
              <label className="font-serif font-bold text-amber-200 flex items-center gap-1.5 text-xs">
                <TableIcon className="w-3.5 h-3.5 text-amber-400" />
                Στήλες & Περιεχόμενο
              </label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-amber-300/80 hover:text-amber-100">
                  <input
                    type="checkbox"
                    checked={includeStats}
                    onChange={(e) => setIncludeStats(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Στατιστική Σύνοψη (Πυθμένες 1-9 & Μετρικές)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-amber-300/80 hover:text-amber-100">
                  <input
                    type="checkbox"
                    checked={includeNotes}
                    onChange={(e) => setIncludeNotes(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Στήλη Σημειώσεων & Αναλύσεων</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-amber-300/80 hover:text-amber-100">
                  <input
                    type="checkbox"
                    checked={includeGreekNumeral}
                    onChange={(e) => setIncludeGreekNumeral(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Ιωνικό Αριθμητικό Σύστημα</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-amber-300/80 hover:text-amber-100">
                  <input
                    type="checkbox"
                    checked={includeRoot}
                    onChange={(e) => setIncludeRoot(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Πυθαγόρειος Πυθμήν (Ρίζα 1-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-amber-300/80 hover:text-amber-100">
                  <input
                    type="checkbox"
                    checked={includeCategory}
                    onChange={(e) => setIncludeCategory(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Κατηγορία Στοιχείου</span>
                </label>
              </div>
            </div>

            {/* Actions Bar inside sidebar */}
            <div className="pt-2 border-t border-amber-900/40 space-y-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf || itemsToExport.length === 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-[#181109] font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-900/40 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isExportingPdf ? "Δημιουργία PDF..." : "Λήψη Εγγράφου PDF (A4)"}
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-2 px-3 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-700/50 text-amber-200 text-xs font-serif flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                Εκτύπωση (Native Print)
              </button>
            </div>

            {statusMessage && (
              <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-700/50 text-amber-200 text-[11px] text-center font-serif animate-fadeIn">
                {statusMessage}
              </div>
            )}
          </div>

          {/* Document Preview Pane (8 cols on lg) */}
          <div className="lg:col-span-8 p-3 sm:p-6 bg-[#0a0806] flex flex-col items-center overflow-y-auto max-h-[85vh] gold-scrollbar">
            {/* Pagination Navigator */}
            {totalPages > 1 && (
              <div className="mb-4 flex items-center gap-2 bg-[#18130e] px-3 py-1.5 rounded-xl border border-amber-900/60 text-xs font-serif">
                <span className="text-amber-300/70">Προεπισκόπηση:</span>
                {pagesData.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewPage(idx)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      previewPage === idx
                        ? "bg-amber-600 text-[#140e08] font-bold"
                        : "bg-black/30 hover:bg-amber-950 text-amber-300"
                    }`}
                  >
                    Σελ. {idx + 1}
                  </button>
                ))}
                <span className="text-amber-400/50">| Σύνολο: {totalPages} σελίδες</span>
              </div>
            )}

            {/* Container for All Rendered Pages (used for jsPDF capture) */}
            <div className="space-y-8 w-full flex flex-col items-center">
              {pagesData.map((pageItems, pageIdx) => {
                const isFirstPage = pageIdx === 0;
                const isCurrentPreview = previewPage === pageIdx;

                return (
                  <div
                    key={pageIdx}
                    ref={(el) => {
                      pageRefs.current[pageIdx] = el;
                    }}
                    className={`relative shadow-2xl transition-transform border ${
                      totalPages > 1 && !isCurrentPreview ? "hidden lg:block opacity-90 scale-[0.98]" : "block"
                    }`}
                    style={{
                      width: orientation === "landscape" ? "1060px" : "780px",
                      minHeight: orientation === "landscape" ? "750px" : "1060px",
                      backgroundColor: palette.bgPage,
                      borderColor: palette.borderPrimary,
                      color: palette.textPrimary,
                      fontFamily: selectedFont.fontFamily,
                      padding: orientation === "landscape" ? "24px 32px" : "32px 36px",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Top Outer Meander Border */}
                    <div className="mb-3">
                      <GreekMeanderBorder color={palette.meanderColor} height={10} />
                    </div>

                    {/* Page Header */}
                    {isFirstPage ? (
                      <div
                        className="p-4 rounded-xl mb-4 border text-center"
                        style={{
                          backgroundColor: palette.bgCard,
                          borderColor: palette.borderPrimary,
                        }}
                      >
                        <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: palette.borderSubtle }}>
                          <span className="text-[10px] uppercase tracking-wider font-mono" style={{ color: palette.accent }}>
                            ✦ ΑΡΧΕΙΟΝ ΛΕΞΑΡΙΘΜΩΝ ✦
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: palette.textMuted }}>
                            {formattedDate}
                          </span>
                        </div>

                        <h1
                          className="text-lg sm:text-xl font-bold tracking-wide uppercase mb-1"
                          style={{ color: palette.textPrimary }}
                        >
                          {docTitle}
                        </h1>
                        <p className="text-xs italic mb-2" style={{ color: palette.textSecondary }}>
                          {subtitle}
                        </p>

                        <div className="flex items-center justify-center gap-4 flex-wrap text-[11px] pt-1">
                          <span style={{ color: palette.textMuted }}>
                            Ερευνητής: <strong style={{ color: palette.textPrimary }}>{researcherName}</strong>
                          </span>
                          <span style={{ color: palette.textMuted }}>•</span>
                          <span style={{ color: palette.textMuted }}>
                            Σύνολο Στοιχείων: <strong style={{ color: palette.accent }}>{stats.totalCount}</strong>
                          </span>
                          <span style={{ color: palette.textMuted }}>•</span>
                          <span style={{ color: palette.textMuted }}>
                            Μοναδικοί Λεξάριθμοι: <strong style={{ color: palette.textPrimary }}>{stats.uniqueValues}</strong>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between pb-2 mb-3 border-b text-[11px]"
                        style={{ borderColor: palette.borderSubtle, color: palette.textMuted }}
                      >
                        <span className="font-bold uppercase tracking-wide" style={{ color: palette.textPrimary }}>
                          {docTitle} — <span style={{ color: palette.accent }}>Συνέχεια Αρχείου</span>
                        </span>
                        <span className="font-mono">
                          Σελίδα {pageIdx + 1} από {totalPages}
                        </span>
                      </div>
                    )}

                    {/* Optional Statistics Dashboard (Only on Page 1) */}
                    {isFirstPage && includeStats && (
                      <div
                        className="p-3 rounded-xl mb-4 border text-xs grid grid-cols-2 sm:grid-cols-4 gap-2"
                        style={{
                          backgroundColor: palette.bgSubtle,
                          borderColor: palette.borderSubtle,
                        }}
                      >
                        <div className="p-2 rounded-lg" style={{ backgroundColor: palette.bgCard }}>
                          <div className="text-[10px]" style={{ color: palette.textMuted }}>Μεμονωμένες Λέξεις</div>
                          <div className="font-bold text-sm" style={{ color: palette.accent }}>{stats.wordsCount}</div>
                        </div>
                        <div className="p-2 rounded-lg" style={{ backgroundColor: palette.bgCard }}>
                          <div className="text-[10px]" style={{ color: palette.textMuted }}>Πολυλεκτικές Φράσεις</div>
                          <div className="font-bold text-sm" style={{ color: palette.accent }}>{stats.phrasesCount}</div>
                        </div>
                        <div className="p-2 rounded-lg" style={{ backgroundColor: palette.bgCard }}>
                          <div className="text-[10px]" style={{ color: palette.textMuted }}>Μέγιστος / Ελάχιστος</div>
                          <div className="font-bold text-sm" style={{ color: palette.textPrimary }}>
                            {stats.maxValue} / {stats.minValue}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg" style={{ backgroundColor: palette.bgCard }}>
                          <div className="text-[10px]" style={{ color: palette.textMuted }}>Μέσος Όρος Αξίας</div>
                          <div className="font-bold text-sm" style={{ color: palette.textPrimary }}>{stats.avgValue}</div>
                        </div>

                        {/* Pythagorean Root Frequency Bar */}
                        <div
                          className="col-span-2 sm:col-span-4 p-2 rounded-lg border flex items-center justify-between gap-1 flex-wrap"
                          style={{
                            backgroundColor: palette.bgCard,
                            borderColor: palette.borderSubtle,
                          }}
                        >
                          <span className="text-[10px] font-bold shrink-0" style={{ color: palette.textSecondary }}>
                            Πυθμένες (1-9):
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => {
                              const count = stats.rootCounts[r] || 0;
                              return (
                                <span
                                  key={r}
                                  className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                                  style={{
                                    backgroundColor: count > 0 ? palette.badgeBg : palette.bgSubtle,
                                    color: count > 0 ? palette.badgeText : palette.textMuted,
                                    border: `1px solid ${palette.badgeBorder}`,
                                  }}
                                >
                                  {r}: <strong>{count}</strong>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Table of Saved Items */}
                    <div className="overflow-hidden rounded-xl border mb-4" style={{ borderColor: palette.borderPrimary }}>
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: palette.tableHeaderBg,
                              color: palette.tableHeaderText,
                              borderBottom: `2px solid ${palette.borderPrimary}`,
                            }}
                          >
                            <th className="py-2 px-2.5 font-bold font-mono text-[10px] text-center w-9">#</th>
                            <th className="py-2 px-3 font-bold uppercase tracking-wider">
                              Λέξη / Φράση
                            </th>
                            <th className="py-2 px-3 font-bold text-right uppercase tracking-wider font-mono">
                              Λεξάριθμος
                            </th>
                            {includeGreekNumeral && (
                              <th className="py-2 px-2.5 font-bold text-center uppercase tracking-wider font-serif">
                                Ιωνικό
                              </th>
                            )}
                            {includeRoot && (
                              <th className="py-2 px-2 font-bold text-center uppercase tracking-wider font-mono">
                                Πυθμήν
                              </th>
                            )}
                            {includeCategory && (
                              <th className="py-2 px-2.5 font-bold uppercase tracking-wider text-[11px]">
                                Κατηγορία
                              </th>
                            )}
                            {includeNotes && (
                              <th className="py-2 px-3 font-bold uppercase tracking-wider text-[11px]">
                                Σημειώσεις / Ανάλυση
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {pageItems.map((item, idx) => {
                            const globalIdx =
                              pageIdx === 0
                                ? idx + 1
                                : (includeStats
                                    ? Math.max(6, itemsPerPage - 4)
                                    : itemsPerPage) +
                                  (pageIdx - 1) * (itemsPerPage + 2) +
                                  idx +
                                  1;

                            const rowBg = idx % 2 === 0 ? palette.tableRowEven : palette.tableRowOdd;

                            return (
                              <tr
                                key={item.id || idx}
                                style={{
                                  backgroundColor: rowBg,
                                  borderBottom: `1px solid ${palette.borderSubtle}`,
                                }}
                              >
                                <td
                                  className="py-2 px-2.5 text-center font-mono text-[10px]"
                                  style={{ color: palette.textMuted }}
                                >
                                  {globalIdx}
                                </td>
                                <td className="py-2 px-3">
                                  <div
                                    className="font-bold text-sm tracking-wide"
                                    style={{
                                      color: palette.textPrimary,
                                      fontFamily: selectedFont.fontFamily,
                                    }}
                                  >
                                    {item.text}
                                  </div>
                                  {item.isPhrase && (
                                    <span
                                      className="text-[9px] font-sans px-1 rounded"
                                      style={{
                                        backgroundColor: palette.bgSubtle,
                                        color: palette.textMuted,
                                      }}
                                    >
                                      Φράση ({item.wordCount} λέξεις)
                                    </span>
                                  )}
                                </td>
                                <td
                                  className="py-2 px-3 text-right font-mono font-bold text-sm"
                                  style={{ color: palette.accent }}
                                >
                                  {item.value.toLocaleString("el-GR")}
                                </td>
                                {includeGreekNumeral && (
                                  <td
                                    className="py-2 px-2.5 text-center font-serif text-xs font-semibold"
                                    style={{ color: palette.textSecondary }}
                                  >
                                    {item.greekNumeral || "-"}
                                  </td>
                                )}
                                {includeRoot && (
                                  <td className="py-2 px-2 text-center font-mono font-bold text-xs">
                                    <span
                                      className="inline-block w-5 h-5 rounded-full text-center leading-5"
                                      style={{
                                        backgroundColor: palette.badgeBg,
                                        color: palette.badgeText,
                                        border: `1px solid ${palette.badgeBorder}`,
                                      }}
                                    >
                                      {item.root}
                                    </span>
                                  </td>
                                )}
                                {includeCategory && (
                                  <td
                                    className="py-2 px-2.5 text-[11px] truncate max-w-[120px]"
                                    style={{ color: palette.textSecondary }}
                                  >
                                    {item.category || "Γενικά"}
                                  </td>
                                )}
                                {includeNotes && (
                                  <td
                                    className="py-2 px-3 text-[11px] leading-relaxed max-w-[240px]"
                                    style={{ color: palette.textSecondary }}
                                  >
                                    {item.notes || "-"}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Page Footer */}
                    <div className="mt-auto pt-2">
                      <div className="mb-2">
                        <GreekMeanderBorder color={palette.meanderColor} height={8} />
                      </div>
                      <div
                        className="flex items-center justify-between text-[10px] font-serif"
                        style={{ color: palette.textMuted }}
                      >
                        <span>
                          Εφαρμογή «Λεξάριθμος - Ελληνική Ιωνική Ισοψηφία»
                        </span>
                        <span className="font-mono">
                          Σελίδα {pageIdx + 1} από {totalPages}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="p-3 sm:p-4 border-t border-amber-900/60 bg-[#16120e] flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-amber-300/70 font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Προσαρμόστηκε αυτόματα στο θέμα <strong>«{palette.name}»</strong> και γραμματοσειρά <strong>«{selectedFont.name}»</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-black/40 hover:bg-amber-950 border border-amber-900/60 text-amber-300 text-xs font-serif transition-colors cursor-pointer"
            >
              Κλείσιμο
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf || itemsToExport.length === 0}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-[#181109] font-serif font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-900/40 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isExportingPdf ? "Δημιουργία PDF..." : "Λήψη PDF (A4)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
