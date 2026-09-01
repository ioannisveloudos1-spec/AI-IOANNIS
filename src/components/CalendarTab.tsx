import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Sparkles,
  Search,
  BookOpen,
  Info,
  Layers,
  Clock,
  Compass,
  Calculator,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Flame,
  Droplets,
  Wind,
  Check,
  Copy,
  Eye,
  Orbit
} from "lucide-react";
import { AppTheme } from "../utils/theme";
import { ANCIENT_ATTIC_MONTHS, MODERN_MONTHS, AncientMonth, ModernMonth } from "../data/calendarData";
import { LUNAR_PHASES_DATA, MoonPhaseVisual } from "./LunarPhaseVisuals";
import { MegasEniautosMap } from "./MegasEniautosMap";

interface CalendarTabProps {
  theme?: AppTheme;
  onSelectWord?: (word: string) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  theme = "dark-ancient",
  onSelectWord,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"attic" | "modern" | "lunar-solar" | "great-year" | "compare">("attic");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
  const [expandedMonth, setExpandedMonth] = useState<string | null>("Βοηδρομιών");
  const [selectedMoonPhase, setSelectedMoonPhase] = useState<string>("full_moon");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Theme Styling Helper to ensure 100% theme color and font synchronization
  const themeStyles = useMemo(() => {
    switch (theme) {
      case "parchment":
        return {
          bannerBg: "bg-gradient-to-br from-[#fcf9f2] via-[#f7f0e1] to-[#ede3cf] border-[#bfa37c] text-[#382109]",
          bannerIcon: "bg-[#ebdcc5] border-[#925f11] text-[#8c5307]",
          bannerSubtext: "text-[#6e4e2a]",
          cardBg: "bg-[#fbf7ee] border-[#d8c2a5] text-[#382109]",
          cardExpandedBg: "bg-[#fffdf9] border-[#8c5307] ring-1 ring-[#8c5307]/30",
          cardHeaderHover: "hover:bg-[#f3e7d3]",
          badgeBg: "bg-[#f0e3ce] border-[#cbb698] text-[#543216]",
          headingColor: "text-[#382109]",
          accentColor: "text-[#8c5307]",
          subtextColor: "text-[#6e4e2a]",
          sectionBoxBg: "bg-[#f5ecdd] border-[#dfceb6] text-[#382109]",
          subTabContainer: "bg-[#ede2ce] border-[#bfa37c]",
          subTabActive: "bg-[#fffdfa] text-[#8c5307] shadow-sm border border-[#bfa37c]",
          subTabInactive: "text-[#634324] hover:text-[#2e1401]",
          inputBg: "bg-[#fffdfa] border-[#cbb698] text-[#382109] placeholder-[#8c6f4f]",
          tableHeader: "bg-[#ebdcc5] text-[#382109] border-[#cbb698]",
          tableRowEven: "bg-[#fdfbf6]",
          tableRowOdd: "bg-[#f6eee0]",
          tableBorder: "border-[#d8c2a5]",
          buttonAction: "bg-[#ebdcc5] hover:bg-[#dfceb6] text-[#382109] border-[#bfa37c]",
          numeralAccent: "text-[#8c5307]",
          lunarPillActive: "bg-[#8c5307] text-[#fffdfa] border-[#6b3f05] shadow-md",
          lunarPillInactive: "bg-[#f5ecdd] text-[#6e4e2a] hover:bg-[#ede2ce] border-[#dfceb6]"
        };
      case "ancient-calligraphy":
        return {
          bannerBg: "bg-gradient-to-br from-[#fbf8f0] via-[#f4ebd7] to-[#e8dac0] border-[#917046] text-[#2c1802]",
          bannerIcon: "bg-[#e5d4b9] border-[#694819] text-[#694819]",
          bannerSubtext: "text-[#5a3b18]",
          cardBg: "bg-[#fcfaf3] border-[#cca977] text-[#2c1802]",
          cardExpandedBg: "bg-[#ffffff] border-[#694819] ring-2 ring-[#694819]/25 shadow-lg",
          cardHeaderHover: "hover:bg-[#f1e4cb]",
          badgeBg: "bg-[#ebd9bd] border-[#b38e5b] text-[#422606]",
          headingColor: "text-[#2c1802]",
          accentColor: "text-[#694819]",
          subtextColor: "text-[#5a3b18]",
          sectionBoxBg: "bg-[#f2e5ce] border-[#c29f6d] text-[#2c1802]",
          subTabContainer: "bg-[#e8dac0] border-[#917046]",
          subTabActive: "bg-[#ffffff] text-[#694819] font-bold shadow-md border border-[#917046]",
          subTabInactive: "text-[#5a3b18] hover:text-[#1a0d01]",
          inputBg: "bg-[#ffffff] border-[#b38e5b] text-[#2c1802] placeholder-[#805e38]",
          tableHeader: "bg-[#e3d1b5] text-[#2c1802] border-[#b38e5b]",
          tableRowEven: "bg-[#fdfbf6]",
          tableRowOdd: "bg-[#f5ecdc]",
          tableBorder: "border-[#cca977]",
          buttonAction: "bg-[#e3d1b5] hover:bg-[#d4be9c] text-[#2c1802] border-[#917046]",
          numeralAccent: "text-[#694819]",
          lunarPillActive: "bg-[#694819] text-[#ffffff] border-[#422606] shadow-md",
          lunarPillInactive: "bg-[#f2e5ce] text-[#5a3b18] hover:bg-[#e8dac0] border-[#c29f6d]"
        };
      case "solar":
        return {
          bannerBg: "bg-gradient-to-br from-[#1a1205] via-[#2a1b04] to-[#120c02] border-[#ffb703]/50 text-[#ffeedb]",
          bannerIcon: "bg-[#382404] border-[#fb8500] text-[#ffb703]",
          bannerSubtext: "text-[#ffd166]/80",
          cardBg: "bg-[#160f04] border-[#4d3209] text-[#ffeedb]",
          cardExpandedBg: "bg-[#221605] border-[#fb8500] ring-1 ring-[#fb8500]/40",
          cardHeaderHover: "hover:bg-[#2b1c06]",
          badgeBg: "bg-[#2e1c03] border-[#704808] text-[#ffb703]",
          headingColor: "text-[#ffb703]",
          accentColor: "text-[#fb8500]",
          subtextColor: "text-[#e0a96d]",
          sectionBoxBg: "bg-[#201404] border-[#5e3b08] text-[#ffeedb]",
          subTabContainer: "bg-[#241703] border-[#593706]",
          subTabActive: "bg-[#ffb703] text-black shadow-md font-bold",
          subTabInactive: "text-[#ffd166]/70 hover:text-[#ffeedb]",
          inputBg: "bg-[#181003] border-[#593706] text-[#ffeedb] placeholder-[#9e6d32]",
          tableHeader: "bg-[#2c1b03] text-[#ffb703] border-[#593706]",
          tableRowEven: "bg-[#160f04]",
          tableRowOdd: "bg-[#1f1505]",
          tableBorder: "border-[#4d3209]",
          buttonAction: "bg-[#2e1c03] hover:bg-[#472c05] text-[#ffb703] border-[#704808]",
          numeralAccent: "text-[#fb8500]",
          lunarPillActive: "bg-[#fb8500] text-black font-bold border-[#ffb703] shadow-md",
          lunarPillInactive: "bg-[#201404] text-[#ffd166] hover:bg-[#2e1c03] border-[#5e3b08]"
        };
      case "ethereal":
        return {
          bannerBg: "bg-gradient-to-br from-[#0c1427] via-[#080d1a] to-[#04070d] border-[#38bdf8]/40 text-[#e0f2fe]",
          bannerIcon: "bg-[#0f2342] border-[#38bdf8] text-[#38bdf8]",
          bannerSubtext: "text-[#7dd3fc]/80",
          cardBg: "bg-[#091120] border-[#1e3a5f] text-[#e0f2fe]",
          cardExpandedBg: "bg-[#0d1b33] border-[#38bdf8] ring-1 ring-[#38bdf8]/40",
          cardHeaderHover: "hover:bg-[#122442]",
          badgeBg: "bg-[#0e213d] border-[#1e4976] text-[#38bdf8]",
          headingColor: "text-[#38bdf8]",
          accentColor: "text-[#7dd3fc]",
          subtextColor: "text-[#94a3b8]",
          sectionBoxBg: "bg-[#0c1a2e] border-[#1b3b64] text-[#e0f2fe]",
          subTabContainer: "bg-[#0b172a] border-[#1e3a5f]",
          subTabActive: "bg-[#38bdf8] text-slate-950 shadow-md font-bold",
          subTabInactive: "text-[#7dd3fc]/70 hover:text-white",
          inputBg: "bg-[#070e1a] border-[#1e3a5f] text-[#e0f2fe] placeholder-[#476a94]",
          tableHeader: "bg-[#0f2342] text-[#38bdf8] border-[#1e3a5f]",
          tableRowEven: "bg-[#08101e]",
          tableRowOdd: "bg-[#0c172a]",
          tableBorder: "border-[#1e3a5f]",
          buttonAction: "bg-[#0f2342] hover:bg-[#183561] text-[#38bdf8] border-[#1e4976]",
          numeralAccent: "text-[#38bdf8]",
          lunarPillActive: "bg-[#38bdf8] text-slate-950 font-bold border-[#7dd3fc] shadow-md",
          lunarPillInactive: "bg-[#0c1a2e] text-[#7dd3fc] hover:bg-[#0e213d] border-[#1b3b64]"
        };
      case "cyber-tech":
        return {
          bannerBg: "bg-gradient-to-br from-[#05130d] via-[#020b07] to-[#000000] border-[#10b981]/50 text-[#d1fae5]",
          bannerIcon: "bg-[#062419] border-[#10b981] text-[#10b981]",
          bannerSubtext: "text-[#6ee7b7]/80",
          cardBg: "bg-[#03110a] border-[#064e3b] text-[#d1fae5]",
          cardExpandedBg: "bg-[#062114] border-[#10b981] ring-1 ring-[#10b981]/40",
          cardHeaderHover: "hover:bg-[#08291a]",
          badgeBg: "bg-[#052115] border-[#085f47] text-[#10b981]",
          headingColor: "text-[#10b981]",
          accentColor: "text-[#34d399]",
          subtextColor: "text-[#6ee7b7]/70",
          sectionBoxBg: "bg-[#041a10] border-[#09573f] text-[#d1fae5]",
          subTabContainer: "bg-[#04160e] border-[#064e3b]",
          subTabActive: "bg-[#10b981] text-black shadow-md font-bold font-mono",
          subTabInactive: "text-[#6ee7b7]/70 hover:text-white font-mono",
          inputBg: "bg-[#020d07] border-[#064e3b] text-[#d1fae5] placeholder-[#156e52] font-mono",
          tableHeader: "bg-[#052418] text-[#10b981] border-[#064e3b] font-mono",
          tableRowEven: "bg-[#030f08]",
          tableRowOdd: "bg-[#05170d]",
          tableBorder: "border-[#064e3b]",
          buttonAction: "bg-[#052418] hover:bg-[#0a3826] text-[#10b981] border-[#085f47] font-mono",
          numeralAccent: "text-[#10b981]",
          lunarPillActive: "bg-[#10b981] text-black font-bold border-[#34d399] shadow-md",
          lunarPillInactive: "bg-[#041a10] text-[#34d399] hover:bg-[#052115] border-[#09573f]"
        };
      case "dark-ancient":
      default:
        return {
          bannerBg: "bg-gradient-to-br from-[#1c1611] via-[#15100c] to-[#0a0806] border-[#ffd700]/30 text-[#f5ecd8]",
          bannerIcon: "bg-[#2b1f13] border-[#ffd700]/60 text-[#ffd700]",
          bannerSubtext: "text-[#a69680]",
          cardBg: "bg-[#130f0b] border-[#2f2214] text-[#f5ecd8]",
          cardExpandedBg: "bg-[#18130e] border-[#ffd700]/70 ring-1 ring-[#ffd700]/20",
          cardHeaderHover: "hover:bg-[#1e1710]",
          badgeBg: "bg-[#261c12] border-[#3d2918] text-[#ffd700]",
          headingColor: "text-[#ffd700]",
          accentColor: "text-[#c89b3c]",
          subtextColor: "text-[#a69680]",
          sectionBoxBg: "bg-[#1a140e] border-[#382617] text-[#f5ecd8]",
          subTabContainer: "bg-[#1f1811] border-[#3d2c1c]",
          subTabActive: "bg-[#c89b3c] text-black shadow-md font-bold",
          subTabInactive: "text-[#a69680] hover:text-[#f5ecd8]",
          inputBg: "bg-[#140f0a] border-[#3d2c1c] text-[#f5ecd8] placeholder-[#7d654c]",
          tableHeader: "bg-[#251c12] text-[#ffd700] border-[#3d2b1a]",
          tableRowEven: "bg-[#140f0b]",
          tableRowOdd: "bg-[#1a140e]",
          tableBorder: "border-[#2f2214]",
          buttonAction: "bg-[#261c12] hover:bg-[#382618] text-[#ffd700] border-[#523820]",
          numeralAccent: "text-[#ffd700]",
          lunarPillActive: "bg-[#c89b3c] text-black font-bold border-[#ffd700] shadow-md",
          lunarPillInactive: "bg-[#1a140e] text-[#ffd700] hover:bg-[#261c12] border-[#382617]"
        };
    }
  }, [theme]);

