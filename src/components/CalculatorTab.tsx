import React, { useState } from "react";
import {
  evaluateIsopsephyExpression,
  numberToGreekNumeral,
  getMathematicalProperties,
  getAlphabetChart,
} from "../utils/isopsephy";
import { SavedIsopsephyItem, NumberingSystem } from "../types";
import { formatEnglishItemWithGreekTranslation } from "../utils/translation";
import { GoldenRatioGaugeTool } from "./GoldenRatioGaugeTool";
import { PythagoreanMonochordAudio } from "./PythagoreanMonochordAudio";
import { ExportCardImageModal } from "./ExportCardImageModal";
import { pythagoreanSynth, foldToAudibleSpectrum } from "../utils/pythagoreanAudio";
import {
  Bookmark,
  Copy,
  Check,
  Sparkles,
  Trash2,
  ArrowRight,
  Info,
  HelpCircle,
  Hash,
  Layers,
  Table,
  ChevronDown,
  ChevronUp,
  Volume2,
  Radio,
  Music,
  Moon,
  Scroll,
  Feather,
  Sun,
  Palette,
  Cpu,
  Share2,
  Image as ImageIcon,
  ListOrdered,
  AlignLeft,
} from "lucide-react";

interface CalculatorTabProps {
  onSaveItem: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
  savedItems: SavedIsopsephyItem[];
  theme?: string;
  onToggleTheme?: () => void;
  onOpenThemeModal?: () => void;
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  onSaveItem,
  onOpenAiModal,
  savedItems,
  theme = "dark-ancient",
  onToggleTheme,
  onOpenThemeModal,
}) => {
  const [selectedSystem, setSelectedSystem] = useState<NumberingSystem>(NumberingSystem.IONIAN);
  const [inputExpression, setInputExpression] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showAlphabetChart, setShowAlphabetChart] = useState<boolean>(false);
  const [showLetterBreakdown, setShowLetterBreakdown] = useState<boolean>(false);
  const [isExportImageModalOpen, setIsExportImageModalOpen] = useState<boolean>(false);
  const [recentHistory, setRecentHistory] = useState<string[]>([
    "ΙΩΑΝΝΗΣ",
    "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ",
    "ΛΑΥΡΕΙΟΝ",
    "ΑΜΑΡΤΙΑ",
    "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ",
    "ΙΗΣΟΥΣ",
    "ΧΡΙΣΤΟΣ",
  ]);

  const isEnglishSystem =
    selectedSystem === NumberingSystem.ENGLISH_BASE6 ||
    selectedSystem === NumberingSystem.ENGLISH_SIMPLE;

  const result = evaluateIsopsephyExpression(inputExpression, selectedSystem);
  const mathProps = getMathematicalProperties(result.finalValue);
  const greekNumeral = selectedSystem === NumberingSystem.IONIAN ? numberToGreekNumeral(result.finalValue) : "";

  // Check if currently displayed item is already saved
  const isAlreadySaved = savedItems.some(
    (item) => item.text.trim().toUpperCase() === inputExpression.trim().toUpperCase() && item.value === result.finalValue
  );

  const handleSystemChange = (sys: NumberingSystem) => {
    setSelectedSystem(sys);
  };

  const handleInsertChar = (char: string) => {
    setInputExpression((prev) => prev + char);
  };

  const handleCopy = () => {
    if (!result.finalValue) return;
    const textToCopy = `${inputExpression.trim()} = ${result.finalValue} ${greekNumeral ? `(${greekNumeral}) ` : ""}[Πυθμένας: ${mathProps.pythmen}] | ${result.stepsExplanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!inputExpression.trim() || result.finalValue <= 0) return;
    
    const formattedText = formatEnglishItemWithGreekTranslation(inputExpression.trim());
    onSaveItem({
      text: formattedText,
      normalized: formattedText.toUpperCase(),
      value: result.finalValue,
      root: mathProps.pythmen,
      greekNumeral: greekNumeral || `${result.finalValue}`,
      isPhrase: result.wordBreakdowns.length > 1,
      wordCount: result.wordBreakdowns.length || 1,
      category: isEnglishSystem ? "English Gematria" : "Υπολογισμός",
      notes: `Σύστημα: ${getSystemName(selectedSystem)} | ${formattedText} = ${result.finalValue}`,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);

    // Add to recent history if not exists
    if (!recentHistory.includes(inputExpression.trim())) {
      setRecentHistory((prev) => [inputExpression.trim(), ...prev.slice(0, 7)]);
    }
  };

  const handleQuickPreset = (term: string) => {
    setInputExpression(term);
  };

  const getSystemName = (sys: NumberingSystem): string => {
    switch (sys) {
      case NumberingSystem.IONIAN:
        return "1. Ελληνική Ιωνική (Μονάδες, Δεκάδες, Εκατοντάδες 1-900)";
      case NumberingSystem.GREEK_SIMPLE:
        return "2. Ελληνική Απλή (Α=1 ... Ω=24 / ×1)";
      case NumberingSystem.GREEK_MULT6:
        return "3. Ελληνική × 6 (Α=6 ... Ω=144 / ×6)";
      case NumberingSystem.ENGLISH_SIMPLE:
        return "4. Αγγλική Απλή (A=1 ... Z=26 / ×1)";
      case NumberingSystem.ENGLISH_BASE6:
        return "5. Αγγλική × 6 (A=6 ... Z=156 / Base 6 / 888)";
      default:
        return "Ισοψηφία";
    }
  };

  // Presets per system
  const getPresets = () => {
    switch (selectedSystem) {
      case NumberingSystem.ENGLISH_BASE6:
        return [
          { label: "SAVED IN JESUS", val: "888" },
          { label: "RIGHTEOUS GOD", val: "888" },
          { label: "GOD'S ANOINTING", val: "888" },
          { label: "JESUS CROSS", val: "888" },
          { label: "JESUS GOSPEL", val: "888" },
          { label: "MORNING STAR", val: "888" },
          { label: "ONE TWO THREE", val: "888" },
          { label: "A MESSAGE FROM GOD", val: "888" },
          { label: "YOUR REAL NAME", val: "888" },
          { label: "NUCLEAR WEAPON", val: "888" },
          { label: "WE ARE NOT ALONE", val: "888" },
          { label: "ESSENTIAL INFO", val: "888" },
          { label: "SACRED GEOMETRY", val: "888" },
          { label: "THE GOD OF LIGHT", val: "888" },
          { label: "COSMIC LAW OF GOD", val: "888" },
          { label: "COMPUTER", val: "666" },
          { label: "CORONA VIRUS", val: "666" },
          { label: "JESUS", val: "444" },
        ];
      case NumberingSystem.ENGLISH_SIMPLE:
        return [
          { label: "SAVED IN JESUS", val: "148" },
          { label: "RIGHTEOUS GOD", val: "148" },
          { label: "SACRED GEOMETRY", val: "148" },
          { label: "JESUS", val: "74" },
          { label: "GOD", val: "26" },
          { label: "TRUTH", val: "89" },
        ];
      case NumberingSystem.GREEK_MULT6:
        return [
          { label: "ΙΗΣΟΥΣ", val: "522" },
          { label: "ΧΡΙΣΤΟΣ", val: "654" },
          { label: "ΛΟΓΟΣ", val: "348" },
          { label: "ΣΟΦΙΑ", val: "336" },
          { label: "ΑΓΑΠΗ", val: "228" },
        ];
      case NumberingSystem.GREEK_SIMPLE:
        return [
          { label: "ΙΗΣΟΥΣ", val: "87" },
          { label: "ΧΡΙΣΤΟΣ", val: "109" },
          { label: "ΛΟΓΟΣ", val: "58" },
          { label: "ΣΟΦΙΑ", val: "56" },
          { label: "ΑΓΑΠΗ", val: "38" },
        ];
      case NumberingSystem.IONIAN:
      default:
        return [
          { label: "ΙΑΝΕΥΣ", val: "666" },
          { label: "ΤΕΛΙΑΝΟΣ", val: "666" },
          { label: "ΙΩΑΝΝΗΣ", val: "1119" },
          { label: "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ", val: "666" },
          { label: "ΛΑΥΡΕΙΟΝ", val: "666" },
          { label: "ΙΗΣΟΥΣ", val: "888" },
          { label: "ΧΡΙΣΤΟΣ", val: "1480" },
          { label: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", val: "2368" },
        ];
    }
  };

  const alphabetChartData = getAlphabetChart(selectedSystem);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top System Selector Navigation Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181512] border border-[#2d251e] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#c89b3c]" />
              <span>Υπολογιστής Ισοψηφίας & Gematria</span>
            </h2>
            <p className="text-xs text-[#a69680] mt-0.5">
              Επιλέξτε σύστημα αρίθμησης με την ακόλουθη σειρά:
            </p>
          </div>
          <div className="text-xs font-mono text-[#e6c670] px-3 py-1.5 rounded-xl bg-[#221a12] border border-[#3e3020] flex items-center gap-2 shadow-sm self-start sm:self-auto max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#c89b3c] animate-pulse shrink-0" />
            <span className="font-semibold break-words">{getSystemName(selectedSystem)}</span>
          </div>
        </div>

        {/* System Selector Buttons Grid (5 Clean Systems in exact requested order) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {[
            {
              id: NumberingSystem.IONIAN,
              name: "🇬🇷 1. Ιωνική Αρίθμηση",
              detail: "Μονάδες, Δεκάδες, Εκατοντάδες (1-900)",
              badge: "Κλασική",
            },
            {
              id: NumberingSystem.GREEK_SIMPLE,
              name: "🇬🇷 2. Ελληνική Απλή (×1)",
              detail: "Α=1, Β=2, Γ=3 ... Ω=24",
              badge: "× 1",
            },
            {
              id: NumberingSystem.GREEK_MULT6,
              name: "🇬🇷 3. Ελληνική × 6",
              detail: "Α=6, Β=12, Γ=18 ... Ω=144",
              badge: "× 6",
            },
            {
              id: NumberingSystem.ENGLISH_SIMPLE,
              name: "🔤 4. Αγγλική Απλή (×1)",
              detail: "A=1, B=2, C=3 ... Z=26",
              badge: "Simple ×1",
            },
            {
              id: NumberingSystem.ENGLISH_BASE6,
              name: "🔤 5. Αγγλική × 6 (Base 6)",
              detail: "A=6, B=12, C=18 ... Z=156",
              badge: "Base 6 / 888",
            },
          ].map((sys) => {
            const isActive = selectedSystem === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => handleSystemChange(sys.id)}
                id={`btn-system-${sys.id.toLowerCase()}`}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-[#2d2216] border-[#c89b3c] shadow-md shadow-[#c89b3c]/10 text-[#f5ecd8] ring-1 ring-[#c89b3c]/40"
                    : "bg-[#14110e] border-[#292017] hover:bg-[#1f1913] hover:border-[#423425] text-[#a69680]"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-semibold ${isActive ? "text-[#e6c670]" : "text-[#d6c7b2]"}`}>
                    {sys.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? "bg-[#45331e] text-[#f7e0aa]" : "bg-[#1d1711] text-[#7d7061]"
                    }`}
                  >
                    {sys.badge}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#8c7e6c] mt-1 break-words leading-tight">
                  {sys.detail}
                </div>
              </button>
            );
          })}
        </div>

        {/* Toggleable / Always accessible Alphabet Mapping Matrix / Chart */}
        <div className="pt-1 border-t border-[#292017]">
          <button
            type="button"
            onClick={() => setShowAlphabetChart(!showAlphabetChart)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#14110e] hover:bg-[#1f1812] border border-[#3e3020] text-xs font-serif text-[#e6c670] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-[#c89b3c]" />
              <span className="font-semibold">
                Χάρτης Αρίθμησης Γραμμάτων: {getSystemName(selectedSystem)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#a89984]">
              <span>{showAlphabetChart ? "Απόκρυψη Πίνακα" : "Προβολή Όλων των Γραμμάτων & Αξιών"}</span>
              {showAlphabetChart ? <ChevronUp className="w-4 h-4 text-[#c89b3c]" /> : <ChevronDown className="w-4 h-4 text-[#c89b3c]" />}
            </div>
          </button>

          {showAlphabetChart && (
            <div className="mt-3 p-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/30 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif text-[#d6c7b2]">
                  Αντιστοίχιση Γραμμάτων & Αριθμητικών Αξιών ({alphabetChartData.length} χαρακτήρες):
                </span>
                <span className="text-[11px] font-mono text-[#c89b3c]">
                  Σύνολο Αλφαβήτου: {alphabetChartData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString("el-GR")}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-1.5">
                {alphabetChartData.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertChar(item.letter)}
                    className="p-1.5 rounded-lg bg-[#1a1510] hover:bg-[#2a2015] border border-[#362a1c] hover:border-[#c89b3c] flex flex-col items-center justify-center transition-all cursor-pointer group"
                    title={`Κλικ για εισαγωγή: ${item.letter} = ${item.value}`}
                  >
                    <span className="text-sm font-serif font-bold text-[#f5ecd8] group-hover:text-[#e6c670]">
                      {item.letter}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#c89b3c]">
                      {item.value}
                    </span>
                    {item.secondary && (
                      <span className="text-[9px] font-mono text-[#7d7061]">
                        {item.secondary}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Input & Hero Display Card */}
      <div className="rounded-2xl bg-gradient-to-b from-[#1c1813] to-[#161310] border border-[#2d251e] p-6 shadow-xl shadow-black/40 space-y-6">
        
        {/* Input Bar */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label htmlFor="isopsephy-main-input" className="text-xs font-medium uppercase tracking-wider text-[#a69680] font-serif flex items-center gap-1.5 flex-wrap">
              <span>{isEnglishSystem ? "Λατινικη Λεξη, Φραση η Πραξη (English Gematria)" : "Ελληνικη Λεξη, Φραση η Πραξη (Ισοψηφια)"}</span>
              <span className="text-[10px] font-mono text-[#c89b3c]">({getSystemName(selectedSystem)})</span>
            </label>
            
            {/* Quick insert helper keypad */}
            <div className="flex items-center gap-1 bg-[#12100e] px-2 py-1 rounded-lg border border-[#2a2218] shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
              {selectedSystem === NumberingSystem.IONIAN && (
                <>
                  <button
                    onClick={() => handleInsertChar("Ϛ")}
                    id="btn-insert-stigma"
                    className="px-1.5 py-0.5 rounded bg-[#231d17] hover:bg-[#342b20] text-[#e6c670] text-xs font-serif font-bold transition-colors cursor-pointer"
                    title="Στίγμα / Δίγαμμα = 6"
                  >
                    Ϛ(6)
                  </button>
                  <button
                    onClick={() => handleInsertChar("Ϟ")}
                    id="btn-insert-koppa"
                    className="px-1.5 py-0.5 rounded bg-[#231d17] hover:bg-[#342b20] text-[#e6c670] text-xs font-serif font-bold transition-colors cursor-pointer"
                    title="Κόππα = 90"
                  >
                    Ϟ(90)
                  </button>
                  <button
                    onClick={() => handleInsertChar("Ϡ")}
                    id="btn-insert-sampi"
                    className="px-1.5 py-0.5 rounded bg-[#231d17] hover:bg-[#342b20] text-[#e6c670] text-xs font-serif font-bold transition-colors cursor-pointer"
                    title="Σαμπί = 900"
                  >
                    Ϡ(900)
                  </button>
                  <div className="h-3 w-[1px] bg-[#332b21] mx-0.5" />
                </>
              )}
              <button
                onClick={() => handleInsertChar(" + ")}
                className="px-1.5 py-0.5 rounded bg-[#231d17] hover:bg-[#342b20] text-[#e8dfd1] text-xs font-mono font-bold cursor-pointer"
                title="Πρόσθεση"
              >
                +
              </button>
              <button
                onClick={() => handleInsertChar(" - ")}
                className="px-1.5 py-0.5 rounded bg-[#231d17] hover:bg-[#342b20] text-[#e8dfd1] text-xs font-mono font-bold cursor-pointer"
                title="Αφαίρεση"
              >
                -
              </button>
              <button
                onClick={() => handleInsertChar(" × ")}
                className="px-1.5 py-0.5 rounded bg-[#231d17] hover:bg-[#342b20] text-[#e8dfd1] text-xs font-mono font-bold cursor-pointer"
                title="Πολλαπλασιασμός"
              >
                ×
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="isopsephy-main-input"
              rows={inputExpression.length > 30 || inputExpression.includes(" ") ? 2 : 1}
              value={inputExpression}
              onChange={(e) => setInputExpression(e.target.value)}
              placeholder={
                selectedSystem === NumberingSystem.ENGLISH_BASE6 || selectedSystem === NumberingSystem.ENGLISH_SIMPLE
                  ? "e.g. John True, Jesus, Lucifer, 888 + 1480..."
                  : "π.χ. ΙΗΣΟΥΣ, Ο ΣΠΟΡΟΣ ΤΟΥ ΦΩΤΟΣ, 888 + 1480, ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ..."
              }
              className="w-full pl-3.5 pr-10 py-3 bg-[#0f0e0c] border border-[#3d3224] focus:border-[#c89b3c] focus:ring-2 focus:ring-[#c89b3c]/20 rounded-xl text-base sm:text-2xl font-ancient-greek text-[#f5ecd8] placeholder-[#5c5144] transition-all outline-none resize-none break-words leading-relaxed"
              autoFocus
            />
            {inputExpression && (
              <button
                onClick={() => setInputExpression("")}
                id="btn-clear-input"
                className="absolute right-2.5 top-3 text-[#7d7061] hover:text-[#e8dfd1] p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Εκκαθάριση πεδίου"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {result.wordBreakdowns.length > 1 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-serif text-[#e6c670] bg-[#1a1510] px-3 py-1.5 rounded-lg border border-[#3e3020]">
              <ListOrdered className="w-3.5 h-3.5 text-[#c89b3c] shrink-0" />
              <span>
                Πρόταση σε σειρά: <strong>{result.wordBreakdowns.length}</strong> λέξεις • Συνολικό άθροισμα: <strong>{result.finalValue}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Quick Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8c7e6c] font-serif">Προτάσεις ({selectedSystem}):</span>
          {getPresets().map((item) => (
            <button
              key={item.label}
              onClick={() => handleQuickPreset(item.label)}
              className="px-2.5 py-1 rounded-lg bg-[#231d17] hover:bg-[#2e261e] border border-[#362b1f] hover:border-[#c89b3c]/50 text-xs font-serif text-[#d6c7b2] transition-all"
            >
              {item.label} <span className="text-[10px] text-[#9c8973] font-mono">({item.val})</span>
            </button>
          ))}
        </div>

        {/* Hero Result Section */}
        {result.finalValue > 0 ? (
          <div
            key={`calc-hero-${result.finalValue}-${selectedSystem}`}
            className="p-6 rounded-xl bg-[#12100d] border border-[#3d2f1f] relative overflow-hidden animate-lexarithm-result animate-card-shimmer transition-all"
          >
            {/* Background decorative watermark */}
            <div className="absolute right-4 -bottom-6 text-[110px] font-serif font-black text-[#ffffff]/[0.02] pointer-events-none select-none">
              {greekNumeral || (isEnglishSystem ? "G" : "Ω")}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              
              {/* Main Number and Numeral */}
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a69680] font-mono">
                  Συνολικος {isEnglishSystem ? "Gematria" : "Λεξαριθμος"}
                </span>
                <div className="flex items-baseline gap-4 mt-1">
                  <span
                    key={`calc-num-${result.finalValue}`}
                    className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f7e0aa] via-[#e6c670] to-[#c89b3c] drop-shadow-md animate-number-glow inline-block"
                  >
                    {result.finalValue.toLocaleString("el-GR")}
                  </span>
                  {greekNumeral && (
                    <div
                      key={`calc-numeral-${greekNumeral}`}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#221c15] border border-[#443625] animate-badge-glow shadow-sm"
                    >
                      <span className="text-xs text-[#8c7e6c] font-sans">Ιωνικός:</span>
                      <span className="text-base sm:text-lg font-serif font-bold text-[#e6c670]">
                        {greekNumeral}
                      </span>
                    </div>
                  )}
                  <div className="text-xs font-mono text-[#a69680] px-2.5 py-1 rounded bg-[#1e1913] border border-[#362b1e]">
                    {getSystemName(selectedSystem)}
                  </div>
                </div>

                {/* Digital Root & Math Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div
                    key={`calc-pythmen-${mathProps.pythmen}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#251e16] border border-[#3e3223] text-xs font-mono text-[#d4af37] animate-badge-glow"
                  >
                    <span className="text-[#8c7e6c]">Πυθμένας (Ρίζα):</span>
                    <span className="font-bold text-[#f5ecd8]">{mathProps.pythmen}</span>
                  </div>
                  {mathProps.isPrime && (
                    <span className="px-2 py-0.5 rounded bg-[#1e2a1e] border border-[#2d472d] text-emerald-300 text-[11px] font-mono">
                      Πρώτος Αριθμός
                    </span>
                  )}
                  {mathProps.isTriangular && (
                    <span className="px-2 py-0.5 rounded bg-[#2b2214] border border-[#523e1f] text-amber-300 text-[11px] font-mono" title={`Τρίγωνος αριθμός του ${mathProps.triangularRoot}`}>
                      Τρίγωνος Αριθμός (T{mathProps.triangularRoot})
                    </span>
                  )}
                  {mathProps.isSquare && (
                    <span className="px-2 py-0.5 rounded bg-[#1e202b] border border-[#2c334d] text-indigo-300 text-[11px] font-mono">
                      Τετράγωνος ({mathProps.squareRoot}²)
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-[#1c1813] border border-[#2d251e] text-[#a69680] text-[11px] font-mono">
                    {mathProps.isEven ? "Άρτιος" : "Περιττός"}
                  </span>
                  {result.finalValue > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const { foldedHz } = foldToAudibleSpectrum(result.finalValue);
                        pythagoreanSynth.playTone(foldedHz, 2.5, "GOLDEN_BOWL", 0.7);
                      }}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2d1e10] hover:bg-[#3d2a16] border border-[#ffd700]/40 text-[#ffd700] text-[11px] font-mono transition-all cursor-pointer shadow-sm hover:scale-105"
                      title={`Ακρόαση Πυθαγόρειου Τόνου: ${foldToAudibleSpectrum(result.finalValue).foldedHz} Hz`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
                      <span>{foldToAudibleSpectrum(result.finalValue).foldedHz} Hz</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col gap-2">
                <button
                  onClick={handleSave}
                  id="btn-save-calculator-result"
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer ${
                    isAlreadySaved || saveSuccess
                      ? "bg-emerald-900/60 text-emerald-200 border border-emerald-500/50"
                      : "bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#a0792c] hover:to-[#dbaa42] text-[#14120f] font-bold"
                  }`}
                >
                  {isAlreadySaved || saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Αποθηκεύτηκε</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Αποθήκευση στο Αρχείο</span>
                    </>
                  )}
                </button>

                {/* Export Card as PNG / Social Card Button */}
                <button
                  onClick={() => setIsExportImageModalOpen(true)}
                  id="btn-export-png-calculator-result"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#2b2114] hover:bg-[#3d2e1b] border border-[#d4af37]/60 hover:border-[#ffd700] text-xs sm:text-sm font-serif font-bold text-[#ffd700] transition-all shadow-sm hover:shadow-[#ffd700]/20 cursor-pointer"
                  title="Εξαγωγή κάρτας αποτελέσματος ως αρχείο εικόνας PNG για κοινοποίηση στα Social Media"
                >
                  <ImageIcon className="w-4 h-4 text-[#ffd700]" />
                  <span>Εξαγωγή PNG / Κοινοποίηση</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    id="btn-copy-calculator-result"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#231d17] hover:bg-[#30271e] border border-[#3e3223] text-xs text-[#d6c7b2] font-medium transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Αντιγράφηκε</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#a69680]" />
                        <span>Αντιγραφή</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      onOpenAiModal(
                        inputExpression.trim(),
                        result.finalValue,
                        result.wordBreakdowns.map((w) => w.rawWord)
                      )
                    }
                    id="btn-ai-analyze-calculator"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#282116] hover:bg-[#382d1c] border border-[#c89b3c]/40 text-xs text-[#e6c670] font-medium transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Ερμηνεία</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Expression Steps Explanation if Math used */}
            {result.stepsExplanation && (
              <div className="mt-4 pt-4 border-t border-[#231d16] text-xs font-mono text-[#c4b59f] flex flex-col sm:flex-row sm:items-center gap-2 break-words">
                <span className="text-[#8c7e6c] font-sans shrink-0">Μαθηματική Ανάλυση:</span>
                <span className="text-[#f5ecd8] font-bold bg-[#1a1611] px-2.5 py-1.5 rounded-md border border-[#2d2419] break-words max-w-full leading-relaxed">
                  {result.stepsExplanation}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[#12100d] border border-[#2d2419] text-center text-[#7a6e5e] font-serif">
            {isEnglishSystem
              ? "Εισάγετε λατινικούς/αγγλικούς χαρακτήρες για να υπολογιστεί το Gematria."
              : "Εισάγετε ελληνικούς χαρακτήρες για να υπολογιστεί ο λεξάριθμος."}
          </div>
        )}

        {/* Dedicated Sentence Analysis in Series (Όταν γράφεις μια πρόταση να είναι σε σειρά) */}
        {result.wordBreakdowns.length > 1 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#161310] border border-[#c89b3c]/40 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d2419] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2a2014] border border-[#c89b3c]/50 flex items-center justify-center text-[#e6c670] shrink-0">
                  <AlignLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#f5ecd8]">
                    Ανάλυση Πρότασης σε Σειρά ({result.wordBreakdowns.length} λέξεις)
                  </h3>
                  <p className="text-[11px] text-[#a69680]">
                    Διαδοχική ροή και προοδευτικό άθροισμα λέξεων με τη σειρά που γράφτηκαν
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#231b13] border border-[#3e3020] text-[#e6c670]">
                  Σύνολο: <strong>{result.finalValue}</strong> (Πυθμ. {mathProps.pythmen})
                </span>
              </div>
            </div>

            {/* 1. Sequential Word-by-Word Chain Flow (Σε Σειρά) */}
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider font-mono text-[#8c7e6c]">
                1. Διαδοχική Σειρά Λέξεων:
              </span>
              <div className="p-3 rounded-xl bg-[#100e0b] border border-[#261f17] flex flex-wrap items-center gap-2">
                {result.wordBreakdowns.map((wordObj, idx) => (
                  <React.Fragment key={`seq-chain-${idx}`}>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a1510] border border-[#382b1d] hover:border-[#c89b3c]/60 transition-colors">
                      <span className="text-[10px] font-mono text-[#8c7e6c] bg-[#241c14] px-1.5 py-0.2 rounded border border-[#3a2e20]">
                        {idx + 1}η
                      </span>
                      <span className="text-sm font-ancient-greek font-bold text-[#f5ecd8]">
                        {wordObj.rawWord}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#e6c670]">
                        = {wordObj.value}
                      </span>
                    </div>
                    {idx < result.wordBreakdowns.length - 1 && (
                      <span className="text-[#8c7e6c] font-bold text-xs">➔</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-[#c89b3c] font-bold text-sm ml-1">
                  = {result.finalValue}
                </span>
              </div>
            </div>

            {/* 2. Detailed Ordered Rows in Series with Running Sum */}
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider font-mono text-[#8c7e6c]">
                2. Αναλυτικός Πίνακας Λέξεων σε Σειρά & Προοδευτικό Άθροισμα:
              </span>
              <div className="space-y-2">
                {result.wordBreakdowns.map((wordObj, idx) => {
                  const runningSum = result.wordBreakdowns
                    .slice(0, idx + 1)
                    .reduce((acc, w) => acc + w.value, 0);
                  return (
                    <div
                      key={`seq-row-${idx}`}
                      className="p-3 rounded-xl bg-[#12100d] border border-[#2b2218] hover:border-[#c89b3c]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-[#241c14] border border-[#3d3021] text-[11px] font-mono text-[#c89b3c] flex items-center justify-center shrink-0 font-bold">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base sm:text-lg font-ancient-greek font-bold text-[#f5ecd8]">
                              {wordObj.rawWord}
                            </span>
                            <span className="text-xs font-mono text-[#8c7e6c]">
                              (Πυθμένας: {wordObj.root})
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#8c7e6c] break-words">
                            {wordObj.letters.map((l) => `${l.char}(${l.value})`).join(" + ")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-serif font-bold text-[#e6c670]">
                            {wordObj.value}
                          </div>
                          <div className="text-[10px] font-mono text-[#8c7e6c]">
                            Τρέχον Σύνολο: <span className="text-[#d6c7b2] font-semibold">{runningSum}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Word and Letter Breakdown Section (Hidden behind toggle button by default) */}
        {result.wordBreakdowns.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowLetterBreakdown((prev) => !prev)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#14110e] border border-[#29221a] hover:border-[#c89b3c]/50 hover:bg-[#1a1612] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#c89b3c]" />
                <span className="text-xs uppercase tracking-wider text-[#d6c7b2] font-serif font-bold group-hover:text-[#f5ecd8]">
                  Συχνότητα & Αποδόμηση Γραμμάτων ({result.wordBreakdowns.reduce((acc, w) => acc + w.letters.length, 0)} γράμματα)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#221b14] text-[#c89b3c] border border-[#3e3223] hidden sm:inline">
                  {getSystemName(selectedSystem)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-serif text-[#8c7e6c]">
                  {showLetterBreakdown ? "Απόκρυψη" : "Προβολή"}
                </span>
                {showLetterBreakdown ? (
                  <ChevronUp className="w-4 h-4 text-[#c89b3c]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#c89b3c]" />
                )}
              </div>
            </button>

            {showLetterBreakdown && (
              <div className="mt-3 space-y-3 animate-fadeIn">
                {result.wordBreakdowns.map((wordObj, wIdx) => (
                  <div
                    key={`${wordObj.rawWord}-${wIdx}`}
                    className="p-4 rounded-xl bg-[#14110e] border border-[#29221a] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-ancient-greek font-bold text-[#f5ecd8]">
                          {wordObj.rawWord}
                        </span>
                        {wordObj.normalizedWord !== wordObj.rawWord && (
                          <span className="text-xs font-mono text-[#8c7e6c]">
                            [{wordObj.normalizedWord}]
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8c7e6c] font-mono">
                          Πυθμένας: {wordObj.root}
                        </span>
                        <span className="text-sm font-serif font-bold text-[#e6c670] bg-[#221b14] px-2.5 py-0.5 rounded-md border border-[#3e3223]">
                          = {wordObj.value}
                        </span>
                      </div>
                    </div>

                    {/* Letter Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {wordObj.letters.map((letter, lIdx) => (
                        <div
                          key={lIdx}
                          className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg bg-[#1b1712] border border-[#30261b] hover:border-[#c89b3c]/40 transition-colors"
                        >
                          <span className="text-base font-ancient-greek font-bold text-[#f5ecd8]">
                            {letter.originalChar}
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-[#c89b3c]">
                            {letter.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Math sum text */}
                    <div className="text-[11px] font-mono text-[#8c7e6c] break-words">
                      {wordObj.letters.map((l) => `${l.char}(${l.value})`).join(" + ")} = <strong className="text-[#d6c7b2]">{wordObj.value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Golden Ratio (Φ = 1.618) Harmonic Analyzer Tool with Gauge */}
      {result.finalValue > 0 && (
        <GoldenRatioGaugeTool
          totalValue={result.finalValue}
          wordBreakdowns={result.wordBreakdowns}
          isEnglishSystem={isEnglishSystem}
        />
      )}

      {/* Pythagorean Monochord & Symbolic Isopsephy Audio Synthesizer Tool */}
      {result.finalValue > 0 && (
        <PythagoreanMonochordAudio
          totalValue={result.finalValue}
          wordBreakdowns={result.wordBreakdowns}
          isEnglishSystem={isEnglishSystem}
        />
      )}

      {/* Special Highlight for 888 and 666 */}
      {(result.finalValue === 888 || result.finalValue === 666) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#20180f] via-[#2a1e12] to-[#20180f] border-2 border-[#c89b3c]/50 shadow-lg space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#e6c670] font-serif font-bold text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>
                {result.finalValue === 888
                  ? "Ειδικές Ιδιότητες του 888 (ΙΗΣΟΥΣ / SACRED GEOMETRY / SAVED IN JESUS)"
                  : "Ειδικές Μαθηματικές Ιδιότητες του 666 (χξϛ´ / COMPUTER)"}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#352514] text-[#e6c670] border border-[#523d24]">
              {result.finalValue === 888 ? "888 = 37 × 24" : "36ος Τρίγωνος (T₃₆)"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-serif text-[#d6c7b2]">
            {result.finalValue === 888 ? (
              <>
                <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
                  <div className="text-[11px] text-[#8c7e6c]">Ελληνική Ιωνική & English Base 6</div>
                  <div className="font-mono text-[11px] text-[#f5ecd8] mt-1 break-words">
                    ΙΗΣΟΥΣ (Ιωνικός 888) = SACRED GEOMETRY (Base 6 = 888) = SAVED IN JESUS (888)
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
                  <div className="text-[11px] text-[#8c7e6c]">Μαθηματικές Συμμετρίες</div>
                  <div className="font-mono text-[11px] text-[#e6c670] mt-1">
                    888 = 24 × 37 • Πυθμένας: 8+8+8 = 24 → 6
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
                  <div className="text-[11px] text-[#8c7e6c]">Χριστολογικός Λεξάριθμος</div>
                  <div className="text-[11px] text-[#f5ecd8] mt-1">
                    Αντίποδας του 666 • ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ = 888 + 1480 = 2368
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
                  <div className="text-[11px] text-[#8c7e6c]">12 Διαιρέτες</div>
                  <div className="font-mono text-[11px] text-[#f5ecd8] mt-1 break-words">
                    1, 2, 3, 6, 9, 18, 37, 74, 111, 222, 333, 666
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
                  <div className="text-[11px] text-[#8c7e6c]">Τύπος Τριγώνου Αριθμού</div>
                  <div className="font-mono text-[11px] text-[#e6c670] mt-1">
                    s = [36 · 37] / 2 = 18 · 37 = 666
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
                  <div className="text-[11px] text-[#8c7e6c]">Μαγικό Τετράγωνο Ηλίου & Base 6</div>
                  <div className="text-[11px] text-[#f5ecd8] mt-1">
                    6×6=36 κελιά • COMPUTER = 666 (Base 6)
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Divisors and Historical Context Accordion */}
      {result.finalValue > 0 && mathProps.divisors.length > 0 && (
        <div className="p-4 rounded-xl bg-[#161310] border border-[#282119] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#a69680]">
          <div>
            <strong className="text-[#d6c7b2] font-serif">Διαιρέτες του {result.finalValue}: </strong>
            <span className="font-mono">{mathProps.divisors.join(", ")}</span>
          </div>
          <div className="shrink-0 font-mono text-[11px] text-[#c89b3c]">
            Σύνολο διαιρετών: <strong>{mathProps.totalDivisorsCount || mathProps.divisors.length}</strong>
          </div>
        </div>
      )}

      {/* Educational Matrix / Reference Guide based on Active System */}
      {selectedSystem === NumberingSystem.IONIAN ? (
        <div className="p-5 rounded-2xl bg-[#14110e] border border-[#2e241a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>Θεμελιώδεις Αρχές Ισοψηφίας & Ιωνικής Αρίθμησης</span>
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#221b14] text-[#e6c670] border border-[#3e3122]">
              Σύνολο 27 Γραμμάτων = 4.995
            </span>
          </div>

          <p className="text-xs font-serif text-[#bdae9b] leading-relaxed">
            Το ελληνικό αλφαβητικό σύστημα αρίθμησης συγκροτείται από <strong>27 ιερά σύμβολα</strong> κατανεμημένα σε 3 ακέραιες εννεάδες:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-serif">
            <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
              <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
                <span>9 Μονάδες (1 - 9)</span>
                <span className="text-[#e6c670] font-mono">Σ = 45</span>
              </div>
              <p className="text-[11px] font-mono text-[#8c7e6c]">
                Α=1, Β=2, Γ=3, Δ=4, Ε=5, Ϛ=6, Ζ=7, Η=8, Θ=9
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
              <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
                <span>9 Δεκάδες (10 - 90)</span>
                <span className="text-[#e6c670] font-mono">Σ = 450</span>
              </div>
              <p className="text-[11px] font-mono text-[#8c7e6c]">
                Ι=10, Κ=20, Λ=30, Μ=40, Ν=50, Ξ=60, Ο=70, Π=80, Ϟ=90
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
              <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
                <span>9 Εκατοντάδες (100 - 900)</span>
                <span className="text-[#e6c670] font-mono">Σ = 4.500</span>
              </div>
              <p className="text-[11px] font-mono text-[#8c7e6c]">
                Ρ=100, Σ=200, Τ=300, Υ=400, Φ=500, Χ=600, Ψ=700, Ω=800, Ϡ=900
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1d1711] border border-[#c89b3c]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-[#f5ecd8]">
              <strong>Άθροισμα Εννεάδων:</strong> 45 + 450 + 4.500 = <strong className="text-[#e6c670] text-sm">4.995</strong>
            </span>
            <span className="text-[#a69680]">
              Ιωνικός: <strong className="text-[#e6c670]">͵δϡϟε´</strong> • Πυθμένας: 4+9+9+5 = 27 → <strong className="text-[#e6c670]">9</strong> (Ιερά Εννεάδα)
            </span>
          </div>
        </div>
      ) : selectedSystem === NumberingSystem.ENGLISH_BASE6 ? (
        <div className="p-5 rounded-2xl bg-[#14110e] border border-[#2e241a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>Πίνακας English Gematria (Πολλαπλάσια του 6 / A=6 ... Z=156)</span>
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#221b14] text-[#e6c670] border border-[#3e3122]">
              26 Γράμματα × 6 = Σ 2.106
            </span>
          </div>

          <p className="text-xs font-serif text-[#bdae9b] leading-relaxed">
            Στο σύστημα <strong>English Base 6 / Sumerian</strong> κάθε λατινικό γράμμα λαμβάνει την αξία της θέσης του πολλαπλασιασμένη επί 6 (A=1×6=6, B=2×6=12 ... Z=26×6=156):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 text-center text-xs font-mono">
            {[
              ["A", 6], ["B", 12], ["C", 18], ["D", 24], ["E", 30], ["F", 36], ["G", 42], ["H", 48], ["I", 54],
              ["J", 60], ["K", 66], ["L", 72], ["M", 78], ["N", 84], ["O", 90], ["P", 96], ["Q", 102], ["R", 108],
              ["S", 114], ["T", 120], ["U", 126], ["V", 132], ["W", 138], ["X", 144], ["Y", 150], ["Z", 156]
            ].map(([letter, val]) => (
              <div key={letter} className="p-2 rounded-lg bg-[#0d0c0a] border border-[#261f18]">
                <div className="font-bold text-[#f5ecd8]">{letter}</div>
                <div className="text-[#e6c670] text-[11px] font-semibold">{val}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#1d1711] border border-[#c89b3c]/30 text-xs font-mono text-[#d6c7b2]">
            💡 <strong>Παραδείγματα:</strong> SAVED IN JESUS = <strong>888</strong> • RIGHTEOUS GOD = <strong>888</strong> • SACRED GEOMETRY = <strong>888</strong> • COMPUTER = <strong>666</strong> • JESUS = <strong>444</strong>
          </div>
        </div>
      ) : selectedSystem === NumberingSystem.GREEK_MULT6 ? (
        <div className="p-5 rounded-2xl bg-[#14110e] border border-[#2e241a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>Πίνακας Ελληνικών Πολλαπλασίων του 6 (Α=6 ... Ω=144)</span>
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#221b14] text-[#e6c670] border border-[#3e3122]">
              24 Γράμματα × 6 = Σ 1.800
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2 text-center text-xs font-mono">
            {[
              ["Α", 6], ["Β", 12], ["Γ", 18], ["Δ", 24], ["Ε", 30], ["Ζ", 36], ["Η", 42], ["Θ", 48],
              ["Ι", 54], ["Κ", 60], ["Λ", 66], ["Μ", 72], ["Ν", 78], ["Ξ", 84], ["Ο", 90], ["Π", 96],
              ["Ρ", 102], ["Σ", 108], ["Τ", 114], ["Υ", 120], ["Φ", 126], ["Χ", 132], ["Ψ", 138], ["Ω", 144]
            ].map(([letter, val]) => (
              <div key={letter} className="p-2 rounded-lg bg-[#0d0c0a] border border-[#261f18]">
                <div className="font-bold text-[#f5ecd8]">{letter}</div>
                <div className="text-[#e6c670] text-[11px] font-semibold">{val}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-[#14110e] border border-[#2e241a] space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c89b3c]" />
            <span>Επιλεγμένο Σύστημα: {getSystemName(selectedSystem)}</span>
          </h3>
          <p className="text-xs font-serif text-[#bdae9b]">
            Ο υπολογισμός πραγματοποιείται δυναμικά για κάθε γράμμα και λέξη σύμφωνα με τους καθορισμένους κανόνες του συστήματος.
          </p>
        </div>
      )}

      {/* Recent History Scratchpad */}
      {recentHistory.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[#8c7e6c] font-serif font-bold">
              Προσφατοι Υπολογισμοι
            </span>
            <button
              onClick={() => setRecentHistory([])}
              className="text-[11px] text-[#6b5f51] hover:text-[#a69680] transition-colors"
            >
              Καθαρισμός ιστορικού
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentHistory.map((item, idx) => {
              const evalRes = evaluateIsopsephyExpression(item, selectedSystem);
              const displayVal = evalRes.finalValue;
              return (
                <button
                  key={idx}
                  onClick={() => setInputExpression(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161310] hover:bg-[#201a14] border border-[#29221a] hover:border-[#3d3224] text-xs font-serif text-[#b8a791] transition-all"
                >
                  <span>{item}</span>
                  {displayVal > 0 && (
                    <span className="text-[10px] font-mono text-[#c89b3c]">
                      ({displayVal})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Card as PNG Image Modal */}
      {result.finalValue > 0 && (
        <ExportCardImageModal
          isOpen={isExportImageModalOpen}
          onClose={() => setIsExportImageModalOpen(false)}
          expression={inputExpression}
          totalValue={result.finalValue}
          greekNumeral={greekNumeral}
          system={selectedSystem}
          systemName={getSystemName(selectedSystem)}
          mathProps={mathProps}
          wordBreakdowns={result.wordBreakdowns}
          stepsExplanation={result.stepsExplanation}
        />
      )}
    </div>
  );
};
