import React, { useState, useMemo } from "react";
import { SavedIsopsephyItem, WordIsopsephy, NumberingSystem } from "../types";
import {
  calculateIsopsephy,
  getWordLettersBreakdown,
  calculatePythmen,
  numberToGreekNumeral,
  calculateGCD,
  calculateLCM,
  getPrimeFactorization,
  ENGLISH_BASE6_VALUES,
  ENGLISH_SIMPLE_VALUES,
} from "../utils/isopsephy";
import { translateEnglishToGreek } from "../utils/translator";
import { generateIsopsephicSentences, GeneratedSentenceMatch } from "../utils/sentenceBuilder";
import { TOPIC_CATEGORIES, categorizeTerm } from "../utils/topicClustering";
import {
  GitCompare,
  Sparkles,
  BookmarkPlus,
  ArrowRightLeft,
  Divide,
  Sigma,
  Minus,
  Binary,
  Layers,
  HelpCircle,
  TrendingUp,
  Cpu,
  Search,
  Languages,
  Wand2,
  Check,
  Globe,
  Sliders,
  ListFilter,
  Flame,
} from "lucide-react";

interface BridgesTabProps {
  savedItems: SavedIsopsephyItem[];
  onSaveItem: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
}

const PRESET_PAIRS = [
  { a: "ΙΑΝΕΥΣ", b: "ΤΕΛΙΑΝΟΣ", desc: "666 + 666 = 1332 (Αλληγορία Λαυρείου)" },
  { a: "ΙΗΣΟΥΣ", b: "ΧΡΙΣΤΟΣ", desc: "888 + 1480 = 2368 (Θεία Αρμονία)" },
  { a: "ΒΕΛΟΣ", b: "ΟΥΔΟΣ", desc: "305 + 744 = 1049 (Μυστική Πύλη ΒΕΛΟΥΔΟΣ)" },
  { a: "ΔΙΑΣ", b: "ΖΕΥΣ", desc: "215 vs 612 (Ολύμπια Ονόματα)" },
  { a: "ΠΟΡΟΣ", b: "ΠΕΝΙΑ", desc: "420 + 246 = 666 (Γέννηση του Έρωτος)" },
  { a: "ΦΩΣ", b: "ΣΚΟΤΟΣ", desc: "1500 vs 860 (Διαλεκτική Αντίθεση)" },
];

const PRESET_CROSS_PAIRS = [
  { greek: "ΙΑΝΕΥΣ", english: "COMPUTER", targetVal: 666, desc: "Ιωνική: 666 | Base 6: 666 (Σύγχρονη Τεχνολογία)" },
  { greek: "ΤΕΛΙΑΝΟΣ", english: "PARTNERS", targetVal: 666, desc: "Ιωνική: 666 | Base 6: 666 (Συμμαχία)" },
  { greek: "ΘΕΟΣ", english: "GOLD", targetVal: 284, desc: "Ιωνική: 284 | Θεία Αξία" },
  { greek: "ΑΓΑΠΗ", english: "FAITH", targetVal: 93, desc: "Ισοπύθμενη Αρμονία" },
  { greek: "ΒΕΛΟΥΔΟΣ", english: "PRINCE OF PEACE", targetVal: 1049, desc: "1049 (Μυστική Πύλη)" },
];

