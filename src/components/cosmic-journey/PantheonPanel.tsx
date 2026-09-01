import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  Compass,
  Sparkles,
  Sun,
  Moon,
  Flame,
  Waves,
  Globe,
  Wind,
  Layers,
  Crown,
  Heart,
  Zap,
  BookMarked,
  Scale,
  Sword,
  Hammer,
  Wand2,
  Clock,
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  RotateCcw,
  Wheat,
  Droplets,
  Dumbbell,
  Sparkle,
} from "lucide-react";
import { PANTHEON_ENTITIES, PantheonEntity, PantheonGroup } from "../../data/cosmicPantheon";

interface PantheonPanelProps {
  onClose: () => void;
  onSelectWordForCalculator?: (word: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Orbit: Globe,
  Globe: Globe,
  ShieldAlert: ShieldAlert,
  Heart: Heart,
  Moon: Moon,
  Layers: Layers,
  Sparkles: Sparkles,
  Sun: Sun,
  Compass: Compass,
  Waves: Waves,
  Clock: Clock,
  Shield: Shield,
  RotateCcw: RotateCcw,
  Droplets: Droplets,
  Eye: Eye,
  Zap: Zap,
  Brain: Sparkles,
  BookMarked: BookMarked,
  Scale: Scale,
  Flame: Flame,
  Dumbbell: Dumbbell,
  Crown: Crown,
  Wheat: Wheat,
  ShieldCheck: ShieldCheck,
  Sword: Sword,
  Hammer: Hammer,
  Wand2: Wand2,
  Key: Key,
  Sparkle: Sparkle,
};

export const PantheonPanel: React.FC<PantheonPanelProps> = ({
  onClose,
  onSelectWordForCalculator,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<PantheonGroup | "all">("all");
  const [selectedEntity, setSelectedEntity] = useState<PantheonEntity | null>(null);

  const filteredEntities = useMemo(() => {
    return PANTHEON_ENTITIES.filter((entity) => {
      const matchesGroup = selectedGroup === "all" || entity.group === selectedGroup;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        entity.name.toLowerCase().includes(q) ||
        entity.greekName.toLowerCase().includes(q) ||
        entity.title.toLowerCase().includes(q) ||
        entity.domain.toLowerCase().includes(q) ||
        entity.symbols.some((s) => s.toLowerCase().includes(q)) ||
        entity.isopsephy.toString() === q;
      return matchesGroup && matchesSearch;
    });
  }, [searchQuery, selectedGroup]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0a0a14] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                Κοσμικόν Πάνθεον
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  35 Θεότητες & Δυνάμεις
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Πρωταρχικές Δυνάμεις, Τιτάνες, Ολύμπιοι & Μυστηριακές Οντότητες
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

        {/* Search & Group Filter Bar */}
        <div className="p-4 bg-zinc-950/50 border-b border-zinc-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Αναζήτηση θεού, τίτλου, ισοψηφίας..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/60 focus:border-purple-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none"
            />
          </div>

          {/* Group Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: "all", label: "Όλα (35)" },
              { id: "primordial", label: "Πρωταρχικοί" },
              { id: "titan", label: "Τιτάνες" },
              { id: "olympian", label: "Ολύμπιοι" },
              { id: "chthonic", label: "Χθόνιοι" },
              { id: "mystery", label: "Μυστήρια" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGroup(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedGroup === tab.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Entities Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntities.map((entity) => {
            const IconComp = ICON_MAP[entity.iconName] || Sparkles;

            return (
              <div
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                className={`p-4 rounded-xl border bg-gradient-to-b ${entity.bgGradient} ${entity.auraColor} hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between group shadow-lg`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-amber-300">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                          {entity.name}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-400 block">
                          {entity.groupTitle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                        {entity.isopsephy}
                      </span>
                      <span className="text-[9px] text-zinc-500 block uppercase mt-0.5">
                        {entity.element}
                      </span>
                    </div>
                  </div>

                  {/* Title & Domain */}
                  <div className="text-xs font-semibold text-purple-300 mb-1">
                    {entity.title}
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3">
                    {entity.domain}
                  </p>
                </div>

                {/* Symbols & Esoteric Footer */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <div className="flex flex-wrap gap-1">
                    {entity.symbols.slice(0, 2).map((sym, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-zinc-400"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-400/80 group-hover:text-amber-300 font-medium">
                    Προβολή ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Entity Detail View */}
        {selectedEntity && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#0d0d18] border border-purple-500/50 rounded-2xl p-6 shadow-2xl text-zinc-100 space-y-4">
              <button
                onClick={() => setSelectedEntity(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-amber-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-100">
                    {selectedEntity.name} ({selectedEntity.greekName})
                  </h3>
                  <div className="text-xs text-purple-300 font-medium">
                    {selectedEntity.title} • {selectedEntity.groupTitle}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                <div>
                  <span className="text-zinc-500">Ισοψηφία:</span>{" "}
                  <span className="font-mono font-bold text-amber-400">
                    {selectedEntity.isopsephy}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Στοιχείο:</span>{" "}
                  <span className="font-bold text-zinc-200">{selectedEntity.element}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500">Σύμβολα:</span>{" "}
                  <span className="text-zinc-300">{selectedEntity.symbols.join(" • ")}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Περιγραφή & Επικράτεια
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80">
                  {selectedEntity.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Εσωτερική & Μεταφυσική Σημασία
                </h4>
                <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
                  {selectedEntity.esotericMeaning}
                </p>
              </div>

              {onSelectWordForCalculator && (
                <button
                  onClick={() => {
                    onSelectWordForCalculator(selectedEntity.greekName.split(" ")[0]);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Υπολογισμός Λεξαρίθμου στον Υπολογιστή ({selectedEntity.greekName})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
