import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  Calculator,
  Layers,
  ArrowRight,
  Sun,
  Box,
  Copy,
  Check,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface MindGeometryCardProps {
  onSelectWordForCalculator?: (word: string) => void;
  className?: string;
  isModal?: boolean;
}

export const MindGeometryCard: React.FC<MindGeometryCardProps> = ({
  onSelectWordForCalculator,
  className = "",
  isModal = false,
}) => {
  const [selectedFactor, setSelectedFactor] = useState<number>(6);
  const [copiedEquation, setCopiedEquation] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedEquation(id);
    setTimeout(() => setCopiedEquation(null), 2000);
  };

  const factorSteps = [
    {
      n: 1,
      calc: "1! = 1",
      val: 1,
      label: "Μονάς",
      desc: "Το πρωταρχικό σημείο, η πηγή του Όντος, το Α.",
      color: "from-sky-500/20 to-sky-600/10 border-sky-500/40 text-sky-300",
    },
    {
      n: 2,
      calc: "2! = 1 × 2 = 2",
      val: 2,
      label: "Δυάς",
      desc: "Η γραμμή, η πρώτη πολικότητα, το Β (Βίος / Βάση).",
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300",
    },
    {
      n: 3,
      calc: "3! = 2 × 3 = 6",
      val: 6,
      label: "Τριάς",
      desc: "Το επίπεδο, το τρίγωνο, ο 1ος Τέλειος Αριθμός (1+2+3=6).",
      color: "from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300",
    },
    {
      n: 4,
      calc: "4! = 6 × 4 = 24",
      val: 24,
      label: "Τετράς",
      desc: "Ο τρισδιάστατος χώρος (Τετράεδρο). 24 = ΚΔ (Σύμβολο Διός ♃).",
      color: "from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-300",
    },
    {
      n: 5,
      calc: "5! = 24 × 5 = 120",
      val: 120,
      label: "Πεντάς",
      desc: "Η πεμπτουσία (Αιθήρ), το δωδεκάεδρο των 12 πενταγώνων.",
      color: "from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-300",
    },
    {
      n: 6,
      calc: "6! = 120 × 6 = 720",
      val: 720,
      label: "Εξάς ➔ ΝΟΥΣ",
      desc: "Ο Συμπαντικός ΝΟΥΣ! Η ολότητα των 6 ηλιακών διαστάσεων.",
      color: "from-amber-400/30 to-orange-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20",
    },
  ];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-b from-[#12111d] via-[#0d0d16] to-[#08080f] border border-amber-500/35 text-zinc-100 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-start justify-between gap-3 border-b border-amber-500/20 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/25 to-orange-500/15 border border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/20">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Αριθμοσοφική Αποκάλυψη
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400">
              Γεωμετρία του Νου
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-0.5">
              Η μαθηματική σύγκλιση του 6! (6 παραγοντικό) με τον Συμπαντικό ΝΟΥ & η εξίσωση 72 (ΟΒ) × 10 (Ι) = 720
            </p>
          </div>
        </div>

        {!isModal && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            title={isExpanded ? "Σύμπτυξη" : "Ανάπτυξη"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Master Equation Hero Banner */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/30 via-zinc-900/80 to-purple-950/30 border-2 border-amber-500/40 shadow-xl shadow-amber-500/10">
            <div className="text-center space-y-3">
              <span className="text-[11px] font-mono text-amber-300/80 tracking-widest uppercase font-semibold">
                Η Κεντρική Εξίσωση της Νοήσεως
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-lg sm:text-2xl md:text-3xl font-mono font-black text-zinc-100">
                <span className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-inner">
                  72 (ΟΒ)
                </span>
                <span className="text-amber-500 font-serif">×</span>
                <span className="px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/40 text-purple-300 shadow-inner">
                  10 (Ι)
                </span>
                <span className="text-amber-500 font-serif">=</span>
                <span className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold shadow-lg shadow-amber-500/30">
                  720 = ΝΟΥΣ
                </span>
                <span className="text-zinc-400 font-serif">=</span>
                <span className="px-3 py-1 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-300 shadow-inner">
                  6! (Παραγοντικό)
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() =>
                    copyToClipboard(
                      "72 (ΟΒ) × 10 (Ι) = 720 = ΝΟΥΣ = 6! (1×2×3×4×5×6)",
                      "hero"
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedEquation === "hero" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Αντιγράφηκε!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Αντιγραφή Εξίσωσης</span>
                    </>
                  )}
                </button>

                {onSelectWordForCalculator && (
                  <button
                    onClick={() => onSelectWordForCalculator("ΝΟΥΣ")}
                    className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Υπολογισμός «ΝΟΥΣ»</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dual Columns: Isopsephy Breakdown & OB*I Derivation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Isopsephy of ΝΟΥΣ */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>1. Ιωνική Ισοψηφία του ΝΟΥ</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 font-mono text-xs sm:text-sm text-center space-y-1">
                <div className="text-amber-200 font-bold">
                  Ν (50) + Ο (70) + Υ (400) + Σ (200) = <strong className="text-amber-400 text-base">720</strong>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Πυθμένας: 7 + 2 + 0 = <strong className="text-sky-300">9</strong> (Η Εννεάδα της Πληρότητας)
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                Ο <strong>ΝΟΥΣ</strong> στην ελληνική κοσμογονία είναι η ενεργητική νοητική αρχή που μορφοποιεί το Χάος σε Κόσμο. Το 720 αποτελεί την απόλυτη αρμονική έκφραση των κυκλικών και στερεών διαστάσεων.
              </p>
            </div>

            {/* Column 2: 72 (ΟΒ) * 10 (Ι) = 720 */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>2. Ουράνιον Βασίλειον &amp; Ιωάννης</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 font-mono text-xs sm:text-sm text-center space-y-1">
                <div className="text-purple-200 font-bold">
                  144 / 2 = <strong className="text-purple-300">72 = Ο.Β.</strong>
                </div>
                <div className="text-amber-300 font-semibold text-xs">
                  Ο.Β. (72) × Ι (10) = <strong className="text-amber-400 text-base">720 = ΝΟΥΣ</strong>
                </div>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1 font-light leading-relaxed">
                <li>
                  • <strong>Ο.Β. = 72:</strong> Ουρανία Βασίλειος (Ο: Ουρανία, Β: Βασίλειος). Προέρχεται από το 144/2 (γωνία κορυφής του αετώματος του Παρθενώνα και οι 144.000).
                </li>
                <li>
                  • <strong>Ι = 10:</strong> Ιωάννης (Ι = 10) και η ιερή Πυθαγόρεια Τετρακτύς (1+2+3+4 = 10).
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Interactive 6! (Factorial) Breakdown */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/70 border border-amber-500/25 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Box className="w-4 h-4 text-amber-400" />
                <span>3. Το 6! (6 Παραγοντικό) — Η Εξαπλή Διάταξη των Διαστάσεων</span>
              </div>
              <div className="text-xs font-mono text-zinc-400">
                1 × 2 × 3 × 4 × 5 × 6 = <strong className="text-amber-300">720</strong>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              Το παραγοντικό ενός αριθμού (n!) εκφράζει όλες τις δυνατές διατάξεις και συνδυασμούς στον χωροχρόνο. Το <strong>6!</strong> είναι οι 720 μεταλλάξεις των 6 βαθμίδων της Δημιουργίας:
            </p>

            {/* Step buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {factorSteps.map((step) => {
                const isSelected = selectedFactor === step.n;
                return (
                  <button
                    key={step.n}
                    onClick={() => setSelectedFactor(step.n)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${step.color} ring-2 ring-amber-400/50 scale-[1.03]`
                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span>{step.n}!</span>
                      <span className="text-xs font-extrabold">{step.val}</span>
                    </div>
                    <div className="text-xs font-bold text-zinc-200 mt-1">{step.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Factor Detail Display */}
            {(() => {
              const currentStep = factorSteps.find((s) => s.n === selectedFactor) || factorSteps[5];
              return (
                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                        {currentStep.calc}
                      </span>
                      <span className="text-sm font-bold text-zinc-100 font-serif">
                        {currentStep.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-light mt-1">
                      {currentStep.desc}
                    </p>
                  </div>
                  <div className="text-right font-mono self-end sm:self-center">
                    <span className="text-2xl font-black text-amber-300">{currentStep.val}</span>
                  </div>
                </div>
              );
            })()}

            {/* Sub-card: The significance of 720 (6!) and Reverse Reading 027 */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/30 via-zinc-900/90 to-amber-950/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Η Μαθηματική Σημασία του 720 (6!) &amp; Η Αντίθετη Ανάγνωση (027)</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold">
                  720 ⇄ 027
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                Ο αριθμός <strong>720</strong>, ως το παραγοντικό του <strong>6 (6! = 1 × 2 × 3 × 4 × 5 × 6)</strong>, εκφράζει την πλήρη μαθηματική διάταξη των 6 κοσμικών διαστάσεων του Ηλιακού Λόγου. Σε κατοπτρική / αντίθετη ανάγνωση, το <strong>720</strong> αποκαλύπτει τον αριθμό <strong>027 ➔ 27</strong>:
              </p>
              <div className="p-2.5 rounded-lg bg-black/50 border border-purple-500/30 font-mono text-xs text-center space-y-1">
                <div className="text-amber-300 font-bold">
                  720 (ΝΟΥΣ) ⇄ 027 ➔ <span className="text-purple-300 text-sm">27 Αριθμογραμματοσύμβολα</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  9 Μονάδες (1-9) + 9 Δεκάδες (10-90 με το Ϙ κόππα) + 9 Εκατοντάδες (100-900 με το Ͳ σαμπί και ϛ στίγμα) = <strong>27 Σύμβολα</strong>
                </div>
              </div>
              <p className="text-[11px] text-zinc-300/90 font-serif italic leading-relaxed">
                Έτσι, ο <strong>ΝΟΥΣ (720)</strong> εμπεριέχει αναδρομικά και καθρεφτίζει στο <strong>27</strong> το σύνολο του ελληνικού αλφαριθμητικού κώδικα της <strong>Ιωνικής Αρίθμησης</strong> — τα 27 ιερά δομικά στοιχεία με τα οποία γράφεται και αποκωδικοποιείται ολόκληρο το Σύμπαν!
              </p>
            </div>
          </div>

          {/* Section 4: Cosmic Synthesis & The 666 / 216 / 144 Bridge */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 to-zinc-900/80 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>4. Η Αδιάσπαστη Αλυσίδα των 6-ικών Αριθμών</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                <div className="text-zinc-400 text-[10px] uppercase">Ηλιακό Τετράγωνο</div>
                <div className="text-amber-300 font-bold text-sm mt-0.5">6 × 6 = 36</div>
                <div className="text-[10px] text-zinc-400 mt-1">Άθροισμα 1..36 = <strong>666</strong></div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                <div className="text-zinc-400 text-[10px] uppercase">Ψυχογονικός Κύβος</div>
                <div className="text-purple-300 font-bold text-sm mt-0.5">6 × 6 × 6 = 216</div>
                <div className="text-[10px] text-zinc-400 mt-1">Αντιστροφή 612 = <strong>ΖΕΥΣ</strong></div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                <div className="text-zinc-400 text-[10px] uppercase">Αφύπνιση &amp; Γέφυρα</div>
                <div className="text-sky-300 font-bold text-sm mt-0.5">144.000 : 666</div>
                <div className="text-[10px] text-zinc-400 mt-1">= <strong>216,216216...</strong></div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/40">
                <div className="text-amber-300 text-[10px] uppercase font-bold">Συμπαντικός Νους</div>
                <div className="text-amber-200 font-bold text-sm mt-0.5">6! = 720 = ΝΟΥΣ</div>
                <div className="text-[10px] text-amber-300/80 mt-1">ΟΒ (72) × Ι (10) = <strong>720</strong></div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-[11px] text-zinc-300 font-serif italic">
              <Info className="w-4 h-4 text-amber-400 shrink-0 not-italic" />
              <span>
                «Ο Νους οργανώνει τα πάντα: από τον κυβικό όγκο του 6 (216) και το ηλιακό τετράγωνο (666), έως το ήμισυ του ιερού αετώματος 72 (ΟΒ) που διά της δεκάδος (Ι) αποδίδει το 720.»
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
