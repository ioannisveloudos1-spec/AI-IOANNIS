import { calculateIsopsephy, calculatePythmen, numberToGreekNumeral } from "./isopsephy";
import { HISTORICAL_ISOPSEPHIES } from "../data/historicalIsopsephies";

export type PartOfSpeech =
  | "article"       // Άρθρο (Ο, Η, ΤΟ, ΤΟΝ, ΤΗΝ...)
  | "subject"       // Υποκείμενο / Ουσιαστικό σε ονομαστική / Κύριο όνομα (ΘΕΟΣ, ΛΟΓΟΣ, ΦΩΣ, ΙΗΣΟΥΣ...)
  | "verb"          // Ρήμα (ΕΣΤΙ, ΦΩΤΙΖΕΙ, ΣΩΖΕΙ, ΦΕΡΕΙ, ΑΓΑΠΑ...)
  | "object"        // Αντικείμενο / Αιτιατική / Ουσιαστικό (ΤΟΝ ΚΟΣΜΟΝ, ΤΗΝ ΑΛΗΘΕΙΑΝ, ΤΟ ΦΩΣ...)
  | "adjective"     // Επίθετο (ΑΓΙΟΣ, ΘΕΙΟΣ, ΜΕΓΑΣ, ΑΙΩΝΙΟΣ, ΣΟΦΟΣ...)
  | "preposition"   // Πρόθεση (ΕΝ, ΕΙΣ, ΕΚ, ΣΥΝ, ΔΙΑ...)
  | "conjunction"   // Σύνδεσμος (ΚΑΙ, ΤΕ...)
  | "other";

export interface CandidateWord {
  text: string;
  value: number;
  root: number;
  pos: PartOfSpeech;
  category?: string;
  roleLabel?: string;
  lang?: "greek" | "english";
}

export interface GeneratedSentenceMatch {
  id: string;
  words: CandidateWord[];
  fullSentence: string;
  targetSum: number;
  totalSum: number;
  root: number;
  greekNumeral: string;
  wordCount: number;
  structureLabel: string;
  isGrammatical: boolean;
  coherenceScore: number;
}

/**
 * Built-in rich grammatical vocabulary for syntactic sentence synthesis
 */
