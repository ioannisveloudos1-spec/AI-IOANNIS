import { calculateIsopsephy, calculatePythmen, numberToGreekNumeral } from "./isopsephy";
import { HISTORICAL_ISOPSEPHIES } from "../data/historicalIsopsephies";

export interface CandidateWord {
  text: string;
  value: number;
  root: number;
  category?: string;
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
  coherenceScore: number;
}

/**
 * Built-in core vocabulary for sentence synthesis
 */
export const CORE_SYNTHESIS_VOCABULARY: Array<{ text: string; value: number; category: string }> = [
  { text: "Ο", value: 70, category: "Άρθρο" },
  { text: "Η", value: 8, category: "Άρθρο" },
  { text: "ΤΟ", value: 370, category: "Άρθρο" },
  { text: "ΚΑΙ", value: 31, category: "Σύνδεσμος" },
  { text: "ΕΣΤΙ", value: 515, category: "Ρήμα" },
  { text: "ΕΣΤΙΝ", value: 565, category: "Ρήμα" },
  { text: "ΗΝ", value: 58, category: "Ρήμα" },
  { text: "ΕΙΝΑΙ", value: 76, category: "Ρήμα" },
  { text: "ΘΕΟΣ", value: 284, category: "Ουσιαστικό" },
  { text: "ΦΩΣ", value: 1500, category: "Ουσιαστικό" },
  { text: "ΛΟΓΟΣ", value: 373, category: "Ουσιαστικό" },
  { text: "ΑΓΑΠΗ", value: 93, category: "Ουσιαστικό" },
  { text: "ΖΩΗ", value: 815, category: "Ουσιαστικό" },
  { text: "ΣΟΦΙΑ", value: 781, category: "Ουσιαστικό" },
  { text: "ΑΛΗΘΕΙΑ", value: 64, category: "Ουσιαστικό" },
  { text: "ΕΙΡΗΝΗ", value: 183, category: "Ουσιαστικό" },
  { text: "ΚΟΣΜΟΣ", value: 600, category: "Ουσιαστικό" },
  { text: "ΨΥΧΗ", value: 1708, category: "Ουσιαστικό" },
  { text: "ΝΟΥΣ", value: 720, category: "Ουσιαστικό" },
  { text: "ΗΛΙΟΣ", value: 318, category: "Ουσιαστικό" },
  { text: "ΣΕΛΗΝΗ", value: 301, category: "Ουσιαστικό" },
  { text: "ΓΗ", value: 11, category: "Ουσιαστικό" },
  { text: "ΟΥΡΑΝΟΣ", value: 891, category: "Ουσιαστικό" },
  { text: "ΠΥΡ", value: 580, category: "Ουσιαστικό" },
  { text: "ΥΔΩΡ", value: 1304, category: "Ουσιαστικό" },
  { text: "ΑΗΡ", value: 109, category: "Ουσιαστικό" },
  { text: "ΑΡΧΗ", value: 709, category: "Ουσιαστικό" },
  { text: "ΤΕΛΟΣ", value: 605, category: "Ουσιαστικό" },
  { text: "ΕΝ", value: 55, category: "Πρόθεση" },
  { text: "ΜΕΓΑ", value: 49, category: "Επίθετο" },
  { text: "ΑΓΙΟΣ", value: 284, category: "Επίθετο" },
  { text: "ΘΕΙΟΣ", value: 294, category: "Επίθετο" },
  { text: "ΙΑΝΕΥΣ", value: 666, category: "Όνομα" },
  { text: "ΤΕΛΙΑΝΟΣ", value: 666, category: "Όνομα" },
  { text: "ΒΕΛΟΥΔΟΣ", value: 1049, category: "Όνομα" },
  { text: "ΑΠΟΛΛΩΝ", value: 1061, category: "Όνομα" },
  { text: "ΙΗΣΟΥΣ", value: 888, category: "Όνομα" },
  { text: "ΧΡΙΣΤΟΣ", value: 1480, category: "Όνομα" },
];

/**
 * Finds exact isopsephic combinations that sum to the target value
 */
