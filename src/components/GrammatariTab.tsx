import React, { useState, useMemo, useEffect } from "react";
import {
  SpellCheck,
  Search,
  Sparkles,
  Layers,
  Copy,
  Check,
  BookmarkPlus,
  ArrowUpDown,
  Filter,
  Trash2,
  BookOpen,
  Hash,
  Activity,
  PlusCircle,
  Database,
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle2,
  FolderOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Scroll,
  Feather,
  BookMarked,
  X,
} from "lucide-react";
import { solveGrammatari, GrammatariMatch } from "../utils/grammatari";
import { SavedIsopsephyItem, GrammatariSavedRecord } from "../types";
import { getWordMeaning, WordMeaningDetail } from "../data/wordMeanings";
import {
  loadGrammatariRecords,
  saveGrammatariRecord,
  deleteGrammatariRecord,
  clearAllGrammatariRecords,
} from "../utils/grammatariStorage";
import {
  exportGrammatariRecordToExcel,
  exportGrammatariRecordToCsv,
  printOrExportGrammatariToPdf,
  exportAllGrammatariDatabaseToExcel,
} from "../utils/grammatariExport";
import { SacredHarmonicsCard } from "./SacredHarmonicsCard";

interface GrammatariTabProps {
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

const PRESET_PHRASES = [
  { phrase: "ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ", desc: "1119 + 771 = 1890 (7 Φωνήεντα & Κλίμακα 111-999)" },
  { phrase: "ΣΟΦΙΑ ΚΑΙ ΑΛΗΘΕΙΑ", desc: "781 + 31 + 64 = 876" },
  { phrase: "ΑΠΟΛΛΩΝ ΗΛΙΟΣ", desc: "1061 + 318 = 1379" },
  { phrase: "ΠΥΘΑΓΟΡΑΣ Ο ΣΑΜΙΟΣ", desc: "864 + 70 + 531 = 1465" },
  { phrase: "ΑΓΑΠΗ ΚΑΙ ΕΙΡΗΝΗ", desc: "93 + 31 + 183 = 307" },
  { phrase: "ΑΡΜΟΝΙΑ ΚΟΣΜΟΥ", desc: "222 + 560 = 782" },
  { phrase: "ΛΑΥΡΕΙΟΝ", desc: "566 (Η Αρχαία Στοά του Φωτός)" },
  { phrase: "ΙΑΝΕΥΣ ΟΥΔΟΣ", desc: "666 + 744 = 1410" },
];

export const GrammatariTab: React.FC<GrammatariTabProps> = ({
  onSaveItem,
  onOpenAiModal,
}) => {
  // Navigation: "solver" (Εύρεση) or "database" (Βάση Δεδομένων Γραμματάρι)
  const [activeView, setActiveView] = useState<"solver" | "database">("solver");

  const [inputPhrase, setInputPhrase] = useState<string>("ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ");
  const [minLen, setMinLen] = useState<number>(2);
  const [maxLen, setMaxLen] = useState<number>(9);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [customWordToAdd, setCustomWordToAdd] = useState<string>("");
  const [customWordBank, setCustomWordBank] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"isopsephy" | "alphabetical" | "pythmen">("isopsephy");
  const [showMeanings, setShowMeanings] = useState<boolean>(true);
  const [selectedMeaningModal, setSelectedMeaningModal] = useState<WordMeaningDetail | null>(null);

  // Grammatari Database Records state
  const [dbRecords, setDbRecords] = useState<GrammatariSavedRecord[]>([]);
  const [dbSearch, setDbSearch] = useState<string>("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Load database on mount
  useEffect(() => {
    setDbRecords(loadGrammatariRecords());
  }, []);

  // Run the solver
  const results = useMemo(() => {
    return solveGrammatari(inputPhrase, minLen, maxLen, customWordBank);
  }, [inputPhrase, minLen, maxLen, customWordBank]);

  // Check if current phrase research is already saved in DB
  const isCurrentSaved = useMemo(() => {
    return dbRecords.some(
      (r) =>
        r.sourcePhrase.trim().toUpperCase() === inputPhrase.trim().toUpperCase() &&
        r.minLen === minLen &&
        r.maxLen === maxLen
    );
  }, [dbRecords, inputPhrase, minLen, maxLen]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSaveIndividualWord = (match: GrammatariMatch) => {
    if (onSaveItem) {
      onSaveItem({
        text: match.word,
        normalized: match.word,
        value: match.isopsephy,
        root: match.pythmen,
        greekNumeral: `${match.isopsephy}`,
        isPhrase: false,
        wordCount: 1,
        category: "Γραμματάρι",
        notes: `Αναγραμματισμός από: «${inputPhrase}» (${match.length} γράμματα) | ${match.letterBreakdown}`,
      });
      setSavedWords((prev) => new Set([...prev, match.word]));
    }
  };

  const handleAddCustomWord = () => {
    if (customWordToAdd.trim()) {
      const clean = customWordToAdd.trim().toUpperCase();
      if (!customWordBank.includes(clean)) {
        setCustomWordBank((prev) => [...prev, clean]);
      }
      setCustomWordToAdd("");
    }
  };

  // Save current whole research (original phrase + all findings grouped by length) into dedicated Grammatari DB
  const handleSaveResearchToDb = () => {
    if (!inputPhrase.trim() || results.totalAvailableLetters === 0) return;

    const isIoannisVeloudos =
      inputPhrase.toUpperCase().includes("ΙΩΑΝΝΗΣ") &&
      inputPhrase.toUpperCase().includes("ΒΕΛΟΥΔΟΣ");

    const customNotes = isIoannisVeloudos
      ? `★ Ιερή Αριθμητική, Έννοιες & Πληρότητα: Εμπεριέχει και τα 7 Φωνήεντα (Α,Ε,Η,Ι,Ο,Υ,Ω=1294->7), τα ονόματα ΙΗΣΟΥΣ (888) & ΩΛΗΝ (888 - ο αρχαιότερος ποιητής, προγενέστερος του Ορφέα, ιδρυτής του Μαντείου των Δελφών), ΙΑΝΕΥΣ (666 - φύλακας πυλών), ΟΥΔΟΣ (744 - ιερό κατώφλι Δελφών), ΒΕΛΟΣ (307) και συνδυασμούς για όλους τους αριθμούς 111-999.`
      : `Εύρεση λέξεων μήκους ${minLen}-${maxLen} γραμμάτων`;

    const saved = saveGrammatariRecord({
      title: `Γραμματάρι: ${inputPhrase.trim()}`,
      sourcePhrase: inputPhrase.trim().toUpperCase(),
      sourceIsopsephy: results.sourceIsopsephy,
      sourcePythmen: results.sourcePythmen,
      minLen,
      maxLen,
      totalLetters: results.totalAvailableLetters,
      availableLetters: results.availableLetters,
      totalMatches: results.totalMatches,
      matchesByLength: results.matchesByLength,
      notes: customNotes,
    });

    setDbRecords(loadGrammatariRecords());
    setSaveSuccessMsg(`Η έρευνα για το «${inputPhrase}» αποθηκεύτηκε στη Βάση Γραμματάρι!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleDeleteRecord = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτή την έρευνα από τη Βάση Δεδομένων Γραμματάρι;")) {
      const updated = deleteGrammatariRecord(id);
      setDbRecords(updated);
    }
  };

  const handleClearAllDb = () => {
    if (confirm("ΠΡΟΣΟΧΗ: Θέλετε να διαγράψετε ΟΛΕΣ τις αποθηκευμένες έρευνες από τη Βάση Γραμματάρι;")) {
      clearAllGrammatariRecords();
      setDbRecords([]);
    }
  };

  const handleLoadRecordIntoSolver = (record: GrammatariSavedRecord) => {
    setInputPhrase(record.sourcePhrase);
    setMinLen(record.minLen);
    setMaxLen(record.maxLen);
    setActiveView("solver");
  };

  // Filtered and sorted matches for active solver view
  const processedMatchesByLength = useMemo(() => {
    const output: Record<number, GrammatariMatch[]> = {};
    for (let l = minLen; l <= maxLen; l++) {
      let list = results.matchesByLength[l] || [];
      if (searchFilter.trim()) {
        const query = searchFilter.trim().toUpperCase();
        list = list.filter(
          (m) =>
            m.word.includes(query) ||
            m.isopsephy.toString().includes(query) ||
            m.pythmen.toString() === query
        );
      }
      if (sortBy === "alphabetical") {
        list = [...list].sort((a, b) => a.word.localeCompare(b.word));
      } else if (sortBy === "pythmen") {
        list = [...list].sort((a, b) => a.pythmen - b.pythmen || b.isopsephy - a.isopsephy);
      } else {
        list = [...list].sort((a, b) => b.isopsephy - a.isopsephy);
      }
      output[l] = list;
    }
    return output;
  }, [results, minLen, maxLen, searchFilter, sortBy]);

  const totalFilteredMatches = useMemo(() => {
    return Object.values(processedMatchesByLength).reduce((acc, list) => acc + list.length, 0);
  }, [processedMatchesByLength]);

  // Current record object ready for export
  const currentRecordForExport: GrammatariSavedRecord = useMemo(() => {
    const isIoannisVeloudos =
      inputPhrase.toUpperCase().includes("ΙΩΑΝΝΗΣ") &&
      inputPhrase.toUpperCase().includes("ΒΕΛΟΥΔΟΣ");

    return {
      id: "current",
      title: `Γραμματάρι: ${inputPhrase}`,
      sourcePhrase: inputPhrase.toUpperCase(),
      sourceIsopsephy: results.sourceIsopsephy,
      sourcePythmen: results.sourcePythmen,
      minLen,
      maxLen,
      totalLetters: results.totalAvailableLetters,
      availableLetters: results.availableLetters,
      totalMatches: results.totalMatches,
      matchesByLength: results.matchesByLength,
      notes: isIoannisVeloudos
        ? "★ Ιερή Αριθμητική & Έννοιες: 7 Φωνήεντα (Α,Ε,Η,Ι,Ο,Υ,Ω) & Κλίμακα 111-999 • ΙΗΣΟΥΣ=888 & ΩΛΗΝ=888 (ο αρχαιότερος ποιητής προγενέστερος του Ορφέα, ιδρυτής Μαντείου Δελφών), ΙΑΝΕΥΣ=666, ΟΥΔΟΣ=744, ΒΕΛΟΣ=307, ΟΛΙΑ=111, ΗΔΙΣ=222, ΣΟΛΙΕΗ=333, ΥΛΙΔ=444, ΕΥΛΟΝ=555, ΒΟΥΛΕΥΟΣ=777, ΩΟΟΝΗΑ=999"
        : `Εύρεση λέξεων μήκους ${minLen}-${maxLen} γραμμάτων`,
      createdAt: new Date().toISOString(),
    };
  }, [inputPhrase, minLen, maxLen, results]);

  // Filtered database records
  const filteredDbRecords = useMemo(() => {
    if (!dbSearch.trim()) return dbRecords;
    const q = dbSearch.trim().toUpperCase();
    return dbRecords.filter(
      (r) =>
        r.sourcePhrase.includes(q) ||
        r.sourceIsopsephy.toString().includes(q) ||
        r.totalMatches.toString().includes(q) ||
        (r.notes && r.notes.toUpperCase().includes(q))
    );
  }, [dbRecords, dbSearch]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner with Sub-Navigation */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-[#17130f] via-[#241a12] to-[#17130f] border border-[#3e2e1c] shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#c89b3c]/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-[#2a1e12] border border-[#c89b3c]/40 text-[#ffd700]">
                <SpellCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                ΓΡΑΜΜΑΤΑΡΙ (Υπο-Αναγραμματισμοί Ονόματος & Φράσης)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#b8a78e] font-serif max-w-3xl leading-relaxed">
              Εισαγάγετε ένα όνομα, λέξη ή φράση. Το <strong>Γραμματάρι</strong> αναλύει το ακριβές απόθεμα διαθέσιμων γραμμάτων και ανακαλύπτει αυτόματα όλες τις υπαρκτές λέξεις μήκους <strong>2, 3, 4, 5, 6, 7, 8, 9+ γραμμάτων</strong>, με πλήρη δυνατότητα <strong>αποθήκευσης σε ξεχωριστή Βάση Δεδομένων</strong> και <strong>άμεσης εξαγωγής σε αρχείο Excel (.xlsx) ή PDF</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenAiModal && (
              <button
                onClick={() => onOpenAiModal(inputPhrase, results.sourceIsopsephy, [])}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#9c762b] hover:to-[#dbaa45] text-black font-serif font-bold text-xs shadow-lg shadow-[#c89b3c]/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                AI Ερμηνεία
              </button>
            )}
          </div>
        </div>

        {/* View Tabs Selector */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#2d2014]">
          <button
            onClick={() => setActiveView("solver")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
              activeView === "solver"
                ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                : "bg-[#140e0a] text-[#c9baa6] hover:text-[#ffd700] border border-[#2d2014]"
            }`}
          >
            <SpellCheck className="w-4 h-4" />
            Εύρεση & Ανάλυση Λέξεων
          </button>

          <button
            onClick={() => setActiveView("database")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer relative ${
              activeView === "database"
                ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                : "bg-[#140e0a] text-[#c9baa6] hover:text-[#ffd700] border border-[#2d2014]"
            }`}
          >
            <Database className="w-4 h-4" />
            Βάση Δεδομένων Γραμματάρι
            {dbRecords.length > 0 && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeView === "database"
                    ? "bg-black text-[#ffd700]"
                    : "bg-[#ffd700]/20 text-[#ffd700]"
                }`}
              >
                {dbRecords.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Alert / Notification on Save */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center justify-between gap-3 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs font-serif">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveView("database")}
            className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-serif font-bold transition-all cursor-pointer"
          >
            Προβολή στη Βάση ➔
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: SOLVER (ΕΥΡΕΣΗ & ΑΝΑΛΥΣΗ) */}
      {/* ========================================================================= */}
      {activeView === "solver" && (
        <div className="space-y-6">
          {/* Main Input Controls & Presets */}
          <div className="p-5 rounded-2xl bg-[#140e0a] border border-[#2b1f14] space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider">
                  Λέξη ή Φράση Αναφοράς:
                </label>
                {results.sourceIsopsephy > 0 && (
                  <div className="flex items-center gap-2 text-xs font-serif">
                    <span className="text-[#a89984]">Ισοψηφία Φράσης:</span>
                    <span className="font-mono font-bold text-[#ffd700] px-2 py-0.5 rounded bg-[#20150d] border border-[#3e2918]">
                      {results.sourceIsopsephy}
                    </span>
                    <span className="text-[#a89984] ml-1">Πυθμένας:</span>
                    <span className="font-mono font-bold text-[#f5ecd8] px-1.5 py-0.5 rounded bg-[#20150d] border border-[#3e2918]">
                      {results.sourcePythmen}
                    </span>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={inputPhrase}
                  onChange={(e) => setInputPhrase(e.target.value)}
                  placeholder="π.χ. ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ..."
                  className="w-full px-4 py-3.5 pr-10 rounded-xl bg-[#0c0805] border border-[#3e2e1c] focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] text-[#f5ecd8] text-base md:text-lg font-serif font-bold placeholder-[#5a4836] transition-all outline-none"
                />
                {inputPhrase && (
                  <button
                    onClick={() => setInputPhrase("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#8a7662] hover:text-[#ffd700] hover:bg-[#1a120b] transition-all"
                    title="Καθαρισμός"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-serif text-[#a89984]">Γρήγορα Παραδείγματα:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PHRASES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputPhrase(p.phrase)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-serif border transition-all cursor-pointer ${
                      inputPhrase.toUpperCase() === p.phrase
                        ? "bg-[#332213] border-[#ffd700] text-[#ffd700]"
                        : "bg-[#0f0b08] border-[#261b11] text-[#c9baa6] hover:border-[#4d3621]"
                    }`}
                    title={p.desc}
                  >
                    {p.phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Controls and Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-2 border-t border-[#23180f]">
              {/* Min Length */}
              <div className="space-y-1">
                <label className="text-[11px] font-serif text-[#a89984]">Ελάχιστο Μήκος Γραμμάτων:</label>
                <select
                  value={minLen}
                  onChange={(e) => setMinLen(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c0805] border border-[#332415] text-[#f5ecd8] text-xs font-serif outline-none"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} Γράμματα
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Length */}
              <div className="space-y-1">
                <label className="text-[11px] font-serif text-[#a89984]">Μέγιστο Μήκος Γραμμάτων:</label>
                <select
                  value={maxLen}
                  onChange={(e) => setMaxLen(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c0805] border border-[#332415] text-[#f5ecd8] text-xs font-serif outline-none"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                    <option key={num} value={num}>
                      {num} Γράμματα
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting */}
              <div className="space-y-1">
                <label className="text-[11px] font-serif text-[#a89984]">Ταξινόμηση Αποτελεσμάτων:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0c0805] border border-[#332415] text-[#f5ecd8] text-xs font-serif outline-none"
                >
                  <option value="isopsephy">Κατά Λεξάριθμο (Φθίνουσα)</option>
                  <option value="alphabetical">Αλφαβητικά (Α-Ω)</option>
                  <option value="pythmen">Κατά Πυθμένα (1-9)</option>
                </select>
              </div>

              {/* Search within results */}
              <div className="space-y-1">
                <label className="text-[11px] font-serif text-[#a89984]">Φίλτρο στα Αποτελέσματα:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Αναζήτηση λέξης ή αριθμού..."
                    className="w-full px-3 py-2 pl-8 rounded-lg bg-[#0c0805] border border-[#332415] text-[#f5ecd8] text-xs font-serif placeholder-[#5a4836] outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8a7662] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar: Save to DB & Export to Excel / PDF / CSV */}
          <div className="p-4 rounded-2xl bg-[#17100b] border border-[#3a2717] flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveResearchToDb}
                disabled={results.totalAvailableLetters === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-serif font-bold text-xs transition-all cursor-pointer shadow-lg ${
                  isCurrentSaved
                    ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-800"
                    : "bg-gradient-to-r from-[#ffd700] to-[#e6b800] text-black hover:from-[#ffe033] hover:to-[#ffd700] shadow-[#ffd700]/20"
                }`}
                title="Αποθήκευση της αρχικής λέξης και όλων των ευρημάτων στη ξεχωριστή Βάση Δεδομένων"
              >
                {isCurrentSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    Ενημέρωση στη Βάση Γραμματάρι
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Αποθήκευση στη Βάση Γραμματάρι
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Export to Excel (.xlsx) */}
              <button
                onClick={() => exportGrammatariRecordToExcel(currentRecordForExport)}
                disabled={results.totalMatches === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f2e1a] hover:bg-[#164426] border border-[#1e6137] text-emerald-300 text-xs font-serif font-bold transition-all cursor-pointer shadow disabled:opacity-50"
                title="Εξαγωγή σε αρχείο Excel (.xlsx) με αναλυτικά φύλλα"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Εξαγωγή Excel (.xlsx)
              </button>

              {/* Export to PDF */}
              <button
                onClick={() => printOrExportGrammatariToPdf(currentRecordForExport)}
                disabled={results.totalMatches === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#331c12] hover:bg-[#4d2a1a] border border-[#6b3820] text-amber-300 text-xs font-serif font-bold transition-all cursor-pointer shadow disabled:opacity-50"
                title="Εξαγωγή σε αρχείο PDF / Εκτύπωση υψηλής ανάλυσης"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                Εξαγωγή PDF
              </button>

              {/* Export to CSV */}
              <button
                onClick={() => exportGrammatariRecordToCsv(currentRecordForExport)}
                disabled={results.totalMatches === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a140f] hover:bg-[#2a2018] border border-[#3e2e1c] text-[#c9baa6] text-xs font-serif transition-all cursor-pointer shadow disabled:opacity-50"
                title="Εξαγωγή σε CSV"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
            </div>
          </div>

          {/* Available Letters Breakdown (Απόθεμα & Συχνότητα Γραμμάτων) */}
          <div className="p-5 rounded-2xl bg-[#100b07] border border-[#261a10] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-serif font-bold text-[#e6c670] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#c89b3c]" />
                Διαθέσιμο Απόθεμα Γραμμάτων ({results.totalAvailableLetters} γράμματα):
              </h3>
              <span className="text-[11px] font-mono text-[#8a7662]">
                Μοναδικά Γράμματα: {results.availableLetters.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {results.availableLetters.map(({ letter, count }) => (
                <div
                  key={letter}
                  className="px-3 py-1.5 rounded-xl bg-[#19110a] border border-[#3a2717] flex items-center gap-2 shadow-sm"
                >
                  <span className="text-base font-serif font-bold text-[#ffd700]">{letter}</span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#2d1c10] text-[#f5ecd8] border border-[#4d321d]">
                    ×{count}
                  </span>
                </div>
              ))}
              {results.availableLetters.length === 0 && (
                <span className="text-xs text-[#786653] font-serif italic">
                  Δεν υπάρχουν διαθέσιμα ελληνικά γράμματα. Εισαγάγετε κείμενο παραπάνω.
                </span>
              )}
            </div>
          </div>

          {/* Dedicated Sacred Harmonics & 7 Vowels Analysis Card */}
          <SacredHarmonicsCard
            onSelectWordForTest={(word) => {
              setSearchFilter(word);
              const el = document.getElementById("grammatari-results-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Results Overview Stats Bar & Controls */}
          <div id="grammatari-results-section" className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex flex-wrap items-center gap-3 text-xs font-serif text-[#c9baa6]">
              <span>
                Βρέθηκαν <strong>{totalFilteredMatches}</strong> συμβατές λέξεις στο Γραμματάρι (εύρος {minLen}-{maxLen} γράμματα)
              </span>
              {searchFilter && <span className="text-[#ffd700]">(φιλτραρισμένες)</span>}

              <button
                type="button"
                onClick={() => setShowMeanings(!showMeanings)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-serif transition-colors cursor-pointer border ${
                  showMeanings
                    ? "bg-[#2b1f13] text-[#ffd700] border-[#6b4522]"
                    : "bg-[#140c06] text-[#8a7662] border-[#2b180c] hover:text-[#f5ecd8]"
                }`}
                title="Εμφάνιση ή απόκρυψη ιστορικών εννοιών και ερμηνειών"
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Έννοιες & Ερμηνείες: {showMeanings ? "ΕΝΕΡΓΕΣ" : "ΑΝΕΝΕΡΓΕΣ"}</span>
              </button>
            </div>

            {/* Custom Word Add Trigger */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={customWordToAdd}
                onChange={(e) => setCustomWordToAdd(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomWord()}
                placeholder="Προσθήκη νέας λέξης..."
                className="px-2.5 py-1.5 rounded-lg bg-[#0c0805] border border-[#332415] text-[#f5ecd8] text-xs font-serif outline-none w-44"
              />
              <button
                onClick={handleAddCustomWord}
                className="px-2.5 py-1.5 rounded-lg bg-[#2b1f13] hover:bg-[#3d2c1c] border border-[#4a3420] text-[#ffd700] text-xs font-serif font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Προσθήκη
              </button>
            </div>
          </div>

          {/* Matches Grouped by Word Length (2, 3, 4, 5, 6, 7, 8, 9... letters) */}
          <div className="space-y-6">
            {Array.from({ length: maxLen - minLen + 1 }, (_, i) => minLen + i).map((len) => {
              const matches = processedMatchesByLength[len] || [];
              if (matches.length === 0) return null;

              return (
                <div
                  key={len}
                  className="p-5 md:p-6 rounded-2xl bg-[#140e0a] border border-[#2b1e13] space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#24170d]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-yellow-500 text-black font-mono font-bold text-xs flex items-center justify-center shadow">
                        {len}
                      </span>
                      <h3 className="font-serif font-bold text-base text-[#f5ecd8]">
                        Λέξεις με {len} Γράμματα
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#a89984]">
                      {matches.length} {matches.length === 1 ? "λέξη" : "λέξεις"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matches.map((item, mIdx) => {
                      const isSaved = savedWords.has(item.word);
                      const meaning = getWordMeaning(item.word);
                      const isSacredHighlight =
                        item.word === "ΩΛΗΝ" ||
                        item.word === "ΙΗΣΟΥΣ" ||
                        item.word === "ΙΑΝΕΥΣ" ||
                        item.word === "ΟΥΔΟΣ" ||
                        item.word === "ΒΕΛΟΣ";

                      return (
                        <div
                          key={mIdx}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 group ${
                            isSacredHighlight
                              ? "bg-gradient-to-br from-[#1d1208] via-[#24170c] to-[#160d06] border-[#ffd700]/60 shadow-md shadow-[#ffd700]/10 ring-1 ring-[#ffd700]/20"
                              : "bg-[#0e0906] border-[#251910] hover:border-[#c89b3c]/50"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-serif font-black text-base text-[#ffd700] tracking-wide">
                                    {item.word}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c120a] text-[#c89b3c] border border-[#382414]">
                                    Πυθμ: {item.pythmen}
                                  </span>
                                  {meaning?.highlightTag && (
                                    <span className="text-[9px] font-serif font-bold px-1.5 py-0.5 rounded bg-[#38200d] text-[#ffd700] border border-[#6b421a]">
                                      {meaning.highlightTag}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#8a7662] font-mono block mt-0.5">
                                  {item.letterBreakdown}
                                </span>
                              </div>

                              <span className="text-sm font-mono font-bold text-[#f5ecd8] px-2 py-0.5 rounded-md bg-[#1f140c] border border-[#3e2918] shrink-0">
                                {item.isopsephy}
                              </span>
                            </div>

                            {/* Meaning / Historical Context snippet */}
                            {meaning && showMeanings && (
                              <div className="p-2 rounded-lg bg-[#140b05] border border-[#2e190b] text-xs text-[#cbbba7] font-serif leading-snug">
                                <p>{meaning.summary}</p>
                                {meaning.historicalContext && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMeaningModal(meaning)}
                                    className="text-[11px] text-[#ffd700] hover:underline font-serif font-bold mt-1.5 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Info className="w-3 h-3" />
                                    <span>Ιστορικό Πλαίσιο & Πηγές (Δελφοί, κ.ά.)</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[#1a110a]">
                            <div className="flex items-center gap-1">
                              {meaning && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedMeaningModal(meaning)}
                                  className="px-2 py-1 rounded-md bg-[#1f1208] hover:bg-[#331e0f] text-[#ffd700] text-[11px] font-serif border border-[#442712] flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Ετυμολογική & Μυθολογική Ανάλυση"
                                >
                                  <Scroll className="w-3 h-3 text-[#ffd700]" />
                                  <span>Εννοιολογική Σύνδεση</span>
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopy(item.word)}
                                className="p-1.5 rounded-lg text-[#a89984] hover:text-[#ffd700] hover:bg-[#1a110a] transition-all cursor-pointer"
                                title="Αντιγραφή λέξης"
                              >
                                {copiedText === item.word ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {onSaveItem && (
                                <button
                                  onClick={() => handleSaveIndividualWord(item)}
                                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                    isSaved
                                      ? "text-emerald-400 bg-emerald-950/40"
                                      : "text-[#a89984] hover:text-[#ffd700] hover:bg-[#1a110a]"
                                  }`}
                                  title="Αποθήκευση στον Γενικό Θησαυρό"
                                >
                                  <BookmarkPlus className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {totalFilteredMatches === 0 && (
              <div className="p-8 rounded-2xl bg-[#100b07] border border-[#22160e] text-center space-y-2">
                <BookOpen className="w-8 h-8 text-[#5c4632] mx-auto" />
                <p className="text-sm font-serif text-[#a89984]">
                  Δεν βρέθηκαν λέξεις με τα επιλεγμένα κριτήρια ή φίλτρα.
                </p>
                <p className="text-xs text-[#786653] font-serif">
                  Δοκιμάστε να αλλάξετε τα όρια μήκους γραμμάτων ή να προσθέσετε περισσότερα γράμματα στη φράση.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DEDICATED GRAMMATARI DATABASE (ΒΑΣΗ ΔΕΔΟΜΕΝΩΝ ΓΡΑΜΜΑΤΑΡΙ) */}
      {/* ========================================================================= */}
      {activeView === "database" && (
        <div className="space-y-6 animate-fadeIn">
          {/* DB Controls & Global Export Header */}
          <div className="p-5 rounded-2xl bg-[#140e0a] border border-[#2b1f14] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-[#ffd700] flex items-center gap-2">
                <Database className="w-5 h-5" />
                Αποθηκευμένες Έρευνες Γραμματάρι ({dbRecords.length})
              </h3>
              <p className="text-xs text-[#a89984] font-serif">
                Ξεχωριστή βάση δεδομένων όπου φυλάσσονται οι αρχικές φράσεις/λέξεις μαζί με όλα τα ευρήματά τους.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-56">
                <input
                  type="text"
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  placeholder="Αναζήτηση στη βάση..."
                  className="w-full px-3 py-2 pl-8 rounded-xl bg-[#0c0805] border border-[#332415] text-[#f5ecd8] text-xs font-serif placeholder-[#5a4836] outline-none"
                />
                <Search className="w-3.5 h-3.5 text-[#8a7662] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {dbRecords.length > 0 && (
                <>
                  <button
                    onClick={() => exportAllGrammatariDatabaseToExcel(dbRecords)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f2e1a] hover:bg-[#164426] border border-[#1e6137] text-emerald-300 text-xs font-serif font-bold transition-all cursor-pointer"
                    title="Εξαγωγή όλων των ερευνών σε ενιαίο αρχείο Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Εξαγωγή Όλης της Βάσης (.xlsx)
                  </button>

                  <button
                    onClick={handleClearAllDb}
                    className="p-2 rounded-xl bg-[#24130d] hover:bg-[#361a12] border border-[#4d2417] text-rose-300 transition-all cursor-pointer"
                    title="Εκκαθάριση όλης της Βάσης Γραμματάρι"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* List of Saved Grammatari Records */}
          <div className="space-y-4">
            {filteredDbRecords.map((record) => {
              const isExpanded = expandedRecordId === record.id;
              const lengths = Object.keys(record.matchesByLength)
                .map(Number)
                .sort((a, b) => a - b);

              return (
                <div
                  key={record.id}
                  className="rounded-2xl bg-[#140e0a] border border-[#2b1f14] hover:border-[#4d3621] transition-all overflow-hidden shadow-lg"
                >
                  {/* Record Header Card */}
                  <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-lg font-serif font-bold text-[#ffd700] tracking-wide">
                          {record.sourcePhrase}
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#20150d] text-[#f5ecd8] border border-[#3e2918]">
                          Λεξάριθμος: {record.sourceIsopsephy}
                        </span>
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#20150d] text-[#c89b3c] border border-[#3e2918]">
                          Πυθμ: {record.sourcePythmen}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#a89984] font-serif">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#c89b3c]" />
                          {record.totalLetters} γράμματα ({record.availableLetters.length} μοναδικά)
                        </span>
                        <span>•</span>
                        <span>Εύρος: {record.minLen} έως {record.maxLen} γράμματα</span>
                        <span>•</span>
                        <span className="text-[#ffd700] font-bold">
                          {record.totalMatches} ευρήματα (λέξεις)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#786653]">
                          <Calendar className="w-3 h-3" />
                          {new Date(record.createdAt).toLocaleDateString("el-GR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons for this record */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#22160e]">
                      {/* Load into solver */}
                      <button
                        onClick={() => handleLoadRecordIntoSolver(record)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#20150d] hover:bg-[#332213] border border-[#442c17] text-[#ffd700] text-xs font-serif font-bold transition-all cursor-pointer"
                        title="Φόρτωση της φράσης στο εργαλείο εύρεσης"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Φόρτωση
                      </button>

                      {/* Export Excel */}
                      <button
                        onClick={() => exportGrammatariRecordToExcel(record)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0f2e1a] hover:bg-[#164426] border border-[#1e6137] text-emerald-300 text-xs font-serif font-bold transition-all cursor-pointer"
                        title="Εξαγωγή σε Excel (.xlsx)"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        Excel
                      </button>

                      {/* Export PDF */}
                      <button
                        onClick={() => printOrExportGrammatariToPdf(record)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#331c12] hover:bg-[#4d2a1a] border border-[#6b3820] text-amber-300 text-xs font-serif font-bold transition-all cursor-pointer"
                        title="Εξαγωγή σε PDF / Εκτύπωση"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        PDF
                      </button>

                      {/* Export CSV */}
                      <button
                        onClick={() => exportGrammatariRecordToCsv(record)}
                        className="p-1.5 rounded-xl bg-[#19110a] hover:bg-[#291c10] border border-[#382414] text-[#c9baa6] transition-all cursor-pointer"
                        title="Εξαγωγή σε CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Expand View */}
                      <button
                        onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                        className="p-1.5 rounded-xl bg-[#19110a] hover:bg-[#291c10] border border-[#382414] text-[#ffd700] transition-all cursor-pointer"
                        title={isExpanded ? "Σύμπτυξη" : "Προβολή όλων των λέξεων"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleDeleteRecord(record.id, e)}
                        className="p-1.5 rounded-xl bg-[#24130d] hover:bg-[#361a12] border border-[#4d2417] text-rose-300 transition-all cursor-pointer"
                        title="Διαγραφή από τη Βάση"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded View: Show All Found Words Grouped by Length */}
                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-[#20150e] space-y-4 bg-[#0d0906] animate-fadeIn">
                      <div className="pt-3 flex flex-wrap gap-1.5 text-xs text-[#a89984] font-serif">
                        <span className="font-bold text-[#e6c670]">Απόθεμα:</span>
                        {record.availableLetters.map((l) => (
                          <span key={l.letter} className="px-1.5 py-0.5 rounded bg-[#1c120a] border border-[#332213] text-[#ffd700] font-mono">
                            {l.letter}×{l.count}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-4">
                        {lengths.map((len) => {
                          const list = record.matchesByLength[len] || [];
                          if (list.length === 0) return null;

                          return (
                            <div key={len} className="space-y-2">
                              <div className="text-xs font-serif font-bold text-[#c89b3c] flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-[#2a1b0e] text-[#ffd700] text-[10px] font-mono flex items-center justify-center border border-[#4d321d]">
                                  {len}
                                </span>
                                {len} Γράμματα ({list.length} λέξεις):
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {list.map((m, idx) => (
                                  <div
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg bg-[#140e0a] border border-[#2d1d11] text-xs font-serif flex items-center gap-2"
                                  >
                                    <span className="font-bold text-[#f5ecd8]">{m.word}</span>
                                    <span className="font-mono text-[11px] text-[#ffd700]">{m.isopsephy}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredDbRecords.length === 0 && (
              <div className="p-10 rounded-2xl bg-[#100b07] border border-[#22160e] text-center space-y-3">
                <Database className="w-10 h-10 text-[#5c4632] mx-auto" />
                <p className="text-sm font-serif text-[#a89984]">
                  {dbRecords.length === 0
                    ? "Δεν υπάρχουν ακόμη αποθηκευμένες έρευνες στη Βάση Δεδομένων Γραμματάρι."
                    : "Δεν βρέθηκαν αποτελέσματα με τον όρο αναζήτησης."}
                </p>
                <p className="text-xs text-[#786653] font-serif">
                  Μεταβείτε στην καρτέλα «Εύρεση & Ανάλυση Λέξεων» και πατήστε «Αποθήκευση στη Βάση Γραμματάρι» για να διατηρήσετε οποιαδήποτε ανάλυση.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Historical Meaning & Delphic Context Modal */}
      {/* ========================================================================= */}
      {selectedMeaningModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedMeaningModal(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#130b06] border border-[#d4af37]/40 shadow-2xl p-6 md:p-8 space-y-6 text-[#f5ecd8] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMeaningModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#201208] text-[#c9baa6] hover:text-[#ffd700] hover:bg-[#331c0d] transition-all cursor-pointer"
              title="Κλείσιμο"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-[#2b170c] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-black text-xl flex items-center justify-center shadow-lg">
                  {selectedMeaningModal.word.charAt(0)}
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl md:text-3xl font-serif font-black text-[#ffd700] tracking-wide">
                      {selectedMeaningModal.word}
                    </h2>
                    {selectedMeaningModal.highlightTag && (
                      <span className="text-xs font-serif font-bold px-2 py-0.5 rounded-full bg-[#3d2410] text-[#ffd700] border border-[#6b421a]">
                        {selectedMeaningModal.highlightTag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#a89984] mt-1">
                    <span>Ισοψηφία: <strong className="text-[#ffd700] text-sm">{selectedMeaningModal.isopsephy}</strong></span>
                    <span>•</span>
                    <span>Πυθμένας: <strong className="text-[#ffd700]">{(selectedMeaningModal.isopsephy % 9 === 0 ? 9 : selectedMeaningModal.isopsephy % 9)}</strong></span>
                    <span>•</span>
                    <span className="text-[#c89b3c] font-serif">{selectedMeaningModal.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Etymology / Linguistic Root */}
            {selectedMeaningModal.etymology && (
              <div className="p-3.5 rounded-2xl bg-[#170e07] border border-[#3b2310] space-y-1">
                <h4 className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-[#ffd700]" />
                  Ετυμολογία & Γλωσσολογική Ρίζα
                </h4>
                <p className="text-xs sm:text-sm font-serif text-[#ebd6be] leading-relaxed italic">
                  {selectedMeaningModal.etymology}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-[#1b1008] border border-[#3b2311] space-y-1.5">
              <h4 className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-2">
                <Scroll className="w-4 h-4 text-[#ffd700]" />
                Εννοιολογική Σύνδεση & Ερμηνεία
              </h4>
              <p className="text-sm font-serif text-[#f2e6d0] leading-relaxed">
                {selectedMeaningModal.summary}
              </p>
            </div>

            {/* Detailed Description if available */}
            {selectedMeaningModal.description && (
              <div className="space-y-2">
                <h4 className="text-xs font-serif font-bold text-[#c89b3c] uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#c89b3c]" />
                  Αναλυτική Ερμηνεία
                </h4>
                <p className="text-xs sm:text-sm font-serif text-[#d6c5b2] leading-relaxed">
                  {selectedMeaningModal.description}
                </p>
              </div>
            )}

            {/* Historical Context / Delphic Oracle */}
            {selectedMeaningModal.historicalContext && (
              <div className="p-4 rounded-2xl bg-[#23140a] border border-[#523218] space-y-2">
                <h4 className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-2">
                  <Feather className="w-4 h-4 text-[#ffd700]" />
                  Ιστορικό & Μυθολογικό Πλαίσιο (Δελφοί / Αρχαιότητα)
                </h4>
                <p className="text-xs sm:text-sm font-serif text-[#f0dfc8] leading-relaxed">
                  {selectedMeaningModal.historicalContext}
                </p>
              </div>
            )}

            {/* Source References */}
            {selectedMeaningModal.sourceReferences && (
              <div className="pt-3 border-t border-[#29170c] space-y-1.5">
                <h5 className="text-[11px] font-serif font-bold text-[#8a7662] uppercase tracking-wider">
                  Αρχαίες Πηγές & Μαρτυρίες:
                </h5>
                <p className="text-xs text-[#a89984] font-serif italic">
                  {selectedMeaningModal.sourceReferences}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#29170c]">
              <button
                onClick={() => {
                  handleCopy(selectedMeaningModal.word);
                }}
                className="px-4 py-2 rounded-xl bg-[#22140a] hover:bg-[#382010] text-[#ffd700] text-xs font-serif font-bold border border-[#4d2d17] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Αντιγραφή Ονόματος
              </button>
              <button
                onClick={() => setSelectedMeaningModal(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-serif font-black text-xs hover:from-amber-500 hover:to-yellow-500 transition-all cursor-pointer shadow-md"
              >
                Κλείσιμο
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