export const STRUCTURED_GRAMMAR_VOCABULARY: Array<{ text: string; pos: PartOfSpeech; category: string }> = [
  // --- Άρθρα (Articles) ---
  { text: "Ο", pos: "article", category: "Άρθρο" },
  { text: "Η", pos: "article", category: "Άρθρο" },
  { text: "ΤΟ", pos: "article", category: "Άρθρο" },
  { text: "ΤΟΝ", pos: "article", category: "Άρθρο" },
  { text: "ΤΗΝ", pos: "article", category: "Άρθρο" },
  { text: "ΤΟΥ", pos: "article", category: "Άρθρο" },
  { text: "ΤΗΣ", pos: "article", category: "Άρθρο" },
  { text: "ΟΙ", pos: "article", category: "Άρθρο" },
  { text: "ΤΑ", pos: "article", category: "Άρθρο" },
  { text: "ΤΟΥΣ", pos: "article", category: "Άρθρο" },
  { text: "ΤΑΣ", pos: "article", category: "Άρθρο" },
  { text: "ΤΩΝ", pos: "article", category: "Άρθρο" },

  // --- Υποκείμενα / Κύρια Ονόματα / Ουσιαστικά σε Ονομαστική (Subjects) ---
  { text: "ΘΕΟΣ", pos: "subject", category: "Θεολογία" },
  { text: "ΛΟΓΟΣ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΦΩΣ", pos: "subject", category: "Ουσιαστικό" },
  { text: "ΖΩΗ", pos: "subject", category: "Ουσιαστικό" },
  { text: "ΑΓΑΠΗ", pos: "subject", category: "Αρετή" },
  { text: "ΣΟΦΙΑ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΑΛΗΘΕΙΑ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΕΙΡΗΝΗ", pos: "subject", category: "Αρετή" },
  { text: "ΨΥΧΗ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΝΟΥΣ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΠΝΕΥΜΑ", pos: "subject", category: "Θεολογία" },
  { text: "ΚΟΣΜΟΣ", pos: "subject", category: "Κοσμολογία" },
  { text: "ΗΛΙΟΣ", pos: "subject", category: "Κοσμολογία" },
  { text: "ΣΕΛΗΝΗ", pos: "subject", category: "Κοσμολογία" },
  { text: "ΟΥΡΑΝΟΣ", pos: "subject", category: "Κοσμολογία" },
  { text: "ΓΗ", pos: "subject", category: "Κοσμολογία" },
  { text: "ΠΥΡ", pos: "subject", category: "Στοιχείο" },
  { text: "ΥΔΩΡ", pos: "subject", category: "Στοιχείο" },
  { text: "ΑΗΡ", pos: "subject", category: "Στοιχείο" },
  { text: "ΑΡΧΗ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΤΕΛΟΣ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΑΝΘΡΩΠΟΣ", pos: "subject", category: "Ανθρωπολογία" },
  { text: "ΝΟΜΟΣ", pos: "subject", category: "Φιλοσοφία" },
  { text: "ΔΥΝΑΜΙΣ", pos: "subject", category: "Ουσιαστικό" },
  { text: "ΔΟΞΑ", pos: "subject", category: "Θεολογία" },
  { text: "ΧΑΡΙΣ", pos: "subject", category: "Θεολογία" },
  { text: "ΒΑΣΙΛΕΙΑ", pos: "subject", category: "Θεολογία" },
  { text: "ΙΑΝΕΥΣ", pos: "subject", category: "Όνομα" },
  { text: "ΤΕΛΙΑΝΟΣ", pos: "subject", category: "Όνομα" },
  { text: "ΒΕΛΟΥΔΟΣ", pos: "subject", category: "Όνομα" },
  { text: "ΙΩΑΝΝΗΣ", pos: "subject", category: "Όνομα" },
  { text: "ΙΗΣΟΥΣ", pos: "subject", category: "Όνομα" },
  { text: "ΧΡΙΣΤΟΣ", pos: "subject", category: "Όνομα" },
  { text: "ΑΠΟΛΛΩΝ", pos: "subject", category: "Όνομα" },
  { text: "ΠΛΑΤΩΝ", pos: "subject", category: "Όνομα" },
  { text: "ΠΥΘΑΓΟΡΑΣ", pos: "subject", category: "Όνομα" },
  { text: "ΣΩΚΡΑΤΗΣ", pos: "subject", category: "Όνομα" },
  { text: "ΟΜΗΡΟΣ", pos: "subject", category: "Όνομα" },
  { text: "ΠΑΤΗΡ", pos: "subject", category: "Θεολογία" },
  { text: "ΥΙΟΣ", pos: "subject", category: "Θεολογία" },
  { text: "ΔΙΔΑΣΚΑΛΟΣ", pos: "subject", category: "Ιδιότητα" },
  { text: "ΠΟΙΜΗΝ", pos: "subject", category: "Ιδιότητα" },
  { text: "ΒΑΣΙΛΕΥΣ", pos: "subject", category: "Ιδιότητα" },
  { text: "ΗΓΕΜΩΝ", pos: "subject", category: "Ιδιότητα" },

  // --- Ρήματα (Verbs) ---
  { text: "ΕΣΤΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΕΣΤΙΝ", pos: "verb", category: "Ρήμα" },
  { text: "ΕΙΝΑΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΗΝ", pos: "verb", category: "Ρήμα" },
  { text: "ΦΩΤΙΖΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΣΩΖΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΦΕΡΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΛΕΓΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΠΟΙΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΑΓΑΠΑ", pos: "verb", category: "Ρήμα" },
  { text: "ΖΗ", pos: "verb", category: "Ρήμα" },
  { text: "ΛΑΜΠΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΔΙΔΩΣΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΑΡΧΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΕΧΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΚΡΑΤΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΓΝΩΡΙΖΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΟΔΗΓΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΝΙΚΑ", pos: "verb", category: "Ρήμα" },
  { text: "ΖΗΤΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΕΥΡΙΣΚΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΓΙΓΝΕΤΑΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΑΠΟΚΑΛΥΠΤΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΚΗΡΥΣΣΕΙ", pos: "verb", category: "Ρήμα" },
  { text: "ΕΥΛΟΓΕΙ", pos: "verb", category: "Ρήμα" },

  // --- Αντικείμενα / Πτώσεις Αιτιατικής / Συμπληρώματα (Objects) ---
  { text: "ΚΟΣΜΟΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΑΝΘΡΩΠΟΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΑΛΗΘΕΙΑΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΖΩΗΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΣΟΦΙΑΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΨΥΧΗΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΕΙΡΗΝΗΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΑΓΑΠΗΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΛΟΓΟΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΑΡΧΗΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΤΕΛΟΣ", pos: "object", category: "Αντικείμενο" },
  { text: "ΓΗΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΟΥΡΑΝΟΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΠΥΡ", pos: "object", category: "Αντικείμενο" },
  { text: "ΦΩΣ", pos: "object", category: "Αντικείμενο" },
  { text: "ΝΟΜΟΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΔΥΝΑΜΙΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΔΟΞΑΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΧΑΡΙΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΒΑΣΙΛΕΙΑΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΣΩΤΗΡΙΑΝ", pos: "object", category: "Αντικείμενο" },
  { text: "ΔΙΚΑΙΟΣΥΝΗΝ", pos: "object", category: "Αντικείμενο" },

  // --- Επίθετα (Adjectives) ---
  { text: "ΑΓΙΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΓΙΑ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΓΙΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΘΕΙΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΘΕΙΑ", pos: "adjective", category: "Επίθετο" },
  { text: "ΘΕΙΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΜΕΓΑΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΜΕΓΑ", pos: "adjective", category: "Επίθετο" },
  { text: "ΜΕΓΑΛΗ", pos: "adjective", category: "Επίθετο" },
  { text: "ΚΑΛΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΚΑΛΗ", pos: "adjective", category: "Επίθετο" },
  { text: "ΚΑΛΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΛΗΘΙΝΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΛΗΘΙΝΗ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΛΗΘΙΝΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΙΩΝΙΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΙΩΝΙΑ", pos: "adjective", category: "Επίθετο" },
  { text: "ΑΙΩΝΙΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΣΟΦΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΣΟΦΗ", pos: "adjective", category: "Επίθετο" },
  { text: "ΣΟΦΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΦΩΤΕΙΝΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΦΩΤΕΙΝΗ", pos: "adjective", category: "Επίθετο" },
  { text: "ΦΩΤΕΙΝΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΠΡΩΤΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΠΡΩΤΗ", pos: "adjective", category: "Επίθετο" },
  { text: "ΠΡΩΤΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΤΕΛΕΙΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΤΕΛΕΙΑ", pos: "adjective", category: "Επίθετο" },
  { text: "ΤΕΛΕΙΟΝ", pos: "adjective", category: "Επίθετο" },
  { text: "ΔΙΚΑΙΟΣ", pos: "adjective", category: "Επίθετο" },
  { text: "ΔΙΚΑΙΑ", pos: "adjective", category: "Επίθετο" },
  { text: "ΔΙΚΑΙΟΝ", pos: "adjective", category: "Επίθετο" },

  // --- Προθέσεις & Σύνδεσμοι (Prepositions & Conjunctions) ---
  { text: "ΕΝ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΕΙΣ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΕΚ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΕΞ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΣΥΝ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΔΙΑ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΥΠΕΡ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΠΕΡΙ", pos: "preposition", category: "Πρόθεση" },
  { text: "ΚΑΙ", pos: "conjunction", category: "Σύνδεσμος" },
  { text: "ΜΕΤΑ", pos: "preposition", category: "Πρόθεση" },
];

