import React from "react";
import { Sparkles, Trophy, RotateCcw, Compass, Map, BookOpen, Sun, Award, CheckCircle2, Orbit, Brain } from "lucide-react";
import { TOTAL_MAX_AWARENESS } from "../../data/cosmicStory";

interface EndScreenProps {
  finalAwarenessScore: number;
  onRestartJourney: () => void;
  onOpenMap: () => void;
  onOpenPantheon: () => void;
  onOpenCodex: () => void;
  onOpenGreatYear: () => void;
  onOpenMindGeometry: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({
  finalAwarenessScore,
  onRestartJourney,
  onOpenMap,
  onOpenPantheon,
  onOpenCodex,
  onOpenGreatYear,
  onOpenMindGeometry,
}) => {
  const percentage = Math.round((finalAwarenessScore / TOTAL_MAX_AWARENESS) * 100);

  const getVerdict = (score: number) => {
    if (score >= 320) {
      return {
        title: "Ηλιακός Επόπτης (Θέωσις & Απόλυτη Επίγνωσις)",
        badge: "ΥΠΕΡΤΑΤΗ ΜΥΗΣΙΣ",
        description:
          "Διασχίσατε και τις 4 Πράξεις με άψογη πνευματική διάκριση. Αναγνωρίσατε τον ενιαίο Λόγο από τον Ηράκλειτο στον Απόλλωνα και στο όνομα ΙΗΣΟΥΣ (888). Η ψυχή σας ήπιε από τη Μνημοσύνη και έσπασε τα δεσμά της Λήθης. Είστε πλέον ένας αφυπνισμένος φάρος της Κοσμικής Αρμονίας.",
        color: "from-amber-300 via-orange-400 to-amber-500",
      };
    }
    if (score >= 250) {
      return {
        title: "Κοσμικός Μύστης του Φωτός",
        badge: "ΜΥΗΣΙΣ ΒΑΘΜΟΥ Α΄",
        description:
          "Η συνείδησή σας συντονίστηκε βαθιά με τις συμπαντικές δυνάμεις. Κατανοήσατε τη σημασία της Τετρακτύος, της μετάπτωσης των 25.920 ετών και της θυσίας του εγώ πάνω στον σταυρό της ύλης.",
        color: "from-purple-300 via-violet-400 to-purple-500",
      };
    }
    return {
      title: "Αφυπνισμένος Ζητητής της Αληθείας",
      badge: "ΝΕΟΦΥΤΟΣ ΜΥΣΤΗΣ",
      description:
        "Ολοκληρώσατε το πρώτο μεγάλο ταξίδι από το Χάος στην πρώτη αναλαμπή του Φωτός. Κάθε επανάληψη του ταξιδιού αποκαλύπτει βαθύτερα στρώματα ετυμολογικής και μεταφυσικής σοφίας.",
      color: "from-sky-300 via-cyan-400 to-blue-500",
    };
  };

  const verdict = getVerdict(finalAwarenessScore);

  return (
    <div className="relative min-h-[82vh] flex flex-col items-center justify-center text-center px-4 py-8 max-w-3xl mx-auto z-10 animate-fade-in space-y-6">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/20 via-purple-600/20 to-sky-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Sun / Trophy Emblem */}
      <div className="p-5 rounded-full bg-gradient-to-b from-amber-500/20 to-purple-950/40 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/30 text-amber-300 animate-pulse">
        <Sun className="w-12 h-12 text-amber-300" />
      </div>

      <div className="space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest">
          {verdict.badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-zinc-100">
          Ολοκλήρωση Κοσμικής Ανατάσεως
        </h1>
      </div>

      {/* Verdict Card */}
      <div className="p-6 rounded-2xl bg-[#0d0d18]/90 border border-amber-500/30 shadow-2xl space-y-4 text-left w-full backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs text-zinc-400">Κοσμικός Τίτλος & Κατάσταση:</span>
            <h2 className={`text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${verdict.color}`}>
              {verdict.title}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 block">Τελική Επίγνωση:</span>
            <span className="text-2xl font-mono font-extrabold text-amber-400">
              {finalAwarenessScore} <span className="text-sm text-zinc-500 font-normal">/ {TOTAL_MAX_AWARENESS} ({percentage}%)</span>
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-serif">
          {verdict.description}
        </p>

        {/* 4 Acts Status Check */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          {[
            { act: "Πράξη Α΄", name: "Γένεσις", status: "Ολοκληρώθηκε" },
            { act: "Πράξη Β΄", name: "Τιτάνες", status: "Ολοκληρώθηκε" },
            { act: "Πράξη Γ΄", name: "Ολύμπιοι", status: "Ολοκληρώθηκε" },
            { act: "Πράξη Δ΄", name: "Μεταμόρφωσις", status: "Ολοκληρώθηκε" },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-zinc-200">{item.act}</div>
                <div className="text-[10px] text-zinc-500">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full max-w-4xl mx-auto pt-2">
        <button
          onClick={onRestartJourney}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Επανεκκίνηση Ταξιδιού</span>
        </button>

        <button
          onClick={onOpenMap}
          className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sky-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
        >
          <Map className="w-4 h-4" />
          <span>Επισκόπηση Χάρτη</span>
        </button>

        <button
          onClick={onOpenGreatYear}
          className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 min-h-[44px] touch-manipulation"
        >
          <Orbit className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "15s" }} />
          <span>Μέγας Ενιαυτός (25.920ε.)</span>
        </button>

        <button
          onClick={onOpenPantheon}
          className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-purple-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
        >
          <Compass className="w-4 h-4" />
          <span>Πάνθεον (35 Θεοί)</span>
        </button>

        <button
          onClick={onOpenCodex}
          className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
        >
          <BookOpen className="w-4 h-4" />
          <span>Κώδικας & Ενότητα Όντος</span>
        </button>

        <button
          onClick={onOpenMindGeometry}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/25 hover:from-amber-500/30 hover:to-orange-500/35 border border-amber-500/50 text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-amber-500/15 min-h-[44px] touch-manipulation"
        >
          <Brain className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Γεωμετρία Νου (720)</span>
        </button>
      </div>
    </div>
  );
};
