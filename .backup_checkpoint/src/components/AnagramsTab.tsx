import React, { useState, useMemo } from "react";
import { SavedIsopsephyItem } from "../types";
import {
  calculateIsopsephy,
  getWordLettersBreakdown,
  calculatePythmen,
  numberToGreekNumeral,
  generatePermutations,
  calculatePythagoreanMatrix,
} from "../utils/isopsephy";
import {
  Shuffle,
  Grid,
  Sparkles,
  BookmarkPlus,
  Copy,
  Check,
  Layers,
  Flame,
  Droplets,
  Globe,
  Wind,
  Info,
  Scale,
} from "lucide-react";

interface AnagramsTabProps {
  savedItems: SavedIsopsephyItem[];
  onSaveItem: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
}

const PRESET_WORDS = [
  { word: "ΙΑΝΕΥΣ", desc: "666 (Τέλειος Ιανός / Αλληγορία)" },
  { word: "ΤΕΛΙΑΝΟΣ", desc: "666 (Ολοκλήρωση)" },
  { word: "ΡΟΔΟΝ", desc: "294 (Μυστικιστικό Άνθος)" },
  { word: "ΕΡΩΣ", desc: "1105 (Κοσμογονική Δύναμη)" },
  { word: "ΑΛΗΘΕΙΑ", desc: "64 (Μη-λήθη)" },
  { word: "ΑΓΑΠΗ", desc: "93 (Υπέρτατη Ένωση)" },
  { word: "ΣΟΦΙΑ", desc: "781 (Θεία Γνώση)" },
  { word: "ΛΑΥΡΕΙΟΝ", desc: "666 (Αρχαία Μεταλλεία)" },
];

