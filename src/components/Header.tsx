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
  Feather,
  Palette,
  Cpu,
  SlidersHorizontal,
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
    { id: "calculator" as TabType, label: "Υπολογισμός", icon: Calculator, desc: "Μεμονωμένες λέξεις & πράξεις" },
    { id: "search" as TabType, label: "Αναζήτηση", icon: Search, desc: "Ανάλυση κειμένου & συνδυασμοί" },
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

  const handleScroll = (direction: "left" | "right") => {
    if (navScrollRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      navScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <header className="border-b border-[#2d251e] bg-[#14120f]/95 backdrop-blur-md sticky top-0 z-40 pt-1 sm:pt-0 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 sm:py-3 gap-2 sm:gap-3 w-full">
          
          {/* Logo & Classical Title */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 w-full">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-[#8a6825] via-[#c89b3c] to-[#e6c670] p-[1.5px] shadow-lg shadow-[#c89b3c]/20 shrink-0 overflow-hidden">
                <img
                  src={appLogoImg}
                  alt="ΕΓΩ ΕΙΜΙ - ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ"
                  className="w-full h-full object-cover rounded-[6px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <h1 className="text-sm sm:text-2xl font-serif font-bold tracking-tight sm:tracking-wider text-[#f5ecd8] whitespace-nowrap">
                    ΛΕΞΑΡΙΘΜΟΣ
                  </h1>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-[#2a2219] text-[#c89b3c] border border-[#4a3a29] font-sans font-semibold shrink-0">
                    Ιωνικη
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-[#a69680] font-serif italic whitespace-nowrap hidden md:block">
                  Ελληνική Ισοψηφία & Στατιστική
                </p>
              </div>
            </div>

            {/* Action Buttons for Mobile (<lg) & Desktop (>=lg) - Responsive layout to fit within screen bounds */}
            <div className="flex items-center justify-end gap-1 sm:gap-1.5 shrink-0 relative">
              {/* Theme Toggle Button (Compact icon-first, text on xl) */}
              <button
                onClick={onOpenThemeModal || onToggleTheme}
                id="header-theme-toggle-btn"
                className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border text-xs font-serif transition-all shadow-md shrink-0 cursor-pointer touch-manipulation min-h-[34px] sm:min-h-[36px] ${
                  theme === "parchment"
                    ? "bg-gradient-to-r from-[#e8dcbf] to-[#f4ede0] hover:bg-[#decfae] border-[#925f11] text-[#4a3310] ring-1 ring-[#925f11]/30"
                    : theme === "ancient-calligraphy"
                    ? "bg-gradient-to-r from-[#f5ebd8] to-[#faf3e6] hover:bg-[#ebdcc5] border-[#b59263] text-[#543216] ring-1 ring-[#b59263]/40"
                    : theme === "solar"
                    ? "bg-gradient-to-r from-[#fff4d1] to-[#fae6b1] hover:bg-[#fae09e] border-[#d97706] text-[#b45309] ring-1 ring-[#d97706]/40"
                    : theme === "ethereal"
                    ? "bg-gradient-to-r from-[#0b1736] to-[#122452] hover:bg-[#1a326e] border-[#38bdf8] text-[#38bdf8] ring-1 ring-[#38bdf8]/40"
                    : theme === "cyber-tech"
                    ? "bg-gradient-to-r from-[#0a1f24] to-[#0f2d33] hover:bg-[#153e47] border-[#10b981] text-[#10b981] ring-1 ring-[#10b981]/40"
                    : "bg-gradient-to-r from-[#20180f] via-[#2a1e12] to-[#20180f] hover:from-[#2e2114] hover:to-[#2e2114] border-[#ffd700]/70 text-[#ffd700] hover:text-[#fff2a8] shadow-[#ffd700]/15"
                }`}
                title="Επιλογή Εμφάνισης (6 Θέματα)"
              >
                {theme === "parchment" ? (
                  <>
                    <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#825313] shrink-0" />
                    <span className="text-[11px] font-sans font-bold hidden xl:inline">Περγαμηνή</span>
                  </>
                ) : theme === "ancient-calligraphy" ? (
                  <>
                    <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7a491e] shrink-0" />
                    <span className="text-[11px] font-sans font-bold hidden xl:inline">Καλλιγραφία</span>
                  </>
                ) : theme === "solar" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d97706] shrink-0" />
                    <span className="text-[11px] font-sans font-bold hidden xl:inline">Ηλιακή</span>
                  </>
                ) : theme === "ethereal" ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8] shrink-0" />
                    <span className="text-[11px] font-sans font-bold hidden xl:inline">Αιθέρικη</span>
                  </>
                ) : theme === "cyber-tech" ? (
                  <>
                    <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10b981] shrink-0" />
                    <span className="text-[11px] font-sans font-bold hidden xl:inline">Tech</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] shrink-0" />
                    <span className="text-[11px] font-sans font-bold hidden xl:inline">Κλασικό</span>
                  </>
                )}
                <Palette className="w-3 h-3 opacity-60 hidden xl:inline shrink-0" />
              </button>

              {/* Quick AI Assistant button on mobile & tablet (<lg) */}
              <button
                onClick={onOpenAiAssistant}
                id="header-mobile-ai-btn"
                className="lg:hidden flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#c89b3c]/70 bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] text-[#ffd700] hover:text-[#fff] shadow-sm shadow-[#c89b3c]/20 active:scale-95 cursor-pointer touch-manipulation shrink-0 min-h-[34px]"
                title="Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (AI Βοηθός)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e6c670] animate-pulse" />
                <span className="text-[11px] font-sans font-bold">AI</span>
              </button>

              {/* Tools Menu (⋯) button on mobile & tablet (<lg) */}
              <button
                onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                id="header-mobile-tools-btn"
                className={`lg:hidden flex items-center justify-center w-8.5 h-8.5 rounded-lg border transition-all cursor-pointer touch-manipulation shrink-0 ${
                  mobileToolsOpen
                    ? "bg-[#2d2419] border-[#c89b3c] text-[#ffd700]"
                    : "bg-[#18130e] hover:bg-[#251d15] border-[#3e3020] text-[#d6c7b2]"
                }`}
                title="Περισσότερα Εργαλεία & Ρυθμίσεις"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {/* Mobile Tools Dropdown Menu Modal */}
              {mobileToolsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
                    onClick={() => setMobileToolsOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[#181410] border border-[#c89b3c]/80 shadow-2xl shadow-black p-3 space-y-2 lg:hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-[#2e261e] text-xs font-serif text-[#a69680]">
                      <span className="font-bold text-[#e6c670]">Εργαλεία & Ρυθμίσεις</span>
                      <button
                        onClick={() => setMobileToolsOpen(false)}
                        className="text-[#8c7e6c] hover:text-[#f5ecd8] text-xs px-2 py-1 rounded cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {onOpenFontModal && (
                        <button
                          onClick={() => {
                            setMobileToolsOpen(false);
                            onOpenFontModal();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#201a14] hover:bg-[#2c2218] border border-[#3e3020] text-xs font-serif text-[#f5ecd8] text-left transition-all min-h-[44px] touch-manipulation cursor-pointer"
                        >
                          <Type className="w-4 h-4 text-[#e6c670] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#f5ecd8]">Αρχαιοελληνική Γραμματοσειρά</div>
                            <div className="text-[10px] text-[#a69680] truncate">{currentFontName || "GFS Didot"}</div>
                          </div>
                        </button>
                      )}

                      {onOpenExportReport && (
                        <button
                          onClick={() => {
                            setMobileToolsOpen(false);
                            onOpenExportReport();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#201a14] hover:bg-[#2c2218] border border-[#3e3020] text-xs font-serif text-[#f5ecd8] text-left transition-all min-h-[44px] touch-manipulation cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-[#c89b3c] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#f5ecd8]">Εξαγωγή Αναλυτικής Έκθεσης</div>
                            <div className="text-[10px] text-[#a69680]">Αποθήκευση σε PDF / Κείμενο</div>
                          </div>
                        </button>
                      )}

                      {onOpenPortalGate && (
                        <button
                          onClick={() => {
                            setMobileToolsOpen(false);
                            onOpenPortalGate();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#201a14] hover:bg-[#2c2218] border border-[#c89b3c]/50 text-xs font-serif text-[#e6c670] text-left transition-all min-h-[44px] touch-manipulation cursor-pointer"
                        >
                          <Compass className="w-4 h-4 text-[#e6c670] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#e6c670]">Μυστική Πύλη Λαυρείου</div>
                            <div className="text-[10px] text-[#a69680]">ΒΕΛΟΣ + ΟΥΔΟΣ = 2368</div>
                          </div>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setMobileToolsOpen(false);
                          onOpenApiKeyModal();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#201a14] hover:bg-[#2c2218] border border-[#3e3223] text-xs font-serif text-[#f5ecd8] text-left transition-all min-h-[44px] touch-manipulation cursor-pointer"
                      >
                        <Key className="w-4 h-4 text-[#e6c670] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#f5ecd8] flex items-center gap-1.5">
                            <span>Ρύθμιση Gemini API Key</span>
                            {hasCustomApiKey ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-600 text-emerald-400 font-sans font-bold">
                                Ενεργό
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2e261e] text-[#a69680] font-sans">
                                Προεπιλογή
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#a69680]">Προσωπικό κλειδί AI</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setMobileToolsOpen(false);
                          onOpenAiAssistant();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c]/70 text-xs font-serif text-[#f5ecd8] text-left transition-all min-h-[44px] touch-manipulation cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[#e6c670] animate-pulse shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#ffd700]">Τ.Ν. ΙΩΑΝΝΗΣ 1.0</div>
                          <div className="text-[10px] text-[#e6c670]">Φιλολογική & Ισοψηφική Ερμηνεία AI</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Desktop-Only Action Buttons (>= lg) */}
              <div className="hidden lg:flex items-center gap-1 sm:gap-1.5 shrink-0">
                {onOpenFontModal && (
                  <button
                    onClick={onOpenFontModal}
                    id="header-font-selector-btn"
                    className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-[#18130e] hover:bg-[#251d15] border border-[#3e3020] hover:border-[#c89b3c] text-xs font-serif text-[#d6c7b2] hover:text-[#e6c670] transition-all shadow-sm shrink-0 cursor-pointer min-h-[36px] touch-manipulation"
                    title={`Επιλογή Αρχαιοελληνικής Γραμματοσειράς (${currentFontName || "GFS Didot"})`}
                  >
                    <Type className="w-3.5 h-3.5 text-[#e6c670]" />
                    <span className="text-[11px] font-sans font-medium hidden xl:inline">Γραμματοσειρά</span>
                  </button>
                )}

                {onOpenExportReport && (
                  <button
                    onClick={onOpenExportReport}
                    id="header-export-report-btn"
                    className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-[#1a1510] hover:bg-[#281f15] border border-[#3e3020] hover:border-[#c89b3c] text-xs font-serif text-[#d6c7b2] hover:text-[#e6c670] transition-all shadow-sm shrink-0 cursor-pointer min-h-[36px] touch-manipulation"
                    title="Εξαγωγή Αναλυτικής Αναφοράς / PDF"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#c89b3c]" />
                    <span className="text-[11px] font-sans font-medium hidden xl:inline">Έκθεση</span>
                  </button>
                )}

                {onOpenPortalGate && (
                  <button
                    onClick={onOpenPortalGate}
                    id="header-portal-gate-btn"
                    className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-[#1a140d] hover:bg-[#281e13] border border-[#c89b3c]/50 hover:border-[#e6c670] text-xs font-serif text-[#e6c670] transition-all shadow-sm shrink-0 cursor-pointer min-h-[36px] touch-manipulation"
                    title="Μυστική Πύλη Λαυρείου (ΒΕΛΟΣ + ΟΥΔΟΣ)"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#e6c670]" />
                    <span className="text-[11px] font-sans font-medium hidden xl:inline">Πύλη</span>
                  </button>
                )}

                <button
                  onClick={onOpenApiKeyModal}
                  id="header-api-key-btn"
                  className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-[#1c1813] hover:bg-[#282117] border border-[#3e3223] hover:border-[#c89b3c] text-xs font-serif text-[#e6c670] transition-colors relative shadow-sm shrink-0 cursor-pointer min-h-[36px] touch-manipulation"
                  title="Ρύθμιση API Key (AI ΙΩΑΝΝΗΣ)"
                >
                  <Key className="w-3.5 h-3.5 text-[#e6c670]" />
                  <span className="text-[11px] font-sans font-medium hidden xl:inline">API Key</span>
                  {hasCustomApiKey ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-950 animate-pulse" title="Προσωπικό κλειδί ενεργό" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8c7e6c]" />
                  )}
                </button>

                <button
                  onClick={onOpenAiAssistant}
                  id="header-ai-assistant-btn"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c]/60 hover:border-[#c89b3c] text-[#f5ecd8] text-xs font-serif shadow-md shadow-[#c89b3c]/15 transition-all shrink-0 active:scale-95 cursor-pointer min-h-[36px] touch-manipulation"
                  title="Τ.Ν. ΙΩΑΝΝΗΣ 1.0 - Φιλολογική & Ισοψηφική Ερμηνεία"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#e6c670] animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-medium font-sans whitespace-nowrap">Τ.Ν. ΙΩΑΝΝΗΣ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar with Luxury Gold Controls */}
          <div className="flex items-center gap-1 sm:gap-2 relative w-full pt-1 sm:pt-0">
            
            {/* Left Scroll Button (Gold Arrow) */}
            {showScrollControls && (
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
            )}

            {/* Scrollable Tabs Wrapper */}
            <div
              ref={navScrollRef}
              onScroll={checkScroll}
              className="flex items-center space-x-1 p-1 bg-[#191511] rounded-xl border border-[#33271c] w-full overflow-x-auto gold-scrollbar scroll-smooth shadow-inner shadow-black/40"
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

            {/* Right Scroll Button (Gold Arrow) */}
            {showScrollControls && (
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Κύλιση δεξιά"
                className={`p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 z-10 min-h-[38px] min-w-[38px] flex items-center justify-center touch-manipulation ${
                  canScrollRight
                    ? "bg-gradient-to-r from-[#3a2c1b] to-[#2d2215] border-[#c89b3c] text-[#e6c670] hover:text-[#fff] hover:border-[#e6c670] shadow-md shadow-[#c89b3c]/20 active:scale-95 cursor-pointer"
                    : "bg-[#181410] border-[#2d2419] text-[#554637] opacity-40 cursor-not-allowed"
                }`}
                title="Κύλιση δεξιά"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
