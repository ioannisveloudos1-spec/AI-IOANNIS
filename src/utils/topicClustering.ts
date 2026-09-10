/**
 * Topic Clustering, Semantic Categorization & Quality Filter Utility
 */

export interface TopicCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  keywords: string[];
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: "theology",
    name: "Θεολογία & Μυστικισμός",
    nameEn: "Theology & Mysticism",
    icon: "🌟",
    color: "#f59e0b",
    badgeBg: "bg-amber-950/40",
    badgeBorder: "border-amber-600/40",
    badgeText: "text-amber-300",
    keywords: [
      "GOD", "JESUS", "CHRIST", "LORD", "HOLY", "BIBLE", "SPIRIT", "ANGEL", "ARCHANGEL", "CHURCH",
      "PRAYER", "FAITH", "GRACE", "SOUL", "HEAVEN", "HELL", "DEVIL", "SATAN", "LUCIFER", "DEMON",
      "PROPHET", "MESSIAH", "SIN", "CROSS", "DIVINE", "TEMPLE", "ALTAR", "SAINT", "GOSPEL",
      "ΘΕΟΣ", "ΙΗΣΟΥΣ", "ΧΡΙΣΤΟΣ", "ΚΥΡΙΟΣ", "ΑΓΙΟΣ", "ΠΝΕΥΜΑ", "ΑΓΓΕΛΟΣ", "ΨΥΧΗ", "ΟΥΡΑΝΟΣ",
      "ΚΟΛΑΣΗ", "ΕΩΣΦΟΡΟΣ", "ΣΑΤΑΝΑΣ", "ΔΙΑΒΟΛΟΣ", "ΠΡΟΦΗΤΗΣ", "ΜΕΣΣΙΑΣ", "ΣΤΑΥΡΟΣ", "ΝΑΟΣ",
    ],
  },
  {
    id: "apocalypse",
    name: "Αποκάλυψη & Προφητεία",
    nameEn: "Apocalypse & Prophecy",
    icon: "🔥",
    color: "#ef4444",
    badgeBg: "bg-red-950/40",
    badgeBorder: "border-red-600/40",
    badgeText: "text-red-300",
    keywords: [
      "APOCALYPSE", "REVELATION", "BEAST", "DRAGON", "HORN", "MARK", "666", "TRIBULATION", "ARMAGEDDON",
      "FALSE PROPHET", "ANTICHRIST", "WRATH", "SEAL", "TRUMPET", "PLAGUE", "JUDGMENT", "BABYLON",
      "ΑΠΟΚΑΛΥΨΗ", "ΘΗΡΙΟ", "ΔΡΑΚΩΝ", "ΧΑΡΑΓΜΑ", "ΑΝΤΙΧΡΙΣΤΟΣ", "ΑΡΜΑΓΕΔΔΩΝ", "ΣΦΡΑΓΙΔΑ", "ΣΑΛΠΙΓΓΑ",
    ],
  },
  {
    id: "history_philosophy",
    name: "Ιστορία, Μύθος & Φιλοσοφία",
    nameEn: "History, Myth & Philosophy",
    icon: "🏛️",
    color: "#3b82f6",
    badgeBg: "bg-blue-950/40",
    badgeBorder: "border-blue-600/40",
    badgeText: "text-blue-300",
    keywords: [
      "ZEUS", "APOLLO", "ATHENA", "HERMES", "ARES", "PLATO", "SOCRATES", "ARISTOTLE", "PYTHAGORAS",
      "HOMER", "MYTH", "EMPIRE", "ROME", "GREECE", "EGYPT", "PHARAOH", "KING", "QUEEN", "PHILOSOPHY",
      "ΖΕΥΣ", "ΑΠΟΛΛΩΝ", "ΑΘΗΝΑ", "ΕΡΜΗΣ", "ΠΛΑΤΩΝ", "ΣΩΚΡΑΤΗΣ", "ΑΡΙΣΤΟΤΕΛΗΣ", "ΠΥΘΑΓΟΡΑΣ", "ΟΜΗΡΟΣ",
      "ΜΥΘΟΣ", "ΑΥΤΟΚΡΑΤΟΡΙΑ", "ΡΩΜΗ", "ΕΛΛΑΣ", "ΑΙΓΥΠΤΟΣ", "ΒΑΣΙΛΕΥΣ", "ΦΙΛΟΣΟΦΙΑ",
    ],
  },
  {
    id: "geometry_math",
    name: "Ιερά Γεωμετρία & Μαθηματικά",
    nameEn: "Sacred Geometry & Mathematics",
    icon: "📐",
    color: "#10b981",
    badgeBg: "bg-emerald-950/40",
    badgeBorder: "border-emerald-600/40",
    badgeText: "text-emerald-300",
    keywords: [
      "NUMBER", "RATIO", "GOLDEN", "CIRCLE", "TRIANGLE", "SQUARE", "PYRAMID", "CUBE", "OCTAGON",
      "TETRACTYS", "FIBONACCI", "PHI", "PI", "HARMONY", "SYMMETRY", "MEASURE", "GEOMETRY",
      "ΑΡΙΘΜΟΣ", "ΛΟΓΟΣ", "ΧΡΥΣΗ ΤΟΜΗ", "ΚΥΚΛΟΣ", "ΤΡΙΓΩΝΟ", "ΤΕΤΡΑΓΩΝΟ", "ΠΥΡΑΜΙΔΑ", "ΚΥΒΟΣ",
      "ΤΕΤΡΑΚΤΥΣ", "ΑΡΜΟΝΙΑ", "ΣΥΜΜΕΤΡΙΑ", "ΓΕΩΜΕΤΡΙΑ",
    ],
  },
  {
    id: "cosmology",
    name: "Κοσμολογία & Αστρονομία",
    nameEn: "Cosmology & Astronomy",
    icon: "🌌",
    color: "#8b5cf6",
    badgeBg: "bg-purple-950/40",
    badgeBorder: "border-purple-600/40",
    badgeText: "text-purple-300",
    keywords: [
      "SUN", "MOON", "STAR", "PLANET", "MARS", "JUPITER", "SATURN", "VENUS", "MERCURY", "GALAXY",
      "COSMOS", "UNIVERSE", "SOLAR", "LUNAR", "ECLIPSE", "ZODIAC", "CONSTELLATION", "LIGHT",
      "ΗΛΙΟΣ", "ΣΕΛΗΝΗ", "ΑΣΤΗΡ", "ΠΛΑΝΗΤΗΣ", "ΚΟΣΜΟΣ", "ΣΥΜΠΑΝ", "ΕΚΛΕΙΨΗ", "ΖΩΔΙΟ", "ΦΩΣ",
    ],
  },
  {
    id: "tech_modern",
    name: "Τεχνολογία & Σύγχρονος Κόσμος",
    nameEn: "Technology & Modern World",
    icon: "💻",
    color: "#06b6d4",
    badgeBg: "bg-cyan-950/40",
    badgeBorder: "border-cyan-600/40",
    badgeText: "text-cyan-300",
    keywords: [
      "COMPUTER", "DIGITAL", "INTERNET", "AI", "ROBOT", "CHIP", "RFID", "CODE", "SYSTEM", "NETWORK",
      "ONLINE", "DATA", "VACCINE", "VIRUS", "GENETIC", "BIO", "QUANTUM", "CYBER", "SATELLITE",
      "ΥΠΟΛΟΓΙΣΤΗΣ", "ΨΗΦΙΑΚΟΣ", "ΔΙΑΔΙΚΤΥΟ", "ΡΟΜΠΟΤ", "ΤΣΙΠ", "ΚΩΔΙΚΑΣ", "ΣΥΣΤΗΜΑ", "ΔΕΔΟΜΕΝΑ",
    ],
  },
  {
    id: "power_society",
    name: "Εξουσία, Πολιτική & Οικονομία",
    nameEn: "Power, Politics & Society",
    icon: "👑",
    color: "#ec4899",
    badgeBg: "bg-pink-950/40",
    badgeBorder: "border-pink-600/40",
    badgeText: "text-pink-300",
    keywords: [
      "PRESIDENT", "LEADER", "GOVERNMENT", "WAR", "PEACE", "ORDER", "NATION", "AMERICA", "ISRAEL",
      "MONEY", "DOLLAR", "BANK", "FED", "ILLUMINATI", "MASONIC", "SECRET", "CABAL", "POWER",
      "ΗΓΕΤΗΣ", "ΚΥΒΕΡΝΗΣΗ", "ΠΟΛΕΜΟΣ", "ΕΙΡΗΝΗ", "ΤΑΞΗ", "ΕΘΝΟΣ", "ΧΡΗΜΑ", "ΤΡΑΠΕΖΑ", "ΕΞΟΥΣΙΑ",
    ],
  },
  {
    id: "general",
    name: "Γενικά & Έννοιες",
    nameEn: "General Concepts",
    icon: "📜",
    color: "#a8a29e",
    badgeBg: "bg-[#201c18]",
    badgeBorder: "border-[#40362c]",
    badgeText: "text-[#d6c7b2]",
    keywords: [],
  },
];

