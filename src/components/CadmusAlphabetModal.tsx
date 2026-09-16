import React, { useState } from "react";
import {
  Sun,
  Sparkles,
  Scroll,
  BookOpen,
  Volume2,
  VolumeX,
  Layers,
  Search,
  Check,
  Copy,
  Info,
  ExternalLink,
  Flame,
  ArrowDown,
  ArrowUp,
  Compass,
  Zap,
} from "lucide-react";
import {
  CADMUS_16_LETTERS,
  ALPHABET_SOLAR_PRAYER,
  SYNTHESIZED_SOLAR_PRAYER_TEXT,
  PRAYER_ESOTERIC_COMMENTARY,
  CadmusLetterItem,
} from "../data/cadmusAlphabetData";
import { SavedIsopsephyItem } from "../types";

interface CadmusAlphabetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

export const CadmusAlphabetModal: React.FC<CadmusAlphabetModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [selectedCreator, setSelectedCreator] = useState<"all" | "Κάδμος" | "Παλαμήδης" | "Σιμωνίδης">("all");
  const [selectedType, setSelectedType] = useState<"all" | "vowel" | "consonant">("all");
  const [selectedLetter, setSelectedLetter] = useState<CadmusLetterItem>(
    CADMUS_16_LETTERS.find((l) => l.char === "Ι") || CADMUS_16_LETTERS[0]
  );
  const [activeSubTab, setActiveSubTab] = useState<"letters" | "solar-prayer" | "solar-iota">("letters");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "el-GR";
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const filteredLetters = CADMUS_16_LETTERS.filter((l) => {
    if (selectedCreator !== "all" && l.creator !== selectedCreator) return false;
    if (selectedType !== "all" && l.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#140e0a] border-2 border-[#c89b3c]/50 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#1c130b] via-[#2a1a0e] to-[#1c130b] border-b border-[#3e2e1c] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] shrink-0">
              <Sun className="w-5 h-5 sm:w-6 h-6 animate-spin-slow" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-serif font-bold text-[#f5ecd8] truncate">
                  ΤΑ 16 ΓΡΑΜΜΑΤΑ ΤΟΥ ΚΑΔΜΟΥ
                </h2>
                <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#ffd700] font-bold shrink-0">
                  Φοινικεία / Καδμεία
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#b8a78e] font-serif truncate">
                Η Ιστορία των Γραμμάτων, το Ηλιακό «Ι», η Ακτίνα Διός (666) &amp; η Κωδικοποιημένη Ηλιακή Προσευχή
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#24170d] hover:bg-[#342213] border border-[#3e2e1c] text-[#c89b3c] hover:text-[#ffd700] transition-all cursor-pointer shrink-0"
            title="Κλείσιμο παραθύρου"
          >
            ✕
          </button>
        </div>

        {/* View Switcher Tabs - Touch friendly horizontal scroll */}
        <div className="flex items-center gap-1.5 p-2 sm:p-2.5 bg-[#17100a] border-b border-[#2d1e12] shrink-0 overflow-x-auto gold-scrollbar">
          <button
            onClick={() => setActiveSubTab("letters")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === "letters"
                ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                : "bg-[#20150d] text-[#c9baa6] hover:text-[#ffd700] border border-[#382618]"
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>16 Γράμματα Κάδμου (+4+4)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("solar-iota")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === "solar-iota"
                ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                : "bg-[#20150d] text-[#c9baa6] hover:text-[#ffd700] border border-[#382618]"
            }`}
          >
            <Sun className="w-3.5 h-3.5 shrink-0" />
            <span>Ηλιακό «Ι» (1111 &amp; 666)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("solar-prayer")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSubTab === "solar-prayer"
                ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                : "bg-[#20150d] text-[#c9baa6] hover:text-[#ffd700] border border-[#382618]"
            }`}
          >
            <Scroll className="w-3.5 h-3.5 shrink-0" />
            <span>Ηλιακή Προσευχή (ΑΛ-ΦΑ... Ω-ΜΕΓΑ)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {activeSubTab === "letters" && (
            <div className="space-y-6">
              {/* Historical Context Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#20150c] via-[#2d1e12] to-[#20150c] border border-[#c89b3c]/30 text-xs font-serif space-y-2 leading-relaxed">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-[#ffd700] text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Η Ιστορική Εξέλιξη του Ελληνικού Αλφαβήτου
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#b8a78e]">
                    <span className="px-2 py-0.5 rounded bg-[#382618] text-[#ffd700]">16 Κάδμου</span>
                    <span>+</span>
                    <span className="px-2 py-0.5 rounded bg-[#382618] text-[#e0b0ff]">4 Παλαμήδη</span>
                    <span>+</span>
                    <span className="px-2 py-0.5 rounded bg-[#382618] text-[#90caf9]">4 Σιμωνίδη</span>
                    <span>=</span>
                    <span className="px-2 py-0.5 rounded bg-[#ffd700]/20 text-[#ffd700] font-bold">24 Ιωνικά</span>
                  </div>
                </div>
                <p className="text-[#e2d5c3]">
                  Σύμφωνα με την αρχαία ελληνική παράδοση (Πλίνιος <em>Nat. Hist.</em> VII 56, Πλούταρχος, Διόδωρος Σικελιώτης), ο <strong>Κάδμος</strong> εισήγαγε στην Ελλάδα <strong>16 αρχέγονα γράμματα</strong> («Φοινικήια» ή «Καδμεία»):
                  <strong className="text-[#ffd700] ml-1">5 Φωνήεντα (Α, Ε, Ι, Ο, Υ)</strong> και <strong className="text-[#ffd700]">11 Σύμφωνα (Β, Γ, Δ, Κ, Λ, Μ, Ν, Π, Ρ, Σ, Τ)</strong>.
                  Στον Τρωικό Πόλεμο ο σοφός ήρωας <strong>Παλαμήδης</strong> πρόσθεσε 4 γράμματα (<strong>Θ, Ξ, Φ, Χ</strong>), και αργότερα ο λυρικός ποιητής <strong>Σιμωνίδης ο Κείος</strong> συμπλήρωσε τα 4 μακρά και διπλά (<strong>Ζ, Η, Ψ, Ω</strong>), ολοκληρώνοντας τον κοσμικό κύκλο των 24 ιωνικών γραμμάτων.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#1a110a] border border-[#2d1e12]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-[#b8a78e] font-serif mr-1">Δημιουργός:</span>
                  {(["all", "Κάδμος", "Παλαμήδης", "Σιμωνίδης"] as const).map((creator) => (
                    <button
                      key={creator}
                      onClick={() => setSelectedCreator(creator)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                        selectedCreator === creator
                          ? "bg-[#c89b3c] text-black font-bold"
                          : "bg-[#25180f] text-[#c9baa6] hover:text-[#ffd700]"
                      }`}
                    >
                      {creator === "all" ? "Όλα (24)" : creator}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#b8a78e] font-serif mr-1">Τύπος:</span>
                  {(["all", "vowel", "consonant"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                        selectedType === type
                          ? "bg-[#ffd700] text-black font-bold"
                          : "bg-[#25180f] text-[#c9baa6] hover:text-[#ffd700]"
                      }`}
                    >
                      {type === "all" ? "Όλα" : type === "vowel" ? "Φωνήεντα" : "Σύμφωνα"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Letters */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {filteredLetters.map((l) => {
                  const isSelected = selectedLetter.char === l.char;
                  const isCadmus = l.creator === "Κάδμος";
                  const isPalamedes = l.creator === "Παλαμήδης";
                  return (
                    <button
                      key={l.char}
                      onClick={() => setSelectedLetter(l)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                        isSelected
                          ? "bg-gradient-to-b from-[#ffd700]/20 to-[#c89b3c]/30 border-[#ffd700] ring-2 ring-[#ffd700]/40 shadow-lg scale-105"
                          : isCadmus
                          ? "bg-[#20150d] hover:bg-[#2b1d12] border-[#c89b3c]/40 hover:border-[#ffd700]/60"
                          : isPalamedes
                          ? "bg-[#1f141f] hover:bg-[#2c1a2c] border-[#9c27b0]/40 hover:border-[#ba68c8]"
                          : "bg-[#141a24] hover:bg-[#1a2332] border-[#2196f3]/40 hover:border-[#64b5f6]"
                      }`}
                    >
                      <span
                        className={`text-2xl sm:text-3xl font-serif font-bold ${
                          isSelected
                            ? "text-[#ffd700]"
                            : isCadmus
                            ? "text-[#f5ecd8] group-hover:text-[#ffd700]"
                            : isPalamedes
                            ? "text-[#e1bee7] group-hover:text-white"
                            : "text-[#bbdefb] group-hover:text-white"
                        }`}
                      >
                        {l.char}
                      </span>
                      <span className="text-[10px] font-mono text-[#b8a78e] mt-1 font-semibold">
                        {l.name}
                      </span>
                      <span className="text-[9px] font-mono text-[#c89b3c] font-bold">
                        ={l.letterIsopsephy}
                      </span>
                      <span className="text-[8px] font-serif text-[#8f7e68] mt-0.5">
                        {l.creator}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Letter In-Depth Inspector Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c130c] via-[#24180e] to-[#1c130c] border-2 border-[#c89b3c]/60 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#382618]">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#ffd700]/10 border-2 border-[#ffd700]/50 flex items-center justify-center text-3xl font-serif font-bold text-[#ffd700] shadow-inner">
                      {selectedLetter.char}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-serif font-bold text-[#f5ecd8]">
                          {selectedLetter.name} ({selectedLetter.char})
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ffd700]/20 text-[#ffd700]">
                          Αξία: {selectedLetter.letterIsopsephy} | Ολογράφως: {selectedLetter.nameIsopsephy}
                        </span>
                      </div>
                      <p className="text-xs text-[#b8a78e] font-serif mt-0.5">
                        {selectedLetter.categoryLabel} • Εισαγωγή: <strong>{selectedLetter.creator}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleSpeak(
                          `${selectedLetter.name}. Αξία ${selectedLetter.letterIsopsephy}. ${selectedLetter.solarMeaning}. ${selectedLetter.deepHistory}`
                        )
                      }
                      className="p-2 rounded-xl bg-[#2a1b10] hover:bg-[#382416] border border-[#3e2e1c] text-[#ffd700] transition-all cursor-pointer"
                      title="Ηχητική ακρόαση"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    {onSaveItem && (
                      <button
                        onClick={() => {
                          onSaveItem({
                            text: selectedLetter.name,
                            normalized: selectedLetter.name,
                            value: selectedLetter.nameIsopsephy,
                            root: (selectedLetter.nameIsopsephy % 9) || 9,
                            greekNumeral: `${selectedLetter.nameIsopsephy}`,
                            isPhrase: false,
                            wordCount: 1,
                            category: "Καδμεία Γράμματα",
                            notes: `${selectedLetter.char} (${selectedLetter.creator}): ${selectedLetter.solarMeaning}`,
                          });
                          handleCopy(selectedLetter.name, "saved");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a1b10] hover:bg-[#382416] border border-[#3e2e1c] text-[#ffd700] text-xs font-serif transition-all cursor-pointer"
                      >
                        {copiedKey === "saved" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        Αποθήκευση
                      </button>
                    )}
                    {onOpenAiModal && (
                      <button
                        onClick={() =>
                          onOpenAiModal(
                            selectedLetter.name,
                            selectedLetter.nameIsopsephy,
                            [selectedLetter.char, selectedLetter.name, selectedLetter.creator]
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8a6825] to-[#c89b3c] text-black text-xs font-serif font-bold shadow-md cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Ανάλυση
                      </button>
                    )}
                  </div>
                </div>

                {/* Solar & Spiritual Meaning */}
                <div className="p-3.5 rounded-xl bg-[#160e08] border border-[#c89b3c]/30 space-y-1.5">
                  <div className="text-xs font-serif font-bold text-[#ffd700] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#ff9800]" />
                    Ηλιακή &amp; Μυστικιστική Σημασία:
                  </div>
                  <p className="text-xs sm:text-sm text-[#f5ecd8] font-serif leading-relaxed italic">
                    «{selectedLetter.solarMeaning}»
                  </p>
                </div>

                {/* Detailed History */}
                <div className="space-y-1.5 text-xs font-serif text-[#d6c7b2] leading-relaxed">
                  <div className="font-bold text-[#ffd700] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Ιστορικό &amp; Φιλοσοφικό Υπόβαθρο:
                  </div>
                  <p>{selectedLetter.deepHistory}</p>
                </div>

                {/* Mystic Syllables Decoded */}
                {selectedLetter.mysticSyllables.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#382618]">
                    <div className="text-xs font-serif font-bold text-[#ffd700]">
                      Αποκωδικοποίηση Συλλαβών Ονόματος ({selectedLetter.name}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedLetter.mysticSyllables.map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#1b120a] border border-[#2d1e12] text-xs font-serif">
                          <span className="font-bold text-[#ffd700]">{s.syllable}:</span>{" "}
                          <span className="text-[#f5ecd8]">{s.decoded}</span>
                          <p className="text-[11px] text-[#a8967e] mt-0.5">{s.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Isopsephic Formulas */}
                {selectedLetter.isopsephicFormulas.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#382618]">
                    <div className="text-xs font-serif font-bold text-[#ffd700]">
                      Ιερά Ισοψηφικά &amp; Μαθηματικά Κλειδιά:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedLetter.isopsephicFormulas.map((f, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#1b120a] border border-[#2d1e12] text-xs font-serif flex items-start gap-2">
                          <span className="font-mono font-bold text-[#ffd700] px-2 py-0.5 rounded bg-[#2b1d12] shrink-0">
                            {f.formula} = {f.value}
                          </span>
                          <span className="text-[#c9baa6] text-[11px]">{f.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Solar Iota & Ray of Zeus 666 */}
          {activeSubTab === "solar-iota" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#24170d] via-[#332011] to-[#24170d] border-2 border-[#ffd700]/50 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#ffd700]/20 border border-[#ffd700]/50 flex items-center justify-center text-2xl font-serif font-bold text-[#ffd700]">
                    Ι
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#ffd700]">
                      ΤΟ ΗΛΙΑΚΟΝ «Ι» &amp; Η ΚΑΤΑΚΟΡΥΦΟΣ ΑΚΤΙΝΑ ΔΙΟΣ
                    </h3>
                    <p className="text-xs text-[#c9baa6] font-serif">
                      Η Αμφίδρομη Κάθοδος &amp; Άνοδος του Φωτός: Ήλιος ⇄ Γη
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#160d07] border border-[#c89b3c]/40 text-center space-y-1">
                    <span className="text-xs font-serif text-[#b8a78e]">Αριθμητική Αξία</span>
                    <div className="text-2xl font-serif font-bold text-[#ffd700]">Ι = 10</div>
                    <span className="text-[11px] text-[#8f7e68]">Η Τέλεια Δεκάς / Τετρακτύς</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#160d07] border border-[#ffd700]/60 text-center space-y-1 ring-1 ring-[#ffd700]/30">
                    <span className="text-xs font-serif text-[#b8a78e]">Ολογράφως</span>
                    <div className="text-2xl font-serif font-bold text-[#ffd700]">ΙΩΤΑ = 1111</div>
                    <span className="text-[11px] text-[#ffd700]">10 + 800 + 300 + 1 = 1111 (1+1+1+1=4)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#160d07] border border-[#ff9800]/50 text-center space-y-1">
                    <span className="text-xs font-serif text-[#b8a78e]">Ηλιακός Αριθμός</span>
                    <div className="text-2xl font-serif font-bold text-[#ff9800]">ΑΚΤΙΣ ΔΙΟΣ = 666</div>
                    <span className="text-[11px] text-[#8f7e68]">Ηλιακή Ακτινοβολία στη Γη</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#1a110a] border border-[#3e2e1c] text-xs font-serif text-[#d6c7b2] leading-relaxed space-y-2.5">
                  <h4 className="font-bold text-[#ffd700] text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#ffd700]" />
                    Η Αμφίδρομη Κίνηση της Ηλιακής Ακτίνας
                  </h4>
                  <p>
                    Το γράμμα <strong>Ι</strong> είναι η μόνη ευθεία κατακόρυφος γραμμή στο ελληνικό αλφάβητο. Στη μυστική γεωμετρία συμβολίζει τον <strong>ιερό άξονα του κόσμου (Axis Mundi)</strong>:
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside text-[#e2d5c3] pl-2">
                    <li>
                      <strong className="text-[#ffd700]">Κάθοδος:</strong> Η θεία ηλιακή ακτίνα κατέρχεται από τον Νοητό και Ορατό Ήλιο (ΑΛ &amp; ΕΛ) προς τη Γαία (ΓΑ / ΔΑ), γονιμοποιώντας την ύλη με σπέρματα ζωής και φωτός.
                    </li>
                    <li>
                      <strong className="text-[#ffd700]">Άνοδος:</strong> Η ανθρώπινη συνείδηση, αφυπνισμένη από τη μύηση (ΜΥ), ακολουθεί την ίδια ευθεία οδό για να ανέλθει πίσω στην αρχέγονη θεϊκή πηγή.
                    </li>
                    <li>
                      <strong className="text-[#ffd700]">1111:</strong> Η αναγωγή του 1111 δίνει <strong>1+1+1+1 = 4</strong>, δηλαδή την <strong>Ιερά Τετρακτύ</strong> (1+2+3+4=10=Ι). Η τετραπλή μονάδα που συνδέει τα τέσσερα στοιχεία με τη Μονάδα.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Solar Prayer Decoded */}
          {activeSubTab === "solar-prayer" && (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#20150c] via-[#2d1e12] to-[#20150c] border border-[#c89b3c]/40 text-xs font-serif leading-relaxed space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#ffd700]">
                    <Scroll className="w-4 h-4 text-[#ffd700]" />
                    Ηλιακή Προσευχή: Η Εσωτερική Επίκληση προς το Φως
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30 text-[10px] font-bold">
                    23 Ιερές Συλλαβές
                  </span>
                </div>
                <p className="text-[#d8c8b0] text-[11px] sm:text-xs">
                  Κάθε γράμμα του ελληνικού αλφαβήτου (ΑΛ-ΦΑ, ΒΗ-ΤΑ, ΓΑ-ΑΜΑ, ΔΕ-ΕΛ-ΤΑ έως Ω-ΜΕΓΑ) συνθέτει μια <strong>ενιαία αρχέγονη ηλιακή επίκληση</strong>. Μέσω της νοητής ή φωνητικής εκφοράς των συλλαβών καθαίρεται και ενεργοποιείται η μνήμη του φωτός εντός του ανθρώπου.
                </p>
              </div>

              {/* Synthesized Ancient Text Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#25170d] via-[#1a1008] to-[#120b06] border-2 border-[#c89b3c]/60 shadow-xl space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-[#c89b3c]/30 pb-2">
                  <span className="text-xs sm:text-sm font-bold text-[#ffd700] font-serif flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Το Συνθετικό Κείμενο της Επίκλησης (Απόδοση)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(SYNTHESIZED_SOLAR_PRAYER_TEXT);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#3a2514] hover:bg-[#4a301a] border border-[#c89b3c]/40 text-[#ffd700] text-[11px] font-serif transition-all cursor-pointer"
                    title="Αντιγραφή κειμένου"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Αντιγραφή</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-serif text-[#f4ebd9] leading-relaxed italic whitespace-pre-line border-l-2 border-[#ffd700] pl-3 py-1">
                  {SYNTHESIZED_SOLAR_PRAYER_TEXT}
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-[#c89b3c]/20 text-[11px] font-serif text-[#c5b59e] leading-relaxed">
                  <strong className="text-[#ffd700]">Εσωτερικό Σχόλιο &amp; Μυητική Διάσταση: </strong>
                  {PRAYER_ESOTERIC_COMMENTARY}
                </div>
              </div>

              {/* Syllable Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#ffd700] font-serif px-1 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#ffd700]" />
                  Αναλυτική Ετυμολογική &amp; Φιλοσοφική Αποκωδικοποίηση κατά Γράμμα:
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1 gold-scrollbar">
                  {ALPHABET_SOLAR_PRAYER.map((line, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#1a110a] hover:bg-[#22160d] border border-[#2e2014] hover:border-[#c89b3c]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-serif"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] font-bold font-serif flex items-center justify-center shrink-0 text-sm mt-0.5">
                          {line.letterAssociated}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#ffd700] text-sm">{line.syllable}</span>
                            <span className="text-[#e2d5c3] font-medium">{line.decodedAncient}</span>
                          </div>
                          <p className="text-[11px] text-[#a8967e] mt-0.5 leading-normal">{line.philosophicalNote}</p>
                          {line.synthesizedPart && (
                            <div className="text-[10px] text-amber-300/80 italic mt-1 font-serif">
                              {line.synthesizedPart}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-[#27190f] text-[#ffd700] border border-[#3e2e1c] font-bold text-[11px] inline-block">
                          ➔ {line.decodedGreek}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#17100a] border-t border-[#2d1e12] flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-[#8f7e68] font-serif hidden sm:inline">
            Ιωνική Ισοψηφία &amp; Αρχαία Παράδοση • Ιωάννης Βελούδος
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#c89b3c] hover:bg-[#dbaa45] text-black font-serif font-bold text-xs transition-all cursor-pointer shadow-md ml-auto"
          >
            Επιστροφή
          </button>
        </div>
      </div>
    </div>
  );
};
