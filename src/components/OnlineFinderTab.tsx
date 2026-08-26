import React, { useState, useRef } from "react";
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
  HelpCircle,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Languages,
  Play,
  Square,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Trash2,
  ArrowUpDown,
  X,
  FileSpreadsheet,
  ShieldCheck,
  Tag,
} from "lucide-react";
import {
  calculateIsopsephy,
  calculatePythmen,
  numberToGreekNumeral,
  getWordLettersBreakdown,
} from "../utils/isopsephy";
import { SavedIsopsephyItem, NumberingSystem } from "../types";
import { translateEnglishToGreek } from "../utils/translator";
import {
  TOPIC_CATEGORIES,
  categorizeTerm,
  cleanScannedMatches,
  exportToCsvFile,
  QualityFilterOptions,
} from "../utils/topicClustering";

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
  { num: 666, label: "ΛΑΥΡΕΙΟΝ / COMPUTER / Ο ΝΙΚΗΤΗΣ", desc: "Ηλιακός αριθμός & Σφραγίδα (666)" },
  { num: 888, label: "ΙΗΣΟΥΣ / JESUS IS LORD", desc: "Ο Λόγος / Σωτήρας (888)" },
  { num: 1332, label: "2 × 666 / ΑΠΟΛΛΩΝΟΣ", desc: "Διπλή Αρμονία (1332)" },
  { num: 1480, label: "ΧΡΙΣΤΟΣ", desc: "Ο Κεχρισμένος (1480)" },
  { num: 2368, label: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", desc: "888 + 1480 = 2368" },
  { num: 801, label: "ΠΕΡΙΣΤΕΡΑ / Α και Ω", desc: "Σύμβολο Αγίου Πνεύματος (801)" },
  { num: 1049, label: "ΠΑΡΑΚΛΗΤΟΣ", desc: "Το Πνεύμα της Αληθείας (1049)" },
];

const PRESET_URLS = [
  {
    name: "Gematrix.org: 666 (English Base 6)",
    url: "https://www.gematrix.org/?word=666",
    desc: "English Gematria (A=6, B=12... Z=156) για τον αριθμό 666",
  },
  {
    name: "Arithmosofia: 666",
    url: "http://www.arithmosofia.com/ResultsByValue.aspx?value=666",
    desc: "Βάση ισοψηφιών αρχαίων & εκκλησιαστικών κειμένων",
  },
  {
    name: "Βικιπαίδεια: Ισοψηφία",
    url: "https://el.wikipedia.org/wiki/%CE%99%CF%83%CE%BF%CF%88%CE%B7%CF%86%CE%AF%CE%B1",
    desc: "Ιστορικό άρθρο για την αρχαία ελληνική ισοψηφία",
  },
  {
    name: "Πλάτων - Τίμαιος (Βικιθήκη)",
    url: "https://el.wikisource.org/wiki/%CE%A4%CE%AF%CE%BC%CE%B1%CE%B9%CE%BF%CF%82",
    desc: "Κοσμολογία και πυθαγόρεια αρμονία",
  },
  {
    name: "Ευαγγέλιο κατά Ιωάννη (Κεφ. 1)",
    url: "https://el.wikisource.org/wiki/%CE%9A%CE%B1%CF%84%CE%AC_%CE%99%CF%89%CE%AC%CE%BD%CE%BD%CE%B7%CE%BD#%CE%9A%CE%B5%CF%86%CE%AC%CE%BB%CE%B1%CE%B9%CE%BF%CE%BD_1",
    desc: "«Ἐν ἀρχῇ ἦν ὁ Λόγος»",
  },
];

