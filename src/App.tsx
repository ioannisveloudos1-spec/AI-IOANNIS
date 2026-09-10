import React, { useState, useEffect } from "react";
import { TabType, SavedIsopsephyItem } from "./types";
import { Header } from "./components/Header";
import { CalculatorTab } from "./components/CalculatorTab";
import { SearchTab } from "./components/SearchTab";
import { GoldenVersesTab } from "./components/GoldenVersesTab";
import { SolarIotaDanaosTab } from "./components/SolarIotaDanaosTab";
import { OnlineFinderTab } from "./components/OnlineFinderTab";
import { CalendarTab } from "./components/CalendarTab";
import { CosmicJourneyTab } from "./components/cosmic-journey/CosmicJourneyTab";
import { BridgesTab } from "./components/BridgesTab";
import { AnagramsTab } from "./components/AnagramsTab";
import { GrammatariTab } from "./components/GrammatariTab";
import { IsopsephicGraphTab } from "./components/IsopsephicGraphTab";
import { VeloudionTab } from "./components/VeloudionTab";
import { CubeApolloTab } from "./components/CubeApolloTab";
import { SolarMagicSquareTab } from "./components/SolarMagicSquareTab";
import { SeedOfLightTab } from "./components/SeedOfLightTab";
import { EnotheismTab } from "./components/EnotheismTab";
import { GameTab } from "./components/GameTab";
import { StatsTab } from "./components/StatsTab";
import { ArchiveTab } from "./components/ArchiveTab";
import { GuideTab } from "./components/GuideTab";
import { EuropeTab } from "./components/EuropeTab";
import { AcousticSynthesizerTab } from "./components/AcousticSynthesizerTab";
import { AllTabsPortalTab } from "./components/AllTabsPortalTab";
import { AiAnalysisModal } from "./components/AiAnalysisModal";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { ExportReportModal } from "./components/ExportReportModal";
import { PortalGateIntro } from "./components/PortalGateIntro";
import { GreekFontSelectorModal } from "./components/GreekFontSelectorModal";
import { ThemeSelectorModal } from "./components/ThemeSelectorModal";
import {
  getInitialAncientFont,
  saveAncientFont,
  ANCIENT_GREEK_FONTS,
} from "./utils/greekFonts";
import {
  AppTheme,
  APP_THEMES,
  getInitialTheme,
  saveThemePreference,
} from "./utils/theme";
import { numberToGreekNumeral } from "./utils/isopsephy";
import { formatEnglishItemWithGreekTranslation } from "./utils/translation";
import { Calculator, Search, Calendar, Box, BookMarked, Sparkles } from "lucide-react";

const LOCAL_STORAGE_KEY = "greek_isopsephy_saved_archive_v3_canonical";
const API_KEY_STORAGE_KEY = "GEMINI_USER_API_KEY";