export const AnagramsTab: React.FC<AnagramsTabProps> = ({
  savedItems,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [inputWord, setInputWord] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"matrix" | "permutations">("matrix");

  const cleanWord = useMemo(() => {
    return inputWord.trim().toUpperCase();
  }, [inputWord]);

  const isopsephyVal = useMemo(() => calculateIsopsephy(cleanWord), [cleanWord]);
  const pythmenVal = useMemo(() => calculatePythmen(isopsephyVal), [isopsephyVal]);
  const greekNumeral = useMemo(() => numberToGreekNumeral(isopsephyVal), [isopsephyVal]);
  const breakdown = useMemo(() => getWordLettersBreakdown(cleanWord), [cleanWord]);

  // Matrix calculation
  const matrixData = useMemo(() => calculatePythagoreanMatrix(cleanWord), [cleanWord]);

  // Anagrams generation
  const permutations = useMemo(() => {
    return generatePermutations(cleanWord, 72);
  }, [cleanWord]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
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
                <Grid className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                Αναγραμματισμοί & Πυθαγόρειο Matrix
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#a69680] font-serif">
              Ανακαλύψτε τις δυνατές μεταθέσεις γραμμάτων (αναγραμματισμούς) και την στοιχειακή κατανομή των ψηφίων (Μονάδες, Δεκάδες, Εκατοντάδες / Γη, Ύδωρ, Πυρ).
            </p>
          </div>

          <button
            onClick={() => onOpenAiModal(cleanWord, isopsephyVal, [cleanWord])}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#9c762b] hover:to-[#dbaa45] text-black font-serif font-bold text-xs shadow-lg shadow-[#c89b3c]/20 transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Ανάλυση Matrix</span>
          </button>
        </div>

        {/* Preset Chips */}
        <div className="mt-4 pt-3 border-t border-[#2a2217] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-serif text-[#8c7e6c] uppercase tracking-wider shrink-0">
            Προτάσεις:
          </span>
          {PRESET_WORDS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setInputWord(p.word)}
              className="px-2.5 py-1 rounded-lg bg-[#1a1510] hover:bg-[#281f15] border border-[#382b1d] text-xs font-serif text-[#d6c7b2] hover:text-[#e6c670] whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              title={p.desc}
            >
              <span className="font-bold text-[#e6c670]">{p.word}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box & Stats Bar */}
      <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Πληκτρολογήστε λέξη για ανάλυση matrix..."
              className="w-full px-4 py-3.5 rounded-xl bg-[#0e0c0a] border border-[#3d3121] text-[#f5ecd8] font-serif text-xl font-bold tracking-wide placeholder-[#5a4e3f] focus:outline-none focus:border-[#e6c670] focus:ring-1 focus:ring-[#e6c670] transition-all"
            />
          </div>

          <button
            onClick={() =>
              onSaveItem({
                text: cleanWord,
                normalized: cleanWord,
                value: isopsephyVal,
                root: pythmenVal,
                greekNumeral: greekNumeral,
                isPhrase: cleanWord.includes(" "),
                wordCount: cleanWord.split(/\s+/).filter(Boolean).length,
                notes: `Αναλύθηκε στο Πυθαγόρειο Matrix & Αναγραμματισμούς`,
                category: "Matrix",
              })
            }
            className="px-4 py-3.5 rounded-xl bg-[#241c14] hover:bg-[#33281c] border border-[#3e3020] text-xs font-serif text-[#e6c670] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Αποθήκευση</span>
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] text-center">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Ισοψηφία</div>
            <div className="text-2xl font-serif font-extrabold text-[#e6c670]">
              {isopsephyVal}
            </div>
            <div className="text-[10px] font-mono text-[#8c7e6c]">{greekNumeral}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] text-center">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Πυθμένας (Root)</div>
            <div className="text-2xl font-serif font-extrabold text-[#f5ecd8]">
              {pythmenVal}
            </div>
            <div className="text-[10px] font-serif text-[#8c7e6c]">1-9 Μονοψήφιος</div>
          </div>

          <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] text-center">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Φωνήεντα / Σύμφωνα</div>
            <div className="text-xl font-serif font-bold text-[#38bdf8]">
              {matrixData.vowelsCount} <span className="text-[#8c7e6c]">/</span> {matrixData.consonantsCount}
            </div>
            <div className="text-[10px] font-mono text-[#8c7e6c]">
              Λόγος: {matrixData.vowelHarmonicRatio}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1a1611] border border-[#2d241a] text-center">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Αναγραμματισμοί</div>
            <div className="text-xl font-serif font-bold text-[#f59e0b]">
              {permutations.length}
            </div>
            <div className="text-[10px] font-serif text-[#8c7e6c]">
              Ισότιμες Μεταθέσεις
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-[#2d241a] pb-2">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "matrix"
              ? "bg-[#c89b3c] text-black shadow-md shadow-[#c89b3c]/20"
              : "text-[#a69680] hover:text-[#f5ecd8] hover:bg-[#1a1611]"
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Πυθαγόρειο Matrix 3×3 & Στοιχεία</span>
        </button>

        <button
          onClick={() => setActiveTab("permutations")}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "permutations"
              ? "bg-[#c89b3c] text-black shadow-md shadow-[#c89b3c]/20"
              : "text-[#a69680] hover:text-[#f5ecd8] hover:bg-[#1a1611]"
          }`}
        >
          <Shuffle className="w-4 h-4" />
          <span>Πίνακας Αναγραμματισμών ({permutations.length})</span>
        </button>
      </div>

      {/* TAB 1: Pythagorean Matrix 3x3 */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* 3x3 Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Monads - Earth */}
            <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] hover:border-emerald-500/50 transition-all space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                    <Globe className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#f5ecd8]">
                      Μονάδες (1 - 9)
                    </h4>
                    <span className="text-[10px] font-serif text-emerald-400">
                      Στοιχείο: Γη (Υλική Βάση)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {matrixData.monades.percentage.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0e0c0a] border border-[#261e15] flex items-center justify-between">
                <span className="text-xs font-serif text-[#8c7e6c]">Άθροισμα Μονάδων:</span>
                <span className="text-lg font-serif font-extrabold text-emerald-400">
                  {matrixData.monades.sum}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-serif text-[#8c7e6c]">
                  Περιεχόμενα Γράμματα ({matrixData.monades.count}):
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2 rounded-lg bg-[#1a1611] border border-[#2a2217]">
                  {matrixData.monades.letters.length === 0 ? (
                    <span className="text-xs text-[#5a4e3f] italic">Κανένα γράμμα</span>
                  ) : (
                    matrixData.monades.letters.map((l, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-serif inline-flex items-center gap-1"
                      >
                        <strong>{l.char}</strong>
                        <span className="text-[9px] font-mono text-emerald-500">={l.value}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Decades - Water/Air */}
            <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] hover:border-sky-500/50 transition-all space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-400">
                    <Droplets className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#f5ecd8]">
                      Δεκάδες (10 - 90)
                    </h4>
                    <span className="text-[10px] font-serif text-sky-400">
                      Στοιχείο: Ύδωρ / Αήρ (Ψυχικό)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {matrixData.dekades.percentage.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0e0c0a] border border-[#261e15] flex items-center justify-between">
                <span className="text-xs font-serif text-[#8c7e6c]">Άθροισμα Δεκάδων:</span>
                <span className="text-lg font-serif font-extrabold text-sky-400">
                  {matrixData.dekades.sum}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-serif text-[#8c7e6c]">
                  Περιεχόμενα Γράμματα ({matrixData.dekades.count}):
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2 rounded-lg bg-[#1a1611] border border-[#2a2217]">
                  {matrixData.dekades.letters.length === 0 ? (
                    <span className="text-xs text-[#5a4e3f] italic">Κανένα γράμμα</span>
                  ) : (
                    matrixData.dekades.letters.map((l, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs font-serif inline-flex items-center gap-1"
                      >
                        <strong>{l.char}</strong>
                        <span className="text-[9px] font-mono text-sky-400">={l.value}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Hundreds - Fire */}
            <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] hover:border-amber-500/50 transition-all space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#f5ecd8]">
                      Εκατοντάδες (100 - 900)
                    </h4>
                    <span className="text-[10px] font-serif text-amber-400">
                      Στοιχείο: Πυρ / Αιθήρ (Πνευματικό)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {matrixData.ekatontades.percentage.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0e0c0a] border border-[#261e15] flex items-center justify-between">
                <span className="text-xs font-serif text-[#8c7e6c]">Άθροισμα Εκατοντάδων:</span>
                <span className="text-lg font-serif font-extrabold text-amber-400">
                  {matrixData.ekatontades.sum}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-serif text-[#8c7e6c]">
                  Περιεχόμενα Γράμματα ({matrixData.ekatontades.count}):
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2 rounded-lg bg-[#1a1611] border border-[#2a2217]">
                  {matrixData.ekatontades.letters.length === 0 ? (
                    <span className="text-xs text-[#5a4e3f] italic">Κανένα γράμμα</span>
                  ) : (
                    matrixData.ekatontades.letters.map((l, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif inline-flex items-center gap-1"
                      >
                        <strong>{l.char}</strong>
                        <span className="text-[9px] font-mono text-amber-400">={l.value}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Elemental Distribution Bar */}
          <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] space-y-3">
            <div className="flex items-center justify-between text-xs font-serif text-[#a69680]">
              <span className="font-bold text-[#f5ecd8]">
                Ενεργειακή Κατανομή Στοιχείων Λέξης
              </span>
              <span>
                Σύνολο: <strong>{isopsephyVal}</strong>
              </span>
            </div>

            <div className="w-full h-4 rounded-full bg-[#0e0c0a] border border-[#2a2217] overflow-hidden flex">
              <div
                style={{ width: `${matrixData.monades.percentage}%` }}
                className="bg-emerald-500 transition-all"
                title={`Γη (Μονάδες): ${matrixData.monades.sum} (${matrixData.monades.percentage.toFixed(1)}%)`}
              />
              <div
                style={{ width: `${matrixData.dekades.percentage}%` }}
                className="bg-sky-500 transition-all"
                title={`Ύδωρ (Δεκάδες): ${matrixData.dekades.sum} (${matrixData.dekades.percentage.toFixed(1)}%)`}
              />
              <div
                style={{ width: `${matrixData.ekatontades.percentage}%` }}
                className="bg-amber-500 transition-all"
                title={`Πυρ (Εκατοντάδες): ${matrixData.ekatontades.sum} (${matrixData.ekatontades.percentage.toFixed(1)}%)`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-serif">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Γη: {matrixData.monades.percentage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Ύδωρ: {matrixData.dekades.percentage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Πυρ: {matrixData.ekatontades.percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Permutations / Anagrams Grid */}
      {activeTab === "permutations" && (
        <div className="p-5 rounded-2xl bg-[#14120e] border border-[#2d241a] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-[#c89b3c]" />
              <h3 className="text-lg font-serif font-bold text-[#f5ecd8]">
                Ισοψηφικοί Αναγραμματισμοί της λέξης «{cleanWord}»
              </h3>
            </div>
            <div className="text-xs font-mono text-[#e6c670] bg-[#1f1912] border border-[#3e3020] px-2.5 py-1 rounded-lg">
              Όλοι = {isopsephyVal} (Πυθμένας: {pythmenVal})
            </div>
          </div>

          <p className="text-xs font-serif text-[#a69680] leading-relaxed">
            💡 <strong>Ισοψηφικός Κανόνας:</strong> Στην αρχαιοελληνική ιωνική αρίθμηση, οποιαδήποτε αναδιάταξη των γραμμάτων μιας λέξης παράγει ακριβώς το ίδιο ισοψηφικό άθροισμα και τον ίδιο μονοψήφιο πυθμένα.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
            {permutations.map((perm, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#18140f] border border-[#2b2217] hover:border-[#c89b3c] transition-all flex items-center justify-between group"
              >
                <span className="font-serif font-bold text-sm text-[#f5ecd8] group-hover:text-[#e6c670]">
                  {perm}
                </span>
                <button
                  onClick={() => handleCopy(perm)}
                  className="p-1 rounded bg-[#241c14] hover:bg-[#33281c] text-[#a69680] hover:text-[#e6c670] transition-all cursor-pointer"
                  title="Αντιγραφή"
                >
                  {copiedText === perm ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
