import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  GOLDEN_VERSES_SECTIONS,
  PYTHAGORAS_INTRODUCTION,
  FOOTNOTES,
  GoldenVerseSection,
} from "../data/goldenVerses";
import {
  calculateWordIsopsephy,
  calculatePythmen,
  numberToGreekNumeral,
  normalizePolytonicGreek,
} from "../utils/isopsephy";
import {
  prepareAncientGreekForSpeech,
  isSpeechSynthesisSupported,
  getBestGreekVoice,
} from "../utils/greekAudio";
import { SavedIsopsephyItem } from "../types";
import {
  ScrollText,
  BookOpen,
  Search,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  BookmarkPlus,
  Columns2,
  Rows3,
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  X,
  PanelRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
  Radio,
  FileText,
} from "lucide-react";
import { GoldenVersesExportModal } from "./GoldenVersesExportModal";

interface GoldenVersesTabProps {
  onNavigateToCalculator?: (text: string) => void;
  onNavigateToSearch?: (text: string) => void;
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal?: (text: string, value: number, words: string[]) => void;
}

interface SelectedWordDetails {
  rawWord: string;
  normalized: string;
  value: number;
  root: number;
  numeral: string;
  letters: { char: string; value: number }[];
}

export const GoldenVersesTab: React.FC<GoldenVersesTabProps> = ({
  onNavigateToCalculator,
  onNavigateToSearch,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"all" | "ethical" | "metaphysical" | "intro">("all");
  const [layoutMode, setLayoutMode] = useState<"side-by-side" | "interleaved">("side-by-side");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [selectedWord, setSelectedWord] = useState<SelectedWordDetails | null>(null);
  const [activeLineNumber, setActiveLineNumber] = useState<number | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [showStickyFooter, setShowStickyFooter] = useState<boolean>(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [selectedExportSectionId, setSelectedExportSectionId] = useState<string | null>(null);

  // Web Speech API Text-to-Speech State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playingLineNumber, setPlayingLineNumber] = useState<number | null>(null);
  const [playingSectionId, setPlayingSectionId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.88);
  const [availableVoiceName, setAvailableVoiceName] = useState<string>("");
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  interface SpeechQueueItem {
    lineNumber: number;
    ancientLine: string;
    sectionId?: string;
  }

  const queueRef = useRef<SpeechQueueItem[]>([]);
  const queueIndexRef = useRef<number>(0);
  const rateRef = useRef<number>(speechRate);
  rateRef.current = speechRate;

  // Initialize and check SpeechSynthesis
  useEffect(() => {
    if (!isSpeechSynthesisSupported()) {
      setSpeechSupported(false);
      return;
    }
    setSpeechSupported(true);

    const updateVoice = () => {
      const v = getBestGreekVoice();
      if (v) {
        setAvailableVoiceName(v.name);
      }
    };

    updateVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoice;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playLineAtIndex = (index: number) => {
    if (!isSpeechSynthesisSupported()) return;

    const queue = queueRef.current;
    if (index < 0 || index >= queue.length) {
      // Completed all items in the recitation queue
      setIsPlaying(false);
      setIsPaused(false);
      setPlayingLineNumber(null);
      setPlayingSectionId(null);
      queueRef.current = [];
      queueIndexRef.current = 0;
      return;
    }

    queueIndexRef.current = index;
    const item = queue[index];

    // Cancel previous utterance
    window.speechSynthesis.cancel();

    // Prepare ancient Greek text with accurate tonal prosody
    const phoneticText = prepareAncientGreekForSpeech(item.ancientLine);
    const utterance = new SpeechSynthesisUtterance(phoneticText);

    utterance.lang = "el-GR";
    const greekVoice = getBestGreekVoice();
    if (greekVoice) {
      utterance.voice = greekVoice;
    }
    utterance.rate = rateRef.current;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setPlayingLineNumber(item.lineNumber);
      if (item.sectionId) {
        setPlayingSectionId(item.sectionId);
      }

      // Smoothly scroll the recited verse into view
      const elem = document.getElementById(`verse-line-${item.lineNumber}`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };

    utterance.onend = () => {
      if (queueRef.current.length > 0) {
        playLineAtIndex(index + 1);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("SpeechSynthesis error:", e.error);
      }
      if (e.error !== "canceled") {
        setIsPlaying(false);
        setIsPaused(false);
        setPlayingLineNumber(null);
        setPlayingSectionId(null);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayAllVerses = () => {
    if (!isSpeechSynthesisSupported()) return;

    const allLines: SpeechQueueItem[] = [];
    GOLDEN_VERSES_SECTIONS.forEach((sec) => {
      sec.ancientLines.forEach((line, idx) => {
        allLines.push({
          lineNumber: sec.startLine + idx,
          ancientLine: line,
          sectionId: sec.id,
        });
      });
    });

    queueRef.current = allLines;
    queueIndexRef.current = 0;
    setPlayingSectionId(null);
    playLineAtIndex(0);
  };

  const handleTogglePlaySection = (sec: GoldenVerseSection) => {
    if (!isSpeechSynthesisSupported()) return;

    if (playingSectionId === sec.id && isPlaying) {
      handleStopSpeech();
      return;
    }

    const sectionLines: SpeechQueueItem[] = sec.ancientLines.map((line, idx) => ({
      lineNumber: sec.startLine + idx,
      ancientLine: line,
      sectionId: sec.id,
    }));

    queueRef.current = sectionLines;
    queueIndexRef.current = 0;
    setPlayingSectionId(sec.id);
    playLineAtIndex(0);
  };

  const handlePlaySingleVerse = (lineNumber: number, ancientLine: string, sectionId?: string) => {
    if (!isSpeechSynthesisSupported()) return;

    if (playingLineNumber === lineNumber && isPlaying) {
      handleStopSpeech();
      return;
    }

    queueRef.current = [{ lineNumber, ancientLine, sectionId }];
    queueIndexRef.current = 0;
    if (sectionId) setPlayingSectionId(sectionId);
    playLineAtIndex(0);
  };

  const handlePauseResume = () => {
    if (!isSpeechSynthesisSupported()) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      if (!window.speechSynthesis.speaking && queueRef.current.length > 0) {
        playLineAtIndex(queueIndexRef.current);
      }
    } else if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    queueRef.current = [];
    queueIndexRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setPlayingLineNumber(null);
    setPlayingSectionId(null);
  };

  const handleChangeRate = (newRate: number) => {
    setSpeechRate(newRate);
    rateRef.current = newRate;
  };

  // Filter sections based on search query and level filter
  const filteredSections = useMemo(() => {
    return GOLDEN_VERSES_SECTIONS.filter((sec) => {
      // Level filter
      if (activeFilter === "ethical" && sec.level !== "ethical") return false;
      if (activeFilter === "metaphysical" && sec.level !== "metaphysical") return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const normQ = normalizePolytonicGreek(searchQuery).toLowerCase().trim();

      const inAncient = sec.ancientLines.some((l) => {
        const lineLow = l.toLowerCase();
        const normLine = normalizePolytonicGreek(l).toLowerCase();
        return lineLow.includes(q) || normLine.includes(normQ);
      });

      const inModern = sec.modernLines.some((l) => l.toLowerCase().includes(q));
      const inTitle = sec.title.toLowerCase().includes(q);
      const inRange = sec.range.includes(q);

      return inAncient || inModern || inTitle || inRange;
    });
  }, [activeFilter, searchQuery]);

  const handleCopySection = (sec: GoldenVerseSection) => {
    const text = `${sec.levelName} (${sec.range})\n${sec.title}\n\n[ΑΡΧΑΙΟ ΚΕΙΜΕΝΟ]\n${sec.ancientLines.join("\n")}\n\n[ΝΕΟΕΛΛΗΝΙΚΗ ΑΠΟΔΟΣΗ]\n${sec.modernLines.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedId(sec.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = GOLDEN_VERSES_SECTIONS.map((sec) => {
      return `=== ${sec.levelName} • Στίχοι ${sec.range} ===\n${sec.title}\n\n[Αρχαίο]\n${sec.ancientLines.join("\n")}\n\n[Νεοελληνική]\n${sec.modernLines.join("\n")}`;
    }).join("\n\n----------------------------------------\n\n");

    navigator.clipboard.writeText(
      `ΤΑ ΧΡΥΣΑ ΕΠΗ ΤΟΥ ΠΥΘΑΓΟΡΑ\n\n${fullText}`
    );
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,·;:«»()\[\]"']/g, "").trim();
    if (!cleanWord) return;

    const calc = calculateWordIsopsephy(cleanWord);
    const root = calculatePythmen(calc.value);
    const numeral = numberToGreekNumeral(calc.value);

    setSelectedWord({
      rawWord: cleanWord,
      normalized: calc.normalizedWord,
      value: calc.value,
      root,
      numeral,
      letters: calc.letters.map((l) => ({ char: l.char, value: l.value })),
    });
  };

  const handleSaveWordToArchive = (w: SelectedWordDetails) => {
    if (onSaveItem) {
      onSaveItem({
        text: w.rawWord,
        normalized: w.normalized,
        value: w.value,
        root: w.root,
        greekNumeral: w.numeral,
        isPhrase: false,
        wordCount: 1,
        category: "Χρυσά Έπη",
        notes: `Πυθαγόρεια Χρυσά Έπη: ${w.rawWord} = ${w.value} (${w.numeral})`,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-28 relative">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1710] via-[#16120d] to-[#0c0a08] border border-amber-600/30 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-serif font-bold tracking-wide">
                Πυθαγόρας • 71 Ἱεροὶ Στίχοι
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-600/30 text-xs font-serif">
                Δακτυλικό Εξάμετρο
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2a1d12] text-amber-200 border border-amber-700/40 text-xs font-serif">
                Α. Ηθικόν & Β. Μεταφυσικόν Επίπεδον
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-100 tracking-wide">
              ΤΑ ΧΡΥΣΑ ΕΠΗ ΤΟΥ ΠΥΘΑΓΟΡΑ
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 font-serif leading-relaxed max-w-3xl">
              Τα ιερά παραγγέλματα και ο τρόπος ζωής των Πυθαγορείων.
              Αριστερά το πρωτότυπο αρχαίο κείμενο και δεξιά η νεοελληνική απόδοση.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={isPlaying ? handleStopSpeech : handlePlayAllVerses}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif font-bold cursor-pointer transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? "bg-amber-500 text-black border border-amber-400 shadow-amber-500/30 ring-2 ring-amber-400/40"
                  : "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-600 text-white border border-amber-400/40"
              }`}
              title={isPlaying ? "Διακοπή ηχητικής απαγγελίας" : "Έναρξη ηχητικής απαγγελίας των 71 στίχων (Web Speech API)"}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current animate-pulse" />
                  <span>Διακοπή Απαγγελίας</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-200" />
                  <span>🔊 Απαγγελία Στίχων</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsSidePanelOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif font-bold cursor-pointer transition-all shadow-md active:scale-95 ${
                isSidePanelOpen
                  ? "bg-amber-500 text-black border border-amber-400 shadow-amber-500/20"
                  : "bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-amber-200 border border-amber-600/50"
              }`}
              title="Άνοιγμα σταθερού side-panel: Ομακοείον, Όρκος Σιωπής & «Αὐτὸς ἔφα»"
            >
              <PanelRight className="w-4 h-4 text-amber-300" />
              <span>Πυθαγόρειο Πλαίσιο</span>
            </button>

            <button
              id="open-export-study-btn"
              type="button"
              onClick={() => {
                setSelectedExportSectionId(null);
                setIsExportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-800 hover:from-amber-600 hover:to-yellow-600 text-white font-serif font-bold text-xs cursor-pointer transition-all shadow-md active:scale-95 border border-amber-400/50"
              title="Εξαγωγή του τρέχοντος πλαισίου (εισαγωγή, στίχοι, επεξηγήσεις) σε μορφή PDF ή εικόνας για προσωπική μελέτη"
            >
              <FileText className="w-4 h-4 text-amber-200" />
              <span>📄 Εξαγωγή Μελέτης (PDF/Εικόνα)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#261d15] hover:bg-[#382b1f] border border-amber-600/40 text-amber-200 text-xs font-serif cursor-pointer transition-all shadow-md active:scale-95"
            >
              {copiedId === "all" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === "all" ? "Αντιγράφηκε όλο!" : "Αντιγραφή Όλων"}</span>
            </button>

            {onNavigateToSearch && (
              <button
                type="button"
                onClick={() => {
                  const fullAncient = GOLDEN_VERSES_SECTIONS.map((s) => s.ancientLines.join("\n")).join("\n\n");
                  onNavigateToSearch(fullAncient);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 text-xs font-serif font-semibold cursor-pointer transition-all shadow-md active:scale-95"
                title="Φόρτωση ολόκληρου του κειμένου στην καρτέλα Αναζήτηση"
              >
                <Search className="w-4 h-4" />
                <span>Ανάλυση στην Αναζήτηση</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Quick Pillars of Pythagorean Golden Verses */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-amber-900/40 text-center">
          <div className="p-2 rounded-xl bg-black/20 border border-amber-900/30">
            <div className="text-amber-400 text-xs font-serif font-bold">Α. ΗΘΙΚΟ ΕΠΙΠΕΔΟ</div>
            <div className="text-[11px] text-amber-200/70">Στίχοι 1 – 49a (Προστακτικό)</div>
          </div>
          <div className="p-2 rounded-xl bg-black/20 border border-amber-900/30">
            <div className="text-amber-400 text-xs font-serif font-bold">Β. ΜΕΤΑΦΥΣΙΚΟ ΕΠΙΠΕΔΟ</div>
            <div className="text-[11px] text-amber-200/70">Στίχοι 49b – 71 (Θέωσις)</div>
          </div>
          <div className="p-2 rounded-xl bg-black/20 border border-amber-900/30">
            <div className="text-amber-400 text-xs font-serif font-bold">ΙΕΡΑ ΤΕΤΡΑΚΤΥΣ</div>
            <div className="text-[11px] text-amber-200/70">ΤΕΤΡΑΚΤΥΣ = 1251 (1+2+3+4=10)</div>
          </div>
          <div className="p-2 rounded-xl bg-black/20 border border-amber-900/30">
            <div className="text-amber-400 text-xs font-serif font-bold">ΕΣΧΑΤΟΣ ΣΚΟΠΟΣ</div>
            <div className="text-[11px] text-amber-200/70">«Θεὸς ἄμβροτος, οὐκέτι θνητός»</div>
          </div>
        </div>
      </div>

      {/* Introduction Card (Collapsible) */}
      <div className="rounded-2xl bg-gradient-to-br from-[#19140f] to-[#120f0c] border border-amber-800/40 p-4 sm:p-6 shadow-xl space-y-4">
        <button
          type="button"
          onClick={() => setShowIntro((prev) => !prev)}
          className="w-full flex items-center justify-between text-left text-amber-200 hover:text-amber-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-sm sm:text-base text-amber-200">
              Η Μύηση & ο Τρόπος Ζωής των Πυθαγορείων (Ιστορικό & Φιλοσοφικό Πλαίσιο)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-serif">
              Ομακοείον • Σιωπή • «Αὐτὸς ἔφα» • Ιεροκλής • Χρυσός
            </span>
          </div>
          {showIntro ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
        </button>

        {showIntro && (
          <div className="pt-3 border-t border-amber-900/40 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-[13px] font-serif leading-relaxed text-amber-200/90">
              {PYTHAGORAS_INTRODUCTION.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/30 border border-amber-900/30 space-y-2 shadow-inner"
                >
                  <h4 className="font-bold text-amber-300 text-xs sm:text-sm border-b border-amber-900/30 pb-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {sec.title}
                  </h4>
                  <p className="text-amber-200/80 leading-relaxed whitespace-pre-line text-justify">
                    {sec.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Bar: Search, Filters & Layout Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#17130e] p-3 rounded-xl border border-amber-900/40 shadow-sm">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση σε αρχαίο ή νέο κείμενο (π.χ. θεούς, τετρακτύν, μέτρον, αθάνατος)..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#0e0c09] border border-amber-800/40 text-amber-100 placeholder-amber-400/40 text-xs font-serif focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-200 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif cursor-pointer transition-colors ${
              activeFilter === "all"
                ? "bg-amber-600 text-white font-bold shadow"
                : "bg-[#231b14] text-amber-200 hover:bg-[#33261a] border border-amber-900/50"
            }`}
          >
            Όλοι οι Στίχοι (1-71)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("ethical")}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif cursor-pointer transition-colors ${
              activeFilter === "ethical"
                ? "bg-amber-600 text-white font-bold shadow"
                : "bg-[#231b14] text-amber-200 hover:bg-[#33261a] border border-amber-900/50"
            }`}
          >
            Α. Ηθικό (1-49)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("metaphysical")}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif cursor-pointer transition-colors ${
              activeFilter === "metaphysical"
                ? "bg-amber-600 text-white font-bold shadow"
                : "bg-[#231b14] text-amber-200 hover:bg-[#33261a] border border-amber-900/50"
            }`}
          >
            Β. Μεταφυσικό (49-71)
          </button>
        </div>

        {/* Layout Toggle Button */}
        <div className="flex items-center gap-1 border border-amber-900/40 rounded-lg p-1 bg-[#0f0d0a] shrink-0">
          <button
            type="button"
            onClick={() => setLayoutMode("side-by-side")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-serif cursor-pointer transition-colors ${
              layoutMode === "side-by-side"
                ? "bg-amber-700 text-white font-semibold"
                : "text-amber-300 hover:text-amber-100"
            }`}
            title="Αριστερά Αρχαίο και Δεξιά Νέα Ελληνική"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Δίστηλη Παράθεση</span>
            <span className="sm:hidden">Δίστηλο</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode("interleaved")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-serif cursor-pointer transition-colors ${
              layoutMode === "interleaved"
                ? "bg-amber-700 text-white font-semibold"
                : "text-amber-300 hover:text-amber-100"
            }`}
            title="Εναλλάξ στίχος προς στίχο"
          >
            <Rows3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Εναλλάξ</span>
            <span className="sm:hidden">Εναλλάξ</span>
          </button>
        </div>

        {/* Side-Panel Quick Toggle Button */}
        <button
          type="button"
          onClick={() => setIsSidePanelOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold cursor-pointer transition-colors shrink-0 ${
            isSidePanelOpen
              ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
              : "bg-[#251d16] hover:bg-[#34271c] text-amber-300 border border-amber-700/50"
          }`}
          title="Άνοιγμα side-panel: Ομακοείον, Όρκος Σιωπής & «Αὐτὸς ἔφα»"
        >
          <PanelRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">🏛️ Πλαίσιο Μύησης</span>
          <span className="sm:hidden">🏛️ Πλαίσιο</span>
        </button>
      </div>

      {/* Selected Word Popover / Quick Calculator Drawer */}
      {selectedWord && (
        <div className="rounded-xl bg-[#221810] border border-amber-500/50 p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-serif font-bold text-amber-200">
                {selectedWord.rawWord}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-xs font-mono font-bold border border-amber-600/40">
                = {selectedWord.value}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#15120d] text-amber-400 text-xs font-serif border border-amber-800/40">
                Ιωνικό: {selectedWord.numeral}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#15120d] text-amber-400 text-xs font-serif border border-amber-800/40">
                Πυθμήν: {selectedWord.root}
              </span>
            </div>
            <div className="text-[11px] text-amber-300/70 font-mono">
              {selectedWord.letters.map((l, i) => (
                <span key={i} className="mr-2">
                  {l.char}({l.value})
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {onSaveItem && (
              <button
                type="button"
                onClick={() => {
                  handleSaveWordToArchive(selectedWord);
                  setSelectedWord(null);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-serif cursor-pointer transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Αποθήκευση</span>
              </button>
            )}

            {onNavigateToCalculator && (
              <button
                type="button"
                onClick={() => onNavigateToCalculator(selectedWord.rawWord)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2f2216] hover:bg-[#3d2c1c] text-amber-200 border border-amber-700/50 text-xs font-serif cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Υπολογιστής</span>
              </button>
            )}

            {onOpenAiModal && (
              <button
                type="button"
                onClick={() =>
                  onOpenAiModal(selectedWord.rawWord, selectedWord.value, [selectedWord.rawWord])
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1a1c2e] hover:bg-[#262947] text-indigo-200 border border-indigo-500/40 text-xs font-serif cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>AI</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedWord(null)}
              className="px-2 py-1 text-xs text-amber-400/60 hover:text-amber-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Web Speech API Audio Recitation Player Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1a140e] via-[#241910] to-[#1a140e] border border-amber-700/50 p-4 sm:p-5 shadow-2xl space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                isPlaying
                  ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-amber-950/60 text-amber-300 border-amber-700/50"
              }`}
            >
              {isPlaying ? (
                <Volume2 className="w-5 h-5 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-serif font-bold text-amber-100">
                  Απαγγελία Χρυσών Επών (Text-to-Speech)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                  Web Speech API
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-serif bg-emerald-950/60 text-emerald-300 border border-emerald-700/40">
                  Τονική Προφορά
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-serif mt-0.5">
                Φωνητική απόδοση των 71 αρχαίων στίχων με ορθή απόδοση οξείας, βαρείας & περισπωμένης
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {availableVoiceName && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-900/40 text-[11px] font-serif text-amber-300/90">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="truncate max-w-[140px]" title={availableVoiceName}>
                  {availableVoiceName}
                </span>
              </div>
            )}

            {/* Speed Control */}
            <div className="flex items-center bg-[#130f0b] p-0.5 rounded-lg border border-amber-800/40">
              <span className="text-[10px] font-serif text-amber-400/80 px-2 select-none">
                Ρυθμός:
              </span>
              <button
                type="button"
                onClick={() => handleChangeRate(0.80)}
                className={`px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  speechRate === 0.80
                    ? "bg-amber-600 text-black font-bold"
                    : "text-amber-300 hover:text-amber-100"
                }`}
                title="Μυσταγωγικός / Αργός ρυθμός (0.80x)"
              >
                0.8x
              </button>
              <button
                type="button"
                onClick={() => handleChangeRate(0.90)}
                className={`px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  speechRate === 0.90
                    ? "bg-amber-600 text-black font-bold"
                    : "text-amber-300 hover:text-amber-100"
                }`}
                title="Κανονικός ρυθμός απαγγελίας (0.90x)"
              >
                0.9x
              </button>
              <button
                type="button"
                onClick={() => handleChangeRate(1.05)}
                className={`px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  speechRate === 1.05
                    ? "bg-amber-600 text-black font-bold"
                    : "text-amber-300 hover:text-amber-100"
                }`}
                title="Ταχύς ρυθμός απαγγελίας (1.05x)"
              >
                1.0x
              </button>
            </div>
          </div>
        </div>

        {/* Playback Controls and Active Line Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-800/40">
          <div className="flex items-center gap-2 flex-wrap">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handlePlayAllVerses}
                disabled={!speechSupported}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-600 text-white font-serif font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current text-amber-200" />
                <span>Έναρξη Απαγγελίας (Στίχοι 1-71)</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePauseResume}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-600/60 text-amber-200 font-serif font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 fill-current text-amber-400" />
                      <span>Συνέχιση</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 text-amber-400" />
                      <span>Παύση</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStopSpeech}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 font-serif font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                >
                  <Square className="w-4 h-4 fill-current text-red-400" />
                  <span>Διακοπή</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                if (filteredSections.length > 0) {
                  handleTogglePlaySection(filteredSections[0]);
                }
              }}
              disabled={!speechSupported || isPlaying}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#221a13] hover:bg-[#32251a] border border-amber-800/40 text-amber-300 font-serif text-xs cursor-pointer transition-colors disabled:opacity-50"
              title="Απαγγελία μόνο των ορατών ενοτήτων του τρέχοντος φίλτρου"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Απαγγελία Τρέχουσας Ενότητας</span>
              <span className="sm:hidden">Τρέχουσα Ενότητα</span>
            </button>
          </div>

          {/* Real-time speech status indicator */}
          {isPlaying && playingLineNumber !== null && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/40 text-xs font-serif text-amber-200 animate-in fade-in duration-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-bold text-amber-400 font-mono">
                Στίχος {playingLineNumber} / 71
              </span>
              <span className="text-amber-300/80 hidden md:inline">
                • {isPaused ? "Σε παύση" : "Απαγγελία σε εξέλιξη"}
              </span>
            </div>
          )}

          {!speechSupported && (
            <div className="text-xs text-amber-400/70 font-serif italic">
              ⚠️ Το Web Speech API δεν υποστηρίζεται ή είναι απενεργοποιημένο σε αυτόν τον περιηγητή.
            </div>
          )}
        </div>
      </div>

      {/* Main Dual-Column Verses List */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-[#14110d] border border-amber-900/30 text-amber-300/70 font-serif">
            Δεν βρέθηκαν στίχοι που να ταιριάζουν με την αναζήτηση «{searchQuery}».
          </div>
        ) : (
          filteredSections.map((sec) => {
            const isEthical = sec.level === "ethical";

            return (
              <div
                key={sec.id}
                className="rounded-2xl bg-[#14110d] border border-amber-900/50 overflow-hidden shadow-xl hover:border-amber-700/60 transition-colors"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#1e1710] border-b border-amber-900/50">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-serif font-bold tracking-wide ${
                        isEthical
                          ? "bg-amber-950 text-amber-300 border border-amber-700/50"
                          : "bg-indigo-950 text-indigo-300 border border-indigo-700/50"
                      }`}
                    >
                      {sec.levelName}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded border border-amber-900/40">
                      Στίχοι {sec.range}
                    </span>
                    <h2 className="text-xs sm:text-sm font-serif font-bold text-amber-100">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Audio Recitation Button for this section */}
                    <button
                      type="button"
                      onClick={() => handleTogglePlaySection(sec)}
                      disabled={!speechSupported}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-serif ${
                        playingSectionId === sec.id && isPlaying
                          ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30 ring-2 ring-amber-400"
                          : "bg-[#2a1f14] hover:bg-[#382b1c] text-amber-300 hover:text-amber-100 border border-amber-800/40"
                      }`}
                      title={
                        playingSectionId === sec.id && isPlaying
                          ? `Διακοπή απαγγελίας στίχων ${sec.range}`
                          : `Απαγγελία στίχων ${sec.range} (Web Speech API)`
                      }
                    >
                      {playingSectionId === sec.id && isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current animate-pulse text-black" />
                          <span className="font-bold">Διακοπή</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden sm:inline">Απαγγελία</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySection(sec)}
                      className="p-1.5 rounded-lg bg-[#2a1f14] hover:bg-[#382b1c] text-amber-300 hover:text-amber-100 transition-colors cursor-pointer"
                      title="Αντιγραφή στίχων και απόδοσης"
                    >
                      {copiedId === sec.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExportSectionId(sec.id);
                        setIsExportModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#2a1f14] hover:bg-[#382b1c] text-amber-300 hover:text-amber-100 transition-colors cursor-pointer border border-amber-900/40"
                      title={`Εξαγωγή στίχων ${sec.range} σε PDF ή Εικόνα`}
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    {onNavigateToCalculator && (
                      <button
                        type="button"
                        onClick={() => onNavigateToCalculator(sec.ancientLines.join(" "))}
                        className="p-1.5 rounded-lg bg-[#2a1f14] hover:bg-[#382b1c] text-amber-300 hover:text-amber-100 transition-colors cursor-pointer"
                        title="Υπολογισμός ενότητας στον Υπολογιστή"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body: Side-by-Side or Interleaved */}
                {layoutMode === "side-by-side" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-amber-900/40">
                    {/* LEFT COLUMN: Ancient Greek */}
                    <div className="p-4 sm:p-6 bg-[#120f0c]/60 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-amber-900/30">
                        <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300">
                          <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                          <span>ΑΡΧΑΙΟΝ ΚΕΙΜΕΝΟ (ΠΥΘΑΓΟΡΑΣ)</span>
                        </div>
                        <span className="text-[10px] text-amber-400/60 font-serif">
                          Κάντε κλικ σε λέξη για ανάλυση
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm sm:text-base font-serif leading-relaxed text-amber-100">
                        {sec.ancientLines.map((line, idx) => {
                          const currentLineNum = sec.startLine + idx;
                          const words = line.split(" ");
                          const isLineReciting = playingLineNumber === currentLineNum;

                          return (
                            <div
                              key={idx}
                              id={`verse-line-${currentLineNum}`}
                              className={`flex items-start gap-2.5 p-1.5 rounded-lg transition-all ${
                                isLineReciting
                                  ? "bg-amber-500/20 border-l-4 border-amber-400 pl-2 text-amber-50 shadow-inner font-medium ring-1 ring-amber-500/40"
                                  : activeLineNumber === currentLineNum
                                  ? "bg-amber-950/40 text-amber-50"
                                  : "hover:bg-amber-950/20"
                              }`}
                              onMouseEnter={() => setActiveLineNumber(currentLineNum)}
                              onMouseLeave={() => setActiveLineNumber(null)}
                            >
                              <div className="flex items-center gap-1 shrink-0 select-none pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handlePlaySingleVerse(currentLineNum, line, sec.id)}
                                  disabled={!speechSupported}
                                  className={`p-1 rounded cursor-pointer transition-colors ${
                                    isLineReciting
                                      ? "text-amber-300 bg-amber-900/80 ring-1 ring-amber-400"
                                      : "text-amber-500/40 hover:text-amber-300 hover:bg-amber-900/30"
                                  }`}
                                  title={
                                    isLineReciting
                                      ? "Διακοπή απαγγελίας στίχου"
                                      : `Απαγγελία στίχου ${currentLineNum} (Web Speech API)`
                                  }
                                >
                                  {isLineReciting ? (
                                    <Square className="w-3 h-3 fill-current animate-pulse text-amber-400" />
                                  ) : (
                                    <Volume2 className="w-3 h-3" />
                                  )}
                                </button>
                                <span className="w-5 text-right text-[11px] font-mono text-amber-500/60">
                                  {currentLineNum}
                                </span>
                              </div>
                              <div className="flex-1 flex flex-wrap gap-x-1.5 gap-y-0.5">
                                {words.map((w, wIdx) => (
                                  <button
                                    key={wIdx}
                                    type="button"
                                    onClick={() => handleWordClick(w)}
                                    className="cursor-pointer hover:text-amber-300 hover:underline decoration-amber-500/50 underline-offset-2 transition-colors inline text-left"
                                    title={`Κάντε κλικ για υπολογισμό λεξαρίθμου: ${w}`}
                                  >
                                    {w}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Key Terms in this section */}
                      {sec.keyTerms && sec.keyTerms.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-amber-900/30 flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-amber-400/80 font-serif font-bold">
                            ΙΣΟΨΗΦΙΕΣ:
                          </span>
                          {sec.keyTerms.map((kt, kIdx) => (
                            <button
                              key={kIdx}
                              type="button"
                              onClick={() => handleWordClick(kt.word)}
                              className="px-2 py-0.5 rounded bg-black/40 hover:bg-[#2b1f15] border border-amber-800/40 text-[11px] font-serif text-amber-200 cursor-pointer transition-colors flex items-center gap-1"
                              title={kt.explanation}
                            >
                              <span className="font-bold">{kt.word}</span>
                              <span className="text-amber-400 font-mono font-bold">
                                ={kt.value}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN: Modern Greek Translation */}
                    <div className="p-4 sm:p-6 bg-[#16120e]/60 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-amber-900/30">
                        <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>ΝΕΟΕΛΛΗΝΙΚΗ ΑΠΟΔΟΣΗ</span>
                        </div>
                        <span className="text-[10px] text-amber-400/60 font-serif">
                          Συμβαδίζει στίχο-στίχο
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs sm:text-[14px] font-serif leading-relaxed text-amber-200/90">
                        {sec.modernLines.map((mLine, idx) => {
                          const currentLineNum = sec.startLine + idx;

                          return (
                            <div
                              key={idx}
                              className={`flex items-start gap-3 p-1 rounded transition-colors ${
                                activeLineNumber === currentLineNum
                                  ? "bg-amber-950/40 text-amber-50"
                                  : "hover:bg-amber-950/20"
                              }`}
                              onMouseEnter={() => setActiveLineNumber(currentLineNum)}
                              onMouseLeave={() => setActiveLineNumber(null)}
                            >
                              <span className="shrink-0 w-6 text-right text-[11px] font-mono text-amber-500/50 select-none pt-0.5">
                                {currentLineNum}
                              </span>
                              <p className="flex-1 text-justify">{mLine}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Section Notes if present */}
                      {sec.notes && sec.notes.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-amber-900/30 space-y-1">
                          {sec.notes.map((note, nIdx) => (
                            <div
                              key={nIdx}
                              className="text-[11px] text-amber-300/80 font-serif italic bg-amber-950/20 p-2 rounded border border-amber-900/30"
                            >
                              {note}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* INTERLEAVED MODE */
                  <div className="p-4 sm:p-6 space-y-4">
                    {sec.ancientLines.map((line, idx) => {
                      const currentLineNum = sec.startLine + idx;
                      const modernLine = sec.modernLines[idx];
                      const isLineReciting = playingLineNumber === currentLineNum;

                      return (
                        <div
                          key={idx}
                          id={`verse-line-interleaved-${currentLineNum}`}
                          className={`p-3 rounded-xl border transition-all ${
                            isLineReciting
                              ? "bg-amber-950/50 border-amber-500/80 shadow-lg ring-1 ring-amber-500/50"
                              : "bg-[#0f0d0a] border-amber-900/30"
                          } space-y-1.5`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="flex items-center gap-1 shrink-0 pt-0.5 select-none">
                              <button
                                type="button"
                                onClick={() => handlePlaySingleVerse(currentLineNum, line, sec.id)}
                                disabled={!speechSupported}
                                className={`p-1 rounded cursor-pointer transition-colors ${
                                  isLineReciting
                                    ? "text-amber-300 bg-amber-900/80 ring-1 ring-amber-400"
                                    : "text-amber-500/50 hover:text-amber-300 hover:bg-amber-900/30"
                                }`}
                                title={
                                  isLineReciting
                                    ? "Διακοπή απαγγελίας στίχου"
                                    : `Απαγγελία στίχου ${currentLineNum} (Web Speech API)`
                                }
                              >
                                {isLineReciting ? (
                                  <Square className="w-3 h-3 fill-current animate-pulse text-amber-400" />
                                ) : (
                                  <Volume2 className="w-3 h-3" />
                                )}
                              </button>
                              <span className="px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 font-mono text-[10px] font-bold">
                                {currentLineNum}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base font-serif font-medium text-amber-100 leading-relaxed">
                              {line}
                            </p>
                          </div>
                          {modernLine && (
                            <div className="pl-12 text-xs sm:text-[13px] font-serif text-amber-200/80 italic leading-relaxed">
                              {modernLine}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footnotes and Glossary Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#18130e] to-[#0f0c09] border border-amber-800/50 p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-amber-200">
                Αναλυτικό Επεξηγηματικό Πλαίσιο & Πυθαγόρεια Ορολογία
              </h3>
              <p className="text-xs text-amber-200/70 font-serif">
                Ερμηνεία των τριών θεμελιωδών μυσταγωγικών όρων του κειμένου
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-[11px] font-serif text-amber-300">
              Σχολιασμός Ιεροκλέους
            </span>
          </div>
        </div>

        {/* 3 Main Footnotes with Word-by-Word Analysis & Free Translation */}
        <div className="space-y-6">
          {FOOTNOTES.map((fn, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-amber-900/50 space-y-4 shadow-xl hover:border-amber-700/60 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-sm border border-amber-500/40">
                    {fn.mark}
                  </span>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-amber-100">
                    {fn.term}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#271d15] text-amber-300/80 border border-amber-700/40 font-serif">
                    {fn.contextVerse}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-serif font-semibold text-amber-400">
                  {fn.subtitle}
                </div>
              </div>

              {/* Section 1: Word-by-Word Analysis */}
              <div className="space-y-2 bg-[#120f0c] p-3.5 sm:p-4 rounded-xl border border-amber-900/30">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
                  <span>📖</span>
                  <span>Επεξήγηση λέξη προς λέξη στα νέα ελληνικά:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {fn.wordByWord.map((wbw, wIdx) => (
                    <div
                      key={wIdx}
                      className="p-2.5 rounded-lg bg-black/30 border border-amber-900/30 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-serif font-bold text-amber-200 text-sm">
                          {wbw.ancient}
                        </span>
                        <span className="text-[10px] text-amber-400/70 font-serif bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">
                          {wbw.grammar}
                        </span>
                      </div>
                      <p className="text-xs font-serif text-amber-100/90 leading-relaxed">
                        {wbw.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Free Translation */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-700/40 space-y-1">
                <div className="text-[11px] font-serif font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                  <span>📜</span>
                  <span>Ελεύθερη απόδοση:</span>
                </div>
                <p className="text-xs sm:text-sm font-serif font-semibold text-amber-100 italic leading-relaxed pl-2 border-l-2 border-amber-500">
                  {fn.freeTranslation}
                </p>
              </div>

              {/* Section 3: Philosophical Interpretation */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-serif font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🏛️</span>
                  <span>Φιλοσοφική & Μυσταγωγική Ερμηνεία:</span>
                </div>
                <p className="text-xs sm:text-[13px] font-serif text-amber-200/90 leading-relaxed text-justify">
                  {fn.philosophicalMeaning}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Philosophical Synthesis: Hierocles & Incorruptible Gold */}
        <div className="p-5 rounded-xl bg-[#110e0a] border border-amber-800/40 text-xs sm:text-[13px] font-serif text-amber-200/90 leading-relaxed space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <span>🏛️</span>
            <span>Η Φιλοσοφική Παρακαταθήκη του Πυθαγόρα & ο Συμβολισμός του Χρυσού</span>
          </div>
          <div className="space-y-2 text-justify text-amber-200/80">
            <p>
              Ο νεοπλατωνικός φιλόσοφος <strong>Ιεροκλής ο Αλεξανδρεύς</strong> (5ος αι. μ.Χ.) στο περίφημο υπόμνημά του αποκαλύπτει γιατί τα αποφθέγματα αυτά παραδόθηκαν ως <strong>«Χρυσά»</strong>: Όπως ο καθαρός χρυσός είναι το μοναδικό μέταλλο της φύσης που παραμένει αμόλυντο, δεν οξειδώνεται, δεν σκουριάζει από τα γήινα στοιχεία και αναδεικνύει την απόλυτη λάμψη του μέσα στο πυρ, έτσι και η διδασκαλία του Πυθαγόρα αποτελεί την αμόλυντη και άφθαρτη αλήθεια που καθαρίζει την ψυχή από τις προσμίξεις της φθοράς.
            </p>
            <p>
              Η εσωτερική διαδρομή του μυουμένου ξεκινά από την ακλόνητη αυτοκυριαρχία (στόμαχος, ύπνος, λαγνεία, θυμός), προχωρά στον υπέρτατο αυτοσεβασμό (<em>«πάντων δὲ μάλιστ' αἰσχύνεο σαυτόν»</em>), εδραιώνεται στον τριπλό νυχτερινό έλεγχο συνείδησης (<em>«πῆ παρέβην; τί δ' ἔρεξα; τί μοι δέον οὐκ ἐτελέσθη;»</em>), κορυφώνεται στον ιερό όρκο στην <strong>Τετρακτύν (1251)</strong> και καταλήγει στην ανάληψη του συνειδητού όντος στον ελεύθερο αιθέρα: <strong className="text-amber-200">«ἔσσεαι ἀθάνατος, θεός ἄμβροτος, οὐκέτι θνητός»</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Side-Panel Trigger Button */}
      <div className="fixed right-3 sm:right-5 bottom-28 md:bottom-16 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsSidePanelOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-serif font-bold shadow-2xl border border-amber-400/50 cursor-pointer transition-all hover:scale-105 active:scale-95 group"
          title="Άνοιγμα Πυθαγόρειου Πλαισίου (Ομακοείον, Σιωπή & «Αὐτὸς ἔφα»)"
        >
          <BookOpen className="w-4 h-4 text-amber-200 group-hover:rotate-6 transition-transform" />
          <span className="hidden sm:inline">🏛️ Πυθαγόρειο Πλαίσιο</span>
          <span className="sm:hidden">🏛️ Πλαίσιο</span>
        </button>
      </div>

      {/* Persistent Sticky Footer with Pythagorean Context */}
      {showStickyFooter && (
        <aside aria-label="Πυθαγόρειο Πλαίσιο" className="fixed bottom-[52px] md:bottom-0 left-0 right-0 z-30 bg-[#140f0a]/95 backdrop-blur-md border-t border-amber-800/60 py-2.5 px-3 sm:px-6 shadow-2xl transition-transform duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Quick context pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] sm:text-xs font-serif text-amber-200/90 justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => setIsSidePanelOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 hover:bg-amber-900/60 font-bold cursor-pointer transition-colors"
                title="Προβολή λεπτομερειών για το Ομακοείον"
              >
                <span>🏛️</span>
                <span>Ομακοείον</span>
                <span className="text-amber-400/60 font-normal hidden md:inline">(Κρότων)</span>
              </button>
              <span className="hidden md:inline text-amber-700">•</span>
              <button
                type="button"
                onClick={() => setIsSidePanelOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 hover:bg-amber-900/60 font-bold cursor-pointer transition-colors"
                title="Προβολή λεπτομερειών για τον Όρκο Σιωπής"
              >
                <span>🤫</span>
                <span>5ετής Σιωπή</span>
                <span className="text-amber-400/60 font-normal hidden md:inline">(Εχεμύθεια)</span>
              </button>
              <span className="hidden md:inline text-amber-700">•</span>
              <button
                type="button"
                onClick={() => setIsSidePanelOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 hover:bg-amber-900/60 font-bold cursor-pointer transition-colors"
                title="Προβολή λεπτομερειών για το «Αὐτὸς ἔφα»"
              >
                <span>📜</span>
                <span>«Αὐτὸς ἔφα»</span>
                <span className="text-amber-400/60 font-normal hidden md:inline">(Ιερός Λόγος)</span>
              </button>
            </div>

            {/* If playing audio: Audio Mini Player in sticky footer */}
            {isPlaying && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 shadow text-xs font-serif text-amber-100">
                <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="font-bold text-amber-300 font-mono">
                  Στίχος {playingLineNumber || 1} / 71
                </span>
                <button
                  type="button"
                  onClick={handlePauseResume}
                  className="p-1 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-200 cursor-pointer"
                  title={isPaused ? "Συνέχιση" : "Παύση"}
                >
                  {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={handleStopSpeech}
                  className="p-1 rounded bg-red-950/80 hover:bg-red-900 text-red-200 cursor-pointer"
                  title="Διακοπή"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedExportSectionId(null);
                  setIsExportModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-yellow-800 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-xs font-serif shadow transition-all cursor-pointer hover:scale-105 active:scale-95 border border-amber-500/40"
                title="Εξαγωγή του τρέχοντος πλαισίου σε PDF ή εικόνα"
              >
                <FileText className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden sm:inline">Εξαγωγή Μελέτης (PDF/Εικόνα)</span>
                <span className="sm:hidden">Εξαγωγή</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSidePanelOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs font-serif shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                <span>Ανάγνωση Πλαισίου & Μύησης</span>
              </button>
              <button
                type="button"
                onClick={() => setShowStickyFooter(false)}
                className="p-1.5 rounded-lg bg-[#241a12] hover:bg-[#35251a] text-amber-400/80 hover:text-amber-200 border border-amber-900/40 text-xs cursor-pointer transition-colors"
                title="Απόκρυψη υποσέλιδου"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Small reopen trigger if sticky footer is closed */}
      {!showStickyFooter && (
        <div className="fixed bottom-16 md:bottom-3 left-3 z-30">
          <button
            type="button"
            onClick={() => setShowStickyFooter(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18120c]/90 border border-amber-700/50 text-amber-300 text-xs font-serif shadow-lg hover:bg-amber-950 transition-colors cursor-pointer"
            title="Επανεμφάνιση υποσέλιδου πλαισίου"
          >
            <span>🏛️ Πλαίσιο</span>
          </button>
        </div>
      )}

      {/* Side-Panel Backdrop */}
      {isSidePanelOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 transition-opacity duration-300"
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}

      {/* Slide-in Side-Panel (Drawer) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-gradient-to-b from-[#18120c] via-[#130e09] to-[#0a0805] border-l border-amber-700/50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidePanelOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-900/40 bg-black/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-100">
                Η Πυθαγόρεια Μύηση & ο Τρόπος Ζωής
              </h3>
              <p className="text-[11px] text-amber-400/80 font-serif">
                Ιστορικό, Φιλοσοφικό & Μυσταγωγικό Πλαίσιο
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSidePanelOpen(false)}
            className="p-2 rounded-xl bg-[#231b14] hover:bg-[#34271c] text-amber-300 hover:text-amber-100 border border-amber-800/40 cursor-pointer transition-colors"
            title="Κλείσιμο πλαισίου"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-amber-200/90 font-serif">
          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-900/40 space-y-1">
              <div className="text-amber-300 font-bold">ΟΜΑΚΟΕΙΟΝ</div>
              <div className="text-amber-400/70 text-[10px]">Κοινόβια Αδελφότης</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-900/40 space-y-1">
              <div className="text-amber-300 font-bold">ΕΧΕΜΥΘΙΑ</div>
              <div className="text-amber-400/70 text-[10px]">5ετής Σιωπή</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-900/40 space-y-1">
              <div className="text-amber-300 font-bold">«ΑΥΤΟΣ ΕΦΑ»</div>
              <div className="text-amber-400/70 text-[10px]">Ιερός Λόγος</div>
            </div>
          </div>

          {/* Section 1: Το Ομακοείον στον Κρότωνα */}
          <div className="p-4 rounded-xl bg-black/30 border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2 border-b border-amber-900/30 pb-1.5">
              <span>🏛️</span>
              <span>1. Το Ομακοείον στον Κρότωνα & η Ιερά Κοινόβια Αδελφότης</span>
            </h4>
            <p className="text-xs sm:text-[13px] leading-relaxed text-justify text-amber-200/80">
              {PYTHAGORAS_INTRODUCTION.sections[0]?.text}
            </p>
          </div>

          {/* Section 2: Ο Όρκος Σιωπής */}
          <div className="p-4 rounded-xl bg-black/30 border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2 border-b border-amber-900/30 pb-1.5">
              <span>🤫</span>
              <span>2. Ο Όρκος Σιωπής (Εχεμύθεια) & η Κάθαρσις του Νου</span>
            </h4>
            <p className="text-xs sm:text-[13px] leading-relaxed text-justify text-amber-200/80">
              {PYTHAGORAS_INTRODUCTION.sections[1]?.text}
            </p>
          </div>

          {/* Section 3: Το «Αὐτὸς ἔφα» */}
          <div className="p-4 rounded-xl bg-black/30 border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2 border-b border-amber-900/30 pb-1.5">
              <span>📜</span>
              <span>3. Το «Αὐτὸς ἔφα» (Ipse Dixit) & η Θεόπνευστη Αυθεντία</span>
            </h4>
            <p className="text-xs sm:text-[13px] leading-relaxed text-justify text-amber-200/80">
              {PYTHAGORAS_INTRODUCTION.sections[2]?.text}
            </p>
          </div>

          {/* Section 4: Ο Σχολιασμός του Ιεροκλέους */}
          <div className="p-4 rounded-xl bg-black/30 border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2 border-b border-amber-900/30 pb-1.5">
              <span>✨</span>
              <span>4. Ο Σχολιασμός του Νεοπλατωνικού Ιεροκλέους</span>
            </h4>
            <p className="text-xs sm:text-[13px] leading-relaxed text-justify text-amber-200/80">
              {PYTHAGORAS_INTRODUCTION.sections[3]?.text}
            </p>
          </div>

          {/* Section 5: Ο Συμβολισμός του Χρυσού */}
          <div className="p-4 rounded-xl bg-black/30 border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2 border-b border-amber-900/30 pb-1.5">
              <span>🌟</span>
              <span>5. Ο Συμβολισμός του Αμόλυντου Χρυσού</span>
            </h4>
            <p className="text-xs sm:text-[13px] leading-relaxed text-justify text-amber-200/80">
              {PYTHAGORAS_INTRODUCTION.sections[4]?.text}
            </p>
          </div>

          {/* Section 6: Η Διμερής Δομή */}
          <div className="p-4 rounded-xl bg-black/30 border border-amber-900/30 space-y-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2 border-b border-amber-900/30 pb-1.5">
              <span>⚖️</span>
              <span>6. Η Διμερής Δομή των 71 Στίχων</span>
            </h4>
            <p className="text-xs sm:text-[13px] leading-relaxed text-justify text-amber-200/80">
              {PYTHAGORAS_INTRODUCTION.sections[5]?.text}
            </p>
          </div>

          {/* Quick Key Reference for the 3 Mystical Footnotes */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2.5">
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-2">
              <span>🔑</span>
              <span>Τα 3 Μυσταγωγικά Κλειδιά</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-black/30 border border-amber-900/30">
                <span className="font-bold text-amber-200">(*) «καταχθονίους δαίμονες» (Στ. 3): </span>
                <span className="text-amber-200/80">Υποχθόνιοι θεοί & κοιμηθέντες διδάσκαλοι της σχολής.</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-amber-900/30">
                <span className="font-bold text-amber-200">(**) «δαιμονίαισι τύχαις» (Στ. 17): </span>
                <span className="text-amber-200/80">Θεϊκή ειμαρμένη & κοσμική νομοτέλεια προς εξαγνισμό.</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-amber-900/30">
                <span className="font-bold text-amber-200">(***) «οἵωι τῶι δαίμονι χρῶνται» (Στ. 62): </span>
                <span className="text-amber-200/80">Ο δαήμων (γνωρίζων), ο ανώτερος εσωτερικός καθοδηγητής.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-900/40 bg-black/40 flex items-center justify-between">
          <span className="text-xs text-amber-400/70 font-serif">
            Πυθαγόρεια Παρακαταθήκη
          </span>
          <button
            type="button"
            onClick={() => setIsSidePanelOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-serif font-bold text-xs shadow transition-colors cursor-pointer"
          >
            Συνέχιση Ανάγνωσης Στίχων
          </button>
        </div>
      </div>

      {/* Export Study Modal (PDF & Image Export) */}
      <GoldenVersesExportModal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setSelectedExportSectionId(null);
        }}
        currentSections={filteredSections}
        initialLevelFilter={activeFilter === "intro" ? "all" : activeFilter}
        activeSectionId={selectedExportSectionId}
      />
    </div>
  );
};
