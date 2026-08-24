import React, { useState, useMemo } from "react";
import { SavedIsopsephyItem, WordIsopsephy } from "../types";
import {
  calculateIsopsephy,
  getWordLettersBreakdown,
  calculatePythmen,
  numberToGreekNumeral,
  calculateGCD,
  calculateLCM,
  getPrimeFactorization,
} from "../utils/isopsephy";
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

export const BridgesTab: React.FC<BridgesTabProps> = ({
  savedItems,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [wordA, setWordA] = useState<string>("ΙΑΝΕΥΣ");
  const [wordB, setWordB] = useState<string>("ΤΕΛΙΑΝΟΣ");
  const [filterBridgeCategory, setFilterBridgeCategory] = useState<string>("all");

  // Calculations for Word A
  const analysisA = useMemo(() => {
    const val = calculateIsopsephy(wordA);
    const root = calculatePythmen(val);
    const breakdown = getWordLettersBreakdown(wordA);
    const greekNum = numberToGreekNumeral(val);
    const factors = getPrimeFactorization(val);
    return { word: wordA, val, root, breakdown, greekNum, factors };
  }, [wordA]);

  // Calculations for Word B
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
    const goldenRatio = 1.618033;
    const ratioNum = analysisB.val > 0 ? analysisA.val / analysisB.val : 0;
    const isHarmonicGolden = Math.abs(ratioNum - goldenRatio) < 0.1 || Math.abs(1 / ratioNum - goldenRatio) < 0.1;

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
      isHarmonicGolden,
    };
  }, [analysisA, analysisB]);

  // Bridge discovery in saved items and canonical vocabulary
  const bridgeMatches = useMemo(() => {
    const { sum, diff, gcd } = mathRelations;
    const targetValues = new Set([analysisA.val, analysisB.val, sum, diff, gcd]);

    const results: {
      type: "sum" | "diff" | "root" | "gcd" | "exact";
      label: string;
      itemText: string;
      value: number;
      root: number;
      explanation: string;
    }[] = [];

    // Check saved items
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
          explanation: `Η λέξη «${item.text}» γεφυρώνει το κενό διαφοράς των δύο εννοιών.`,
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

  const handleSwap = () => {
    setWordA(wordB);
    setWordB(wordA);
  };

  const handleSelectPreset = (preset: { a: string; b: string }) => {
    setWordA(preset.a);
    setWordB(preset.b);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17140e] via-[#211a12] to-[#17140e] border border-[#3a2e20] shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#c89b3c]/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-[#2a2217] border border-[#c89b3c]/40 text-[#e6c670]">
                <GitCompare className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                Ισοψηφικές Γέφυρες & Συγκριτικός Πίνακας
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#a69680] font-serif">
              Συγκρίνετε ταυτόχρονα δύο λέξεις ή φράσεις, ανακαλύψτε τις μαθηματικές τους σχέσεις (Άθροισμα, Διαφορά, ΜΚΔ, Αναλογίες) και εντοπίστε ενδιάμεσες ισοψηφικές γέφυρες.
            </p>
          </div>

          <button
            onClick={() =>
              onOpenAiModal(
                `${wordA} + ${wordB}`,
                mathRelations.sum,
                [wordA, wordB]
              )
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#9c762b] hover:to-[#dbaa45] text-black font-serif font-bold text-xs shadow-lg shadow-[#c89b3c]/20 transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Σύνθεση Γέφυρας</span>
          </button>
        </div>

        {/* Preset Pairs Chips */}
        <div className="mt-4 pt-3 border-t border-[#2a2217] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-serif text-[#8c7e6c] uppercase tracking-wider shrink-0">
            Έτοιμα Ζεύγη:
          </span>
          {PRESET_PAIRS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-[#1a1510] hover:bg-[#281f15] border border-[#382b1d] text-xs font-serif text-[#d6c7b2] hover:text-[#e6c670] whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              title={p.desc}
            >
              <span className="font-bold text-[#e6c670]">{p.a}</span>
              <span className="text-[#8c7e6c]">↔</span>
              <span className="font-bold text-[#e6c670]">{p.b}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        {/* Word A Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#241d14] text-[#c89b3c] border border-[#3e3020]">
              Έννοια Α
            </span>
            <span className="text-xs font-mono text-[#8c7e6c]">
              Πυθμένας: <strong className="text-[#e6c670]">{analysisA.root}</strong>
            </span>
          </div>

          <div>
            <input
              type="text"
              value={wordA}
              onChange={(e) => setWordA(e.target.value)}
              placeholder="Πληκτρολογήστε 1η λέξη..."
              className="w-full px-4 py-3 rounded-xl bg-[#0e0c0a] border border-[#3d3121] text-[#f5ecd8] font-serif text-lg font-bold placeholder-[#5a4e3f] focus:outline-none focus:border-[#e6c670] focus:ring-1 focus:ring-[#e6c670] transition-all"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#1b1712] border border-[#2b2217] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-serif text-[#8c7e6c]">Ισοψηφία</div>
              <div className="text-2xl font-serif font-extrabold text-[#e6c670]">
                {analysisA.val}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-serif text-[#8c7e6c]">Ιωνικά Ψηφία</div>
              <div className="text-lg font-serif font-bold text-[#d6c7b2]">
                {analysisA.greekNum}
              </div>
            </div>
          </div>

          {/* Letter Breakdown */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {analysisA.breakdown.map((l, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-[#1e1913] border border-[#382b1d] text-xs font-serif inline-flex items-center gap-1"
              >
                <strong className="text-[#f5ecd8]">{l.char}</strong>
                <span className="text-[10px] font-mono text-[#c89b3c]">({l.value})</span>
              </span>
            ))}
          </div>

          {/* Factorization */}
          <div className="text-xs font-mono text-[#8c7e6c] flex items-center gap-1.5 flex-wrap">
            <span>Παράγοντες:</span>
            {analysisA.factors.map((f, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-[#0d0c0a] text-[#e6c670] border border-[#2d241a]">
                {f.factor}{f.power > 1 ? `^${f.power}` : ""}
              </span>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() =>
                onSaveItem({
                  text: analysisA.word,
                  normalized: analysisA.word,
                  value: analysisA.val,
                  root: analysisA.root,
                  greekNumeral: analysisA.greekNum,
                  isPhrase: analysisA.word.includes(" "),
                  wordCount: analysisA.word.split(/\s+/).filter(Boolean).length,
                  notes: `Αποθηκεύτηκε από τις Γέφυρες Ισοψηφίας`,
                  category: "Συγκρίσεις",
                })
              }
              className="w-full py-2 rounded-lg bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-xs font-serif text-[#e6c670] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Αποθήκευση Α</span>
            </button>
          </div>
        </div>

        {/* Swap / Center Action */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center gap-2">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-[#241c13] hover:bg-[#3a2d1d] border border-[#c89b3c]/50 text-[#e6c670] shadow-md transition-all hover:scale-110 cursor-pointer"
            title="Αντιμετάθεση Όρων (Swap)"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-serif text-[#8c7e6c] uppercase tracking-wider">
            Σχέση
          </span>
        </div>

        {/* Word B Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#241d14] text-[#c89b3c] border border-[#3e3020]">
              Έννοια Β
            </span>
            <span className="text-xs font-mono text-[#8c7e6c]">
              Πυθμένας: <strong className="text-[#e6c670]">{analysisB.root}</strong>
            </span>
          </div>

          <div>
            <input
              type="text"
              value={wordB}
              onChange={(e) => setWordB(e.target.value)}
              placeholder="Πληκτρολογήστε 2η λέξη..."
              className="w-full px-4 py-3 rounded-xl bg-[#0e0c0a] border border-[#3d3121] text-[#f5ecd8] font-serif text-lg font-bold placeholder-[#5a4e3f] focus:outline-none focus:border-[#e6c670] focus:ring-1 focus:ring-[#e6c670] transition-all"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#1b1712] border border-[#2b2217] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-serif text-[#8c7e6c]">Ισοψηφία</div>
              <div className="text-2xl font-serif font-extrabold text-[#e6c670]">
                {analysisB.val}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-serif text-[#8c7e6c]">Ιωνικά Ψηφία</div>
              <div className="text-lg font-serif font-bold text-[#d6c7b2]">
                {analysisB.greekNum}
              </div>
            </div>
          </div>

          {/* Letter Breakdown */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {analysisB.breakdown.map((l, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-[#1e1913] border border-[#382b1d] text-xs font-serif inline-flex items-center gap-1"
              >
                <strong className="text-[#f5ecd8]">{l.char}</strong>
                <span className="text-[10px] font-mono text-[#c89b3c]">({l.value})</span>
              </span>
            ))}
          </div>

          {/* Factorization */}
          <div className="text-xs font-mono text-[#8c7e6c] flex items-center gap-1.5 flex-wrap">
            <span>Παράγοντες:</span>
            {analysisB.factors.map((f, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-[#0d0c0a] text-[#e6c670] border border-[#2d241a]">
                {f.factor}{f.power > 1 ? `^${f.power}` : ""}
              </span>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() =>
                onSaveItem({
                  text: analysisB.word,
                  normalized: analysisB.word,
                  value: analysisB.val,
                  root: analysisB.root,
                  greekNumeral: analysisB.greekNum,
                  isPhrase: analysisB.word.includes(" "),
                  wordCount: analysisB.word.split(/\s+/).filter(Boolean).length,
                  notes: `Αποθηκεύτηκε από τις Γέφυρες Ισοψηφίας`,
                  category: "Συγκρίσεις",
                })
              }
              className="w-full py-2 rounded-lg bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-xs font-serif text-[#e6c670] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Αποθήκευση Β</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mathematical Synthesis Matrix */}
      <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Sigma className="w-5 h-5 text-[#c89b3c]" />
          <h3 className="text-lg font-serif font-bold text-[#f5ecd8]">
            Μαθηματικές Σχέσεις & Αριθμητική Σύνθεση
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Sum */}
          <div className="p-3.5 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
            <div className="text-[11px] font-serif text-[#8c7e6c] flex items-center gap-1">
              <Sigma className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Άθροισμα (Α + Β)</span>
            </div>
            <div className="text-xl font-serif font-extrabold text-[#e6c670]">
              {mathRelations.sum}
            </div>
            <div className="text-[10px] font-mono text-[#8c7e6c]">
              Πυθμένας: <strong className="text-[#f5ecd8]">{mathRelations.sumRoot}</strong>
            </div>
          </div>

          {/* Difference */}
          <div className="p-3.5 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
            <div className="text-[11px] font-serif text-[#8c7e6c] flex items-center gap-1">
              <Minus className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Διαφορά (|Α - Β|)</span>
            </div>
            <div className="text-xl font-serif font-extrabold text-[#e6c670]">
              {mathRelations.diff}
            </div>
            <div className="text-[10px] font-mono text-[#8c7e6c]">
              Πυθμένας: <strong className="text-[#f5ecd8]">{mathRelations.diffRoot}</strong>
            </div>
          </div>

          {/* Ratio */}
          <div className="p-3.5 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
            <div className="text-[11px] font-serif text-[#8c7e6c] flex items-center gap-1">
              <Divide className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Αναλογία (Α / Β)</span>
            </div>
            <div className="text-xl font-serif font-extrabold text-[#f5ecd8]">
              {mathRelations.ratio}
            </div>
            <div className="text-[10px] font-mono text-[#8c7e6c]">
              Αντίστροφη: {mathRelations.inverseRatio}
            </div>
          </div>

          {/* GCD (ΜΚΔ) */}
          <div className="p-3.5 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
            <div className="text-[11px] font-serif text-[#8c7e6c] flex items-center gap-1">
              <Binary className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>ΜΚΔ (GCD)</span>
            </div>
            <div className="text-xl font-serif font-extrabold text-[#e6c670]">
              {mathRelations.gcd}
            </div>
            <div className="text-[10px] font-mono text-[#8c7e6c]">
              Κοινός Διαιρέτης
            </div>
          </div>

          {/* LCM (ΕΚΠ) */}
          <div className="p-3.5 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
            <div className="text-[11px] font-serif text-[#8c7e6c] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>ΕΚΠ (LCM)</span>
            </div>
            <div className="text-xl font-serif font-extrabold text-[#f5ecd8] truncate" title={String(mathRelations.lcm)}>
              {mathRelations.lcm}
            </div>
            <div className="text-[10px] font-mono text-[#8c7e6c]">
              Ελάχ. Πολλαπλάσιο
            </div>
          </div>

          {/* Root Harmony */}
          <div className="p-3.5 rounded-xl bg-[#1a1611] border border-[#2d241a] space-y-1">
            <div className="text-[11px] font-serif text-[#8c7e6c] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Αρμονία Πυθμένα</span>
            </div>
            <div className={`text-sm font-serif font-bold ${mathRelations.sameRoot ? "text-emerald-400" : "text-[#d6c7b2]"}`}>
              {mathRelations.sameRoot ? `Κοινός (${analysisA.root})` : `${analysisA.root} ↔ ${analysisB.root}`}
            </div>
            <div className="text-[10px] font-serif text-[#8c7e6c]">
              {mathRelations.sameRoot ? "Ισοπύθμενοι Όροι" : "Διαφορετικός Πυθμένας"}
            </div>
          </div>
        </div>
      </div>

      {/* Discovered Isopsephic Bridges */}
      <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#c89b3c]" />
            <h3 className="text-lg font-serif font-bold text-[#f5ecd8]">
              Ανακαλυφθείσες Γέφυρες Ισοψηφίας στο Αρχείο
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8c7e6c]">
            {bridgeMatches.length} Γέφυρες εντοπίστηκαν
          </span>
        </div>

        {bridgeMatches.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#0e0c0a] border border-[#261e15] text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-[#5a4c3a] mx-auto" />
            <p className="text-sm font-serif text-[#a69680]">
              Δεν βρέθηκε ακόμη κάποια αποθηκευμένη λέξη που να ισούται ακριβώς με το Άθροισμα ({mathRelations.sum}), τη Διαφορά ({mathRelations.diff}) ή τον ΜΚΔ ({mathRelations.gcd}) αυτού του ζεύγους.
            </p>
            <p className="text-xs text-[#736452] font-serif">
              Προσθέστε περισσότερες λέξεις στο Αρχείο ή υπολογίστε νέους συνδυασμούς στην Αναζήτηση!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bridgeMatches.map((bridge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#1a1510] border border-[#382b1d] hover:border-[#c89b3c] transition-all space-y-2 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded bg-[#271d13] text-[#e6c670] font-bold border border-[#42311f]">
                    {bridge.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#e6c670]">
                    = {bridge.value}
                  </span>
                </div>

                <div className="text-lg font-serif font-bold text-[#f5ecd8]">
                  «{bridge.itemText}»
                </div>

                <p className="text-xs font-serif text-[#a69680] leading-relaxed">
                  {bridge.explanation}
                </p>

                <div className="pt-2 border-t border-[#2a2016] flex items-center justify-between text-xs">
                  <span className="text-[#8c7e6c] font-mono">
                    Πυθμένας: {bridge.root}
                  </span>
                  <button
                    onClick={() =>
                      onOpenAiModal(
                        `${wordA} ↔ ${bridge.itemText} ↔ ${wordB}`,
                        bridge.value,
                        [wordA, bridge.itemText, wordB]
                      )
                    }
                    className="text-[#c89b3c] hover:text-[#f4e2b7] font-serif font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ερμηνεία</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
