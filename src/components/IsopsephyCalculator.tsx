import React, { useState, useEffect, useMemo } from 'react';
import { 
  calculateIsopsephy, 
  IsopsephySystem, 
  CalculationResult 
} from '../utils/isopsephy';
import { ExportCardImageModal } from './ExportCardImageModal';
import { 
  Search, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Share2, 
  Info, 
  BookOpen,
  Layers,
  ChevronRight,
  Hash
} from 'lucide-react';
import emblemLogo from '../assets/images/ego_eimi_logo_1788939371013.jpg';

const SAMPLE_EXPRESSIONS = [
  'ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ',
  'ΕΓΩ ΕΙΜΙ',
  'ΑΠΟΛΛΩΝ',
  'ΙΗΣΟΥΣ',
  'ΗΛΙΟΣ',
  'ΣΟΦΙΑ',
  'ΓΝΩΘΙ ΣΕΑΥΤΟΝ',
  'ΑΡΜΟΝΙΑ'
];

export const IsopsephyCalculator: React.FC = () => {
  const [input, setInput] = useState<string>('ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ');
  const [system, setSystem] = useState<IsopsephySystem>(IsopsephySystem.IONIAN);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ',
    'ΕΓΩ ΕΙΜΙ',
    'ΑΠΟΛΛΩΝ'
  ]);

  const result: CalculationResult = useMemo(() => {
    return calculateIsopsephy(input, system);
  }, [input, system]);

  const handleSelectSample = (sample: string) => {
    setInput(sample);
    if (!recentSearches.includes(sample)) {
      setRecentSearches(prev => [sample, ...prev.slice(0, 7)]);
    }
  };

  const getSystemTitle = (sys: IsopsephySystem) => {
    switch (sys) {
      case IsopsephySystem.IONIAN:
        return 'Αρχαία Ιωνική Αρίθμηση (27 Γράμματα)';
      case IsopsephySystem.ORDINAL:
        return 'Τακτική Αρίθμηση (Α=1 ... Ω=24)';
      case IsopsephySystem.ENGLISH_BASE6:
        return 'English Base 6 / Sumerian (A=6 ... Z=156)';
      case IsopsephySystem.GREEK_MULT6:
        return 'Ελληνικά Πολλαπλάσια του 6 (Α=6 ... Ω=144)';
      default:
        return 'Ιωνική Αρίθμηση';
    }
  };

  return (
    <div id="isopsephy-calculator-root" className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Top Header Card */}
      <div id="calc-header-card" className="p-5 sm:p-7 rounded-2xl bg-[#14110e] border border-[#2e241a] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#d4af37]/60 shadow-lg shrink-0 bg-black">
            <img src={emblemLogo} alt="ΕΓΩ ΕΙΜΙ" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#251d14] border border-[#4d3a22] text-[#ffd700] text-[10px] font-mono uppercase tracking-wider mb-1.5">
              <span>✦</span>
              <span>Ιερά Αρχαιοελληνική Ισοψηφία</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-[#f8f1e3] tracking-wide">
              Υπολογισμός Λεξαρίθμων &amp; Ισοψηφίας
            </h1>
            <p className="text-xs sm:text-sm font-serif text-[#a69680] mt-0.5">
              Ανάλυση λέξεων και μαθηματικών εκφράσεων σύμφωνα με την παραδοσιακή Ιωνική Αρίθμηση.
            </p>
          </div>
        </div>

        {/* Quick export button in header */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          id="btn-open-export-header"
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b88628] via-[#dfad38] to-[#ffd700] hover:from-[#c99532] hover:to-[#ffe033] text-[#191309] font-serif font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Εξαγωγή Κάρτας (PNG / PDF)</span>
        </button>
      </div>

      {/* Main Input & System Selection Section */}
      <div id="calc-input-section" className="p-5 sm:p-6 rounded-2xl bg-[#14110e] border border-[#2e241a] shadow-lg space-y-4">
        
        {/* System Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#251d15]">
          <span className="text-xs uppercase tracking-wider text-[#8c7e6c] font-serif font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#c89b3c]" />
            <span>Σύστημα Αρίθμησης:</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: IsopsephySystem.IONIAN, label: 'Ιωνική (27 Γράμματα)' },
              { id: IsopsephySystem.ORDINAL, label: 'Τακτική (1-24)' },
              { id: IsopsephySystem.GREEK_MULT6, label: 'Ελληνικά ×6' },
              { id: IsopsephySystem.ENGLISH_BASE6, label: 'English Base 6' }
            ].map(sys => (
              <button
                key={sys.id}
                type="button"
                onClick={() => setSystem(sys.id)}
                className={`px-3 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                  system === sys.id
                    ? 'bg-[#291f13] border border-[#ffd700] text-[#f5ecd8] font-bold shadow-sm'
                    : 'bg-[#100d0a] border border-[#221a12] text-[#8c7e6c] hover:text-[#d6c7b2]'
                }`}
              >
                {sys.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field with Search Icon */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c89b3c]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            id="isopsephy-input-field"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Πληκτρολογήστε λέξη, φράση ή έκφραση (π.χ. ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ, ΕΓΩ ΕΙΜΙ)..."
            className="w-full pl-11 pr-24 py-3.5 bg-[#0e0c09] border border-[#3d2f1f] focus:border-[#ffd700] rounded-xl text-base sm:text-lg font-ancient-greek text-[#f8f1e3] placeholder-[#6e5f4d] outline-none shadow-inner transition-all"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute inset-y-0 right-2 px-3 flex items-center text-xs font-serif text-[#8c7e6c] hover:text-[#f8f1e3] cursor-pointer"
            >
              Καθαρισμός
            </button>
          )}
        </div>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#8c7e6c] font-serif">Προτάσεις:</span>
          {SAMPLE_EXPRESSIONS.map(sample => (
            <button
              key={sample}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="px-2.5 py-1 rounded-md bg-[#19140f] hover:bg-[#251d14] border border-[#2e2316] text-[#b8a791] hover:text-[#ffd700] font-ancient-greek transition-colors cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calculation Result Box */}
      <div id="calc-result-box" className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#18140f] via-[#120f0b] to-[#0d0a08] border-2 border-[#d4af37]/70 shadow-2xl space-y-6">
        
        {/* Top Result Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#2d2215]">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#a69680] font-mono">
              Αποτέλεσμα Ισοψηφίας
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-ancient-greek font-bold text-[#f5ebd8] mt-1">
              «{input.trim() || '—'}»
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            id="btn-export-card-main"
            className="px-4 py-2.5 rounded-xl bg-[#2a1f13] hover:bg-[#382b1c] border border-[#ffd700]/70 text-[#ffd700] font-serif font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Εξαγωγή Κάρτας</span>
          </button>
        </div>

        {/* Big Number & Core Badges */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Number Value */}
          <div className="md:col-span-6 flex flex-col items-start justify-center space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffe082] via-[#ffd700] to-[#b88628] leading-none">
                {result.finalValue.toLocaleString('el-GR')}
              </span>
            </div>

            {result.greekNumeral && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#251d14] border border-[#594223] text-[#f5ebd8] text-sm">
                <span className="text-xs text-[#a69680]">Ιωνικό Σύστημα:</span>
                <span className="font-serif font-bold text-base text-[#ffd700]">{result.greekNumeral}</span>
              </div>
            )}
          </div>

          {/* Mathematical Properties */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#14100c] border border-[#2b2115] text-center">
              <div className="text-[10px] uppercase font-mono text-[#8c7e6c]">Πυθμένας</div>
              <div className="text-xl font-bold font-serif text-[#ffd700] mt-0.5">{result.mathProps.pythmen}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#14100c] border border-[#2b2115] text-center">
              <div className="text-[10px] uppercase font-mono text-[#8c7e6c]">Αρτιότητα</div>
              <div className="text-base font-bold font-serif text-[#e6c670] mt-0.5">
                {result.mathProps.isEven ? 'Άρτιος' : 'Περιττός'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#14100c] border border-[#2b2115] text-center">
              <div className="text-[10px] uppercase font-mono text-[#8c7e6c]">Πρώτος</div>
              <div className={`text-base font-bold font-serif mt-0.5 ${result.mathProps.isPrime ? 'text-emerald-400' : 'text-[#8c7e6c]'}`}>
                {result.mathProps.isPrime ? 'Ναι' : 'Όχι'}
              </div>
            </div>

            {result.mathProps.isTriangular && (
              <div className="p-3 rounded-xl bg-[#1b150c] border border-[#b88628]/50 text-center col-span-2 sm:col-span-3">
                <div className="text-[10px] uppercase font-mono text-[#ffd700]">Τρίγωνος Αριθμός</div>
                <div className="text-sm font-bold font-serif text-[#f5ebd8] mt-0.5">
                  Τρίγωνος βάσης T({result.mathProps.triangularRoot}) • Σ(1..{result.mathProps.triangularRoot}) = {result.finalValue}
                </div>
              </div>
            )}

            {result.mathProps.isSquare && (
              <div className="p-3 rounded-xl bg-[#15111b] border border-indigo-500/40 text-center col-span-2 sm:col-span-3">
                <div className="text-[10px] uppercase font-mono text-indigo-300">Τετράγωνος Αριθμός</div>
                <div className="text-sm font-bold font-serif text-[#f5ebd8] mt-0.5">
                  {result.mathProps.squareRoot}² = {result.finalValue}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Letter Breakdown Analysis */}
        {result.wordBreakdowns.length > 0 && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#100d09] border border-[#261d13] space-y-3">
            <div className="text-xs uppercase tracking-wider text-[#c89b3c] font-serif font-bold">
              Αναλυτική Αποδόμηση Γραμμάτων &amp; Λέξεων
            </div>

            <div className="space-y-3">
              {result.wordBreakdowns.map((wb, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#16120e] border border-[#2d2215] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-ancient-greek font-bold text-[#f5ebd8]">{wb.word}</span>
                    <span className="text-xs font-mono text-[#c89b3c]">({wb.value})</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#a69680]">
                    {wb.letters.map((letObj, lIdx) => (
                      <span key={lIdx} className="px-2 py-0.5 rounded bg-[#1f1811] border border-[#382a1a] text-[#f5ecd8]">
                        {letObj.char} = <strong className="text-[#ffd700]">{letObj.value}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {result.stepsExplanation && (
              <div className="text-xs font-mono text-[#c89b3c] pt-2 border-t border-[#22180f]">
                <strong>Υπολογισμός Έκφρασης:</strong> {result.stepsExplanation}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 27-Letter Reference Table Accordion / Card */}
      <div id="isopsephy-table-reference" className="p-5 rounded-2xl bg-[#14110e] border border-[#2e241a] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-[#ffd700] font-serif font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#c89b3c]" />
            <span>Πίνακας Αρχαίας Ιωνικής Αρίθμησης (27 Ιερά Σύμβολα)</span>
          </h2>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#221b14] text-[#ffd700] border border-[#3e3122]">
            3 Εννεάδες = Σ 4.995
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-serif">
          <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
              <span>9 Μονάδες (1 - 9)</span>
              <span className="text-[#ffd700] font-mono">Σ = 45</span>
            </div>
            <p className="text-[11px] font-mono text-[#8c7e6c]">
              Α=1, Β=2, Γ=3, Δ=4, Ε=5, Ϛ=6, Ζ=7, Η=8, Θ=9
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
              <span>9 Δεκάδες (10 - 90)</span>
              <span className="text-[#ffd700] font-mono">Σ = 450</span>
            </div>
            <p className="text-[11px] font-mono text-[#8c7e6c]">
              Ι=10, Κ=20, Λ=30, Μ=40, Ν=50, Ξ=60, Ο=70, Π=80, Ϟ=90
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0d0c0a] border border-[#261f18] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#f5ecd8]">
              <span>9 Εκατοντάδες (100 - 900)</span>
              <span className="text-[#ffd700] font-mono">Σ = 4.500</span>
            </div>
            <p className="text-[11px] font-mono text-[#8c7e6c]">
              Ρ=100, Σ=200, Τ=300, Υ=400, Φ=500, Χ=600, Ψ=700, Ω=800, Ϡ=900
            </p>
          </div>
        </div>
      </div>

      {/* Export Card Image Modal */}
      <ExportCardImageModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        expression={input}
        totalValue={result.finalValue}
        greekNumeral={result.greekNumeral}
        systemName={getSystemTitle(system)}
        mathProps={result.mathProps}
        wordBreakdowns={result.wordBreakdowns}
        stepsExplanation={result.stepsExplanation}
      />

    </div>
  );
};
