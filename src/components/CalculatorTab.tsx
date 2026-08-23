import React, { useState, useEffect } from "react";
import { evaluateIsopsephyExpression, numberToGreekNumeral, getMathematicalProperties, calculateWordIsopsephy } from "../utils/isopsephy";
import { SavedIsopsephyItem, WordIsopsephy } from "../types";
import { Bookmark, Copy, Check, Sparkles, Trash2, ArrowRight, Info, HelpCircle } from "lucide-react";

interface CalculatorTabProps {
  onSaveItem: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
  savedItems: SavedIsopsephyItem[];
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  onSaveItem,
  onOpenAiModal,
  savedItems,
}) => {
  const [inputExpression, setInputExpression] = useState<string>("ΙΩΑΝΝΗΣ");
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [recentHistory, setRecentHistory] = useState<string[]>([
    "ΙΩΑΝΝΗΣ",
    "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ",
    "ΛΑΥΡΕΙΟΝ",
    "ΑΜΑΡΤΙΑ",
    "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ",
    "ΙΗΣΟΥΣ",
    "ΧΡΙΣΤΟΣ",
  ]);

  const result = evaluateIsopsephyExpression(inputExpression);
  const mathProps = getMathematicalProperties(result.finalValue);
  const greekNumeral = numberToGreekNumeral(result.finalValue);

  // Check if currently displayed item is already saved
  const isAlreadySaved = savedItems.some(
    (item) => item.text.trim().toUpperCase() === inputExpression.trim().toUpperCase() && item.value === result.finalValue
  );

  const handleInsertChar = (char: string) => {
    setInputExpression((prev) => prev + char);
  };

  const handleCopy = () => {
    if (!result.finalValue) return;
    const textToCopy = `${inputExpression.trim()} = ${result.finalValue} (${greekNumeral}) [Πυθμένας: ${mathProps.pythmen}] | ${result.stepsExplanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!inputExpression.trim() || result.finalValue <= 0) return;
    
    onSaveItem({
      text: inputExpression.trim(),
      normalized: inputExpression.trim().toUpperCase(),
      value: result.finalValue,
      root: mathProps.pythmen,
      greekNumeral: greekNumeral || `${result.finalValue}`,
      isPhrase: result.wordBreakdowns.length > 1,
      wordCount: result.wordBreakdowns.length || 1,
      category: "Υπολογισμός",
      notes: `Υπολογισμός: ${result.stepsExplanation || inputExpression}`,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);

    // Add to recent history if not exists
    if (!recentHistory.includes(inputExpression.trim())) {
      setRecentHistory((prev) => [inputExpression.trim(), ...prev.slice(0, 7)]);
    }
  };

  const handleQuickPreset = (term: string) => {
    setInputExpression(term);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner / Description */}
      <div className="p-4 rounded-2xl bg-[#181512] border border-[#2d251e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
            <span>Άμεσος Υπολογιστής Ισοψηφίας</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#2a2219] text-[#c89b3c] border border-[#4a3a29] font-mono">
              Ιωνικός Κανόνας
            </span>
          </h2>
          <p className="text-xs text-[#a69680] mt-0.5">
            Πληκτρολογήστε οποιαδήποτε ελληνική λέξη, πολυτονικό κείμενο ή μαθηματική πράξη (π.χ. «ΙΗΣΟΥΣ», «888 + 1480», «ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ»).
          </p>
        </div>

        {/* Quick Archaic Keypad Insert */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#12100e] p-2 rounded-xl border border-[#2a2218]">
          <span className="text-[11px] font-mono text-[#8c7e6c] px-1 mr-1">Αρχαία Ψηφία:</span>
          <button
            onClick={() => handleInsertChar("Ϛ")}
            id="btn-insert-stigma"
            className="px-2 py-1 rounded bg-[#231d17] hover:bg-[#342b20] border border-[#3e3223] text-[#e6c670] text-xs font-serif font-bold transition-colors"
            title="Στίγμα / Δίγαμμα = 6"
          >
            Ϛ <span className="text-[10px] text-[#9c8973] font-normal font-sans">(6)</span>
          </button>
          <button
            onClick={() => handleInsertChar("Ϟ")}
            id="btn-insert-koppa"
            className="px-2 py-1 rounded bg-[#231d17] hover:bg-[#342b20] border border-[#3e3223] text-[#e6c670] text-xs font-serif font-bold transition-colors"
            title="Κόππα = 90"
          >
            Ϟ <span className="text-[10px] text-[#9c8973] font-normal font-sans">(90)</span>
          </button>
          <button
            onClick={() => handleInsertChar("Ϡ")}
            id="btn-insert-sampi"
            className="px-2 py-1 rounded bg-[#231d17] hover:bg-[#342b20] border border-[#3e3223] text-[#e6c670] text-xs font-serif font-bold transition-colors"
            title="Σαμπί = 900"
          >
            Ϡ <span className="text-[10px] text-[#9c8973] font-normal font-sans">(900)</span>
          </button>
          <div className="h-4 w-[1px] bg-[#332b21] mx-1" />
          <button
            onClick={() => handleInsertChar(" + ")}
            className="px-2 py-1 rounded bg-[#231d17] hover:bg-[#342b20] border border-[#3e3223] text-[#e8dfd1] text-xs font-mono font-bold"
          >
            +
          </button>
          <button
            onClick={() => handleInsertChar(" - ")}
            className="px-2 py-1 rounded bg-[#231d17] hover:bg-[#342b20] border border-[#3e3223] text-[#e8dfd1] text-xs font-mono font-bold"
          >
            -
          </button>
          <button
            onClick={() => handleInsertChar(" × ")}
            className="px-2 py-1 rounded bg-[#231d17] hover:bg-[#342b20] border border-[#3e3223] text-[#e8dfd1] text-xs font-mono font-bold"
          >
            ×
          </button>
        </div>
      </div>

      {/* Main Input & Hero Display Card */}
      <div className="rounded-2xl bg-gradient-to-b from-[#1c1813] to-[#161310] border border-[#2d251e] p-6 shadow-xl shadow-black/40 space-y-6">
        
        {/* Input Bar */}
        <div>
          <label htmlFor="isopsephy-main-input" className="block text-xs font-medium uppercase tracking-wider text-[#a69680] mb-2 font-serif">
            Ελληνικη Λεξη, Φραση η Πραξη
          </label>
          <div className="relative">
            <input
              id="isopsephy-main-input"
              type="text"
              value={inputExpression}
              onChange={(e) => setInputExpression(e.target.value)}
              placeholder="π.χ. ΙΗΣΟΥΣ, ΛΟΓΟΣ, 888 + 1480..."
              className="w-full px-4 py-3.5 bg-[#0f0e0c] border border-[#3d3224] focus:border-[#c89b3c] focus:ring-2 focus:ring-[#c89b3c]/20 rounded-xl text-lg sm:text-2xl font-serif text-[#f5ecd8] placeholder-[#5c5144] transition-all outline-none"
              autoFocus
            />
            {inputExpression && (
              <button
                onClick={() => setInputExpression("")}
                id="btn-clear-input"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7d7061] hover:text-[#e8dfd1] p-1 rounded-lg transition-colors"
                title="Εκκαθάριση πεδίου"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8c7e6c] font-serif">Δοκιμάστε:</span>
          {[
            { label: "ΙΩΑΝΝΗΣ", val: "1119" },
            { label: "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ", val: "666" },
            { label: "ΛΑΥΡΕΙΟΝ", val: "666" },
            { label: "ΑΜΑΡΤΙΑ", val: "453" },
            { label: "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ", val: "1119 - 453" },
            { label: "ΙΗΣΟΥΣ", val: "888" },
            { label: "ΧΡΙΣΤΟΣ", val: "1480" },
            { label: "888 + 1480", val: "2368" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleQuickPreset(item.label)}
              className="px-2.5 py-1 rounded-lg bg-[#231d17] hover:bg-[#2e261e] border border-[#362b1f] hover:border-[#c89b3c]/50 text-xs font-serif text-[#d6c7b2] transition-all"
            >
              {item.label} <span className="text-[10px] text-[#9c8973] font-mono">({item.val})</span>
            </button>
          ))}
        </div>

        {/* Hero Result Section */}
        {result.finalValue > 0 ? (
          <div className="p-6 rounded-xl bg-[#12100d] border border-[#2d2419] relative overflow-hidden">
            {/* Background decorative watermark */}
            <div className="absolute right-4 -bottom-6 text-[110px] font-serif font-black text-[#ffffff]/[0.02] pointer-events-none select-none">
              {greekNumeral || "Ω"}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              
              {/* Main Number and Numeral */}
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a69680] font-mono">
                  Συνολικος Λεξαριθμος
                </span>
                <div className="flex items-baseline gap-4 mt-1">
                  <span className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f7e0aa] via-[#e6c670] to-[#c89b3c] drop-shadow-md">
                    {result.finalValue.toLocaleString("el-GR")}
                  </span>
                  {greekNumeral && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#221c15] border border-[#443625]">
                      <span className="text-xs text-[#8c7e6c] font-sans">Ιωνικός:</span>
                      <span className="text-base sm:text-lg font-serif font-bold text-[#e6c670]">
                        {greekNumeral}
                      </span>
                    </div>
                  )}
                </div>

                {/* Digital Root & Math Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#251e16] border border-[#3e3223] text-xs font-mono text-[#d4af37]">
                    <span className="text-[#8c7e6c]">Πυθμένας (Ρίζα):</span>
                    <span className="font-bold text-[#f5ecd8]">{mathProps.pythmen}</span>
                  </div>
                  {mathProps.isPrime && (
                    <span className="px-2 py-0.5 rounded bg-[#1e2a1e] border border-[#2d472d] text-emerald-300 text-[11px] font-mono">
                      Πρώτος Αριθμός
                    </span>
                  )}
                  {mathProps.isTriangular && (
                    <span className="px-2 py-0.5 rounded bg-[#2b2214] border border-[#523e1f] text-amber-300 text-[11px] font-mono" title={`Τρίγωνος αριθμός του ${mathProps.triangularRoot}`}>
                      Τρίγωνος Αριθμός (T{mathProps.triangularRoot})
                    </span>
                  )}
                  {mathProps.isSquare && (
                    <span className="px-2 py-0.5 rounded bg-[#1e202b] border border-[#2c334d] text-indigo-300 text-[11px] font-mono">
                      Τετράγωνος ({mathProps.squareRoot}²)
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-[#1c1813] border border-[#2d251e] text-[#a69680] text-[11px] font-mono">
                    {mathProps.isEven ? "Άρτιος" : "Περιττός"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col gap-2">
                <button
                  onClick={handleSave}
                  id="btn-save-calculator-result"
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md ${
                    isAlreadySaved || saveSuccess
                      ? "bg-emerald-900/60 text-emerald-200 border border-emerald-500/50"
                      : "bg-gradient-to-r from-[#8a6825] to-[#c89b3c] hover:from-[#a0792c] hover:to-[#dbaa42] text-[#14120f] font-bold"
                  }`}
                >
                  {isAlreadySaved || saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Αποθηκεύτηκε</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Αποθήκευση στο Αρχείο</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    id="btn-copy-calculator-result"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#231d17] hover:bg-[#30271e] border border-[#3e3223] text-xs text-[#d6c7b2] font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Αντιγράφηκε</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#a69680]" />
                        <span>Αντιγραφή</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      onOpenAiModal(
                        inputExpression.trim(),
                        result.finalValue,
                        result.wordBreakdowns.map((w) => w.rawWord)
                      )
                    }
                    id="btn-ai-analyze-calculator"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#282116] hover:bg-[#382d1c] border border-[#c89b3c]/40 text-xs text-[#e6c670] font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Ερμηνεία</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Expression Steps Explanation if Math used */}
            {result.stepsExplanation && (
              <div className="mt-4 pt-4 border-t border-[#231d16] text-xs font-mono text-[#c4b59f] flex items-center gap-2">
                <span className="text-[#8c7e6c] font-sans">Μαθηματική Ανάλυση:</span>
                <span className="text-[#f5ecd8] font-bold bg-[#1a1611] px-2.5 py-1 rounded-md border border-[#2d2419]">
                  {result.stepsExplanation}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[#12100d] border border-[#2d2419] text-center text-[#7a6e5e] font-serif">
            Εισάγετε ελληνικούς χαρακτήρες για να υπολογιστεί ο λεξάριθμος.
          </div>
        )}

        {/* Word and Letter Breakdown Section */}
        {result.wordBreakdowns.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs uppercase tracking-wider text-[#a69680] font-serif font-bold flex items-center gap-1.5">
              <span>Αναλυτικη Αποδομηση Γραμματων</span>
              <span className="text-[10px] font-normal text-[#736655] font-sans">
                (Άθροισμα επιμέρους ψηφίων)
              </span>
            </h3>

            <div className="space-y-3">
              {result.wordBreakdowns.map((wordObj, wIdx) => (
                <div
                  key={`${wordObj.rawWord}-${wIdx}`}
                  className="p-4 rounded-xl bg-[#14110e] border border-[#29221a] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-serif font-bold text-[#f5ecd8]">
                        {wordObj.rawWord}
                      </span>
                      {wordObj.normalizedWord !== wordObj.rawWord && (
                        <span className="text-xs font-mono text-[#8c7e6c]">
                          [{wordObj.normalizedWord}]
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8c7e6c] font-mono">
                        Πυθμένας: {wordObj.root}
                      </span>
                      <span className="text-sm font-serif font-bold text-[#e6c670] bg-[#221b14] px-2.5 py-0.5 rounded-md border border-[#3e3223]">
                        = {wordObj.value}
                      </span>
                    </div>
                  </div>

                  {/* Letter Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {wordObj.letters.map((letter, lIdx) => (
                      <div
                        key={lIdx}
                        className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg bg-[#1b1712] border border-[#30261b] hover:border-[#c89b3c]/40 transition-colors"
                      >
                        <span className="text-sm font-serif font-bold text-[#f5ecd8]">
                          {letter.originalChar}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[#c89b3c]">
                          {letter.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Math sum text */}
                  <div className="text-[11px] font-mono text-[#8c7e6c]">
                    {wordObj.letters.map((l) => `${l.char}(${l.value})`).join(" + ")} = <strong className="text-[#d6c7b2]">{wordObj.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Special Highlight for 666 and Special Mathematical/Triangular Numbers */}
      {result.finalValue === 666 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#20180f] via-[#2a1e12] to-[#20180f] border-2 border-[#c89b3c]/50 shadow-lg space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#e6c670] font-serif font-bold text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>Ειδικές Μαθηματικές Ιδιότητες του 666 (χξϛ´)</span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#352514] text-[#e6c670] border border-[#523d24]">
              36ος Τρίγωνος (T₃₆)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-serif text-[#d6c7b2]">
            <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
              <div className="text-[11px] text-[#8c7e6c]">12 Διαιρέτες</div>
              <div className="font-mono text-[11px] text-[#f5ecd8] mt-1 break-words">
                1, 2, 3, 6, 9, 18, 37, 74, 111, 222, 333, 666
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
              <div className="text-[11px] text-[#8c7e6c]">Τύπος Τριγώνου Αριθμού</div>
              <div className="font-mono text-[11px] text-[#e6c670] mt-1">
                s = [36 · 37] / 2 = 18 · 37 = 666
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#14100c] border border-[#2b2014]">
              <div className="text-[11px] text-[#8c7e6c]">Μαγικό Τετράγωνο Ηλίου</div>
              <div className="text-[11px] text-[#f5ecd8] mt-1">
                6×6=36 κελιά, άθροισμα 1..36 = 666 (κάθε σειρά 111)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divisors and Historical Context Accordion */}
      {result.finalValue > 0 && mathProps.divisors.length > 0 && (
        <div className="p-4 rounded-xl bg-[#161310] border border-[#282119] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#a69680]">
          <div>
            <strong className="text-[#d6c7b2] font-serif">Διαιρέτες του {result.finalValue}: </strong>
            <span className="font-mono">{mathProps.divisors.join(", ")}</span>
          </div>
          <div className="shrink-0 font-mono text-[11px] text-[#c89b3c]">
            Σύνολο διαιρετών: <strong>{mathProps.totalDivisorsCount || mathProps.divisors.length}</strong>
          </div>
        </div>
      )}

      {/* Isopsephy & 27 Greek Alphabet Sum (4995) Guide Section */}
      <div className="p-5 rounded-2xl bg-[#14110e] border border-[#2e241a] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c89b3c]" />
            <span>Θεμελιώδεις Αρχές Ισοψηφίας & Ιωνικής Αρίθμησης</span>
          </h3>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#221b14] text-[#e6c670] border border-[#3e3122]">
            Σύνολο 27 Γραμμάτων = 4.995
          </span>
        </div>

        <p className="text-xs font-serif text-[#bdae9b] leading-relaxed">
          Το ελληνικό αλφαβητικό σύστημα αρίθμησης συγκροτείται από <strong>27 ιερά σύμβολα</strong> κατανεμημένα σε 3 ακέραιες εννεάδες:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-serif">
          <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
              <span>9 Μονάδες (1 - 9)</span>
              <span className="text-[#e6c670] font-mono">Σ = 45</span>
            </div>
            <p className="text-[11px] font-mono text-[#8c7e6c]">
              Α=1, Β=2, Γ=3, Δ=4, Ε=5, Ϛ=6, Ζ=7, Η=8, Θ=9
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
              <span>9 Δεκάδες (10 - 90)</span>
              <span className="text-[#e6c670] font-mono">Σ = 450</span>
            </div>
            <p className="text-[11px] font-mono text-[#8c7e6c]">
              Ι=10, Κ=20, Λ=30, Μ=40, Ν=50, Ξ=60, Ο=70, Π=80, Ϟ=90
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
              <span>9 Εκατοντάδες (100 - 900)</span>
              <span className="text-[#e6c670] font-mono">Σ = 4.500</span>
            </div>
            <p className="text-[11px] font-mono text-[#8c7e6c]">
              Ρ=100, Σ=200, Τ=300, Υ=400, Φ=500, Χ=600, Ψ=700, Ω=800, Ϡ=900
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#1d1711] border border-[#c89b3c]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <span className="text-[#f5ecd8]">
            <strong>Άθροισμα Εννεάδων:</strong> 45 + 450 + 4.500 = <strong className="text-[#e6c670] text-sm">4.995</strong>
          </span>
          <span className="text-[#a69680]">
            Ιωνικός: <strong className="text-[#e6c670]">͵δϡϟε´</strong> • Πυθμένας: 4+9+9+5 = 27 → <strong className="text-[#e6c670]">9</strong> (Ιερά Εννεάδα)
          </span>
        </div>
      </div>

      {/* Recent History Scratchpad */}
      {recentHistory.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[#8c7e6c] font-serif font-bold">
              Προσφατοι Υπολογισμοι
            </span>
            <button
              onClick={() => setRecentHistory([])}
              className="text-[11px] text-[#6b5f51] hover:text-[#a69680] transition-colors"
            >
              Καθαρισμός ιστορικού
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentHistory.map((item, idx) => {
              const res = calculateWordIsopsephy(item);
              return (
                <button
                  key={idx}
                  onClick={() => setInputExpression(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161310] hover:bg-[#201a14] border border-[#29221a] hover:border-[#3d3224] text-xs font-serif text-[#b8a791] transition-all"
                >
                  <span>{item}</span>
                  {res.value > 0 && (
                    <span className="text-[10px] font-mono text-[#c89b3c]">
                      ({res.value})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