/**
 * Categorizes a word or phrase based on keywords and content
 */
export function categorizeTerm(text: string, translation?: string): TopicCategory {
  const upperText = (text + " " + (translation || "")).toUpperCase();

  for (const cat of TOPIC_CATEGORIES) {
    if (cat.id === "general") continue;
    for (const kw of cat.keywords) {
      if (upperText.includes(kw)) {
        return cat;
      }
    }
  }

  return TOPIC_CATEGORIES[TOPIC_CATEGORIES.length - 1]; // General
}

/**
 * Common noisy, gibberish or meaningless phrases in public Gematria databases and scraped HTML
 */
export const JUNK_PATTERNS = [
  /^HTTPS?:\/\//i,
  /^WWW\./i,
  /^[0-9]+$/,
  /^PAGE\s+[0-9]+/i,
  /^TOTAL\s+RESULTS/i,
  /^GEMATRIA\s+VALUE/i,
  /^RESULTS?\s+FOR/i,
  /^SEARCH\s+RESULTS?/i,
  /^PREV(IOUS)?/i,
  /^NEXT/i,
  /^CLICK\s+HERE/i,
  /^POWERED\s+BY/i,
  /^COPYRIGHT/i,
  /^ALL\s+RIGHTS\s+RESERVED/i,
  /^VIEW\s+MORE/i,
  /^LOAD\s+MORE/i,
  /^\s*$/,
];

