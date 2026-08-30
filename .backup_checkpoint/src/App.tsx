import React, { useState, useEffect } from "react";
import { TabType, SavedIsopsephyItem } from "./types";
import { Header } from "./components/Header";
import { CalculatorTab } from "./components/CalculatorTab";
import { SearchTab } from "./components/SearchTab";
import { OnlineFinderTab } from "./components/OnlineFinderTab";
import { BridgesTab } from "./components/BridgesTab";
import { AnagramsTab } from "./components/AnagramsTab";
import { IsopsephicGraphTab } from "./components/IsopsephicGraphTab";
import { VeloudionTab } from "./components/VeloudionTab";
import { CubeApolloTab } from "./components/CubeApolloTab";
import { StatsTab } from "./components/StatsTab";
import { ArchiveTab } from "./components/ArchiveTab";
import { GuideTab } from "./components/GuideTab";
import { AiAnalysisModal } from "./components/AiAnalysisModal";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { ExportReportModal } from "./components/ExportReportModal";
import { PortalGateIntro } from "./components/PortalGateIntro";
import { numberToGreekNumeral } from "./utils/isopsephy";

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
    const newItem: SavedIsopsephyItem = {
      ...itemData,
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
      showToast(`Αποθηκεύτηκε: «${newItem.text}» = ${newItem.value}`);
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
    <div className="min-h-screen bg-[#0d0c0a] text-[#e8dfd1] flex flex-col font-sans selection:bg-[#c89b3c]/30 selection:text-[#f4e2b7] pt-[env(safe-area-inset-top,0px)]">
      
      {/* App Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={savedItems.length}
        hasCustomApiKey={!!customApiKey}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        onOpenPortalGate={() => setShowPortalGate(true)}
        onOpenExportReport={() => setExportReportOpen(true)}
        onOpenAiAssistant={() => handleOpenAiModal("ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", 2368, ["ΙΗΣΟΥΣ", "ΧΡΙΣΤΟΣ"])}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {currentTab === "calculator" && (
          <CalculatorTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
            savedItems={savedItems}
          />
        )}

        {currentTab === "search" && (
          <SearchTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
            savedItems={savedItems}
          />
        )}

        {currentTab === "online-finder" && (
          <OnlineFinderTab
            onSaveItem={handleSaveItem}
            onOpenAiModal={handleOpenAiModal}
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
          />
        )}

        {currentTab === "guide" && <GuideTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#241d16] bg-[#12100d] py-6 text-center text-xs font-serif text-[#7a6e5e]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="tracking-wide text-[#a69680]">
            <strong>Λεξάριθμος</strong> • Αρχαία Ελληνική Ιωνική Ισοψηφία, Στατιστική & Πολυτονική Ανάλυση Κειμένων
          </p>
          <p className="text-[11px] text-[#5e5345]">
            Υποστηρίζει 27 Ιωνικά ψηφία (Μονάδες, Δεκάδες, Εκατοντάδες, Ϛ=6, Ϟ=90, Ϡ=900), Πυθαγόρειο Πυθμένα & Εξαγωγή CSV.
          </p>
          <div className="pt-2 border-t border-[#1e1913] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-[11px] text-[#8c7e6c]">
            <p>© {new Date().getFullYear()} <strong className="text-[#e6c670]">Ιωάννης Βελούδος</strong></p>
            <span className="hidden sm:inline text-[#4a4034]">•</span>
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

      {/* Mystical Portal Gate Intro (Lavreion / Velos + Oudos) */}
      {showPortalGate && (
        <PortalGateIntro
          onEnter={() => setShowPortalGate(false)}
          onClose={() => setShowPortalGate(false)}
        />
      )}

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