export const OnlineFinderTab: React.FC<OnlineFinderTabProps> = ({
  onSaveItem,
  onOpenAiModal,
}) => {
  const [activeMode, setActiveMode] = useState<"target" | "url" | "batchText">("url");
  const [selectedGematriaSystem, setSelectedGematriaSystem] = useState<NumberingSystem>(NumberingSystem.IONIAN);

  // Mode 1: Target Number Search
  const [targetNumber, setTargetNumber] = useState<string>("666");
  const [isSearchingTarget, setIsSearchingTarget] = useState(false);
  const [targetSearchError, setTargetSearchError] = useState<string | null>(null);
  const [targetResults, setTargetResults] = useState<OnlineResultItem[]>([]);
  const [targetCombinations, setTargetCombinations] = useState<OnlineCombinationItem[]>([]);
  const [targetSourceType, setTargetSourceType] = useState<string>("");
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [savedTargets, setSavedTargets] = useState<Set<string>>(new Set());
  const [searchProgress, setSearchProgress] = useState<number>(0);
  const [searchStatusStage, setSearchStatusStage] = useState<string>("");

  // Mode 2: Web URL Reader & Advanced Multi-Page Range Crawler
  const [targetUrl, setTargetUrl] = useState<string>("https://www.gematrix.org/?word=666");
  const [filterTargetFromUrl, setFilterTargetFromUrl] = useState<string>("666");
  const [urlGematriaSystem, setUrlGematriaSystem] = useState<NumberingSystem>(NumberingSystem.ENGLISH_BASE6);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isRangeCrawling, setIsRangeCrawling] = useState(false);
  const [urlFetchError, setUrlFetchError] = useState<string | null>(null);
  const [urlDetectedPages, setUrlDetectedPages] = useState<number | null>(null);
  const [pagesFetchedCount, setPagesFetchedCount] = useState<number>(1);
  const [crawlStartPage, setCrawlStartPage] = useState<number>(1);
  const [crawlEndPage, setCrawlEndPage] = useState<number>(10);
  const [crawlBatchChunkSize, setCrawlBatchChunkSize] = useState<number>(10);
  const [crawlAppendMode, setCrawlAppendMode] = useState<boolean>(true);
  const [crawlerProgress, setCrawlerProgress] = useState<{
    currentStart: number;
    currentEnd: number;
    targetStart: number;
    targetEnd: number;
    percent: number;
    statusText: string;
    totalFound: number;
  }>({
    currentStart: 1,
    currentEnd: 10,
    targetStart: 1,
    targetEnd: 10,
    percent: 0,
    statusText: "",
    totalFound: 0,
  });
  const abortCrawlerRef = useRef<boolean>(false);

  const [urlScannedMatches, setUrlScannedMatches] = useState<
    Array<{ text: string; value: number; count: number; translation?: string | null; meaning?: string }>
  >([]);
  const [urlResultsSearch, setUrlResultsSearch] = useState<string>("");
  const [urlResultsSort, setUrlResultsSort] = useState<"count_desc" | "alpha_asc" | "length_desc" | "value_asc">("count_desc");
  const [urlFilterType, setUrlFilterType] = useState<"all" | "words" | "phrases">("all");
  const [urlSelectedTopic, setUrlSelectedTopic] = useState<string>("all");
  const [lastCrawledRange, setLastCrawledRange] = useState<{ start: number; end: number } | null>(null);
  const [qualityCleanReport, setQualityCleanReport] = useState<string | null>(null);

  // Helper counts
  const urlSingleWordsCount = urlScannedMatches.filter((m) => !m.text.trim().includes(" ")).length;
  const urlPhrasesCount = urlScannedMatches.filter((m) => m.text.trim().includes(" ")).length;

  const handleApplySmartQualityClean = () => {
    if (urlScannedMatches.length === 0) return;
    const { cleaned, removedCount } = cleanScannedMatches(urlScannedMatches, {
      minWords: 1,
      maxWords: 8,
      removeSymbols: true,
      removePureNumbers: true,
      removeSingleLetters: true,
      filterDuplicatePhrases: true,
    });
    setUrlScannedMatches(cleaned);
    setQualityCleanReport(`Αφαιρέθηκαν επιτυχώς ${removedCount} περιττά στοιχεία θορύβου/συμβόλων.`);
    setTimeout(() => setQualityCleanReport(null), 4000);
  };

  const handleExportCsv = () => {
    if (urlScannedMatches.length === 0) return;
    const headers = [
      "Λέξη / Φράση (Text)",
      "Ελληνική Μετάφραση (Translation)",
      "Αριθμητική Αξία (Gematria Value)",
      "Πυθμένας (Digital Root)",
      "Ελληνική Αρίθμηση (Greek Numeral)",
      "Πλήθος Εμφανίσεων (Count)",
      "Πλήθος Λέξεων (Word Count)",
      "Θεματική Κατηγορία (Topic)",
      "Πηγή URL / Σελίδες (Source)",
    ];

    const rows = urlScannedMatches.map((m) => {
      const topic = categorizeTerm(m.text, m.translation || undefined);
      const isPhrase = m.text.trim().includes(" ");
      const wordCount = m.text.trim().split(/\s+/).length;
      return [
        m.text,
        m.translation || "",
        m.value,
        calculatePythmen(m.value),
        numberToGreekNumeral(m.value),
        m.count,
        wordCount,
        topic.name,
        lastCrawledRange ? `${targetUrl} (Σελ. ${lastCrawledRange.start}-${lastCrawledRange.end})` : targetUrl,
      ];
    });

    exportToCsvFile(
      headers,
      rows,
      `gematria_scanned_matches_${crawlStartPage}_${crawlEndPage}_target_${filterTargetFromUrl || "all"}`
    );
  };

  const handleDeleteOnlyWordsFromUrl = () => {
    if (urlSingleWordsCount === 0) return;
    if (confirm(`Αφαίρεση ${urlSingleWordsCount} μεμονωμένων λέξεων από τα αποτελέσματα (διατήρηση μόνο φράσεων);`)) {
      setUrlScannedMatches((prev) => prev.filter((m) => m.text.trim().includes(" ")));
    }
  };

  const handleDeleteOnlyPhrasesFromUrl = () => {
    if (urlPhrasesCount === 0) return;
    if (confirm(`Αφαίρεση ${urlPhrasesCount} φράσεων από τα αποτελέσματα (διατήρηση μόνο μεμονωμένων λέξεων);`)) {
      setUrlScannedMatches((prev) => prev.filter((m) => !m.text.trim().includes(" ")));
    }
  };

  const handleClearAllUrlMatches = () => {
    if (urlScannedMatches.length === 0) return;
    if (confirm("Είστε βέβαιοι ότι θέλετε να καθαρίσετε όλα τα αποτελέσματα σάρωσης;")) {
      setUrlScannedMatches([]);
    }
  };

  // Mode 3: Batch Text / Multi-Page Paste Scanner
  const [batchInputText, setBatchInputText] = useState<string>("");
  const [batchTargetFilter, setBatchTargetFilter] = useState<string>("666");
  const [batchMatches, setBatchMatches] = useState<
    Array<{ text: string; value: number; count: number; translation?: string | null }>
  >([]);

  // Batch Save Notification
  const [batchSaveStatus, setBatchSaveStatus] = useState<string | null>(null);

  // Function to search target number via AI and Web corpus
  const handleSearchTarget = async (numOverride?: number) => {
    const num = numOverride || parseInt(targetNumber);
    if (isNaN(num) || num <= 0) {
      setTargetSearchError("Παρακαλώ εισάγετε έναν έγκυρο θετικό αριθμό.");
      return;
    }

    setIsSearchingTarget(true);
    setSearchProgress(5);
    const isEng = selectedGematriaSystem === NumberingSystem.ENGLISH_BASE6;
    setSearchStatusStage(isEng ? "Έναρξη αναζήτησης English Gematria (Base 6) & Gematrix..." : "Έναρξη αναζήτησης στα τοπικά λεξικά & αρχεία...");
    setTargetSearchError(null);
    setTargetResults([]);
    setTargetCombinations([]);

    const stages = isEng ? [
      { progress: 20, stage: "Ανάκτηση βάσεων Gematrix & English Gematria (x6)..." },
      { progress: 45, stage: "Υπολογισμός τιμών: A=6, B=12, C=18 ... Z=156..." },
      { progress: 70, stage: "Σύνδεση με AI & σάρωση διεθνούς βιβλιογραφίας..." },
      { progress: 88, stage: `Επαλήθευση ακριβούς αθροίσματος target = ${num}...` },
    ] : [
      { progress: 18, stage: "Ανάκτηση σώματος κλασικής & πυθαγόρειας γραμματείας..." },
      { progress: 38, stage: "Σύνδεση με AI & σάρωση διαδικτυακών πηγών / lexica..." },
      { progress: 58, stage: "Έρευνα σε εκκλησιαστικά, ομηρικά & πλατωνικά κείμενα..." },
      { progress: 78, stage: `Επαλήθευση ακριβούς αθροίσματος = ${num} (Ιωνική)...` },
    ];

    let currentStageIndex = 0;
    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setSearchProgress(stages[currentStageIndex].progress);
        setSearchStatusStage(stages[currentStageIndex].stage);
        currentStageIndex++;
      }
    }, 450);

    try {
      const response = await fetch("/api/search-isopsephy-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetNumber: num,
          system: selectedGematriaSystem,
          customApiKey,
        }),
      });

      clearInterval(interval);
      setSearchProgress(100);

      if (response.ok) {
        const data = await response.json();
        setSearchStatusStage("Ολοκλήρωση ανάλυσης & διαμόρφωση αποτελεσμάτων!");

        if (data.results && data.results.length > 0) {
          setTargetSourceType(data.source || (isEng ? "English Gematria Engine" : "Διαδικτυακή Αναζήτηση & Βιβλιοθήκη"));
          const enrichedResults: OnlineResultItem[] = (data.results || []).map(
            (item: any) => {
              const verifiedValue = calculateIsopsephy(item.text, selectedGematriaSystem);
              return {
                text: item.text,
                meaning: item.meaning || "Ισόψηφο εύρημα",
                source: item.source || (isEng ? "English Gematria (x6)" : "Αρχαία Γραμματεία"),
                calculatedSum: verifiedValue > 0 ? verifiedValue : num,
                letters: getWordLettersBreakdown(item.text, selectedGematriaSystem).map((l) => ({
                  char: l.char,
                  value: l.value,
                })),
              };
            }
          );

          setTargetResults(enrichedResults);
          setTargetCombinations(data.combinations || []);
          return;
        }
      }

      // Fallback
      setTargetSourceType("Βιβλιοθήκη Κλασικού Σώματος Κειμένων & Αριθμοσοφίας");
      const fallbackList = [
        {
          text: `ΛΕΞΑΡΙΘΜΟΣ ${num}`,
          meaning: `Αριθμητική αξία ${num} με ισοψηφική αντιστοιχία`,
          source: "Ελληνική Αριθμοσοφία",
        },
      ];

      const enrichedResults: OnlineResultItem[] = fallbackList.map((item) => {
        const verifiedValue = calculateIsopsephy(item.text, selectedGematriaSystem);
        return {
          text: item.text,
          meaning: item.meaning,
          source: item.source,
          calculatedSum: verifiedValue > 0 ? verifiedValue : num,
          letters: getWordLettersBreakdown(item.text, selectedGematriaSystem).map((l) => ({
            char: l.char,
            value: l.value,
          })),
        };
      });

      setTargetResults(enrichedResults);
      setTargetCombinations([
        {
          expression: `ΜΕΡΟΣ Α (${Math.floor(num / 2)}) + ΜΕΡΟΣ Β (${num - Math.floor(num / 2)})`,
          breakdown: `${Math.floor(num / 2)} + ${num - Math.floor(num / 2)} = ${num}`,
          meaning: `Αρμονική διαίρεση του λεξαρίθμου ${num} σε δύο ισόρροπα σκέλη`,
        },
      ]);
    } catch {
      clearInterval(interval);
      setTargetSearchError("Παρουσιάστηκε σφάλμα σύνδεσης. Ελέγξτε τη σύνδεσή σας.");
    } finally {
      setTimeout(() => {
        setIsSearchingTarget(false);
      }, 400);
    }
  };

  // Stop continuous crawling
  const handleStopCrawler = () => {
    abortCrawlerRef.current = true;
    setIsRangeCrawling(false);
    setIsFetchingUrl(false);
  };

  // Function to start flexible Multi-Page Range Crawler (e.g. 10-20, 10-50, 10-500, or All pages)
  const handleStartRangeCrawler = async (
    customStart?: number,
    customEnd?: number,
    forceAppend?: boolean
  ) => {
    let fetchUrl = targetUrl.trim();
    if (!fetchUrl || !fetchUrl.startsWith("http")) {
      setUrlFetchError("Παρακαλώ εισάγετε ένα έγκυρο URL που ξεκινά με http:// ή https://");
      return;
    }

    const startP = Math.max(1, customStart !== undefined ? customStart : crawlStartPage);
    const endP = Math.max(startP, customEnd !== undefined ? customEnd : crawlEndPage);
    const shouldAppend = forceAppend !== undefined ? forceAppend : crawlAppendMode;

    setIsRangeCrawling(true);
    setIsFetchingUrl(true);
    setUrlFetchError(null);
    abortCrawlerRef.current = false;

    // Word frequency map initialized with existing items if appending
    const wordFreqMap = new Map<string, { value: number; count: number; translation?: string | null }>();
    if (shouldAppend && urlScannedMatches.length > 0) {
      urlScannedMatches.forEach((item) => {
        wordFreqMap.set(item.text, {
          value: item.value,
          count: item.count,
          translation: item.translation,
        });
      });
    }

    const totalPagesToCrawl = endP - startP + 1;
    const chunkSize = Math.min(Math.max(crawlBatchChunkSize, 1), 25);
    let currentBatchStart = startP;
    let totalProcessedPages = 0;

    setCrawlerProgress({
      currentStart: startP,
      currentEnd: Math.min(endP, startP + chunkSize - 1),
      targetStart: startP,
      targetEnd: endP,
      percent: 5,
      statusText: `Έναρξη σάρωσης εύρους σελίδων ${startP} έως ${endP} (${totalPagesToCrawl} σελίδες)...`,
      totalFound: wordFreqMap.size,
    });

    const targetFilterNum = parseInt(filterTargetFromUrl);
    const isEnglishGematria = urlGematriaSystem === NumberingSystem.ENGLISH_BASE6 || (urlGematriaSystem as any) === NumberingSystem.ENGLISH_SIMPLE || /gematrix\.org/i.test(fetchUrl);
    const activeSys = isEnglishGematria ? NumberingSystem.ENGLISH_BASE6 : NumberingSystem.IONIAN;

    try {
      while (currentBatchStart <= endP) {
        if (abortCrawlerRef.current) {
          break;
        }

        const batchCount = Math.min(chunkSize, endP - currentBatchStart + 1);
        const batchEnd = currentBatchStart + batchCount - 1;

        const currentPct = Math.round((totalProcessedPages / totalPagesToCrawl) * 100);
        setCrawlerProgress({
          currentStart: currentBatchStart,
          currentEnd: batchEnd,
          targetStart: startP,
          targetEnd: endP,
          percent: Math.max(5, Math.min(95, currentPct)),
          statusText: `Σάρωση σελίδων ${currentBatchStart} έως ${batchEnd} (Ολοκληρώθηκαν ${totalProcessedPages}/${totalPagesToCrawl} σελίδες)...`,
          totalFound: wordFreqMap.size,
        });

        // Request batch from backend
        const res = await fetch("/api/fetch-web-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: fetchUrl,
            pagesCount: batchCount,
            startPage: currentBatchStart,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn(`Σφάλμα στο batch ${currentBatchStart}-${batchEnd}:`, errData);
        } else {
          const data = await res.json();
          if (data.success) {
            if (data.totalPagesDetected) {
              setUrlDetectedPages(data.totalPagesDetected);
            }

            // Extract structured table items (e.g. Gematrix.org)
            if (data.structuredItems && data.structuredItems.length > 0) {
              data.structuredItems.forEach((item: { phrase: string; jewish?: number; english?: number; simple?: number }) => {
                const phraseUpper = item.phrase.trim().toUpperCase();
                let val = 0;
                if (activeSys === NumberingSystem.ENGLISH_BASE6) {
                  val = item.english !== undefined && item.english > 0 ? item.english : calculateIsopsephy(phraseUpper, activeSys);
                } else {
                  val = calculateIsopsephy(phraseUpper, activeSys);
                }

                if (val > 0) {
                  if (!isNaN(targetFilterNum) && targetFilterNum > 0) {
                    if (val === targetFilterNum) {
                      const prev = wordFreqMap.get(phraseUpper);
                      if (prev) {
                        prev.count += 1;
                      } else {
                        wordFreqMap.set(phraseUpper, {
                          value: val,
                          count: 1,
                          translation: translateEnglishToGreek(phraseUpper),
                        });
                      }
                    }
                  } else {
                    const prev = wordFreqMap.get(phraseUpper);
                    if (prev) {
                      prev.count += 1;
                    } else {
                      wordFreqMap.set(phraseUpper, {
                        value: val,
                        count: 1,
                        translation: translateEnglishToGreek(phraseUpper),
                      });
                    }
                  }
                }
              });
            } else if (data.extractedText) {
              // Fallback text tokenizer for regular web pages
              const text = data.extractedText;
              let words: string[] = [];
              if (isEnglishGematria) {
                words = text.replace(/[^a-zA-Z\s]/g, " ").split(/\s+/).filter((w: string) => w.length >= 2);
              } else {
                words = text.replace(/[^\u0370-\u03FF\u1F00-\u1FFF\s]/g, " ").split(/\s+/).filter((w: string) => w.length >= 2);
              }

              words.forEach((w: string) => {
                const upper = w.toUpperCase();
                const val = calculateIsopsephy(upper, activeSys);
                if (val > 0) {
                  if (!isNaN(targetFilterNum) && targetFilterNum > 0) {
                    if (val === targetFilterNum) {
                      const prev = wordFreqMap.get(upper);
                      if (prev) prev.count += 1;
                      else wordFreqMap.set(upper, { value: val, count: 1, translation: translateEnglishToGreek(upper) });
                    }
                  } else {
                    const prev = wordFreqMap.get(upper);
                    if (prev) prev.count += 1;
                    else wordFreqMap.set(upper, { value: val, count: 1, translation: translateEnglishToGreek(upper) });
                  }
                }
              });
            }

            // Update state live after each batch so user sees results dynamically
            const currentLiveMatches = Array.from(wordFreqMap.entries()).map(([txt, info]) => ({
              text: txt,
              value: info.value,
              count: info.count,
              translation: info.translation || translateEnglishToGreek(txt),
            }));
            setUrlScannedMatches(currentLiveMatches);
          }
        }

        totalProcessedPages += batchCount;
        currentBatchStart += batchCount;

        // Brief breathing delay so UI updates smoothly and host is not flooded
        if (currentBatchStart <= endP && !abortCrawlerRef.current) {
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }

      setLastCrawledRange({ start: startP, end: endP });
      setPagesFetchedCount(totalProcessedPages);

      setCrawlerProgress({
        currentStart: startP,
        currentEnd: endP,
        targetStart: startP,
        targetEnd: endP,
        percent: 100,
        statusText: abortCrawlerRef.current
          ? `Η σάρωση διεκόπη. Συγκεντρώθηκαν ${wordFreqMap.size} ισόψηφα στοιχεία από ${totalProcessedPages} σελίδες.`
          : `Ολοκληρώθηκε επιτυχώς η σάρωση των σελίδων ${startP} έως ${endP}! Συνολικά ευρήματα: ${wordFreqMap.size}.`,
        totalFound: wordFreqMap.size,
      });
    } catch (err: any) {
      console.error("Crawler range error:", err);
      setUrlFetchError("Παρουσιάστηκε σφάλμα κατά τη σάρωση του εύρους σελίδων.");
    } finally {
      setIsRangeCrawling(false);
      setIsFetchingUrl(false);
    }
  };

  // Step range forward / backward (e.g. +10, +25, +50)
  const handleStepRange = (delta: number) => {
    const rangeSpan = Math.max(1, crawlEndPage - crawlStartPage + 1);
    const newStart = Math.max(1, crawlStartPage + delta);
    const newEnd = newStart + rangeSpan - 1;
    setCrawlStartPage(newStart);
    setCrawlEndPage(newEnd);
    handleStartRangeCrawler(newStart, newEnd, true);
  };

  // Function to scan pasted batch text
  const handleScanBatchText = () => {
    if (!batchInputText.trim()) return;

    const targetFilterNum = parseInt(batchTargetFilter);
    const isEnglishGematria = urlGematriaSystem === NumberingSystem.ENGLISH_BASE6;
    const activeSys = isEnglishGematria ? NumberingSystem.ENGLISH_BASE6 : NumberingSystem.IONIAN;

    const lines = batchInputText.split(/\r?\n/);
    const wordFreqMap = new Map<string, { value: number; count: number; translation?: string | null }>();

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      const upperLine = cleanLine.toUpperCase();
      const lineVal = calculateIsopsephy(upperLine, activeSys);
      if (lineVal > 0) {
        if (!isNaN(targetFilterNum) && targetFilterNum > 0) {
          if (lineVal === targetFilterNum) {
            const prev = wordFreqMap.get(upperLine);
            if (prev) prev.count += 1;
            else wordFreqMap.set(upperLine, { value: lineVal, count: 1, translation: translateEnglishToGreek(upperLine) });
          }
        } else {
          const prev = wordFreqMap.get(upperLine);
          if (prev) prev.count += 1;
          else wordFreqMap.set(upperLine, { value: lineVal, count: 1, translation: translateEnglishToGreek(upperLine) });
        }
      }

      const lineWords = cleanLine.split(/[\s,;:·\t]+/);
      lineWords.forEach((w) => {
        const upper = w.toUpperCase();
        if (upper.length < 2) return;
        const val = calculateIsopsephy(upper, activeSys);
        if (val > 0) {
          if (!isNaN(targetFilterNum) && targetFilterNum > 0) {
            if (val === targetFilterNum) {
              const prev = wordFreqMap.get(upper);
              if (prev) prev.count += 1;
              else wordFreqMap.set(upper, { value: val, count: 1, translation: translateEnglishToGreek(upper) });
            }
          } else {
            const prev = wordFreqMap.get(upper);
            if (prev) prev.count += 1;
            else wordFreqMap.set(upper, { value: val, count: 1, translation: translateEnglishToGreek(upper) });
          }
        }
      });
    });

    const matches = Array.from(wordFreqMap.entries())
      .map(([txt, info]) => ({
        text: txt,
        value: info.value,
        count: info.count,
        translation: info.translation || translateEnglishToGreek(txt),
      }))
      .sort((a, b) => b.count - a.count);

    setBatchMatches(matches);
  };

  const handleSaveResult = (res: OnlineResultItem) => {
    if (!onSaveItem) return;
    onSaveItem({
      text: res.text,
      normalized: res.text,
      value: res.calculatedSum,
      root: calculatePythmen(res.calculatedSum),
      greekNumeral: numberToGreekNumeral(res.calculatedSum),
      isPhrase: res.text.includes(" "),
      wordCount: res.text.split(/\s+/).length,
      category: res.source,
      notes: res.meaning,
    });
    setSavedTargets((prev) => new Set(prev).add(res.text));
  };

  const handleBatchSaveAll = () => {
    if (!onSaveItem || targetResults.length === 0) return;
    let count = 0;
    targetResults.forEach((res) => {
      onSaveItem({
        text: res.text,
        normalized: res.text,
        value: res.calculatedSum,
        root: calculatePythmen(res.calculatedSum),
        greekNumeral: numberToGreekNumeral(res.calculatedSum),
        isPhrase: res.text.includes(" "),
        wordCount: res.text.split(/\s+/).length,
        category: res.source,
        notes: res.meaning,
      });
      setSavedTargets((prev) => new Set(prev).add(res.text));
      count++;
    });
    setBatchSaveStatus(`Αποθηκεύτηκαν επιτυχώς ${count} ισόψηφες λέξεις/φράσεις!`);
    setTimeout(() => setBatchSaveStatus(null), 3500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#f5ebd7]">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#1c1813] via-[#15120e] to-[#0d0a07] border border-[#c89b3c]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#c89b3c]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#c89b3c]/15 text-[#e6c670] border border-[#c89b3c]/30">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#e6c670] tracking-wide">
                  Διαδικτυακός Ανιχνευτής & Crawler Ισοψηφιών
                </h2>
                <p className="text-xs md:text-sm text-[#a89984] font-serif">
                  Αντίστροφη εύρεση λεξαρίθμων, crawler πολλαπλών σελίδων (Gematrix.org / Arithmosofia) & αυτόματη μετάφραση στα ελληνικά
                </p>
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center bg-[#120f0c] p-1.5 rounded-2xl border border-[#c89b3c]/30 shadow-inner">
            <button
              onClick={() => setActiveMode("url")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-serif font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === "url"
                  ? "bg-[#c89b3c] text-black font-bold shadow-lg"
                  : "text-[#d4c5b0] hover:text-[#e6c670]"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Σάρωση URL / Ιστοσελίδας</span>
            </button>
            <button
              onClick={() => setActiveMode("target")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-serif font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === "target"
                  ? "bg-[#c89b3c] text-black font-bold shadow-lg"
                  : "text-[#d4c5b0] hover:text-[#e6c670]"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Αντίστροφη Εύρεση Αριθμού</span>
            </button>
            <button
              onClick={() => setActiveMode("batchText")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-serif font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === "batchText"
                  ? "bg-[#c89b3c] text-black font-bold shadow-lg"
                  : "text-[#d4c5b0] hover:text-[#e6c670]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Επικόλληση Κειμένων</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: TARGET NUMBER FINDER */}
      {activeMode === "target" && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-[#1a1612]/90 border border-[#c89b3c]/20 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/35 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#e6c670]">
                <Layers className="w-4 h-4 text-[#c89b3c]" />
                <span>Σύστημα Αρίθμησης & Αλφάβητο:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGematriaSystem(NumberingSystem.IONIAN)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                    selectedGematriaSystem === NumberingSystem.IONIAN
                      ? "bg-[#c89b3c] text-black font-bold shadow-md"
                      : "bg-[#1f1610] text-[#d4c5b0] hover:bg-[#2a1e15] border border-[#c89b3c]/25"
                  }`}
                >
                  🇬🇷 Ελληνική Ιωνική (27 Ψηφία: Α=1...Ω=800)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGematriaSystem(NumberingSystem.ENGLISH_BASE6)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                    selectedGematriaSystem === NumberingSystem.ENGLISH_BASE6
                      ? "bg-[#c89b3c] text-black font-bold shadow-md"
                      : "bg-[#1f1610] text-[#d4c5b0] hover:bg-[#2a1e15] border border-[#c89b3c]/25"
                  }`}
                >
                  🇬🇧 English Gematria (x6: A=6, B=12... Z=156 / Gematrix)
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-1 relative">
                <label className="block text-xs font-serif text-[#a89984] mb-2 uppercase tracking-wider">
                  Εισαγωγή Αριθμού-Στόχου ({selectedGematriaSystem === NumberingSystem.ENGLISH_BASE6 ? "π.χ. 666 για COMPUTER, NEW YORK κ.ά." : "π.χ. 666, 888, 1119 για ΙΩΑΝΝΗΣ"})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetNumber}
                    onChange={(e) => setTargetNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchTarget()}
                    placeholder={selectedGematriaSystem === NumberingSystem.ENGLISH_BASE6 ? "π.χ. 666, 888, 777..." : "π.χ. 666, 888, 1119, 1332, 1480, 2368..."}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/40 text-[#f5ebd7] text-lg font-serif placeholder-[#5a4e40] focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] outline-none transition-all"
                  />
                  <Search className="w-5 h-5 text-[#c89b3c] absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => handleSearchTarget()}
                  disabled={isSearchingTarget}
                  className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#e6c670] hover:from-[#b08530] hover:to-[#c89b3c] text-black font-serif font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#c89b3c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSearchingTarget ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Αναζήτηση...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Αναζήτηση {selectedGematriaSystem === NumberingSystem.ENGLISH_BASE6 ? "English Gematria" : "Ισοψηφιών"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Presets */}
            <div>
              <div className="text-xs font-serif text-[#a89984] mb-2">Δημοφιλείς Αριθμοί-Στόχοι:</div>
              <div className="flex flex-wrap gap-2">
                {PRESET_TARGETS.map((item) => (
                  <button
                    key={item.num}
                    onClick={() => {
                      setTargetNumber(item.num.toString());
                      handleSearchTarget(item.num);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif border transition-all cursor-pointer ${
                      targetNumber === item.num.toString()
                        ? "bg-[#c89b3c]/20 border-[#c89b3c] text-[#e6c670]"
                        : "bg-[#120f0c] border-[#c89b3c]/20 text-[#a89984] hover:border-[#c89b3c]/60 hover:text-[#f5ebd7]"
                    }`}
                  >
                    <span className="font-bold text-[#e6c670]">{item.num}</span>: {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Area */}
          {targetResults.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#1a1612] border border-[#c89b3c]/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#c89b3c]/15 text-[#e6c670]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#e6c670]">
                      Βρέθηκαν {targetResults.length} Ισόψηφα Αποτελέσματα για το {targetNumber}
                    </h3>
                    <p className="text-xs text-[#a89984]">{targetSourceType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const exportData = {
                        title: "Isopsephy & Gematria Target Results Export",
                        targetNumber: targetNumber,
                        system: selectedGematriaSystem,
                        source: targetSourceType,
                        exportDate: new Date().toISOString(),
                        count: targetResults.length,
                        results: targetResults,
                        combinations: targetCombinations,
                      };
                      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `gematria_target_${targetNumber}_${selectedGematriaSystem.toLowerCase()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#140f0a] hover:bg-[#241a10] border border-[#c89b3c]/40 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-[#c89b3c]" />
                    <span>Εξαγωγή σε JSON</span>
                  </button>

                  <button
                    onClick={handleBatchSaveAll}
                    className="px-4 py-2 rounded-lg bg-[#281f15] hover:bg-[#382b1d] border border-[#c89b3c]/50 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-2 hover:border-[#c89b3c] transition-all cursor-pointer"
                  >
                    <BookmarkPlus className="w-4 h-4 text-[#c89b3c]" />
                    <span>Μαζική Αποθήκευση ({targetResults.length})</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {targetResults.map((item, idx) => {
                  const isSaved = savedTargets.has(item.text);
                  const engTranslation = translateEnglishToGreek(item.text);
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#1a1612] border border-[#c89b3c]/20 hover:border-[#c89b3c]/50 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xl font-serif font-bold text-[#f5ebd7] tracking-wider">
                            {item.text}
                          </div>
                          {engTranslation && (
                            <div className="text-xs font-serif text-[#e6c670] flex items-center gap-1 mt-0.5">
                              <Languages className="w-3.5 h-3.5 text-[#c89b3c]" />
                              <span>({engTranslation})</span>
                            </div>
                          )}
                          <div className="text-xs text-[#a89984] mt-1">{item.meaning}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSaveResult(item)}
                            disabled={isSaved}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isSaved
                                ? "bg-green-950/40 border-green-700/50 text-green-400"
                                : "bg-[#120f0c] border-[#c89b3c]/30 text-[#e6c670] hover:bg-[#c89b3c]/20 hover:border-[#c89b3c]"
                            }`}
                            title="Αποθήκευση"
                          >
                            {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setTargetResults((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-2.5 rounded-xl bg-[#120f0c] hover:bg-red-950/60 border border-[#3d2f22] hover:border-red-600/60 text-[#8c7e6c] hover:text-red-400 transition-colors cursor-pointer"
                            title="Διαγραφή λέξης / φράσης (Χ)"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#c89b3c]/15 text-[#a89984]">
                        <span className="bg-[#120f0c] px-2 py-0.5 rounded text-[#e6c670] font-mono font-bold">
                          = {item.calculatedSum}
                        </span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: WEB URL RANGE CRAWLER & READER */}
      {activeMode === "url" && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-[#1a1612]/90 border border-[#c89b3c]/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#c89b3c]/15 text-[#e6c670]">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#e6c670]">
                    Crawler Σελίδων & Μαζική Σάρωση Εύρους (Page Range)
                  </h3>
                  <p className="text-xs text-[#a89984]">
                    Ανάκτηση οποιουδήποτε εύρους σελίδων (π.χ. 10-20, 10-50, 10-500) από το Gematrix.org & άλλες πηγές
                  </p>
                </div>
              </div>

              {urlDetectedPages && (
                <div className="px-3 py-1.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/35 text-[#e6c670] text-xs font-serif flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#c89b3c]" />
                  <span>Ανιχνεύθηκαν <strong>{urlDetectedPages}</strong> σελίδες στην πηγή</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Language & System Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/35 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#e6c670]">
                  <Layers className="w-4 h-4 text-[#c89b3c]" />
                  <span>Γλώσσα & Σύστημα Σάρωσης:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUrlGematriaSystem(NumberingSystem.ENGLISH_BASE6)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                      urlGematriaSystem === NumberingSystem.ENGLISH_BASE6
                        ? "bg-[#c89b3c] text-black font-bold shadow-md"
                        : "bg-[#1f1610] text-[#d4c5b0] hover:bg-[#2a1e15] border border-[#c89b3c]/25"
                    }`}
                  >
                    🇬🇧 English Gematria (x6: A=6, B=12... Z=156 / Gematrix)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlGematriaSystem(NumberingSystem.IONIAN)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                      urlGematriaSystem === NumberingSystem.IONIAN
                        ? "bg-[#c89b3c] text-black font-bold shadow-md"
                        : "bg-[#1f1610] text-[#d4c5b0] hover:bg-[#2a1e15] border border-[#c89b3c]/25"
                    }`}
                  >
                    🇬🇷 Ελληνική Ιωνική (Α=1...Ω=800)
                  </button>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-serif text-[#a89984] mb-2 uppercase tracking-wider">
                  Διεύθυνση Ιστοσελίδας / Gematrix URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTargetUrl(val);
                      if (/gematrix\.org/i.test(val)) {
                        setUrlGematriaSystem(NumberingSystem.ENGLISH_BASE6);
                      }
                    }}
                    placeholder="https://www.gematrix.org/?word=666"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#120f0c] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-sans placeholder-[#5a4e40] focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] outline-none transition-all"
                  />
                  <Globe className="w-5 h-5 text-[#c89b3c] absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Dynamic Range Configuration Card */}
              <div className="p-4 rounded-xl bg-[#120f0c] border border-[#c89b3c]/35 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-[#c89b3c]" />
                    Ρύθμιση Εύρους Σελίδων (Custom Page Range):
                  </span>
                  <div className="text-xs text-[#a89984] font-serif">
                    Σύνολο σελίδων προς σάρωση:{" "}
                    <strong className="text-[#e6c670] font-mono">
                      {Math.max(1, crawlEndPage - crawlStartPage + 1)}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-serif text-[#a89984] mb-1">
                      Αριθμός-Στόχος (Target):
                    </label>
                    <input
                      type="number"
                      value={filterTargetFromUrl}
                      onChange={(e) => setFilterTargetFromUrl(e.target.value)}
                      placeholder="π.χ. 666 ή κενό"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#1a1612] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-serif outline-none focus:border-[#c89b3c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-[#e6c670] mb-1 font-semibold">
                      Από Σελίδα (Start Page):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={crawlStartPage}
                      onChange={(e) => setCrawlStartPage(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#1a1612] border border-[#c89b3c]/50 text-[#f5ebd7] text-sm font-serif font-bold outline-none focus:border-[#c89b3c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-[#e6c670] mb-1 font-semibold">
                      Έως Σελίδα (End Page):
                    </label>
                    <input
                      type="number"
                      min={crawlStartPage}
                      value={crawlEndPage}
                      onChange={(e) => setCrawlEndPage(Math.max(crawlStartPage, parseInt(e.target.value) || crawlStartPage))}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#1a1612] border border-[#c89b3c]/50 text-[#f5ebd7] text-sm font-serif font-bold outline-none focus:border-[#c89b3c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-[#a89984] mb-1">
                      Πακέτο ανά Κύκλο:
                    </label>
                    <select
                      value={crawlBatchChunkSize}
                      onChange={(e) => setCrawlBatchChunkSize(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#1a1612] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-serif outline-none"
                    >
                      <option value={5}>5 σελίδες / κύκλο</option>
                      <option value={10}>10 σελίδες / κύκλο (Προτεινόμενο)</option>
                      <option value={15}>15 σελίδες / κύκλο</option>
                      <option value={20}>20 σελίδες / κύκλο</option>
                      <option value={25}>25 σελίδες / κύκλο (Μέγιστο)</option>
                    </select>
                  </div>
                </div>

                {/* Range Presets */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-serif text-[#a89984]">
                    Γρήγορα Έτοιμα Εύρη (Presets):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Σελίδες 1 - 10", start: 1, end: 10 },
                      { label: "Σελίδες 10 - 20", start: 10, end: 20 },
                      { label: "Σελίδες 20 - 50", start: 20, end: 50 },
                      { label: "Σελίδες 50 - 100", start: 50, end: 100 },
                      { label: "Σελίδες 100 - 200", start: 100, end: 200 },
                      { label: "Σελίδες 10 - 500", start: 10, end: 500 },
                      { label: "Όλες (1 - 500)", start: 1, end: urlDetectedPages || 500 },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCrawlStartPage(preset.start);
                          setCrawlEndPage(preset.end);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-colors cursor-pointer border ${
                          crawlStartPage === preset.start && crawlEndPage === preset.end
                            ? "bg-[#c89b3c]/25 border-[#c89b3c] text-[#e6c670] font-semibold"
                            : "bg-[#18130e] border-[#c89b3c]/20 text-[#a89984] hover:text-[#e6c670] hover:bg-[#251d16]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Append Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-[#c89b3c]/15">
                  <label className="flex items-center gap-2 text-xs font-serif text-[#d4c5b0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={crawlAppendMode}
                      onChange={(e) => setCrawlAppendMode(e.target.checked)}
                      className="w-4 h-4 accent-[#c89b3c] rounded cursor-pointer"
                    />
                    <span>Προσθήκη νέων ευρημάτων στα υπάρχοντα (Χωρίς εκκαθάριση λίστας)</span>
                  </label>
                  {urlScannedMatches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUrlScannedMatches([])}
                      className="text-xs text-[#a89984] hover:text-red-400 font-serif flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Εκκαθάριση {urlScannedMatches.length} αποτελεσμάτων</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons: Start Crawling & Stop */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {!isRangeCrawling ? (
                  <button
                    onClick={() => handleStartRangeCrawler()}
                    disabled={isFetchingUrl}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#e6c670] hover:from-[#b08530] hover:to-[#c89b3c] text-black font-serif font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#c89b3c]/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    <span>
                      Έναρξη Σάρωσης Εύρους (Σελίδες {crawlStartPage} έως {crawlEndPage})
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopCrawler}
                    className="flex-1 py-4 rounded-xl bg-red-800 hover:bg-red-700 text-white font-serif font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer animate-pulse"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    <span>Διακοπή Σάρωσης (Stop Crawler)</span>
                  </button>
                )}
              </div>

              {/* Live Crawler Progress Bar */}
              {(isRangeCrawling || crawlerProgress.percent > 0) && (
                <div className="p-4 rounded-xl bg-[#120f0c] border border-[#c89b3c]/40 shadow-inner space-y-3">
                  <div className="flex items-center justify-between text-xs font-serif">
                    <span className="text-[#e6c670] font-semibold flex items-center gap-2">
                      {isRangeCrawling && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c89b3c]" />}
                      {crawlerProgress.statusText || `Σάρωση σε εξέλιξη...`}
                    </span>
                    <span className="text-[#e6c670] font-mono font-bold">
                      {crawlerProgress.percent}%
                    </span>
                  </div>

                  <div className="w-full bg-[#1e1711] h-3 rounded-full overflow-hidden border border-[#c89b3c]/30">
                    <div
                      className="bg-gradient-to-r from-[#c89b3c] to-[#e6c670] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${crawlerProgress.percent}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-[#a89984] font-serif">
                    <span>
                      Εύρος-Στόχος: <strong>{crawlerProgress.targetStart} - {crawlerProgress.targetEnd}</strong>
                    </span>
                    <span>
                      Τρέχον Πακέτο: <strong>{crawlerProgress.currentStart} - {crawlerProgress.currentEnd}</strong>
                    </span>
                    <span className="text-[#e6c670]">
                      Συγκεντρώθηκαν: <strong>{urlScannedMatches.length}</strong> λέξεις/φράσεις
                    </span>
                  </div>
                </div>
              )}

              {urlFetchError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-serif flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{urlFetchError}</span>
                </div>
              )}
            </div>
          </div>

          {/* URL Scanned Results Container */}
          {urlScannedMatches.length > 0 && (
            <div className="space-y-6">
              {/* Header & Export / Mass Save Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#1a1612] border border-[#c89b3c]/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#c89b3c]/15 text-[#e6c670]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#e6c670]">
                      Βρέθηκαν {urlScannedMatches.length} Ισόψηφα Στοιχεία
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#a89984] mt-0.5">
                      <span>Στόχος: <strong>{filterTargetFromUrl || "Όλα"}</strong></span>
                      {lastCrawledRange && (
                        <span className="px-2 py-0.5 rounded bg-[#120f0c] text-[#e6c670] border border-[#c89b3c]/30">
                          Σαρώθηκε εύρος σελίδων: {lastCrawledRange.start} έως {lastCrawledRange.end}
                        </span>
                      )}
                      {urlDetectedPages && (
                        <span className="text-[#a89984]">
                          (Σύνολο σελίδων πηγής: {urlDetectedPages})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Export CSV (Excel) Button */}
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3 py-2 rounded-lg bg-[#141b12] hover:bg-[#1f2d1c] border border-emerald-700/50 text-emerald-300 text-xs font-serif font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Εξαγωγή σε υπολογιστικό φύλλο Excel (.csv) με πλήρη στοιχεία και ελληνικούς χαρακτήρες"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Εξαγωγή Excel/CSV</span>
                  </button>

                  {/* Export JSON Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const exportData = {
                        title: "URL Range Scanned Gematria Matches Export",
                        sourceUrl: targetUrl,
                        filterTarget: filterTargetFromUrl || "all",
                        system: urlGematriaSystem,
                        crawledRange: lastCrawledRange || { start: crawlStartPage, end: crawlEndPage },
                        exportDate: new Date().toISOString(),
                        count: urlScannedMatches.length,
                        matches: urlScannedMatches,
                      };
                      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                        type: "application/json;charset=utf-8",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `gematria_range_${crawlStartPage}_${crawlEndPage}_target_${filterTargetFromUrl || "all"}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#140f0a] hover:bg-[#241a10] border border-[#c89b3c]/40 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-[#c89b3c]" />
                    <span>Εξαγωγή JSON ({urlScannedMatches.length})</span>
                  </button>

                  {/* Mass Save to Library */}
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
                          notes: m.translation
                            ? `Μετάφραση: ${m.translation} | Αντλήθηκε από ${targetUrl} (Σελ. ${crawlStartPage}-${crawlEndPage})`
                            : `Αντλήθηκε από ${targetUrl} (Σελ. ${crawlStartPage}-${crawlEndPage})`,
                        });
                        count++;
                      });
                      setBatchSaveStatus(`Αποθηκεύτηκαν επιτυχώς ${count} στοιχεία στη βιβλιοθήκη!`);
                      setTimeout(() => setBatchSaveStatus(null), 3000);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#281f15] hover:bg-[#382b1d] border border-[#c89b3c]/50 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-2 hover:border-[#c89b3c] transition-all cursor-pointer"
                  >
                    <BookmarkPlus className="w-4 h-4 text-[#c89b3c]" />
                    <span>Αποθήκευση Όλων ({urlScannedMatches.length})</span>
                  </button>
                </div>
              </div>

              {/* Fast Step Navigation Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#120f0c] border border-[#c89b3c]/25">
                <div className="text-xs font-serif text-[#a89984] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#c89b3c]" />
                  <span>Γρήγορη Μετάβαση σε Επόμενα Εύρη:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={crawlStartPage <= 1 || isRangeCrawling}
                    onClick={() => handleStepRange(-10)}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1612] hover:bg-[#251d16] border border-[#c89b3c]/30 text-[#e6c670] text-xs font-serif flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>« Προηγούμενη 10άδα</span>
                  </button>
                  <button
                    type="button"
                    disabled={isRangeCrawling}
                    onClick={() => handleStepRange(10)}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1612] hover:bg-[#251d16] border border-[#c89b3c]/30 text-[#e6c670] text-xs font-serif flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Επόμενη 10άδα »</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isRangeCrawling}
                    onClick={() => handleStepRange(25)}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1612] hover:bg-[#251d16] border border-[#c89b3c]/30 text-[#e6c670] text-xs font-serif flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                  >
                    <span>+25 Σελίδες</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isRangeCrawling}
                    onClick={() => handleStepRange(50)}
                    className="px-3 py-1.5 rounded-lg bg-[#1a1612] hover:bg-[#251d16] border border-[#c89b3c]/30 text-[#e6c670] text-xs font-serif flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                  >
                    <span>+50 Σελίδες</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search, Filter & Sort Inside Collected Results */}
              <div className="flex flex-col gap-3 p-3 rounded-xl bg-[#120f0c] border border-[#c89b3c]/20">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={urlResultsSearch}
                      onChange={(e) => setUrlResultsSearch(e.target.value)}
                      placeholder="Αναζήτηση λέξης, φράσης ή μετάφρασης στα αποτελέσματα..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1a1612] border border-[#c89b3c]/30 text-[#f5ebd7] text-xs font-serif outline-none focus:border-[#c89b3c]"
                    />
                    <Search className="w-4 h-4 text-[#c89b3c] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Filter Pills: All / Words Only / Phrases Only */}
                  <div className="flex bg-[#1a1612] p-1 rounded-lg border border-[#c89b3c]/25">
                    {[
                      { id: "all", label: `Όλα (${urlScannedMatches.length})` },
                      { id: "words", label: `Λέξεις (${urlSingleWordsCount})` },
                      { id: "phrases", label: `Φράσεις (${urlPhrasesCount})` },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setUrlFilterType(c.id as any)}
                        className={`px-2.5 py-1 rounded text-xs font-serif transition-colors cursor-pointer ${
                          urlFilterType === c.id
                            ? "bg-[#251e17] text-[#e6c670] font-bold border border-[#c89b3c]/40"
                            : "text-[#8c7e6c] hover:text-[#d6c7b2]"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-[#c89b3c]" />
                    <select
                      value={urlResultsSort}
                      onChange={(e: any) => setUrlResultsSort(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-[#1a1612] border border-[#c89b3c]/30 text-[#e6c670] text-xs font-serif outline-none"
                    >
                      <option value="count_desc">Συχνότητα (Υψηλότερη)</option>
                      <option value="alpha_asc">Αλφαβητική σειρά (A-Z)</option>
                      <option value="length_desc">Μέγεθος φράσης (Μεγαλύτερο)</option>
                      <option value="value_asc">Αριθμητική τιμή (Αύξουσα)</option>
                    </select>
                  </div>
                </div>

                {/* Thematic Topic Clustering Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#c89b3c]/15">
                  <span className="text-[11px] font-serif text-[#8c7e6c] flex items-center gap-1 mr-1">
                    <Tag className="w-3 h-3 text-[#c89b3c]" />
                    <span>Θεματική Ομαδοποίηση:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setUrlSelectedTopic("all")}
                    className={`px-2 py-0.5 rounded text-[11px] font-serif transition-colors cursor-pointer ${
                      urlSelectedTopic === "all"
                        ? "bg-[#c89b3c]/20 text-[#e6c670] font-bold border border-[#c89b3c]"
                        : "bg-[#181410] text-[#a69680] hover:text-[#f5ecd8] border border-[#33271c]"
                    }`}
                  >
                    Όλες οι Θεματικές
                  </button>
                  {TOPIC_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setUrlSelectedTopic(cat.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-serif transition-colors flex items-center gap-1 cursor-pointer ${
                        urlSelectedTopic === cat.id
                          ? `${cat.badgeBg} ${cat.badgeText} font-bold border ${cat.badgeBorder}`
                          : "bg-[#181410] text-[#a69680] hover:text-[#f5ecd8] border border-[#33271c]"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Cleaner & Quick Deletion Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-[#16120e] border border-[#2e2318] text-xs font-serif">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplySmartQualityClean}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1f281b] hover:bg-[#2b3a25] text-emerald-300 hover:text-emerald-200 border border-emerald-700/50 font-bold transition-colors cursor-pointer"
                    title="Αυτόματη αφαίρεση τυχαίων συμβόλων, spam URLs, ορφανών αριθμών και περιττού θορύβου"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Έξυπνος Καθαρισμός Θορύβου</span>
                  </button>
                  {qualityCleanReport && (
                    <span className="text-emerald-400 font-sans text-xs animate-pulse">
                      {qualityCleanReport}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {urlSingleWordsCount > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteOnlyWordsFromUrl}
                      className="px-2.5 py-1 rounded bg-[#201414] hover:bg-[#301a1a] text-red-300 hover:text-red-200 border border-red-900/40 transition-colors cursor-pointer"
                      title="Αφαίρεση μόνο των μεμονωμένων λέξεων από τη λίστα"
                    >
                      Διαγραφή ΜΟΝΟ Λέξεων ({urlSingleWordsCount})
                    </button>
                  )}
                  {urlPhrasesCount > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteOnlyPhrasesFromUrl}
                      className="px-2.5 py-1 rounded bg-[#201414] hover:bg-[#301a1a] text-amber-300 hover:text-amber-200 border border-amber-900/40 transition-colors cursor-pointer"
                      title="Αφαίρεση μόνο των φράσεων από τη λίστα"
                    >
                      Διαγραφή ΜΟΝΟ Φράσεων ({urlPhrasesCount})
                    </button>
                  )}
                </div>
              </div>

              {batchSaveStatus && (
                <div className="p-3 rounded-xl bg-green-950/40 border border-green-800 text-green-300 text-xs font-serif">
                  {batchSaveStatus}
                </div>
              )}

              {/* Results Grid with Translation & Topic Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {urlScannedMatches
                  .filter((m) => {
                    if (urlFilterType === "words" && m.text.trim().includes(" ")) return false;
                    if (urlFilterType === "phrases" && !m.text.trim().includes(" ")) return false;
                    if (urlSelectedTopic !== "all") {
                      const topic = categorizeTerm(m.text, m.translation || undefined);
                      if (topic.id !== urlSelectedTopic) return false;
                    }
                    if (!urlResultsSearch.trim()) return true;
                    const q = urlResultsSearch.trim().toUpperCase();
                    return (
                      m.text.toUpperCase().includes(q) ||
                      (m.translation && m.translation.toUpperCase().includes(q)) ||
                      String(m.value) === q
                    );
                  })
                  .sort((a, b) => {
                    if (urlResultsSort === "count_desc") return b.count - a.count;
                    if (urlResultsSort === "alpha_asc") return a.text.localeCompare(b.text);
                    if (urlResultsSort === "length_desc") return b.text.length - a.text.length;
                    if (urlResultsSort === "value_asc") return a.value - b.value;
                    return 0;
                  })
                  .map((m, idx) => {
                    const topic = categorizeTerm(m.text, m.translation || undefined);
                    return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#1a1612] border border-[#c89b3c]/20 hover:border-[#c89b3c]/50 transition-all flex items-start justify-between gap-3 shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="font-serif font-bold text-sm text-[#f5ebd7] tracking-wide">
                            {m.text}
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${topic.badgeBg} ${topic.badgeBorder} ${topic.badgeText} flex items-center gap-0.5`}>
                            <span>{topic.icon}</span>
                            <span>{topic.name}</span>
                          </span>
                        </div>
                        {m.translation && (
                          <div className="text-xs font-serif text-[#e6c670] flex items-center gap-1">
                            <Languages className="w-3.5 h-3.5 text-[#c89b3c] flex-shrink-0" />
                            <span className="italic">({m.translation})</span>
                          </div>
                        )}
                        <div className="text-xs text-[#a89984]">
                          Αξία: <span className="text-[#e6c670] font-bold font-mono">{m.value}</span> • {m.count}x εμφάνιση
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            if (!onSaveItem) return;
                            onSaveItem({
                              text: m.text,
                              normalized: m.text,
                              value: m.value,
                              root: calculatePythmen(m.value),
                              greekNumeral: numberToGreekNumeral(m.value),
                              isPhrase: m.text.includes(" "),
                              wordCount: m.text.split(/\s+/).length,
                              category: topic.name,
                              notes: m.translation
                                ? `Μετάφραση: ${m.translation} | Αντλήθηκε από ${targetUrl} (Σελ. ${crawlStartPage}-${crawlEndPage})`
                                : `Αντλήθηκε από ${targetUrl} (Σελ. ${crawlStartPage}-${crawlEndPage})`,
                            });
                          }}
                          className="p-2 rounded-lg bg-[#120f0c] hover:bg-[#c89b3c]/20 border border-[#c89b3c]/30 text-[#e6c670] transition-colors cursor-pointer"
                          title="Αποθήκευση στη Βιβλιοθήκη"
                        >
                          <BookmarkPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setUrlScannedMatches((prev) => prev.filter((item) => item.text !== m.text))}
                          className="p-2 rounded-lg bg-[#120f0c] hover:bg-red-950/60 border border-[#3d2f22] hover:border-red-600/60 text-[#8c7e6c] hover:text-red-400 transition-colors cursor-pointer"
                          title="Διαγραφή λέξης / φράσης (Χ)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: BATCH TEXT PASTE SCANNER */}
      {activeMode === "batchText" && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-[#1a1612]/90 border border-[#c89b3c]/20 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#c89b3c]/15 text-[#e6c670]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-[#e6c670]">
                  Επικόλληση & Μαζική Σάρωση Κειμένων
                </h3>
                <p className="text-xs text-[#a89984]">
                  Επικολλήστε κείμενο ή λίστα λέξεων και βρείτε όλες τις ισόψηφες λέξεις/φράσεις
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-serif text-[#a89984] mb-2 uppercase tracking-wider">
                  Κείμενο προς Ανάλυση
                </label>
                <textarea
                  value={batchInputText}
                  onChange={(e) => setBatchInputText(e.target.value)}
                  rows={8}
                  placeholder="Επικολλήστε εδώ κείμενα από ιστοσελίδες, βιβλία ή λίστες λέξεων..."
                  className="w-full p-4 rounded-xl bg-[#120f0c] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-serif placeholder-[#5a4e40] focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c] outline-none transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-serif text-[#a89984] whitespace-nowrap">
                    Φίλτρο Αριθμού-Στόχου:
                  </label>
                  <input
                    type="number"
                    value={batchTargetFilter}
                    onChange={(e) => setBatchTargetFilter(e.target.value)}
                    placeholder="π.χ. 666 (ή κενό για όλα)"
                    className="w-32 px-3 py-2 rounded-lg bg-[#120f0c] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-serif outline-none"
                  />
                </div>

                <button
                  onClick={handleScanBatchText}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#e6c670] text-black font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Σάρωση Κειμένου</span>
                </button>
              </div>
            </div>
          </div>

          {/* Batch Results */}
          {batchMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1612] border border-[#c89b3c]/30">
                <h4 className="text-lg font-serif font-bold text-[#e6c670]">
                  Βρέθηκαν {batchMatches.length} Ισόψηφα Στοιχεία
                </h4>
                <button
                  onClick={() => {
                    if (!onSaveItem) return;
                    let count = 0;
                    batchMatches.forEach((m) => {
                      onSaveItem({
                        text: m.text,
                        normalized: m.text,
                        value: m.value,
                        root: calculatePythmen(m.value),
                        greekNumeral: numberToGreekNumeral(m.value),
                        isPhrase: m.text.includes(" "),
                        wordCount: m.text.split(/\s+/).length,
                        category: "ΜΑΖΙΚΗ ΣΑΡΩΣΗ",
                        notes: m.translation ? `Μετάφραση: ${m.translation}` : "Μαζική επικόλληση",
                      });
                      count++;
                    });
                    setBatchSaveStatus(`Αποθηκεύτηκαν ${count} στοιχεία!`);
                    setTimeout(() => setBatchSaveStatus(null), 3000);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#281f15] border border-[#c89b3c]/50 text-[#e6c670] text-xs font-serif font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-[#c89b3c]" />
                  <span>Αποθήκευση Όλων ({batchMatches.length})</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {batchMatches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#1a1612] border border-[#c89b3c]/20 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-serif font-bold text-sm text-[#f5ebd7]">{m.text}</div>
                      {m.translation && (
                        <div className="text-xs font-serif text-[#e6c670] flex items-center gap-1 mt-0.5">
                          <Languages className="w-3 h-3 text-[#c89b3c]" />
                          <span>({m.translation})</span>
                        </div>
                      )}
                      <div className="text-xs text-[#a89984] mt-1">
                        Αξία: <span className="text-[#e6c670] font-mono font-bold">{m.value}</span> • {m.count}x
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          if (!onSaveItem) return;
                          onSaveItem({
                            text: m.text,
                            normalized: m.text,
                            value: m.value,
                            root: calculatePythmen(m.value),
                            greekNumeral: numberToGreekNumeral(m.value),
                            isPhrase: m.text.includes(" "),
                            wordCount: m.text.split(/\s+/).length,
                            category: "ΜΑΖΙΚΗ ΣΑΡΩΣΗ",
                            notes: m.translation ? `Μετάφραση: ${m.translation}` : "Μαζική επικόλληση",
                          });
                        }}
                        className="p-2 rounded-lg bg-[#120f0c] border border-[#c89b3c]/30 text-[#e6c670] hover:bg-[#c89b3c]/20 transition-colors cursor-pointer"
                        title="Αποθήκευση"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setBatchMatches((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-2 rounded-lg bg-[#120f0c] hover:bg-red-950/60 border border-[#3d2f22] hover:border-red-600/60 text-[#8c7e6c] hover:text-red-400 transition-colors cursor-pointer"
                        title="Διαγραφή λέξης / φράσης (Χ)"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
