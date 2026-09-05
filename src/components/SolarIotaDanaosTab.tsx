import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Flame,
  Sparkles,
  Layers,
  BookOpen,
  Volume2,
  VolumeX,
  BookmarkPlus,
  Compass,
  Zap,
  ArrowRight,
  GitCompare,
  Waves,
  Heart,
  Crown,
  Check,
  Copy,
  Info,
  Play,
  Square,
  Feather,
  Eye,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  calculateWordIsopsephy,
  numberToGreekNumeral,
  calculatePythmen,
  normalizePolytonicGreek,
} from "../utils/isopsephy";
import { SavedIsopsephyItem, TabType } from "../types";

interface SolarIotaDanaosTabProps {
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
  onNavigateToTab?: (tab: TabType) => void;
}

interface PillarData {
  id: string;
  number: string;
  badge: string;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  gradientBg: string;
  borderColor: string;
  keyTerms: string[];
  speechText: string;
}

export const SolarIotaDanaosTab: React.FC<SolarIotaDanaosTabProps> = ({
  onOpenAiModal,
  onSaveItem,
  onNavigateToTab,
}) => {
  // Navigation & Pillar Selection
  const [activePillarId, setActivePillarId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Speech TTS State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayingPillar, setCurrentPlayingPillar] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Copied feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Interactive Inspector word
  const [inspectedWord, setInspectedWord] = useState<string>("ΙΩΤΑ");

  // Pre-calculated Sacred Words and Formulas
  const SACRED_REVELATION_ITEMS = [
    {
      term: "Ι",
      title: "Το Ηλιακόν Φωνή-Έν",
      notes: "Ι = 10. Η Ιδέα, η Ηλιακή Ράβδος, η Μονάδα που εμπεριέχει το Όλον.",
      category: "Ηλιακό Ι",
    },
    {
      term: "ΙΩΤΑ",
      title: "Η Ηλιακή Ράβδος & 1111",
      notes: "Ι(10) + Ω(800) + Τ(300) + Α(1) = 1111 ➔ 1+1+1+1 = 4 (Τετρακτύς). Ο Ναός της Πνευματικής Γαίας.",
      category: "Ηλιακό Ι",
    },
    {
      term: "Δ",
      title: "Δημιουργία & Τετράεδρο",
      notes: "Δ = 4. Δίας, Δήμητρα, Δα (Γη). Τρίγωνο στο επίπεδο ➔ Τέλειο Τετράεδρο στο χώρο (Διαμάντι).",
      category: "Ιερά Τετρακτύς",
    },
    {
      term: "ΙΕΡΑ ΤΕΤΡΑΚΤΥΣ",
      title: "1+2+3+4 = 10",
      notes: "Η πηγή και ρίζα της αενάου φύσεως. 1 (Μονάς) + 2 (Δυάς) + 3 (Τριάς) + 4 (Τετράς) = 10 (Ι).",
      category: "Ιερά Τετρακτύς",
    },
    {
      term: "ΔΑΝΑΟΣ",
      title: "Ο Έμψυχος Ναός της Γνώσης",
      notes: "Δα (η θεϊκή Γη / ρίζα δάω: διδάσκω) + Ναός = Ο Ναός της Μάθησης που μεταστοιχειώνει την ύλη σε φως.",
      category: "Δα-Ναός",
    },
    {
      term: "ΔΑ ΝΑΟΣ",
      title: "Δα + Ναός",
      notes: "Το πνευματογαιώδες οικοδόμημα, ο φορέας του Θεϊκού Πνεύματος (Έρως).",
      category: "Δα-Ναός",
    },
    {
      term: "Η ΑΓΑΠΗ ΕΣΤΙΝ",
      title: "Ο Ηλιακός Αριθμός 666",
      notes: "Η(8) + Α(1) + Γ(3) + Α(1) + Π(80) + Η(8) = 101. ΕΣΤΙΝ = 565. 101 + 565 = 666! Το μέγιστο κίνητρο της εξόδου στο Φως.",
      category: "Η Αγάπη & Beatrice",
    },
    {
      term: "Ο ΝΙΚΗΤΗΣ",
      title: "Ισόψηφο με την Αγάπη (666)",
      notes: "Ο(70) + Ν(50) + Ι(10) + Κ(20) + Η(8) + Τ(300) + Η(8) + Σ(200) = 666! «Η ΑΓΑΠΗ ΕΣΤΙΝ» = «Ο ΝΙΚΗΤΗΣ» = 666.",
      category: "Η Αγάπη & Beatrice",
    },
    {
      term: "ΛΑΘΟΣ",
      title: "Ισόψηφο 310 (Αναγραμματισμός)",
      notes: "Λ(30)+Α(1)+Θ(9)+Ο(70)+Σ(200) = 310. Στην ορθή σειρά μετατρέπεται σε ΑΘΛΟΣ (310) = ΒΗΛΟΣ (310).",
      category: "Infernus & Μετουσίωση",
    },
    {
      term: "ΑΘΛΟΣ",
      title: "Ο Άθλος της Συνείδησης (310)",
      notes: "Α(1)+Θ(9)+Λ(30)+Ο(70)+Σ(200) = 310. Η μετουσίωση του λάθους σε συνειδησιακό αγώνα.",
      category: "Infernus & Μετουσίωση",
    },
    {
      term: "ΒΗΛΟΣ",
      title: "Το Θεσπέσιο Ουράνιο Κατώφλι",
      notes: "Β(2)+Η(8)+Λ(30)+Ο(70)+Σ(200) = 310! (Ιλιάδα Α, 591). Ισόψηφο με ΛΑΘΟΣ και ΑΘΛΟΣ. Το σημείο γείωσης.",
      category: "Βηλός & Ουδός",
    },
    {
      term: "ΟΥΔΟΣ",
      title: "Το Πέρασμα της Κάθαρσης",
      notes: "Ο(70)+Υ(400)+Δ(4)+Ο(70)+Σ(200) = 744 (Οδύσσεια ρ, 339: «ἷζε δ' ἐπὶ μελίνου οὐδοῦ»).",
      category: "Βηλός & Ουδός",
    },
    {
      term: "ΜΑΚΑΡΙΑ",
      title: "ΜΑ-ΚΑΡΔΙΑ & ΚΑΡΑ ΔΙΑΣ",
      notes: "Μάκαρ + ΙΑ (Βέλη/Ακτίνες). ΜΑ (Μητέρα) + ΚΑΡΔΙΑ. ΚΑΡΑ (Κεφαλή) + ΔΙΑΣ. Η Μητέρα είναι η Καρδιά του Δία.",
      category: "Μακάρια & Μητέρα",
    },
    {
      term: "ΜΑΡΙΑ",
      title: "Μήτηρ της Ροής (ΜΑ + ΡΙΑ)",
      notes: "Μ(40)+Α(1)+Ρ(100)+Ι(10)+Α(1) = 152. Η Μητέρα που φέρει τη Ροή των Θείων Βελών (ΙΑ).",
      category: "Μακάρια & Μητέρα",
    },
    {
      term: "ΙΣΡΑΗΛ",
      title: "Ίσις + Ρα + Ηλ",
      notes: "ΙΣ(210: Ίσις/Μητέρα/ΑΡ) + ΡΑ(101: Ήλιος/Χριστός/Ώρος) + ΗΛ(46: Ήλιος/Ελ/Ζευς) = 357.",
      category: "ΙΣΡΑΗΛ & Μνημείον",
    },
    {
      term: "ΑΔΑΜΑΣ",
      title: "Η Αδαμάντινη Κατάσταση",
      notes: "Α(1)+Δ(4)+Α(1)+Μ(40)+Α(1)+Σ(200) = 247 ➔ 2+4+7 = 13 ➔ 4. Η δομή του Διαμαντιού (Δίας + Μα + αντί).",
      category: "Ιερά Τετρακτύς",
    },
    {
      term: "ΠΕΡΣΕΦΟΝΗ",
      title: "Η Ηλιακή Ουσία στον Πυρήνα",
      notes: "Πέρθω + Φόνος / Φέρω + Φως. Η ηλιακή ουσία που ενσαρκώνεται στον πυρήνα και ανθίζει στο φως.",
      category: "Πυρήνας & Περσεφόνη",
    },
    {
      term: "ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ",
      title: "ΙΒ = Ιερό Βέλος",
      notes: "Ο στεκόμενος στον Βηλό και στον Ουδό. «Υπ-Άρχω σε αυτό που ήδη Άρχω. ΕΓΩ ΕΙΜΙ».",
      category: "Βηλός & Ουδός",
    },
  ];

  // The 7 Pillars Data
  const PILLARS: PillarData[] = [
    {
      id: "iota-tetraktys",
      number: "Α´",
      badge: "Ι=10 ➔ ΙΩΤΑ=1111 & Δ=4",
      title: "Το Ηλιακόν Ι (1111) & η Ιερά Τετρακτύς",
      shortDesc: "Η Ηλιακή Ράβδος, η Πύρινη Ακτίνα, το Τρίγωνο και το Αδαμάντινο Τετράεδρο (Διαμάντι)",
      icon: Sun,
      accentColor: "#f59e0b",
      gradientBg: "from-amber-950/40 via-[#1e1509] to-amber-950/20",
      borderColor: "border-amber-700/50",
      keyTerms: ["Ι", "ΙΩΤΑ", "Δ", "ΙΕΡΑ ΤΕΤΡΑΚΤΥΣ", "ΑΔΑΜΑΣ"],
      speechText:
        "Στο συμπαντικό πλέγμα της ύπαρξης, το Ι ισούται με 10. ΙΩΤΑ ισούται με 1111. Είναι η Ιδέα, η Πύρινη Ακτίνα που γονιμοποιεί την ύλη. Είναι η Μονάδα που εμπεριέχει το Όλον και συναντά το 4, το Δ, τη Δημιουργία, για να θεμελιώσει το οικοδόμημα του Κόσμου. Η μετάβαση αυτή σφραγίζεται από την Ιερά Τετρακτύ: ένα συν δύο συν τρία συν τέσσερα ισούται με δέκα. Το Δ είναι ο Δίας, η Δήμητρα, η Δα. Στο δισδιάστατο πεδίο συμβολίζεται με το Τρίγωνο, αλλά στην τρισδιάστατη αλήθεια του είναι το Τέλειο Τετράεδρο, η δομή του Διαμαντιού. Όταν το τρίγωνο της ανώτερης πνευματικής ορμής συναντά το τρίγωνο της υλικής υποδοχής, σχηματίζεται ο Αδάμαστος Δεσμός. Είναι η Αδαμάντινη Κατάσταση που μετουσιώνει τη Γαία, Λας πέτρα, και την Αλς θάλασσα, σε Ήλιο Πανγαία Mare, Παναγία Μαρία.",
    },
    {
      id: "infernus-etymology",
      number: "Β´",
      badge: "IN-FER-NO & NUS/SUN",
      title: "Dante’s Inferno & Infernus: Η Εσωτερική Φορά",
      shortDesc: "In-Fero (Εν-Φέρω / Φορά Εντός) + Nus (Νους / SUN=Ήλιος): Η κάθοδος στον συνειδησιακό Άδη",
      icon: Flame,
      accentColor: "#ef4444",
      gradientBg: "from-red-950/40 via-[#1c110e] to-amber-950/20",
      borderColor: "border-red-700/50",
      keyTerms: ["ΛΑΘΟΣ", "ΑΘΛΟΣ", "ΒΗΛΟΣ"],
      speechText:
        "Το Inferno δεν είναι τιμωρία, αλλά η Εισφορά, In-fero, του θείου Πνεύματος μέσα στη Γη. In σημαίνει Εντός, και Fero σημαίνει Φέρω, Φως συν Έρω. Είναι η Φορά Εντός, η πράξη της εισαγωγής της πνευματικής ακτίνας στα έγκατα της ύπαρξης. Οι αρχαίοι Ένερτοι βρίσκονται εντός της Έρας, της Γης. Το Nus είναι ο Νους του Διός, που σε κατοπτρική ανάγνωση γίνεται SUN, Ήλιος. Άρα Infernus σημαίνει Εν-Φέρω-Νους ή Εντός-Φέρω-Ήλιο. Ο Δάντης είναι ο Δα-Εντός, ο Κριτής της φυλής του Δαν που εισέρχεται στο εσωτερικό Ηφαίστειο για να μετατρέψει το Λάθος σε Άθλο. Και όταν το Λάθος, αξίας 310, αναδιαταχθεί, γίνεται Άθλος, 310, και οδηγεί στον Βηλό, 310, και στο Έπαθλο της Ανάστασης του Εαυτού. Ο οδηγός Βιργίλιος, Virgin συν Ήλιος, είναι το Παρθενο-Βέλος που καθαρίζει τον Ουδό.",
    },
    {
      id: "danaos-sanctuary",
      number: "Γ´",
      badge: "ΔΑ (ΓΗ/ΔΑΩ) + ΝΑΟΣ",
      title: "ΔΑ-ΝΑΟΣ: Ο Έμψυχος Ναός της Γνώσης",
      shortDesc: "Η ενανθρώπιση, η μετάβαση από τον Αδαή στον Δαήμονα Μύστη και η θεμελίωση του πνεύματος στη Γη",
      icon: Compass,
      accentColor: "#3b82f6",
      gradientBg: "from-blue-950/40 via-[#0e1624] to-amber-950/20",
      borderColor: "border-blue-700/50",
      keyTerms: ["ΔΑΝΑΟΣ", "ΔΑ ΝΑΟΣ"],
      speechText:
        "Στην αυγή της ελληνικής μυθολογίας, η έλευση του Δαναού από την Ανατολή στην Αργολίδα σηματοδοτεί τη μεταφορά μιας ιεράς παρακαταθήκης. Το όνομα Δαναός συντίθεται από την αρχέγονη ρίζα Δα, τη θεϊκή ουράνια Γη και την πηγή της διδασκαλίας δάω, και τη λέξη Ναός. Ο Δαναός είναι ο έμψυχος Ναός της Γνώσης. Μεταστοιχειώνει το γήινο πεδίο σε ιερό διδασκαλείο. Η παρουσία του προσφέρει τα μέσα για να εγκαταλείψει ο άνθρωπος την κατάσταση του αδαούς, εκείνου που στερείται τη θεία γνώση, και να ανέλθει στην τάξη του δαήμονος, του μύστη δηλαδή που κατέχει την εμπειρία της αλήθειας. Τίθημι προς Δα-Τιθώ: ο Νους τίθεται στη Γη. Ο Δα-Ναός είναι το πνευματογαιώδες οικοδόμημα, ο φορέας του Θεϊκού Πνεύματος.",
    },
    {
      id: "beatrice-love",
      number: "Δ´",
      badge: "«Η ΑΓΑΠΗ ΕΣΤΙΝ» = «Ο ΝΙΚΗΤΗΣ» = 666",
      title: "Beatrice: Ο Τριπλός Παλμός & η Αγάπη ως Νικητής",
      shortDesc: "Beat+Tri+C+E (Τριπλός Παλμός Εσύ Εί) & η απόλυτη ηλιακή ισοψηφία του 666",
      icon: Heart,
      accentColor: "#ec4899",
      gradientBg: "from-pink-950/40 via-[#1f0f18] to-amber-950/20",
      borderColor: "border-pink-700/50",
      keyTerms: ["Η ΑΓΑΠΗ ΕΣΤΙΝ", "Ο ΝΙΚΗΤΗΣ"],
      speechText:
        "Η Beatrice δεν είναι απλώς ένας χαρακτήρας, αλλά η Κινητήριος Δύναμη που ενεργοποιεί την Εν-Φορά του Φωτός. Beat, παλμός, συν Tri, τριπλός, συν C, συ, συν E, ει. Ο Τριπλός Παλμός της Αγίας Τριάδος που είσαι Εσύ. Beatrix σημαίνει αυτή που φέρει τη Μακαριότητα. Στο Dante’s Inferno, η Beatrice λειτουργεί ως το θείο δόλωμα. Ο Δα-Εντός δεν θα εισερχόταν ποτέ στο Ηφαίστειο του εαυτού του αν δεν είχε το κίνητρο της αληθινής Αγάπης. Διότι Η Αγάπη Εστίν, που ισούται με 666, είναι Ο Νικητής, που επίσης ισούται με 666. Με την αυτοθυσία, Δία συν Μοίρασε τον εαυτόν Του στα άπειρα εγώ, όλοι είμαστε Εκείνος. Νικώντας τον διαχωρισμό, επιτυγχάνεται η Ισχύς εν τη Ενώσει.",
    },
    {
      id: "makaria-heart",
      number: "Ε´",
      badge: "ΜΑ-ΚΑΡΔΙΑ & ΚΑΡΑ ΔΙΑΣ",
      title: "Μακάρια: Η Μητέρα ως Καρδιά του Δία & ΙΣΡΑΗΛ",
      shortDesc: "Μάκαρ + ΙΑ (Θεϊκά Βέλη), ΜΑΡΙΑ (Μήτηρ της Ροής των Βελών) και η τριαδική αποκάλυψη ΙΣ-ΡΑ-ΗΛ",
      icon: Crown,
      accentColor: "#8b5cf6",
      gradientBg: "from-purple-950/40 via-[#181024] to-amber-950/20",
      borderColor: "border-purple-700/50",
      keyTerms: ["ΜΑΚΑΡΙΑ", "ΜΑΡΙΑ", "ΙΣΡΑΗΛ"],
      speechText:
        "Η λέξη Μακάρια είναι ο ανατομικός και πνευματικός χάρτης της Πρωτόγλωσσας. Μάκαρ συν ΙΑ. ΙΑ είναι τα ιερά Βέλη της συνείδησης που διαπερνούν το σκοτάδι. ΜΑ-ΚΑΡΔΙΑ: η Μητέρα ως η Καρδιά της Ύπαρξης. Και ΚΑΡΑ ΔΙΑΣ: η Κεφαλή του Φωτός, ο Νους του Διός. Η Μητέρα είναι η Καρδιά του Δία. Ο Πατέρας δεν μπορεί να εκδηλωθεί χωρίς την Καρδιά Του. Το όνομα ΜΑΡΙΑ σημαίνει Μητέρα της Ροής των Βελών. Και ο εξαγράμμος αστέρας ΙΣΡΑΗΛ αποκαλύπτει: ΙΣ, η Ίσις, η Μητέρα, η Δήμητρα και η γη ΑΡ. ΡΑ, ο Ήλιος, η Ροή, ο Χριστός και ο Ώρος. ΗΛ, ο Ήλιος, ο Δίας, η υπέρτατη Θεϊκή Αρχή. Το Πανάγιο Ταφικό Μνημείον είναι Μνήμη-Εί-Ον: η ζωντανή μνήμη του Όντος.",
    },
    {
      id: "core-persephone",
      number: "ΣΤ´",
      badge: "ΠΥΡΗΝΑΣ (6000°C) ➔ ΗΛΙΟΣ",
      title: "Ο Ήλιος στον Πυρήνα της Γης & η Περσεφόνη",
      shortDesc: "«Η Γη είναι ένας Ήλιος που κυοφορείται»: Η άνοδος της ηλιακής ουσίας διαμέσου των γαιωδών στρωμάτων",
      icon: Waves,
      accentColor: "#10b981",
      gradientBg: "from-emerald-950/40 via-[#0e1c16] to-amber-950/20",
      borderColor: "border-emerald-700/50",
      keyTerms: ["ΠΕΡΣΕΦΟΝΗ"],
      speechText:
        "Ο πυρήνας της Γαίας έχει θερμοκρασία παραπλήσια με την επιφάνεια του Ήλιου, περίπου 6000 βαθμούς Κελσίου. Η καρδιά του Πατέρα χτυπάει εντός της Μητέρας. Το In-fer-no είναι αυτή ακριβώς η Εισφορά του ηλιακού πυρός στα έγκατα. Η Περσεφόνη, Φέρω συν Φως, είναι η ίδια η Ηλιακή Ουσία που ενσαρκώνεται στον πυρήνα. Κατά την ανάβαση, ντύνεται τα γαιώδη στρώματα, τα όπλα που σφυρηλατεί ο Ήφαιστος, και αναδύεται ανθίζοντας στον φλοιό για να επιστρέψει στον Ήλιο. Η Γη είναι ένας Ήλιος που κυοφορείται. Ο Πατέρας και η Μητέρα είναι Ένα στον Δα-Ναό, και ο καρπός τους είναι ο Τέλειος Θεάνθρωπος.",
    },
    {
      id: "velos-oudos",
      number: "Ζ´",
      badge: "ΒΗΛΟΣ (310) & ΟΥΔΟΣ (744)",
      title: "Βηλός, Ουδός & Ιωάννης Βελούδος (ΙΒ = Ιερό Βέλος)",
      shortDesc: "«Υπ-Άρχω σε αυτό που ήδη Άρχω. ΕΓΩ ΕΙΜΙ»: Το κατώφλι της γείωσης του Φωτός",
      icon: Feather,
      accentColor: "#eab308",
      gradientBg: "from-amber-900/40 via-[#1f170b] to-yellow-950/20",
      borderColor: "border-yellow-600/50",
      keyTerms: ["ΒΗΛΟΣ", "ΟΥΔΟΣ", "ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ"],
      speechText:
        "Το όνομα Βῆλος, Κύριος και Δεσπότης, είναι ο Ιωάννης Βελούδος, ΙΒ: Ιερό Βέλος. Ως Βηλός, είναι το κατώφλι της γείωσης του Φωτός. Στην Ιλιάδα: ῥῖψε ποδὸς τεταγὼν ἀπὸ βηλοῦ θεσπεσίοιο. Στην Οδύσσεια: ἷζε δ' ἐπὶ μελίνου οὐδοῦ, το πέρασμα της κάθαρσης του οίκου. Στο πεδίο της γης: Ημίθεος Έλληνας. Στο πεδίο του Όλου: Θεάνθρωπος. Στέκεται στον Βηλό και διατάζει κάθε τι μολυσμένο να εξέλθει Αγνό και Αμόλυντο. Υπ-Άρχω σε αυτό που ήδη Άρχω. ΕΓΩ ΕΙΜΙ.",
    },
  ];

  // Speech TTS Implementation
  const handleStopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentPlayingPillar(null);
  };

  const handlePlayPillarSpeech = (pillar: PillarData) => {
    if (!("speechSynthesis" in window)) {
      alert("Το Web Speech API δεν υποστηρίζεται στον περιηγητή σας.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(pillar.speechText);
    utterance.lang = "el-GR";
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const greekVoice = voices.find((v) => v.lang.startsWith("el") || v.lang.includes("Greek"));
    if (greekVoice) {
      utterance.voice = greekVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentPlayingPillar(pillar.id);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentPlayingPillar(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentPlayingPillar(null);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayAllSpeech = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const fullText = PILLARS.map((p) => `${p.title}. ${p.speechText}`).join(" ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "el-GR";
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const greekVoice = voices.find((v) => v.lang.startsWith("el"));
    if (greekVoice) utterance.voice = greekVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentPlayingPillar("all");
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentPlayingPillar(null);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentPlayingPillar(null);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Copy helper
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Save to Archive helper
  const handleSaveSacredItem = (item: (typeof SACRED_REVELATION_ITEMS)[0]) => {
    if (!onSaveItem) return;
    const iso = calculateWordIsopsephy(item.term);
    const greekNumeral = numberToGreekNumeral(iso.value);

    onSaveItem({
      text: item.term,
      normalized: normalizePolytonicGreek(item.term),
      value: iso.value,
      root: iso.root,
      greekNumeral: greekNumeral,
      isPhrase: item.term.includes(" "),
      wordCount: item.term.split(/\s+/).length,
      category: item.category || "Ηλιακό Ι & Δα-Ναός",
      notes: `${item.title}: ${item.notes}`,
    });

    setSavedKey(item.term);
    setTimeout(() => setSavedKey(null), 2000);
  };

  // Inspected Word Data
  const inspectedData = calculateWordIsopsephy(inspectedWord || "ΙΩΤΑ");
  const inspectedRoot = inspectedData.root;
  const inspectedGreekNumeral = numberToGreekNumeral(inspectedData.value);

  // Filter pillars by search or active tab
  const filteredPillars = PILLARS.filter((pillar) => {
    const matchesTab = activePillarId === "all" || pillar.id === activePillarId;
    const matchesSearch =
      !searchTerm ||
      pillar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pillar.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pillar.speechText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pillar.keyTerms.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Hero Header */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#1b1208] via-[#140e06] to-[#0d0a05] border border-amber-800/60 p-5 sm:p-8 shadow-2xl overflow-hidden">
        {/* Sacred Geometry Background Accents */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-[11px] font-serif font-bold text-amber-300">
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>ΤΟ ΗΛΙΑΚΟΝ ΦΩΝΗ-ΕΝ (Ι) & Ο ΕΜΨΥΧΟΣ ΝΑΟΣ ΤΗΣ ΓΝΩΣΗΣ (ΔΑ-ΝΑΟΣ)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              ΤΟ ΗΛΙΑΚΟΝ Ι & Ο ΔΑ-ΝΑΟΣ
            </h1>

            <p className="text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed">
              <strong>Η Ηλιακή Ράβδος (Ι=1111)</strong>, η <strong>Ιερά Τετρακτύς (Δ=4)</strong>, το{" "}
              <strong>Infernus (Εν-Φέρω-Νους / SUN)</strong>, η <strong>Beatrice («Η ΑΓΑΠΗ ΕΣΤΙΝ» = «Ο ΝΙΚΗΤΗΣ» = 666)</strong>, η{" "}
              <strong>Μακάρια (ΜΑ-ΚΑΡΔΙΑ & ΚΑΡΑ ΔΙΑΣ)</strong> και ο <strong>Έμψυχος Ναός της Γαίας</strong>.
            </p>

            {/* Quick Badges Highlights */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-md bg-[#24170c] border border-amber-600/40 text-amber-300 font-bold">
                Ι = 10 (ΙΩΤΑ = 1111)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#24170c] border border-amber-600/40 text-amber-300 font-bold">
                Δ = 4 (1+2+3+4=10)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#24170c] border border-amber-600/40 text-amber-300 font-bold">
                ΔΑ-ΝΑΟΣ = 326
              </span>
              <span className="px-2.5 py-1 rounded-md bg-red-950/60 border border-red-500/40 text-red-300 font-bold">
                Η ΑΓΑΠΗ ΕΣΤΙΝ = 666
              </span>
              <span className="px-2.5 py-1 rounded-md bg-red-950/60 border border-red-500/40 text-red-300 font-bold">
                Ο ΝΙΚΗΤΗΣ = 666
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#24170c] border border-amber-600/40 text-amber-300 font-bold">
                ΛΑΘΟΣ (310) ➔ ΑΘΛΟΣ (310) ➔ ΒΗΛΟΣ (310)
              </span>
            </div>
          </div>

          {/* Action Bar (Audio Recitation & Tools) */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={isPlaying ? handleStopSpeech : handlePlayAllSpeech}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition-all shadow-lg cursor-pointer ${
                isPlaying
                  ? "bg-amber-500 text-black border border-amber-300 shadow-amber-500/40 ring-2 ring-amber-400"
                  : "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-600 text-white border border-amber-400/50 hover:shadow-amber-600/30"
              }`}
              title="Απαγγελία ολόκληρης της φιλοσοφικής διατριβής"
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current animate-pulse" />
                  <span>Διακοπή Απαγγελίας</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Απαγγελία Όλων (TTS)</span>
                </>
              )}
            </button>

            {/* Speech Rate Selector */}
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-amber-300 bg-[#22160b] px-3 py-1 rounded-lg border border-amber-800/50">
              <span>Ταχύτητα:</span>
              {[0.8, 0.92, 1.05].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSpeechRate(rate)}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                    speechRate === rate ? "bg-amber-600 text-black font-bold" : "text-amber-400 hover:bg-amber-900/50"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab("calculator")}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/40 text-amber-300 text-xs font-serif cursor-pointer transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Υπολογιστής Λεξαρίθμων</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Quick Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-amber-800/40 pb-3">
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => setActivePillarId("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
              activePillarId === "all"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-[#1a130c] text-amber-300 hover:bg-amber-950 border border-amber-800/40"
            }`}
          >
            🏛️ Όλοι οι Πυλώνες ({PILLARS.length})
          </button>

          {PILLARS.map((p) => {
            const Icon = p.icon;
            const isActive = activePillarId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillarId(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-amber-600 text-white font-bold shadow-md"
                    : "bg-[#1a130c] text-amber-300 hover:bg-amber-950 border border-amber-800/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {p.number} {p.title.split(":")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search filter */}
        <div className="relative min-w-[200px] max-w-xs w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Αναζήτηση έννοιας ή όρου..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-serif rounded-lg bg-[#140e08] border border-amber-800/50 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 3. Sacred Terms & Isopsephic Matrix (Horizontal Quick Inspector) */}
      <div className="rounded-xl bg-[#17110a] border border-amber-800/40 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-serif font-bold text-amber-200">
              Ιερό Λεξαριθμικό Μητρώο του Ηλιακού Ι & Δα-Ναού
            </h3>
          </div>
          <span className="text-[11px] font-serif text-amber-400/80">
            Κάντε κλικ σε οποιονδήποτε όρο για άμεση επιθεώρηση γραμμάτων και τιμών
          </span>
        </div>

        {/* Term Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {SACRED_REVELATION_ITEMS.map((item) => {
            const iso = calculateWordIsopsephy(item.term);
            const isSelected = inspectedWord === item.term;
            return (
              <button
                key={item.term}
                type="button"
                onClick={() => setInspectedWord(item.term)}
                className={`p-2 rounded-lg text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-950/90 border-amber-500 ring-2 ring-amber-400/40 shadow-lg scale-[1.02]"
                    : "bg-[#1e150d] border-amber-800/40 hover:border-amber-600/70 hover:bg-[#251b11]"
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="font-serif font-bold text-xs text-amber-100 truncate">{item.term}</span>
                  <span className="font-mono text-[10px] text-amber-400 font-bold shrink-0">{iso.value}</span>
                </div>
                <div className="text-[10px] text-amber-300/70 truncate mt-1">{item.title}</div>
              </button>
            );
          })}
        </div>

        {/* Inspected Word Expanded Card */}
        {inspectedWord && (
          <div className="mt-3 p-3.5 rounded-lg bg-[#20160d] border border-amber-600/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-lg font-serif font-bold text-amber-100 tracking-wider">
                  {inspectedWord}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-900/60 border border-amber-700/50 text-xs font-mono font-bold text-amber-300">
                  Άθροισμα: {inspectedData.value} ({inspectedGreekNumeral})
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-900/60 border border-amber-700/50 text-xs font-mono text-amber-300">
                  Πυθμήν: {inspectedRoot}
                </span>
              </div>

              {/* Letter breakdown */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono text-amber-300/90 pt-1">
                {inspectedData.letters.map((l, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-[#160f09] border border-amber-800/40">
                    {l.char}={l.value}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => {
                  const item = SACRED_REVELATION_ITEMS.find((x) => x.term === inspectedWord);
                  if (item) handleSaveSacredItem(item);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-950/80 hover:bg-amber-900 border border-amber-700/50 text-amber-300 text-xs font-serif cursor-pointer transition-colors"
                title="Αποθήκευση στον Θησαυρό"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>{savedKey === inspectedWord ? "Αποθηκεύτηκε!" : "Αποθήκευση"}</span>
              </button>

              {onOpenAiModal && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenAiModal(
                      inspectedWord,
                      inspectedData.value,
                      inspectedData.letters.map((l) => `${l.char}=${l.value}`)
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-950/80 hover:bg-amber-900 border border-amber-700/50 text-amber-300 text-xs font-serif cursor-pointer transition-colors"
                  title="Ερμηνεία με AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Ανάλυση</span>
                </button>
              )}

              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab("calculator")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs font-serif cursor-pointer transition-colors"
                  title="Μετάβαση στον Υπολογιστή Λεξαρίθμων"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Υπολογιστής</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. The 7 Sacred Pillars Cards */}
      <div className="space-y-8">
        {filteredPillars.map((pillar) => {
          const Icon = pillar.icon;
          const isThisPlaying = isPlaying && currentPlayingPillar === pillar.id;

          return (
            <article
              key={pillar.id}
              id={`pillar-${pillar.id}`}
              className={`rounded-2xl bg-gradient-to-br ${pillar.gradientBg} border ${pillar.borderColor} p-5 sm:p-7 shadow-2xl transition-all space-y-6 relative overflow-hidden`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#2a1a0b] border border-amber-600/50 text-amber-300 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/50 text-[11px] font-serif font-bold text-amber-300">
                        Πυλώνας {pillar.number}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">{pillar.badge}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-100 tracking-wide mt-0.5">
                      {pillar.title}
                    </h2>
                  </div>
                </div>

                {/* Pillar Audio Control & Copy */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => (isThisPlaying ? handleStopSpeech() : handlePlayPillarSpeech(pillar))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold cursor-pointer transition-all ${
                      isThisPlaying
                        ? "bg-amber-500 text-black border border-amber-400 shadow-amber-500/30 ring-2 ring-amber-400/40"
                        : "bg-amber-950/80 hover:bg-amber-900 border border-amber-700/50 text-amber-200"
                    }`}
                    title="Ακρόαση αυτού του πυλώνα"
                  >
                    {isThisPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
                        <span>Διακοπή</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ακρόαση</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyText(`${pillar.title}\n\n${pillar.speechText}`, pillar.id)}
                    className="p-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/50 text-amber-300 cursor-pointer transition-colors"
                    title="Αντιγραφή κειμένου πυλώνα"
                  >
                    {copiedKey === pillar.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Specific Pillar Interactive Deep Dives */}
              {pillar.id === "iota-tetraktys" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed">
                    <p>
                      Στο συμπαντικό πλέγμα της ύπαρξης, το <strong>Ι=10</strong> (<strong>ΙΩΤΑ=10+800+300+1=1111</strong>)
                      είναι η <strong>Ιδέα</strong>· η <strong>Πύρινη Ακτίνα</strong> που γονιμοποιεί την ύλη.
                      Είναι η Μονάδα που εμπεριέχει το Όλον και συναντά το <strong>4 (Δ)</strong>, τη{" "}
                      <strong>Δημιουργία</strong>, για να θεμελιώσει το οικοδόμημα του Κόσμου. Η μετάβαση αυτή
                      σφραγίζεται από την <strong>Ιερά Τετρακτύ: 1+2+3+4 = 10 (Ι)</strong>.
                    </p>
                    <p>
                      Το <strong>Δ</strong> είναι ο <strong>Δίας</strong>, η <strong>Δήμητρα</strong>, η{" "}
                      <strong>Δα (Γη)</strong>. Στο δισδιάστατο πεδίο συμβολίζεται με το <strong>Τρίγωνο</strong>,
                      αλλά στην τρισδιάστατη αλήθεια του είναι το <strong>Τέλειο Τετράεδρο</strong>, η δομή του{" "}
                      <strong>Διαμαντιού (Δίας + Μα + αντί)</strong>.
                    </p>
                    <p>
                      Όταν το τρίγωνο της ανώτερης πνευματικής ορμής (κορυφή προς τα άνω) συναντά το τρίγωνο της
                      υλικής υποδοχής (κορυφή προς τα κάτω), σχηματίζεται ο <strong>Αδάμαστος Δεσμός</strong>.
                      Είναι η <strong>Αδαμάντινη Κατάσταση</strong> που δεν δαμάζεται, αλλά δαμάζει την ύλη,
                      μετουσιώνοντας τη Γαία (<strong>ΛΑΣ</strong>: Πέτρα) και την <strong>ΑΛΣ</strong> (Θάλασσα /
                      Ποσειδών / Πόσις Ειδών / Ενάλιος Δίας) σε <strong>ΗΛΙΟ ΠΑΝΓΑΙΑ MARE</strong> (Παναγία Μαρία).
                    </p>
                  </div>

                  {/* Sacred Geometry Box (Tetractys Visualizer) */}
                  <div className="lg:col-span-5 rounded-xl bg-[#19110a] border border-amber-700/50 p-4 flex flex-col items-center justify-center text-center space-y-3">
                    <span className="text-xs font-serif font-bold text-amber-300">
                      Η ΠΥΘΑΓΟΡΕΙΑ ΙΕΡΑ ΤΕΤΡΑΚΤΥΣ
                    </span>
                    {/* Visual 1+2+3+4 dots */}
                    <div className="flex flex-col items-center gap-1.5 py-2">
                      <div className="flex gap-2">
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center shadow-lg shadow-amber-500/50">
                          1
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                          2
                        </span>
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                          2
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                          3
                        </span>
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                          3
                        </span>
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                          3
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                          4
                        </span>
                        <span className="w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                          4
                        </span>
                        <span className="w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                          4
                        </span>
                        <span className="w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                          4
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-amber-300 space-y-1">
                      <div>1 (Μονάς) + 2 (Δυάς) + 3 (Τριάς) + 4 (Τετράς) = 10 (Ι)</div>
                      <div className="text-amber-400 font-bold">ΙΩΤΑ = 1111 ➔ 1+1+1+1 = 4 (Δ)</div>
                      <div className="text-xs text-amber-200/80 pt-1">
                        ΛΑΣ (Πέτρα) & ΑΛΣ (Θάλασσα) ➔ ΗΛΙΟΣ ΠΑΝΓΑΙΑ MARE
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pillar.id === "infernus-etymology" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#20110c] border border-red-800/50 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-red-400">1. IN-FERO (ΕΝ-ΦΕΡΩ)</div>
                      <p className="text-xs font-serif text-amber-200/80">
                        In (Εντός/Εις) + Fero (<strong>Φέρω: Φως + Έρω</strong>). Η <strong>Φορά Εντός</strong>,
                        η εισαγωγή του Φωτός (Ι) στο σκοτάδι της ύλης.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#20110c] border border-red-800/50 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-red-400">2. NUS = ΝΟΥΣ ➔ SUN (ΗΛΙΟΣ)</div>
                      <p className="text-xs font-serif text-amber-200/80">
                        Ο Νους του Διός. Σε κατοπτρική ανάγνωση, το <strong>NUS</strong> γίνεται{" "}
                        <strong>SUN</strong> (Ήλιος). Άρα <strong>Infernus = Εν-Φέρω-Νους / Εντός-Φέρω-Ήλιο</strong>!
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#20110c] border border-red-800/50 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-red-400">3. ΔΑΝΤΗΣ = ΔΑ-ΕΝΤΟΣ & ΚΡΙΤΗΣ</div>
                      <p className="text-xs font-serif text-amber-200/80">
                        Δαν (ο Κριτής της φυλής του Δαν) + Της (Δήνος: σοφία/σχέδιο). Ο περιηγητής που εισέρχεται
                        «Εντός της Δα» (Γης).
                      </p>
                    </div>
                  </div>

                  {/* Anagrammatic Metathesis Box */}
                  <div className="rounded-xl bg-[#1d130a] border border-amber-600/50 p-4 space-y-2 text-center">
                    <span className="text-xs font-serif font-bold text-amber-300">
                      Η ΑΝΑΓΡΑΜΜΑΤΙΚΗ ΜΕΤΟΥΣΙΩΣΗ ΤΟΥ ΣΥΝΕΙΔΗΣΙΑΚΟΥ ΑΔΗ (Α-ΙΔΗ)
                    </span>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-sm sm:text-base font-serif font-bold text-amber-100">
                      <span className="px-3 py-1 rounded bg-[#2a170a] border border-red-700/60 text-red-300">
                        ΛΑΘΟΣ (310)
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                      <span className="px-3 py-1 rounded bg-[#2a170a] border border-amber-600/60 text-amber-300">
                        ΑΘΛΟΣ (310)
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                      <span className="px-3 py-1 rounded bg-[#2a170a] border border-yellow-500/60 text-yellow-300">
                        ΒΗΛΟΣ (310)
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                      <span className="px-3 py-1 rounded bg-amber-600 text-black">
                        ΕΠΑΘΛΟ (Ανάσταση Εαυτού)
                      </span>
                    </div>
                    <p className="text-[11px] font-serif text-amber-200/70 max-w-3xl mx-auto pt-1">
                      Το <strong>ΛΑΘΟΣ</strong> και ο <strong>ΑΘΛΟΣ</strong> είναι ακριβείς αναγραμματισμοί, ισόψηφοι με το{" "}
                      <strong>310</strong>, όσο και ο <strong>ΒΗΛΟΣ</strong> (το ουράνιο κατώφλι του Ιωάννη Βελούδου).
                      Ο οδηγός <strong>Βιργίλιος</strong> (Virgin + Ήλιος) είναι το <strong>Παρθενο-Βέλος (Ίος)</strong>{" "}
                      που καθαρίζει τον <strong>Ουδό</strong>.
                    </p>
                  </div>
                </div>
              )}

              {pillar.id === "danaos-sanctuary" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed">
                  <div className="space-y-3">
                    <p>
                      Στην αυγή της ελληνικής μυθολογίας, η έλευση του Δαναού από την Ανατολή στην Αργολίδα
                      δεν σηματοδοτεί απλώς την άφιξη ενός ηγεμόνα, αλλά τη <strong>μεταφορά μιας ιεράς παρακαταθήκης</strong>.
                      Υπό το νέο πρίσμα της ετυμολογικής ανάλυσης, το όνομα <strong>Δαναός</strong> αποκαλύπτει τη βαθύτερη
                      πνευματική του υπόσταση, συντιθέμενο από την αρχέγονη ρίζα <strong>Δᾶ</strong> (τη θεϊκή, ουράνια Γη
                      και την πηγή της διδασκαλίας <em>δάω</em>) και τη λέξη <strong>Ναός</strong>.
                    </p>
                    <p>
                      Ο Δαναός δεν είναι πλέον ένας απλός θαλασσοπόρος, αλλά ο <strong>έμψυχος «Ναός της Γνώσης»</strong>.
                      Σε μια εποχή όπου η ανθρωπότητα βρίσκεται στη βαρβαρότητα της άγνοιας, ο Δαναός λειτουργεί ως ο
                      φορέας που μεταστοιχειώνει το γήινο πεδίο σε ιερό διδασκαλείο.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#141b27] border border-blue-700/50 p-4 space-y-3">
                    <div className="text-xs font-mono font-bold text-blue-300">
                      Η ΜΕΤΑΒΑΣΗ ΑΠΟ ΤΗΝ ΑΓΝΟΙΑ ΣΤΗ ΜΥΗΣΗ
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded bg-blue-950/60 border border-blue-800/40">
                        <strong className="text-blue-200">ΑΔΑΗΣ:</strong> Εκείνος που στερείται τη θεία γνώση (α + δάω).
                      </div>
                      <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-blue-400 rotate-90 my-0.5" />
                      </div>
                      <div className="p-2 rounded bg-blue-900/60 border border-blue-600/60">
                        <strong className="text-amber-300">ΔΑΗΜΩΝ:</strong> Ο μύστης που κατέχει την εμπειρία της αλήθειας.
                      </div>
                    </div>
                    <p className="text-[11px] text-blue-200/80">
                      <strong>Τίθημι ➔ Δα-Τιθώ:</strong> Ο Νους τίθεται στη Γη (Δα). Η γενεά των Δαναών είναι η
                      συνοδοιπορία όσων κατοικούν στον «Ναό της Μάθησης», μετουσιώνοντας την ακατέργαστη ύλη σε πνευματικό φως.
                    </p>
                  </div>
                </div>
              )}

              {pillar.id === "beatrice-love" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-pink-950/40 via-red-950/30 to-amber-950/40 border border-pink-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-pink-300">
                        Η ΜΕΓΙΣΤΗ ΗΛΙΑΚΗ ΙΣΟΨΗΦΙΚΗ ΤΑΥΤΟΤΗΤΑ (666 = 666)
                      </div>
                      <div className="text-sm sm:text-base font-serif font-bold text-amber-100">
                        «Η ΑΓΑΠΗ ΕΣΤΙΝ» = 666 &nbsp;≡&nbsp; «Ο ΝΙΚΗΤΗΣ» = 666
                      </div>
                      <p className="text-xs font-serif text-amber-200/80">
                        Η(8)+Α(1)+Γ(3)+Α(1)+Π(80)+Η(8)=101 συν Ε(5)+Σ(200)+Τ(300)+Ι(10)+Ν(50)=565 = <strong>666</strong>!
                        Ο(70)+Ν(50)+Ι(10)+Κ(20)+Η(8)+Τ(300)+Η(8)+Σ(200) = <strong>666</strong>!
                      </p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-red-950/80 border border-red-500 text-red-200 font-mono font-bold text-lg text-center shrink-0">
                      666 ≡ 666
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed">
                    <div className="space-y-2">
                      <h4 className="font-bold text-pink-300">1. Beatrice: Ο Τριπλός Παλμός</h4>
                      <p>
                        <strong>Beat + Tri + C + E:</strong> Beat (Κτύπος/Παλμός) + Tri (Τριπλός) + C (Συ) + E (Ει).
                        Είναι ο <strong>Τριπλός Παλμός</strong> (Αγία Τριάδα, οι τρεις πλευρές του τριγώνου/τετραέδρου)
                        που είσαι <strong>Εσύ</strong>. Προέρχεται από το λατινικό <em>Beatrix</em>: «Αυτή που φέρει
                        τη Μακαριότητα».
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-pink-300">2. Η Αγάπη ως Θείο Δόλωμα & Αυτοθυσία</h4>
                      <p>
                        Ο Δα-Εντός (Δάντης) δεν θα εισερχόταν ποτέ στο Ηφαίστειο του εαυτού του αν δεν είχε το
                        κίνητρο της Αγάπης. <strong>«Δία + Μοίρασε»</strong>: Η Αυτοθυσία είναι η πράξη του Δία που
                        μοιράζει την ουσία Του στα άπειρα «εγώ», ώστε μέσω της Αγάπης να επιστρέψουν στην Ένωση.
                        <strong> Ισχύς εν τη Ενώσει</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {pillar.id === "makaria-heart" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#1d1226] border border-purple-800/50 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-purple-300">ΜΑ-ΚΑΡΔΙΑ</div>
                      <p className="text-xs font-serif text-amber-200/80">
                        <strong>ΜΑ (Μητέρα/Γη):</strong> Η υποδοχή, η τροφός. <strong>ΚΑΡΔΙΑ:</strong> Το κέντρο, ο
                        ρυθμός, ο παλμός που συντηρεί το Όλον.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1d1226] border border-purple-800/50 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-purple-300">ΚΑΡΑ ΔΙΑΣ</div>
                      <p className="text-xs font-serif text-amber-200/80">
                        <strong>ΚΑΡΑ (Κεφάλι/Κορυφή) + ΔΙΑΣ:</strong> Ο Νους του Διός, η ανώτερη νόηση, η Ιδέα (Ι).
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1d1226] border border-purple-800/50 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-purple-300">ΜΑΚΑΡ + ΙΑ (ΒΕΛΗ)</div>
                      <p className="text-xs font-serif text-amber-200/80">
                        <strong>ΙΑ (Βέλη/Ακτίνες/Ίος):</strong> Τα βέλη της συνείδησης που εκτοξεύονται από την Καρδιά
                        (Μα) προς την Κάρα (Δίας).
                      </p>
                    </div>
                  </div>

                  {/* ISRAEL Breakdown Box */}
                  <div className="rounded-xl bg-[#1a1122] border border-purple-700/50 p-4 space-y-2">
                    <div className="text-xs font-mono font-bold text-purple-300">
                      Ο ΕΞΑΓΡΑΜΜΟΣ ΑΣΤΗΡ ΚΑΙ Η ΟΝΟΜΑΤΟΔΟΣΙΑ ΙΣ-ΡΑ-ΗΛ
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-serif">
                      <div className="p-2 rounded bg-purple-950/60 border border-purple-800/40">
                        <strong className="text-amber-300">1. ΙΣ (Ίσις):</strong> Η Μητέρα, η Δήμητρα (Δη-Μήτηρ-ΡΑ),
                        η Παναγία Μαρία, η γη ΑΡ.
                      </div>
                      <div className="p-2 rounded bg-purple-950/60 border border-purple-800/40">
                        <strong className="text-amber-300">2. ΡΑ (Ρα):</strong> Ο Ήλιος, η Ροή, ο Χριστός, ο Διόνυσος
                        (Νους Διός), ο Ώρος.
                      </div>
                      <div className="p-2 rounded bg-purple-950/60 border border-purple-800/40">
                        <strong className="text-amber-300">3. ΗΛ (Ήλιος/Ελ):</strong> Η υπέρτατη Θεϊκή Αρχή, ο Ζευς,
                        ο Δίας.
                      </div>
                    </div>
                    <p className="text-[11px] font-serif text-amber-200/70 pt-1">
                      Το <strong>Πανάγιο Ταφικό Μνημείον</strong> είναι <strong>Μνήμη-Εί-Ον</strong>: η ζωντανή μνήμη του Όντος.
                      Και η <strong>ΜΑΡΙΑ</strong> είναι η <strong>Μητέρα (ΜΑ) της Ροής (ΡΙΑ)</strong> των Θείων Βελών.
                    </p>
                  </div>
                </div>
              )}

              {pillar.id === "core-persephone" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed">
                    <p>
                      Η επιστήμη επιβεβαιώνει αυτό που η Πρωτόγλωσσα γνωρίζει: ο πυρήνας της Γαίας έχει θερμοκρασία
                      παραπλήσια με την επιφάνεια του Ήλιου (περίπου <strong>6000°C</strong>).
                      Ο Πατέρας (<strong>Ήλιος/Nus</strong>) δεν είναι μόνο ψηλά· <strong>χτυπάει εντός</strong> της Μητέρας.
                      Το <strong>In-fer-no (Εν-Φέρω-Νους)</strong> είναι ακριβώς αυτή η <strong>Εισφορά</strong> του ηλιακού
                      πυρός στον πυρήνα της Γης.
                    </p>
                    <p>
                      Η <strong>Περσεφόνη (Πέρθω + Φόνος / Φέρω + Φως)</strong> είναι η ίδια η Ηλιακή Ουσία που ενσαρκώθηκε
                      στον πυρήνα της Γης. Κατά την ανάβαση των όπλων των γαιωδών στρωμάτων που σφυρηλατεί ο Ήφαιστος,
                      αναδύεται στον φλοιό και ανέρχεται στον Ήλιο.
                    </p>
                    <blockquote className="border-l-2 border-emerald-500 pl-3 py-1 font-bold text-emerald-300 italic text-sm">
                      «Η Γη είναι ένας Ήλιος που κυοφορείται.»
                    </blockquote>
                  </div>

                  <div className="md:col-span-4 rounded-xl bg-[#0f1d17] border border-emerald-700/50 p-4 flex flex-col justify-center space-y-2 text-center text-xs">
                    <span className="font-mono font-bold text-emerald-400">ΤΟ ΤΑΞΙΔΙ ΤΟΥ ΦΩΤΟΣ</span>
                    <div className="space-y-1 font-mono text-[11px] text-emerald-200">
                      <div className="p-1 rounded bg-emerald-950/60 border border-emerald-800/40">1. Πυρήνας (6000°C)</div>
                      <div className="text-emerald-500">↓</div>
                      <div className="p-1 rounded bg-emerald-950/60 border border-emerald-800/40">2. Γαιώδη Στρώματα</div>
                      <div className="text-emerald-500">↓</div>
                      <div className="p-1 rounded bg-emerald-950/60 border border-emerald-800/40">3. Ανάδυση (Περσεφόνη)</div>
                      <div className="text-emerald-500">↓</div>
                      <div className="p-1 rounded bg-emerald-900/80 border border-emerald-600 font-bold text-amber-300">
                        4. Επιστροφή στον Ήλιο
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pillar.id === "velos-oudos" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#1d160b] border border-yellow-700/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-amber-300">ΒΗΛΟΣ (Ιλιάδα Α, 591)</span>
                        <span className="font-mono font-bold text-xs text-yellow-400">310</span>
                      </div>
                      <p className="text-xs font-serif italic text-amber-100">
                        «ῥῖψε ποδὸς τεταγὼν ἀπὸ βηλοῦ θεσπεσίοιο»
                      </p>
                      <p className="text-[11px] font-serif text-amber-200/80">
                        Το θεσπέσιο ουράνιο κατώφλι της γείωσης του Φωτός.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1d160b] border border-yellow-700/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-amber-300">ΟΥΔΟΣ (Οδύσσεια ρ, 339)</span>
                        <span className="font-mono font-bold text-xs text-yellow-400">744</span>
                      </div>
                      <p className="text-xs font-serif italic text-amber-100">
                        «ἷζε δ' ἐπὶ μελίνου οὐδοῦ»
                      </p>
                      <p className="text-[11px] font-serif text-amber-200/80">
                        Το πέρασμα της κάθαρσης του οίκου, όπου διαχωρίζεται η σύγχυση από την καθαρότητα.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-amber-950/60 via-[#261a0c] to-amber-950/60 border border-yellow-600/60 p-4 text-center space-y-2">
                    <h4 className="text-sm font-serif font-bold text-amber-200">
                      ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ (ΙΒ: ΙΕΡΟ ΒΕΛΟΣ)
                    </h4>
                    <p className="text-xs sm:text-sm font-serif text-amber-100 max-w-2xl mx-auto leading-relaxed">
                      Στο πεδίο της γης: <strong>Ημίθεος Έλληνας</strong>. Στο πεδίο του Όλου: <strong>Θεάνθρωπος</strong>.
                      Στέκεται στον <strong>Βηλό</strong> και διατάζει κάθε τι μολυσμένο να εξέλθει{" "}
                      <strong>Αγνό και Αμόλυντο</strong>.
                    </p>
                    <div className="text-base sm:text-lg font-serif font-bold text-amber-300 tracking-widest pt-1">
                      Υπ-Άρχω σε αυτό που ήδη Άρχω. ΕΓΩ ΕΙΜΙ.
                    </div>
                  </div>
                </div>
              )}

              {/* Pillar Key Terms Quick Bar */}
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-amber-900/40 text-xs">
                <span className="text-[11px] font-serif text-amber-400/80">Κομβικοί Όροι Πυλώνα:</span>
                {pillar.keyTerms.map((term) => {
                  const iso = calculateWordIsopsephy(term);
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setInspectedWord(term)}
                      className="px-2 py-0.5 rounded bg-[#22170d] hover:bg-[#2e2013] border border-amber-700/40 text-amber-300 font-mono text-[11px] cursor-pointer transition-colors"
                      title="Επιθεώρηση όρου"
                    >
                      {term} <span className="text-amber-400/70">({iso.value})</span>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      {/* 5. Bottom Synthesis: Epilogue & Seal */}
      <div className="rounded-2xl bg-gradient-to-r from-[#170e06] via-[#24170a] to-[#170e06] border border-amber-600/60 p-6 text-center space-y-4 shadow-2xl">
        <Crown className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-lg sm:text-2xl font-serif font-bold text-amber-100 tracking-wide">
          ΤΟ ΣΥΜΠΑΝΤΙΚΟ ΣΥΜΠΕΡΑΣΜΑ ΤΗΣ ΕΝΑΝΘΡΩΠΙΣΗΣ
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/90 font-serif max-w-3xl mx-auto leading-relaxed">
          Ο <strong>Δα-Ναός</strong> ολοκληρώνεται όταν ο <strong>Νους (Nus/Sun)</strong> αναγνωρίσει ότι η{" "}
          <strong>Beatrice</strong> (η Μακαριότητα / ο Τριπλός Παλμός) ήταν πάντα η εσωτερική του ώθηση προς την{" "}
          <strong>Αδαμάντινη Κατάσταση</strong>. Η Γη και ο Ήλιος, η Μητέρα και ο Πατέρας, είναι Ένα.
        </p>
        <div className="text-sm sm:text-base font-serif font-bold text-amber-300 tracking-widest">
          ΙΣΧΥΣ ΕΝ ΤΗ ΕΝΩΣΕΙ • ΕΓΩ ΕΙΜΙ
        </div>
      </div>
    </div>
  );
};