/**
 * Maps POS to a friendly Greek label
 */
export function getPosLabel(pos: PartOfSpeech): string {
  switch (pos) {
    case "article":
      return "Άρθρο";
    case "subject":
      return "Υποκείμενο";
    case "verb":
      return "Ρήμα";
    case "object":
      return "Αντικείμενο";
    case "adjective":
      return "Επίθετο";
    case "preposition":
      return "Πρόθεση";
    case "conjunction":
      return "Σύνδεσμος";
    default:
      return "Λέξη";
  }
}

/**
 * Automatically infers Part of Speech from word text / endings if not specified
 */
export function inferWordPos(text: string, customCategory?: string): PartOfSpeech {
  const clean = text.trim().toUpperCase();

  // Check known dictionary
  const known = STRUCTURED_GRAMMAR_VOCABULARY.find((k) => k.text === clean);
  if (known) return known.pos;

  if (["Ο", "Η", "ΤΟ", "ΤΟΝ", "ΤΗΝ", "ΤΟΥ", "ΤΗΣ", "ΟΙ", "ΤΑ", "ΤΟΥΣ", "ΤΑΣ", "ΤΩΝ", "ΤΟΙΣ", "ΤΩ"].includes(clean)) {
    return "article";
  }
  if (["ΚΑΙ", "ΤΕ", "Η", "ΑΛΛΑ", "ΟΥΔΕ", "ΜΗΔΕ"].includes(clean)) {
    return "conjunction";
  }
  if (["ΕΝ", "ΕΙΣ", "ΕΚ", "ΕΞ", "ΣΥΝ", "ΔΙΑ", "ΥΠΕΡ", "ΠΕΡΙ", "ΜΕΤΑ", "ΠΡΟ", "ΠΡΟΣ", "ΑΠΟ", "ΥΠΟ"].includes(clean)) {
    return "preposition";
  }

  // Endings heuristics
  if (clean.endsWith("ΕΙ") || clean.endsWith("ΕΙΝ") || clean.endsWith("ΟΥΣΙ") || clean.endsWith("ΤΑΙ") || clean.endsWith("ΣΙ") || clean.endsWith("ΩΝ")) {
    if (customCategory?.toLowerCase().includes("ρημα") || customCategory?.toLowerCase().includes("verb")) {
      return "verb";
    }
  }

  if (clean.endsWith("ΟΝ") || clean.endsWith("ΗΝ") || clean.endsWith("ΑΝ") || clean.endsWith("ΙΝ") || clean.endsWith("ΑΣ")) {
    return "object";
  }

  return "subject";
}

