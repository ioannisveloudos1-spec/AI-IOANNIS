import React, { useState } from "react";
import {
  Globe,
  Search,
  Sparkles,
  BookmarkPlus,
  Check,
  ExternalLink,
  BookOpen,
  Layers,
  ArrowRight,
  Filter,
  RefreshCw,
  Library,
  Flame,
  AlertCircle,
  FileText,
  Copy,
} from "lucide-react";
import {
  calculateIsopsephy,
  calculatePythmen,
  numberToGreekNumeral,
  getWordLettersBreakdown,
} from "../utils/isopsephy";
import { SavedIsopsephyItem } from "../types";

interface OnlineFinderTabProps {
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

interface OnlineResultItem {
  text: string;
  meaning: string;
  source: string;
  calculatedSum: number;
  letters?: Array<{ char: string; value: number }>;
}

interface OnlineCombinationItem {
  expression: string;
  breakdown: string;
  meaning: string;
}

const PRESET_TARGETS = [
  { num: 1119, label: "ΙΩΑΝΝΗΣ", desc: "Ο Ευαγγελιστής & Θεολόγος (1119)" },
  { num: 666, label: "ΛΑΥΡΕΙΟΝ / Ο ΝΙΚΗΤΗΣ", desc: "Ηλιακός αριθμός & Σφραγίδα (666)" },
  { num: 888, label: "ΙΗΣΟΥΣ", desc: "Ο Λόγος / Σωτήρας (888)" },
  { num: 1332, label: "2 × 666 / ΑΠΟΛΛΩΝΟΣ", desc: "Διπλή Αρμονία (1332)" },
  { num: 1480, label: "ΧΡΙΣΤΟΣ", desc: "Ο Κεχρισμένος (1480)" },
  { num: 2368, label: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", desc: "888 + 1480 = 2368" },
  { num: 801, label: "ΠΕΡΙΣΤΕΡΑ", desc: "Α & Ω (1 + 800 = 801)" },
  { num: 1049, label: "ΠΑΡΑΚΛΗΤΟΣ", desc: "Το Πνεύμα της Αληθείας (1049)" },
];

const PRESET_URLS = [
  {
    name: "Βικιπαίδεια: Ισοψηφία",
    url: "https://el.wikipedia.org/wiki/%CE%99%CF%83%CE%BF%CF%88%CE%B7%CF%86%CE%AF%CE%B1",
    desc: "Ιστορικό άρθρο για την αρχαία ελληνική ισοψηφία",
  },
  {
    name: "Αποκάλυψη Ιωάννου (Κεφ. 13)",
    url: "https://el.wikisource.org/wiki/%CE%91%CF%80%CE%BF%CE%BA%CE%AC%CE%BB%CF%85%CF%88%CE%B9%CF%82_%CE%99%CF%89%CE%AC%CE%BD%CE%BD%CE%BF%CF%85#%CE%9A%CE%B5%CF%86%CE%AC%CE%BB%CE%B1%CE%B9%CE%BF%CE%BD_13",
    desc: "Το πρωτότυπο κείμενο της Αποκαλύψεως",
  },
  {
    name: "Πλάτωνος Τίμαιος (Περί Ψυχής του Κόσμου)",
    url: "https://el.wikisource.org/wiki/%CE%A4%CE%AF%CE%BC%CE%B1%CE%B9%CE%BF%CF%82",
    desc: "Πυθαγόρειες αρμονίες και κοσμικές αναλογίες",
  },
];

export const OnlineFinderTab: React.FC<OnlineFinderTabProps> = ({
  onSaveItem,
  onOpenAiModal,
}) => {
  const [activeMode, setActiveMode] = useState<"target" | "url">("target");

  // Mode 1: Target Number Search
  const [targetNumber, setTargetNumber] = useState<string>("1119");
  const [isSearchingTarget, setIsSearchingTarget] = useState(false);
  const [targetResults, setTargetResults] = useState<OnlineResultItem[]>([]);
  const [targetCombinations, setTargetCombinations] = useState<OnlineCombinationItem[]>([]);
  const [targetSearchError, setTargetSearchError] = useState<string | null>(null);
  const [targetSourceType, setTargetSourceType] = useState<string | null>(null);
  const [savedSuccessMap, setSavedSuccessMap] = useState<Record<string, boolean>>({});
  const [batchSaveStatus, setBatchSaveStatus] = useState<string | null>(null);

  // Mode 2: Web URL Reader
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [filterTargetFromUrl, setFilterTargetFromUrl] = useState<string>("1119");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlFetchError, setUrlFetchError] = useState<string | null>(null);
  const [extractedRawText, setExtractedRawText] = useState<string | null>(null);
  const [urlScannedMatches, setUrlScannedMatches] = useState<
    Array<{ text: string; value: number; count: number; meaning?: string }>
  >([]);

  // Function to search target number via AI and Web corpus
  const handleSearchTarget = async (numberToSearch?: string) => {
    const queryNum = numberToSearch || targetNumber;
    const num = parseInt(queryNum);
    if (isNaN(num) || num <= 0) {
      setTargetSearchError("Παρακαλώ εισάγετε έναν έγκυρο θετικό αριθμό.");
      return;
    }

    setIsSearchingTarget(true);
    setTargetSearchError(null);
    setTargetResults([]);
    setTargetCombinations([]);

    try {
      const customApiKey = localStorage.getItem("custom_gemini_api_key") || "";
      const res = await fetch("/api/online-isopsephy-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetNumber: num,
          customApiKey,
        }),
      });

