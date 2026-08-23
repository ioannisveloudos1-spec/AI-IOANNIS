import React, { useState } from "react";
import { IONIC_ALPHABET } from "../utils/isopsephy";
import { BookOpen, Sparkles, Hash, Layers, CheckCircle2, Sun, Calculator, ChevronRight } from "lucide-react";

export const GuideTab: React.FC = () => {
  const [selectedLetterChar, setSelectedLetterChar] = useState<string>("Α");
  const [activeSquareRow, setActiveSquareRow] = useState<number | null>(null);

  const monades = IONIC_ALPHABET.filter((l) => l.category === "monas");
  const dekades = IONIC_ALPHABET.filter((l) => l.category === "dekas");
  const ekatontades = IONIC_ALPHABET.filter((l) => l.category === "ekatontas");

  const selectedLetter = IONIC_ALPHABET.find((l) => l.char === selectedLetterChar) || IONIC_ALPHABET[0];

  // The ancient 6x6 Magic Square of the Sun (sum of each row/col/diag = 111, total = 666)
  const magicSquareOfSun = [
    [6, 32, 3, 34, 35, 1],
    [7, 11, 27, 28, 8, 30],
    [19, 14, 16, 15, 23, 24],
    [18, 20, 22, 21, 17, 13],
    [25, 29, 10, 9, 26, 12],
    [36, 5, 33, 4, 2, 31],
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Introduction Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#181512] border border-[#2d251e] space-y-2">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#c89b3c]" />
          <span>Οδηγός Ιωνικής Αρίθμησης & Ελληνικής Ισοψηφίας</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#a69680] font-serif leading-relaxed">
          Η <strong>Ισοψηφία</strong> (γνωστή και ως υπολογισμός λεξαρίθμων) είναι η αρχαία ελληνική επιστημονική και φιλοσοφική πρακτική της άθροισης των αριθμητικών αξιών των γραμμάτων μιας λέξης ή φράσης, σύμφωνα με το αλφαβητικό σύστημα της <strong>Ιωνικής Αρίθμησης</strong> (27 ψηφία).
        </p>
      </div>

      {/* SPECIAL SECTION: Ο ΑΡΙΘΜΟΣ 666, ΤΡΙΓΩΝΟΙ ΑΡΙΘΜΟΙ & ΜΑΓΙΚΟ ΤΕΤΡΑΓΩΝΟ ΤΟΥ ΗΛΙΟΥ */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#14120f] border-2 border-[#c89b3c]/40 shadow-2xl shadow-black/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2419] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#261e14] border border-[#c89b3c]/60 flex items-center justify-center text-[#e6c670]">
              <Sun className="w-5 h-5 text-[#e6c670]" />
            </div>
            <div>
              <div className="text-[11px] font-serif uppercase tracking-widest text-[#c89b3c] font-bold">
                Μαθηματική & Πυθαγόρεια Ανάλυση
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#f5ecd8]">
                Ο Αριθμός 666 (χξϛ´) & Το Μαγικό Τετράγωνο του Ηλίου
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#221a12] border border-[#3e3223] text-xs font-mono font-bold text-[#e6c670]">
              36ος Τρίγωνος Αριθμός (T₃₆)
            </span>
          </div>
        </div>

        {/* 4 Core Mathematical Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#1a1612] border border-[#2e2419]">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Πλήθος Διαιρετών</div>
            <div className="text-xl font-serif font-bold text-[#e6c670] mt-0.5">12 Διαιρέτες</div>
            <p className="text-[10px] text-[#a69680] font-serif mt-1">
              1, 2, 3, 6, 9, 18, 37, 74, 111, 222, 333, 666
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1612] border border-[#2e2419]">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Τριγωνική Ιδιότητα</div>
            <div className="text-xl font-serif font-bold text-[#38bdf8] mt-0.5">T₃₆ = Σ(1..36)</div>
            <p className="text-[10px] text-[#a69680] font-serif mt-1">
              Το άθροισμα όλων των ακεραίων από το 1 έως το 36
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1612] border border-[#2e2419]">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Μαγικό Τετράγωνο Ηλίου</div>
            <div className="text-xl font-serif font-bold text-[#f5ecd8] mt-0.5">6 × 6 = 36 Κελιά</div>
            <p className="text-[10px] text-[#a69680] font-serif mt-1">
              Άθροισμα γραμμών/στηλών: 111. Σύνολο: 6 × 111 = 666
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1612] border border-[#2e2419]">
            <div className="text-[11px] font-serif text-[#8c7e6c]">Πυθαγόρειος Πυθμένας</div>
            <div className="text-xl font-serif font-bold text-[#ec4899] mt-0.5">9 (6+6+6=18→9)</div>
            <p className="text-[10px] text-[#a69680] font-serif mt-1">
              Ψηφιακή ρίζα της εννεάδας των Πυθαγορείων
            </p>
          </div>
        </div>

        {/* Step-by-Step Mathematical Derivation Formula */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0e0c0a] border border-[#30261b] space-y-4">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#e6c670]">
            <Calculator className="w-4 h-4 text-[#c89b3c]" />
            <span>Βήμα προς Βήμα Μαθηματικός Υπολογισμός Τριγώνου Αριθμού:</span>
          </div>

          <p className="text-xs text-[#d6c7b2] font-serif leading-relaxed">
            Ο γενικός μαθηματικός τύπος για τον υπολογισμό του $n$-οστού τριγώνου αριθμού είναι:
          </p>

          <div className="p-3 rounded-lg bg-[#181410] border border-[#292017] text-center font-mono text-sm sm:text-base font-bold text-[#f5ecd8]">
            s = [ n · (n + 1) ] / 2
          </div>

          <div className="space-y-3 font-serif text-xs text-[#d6c7b2] pt-1">
            <div className="p-3 rounded-lg bg-[#15120f] border border-[#241c14] space-y-1">
              <strong className="text-[#f5ecd8] text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#2a2116] text-[#e6c670] flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                Βήμα 1: Αντικατάσταση του n
              </strong>
              <p className="text-[#a69680] pl-6">
                Βάζουμε το <strong>36</strong> στη θέση του $n$ μέσα στον τύπο:
              </p>
              <div className="pl-6 font-mono text-xs text-[#e6c670] font-bold">
                s = [ 36 · (36 + 1) ] / 2
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#15120f] border border-[#241c14] space-y-1">
              <strong className="text-[#f5ecd8] text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#2a2116] text-[#e6c670] flex items-center justify-center text-[10px] font-mono font-bold">2</span>
                Βήμα 2: Πράξη εντός της παρένθεσης
              </strong>
              <p className="text-[#a69680] pl-6">
                Υπολογίζουμε το άθροισμα μέσα στην παρένθεση (36 + 1 = 37):
              </p>
              <div className="pl-6 font-mono text-xs text-[#e6c670] font-bold">
                s = ( 36 · 37 ) / 2
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#15120f] border border-[#241c14] space-y-2">
              <strong className="text-[#f5ecd8] text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#2a2116] text-[#e6c670] flex items-center justify-center text-[10px] font-mono font-bold">3</span>
                Βήμα 3: Πολλαπλασιασμός (ή Απλοποίηση)
              </strong>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                <div className="p-2.5 rounded bg-[#100e0b] border border-[#251d16] space-y-1">
                  <span className="text-[11px] text-[#c89b3c] font-bold block">Εναλλακτικός τρόπος (Απλοποίηση πρώτα):</span>
                  <p className="text-[11px] text-[#a69680]">
                    Διαιρούμε το 36 με το 2 (36 / 2 = 18) και μετά πολλαπλασιάζουμε επί 37:
                  </p>
                  <div className="font-mono text-xs text-[#f5ecd8] font-bold">
                    18 · 37 = 666
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#100e0b] border border-[#251d16] space-y-1">
                  <span className="text-[11px] text-[#c89b3c] font-bold block">Κανονικός τρόπος:</span>
                  <p className="text-[11px] text-[#a69680]">
                    Πολλαπλασιάζουμε 36 · 37 = 1332 και μετά διαιρούμε με το 2:
                  </p>
                  <div className="font-mono text-xs text-[#f5ecd8] font-bold">
                    s = 1332 / 2
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#1d160e] border border-[#44331e] space-y-1">
              <strong className="text-[#e6c670] text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#3d2c16] text-[#e6c670] flex items-center justify-center text-[10px] font-mono font-bold">4</span>
                Βήμα 4: Τελική Διαίρεση
              </strong>
              <div className="pl-6 font-mono text-sm text-[#f5ecd8] font-bold">
                s = 666
              </div>
              <p className="text-[11px] text-[#c89b3c] pl-6">
                Το τελικό αποτέλεσμα είναι <strong>666</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Interactive 6x6 Magic Square of the Sun */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#f5ecd8] flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#e6c670]" />
              <span>Το Μαγικό Τετράγωνο του Ηλίου (6 × 6 = 36 κελιά)</span>
            </h4>
            <span className="text-[11px] font-mono text-[#c89b3c]">Κάθε σειρά = 111 | Σύνολο = 666</span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="inline-block min-w-full sm:min-w-[500px] p-3 rounded-xl bg-[#0c0a08] border border-[#2e2318]">
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center font-mono">
                {/* Headers */}
                <div className="text-[10px] text-[#706454] font-serif self-center">Σειρά</div>
                {[1, 2, 3, 4, 5, 6].map((col) => (
                  <div key={col} className="text-[10px] text-[#8c7e6c] font-serif py-1">
                    Στήλη {col}
                  </div>
                ))}

                {/* 6 Rows */}
                {magicSquareOfSun.map((row, rIdx) => (
                  <React.Fragment key={`row-${rIdx}`}>
                    <div className="text-[10px] font-serif text-[#8c7e6c] flex items-center justify-center bg-[#15120f] rounded">
                      Σειρά {rIdx + 1}
                    </div>
                    {row.map((val, cIdx) => (
                      <div
                        key={`cell-${rIdx}-${cIdx}`}
                        onMouseEnter={() => setActiveSquareRow(rIdx)}
                        onMouseLeave={() => setActiveSquareRow(null)}
                        className={`p-2 sm:p-2.5 rounded-lg border text-xs sm:text-sm font-bold transition-all ${
                          activeSquareRow === rIdx
                            ? "bg-[#2d2214] border-[#c89b3c] text-[#e6c670] scale-105"
                            : "bg-[#181410] border-[#251e17] text-[#f5ecd8] hover:border-[#3d3020]"
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                  </React.Fragment>
                ))}

                {/* Footer Sums */}
                <div className="text-[10px] font-serif font-bold text-[#c89b3c] flex items-center justify-center bg-[#1e170f] rounded py-1">
                  Άθροισμα
                </div>
                {[111, 111, 111, 111, 111, 111].map((sum, idx) => (
                  <div
                    key={`sum-${idx}`}
                    className="p-1 rounded bg-[#20180f] border border-[#3e301d] text-[11px] font-bold text-[#e6c670]"
                  >
                    = {sum}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-[#8c7e6c] font-serif text-center">
            Κάθε γραμμή, στήλη και διαγώνιος ισούται με <strong>111</strong>. Το άθροισμα και των 6 γραμμών είναι <strong>6 × 111 = 666</strong>.
          </p>
        </div>
      </div>

      {/* 27 Ionic Numerals Interactive Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-wider text-[#e6c670] font-serif font-bold flex items-center gap-2">
            <span>Ο Πινακας των 27 Ιωνικων Ψηφιων</span>
            <span className="text-xs font-normal text-[#8c7e6c] font-sans">(9 Μονάδες, 9 Δεκάδες, 9 Εκατοντάδες)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. ΜΟΝΑΔΕΣ (1-9) */}
          <div className="p-4 rounded-2xl bg-[#15120f] border border-[#2d251e] space-y-3">
            <div className="flex items-center justify-between border-b border-[#251e17] pb-2">
              <span className="text-xs uppercase tracking-wider font-serif font-bold text-[#f5ecd8]">
                Μονάδες (1 - 9)
              </span>
              <span className="text-[10px] font-mono text-[#c89b3c]">α´ έως θ´</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {monades.map((letter) => (
                <button
                  key={letter.char}
                  onClick={() => setSelectedLetterChar(letter.char)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedLetterChar === letter.char
                      ? "bg-[#2d2419] border-[#c89b3c] shadow-md shadow-[#c89b3c]/20"
                      : "bg-[#1a1612] border-[#292219] hover:border-[#3d3122]"
                  }`}
                >
                  <span className="text-lg font-serif font-bold text-[#f5ecd8]">
                    {letter.upper} {letter.lower}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#e6c670] mt-0.5">
                    = {letter.value}
                  </span>
                  {letter.archaic && (
                    <span className="text-[9px] text-[#c89b3c] font-sans">Αρχαίο</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2. ΔΕΚΑΔΕΣ (10-90) */}
          <div className="p-4 rounded-2xl bg-[#15120f] border border-[#2d251e] space-y-3">
            <div className="flex items-center justify-between border-b border-[#251e17] pb-2">
              <span className="text-xs uppercase tracking-wider font-serif font-bold text-[#f5ecd8]">
                Δεκάδες (10 - 90)
              </span>
              <span className="text-[10px] font-mono text-[#c89b3c]">ι´ έως ϟ´</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {dekades.map((letter) => (
                <button
                  key={letter.char}
                  onClick={() => setSelectedLetterChar(letter.char)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedLetterChar === letter.char
                      ? "bg-[#2d2419] border-[#c89b3c] shadow-md shadow-[#c89b3c]/20"
                      : "bg-[#1a1612] border-[#292219] hover:border-[#3d3122]"
                  }`}
                >
                  <span className="text-lg font-serif font-bold text-[#f5ecd8]">
                    {letter.upper} {letter.lower}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#e6c670] mt-0.5">
                    = {letter.value}
                  </span>
                  {letter.archaic && (
                    <span className="text-[9px] text-[#c89b3c] font-sans">Αρχαίο</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. ΕΚΑΤΟΝΤΑΔΕΣ (100-900) */}
          <div className="p-4 rounded-2xl bg-[#15120f] border border-[#2d251e] space-y-3">
            <div className="flex items-center justify-between border-b border-[#251e17] pb-2">
              <span className="text-xs uppercase tracking-wider font-serif font-bold text-[#f5ecd8]">
                Εκατοντάδες (100 - 900)
              </span>
              <span className="text-[10px] font-mono text-[#c89b3c]">ρ´ έως ϡ´</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ekatontades.map((letter) => (
                <button
                  key={letter.char}
                  onClick={() => setSelectedLetterChar(letter.char)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedLetterChar === letter.char
                      ? "bg-[#2d2419] border-[#c89b3c] shadow-md shadow-[#c89b3c]/20"
                      : "bg-[#1a1612] border-[#292219] hover:border-[#3d3122]"
                  }`}
                >
                  <span className="text-lg font-serif font-bold text-[#f5ecd8]">
                    {letter.upper} {letter.lower}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#e6c670] mt-0.5">
                    = {letter.value}
                  </span>
                  {letter.archaic && (
                    <span className="text-[9px] text-[#c89b3c] font-sans">Αρχαίο</span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Selected Letter Detail Card */}
        <div className="p-4 rounded-xl bg-[#191511] border border-[#3a2f21] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#12100d] border border-[#443624] flex items-center justify-center text-2xl font-serif font-bold text-[#e6c670]">
              {selectedLetter.upper}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-serif font-bold text-[#f5ecd8]">
                  {selectedLetter.name} ({selectedLetter.upper} / {selectedLetter.lower})
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#251e16] text-[#c89b3c] border border-[#3e3223]">
                  Αξία: {selectedLetter.value} ({selectedLetter.greekNumeral})
                </span>
              </div>
              <p className="text-xs text-[#a69680] mt-0.5 font-serif">
                {selectedLetter.description} {selectedLetter.archaic ? "— Θεμελιώδες ιστορικό σύμβολο του 27ψήφιου Ιωνικού συστήματος." : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Archaic Numerals Special Section */}
      <div className="rounded-2xl bg-[#15120f] border border-[#2d251e] p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-[#e6c670] font-serif font-bold">
          Τα Τρία Ιστορικά Σύμβολα της Ιωνικής Αρίθμησης (Ϛ, Ϟ, Ϡ)
        </h3>
        
        <div className="space-y-3 text-xs text-[#d6c7b2] leading-relaxed font-serif">
          <p>
            <strong>Η προέλευσή τους:</strong> Όταν οι Έλληνες δανείστηκαν το φοινικικό αλφάβητο γύρω στο 800 π.Χ., προσάρμοσαν τα σύμβολα στις φωνητικές ανάγκες της δικής τους γλώσσας. Κάποια από αυτά τα αρχικά γράμματα (όπως το <em>Κόππα</em> και το <em>Σαμπί</em>) υπήρχαν από την αρχή στα αρχαία τοπικά ελληνικά αλφάβητα, απλώς αργότερα εγκαταλείφθηκαν σταδιακά ως φωνητικά σύμβολα επειδή άλλαξε η προφορά ή επικράτησαν άλλα γράμματα (όπως το Κάππα αντί του Κόππα). Το δε <em>Στίγμα</em> προέκυψε αργότερα ως τυπογραφική ένωση (λιγατούρα) του «στ» (παίρνοντας τη θέση του αρχαϊκού Διγάμματος Ϝ).
          </p>
          <p>
            <strong>Ο ρόλος τους στον Λεξάριθμο:</strong> Στο παραδοσιακό ελληνικό σύστημα αρίθμησης (που χρησιμοποιείται και στον λεξάριθμο), τα γράμματα αυτά διατηρήθηκαν σταθερά στις θέσεις τους επειδή κάλυπταν τα κενά για τις δεκάδες και τις εκατοντάδες που δεν έφταναν τα 24 βασικά γράμματα, συγκροτώντας το πλήρες <strong>27ψήφιο Ιωνικό Σύστημα</strong> (9 Μονάδες + 9 Δεκάδες + 9 Εκατοντάδες):
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#1a1612] border border-[#2d251e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-serif font-bold text-[#e6c670]">Ϛ´ (ϛ)</span>
              <span className="text-sm font-mono font-bold text-[#f5ecd8] bg-[#251e16] px-2 py-0.5 rounded border border-[#3e3223]">= 6</span>
            </div>
            <h4 className="text-xs font-serif font-bold text-[#f5ecd8]">Στίγμα (ϛ / Ϛ) &amp; Δίγαμμα (Ϝ)</h4>
            <p className="text-xs text-[#8c7e6c] font-serif leading-normal">
              Καλύπτει την 6η θέση στις 9 μονάδες (1–9). Προήλθε από τη συνένωση «στ» και τη διατήρηση της θέσης του αρχαϊκού Διγάμματος (Ϝ).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1a1612] border border-[#2d251e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-serif font-bold text-[#e6c670]">Ϟ´ (ϟ)</span>
              <span className="text-sm font-mono font-bold text-[#f5ecd8] bg-[#251e16] px-2 py-0.5 rounded border border-[#3e3223]">= 90</span>
            </div>
            <h4 className="text-xs font-serif font-bold text-[#f5ecd8]">Κόππα (ϙ / Ϟ)</h4>
            <p className="text-xs text-[#8c7e6c] font-serif leading-normal">
              Καλύπτει την 9η θέση στις 9 δεκάδες (10–90). Υπήρχε στα αρχαία τοπικά ελληνικά αλφάβητα και διατηρήθηκε ως θεμελιώδες αριθμητικό ψηφίο του 90.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1a1612] border border-[#2d251e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-serif font-bold text-[#e6c670]">Ϡ´ (ϡ)</span>
              <span className="text-sm font-mono font-bold text-[#f5ecd8] bg-[#251e16] px-2 py-0.5 rounded border border-[#3e3223]">= 900</span>
            </div>
            <h4 className="text-xs font-serif font-bold text-[#f5ecd8]">Σαμπί (ϡ / Ͳ)</h4>
            <p className="text-xs text-[#8c7e6c] font-serif leading-normal">
              Καλύπτει την 9η θέση στις 9 εκατοντάδες (100–900). Προέρχεται από το αρχαϊκό San/Tsan και ολοκληρώνει τον κύκλο των εκατοντάδων στο 900.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#1c1712] border border-[#3a2e20] text-xs text-[#e6c670] font-serif leading-relaxed">
          💡 <strong>Ιστορική &amp; Αριθμητική Ταυτότητα:</strong> Επομένως, ιστορικά και αριθμητικά τα γράμματα αυτά <u>δεν θεωρούνται "ξένα σώματα" ή "επείσακτα"</u>, αλλά <strong>θεμελιώδη σύμβολα</strong> του κλασικού ελληνικού συστήματος γραφής και μέτρησης.
        </div>
      </div>

      {/* Polytonic Rules & Calculation Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rules */}
        <div className="p-5 rounded-2xl bg-[#15120f] border border-[#2d251e] space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold">
            Κανόνες Πολυτονικής Κανονικοποίησης
          </h3>
          <ul className="space-y-2 text-xs text-[#a69680] font-serif leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c89b3c] shrink-0 mt-0.5" />
              <span><strong>Τόνοι & Πνεύματα:</strong> Οξεία, βαρεία, περισπωμένη, ψιλή, δασεία και διαλυτικά αγνοούνται και το γράμμα λαμβάνει την κανονική του αξία (π.χ. ἄ, ὰ, ᾶ, ἁ -&gt; Α = 1).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c89b3c] shrink-0 mt-0.5" />
              <span><strong>Υπογεγραμμένη:</strong> Χαρακτήρες με υπογεγραμμένη (ᾳ, ῃ, ῳ) υπολογίζονται ως το κύριο φωνήεν (Α=1, Η=8, Ω=800).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c89b3c] shrink-0 mt-0.5" />
              <span><strong>Τελικό Σίγμα (ς):</strong> Το τελικό σίγμα λαμβάνει πάντα την ίδια αξία με το αρχικό/μεσαίο σίγμα (Σ/σ/ς = 200).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c89b3c] shrink-0 mt-0.5" />
              <span><strong>Σημεία Στίξης:</strong> Κόμματα, τελείες, άνω τελείες και παρενθέσεις εξαιρούνται αυτόματα από τον υπολογισμό.</span>
            </li>
          </ul>
        </div>

        {/* Step by step calculation example */}
        <div className="p-5 rounded-2xl bg-[#15120f] border border-[#2d251e] space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-[#e6c670] font-serif font-bold">
            Υπολογιστικό Παράδειγμα: «ΛΑΥΡΕΙΟΝ»
          </h3>
          <div className="p-3.5 rounded-xl bg-[#100e0b] border border-[#251e17] space-y-2 font-mono text-xs text-[#d6c7b2]">
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Λ (Λάμδα)</span>
              <strong className="text-[#e6c670]">= 30</strong>
            </div>
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Α (Άλφα)</span>
              <strong className="text-[#e6c670]">= 1</strong>
            </div>
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Υ (Ύψιλον)</span>
              <strong className="text-[#e6c670]">= 400</strong>
            </div>
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Ρ (Ρω)</span>
              <strong className="text-[#e6c670]">= 100</strong>
            </div>
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Ε (Έψιλον)</span>
              <strong className="text-[#e6c670]">= 5</strong>
            </div>
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Ι (Ιώτα)</span>
              <strong className="text-[#e6c670]">= 10</strong>
            </div>
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Ο (Όμικρον)</span>
              <strong className="text-[#e6c670]">= 70</strong>
            </div>
            <div className="flex justify-between border-b border-[#1f1913] pb-1.5">
              <span>Ν (Νι)</span>
              <strong className="text-[#e6c670]">= 50</strong>
            </div>
            <div className="flex justify-between pt-1 font-bold text-sm text-[#f5ecd8]">
              <span>ΣΥΝΟΛΟ</span>
              <span className="text-[#e6c670]">= 666 (χξϛ´)</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8c7e6c] font-serif">
            Πυθμένας (Ψηφιακή Ρίζα): 6 + 6 + 6 = 18 -&gt; 1 + 8 = <strong>9</strong>.
          </p>
        </div>
      </div>

      {/* Historical Anecdotes */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181512] to-[#12100d] border border-[#2d251e] space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-[#e6c670] font-serif font-bold">
          Ιστορικές Αναφορές στην Αρχαιότητα
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#a69680] font-serif leading-relaxed">
          <div className="p-4 rounded-xl bg-[#1a1612] border border-[#261e16] space-y-1.5">
            <strong className="text-[#f5ecd8] text-sm block">1. Το Γκράφιτι της Πομπηίας (79 μ.Χ.)</strong>
            <p>
              Σε τοίχο της αρχαίας Πομπηίας βρέθηκε χαραγμένη η επιγραφή: <em>«φιλῶ ἧς ἀριθμὸς φμε´»</em> (Αγαπώ εκείνη της οποίας ο λεξάριθμος είναι 545). Ο εραστής έκρυψε το όνομα της αγαπημένης του χρησιμοποιώντας τον αριθμό 545, αποδεικνύοντας ότι η ισοψηφία ήταν δημοφιλής στην καθημερινή ζωή.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#1a1612] border border-[#261e16] space-y-1.5">
            <strong className="text-[#f5ecd8] text-sm block">2. Σουητώνιος & Νέρων</strong>
            <p>
              Ο Ρωμαίος ιστορικός Σουητώνιος αναφέρει ότι στη Ρώμη κυκλοφορούσε ο στίχος <em>«Νέρων ἰδίαν μητέρα ἀπέκτεινε»</em> (1005), ο οποίος είχε το ίδιο ακριβώς λεξαριθμικό άθροισμα με τη φράση <em>«Νέρων»</em> σε συγκεκριμένη πτώση ή εναλλακτικό χαρακτηρισμό.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
