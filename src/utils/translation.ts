// Translation utility for English <-> Greek and Ancient -> Modern Greek
// Supports both instant offline dictionary and online AI (Gemini) translations

export type TranslationDirection = "en_to_el" | "el_to_en" | "ancient_to_modern";

// Comprehensive English -> Greek dictionary (Theological, Biblical, Gematria, Philosophical & Common)
export const EN_TO_EL_DICTIONARY: Record<string, string> = {
  // Key names & core isopsephy terms
  "JOHN": "Γιάννης",
  "TRUE": "Αληθώς",
  "JOHN TRUE": "Γιάννης Αληθώς",
  "JESUS": "Ιησούς",
  "CHRIST": "Χριστός",
  "JESUS CHRIST": "Ιησούς Χριστός",
  "GOD": "Θεός",
  "LORD": "Κύριος",
  "HOLY": "Άγιος",
  "SPIRIT": "Πνεύμα",
  "HOLY SPIRIT": "Άγιο Πνεύμα",
  "FATHER": "Πατήρ",
  "SON": "Υιός",
  "SAVIOR": "Σωτήρας",
  "SAVED": "Σωσμένος",
  "SAVED IN JESUS": "Σωσμένος εν Ιησού",
  "RIGHTEOUS": "Δίκαιος",
  "RIGHTEOUS GOD": "Δίκαιος Θεός",
  "LOVE": "Αγάπη",
  "LIGHT": "Φως",
  "THE GOD OF LIGHT": "Ο Θεός του Φωτός",
  "TRUTH": "Αλήθεια",
  "PEACE": "Ειρήνη",
  "LIFE": "Ζωή",
  "WORD": "Λόγος",
  "FAITH": "Πίστη",
  "HOPE": "Ελπίδα",
  "GRACE": "Χάρις",
  "WISDOM": "Σοφία",
  "KNOWLEDGE": "Γνώση",
  "UNDERSTANDING": "Κατανόηση",
  "MYSTERY": "Μυστήριο",
  "SOUL": "Ψυχή",
  "MIND": "Νους",
  "HEART": "Καρδιά",
  "HEAVEN": "Ουρανός",
  "EARTH": "Γη",
  "SUN": "Ήλιος",
  "MOON": "Σελήνη",
  "STAR": "Αστήρ",
  "MORNING STAR": "Πρωινός Αστήρ",
  "CROSS": "Σταυρός",
  "JESUS CROSS": "Σταυρός Ιησού",
  "GOSPEL": "Ευαγγέλιο",
  "JESUS GOSPEL": "Ευαγγέλιο Ιησού",
  "CHURCH": "Εκκλησία",
  "KING": "Βασιλεύς",
  "KINGDOM": "Βασιλεία",
  "ANGEL": "Άγγελος",
  "BEAST": "Θηρίο",
  "NUMBER": "Αριθμός",
  "COMPUTER": "Υπολογιστής",
  "CORONA": "Στέμμα",
  "VIRUS": "Ιός",
  "CORONA VIRUS": "Κορωνοϊός",
  "SACRED": "Ιερός",
  "GEOMETRY": "Γεωμετρία",
  "SACRED GEOMETRY": "Ιερά Γεωμετρία",
  "ALPHA": "Άλφα",
  "OMEGA": "Ωμέγα",
  "ALPHA AND OMEGA": "Άλφα και Ωμέγα",
  "FIRST": "Πρώτος",
  "LAST": "Έσχατος",
  "ONE": "Ένα",
  "TWO": "Δύο",
  "THREE": "Τρία",
  "ONE TWO THREE": "Ένα Δύο Τρία",
  "FOUR": "Τέσσερα",
  "FIVE": "Πέντε",
  "SIX": "Έξι",
  "SEVEN": "Επτά",
  "MESSAGE": "Μήνυμα",
  "A MESSAGE FROM GOD": "Ένα Μήνυμα από τον Θεό",
  "NAME": "Όνομα",
  "REAL": "Πραγματικός",
  "YOUR REAL NAME": "Το Πραγματικό σου Όνομα",
  "WEAPON": "Όπλο",
  "NUCLEAR": "Πυρηνικός",
  "NUCLEAR WEAPON": "Πυρηνικό Όπλο",
  "ALONE": "Μόνος",
  "WE ARE NOT ALONE": "Δεν Είμαστε Μόνοι",
  "ESSENTIAL": "Ουσιώδης",
  "INFO": "Πληροφορία",
  "ESSENTIAL INFO": "Ουσιώδεις Πληροφορίες",
  "COSMIC": "Κοσμικός",
  "LAW": "Νόμος",
  "COSMIC LAW OF GOD": "Κοσμικός Νόμος του Θεού",
  "GOD'S ANOINTING": "Το Χρίσμα του Θεού",
  "ANOINTING": "Χρίσμα",
  "POWER": "Δύναμη",
  "GLORY": "Δόξα",
  "HONOR": "Τιμή",
  "ETERNITY": "Αιωνιότητα",
  "MAN": "Άνθρωπος",
  "WOMAN": "Γυναίκα",
  "CHILD": "Παιδί",
  "WORLD": "Κόσμος",
  "TIME": "Χρόνος",
  "DAY": "Ημέρα",
  "NIGHT": "Νύχτα",
  "FIRE": "Πυρ",
  "WATER": "Ύδωρ",
  "AIR": "Αήρ",
  "BLOOD": "Αίμα",
  "PRAYER": "Προσευχή",
  "TEMPLE": "Ναός",
  "ALTAR": "Βωμός",
  "SACRIFICE": "Θυσία",
  "APOCALYPSE": "Αποκάλυψη",
  "REVELATION": "Αποκάλυψη",
  "PROPHET": "Προφήτης",
  "DISCIPLE": "Μαθητής",
  "APOSTLE": "Απόστολος",
  "RESURRECTION": "Ανάσταση",
  "CREATION": "Δημιουργία",
  "CREATOR": "Δημιουργός",
  "INFINITY": "Άπειρο",
  "PERFECTION": "Τελειότητα",
  "HARMONY": "Αρμονία",
  "CUBE": "Κύβος",
  "PYRAMID": "Πυραμίδα",
  "CIRCLE": "Κύκλος",
  "SQUARE": "Τετράγωνο",
  "TRIANGLE": "Τρίγωνο",
  "GREAT": "Μέγας",
  "GOOD": "Αγαθός",
  "BAD": "Κακός",
  "EVIL": "Πονηρός",
  "DEVIL": "Διάβολος",
  "SATAN": "Σατανάς",
  "DRAGON": "Δράκων",
  "SERPENT": "Όφις",
  "LION": "Λέων",
  "EAGLE": "Αετός",
  "LAMB": "Αμνός",
  "SHEPHERD": "Ποιμήν",
  "ROCK": "Πέτρα",
  "WATER OF LIFE": "Ύδωρ Ζωής",
  "BREAD OF LIFE": "Άρτος Ζωής",
  "BREAD": "Άρτος",
  "WINE": "Οίνος",
  "CROWN": "Στέφανος",
  "THRONE": "Θρόνος",
  "SWORD": "Ρομφαία",
  "SEAL": "Σφραγίδα",
  "BOOK": "Βιβλίο",
  "SCROLL": "Ειλητάριο",
  "CITY": "Πόλη",
  "NEW JERUSALEM": "Νέα Ιερουσαλήμ",
  "JERUSALEM": "Ιερουσαλήμ",
  "ZION": "Σιών",
  "EDEN": "Εδέμ",
  "PARADISE": "Παράδεισος",
  "HELL": "Άδης",
  "JUDGMENT": "Κρίση",
  "JUSTICE": "Δικαιοσύνη",
  "MERCY": "Έλεος",
  "COVENANT": "Διαθήκη",
  "NEW COVENANT": "Καινή Διαθήκη",
  "OLD COVENANT": "Παλαιά Διαθήκη",
  "GREECE": "Ελλάδα",
  "GREEK": "Ελληνικός",
  "ENGLISH": "Αγγλικός",
  "LATIN": "Λατινικός",
  "HEBREW": "Εβραϊκός",
  "ISRAEL": "Ισραήλ",
  "ROME": "Ρώμη",
  "ATHENS": "Αθήνα",
  "YES": "Ναι",
  "NO": "Όχι",
  "AND": "και",
  "OR": "ή",
  "THE": "ο/η/το",
  "IN": "εν",
  "OF": "του/της",
  "WITH": "μετά",
  "FOR": "υπέρ",
  "TO": "προς",
  "FROM": "από",
  "ALL": "Όλα",
  "WHO": "Ποιος",
  "WHAT": "Τι",
  "WHERE": "Πού",
  "WHEN": "Πότε",
  "WHY": "Γιατί",
  "HOW": "Πώς",
  "IS": "είναι",
  "ARE": "είναι",
  "WAS": "ήταν",
  "BE": "έσο",
  "BEAUTIFUL": "Ωραίος",
  "DIVINE": "Θείος",
  "ETERNAL": "Αιώνιος",
  "TRUE GOD": "Αληθινός Θεός",
  "SOLAR": "Ηλιακός",
  "LUNAR": "Σεληνιακός",
  "GOLD": "Χρυσός",
  "SILVER": "Άργυρος",
};