/**
 * Syntactic Sentence Patterns (Grammar Rules)
 */
export const SYNTACTIC_PATTERNS: Record<number, Array<{ pattern: PartOfSpeech[]; label: string; score: number }>> = {
  // 2 Words Patterns
  2: [
    { pattern: ["subject", "verb"], label: "Υποκείμενο + Ρήμα", score: 98 },
    { pattern: ["article", "subject"], label: "Άρθρο + Υποκείμενο", score: 95 },
    { pattern: ["verb", "object"], label: "Ρήμα + Αντικείμενο", score: 94 },
    { pattern: ["adjective", "subject"], label: "Επίθετο + Ουσιαστικό", score: 92 },
    { pattern: ["subject", "object"], label: "Υποκείμενο + Συμπλήρωμα", score: 85 },
    { pattern: ["preposition", "object"], label: "Πρόθεση + Αντικείμενο", score: 88 },
  ],
  // 3 Words Patterns
  3: [
    { pattern: ["article", "subject", "verb"], label: "Άρθρο + Υποκείμενο + Ρήμα", score: 99 },
    { pattern: ["subject", "verb", "object"], label: "Υποκείμενο + Ρήμα + Αντικείμενο", score: 98 },
    { pattern: ["subject", "verb", "adjective"], label: "Υποκείμενο + Ρήμα + Επίθετο", score: 96 },
    { pattern: ["verb", "article", "object"], label: "Ρήμα + Άρθρο + Αντικείμενο", score: 95 },
    { pattern: ["article", "subject", "adjective"], label: "Άρθρο + Υποκείμενο + Επίθετο", score: 92 },
    { pattern: ["adjective", "subject", "verb"], label: "Επίθετο + Υποκείμενο + Ρήμα", score: 93 },
    { pattern: ["subject", "conjunction", "subject"], label: "Υποκείμενο + και + Υποκείμενο", score: 90 },
  ],
  // 4 Words Patterns (The core structure requested: Άρθρο + Υποκείμενο + Ρήμα + Αντικείμενο)
  4: [
    { pattern: ["article", "subject", "verb", "object"], label: "Άρθρο + Υποκείμενο + Ρήμα + Αντικείμενο", score: 100 },
    { pattern: ["subject", "verb", "article", "object"], label: "Υποκείμενο + Ρήμα + Άρθρο + Αντικείμενο", score: 99 },
    { pattern: ["article", "subject", "verb", "adjective"], label: "Άρθρο + Υποκείμενο + Ρήμα + Επίθετο", score: 98 },
    { pattern: ["article", "adjective", "subject", "verb"], label: "Άρθρο + Επίθετο + Υποκείμενο + Ρήμα", score: 96 },
    { pattern: ["verb", "article", "adjective", "object"], label: "Ρήμα + Άρθρο + Επίθετο + Αντικείμενο", score: 94 },
    { pattern: ["article", "subject", "preposition", "object"], label: "Άρθρο + Υποκείμενο + Πρόθεση + Συμπλήρωμα", score: 91 },
  ],
  // 5 Words Patterns
  5: [
    { pattern: ["article", "subject", "verb", "article", "object"], label: "Άρθρο + Υποκείμενο + Ρήμα + Άρθρο + Αντικείμενο", score: 100 },
    { pattern: ["article", "adjective", "subject", "verb", "object"], label: "Άρθρο + Επίθετο + Υποκείμενο + Ρήμα + Αντικείμενο", score: 98 },
    { pattern: ["article", "subject", "verb", "preposition", "object"], label: "Άρθρο + Υποκείμενο + Ρήμα + Πρόθεση + Αντικείμενο", score: 96 },
    { pattern: ["subject", "verb", "article", "adjective", "object"], label: "Υποκείμενο + Ρήμα + Άρθρο + Επίθετο + Αντικείμενο", score: 95 },
  ],
};

