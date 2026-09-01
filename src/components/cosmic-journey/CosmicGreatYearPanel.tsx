import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  X,
  Orbit,
  Sparkles,
  Compass,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Search,
  ArrowRight,
  Flame,
  Droplets,
  Wind,
  Layers,
  ChevronRight,
  Info,
  Calendar,
  FastForward,
  Shield,
  Zap,
  Globe,
  Sun,
  Eye,
  BookOpen,
  Scale
} from "lucide-react";
import {
  GREAT_YEAR_COSMOLOGY,
  ZODIAC_SIGNS_DATA,
  ZodiacSignData,
  calculateGreatYearEra,
} from "../../data/greatYearData";

interface CosmicGreatYearPanelProps {
  onClose: () => void;
  onSelectWordForCalculator?: (word: string) => void;
}

const ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Πυρ: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/40", glow: "shadow-amber-500/20" },
  Γη: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", glow: "shadow-emerald-500/20" },
  Αήρ: { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/40", glow: "shadow-sky-500/20" },
  Ύδωρ: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/40", glow: "shadow-blue-500/20" },
};

export const CosmicGreatYearPanel: React.FC<CosmicGreatYearPanelProps> = ({
  onClose,
  onSelectWordForCalculator,
}) => {
  // Precession State
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(72); // years per tick
  const [selectedSignId, setSelectedSignId] = useState<string>("aquarius");
  const [elementFilter, setElementFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"orrery" | "signs" | "cosmology" | "seasons">("orrery");

  const animRef = useRef<number | null>(null);

  // Era calculation for currentYear
  const eraInfo = useMemo(() => {
    return calculateGreatYearEra(currentYear);
  }, [currentYear]);

  // Selected sign details
  const selectedSign = useMemo(() => {
    return ZODIAC_SIGNS_DATA.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS_DATA[0];
  }, [selectedSignId]);

  // Filtered signs
  const filteredSigns = useMemo(() => {
    return ZODIAC_SIGNS_DATA.filter((s) => {
      return elementFilter === "all" || s.element === elementFilter;
    });
  }, [elementFilter]);

  // Animation Loop for Precession
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentYear((prev) => {
          // Precession moves backwards in zodiac (future years move forward in time)
          const next = prev + playSpeed;
          if (next > 15000) return -12000; // loop
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, playSpeed]);

  // Quick jump historical milestones
  const PRESETS = [
    { label: "10.960 π.Χ. (Λέων / Κατακλυσμός & Σφίγγα)", year: -10960, sign: "leo" },
    { label: "4.480 π.Χ. (Ταύρος / Μινωικός Πολιτισμός)", year: -4480, sign: "taurus" },
    { label: "2.320 π.Χ. (Κριός / Χρυσόμαλλο Δέρας)", year: -2320, sign: "aries" },
    { label: "160 π.Χ. (Εκκίνηση Εποχής Ιχθύων)", year: -160, sign: "pisces" },
    { label: "1 μ.Χ. (Γέννηση Χριστού / 160ό έτος Ιχθύων)", year: 1, sign: "pisces" },
    { label: "2000 μ.Χ. (Μετάβαση στον Υδροχόο / Millennium)", year: 2000, sign: "aquarius" },
    { label: "2026 μ.Χ. (Τρέχον: 26ο έτος Υδροχόου / 0° 21' 40'')", year: 2026, sign: "aquarius" },
    { label: "4.160 μ.Χ. (Αιγόκερως / Μέλλον)", year: 4160, sign: "capricorn" },
  ];

  // Calculate precessional angle on the 360 wheel
  // 25920 years = 360 degrees => 1 degree = 72 years
  const currentAngle = useMemo(() => {
    // Standardize year into cycle relative to 2000 CE (Aquarius start)
    const normalizedYear = (((currentYear - 2000) % 25920) + 25920) % 25920;
    return (normalizedYear / 25920) * 360;
  }, [currentYear]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-zinc-100">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#0a0a14] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/10">
              <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: "20s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-serif">
                  Ὁ Μέγας Ἐνιαυτὸς (25.920 Ἔτη)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  Πλατωνικός Κύκλος
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Η Μετάπτωση των Ισημεριών • 12 Αστρολογικές Εποχές των 2.160 Ετών • 72 Έτη ανά 1°
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {[
              { id: "orrery", label: "Ουράνιο Ωρολόγιο (Orrery)", icon: Orbit },
              { id: "signs", label: "12 Αστερισμοί & Εποχές", icon: Compass },
              { id: "seasons", label: "4 Κοσμικές Εποχές & Αιώνες", icon: Layers },
              { id: "cosmology", label: "Πυθαγόρεια & Πλατωνική Σοφία", icon: BookOpen },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Real-time Year Indicator Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900/90 border border-amber-500/30 text-xs">
            <span className="text-zinc-400">Έτος:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {currentYear < 0 ? `${Math.abs(currentYear)} π.Χ.` : `${currentYear} μ.Χ.`}
            </span>
            <span className="text-zinc-500 font-mono">|</span>
            <span className="text-sky-300 font-semibold truncate max-w-[150px]">
              {eraInfo.greatAge.ancientName}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          {/* TAB 1: CELESTIAL ORRERY & TIMELINE */}
          {activeTab === "orrery" && (
            <div className="space-y-6">
              {/* Precession Clock Interactive Canvas / SVG Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* SVG Precession Wheel (5 cols) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-purple-600/5 pointer-events-none" />

                  {/* SVG Zodiac Wheel with retrograde precessional pointer */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                    <svg
                      viewBox="0 0 400 400"
                      className="w-full h-full transform transition-transform duration-700 drop-shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    >
                      <defs>
                        <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
                        </linearGradient>
                        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                          <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      {/* Outer Rim */}
                      <circle cx="200" cy="200" r="185" fill="#090912" stroke="#3f3f46" strokeWidth="2" />
                      <circle cx="200" cy="200" r="145" fill="#0c0c1a" stroke="url(#wheelGrad)" strokeWidth="3" />

                      {/* 12 Zodiac Segments (30 degrees each) */}
                      {ZODIAC_SIGNS_DATA.map((sign, idx) => {
                        // Precession moves retrograde (reverse order around circle)
                        const angle = idx * 30 - 90;
                        const rad = (angle * Math.PI) / 180;
                        const x = 200 + 165 * Math.cos(rad);
                        const y = 200 + 165 * Math.sin(rad);

                        // Line divider
                        const lx1 = 200 + 145 * Math.cos(rad);
                        const ly1 = 200 + 145 * Math.sin(rad);
                        const lx2 = 200 + 185 * Math.cos(rad);
                        const ly2 = 200 + 185 * Math.sin(rad);

                        const isCurrent = eraInfo.greatAge.id === sign.id;

                        return (
                          <g
                            key={sign.id}
                            className="cursor-pointer transition-all hover:opacity-100"
                            onClick={() => {
                              setSelectedSignId(sign.id);
                              setCurrentYear(sign.id === "aquarius" ? 2026 : -idx * 2160);
                            }}
                          >
                            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#3f3f46" strokeWidth="1.5" />
                            {/* Sign Symbol & Name */}
                            <circle
                              cx={x}
                              cy={y}
                              r="15"
                              fill={isCurrent ? "#f59e0b" : "#181824"}
                              stroke={isCurrent ? "#fef08a" : "#3f3f46"}
                              strokeWidth="1.5"
                            />
                            <text
                              x={x}
                              y={y + 4}
                              fill={isCurrent ? "#000000" : "#e4e4e7"}
                              fontSize="12"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {sign.symbol}
                            </text>
                          </g>
                        );
                      })}

                      {/* Center Sun & Earth Axis Wobble */}
                      <circle cx="200" cy="200" r="45" fill="url(#sunGlow)" />
                      <circle cx="200" cy="200" r="28" fill="#18182b" stroke="#f59e0b" strokeWidth="2" />
                      <text x="200" y="196" fill="#fef08a" fontSize="11" fontWeight="bold" textAnchor="middle">
                        ΗΛΙΟΣ
                      </text>
                      <text x="200" y="210" fill="#9ca3af" fontSize="9" textAnchor="middle">
                        25.920 ε.
                      </text>

                      {/* Rotating Precession Indicator Needle (Spring Equinox Pointer) */}
                      <g transform={`rotate(${currentAngle}, 200, 200)`}>
                        <line
                          x1="200"
                          y1="200"
                          x2="200"
                          y2="58"
                          stroke="#38bdf8"
                          strokeWidth="3"
                          strokeDasharray="4 2"
                          className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                        />
                        <polygon points="200,45 194,62 206,62" fill="#38bdf8" />
                        <circle cx="200" cy="53" r="3" fill="#ffffff" />
                      </g>
                    </svg>

                    <div className="absolute bottom-2 text-center">
                      <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                        Δείκτης Εαρινής Ισημερίας
                      </span>
                    </div>
                  </div>
                </div>

                {/* Precession Controls & Current Era Overview (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Current Era Hero Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0f0f1c] via-[#141224] to-[#121626] border border-amber-500/30 shadow-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{eraInfo.greatAge.symbol}</span>
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 font-serif">
                            {eraInfo.greatAge.greatAgeArchetype}
                          </h3>
                        </div>
                        <span className="text-xs text-zinc-400">
                          {eraInfo.greatAge.ancientName} • Κυβερνήτης: {eraInfo.greatAge.rulingGod}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-zinc-400 block">Χρονικό Διάστημα:</span>
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          {eraInfo.greatAge.greatAgeSpan}
                        </span>
                      </div>
                    </div>

                    {/* Precise Degree & Astronomical Coordinate HUD */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-amber-500/30">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">Ακριβής Μοίρα:</span>
                        <span className="text-sm sm:text-base font-mono font-bold text-amber-300">
                          {eraInfo.formattedDegrees}
                        </span>
                        <span className="text-[10px] text-zinc-500 block font-mono">
                          ({eraInfo.degreeInAgeExact.toFixed(3)}° / 30°)
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-sky-500/30">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">Έτος στην Εποχή:</span>
                        <span className="text-sm sm:text-base font-mono font-bold text-sky-300">
                          {eraInfo.yearInCurrentAge}ο έτος
                        </span>
                        <span className="text-[10px] text-zinc-500 block font-mono">
                          από τα 2.160 έτη
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-purple-500/30">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">Δεκανός (10°):</span>
                        <span className="text-xs sm:text-sm font-mono font-bold text-purple-300">
                          {eraInfo.decanDescription.split(":")[0]}
                        </span>
                        <span className="text-[10px] text-zinc-500 block font-mono">
                          {eraInfo.decanDescription.split(":")[1] || "1ος Δεκανός"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-emerald-500/30">
                        <span className="text-[10px] text-zinc-400 block uppercase font-mono">Υπολειπόμενα:</span>
                        <span className="text-sm sm:text-base font-mono font-bold text-emerald-300">
                          {eraInfo.yearsRemainingInAge} έτη
                        </span>
                        <span className="text-[10px] text-zinc-500 block font-mono">
                          {(2160 - eraInfo.yearInCurrentAge)} έτη έως επόμενη
                        </span>
                      </div>
                    </div>

                    {/* Progress within current 2,160 yr age */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-zinc-300">
                        <span>Πρόοδος Αστρολογικής Εποχής (2.160 έτη):</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {eraInfo.progressPercent.toFixed(2)}% ({eraInfo.formattedDegrees} / 30°)
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, eraInfo.progressPercent))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>1° = 72 έτη • 1' = 1,2 έτη • 1'' = 7,3 ημέρες</span>
                        <span>1 Δεκανός = 10° = 720 έτη</span>
                      </div>
                    </div>

                    {/* Historical / Christological Connection Highlight */}
                    {eraInfo.historicalChristRelationship && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Χρονολογική Συσχέτιση & Ιστορικό Ορόσημο:</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">
                          {eraInfo.historicalChristRelationship}
                        </p>
                      </div>
                    )}

                    {/* Scientific Relativity of the Transition Note */}
                    <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-sky-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sky-300">
                          <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>Επιστημονική & Αστρονομική Σχετικότητα της Μετάβασης:</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/40 text-sky-300 font-mono">
                          Συμβατικό Μοντέλο
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.comparisons.map((c, i) => (
                          <div key={i} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[10px] space-y-0.5">
                            <div className="flex justify-between font-bold">
                              <span className="text-zinc-200">{c.model}</span>
                              <span className="text-amber-300 font-mono">{c.entryYear}</span>
                            </div>
                            <p className="text-zinc-400 text-[9px]">{c.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/80">
                      {eraInfo.greatAge.greatAgeHistory}
                    </p>
                  </div>

                  {/* Precession Player & Interactive Slider */}
                  <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          <span>{isPlaying ? "Παύση Κίνησης" : "Προσομοίωση Μετάπτωσης"}</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentYear(2026);
                          }}
                          title="Επαναφορά στο Σήμερα (2026)"
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-100 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Speed selectors */}
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-zinc-500 mr-1 text-[11px]">Ταχύτητα:</span>
                        {[
                          { label: "1x (72ε/s)", speed: 72 },
                          { label: "5x (360ε/s)", speed: 360 },
                          { label: "15x (1080ε/s)", speed: 1080 },
                        ].map((sp) => (
                          <button
                            key={sp.speed}
                            onClick={() => setPlaySpeed(sp.speed)}
                            className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                              playSpeed === sp.speed
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                            }`}
                          >
                            {sp.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Slider & Manual Year Input */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span>12.000 π.Χ.</span>
                        <div className="flex items-center gap-2">
                          <label className="text-zinc-400 text-xs">Επιλογή Έτους:</label>
                          <input
                            type="number"
                            value={currentYear}
                            onChange={(e) => setCurrentYear(parseInt(e.target.value) || 0)}
                            className="w-24 px-2 py-1 rounded bg-zinc-900 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs text-center focus:outline-none focus:border-amber-400"
                          />
                          <span className="text-amber-400 font-bold">
                            {currentYear < 0 ? `(${Math.abs(currentYear)} π.Χ.)` : `(${currentYear} μ.Χ.)`}
                          </span>
                        </div>
                        <span>12.000 μ.Χ.</span>
                      </div>
                      <input
                        type="range"
                        min="-12000"
                        max="12000"
                        step="1"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentYear(p.year);
                            setSelectedSignId(p.sign);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 transition-all cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 12 CONSTELLATIONS & ERAS GRID */}
          {activeTab === "signs" && (
            <div className="space-y-4">
              {/* Element Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: "all", label: "Όλα τα Ζώδια (12)" },
                    { id: "Πυρ", label: "Πυρ (Κριός, Λέων, Τοξότης)" },
                    { id: "Γη", label: "Γη (Ταύρος, Παρθένος, Αιγόκερως)" },
                    { id: "Αήρ", label: "Αήρ (Δίδυμοι, Ζυγός, Υδροχόος)" },
                    { id: "Ύδωρ", label: "Ύδωρ (Καρκίνος, Σκορπιός, Ιχθύες)" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setElementFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        elementFilter === f.id
                          ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                          : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 12 Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSigns.map((sign) => {
                  const elemStyle = ELEMENT_COLORS[sign.element] || ELEMENT_COLORS["Πυρ"];
                  const isSelected = selectedSign.id === sign.id;

                  return (
                    <div
                      key={sign.id}
                      onClick={() => setSelectedSignId(sign.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10"
                          : "bg-zinc-900/50 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                      <div>
                        {/* Top Sign Header */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{sign.symbol}</span>
                            <div>
                              <h3 className="text-base font-bold text-zinc-100">{sign.name}</h3>
                              <span className="text-[10px] font-mono text-zinc-400">
                                {sign.ancientName} • {sign.degrees}
                              </span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${elemStyle.bg} ${elemStyle.text} border ${elemStyle.border}`}>
                            {sign.element}
                          </span>
                        </div>

                        {/* Archetype & Span */}
                        <div className="text-xs font-semibold text-amber-300 mb-1">
                          {sign.greatAgeArchetype}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 mb-2">
                          Εποχή: {sign.greatAgeSpan}
                        </div>

                        <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                          {sign.greatAgeHistory}
                        </p>
                      </div>

                      {/* Isopsephy Footer */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-500">Ισοψηφία:</span>
                          <span className="font-mono font-bold text-amber-400">
                            {sign.isopsephyWord} = {sign.isopsephyValue}
                          </span>
                        </div>

                        {onSelectWordForCalculator && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectWordForCalculator(sign.isopsephyWord);
                              onClose();
                            }}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline"
                          >
                            Υπολογιστής ➔
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Sign Deep Inspection Drawer */}
              {selectedSign && (
                <div className="p-5 rounded-2xl bg-zinc-950/90 border border-amber-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedSign.symbol}</span>
                      <div>
                        <h3 className="text-xl font-bold text-zinc-100">
                          {selectedSign.name} ({selectedSign.ancientName})
                        </h3>
                        <p className="text-xs text-amber-300">{selectedSign.greatAgeArchetype}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-black/60 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                        Λεξάριθμος: {selectedSign.isopsephyWord} = {selectedSign.isopsephyValue}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-500 block mb-0.5">Κυβερνήτης Θεός / Πλανήτης:</span>
                      <span className="font-bold text-zinc-200">{selectedSign.rulingGod}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-500 block mb-0.5">Αττικός Μήνας (Ετήσιος):</span>
                      <span className="font-bold text-zinc-200">{selectedSign.atticMonthMatch}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-500 block mb-0.5">Ποιότητα & Μοίρες:</span>
                      <span className="font-bold text-zinc-200">{selectedSign.quality} ({selectedSign.degrees})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Ιστορική & Θεολογική Εκδήλωση στον Μεγάλο Ενιαυτό
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800">
                      {selectedSign.theologicalConnection}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      Μυστική Ετυμολογία «ΖΩ...ΔΙΑ» (Ζωή δια του Διός)
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-sky-950/20 p-3.5 rounded-xl border border-sky-500/20">
                      {selectedSign.zoDiaEtymology}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 4 COSMIC SEASONS & HESIODIC AGES */}
          {activeTab === "seasons" && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h3 className="text-xl font-bold font-serif text-amber-300">
                  Οἱ Τέσσερις Κοσμικὲς Ὧρες & Οἱ Ἡσιόδειοι Αἰῶνες
                </h3>
                <p className="text-xs text-zinc-400">
                  Όπως το γήινο έτος των 365 ημερών έχει 4 εποχές, έτσι και ο Μέγας Ενιαυτός των 25.920 ετών υποδιαιρείται σε 4 Μεγάλες Κοσμικές Εποχές των 6.480 ετών έκαστη.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Κοσμικὸν Ἔαρ (Άνοιξη)",
                    age: "Χρυσοῦς Αἰών (Golden Age)",
                    years: "6.480 Έτη (Λέων, Καρκίνος, Δίδυμοι)",
                    desc: "Η εποχή της απόλυτης πνευματικότητας, της επικοινωνίας με τους θεούς και της αρμονίας του Χρυσού Γένους.",
                    color: "border-amber-500/40 bg-amber-950/20 text-amber-300",
                    isopsephy: "ΧΡΥΣΟΥΣ = 1570",
                  },
                  {
                    title: "Κοσμικὸν Θέρος (Καλοκαίρι)",
                    age: "Ἀργυροῦς Αἰών (Silver Age)",
                    years: "6.480 Έτη (Ταύρος, Κριός, Ιχθύες - 1ο μισό)",
                    desc: "Η άνθηση των μεγάλων θρησκειών, των ναών, της γεωργίας και των πυραμιδικών μνημείων στον κόσμο.",
                    color: "border-sky-500/40 bg-sky-950/20 text-sky-300",
                    isopsephy: "ΑΡΓΥΡΟΥΣ = 884",
                  },
                  {
                    title: "Κοσμικὸν Φθινόπωρον",
                    age: "Χαλκοῦς Αἰών (Bronze Age)",
                    years: "6.480 Έτη (Ιχθύες, Υδροχόος, Αιγόκερως)",
                    desc: "Η άνοδος του ορθολογισμού, της τεχνολογίας, των συγκρούσεων και της αναζήτησης της χαμένης πνευματικής μνήμης.",
                    color: "border-orange-500/40 bg-orange-950/20 text-orange-300",
                    isopsephy: "ΧΑΛΚΟΥΣ = 1121",
                  },
                  {
                    title: "Κοσμικὸς Χειμών",
                    age: "Σιδηροῦς Αἰών & Ἐκπύρωσις / Κατακλυσμός",
                    years: "6.480 Έτη (Τοξότης, Σκορπιός, Ζυγός)",
                    desc: "Η εποχή της πυκνής ύλης, του ληθάργου, που ολοκληρώνεται με τη Μεγάλη Κάθαρση (Εκπύρωσις ή Κατακλυσμός) πριν την αναγέννηση.",
                    color: "border-purple-500/40 bg-purple-950/20 text-purple-300",
                    isopsephy: "ΣΙΔΗΡΟΥΣ = 994",
                  },
                ].map((season, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${season.color} flex flex-col justify-between space-y-3`}>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase opacity-80">{season.title}</span>
                      <h4 className="text-base font-bold text-zinc-100 mt-1">{season.age}</h4>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">{season.years}</div>
                      <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{season.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-[11px] font-mono font-bold text-amber-400">
                      {season.isopsephy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PYTHAGOREAN & PLATONIC COSMOLOGY */}
          {activeTab === "cosmology" && (
            <div className="space-y-6">
              {/* Plato & Hipparchus Quotes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Πλάτων — «Τίμαιος» (39d)
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-serif italic">
                    «{GREAT_YEAR_COSMOLOGY.platoReference}»
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    Ίππαρχος ο Ρόδιος (190–120 π.Χ.)
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {GREAT_YEAR_COSMOLOGY.hipparchusDiscovery}
                  </p>
                </div>
              </div>

              {/* Mathematical Harmonics of 25,920 */}
              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-amber-500/30 space-y-4">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  Οἱ Ἱεροὶ Ἀριθμοὶ τοῦ Μεγάλου Ἐνιαυτοῦ
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block text-[10px]">Πλήρης Κύκλος (360°):</span>
                    <span className="text-lg font-mono font-bold text-amber-400">25.920 έτη</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block text-[10px]">1 Ζώδιο (30°):</span>
                    <span className="text-lg font-mono font-bold text-sky-400">2.160 έτη</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block text-[10px]">1 Μοίρα (1°):</span>
                    <span className="text-lg font-mono font-bold text-emerald-400">72 έτη</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block text-[10px]">1 Δεκανός (10°):</span>
                    <span className="text-lg font-mono font-bold text-purple-400">720 έτη</span>
                  </div>
                </div>

                {/* Isopsephic Keys */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Ισοψηφικοί Κώδικες «ΖΩ...ΔΙΑ»
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {GREAT_YEAR_COSMOLOGY.etymologyZoDia.isopsephicCodes.map((code, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-amber-300">{code.term}</span>
                          <span className="font-mono text-zinc-400 ml-1.5">({code.value})</span>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{code.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* In-depth Scientific & Astronomical Transition Analysis */}
              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-sky-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-zinc-100">
                    {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.title}
                  </h3>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed bg-sky-950/20 p-3.5 rounded-xl border border-sky-500/20">
                  {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.reasons.map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-300">{r.title}</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border border-zinc-800 rounded-xl overflow-hidden">
                    <thead className="bg-zinc-900 text-zinc-400 text-[11px]">
                      <tr>
                        <th className="p-2.5">Σύστημα / Μοντέλο Μέτρησης</th>
                        <th className="p-2.5">Εκτιμώμενη Έναρξη Υδροχόου</th>
                        <th className="p-2.5">Αστρονομική & Φιλοσοφική Παρατήρηση</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-zinc-950/50">
                      {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.comparisons.map((c, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/40">
                          <td className="p-2.5 font-bold text-zinc-200">{c.model}</td>
                          <td className="p-2.5 font-mono text-amber-400 font-bold">{c.entryYear}</td>
                          <td className="p-2.5 text-zinc-400 text-[11px]">{c.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
              Τρέχουσα Εποχή: <strong>{eraInfo.greatAge.ancientName}</strong>
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">
            25.920 έτη = 12 × 2.160 έτη = 360° × 72 έτη/μοίρα
          </span>
        </div>
      </div>
    </div>
  );
};
