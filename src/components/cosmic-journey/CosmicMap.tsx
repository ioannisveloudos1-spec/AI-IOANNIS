import React from "react";
import { X, CheckCircle2, Lock, Sparkles, Compass, ChevronRight, Play } from "lucide-react";
import { COSMIC_STORY_ACTS, StoryScene } from "../../data/cosmicStory";

interface CosmicMapProps {
  currentSceneId: string;
  unlockedSceneIds: string[];
  completedSceneIds: string[];
  onSelectScene: (sceneId: string) => void;
  onClose: () => void;
}

export const CosmicMap: React.FC<CosmicMapProps> = ({
  currentSceneId,
  unlockedSceneIds,
  completedSceneIds,
  onSelectScene,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a14] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                Κοσμικός Χάρτης Πράξεων & Σκηνών
              </h2>
              <p className="text-xs text-zinc-400">
                Το ιερό μονοπάτι από το Χάος στην Απόλυτη Επίγνωση (4 Πράξεις • 14 Σκηνές)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Acts List & Nodes */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {COSMIC_STORY_ACTS.map((act) => {
            const isActUnlocked = act.scenes.some((s) => unlockedSceneIds.includes(s.id));

            return (
              <div
                key={act.number}
                className={`p-4 rounded-xl border transition-all ${
                  isActUnlocked
                    ? "bg-zinc-900/50 border-zinc-800"
                    : "bg-zinc-950/40 border-zinc-900/80 opacity-60"
                }`}
              >
                {/* Act Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
                      style={{
                        backgroundColor: `${act.color}20`,
                        borderColor: `${act.color}50`,
                        color: act.color,
                        borderWidth: 1,
                      }}
                    >
                      {act.title}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-zinc-100">{act.subtitle}</h3>
                      <p className="text-xs text-zinc-400">{act.theme}</p>
                    </div>
                  </div>
                </div>

                {/* Scene Nodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {act.scenes.map((scene, idx) => {
                    const isCurrent = scene.id === currentSceneId;
                    const isCompleted = completedSceneIds.includes(scene.id);
                    const isUnlocked = unlockedSceneIds.includes(scene.id);

                    return (
                      <div
                        key={scene.id}
                        onClick={() => {
                          if (isUnlocked) {
                            onSelectScene(scene.id);
                            onClose();
                          }
                        }}
                        className={`relative p-3.5 rounded-xl border flex flex-col justify-between min-h-[110px] transition-all text-left ${
                          isCurrent
                            ? "bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10 cursor-pointer"
                            : isCompleted
                            ? "bg-zinc-900/80 border-emerald-500/40 hover:border-emerald-500/80 hover:bg-zinc-800/80 cursor-pointer"
                            : isUnlocked
                            ? "bg-zinc-900/60 border-sky-500/40 hover:border-sky-500 hover:bg-zinc-800/60 cursor-pointer"
                            : "bg-zinc-950/60 border-zinc-800/60 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <span className="text-[11px] font-mono font-bold text-zinc-400">
                            Σκηνή {scene.sceneNumber}
                          </span>
                          {isCurrent ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold animate-pulse">
                              ΤΩΡΑ
                            </span>
                          ) : isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isUnlocked ? (
                            <Play className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-zinc-200 line-clamp-1">
                            {scene.title}
                          </h4>
                          <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5">
                            {scene.subtitle}
                          </p>
                        </div>

                        {scene.isopsephicConnection && (
                          <div className="mt-2 pt-1.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500">Λεξάριθμος:</span>
                            <span className="font-mono font-bold text-amber-400">
                              {scene.isopsephicConnection.term} ({scene.isopsephicConnection.value})
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer status summary */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Ολοκληρωμένες: {completedSceneIds.length} / 14
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-ping" />
              Τρέχουσα Σκηνή
            </span>
          </div>
          <span>Κάντε κλικ σε οποιαδήποτε ξεκλείδωτη σκηνή για άμεση μετάβαση.</span>
        </div>
      </div>
    </div>
  );
};
