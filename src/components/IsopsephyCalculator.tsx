import React, { useState, useEffect, useMemo } from 'react';
import { 
  calculateIsopsephy, 
  IsopsephySystem, 
  CalculationResult, 
  computePythagoreanHarmonics 
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
  Music,
  Radio,
  Waves,
  Layers,
  ChevronRight,
  Hash,
  Calculator,
  X,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { 
  playHarmonicFrequency, 
  PYTHAGOREAN_OCTAVE_NOTES 
} from '../utils/audio';
import { FrequencyAudioLab } from './FrequencyAudioLab';

const SAMPLE_EXPRESSIONS = [
  'ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ',
  'ΛΑΥΡΕΙΟΝ',
  'ΕΓΩ ΕΙΜΙ',
  'ΑΠΟΛΛΩΝ',
  'ΙΗΣΟΥΣ',
  'ΗΛΙΟΣ',
  'ΣΟΦΙΑ',
  'ΓΝΩΘΙ ΣΑΥΤΟΝ',
  'ΑΡΜΟΝΙΑ'
];

export const IsopsephyCalculator: React.FC = () => {
  // Empty initial input so ghost placeholder "άχνη" is visible and not pre-written
  const [input, setInput] = useState<string>('');
  const [system, setSystem] = useState<IsopsephySystem>(IsopsephySystem.IONIAN);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ',
    'ΛΑΥΡΕΙΟΝ',
    'ΕΓΩ ΕΙΜΙ'
  ]);

  const result: CalculationResult = useMemo(() => {
    return calculateIsopsephy(input, system);
  }, [input, system]);

  const harmonics = useMemo(() => {
    const activeVal = result.finalValue || 1818;
    return computePythagoreanHarmonics(activeVal);
  }, [result.finalValue]);

  const [playingFreq, setPlayingFreq] = useState<number | null>(null);
  const [playingLabel, setPlayingLabel] = useState<string>('');

  const handlePlayTone = (freq: number, label: string) => {
    if (playingFreq === freq) {
      playHarmonicFrequency(0);
      setPlayingFreq(null);
      setPlayingLabel('');
      return;
    }
    setPlayingFreq(freq);
    setPlayingLabel(label);
    playHarmonicFrequency(freq, 2.8);
    setTimeout(() => {
      setPlayingFreq(curr => (curr === freq ? null : curr));
      setPlayingLabel(curr => (curr === label ? '' : curr));
    }, 2800);
  };

  const handleStopTone = () => {
    playHarmonicFrequency(0);
    setPlayingFreq(null);
    setPlayingLabel('');
  };

  useEffect(() => {
    return () => {
      playHarmonicFrequency(0);
    };
  }, []);

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
    <div id="isopsephy-calculator-root" className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      
      {/* Top Action & Export Bar */}
      <div id="calc-header-card" className="p-4 sm:p-5 rounded-2xl bg-[#14110e] border border-[#2e241a] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#221a11] border border-[#4d3a22] text-[#ffd700] shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#f5ebd8] leading-tight">
              Καρτέλα Υπολογισμού Λεξαρίθμου
            </h2>
            <p className="text-xs font-serif text-[#a69680] mt-0.5">
              Εισάγετε λέξη ή μαθηματική έκφραση (π.χ. με + ή -) για ανάλυση ισοψηφίας.
            </p>
          </div>
        </div>

        {/* Quick export button in header */}
        <button
          type="button"
          onClick={() => {
            if (!input.trim()) {
              setInput('ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ');
            }
            setIsExportModalOpen(true);
          }}
          id="btn-open-export-header"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b88628] via-[#dfad38] to-[#ffd700] hover:from-[#c99532] hover:to-[#ffe033] text-[#191309] font-serif font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
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
        <div className="space-y-1.5">
          <label className="text-xs font-serif text-[#c5b59f] flex items-center justify-between">
            <span>Λέξη, Φράση ή Μαθηματική Έκφραση (π.χ. πρόσθεση / αφαίρεση):</span>
            <span className="text-[10px] font-mono text-[#8c7e6c]">Πολυτονικό &amp; Μονοτονικό</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c89b3c]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="isopsephy-input-field"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ"
              className={`w-full pl-11 ${input ? 'pr-28' : 'pr-4'} py-3.5 sm:py-4 bg-[#0e0c09] border border-[#3d2f1f] focus:border-[#ffd700] rounded-xl text-base sm:text-lg font-ancient-greek text-[#f8f1e3] placeholder:text-[#a69680]/50 placeholder:font-ancient-greek placeholder:tracking-wider placeholder:text-sm sm:placeholder:text-base outline-none shadow-inner transition-all`}
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute inset-y-0 right-2 my-auto h-8 px-2.5 flex items-center gap-1 text-xs font-serif text-[#a69680] hover:text-[#ffd700] bg-[#1a140d] rounded-lg border border-[#3d2f1f] hover:border-[#ffd700]/50 transition-colors cursor-pointer"
                title="Καθαρισμός πεδίου"
              >
                <X className="w-3.5 h-3.5" />
                <span>Καθαρισμός</span>
              </button>
            )}
          </div>
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
              Αποτέλεσμα Λεξαρίθμου
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-ancient-greek font-bold text-[#f5ebd8] mt-1">
              {input.trim() ? `«${input.trim()}»` : '«—»'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!input.trim()) {
                setInput('ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ');
              }
              setIsExportModalOpen(true);
            }}
            id="btn-export-card-main"
            className="px-4 py-2.5 rounded-xl bg-[#2a1f13] hover:bg-[#382b1c] border border-[#ffd700]/70 text-[#ffd700] font-serif font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Εξαγωγή Κάρτας</span>
          </button>
        </div>

        {/* Direct Results View */}
        {true && (
          <>
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
                        {idx > 0 && wb.operator && (
                          <span className={`px-2 py-0.5 rounded text-xs font-black font-mono ${
                            wb.operator === '-' 
                              ? 'bg-rose-950/80 border border-rose-600/60 text-rose-400' 
                              : wb.operator === '×' 
                                ? 'bg-amber-950/80 border border-amber-600/60 text-amber-400'
                                : wb.operator === '÷'
                                  ? 'bg-sky-950/80 border border-sky-600/60 text-sky-400'
                                  : 'bg-[#1f1811] border border-[#382a1a] text-[#ffd700]'
                          }`}>
                            {wb.operator}
                          </span>
                        )}
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

            {/* Πυθαγόρεια Αρμονία, Μουσικές Νότες, Συχνότητες & Χρυσή Τομή Φ */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#120e0a] border border-[#382b1b] space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a1e12] pb-2.5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#ffd700] font-serif font-bold">
                  <Music className="w-4 h-4 text-[#ffd700]" />
                  <span>Πυθαγόρεια Αρμονική, Μουσικές Νότες &amp; Χρυσή Αναλογία (Φ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlayTone(432, 'Κοσμική Βάση 432 Hz')}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                      playingFreq === 432
                        ? 'bg-[#ffd700] text-black font-bold shadow-md shadow-[#ffd700]/30 animate-pulse'
                        : 'bg-[#22180e] text-[#ffd700] border border-[#443019] hover:border-[#ffd700]/60'
                    }`}
                    title="Αναπαραγωγή ήχου κοσμικού συντονισμού 432 Hz"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Βάση 432 Hz • Φ = 1.618</span>
                  </button>
                </div>
              </div>

              {/* Playing audio status bar if active */}
              {playingFreq && (
                <div className="p-2.5 rounded-lg bg-[#1e160e] border border-[#ffd700]/40 flex items-center justify-between text-xs font-serif text-[#ffd700]">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ffd700]"></span>
                    </div>
                    <Volume2 className="w-4 h-4 text-[#ffd700] animate-pulse" />
                    <span>
                      Αναπαραγωγή Ακουστικής Συχνότητας: <strong>{playingLabel}</strong> ({playingFreq} Hz)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleStopTone}
                    className="px-2 py-0.5 rounded bg-[#2c1e13] hover:bg-[#3c2918] border border-[#ffd700]/50 text-[11px] font-mono text-[#f5ecd8] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <VolumeX className="w-3 h-3 text-[#ffd700]" />
                    <span>Διακοπή</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-serif">
                {/* Golden Ratio Φ */}
                <div className="p-3 rounded-lg bg-[#18120b] border border-[#332415] space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-[#a69680] flex items-center justify-between">
                    <span>Χρυσή Τομή (Φ)</span>
                    <span className="text-[#ffd700] font-bold font-serif">Φ ≈ 1.618</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#ffd700]">
                    {harmonics.phiRatio.toLocaleString('el-GR')}
                  </div>
                  <p className="text-[11px] font-mono text-[#8c7e6c]">
                    Αρμονική Διαίρεση (Ν / Φ)
                  </p>
                  <div className="text-[11px] font-mono text-[#bfa480] pt-1 border-t border-[#281c10]">
                    Πολλαπλάσιο (Ν × Φ): <strong className="text-[#f5ecd8]">{harmonics.phiMultiplied.toLocaleString('el-GR')}</strong>
                  </div>
                </div>

                {/* Musical Note */}
                <div 
                  onClick={() => handlePlayTone(harmonics.frequencyHz, harmonics.musicalNote)}
                  className={`p-3 rounded-lg border space-y-1.5 transition-all cursor-pointer group ${
                    playingFreq === harmonics.frequencyHz
                      ? 'bg-[#261c11] border-[#ffd700] shadow-md shadow-[#ffd700]/20'
                      : 'bg-[#18120b] border-[#332415] hover:border-[#ffd700]/60'
                  }`}
                  title="Κάντε κλικ για ακρόαση της νότας"
                >
                  <div className="text-[10px] uppercase font-mono text-[#a69680] flex items-center justify-between">
                    <span className="group-hover:text-[#ffd700] transition-colors">Πυθαγόρεια Νότα</span>
                    <Volume2 className={`w-3.5 h-3.5 transition-colors ${playingFreq === harmonics.frequencyHz ? 'text-[#ffd700] animate-pulse' : 'text-[#c89b3c] group-hover:text-[#ffd700]'}`} />
                  </div>
                  <div className="text-base font-bold font-serif text-[#f5ecd8] flex items-center justify-between">
                    <span>{harmonics.musicalNote}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#281c10] text-[#ffd700] border border-[#443019]">
                      {playingFreq === harmonics.frequencyHz ? 'Παίζει...' : 'Ακρόαση'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8c7e6c]">
                    {harmonics.pythagoreanDescription}
                  </p>
                  <div className="text-[11px] font-mono text-[#c89b3c] pt-1 border-t border-[#281c10] flex items-center justify-between">
                    <span>Συχνότητα:</span>
                    <strong className="text-[#ffd700] font-bold">{harmonics.frequencyHz} Hz ♫</strong>
                  </div>
                </div>

                {/* Pythagorean Interval */}
                <div className="p-3 rounded-lg bg-[#18120b] border border-[#332415] space-y-1.5">
                  <div className="text-[10px] uppercase font-mono text-[#a69680] flex items-center justify-between">
                    <span>Πυθαγόρειο Διάστημα</span>
                    <span className="text-[#ffd700] font-mono">Τετρακτύς</span>
                  </div>
                  <div className="text-sm font-bold font-serif text-[#f5ecd8]">
                    {harmonics.intervalRatio}
                  </div>
                  <p className="text-[11px] font-mono text-[#8c7e6c]">
                    Αρμονική Σχέση Χορδής
                  </p>
                  <div className="text-[11px] font-mono text-[#bfa480] pt-1 border-t border-[#281c10]">
                    Συντονισμός Πυθμένα: <strong className="text-[#ffd700]">{result.mathProps.pythmen}</strong>
                  </div>
                </div>

                {/* Solfeggio & Cosmic Frequency */}
                <div 
                  onClick={() => handlePlayTone(harmonics.solfeggioFreq, `${harmonics.solfeggioFreq} Hz Solfeggio`)}
                  className={`p-3 rounded-lg border space-y-1.5 transition-all cursor-pointer group ${
                    playingFreq === harmonics.solfeggioFreq
                      ? 'bg-[#12231c] border-emerald-400 shadow-md shadow-emerald-400/20'
                      : 'bg-[#18120b] border-[#332415] hover:border-emerald-500/60'
                  }`}
                  title="Κάντε κλικ για ακρόαση της συχνότητας Solfeggio"
                >
                  <div className="text-[10px] uppercase font-mono text-[#a69680] flex items-center justify-between">
                    <span className="group-hover:text-emerald-300 transition-colors">Ιερά Συχνότητα Solfeggio</span>
                    <Radio className={`w-3.5 h-3.5 transition-colors ${playingFreq === harmonics.solfeggioFreq ? 'text-emerald-400 animate-pulse' : 'text-emerald-400/70 group-hover:text-emerald-300'}`} />
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-300 flex items-center justify-between">
                    <span>{harmonics.solfeggioFreq} Hz</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10241b] text-emerald-300 border border-emerald-800">
                      {playingFreq === harmonics.solfeggioFreq ? 'Παίζει...' : 'Ακρόαση'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#8c7e6c]">
                    Κοσμικός Συντονισμός 432Hz
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400/90 pt-1 border-t border-[#281c10] flex items-center justify-between">
                    <span>Αρμονικός Παλμός:</span>
                    <strong className="text-[#f5ecd8]">Εναρμόνιση ♫</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Pythagorean Octave Scale (ΝΤΟ έως ΝΤΟ²) */}
              <div className="pt-2 border-t border-[#2a1e12] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-serif text-[#a69680]">
                  <span className="flex items-center gap-1.5 text-[#ffd700] font-bold uppercase tracking-wider">
                    <Music className="w-3 h-3 text-[#ffd700]" />
                    Πυθαγόρειο Επτάχορδο (Κλίμακα 432 Hz — Πατήστε οποιαδήποτε νότα για Ήχο):
                  </span>
                  <span className="text-[10px] font-mono text-[#8c7e6c]">
                    8 Πυθαγόρειοι Φθόγγοι
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {PYTHAGOREAN_OCTAVE_NOTES.map(note => {
                    const isCurrentForWord = harmonics.musicalNote.includes(note.name);
                    const isPlaying = playingFreq === note.freq;
                    return (
                      <button
                        key={note.name}
                        type="button"
                        onClick={() => handlePlayTone(note.freq, `${note.name} (${note.latin})`)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1 group ${
                          isPlaying
                            ? 'bg-[#ffd700] text-black border-[#ffd700] shadow-md scale-105 font-bold'
                            : isCurrentForWord
                            ? 'bg-[#251d13] border-[#ffd700] text-[#ffd700] shadow-sm shadow-[#ffd700]/30'
                            : 'bg-[#15110d] border-[#2d2114] text-[#d6c7b2] hover:border-[#ffd700]/50 hover:bg-[#1f1811]'
                        }`}
                        title={`${note.name} (${note.latin}) - ${note.freq} Hz - ${note.desc}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-mono uppercase ${isPlaying ? 'text-black' : isCurrentForWord ? 'text-[#ffd700]' : 'text-[#8c7e6c]'}`}>
                            {note.latin}
                          </span>
                          <Volume2 className={`w-3 h-3 ${isPlaying ? 'text-black animate-pulse' : isCurrentForWord ? 'text-[#ffd700]' : 'text-[#7d6c57] group-hover:text-[#ffd700]'}`} />
                        </div>
                        <div className={`text-xs font-serif font-bold ${isPlaying ? 'text-black' : 'text-[#f5ecd8]'}`}>
                          {note.name}
                        </div>
                        <div className={`text-[10px] font-mono ${isPlaying ? 'text-black' : 'text-[#c89b3c]'}`}>
                          {note.freq} Hz
                        </div>
                        {isCurrentForWord && !isPlaying && (
                          <span className="text-[8px] uppercase tracking-wider font-mono px-1 py-0.2 rounded bg-[#382b1c] text-[#ffd700] mt-0.5">
                            Λεξάριθμος
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Εργαστήριο Ακουστικής: Γεννήτρια Hz & Μετρητής Εξωτερικών Ήχων */}
            <FrequencyAudioLab
              currentLexarithmValue={result.finalValue}
              currentWordNote={harmonics.musicalNote}
              currentWordFreq={harmonics.frequencyHz}
            />
          </>
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
        expression={input.trim() || 'ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ'}
        totalValue={result.finalValue || 1818}
        greekNumeral={result.greekNumeral || '͵αωιη´'}
        systemName={getSystemTitle(system)}
        mathProps={input.trim() ? result.mathProps : calculateIsopsephy('ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ', system).mathProps}
        wordBreakdowns={input.trim() ? result.wordBreakdowns : calculateIsopsephy('ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ', system).wordBreakdowns}
        stepsExplanation={input.trim() ? result.stepsExplanation : calculateIsopsephy('ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ', system).stepsExplanation}
      />

    </div>
  );
};
