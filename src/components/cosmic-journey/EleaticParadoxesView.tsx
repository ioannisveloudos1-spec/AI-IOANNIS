import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Infinity as InfinityIcon,
  Atom,
  HelpCircle,
  Eye,
  Layers,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2
} from "lucide-react";
import {
  ELEATIC_PARADOXES,
  PARMENIDES_ON_BEING,
  ZENO_COMPARISON_TABLE,
  EleaticParadox
} from "../../data/eleaticParadoxes";

interface EleaticParadoxesViewProps {
  onSelectWordForCalculator?: (word: string) => void;
}

export const EleaticParadoxesView: React.FC<EleaticParadoxesViewProps> = ({
  onSelectWordForCalculator
}) => {
  const [activeTab, setActiveTab] = useState<"paradoxes" | "parmenides" | "zeno_comparison">("paradoxes");
  const [selectedParadoxId, setSelectedParadoxId] = useState<string>("achilles_tortoise");

  // Achilles Simulation State
  const [achillesStep, setAchillesStep] = useState<number>(0);
  const [isPlayingAchilles, setIsPlayingAchilles] = useState<boolean>(false);

  // Dichotomy Simulation State
  const [dichotomyDivisions, setDichotomyDivisions] = useState<number>(1);

  // Arrow Simulation State
  const [arrowFrame, setArrowFrame] = useState<number>(0);
  const [isArrowFrozen, setIsArrowFrozen] = useState<boolean>(true);

  // Stadium Simulation State
  const [stadiumTick, setStadiumTick] = useState<number>(0);
  const [isStadiumPlaying, setIsStadiumPlaying] = useState<boolean>(false);

  // Auto-step for Achilles when playing
  useEffect(() => {
    let interval: any;
    if (isPlayingAchilles) {
      interval = setInterval(() => {
        setAchillesStep((prev) => (prev < 6 ? prev + 1 : 0));
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlayingAchilles]);

  // Auto-step for Stadium when playing
  useEffect(() => {
    let interval: any;
    if (isStadiumPlaying) {
      interval = setInterval(() => {
        setStadiumTick((prev) => (prev + 1) % 8);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isStadiumPlaying]);

  const activeParadox = ELEATIC_PARADOXES.find((p) => p.id === selectedParadoxId) || ELEATIC_PARADOXES[0];

  // Achilles math computation
  // Start: Achilles at 0, Tortoise at 100.
  // Step 0: Achilles 0, Tortoise 100
  // Step 1: Achilles 100, Tortoise 110
  // Step 2: Achilles 110, Tortoise 111
  // Step 3: Achilles 111, Tortoise 111.1
  // Step 4: Achilles 111.1, Tortoise 111.11
  // Step 5: Achilles 111.11, Tortoise 111.111
  // Step 6: Achilles 111.111, Tortoise 111.1111
  const getAchillesPosition = (step: number) => {
    let pos = 0;
    for (let i = 0; i < step; i++) {
      pos += 100 / Math.pow(10, i);
    }
    return pos;
  };

  const getTortoisePosition = (step: number) => {
    let pos = 100;
    for (let i = 1; i <= step; i++) {
      pos += 100 / Math.pow(10, i);
    }
    return pos;
  };

  const achillesPos = getAchillesPosition(achillesStep);
  const tortoisePos = getTortoisePosition(achillesStep);
  const maxScaleDistance = 125;

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-[#0d0d1a] border border-amber-500/30 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold tracking-wider uppercase">
                Ελεατική Σχολή & Οντολογία
              </span>
              <span className="text-xs text-zinc-400">Ελέα Κάτω Ιταλίας (5ος αι. π.Χ.)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-200 flex items-center gap-2">
              Τα Παράδοξα του Ζήνωνος & Το Ὄν του Παρμενίδη
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1">
              Η συγκλονιστική διαλεκτική απόδειξη ότι η κίνηση, ο χώρος και η πολλαπλότητα είναι
              ψευδαισθήσεις των αισθήσεων, προς υπεράσπιση του Ακίνητου και Ενιαίου «Είναι».
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={() => onSelectWordForCalculator?.("ΠΑΡΜΕΝΙΔΗΣ")}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ισοψηφία «ΠΑΡΜΕΝΙΔΗΣ» (498)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800/80">
          <button
            onClick={() => setActiveTab("paradoxes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "paradoxes"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            Τα 4 Παράδοξα της Κίνησης (Διαδραστικά)
          </button>
          <button
            onClick={() => setActiveTab("parmenides")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "parmenides"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            <Eye className="w-4 h-4" />
            Παρμενίδης: Το Ἐόν & Οι Δύο Οδοί
          </button>
          <button
            onClick={() => setActiveTab("zeno_comparison")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "zeno_comparison"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            <Compass className="w-4 h-4" />
            Διάκριση: Ζήνων Ελεάτης vs Ζήνων Στωικός
          </button>
        </div>
      </div>

      {/* TAB 1: PARADOXES INTERACTIVE */}
      {activeTab === "paradoxes" && (
        <div className="space-y-6">
          {/* Paradox Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ELEATIC_PARADOXES.map((paradox) => (
              <button
                key={paradox.id}
                onClick={() => setSelectedParadoxId(paradox.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedParadoxId === paradox.id
                    ? "bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10"
                    : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                    {paradox.greekTitle}
                  </span>
                  <div className="text-sm font-black mt-0.5 text-zinc-100">{paradox.title}</div>
                </div>
                <div className="text-[11px] text-zinc-400 mt-2 line-clamp-1">{paradox.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Interactive Simulation Panel */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  {activeParadox.greekTitle}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-100 mt-0.5">
                  {activeParadox.title}: {activeParadox.subtitle}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 self-start sm:self-auto">
                {activeParadox.ancientSource}
              </span>
            </div>

            {/* SIMULATION 1: ACHILLES & TORTOISE */}
            {activeParadox.id === "achilles_tortoise" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5" />
                      Οπτικοποίηση της Ατέρμονης Καταδίωξης (Άπειρη Σύγκλιση)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlayingAchilles(!isPlayingAchilles)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {isPlayingAchilles ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isPlayingAchilles ? "Παύση" : "Αυτόματη Αναπαραγωγή"}
                      </button>
                      <button
                        onClick={() => {
                          setIsPlayingAchilles(false);
                          setAchillesStep(0);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs cursor-pointer"
                        title="Επαναφορά"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Track Graphic */}
                  <div className="relative py-6 px-4 bg-[#080811] rounded-xl border border-zinc-800/80 overflow-hidden">
                    {/* Distance markers */}
                    <div className="absolute top-2 left-4 right-4 flex justify-between text-[10px] font-mono text-zinc-500 border-b border-zinc-800 pb-1">
                      <span>0m (Εκκίνηση Αχιλλέα)</span>
                      <span>50m</span>
                      <span>100m (Εκκίνηση Χελώνας)</span>
                      <span>111.11m (Όριο Σύγκλισης)</span>
                      <span>125m</span>
                    </div>

                    {/* Progress Track */}
                    <div className="mt-6 space-y-5">
                      {/* Achilles Lane */}
                      <div className="relative h-10 bg-zinc-900/60 rounded-lg flex items-center px-2">
                        <span className="absolute left-2 text-[10px] font-bold text-amber-400/50 uppercase tracking-widest pointer-events-none">
                          Αχιλλεύς (10x Ταχύτητα)
                        </span>
                        <div
                          className="absolute flex items-center gap-1 transition-all duration-700 ease-out"
                          style={{
                            left: `${Math.min(94, (achillesPos / maxScaleDistance) * 100)}%`
                          }}
                        >
                          <div className="p-1.5 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/50 flex items-center justify-center font-bold text-xs">
                            🏃
                          </div>
                          <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/80 px-1.5 py-0.5 rounded border border-amber-500/40 whitespace-nowrap">
                            {achillesPos.toFixed(3)}m
                          </span>
                        </div>
                      </div>

                      {/* Tortoise Lane */}
                      <div className="relative h-10 bg-zinc-900/60 rounded-lg flex items-center px-2">
                        <span className="absolute left-2 text-[10px] font-bold text-emerald-400/50 uppercase tracking-widest pointer-events-none">
                          Χελώνη (Προβάδισμα 100m)
                        </span>
                        <div
                          className="absolute flex items-center gap-1 transition-all duration-700 ease-out"
                          style={{
                            left: `${Math.min(94, (tortoisePos / maxScaleDistance) * 100)}%`
                          }}
                        >
                          <div className="p-1.5 rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/50 flex items-center justify-center font-bold text-xs">
                            🐢
                          </div>
                          <span className="text-[11px] font-mono font-bold text-emerald-300 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/40 whitespace-nowrap">
                            {tortoisePos.toFixed(3)}m
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Convergence Line */}
                    <div
                      className="absolute top-0 bottom-0 border-r-2 border-dashed border-rose-500/60 pointer-events-none"
                      style={{ left: `${(111.111 / maxScaleDistance) * 100}%` }}
                    >
                      <span className="absolute bottom-1 -translate-x-1/2 text-[9px] font-mono bg-rose-950/90 text-rose-300 px-1 rounded border border-rose-500/40">
                        Όριο: 111.111...m
                      </span>
                    </div>
                  </div>

                  {/* Step Control Buttons & Math Breakdown */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={achillesStep === 0}
                        onClick={() => setAchillesStep((prev) => Math.max(0, prev - 1))}
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Προηγούμενο Βήμα
                      </button>
                      <span className="text-xs font-mono text-amber-300 px-2 font-bold">
                        Βήμα {achillesStep} / 6
                      </span>
                      <button
                        disabled={achillesStep >= 6}
                        onClick={() => setAchillesStep((prev) => Math.min(6, prev + 1))}
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Επόμενο Βήμα <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs font-mono text-zinc-300 bg-black/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                      Απόσταση Διαφοράς:{" "}
                      <span className="text-rose-400 font-bold">
                        {(tortoisePos - achillesPos).toFixed(4)}m
                      </span>{" "}
                      <span className="text-zinc-500">(&gt; 0 πάντοτε σε κάθε βήμα!)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION 2: DICHOTOMY */}
            {activeParadox.id === "dichotomy" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      Οπτικοποίηση της Διχοτομίας: Η άπειρη διαίρεση του χώρου σε 1/2ⁿ
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDichotomyDivisions((prev) => (prev < 8 ? prev + 1 : 1))}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer transition-colors"
                      >
                        Επόμενη Υποδιαίρεση ({dichotomyDivisions} / 8)
                      </button>
                    </div>
                  </div>

                  {/* Dichotomy Visual Bar */}
                  <div className="space-y-3">
                    <div className="relative h-12 bg-black rounded-xl border border-zinc-700 overflow-hidden flex items-center">
                      {Array.from({ length: dichotomyDivisions }).map((_, idx) => {
                        const widthPercent = 100 / Math.pow(2, idx + 1);
                        const leftPercent =
                          idx === 0
                            ? 0
                            : Array.from({ length: idx }).reduce(
                                (acc: number, _, i) => acc + 100 / Math.pow(2, i + 1),
                                0
                              );
                        return (
                          <div
                            key={idx}
                            className="absolute top-0 bottom-0 border-r border-amber-500/80 bg-gradient-to-r from-amber-500/20 to-amber-500/40 flex items-center justify-center text-[10px] font-mono text-amber-200 font-bold"
                            style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                          >
                            1/{Math.pow(2, idx + 1)}
                          </div>
                        );
                      })}
                      <div className="absolute right-3 text-xs font-bold text-zinc-400">
                        Τέρμα (100%)
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-400">
                      <span>Σειρά κλασμάτων:</span>
                      {Array.from({ length: dichotomyDivisions }).map((_, idx) => (
                        <span key={idx} className="text-amber-300 font-bold">
                          1/{Math.pow(2, idx + 1)} {idx < dichotomyDivisions - 1 ? "+ " : "= "}
                        </span>
                      ))}
                      <span className="text-emerald-400 font-bold">
                        {(1 - 1 / Math.pow(2, dichotomyDivisions)).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION 3: FLYING ARROW */}
            {activeParadox.id === "arrow" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      Το Βέλος στο Ακαριαίο «Νῦν»: Ακίνητο σε κάθε στιγμή
                    </span>
                    <button
                      onClick={() => setIsArrowFrozen(!isArrowFrozen)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer"
                    >
                      {isArrowFrozen ? "Εναλλαγή σε Συνεχή Χρόνο" : "Πάγωμα στο «Νῦν»"}
                    </button>
                  </div>

                  {/* Arrow Snapshot visual */}
                  <div className="relative h-28 bg-[#080811] rounded-xl border border-zinc-800 flex items-center px-6 overflow-hidden">
                    <div className="absolute top-2 left-6 right-6 flex justify-between text-[10px] font-mono text-zinc-500 border-b border-zinc-800 pb-1">
                      <span>Χρονική Στιγμή t₀</span>
                      <span>t₁</span>
                      <span>t₂</span>
                      <span>t₃ (Παρόν «Νῦν»)</span>
                      <span>t₄</span>
                      <span>t₅</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-500 ${
                        isArrowFrozen
                          ? "bg-rose-950/60 border border-rose-500/80 shadow-lg shadow-rose-500/20 translate-x-32"
                          : "bg-emerald-950/60 border border-emerald-500/80 animate-pulse translate-x-48"
                      }`}
                    >
                      <div className="text-2xl">🏹 ➔</div>
                      <div className="text-xs font-mono">
                        <div className="font-bold text-amber-300">
                          {isArrowFrozen ? "Στιγμιαία Κατάσταση: ΑΚΙΝΗΤΟ" : "Φαινομενική Κίνηση"}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Καταλαμβάνει χώρο ακριβώς ίσο με το μήκος του
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION 4: STADIUM */}
            {activeParadox.id === "stadium" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      Το Στάδιον: Σχετικότητα Ταχύτητας & Διάσπαση των Χρονικών Κβάντων
                    </span>
                    <button
                      onClick={() => setIsStadiumPlaying(!isStadiumPlaying)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer"
                    >
                      {isStadiumPlaying ? "Παύση" : "Εκκίνηση Κίνησης"}
                    </button>
                  </div>

                  {/* Stadium visual */}
                  <div className="space-y-3 py-4 px-6 bg-[#080811] rounded-xl border border-zinc-800 font-mono text-xs">
                    {/* Row A: Stationary */}
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-[11px] text-zinc-400 font-bold">Σειρά A (Ακίνητη):</span>
                      <div className="flex gap-2">
                        {["A1", "A2", "A3", "A4"].map((item) => (
                          <span
                            key={item}
                            className="w-12 h-9 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Row B: Moving Right */}
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-[11px] text-amber-400 font-bold">Σειρά B (➔ +v):</span>
                      <div
                        className="flex gap-2 transition-all duration-300"
                        style={{ transform: `translateX(${(stadiumTick - 4) * 14}px)` }}
                      >
                        {["B1", "B2", "B3", "B4"].map((item) => (
                          <span
                            key={item}
                            className="w-12 h-9 rounded bg-amber-500/20 border border-amber-500/60 flex items-center justify-center font-bold text-amber-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Row C: Moving Left */}
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-[11px] text-cyan-400 font-bold">Σειρά Γ (⬅ -v):</span>
                      <div
                        className="flex gap-2 transition-all duration-300"
                        style={{ transform: `translateX(${-(stadiumTick - 4) * 14}px)` }}
                      >
                        {["Γ1", "Γ2", "Γ3", "Γ4"].map((item) => (
                          <span
                            key={item}
                            className="w-12 h-9 rounded bg-cyan-500/20 border border-cyan-500/60 flex items-center justify-center font-bold text-cyan-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Deep Explanations: Original Quote & Eleatic vs Modern Resolution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <BookOpenIcon className="w-4 h-4" />
                  Αρχαίο Κείμενο & Επιχείρημα Ζήνωνος
                </div>
                <blockquote className="text-xs text-zinc-300 italic font-serif leading-relaxed border-l-2 border-amber-500/60 pl-3 py-1">
                  {activeParadox.originalArgument}
                </blockquote>
                <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
                  <strong className="text-zinc-200">Ελεατικός Σκοπός:</strong>{" "}
                  {activeParadox.eleaticResolution}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Atom className="w-4 h-4" />
                  Σύγχρονη Μαθηματική & Κβαντική Επίλυση
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-black/40 p-2.5 rounded border border-zinc-800">
                  {activeParadox.mathExplanation}
                </p>
                <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
                  <strong className="text-zinc-200">Σύγχρονη Φυσική:</strong>{" "}
                  {activeParadox.modernResolution}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARMENIDES ON BEING */}
      {activeTab === "parmenides" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PARMENIDES_ON_BEING.map((concept) => (
              <div
                key={concept.id}
                className="p-5 rounded-2xl bg-zinc-950/80 border border-amber-500/30 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    {concept.ancientGreek}
                  </span>
                  <h3 className="text-lg font-black text-amber-200 mt-1">{concept.term}</h3>
                  <p className="text-xs text-zinc-400 italic mb-3">{concept.translation}</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{concept.meaning}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-800/80">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Αυθεντικά Αποσπάσματα («Περί Φύσεως»):
                  </span>
                  {concept.keyFragments.map((frag, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-1">
                      <div className="text-xs font-serif italic text-amber-300 leading-snug">
                        {frag.greek}
                      </div>
                      <div className="text-[11px] text-zinc-400">{frag.translation}</div>
                      <div className="text-[9px] font-mono text-zinc-500 text-right">{frag.source}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Ontological Sphere Infographic */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-[#0a0a16] to-black border border-zinc-800 flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-amber-500/30 via-purple-500/20 to-cyan-500/30 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 flex flex-col items-center justify-center text-center p-3 flex-shrink-0 animate-pulse">
              <span className="text-xs font-bold text-amber-300">ΤΟ ΕΟΝ</span>
              <span className="text-[10px] text-zinc-300 font-serif italic mt-1">«Ευκύκλου σφαίρης εναλίγκιον όγκω»</span>
              <span className="text-[9px] text-zinc-400 mt-1">Αδιαίρετο & Ακίνητο</span>
            </div>

            <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
              <h4 className="text-sm font-bold text-amber-300">
                Η Παρμενίδεια Μεταφυσική Σφαίρα
              </h4>
              <p>
                Ο Παρμενίδης παρομοιάζει το Ον με έναν τέλειο σφαιρικό όγκο, ισοβαρή από το κέντρο προς όλες τις κατευθύνσεις. Δεν υπάρχει «περισσότερο Ον» εδώ ή «λιγότερο Ον» εκεί. Το κενό (το μηδέν) δεν υπάρχει, επομένως δεν υπάρχει χώρος για να κινηθεί τίποτα.
              </p>
              <p className="text-zinc-400 italic">
                «Οὔτε ποτ' ἦν οὔτ' ἔσται, ἐπεὶ νῦν ἔστιν ὁμοῦ πᾶν, ἕν, συνεχές.» (Ούτε υπήρξε ποτέ ούτε θα υπάρξει, διότι τώρα είναι όλο μαζί, ένα και συνεχές).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ZENO ELEATIC VS ZENO STOIC */}
      {activeTab === "zeno_comparison" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            <strong>Ιστορική & Εννοιολογική Διευκρίνιση:</strong> Στην ελληνική γραμματεία υπάρχουν δύο διάσημοι φιλόσοφοι με το όνομα <strong>Ζήνων</strong>. Ο <em>Ζήνων ο Ελεάτης</em> (εισηγητής των Παραδόξων της Κίνησης) και ο <em>Ζήνων ο Κιτιεύς</em> (ο ιδρυτής της Στωικής Σχολής). Ο παρακάτω πίνακας αποσαφηνίζει πλήρως τις διαφορές τους:
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/90">
                  <th className="p-3.5 font-bold text-zinc-400 w-1/4">Χαρακτηριστικό</th>
                  <th className="p-3.5 font-bold text-amber-400 w-3/8">
                    Ζήνων ο Ελεάτης (Παράδοξα)
                  </th>
                  <th className="p-3.5 font-bold text-cyan-400 w-3/8">
                    Ζήνων ο Κιτιεύς (Στωικισμός)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {ZENO_COMPARISON_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3.5 font-bold text-zinc-300">{row.feature}</td>
                    <td className="p-3.5 text-zinc-300 leading-relaxed bg-amber-500/5">
                      {row.zenoEleatic}
                    </td>
                    <td className="p-3.5 text-zinc-300 leading-relaxed bg-cyan-500/5">
                      {row.zenoStoic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

function BookOpenIcon(props: any) {
  return <Layers {...props} />;
}
