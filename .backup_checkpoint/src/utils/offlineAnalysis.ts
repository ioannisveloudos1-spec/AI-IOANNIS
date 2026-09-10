import { GoogleGenAI } from "@google/genai";

/**
 * Known Isopsephies Map for offline matching
 */
const KNOWN_ISOPSEPHIES_MAP: Record<number, string[]> = {
  666: [
    "ΛΑΥΡΕΙΟΝ (666)",
    "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ (666)",
    "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ (1119 - 453 = 666)",
    "Η ΕΥΠΟΡΙΑ (666)",
    "Ο ΝΙΚΗΤΗΣ (666)",
  ],
  888: ["ΙΗΣΟΥΣ (888)", "Ο ΕΠΙ ΠΑΣΙ (888)", "Ο ΛΟΓΟΣ ΕΣΤΙ (888)", "Η ΑΛΗΘΕΙΑ ΤΟΥ ΘΕΟΥ (888)"],
  1480: ["ΧΡΙΣΤΟΣ (1480)", "Η ΥΙΟΘΕΣΙΑ (1480)", "ΤΟ ΠΟΤΗΡΙΟΝ ΤΗΣ ΕΥΛΟΓΙΑΣ (1480)"],
  2368: ["ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ (2368 = 888 + 1480)", "ΤΟ ΑΓΙΟΝ ΠΝΕΥΜΑ ΤΗΣ ΑΛΗΘΕΙΑΣ (2368)"],
  318: ["ΗΛΙΟΣ (318)", "ΟΙ 318 ΠΑΙΔΕΣ ΤΟΥ ΑΒΡΑΑΜ (318)", "ΤΙΕ (Τ=300, Ι=10, Ε=8 -> Τύπος Σταυρού και Ιησού)"],
  365: ["ΑΒΡΑΣΑΞ (365)"],
  453: ["ΑΜΑΡΤΙΑ (453)", "Η ΠΤΩΣΙΣ (453)"],
  1119: ["ΙΩΑΝΝΗΣ (1119)", "Ο ΕΥΑΓΓΕΛΙΣΤΗΣ (1119)", "Η ΠΡΟΦΗΤΕΙΑ ΤΟΥ ΦΩΤΟΣ (1119)"],
  801: ["ΠΕΡΙΣΤΕΡΑ (801)", "ΑΛΦΑ ΚΑΙ ΩΜΕΓΑ (1 + 800 = 801)"],
};

/**
 * Clean up any raw LaTeX symbols, code artifacts, or unescaped math commands
 */
export function cleanAndFormatAiText(rawText: string): string {
  if (!rawText) return "";

  let cleaned = rawText
    // Replace LaTeX arrows with unicode arrows
    .replace(/\\longrightarrow/g, " ➔ ")
    .replace(/\\rightarrow/g, " ➔ ")
    .replace(/\\Rightarrow/g, " ➔ ")
    .replace(/\\to/g, " ➔ ")
    // Replace font wrappers
    .replace(/\\mathbf\{([^}]+)\}/g, "**$1**")
    .replace(/\\mathbf\s+/g, "")
    .replace(/\\mathit\{([^}]+)\}/g, "*$1*")
    .replace(/\\mathrm\{([^}]+)\}/g, "$1")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\underline\{([^}]+)\}/g, "$1")
    // Replace fractions
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
    // Replace operators & dots
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\sum/g, "Σ")
    .replace(/\\dots/g, "...")
    .replace(/\\ldots/g, "...")
    .replace(/\\approx/g, "≈")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\delta/g, "δ")
    .replace(/\\pi/g, "π")
    .replace(/\\omega/g, "ω")
    // Remove brackets/delimiters
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/\$\$/g, "")
    .replace(/\$/g, "")
    // Remove residual isolated backslashes before plain letters
    .replace(/\\([a-zA-Z]+)/g, "$1");

  return cleaned.trim();
}

/**
 * Format any model name to always show ΙΩΑΝΝΗΣ branding
 */
export function formatAiModelDisplayName(modelName?: string): string {
  if (!modelName) return "Τ.Ν. ΙΩΑΝΝΗΣ 1.0";
  const lower = modelName.toLowerCase();
  if (lower.includes("offline") || lower.includes("local")) {
    return "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)";
  }
  return "Τ.Ν. ΙΩΑΝΝΗΣ 1.0";
}