// Greek -> English dictionary
export const EL_TO_EN_DICTIONARY: Record<string, string> = {
  "ΓΙΑΝΝΗΣ": "John",
  "ΙΩΑΝΝΗΣ": "John",
  "ΑΛΗΘΩΣ": "Truly",
  "ΑΛΗΘΕΙΑ": "Truth",
  "ΙΗΣΟΥΣ": "Jesus",
  "ΧΡΙΣΤΟΣ": "Christ",
  "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ": "Jesus Christ",
  "ΘΕΟΣ": "God",
  "ΚΥΡΙΟΣ": "Lord",
  "ΑΓΙΟΣ": "Holy",
  "ΠΝΕΥΜΑ": "Spirit",
  "ΑΓΙΟ ΠΝΕΥΜΑ": "Holy Spirit",
  "ΠΑΤΗΡ": "Father",
  "ΥΙΟΣ": "Son",
  "ΣΩΤΗΡ": "Savior",
  "ΣΩΤΗΡΑΣ": "Savior",
  "ΔΙΚΑΙΟΣ": "Righteous",
  "ΑΓΑΠΗ": "Love",
  "ΦΩΣ": "Light",
  "ΕΙΡΗΝΗ": "Peace",
  "ΖΩΗ": "Life",
  "ΛΟΓΟΣ": "Word",
  "ΠΙΣΤΗ": "Faith",
  "ΕΛΠΙΔΑ": "Hope",
  "ΧΑΡΙΣ": "Grace",
  "ΣΟΦΙΑ": "Wisdom",
  "ΓΝΩΣΗ": "Knowledge",
  "ΜΥΣΤΗΡΙΟ": "Mystery",
  "ΨΥΧΗ": "Soul",
  "ΝΟΥΣ": "Mind",
  "ΚΑΡΔΙΑ": "Heart",
  "ΟΥΡΑΝΟΣ": "Heaven",
  "ΓΗ": "Earth",
  "ΗΛΙΟΣ": "Sun",
  "ΣΕΛΗΝΗ": "Moon",
  "ΑΣΤΗΡ": "Star",
  "ΣΤΑΥΡΟΣ": "Cross",
  "ΕΥΑΓΓΕΛΙΟ": "Gospel",
  "ΕΚΚΛΗΣΙΑ": "Church",
  "ΒΑΣΙΛΕΥΣ": "King",
  "ΒΑΣΙΛΕΙΑ": "Kingdom",
  "ΑΓΓΕΛΟΣ": "Angel",
  "ΘΗΡΙΟ": "Beast",
  "ΑΡΙΘΜΟΣ": "Number",
  "ΥΠΟΛΟΓΙΣΤΗΣ": "Computer",
  "ΙΕΡΟΣ": "Sacred",
  "ΓΕΩΜΕΤΡΙΑ": "Geometry",
  "ΑΛΦΑ": "Alpha",
  "ΩΜΕΓΑ": "Omega",
  "ΔΥΝΑΜΗ": "Power",
  "ΔΟΞΑ": "Glory",
  "ΑΙΩΝΙΟΤΗΤΑ": "Eternity",
  "ΑΝΘΡΩΠΟΣ": "Man / Human",
  "ΚΟΣΜΟΣ": "World / Cosmos",
  "ΧΡΟΝΟΣ": "Time",
  "ΠΡΟΦΗΤΗΣ": "Prophet",
  "ΑΝΑΣΤΑΣΗ": "Resurrection",
  "ΔΗΜΙΟΥΡΓΙΑ": "Creation",
  "ΚΥΒΟΣ": "Cube",
  "ΑΜΝΟΣ": "Lamb",
  "ΠΟΙΜΗΝ": "Shepherd",
  "ΠΕΤΡΑ": "Rock",
  "ΣΤΕΦΑΝΟΣ": "Crown",
  "ΘΡΟΝΟΣ": "Throne",
  "ΣΦΡΑΓΙΔΑ": "Seal",
  "ΒΙΒΛΙΟ": "Book",
  "ΠΟΛΗ": "City",
  "ΙΕΡΟΥΣΑΛΗΜ": "Jerusalem",
  "ΠΑΡΑΔΕΙΣΟΣ": "Paradise",
  "ΔΙΚΑΙΟΣΥΝΗ": "Justice",
  "ΕΛΛΑΔΑ": "Greece",
  "ΕΛΛΗΝΙΚΟΣ": "Greek",
};

