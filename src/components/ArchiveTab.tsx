import React, { useState, useMemo } from "react";
import { SavedIsopsephyItem } from "../types";
import { HISTORICAL_ISOPSEPHIES, HistoricalIsopsephyEntry } from "../data/historicalIsopsephies";
import { numberToGreekNumeral, getMathematicalProperties, calculateWordIsopsephy, cleanAndNormalizePolytonic } from "../utils/isopsephy";
import { Search, Bookmark, Trash2, Download, Upload, Sparkles, Scale, BookOpen, Layers, Check, Copy, ExternalLink, Plus, Folder, Hash, ArrowUpDown, ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp10, Clock, LayoutGrid, ListFilter } from "lucide-react";

type SortOption = "value_desc" | "value_asc" | "alpha_asc" | "alpha_desc" | "date_desc" | "date_asc" | "count_desc";
type ViewMode = "folders" | "flat";

interface ArchiveTabProps {
  savedItems: SavedIsopsephyItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onImportItems: (items: SavedIsopsephyItem[]) => void;
  onSaveItem: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
}

export const ArchiveTab: React.FC<ArchiveTabProps> = ({
  savedItems,
  onDeleteItem,
  onClearAll,
  onImportItems,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"saved" | "classical" | "compare">("saved");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("value_desc");
  const [viewMode, setViewMode] = useState<ViewMode>("folders");
  const [compareItemIds, setCompareItemIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New item modal or inline state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>("");
  const [newNotes, setNewNotes] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Προσωπικό");

  // Filtered and sorted saved items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = savedItems.filter((item) => {
      const matchQuery =
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.value.toString().includes(searchTerm) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchCat =
        selectedCategory === "all" ||
        (selectedCategory === "words" && !item.isPhrase) ||
        (selectedCategory === "phrases" && item.isPhrase) ||
        item.category === selectedCategory;

      return matchQuery && matchCat;
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "value_desc":
          return b.value - a.value || a.text.localeCompare(b.text, "el");
        case "value_asc":
          return a.value - b.value || a.text.localeCompare(b.text, "el");
        case "alpha_asc":
          return a.text.localeCompare(b.text, "el") || b.value - a.value;
        case "alpha_desc":
          return b.text.localeCompare(a.text, "el") || b.value - a.value;
        case "date_desc":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "date_asc":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case "count_desc":
          return (b.wordCount || 1) - (a.wordCount || 1) || b.value - a.value;
        default:
          return b.value - a.value;
      }
    });
  }, [savedItems, searchTerm, selectedCategory, sortOption]);

  // Group saved items by Isopsephy Number
  const groupedByNumber = useMemo(() => {
    const map = new Map<number, SavedIsopsephyItem[]>();
    for (const item of filteredAndSortedItems) {
      const list = map.get(item.value) || [];
      list.push(item);
      map.set(item.value, list);
    }
    
    // Sort groups according to selected sortOption
    const entries = Array.from(map.entries());
    return entries.sort((a, b) => {
      const valA = a[0];
      const valB = b[0];
      const itemsA = a[1];
      const itemsB = b[1];

      switch (sortOption) {
        case "value_desc":
          return valB - valA;
        case "value_asc":
          return valA - valB;
        case "alpha_asc": {
          const firstA = itemsA[0]?.text || "";
          const firstB = itemsB[0]?.text || "";
          return firstA.localeCompare(firstB, "el");
        }
        case "alpha_desc": {
          const firstA = itemsA[0]?.text || "";
          const firstB = itemsB[0]?.text || "";
          return firstB.localeCompare(firstA, "el");
        }
        case "count_desc":
          return itemsB.length - itemsA.length || valB - valA;
        case "date_desc": {
          const latestA = Math.max(...itemsA.map((i) => new Date(i.createdAt || 0).getTime()));
          const latestB = Math.max(...itemsB.map((i) => new Date(i.createdAt || 0).getTime()));
          return latestB - latestA;
        }
        case "date_asc": {
          const earliestA = Math.min(...itemsA.map((i) => new Date(i.createdAt || 0).getTime()));
          const earliestB = Math.min(...itemsB.map((i) => new Date(i.createdAt || 0).getTime()));
          return earliestA - earliestB;
        }
        default:
          return valB - valA;
      }
    });
  }, [filteredAndSortedItems, sortOption]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedItems, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lexarithmos_archive_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportItems(parsed);
        }
      } catch (err) {
        console.error("Failed to parse JSON file", err);
      }
    };
    reader.readAsText(file);
  };

  const toggleCompare = (id: string) => {
    setCompareItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const cleaned = cleanAndNormalizePolytonic(newText.trim());
    const words = cleaned.split(/\s+/).filter(Boolean);
    let totalValue = 0;
    let root = 1;

    for (const w of words) {
      const calc = calculateWordIsopsephy(w);
      totalValue += calc.value;
    }

    const mathProps = getMathematicalProperties(totalValue);
    root = mathProps.pythmen;
    const greekNum = numberToGreekNumeral(totalValue);

    onSaveItem({
      text: cleaned,
      normalized: cleaned.toUpperCase(),
      value: totalValue,
      root: root,
      greekNumeral: greekNum || `${totalValue}`,
      isPhrase: words.length > 1,
      wordCount: words.length,
      category: newCategory,
      notes: newNotes || `Χειροκίνητη καταχώριση (${words.length} ${words.length === 1 ? "λέξη" : "λέξεις"})`,
    });

    setNewText("");
    setNewNotes("");
    setShowAddModal(false);
  };

  // Compare items details
  const compareItems = savedItems.filter((item) => compareItemIds.includes(item.id));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181512] border border-[#2d251e] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
            <span>Σελίδες & Αρχείο Λεξαρίθμων</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#2a2219] text-[#c89b3c] border border-[#4a3a29] font-mono">
              {savedItems.length} αποθηκευμένα
            </span>
          </h2>
          <p className="text-xs text-[#a69680] mt-0.5">
            Ομαδοποίηση λέξεων και φράσεων κατά ισοψηφικό άθροισμα, ιστορικές αναφορές και σύγκριση λεξαριθμικών συσχετισμών.
          </p>
        </div>

        {/* Sub-tabs & JSON Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-[#12100e] p-1 rounded-xl border border-[#2d251e]">
            <button
              onClick={() => setActiveSubTab("saved")}
              id="subtab-archive-saved"
              className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors ${
                activeSubTab === "saved"
                  ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40 font-bold"
                  : "text-[#8c7e6c] hover:text-[#e8dfd1]"
              }`}
            >
              Αρχείο μου ({savedItems.length})
            </button>
            <button
              onClick={() => setActiveSubTab("classical")}
              id="subtab-archive-classical"
              className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors ${
                activeSubTab === "classical"
                  ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40 font-bold"
                  : "text-[#8c7e6c] hover:text-[#e8dfd1]"
              }`}
            >
              Κλασική Βιβλιοθήκη
            </button>
            {compareItemIds.length > 0 && (
              <button
                onClick={() => setActiveSubTab("compare")}
                id="subtab-archive-compare"
                className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors ${
                  activeSubTab === "compare"
                    ? "bg-[#282116] text-[#e6c670] border border-[#c89b3c]/40 font-bold"
                    : "text-emerald-400 hover:text-emerald-300"
                }`}
              >
                Σύγκριση ({compareItemIds.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportJSON}
              id="btn-export-archive-json"
              className="p-2 rounded-xl bg-[#1c1813] hover:bg-[#28221a] border border-[#332a20] text-[#a69680] hover:text-[#f5ecd8] text-xs transition-colors"
              title="Εξαγωγή JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              htmlFor="import-archive-json-input"
              className="p-2 rounded-xl bg-[#1c1813] hover:bg-[#28221a] border border-[#332a20] text-[#a69680] hover:text-[#f5ecd8] text-xs transition-colors cursor-pointer"
              title="Εισαγωγή JSON"
            >
              <Upload className="w-4 h-4" />
              <input
                id="import-archive-json-input"
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 1. SAVED ITEMS TAB */}
      {activeSubTab === "saved" && (
        <div className="space-y-6">
          
          {/* Search & Category Filter Bar */}
          <div className="p-4 rounded-xl bg-[#14120f] border border-[#2d251e] flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#8c7e6c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Αναζήτηση με λέξη ή λεξάριθμο (π.χ. 666, 888, ΙΗΣΟΥΣ)..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0e0c0a] border border-[#332a20] rounded-lg text-xs font-serif text-[#f5ecd8] placeholder-[#6b5f51] outline-none focus:border-[#c89b3c]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* View Mode Switcher */}
                <div className="flex bg-[#0e0c0a] p-1 rounded-lg border border-[#2a2218]" title="Προβολή">
                  <button
                    onClick={() => setViewMode("folders")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-serif transition-colors ${
                      viewMode === "folders"
                        ? "bg-[#251e17] text-[#e6c670] font-bold shadow-sm"
                        : "text-[#8c7e6c] hover:text-[#d6c7b2]"
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Φάκελοι</span>
                  </button>
                  <button
                    onClick={() => setViewMode("flat")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-serif transition-colors ${
                      viewMode === "flat"
                        ? "bg-[#251e17] text-[#e6c670] font-bold shadow-sm"
                        : "text-[#8c7e6c] hover:text-[#d6c7b2]"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Όλες οι Λέξεις</span>
                  </button>
                </div>

                {/* Sort Option Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#0e0c0a] px-2.5 py-1 rounded-lg border border-[#2a2218] text-xs font-serif text-[#d6c7b2]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#c89b3c]" />
                  <span className="text-[#8c7e6c] text-[11px] hidden md:inline">Ταξινόμηση:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-transparent text-[#e6c670] font-serif text-xs outline-none cursor-pointer pr-1"
                  >
                    <option value="value_desc" className="bg-[#181410] text-[#f5ecd8]">Τιμή: Φθίνουσα (9999→1)</option>
                    <option value="value_asc" className="bg-[#181410] text-[#f5ecd8]">Τιμή: Αύξουσα (1→9999)</option>
                    <option value="alpha_asc" className="bg-[#181410] text-[#f5ecd8]">Αλφαβητικά (Α → Ω)</option>
                    <option value="alpha_desc" className="bg-[#181410] text-[#f5ecd8]">Αλφαβητικά (Ω → Α)</option>
                    <option value="date_desc" className="bg-[#181410] text-[#f5ecd8]">Ημερομηνία: Νεότερα πρώτα</option>
                    <option value="date_asc" className="bg-[#181410] text-[#f5ecd8]">Ημερομηνία: Παλαιότερα πρώτα</option>
                    <option value="count_desc" className="bg-[#181410] text-[#f5ecd8]">Πλήθος Λέξεων</option>
                  </select>
                </div>

                <div className="flex bg-[#0e0c0a] p-1 rounded-lg border border-[#2a2218]">
                  {[
                    { id: "all", label: "Όλα" },
                    { id: "words", label: "Λέξεις" },
                    { id: "phrases", label: "Φράσεις" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-2.5 py-1 rounded text-xs font-serif transition-colors ${
                        selectedCategory === c.id
                          ? "bg-[#251e17] text-[#e6c670] font-bold"
                          : "text-[#8c7e6c] hover:text-[#d6c7b2]"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#271e14] hover:bg-[#382b1d] text-[#e6c670] text-xs font-serif border border-[#c89b3c]/40 font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Προσθήκη Λέξης</span>
                </button>

                {savedItems.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Είστε βέβαιοι ότι θέλετε να διαγράψετε όλα τα αποθηκευμένα στοιχεία;")) {
                        onClearAll();
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#201414] hover:bg-[#2e1c1c] text-red-300 text-xs font-serif border border-red-900/40 transition-colors"
                  >
                    Καθαρισμός
                  </button>
                )}
              </div>
            </div>

            {/* Quick Isopsephy Group Jump Pills */}
            {savedItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#211a14] text-[11px] font-mono text-[#8c7e6c]">
                <span className="font-serif text-[#a69680]">Φάκελοι Λεξαρίθμων:</span>
                {Array.from(new Set(savedItems.map((i) => i.value)))
                  .sort((a: number, b: number) => a - b)
                  .slice(0, 12)
                  .map((val) => (
                    <button
                      key={val}
                      onClick={() => setSearchTerm(val.toString())}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        searchTerm === val.toString()
                          ? "bg-[#c89b3c] text-black font-bold border-[#e6c670]"
                          : "bg-[#16120e] hover:bg-[#221b14] text-[#d6c7b2] border-[#2f251a]"
                      }`}
                    >
                      {val} <span className="text-[9px] text-[#8c7e6c]">({savedItems.filter((i) => i.value === val).length})</span>
                    </button>
                  ))}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-[10px] text-[#c89b3c] hover:underline ml-1 font-serif"
                  >
                    Εμφάνιση όλων
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content List: Folders vs Flat View */}
          {filteredAndSortedItems.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#14120f] border border-[#282119] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#201a14] border border-[#352a1d] text-[#c89b3c] flex items-center justify-center mx-auto text-xl font-serif">
                📖
              </div>
              <h4 className="text-base font-serif font-bold text-[#f5ecd8]">
                Δεν βρέθηκαν στοιχεία
              </h4>
              <p className="text-xs text-[#8c7e6c] max-w-md mx-auto">
                {searchTerm
                  ? `Δεν υπάρχει καταχώριση που να ταιριάζει με "${searchTerm}". Δοκιμάστε άλλον όρο ή αριθμό.`
                  : "Χρησιμοποιήστε τον Υπολογιστή ή την Αναζήτηση για να αποθηκεύσετε λέξεις και φράσεις με τους λεξαρίθμους τους."}
              </p>
            </div>
          ) : viewMode === "flat" ? (
            /* Flat List of All Items */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8c7e6c] px-1 font-serif">
                <span>Προβολή {filteredAndSortedItems.length} στοιχείων (Ενιαία Λίστα)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAndSortedItems.map((item) => {
                  const isCompared = compareItemIds.includes(item.id);
                  const greekNum = item.greekNumeral || numberToGreekNumeral(item.value);

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl bg-[#171410] border transition-all space-y-3 shadow-md ${
                        isCompared ? "border-emerald-500/60 bg-[#162217]" : "border-[#2d241b] hover:border-[#423425]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-lg font-serif font-bold text-[#f5ecd8] leading-tight block">
                            {item.text}
                          </span>
                          <span className="text-[10px] text-[#8c7e6c] font-mono">
                            {item.category} • {item.isPhrase ? `Φράση (${item.wordCount} λέξεις)` : "Λέξη"}
                          </span>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-lg font-serif font-black text-[#e6c670]">
                            {item.value.toLocaleString("el-GR")}
                          </span>
                          <span className="text-[10px] font-serif font-bold text-[#c89b3c]">
                            {greekNum} (Ρίζα: {item.root})
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-xs font-serif text-[#a69680] bg-[#100d0a] p-2 rounded border border-[#241c14] line-clamp-2">
                          {item.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-[#736655] border-t border-[#261e16]">
                        <button
                          onClick={() =>
                            onOpenAiModal(item.text, item.value, [item.text])
                          }
                          className="flex items-center gap-1 text-[10px] text-[#c89b3c] hover:text-[#f5ecd8] font-serif transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Ανάλυση</span>
                        </button>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleCompare(item.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-serif transition-colors ${
                              isCompared
                                ? "bg-emerald-800 text-emerald-100"
                                : "bg-[#251e16] text-[#a69680] hover:text-[#f5ecd8]"
                            }`}
                            title="Προσθήκη στη σύγκριση"
                          >
                            {isCompared ? "✓ Σύγκριση" : "+ Σύγκριση"}
                          </button>

                          <button
                            onClick={() => handleCopyText(`${item.text} = ${item.value}`, item.id)}
                            className="p-1 rounded bg-[#251e16] hover:bg-[#33281d] text-[#a69680]"
                            title="Αντιγραφή"
                          >
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>

                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="text-[#6e5f50] hover:text-red-400 transition-colors p-1"
                            title="Διαγραφή"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Folders View Grouped by Isopsephy */
            <div className="space-y-6">
              {groupedByNumber.map(([numberVal, items]) => {
                const greekNum = numberToGreekNumeral(numberVal);
                const mathProps = getMathematicalProperties(numberVal);

                return (
                  <div
                    key={numberVal}
                    className="rounded-2xl bg-[#15120f] border border-[#2d251e] p-5 space-y-4 shadow-lg shadow-black/20"
                  >
                    {/* Group Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#241d16] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f7e0aa] via-[#e6c670] to-[#c89b3c]">
                          {numberVal.toLocaleString("el-GR")}
                        </span>
                        {greekNum && (
                          <span className="text-sm font-serif font-bold text-[#e6c670] bg-[#221c15] px-2.5 py-0.5 rounded-md border border-[#3e3223]">
                            {greekNum}
                          </span>
                        )}
                        <span className="text-xs font-mono text-[#8c7e6c]">
                          (Πυθμένας: {mathProps.pythmen})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif text-[#a69680]">
                          {items.length} {items.length === 1 ? "στοιχείο" : "στοιχεία"}
                        </span>
                        <button
                          onClick={() =>
                            onOpenAiModal(
                              items.map((i) => i.text).join(", "),
                              numberVal,
                              items.map((i) => i.text)
                            )
                          }
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#221b14] hover:bg-[#30261a] border border-[#c89b3c]/40 text-xs text-[#e6c670] font-medium transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Ερμηνεία Ομάδας</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Grid inside Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.map((item) => {
                        const isCompared = compareItemIds.includes(item.id);

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-xl bg-[#1a1612] border transition-all space-y-2.5 ${
                              isCompared ? "border-emerald-500/50 bg-[#162217]" : "border-[#2b2219] hover:border-[#3d3023]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-base font-serif font-bold text-[#f5ecd8] leading-tight">
                                {item.text}
                              </span>
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="text-[#6e5f50] hover:text-red-400 transition-colors p-1"
                                title="Διαγραφή"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {item.notes && (
                              <p className="text-xs font-serif text-[#8c7e6c] line-clamp-2">
                                {item.notes}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#736655] border-t border-[#261e16]">
                              <span>{item.isPhrase ? `Φράση (${item.wordCount} λέξεις)` : "Μεμονωμένη"}</span>
                              
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleCompare(item.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-serif transition-colors ${
                                    isCompared
                                      ? "bg-emerald-800 text-emerald-100"
                                      : "bg-[#251e16] text-[#a69680] hover:text-[#f5ecd8]"
                                  }`}
                                  title="Προσθήκη στη σύγκριση"
                                >
                                  {isCompared ? "✓ Σύγκριση" : "+ Σύγκριση"}
                                </button>

                                <button
                                  onClick={() => handleCopyText(`${item.text} = ${item.value}`, item.id)}
                                  className="p-1 rounded bg-[#251e16] hover:bg-[#33281d] text-[#a69680]"
                                  title="Αντιγραφή"
                                >
                                  {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* 2. CLASSICAL LIBRARY TAB */}
      {activeSubTab === "classical" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#161310] border border-[#2d251e] text-xs text-[#a69680] leading-relaxed">
            <strong className="text-[#f5ecd8] font-serif">Αρχαία Ελληνική & Βιβλική Ισοψηφία: </strong>
            Συλλογή από τις πιο διάσημες ιστορικές ισοψηφίες της αρχαιότητας, της πρώιμης χριστιανικής γραμματείας και των Πυθαγορείων.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HISTORICAL_ISOPSEPHIES.map((entry) => (
              <div
                key={entry.value}
                className="p-5 rounded-2xl bg-[#15120f] border border-[#2d251e] space-y-4 shadow-lg shadow-black/20"
              >
                <div className="flex items-center justify-between border-b border-[#261f18] pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#8c7e6c] font-mono">
                      Λεξάριθμος
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-serif font-black text-[#e6c670]">
                        {entry.value}
                      </span>
                      <span className="text-sm font-serif font-bold text-[#c89b3c] bg-[#221c15] px-2 py-0.5 rounded border border-[#3e3223]">
                        {entry.greekNumeral}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-serif font-bold text-[#f5ecd8] block">
                      {entry.title}
                    </span>
                    <span className="text-[11px] font-mono text-[#8c7e6c]">
                      Πυθμένας: {entry.pythmen}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {entry.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-3 rounded-xl bg-[#191511] border border-[#2b2219] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-serif font-bold text-[#f5ecd8]">
                          {item.word}
                        </span>
                        <button
                          onClick={() => {
                            onSaveItem({
                              text: item.word,
                              normalized: item.word.toUpperCase(),
                              value: entry.value,
                              root: entry.pythmen,
                              greekNumeral: entry.greekNumeral,
                              isPhrase: item.word.includes(" "),
                              wordCount: item.word.split(" ").length,
                              sourceText: entry.title,
                              notes: `${item.description} (${item.breakdown})`,
                              category: "Κλασική Ισοψηφία",
                            });
                          }}
                          className="text-[11px] font-serif text-[#c89b3c] hover:text-[#f5ecd8] flex items-center gap-1"
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Αποθήκευση</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#a69680] font-serif">
                        {item.description}
                      </p>
                      <div className="text-[10px] font-mono text-[#736655]">
                        {item.breakdown}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COMPARISON TAB */}
      {activeSubTab === "compare" && compareItems.length > 0 && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#14120f] border border-[#2d251e] flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-[#f5ecd8]">
              Σύγκριση {compareItems.length} επιλεγμένων λεξαρίθμων
            </span>
            <button
              onClick={() => setCompareItemIds([])}
              className="text-xs text-[#8c7e6c] hover:text-[#e8dfd1]"
            >
              Εκκαθάριση σύγκρισης
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {compareItems.map((item) => {
              const mathProps = getMathematicalProperties(item.value);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#161310] border border-[#3e3223] space-y-4"
                >
                  <div className="border-b border-[#29221a] pb-2">
                    <span className="text-lg font-serif font-bold text-[#f5ecd8] block">
                      {item.text}
                    </span>
                    <span className="text-2xl font-serif font-black text-[#e6c670]">
                      {item.value} ({numberToGreekNumeral(item.value)})
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-[#a69680]">
                    <div className="flex justify-between">
                      <span>Πυθμένας:</span>
                      <strong className="text-[#f5ecd8]">{mathProps.pythmen}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Τύπος:</span>
                      <span className="text-[#f5ecd8]">{mathProps.isEven ? "Άρτιος" : "Περιττός"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Πρώτος:</span>
                      <span className={mathProps.isPrime ? "text-emerald-400" : "text-[#736655]"}>
                        {mathProps.isPrime ? "Ναι" : "Όχι"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Τρίγωνος:</span>
                      <span className={mathProps.isTriangular ? "text-amber-400" : "text-[#736655]"}>
                        {mathProps.isTriangular ? `T${mathProps.triangularRoot}` : "Όχι"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAiModal(item.text, item.value, [item.text])}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#251e16] hover:bg-[#33281d] border border-[#c89b3c]/40 text-xs text-[#e6c670] font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Ερμηνεία</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
