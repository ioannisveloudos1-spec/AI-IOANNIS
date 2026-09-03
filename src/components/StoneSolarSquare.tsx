import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Sparkles,
  Layers,
  Grid,
  Zap,
  Copy,
  Check,
  Compass,
  Box,
  HelpCircle,
  Eye,
  Flame,
  Shield,
  Activity,
  Maximize2,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  Search,
  BookmarkPlus,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Smartphone,
} from "lucide-react";
import { calculateWordIsopsephy, numberToGreekNumeral, normalizePolytonicGreek } from "../utils/isopsephy";
import { PsychogonicCubeIsometric } from "./PsychogonicCubeIsometric";

interface StoneSolarSquareProps {
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
  onSaveItem?: (item: any) => void;
  compact?: boolean;
}

export type ViewDisplayMode = "arabic" | "greek" | "pythmen" | "complementary";
export type HighlightMode =
  | "all"
  | "row"
  | "col"
  | "diag1"
  | "diag2"
  | "all_diags"
  | "outer_ring"
  | "middle_ring"
  | "core_ring"
  | "complementary_pairs"
  | "custom";

// Classical 6x6 Magic Square of the Sun (Mensa Solis)
// Order n = 6, cells 1..36, Row/Col/Diag Sum = 111, Total = 666
export const SOLAR_SQUARE_MATRIX = [
  [6, 32, 3, 34, 35, 1],
  [7, 11, 27, 28, 8, 30],
  [19, 14, 16, 15, 23, 24],
  [18, 20, 22, 21, 17, 13],
  [25, 29, 10, 9, 26, 12],
  [36, 5, 33, 4, 2, 31],
];

// Greek numeral representation for numbers 1 to 36
export function getAncientGreekNumeral(num: number): string {
  if (num === 6) return "ϛ´"; // Stigma / Digamma
  return numberToGreekNumeral(num);
}

// Calculate Pythagorean Pythmen (1-9)
export function getPythmen(num: number): number {
  const mod = num % 9;
  return mod === 0 ? 9 : mod;
}