/**
 * Checks if a string contains English / Latin alphabetical characters
 */
export function isEnglishText(text: string): boolean {
  if (!text) return false;
  return /[a-zA-Z]/.test(text);
}

/**
 * Checks if a string contains Greek alphabetical characters
 */
export function isGreekText(text: string): boolean {
  if (!text) return false;
  return /[α-ωΑ-Ωἀ-ᾯά-ώ]/.test(text);
}

/**
 * Clean and normalize text for dictionary lookup
 */
function cleanLookupKey(str: string): string {
  return str.trim().toUpperCase().replace(/[\.,;:!\?'"“”’]/g, "");
}

/**
 * Synchronous English to Greek translation using the rich local dictionary
 * with word-by-word intelligent compounding
 */
export function translateEnglishToGreekSync(englishText: string): string {
  if (!englishText || !englishText.trim()) return "";
  const trimmed = englishText.trim();
  
  // Check if already in format "TEXT (Μετάφραση)"
  const parenMatch = trimmed.match(/^([^\(]+)\s*\(([^\)]+)\)$/);
  if (parenMatch && isGreekText(parenMatch[2])) {
    return parenMatch[2].trim();
  }

  const lookupKey = cleanLookupKey(trimmed);

  // Exact phrase match
  if (EN_TO_EL_DICTIONARY[lookupKey]) {
    return EN_TO_EL_DICTIONARY[lookupKey];
  }

  // Word-by-word compounding
  const words = trimmed.split(/\s+/);
  if (words.length > 1) {
    const translatedWords = words.map((word) => {
      const wKey = cleanLookupKey(word);
      return EN_TO_EL_DICTIONARY[wKey] || word;
    });

    const result = translatedWords.join(" ");
    // If at least one word translated
    if (result !== trimmed) {
      return result;
    }
  }

  // Return single word translation if available, or original
  return EN_TO_EL_DICTIONARY[lookupKey] || trimmed;
}

/**
 * Synchronous Greek to English translation using the rich local dictionary
 */
export function translateGreekToEnglishSync(greekText: string): string {
  if (!greekText || !greekText.trim()) return "";
  const trimmed = greekText.trim();
  const lookupKey = cleanLookupKey(trimmed);

  if (EL_TO_EN_DICTIONARY[lookupKey]) {
    return EL_TO_EN_DICTIONARY[lookupKey];
  }

  const words = trimmed.split(/\s+/);
  if (words.length > 1) {
    const translatedWords = words.map((word) => {
      const wKey = cleanLookupKey(word);
      return EL_TO_EN_DICTIONARY[wKey] || word;
    });
    const result = translatedWords.join(" ");
    if (result !== trimmed) return result;
  }

  return EL_TO_EN_DICTIONARY[lookupKey] || trimmed;
}

/**
 * Formats an English item text with its Greek translation in parentheses for storage:
 * Example: "JOHN TRUE" -> "JOHN TRUE (Γιάννης Αληθώς)"
 * Matches user's exact specification: "JOHN TRUE=666 (Γιάννης Αληθως)"
 */
export function formatEnglishItemWithGreekTranslation(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;
  const trimmed = rawText.trim();

  // If text already has parenthesis with translation, do not re-wrap
  if (trimmed.includes("(") && trimmed.includes(")")) {
    return trimmed;
  }

  // Only apply to text that contains English/Latin characters
  if (!isEnglishText(trimmed)) {
    return trimmed;
  }

  const greekTranslation = translateEnglishToGreekSync(trimmed);
  if (greekTranslation && greekTranslation.toLowerCase() !== trimmed.toLowerCase()) {
    return `${trimmed} (${greekTranslation})`;
  }

  return trimmed;
}

/**
 * Extracts pure English text if stored in "ENGLISH (Ελληνικά)" format
 */
export function extractPureEnglishText(textWithParen: string): string {
  if (!textWithParen) return "";
  const match = textWithParen.match(/^([^\(]+)\s*\(([^\)]+)\)$/);
  if (match && isEnglishText(match[1])) {
    return match[1].trim();
  }
  return textWithParen.trim();
}

/**
 * Online AI-powered translation with automatic fallback to offline dictionary
 */
export async function fetchOnlineTranslation(
  text: string,
  direction: TranslationDirection = "en_to_el",
  customApiKey?: string
): Promise<{ success: boolean; translation: string; modelUsed?: string }> {
  if (!text || !text.trim()) {
    return { success: false, translation: "" };
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text.trim(),
        direction,
        customApiKey,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.translation) {
        return {
          success: true,
          translation: data.translation.trim(),
          modelUsed: data.modelUsed || "Τ.Ν. ΙΩΑΝΝΗΣ 1.0",
        };
      }
    }
  } catch (err) {
    console.warn("Online translation request failed, falling back to local dictionary:", err);
  }

  // Offline fallback
  if (direction === "en_to_el") {
    const local = translateEnglishToGreekSync(text);
    return { success: true, translation: local, modelUsed: "Τοπικό Λεξικό" };
  } else if (direction === "el_to_en") {
    const local = translateGreekToEnglishSync(text);
    return { success: true, translation: local, modelUsed: "Τοπικό Λεξικό" };
  }

  return { success: true, translation: text, modelUsed: "Αρχικό Κείμενο" };
}
