import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Sun,
  Flame,
  Sparkles,
  Layers,
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  BookmarkPlus,
  Compass,
  Zap,
  RotateCcw,
  ArrowRight,
  GitCompare,
  Waves,
  Activity,
  Heart,
  Crown,
  Maximize2,
  Check,
  Copy,
  Info,
} from "lucide-react";
import {
  calculateWordIsopsephy,
  numberToGreekNumeral,
  normalizePolytonicGreek,
} from "../utils/isopsephy";
import { SavedIsopsephyItem } from "../types";

interface EnotheismTabProps {
  onOpenAiModal?: (text: string, number: number, words: string[]) => void;
  onSaveItem?: (item: Omit<SavedIsopsephyItem, "id" | "createdAt">) => void;
}

export interface DivineAspect {
  id: "zeus" | "hades" | "poseidon" | "apollo" | "dionysus" | "heracles";
  name: string;
  altNames: string[];
  canonicalFormula: string;
  value: number;
  altValues: { name: string; value: number }[];
  greekNumeral: string;
  root: number; // Pythmen 1-9
  element: string;
  domain: string;
  archetype: string;
  symbol: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  freq: number;
  freqLabel: string;
  oppositeId: "hades" | "zeus" | "heracles" | "dionysus" | "apollo" | "poseidon";
  oppositeName: string;
  polarityTheme: string;
  theologicalRole: string;
  isopsephicMysteries: string[];
  orphicFragment: string;
  citation: string;
}

