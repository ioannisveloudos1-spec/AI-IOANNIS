import React, { useState, useEffect, useMemo, useRef } from "react";
import { AppTheme } from "../utils/theme";
import { ANCIENT_GREEK_FONTS, getInitialAncientFont } from "../utils/greekFonts";
import { SavedIsopsephyItem } from "../types";
import { calculateWordIsopsephy, numberToGreekNumeral } from "../utils/isopsephy";
import {
  BookOpen,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Bookmark,
  Share2,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Info,
  Layers,
  Compass,
  Check,
  ZoomIn,
  ZoomOut,
  Type,
  Sun,
  Shield,
  Eye,
} from "lucide-react";

interface EuropeTabProps {
  theme?: AppTheme;
  currentFontId?: string;
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
}

export interface NovelChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  paragraphs: string[];
  keyTerms: {
    term: string;
    value: number;
    explanation: string;
  }[];
}

const NOVEL_CHAPTERS: NovelChapter[] = [
  {
    id: "prologue",
    number: "Εισαγωγή",
    title: "Ο Μύθος της Ευρώπης & η Ιωνική Ισοψηφία",
    subtitle: "Η Ευρύοπτη Κόρη, το Μυστήριο του Ταύρου και η Γέννηση του Πολιτισμού",
    summary:
      "Μια φιλοσοφική και ισοψηφική εισαγωγή στον μύθο της Ευρώπης, τη βαθύτερη ετυμολογική σημασία (Ευρύς + Ωψ) και τη συμβολική μεταφορά του φωτός από την Ανατολή στο Αιγαίο.",
    paragraphs: [
      "Στην αυγή της καταγεγραμμένης μνήμης, ο μύθος δεν ήταν απλή ποιητική αλληγορία, αλλά η ιερά γλώσσα των μυστών, ένας κρυπτογραφημένος κώδικας όπου τα ονόματα των θεών και των ηρώων αντηχούσαν μαθηματικούς νόμους και κοσμικές πορείες. Το όνομα «ΕΥΡΩΠΗ» (Ε=5, Υ=400, Ρ=100, Ω=800, Π=80, Η=8 — άθροισμα 1393 στην απλή εκφορά, ή 1075 κατά την εσωτερική ακολουθία) δηλοί την «ευρύοπτη», εκείνην που κατέχει ευρύ βλέμμα, την ανοιχτόμυαλη και ευρύχωρη συνείδηση που αγκαλιάζει τον ορίζοντα.",
      "Όταν ο βασιλέας των θεών Ζευς μεταμορφώνεται σε πάλλευκο, πράο ταύρο για να σαγηνεύσει τη θυγατέρα του βασιλέως Αγήνορος, δεν συντελείται μια τυχαία αρπαγή. Είναι η αρχετυπική ώθηση του ανώτερου πνεύματος να μεταφέρει την ανθρώπινη ψυχή από την καθηλωμένη ακτή της αρχαϊκής Ανατολής προς το φωτεινό κέντρο της Μεσογείου — την ιερή νήσο Κρήτη.",
      "Μέσα από αυτό το μυθιστόρημα, ξεδιπλώνεται το ταξίδι της Ευρώπης όχι ως απλό ιστορικό δράμα, αλλά ως η μυητική διαδρομή της συνείδησης που ταξιδεύει πάνω στα κύματα του χρόνου, αγκαλιάζει το θεϊκό στοιχείο κάτω από τον αειθαλή πλάτανο της Γόρτυνας, και γεννά τους θεμελιωτές της δικαιοσύνης και της νομοθεσίας: τον Μίνωα, τον Ραδάμανθυ και τον Σαρπηδόνα."
    ],
    keyTerms: [
      { term: "ΕΥΡΩΠΗ", value: 1075, explanation: "Ευρύς + Ωψ: Η ευρύοπτος, η κατέχουσα ευρύ και ανοιχτό βλέμμα προς το άπειρο." },
      { term: "ΖΕΥΣ", value: 612, explanation: "Η αρχή του ζωτικού φωτός και της κοσμικής νοήσεως (Ζωή + Εύς)." },
      { term: "ΤΑΥΡΟΣ", value: 1071, explanation: "Το ιερό ηλιακό ζώδιο της γονιμότητος και της ακατανίκητης ορμής." },
      { term: "ΚΡΗΤΗ", value: 436, explanation: "Το λίκνο του Μινωικού πολιτισμού και το ιερό νησί του Διός." }
    ]
  },
  {
    id: "chapter-1",
    number: "Κεφάλαιο Α´",
    title: "Οι Ανθισμένες Ακτές της Τύρου",
    subtitle: "Το Όνειρο των Δύο Ηπείρων και το Πρωινό Παιχνίδι των Παρθένων",
    summary:
      "Η Ευρώπη ξυπνά ταραγμένη από ένα προφητικό όνειρο όπου δύο ήπειροι μάχονται για να την κατακτήσουν. Στις ακτές της Φοινίκης μαζεύει άνθη με τις συντρόφισσές της.",
    paragraphs: [
      "Η αυγή ρόδιζε πάνω από τους κυπαρισσένιους λόφους της Τύρου, σκορπίζοντας την αλμύρα της Φοινίκης στα ορθάνοιχτα παράθυρα του ανακτόρου. Η Ευρώπη πετάχτηκε από το στρωσίδι της, με την καρδιά της να χτυπά σαν πιασμένο πουλί στα δίχτυα του ψαρά. Στον ύπνο της είχε δει δύο γυναίκες με μορφές γιγάντιες να διεκδικούν την κατοχή της: η μία, ντυμένη με τα πλούσια υφάσματα της Ασίας, έλεγε πως ήταν η γεννήτρα της και απαιτούσε να μείνει στα πάτρια χώματα· η άλλη, ξένη και αγέρωχη, με μάτια σαν το πέλαγος, την τραβούσε προς τη δύση, ψιθυρίζοντας πως η μοίρα της ήταν γραμμένη από τον ίδιο τον Κρονίδη.",
      "Για να διώξει τη σκιά του ονείρου, συγκέντρωσε τις αγαπημένες της συντρόφισσες, κόρες ευγενών και παρθένες της πόλης. Κρατώντας χρυσά καλάθια, έργα τέχνης του Ηφαίστου με ανάγλυφες παραστάσεις της Ιούς και του αργυρού Νείλου, κατηφόρισαν προς τα παραθαλάσσια λιβάδια, όπου τα νάρκισσοι, τα ία, οι κρόκοι και τα ρόδα σχημάτιζαν πολύχρωμο τάπητα.",
      "Η Ευρώπη ξεχώριζε ανάμεσά τους σαν η λαμπρή Σελήνη ανάμεσα στα αμυδρά αστέρια. Τα μαλλιά της έλαμπαν στο πρωινό φως και το γέλιο της ηχούσε σαν κρυστάλλινο ρυάκι. Κανείς δεν υποψιαζόταν πως από τα ύψη του Ολύμπου, τα άγρυπνα μάτια του πατέρα θεών και ανθρώπων είχαν ήδη μαγευτεί από την ασύγκριτη ομορφιά της."
    ],
    keyTerms: [
      { term: "ΤΥΡΟΣ", value: 970, explanation: "Η αρχαία παραθαλάσσια μητρόπολη της Ανατολής." },
      { term: "ΚΑΛΑΘΟΣ", value: 320, explanation: "Το χρυσό καλάθι των ανθών, σύμβολο αγνότητος και υποδοχής του θείου." },
      { term: "ΑΣΙΑ", value: 212, explanation: "Η μητρική ήπειρος από την οποία εκκινεί η μεγάλη μετακίνηση του πνεύματος." }
    ]
  },
  {
    id: "chapter-2",
    number: "Κεφάλαιο Β´",
    title: "Ο Πάλλευκος Ταύρος του Διός",
    subtitle: "Η Θεϊκή Μεταμόρφωση, η Ήμερη Προσέγγιση και η Αρπαγή στα Κύματα",
    summary:
      "Ο Δίας κατέρχεται με τη μορφή ενός θαυμαστού, ασημόλευκου ταύρου που αποπνέει άρωμα σαφράν. Η Ευρώπη ανεβαίνει στη ράχη του και ο ταύρος χάνεται στα βάθη του πελάγους.",
    paragraphs: [
      "Ξαφνικά, ανάμεσα στα ανθισμένα αγριολούλουδα πρόβαλε ένα πλάσμα που δεν έμοιαζε με κανένα κοινό κοπάδι της γης. Ήταν ένας ταύρος με τρίχωμα λευκότερο κι από το παρθένο χιόνι που σκεπάζει τις κορυφές του Λιβάνου. Τα κέρατά του ήταν μικρά, συμμετρικά, γυαλισμένα σαν διαμάντια, και στο μέτωπό του λαμποκοπούσε ένα ασημένιο σημάδι σε σχήμα ημισελήνου.",
      "Δεν υπήρχε ίχνος αγριότητας στο βάδισμά του. Πλησίασε με βήματα ράθυμα και αρμονικά, μουγκρίζοντας γλυκά, σαν ήχος αυλού σε απογευματινό δειλινό. Από το στόμα του ανέδυε ευωδιά κρόκου και αμβροσίας. Οι κόρες, αντί να τρομάξουν, μαγεύτηκαν. Τον πλησίασαν, άγγιξαν το απαλό του δέρμα και του πρόσφεραν δέσμες από αγριολούλουδα.",
      "Ο ταύρος γονάτισε ευλαβικά μπροστά στα πόδια της Ευρώπης, προσκαλώντας την με τα γαλήνια, βαθιά μάτια του. Εκείνη, γελώντας με παιδική ανεμελιά, κάθισε στην πλατιά ράχη του. Με μιας, το πλάσμα σηκώθηκε ορθό. Πριν προλάβουν οι συντρόφισσές της να αρθρώσουν κραυγή, ο ταύρος όρμησε με ασύλληπτη ταχύτητα προς τον αφρό των κυμάτων, βυθίζοντας τα πέλματά του στο γαλάζιο νερό!",
      "Η Ευρώπη κρατιόταν με το ένα χέρι από το κέρατο του ταύρου και με το άλλο μάζευε τον πορφυρό της πέπλο για να μην βραχεί από τον αφρό. Γύρω τους, η θάλασσα γαλήνεψε θαυματουργά· δελφίνια χόρευαν συνοδοί, Νηρηίδες πρόβαλαν από τα κύματα ψάλλοντας ύμνους, και ο ίδιος ο Τρίτων με το κοχύλι του σήμανε τον γαμήλιο δρόμο της νέας εποχής."
    ],
    keyTerms: [
      { term: "ΤΑΥΡΟΣ", value: 1071, explanation: "Το ιερό ηλιακό και σεληνιακό σύμβολο, όχημα του Διός στα κύματα." },
      { term: "ΠΕΛΑΓΟΣ", value: 399, explanation: "Η υγρή οδός της μυήσεως και του υπερπόντιου ταξιδιού." },
      { term: "ΝΗΡΗΙΔΕΣ", value: 382, explanation: "Οι θαλάσσιες θεότητες που ευλογούν το ιερό πέρασμα." }
    ]
  },
  {
    id: "chapter-3",
    number: "Κεφάλαιο Γ´",
    title: "Ο Αειθαλής Πλάτανος της Γόρτυνας",
    subtitle: "Η Άφιξη στην Κρήτη, η Θεοφάνεια και η Ιερή Ένωση",
    summary:
      "Ο ταύρος αποβιβάζεται στις νότιες ακτές της Κρήτης, στα Μάταλα. Εκεί ο Δίας αποκαλύπτει τη θεϊκή του φύση και κάτω από τον πλάτανο της Γόρτυνας συντελείται ο ιερός γάμος.",
    paragraphs: [
      "Μετά από ατελείωτες ώρες πλεύσης πάνω στα αφρισμένα κύματα, οι απόκρημνοι βράχοι του νότιου Κρητικού πελάγους υψώθηκαν στον ορίζοντα. Ο ταύρος πάτησε στη χρυσή άμμο της ακτής στα Μάταλα, και με βήμα βασιλικό ανηφόρισε προς την εύφορη πεδιάδα της Μεσαράς, πλησίον του Ληθαίου ποταμού.",
      "Εκεί, στις όχθες του ποταμού, ο ταύρος στάθηκε κάτω από έναν υπερήφανο πλάτανο. Μπροστά στα έκθαμβα μάτια της Ευρώπης, η ζωώδης μορφή διαλύθηκε σε μια λαμπρή δέσμη χρυσού φωτός. Ο Ζευς αποκαλύφθηκε στο πλήρες μεγαλείο του: ολύμπιος, γαλήνιος, στεφανωμένος με το αιώνιο κύρος του δημιουργού. Με λόγια γεμάτα στοργή καθησύχασε την τρομαγμένη κόρη, εξηγώντας της πως δεν ήταν αιχμάλωτη, αλλά η εκλεκτή νύμφη του ουρανού.",
      "Κάτω από τη σκιά του δέντρου ενώθηκαν σε ιερό γάμο. Ως ένδειξη θεϊκής ευλογίας και ανταμοιβής για τη φιλοξενία του έρωτά τους, ο Δίας χάρισε στον πλάτανο το προνόμιο να μην χάνει ποτέ τα φύλλα του. Έτσι γεννήθηκε ο μυθικός αειθαλής πλάτανος της Γόρτυνας, που στέκει ζωντανός μάρτυρας ανά τους αιώνες, σύμβολο αθάνατης ζωής και ακμάζουσας σοφίας."
    ],
    keyTerms: [
      { term: "ΓΟΡΤΥΣ", value: 983, explanation: "Η αρχαία πόλη της Κρήτης όπου συντελέστηκε ο ιερός γάμος." },
      { term: "ΠΛΑΤΑΝΟΣ", value: 761, explanation: "Το αειθαλές δένδρο της αθανασίας και της αναγέννησης." },
      { term: "ΙΕΡΟΣ ΓΑΜΟΣ", value: 609, explanation: "Η μυστική ένωση πνεύματος και ύλης, θεού και ανθρώπου." }
    ]
  },
  {
    id: "chapter-4",
    number: "Κεφάλαιο Δ´",
    title: "Η Γέννηση των Τριών Βασιλέων",
    subtitle: "Μίνως, Ραδάμανθυς, Σαρπηδών — Οι Στυλοβάτες της Δικαιοσύνης",
    summary:
      "Από την ένωση του Διός και της Ευρώπης γεννώνται τρεις γιοι, προορισμένοι να χαράξουν τους νόμους, τη ναυτοσύνη και τη δικαιοσύνη στον μεσογειακό κόσμο.",
    paragraphs: [
      "Ο χρόνος κύλησε σαν γάργαρο νερό στα φαράγγια της Κρήτης, και η Ευρώπη έφερε στον κόσμο τρεις καρπούς του θεϊκού της έρωτα: τον Μίνωα, τον Ραδάμανθυ και τον Σαρπηδόνα. Κάθε παιδί έφερε στο βλέμμα του ένα διαφορετικό χάρισμα της αρχέγονης σοφίας.",
      "Ο Μίνως προοριζόταν να γίνει ο μέγας νομοθέτης και θαλασσοκράτορας, εκείνος που κάθε εννέα χρόνια ανέβαινε στο Ιδαίον Άντρον για να συνομιλήσει προσωπικά με τον πατέρα του Δία και να λάβει τους αιώνιους κώδικες της ευνομίας. Ο Ραδάμανθυς ξεχώρισε για την απαράμιλλη, αδιάφθορη αίσθηση του δικαίου — τόσο αυστηρή και ακριβοδίκαιη, ώστε αργότερα οι θεοί τον όρισαν κριτή των ψυχών στα Ηλύσια Πεδία. Ο δε Σαρπηδών, γεμάτος ηρωική ορμή και ευγένεια, ταξίδεψε αργότερα στη Μικρά Ασία όπου ίδρυσε το βασίλειο της Λυκίας.",
      "Η Ευρώπη δεν έμεινε μόνη. Ο βασιλιάς της Κρήτης Αστέριος, άτεκνος και σεβόμενος το θεϊκό μεγαλείο της κόρης, την πήρε για σύζυγό του, υιοθέτησε τα τρία παιδιά και τα όρισε διαδόχους του θρόνου. Έτσι, το αίμα των θεών ρίζωσε βαθιά στη γη της Κρήτης, δημιουργώντας τον πρώτο μεγάλο ναυτικό πολιτισμό της ηπείρου."
    ],
    keyTerms: [
      { term: "ΜΙΝΩΣ", value: 1100, explanation: "Ο νομοθέτης βασιλιάς, αρχιτέκτων της πρώτης θαλασσοκρατίας." },
      { term: "ΡΑΔΑΜΑΝΘΥΣ", value: 815, explanation: "Ο αδιάφθορος κριτής του κάτω κόσμου και της αληθείας." },
      { term: "ΣΑΡΠΗΔΩΝ", value: 1344, explanation: "Ο ηρωικός άναξ της Λυκίας, ενσάρκωση του αριστοκρατικού θάρρους." }
    ]
  },
  {
    id: "chapter-5",
    number: "Κεφάλαιο Ε´",
    title: "Ο Τάλως και τα Θεϊκά Δώρα",
    subtitle: "Ο Χάλκινος Φύλακας, η Αλάνθαστη Κυνηγετική Σκύλα και το Ακόντιο που δεν Αστοχεί",
    summary:
      "Πριν επιστρέψει στον Όλυμπο, ο Δίας χαρίζει στην Ευρώπη τρία ατίμητα φυλακτήρια για την ασφάλεια της ίδιας και του νησιού: τον Τάλω, τη Λαίλαπα και το ακόντιο.",
    paragraphs: [
      "Για να προστατεύσει την αγαπημένη του νύμφη από κάθε επίβουλο εχθρό, ο Ζευς της χάρισε τρία δώρα ασύλληπτης ισχύος, φτιαγμένα από τα ίδια τα χέρια του Ηφαίστου. Το πρώτο ήταν ένα χάλκινο ακόντιο που δεν αστοχούσε ποτέ και επέστρεφε αυτόματα στο χέρι εκείνου που το εκσφενδόνιζε. Το δεύτερο ήταν η Λαίλαψ, μια κυνηγετική σκύλα τόσο γοργή, που κανένα θήραμα στον κόσμο δεν μπορούσε να της ξεφύγει.",
      "Όμως το πιο θαυμαστό από όλα ήταν ο Τάλως: ένας γιγάντιος χάλκινος άνδρας, το πρώτο νοήμον αυτόματο της μυθολογίας! Ο Τάλως περιπολούσε ακούραστα τρεις φορές την ημέρα ολόκληρη την περίμετρο της Κρήτης. Όταν ξένα εχθρικά πλοία πλησίαζαν τις ακτές, ξεκολλούσε τεράστιους βράχους και τους εξακόντιζε στα κύματα, βυθίζοντάς τα.",
      "Κι αν κάποιος εχθρός κατάφερνε να πατήσει στην ξηρά, ο Τάλως πηδούσε μέσα στη φωτιά μέχρι να πυρώσει το χάλκινο σώμα του, κι έπειτα αγκάλιαζε σφιχτά τους εισβολείς, καίγοντάς τους. Μέσα στις φλέβες του έτρεχε όχι αίμα, αλλά ιχώρ — το θείο υγρό των αθανάτων — το οποίο συγκρατούσε ένα μοναδικό χάλκινο καρφί στον αστράγαλό του. Έτσι η Κρήτη έγινε το πρώτο απόρθητο κάστρο ελευθερίας."
    ],
    keyTerms: [
      { term: "ΤΑΛΩΣ", value: 1131, explanation: "Το πρώτο ρομποτικό αυτόματο της ιστορίας, χάλκινος φύλακας της Κρήτης." },
      { term: "ΙΧΩΡ", value: 1510, explanation: "Το ιερό, άφθαρτο αίμα των αθανάτων θεών." },
      { term: "ΛΑΙΛΑΨ", value: 871, explanation: "Η αλάθητη σκύλα του κυνηγιού, σύμβολο άγρυπνης παρατήρησης." }
    ]
  },
  {
    id: "chapter-6",
    number: "Κεφάλαιο ΣΤ´",
    title: "Η Αναζήτηση του Κάδμου",
    subtitle: "Από τη Φοινίκη στους Δελφούς και η Σπορά των Ελληνικών Γραμμάτων",
    summary:
      "Ο αδελφός της Ευρώπης, Κάδμος, ξεκινά με εντολή του πατέρα τους να τη βρει. Το Μαντείο των Δελφών του αλλάζει αποστολή: ιδρύει τη Θήβα και χαρίζει στον ελληνικό κόσμο τα Φοινίκεια γράμματα.",
    paragraphs: [
      "Πίσω στην Τύρο, ο βασιλιάς Αγήνωρ βυθίστηκε στο πένθος. Μη μπορώντας να ανεχθεί την απώλεια της θυγατέρας του, κάλεσε τους γιους του — τον Κάδμο, τον Φοίνικα και τον Κίλικα — και τους έδωσε απαράβατο όρκο: να μην επιστρέψουν ποτέ στα πάτρια εδάφη αν δεν βρουν και δεν φέρουν πίσω την Ευρώπη.",
      "Χρόνια ολόκληρα οργώνανε τις θάλασσες και τα νησιά. Ο Κάδμος, κουρασμένος και απελπισμένος, κατέφυγε στο Μαντείο των Δελφών για να ρωτήσει τον Απόλλωνα πού κρυβόταν η αδελφή του. Η Πυθία έδωσε χρησμό απρόσμενο: «Μην αναζητάς πλέον την Ευρώπη, διότι ανήκει στους θεούς. Ακολούθησε μια αγελάδα με λευκό σημάδι στο πλευρό, κι εκεί που θα γείρει να αναπαυθεί, χτίσε μια νέα πόλη!».",
      "Ο Κάδμος υπάκουσε και ίδρυσε την επτάπυλη Καδμεία, τη μετέπειτα ξακουστή Θήβα. Όμως το πολυτιμότερο δώρο που κόμισε στους Έλληνες δεν ήταν μόνο τα τείχη της πόλης, αλλά τα ίδια τα γράμματα της αλφαβήτου! Τα «Φοινίκεια γράμματα» εμπλουτίστηκαν με τα ελληνικά φωνήεντα, γεννώντας τη γλώσσα της φιλοσοφίας, της τραγωδίας και της ισοψηφίας. Έτσι, η αναζήτηση της Ευρώπης γέννησε τον γραπτό λόγο του ευρωπαϊκού πολιτισμού."
    ],
    keyTerms: [
      { term: "ΚΑΔΜΟΣ", value: 315, explanation: "Ο αδελφός της Ευρώπης, ιδρυτής της Θήβας και κομιστής των γραμμάτων." },
      { term: "ΔΕΛΦΟΙ", value: 619, explanation: "Ο ομφαλός της γης και το ιερό μαντείο του Απόλλωνος." },
      { term: "ΓΡΑΜΜΑΤΑ", value: 505, explanation: "Τα ιερά σύμβολα του λόγου, της σκέψης και της ισοψηφίας." }
    ]
  },
  {
    id: "chapter-7",
    number: "Κεφάλαιο Ζ´",
    title: "Η Μετουσίωση σε Ήπειρο του Φωτός",
    subtitle: "Από την Παρθένο Κόρη στη Συμπαντική Ιδέα της Ελευθερίας και του Λόγου",
    summary:
      "Το όνομα της Ευρώπης υπερβαίνει τη θνητή υπόσταση και αγκαλιάζει ολόκληρη τη δυτική ήπειρο, ως σύμβολο επιστήμης, φιλοσοφίας, ισονομίας και εσωτερικής αφύπνισης.",
    paragraphs: [
      "Καθώς οι γενιές διαδέχονταν η μία την άλλη, η μορφή της Ευρώπης δεν ξεθώριασε στη λήθη των αιώνων. Αντίθετα, μεγάλωσε, απλώθηκε και έγινε το όνομα μιας ολόκληρης ηπείρου. Όπως παρατήρησε ο Ηρόδοτος, κανείς θνητός δεν γνώριζε ποιος πρώτος ονόμασε έτσι τη γη, όμως η αλήθεια βρισκόταν κρυμμένη στην ίδια τη ρίζα της λέξης: «Ευρύς» και «Ωψ» — η πλατιά ματιά, το άνοιγμα της σκέψης πέρα από τα στενά όρια του δογματισμού.",
      "Η Ευρώπη έγινε η μήτρα όπου ο μύθος συναντήθηκε με τον ορθό λόγο (Logos), όπου οι αριθμοί του Πυθαγόρα αποκάλυψαν τη μουσική αρμονία των σφαιρών, όπου η δημοκρατία της Αθήνας θέσπισε την ισονομία, και όπου οι νόμοι του Μίνωα και της Γόρτυνας θεμελίωσαν το δίκαιο.",
      "Όταν η Ευρώπη ολοκλήρωσε τη γήινη πορεία της, ο Ζευς τοποθέτησε τη μορφή του ιερού ταύρου ανάμεσα στα άστρα του νυχτερινού ουρανού — τον αστερισμό του Ταύρου με τις λαμπερές Πλειάδες — ώστε κάθε άνθρωπος που κοιτάζει τα ύψη να θυμάται πως το ταξίδι της ψυχής είναι μια αιώνια αναζήτηση του θείου φωτός."
    ],
    keyTerms: [
      { term: "ΛΟΓΟΣ", value: 373, explanation: "Η αρχή της νοήσεως, της γλώσσης και της συμπαντικής τάξεως." },
      { term: "ΑΡΜΟΝΙΑ", value: 272, explanation: "Η συμπαντική συμφωνία των αντιθέτων κατά τον Πυθαγόρα." },
      { term: "ΑΣΤΕΡΙΣΜΟΣ", value: 896, explanation: "Ο ουράνιος Ταύρος που υπενθυμίζει την αιώνια θεϊκή πορεία." }
    ]
  },
  {
    id: "epilogue",
    number: "Επίλογος",
    title: "Το Αειθαλές Δένδρο & το «ΕΓΩ ΕΙΜΙ»",
    subtitle: "Η Εσωτερική Μύηση του Ιωάννη Βελούδου",
    summary:
      "Η τελική φιλοσοφική σύνοψη του συγγραφέα Ιωάννη Βελούδου για το αιώνιο μήνυμα της Ευρώπης, τη σύνδεση με το «ΕΓΩ ΕΙΜΙ» και τον πνευματικό προορισμό του ανθρώπου.",
    paragraphs: [
      "Ο πλάτανος της Γόρτυνας παραμένει χλωρός και καταπράσινος ακόμα και μέσα στον βαρύ χειμώνα. Δεν είναι ένα βοτανικό θαύμα, αλλά ένα κοσμικό σύμβολο: η γνώση και η αληθινή συνείδηση δεν μαραίνονται ποτέ. Η Ευρώπη δεν είναι απλώς μια γεωγραφική έκταση, αλλά μια κατάσταση της ψυχής.",
      "Όποιος αναζητά το βαθύτερο νόημα των λεξαρίθμων, κατανοεί ότι το ταξίδι πάνω στη ράχη του ταύρου είναι η δική μας πορεία: η απομάκρυνση από την αδράνεια των αισθήσεων και το πέρασμα στην ενόραση, εκεί όπου η θεία νόηση ενώνεται με την ανθρώπινη καρδιά.",
      "Μέσα από τη σιωπή του ιερού άλσους αντηχεί το αιώνιο κάλεσμα: «ΕΓΩ ΕΙΜΙ». Η αυτογνωσία είναι το τελικό λιμάνι. Εκεί όπου η Ευρύοπτη Κόρη συναντά τον Αιώνιο Δημιουργό, και ο άνθρωπος ανακαλύπτει πως ο πραγματικός ναός του φωτός είναι η ίδια του η αφυπνισμένη συνείδηση."
    ],
    keyTerms: [
      { term: "ΕΓΩ ΕΙΜΙ", value: 870, explanation: "Η απόλυτη δήλωση υπάρξεως και αυτεπίγνωσης της ψυχής." },
      { term: "ΣΥΝΕΙΔΗΣΙΣ", value: 782, explanation: "Το άσβεστο φως της εσωτερικής εποπτείας." },
      { term: "ΑΥΤΟΓΝΩΣΙΑ", value: 1646, explanation: "Το δελφικό «Γνῶθι Σεαυτόν», κορωνίδα της ελληνικής φιλοσοφίας." }
    ]
  }
];

