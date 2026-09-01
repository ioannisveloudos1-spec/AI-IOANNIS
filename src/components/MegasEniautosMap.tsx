import React, { useState, useMemo } from "react";
import {
  Orbit,
  Sparkles,
  Compass,
  Clock,
  Layers,
  Search,
  BookOpen,
  Info,
  Calendar,
  Flame,
  Droplets,
  Wind,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Copy,
  Check,
  Calculator
} from "lucide-react";
import { AppTheme } from "../utils/theme";
import {
  GREAT_YEAR_COSMOLOGY,
  ZODIAC_SIGNS_DATA,
  ZodiacSignData,
  calculateGreatYearEra
} from "../data/greatYearData";

interface MegasEniautosMapProps {
  theme?: AppTheme;
  onSelectWord?: (word: string) => void;
}

export const MegasEniautosMap: React.FC<MegasEniautosMapProps> = ({
  theme = "dark-ancient",
  onSelectWord,
}) => {
  const [selectedSignId, setSelectedSignId] = useState<string>("aquarius");
  const [elementFilter, setElementFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customYearInput, setCustomYearInput] = useState<number>(2026);
  const [cycleMode, setCycleMode] = useState<"great-year" | "annual">("great-year");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const selectedSign = useMemo(() => {
    return ZODIAC_SIGNS_DATA.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS_DATA[0];
  }, [selectedSignId]);

  const yearCalculation = useMemo(() => {
    return calculateGreatYearEra(customYearInput);
  }, [customYearInput]);

  const filteredSigns = useMemo(() => {
    return ZODIAC_SIGNS_DATA.filter((s) => {
      const matchesElement = elementFilter === "all" || s.element === elementFilter;
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ancientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rulingGod.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.greatAgeArchetype.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.atticMonthMatch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.greatAgeSpan.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesElement && matchesSearch;
    });
  }, [elementFilter, searchQuery]);

  // Theme styles helper
  const styles = useMemo(() => {
    switch (theme) {
      case "parchment":
        return {
          cardBg: "bg-[#fbf7ee] border-[#d8c2a5] text-[#382109]",
          cardActiveBg: "bg-[#fffdf9] border-[#8c5307] ring-2 ring-[#8c5307]/30 shadow-md",
          highlightBox: "bg-[#f5ecdd] border-[#dfceb6] text-[#382109]",
          accentText: "text-[#8c5307]",
          subtext: "text-[#6e4e2a]",
          badgeBg: "bg-[#f0e3ce] border-[#cbb698] text-[#543216]",
          wheelCenterBg: "#ebdcc5",
          wheelCenterText: "#382109",
          wheelBorder: "#bfa37c",
          inputBg: "bg-[#fffdfa] border-[#cbb698] text-[#382109]",
          buttonAction: "bg-[#ebdcc5] hover:bg-[#dfceb6] text-[#382109] border-[#bfa37c]"
        };
      case "solar":
        return {
          cardBg: "bg-[#160f04] border-[#4d3209] text-[#ffeedb]",
          cardActiveBg: "bg-[#241704] border-[#fb8500] ring-2 ring-[#fb8500]/40 shadow-lg shadow-amber-950/40",
          highlightBox: "bg-[#201404] border-[#5e3b08] text-[#ffeedb]",
          accentText: "text-[#ffb703]",
          subtext: "text-[#e0a96d]",
          badgeBg: "bg-[#2e1c03] border-[#704808] text-[#ffb703]",
          wheelCenterBg: "#2c1b03",
          wheelCenterText: "#ffb703",
          wheelBorder: "#fb8500",
          inputBg: "bg-[#181003] border-[#593706] text-[#ffeedb]",
          buttonAction: "bg-[#2e1c03] hover:bg-[#472c05] text-[#ffb703] border-[#704808]"
        };
      case "ethereal":
        return {
          cardBg: "bg-[#091120] border-[#1e3a5f] text-[#e0f2fe]",
          cardActiveBg: "bg-[#0f2342] border-[#38bdf8] ring-2 ring-[#38bdf8]/40 shadow-lg shadow-sky-950/40",
          highlightBox: "bg-[#0c182e] border-[#1e3a5f] text-[#e0f2fe]",
          accentText: "text-[#38bdf8]",
          subtext: "text-[#7dd3fc]/80",
          badgeBg: "bg-[#0f2342] border-[#2563eb]/40 text-[#7dd3fc]",
          wheelCenterBg: "#0f2342",
          wheelCenterText: "#38bdf8",
          wheelBorder: "#38bdf8",
          inputBg: "bg-[#070d18] border-[#1e3a5f] text-[#e0f2fe]",
          buttonAction: "bg-[#0f2342] hover:bg-[#16335f] text-[#38bdf8] border-[#38bdf8]/40"
        };
      default: // dark-ancient
        return {
          cardBg: "bg-[#130f0b] border-[#2f2214] text-[#f5ecd8]",
          cardActiveBg: "bg-[#1d1610] border-[#ffd700] ring-2 ring-[#ffd700]/30 shadow-lg shadow-amber-950/50",
          highlightBox: "bg-[#1a140e] border-[#382617] text-[#f5ecd8]",
          accentText: "text-[#ffd700]",
          subtext: "text-[#a69680]",
          badgeBg: "bg-[#261c12] border-[#3d2918] text-[#ffd700]",
          wheelCenterBg: "#1f1811",
          wheelCenterText: "#ffd700",
          wheelBorder: "#ffd700",
          inputBg: "bg-[#140f0a] border-[#3d2c1c] text-[#f5ecd8]",
          buttonAction: "bg-[#261c12] hover:bg-[#382618] text-[#ffd700] border-[#523820]"
        };
    }
  }, [theme]);

  const getElementColor = (el: string) => {
    switch (el) {
      case "Πυρ":
        return "text-red-400 border-red-500/30 bg-red-950/30";
      case "Γη":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-950/30";
      case "Αήρ":
        return "text-sky-400 border-sky-500/30 bg-sky-950/30";
      case "Ύδωρ":
        return "text-blue-400 border-blue-500/30 bg-blue-950/30";
      default:
        return "text-amber-400 border-amber-500/30 bg-amber-950/30";
    }
  };

  const getElementIcon = (el: string) => {
    switch (el) {
      case "Πυρ":
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case "Γη":
        return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
      case "Αήρ":
        return <Wind className="w-3.5 h-3.5 text-sky-400" />;
      case "Ύδωρ":
        return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Overview & Fundamental Constants */}
      <div className={`p-6 sm:p-7 rounded-3xl border ${styles.cardBg} relative overflow-hidden shadow-xl`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Orbit className="w-6 h-6 animate-spin-slow" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
                {GREAT_YEAR_COSMOLOGY.title}
              </h2>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${styles.subtext}`}>
              {GREAT_YEAR_COSMOLOGY.definition}
            </p>
          </div>

          {/* Mode Switcher: Great Year vs Annual */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl border bg-black/20 self-start lg:self-center">
            <button
              onClick={() => setCycleMode("great-year")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                cycleMode === "great-year"
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-amber-200/70 hover:text-amber-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Μέγας Ενιαυτός (25.920 Ἔτη)
            </button>
            <button
              onClick={() => setCycleMode("annual")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                cycleMode === "annual"
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-amber-200/70 hover:text-amber-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Μικρός Ενιαυτός (1 Ἔτος)
            </button>
          </div>
        </div>

        {/* 4 Mathematical Pillars of the Great Year */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className={`p-3.5 rounded-2xl border ${styles.highlightBox} text-center space-y-1`}>
            <div className={`text-[11px] uppercase tracking-wider font-bold ${styles.subtext}`}>
              Πλήρης Κύκλος (360°)
            </div>
            <div className={`text-lg sm:text-xl font-bold font-mono ${styles.accentText}`}>
              25.920 Ἔτη
            </div>
            <div className="text-[10px] opacity-75">1 Πλατωνικός Ενιαυτός</div>
          </div>

          <div className={`p-3.5 rounded-2xl border ${styles.highlightBox} text-center space-y-1`}>
            <div className={`text-[11px] uppercase tracking-wider font-bold ${styles.subtext}`}>
              12 Αστρολογικές Εποχές (30°)
            </div>
            <div className={`text-lg sm:text-xl font-bold font-mono ${styles.accentText}`}>
              2.160 Ἔτη
            </div>
            <div className="text-[10px] opacity-75">1 Μέγας Μήνας ανά Ζώδιο</div>
          </div>

          <div className={`p-3.5 rounded-2xl border ${styles.highlightBox} text-center space-y-1`}>
            <div className={`text-[11px] uppercase tracking-wider font-bold ${styles.subtext}`}>
              1 Μοῖρα Ἐκλειπτικῆς (1°)
            </div>
            <div className={`text-lg sm:text-xl font-bold font-mono ${styles.accentText}`}>
              72 Ἔτη
            </div>
            <div className="text-[10px] opacity-75">72 × 360° = 25.920 έτη</div>
          </div>

          <div className={`p-3.5 rounded-2xl border ${styles.highlightBox} text-center space-y-1`}>
            <div className={`text-[11px] uppercase tracking-wider font-bold ${styles.subtext}`}>
              1 Δεκανὸς (10°)
            </div>
            <div className={`text-lg sm:text-xl font-bold font-mono ${styles.accentText}`}>
              720 Ἔτη
            </div>
            <div className="text-[10px] opacity-75">3 Δεκανοί = 2.160 έτη</div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Great Year Time Calculator & Era Locator */}
      <div className={`p-5 sm:p-6 rounded-3xl border ${styles.cardBg} space-y-4 shadow-lg`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Ὑπολογιστὴς Κοσμικῆς Ἐποχῆς & Μέγα Ἐνιαυτοῦ
              </h3>
              <p className={`text-xs ${styles.subtext}`}>
                Εισάγετε οποιοδήποτε έτος (π.Χ. ή μ.Χ.) για να εντοπίσετε την ακριβή Εποχή και τη θέση του άξονα στον κύκλο των 25.920 ετών.
              </p>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setCustomYearInput(-3000)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer ${styles.buttonAction}`}
            >
              3000 π.Χ. (Ταύρος)
            </button>
            <button
              onClick={() => setCustomYearInput(-500)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer ${styles.buttonAction}`}
            >
              500 π.Χ. (Κριός)
            </button>
            <button
              onClick={() => setCustomYearInput(1000)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer ${styles.buttonAction}`}
            >
              1000 μ.Χ. (Ιχθύες)
            </button>
            <button
              onClick={() => setCustomYearInput(2026)}
              className="px-2.5 py-1 rounded-lg border border-amber-500 bg-amber-500/20 text-amber-300 font-bold text-[11px] font-mono cursor-pointer"
            >
              2026 μ.Χ. (Σήμερα)
            </button>
            <button
              onClick={() => setCustomYearInput(2160)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer ${styles.buttonAction}`}
            >
              2160 μ.Χ. (Υδροχόος)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold block uppercase tracking-wider opacity-80">
              Εἰσαγωγὴ Ἔτους:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customYearInput}
                onChange={(e) => setCustomYearInput(parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2.5 rounded-xl border font-mono text-base font-bold outline-none focus:ring-2 focus:ring-amber-500/50 ${styles.inputBg}`}
                placeholder="π.χ. 2026 ή -500"
              />
              <span className={`text-xs font-bold px-3 py-2.5 rounded-xl border whitespace-nowrap ${styles.badgeBg}`}>
                {customYearInput < 0 ? `${Math.abs(customYearInput)} π.Χ.` : `${customYearInput} μ.Χ.`}
              </span>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className={`p-4 rounded-2xl border ${styles.highlightBox} space-y-3`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{yearCalculation.greatAge.symbol}</span>
                  <div>
                    <span className="text-xs uppercase tracking-wider opacity-75 font-bold">
                      Κοσμικη Εποχη Μεγα Ενιαυτου:
                    </span>
                    <h4 className={`text-base sm:text-lg font-bold ${styles.accentText}`}>
                      Εποχή {yearCalculation.greatAge.ancientName}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs opacity-75 block">Διάρκεια Εποχής:</span>
                  <span className="font-mono text-xs font-bold">{yearCalculation.greatAge.greatAgeYears} (30°)</span>
                </div>
              </div>

              {/* Progress bar within the 2,160 year Age */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>Πρόοδος στην Εποχή ({yearCalculation.progressPercent}%)</span>
                  <span>Υπολείπονται: {yearCalculation.yearsRemainingInAge} έτη</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/40 border border-amber-500/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(3, Math.min(100, yearCalculation.progressPercent))}%` }}
                  />
                </div>
              </div>

              <p className="text-xs leading-relaxed italic opacity-90">
                {yearCalculation.astronomicalEraNotes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive SVG Zodiac Wheel & 360° Great Map */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${styles.cardBg} space-y-6 shadow-xl`}>
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Orbit className="w-3.5 h-3.5" />
            Κοσμικός Χάρτης των 12 Ζωδίων (ΖΩ...ΔΙΑ)
          </div>
          <h3 className="text-lg sm:text-2xl font-bold tracking-wide">
            {cycleMode === "great-year"
              ? "Ὁ Μεταπτωτικὸς Τροχὸς τοῦ Μέγα Ἐνιαυτοῦ (25.920 Ἔτη)"
              : "Ὁ Ἐτήσιος Ἡλιακὸς Τροχὸς τοῦ Ἐνιαυτοῦ (365,25 Ἡμέρες)"}
          </h3>
          <p className={`text-xs ${styles.subtext}`}>
            {cycleMode === "great-year"
              ? "Κάντε κλικ σε οποιοδήποτε ζώδιο/αστερισμό στον τροχό για να εξερευνήσετε τα 2.160 έτη της εποχής του, την αρχαία ιστορία, τις μυστηριακές τελετές και την ετυμολογία του «ΖΩ...ΔΙΑ»."
              : "Κάντε κλικ σε οποιοδήποτε ζώδιο για να δείτε τον ετήσιο ηλιακό μήνα, τις ημερομηνίες και τον αντίστοιχο Αττικό μήνα."}
          </p>
        </div>

        {/* Circular SVG Zodiac Map */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex-shrink-0">
            <svg viewBox="0 0 400 400" className="w-full h-full transform -rotate-90">
              {/* Outer decorative ring */}
              <circle
                cx="200"
                cy="200"
                r="190"
                fill="none"
                stroke={styles.wheelBorder}
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.6"
              />
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke={styles.wheelBorder}
                strokeWidth="1.5"
                opacity="0.8"
              />

              {/* 12 Sectors for the 12 Signs (30 deg each) */}
              {ZODIAC_SIGNS_DATA.map((sign, index) => {
                const anglePerSlice = 360 / 12;
                const startAngle = index * anglePerSlice;
                const endAngle = startAngle + anglePerSlice;
                const midAngle = startAngle + anglePerSlice / 2;

                const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;

                const outerR = 175;
                const innerR = 110;

                const x1 = 200 + outerR * Math.cos(rad(startAngle));
                const y1 = 200 + outerR * Math.sin(rad(startAngle));
                const x2 = 200 + outerR * Math.cos(rad(endAngle));
                const y2 = 200 + outerR * Math.sin(rad(endAngle));

                const x3 = 200 + innerR * Math.cos(rad(endAngle));
                const y3 = 200 + innerR * Math.sin(rad(endAngle));
                const x4 = 200 + innerR * Math.cos(rad(startAngle));
                const y4 = 200 + innerR * Math.sin(rad(startAngle));

                const pathData = `
                  M ${x1} ${y1}
                  A ${outerR} ${outerR} 0 0 1 ${x2} ${y2}
                  L ${x3} ${y3}
                  A ${innerR} ${innerR} 0 0 0 ${x4} ${y4}
                  Z
                `;

                // Icon/Symbol position
                const symbolR = 145;
                const sx = 200 + symbolR * Math.cos(rad(midAngle));
                const sy = 200 + symbolR * Math.sin(rad(midAngle));

                const isSelected = selectedSignId === sign.id;

                let fillColor = "rgba(0,0,0,0.3)";
                if (isSelected) {
                  fillColor = "rgba(251, 191, 36, 0.4)";
                } else if (sign.element === "Πυρ") {
                  fillColor = "rgba(239, 68, 68, 0.15)";
                } else if (sign.element === "Γη") {
                  fillColor = "rgba(16, 185, 129, 0.15)";
                } else if (sign.element === "Αήρ") {
                  fillColor = "rgba(56, 189, 248, 0.15)";
                } else if (sign.element === "Ύδωρ") {
                  fillColor = "rgba(59, 130, 246, 0.15)";
                }

                return (
                  <g
                    key={sign.id}
                    onClick={() => setSelectedSignId(sign.id)}
                    className="cursor-pointer transition-all duration-200 group"
                  >
                    <path
                      d={pathData}
                      fill={fillColor}
                      stroke={isSelected ? "#fbbf24" : "rgba(251, 191, 36, 0.3)"}
                      strokeWidth={isSelected ? "3" : "1"}
                      className="hover:fill-amber-500/40 transition-colors"
                    />
                    <text
                      x={sx}
                      y={sy}
                      fill={isSelected ? "#ffffff" : "#fbbf24"}
                      fontSize="17"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(90, ${sx}, ${sy})`}
                      className="select-none font-sans"
                    >
                      {sign.symbol}
                    </text>
                  </g>
                );
              })}

              {/* Center Hub */}
              <circle
                cx="200"
                cy="200"
                r="100"
                fill={styles.wheelCenterBg}
                stroke={styles.wheelBorder}
                strokeWidth="2"
              />
            </svg>

            {/* Inner Hub Center Content (Overlay) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6">
              <span className="text-3xl animate-pulse">{selectedSign.symbol}</span>
              <span className={`text-base font-bold mt-1 ${styles.accentText}`}>
                {selectedSign.name}
              </span>
              <span className="text-[10px] font-mono opacity-80">
                {cycleMode === "great-year" ? selectedSign.greatAgeYears : selectedSign.degrees}
              </span>
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 mt-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                {selectedSign.element} • {selectedSign.quality}
              </span>
            </div>
          </div>

          {/* Selected Sign Detailed Breakdown Card */}
          <div className="w-full lg:flex-1 space-y-4">
            <div className={`p-5 sm:p-6 rounded-2xl border ${styles.cardActiveBg} space-y-4`}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3 border-amber-500/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedSign.symbol}</span>
                    <h4 className={`text-xl font-bold ${styles.accentText}`}>
                      {selectedSign.ancientName}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${getElementColor(selectedSign.element)}`}>
                      {selectedSign.element}
                    </span>
                  </div>
                  <p className={`text-xs ${styles.subtext} mt-0.5`}>
                    Κυβερνήτης: <strong className="text-amber-300">{selectedSign.rulingGod}</strong> ({selectedSign.rulingPlanet}) • Μοίρες: <strong className="font-mono text-amber-300">{selectedSign.degrees}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectWord) onSelectWord(selectedSign.isopsephyWord);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5 ${styles.buttonAction}`}
                    title="Υπολογισμός στο Λεξικό/Αριθμομηχανή"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    {selectedSign.isopsephyWord} = {selectedSign.isopsephyValue}
                  </button>
                  <button
                    onClick={() => handleCopy(`${selectedSign.ancientName} - ${selectedSign.greatAgeArchetype}`)}
                    className={`p-2 rounded-xl border text-xs cursor-pointer ${styles.buttonAction}`}
                    title="Αντιγραφή"
                  >
                    {copiedText?.includes(selectedSign.name) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Dual View: Great Year vs Annual Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Left: Great Year Era (2160 Years) */}
                <div className={`p-3.5 rounded-xl border ${styles.highlightBox} space-y-1.5`}>
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Μέγας Ενιαυτός (2.160 Ἔτη)
                    </span>
                    <span className="font-mono text-[11px]">{selectedSign.greatAgeSpan}</span>
                  </div>
                  <div className="text-xs font-bold">{selectedSign.greatAgeArchetype}</div>
                  <p className="text-[11px] leading-relaxed opacity-85">
                    {selectedSign.greatAgeHistory}
                  </p>
                </div>

                {/* Right: Annual Solar Year (1 Year) */}
                <div className={`p-3.5 rounded-xl border ${styles.highlightBox} space-y-1.5`}>
                  <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Ἐτήσιος Ἐνιαυτὸς (1 Ἔτος)
                    </span>
                    <span className="font-mono text-[11px]">{selectedSign.annualDates}</span>
                  </div>
                  <div className="text-xs font-bold">
                    Αττικός Μήνας: <span className="text-amber-300">{selectedSign.atticMonthMatch}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-85">
                    {selectedSign.annualMeaning}
                  </p>
                </div>
              </div>

              {/* The «ΖΩ...ΔΙΑ» Connection for this sign */}
              <div className={`p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1`}>
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Μυστική Σύνδεση «ΖΩ...ΔΙΑ» (Ζωὴ διὰ τοῦ Διός):
                </div>
                <p className="text-xs leading-relaxed text-amber-100/90 italic">
                  «{selectedSign.zoDiaEtymology}» — {selectedSign.theologicalConnection}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Deep Theological & Isopsephic Analysis: «ΖΩ...ΔΙΑ» (Ζωή δια του Διός) */}
      <div className={`p-6 sm:p-7 rounded-3xl border ${styles.cardBg} space-y-5 shadow-xl`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              {GREAT_YEAR_COSMOLOGY.etymologyZoDia.title}
            </h3>
            <p className={`text-xs ${styles.subtext}`}>
              Ρίζα: <strong className="text-amber-400">{GREAT_YEAR_COSMOLOGY.etymologyZoDia.root}</strong> • Ο Ζωοφόρος Κύκλος των 12 Ζωσών Πυλών
            </p>
          </div>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border ${styles.highlightBox} space-y-3`}>
          <p className="text-xs sm:text-sm leading-relaxed">
            {GREAT_YEAR_COSMOLOGY.etymologyZoDia.philosophicalDepth}
          </p>
          <div className="border-t border-amber-500/20 pt-3 text-xs italic opacity-90">
            {GREAT_YEAR_COSMOLOGY.platoReference}
          </div>
        </div>

        {/* Scientific Transition & Astronomical Relativity */}
        <div className="p-4.5 sm:p-5 rounded-2xl border border-sky-500/30 bg-sky-950/20 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-sky-300 text-sm">
              <Compass className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.title}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-900/40 text-sky-300 border border-sky-500/30">
              Αστρονομική Σχετικότητα
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.reasons.map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <div className="text-xs font-bold text-amber-300">{r.title}</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px]">
            {GREAT_YEAR_COSMOLOGY.aquariusEpochInsight.scientificRelativity.comparisons.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-sky-500/20 space-y-0.5">
                <div className="font-bold text-zinc-200">{c.model}</div>
                <div className="text-amber-300 font-mono font-bold">{c.entryYear}</div>
                <div className="text-[10px] text-zinc-400">{c.notes}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Isopsephic Grid for Great Year & ZoDia Terms */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Ισοψηφικοί Κώδικες του Ενιαυτού & των Ζωδίων
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GREAT_YEAR_COSMOLOGY.etymologyZoDia.isopsephicCodes.map((code, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (onSelectWord) onSelectWord(code.term);
                }}
                className={`p-3.5 rounded-2xl border ${styles.cardBg} hover:border-amber-500/50 transition-all cursor-pointer space-y-1.5 group`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base group-hover:text-amber-400 transition-colors">
                    {code.term}
                  </span>
                  <span className={`text-base font-bold font-mono ${styles.accentText}`}>
                    = {code.value}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-amber-400/80">
                  {code.breakdown}
                </div>
                <p className={`text-[11px] leading-relaxed ${styles.subtext}`}>
                  {code.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Complete 12 Zodiac Grid with Filters */}
      <div className={`p-6 sm:p-7 rounded-3xl border ${styles.cardBg} space-y-5 shadow-xl`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Πλήρης Χάρτης των 12 Αστερισμών (2.160 Ἔτη έκαστος)
            </h3>
            <p className={`text-xs ${styles.subtext}`}>
              Επιλέξτε στοιχείο ή αναζητήστε για να δείτε τα 12 ζώδια και τις εποχές τους.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Element Filter Pills */}
            <div className="flex items-center p-1 rounded-xl border bg-black/20 text-xs">
              {["all", "Πυρ", "Γη", "Αήρ", "Ύδωρ"].map((el) => (
                <button
                  key={el}
                  onClick={() => setElementFilter(el)}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    elementFilter === el
                      ? "bg-amber-500 text-black shadow-sm"
                      : "text-amber-200/70 hover:text-amber-200"
                  }`}
                >
                  {el === "all" ? "Όλα (12)" : el}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Αναζήτηση ζωδίου, θεού..."
                className={`pl-8 pr-3 py-1 rounded-xl border text-xs outline-none ${styles.inputBg}`}
              />
            </div>
          </div>
        </div>

        {/* 12 Signs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSigns.map((sign) => {
            const isSelected = selectedSignId === sign.id;
            return (
              <div
                key={sign.id}
                onClick={() => setSelectedSignId(sign.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected ? styles.cardActiveBg : `${styles.cardBg} hover:border-amber-500/40`
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{sign.symbol}</span>
                    <div>
                      <h4 className="text-base font-bold flex items-center gap-1.5">
                        {sign.name}
                        <span className="text-xs opacity-75 font-normal">({sign.degrees})</span>
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] opacity-80">
                        {getElementIcon(sign.element)}
                        <span>{sign.element}</span>
                        <span>•</span>
                        <span>{sign.rulingGod}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${styles.badgeBg}`}>
                    {sign.greatAgeYears}
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${styles.highlightBox}`}>
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                    <span>{sign.greatAgeSpan}</span>
                    <span className="opacity-75">Μέγας Ενιαυτός</span>
                  </div>
                  <div className="text-[11px] font-semibold text-amber-200 leading-snug break-words">
                    {sign.greatAgeArchetype}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-amber-500/10">
                  <span className="opacity-75">
                    Αττικός: <strong className="text-amber-300">{sign.atticMonthMatch}</strong>
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    {sign.isopsephyWord} = {sign.isopsephyValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
