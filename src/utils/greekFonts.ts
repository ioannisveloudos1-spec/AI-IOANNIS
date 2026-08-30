export interface AncientGreekFont {
  id: string;
  name: string;
  category: string;
  fontFamily: string;
  description: string;
  sampleText: string;
  era: string;
}

export const ANCIENT_GREEK_FONTS: AncientGreekFont[] = [
  {
    id: "gfs-didot",
    name: "GFS Didot",
    category: "Κλασική Ελληνική",
    fontFamily: "'GFS Didot', serif",
    description: "Η εμβληματική γραμματοσειρά του Νέου Ελληνισμού και των κλασικών εκδόσεων.",
    sampleText: "ΙΩΑΝΝΗΣ • ΛΑΥΡΕΙΟΝ • ΟΥΔΟΣ",
    era: "Κλασική / Διαφωτισμός",
  },
  {
    id: "cinzel",
    name: "Cinzel Epigraphic",
    category: "Μνημειακό Επιγραφικό",
    fontFamily: "'Cinzel', 'GFS Didot', serif",
    description: "Αρχαιοπρεπή λαπιδαρικά κεφαλαία με βάση τις κλασικές ελληνικές και ρωμαϊκές επιγραφές.",
    sampleText: "ΙΩΑΝΝΗΣ • ΛΑΥΡΕΙΟΝ • ΟΥΔΟΣ",
    era: "Αρχαϊκό / Επιγραφικό",
  },
  {
    id: "cardo",
    name: "Cardo Ancient",
    category: "Αρχαιοελληνικό & Ανθρωπιστικό",
    fontFamily: "'Cardo', serif",
    description: "Σχεδιασμένη ειδικά για φιλολόγους, κλασικά ελληνικά κείμενα και αρχαίες επιγραφές.",
    sampleText: "Ἰωάννης • Λαύρειον • Οὐδός",
    era: "Κλασικό & Φιλολογικό",
  },
  {
    id: "gfs-neohellenic",
    name: "GFS Neohellenic",
    category: "Αρχαία Επιγραφική",
    fontFamily: "'GFS Neohellenic', sans-serif",
    description: "Βασισμένη σε αρχαίες και βυζαντινές επιγραφές με καθαρές, γεωμετρικές γραμμές.",
    sampleText: "ΙΩΑΝΝΗΣ • ΛΑΥΡΕΙΟΝ • ΟΥΔΟΣ",
    era: "Επιγραφικό & Βυζαντινό",
  },
  {
    id: "cormorant",
    name: "Cormorant Garamond",
    category: "Αριστοτελικό & Εκλεπτυσμένο",
    fontFamily: "'Cormorant Garamond', serif",
    description: "Εκλεπτυσμένες κλασικές γραμμές με υψηλό κοντράστ και άριστη απόδοση ελληνικών χαρακτήρων.",
    sampleText: "Ἰωάννης • Λαύρειον • Οὐδός",
    era: "Κλασικό & Αναγεννησιακό",
  },
  {
    id: "eb-garamond",
    name: "EB Garamond",
    category: "Μνημειακή Αρχαιοελληνική",
    fontFamily: "'EB Garamond', serif",
    description: "Αυθεντική απόδοση ιστορικών ελληνικών τυπογραφικών στοιχείων με βαθιά αρχαία αύρα.",
    sampleText: "ΙΩΑΝΝΗΣ • ΛΑΥΡΕΙΟΝ • ΟΥΔΟΣ",
    era: "Μνημειακό",
  },
  {
    id: "gfs-artemisia",
    name: "GFS Artemisia",
    category: "Φιλοσοφική / Αρτεμισία",
    fontFamily: "'GFS Artemisia', serif",
    description: "Σχεδιασμένη από τον ζωγράφο Τάκη Κατσουλίδη, ιδανική για φιλοσοφικά και μαθηματικά κείμενα.",
    sampleText: "Ἰωάννης • Λαύρειον • Οὐδός",
    era: "Φιλοσοφικό",
  },
  {
    id: "gentium",
    name: "Gentium Plus",
    category: "Πολυτονική / Ακαδημαϊκή",
    fontFamily: "'Gentium Plus', serif",
    description: "Παγκόσμιο πρότυπο για πολυτονικά αρχαία ελληνικά, διακριτικά και ισοψηφικούς κώδικες.",
    sampleText: "Ἰωάννης • Λαύρειον • Οὐδός",
    era: "Ακαδημαϊκό & Πολυτονικό",
  },
];

export const GREEK_FONT_STORAGE_KEY = "ancient_greek_display_font_id_v1";

export function getInitialAncientFont(): string {
  if (typeof window === "undefined") return "gfs-didot";
  try {
    const saved = localStorage.getItem(GREEK_FONT_STORAGE_KEY);
    if (saved && ANCIENT_GREEK_FONTS.some((f) => f.id === saved)) {
      return saved;
    }
  } catch (e) {
    console.error(e);
  }
  return "gfs-didot";
}

export function saveAncientFont(fontId: string): void {
  try {
    localStorage.setItem(GREEK_FONT_STORAGE_KEY, fontId);
    const font = ANCIENT_GREEK_FONTS.find((f) => f.id === fontId);
    if (font) {
      document.documentElement.style.setProperty("--ancient-greek-font", font.fontFamily);
    }
  } catch (e) {
    console.error(e);
  }
}
