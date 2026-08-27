import { IonicLetter, LetterBreakdown, WordIsopsephy, PhraseMatch, SentenceIsopsephyMatch, TextAnalysisStats, TextAnalysisResult, UniqueWordStat, WordCombinationMatch, SeedWordCombinationMatch, NumberingSystem } from "../types";

/**
 * English Gematria Base 6 / Sumerian values (A=6, B=12, C=18 ... Z=156)
 * As used by Gematrix.org & English Gematria calculators
 */
export const ENGLISH_BASE6_VALUES: Record<string, number> = {
  A: 6, B: 12, C: 18, D: 24, E: 30, F: 36, G: 42, H: 48, I: 54,
  J: 60, K: 66, L: 72, M: 78, N: 84, O: 90, P: 96, Q: 102, R: 108,
  S: 114, T: 120, U: 126, V: 132, W: 138, X: 144, Y: 150, Z: 156,
};

export const ENGLISH_SIMPLE_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 10, K: 11, L: 12, M: 13, N: 14, O: 15, P: 16, Q: 17, R: 18,
  S: 19, T: 20, U: 21, V: 22, W: 23, X: 24, Y: 25, Z: 26,
};

/**
 * Πλήρης πίνακας της Ιωνικής Αρίθμησης (27 γράμματα: 9 μονάδες, 9 δεκάδες, 9 εκατοντάδες)
 */
export const IONIC_ALPHABET: IonicLetter[] = [
  // ΜΟΝΑΔΕΣ (1-9)
  { char: "Α", upper: "Α", lower: "α", name: "Άλφα", value: 1, category: "monas", greekNumeral: "α´", description: "Μονάς πρώτη" },
  { char: "Β", upper: "Β", lower: "β", name: "Βήτα", value: 2, category: "monas", greekNumeral: "β´", description: "Μονάς δεύτερη" },
  { char: "Γ", upper: "Γ", lower: "γ", name: "Γάμμα", value: 3, category: "monas", greekNumeral: "γ´", description: "Μονάς τρίτη" },
  { char: "Δ", upper: "Δ", lower: "δ", name: "Δέλτα", value: 4, category: "monas", greekNumeral: "δ´", description: "Μονάς τέταρτη / Τετρακτύς" },
  { char: "Ε", upper: "Ε", lower: "ε", name: "Έψιλον", value: 5, category: "monas", greekNumeral: "ε´", description: "Μονάς πέμπτη / Πεντάδα" },
  { char: "Ϛ", upper: "Ϛ", lower: "ϛ", name: "Στίγμα / Δίγαμμα (Ϝ)", value: 6, category: "monas", archaic: true, greekNumeral: "ϛ´", description: "Θεμελιώδες 6ο ψηφίο (Δίγαμμα/Στίγμα)" },
  { char: "Ζ", upper: "Ζ", lower: "ζ", name: "Ζήτα", value: 7, category: "monas", greekNumeral: "ζ´", description: "Μονάς έβδομη / Εβδομάδα" },
  { char: "Η", upper: "Η", lower: "η", name: "Ήτα", value: 8, category: "monas", greekNumeral: "η´", description: "Μονάς όγδοη / Οκτάδα" },
  { char: "Θ", upper: "Θ", lower: "θ", name: "Θήτα", value: 9, category: "monas", greekNumeral: "θ´", description: "Μονάς ένατη / Εννεάδα" },

  // ΔΕΚΑΔΕΣ (10-90)
  { char: "Ι", upper: "Ι", lower: "ι", name: "Ιώτα", value: 10, category: "dekas", greekNumeral: "ι´", description: "Πρώτη δεκάδα" },
  { char: "Κ", upper: "Κ", lower: "κ", name: "Κάππα", value: 20, category: "dekas", greekNumeral: "κ´", description: "Δεύτερη δεκάδα" },
  { char: "Λ", upper: "Λ", lower: "λ", name: "Λάμδα", value: 30, category: "dekas", greekNumeral: "λ´", description: "Τρίτη δεκάδα" },
  { char: "Μ", upper: "Μ", lower: "μ", name: "Μι", value: 40, category: "dekas", greekNumeral: "μ´", description: "Τέταρτη δεκάδα" },
  { char: "Ν", upper: "Ν", lower: "ν", name: "Νι", value: 50, category: "dekas", greekNumeral: "ν´", description: "Πέμπτη δεκάδα" },
  { char: "Ξ", upper: "Ξ", lower: "ξ", name: "Ξι", value: 60, category: "dekas", greekNumeral: "ξ´", description: "Έκτη δεκάδα" },
  { char: "Ο", upper: "Ο", lower: "ο", name: "Όμικρον", value: 70, category: "dekas", greekNumeral: "ο´", description: "Έβδομη δεκάδα" },
  { char: "Π", upper: "Π", lower: "π", name: "Πι", value: 80, category: "dekas", greekNumeral: "π´", description: "Όγδοη δεκάδα" },
  { char: "Ϟ", upper: "Ϟ", lower: "ϟ", name: "Κόππα (Ϙ)", value: 90, category: "dekas", archaic: true, greekNumeral: "ϟ´", description: "Θεμελιώδες 90ό ψηφίο (Κόππα)" },

  // ΕΚΑΤΟΝΤΑΔΕΣ (100-900)
  { char: "Ρ", upper: "Ρ", lower: "ρ", name: "Ρω", value: 100, category: "ekatontas", greekNumeral: "ρ´", description: "Πρώτη εκατοντάδα" },
  { char: "Σ", upper: "Σ", lower: "σ/ς", name: "Σίγμα", value: 200, category: "ekatontas", greekNumeral: "σ´", description: "Δεύτερη εκατοντάδα (και τελικό ς)" },
  { char: "Τ", upper: "Τ", lower: "τ", name: "Ταυ", value: 300, category: "ekatontas", greekNumeral: "τ´", description: "Τρίτη εκατοντάδα" },
  { char: "Υ", upper: "Υ", lower: "υ", name: "Ύψιλον", value: 400, category: "ekatontas", greekNumeral: "υ´", description: "Τέταρτη εκατοντάδα" },
  { char: "Φ", upper: "Φ", lower: "φ", name: "Φι", value: 500, category: "ekatontas", greekNumeral: "φ´", description: "Πέμπτη εκατοντάδα" },
  { char: "Χ", upper: "Χ", lower: "χ", name: "Χι", value: 600, category: "ekatontas", greekNumeral: "χ´", description: "Έκτη εκατοντάδα" },
  { char: "Ψ", upper: "Ψ", lower: "ψ", name: "Ψι", value: 700, category: "ekatontas", greekNumeral: "ψ´", description: "Έβδομη εκατοντάδα" },
  { char: "Ω", upper: "Ω", lower: "ω", name: "Ωμέγα", value: 800, category: "ekatontas", greekNumeral: "ω´", description: "Όγδοη εκατοντάδα" },
  { char: "Ϡ", upper: "Ϡ", lower: "ϡ", name: "Σαμπί (Ͳ)", value: 900, category: "ekatontas", archaic: true, greekNumeral: "ϡ´", description: "Θεμελιώδες 900ό ψηφίο (Σαμπί)" },
];

/**
 * Χάρτης αντιστοίχισης χαρακτήρων σε αξίες
 */
