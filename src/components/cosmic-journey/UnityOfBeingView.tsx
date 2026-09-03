import React, { useState } from "react";
import {
  Flame,
  Shield,
  Sun,
  Activity,
  Sparkles,
  Calculator,
  Copy,
  Check,
  Share2,
  BookOpen,
  Waves,
  Clock,
  Compass,
  Zap,
  Search,
  CheckCircle2,
} from "lucide-react";

interface UnityOfBeingViewProps {
  onSelectWordForCalculator?: (word: string) => void;
}

export const UnityOfBeingView: React.FC<UnityOfBeingViewProps> = ({
  onSelectWordForCalculator,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "apocalypse" | "isopsephy" | "frequency">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sections = [
    {
      id: "sec-1",
      number: "1",
      category: "apocalypse",
      title: "Ο Κλειδάριθμος 1318 και η Πύλη της Γνώσης",
      subtitle: "Η λέξη «Η ΑΠΟΚΑΛΥΨΗ» ως μαθηματικός κώδικας",
      icon: BookOpen,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300",
      content: `Η πνευματική αφύπνιση ξεκινά από τον ίδιο τον τίτλο του ιερού βιβλίου. Η λέξη Η ΑΠΟΚΑΛΥΨΗ λειτουργεί ως ο μαθηματικός κώδικας που ξεκλειδώνει τη θύρα της αλήθειας.`,
      keyEquation: "Η (8) + Α (1) + Π (80) + Ο (70) + Κ (20) + Α (1) + Λ (30) + Υ (400) + Ψ (700) + Η (8) = 1318",
      words: ["Η ΑΠΟΚΑΛΥΨΗ"],
      highlight: "Ο αριθμός 1318 οδηγεί με απόλυτη ακρίβεια στο Κεφάλαιο 13 και τον Στίχο 18 της Αποκαλύψεως (13:18).",
    },
    {
      id: "sec-2",
      number: "2",
      category: "apocalypse",
      title: "Το Χωρίο 13:18 της Αποκαλύψεως",
      subtitle: "«Ὧδε ἡ σοφία ἐστίν...» — Σοφία, Νους και Ιερή Ψήφιση",
      icon: Shield,
      color: "from-sky-500/20 to-blue-500/20 border-sky-500/40 text-sky-300",
      content: `Ο Ιωάννης ο Ευαγγελιστής παραθέτει το κλειδί της πνευματικής ψήφισης:\n«Ὧδε ἡ σοφία ἐστίν· ὁ ἔχων νοῦν ψηφισάτω τὸν ἀριθμὸν τοῦ θηρίου· ἀριθμὸς γὰρ ἀνθρώπου ἐστί· καὶ ὁ ἀριθμὸς αὐτοῦ χξς΄.»\n\nΣε αυτό το σημείο, τίθενται οι βάσεις της γνώσης:\n• Η Σοφία: Αντιστοιχεί στη ΘΕΑ ΑΘΗΝΑ.\n• Ο Νους: Αντιστοιχεί στον ΘΕΟ ΔΙΑ ΖΕΥΣ.\n• Η Ψήφιση: Η ιερή πράξη του αριθμητικού υπολογισμού της αλήθειας.`,
      keyEquation: "Σοφία (Αθηνά) + Νους (Ζευς) + Ψήφιση ➔ Αιγίς (Δίας, Αθηνά, Απόλλων)",
      words: ["ΣΟΦΙΑ", "ΝΟΥΣ", "ΑΘΗΝΑ", "ΖΕΥΣ", "ΑΙΓΙΣ"],
      highlight: "Οι τρεις οντότητες που φέρουν την Αιγίδα (Δίας, Αθηνά, Απόλλων) είναι οι μοναδικοί κάτοχοι της θείας αυθεντίας για την αποκωδικοποίηση.",
    },
    {
      id: "sec-3",
      number: "3",
      category: "isopsephy",
      title: "Το Τετράγωνο του Ηλίου και η Φύση του ΧΞΣ (666)",
      subtitle: "Η ηλιακή ισχύς στην ύλη υπό την εποπτεία του Απόλλωνος",
      icon: Sun,
      color: "from-amber-500/20 to-yellow-500/20 border-yellow-500/40 text-yellow-300",
      content: `Ο αριθμός Χίξι Στίγμα (χξς΄) αποτελεί την αριθμητική αποτύπωση της ηλιακής ισχύος στην ύλη.\n• Γεωμετρία: Το Μαγικό Τετράγωνο του Ηλίου (6 × 6) απαρτίζεται από 36 τετράγωνα.\n• Άθροισμα Ύλης: 1 + 2 + 3 + ... + 36 = 666.\n• Ηλιακή Σταθερά: Κάθε σειρά, στήλη και διαγώνιος αθροίζει στο 111 (111 × 6 = 666).`,
      keyEquation: "1 + 2 + 3 + ... + 36 = 666 (6 × 111 = 666)",
      words: ["ΧΞΣ", "ΗΛΙΟΣ", "ΑΠΟΛΛΩΝ"],
      highlight: "Αυτή είναι η «αριθμητική ανθρώπου», η υλική βάση που περιμένει τη θεία μετουσίωση υπό την προστασία της Αιγίδας.",
    },
    {
      id: "sec-4",
      number: "4",
      category: "apocalypse",
      title: "Η Αποκάλυψη 9:17-18 και οι Τρεις Άγγελοι",
      subtitle: "ΤΡΙΩΝ ΑΓΓΕΛΩΝ ΤΟΥ ΘΑΝΑΤΙΚΟΥ (2368) — Πυρ, Καπνός και Θείον",
      icon: Flame,
      color: "from-red-500/20 to-orange-500/20 border-red-500/40 text-red-300",
      content: `Η πνευματική κάθαρση εκδηλώνεται μέσα από τη δράση των ΤΡΙΩΝ ΑΓΓΕΛΩΝ ΤΟΥ ΘΑΝΑΤΙΚΟΥ (2368):\n«...καὶ ἐκ τῶν στομάτων αὐτῶν ἐκπορεύεται πῦρ καὶ καπνὸς καὶ θεῖον. ἀπὸ τῶν τριῶν πληγῶν τούτων ἀπεκτάνθησαν τὸ τρίτον τῶν ἀνθρώπων...»\n\nΤα τρία στοιχεία του Απολλύωνος για την απολύμανση της κτίσης:\n• ΠΥΡ (Φώτα): Η πρωταρχική ενέργεια που κατακαίει την πλάνη.\n• ΚΑΠΝΟΣ: Η μετουσίωση της ύλης σε πνευματική ουσία.\n• ΘΕΙΟΝ: Η απόλυτη απολύμανση και ο εξαγνισμός της υπάρξεως.`,
      keyEquation: "ΤΡΙΩΝ ΑΓΓΕΛΩΝ ΤΟΥ ΘΑΝΑΤΙΚΟΥ = 2368 (Πυρ + Καπνός + Θείον)",
      words: ["ΤΡΙΩΝ ΑΓΓΕΛΩΝ ΤΟΥ ΘΑΝΑΤΙΚΟΥ", "ΠΥΡ", "ΚΑΠΝΟΣ", "ΘΕΙΟΝ"],
      highlight: "Εργαλεία καθάρσεως για την απόλυτη απολύμανση και τον εξαγνισμό της ανθρώπινης υπάρξεως.",
    },
    {
      id: "sec-5",
      number: "5",
      category: "isopsephy",
      title: "Ο Αρχάγγελος Μιχαήλ και η Ένωση του 2368",
      subtitle: "«ΚΑΙ Ο ΑΡΙΘΜΟΣ ΑΥΤΟΥ» = 1702 = ΑΡΧΑΓΓΕΛΟΣ ΜΙΧΑΗΛ",
      icon: Zap,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
      content: `Η πνευματική ολοκλήρωση επιτυγχάνεται στην κατακλείδα του στίχου 13:18:\n«ΚΑΙ Ο ΑΡΙΘΜΟΣ ΑΥΤΟΥ»:\nΚΑΙ (31) + Ο (70) + ΑΡΙΘΜΟΣ (430) + ΑΥΤΟΥ (1171) = 1702.\n\nΟ λεξάριθμος αυτός ταυτίζεται επακριβώς με τον:\nΑΡΧΑΓΓΕΛΟΣ ΜΙΧΑΗΛ:\nΑΡΧΑΓΓΕΛΟΣ (1013) + ΜΙΧΑΗΛ (689) = 1702.\n\nΌταν ο Αρχάγγελος Μιχαήλ «ζώνει» το ηλιακό τετράγωνο (666) μέσω του Πυρός, του Καπνού και του Θείου:`,
      keyEquation: "1702 (Αρχάγγελος Μιχαήλ) + 666 (Χίξι Στίγμα) = 2368 (ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ)",
      words: ["ΑΡΧΑΓΓΕΛΟΣ ΜΙΧΑΗΛ", "ΚΑΙ Ο ΑΡΙΘΜΟΣ ΑΥΤΟΥ", "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ"],
      highlight: "1702 + 666 = 2368: Η θεία εξίσωση της Αποκαλύψεως που αποκαλύπτει το Πρόσωπο του Ιησού Χριστού.",
    },
    {
      id: "sec-6",
      number: "6",
      category: "isopsephy",
      title: "Η Ιερά Οδός και η Ενότητα των Μορφών (2368)",
      subtitle: "Οι εκφάνσεις του ΑΕΙ ΩΝ στο σήμερα μέσω του Ιωάννη Βελούδου",
      icon: Sparkles,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
      content: `Η ισοψηφία του 2368 αποδεικνύει την απόλυτη ενότητα των θείων εκφάνσεων υπό τον ΑΕΙ ΩΝ (ΑΙΩΝ):\n\n• ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ = 2368\n• Η ΙΕΡΑ ΟΔΟΣ ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ = 2368\n• Η ΑΛΗΘΙΝΗ ΟΔΟΣ ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ = 2368\n• ΙΩΑΝΝΗΣ + ΤΟ «Ε» ΕΝ ΔΕΛΦΟΙΣ = 2368 (Ένωση Δελφικής μύησης με τον Λόγο)\n• Ο ΤΕΛΕΙΟΣ ΥΠΕΡΚΥΒΕΡΝΗΤΗΣ = 2368\n• ΤΟ ΑΓΙΟΝ ΠΝΕΥΜΑ ΤΟΥ ΗΛΙΟΥ = 2368\n• ΟΛΑ ΑΥΤΑ ΠΟΥ ΞΕΡΕΙΣ ΕΙΝΑΙ Ο ΠΑΤΗΡ = 2368\n• ΜΕΤΑΒΑΛΛΟΜΕΝΟΝ ΗΛΕΚΤΡΟΜΑΓΝΗΤΙΚΟΝ ΠΕΔΙΟΝ = 2368\n• ΔΙΑΓΑΛΑΞΙΑΚΗ ΕΙΡΗΝΗ = 2368`,
      keyEquation: "Η ΙΕΡΑ ΟΔΟΣ ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ = 2368 = ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ",
      words: [
        "Η ΙΕΡΑ ΟΔΟΣ ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ",
        "Η ΑΛΗΘΙΝΗ ΟΔΟΣ ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ",
        "Ο ΤΕΛΕΙΟΣ ΥΠΕΡΚΥΒΕΡΝΗΤΗΣ",
        "ΤΟ ΑΓΙΟΝ ΠΝΕΥΜΑ ΤΟΥ ΗΛΙΟΥ",
        "ΔΙΑΓΑΛΑΞΙΑΚΗ ΕΙΡΗΝΗ",
      ],
      highlight: "Ο ΤΕΛΕΙΟΣ ΥΠΕΡΚΥΒΕΡΝΗΤΗΣ (2368) ρυθμίζει το ΜΕΤΑΒΑΛΛΟΜΕΝΟΝ ΗΛΕΚΤΡΟΜΑΓΝΗΤΙΚΟΝ ΠΕΔΙΟΝ (2368), εγκαθιδρύοντας τη Διαγαλαξιακή Ειρήνη.",
    },
  ];

  const cymaticsPoints = [
    {
      title: "1. Το Πείραμα της Κυματικής (Cymatics) και ο Χώρος",
      icon: Waves,
      text: "Η μέτρηση των 432 Hz ως «Φυσικής Συχνότητας» διεξάγεται ιδανικά σε Σφαιρικό ή Κυκλικό δίσκο (Chladni Plate). Η σφαίρα επιτρέπει στον παλμό να αντανακλάται ομοιόμορφα προς το κέντρο, δημιουργώντας τέλειο συντονισμό χωρίς ενεργειακές απώλειες. Σε σφαιρικό δοχείο με νερό ή δίσκο με άμμο, σχηματίζονται ιερά γεωμετρικά σχήματα (εξάγωνο, διπλός υπερκύβος) μαθηματικά ευθυγραμμισμένα με τη δομή του σύμπαντος.",
    },
    {
      title: "2. Η Μαθηματική Σχέση 13 και 18 (Το 234 & 432)",
      icon: Calculator,
      text: "Από την Αποκάλυψη 13:18:\n• 13 × 18 = 234.\n• Στην κυματική, κάθε συχνότητα έχει τον συζυγή της παλμό. Ο αριθμός 234 είναι ο καθρέπτης του 432 (234 ⇄ 432).\n• Αν προσθέσουμε τον παλμό (234) με την πηγή (432): 234 + 432 = 666 (ο αριθμός του Ηλιακού Τετραγώνου). Αυτό αποδεικνύει ότι τα 432 Hz είναι η συχνότητα μέσω της οποίας ο Ήλιος (Απόλλων) οργανώνει την ύλη.",
    },
    {
      title: "3. Η Σύνδεση με τον Χρόνο και το Δευτερόλεπτο",
      icon: Clock,
      text: "Μια πλήρης γήινη ημέρα έχει 86.400 δευτερόλεπτα. Διαιρώντας δια 2:\n86.400 / 2 = 43.200.\nΟ αριθμός 432 είναι ο θεμέλιος λίθος χώρου και χρόνου. Στο πλατωνικό δωδεκάεδρο (που συμβολίζει το Σύμπαν), όλες οι γωνίες και οι αποστάσεις συντονίζονται σε υποπολλαπλάσια του 432.",
    },
    {
      title: "4. Γιατί τα 432 Hz είναι ο «Συντονισμός της Αρμονίας»",
      icon: Compass,
      text: "Σε αντίθεση με τη δυσαρμονική νόρμα των 440 Hz που προκαλεί σύγχυση, τα 432 Hz:\n• Συντονίζονται με τον Χρυσό Κανόνα (Φ).\n• Ευθυγραμμίζονται με τη συχνότητα της καρδιάς και την αναπνοή της Γης (Schumann Resonance).\n• Δημιουργούν καθαρότητα στο ηλεκτρομαγνητικό πεδίο, επιτρέποντας στον άνθρωπο να λειτουργεί ως Θεραπευτής μέσω της παρουσίας του.",
    },
  ];

  const filteredSections = sections.filter((sec) => {
    if (activeFilter !== "all" && sec.category !== activeFilter) return false;
    if (searchTerm.trim() === "") return true;
    const term = searchTerm.toLowerCase();
    return (
      sec.title.toLowerCase().includes(term) ||
      sec.subtitle.toLowerCase().includes(term) ||
      sec.content.toLowerCase().includes(term) ||
      sec.keyEquation.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-amber-500/30 p-5 sm:p-7 shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              ΚΩΔΙΚΟΠΟΙΗΣΗ ΙΩΑΝΝΗ ΒΕΛΟΥΔΟΥ • ΔΙΣΚΟΣ ΤΗΣ ΦΑΙΣΤΟΥ
            </div>

            <button
              onClick={() =>
                handleCopy(
                  `Η ΑΠΟΚΑΛΥΨΗ = 1318\n1702 (Αρχάγγελος Μιχαήλ) + 666 (ΧΞΣ) = 2368 (ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ)\n13 × 18 = 234 ⇄ 432 (234 + 432 = 666)\nΗ ΙΕΡΑ ΟΔΟΣ ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ = 2368`,
                  "main-header"
                )
              }
              className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedId === "main-header" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Αντιγράφηκε!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Αντιγραφή Βασικών Εξισώσεων</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Η Ενότητα του Όντος
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-1 font-medium max-w-3xl">
              Ο Κλειδάριθμος 1318, ο Αρχάγγελος Μιχαήλ (1702), το Ηλιακό Τετράγωνο (666), η
              Σταθερά 2368 και η Κυματική Συχνότητα των 432 Hz.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-amber-500/20 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-amber-400/80">Κλειδάριθμος</span>
              <span className="text-lg font-extrabold text-amber-300">1318</span>
              <span className="text-[10px] text-zinc-400 truncate">Η ΑΠΟΚΑΛΥΨΗ (13:18)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-purple-500/20 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-purple-400/80">Μιχαήλ & ΧΞΣ</span>
              <span className="text-lg font-extrabold text-purple-300">1702 + 666</span>
              <span className="text-[10px] text-zinc-400 truncate">«ΚΑΙ Ο ΑΡΙΘΜΟΣ ΑΥΤΟΥ»</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-emerald-500/20 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-emerald-400/80">Σταθερά Ένωσης</span>
              <span className="text-lg font-extrabold text-emerald-300">2368</span>
              <span className="text-[10px] text-zinc-400 truncate">ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ</span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-sky-500/20 flex flex-col">
              <span className="text-[10px] uppercase font-bold text-sky-400/80">Κυματική Συχνότητα</span>
              <span className="text-lg font-extrabold text-sky-300">432 Hz ⇄ 234</span>
              <span className="text-[10px] text-zinc-400 truncate">234 + 432 = 666</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            Όλες οι Ενότητες (6)
          </button>
          <button
            onClick={() => setActiveFilter("apocalypse")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "apocalypse"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            Αποκάλυψη (13:18 & 9:17)
          </button>
          <button
            onClick={() => setActiveFilter("isopsephy")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "isopsephy"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            Ισοψηφία (1702, 666, 2368)
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Αναζήτηση στην Ενότητα του Όντος..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/60 focus:border-amber-500 text-xs text-zinc-200 placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Sections Grid / List */}
      <div className="space-y-6">
        {filteredSections.map((sec) => {
          const IconComp = sec.icon;
          return (
            <div
              key={sec.id}
              className="rounded-2xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden shadow-lg hover:border-zinc-700/80 transition-all p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.color} flex items-center justify-center border font-extrabold text-sm`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                        ΕΝΟΤΗΤΑ {sec.number}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">{sec.title}</h3>
                    <p className="text-xs text-zinc-400 font-medium">{sec.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCopy(`${sec.title}\n${sec.content}\n${sec.keyEquation}`, sec.id)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Αντιγραφή ενότητας"
                  >
                    {copiedId === sec.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Main Body */}
              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                {sec.content}
              </div>

              {/* Formula Callout Card */}
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-mono font-bold text-xs sm:text-sm text-amber-300">
                    {sec.keyEquation}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(sec.keyEquation, `eq-${sec.id}`)}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 font-medium self-start sm:self-auto cursor-pointer"
                >
                  {copiedId === `eq-${sec.id}` ? "Αντιγράφηκε" : "Αντιγραφή εξίσωσης"}
                </button>
              </div>

              {/* Highlight Note */}
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{sec.highlight}</span>
              </div>

              {/* Words for Calculator */}
              {sec.words && sec.words.length > 0 && onSelectWordForCalculator && (
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-zinc-500 mr-1 flex items-center gap-1">
                    <Calculator className="w-3 h-3 text-amber-400" />
                    Ισοψηφία:
                  </span>
                  {sec.words.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectWordForCalculator(w)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/50 text-[11px] text-amber-300 font-bold transition-all cursor-pointer"
                      title="Υπολογισμός στο κομπιουτεράκι"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cymatics 432 Hz Research Section */}
      <div className="rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-sky-500/40 p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
                <Activity className="w-3.5 h-3.5" />
                ΚΥΜΑΤΙΚΗ & ΓΕΩΜΕΤΡΙΑ ΤΟΥ ΧΩΡΟΥ
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                Η Έρευνα για τη Συχνότητα των 432 Hz
              </h3>
            </div>
          </div>

          <button
            onClick={() =>
              handleCopy(
                `13 × 18 = 234\n234 ⇄ 432 (Καθρεπτισμός)\n234 + 432 = 666 (Ηλιακό Τετράγωνο)\n86.400 / 2 = 43.200 (Δευτερόλεπτα Ημέρας)\n432 Hz = Συντονισμός Αρμονίας (Φ, Schumann Resonance)`,
                "cymatics-copy"
              )
            }
            className="px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/40 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            {copiedId === "cymatics-copy" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Αντιγράφηκε!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>Αντιγραφή Δεδομένων 432 Hz</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Pillars of Cymatics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cymaticsPoints.map((pt, index) => {
            const IconC = pt.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2 hover:border-sky-500/30 transition-all"
              >
                <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
                  <IconC className="w-4 h-4 text-sky-400" />
                  <h4>{pt.title}</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                  {pt.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Conclusion Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-sky-950/40 via-amber-950/30 to-purple-950/40 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4>Το Συμπέρασμα της Ενώσεως</h4>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
            Το πείραμα σε σφαιρικό χώρο απέδειξε ότι στα 432 Hz η ενέργεια δεν συγκρούεται, αλλά ρέει.
            Αυτή είναι η βάση της Ιεράς Οδού. Όταν ο ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ εκφέρει τον Λόγο σε αυτή τη
            συχνότητα, το Μεταβαλλόμενον Ηλεκτρομαγνητικόν Πεδίον (2368) καθαρίζεται ακαριαία,
            εγκαθιδρύοντας τη Διαγαλαξιακή Ειρήνη.
          </p>
        </div>
      </div>
    </div>
  );
};
