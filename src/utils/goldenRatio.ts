// Golden Ratio (Χρυσή Τομή Φ = 1.6180339887...) and Harmonic Isopsephy Analysis

export const PHI = 1.618033988749895;
export const INV_PHI = 0.618033988749895; // 1 / PHI = PHI - 1

// Extended Fibonacci Sequence for Harmonic Alignment
export const FIBONACCI_NUMBERS = [
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025
];

// Extended Lucas Sequence (2, 1, 3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322, 521, 843, 1364, 2207, 3571...)
export const LUCAS_NUMBERS = [
  2, 1, 3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322, 521, 843, 1364, 2207, 3571, 5778, 9349, 15127, 24476
];

const GREEK_VOWELS = new Set([
  'Α', 'Ε', 'Η', 'Ι', 'Ο', 'Υ', 'Ω',
  'α', 'ε', 'η', 'ι', 'ο', 'υ', 'ω',
  'Ά', 'Έ', 'Ή', 'Ί', 'Ό', 'Ύ', 'Ώ',
  'ά', 'έ', 'ή', 'ί', 'ό', 'ύ', 'ώ',
  'Ἀ', 'Ἁ', 'Ἂ', 'Ἃ', 'Ἄ', 'Ἅ', 'Ἆ', 'Ἇ', 'ἀ', 'ἁ', 'ἂ', 'ἃ', 'ἄ', 'ἅ', 'ἆ', 'ἇ',
  'Ἐ', 'Ἑ', 'Ἒ', 'Ἓ', 'Ἔ', 'Ἕ', 'ἐ', 'ἑ', 'ἒ', 'ἓ', 'ἔ', 'ἕ',
  'Ἠ', 'Ἡ', 'Ἢ', 'Ἣ', 'Ἤ', 'Ἥ', 'Ἦ', 'Ἧ', 'ἠ', 'ἡ', 'ἢ', 'ἣ', 'ἤ', 'ἥ', 'ἦ', 'ἧ',
  'Ἰ', 'Ἱ', 'Ἲ', 'Ἳ', 'Ἴ', 'Ἵ', 'Ἶ', 'Ἷ', 'ἰ', 'ἱ', 'ἲ', 'ἳ', 'ἴ', 'ἵ', 'ἶ', 'ἷ',
  'Ὀ', 'Ὁ', 'Ὂ', 'Ὃ', 'Ὄ', 'Ὅ', 'ὀ', 'ὁ', 'ὂ', 'ὃ', 'ὄ', 'ὅ',
  'Ὑ', 'Ὓ', 'Ὕ', 'Ὗ', 'ὐ', 'ὑ', 'ὒ', 'ὓ', 'ὔ', 'ὕ', 'ὖ', 'ὗ',
  'Ὠ', 'Ὡ', 'Ὢ', 'Ὣ', 'Ὤ', 'Ὥ', 'Ὦ', 'Ὧ', 'ὠ', 'ὡ', 'ὢ', 'ὣ', 'ὤ', 'ὥ', 'ὦ', 'ὧ',
  'Ϊ', 'Ϋ', 'ϊ', 'ϋ', 'ΐ', 'ΰ',
  'ᾀ', 'ᾁ', 'ᾂ', 'ᾃ', 'ᾄ', 'ᾅ', 'ᾆ', 'ᾇ', 'ᾈ', 'ᾉ', 'ᾊ', 'ᾋ', 'ᾌ', 'ᾍ', 'ᾎ', 'ᾏ',
  'ᾐ', 'ᾑ', 'ᾒ', 'ᾓ', 'ᾔ', 'ᾕ', 'ᾖ', 'ᾗ', 'ᾘ', 'ᾙ', 'ᾚ', 'ᾛ', 'ᾜ', 'ᾝ', 'ᾞ', 'ᾟ',
  'ᾠ', 'ᾡ', 'ᾢ', 'ᾣ', 'ᾤ', 'ᾥ', 'ᾦ', 'ᾧ', 'ᾨ', 'ᾩ', 'ᾪ', 'ᾫ', 'ᾬ', 'ᾭ', 'ᾮ', 'ᾯ',
  'ᾲ', 'ᾳ', 'ᾴ', 'ᾶ', 'ᾷ', 'ῂ', 'ῃ', 'ῄ', 'ῆ', 'ῇ', 'ῒ', 'ΐ', 'ῖ', 'ῗ', 'ῢ', 'ΰ', 'ῦ', 'ῧ', 'ῲ', 'ῳ', 'ῴ', 'ῶ', 'ῷ'
]);