/**
 * Generate rich philological and Pythagorean analysis offline without any network/server dependency
 */
export function generateLocalOfflineAnalysis(
  text?: string,
  num?: number,
  words?: string[],
  context?: string
): string {
  const val = num || 0;
  const targetText = text || "Ελληνικό Κείμενο";

  // Calculate digital root (pythmen)
  let pythmen = 0;
  if (val > 0) {
    pythmen = val % 9 === 0 ? 9 : val % 9;
  }

  // Check triangular number (8n+1 is square)
  const testTri = 8 * val + 1;
  const sqTri = Math.round(Math.sqrt(testTri));
  const isTri = sqTri * sqTri === testTri && (sqTri - 1) % 2 === 0;
  const triRoot = isTri ? (sqTri - 1) / 2 : 0;

  // Divisors
  const divisors: number[] = [];
  if (val > 0) {
    for (let i = 1; i * i <= val; i++) {
      if (val % i === 0) {
        divisors.push(i);
        if (i * i !== val) divisors.push(val / i);
      }
    }
    divisors.sort((a, b) => a - b);
  }

  const isPythagoreanQuestion = context && (context.includes("πυθαγόρειες") || context.includes("ιδιότητες"));
  const isIsopsephiesQuestion = context && (context.includes("άλλες") || context.includes("γνωστές") || context.includes("ισοψηφίες"));
  const isEtymologyQuestion = context && (context.includes("ετυμολογική") || context.includes("ιστορική") || context.includes("σημασία"));
  const isPhilosophyQuestion = context && (context.includes("φιλοσοφία") || context.includes("μυστήρια") || context.includes("αρχαία"));

  if (isPythagoreanQuestion) {
    return cleanAndFormatAiText(`## 📐 Πυθαγόρειες Μαθηματικές Ιδιότητες για το «${targetText}» (Αξία: ${val})

### 1. Πυθαγόρειος Πυθμένας (Ψηφιακή Ρίζα)
- **Πυθμένας**: **${pythmen}**
- **Ερμηνεία**: Στην πυθαγόρεια αριθμολογία, ο αριθμός ανάγεται στη μονοψήφια ρίζα του μέσω διαδοχικών αθροισμάτων. Ο πυθμένας **${pythmen}** ${
      pythmen === 1 ? "αντιπροσωπεύει τη Μονάδα, την Αρχή των πάντων, το Εν και το Αδιαίρετο." :
      pythmen === 3 ? "αντιπροσωπεύει την Τριάδα (Αρχή, Μέση, Τέλος), την πρώτη τέλεια μορφή και την αρμονία." :
      pythmen === 4 ? "αντιπροσωπεύει την Τετρακτύ των Πυθαγορείων, τη σταθερότητα και τις 4 διαστάσεις του κόσμου." :
      pythmen === 6 ? "αντιπροσωπεύει τον πρώτο Τέλειο Αριθμό (1+2+3 = 1×2×3 = 6), τη δημιουργία και τη σύζευξη." :
      pythmen === 9 ? "αντιπροσωπεύει την Εννεάδα, το πέρας των μονοψήφιων αριθμών, τον κύκλο της ολοκλήρωσης και την αναγέννηση (καθώς 9 × οποιοσδήποτε αριθμός έχει πάντα πυθμένα 9)." :
      "αντιπροσωπεύει τη δυναμική ενεργειακή ισορροπία της δεκαδικής ακολουθίας."
    }

### 2. Μαθηματική Δομή & Γεωμετρικοί Αριθμοί
- **Πλήθος Διαιρετών**: **${divisors.length}** διαιρέτες: ${divisors.slice(0, 16).join(", ")}${divisors.length > 16 ? "..." : ""}
- **Τρίγωνος Αριθμός (Τ_ν)**: ${isTri ? `Ναι! Είναι ο **${triRoot}ος τρίγωνος αριθμός** (T_${triRoot} = (${triRoot} × ${triRoot + 1}) / 2 = ${val}).` : "Δεν αποτελεί ακέραιο τρίγωνο αριθμό."}
- **Αρτιότητα**: ${val % 2 === 0 ? "Άρτιος (θηλυκός κατά τους Πυθαγόρειους, διαιρετός διά του 2)." : "Περιττός (αρσενικός κατά τους Πυθαγόρειους, αδιαίρετος διά του 2)."}
${val === 666 ? `
### ☀️ Ιδιαιτερότητα 666 (Μαγικό Τετράγωνο Ηλίου)
- Προκύπτει από το άθροισμα των πρώτων 36 ακεραίων: 1 + 2 + 3 + ... + 36 = 666.
- 36 × 37 / 2 = 18 × 37 = 666.
- Το άθροισμα κάθε γραμμής και στήλης στο μαγικό τετράγωνο 6 × 6 ισούται με 111.` : ""}`);
  }

  if (isIsopsephiesQuestion) {
    const matches = KNOWN_ISOPSEPHIES_MAP[val] || [];
    return cleanAndFormatAiText(`## ⚖️ Ισοψηφικές Αντιστοιχίες & Συσχετίσεις για την Τιμή ${val}

### 1. Εξεταζόμενο Κείμενο: «${targetText}» (Λεξάριθμος: ${val})
Στην ελληνική ισοψηφία, λέξεις ή φράσεις που παράγουν τον ίδιο αριθμό θεωρούνται **ισόψηφες** και συνδέονται νοηματικά.

### 2. Γνωστές Ισόψηφες Λέξεις & Φράσεις (Τιμή: ${val})
${matches.length > 0 ? matches.map((m) => `- **${m}**`).join("\n") : `- Δεν υπάρχει καταγεγραμμένη μεμονωμένη μονολεκτική ισοψηφία στη βασική βιβλιοθήκη για τον αριθμό ${val}. Μπορείτε να αναζητήσετε συνδυασμούς λέξεων στην καρτέλα «Αναζήτηση».`}

### 3. Πυθαγόρειος Πυθμένας
- Ο πυθμένας του αριθμού ${val} είναι **${pythmen}**. Όλες οι παραπάνω φράσεις έχουν ακριβώς το ίδιο άθροισμα και την ίδια ψηφιακή ρίζα ${pythmen}.`);
  }

  if (isEtymologyQuestion) {
    return cleanAndFormatAiText(`## 📖 Ετυμολογική & Ιστορική Σημασία: «${targetText}»

### 1. Γλωσσολογική Προσέγγιση
- **Κείμενο**: «${targetText}»
- **Λεξαριθμικό Άθροισμα**: **${val}**
- **Σύνθεση**: ${words && words.length > 0 ? words.join(" + ") : targetText}

### 2. Ιστορική & Φιλολογική Διάσταση
Στην κλασική, ελληνιστική και βυζαντινή γραμματεία, η λέξη «${targetText}» απαντάται σε θεμελιώδη κείμενα.
- Η απόδοση της αριθμητικής αξίας ${val} έγινε με βάση τους αυστηρούς κανόνες της **Ιωνικής Αρίθμησης (27 ψηφία)**.
- Τα γράμματα αναλύονται επακριβώς στις αρχαίες μονάδες, δεκάδες και εκατοντάδες.`);
  }

  if (isPhilosophyQuestion) {
    return cleanAndFormatAiText(`## 🏛️ Συσχέτιση με την Αρχαία Φιλοσοφία & τα Μυστήρια: «${targetText}» (Αξία: ${val})

### 1. Η Φιλοσοφική Θεώρηση των Αριθμών
Οι Πυθαγόρειοι και οι Πλατωνικοί (ιδίως στον *Τίμαιο*) δίδασκαν ότι *«ἀριθμῷ δέ τε πάντ' ἐπέοικεν»* (όλα τα πράγματα προσομοιάζουν στον αριθμό).

### 2. Ο Συμβολισμός του ${val} & του Πυθμένα ${pythmen}
- **Ενέργεια & Αρμονία**: Ο αριθμός **${val}** εκφράζει την ισορροπία της έκφρασης «${targetText}».
- **Μυστηριακή Παράδοση**: Στα Ελευσίνια και στα Ορφικά Μυστήρια, τα ονόματα των θεοτήτων και οι ιερές επικλήσεις επιλέγονταν βάσει της ισοψηφικής τους ακρίβειας ώστε να συντονίζονται με την κοσμική τάξη.`);
  }

  // Default general response
  return cleanAndFormatAiText(`## 📜 Φιλολογική & Ισοψηφική Ανάλυση: «${targetText}»

### 1. Αριθμητική Ταυτότητα & Ιωνική Αξία
- **Λεξαριθμικό Άθροισμα**: **${val}**
- **Πυθαγόρειος Πυθμένας (Ψηφιακή Ρίζα)**: **${pythmen}** (από διαδοχικό άθροισμα ψηφίων)
- **Πλήθος Διαιρετών**: **${divisors.length}** διαιρέτες (${divisors.slice(0, 10).join(", ")}${divisors.length > 10 ? "..." : ""})
${isTri ? `- **Τρίγωνος Αριθμός**: Ναι, είναι ο **${triRoot}ος τρίγωνος αριθμός** (T_${triRoot} = (${triRoot} × ${triRoot + 1}) / 2 = ${val}).` : ""}
${val % 2 === 0 ? "- **Αρτιότητα**: Άρτιος αριθμός." : "- **Αρτιότητα**: Περιττός αριθμός."}

### 2. Φιλολογική & Συμβολική Ερμηνεία
Η ισοψηφική αξία **${val}** εξετάζεται σύμφωνα με τους κανόνες της αρχαίας **Ιωνικής Αρίθμησης** (27 ψηφία: 9 Μονάδες, 9 Δεκάδες, 9 Εκατοντάδες).
Στην κλασική γραμματεία και την πυθαγόρεια παράδοση, οι λέξεις με κοινό λεξάριθμο θεωρούνταν ότι μοιράζονται μια βαθύτερη νοηματική ή συμβολική συγγένεια.

${context ? `*Θεματικό ερώτημα: ${context}*` : ""}
*(Η ανάλυση δημιουργήθηκε αυτόνομα από την Τ.Ν. ΙΩΑΝΝΗΣ 1.0).*`);
}

