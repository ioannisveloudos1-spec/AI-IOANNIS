import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  analyzePythagoreanFrequencies,
  pythagoreanSynth,
  SynthTimbre,
  SOLFEGGIO_MAP,
} from "../utils/pythagoreanAudio";
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Music,
  Sparkles,
  Radio,
  Sliders,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
} from "lucide-react";

interface PythagoreanMonochordAudioProps {
  totalValue: number;
  wordBreakdowns: {
    rawWord: string;
    value: number;
    letters: { char: string; originalChar?: string; value: number }[];
  }[];
  isEnglishSystem?: boolean;
}

export const PythagoreanMonochordAudio: React.FC<PythagoreanMonochordAudioProps> = ({
  totalValue,
  wordBreakdowns,
  isEnglishSystem = false,
}) => {
  const [a4Base, setA4Base] = useState<number>(432);
  const [timbre, setTimbre] = useState<SynthTimbre>("GOLDEN_BOWL");
  const [volume, setVolume] = useState<number>(0.65);
  const [tempoSpeed, setTempoSpeed] = useState<number>(320); // ms per note
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePlaybackType, setActivePlaybackType] = useState<string | null>(null);
  const [activeLetterStep, setActiveLetterStep] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  // Animation frame for vibrating string
  const [vibrationPhase, setVibrationPhase] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  // Analyze frequencies
  const analysis = useMemo(() => {
    return analyzePythagoreanFrequencies(totalValue, wordBreakdowns, a4Base);
  }, [totalValue, wordBreakdowns, a4Base]);

  // Clean up audio when unmounting
  useEffect(() => {
    return () => {
      pythagoreanSynth.stopAll();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Stop audio on value change
  useEffect(() => {
    pythagoreanSynth.stopAll();
    setIsPlaying(false);
    setActivePlaybackType(null);
    setActiveLetterStep(-1);
  }, [totalValue]);

  // String Vibration Animation Loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setVibrationPhase((prev) => (prev + 0.25) % (Math.PI * 2));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setVibrationPhase(0);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const handleStop = () => {
    pythagoreanSynth.stopAll();
    setIsPlaying(false);
    setActivePlaybackType(null);
    setActiveLetterStep(-1);
  };

  const handlePlayFundamental = () => {
    handleStop();
    setIsPlaying(true);
    setActivePlaybackType("FUNDAMENTAL");
    pythagoreanSynth.playTone(analysis.fundamentalHz, 3.2, timbre, volume);
    setTimeout(() => {
      setIsPlaying(false);
      setActivePlaybackType(null);
    }, 3200);
  };

  const handlePlayChord = () => {
    handleStop();
    setIsPlaying(true);
    setActivePlaybackType("CHORD");
    pythagoreanSynth.playPythagoreanChord(analysis.fundamentalHz, 4.0, timbre, volume);
    setTimeout(() => {
      setIsPlaying(false);
      setActivePlaybackType(null);
    }, 4000);
  };

  const handlePlaySolfeggio = () => {
    handleStop();
    setIsPlaying(true);
    setActivePlaybackType("SOLFEGGIO");
    pythagoreanSynth.playTone(analysis.solfeggioHz, 3.5, "CELESTIAL_PAD", volume);
    setTimeout(() => {
      setIsPlaying(false);
      setActivePlaybackType(null);
    }, 3500);
  };

  const handlePlayArpeggio = () => {
    if (!analysis.letterNotes.length) return;
    handleStop();
    setIsPlaying(true);
    setActivePlaybackType("ARPEGGIO");

    pythagoreanSynth.playLetterArpeggio(
      analysis.letterNotes,
      tempoSpeed,
      timbre === "CELESTIAL_PAD" ? "MONOCHORD_PLUCK" : timbre,
      volume,
      (step) => {
        setActiveLetterStep(step);
      },
      () => {
        setIsPlaying(false);
        setActivePlaybackType(null);
        setActiveLetterStep(-1);
      }
    );
  };

  const handlePlaySingleLetter = (freq: number, index: number) => {
    handleStop();
    setIsPlaying(true);
    setActivePlaybackType(`LETTER_${index}`);
    setActiveLetterStep(index);
    pythagoreanSynth.playTone(freq, 1.8, timbre, volume);
    setTimeout(() => {
      setIsPlaying(false);
      setActivePlaybackType(null);
      setActiveLetterStep(-1);
    }, 1800);
  };

  const handlePlayHarmonicTone = (freq: number, label: string) => {
    handleStop();
    setIsPlaying(true);
    setActivePlaybackType(`HARMONIC_${label}`);
    pythagoreanSynth.playTone(freq, 2.8, timbre, volume);
    setTimeout(() => {
      setIsPlaying(false);
      setActivePlaybackType(null);
    }, 2800);
  };

  if (totalValue <= 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1c140c] via-[#140e08] to-[#0d0905] border-2 border-[#c89b3c]/60 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3b2917] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2a1a0c] border border-[#c89b3c]/50 flex items-center justify-center text-[#ffd700] shadow-inner">
            <Radio className="w-5 h-5 text-[#ffd700] animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
              <span>Πυθαγόρειος Μονόχορδος & Συμβολική Ηχοποίηση</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#3d2710] text-[#ffd700] border border-[#784e1b]">
                A = {a4Base} Hz
              </span>
            </h3>
            <p className="text-xs font-serif text-[#a69680]">
              Ακουστική μεταστοιχείωση της ισοψηφίας σε συχνότητες, λόγους χορδής & πυθαγόρειες αρμονίες
            </p>
          </div>
        </div>

        {/* Toggle & Modal Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTheoryModal(!showTheoryModal)}
            className="px-2.5 py-1 rounded-lg bg-[#20150b] border border-[#4a341e] text-[#ffd700] hover:bg-[#302010] text-xs font-serif flex items-center gap-1 transition-colors cursor-pointer"
            title="Πυθαγόρεια Μουσική Θεωρία"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Θεωρία</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-[#20150b] border border-[#4a341e] text-[#a69680] hover:text-[#f5ecd8] transition-colors cursor-pointer"
            title={isExpanded ? "Σύμπτυξη" : "Ανάπτυξη"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Frequencies Key Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Fundamental Pitch */}
            <div className="p-3 rounded-xl bg-[#140e08] border border-[#3b2713] flex flex-col justify-between">
              <span className="text-[11px] font-serif text-[#a69680] block">Θεμελιώδης Συχνότητα (f₀)</span>
              <div className="text-lg font-mono font-bold text-[#ffd700] mt-1">
                {analysis.fundamentalHz.toFixed(2)} <span className="text-xs text-[#a69680]">Hz</span>
              </div>
              <div className="text-[11px] font-mono text-[#34d399] mt-0.5">
                {analysis.noteName}
              </div>
              <div className="text-[10px] font-serif text-[#8c7e6c] mt-1">
                {analysis.octaveDivisions !== 0
                  ? `Αναγωγή Οκτάβας: ${analysis.rawValue} → 2^(${analysis.octaveDivisions})`
                  : `Άμεση συχνότητα: ${analysis.rawValue} Hz`}
              </div>
            </div>

            {/* Monochord String Ratio */}
            <div className="p-3 rounded-xl bg-[#140e08] border border-[#3b2713] flex flex-col justify-between">
              <span className="text-[11px] font-serif text-[#a69680] block">Λόγος Μονόχορδου (L/L₀)</span>
              <div className="text-sm font-mono font-bold text-[#38bdf8] mt-1 break-words">
                {analysis.monochordStringFraction}
              </div>
              <div className="text-[11px] font-mono text-[#e6c670] mt-0.5">
                Θέση Γέφυρας: {analysis.monochordBridgePositionPercent}%
              </div>
              <div className="text-[10px] font-serif text-[#8c7e6c] mt-1">
                Λόγος f/A: {analysis.monochordRatioValue}
              </div>
            </div>

            {/* Pythmen / Solfeggio Root */}
            <div className="p-3 rounded-xl bg-[#140e08] border border-[#3b2713] flex flex-col justify-between">
              <span className="text-[11px] font-serif text-[#a69680] block">Συχνότητα Πυθμένα (Π={analysis.pythmen})</span>
              <div className="text-lg font-mono font-bold text-[#c084fc] mt-1">
                {analysis.solfeggioHz} <span className="text-xs text-[#a69680]">Hz</span>
              </div>
              <div className="text-[11px] font-mono text-[#f5ecd8] mt-0.5">
                {analysis.solfeggioName}
              </div>
              <div className="text-[10px] font-serif text-[#8c7e6c] mt-1">
                Ιερή Solfeggio αντιστοιχία
              </div>
            </div>

            {/* Golden Harmonic Φ */}
            <div className="p-3 rounded-xl bg-[#140e08] border border-[#3b2713] flex flex-col justify-between">
              <span className="text-[11px] font-serif text-[#a69680] block">Χρυσή Αρμονική (f₀ × Φ)</span>
              <div className="text-lg font-mono font-bold text-[#f43f5e] mt-1">
                {analysis.harmonics.golden.toFixed(2)} <span className="text-xs text-[#a69680]">Hz</span>
              </div>
              <div className="text-[11px] font-mono text-[#f5ecd8] mt-0.5">
                Φ = 1.618034
              </div>
              <div className="text-[10px] font-serif text-[#8c7e6c] mt-1">
                Υπερβατικό διάστημα Φ
              </div>
            </div>
          </div>

          {/* VISUAL PYTHAGOREAN MONOCHORD STRING (Interactive Graphic) */}
          <div className="p-4 rounded-xl bg-[#0e0a06] border border-[#3b2713] space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-serif text-[#a69680]">
              <span className="flex items-center gap-1.5 text-[#ffd700] font-bold">
                <Activity className="w-3.5 h-3.5" />
                Οπτικός Πυθαγόρειος Μονόχορδος (Χορδή & Κινητός Καβαλάρης):
              </span>
              <span className="font-mono text-[11px] text-[#34d399]">
                {isPlaying ? "⚡ Παλμική Ταλάντωση Ενεργή" : "Αναμονή Διέγερσης Χορδής"}
              </span>
            </div>

            {/* SVG Monochord Visualizer */}
            <div className="w-full h-24 relative bg-gradient-to-b from-[#140d07] to-[#0a0704] rounded-lg border border-[#2b1b0e] p-2 flex flex-col justify-between">
              {/* String & Wave */}
              <svg className="w-full h-12 overflow-visible" viewBox="0 0 1000 60" preserveAspectRatio="none">
                {/* Background string rail */}
                <line x1="20" y1="30" x2="980" y2="30" stroke="#3b2713" strokeWidth="6" strokeLinecap="round" />
                <line x1="20" y1="30" x2="980" y2="30" stroke="#1f1409" strokeWidth="2" strokeLinecap="round" />

                {/* Left Fixed Nut */}
                <rect x="15" y="15" width="10" height="30" rx="2" fill="#8c672b" stroke="#ffd700" strokeWidth="1" />
                <text x="20" y="56" fill="#a69680" fontSize="10" fontFamily="serif" textAnchor="middle">0 (L₀)</text>

                {/* Right Fixed Bridge */}
                <rect x="975" y="15" width="10" height="30" rx="2" fill="#8c672b" stroke="#ffd700" strokeWidth="1" />
                <text x="980" y="56" fill="#a69680" fontSize="10" fontFamily="serif" textAnchor="middle">1 (Open)</text>

                {/* Classical Pythagorean Fraction Ratios Markers */}
                {[
                  { pos: 500, label: "1/2 (2:1 Διά Πασών)", color: "#34d399" },
                  { pos: 666, label: "2/3 (3:2 Πέμπτη)", color: "#ffd700" },
                  { pos: 750, label: "3/4 (4:3 Τετάρτη)", color: "#38bdf8" },
                  { pos: 888, label: "8/9 (9:8 Τόνος)", color: "#c084fc" },
                  { pos: 618, label: "1/Φ (Χρυσή Τομή)", color: "#f43f5e" },
                ].map((marker, mIdx) => (
                  <g key={mIdx}>
                    <line x1={marker.pos} y1="22" x2={marker.pos} y2="38" stroke={marker.color} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
                    <circle cx={marker.pos} cy="30" r="2.5" fill={marker.color} />
                  </g>
                ))}

                {/* Dynamic Vibrating String Path */}
                {isPlaying ? (
                  <path
                    d={`M 20 30 Q ${20 + (980 - 20) * (analysis.monochordBridgePositionPercent / 100) / 2} ${30 + Math.sin(vibrationPhase) * 14}, ${20 + (980 - 20) * (analysis.monochordBridgePositionPercent / 100)} 30 T 980 30`}
                    fill="none"
                    stroke="#ffd700"
                    strokeWidth="3.5"
                    filter="drop-shadow(0px 0px 4px rgba(255,215,0,0.8))"
                  />
                ) : (
                  <line
                    x1="20"
                    y1="30"
                    x2="980"
                    y2="30"
                    stroke="#ffd700"
                    strokeWidth="2.5"
                  />
                )}

                {/* Movable Bridge (Magas) */}
                {(() => {
                  const bridgeX = 20 + (980 - 20) * (Math.max(5, Math.min(95, analysis.monochordBridgePositionPercent)) / 100);
                  return (
                    <g>
                      <polygon
                        points={`${bridgeX - 7},44 ${bridgeX + 7},44 ${bridgeX},20`}
                        fill="#059669"
                        stroke="#34d399"
                        strokeWidth="1.5"
                      />
                      <line x1={bridgeX} y1="6" x2={bridgeX} y2="48" stroke="#34d399" strokeWidth="1" strokeDasharray="2 1" />
                      <circle cx={bridgeX} cy="20" r="3.5" fill="#a7f3d0" />
                      <text
                        x={bridgeX}
                        y="10"
                        fill="#34d399"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {analysis.monochordBridgePositionPercent}%
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* Legend of ratios */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#a69680] px-2 pt-1 border-t border-[#1c130b]">
                <span className="text-[#34d399]">1/2: Διά Πασών (2:1)</span>
                <span className="text-[#f43f5e]">1/Φ: Χρυσός Λόγος</span>
                <span className="text-[#ffd700]">2/3: Διοξεία (3:2)</span>
                <span className="text-[#38bdf8]">3/4: Διατεσσάρων (4:3)</span>
                <span className="text-[#c084fc]">8/9: Επόγδοον (9:8)</span>
              </div>
            </div>
          </div>

          {/* PRIMARY PLAYBACK ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* 1. Play Fundamental Pitch */}
            <button
              type="button"
              onClick={handlePlayFundamental}
              className={`p-3 rounded-xl font-serif text-xs font-bold transition-all flex items-center justify-between shadow-md cursor-pointer ${
                activePlaybackType === "FUNDAMENTAL"
                  ? "bg-gradient-to-r from-[#ffd700] to-[#b8860b] text-[#1a1006] ring-2 ring-[#ffd700]"
                  : "bg-[#24170c] hover:bg-[#322010] text-[#f5ecd8] border border-[#523d24]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-current text-[#ffd700]" />
                <div className="text-left">
                  <div>Θεμελιώδης Τόνος</div>
                  <div className="text-[10px] font-mono opacity-80">{analysis.fundamentalHz.toFixed(1)} Hz</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#000000]/40 text-[#ffd700]">f₀</span>
            </button>

            {/* 2. Play Pythagorean Harmonic Chord */}
            <button
              type="button"
              onClick={handlePlayChord}
              className={`p-3 rounded-xl font-serif text-xs font-bold transition-all flex items-center justify-between shadow-md cursor-pointer ${
                activePlaybackType === "CHORD"
                  ? "bg-gradient-to-r from-[#38bdf8] to-[#0284c7] text-[#041d2d] ring-2 ring-[#38bdf8]"
                  : "bg-[#24170c] hover:bg-[#322010] text-[#f5ecd8] border border-[#523d24]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <div className="text-left">
                  <div>Πυθαγόρεια Αρμονία</div>
                  <div className="text-[10px] font-mono opacity-80">1 - 4/3 - 3/2 - 2 - Φ</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#000000]/40 text-[#38bdf8]">Chord</span>
            </button>

            {/* 3. Play Melodic Letter Arpeggio */}
            <button
              type="button"
              onClick={handlePlayArpeggio}
              disabled={!analysis.letterNotes.length}
              className={`p-3 rounded-xl font-serif text-xs font-bold transition-all flex items-center justify-between shadow-md cursor-pointer ${
                activePlaybackType === "ARPEGGIO"
                  ? "bg-gradient-to-r from-[#34d399] to-[#059669] text-[#022318] ring-2 ring-[#34d399]"
                  : "bg-[#24170c] hover:bg-[#322010] text-[#f5ecd8] border border-[#523d24]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#34d399]" />
                <div className="text-left">
                  <div>Αρπισμός Γραμμάτων</div>
                  <div className="text-[10px] font-mono opacity-80">{analysis.letterNotes.length} φθόγγοι</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#000000]/40 text-[#34d399]">Melody</span>
            </button>

            {/* 4. Play Root Solfeggio Tone */}
            <button
              type="button"
              onClick={handlePlaySolfeggio}
              className={`p-3 rounded-xl font-serif text-xs font-bold transition-all flex items-center justify-between shadow-md cursor-pointer ${
                activePlaybackType === "SOLFEGGIO"
                  ? "bg-gradient-to-r from-[#c084fc] to-[#7e22ce] text-[#1c0438] ring-2 ring-[#c084fc]"
                  : "bg-[#24170c] hover:bg-[#322010] text-[#f5ecd8] border border-[#523d24]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c084fc]" />
                <div className="text-left">
                  <div>Τόνος Πυθμένα</div>
                  <div className="text-[10px] font-mono opacity-80">{analysis.solfeggioHz} Hz</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#000000]/40 text-[#c084fc]">Solfeggio</span>
            </button>
          </div>

          {/* STOP BUTTON (Visible when playing) */}
          {isPlaying && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleStop}
                className="px-5 py-2 rounded-xl bg-[#450a0a] border border-[#dc2626] text-[#fecaca] hover:bg-[#7f1d1d] font-serif text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current text-[#ef4444]" />
                <span>Διακοπή Αναπαραγωγής Ήχου</span>
              </button>
            </div>
          )}

          {/* CONTROLS & TIMBRE CUSTOMIZER */}
          <div className="p-3.5 rounded-xl bg-[#140e08] border border-[#3b2713] space-y-3">
            <div className="flex items-center justify-between text-xs font-serif text-[#a69680] border-b border-[#2d1e10] pb-2">
              <span className="flex items-center gap-1.5 text-[#f5ecd8] font-bold">
                <Sliders className="w-3.5 h-3.5 text-[#ffd700]" />
                Ρυθμίσεις Ηχοχρώματος & Πυθαγόρειου Συντονισμού:
              </span>
              <span className="text-[11px] font-mono text-[#ffd700]">Ένταση: {Math.round(volume * 100)}%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-serif">
              {/* Reference Tuning A4 */}
              <div className="space-y-1">
                <label className="text-[#a69680] block text-[11px]">Βάση Συντονισμού (A4):</label>
                <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
                  {[
                    { hz: 432, label: "432 Hz (Φυσικός)" },
                    { hz: 528, label: "528 Hz (Solfeggio)" },
                    { hz: 256, label: "256 Hz (C=256)" },
                    { hz: 440, label: "440 Hz (Standard)" },
                  ].map((base) => (
                    <button
                      key={base.hz}
                      type="button"
                      onClick={() => setA4Base(base.hz)}
                      className={`px-2 py-1 rounded-lg border text-center transition-all cursor-pointer ${
                        a4Base === base.hz
                          ? "bg-[#3d2710] border-[#ffd700] text-[#ffd700] font-bold"
                          : "bg-[#1c130b] border-[#3b2713] text-[#a69680] hover:text-[#f5ecd8]"
                      }`}
                    >
                      {base.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timbre Type */}
              <div className="space-y-1">
                <label className="text-[#a69680] block text-[11px]">Ηχόχρωμα (Timbre):</label>
                <div className="grid grid-cols-2 gap-1 font-serif text-[11px]">
                  {[
                    { id: "GOLDEN_BOWL", label: "🔔 Κρυστάλλινο" },
                    { id: "MONOCHORD_PLUCK", label: "🎻 Πλήκτρο" },
                    { id: "PURE_SINE", label: "〰️ Ημίτονο" },
                    { id: "CELESTIAL_PAD", label: "🌌 Ουράνιο" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimbre(t.id as SynthTimbre)}
                      className={`px-2 py-1 rounded-lg border text-center transition-all cursor-pointer ${
                        timbre === t.id
                          ? "bg-[#3d2710] border-[#ffd700] text-[#ffd700] font-bold"
                          : "bg-[#1c130b] border-[#3b2713] text-[#a69680] hover:text-[#f5ecd8]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1 flex flex-col justify-between">
                <label className="text-[#a69680] block text-[11px]">Ένταση Ήχου:</label>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-[#8c7e6c]" />
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-[#ffd700] cursor-pointer"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-[#ffd700]" />
                </div>
              </div>

              {/* Melody Tempo Speed */}
              <div className="space-y-1 flex flex-col justify-between">
                <label className="text-[#a69680] block text-[11px]">Ταχύτητα Αρπισμού (ms/νότα):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="150"
                    max="600"
                    step="25"
                    value={tempoSpeed}
                    onChange={(e) => setTempoSpeed(parseInt(e.target.value, 10))}
                    className="w-full accent-[#34d399] cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-[#34d399] whitespace-nowrap">{tempoSpeed}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* LETTER-BY-LETTER MELODIC INTERACTIVE MATRIX */}
          {analysis.letterNotes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#0e0a06] border border-[#3b2713] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-serif text-[#a69680]">
                <span className="font-bold text-[#f5ecd8] flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#34d399]" />
                  Μελωδική Κλίμακα Γραμμάτων (Πατήστε κάθε γράμμα για μεμονωμένη ηχοποίηση):
                </span>
                <span className="font-mono text-[11px] text-[#34d399]">
                  {analysis.letterNotes.length} φθόγγοι
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {analysis.letterNotes.map((note, idx) => {
                  const isActive = activeLetterStep === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePlaySingleLetter(note.frequency, idx)}
                      className={`flex flex-col items-center justify-center min-w-[50px] p-2 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-b from-[#34d399] to-[#059669] text-[#022318] border-[#a7f3d0] scale-110 shadow-lg ring-2 ring-[#34d399]"
                          : "bg-[#1c130b] border-[#3b2713] text-[#f5ecd8] hover:border-[#c89b3c] hover:bg-[#281a0e]"
                      }`}
                      title={`${note.char}: ${note.value} ➔ ${note.frequency.toFixed(1)} Hz (${note.noteName})`}
                    >
                      <span className="text-base font-ancient-greek font-bold">{note.char}</span>
                      <span className="text-[10px] font-mono text-[#ffd700] font-semibold">{note.value}</span>
                      <span className="text-[9px] font-mono text-[#38bdf8] mt-0.5">{note.frequency.toFixed(0)}Hz</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* HARMONIC INTERVAL BUTTONS (Unison, Fourth, Fifth, Octave, Golden) */}
          <div className="p-3.5 rounded-xl bg-[#140e08] border border-[#3b2713] space-y-2">
            <span className="text-xs font-serif text-[#a69680] font-bold block">
              Πυθαγόρεια Αρμονικά Διαστήματα Θεμελιώδους:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { name: "Ισοκράτημα (1:1)", hz: analysis.harmonics.unison, label: "1:1", color: "#ffd700" },
                { name: "Διατεσσάρων (4:3)", hz: analysis.harmonics.fourth, label: "4:3", color: "#38bdf8" },
                { name: "Διοξεία (3:2)", hz: analysis.harmonics.fifth, label: "3:2", color: "#34d399" },
                { name: "Χρυσή Τομή (Φ)", hz: analysis.harmonics.golden, label: "1.618", color: "#f43f5e" },
                { name: "Διά Πασών (2:1)", hz: analysis.harmonics.octave, label: "2:1", color: "#c084fc" },
              ].map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePlayHarmonicTone(h.hz, h.label)}
                  className="p-2 rounded-lg bg-[#0e0a06] border border-[#2d1e10] hover:border-[#ffd700]/50 hover:bg-[#1a120a] transition-all text-left cursor-pointer"
                >
                  <div className="text-[11px] font-serif font-bold text-[#f5ecd8]">{h.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: h.color }}>
                    {h.hz.toFixed(1)} Hz
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* THEORY MODAL */}
      {showTheoryModal && (
        <div className="p-4 rounded-xl bg-[#0a0704] border-2 border-[#ffd700]/60 space-y-3 text-xs font-serif text-[#ebd8c5] animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#3b2713] pb-2">
            <h4 className="font-bold text-[#ffd700] text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Πυθαγόρειος Μονόχορδος & Η Αρμονία των Σφαιρών
            </h4>
            <button
              type="button"
              onClick={() => setShowTheoryModal(false)}
              className="text-[#a69680] hover:text-[#ffd700] text-xs font-mono cursor-pointer"
            >
              ✕ Κλείσιμο
            </button>
          </div>

          <p className="leading-relaxed">
            Ο <strong>Πυθαγόρειος Μονόχορδος</strong> (ή «κανών») υπήρξε το πρώτο επιστημονικό και φιλοσοφικό ακουστικό όργανο της αρχαιότητας. Μέσω της διαίρεσης μίας μοναδικής τεντωμένης χορδής με έναν κινητό καβαλάρη (μάγα), ο Πυθαγόρας απέδειξε ότι τα μουσικά σύμφωνα διαστήματα εκφράζονται με απλούς ακέραιους λόγους:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-[#140e08] border border-[#2b1b0e]">
              <strong className="text-[#34d399]">2:1 (Διά Πασών / Οκτάβα):</strong> Η χορδή διαιρείται ακριβώς στη μέση (1/2).
            </div>
            <div className="p-2 rounded bg-[#140e08] border border-[#2b1b0e]">
              <strong className="text-[#ffd700]">3:2 (Διοξεία / Πέμπτη):</strong> Τα 2/3 του μήκους της χορδής.
            </div>
            <div className="p-2 rounded bg-[#140e08] border border-[#2b1b0e]">
              <strong className="text-[#38bdf8]">4:3 (Διατεσσάρων / Τετάρτη):</strong> Τα 3/4 του μήκους της χορδής.
            </div>
            <div className="p-2 rounded bg-[#140e08] border border-[#2b1b0e]">
              <strong className="text-[#c084fc]">9:8 (Επόγδοον / Μείζων Τόνος):</strong> Η διαφορά Πέμπτης και Τετάρτης (3/2 ÷ 4/3 = 9/8).
            </div>
          </div>

          <p className="leading-relaxed text-[11px] text-[#a69680]">
            <strong>Συμβολική Ηχοποίηση Ισοψηφίας:</strong> Κάθε λέξη ή φράση έχει έναν συνολικό λεξάριθμο N. Μέσω της πυθαγόρειας αναγωγής οκτάβων (f = N × 2^k), ο αριθμός μεταφέρεται στο αρμονικό ακουστικό φάσμα (130 - 600 Hz), διατηρώντας επακριβώς τη σχετική χροιά και το αρμονικό του αποτύπωμα.
          </p>
        </div>
      )}
    </div>
  );
};
