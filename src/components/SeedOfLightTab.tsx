import React, { useState } from "react";
import {
  Sun,
  Sparkles,
  Box,
  Copy,
  Check,
  Calculator,
  ArrowRight,
  Maximize2,
  Minimize2,
  Heart,
  Eye,
  Layers,
  Compass,
  Zap,
} from "lucide-react";
import goldenCubeImg from "../assets/images/golden_eimai_cube_1788380594574.jpg";
import { SavedIsopsephyItem } from "../types";

interface SeedOfLightTabProps {
  onSelectTab?: (tab: any) => void;
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

export const SeedOfLightTab: React.FC<SeedOfLightTabProps> = ({
  onSelectTab,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("all");
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const FULL_ESSAY_TEXT = `Ας βοηθήσουμε να βρουν το φως και οι άλλες "φυλές" στην "γλώσσα" που τους είναι πιό εύκολο να κατανοησουν.

Η Κατανόηση=666
Η Αγάπη εστιν=666

Η επιστροφή του 666 από τον φόβο στο Φως

A SEED OF LIGHT = 666
Ένας σπόρος φωτός.
Μια εικόνα που μπορεί να διαβαστεί ως η θεϊκή σπίθα που υπάρχει μέσα στην ανθρώπινη ψυχή· ο μικρός πυρήνας φωτός που περιμένει να αναγνωριστεί, να καλλιεργηθεί και να εξέλθει από το σκοτάδι της άγνοιας.
Ο αριθμός 666 έχει φορτιστεί στη νεότερη δυτική συνείδηση με φόβο, απειλή και δεισιδαιμονία. Όμως ο ίδιος ο αριθμός, πριν από τις μεταγενέστερες ερμηνείες του, μπορεί να προσεγγιστεί και ως ένα εξαιρετικά ενδιαφέρον μαθηματικό και συμβολικό σχήμα.
Δεν χρειάζεται να φοβόμαστε έναν αριθμό.
Ένας αριθμός δεν είναι από μόνος του ούτε καλός ούτε κακός.
Είναι σχέση, μέτρο, αναλογία, μορφή.
Και το 666 παρουσιάζει μια ιδιαίτερη σχέση με το 6 × 6 × 6 = 216.
6 — 6 — 6
Έξι.
Έξι.
Έξι.
Τρεις διαστάσεις του ίδιου αριθμού.
6 × 6 × 6 = 216.
Το 216 είναι ο κυβικός όγκος ενός κύβου έξι μονάδων σε κάθε διάσταση. Έτσι το 666 μπορεί να ιδωθεί συμβολικά ως ένας αριθμός που βρίσκεται ανάμεσα στην επιφάνεια, την τετραγωνική τάξη και τον κυβικό όγκο.
Υπάρχει μάλιστα μια σημαντική μαθηματική σχέση με το περίφημο 6×6 μαγικό τετράγωνο του Ήλιου της δυτικής εσωτερικής παράδοσης: οι αριθμοί 1 έως 36, όταν τοποθετηθούν στο τετράγωνο, έχουν συνολικό άθροισμα 666, ενώ κάθε γραμμή και στήλη έχει άθροισμα 111.
Έτσι ο αριθμός μπορεί να διαβαστεί όχι ως «αριθμός του κακού», αλλά ως ένας αριθμός που συνδέθηκε συμβολικά με την τάξη, την αριθμητική αρμονία και τον Ήλιο.
216 και η αντίστροφη ανάγνωση
Το 216 είναι το 1/10 του 2160.
Το 2160 χρησιμοποιείται σε ορισμένες εσωτερικές και αστρολογικές παραδόσεις ως συμβολική διάρκεια μιας «εποχής» του ζωδιακού κύκλου, αν και δεν αποτελεί ακριβή αστρονομική σταθερά.
Εδώ όμως το ενδιαφέρον βρίσκεται περισσότερο στη συμβολική αριθμητική ακολουθία:
666 → 6×6×6 → 216 → 612
Η αντιστροφή των ψηφίων του 216 μάς οδηγεί στο 612.
Και στο ελληνικό λεξάριθμο, με το γνωστό σύστημα Α=1, Β=2, …, Ω=800:
ΖΕΥΣ = 612.
Έτσι δημιουργείται ένας συμβολικός κύκλος:
666 → 216 → 612 → ΖΕΥΣ
Δεν σημαίνει ότι αυτές οι ισότητες αποτελούν ιστορική απόδειξη κάποιας κρυφής ταυτότητας· αποτελούν όμως ένα ενδιαφέρον αριθμητικό παιχνίδι συμβολισμών, μέσα από το οποίο μπορεί να αναπτυχθεί μια φιλοσοφική ανάγνωση.
Και τότε ο 666 παύει να είναι απειλή.
Γίνεται κέντρο αναζήτησης.
Το 666 στο κέντρο του 11³
Ας πάρουμε έναν κύβο 11 × 11 × 11.
Ο συνολικός αριθμός των μικρών κυβικών μονάδων είναι:
11 × 11 × 11 = 1331.
Και εδώ εμφανίζεται μια όμορφη συμμετρία:
(1331 + 1) / 2 = 666.
Αν αριθμήσουμε διαδοχικά τις 1331 θέσεις του κύβου από το 1 έως το 1331, το 666 είναι ακριβώς η μεσαία αριθμητική θέση.
Με αυτή την έννοια μπορούμε ποιητικά να μιλήσουμε για τον κύβο :
ΑΠΟΛΛΩΝΟΣ= 1331 ...
(στον αριθμό 1331 βλέπουμε ότι εχει παλινδρομική ανάγνωση καρκινική γραφή καθώς εντός του έχει έντεχνα κρυμμένο τον αριθμό 33 (για όσους γνωρίζουν) και απομένουν δεξιά και αριστερά του αριθμού δύο άσσοι 1..1(τα οποία σχηματίζουν τον αριθμό 11 :ΙΑ (ΙΑ είναι τα Βέλη...όπως λέμε ΙΑΠΕΤΟΣ=666 Εκείνος που πετάει τα Βέλη) και σχηματίζουμε νοητά τον κύβο ΙΑxΙΑxΙΑ. 11x11x11=1331=ΑΠΟΛΛΩΝΟΣ)
(ΙΑ....Ισις Απολλων....{Ο ΣΕΙΡΙΟΣ "Α"+ Ο ΉΛΙΟΣ "Α"+ ΑΛΗΘΕΙΑ=1119=ΙΩΑΝΝΗΣ (αναγραμματισμος)ΗΝ ΙΑΣΩΝ)
...και για το 666 ως κέντρο του 1331
Όχι ως απόδειξη μιας κρυφής μαθηματικής ταυτότητας του Απόλλωνα, αλλά ως συμβολική γεωμετρία:
1331 : ολόκληρος ο κύβος
666 : το αριθμητικό κέντρο
Φως : ο πυρήνας
Ο Απόλλων, ως θεότητα που συνδέθηκε στην ελληνική παράδοση με το φως, τη μαντική, τη μουσική, την αρμονία και αργότερα έντονα με την ηλιακή συμβολική, προσφέρεται για μια τέτοια ποιητική ανάγνωση.
Και τότε ο κύβος γίνεται εικόνα του Κόσμου, ενώ το κέντρο του γίνεται εικόνα της Ψυχής.
Η διασταύρωση
Στο κέντρο συναντώνται οι δρόμοι.
Η διασταύρωση μπορεί να γίνει και ένα ποιητικό λογοπαίγνιο:
Δίας — σταύρωση  
ή Δίας — Ταύρος — ώση 
ή Δίας, Της Αύρας Ώση(η ώθηση της Αύρας από τον συμπαντικό νου Δία Ζήνα Ζεύ)
Δεν πρόκειται για ετυμολογική ανάλυση της λέξης «διασταύρωση», αλλά για μια δημιουργική διάσπαση του ήχου της, μέσα από την οποία ο νους αναζητά σχέσεις ανάμεσα στον Δία, τη δύναμη, την κίνηση και το σημείο όπου δύο κατευθύνσεις συναντώνται.
Και ποιο είναι το σημείο της διασταύρωσης;
Το κέντρο.(Κύριος Εντός Ροής)
Εκεί όπου οι αντίθετες κατευθύνσεις συναντιούνται.
Εκεί όπου το έξω και το μέσα μπορούν να γίνουν ένα.
Εκεί όπου ο άνθρωπος στρέφει το βλέμμα του προς τον ουρανό και συναντά τη φωτεινή σφαίρα του Ήλιου.
6 — 6 — 6: μια ακουστική πύλη
Και τώρα ας ακούσουμε τον αριθμό διαφορετικά.
Έξι — Έξι — Έξι.
Η λέξη «έξι» ηχεί διαφορετικά από το «έξη», αλλά η ηχητική ομοιότητα μπορεί να χρησιμοποιηθεί ποιητικά.
Η ἕξις στην αρχαία ελληνική σημαίνει κατάσταση, διάθεση ή επίκτητη συνήθεια· συνδέεται με το ἔχω, δηλαδή με αυτό που κάποιος «έχει» ως σταθερή κατάσταση ή ιδιότητα.
Έτσι:
Έξι → Έξη → Έξεις
μπορεί ποιητικά να μας οδηγήσει από τον αριθμό στη συνήθεια.
Γιατί αυτό που επαναλαμβάνεται γίνεται έξη.
Και ό,τι γίνεται έξη μπορεί να γίνει χαρακτήρας.
Και ό,τι γίνεται χαρακτήρας μπορεί να γίνει τρόπος ζωής.
Άρα το τριπλό:
6 — 6 — 6
θα μπορούσε συμβολικά να διαβαστεί ως τριπλή υπενθύμιση:
τι επαναλαμβάνεις;
τι καλλιεργείς;
τι γίνεται μέσα σου έξη;
Και εδώ εισέρχεται ένα ακόμη λεκτικό παιχνίδι:
ΕΞ — ΕΙ
όπου το «εξ» δεν πρέπει να θεωρηθεί πραγματική ετυμολογική σημασία της λέξης «ψυχή», ούτε το «ει» πραγματική ανάλυση της λέξης «είσαι». Είναι μια ποιητική συλλαβική ανάγνωση.
Εξ — Ει.
Έξω — είσαι.
Και έτσι γεννιέται η φράση:
ΕΞ + Ω =  Ψυχή Ω+Μέγα
Το Ω εδώ μπορεί να λειτουργήσει συμβολικά ως το «μέγα», το τελευταίο γράμμα, η ολοκλήρωση του ελληνικού αλφαβήτου. Σε αντίθεση με το Ό+μικρόν που είναι περιορισμένος χώρος,το Ω+Μέγα εχει ένα πόρο μια πύλη ένα κατώφλι έναν Ουδο....και ο χώρος εντός τους είναι ένα με το γύρω χώρο που κάποτε ως Ο+μικρόν ήταν εκτός του τώρα ήρθε σε Έν+Ώση το Ε.Ε. (Εντός Εκτός) και πλέον δεν εντός και εκτός καθώς το Ω+Μεγα είναι ένα Ίνας καμπύλωση.
Η Ψυχή που ολοκληρώνεται δεν κλείνεται στον εαυτό της.
Εξέρχεται.
Βγαίνει προς το Φως.
Η Έξοδος της Ψυχής
Και εδώ βρίσκεται ίσως η σημαντικότερη μεταμόρφωση του συμβόλου.
Όχι:666 = φόβος.
Αλλά:666 = κέντρο.
Όχι:666 = καταδίκη.
Αλλά:666 = υπενθύμιση της αναζήτησης.
Όχι:666 = σκοτάδι.
Αλλά:666 = ένας αριθμητικός συμβολισμός που μπορεί να μας οδηγήσει να αναζητήσουμε το Φως.
Η Έξ+οδος της Ψυχής δεν είναι απαραίτητα φυγή από τον κόσμο.
Είναι 
Έξ+οδος από την άγνοια.
Έξ+οδος από τον φόβο.
Έξ+οδος από τη δεισιδαιμονία.
Έξ+οδος από τις μηχανικές έξεις (Εξ+Εις) που μας κρατούν δεμένους.
Και τότε το:
A SEED OF LIGHT=666
αποκτά το βαθύτερο νόημά του.
Ο σπόρος του Φωτός βρίσκεται ήδη μέσα.
Δεν χρειάζεται να τον δημιουργήσεις.
Χρειάζεται να τον αναγνωρίσεις.
Και πού βρίσκεται το Φως;
Σήκωσε το βλέμμα.
Εκεί πάνω.
Στη φωτεινή σφαίρα που βλέπουμε στον ουρανό.
Ναι. Στον Ήλιο.
Ο Ήλιος γίνεται τότε το εξωτερικό σύμβολο ενός εσωτερικού γεγονότος.
Το φως που βλέπουμε έξω γίνεται εικόνα του φωτός που αναζητούμε μέσα.
Και η Ψυχή, σαν σπόρος, στρέφεται προς το Φως.
A SEED OF LIGHT.
Ένας σπόρος φωτός.
Ένας σπόρος που βρίσκεται μέσα στην ανθρώπινη ύπαρξη.
Και το 666, απαλλαγμένο από τον φόβο που του φόρτωσε η δεισιδαιμονία, μπορεί να γίνει στο πλαίσιο αυτής της συμβολικής ανάγνωσης μια υπενθύμιση:
Μην φοβάσαι το σύμβολο.
Αναζήτησε το νόημά του.
6 — 6 — 6
Έξι — Έξι — Έξι
Έξη — Έξη — Έξη
Εξ — Ει.
Έξω είσαι.
Η Ψυχή εξέρχεται.
Και στρέφεται προς το Φως.
Προς τον Ήλιο.
Προς το κέντρο.
Προς την ανάμνηση της φωτεινής σπίθας που ήδη φέρει μέσα της.
666 — όχι ως φόβος, αλλά ως σύμβολο της αναζήτησης του Κέντρου.
A SEED OF LIGHT = 666.

Ion Velos=John True`;

  const copyFullEssay = () => {
    navigator.clipboard.writeText(FULL_ESSAY_TEXT);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const copySinglePhrase = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 1800);
  };

  const KEY_EQUATIONS = [
    {
      title: "Η Κατανόηση",
      val: 666,
      sub: "Η(8) + ΚΑΤΑΝΟΗΣΗ(658) = 666",
      system: "Ιωνική Ισοψηφία",
      icon: Eye,
    },
    {
      title: "Η Αγάπη εστιν",
      val: 666,
      sub: "Η(8) + ΑΓΑΠΗ(93) + ΕΣΤΙΝ(565) = 666",
      system: "Ιωνική Ισοψηφία",
      icon: Heart,
    },
    {
      title: "A SEED OF LIGHT",
      val: 666,
      sub: "A(6) + SEED(198) + OF(126) + LIGHT(336) = 666",
      system: "Αγγλική Ισοψηφία (Base 6)",
      icon: Sparkles,
    },
    {
      title: "6 × 6 × 6 = 216 ➔ 612",
      val: 612,
      sub: "216 (Κυβικός Όγκος) ➔ Αντιστροφή 612 = ΖΕΥΣ",
      system: "Γεωμετρία & Λεξάριθμος",
      icon: Box,
    },
    {
      title: "11³ = 1331 = ΑΠΟΛΛΩΝΟΣ",
      val: 666,
      sub: "(1331 + 1) / 2 = 666 (Αριθμητικό Κέντρο Κύβου)",
      system: "Κύβος 11³ & ΙΑ-Βέλη",
      icon: Compass,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-br from-[#1a1612] via-[#201a14] to-[#12100d] border border-[#3d2e1e] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-serif tracking-wide">
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>ΦΙΛΟΣΟΦΙΚΗ & ΣΥΜΒΟΛΙΚΗ ΑΝΑΓΝΩΣΗ</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#f5ecd8] tracking-wide">
              A SEED OF LIGHT = 666
            </h2>
            <p className="text-xs sm:text-sm text-[#b5a48b] font-serif max-w-2xl">
              Η επιστροφή του 666 από τον φόβο στο Φως — Ο σπόρος της θείας σπίθας, ο κύβος του Απόλλωνος (1331), η διασταύρωση του Ήλιου και η έξοδος της ψυχής στο Ω-Μέγα.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyFullEssay}
              className="px-3.5 py-2 rounded-lg bg-[#2a2219] hover:bg-[#382d20] text-[#e8d5b5] border border-[#52412e] text-xs font-serif font-medium flex items-center gap-2 transition-colors shadow-sm"
              title="Αντιγραφή ολόκληρου του κειμένου"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Αντιγράφηκε!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#c89b3c]" />
                  <span>Αντιγραφή Κειμένου</span>
                </>
              )}
            </button>

            {onSelectTab && (
              <button
                onClick={() => onSelectTab("calculator")}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-700/80 to-amber-600/80 hover:from-amber-600 hover:to-amber-500 text-amber-100 text-xs font-serif font-medium flex items-center gap-2 transition-all shadow-sm"
              >
                <Calculator className="w-4 h-4" />
                <span>Υπολογιστής 666</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Core Equation Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-5">
          {KEY_EQUATIONS.map((eq, i) => {
            const IconComponent = eq.icon;
            return (
              <div
                key={i}
                onClick={() => copySinglePhrase(eq.title)}
                className="group cursor-pointer bg-[#14120f]/80 hover:bg-[#1f1a14] border border-[#382b1d] hover:border-amber-500/50 rounded-xl p-2.5 sm:p-3 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] uppercase font-sans text-amber-400/80 tracking-wider">
                    {eq.system}
                  </span>
                  <IconComponent className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="font-serif font-bold text-sm text-[#f0e6d2] group-hover:text-amber-200">
                  {eq.title}
                </div>
                <div className="text-[11px] text-[#9e8f7a] font-mono mt-1">
                  {eq.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Visual Sacred Image & Structured Essay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Luminous Sacred Cube Artwork (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#171410] border border-[#3d2e1e] rounded-2xl p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d2216]">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                <span className="font-serif text-sm font-bold text-[#f5ecd8]">
                  Ὁ Ἱερὸς Κύβος τοῦ 1331 & 666 (ΕΙΜΑΙ)
                </span>
              </div>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-1.5 rounded-lg bg-[#241d16] text-[#c89b3c] hover:bg-[#33291f] transition-colors"
                title={isZoomed ? "Σμίκρυνση" : "Μεγέθυνση"}
              >
                {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Artwork Container */}
            <div className="mt-3 relative rounded-xl overflow-hidden border border-amber-500/20 bg-black/60 aspect-square group">
              <img
                src={goldenCubeImg}
                alt="ΕΙΜΑΙ - Sacred Golden Cube 1331 & 666"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-black/75 backdrop-blur-sm border border-amber-500/30 text-center">
                <div className="text-amber-300 font-serif font-bold text-sm tracking-widest uppercase">
                  Ε Ι Μ Α Ι
                </div>
                <div className="text-[11px] text-[#cfbe9f] font-serif mt-0.5">
                  11³ = 1331 (ΑΠΟΛΛΩΝΟΣ) • Κέντρο = 666 (ΨΥΧΗ & ΦΩΣ)
                </div>
              </div>
            </div>

            {/* Symbolic Synthesis Under Image */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#1f1a14] border border-[#382b1d] space-y-2 text-xs font-serif text-[#c5b59d]">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Συμβολική Γεωμετρία:</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-[#ded2be]">
                <li><strong className="text-amber-200">1331</strong>: Ὁλόκληρος ὁ Κύβος (11 × 11 × 11 = ΑΠΟΛΛΩΝΟΣ)</li>
                <li><strong className="text-amber-200">666</strong>: Τὸ ἀριθμητικὸν κέντρο [(1331 + 1) / 2 = 666]</li>
                <li><strong className="text-amber-200">6 × 6 × 6 = 216</strong>: Ὁ κυβικὸς ὄγκος ➔ 612 = ΖΕΥΣ</li>
                <li><strong className="text-amber-200">ΑΠΟΛΛΩΝ = 1061 = ΙΩΝΑΣ</strong> (αναγραμματισμός) ΙΑΣΩΝ = ΓΝΩΣΗ</li>
                <li><strong className="text-amber-200">ΗΝ ΙΑΣΏΝ</strong> (αναγραμματισμός) ΙΩΑΝΝΗΣ = 1119</li>
                <li><strong className="text-amber-200">ΙΩΑΝΝΗΣ = ΗΝ ΙΑΣΩΝ = ΗΝ ΙΩΝΑΣ = ΗΝ ΑΠΟΛΛΩΝ = ΗΝ ΓΝΩΣΗ</strong> (1119)</li>
                <li><strong className="text-amber-200">A SEED OF LIGHT = 666</strong>: Ὁ σπόρος τοῦ Φωτὸς ἐντός</li>
                <li><strong className="text-amber-200">Ion Velos</strong> = John True</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Full Essay & Text Content (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#171410] border border-[#3d2e1e] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
            
            {/* Opening Dedication */}
            <div className="p-4 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 text-amber-200 font-serif italic text-sm leading-relaxed">
              «Ας βοηθήσουμε να βρουν το φως και οι άλλες "φυλές" στην "γλώσσα" που τους είναι πιό εύκολο να κατανοησουν.
              <div className="mt-2 font-bold not-italic text-amber-300 font-mono text-xs flex flex-wrap gap-3">
                <span>Η Κατανόηση = 666</span>
                <span>•</span>
                <span>Η Αγάπη εστιν = 666</span>
                <span>•</span>
                <span>A SEED OF LIGHT = 666</span>
              </div>
              »
            </div>

            {/* Essay Sections */}
            <article className="prose prose-invert max-w-none text-[#ded2be] font-serif space-y-6 leading-relaxed text-sm sm:text-base">
              
              {/* Section 1: The Seed of Light */}
              <section className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-amber-300 border-b border-[#382b1d] pb-2 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-400" />
                  <span>Η επιστροφή του 666 από τον φόβο στο Φως</span>
                </h3>
                <p className="font-bold text-amber-100">
                  A SEED OF LIGHT = 666
                  <br />
                  Ένας σπόρος φωτός.
                </p>
                <p>
                  Μια εικόνα που μπορεί να διαβαστεί ως η θεϊκή σπίθα που υπάρχει μέσα στην ανθρώπινη ψυχή· ο μικρός πυρήνας φωτός που περιμένει να αναγνωριστεί, να καλλιεργηθεί και να εξέλθει από το σκοτάδι της άγνοιας.
                </p>
                <p>
                  Ο αριθμός 666 έχει φορτιστεί στη νεότερη δυτική συνείδηση με φόβο, απειλή και δεισιδαιμονία. Όμως ο ίδιος ο αριθμός, πριν από τις μεταγενέστερες ερμηνείες του, μπορεί να προσεγγιστεί και ως ένα εξαιρετικά ενδιαφέρον μαθηματικό και συμβολικό σχήμα.
                </p>
                <blockquote className="p-3 bg-[#1e1913] border-l-2 border-amber-400 rounded-r-lg text-amber-200 text-xs sm:text-sm my-2">
                  «Δεν χρειάζεται να φοβόμαστε έναν αριθμό. Ένας αριθμός δεν είναι από μόνος του ούτε καλός ούτε κακός. Είναι σχέση, μέτρο, αναλογία, μορφή.»
                </blockquote>
              </section>

              {/* Section 2: 6 x 6 x 6 = 216 -> 612 -> ΖΕΥΣ */}
              <section className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-amber-300 border-b border-[#382b1d] pb-2 flex items-center gap-2">
                  <Box className="w-5 h-5 text-amber-400" />
                  <span>6 × 6 × 6 = 216 και η αντίστροφη ανάγνωση (ΖΕΥΣ = 612)</span>
                </h3>
                <p>
                  Και το 666 παρουσιάζει μια ιδιαίτερη σχέση με το <strong>6 × 6 × 6 = 216</strong>.
                  <br />
                  6 — 6 — 6. Έξι. Έξι. Έξι. Τρεις διαστάσεις του ίδιου αριθμού.
                </p>
                <p>
                  Το 216 είναι ο κυβικός όγκος ενός κύβου έξι μονάδων σε κάθε διάσταση. Έτσι το 666 μπορεί να ιδωθεί συμβολικά ως ένας αριθμός που βρίσκεται ανάμεσα στην επιφάνεια, την τετραγωνική τάξη και τον κυβικό όγκο.
                </p>
                <p>
                  Υπάρχει μάλιστα μια σημαντική μαθηματική σχέση με το περίφημο <strong>6×6 μαγικό τετράγωνο του Ήλιου</strong> της δυτικής εσωτερικής παράδοσης: οι αριθμοί 1 έως 36, όταν τοποθετηθούν στο τετράγωνο, έχουν συνολικό άθροισμα 666, ενώ κάθε γραμμή και στήλη έχει άθροισμα 111.
                </p>
                <p>
                  Έτσι ο αριθμός μπορεί να διαβαστεί όχι ως «αριθμός του κακού», αλλά ως ένας αριθμός που συνδέθηκε συμβολικά με την τάξη, την αριθμητική αρμονία και τον Ήλιο.
                </p>
                <div className="p-3.5 bg-[#201a13] rounded-xl border border-amber-500/20 text-xs sm:text-sm space-y-1.5">
                  <div className="font-bold text-amber-300">216 και η αντίστροφη ανάγνωση:</div>
                  <p>
                    Το 216 είναι το 1/10 του 2160 (η συμβολική διάρκεια μιας «εποχής» του ζωδιακού κύκλου).
                  </p>
                  <p className="font-mono text-amber-200">
                    666 → 6×6×6 → 216 → 612
                  </p>
                  <p>
                    Η αντιστροφή των ψηφίων του 216 μάς οδηγεί στο <strong>612</strong>. Και στο ελληνικό λεξάριθμο: <strong>ΖΕΥΣ = 612</strong>.
                  </p>
                  <p className="text-amber-300/90 font-medium">
                    Έτσι δημιουργείται ένας συμβολικός κύκλος: 666 → 216 → 612 → ΖΕΥΣ. Και τότε ο 666 παύει να είναι απειλή. Γίνεται κέντρο αναζήτησης.
                  </p>
                </div>
              </section>

              {/* Section 3: The Cube of Apollo 11^3 = 1331 */}
              <section className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-amber-300 border-b border-[#382b1d] pb-2 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>Το 666 στο κέντρο του 11³ (ΑΠΟΛΛΩΝΟΣ = 1331)</span>
                </h3>
                <p>
                  Ας πάρουμε έναν κύβο 11 × 11 × 11. Ο συνολικός αριθμός των μικρών κυβικών μονάδων είναι:
                  <br />
                  <strong className="text-amber-300 font-mono">11 × 11 × 11 = 1331</strong>.
                </p>
                <p>
                  Και εδώ εμφανίζεται μια όμορφη συμμετρία:
                  <br />
                  <strong className="text-amber-300 font-mono">(1331 + 1) / 2 = 666</strong>.
                </p>
                <p>
                  Αν αριθμήσουμε διαδοχικά τις 1331 θέσεις του κύβου από το 1 έως το 1331, το 666 είναι ακριβώς η μεσαία αριθμητική θέση.
                </p>
                <p>
                  Με αυτή την έννοια μπορούμε ποιητικά να μιλήσουμε για τον κύβο:
                  <br />
                  <strong className="text-amber-200">ΑΠΟΛΛΩΝΟΣ = 1331</strong>
                </p>
                <p className="text-xs sm:text-sm text-[#b5a48b] italic">
                  (στον αριθμό 1331 βλέπουμε ότι εχει παλινδρομική ανάγνωση καρκινική γραφή καθώς εντός του έχει έντεχνα κρυμμένο τον αριθμό 33 και απομένουν δεξιά και αριστερά δύο άσσοι 1..1 (11 : ΙΑ — τα Βέλη... όπως ΙΑΠΕΤΟΣ=666 Εκείνος που πετάει τα Βέλη) και σχηματίζουμε νοητά τον κύβο ΙΑxΙΑxΙΑ. 11x11x11=1331=ΑΠΟΛΛΩΝΟΣ. ΙΑ: Ίσις Απόλλων... Ο ΣΕΙΡΙΟΣ "Α" + Ο ΗΛΙΟΣ "Α" + ΑΛΗΘΕΙΑ = 1119 = ΙΩΑΝΝΗΣ. ΑΠΟΛΛΩΝ = 1061 = ΙΩΝΑΣ (αναγραμματισμός) ΙΑΣΩΝ = ΓΝΩΣΗ • ΗΝ ΙΑΣΏΝ (αναγραμματισμός) ΙΩΑΝΝΗΣ = 1119 • ΙΩΑΝΝΗΣ = ΗΝ ΙΑΣΩΝ = ΗΝ ΙΩΝΑΣ = ΗΝ ΑΠΟΛΛΩΝ = ΗΝ ΓΝΩΣΗ).
                </p>
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#1e1913] rounded-xl text-center border border-[#382b1d]">
                  <div>
                    <div className="text-amber-400 font-bold text-sm">1331</div>
                    <div className="text-[11px] text-[#9e8f7a]">Ολόκληρος ο κύβος</div>
                  </div>
                  <div>
                    <div className="text-amber-400 font-bold text-sm">666</div>
                    <div className="text-[11px] text-[#9e8f7a]">Το αριθμητικό κέντρο</div>
                  </div>
                  <div>
                    <div className="text-amber-400 font-bold text-sm">ΦΩΣ</div>
                    <div className="text-[11px] text-[#9e8f7a]">Ο πυρήνας</div>
                  </div>
                </div>
              </section>

              {/* Section 4: Η Διασταύρωση & Το Κέντρο */}
              <section className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-amber-300 border-b border-[#382b1d] pb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Η Διασταύρωση (Δίας — σταύρωση / Της Αύρας Ώση)</span>
                </h3>
                <p>
                  Στο κέντρο συναντώνται οι δρόμοι. Η διασταύρωση μπορεί να γίνει και ένα ποιητικό λογοπαίγνιο:
                  <br />
                  <em>Δίας — σταύρωση</em> ή <em>Δίας — Ταύρος — ώση</em> ή <em>Δίας, Της Αύρας Ώση</em> (η ώθηση της Αύρας από τον συμπαντικό νου Δία Ζήνα Ζεύ).
                </p>
                <p>
                  Δεν πρόκειται για ετυμολογική ανάλυση της λέξης «διασταύρωση», αλλά για μια δημιουργική διάσπαση του ήχου της, μέσα από την οποία ο νους αναζητά σχέσεις ανάμεσα στον Δία, τη δύναμη, την κίνηση και το σημείο όπου δύο κατευθύνσεις συναντώνται.
                </p>
                <p>
                  Και ποιο είναι το σημείο της διασταύρωσης; <strong>Το κέντρο (Κύριος Εντός Ροής)</strong>. Εκεί όπου οι αντίθετες κατευθύνσεις συναντιούνται. Εκεί όπου το έξω και το μέσα μπορούν να γίνουν ένα. Εκεί όπου ο άνθρωπος στρέφει το βλέμμα του προς τον ουρανό και συναντά τη φωτεινή σφαίρα του Ήλιου.
                </p>
              </section>

              {/* Section 5: Έξι - Έξη - Έξεις & ΕΞ + Ω = Ψυχή Ω+Μέγα */}
              <section className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-amber-300 border-b border-[#382b1d] pb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>6 — 6 — 6: Μια ακουστική πύλη & Το Ω-Μέγα</span>
                </h3>
                <p>
                  Και τώρα ας ακούσουμε τον αριθμό διαφορετικά:
                  <br />
                  <strong>Έξι — Έξι — Έξι.</strong>
                  <br />
                  Η λέξη «έξι» ηχεί διαφορετικά από το «έξη», αλλά η ηχητική ομοιότητα μπορεί να χρησιμοποιηθεί ποιητικά.
                </p>
                <p>
                  Η <strong>ἕξις</strong> στην αρχαία ελληνική σημαίνει κατάσταση, διάθεση ή επίκτητη συνήθεια· συνδέεται με το <em>ἔχω</em>, δηλαδή με αυτό που κάποιος «έχει» ως σταθερή κατάσταση ή ιδιότητα.
                </p>
                <p>
                  Έτσι: <strong>Έξι → Έξη → Έξεις</strong> μπορεί ποιητικά να μας οδηγήσει από τον αριθμό στη συνήθεια. Γιατί αυτό που επαναλαμβάνεται γίνεται έξη. Και ό,τι γίνεται έξη μπορεί να γίνει χαρακτήρας. Και ό,τι γίνεται χαρακτήρας μπορεί να γίνει τρόπος ζωής.
                </p>
                <div className="p-3 bg-[#1e1913] border-l-2 border-amber-400 rounded-r-lg text-amber-200 text-xs sm:text-sm">
                  Άρα το τριπλό <strong>6 — 6 — 6</strong> θα μπορούσε συμβολικά να διαβαστεί ως τριπλή υπενθύμιση:
                  <br />
                  <em>τι επαναλαμβάνεις; τι καλλιεργείς; τι γίνεται μέσα σου έξη;</em>
                </div>
                <p>
                  Και εδώ εισέρχεται ένα ακόμη λεκτικό παιχνίδι:
                  <br />
                  <strong>ΕΞ — ΕΙ</strong> (Έξω — είσαι).
                  <br />
                  Και έτσι γεννιέται η φράση:
                  <br />
                  <strong className="text-amber-300">ΕΞ + Ω = Ψυχή Ω+Μέγα</strong>
                </p>
                <p>
                  Το Ω εδώ μπορεί να λειτουργήσει συμβολικά ως το «μέγα», το τελευταίο γράμμα, η ολοκλήρωση του ελληνικού αλφαβήτου. Σε αντίθεση με το Ό+μικρόν που είναι περιορισμένος χώρος, το Ω+Μέγα έχει έναν πόρο, μια πύλη, ένα κατώφλι, έναν Ουδό... και ο χώρος εντός τους είναι ένα με τον γύρω χώρο: ήρθε σε <strong>Έν+Ώση το Ε.Ε. (Εντός Εκτός)</strong> και πλέον δεν υπάρχει εντός και εκτός καθώς το Ω+Μέγα είναι μια Ίνας καμπύλωση.
                </p>
                <p className="font-semibold text-amber-200">
                  Η Ψυχή που ολοκληρώνεται δεν κλείνεται στον εαυτό της. Εξέρχεται. Βγαίνει προς το Φως.
                </p>
              </section>

              {/* Section 6: Η Έξοδος της Ψυχής & Το Συμπέρασμα */}
              <section className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-amber-300 border-b border-[#382b1d] pb-2 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-400" />
                  <span>Η Έξοδος της Ψυχής & Ο Σπόρος του Φωτός</span>
                </h3>
                <p>
                  Και εδώ βρίσκεται ίσως η σημαντικότερη μεταμόρφωση του συμβόλου:
                </p>
                <ul className="space-y-1 list-none pl-0 text-amber-100 font-medium">
                  <li>• Όχι: 666 = φόβος. Αλλά: <strong>666 = κέντρο</strong>.</li>
                  <li>• Όχι: 666 = καταδίκη. Αλλά: <strong>666 = υπενθύμιση της αναζήτησης</strong>.</li>
                  <li>• Όχι: 666 = σκοτάδι. Αλλά: <strong>666 = ένας αριθμητικός συμβολισμός που οδηγεί στο Φως</strong>.</li>
                </ul>
                <p>
                  Η <strong>Έξ+οδος της Ψυχής</strong> δεν είναι απαραίτητα φυγή από τον κόσμο. Είναι:
                  <br />
                  • Έξ+οδος από την άγνοια.
                  <br />
                  • Έξ+οδος από τον φόβο.
                  <br />
                  • Έξ+οδος από τη δεισιδαιμονία.
                  <br />
                  • Έξ+οδος από τις μηχανικές έξεις (Εξ+Εις) που μας κρατούν δεμένους.
                </p>
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/30 space-y-2">
                  <div className="text-amber-300 font-bold text-base">
                    A SEED OF LIGHT = 666
                  </div>
                  <p className="text-sm text-[#f5ecd8]">
                    Ο σπόρος του Φωτός βρίσκεται ήδη μέσα. Δεν χρειάζεται να τον δημιουργήσεις. Χρειάζεται να τον αναγνωρίσεις.
                  </p>
                  <p className="text-sm text-[#f5ecd8]">
                    Και πού βρίσκεται το Φως; Σήκωσε το βλέμμα. Εκεί πάνω. Στη φωτεινή σφαίρα που βλέπουμε στον ουρανό. Ναι. Στον <strong>Ήλιο</strong>. Ο Ήλιος γίνεται τότε το εξωτερικό σύμβολο ενός εσωτερικού γεγονότος. Το φως που βλέπουμε έξω γίνεται εικόνα του φωτός που αναζητούμε μέσα. Και η Ψυχή, σαν σπόρος, στρέφεται προς το Φως.
                  </p>
                  <p className="text-xs text-amber-400/90 font-serif italic pt-2 border-t border-amber-500/20">
                    6 — 6 — 6 • Έξι — Έξι — Έξι • Έξη — Έξη — Έξη • Εξ — Ει. Έξω είσαι. Η Ψυχή εξέρχεται και στρέφεται προς το Φως.
                  </p>
                </div>

                {/* Author Signature */}
                <div className="pt-4 flex items-center justify-between border-t border-[#382b1d]">
                  <div className="text-xs text-[#a89880] font-serif">
                    Συμβολική & Φιλοσοφική Μελέτη
                  </div>
                  <div className="text-sm font-serif font-bold text-amber-300">
                    Ion Velos = John True
                  </div>
                </div>
              </section>
            </article>

          </div>
        </div>

      </div>

      {/* Full Screen Modal for Sacred Cube if Zoomed */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 z-10"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
            <img
              src={goldenCubeImg}
              alt="ΕΙΜΑΙ - Golden Sacred Cube"
              className="max-h-[85vh] w-auto object-contain rounded-2xl border border-amber-500/40 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-amber-300 font-serif text-center text-sm">
              ΕΙΜΑΙ • 11³ = 1331 (ΑΠΟΛΛΩΝΟΣ) • Κέντρο = 666
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