const INITIAL_SEEDED_ITEMS: SavedIsopsephyItem[] = [
  {
    id: "init-1",
    text: "ΙΩΑΝΝΗΣ",
    normalized: "ΙΩΑΝΝΗΣ",
    value: 1119,
    root: 3,
    greekNumeral: "͵αιιθ´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Ι(10) + Ω(800) + Α(1) + Ν(50) + Ν(50) + Η(8) + Σ(200) = 1119",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-2",
    text: "ΙΗΣΟΥΣ",
    normalized: "ΙΗΣΟΥΣ",
    value: 888,
    root: 6,
    greekNumeral: "ωπη´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Ι(10) + Η(8) + Σ(200) + Ο(70) + Υ(400) + Σ(200) = 888",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-3",
    text: "ΧΡΙΣΤΟΣ",
    normalized: "ΧΡΙΣΤΟΣ",
    value: 1480,
    root: 4,
    greekNumeral: "͵αυπ´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Χ(600) + Ρ(100) + Ι(10) + Σ(200) + Τ(300) + Ο(70) + Σ(200) = 1480",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-4",
    text: "ΔΙΑΣ",
    normalized: "ΔΙΑΣ",
    value: 215,
    root: 8,
    greekNumeral: "σιε´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Δ(4) + Ι(10) + Α(1) + Σ(200) = 215",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-5",
    text: "ΖΕΥΣ",
    normalized: "ΖΕΥΣ",
    value: 612,
    root: 9,
    greekNumeral: "χιβ´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Ζ(7) + Ε(5) + Υ(400) + Σ(200) = 612",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-6",
    text: "ΑΠΟΛΛΩΝ",
    normalized: "ΑΠΟΛΛΩΝ",
    value: 1061,
    root: 8,
    greekNumeral: "͵αξα´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Α(1) + Π(80) + Ο(70) + Λ(30) + Λ(30) + Ω(800) + Ν(50) = 1061",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-7",
    text: "ΑΙΑΣ",
    normalized: "ΑΙΑΣ",
    value: 212,
    root: 5,
    greekNumeral: "σιβ´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Α(1) + Ι(10) + Α(1) + Σ(200) = 212",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-8",
    text: "Ο ΩΝ",
    normalized: "Ο ΩΝ",
    value: 920,
    root: 2,
    greekNumeral: "ϡκ´",
    isPhrase: true,
    wordCount: 2,
    category: "Ονόματα",
    notes: "Ο(70) + Ω(800) + Ν(50) = 920",
    createdAt: new Date().toISOString(),
  },
  {
    id: "init-9",
    text: "ΑΙΩΝ",
    normalized: "ΑΙΩΝ",
    value: 861,
    root: 6,
    greekNumeral: "ωξα´",
    isPhrase: false,
    wordCount: 1,
    category: "Ονόματα",
    notes: "Α(1) + Ι(10) + Ω(800) + Ν(50) = 861",
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("calculator");
  const [currentTextForStats, setCurrentTextForStats] = useState<string>("");
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);

  const [savedItems, setSavedItems] = useState<SavedIsopsephyItem[]>(() => {
    try {
      // Clean up previous localStorage keys that might have cached old items (Neron etc)
      localStorage.removeItem("greek_isopsephy_saved_archive_v1");
      localStorage.removeItem("greek_isopsephy_saved_archive_v2");
      
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: SavedIsopsephyItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
    return INITIAL_SEEDED_ITEMS;
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiText, setAiText] = useState<string>("ΙΗΣΟΥΣ");
  const [aiNumber, setAiNumber] = useState<number>(888);
  const [aiWords, setAiWords] = useState<string[]>(["ΙΗΣΟΥΣ"]);

  // Export Report Modal state
  const [exportReportOpen, setExportReportOpen] = useState<boolean>(false);

  // Portal Gate Intro state (always shows on launch/refresh)
  const [showPortalGate, setShowPortalGate] = useState<boolean>(true);

  // Ancient Greek Display Font state
  const [currentFontId, setCurrentFontId] = useState<string>(getInitialAncientFont);
  const [fontModalOpen, setFontModalOpen] = useState<boolean>(false);

  // Theme state (5 themes: Classic, Parchment, Solar, Ethereal, Cyber-Tech)
  const [theme, setTheme] = useState<AppTheme>(getInitialTheme);
  const [themeModalOpen, setThemeModalOpen] = useState<boolean>(false);

  // Apply chosen font on mount and change
  useEffect(() => {
    saveAncientFont(currentFontId);
  }, [currentFontId]);

  // Apply theme class to document body on mount and change
  useEffect(() => {
    saveThemePreference(theme);
    // Remove existing theme classes
    document.body.classList.remove(
      "theme-parchment",
      "theme-ancient-calligraphy",
      "theme-solar",
      "theme-ethereal",
      "theme-cyber-tech"
    );

    // Apply specific theme class if not default dark-ancient
    if (theme !== "dark-ancient") {
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    saveThemePreference(newTheme);
    const themeMeta = APP_THEMES.find((t) => t.id === newTheme);
    if (themeMeta) {
      showToast(`Ενεργοποιήθηκε η εμφάνιση: ${themeMeta.name}`);
    }
    setThemeModalOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const themeOrder: AppTheme[] = [
        "dark-ancient",
        "parchment",
        "ancient-calligraphy",
        "solar",
        "ethereal",
        "cyber-tech",
      ];
      const currentIndex = themeOrder.indexOf(prev);
      const nextIndex = (currentIndex + 1) % themeOrder.length;
      const nextTheme = themeOrder[nextIndex];
      const themeMeta = APP_THEMES.find((t) => t.id === nextTheme);
      if (themeMeta) {
        showToast(`Εμφάνιση: ${themeMeta.name}`);
      }
      return nextTheme;
    });
  };

  const handleSelectFont = (fontId: string) => {
    setCurrentFontId(fontId);
    saveAncientFont(fontId);
    const fontObj = ANCIENT_GREEK_FONTS.find((f) => f.id === fontId);
    if (fontObj) {
      showToast(`Ενεργοποιήθηκε η γραμματοσειρά: ${fontObj.name}`);
    }
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedItems));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [savedItems]);

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    try {
      if (key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
        showToast("Το προσωπικό Gemini API Key αποθηκεύτηκε επιτυχώς!");
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        showToast("Το προσωπικό κλειδί διαγράφηκε (επαναφορά στο προεπιλεγμένο).");
      }
    } catch (e) {
      console.error("Failed to store API Key", e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveItem = (itemData: Omit<SavedIsopsephyItem, "id" | "createdAt">) => {
    const formattedText = formatEnglishItemWithGreekTranslation(itemData.text);
    const newItem: SavedIsopsephyItem = {
      ...itemData,
      text: formattedText,
      normalized: formattedText.toUpperCase(),
      id: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setSavedItems((prev) => {
      // Check if duplicate
      const exists = prev.some(
        (i) => i.text.trim().toUpperCase() === newItem.text.trim().toUpperCase() && i.value === newItem.value
      );
      if (exists) {
        showToast(`Το «${newItem.text}» (${newItem.value}) υπάρχει ήδη στο αρχείο.`);
        return prev;
      }
      showToast(`✨ Αποθηκεύτηκε: ${newItem.text}=${newItem.value}`);
      return [newItem, ...prev];
    });
  };

  const handleDeleteItem = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
    showToast("Το στοιχείο διαγράφηκε από το αρχείο.");
  };

  const handleClearAll = () => {
    setSavedItems([]);
    showToast("Όλα τα στοιχεία διαγράφηκαν.");
  };

  const handleImportItems = (imported: SavedIsopsephyItem[]) => {
    setSavedItems((prev) => {
      const existingMap = new Set(prev.map((i) => `${i.text.trim().toUpperCase()}-${i.value}`));
      const newItemsToAdd = imported.filter(
        (i) => !existingMap.has(`${i.text.trim().toUpperCase()}-${i.value}`)
      );
      showToast(`Εισήχθησαν ${newItemsToAdd.length} νέα στοιχεία στο αρχείο.`);
      return [...newItemsToAdd, ...prev];
    });
  };

  const handleOpenAiModal = (text: string, number: number, words: string[]) => {
    setAiText(text || "ΙΗΣΟΥΣ");
    setAiNumber(number || 888);
    setAiWords(words.length > 0 ? words : [text]);
    setAiModalOpen(true);
  };

  const handleResetToDefault = () => {
    setSavedItems(INITIAL_SEEDED_ITEMS);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_ITEMS));
    } catch (e) {
      console.error(e);
    }
    showToast("Το Αρχείο επανήλθε στα 9 βασικά ονόματα.");
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-[#c89b3c]/30 selection:text-[#f4e2b7] pt-[env(safe-area-inset-top,0px)] pb-16 md:pb-0 w-full max-w-full overflow-x-hidden ${
        theme === "parchment" || theme === "ancient-calligraphy"
          ? "bg-[#f8f4ec] text-[#382109]"
          : theme === "solar"
          ? "bg-[#fffdf5] text-[#451a03]"
          : theme === "ethereal"
          ? "bg-[#060913] text-[#e0f2fe]"
          : theme === "cyber-tech"
          ? "bg-[#080c14] text-[#ecfeff]"
          : "bg-[#0d0c0a] text-[#e8dfd1]"
      }`}
    >
      
      {/* App Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={savedItems.length}
        hasCustomApiKey={!!customApiKey}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        onOpenPortalGate={() => setShowPortalGate(true)}
        onOpenExportReport={() => setExportReportOpen(true)}
        onOpenFontModal={() => setFontModalOpen(true)}
        onOpenThemeModal={() => setThemeModalOpen(true)}
        currentFontName={ANCIENT_GREEK_FONTS.find((f) => f.id === currentFontId)?.name}
        onOpenAiAssistant={() => handleOpenAiModal("ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", 2368, ["ΙΗΣΟΥΣ", "ΧΡΙΣΤΟΣ"])}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        {currentTab === "all-tabs" && (
          <AllTabsPortalTab
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            savedCount={savedItems.length}
            theme={theme}
          />
        )}

        {currentTab === "europe" && (
          <EuropeTab
            theme={theme}
            currentFontId={currentFontId}
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "calculator" && (
          <CalculatorTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
            savedItems={savedItems}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onOpenThemeModal={() => setThemeModalOpen(true)}
          />
        )}

        {currentTab === "acoustic-synth" && (
          <AcousticSynthesizerTab
            theme={theme}
            initialFrequency={432}
            initialWord="ΕΓΩ ΕΙΜΙ"
            onNavigateToCalculator={(word) => {
              setCurrentTextForStats(word);
              setCurrentTab("calculator");
            }}
          />
        )}

        {currentTab === "search" && (
          <SearchTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
            savedItems={savedItems}
          />
        )}

        {currentTab === "golden-verses" && (
          <GoldenVersesTab
            onNavigateToCalculator={(text) => {
              setCurrentTextForStats(text);
              setCurrentTab("calculator");
            }}
            onNavigateToSearch={(text) => {
              setCurrentTextForStats(text);
              setCurrentTab("search");
            }}
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "solar-iota-danaos" && (
          <SolarIotaDanaosTab
            onOpenAiModal={handleOpenAiModal}
            onSaveItem={handleSaveItem}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === "online-finder" && (
          <OnlineFinderTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "calendar" && (
          <CalendarTab
            theme={theme}
            onSelectWord={(word) => {
              setCurrentTab("calculator");
            }}
          />
        )}

        {currentTab === "cosmic-journey" && (
          <CosmicJourneyTab
            onSelectWordForCalculator={(word) => {
              setCurrentTab("calculator");
            }}
          />
        )}

        {currentTab === "bridges" && (
          <BridgesTab
            savedItems={savedItems}
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "anagrams" && (
          <AnagramsTab
            savedItems={savedItems}
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "grammatari" && (
          <GrammatariTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
            onOpenFontModal={() => setFontModalOpen(true)}
            currentFontId={currentFontId}
            onSelectFont={handleSelectFont}
          />
        )}

        {currentTab === "graph" && (
          <IsopsephicGraphTab
            savedItems={savedItems}
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
            onNavigateToCalculator={() => setCurrentTab("calculator")}
          />
        )}

        {currentTab === "veloudion" && (
          <VeloudionTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "cube-apollo" && (
          <CubeApolloTab
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "solar-square" && (
          <SolarMagicSquareTab
            onOpenAiModal={handleOpenAiModal}
            onSaveItem={handleSaveItem}
          />
        )}

        {currentTab === "seed-of-light" && (
          <SeedOfLightTab
            onSelectTab={setCurrentTab}
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
          />
        )}

        {currentTab === "enotheism" && (
          <EnotheismTab
            onOpenAiModal={handleOpenAiModal}
            onSaveItem={handleSaveItem}
          />
        )}

        {currentTab === "game" && <GameTab />}

        {currentTab === "stats" && (
          <StatsTab
            currentSearchText={currentTextForStats}
            savedItems={savedItems}
            onOpenAiModal={handleOpenAiModal}
            onNavigateToCalculator={() => {
              setCurrentTab("calculator");
            }}
          />
        )}

        {currentTab === "archive" && (
          <ArchiveTab
            savedItems={savedItems}
            onDeleteItem={handleDeleteItem}
            onClearAll={handleClearAll}
            onResetToDefault={handleResetToDefault}
            onImportItems={handleImportItems}
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
            currentAppTheme={theme}
            currentAppFontId={currentFontId}
          />
        )}

        {currentTab === "guide" && <GuideTab />}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 text-center text-xs font-serif transition-colors ${
          theme === "parchment" || theme === "ancient-calligraphy"
            ? "border-[#bfa37c] bg-[#f2e7d5] text-[#634324]"
            : theme === "solar"
            ? "border-[#e0bf7a] bg-[#faecd0] text-[#78350f]"
            : theme === "ethereal"
            ? "border-[#1e3a8a] bg-[#070e24] text-[#7dd3fc]"
            : theme === "cyber-tech"
            ? "border-[#065f46] bg-[#061418] text-[#6ee7b7]"
            : "border-[#241d16] bg-[#12100d] text-[#7a6e5e]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p
            className={`tracking-wide ${
              theme === "parchment" || theme === "ancient-calligraphy"
                ? "text-[#4a2808]"
                : "text-[#a69680]"
            }`}
          >
            <strong>Λεξάριθμος</strong> • Αρχαία Ελληνική Ιωνική Ισοψηφία, Στατιστική & Πολυτονική Ανάλυση Κειμένων
          </p>
          <p
            className={`text-[11px] ${
              theme === "parchment" || theme === "ancient-calligraphy"
                ? "text-[#6e4e2a]"
                : "text-[#5e5345]"
            }`}
          >
            Υποστηρίζει 27 Ιωνικά ψηφία (Μονάδες, Δεκάδες, Εκατοντάδες, Ϛ=6, Ϟ=90, Ϡ=900), Πυθαγόρειο Πυθμένα & Εξαγωγή CSV.
          </p>
          <div
            className={`pt-2 border-t flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-[11px] ${
              theme === "parchment" || theme === "ancient-calligraphy"
                ? "border-[#bfa37c]/60 text-[#634324]"
                : "border-[#1e1913] text-[#8c7e6c]"
            }`}
          >
            <p>
              © {new Date().getFullYear()}{" "}
              <strong
                className={
                  theme === "parchment" || theme === "ancient-calligraphy"
                    ? "text-[#8c5307]"
                    : "text-[#e6c670]"
                }
              >
                Ιωάννης Βελούδος
              </strong>
            </p>
            <span className="hidden sm:inline text-inherit">•</span>
            <p>Όλα τα πνευματικά δικαιώματα κατοχυρωμένα (All Rights Reserved)</p>
          </div>
        </div>
      </footer>

      {/* AI Analysis Modal */}
      <AiAnalysisModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        text={aiText}
        number={aiNumber}
        words={aiWords}
        customApiKey={customApiKey}
      />

      {/* User API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={customApiKey}
      />

      {/* Export Report Research Modal */}
      <ExportReportModal
        isOpen={exportReportOpen}
        onClose={() => setExportReportOpen(false)}
        savedItems={savedItems}
      />

      {/* Ancient Greek Font Selector Modal */}
      <GreekFontSelectorModal
        isOpen={fontModalOpen}
        onClose={() => setFontModalOpen(false)}
        currentFontId={currentFontId}
        onSelectFont={handleSelectFont}
      />

      {/* 5-Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Mystical Portal Gate Intro (Lavreion / Velos + Oudos) */}
      {showPortalGate && (
        <PortalGateIntro
          onEnter={() => setShowPortalGate(false)}
          onClose={() => setShowPortalGate(false)}
        />
      )}

      {/* Mobile Quick Bottom Navigation Bar (Direct Access to Key Views) */}
      <nav
        id="mobile-bottom-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t px-1 py-1 grid grid-cols-6 w-full shadow-2xl pb-[max(0.375rem,env(safe-area-inset-bottom))] transition-colors ${
          theme === "parchment" || theme === "ancient-calligraphy"
            ? "bg-[#f8f4ec]/98 border-[#bfa37c] text-[#4a2808] shadow-[0_-4px_20px_rgba(90,60,25,0.12)]"
            : theme === "solar"
            ? "bg-[#fffdf5]/98 border-[#e0bf7a] text-[#b45309] shadow-[0_-4px_20px_rgba(217,119,6,0.12)]"
            : theme === "ethereal"
            ? "bg-[#070e24]/95 border-[#1e3a8a] text-[#38bdf8]"
            : theme === "cyber-tech"
            ? "bg-[#061418]/95 border-[#065f46] text-[#10b981]"
            : "bg-[#120f0c]/95 border-[#33261a] text-[#e8dfd1]"
        }`}
      >
        {[
          { id: "calculator" as TabType, label: "Υπολογισμός", icon: Calculator },
          { id: "search" as TabType, label: "Αναζήτηση", icon: Search },
          { id: "calendar" as TabType, label: "Ημερολόγιο", icon: Calendar },
          { id: "cube-apollo" as TabType, label: "Κύβος 1331", icon: Box },
          { id: "archive" as TabType, label: "Θησαυρός", icon: BookMarked, badge: savedItems.length },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isParchment = theme === "parchment" || theme === "ancient-calligraphy";
          const isSolar = theme === "solar";
          const isLight = isParchment || isSolar;
          const isEthereal = theme === "ethereal";
          const isCyberTech = theme === "cyber-tech";

          // Active vs Inactive tab button styling
          const activeBtnClass = isParchment
            ? "text-white font-bold bg-[#783d07] shadow-sm"
            : isSolar
            ? "text-white font-bold bg-[#b45309] shadow-sm"
            : isEthereal
            ? "text-[#040816] font-bold bg-[#38bdf8] shadow-sm"
            : isCyberTech
            ? "text-[#022c22] font-bold bg-[#10b981] shadow-sm"
            : "text-[#ffd700] font-bold bg-[#241c14] border border-[#c89b3c]/40";

          const inactiveBtnClass = isLight
            ? "text-[#5c3e21] hover:text-[#2b1704] font-medium"
            : isEthereal || isCyberTech
            ? "text-[#94a3b8] hover:text-[#e2e8f0] font-medium"
            : "text-[#a69680] hover:text-[#d6c7b2]";

          const activeIconClass = isLight
            ? "text-white"
            : isEthereal
            ? "text-[#040816]"
            : isCyberTech
            ? "text-[#022c22]"
            : "text-[#ffd700]";

          const inactiveIconClass = isLight
            ? "text-[#8a5b28]"
            : isEthereal || isCyberTech
            ? "text-[#64748b]"
            : "text-[#8c7e6c]";

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-all cursor-pointer touch-manipulation min-h-[44px] w-full min-w-0 overflow-hidden ${
                isActive ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 ${
                    isActive ? activeIconClass : inactiveIconClass
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2 text-[8px] px-1 py-0.1 rounded-full font-bold leading-none ${
                      isActive
                        ? "bg-white text-[#783d07]"
                        : isLight
                        ? "bg-[#8c5307] text-[#fff]"
                        : isEthereal
                        ? "bg-[#38bdf8] text-[#040816]"
                        : isCyberTech
                        ? "bg-[#10b981] text-[#022c22]"
                        : "bg-[#c89b3c] text-black"
                    }`}
                  >
                    {item.badge > 999 ? "999+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[8px] xs:text-[9px] font-serif mt-0.5 tracking-tighter text-center w-full truncate block leading-tight">
                {item.label === "Κύβος 1331" ? (
                  <>
                    <span className="xs:hidden">Κύβος</span>
                    <span className="hidden xs:inline">Κύβος 1331</span>
                  </>
                ) : (
                  item.label
                )}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => handleOpenAiModal("ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", 2368, ["ΙΗΣΟΥΣ", "ΧΡΙΣΤΟΣ"])}
          className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-all cursor-pointer touch-manipulation min-h-[44px] w-full min-w-0 overflow-hidden ${
            theme === "parchment" || theme === "ancient-calligraphy"
              ? "text-[#783d07] hover:bg-[#ebdcc5]/60"
              : theme === "solar"
              ? "text-[#b45309] hover:bg-[#faebd0]/60"
              : theme === "ethereal"
              ? "text-[#38bdf8] hover:bg-[#0c1427]/60"
              : theme === "cyber-tech"
              ? "text-[#10b981] hover:bg-[#0c1524]/60"
              : "text-[#f5ecd8] hover:bg-[#241c14]/70"
          }`}
        >
          <Sparkles
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 animate-pulse ${
              theme === "parchment" || theme === "ancient-calligraphy"
                ? "text-[#783d07]"
                : theme === "solar"
                ? "text-[#b45309]"
                : theme === "ethereal"
                ? "text-[#38bdf8]"
                : theme === "cyber-tech"
                ? "text-[#10b981]"
                : "text-[#ffd700]"
            }`}
          />
          <span
            className={`text-[8px] xs:text-[9px] font-serif mt-0.5 font-bold tracking-tighter text-center w-full truncate block leading-tight ${
              theme === "parchment" || theme === "ancient-calligraphy" || theme === "solar"
                ? "text-[#8c5307]"
                : "text-[#e6c670]"
            }`}
          >
            AI
          </span>
        </button>
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#1e1914] border border-[#c89b3c]/60 text-[#f5ecd8] text-xs font-serif shadow-2xl shadow-black flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#c89b3c]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