// Curated authentic Solar & Isopsephic Words (100% Mathematically Verified in Greek Isopsephy)
export const SOLAR_SACRED_WORDS = [
  // 666 (Solar Total - Mensa Solis)
  { text: "ΤΕΙΤΑΝ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Ο αρχέγονος Τιτάν Ήλιος (Τ:300+Ε:5+Ι:10+Τ:300+Α:1+Ν:50 = 666). Το αυθεντικό αρχαιοελληνικό ηλιακό όνομα του 666." },
  { text: "Η ΦΡΗΝ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Η Κοσμική Διάνοια και ο Ηλιακός Νους (Η:8+Φ:500+Ρ:100+Η:8+Ν:50 = 666)." },
  { text: "ΙΑΝΕΥΣ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Αρχαίο ηλιακό επίθετο του φωτός και των πυλών του ουρανού (Ι:10+Α:1+Ν:50+Ε:5+Υ:400+Σ:200 = 666)." },
  { text: "ΤΟ ΜΕΓΑ ΘΗΡΙΟΝ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Η πρωταρχική ηλιακή δημιουργική ενέργεια της φύσεως (370 + 49 + 247 = 666 / Ηλιακός Λέων)." },
  { text: "ΕΥΠΟΡΙΑ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Η ηλιακή αφθονία, γενναιοδωρία και καρποφορία που γεννά το φως (Ε:5+Υ:400+Π:80+Ο:70+Ρ:100+Ι:10+Α:1 = 666)." },
  { text: "ΑΝΤΕΜΟΣ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Ανθισμένος / Φωτοβόλος, αρχαίο επίθετο της ακτινοβολίας του Ήλιου (1+50+300+5+40+70+200 = 666)." },
  { text: "ΛΑΥΡΕΙΟΝ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Το ιστορικό αθηναϊκό κέντρο αργύρου, φωτός και γεωμετρίας (30+1+400+100+5+10+70+50 = 666)." },
  { text: "ΛΑΤΕΙΝΟΣ", value: 666, category: "Ηλιακό Σύνολο 666", meaning: "Ιστορικό ισοψηφικό όνομα του 666 (30+1+300+5+10+50+70+200 = 666)." },

  // 111 (Solar Constant - Row/Col/Diagonal Sum = ρια´)
  { text: "ΕΝΝΕΑ", value: 111, category: "Ηλιακή Σταθερά 111", meaning: "Ο ιερός αριθμός 9 (3×3) των Μουσών και των 3 Τριάδων (Ε:5+Ν:50+Ν:50+Ε:5+Α:1 = 111 / Πυθμένας 1+1+1 = 3)." },
  { text: "ΡΙΑ", value: 111, category: "Ηλιακή Σταθερά 111", meaning: "Η ακριβής ιωνική αριθμητική γραφή του 111 (Ρ:100 + Ι:10 + Α:1 = 111 = ρια´)." },

  // 318 & 388 (Helios & Sacred Solar Symbols)
  { text: "ΗΛΙΟΣ", value: 318, category: "Όνομα Ηλίου", meaning: "Το καθαυτό όνομα του Ήλιου (Η:8+Λ:30+Ι:10+Ο:70+Σ:200 = 318). Ισοψηφεί ακριβώς με το γράμμα «ΘΗΤΑ» (318), το ιερό σύμβολο του Ηλιακού Δίσκου ⊙." },
  { text: "Ο ΗΛΙΟΣ", value: 388, category: "Όνομα Ηλίου", meaning: "Ο Ήλιος με το οριστικό άρθρο (Ο:70 + ΗΛΙΟΣ:318 = 388 / Πυθμένας 3+8+8 = 19 -> 1)." },

  // 365 (Solar Year / Abraxas / Mithras)
  { text: "ΑΒΡΑΣΑΞ", value: 365, category: "Ηλιακό Έτος 365", meaning: "Ο ηλιακός άρχοντας του ετήσιου κύκλου των 365 ημερών (Α:1+Β:2+Ρ:100+Α:1+Σ:200+Α:1+Ξ:60 = 365)." },
  { text: "ΜΕΙΘΡΑΣ", value: 365, category: "Ηλιακό Έτος 365", meaning: "Ο Ανίκητος Ήλιος (Sol Invictus) του κύκλου των 365 ημερών (40+5+10+9+100+1+200 = 365)." },
  { text: "ΝΕΙΛΟΣ", value: 365, category: "Ηλιακό Έτος 365", meaning: "Ο ιερός ποταμός της ηλιακής ετήσιας αναγέννησης (50+5+10+30+70+200 = 365 ημέρες)." },

  // 1331 (Apollo Cube 11³) & Apollo
  { text: "ΑΠΟΛΛΩΝΟΣ", value: 1331, category: "Κύβος Απόλλωνος 11³", meaning: "Ο Μέγας Κύβος του Φωτός (11 × 11 × 11 = 1331) με κέντρο (6,6,6). (1+80+70+30+30+800+50+70+200 = 1331)." },
  { text: "ΑΠΟΛΛΩΝ", value: 1061, category: "Φοίβος Απόλλων", meaning: "Ο θεός του ηλιακού φωτός, της αρμονίας και της μουσικής (1+80+70+30+30+800+50 = 1061)." },

  // 216 (Psychogonic Cube 6³) & Theogony
  { text: "ΖΕΥΣ", value: 612, category: "Ψυχογονία 6³ ➔ 612", meaning: "Αναγραμματισμός των ψηφίων του Ψυχογονικού Κύβου (6³ = 216 ➔ 612). (7+5+400+200 = 612)." },
  { text: "ΔΙΑΣ", value: 215, category: "Ψυχογονία 216 - 1", meaning: "Ο Ψυχογονικός Κύβος μείον τη Μονάδα: 216 - 1 = 215 (4+10+1+200 = 215)." },

  // Solar Harmonics & Octad (888, 2368, 512, 64)
  { text: "ΙΗΣΟΥΣ", value: 888, category: "Ήλιος Δικαιοσύνης", meaning: "Ο «Ήλιος της Δικαιοσύνης» (10+8+200+70+400+200 = 888 = 8 × 111)." },
  { text: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", value: 2368, category: "Ηλιακή Αρμονία", meaning: "ΙΗΣΟΥΣ (888) + ΧΡΙΣΤΟΣ (1480) = 2368. Αρμονία του ηλιακού φωτός." },
  { text: "ΑΛΗΘΕΙΑ", value: 64, category: "Τετράγωνο 8²", meaning: "Το Τετράγωνο της Αληθείας (8 × 8 = 64 / 1+30+8+9+5+10+1 = 64)." },
  { text: "ΕΙΜΑΙ ΟΤΙ ΕΙΜΑΙ", value: 512, category: "Κύβος 8³", meaning: "Ο Κύβος της Οκτάδας (8 × 8 × 8 = 512). ΕΣ ΑΕΙ ΠΑΙΣ = ΟΙ ΘΕΙΟΙ ΕΛΛΗΝΕΣ." },
];

export const StoneSolarSquare: React.FC<StoneSolarSquareProps> = ({
  onOpenAiModal,
  onSaveItem,
  compact = false,
}) => {
  const [displayMode, setDisplayMode] = useState<ViewDisplayMode>("arabic");
  const [highlightMode, setHighlightMode] = useState<HighlightMode>("all");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number; val: number } | null>({
    r: 0,
    c: 0,
    val: 6,
  });
  const [customSelectedCells, setCustomSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [copiedData, setCopiedData] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<
    "square" | "psychogonic" | "apollo1331" | "awakening" | "enotheism" | "words"
  >("square");

  // Audio tone synthesizer state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentToneFreq, setCurrentToneFreq] = useState<number>(111);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Zoom & Touch Gesture state for Mobile & Desktop
  const [zoomScale, setZoomScale] = useState<number>(1);
  const touchDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const handleZoomChange = (delta: number) => {
    setZoomScale((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      return Math.min(Math.max(next, 0.7), 2.5);
    });
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollLeft = 0;
      gridContainerRef.current.scrollTop = 0;
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
      initialScaleRef.current = zoomScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / touchDistanceRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * factor, 0.7), 2.5);
      setZoomScale(Number(newScale.toFixed(2)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      touchDistanceRef.current = null;
    }
    // Double tap detection to toggle zoom
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        setZoomScale((prev) => (prev > 1.15 ? 1 : 1.5));
      }
      lastTapRef.current = now;
    }
  };

  // Custom Live Word Tester
  const [testerInput, setTesterInput] = useState<string>("");
  const [testerResult, setTesterResult] = useState<{
    text: string;
    val: number;
    relation: string;
  } | null>(null);

  // Compute column sums
  const colSums = [0, 1, 2, 3, 4, 5].map((colIdx) =>
    SOLAR_SQUARE_MATRIX.reduce((acc, row) => acc + row[colIdx], 0)
  );

  // Compute row sums
  const rowSums = SOLAR_SQUARE_MATRIX.map((row) =>
    row.reduce((acc, val) => acc + val, 0)
  );

  // Audio start/stop
  const playTone = (freq: number) => {
    stopTone();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingAudio(true);
      setCurrentToneFreq(freq);
    } catch (e) {
      console.warn("Audio Context init failed:", e);
    }
  };

  const stopTone = () => {
    if (oscRef.current && gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.1);
        setTimeout(() => {
          try {
            oscRef.current?.stop();
            audioCtxRef.current?.close();
          } catch {}
          audioCtxRef.current = null;
          oscRef.current = null;
          gainRef.current = null;
        }, 120);
      } catch {}
    }
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  // Handle Live Tester Calculation
  useEffect(() => {
    if (!testerInput.trim()) {
      setTesterResult(null);
      return;
    }
    const iso = calculateWordIsopsephy(testerInput.trim());
    const val = iso.value;

    let rel = "";
    if (val === 666) rel = "🌟 ΑΠΟΛΥΤΟΣ ΣΥΝΤΟΝΙΣΜΟΣ: Ισούται με το Σύνολο του Ηλιακού Τετραγώνου (666)!";
    else if (val === 111) rel = "☀️ ΜΑΓΙΚΗ ΣΤΑΘΕΡΑ: Ισούται με τη σταθερά σειράς/στήλης (111 = ρια´)!";
    else if (val === 216) rel = "🎲 ΨΥΧΟΓΟΝΙΚΟΣ ΚΥΒΟΣ: Ισούται με το 6³ = 216!";
    else if (val === 1331) rel = "🏛️ ΚΥΒΟΣ ΑΠΟΛΛΩΝΟΣ: Ισούται με το 11³ = 1331!";
    else if (val === 37) rel = "💎 ΣΥΜΠΛΗΡΩΜΑΤΙΚΟ: Ισούται με τη σταθερά αντικριστών ζευγών (37)!";
    else if (val === 74) rel = "⭕ ΚΕΝΤΡΙΚΟΣ ΠΥΡΗΝΑΣ 2×2: Ισούται με 2 × 37 = 74!";
    else if (val % 111 === 0) rel = `⚡ Πολλαπλάσιο του 111: ${val / 111} × 111`;
    else if (val % 37 === 0) rel = `⚡ Πολλαπλάσιο του 37: ${val / 37} × 37`;
    else if (val % 6 === 0) rel = `⚡ Πολλαπλάσιο του 6: ${val / 6} × 6`;
    else rel = `Πυθμένας (Ρίζα): ${getPythmen(val)} | Ελληνικό ψηφίο: ${numberToGreekNumeral(val)}`;

    setTesterResult({
      text: testerInput.trim(),
      val,
      relation: rel,
    });
  }, [testerInput]);

  const isCellHighlighted = (r: number, c: number): boolean => {
    if (highlightMode === "all") return true;
    if (highlightMode === "row" && selectedRow === r) return true;
    if (highlightMode === "col" && selectedCol === c) return true;
    if (highlightMode === "diag1" && r === c) return true;
    if (highlightMode === "diag2" && r + c === 5) return true;
    if (highlightMode === "all_diags" && (r === c || r + c === 5)) return true;

    // Concentric rings
    if (highlightMode === "outer_ring") {
      return r === 0 || r === 5 || c === 0 || c === 5;
    }
    if (highlightMode === "middle_ring") {
      return (r === 1 || r === 4 || c === 1 || c === 4) && !(r === 0 || r === 5 || c === 0 || c === 5);
    }
    if (highlightMode === "core_ring") {
      return (r === 2 || r === 3) && (c === 2 || c === 3);
    }
    if (highlightMode === "complementary_pairs") {
      if (!selectedCell) return false;
      const isSelected = selectedCell.r === r && selectedCell.c === c;
      const isOpposite = selectedCell.r + r === 5 && selectedCell.c + c === 5;
      return isSelected || isOpposite;
    }
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

  const customSum = customSelectedCells.reduce(
    (acc, cell) => acc + SOLAR_SQUARE_MATRIX[cell.r][cell.c],
    0
  );

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto pb-12">
      {/* Stone Tablet Outer Frame */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#24180d] via-[#160f08] to-[#0a0704] border-2 border-[#8c672b] p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_6px_rgba(255,220,120,0.2),inset_0_-4px_8px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Subtle Granular Ambient Background */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 pb-4 border-b border-[#47321c] relative z-10">
          {[
            { id: "square", label: "☀️ Μαγικό Τετράγωνο 6×6 (666)", icon: Sun },
            { id: "words", label: "📜 Ιεροί Λεξάριθμοι & Λέξεις", icon: BookOpen },
            { id: "psychogonic", label: "🎲 Ψυχογονικός Κύβος (6³ = 216)", icon: Box },
            { id: "apollo1331", label: "🏛️ Κύβος Απόλλωνος (11³ = 1331)", icon: Sparkles },
            { id: "awakening", label: "🌌 Γεωμετρία Αφύπνισης (144.000)", icon: Compass },
            { id: "enotheism", label: "⚡ Ενοθεϊστική Θεώρηση", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabSection(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  isActive
                    ? "bg-gradient-to-r from-[#c89b3c] via-[#e6c670] to-[#ffd700] text-[#120d07] border border-[#fff2a8] shadow-[#ffd700]/25 scale-[1.03]"
                    : "bg-[#140e08] hover:bg-[#24180d] text-[#c5b59e] border border-[#3b2917] hover:border-[#c89b3c]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#120d07]" : "text-[#ffd700]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 6x6 MAGIC SQUARE OF THE SUN IN STONE STYLE */}
        {/* ========================================================================= */}
        {activeTabSection === "square" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            {/* Top Banner Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#120c06]/80 p-4 rounded-2xl border border-[#422e17]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3518] via-[#2a1d0d] to-[#120c06] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_0_15px_rgba(200,155,60,0.3)] shrink-0">
                  <Sun className="w-7 h-7 text-[#ffd700] animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                      Λαξευμενος Ηλιακος Πινακας
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#1f150b] border border-[#52391b] text-[10px] font-mono text-[#ffd700]">
                      Τάξη n = 6 • 36 Κελιά
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                    Το Μαγικό Τετράγωνο του Ήλιου (Mensa Solis)
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Audio Synthesizer Toggle */}
                <button
                  type="button"
                  onClick={() => (isPlayingAudio ? stopTone() : playTone(111))}
                  className={`px-3 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                    isPlayingAudio
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black border border-yellow-200 animate-pulse ring-2 ring-amber-400/50"
                      : "bg-[#1e140b] hover:bg-[#2e1f11] text-[#e6c670] border border-[#52391b]"
                  }`}
                  title="Ακουστικός συντονισμός στις ιερές συχνότητες (111 Hz, 432 Hz, 666 Hz)"
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#ffd700]" />}
                  <span>{isPlayingAudio ? `Ήχος ${currentToneFreq}Hz` : "🔊 Ήχος 111Hz"}</span>
                </button>

                {onOpenAiModal && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAiModal(
                        "ΜΑΓΙΚΟ ΤΕΤΡΑΓΩΝΟ ΗΛΙΟΥ 666",
                        666,
                        ["ΗΛΙΟΣ", "36 ΚΕΛΙΑ", "ΣΤΑΘΕΡΑ 111", "ΙΑΝΕΥΣ", "ΑΠΟΛΛΩΝ", "ΣΥΜΠΛΗΡΩΜΑΤΙΚΟ 37"]
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#3b2914] to-[#52391b] border border-[#ffd700] hover:brightness-110 text-[#ffd700] text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Ερμηνεία 666</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyMatrix}
                  className="px-3 py-2 rounded-xl bg-[#1a120b] hover:bg-[#2b1e12] border border-[#4a3319] text-xs font-serif text-[#d6c7b2] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Αντιγραφή Πίνακα"
                >
                  {copiedData ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Αντιγράφηκε!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>Αντιγραφή</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-[#0f0a06] border border-[#3b2917] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm font-serif text-[#ebd8c5] leading-relaxed">
                Περιέχει τους αριθμούς <strong>1 έως 36</strong>. Κάθε σειρά, στήλη και διαγώνιος ισούται με <strong>111 (ρια´)</strong>,
                και το σύνολο όλων των 36 αριθμών είναι <strong>6 × 111 = 666 (χξϛ´)</strong> (ο 36ος τρίγωνος αριθμός: $T_{36} = 666$).
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-[#ffd700] px-2 py-1 rounded bg-[#1e140b] border border-[#52391b]">
                  36 × 37 / 2 = 666
                </span>
              </div>
            </div>

            {/* 4 Stat Badges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#120d08] border border-[#422e17] shadow-inner flex flex-col justify-between">
                <span className="text-[11px] font-serif text-[#a69680]">Μαγική Σταθερά Γραμμής</span>
                <div className="text-2xl font-serif font-bold text-[#ffd700] mt-1">111</div>
                <span className="text-[10px] font-mono text-[#c89b3c]">6 Σειρές × 111 = 666</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#120d08] border border-[#422e17] shadow-inner flex flex-col justify-between">
                <span className="text-[11px] font-serif text-[#a69680]">Συνολικό Άθροισμα (Σ)</span>
                <div className="text-2xl font-serif font-bold text-[#ff8c42] mt-1">666</div>
                <span className="text-[10px] font-mono text-[#c89b3c]">Ο ΗΛΙΟΣ = 666</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#120d08] border border-[#422e17] shadow-inner flex flex-col justify-between">
                <span className="text-[11px] font-serif text-[#a69680]">Πλήθος Πέτρινων Κελλιών</span>
                <div className="text-2xl font-serif font-bold text-[#38bdf8] mt-1">36 (6×6)</div>
                <span className="text-[10px] font-serif text-[#8c7a68]">36 Δεκανοί του Ήλιου</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#120d08] border border-[#422e17] shadow-inner flex flex-col justify-between">
                <span className="text-[11px] font-serif text-[#a69680]">Συμπληρωματικό Ζεύγος</span>
                <div className="text-2xl font-serif font-bold text-[#ec4899] mt-1">37</div>
                <span className="text-[10px] font-serif text-[#8c7a68]">Κάθε αντικριστό = 37</span>
              </div>
            </div>

            {/* Quick Filter Bar (Prominently accessible right above the matrix) */}
            <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d1e10] pb-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#ffd700]" />
                  <span className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider">
                    Φίλτρα Φωτισμού & Επιλογής
                  </span>
                </div>
                <div className="flex items-center gap-1">
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                        displayMode === mode.id
                          ? "bg-[#c89b3c] text-[#120d07] font-bold shadow"
                          : "bg-[#1f150b] text-[#a69680] hover:text-[#ffd700] border border-[#362413]"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Buttons Grid */}
              <div className="flex flex-wrap gap-1.5 text-xs font-serif">
                <button
                  type="button"
                  onClick={() => {
                    setHighlightMode("all");
                    setSelectedRow(null);
                    setSelectedCol(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === "all"
                      ? "bg-[#382613] border-[#ffd700] text-[#ffd700] font-bold shadow"
                      : "bg-[#1a1209] border-[#362413] text-[#d6c7b2] hover:border-[#c89b3c]"
                  }`}
                >
                  🌟 Όλα τα Κελιά (36)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHighlightMode("all_diags");
                    setSelectedRow(null);
                    setSelectedCol(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === "all_diags"
                      ? "bg-[#382613] border-[#ffd700] text-[#ffd700] font-bold shadow"
                      : "bg-[#1a1209] border-[#362413] text-[#d6c7b2] hover:border-[#c89b3c]"
                  }`}
                >
                  ✖️ 2 Διαγώνιοι (111)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHighlightMode("outer_ring");
                    setSelectedRow(null);
                    setSelectedCol(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === "outer_ring"
                      ? "bg-[#382613] border-[#ffd700] text-[#ffd700] font-bold shadow"
                      : "bg-[#1a1209] border-[#362413] text-[#d6c7b2] hover:border-[#c89b3c]"
                  }`}
                >
                  ⭕ Εξωτερικό Δαχτυλίδι (20 κελιά, Σ=370)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHighlightMode("middle_ring");
                    setSelectedRow(null);
                    setSelectedCol(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === "middle_ring"
                      ? "bg-[#382613] border-[#ffd700] text-[#ffd700] font-bold shadow"
                      : "bg-[#1a1209] border-[#362413] text-[#d6c7b2] hover:border-[#c89b3c]"
                  }`}
                >
                  🔲 Ενδιάμεσο 4×4 (16 κελιά, Σ=296)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHighlightMode("core_ring");
                    setSelectedRow(null);
                    setSelectedCol(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === "core_ring"
                      ? "bg-[#382613] border-[#ffd700] text-[#ffd700] font-bold shadow"
                      : "bg-[#1a1209] border-[#362413] text-[#d6c7b2] hover:border-[#c89b3c]"
                  }`}
                >
                  🎯 Κεντρικός Πυρήνας 2×2 (4 κελιά, Σ=74)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHighlightMode("complementary_pairs");
                    setSelectedRow(null);
                    setSelectedCol(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === "complementary_pairs"
                      ? "bg-[#382613] border-[#ffd700] text-[#ffd700] font-bold shadow"
                      : "bg-[#1a1209] border-[#362413] text-[#d6c7b2] hover:border-[#c89b3c]"
                  }`}
                >
                  🔄 Ζεύγη Διαμέτρου (Σ=37)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHighlightMode("custom");
                    setSelectedRow(null);
                    setSelectedCol(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === "custom"
                      ? "bg-[#382613] border-[#ffd700] text-[#ffd700] font-bold shadow"
                      : "bg-[#1a1209] border-[#362413] text-[#d6c7b2] hover:border-[#c89b3c]"
                  }`}
                >
                  👆 Ελεύθερη Επιλογή ({customSelectedCells.length} κελιά, Σ={customSum})
                </button>

                {customSelectedCells.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomSelectedCells([])}
                    className="px-2.5 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/50 text-red-200 text-xs font-serif transition-all cursor-pointer"
                  >
                    Καθαρισμός
                  </button>
                )}
              </div>
            </div>

            {/* MAIN INTERACTIVE STONE GRID TABLE */}
            <div className="p-2 xs:p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0e0a06] border-2 border-[#8c672b] shadow-[0_15px_40px_rgba(0,0,0,0.9),inset_0_1px_3px_rgba(255,215,0,0.2)] relative overflow-hidden">
              
              {/* Subtle background engraving lines */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-4 pb-2.5 sm:pb-3.5 border-b border-[#3b2917] relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#24170c] border border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-sm shrink-0">
                    <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-serif font-bold text-[#f5ecd8] leading-tight">
                      Πέτρινο Ηλιακό Πλέγμα 6 × 6 (36 Κελιά)
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-serif text-[#a69680]">
                      6 Σειρές (111) • 6 Στήλες (111) • 2 Διαγώνιοι (111) • Σύνολο = 666
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
                  {/* Zoom Controls Pill */}
                  <div className="flex items-center gap-1 bg-[#1a1209] p-1 rounded-xl border border-[#4a3419]">
                    <button
                      type="button"
                      onClick={() => handleZoomChange(-0.15)}
                      className="p-1 sm:p-1.5 rounded-lg bg-[#261a0d] hover:bg-[#382613] text-[#d6c7b2] hover:text-[#ffd700] transition-all cursor-pointer"
                      title="Σμίκρυνση (Zoom Out)"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#ffd700] px-1 min-w-[38px] text-center font-bold">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => handleZoomChange(0.15)}
                      className="p-1 sm:p-1.5 rounded-lg bg-[#261a0d] hover:bg-[#382613] text-[#d6c7b2] hover:text-[#ffd700] transition-all cursor-pointer"
                      title="Μεγέθυνση (Zoom In)"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {zoomScale !== 1 && (
                      <button
                        type="button"
                        onClick={handleResetZoom}
                        className="px-1.5 py-0.5 sm:py-1 rounded-lg bg-[#382613] text-[9px] sm:text-[10px] font-serif text-[#e6c670] hover:text-white transition-all ml-0.5 cursor-pointer"
                        title="Επαναφορά (100% Fit)"
                      >
                        Fit
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#3d2a13] to-[#52391b] border-2 border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.25)]">
                    <span className="text-[10px] sm:text-xs font-serif uppercase tracking-wider sm:tracking-widest text-[#fff2a8] font-bold">
                      ΣΥΝΟΛΟ:
                    </span>
                    <span className="text-sm sm:text-lg font-mono font-black text-[#ffd700]">
                      666
                    </span>
                    <span className="text-[10px] sm:text-xs font-serif text-[#fff2a8]">
                      (χξϛ´)
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Auto-Fit Hint */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#a69680] font-serif mb-2 px-1">
                <span className="flex items-center gap-1 text-[#c5b59e]">
                  <Smartphone className="w-3 h-3 text-[#ffd700] shrink-0" />
                  <span>Πλήρως προσαρμοσμένο • Χρησιμοποιήστε +/- ή Pinch για Zoom</span>
                </span>
                {zoomScale > 1 && (
                  <span className="text-[#ffd700] font-mono text-[10px]">
                    Zoom: {Math.round(zoomScale * 100)}% (Σύρετε για πλοήγηση)
                  </span>
                )}
              </div>

              {/* Responsive Matrix Grid Container */}
              <div
                ref={gridContainerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="overflow-x-auto overflow-y-hidden pb-1 relative z-10 scroll-smooth touch-pan-x touch-pan-y"
              >
                <div
                  className="w-full transition-transform duration-150 origin-top-left sm:origin-top"
                  style={{
                    transform: `scale(${zoomScale})`,
                    transformOrigin: zoomScale > 1 ? "top left" : "top center",
                    minWidth: zoomScale > 1 ? `${Math.round(100 * zoomScale)}%` : "100%",
                  }}
                >
                  
                  {/* Column Headers */}
                  <div className="grid grid-cols-8 gap-0.5 xs:gap-1 sm:gap-2 mb-1 sm:mb-2 text-center items-center">
                    <div className="text-[8px] xs:text-[9px] sm:text-[11px] font-serif text-[#a69680] flex items-center justify-center font-bold tracking-tight uppercase">
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
                        className={`py-1 xs:py-1.5 sm:py-2 px-0.5 rounded-md xs:rounded-lg sm:rounded-xl text-[9px] xs:text-[10px] sm:text-xs font-serif transition-all cursor-pointer shadow-sm ${
                          highlightMode === "col" && selectedCol === colIdx
                            ? "bg-gradient-to-r from-[#c89b3c] to-[#ffd700] text-[#120d07] font-bold shadow-md shadow-[#ffd700]/30 ring-1 sm:ring-2 ring-amber-300 scale-[1.02]"
                            : "bg-[#1b120a] text-[#c5b59e] hover:text-[#ffd700] border border-[#3b2713] hover:border-[#ffd700]"
                        }`}
                        title={`Φωτισμός Στήλης ${colIdx + 1}`}
                      >
                        <span className="hidden sm:inline">Στήλη </span>
                        <span>Στ.{colIdx + 1}</span>
                      </button>
                    ))}
                    <div className="text-[8px] xs:text-[9px] sm:text-[11px] font-serif font-bold text-[#ffd700] flex items-center justify-center tracking-tight uppercase">
                      Σ Γρ.
                    </div>
                  </div>

                  {/* 6 Stone Rows */}
                  <div className="space-y-0.5 xs:space-y-1 sm:space-y-2.5">
                    {SOLAR_SQUARE_MATRIX.map((row, rIdx) => {
                      const isRowActive = highlightMode === "row" && selectedRow === rIdx;
                      return (
                        <div key={`row-${rIdx}`} className="grid grid-cols-8 gap-0.5 xs:gap-1 sm:gap-2 items-center">
                          {/* Row Selector Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setHighlightMode("row");
                              setSelectedRow(rIdx);
                              setSelectedCol(null);
                            }}
                            className={`py-1.5 xs:py-2 sm:py-3.5 px-0.5 rounded-md xs:rounded-lg sm:rounded-xl text-[9px] xs:text-[10px] sm:text-xs font-serif transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                              isRowActive
                                ? "bg-gradient-to-r from-[#c89b3c] to-[#ffd700] text-[#120d07] font-bold shadow-md shadow-[#ffd700]/30 ring-1 sm:ring-2 ring-amber-300 scale-[1.02]"
                                : "bg-[#1b120a] text-[#c5b59e] hover:text-[#ffd700] border border-[#3b2713] hover:border-[#ffd700]"
                            }`}
                            title={`Φωτισμός Σειράς ${rIdx + 1}`}
                          >
                            <span className="hidden sm:inline">Σειρά </span>
                            <span>Σρ.{rIdx + 1}</span>
                          </button>

                          {/* 6 Stone Cells */}
                          {row.map((val, cIdx) => {
                            const isHighlighted = isCellHighlighted(rIdx, cIdx);
                            const isSelected =
                              selectedCell?.r === rIdx && selectedCell?.c === cIdx;
                            const isDiag1 = rIdx === cIdx;
                            const isDiag2 = rIdx + cIdx === 5;

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
                                key={`stone-cell-${rIdx}-${cIdx}`}
                                type="button"
                                onClick={() => handleCellClick(rIdx, cIdx, val)}
                                className={`relative py-1 xs:py-1.5 sm:py-4 px-0.5 rounded-md xs:rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),inset_0_-2px_4px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.5)] ${
                                  isSelected
                                    ? "ring-1 sm:ring-2 ring-[#ffd700] ring-offset-1 sm:ring-offset-2 ring-offset-[#0e0a06] z-20 scale-105"
                                    : ""
                                } ${
                                  isHighlighted
                                    ? "bg-gradient-to-br from-[#5c401d] via-[#6e4e24] to-[#3a270f] border-2 border-[#ffd700] text-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.45)] scale-105 z-10"
                                    : "bg-gradient-to-br from-[#24180d] via-[#1a1109] to-[#0f0a05] border-[#4a3419] hover:border-[#ffd700] text-[#f5ecd8] hover:bg-[#2e1f11]"
                                }`}
                              >
                                {/* Diagonal Corner Accent Dots */}
                                {(isDiag1 || isDiag2) && (
                                  <span
                                    className="absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_4px_#ffd700]"
                                    title="Κελί Διαγωνίου (111)"
                                  />
                                )}

                                {/* Engraved Carved Stone Number */}
                                <span
                                  className={`font-serif font-black tracking-normal sm:tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] ${
                                    displayMode === "greek"
                                      ? "text-[10px] xs:text-xs sm:text-base"
                                      : "text-[11px] xs:text-xs sm:text-xl"
                                  } ${isHighlighted ? "text-[#ffd700]" : "text-[#f0d492]"}`}
                                >
                                  {cellContent}
                                </span>

                                {subContent && (
                                  <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-mono text-[#a69680] mt-0.2 sm:mt-0.5 drop-shadow truncate max-w-full px-0.5">
                                    {subContent}
                                  </span>
                                )}
                              </button>
                            );
                          })}

                          {/* Row Sum Badge */}
                          <div className="py-1.5 xs:py-2 sm:py-3.5 rounded-md xs:rounded-xl sm:rounded-2xl bg-[#1c130b] border border-[#52391b] sm:border-2 text-center flex flex-col items-center justify-center shadow-md">
                            <span className="text-[10px] xs:text-[11px] sm:text-sm font-mono font-black text-[#ffd700]">
                              111
                            </span>
                            <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-serif text-[#a69680]">
                              (ρια´)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Column Sums Footer */}
                  <div className="grid grid-cols-8 gap-0.5 xs:gap-1 sm:gap-2 mt-1.5 sm:mt-3.5 pt-1.5 sm:pt-3.5 border-t border-[#3b2917] items-center">
                    <div className="text-[8px] xs:text-[9px] sm:text-[11px] font-serif font-bold text-[#ffd700] flex items-center justify-center uppercase tracking-tight">
                      Σ Στήλης:
                    </div>

                    {colSums.map((sum, cIdx) => (
                      <div
                        key={`col-sum-${cIdx}`}
                        className="py-1 xs:py-1.5 sm:py-3 rounded-md xs:rounded-xl sm:rounded-2xl bg-[#1c130b] border border-[#52391b] sm:border-2 text-center flex flex-col items-center justify-center shadow-md"
                      >
                        <span className="text-[10px] xs:text-[11px] sm:text-sm font-mono font-black text-[#ffd700]">
                          {sum}
                        </span>
                        <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-serif text-[#a69680]">
                          (ρια´)
                        </span>
                      </div>
                    ))}

                    {/* Master Total 666 Seal Badge */}
                    <div className="py-1 xs:py-1.5 sm:py-3 rounded-md xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#634623] via-[#7d582c] to-[#422e17] border border-[#ffd700] sm:border-2 text-center flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.5)] ring-1 sm:ring-2 ring-[#ffd700]/50 animate-pulse">
                      <span className="text-[10px] xs:text-xs sm:text-base font-mono font-black text-[#ffd700]">
                        666
                      </span>
                      <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-serif text-[#fff2a8] font-bold">
                        (Ο ΗΛΙΟΣ)
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Diagonal Sum Verification Banner */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#080503] border border-[#3b2917] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                  <span className="text-[#ebd8c5]">
                    <strong>Κύριες Διαγώνιοι:</strong> 6 + 11 + 16 + 21 + 26 + 31 = <strong className="text-[#ffd700]">111</strong> | 1 + 8 + 15 + 22 + 29 + 36 = <strong className="text-[#ffd700]">111</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#ffd700]">
                    6 × 111 = 666 (χξϛ´)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1c130b] border border-[#52391b] text-[10px] font-mono text-[#e6c670]">
                    Πυθμένας 111: 1+1+1 = 3 (Τριάς)
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Cell Detail Inspector & Live Word Tester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Selected Cell Inspector */}
              {selectedCell ? (
                <div className="p-4 rounded-2xl bg-[#140e08] border border-[#4a341a] space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-[#3b2917] pb-2">
                    <span className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Επιλεγμένο Πέτρινο Κελί [{selectedCell.r + 1}, {selectedCell.c + 1}]</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#ffd700]">
                      Αριθμός: {selectedCell.val}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-serif">
                    <div className="p-2.5 rounded-xl bg-[#0e0a06] border border-[#2e1f10] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Ελληνικό Ψηφίο:</span>
                      <div className="text-base font-bold text-[#ffd700]">
                        {getAncientGreekNumeral(selectedCell.val)}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0e0a06] border border-[#2e1f10] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Πυθμένας (Ρίζα):</span>
                      <div className="text-base font-bold text-[#38bdf8]">
                        {getPythmen(selectedCell.val)}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0e0a06] border border-[#2e1f10] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Συμπληρωματικό (37):</span>
                      <div className="text-base font-bold text-[#ec4899]">
                        {37 - selectedCell.val} (Σ = 37)
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0e0a06] border border-[#2e1f10] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Διαμετρική Θέση:</span>
                      <div className="text-base font-mono font-bold text-[#f5ecd8]">
                        [{6 - selectedCell.r}, {6 - selectedCell.c}]
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenAiModal?.(
                          `ΚΕΛΙ ${selectedCell.val} (${getAncientGreekNumeral(selectedCell.val)})`,
                          selectedCell.val,
                          ["ΗΛΙΑΚΟ ΤΕΤΡΑΓΩΝΟ", "ΣΥΜΠΛΗΡΩΜΑΤΙΚΟ 37", "ΠΥΘΜΕΝΑΣ", String(selectedCell.val)]
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#2a1d10] hover:bg-[#3d2a17] border border-[#c89b3c]/50 text-[#e6c670] text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ερμηνεία Κελιού {selectedCell.val}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] flex items-center justify-center text-xs font-serif text-[#8c7a68]">
                  Κάντε κλικ σε οποιοδήποτε κελί του πίνακα για να δείτε την ανάλυσή του.
                </div>
              )}

              {/* Custom Live Word Tester */}
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#4a341a] space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-[#3b2917] pb-2">
                  <span className="text-xs font-serif font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Ζωντανός Έλεγχος Λέξης με το Ηλιακό Τετράγωνο</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={testerInput}
                    onChange={(e) => setTesterInput(e.target.value)}
                    placeholder="Π.χ. Ο ΗΛΙΟΣ, ΙΑΝΕΥΣ, ΑΠΟΛΛΩΝΟΣ..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0a06] border border-[#3b2917] focus:border-[#ffd700] text-[#f5ecd8] text-xs font-serif outline-none"
                  />

                  {testerResult && (
                    <div
                      key={`solar-tester-${testerResult.val}-${testerResult.text}`}
                      className="p-2.5 rounded-xl bg-[#0a0704] border border-[#ffd700]/50 space-y-1 animate-lexarithm-result animate-card-shimmer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-[#ffd700]">
                          {testerResult.text}
                        </span>
                        <span
                          key={`tester-num-${testerResult.val}`}
                          className="text-xs font-mono font-black text-[#ffd700] animate-number-glow"
                        >
                          Αξία: {testerResult.val}
                        </span>
                      </div>
                      <p className="text-[11px] font-serif text-[#a69680] leading-snug">
                        {testerResult.relation}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        {onSaveItem && (
                          <button
                            type="button"
                            onClick={() =>
                              onSaveItem({
                                text: testerResult.text,
                                normalized: normalizePolytonicGreek(testerResult.text),
                                value: testerResult.val,
                                root: getPythmen(testerResult.val),
                                greekNumeral: numberToGreekNumeral(testerResult.val),
                                isPhrase: testerResult.text.includes(" "),
                                wordCount: testerResult.text.trim().split(/\s+/).length,
                                category: "Ηλιακό Τετράγωνο",
                                notes: testerResult.relation,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#24170c] hover:bg-[#382313] border border-[#c89b3c]/40 text-[#ffd700] text-[10px] font-serif flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <BookmarkPlus className="w-3 h-3" />
                            <span>Αποθήκευση στο Θησαυρό</span>
                          </button>
                        )}
                        {onOpenAiModal && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenAiModal(
                                testerResult.text,
                                testerResult.val,
                                ["ΗΛΙΑΚΟ ΤΕΤΡΑΓΩΝΟ", "666", "111", testerResult.text]
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#24170c] hover:bg-[#382313] border border-[#c89b3c]/40 text-[#ffd700] text-[10px] font-serif flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>AI Ερμηνεία</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SACRED ISOPSEPHIC WORDS & SOLAR HARMONICS */}
        {/* ========================================================================= */}
        {activeTabSection === "words" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="flex items-center gap-3.5 border-b border-[#3b2917] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3518] to-[#120c06] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-lg shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                  Λεξαριθμικες Αντιστοιχιες
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                  Ιεροί Λεξάριθμοι & Ονόματα του Ηλιακού Τετραγώνου
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SOLAR_SACRED_WORDS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] hover:border-[#ffd700]/60 transition-all flex flex-col justify-between space-y-3 shadow"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-serif uppercase tracking-wider px-2 py-0.5 rounded bg-[#1f150b] border border-[#52391b] text-[#ffd700]">
                        {item.category}
                      </span>
                      <span className="text-sm font-mono font-black text-[#ffd700]">
                        {item.value}
                      </span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-[#f5ecd8] pt-1">
                      {item.text}
                    </h4>
                    <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#26190e]">
                    {onSaveItem && (
                      <button
                        type="button"
                        onClick={() =>
                          onSaveItem({
                            text: item.text,
                            normalized: normalizePolytonicGreek(item.text),
                            value: item.value,
                            root: getPythmen(item.value),
                            greekNumeral: numberToGreekNumeral(item.value),
                            isPhrase: item.text.includes(" "),
                            wordCount: item.text.trim().split(/\s+/).length,
                            category: "Ηλιακοί Λεξάριθμοι",
                            notes: item.meaning,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#1f150b] hover:bg-[#302111] border border-[#422e17] text-[#ffd700] text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
                        title="Αποθήκευση στο Θησαυρό"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Αποθήκευση</span>
                      </button>
                    )}

                    {onOpenAiModal && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenAiModal(item.text, item.value, [item.text, String(item.value), item.category])
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#1f150b] hover:bg-[#302111] border border-[#422e17] text-[#e6c670] text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
                        title="AI Ερμηνεία"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Oracle</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PSYCHOGONIC CUBE (6x6x6 = 216) */}
        {/* ========================================================================= */}
        {activeTabSection === "psychogonic" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="flex items-center gap-3.5 border-b border-[#3b2917] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3518] to-[#120c06] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-lg shrink-0">
                <Box className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                  Πυθαγορεια & Πλατωνικη Ψυχογονια
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                  Ο Ψυχογονικός Κύβος (6 × 6 × 6 = 216)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-2">
                <h4 className="text-sm font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>🎲</span> 1. Ο Κύβος της Ψυχής (6³)
                </h4>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Στην αρχαία πυθαγόρεια παράδοση, ο αριθμός <strong>216 = 6 × 6 × 6</strong> είναι ο «Ψυχογονικός Κύβος» — ο κύβος του πρώτου τέλειου αριθμού 6 (1 + 2 + 3 = 6 και 1 × 2 × 3 = 6).
                  Αντιπροσωπεύει τη συγκρότηση της ψυχής και τις περιόδους μετενσάρκωσης (Πλάτων, <em>Πολιτεία</em> 546c).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-2">
                <h4 className="text-sm font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>⚡</span> 2. Η Γέφυρα: 144.000 / 666 = 216,216...
                </h4>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Η διαίρεση του ιερού αριθμού των <strong>144.000</strong> διά του ηλιακού αθροίσματος <strong>666</strong> παράγει το αέναο περιοδικό δεκαδικό:
                </p>
                <div className="p-2.5 rounded-xl bg-[#0c0804] border border-[#ffd700]/50 text-center font-mono font-bold text-[#ffd700] text-sm">
                  144.000 : 666 = 216,216216...
                </div>
                <p className="text-[11px] font-serif text-[#a69680]">
                  Μια αδιάψευστη μαθηματική γέφυρα ανάμεσα στον Ήλιο (666) και τον Ψυχογονικό Κύβο (216).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-2">
                <h4 className="text-sm font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>🏛️</span> 3. Αντιστροφή: 216 ➔ 612 = ΖΕΥΣ
                </h4>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Αντιστρέφοντας τα ψηφία του Ψυχογονικού Κύβου <strong>216</strong> προκύπτει το <strong>612</strong>, που αποτελεί τον ακριβή λεξάριθμο του Ύπατου Θεού:
                </p>
                <div className="p-2.5 rounded-xl bg-[#0c0804] border border-[#ffd700]/50 text-center font-mono font-bold text-[#ffd700] text-sm">
                  ΖΕΥΣ = 7 + 5 + 400 + 200 = 612
                </div>
                <div className="text-[11px] font-mono text-[#38bdf8] text-center">
                  216 - 1 = 216 - Α = 215 = ΔΙΑΣ (4+10+1+200)
                </div>
              </div>
            </div>

            {/* Interactive 3D Isometric Psychogonic Cube Visualization */}
            <PsychogonicCubeIsometric />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: APOLLO CUBE (11x11x11 = 1331) */}
        {/* ========================================================================= */}
        {activeTabSection === "apollo1331" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="flex items-center gap-3.5 border-b border-[#3b2917] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3518] to-[#120c06] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-lg shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                  Ο Κυβος του Φωτος (11³)
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                  Ο Κύβος του ΑΠΟΛΛΩΝΟΣ = 1.331 & Το Νέο Έμβρυο
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3">
                <h4 className="text-sm font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>👶</span> Το ΝΕΟ ΕΜΒΡΥΟ (Νοέμβριος) & Ώρα 13:30 / 13:31
                </h4>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Το <strong>ΝΕΟ ΕΜΒΡΥΟ (Νοέμβριος)</strong> γεννήθηκε <strong>13:30</strong> καθώς το <strong>1</strong> από το <strong>1331</strong>...
                  Το <strong>13:31</strong> είναι το κεντρικό κυβικό voxel, το <strong>666ο</strong> στη διασταύρωση <strong>6η σειρά, 6η στήλη, 6ο βάθος</strong> του κύβου $11 \times 11 \times 11 = 1331$!
                </p>
                <div className="p-3 rounded-xl bg-[#0c0804] border border-[#ffd700]/50 space-y-1 text-center">
                  <div className="font-mono text-sm font-bold text-[#ffd700]">
                    ΑΠΟΛΛΩΝΟΣ = 1 + 80 + 70 + 30 + 30 + 800 + 50 + 70 + 200 = 1.331
                  </div>
                  <div className="font-mono text-xs text-[#38bdf8]">
                    11 × 11 × 11 = 1.331 | Κέντρο (6, 6, 6) = 666
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3">
                <h4 className="text-sm font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>📐</span> Η Συμμετρία 1(33)1 & Οι 33 Βαθμοί
                </h4>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Ο αριθμός 1331 περικλείει στα άκρα του το <strong>1...1 ➔ 11 = ΙΑ</strong>, ενώ στο κέντρο δεσπόζει το <strong>33</strong>:
                  τα 33 έτη του Μεγάλου Αλεξάνδρου και του Ιησού Χριστού, οι 33 σπόνδυλοι της σπονδυλικής στήλης του ανθρώπου.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
                  <div className="p-2 rounded-xl bg-[#0c0804] border border-[#3b2917] text-[#ffd700]">
                    1 + 3 + 3 + 1 = 8 (Ογδοάς)
                  </div>
                  <div className="p-2 rounded-xl bg-[#0c0804] border border-[#3b2917] text-[#38bdf8]">
                    11² = 121 | 11³ = 1331
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SACRED GEOMETRY OF AWAKENING (144.000) */}
        {/* ========================================================================= */}
        {activeTabSection === "awakening" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="flex items-center gap-3.5 border-b border-[#3b2917] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3518] to-[#120c06] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-lg shrink-0">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                  Κοσμολογικες Αναλογιες & Παρθενωνας
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                  Η Γεωμετρία της Αφύπνισης & Το Αέτωμα του Παρθενώνα
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3">
                <h4 className="text-sm font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>🏛️</span> Το Αέτωμα του Παρθενώνα (144° & 18° + 18° = 36)
                </h4>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Στην κορυφή του τριγώνου του αετώματος του Παρθενώνα σχηματίζεται γωνία <strong>144 μοιρών</strong>.
                  Το 144 αναλύεται στο άθροισμα <strong>72 + 72</strong> (Ο.Β. = 72 = Ουρανία Βασίλειος).
                  Και <strong>Ο.Β. (72) × Ι (10) = 720 = ΝΟΥΣ</strong>! Ταυτόχρονα, το 6 παραγοντικό είναι <strong>6! = 1×2×3×4×5×6 = 720 = ΝΟΥΣ</strong>!
                  Στις δύο βάσεις απομένουν γωνίες <strong>18 μοιρών</strong> δεξιά και αριστερά.
                  Το <strong>18</strong> αντιστοιχεί στα ιερά γράμματα <strong>ΙΗ</strong> (Ήλιος / Απόλλων / ΙΗΣΟΥΣ), ενώ το άθροισμά τους μας δίνει ξανά το <strong>36</strong> ($18+18=36$).
                </p>
                <div className="p-2.5 rounded-xl bg-[#0c0804] border border-[#ffd700]/50 text-center font-mono text-xs font-bold text-[#ffd700]">
                  144 / 2 = 72 (Ο.Β.) ➔ Ο.Β. × Ι (10) = 720 = ΝΟΥΣ = 6! (6×5×4×3×2×1)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3">
                <h4 className="text-sm font-serif font-bold text-[#ffd700] flex items-center gap-2">
                  <span>🌌</span> Το Μεγάλο Πλατωνικό Έτος (25.920 Έτη) & 144.000
                </h4>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Κάθε μικρός κοσμικός κύκλος (Ενιαυτός) διαρκεί <strong>2.160 χρόνια</strong> — δηλαδή ακριβώς <strong>10 φορές τον ψυχογονικό κύβο του 216</strong> ($216 \times 10 = (6\times 6\times 6) \times 10$), κατά τον οποίο αναδύονται ομάδες 12.000 αφυπνισμένων πνευμάτων ($12 \times 12.000 = 144.000$).
                </p>
                <div className="p-2.5 rounded-xl bg-[#0c0804] border border-[#ffd700]/50 text-center font-mono text-xs font-bold text-[#ffd700]">
                  12 Ζώδια × 2.160 Έτη = 25.920 Έτη (Μεγάλος Ενιαυτός)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ORPHIC ENOTHEISM */}
        {/* ========================================================================= */}
        {activeTabSection === "enotheism" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="flex items-center gap-3.5 border-b border-[#3b2917] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3518] to-[#120c06] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-lg shrink-0">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                  Ορφικη Θεολογια & Μυστικισμος
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                  Ενοθεϊστική Θεώρηση: «Εἷς Θεὸς ἐν πάντεσσι»
                </h2>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3">
              <div className="p-4 rounded-xl bg-[#0c0804] border border-[#ffd700]/60 text-center">
                <p className="font-serif italic text-base sm:text-lg text-[#ffd700] leading-relaxed">
                  «Εἷς Ζεύς, εἷς Ἀΐδης, εἷς Ἥλιος, εἷς Διόνυσος, εἷς θεὸς ἐν πάντεσσι.»
                </p>
                <span className="text-[11px] font-serif text-[#a69680] mt-1 block">
                  — Ορφικό Απόσπασμα (Kern, Fr. 239)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs font-serif">
                <div className="p-3 rounded-xl bg-[#0e0a06] border border-[#2d1e10] space-y-1">
                  <h5 className="font-bold text-[#ffd700]">1. Ζευς / Δίας</h5>
                  <p className="text-[#ebd8c5]">Η συνεκτική ουσία, ο δημιουργός νους και το πνεύμα που διαποτίζει τα πάντα.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0e0a06] border border-[#2d1e10] space-y-1">
                  <h5 className="font-bold text-[#ffd700]">2. Άδης</h5>
                  <p className="text-[#ebd8c5]">Η αόρατη ρίζα, το άδηλο πυρ και η σπερματική δύναμη των όντων.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0e0a06] border border-[#2d1e10] space-y-1">
                  <h5 className="font-bold text-[#ffd700]">3. Ήλιος / Απόλλων</h5>
                  <p className="text-[#ebd8c5]">Το ορατό φως, η αρμονία των σφαιρών και η γεωμετρική τάξη (666 & 1331).</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0e0a06] border border-[#2d1e10] space-y-1">
                  <h5 className="font-bold text-[#ffd700]">4. Διόνυσος</h5>
                  <p className="text-[#ebd8c5]">Η ζωική ροή, ο ιερός ενθουσιασμός και η αναγέννηση της ψυχής.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0e0a06] border border-[#2d1e10] space-y-1 sm:col-span-2 md:col-span-2">
                  <h5 className="font-bold text-[#ffd700]">5. Ηρακλής / Ενσάρκωση</h5>
                  <p className="text-[#ebd8c5]">Η πνευματική κάθαρση, οι 12 άθλοι (12 ζώδια) και η τελική θέωση του ανθρώπου.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
