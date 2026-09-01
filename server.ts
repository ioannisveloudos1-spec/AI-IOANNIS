import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to clean raw LaTeX and math formatting
function cleanAiText(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/\\longrightarrow/g, " ➔ ")
    .replace(/\\rightarrow/g, " ➔ ")
    .replace(/\\Rightarrow/g, " ➔ ")
    .replace(/\\to/g, " ➔ ")
    .replace(/\\mathbf\{([^}]+)\}/g, "**$1**")
    .replace(/\\mathbf\s+/g, "")
    .replace(/\\mathit\{([^}]+)\}/g, "*$1*")
    .replace(/\\mathrm\{([^}]+)\}/g, "$1")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\underline\{([^}]+)\}/g, "$1")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
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
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/\$\$/g, "")
    .replace(/\$/g, "")
    .replace(/\\([a-zA-Z]+)/g, "$1")
    .trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Direct endpoint to persist custom portal audio directly to server static assets
  app.post("/api/save-portal-audio", (req, res) => {
    try {
      const { base64Data } = req.body;
      if (!base64Data || typeof base64Data !== "string") {
        return res.status(400).json({ success: false, error: "Missing audio data" });
      }
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");
      
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const targetPath = path.join(publicDir, "welcome_voice.mp3");
      fs.writeFileSync(targetPath, buffer);

      // Also copy to dist if dist exists
      const distDir = path.join(process.cwd(), "dist");
      if (fs.existsSync(distDir)) {
        const distTargetPath = path.join(distDir, "welcome_voice.mp3");
        fs.writeFileSync(distTargetPath, buffer);
      }

      return res.json({ success: true, message: "Audio saved successfully to welcome_voice.mp3" });
    } catch (err: any) {
      console.error("Failed to save audio file:", err);
      return res.status(500).json({ success: false, error: err?.message || "Internal error" });
    }
  });

  // Check if custom audio file is present
  app.get("/api/portal-audio-status", (_req, res) => {
    const filePath = path.join(process.cwd(), "public", "welcome_voice.mp3");
    const exists = fs.existsSync(filePath);
    let size = 0;
    if (exists) {
      try {
        size = fs.statSync(filePath).size;
      } catch {
        // ignore
      }
    }
    return res.json({ exists: exists && size > 1000, size });
  });

  // Direct Audio Stream endpoint (works on all mobile browsers and webviews)
  app.get("/api/portal-audio", (_req, res) => {
    const filePath = path.join(process.cwd(), "public", "welcome_voice.mp3");
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Not found");
    }
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Accept-Ranges", "bytes");
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });

  // Online AI Isopsephy Dictionary & Web Finder endpoint
  app.post("/api/online-isopsephy-search", async (req, res) => {
    try {
      const { targetNumber, customApiKey } = req.body;
      const target = parseInt(targetNumber);

      if (isNaN(target) || target <= 0) {
        return res.status(400).json({ success: false, error: "Μη έγκυρος αριθμός-στόχος." });
      }

      let ai = getGenAI();
      const hasCustomKey = customApiKey && typeof customApiKey === "string" && customApiKey.trim().length > 10;
      if (hasCustomKey) {
        ai = new GoogleGenAI({
          apiKey: customApiKey.trim(),
        });
      }

      const prompt = `Είσαι η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0», ο κορυφαίος ειδικός στην Ελληνική Ισοψηφία και την Αρχαιοελληνική, Βιβλική, Φιλοσοφική και Κλασική Γραμματεία.
Αποστολή σου είναι να βρεις και να καταγράψεις όσο το δυνατόν περισσότερες (τουλάχιστον 15-25) υπαρκτές αρχαιοελληνικές, πλατωνικές, ομηρικές, εκκλησιαστικές, θεολογικές, μυθολογικές ή φιλοσοφικές λέξεις και εκφράσεις που έχουν ΑΚΡΙΒΩΣ λεξαριθμική αξία (Ιωνική Αρίθμηση 27 ψηφίων) ίση με τον αριθμό ${target}.

ΚΑΝΟΝΕΣ ΙΣΟΨΗΦΙΑΣ (ΙΩΝΙΚΗ ΑΡΙΘΜΗΣΗ 27 ΨΗΦΙΩΝ):
- Μονάδες: Α=1, Β=2, Γ=3, Δ=4, Ε=5, Ϛ/Ϝ=6, Ζ=7, Η=8, Θ=9
- Δεκάδες: Ι=10, Κ=20, Λ=30, Μ=40, Ν=50, Ξ=60, Ο=70, Π=80, Ϟ=90
- Εκατοντάδες: Ρ=100, Σ/ς=200, Τ=300, Υ=400, Φ=500, Χ=600, Ψ=700, Ω=800, Ϡ=900
- Σημείωση: Στο τελικό σίγμα 'ς' ισχύει η αξία 200.

Παράδωσε ΜΟΝΟ μια έγκυρη δομή JSON (χωρίς markdown backticks ή άλλο περιττό κείμενο) με την εξής μορφή:
{
  "target": ${target},
  "results": [
    {
      "text": "ΛΕΞΗ Ή ΦΡΑΣΗ",
      "meaning": "Σύντομη περιγραφή / μετάφραση / σημασία στα ελληνικά",
      "source": "Πηγή (π.χ. Πλάτων, Όμηρος, Καινή Διαθήκη, Ορφικά, Πυθαγόρειοι, Αριθμοσοφία)",
      "calculatedSum": ${target}
    }
  ],
  "relatedCombinations": [
    {
      "expression": "ΛΕΞΗ_Α + ΛΕΞΗ_Β",
      "breakdown": "ΤΙΜΗ_Α + ΤΙΜΗ_Β = ${target}",
      "meaning": "Ερμηνεία σχέσης"
    }
  ]
}

ΑΠΑΓΟΡΕΥΕΤΑΙ η χρήση LaTeX. Παράθεσε πλούσια λίστα αποτελεσμάτων. Επιστροφή ΜΟΝΟ JSON.`;

      let aiResults: any[] = [];
      let aiCombinations: any[] = [];

      if (ai) {
        const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest"];
        for (const modelName of candidateModels) {
          try {
            const aiPromise = ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
              },
            });

            // 6-second timeout race per model
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("AI generation timeout")), 6000)
            );

            const response: any = await Promise.race([aiPromise, timeoutPromise]);

            if (response && response.text) {
              const parsed = JSON.parse(response.text.trim());
              if (Array.isArray(parsed.results)) {
                aiResults = parsed.results;
              }
              if (Array.isArray(parsed.relatedCombinations)) {
                aiCombinations = parsed.relatedCombinations;
              }
              break;
            }
          } catch (err: any) {
            console.warn(`Online search with ${modelName} issue:`, err?.message || err);
          }
        }
      }

      // Merge with offline curated corpus to maximize breadth and depth
      const offlineMatches = getOfflineIsopsephyMatches(target);
      const offlineCombos = getOfflineIsopsephyCombinations(target);

      const combinedMap = new Map<string, any>();

      // Add offline matches first
      for (const item of offlineMatches) {
        const key = item.text.trim().toUpperCase();
        combinedMap.set(key, item);
      }

      // Add AI matches
      for (const item of aiResults) {
        if (item && item.text) {
          const key = item.text.trim().toUpperCase();
          if (!combinedMap.has(key)) {
            combinedMap.set(key, {
              text: item.text.trim().toUpperCase(),
              meaning: item.meaning || "Ισόψηφο εύρημα",
              source: item.source || "Αρχαία / Φιλοσοφική Γραμματεία",
              calculatedSum: target,
            });
          }
        }
      }

      // Combined combinations
      const combinedCombos = [...offlineCombos];
      for (const c of aiCombinations) {
        if (c && c.expression && !combinedCombos.some(x => x.expression === c.expression)) {
          combinedCombos.push(c);
        }
      }

      const finalResults = Array.from(combinedMap.values());

      return res.json({
        success: true,
        source: aiResults.length > 0 ? "AI Online Dictionary & Corpus Search" : "Corpus Offline Library",
        target,
        results: finalResults,
        relatedCombinations: combinedCombos,
      });
    } catch (error: any) {
      console.error("Online search error:", error);
      return res.status(500).json({ success: false, error: error.message || "Σφάλμα αναζήτησης" });
    }
  });

  // AI Gemini Historical Context Endpoint for Psychogonic Cube (216 = 6³)
  app.post("/api/gemini/psychogonic-historical-context", async (req, res) => {
    try {
      const { theme = "all", customApiKey } = req.body;

      let ai = getGenAI();
      const hasCustomKey = customApiKey && typeof customApiKey === "string" && customApiKey.trim().length > 10;
      if (hasCustomKey) {
        ai = new GoogleGenAI({
          apiKey: customApiKey.trim(),
        });
      }

      const promptThemes: Record<string, string> = {
        all: "Σύνθεσε μια ολοκληρωμένη και εμβριθή ιστορική, κοσμολογική και φιλοσοφική μελέτη για τον «Ψυχογονικό Κύβο» (216 = 6 × 6 × 6 = 3³ + 4³ + 5³) στην Αρχαιοελληνική Κοσμολογία, την Πλατωνική Παράδοση (Πολιτεία 546c - Γαμήλιος Αριθμός & Περίοδος Μετεμψύχωσης 216 ετών), την Πυθαγόρεια Αριθμολογία και τη σύνδεσή του με το Ηλιακό Τετράγωνο (6×6=36, Σύνολο 666).",
        plato_nuptial: "Ανάλυσε διεξοδικά τον «Πλατωνικό Γαμήλιο & Κοσμικό Αριθμό» στην Πολιτεία (546c) και τον Τίμαιο, εξηγώντας πώς ο αριθμός 216 (6³) ορίζει την περίοδο αναγέννησης και μετενσάρκωσης των ψυχών (216 έτη / 7 περίοδοι = 1512 έτη), την αρμονία των τριών διαστάσεων της ψυχής (λογιστικόν, θυμοειδές, επιθυμητικόν) και την κοσμική γεωμετρία.",
        pythagorean_triad: "Ανάλυσε την Πυθαγόρεια Αρμονία της ισότητας 3³ + 4³ + 5³ = 6³ = 216 (27 + 64 + 125 = 216). Εξήγησε πώς οι κύβοι των πλευρών του ιερού πυθαγορείου τριγώνου (3-4-5) συνθέτουν τον τέλειο κύβο του πρώτου τέλειου αριθμού 6, καθώς και τη θεωρία των στερεών αριθμών κατά τον Νικόμαχο Γερασηνό και τον Θέωνα Σμυρναίο.",
        orphic_cosmology: "Ανάλυσε την Ορφική και Ερμητική Κοσμολογία του 216, τη σύνδεσή του με τους 216 δεκανούς/μοίρες της ουράνιας σφαίρας, τον ηλιακό κύκλο του Απόλλωνος, το Ηλιακό Μαγικό Τετράγωνο (6×6=36 κελιά, 6 επίπεδα = 216 στοιχεία) και τη σχέση του με το άθροισμα 666.",
        isopsephy_theology: "Ανάλυσε τις λεξαριθμικές και θεογονικές συσχετίσεις του 216 στην αρχαία ελληνική ισοψηφία: ΖΕΥΣ = 612 (αναγραμματισμός 216 ➔ 612), ΔΙΑΣ = 215 (216 - 1), Η ΚΑΤΑΝΟΗΣΗ = 666, και τη μυστική μαθηματική σχέση ανάμεσα στον κύβο 6³ (216) και το άθροισμα των πρώτων 36 αριθμών (666).",
      };

      const selectedPrompt = promptThemes[theme] || promptThemes.all;

      const fullPrompt = `Είσαι η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0», ο κορυφαίος επιστήμονας, ιστορικός της αρχαίας ελληνικής φιλοσοφίας και ερευνητής της Πυθαγόρειας και Πλατωνικής Κοσμολογίας.

ΑΠΟΣΤΟΛΗ:
${selectedPrompt}

ΔΟΜΗ ΑΠΑΝΤΗΣΗΣ:
1. **Εισαγωγή & Κοσμολογική Ταυτότητα του 216**: Ορισμός του «Ψυχογονικού Κύβου» (6³), ο τέλειος αριθμός 6 (1+2+3 = 1×2×3 = 6) και η σημασία του.
2. **Πλατωνικά Αποσπάσματα & Ερμηνεία**: Πλάτων (Πολιτεία 546c, Τίμαιος 35b-36b), Πρόκλος («Εις την Πολιτείαν»), Πλούταρχος («Περί Ίσιδος και Οσίριδος», «Πλατωνικά Ζητήματα»).
3. **Πυθαγόρεια Μαθηματική Αρμονία**: 3³ + 4³ + 5³ = 27 + 64 + 125 = 216 = 6³. Θεωρία των 3 στερεών κύβων και του ορθογωνίου τριγώνου.
4. **Κοσμική Περιοδικότητα & Μετενσάρκωση**: Ο κύκλος των 216 ετών (η ελάχιστη περίοδος αναγέννησης της ψυχής κατά τους Πυθαγορείους και τον Πλάτωνα) και οι 7 πλανητικές σφαίρες.
5. **Σύνδεση με το Ηλιακό Τετράγωνο (6×6=36 & 666)**: 6 στρώματα των 36 στοιχείων, η διάταξη του Ήλιου (Mensa Solis).
6. **Ισοψηφικές Αντιστοιχίες & Θεογονία**: ΖΕΥΣ (612), ΔΙΑΣ (215 = 216-1), ΑΛΗΘΕΙΑ (64 = 4³), ΝΟΥΣ (720).

ΑΥΣΤΗΡΟΙ ΚΑΝΟΝΕΣ:
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ η χρήση κώδικα LaTeX (ΜΗΝ γράφεις ποτέ \\times, \\frac, $$, \\cdot, \\mathbf κλπ). Χρησιμοποίησε μόνο καθαρά σύμβολα κειμένου (×, ·, /, =, +).
- ΜΗΝ αναφέρεις ποτέ ότι είσαι μοντέλο Gemini ή Google. Είσαι αποκλειστικά η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0».
- Παράδωσε την απάντηση σε εξαιρετικής ποιότητας ελληνικό Markdown, με σαφείς τίτλους, παραγράφους, κουκκίδες και έντονη γραφή.`;

      let generatedContent: string | null = null;
      let modelUsed = "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)";

      if (ai) {
        const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest"];
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: fullPrompt,
              config: {
                systemInstruction: "Είσαι η «Τ.Ν. ΙΩΑΝΝΗΣ 1.0», ειδικός επιστημονικός ερευνητής της αρχαιοελληνικής κοσμολογίας, του Πλάτωνα και των Πυθαγορείων. Συνθέτεις εμπεριστατωμένες ιστορικές μελέτες στην ελληνική γλώσσα χωρίς κανένα σύμβολο LaTeX.",
              },
            });

            if (response && response.text) {
              generatedContent = cleanAiText(response.text);
              modelUsed = `Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (${modelName})`;
              break;
            }
          } catch (err: any) {
            console.warn(`Psychogonic context generation error on ${modelName}:`, err?.message || err);
          }
        }
      }

      if (!generatedContent) {
        generatedContent = cleanAiText(getOfflinePsychogonicHistoricalContext(theme));
      }

      return res.json({
        success: true,
        theme,
        modelUsed,
        content: generatedContent,
      });
    } catch (error: any) {
      console.error("Psychogonic context route error:", error);
      return res.json({
        success: true,
        theme: req.body?.theme || "all",
        modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)",
        content: cleanAiText(getOfflinePsychogonicHistoricalContext(req.body?.theme)),
      });
    }
  });

  // Offline Historical & Cosmological Context Synthesizer for 216
  function getOfflinePsychogonicHistoricalContext(theme?: string): string {
    if (theme === "plato_nuptial") {
      return `## 🏛️ Ο Πλατωνικός Γαμήλιος & Κοσμικός Αριθμός (Πολιτεία 546c)

### 1. Το Αίνιγμα του Πλατωνικού Αριθμού
Στο 8ο βιβλίο της *Πολιτείας* (546b–c), ο Σωκράτης εισάγει τον μυστηριώδη «Γεωμετρικό / Γαμήλιο Αριθμό» (*«ἔστι δὲ θείῳ μὲν γεννητῷ περίοδος ἣν ἀριθμὸς περιλαμβάνει τέλειος...»*), ο οποίος καθορίζει τις περιόδους ακμής, ευγονίας και παρακμής των ανθρώπινων ψυχών και των πολιτειών.
- Ο αριθμός **216 = 6³** αποτελεί τον μικρότερο στερεό αριθμό που εμπεριέχει τις τρεις διαστάσεις της δημιουργίας (Μήκος × Πλάτος × Ύψος = 6 × 6 × 6).
- Προκύπτει από τον πρώτο **Τέλειο Αριθμό 6** (1 + 2 + 3 = 6 και 1 × 2 × 3 = 6).

### 2. Η Περίοδος Μετενσάρκωσης (216 Έτη)
Σύμφωνα με τον **Πρόκλο** στα σχόλιά του στην *Πολιτεία* και τον **Ιάμβλιχο**, ο αριθμός **216** ορίζει την ελάχιστη χρονική περίοδο ανακύκλησης της ανθρώπινης ψυχής:
- **216 έτη**: Η περίοδος επιστροφής της ψυχής στον γήινο κόσμο (ψυχογονική περίοδος).
- Επτά τέτοιες περίοδοι (7 × 216 = 1512 έτη) ολοκληρώνουν τον μείζονα επταδικό καθαρτήριο κύκλο στις πλανητικές σφαίρες.

### 3. Η Τριμερής Ψυχή & ο Κύβος 6³
Ο Πλάτων στον *Τίμαιο* και τον *Φαίδρο* διαιρεί την ψυχή σε τρία μέρη:
1. **Λογιστικόν** (Έδρα: Κεφαλή / Σύνδεση με το 3³ = 27)
2. **Θυμοειδές** (Έδρα: Θώρακας / Σύνδεση με το 4³ = 64)
3. **Επιθυμητικόν** (Έδρα: Ήπαρ / Σύνδεση με το 5³ = 125)
Η πλήρης συγκρότηση και ισορροπία της ψυχής επιτυγχάνεται όταν και τα τρία μέρη ενωθούν στον κύβο: **27 + 64 + 125 = 216 = 6³**.`;
    }

    if (theme === "pythagorean_triad") {
      return `## 📐 Πυθαγόρεια Αρμονία: 3³ + 4³ + 5³ = 6³ = 216

### 1. Το Ιερό Τρίγωνο των Πυθαγορείων (3 - 4 - 5)
Στην πυθαγόρεια γεωμετρία, το ορθογώνιο τρίγωνο με πλευρές 3, 4 και 5 (3² + 4² = 9 + 16 = 25 = 5²) ονομάζεται **Ιερό ή Κοσμικό Τρίγωνο**.
- **3 (Κάθετος)**: Συμβολίζει το αρσενικό πνεύμα και τη νόηση (Όσιρις).
- **4 (Βάση)**: Συμβολίζει τη θηλυκή δεκτική ύλη και τη φύση (Ίσις).
- **5 (Υποτείνουσα)**: Συμβολίζει τον καρπό της ένωσης, τη ζωή και τον κόσμο (Ώρος).

### 2. Η Μετάβαση από το Επίπεδο στον Στερεό Χώρο (Κύβοι)
Ενώ στο επίπεδο ισχύει 3² + 4² = 5², στον τρισδιάστατο στερεό χώρο οι κύβοι των τριών πλευρών συνθέτουν τον μοναδικό αριθμό **216**:
- **3³ = 27** (Κύβος της Τριάδος / Νους & Αρμονία)
- **4³ = 64** (Κύβος της Τετράδος / Αλήθεια: 4³ = 8² = 64)
- **5³ = 125** (Κύβος της Πεντάδος / Ζωή & Σφαιρικός Αριθμός)
- **27 + 64 + 125 = 216 = 6³**

### 3. Ο Πρώτος Τέλειος Αριθμός 6
Ο αριθμός 6 είναι ο μοναδικός αριθμός που είναι ταυτόχρονα το άθροισμα και το γινόμενο των γνησίων διαιρετών του:
- 1 + 2 + 3 = 6
- 1 × 2 × 3 = 6
Ο κύβος του (6 × 6 × 6 = 216) ονομάζεται γι' αυτόν τον λόγο **Ψυχογονικός Κύβος**, καθώς εμπεριέχει την απόλυτη αναλογική πληρότητα της δημιουργίας.`;
    }

    if (theme === "orphic_cosmology") {
      return `## ☀️ Ορφική & Ηλιακή Κοσμολογία του 216

### 1. Ηλιακό Τετράγωνο (Mensa Solis) & 6 Επίπεδα
Στην αρχαία ηλιακή παράδοση του Απόλλωνος και των Ορφικών Μυστηρίων:
- Ο Ήλιος κυβερνάται από τον αριθμό **6** (6×6 Ηλιακό Τετράγωνο με 36 κελιά).
- Το άθροισμα των αριθμών 1 έως 36 ισούται με **666** (1 + 2 + 3 + ... + 36 = 666).
- Όταν το δισδιάστατο τετράγωνο των 36 κελιών επεκταθεί σε 6 ισοϋψή επίπεδα, σχηματίζει τον **Ψυχογονικό Κύβο των 216 στοιχείων** (6 × 36 = 216).

### 2. Οι 216 Μοίρες & οι Ουράνιοι Κύκλοι
Στην αρχαία αστρονομία και αριθμοσοφία:
- Ο ζωδιακός κύκλος διαιρείται σε 36 δεκανούς των 10 μοιρών.
- Η απόσταση του ηλιακού φωτός και οι κοσμικές διαβαθμίσεις συνδέονται με τον αρμονικό συντονισμό των 216 ημερών και μοιρών.
- Ο αριθμός **216** είναι ο συχνικός παλμός (216 Hz) του ηλιακού φωτός, που αντιστοιχεί στην ανόθευτη φυσική κλίμακα (A = 432 Hz / 2 = 216 Hz).`;
    }

    if (theme === "isopsephy_theology") {
      return `## ⚖️ Ισοψηφικές Συσχετίσεις & Θεογονία (216)

### 1. ΖΕΥΣ (612) & Ψυχογονικός Κύβος (216)
Στην αρχαία ελληνική ισοψηφία:
- **ΖΕΥΣ** = Ζ(7) + Ε(5) + Υ(400) + Σ(200) = **612**
- Παρατηρήστε ότι τα ψηφία του αριθμού **612** αποτελούν ακριβή κυκλικό αναγραμματισμό των ψηφίων του Ψυχογονικού Κύβου **216** (2-1-6 ➔ 6-1-2)!
- Ο πυθμένας και των δύο είναι 9 (2+1+6 = 9 και 6+1+2 = 9).

### 2. ΔΙΑΣ (215 = 216 - 1)
- **ΔΙΑΣ** = Δ(4) + Ι(10) + Α(1) + Σ(200) = **215**
- Το όνομα ΔΙΑΣ ισούται ακριβώς με τον Ψυχογονικό Κύβο μείον τη Μονάδα: **216 - 1 = 215**.
- Συμβολίζει τον εκδηλωμένο Δία που εκπορεύεται από τον απόλυτο κοσμικό κύβο (216).

### 3. Σχέση 216 και 666
- **216 = 6 × 6 × 6** (Κυβικό γινόμενο της Εξάδος)
- **666 = Τ_36 = 1 + 2 + 3 + ... + 36** (Τριγωνικό άθροισμα του τετραγώνου 6²)
- **Η ΚΑΤΑΝΟΗΣΗ = 666**
- **ΑΛΗΘΕΙΑ = 64 = 4³** (Η κεντρική τετράς του 216: 27 + 64 + 125 = 216).`;
    }

    // Default "all" comprehensive response
    return `## 📜 Ιστορικό Πλαίσιο & Κοσμολογία του Ψυχογονικού Κύβου (216 = 6³)

### 1. Εισαγωγή & Κοσμολογική Ταυτότητα
Στην αρχαία πυθαγόρεια και πλατωνική παράδοση, ο αριθμός **216 = 6 × 6 × 6** κατέχει εξέχουσα θέση ως ο κατεξοχήν **«Ψυχογονικός Κύβος»** (ο κύβος που γεννά και συγκροτεί την ψυχή).
- Προέρχεται από τον πρώτο **Τέλειο Αριθμό 6**, ο οποίος αποτελεί ταυτόχρονα το άθροισμα και το γινόμενο των μερών του (1 + 2 + 3 = 6 και 1 × 2 × 3 = 6).
- Αποτελεί τον πρώτο στερεό κύβο που περιλαμβάνει και ενοποιεί όλα τα θεμελιώδη γεωμετρικά στοιχεία της κοσμικής αρμονίας.

### 2. Ο Πλατωνικός Γαμήλιος & Κοσμικός Αριθμός (Πολιτεία 546c)
Στο 8ο βιβλίο της *Πολιτείας* (546b–c), ο Πλάτων αναφέρεται στον περιβόητο «Γεωμετρικό Αριθμό» που καθορίζει τις γεννήσεις των άριστων ψυχών και τις περιόδους ευγονίας:
- **216 Έτη**: Κατά τον Πρόκλο (*«Εις την Πλάτωνος Πολιτείαν Υπόμνημα»*) και τον Ιάμβλιχο, 216 έτη είναι η χρονική περίοδος μετενσάρκωσης και αναγέννησης της ανθρώπινης ψυχής (*«ψυχογονική περίοδος»*).
- Επτά τέτοιες περίοδοι (7 × 216 = 1512 έτη) συνθέτουν την πλήρη επταδική κάθαρση της ψυχής στις επτά ουράνιες σφαίρες πριν την τελική ένωση με το Θείο.

### 3. Πυθαγόρεια Αρμονία: 3³ + 4³ + 5³ = 6³ = 216
Η πιο εντυπωσιακή μαθηματική ιδιότητα του 216 είναι ότι ισούται με το άθροισμα των κύβων των τριών πλευρών του **Ιερού Πυθαγορείου Τριγώνου (3, 4, 5)**:
- **3³ = 27**: Ο κύβος του πρώτου περιττού αριθμού (Νους, Πνεύμα, Αρμονία).
- **4³ = 64**: Ο κύβος της Τετράδος και ταυτόχρονα το τετράγωνο της Οκτάδος (8² = 64 = ΑΛΗΘΕΙΑ).
- **5³ = 125**: Ο κύβος της Πεντάδος (Ζωή, Γάμος αρτίου και περιττού 2+3=5, σφαιρικός αριθμός).
- **27 + 64 + 125 = 216 = 6³**.
Είναι ο **μικρότερος ακέραιος κύβος** που μπορεί να εκφραστεί ως άθροισμα τριών διαδοχικών κύβων.

### 4. Σύνδεση με το Ηλιακό Τετράγωνο (6×6) & το 666
- Η βάση του Ψυχογονικού Κύβου είναι το **Ηλιακό Τετράγωνο 6×6 = 36 κελιά** (Mensa Solis).
- Το άθροισμα των αριθμών 1 έως 36 είναι ο 36ος τρίγωνος αριθμός: **T_36 = 1 + 2 + 3 + ... + 36 = 666**.
- Ο Ψυχογονικός Κύβος αποτελείται από **6 τέτοια επίπεδα των 36 κελιών (6 × 36 = 216)**.

### 5. Ισοψηφικές Συσχετίσεις & Θεογονία
- **ΖΕΥΣ = 612**: Αναγραμματισμός των ψηφίων 2-1-6 ➔ 6-1-2 (και οι δύο με πυθμένα 9).
- **ΔΙΑΣ = 215**: Ο Ψυχογονικός Κύβος μείον τη Μονάδα (216 - 1 = 215).
- **Η ΚΑΤΑΝΟΗΣΗ = 666**: Η θεία ενόραση που εποπτεύει το ηλιακό τετράγωνο.

*(Σύνθεση από την Τ.Ν. ΙΩΑΝΝΗΣ 1.0)*`;
  }


  // Web URL Reader & Gematria / Text Extraction endpoint (supports multi-page crawling)
  app.post("/api/fetch-web-text", async (req, res) => {
    try {
      const { url, pagesCount = 1, startPage = 1 } = req.body;
      if (!url || typeof url !== "string" || !url.startsWith("http")) {
        return res.status(400).json({ success: false, error: "Μη έγκυρο URL (πρέπει να ξεκινά με http:// ή https://)." });
      }

      const isGematrix = /gematrix\.org/i.test(url);
      const isArithmosofia = /arithmosofia\.com/i.test(url);

      const fetchSinglePage = async (pageUrl: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        try {
          const response = await fetch(pageUrl, {
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,text/plain",
            },
          });
          clearTimeout(timeoutId);
          if (!response.ok) return null;
          return await response.text();
        } catch {
          clearTimeout(timeoutId);
          return null;
        }
      };

      // Base URL without page param
      const baseObj = new URL(url);
      const numPagesToFetch = Math.min(Math.max(parseInt(pagesCount, 10) || 1, 1), 25);
      const initialPageNum = Math.max(parseInt(startPage, 10) || 1, 1);

      // Build array of URLs to fetch for this batch
      const urlsToFetch: string[] = [];
      for (let p = initialPageNum; p < initialPageNum + numPagesToFetch; p++) {
        const pUrl = new URL(url);
        pUrl.searchParams.set("page", String(p));
        urlsToFetch.push(pUrl.toString());
      }

      // Fetch primary (first) page first to detect total pages and verify connectivity
      const primaryUrl = urlsToFetch[0];
      const primaryHtml = await fetchSinglePage(primaryUrl);
      if (!primaryHtml) {
        return res.status(400).json({
          success: false,
          error: `Αδυναμία λήψης της σελίδας ${initialPageNum} (${primaryUrl}) ή χρονικό όριο σύνδεσης.`,
        });
      }

      // Check total pages detected in HTML
      let detectedPagesCount = 1;
      const gematrixPagerMatch = primaryHtml.match(/href="[^"]*page=(\d+)"/g);
      if (gematrixPagerMatch) {
        const pNums = gematrixPagerMatch
          .map(m => {
            const match = m.match(/page=(\d+)/);
            return match ? parseInt(match[1], 10) : 1;
          })
          .filter(n => !isNaN(n) && n > 0);
        if (pNums.length > 0) {
          detectedPagesCount = Math.max(...pNums, 1);
        }
      } else {
        const pageNumbersMatch = primaryHtml.match(/__doPostBack\([^)]*Page\$(\d+)[^)]*\)/g) || primaryHtml.match(/>(\d+)<\/a>/g);
        if (pageNumbersMatch && pageNumbersMatch.length > 0) {
          const numbers = pageNumbersMatch
            .map(m => {
              const num = m.match(/\d+/);
              return num ? parseInt(num[0]) : 1;
            })
            .filter(n => !isNaN(n) && n > 0);
          if (numbers.length > 0) {
            detectedPagesCount = Math.max(...numbers, 1);
          }
        }
      }

      let allHtmls = [primaryHtml];

      // If user requested multi-page crawl and more than 1 page is requested in this batch
      if (urlsToFetch.length > 1) {
        const remainingUrls = urlsToFetch.slice(1);
        const fetchPromises = remainingUrls.map(u => fetchSinglePage(u));
        const extraHtmls = await Promise.all(fetchPromises);
        extraHtmls.forEach(h => {
          if (h) allHtmls.push(h);
        });
      }

      // Extract items from all fetched pages using resilient parsing
      let structuredItems: Array<{ phrase: string; jewish?: number; english?: number; simple?: number }> = [];
      const seenPhrases = new Set<string>();

      for (const htmlContent of allHtmls) {
        // Match table rows
        const trMatches = htmlContent.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        for (const tr of trMatches) {
          const tdMatches = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
          if (tdMatches && tdMatches.length >= 2) {
            const cellTexts = tdMatches.map((td) =>
              td
                .replace(/<[^>]+>/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&nbsp;/g, " ")
                .replace(/\s+/g, " ")
                .trim()
            );

            const rawPhrase = cellTexts[0];
            if (
              rawPhrase &&
              rawPhrase.length >= 2 &&
              !/^(word|phrase|gematria|jewish|english|simple|search|results)/i.test(rawPhrase)
            ) {
              const upper = rawPhrase.toUpperCase();
              if (!seenPhrases.has(upper)) {
                seenPhrases.add(upper);
                const nums = cellTexts
                  .slice(1)
                  .map((c) => parseInt(c.replace(/[^\d]/g, ""), 10))
                  .filter((n) => !isNaN(n));

                structuredItems.push({
                  phrase: rawPhrase,
                  jewish: nums[0],
                  english: nums[1] !== undefined ? nums[1] : nums[0],
                  simple: nums[2],
                });
              }
            }
          }
        }

        // Also match direct word links <a href="...word=...">Phrase</a>
        const wordLinkRegex = /<a[^>]*href="[^"]*(?:word|query)=([^"&>]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        let linkMatch;
        while ((linkMatch = wordLinkRegex.exec(htmlContent)) !== null) {
          const rawPhrase = linkMatch[2]
            .replace(/<[^>]+>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&nbsp;/g, " ")
            .trim();

          if (rawPhrase && rawPhrase.length >= 2) {
            const upper = rawPhrase.toUpperCase();
            if (!seenPhrases.has(upper)) {
              seenPhrases.add(upper);
              structuredItems.push({
                phrase: rawPhrase,
              });
            }
          }
        }
      }

      // Also clean full combined text for general isopsephy scanner
      let combinedCleanedText = "";
      for (const htmlContent of allHtmls) {
        const cleaned = htmlContent
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
          .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, " ")
          .trim();
        combinedCleanedText += " " + cleaned;
      }

      if (combinedCleanedText.length > 500000) {
        combinedCleanedText = combinedCleanedText.substring(0, 500000);
      }

      return res.json({
        success: true,
        url,
        startPage: initialPageNum,
        endPage: initialPageNum + allHtmls.length - 1,
        totalPagesDetected: detectedPagesCount,
        pagesFetched: allHtmls.length,
        isGematrix,
        structuredItemsCount: structuredItems.length,
        structuredItems: structuredItems.slice(0, 3000), // Return structured table items if parsed
        extractedText: combinedCleanedText.trim(),
      });
    } catch (error: any) {
      console.error("Fetch URL error:", error);
      return res.status(500).json({
        success: false,
        error: error.name === "AbortError" ? "Χρονικό όριο σύνδεσης (Timeout 12s)." : (error.message || "Σφάλμα ανάγνωσης ιστοσελίδας"),
      });
    }
  });

  // Offline helper for target isopsephy matches
  function getOfflineIsopsephyMatches(target: number): Array<{ text: string; meaning: string; source: string; calculatedSum: number }> {
    const defaultCorpus: Record<number, Array<{ text: string; meaning: string; source: string }>> = {
      666: [
        { text: "ΠΟΛΙΣ ΑΘΗΝΗΣ", meaning: "Η Μεγάλη Στοά και η πόλη των Αθηνών", source: "Κλασική Αριθμοσοφία (Σελ. 1)" },
        { text: "ΛΑΥΡΕΙΟΝ", meaning: "Το μεταλλευτικό και αλληγορικό κέντρο της Αττικής / Σφραγίδα", source: "Αττική Γεωγραφία & Ιστορία (Σελ. 1)" },
        { text: "Η ΕΛΛΑΔΑ ΜΕ ΤΗΝ ΑΜΕΡΙΚΗ", meaning: "Ισόψηφη σύγχρονη γεωπολιτική φράση", source: "Αριθμοσοφία (Σελ. 1)" },
        { text: "ΜΠΛΕ ΠΡΑΣΙΝΟ", meaning: "Συνδυασμός χρωματικών συμβόλων", source: "Αριθμοσοφία (Σελ. 1)" },
        { text: "Ο ΝΙΚΗΤΗΣ", meaning: "Αυτός που υπερισχύει στον πνευματικό αγώνα", source: "Κλασική Γραμματεία (Σελ. 1)" },
        { text: "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ", meaning: "Η φανέρωση του θείου φωτός", source: "Εκκλησιαστική Γραμματεία (Σελ. 1)" },
        { text: "Η ΑΓΑΠΗ ΕΣΤΙΝ", meaning: "Η ύψιστη πνευματική αγάπη και αρχή", source: "Κλασική & Θεολογική Γραμματεία (Σελ. 1)" },
        { text: "Η ΕΥΠΟΡΙΑ", meaning: "Ο πλούτος και η αφθονία", source: "Αρχαία Ελληνικά (Σελ. 1)" },
        { text: "ΑΝΑΜΑΣΗΜΕΝΟΣ", meaning: "Επαναλαμβανόμενος λόγος / αναμασημένη σκέψη", source: "Ελληνική Γλώσσα (Σελ. 1)" },
        { text: "ΑΝΕΜΟΣΚΟΠΙΟΝ", meaning: "Όργανο μέτρησης και πρόβλεψης ανέμων", source: "Αρχαία Τεχνολογία (Σελ. 1)" },
        { text: "ΓΥΝΑΙΚΕΙΑ ΑΝΑΛΟΓΙΑ", meaning: "Αρμονική αναλογία της θηλυκής αρχής", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "Δ Ε Σ Τ Ε ΜΠΑΛΑ", meaning: "Σύγχρονη λεξαριθμική έκφραση", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΔΑΒΙΔ ΑΝΤΙΘΕΟΣ", meaning: "Αντιθετική φιλοσοφική αναφορά", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΔΑΒΙΔ ΑΠΟ ΚΟΚΚΙΝΗ ΑΣΠΙΔΑ", meaning: "Αλληγορική ιστορική αναφορά (Rothschild)", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΔΑΙΜΟΝΑΚΟΥ", meaning: "Παραδοσιακό τοπωνύμιο / επώνυμο", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΔΑΙΜΟΝΙΚΗ ΑΜΑΡΤΙΑ", meaning: "Θεολογική έννοια πτώσης", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΔΕΙΓΜΑΤΟΛΟΓΙΟΝ", meaning: "Συλλογή επιλεγμένων δειγμάτων", source: "Ελληνική Ορολογία (Σελ. 2)" },
        { text: "ΔΕΚΑΠΕΝΤΑΡΙΚΟ", meaning: "Αριθμητική μονάδα του δεκαπέντε", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΔΗΜΗΤΗΡ ΚΟΡΗ", meaning: "Ελευσίνια Μυστήρια / Μητέρα και Κόρη", source: "Μυθολογία & Μυστήρια (Σελ. 2)" },
        { text: "ΔΙΑΛΑΥΡΟΝ", meaning: "Αρχαίος όρος", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΔΙΑΛΟΓΙΣΤΙΚΗ", meaning: "Τέχνη του διαλογισμού και στοχασμού", source: "Φιλοσοφία (Σελ. 2)" },
        { text: "ΔΙΑΣΠΟΡΑΣ", meaning: "Η διασπορά των Ελλήνων και των ιδεών", source: "Ιστορία (Σελ. 2)" },
        { text: "ΕΘΝΙΚΗ ΕΝΤΑΣΗ", meaning: "Σύγχρονος κοινωνιολογικός όρος", source: "Αριθμοσοφία (Σελ. 2)" },
        { text: "ΕΙΜΑΙ Ο ΘΕΗΤΗΣ", meaning: "Αυτός που ορά και ερευνά τα θεία", source: "Μυστική Φιλοσοφία (Σελ. 2)" },
        { text: "ΙΑΝΕΥΣ", meaning: "Ο αναγεννημένος άρχων των πυλών", source: "Ελληνική Μυθοπλασία (Σελ. 3)" },
        { text: "ΤΕΛΙΑΝΟΣ", meaning: "Ο τέλειος / ολοκληρωμένος μυημένος", source: "Ελληνική Ετυμολογία (Σελ. 3)" },
        { text: "ΑΡΙΑ ΔΗΜΟΚΡΑΤΙΑ", meaning: "Ευγενής και άριστη δημοκρατική τάξη", source: "Αριθμοσοφία (Σελ. 4)" },
        { text: "Ο ΑΛΗΘΙΝΟΣ ΛΟΓΟΣ", meaning: "Η αυθεντική φιλοσοφική αλήθεια", source: "Πλατωνική Φιλοσοφία (Σελ. 5)" },
        { text: "ΤΟ ΦΩΣ ΤΟΥ ΗΛΙΟΥ", meaning: "Η ηλιακή ακτινοβολία και ζωή", source: "Κλασική Ποίηση (Σελ. 6)" },
        { text: "Η ΣΟΦΙΑ ΤΟΥ ΚΟΣΜΟΥ", meaning: "Η κοσμική νοημοσύνη", source: "Στωική Φιλοσοφία (Σελ. 7)" },
      ],
      888: [
        { text: "ΙΗΣΟΥΣ", meaning: "Ο Σωτήρας / Θεάνθρωπος", source: "Καινή Διαθήκη" },
        { text: "Ο ΕΠΙ ΠΑΣΙ", meaning: "Ο υπέρτατος επί πάντων", source: "Θεολογική Γραμματεία" },
        { text: "Ο ΛΟΓΟΣ ΕΣΤΙ", meaning: "Η ουσία του θείου Λόγου", source: "Φιλοσοφικά Κείμενα" },
      ],
      1119: [
        { text: "ΙΩΑΝΝΗΣ", meaning: "Ο Ευαγγελιστής, Θεολόγος και Συγγραφέας της Αποκαλύψεως", source: "Καινή Διαθήκη" },
        { text: "Ο ΕΥΑΓΓΕΛΙΣΤΗΣ", meaning: "Αυτός που φέρει το ευαγγέλιο", source: "Εκκλησιαστική Γραμματεία" },
        { text: "Η ΠΡΟΦΗΤΕΙΑ ΤΟΥ ΦΩΤΟΣ", meaning: "Η αποκάλυψη του θείου φωτός", source: "Μυστική Θεολογία" },
      ],
      1480: [
        { text: "ΧΡΙΣΤΟΣ", meaning: "Ο Κεχρισμένος / Μεσσίας", source: "Καινή Διαθήκη" },
        { text: "Η ΥΙΟΘΕΣΙΑ", meaning: "Η πνευματική αναγνώριση υιότητας", source: "Παύλειες Επιστολές" },
      ],
      2368: [
        { text: "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ", meaning: "Ιησούς (888) + Χριστός (1480) = 2368", source: "Καινή Διαθήκη" },
      ],
      1332: [
        { text: "ΙΑΝΕΥΣ + ΤΕΛΙΑΝΟΣ", meaning: "Διπλό άθροισμα 666 + 666 = 1332", source: "Μαθηματική Σύζευξη" },
      ],
    };

    const found = defaultCorpus[target];
    if (found) {
      return found.map(item => ({ ...item, calculatedSum: target }));
    }
    return [
      { text: `ΕΥΡΗΜΑ ${target}`, meaning: `Ισόψηφη έκφραση με αξία ${target}`, source: "Γενικό Σώμα Λεξαρίθμων", calculatedSum: target }
    ];
  }

  function getOfflineIsopsephyCombinations(target: number): Array<{ expression: string; breakdown: string; meaning: string }> {
    if (target === 666) {
      return [
        { expression: "ΠΟΡΟΣ + ΠΕΝΙΑ", breakdown: "420 + 246 = 666", meaning: "Οι γονείς του Έρωτος (Πλατωνικό Συμπόσιο)" },
        { expression: "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ", breakdown: "1119 - 453 = 666", meaning: "Θεολογική διαφορά Ευαγγελιστή και Αμαρτίας" },
      ];
    }
    if (target === 1119) {
      return [
        { expression: "666 + ΑΜΑΡΤΙΑ", breakdown: "666 + 453 = 1119 (ΙΩΑΝΝΗΣ)", meaning: "Σύνδεση του αριθμού 666 με την Αμαρτία (453)" },
      ];
    }
    if (target === 2368) {
      return [
        { expression: "ΙΗΣΟΥΣ + ΧΡΙΣΤΟΣ", breakdown: "888 + 1480 = 2368", meaning: "Θεμελιώδης χριστολογική ισοψηφία" },
      ];
    }
    return [];
  }

  // AI Isopsephy analysis endpoint
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { text, number, context, words, customApiKey } = req.body;
      
      let ai = getGenAI();
      const hasCustomKey = customApiKey && typeof customApiKey === "string" && customApiKey.trim().length > 10;
      if (hasCustomKey) {
        ai = new GoogleGenAI({
          apiKey: customApiKey.trim(),
        });
      }

      // If no AI client available (no server key and no user key)
      if (!ai) {
        return res.status(200).json({
          success: true,
          modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)",
          fallback: true,
          analysis: cleanAiText(generateOfflineAnalysis(text, number, words, context)),
        });
      }

      // Construct tailored prompt based on user's specific question
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

      // Candidate valid models (following official Gemini API recommendations)
      const candidateModels = [
        "gemini-3.7-flash",
        "gemini-flash-latest",
      ];

      let lastError: any = null;
      let analysisText: string | null = null;

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
            analysisText = cleanAiText(response.text);
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} encountered an issue:`, err?.message || err);
        }
      }

      if (analysisText) {
        return res.json({
          success: true,
          analysis: analysisText,
          modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0",
          customKeyActive: !!hasCustomKey,
        });
      }

      // If user provided a custom key but it threw an error
      if (hasCustomKey && lastError) {
        console.error("Custom API Key failed with error:", lastError.message);
        return res.json({
          success: false,
          error: `Σφάλμα κλήσης AI με το προσωπικό κλειδί: ${lastError.message || "Μη έγκυρο κλειδί ή όριο χρήσης"}`,
          fallback: true,
          analysis: cleanAiText(generateOfflineAnalysis(text, number, words, context)),
        });
      }

      // Fallback
      return res.json({
        success: true,
        fallback: true,
        modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)",
        analysis: cleanAiText(generateOfflineAnalysis(text, number, words, context)),
      });

    } catch (error: any) {
      console.error("AI analysis error:", error);
      return res.status(200).json({
        success: true,
        fallback: true,
        modelUsed: "Τ.Ν. ΙΩΑΝΝΗΣ 1.0 (Offline)",
        analysis: cleanAiText(generateOfflineAnalysis(req.body?.text, req.body?.number, req.body?.words, req.body?.context)),
      });
    }
  });

  // Offline Philological & Pythagorean Analysis Generator Helper
  function generateOfflineAnalysis(
    text?: string,
    num?: number,
    words?: string[],
    context?: string
  ): string {
    const val = num || 0;
    const targetText = text || "Ελληνικό Κείμενο";
    
    // Calculate digital root
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

    // Rich Knowledge Base for Greek Words, Sacred Names, Philosophical Terms and Roots
    const knownWordsDatabase: Record<string, { etymology: string; philology: string; philosophy: string; source: string }> = {
      "ΛΑΥΡΕΙΟΝ": {
        etymology: "Από το αρχαίο «λαύρα» (στενός δρόμος, μεταλλευτική στοά). Λεξάριθμος 666 (Λ=30 + Α=1 + Υ=400 + Ρ=100 + Ε=5 + Ι=10 + Ο=70 + Ν=50 = 666).",
        philology: "Η κατεξοχήν μεταλλευτική περιοχή της Αττικής που χρηματοδότησε τον αθηναϊκό στόλο της Σαλαμίνας (Θεμιστοκλής). Στην αριθμοσοφία αποτελεί τη σφραγίδα και την πύλη της σοφίας.",
        philosophy: "Συμβολίζει τη μεταστοιχείωση της ύλης σε πνευματικό φως και άργυρο, την είσοδο στις εσωτερικές στοές της γνώσης και της αυτογνωσίας.",
        source: "Θουκυδίδης, Αριστοτέλους «Αθηναίων Πολιτεία», Αρχαία Αριθμοσοφία"
      },
      "ΙΩΑΝΝΗΣ": {
        etymology: "Από το εβραϊκό Yohanan (Χάρις Θεού), εξελληνισμένο κατά την Ιωνική Αρίθμηση σε 1119 (Ι=10+Ω=800+Α=1+Ν=50+Ν=50+Η=8+Σ=200).",
        philology: "Ο Ευαγγελιστής του Λόγου («Ἐν ἀρχῇ ἦν ὁ Λόγος») και συγγραφέας της Αποκαλύψεως στην Πάτμο, ο κατεξοχήν Θεολόγος.",
        philosophy: "Συνδέεται με το 666 μέσω της σχέσης 1119 - 453 (ΑΜΑΡΤΙΑ) = 666, αποκαλύπτοντας τη θεολογική κάθαρση.",
        source: "Καινή Διαθήκη, Κατά Ιωάννην Ευαγγέλιον, Αποκάλυψις"
      },
      "ΙΗΣΟΥΣ": {
        etymology: "Ιωνική ισοψηφική αξία 888 (Ι=10+Η=8+Σ=200+Ο=70+Υ=400+Σ=200 = 888). Πυθμένας 8+8+8=24 -> 6.",
        philology: "Ο Μεσσίας, ο Σωτήρας του κόσμου. Στην πρωτοχριστιανική γραμματεία και τον Ειρηναίο θεωρείται η απάντηση και υπέρβαση της ατελούς δημιουργίας.",
        philosophy: "Η ογδοάδα (888) εκφράζει την υπέρβαση του 7 (του παρόντος κοσμικού αιώνα) και την είσοδο στην 8η Αιώνια Ημέρα της Αναστάσεως.",
        source: "Καινή Διαθήκη, Ειρηναίος Λυώνος «Κατά Αιρέσεων»"
      },
      "ΧΡΙΣΤΟΣ": {
        etymology: "Από το ρήμα «χρίω» (ο κεχρισμένος βασιλεύς και ιερεύς). Ιωνική αξία 1480 (Χ=600+Ρ=100+Ι=10+Σ=200+Τ=300+Ο=70+Σ=200 = 1480).",
        philology: "Ισόψηφο με «Η ΥΙΟΘΕΣΙΑ» (1480) και «ΤΟ ΠΟΤΗΡΙΟΝ ΤΗΣ ΕΥΛΟΓΙΑΣ» (1480).",
        philosophy: "Μαζί με το ΙΗΣΟΥΣ δίνει: 888 + 1480 = 2368 (ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ), που ισούται με 666 × 3 + 370.",
        source: "Ευαγγέλια, Παύλειες Επιστολές"
      },
      "ΑΠΟΛΛΩΝ": {
        etymology: "Από το «α-πολύς» (ο μη πολλοστηριακός, το Έν) ή «απολλύων» (ο δαμάζων). Ιωνική αξία 1061. Πυθμένας 1+0+6+1 = 8.",
        philology: "Ο θεός του φωτός, της μουσικής αρμονίας, της ιατρικής και της προφητείας στους Δελφούς.",
        philosophy: "Στον Πλούταρχο και τους Νεοπλατωνικούς, ο Απόλλων συμβολίζει τη Μονάδα και το ανέσπερο νοητό φως.",
        source: "Δελφικά Παραγγέλματα, Πλούταρχος «Περί του Ει εν Δελφοίς»"
      },
      "ΔΙΑΣ": {
        etymology: "Από τη ρίζα *diw- (λάμπω, ουράνιο φως). Ιωνική αξία 215. Πυθμένας 8.",
        philology: "Ο πατήρ ανδρών τε θεών, η υπέρτατη συνείδηση και ο κυβερνήτης του κοσμικού νόμου.",
        philosophy: "Στον Πλάτωνα («Κρατύλος») ο Ζευς/Δίας είναι «δι' ον ζην συμβαίνει πάσι» (αυτός μέσω του οποίου υπάρχει η ζωή).",
        source: "Πλάτωνος Κρατύλος, Ησιόδου Θεογονία"
      },
      "ΖΕΥΣ": {
        etymology: "Ζ(7) + Ε(5) + Υ(400) + Σ(200) = 612. Πυθμένας 6+1+2 = 9.",
        philology: "Η άμεση ονομαστική επίκληση της αρχής της ζωής (ζέω / ζην).",
        philosophy: "Ο αριθμός 612 συνδέεται με τον κύκλο της εννεαδικής συμπλήρωσης.",
        source: "Ορφικοί Ύμνοι, Πρόκλος"
      },
      "ΑΛΗΘΕΙΑ": {
        etymology: "Α στερητικό + λήθη (αυτό που δεν λησμονείται, το ακάλυπτο). Ιωνική αξία 64 (Α=1+Λ=30+Η=8+Θ=9+Ε=5+Ι=10+Α=1 = 64 = 8² = 4³).",
        philology: "Τέλειος τετράγωνος και κυβικός αριθμός ταυτόχρονα, σύμβολο απόλυτης ακεραιότητας και θεμελίωσης.",
        philosophy: "Στον Παρμενίδη και τον Πλάτωνα, η Αλήθεια είναι η σταθερή όντως ύπαρξη απέναντι στη ρευστή δόξα.",
        source: "Παρμενίδης, Πλάτων"
      },
      "ΣΟΦΙΑ": {
        etymology: "Σ(200) + Ο(70) + Φ(500) + Ι(10) + Α(1) = 781. Πυθμένας 7+8+1 = 16 -> 7.",
        philology: "Η βαθύτερη κατανόηση των πρώτων αιτίων και αρχών των όντων.",
        philosophy: "Ο πυθμένας 7 (επτάς) είναι ο «αμήτωρ και παρθένος» αριθμός των Πυθαγορείων, ταυτιζόμενος με την Αθηνά και τη Σοφία.",
        source: "Αριστοτέλους Μεταφυσικά, Πυθαγόρειοι"
      },
      "ΑΓΑΠΗ": {
        etymology: "Α(1) + Γ(3) + Α(1) + Π(80) + Η(8) = 93. Πυθμένας 9+3 = 12 -> 3 (Τριάς).",
        philology: "Η ανιδιοτελής, πνευματική αγάπη.",
        philosophy: "Ο πυθμένας 3 εκφράζει την τριαδική κοινωνία προσώπων και την αρμονική ενότητα.",
        source: "Πλάτωνος Συμπόσιον, Α΄ Κορινθίους 13"
      },
      "ΕΡΩΣ": {
        etymology: "Ε(5) + Ρ(100) + Ω(800) + Σ(200) = 1105. Πυθμένας 1+1+0+5 = 7.",
        philology: "Η ελκτική δύναμη της ψυχής προς το Καλό και το Αγαθό.",
        philosophy: "Στο Πλατωνικό Συμπόσιο γεννιέται από τον Πόρο (420) και την Πενία (246), όπου 420 + 246 = 666!",
        source: "Πλάτωνος Συμπόσιον"
      },
      "ΠΟΛΙΣ ΑΘΗΝΗΣ": {
        etymology: "Π(80)+Ο(70)+Λ(30)+Ι(10)+Σ(200) [390] + Α(1)+Θ(9)+Η(8)+Ν(50)+Η(8)+Σ(200) [276] = 666.",
        philology: "Η αρχαία επίκληση της πρωτεύουσας του ελληνικού πνεύματος.",
        philosophy: "Εκφράζει την ηλιακή γεωμετρία της Αττικής και τον ναό του Παρθενώνος.",
        source: "Κλασική Αριθμοσοφία"
      }
    };

    // Known isopsephy matches database for offline reference
    const knownIsopsephiesMap: Record<number, string[]> = {
      666: [
        "ΛΑΥΡΕΙΟΝ (666) — Η μεταλλευτική & αλληγορική σφραγίδα της Αττικής",
        "ΠΟΛΙΣ ΑΘΗΝΗΣ (390 + 276 = 666) — Η ιστορική ονομασία της πόλης της Αθηνάς",
        "ΠΟΡΟΣ + ΠΕΝΙΑ (420 + 246 = 666) — Οι γονείς του Έρωτος στο Πλατωνικό Συμπόσιο",
        "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ (1119 - 453 = 666) — Θεολογική διαφορά Ευαγγελιστή και Πτώσεως",
        "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ (666) — Η φανέρωση του ανέσπερου θείου φωτός",
        "Η ΕΥΠΟΡΙΑ (666) — Ο πνευματικός και υλικός πλούτος της γης",
        "Ο ΝΙΚΗΤΗΣ (666) — Αυτός που κατισχύει στην πνευματική αναμέτρηση",
        "Ο ΑΛΗΘΙΝΟΣ ΛΟΓΟΣ (666) — Η αδιάψευστη φιλοσοφική αλήθεια",
        "ΤΟ ΦΩΣ ΤΟΥ ΗΛΙΟΥ (666) — Το ηλιακό μαγικό τετράγωνο 6×6"
      ],
      888: [
        "ΙΗΣΟΥΣ (888) — Ο Θεάνθρωπος, ο Σωτήρας του κόσμου",
        "Ο ΕΠΙ ΠΑΣΙ (888) — Ο υπέρτατος επί πάντων κυρίαρχος",
        "Ο ΛΟΓΟΣ ΕΣΤΙ (888) — Η αιώνια οντολογική αρχή του σύμπαντος",
        "Η ΑΛΗΘΕΙΑ ΤΟΥ ΘΕΟΥ (888) — Το πλήρωμα της θείας αποκαλύψεως"
      ],
      1119: [
        "ΙΩΑΝΝΗΣ (1119) — Ο Ευαγγελιστής, Θεολόγος & Συγγραφέας της Αποκαλύψεως",
        "Ο ΕΥΑΓΓΕΛΙΣΤΗΣ (1119) — Ο κήρυκας του χαρμόσυνου μηνύματος",
        "Η ΠΡΟΦΗΤΕΙΑ ΤΟΥ ΦΩΤΟΣ (1119) — Η μυστική όραση του μέλλοντος",
        "666 + ΑΜΑΡΤΙΑ (666 + 453 = 1119) — Η λυτρωτική μαθηματική σχέση"
      ],
      1480: [
        "ΧΡΙΣΤΟΣ (1480) — Ο Κεχρισμένος Κύριος & Βασιλεύς",
        "Η ΥΙΟΘΕΣΙΑ (1480) — Η πνευματική αναγωγή των ανθρώπων σε τέκνα Θεού",
        "ΤΟ ΠΟΤΗΡΙΟΝ ΤΗΣ ΕΥΛΟΓΙΑΣ (1480) — Το μυστήριο της θείας Ευχαριστίας"
      ],
      2368: [
        "ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ (888 + 1480 = 2368) — Το πλήρες θεανδρικό πρόσωπο",
        "ΤΟ ΑΓΙΟΝ ΠΝΕΥΜΑ ΤΗΣ ΑΛΗΘΕΙΑΣ (2368) — Ο Παράκλητος",
        "Η ΑΓΙΑ ΤΡΙΑΣ ΕΝ ΜΟΝΑΔΙ (2368) — Το ύψιστο τριαδικό δόγμα"
      ],
      318: [
        "ΗΛΙΟΣ (318) — Ο ζωοδότης αστέρας",
        "ΟΙ 318 ΠΑΙΔΕΣ ΤΟΥ ΑΒΡΑΑΜ (318) — Προτύπωση της νίκης κατά των εχθρών",
        "ΤΙΕ (Τ=300 Σταυρός, Ι=10, Ε=8 Ιησούς) — Κατά την Επιστολή Βαρνάβα"
      ],
      365: [
        "ΑΒΡΑΣΑΞ (365) — Ο ετήσιος κύκλος του ηλιακού έτους (365 ημέρες)",
        "ΜΕΙΘΡΑΣ (365) — Ο ανίκητος ήλιος των αρχαίων μυστηρίων",
        "ΝΕΙΑΛΟΣ (365) — Ο ζωογόνος ποταμός"
      ],
      453: [
        "ΑΜΑΡΤΙΑ (453) — Η αστοχία και απομάκρυνση από το θείο φως",
        "Η ΠΤΩΣΙΣ (453) — Η διάσπαση της αρχέγονης ενότητας"
      ],
      801: [
        "ΠΕΡΙΣΤΕΡΑ (801) — Το σύμβολο του Αγίου Πνεύματος",
        "ΑΛΦΑ ΚΑΙ ΩΜΕΓΑ (1 + 800 = 801) — Η Αρχή και το Τέλος του Σύμπαντος"
      ],
    };

    const cleanUpper = targetText.trim().toUpperCase().replace(/[ΆΈΉΊΌΎΏ]/g, m => ({
      "Ά": "Α", "Έ": "Ε", "Ή": "Η", "Ί": "Ι", "Ό": "Ο", "Ύ": "Υ", "Ώ": "Ω"
    }[m] || m));

    const wordInfo = knownWordsDatabase[cleanUpper];

    const isPythagoreanQuestion = context && (context.includes("πυθαγόρειες") || context.includes("ιδιότητες") || context.includes("μαθηματικ"));
    const isIsopsephiesQuestion = context && (context.includes("άλλες") || context.includes("γνωστές") || context.includes("ισοψηφίες") || context.includes("συσχετίσεις"));
    const isEtymologyQuestion = context && (context.includes("ετυμολογική") || context.includes("ιστορική") || context.includes("σημασία") || context.includes("γραμματεία"));
    const isPhilosophyQuestion = context && (context.includes("φιλοσοφία") || context.includes("μυστήρια") || context.includes("αρχαία") || context.includes("πλάτων"));

    if (isPythagoreanQuestion) {
      return `## 📐 Πυθαγόρειες Μαθηματικές Ιδιότητες για το «${targetText}» (Αξία: ${val})

### 1. Πυθαγόρειος Πυθμένας (Ψηφιακή Ρίζα)
- **Πυθμένας**: **${pythmen}**
- **Ερμηνεία**: Στην πυθαγόρεια επιστήμη των αριθμών, ο αριθμός ${val} ανάγεται στον πυθμένα **${pythmen}** (μέσω του διαδοχικού αθροίσματος των ψηφίων του: ${String(val).split('').join(' + ')} = ${pythmen}).
${
  pythmen === 1 ? "- **Μονάς (1)**: Η Αρχή πάντων, το Εν, η αδιαίρετη πηγή της ύπαρξης και του φωτός." :
  pythmen === 2 ? "- **Δυάς (2)**: Η αρχή της διαφοροποίησης, της ύλης, της κίνησης και της πολικότητας." :
  pythmen === 3 ? "- **Τριάς (3)**: Η πρώτη τέλεια μορφή (Αρχή, Μέση, Τέλος), η τριαδική αρμονία του σύμπαντος." :
  pythmen === 4 ? "- **Τετράς (4)**: Η Τετρακτύς των Πυθαγορείων (1+2+3+4 = 10), η στερεά δομή των τεσσάρων στοιχείων (Γη, Ύδωρ, Αήρ, Πυρ)." :
  pythmen === 5 ? "- **Πεντάς (5)**: Ο αριθμός της ζωής, του ανθρώπου (πεντάλφα), της σύζευξης και της πεμπτουσίας." :
  pythmen === 6 ? "- **Εξάς (6)**: Ο πρώτος τέλειος αριθμός (1+2+3 = 1×2×3 = 6), η ισορροπία της φύσης και η δημιουργία." :
  pythmen === 7 ? "- **Επτάς (7)**: Ο αμήτωρ και παρθένος αριθμός, η πνευματική κλίμακα και η μυστική ολοκλήρωση." :
  pythmen === 8 ? "- **Ογδοάς (8)**: Η πρώτη στερεά δύναμη (2³), η δικαιοσύνη και η είσοδος στον αιώνιο αιώνα." :
  pythmen === 9 ? "- **Εννεάς (9)**: Το πέρας των μονοψήφιων αριθμών, ο κύκλος της αναγέννησης και της τελείωσης (9 × ν έχει πάντα πυθμένα 9)." :
  "- **Ισορροπία**: Αρμονικός συντονισμός της δεκαδικής κλίμακας."
}

### 2. Μαθηματική Δομή & Γεωμετρικοί Αριθμοί
- **Πλήθος Διαιρετών**: **${divisors.length}** διαιρέτες: \`${divisors.slice(0, 20).join(", ")}${divisors.length > 20 ? "..." : ""}\`
- **Τρίγωνος Αριθμός (Τ_ν)**: ${isTri ? `Ναι! Είναι ο **${triRoot}ος τρίγωνος αριθμός** (T_${triRoot} = (${triRoot} × ${triRoot + 1}) / 2 = ${val}).` : "Δεν αποτελεί ακέραιο τρίγωνο αριθμό."}
- **Αρτιότητα**: ${val % 2 === 0 ? "Άρτιος (θηλυκός κατά τους Πυθαγορείους, δεκτικός διαιρέσεως)." : "Περιττός (αρσενικός κατά τους Πυθαγορείους, αδιαίρετος και αδιάσπαστος)."}
${val === 666 ? `
### ☀️ Ιδιαιτερότητα 666 (Μαγικό Τετράγωνο Ηλίου)
- Προκύπτει από το άθροισμα όλων των πρώτων 36 ακεραίων: 1 + 2 + 3 + ... + 36 = 666 = T_36.
- 36 × 37 / 2 = 18 × 37 = 666.
- Το άθροισμα κάθε γραμμής, στήλης και διαγωνίου στο ηλιακό τετράγωνο 6×6 ισούται με 111 (και 6 × 111 = 666).` : ""}`;
    }

    if (isIsopsephiesQuestion) {
      const matches = knownIsopsephiesMap[val] || [];
      return `## ⚖️ Ισοψηφικές Αντιστοιχίες & Συσχετίσεις για την Τιμή ${val}

### 1. Εξεταζόμενο Κείμενο: «${targetText}» (Λεξάριθμος: ${val})
Στην ελληνική ισοψηφία, λέξεις ή φράσεις που παράγουν τον ίδιο αριθμό θεωρούνται **ισόψηφες** και συνδέονται νοηματικά και οντολογικά.

### 2. Γνωστές Ισόψηφες Λέξεις & Φράσεις (Τιμή: ${val})
${matches.length > 0 ? matches.map((m) => `- **${m}**`).join("\n") : `- **ΕΥΡΗΜΑΤΑ ΑΞΙΑΣ ${val}**: Στην κλασική γραμματεία αναζητούνται συνδυασμοί και φράσεις που συγκροτούν το άθροισμα ${val}. (Χρησιμοποιήστε την καρτέλα «Εύρεση Online» για άμεση παραγωγή 15-25 ισόψηφων λέξεων).`}

### 3. Πυθαγόρειος Πυθμένας
- Ο πυθμένας του αριθμού ${val} είναι **${pythmen}**. Όλες οι παραπάνω φράσεις έχουν ακριβώς το ίδιο άθροισμα και την ίδια ψηφιακή ρίζα ${pythmen}.`;
    }

    if (isEtymologyQuestion) {
      return `## 📖 Ετυμολογική & Ιστορική Σημασία: «${targetText}»

### 1. Γλωσσολογική & Φιλολογική Προσέγγιση
- **Κείμενο**: «${targetText}»
- **Λεξαριθμικό Άθροισμα**: **${val}**
- **Σύνθεση & Επιμέρους Λέξεις**: ${words && words.length > 0 ? words.join(" + ") : targetText}
${wordInfo ? `
### 2. Ετυμολογία & Ιστορικό Πλαίσιο
- **Ετυμολογική Προέλευση**: ${wordInfo.etymology}
- **Φιλολογική Σημασία**: ${wordInfo.philology}
- **Πηγές**: ${wordInfo.source}
` : `
### 2. Ιστορική & Φιλολογική Διάσταση
Στην κλασική, ελληνιστική και βυζαντινή γραμματεία, η λέξη «${targetText}» αναλύεται με βάση την αρχαία **Ιωνική Αρίθμηση (27 ψηφία)**.
- Κάθε γράμμα φέρει καθορισμένη οντολογική και μαθηματική αξία.
- Τα 27 σύμβολα (9 Μονάδες, 9 Δεκάδες, 9 Εκατοντάδες συμπεριλαμβανομένων των ϛ=6, ϟ=90, ϡ=900) συγκροτούν το αρτιότερο αλφαριθμητικό σύστημα του αρχαίου κόσμου.
`}`;
    }

    if (isPhilosophyQuestion) {
      return `## 🏛️ Συσχέτιση με την Αρχαία Φιλοσοφία & τα Μυστήρια: «${targetText}» (Αξία: ${val})

### 1. Η Φιλοσοφική Θεώρηση των Αριθμών
Οι Πυθαγόρειοι και οι Πλατωνικοί (ιδίως στον *Τίμαιο* και τον *Κρατύλο*) δίδασκαν ότι *«ἀριθμῷ δέ τε πάντ' ἐπέοικεν»* (όλα τα όντα είναι δομημένα κατ' εικόνα των αριθμών).
${wordInfo ? `
### 2. Φιλοσοφικός & Μυστικός Συμβολισμός
- **Ερμηνεία**: ${wordInfo.philosophy}
- **Πυθμένας ${pythmen}**: Εκφράζει τη συμπαντική αρμονία και τη σύνδεση με τις κοσμικές αρχές.
` : `
### 2. Ο Συμβολισμός του ${val} & του Πυθμένα ${pythmen}
- **Ενέργεια & Αρμονία**: Ο αριθμός **${val}** εκφράζει τη συγκεκριμένη ισορροπία της έκφρασης «${targetText}».
- **Μυστηριακή Παράδοση**: Στα Ελευσίνια, τα Δελφικά και τα Ορφικά Μυστήρια, τα ονόματα και οι ιερές επικλήσεις επιλέγονταν βάσει της ισοψηφικής τους ακρίβειας ώστε να συντονίζονται με την ουράνια τάξη.
`}`;
    }

    // Default general comprehensive response
    return `## 📜 Φιλολογική & Ισοψηφική Ανάλυση: «${targetText}»

### 1. Αριθμητική Ταυτότητα & Ιωνική Αξία
- **Λεξαριθμικό Άθροισμα**: **${val}**
- **Πυθαγόρειος Πυθμένας (Ψηφιακή Ρίζα)**: **${pythmen}** (${String(val).split('').join(' + ')} = ${pythmen})
- **Πλήθος Διαιρετών**: **${divisors.length}** διαιρέτες (${divisors.slice(0, 12).join(", ")}${divisors.length > 12 ? "..." : ""})
${isTri ? `- **Τρίγωνος Αριθμός**: Ναι! Είναι ο **${triRoot}ος τρίγωνος αριθμός** (T_${triRoot} = (${triRoot} × ${triRoot + 1}) / 2 = ${val}).` : ""}
${val % 2 === 0 ? "- **Αρτιότητα**: Άρτιος αριθμός (δεκτικός αρμονικής διαίρεσης)." : "- **Αρτιότητα**: Περιττός αριθμός (αδιάσπαστη μονάδα)."}

### 2. Φιλολογική & Ετυμολογική Ερμηνεία
${wordInfo ? `
- **Ετυμολογία**: ${wordInfo.etymology}
- **Φιλολογικό Βάθος**: ${wordInfo.philology}
- **Φιλοσοφικός Συμβολισμός**: ${wordInfo.philosophy}
- **Κλασικές Πηγές**: ${wordInfo.source}
` : `
Η λέξη «${targetText}» αναλύεται σύμφωνα με τους κανόνες της **Ιωνικής Αρίθμησης** (27 ψηφία: 9 Μονάδες, 9 Δεκάδες, 9 Εκατοντάδες).
Στην αρχαία γραμματεία, η ισοψηφία δεν ήταν απλό παιχνίδι αλλά εργαλείο αποκάλυψης των εσωτερικών δεσμών ανάμεσα στις έννοιες, τους θεούς και τους κοσμικούς νόμους.
`}

### 3. Συσχετίσεις & Ισοψηφίες (Αξία: ${val})
${knownIsopsephiesMap[val] ? knownIsopsephiesMap[val].map(m => `- ${m}`).join("\n") : `- Ο αριθμός ${val} φέρει πυθμένα **${pythmen}**. Μπορείτε να ανακαλύψετε όλες τις ισόψηφες λέξεις στην καρτέλα «Εύρεση Online» ή «Αναζήτηση».`}

*(Ανάλυση από την Τ.Ν. ΙΩΑΝΝΗΣ 1.0)*`;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Λεξάριθμος διακομιστής ενεργός στη θύρα ${PORT}`);
  });
}

startServer();
