import React, { useState } from "react";
import {
  PHI,
  INV_PHI,
  GoldenRatioAnalysis,
  analyzeGoldenRatio,
  calculateHarmonicScore,
} from "../utils/goldenRatio";
import { numberToGreekNumeral } from "../utils/isopsephy";
import {
  Sparkles,
  Gauge,
  Compass,
  Layers,
  HelpCircle,
  TrendingUp,
  Scale,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  Percent,
} from "lucide-react";

interface GoldenRatioGaugeToolProps {
  totalValue: number;
  wordBreakdowns: {
    rawWord: string;
    value: number;
    letters: { char: string; originalChar?: string; value: number }[];
  }[];
  isEnglishSystem?: boolean;
}

export const GoldenRatioGaugeTool: React.FC<GoldenRatioGaugeToolProps> = ({
  totalValue,
  wordBreakdowns,
  isEnglishSystem = false,
}) => {
  const [selectedRatioType, setSelectedRatioType] = useState<
    "AUTO" | "VOWELS_CONSONANTS" | "WORDS" | "HALVES" | "FIBONACCI" | "CUSTOM"
  >("AUTO");
  const [customNumA, setCustomNumA] = useState<string>("888");
  const [customNumB, setCustomNumB] = useState<string>("548");
  const [showTheory, setShowTheory] = useState<boolean>(false);
  const [showAllWordPairs, setShowAllWordPairs] = useState<boolean>(false);

  const analysis: GoldenRatioAnalysis = analyzeGoldenRatio(
    totalValue,
    wordBreakdowns,
    isEnglishSystem
  );

  // Compute Custom Ratio
  const valA = parseFloat(customNumA) || 0;
  const valB = parseFloat(customNumB) || 0;
  let customRatio = 1.618;
  let customScore = 0;
  let customDesc = "";
  if (valA > 0 && valB > 0) {
    const hi = Math.max(valA, valB);
    const lo = Math.min(valA, valB);
    customRatio = Math.round((hi / lo) * 10000) / 10000;
    customScore = calculateHarmonicScore(customRatio);
    customDesc = `Προσαρμοσμένος Λόγος: ${hi} / ${lo}`;
  }

  // Determine active ratio & score based on selected tab
  let activeRatio = analysis.primaryRatio;
  let activeScore = analysis.primaryProximityScore;
  let activeLabel = analysis.primaryRatioDescription;

  if (selectedRatioType === "VOWELS_CONSONANTS") {
    activeRatio = analysis.vowelConsonantRatio;
    activeScore = analysis.vowelConsonantScore;
    activeLabel =
      analysis.vowelConsonantOrientation === "C_OVER_V"
        ? `Σύμφωνα (${analysis.consonantsValue}) / Φωνήεντα (${analysis.vowelsValue})`
        : `Φωνήεντα (${analysis.vowelsValue}) / Σύμφωνα (${analysis.consonantsValue})`;
  } else if (selectedRatioType === "WORDS" && analysis.bestWordRatio) {
    activeRatio = analysis.bestWordRatio.ratio;
    activeScore = analysis.bestWordRatio.harmonicScore;
    activeLabel = `Λέξεις: «${analysis.bestWordRatio.wordA}» (${analysis.bestWordRatio.valA}) / «${analysis.bestWordRatio.wordB}» (${analysis.bestWordRatio.valB})`;
  } else if (selectedRatioType === "HALVES") {
    activeRatio = analysis.halfRatio;
    activeScore = analysis.halfScore;
    activeLabel = `1ο Ήμισυ (${analysis.firstHalfValue}) / 2ο Ήμισυ (${analysis.secondHalfValue})`;
  } else if (selectedRatioType === "FIBONACCI") {
    const fibRatio =
      analysis.nearestFibonacci > 0 && totalValue > 0
        ? Math.round((Math.max(totalValue, analysis.nearestFibonacci) / Math.min(totalValue, analysis.nearestFibonacci)) * 10000) / 10000
        : 1.618;
    activeRatio = fibRatio;
    activeScore = calculateHarmonicScore(fibRatio);
    activeLabel = `Λεξάριθμος (${totalValue}) / Εγγύτερος Fibonacci (${analysis.nearestFibonacci})`;
  } else if (selectedRatioType === "CUSTOM") {
    activeRatio = customRatio;
    activeScore = customScore;
    activeLabel = customDesc || "Προσαρμοσμένη Σύγκριση";
  }

  const diffFromPhi = Math.abs(activeRatio - PHI);

  // Map ratio to gauge angle:
  // Range: 1.000 to 2.500 (180 degrees total arc: from -90° to +90°, or 0 to 180)
  // Target PHI = 1.618 is at ~41.2% of the range (1.0 -> 2.5), roughly angle -16° (or 74° from left)
  const minRange = 1.0;
  const maxRange = 2.5;
  const clampedRatio = Math.max(minRange, Math.min(maxRange, activeRatio));
  const ratioFraction = (clampedRatio - minRange) / (maxRange - minRange); // 0 to 1
  const needleAngle = -90 + ratioFraction * 180; // -90° to +90°

  // Target PHI angle on gauge
  const phiFraction = (PHI - minRange) / (maxRange - minRange); // ~0.412
  const phiAngle = -90 + phiFraction * 180; // ~ -15.84°

  // Color theme by score
  const getBadgeColor = (score: number) => {
    if (score >= 90) return "text-[#e6c670] bg-[#2d2213] border-[#c89b3c]";
    if (score >= 75) return "text-emerald-300 bg-[#16291a] border-emerald-600/50";
    if (score >= 50) return "text-amber-300 bg-[#292013] border-amber-600/50";
    return "text-[#a69680] bg-[#1a1714] border-[#362e24]";
  };

  const getBadgeTitle = (score: number) => {
    if (score >= 95) return "Εξαιρετική Χρυσή Αρμονία (Χρυσός Λόγος Φ)";
    if (score >= 85) return "Υψηλή Αρμονική Σύγκλιση (Φ ± 0.05)";
    if (score >= 70) return "Αξιοσημείωτη Αρμονική Εγγύτητα";
    if (score >= 50) return "Μέτρια Αρμονική Αναλογία";
    return "Βασική / Χαμηλή Σύγκλιση";
  };

  return (
    <div
      id="golden-ratio-gauge-tool"
      className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#181410] via-[#14100c] to-[#0e0c0a] border-2 border-[#c89b3c]/40 shadow-xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2e2419]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#261d13] border border-[#523d24] text-[#e6c670] shadow-inner">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f7e0aa] via-[#e6c670] to-[#c89b3c]">
                Ανάλυση Χρυσής Τομής (Φ = 1.618034)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2b2014] text-[#e6c670] border border-[#4d381f]">
                Harmonic Gauge
              </span>
            </div>
            <p className="text-xs font-serif text-[#a69680] mt-0.5">
              Αυτόματος έλεγχος αρμονικής αναλογίας λεξαρίθμων, συμφώνων/φωνηέντων και διαμερισμού κειμένου.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTheory((prev) => !prev)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201913] hover:bg-[#2c2219] border border-[#3e3020] text-xs font-serif text-[#d6c7b2] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#c89b3c]" />
          <span>{showTheory ? "Απόκρυψη Θεωρίας" : "Μαθηματική Θεωρία Φ"}</span>
        </button>
      </div>

      {/* Theory Drawer */}
      {showTheory && (
        <div className="p-4 rounded-xl bg-[#120f0c] border border-[#3a2d1d] space-y-3 text-xs font-serif text-[#c4b59f] animate-fadeIn">
          <div className="flex items-center gap-2 text-[#e6c670] font-bold">
            <Sparkles className="w-4 h-4 text-[#c89b3c]" />
            <span>Η Χρυσή Τομή στην Ελληνική Γραμματεία & Πυθαγόρεια Αριθμοσοφία</span>
          </div>
          <p className="leading-relaxed">
            Ο <strong>Χρυσός Λόγος (Φ ≈ 1.6180339887...)</strong> ορίζεται ως η αναλογία όπου ο λόγος του όλου προς το μείζον τμήμα ισούται με τον λόγο του μείζονος προς το έλασσον: (a + b) / a = a / b = Φ = (1 + √5) / 2.
            Στην ισοψηφία, η αρμονική σύγκλιση υπολογίζει αν τα επιμέρους στοιχεία ενός κειμένου (όπως η αναλογία συμφώνων προς φωνήεντα, οι σχετικές αξίες των λέξεων, ή ο διαμερισμός σε μείζον/έλασσον) προσεγγίζουν την απόλυτη αναλογία 1.618.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px] pt-1">
            <div className="p-2.5 rounded-lg bg-[#1a1510] border border-[#2d2216]">
              <span className="text-[#8c7e6c]">Χρυσός Αριθμός:</span>
              <div className="text-[#f5ecd8] font-bold mt-0.5">Φ = 1.6180339887...</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#1a1510] border border-[#2d2216]">
              <span className="text-[#8c7e6c]">Αντίστροφος (1/Φ = Φ - 1):</span>
              <div className="text-[#e6c670] font-bold mt-0.5">1/Φ ≈ 0.6180339887...</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#1a1510] border border-[#2d2216]">
              <span className="text-[#8c7e6c]">Τετράγωνο (Φ² = Φ + 1):</span>
              <div className="text-[#f5ecd8] font-bold mt-0.5">Φ² ≈ 2.6180339887...</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Gauge Dial on Left, Harmonic Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Visual Arc Gauge (5 Cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-[#110e0b] border border-[#2d2317] shadow-inner relative">
          
          <div className="w-full flex items-center justify-between text-xs font-mono text-[#8c7e6c] mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Μετρητής Αρμονίας</span>
            </span>
            <span className="text-[11px] text-[#e6c670] font-bold">
              Στόχος Φ = 1.6180
            </span>
          </div>

          {/* SVG Gauge Graphic */}
          <div className="relative w-full max-w-[260px] aspect-[260/150] flex items-center justify-center">
            <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
              <defs>
                {/* Arc Gradients */}
                <linearGradient id="gaugeArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#574836" />
                  <stop offset="35%" stopColor="#b45309" />
                  <stop offset="41.2%" stopColor="#e6c670" />
                  <stop offset="47%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#574836" />
                </linearGradient>

                <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Arc Track: Center (120, 120), Radius 90 */}
              <path
                d="M 30 120 A 90 90 0 0 1 210 120"
                fill="none"
                stroke="#241d16"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Colored Gauge Track */}
              <path
                d="M 30 120 A 90 90 0 0 1 210 120"
                fill="none"
                stroke="url(#gaugeArcGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Golden Zone Target Highlight (1.55 - 1.70) */}
              {/* Radius 90, Angles ~ -24° to -7° from top center */}
              <circle
                cx={120 + 90 * Math.sin((phiAngle * Math.PI) / 180)}
                cy={120 - 90 * Math.cos((phiAngle * Math.PI) / 180)}
                r="6"
                fill="#e6c670"
                filter="url(#glowGold)"
              />

              {/* Ticks and Markings */}
              {[
                { val: "1.0", angle: -90 },
                { val: "1.3", angle: -54 },
                { val: "Φ 1.618", angle: phiAngle, highlight: true },
                { val: "1.9", angle: 18 },
                { val: "2.2", angle: 54 },
                { val: "2.5+", angle: 90 },
              ].map((tick, idx) => {
                const rad = (tick.angle * Math.PI) / 180;
                const x1 = 120 + 96 * Math.sin(rad);
                const y1 = 120 - 96 * Math.cos(rad);
                const x2 = 120 + 104 * Math.sin(rad);
                const y2 = 120 - 104 * Math.cos(rad);

                return (
                  <g key={idx}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={tick.highlight ? "#e6c670" : "#574836"}
                      strokeWidth={tick.highlight ? 2.5 : 1.5}
                    />
                  </g>
                );
              })}

              {/* Needle Indicator */}
              <g
                transform={`rotate(${needleAngle} 120 120)`}
                className="transition-transform duration-700 ease-out"
              >
                {/* Needle path */}
                <polygon
                  points="117,120 123,120 121,38 119,38"
                  fill={activeScore >= 80 ? "#f7e0aa" : "#e6c670"}
                  filter={activeScore >= 85 ? "url(#glowGold)" : undefined}
                />
                <circle cx="120" cy="120" r="7" fill="#2d2214" stroke="#c89b3c" strokeWidth="2.5" />
                <circle cx="120" cy="120" r="3" fill="#f5ecd8" />
              </g>

              {/* Center Readout Text in SVG */}
              <text
                x="120"
                y="110"
                textAnchor="middle"
                className="font-mono text-2xl font-black fill-[#f5ecd8] tracking-tight"
              >
                {activeRatio.toFixed(4)}
              </text>
            </svg>
          </div>

          {/* Resonance Badge under Gauge */}
          <div className="w-full text-center mt-2 space-y-1.5">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-sm ${getBadgeColor(
                activeScore
              )}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {activeScore.toFixed(1)}% Αρμονική Σύγκλιση
              </span>
            </div>

            <div className="text-[11px] font-serif text-[#a69680]">
              {getBadgeTitle(activeScore)} • Απόκλιση |Δ|:{" "}
              <strong className="text-[#f5ecd8] font-mono">
                {diffFromPhi.toFixed(4)}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Details & Ratio Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Ratio Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-[#8c7e6c] uppercase tracking-wider">
              Επιλογη Αναλογιας προς Μετρηση:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedRatioType("AUTO")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                  selectedRatioType === "AUTO"
                    ? "bg-[#c89b3c] text-[#14100c] font-bold shadow-md"
                    : "bg-[#1e1913] hover:bg-[#282119] text-[#d6c7b2] border border-[#33291d]"
                }`}
              >
                🌟 Αυτόματη Βέλτιστη
              </button>

              <button
                type="button"
                onClick={() => setSelectedRatioType("VOWELS_CONSONANTS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                  selectedRatioType === "VOWELS_CONSONANTS"
                    ? "bg-[#c89b3c] text-[#14100c] font-bold shadow-md"
                    : "bg-[#1e1913] hover:bg-[#282119] text-[#d6c7b2] border border-[#33291d]"
                }`}
              >
                🔤 Σύμφωνα / Φωνήεντα ({analysis.vowelConsonantRatio})
              </button>

              {analysis.hasMultipleWords && (
                <button
                  type="button"
                  onClick={() => setSelectedRatioType("WORDS")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                    selectedRatioType === "WORDS"
                      ? "bg-[#c89b3c] text-[#14100c] font-bold shadow-md"
                      : "bg-[#1e1913] hover:bg-[#282119] text-[#d6c7b2] border border-[#33291d]"
                  }`}
                >
                  📖 Λέξεις ({analysis.bestWordRatio?.ratio || 1})
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedRatioType("HALVES")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                  selectedRatioType === "HALVES"
                    ? "bg-[#c89b3c] text-[#14100c] font-bold shadow-md"
                    : "bg-[#1e1913] hover:bg-[#282119] text-[#d6c7b2] border border-[#33291d]"
                }`}
              >
                ⚖️ 1ο / 2ο Ήμισυ ({analysis.halfRatio})
              </button>

              <button
                type="button"
                onClick={() => setSelectedRatioType("FIBONACCI")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                  selectedRatioType === "FIBONACCI"
                    ? "bg-[#c89b3c] text-[#14100c] font-bold shadow-md"
                    : "bg-[#1e1913] hover:bg-[#282119] text-[#d6c7b2] border border-[#33291d]"
                }`}
              >
                🔢 Fibonacci ({analysis.nearestFibonacci})
              </button>

              <button
                type="button"
                onClick={() => setSelectedRatioType("CUSTOM")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all ${
                  selectedRatioType === "CUSTOM"
                    ? "bg-[#c89b3c] text-[#14100c] font-bold shadow-md"
                    : "bg-[#1e1913] hover:bg-[#282119] text-[#d6c7b2] border border-[#33291d]"
                }`}
              >
                🛠️ Προσαρμοσμένη
              </button>
            </div>
          </div>

          {/* Active Label Box */}
          <div className="p-3.5 rounded-xl bg-[#14110e] border border-[#2b2217] space-y-1">
            <div className="text-[11px] font-mono text-[#8c7e6c] uppercase">
              Τρεχουσα Αναλυση Ενδειξης:
            </div>
            <div className="text-xs sm:text-sm font-serif font-bold text-[#f5ecd8] flex items-center justify-between">
              <span>{activeLabel}</span>
              <span className="font-mono text-[#e6c670] ml-2 shrink-0">
                {activeRatio.toFixed(4)} : 1
              </span>
            </div>
          </div>

          {/* Custom Ratio Inputs (if custom tab selected) */}
          {selectedRatioType === "CUSTOM" && (
            <div className="p-3 rounded-xl bg-[#1a1510] border border-[#3d2e1d] flex flex-wrap items-center gap-2 text-xs font-mono animate-fadeIn">
              <span className="text-[#8c7e6c]">Αριθμός Α:</span>
              <input
                type="number"
                value={customNumA}
                onChange={(e) => setCustomNumA(e.target.value)}
                className="w-24 px-2 py-1 rounded bg-[#0f0d0a] border border-[#332719] text-[#e6c670] font-bold focus:outline-none focus:border-[#c89b3c]"
                placeholder="π.χ. 888"
              />
              <span className="text-[#8c7e6c]">/ Αριθμός Β:</span>
              <input
                type="number"
                value={customNumB}
                onChange={(e) => setCustomNumB(e.target.value)}
                className="w-24 px-2 py-1 rounded bg-[#0f0d0a] border border-[#332719] text-[#e6c670] font-bold focus:outline-none focus:border-[#c89b3c]"
                placeholder="π.χ. 548"
              />
              <span className="text-[#a69680]">
                = <strong className="text-[#f5ecd8]">{customRatio.toFixed(4)}</strong>
              </span>
            </div>
          )}

          {/* Golden Cut (Χρυσός Διαμερισμός) Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            
            <div className="p-3 rounded-xl bg-[#16120e] border border-[#2b2116] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-serif text-[#8c7e6c]">
                <span>Μείζον Τμήμα ($M = V \times 0.618$)</span>
                <span className="text-[#e6c670] font-mono font-bold">61.8%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-serif font-black text-[#f5ecd8]">
                  {analysis.majorSectionRounded.toLocaleString("el-GR")}
                </span>
                {!isEnglishSystem && analysis.majorSectionRounded > 0 && (
                  <span className="text-xs font-serif text-[#c89b3c]">
                    ({numberToGreekNumeral(analysis.majorSectionRounded)})
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-[#786a5a]">
                Ακριβές: {analysis.majorSection.toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#16120e] border border-[#2b2116] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-serif text-[#8c7e6c]">
                <span>Έλασσον Τμήμα ($m = V \times 0.382$)</span>
                <span className="text-[#e6c670] font-mono font-bold">38.2%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-serif font-black text-[#f5ecd8]">
                  {analysis.minorSectionRounded.toLocaleString("el-GR")}
                </span>
                {!isEnglishSystem && analysis.minorSectionRounded > 0 && (
                  <span className="text-xs font-serif text-[#c89b3c]">
                    ({numberToGreekNumeral(analysis.minorSectionRounded)})
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-[#786a5a]">
                Ακριβές: {analysis.minorSection.toFixed(2)}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Deep Breakdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        
        {/* Card 1: Vowels vs Consonants */}
        <div className="p-4 rounded-xl bg-[#13100d] border border-[#282017] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-serif font-bold text-[#e6c670] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Φωνήεντα / Σύμφωνα</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#221a12] text-[#e6c670] border border-[#3e2e1c]">
              {analysis.vowelConsonantScore.toFixed(0)}% Αρμονία
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-serif">
            <div className="flex items-center justify-between text-[#c4b59f]">
              <span>Φωνήεντα ({analysis.vowelsCount}):</span>
              <span className="font-mono font-bold text-[#f5ecd8]">{analysis.vowelsValue}</span>
            </div>
            <div className="flex items-center justify-between text-[#c4b59f]">
              <span>Σύμφωνα ({analysis.consonantsCount}):</span>
              <span className="font-mono font-bold text-[#f5ecd8]">{analysis.consonantsValue}</span>
            </div>
            <div className="pt-1.5 border-t border-[#231b13] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8c7e6c]">Λόγος Αναλογίας:</span>
              <span className="text-[#e6c670] font-bold">
                {analysis.vowelConsonantRatio} : 1
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Fibonacci & Lucas Alignment */}
        <div className="p-4 rounded-xl bg-[#13100d] border border-[#282017] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-serif font-bold text-[#e6c670] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Σειρά Fibonacci</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#221a12] text-[#e6c670] border border-[#3e2e1c]">
              F_{analysis.fibonacciIndex} = {analysis.nearestFibonacci}
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-serif">
            <div className="flex items-center justify-between text-[#c4b59f]">
              <span>Εγγύτερος Όρος Fibonacci:</span>
              <span className="font-mono font-bold text-[#f5ecd8]">{analysis.nearestFibonacci}</span>
            </div>
            <div className="flex items-center justify-between text-[#c4b59f]">
              <span>Απόσταση από Λεξάριθμο:</span>
              <span className="font-mono font-bold text-[#e6c670]">Δ = {analysis.fibonacciDistance}</span>
            </div>
            <div className="pt-1.5 border-t border-[#231b13] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8c7e6c]">Εγγύτερος Lucas:</span>
              <span className="text-[#d6c7b2] font-bold">
                {analysis.nearestLucas} (Δ={analysis.lucasDistance})
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Phi Power Harmonic */}
        <div className="p-4 rounded-xl bg-[#13100d] border border-[#282017] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-serif font-bold text-[#e6c670] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#c89b3c]" />
              <span>Δυνάμεις του Φ (Φⁿ)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#221a12] text-[#e6c670] border border-[#3e2e1c]">
              Φ^{analysis.phiPowerHarmonic.power}
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-serif">
            <div className="flex items-center justify-between text-[#c4b59f]">
              <span>Θεωρητική Τιμή Φ^{analysis.phiPowerHarmonic.power}:</span>
              <span className="font-mono font-bold text-[#f5ecd8]">
                {analysis.phiPowerHarmonic.theoreticalVal}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#c4b59f]">
              <span>Πραγματικός Λεξάριθμος:</span>
              <span className="font-mono font-bold text-[#e6c670]">{totalValue}</span>
            </div>
            <div className="pt-1.5 border-t border-[#231b13] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8c7e6c]">Αρμονική Σύμπτωση:</span>
              <span className="text-[#e6c670] font-bold">
                {analysis.phiPowerHarmonic.score.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Multi-Word Pairs Table (if text has multiple words) */}
      {analysis.hasMultipleWords && analysis.wordPairs.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAllWordPairs((prev) => !prev)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#13100d] border border-[#261e16] hover:border-[#c89b3c]/40 text-xs font-serif text-[#d6c7b2] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#c89b3c]" />
              <span className="font-bold">
                Αναλογίες μεταξύ όλων των Λέξεων ({analysis.wordPairs.length} ζεύγη)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8c7e6c]">
              <span>{showAllWordPairs ? "Απόκρυψη" : "Προβολή όλων"}</span>
              {showAllWordPairs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showAllWordPairs && (
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
              {analysis.wordPairs.map((pair, pIdx) => (
                <div
                  key={pIdx}
                  className={`p-3 rounded-xl border text-xs font-serif flex items-center justify-between ${
                    pair.isGolden
                      ? "bg-[#1f180f] border-[#c89b3c]/60 shadow-sm"
                      : "bg-[#110e0b] border-[#241c14]"
                  }`}
                >
                  <div>
                    <div className="font-bold text-[#f5ecd8]">
                      «{pair.wordA}» / «{pair.wordB}»
                    </div>
                    <div className="text-[11px] font-mono text-[#8c7e6c] mt-0.5">
                      {pair.valA} / {pair.valB} = <strong className="text-[#e6c670]">{pair.ratio}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getBadgeColor(
                        pair.harmonicScore
                      )}`}
                    >
                      {pair.harmonicScore.toFixed(0)}% Φ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
