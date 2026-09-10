import React, { useState } from "react";
import {
  SACRED_VOWELS,
  SACRED_REPDIGITS_SERIES,
  SacredRepdigitMatch,
} from "../data/sacredHarmonicsData";
import { GREEK_WORDS_MEANINGS, WordMeaningDetail } from "../data/wordMeanings";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  Key,
  Layers,
  Check,
  Copy,
  ArrowRight,
  BookOpen,
  Star,
  Info,
  Scroll,
  Feather,
  Flame,
} from "lucide-react";

interface SacredHarmonicsCardProps {
  onSelectWordForTest?: (word: string) => void;
  className?: string;
}

export const SacredHarmonicsCard: React.FC<SacredHarmonicsCardProps> = ({
  onSelectWordForTest,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"repdigits" | "meanings" | "vowels">("meanings");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const totalVowelsSum = SACRED_VOWELS.reduce((acc, v) => acc + v.value, 0);

  const meaningsList = Object.values(GREEK_WORDS_MEANINGS);
  const filteredMeanings = categoryFilter === "ALL" 
    ? meaningsList 
    : meaningsList.filter((m) => m.category === categoryFilter);

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-[#1c140d] via-[#23180f] to-[#17110c] border border-[#523d24] shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden transition-all ${className}`}
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#2a1d12] via-[#332213] to-[#24160c] border-b border-[#47331e]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8a6825] to-[#ffd700] p-[1.5px] shadow-lg shadow-[#ffd700]/20 shrink-0">
            <div className="w-full h-full bg-[#18110a] rounded-[10px] flex items-center justify-center">
              <Star className="w-5 h-5 text-[#ffd700]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#f5ecd8]">
                Μυστική Αριθμητική & Έννοιες: «ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ»
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#3d2714] text-[#ffd700] border border-[#6b4522]">
                ΩΛΗΝ • ΙΗΣΟΥΣ • 7 ΦΩΝΗΕΝΤΑ • 111–999
              </span>
            </div>
            <p className="text-xs text-[#b8a78e] font-serif">
              Πλήρης ανάλυση εννοιών, ιστορικού πλαισίου (Δελφοί, Ωλήν) και ιερών αρμονικών αναλογιών
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191009] hover:bg-[#2c1d10] border border-[#442c17] text-xs font-serif text-[#ffd700] transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Σύμπτυξη</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Ανάπτυξη Ανάλυσης</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 animate-fadeIn">
          {/* Sub-Tabs: 1) Έννοιες & Μυστικά Ευρήματα, 2) Κλίμακα 111-999, 3) Τα 7 Φωνήεντα */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#332213] pb-3">
            <button
              onClick={() => setActiveTab("meanings")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                activeTab === "meanings"
                  ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                  : "bg-[#18100a] text-[#c9baa6] hover:text-[#ffd700] border border-[#332213]"
              }`}
            >
              <Scroll className="w-4 h-4" />
              Έννοιες & Ιστορία (ΩΛΗΝ, ΙΗΣΟΥΣ, ΟΥΔΟΣ...)
            </button>

            <button
              onClick={() => setActiveTab("repdigits")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                activeTab === "repdigits"
                  ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                  : "bg-[#18100a] text-[#c9baa6] hover:text-[#ffd700] border border-[#332213]"
              }`}
            >
              <Key className="w-4 h-4" />
              Κλίμακα 111 έως 999 ({SACRED_REPDIGITS_SERIES.length} Αριθμοί)
            </button>

            <button
              onClick={() => setActiveTab("vowels")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                activeTab === "vowels"
                  ? "bg-[#ffd700] text-black shadow-md shadow-[#ffd700]/20"
                  : "bg-[#18100a] text-[#c9baa6] hover:text-[#ffd700] border border-[#332213]"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              Τα 7 Ελληνικά Φωνήεντα (Α-Ε-Η-Ι-Ο-Υ-Ω)
            </button>
          </div>

          {/* TAB 1: MEANINGS & HISTORICAL CONTEXT (ΩΛΗΝ, ΙΗΣΟΥΣ, ΟΥΔΟΣ, ΒΕΛΟΣ κλπ.) */}
          {activeTab === "meanings" && (
            <div className="space-y-5">
              {/* Highlight Focus: ΩΛΗΝ = 888 and ΙΗΣΟΥΣ = 888 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#291708] via-[#38200d] to-[#241306] border border-[#ffd700]/60 shadow-xl shadow-[#ffd700]/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ffd700]/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#ffd700] text-black flex items-center justify-center font-bold text-base shadow">
                      ★
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
                        Το Μυστικό της Ογδοάδας (888): ΩΛΗΝ & ΙΗΣΟΥΣ
                      </h4>
                      <p className="text-xs text-[#ffd700] font-serif">
                        Ισοψηφική σύζευξη του αρχαιότερου ποιητή των Δελφών με τον Λόγο του Φωτός
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-[#ffd700] text-black shadow">
                      ΩΛΗΝ = 888
                    </span>
                    <span className="text-xs font-mono font-bold text-[#ffd700]">=</span>
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-[#ffd700] text-black shadow">
                      ΙΗΣΟΥΣ = 888
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs text-[#d8c8b4] font-serif leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#140a04]/80 border border-[#4a2a12] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#ffd700]">ΩΛΗΝ (888)</span>
                      <span className="text-[11px] font-mono text-[#e6c670]">Ω(800) + Λ(30) + Η(8) + Ν(50)</span>
                    </div>
                    <p>
                      Κατά τον <strong>Παυσανία</strong> (<em>«Ελλάδος Περιήγησις» Φωκικά Χ.5.7</em>) και τον <strong>Ηρόδοτο</strong> (<em>Ιστορίαι IV.35</em>),
                      ο <strong>Ωλήν</strong> ήταν ο <strong>αρχαιότερος μυθικός ποιητής και υμνογράφος της ανθρωπότητας</strong>,
                      προγενέστερος ακόμη και του Ορφέα και του Μουσαίου.
                    </p>
                    <p className="text-[#c2ab91]">
                      <strong>Σχέση με το Μαντείο των Δελφών:</strong> Ήταν ο πρώτος που συνέθεσε ύμνους σε δακτυλικό εξάμετρο, εισήγαγε τη λατρεία του Απόλλωνα στη Δήλο και τους Δελφούς, και θεωρείται ο πρώτος προφήτης και συνιδρυτής του Μαντείου των Δελφών μαζί με τους Υπερβορείους.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#140a04]/80 border border-[#4a2a12] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#ffd700]">ΙΗΣΟΥΣ (888)</span>
                      <span className="text-[11px] font-mono text-[#e6c670]">Ι(10)+Η(8)+Σ(200)+Ο(70)+Υ(400)+Σ(200)</span>
                    </div>
                    <p>
                      Ο <strong>ΙΗΣΟΥΣ</strong> εκφράζει την υπέρτατη πνευματική αναγέννηση, την <strong>Ογδοάδα ($8 \times 111 = 888$)</strong>,
                      την «Ημέρα της Αναστάσεως» και την υπέρβαση του εβδομαδιαίου εγκόσμιου χρόνου.
                    </p>
                    <p className="text-[#c2ab91]">
                      <strong>Κοσμική Σύζευξη:</strong> Και τα δύο ιερά ονόματα (ο πρώτος εμπνευσμένος ποιητής-προφήτης του φωτός και ο ενσαρκωμένος Λόγος) σχηματίζονται αυτούσια από τα γράμματα του <strong>«ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ»</strong> και μοιράζονται ακριβώς τον ίδιο λεξάριθμο <strong>888</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Filter for meanings */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <span className="text-xs font-serif text-[#a89984]">
                  Επεξήγηση σημαντικών λέξεων που σχηματίζονται από τα γράμματα:
                </span>

                <div className="flex items-center gap-1.5">
                  {["ALL", "Μυθολογία & Ιστορία", "Θεολογία & Μυστικισμός", "Φιλοσοφία & Ορολογία"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-serif transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? "bg-[#3d2714] text-[#ffd700] border border-[#6b4522] font-bold"
                          : "bg-[#140c06] text-[#8a7662] hover:text-[#f5ecd8] border border-[#2b180c]"
                      }`}
                    >
                      {cat === "ALL" ? "Όλες οι Έννοιες" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Word Meaning Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMeanings.map((item) => (
                  <div
                    key={item.word}
                    className="p-4 rounded-xl bg-[#140c06] border border-[#332213] hover:border-[#ffd700]/40 transition-all flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-serif font-black text-[#ffd700] tracking-wide">
                              {item.word}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#24150b] text-[#f5ecd8] border border-[#442814]">
                              ={item.isopsephy}
                            </span>
                          </div>
                          {item.highlightTag && (
                            <span className="text-[10px] font-serif text-[#c89b3c] block mt-0.5 font-semibold">
                              {item.highlightTag}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-serif px-2 py-0.5 rounded bg-[#201208] text-[#a89984] border border-[#382010] shrink-0">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-xs font-serif font-semibold text-[#f5ecd8] leading-snug">
                        {item.summary}
                      </p>

                      {item.historicalContext && (
                        <p className="text-xs text-[#a69680] font-serif leading-relaxed pt-1 border-t border-[#26150b]">
                          {item.historicalContext}
                        </p>
                      )}

                      {item.sourceReferences && (
                        <div className="text-[10px] font-mono text-[#786653] italic">
                          Πηγές: {item.sourceReferences}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#24140a] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(`${item.word} (${item.isopsephy}): ${item.summary} - ${item.historicalContext || ""}`)}
                        className="flex items-center gap-1 text-[11px] font-serif text-[#a89984] hover:text-[#ffd700] transition-colors"
                      >
                        {copiedText?.includes(item.word) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Αντιγράφηκε</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Αντιγραφή</span>
                          </>
                        )}
                      </button>

                      {onSelectWordForTest && (
                        <button
                          type="button"
                          onClick={() => onSelectWordForTest(item.word)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#24150b] hover:bg-[#382010] text-[#ffd700] text-xs font-serif font-bold border border-[#472a15] transition-colors cursor-pointer"
                        >
                          <span>Εύρεση στο Γραμματάρι</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SACRED REPDIGITS 111 to 999 */}
          {activeTab === "repdigits" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#140c06] border border-[#382312] text-xs text-[#d8c8b4] font-serif leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                <div>
                  Το απόθεμα γραμμάτων του ονόματος <strong>«ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ»</strong>{" "}
                  περιέχει ακριβείς συνδυασμούς που παράγουν όλους τους ιερούς αριθμούς{" "}
                  <strong>111, 222, 333, 444, 555, 666, 777, 888, 999</strong>, συμπεριλαμβανομένων
                  των κεντρικών κλειδιών <strong>ΙΑΝΕΥΣ = 666</strong>, <strong>ΙΗΣΟΥΣ = 888</strong> και <strong>ΩΛΗΝ = 888</strong>.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {SACRED_REPDIGITS_SERIES.map((item) => {
                  const isKeyMatch = item.number === 666 || item.number === 888;
                  return (
                    <div
                      key={item.number}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                        isKeyMatch
                          ? "bg-gradient-to-br from-[#291b0d] via-[#352311] to-[#201409] border-[#ffd700]/70 shadow-lg shadow-[#ffd700]/15 ring-1 ring-[#ffd700]/30"
                          : "bg-[#150d07] border-[#332213] hover:border-[#52371f]"
                      }`}
                    >
                      <div>
                        {/* Top Badge: Number & Formula */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-lg font-mono font-black px-2 py-0.5 rounded-lg border ${
                                isKeyMatch
                                  ? "bg-[#ffd700] text-black border-[#ffd700] shadow-sm"
                                  : "bg-[#24160c] text-[#ffd700] border-[#442c17]"
                              }`}
                            >
                              {item.number}
                            </span>
                            {isKeyMatch && (
                              <span className="text-[10px] font-serif font-bold text-[#ffd700] bg-[#3e2612] px-1.5 py-0.5 rounded border border-[#6b421e]">
                                Κλειδί
                              </span>
                            )}
                          </div>

                          <span className="text-base font-serif font-bold text-[#f5ecd8] tracking-wider">
                            {item.wordOrFormula}
                          </span>
                        </div>

                        {/* Breakdown math */}
                        <div className="mt-2 text-[11px] font-mono text-[#e6c670] bg-[#0d0704] p-1.5 rounded-lg border border-[#2b1b0f]">
                          {item.breakdown}
                        </div>

                        {/* Meaning / Historical connection */}
                        <p className="mt-2 text-xs text-[#a69680] font-serif leading-snug">
                          {item.meaning}
                        </p>
                      </div>

                      {/* Bottom row: Source pool + test in grammatari */}
                      <div className="pt-2 border-t border-[#26170d] flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#786653] font-serif truncate" title={item.sourcePool}>
                          {item.sourcePool}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy(`${item.wordOrFormula} = ${item.number} | ${item.breakdown}`)}
                            className="p-1 rounded-md bg-[#20140c] hover:bg-[#332114] text-[#c89b3c] hover:text-[#ffd700] transition-colors"
                            title="Αντιγραφή"
                          >
                            {copiedText?.includes(item.wordOrFormula) ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {onSelectWordForTest && (
                            <button
                              type="button"
                              onClick={() => {
                                const firstWord = item.wordOrFormula.split("/")[0].split(" ")[0].replace(/[^Α-Ω]/g, "");
                                onSelectWordForTest(firstWord);
                              }}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2a1a0e] hover:bg-[#3d2715] text-[#ffd700] text-[10px] font-serif border border-[#4d3118] transition-colors"
                              title="Δοκιμή στο Γραμματάρι"
                            >
                              Δοκιμή
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: THE 7 VOWELS OF THE ALPHABET */}
          {activeTab === "vowels" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#140c06] border border-[#382312] text-xs text-[#d8c8b4] font-serif leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                <div>
                  <strong>Πλήρης Φωνηεντική Πληρότητα:</strong> Το ονοματεπώνυμο <strong>«ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ»</strong>{" "}
                  εμπεριέχει και τα <strong>7 αρχαιοελληνικά φωνήεντα (Α, Ε, Η, Ι, Ο, Υ, Ω)</strong> χωρίς καμία εξαίρεση.{" "}
                  Στην Πυθαγόρεια και Ερμητική παράδοση, τα 7 φωνήεντα αντιστοιχούν στους <strong>7 πλανητικούς φθόγγους</strong>,{" "}
                  στην <strong>επτάχορδο λύρα</strong> του Απόλλωνα και στις 7 βαθμίδες της δημιουργίας.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {SACRED_VOWELS.map((v) => (
                  <div
                    key={v.letter}
                    className="p-3 rounded-xl bg-[#160e08] border border-[#332213] flex flex-col items-center text-center gap-1.5 hover:border-[#ffd700]/50 transition-all shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2c1b0e] to-[#3f2715] border border-[#ffd700]/50 flex items-center justify-center">
                      <span className="text-xl font-serif font-black text-[#ffd700]">{v.letter}</span>
                    </div>

                    <div className="text-xs font-serif font-bold text-[#f5ecd8]">{v.name}</div>
                    <div className="text-[11px] font-mono text-[#ffd700]">={v.value}</div>
                    <div className="text-[10px] text-[#a89984] font-serif">{v.planet}</div>
                    <div className="text-[9px] text-[#786653] font-serif italic mt-1">{v.element}</div>
                    <div className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#20140b] text-[#e6c670] border border-[#382312] mt-1">
                      {v.sourceWord}
                    </div>
                  </div>
                ))}
              </div>

              {/* Vowel Sum & Pythagorean Reduction */}
              <div className="p-3.5 rounded-xl bg-[#110905] border border-[#2b1a0d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif text-[#c9baa6]">
                <div className="flex items-center gap-2">
                  <span className="text-[#ffd700] font-bold">Άθροισμα 7 Φωνηέντων:</span>
                  <span className="font-mono font-bold text-[#f5ecd8] px-2 py-0.5 rounded bg-[#1e1208] border border-[#382312]">
                    Α(1) + Ε(5) + Η(8) + Ι(10) + Ο(70) + Υ(400) + Ω(800) = {totalVowelsSum}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ffd700] font-bold">Πυθαγόρειος Πυθμένας:</span>
                  <span className="font-mono font-bold text-[#ffd700] px-2 py-0.5 rounded bg-[#1e1208] border border-[#ffd700]/40">
                    1 + 2 + 9 + 4 = 16 ➔ 1 + 6 = 7 (Ο Ιερός Επτάριθμος)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
