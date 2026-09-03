import React from "react";
import { Sparkles, Map, Compass, BookOpen, RotateCcw, Award, Orbit, Brain } from "lucide-react";
import { TOTAL_MAX_AWARENESS } from "../../data/cosmicStory";

interface CosmicProgressProps {
  currentSceneIndex: number; // 0 to 13 (total 14)
  totalScenes: number; // 14
  awarenessScore: number;
  actTitle: string;
  actNumber: number;
  onOpenMap: () => void;
  onOpenPantheon: () => void;
  onOpenCodex: () => void;
  onOpenGreatYear: () => void;
  onOpenMindGeometry: () => void;
  onRestartJourney?: () => void;
}

export const CosmicProgress: React.FC<CosmicProgressProps> = ({
  currentSceneIndex,
  totalScenes,
  awarenessScore,
  actTitle,
  actNumber,
  onOpenMap,
  onOpenPantheon,
  onOpenCodex,
  onOpenGreatYear,
  onOpenMindGeometry,
  onRestartJourney,
}) => {
  const sceneProgressPct = Math.min(
    100,
    Math.round(((currentSceneIndex + 1) / totalScenes) * 100)
  );
  const awarenessPct = Math.min(
    100,
    Math.round((awarenessScore / TOTAL_MAX_AWARENESS) * 100)
  );

  // Derive Rank title from Awareness
  const getRank = (score: number) => {
    if (score >= 320) return { title: "Ηλιακός Επόπτης (Θέωσις)", color: "text-amber-300" };
    if (score >= 250) return { title: "Κοσμικός Μύστης", color: "text-purple-300" };
    if (score >= 170) return { title: "Αφυπνισμένος Νους", color: "text-sky-300" };
    if (score >= 90) return { title: "Ζητητής του Φωτός", color: "text-emerald-300" };
    return { title: "Νεόφυτος των Μυστηρίων", color: "text-zinc-400" };
  };

  const rank = getRank(awarenessScore);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0a0a0f]/90 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-6 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Act & Scene info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono tracking-wider">
              ΠΡΑΞΗ {actNumber === 1 ? "Α΄" : actNumber === 2 ? "Β΄" : actNumber === 3 ? "Γ΄" : "Δ΄"}
            </span>
            <div className="text-left">
              <div className="text-xs text-zinc-400">
                Στάδιο {currentSceneIndex + 1} / {totalScenes}
              </div>
              <div className="text-sm font-bold text-zinc-100 truncate max-w-[200px] sm:max-w-xs">
                {actTitle}
              </div>
            </div>
          </div>

          {/* Quick Nav Tools */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 md:mt-0 md:ml-3">
            <button
              onClick={onOpenMap}
              title="Κοσμικός Χάρτης"
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 hover:border-sky-500/50 text-sky-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer min-h-[34px] touch-manipulation"
            >
              <Map className="w-3.5 h-3.5 text-sky-400" />
              <span>Χάρτης</span>
            </button>
            <button
              onClick={onOpenGreatYear}
              title="Μέγας Ενιαυτός (25.920 έτη & 12 Ζώδια)"
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500/50 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer min-h-[34px] touch-manipulation"
            >
              <Orbit className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              <span>25.920ε.</span>
            </button>
            <button
              onClick={onOpenPantheon}
              title="Πάνθεον 35 Θεών & Τιτάνων"
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 hover:border-purple-500/50 text-purple-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer min-h-[34px] touch-manipulation"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Πάνθεον</span>
            </button>
            <button
              onClick={onOpenCodex}
              title="Μεταφυσικός Κώδικας & Ετυμολογία"
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500/50 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer min-h-[34px] touch-manipulation"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Κώδικας</span>
            </button>
            <button
              onClick={onOpenMindGeometry}
              title="Γεωμετρία του Νου (6! = 720 & 72 × 10 = 720 = ΝΟΥΣ)"
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/60 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-500/15 min-h-[34px] touch-manipulation"
            >
              <Brain className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>ΝΟΥΣ (720)</span>
            </button>
          </div>
        </div>

        {/* Right: Dual Progress Bars (Journey & Awareness) */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Journey Progress */}
          <div className="w-full sm:w-44 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-medium text-zinc-400">
              <span>Πορεία</span>
              <span className="text-sky-300">{sceneProgressPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${sceneProgressPct}%` }}
              />
            </div>
          </div>

          {/* Awareness Score & Rank */}
          <div className="w-full sm:w-52 flex flex-col gap-1">
            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>Επίγνωση: {awarenessScore}</span>
              </div>
              <span className={`text-[10px] font-bold ${rank.color} truncate max-w-[110px]`}>
                {rank.title}
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${awarenessPct}%` }}
              />
            </div>
          </div>

          {onRestartJourney && (
            <button
              onClick={onRestartJourney}
              title="Επανεκκίνηση Ταξιδιού"
              className="p-1.5 rounded-lg bg-zinc-900/60 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-800/60 transition-all cursor-pointer hidden md:flex"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
