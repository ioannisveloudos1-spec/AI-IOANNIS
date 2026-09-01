import React, { useState, useMemo } from "react";
import {
  analyzeGreekText,
  numberToGreekNumeral,
  cleanAndNormalizePolytonic,
  getAlphabetAndTextLetterBreakdown,
  calculateWordIsopsephy,
  evaluateIsopsephyExpression,
  getMathematicalProperties,
  findAnywhereWordCombinations,
  findSeedWordCombinations,
  extractSentencesWithIsopsephy,
} from "../utils/isopsephy";
import { PRESET_TEXTS } from "../data/presets";
import {
  SavedIsopsephyItem,
  WordIsopsephy,
  PhraseMatch,
  WordCombinationMatch,
  SeedWordCombinationMatch,
  SentenceIsopsephyMatch,
} from "../types";
import {
  Search,
  Sparkles,
  Bookmark,
  Check,
  Trash2,
  BookOpen,
  Layers,
  Filter,
  Eye,
  Copy,
  X,
  List,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Type,
  Hash,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Table,
  AlignLeft,
  GraduationCap,
  Boxes,
  CheckSquare,
  ArrowRight,
  Flame,
  Key,
  PlusCircle,
  Wand2,
  Zap,
  Quote,
  FileText,
  Download,
  FolderPlus,
  BookMarked,
  ArrowUpDown,
} from "lucide-react";

interface SearchTabProps {
  onSaveItem: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
  savedItems: SavedIsopsephyItem[];
}