export const DIVINE_ASPECTS: DivineAspect[] = [
  {
    id: "zeus",
    name: "ΖΕΥΣ",
    altNames: ["ΔΙΑΣ", "ΖΕΥΣ ΒΑΣΙΛΕΥΣ", "ΠΑΝΤΕΠΟΠΤΗΣ"],
    canonicalFormula: "Ζ(7) + Ε(5) + Υ(400) + Σ(200) = 612",
    value: 612,
    altValues: [
      { name: "ΔΙΑΣ", value: 215 },
      { name: "Ο ΖΕΥΣ", value: 682 },
      { name: "ΖΕΥΣ ΒΑΣΙΛΕΥΣ", value: 1459 },
    ],
    greekNumeral: "χιβ´",
    root: 9,
    element: "Αἰθήρ & Οὐράνιον Πῦρ",
    domain: "Δημιουργικός Νους, Ύπατη Τάξη & Κοσμική Συνεκτικότητα",
    archetype: "Ο Πατέρας των Πάντων, η Πηγή της Κοσμικής Νομοτέλειας",
    symbol: "⚡ Κεραυνός & Αετός",
    color: "#ffd700",
    bgGradient: "from-[#422e14] via-[#2a1d0d] to-[#120c06]",
    borderColor: "#e6c670",
    freq: 963,
    freqLabel: "963 Hz (Στέμμα / Αιθερικός Νους)",
    oppositeId: "hades",
    oppositeName: "ΑΔΗΣ",
    polarityTheme: "Ουράνιο Φως (Ζευς) ⟷ Χθόνιο Άδηλο Βάθος (Άδης)",
    theologicalRole:
      "Ο Ζευς αντιπροσωπεύει τη συνεκτική δύναμη και τον δημιουργικό Νου του Ενός. Ο αριθμός 612 αποτελεί αναγραμματισμό του Ψυχογονικού Κύβου 216 (6³ = 216), ενώ το «ΔΙΑΣ» = 215 ισούται με 216 - 1, δηλώνοντας την εκπόρευση της Μονάδας στη δημιουργία.",
    isopsephicMysteries: [
      "ΖΕΥΣ = 612 ➔ Αναγραμματισμός του 216 (Ψυχογονικός Κύβος 6³).",
      "ΔΙΑΣ = 215 ➔ 216 - 1 = 215 (Η Μονάς που γεννά τον Κόσμο).",
      "Πυθμένας 612: 6 + 1 + 2 = 9 (Η Εννεάς, αριθμός της ολότητας).",
      "ΖΕΥΣ (612) + ΑΔΗΣ (213) = 825 ➔ 8 + 2 + 5 = 15 ➔ 6 (Ηλιακή Εξάς).",
    ],
    orphicFragment:
      "«Ζεὺς πρῶτος γένετο, Ζεὺς ὕστατος ἀρχικέραυνος· Ζεὺς κεφαλή, Ζεὺς μέσσα, Διὸς δ᾽ ἐκ πάντα τέτυκται.»",
    citation: "Ορφικός Ύμνος εις Δία (Kern Fr. 21a)",
  },
  {
    id: "hades",
    name: "ΑΔΗΣ",
    altNames: ["ΑΙΔΗΣ", "ΠΛΟΥΤΩΝ", "ΑΪΔΩΝΕΥΣ"],
    canonicalFormula: "Α(1) + Δ(4) + Η(8) + Σ(200) = 213",
    value: 213,
    altValues: [
      { name: "ΑΙΔΗΣ", value: 223 },
      { name: "ΠΛΟΥΤΩΝ", value: 1730 },
      { name: "ΠΛΟΥΤΟΣ", value: 1080 },
    ],
    greekNumeral: "σιγ´",
    root: 6,
    element: "Χθὼν & Ἄδηλον Πῦρ",
    domain: "Αόρατος Κόσμος, Σπερματικός Πλούτος & Μυστική Ρίζα",
    archetype: "Ο Αφανής Βασιλεύς, η Σιωπηλή Αρχή της Αναγέννησης",
    symbol: "🗝️ Κλείδα του Αδήλου & Κυνή (Κράνος Αορατότητας)",
    color: "#c084fc",
    bgGradient: "from-[#2f1a45] via-[#1a0e29] to-[#0c0514]",
    borderColor: "#a855f7",
    freq: 396,
    freqLabel: "396 Hz (Απελευθέρωση & Μυστική Ρίζα)",
    oppositeId: "zeus",
    oppositeName: "ΖΕΥΣ",
    polarityTheme: "Αφανής Πηγή (Άδης) ⟷ Εκδηλωμένη Τάξη (Ζευς)",
    theologicalRole:
      "Ο Άδης (Ἀ-ιδής = ο μη ορατός) είναι η αθέατη όψη του ίδιου του Διός («Ζεὺς Καταχθόνιος»). Είναι η σπερματική μήτρα όπου αποθησαυρίζονται οι ψυχές και οι σπόροι της μελλοντικής δημιουργίας, καθιστώντας τον ταυτόσημο με τον Πλούτωνα (τον χορηγό του αληθινού πλούτου).",
    isopsephicMysteries: [
      "ΑΔΗΣ = 213 ➔ Πυθμένας 2 + 1 + 3 = 6 (Η Εξάς της Ύλης & του Ήλιου).",
      "ΑΙΔΗΣ = 223 ➔ Πρώτος αριθμός, το αδιάσπαστο και άτρωτο του Αδήλου.",
      "Διαφορά ΖΕΥΣ (612) - ΑΔΗΣ (213) = 399 ➔ 3 + 9 + 9 = 21 ➔ 3 (Η Τριάς).",
      "ΑΔΗΣ (213) + ΠΟΣΕΙΔΩΝ (1219) = 1432 ➔ 1 + 4 + 3 + 2 = 10 ➔ 1 (Το Εν!).",
    ],
    orphicFragment:
      "«Πλουτεῦ, παγγενέτωρ, ὃς ὑπὸ χθονὸς οἰκία ναίεις, ἀφανές, ὄλβου δοτὴρ καὶ ψυχῶν σωτήρ.»",
    citation: "Ορφικός Ύμνος εις Πλούτωνα (XVIII)",
  },
  {
    id: "poseidon",
    name: "ΠΟΣΕΙΔΩΝ",
    altNames: ["ΠΟΣΕΙΔΑΩΝ", "ΕΝΝΟΣΙΓΑΙΟΣ", "ΓΑΙΗΟΧΟΣ"],
    canonicalFormula: "Π(80) + Ο(70) + Σ(200) + Ε(5) + Ι(10) + Δ(4) + Ω(800) + Ν(50) = 1219",
    value: 1219,
    altValues: [
      { name: "ΠΟΣΕΙΔΑΩΝ", value: 1220 },
      { name: "ΓΑΙΗΟΧΟΣ", value: 962 },
      { name: "ΕΝΝΟΣΙΓΑΙΟΣ", value: 659 },
    ],
    greekNumeral: "͵ασιθ´",
    root: 4,
    element: "Ὕδωρ & Κοσμικὸς Κραδασμός",
    domain: "Ρευστότητα της Ύλης, Ωκεάνια Ρεύματα & Σεισμική Δόνηση",
    archetype: "Ο Δονητής των Βαθών, η Κυματική Φύση της Συνείδησης",
    symbol: "🔱 Τρίαινα & Ίππος των Κυμάτων",
    color: "#38bdf8",
    bgGradient: "from-[#0c2e42] via-[#071b29] to-[#030d14]",
    borderColor: "#0284c7",
    freq: 528,
    freqLabel: "528 Hz (Μεταμόρφωση & Κυματικός Συντονισμός)",
    oppositeId: "heracles",
    oppositeName: "ΗΡΑΚΛΗΣ",
    polarityTheme: "Κοσμική Ρευστότητα (Ποσειδών) ⟷ Σταθερή Γήινη Δράση (Ηρακλής)",
    theologicalRole:
      "Ο Ποσειδών εκφράζει την υγρή, δονητική και ρευστή υπόσταση της κοσμικής ουσίας. Ως «Εννοσίγαιος» (αυτός που σείει τη γη), είναι η ίδια η κυματική ενέργεια και η δύναμη της μεταβολής που διατηρεί τη ζωή σε συνεχή ροή.",
    isopsephicMysteries: [
      "ΠΟΣΕΙΔΩΝ = 1219 ➔ Πυθμένας: 1 + 2 + 1 + 9 = 13 ➔ 4 (Η Ιερά Τετρακτύς).",
      "ΠΟΣΕΙΔΑΩΝ = 1220 ➔ 1 + 2 + 2 + 0 = 5 (Η Πεντάς της Ζωής).",
      "ΠΟΣΕΙΔΩΝ (1219) + ΗΡΑΚΛΗΣ (367) = 1586 ➔ 1 + 5 + 8 + 6 = 20 ➔ 2 (Η Δυάς).",
      "1219 = 1000 + 219 ➔ Σύνδεση με το 1119 (ΙΩΑΝΝΗΣ) + 100 (Ρ).",
    ],
    orphicFragment:
      "«Κλῦθι, Ποσειδάον γαιήοχε, κυανοχαῖτα, ἵππιε, χαλκοτόρευτον ἔχων χείρεσσι τρίαιναν, ὃς ναίεις πελάγη βυθίων ἁλὸς ἠχήεντα.»",
    citation: "Ορφικός Ύμνος εις Ποσειδώνα (XVII)",
  },
  {
    id: "apollo",
    name: "ΑΠΟΛΛΩΝ",
    altNames: ["ΑΠΟΛΛΩΝΟΣ", "ΦΟΙΒΟΣ", "ΗΛΙΟΣ", "Ο ΗΛΙΟΣ"],
    canonicalFormula: "Α(1) + Π(80) + Ο(70) + Λ(30) + Λ(30) + Ω(800) + Ν(50) = 1061",
    value: 1061,
    altValues: [
      { name: "ΑΠΟΛΛΩΝΟΣ", value: 1331 },
      { name: "Ο ΗΛΙΟΣ", value: 666 },
      { name: "ΦΟΙΒΟΣ", value: 852 },
      { name: "ΗΛΙΟΣ", value: 318 },
    ],
    greekNumeral: "͵αξα´",
    root: 8,
    element: "Φῶς & Ἡλιακὸν Πῦρ",
    domain: "Αρμονία των Σφαιρών, Μουσική Τάξη, Προφητεία & Αλήθεια",
    archetype: "Ο Φωτοδότης της Αληθείας, η Γεωμετρική και Μουσική Συμφωνία",
    symbol: "☀️ Ήλιος, Λύρα 7 Χορδών & Δάφνη",
    color: "#f59e0b",
    bgGradient: "from-[#452b0c] via-[#2b1b07] to-[#120c04]",
    borderColor: "#ffd700",
    freq: 111,
    freqLabel: "111 Hz / 432 Hz (Ηλιακός & Μουσικός Συντονισμός)",
    oppositeId: "dionysus",
    oppositeName: "ΔΙΟΝΥΣΟΣ",
    polarityTheme: "Απολλώνιο Φως & Μέτρο ⟷ Διονυσιακή Έκσταση & Ζωή",
    theologicalRole:
      "Ο Απόλλων είναι η ηλιακή διάνοια και η αρχή της αρμονίας («Ἀ-πολλῶν» = ο μη έχων πολλούς, ο Ένας). Στη γενική πτώση, «ΑΠΟΛΛΩΝΟΣ» = 1331 = 11³, ο τέλειος κύβος του φωτός που στο κέντρο του (6, 6, 6) φέρει το 666 («Ο ΗΛΙΟΣ»).",
    isopsephicMysteries: [
      "ΑΠΟΛΛΩΝ = 1061 ➔ Πυθμένας 1 + 0 + 6 + 1 = 8 (Ογδοάς - Η Αναγέννηση).",
      "ΑΠΟΛΛΩΝΟΣ = 1331 = 11³ (Κύβος 11×11×11 με κεντρικό voxel το 666ο).",
      "Ο ΗΛΙΟΣ = 666 (Σύνολο των 36 κελλιών του Ηλιακού Τετραγώνου).",
      "ΑΠΟΛΛΩΝ (1061) + ΔΙΟΝΥΣΟΣ (1004) = 2065 ➔ 2 + 0 + 6 + 5 = 13 ➔ 4 (Τετρακτύς).",
    ],
    orphicFragment:
      "«Εἷς Ζεύς, εἷς Ἀΐδης, εἷς Ἥλιος, εἷς Διόνυσος, εἷς θεὸς ἐν πάντεσσι.»",
    citation: "Ορφικό Απόσπασμα (Kern Fr. 239) & Πλούταρχος (Περὶ τοῦ Εἰ ἐν Δελφοῖς)",
  },
  {
    id: "dionysus",
    name: "ΔΙΟΝΥΣΟΣ",
    altNames: ["ΒΑΚΧΟΣ", "ΙΑΚΧΟΣ", "ΖΑΓΡΕΥΣ", "ΛΥΑΙΟΣ"],
    canonicalFormula: "Δ(4) + Ι(10) + Ο(70) + Ν(50) + Υ(400) + Σ(200) + Ο(70) + Σ(200) = 1004",
    value: 1004,
    altValues: [
      { name: "ΒΑΚΧΟΣ", value: 893 },
      { name: "ΙΑΚΧΟΣ", value: 901 },
      { name: "ΖΑΓΡΕΥΣ", value: 622 },
      { name: "ΛΥΑΙΟΣ", value: 711 },
    ],
    greekNumeral: "͵αδ´",
    root: 5,
    element: "Ζωικὸς Χυμὸς & Ἐνθουσιασμός",
    domain: "Έκσταση, Αναγέννηση της Ψυχής, Διαμελισμός & Επανένωση",
    archetype: "Ο Ζωοδότης της Έκστασης, ο Θεϊκός Σπινθήρας μέσα στην Ύλη",
    symbol: "🍇 Θύρσος, Άμπελος & Κάνθαρος",
    color: "#f43f5e",
    bgGradient: "from-[#45101a] via-[#29080e] to-[#120306]",
    borderColor: "#fb7185",
    freq: 639,
    freqLabel: "639 Hz (Ένωση, Σύνδεση & Ιερή Έκσταση)",
    oppositeId: "apollo",
    oppositeName: "ΑΠΟΛΛΩΝ",
    polarityTheme: "Διονυσιακή Έκσταση (Μέθη/Ζωή) ⟷ Απολλώνια Τάξη (Φως/Μέτρο)",
    theologicalRole:
      "Ο Διόνυσος αντιπροσωπεύει την ενσάρκωση του θείου στην ύλη, τον διαμελισμό του Ενός στα Πολλά και τη μυστική επανένωσή τους μέσω του ιερού ενθουσιασμού (ἔν-θεος). Στους Δελφούς, ο Διόνυσος συγκατοικεί με τον Απόλλωνα, αποτελώντας τις δύο όψεις της ίδιας θείας ουσίας.",
    isopsephicMysteries: [
      "ΔΙΟΝΥΣΟΣ = 1004 ➔ Πυθμένας 1 + 0 + 0 + 4 = 5 (Η Πεντάς, ο αριθμός της Ζωής).",
      "ΙΑΚΧΟΣ = 901 ➔ 9 + 0 + 1 = 10 ➔ 1 (Η επιστροφή στη Μονάδα).",
      "ΔΙΑΣ (215) + ΔΙΟΝΥΣΟΣ (1004) = 1219 = ΠΟΣΕΙΔΩΝ (1219)! (Απόλυτη ισοψηφική ταυτότητα!).",
      "ΖΑΓΡΕΥΣ = 622 ➔ 6 + 2 + 2 = 10 ➔ 1 (Το Εν μέσα στο θυσιαστικό πάθος).",
    ],
    orphicFragment:
      "«Κικλήσκω Διόνυσον ἀγλαόν, ἠδὲ Βάκχον, πρωτόγονον, διφυῆ, τρίγονον, Βακχεῖον ἄνακτα, ἄρρητον, κρύφιον, δικέρωτα, δίμορφον.»",
    citation: "Ορφικός Ύμνος εις Διόνυσον (XXX)",
  },
  {
    id: "heracles",
    name: "ΗΡΑΚΛΗΣ",
    altNames: ["ΑΛΚΕΙΔΗΣ", "ΣΩΤΗΡ", "ΚΑΛΛΙΝΙΚΟΣ"],
    canonicalFormula: "Η(8) + Ρ(100) + Α(1) + Κ(20) + Λ(30) + Η(8) + Σ(200) = 367",
    value: 367,
    altValues: [
      { name: "ΑΛΚΕΙΔΗΣ", value: 89 },
      { name: "ΣΩΤΗΡ", value: 1308 },
      { name: "ΚΑΛΛΙΝΙΚΟΣ", value: 431 },
    ],
    greekNumeral: "τοζ´",
    root: 7,
    element: "Γῆ, Μόχθος & Θεία Ἀποθέωσις",
    domain: "12 Άθλοι, Κάθαρση, Υπερνίκηση των Παθών & Θέωση",
    archetype: "Ο Μύστης Ήρωας που κατακτά την Αθανασία μέσω της Δράσης",
    symbol: "🦁 Λεοντή, Ρόπαλο & 12 Άθλοι",
    color: "#10b981",
    bgGradient: "from-[#0d3b2a] via-[#07241a] to-[#03120c]",
    borderColor: "#34d399",
    freq: 741,
    freqLabel: "741 Hz (Κάθαρση, Διαύγεια & Πνευματική Νίκη)",
    oppositeId: "poseidon",
    oppositeName: "ΠΟΣΕΙΔΩΝ",
    polarityTheme: "Ανθρώπινος Μόχθος & Θέωση (Ηρακλής) ⟷ Ακατέργαστη Ύλη (Ποσειδών)",
    theologicalRole:
      "Ο Ηρακλής (Κλέος της Ήρας) δεν είναι απλώς μυθολογικός ήρωας, αλλά το κοσμικό αρχέτυπο της ψυχής που, μέσα από τους 12 Άθλους (τις 12 δοκιμασίες του Ζωδιακού κύκλου), εξαγνίζει τη γήινη φύση της και ανέρχεται στον Όλυμπο, ενωμένη αιώνια με το Θείο.",
    isopsephicMysteries: [
      "ΗΡΑΚΛΗΣ = 367 ➔ Πρώτος αριθμός (Prime), το αδιαίρετο και ακατάβλητο της θέωσης.",
      "Πυθμένας 367: 3 + 6 + 7 = 16 ➔ 1 + 6 = 7 (Η Ιερά Επτάς της Μύησης).",
      "367 × 2 = 734 = «Ο ΘΕΟΣ» (70 + 9 + 5 + 70 + 200 = 354 + 380 = 734).",
      "12 Άθλοι = 12 Ζώδια × 2160 έτη = 25.920 έτη (Πλατωνικός Ενιαυτός).",
    ],
    orphicFragment:
      "«Ἡρακλὲς ὀμβριμόθυμε, μεγασθενές, ἄλκιμε Τιτάν, καρτερόχειρ, ἀδάμαστε, βρύων ἄθλοισι κραταιοῖς, παμφάγε, παγγενέτωρ, πανυπέρτατε, πᾶσιν ἀρωγέ.»",
    citation: "Ορφικός Ύμνος εις Ηρακλέα (XII)",
  },
];

