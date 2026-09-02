import React, { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  Quote,
  Copy,
  Check,
  BookMarked,
  Shield,
  Crown,
  Scroll,
  Tag,
  ExternalLink
} from "lucide-react";
import { GREEK_ANTHOLOGY, AnthologyEntity } from "../../data/greekAnthology";

interface GreekAnthologyViewProps {
  onSelectWordForCalculator?: (word: string) => void;
}

export const GreekAnthologyView: React.FC<GreekAnthologyViewProps> = ({
  onSelectWordForCalculator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedQuoteIdx, setCopiedQuoteIdx] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<AnthologyEntity | null>(null);

  const filteredEntities = useMemo(() => {
    return GREEK_ANTHOLOGY.filter((item) => {
      const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.ancientName.toLowerCase().includes(q) ||
        item.epithet.toLowerCase().includes(q) ||
        item.eraOrDomain.toLowerCase().includes(q) ||
        item.esotericMeaning.toLowerCase().includes(q) ||
        item.quotes.some(
          (quote) =>
            quote.ancient.toLowerCase().includes(q) ||
            quote.translation.toLowerCase().includes(q) ||
            (quote.source && quote.source.toLowerCase().includes(q))
        ) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyQuote = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuoteIdx(id);
    setTimeout(() => setCopiedQuoteIdx(null), 2000);
  };

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Category Nav & Search */}
      <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση θεότητας, ήρωα, ρητού..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700/60 focus:border-amber-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "Όλα" },
            { id: "gods", label: "⚡ Θεοί Πάνθεον" },
            { id: "seven_sages", label: "🏛️ Επτά Σοφοί" },
            { id: "women_philosophers", label: "🌸 Ελληνίδες Σοφές" },
            { id: "philosophers", label: "📜 Φιλόσοφοι" },
            { id: "dramatists", label: "🎭 Δραματουργοί" },
            { id: "heroes", label: "🛡️ Ήρωες & Ηρωίδες" },
            { id: "leaders", label: "👑 Στρατηλάτες" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Anthology Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntities.map((entity) => (
          <div
            key={entity.id}
            className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/50 shadow-xl space-y-4 flex flex-col justify-between transition-all group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                      {entity.categoryName}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 font-bold">
                      Ισοψηφία: <strong className="text-amber-300">{entity.isopsephicValue}</strong>
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-zinc-100 group-hover:text-amber-300 transition-colors mt-1">
                    {entity.name}
                  </h3>
                  <div className="text-xs text-zinc-400 italic">{entity.epithet}</div>
                </div>

                <button
                  onClick={() => {
                    const plainName = entity.ancientName.split(" ")[0].replace(/[^Α-Ωα-ωίϊΐόάέύϋΰήώ]/g, "");
                    onSelectWordForCalculator?.(plainName || entity.ancientName);
                  }}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 border border-zinc-800 transition-colors cursor-pointer"
                  title="Υπολογισμός Ισοψηφίας"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

              {/* Domain */}
              <div className="text-[11px] font-mono text-zinc-400 mb-3 bg-black/40 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                🏛️ {entity.eraOrDomain}
              </div>

              {/* Quotes */}
              <div className="space-y-3">
                {entity.quotes.map((quote, qIdx) => {
                  const quoteId = `${entity.id}_q_${qIdx}`;
                  const isCopied = copiedQuoteIdx === quoteId;

                  return (
                    <div
                      key={qIdx}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 relative group/quote"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-serif italic text-amber-200 leading-snug font-medium">
                          {quote.ancient}
                        </div>
                        <button
                          onClick={() => handleCopyQuote(quote.ancient, quoteId)}
                          className="p-1 rounded text-zinc-500 hover:text-amber-300 transition-colors cursor-pointer flex-shrink-0"
                          title="Αντιγραφή ρητού"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="text-[11px] text-zinc-300 leading-relaxed">
                        ↳ {quote.translation}
                      </div>

                      {quote.source && (
                        <div className="text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/50 flex justify-between">
                          <span>{quote.source}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Esoteric Meaning */}
              <div className="mt-3 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-zinc-300 leading-relaxed">
                <strong className="text-amber-400">Εσωτερική Σημασία:</strong> {entity.esotericMeaning}
              </div>
            </div>

            {/* Tags & Attributes */}
            <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px]">
              <div className="flex flex-wrap gap-1">
                {entity.attributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    • {attr}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {entity.tags.slice(0, 2).map((t, idx) => (
                  <span key={idx} className="text-amber-400/80 font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