export type GenerationStrategy = "grammatical" | "free";
export type VocabularySource = "all" | "archive_only" | "classical_only";

/**
 * Finds exact isopsephic combinations that sum to the target value,
 * with complete support for grammatical sentence structure (Article + Subject + Verb + Object)
 * and user saved items integration.
 */
export function generateIsopsephicSentences(
  targetValue: number,
  options: {
    wordsCount?: number; // 2, 3, 4, or 5
    customWords?: Array<{ text: string; value?: number; category?: string }>;
    strategy?: GenerationStrategy;
    source?: VocabularySource;
    maxResults?: number;
  } = {}
): GeneratedSentenceMatch[] {
  const {
    wordsCount = 4,
    customWords = [],
    strategy = "grammatical",
    source = "all",
    maxResults = 50,
  } = options;

  if (targetValue <= 0) return [];

  // Build unique candidates pool
  const candidatesMap = new Map<string, CandidateWord>();

  // 1. Add structured classical vocabulary (if source !== "archive_only")
  if (source !== "archive_only") {
    STRUCTURED_GRAMMAR_VOCABULARY.forEach((w) => {
      const clean = w.text.trim().toUpperCase();
      const val = calculateIsopsephy(clean);
      if (val > 0 && val < targetValue) {
        candidatesMap.set(clean, {
          text: clean,
          value: val,
          root: calculatePythmen(val),
          pos: w.pos,
          category: w.category,
          roleLabel: getPosLabel(w.pos),
          lang: "greek",
        });
      }
    });

    // Add historical items
    HISTORICAL_ISOPSEPHIES.forEach((h) => {
      h.items.forEach((item) => {
        const clean = item.word.trim().toUpperCase();
        if (!clean.includes(" ") && !clean.includes("-") && clean.length > 0) {
          const val = calculateIsopsephy(clean);
          if (val > 0 && val < targetValue && !candidatesMap.has(clean)) {
            const pos = inferWordPos(clean, item.category);
            candidatesMap.set(clean, {
              text: clean,
              value: val,
              root: calculatePythmen(val),
              pos,
              category: item.category || "Ιστορικό",
              roleLabel: getPosLabel(pos),
              lang: "greek",
            });
          }
        }
      });
    });
  }

  // 2. Add custom words from user's archive (if source !== "classical_only")
  if (source !== "classical_only") {
    customWords.forEach((c) => {
      const clean = c.text.trim().toUpperCase();
      // Skip multi-word phrases for word generator pool
      if (!clean.includes(" ") && clean.length > 0) {
        const val = c.value || calculateIsopsephy(clean);
        if (val > 0 && val < targetValue) {
          const pos = inferWordPos(clean, c.category);
          candidatesMap.set(clean, {
            text: clean,
            value: val,
            root: calculatePythmen(val),
            pos,
            category: c.category || "Αρχείο Χρήστη",
            roleLabel: getPosLabel(pos),
            lang: "greek",
          });
        }
      }
    });
  }

  const allWords = Array.from(candidatesMap.values());
  if (allWords.length === 0) return [];

  const results: GeneratedSentenceMatch[] = [];
  const seenCombinations = new Set<string>();

  // Group candidate words by POS for rapid syntactic pattern matching
  const wordsByPos: Record<PartOfSpeech, CandidateWord[]> = {
    article: allWords.filter((w) => w.pos === "article"),
    subject: allWords.filter((w) => w.pos === "subject"),
    verb: allWords.filter((w) => w.pos === "verb"),
    object: allWords.filter((w) => w.pos === "object" || w.pos === "subject"),
    adjective: allWords.filter((w) => w.pos === "adjective"),
    preposition: allWords.filter((w) => w.pos === "preposition"),
    conjunction: allWords.filter((w) => w.pos === "conjunction"),
    other: allWords.filter((w) => w.pos === "other"),
  };

  // Helper to add match
  const addMatch = (words: CandidateWord[], patternLabel: string, isGrammar: boolean, score: number) => {
    const key = words.map((w) => w.text).join(" ");
    if (seenCombinations.has(key)) return;
    seenCombinations.add(key);

    results.push({
      id: `sent-${wordsCount}-${results.length}-${Math.random().toString(36).substring(2, 6)}`,
      words,
      fullSentence: key,
      targetSum: targetValue,
      totalSum: targetValue,
      root: calculatePythmen(targetValue),
      greekNumeral: numberToGreekNumeral(targetValue),
      wordCount: words.length,
      structureLabel: patternLabel,
      isGrammatical: isGrammar,
      coherenceScore: score,
    });
  };

  // --- STRATEGY 1: GRAMMATICAL SYNTACTIC PATTERNS ---
  if (strategy === "grammatical") {
    const patterns = SYNTACTIC_PATTERNS[wordsCount] || [];

    for (const pat of patterns) {
      if (results.length >= maxResults) break;

      const pLength = pat.pattern.length;
      if (pLength !== wordsCount) continue;

      // Backtrack along the grammatical pattern slots
      const searchSlot = (slotIdx: number, currentCombo: CandidateWord[], currentSum: number) => {
        if (results.length >= maxResults) return;

        if (slotIdx === pLength) {
          if (currentSum === targetValue) {
            addMatch([...currentCombo], pat.label, true, pat.score);
          }
          return;
        }

        const requiredPos = pat.pattern[slotIdx];
        const candidates = wordsByPos[requiredPos] || [];
        const isLastSlot = slotIdx === pLength - 1;

        if (isLastSlot) {
          const needed = targetValue - currentSum;
          if (needed <= 0) return;
          const match = candidates.find((c) => c.value === needed && !currentCombo.some((w) => w.text === c.text));
          if (match) {
            currentCombo.push(match);
            addMatch([...currentCombo], pat.label, true, pat.score);
            currentCombo.pop();
          }
          return;
        }

        for (let i = 0; i < candidates.length; i++) {
          if (results.length >= maxResults) break;
          const cand = candidates[i];
          if (currentCombo.some((w) => w.text === cand.text)) continue;

          const nextSum = currentSum + cand.value;
          if (nextSum >= targetValue) continue;

          currentCombo.push(cand);
          searchSlot(slotIdx + 1, currentCombo, nextSum);
          currentCombo.pop();
        }
      };

      searchSlot(0, [], 0);
    }
  }

  // --- FALLBACK / STRATEGY 2: FREE COMBINATION (OR IF GRAMMAR YIELDS FEW RESULTS) ---
  if (results.length < maxResults) {
    const pool = allWords.sort((a, b) => a.value - b.value);
    const n = pool.length;

    // 2-Word Combinations
    if (wordsCount === 2) {
      let left = 0;
      let right = n - 1;
      while (left < right && results.length < maxResults) {
        const sum = pool[left].value + pool[right].value;
        if (sum === targetValue) {
          const w1 = pool[left];
          const w2 = pool[right];
          const key = [w1.text, w2.text].sort().join("|");
          if (!seenCombinations.has(key)) {
            seenCombinations.add(key);
            addMatch([w1, w2], `${w1.roleLabel || "Λέξη"} + ${w2.roleLabel || "Λέξη"}`, false, 75);
          }
          left++;
          right--;
        } else if (sum < targetValue) {
          left++;
        } else {
          right--;
        }
      }
    }

    // 3-Word Combinations
    if (wordsCount === 3) {
      for (let i = 0; i < n && results.length < maxResults; i++) {
        const w1 = pool[i];
        if (w1.value >= targetValue) break;
        let left = i + 1;
        let right = n - 1;
        while (left < right && results.length < maxResults) {
          const sum = w1.value + pool[left].value + pool[right].value;
          if (sum === targetValue) {
            const w2 = pool[left];
            const w3 = pool[right];
            const key = [w1.text, w2.text, w3.text].sort().join("|");
            if (!seenCombinations.has(key)) {
              seenCombinations.add(key);
              addMatch([w1, w2, w3], "Ισόψηφη Τριάδα", false, 70);
            }
            left++;
            right--;
          } else if (sum < targetValue) {
            left++;
          } else {
            right--;
          }
        }
      }
    }

    // 4-Word Combinations
    if (wordsCount === 4) {
      const filteredPool = pool.filter((w) => w.value < targetValue / 2).slice(0, 100);
      const fn = filteredPool.length;
      for (let i = 0; i < fn && results.length < maxResults; i++) {
        for (let j = i + 1; j < fn && results.length < maxResults; j++) {
          for (let k = j + 1; k < fn && results.length < maxResults; k++) {
            const partial = filteredPool[i].value + filteredPool[j].value + filteredPool[k].value;
            const remainder = targetValue - partial;
            if (remainder <= 0) continue;

            for (let m = k + 1; m < fn; m++) {
              if (filteredPool[m].value === remainder) {
                const combo = [filteredPool[i], filteredPool[j], filteredPool[k], filteredPool[m]];
                const key = combo.map((w) => w.text).sort().join("|");
                if (!seenCombinations.has(key)) {
                  seenCombinations.add(key);
                  addMatch(combo, "Ισόψηφη Τετράδα", false, 65);
                }
                break;
              }
            }
          }
        }
      }
    }

    // 5-Word Combinations
    if (wordsCount === 5) {
      const filteredPool = pool.filter((w) => w.value < targetValue / 3).slice(0, 70);
      const fn = filteredPool.length;
      for (let i = 0; i < fn && results.length < maxResults; i++) {
        for (let j = i + 1; j < fn && results.length < maxResults; j++) {
          for (let k = j + 1; k < fn && results.length < maxResults; k++) {
            for (let m = k + 1; m < fn && results.length < maxResults; m++) {
              const partial = filteredPool[i].value + filteredPool[j].value + filteredPool[k].value + filteredPool[m].value;
              const remainder = targetValue - partial;
              if (remainder <= 0) continue;

              for (let p = m + 1; p < fn; p++) {
                if (filteredPool[p].value === remainder) {
                  const combo = [filteredPool[i], filteredPool[j], filteredPool[k], filteredPool[m], filteredPool[p]];
                  const key = combo.map((w) => w.text).sort().join("|");
                  if (!seenCombinations.has(key)) {
                    seenCombinations.add(key);
                    addMatch(combo, "Ισόψηφη Πεντάδα", false, 60);
                  }
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  // Sort by coherence score descending
  return results.sort((a, b) => b.coherenceScore - a.coherenceScore);
}
