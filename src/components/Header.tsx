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
  Smartphone,
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
  onOpenInstallModal?: () => void;
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
  onOpenInstallModal,
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

  // Theme flags for distinct, high-contrast styling across all 6 themes
  const isParchment = theme === "parchment" || theme === "ancient-calligraphy";
  const isSolar = theme === "solar";
  const isLight = isParchment || isSolar;
  const isEthereal = theme === "ethereal";
  const isCyberTech = theme === "cyber-tech";

  // Header background & border classes per theme
  const headerContainerClass = isParchment
    ? "border-b border-[#bfa37c] bg-[#f8f4ec]/98 shadow-[0_2px_12px_rgba(90,60,25,0.08)] backdrop-blur-md sticky top-0 z-40 pt-2 pb-2 w-full max-w-full transition-colors"
    : isSolar
    ? "border-b border-[#deb673] bg-[#fffdf5]/98 shadow-[0_2px_12px_rgba(217,119,6,0.08)] backdrop-blur-md sticky top-0 z-40 pt-2 pb-2 w-full max-w-full transition-colors"
    : isEthereal
    ? "border-b border-[#1e293b] bg-[#060913]/98 shadow-[0_2px_12px_rgba(56,189,248,0.08)] backdrop-blur-md sticky top-0 z-40 pt-2 pb-2 w-full max-w-full transition-colors"
    : isCyberTech
    ? "border-b border-[#134e4a] bg-[#090d14]/98 shadow-[0_2px_12px_rgba(16,185,129,0.08)] backdrop-blur-md sticky top-0 z-40 pt-2 pb-2 w-full max-w-full transition-colors"
    : "border-b border-[#2d251e] bg-[#14120f]/95 backdrop-blur-md sticky top-0 z-40 pt-2 pb-2 w-full max-w-full transition-colors";

  // Title styling
  const titleClass = isParchment
    ? "text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-widest text-[#2b1704] hover:text-[#783d07] cursor-pointer transition-colors drop-shadow-sm"
    : isSolar
    ? "text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-widest text-[#2b1400] hover:text-[#b45309] cursor-pointer transition-colors drop-shadow-sm"
    : isEthereal
    ? "text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-widest text-[#f0f9ff] hover:text-[#38bdf8] cursor-pointer transition-colors drop-shadow-md"
    : isCyberTech
    ? "text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-widest text-[#ecfeff] hover:text-[#10b981] cursor-pointer transition-colors drop-shadow-md"
    : "text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-widest text-[#f5ecd8] hover:text-[#ffd700] cursor-pointer transition-colors drop-shadow-md";

  // System Badge (ΙΩΝΙΚΗ)
  const ionianBadgeClass = isParchment
    ? "text-xs uppercase tracking-widest px-2.5 py-1 rounded-md bg-gradient-to-r from-[#783d07] to-[#9a520e] text-[#ffffff] border border-[#b8752a] font-sans font-bold shadow-xs"
    : isSolar
    ? "text-xs uppercase tracking-widest px-2.5 py-1 rounded-md bg-gradient-to-r from-[#b45309] to-[#d97706] text-[#ffffff] border border-[#f59e0b] font-sans font-bold shadow-xs"
    : isEthereal
    ? "text-xs uppercase tracking-widest px-2.5 py-1 rounded-md bg-gradient-to-r from-[#0c1427] to-[#132242] text-[#38bdf8] border border-[#38bdf8]/60 font-sans font-bold shadow-xs"
    : isCyberTech
    ? "text-xs uppercase tracking-widest px-2.5 py-1 rounded-md bg-gradient-to-r from-[#064e3b] to-[#022c22] text-[#34d399] border border-[#10b981]/60 font-sans font-bold shadow-xs"
    : "text-xs uppercase tracking-widest px-2.5 py-1 rounded-md bg-gradient-to-r from-[#3a2c1b] to-[#251b11] text-[#ffd700] border border-amber-500/60 font-sans font-bold shadow-xs";

  // Subtitle Texts
  const subtextClass = isLight
    ? "text-[#5c3e21]"
    : isEthereal || isCyberTech
    ? "text-[#94a3b8]"
    : "text-[#d4c3aa]";

  const authorNameClass = isParchment
    ? "text-[#783d07] font-bold text-sm sm:text-lg tracking-wider whitespace-nowrap"
    : isSolar
    ? "text-[#b45309] font-bold text-sm sm:text-lg tracking-wider whitespace-nowrap"
    : isEthereal
    ? "text-[#38bdf8] font-bold text-sm sm:text-lg tracking-wider whitespace-nowrap"
    : isCyberTech
    ? "text-[#10b981] font-bold text-sm sm:text-lg tracking-wider whitespace-nowrap"
    : "text-[#ffd700] font-bold text-sm sm:text-lg tracking-wider whitespace-nowrap";

  const quoteClass = isParchment
    ? "text-xs sm:text-sm text-[#9a520e] font-serif italic mt-0.5 font-semibold whitespace-nowrap"
    : isSolar
    ? "text-xs sm:text-sm text-[#d97706] font-serif italic mt-0.5 font-semibold whitespace-nowrap"
    : isEthereal
    ? "text-xs sm:text-sm text-[#818cf8] font-serif italic mt-0.5 font-semibold whitespace-nowrap"
    : isCyberTech
    ? "text-xs sm:text-sm text-[#06b6d4] font-serif italic mt-0.5 font-semibold whitespace-nowrap"
    : "text-xs sm:text-sm text-[#e6c670] font-serif italic mt-0.5 font-medium whitespace-nowrap";

  // "ΚΑΡΤΕΛΕΣ" Button styling
  const isAllTabsActive = currentTab === "all-tabs";
  const allTabsBtnClass = isAllTabsActive
    ? isLight
      ? "bg-gradient-to-r from-[#783d07] to-[#9a520e] text-[#ffffff] border-[#b8752a] ring-2 ring-[#9a520e]/40 shadow-md"
      : isEthereal
      ? "bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-[#040816] border-[#7dd3fc] ring-2 ring-[#38bdf8]/50 shadow-md font-bold"
      : isCyberTech
      ? "bg-gradient-to-r from-[#059669] to-[#10b981] text-[#022c22] border-[#6ee7b7] ring-2 ring-[#10b981]/50 shadow-md font-bold"
      : "bg-gradient-to-r from-amber-500 to-amber-600 text-[#140e08] border-amber-300 ring-2 ring-amber-400/60 shadow-amber-950/50"
    : isParchment
    ? "bg-[#ebdcc5] hover:bg-[#dfcdb4] border-[#bfa37c] hover:border-[#783d07] text-[#2b1704] hover:text-[#000000] shadow-sm"
    : isSolar
    ? "bg-[#faebd0] hover:bg-[#f5deb3] border-[#deb673] hover:border-[#b45309] text-[#2b1400] hover:text-[#000000] shadow-sm"
    : isEthereal
    ? "bg-[#0c1427] hover:bg-[#132242] border-[#1e3a8a] hover:border-[#38bdf8] text-[#e0f2fe] hover:text-white shadow-sm"
    : isCyberTech
    ? "bg-[#0c1524] hover:bg-[#112035] border-[#065f46] hover:border-[#10b981] text-[#ecfeff] hover:text-white shadow-sm"
    : "bg-gradient-to-r from-[#2c1d12] via-[#3a2718] to-[#2c1d12] hover:from-[#3d291a] hover:to-[#4e3421] border-amber-500/80 text-[#ffd700] hover:text-white shadow-amber-950/40";

  const allTabsIconClass = isAllTabsActive
    ? isLight ? "text-white" : isEthereal ? "text-[#040816]" : isCyberTech ? "text-[#022c22]" : "text-[#140e08]"
    : isLight ? "text-[#783d07]" : isEthereal ? "text-[#38bdf8]" : isCyberTech ? "text-[#10b981]" : "text-[#ffd700]";

  const allTabsBadgeClass = isAllTabsActive
    ? isLight ? "bg-white/30 border-white/40 text-white" : "bg-black/30 border-black/40 text-current"
    : isLight ? "bg-[#783d07] border-[#b8752a] text-white" : isEthereal ? "bg-[#1e293b] border-[#38bdf8]/40 text-[#38bdf8]" : isCyberTech ? "bg-[#064e3b] border-[#10b981]/40 text-[#34d399]" : "bg-amber-950/80 border-amber-500/50 text-[#ffd700]";

  // Secondary Header Tools Buttons (Theme, Font, Report, Portal, Shortcut, Key)
  const secondaryBtnClass = isParchment
    ? "bg-[#ebdcc5] hover:bg-[#dfcdb4] border-[#bfa37c] hover:border-[#783d07] text-[#2b1704] hover:text-[#000000] text-xs font-serif shadow-xs cursor-pointer min-h-[38px] transition-all"
    : isSolar
    ? "bg-[#faebd0] hover:bg-[#f5deb3] border-[#deb673] hover:border-[#b45309] text-[#2b1400] hover:text-[#000000] text-xs font-serif shadow-xs cursor-pointer min-h-[38px] transition-all"
    : isEthereal
    ? "bg-[#0c1427] hover:bg-[#132242] border-[#1e3a8a] hover:border-[#38bdf8] text-[#cbd5e1] hover:text-[#38bdf8] text-xs font-serif shadow-xs cursor-pointer min-h-[38px] transition-all"
    : isCyberTech
    ? "bg-[#0c1524] hover:bg-[#112035] border-[#065f46] hover:border-[#10b981] text-[#cbd5e1] hover:text-[#34d399] text-xs font-serif shadow-xs cursor-pointer min-h-[38px] transition-all"
    : "bg-[#1c1610] hover:bg-[#281f15] border border-amber-600/50 hover:border-amber-500 text-[#d6c7b2] hover:text-[#ffd700] text-xs font-serif shadow-sm cursor-pointer min-h-[38px] transition-all";

  const secondaryIconClass = isLight
    ? "text-[#783d07]"
    : isEthereal
    ? "text-[#38bdf8]"
    : isCyberTech
    ? "text-[#10b981]"
    : "text-[#e6c670]";

  // AI Assistant Button ("Τ.Ν. ΙΩΑΝΝΗΣ")
  const aiBtnClass = isParchment
    ? "bg-gradient-to-r from-[#783d07] via-[#9a520e] to-[#783d07] hover:from-[#8c4709] hover:to-[#ab5b10] border border-[#b8752a] text-[#ffffff] shadow-md shadow-[#783d07]/25 active:scale-95 cursor-pointer min-h-[38px] transition-all"
    : isSolar
    ? "bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#b45309] hover:from-[#c25e0a] hover:to-[#ea580c] border border-[#f59e0b] text-[#ffffff] shadow-md shadow-[#b45309]/25 active:scale-95 cursor-pointer min-h-[38px] transition-all"
    : isEthereal
    ? "bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] hover:from-[#312e81] hover:to-[#3730a3] border border-[#818cf8] text-[#f0f9ff] shadow-md shadow-[#818cf8]/20 active:scale-95 cursor-pointer min-h-[38px] transition-all"
    : isCyberTech
    ? "bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#022c22] hover:from-[#064e3b] hover:to-[#047857] border border-[#10b981] text-[#ecfdf5] shadow-md shadow-[#10b981]/20 active:scale-95 cursor-pointer min-h-[38px] transition-all"
    : "bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c] hover:border-[#ffd700] text-[#ffd700] shadow-md shadow-[#c89b3c]/20 active:scale-95 cursor-pointer min-h-[38px] transition-all";

  const aiIconClass = isLight
    ? "text-[#ffe270]"
    : isEthereal
    ? "text-[#38bdf8]"
    : isCyberTech
    ? "text-[#34d399]"
    : "text-[#ffd700]";

  const aiTextClass = isLight
    ? "text-[#ffffff]"
    : isEthereal
    ? "text-[#e0e7ff]"
    : isCyberTech
    ? "text-[#ecfdf5]"
    : "text-[#ffd700]";

  // Scroll Arrows (< and >)
  const getScrollBtnClass = (enabled: boolean, direction: "left" | "right") => {
    if (enabled) {
      return isParchment
        ? "bg-[#ebdcc5] hover:bg-[#dfcdb4] border-[#bfa37c] hover:border-[#783d07] text-[#783d07] hover:text-[#2b1704] shadow-xs active:scale-95 cursor-pointer ring-1 ring-[#bfa37c]/60"
        : isSolar
        ? "bg-[#faebd0] hover:bg-[#f5deb3] border-[#deb673] hover:border-[#b45309] text-[#b45309] hover:text-[#2b1400] shadow-xs active:scale-95 cursor-pointer ring-1 ring-[#deb673]/60"
        : isEthereal
        ? "bg-[#0c1427] border-[#38bdf8]/70 text-[#38bdf8] hover:text-white shadow-md shadow-[#38bdf8]/30 ring-1 ring-[#38bdf8]/50 active:scale-95 cursor-pointer"
        : isCyberTech
        ? "bg-[#0c1524] border-[#10b981]/70 text-[#34d399] hover:text-white shadow-md shadow-[#10b981]/30 ring-1 ring-[#10b981]/50 active:scale-95 cursor-pointer"
        : `bg-gradient-to-r ${direction === "left" ? "from-[#2d2215] to-[#3a2c1b]" : "from-[#3a2c1b] to-[#2d2215]"} border-[#c89b3c] text-[#ffd700] hover:text-[#fff] hover:border-[#e6c670] shadow-md shadow-[#c89b3c]/40 ring-1 ring-[#c89b3c]/70 active:scale-95 cursor-pointer`;
    }
    // Disabled state
    return isParchment
      ? "bg-[#f0e6d6] border-[#d8c7af] text-[#b8a78e] opacity-40 cursor-not-allowed"
      : isSolar
      ? "bg-[#fff6e5] border-[#ebd3aa] text-[#caa875] opacity-40 cursor-not-allowed"
      : isEthereal
      ? "bg-[#070e24] border-[#1e293b] text-[#334155] opacity-40 cursor-not-allowed"
      : isCyberTech
      ? "bg-[#041915] border-[#064e3b] text-[#1e3a34] opacity-40 cursor-not-allowed"
      : "bg-[#181410] border-[#2d2419] text-[#554637] opacity-40 cursor-not-allowed";
  };

  // Tabs Track
  const tabsTrackClass = isParchment
    ? "bg-[#ebdcc5] border-[#bfa37c] shadow-inner"
    : isSolar
    ? "bg-[#faebd0] border-[#deb673] shadow-inner"
    : isEthereal
    ? "bg-[#080f26] border-[#1e293b] shadow-inner"
    : isCyberTech
    ? "bg-[#041915] border-[#064e3b] shadow-inner"
    : "bg-[#191511] border-[#33271c] shadow-inner shadow-black/40";

  return (
    <header className={headerContainerClass}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col gap-2.5 w-full">
          
          {/* Row 1: Centered, Prominent, Large & Distinct Logo & Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 py-2 w-full text-center">
            <div
              onClick={() => onSelectTab("calculator")}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-[#ffe270] via-[#c89b3c] to-[#6d4410] p-[3px] shadow-2xl shadow-amber-600/30 shrink-0 overflow-hidden ring-4 ring-amber-400/70 cursor-pointer hover:scale-105 transition-all duration-300"
              title="ΕΓΩ ΕΙΜΙ - ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ (Μετάβαση στην Αρχική)"
            >
              <img
                src={appLogoImg}
                alt="ΕΓΩ ΕΙΜΙ - ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ"
                className="w-full h-full object-cover rounded-[21px]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                <h1
                  onClick={() => onSelectTab("calculator")}
                  className={titleClass}
                >
                  ΛΕΞΑΡΙΘΜΟΣ
                </h1>
                <span className={ionianBadgeClass}>
                  ΙΩΝΙΚΗ
                </span>
              </div>
              <div className={`text-xs sm:text-base ${subtextClass} font-serif tracking-wide mt-1 flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2`}>
                <span className="whitespace-nowrap">Ελληνική Ισοψηφία & Στατιστική</span>
                <span className="hidden sm:inline opacity-60">•</span>
                <strong className={authorNameClass}>
                  ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ
                </strong>
              </div>
              <p className={quoteClass}>
                «ΕΓΩ ΕΙΜΙ» • Αιώνιος Συμπαντικός Κώδικας
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
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border font-serif font-bold transition-all shadow-md cursor-pointer shrink-0 min-h-[38px] ${allTabsBtnClass}`}
              title="Πύλη Συντομεύσεων: Προβολή όλων των 21 καρτελών σε μεγάλο πίνακα"
            >
              <LayoutGrid className={`w-4 h-4 ${allTabsIconClass}`} />
              <span className="tracking-wider uppercase text-xs sm:text-sm font-bold">
                ΚΑΡΤΕΛΕΣ
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${allTabsBadgeClass}`}>
                21
              </span>
            </button>

            {/* Theme Selector */}
            <button
              onClick={onOpenThemeModal || onToggleTheme}
              id="header-theme-toggle-btn"
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border ${secondaryBtnClass}`}
              title="Επιλογή Εμφάνισης (6 Θέματα)"
            >
              <Palette className={`w-3.5 h-3.5 ${secondaryIconClass}`} />
              <span className="text-[11px] font-sans font-medium">Θέμα</span>
            </button>

            {/* Font Selector */}
            {onOpenFontModal && (
              <button
                onClick={onOpenFontModal}
                id="header-font-selector-btn"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border ${secondaryBtnClass}`}
                title={`Επιλογή Αρχαιοελληνικής Γραμματοσειράς (${currentFontName || "Didot"})`}
              >
                <Type className={`w-3.5 h-3.5 ${secondaryIconClass}`} />
                <span className="text-[11px] font-sans font-medium">Γραμματοσειρά</span>
              </button>
            )}

            {/* Report Export */}
            {onOpenExportReport && (
              <button
                onClick={onOpenExportReport}
                id="header-export-report-btn"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border ${secondaryBtnClass}`}
                title="Εξαγωγή Αναλυτικής Αναφοράς / PDF"
              >
                <FileText className={`w-3.5 h-3.5 ${secondaryIconClass}`} />
                <span className="text-[11px] font-sans font-medium">Έκθεση</span>
              </button>
            )}

            {/* Secret Portal Gate */}
            {onOpenPortalGate && (
              <button
                onClick={onOpenPortalGate}
                id="header-portal-gate-btn"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border ${secondaryBtnClass}`}
                title="Μυστική Πύλη Λαυρείου (ΒΕΛΟΣ + ΟΥΔΟΣ)"
              >
                <Compass className={`w-3.5 h-3.5 ${secondaryIconClass}`} />
                <span className="text-[11px] font-sans font-medium">Πύλη</span>
              </button>
            )}

            {/* PWA Shortcut / Add to Home Screen Button */}
            {onOpenInstallModal && (
              <button
                type="button"
                onClick={onOpenInstallModal}
                id="header-install-shortcut-btn"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border ${secondaryBtnClass}`}
                title="Προσθήκη Συντόμευσης / Εγκατάσταση στην Επιφάνεια Εργασίας του κινητού"
              >
                <Smartphone className={`w-3.5 h-3.5 ${secondaryIconClass}`} />
                <span className="text-[11px] font-sans font-medium whitespace-nowrap">Συντόμευση</span>
              </button>
            )}

            {/* Gemini API Key */}
            <button
              onClick={onOpenApiKeyModal}
              id="header-api-key-btn"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border relative ${secondaryBtnClass}`}
              title="Ρύθμιση API Key (AI ΙΩΑΝΝΗΣ)"
            >
              <Key className={`w-3.5 h-3.5 ${secondaryIconClass}`} />
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
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs font-serif ${aiBtnClass}`}
              title="Τ.Ν. ΙΩΑΝΝΗΣ 1.0 - Φιλολογική & Ισοψηφική Ερμηνεία"
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiIconClass} animate-pulse`} />
              <span className={`text-[11px] sm:text-xs font-bold font-sans whitespace-nowrap ${aiTextClass}`}>Τ.Ν. ΙΩΑΝΝΗΣ</span>
            </button>
          </div>

          {/* Navigation Bar with Theme Controls & Full Screen Width */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative w-full min-w-0 pt-0.5">
            {/* Left Scroll Button */}
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Κύλιση αριστερά"
              className={`p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 z-10 min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation ${getScrollBtnClass(canScrollLeft, "left")}`}
              title="Κύλιση αριστερά"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Scrollable Tabs Wrapper */}
            <div
              ref={navScrollRef}
              onScroll={checkScroll}
              onWheel={handleNavWheel}
              className={`flex-1 min-w-0 flex items-center space-x-1 p-1 rounded-xl border overflow-x-auto gold-scrollbar scroll-smooth ${tabsTrackClass}`}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                const tabBtnClass = isActive
                  ? isParchment
                    ? "bg-gradient-to-r from-[#783d07] via-[#9a520e] to-[#783d07] text-[#ffffff] border border-[#b8752a] shadow-md font-bold"
                    : isSolar
                    ? "bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#b45309] text-[#ffffff] border border-[#f59e0b] shadow-md font-bold"
                    : isEthereal
                    ? "bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-[#f0f9ff] border border-[#38bdf8] shadow-md font-bold"
                    : isCyberTech
                    ? "bg-gradient-to-r from-[#064e3b] to-[#022c22] text-[#ecfeff] border border-[#10b981] shadow-md font-bold"
                    : "bg-gradient-to-r from-[#332616] via-[#42331f] to-[#332616] text-[#f5ecd8] border border-[#c89b3c] shadow-md shadow-[#c89b3c]/15 font-bold"
                  : isParchment
                  ? "text-[#5c3e21] hover:text-[#2b1704] hover:bg-[#dfcdb4]"
                  : isSolar
                  ? "text-[#5c2b00] hover:text-[#2b1400] hover:bg-[#f5deb3]"
                  : isEthereal
                  ? "text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#132242]"
                  : isCyberTech
                  ? "text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#112035]"
                  : "text-[#a69680] hover:text-[#e8dfd1] hover:bg-[#231e18]";

                const tabIconClass = isActive
                  ? isLight ? "text-[#ffe270]" : isEthereal ? "text-[#38bdf8]" : isCyberTech ? "text-[#34d399]" : "text-[#e6c670]"
                  : isLight ? "text-[#8a5b28]" : isEthereal || isCyberTech ? "text-[#64748b]" : "text-[#8c7e6c]";

                const badgeClass = isActive
                  ? isLight ? "bg-[#ffffff] text-[#783d07] font-bold shadow-xs" : isEthereal ? "bg-[#38bdf8] text-[#040816] font-bold" : isCyberTech ? "bg-[#10b981] text-[#022c22] font-bold" : "bg-[#c89b3c] text-[#14120f] font-bold"
                  : isLight ? "bg-[#dfcdb4] text-[#5c3e21] border border-[#bfa37c] font-bold" : isEthereal ? "bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/40" : isCyberTech ? "bg-[#064e3b] text-[#34d399] border border-[#10b981]/40" : "bg-[#2f271e] text-[#c89b3c]";

                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] sm:min-h-[44px] touch-manipulation ${tabBtnClass}`}
                  >
                    <Icon className={`w-4 h-4 ${tabIconClass}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${badgeClass}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button */}
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Κύλιση δεξιά"
              className={`p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 z-10 min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation ${getScrollBtnClass(canScrollRight, "right")}`}
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
