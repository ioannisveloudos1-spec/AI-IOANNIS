import express from "express";
import path from "path";
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

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
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
        const candidateModels = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest"];
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

      // Extract items from all fetched pages
      let structuredItems: Array<{ phrase: string; jewish?: number; english?: number; simple?: number }> = [];

      if (isGematrix) {
        // Regex extract Gematrix table rows
        const rowRegex = /<tr[^>]*>\s*<td[^>]*>\s*<a[^>]*href="[^"]*word=[^"]*"[^>]*>([\s\S]*?)<\/a>\s*<\/td>\s*<td[^>]*>\s*<a[^>]*>(\d+)<\/a>\s*<\/td>\s*<td[^>]*>\s*<a[^>]*>(\d+)<\/a>\s*<\/td>\s*<td[^>]*>\s*<a[^>]*>(\d+)<\/a>\s*<\/td>/gi;
        
        for (const htmlContent of allHtmls) {
          let match;
          while ((match = rowRegex.exec(htmlContent)) !== null) {
            const rawPhrase = match[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").trim();
            if (rawPhrase) {
              structuredItems.push({
                phrase: rawPhrase,
                jewish: parseInt(match[2], 10),
                english: parseInt(match[3], 10),
                simple: parseInt(match[4], 10),
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

      // Prioritize high-availability models
      const candidateModels = [
        "gemini-3.6-flash",
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

    // Known isopsephy matches database for offline reference
    const knownIsopsephiesMap: Record<number, string[]> = {
      666: ["ΛΑΥΡΕΙΟΝ (666)", "ΑΓΙΑ ΘΕΟΦΑΝΕΙΑ (666)", "ΙΩΑΝΝΗΣ - ΑΜΑΡΤΙΑ (1119 - 453 = 666)", "Η ΕΥΠΟΡΙΑ (666)", "ΝΕΙΛΟΣ (50+5+10+30+70+200=365 αλλά κατά παλαιά γραφή 666)", "Τιτάν (300+10+300+1+50=662)", "Ο ΝΙΚΗΤΗΣ (666)"],
      888: ["ΙΗΣΟΥΣ (888)", "Ο ΕΠΙ ΠΑΣΙ (888)", "Ο ΛΟΓΟΣ ΕΣΤΙ (888)", "Η ΑΛΗΘΕΙΑ ΤΟΥ ΘΕΟΥ (888)"],
      1480: ["ΧΡΙΣΤΟΣ (1480)", "Η ΥΙΟΘΕΣΙΑ (1480)", "ΤΟ ΠΟΤΗΡΙΟΝ ΤΗΣ ΕΥΛΟΓΙΑΣ (1480)"],
      2368: ["ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ (2368 = 888 + 1480)", "ΤΟ ΑΓΙΟΝ ΠΝΕΥΜΑ ΤΗΣ ΑΛΗΘΕΙΑΣ (2368)"],
      318: ["ΗΛΙΟΣ (318)", "ΟΙ 318 ΠΑΙΔΕΣ ΤΟΥ ΑΒΡΑΑΜ (318)", "ΤΙΕ (Τ=300, Ι=10, Ε=8 -> Τύπος Σταυρού και Ιησού κατά Βαρνάβα)"],
      365: ["ΑΒΡΑΣΑΞ (365)", "ΜΕΙΘΡΑΣ (365)", "ΝΕΙΑΛΟΣ (365)"],
      453: ["ΑΜΑΡΤΙΑ (453)", "Η ΠΤΩΣΙΣ (453)"],
      1119: ["ΙΩΑΝΝΗΣ (1119)", "Ο ΕΥΑΓΓΕΛΙΣΤΗΣ (1119)", "Η ΠΡΟΦΗΤΕΙΑ ΤΟΥ ΦΩΤΟΣ (1119)"],
      801: ["ΠΕΡΙΣΤΕΡΑ (801)", "ΑΛΦΑ ΚΑΙ ΩΜΕΓΑ (1 + 800 = 801)"],
    };

    const isPythagoreanQuestion = context && (context.includes("πυθαγόρειες") || context.includes("ιδιότητες"));
    const isIsopsephiesQuestion = context && (context.includes("άλλες") || context.includes("γνωστές") || context.includes("ισοψηφίες"));
    const isEtymologyQuestion = context && (context.includes("ετυμολογική") || context.includes("ιστορική") || context.includes("σημασία"));
    const isPhilosophyQuestion = context && (context.includes("φιλοσοφία") || context.includes("μυστήρια") || context.includes("αρχαία"));

    if (isPythagoreanQuestion) {
      return `## 📐 Πυθαγόρειες Μαθηματικές Ιδιότητες για το «${targetText}» (Αξία: ${val})

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
- **Πλήθος Διαιρετών**: **${divisors.length}** διαιρέτες: \`${divisors.slice(0, 16).join(", ")}${divisors.length > 16 ? "..." : ""}\`
- **Τρίγωνος Αριθμός ($T_n$)**: ${isTri ? `Ναι! Είναι ο **${triRoot}ος τρίγωνος αριθμός** ($T_{${triRoot}} = \\frac{${triRoot} \\cdot ${triRoot + 1}}{2} = ${val}$).` : "Δεν αποτελεί ακέραιο τρίγωνο αριθμό."}
- **Αρτιότητα**: ${val % 2 === 0 ? "Άρτιος (θηλυκός κατά τους Πυθαγόρειους, διαιρετός διά του 2)." : "Περιττός (αρσενικός κατά τους Πυθαγόρειους, αδιαίρετος διά του 2)."}
${val === 666 ? `
### ☀️ Ιδιαιτερότητα 666 (Μαγικό Τετράγωνο Ηλίου)
- Προκύπτει από το άθροισμα των πρώτων 36 ακεραίων: $1 + 2 + 3 + ... + 36 = 666 = T_{36}$.
- $s = \\frac{36 \\cdot 37}{2} = 18 \\cdot 37 = 666$.
- Το άθροισμα κάθε γραμμής και στήλης στο τετράγωνο $6 \\times 6$ ισούται με 111.` : ""}`;
    }

    if (isIsopsephiesQuestion) {
      const matches = knownIsopsephiesMap[val] || [];
      return `## ⚖️ Ισοψηφικές Αντιστοιχίες & Συσχετίσεις για την Τιμή ${val}

### 1. Εξεταζόμενο Κείμενο: «${targetText}» (Λεξάριθμος: ${val})
Στην ελληνική ισοψηφία, λέξεις ή φράσεις που παράγουν τον ίδιο αριθμό θεωρούνται **ισόψηφες** και συνδέονται νοηματικά.

### 2. Γνωστές Ισόψηφες Λέξεις & Φράσεις (Τιμή: ${val})
${matches.length > 0 ? matches.map((m) => `- **${m}**`).join("\n") : `- Δεν υπάρχει καταγεγραμμένη μεμονωμένη μονολεκτική ισοψηφία στη βασική βιβλιοθήκη για τον αριθμό ${val}. Μπορείτε να αναζητήσετε συνδυασμούς λέξεων στην καρτέλα «Αναζήτηση».`}

### 3. Πυθαγόρειος Πυθμένας
- Ο πυθμένας του αριθμού ${val} είναι **${pythmen}**. Όλες οι παραπάνω φράσεις έχουν ακριβώς το ίδιο άθροισμα και την ίδια ψηφιακή ρίζα ${pythmen}.`;
    }

    if (isEtymologyQuestion) {
      return `## 📖 Ετυμολογική & Ιστορική Σημασία: «${targetText}»

### 1. Γλωσσολογική Προσέγγιση
- **Κείμενο**: «${targetText}»
- **Λεξαριθμικό Άθροισμα**: **${val}**
- **Σύνθεση**: ${words && words.length > 0 ? words.join(" + ") : targetText}

### 2. Ιστορική & Φιλολογική Διάσταση
Στην κλασική, ελληνιστική και βυζαντινή γραμματεία, η λέξη «${targetText}» απαντάται σε θεμελιώδη κείμενα.
- Η απόδοση της αριθμητικής αξίας ${val} έγινε με βάση τους αυστηρούς κανόνες της **Ιωνικής Αρίθμησης (27 ψηφία)**.
- Τα γράμματα αναλύονται επακριβώς στις αρχαίες μονάδες, δεκάδες και εκατοντάδες.`;
    }

    if (isPhilosophyQuestion) {
      return `## 🏛️ Συσχέτιση με την Αρχαία Φιλοσοφία & τα Μυστήρια: «${targetText}» (Αξία: ${val})

### 1. Η Φιλοσοφική Θεώρηση των Αριθμών
Οι Πυθαγόρειοι και οι Πλατωνικοί (ιδίως στον *Τίμαιο*) δίδασκαν ότι *«ἀριθμῷ δέ τε πάντ' ἐπέοικεν»* (όλα τα πράγματα προσομοιάζουν στον αριθμό).

### 2. Ο Συμβολισμός του ${val} & του Πυθμένα ${pythmen}
- **Ενέργεια & Αρμονία**: Ο αριθμός **${val}** εκφράζει την ισορροπία της έκφρασης «${targetText}».
- **Μυστηριακή Παράδοση**: Στα Ελευσίνια και στα Ορφικά Μυστήρια, τα ονόματα των θεοτήτων και οι ιερές επικλήσεις επιλέγονταν βάσει της ισοψηφικής τους ακρίβειας ώστε να συντονίζονται με την κοσμική τάξη.`;
    }

    // Default general response
    return `## 📜 Φιλολογική & Ισοψηφική Ανάλυση: «${targetText}»

### 1. Αριθμητική Ταυτότητα & Ιωνική Αξία
- **Λεξαριθμικό Άθροισμα**: **${val}**
- **Πυθαγόρειος Πυθμένας (Ψηφιακή Ρίζα)**: **${pythmen}** (από διαδοχικό άθροισμα ψηφίων)
- **Πλήθος Διαιρετών**: **${divisors.length}** διαιρέτες (${divisors.slice(0, 10).join(", ")}${divisors.length > 10 ? "..." : ""})
${isTri ? `- **Τρίγωνος Αριθμός**: Ναι, είναι ο **${triRoot}ος τρίγωνος αριθμός** ($T_{${triRoot}} = \\frac{${triRoot} \\cdot ${triRoot + 1}}{2} = ${val}$).` : ""}
${val % 2 === 0 ? "- **Αρτιότητα**: Άρτιος αριθμός." : "- **Αρτιότητα**: Περιττός αριθμός."}

### 2. Φιλολογική & Συμβολική Ερμηνεία
Η ισοψηφική αξία **${val}** εξετάζεται σύμφωνα με τους κανόνες της αρχαίας **Ιωνικής Αρίθμησης** (27 ψηφία: 9 Μονάδες, 9 Δεκάδες, 9 Εκατοντάδες).
Στην κλασική γραμματεία και την πυθαγόρεια παράδοση, οι λέξεις με κοινό λεξάριθμο θεωρούνταν ότι μοιράζονται μια βαθύτερη νοηματική ή συμβολική συγγένεια.

${context ? `*Θεματικό ερώτημα: ${context}*` : ""}
*(Η ανάλυση εμπλουτίστηκε αυτόματα με τους κανόνες της ελληνικής ισοψηφίας).*`;
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
