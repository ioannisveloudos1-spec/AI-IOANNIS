import React, { useState } from "react";
import { ANCIENT_SYMBOLS_DATA, AncientSymbolItem } from "../data/ancientSymbols";
import { Sparkles, Search, Copy, Check, Filter, Layers, BookOpen, Hash } from "lucide-react";

export const AncientSymbolsTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSymbol, setSelectedSymbol] = useState<AncientSymbolItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (sym: AncientSymbolItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sym.symbol);
    setCopiedId(sym.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSymbols = ANCIENT_SYMBOLS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q) ||
      String(item.numericalValue).toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.philosophicalMeaning.toLowerCase().includes(q) ||
      item.eraAndOrigin.toLowerCase().includes(q) ||
      (item.alternativeSymbols && item.alternativeSymbols.some((s) => s.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#17130f] border border-[#382b1d] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#261c12] border border-[#c89b3c]/60 flex items-center justify-center text-[#e6c670]">
              <Sparkles className="w-5 h-5 text-[#e6c670]" />
            </div>
            <div>
              <div className="text-[11px] font-serif uppercase tracking-widest text-[#c89b3c] font-bold">
                Επιγραφική, Αρχαϊκή Αριθμητική & Ιερή Γεωμετρία
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#f5ecd8]">
                Πίνακας Αρχαίων Συμβόλων, Επισήμων & Ιδεογραμμάτων
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-[#221810] border border-[#3e2c1a] text-xs font-mono text-[#e6c670] self-start sm:self-auto">
            {filteredSymbols.length} / {ANCIENT_SYMBOLS_DATA.length} Σύμβολα
          </span>
        </div>
        <p className="text-xs sm:text-sm font-serif text-[#c5b59e] leading-relaxed">
          Αναλυτικός επεξηγηματικός πίνακας των αρχαϊκών γραμμάτων (<em>Δίγαμμα/Βαυ, Κόππα, Σαμπί, Σαν, Δασύ Ήτα</em>), των ακροφωνικών μνημειακών συμβόλων (<em>Μονάδες, Πεντάδες, Δεκάδες, Εκατοντάδες, Χιλιάδες</em>) και των ιερών γεωμετρικών ιδεογραμμάτων (<em>Τρισκέλιον, Κόμπος Ηρακλέους, Μαίανδρος, Δελφικό ΕΙ, Τετρακτύς, Ουροβόρος</em>).
        </p>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-[#291f15]">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8c7e6c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Αναζήτηση συμβόλου, ονόματος, αξίας (π.χ. Ϝ, 90, Κόππα, Τρισκέλιον, 666)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#100d0a] border border-[#302316] focus:border-[#c89b3c] text-xs text-[#f5ecd8] placeholder-[#706050] outline-none font-serif"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Όλα (18)" },
              { id: "archaic_letters", label: "Αρχαϊκά Γράμματα" },
              { id: "acrophonic", label: "Ακροφωνικά (Ηρωδιανικά)" },
              { id: "sacred_ideograms", label: "Ιερά Ιδεογράμματα" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#c89b3c] text-[#120f0c] font-bold shadow-md shadow-[#c89b3c]/20"
                    : "bg-[#14100c] text-[#a69680] border border-[#2b2015] hover:border-[#c89b3c]/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Symbol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSymbols.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedSymbol(item)}
            className="p-4 rounded-2xl bg-[#14100c] border border-[#2d2217] hover:border-[#c89b3c]/70 transition-all shadow-md hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            {/* Top Bar: Symbol Display + Value + Copy */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#1c150e] border-2 border-[#3d2b1a] group-hover:border-[#c89b3c] flex items-center justify-center text-3xl font-serif font-bold text-[#e6c670] shadow-inner transition-colors">
                  {item.symbol}
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#f5ecd8] group-hover:text-[#ffd700] transition-colors leading-tight">
                    {item.name}
                  </h4>
                  <div className="text-[10px] font-sans text-[#8c7a68] mt-0.5">
                    {item.categoryLabel}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded bg-[#24180e] border border-[#442c19] text-xs font-mono font-bold text-[#ffd700]">
                  = {item.numericalValue}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleCopy(item, e)}
                  title="Αντιγραφή συμβόλου"
                  className="p-1 rounded-md bg-[#19120b] hover:bg-[#2e2013] border border-[#332213] text-[#a69680] hover:text-[#ffd700] transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Details */}
            <div className="p-2.5 rounded-xl bg-[#0e0b08] border border-[#221910] space-y-1.5 text-xs font-serif">
              {item.phoneticSound && (
                <div className="text-[11px] text-[#c5b59e]">
                  <strong className="text-[#c89b3c]">Ήχος:</strong> {item.phoneticSound}
                </div>
              )}
              {item.formationFormula && (
                <div className="text-[11px] text-[#c5b59e]">
                  <strong className="text-[#c89b3c]">Σχηματισμός:</strong> {item.formationFormula}
                </div>
              )}
              <p className="text-[#a69680] text-[11px] line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Tag & Click prompt */}
            <div className="flex items-center justify-between text-[10px] text-[#736352] font-serif pt-1 border-t border-[#201810]">
              <span>{item.eraAndOrigin}</span>
              <span className="text-[#c89b3c] font-sans group-hover:underline">Λεπτομέρειες →</span>
            </div>
          </div>
        ))}
      </div>

      {filteredSymbols.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-[#14100c] border border-[#2b2015] text-[#a69680] font-serif text-sm">
          Δεν βρέθηκαν σύμβολα που να ταιριάζουν με την αναζήτηση «{searchQuery}».
        </div>
      )}

      {/* Comprehensive Comparative Table View */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#14100c] border border-[#2d2217] space-y-4">
        <h4 className="text-sm font-serif font-bold text-[#e6c670] flex items-center gap-2 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-[#c89b3c]" />
          <span>Συνοπτικός Συγκριτικός Πίνακας Συμβόλων & Αριθμητικών Αξιών</span>
        </h4>

        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left text-xs font-serif border-collapse">
            <thead>
              <tr className="border-b border-[#332517] text-[#c89b3c] text-[11px] uppercase tracking-wider bg-[#1c150e]">
                <th className="p-2.5">Σύμβολο</th>
                <th className="p-2.5">Ονομασία</th>
                <th className="p-2.5">Κατηγορία</th>
                <th className="p-2.5">Αριθμητική Αξία</th>
                <th className="p-2.5">Φωνητική / Τύπος</th>
                <th className="p-2.5">Unicode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#241a10]">
              {ANCIENT_SYMBOLS_DATA.map((s) => (
                <tr
                  key={`table-${s.id}`}
                  onClick={() => setSelectedSymbol(s)}
                  className="hover:bg-[#1f160e] transition-colors cursor-pointer"
                >
                  <td className="p-2.5 text-lg font-bold text-[#ffd700]">{s.symbol}</td>
                  <td className="p-2.5 font-bold text-[#f5ecd8]">{s.name}</td>
                  <td className="p-2.5 text-[#a69680]">{s.categoryLabel}</td>
                  <td className="p-2.5 font-mono font-bold text-[#e6c670]">{s.numericalValue}</td>
                  <td className="p-2.5 text-[#c5b59e]">{s.phoneticSound || s.formationFormula || "—"}</td>
                  <td className="p-2.5 font-mono text-[10px] text-[#736352]">{s.unicodeHex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail View */}
      {selectedSymbol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#14100c] border-2 border-[#c89b3c] rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto gold-scrollbar space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#2d2217] pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1f150d] border-2 border-[#c89b3c] flex items-center justify-center text-4xl font-serif font-bold text-[#ffd700] shadow-xl">
                  {selectedSymbol.symbol}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#f5ecd8]">
                    {selectedSymbol.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#a69680] mt-1">
                    <span>Αξία: <strong className="text-[#ffd700]">{selectedSymbol.numericalValue}</strong></span>
                    <span>•</span>
                    <span className="text-[#c89b3c] font-serif">{selectedSymbol.categoryLabel}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSymbol(null)}
                className="w-8 h-8 rounded-full bg-[#20160d] hover:bg-[#382617] text-[#a69680] hover:text-[#f5ecd8] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Alternative Forms & Phonetics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif">
              {selectedSymbol.alternativeSymbols && (
                <div className="p-3 rounded-xl bg-[#1a130c] border border-[#2d2014] space-y-1">
                  <span className="text-[11px] text-[#c89b3c] font-bold">Εναλλακτικές Μορφές:</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {selectedSymbol.alternativeSymbols.map((alt, aIdx) => (
                      <span key={aIdx} className="px-2 py-0.5 rounded bg-[#100b07] border border-[#3b291a] text-xs font-mono text-[#ffd700]">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#1a130c] border border-[#2d2014] space-y-1">
                <span className="text-[11px] text-[#c89b3c] font-bold">Προέλευση & Εποχή:</span>
                <p className="text-[#d6c7b2]">{selectedSymbol.eraAndOrigin}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 font-serif">
              <h4 className="text-xs font-bold text-[#c89b3c] uppercase tracking-wider">
                Ιστορική & Γραμματολογική Περιγραφή
              </h4>
              <p className="text-xs sm:text-sm text-[#d6c7b2] leading-relaxed">
                {selectedSymbol.description}
              </p>
            </div>

            {/* Philosophical Meaning */}
            <div className="p-4 rounded-2xl bg-[#1a140d] border border-[#3d2a18] space-y-1.5 font-serif">
              <h4 className="text-xs font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                Φιλοσοφικός & Μυστικιστικός Συμβολισμός
              </h4>
              <p className="text-xs sm:text-sm text-[#f5ecd8] leading-relaxed">
                {selectedSymbol.philosophicalMeaning}
              </p>
            </div>

            {/* Historical Examples */}
            <div className="space-y-1.5 font-serif">
              <h4 className="text-xs font-bold text-[#8c7a68] uppercase tracking-wider">
                Αρχαία Παραδείγματα & Επιγραφές
              </h4>
              <p className="text-xs text-[#a69680] italic">
                {selectedSymbol.historicalExamples}
              </p>
            </div>

            {/* Unicode hex & Copy button */}
            <div className="pt-3 border-t border-[#291e14] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#736352]">
                Unicode: {selectedSymbol.unicodeHex}
              </span>
              <button
                type="button"
                onClick={(e) => handleCopy(selectedSymbol, e)}
                className="px-3.5 py-1.5 rounded-xl bg-[#c89b3c] hover:bg-[#e6c670] text-[#120f0c] font-serif font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Αντιγραφή ({selectedSymbol.symbol})</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