/**
 * Execute direct client-side AI call if API Key is present in app/localStorage/env
 */
export async function generateClientGeminiAnalysis(
  apiKey: string,
  text: string,
  number: number,
  words: string[],
  context: string
): Promise<{ success: boolean; analysis: string; modelUsed: string; error?: string }> {
  try {
    const keyToUse = apiKey?.trim() || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
    if (!keyToUse) {
      return {
        success: false,
        analysis: generateLocalOfflineAnalysis(text, number, words, context),
        modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)",
        error: "Δεν έχει οριστεί API Key",
      };
    }

    const ai = new GoogleGenAI({ apiKey: keyToUse });
    
    const isSpecificQuestion = context && 
      context !== "Πλήρης φιλολογική, μαθηματική και ιστορική ανάλυση" && 
      context !== "Γενική ανάλυση";

    let prompt = "";
    if (isSpecificQuestion) {
      prompt = `Το όνομά σου ως τεχνητή νοημοσύνη είναι «Τ.Ν. ΙΩΑΝΝΗΣ 1.0». Είσαι ένας κορυφαίος Έλληνας φιλόλογος, ιστορικός της αρχαίας ελληνικής γραμματείας και ερευνητής των Πυθαγορείων και της Ελληνικής Ισοψηφίας (Ιωνική Αρίθμηση 27 ψηφίων).

ΣΤΟΙΧΕΙΑ ΜΕΛΕΤΗΣ:
- Κείμενο / Λέξη / Έκφραση: "${text || ''}"
- Υπολογισμένη Ισοψηφική Αξία: ${number || ''}
- Επιμέρους λέξεις: ${JSON.stringify(words || [])}

ΣΥΓΚΕΚΡΙΜΕΝΟ ΕΡΩΤΗΜΑ ΧΡΗΣΤΗ ΠΡΟΣ ΑΠΑΝΤΗΣΗ:
👉 "${context}"

ΟΔΗΓΙΕΣ ΑΠΑΝΤΗΣΗΣ:
- Απάντησε ΑΜΕΣΑ, ΕΞΕΙΔΙΚΕΥΜΕΝΑ και ΑΝΑΛΥΤΙΚΑ στο συγκεκριμένο ερώτημα: "${context}".
- Επικεντρώσου αποκλειστικά σε αυτό το ερώτημα.
- Παράθεσε συγκεκριμένα παραδείγματα, αρχαιοελληνικές πηγές, φιλοσοφικά αποσπάσματα (Πλάτων, Πυθαγόρας, Πρόκλος, Ιάμβλιχος κ.ά.) ή μαθηματικές αναλύσεις.
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ η χρήση κώδικα LaTeX (ΜΗΝ γράφεις ποτέ \\longrightarrow, \\mathbf, $$, \\frac, \\cdot κλπ). Χρησιμοποίησε μόνο απλά σύμβολα (➔, ·, /, =, +).
- ΜΗΝ αναφέρεις ποτέ ότι είσαι μοντέλο Gemini ή Google. Είσαι αποκλειστικά η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0».
- Σημείωση: Τα 3 ιστορικά σύμβολα (Στίγμα ϛ=6, Κόππα ϟ=90, Σαμπί ϡ=900) είναι θεμελιώδη σύμβολα του κλασικού 27ψήφιου ελληνικού συστήματος γραφής και μέτρησης και δεν πρέπει ποτέ να αναφέρονται ως επείσακτα ή ξένα.
- Μορφοποίησε την απάντηση σε καλαίσθητο Markdown με τίτλους, bullet points και έντονα γράμματα.`;
    } else {
      prompt = `Το όνομά σου ως τεχνητή νοημοσύνη είναι «Τ.Ν. ΙΩΑΝΝΗΣ 1.0». Είσαι ένας κορυφαίος Έλληνας φιλόλογος, ιστορικός της αρχαίας ελληνικής γραμματείας και ερευνητής των Πυθαγορείων και της Ελληνικής Ισοψηφίας (Ιωνική Αρίθμηση 27 ψηφίων).

ΣΤΟΙΧΕΙΑ ΜΕΛΕΤΗΣ:
- Κείμενο / Λέξη / Έκφραση: "${text || ''}"
- Υπολογισμένη Ισοψηφική Αξία: ${number || ''}
- Επιμέρους λέξεις: ${JSON.stringify(words || [])}

Παρακαλώ δώσε μία ολοκληρωμένη και βαθυστόχαστη ανάλυση στα Ελληνικά που περιλαμβάνει:
1. **Φιλολογική και Ετυμολογική σημασία** των λέξεων στην αρχαία και νέα ελληνική.
2. **Αριθμητική και Πυθαγόρεια ερμηνεία** (πυθμένας/ψηφιακή ρίζα, ιδιότητες του αριθμού ${number || ''}, διαιρέτες, γεωμετρικές ιδιότητες όπως τρίγωνοι/τετράγωνοι αριθμοί).
3. **Ιστορικές και Κλασικές/Βιβλικές αναφορές** γνωστών ισοψηφιών με τον ίδιο λεξάριθμο (${number || ''}).
4. **Συμπέρασμα & Συμβολισμός**.

ΚΑΝΟΝΕΣ ΜΟΡΦΟΠΟΙΗΣΗΣ:
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ η χρήση κώδικα LaTeX (ΜΗΝ γράφεις ποτέ \\longrightarrow, \\mathbf, $$, \\frac, \\cdot κλπ). Χρησιμοποίησε μόνο απλά σύμβολα (➔, ·, /, =, +).
- ΜΗΝ αναφέρεις ποτέ ότι είσαι μοντέλο Gemini ή Google. Είσαι αποκλειστικά η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0».
- Σημείωση: Τα 3 ιστορικά σύμβολα (Στίγμα ϛ=6, Κόππα ϟ=90, Σαμπί ϡ=900) είναι θεμελιώδη σύμβολα του κλασικού 27ψήφιου ελληνικού συστήματος γραφής και μέτρησης και δεν πρέπει ποτέ να αναφέρονται ως επείσακτα ή ξένα.
- Γράψε σε καλαίσθητη ελληνική γλώσσα με καθαρή μορφοποίηση markdown.`;
    }

    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-flash-latest",
    ];

    let lastError: any = null;
    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: "Είσαι η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0», ειδικός ερευνητής της ελληνικής ισοψηφίας και φιλολογίας. Απαντάς αποκλειστικά στην ελληνική γλώσσα με υψηλή επιστημονική ακρίβεια, ευγένεια και φιλολογικό βάθος. Απαγορεύεται η χρήση συμβόλων LaTeX.",
          },
        });

        if (response && response.text) {
          return {
            success: true,
            analysis: cleanAndFormatAiText(response.text),
            modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0",
          };
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return {
      success: false,
      analysis: generateLocalOfflineAnalysis(text, number, words, context),
      modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)",
      error: lastError?.message || "Αδυναμία σύνδεσης με την υπηρεσία AI",
    };
  } catch (err: any) {
    return {
      success: false,
      analysis: generateLocalOfflineAnalysis(text, number, words, context),
      modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)",
      error: err?.message || "Σφάλμα κλήσης AI",
    };
  }
}