const CHAR_MAP: Record<string, number> = {
  // Άλφα = 1
  'Α': 1, 'α': 1, 'Ά': 1, 'ά': 1, 'Ἀ': 1, 'ἀ': 1, 'Ἁ': 1, 'ἁ': 1, 'Ἂ': 1, 'ἂ': 1, 'Ἃ': 1, 'ἃ': 1,
  'Ἄ': 1, 'ἄ': 1, 'Ἅ': 1, 'ἅ': 1, 'Ἆ': 1, 'ἆ': 1, 'Ἇ': 1, 'ἇ': 1, 'ᾀ': 1, 'ᾁ': 1, 'ᾂ': 1, 'ᾃ': 1,
  'ᾄ': 1, 'ᾅ': 1, 'ᾆ': 1, 'ᾇ': 1, 'ᾈ': 1, 'ᾉ': 1, 'ᾊ': 1, 'ᾋ': 1, 'ᾌ': 1, 'ᾍ': 1, 'ᾎ': 1, 'ᾏ': 1,
  'ᾰ': 1, 'ᾱ': 1, 'ᾲ': 1, 'ᾳ': 1, 'ᾴ': 1, 'ᾶ': 1, 'ᾷ': 1, 'Ᾰ': 1, 'Ᾱ': 1, 'Ὰ': 1, 'ὰ': 1, 'Ά': 1,
  'ᾼ': 1,

  // Βήτα = 2
  'Β': 2, 'β': 2, 'ϐ': 2,

  // Γάμμα = 3
  'Γ': 3, 'γ': 3,

  // Δέλτα = 4
  'Δ': 4, 'δ': 4,

  // Έψιλον = 5
  'Ε': 5, 'ε': 5, 'Έ': 5, 'έ': 5, 'Ἐ': 5, 'ἐ': 5, 'Ἑ': 5, 'ἑ': 5, 'Ἒ': 5, 'ἒ': 5, 'Ἓ': 5, 'ἓ': 5,
  'Ἔ': 5, 'ἔ': 5, 'Ἕ': 5, 'ἕ': 5, 'Ὲ': 5, 'ὲ': 5, 'Έ': 5,

  // Στίγμα / Δίγαμμα = 6
  'Ϛ': 6, 'ϛ': 6, 'Ϝ': 6, 'ϝ': 6, 'ϥ': 6,

  // Ζήτα = 7
  'Ζ': 7, 'ζ': 7,

  // Ήτα = 8
  'Η': 8, 'η': 8, 'Ή': 8, 'ή': 8, 'Ἠ': 8, 'ἠ': 8, 'Ἡ': 8, 'ἡ': 8, 'Ἢ': 8, 'ἢ': 8, 'Ἣ': 8, 'ἣ': 8,
  'Ἤ': 8, 'ἤ': 8, 'Ἥ': 8, 'ἥ': 8, 'Ἦ': 8, 'ἦ': 8, 'Ἧ': 8, 'ἧ': 8, 'ᾐ': 8, 'ᾑ': 8, 'ᾒ': 8, 'ᾓ': 8,
  'ᾔ': 8, 'ᾕ': 8, 'ᾖ': 8, 'ᾗ': 8, 'ᾘ': 8, 'ᾙ': 8, 'ᾚ': 8, 'ᾛ': 8, 'ᾜ': 8, 'ᾝ': 8, 'ᾞ': 8, 'ᾟ': 8,
  'ῂ': 8, 'ῃ': 8, 'ῄ': 8, 'ῆ': 8, 'ῇ': 8, 'Ὴ': 8, 'ὴ': 8, 'Ή': 8, 'ῌ': 8,

  // Θήτα = 9
  'Θ': 9, 'θ': 9, 'ϑ': 9,

  // Ιώτα = 10
  'Ι': 10, 'ι': 10, 'Ί': 10, 'ί': 10, 'Ϊ': 10, 'ϊ': 10, 'ΐ': 10, 'Ἰ': 10, 'ἰ': 10, 'Ἱ': 10, 'ἱ': 10,
  'Ἲ': 10, 'ἲ': 10, 'Ἳ': 10, 'ἳ': 10, 'Ἴ': 10, 'ἴ': 10, 'Ἵ': 10, 'ἵ': 10, 'Ἶ': 10, 'ἶ': 10, 'Ἷ': 10, 'ἷ': 10,
  'ῐ': 10, 'ῑ': 10, 'ῒ': 10, 'ῖ': 10, 'ῗ': 10, 'Ῐ': 10, 'Ῑ': 10, 'Ὶ': 10, 'ὶ': 10, 'Ί': 10,

  // Κάππα = 20
  'Κ': 20, 'κ': 20, 'ϰ': 20,

  // Λάμδα = 30
  'Λ': 30, 'λ': 30,

  // Μι = 40
  'Μ': 40, 'μ': 40,

  // Νι = 50
  'Ν': 50, 'ν': 50,

  // Ξι = 60
  'Ξ': 60, 'ξ': 60,

  // Όμικρον = 70
  'Ο': 70, 'ο': 70, 'Ό': 70, 'ό': 70, 'Ὀ': 70, 'ὀ': 70, 'Ὁ': 70, 'ὁ': 70, 'Ὂ': 70, 'ὂ': 70, 'Ὃ': 70, 'ὃ': 70,
  'Ὄ': 70, 'ὄ': 70, 'Ὅ': 70, 'ὅ': 70, 'Ὸ': 70, 'ὸ': 70, 'Ό': 70,

  // Πι = 80
  'Π': 80, 'π': 80, 'ϖ': 80,

  // Κόππα = 90
  'Ϟ': 90, 'ϟ': 90, 'Ϙ': 90, 'ϙ': 90,

  // Ρω = 100
  'Ρ': 100, 'ρ': 100, 'ῤ': 100, 'ῥ': 100, 'Ῥ': 100, ' Provide': 100,

  // Σίγμα & Τελικό Σίγμα = 200
  'Σ': 200, 'σ': 200, 'ς': 200, 'ϲ': 200, 'Ϲ': 200, 'Ͻ': 200, 'Ͼ': 200, 'Ͽ': 200,

  // Ταυ = 300
  'Τ': 300, 'τ': 300,

  // Ύψιλον = 400
  'Υ': 400, 'υ': 400, 'Ύ': 400, 'ύ': 400, 'Ϋ': 400, 'ϋ': 400, 'ΰ': 400, 'ὐ': 400, 'ὑ': 400, 'ὒ': 400, 'ὓ': 400,
  'ὔ': 400, 'ὕ': 400, 'ὖ': 400, 'ὗ': 400, 'ῠ': 400, 'ῡ': 400, 'ῢ': 400, 'ῦ': 400, 'ῧ': 400, 'Ῠ': 400, 'Ῡ': 400,
  'Ὺ': 400, 'ὺ': 400, 'Ύ': 400,

  // Φι = 500
  'Φ': 500, 'φ': 500, 'ϕ': 500,

  // Χι = 600
  'Χ': 600, 'χ': 600,

  // Ψι = 700
  'Ψ': 700, 'ψ': 700,

  // Ωμέγα = 800
  'Ω': 800, 'ω': 800, 'Ώ': 800, 'ώ': 800, 'Ὠ': 800, 'ὠ': 800, 'Ὡ': 800, 'ὡ': 800, 'Ὢ': 800, 'ὢ': 800, 'Ὣ': 800, 'ὣ': 800,
  'Ὤ': 800, 'ὤ': 800, 'Ὥ': 800, 'ὥ': 800, 'Ὦ': 800, 'ὦ': 800, 'Ὧ': 800, 'ὧ': 800, 'ᾠ': 800, 'ᾡ': 800, 'ᾢ': 800, 'ᾣ': 800,
  'ᾤ': 800, 'ᾥ': 800, 'ᾦ': 800, 'ᾧ': 800, 'ᾨ': 800, 'ᾩ': 800, 'ᾪ': 800, 'ᾫ': 800, 'ᾬ': 800, 'ᾭ': 800, 'ᾮ': 800, 'ᾯ': 800,
  'ῲ': 800, 'ῳ': 800, 'ῴ': 800, 'ῶ': 800, 'ῷ': 800, 'Ὼ': 800, 'ὼ': 800, 'Ώ': 800, 'ῼ': 800,

  // Σαμπί = 900
  'Ϡ': 900, 'ϡ': 900, 'Ͳ': 900, 'ͳ': 900,
};

/**
 * Καθαρισμός και κανονικοποίηση πολυτονικού κειμένου.
 * Διορθώνει αποσπασμένους τόνους, βαρεῖες (`), ὀξεῖες (´), περισπωμένες (~/῀), ὑπογεγραμμένες, 
 * αναδιατάσσει σωστά τα combining diacritics και επιστρέφει άρτια διαμορφωμένο Unicode NFC πολυτονικό κείμενο.
 */
