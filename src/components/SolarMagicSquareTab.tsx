import React, { useState } from "react";
import {
  Sun,
  Sparkles,
  Layers,
  Calculator,
  Grid,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Compass,
  Zap,
  Info,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { numberToGreekNumeral } from "../utils/isopsephy";

interface SolarMagicSquareTabProps {
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
  onSaveItem?: (item: {
    text: string;
    normalized: string;
    value: number;
    root: number;
    greekNumeral: string;
    isPhrase: boolean;
    wordCount: number;
    category?: string;
    notes?: string;
  }) => void;
}

type ViewDisplayMode = "arabic" | "greek" | "pythmen" | "complementary";
type HighlightMode = "none" | "row" | "col" | "diag1" | "diag2" | "all_diags" | "custom";

// Classical 6x6 Magic Square of the Sun (Mensa Solis)
// Order n = 6, cells 1..36, Row/Col/Diag Sum = 111, Total = 666
const SOLAR_SQUARE_MATRIX = [
  [6, 32, 3, 34, 35, 1],
  [7, 11, 27, 28, 8, 30],
  [19, 14, 16, 15, 23, 24],
  [18, 20, 22, 21, 17, 13],
  [25, 29, 10, 9, 26, 12],
  [36, 5, 33, 4, 2, 31],
];

// Greek numeral representation for numbers 1 to 36
function getAncientGreekNumeral(num: number): string {
  if (num === 6) return "ϝ´ / ϛ´"; // Digamma / Stigma
  return numberToGreekNumeral(num);
}

// Calculate Pythagorean Pythmen (1-9)
function getPythmen(num: number): number {
  const mod = num % 9;
  return mod === 0 ? 9 : mod;
}

export const SolarMagicSquareTab: React.FC<SolarMagicSquareTabProps> = ({
  onOpenAiModal,
  onSaveItem,
}) => {
  const [displayMode, setDisplayMode] = useState<ViewDisplayMode>("arabic");
  const [highlightMode, setHighlightMode] = useState<HighlightMode>("none");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number; val: number } | null>({
    r: 0,
    c: 0,
    val: 6,
  });
  const [customSelectedCells, setCustomSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [copiedData, setCopiedData] = useState<boolean>(false);

  // Compute column sums
  const colSums = [0, 1, 2, 3, 4, 5].map((colIdx) =>
    SOLAR_SQUARE_MATRIX.reduce((acc, row) => acc + row[colIdx], 0)
  );

  // Compute row sums
  const rowSums = SOLAR_SQUARE_MATRIX.map((row) =>
    row.reduce((acc, val) => acc + val, 0)
  );

  // Compute main diagonals
  const diag1Values = [0, 1, 2, 3, 4, 5].map((i) => SOLAR_SQUARE_MATRIX[i][i]);
  const diag1Sum = diag1Values.reduce((a, b) => a + b, 0);

  const diag2Values = [0, 1, 2, 3, 4, 5].map((i) => SOLAR_SQUARE_MATRIX[i][5 - i]);
  const diag2Sum = diag2Values.reduce((a, b) => a + b, 0);

  const totalSum = rowSums.reduce((a, b) => a + b, 0);

  const isCellHighlighted = (r: number, c: number): boolean => {
    if (highlightMode === "row" && selectedRow === r) return true;
    if (highlightMode === "col" && selectedCol === c) return true;
    if (highlightMode === "diag1" && r === c) return true;
    if (highlightMode === "diag2" && r + c === 5) return true;
    if (highlightMode === "all_diags" && (r === c || r + c === 5)) return true;
    if (
      highlightMode === "custom" &&
      customSelectedCells.some((cell) => cell.r === r && cell.c === c)
    )
      return true;
    return false;
  };

  const handleCellClick = (r: number, c: number, val: number) => {
    setSelectedCell({ r, c, val });
    if (highlightMode === "custom") {
      setCustomSelectedCells((prev) => {
        const exists = prev.some((item) => item.r === r && item.c === c);
        if (exists) {
          return prev.filter((item) => !(item.r === r && item.c === c));
        } else {
          return [...prev, { r, c }];
        }
      });
    }
  };

  const handleCopyMatrix = () => {
    const text = SOLAR_SQUARE_MATRIX.map((row) => row.join("\t")).join("\n");
    navigator.clipboard.writeText(
      `ΜΑΓΙΚΟ ΤΕΤΡΑΓΩΝΟ ΤΟΥ ΗΛΙΟΥ (6x6 = 36 κελιά, Άθροισμα = 666, Σταθερά = 111)\n\n` + text
    );
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  // Custom selection sum
  const customSum = customSelectedCells.reduce(
    (acc, cell) => acc + SOLAR_SQUARE_MATRIX[cell.r][cell.c],
    0
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1c150e] via-[#14100c] to-[#0d0a07] border-2 border-[#c89b3c]/60 shadow-2xl shadow-black/60 space-y-4 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#c89b3c]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3b2914] via-[#52391b] to-[#261a0d] border border-[#ffd700]/70 flex items-center justify-center text-[#ffd700] shadow-lg shadow-[#c89b3c]/30 shrink-0">
              <Sun className="w-7 h-7 text-[#ffd700] animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-serif uppercase tracking-widest text-[#c89b3c] font-bold">
                  Ιερα Γεωμετρια & Πυθαγορεια Αριθμολογια
                </span>
                <span className="px-2 py-0.5 rounded bg-[#2a1d12] border border-[#442e1b] text-[10px] font-mono text-[#ffd700]">
                  Τάξη n = 6
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                Το Μαγικό Τετράγωνο του Ήλιου (6×6 = 36 Κελιά)
              </h2>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenAiModal && (
              <button
                type="button"
                onClick={() =>
                  onOpenAiModal(
                    "ΜΑΓΙΚΟ ΤΕΤΡΑΓΩΝΟ ΗΛΙΟΥ",
                    666,
                    ["ΗΛΙΟΣ", "ΙΑΝΕΥΣ", "ΤΕΤΡΑΓΩΝΟ", "ΕΚΑΤΟΝ ΕΝΔΕΚΑ"]
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2b1f13] to-[#3a2a19] border border-[#c89b3c] hover:border-[#ffd700] text-[#ffd700] text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Ερμηνεία 666</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyMatrix}
              className="px-3 py-2 rounded-xl bg-[#1c150e] hover:bg-[#2c2014] border border-[#3b2b1a] text-xs font-serif text-[#d6c7b2] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Αντιγραφή Πίνακα 6x6"
            >
              {copiedData ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Αντιγράφηκε!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span>Αντιγραφή</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Fundamental Equation description */}
        <p className="text-xs sm:text-sm font-serif text-[#ebd8c5] leading-relaxed relative z-10">
          Το αρχαίο <strong>Μαγικό Τετράγωνο του Ηλίου (Mensa Solis)</strong> αποτελείται από <strong>36 τετράγωνα</strong> (αριθμοί 1 έως 36).
          Το άθροισμα κάθε γραμμής, κάθε στήλης και των δύο κύριων διαγωνίων είναι αυστηρά <strong>111 (ρια´)</strong>,
          ενώ το συνολικό άθροισμα όλων των 36 κελλιών είναι <strong>6 × 111 = 666 (χξϛ´)</strong> — ο 36ος τρίγωνος αριθμός.
        </p>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 relative z-10">
          <div className="p-3.5 rounded-2xl bg-[#120d09]/90 border border-[#2d1e12] flex flex-col justify-between">
            <span className="text-[11px] font-serif text-[#a69680]">Μαγική Σταθερά (M)</span>
            <div className="text-2xl font-serif font-bold text-[#ffd700] mt-1">111</div>
            <span className="text-[10px] font-mono text-[#c89b3c]">Κάθε Γραμμή, Στήλη & Διαγώνιος</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#120d09]/90 border border-[#2d1e12] flex flex-col justify-between">
            <span className="text-[11px] font-serif text-[#a69680]">Συνολικό Άθροισμα (S)</span>
            <div className="text-2xl font-serif font-bold text-[#ff8c42] mt-1">666</div>
            <span className="text-[10px] font-mono text-[#c89b3c]">6 × 111 = Σ(1..36) = T₃₆</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#120d09]/90 border border-[#2d1e12] flex flex-col justify-between">
            <span className="text-[11px] font-serif text-[#a69680]">Πλήθος Κελλιών</span>
            <div className="text-2xl font-serif font-bold text-[#38bdf8] mt-1">36 (6×6)</div>
            <span className="text-[10px] font-serif text-[#8c7a68]">36 Δεκανοί του Ζωδιακού</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#120d09]/90 border border-[#2d1e12] flex flex-col justify-between">
            <span className="text-[11px] font-serif text-[#a69680]">Συμπληρωματικά Ζεύγη</span>
            <div className="text-2xl font-serif font-bold text-[#ec4899] mt-1">37 (n²+1)</div>
            <span className="text-[10px] font-serif text-[#8c7a68]">Κάθε αντικριστό ζεύγος = 37</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area: Left Controls & Right Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Controls, Highlighting & Selection Details (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Display Mode Switcher */}
          <div className="p-4 rounded-2xl bg-[#15100c] border border-[#2e2115] space-y-2.5">
            <h4 className="text-xs font-serif font-bold text-[#c89b3c] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Τρόπος Προβολής Αριθμών</span>
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "arabic" as ViewDisplayMode, label: "Αραβικοί (1-36)" },
                { id: "greek" as ViewDisplayMode, label: "Ελληνικά (α´-λϛ´)" },
                { id: "pythmen" as ViewDisplayMode, label: "Πυθμένας (1-9)" },
                { id: "complementary" as ViewDisplayMode, label: "Ζεύγος (37 - x)" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setDisplayMode(mode.id)}
                  className={`p-2 rounded-xl text-xs font-serif transition-all cursor-pointer text-center ${
                    displayMode === mode.id
                      ? "bg-[#c89b3c] text-[#120f0c] font-bold shadow-md shadow-[#c89b3c]/20"
                      : "bg-[#1c150e] text-[#a69680] border border-[#2e2115] hover:border-[#c89b3c]/50"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Highlight Modes */}
          <div className="p-4 rounded-2xl bg-[#15100c] border border-[#2e2115] space-y-2.5">
            <h4 className="text-xs font-serif font-bold text-[#c89b3c] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>Φωτισμός & Επαλήθευση (111)</span>
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-serif">
              <button
                type="button"
                onClick={() => {
                  setHighlightMode("all_diags");
                  setSelectedRow(null);
                  setSelectedCol(null);
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  highlightMode === "all_diags"
                    ? "bg-[#332213] border-[#ffd700] text-[#ffd700] font-bold"
                    : "bg-[#1c150e] border-[#2e2115] text-[#d6c7b2] hover:border-[#c89b3c]"
                }`}
              >
                ⚔️ Και οι 2 Διαγώνιοι
              </button>

              <button
                type="button"
                onClick={() => {
                  setHighlightMode("diag1");
                  setSelectedRow(null);
                  setSelectedCol(null);
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  highlightMode === "diag1"
                    ? "bg-[#332213] border-[#ffd700] text-[#ffd700] font-bold"
                    : "bg-[#1c150e] border-[#2e2115] text-[#d6c7b2] hover:border-[#c89b3c]"
                }`}
              >
                ↘️ Κύρια Διαγώνιος
              </button>

              <button
                type="button"
                onClick={() => {
                  setHighlightMode("diag2");
                  setSelectedRow(null);
                  setSelectedCol(null);
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  highlightMode === "diag2"
                    ? "bg-[#332213] border-[#ffd700] text-[#ffd700] font-bold"
                    : "bg-[#1c150e] border-[#2e2115] text-[#d6c7b2] hover:border-[#c89b3c]"
                }`}
              >
                ↙️ Αντιδιαγώνιος
              </button>

              <button
                type="button"
                onClick={() => {
                  setHighlightMode("custom");
                  setSelectedRow(null);
                  setSelectedCol(null);
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  highlightMode === "custom"
                    ? "bg-[#332213] border-[#ffd700] text-[#ffd700] font-bold"
                    : "bg-[#1c150e] border-[#2e2115] text-[#d6c7b2] hover:border-[#c89b3c]"
                }`}
              >
                👆 Επιλογή Κελλιών ({customSelectedCells.length})
              </button>
            </div>

            {highlightMode !== "none" && (
              <button
                type="button"
                onClick={() => {
                  setHighlightMode("none");
                  setSelectedRow(null);
                  setSelectedCol(null);
                  setCustomSelectedCells([]);
                }}
                className="w-full py-1.5 rounded-lg bg-[#1a120b] hover:bg-[#251b10] border border-[#332415] text-[11px] font-serif text-[#a69680] hover:text-[#f5ecd8] transition-colors cursor-pointer"
              >
                Επαναφορά Φωτισμού
              </button>
            )}
          </div>

          {/* Selected Cell Inspector */}
          {selectedCell && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1c150e] to-[#120d09] border border-[#3d2b1a] space-y-3">
              <div className="flex items-center justify-between border-b border-[#2d2014] pb-2">
                <span className="text-xs font-serif font-bold text-[#c89b3c] uppercase tracking-wider">
                  Αναλυση Κελλιου [{selectedCell.r + 1}, {selectedCell.c + 1}]
                </span>
                <span className="text-xs font-mono font-bold text-[#ffd700]">
                  Αριθμός {selectedCell.val}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                <div className="p-2.5 rounded-xl bg-[#140e09] border border-[#251a10] space-y-0.5">
                  <span className="text-[10px] text-[#8c7a68]">Ελληνικό Ψηφίο:</span>
                  <div className="text-base font-bold text-[#ffd700]">
                    {getAncientGreekNumeral(selectedCell.val)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#140e09] border border-[#251a10] space-y-0.5">
                  <span className="text-[10px] text-[#8c7a68]">Πυθμένας (Ρίζα):</span>
                  <div className="text-base font-bold text-[#38bdf8]">
                    {getPythmen(selectedCell.val)}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#140e09] border border-[#251a10] space-y-0.5">
                  <span className="text-[10px] text-[#8c7a68]">Συμπληρωματικό (37):</span>
                  <div className="text-base font-bold text-[#ec4899]">
                    {37 - selectedCell.val}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#140e09] border border-[#251a10] space-y-0.5">
                  <span className="text-[10px] text-[#8c7a68]">Αντίθετη Θέση:</span>
                  <div className="text-base font-mono font-bold text-[#f5ecd8]">
                    [{6 - selectedCell.r}, {6 - selectedCell.c}]
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-serif text-[#a69680] leading-relaxed">
                💡 Κάθε αριθμός $x$ στο τετράγωνο του Ηλίου έχει ένα διαμετρικά αντίθετο κελί με τιμή $37 - x$, έτσι ώστε $x + (37 - x) = 37$.
              </p>
            </div>
          )}

          {/* Custom Selection Sum Box */}
          {highlightMode === "custom" && customSelectedCells.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#1f150c] border-2 border-[#ffd700]/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#ffd700]">
                  Επιλεγμένα Κελιά ({customSelectedCells.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setCustomSelectedCells([])}
                  className="text-[10px] text-[#a69680] hover:text-[#f5ecd8] underline"
                >
                  Καθαρισμός
                </button>
              </div>
              <div className="flex items-center justify-between text-sm font-mono font-bold">
                <span className="text-[#d6c7b2]">Άθροισμα:</span>
                <span className="text-xl text-[#ffd700]">{customSum}</span>
              </div>
              <div className="text-[11px] font-serif text-[#a69680]">
                Πυθμένας: {getPythmen(customSum)} • Ελληνικό: {numberToGreekNumeral(customSum)}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: The 6x6 Magic Square Grid with Row & Column Sums (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 sm:p-6 rounded-3xl bg-[#14100c] border-2 border-[#382717] shadow-2xl relative">
            
            {/* Header description of the grid */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#291c10]">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#c89b3c]" />
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#f5ecd8]">
                  Πίνακας 6 × 6: Επαλήθευση Γραμμών, Στηλών & Διαγωνίων
                </h3>
              </div>
              <span className="text-xs font-mono text-[#ffd700] font-bold">
                Σ = 666
              </span>
            </div>

            {/* Scrollable Container for the Matrix */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-[560px] w-full">
                
                {/* Column Headers (1 to 6) with Click to highlight */}
                <div className="grid grid-cols-8 gap-2 mb-2 text-center">
                  <div className="text-[10px] font-serif text-[#705e4d] flex items-center justify-center">
                    Γραμμές
                  </div>
                  {[0, 1, 2, 3, 4, 5].map((colIdx) => (
                    <button
                      key={`col-btn-${colIdx}`}
                      type="button"
                      onClick={() => {
                        setHighlightMode("col");
                        setSelectedCol(colIdx);
                        setSelectedRow(null);
                      }}
                      className={`py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                        highlightMode === "col" && selectedCol === colIdx
                          ? "bg-[#c89b3c] text-[#120f0c] font-bold shadow-md shadow-[#c89b3c]/20"
                          : "bg-[#1b140e] text-[#a69680] hover:text-[#ffd700] border border-[#2b1f13] hover:border-[#c89b3c]/60"
                      }`}
                      title={`Φωτισμός Στήλης ${colIdx + 1}`}
                    >
                      Στήλη {colIdx + 1}
                    </button>
                  ))}
                  <div className="text-[10px] font-serif font-bold text-[#c89b3c] flex items-center justify-center">
                    Άθροισμα
                  </div>
                </div>

                {/* 6 Rows */}
                <div className="space-y-2">
                  {SOLAR_SQUARE_MATRIX.map((row, rIdx) => {
                    const isRowActive = highlightMode === "row" && selectedRow === rIdx;
                    return (
                      <div key={`row-${rIdx}`} className="grid grid-cols-8 gap-2 items-center">
                        {/* Row Selector Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setHighlightMode("row");
                            setSelectedRow(rIdx);
                            setSelectedCol(null);
                          }}
                          className={`py-2 rounded-xl text-xs font-serif transition-all cursor-pointer flex items-center justify-center ${
                            isRowActive
                              ? "bg-[#c89b3c] text-[#120f0c] font-bold shadow-md shadow-[#c89b3c]/20"
                              : "bg-[#1b140e] text-[#a69680] hover:text-[#ffd700] border border-[#2b1f13] hover:border-[#c89b3c]/60"
                          }`}
                          title={`Φωτισμός Σειράς ${rIdx + 1}`}
                        >
                          Σειρά {rIdx + 1}
                        </button>

                        {/* 6 Cells in Row */}
                        {row.map((val, cIdx) => {
                          const isHighlighted = isCellHighlighted(rIdx, cIdx);
                          const isSelected =
                            selectedCell?.r === rIdx && selectedCell?.c === cIdx;
                          const isDiag1 = rIdx === cIdx;
                          const isDiag2 = rIdx + cIdx === 5;

                          // Format cell text based on displayMode
                          let cellContent = String(val);
                          let subContent = "";
                          if (displayMode === "greek") {
                            cellContent = getAncientGreekNumeral(val);
                            subContent = String(val);
                          } else if (displayMode === "pythmen") {
                            cellContent = String(getPythmen(val));
                            subContent = `Αξ: ${val}`;
                          } else if (displayMode === "complementary") {
                            cellContent = String(37 - val);
                            subContent = `${val}+${37 - val}=37`;
                          }

                          return (
                            <button
                              key={`cell-${rIdx}-${cIdx}`}
                              type="button"
                              onClick={() => handleCellClick(rIdx, cIdx, val)}
                              className={`aspect-square sm:aspect-auto sm:py-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer relative group ${
                                isSelected
                                  ? "ring-2 ring-[#ffd700] ring-offset-2 ring-offset-[#14100c] z-20 scale-105"
                                  : ""
                              } ${
                                isHighlighted
                                  ? "bg-gradient-to-br from-[#3b2713] via-[#4d3319] to-[#2b1a0b] border-[#ffd700] text-[#ffd700] shadow-lg shadow-[#c89b3c]/25 scale-105"
                                  : "bg-[#19120c] border-[#291d12] hover:border-[#c89b3c]/70 text-[#f5ecd8] hover:bg-[#24190f]"
                              }`}
                            >
                              {/* Diagonal Indicators */}
                              {(isDiag1 || isDiag2) && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#c89b3c]/70" />
                              )}

                              <span
                                className={`font-serif font-bold transition-transform ${
                                  displayMode === "greek"
                                    ? "text-xs sm:text-sm"
                                    : "text-sm sm:text-base"
                                } ${isHighlighted ? "text-[#ffd700]" : "text-[#f5ecd8]"}`}
                              >
                                {cellContent}
                              </span>

                              {subContent && (
                                <span className="text-[9px] font-mono text-[#8c7a68] mt-0.5">
                                  {subContent}
                                </span>
                              )}
                            </button>
                          );
                        })}

                        {/* Row Sum Badge */}
                        <div className="py-2.5 rounded-xl bg-[#1f150c] border border-[#3d2b18] text-center flex flex-col items-center justify-center">
                          <span className="text-xs font-mono font-bold text-[#ffd700]">
                            = 111
                          </span>
                          <span className="text-[9px] font-serif text-[#8c7a68]">
                            (ρια´)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Column Sums Footer Row */}
                <div className="grid grid-cols-8 gap-2 mt-3 pt-3 border-t border-[#291c10] items-center">
                  <div className="text-[11px] font-serif font-bold text-[#c89b3c] flex items-center justify-center">
                    Άθροισμα:
                  </div>

                  {colSums.map((sum, cIdx) => (
                    <div
                      key={`col-sum-${cIdx}`}
                      className="py-2 rounded-xl bg-[#1f150c] border border-[#3d2b18] text-center flex flex-col items-center justify-center"
                    >
                      <span className="text-xs font-mono font-bold text-[#ffd700]">
                        = {sum}
                      </span>
                      <span className="text-[9px] font-serif text-[#8c7a68]">
                        (ρια´)
                      </span>
                    </div>
                  ))}

                  {/* Master Total 666 Badge */}
                  <div className="py-2 rounded-xl bg-gradient-to-r from-[#3b2713] to-[#4d3319] border-2 border-[#ffd700] text-center flex flex-col items-center justify-center shadow-lg shadow-[#c89b3c]/20">
                    <span className="text-sm font-mono font-bold text-[#ffd700]">
                      666
                    </span>
                    <span className="text-[9px] font-serif text-[#f5ecd8]">
                      (χξϛ´)
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Diagonal Sum Callout */}
            <div className="mt-4 p-3 rounded-2xl bg-[#0f0b07] border border-[#24190e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                <span className="text-[#ebd8c5]">
                  <strong>Κύριες Διαγώνιοι:</strong> 6 + 11 + 16 + 21 + 26 + 31 = <strong className="text-[#ffd700]">111</strong> | 1 + 8 + 15 + 22 + 29 + 36 = <strong className="text-[#ffd700]">111</strong>
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#c89b3c]">
                Πυθμένας 111: 1+1+1 = 3 (Τριάς)
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Deep Mathematical & Esoteric Solar Harmony Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#15100c] border border-[#332415] space-y-6">
        <div className="flex items-center gap-3 border-b border-[#291c10] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#24180d] border border-[#c89b3c]/60 flex items-center justify-center text-[#ffd700]">
            <Compass className="w-5 h-5 text-[#ffd700]" />
          </div>
          <div>
            <div className="text-[11px] font-serif uppercase tracking-widest text-[#c89b3c] font-bold">
              Μυστικιστικη & Αστρονομικη Αρμονια
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#f5ecd8]">
              Η Σφραγίδα του Ηλίου, οι 36 Δεκανοί & η Ισοψηφία
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-serif leading-relaxed">
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-[#1a120b] border border-[#2b1e12] space-y-2">
            <h4 className="text-sm font-bold text-[#ffd700] flex items-center gap-1.5">
              <span>☀️</span> 1. Οι 36 Δεκανοί του Ήλιου
            </h4>
            <p className="text-[#c5b59e]">
              Στην αρχαία ελληνική και αιγυπτιακή αστρονομία, ο ζωδιακός κύκλος των 360° χωρίζεται σε <strong>36 δεκανούς</strong> (36 τμήματα των 10°).
              Κάθε δεκανός εποπτεύεται από ένα φωτεινό άστρο και αντιστοιχεί ακριβώς στα <strong>36 κελιά</strong> του Ηλιακού Τετραγώνου.
            </p>
            <div className="p-2 rounded-xl bg-[#100b07] border border-[#26190d] text-[11px] text-[#ebd8c5]">
              <strong>36 × 10° = 360°</strong> (Ολοκλήρωση του ετήσιου ηλιακού κύκλου).
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-[#1a120b] border border-[#2b1e12] space-y-2">
            <h4 className="text-sm font-bold text-[#ffd700] flex items-center gap-1.5">
              <span>🏛️</span> 2. Ισοψηφική Ταυτότητα (666 & 888)
            </h4>
            <p className="text-[#c5b59e]">
              Στην ιερά ισοψηφία:
            </p>
            <ul className="space-y-1 text-[#ebd8c5] font-mono text-[11px]">
              <li>• <strong>ΙΑΝΕΥΣ</strong> = 666 (Φύλακας των Πυλών του Χρόνου)</li>
              <li>• <strong>ΗΛΙΟΣ</strong> = 318 (Νοητό Φως & Αγαθόν)</li>
              <li>• <strong>ΩΛΗΝ</strong> = 888 = <strong>ΙΗΣΟΥΣ</strong> (Υπερβόρεια Ογδοάς)</li>
              <li>• <strong>111 × 6</strong> = 666 | <strong>111 × 8</strong> = 888</li>
            </ul>
            <p className="text-[#a69680] text-[11px]">
              Το 111 (άθροισμα γραμμής) είναι η κοινή τριαδική βάση που γεννά τόσο το 666 (ηλιακό υλικό κάτοπτρο) όσο και το 888 (πνευματική ανάσταση).
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-[#1a120b] border border-[#2b1e12] space-y-2">
            <h4 className="text-sm font-bold text-[#ffd700] flex items-center gap-1.5">
              <span>📐</span> 3. Συμπληρωματικότητα του 37
            </h4>
            <p className="text-[#c5b59e]">
              Ο αριθμός <strong>37</strong> είναι ο πρωταρχικός παράγοντας του 111 και του 666:
            </p>
            <ul className="space-y-1 text-[#ebd8c5] font-mono text-[11px]">
              <li>• 37 × 3 = <strong>111</strong></li>
              <li>• 37 × 18 = <strong>666</strong></li>
              <li>• 37 × 24 = <strong>888</strong></li>
            </ul>
            <p className="text-[#a69680] text-[11px]">
              Στο τετράγωνο, κάθε κελί και το διαμετρικά αντίθετό του έχουν άθροισμα ακριβώς <strong>37</strong> (1+36, 2+35, 3+34 ... 18+19 = 37).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
