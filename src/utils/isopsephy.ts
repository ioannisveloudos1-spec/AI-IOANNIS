import { IonicLetter, LetterBreakdown, WordIsopsephy, PhraseMatch, TextAnalysisStats, TextAnalysisResult, UniqueWordStat } from "../types";

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
