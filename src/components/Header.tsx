import React, { useRef, useState, useEffect } from "react";
import { TabType } from "../types";
import { Calculator, Search, BarChart3, BookMarked, BookOpen, Sparkles, Key, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import appLogoImg from "../assets/images/ego_eimi_logo_1787417709332.jpg";

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedCount: number;
  onOpenAiAssistant: () => void;
  onOpenApiKeyModal: () => void;
  onOpenPortalGate?: () => void;
  hasCustomApiKey?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenAiAssistant,
  onOpenApiKeyModal,
  onOpenPortalGate,
  hasCustomApiKey = false,
}) => {
  const tabs = [
    { id: "calculator" as TabType, label: "Υπολογισμός", icon: Calculator, desc: "Μεμονωμένες λέξεις & πράξεις" },
    { id: "search" as TabType, label: "Αναζήτηση", icon: Search, desc: "Ανάλυση κειμένου & συνδυασμοί" },
    { id: "stats" as TabType, label: "Στατιστικά", icon: BarChart3, desc: "Οπτικοποίηση, γραφήματα & CSV" },
    { id: "archive" as TabType, label: "Αρχείο", icon: BookMarked, desc: "Αποθηκευμένοι λεξάριθμοι", badge: savedCount },
    { id: "guide" as TabType, label: "Οδηγός & 666", icon: BookOpen, desc: "Ιωνική αρίθμηση, 666 & κανόνες" },
  ];

  const navScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollControls, setShowScrollControls] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

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
    <header className="border-b border-[#2d251e] bg-[#14120f]/95 backdrop-blur-md sticky top-0 z-40 pt-1.5 sm:pt-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 sm:py-3 gap-2.5 sm:gap-3">
          
          {/* Logo & Classical Title */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-[#8a6825] via-[#c89b3c] to-[#e6c670] p-[1.5px] shadow-lg shadow-[#c89b3c]/20 shrink-0 overflow-hidden">
                <img
                  src={appLogoImg}
                  alt="ΕΓΩ ΕΙΜΙ - ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ"
                  className="w-full h-full object-cover rounded-[6px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h1 className="text-base sm:text-2xl font-serif font-bold tracking-wider text-[#f5ecd8] truncate">
                    ΛΕΞΑΡΙΘΜΟΣ
                  </h1>
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#2a2219] text-[#c89b3c] border border-[#4a3a29] font-sans font-semibold shrink-0">
                    Ιωνικη
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-[#a69680] font-serif italic truncate hidden xs:block">
                  Ελληνική Ισοψηφία & Στατιστική
                </p>
              </div>
            </div>

            {/* Action Buttons (API Key & AI Assistant & Portal Gate) - Clearly visible on all screens */}
            <div className="flex items-center gap-1.5 shrink-0">
              {onOpenPortalGate && (
                <button
                  onClick={onOpenPortalGate}
                  id="header-portal-gate-btn"
                  className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg bg-[#1a140d] hover:bg-[#281e13] border border-[#c89b3c]/50 hover:border-[#e6c670] text-xs font-serif text-[#e6c670] transition-all shadow-sm shrink-0"
                  title="Μυστική Πύλη Λαυρείου (ΒΕΛΟΣ + ΟΥΔΟΣ)"
                >
                  <Compass className="w-3.5 h-3.5 text-[#e6c670]" />
                  <span className="text-[11px] font-sans font-medium hidden sm:inline">Πύλη</span>
                </button>
              )}

              <button
                onClick={onOpenApiKeyModal}
                id="header-api-key-btn"
                className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#1c1813] hover:bg-[#282117] border border-[#3e3223] hover:border-[#c89b3c] text-xs font-serif text-[#e6c670] transition-colors relative shadow-sm shrink-0"
                title="Ρύθμιση API Key (AI ΙΩΑΝΝΗΣ)"
              >
                <Key className="w-3.5 h-3.5 text-[#e6c670]" />
                <span className="text-[11px] font-sans font-medium hidden sm:inline">API Key</span>
                {hasCustomApiKey ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-950 animate-pulse" title="Προσωπικό κλειδί ενεργό" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8c7e6c]" />
                )}
              </button>

              <button
                onClick={onOpenAiAssistant}
                id="header-ai-assistant-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c]/60 hover:border-[#c89b3c] text-[#f5ecd8] text-xs font-serif shadow-md shadow-[#c89b3c]/15 transition-all shrink-0 active:scale-95"
                title="Τ.Ν. ΙΩΑΝΝΗΣ 1.0 - Φιλολογική & Ισοψηφική Ερμηνεία"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e6c670] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-medium font-sans">Τ.Ν. ΙΩΑΝΝΗΣ 1.0</span>
              </button>
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
                className={`p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 z-10 ${
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
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#332616] via-[#42331f] to-[#332616] text-[#f5ecd8] border border-[#c89b3c] shadow-md shadow-[#c89b3c]/15 font-bold"
                        : "text-[#a69680] hover:text-[#e8dfd1] hover:bg-[#231e18]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-[#e6c670]" : "text-[#8c7e6c]"}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
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
                className={`p-1.5 sm:p-2 rounded-lg border transition-all shrink-0 z-10 ${
                  canScrollRight
                    ? "bg-gradient-to-r from-[#3a2c1b] to-[#2d2215] border-[#c89b3c] text-[#e6c670] hover:text-[#fff] hover:border-[#e6c670] shadow-md shadow-[#c89b3c]/20 active:scale-95 cursor-pointer"
                    : "bg-[#181410] border-[#2d2419] text-[#554637] opacity-40 cursor-not-allowed"
                }`}
                title="Κύλιση δεξιά"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Desktop API Key button */}
            <button
              onClick={onOpenApiKeyModal}
              id="desktop-api-key-btn"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1813] hover:bg-[#282117] border border-[#3a2e20] hover:border-[#c89b3c]/60 text-xs font-serif text-[#d6c7b2] transition-colors relative shrink-0"
              title="Ρύθμιση Gemini API Key για απεριόριστες AI ερμηνείες"
            >
              <Key className="w-3.5 h-3.5 text-[#e6c670]" />
              <span>API Key</span>
              {hasCustomApiKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Προσωπικό κλειδί ενεργό" />
              )}
            </button>

            {/* Desktop AI Assistant button */}
            <button
              onClick={onOpenAiAssistant}
              id="desktop-ai-assistant-btn"
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c]/40 text-[#f5ecd8] text-xs sm:text-sm font-medium hover:border-[#c89b3c] hover:shadow-md hover:shadow-[#c89b3c]/10 transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#e6c670] animate-pulse" />
              <span>AI Ερμηνεία</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
