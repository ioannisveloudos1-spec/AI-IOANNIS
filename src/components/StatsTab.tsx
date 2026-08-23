import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  analyzeGreekText,
  numberToGreekNumeral,
  getMathematicalProperties,
} from "../utils/isopsephy";
import { PRESET_TEXTS } from "../data/presets";
import { SavedIsopsephyItem } from "../types";
import {
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles,
  TrendingUp,
  Hash,
  Activity,
  Award,
  ArrowLeft,
  Calculator,
} from "lucide-react";

interface StatsTabProps {
  currentSearchText?: string;
  savedItems?: SavedIsopsephyItem[];
  onOpenAiModal: (text: string, number: number, words: string[]) => void;
  onNavigateToCalculator?: (word?: string) => void;
}

const PYTHMEN_COLORS = [
  "#d97706", // 1 - Amber
  "#2563eb", // 2 - Blue
  "#16a34a", // 3 - Green
  "#dc2626", // 4 - Red
  "#9333ea", // 5 - Purple
  "#0891b2", // 6 - Cyan
  "#c026d3", // 7 - Fuchsia
  "#ea580c", // 8 - Orange
  "#eab308", // 9 - Gold
];

export const StatsTab: React.FC<StatsTabProps> = ({
  currentSearchText = "",
  savedItems = [],
  onOpenAiModal,
  onNavigateToCalculator,
}) => {
  const [selectedSource, setSelectedSource] = useState<"current" | "preset" | "archive" | "custom">(
    currentSearchText.trim() ? "current" : "preset"
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_TEXTS[0]?.id || "john-1");
  const [customInputText, setCustomInputText] = useState<string>(
    "Ἐν ἀρχῇ ἦν ὁ Λόγος, καὶ ὁ Λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ Λόγος."
  );

  // Active text to analyze
  const activeText = useMemo(() => {
    if (selectedSource === "current") {
      return currentSearchText.trim() || PRESET_TEXTS[0].text;
    }
    if (selectedSource === "preset") {
      const found = PRESET_TEXTS.find((p) => p.id === selectedPresetId);
      return found ? found.text : PRESET_TEXTS[0].text;
    }
    if (selectedSource === "archive") {
      return (savedItems || []).map((item) => item.text).join(" ");
    }
    return customInputText;
  }, [selectedSource, currentSearchText, selectedPresetId, savedItems, customInputText]);

  // Analysis result
  const analysis = useMemo(() => {
    return analyzeGreekText(activeText);
  }, [activeText]);

  const { stats, words, uniqueWordsMap } = analysis;

  // 1. Distribution of Isopsephy Values by Range (Bar Chart)
  const rangeDistributionData = useMemo(() => {
    const buckets = [
      { range: "1–100", min: 1, max: 100, count: 0 },
      { range: "101–300", min: 101, max: 300, count: 0 },
      { range: "301–600", min: 301, max: 600, count: 0 },
      { range: "601–1000", min: 601, max: 1000, count: 0 },
      { range: "1001–1500", min: 1001, max: 1500, count: 0 },
      { range: "1500+", min: 1501, max: Infinity, count: 0 },
    ];

    words.forEach((w) => {
      const b = buckets.find((bucket) => w.value >= bucket.min && w.value <= bucket.max);
      if (b) b.count += 1;
    });

    return buckets.map((b) => ({
      name: b.range,
      πλήθος: b.count,
    }));
  }, [words]);

  // 2. Pythagorean Pythmen (1-9) Distribution (Pie/Donut Chart)
  const pythmenDistributionData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // roots 1 to 9
    words.forEach((w) => {
      if (w.root >= 1 && w.root <= 9) {
        counts[w.root - 1]++;
      }
    });

    return counts.map((count, idx) => ({
      name: `Πυθμένας ${idx + 1}`,
      root: idx + 1,
      value: count,
      color: PYTHMEN_COLORS[idx],
    })).filter((item) => item.value > 0);
  }, [words]);

  // 3. Top Words with Highest / Most Frequent Isopsephy
  const topWordsByFrequency = useMemo(() => {
    const list: Array<{ count: number; value: number; raw: string; root: number }> = Array.from(uniqueWordsMap.values());
    list.sort((a, b) => b.count - a.count || b.value - a.value);
    return list.slice(0, 8).map((item) => ({
      word: item.raw,
      συχνότητα: item.count,
      λεξάριθμος: item.value,
      root: item.root,
    }));
  }, [uniqueWordsMap]);

  // 4. Parity & Math Properties Breakdown
  const mathStats = useMemo(() => {
    let evens = 0;
    let odds = 0;
    let primes = 0;
    let triangulars = 0;

    words.forEach((w) => {
      const p = getMathematicalProperties(w.value);
      if (p.isEven) evens++;
      else odds++;
      if (p.isPrime) primes++;
      if (p.isTriangular) triangulars++;
    });

    return { evens, odds, primes, triangulars };
  }, [words]);

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (words.length === 0) return;

    const headers = [
      "Α/Α",
      "Λέξη",
      "Κανονικοποιημένη",
      "Λεξαριθμική Τιμή",
      "Ιωνικό Ψηφίο",
      "Πυθαγόρειος Πυθμένας",
      "Αρτιότητα",
      "Πρώτος Αριθμός",
      "Τρίγωνος Αριθμός",
      "Πλήθος Διαιρετών",
    ];

    const rows = words.map((w, idx) => {
      const props = getMathematicalProperties(w.value);
      const numeral = numberToGreekNumeral(w.value);
      return [
        idx + 1,
        `"${w.rawWord.replace(/"/g, '""')}"`,
        `"${w.normalizedWord.replace(/"/g, '""')}"`,
        w.value,
        `"${numeral}"`,
        w.root,
        props.isEven ? "Άρτιος" : "Περιττός",
        props.isPrime ? "Ναι" : "Όχι",
        props.isTriangular ? `Ναι (T${props.triangularRoot})` : "Όχι",
        props.totalDivisorsCount,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `isopsephy_statistics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      
      {/* Navigation Return Button Header */}
      {onNavigateToCalculator && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateToCalculator()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c]/60 text-[#f5ecd8] hover:text-white text-xs sm:text-sm font-serif font-semibold shadow-md shadow-[#c89b3c]/10 hover:border-[#c89b3c] active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e6c670]" />
            <span>⬅️ Επιστροφή στον Υπολογιστή</span>
          </button>
        </div>
      )}

      {/* Top Banner / Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181512] border border-[#2d251e] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#d4af37]" />
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#f5ecd8]">
                Οπτικοποίηση & Στατιστική Ανάλυση Ισοψηφίας
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#a69680] mt-1">
              Αναλυτικά διαγράμματα κατανομής λεξαρίθμων, πυθαγόρειου πυθμένα και εξαγωγή δεδομένων σε CSV.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onNavigateToCalculator && (
              <button
                onClick={() => onNavigateToCalculator()}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#231d17] hover:bg-[#30271d] border border-[#3e3223] text-[#d6c7b2] hover:text-[#f5ecd8] text-xs font-serif transition-colors min-h-[44px] cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-[#c89b3c]" />
                <span>Υπολογιστής</span>
              </button>
            )}

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={words.length === 0}
              id="btn-export-csv-top"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8a6b2d] to-[#c89b3c] hover:from-[#9c7934] hover:to-[#dbab47] text-[#12100e] font-medium text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Εξαγωγή σε CSV</span>
            </button>
          </div>
        </div>

        {/* Source Switcher */}
        <div className="mt-4 pt-4 border-t border-[#2a2218] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#8c7e6c] font-medium mr-1">Πηγή Δεδομένων:</span>
          
          <button
            onClick={() => setSelectedSource("preset")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[38px] cursor-pointer ${
              selectedSource === "preset"
                ? "bg-[#3e3121] text-[#f5ecd8] border border-[#c89b3c]"
                : "bg-[#1f1a14] text-[#a69680] hover:bg-[#28221a]"
            }`}
          >
            Κλασικά Κείμενα ({PRESET_TEXTS.length})
          </button>

          <button
            onClick={() => setSelectedSource("current")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[38px] cursor-pointer ${
              selectedSource === "current"
                ? "bg-[#3e3121] text-[#f5ecd8] border border-[#c89b3c]"
                : "bg-[#1f1a14] text-[#a69680] hover:bg-[#28221a]"
            }`}
          >
            Τρέχον Κείμενο Εργαλείων
          </button>

          <button
            onClick={() => setSelectedSource("custom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[38px] cursor-pointer ${
              selectedSource === "custom"
                ? "bg-[#3e3121] text-[#f5ecd8] border border-[#c89b3c]"
                : "bg-[#1f1a14] text-[#a69680] hover:bg-[#28221a]"
            }`}
          >
            Ελεύθερο Κείμενο
          </button>

          {(savedItems || []).length > 0 && (
            <button
              onClick={() => setSelectedSource("archive")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[38px] cursor-pointer ${
                selectedSource === "archive"
                  ? "bg-[#3e3121] text-[#f5ecd8] border border-[#c89b3c]"
                  : "bg-[#1f1a14] text-[#a69680] hover:bg-[#28221a]"
              }`}
            >
              Αποθηκευμένα Αρχείου ({(savedItems || []).length})
            </button>
          )}
        </div>

        {/* Preset selector dropdown if preset source */}
        {selectedSource === "preset" && (
          <div className="mt-3 flex items-center gap-2">
            <label htmlFor="preset-select" className="text-xs text-[#8c7e6c]">Επιλογή έργου:</label>
            <select
              id="preset-select"
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="bg-[#12100e] text-[#e6d9c3] border border-[#3e3223] rounded-lg px-3 py-1.5 text-xs focus:border-[#c89b3c] focus:outline-none min-h-[40px]"
            >
              {PRESET_TEXTS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title} ({preset.author}, {preset.era})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom text textarea if custom source */}
        {selectedSource === "custom" && (
          <div className="mt-3">
            <textarea
              rows={2}
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="Εισαγάγετε ελληνικό κείμενο για στατιστική επεξεργασία..."
              className="w-full bg-[#12100e] text-[#e6d9c3] border border-[#3e3223] rounded-xl p-3 text-xs focus:border-[#c89b3c] focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#181512] border border-[#2d251e]">
          <div className="flex items-center gap-1.5 text-[#8c7e6c] text-[11px]">
            <Hash className="w-3.5 h-3.5 text-[#c89b3c]" />
            <span>Σύνολο Λέξεων</span>
          </div>
          <p className="text-xl font-bold font-mono text-[#f5ecd8] mt-1">
            {stats.totalWords}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#181512] border border-[#2d251e]">
          <div className="flex items-center gap-1.5 text-[#8c7e6c] text-[11px]">
            <Layers className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Μοναδικές</span>
          </div>
          <p className="text-xl font-bold font-mono text-[#f5ecd8] mt-1">
            {stats.uniqueWords}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#181512] border border-[#2d251e]">
          <div className="flex items-center gap-1.5 text-[#8c7e6c] text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Μέσος Όρος</span>
          </div>
          <p className="text-xl font-bold font-mono text-[#f5ecd8] mt-1">
            {stats.averageWordValue}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#181512] border border-[#2d251e]">
          <div className="flex items-center gap-1.5 text-[#8c7e6c] text-[11px]">
            <Activity className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Διάμεσος</span>
          </div>
          <p className="text-xl font-bold font-mono text-[#f5ecd8] mt-1">
            {stats.medianWordValue}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#181512] border border-[#2d251e]">
          <div className="flex items-center gap-1.5 text-[#8c7e6c] text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#ec4899]" />
            <span>Πρώτοι Αριθμοί</span>
          </div>
          <p className="text-xl font-bold font-mono text-[#f5ecd8] mt-1">
            {mathStats.primes}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#181512] border border-[#2d251e]">
          <div className="flex items-center gap-1.5 text-[#8c7e6c] text-[11px]">
            <Award className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>Τρίγωνοι Αριθμοί</span>
          </div>
          <p className="text-xl font-bold font-mono text-[#f5ecd8] mt-1">
            {mathStats.triangulars}
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Bar Chart: Isopsephy Range Distribution */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#181512] border border-[#2d251e] flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#c89b3c]" />
              <span>Κατανομή Τιμών Λεξαρίθμων</span>
            </h3>
            <p className="text-xs text-[#8c7e6c] mt-0.5">
              Συχνότητα λέξεων ανά αριθμητικό εύρος ισοψηφίας.
            </p>
          </div>

          <div className="w-full h-64 sm:h-72 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rangeDistributionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#8c7e6c"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#8c7e6c" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1a14",
                    borderColor: "#3e3223",
                    borderRadius: "8px",
                    color: "#f5ecd8",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value} λέξεις`, "Πλήθος"]}
                />
                <Bar
                  dataKey="πλήθος"
                  fill="#c89b3c"
                  radius={[4, 4, 0, 0]}
                  name="Πλήθος Λέξεων"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Pie Chart: Pythagorean Pythmen (1-9) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#181512] border border-[#2d251e] flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#c89b3c]" />
              <span>Κατανομή Πυθαγόρειου Πυθμένα (1–9)</span>
            </h3>
            <p className="text-xs text-[#8c7e6c] mt-0.5">
              Ψηφιακή ρίζα και αναγωγή των λεξαρίθμων στη μονάδα 1-9.
            </p>
          </div>

          <div className="w-full h-64 sm:h-72 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pythmenDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                  paddingAngle={3}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pythmenDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f1a14",
                    borderColor: "#3e3223",
                    borderRadius: "8px",
                    color: "#f5ecd8",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: any) => [`${value} λέξεις`, name]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "#a69680" }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Words Table & AI Modal trigger */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181512] border border-[#2d251e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#c89b3c]" />
              <span>Κυριότερες Λέξεις & Λεξάριθμοι Κειμένου</span>
            </h3>
            <p className="text-xs text-[#8c7e6c] mt-0.5">
              Λέξεις με τη μεγαλύτερη συχνότητα και ισοψηφική αξία.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="text-xs text-[#c89b3c] hover:text-[#e5bc5c] underline flex items-center gap-1 self-start sm:self-auto min-h-[44px] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Λήψη πλήρους καταλόγου CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2d251e] text-[#8c7e6c]">
                <th className="py-2.5 px-3 font-semibold">Λέξη</th>
                <th className="py-2.5 px-3 font-semibold">Λεξάριθμος</th>
                <th className="py-2.5 px-3 font-semibold">Ιωνικό Ψηφίο</th>
                <th className="py-2.5 px-3 font-semibold">Πυθμένας</th>
                <th className="py-2.5 px-3 font-semibold">Συχνότητα</th>
                <th className="py-2.5 px-3 font-semibold text-right">Ενέργεια</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#221c16]">
              {topWordsByFrequency.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#1f1a14] transition-colors">
                  <td className="py-2.5 px-3 font-serif font-bold text-[#f5ecd8]">
                    {item.word}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#c89b3c] font-semibold">
                    {item.λεξάριθμος}
                  </td>
                  <td className="py-2.5 px-3 font-serif text-[#a69680]">
                    {numberToGreekNumeral(item.λεξάριθμος)}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-[#2a2219] text-[#e6c670] border border-[#3e3223]">
                      {item.root}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#a69680] font-mono">
                    {item.συχνότητα}x
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onOpenAiModal(item.word, item.λεξάριθμος, [item.word])}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#282017] hover:bg-[#382d21] text-[#e6c670] border border-[#4a3a29] text-[11px] font-medium transition-colors min-h-[36px] cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#c89b3c]" />
                      <span>Ερμηνεία</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Return Button */}
      {onNavigateToCalculator && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => onNavigateToCalculator()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2a2218] via-[#3d2f1f] to-[#2a2218] border border-[#c89b3c] text-[#f5ecd8] hover:text-white text-xs sm:text-sm font-serif font-semibold shadow-lg shadow-[#c89b3c]/15 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e6c670]" />
            <span>Επιστροφή στον Υπολογιστή Ισοψηφίας</span>
          </button>
        </div>
      )}
    </div>
  );
};