export const SearchTab: React.FC<SearchTabProps> = ({
  onSaveItem,
  onOpenAiModal,
  savedItems,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("delphi-pythagorean-147");
  const [inputText, setInputText] = useState<string>(PRESET_TEXTS[0].text);
  const [isExpandedTextarea, setIsExpandedTextarea] = useState<boolean>(false);
  const [showExplanationSection, setShowExplanationSection] = useState<boolean>(false);
  const [showLetterFrequencies, setShowLetterFrequencies] = useState<boolean>(false);

  // Search Targets
  const [wordQuery, setWordQuery] = useState<string>("");
  const [singleWordTarget, setSingleWordTarget] = useState<string>("");
  const [phraseTarget, setPhraseTarget] = useState<string>("");
  const [phraseLengthMin, setPhraseLengthMin] = useState<number>(3);
  const [phraseLengthMax, setPhraseLengthMax] = useState<number>(6);
  const [minRange, setMinRange] = useState<string>("");
  const [maxRange, setMaxRange] = useState<string>("");

  // Arbitrary word combinations anywhere in text (2, 3, 4, 5, 6 words)
  const [comboTarget, setComboTarget] = useState<string>("");
  const [comboWordCounts, setComboWordCounts] = useState<number[]>([2, 3, 4, 5, 6]);
  const [comboMode, setComboMode] = useState<"uniqueWords" | "allOccurrences">("uniqueWords");
  const [selectedAnywhereCombo, setSelectedAnywhereCombo] = useState<WordCombinationMatch | null>(null);
  const [comboFilterLength, setComboFilterLength] = useState<number | "all">("all");

  // Custom Seed Word / Phrase Combinations (Anchor + Text Words)
  const [customSeedPhrase, setCustomSeedPhrase] = useState<string>("");
  const [customSeedTarget, setCustomSeedTarget] = useState<string>("");
  const [seedTextWordCounts, setSeedTextWordCounts] = useState<number[]>([1, 2, 3, 4]);
  const [seedMode, setSeedMode] = useState<"uniqueWords" | "allOccurrences">("uniqueWords");
  const [selectedSeedCombo, setSelectedSeedCombo] = useState<SeedWordCombinationMatch | null>(null);
  const [seedFilterLength, setSeedFilterLength] = useState<number | "all">("all");

  // Sentence-level search & analysis (Clauses ending in . ; ! ? · :)
  const [sentenceTarget, setSentenceTarget] = useState<string>("");
  const [sentenceSearchQuery, setSentenceSearchQuery] = useState<string>("");
  const [sentenceMinWords, setSentenceMinWords] = useState<number>(1);
  const [sentenceMaxWords, setSentenceMaxWords] = useState<number>(100);
  const [sentenceRootFilter, setSentenceRootFilter] = useState<number | "all">("all");
  const [sentenceSortOption, setSentenceSortOption] = useState<"index_asc" | "val_desc" | "val_asc" | "words_desc" | "root_asc">("index_asc");
  const [selectedSentenceObj, setSelectedSentenceObj] = useState<SentenceIsopsephyMatch | null>(null);

  // Active view tab inside search
  const [viewMode, setViewMode] = useState<"matches" | "interactive-flow" | "interactive-list" | "sentences" | "anywhere-combos" | "seed-combos" | "lexicon">("interactive-flow");
  const [topTextViewMode, setTopTextViewMode] = useState<"edit" | "highlighted">("edit");
  const [dismissedMatchIds, setDismissedMatchIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lexicon sort state
  const [lexiconSort, setLexiconSort] = useState<"freq" | "alpha" | "val-desc" | "val-asc">("freq");
  const [lexiconSearch, setLexiconSearch] = useState<string>("");

  // Selected word for interactive popup
  const [selectedWordObj, setSelectedWordObj] = useState<WordIsopsephy | null>(null);

  const singleTargetNum = singleWordTarget ? parseInt(singleWordTarget, 10) : undefined;
  const phraseTargetNum = phraseTarget ? parseInt(phraseTarget, 10) : undefined;
  const minRangeNum = minRange ? parseInt(minRange, 10) : undefined;
  const maxRangeNum = maxRange ? parseInt(maxRange, 10) : undefined;

  // Run analysis
  const analysis = useMemo(() => {
    return analyzeGreekText(inputText, {
      singleWordTarget: singleTargetNum,
      wordSearchQuery: wordQuery,
      phraseTarget: phraseTargetNum,
      phraseLengthMin,
      phraseLengthMax,
      minRange: minRangeNum,
      maxRange: maxRangeNum,
    });
  }, [inputText, singleTargetNum, wordQuery, phraseTargetNum, phraseLengthMin, phraseLengthMax, minRangeNum, maxRangeNum]);

  // Alphabet & Text breakdown calculation
  const letterBreakdown = useMemo(() => {
    return getAlphabetAndTextLetterBreakdown(inputText);
  }, [inputText]);

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedPresetId(pId);
    const found = PRESET_TEXTS.find((p) => p.id === pId);
    if (found) {
      setInputText(cleanAndNormalizePolytonic(found.text));
      if (found.suggestedTargets && found.suggestedTargets.length > 0) {
        setSingleWordTarget(found.suggestedTargets[0].toString());
        setPhraseTarget(found.suggestedTargets[0].toString());
      }
      setDismissedMatchIds(new Set());
      setSelectedWordObj(null);
    }
  };

  const handleDismissMatch = (id: string) => {
    setDismissedMatchIds((prev) => new Set([...prev, id]));
  };

  const handleSaveWordMatch = (wordObj: WordIsopsephy) => {
    const greekNum = numberToGreekNumeral(wordObj.value);
    onSaveItem({
      text: wordObj.rawWord,
      normalized: wordObj.normalizedWord,
      value: wordObj.value,
      root: wordObj.root,
      greekNumeral: greekNum || `${wordObj.value}`,
      isPhrase: false,
      wordCount: 1,
      sourceText: PRESET_TEXTS.find((p) => p.id === selectedPresetId)?.title || "Κείμενο Αναζήτησης",
      notes: `Αποθηκευμένη λέξη (Ισοψηφία: ${wordObj.value}, Πυθμένας: ${wordObj.root})`,
      category: "Μεμονωμένη Λέξη",
    });
  };

  const handleSavePhraseMatch = (phraseObj: PhraseMatch) => {
    const greekNum = numberToGreekNumeral(phraseObj.value);
    onSaveItem({
      text: phraseObj.phrase,
      normalized: phraseObj.phrase.toUpperCase(),
      value: phraseObj.value,
      root: phraseObj.root,
      greekNumeral: greekNum || `${phraseObj.value}`,
      isPhrase: true,
      wordCount: phraseObj.wordCount,
      sourceText: PRESET_TEXTS.find((p) => p.id === selectedPresetId)?.title || "Κείμενο Αναζήτησης",
      notes: `Συνδυασμός ${phraseObj.wordCount} λέξεων: ${phraseObj.words.map((w) => `${w.rawWord}(${w.value})`).join(" + ")} = ${phraseObj.value}`,
      category: "Συνδυασμός Φράσεων",
    });
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick helper to set exact N-word search
  const handleSetExactWordLength = (len: number) => {
    setPhraseLengthMin(len);
    setPhraseLengthMax(len);
  };

  const handleSetWordRange = (min: number, max: number) => {
    setPhraseLengthMin(min);
    setPhraseLengthMax(max);
  };

  // Filtered phrase matches (ignoring dismissed)
  const activePhraseMatches = analysis.phraseMatches.filter(
    (m) => !dismissedMatchIds.has(m.id)
  );

  const activeSingleMatches = analysis.singleMatches.filter(
    (w) => !dismissedMatchIds.has(`single-${w.indexInText}-${w.value}`)
  );

  const totalFoundMatches = activeSingleMatches.length + activePhraseMatches.length;

  // Arbitrary Word Combinations Anywhere in Text (2-6 words)
  const comboTargetNum = comboTarget ? parseInt(comboTarget, 10) : 0;

  const anywhereCombos = useMemo(() => {
    if (!comboTargetNum || comboTargetNum <= 0 || !analysis.words.length) return [];
    return findAnywhereWordCombinations(analysis.words, comboTargetNum, {
      wordCounts: comboWordCounts,
      mode: comboMode,
      maxResults: 200,
    });
  }, [analysis.words, comboTargetNum, comboWordCounts, comboMode]);

  const filteredAnywhereCombos = useMemo(() => {
    if (comboFilterLength === "all") return anywhereCombos;
    return anywhereCombos.filter((c) => c.wordCount === comboFilterLength);
  }, [anywhereCombos, comboFilterLength]);

  // Seed Word / Phrase Combinations calculation (Anchor + Text Words)
  const customSeedEval = useMemo(() => {
    if (!customSeedPhrase.trim()) return { value: 0, text: "" };
    const evalRes = evaluateIsopsephyExpression(customSeedPhrase.trim());
    const val = evalRes.finalValue > 0 ? evalRes.finalValue : calculateWordIsopsephy(customSeedPhrase.trim()).value;
    return { value: val, text: customSeedPhrase.trim() };
  }, [customSeedPhrase]);

  const customSeedTargetNum = customSeedTarget ? parseInt(customSeedTarget, 10) : 0;
  const customSeedNeededValue = customSeedTargetNum > customSeedEval.value ? customSeedTargetNum - customSeedEval.value : 0;

  const seedCombos = useMemo(() => {
    if (!customSeedEval.text || !customSeedTargetNum || customSeedTargetNum <= 0 || !analysis.words.length) return [];
    return findSeedWordCombinations(analysis.words, {
      seedPhrase: customSeedEval.text,
      targetTotalSum: customSeedTargetNum,
      textWordCounts: seedTextWordCounts,
      mode: seedMode,
      maxResults: 250,
    });
  }, [analysis.words, customSeedEval.text, customSeedTargetNum, seedTextWordCounts, seedMode]);

  const filteredSeedCombos = useMemo(() => {
    if (seedFilterLength === "all") return seedCombos;
    return seedCombos.filter((c) => c.textWordCount === seedFilterLength);
  }, [seedCombos, seedFilterLength]);

  const handleToggleSeedWordCount = (count: number) => {
    setSeedTextWordCounts((prev) => {
      if (prev.includes(count)) {
        const next = prev.filter((c) => c !== count);
        return next.length > 0 ? next : [count];
      } else {
        return [...prev, count].sort((a, b) => a - b);
      }
    });
  };

  const handleSaveSeedCombo = (comboObj: SeedWordCombinationMatch) => {
    const greekNum = numberToGreekNumeral(comboObj.totalValue);
    onSaveItem({
      text: comboObj.fullPhrase,
      normalized: comboObj.fullPhrase.toUpperCase(),
      value: comboObj.totalValue,
      root: comboObj.totalRoot,
      greekNumeral: greekNum || `${comboObj.totalValue}`,
      isPhrase: true,
      wordCount: comboObj.totalWordCount,
      sourceText: PRESET_TEXTS.find((p) => p.id === selectedPresetId)?.title || "Κείμενο Αναζήτησης",
      notes: `Συνδυασμός με Δική μου Λέξη «${comboObj.seedPhrase}» (${comboObj.seedValue}) + ${comboObj.textWordCount} λέξεις κειμένου: ${comboObj.fullEquation}`,
      category: "Συνδυασμός με Λέξη-Κλειδί",
    });
  };

  const handleSaveAllSeedCombos = () => {
    if (filteredSeedCombos.length === 0) return;
    let newSavedCount = 0;
    filteredSeedCombos.forEach((comboObj) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === comboObj.fullPhrase.toUpperCase() && item.value === comboObj.totalValue
      );
      if (!isSaved) {
        handleSaveSeedCombo(comboObj);
        newSavedCount++;
      }
    });
    setSavedToastMessage(
      newSavedCount > 0
        ? `Αποθηκεύτηκαν επιτυχώς ${newSavedCount} νέοι συνδυασμοί-κλειδιά στο Αρχείο!`
        : `Όλοι οι συνδυασμοί είναι ήδη αποθηκευμένοι στο Αρχείο.`
    );
    setTimeout(() => setSavedToastMessage(null), 3500);
  };

  const handleTriggerGuideWordSearch = () => {
    if (!inputText.trim()) {
      setSavedToastMessage("Παρακαλώ εισαγάγετε ή επικολλήστε πρώτα κείμενο στο επάνω πλαίσιο.");
      setTimeout(() => setSavedToastMessage(null), 3000);
      return;
    }
    if (!customSeedPhrase.trim()) {
      setSavedToastMessage("Παρακαλώ πληκτρολογήστε μία Λέξη-Οδηγό στο φωτεινό μπλε πεδίο.");
      setTimeout(() => setSavedToastMessage(null), 3000);
      return;
    }
    setViewMode("seed-combos");
    setSavedToastMessage(
      seedCombos.length > 0
        ? `✨ Βρέθηκαν ${seedCombos.length} συνδυασμοί της λέξης «${customSeedEval.text}» (${customSeedEval.value}) με λέξεις του κειμένου!`
        : `Απαιτούμενο υπόλοιπο από το κείμενο: ${customSeedNeededValue} (${customSeedTarget} - ${customSeedEval.value}). Δοκιμάστε άλλον στόχο ή ενεργοποιήστε περισσότερες λέξεις (+2λ, +3λ, +4λ).`
    );
    setTimeout(() => setSavedToastMessage(null), 4000);

    setTimeout(() => {
      const el = document.getElementById("seed-combos-results-container");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleToggleWordCount = (count: number) => {
    setComboWordCounts((prev) => {
      if (prev.includes(count)) {
        const next = prev.filter((c) => c !== count);
        return next.length > 0 ? next : [count]; // Keep at least one
      } else {
        return [...prev, count].sort((a, b) => a - b);
      }
    });
  };

  const handleSetExactComboLength = (count: number) => {
    setComboWordCounts([count]);
    setComboFilterLength(count);
  };

  const handleSetAllComboLengths = () => {
    setComboWordCounts([2, 3, 4, 5, 6]);
    setComboFilterLength("all");
  };

  const handleSaveAnywhereCombo = (comboObj: WordCombinationMatch) => {
    const greekNum = numberToGreekNumeral(comboObj.value);
    onSaveItem({
      text: comboObj.phrase,
      normalized: comboObj.phrase.toUpperCase(),
      value: comboObj.value,
      root: comboObj.root,
      greekNumeral: greekNum || `${comboObj.value}`,
      isPhrase: true,
      wordCount: comboObj.wordCount,
      sourceText: PRESET_TEXTS.find((p) => p.id === selectedPresetId)?.title || "Κείμενο Αναζήτησης",
      notes: `Ελεύθερος συνδυασμός ${comboObj.wordCount} λέξεων (${comboObj.isUniqueMode ? "Μοναδικές" : "Κείμενο"}): ${comboObj.words.map((w) => `${w.rawWord}(${w.value})`).join(" + ")} = ${comboObj.value}`,
      category: "Συνδυασμός Λέξεων Κειμένου",
    });
  };

  const [savedToastMessage, setSavedToastMessage] = useState<string | null>(null);

  // Bulk save handlers
  const handleSaveAllAnywhereCombos = () => {
    if (filteredAnywhereCombos.length === 0) return;
    let newSavedCount = 0;
    filteredAnywhereCombos.forEach((comboObj) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === comboObj.phrase.toUpperCase() && item.value === comboObj.value
      );
      if (!isSaved) {
        handleSaveAnywhereCombo(comboObj);
        newSavedCount++;
      }
    });
    setSavedToastMessage(
      newSavedCount > 0
        ? `Αποθηκεύτηκαν επιτυχώς ${newSavedCount} νέοι συνδυασμοί στο Αρχείο!`
        : `Όλοι οι ${filteredAnywhereCombos.length} συνδυασμοί είναι ήδη αποθηκευμένοι στο Αρχείο.`
    );
    setTimeout(() => setSavedToastMessage(null), 3500);
  };

  const handleSaveAllSingleMatches = () => {
    if (activeSingleMatches.length === 0) return;
    let newSavedCount = 0;
    activeSingleMatches.forEach((wordObj) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === wordObj.rawWord.toUpperCase() && item.value === wordObj.value
      );
      if (!isSaved) {
        handleSaveWordMatch(wordObj);
        newSavedCount++;
      }
    });
    setSavedToastMessage(
      newSavedCount > 0
        ? `Αποθηκεύτηκαν επιτυχώς ${newSavedCount} νέες λέξεις στο Αρχείο!`
        : `Όλες οι λέξεις είναι ήδη αποθηκευμένες στο Αρχείο.`
    );
    setTimeout(() => setSavedToastMessage(null), 3500);
  };

  const handleSaveAllPhraseMatches = () => {
    if (activePhraseMatches.length === 0) return;
    let newSavedCount = 0;
    activePhraseMatches.forEach((phraseObj) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === phraseObj.phrase.toUpperCase() && item.value === phraseObj.value
      );
      if (!isSaved) {
        handleSavePhraseMatch(phraseObj);
        newSavedCount++;
      }
    });
    setSavedToastMessage(
      newSavedCount > 0
        ? `Αποθηκεύτηκαν επιτυχώς ${newSavedCount} νέοι συνδυασμοί φράσεων στο Αρχείο!`
        : `Όλοι οι συνδυασμοί φράσεων είναι ήδη αποθηκευμένοι στο Αρχείο.`
    );
    setTimeout(() => setSavedToastMessage(null), 3500);
  };

  const handleSaveAllTotalMatches = () => {
    if (totalFoundMatches === 0) return;
    let newSavedCount = 0;
    activeSingleMatches.forEach((wordObj) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === wordObj.rawWord.toUpperCase() && item.value === wordObj.value
      );
      if (!isSaved) {
        handleSaveWordMatch(wordObj);
        newSavedCount++;
      }
    });
    activePhraseMatches.forEach((phraseObj) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === phraseObj.phrase.toUpperCase() && item.value === phraseObj.value
      );
      if (!isSaved) {
        handleSavePhraseMatch(phraseObj);
        newSavedCount++;
      }
    });
    setSavedToastMessage(
      newSavedCount > 0
        ? `Αποθηκεύτηκαν επιτυχώς ${newSavedCount} νέα ευρήματα (λέξεις & φράσεις) στον Θησαυρό!`
        : `Όλα τα ${totalFoundMatches} ευρήματα είναι ήδη αποθηκευμένα στον Θησαυρό.`
    );
    setTimeout(() => setSavedToastMessage(null), 3500);
  };

  // Bulk Save of ALL text words into the Archive / Treasure
  const handleSaveAllTextWords = (mode: "unique" | "all" = "unique") => {
    if (!analysis.words.length) {
      setSavedToastMessage("Δεν υπάρχουν λέξεις στο κείμενο προς αποθήκευση.");
      setTimeout(() => setSavedToastMessage(null), 3000);
      return;
    }

    let wordsToSave: WordIsopsephy[] = [];
    if (mode === "unique") {
      const seen = new Set<string>();
      for (const w of analysis.words) {
        const key = w.normalizedWord;
        if (!seen.has(key)) {
          seen.add(key);
          wordsToSave.push(w);
        }
      }
    } else {
      wordsToSave = analysis.words;
    }

    let newSavedCount = 0;
    wordsToSave.forEach((w) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === w.rawWord.toUpperCase() && item.value === w.value
      );
      if (!isSaved) {
        handleSaveWordMatch(w);
        newSavedCount++;
      }
    });

    setSavedToastMessage(
      newSavedCount > 0
        ? `✨ Αποθηκεύτηκαν επιτυχώς ${newSavedCount} νέες λέξεις στον Θησαυρό Λεξαρίθμων!`
        : `Όλες οι ${wordsToSave.length} λέξεις υπάρχουν ήδη αποθηκευμένες στον Θησαυρό.`
    );
    setTimeout(() => setSavedToastMessage(null), 3500);
  };

  // Sentence-level analysis (Clauses ending in . ; ! ? · :)
  const sentences = useMemo(() => {
    return extractSentencesWithIsopsephy(inputText);
  }, [inputText]);

  const filteredSentences = useMemo(() => {
    const targetVal = sentenceTarget.trim() ? parseInt(sentenceTarget.trim(), 10) : null;
    const q = sentenceSearchQuery.trim().toLowerCase();

    const filtered = sentences.filter((s) => {
      if (targetVal !== null && s.value !== targetVal) return false;
      if (sentenceRootFilter !== "all" && s.root !== sentenceRootFilter) return false;
      if (s.wordCount < sentenceMinWords || s.wordCount > sentenceMaxWords) return false;
      if (q) {
        const textMatch = s.text.toLowerCase().includes(q);
        const numMatch = s.value.toString().includes(q);
        if (!textMatch && !numMatch) return false;
      }
      return true;
    });

    // Sorting
    return [...filtered].sort((a, b) => {
      if (sentenceSortOption === "val_desc") return b.value - a.value;
      if (sentenceSortOption === "val_asc") return a.value - b.value;
      if (sentenceSortOption === "words_desc") return b.wordCount - a.wordCount;
      if (sentenceSortOption === "root_asc") return a.root - b.root;
      return a.sentenceIndex - b.sentenceIndex;
    });
  }, [sentences, sentenceTarget, sentenceSearchQuery, sentenceMinWords, sentenceMaxWords, sentenceRootFilter, sentenceSortOption]);

  const handleSaveSentence = (sentenceObj: SentenceIsopsephyMatch) => {
    const greekNum = numberToGreekNumeral(sentenceObj.value);
    onSaveItem({
      text: sentenceObj.text,
      normalized: sentenceObj.normalizedText,
      value: sentenceObj.value,
      root: sentenceObj.root,
      greekNumeral: greekNum || `${sentenceObj.value}`,
      isPhrase: true,
      wordCount: sentenceObj.wordCount,
      sourceText: PRESET_TEXTS.find((p) => p.id === selectedPresetId)?.title || "Κείμενο Αναζήτησης",
      notes: `Πρόταση #${sentenceObj.sentenceIndex} (${sentenceObj.wordCount} λέξεις, ${sentenceObj.charCount} γράμματα): ${sentenceObj.words.slice(0, 6).map(w => `${w.rawWord}(${w.value})`).join(" + ")}${sentenceObj.words.length > 6 ? " + ..." : ""} = ${sentenceObj.value}`,
      category: "Πρόταση / Φράση Κειμένου",
    });
  };

  const handleSaveAllSentences = () => {
    if (filteredSentences.length === 0) return;
    let newSavedCount = 0;
    filteredSentences.forEach((sentenceObj) => {
      const isSaved = savedItems.some(
        (item) => item.text.trim().toUpperCase() === sentenceObj.text.toUpperCase() && item.value === sentenceObj.value
      );
      if (!isSaved) {
        handleSaveSentence(sentenceObj);
        newSavedCount++;
      }
    });
    setSavedToastMessage(
      newSavedCount > 0
        ? `✨ Αποθηκεύτηκαν επιτυχώς ${newSavedCount} νέες προτάσεις στον Θησαυρό!`
        : `Όλες οι ${filteredSentences.length} προτάσεις είναι ήδη αποθηκευμένες στον Θησαυρό.`
    );
    setTimeout(() => setSavedToastMessage(null), 3500);
  };


  // Set of indices for selected combination
  const selectedComboIndices = useMemo(() => {
    if (!selectedAnywhereCombo) return new Set<number>();
    return new Set<number>(selectedAnywhereCombo.indices);
  }, [selectedAnywhereCombo]);

  const selectedComboNormalizedSet = useMemo(() => {
    if (!selectedAnywhereCombo) return new Set<string>();
    return new Set<string>(selectedAnywhereCombo.words.map((w) => w.normalizedWord));
  }, [selectedAnywhereCombo]);

  // Set of indices for selected seed combination
  const selectedSeedComboIndices = useMemo(() => {
    if (!selectedSeedCombo) return new Set<number>();
    return new Set<number>(selectedSeedCombo.indices);
  }, [selectedSeedCombo]);

  const selectedSeedComboNormalizedSet = useMemo(() => {
    if (!selectedSeedCombo) return new Set<string>();
    return new Set<string>(selectedSeedCombo.textWords.map((w) => w.normalizedWord));
  }, [selectedSeedCombo]);

  // Set of word indices that match single word target or search query
  const singleMatchIndices = useMemo(() => {
    const indices = new Set<number>();
    for (const w of activeSingleMatches) {
      if (w.indexInText !== undefined) {
        indices.add(w.indexInText);
      }
    }
    return indices;
  }, [activeSingleMatches]);

  // Map of word index -> Array of matching phrases that cover this word
  const phraseMatchWordMap = useMemo(() => {
    const map = new Map<number, PhraseMatch[]>();
    for (const pm of activePhraseMatches) {
      for (let idx = pm.startIndex; idx <= pm.endIndex; idx++) {
        const list = map.get(idx) || [];
        list.push(pm);
        map.set(idx, list);
      }
    }
    return map;
  }, [activePhraseMatches]);

  // Lexicon items array
  const lexiconList = useMemo(() => {
    const items = Array.from(analysis.uniqueWordsMap.entries()).map(([norm, data]) => ({
      normalized: norm,
      raw: data.raw,
      count: data.count,
      value: data.value,
      root: data.root,
    }));

    // Filter by search
    const filtered = items.filter(
      (item) =>
        item.raw.toLowerCase().includes(lexiconSearch.toLowerCase()) ||
        item.normalized.toLowerCase().includes(lexiconSearch.toLowerCase()) ||
        item.value.toString().includes(lexiconSearch)
    );

    // Sort
    if (lexiconSort === "freq") {
      return filtered.sort((a, b) => b.count - a.count || b.value - a.value);
    } else if (lexiconSort === "alpha") {
      return filtered.sort((a, b) => a.normalized.localeCompare(b.normalized, "el"));
    } else if (lexiconSort === "val-desc") {
      return filtered.sort((a, b) => b.value - a.value);
    } else {
      return filtered.sort((a, b) => a.value - b.value);
    }
  }, [analysis.uniqueWordsMap, lexiconSearch, lexiconSort]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181512] border border-[#2d251e] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
            <span>Αναζήτηση & Ανάλυση Μεγάλων Κειμένων</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#2a2219] text-[#c89b3c] border border-[#4a3a29] font-mono">
              Στόχοι & Συνδυασμοί 2-6 Λέξεων
            </span>
          </h2>
          <p className="text-xs text-[#a69680] mt-0.5 font-serif">
            Εκτενής ανάλυση κλασικών κειμένων: Διαδραστική προβολή ανά σειρά, υπολογισμός λεξαρίθμων και αυτόματο μαρκάρισμα στόχων.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-[#12100e] p-2 rounded-xl border border-[#2d251e] self-start md:self-auto">
          <BookOpen className="w-4 h-4 text-[#c89b3c]" />
          <label htmlFor="select-preset-text" className="text-xs text-[#8c7e6c] font-serif whitespace-nowrap">
            Έτοιμα Κείμενα:
          </label>
          <select
            id="select-preset-text"
            value={selectedPresetId}
            onChange={handleSelectPreset}
            className="bg-[#1c1813] border border-[#3d3224] rounded-lg px-2.5 py-1 text-xs font-serif text-[#f5ecd8] focus:border-[#c89b3c] outline-none cursor-pointer max-w-[230px] truncate"
          >
            {PRESET_TEXTS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Large Textarea Area for Full Text Input & Yellow Highlight Viewer */}
      <div className="rounded-2xl bg-[#161310] border border-[#2d251e] p-5 space-y-4 shadow-xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="polytonic-textarea-input" className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#c89b3c]" />
              <span>Κείμενο προς Ανάλυση & Αναζήτηση</span>
            </label>

            {/* Mode Switcher: Edit vs Yellow Highlight View */}
            <div className="flex items-center bg-[#0d0c0a] p-1 rounded-lg border border-[#2d241a] ml-1">
              <button
                type="button"
                onClick={() => setTopTextViewMode("edit")}
                className={`px-2.5 py-1 rounded text-xs font-serif transition-all ${
                  topTextViewMode === "edit"
                    ? "bg-[#282015] text-[#f5ecd8] font-bold border border-[#4a3924]"
                    : "text-[#8c7e6c] hover:text-[#e8dfd1]"
                }`}
              >
                ✍️ Επεξεργασία
              </button>
              <button
                type="button"
                onClick={() => setTopTextViewMode("highlighted")}
                className={`px-2.5 py-1 rounded text-xs font-serif transition-all flex items-center gap-1.5 ${
                  topTextViewMode === "highlighted"
                    ? "bg-purple-600 text-white font-extrabold shadow-md shadow-purple-600/30"
                    : "text-purple-300 hover:text-white"
                }`}
              >
                <span>🟣 Μωβ Μαρκάρισμα</span>
                {totalFoundMatches > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    topTextViewMode === "highlighted" ? "bg-purple-950 text-white" : "bg-purple-600 text-white"
                  }`}>
                    {totalFoundMatches}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8c7e6c]">
            <span className="px-2 py-0.5 rounded bg-[#100e0c] border border-[#261f18] text-[#d6c7b2]">
              {analysis.stats.totalWords} λέξεις
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-[#100e0c] border border-[#261f18] text-[#d6c7b2]">
              {analysis.stats.totalChars} χαρακτήρες
            </span>

            <button
              onClick={() => setIsExpandedTextarea(!isExpandedTextarea)}
              className="p-1.5 rounded-lg bg-[#201a14] hover:bg-[#2e251c] text-[#e6c670] border border-[#3a2d1e] transition-colors ml-1"
              title={isExpandedTextarea ? "Σύμπτυξη πεδίου" : "Μεγέθυνση πεδίου κειμένου"}
            >
              {isExpandedTextarea ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setInputText("")}
              className="p-1.5 rounded-lg bg-[#201a14] hover:bg-red-950/50 text-[#8c7e6c] hover:text-red-300 border border-[#3a2d1e] hover:border-red-800/50 transition-colors"
              title="Εκκαθάριση κειμένου"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area Bottom Quick Actions: Save All Words & Switch to Sentences */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-[#100e0b] rounded-xl border border-[#2a2118]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-serif text-[#a69680] flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Αποθήκευση στον Θησαυρό:</span>
            </span>

            <button
              type="button"
              onClick={() => handleSaveAllTextWords("unique")}
              disabled={analysis.words.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241c12] hover:bg-[#382b1c] disabled:opacity-40 disabled:cursor-not-allowed text-[#e6c670] hover:text-amber-200 border border-[#4a3a25] text-xs font-serif font-bold transition-all shadow-sm"
              title="Αποθήκευση όλων των μοναδικών λέξεων του κειμένου με τον αντίστοιχο λεξάριθμό τους στον Θησαυρό"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Όλες οι Μοναδικές Λέξεις ({analysis.uniqueWordsMap.size})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveAllTextWords("all")}
              disabled={analysis.words.length === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#191510] hover:bg-[#282017] disabled:opacity-40 disabled:cursor-not-allowed text-[#bfa98e] hover:text-[#f5ecd8] border border-[#332619] text-xs font-serif transition-all"
              title="Αποθήκευση όλων των εμφανίσεων λέξεων στον Θησαυρό"
            >
              <span>Όλες οι Εμφανίσεις ({analysis.words.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setViewMode("sentences");
                setTimeout(() => {
                  const el = document.getElementById("sentences-section-anchor");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 text-xs font-serif font-bold transition-all"
            >
              <Quote className="w-3.5 h-3.5 text-amber-400" />
              <span>Ανάλυση {sentences.length} Προτάσεων (μέχρι .)</span>
            </button>
          </div>
        </div>

        {/* Text Viewer or Textarea */}
        {topTextViewMode === "edit" ? (
          <div className="relative">
            <textarea
              id="polytonic-textarea-input"
              value={inputText}
              onChange={(e) => setInputText(cleanAndNormalizePolytonic(e.target.value))}
              rows={isExpandedTextarea ? 18 : 8}
              placeholder="Επικολλήστε ή πληκτρολογήστε ολόκληρο αρχαίο ή νεότερο ελληνικό κείμενο, κεφάλαια, ψαλμούς ή παραγράφους..."
              className="w-full p-4 sm:p-5 bg-[#0e0c0a] border border-[#382d20] focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c]/25 rounded-xl text-sm sm:text-base font-serif text-[#f5ecd8] placeholder-[#5c5144] resize-y outline-none transition-all leading-relaxed gold-scrollbar"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-sans text-[#706251] bg-[#14120e]/80 px-2 py-0.5 rounded border border-[#2d2419] pointer-events-none">
              Σύρετε τη δεξιά κάτω γωνία για αυξομείωση ύψους
            </div>
          </div>
        ) : (
          /* Purple Highlighted Full Text Box */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-serif px-1 text-[#d6c7b2]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                <span>
                  <strong>Μωβ Μαρκάρισμα Στόχων (Άσπρα Γράμματα):</strong>{" "}
                  {wordQuery && <span className="text-purple-300">Λέξη «{wordQuery}» • </span>}
                  {singleWordTarget && <span className="text-purple-300">Στόχος Λέξης = {singleWordTarget} • </span>}
                  {phraseTarget && <span className="text-purple-300">Στόχος Φράσης = {phraseTarget} ({phraseLengthMin}-{phraseLengthMax}λ)</span>}
                  {!wordQuery && !singleWordTarget && !phraseTarget && "Ορίστε στόχους παρακάτω για αυτόματο μαρκάρισμα"}
                </span>
              </div>
              <span className="font-mono text-purple-300 font-bold bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded">
                {totalFoundMatches} ευρέσεις
              </span>
            </div>

            <div className={`p-4 sm:p-5 bg-[#0e0c0a] rounded-xl border border-[#382d20] leading-loose text-base sm:text-lg font-serif text-[#e8dfd1] overflow-y-auto gold-scrollbar ${
              isExpandedTextarea ? "max-h-[500px]" : "max-h-[260px]"
            }`}>
              {analysis.words.length > 0 ? (
                <div className="flex flex-wrap gap-x-2 gap-y-2.5">
                  {analysis.words.map((w, idx) => {
                    const isSingleMatch = singleMatchIndices.has(w.indexInText!);
                    const phrases = phraseMatchWordMap.get(w.indexInText!) || [];
                    const isPhraseMatch = phrases.length > 0;
                    const isTargetMatch = isSingleMatch || isPhraseMatch;
                    const isSelected = selectedWordObj?.indexInText === w.indexInText;

                    return (
                      <span
                        key={idx}
                        onClick={() => setSelectedWordObj(w)}
                        className={`cursor-pointer transition-all inline-flex items-center gap-1.5 rounded ${
                          isTargetMatch
                            ? "bg-purple-600 text-white font-black px-2 py-0.5 rounded shadow-[0_0_12px_rgba(168,85,247,0.75)] ring-2 ring-purple-300 scale-105"
                            : isSelected
                            ? "bg-[#c89b3c] text-black font-bold px-1.5 py-0.5 rounded"
                            : "hover:bg-[#251e17] hover:text-[#f5ecd8] px-1 py-0.5"
                        }`}
                        title={`Λέξη #${idx + 1}: ${w.rawWord} (Ισοψηφία: ${w.value}, Πυθμένας: ${w.root})${
                          isSingleMatch ? " - ΣΤΟΧΟΣ ΛΕΞΗΣ" : ""
                        }${isPhraseMatch ? ` - ΜΕΡΟΣ ΣΥΝΔΥΑΣΜΟΥ ΦΡΑΣΗΣ (${phrases[0].value})` : ""}`}
                      >
                        <span className={isTargetMatch ? "text-white font-black" : ""}>{w.rawWord}</span>
                        {isTargetMatch && (
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-purple-950 text-white font-bold border border-purple-400/40">
                            {w.value}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#8c7e6c] italic">Δεν υπάρχει κείμενο προς προβολή.</p>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            HERO GUIDE-WORD PANEL: BRIGHT BLUE GLOWING INPUT & ADJACENT FIND BUTTON
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#051424] via-[#0b243d] to-[#051424] border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.45)] ring-2 ring-cyan-500/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-cyan-500/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950/90 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Key className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-serif font-black text-cyan-100 flex items-center gap-2 flex-wrap">
                  <span>🌟 Λέξη-Οδηγός & Αυτόματη Συμπλήρωση από το Κείμενο</span>
                  {seedCombos.length > 0 && (
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500 text-black font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                      {seedCombos.length} Βρέθηκαν
                    </span>
                  )}
                </h3>
                <p className="text-xs text-cyan-200/80 font-sans">
                  Πληκτρολογήστε τη δική σας λέξη-οδηγό στο μπλε φωτεινό πεδίο και πατήστε το κουμπί για να αναζητήσει αυτόματα συνδυασμούς λέξεων από το κείμενο που περιέχουν τη λέξη σας και αθροίζουν στον επιθυμητό στόχο.
                </p>
              </div>
            </div>

            {seedCombos.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setViewMode("seed-combos");
                  setTimeout(() => {
                    const el = document.getElementById("seed-combos-results-container");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 50);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-serif text-xs font-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer self-start md:self-auto"
              >
                <span>Προβολή {seedCombos.length} Συνδυασμών</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Guide Word Input Row with glowing bright blue border and adjacent action button */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-end">
            
            {/* Guide Word Input with glowing blue border */}
            <div className="lg:col-span-7 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-cyan-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Δική μου Λέξη-Οδηγός (Λέξη ή Φράση-Κλειδί):</span>
                </label>
                {customSeedEval.value > 0 && (
                  <span
                    key={`seed-eval-${customSeedEval.value}-${customSeedEval.text}`}
                    className="text-xs font-mono font-bold text-amber-300 bg-[#06121f] px-2.5 py-0.5 rounded-lg border border-amber-500/50 shadow-sm animate-lexarithm-result animate-badge-glow"
                  >
                    {customSeedEval.text} = <strong className="text-amber-200">{customSeedEval.value}</strong> ({numberToGreekNumeral(customSeedEval.value)})
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={customSeedPhrase}
                  onChange={(e) => setCustomSeedPhrase(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTriggerGuideWordSearch();
                    }
                  }}
                  placeholder="π.χ. ΙΩΑΝΝΗΣ, ΛΑΥΡΕΙΟΝ, ΑΓΑΠΗ, ΦΩΣ, ΣΟΦΙΑ..."
                  className="w-full px-4 py-3 bg-[#030c17] border-2 border-cyan-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/40 rounded-xl text-base sm:text-lg font-serif font-black text-cyan-50 placeholder-cyan-600/60 shadow-[0_0_18px_rgba(6,182,212,0.45)] outline-none transition-all"
                />
                {customSeedPhrase && (
                  <button
                    type="button"
                    onClick={() => setCustomSeedPhrase("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-white p-1 rounded-md"
                    title="Καθαρισμός"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Guide Word Presets */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[10px] text-cyan-400/80 font-serif mr-1">Προτάσεις:</span>
                {[
                  "ΙΩΑΝΝΗΣ",
                  "ΛΑΥΡΕΙΟΝ",
                  "ΑΓΑΠΗ",
                  "ΦΩΣ",
                  "ΛΟΓΟΣ",
                  "Η ΑΛΗΘΕΙΑ",
                  "ΘΕΟΣ",
                  "ΣΟΦΙΑ",
                ].map((presetSeed) => (
                  <button
                    key={presetSeed}
                    type="button"
                    onClick={() => setCustomSeedPhrase(presetSeed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-serif transition-all ${
                      customSeedPhrase.trim().toUpperCase() === presetSeed
                        ? "bg-cyan-500 text-black font-black shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                        : "bg-[#091e33] hover:bg-[#0e2c4a] text-cyan-200 border border-cyan-500/30"
                    }`}
                  >
                    {presetSeed}
                  </button>
                ))}
              </div>
            </div>

            {/* Adjacent Action Button */}
            <div className="lg:col-span-5 flex flex-col justify-end">
              <button
                type="button"
                onClick={handleTriggerGuideWordSearch}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white font-serif font-black text-sm sm:text-base border border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.65)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] transition-all cursor-pointer active:scale-95 text-center"
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                <span>✨ Συμπλήρωση από Κείμενο & Εύρεση Συνδυασμών</span>
              </button>
            </div>

          </div>

          {/* Target Number & Equation Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-2 border-t border-cyan-500/20 items-center">
            
            {/* Target Input */}
            <div className="md:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-cyan-200">
                  Στόχος Συνολικού Λεξαρίθμου:
                </label>
                {customSeedTarget && (
                  <span className="text-xs font-mono text-amber-300">
                    {numberToGreekNumeral(customSeedTargetNum)}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={customSeedTarget}
                  onChange={(e) => setCustomSeedTarget(e.target.value)}
                  placeholder="π.χ. 2368, 1480, 888..."
                  className="w-full px-3.5 py-2 bg-[#040e1a] border border-cyan-500/50 focus:border-cyan-300 rounded-lg text-sm font-mono font-bold text-amber-300 outline-none"
                />
              </div>

              {/* Quick Target Presets */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {[
                  { label: "2368 (Ι.Χ.)", val: "2368" },
                  { label: "1480 (Χριστός)", val: "1480" },
                  { label: "888 (Ιησούς)", val: "888" },
                  { label: "3168 (Κύριος)", val: "3168" },
                  { label: "666", val: "666" },
                  { label: "1572", val: "1572" },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setCustomSeedTarget(preset.val)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                      customSeedTarget === preset.val
                        ? "bg-cyan-500 text-black font-black"
                        : "bg-[#081a2c] hover:bg-[#0f2c4a] text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Word Count Toggles & Equation breakdown */}
            <div className="md:col-span-7 space-y-2">
              <div className="p-3 bg-[#030b14] rounded-xl border border-cyan-500/40 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-serif text-cyan-200">
                  <span>Αριθμός Συμπληρωματικών Λέξεων:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((count) => {
                      const isChecked = seedTextWordCounts.includes(count);
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleToggleSeedWordCount(count)}
                          className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                            isChecked
                              ? "bg-cyan-500 text-black shadow-sm"
                              : "bg-[#091b2c] hover:bg-[#112a45] text-cyan-300 border border-cyan-500/30"
                          }`}
                          title={`Συνδυασμός με +${count} λέξεις κειμένου`}
                        >
                          +{count}λ
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mathematical Equation Overview */}
                <div className="text-[11px] font-mono flex flex-wrap items-center gap-1.5 text-cyan-200/90 pt-1 border-t border-cyan-500/20">
                  <span className="text-cyan-300">
                    Οδηγός: <strong>«{customSeedPhrase || "..."}» ({customSeedEval.value})</strong>
                  </span>
                  <span>+</span>
                  <span className="text-amber-300">
                    Υπόλοιπο Κειμένου: <strong>({customSeedNeededValue})</strong>
                  </span>
                  <span>=</span>
                  <span className="text-white font-bold bg-cyan-900/60 px-1.5 py-0.5 rounded border border-cyan-400/40">
                    Στόχος: {customSeedTarget || 0}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            ΕΠΕΞΗΓΗΣΗ ΛΕΞΑΡΙΘΜΟΥ & ΣΥΝΟΛΙΚΟ ΑΘΡΟΙΣΜΑ 27 ΓΡΑΜΜΑΤΩΝ (4995)
            ========================================================================= */}
        <div className="rounded-xl bg-[#12100e] border border-[#3a2e20] overflow-hidden transition-all">
          <div
            onClick={() => setShowExplanationSection(!showExplanationSection)}
            className="p-3.5 sm:p-4 bg-[#181410] border-b border-[#2d2318] flex items-center justify-between cursor-pointer hover:bg-[#201a14] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#c89b3c]" />
              <div>
                <h3 className="text-xs sm:text-sm font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
                  <span>Επεξήγηση Λεξαρίθμου & Αριθμητικές Αξίες Γραμμάτων Επιλεγμένου Κειμένου</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#282015] text-[#e6c670] border border-[#4a3924]">
                    Σύνολο 27 Γραμμάτων = 4.995
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8c7e6c] font-serif hidden sm:inline">
                {showExplanationSection ? "Απόκρυψη επεξήγησης" : "Προβολή επεξήγησης"}
              </span>
              {showExplanationSection ? (
                <ChevronUp className="w-4 h-4 text-[#c89b3c]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#c89b3c]" />
              )}
            </div>
          </div>

          {showExplanationSection && (
            <div className="p-4 sm:p-5 space-y-5 text-xs font-serif leading-relaxed text-[#c4b5a2] animate-fadeIn">
              
              {/* Core Guide Explanation */}
              <div className="p-4 rounded-xl bg-[#161310] border border-[#2b2219] space-y-2">
                <h4 className="text-sm font-serif font-bold text-[#e6c670] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#c89b3c]" />
                  <span>Η Αρχή της Ισοψηφίας & το Πλήρες Ιωνικό Σύστημα των 27 Γραμμάτων</span>
                </h4>
                <p>
                  Στην αρχαία ελληνική επιστήμη και φιλοσοφία, η <strong>Ισοψηφία</strong> (υπολογισμός λεξαρίθμων) βασίζεται στην αντιστοίχιση κάθε γράμματος του αλφαβήτου σε μία ακριβή αριθμητική αξία. Το σύστημα της <strong>Ιωνικής Αρίθμησης</strong> συγκροτείται από ακριβώς <strong>27 ιερά ψηφία</strong>, χωρισμένα σε τρεις τέλειες εννεάδες:
                </p>

                {/* 3 Enneads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[#0e0c0a] border border-[#261f18] space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#f5ecd8]">
                      <span>9 Μονάδες (1 - 9)</span>
                      <span className="text-[#e6c670] font-mono">Σ = 45</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#8c7e6c]">
                      Α=1, Β=2, Γ=3, Δ=4, Ε=5, <strong>Ϛ/Ϝ=6</strong>, Ζ=7, Η=8, Θ=9
                    </p>
                    <div className="text-[10px] text-[#706251]">
                      1+2+3+4+5+6+7+8+9 = <strong>45</strong> (Τετρακτύς & Πυθμένας: 9)
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0e0c0a] border border-[#261f18] space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#f5ecd8]">
                      <span>9 Δεκάδες (10 - 90)</span>
                      <span className="text-[#e6c670] font-mono">Σ = 450</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#8c7e6c]">
                      Ι=10, Κ=20, Λ=30, Μ=40, Ν=50, Ξ=60, Ο=70, Π=80, <strong>Ϟ=90</strong>
                    </p>
                    <div className="text-[10px] text-[#706251]">
                      10+20+...+90 = <strong>450</strong> (10 × 45)
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0e0c0a] border border-[#261f18] space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#f5ecd8]">
                      <span>9 Εκατοντάδες (100 - 900)</span>
                      <span className="text-[#e6c670] font-mono">Σ = 4.500</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#8c7e6c]">
                      Ρ=100, Σ=200, Τ=300, Υ=400, Φ=500, Χ=600, Ψ=700, Ω=800, <strong>Ϡ=900</strong>
                    </p>
                    <div className="text-[10px] text-[#706251]">
                      100+200+...+900 = <strong>4.500</strong> (100 × 45)
                    </div>
                  </div>
                </div>

                {/* Grand Total Highlight */}
                <div className="p-3 rounded-lg bg-[#1a1510] border border-[#c89b3c]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-serif font-bold text-[#f5ecd8]">
                      Συνολικό Άθροισμα των 27 Γραμμάτων:
                    </span>
                    <span className="text-base font-mono font-bold text-[#e6c670]">
                      45 + 450 + 4.500 = 4.995
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#a69680]">
                    Ιωνικός: <strong className="text-[#e6c670]">͵δϡϟε´</strong> • Πυθμένας: 4+9+9+5 = 27 → <strong className="text-[#e6c670]">9</strong> (Ιερά Εννεάδα)
                  </div>
                </div>
              </div>

              {/* Letter Breakdown Table of the Selected / Input Text (Collapsible Button) */}
              <div className="space-y-2 pt-2 border-t border-[#261f18]">
                <button
                  type="button"
                  onClick={() => setShowLetterFrequencies((prev) => !prev)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#14110e] border border-[#2b2219] hover:border-[#c89b3c]/50 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Table className="w-3.5 h-3.5 text-[#c89b3c]" />
                    <span className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold group-hover:text-[#f5ecd8]">
                      Συχνότητες & Κατανομή Αριθμητικών Αξιών Γραμμάτων ({letterBreakdown.presentLetters.length} μοναδικά γράμματα)
                    </span>
                    <span className="text-[10px] font-mono text-[#8c7e6c] hidden sm:inline">
                      (Σύνολο: {letterBreakdown.textTotalLetters} χαρακτήρες)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-serif text-[#8c7e6c]">
                      {showLetterFrequencies ? "Απόκρυψη πίνακα" : "Προβολή πίνακα"}
                    </span>
                    {showLetterFrequencies ? (
                      <ChevronUp className="w-4 h-4 text-[#c89b3c]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#c89b3c]" />
                    )}
                  </div>
                </button>

                {showLetterFrequencies && (
                  <div className="pt-2 animate-fadeIn">
                    {letterBreakdown.presentLetters.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-[#2a2219] bg-[#0e0c0a]">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-[#181410] border-b border-[#2a2219] text-[#e6c670] font-serif text-[11px]">
                            <tr>
                              <th className="p-2.5">Γράμμα</th>
                              <th className="p-2.5">Όνομα & Κατηγορία</th>
                              <th className="p-2.5 text-center">Αξία (Ιωνικός)</th>
                              <th className="p-2.5 text-center">Εμφανίσεις</th>
                              <th className="p-2.5 text-center">Συνεισφορά στο Άθροισμα</th>
                              <th className="p-2.5 text-right">% του Λεξαρίθμου</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1e1812] text-[#d6c7b2]">
                            {letterBreakdown.presentLetters
                              .sort((a, b) => b.totalValue - a.totalValue)
                              .map((item) => (
                                <tr key={item.char} className="hover:bg-[#16120e] transition-colors">
                                  <td className="p-2.5 font-serif font-bold text-base text-[#f5ecd8]">
                                    {item.char}
                                  </td>
                                  <td className="p-2.5 font-serif text-[11px] text-[#a69680]">
                                    {item.name}{" "}
                                    <span className="text-[10px] text-[#706251]">
                                      ({item.category === "monas" ? "Μονάδα" : item.category === "dekas" ? "Δεκάδα" : "Εκατοντάδα"})
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-center font-serif text-[#e6c670]">
                                    <strong>{item.value}</strong>{" "}
                                    <span className="text-[10px] text-[#8c7e6c]">({item.greekNumeral})</span>
                                  </td>
                                  <td className="p-2.5 text-center text-[#f5ecd8]">
                                    {item.count} <span className="text-[10px] text-[#706251]">({item.percentageOfLetters.toFixed(1)}%)</span>
                                  </td>
                                  <td className="p-2.5 text-center font-bold text-[#e6c670]">
                                    {item.totalValue.toLocaleString("el-GR")}
                                  </td>
                                  <td className="p-2.5 text-right font-mono text-[#a69680]">
                                    {item.percentageOfSum.toFixed(1)}%
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                          <tfoot className="bg-[#181410] border-t border-[#2a2219] font-serif text-[#e6c670] font-bold">
                            <tr>
                              <td colSpan={3} className="p-2.5">
                                Συνολικό Άθροισμα Επιλεγμένου Κειμένου:
                              </td>
                              <td className="p-2.5 text-center font-mono">
                                {letterBreakdown.textTotalLetters}
                              </td>
                              <td className="p-2.5 text-center font-mono text-sm text-[#f5ecd8]">
                                {letterBreakdown.textTotalSum.toLocaleString("el-GR")}
                              </td>
                              <td className="p-2.5 text-right font-mono">100%</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs text-[#8c7e6c] italic p-3 bg-[#0e0c0a] rounded-lg">
                        Εισαγάγετε ελληνικό κείμενο στο παραπάνω πλαίσιο για να υπολογιστούν οι αριθμητικές αξίες των γραμμάτων του.
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* =========================================================================
            DEDICATED SEARCH & COMBINATION CONTROLS PANEL (2-6 WORDS)
           ========================================================================= */}
        <div className="pt-2 border-t border-[#261f18] space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-[#e6c670] uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Φίλτρα Αναζήτησης Λέξεων & Συνδυασμών (2 - 6 Λέξεις)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* 1. Word Search Field */}
            <div className="p-3.5 rounded-xl bg-[#12100d] border border-[#2d241a] space-y-2 relative">
              <div className="flex items-center justify-between">
                <label htmlFor="input-word-search" className="block text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>Αναζήτηση Λέξης</span>
                </label>
                {wordQuery && (
                  <button
                    onClick={() => setWordQuery("")}
                    className="text-[10px] text-[#8c7e6c] hover:text-[#e8dfd1]"
                    title="Καθαρισμός λέξης"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <input
                id="input-word-search"
                type="text"
                value={wordQuery}
                onChange={(e) => setWordQuery(e.target.value)}
                placeholder="π.χ. ΛΟΓΟΣ, ΘΕΟΣ, ΦΩΣ..."
                className="w-full px-3 py-2 bg-[#1a1611] border border-[#3a2f22] focus:border-[#c89b3c] rounded-lg text-sm font-serif text-[#f5ecd8] outline-none placeholder-[#5a4d3e]"
              />
              <p className="text-[10px] text-[#857766] font-sans leading-tight">
                Εντοπίζει και μαρκάρει αυτόματα κάθε εμφάνιση της λέξης στο κείμενο.
              </p>
            </div>

            {/* 2. Target Number for Single Word */}
            <div className="p-3.5 rounded-xl bg-[#12100d] border border-[#2d241a] space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="input-single-word-target" className="block text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>Στόχος Μεμονωμένης Λέξης</span>
                </label>
                {singleWordTarget && (
                  <button
                    onClick={() => setSingleWordTarget("")}
                    className="text-[10px] text-[#8c7e6c] hover:text-[#e8dfd1]"
                    title="Καθαρισμός στόχου"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="input-single-word-target"
                  type="number"
                  value={singleWordTarget}
                  onChange={(e) => setSingleWordTarget(e.target.value)}
                  placeholder="π.χ. 666, 888, 373..."
                  className="w-full px-3 py-2 bg-[#1a1611] border border-[#3a2f22] focus:border-[#c89b3c] rounded-lg text-sm font-mono text-[#f5ecd8] outline-none"
                />
                {singleWordTarget && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-serif text-[#c89b3c]">
                    {numberToGreekNumeral(parseInt(singleWordTarget, 10))}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#857766] font-sans leading-tight">
                Μαρκάρει όλες τις λέξεις με ακριβή λεξάριθμο ίσο με τον στόχο.
              </p>
            </div>

            {/* 3. Target Number for Phrase Combinations */}
            <div className="p-3.5 rounded-xl bg-[#12100d] border border-[#2d241a] space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="input-phrase-target" className="block text-xs font-serif font-bold text-[#e6c670] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>Στόχος Συνδυασμού Φράσεων</span>
                </label>
                {phraseTarget && (
                  <button
                    onClick={() => setPhraseTarget("")}
                    className="text-[10px] text-[#8c7e6c] hover:text-[#e8dfd1]"
                    title="Καθαρισμός στόχου φράσης"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="input-phrase-target"
                  type="number"
                  value={phraseTarget}
                  onChange={(e) => setPhraseTarget(e.target.value)}
                  placeholder="π.χ. 888, 1480, 2368..."
                  className="w-full px-3 py-2 bg-[#1a1611] border border-[#3a2f22] focus:border-[#c89b3c] rounded-lg text-sm font-mono text-[#f5ecd8] outline-none"
                />
                {phraseTarget && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-serif text-[#c89b3c]">
                    {numberToGreekNumeral(parseInt(phraseTarget, 10))}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#857766] font-sans leading-tight">
                Εντοπίζει διαδοχικές λέξεις (2 έως 6) που αθροίζουν στον στόχο.
              </p>
            </div>

            {/* 4. Definition of 2, 3, 4, 5, 6 words (N-grams) */}
            <div className="p-3.5 rounded-xl bg-[#12100d] border border-[#2d241a] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-[#e6c670]">
                  Ορισμός 2, 3, 4, 5 ή 6 Λέξεων
                </label>
                <span className="text-[11px] font-mono text-[#c89b3c] bg-[#1c1812] px-1.5 py-0.5 rounded border border-[#332616]">
                  {phraseLengthMin === phraseLengthMax ? `${phraseLengthMin} λέξεις` : `${phraseLengthMin}-${phraseLengthMax} λέξεις`}
                </span>
              </div>

              {/* Quick Preset Buttons for 2, 3, 4, 5, 6 words */}
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSetExactWordLength(num)}
                    className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                      phraseLengthMin === num && phraseLengthMax === num
                        ? "bg-[#c89b3c] text-[#12100d] shadow-sm shadow-[#c89b3c]/30"
                        : "bg-[#1f1a14] hover:bg-[#2b241c] text-[#d6c7b2] border border-[#382d20]"
                    }`}
                    title={`Ακριβώς ${num} λέξεις`}
                  >
                    {num}λ
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleSetWordRange(2, 6)}
                  className={`px-2 py-1 rounded text-[11px] font-sans transition-all ${
                    phraseLengthMin === 2 && phraseLengthMax === 6
                      ? "bg-[#c89b3c] text-[#12100d] font-bold"
                      : "bg-[#181410] hover:bg-[#241e17] text-[#9c8b77] border border-[#2d2419]"
                  }`}
                  title="Εύρος από 2 έως 6 λέξεις"
                >
                  2-6
                </button>
              </div>

              {/* Custom Min/Max dropdowns */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#8c7e6c]">
                <span>Ελάχ:</span>
                <select
                  value={phraseLengthMin}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setPhraseLengthMin(val);
                    if (val > phraseLengthMax) setPhraseLengthMax(val);
                  }}
                  className="bg-[#1a1611] border border-[#3a2f22] rounded px-1.5 py-0.5 text-xs text-[#f5ecd8] font-mono outline-none"
                >
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>

                <span className="ml-1">Μέγ:</span>
                <select
                  value={phraseLengthMax}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setPhraseLengthMax(val);
                    if (val < phraseLengthMin) setPhraseLengthMin(val);
                  }}
                  className="bg-[#1a1611] border border-[#3a2f22] rounded px-1.5 py-0.5 text-xs text-[#f5ecd8] font-mono outline-none"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Range filter row */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-[#110f0d] border border-[#241d16] text-xs text-[#8c7e6c]">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span className="font-serif text-[#d6c7b2]">Φίλτρο Εύρους Τιμών Λεξαρίθμου:</span>
              <input
                type="number"
                value={minRange}
                onChange={(e) => setMinRange(e.target.value)}
                placeholder="Ελάχ."
                className="w-20 px-2 py-1 bg-[#181410] border border-[#33291d] rounded text-xs font-mono text-[#f5ecd8] outline-none"
              />
              <span>έως</span>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(e.target.value)}
                placeholder="Μέγ."
                className="w-20 px-2 py-1 bg-[#181410] border border-[#33291d] rounded text-xs font-mono text-[#f5ecd8] outline-none"
              />
            </div>
            {(minRange || maxRange) && (
              <button
                onClick={() => { setMinRange(""); setMaxRange(""); }}
                className="text-[11px] text-[#c89b3c] hover:underline"
              >
                Καθαρισμός εύρους
              </button>
            )}
          </div>

          {/* =========================================================================
              DEDICATED ANYWHERE WORD COMBINATIONS PANEL (2, 3, 4, 5, 6 WORDS)
             ========================================================================= */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#17130f] via-[#1c1611] to-[#17130f] border border-[#c89b3c]/50 space-y-3.5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#c89b3c]/20 text-[#e6c670]">
                  <Boxes className="w-4 h-4 text-[#e6c670]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
                    <span>Ελεύθεροι Συνδυασμοί 2, 3, 4, 5 ή 6 Λέξεων (Ανεξαρτήτως Θέσης)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c89b3c] text-black font-black">
                      {anywhereCombos.length} Βρέθηκαν
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#8c7e6c] font-sans">
                    Εντοπίζει συνδυασμούς λέξεων από οποιοδήποτε σημείο του κειμένου που αθροίζουν στον επιλεγμένο λεξαριθμικό στόχο.
                  </p>
                </div>
              </div>

              {anywhereCombos.length > 0 && (
                <button
                  onClick={() => setViewMode("anywhere-combos")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c89b3c] hover:bg-[#dfb24e] text-black font-serif text-xs font-bold transition-all shadow-md"
                >
                  <span>Προβολή {anywhereCombos.length} Συνδυασμών</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Target Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-serif font-bold text-[#e6c670] flex items-center justify-between">
                  <span>Στόχος Λεξαρίθμου Συνδυασμού</span>
                  {comboTarget && (
                    <span className="text-[11px] font-serif text-[#c89b3c]">
                      {numberToGreekNumeral(comboTargetNum)}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={comboTarget}
                    onChange={(e) => setComboTarget(e.target.value)}
                    placeholder="π.χ. 2368, 888, 666..."
                    className="w-full px-3 py-2 bg-[#12100d] border border-[#3a2f22] focus:border-[#c89b3c] rounded-lg text-sm font-mono text-[#f5ecd8] outline-none"
                  />
                </div>
                {/* Quick Target Preset Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    { label: "2368", desc: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ" },
                    { label: "888", desc: "ΙΗΣΟΥΣ" },
                    { label: "1480", desc: "ΧΡΙΣΤΟΣ" },
                    { label: "666", desc: "ΛΑΥΡΕΙΟΝ" },
                    { label: "3168", desc: "ΚΥΡΙΟΣ ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ" },
                    { label: "1332", desc: "ΙΑΝΕΥΣ + ΤΕΛΙΑΝΟΣ" },
                    { label: "999", desc: "999" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setComboTarget(chip.label)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        comboTarget === chip.label
                          ? "bg-[#e6c670] text-black font-bold"
                          : "bg-[#1f1a14] hover:bg-[#2b241c] text-[#a69680] border border-[#33281c]"
                      }`}
                      title={chip.desc}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Count Selection (2, 3, 4, 5, 6 words) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-serif font-bold text-[#e6c670] flex items-center justify-between">
                  <span>Αριθμός Λέξεων Συνδυασμού</span>
                  <span className="text-[10px] font-mono text-[#8c7e6c]">
                    {comboWordCounts.sort((a,b)=>a-b).join(", ")} λέξεις
                  </span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {[2, 3, 4, 5, 6].map((num) => {
                    const isSelected = comboWordCounts.includes(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleToggleWordCount(num)}
                        className={`flex-1 min-w-[45px] py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                          isSelected
                            ? "bg-[#c89b3c] text-black shadow-sm"
                            : "bg-[#181410] hover:bg-[#251e17] text-[#9c8b77] border border-[#2d2419]"
                        }`}
                        title={`Ενεργοποίηση συνδυασμών ${num} λέξεων`}
                      >
                        {num}λ
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <button
                    type="button"
                    onClick={handleSetAllComboLengths}
                    className="text-[#c89b3c] hover:underline"
                  >
                    Όλοι οι συνδυασμοί (2-6)
                  </button>
                  <span className="text-[#6b5f4f]">Επιλέξτε 2, 3, 4, 5 ή 6 λέξεις</span>
                </div>
              </div>

              {/* Mode selection (Unique words vs All text occurrences) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-serif font-bold text-[#e6c670]">
                  Τρόπος Επεξεργασίας Λέξεων
                </label>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setComboMode("uniqueWords")}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all text-center ${
                      comboMode === "uniqueWords"
                        ? "bg-[#2b2216] text-[#e6c670] border border-[#c89b3c]/60 font-bold shadow-sm"
                        : "bg-[#14110e] text-[#8c7e6c] border border-[#261f18] hover:text-[#d6c7b2]"
                    }`}
                  >
                    Μοναδικές Λέξεις
                  </button>
                  <button
                    type="button"
                    onClick={() => setComboMode("allOccurrences")}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all text-center ${
                      comboMode === "allOccurrences"
                        ? "bg-[#2b2216] text-[#e6c670] border border-[#c89b3c]/60 font-bold shadow-sm"
                        : "bg-[#14110e] text-[#8c7e6c] border border-[#261f18] hover:text-[#d6c7b2]"
                    }`}
                  >
                    Όλες οι Θέσεις
                  </button>
                </div>
                <p className="text-[10px] text-[#857766] font-sans leading-tight pt-0.5">
                  {comboMode === "uniqueWords"
                    ? "Συνδυάζει το διακριτό λεξιλόγιο του κειμένου."
                    : "Συνδυάζει κάθε λέξη στη θέση της μέσα στο κείμενο."}
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              DEDICATED SEED WORD / PHRASE COMBINATIONS PANEL (ANCHOR + TEXT WORDS)
             ========================================================================= */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#1a1224] via-[#221630] to-[#1a1224] border border-purple-500/60 space-y-3.5 shadow-xl ring-1 ring-purple-500/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-900/60 text-purple-200 border border-purple-400/40">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-purple-100 flex items-center gap-2">
                    <span>Συνδυασμοί με Δική μου Λέξη / Φράση & Συμπλήρωση από το Κείμενο</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-600 text-white font-black shadow-sm">
                      {seedCombos.length} Βρέθηκαν
                    </span>
                  </h4>
                  <p className="text-[11px] text-purple-200/80 font-sans">
                    Εισάγετε μία δική σας λέξη/φράση και η εφαρμογή αναζητά αυτόματα λέξεις από το επικολλημένο κείμενο ώστε το συνολικό άθροισμα να ισούται ακριβώς με τον στόχο σας.
                  </p>
                </div>
              </div>

              {seedCombos.length > 0 && (
                <button
                  onClick={() => setViewMode("seed-combos")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-serif text-xs font-bold transition-all shadow-md border border-purple-400/50 cursor-pointer"
                >
                  <span>Προβολή {seedCombos.length} Συνδυασμών Κλειδιού</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              
              {/* 1. Custom Seed Word / Phrase Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-serif font-bold text-purple-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-purple-300" />
                    <span>Δική μου Λέξη / Φράση-Κλειδί</span>
                  </span>
                  {customSeedEval.value > 0 && (
                    <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/40 px-1.5 py-0.2 rounded border border-amber-500/30">
                      = {customSeedEval.value}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customSeedPhrase}
                    onChange={(e) => setCustomSeedPhrase(e.target.value)}
                    placeholder="π.χ. ΙΩΑΝΝΗΣ, ΛΑΥΡΕΙΟΝ, ΑΓΑΠΗ..."
                    className="w-full px-3 py-2 bg-[#120c1a] border border-purple-500/40 focus:border-purple-300 rounded-lg text-sm font-serif text-white outline-none shadow-inner"
                  />
                  {customSeedPhrase && (
                    <button
                      onClick={() => setCustomSeedPhrase("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                      title="Καθαρισμός"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Quick Seed Phrase Presets */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {[
                    "ΙΩΑΝΝΗΣ",
                    "ΛΑΥΡΕΙΟΝ",
                    "ΑΓΑΠΗ",
                    "ΦΩΣ",
                    "ΛΟΓΟΣ",
                    "Η ΑΛΗΘΕΙΑ",
                  ].map((presetSeed) => (
                    <button
                      key={presetSeed}
                      type="button"
                      onClick={() => setCustomSeedPhrase(presetSeed)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-serif transition-all ${
                        customSeedPhrase.trim().toUpperCase() === presetSeed
                          ? "bg-purple-600 text-white font-bold"
                          : "bg-[#181124] hover:bg-[#251b38] text-purple-200 border border-purple-500/30"
                      }`}
                    >
                      {presetSeed}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Target Number & Needed Difference */}
              <div className="space-y-1.5">
                <label className="block text-xs font-serif font-bold text-purple-200 flex items-center justify-between">
                  <span>Στόχος Συνολικού Λεξαρίθμου</span>
                  {customSeedTarget && (
                    <span className="text-[11px] font-serif text-purple-300">
                      {numberToGreekNumeral(customSeedTargetNum)}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customSeedTarget}
                    onChange={(e) => setCustomSeedTarget(e.target.value)}
                    placeholder="π.χ. 2368, 1480, 888, 666..."
                    className="w-full px-3 py-2 bg-[#120c1a] border border-purple-500/40 focus:border-purple-300 rounded-lg text-sm font-mono text-white outline-none"
                  />
                </div>

                {/* Real-time Needed Difference Info Badge */}
                <div className="text-[10px] font-mono px-2 py-1 rounded bg-[#100a17] border border-purple-500/30 text-purple-200 flex items-center justify-between">
                  <span>Υπόλοιπο από κείμενο:</span>
                  {customSeedTargetNum > customSeedEval.value ? (
                    <strong className="text-amber-300">
                      {customSeedTargetNum} - {customSeedEval.value} = {customSeedNeededValue}
                    </strong>
                  ) : (
                    <span className="text-red-400">Ο στόχος πρέπει να είναι &gt; {customSeedEval.value}</span>
                  )}
                </div>

                {/* Quick Target Preset Chips */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {["2368", "1480", "888", "666", "3168", "1332", "1572"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setCustomSeedTarget(chip)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        customSeedTarget === chip
                          ? "bg-purple-600 text-white font-bold"
                          : "bg-[#181124] hover:bg-[#251b38] text-purple-200 border border-purple-500/30"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Text Words Count & Processing Mode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-serif font-bold text-purple-200 flex items-center justify-between">
                  <span>Συμπληρωματικές Λέξεις από Κείμενο</span>
                  <span className="text-[10px] font-mono text-purple-300">
                    {seedTextWordCounts.sort((a,b)=>a-b).join(", ")} λέξεις
                  </span>
                </label>

                {/* Text Word Count Selector Buttons */}
                <div className="flex flex-wrap items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isSelected = seedTextWordCounts.includes(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleToggleSeedWordCount(num)}
                        className={`flex-1 min-w-[36px] py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                          isSelected
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-[#140e1f] hover:bg-[#201530] text-purple-300 border border-purple-500/30"
                        }`}
                        title={`Συνδυασμός με ${num} λέξεις από το κείμενο`}
                      >
                        +{num}λ
                      </button>
                    );
                  })}
                </div>

                {/* Mode toggle */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSeedMode("uniqueWords")}
                    className={`px-2 py-1 rounded-lg text-[11px] font-serif transition-all text-center ${
                      seedMode === "uniqueWords"
                        ? "bg-purple-900/80 text-white border border-purple-400/60 font-bold"
                        : "bg-[#120c1a] text-purple-300 border border-purple-500/20 hover:text-white"
                    }`}
                  >
                    Μοναδικές
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeedMode("allOccurrences")}
                    className={`px-2 py-1 rounded-lg text-[11px] font-serif transition-all text-center ${
                      seedMode === "allOccurrences"
                        ? "bg-purple-900/80 text-white border border-purple-400/60 font-bold"
                        : "bg-[#120c1a] text-purple-300 border border-purple-500/20 hover:text-white"
                    }`}
                  >
                    Όλες οι Θέσεις
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="p-4 rounded-xl bg-[#14120f] border border-[#282119] space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#8c7e6c] font-mono">
            Συνολικος Λεξαριθμος
          </span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#e6c670]">
            {analysis.stats.totalSum.toLocaleString("el-GR")}
          </div>
          <div className="text-[10px] font-mono text-[#736655]">
            Ιωνικός: {numberToGreekNumeral(analysis.stats.totalSum)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#14120f] border border-[#282119] space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#8c7e6c] font-mono">
            Συνολο / Μοναδικες
          </span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
            {analysis.stats.totalWords} <span className="text-sm font-normal text-[#8c7e6c]">/ {analysis.stats.uniqueWords}</span>
          </div>
          <div className="text-[10px] font-mono text-[#736655]">
            Ποσοστό ποικιλίας: {analysis.stats.totalWords > 0 ? Math.round((analysis.stats.uniqueWords / analysis.stats.totalWords) * 100) : 0}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#14120f] border border-[#282119] space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#8c7e6c] font-mono">
            Μεσος Ορος Λεξαριθμου
          </span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#d6c7b2]">
            {analysis.stats.averageWordValue.toLocaleString("el-GR")}
          </div>
          <div className="text-[10px] font-mono text-[#736655]">
            Διάμεσος: {analysis.stats.medianWordValue}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#14120f] border border-[#282119] space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#8c7e6c] font-mono">
            Βρεθεντες Στοχοι
          </span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-400">
            {totalFoundMatches}
          </div>
          <div className="text-[10px] font-mono text-[#736655]">
            {activeSingleMatches.length} λέξεις • {activePhraseMatches.length} φράσεις
          </div>
        </div>

      </div>

      {/* Main Results View Mode Switcher */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-[#2d251e] pb-2 gap-2">
          <div className="flex flex-wrap space-x-1.5 sm:space-x-2">
            
            <button
              onClick={() => setViewMode("interactive-list")}
              id="tab-view-interactive-list"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-serif font-semibold transition-all ${
                viewMode === "interactive-list"
                  ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40"
                  : "text-[#8c7e6c] hover:text-[#e8dfd1]"
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Κάθετη Λίστα (1 Λέξη / Σειρά)</span>
            </button>

            <button
              onClick={() => setViewMode("interactive-flow")}
              id="tab-view-interactive-flow"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-serif font-semibold transition-all ${
                viewMode === "interactive-flow"
                  ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40"
                  : "text-[#8c7e6c] hover:text-[#e8dfd1]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ροή Κειμένου & Highlighting</span>
            </button>

            <button
              onClick={() => setViewMode("seed-combos")}
              id="tab-view-seed-combos"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif font-semibold transition-all ${
                viewMode === "seed-combos"
                  ? "bg-[#0a233b] text-cyan-200 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/40 font-bold"
                  : "text-cyan-300/80 hover:text-cyan-100 hover:bg-[#071829]"
              }`}
            >
              <Key className="w-3.5 h-3.5 text-cyan-300" />
              <span>🌟 Λέξη-Οδηγός + Κείμενο ({seedCombos.length})</span>
            </button>

            <button
              onClick={() => setViewMode("sentences")}
              id="tab-view-sentences"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif font-semibold transition-all ${
                viewMode === "sentences"
                  ? "bg-[#2d1c0b] text-amber-200 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] ring-1 ring-amber-500/40 font-bold"
                  : "text-[#d6c7b2] hover:text-amber-200 hover:bg-[#1a140d]"
              }`}
            >
              <Quote className="w-3.5 h-3.5 text-amber-400" />
              <span>📜 Προτάσεις / Φράσεις (μέχρι .) ({sentences.length})</span>
            </button>

            <button
              onClick={() => setViewMode("anywhere-combos")}
              id="tab-view-anywhere-combos"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-serif font-semibold transition-all ${
                viewMode === "anywhere-combos"
                  ? "bg-[#2b2114] text-[#e6c670] border border-[#c89b3c]/60 shadow-md ring-1 ring-[#c89b3c]/40"
                  : "text-[#8c7e6c] hover:text-[#e8dfd1]"
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>🧩 Συνδυασμοί 2-6 Λέξεων ({anywhereCombos.length})</span>
            </button>

            <button
              onClick={() => setViewMode("matches")}
              id="tab-view-matches"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-serif font-semibold transition-all ${
                viewMode === "matches"
                  ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40"
                  : "text-[#8c7e6c] hover:text-[#e8dfd1]"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Βρεθέντες Στόχοι ({totalFoundMatches})</span>
            </button>

            <button
              onClick={() => setViewMode("lexicon")}
              id="tab-view-lexicon"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-serif font-semibold transition-all ${
                viewMode === "lexicon"
                  ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40"
                  : "text-[#8c7e6c] hover:text-[#e8dfd1]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Λεξικό Συχνότητας ({analysis.uniqueWordsMap.size})</span>
            </button>
          </div>
        </div>

        {/* Active Selected Seed Combination Banner if present */}
        {selectedSeedCombo && (
          <div className="p-3.5 rounded-xl bg-[#281433] border border-purple-400/60 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-purple-900/80 text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-300" />
              </span>
              <div>
                <div className="text-xs font-serif font-bold text-purple-200 flex items-center gap-2 flex-wrap">
                  <span>Επιλεγμένος Συνδυασμός με Λέξη-Κλειδί:</span>
                  <span className="text-amber-300 font-mono font-bold">
                    {selectedSeedCombo.fullEquation}
                  </span>
                </div>
                <div className="text-[11px] text-purple-300/80">
                  Η λέξη-κλειδί «{selectedSeedCombo.seedPhrase}» ({selectedSeedCombo.seedValue}) ενώνεται με {selectedSeedCombo.textWordCount} λέξεις από το κείμενο: {selectedSeedCombo.textWords.map(w => `${w.rawWord}(${w.value})`).join(", ")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("seed-combos")}
                className="px-2.5 py-1 rounded bg-purple-800/90 hover:bg-purple-700 text-xs font-serif text-white transition-colors"
              >
                Όλοι οι Συνδυασμοί Κλειδιού
              </button>
              <button
                onClick={() => setSelectedSeedCombo(null)}
                className="p-1 rounded text-purple-300 hover:text-white"
                title="Καθαρισμός επιλογής"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Active Selected Anywhere Combination Banner if present */}
        {selectedAnywhereCombo && (
          <div className="p-3.5 rounded-xl bg-[#211728] border border-purple-500/50 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-purple-900/60 text-purple-200">
                <Boxes className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-serif font-bold text-purple-200 flex items-center gap-2">
                  <span>Επιλεγμένος Συνδυασμός {selectedAnywhereCombo.wordCount} Λέξεων:</span>
                  <span className="text-amber-300 font-mono">
                    {selectedAnywhereCombo.words.map((w) => `${w.rawWord}(${w.value})`).join(" + ")} = {selectedAnywhereCombo.value}
                  </span>
                </div>
                <div className="text-[11px] text-purple-300/80">
                  Οι επιμέρους λέξεις επισημαίνονται στο κείμενο με μοβ/χρυσό περίγραμμα.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("anywhere-combos")}
                className="px-2.5 py-1 rounded bg-purple-800/80 hover:bg-purple-700 text-xs font-serif text-white transition-colors"
              >
                Όλοι οι Συνδυασμοί
              </button>
              <button
                onClick={() => setSelectedAnywhereCombo(null)}
                className="p-1 rounded text-purple-300 hover:text-white"
                title="Καθαρισμός επιλογής συνδυασμού"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 1. VERTICAL WORD-BY-WORD LIST VIEW (ONE WORD PER LINE WITH ISOPSEPHY) */}
        {viewMode === "interactive-list" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14120e] border border-[#2d251e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-serif text-[#a69680]">
                📋 <strong>Κάθετη Προβολή:</strong> Εμφάνιση κάθε λέξης σε ξεχωριστή σειρά με τον ισοψηφικό λεξάριθμο, τα γράμματα και τον πυθμένα της. Οι λέξεις που ικανοποιούν στόχο λέξης ({singleTargetNum || wordQuery || "-"}) ή αποτελούν μέρος στόχου φράσης ({phraseTarget || "-"}) μαρκάρονται αυτόματα με <span className="bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded">μωβ χρώμα και άσπρα γράμματα</span>.
              </div>
              <div className="text-xs font-mono text-[#8c7e6c] whitespace-nowrap">
                Σύνολο: {analysis.words.length} σειρές λέξεων
              </div>
            </div>

            {/* Word List Table / Rows */}
            <div className="space-y-2 max-h-[650px] overflow-y-auto gold-scrollbar pr-1">
              {analysis.words.map((w, idx) => {
                const isSingleMatch = singleMatchIndices.has(w.indexInText!);
                const phrases = phraseMatchWordMap.get(w.indexInText!) || [];
                const isPhraseMatch = phrases.length > 0;
                const isTargetMatch = isSingleMatch || isPhraseMatch;
                const isAnywhereComboWord = selectedAnywhereCombo && (
                  selectedComboIndices.has(w.indexInText!) ||
                  (selectedAnywhereCombo.isUniqueMode && selectedComboNormalizedSet.has(w.normalizedWord))
                );
                const isSeedComboWord = selectedSeedCombo && (
                  selectedSeedComboIndices.has(w.indexInText!) ||
                  (selectedSeedCombo.isUniqueMode && selectedSeedComboNormalizedSet.has(w.normalizedWord))
                );
                const isComboWord = isAnywhereComboWord || isSeedComboWord;
                const isSelected = selectedWordObj?.indexInText === w.indexInText;
                const isSaved = savedItems.some(
                  (item) => item.text.trim().toUpperCase() === w.rawWord.toUpperCase() && item.value === w.value
                );

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedWordObj(w)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#251e16] border-[#e6c670] ring-1 ring-[#e6c670] shadow-lg shadow-black/40"
                        : (isComboWord || isTargetMatch)
                        ? "bg-[#271433] border-purple-500/80 shadow-md shadow-purple-500/25 ring-1 ring-purple-400/60"
                        : "bg-[#14110e] border-[#261f18] hover:border-[#3e3223]"
                    }`}
                  >
                    {/* Left: Index, Word, Target Badge */}
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-xs font-mono text-[#736655] font-bold">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {isComboWord ? (
                            <mark className="text-lg font-serif font-black bg-purple-600 text-white px-2 py-0.5 rounded shadow-sm">
                              {w.rawWord}
                            </mark>
                          ) : isTargetMatch ? (
                            <mark className="text-lg font-serif font-black bg-purple-600 text-white px-2 py-0.5 rounded shadow-sm">
                              {w.rawWord}
                            </mark>
                          ) : (
                            <span className="text-lg font-serif font-bold text-[#f5ecd8]">
                              {w.rawWord}
                            </span>
                          )}

                          {isSeedComboWord && (
                            <span className="px-2 py-0.5 rounded bg-purple-700 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm animate-pulse flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Κλειδί «{selectedSeedCombo?.seedPhrase}» + {w.rawWord}</span>
                            </span>
                          )}

                          {isAnywhereComboWord && !isSeedComboWord && (
                            <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm animate-pulse">
                              🧩 Μέρος Συνδυασμού ({selectedAnywhereCombo?.value})
                            </span>
                          )}

                          {isSingleMatch && (
                            <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm animate-pulse">
                              🎯 Στόχος Λέξης {w.value}
                            </span>
                          )}

                          {isPhraseMatch && (
                            <span className="px-2 py-0.5 rounded bg-purple-700 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm">
                              🎯 Μέρος Φράσης ({phrases.map((p) => `${p.wordCount}λ=${p.value}`).join(", ")})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-[#8c7e6c] mt-0.5">
                          {w.letters.map((l) => `${l.char}(${l.value})`).join(" + ")}
                        </div>
                      </div>
                    </div>

                    {/* Right: Value, Pythmen, Actions */}
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <div className="text-right">
                        <div className={`text-lg font-serif font-bold px-3 py-0.5 rounded-lg border ${
                          isComboWord || isTargetMatch
                            ? "bg-purple-900 text-white font-black border-purple-400 shadow-sm"
                            : "text-[#e6c670] bg-[#1c1610] border-[#3e3122]"
                        }`}>
                          {w.value}
                        </div>
                        <div className="text-[10px] font-mono text-[#8c7e6c]">
                          Πυθμένας: {w.root}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 border-l border-[#261f18] pl-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveWordMatch(w);
                          }}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            isSaved
                              ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/40"
                              : "bg-[#1f1a14] hover:bg-[#2e241b] text-[#e6c670] border border-[#382d20]"
                          }`}
                          title={isSaved ? "Αποθηκεύτηκε" : "Αποθήκευση στο αρχείο"}
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyText(`${w.rawWord} = ${w.value}`, `list-${idx}`);
                          }}
                          className="p-1.5 rounded-lg bg-[#1f1a14] hover:bg-[#2e241b] text-[#8c7e6c] hover:text-[#d6c7b2] border border-[#382d20] transition-colors"
                          title="Αντιγραφή"
                        >
                          {copiedId === `list-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAiModal(w.rawWord, w.value, [w.rawWord]);
                          }}
                          className="p-1.5 rounded-lg bg-[#271e14] hover:bg-[#382b1c] text-[#f5ecd8] border border-[#c89b3c]/40 text-xs transition-colors"
                          title="AI Ερμηνεία"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#e6c670]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. INTERACTIVE CONTINUOUS FLOW TEXT WITH GLOWING TARGET HIGHLIGHTING */}
        {viewMode === "interactive-flow" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#14120e] border border-[#2d251e] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-serif text-[#a69680]">
                <span>
                  💡 <strong>Ροή Κειμένου & Μαρκάρισμα:</strong> Κάντε κλικ σε οποιαδήποτε λέξη για να δείτε τα γράμματα και την ισοψηφία της. Όλες οι ευρέσεις στόχων λέξεων ή συνδυασμών φράσεων εμφανίζονται με <span className="bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded">μωβ μαρκάρισμα</span> και άσπρα γράμματα.
                </span>
                <span className="font-mono text-purple-300 font-bold bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded">
                  {totalFoundMatches} ευρέσεις μαρκαρισμένες
                </span>
              </div>
              
              <div className="p-5 bg-[#0f0e0c] rounded-xl border border-[#211b15] leading-loose text-base sm:text-lg font-serif text-[#e8dfd1] flex flex-wrap gap-x-2.5 gap-y-3.5 max-h-[550px] overflow-y-auto gold-scrollbar">
                {analysis.words.map((w, idx) => {
                  const isSingleMatch = singleMatchIndices.has(w.indexInText!);
                  const phrases = phraseMatchWordMap.get(w.indexInText!) || [];
                  const isPhraseMatch = phrases.length > 0;
                  const isTargetMatch = isSingleMatch || isPhraseMatch;
                  const isAnywhereComboWord = selectedAnywhereCombo && (
                    selectedComboIndices.has(w.indexInText!) ||
                    (selectedAnywhereCombo.isUniqueMode && selectedComboNormalizedSet.has(w.normalizedWord))
                  );
                  const isSeedComboWord = selectedSeedCombo && (
                    selectedSeedComboIndices.has(w.indexInText!) ||
                    (selectedSeedCombo.isUniqueMode && selectedSeedComboNormalizedSet.has(w.normalizedWord))
                  );
                  const isComboWord = isAnywhereComboWord || isSeedComboWord;
                  const isSelected = selectedWordObj?.indexInText === w.indexInText;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedWordObj(w)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#c89b3c] text-black font-bold ring-2 ring-[#e6c670] shadow-lg shadow-black/50"
                          : isSeedComboWord
                          ? "bg-purple-700 text-white font-black border-2 border-amber-400 ring-2 ring-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.85)] scale-105 hover:bg-purple-600"
                          : (isTargetMatch || isComboWord)
                          ? "bg-purple-600 text-white font-black border-2 border-purple-300 ring-2 ring-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.7)] scale-105 hover:bg-purple-500"
                          : "hover:bg-[#251e17] hover:text-[#f5ecd8] border border-transparent"
                      }`}
                    >
                      <span className={isTargetMatch || isComboWord ? "text-white font-black" : ""}>{w.rawWord}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected
                          ? "bg-black/30 text-black font-bold"
                          : isSeedComboWord
                          ? "bg-purple-950 text-amber-300 font-bold border border-amber-400/50 shadow-sm"
                          : (isTargetMatch || isComboWord)
                          ? "bg-purple-950 text-white font-bold border border-purple-400/40 shadow-sm"
                          : "text-[#c89b3c] bg-[#1a1510]"
                      }`}>
                        {w.value}
                      </span>
                      {isPhraseMatch && !isComboWord && (
                        <span className="text-[9px] font-mono bg-purple-950 text-purple-200 border border-purple-400/40 px-1 rounded">
                          #{phrases[0]?.value}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Selected Word Details Card (appears when clicking any word in list or flow) */}
        {selectedWordObj && (
          <div className="p-5 rounded-xl bg-[#1a1612] border border-[#c89b3c]/60 space-y-4 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-serif font-bold text-[#f5ecd8]">
                  «{selectedWordObj.rawWord}»
                </span>
                <span className="text-sm font-mono text-[#8c7e6c]">
                  (Κανονικοποίηση: {selectedWordObj.normalizedWord})
                </span>
              </div>
              <div className="text-xl font-serif font-bold text-[#e6c670] bg-[#2a2116] px-3 py-1 rounded-lg border border-[#4a3924]">
                {selectedWordObj.value} ({numberToGreekNumeral(selectedWordObj.value)})
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#100e0c] border border-[#261f18]">
                <span className="text-[#8c7e6c] block text-[10px]">Πυθμένας (Ρίζα):</span>
                <strong className="text-[#e6c670] text-sm">{selectedWordObj.root}</strong>
              </div>
              <div className="p-2.5 rounded bg-[#100e0c] border border-[#261f18]">
                <span className="text-[#8c7e6c] block text-[10px]">Αριθμός Γραμμάτων:</span>
                <strong className="text-[#f5ecd8] text-sm">{selectedWordObj.letters.length}</strong>
              </div>
              <div className="p-2.5 rounded bg-[#100e0c] border border-[#261f18]">
                <span className="text-[#8c7e6c] block text-[10px]">Θέση στο Κείμενο:</span>
                <strong className="text-[#f5ecd8] text-sm">#{selectedWordObj.indexInText! + 1}</strong>
              </div>
              <div className="p-2.5 rounded bg-[#100e0c] border border-[#261f18]">
                <span className="text-[#8c7e6c] block text-[10px]">Συχνότητα στο Κείμενο:</span>
                <strong className="text-[#f5ecd8] text-sm">
                  {analysis.uniqueWordsMap.get(selectedWordObj.normalizedWord)?.count || 1} φορές
                </strong>
              </div>
            </div>

            {/* Letters Breakdown */}
            <div className="p-3 bg-[#100e0c] rounded-lg border border-[#261f18] text-xs font-mono text-[#d6c7b2] flex flex-wrap gap-2 items-center">
              {selectedWordObj.letters.map((l, i) => (
                <span key={i} className="px-2 py-1 bg-[#1a1612] rounded border border-[#2f251c]">
                  <strong className="text-[#e6c670]">{l.originalChar}</strong> = {l.value}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleSaveWordMatch(selectedWordObj)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282017] hover:bg-[#382b1d] text-xs font-serif text-[#e6c670] border border-[#3e3122]"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Αποθήκευση Λέξης</span>
              </button>

              <button
                onClick={() => onOpenAiModal(selectedWordObj.rawWord, selectedWordObj.value, [selectedWordObj.rawWord])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2e2316] hover:bg-[#3f2f1d] text-xs font-serif text-[#f5ecd8] border border-[#c89b3c]/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e6c670]" />
                <span>AI Ερμηνεία</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. ANYWHERE WORD COMBINATIONS (2, 3, 4, 5, 6 WORDS) VIEW */}
        {viewMode === "anywhere-combos" && (
          <div className="space-y-4">
            
            {/* Header / Filter Toolbar */}
            <div className="p-4 rounded-xl bg-[#14120e] border border-[#2d251e] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
                  <span>Ελεύθεροι Συνδυασμοί Λέξεων Κειμένου</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#c89b3c] text-black text-xs font-mono font-bold">
                    Στόχος: {comboTarget} ({numberToGreekNumeral(comboTargetNum)})
                  </span>
                </h3>
                <p className="text-xs text-[#8c7e6c] font-sans mt-0.5">
                  Εμφάνιση συνδυασμών {comboWordCounts.sort((a, b) => a - b).join(", ")} λέξεων από οπουδήποτε στο κείμενο με συνολικό άθροισμα = {comboTarget}.
                </p>
              </div>

              {/* Filter by word count pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setComboFilterLength("all")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    comboFilterLength === "all"
                      ? "bg-[#c89b3c] text-black font-bold"
                      : "bg-[#1b1712] text-[#a69680] border border-[#2e251a] hover:text-[#f5ecd8]"
                  }`}
                >
                  Όλοι ({anywhereCombos.length})
                </button>
                {[2, 3, 4, 5, 6].map((len) => {
                  const countForLen = anywhereCombos.filter((c) => c.wordCount === len).length;
                  if (countForLen === 0 && !comboWordCounts.includes(len)) return null;
                  return (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setComboFilterLength(len)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        comboFilterLength === len
                          ? "bg-[#c89b3c] text-black font-bold"
                          : "bg-[#1b1712] text-[#a69680] border border-[#2e251a] hover:text-[#f5ecd8]"
                      }`}
                    >
                      {len} λέξεις ({countForLen})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bulk Save Bar for Anywhere Combos */}
            {filteredAnywhereCombos.length > 0 && (
              <div className="p-3 bg-[#181410] rounded-xl border border-[#33281c] flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-serif text-[#d6c7b2]">
                  <Boxes className="w-4 h-4 text-[#c89b3c]" />
                  <span>
                    Βρέθηκαν <strong>{filteredAnywhereCombos.length}</strong> συνδυασμοί με άθροισμα <strong>{comboTarget}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAllAnywhereCombos}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#271d11] hover:bg-[#3d2b15] text-[#f5ecd8] border border-[#c89b3c]/60 text-xs font-serif font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#e6c670]" />
                    <span>📥 Αποθήκευση Όλων των Συνδυασμών ({filteredAnywhereCombos.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {filteredAnywhereCombos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[700px] overflow-y-auto gold-scrollbar p-1">
                {filteredAnywhereCombos.map((comboObj) => {
                  const isSaved = savedItems.some(
                    (item) => item.text.trim().toUpperCase() === comboObj.phrase.toUpperCase() && item.value === comboObj.value
                  );
                  const isSelected = selectedAnywhereCombo?.id === comboObj.id;

                  return (
                    <div
                      key={comboObj.id}
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        isSelected
                          ? "bg-[#251733] border-purple-400 ring-2 ring-purple-400/80 shadow-lg shadow-purple-900/30"
                          : "bg-[#14120f] border-[#2d251e] hover:border-[#4a3a28]"
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold">
                            {comboObj.wordCount} λέξεις
                          </span>
                          <span className="text-[11px] font-mono text-[#8c7e6c]">
                            Πυθμένας: {comboObj.root}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-serif font-black text-amber-300 bg-[#241a10] border border-[#4a3620] px-2.5 py-0.5 rounded-lg">
                            = {comboObj.value}
                          </span>
                          <span className="text-xs font-serif text-[#c89b3c]">
                            ({numberToGreekNumeral(comboObj.value)})
                          </span>
                        </div>
                      </div>

                      {/* Words Formula Breakdown */}
                      <div className="p-3 bg-[#0d0c0a] rounded-lg border border-[#211b15] flex flex-wrap items-center gap-1.5 text-sm font-serif">
                        {comboObj.words.map((w, wIdx) => (
                          <React.Fragment key={wIdx}>
                            <span className="px-2 py-0.5 rounded bg-[#1e1812] border border-[#382b1d] text-[#f5ecd8] font-bold">
                              {w.rawWord} <span className="text-[#c89b3c] font-mono text-xs font-normal">({w.value})</span>
                            </span>
                            {wIdx < comboObj.words.length - 1 && (
                              <span className="text-[#8c7e6c] font-mono font-bold">+</span>
                            )}
                          </React.Fragment>
                        ))}
                        <span className="text-[#c89b3c] font-mono font-bold ml-1">=</span>
                        <strong className="text-amber-300 font-mono text-base font-black">{comboObj.value}</strong>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          {/* Highlight / Locate in text button */}
                          <button
                            onClick={() => {
                              setSelectedAnywhereCombo(comboObj);
                              setViewMode("interactive-flow");
                            }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-serif transition-colors ${
                              isSelected
                                ? "bg-purple-600 text-white font-bold"
                                : "bg-[#22182b] hover:bg-[#342145] text-purple-200 border border-purple-500/30"
                            }`}
                            title="Επισήμανση όλων των λέξεων του συνδυασμού στο κείμενο"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Εντοπισμός στο Κείμενο</span>
                          </button>

                          <button
                            onClick={() => handleSaveAnywhereCombo(comboObj)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              isSaved
                                ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/40"
                                : "bg-[#251e17] hover:bg-[#33281d] text-[#e6c670] border border-[#3e3223]"
                            }`}
                          >
                            {isSaved ? <Check className="w-3 h-3 text-emerald-400" /> : <Bookmark className="w-3 h-3" />}
                            <span>{isSaved ? "Αποθηκεύτηκε" : "Αποθήκευση"}</span>
                          </button>

                          <button
                            onClick={() => handleCopyText(`${comboObj.phrase} = ${comboObj.value}`, comboObj.id)}
                            className="p-1.5 rounded-lg bg-[#1f1a14] hover:bg-[#2c231a] text-[#8c7e6c] hover:text-[#d6c7b2] border border-[#2d2419] transition-colors"
                            title="Αντιγραφή εξίσωσης"
                          >
                            {copiedId === comboObj.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>

                        <button
                          onClick={() => onOpenAiModal(comboObj.phrase, comboObj.value, comboObj.words.map((w) => w.rawWord))}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#271e14] hover:bg-[#382b1c] text-[#f5ecd8] border border-[#c89b3c]/30 text-xs transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-[#e6c670]" />
                          <span>AI Ερμηνεία</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-[#13110e] rounded-xl border border-[#261f18] p-6">
                <Boxes className="w-8 h-8 text-[#5c4f3e] mx-auto" />
                <p className="text-sm font-serif text-[#a69680]">
                  Δεν βρέθηκαν συνδυασμοί {comboWordCounts.sort((a, b) => a - b).join(", ")} λέξεων με άθροισμα <strong>{comboTarget}</strong> στο συγκεκριμένο κείμενο.
                </p>
                <p className="text-xs text-[#736655] max-w-md mx-auto">
                  Δοκιμάστε να αλλάξετε τον στόχο λεξαρίθμου (π.χ. 888, 1480, 2368, 666), να επιλέξετε περισσότερα μεγέθη λέξεων (2, 3, 4, 5, 6) ή να αλλάξετε λειτουργία σε «Όλες οι Θέσεις».
                </p>
              </div>
            )}

          </div>
        )}

        {/* 3B. SEED PHRASE + TEXT WORD COMBINATIONS VIEW */}
        {viewMode === "seed-combos" && (
          <div id="seed-combos-results-container" className="space-y-6 scroll-mt-20">
            
            {/* Top Toolbar & Filter bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#07192b] via-[#0e2c4a] to-[#07192b] border-2 border-cyan-400/80 space-y-4 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                      <Key className="w-4 h-4 text-cyan-300" />
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-black text-cyan-100 flex items-center gap-2 flex-wrap">
                      <span>Συνδυασμοί με Λέξη-Οδηγό «{customSeedEval.text || customSeedPhrase}»</span>
                      <span className="text-amber-300 font-mono">({customSeedEval.value})</span>
                      <span className="text-cyan-300">+ Λέξεις Κειμένου =</span>
                      <span className="text-amber-300 font-mono font-black text-lg bg-black/40 px-2 py-0.5 rounded border border-amber-500/40">
                        {customSeedTarget}
                      </span>
                    </h3>
                  </div>
                  <p className="text-xs text-cyan-200/80 font-sans">
                    Βρέθηκαν <strong>{seedCombos.length}</strong> έγκυροι συνδυασμοί που περιέχουν τη λέξη-οδηγό σας και συμπληρώνονται από λέξεις του κειμένου. Μπορείτε να αποθηκεύσετε στο Αρχείο όποιους προτιμάτε.
                  </p>
                </div>

                {filteredSeedCombos.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSaveAllSeedCombos}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-serif text-xs sm:text-sm font-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer self-start md:self-auto active:scale-95"
                  >
                    <Bookmark className="w-4 h-4 fill-black" />
                    <span>📥 Αποθήκευση Όλων στο Αρχείο ({filteredSeedCombos.length})</span>
                  </button>
                )}
              </div>

              {/* Length Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-cyan-500/20">
                <span className="text-[11px] font-serif text-cyan-300 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Φίλτρο Συμπληρωματικών Λέξεων:</span>
                </span>

                <button
                  type="button"
                  onClick={() => setSeedFilterLength("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-serif transition-all ${
                    seedFilterLength === "all"
                      ? "bg-cyan-500 text-black font-black shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      : "bg-[#061524] hover:bg-[#0c243d] text-cyan-200 border border-cyan-500/30"
                  }`}
                >
                  Όλοι ({seedCombos.length})
                </button>

                {[1, 2, 3, 4, 5].map((count) => {
                  const matchesCount = seedCombos.filter((c) => c.textWordCount === count).length;
                  if (matchesCount === 0 && !seedTextWordCounts.includes(count)) return null;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setSeedFilterLength(count)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        seedFilterLength === count
                          ? "bg-cyan-500 text-black font-black shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                          : "bg-[#061524] hover:bg-[#0c243d] text-cyan-200 border border-cyan-500/30"
                      }`}
                    >
                      +{count} {count === 1 ? "λέξη" : "λέξεις"} ({matchesCount})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Grid */}
            {filteredSeedCombos.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredSeedCombos.map((comboObj) => {
                  const isSelected = selectedSeedCombo?.id === comboObj.id;
                  const isSaved = savedItems.some(
                    (item) => item.text.trim().toUpperCase() === comboObj.fullPhrase.toUpperCase() && item.value === comboObj.totalValue
                  );

                  return (
                    <div
                      key={comboObj.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-3.5 ${
                        isSelected
                          ? "bg-[#081c30] border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                          : "bg-[#061322] border-cyan-500/40 hover:border-cyan-400/80 shadow-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                      }`}
                    >
                      {/* Top Header: Seed Tag, Equation Summary, Value Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-cyan-500/20 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full bg-cyan-600 text-black text-xs font-serif font-black shadow-sm flex items-center gap-1">
                            <Key className="w-3.5 h-3.5 text-black" />
                            <span>Λέξη-Οδηγός: «{comboObj.seedPhrase}»</span>
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full bg-[#0a233b] text-cyan-200 text-[11px] font-mono border border-cyan-500/40">
                            +{comboObj.textWordCount} {comboObj.textWordCount === 1 ? "λέξη κειμένου" : "λέξεις κειμένου"}
                          </span>

                          <span className="px-2.5 py-0.5 rounded-full bg-[#071a2c] text-cyan-300 text-[11px] font-mono border border-cyan-500/30">
                            Σύνολο: {comboObj.totalWordCount} λέξεις
                          </span>

                          <span className="text-xs font-mono text-cyan-300">
                            Πυθμένας: <strong className="text-amber-300">{comboObj.totalRoot}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <div className="text-right">
                            <div className="text-lg sm:text-xl font-serif font-black text-amber-300 bg-[#030b14] px-3.5 py-1 rounded-xl border border-cyan-500/50 shadow-inner">
                              = {comboObj.totalValue}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Rich Visual Formula Box */}
                      <div className="p-3.5 bg-[#030c17] rounded-xl border border-cyan-500/30 space-y-2">
                        <div className="text-xs sm:text-sm font-serif text-cyan-100 flex flex-wrap items-center gap-2 leading-relaxed">
                          {/* Anchor Seed Word Box */}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 text-black font-black border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                            <Key className="w-3.5 h-3.5 text-black" />
                            <span>{comboObj.seedPhrase}</span>
                            <span className="text-xs font-mono font-black bg-black/20 px-1 py-0.2 rounded">({comboObj.seedValue})</span>
                          </span>

                          <span className="text-cyan-300 font-bold px-1 text-base">+</span>

                          {/* Text Words Boxes */}
                          {comboObj.textWords.map((tw, twIdx) => (
                            <React.Fragment key={twIdx}>
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0b243d] text-cyan-100 border border-cyan-400/60 shadow-sm">
                                <span className="font-bold">{tw.rawWord}</span>
                                <span className="text-[11px] font-mono text-amber-300">({tw.value})</span>
                              </span>
                              {twIdx < comboObj.textWords.length - 1 && (
                                <span className="text-cyan-300 font-bold px-1 text-base">+</span>
                              )}
                            </React.Fragment>
                          ))}

                          <span className="text-amber-300 font-bold px-1 text-base">=</span>
                          <span className="font-mono font-black text-amber-300 text-base sm:text-lg px-2.5 py-0.5 rounded-lg bg-black/60 border border-amber-500/50">
                            {comboObj.totalValue}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-cyan-300/80 pt-1.5 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
                          <span>
                            Ιωνικός Λεξάριθμος: <strong>{numberToGreekNumeral(comboObj.totalValue)}</strong>
                          </span>
                          <span>
                            Συμπληρωματικές λέξεις από κείμενο: {comboObj.textWords.map((w) => w.rawWord).join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedSeedCombo(comboObj);
                              setSelectedAnywhereCombo(null);
                              setViewMode("interactive-flow");
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-900/60 hover:bg-cyan-800 text-cyan-100 text-xs font-serif font-bold border border-cyan-400/60 transition-all shadow-sm cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-cyan-300" />
                            <span>Εντοπισμός στο Κείμενο</span>
                          </button>

                          <button
                            onClick={() => handleSaveSeedCombo(comboObj)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-black transition-all cursor-pointer shadow-md ${
                              isSaved
                                ? "bg-emerald-800/80 text-emerald-100 border border-emerald-400"
                                : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black border border-amber-300"
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-200" />
                                <span>Αποθηκεύτηκε στο Αρχείο ✅</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5 fill-black" />
                                <span>💾 Αποθήκευση στο Αρχείο</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyText(comboObj.fullEquation, comboObj.id)}
                            className="p-2 rounded-xl bg-[#081a2c] hover:bg-[#0f2e4e] text-cyan-300 hover:text-white border border-cyan-500/40 transition-colors"
                            title="Αντιγραφή εξίσωσης"
                          >
                            {copiedId === comboObj.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <button
                          onClick={() => onOpenAiModal(comboObj.fullPhrase, comboObj.totalValue, [comboObj.seedPhrase, ...comboObj.textWords.map((w) => w.rawWord)])}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#091f35] hover:bg-[#103254] text-cyan-100 border border-cyan-400/50 text-xs font-serif font-bold transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>AI Ερμηνεία</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-[#051322] rounded-2xl border-2 border-cyan-500/40 p-6">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                <p className="text-sm font-serif text-cyan-100">
                  Δεν βρέθηκαν συνδυασμοί της λέξης <strong>«{customSeedPhrase}» ({customSeedEval.value})</strong> με {seedTextWordCounts.sort((a, b) => a - b).join(", ")} λέξεις από το κείμενο για στόχο <strong>{customSeedTarget}</strong>.
                </p>
                <p className="text-xs text-cyan-300/80 max-w-md mx-auto">
                  Το απαιτούμενο υπόλοιπο από το κείμενο είναι <strong>{customSeedNeededValue}</strong>. Δοκιμάστε να αλλάξετε τον στόχο (π.χ. 2368, 1480, 888, 3168), να ενεργοποιήσετε περισσότερες συμπληρωματικές λέξεις (+1λ, +2λ, +3λ, +4λ, +5λ) ή να αλλάξετε λειτουργία σε «Όλες οι Θέσεις».
                </p>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            5. DEDICATED SENTENCE / CLAUSE ISOPSEPHY ANALYSIS VIEW (UNTIL PERIOD .)
           ========================================================================= */}
        {viewMode === "sentences" && (
          <div id="sentences-section-anchor" className="space-y-6">
            
            {/* Header / Info Panel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c140c] via-[#2a1d10] to-[#1c140c] border-2 border-amber-500/60 shadow-xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/50 shadow-inner">
                    <Quote className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100 flex items-center gap-2 flex-wrap">
                      <span>Ανάλυση & Εύρεση Λεξαρίθμου ανά Πρόταση / Φράση</span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-bold">
                        {sentences.length} Προτάσεις
                      </span>
                    </h3>
                    <p className="text-xs text-amber-200/80 font-sans mt-0.5">
                      Διαχωρισμός κειμένου σε αυτοτελείς προτάσεις (μέχρι τελεία <strong>.</strong>, άνω τελεία <strong>·</strong>, ερωτηματικό <strong>;</strong> ή θαυμαστικό <strong>!</strong>) και πλήρης ισοψηφικός υπολογισμός.
                    </p>
                  </div>
                </div>

                {/* Bulk Save Button for Sentences */}
                {filteredSentences.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSaveAllSentences}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-serif text-xs font-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer self-start md:self-auto shrink-0"
                  >
                    <Bookmark className="w-4 h-4 text-black" />
                    <span>📥 Αποθήκευση {filteredSentences.length} Προτάσεων στον Θησαυρό</span>
                  </button>
                )}
              </div>

              {/* Quick Preset Targets Bar for Sentences */}
              <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-amber-300 font-serif text-[11px] font-bold">Δημοφιλείς Στόχοι:</span>
                {[
                  { label: "888 (ΙΗΣΟΥΣ)", val: "888" },
                  { label: "1480 (ΧΡΙΣΤΟΣ)", val: "1480" },
                  { label: "2368 (ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ)", val: "2368" },
                  { label: "3168 (ΚΥΡΙΟΣ)", val: "3168" },
                  { label: "666 (ΘΗΡΙΟΝ)", val: "666" },
                  { label: "1119 (ΣΤΑΥΡΟΣ)", val: "1119" },
                  { label: "1000", val: "1000" },
                  { label: "1776", val: "1776" },
                  { label: "2024", val: "2024" },
                ].map((tgt) => (
                  <button
                    key={tgt.val}
                    type="button"
                    onClick={() => setSentenceTarget(sentenceTarget === tgt.val ? "" : tgt.val)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors ${
                      sentenceTarget === tgt.val
                        ? "bg-amber-400 text-black font-bold shadow-sm"
                        : "bg-[#181109] text-amber-200/90 hover:text-white hover:bg-[#281b0e] border border-amber-900/60"
                    }`}
                  >
                    {tgt.label}
                  </button>
                ))}
                {sentenceTarget && (
                  <button
                    type="button"
                    onClick={() => setSentenceTarget("")}
                    className="text-[10px] text-amber-400 hover:text-white px-1.5 py-0.5 rounded bg-black/40 underline"
                  >
                    Καθαρισμός
                  </button>
                )}
              </div>
            </div>

            {/* Sentence Filtering Controls Bar */}
            <div className="p-4 rounded-xl bg-[#14100c] border border-[#2e2215] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              {/* Target Isopsephic Value */}
              <div className="space-y-1">
                <label className="font-serif text-[#e6c670] font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#c89b3c]" />
                    <span>Στόχος Λεξαρίθμου Πρότασης</span>
                  </span>
                  {sentenceTarget && (
                    <span className="text-[10px] font-mono text-amber-300">
                      {numberToGreekNumeral(parseInt(sentenceTarget, 10))}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sentenceTarget}
                    onChange={(e) => setSentenceTarget(e.target.value)}
                    placeholder="π.χ. 2368, 1480, 888..."
                    className="w-full px-3 py-2 bg-[#1b1510] border border-[#3d2f1d] focus:border-amber-400 rounded-lg text-sm font-mono text-[#f5ecd8] outline-none"
                  />
                  {sentenceTarget && (
                    <button
                      type="button"
                      onClick={() => setSentenceTarget("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Text Search inside sentence */}
              <div className="space-y-1">
                <label className="font-serif text-[#e6c670] font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-[#c89b3c]" />
                    <span>Αναζήτηση Λέξης / Αριθμού</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sentenceSearchQuery}
                    onChange={(e) => setSentenceSearchQuery(e.target.value)}
                    placeholder="π.χ. φως, λόγος, θεός..."
                    className="w-full px-3 py-2 bg-[#1b1510] border border-[#3d2f1d] focus:border-amber-400 rounded-lg text-sm font-serif text-[#f5ecd8] outline-none placeholder-[#665440]"
                  />
                  {sentenceSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSentenceSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Digital Root (Pythmen) Filter */}
              <div className="space-y-1">
                <label className="font-serif text-[#e6c670] font-bold flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>Πυθμένας (Μονοψήφιος 1-9)</span>
                </label>
                <select
                  value={sentenceRootFilter}
                  onChange={(e) => setSentenceRootFilter(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-[#1b1510] border border-[#3d2f1d] focus:border-amber-400 rounded-lg text-xs font-serif text-[#f5ecd8] outline-none cursor-pointer"
                >
                  <option value="all">Όλοι οι Πυθμένες (1 - 9)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => (
                    <option key={r} value={r}>
                      Πυθμένας = {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting */}
              <div className="space-y-1">
                <label className="font-serif text-[#e6c670] font-bold flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>Ταξινόμηση Προτάσεων</span>
                </label>
                <select
                  value={sentenceSortOption}
                  onChange={(e) => setSentenceSortOption(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#1b1510] border border-[#3d2f1d] focus:border-amber-400 rounded-lg text-xs font-serif text-[#f5ecd8] outline-none cursor-pointer"
                >
                  <option value="index_asc">Σειρά στο Κείμενο (1 → {sentences.length})</option>
                  <option value="val_desc">Λεξάριθμος: Φθίνων (Μεγάλος → Μικρός)</option>
                  <option value="val_asc">Λεξάριθμος: Αύξων (Μικρός → Μεγάλος)</option>
                  <option value="words_desc">Πλήθος Λέξεων: Περισσότερες πρώτα</option>
                  <option value="root_asc">Πυθμένας (1 → 9)</option>
                </select>
              </div>

            </div>

            {/* Sentences List */}
            {filteredSentences.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-serif text-[#a69680] px-1">
                  <span>
                    Εμφάνιση <strong>{filteredSentences.length}</strong> από <strong>{sentences.length}</strong> προτάσεις
                  </span>
                  {sentenceTarget && (
                    <span className="text-amber-300 font-mono bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                      Φίλτρο Στόχου: {sentenceTarget}
                    </span>
                  )}
                </div>

                <div className="space-y-3.5">
                  {filteredSentences.map((sentenceObj) => {
                    const isTargetMatch = sentenceTarget && sentenceObj.value === parseInt(sentenceTarget, 10);
                    const isSaved = savedItems.some(
                      (item) => item.text.trim().toUpperCase() === sentenceObj.text.toUpperCase() && item.value === sentenceObj.value
                    );

                    return (
                      <div
                        key={sentenceObj.id}
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-3.5 ${
                          isTargetMatch
                            ? "bg-[#211508] border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.35)]"
                            : "bg-[#14100c] border-[#2d2217] hover:border-amber-500/50 shadow-md"
                        }`}
                      >
                        {/* Top Bar: Sentence Index, Stats, Large Isopsephy Value */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#2d2217] pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-[#2a1d0f] text-amber-200 text-xs font-serif font-bold border border-amber-600/40 flex items-center gap-1.5 shadow-sm">
                              <Quote className="w-3.5 h-3.5 text-amber-400" />
                              <span>Πρόταση #{sentenceObj.sentenceIndex}</span>
                            </span>

                            <span className="px-2.5 py-0.5 rounded-full bg-[#18120b] text-[#c4b39b] text-[11px] font-mono border border-[#382a1b]">
                              {sentenceObj.wordCount} {sentenceObj.wordCount === 1 ? "λέξη" : "λέξεις"}
                            </span>

                            <span className="px-2.5 py-0.5 rounded-full bg-[#18120b] text-[#c4b39b] text-[11px] font-mono border border-[#382a1b]">
                              {sentenceObj.charCount} γράμματα
                            </span>

                            <span className="text-xs font-mono text-[#a69680]">
                              Πυθμένας: <strong className="text-amber-300">{sentenceObj.root}</strong>
                            </span>

                            {sentenceObj.punctuation && (
                              <span className="text-[11px] font-serif text-[#8c7e6c] italic">
                                [Σημείο: {sentenceObj.punctuation}]
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <div className="text-right">
                              <div className={`text-lg sm:text-xl font-serif font-black px-3.5 py-1 rounded-xl border shadow-inner ${
                                isTargetMatch
                                  ? "text-black bg-amber-400 border-amber-300 font-extrabold"
                                  : "text-amber-300 bg-[#0d0a07] border-amber-500/40"
                              }`}>
                                = {sentenceObj.value.toLocaleString("el-GR")}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Full Sentence Quote Text */}
                        <div className="p-3.5 rounded-xl bg-[#0c0a08] border border-[#291f15] space-y-2">
                          <blockquote className="text-sm sm:text-base font-serif text-[#f5ecd8] leading-relaxed italic">
                            «{sentenceObj.text}»
                          </blockquote>

                          {/* Word-by-word Breakdown Formula */}
                          <div className="pt-2 border-t border-[#211810] flex flex-wrap items-center gap-1.5 text-xs font-mono">
                            <span className="text-[11px] font-serif text-[#8c7e6c] mr-1">Ανάλυση λέξεων:</span>
                            {sentenceObj.words.map((w, wIdx) => (
                              <React.Fragment key={wIdx}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedWordObj(w)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a140d] hover:bg-[#2c2014] text-[#d6c7b2] hover:text-white border border-[#382b1b] transition-colors cursor-pointer"
                                  title={`Κάντε κλικ για λεπτομερή ανάλυση της λέξης «${w.rawWord}» (${w.value})`}
                                >
                                  <span className="font-serif font-semibold">{w.rawWord}</span>
                                  <span className="text-[10px] text-amber-400">({w.value})</span>
                                </button>
                                {wIdx < sentenceObj.words.length - 1 && (
                                  <span className="text-[#8c7e6c] font-bold">+</span>
                                )}
                              </React.Fragment>
                            ))}
                            <span className="text-amber-400 font-bold ml-1">=</span>
                            <span className="font-bold text-amber-300 font-mono ml-0.5">
                              {sentenceObj.value} ({sentenceObj.greekNumeral})
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            
                            {/* Save Button */}
                            <button
                              type="button"
                              onClick={() => handleSaveSentence(sentenceObj)}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shadow-md ${
                                isSaved
                                  ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/50"
                                  : "bg-[#251a0f] hover:bg-[#382716] text-[#e6c670] hover:text-white border border-amber-600/40"
                              }`}
                            >
                              {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5 text-amber-400" />}
                              <span>{isSaved ? "Αποθηκεύτηκε στον Θησαυρό" : "💾 Αποθήκευση στον Θησαυρό"}</span>
                            </button>

                            {/* Copy Button */}
                            <button
                              type="button"
                              onClick={() => handleCopyText(`${sentenceObj.text} = ${sentenceObj.value} (${sentenceObj.greekNumeral})`, sentenceObj.id)}
                              className="p-2 rounded-xl bg-[#1c150e] hover:bg-[#2c2014] text-[#a69680] hover:text-white border border-[#382b1b] transition-colors"
                              title="Αντιγραφή πρότασης και λεξαρίθμου"
                            >
                              {copiedId === sentenceObj.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* AI Interpretation */}
                          <button
                            type="button"
                            onClick={() => onOpenAiModal(sentenceObj.text, sentenceObj.value, sentenceObj.words.map((w) => w.rawWord))}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#24190d] hover:bg-[#382613] text-amber-200 border border-amber-500/40 text-xs font-serif font-bold transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>✨ AI Ερμηνεία Πρότασης</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-[#120e0a] rounded-2xl border-2 border-amber-900/40 p-6">
                <Quote className="w-8 h-8 text-amber-600/70 mx-auto" />
                <p className="text-sm font-serif text-amber-200">
                  Δεν βρέθηκαν προτάσεις που να ικανοποιούν τα τρέχοντα φίλτρα.
                </p>
                <p className="text-xs text-[#8c7e6c] max-w-md mx-auto">
                  {sentenceTarget
                    ? `Καμία πρόταση δεν έχει λεξάριθμο ίσο με ${sentenceTarget}. Δοκιμάστε να καθαρίσετε τον στόχο ή να αναζητήσετε με άλλο αριθμό.`
                    : "Εισαγάγετε κείμενο με τελείες (.) στο επάνω πλαίσιο για αυτόματο διαχωρισμό σε προτάσεις."}
                </p>
              </div>
            )}

          </div>
        )}

        {/* 4. MATCHES VIEW (Found words & N-gram phrases) */}
        {viewMode === "matches" && (
          <div className="space-y-6">
            
            {/* Global Bulk Save Bar for Found Targets */}
            {totalFoundMatches > 0 && (
              <div className="p-3.5 bg-[#181410] rounded-xl border border-[#33281c] flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5 text-xs font-serif text-[#d6c7b2]">
                  <Search className="w-4 h-4 text-purple-400" />
                  <span>
                    Σύνολο Ευρημάτων Στόχου: <strong>{totalFoundMatches}</strong> ({activeSingleMatches.length} λέξεις & {activePhraseMatches.length} φράσεις)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAllTotalMatches}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-900/70 hover:bg-purple-800 text-purple-100 border border-purple-400/50 text-xs font-serif font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>📥 Αποθήκευση Όλων των Ευρημάτων ({totalFoundMatches})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Single Word Matches Section */}
            {activeSingleMatches.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
                    <span>
                      {wordQuery 
                        ? `Εμφανίσεις λέξης «${wordQuery}»`
                        : `Μεμονωμένες Λέξεις με Στόχο = ${singleWordTarget || `${minRange}-${maxRange}`}`
                      }
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-[#2a2219] text-[#c89b3c] text-[10px] font-mono">
                      {activeSingleMatches.length}
                    </span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleSaveAllSingleMatches}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#251e17] hover:bg-[#382b1c] text-[#e6c670] border border-[#3e3223] text-xs font-serif transition-all"
                  >
                    <Bookmark className="w-3 h-3 text-[#e6c670]" />
                    <span>Αποθήκευση Όλων των Λέξεων ({activeSingleMatches.length})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeSingleMatches.map((wordObj, idx) => {
                    const matchId = `single-${wordObj.indexInText}-${wordObj.value}`;
                    const isSaved = savedItems.some(
                      (item) => item.text.trim().toUpperCase() === wordObj.rawWord.toUpperCase() && item.value === wordObj.value
                    );

                    return (
                      <div
                        key={`${matchId}-${idx}`}
                        className="p-4 rounded-xl bg-[#15120f] border border-[#2d251e] hover:border-[#4a3c2c] transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <mark className="text-lg font-serif font-black bg-purple-600 text-white px-2.5 py-0.5 rounded shadow-sm inline-block">
                              «{wordObj.rawWord}»
                            </mark>
                            <span className="text-xs text-[#8c7e6c] font-mono ml-2">
                              (Θέση #{wordObj.indexInText! + 1})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-serif font-black text-white bg-purple-900 px-2.5 py-0.5 rounded-lg border border-purple-400 shadow-sm">
                              {wordObj.value}
                            </span>
                          </div>
                        </div>

                        {/* Letters formula */}
                        <div className="text-xs font-mono text-[#a69680] bg-[#100e0b] p-2 rounded-lg border border-[#211b15]">
                          {wordObj.letters.map((l) => `${l.char}(${l.value})`).join(" + ")} = <strong className="text-[#f5ecd8]">{wordObj.value}</strong>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveWordMatch(wordObj)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                isSaved
                                   ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/40"
                                  : "bg-[#251e17] hover:bg-[#33281d] text-[#e6c670] border border-[#3e3223]"
                              }`}
                            >
                              {isSaved ? <Check className="w-3 h-3 text-emerald-400" /> : <Bookmark className="w-3 h-3" />}
                              <span>{isSaved ? "Αποθηκεύτηκε" : "Αποθήκευση"}</span>
                            </button>

                            <button
                              onClick={() => handleCopyText(`${wordObj.rawWord} = ${wordObj.value}`, matchId)}
                              className="p-1.5 rounded-lg bg-[#1f1a14] hover:bg-[#2c231a] text-[#8c7e6c] hover:text-[#d6c7b2] border border-[#2d2419] transition-colors"
                              title="Αντιγραφή"
                            >
                              {copiedId === matchId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>

                          <button
                            onClick={() => onOpenAiModal(wordObj.rawWord, wordObj.value, [wordObj.rawWord])}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#271e14] hover:bg-[#382b1c] text-[#f5ecd8] border border-[#c89b3c]/30 text-xs transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-[#e6c670]" />
                            <span>AI Ερμηνεία</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phrase Matches Section (N-grams) */}
            {activePhraseMatches.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
                    <span>
                      Συνδυασμοί {phraseLengthMin === phraseLengthMax ? `${phraseLengthMin}` : `${phraseLengthMin}-${phraseLengthMax}`} Λέξεων με Στόχο = {phraseTarget}
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-[#2a2219] text-[#c89b3c] text-[10px] font-mono">
                      {activePhraseMatches.length}
                    </span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleSaveAllPhraseMatches}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#251e17] hover:bg-[#382b1c] text-[#e6c670] border border-[#3e3223] text-xs font-serif transition-all"
                  >
                    <Bookmark className="w-3 h-3 text-[#e6c670]" />
                    <span>Αποθήκευση Όλων των Φράσεων ({activePhraseMatches.length})</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activePhraseMatches.map((phraseObj) => {
                    const isSaved = savedItems.some(
                      (item) => item.text.trim().toUpperCase() === phraseObj.phrase.toUpperCase() && item.value === phraseObj.value
                    );

                    return (
                      <div
                        key={phraseObj.id}
                        className="p-4 sm:p-5 rounded-xl bg-[#15120f] border border-[#2d251e] hover:border-[#4a3c2c] transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <mark className="text-lg font-serif font-black bg-purple-600 text-white px-3 py-1 rounded-md shadow-sm leading-relaxed inline-block">
                              «{phraseObj.phrase}»
                            </mark>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#8c7e6c] font-mono">
                              <span className="px-1.5 py-0.5 rounded bg-purple-900 text-purple-200 font-bold border border-purple-500/40">
                                {phraseObj.wordCount} λέξεις
                              </span>
                              <span>•</span>
                              <span>Λέξεις #{phraseObj.startIndex + 1} έως #{phraseObj.endIndex + 1}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className="text-lg sm:text-xl font-serif font-black text-white bg-purple-900 px-3 py-1 rounded-lg border border-purple-400 shadow-sm">
                              {phraseObj.value}
                            </span>
                          </div>
                        </div>

                        {/* Breakdown of each word in phrase */}
                        <div className="text-xs font-mono text-[#a69680] bg-[#100e0b] p-2.5 rounded-lg border border-[#211b15] flex flex-wrap gap-1.5 items-center">
                          {phraseObj.words.map((w, wIdx) => (
                            <React.Fragment key={wIdx}>
                              <span className="text-[#f5ecd8] font-bold">{w.rawWord}</span>
                              <span className="text-[#8c7e6c]">({w.value})</span>
                              {wIdx < phraseObj.words.length - 1 && <span className="text-[#c89b3c] font-bold">+</span>}
                            </React.Fragment>
                          ))}
                          <span className="text-[#c89b3c] font-bold ml-1">=</span>
                          <strong className="text-[#e6c670] text-sm">{phraseObj.value}</strong>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSavePhraseMatch(phraseObj)}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                isSaved
                                  ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/40"
                                  : "bg-[#251e17] hover:bg-[#33281d] text-[#e6c670] border border-[#3e3223]"
                              }`}
                            >
                              {isSaved ? <Check className="w-3 h-3 text-emerald-400" /> : <Bookmark className="w-3 h-3" />}
                              <span>{isSaved ? "Αποθηκεύτηκε" : "Αποθήκευση"}</span>
                            </button>

                            <button
                              onClick={() => handleCopyText(`${phraseObj.phrase} = ${phraseObj.value}`, phraseObj.id)}
                              className="p-1.5 rounded-lg bg-[#1f1a14] hover:bg-[#2c231a] text-[#8c7e6c] hover:text-[#d6c7b2] border border-[#2d2419] transition-colors"
                              title="Αντιγραφή"
                            >
                              {copiedId === phraseObj.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>

                            <button
                              onClick={() => handleDismissMatch(phraseObj.id)}
                              className="p-1.5 rounded-lg bg-[#1f1a14] hover:bg-red-950/40 text-[#8c7e6c] hover:text-red-300 border border-[#2d2419] transition-colors"
                              title="Απόκρυψη αποτελέσματος"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onOpenAiModal(phraseObj.phrase, phraseObj.value, phraseObj.words.map((w) => w.rawWord))}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#271e14] hover:bg-[#382b1c] text-[#f5ecd8] border border-[#c89b3c]/30 text-xs transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#e6c670]" />
                            <span>AI Ερμηνεία</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No matches state */}
            {totalFoundMatches === 0 && (
              <div className="py-12 text-center space-y-3 bg-[#13110e] rounded-xl border border-[#261f18] p-6">
                <Search className="w-8 h-8 text-[#5c4f3e] mx-auto" />
                <p className="text-sm font-serif text-[#a69680]">
                  Δεν βρέθηκαν λέξεις ή συνδυασμοί που να ικανοποιούν τα τρέχοντα κριτήρια.
                </p>
                <p className="text-xs text-[#736655]">
                  Δοκιμάστε να αλλάξετε τον αριθμητικό στόχο, τη λέξη αναζήτησης ή να διευρύνετε το μήκος των φράσεων (π.χ. 2, 3, 4, 5 ή 6 λέξεις).
                </p>
              </div>
            )}

          </div>
        )}

        {/* 4. LEXICON & FREQUENCY VIEW */}
        {viewMode === "lexicon" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#14120f] p-3.5 rounded-xl border border-[#282119]">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7e6c]" />
                <input
                  type="text"
                  value={lexiconSearch}
                  onChange={(e) => setLexiconSearch(e.target.value)}
                  placeholder="Αναζήτηση στο λεξικό..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#1a1611] border border-[#33281c] rounded-lg text-xs font-serif text-[#f5ecd8] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-serif text-[#8c7e6c]">
                <span>Ταξινόμηση:</span>
                <select
                  value={lexiconSort}
                  onChange={(e) => setLexiconSort(e.target.value as any)}
                  className="bg-[#1a1611] border border-[#33281c] rounded-lg px-2 py-1 text-xs text-[#f5ecd8] font-serif outline-none"
                >
                  <option value="freq">Συχνότητα (Πιο συχνές)</option>
                  <option value="alpha">Αλφαβητικά (Α-Ω)</option>
                  <option value="val-desc">Λεξάριθμος (Φθίνουσα)</option>
                  <option value="val-asc">Λεξάριθμος (Αύξουσα)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[600px] overflow-y-auto gold-scrollbar p-1">
              {lexiconList.map((item, idx) => {
                const isMatch =
                  (singleTargetNum !== undefined && item.value === singleTargetNum) ||
                  (wordQuery &&
                    (item.raw.toLowerCase().includes(wordQuery.toLowerCase()) ||
                      item.normalized.includes(wordQuery.toUpperCase())));

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                      isMatch
                        ? "bg-[#28220f] border-yellow-500/80 ring-1 ring-yellow-400/50"
                        : "bg-[#14110e] border-[#261f18] hover:border-[#3d3021]"
                    }`}
                  >
                    <div>
                      {isMatch ? (
                        <mark className="text-sm font-serif font-black bg-[#ffe600] text-black px-1.5 py-0.5 rounded shadow-sm inline-block">
                          {item.raw}
                        </mark>
                      ) : (
                        <span className="text-sm font-serif font-bold text-[#f5ecd8]">
                          {item.raw}
                        </span>
                      )}
                      <div className="text-[10px] font-mono text-[#8c7e6c] mt-0.5">
                        Συχνότητα: {item.count} {item.count === 1 ? "φορά" : "φορές"}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-serif font-bold ${isMatch ? "text-[#ffe600] font-black" : "text-[#e6c670]"}`}>
                        {item.value}
                      </span>
                      <div className="text-[10px] font-mono text-[#7a6c5a]">
                        Πυθμένας: {item.root}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Floating Toast Notification for bulk / individual saves */}
      {savedToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 px-4 rounded-xl bg-[#1c1813] border border-[#c89b3c] shadow-2xl text-[#f5ecd8] text-xs font-serif flex items-center gap-2.5 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedToastMessage}</span>
        </div>
      )}

    </div>
  );
};