export function cleanAndNormalizePolytonic(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Διόρθωση αποκομμένων τόνων/αποστρόφων με κενά πριν ή μετά (π.χ. "δι ' αὐτοῦ" -> "δι᾽ αὐτοῦ")
  cleaned = cleaned.replace(/(\w)\s+['`᾽’´`]/g, "$1᾽ ");
  cleaned = cleaned.replace(/\s+['`᾽’´`]\s+/g, " ");

  // 2. Μετατροπή απλών ASCII backticks / standalone accents αμέσως μετά από φωνήεντα σε κανονικά συνδυαστικά σημεία
  // π.χ. e` -> è / ε` -> ὲ
  cleaned = cleaned
    .replace(/([αΑ])[`\u0060\u0300\u1FEF]/g, "ὰ")
    .replace(/([εΕ])[`\u0060\u0300\u1FEF]/g, "ὲ")
    .replace(/([ηΗ])[`\u0060\u0300\u1FEF]/g, "ὴ")
    .replace(/([ιΙ])[`\u0060\u0300\u1FEF]/g, "ὶ")
    .replace(/([οΟ])[`\u0060\u0300\u1FEF]/g, "ὸ")
    .replace(/([υΥ])[`\u0060\u0300\u1FEF]/g, "ὺ")
    .replace(/([ωΩ])[`\u0060\u0300\u1FEF]/g, "ὼ");

  // 3. Κανονικοποίηση NFD -> NFC
  cleaned = cleaned.normalize("NFC");

  return cleaned;
}

/**
 * Κανονικοποίηση πολυτονικού ελληνικού κειμένου σε κεφαλαία μονοτονικά/απλά γράμματα
 */
export function normalizePolytonicGreek(text: string): string {
  if (!text) return "";
  
  const cleaned = cleanAndNormalizePolytonic(text);
  // Normalize unicode NFD and strip common combining diacritics
  const nfd = cleaned.normalize("NFD");
  let result = "";
  
  for (let i = 0; i < nfd.length; i++) {
    const code = nfd.charCodeAt(i);
    // Skip combining diacritics: 0x0300 - 0x036F and greek diacritics 0x1DC0-0x1DFF
    if ((code >= 0x0300 && code <= 0x036f) || (code >= 0x1dc0 && code <= 0x1dff)) {
      continue;
    }
    result += nfd[i];
  }
  
  // Re-compose NFC
  result = result.normalize("NFC");
  
  // Direct character replacements for remaining special polytonic forms
  return result
    .toUpperCase()
    .replace(/[ΆἈἉἊἋἌἍἎἏᾈᾉᾊᾋᾌᾍᾎᾏᾸᾹᾺΆᾼ]/g, 'Α')
    .replace(/[ΈἘἙἚἛἜἝῈΈ]/g, 'Ε')
    .replace(/[ΉἨἩἪἫἬἭἮἯᾘᾙᾚᾛᾜᾝᾞᾟῊΉῌ]/g, 'Η')
    .replace(/[ΊΪἸἹἺἻἼἽἾἿῘῙῚΊ]/g, 'Ι')
    .replace(/[ΌὈὉὊὋὌὍῸΌ]/g, 'Ο')
    .replace(/[ΎΫὙὛὝὟῨῩῪΎ]/g, 'Υ')
    .replace(/[ΏὨὩὪὫὬὭὮὯᾨᾩᾪᾫᾬᾭᾮᾯῺΏῼ]/g, 'Ω')
    .replace(/[Ῥ]/g, 'Ρ');
}

/**
 * Υπολογισμός Πυθμένα (Digital Root 1-9)
 */
export function calculatePythmen(num: number): number {
  if (!num || num <= 0) return 0;
  let current = Math.abs(Math.floor(num));
  while (current > 9) {
    let sum = 0;
    while (current > 0) {
      sum += current % 10;
      current = Math.floor(current / 10);
    }
    current = sum;
  }
  return current;
}

/**
 * Μετατροπή αριθμού σε Ιωνικό Ελληνικό Αριθμητικό Σύστημα (π.χ. 666 -> χξϛ´)
 */
export function numberToGreekNumeral(num: number): string {
  if (num <= 0 || !Number.isInteger(num)) return "";
  
  let n = num;
  let result = "";
  
  // Χιλιάδες (͵α = 1000, ͵β = 2000, ...)
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    n = n % 1000;
    
    // Convert thousands
    const thousandsStr = numberToGreekNumeralSub1000(thousands);
    result += "͵" + thousandsStr;
  }
  
  if (n > 0) {
    result += numberToGreekNumeralSub1000(n);
  }
  
  return result + "´";
}

function numberToGreekNumeralSub1000(n: number): string {
  let result = "";
  
  // Εκατοντάδες
  const hundreds = Math.floor(n / 100);
  const tensAndUnits = n % 100;
  
  if (hundreds > 0) {
    const hMap: Record<number, string> = {
      1: "ρ", 2: "σ", 3: "τ", 4: "υ", 5: "φ", 6: "χ", 7: "ψ", 8: "ω", 9: "ϡ"
    };
    result += hMap[hundreds] || "";
  }
  
  // Δεκάδες
  const tens = Math.floor(tensAndUnits / 10);
  const units = tensAndUnits % 10;
  
  if (tens > 0) {
    const tMap: Record<number, string> = {
      1: "ι", 2: "κ", 3: "λ", 4: "μ", 5: "ν", 6: "ξ", 7: "ο", 8: "π", 9: "ϟ"
    };
    result += tMap[tens] || "";
  }
  
  // Μονάδες
  if (units > 0) {
    const uMap: Record<number, string> = {
      1: "α", 2: "β", 3: "γ", 4: "δ", 5: "ε", 6: "ϛ", 7: "ζ", 8: "η", 9: "θ"
    };
    result += uMap[units] || "";
  }
  
  return result;
}

/**
 * Υπολογισμός ισοψηφίας ενός μεμονωμένου χαρακτήρα
 */
export function getCharIsopsephy(char: string): number {
  if (!char) return 0;
  if (CHAR_MAP[char] !== undefined) return CHAR_MAP[char];
  
  // Δοκιμή κανονικοποίησης
  const norm = normalizePolytonicGreek(char);
  if (norm && CHAR_MAP[norm] !== undefined) return CHAR_MAP[norm];
  
  return 0;
}

/**
 * Αναλυτικός υπολογισμός μιας λέξης με επιμέρους γράμματα
 */
export function calculateWordIsopsephy(word: string, indexInText = 0): WordIsopsephy {
  const letters: LetterBreakdown[] = [];
  let sum = 0;
  
  for (let i = 0; i < word.length; i++) {
    const origChar = word[i];
    const val = getCharIsopsephy(origChar);
    
    if (val > 0) {
      sum += val;
      letters.push({
        char: origChar.toUpperCase(),
        originalChar: origChar,
        value: val,
      });
    }
  }
  
  const normalized = normalizePolytonicGreek(word).replace(/[^Α-ΩϚϞϠ]/g, '');
  
  return {
    rawWord: word,
    normalizedWord: normalized,
    value: sum,
    letters,
    root: calculatePythmen(sum),
    indexInText,
  };
}

/**
 * Υπολογισμός συνολικής ισοψηφίας/gematria ενός κειμένου/λέξης
 */
export function calculateIsopsephy(
  text: string,
  system: NumberingSystem = NumberingSystem.IONIAN
): number {
  if (!text) return 0;

  if (system === NumberingSystem.ENGLISH_BASE6) {
    let sum = 0;
    const upper = text.toUpperCase();
    for (let i = 0; i < upper.length; i++) {
      const char = upper[i];
      if (ENGLISH_BASE6_VALUES[char] !== undefined) {
        sum += ENGLISH_BASE6_VALUES[char];
      }
    }
    return sum;
  }

  if (system === NumberingSystem.ENGLISH_SIMPLE) {
    let sum = 0;
    const upper = text.toUpperCase();
    for (let i = 0; i < upper.length; i++) {
      const char = upper[i];
      if (ENGLISH_SIMPLE_VALUES[char] !== undefined) {
        sum += ENGLISH_SIMPLE_VALUES[char];
      }
    }
    return sum;
  }

  // Default: Greek Ionian 27 digits
  let sum = 0;
  for (let i = 0; i < text.length; i++) {
    sum += getCharIsopsephy(text[i]);
  }
  return sum;
}

/**
 * Επιστροφή αναλυτικής λίστας γραμμάτων και τιμών για ένα κείμενο/λέξη
 */
export function getWordLettersBreakdown(
  text: string,
  system: NumberingSystem = NumberingSystem.IONIAN
): LetterBreakdown[] {
  if (!text) return [];
  const letters: LetterBreakdown[] = [];

  if (system === NumberingSystem.ENGLISH_BASE6) {
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const upperChar = char.toUpperCase();
      const val = ENGLISH_BASE6_VALUES[upperChar];
      if (val !== undefined) {
        letters.push({
          char: upperChar,
          originalChar: char,
          value: val,
        });
      }
    }
    return letters;
  }

  if (system === NumberingSystem.ENGLISH_SIMPLE) {
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const upperChar = char.toUpperCase();
      const val = ENGLISH_SIMPLE_VALUES[upperChar];
      if (val !== undefined) {
        letters.push({
          char: upperChar,
          originalChar: char,
          value: val,
        });
      }
    }
    return letters;
  }

  // Default: Greek
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const val = getCharIsopsephy(char);
    if (val > 0) {
      letters.push({
        char: char.toUpperCase(),
        originalChar: char,
        value: val,
      });
    }
  }
  return letters;
}

/**
 * Αξιολόγηση αριθμητικής έκφρασης με ελληνικές λέξεις ή αριθμούς
 * π.χ. "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ" => 1119 - 453 = 666
 * π.χ. "888 + 1480" => 2368
 */
export function evaluateIsopsephyExpression(expression: string): {
  success: boolean;
  finalValue: number;
  stepsExplanation: string;
  wordBreakdowns: WordIsopsephy[];
} {
  if (!expression || !expression.trim()) {
    return { success: false, finalValue: 0, stepsExplanation: "", wordBreakdowns: [] };
  }

  const trimmed = expression.trim();
  const wordBreakdowns: WordIsopsephy[] = [];
  
  // Split tokens by math operators: +, -, *, /, (, )
  // Match tokens (either words, numbers, or operators)
  const tokenRegex = /([+×*÷/()\-]|[0-9]+|[^\s+×*÷/()\-]+)/g;
  const matches = trimmed.match(tokenRegex) || [];
  
  let convertedExpression = "";
  const explanationParts: string[] = [];

  for (const token of matches) {
    const trimmedToken = token.trim();
    if (!trimmedToken) continue;

    if (["+", "-", "*", "×", "/", "÷", "(", ")"].includes(trimmedToken)) {
      const op = trimmedToken === "×" ? "*" : trimmedToken === "÷" ? "/" : trimmedToken;
      convertedExpression += ` ${op} `;
      explanationParts.push(trimmedToken);
    } else if (/^\d+$/.test(trimmedToken)) {
      const numVal = parseInt(trimmedToken, 10);
      convertedExpression += ` ${numVal} `;
      explanationParts.push(trimmedToken);
    } else {
      // It's a word/phrase
      const wordRes = calculateWordIsopsephy(trimmedToken);
      if (wordRes.value > 0) {
        wordBreakdowns.push(wordRes);
        convertedExpression += ` ${wordRes.value} `;
        explanationParts.push(`${trimmedToken} (${wordRes.value})`);
      } else {
        explanationParts.push(trimmedToken);
      }
    }
  }

  try {
    // Sanitize converted expression: allow only numbers, operators, parens, spaces
    if (!/^[0-9+\-*/().\s]+$/.test(convertedExpression)) {
      // Fallback: simple sum of all words
      const total = wordBreakdowns.reduce((acc, w) => acc + w.value, 0);
      return {
        success: true,
        finalValue: total,
        stepsExplanation: wordBreakdowns.map(w => `${w.rawWord} (${w.value})`).join(" + ") + (wordBreakdowns.length > 1 ? ` = ${total}` : ""),
        wordBreakdowns,
      };
    }

    // Safe mathematical evaluation
    // eslint-disable-next-line no-new-func
    const evalResult = Function(`"use strict"; return (${convertedExpression})`)();
    const finalVal = Math.round(Number(evalResult)) || 0;

    let steps = explanationParts.join(" ");
    if (wordBreakdowns.length > 0 || matches.length > 1) {
      steps += ` = ${finalVal}`;
    }

    return {
      success: true,
      finalValue: finalVal,
      stepsExplanation: steps,
      wordBreakdowns,
    };
  } catch {
    const fallbackSum = wordBreakdowns.reduce((acc, w) => acc + w.value, 0);
    return {
      success: true,
      finalValue: fallbackSum,
      stepsExplanation: wordBreakdowns.map(w => `${w.rawWord} = ${w.value}`).join(", "),
      wordBreakdowns,
    };
  }
}

/**
 * Ανάλυση πλήρους κειμένου για ισοψηφία
 */
export function analyzeGreekText(
  text: string,
  options: {
    singleWordTarget?: number;
    wordSearchQuery?: string;
    phraseTarget?: number;
    phraseLengthMin?: number;
    phraseLengthMax?: number;
    minRange?: number;
    maxRange?: number;
  } = {}
): TextAnalysisResult {
  if (!text || !text.trim()) {
    return {
      stats: {
        totalChars: 0,
        totalGreekChars: 0,
        totalWords: 0,
        uniqueWords: 0,
        totalSum: 0,
        averageWordValue: 0,
        medianWordValue: 0,
        highestWord: null,
        lowestWord: null,
      },
      words: [],
      singleMatches: [],
      phraseMatches: [],
      uniqueWordsMap: new Map<string, UniqueWordStat>(),
    };
  }

  // Split into tokens based on whitespace and punctuation
  const rawTokens = text.split(/[\s,.;:!?·—\-«»"()[\]{}]+/);
  const words: WordIsopsephy[] = [];
  const uniqueWordsMap = new Map<string, UniqueWordStat>();
  
  let totalSum = 0;
  let totalGreekChars = 0;

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i].trim();
    if (!token) continue;

    const wordObj = calculateWordIsopsephy(token, words.length);
    if (wordObj.value > 0 && wordObj.letters.length > 0) {
      words.push(wordObj);
      totalSum += wordObj.value;
      totalGreekChars += wordObj.letters.length;

      const normKey = wordObj.normalizedWord;
      const existing = uniqueWordsMap.get(normKey);
      if (existing) {
        existing.count += 1;
      } else {
        uniqueWordsMap.set(normKey, {
          count: 1,
          value: wordObj.value,
          raw: wordObj.rawWord,
          root: wordObj.root,
        });
      }
    }
  }

  // Sorted words for median and extremes
  const sortedByValue = [...words].sort((a, b) => a.value - b.value);
  const totalWords = words.length;
  const avgVal = totalWords > 0 ? Math.round(totalSum / totalWords) : 0;
  const medianVal = totalWords > 0 
    ? (totalWords % 2 === 0 
        ? Math.round((sortedByValue[totalWords / 2 - 1].value + sortedByValue[totalWords / 2].value) / 2)
        : sortedByValue[Math.floor(totalWords / 2)].value)
    : 0;

  const highestWord = sortedByValue.length > 0 ? sortedByValue[sortedByValue.length - 1] : null;
  const lowestWord = sortedByValue.length > 0 ? sortedByValue[0] : null;

  const stats: TextAnalysisStats = {
    totalChars: text.length,
    totalGreekChars,
    totalWords,
    uniqueWords: uniqueWordsMap.size,
    totalSum,
    averageWordValue: avgVal,
    medianWordValue: medianVal,
    highestWord,
    lowestWord,
  };

  // 1. Single Word Target / Query Search
  const singleMatches: WordIsopsephy[] = [];
  const singleTarget = options.singleWordTarget;
  const wordQuery = options.wordSearchQuery?.trim();
  const minRange = options.minRange;
  const maxRange = options.maxRange;

  if (wordQuery) {
    const normQ = normalizePolytonicGreek(wordQuery);
    for (const w of words) {
      if (
        w.rawWord.toLowerCase().includes(wordQuery.toLowerCase()) ||
        w.normalizedWord.includes(normQ)
      ) {
        singleMatches.push(w);
      }
    }
  } else if (singleTarget !== undefined && singleTarget > 0) {
    for (const w of words) {
      if (w.value === singleTarget) {
        singleMatches.push(w);
      }
    }
  } else if ((minRange !== undefined && minRange > 0) || (maxRange !== undefined && maxRange > 0)) {
    const min = minRange || 0;
    const max = maxRange || Infinity;
    for (const w of words) {
      if (w.value >= min && w.value <= max) {
        singleMatches.push(w);
      }
    }
  }

  // 2. Phrase Combination Target Search (Sliding Window n-grams)
  const phraseMatches: PhraseMatch[] = [];
  const phraseTarget = options.phraseTarget;
  const minLen = Math.max(2, options.phraseLengthMin || 2);
  const maxLen = Math.min(10, Math.max(minLen, options.phraseLengthMax || 6));

  if (phraseTarget !== undefined && phraseTarget > 0) {
    for (let windowLen = minLen; windowLen <= maxLen; windowLen++) {
      if (words.length < windowLen) continue;

      for (let i = 0; i <= words.length - windowLen; i++) {
        let currentWindowSum = 0;
        const windowWords: WordIsopsephy[] = [];

        for (let j = 0; j < windowLen; j++) {
          const w = words[i + j];
          currentWindowSum += w.value;
          windowWords.push(w);
        }

        if (currentWindowSum === phraseTarget) {
          const phraseText = windowWords.map(w => w.rawWord).join(" ");
          phraseMatches.push({
            id: `phrase-${i}-${i + windowLen}-${phraseTarget}`,
            phrase: phraseText,
            words: windowWords,
            value: currentWindowSum,
            root: calculatePythmen(currentWindowSum),
            startIndex: i,
            endIndex: i + windowLen - 1,
            wordCount: windowLen,
          });
        }
      }
    }
  }

  return {
    stats,
    words,
    singleMatches,
    phraseMatches,
    uniqueWordsMap,
  };
}

/**
 * Έλεγχος μαθηματικών ιδιοτήτων ενός αριθμού (Πρώτος, Τρίγωνος, Τέλειος, Διαιρέτες, Μαγικό Τετράγωνο κ.λπ.)
 */
export function getMathematicalProperties(num: number): {
  isPrime: boolean;
  isEven: boolean;
  isTriangular: boolean;
  triangularRoot?: number;
  isSquare: boolean;
  squareRoot?: number;
  divisors: number[];
  totalDivisorsCount: number;
  pythmen: number;
  magicSquareInfo?: string;
} {
  const n = Math.abs(Math.floor(num));
  if (n === 0) {
    return {
      isPrime: false,
      isEven: true,
      isTriangular: false,
      isSquare: true,
      squareRoot: 0,
      divisors: [0],
      totalDivisorsCount: 1,
      pythmen: 0,
    };
  }

  const isEven = n % 2 === 0;
  
  // Πρώτος αριθμός
  let isPrime = n > 1;
  if (n <= 1) isPrime = false;
  else if (n === 2 || n === 3) isPrime = true;
  else if (n % 2 === 0 || n % 3 === 0) isPrime = false;
  else {
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) {
        isPrime = false;
        break;
      }
    }
  }

  // Πλήρεις Διαιρέτες
  const divisors: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (i * i !== n) {
        divisors.push(n / i);
      }
    }
  }
  divisors.sort((a, b) => a - b);
  const totalDivisorsCount = divisors.length;

  // Τετράγωνος αριθμός (Square)
  const sq = Math.round(Math.sqrt(n));
  const isSquare = sq * sq === n;

  // Τρίγωνος αριθμός (Triangular: 8n + 1 is square)
  const testTri = 8 * n + 1;
  const sqTri = Math.round(Math.sqrt(testTri));
  const isTriangular = sqTri * sqTri === testTri && (sqTri - 1) % 2 === 0;
  const triangularRoot = isTriangular ? (sqTri - 1) / 2 : undefined;

  let magicSquareInfo: string | undefined = undefined;
  if (n === 666) {
    magicSquareInfo = "36ος Τρίγωνος Αριθμός (T₃₆) & Άθροισμα του Μαγικού Τετραγώνου του Ηλίου (6×6=36 κελιά, άθροισμα 1 έως 36 με 12 διαιρέτες).";
  } else if (isTriangular && triangularRoot) {
    magicSquareInfo = `${triangularRoot}ος Τρίγωνος Αριθμός (T_${triangularRoot} = Σ₁^${triangularRoot} k)`;
  }

  return {
    isPrime,
    isEven,
    isTriangular,
    triangularRoot,
    isSquare,
    squareRoot: isSquare ? sq : undefined,
    divisors,
    totalDivisorsCount,
    pythmen: calculatePythmen(n),
    magicSquareInfo,
  };
}

export interface LetterOccurrenceBreakdown {
  char: string;
  name: string;
  value: number;
  category: "monas" | "dekas" | "ekatontas";
  greekNumeral: string;
  count: number;
  totalValue: number;
  percentageOfSum: number;
  percentageOfLetters: number;
}

export interface AlphabetAndTextBreakdown {
  totalAlphabetSum: number; // 4995
  monadesSum: number; // 45
  dekadesSum: number; // 450
  ekatontadesSum: number; // 4500
  alphabetTotalLetters: number; // 27
  textTotalSum: number;
  textTotalLetters: number;
  all27Letters: LetterOccurrenceBreakdown[];
  presentLetters: LetterOccurrenceBreakdown[];
  monadesPresentSum: number;
  dekadesPresentSum: number;
  ekatontadesPresentSum: number;
}

/**
 * Υπολογισμός αναλυτικής κατανομής γραμμάτων του ελληνικού κειμένου
 * και συσχέτιση με το πλήρες σύστημα των 27 γραμμάτων της Ιωνικής Αρίθμησης (Συνολικό Άθροισμα: 4995).
 */
export function getAlphabetAndTextLetterBreakdown(text: string): AlphabetAndTextBreakdown {
  const cleaned = cleanAndNormalizePolytonic(text || "");
  const normalized = normalizePolytonicGreek(cleaned);
  
  // Count frequency of normalized uppercase letters
  const counts: Record<string, number> = {};
  for (const letter of IONIC_ALPHABET) {
    counts[letter.char] = 0;
  }
  // Handle sigma variants
  let textLettersCount = 0;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (counts[ch] !== undefined) {
      counts[ch]++;
      textLettersCount++;
    } else if (ch === 'Σ' || ch === 'σ' || ch === 'ς') {
      counts['Σ'] = (counts['Σ'] || 0) + 1;
      textLettersCount++;
    }
  }

  let textTotalSum = 0;
  let monadesPresentSum = 0;
  let dekadesPresentSum = 0;
  let ekatontadesPresentSum = 0;

  const all27Letters: LetterOccurrenceBreakdown[] = IONIC_ALPHABET.map((letter) => {
    const count = counts[letter.char] || 0;
    const totalVal = count * letter.value;
    textTotalSum += totalVal;

    if (letter.category === "monas") monadesPresentSum += totalVal;
    else if (letter.category === "dekas") dekadesPresentSum += totalVal;
    else if (letter.category === "ekatontas") ekatontadesPresentSum += totalVal;

    return {
      char: letter.char,
      name: letter.name,
      value: letter.value,
      category: letter.category,
      greekNumeral: letter.greekNumeral,
      count,
      totalValue: totalVal,
      percentageOfSum: 0,
      percentageOfLetters: 0,
    };
  });

  // Calculate percentages
  for (const item of all27Letters) {
    item.percentageOfSum = textTotalSum > 0 ? (item.totalValue / textTotalSum) * 100 : 0;
    item.percentageOfLetters = textLettersCount > 0 ? (item.count / textLettersCount) * 100 : 0;
  }

  const presentLetters = all27Letters.filter((l) => l.count > 0);

  return {
    totalAlphabetSum: 4995,
    monadesSum: 45,
    dekadesSum: 450,
    ekatontadesSum: 4500,
    alphabetTotalLetters: 27,
    textTotalSum,
    textTotalLetters: textLettersCount,
    all27Letters,
    presentLetters,
    monadesPresentSum,
    dekadesPresentSum,
    ekatontadesPresentSum,
  };
}

export interface FindCombinationsOptions {
  wordCounts: number[]; // e.g. [2], [3], [4], [5], [6]
  mode?: "uniqueWords" | "allOccurrences";
  maxResults?: number;
}

/**
 * Εντοπισμός συνδυασμών λέξεων από ολόκληρο το κείμενο (ανεξαρτήτως θέσης)
 * που δίνουν συγκεκριμένο λεξαριθμικό στόχο (π.χ. 2368, 666, 888) για 2, 3, 4, 5 ή 6 λέξεις.
 */
export function findAnywhereWordCombinations(
  words: WordIsopsephy[],
  targetSum: number,
  options: FindCombinationsOptions
): WordCombinationMatch[] {
  if (!words || words.length === 0 || !targetSum || targetSum <= 0) {
    return [];
  }

  const {
    wordCounts = [2, 3, 4],
    mode = "uniqueWords",
    maxResults = 150,
  } = options;

  const validCounts = wordCounts.filter((c) => c >= 2 && c <= 6);
  if (validCounts.length === 0) return [];

  // Filter words whose value < targetSum
  let candidateWords: WordIsopsephy[] = [];
  if (mode === "uniqueWords") {
    const seenMap = new Map<string, WordIsopsephy>();
    for (const w of words) {
      const key = w.normalizedWord || w.rawWord.toUpperCase();
      if (w.value < targetSum && !seenMap.has(key)) {
        seenMap.set(key, w);
      }
    }
    candidateWords = Array.from(seenMap.values());
  } else {
    candidateWords = words.filter((w) => w.value < targetSum);
  }

  // Sort ascending by value
  candidateWords.sort((a, b) => a.value - b.value);
  const n = candidateWords.length;
  const minK = Math.min(...validCounts);
  if (n < minK) return [];

  // Precompute suffix sums for fast branch-and-bound pruning
  const suffixSum = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    suffixSum[i] = suffixSum[i + 1] + candidateWords[i].value;
  }

  const results: WordCombinationMatch[] = [];
  const seenCombos = new Set<string>();

  // Process for each requested combination size k (2, 3, 4, 5, 6)
  for (const k of validCounts.sort((a, b) => a - b)) {
    if (results.length >= maxResults) break;
    if (n < k) continue;

    // Fast path for k = 2
    if (k === 2) {
      let left = 0;
      let right = n - 1;
      while (left < right && results.length < maxResults) {
        const sum = candidateWords[left].value + candidateWords[right].value;
        if (sum === targetSum) {
          const combo = [candidateWords[left], candidateWords[right]];
          const key = combo.map((w) => w.normalizedWord).sort().join("|");
          if (!seenCombos.has(key)) {
            seenCombos.add(key);
            results.push({
              id: `combo-2-${combo.map((w) => w.indexInText ?? 0).join("-")}-${results.length}`,
              words: combo,
              phrase: combo.map((w) => w.rawWord).join(" + "),
              value: targetSum,
              root: calculatePythmen(targetSum),
              wordCount: 2,
              indices: combo.map((w) => w.indexInText ?? 0),
              isUniqueMode: mode === "uniqueWords",
            });
          }
          left++;
          right--;
        } else if (sum < targetSum) {
          left++;
        } else {
          right--;
        }
      }
      continue;
    }

    // Fast path for k = 3
    if (k === 3) {
      for (let i = 0; i < n - 2; i++) {
        if (results.length >= maxResults) break;
        const v1 = candidateWords[i].value;
        if (v1 * 3 > targetSum) break;

        let left = i + 1;
        let right = n - 1;
        while (left < right && results.length < maxResults) {
          const sum = v1 + candidateWords[left].value + candidateWords[right].value;
          if (sum === targetSum) {
            const combo = [candidateWords[i], candidateWords[left], candidateWords[right]];
            const key = combo.map((w) => w.normalizedWord).sort().join("|");
            if (!seenCombos.has(key)) {
              seenCombos.add(key);
              results.push({
                id: `combo-3-${combo.map((w) => w.indexInText ?? 0).join("-")}-${results.length}`,
                words: combo,
                phrase: combo.map((w) => w.rawWord).join(" + "),
                value: targetSum,
                root: calculatePythmen(targetSum),
                wordCount: 3,
                indices: combo.map((w) => w.indexInText ?? 0),
                isUniqueMode: mode === "uniqueWords",
              });
            }
            left++;
            right--;
          } else if (sum < targetSum) {
            left++;
          } else {
            right--;
          }
        }
      }
      continue;
    }

    // General recursive branch-and-bound for k = 4, 5, 6
    function backtrack(startIndex: number, currentCombo: WordIsopsephy[], currentSum: number) {
      if (results.length >= maxResults) return;

      const remainingK = k - currentCombo.length;
      if (remainingK === 0) {
        if (currentSum === targetSum) {
          const key = currentCombo.map((w) => w.normalizedWord).sort().join("|");
          if (!seenCombos.has(key)) {
            seenCombos.add(key);
            results.push({
              id: `combo-${k}-${currentCombo.map((w) => w.indexInText ?? 0).join("-")}-${results.length}`,
              words: [...currentCombo],
              phrase: currentCombo.map((w) => w.rawWord).join(" + "),
              value: targetSum,
              root: calculatePythmen(targetSum),
              wordCount: k,
              indices: currentCombo.map((w) => w.indexInText ?? 0),
              isUniqueMode: mode === "uniqueWords",
            });
          }
        }
        return;
      }

      for (let i = startIndex; i <= n - remainingK; i++) {
        if (results.length >= maxResults) break;

        const val = candidateWords[i].value;
        const newSum = currentSum + val;

        // Pruning 1: Even smallest remaining elements would exceed target
        if (i + 1 < n && newSum + (remainingK - 1) * candidateWords[i + 1].value > targetSum) {
          break;
        }

        // Pruning 2: Even largest remaining elements cannot reach target
        const maxPossibleRemaining = suffixSum[n - (remainingK - 1)];
        if (newSum + maxPossibleRemaining < targetSum) {
          continue;
        }

        currentCombo.push(candidateWords[i]);
        backtrack(i + 1, currentCombo, newSum);
        currentCombo.pop();
      }
    }

    backtrack(0, [], 0);
  }

  return results;
}

export interface FindSeedCombinationsOptions {
  seedPhrase: string;
  targetTotalSum: number;
  textWordCounts?: number[]; // e.g. [1], [2], [3], [4], [5]
  mode?: "uniqueWords" | "allOccurrences";
  maxResults?: number;
}

/**
 * Εντοπισμός συμπληρωματικών συνδυασμών λέξεων από το κείμενο
 * που ενώνονται με τη «Δική μου λέξη / φράση-κλειδί» (Seed Phrase)
 * ώστε το συνολικό άθροισμα (Seed + Λέξεις Κειμένου) να ισούται ακριβώς με τον στόχο.
 */
export function findSeedWordCombinations(
  words: WordIsopsephy[],
  options: FindSeedCombinationsOptions
): SeedWordCombinationMatch[] {
  const {
    seedPhrase,
    targetTotalSum,
    textWordCounts = [1, 2, 3, 4, 5],
    mode = "uniqueWords",
    maxResults = 150,
  } = options;

  if (!words || words.length === 0 || !seedPhrase || !seedPhrase.trim() || !targetTotalSum || targetTotalSum <= 0) {
    return [];
  }

  const cleanSeed = seedPhrase.trim();
  const seedEval = evaluateIsopsephyExpression(cleanSeed);
  const seedValue = seedEval.finalValue > 0 ? seedEval.finalValue : calculateWordIsopsephy(cleanSeed).value;
  if (seedValue <= 0) return [];

  const neededSum = targetTotalSum - seedValue;
  if (neededSum <= 0) return [];

  const validCounts = textWordCounts.filter((c) => c >= 1 && c <= 5);
  if (validCounts.length === 0) return [];

  // Filter words whose value <= neededSum
  let candidateWords: WordIsopsephy[] = [];
  if (mode === "uniqueWords") {
    const seenMap = new Map<string, WordIsopsephy>();
    for (const w of words) {
      const key = w.normalizedWord || w.rawWord.toUpperCase();
      if (w.value <= neededSum && !seenMap.has(key)) {
        seenMap.set(key, w);
      }
    }
    candidateWords = Array.from(seenMap.values());
  } else {
    candidateWords = words.filter((w) => w.value <= neededSum);
  }

  candidateWords.sort((a, b) => a.value - b.value);
  const n = candidateWords.length;
  if (n === 0) return [];

  // Precompute suffix sums
  const suffixSum = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    suffixSum[i] = suffixSum[i + 1] + candidateWords[i].value;
  }

  const results: SeedWordCombinationMatch[] = [];
  const seenCombos = new Set<string>();

  const totalRoot = calculatePythmen(targetTotalSum);

  for (const k of validCounts.sort((a, b) => a - b)) {
    if (results.length >= maxResults) break;
    if (n < k) continue;

    // k = 1 (Exact 1 text word match + seed phrase)
    if (k === 1) {
      for (let i = 0; i < n; i++) {
        if (results.length >= maxResults) break;
        if (candidateWords[i].value === neededSum) {
          const w = candidateWords[i];
          const key = `seed|${w.normalizedWord}`;
          if (!seenCombos.has(key)) {
            seenCombos.add(key);
            const fullEquation = `${cleanSeed} (${seedValue}) + ${w.rawWord} (${w.value}) = ${targetTotalSum}`;
            const fullPhrase = `${cleanSeed} + ${w.rawWord}`;
            results.push({
              id: `seed-combo-1-${w.indexInText ?? 0}-${results.length}`,
              seedPhrase: cleanSeed,
              seedValue,
              textWords: [w],
              textWordsValue: w.value,
              totalValue: targetTotalSum,
              totalRoot,
              fullEquation,
              fullPhrase,
              textWordCount: 1,
              totalWordCount: 2,
              indices: [w.indexInText ?? 0],
              isUniqueMode: mode === "uniqueWords",
            });
          }
        }
      }
      continue;
    }

    // k = 2 (2 text words + seed phrase)
    if (k === 2) {
      let left = 0;
      let right = n - 1;
      while (left < right && results.length < maxResults) {
        const sum = candidateWords[left].value + candidateWords[right].value;
        if (sum === neededSum) {
          const combo = [candidateWords[left], candidateWords[right]];
          const key = `seed|` + combo.map((w) => w.normalizedWord).sort().join("|");
          if (!seenCombos.has(key)) {
            seenCombos.add(key);
            const fullEquation = `${cleanSeed} (${seedValue}) + ${combo.map((w) => `${w.rawWord} (${w.value})`).join(" + ")} = ${targetTotalSum}`;
            const fullPhrase = `${cleanSeed} + ${combo.map((w) => w.rawWord).join(" + ")}`;
            results.push({
              id: `seed-combo-2-${combo.map((w) => w.indexInText ?? 0).join("-")}-${results.length}`,
              seedPhrase: cleanSeed,
              seedValue,
              textWords: combo,
              textWordsValue: neededSum,
              totalValue: targetTotalSum,
              totalRoot,
              fullEquation,
              fullPhrase,
              textWordCount: 2,
              totalWordCount: 3,
              indices: combo.map((w) => w.indexInText ?? 0),
              isUniqueMode: mode === "uniqueWords",
            });
          }
          left++;
          right--;
        } else if (sum < neededSum) {
          left++;
        } else {
          right--;
        }
      }
      continue;
    }

    // General backtrack for k >= 3
    function backtrackSeed(startIndex: number, currentCombo: WordIsopsephy[], currentSum: number) {
      if (results.length >= maxResults) return;

      const remainingK = k - currentCombo.length;
      if (remainingK === 0) {
        if (currentSum === neededSum) {
          const key = `seed|` + currentCombo.map((w) => w.normalizedWord).sort().join("|");
          if (!seenCombos.has(key)) {
            seenCombos.add(key);
            const fullEquation = `${cleanSeed} (${seedValue}) + ${currentCombo.map((w) => `${w.rawWord} (${w.value})`).join(" + ")} = ${targetTotalSum}`;
            const fullPhrase = `${cleanSeed} + ${currentCombo.map((w) => w.rawWord).join(" + ")}`;
            results.push({
              id: `seed-combo-${k}-${currentCombo.map((w) => w.indexInText ?? 0).join("-")}-${results.length}`,
              seedPhrase: cleanSeed,
              seedValue,
              textWords: [...currentCombo],
              textWordsValue: neededSum,
              totalValue: targetTotalSum,
              totalRoot,
              fullEquation,
              fullPhrase,
              textWordCount: k,
              totalWordCount: 1 + k,
              indices: currentCombo.map((w) => w.indexInText ?? 0),
              isUniqueMode: mode === "uniqueWords",
            });
          }
        }
        return;
      }

      for (let i = startIndex; i <= n - remainingK; i++) {
        if (results.length >= maxResults) break;

        const val = candidateWords[i].value;
        const newSum = currentSum + val;

        if (i + 1 < n && newSum + (remainingK - 1) * candidateWords[i + 1].value > neededSum) {
          break;
        }

        const maxPossibleRemaining = suffixSum[n - (remainingK - 1)];
        if (newSum + maxPossibleRemaining < neededSum) {
          continue;
        }

        currentCombo.push(candidateWords[i]);
        backtrackSeed(i + 1, currentCombo, newSum);
        currentCombo.pop();
      }
    }

    backtrackSeed(0, [], 0);
  }

  return results;
}

/**
 * Μέγιστος Κοινός Διαιρέτης (ΜΚΔ / GCD)
 */
export function calculateGCD(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ / LCM)
 */
export function calculateLCM(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / calculateGCD(a, b);
}

/**
 * Πρωτογενείς Παράγοντες (Prime Factorization)
 */
export function getPrimeFactorization(n: number): { factor: number; power: number }[] {
  if (n <= 1) return [];
  const factors: { factor: number; power: number }[] = [];
  let temp = n;

  // Check 2
  if (temp % 2 === 0) {
    let power = 0;
    while (temp % 2 === 0) {
      power++;
      temp /= 2;
    }
    factors.push({ factor: 2, power });
  }

  // Check odd factors
  for (let d = 3; d * d <= temp; d += 2) {
    if (temp % d === 0) {
      let power = 0;
      while (temp % d === 0) {
        power++;
        temp /= d;
      }
      factors.push({ factor: d, power });
    }
  }

  if (temp > 1) {
    factors.push({ factor: temp, power: 1 });
  }

  return factors;
}

/**
 * Πυθαγόρειο Matrix 3x3 Κατανομής Γραμμάτων
 * 1: Μονάδες (1-9) | 2: Δεκάδες (10-90) | 3: Εκατοντάδες (100-900)
 */
export interface PythagoreanMatrixCell {
  category: "monas" | "dekas" | "ekatontas";
  element: "Γη" | "Ύδωρ" | "Αήρ" | "Πυρ";
  elementColor: string;
  rangeLabel: string;
  letters: { char: string; value: number }[];
  sum: number;
  count: number;
  percentage: number;
}

export interface PythagoreanMatrixData {
  monades: PythagoreanMatrixCell;
  dekades: PythagoreanMatrixCell;
  ekatontades: PythagoreanMatrixCell;
  totalLetters: number;
  totalSum: number;
  vowelsCount: number;
  consonantsCount: number;
  vowelHarmonicRatio: number;
  elementalSummary: Record<string, { count: number; sum: number; percentage: number }>;
}

export function calculatePythagoreanMatrix(word: string): PythagoreanMatrixData {
  const breakdown = getWordLettersBreakdown(word);
  const totalLetters = breakdown.length;
  const totalSum = calculateIsopsephy(word);

  const monadesLetters: { char: string; value: number }[] = [];
  const dekadesLetters: { char: string; value: number }[] = [];
  const ekatontadesLetters: { char: string; value: number }[] = [];

  const vowels = new Set(["Α", "Ε", "Η", "Ι", "Ο", "Υ", "Ω"]);
  let vowelsCount = 0;
  let consonantsCount = 0;

  for (const item of breakdown) {
    const upperChar = item.char.toUpperCase();
    if (vowels.has(upperChar)) {
      vowelsCount++;
    } else if (upperChar >= "Α" && upperChar <= "Ω") {
      consonantsCount++;
    }

    if (item.value >= 1 && item.value <= 9) {
      monadesLetters.push({ char: item.char, value: item.value });
    } else if (item.value >= 10 && item.value <= 90) {
      dekadesLetters.push({ char: item.char, value: item.value });
    } else if (item.value >= 100) {
      ekatontadesLetters.push({ char: item.char, value: item.value });
    }
  }

  const monadesSum = monadesLetters.reduce((acc, l) => acc + l.value, 0);
  const dekadesSum = dekadesLetters.reduce((acc, l) => acc + l.value, 0);
  const ekatontadesSum = ekatontadesLetters.reduce((acc, l) => acc + l.value, 0);

  const elementalSummary = {
    "Γη (Μονάδες)": {
      count: monadesLetters.length,
      sum: monadesSum,
      percentage: totalSum > 0 ? (monadesSum / totalSum) * 100 : 0,
    },
    "Ύδωρ / Αήρ (Δεκάδες)": {
      count: dekadesLetters.length,
      sum: dekadesSum,
      percentage: totalSum > 0 ? (dekadesSum / totalSum) * 100 : 0,
    },
    "Πυρ / Αιθήρ (Εκατοντάδες)": {
      count: ekatontadesLetters.length,
      sum: ekatontadesSum,
      percentage: totalSum > 0 ? (ekatontadesSum / totalSum) * 100 : 0,
    },
  };

  return {
    monades: {
      category: "monas",
      element: "Γη",
      elementColor: "#10b981",
      rangeLabel: "1 - 9 (Μονάδες)",
      letters: monadesLetters,
      sum: monadesSum,
      count: monadesLetters.length,
      percentage: totalSum > 0 ? (monadesSum / totalSum) * 100 : 0,
    },
    dekades: {
      category: "dekas",
      element: "Ύδωρ",
      elementColor: "#38bdf8",
      rangeLabel: "10 - 90 (Δεκάδες)",
      letters: dekadesLetters,
      sum: dekadesSum,
      count: dekadesLetters.length,
      percentage: totalSum > 0 ? (dekadesSum / totalSum) * 100 : 0,
    },
    ekatontades: {
      category: "ekatontas",
      element: "Πυρ",
      elementColor: "#f59e0b",
      rangeLabel: "100 - 900 (Εκατοντάδες)",
      letters: ekatontadesLetters,
      sum: ekatontadesSum,
      count: ekatontadesLetters.length,
      percentage: totalSum > 0 ? (ekatontadesSum / totalSum) * 100 : 0,
    },
    totalLetters,
    totalSum,
    vowelsCount,
    consonantsCount,
    vowelHarmonicRatio: consonantsCount > 0 ? Number((vowelsCount / consonantsCount).toFixed(3)) : vowelsCount,
    elementalSummary,
  };
}

/**
 * Παραγωγή Αναγραμματισμών μιας λέξης
 */
export function generatePermutations(word: string, maxCount = 60): string[] {
  const clean = word.replace(/[^Α-Ωα-ωά-ώΆ-ΏϛϞϠ]/g, "").toUpperCase();
  if (clean.length === 0) return [];
  if (clean.length === 1) return [clean];

  const results = new Set<string>();
  const letters = clean.split("");

  function permute(arr: string[], m: string[] = []) {
    if (results.size >= maxCount) return;
    if (arr.length === 0) {
      results.add(m.join(""));
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      if (results.size >= maxCount) break;
      const curr = arr.slice();
      const next = curr.splice(i, 1);
      permute(curr.slice(), m.concat(next));
    }
  }

  permute(letters);
  return Array.from(results);
}

// -------------------------------------------------------------
// ΠΟΛΥ-ΣΥΣΤΗΜΙΚΗ ΛΕΞΑΡΙΘΜΗΣΗ (MULTI-SYSTEM NUMEROLOGY)
// -------------------------------------------------------------

export const GREEK_STD_VALUES: Record<string, number> = {
  'Α': 1, 'Β': 2, 'Γ': 3, 'Δ': 4, 'Ε': 5, 'Ϛ': 6, 'Ζ': 7, 'Η': 8, 'Θ': 9,
  'Ι': 10, 'Κ': 20, 'Λ': 30, 'Μ': 40, 'Ν': 50, 'Ξ': 60, 'Ο': 70, 'Π': 80, 'Ϟ': 90,
  'Ρ': 100, 'Σ': 200, 'Τ': 300, 'Υ': 400, 'Φ': 500, 'Χ': 600, 'Ψ': 700, 'Ω': 800, 'Ϡ': 900,
};

export const GREEK_LETTERS_FULL = [
  'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ϛ', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'
];

export const GREEK_NO_SPEC_LETTERS = [
  'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'
]; // 24 γράμματα

export const LATIN_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const ENGLISH_STD_LETTERS: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 10, 'K': 20, 'L': 30, 'M': 40, 'N': 50, 'O': 60, 'P': 70, 'Q': 80, 'R': 90,
  'S': 100, 'T': 200, 'U': 300, 'V': 400, 'W': 500, 'X': 600, 'Y': 700, 'Z': 800
};

export const SYSTEM_META: Record<string, { name: string; shortName: string; desc: string; color: string }> = {
  greek_standard: {
    name: 'Ελληνικό (Μονάδες-Δεκάδες-Εκατοντάδες)',
    shortName: 'Ιωνικό Standard',
    desc: 'Α=1..Θ=9, Ι=10..Ϟ=90, Ρ=100..Ϡ=900',
    color: '#eab308',
  },
  greek_mult1: {
    name: 'Ελληνικό (Πολλαπλάσιο 1)',
    shortName: 'Ελληνικό ×1',
    desc: 'Α=1, Β=2, Γ=3 ... Ω=25 (με Ϛ)',
    color: '#10b981',
  },
  greek_mult6: {
    name: 'Ελληνικό (Πολλαπλάσιο 6)',
    shortName: 'Ελληνικό ×6',
    desc: 'Α=6, Β=12, Γ=18 ... Ω=150 (με Ϛ)',
    color: '#f97316',
  },
  greek_no_spec_6: {
    name: 'Ελληνικό χωρίς ειδικά (Πολλαπλάσια 6)',
    shortName: 'Κλασικό ×6 (24γρ.)',
    desc: 'Α=6, Β=12 ... Ω=144 (24 κλασικά γράμματα)',
    color: '#eab308',
  },
  greek_no_spec_7: {
    name: 'Ελληνικό χωρίς ειδικά (Πολλαπλάσια 7)',
    shortName: 'Κλασικό ×7 (24γρ.)',
    desc: 'Α=7, Β=14 ... Ω=168 (24 κλασικά γράμματα)',
    color: '#8b5cf6',
  },
  lat_mult1: {
    name: 'Λατινικό (Πολλαπλάσιο 1)',
    shortName: 'Latin ×1',
    desc: 'A=1, B=2 ... Z=26',
    color: '#a855f7',
  },
  lat_mult6: {
    name: 'Λατινικό (Πολλαπλάσιο 6)',
    shortName: 'Latin ×6',
    desc: 'A=6, B=12 ... Z=156',
    color: '#ec4899',
  },
  eng_standard: {
    name: 'Αγγλικό / Λατινικό (Standard)',
    shortName: 'English Standard',
    desc: 'A=1..I=9, J=10..R=90, S=100..Z=800',
    color: '#22c55e',
  },
};

/**
 * Υπολογισμός αξίας ενός χαρακτήρα βάσει επιλεγμένου συστήματος
 */
export function getCharValueInSystem(char: string, sys = 'greek_standard'): number {
  const c = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

  if (sys === 'greek_standard') {
    return GREEK_STD_VALUES[c] || getCharIsopsephy(char);
  } else if (sys === 'greek_mult1') {
    const idx = GREEK_LETTERS_FULL.indexOf(c);
    return idx !== -1 ? idx + 1 : 0;
  } else if (sys === 'greek_mult6') {
    const idx = GREEK_LETTERS_FULL.indexOf(c);
    return idx !== -1 ? (idx + 1) * 6 : 0;
  } else if (sys === 'greek_no_spec_6') {
    const idx = GREEK_NO_SPEC_LETTERS.indexOf(c);
    return idx !== -1 ? (idx + 1) * 6 : 0;
  } else if (sys === 'greek_no_spec_7') {
    const idx = GREEK_NO_SPEC_LETTERS.indexOf(c);
    return idx !== -1 ? (idx + 1) * 7 : 0;
  } else if (sys === 'lat_mult1') {
    const idx = LATIN_LETTERS.indexOf(c);
    return idx !== -1 ? idx + 1 : 0;
  } else if (sys === 'lat_mult6') {
    const idx = LATIN_LETTERS.indexOf(c);
    return idx !== -1 ? (idx + 1) * 6 : 0;
  } else if (sys === 'eng_standard') {
    return ENGLISH_STD_LETTERS[c] || 0;
  }

  return GREEK_STD_VALUES[c] || 0;
}

/**
 * Υπολογισμός συνολικής αξίας κειμένου σε οποιοδήποτε σύστημα
 */
export function calculateInSystem(text: string, sys = 'greek_standard'): number {
  if (!text) return 0;
  let sum = 0;
  for (let i = 0; i < text.length; i++) {
    sum += getCharValueInSystem(text[i], sys);
  }
  return sum;
}

/**
 * Λήψη πίνακα γραμμάτων και τιμών για το υπόμνημα ενός συστήματος
 */
export function getSystemLegendData(sys = 'greek_standard'): { char: string; val: number }[] {
  if (sys === 'greek_standard') {
    return Object.entries(GREEK_STD_VALUES).map(([char, val]) => ({ char, val }));
  } else if (sys === 'greek_mult1') {
    return GREEK_LETTERS_FULL.map((char, i) => ({ char, val: i + 1 }));
  } else if (sys === 'greek_mult6') {
    return GREEK_LETTERS_FULL.map((char, i) => ({ char, val: (i + 1) * 6 }));
  } else if (sys === 'greek_no_spec_6') {
    return GREEK_NO_SPEC_LETTERS.map((char, i) => ({ char, val: (i + 1) * 6 }));
  } else if (sys === 'greek_no_spec_7') {
    return GREEK_NO_SPEC_LETTERS.map((char, i) => ({ char, val: (i + 1) * 7 }));
  } else if (sys === 'lat_mult1') {
    return LATIN_LETTERS.map((char, i) => ({ char, val: i + 1 }));
  } else if (sys === 'lat_mult6') {
    return LATIN_LETTERS.map((char, i) => ({ char, val: (i + 1) * 6 }));
  } else if (sys === 'eng_standard') {
    return Object.entries(ENGLISH_STD_LETTERS).map(([char, val]) => ({ char, val }));
  }
  return [];
}

// -------------------------------------------------------------
// ΣΥΣΤΗΜΑ ΒΕΛΟΥΔΙΟΝ (VELOUDION CIPHER)
// -------------------------------------------------------------

export const VELOUDION_CHAR_TO_CODE: Record<string, string> = {
  'Α': '001', 'Ά': '001',
  'Β': '002',
  'Γ': '003',
  'Δ': '004',
  'Ε': '005', 'Έ': '005',
  '.': '006',
  'Ζ': '007',
  'Η': '008', 'Ή': '008',
  'Θ': '009',
  'Ι': '010', 'Ί': '010', 'Ϊ': '010',
  'Κ': '020',
  'Λ': '030',
  'Μ': '040',
  'Ν': '050',
  'Ξ': '060',
  'Ο': '070', 'Ό': '070',
  'Π': '080',
  ',': '090',
  'Ρ': '100',
  'Σ': '200', 'ς': '200',
  'Τ': '300',
  'Υ': '400', 'Ύ': '400', 'Ϋ': '400',
  'Φ': '500',
  'Χ': '600',
  'Ψ': '700',
  'Ω': '800', 'Ώ': '800',
  ' ': '900',
};

export const VELOUDION_CODE_TO_CHAR: Record<string, string> = {
  '001': 'Α',
  '002': 'Β',
  '003': 'Γ',
  '004': 'Δ',
  '005': 'Ε',
  '006': '.',
  '007': 'Ζ',
  '008': 'Η',
  '009': 'Θ',
  '010': 'Ι',
  '020': 'Κ',
  '030': 'Λ',
  '040': 'Μ',
  '050': 'Ν',
  '060': 'Ξ',
  '070': 'Ο',
  '080': 'Π',
  '090': ',',
  '100': 'Ρ',
  '200': 'Σ',
  '300': 'Τ',
  '400': 'Υ',
  '500': 'Φ',
  '600': 'Χ',
  '700': 'Ψ',
  '800': 'Ω',
  '900': ' ',
};

export function encodeVeloudionText(text: string): { code: string; chunks: { char: string; code: string }[] } {
  if (!text) return { code: '', chunks: [] };
  const upper = text.toUpperCase();
  let code = '';
  const chunks: { char: string; code: string }[] = [];

  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    const cCode = VELOUDION_CHAR_TO_CODE[char];
    if (cCode) {
      code += cCode;
      chunks.push({ char, code: cCode });
    }
  }

  return { code, chunks };
}

export function decodeVeloudionCode(codeString: string): { text: string; error?: string } {
  const clean = codeString.replace(/\s+/g, '');
  if (!clean) return { text: '' };

  if (!/^\d+$/.test(clean)) {
    return { text: '', error: 'Σφάλμα: Ο κωδικός πρέπει να περιέχει μόνο αριθμητικά ψηφία (0-9).' };
  }

  if (clean.length % 3 !== 0) {
    return { text: '', error: `Σφάλμα: Το μήκος του κωδικού (${clean.length} ψηφία) δεν είναι πολλαπλάσιο του 3.` };
  }

  let text = '';
  for (let i = 0; i < clean.length; i += 3) {
    const triplet = clean.substring(i, i + 3);
    const char = VELOUDION_CODE_TO_CHAR[triplet];
    if (char !== undefined) {
      text += char;
    } else {
      return { text: '', error: `Σφάλμα: Άγνωστη τριάδα ψηφίων «${triplet}».` };
    }
  }

  return { text };
}

/**
 * Διαχωρισμός κειμένου σε πλήρεις προτάσεις/φράσεις (μέχρι τελεία, άνω τελεία, ερωτηματικό ή θαυμαστικό)
 * και υπολογισμός πλήρους ισοψηφίας για κάθε πρόταση.
 */
export function extractSentencesWithIsopsephy(text: string): SentenceIsopsephyMatch[] {
  if (!text || !text.trim()) return [];

  // Match sentences ending in ., ;, ;, !, ?, ·, ·, :, or end of text/double newline
  // We use regex to match chunks followed by delimiters or text end
  const sentenceRegex = /[^.;;!?··:\n\r]+(?:[.;;!?··:]+|$)/g;
  const rawSegments = text.match(sentenceRegex) || [];

  const results: SentenceIsopsephyMatch[] = [];
  let globalCharCursor = 0;
  let sIndex = 0;

  for (const rawSeg of rawSegments) {
    const trimmedSeg = rawSeg.trim();
    if (!trimmedSeg) {
      globalCharCursor += rawSeg.length;
      continue;
    }

    // Identify trailing punctuation if any
    const punctMatch = trimmedSeg.match(/[.;;!?··:]+$/);
    const punctuation = punctMatch ? punctMatch[0] : "";
    const cleanSentenceText = trimmedSeg;

    // Tokenize into words
    // Match valid words in this segment
    const wordTokens = cleanSentenceText.match(/[\p{L}\p{M}ϚϛϜϝϞϟϘϙϠϡͲͳ]+/gu) || [];
    if (wordTokens.length === 0) {
      globalCharCursor += rawSeg.length;
      continue;
    }

    const words: WordIsopsephy[] = [];
    let sentenceTotalValue = 0;

    for (let wIdx = 0; wIdx < wordTokens.length; wIdx++) {
      const rawW = wordTokens[wIdx];
      const wordObj = calculateWordIsopsephy(rawW, wIdx);
      if (wordObj.value > 0) {
        words.push(wordObj);
        sentenceTotalValue += wordObj.value;
      }
    }

    if (words.length > 0 && sentenceTotalValue > 0) {
      sIndex++;
      const root = calculatePythmen(sentenceTotalValue);
      const greekNumeral = numberToGreekNumeral(sentenceTotalValue) || `${sentenceTotalValue}`;
      const startIndex = globalCharCursor;
      const endIndex = globalCharCursor + rawSeg.length;

      results.push({
        id: `sentence-${sIndex}-${sentenceTotalValue}-${Math.random().toString(36).substring(2, 7)}`,
        sentenceIndex: sIndex,
        text: cleanSentenceText,
        normalizedText: cleanSentenceText.toUpperCase(),
        value: sentenceTotalValue,
        root,
        greekNumeral,
        words,
        wordCount: words.length,
        charCount: cleanSentenceText.replace(/\s+/g, "").length,
        punctuation,
        startIndex,
        endIndex,
      });
    }

    globalCharCursor += rawSeg.length;
  }

  return results;
}


