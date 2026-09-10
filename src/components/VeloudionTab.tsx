import React, { useState } from "react";
import {
  encodeVeloudionText,
  decodeVeloudionCode,
  calculateInSystem,
  SYSTEM_META,
  getSystemLegendData,
  VELOUDION_CHAR_TO_CODE,
  numberToGreekNumeral,
  calculatePythmen,
} from "../utils/isopsephy";
import { SavedIsopsephyItem } from "../types";
import {
  Binary,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  BookOpen,
  Layers,
  Save,
  Info,
} from "lucide-react";

interface VeloudionTabProps {
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

export const VeloudionTab: React.FC<VeloudionTabProps> = ({
  onSaveItem,
  onOpenAiModal,
}) => {
  // Veloudion Cipher State
  const [inputText, setInputText] = useState<string>("ΕΝ ΤΩ ΜΕΓΑΛΩ ΚΟΣΜΩ");
  const [encodedResult, setEncodedResult] = useState<string>("");
  const [encodedChunks, setEncodedChunks] = useState<{ char: string; code: string }[]>([]);
  const [copiedCipher, setCopiedCipher] = useState(false);

  const [inputCode, setInputCode] = useState<string>("");
  const [decodedResult, setDecodedResult] = useState<string>("");
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [copiedDecoded, setCopiedDecoded] = useState(false);

  // Multi-System Live Comparison State
  const [multiSysInput, setMultiSysInput] = useState<string>("ΙΑΝΕΥΣ ΤΕΛΙΑΝΟΣ");
  const [selectedSysForLegend, setSelectedSysForLegend] = useState<string>("greek_standard");
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Initial encoding on mount
  React.useEffect(() => {
    handleEncode(inputText);
  }, []);

  const handleEncode = (text: string) => {
    setInputText(text);
    const { code, chunks } = encodeVeloudionText(text);
    setEncodedResult(code);
    setEncodedChunks(chunks);
  };

  const handleDecode = (code: string) => {
    setInputCode(code);
    const { text, error } = decodeVeloudionCode(code);
    if (error) {
      setDecodeError(error);
      setDecodedResult("");
    } else {
      setDecodeError(null);
      setDecodedResult(text);
    }
  };

  const handleCopy = (val: string, type: "cipher" | "decoded") => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    if (type === "cipher") {
      setCopiedCipher(true);
      setTimeout(() => setCopiedCipher(false), 2000);
    } else {
      setCopiedDecoded(true);
      setTimeout(() => setCopiedDecoded(false), 2000);
    }
  };

  const handleInsertAncientChar = (char: string) => {
    const next = multiSysInput + char;
    setMultiSysInput(next);
  };