  // Filter Attic Months
  const filteredAtticMonths = useMemo(() => {
    return ANCIENT_ATTIC_MONTHS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.transliteration.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.dedicatedGods.some((g) => g.toLowerCase().includes(searchFilter.toLowerCase())) ||
        m.traditionalGreekName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.etymologyBreakdown.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.theologicalReasoning.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.mythAndRitual.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.fullMoonFestival.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.mainFestivals.some((f) => f.toLowerCase().includes(searchFilter.toLowerCase()));

      const matchesSeason =
        selectedSeason === "all" || m.season.toLowerCase().includes(selectedSeason.toLowerCase());

      return matchesSearch && matchesSeason;
    });
  }, [searchFilter, selectedSeason]);

  // Filter Modern Months
  const filteredModernMonths = useMemo(() => {
    return MODERN_MONTHS.filter((m) => {
      return (
        m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.latinOrigin.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.dedicatedGodOrPerson.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.theologicalContext.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.traditionalFolkName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.etymologyGreek.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.lunarHighlight.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });
  }, [searchFilter]);

  const activePhaseData = useMemo(() => {
    return LUNAR_PHASES_DATA.find((p) => p.key === selectedMoonPhase) || LUNAR_PHASES_DATA[4];
  }, [selectedMoonPhase]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-serif">
      {/* Top Hero Banner */}
      <div className={`p-5 sm:p-7 rounded-3xl border relative overflow-hidden transition-all shadow-xl ${themeStyles.bannerBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md ${themeStyles.bannerIcon}`}>
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
                  Αρχαίο & Σύγχρονο Ελληνικό Ημερολόγιο
                </h1>
                <p className={`text-xs ${themeStyles.bannerSubtext}`}>
                  12 Αττικοί Μήνες • Ετυμολογία & Θεολογία • Οπτικές Φάσεις Σελήνης • Περιοδικότητα Πανσελήνου
                </p>
              </div>
            </div>
          </div>

          {/* Quick Sub-tab selector */}
          <div className={`flex flex-wrap items-center p-1 rounded-2xl border self-start md:self-auto ${themeStyles.subTabContainer}`}>
            <button
              onClick={() => setActiveSubTab("attic")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "attic" ? themeStyles.subTabActive : themeStyles.subTabInactive
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              12 Αττικοί Μήνες
            </button>
            <button
              onClick={() => setActiveSubTab("modern")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "modern" ? themeStyles.subTabActive : themeStyles.subTabInactive
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Σύγχρονοι Μήνες
            </button>
            <button
              onClick={() => setActiveSubTab("lunar-solar")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "lunar-solar" ? themeStyles.subTabActive : themeStyles.subTabInactive
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Σελήνη & Πανσέληνος
            </button>
            <button
              onClick={() => setActiveSubTab("great-year")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "great-year" ? themeStyles.subTabActive : themeStyles.subTabInactive
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              Μέγας Ενιαυτός (25.920 & 2.160 Ἔτη)
            </button>
            <button
              onClick={() => setActiveSubTab("compare")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "compare" ? themeStyles.subTabActive : themeStyles.subTabInactive
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Συγκριτικός Πίνακας
            </button>
          </div>
        </div>

        {/* Search & Seasonal Filters */}
        <div className="mt-5 pt-4 border-t border-current/20 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-70" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Αναζήτηση μήνα, θεού (π.χ. Βοηδρομιών, Μαιμακτηριών, Πανσέληνος, Απόλλων, Ήρα)..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border outline-none transition-all shadow-inner ${themeStyles.inputBg}`}
            />
          </div>

          {activeSubTab === "attic" && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className={`text-[11px] whitespace-nowrap opacity-80 ${themeStyles.subtextColor}`}>
                Εποχή:
              </span>
              {["all", "Θέρος", "Φθινόπωρο", "Χειμώνας", "Έαρ"].map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer border ${
                    selectedSeason === season
                      ? themeStyles.subTabActive
                      : `${themeStyles.badgeBg} hover:opacity-80`
                  }`}
                >
                  {season === "all" ? "Όλες" : season}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: 12 ΑΤΤΙΚΟΙ ΜΗΝΕΣ & ΟΠΤΙΚΕΣ ΦΑΣΕΙΣ ΣΕΛΗΝΗΣ */}
      {activeSubTab === "attic" && (
        <div className="space-y-4">
          <div className={`p-4 sm:p-5 rounded-2xl border text-xs leading-relaxed ${themeStyles.sectionBoxBg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>
                🏛️ <strong>Το Αττικό Ημερολόγιο</strong> ήταν <em>Ηλιοσεληνιακό (Lunisolar)</em>. Κάθε μήνας ξεκινούσε αυστηρά με τη <strong>Νουμηνία (🌑 Νέα Σελήνη)</strong>, 
                κορυφωνόταν στη <strong>Διχόμηνιν (🌕 15η-16η Πανσέληνος)</strong> οπότε τελούνταν οι μέγιστες ιερές μυστηριακές εορτές, 
                και ολοκληρωνόταν στην <strong>Ἕνη καὶ Νέα (🌘/🌑 29η-30η σκοτεινή σύνοδος)</strong> με τα «Δείπνα της Εκάτης».
              </p>
              <button
                onClick={() => setActiveSubTab("lunar-solar")}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto cursor-pointer ${themeStyles.buttonAction}`}
              >
                <Orbit className="w-3.5 h-3.5" />
                Ανάλυση Κύκλου Πανσελήνου
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAtticMonths.map((m) => {
              const isExpanded = expandedMonth === m.name;
              return (
                <div
                  key={m.name}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-md flex flex-col ${
                    isExpanded ? themeStyles.cardExpandedBg : themeStyles.cardBg
                  }`}
                >
                  {/* Header of Month Card */}
                  <div
                    onClick={() => setExpandedMonth(isExpanded ? null : m.name)}
                    className={`p-4 flex items-center justify-between cursor-pointer border-b transition-colors border-current/10 ${themeStyles.cardHeaderHover}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border shadow-inner ${themeStyles.badgeBg}`}>
                        {m.atticOrder}ος
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-inherit">{m.name}</h2>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${themeStyles.badgeBg}`}>
                            {m.zodiacSign}
                          </span>
                        </div>
                        <p className={`text-xs ${themeStyles.subtextColor}`}>
                          {m.gregorianSpan} • {m.season}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right hidden sm:block">
                        <span className={`text-xs font-mono font-bold ${themeStyles.numeralAccent}`}>
                          {m.isopsephyValue}
                        </span>
                        <span className={`text-[10px] block opacity-70 ${themeStyles.subtextColor}`}>Πυθμένας: {m.pythmenas}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 opacity-60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 opacity-60" />
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-3">
                      {/* Lunar Cycle Visual Bar for this Attic Month */}
                      <div className={`p-2.5 rounded-xl border ${themeStyles.sectionBoxBg}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold flex items-center gap-1.5 text-[11px] ${themeStyles.accentColor}`}>
                            <Moon className="w-3.5 h-3.5" />
                            Σεληνιακή Εξέλιξη Μηνός ({m.days} Ημέρες):
                          </span>
                          <span className={`text-[10px] font-sans ${themeStyles.subtextColor}`}>
                            1η (Νουμηνία) – 15η (Πανσέληνος) – {m.days}η (Ἕνη & Νέα)
                          </span>
                        </div>

                        {/* Visual icons for month progress */}
                        <div className="grid grid-cols-5 gap-1 text-center text-[10px] py-1 border-t border-current/10">
                          <div className="flex flex-col items-center">
                            <MoonPhaseVisual phase="new" size={20} />
                            <span className="mt-1 font-mono text-[9px] opacity-80">1η Νουμηνία</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <MoonPhaseVisual phase="first_quarter" size={20} />
                            <span className="mt-1 font-mono text-[9px] opacity-80">7η-8η Ἱστάμ.</span>
                          </div>
                          <div className="flex flex-col items-center ring-1 ring-amber-400/40 rounded-lg p-0.5 bg-amber-500/10">
                            <MoonPhaseVisual phase="full" size={20} />
                            <span className="mt-0.5 font-bold text-[9px] text-amber-400">15η Διχόμηνις</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <MoonPhaseVisual phase="last_quarter" size={20} />
                            <span className="mt-1 font-mono text-[9px] opacity-80">22α Φθίνων</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <MoonPhaseVisual phase="dark" size={20} />
                            <span className="mt-1 font-mono text-[9px] opacity-80">{m.days}η Ἕνη & Νέα</span>
                          </div>
                        </div>

                        {/* Full Moon highlight */}
                        <div className="mt-2 pt-1.5 border-t border-current/10 flex items-start gap-1.5 text-[11px]">
                          <span className="text-amber-400 font-bold whitespace-nowrap">🌕 Πανσέληνος:</span>
                          <span className="text-inherit leading-tight">
                            <strong>{m.fullMoonFestival}</strong> — {m.fullMoonSignificance}
                          </span>
                        </div>
                      </div>

                      {/* Dedicated Gods */}
                      <div className={`p-3 rounded-xl border ${themeStyles.sectionBoxBg}`}>
                        <span className={`font-bold flex items-center gap-1.5 text-[11px] mb-1 ${themeStyles.accentColor}`}>
                          <Shield className="w-3.5 h-3.5" />
                          Αφιερωμένες Θεότητες & Επικλήσεις:
                        </span>
                        <p className="font-medium text-inherit">{m.dedicatedGods.join(", ")}</p>
                      </div>

                      {/* Linguistic & Etymological Breakdown */}
                      <div className="space-y-1">
                        <span className={`font-bold text-[11px] flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                          <BookOpen className="w-3.5 h-3.5" />
                          Ετυμολογία & Ανάλυση Συνθετικών:
                        </span>
                        <p className="leading-relaxed text-inherit">{m.etymologyBreakdown}</p>
                      </div>

                      {/* Theological & Mythological Reason */}
                      <div className="space-y-1">
                        <span className={`font-bold text-[11px] flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                          <Flame className="w-3.5 h-3.5" />
                          Θεολογική & Μυθολογική Αιτιολόγηση Αφιέρωσης:
                        </span>
                        <p className="leading-relaxed text-inherit">{m.theologicalReasoning}</p>
                      </div>

                      {/* Expanded In-Depth Details */}
                      {isExpanded && (
                        <div className="space-y-3 pt-1 border-t border-current/10 animate-fadeIn">
                          {/* Rituals and Myths */}
                          <div className="space-y-1">
                            <span className={`font-bold text-[11px] flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                              <Droplets className="w-3.5 h-3.5" />
                              Ιεροπραξίες, Μύθοι & Τελετουργικό Πλαίσιο:
                            </span>
                            <p className="leading-relaxed text-inherit">{m.mythAndRitual}</p>
                          </div>

                          {/* Esoteric & Philosophical Symbolism */}
                          <div className="space-y-1">
                            <span className={`font-bold text-[11px] flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                              <Sparkles className="w-3.5 h-3.5" />
                              Εσωτερικός & Φιλοσοφικός Συμβολισμός:
                            </span>
                            <p className="leading-relaxed italic text-inherit">{m.esotericMeaning}</p>
                          </div>

                          {/* Major Festivals */}
                          <div className="space-y-1">
                            <span className={`font-bold text-[11px] flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                              <Compass className="w-3.5 h-3.5" />
                              Κυριότερες Εορτές & Μυστήρια:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-inherit pl-1">
                              {m.mainFestivals.map((fest, idx) => (
                                <li key={idx} className="leading-snug">
                                  {fest}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Isopsephic calculation info */}
                          <div className={`p-2.5 rounded-xl border text-[11px] ${themeStyles.sectionBoxBg}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">Μαθηματική Ισοψηφία:</span>
                              <span className={`font-mono font-bold ${themeStyles.numeralAccent}`}>
                                {m.name} = {m.isopsephyValue} (Πυθμένας: {m.pythmenas})
                              </span>
                            </div>
                            <p className={`font-mono text-[10px] mt-1 ${themeStyles.subtextColor}`}>
                              {m.isopsephyFormula}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 mt-2 border-t border-current/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className={themeStyles.subtextColor}>
                        Λαϊκό όνομα: <strong className="text-inherit">{m.traditionalGreekName}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(`${m.name} (${m.isopsephyValue}) - ${m.etymologyBreakdown}`)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${themeStyles.buttonAction}`}
                          title="Αντιγραφή στοιχείων μήνα"
                        >
                          {copiedText?.includes(m.name) ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>

                        {onSelectWord && (
                          <button
                            onClick={() => onSelectWord(m.name)}
                            className={`px-2.5 py-1 rounded-lg border font-sans font-bold transition-all cursor-pointer flex items-center gap-1 ${themeStyles.buttonAction}`}
                            title="Αποστολή στον Υπολογιστή Λεξαρίθμων"
                          >
                            <Calculator className="w-3 h-3" />
                            Ισοψηφία ({m.isopsephyValue})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ΣΥΓΧΡΟΝΟΙ ΜΗΝΕΣ & ΕΤΥΜΟΛΟΓΙΑ */}
      {activeSubTab === "modern" && (
        <div className="space-y-4">
          <div className={`p-4 sm:p-5 rounded-2xl border text-xs leading-relaxed ${themeStyles.sectionBoxBg}`}>
            <p>
              🏛️ <strong>Το Σύγχρονο Γρηγοριανό Ημερολόγιο</strong> προέρχεται από το ρωμαϊκό/ιουλιανό ημερολόγιο.
              Οι ονομασίες των μηνών προέρχονται είτε από <strong>Ρωμαϊκές/Ελληνικές θεότητες</strong> (π.χ. Μάρτιος =
              Άρης, Ιούνιος = Ήρα, Μάιος = Μαία), είτε από <strong>ιστορικά πρόσωπα</strong> (Ιούλιος = Ιούλιος Καίσαρας,
              Αύγουστος = Οκταβιανός Αύγουστος), είτε από τη <strong>σειρά αρίθμησης</strong> του αρχικού 10μηνου
              ρωμαϊκού έτους (Σεπτέμβριος=7, Οκτώβριος=8, Νοέμβριος=9, Δεκέμβριος=10).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModernMonths.map((m) => {
              const isExpanded = expandedMonth === m.name;
              return (
                <div
                  key={m.name}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-md flex flex-col ${
                    isExpanded ? themeStyles.cardExpandedBg : themeStyles.cardBg
                  }`}
                >
                  {/* Header of Modern Month Card */}
                  <div
                    onClick={() => setExpandedMonth(isExpanded ? null : m.name)}
                    className={`p-4 flex items-center justify-between cursor-pointer border-b transition-colors border-current/10 ${themeStyles.cardHeaderHover}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border shadow-inner ${themeStyles.badgeBg}`}>
                        {m.order}ος
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-inherit">{m.name}</h2>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${themeStyles.badgeBg}`}>
                            {m.days} Ημέρες
                          </span>
                        </div>
                        <p className={`text-xs ${themeStyles.subtextColor}`}>
                          Λατινικά: <em>{m.latinOrigin}</em> • Αντίστοιχος Αττικός: <strong>{m.correspondingAncientMonth}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right hidden sm:block">
                        <span className={`text-xs font-mono font-bold ${themeStyles.numeralAccent}`}>
                          {m.isopsephyValue}
                        </span>
                        <span className={`text-[10px] block opacity-70 ${themeStyles.subtextColor}`}>Πυθμένας: {m.pythmenas}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 opacity-60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 opacity-60" />
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-2.5">
                      {/* Lunar Highlight */}
                      <div className={`p-2.5 rounded-xl border flex items-center justify-between ${themeStyles.sectionBoxBg}`}>
                        <span className="font-bold flex items-center gap-1 text-[11px] text-amber-400">
                          🌕 Παραδοσιακή Πανσέληνος:
                        </span>
                        <span className="font-medium text-inherit text-[11px]">{m.lunarHighlight}</span>
                      </div>

                      {/* Dedicated Person or Deity */}
                      <div className={`p-2.5 rounded-xl border ${themeStyles.sectionBoxBg}`}>
                        <span className={`font-bold flex items-center gap-1 text-[11px] mb-0.5 ${themeStyles.accentColor}`}>
                          <Shield className="w-3.5 h-3.5" />
                          Αφιέρωση / Προέλευση Ονόματος:
                        </span>
                        <p className="font-medium text-inherit">{m.dedicatedGodOrPerson}</p>
                      </div>

                      {/* Etymology */}
                      <div className="space-y-1">
                        <span className={`font-bold text-[11px] flex items-center gap-1 ${themeStyles.accentColor}`}>
                          <BookOpen className="w-3.5 h-3.5" />
                          Ετυμολογία & Ιστορική Εξήγηση:
                        </span>
                        <p className="leading-relaxed text-inherit">{m.etymologyGreek}</p>
                      </div>

                      {/* Theological & Cultural Context */}
                      <div className="space-y-1">
                        <span className={`font-bold text-[11px] flex items-center gap-1 ${themeStyles.accentColor}`}>
                          <Flame className="w-3.5 h-3.5" />
                          Θεολογικό & Πολιτισμικό Πλαίσιο:
                        </span>
                        <p className="leading-relaxed text-inherit">{m.theologicalContext}</p>
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="space-y-2.5 pt-2 border-t border-current/10 animate-fadeIn">
                          <div className="space-y-1">
                            <span className={`font-bold text-[11px] flex items-center gap-1 ${themeStyles.accentColor}`}>
                              <Droplets className="w-3.5 h-3.5" />
                              Εποχικά & Αγροτικά Χαρακτηριστικά:
                            </span>
                            <p className="leading-relaxed text-inherit">{m.seasonalCharacteristics}</p>
                          </div>

                          <div className="space-y-1">
                            <span className={`font-bold text-[11px] flex items-center gap-1 ${themeStyles.accentColor}`}>
                              <Sparkles className="w-3.5 h-3.5" />
                              Λαϊκή Ελληνική Παράδοση & Παροιμίες:
                            </span>
                            <p className="leading-relaxed italic text-inherit">{m.folkMeaning}</p>
                          </div>

                          <div className={`p-2.5 rounded-xl border text-[11px] ${themeStyles.sectionBoxBg}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">Μαθηματική Ισοψηφία:</span>
                              <span className={`font-mono font-bold ${themeStyles.numeralAccent}`}>
                                {m.name} = {m.isopsephyValue} (Πυθμένας: {m.pythmenas})
                              </span>
                            </div>
                            <p className={`font-mono text-[10px] mt-1 ${themeStyles.subtextColor}`}>
                              {m.isopsephyFormula}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2.5 mt-2 border-t border-current/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className={themeStyles.subtextColor}>
                        Λαϊκά ονόματα: <strong className="text-inherit">{m.traditionalFolkName}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(`${m.name} - ${m.etymologyGreek}`)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${themeStyles.buttonAction}`}
                          title="Αντιγραφή στοιχείων μήνα"
                        >
                          {copiedText?.includes(m.name) ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>

                        {onSelectWord && (
                          <button
                            onClick={() => onSelectWord(m.name)}
                            className={`px-2.5 py-1 rounded-lg border font-sans font-bold transition-all cursor-pointer flex items-center gap-1 ${themeStyles.buttonAction}`}
                            title="Αποστολή στον Υπολογιστή Λεξαρίθμων"
                          >
                            <Calculator className="w-3 h-3" />
                            Ισοψηφία ({m.isopsephyValue})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ΣΕΛΗΝΗ / ΜΗΝΗ / ΜΗΝΙΣ, ΟΠΤΙΚΕΣ ΦΑΣΕΙΣ & ΠΕΡΙΟΔΙΚΟΤΗΤΑ ΠΑΝΣΕΛΗΝΟΥ */}
      {activeSubTab === "lunar-solar" && (
        <div className="space-y-6">
          {/* Main Top Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-xl ${themeStyles.bannerBg}`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md ${themeStyles.bannerIcon}`}>
                <Moon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
                  Οπτικός Σεληνιακός Κύκλος & η Περιοδικότητα της Πανσελήνου
                </h2>
                <p className={`text-xs ${themeStyles.bannerSubtext}`}>
                  Πώς η Σελήνη («Μήνη») όριζε το αρχαίο ελληνικό ημερολόγιο, τα Μεγάλα Μυστήρια και τον ρυθμό των 28 ημερών
                </p>
              </div>
            </div>

            {/* Interactive Lunar Phase Selector */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${themeStyles.sectionBoxBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className={`font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                  <Eye className="w-4 h-4" />
                  Οπτική Αναπαράσταση των 8 Φάσεων της Σελήνης & Αρχαία Ορολογία:
                </span>
                <span className={`text-[11px] ${themeStyles.subtextColor}`}>
                  Κάντε κλικ σε μία φάση για λεπτομερή επεξήγηση
                </span>
              </div>

              {/* Visual Moon Selector Strip */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {LUNAR_PHASES_DATA.map((phase) => {
                  const isSelected = selectedMoonPhase === phase.key;
                  return (
                    <button
                      key={phase.key}
                      onClick={() => setSelectedMoonPhase(phase.key)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                        isSelected ? themeStyles.lunarPillActive : themeStyles.lunarPillInactive
                      }`}
                    >
                      <MoonPhaseVisual phase={phase.svgVisual} size={28} />
                      <span className="text-[10px] font-bold leading-tight">{phase.greekName.split("/")[0]}</span>
                      <span className="text-[9px] opacity-75 font-mono">{phase.daySpan.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Phase Details */}
              <div className="mt-4 pt-4 border-t border-current/15 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-black/30 border border-current/20 flex items-center justify-center">
                    <MoonPhaseVisual phase={activePhaseData.svgVisual} size={48} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-inherit">{activePhaseData.greekName}</h3>
                    <p className={`text-xs font-mono font-bold ${themeStyles.numeralAccent}`}>
                      {activePhaseData.ancientAtticName}
                    </p>
                    <span className={`text-[10px] block opacity-80 ${themeStyles.subtextColor}`}>
                      {activePhaseData.daySpan}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className={`font-bold text-[11px] flex items-center gap-1 ${themeStyles.accentColor}`}>
                    <Compass className="w-3 h-3" />
                    Αστρονομική & Ημερολογιακή Φύση:
                  </span>
                  <p className="text-xs leading-relaxed text-inherit">{activePhaseData.description}</p>
                </div>

                <div className="space-y-1">
                  <span className={`font-bold text-[11px] flex items-center gap-1 ${themeStyles.accentColor}`}>
                    <Shield className="w-3 h-3" />
                    Τελετουργική & Μυστηριακή Σημασία:
                  </span>
                  <p className="text-xs leading-relaxed text-inherit">{activePhaseData.ritualSignificance}</p>
                  <p className={`text-[10px] mt-1 italic ${themeStyles.subtextColor}`}>
                    Συνδεδεμένες Θεότητες: <strong>{activePhaseData.deity}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Deep Theological & Astronomical Connections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 shadow-sm ${themeStyles.sectionBoxBg}`}>
                <h3 className={`font-bold text-sm flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                  🌕 1. Γιατί η Πανσέληνος ήταν το Κέντρο των Αρχαίων Μυστηρίων;
                </h3>
                <p className="text-inherit">
                  Στον αρχαίο ελληνικό κόσμο, η <strong>Διχόμηνις (15η-16η ημέρα / Πανσέληνος)</strong> αποτελούσε τη
                  στιγμή της <strong>απόλυτης συμπαντικής ένωσης και ορατότητας</strong>: ο Ήλιος δύει στη δύση ακριβώς
                  τη στιγμή που η Σελήνη ανατέλλει στην ανατολή.
                </p>
                <p className="text-inherit">
                  Αυτή η πληρότητα φωτός επέτρεπε τις <strong>ολονύκτιες πομπές (Παννυχίδες)</strong> και τα μεγάλα μυστήρια:
                  τα <em>Ελευσίνια Μυστήρια</em> (Πανσέληνος Βοηδρομιώνος), οι <em>Ολυμπιακοί Αγώνες</em> (Πανσέληνος Εκατομβαιώνος/Μεταγειτνιώνος),
                  τα <em>Μουνίχια</em> (Πανσέληνος Μουνιχιώνος με τους αναμμένους αμφιφώντες πλακούντες) και τα <em>Θεογάμια</em>.
                </p>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 shadow-sm ${themeStyles.sectionBoxBg}`}>
                <h3 className={`font-bold text-sm flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                  🔄 2. Ο Μετωνικός Κύκλος των 19 Ετών & ο Εμβόλιμος Μήνας
                </h3>
                <p className="text-inherit">
                  Καθώς 12 σεληνιακοί μήνες διαρκούν <strong>354 ημέρες</strong> (11 λιγότερες από το ηλιακό έτος των 365,25 ημερών), 
                  οι αρχαίοι Έλληνες αστρονόμοι (Μέτων ο Αθηναίος, 432 π.Χ.) ανακάλυψαν τον <strong>Μετωνικό Κύκλο των 19 ηλιακών ετών</strong>, 
                  ο οποίος ισούται ακριβώς με <strong>235 σεληνιακούς μήνες</strong>.
                </p>
                <p className="text-inherit">
                  Για να παραμένουν οι εποχές και οι εορτές σταθερές, εισήγαγαν <strong>7 εμβόλιμους μήνες</strong> ανά 19ετία 
                  (τον δεύτερο <em>Ποσειδεώνα Β΄</em>), επιτυγχάνοντας τέλεια αρμονία ανάμεσα στις φάσεις της Σελήνης και στις ισημερίες/ηλιοστάσια του Ηλίου.
                </p>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 shadow-sm ${themeStyles.sectionBoxBg}`}>
                <h3 className={`font-bold text-sm flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                  🩸 3. Ο Βιολογικός Κύκλος των 28 Ημερών & η Θεά Άρτεμις
                </h3>
                <p className="text-inherit">
                  Η λέξη <strong>«μείς / μήν / μήνας»</strong> προέρχεται από τη <strong>«Μήνη»</strong> (Σελήνη, ρίζα <em>*meh₁-</em> = μετρώ).
                  Η ανθρώπινη γονιμότητα και ο γυναικείος καταμήνιος κύκλος (έμμηνος ρύση) διαρκεί <strong>28 ημέρες</strong> (4 × 7 ημέρες των σεληνιακών τετάρτων).
                </p>
                <p className="text-inherit">
                  Γι' αυτό η <strong>Άρτεμις</strong> (Σεληνιακή θεά) λατρευόταν ως <em>Λοχεία</em> και <em>Ειλείθυια</em>, 
                  προστατεύοντας τον τοκετό και ρυθμίζοντας τα στάδια της ανθρώπινης ζωής σε πλήρη αντιστοιχία με τις σεληνιακές φάσεις.
                </p>
              </div>

              <div className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 shadow-sm ${themeStyles.sectionBoxBg}`}>
                <h3 className={`font-bold text-sm flex items-center gap-1.5 ${themeStyles.accentColor}`}>
                  ⚡ 4. Μῆνις (Ιλιάδα) & Ισοψηφική Αριθμολογία Σελήνης
                </h3>
                <p className="text-inherit">
                  Η λέξη <strong>«Μῆνις»</strong> (η πρώτη λέξη της Ιλιάδας: <em>«Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος»</em>) 
                  ανάγεται στη ρίζα <em>*men-</em> (μένω, μένος, μνήμη). Είναι η οργή που <strong>«μένει για μήνες»</strong> 
                  και υπόκειται στους παλιρροϊκούς κύκλους της Σελήνης.
                </p>
                <ul className="space-y-1 text-inherit pt-1 border-t border-current/10">
                  <li className="flex items-center justify-between">
                    <span>ΜΗΝΗ:</span>
                    <strong className={`font-mono ${themeStyles.numeralAccent}`}>40 + 8 + 50 + 8 = 106 (Πυθμ. 7)</strong>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>ΣΕΛΗΝΗ:</span>
                    <strong className={`font-mono ${themeStyles.numeralAccent}`}>200 + 5 + 30 + 8 + 50 + 8 = 301 (Πυθμ. 4)</strong>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>ΜΗΝΙΣ:</span>
                    <strong className={`font-mono ${themeStyles.numeralAccent}`}>40 + 8 + 50 + 10 + 200 = 308 (Πυθμ. 2)</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: ΧΑΡΤΗΣ ΕΝΙΑΥΤΟΥ & ΜΕΓΑ ΕΝΙΑΥΤΟΥ (25.920 & 2.160 ΕΤΗ - 12 ΖΩΔΙΑ «ΖΩ...ΔΙΑ») */}
      {activeSubTab === "great-year" && (
        <MegasEniautosMap theme={theme} onSelectWord={onSelectWord} />
      )}

      {/* SUB-TAB 4: ΣΥΓΚΡΙΤΙΚΟΣ ΠΙΝΑΚΑΣ 12 ΑΤΤΙΚΩΝ & 12 ΣΥΓΧΡΟΝΩΝ ΜΗΝΩΝ */}
      {activeSubTab === "compare" && (
        <div className="space-y-4">
          <div className={`p-4 sm:p-5 rounded-2xl border text-xs leading-relaxed ${themeStyles.sectionBoxBg}`}>
            <p>
              📜 <strong>Συνοπτικός Πίνακας Αντιστοίχισης:</strong> Πώς οι 12 αρχαίοι Αττικοί μήνες συσχετίζονται με
              τους 12 σύγχρονους μήνες, τα λαϊκά ελληνικά ονόματα, τις αφιερωμένες θεότητες, τη σημασία της Πανσελήνου και τις ισοψηφικές τους αξίες.
            </p>
          </div>

          <div className={`rounded-2xl border overflow-x-auto shadow-md ${themeStyles.cardBg}`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${themeStyles.tableHeader}`}>
                  <th className="p-3"># Αττικού</th>
                  <th className="p-3">Αττικός Μήνας</th>
                  <th className="p-3">Σύγχρονη Περίοδος</th>
                  <th className="p-3">Αφιερωμένος Θεός</th>
                  <th className="p-3">Κύρια Πανσέληνος</th>
                  <th className="p-3">Λαϊκό Όνομα</th>
                  <th className="p-3 text-right">Ισοψηφία</th>
                  <th className="p-3 text-center">Ενέργεια</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/10">
                {ANCIENT_ATTIC_MONTHS.map((m, idx) => (
                  <tr
                    key={m.name}
                    className={`transition-colors ${
                      idx % 2 === 0 ? themeStyles.tableRowEven : themeStyles.tableRowOdd
                    } hover:opacity-90`}
                  >
                    <td className="p-3 font-mono font-bold">{m.atticOrder}ος</td>
                    <td className="p-3 font-bold text-inherit">{m.name}</td>
                    <td className="p-3">{m.gregorianSpan}</td>
                    <td className="p-3 font-medium">{m.dedicatedGods[0]}</td>
                    <td className="p-3 text-amber-400 font-medium">🌕 {m.fullMoonFestival.split("/")[0]}</td>
                    <td className="p-3 italic">{m.traditionalGreekName}</td>
                    <td className={`p-3 text-right font-mono font-bold ${themeStyles.numeralAccent}`}>
                      {m.isopsephyValue}
                    </td>
                    <td className="p-3 text-center">
                      {onSelectWord && (
                        <button
                          onClick={() => onSelectWord(m.name)}
                          className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold border transition-all cursor-pointer ${themeStyles.buttonAction}`}
                          title="Υπολογισμός Ισοψηφίας"
                        >
                          <Calculator className="w-2.5 h-2.5 inline mr-1" />
                          {m.isopsephyValue}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