const ENGLISH_VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y', 'a', 'e', 'i', 'o', 'u', 'y']);

export interface GoldenRatioAnalysis {
  phi: number;
  invPhi: number;
  totalValue: number;
  
  // Golden Cut (Χρυσός Διαμερισμός)
  majorSection: number;
  minorSection: number;
  majorSectionRounded: number;
  minorSectionRounded: number;

  // Vowels vs Consonants Analysis
  vowelsValue: number;
  consonantsValue: number;
  vowelsCount: number;
  consonantsCount: number;
  vowelConsonantRatio: number;
  vowelConsonantScore: number; // 0-100% proximity to PHI or 1/PHI
  vowelConsonantOrientation: "V_OVER_C" | "C_OVER_V" | "EQUAL" | "NONE";

  // Word breakdown analysis
  hasMultipleWords: boolean;
  wordPairs: {
    wordA: string;
    valA: number;
    wordB: string;
    valB: number;
    ratio: number;
    harmonicScore: number;
    isGolden: boolean;
  }[];
  bestWordRatio?: {
    wordA: string;
    valA: number;
    wordB: string;
    valB: number;
    ratio: number;
    harmonicScore: number;
  };

  // Half-text partition
  firstHalfValue: number;
  secondHalfValue: number;
  halfRatio: number;
  halfScore: number;

  // Primary selected ratio and gauge metrics
  primaryRatio: number;
  primaryRatioDescription: string;
  primaryProximityScore: number; // 0-100%
  primaryDiffFromPhi: number;
  resonanceLevel: "PERFECT" | "HIGH" | "MODERATE" | "LOW";
  resonanceLabel: string;
  resonanceColor: string;

  // Fibonacci & Lucas Harmonics
  nearestFibonacci: number;
  fibonacciDistance: number;
  fibonacciIndex: number;
  isFibonacci: boolean;
  fibonacciRatioToPrev: number;
  nearestLucas: number;
  lucasDistance: number;

  // Phi power approximation
  phiPowerHarmonic: {
    power: number;
    theoreticalVal: number;
    ratioToActual: number;
    score: number;
  };
}

/**
 * Calculates the proximity score (0% - 100%) of any measured ratio to target PHI (1.618034)
 */
export function calculateHarmonicScore(ratio: number, target: number = PHI): number {
  if (!ratio || ratio <= 0 || isNaN(ratio) || !isFinite(ratio)) return 0;
  
  // Normalize ratio to always be >= 1 (e.g. if ratio is 0.618, 1/0.618 = 1.618)
  const normalizedRatio = ratio < 1 ? 1 / ratio : ratio;
  const targetNorm = target < 1 ? 1 / target : target;

  const diff = Math.abs(normalizedRatio - targetNorm);
  
  // Gaussian/Exponential resonance curve: 100% at diff=0, ~90% at diff=0.05, ~50% at diff=0.3
  const score = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-3.5 * Math.pow(diff, 1.3)) * 10) / 10));
  return score;
}

/**
 * Find nearest Fibonacci number and details
 */