export function generateIsopsephicSentences(
  targetValue: number,
  options: {
    wordsCount?: number; // 2, 3, or 4
    customWords?: Array<{ text: string; value: number; category?: string }>;
    maxResults?: number;
  } = {}
): GeneratedSentenceMatch[] {
  const { wordsCount = 2, customWords = [], maxResults = 50 } = options;

  // Build unique candidates pool
  const candidatesMap = new Map<string, CandidateWord>();

  // 1. Add core vocabulary
  CORE_SYNTHESIS_VOCABULARY.forEach((w) => {
    const val = w.value || calculateIsopsephy(w.text);
    candidatesMap.set(w.text.toUpperCase(), {
      text: w.text.toUpperCase(),
      value: val,
      root: calculatePythmen(val),
      category: w.category,
      lang: "greek",
    });
  });

  // 2. Add historical items
  HISTORICAL_ISOPSEPHIES.forEach((h) => {
    h.items.forEach((item) => {
      const clean = item.word.trim().toUpperCase();
      if (!clean.includes(" ") && !clean.includes("-") && clean.length > 0) {
        const val = calculateIsopsephy(clean);
        if (val > 0 && !candidatesMap.has(clean)) {
          candidatesMap.set(clean, {
            text: clean,
            value: val,
            root: calculatePythmen(val),
            category: "Ιστορικό",
            lang: "greek",
          });
        }
      }
    });
  });

  // 3. Add custom words from user's archive
  customWords.forEach((c) => {
    const clean = c.text.trim().toUpperCase();
    if (!candidatesMap.has(clean) && clean.length > 0) {
      const val = c.value || calculateIsopsephy(clean);
      candidatesMap.set(clean, {
        text: clean,
        value: val,
        root: calculatePythmen(val),
        category: c.category || "Αρχείο",
        lang: "greek",
      });
    }
  });

  const pool = Array.from(candidatesMap.values()).filter((w) => w.value < targetValue);
  const results: GeneratedSentenceMatch[] = [];
  const seenCombinations = new Set<string>();

  // 2-Word Combinations
  if (wordsCount === 2) {
    for (let i = 0; i < pool.length; i++) {
      const w1 = pool[i];
      const remainder = targetValue - w1.value;
      if (remainder <= 0) continue;

      for (let j = 0; j < pool.length; j++) {
        if (i === j) continue;
        const w2 = pool[j];
        if (w2.value === remainder) {
          const key = [w1.text, w2.text].sort().join("|");
          if (!seenCombinations.has(key)) {
            seenCombinations.add(key);
            const sentence = `${w1.text} ${w2.text}`;
            results.push({
              id: `combo-2-${i}-${j}`,
              words: [w1, w2],
              fullSentence: sentence,
              targetSum: targetValue,
              totalSum: targetValue,
              root: calculatePythmen(targetValue),
              greekNumeral: numberToGreekNumeral(targetValue),
              wordCount: 2,
              coherenceScore: 100,
            });
            if (results.length >= maxResults) return results;
          }
        }
      }
    }
  }

  // 3-Word Combinations
  if (wordsCount === 3) {
    for (let i = 0; i < pool.length; i++) {
      const w1 = pool[i];
      if (w1.value >= targetValue) continue;

      for (let j = i + 1; j < pool.length; j++) {
        const w2 = pool[j];
        const partial = w1.value + w2.value;
        const remainder = targetValue - partial;
        if (remainder <= 0) continue;

        for (let k = j + 1; k < pool.length; k++) {
          const w3 = pool[k];
          if (w3.value === remainder) {
            const key = [w1.text, w2.text, w3.text].sort().join("|");
            if (!seenCombinations.has(key)) {
              seenCombinations.add(key);
              results.push({
                id: `combo-3-${i}-${j}-${k}`,
                words: [w1, w2, w3],
                fullSentence: `${w1.text} ${w2.text} ${w3.text}`,
                targetSum: targetValue,
                totalSum: targetValue,
                root: calculatePythmen(targetValue),
                greekNumeral: numberToGreekNumeral(targetValue),
                wordCount: 3,
                coherenceScore: 90,
              });
              if (results.length >= maxResults) return results;
            }
          }
        }
      }
    }
  }

  // 4-Word Combinations (Sampled)
  if (wordsCount === 4) {
    const smallerPool = pool.filter((w) => w.value <= targetValue / 2).slice(0, 80);
    for (let i = 0; i < smallerPool.length; i++) {
      for (let j = i + 1; j < smallerPool.length; j++) {
        for (let k = j + 1; k < smallerPool.length; k++) {
          const partial = smallerPool[i].value + smallerPool[j].value + smallerPool[k].value;
          const remainder = targetValue - partial;
          if (remainder <= 0) continue;

          for (let m = k + 1; m < smallerPool.length; m++) {
            if (smallerPool[m].value === remainder) {
              const key = [smallerPool[i].text, smallerPool[j].text, smallerPool[k].text, smallerPool[m].text].sort().join("|");
              if (!seenCombinations.has(key)) {
                seenCombinations.add(key);
                results.push({
                  id: `combo-4-${i}-${j}-${k}-${m}`,
                  words: [smallerPool[i], smallerPool[j], smallerPool[k], smallerPool[m]],
                  fullSentence: `${smallerPool[i].text} ${smallerPool[j].text} ${smallerPool[k].text} ${smallerPool[m].text}`,
                  targetSum: targetValue,
                  totalSum: targetValue,
                  root: calculatePythmen(targetValue),
                  greekNumeral: numberToGreekNumeral(targetValue),
                  wordCount: 4,
                  coherenceScore: 80,
                });
                if (results.length >= maxResults) return results;
              }
            }
          }
        }
      }
    }
  }

  return results;
}