export const EuropeTab: React.FC<EuropeTabProps> = ({
  theme = "dark-ancient",
  currentFontId,
  onSaveItem,
  onOpenAiModal,
}) => {
  const [viewMode, setViewMode] = useState<"book" | "flipbook">("book");
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(17);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [showToc, setShowToc] = useState<boolean>(true);
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("europe_novel_bookmarks");
      return raw ? JSON.parse(raw) : ["prologue"];
    } catch {
      return ["prologue"];
    }
  });

  const activeChapter = NOVEL_CHAPTERS[activeChapterIndex] || NOVEL_CHAPTERS[0];

  // Resolve current active font
  const activeFont = useMemo(() => {
    return (
      ANCIENT_GREEK_FONTS.find((f) => f.id === currentFontId) ||
      ANCIENT_GREEK_FONTS[0]
    );
  }, [currentFontId]);

  // Speech synthesis ref
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Toggle bookmark
  const toggleBookmark = (chapterId: string) => {
    setBookmarkedChapters((prev) => {
      const next = prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];
      try {
        localStorage.setItem("europe_novel_bookmarks", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Text to Speech playback
  const handleSpeakChapter = () => {
    if (!synthRef.current) {
      alert("Η λειτουργία φωνητικής απαγγελίας δεν υποστηρίζεται από το πρόγραμμα περιήγησής σας.");
      return;
    }

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const fullText = `${activeChapter.title}. ${activeChapter.subtitle}. ${activeChapter.paragraphs.join(" ")}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "el-GR";
    utterance.rate = speechRate;

    // Try finding a Greek voice
    const voices = synthRef.current.getVoices();
    const greekVoice = voices.find((v) => v.lang.startsWith("el"));
    if (greekVoice) {
      utterance.voice = greekVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Save isopsephy term to archive
  const handleSaveTermToArchive = (term: string, value: number, explanation: string) => {
    if (!onSaveItem) return;
    const iso = calculateWordIsopsephy(term);
    const finalVal = value || iso.value;
    onSaveItem({
      text: term,
      normalized: term,
      value: finalVal,
      root: iso.root,
      greekNumeral: numberToGreekNumeral(finalVal),
      isPhrase: false,
      wordCount: 1,
      category: "Μυθολογία",
      notes: `Μυθιστόρημα «Η Μυθική Ευρώπη» — ${explanation}`,
    });
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2500);
  };

  // Filtered chapters for search
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return NOVEL_CHAPTERS;
    const q = searchQuery.toLowerCase();
    return NOVEL_CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
        c.keyTerms.some((k) => k.term.toLowerCase().includes(q) || k.explanation.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div
      id="europe-tab-container"
      className="space-y-6 max-w-7xl mx-auto transition-colors duration-200"
      style={{ fontFamily: activeFont.fontFamily }}
    >
      {/* Hero Banner with Thematic European/Cretan Motifs */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 sm:p-7 shadow-xl ${
          theme === "parchment" || theme === "ancient-calligraphy"
            ? "bg-gradient-to-br from-[#f8f2e6] via-[#f1e5d2] to-[#e8d7be] border-[#bda07b] text-[#3d240e]"
            : theme === "solar"
            ? "bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fde68a] border-[#d97706] text-[#78350f]"
            : theme === "ethereal"
            ? "bg-gradient-to-br from-[#0a1228] via-[#0f1d40] to-[#162a5c] border-[#38bdf8] text-[#e0f2fe]"
            : theme === "cyber-tech"
            ? "bg-gradient-to-br from-[#061814] via-[#0b2922] to-[#123830] border-[#10b981] text-[#ecfdf5]"
            : "bg-gradient-to-br from-[#18130e] via-[#241a12] to-[#1a130d] border-amber-600/50 text-[#f5ecd8]"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${
                  theme === "parchment" || theme === "ancient-calligraphy"
                    ? "bg-[#e5d4bb] text-[#784615] border-[#bca07a]"
                    : theme === "solar"
                    ? "bg-[#fef3c7] text-[#92400e] border-[#f59e0b]"
                    : theme === "ethereal"
                    ? "bg-[#0c1f44] text-[#38bdf8] border-[#0284c7]"
                    : theme === "cyber-tech"
                    ? "bg-[#07241e] text-[#10b981] border-[#059669]"
                    : "bg-[#2d2215] text-[#ffd700] border-[#c89b3c]/50"
                }`}
              >
                ✦ Μυθιστόρημα Ιωάννου Βελούδου ✦
              </span>
              <span className="text-[11px] opacity-75 font-serif">
                FlipHTML5 Έκδοση & Πλήρες Αναγνωστήριο
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-wide">
              Η ΜΥΘΙΚΗ ΕΥΡΩΠΗ
            </h2>

            <p className="text-xs sm:text-sm font-serif opacity-90 leading-relaxed">
              Το αρχετυπικό ταξίδι της Ευρύοπτης Κόρης πάνω στη ράχη του Ταύρου, η άφιξη στην ιερή Κρήτη, ο αειθαλής πλάτανος της Γόρτυνας και η μυστική γέννηση του ευρωπαϊκού πολιτισμού υπό το φως της Ιωνικής Ισοψηφίας.
            </p>
          </div>

          {/* View Mode Switcher & FlipHTML5 Direct Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full md:w-auto">
            <div
              className={`p-1 rounded-xl border flex items-center shadow-inner ${
                theme === "parchment" || theme === "ancient-calligraphy"
                  ? "bg-[#f2e6d2] border-[#cbb391]"
                  : theme === "solar"
                  ? "bg-[#fef3c7] border-[#fcd34d]"
                  : theme === "ethereal"
                  ? "bg-[#091530] border-[#1e3a8a]"
                  : theme === "cyber-tech"
                  ? "bg-[#071f19] border-[#065f46]"
                  : "bg-[#120e0a] border-amber-900/60"
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode("book")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "book"
                    ? "bg-amber-600 text-white shadow-md"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ανάγνωση Κεφαλαίων</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("flipbook")}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "flipbook"
                    ? "bg-amber-600 text-white shadow-md"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>FlipHTML5 Flipbook</span>
              </button>
            </div>

            <a
              href="https://online.fliphtml5.com/wicfu/qzko/#p=5"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-[#140e08] text-xs font-serif font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 transition-all cursor-pointer"
              title="Άνοιγμα της ψηφιακής έκδοσης FlipHTML5 σε νέα καρτέλα"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Νέα Καρτέλα</span>
            </a>
          </div>
        </div>
      </div>

      {/* VIEW 1: FLIPHTML5 EMBEDDED FLIPBOOK READER */}
      {viewMode === "flipbook" && (
        <div className="space-y-4 animate-fadeIn">
          <div
            className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between gap-3 flex-wrap ${
              theme === "parchment" || theme === "ancient-calligraphy"
                ? "bg-[#faf5eb] border-[#cbb391] text-[#3d240e]"
                : theme === "solar"
                ? "bg-[#fffdf5] border-[#fcd34d] text-[#78350f]"
                : theme === "ethereal"
                ? "bg-[#0b142c] border-[#1e3a8a] text-[#e0f2fe]"
                : theme === "cyber-tech"
                ? "bg-[#081b17] border-[#065f46] text-[#ecfdf5]"
                : "bg-[#14100c] border-amber-900/60 text-[#f5ecd8]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
                <Compass className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-serif font-bold">
                  Διαδραστικό Ψηφιακό Βιβλίο (FlipHTML5 Reader)
                </h3>
                <p className="text-[11px] opacity-75 font-serif">
                  Άμεση περιήγηση στις σελίδες του μυθιστορήματος με εφέ φυλλομετρητή (Flipbook)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://online.fliphtml5.com/wicfu/qzko/#p=5"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-amber-600/50 hover:bg-amber-600/20 text-amber-300 text-xs font-serif flex items-center gap-1.5 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Πλήρης Οθόνη</span>
              </a>
            </div>
          </div>

          {/* Iframe wrapper with 16:9 / responsive tall aspect ratio */}
          <div
            className={`relative w-full rounded-2xl overflow-hidden border shadow-2xl ${
              theme === "parchment" || theme === "ancient-calligraphy"
                ? "bg-[#f5ecdd] border-[#cbb391]"
                : theme === "solar"
                ? "bg-[#fef9e7] border-[#fcd34d]"
                : theme === "ethereal"
                ? "bg-[#070d1e] border-[#1e3a8a]"
                : theme === "cyber-tech"
                ? "bg-[#051411] border-[#065f46]"
                : "bg-[#0c0907] border-amber-900/80"
            }`}
            style={{ height: "780px" }}
          >
            <iframe
              src="https://online.fliphtml5.com/wicfu/qzko/#p=5"
              title="Η Μυθική Ευρώπη - Ιωάννης Βελούδος"
              className="w-full h-full border-0"
              allowFullScreen
              allow="clipboard-write"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* VIEW 2: FULL NOVEL E-BOOK READER WITH CHAPTERS & ISOPSEPHIES */}
      {viewMode === "book" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Left Sidebar: Table of Contents & Chapter Navigator (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className={`p-4 rounded-2xl border shadow-lg space-y-3 sticky top-20 ${
                theme === "parchment" || theme === "ancient-calligraphy"
                  ? "bg-[#fcf8f0] border-[#cbb391] text-[#3d240e]"
                  : theme === "solar"
                  ? "bg-[#fffdf5] border-[#fcd34d] text-[#78350f]"
                  : theme === "ethereal"
                  ? "bg-[#0b142c] border-[#1e3a8a] text-[#e0f2fe]"
                  : theme === "cyber-tech"
                  ? "bg-[#081b17] border-[#065f46] text-[#ecfdf5]"
                  : "bg-[#16110d] border-amber-900/60 text-[#f5ecd8]"
              }`}
            >
              {/* Header & Search */}
              <div className="flex items-center justify-between pb-2 border-b border-inherit/20">
                <span className="font-serif font-bold text-xs sm:text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Πίνακας Κεφαλαίων
                </span>
                <span className="text-[10px] opacity-75 font-mono">
                  {NOVEL_CHAPTERS.length} Κεφάλαια
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Αναζήτηση σε τίτλους & κείμενο..."
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none font-serif ${
                    theme === "parchment" || theme === "ancient-calligraphy"
                      ? "bg-white border-[#d2be9f] text-[#3d240e]"
                      : theme === "solar"
                      ? "bg-white border-[#fcd34d] text-[#78350f]"
                      : theme === "ethereal"
                      ? "bg-[#080f24] border-[#1e3a8a] text-[#e0f2fe]"
                      : theme === "cyber-tech"
                      ? "bg-[#061412] border-[#065f46] text-[#ecfdf5]"
                      : "bg-[#0e0b08] border-amber-900/50 text-[#f5ecd8]"
                  }`}
                />
              </div>

              {/* Chapter Cards List */}
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 gold-scrollbar">
                {filteredChapters.map((ch, idx) => {
                  const origIdx = NOVEL_CHAPTERS.findIndex((c) => c.id === ch.id);
                  const isCurrent = origIdx === activeChapterIndex;
                  const isBookmarked = bookmarkedChapters.includes(ch.id);

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setActiveChapterIndex(origIdx);
                        handleStopSpeaking();
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? "bg-amber-600/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40 shadow-sm"
                          : "opacity-75 hover:opacity-100 hover:bg-black/10 border-transparent hover:border-inherit/20"
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 uppercase font-bold">
                            {ch.number}
                          </span>
                          {isBookmarked && (
                            <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="font-serif font-bold text-xs truncate">
                          {ch.title}
                        </div>
                        <div className="text-[10px] opacity-70 truncate font-serif">
                          {ch.subtitle}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isCurrent ? "text-amber-400 translate-x-0.5" : "opacity-40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Reader Preferences Bar */}
              <div className="pt-3 border-t border-inherit/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] opacity-80 flex items-center gap-1">
                    <Type className="w-3.5 h-3.5 text-amber-500" />
                    Μέγεθος Γραμμάτων:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                      className="w-6 h-6 rounded bg-black/20 hover:bg-black/40 text-center font-bold font-serif"
                      title="Μικρότερη γραμματοσειρά"
                    >
                      Α-
                    </button>
                    <span className="font-mono text-[11px] w-6 text-center">
                      {fontSize}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                      className="w-6 h-6 rounded bg-black/20 hover:bg-black/40 text-center font-bold font-serif"
                      title="Μεγαλύτερη γραμματοσειρά"
                    >
                      Α+
                    </button>
                  </div>
                </div>

                {/* Speech Narration Controller */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] opacity-80 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                    Φωνητική Ανάγνωση:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSpeakChapter}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-serif font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        isSpeaking
                          ? "bg-red-900/60 border-red-500 text-red-200"
                          : "bg-amber-600/30 border-amber-500/50 text-amber-300 hover:bg-amber-600/50"
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Παύση</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Ακρόαση</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content: Active Chapter Reading Paper (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            <article
              className={`p-6 sm:p-10 rounded-2xl border shadow-xl space-y-6 transition-all ${
                theme === "parchment" || theme === "ancient-calligraphy"
                  ? "bg-[#faf5eb] border-[#bfa37c] text-[#2c1706]"
                  : theme === "solar"
                  ? "bg-[#fffdf5] border-[#fcd34d] text-[#451a03]"
                  : theme === "ethereal"
                  ? "bg-[#0b142c] border-[#1e3a8a] text-[#f0f9ff]"
                  : theme === "cyber-tech"
                  ? "bg-[#071915] border-[#065f46] text-[#ecfeff]"
                  : "bg-[#18130e] border-amber-700/60 text-[#f5ecd8]"
              }`}
            >
              {/* Chapter Header with Number & Bookmark */}
              <div className="border-b pb-4 flex items-center justify-between gap-3 border-inherit/25 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
                      {activeChapter.number}
                    </span>
                    <span className="text-[11px] opacity-60 font-serif">
                      • Μυθιστόρημα «Η Μυθική Ευρώπη»
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-serif font-bold tracking-tight">
                    {activeChapter.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-serif italic opacity-85">
                    {activeChapter.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(activeChapter.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      bookmarkedChapters.includes(activeChapter.id)
                        ? "bg-amber-600/30 border-amber-400 text-amber-300"
                        : "bg-black/10 hover:bg-black/20 border-inherit/20 text-inherit"
                    }`}
                    title={
                      bookmarkedChapters.includes(activeChapter.id)
                        ? "Αφαίρεση σελιδοδείκτη"
                        : "Προσθήκη σελιδοδείκτη"
                    }
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarkedChapters.includes(activeChapter.id)
                          ? "fill-amber-400 text-amber-400"
                          : ""
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleSpeakChapter}
                    className="p-2 rounded-xl bg-black/10 hover:bg-black/20 border border-inherit/20 text-inherit transition-colors cursor-pointer"
                    title={isSpeaking ? "Διακοπή ανάγνωσης" : "Ακρόαση κεφαλαίου"}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-4 h-4 text-red-400 animate-pulse" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Summary / Epigraph Box */}
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm italic font-serif leading-relaxed ${
                  theme === "parchment" || theme === "ancient-calligraphy"
                    ? "bg-[#f2e7d5] border-[#d8c8b1] text-[#4d280b]"
                    : theme === "solar"
                    ? "bg-[#fef3c7] border-[#fde68a] text-[#78350f]"
                    : theme === "ethereal"
                    ? "bg-[#111f42] border-[#2563eb]/50 text-[#bae6fd]"
                    : theme === "cyber-tech"
                    ? "bg-[#0b2620] border-[#059669]/50 text-[#a7f3d0]"
                    : "bg-[#201912] border-amber-900/60 text-amber-200/90"
                }`}
              >
                <div className="font-bold not-italic text-[10px] uppercase font-mono tracking-wider mb-1 text-amber-500">
                  ✦ Σύνοψη Κεφαλαίου ✦
                </div>
                {activeChapter.summary}
              </div>

              {/* Story Paragraphs */}
              <div
                className="space-y-4 font-serif leading-relaxed text-justify"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
              >
                {activeChapter.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="first-letter:text-2xl first-letter:font-bold first-letter:mr-0.5">
                    {p}
                  </p>
                ))}
              </div>

              {/* Isopsephic & Mystical Terms Box of this Chapter */}
              {activeChapter.keyTerms && activeChapter.keyTerms.length > 0 && (
                <div
                  className={`mt-8 p-5 rounded-2xl border space-y-3 ${
                    theme === "parchment" || theme === "ancient-calligraphy"
                      ? "bg-[#f4ebd9] border-[#cbb391]"
                      : theme === "solar"
                      ? "bg-[#fef9e7] border-[#fcd34d]"
                      : theme === "ethereal"
                      ? "bg-[#0e1a38] border-[#1e3a8a]"
                      : theme === "cyber-tech"
                      ? "bg-[#0a231d] border-[#065f46]"
                      : "bg-[#14100c] border-amber-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Ισοψηφική Αποκωδικοποίηση & Ιερά Ονόματα Κεφαλαίου
                    </h4>
                    <span className="text-[10px] font-mono opacity-70">
                      Κάντε κλικ για αποθήκευση στο Αρχείο
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeChapter.keyTerms.map((kt) => {
                      const isSaved = copiedTerm === kt.term;
                      return (
                        <div
                          key={kt.term}
                          className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                            theme === "parchment" || theme === "ancient-calligraphy"
                              ? "bg-white border-[#d2be9f]"
                              : theme === "solar"
                              ? "bg-white border-[#fde68a]"
                              : theme === "ethereal"
                              ? "bg-[#070e22] border-[#1e3a8a]"
                              : theme === "cyber-tech"
                              ? "bg-[#061814] border-[#065f46]"
                              : "bg-[#1f1812] border-amber-800/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm font-serif tracking-wider text-amber-400">
                              {kt.term}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/20 border border-inherit/20 text-amber-300">
                              = {kt.value.toLocaleString("el-GR")}
                            </span>
                          </div>

                          <p className="text-[11px] font-serif opacity-80 leading-snug">
                            {kt.explanation}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-inherit/15 text-[10px]">
                            {onOpenAiModal && (
                              <button
                                type="button"
                                onClick={() => onOpenAiModal(kt.term, kt.value, [kt.term])}
                                className="text-amber-500 hover:text-amber-300 flex items-center gap-1 font-serif cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>AI Ανάλυση</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleSaveTermToArchive(kt.term, kt.value, kt.explanation)}
                              className={`ml-auto px-2 py-0.5 rounded font-serif font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                isSaved
                                  ? "bg-emerald-600 text-white"
                                  : "bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white"
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Αποθηκεύτηκε!</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3 h-3" />
                                  <span>Αποθήκευση</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Pagination & Navigation */}
              <div className="pt-6 border-t border-inherit/20 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  disabled={activeChapterIndex === 0}
                  onClick={() => {
                    setActiveChapterIndex((prev) => Math.max(0, prev - 1));
                    handleStopSpeaking();
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  className="px-3.5 py-2 rounded-xl border border-inherit/30 hover:bg-black/20 text-xs font-serif flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Προηγούμενο Κεφάλαιο</span>
                </button>

                <span className="text-xs font-mono opacity-60">
                  {activeChapterIndex + 1} / {NOVEL_CHAPTERS.length}
                </span>

                <button
                  type="button"
                  disabled={activeChapterIndex === NOVEL_CHAPTERS.length - 1}
                  onClick={() => {
                    setActiveChapterIndex((prev) =>
                      Math.min(NOVEL_CHAPTERS.length - 1, prev + 1)
                    );
                    handleStopSpeaking();
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  className="px-3.5 py-2 rounded-xl border border-inherit/30 hover:bg-black/20 text-xs font-serif flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Επόμενο Κεφάλαιο</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
};
