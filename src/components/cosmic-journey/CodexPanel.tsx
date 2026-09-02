import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  BookOpen,
  Sparkles,
  BookMarked,
  Tag,
  Scroll,
  Atom,
  Quote,
  Layers,
  Flame
} from "lucide-react";
import { COSMIC_CODEX_ENTRIES, CodexEntry } from "../../data/cosmicCodex";
import { GreekAnthologyView } from "./GreekAnthologyView";
import { EleaticParadoxesView } from "./EleaticParadoxesView";

interface CodexPanelProps {
  onClose: () => void;
  onSelectWordForCalculator?: (word: string) => void;
}

export const CodexPanel: React.FC<CodexPanelProps> = ({
  onClose,
  onSelectWordForCalculator,
}) => {
  const [mainTab, setMainTab] = useState<"anthology" | "eleatic" | "lexicon">("anthology");

  // Lexicon state
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);

  const filteredEntries = useMemo(() => {
    return COSMIC_CODEX_ENTRIES.filter((entry) => {
      const matchesCat = selectedCategory === "all" || entry.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        entry.term.toLowerCase().includes(q) ||
        entry.greekTerm.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.etymologicalAnalysis.toLowerCase().includes(q) ||
        entry.philosophicalSignificance.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#0a0a14] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-100 flex items-center gap-2">
                🏛️ Ανθολόγιο Ελληνικού Πνεύματος & Μεταφυσικός Κώδικας
              </h2>
              <p className="text-xs text-zinc-400">
                Θεοί, Ήρωες, Στρατηλάτες, Φιλόσοφοι, Ελεατικά Παράδοξα & Αριθμοσοφικά Μυστήρια
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

        {/* Main Section Navigation Tabs */}
        <div className="px-6 py-2.5 bg-zinc-950/50 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMainTab("anthology")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                mainTab === "anthology"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              <Quote className="w-4 h-4" />
              Ανθολόγιο Ελληνικού Πνεύματος (Θεοί, Ήρωες, Φιλόσοφοι)
            </button>

            <button
              onClick={() => setMainTab("eleatic")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                mainTab === "eleatic"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              <Atom className="w-4 h-4" />
              Ελεατικά Παράδοξα & Παρμενίδης
            </button>

            <button
              onClick={() => setMainTab("lexicon")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                mainTab === "lexicon"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              <Scroll className="w-4 h-4" />
              Μεταφυσικά & Ετυμολογικά Λήμματα
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {mainTab === "anthology" && (
            <GreekAnthologyView onSelectWordForCalculator={onSelectWordForCalculator} />
          )}

          {mainTab === "eleatic" && (
            <EleaticParadoxesView onSelectWordForCalculator={onSelectWordForCalculator} />
          )}

          {mainTab === "lexicon" && (
            <div className="space-y-4">
              {/* Lexicon Search & Filter */}
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Αναζήτηση λήμματος, όρου, ετυμολογίας..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/60 focus:border-amber-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {[
                    { id: "all", label: "Όλα" },
                    { id: "metaphysics", label: "Μεταφυσική" },
                    { id: "etymology", label: "Ετυμολογία" },
                    { id: "isopsephy", label: "Ισοψηφία" },
                    { id: "cosmology", label: "Κοσμολογία" },
                    { id: "mythology", label: "Μυθολογία" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === tab.id
                          ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                          : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-zinc-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entries List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="p-4 rounded-xl border border-zinc-800 hover:border-amber-500/50 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all cursor-pointer flex flex-col justify-between group shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                            {entry.categoryName}
                          </span>
                          {entry.isopsephicValue && (
                            <span className="text-[10px] font-mono text-zinc-400 font-bold">
                              = {entry.isopsephicValue}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mb-1">
                        {entry.term}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3 mb-3">
                        {entry.definition}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-zinc-950 text-[10px] text-zinc-400 border border-zinc-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-amber-400 group-hover:underline">
                        Ανάλυση ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Entry Detail View */}
        {selectedEntry && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-[#0d0d18] border border-amber-500/50 rounded-2xl p-6 shadow-2xl text-zinc-100 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <Scroll className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-100">
                    {selectedEntry.term}
                  </h3>
                  <div className="text-xs text-amber-400/90 font-medium">
                    {selectedEntry.categoryName} {selectedEntry.isopsephicValue ? `• Ισοψηφία: ${selectedEntry.isopsephicValue}` : ""}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Ορισμός & Έννοια
                </h4>
                {selectedEntry.definition}
              </div>

              <div className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ετυμολογική Αποκρυπτογράφηση
                </h4>
                {selectedEntry.etymologicalAnalysis}
              </div>

              <div className="bg-purple-950/20 p-3.5 rounded-xl border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed">
                <h4 className="font-bold text-purple-400 uppercase tracking-wider mb-1">
                  Φιλοσοφική & Μεταφυσική Σημασία
                </h4>
                {selectedEntry.philosophicalSignificance}
              </div>

              {selectedEntry.biblicalOrClassicalSources.length > 0 && (
                <div className="text-[11px] text-zinc-400">
                  <span className="font-bold text-zinc-300">Πηγές / Αναφορές: </span>
                  {selectedEntry.biblicalOrClassicalSources.join(" • ")}
                </div>
              )}

              {onSelectWordForCalculator && selectedEntry.isopsephicValue && (
                <button
                  onClick={() => {
                    const word = selectedEntry.greekTerm.split(" ")[0].replace(/[^Α-Ωα-ωΆ-Ώά-ώ]/g, "");
                    onSelectWordForCalculator(word || selectedEntry.term);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Άνοιγμα στον Υπολογιστή Λεξαρίθμων
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