/**
 * Checks if a phrase is garbage, random keyboard mashing, or contains unreadable artifacts
 */
export function isMeaninglessJunk(text: string): boolean {
  const t = text.trim();
  if (!t || t.length < 2) return true;

  // If matches any known junk phrase pattern
  if (JUNK_PATTERNS.some((p) => p.test(t))) return true;

  // Pure digits or digits with punctuation
  if (/^[\d\s.,\/#!$%\^&\*;:{}=\-_`~()]+$/.test(t)) return true;

  // Too high ratio of special characters or punctuation (e.g. "@#$!%*&")
  const lettersOnly = t.replace(/[^a-zA-Z\u0370-\u03FF\u1F00-\u1FFF]/g, "");
  if (lettersOnly.length < 2) return true;
  if (lettersOnly.length / t.length < 0.6) return true;

  // Too many consecutive non-vowels / consonants (e.g. "sdfghjkl", "bcdfgh", "ψξθχ")
  if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{6,}/i.test(t)) return true;
  if (/[\u0392\u0393\u0394\u0396\u0398\u039A\u039B\u039E\u03A0\u03A1\u03A3\u03A4\u03A6\u03A7\u03A8\u03B2\u03B3\u03B4\u03B6\u03B8\u03BA\u03BB\u03BE\u03C0\u03C1\u03C3\u03C2\u03C4\u03C6\u03C7\u03C8]{6,}/.test(t)) return true;

  // Repeated same character 4+ times (e.g. "aaaaa", "zzzzz", "ααααα")
  if (/(.)\1{3,}/.test(t)) return true;

  // HTML entity leftovers like "&amp;", "&#39;", "quot;"
  if (/&(?:amp|quot|lt|gt|#\d+|#x[a-f\d]+);/i.test(t)) return true;

  // Unclosed tags or HTML leftovers
  if (/<[^>]*>/.test(t) || /<\/?\w+/.test(t)) return true;

  return false;
}

export interface QualityFilterOptions {
  minWords?: number;
  maxWords?: number;
  removeSymbols?: boolean;
  removePureNumbers?: boolean;
  removeSingleLetters?: boolean;
  filterDuplicatePhrases?: boolean;
  strictLanguageOnly?: boolean;
}

/**
 * Filter and clean scanned matches with high precision
 */
export function cleanScannedMatches<T extends { text: string; value: number }>(
  items: T[],
  options: QualityFilterOptions = {}
): { cleaned: T[]; removedCount: number } {
  const {
    minWords = 1,
    maxWords = 10,
    removeSymbols = true,
    removePureNumbers = true,
    removeSingleLetters = true,
    filterDuplicatePhrases = true,
    strictLanguageOnly = true,
  } = options;

  const seen = new Set<string>();
  const cleaned: T[] = [];

  for (const item of items) {
    let t = item.text.trim();

    // Comprehensive junk check
    if (isMeaninglessJunk(t)) continue;

    // Pure numbers check
    if (removePureNumbers && /^\d+$/.test(t)) continue;

    // Single letter check
    if (removeSingleLetters && t.replace(/[^a-zA-Z\u0370-\u03FF\u1F00-\u1FFF]/g, "").length <= 1) continue;

    // Symbols check
    if (removeSymbols && /^[^a-zA-Z\u0370-\u03FF\u1F00-\u1FFF]+$/.test(t)) continue;

    // Strict alphabet verification (must contain real words in Greek or English)
    if (strictLanguageOnly) {
      const hasGreek = /[\u0370-\u03FF\u1F00-\u1FFF]/.test(t);
      const hasLatin = /[a-zA-Z]/.test(t);
      if (!hasGreek && !hasLatin) continue;
    }

    // Word count bounds
    const words = t.split(/\s+/).filter((w) => w.length > 0);
    if (words.length < minWords || words.length > maxWords) continue;

    // Uniqueness
    const norm = t.toUpperCase().replace(/[\s\-_.,;:'"]+/g, " ").trim();
    if (filterDuplicatePhrases) {
      if (seen.has(norm)) continue;
      seen.add(norm);
    }

    cleaned.push(item);
  }

  return {
    cleaned,
    removedCount: items.length - cleaned.length,
  };
}

/**
 * Helper to download CSV with UTF-8 BOM so Excel opens Greek characters perfectly
 */
export function exportToCsvFile(
  headers: string[],
  rows: (string | number)[][],
  filename: string
) {
  const escapeCsv = (val: string | number) => {
    const s = String(val ?? "").replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvContent =
    "\uFEFF" + // UTF-8 BOM for Microsoft Excel
    headers.map(escapeCsv).join(";") +
    "\r\n" +
    rows.map((row) => row.map(escapeCsv).join(";")).join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