      const data = await res.json();
      if (!data.success && data.error) {
        setTargetSearchError(data.error);
        return;
      }

      setTargetSourceType(data.source || "Διαδικτυακή Αναζήτηση");

      // Verify and enrich results with exact ionic calculation
      const enrichedResults: OnlineResultItem[] = (data.results || []).map(
        (item: any) => {
          const verifiedValue = calculateIsopsephy(item.text);
          return {
            text: item.text,
            meaning: item.meaning || "Ισόψηφο εύρημα",
            source: item.source || "Αρχαία Γραμματεία",
            calculatedSum: verifiedValue > 0 ? verifiedValue : num,
            letters: getWordLettersBreakdown(item.text).map((l) => ({
              char: l.char,
              value: l.value,
            })),
          };
        }
      );

      setTargetResults(enrichedResults);
      setTargetCombinations(data.relatedCombinations || []);
    } catch (err: any) {
      console.error(err);
      setTargetSearchError("Σφάλμα σύνδεσης με τον διακομιστή αναζήτησης.");
    } finally {
      setIsSearchingTarget(false);
    }
  };

  // Function to fetch and scan a URL
  const handleFetchAndScanUrl = async (urlToFetch?: string) => {
    const fetchUrl = urlToFetch || targetUrl;
    if (!fetchUrl || !fetchUrl.startsWith("http")) {
      setUrlFetchError("Παρακαλώ εισάγετε ένα έγκυρο URL που ξεκινά με http:// ή https://");
      return;
    }

    setIsFetchingUrl(true);
    setUrlFetchError(null);
    setExtractedRawText(null);
    setUrlScannedMatches([]);

    try {
      const res = await fetch("/api/fetch-web-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fetchUrl }),
      });

      const data = await res.json();
      if (!data.success) {
        setUrlFetchError(data.error || "Αδυναμία ανάγνωσης της ιστοσελίδας.");
        return;
      }

      const text = data.extractedText || "";
      setExtractedRawText(text);

      // Scan words in text
      const targetFilterNum = parseInt(filterTargetFromUrl);
      const words = text
        .replace(/[^\u0370-\u03FF\u1F00-\u1FFF\s]/g, " ")
        .split(/\s+/)
        .filter((w: string) => w.length >= 2);

      const wordFreqMap = new Map<string, { value: number; count: number }>();

      words.forEach((w: string) => {
        const upper = w.toUpperCase();
        const val = calculateIsopsephy(upper);
        if (val > 0) {
          if (!isNaN(targetFilterNum) && targetFilterNum > 0) {
            if (val === targetFilterNum) {
              const prev = wordFreqMap.get(upper);
              if (prev) {
                prev.count += 1;
              } else {
                wordFreqMap.set(upper, { value: val, count: 1 });
              }
            }
          } else {
            const prev = wordFreqMap.get(upper);
            if (prev) {
              prev.count += 1;
            } else {
              wordFreqMap.set(upper, { value: val, count: 1 });
            }
          }
        }
      });

      // Also scan 2-word and 3-word phrases if filtering by specific target
      if (!isNaN(targetFilterNum) && targetFilterNum > 0) {
        for (let i = 0; i < words.length - 1; i++) {
          const phrase2 = `${words[i]} ${words[i + 1]}`.toUpperCase();
          const val2 = calculateIsopsephy(phrase2);
          if (val2 === targetFilterNum) {
            const prev = wordFreqMap.get(phrase2);
            if (prev) prev.count += 1;
            else wordFreqMap.set(phrase2, { value: val2, count: 1 });
          }

          if (i < words.length - 2) {
            const phrase3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`.toUpperCase();
            const val3 = calculateIsopsephy(phrase3);
            if (val3 === targetFilterNum) {
              const prev = wordFreqMap.get(phrase3);
              if (prev) prev.count += 1;
              else wordFreqMap.set(phrase3, { value: val3, count: 1 });
            }
          }
        }
      }

      const matches = Array.from(wordFreqMap.entries())
        .map(([txt, info]) => ({
          text: txt,
          value: info.value,
          count: info.count,
        }))
        .sort((a, b) => b.count - a.count);

      setUrlScannedMatches(matches);
    } catch (err: any) {
      console.error(err);
      setUrlFetchError("Σφάλμα κατά την άντληση του κειμένου από την ιστοσελίδα.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // Helper to save an item to Archive
  const handleSaveIndividualItem = (
    text: string,
    value: number,
    source?: string,
    meaning?: string
  ) => {
    if (!onSaveItem) return;
    const cleanText = text.trim().toUpperCase();
    onSaveItem({
      text: cleanText,
      normalized: cleanText,
      value,
      root: calculatePythmen(value),
      greekNumeral: numberToGreekNumeral(value),
      isPhrase: cleanText.includes(" "),
      wordCount: cleanText.split(/\s+/).length,
      category: "ΔΙΑΔΙΚΤΥΟ & CORPUS",
      notes: `${meaning ? `${meaning} | ` : ""}Πηγή: ${source || "Διαδικτυακός Ανιχνευτής"}`,
    });

    setSavedSuccessMap((prev) => ({ ...prev, [cleanText]: true }));
    setTimeout(() => {
      setSavedSuccessMap((prev) => ({ ...prev, [cleanText]: false }));
    }, 2500);
  };

  // Batch save all results
  const handleBatchSaveAll = () => {
    if (!onSaveItem || targetResults.length === 0) return;
    let count = 0;
    targetResults.forEach((res) => {
      onSaveItem({
        text: res.text.trim().toUpperCase(),
        normalized: res.text.trim().toUpperCase(),
        value: res.calculatedSum,
        root: calculatePythmen(res.calculatedSum),
        greekNumeral: numberToGreekNumeral(res.calculatedSum),
        isPhrase: res.text.includes(" "),
        wordCount: res.text.split(/\s+/).length,
        category: "ΔΙΑΔΙΚΤΥΟ & CORPUS",
        notes: `${res.meaning} | Πηγή: ${res.source}`,
      });
      count++;
    });

    setBatchSaveStatus(`Αποθηκεύτηκαν επιτυχώς ${count} λέξεις στο Αρχείο!`);
    setTimeout(() => setBatchSaveStatus(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#1a1612] via-[#241c14] to-[#120f0c] border border-[#c89b3c]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c89b3c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c89b3c]/15 border border-[#c89b3c]/40 text-[#e6c670] text-xs font-serif tracking-wider uppercase">
              <Globe className="w-3.5 h-3.5" />
              <span>Online Έρευνα & Άντληση Λεξαρίθμων</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#f5ebd7] tracking-tight">
              Ανιχνευτής Διαδικτύου & Λεξικών
            </h2>
            <p className="text-sm text-[#d4c5b0] max-w-2xl leading-relaxed">
              Αναζητήστε λέξεις και φράσεις από όλη την αρχαία ελληνική, πλατωνική,
              βιβλική και φιλοσοφική γραμματεία που παράγουν έναν επιθυμητό λεξάριθμο (π.χ. <span className="text-[#e6c670] font-semibold">1119</span>), ή αντλήστε και σαρώστε οποιαδήποτε ιστοσελίδα.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex bg-[#120f0c] p-1.5 rounded-xl border border-[#c89b3c]/30 shrink-0">
            <button
              onClick={() => setActiveMode("target")}
              className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-serif font-semibold transition-all flex items-center gap-2 ${
                activeMode === "target"
                  ? "bg-[#c89b3c] text-[#120f0c] shadow-lg"
                  : "text-[#d4c5b0] hover:text-[#f5ebd7]"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Αντίστροφη Εύρεση Λεξαρίθμου</span>
            </button>
            <button
              onClick={() => setActiveMode("url")}
              className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-serif font-semibold transition-all flex items-center gap-2 ${
                activeMode === "url"
                  ? "bg-[#c89b3c] text-[#120f0c] shadow-lg"
                  : "text-[#d4c5b0] hover:text-[#f5ebd7]"
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Σάρωση Ιστοσελίδας / URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: Target Number Search */}
      {activeMode === "target" && (
        <div className="space-y-6">
          {/* Search Box Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#1a1612]/90 border border-[#c89b3c]/20 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-1 relative">
                <label className="block text-xs font-serif text-[#a89984] mb-2 uppercase tracking-wider">
                  Εισαγωγή Αριθμού-Στόχου (π.χ. 1119 για ΙΩΑΝΝΗΣ)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetNumber}
                    onChange={(e) => setTargetNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchTarget()}
                    placeholder="π.χ. 1119, 666, 888, 1332..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/40 text-[#f5ebd7] text-lg font-serif placeholder-[#5a4e40] focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] outline-none transition-all"
                  />
                  <Search className="w-5 h-5 text-[#c89b3c] absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-end gap-3">
                <button
                  onClick={() => handleSearchTarget()}
                  disabled={isSearchingTarget}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#e6c670] hover:from-[#d8ab4c] hover:to-[#f0d080] text-[#120f0c] font-serif font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-[#c89b3c]/20 transition-all disabled:opacity-50 cursor-pointer w-full md:w-auto"
                >
                  {isSearchingTarget ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Αναζήτηση στα Λεξικά...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Έρευνα & Άντληση Λέξεων</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preset Targets Pills */}
            <div className="space-y-2 pt-2 border-t border-[#c89b3c]/15">
              <span className="text-xs font-serif text-[#a89984] block">
                Δημοφιλείς Αρχαίοι & Ιερατικοί Λεξάριθμοι:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_TARGETS.map((item) => (
                  <button
                    key={item.num}
                    onClick={() => {
                      setTargetNumber(item.num.toString());
                      handleSearchTarget(item.num.toString());
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-serif transition-all flex items-center gap-2 ${
                      targetNumber === item.num.toString()
                        ? "bg-[#c89b3c]/20 border-[#c89b3c] text-[#e6c670]"
                        : "bg-[#120f0c] border-[#c89b3c]/25 text-[#d4c5b0] hover:border-[#c89b3c]/60"
                    }`}
                  >
                    <span className="font-bold text-[#e6c670]">{item.num}</span>
                    <span className="text-[#a89984]">({item.label})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {targetSearchError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{targetSearchError}</span>
              </div>
            )}
          </div>

          {/* Results Display */}
          {targetResults.length > 0 && (
            <div className="space-y-6">
              {/* Results Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1a1612] border border-[#c89b3c]/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#c89b3c]/20 border border-[#c89b3c]/40 flex items-center justify-center text-[#e6c670] font-bold font-serif">
                    {targetResults.length}
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#f5ebd7]">
                      Ευρήματα για τον Λεξάριθμο {targetNumber} ({numberToGreekNumeral(parseInt(targetNumber))})
                    </h3>
                    <p className="text-xs text-[#a89984]">
                      Πηγή: {targetSourceType} | Πυθμένας: {calculatePythmen(parseInt(targetNumber))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBatchSaveAll}
                    className="px-4 py-2 rounded-lg bg-[#281f15] hover:bg-[#382b1d] border border-[#c89b3c]/50 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-2 hover:border-[#c89b3c] transition-all cursor-pointer"
                  >
                    <BookmarkPlus className="w-4 h-4 text-[#c89b3c]" />
                    <span>Μαζική Αποθήκευση Όλων ({targetResults.length})</span>
                  </button>
                </div>
              </div>

              {batchSaveStatus && (
                <div className="p-3.5 rounded-xl bg-[#1e2a1b] border border-green-700/50 text-green-300 text-xs font-serif flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>{batchSaveStatus}</span>
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targetResults.map((item, idx) => {
                  const isSaved = savedSuccessMap[item.text.trim().toUpperCase()];
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-[#15120f] border border-[#c89b3c]/25 hover:border-[#c89b3c]/60 transition-all flex flex-col justify-between group space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xl md:text-2xl font-serif font-bold text-[#e6c670] tracking-wide">
                              {item.text}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-[#c89b3c]/15 text-[#e6c670] border border-[#c89b3c]/30 font-serif">
                                = {item.calculatedSum}
                              </span>
                              <span className="text-[11px] text-[#a89984] font-serif">
                                Πηγή: {item.source}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                handleSaveIndividualItem(
                                  item.text,
                                  item.calculatedSum,
                                  item.source,
                                  item.meaning
                                )
                              }
                              title="Αποθήκευση στο Αρχείο"
                              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                isSaved
                                  ? "bg-green-900/40 border-green-600 text-green-300"
                                  : "bg-[#1f1a14] border-[#c89b3c]/30 text-[#d4c5b0] hover:text-[#e6c670] hover:border-[#c89b3c]"
                              }`}
                            >
                              {isSaved ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <BookmarkPlus className="w-4 h-4" />
                              )}
                            </button>

                            {onOpenAiModal && (
                              <button
                                onClick={() =>
                                  onOpenAiModal(
                                    item.text,
                                    item.calculatedSum,
                                    [item.text]
                                  )
                                }
                                title="Ανάλυση με Τ.Ν. ΙΩΑΝΝΗΣ 1.0"
                                className="p-2 rounded-lg bg-[#1f1a14] border border-[#c89b3c]/30 text-[#d4c5b0] hover:text-[#e6c670] hover:border-[#c89b3c] transition-all cursor-pointer"
                              >
                                <Sparkles className="w-4 h-4 text-[#c89b3c]" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#d4c5b0] leading-relaxed">
                          {item.meaning}
                        </p>

                        {/* Letter breakdown pill */}
                        {item.letters && item.letters.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.letters.map((l, lIdx) => (
                              <span
                                key={lIdx}
                                className="px-1.5 py-0.5 rounded bg-[#100d0a] text-[10px] text-[#a89984] font-mono border border-[#33281c]"
                              >
                                {l.char}={l.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Related Combinations Section */}
              {targetCombinations.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#1a1612] border border-[#c89b3c]/20 space-y-4">
                  <div className="flex items-center gap-2 text-[#e6c670] font-serif font-bold text-sm">
                    <Flame className="w-4 h-4 text-[#c89b3c]" />
                    <span>Συσχετίσεις & Αριθμητικές Συζεύξεις ({targetNumber})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {targetCombinations.map((comb, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/20 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#f5ebd7]">
                          <span>{comb.expression}</span>
                          <span className="text-[#e6c670] font-mono">
                            {comb.breakdown}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#a89984]">
                          {comb.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Web URL Scanner */}
      {activeMode === "url" && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-[#1a1612]/90 border border-[#c89b3c]/20 shadow-xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-serif text-[#a89984] mb-2 uppercase tracking-wider">
                  Διεύθυνση Ιστοσελίδας / Άρθρου (URL)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://el.wikipedia.org/... ή https://..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-sans placeholder-[#5a4e40] focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] outline-none transition-all"
                  />
                  <Globe className="w-5 h-5 text-[#c89b3c] absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                <div className="flex-1">
                  <label className="block text-xs font-serif text-[#a89984] mb-2 uppercase tracking-wider">
                    Φίλτρο Ειδικού Λεξαρίθμου (Προαιρετικό, π.χ. 1119)
                  </label>
                  <input
                    type="number"
                    value={filterTargetFromUrl}
                    onChange={(e) => setFilterTargetFromUrl(e.target.value)}
                    placeholder="Αφήστε κενό για όλους τους λεξαρίθμους"
                    className="w-full px-4 py-3 rounded-xl bg-[#120f0c] border border-[#c89b3c]/30 text-[#f5ebd7] text-sm font-serif placeholder-[#5a4e40] focus:border-[#c89b3c] outline-none"
                  />
                </div>

                <button
                  onClick={() => handleFetchAndScanUrl()}
                  disabled={isFetchingUrl}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#e6c670] hover:from-[#d8ab4c] hover:to-[#f0d080] text-[#120f0c] font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isFetchingUrl ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Άντληση & Σάρωση Σελίδας...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Άντληση & Σάρωση Ισοψηφιών</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preset URLs */}
            <div className="space-y-2 pt-3 border-t border-[#c89b3c]/15">
              <span className="text-xs font-serif text-[#a89984] block">
                Προτεινόμενες Ιστοσελίδες & Αρχαίες Πηγές:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_URLS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTargetUrl(p.url);
                      handleFetchAndScanUrl(p.url);
                    }}
                    className="p-3 rounded-xl bg-[#120f0c] border border-[#c89b3c]/25 hover:border-[#c89b3c] text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-serif font-bold text-[#e6c670] group-hover:underline flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <ExternalLink className="w-3 h-3 text-[#c89b3c]" />
                    </div>
                    <div className="text-[11px] text-[#a89984] mt-1 line-clamp-1">
                      {p.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {urlFetchError && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{urlFetchError}</span>
              </div>
            )}
          </div>

          {/* URL Scanned Matches */}
          {urlScannedMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1a1612] border border-[#c89b3c]/20">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#f5ebd7]">
                    Βρέθηκαν {urlScannedMatches.length} Ισόψηφα Στοιχεία στην Ιστοσελίδα
                  </h3>
                  {filterTargetFromUrl && (
                    <p className="text-xs text-[#a89984]">
                      Φιλτραρισμένα με ακριβή λεξάριθμο: {filterTargetFromUrl}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!onSaveItem) return;
                    let count = 0;
                    urlScannedMatches.forEach((m) => {
                      onSaveItem({
                        text: m.text,
                        normalized: m.text,
                        value: m.value,
                        root: calculatePythmen(m.value),
                        greekNumeral: numberToGreekNumeral(m.value),
                        isPhrase: m.text.includes(" "),
                        wordCount: m.text.split(/\s+/).length,
                        category: "ΑΝΤΛΗΣΗ URL",
                        notes: `Αντλήθηκε από ${targetUrl} (Εμφανίσεις: ${m.count})`,
                      });
                      count++;
                    });
                    setBatchSaveStatus(`Αποθηκεύτηκαν ${count} στοιχεία από το URL!`);
                    setTimeout(() => setBatchSaveStatus(null), 3000);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#281f15] hover:bg-[#382b1d] border border-[#c89b3c]/50 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-2 hover:border-[#c89b3c] transition-all cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-[#c89b3c]" />
                  <span>Αποθήκευση Όλων των Ευρημάτων ({urlScannedMatches.length})</span>
                </button>
              </div>

              {batchSaveStatus && (
                <div className="p-3.5 rounded-xl bg-[#1e2a1b] border border-green-700/50 text-green-300 text-xs font-serif flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4" />
                  <span>{batchSaveStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {urlScannedMatches.map((item, idx) => {
                  const isSaved = savedSuccessMap[item.text];
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#15120f] border border-[#c89b3c]/20 hover:border-[#c89b3c]/50 transition-all flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-base font-serif font-bold text-[#e6c670]">
                          {item.text}
                        </div>
                        <div className="text-xs text-[#a89984] flex items-center gap-2 mt-0.5 font-mono">
                          <span>Αξία: {item.value}</span>
                          <span>•</span>
                          <span>{item.count}x εμφάνιση</span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleSaveIndividualItem(
                            item.text,
                            item.value,
                            targetUrl,
                            `Εμφανίσεις στο κείμενο: ${item.count}`
                          )
                        }
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          isSaved
                            ? "bg-green-900/40 border-green-600 text-green-300"
                            : "bg-[#1f1a14] border-[#c89b3c]/30 text-[#d4c5b0] hover:text-[#e6c670]"
                        }`}
                      >
                        {isSaved ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