export const EnotheismTab: React.FC<EnotheismTabProps> = ({
  onOpenAiModal,
  onSaveItem,
}) => {
  const [selectedAspectId, setSelectedAspectId] = useState<
    "zeus" | "hades" | "poseidon" | "apollo" | "dionysus" | "heracles"
  >("zeus");
  const [activeSubTab, setActiveSubTab] = useState<
    "mandala" | "cards" | "comparisons" | "tester" | "texts"
  >("mandala");

  // Audio Synthesizer State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentToneFreq, setCurrentToneFreq] = useState<number>(432);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Live Tester State
  const [testerInput, setTesterInput] = useState<string>("");
  const [testerResult, setTesterResult] = useState<{
    text: string;
    value: number;
    root: number;
    closestAspect: DivineAspect;
    harmonicRelation: string;
  } | null>(null);

  const selectedAspect =
    DIVINE_ASPECTS.find((a) => a.id === selectedAspectId) || DIVINE_ASPECTS[0];

  // Audio tone engine
  const playTone = (freq: number) => {
    stopTone();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      audioCtxRef.current = ctx;
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingAudio(true);
      setCurrentToneFreq(freq);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  const stopTone = () => {
    if (oscRef.current && gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.1
        );
        setTimeout(() => {
          try {
            oscRef.current?.stop();
            audioCtxRef.current?.close();
          } catch {}
          audioCtxRef.current = null;
          oscRef.current = null;
          gainRef.current = null;
        }, 120);
      } catch {}
    }
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  // Live Tester calculation
  useEffect(() => {
    if (!testerInput.trim()) {
      setTesterResult(null);
      return;
    }
    const iso = calculateWordIsopsephy(testerInput.trim());
    const val = iso.value;
    const root = iso.root;

    // Find closest deity
    let closest = DIVINE_ASPECTS[0];
    let minDiff = Infinity;

    DIVINE_ASPECTS.forEach((aspect) => {
      const diff = Math.abs(val - aspect.value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = aspect;
      }
    });

    let relation = "";
    if (val === closest.value) {
      relation = `🌟 ΤΕΛΕΙΑ ΙΣΟΨΗΦΙΑ: Ισούται απόλυτα με το όνομα ${closest.name} (${val})!`;
    } else if (root === closest.root) {
      relation = `⚡ ΣΥΝΤΟΝΙΣΜΟΣ ΠΥΘΜΕΝΑ: Έχει τον ίδιο Πυθμένα (${root}) με τον ${closest.name}!`;
    } else if (val % closest.value === 0) {
      relation = `🔗 ΑΡΜΟΝΙΚΟ ΠΟΛΛΑΠΛΑΣΙΟ: ${val / closest.value} × ${closest.name} (${closest.value})!`;
    } else {
      relation = `Διαφορά από ${closest.name} (${closest.value}): Δ = ${Math.abs(val - closest.value)} | Πυθμένας: ${root}`;
    }

    setTesterResult({
      text: testerInput.trim(),
      value: val,
      root,
      closestAspect: closest,
      harmonicRelation: relation,
    });
  }, [testerInput]);

  // Master Total of the 6 Gods
  const totalSum = DIVINE_ASPECTS.reduce((acc, a) => acc + a.value, 0);
  const totalPythmen = (() => {
    const s = String(totalSum)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
    const s2 = String(s)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
    return s2 > 9 ? (s2 % 9 === 0 ? 9 : s2 % 9) : s2;
  })();

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto pb-12">
      {/* Stone / Sacred Tablet Outer Frame */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1a130c] via-[#120d08] to-[#0a0704] border-2 border-[#8c672b] p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_6px_rgba(255,220,120,0.2)] overflow-hidden">
        
        {/* Subtle Ambient Gold Grid Glow */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Header Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#120c06]/90 p-4 sm:p-5 rounded-2xl border border-[#422e17] relative z-10 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4a3518] via-[#2a1d0d] to-[#120c06] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] shadow-[0_0_15px_rgba(200,155,60,0.3)] shrink-0">
              <Shield className="w-7 h-7 text-[#ffd700]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                  Ορφικη & Πυθαγορεια Θεολογια
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1f150b] border border-[#52391b] text-[10px] font-mono text-[#ffd700]">
                  Εἷς Θεὸς ἐν Πάντεσσι
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#f5ecd8]">
                Ενοθεϊστική Θεώρηση: Οι 6 Εκφράσεις του Ενός
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Resonant Audio Synthesizer */}
            <button
              type="button"
              onClick={() =>
                isPlayingAudio ? stopTone() : playTone(selectedAspect.freq)
              }
              className={`px-3 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                isPlayingAudio
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black border border-yellow-200 animate-pulse ring-2 ring-amber-400/50"
                  : "bg-[#1e140b] hover:bg-[#2e1f11] text-[#e6c670] border border-[#52391b]"
              }`}
              title="Ακουστικός συντονισμός στις ιερές συχνότητες"
            >
              {isPlayingAudio ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#ffd700]" />
              )}
              <span>
                {isPlayingAudio
                  ? `Ήχος ${currentToneFreq}Hz`
                  : `🔊 Συχνότητα ${selectedAspect.freq}Hz`}
              </span>
            </button>

            {onOpenAiModal && (
              <button
                type="button"
                onClick={() =>
                  onOpenAiModal(
                    "ΕΝΟΘΕΪΣΤΙΚΗ ΘΕΩΡΗΣΗ: ΕΙΣ ΘΕΟΣ ΕΝ ΠΑΝΤΕΣΣΙ",
                    totalSum,
                    [
                      "ΖΕΥΣ",
                      "ΑΔΗΣ",
                      "ΠΟΣΕΙΔΩΝ",
                      "ΑΠΟΛΛΩΝ",
                      "ΔΙΟΝΥΣΟΣ",
                      "ΗΡΑΚΛΗΣ",
                      "ΟΡΦΙΣΜΟΣ",
                      "ΤΟ ΕΝ",
                    ]
                  )
                }
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#3b2914] to-[#52391b] border border-[#ffd700] hover:brightness-110 text-[#ffd700] text-xs font-serif font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Ερμηνεία Ενοθεϊσμού</span>
              </button>
            )}
          </div>
        </div>

        {/* Orphic Maxim Hero Quote */}
        <div className="my-4 p-4 rounded-2xl bg-[#0d0905] border border-[#3b2917] relative overflow-hidden text-center space-y-1.5">
          <p className="font-serif italic text-base sm:text-lg text-[#ffd700] tracking-wide leading-relaxed">
            «Εἷς Ζεύς, εἷς Ἀΐδης, εἷς Ἥλιος, εἷς Διόνυσος, εἷς θεὸς ἐν πάντεσσι.»
          </p>
          <p className="text-[11px] font-serif text-[#a69680]">
            — Ορφικό Απόσπασμα (Kern, Fr. 239) • Συμπληρωμένο με τον <strong>Ποσειδώνα</strong> (Ρευστή Ύλη) & τον <strong>Ηρακλή</strong> (Ανθρώπινη Θέωση)
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 pb-3 border-b border-[#3b2917] relative z-10">
          {[
            { id: "mandala", label: "☸️ Κοσμόγραμμα & Εξάγωνο Ενότητας", icon: Compass },
            { id: "cards", label: "🏛️ Αναλυτικές Κάρτες των 6 Θεών", icon: Crown },
            { id: "comparisons", label: "⚖️ Μαθηματικός Πίνακας & Πολικότητες", icon: GitCompare },
            { id: "tester", label: "🔍 Ζωντανός Έλεγχος Λέξεων", icon: Search },
            { id: "texts", label: "📜 Αρχαία Κείμενα & Ορφικοί Ύμνοι", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  isActive
                    ? "bg-gradient-to-r from-[#c89b3c] via-[#e6c670] to-[#ffd700] text-[#120d07] border border-[#fff2a8] shadow-[#ffd700]/25 scale-[1.02]"
                    : "bg-[#140e08] hover:bg-[#24180d] text-[#c5b59e] border border-[#3b2917] hover:border-[#c89b3c]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#120d07]" : "text-[#ffd700]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* SUBTAB 1: UNIFIED HEXAGONAL COSMOGRAM & MANDALA */}
        {/* ========================================================================= */}
        {activeSubTab === "mandala" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            
            {/* Hexagonal Selector Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {DIVINE_ASPECTS.map((aspect) => {
                const isSelected = selectedAspectId === aspect.id;
                return (
                  <button
                    key={aspect.id}
                    type="button"
                    onClick={() => {
                      setSelectedAspectId(aspect.id);
                      if (isPlayingAudio) playTone(aspect.freq);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 shadow-md ${
                      isSelected
                        ? "bg-gradient-to-b from-[#3d2a15] to-[#201509] border-[#ffd700] ring-2 ring-[#ffd700]/50 scale-[1.03] z-10"
                        : "bg-[#120c07] border-[#362413] hover:border-[#c89b3c] hover:bg-[#1a110a]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{aspect.symbol.split(" ")[0]}</span>
                      <span
                        className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-[#0a0704] border border-[#362413]"
                        style={{ color: aspect.color }}
                      >
                        {aspect.value}
                      </span>
                    </div>
                    <div>
                      <h4
                        className="text-sm font-serif font-bold tracking-wide"
                        style={{ color: isSelected ? "#ffd700" : "#f5ecd8" }}
                      >
                        {aspect.name}
                      </h4>
                      <p className="text-[10px] font-serif text-[#a69680] truncate">
                        {aspect.element.split("&")[0]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Central Unified Interactive Stage */}
            <div className="p-5 sm:p-7 rounded-3xl bg-[#0f0a06] border-2 border-[#52391b] shadow-2xl relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left: Cosmic Hexagram Mandala Diagram */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#0a0704] rounded-2xl border border-[#3b2917] relative">
                  <div className="w-64 h-64 sm:w-72 sm:h-72 relative flex items-center justify-center">
                    
                    {/* Concentric Golden Circles */}
                    <div className="absolute inset-0 rounded-full border border-[#4a341a]/60 animate-spin-slow" />
                    <div className="absolute inset-4 rounded-full border border-dashed border-[#ffd700]/30" />
                    <div className="absolute inset-10 rounded-full border border-[#4a341a]/80" />

                    {/* Central Core: "ΤΟ ΕΝ" */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4a341a] via-[#634623] to-[#2e1f0e] border-2 border-[#ffd700] flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(255,215,0,0.4)] z-20">
                      <span className="text-[9px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                        ΠΗΓΗ
                      </span>
                      <span className="text-xs font-serif font-black text-[#fff2a8]">
                        ΤΟ ΕΝ
                      </span>
                      <span className="text-[9px] font-mono text-[#e6c670]">
                        Σ = {totalSum}
                      </span>
                    </div>

                    {/* 6 Peripheral Divine Nodes */}
                    {DIVINE_ASPECTS.map((aspect, idx) => {
                      const angle = (idx * 60 - 90) * (Math.PI / 180);
                      const radius = 105; // radius in px
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      const isSelected = selectedAspectId === aspect.id;

                      return (
                        <button
                          key={aspect.id}
                          type="button"
                          onClick={() => {
                            setSelectedAspectId(aspect.id);
                            if (isPlayingAudio) playTone(aspect.freq);
                          }}
                          style={{
                            transform: `translate(${x}px, ${y}px)`,
                          }}
                          className={`absolute w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer z-20 ${
                            isSelected
                              ? "scale-125 border-[#ffd700] bg-gradient-to-br from-[#52391b] to-[#24180d] shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                              : "border-[#422e17] bg-[#140e08] hover:border-[#c89b3c] hover:scale-110"
                          }`}
                          title={`${aspect.name} (${aspect.value})`}
                        >
                          <span className="text-xs">{aspect.symbol.split(" ")[0]}</span>
                          <span
                            className="text-[9px] font-serif font-bold"
                            style={{ color: aspect.color }}
                          >
                            {aspect.name.slice(0, 4)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[11px] font-serif text-[#a69680] mt-2 text-center">
                    Κάντε κλικ σε οποιονδήποτε κόμβο για να δείτε τα μυστήριά του
                  </span>
                </div>

                {/* Right: Detailed Deep-Dive for the Selected Deity */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Deity Title & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3b2917] pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border"
                        style={{
                          backgroundColor: "#1c130b",
                          borderColor: selectedAspect.borderColor,
                        }}
                      >
                        {selectedAspect.symbol.split(" ")[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-serif font-bold text-[#f5ecd8]">
                            {selectedAspect.name}
                          </h3>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1f150b] border border-[#52391b] text-[#ffd700] font-bold">
                            {selectedAspect.greekNumeral}
                          </span>
                        </div>
                        <span className="text-xs font-serif text-[#c89b3c]">
                          {selectedAspect.domain}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-[#24170c] border border-[#ffd700]/50 text-[#ffd700]">
                        Αξία: {selectedAspect.value}
                      </span>
                      <span className="text-xs font-serif px-2 py-1 rounded-lg bg-[#140e08] border border-[#3b2917] text-[#a69680]">
                        Πυθμένας: <strong className="text-[#ffd700]">{selectedAspect.root}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Theological Synthesis */}
                  <div className="p-3.5 rounded-xl bg-[#140e08] border border-[#3b2917] space-y-1">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                      Θεολογικος & Μυστικος Ρολος
                    </span>
                    <p className="text-xs sm:text-sm font-serif text-[#ebd8c5] leading-relaxed">
                      {selectedAspect.theologicalRole}
                    </p>
                  </div>

                  {/* 4 Quick Stat Metric Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-serif">
                    <div className="p-2.5 rounded-xl bg-[#120d08] border border-[#3b2917] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Στοιχείο:</span>
                      <div className="text-xs font-bold text-[#f5ecd8] truncate">
                        {selectedAspect.element.split("&")[0]}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#120d08] border border-[#3b2917] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Συχνότητα:</span>
                      <div className="text-xs font-bold text-[#38bdf8]">
                        {selectedAspect.freq} Hz
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#120d08] border border-[#3b2917] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Αντίθετος Πόλος:</span>
                      <div className="text-xs font-bold text-[#ec4899]">
                        {selectedAspect.oppositeName}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#120d08] border border-[#3b2917] space-y-0.5">
                      <span className="text-[10px] text-[#8c7a68]">Τύπος:</span>
                      <div className="text-xs font-mono font-bold text-[#ffd700]">
                        {selectedAspect.canonicalFormula.split("=")[0]}
                      </div>
                    </div>
                  </div>

                  {/* Isopsephic Bullet Mysteries */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                      Αριθμητικες & Ισοψηφικες Συσχετισεις
                    </span>
                    <div className="space-y-1">
                      {selectedAspect.isopsephicMysteries.map((myst, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-[#0d0905] border border-[#2d1e10] text-xs font-serif text-[#ebd8c5] flex items-start gap-2"
                        >
                          <span className="text-[#ffd700] mt-0.5 font-bold">◈</span>
                          <span>{myst}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons for Save / AI */}
                  <div className="flex items-center gap-2 pt-2">
                    {onSaveItem && (
                      <button
                        type="button"
                        onClick={() =>
                          onSaveItem({
                            text: selectedAspect.name,
                            normalized: normalizePolytonicGreek(selectedAspect.name),
                            value: selectedAspect.value,
                            root: selectedAspect.root,
                            greekNumeral: selectedAspect.greekNumeral,
                            isPhrase: false,
                            wordCount: 1,
                            category: "Ενοθεϊσμός",
                            notes: selectedAspect.theologicalRole,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#1f150b] hover:bg-[#2e1f11] border border-[#4a341a] text-[#ffd700] text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Αποθήκευση στον Θησαυρό</span>
                      </button>
                    )}

                    {onOpenAiModal && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenAiModal(
                            selectedAspect.name,
                            selectedAspect.value,
                            [
                              selectedAspect.name,
                              selectedAspect.domain,
                              "ΕΝΟΘΕΪΣΜΟΣ",
                              "ΟΡΦΙΣΜΟΣ",
                              String(selectedAspect.value),
                            ]
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#2a1d10] hover:bg-[#3d2a17] border border-[#ffd700]/50 text-[#ffd700] text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Ανάλυση Θεού</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 2: DETAILED CARDS FOR ALL 6 DEITIES */}
        {/* ========================================================================= */}
        {activeSubTab === "cards" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DIVINE_ASPECTS.map((aspect) => (
                <div
                  key={aspect.id}
                  className="p-5 rounded-3xl bg-[#120d08] border-2 border-[#3b2917] hover:border-[#ffd700]/70 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
                >
                  {/* Top Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#2d1e10] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{aspect.symbol.split(" ")[0]}</span>
                        <div>
                          <h3 className="text-lg font-serif font-bold text-[#f5ecd8]">
                            {aspect.name}
                          </h3>
                          <span className="text-[10px] font-serif text-[#a69680]">
                            {aspect.element}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-base font-mono font-black"
                          style={{ color: aspect.color }}
                        >
                          {aspect.value}
                        </span>
                        <div className="text-[10px] font-mono text-[#a69680]">
                          ({aspect.greekNumeral})
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0a0704] border border-[#24170c] space-y-1 text-xs font-serif">
                      <div className="text-[#ffd700] font-bold">
                        {aspect.canonicalFormula}
                      </div>
                      <p className="text-[#a69680] text-[11px] leading-snug">
                        {aspect.domain}
                      </p>
                    </div>

                    <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed line-clamp-4">
                      {aspect.theologicalRole}
                    </p>

                    {/* Alternate Names with Isopsephy */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                        Παράλληλα Ονόματα:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {aspect.altValues.map((alt, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded bg-[#1c130b] border border-[#3b2917] text-[10px] font-serif text-[#ebd8c5]"
                          >
                            {alt.name} = <strong className="text-[#ffd700]">{alt.value}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 border-t border-[#2d1e10] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAspectId(aspect.id);
                        setActiveSubTab("mandala");
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#1f150b] hover:bg-[#2d1e10] border border-[#422e17] text-[#ffd700] text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Εστίαση</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {onOpenAiModal && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenAiModal(
                            aspect.name,
                            aspect.value,
                            [aspect.name, aspect.domain, "ΕΝΟΘΕΪΣΜΟΣ", String(aspect.value)]
                          )
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-[#2a1d10] hover:bg-[#3d2a17] border border-[#ffd700]/40 text-[#ffd700] text-xs font-serif flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 3: MATHEMATICAL COMPARATIVE MATRIX & POLARITIES */}
        {/* ========================================================================= */}
        {activeSubTab === "comparisons" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            
            {/* Grand Total Equation Summary */}
            <div className="p-5 rounded-2xl bg-[#120d08] border-2 border-[#52391b] shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#ffd700]" />
                <h3 className="text-base font-serif font-bold text-[#f5ecd8]">
                  Το Μεγάλο Άθροισμα των 6 Εκφράσεων του Ενός Θεού
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0704] border border-[#ffd700]/50 text-center space-y-1">
                <div className="text-xs sm:text-sm font-mono font-bold text-[#ffd700]">
                  ΖΕΥΣ (612) + ΑΔΗΣ (213) + ΠΟΣΕΙΔΩΝ (1219) + ΑΠΟΛΛΩΝ (1061) + ΔΙΟΝΥΣΟΣ (1004) + ΗΡΑΚΛΗΣ (367) = 4.476
                </div>
                <div className="text-xs font-serif text-[#38bdf8]">
                  Πυθμένας Συνόλου: 4 + 4 + 7 + 6 = 21 ➔ 2 + 1 = <strong>3 (Η Ιερά Τριάς!)</strong>
                </div>
              </div>

              <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                Το άθροισμα των έξι θεμελιωδών ονομάτων ($4.476$) αναλύεται πυθαγορικά στον <strong>αριθμό 3 (Τριάδα)</strong>,
                επιβεβαιώνοντας τη θεολογική αρχή ότι η πολλαπλότητα των θεϊκών εκφράσεων καταλήγει πάντοτε στην τριαδική αρμονία του Ενός Δημιουργού.
              </p>
            </div>

            {/* 3 Polar Couples Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Couple 1: Zeus & Hades */}
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3 shadow">
                <div className="flex items-center justify-between border-b border-[#2d1e10] pb-2">
                  <span className="text-xs font-serif font-bold text-[#ffd700]">
                    1. ΖΕΥΣ ⟷ ΑΔΗΣ
                  </span>
                  <span className="text-[10px] font-serif text-[#a69680]">Ουρανός & Χθών</span>
                </div>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Το εκδηλωμένο ουράνιο πυρ (Ζευς = 612) και η αόρατη χθόνια ρίζα (Άδης = 213).
                </p>
                <div className="p-2.5 rounded-xl bg-[#0c0804] border border-[#2d1e10] space-y-0.5 text-center text-xs font-mono">
                  <div className="text-[#ffd700]">612 + 213 = 825</div>
                  <div className="text-[#a69680]">8 + 2 + 5 = 15 ➔ <strong>6 (Εξάς)</strong></div>
                </div>
              </div>

              {/* Couple 2: Apollo & Dionysus */}
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3 shadow">
                <div className="flex items-center justify-between border-b border-[#2d1e10] pb-2">
                  <span className="text-xs font-serif font-bold text-[#ffd700]">
                    2. ΑΠΟΛΛΩΝ ⟷ ΔΙΟΝΥΣΟΣ
                  </span>
                  <span className="text-[10px] font-serif text-[#a69680]">Φως & Έκσταση</span>
                </div>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Η γεωμετρική τάξη του Ήλιου (1061) και η ζωική ροή της μέθης (1004). Οι δύο συγκάτοικοι των Δελφών.
                </p>
                <div className="p-2.5 rounded-xl bg-[#0c0804] border border-[#2d1e10] space-y-0.5 text-center text-xs font-mono">
                  <div className="text-[#ffd700]">1061 + 1004 = 2.065</div>
                  <div className="text-[#a69680]">2 + 0 + 6 + 5 = 13 ➔ <strong>4 (Τετρακτύς)</strong></div>
                </div>
              </div>

              {/* Couple 3: Poseidon & Heracles */}
              <div className="p-4 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3 shadow">
                <div className="flex items-center justify-between border-b border-[#2d1e10] pb-2">
                  <span className="text-xs font-serif font-bold text-[#ffd700]">
                    3. ΠΟΣΕΙΔΩΝ ⟷ ΗΡΑΚΛΗΣ
                  </span>
                  <span className="text-[10px] font-serif text-[#a69680]">Ρευστότητα & Μόχθος</span>
                </div>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Η κυματική ενέργεια των υδάτων (1219) και η ανθρώπινη υπερνίκηση των παθών προς θέωση (367).
                </p>
                <div className="p-2.5 rounded-xl bg-[#0c0804] border border-[#2d1e10] space-y-0.5 text-center text-xs font-mono">
                  <div className="text-[#ffd700]">1219 + 367 = 1.586</div>
                  <div className="text-[#a69680]">1 + 5 + 8 + 6 = 20 ➔ <strong>2 (Δυάς)</strong></div>
                </div>
              </div>

            </div>

            {/* Master Table Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-serif border border-[#3b2917] rounded-2xl overflow-hidden">
                <thead className="bg-[#1c130b] text-[#ffd700] uppercase text-[10px] tracking-wider border-b border-[#3b2917]">
                  <tr>
                    <th className="p-3">Όνομα Θεού</th>
                    <th className="p-3">Αριθμητική Αξία</th>
                    <th className="p-3">Ελληνικό Ψηφίο</th>
                    <th className="p-3">Πυθμένας</th>
                    <th className="p-3">Συχνότητα</th>
                    <th className="p-3">Στοιχείο & Ρόλος</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d1e10] bg-[#120d08]">
                  {DIVINE_ASPECTS.map((aspect) => (
                    <tr key={aspect.id} className="hover:bg-[#1f150b] transition-colors">
                      <td className="p-3 font-bold text-[#f5ecd8] flex items-center gap-2">
                        <span>{aspect.symbol.split(" ")[0]}</span>
                        <span>{aspect.name}</span>
                      </td>
                      <td className="p-3 font-mono font-bold" style={{ color: aspect.color }}>
                        {aspect.value}
                      </td>
                      <td className="p-3 font-mono text-[#ffd700]">{aspect.greekNumeral}</td>
                      <td className="p-3 font-bold text-[#38bdf8]">{aspect.root}</td>
                      <td className="p-3 font-mono text-[#a69680]">{aspect.freq} Hz</td>
                      <td className="p-3 text-[#ebd8c5]">{aspect.domain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 4: LIVE WORD & PHRASE TESTER */}
        {/* ========================================================================= */}
        {activeSubTab === "tester" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="p-5 rounded-3xl bg-[#120d08] border-2 border-[#52391b] shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3b2917] pb-3">
                <Search className="w-5 h-5 text-[#ffd700]" />
                <div>
                  <h3 className="text-base font-serif font-bold text-[#f5ecd8]">
                    Ζωντανός Έλεγχος Συντονισμού με τις 6 Θεϊκές Εκφράσεις
                  </h3>
                  <p className="text-xs font-serif text-[#a69680]">
                    Πληκτρολογήστε οποιαδήποτε ελληνική λέξη ή φράση για να ανακαλύψετε σε ποιο θεϊκό αρχέτυπο συντονίζεται ισοψηφικά.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={testerInput}
                  onChange={(e) => setTesterInput(e.target.value)}
                  placeholder="Π.χ. Ο ΗΛΙΟΣ, ΦΩΣ, ΑΛΗΘΕΙΑ, ΨΥΧΗ, ΑΡΜΟΝΙΑ, ΙΗΣΟΥΣ..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#0a0704] border border-[#3b2917] focus:border-[#ffd700] text-[#f5ecd8] text-sm font-serif outline-none shadow-inner"
                />

                {testerResult ? (
                  <div
                    key={`enotheism-tester-${testerResult.value}-${testerResult.text}`}
                    className="p-4 rounded-2xl bg-[#0e0905] border border-[#ffd700]/50 space-y-3 shadow-lg animate-lexarithm-result animate-card-shimmer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d1e10] pb-2.5">
                      <div>
                        <span className="text-xs font-serif text-[#8c7a68]">Ελεγχθείσα Λέξη:</span>
                        <h4 className="text-lg font-serif font-bold text-[#ffd700]">
                          {testerResult.text}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-[#8c7a68]">Ισοψηφία:</span>
                          <div
                            key={`val-${testerResult.value}`}
                            className="text-lg font-mono font-black text-[#ffd700] animate-number-glow"
                          >
                            {testerResult.value}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#8c7a68]">Πυθμένας:</span>
                          <div
                            key={`root-${testerResult.root}`}
                            className="text-lg font-mono font-black text-[#38bdf8] animate-badge-glow"
                          >
                            {testerResult.root}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#140e08] border border-[#3b2917] space-y-1">
                      <span className="text-[10px] font-serif uppercase tracking-widest text-[#ffd700] font-bold">
                        Αποτέλεσμα Συντονισμού:
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-[#f5ecd8] font-medium">
                        {testerResult.harmonicRelation}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {onSaveItem && (
                        <button
                          type="button"
                          onClick={() =>
                            onSaveItem({
                              text: testerResult.text,
                              normalized: normalizePolytonicGreek(testerResult.text),
                              value: testerResult.value,
                              root: testerResult.root,
                              greekNumeral: numberToGreekNumeral(testerResult.value),
                              isPhrase: testerResult.text.includes(" "),
                              wordCount: testerResult.text.trim().split(/\s+/).length,
                              category: "Ενοθεϊστικός Έλεγχος",
                              notes: testerResult.harmonicRelation,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-[#24170c] hover:bg-[#382313] border border-[#c89b3c]/40 text-[#ffd700] text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>Αποθήκευση στον Θησαυρό</span>
                        </button>
                      )}

                      {onOpenAiModal && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenAiModal(
                              testerResult.text,
                              testerResult.value,
                              [
                                testerResult.text,
                                testerResult.closestAspect.name,
                                "ΕΝΟΘΕΪΣΜΟΣ",
                                String(testerResult.value),
                              ]
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-[#24170c] hover:bg-[#382313] border border-[#c89b3c]/40 text-[#ffd700] text-xs font-serif flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Ερμηνεία</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#0a0704] border border-[#24170c] text-center text-xs font-serif text-[#8c7a68]">
                    Πληκτρολογήστε μια λέξη στο πεδίο παραπάνω για να υπολογιστεί ο ισοψηφικός συντονισμός της.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 5: ANCIENT TEXTS & ORPHIC HYMNS */}
        {/* ========================================================================= */}
        {activeSubTab === "texts" && (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Orphic Fragment 239 */}
              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3 shadow">
                <div className="flex items-center gap-2 text-[#ffd700] font-serif font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Ορφικό Απόσπασμα (Kern, Fr. 239)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0c0804] border border-[#ffd700]/30 font-serif italic text-xs sm:text-sm text-[#ffd700] leading-relaxed">
                  «Εἷς Ζεύς, εἷς Ἀΐδης, εἷς Ἥλιος, εἷς Διόνυσος, εἷς θεὸς ἐν πάντεσσι.»
                </div>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Το κορυφαίο θεολογικό απόσπασμα της ορφικής παράδοσης που δηλώνει ξεκάθαρα ότι οι φαινομενικά διαφορετικές θεότητες του πανθέου αποτελούν προσωπεία και δυνάμεις της μίας και μοναδικής Θείας Πηγής.
                </p>
              </div>

              {/* Plutarch on Delphic E */}
              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3 shadow">
                <div className="flex items-center gap-2 text-[#ffd700] font-serif font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Πλούταρχος: «Περὶ τοῦ Εἰ ἐν Δελφοῖς»</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0c0804] border border-[#ffd700]/30 font-serif italic text-xs sm:text-sm text-[#ffd700] leading-relaxed">
                  «Ἀπόλλων μὲν ὡς ἓν καὶ ἄμικτον, Διόνυσος δὲ ὡς μεταβολὴ καὶ διαίρεσις.»
                </div>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Ο Πλούταρχος εξηγεί ότι ο Απόλλων συμβολίζει την αδιαίρετη ενότητα της αλήθειας (το ΕΙ = ΕΙΣΑΙ), ενώ ο Διόνυσος την εκδίπλωση αυτής της ουσίας στον κόσμο των αισθήσεων και των μεταμορφώσεων.
                </p>
              </div>

              {/* Proclus on Theology of Plato */}
              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3 shadow">
                <div className="flex items-center gap-2 text-[#ffd700] font-serif font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Πρόκλος: «Εἰς τὴν Πλάτωνος Θεολογίαν»</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0c0804] border border-[#ffd700]/30 font-serif italic text-xs sm:text-sm text-[#ffd700] leading-relaxed">
                  «Πᾶς θεὸς ἑνάς ἐστιν αὐτοτελής, καὶ πᾶσα ἑνὰς θεός.»
                </div>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Στη νεοπλατωνική θεολογία, κάθε θεός είναι μια τέλεια «Ενάδα» (εκπόρευση του Ενός), μέσω της οποίας η ψυχή μπορεί να επιστρέψει στην πρωταρχική Πηγή.
                </p>
              </div>

              {/* The 12 Labors & Zodiac */}
              <div className="p-5 rounded-2xl bg-[#140e08] border border-[#3b2917] space-y-3 shadow">
                <div className="flex items-center gap-2 text-[#ffd700] font-serif font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Ηρακλής & Οι 12 Ζωδιακοί Άθλοι</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0c0804] border border-[#ffd700]/30 font-serif italic text-xs sm:text-sm text-[#ffd700] leading-relaxed">
                  «12 Ἆθλοι = 12 Ζῴδια × 2.160 Ἔτη = 25.920 Ἔτη (Πλατωνικὸς Ἐνιαυτός)»
                </div>
                <p className="text-xs font-serif text-[#ebd8c5] leading-relaxed">
                  Ο Ηρακλής ενσαρκώνει την ανθρώπινη ψυχή που περνά από τις 12 μυητικές δοκιμασίες της γήινης ύπαρξης και, νικώντας τα κατώτερα πάθη (Λέων της Νεμέας, Λερναία Ύδρα), κερδίζει την αθανασία.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
