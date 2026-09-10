import React, { useState, useRef } from "react";
import { toPng, toBlob } from "html-to-image";
import {
  Download,
  Copy,
  Share2,
  Check,
  X,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Layers,
  Hash,
  Eye,
  Settings,
  RefreshCw,
} from "lucide-react";
import { NumberingSystem } from "../types";

export interface ExportCardImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  expression: string;
  totalValue: number;
  greekNumeral?: string;
  system: NumberingSystem;
  systemName: string;
  mathProps: {
    pythmen: number;
    isPrime?: boolean;
    isTriangular?: boolean;
    triangularRoot?: number;
    isSquare?: boolean;
    squareRoot?: number;
    isEven?: boolean;
    divisors?: number[];
  };
  wordBreakdowns: Array<{
    rawWord: string;
    normalizedWord: string;
    value: number;
    root: number;
    letters: Array<{ char: string; originalChar: string; value: number }>;
  }>;
  stepsExplanation?: string;
}

type CardTheme = "dark-gold" | "parchment" | "solar" | "cosmic";
type CardAspect = "square" | "landscape" | "story" | "auto";

export const ExportCardImageModal: React.FC<ExportCardImageModalProps> = ({
  isOpen,
  onClose,
  expression,
  totalValue,
  greekNumeral,
  system,
  systemName,
  mathProps,
  wordBreakdowns,
  stepsExplanation,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<CardTheme>("dark-gold");
  const [aspect, setAspect] = useState<CardAspect>("landscape");
  const [showLetterBreakdown, setShowLetterBreakdown] = useState<boolean>(true);
  const [showMathProps, setShowMathProps] = useState<boolean>(true);
  const [showGreekNumeral, setShowGreekNumeral] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(true);
  const [researcherSignature, setResearcherSignature] = useState<string>("Ελληνική Ισοψηφία & Λεξάριθμοι");

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!isOpen) return null;

  const isEnglish =
    system === NumberingSystem.ENGLISH_BASE6 || system === NumberingSystem.ENGLISH_SIMPLE;

  const dateFormatted = new Date().toLocaleDateString("el-GR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getCleanFileName = () => {
    const cleanExpr = expression
      .trim()
      .replace(/[^a-zA-Z0-9α-ωΑ-Ωά-ώΆ-Ώ]/g, "_")
      .slice(0, 24);
    return `isopsephy-${cleanExpr || "card"}-${totalValue}.png`;
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setErrorMessage("");
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = getCleanFileName();
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("PNG export error:", err);
      setErrorMessage("Παρουσιάστηκε σφάλμα κατά τη δημιουργία της εικόνας PNG.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setErrorMessage("");
    try {
      const blob = await toBlob(cardRef.current, {
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
        setTimeout(() => setCopiedSuccess(false), 2500);
      } else {
        // Fallback to downloading
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = getCleanFileName();
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Copy image error:", err);
      setErrorMessage("Η αντιγραφή εικόνας δεν υποστηρίζεται απευθείας. Χρησιμοποιήστε «Λήψη PNG».");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareNative = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setErrorMessage("");
    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
      });
      if (!blob) throw new Error("Could not create blob");

      const file = new File([blob], getCleanFileName(), { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Ισοψηφία: ${expression} = ${totalValue}`,
          text: `Υπολογισμός Ισοψηφίας & Λεξαρίθμου: ${expression} = ${totalValue} (Πυθμένας: ${mathProps.pythmen})`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Ισοψηφία: ${expression} = ${totalValue}`,
          text: `Υπολογισμός Ισοψηφίας: ${expression} = ${totalValue} [${greekNumeral || ""}] - Σύστημα: ${systemName}`,
        });
      } else {
        handleDownloadPng();
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("Share error:", err);
        handleDownloadPng();
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Card Aspect Ratio dimension styling
  const getAspectContainerClass = () => {
    switch (aspect) {
      case "square":
        return "w-full max-w-[500px] aspect-square";
      case "story":
        return "w-full max-w-[420px] aspect-[9/16]";
      case "landscape":
        return "w-full max-w-[620px] aspect-[1.91/1]";
      case "auto":
      default:
        return "w-full max-w-[560px] min-h-[380px]";
    }
  };

  // Theme styling rules for the exported canvas
  const getThemeStyles = () => {
    switch (theme) {
      case "parchment":
        return {
          bg: "bg-[#fbf7ee]",
          border: "border-2 border-[#b89758]",
          textPrimary: "text-[#2a1b0c]",
          textSecondary: "text-[#73512e]",
          accent: "text-[#9e6f21]",
          numGrad: "from-[#6e460e] via-[#9e6f21] to-[#b88628]",
          badgeBg: "bg-[#f0e4cc] border-[#b89758]/50 text-[#543513]",
          innerCard: "bg-[#f5ebd7] border-[#d8c5a4]",
          watermarkText: "text-[#b89758]/40",
          glowColor: "rgba(184, 151, 88, 0.15)",
        };
      case "solar":
        return {
          bg: "bg-gradient-to-br from-[#fffdf5] via-[#fff5d6] to-[#ffeed0]",
          border: "border-2 border-[#e69d00]",
          textPrimary: "text-[#2d1900]",
          textSecondary: "text-[#874f00]",
          accent: "text-[#d97706]",
          numGrad: "from-[#b45309] via-[#d97706] to-[#f59e0b]",
          badgeBg: "bg-[#fde68a]/60 border-[#f59e0b]/50 text-[#78350f]",
          innerCard: "bg-[#fffbeb] border-[#fde68a]",
          watermarkText: "text-[#f59e0b]/30",
          glowColor: "rgba(245, 158, 11, 0.2)",
        };
      case "cosmic":
        return {
          bg: "bg-gradient-to-b from-[#060b18] via-[#0b1329] to-[#040814]",
          border: "border-2 border-[#38bdf8]/60",
          textPrimary: "text-[#f0f9ff]",
          textSecondary: "text-[#7dd3fc]",
          accent: "text-[#38bdf8]",
          numGrad: "from-[#38bdf8] via-[#67e8f9] to-[#a5f3fc]",
          badgeBg: "bg-[#0c2340] border-[#38bdf8]/40 text-[#bae6fd]",
          innerCard: "bg-[#09152b] border-[#1e3a5f]",
          watermarkText: "text-[#38bdf8]/20",
          glowColor: "rgba(56, 189, 248, 0.25)",
        };
      case "dark-gold":
      default:
        return {
          bg: "bg-gradient-to-b from-[#181410] via-[#120f0c] to-[#0a0806]",
          border: "border-2 border-[#d4af37]",
          textPrimary: "text-[#fdfaf2]",
          textSecondary: "text-[#a89984]",
          accent: "text-[#e6c670]",
          numGrad: "from-[#fef0cd] via-[#e6c670] to-[#c89b3c]",
          badgeBg: "bg-[#251d14] border-[#594223] text-[#f5ebd8]",
          innerCard: "bg-[#16120e] border-[#332617]",
          watermarkText: "text-[#d4af37]/20",
          glowColor: "rgba(212, 175, 55, 0.2)",
        };
    }
  };

  const tStyles = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#14110e] border border-[#3e3223] rounded-2xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2d2419] flex items-center justify-between bg-[#191511] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#292015] border border-[#523e25] text-[#e6c670]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
                <span>Εξαγωγή Κάρτας ως Εικόνα (PNG)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2e2316] text-[#ffd700] border border-[#4d3a22]">
                  Social Media Ready
                </span>
              </h2>
              <p className="text-xs text-[#a69680]">
                Δημιουργήστε κάρτα υψηλής ανάλυσης για εύκολη κοινοποίηση σε Instagram, X, Facebook, Viber & WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c7e6c] hover:text-[#f5ecd8] hover:bg-[#251d16] transition-colors"
            title="Κλείσιμο"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Theme Selector */}
            <div className="p-3.5 rounded-xl bg-[#1a1511] border border-[#2d2419] space-y-2">
              <label className="text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1.5 uppercase tracking-wider">
                <Palette className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Αισθητικό Θέμα Κάρτας</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "dark-gold" as CardTheme, label: "Χρυσό & Οψιδιανός", icon: "🏛️" },
                  { id: "parchment" as CardTheme, label: "Αρχαία Περγαμηνή", icon: "📜" },
                  { id: "solar" as CardTheme, label: "Ηλιακός Απόλλων", icon: "☀️" },
                  { id: "cosmic" as CardTheme, label: "Κοσμικό Αιθέριο", icon: "🌌" },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-serif transition-all border flex items-center gap-2 cursor-pointer ${
                      theme === th.id
                        ? "bg-[#2d2216] border-[#ffd700] text-[#f5ecd8] ring-1 ring-[#ffd700]/40 font-bold"
                        : "bg-[#14110e] border-[#292017] hover:bg-[#1f1913] text-[#a69680]"
                    }`}
                  >
                    <span className="text-sm">{th.icon}</span>
                    <span>{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio / Format Selector */}
            <div className="p-3.5 rounded-xl bg-[#1a1511] border border-[#2d2419] space-y-2">
              <label className="text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Μορφή & Διαστάσεις Κοινοποίησης</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "landscape" as CardAspect, label: "Τοπίο (1.91:1)", desc: "X, Facebook, Feed" },
                  { id: "square" as CardAspect, label: "Τετράγωνο (1:1)", desc: "Instagram, Threads" },
                  { id: "story" as CardAspect, label: "Ιστορία (9:16)", desc: "Stories, TikTok" },
                  { id: "auto" as CardAspect, label: "Συμπαγές (Auto)", desc: "Κλασική Κάρτα" },
                ].map((asp) => (
                  <button
                    key={asp.id}
                    type="button"
                    onClick={() => setAspect(asp.id)}
                    className={`p-2.5 rounded-xl text-left text-xs font-serif transition-all border cursor-pointer ${
                      aspect === asp.id
                        ? "bg-[#2d2216] border-[#ffd700] text-[#f5ecd8] ring-1 ring-[#ffd700]/40 font-bold"
                        : "bg-[#14110e] border-[#292017] hover:bg-[#1f1913] text-[#a69680]"
                    }`}
                  >
                    <div className="font-semibold">{asp.label}</div>
                    <div className="text-[10px] text-[#7d7061] mt-0.5">{asp.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Options */}
            <div className="p-3.5 rounded-xl bg-[#1a1511] border border-[#2d2419] space-y-2.5">
              <label className="text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1.5 uppercase tracking-wider">
                <Settings className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Στοιχεία Κάρτας</span>
              </label>

              <div className="space-y-2 text-xs font-serif">
                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLetterBreakdown}
                    onChange={(e) => setShowLetterBreakdown(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Αποδόμηση & Άθροισμα Γραμμάτων</span>
                </label>

                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMathProps}
                    onChange={(e) => setShowMathProps(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Μαθηματικές Ιδιότητες (Πυθμένας, Πρώτος, Τρίγωνος κ.λπ.)</span>
                </label>

                {greekNumeral && (
                  <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGreekNumeral}
                      onChange={(e) => setShowGreekNumeral(e.target.checked)}
                      className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                    />
                    <span>Εμφάνιση Ιωνικού Αριθμού ({greekNumeral})</span>
                  </label>
                )}

                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => setShowWatermark(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Υδατογράφημα / Υπογραφή Εφαρμογής</span>
                </label>

                <label className="flex items-center gap-2 text-[#d6c7b2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                    className="rounded border-[#443625] text-[#c89b3c] focus:ring-[#c89b3c] bg-[#14110e]"
                  />
                  <span>Ημερομηνία Έκδοσης</span>
                </label>
              </div>

              {showWatermark && (
                <div className="pt-2 border-t border-[#292017]">
                  <label className="text-[11px] text-[#8c7e6c] font-serif block mb-1">
                    Κείμενο Υπογραφής / Ερευνητή:
                  </label>
                  <input
                    type="text"
                    value={researcherSignature}
                    onChange={(e) => setResearcherSignature(e.target.value)}
                    placeholder="π.χ. Ιωάννης Βελούδος / Λεξάριθμος"
                    className="w-full px-2.5 py-1.5 bg-[#12100e] border border-[#3e3020] rounded-lg text-xs font-serif text-[#f5ecd8] focus:border-[#c89b3c] outline-none"
                  />
                </div>
              )}
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Live Preview Column (Right) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-serif text-[#8c7e6c] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span>Ζωντανή Προεπισκόπηση Κάρτας</span>
              </span>
              <span className="text-[10px] font-mono text-[#a69680]">
                2x Retina PNG Render
              </span>
            </div>

            {/* Container where the rendered card lives */}
            <div className="w-full bg-[#0b0a08] p-3 sm:p-4 rounded-2xl border border-[#2a2218] flex items-center justify-center overflow-hidden shadow-inner">
              
              {/* THE EXPORTABLE CARD NODE */}
              <div
                ref={cardRef}
                className={`${getAspectContainerClass()} ${tStyles.bg} ${tStyles.border} rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-2xl transition-all select-none`}
                style={{
                  boxShadow: `0 20px 40px -15px ${tStyles.glowColor}`,
                }}
              >
                {/* Decorative Greek Meander / Corner Accents */}
                <div
                  className="absolute top-2 left-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: theme === "parchment" ? "#9e6f21" : "#ffd700" }}
                >
                  ╔════
                </div>
                <div
                  className="absolute top-2 right-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: theme === "parchment" ? "#9e6f21" : "#ffd700" }}
                >
                  ════╗
                </div>
                <div
                  className="absolute bottom-2 left-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: theme === "parchment" ? "#9e6f21" : "#ffd700" }}
                >
                  ╚════
                </div>
                <div
                  className="absolute bottom-2 right-2 text-xs font-serif opacity-30 pointer-events-none"
                  style={{ color: theme === "parchment" ? "#9e6f21" : "#ffd700" }}
                >
                  ════╝
                </div>

                {/* Big Background Watermark Numeral */}
                <div
                  className={`absolute right-4 bottom-2 text-[120px] sm:text-[140px] font-serif font-black ${tStyles.watermarkText} pointer-events-none select-none leading-none`}
                >
                  {greekNumeral || (isEnglish ? "G" : "Ω")}
                </div>

                {/* Top Card Header: App Branding & System */}
                <div className="flex items-center justify-between gap-2 relative z-10 border-b pb-3 border-current/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base">🏛️</span>
                    <div>
                      <div className={`text-xs font-serif font-bold uppercase tracking-wider ${tStyles.accent}`}>
                        ΛΕΞΑΡΙΘΜΟΣ • ΙΣΟΨΗΦΙΑ
                      </div>
                      <div className={`text-[10px] font-mono ${tStyles.textSecondary}`}>
                        {systemName.split("(")[0]}
                      </div>
                    </div>
                  </div>

                  {showDate && (
                    <div className={`text-[10px] font-mono ${tStyles.textSecondary}`}>
                      {dateFormatted}
                    </div>
                  )}
                </div>

                {/* Main Content Area */}
                <div className="my-auto py-4 relative z-10 space-y-4">
                  
                  {/* Phrase / Word Display */}
                  <div>
                    <div className={`text-[11px] font-mono uppercase tracking-widest ${tStyles.textSecondary}`}>
                      {isEnglish ? "Αγγλική Έκφραση (Ισοψηφία)" : "Ελληνική Έκφραση / Λέξη"}
                    </div>
                    <div
                      className={`text-xl sm:text-3xl font-ancient-greek font-black tracking-wide ${tStyles.textPrimary} mt-0.5 break-words`}
                    >
                      «{expression.trim()}»
                    </div>
                  </div>

                  {/* Big Number & Numeral Hero Block */}
                  <div className="flex flex-wrap items-baseline gap-4">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-5xl sm:text-6xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${tStyles.numGrad} drop-shadow-sm`}
                      >
                        {totalValue.toLocaleString("el-GR")}
                      </span>
                    </div>

                    {showGreekNumeral && greekNumeral && (
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${tStyles.badgeBg} shadow-sm`}
                      >
                        <span className="text-[10px] font-sans opacity-70">Ιωνικό:</span>
                        <span className="text-base sm:text-lg font-serif font-bold tracking-wider">
                          {greekNumeral}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mathematical Properties Badges */}
                  {showMathProps && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] font-mono font-semibold ${tStyles.badgeBg}`}
                      >
                        <span className="opacity-70">Πυθμένας:</span>
                        <span className="font-bold">{mathProps.pythmen}</span>
                      </div>
                      {mathProps.isPrime && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-900/30 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-[10px] font-mono font-bold">
                          Πρώτος Αριθμός
                        </span>
                      )}
                      {mathProps.isTriangular && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-900/30 border border-amber-500/40 text-amber-600 dark:text-amber-300 text-[10px] font-mono font-bold">
                          Τρίγωνος (T{mathProps.triangularRoot})
                        </span>
                      )}
                      {mathProps.isSquare && (
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-900/30 border border-indigo-500/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-mono font-bold">
                          Τετράγωνος ({mathProps.squareRoot}²)
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono ${tStyles.badgeBg}`}>
                        {mathProps.isEven ? "Άρτιος" : "Περιττός"}
                      </span>
                    </div>
                  )}

                  {/* Letter Breakdown Formula */}
                  {showLetterBreakdown && wordBreakdowns.length > 0 && (
                    <div
                      className={`p-2.5 rounded-xl border ${tStyles.innerCard} text-[11px] font-mono space-y-1`}
                    >
                      <div className={`text-[10px] font-serif font-bold uppercase tracking-wider ${tStyles.textSecondary}`}>
                        Ανάλυση Γραμμάτων & Αθροίσματος:
                      </div>
                      <div className={`${tStyles.textPrimary} break-words leading-relaxed font-semibold`}>
                        {wordBreakdowns
                          .flatMap((wb) => wb.letters.map((l) => `${l.char}(${l.value})`))
                          .join(" + ")}{" "}
                        = <span className={`${tStyles.accent} font-bold`}>{totalValue}</span>
                      </div>
                    </div>
                  )}

                  {stepsExplanation && (
                    <div className={`text-[10px] font-mono ${tStyles.textSecondary} italic truncate`}>
                      {stepsExplanation}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer: Watermark & Attribution */}
                {showWatermark && (
                  <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-serif relative z-10">
                    <span className={`${tStyles.textSecondary} font-semibold flex items-center gap-1`}>
                      <span>✨</span>
                      <span>{researcherSignature || "Ελληνική Ισοψηφία & Λεξάριθμοι"}</span>
                    </span>
                    <span className={`${tStyles.accent} font-mono text-[9px]`}>
                      #Isopsephy #Lexarithms #{totalValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-[#2d2419] bg-[#191511] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#8c7e6c] font-serif hidden sm:block">
            Υψηλή πιστότητα (2x Resolution PNG) • Ιδανικό για αποθήκευση και αναρτήσεις
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Copy to Clipboard */}
            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isExporting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#251d15] hover:bg-[#34271c] border border-[#443625] text-xs font-serif text-[#d6c7b2] transition-all cursor-pointer disabled:opacity-50"
              title="Αντιγραφή εικόνας στο Πρόχειρο"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Αντιγράφηκε!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#c89b3c]" />
                  <span>Αντιγραφή Εικόνας</span>
                </>
              )}
            </button>

            {/* Native Share (Web Share API) */}
            <button
              type="button"
              onClick={handleShareNative}
              disabled={isExporting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#282015] hover:bg-[#382b1c] border border-[#c89b3c]/40 text-xs font-serif text-[#e6c670] transition-all cursor-pointer disabled:opacity-50"
              title="Κοινοποίηση σε εφαρμογές"
            >
              <Share2 className="w-4 h-4" />
              <span>Κοινοποίηση</span>
            </button>

            {/* Primary Download Button */}
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a6825] via-[#c89b3c] to-[#dbaa42] hover:from-[#a0792c] hover:to-[#ebbb4e] text-[#120f0c] text-xs sm:text-sm font-bold font-serif shadow-lg shadow-[#c89b3c]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#120f0c]" />
                  <span>Δημιουργία PNG...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 font-black" />
                  <span>Λήφθηκε Επιτυχώς!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#120f0c]" />
                  <span>Λήψη Εικόνας (PNG)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