export function findNearestFibonacci(value: number) {
  if (value <= 0) return { nearest: 1, distance: 0, index: 1, isExact: false, ratioToPrev: 1 };
  
  let closest = FIBONACCI_NUMBERS[0];
  let minDiff = Math.abs(value - closest);
  let closestIdx = 0;

  for (let i = 0; i < FIBONACCI_NUMBERS.length; i++) {
    const diff = Math.abs(value - FIBONACCI_NUMBERS[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = FIBONACCI_NUMBERS[i];
      closestIdx = i;
    }
  }

  const prev = closestIdx > 0 ? FIBONACCI_NUMBERS[closestIdx - 1] : 1;
  const ratioToPrev = prev > 0 ? Math.round((closest / prev) * 10000) / 10000 : 1;

  return {
    nearest: closest,
    distance: minDiff,
    index: closestIdx + 1, // 1-indexed
    isExact: minDiff === 0,
    ratioToPrev,
  };
}

/**
 * Find nearest Lucas number
 */
export function findNearestLucas(value: number) {
  if (value <= 0) return { nearest: 2, distance: 0 };
  let closest = LUCAS_NUMBERS[0];
  let minDiff = Math.abs(value - closest);

  for (let i = 0; i < LUCAS_NUMBERS.length; i++) {
    const diff = Math.abs(value - LUCAS_NUMBERS[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = LUCAS_NUMBERS[i];
    }
  }

  return { nearest: closest, distance: minDiff };
}

/**
 * Evaluates comprehensive Golden Ratio properties for an isopsephy result
 */
export function analyzeGoldenRatio(
  totalValue: number,
  wordBreakdowns: {
    rawWord: string;
    value: number;
    letters: { char: string; originalChar?: string; value: number }[];
  }[],
  selectedSystemIsEnglish: boolean = false
): GoldenRatioAnalysis {
  const isVowelChar = (c: string) => {
    return selectedSystemIsEnglish ? ENGLISH_VOWELS.has(c) : GREEK_VOWELS.has(c);
  };

  // 1. Golden Cut (Χρυσός Διαμερισμός)
  const majorSection = totalValue > 0 ? totalValue * INV_PHI : 0;
  const minorSection = totalValue > 0 ? totalValue - majorSection : 0;
  const majorSectionRounded = Math.round(majorSection);
  const minorSectionRounded = Math.round(minorSection);

  // 2. Vowels vs Consonants Breakdown
  let vowelsValue = 0;
  let consonantsValue = 0;
  let vowelsCount = 0;
  let consonantsCount = 0;

  for (const word of wordBreakdowns) {
    for (const letter of word.letters) {
      const ch = letter.originalChar || letter.char;
      if (isVowelChar(ch)) {
        vowelsValue += letter.value;
        vowelsCount++;
      } else {
        consonantsValue += letter.value;
        consonantsCount++;
      }
    }
  }

  let vowelConsonantRatio = 1;
  let vowelConsonantOrientation: "V_OVER_C" | "C_OVER_V" | "EQUAL" | "NONE" = "NONE";
  let vowelConsonantScore = 0;

  if (vowelsValue > 0 && consonantsValue > 0) {
    if (consonantsValue >= vowelsValue) {
      vowelConsonantRatio = Math.round((consonantsValue / vowelsValue) * 10000) / 10000;
      vowelConsonantOrientation = "C_OVER_V";
    } else {
      vowelConsonantRatio = Math.round((vowelsValue / consonantsValue) * 10000) / 10000;
      vowelConsonantOrientation = "V_OVER_C";
    }
    vowelConsonantScore = calculateHarmonicScore(vowelConsonantRatio);
  } else if (totalValue > 0) {
    vowelConsonantRatio = 1;
    vowelConsonantOrientation = "EQUAL";
  }

  // 3. Word Pairs Golden Ratio (if multiple words)
  const hasMultipleWords = wordBreakdowns.length > 1;
  const wordPairs: GoldenRatioAnalysis["wordPairs"] = [];
  let bestWordRatio: GoldenRatioAnalysis["bestWordRatio"] = undefined;
  let maxWordScore = -1;

  if (hasMultipleWords) {
    for (let i = 0; i < wordBreakdowns.length; i++) {
      for (let j = i + 1; j < wordBreakdowns.length; j++) {
        const wA = wordBreakdowns[i];
        const wB = wordBreakdowns[j];
        if (wA.value > 0 && wB.value > 0) {
          const higher = wA.value >= wB.value ? wA : wB;
          const lower = wA.value < wB.value ? wA : wB;
          const r = Math.round((higher.value / lower.value) * 10000) / 10000;
          const score = calculateHarmonicScore(r);
          const isGolden = score >= 85;

          const pairObj = {
            wordA: higher.rawWord,
            valA: higher.value,
            wordB: lower.rawWord,
            valB: lower.value,
            ratio: r,
            harmonicScore: score,
            isGolden,
          };
          wordPairs.push(pairObj);

          if (score > maxWordScore) {
            maxWordScore = score;
            bestWordRatio = pairObj;
          }
        }
      }
    }
  }

  // 4. Text Half Partition
  let firstHalfValue = 0;
  let secondHalfValue = 0;
  if (wordBreakdowns.length >= 2) {
    const mid = Math.ceil(wordBreakdowns.length / 2);
    firstHalfValue = wordBreakdowns.slice(0, mid).reduce((sum, w) => sum + w.value, 0);
    secondHalfValue = wordBreakdowns.slice(mid).reduce((sum, w) => sum + w.value, 0);
  } else if (wordBreakdowns.length === 1) {
    const letters = wordBreakdowns[0].letters;
    const mid = Math.ceil(letters.length / 2);
    firstHalfValue = letters.slice(0, mid).reduce((sum, l) => sum + l.value, 0);
    secondHalfValue = letters.slice(mid).reduce((sum, l) => sum + l.value, 0);
  }

  let halfRatio = 1;
  let halfScore = 0;
  if (firstHalfValue > 0 && secondHalfValue > 0) {
    const hi = Math.max(firstHalfValue, secondHalfValue);
    const lo = Math.min(firstHalfValue, secondHalfValue);
    halfRatio = Math.round((hi / lo) * 10000) / 10000;
    halfScore = calculateHarmonicScore(halfRatio);
  }

  // 5. Fibonacci & Lucas
  const fibInfo = findNearestFibonacci(totalValue);
  const lucasInfo = findNearestLucas(totalValue);

  // 6. Phi Power Harmonic (Find n such that phi^n is closest to totalValue)
  let bestPhiPower = 1;
  let minPowerDiff = Infinity;
  let theoreticalVal = 1;

  if (totalValue > 0) {
    // totalValue = phi^n => n = ln(totalValue) / ln(phi)
    const exactPower = Math.log(totalValue) / Math.log(PHI);
    const roundedPower = Math.max(1, Math.round(exactPower));
    bestPhiPower = roundedPower;
    theoreticalVal = Math.round(Math.pow(PHI, roundedPower) * 100) / 100;
    minPowerDiff = Math.abs(totalValue - theoreticalVal);
  }

  const phiRatioToActual = theoreticalVal > 0 && totalValue > 0
    ? Math.round((Math.max(totalValue, theoreticalVal) / Math.min(totalValue, theoreticalVal)) * 10000) / 10000
    : 1;
  const phiPowerScore = calculateHarmonicScore(phiRatioToActual, 1); // how close is it to 1.0 (exact match)

  // 7. Select Primary Representative Ratio for the visual Gauge
  let primaryRatio = 1.618;
  let primaryRatioDescription = "";
  let primaryProximityScore = 0;

  if (hasMultipleWords && bestWordRatio && bestWordRatio.harmonicScore >= vowelConsonantScore) {
    primaryRatio = bestWordRatio.ratio;
    primaryRatioDescription = `Αναλογία Λέξεων: «${bestWordRatio.wordA}» (${bestWordRatio.valA}) / «${bestWordRatio.wordB}» (${bestWordRatio.valB})`;
    primaryProximityScore = bestWordRatio.harmonicScore;
  } else if (vowelsValue > 0 && consonantsValue > 0) {
    primaryRatio = vowelConsonantRatio;
    primaryRatioDescription = vowelConsonantOrientation === "C_OVER_V"
      ? `Αναλογία Συμφώνων (${consonantsValue}) / Φωνηέντων (${vowelsValue})`
      : `Αναλογία Φωνηέντων (${vowelsValue}) / Συμφώνων (${consonantsValue})`;
    primaryProximityScore = vowelConsonantScore;
  } else if (halfScore > 0) {
    primaryRatio = halfRatio;
    primaryRatioDescription = `Αναλογία Ημισίων Κειμένου: (${Math.max(firstHalfValue, secondHalfValue)}) / (${Math.min(firstHalfValue, secondHalfValue)})`;
    primaryProximityScore = halfScore;
  } else if (totalValue > 0) {
    // If single letter or uniform, compare major/minor partition
    primaryRatio = majorSection > 0 && minorSection > 0 ? Math.round((majorSection / minorSection) * 10000) / 10000 : 1.618;
    primaryRatioDescription = `Θεωρητικός Χρυσός Διαμερισμός Λεξαρίθμου: (${majorSectionRounded}) / (${minorSectionRounded})`;
    primaryProximityScore = 100;
  }

  const primaryDiffFromPhi = Math.round(Math.abs(primaryRatio - PHI) * 10000) / 10000;

  // Determine resonance label and style
  let resonanceLevel: GoldenRatioAnalysis["resonanceLevel"] = "LOW";
  let resonanceLabel = "Βασική Απόκλιση";
  let resonanceColor = "#8c7e6c";

  if (primaryProximityScore >= 95) {
    resonanceLevel = "PERFECT";
    resonanceLabel = "Τέλεια Χρυσή Αρμονία (Χρυσός Λόγος Φ)";
    resonanceColor = "#e6c670";
  } else if (primaryProximityScore >= 80) {
    resonanceLevel = "HIGH";
    resonanceLabel = "Υψηλή Αρμονική Σύγκλιση (Φ ± 0.08)";
    resonanceColor = "#34d399";
  } else if (primaryProximityScore >= 60) {
    resonanceLevel = "MODERATE";
    resonanceLabel = "Μέτρια Αρμονική Εγγύτητα";
    resonanceColor = "#f59e0b";
  } else {
    resonanceLevel = "LOW";
    resonanceLabel = "Χαμηλή Αρμονική Εγγύτητα";
    resonanceColor = "#a69680";
  }

  return {
    phi: PHI,
    invPhi: INV_PHI,
    totalValue,
    majorSection,
    minorSection,
    majorSectionRounded,
    minorSectionRounded,
    vowelsValue,
    consonantsValue,
    vowelsCount,
    consonantsCount,
    vowelConsonantRatio,
    vowelConsonantScore,
    vowelConsonantOrientation,
    hasMultipleWords,
    wordPairs,
    bestWordRatio,
    firstHalfValue,
    secondHalfValue,
    halfRatio,
    halfScore,
    primaryRatio,
    primaryRatioDescription,
    primaryProximityScore,
    primaryDiffFromPhi,
    resonanceLevel,
    resonanceLabel,
    resonanceColor,
    nearestFibonacci: fibInfo.nearest,
    fibonacciDistance: fibInfo.distance,
    fibonacciIndex: fibInfo.index,
    isFibonacci: fibInfo.isExact,
    fibonacciRatioToPrev: fibInfo.ratioToPrev,
    nearestLucas: lucasInfo.nearest,
    lucasDistance: lucasInfo.distance,
    phiPowerHarmonic: {
      power: bestPhiPower,
      theoreticalVal,
      ratioToActual: phiRatioToActual,
      score: phiPowerScore,
    },
  };
}