export const BridgesTab: React.FC<BridgesTabProps> = ({
  savedItems,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [activeMode, setActiveMode] = useState<"math_bridges" | "cross_language" | "sentence_builder">("math_bridges");

  // Mode 1: Math Bridges State
  const [wordA, setWordA] = useState<string>("ΙΑΝΕΥΣ");
  const [wordB, setWordB] = useState<string>("ΤΕΛΙΑΝΟΣ");

  // Mode 2: Cross Language Gematria State
  const [crossGreekWord, setCrossGreekWord] = useState<string>("ΙΑΝΕΥΣ");
  const [crossEnglishPhrase, setCrossEnglishPhrase] = useState<string>("COMPUTER");
  const [crossEngSystem, setCrossEngSystem] = useState<"base6" | "simple">("base6");

  // Mode 3: Sentence Builder State
  const [targetSumInput, setTargetSumInput] = useState<string>("666");
  const [targetWordCount, setTargetWordCount] = useState<number>(2);
  const [savedSentenceFeedback, setSavedSentenceFeedback] = useState<string | null>(null);

  // Calculations for Word A (Greek)
  const analysisA = useMemo(() => {
    const val = calculateIsopsephy(wordA);
    const root = calculatePythmen(val);
    const breakdown = getWordLettersBreakdown(wordA);
    const greekNum = numberToGreekNumeral(val);
    const factors = getPrimeFactorization(val);
    return { word: wordA, val, root, breakdown, greekNum, factors };
  }, [wordA]);

  // Calculations for Word B (Greek)
  const analysisB = useMemo(() => {
    const val = calculateIsopsephy(wordB);
    const root = calculatePythmen(val);
    const breakdown = getWordLettersBreakdown(wordB);
    const greekNum = numberToGreekNumeral(val);
    const factors = getPrimeFactorization(val);
    return { word: wordB, val, root, breakdown, greekNum, factors };
  }, [wordB]);

  // Mathematical Relations
  const mathRelations = useMemo(() => {
    const sum = analysisA.val + analysisB.val;
    const diff = Math.abs(analysisA.val - analysisB.val);
    const product = analysisA.val * analysisB.val;
    const ratio = analysisB.val > 0 ? (analysisA.val / analysisB.val).toFixed(4) : "0";
    const inverseRatio = analysisA.val > 0 ? (analysisB.val / analysisA.val).toFixed(4) : "0";
    const gcd = calculateGCD(analysisA.val, analysisB.val);
    const lcm = calculateLCM(analysisA.val, analysisB.val);
    const sumRoot = calculatePythmen(sum);
    const diffRoot = calculatePythmen(diff);
    const sameRoot = analysisA.root === analysisB.root;

    return {
      sum,
      sumRoot,
      diff,
      diffRoot,
      product,
      ratio,
      inverseRatio,
      gcd,
      lcm,
      sameRoot,
    };
  }, [analysisA, analysisB]);

  // Bridge discovery in saved items
  const bridgeMatches = useMemo(() => {
    const { sum, diff, gcd } = mathRelations;
    const results: {
      type: "sum" | "diff" | "root" | "gcd";
      label: string;
      itemText: string;
      value: number;
      root: number;
      explanation: string;
    }[] = [];

    savedItems.forEach((item) => {
      if (item.value === sum) {
        results.push({
          type: "sum",
          label: `Άθροισμα (Α + Β = ${sum})`,
          itemText: item.text,
          value: item.value,
          root: item.root,
          explanation: `Η λέξη «${item.text}» ισούται με το άθροισμα των δύο εννοιών.`,
        });
      } else if (item.value === diff && diff > 0) {
        results.push({
          type: "diff",
          label: `Διαφορά (|Α - Β| = ${diff})`,
          itemText: item.text,
          value: item.value,
          root: item.root,
          explanation: `Η λέξη «${item.text}» γεφυρώνει τη διαφορά των δύο εννοιών.`,
        });
      } else if (item.value === gcd && gcd > 1) {
        results.push({
          type: "gcd",
          label: `Μέγιστος Κοινός Διαιρέτης (ΜΚΔ = ${gcd})`,
          itemText: item.text,
          value: item.value,
          root: item.root,
          explanation: `Κοινός θεμελιώδης αριθμητικός παρονομαστής.`,
        });
      } else if (item.root === analysisA.root && item.root === analysisB.root) {
        results.push({
          type: "root",
          label: `Κοινός Πυθμένας (${item.root})`,
          itemText: item.text,
          value: item.value,
          root: item.root,
          explanation: `Μοιράζεται τον ίδιο μονοψήφιο πυθμένα με τις δύο λέξεις.`,
        });
      }
    });

    return results;
  }, [analysisA, analysisB, mathRelations, savedItems]);

  // Mode 2 Calculations: Cross Language
  const crossGreekAnalysis = useMemo(() => {
    const val = calculateIsopsephy(crossGreekWord);
    const root = calculatePythmen(val);
    const breakdown = getWordLettersBreakdown(crossGreekWord);
    return { val, root, breakdown };
  }, [crossGreekWord]);

  const crossEnglishAnalysis = useMemo(() => {
    const clean = crossEnglishPhrase.toUpperCase().trim();
    const letters: Array<{ char: string; value: number }> = [];
    let sum = 0;
    const table = crossEngSystem === "base6" ? ENGLISH_BASE6_VALUES : ENGLISH_SIMPLE_VALUES;

    for (const char of clean) {
      if (char >= "A" && char <= "Z") {
        const v = table[char] || 0;
        sum += v;
        letters.push({ char, value: v });
      }
    }

    const root = calculatePythmen(sum);
    const translation = translateEnglishToGreek(clean);
    return { clean, sum, root, letters, translation };
  }, [crossEnglishPhrase, crossEngSystem]);

  // Automatic Cross-Language Bridge Discovery across user archive
  const crossLanguageMatches = useMemo(() => {
    // Group all saved items into Greek vs English/Crawler items
    const greekItems = savedItems.filter((i) => !/^[a-zA-Z\s]+$/.test(i.text.trim()));
    const englishItems = savedItems.filter((i) => /^[a-zA-Z\s]+$/.test(i.text.trim()));

    const exactMatches: Array<{
      value: number;
      greek: SavedIsopsephyItem;
      english: SavedIsopsephyItem;
    }> = [];

    greekItems.forEach((g) => {
      englishItems.forEach((e) => {
        if (g.value === e.value) {
          exactMatches.push({
            value: g.value,
            greek: g,
            english: e,
          });
        }
      });
    });

    return exactMatches;
  }, [savedItems]);

  // Mode 3 Calculations: Sentence Builder
  const targetNumParsed = parseInt(targetSumInput) || 666;
  const generatedSentences = useMemo(() => {
    if (targetNumParsed <= 0) return [];
    return generateIsopsephicSentences(targetNumParsed, {
      wordsCount: targetWordCount,
      customWords: savedItems.map((s) => ({ text: s.text, value: s.value, category: s.category })),
      maxResults: 60,
    });
  }, [targetNumParsed, targetWordCount, savedItems]);

  return (
    <div className="space-y-6">
      {/* Header & Sub-mode Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-[#c89b3c]" />
            <h2 className="text-xl font-serif font-bold text-[#f5ecd8]">
              Ισοψηφικές Γέφυρες & Σύνθεση
            </h2>
          </div>
          <p className="text-xs text-[#a69680]">
            Μαθηματικές συγκρίσεις, διεθνής αντιστοίχιση ελληνικών-αγγλικών όρων και γεννήτρια ισόψηφων συνδυασμών.
          </p>
        </div>

        {/* Sub-Mode Tabs */}
        <div className="flex bg-[#12100e] p-1 rounded-xl border border-[#2d251e] self-start md:self-auto">
          <button
            onClick={() => setActiveMode("math_bridges")}
            className={`px-3.5 py-2 rounded-lg text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "math_bridges"
                ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40 font-bold shadow-sm"
                : "text-[#8c7e6c] hover:text-[#e8dfd1]"
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Μαθηματικό Ζεύγος</span>
          </button>
          <button
            onClick={() => setActiveMode("cross_language")}
            className={`px-3.5 py-2 rounded-lg text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "cross_language"
                ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40 font-bold shadow-sm"
                : "text-[#8c7e6c] hover:text-[#e8dfd1]"
            }`}
          >
            <Languages className="w-4 h-4 text-cyan-400" />
            <span>Ελληνο-Αγγλική Γέφυρα</span>
          </button>
          <button
            onClick={() => setActiveMode("sentence_builder")}
            className={`px-3.5 py-2 rounded-lg text-xs font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeMode === "sentence_builder"
                ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40 font-bold shadow-sm"
                : "text-[#8c7e6c] hover:text-[#e8dfd1]"
            }`}
          >
            <Wand2 className="w-4 h-4 text-emerald-400" />
            <span>Γεννήτρια Προτάσεων</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: MATHEMATICAL HARMONY & PAIRS                                      */}
      {/* ========================================================================= */}
      {activeMode === "math_bridges" && (
        <div className="space-y-6">
          {/* Preset Pairs Bar */}
          <div className="p-4 rounded-xl bg-[#171410] border border-[#2a2016] space-y-2">
            <div className="text-xs font-serif text-[#8c7e6c] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Κλασικά & Αρχετυπικά Ζεύγη:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_PAIRS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setWordA(p.a);
                    setWordB(p.b);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#201912] hover:bg-[#2e2318] border border-[#3b2d1f] hover:border-[#c89b3c]/60 text-xs font-serif text-[#d6c7b2] transition-colors cursor-pointer"
                >
                  <strong className="text-[#e6c670]">{p.a}</strong> vs <strong className="text-[#e6c670]">{p.b}</strong>
                  <span className="text-[10px] text-[#8c7e6c] ml-1.5">({p.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dual Word Inputs & Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Word A */}
            <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-[#c89b3c] uppercase tracking-wider">
                  Όρος Α (Πρώτη Έννοια)
                </label>
                <span className="text-xs font-mono text-[#8c7e6c]">
                  Αριθμητικό: <strong className="text-[#e6c670]">{analysisA.greekNum}</strong>
                </span>
              </div>
              <input
                type="text"
                value={wordA}
                onChange={(e) => setWordA(e.target.value.toUpperCase())}
                placeholder="π.χ. ΙΑΝΕΥΣ, ΙΗΣΟΥΣ, ΦΩΣ..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1b1712] border border-[#382b1d] focus:border-[#c89b3c] text-[#f5ecd8] font-serif font-bold text-lg outline-none"
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#261e14] text-xs">
                <span className="text-[#8c7e6c]">Ισοψηφία: <strong className="text-xl text-[#e6c670] font-mono">{analysisA.val}</strong></span>
                <span className="text-[#8c7e6c]">Πυθμένας: <strong className="text-base text-[#f5ecd8] font-mono">{analysisA.root}</strong></span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {analysisA.breakdown.map((l, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#1e1913] border border-[#332517] text-[11px] font-mono text-[#d6c7b2]">
                    {l.char}={l.value}
                  </span>
                ))}
              </div>
            </div>

            {/* Word B */}
            <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-[#c89b3c] uppercase tracking-wider">
                  Όρος Β (Δεύτερη Έννοια)
                </label>
                <span className="text-xs font-mono text-[#8c7e6c]">
                  Αριθμητικό: <strong className="text-[#e6c670]">{analysisB.greekNum}</strong>
                </span>
              </div>
              <input
                type="text"
                value={wordB}
                onChange={(e) => setWordB(e.target.value.toUpperCase())}
                placeholder="π.χ. ΤΕΛΙΑΝΟΣ, ΧΡΙΣΤΟΣ, ΣΚΟΤΟΣ..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1b1712] border border-[#382b1d] focus:border-[#c89b3c] text-[#f5ecd8] font-serif font-bold text-lg outline-none"
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#261e14] text-xs">
                <span className="text-[#8c7e6c]">Ισοψηφία: <strong className="text-xl text-[#e6c670] font-mono">{analysisB.val}</strong></span>
                <span className="text-[#8c7e6c]">Πυθμένας: <strong className="text-base text-[#f5ecd8] font-mono">{analysisB.root}</strong></span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {analysisB.breakdown.map((l, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#1e1913] border border-[#332517] text-[11px] font-mono text-[#d6c7b2]">
                    {l.char}={l.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mathematical Relations Matrix */}
          <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Sigma className="w-5 h-5 text-[#c89b3c]" />
              <h3 className="text-base font-serif font-bold text-[#f5ecd8]">
                Μαθηματικές Σχέσεις & Αριθμητική Σύνθεση
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
                <div className="text-[11px] font-serif text-[#8c7e6c]">Άθροισμα (Α+Β)</div>
                <div className="text-xl font-serif font-extrabold text-[#e6c670]">{mathRelations.sum}</div>
                <div className="text-[10px] text-[#8c7e6c]">Πυθμένας: {mathRelations.sumRoot}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
                <div className="text-[11px] font-serif text-[#8c7e6c]">Διαφορά (|Α-Β|)</div>
                <div className="text-xl font-serif font-extrabold text-[#e6c670]">{mathRelations.diff}</div>
                <div className="text-[10px] text-[#8c7e6c]">Πυθμένας: {mathRelations.diffRoot}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
                <div className="text-[11px] font-serif text-[#8c7e6c]">Αναλογία (Α/Β)</div>
                <div className="text-xl font-serif font-extrabold text-[#f5ecd8]">{mathRelations.ratio}</div>
                <div className="text-[10px] text-[#8c7e6c]">Αντίστροφη: {mathRelations.inverseRatio}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
                <div className="text-[11px] font-serif text-[#8c7e6c]">ΜΚΔ (GCD)</div>
                <div className="text-xl font-serif font-extrabold text-[#e6c670]">{mathRelations.gcd}</div>
                <div className="text-[10px] text-[#8c7e6c]">Κοινός Διαιρέτης</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
                <div className="text-[11px] font-serif text-[#8c7e6c]">ΕΚΠ (LCM)</div>
                <div className="text-xl font-serif font-extrabold text-[#f5ecd8] truncate">{mathRelations.lcm}</div>
                <div className="text-[10px] text-[#8c7e6c]">Πολλαπλάσιο</div>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
                <div className="text-[11px] font-serif text-[#8c7e6c]">Πυθμένας</div>
                <div className={`text-sm font-serif font-bold ${mathRelations.sameRoot ? "text-emerald-400" : "text-[#d6c7b2]"}`}>
                  {mathRelations.sameRoot ? `Κοινός (${analysisA.root})` : `${analysisA.root} ↔ ${analysisB.root}`}
                </div>
                <div className="text-[10px] text-[#8c7e6c]">
                  {mathRelations.sameRoot ? "Ισοπύθμενοι" : "Διαφορετικός"}
                </div>
              </div>
            </div>
          </div>

          {/* Discovered Isopsephic Bridges in Saved Archive */}
          <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#c89b3c]" />
                <h3 className="text-base font-serif font-bold text-[#f5ecd8]">
                  Ανακαλυφθείσες Γέφυρες στο Αρχείο ({bridgeMatches.length})
                </h3>
              </div>
            </div>

            {bridgeMatches.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0e0c0a] border border-[#261e15] text-center space-y-1">
                <HelpCircle className="w-7 h-7 text-[#5a4c3a] mx-auto" />
                <p className="text-sm font-serif text-[#a69680]">
                  Δεν βρέθηκε αποθηκευμένη λέξη με αξία {mathRelations.sum} (άθροισμα) ή {mathRelations.diff} (διαφορά).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {bridgeMatches.map((bridge, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#1a1510] border border-[#382b1d] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#271d13] text-[#e6c670] border border-[#42311f]">
                        {bridge.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#e6c670]">
                        = {bridge.value}
                      </span>
                    </div>
                    <div className="text-lg font-serif font-bold text-[#f5ecd8]">
                      «{bridge.itemText}»
                    </div>
                    <p className="text-xs font-serif text-[#a69680]">
                      {bridge.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CROSS-LANGUAGE GEMATRIA MATRIX                                    */}
      {/* ========================================================================= */}
      {activeMode === "cross_language" && (
        <div className="space-y-6">
          {/* Quick Cross-Language Presets */}
          <div className="p-4 rounded-xl bg-[#171410] border border-[#2a2016] space-y-2">
            <div className="text-xs font-serif text-[#8c7e6c] flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>Διεθνή Ζεύγη Ισοψηφίας (Greek Ionian ↔ English Base 6):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_CROSS_PAIRS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCrossGreekWord(p.greek);
                    setCrossEnglishPhrase(p.english);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#192224] hover:bg-[#203135] border border-cyan-900/50 hover:border-cyan-500 text-xs font-serif text-cyan-200 transition-colors cursor-pointer"
                >
                  <strong>{p.greek}</strong> ↔ <strong>{p.english}</strong>
                  <span className="text-[10px] text-cyan-400/80 ml-1.5">({p.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dual Cross-Language Calculator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Greek Word Card */}
            <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-[#c89b3c] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🇬🇷 Ελληνική Λέξη (Ιωνική Αρίθμηση)</span>
                </label>
                <span className="text-xs font-mono text-[#8c7e6c]">
                  Πυθμένας: <strong className="text-[#f5ecd8]">{crossGreekAnalysis.root}</strong>
                </span>
              </div>
              <input
                type="text"
                value={crossGreekWord}
                onChange={(e) => setCrossGreekWord(e.target.value.toUpperCase())}
                placeholder="π.χ. ΙΑΝΕΥΣ, ΤΕΛΙΑΝΟΣ, ΘΕΟΣ..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1b1712] border border-[#382b1d] focus:border-[#c89b3c] text-[#f5ecd8] font-serif font-bold text-lg outline-none"
              />
              <div className="flex items-center justify-between pt-2 border-t border-[#261e14]">
                <span className="text-xs text-[#8c7e6c]">Ιωνική Ισοψηφία:</span>
                <span className="text-2xl font-serif font-black text-[#e6c670] font-mono">
                  {crossGreekAnalysis.val}
                </span>
              </div>
            </div>

            {/* English Phrase Card */}
            <div className="p-5 rounded-2xl bg-[#12161a] border border-cyan-900/40 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🇬🇧 Αγγλική Φράση (English Gematria)</span>
                </label>
                <select
                  value={crossEngSystem}
                  onChange={(e: any) => setCrossEngSystem(e.target.value)}
                  className="px-2 py-0.5 rounded bg-[#182329] border border-cyan-700/40 text-cyan-300 text-[11px] outline-none"
                >
                  <option value="base6">English Base 6 (A=6, B=12...)</option>
                  <option value="simple">Simple Gematria (A=1, B=2...)</option>
                </select>
              </div>
              <input
                type="text"
                value={crossEnglishPhrase}
                onChange={(e) => setCrossEnglishPhrase(e.target.value.toUpperCase())}
                placeholder="e.g. COMPUTER, PARTNERS, SACRED..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#162026] border border-cyan-900/60 focus:border-cyan-500 text-cyan-100 font-serif font-bold text-lg outline-none"
              />
              <div className="flex items-center justify-between pt-2 border-t border-cyan-900/30">
                <div className="text-xs text-cyan-400/80">
                  {crossEnglishAnalysis.translation && (
                    <span>Μετάφραση: <strong className="text-cyan-200">«{crossEnglishAnalysis.translation}»</strong></span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-cyan-400/80 mr-2">Αξία:</span>
                  <span className="text-2xl font-serif font-black text-cyan-300 font-mono">
                    {crossEnglishAnalysis.sum}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            crossGreekAnalysis.val === crossEnglishAnalysis.sum
              ? "bg-emerald-950/40 border-emerald-700 text-emerald-300"
              : "bg-[#16120e] border-[#2e2318] text-[#a69680]"
          }`}>
            <div className="flex items-center gap-3">
              {crossGreekAnalysis.val === crossEnglishAnalysis.sum ? (
                <Check className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              ) : (
                <GitCompare className="w-6 h-6 text-[#c89b3c] flex-shrink-0" />
              )}
              <div>
                <div className="font-serif font-bold text-sm text-[#f5ecd8]">
                  {crossGreekAnalysis.val === crossEnglishAnalysis.sum
                    ? `Απόλυτη Ισοψηφική Ταύτιση! (${crossGreekAnalysis.val} = ${crossEnglishAnalysis.sum})`
                    : `Διαφορά Αξίας: ${Math.abs(crossGreekAnalysis.val - crossEnglishAnalysis.sum)} μονάδες`}
                </div>
                <div className="text-xs text-[#a69680]">
                  «{crossGreekWord}» (Ελληνικά) ↔ «{crossEnglishPhrase}» (Αγγλικά)
                </div>
              </div>
            </div>
            {crossGreekAnalysis.val === crossEnglishAnalysis.sum && (
              <button
                onClick={() =>
                  onOpenAiModal(
                    `Ισοψηφική Σύγκριση: ${crossGreekWord} (Ιωνική: ${crossGreekAnalysis.val}) = ${crossEnglishPhrase} (English: ${crossEnglishAnalysis.sum})`,
                    crossGreekAnalysis.val,
                    [crossGreekWord, crossEnglishPhrase]
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500 text-emerald-200 text-xs font-serif font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ανάλυση Συσχέτισης</span>
              </button>
            )}
          </div>

          {/* Automatic Saved Library Matches */}
          <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-serif font-bold text-[#f5ecd8]">
                  Αυτόματες Ελληνο-Αγγλικές Γέφυρες στη Βιβλιοθήκη ({crossLanguageMatches.length})
                </h3>
              </div>
            </div>

            {crossLanguageMatches.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0e0c0a] border border-[#261e15] text-center space-y-1">
                <Languages className="w-7 h-7 text-[#5a4c3a] mx-auto" />
                <p className="text-sm font-serif text-[#a69680]">
                  Δεν βρέθηκαν ακόμη ζεύγη με την ίδια ακριβώς αξία μεταξύ ελληνικών και αγγλικών καταχωρίσεων.
                </p>
                <p className="text-xs text-[#736452]">
                  Αντλήστε αγγλικές φράσεις μέσω του URL Crawler για να εντοπίσετε αυτόματες αντιστοιχίσεις!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {crossLanguageMatches.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#161715] border border-[#353930] hover:border-cyan-500 transition-all space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-bold">
                        Κοινή Αξία: {m.value}
                      </span>
                      <span className="text-[#8c7e6c]">Πυθμένας: {m.greek.root}</span>
                    </div>
                    <div className="space-y-1 text-sm font-serif">
                      <div className="text-[#e6c670] font-bold">🇬🇷 {m.greek.text}</div>
                      <div className="text-cyan-300 font-bold">🇬🇧 {m.english.text}</div>
                      {m.english.notes && (
                        <div className="text-xs text-[#a69680] italic truncate">{m.english.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: ISOPSEPHIC SENTENCE & COMBINATION BUILDER                          */}
      {/* ========================================================================= */}
      {activeMode === "sentence_builder" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-serif font-bold text-[#f5ecd8]">
                    Γεννήτρια Ισόψηφων Προτάσεων & Συνδυασμών
                  </h3>
                </div>
                <p className="text-xs text-[#a69680]">
                  Συνθέτει έγκυρους λεξαριθμικούς συνδυασμούς που αθροίζουν επακριβώς στον αριθμό-στόχο.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[666, 888, 1000, 1049, 1480, 2024].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTargetSumInput(String(num))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      targetSumInput === String(num)
                        ? "bg-[#c89b3c]/20 text-[#e6c670] border border-[#c89b3c] font-bold"
                        : "bg-[#1a1612] text-[#8c7e6c] hover:text-[#d6c7b2] border border-[#33271c]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Target Sum & Word Count Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#261e14]">
              <div>
                <label className="text-xs font-serif text-[#c89b3c] font-bold block mb-1">
                  Αριθμός-Στόχος (Target Sum)
                </label>
                <input
                  type="number"
                  value={targetSumInput}
                  onChange={(e) => setTargetSumInput(e.target.value)}
                  min={10}
                  max={10000}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1b1712] border border-[#382b1d] focus:border-[#c89b3c] text-[#f5ecd8] font-mono font-bold text-base outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-serif text-[#c89b3c] font-bold block mb-1">
                  Πλήθος Λέξεων στη Σύνθεση
                </label>
                <div className="flex bg-[#1b1712] p-1 rounded-xl border border-[#382b1d]">
                  {[
                    { count: 2, label: "2 Λέξεις (Ζεύγος)" },
                    { count: 3, label: "3 Λέξεις (Τριάδα)" },
                    { count: 4, label: "4 Λέξεις (Τετράδα)" },
                  ].map((opt) => (
                    <button
                      key={opt.count}
                      onClick={() => setTargetWordCount(opt.count)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-serif transition-colors cursor-pointer ${
                        targetWordCount === opt.count
                          ? "bg-[#282116] text-[#e6c670] font-bold border border-[#c89b3c]/40"
                          : "text-[#8c7e6c] hover:text-[#d6c7b2]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {savedSentenceFeedback && (
            <div className="p-3 rounded-xl bg-green-950/40 border border-green-800 text-green-300 text-xs font-serif">
              {savedSentenceFeedback}
            </div>
          )}

          {/* Results Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-serif text-[#8c7e6c]">
              <span>Εντοπίστηκαν {generatedSentences.length} ισόψηφοι συνδυασμοί για το <strong>{targetNumParsed}</strong></span>
            </div>

            {generatedSentences.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#14120e] border border-[#2d241a] text-center space-y-2">
                <Wand2 className="w-8 h-8 text-[#5a4c3a] mx-auto" />
                <p className="text-sm font-serif text-[#a69680]">
                  Δεν βρέθηκε ακριβής συνδυασμός {targetWordCount} λέξεων που να ισούται με {targetNumParsed}.
                </p>
                <p className="text-xs text-[#736452]">
                  Δοκιμάστε άλλον αριθμό ή προσθέστε περισσότερες λέξεις στο Αρχείο σας!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedSentences.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 rounded-xl bg-[#1a1612] border border-[#382b1d] hover:border-[#c89b3c] transition-all space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                        Σύνολο = {match.totalSum}
                      </span>
                      <span className="text-xs font-mono text-[#8c7e6c]">
                        Πυθμένας: {match.root}
                      </span>
                    </div>

                    <div className="text-base font-serif font-bold text-[#f5ecd8] leading-snug">
                      «{match.fullSentence}»
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-wrap gap-1 text-[11px] font-mono text-[#a69680]">
                      {match.words.map((w, wIdx) => (
                        <span key={wIdx} className="px-2 py-0.5 rounded bg-[#120f0c] border border-[#2d241a]">
                          {w.text} ({w.value})
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#261e14] flex items-center justify-between">
                      <button
                        onClick={() =>
                          onOpenAiModal(
                            `Ερμηνεία Ισόψηφης Πρότασης: ${match.fullSentence} (Άθροισμα: ${match.totalSum})`,
                            match.totalSum,
                            match.words.map((w) => w.text)
                          )
                        }
                        className="text-xs text-[#c89b3c] hover:text-[#f4e2b7] font-serif font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ερμηνεία</span>
                      </button>

                      <button
                        onClick={() => {
                          onSaveItem({
                            text: match.fullSentence,
                            normalized: match.fullSentence,
                            value: match.totalSum,
                            root: match.root,
                            greekNumeral: match.greekNumeral,
                            isPhrase: true,
                            wordCount: match.wordCount,
                            category: "ΣΥΝΘΕΣΗ ΠΡΟΤΑΣΗΣ",
                            notes: `Σύνθεση ${match.wordCount} λέξεων με άθροισμα ${match.totalSum} (${match.words.map((w) => `${w.text}:${w.value}`).join(" + ")})`,
                          });
                          setSavedSentenceFeedback(`Αποθηκεύτηκε: «${match.fullSentence}» (${match.totalSum})`);
                          setTimeout(() => setSavedSentenceFeedback(null), 3000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#251e16] hover:bg-[#382b1d] border border-[#c89b3c]/40 text-[#e6c670] text-xs font-serif flex items-center gap-1 cursor-pointer"
                        title="Αποθήκευση στη Βιβλιοθήκη"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Αποθήκευση</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
