import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, BookOpen, Quote, Shield, Award, CheckCircle } from "lucide-react";
import { StoryScene, StoryChoice } from "../../data/cosmicStory";

interface SceneViewProps {
  scene: StoryScene;
  onChoiceSelected: (choice: StoryChoice) => void;
  onAdvanceScene: () => void;
  selectedChoiceId?: string;
  isLastScene: boolean;
}

export const SceneView: React.FC<SceneViewProps> = ({
  scene,
  onChoiceSelected,
  onAdvanceScene,
  selectedChoiceId,
  isLastScene,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);

  useEffect(() => {
    if (selectedChoiceId) {
      const found = scene.choices.find((c) => c.id === selectedChoiceId);
      if (found) setSelectedChoice(found);
    } else {
      setSelectedChoice(null);
    }
  }, [scene.id, selectedChoiceId]);

  const handleSelect = (choice: StoryChoice) => {
    setSelectedChoice(choice);
    onChoiceSelected(choice);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-6 text-zinc-100 z-10 animate-fade-in space-y-6">
      {/* Scene Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider">
          <span>ΠΡΑΞΗ {scene.actNumber === 1 ? "Α΄" : scene.actNumber === 2 ? "Β΄" : scene.actNumber === 3 ? "Γ΄" : "Δ΄"}: {scene.actTitle}</span>
          <span>•</span>
          <span>Σκηνή {scene.sceneNumber} / {scene.totalScenesInAct}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-amber-200 to-zinc-200">
          {scene.title}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light">
          {scene.subtitle}
        </p>
      </div>

      {/* Classical/Philosophical Quote */}
      {scene.keyQuote && (
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-start gap-3 shadow-inner">
          <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs sm:text-sm italic text-amber-200/90 leading-relaxed font-serif">
              {scene.keyQuote}
            </p>
            {scene.quoteAuthor && (
              <span className="text-[11px] font-mono text-zinc-500 block">
                — {scene.quoteAuthor}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Narrative Body */}
      <div className="p-6 rounded-2xl bg-[#0d0d18]/80 border border-zinc-800/90 shadow-xl space-y-4 backdrop-blur-md">
        {scene.narrative.map((paragraph, idx) => (
          <p
            key={idx}
            className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal"
          >
            {paragraph}
          </p>
        ))}

        {/* Isopsephy & Archetype Box */}
        {scene.isopsephicConnection && (
          <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-zinc-950/50 p-3.5 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-zinc-400 font-medium">Αρχέτυπο: </span>
                <span className="text-zinc-200 font-bold">{scene.archetypeFocus}</span>
              </div>
            </div>
            <div className="font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-500/30">
              {scene.isopsephicConnection.meaning}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Choices */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5 px-1">
          <Shield className="w-3.5 h-3.5" />
          Επιλέξτε τη Στάση της Συνείδησής σας
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {scene.choices.map((choice) => {
            const isSelected = selectedChoice?.id === choice.id;

            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-amber-950/50 border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10 text-amber-100"
                    : "bg-zinc-900/70 hover:bg-zinc-800/80 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-amber-400 bg-amber-500 text-black"
                        : "border-zinc-600 bg-zinc-950"
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 fill-current" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {choice.text}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-zinc-950/80 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold shrink-0">
                  +{choice.awarenessGain} Επίγνωση
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Echo Philosophical Reveal */}
      {selectedChoice && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-zinc-900/60 border border-amber-500/40 shadow-lg animate-fade-in space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Κοσμικός Αντίλαλος (Echo)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">
              {selectedChoice.resonance}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-serif italic">
            «{selectedChoice.echo}»
          </p>

          <div className="pt-3 flex flex-col sm:flex-row justify-end">
            <button
              onClick={onAdvanceScene}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
            >
              <span>{isLastScene ? "Ολοκλήρωση & Τελική Ετυμηγορία" : "Συνέχιση στο Επόμενο Στάδιο"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
