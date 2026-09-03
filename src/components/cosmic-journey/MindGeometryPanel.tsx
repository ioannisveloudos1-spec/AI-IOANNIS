import React from "react";
import { X, Brain, Sparkles, BookOpen, Compass, Orbit } from "lucide-react";
import { MindGeometryCard } from "./MindGeometryCard";

interface MindGeometryPanelProps {
  onClose: () => void;
  onSelectWordForCalculator?: (word: string) => void;
}

export const MindGeometryPanel: React.FC<MindGeometryPanelProps> = ({
  onClose,
  onSelectWordForCalculator,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-[#0a0a14] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-zinc-100 flex items-center gap-2">
                <span>Γεωμετρία του Νου (ΝΟΥΣ = 720)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-normal">
                  6! = 720
                </span>
              </h2>
              <p className="text-xs text-zinc-400 hidden sm:block font-light">
                Μαθηματική επεξήγηση της σύνδεσης του 6 παραγοντικού και της εξίσωσης 72 (ΟΒ) × 10 (Ι) = 720
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer"
            title="Κλείσιμο"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <MindGeometryCard
            onSelectWordForCalculator={onSelectWordForCalculator}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
};