  const systemsList = Object.keys(SYSTEM_META);
  const legendData = getSystemLegendData(selectedSysForLegend);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Hero Banner / Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1611] via-[#120e0b] to-[#0a0806] border border-[#c89b3c]/30 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#c89b3c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-serif font-semibold bg-[#c89b3c]/20 text-[#e6c670] border border-[#c89b3c]/40 uppercase tracking-wider">
                Κρυπτογραφικό & Πολυσυστημικό
              </span>
              <span className="text-xs text-[#a89984] font-sans">
                Βάση Τριαδικών Ψηφίων (001–900)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f5ebd7] tracking-tight flex items-center gap-3">
              <Binary className="w-7 h-7 text-[#c89b3c]" />
              Σύστημα ΒΕΛΟΥΔΙΟΝ & Πολυσυστημική Αριθμολογία
            </h1>
            <p className="text-[#a89984] text-sm md:text-base mt-1 max-w-3xl leading-relaxed">
              Κωδικοποίηση και αποκωδικοποίηση τριαδικών αριθμητικών δεικτών (Base-3 Digit Triplet)
              καθώς και ταυτόχρονος υπολογισμός σε 8 αρχαία και κλασικά αριθμολογικά συστήματα.
            </p>
          </div>

          {onOpenAiModal && (
            <button
              onClick={() => onOpenAiModal("ΒΕΛΟΥΔΙΟΝ", 666, ["ΒΕΛΟΥΔΙΟΝ", "ΚΩΔΙΚΟΠΟΙΗΣΗ"])}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#281f15] hover:bg-[#382b1d] border border-[#c89b3c]/40 text-[#f5ebd7] text-sm font-serif hover:border-[#c89b3c] transition-all shrink-0 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#c89b3c]" />
              <span>Ανάλυση Συστήματος AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: 2 Columns for Veloudion Encoding & Decoding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ENCODER */}
        <div className="bg-[#14100c] border border-[#2e2318] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-serif font-bold text-[#f5ebd7] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#c89b3c]/20 text-[#e6c670] flex items-center justify-center text-xs">
                  1
                </span>
                Κωδικοποίηση Κειμένου → Κωδικός ΒΕΛΟΥΔΙΟΝ
              </h2>
              <span className="text-xs text-[#a89984]">Χαρακτήρες → 3ψήφια (001–900)</span>
            </div>

            <p className="text-xs text-[#8c7e6c] mb-3">
              Πληκτρολογήστε ελληνικό κείμενο. Κάθε γράμμα αντιστοιχίζεται στην ισοδύναμη τριάδα (π.χ. Α=001, Ι=010, Ρ=100, Κενό=900).
            </p>

            <textarea
              value={inputText}
              onChange={(e) => handleEncode(e.target.value)}
              placeholder="Πληκτρολογήστε κείμενο προς κωδικοποίηση..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0d0a08] border border-[#3e3020] text-[#f5ebd7] placeholder-[#6b5d4d] focus:border-[#c89b3c] focus:outline-none font-serif text-sm resize-none"
            />

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
              <span className="text-[11px] text-[#8c7e6c] py-0.5">Προτάσεις:</span>
              {["ΙΑΝΕΥΣ", "ΤΕΛΙΑΝΟΣ", "ΛΑΥΡΕΙΟΝ", "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", "ΕΝ ΤΩ ΜΕΓΑΛΩ ΚΟΣΜΩ"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleEncode(preset)}
                  className="px-2 py-0.5 rounded text-[11px] font-serif bg-[#1a140f] hover:bg-[#251d15] text-[#d6c7b2] border border-[#2e2318] hover:border-[#c89b3c]/50 transition-all cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="p-3.5 rounded-lg bg-[#0a0806] border border-[#3e3020] relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-serif font-semibold text-[#e6c670] flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5" />
                  Παραγόμενος Κωδικός ({encodedResult.length} ψηφία / {encodedChunks.length} στοιχεία):
                </span>
                <button
                  onClick={() => handleCopy(encodedResult, "cipher")}
                  disabled={!encodedResult}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#1f1710] hover:bg-[#2e2318] text-xs font-serif text-[#e6c670] border border-[#3e3020] transition-all disabled:opacity-40 cursor-pointer"
                  title="Αντιγραφή κωδικού"
                >
                  {copiedCipher ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCipher ? "Αντιγράφηκε!" : "Αντιγραφή"}</span>
                </button>
              </div>

              <div className="font-mono text-sm text-[#38bdf8] break-all leading-relaxed p-2 bg-[#120e0b] rounded border border-[#221a12] select-all max-h-32 overflow-y-auto">
                {encodedResult || <span className="text-[#6b5d4d] italic">Το αποτέλεσμα θα εμφανιστεί εδώ...</span>}
              </div>

              {/* Breakdown chunks preview */}
              {encodedChunks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#221a12] flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {encodedChunks.map((chunk, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#1a140f] border border-[#2e2318] text-[11px]"
                    >
                      <span className="font-serif text-[#f5ebd7] mr-1">{chunk.char === " " ? "␣" : chunk.char}</span>
                      <span className="font-mono text-[#c89b3c] font-bold">{chunk.code}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center pt-3 border-t border-[#221a12]">
            <button
              onClick={() => {
                setInputCode(encodedResult);
                handleDecode(encodedResult);
              }}
              disabled={!encodedResult}
              className="text-xs text-[#e6c670] hover:text-[#fde047] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Αποστολή στον Αποκωδικοποιητή</span>
            </button>
            <button
              onClick={() => handleEncode("")}
              className="text-xs text-[#8c7e6c] hover:text-[#d6c7b2] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Εκκαθάριση</span>
            </button>
          </div>
        </div>

        {/* DECODER */}
        <div className="bg-[#14100c] border border-[#2e2318] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-serif font-bold text-[#f5ebd7] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center text-xs">
                  2
                </span>
                Αποκωδικοποίηση Κωδικού → Ελληνικό Κείμενο
              </h2>
              <span className="text-xs text-[#a89984]">3ψήφια (001–900) → Γράμματα</span>
            </div>

            <p className="text-xs text-[#8c7e6c] mb-3">
              Εισάγετε αριθμητικό κωδικό ΒΕΛΟΥΔΙΟΝ (αριθμοί ανά 3 ψηφία) για άμεση ανασύνθεση του αρχικού κειμένου.
            </p>

            <textarea
              value={inputCode}
              onChange={(e) => handleDecode(e.target.value)}
              placeholder="Επικολλήστε αριθμητικό κώδικα (π.χ. 010001050005400200 = ΙΑΝΕΥΣ)..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0d0a08] border border-[#3e3020] text-[#38bdf8] placeholder-[#6b5d4d] focus:border-[#38bdf8] focus:outline-none font-mono text-sm resize-none"
            />

            {/* Quick decode presets */}
            <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
              <span className="text-[11px] text-[#8c7e6c] py-0.5">Δοκιμές:</span>
              {[
                { label: "ΙΑΝΕΥΣ", code: "010001050005400200" },
                { label: "ΤΕΛΙΑΝΟΣ", code: "300005030010001050070200" },
                { label: "ΛΑΥΡΕΙΟΝ", code: "030001400100005010070050" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleDecode(p.code)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1a140f] hover:bg-[#251d15] text-[#38bdf8] border border-[#2e2318] hover:border-[#38bdf8]/50 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="p-3.5 rounded-lg bg-[#0a0806] border border-[#3e3020] relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-serif font-semibold text-[#38bdf8] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Αποκωδικοποιημένο Κείμενο:
                </span>
                <button
                  onClick={() => handleCopy(decodedResult, "decoded")}
                  disabled={!decodedResult}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[#1f1710] hover:bg-[#2e2318] text-xs font-serif text-[#38bdf8] border border-[#3e3020] transition-all disabled:opacity-40 cursor-pointer"
                  title="Αντιγραφή κειμένου"
                >
                  {copiedDecoded ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#38bdf8]" />}
                  <span>{copiedDecoded ? "Αντιγράφηκε!" : "Αντιγραφή"}</span>
                </button>
              </div>

              {decodeError ? (
                <div className="font-serif text-xs text-red-400 p-2.5 bg-red-950/30 rounded border border-red-800/50">
                  {decodeError}
                </div>
              ) : (
                <div className="font-serif text-base text-[#f5ebd7] font-bold break-words leading-relaxed p-2 bg-[#120e0b] rounded border border-[#221a12] select-all min-h-12">
                  {decodedResult || <span className="text-[#6b5d4d] font-normal italic text-sm">Το κείμενο θα εμφανιστεί εδώ...</span>}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end items-center pt-3 border-t border-[#221a12]">
            <button
              onClick={() => handleDecode("")}
              className="text-xs text-[#8c7e6c] hover:text-[#d6c7b2] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Εκκαθάριση</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: MULTI-SYSTEM LIVE COMPARATOR */}
      <div className="bg-[#14100c] border border-[#2e2318] rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#221a12]">
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-[#f5ebd7] flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#c89b3c]" />
              Πολυσυστημικός Συγκριτής Λεξαρίθμων (8 Συστήματα)
            </h2>
            <p className="text-xs md:text-sm text-[#a89984] mt-0.5">
              Ταυτόχρονη αντιπαραβολή μιας λέξης ή φράσης σε όλα τα αρχαιοελληνικά, κλασικά και λατινικά συστήματα.
            </p>
          </div>

          {/* Quick ancient characters insertion */}
          <div className="flex items-center gap-1.5 shrink-0 bg-[#0d0a08] p-1.5 rounded-lg border border-[#2e2318]">
            <span className="text-[11px] text-[#8c7e6c] px-1 font-serif">Ειδικά:</span>
            {[
              { char: "Ϛ", name: "Στίγμα (6)" },
              { char: "Ϟ", name: "Κόππα (90)" },
              { char: "Ϡ", name: "Σαμπί (900)" },
            ].map((item) => (
              <button
                key={item.char}
                onClick={() => handleInsertAncientChar(item.char)}
                className="px-2 py-1 rounded bg-[#1c1611] hover:bg-[#2c2219] text-[#e6c670] hover:text-[#fde047] font-serif font-bold text-sm border border-[#3e3020] hover:border-[#c89b3c] transition-all cursor-pointer"
                title={item.name}
              >
                {item.char}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="mb-6">
          <label className="block text-xs font-serif font-semibold text-[#d6c7b2] mb-1.5">
            Λέξη ή Φράση προς Πολυσυστημική Ανάλυση:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={multiSysInput}
              onChange={(e) => setMultiSysInput(e.target.value)}
              placeholder="Πληκτρολογήστε (π.χ. ΙΑΝΕΥΣ, ΛΑΥΡΕΙΟΝ, Ο ΝΙΚΗΤΗΣ, JESUS, APOLLO)..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#0d0a08] border border-[#3e3020] text-[#f5ebd7] placeholder-[#6b5d4d] focus:border-[#c89b3c] focus:outline-none font-serif text-base md:text-lg"
            />
            {onSaveItem && (
              <button
                onClick={() => {
                  const val = calculateInSystem(multiSysInput, "greek_standard");
                  if (val > 0) {
                    onSaveItem({
                      text: multiSysInput.trim(),
                      normalized: multiSysInput.trim().toUpperCase(),
                      value: val,
                      root: calculatePythmen(val),
                      greekNumeral: numberToGreekNumeral(val),
                      isPhrase: multiSysInput.trim().includes(" "),
                      wordCount: multiSysInput.trim().split(/\s+/).length,
                      category: "ΒΕΛΟΥΔΙΟΝ",
                      notes: `Πολυσυστημική ανάλυση: ${selectedSysForLegend} = ${calculateInSystem(multiSysInput, selectedSysForLegend)}`,
                    });
                    setSavedStatus("Αποθηκεύτηκε!");
                    setTimeout(() => setSavedStatus(null), 2000);
                  }
                }}
                className="px-4 py-3 rounded-xl bg-[#281f15] hover:bg-[#382b1d] border border-[#c89b3c]/50 text-[#e6c670] font-serif text-sm font-semibold flex items-center gap-2 hover:border-[#c89b3c] transition-all cursor-pointer shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{savedStatus || "Αποθήκευση"}</span>
              </button>
            )}
          </div>
        </div>

        {/* 8 Systems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          {systemsList.map((sysKey) => {
            const meta = SYSTEM_META[sysKey];
            const sumVal = calculateInSystem(multiSysInput, sysKey);
            const isSelected = selectedSysForLegend === sysKey;

            return (
              <div
                key={sysKey}
                onClick={() => setSelectedSysForLegend(sysKey)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-[#1c1611] border-[#c89b3c] shadow-lg ring-1 ring-[#c89b3c]/40"
                    : "bg-[#0d0a08] border-[#251d14] hover:border-[#3e3020] hover:bg-[#120e0b]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}40` }}
                  >
                    {meta.shortName}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#c89b3c]" />}
                </div>

                <div className="font-serif text-2xl font-bold text-[#f5ebd7] my-2 tracking-tight">
                  {sumVal}
                </div>

                <p className="text-[11px] text-[#8c7e6c] font-sans line-clamp-2">
                  {meta.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected System Interactive Legend */}
        <div className="p-5 rounded-xl bg-[#0d0a08] border border-[#2e2318]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1c1611]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#c89b3c]" />
              <span className="text-sm font-serif font-bold text-[#f5ebd7]">
                Αναλυτικός Πίνακας Τιμών: {SYSTEM_META[selectedSysForLegend]?.name}
              </span>
            </div>
            <span className="text-xs text-[#a89984] font-sans">
              Κάντε κλικ σε οποιοδήποτε σύστημα παραπάνω για εναλλαγή
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-2">
            {legendData.map((item, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-[#14100c] border border-[#221a12] flex flex-col items-center justify-center text-center hover:border-[#c89b3c]/50 transition-colors"
              >
                <span className="font-serif text-sm font-bold text-[#f5ebd7]">{item.char}</span>
                <span className="font-mono text-xs text-[#c89b3c] font-semibold">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: VELOUDION 3-DIGIT CODE TABLE REFERENCE */}
      <div className="bg-[#14100c] border border-[#2e2318] rounded-xl p-6 shadow-xl">
        <h3 className="text-base font-serif font-bold text-[#f5ebd7] flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-[#c89b3c]" />
          Κανόνας Κωδικοποίησης ΒΕΛΟΥΔΙΟΝ (Χαρακτήρας → Τριάδα Ψηφίων)
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
          {Object.entries(VELOUDION_CHAR_TO_CODE)
            .filter(([char]) => !["Ά", "Έ", "Ή", "Ί", "Ύ", "Ό", "Ώ", "Ϊ", "Ϋ", "ς"].includes(char))
            .map(([char, code]) => (
              <div
                key={char}
                className="p-2 rounded bg-[#0d0a08] border border-[#221a12] flex items-center justify-between text-xs"
              >
                <span className="font-serif font-bold text-[#e6c670]">
                  {char === " " ? "ΚΕΝΟ" : char === "." ? "ΤΕΛΕΙΑ" : char === "," ? "ΚΟΜΜΑ" : char}
                </span>
                <span className="font-mono text-[#38bdf8] font-bold">{code}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
