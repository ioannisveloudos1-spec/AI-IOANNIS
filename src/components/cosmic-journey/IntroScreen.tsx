import React from "react";
import { Sparkles, Compass, Map, BookOpen, Play, Shield, Sun, Orbit, Brain } from "lucide-react";
import { MindGeometryCard } from "./MindGeometryCard";

interface IntroScreenProps {
  onStartJourney: () => void;
  onOpenMap: () => void;
  onOpenPantheon: () => void;
  onOpenCodex: () => void;
  onOpenGreatYear: () => void;
  onOpenMindGeometry: () => void;
  onSelectWordForCalculator?: (word: string) => void;
  hasSavedProgress: boolean;
  savedSceneIndex: number;
  onContinueJourney: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartJourney,
  onOpenMap,
  onOpenPantheon,
  onOpenCodex,
  onOpenGreatYear,
  onOpenMindGeometry,
  onSelectWordForCalculator,
  hasSavedProgress,
  savedSceneIndex,
  onContinueJourney,
}) => {
  return (
    <div className="relative min-h-[82vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-4xl mx-auto z-10">
      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/10 via-purple-600/10 to-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
        Διαδραστικό Μυθολογικό-Μεταφυσικό Ταξίδι
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500/90 mb-4 font-serif">
        ΚΟΣΜΙΚΗ ΑΝΑΤΑΣΗ
      </h1>

      <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-light leading-relaxed mb-8">
        Ένα βιωματικό ταξίδι εξέλιξης της Συνείδησης μέσα από <strong className="text-amber-300 font-semibold">4 Πράξεις</strong> και <strong className="text-sky-300 font-semibold">14 Σκηνές</strong>: από το πρωταρχικό Χάος και τους Τιτάνες, στη σιωπή του Ολύμπου και στην τελική θέωση του Ήλιου-Απόλλωνος και του Αναστημένου Λόγου (888).
      </p>

      {/* 4 Acts Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mb-10 text-left">
        {[
          { act: "ΠΡΑΞΗ Α΄", title: "Γένεσις", desc: "Χάος, Γαία, Έρως & Αιθήρ", color: "border-sky-500/40 text-sky-300 bg-sky-950/20" },
          { act: "ΠΡΑΞΗ Β΄", title: "Τιτάνες", desc: "Κρόνος & Τιτανομαχία", color: "border-amber-500/40 text-amber-300 bg-amber-950/20" },
          { act: "ΠΡΑΞΗ Γ΄", title: "Ολύμπιοι", desc: "Δωδεκάθεο, Άδης & Λήθη", color: "border-purple-500/40 text-purple-300 bg-purple-950/20" },
          { act: "ΠΡΑΞΗ Δ΄", title: "Μεταμόρφωσις", desc: "JE+S+US & Ήλιος-Απόλλων", color: "border-orange-500/40 text-orange-300 bg-orange-950/20" },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border ${item.color} backdrop-blur-sm flex flex-col justify-between`}
          >
            <span className="text-[10px] font-mono font-bold opacity-80">{item.act}</span>
            <div className="font-bold text-xs sm:text-sm text-zinc-100 mt-1">{item.title}</div>
            <p className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md justify-center mb-8">
        {hasSavedProgress ? (
          <>
            <button
              onClick={onContinueJourney}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Συνέχιση (Στάδιο {savedSceneIndex + 1})
            </button>
            <button
              onClick={onStartJourney}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-zinc-100 text-xs font-bold transition-all cursor-pointer"
            >
              Νέα Έναρξη
            </button>
          </>
        ) : (
          <button
            onClick={onStartJourney}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm sm:text-base shadow-2xl shadow-amber-500/30 transition-all transform hover:scale-[1.04] cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Play className="w-5 h-5 fill-current" />
            Έναρξη Κοσμικού Ταξιδιού
          </button>
        )}
      </div>

      {/* Secondary Panels Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs mb-8 w-full max-w-4xl mx-auto px-2">
        <button
          onClick={onOpenMindGeometry}
          className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 border border-amber-500/60 text-amber-200 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/15 min-h-[42px] touch-manipulation"
        >
          <Brain className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Γεωμετρία Νου (6! = 720)</span>
        </button>
        <button
          onClick={onOpenMap}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-sky-500/50 text-sky-300 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[42px] touch-manipulation"
        >
          <Map className="w-4 h-4" />
          <span>Κοσμικός Χάρτης</span>
        </button>
        <button
          onClick={onOpenGreatYear}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500/50 text-amber-300 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/10 min-h-[42px] touch-manipulation"
        >
          <Orbit className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "15s" }} />
          <span>Μέγας Ενιαυτός (25.920ε.)</span>
        </button>
        <button
          onClick={onOpenPantheon}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-purple-500/50 text-purple-300 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[42px] touch-manipulation"
        >
          <Compass className="w-4 h-4" />
          <span>Πάνθεον (35 Θεοί)</span>
        </button>
        <button
          onClick={onOpenCodex}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500/50 text-amber-300 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[42px] touch-manipulation"
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>Κώδικας & Ενότητα Όντος</span>
        </button>
      </div>

      {/* Embedded Mind Geometry Section on Intro */}
      <div className="w-full text-left">
        <MindGeometryCard onSelectWordForCalculator={onSelectWordForCalculator} />
      </div>
    </div>
  );
};
