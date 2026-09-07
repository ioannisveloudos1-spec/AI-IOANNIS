import React, { useRef, useState, useEffect } from "react";
import { TabType } from "../types";
import { AppTheme, APP_THEMES } from "../utils/theme";
import {
  Calculator,
  Search,
  Calendar,
  BarChart3,
  BookMarked,
  BookOpen,
  Sparkles,
  Key,
  ChevronLeft,
  ChevronRight,
  Compass,
  GitCompare,
  Grid,
  Network,
  FileText,
  Binary,
  Box,
  Globe,
  Gamepad2,
  SpellCheck,
  Type,
  Sun,
  Shield,
  Moon,
  Scroll,
  ScrollText,
  Feather,
  Palette,
  Cpu,
  SlidersHorizontal,
  LayoutGrid,
  BookOpenCheck,
} from "lucide-react";
import appLogoImg from "../assets/images/ego_eimi_logo_1787417709332.jpg";

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedCount: number;
  onOpenAiAssistant: () => void;
  onOpenApiKeyModal: () => void;
  onOpenPortalGate?: () => void;
  onOpenExportReport?: () => void;
  onOpenFontModal?: () => void;
  onOpenThemeModal?: () => void;
  currentFontName?: string;
  hasCustomApiKey?: boolean;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenAiAssistant,
  onOpenApiKeyModal,
  onOpenPortalGate,
  onOpenExportReport,
  onOpenFontModal,
  onOpenThemeModal,
  currentFontName,
  hasCustomApiKey = false,
  theme = "dark-ancient",
  onToggleTheme,
}) => {
  const tabs = [
    { id: "europe" as TabType, label: "Ευρώπη", icon: BookOpenCheck, desc: "Μυθιστόρημα: Η Μυθική Ευρώπη, ο Ταύρος & τα Ιερά Σύμβολα" },
    { id: "calculator" as TabType, label: "Υπολογισμός", icon: Calculator, desc: "Μεμονωμένες λέξεις & πράξεις" },
    { id: "search" as TabType, label: "Αναζήτηση", icon: Search, desc: "Ανάλυση κειμένου & συνδυασμοί" },
    { id: "golden-verses" as TabType, label: "Χρυσά Έπη", icon: ScrollText, desc: "Τα Χρυσά Έπη του Πυθαγόρα (Αρχαίο & Νεοελληνική)" },
    { id: "solar-iota-danaos" as TabType, label: "Ι & ΔΑ-ΝΑΟΣ", icon: Sun, desc: "Το Ηλιακόν Ι (1111), ο ΔΑ-ΝΑΟΣ, η Ιερά Τετρακτύς, Infernus, Beatrice (666=666) & Μακάρια" },
    { id: "calendar" as TabType, label: "Ημερολόγιο", icon: Calendar, desc: "Αττικοί & Σύγχρονοι Μήνες, Θεοί & Σελήνη" },
    { id: "cosmic-journey" as TabType, label: "Κοσμική Ανάταση", icon: Sparkles, desc: "Διαδραστικό μυθολογικό ταξίδι 4 Πράξεων & Επίγνωσης" },
    { id: "online-finder" as TabType, label: "Ανιχνευτής Web", icon: Globe, desc: "Online λεξικά, URL & 1119" },
    { id: "bridges" as TabType, label: "Γέφυρες", icon: GitCompare, desc: "Σύγκριση & μαθηματικές σχέσεις" },
    { id: "anagrams" as TabType, label: "Matrix 3×3", icon: Grid, desc: "Αναγραμματισμοί & Πυθαγόρειο Matrix" },
    { id: "grammatari" as TabType, label: "ΓΡΑΜΜΑΤΑΡΙ", icon: SpellCheck, desc: "Υπο-Αναγραμματισμοί 4-9 γραμμάτων" },
    { id: "graph" as TabType, label: "Χάρτης Σταθμών", icon: Network, desc: "Δίκτυο κόμβων & συνδέσεων" },
    { id: "veloudion" as TabType, label: "ΒΕΛΟΥΔΙΟΝ", icon: Binary, desc: "Τριαδική κρυπτογραφία & 8 Συστήματα" },
    { id: "cube-apollo" as TabType, label: "Κύβος 1331", icon: Box, desc: "3D Κύβος Απόλλωνος (11³)" },
    { id: "solar-square" as TabType, label: "Τετράγωνο Ηλίου", icon: Sun, desc: "Μαγικό Τετράγωνο 6×6, 111 & 666" },
    { id: "seed-of-light" as TabType, label: "Σπόρος Φωτός", icon: Sparkles, desc: "A SEED OF LIGHT = 666, 1331 & Ήλιος" },
    { id: "enotheism" as TabType, label: "Ενοθεϊσμός", icon: Shield, desc: "Ζευς, Άδης, Ποσειδών, Απόλλων, Διόνυσος, Ηρακλής & Το Εν" },
    { id: "game" as TabType, label: "Αρένα & Παιχνίδι", icon: Gamepad2, desc: "Κουίζ λεξαρίθμων & Μάχη 60s" },
    { id: "stats" as TabType, label: "Στατιστικά", icon: BarChart3, desc: "Οπτικοποίηση, γραφήματα & CSV" },
    { id: "archive" as TabType, label: "Θησαυρός", icon: BookMarked, desc: "Αποθηκευμένες λέξεις & φράσεις λεξαρίθμων", badge: savedCount },
    { id: "guide" as TabType, label: "Οδηγός & 666", icon: BookOpen, desc: "Ιωνική αρίθμηση, 666 & κανόνες" },
  ];

  const navScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollControls, setShowScrollControls] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState<boolean>(false);

  const checkScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      const isOverflowing = scrollWidth > clientWidth + 4;
      setShowScrollControls(isOverflowing);
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    if (navScrollRef.current) {
      const activeEl = navScrollRef.current.querySelector(`#nav-tab-${currentTab}`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
    checkScroll();
  }, [currentTab]);

  const handleNavWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (navScrollRef.current && Math.abs(e.deltaY) > 0) {
      navScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (navScrollRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      navScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <header className="border-b border-[#2d251e] bg-[#14120f]/95 backdrop-blur-md sticky top-0 z-40 pt-2 pb-2 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col gap-2.5 w-full">
          
          {/* Row 1: Centered, Prominent, Large & Distinct Logo & Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 py-1 w-full text-center">
            <div
              onClick={() => onSelectTab("calculator")}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#ffd700] via-[#c89b3c] to-[#784e15] p-[2.5px] shadow-2xl shadow-amber-950/80 shrink-0 overflow-hidden ring-2 ring-amber-400/60 cursor-pointer hover:scale-105 transition-transform"
              title="ΕΓΩ ΕΙΜΙ - ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ (Μετάβαση στην Αρχική)"
            >
              <img
                src={appLogoImg}
                alt="ΕΓΩ ΕΙΜΙ - ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ"
                className="w-full h-full object-cover rounded-[13px]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <h1
                  onClick={() => onSelectTab("calculator")}
                  className="text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-widest text-[#f5ecd8] cursor-pointer hover:text-[#ffd700] transition-colors"
                >
                  ΛΕΞΑΡΙΘΜΟΣ
                </h1>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest px-2 py-0.5 rounded-md bg-gradient-to-r from-[#3a2c1b] to-[#251b11] text-[#ffd700] border border-amber-500/60 font-sans font-bold shadow-xs">
                  Ιωνικη
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#d4c3aa] font-serif tracking-wide mt-0.5">
                Ελληνική Ισοψηφία & Στατιστική • <strong className="text-[#ffd700] font-semibold">Ιωάννης Βελούδος</strong>
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#a89984] font-serif italic mt-0.5">
                «ΕΓΩ ΕΙΜΙ» (870) • Αιώνιος Συμπαντικός Κώδικας
              </p>
            </div>
          </div>

          {/* Row 2: Action Tools Bar - Responsive, Centered & Contained Within Screen Bounds */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap w-full py-1">
            {/* The Prominent "ΚΑΡΤΕΛΕΣ" Button */}
            <button
              type="button"
              onClick={() => onSelectTab("all-tabs")}
              id="header-all-tabs-portal-btn"
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border font-serif font-bold transition-all shadow-md cursor-pointer shrink-0 min-h-[38px] ${
                currentTab === "all-tabs"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-[#140e08] border-amber-300 ring-2 ring-amber-400/60 shadow-amber-950/50"
                  : "bg-gradient-to-r from-[#2c1d12] via-[#3a2718] to-[#2c1d12] hover:from-[#3d291a] hover:to-[#4e3421] border-amber-500/80 text-[#ffd700] hover:text-white shadow-amber-950/40"
              }`}
              title="Πύλη Συντομεύσεων: Προβολή όλων των 21 καρτελών σε μεγάλο πίνακα"
            >
              <LayoutGrid className="w-4 h-4 text-[#ffd700]" />
              <span className="tracking-wider uppercase text-xs sm:text-sm font-bold">
                ΚΑΡΤΕΛΕΣ
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/80 border border-amber-500/50 text-[#ffd700]">
                21
              </span>
            </button>

            {/* Theme Selector */}
            <button
              onClick={onOpenThemeModal || onToggleTheme}
              id="header-theme-toggle-btn"
              className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-amber-600/50 bg-[#1c1610] hover:bg-[#281f15] text-[#d6c7b2] hover:text-[#ffd700] text-xs font-serif transition-all shadow-sm cursor-pointer min-h-[38px]"
              title="Επιλογή Εμφάνισης (6 Θέματα)"
            >
              <Palette className="w-3.5 h-3.5 text-[#e6c670]" />
              <span className="text-[11px] font-sans font-medium">Θέμα</span>
            </button>

            {/* Font Selector */}
            {onOpenFontModal && (
              <button
                onClick={onOpenFontModal}
                id="header-font-selector-btn"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#1c1610] hover:bg-[#281f15] border border-amber-600/50 text-xs font-serif text-[#d6c7b2] hover:text-[#e6c670] transition-all shadow-sm cursor-pointer min-h-[38px]"
                title={`Επιλογή Αρχαιοελληνικής Γραμματοσειράς (${currentFontName || "Didot"})`}
              >
                <Type className="w-3.5 h-3.5 text-[#e6c670]" />
                <span className="text-[11px] font-sans font-medium">Γραμματοσειρά</span>
              </button>
            )}

            {/* Report Export */}
            {onOpenExportReport && (
              <button
                onClick={onOpenExportReport}
                id="header-export-report-btn"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#1c1610] hover:bg-[#281f15] border border-amber-600/50 text-xs font-serif text-[#d6c7b2] hover:text-[#e6c670] transition-all shadow-sm cursor-pointer min-h-[38px]"
                title="Εξαγωγή Αναλυτικής Αναφοράς / PDF"
              >
                <FileText className="w-3.5 h-3.5 text-[#c89b3c]" />
                <span className="text-[11px] font-sans font-medium">Έκθεση</span>
              </button>
            )}

            {/* Secret Portal Gate */}
            {onOpenPortalGate && (
              <button
                onClick={onOpenPortalGate}
                id="header-portal-gate-btn"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#1c1610] hover:bg-[#281f15] border border-amber-500/60 text-xs font-serif text-[#ffd700] hover:text-white transition-all shadow-sm cursor-pointer min-h-[38px]"
                title="Μυστική Πύλη Λαυρείου (ΒΕΛΟΣ + ΟΥΔΟΣ)"
              >
                <Compass className="w-3.5 h-3.5 text-[#ffd700]" />
                <span className="text-[11px] font-sans font-medium">Πύλη</span>
              </button>
            )}

            {/* Gemini API Key */}
            <button
              onClick={onOpenApiKeyModal}
              id="header-api-key-btn"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#1c1610] hover:bg-[#281f15] border border-amber-600/50 text-xs font-serif text-[#e6c670] transition-colors relative shadow-sm cursor-pointer min-h-[38px]"
              title="Ρύθμιση API Key (AI ΙΩΑΝΝΗΣ)"
            >
              <Key className="w-3.5 h-3.5 text-[#e6c670]" />
              <span className="text-[11px] font-sans font-medium">API Key</span>
              {hasCustomApiKey ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-950 animate-pulse" title="Προσωπικό κλειδί ενεργό" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c7e6c]" />
              )}
            </button>

            {/* AI Assistant */}
            <button
              onClick={onOpenAiAssistant}
              id="header-ai-assistant-btn"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c] hover:border-[#ffd700] text-[#f5ecd8] text-xs font-serif shadow-md shadow-[#c89b3c]/20 transition-all active:scale-95 cursor-pointer min-h-[38px]"
              title="Τ.Ν. ΙΩΑΝΝΗΣ 1.0 - Φιλολογική & Ισοψηφική Ερμηνεία"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold font-sans whitespace-nowrap text-[#ffd700]">Τ.Ν. ΙΩΑΝΝΗΣ</span>
            </button>
          </div>

          {/* Navigation Bar with Luxury Gold Controls & Full Screen Width */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative w-full min-w-0 pt-0.5">
            {/* Left Scroll Button (Gold Arrow) */}
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Κύλιση αριστερά"
              className={`p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 z-10 min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation ${
                canScrollLeft
                  ? "bg-gradient-to-r from-[#2d2215] to-[#3a2c1b] border-[#c89b3c] text-[#e6c670] hover:text-[#fff] hover:border-[#e6c670] shadow-md shadow-[#c89b3c]/20 active:scale-95 cursor-pointer"
                  : "bg-[#181410] border-[#2d2419] text-[#554637] opacity-40 cursor-not-allowed"
              }`}
              title="Κύλιση αριστερά"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Scrollable Tabs Wrapper (Takes up remaining flex space with min-w-0 so it never overflows or pushes the right arrow off-screen) */}
            <div
              ref={navScrollRef}
              onScroll={checkScroll}
              onWheel={handleNavWheel}
              className="flex-1 min-w-0 flex items-center space-x-1 p-1 bg-[#191511] rounded-xl border border-[#33271c] overflow-x-auto gold-scrollbar scroll-smooth shadow-inner shadow-black/40"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] sm:min-h-[44px] touch-manipulation ${
                      isActive
                        ? "bg-gradient-to-r from-[#332616] via-[#42331f] to-[#332616] text-[#f5ecd8] border border-[#c89b3c] shadow-md shadow-[#c89b3c]/15 font-bold"
                        : "text-[#a69680] hover:text-[#e8dfd1] hover:bg-[#231e18]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#e6c670]" : "text-[#8c7e6c]"}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-[#c89b3c] text-[#14120f]" : "bg-[#2f271e] text-[#c89b3c]"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button (Gold Arrow) - ALWAYS visible and glowing when more tabs exist to the right */}
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Κύλιση δεξιά"
              className={`p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 z-10 min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation ${
                canScrollRight
                  ? "bg-gradient-to-r from-[#3a2c1b] to-[#2d2215] border-[#c89b3c] text-[#ffd700] hover:text-[#fff] hover:border-[#e6c670] shadow-md shadow-[#c89b3c]/40 ring-1 ring-[#c89b3c]/70 active:scale-95 cursor-pointer animate-pulse"
                  : "bg-[#181410] border-[#2d2419] text-[#554637] opacity-40 cursor-not-allowed"
              }`}
              title="Κύλιση δεξιά (περισσότερες καρτέλες)"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
