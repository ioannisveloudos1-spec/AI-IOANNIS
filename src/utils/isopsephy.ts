// Ancient Greek Isopsephy and Lexarithmic Calculation Engine

export enum IsopsephySystem {
  IONIAN = 'ionian',
  ORDINAL = 'ordinal',
  ENGLISH_BASE6 = 'english_base6',
  GREEK_MULT6 = 'greek_mult6'
}

export interface LetterValue {
  char: string;
  value: number;
}

export interface WordBreakdown {
  word: string;
  value: number;
  letters: LetterValue[];
}

export interface MathProperties {
  pythmen: number;
  isPrime: boolean;
  isTriangular: boolean;
  triangularRoot?: number;
  isSquare: boolean;
  squareRoot?: number;
  isEven: boolean;
  factors: number[];
}

export interface CalculationResult {
  finalValue: number;
  wordBreakdowns: WordBreakdown[];
  stepsExplanation: string;
  mathProps: MathProperties;
  greekNumeral: string;
}

// 27-letter Ionian System Map
const IONIAN_MAP: Record<string, number> = {
  'Α': 1, 'Β': 2, 'Γ': 3, 'Δ': 4, 'Ε': 5, 'Ϛ': 6, 'Ϝ': 6, 'ΣΤ': 6, 'Ζ': 7, 'Η': 8, 'Θ': 9,
  'Ι': 10, 'Κ': 20, 'Λ': 30, 'Μ': 40, 'Ν': 50, 'Ξ': 60, 'Ο': 70, 'Π': 80, 'Ϟ': 90, 'Ϙ': 90,
  'Ρ': 100, 'Σ': 200, 'Τ': 300, 'Υ': 400, 'Φ': 500, 'Χ': 600, 'Ψ': 700, 'Ω': 800, 'Ϡ': 900, 'Ͳ': 900
};

// Polytonic and Diacritic Normalization
export function normalizeGreek(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toUpperCase()
    .replace(/Ϊ/g, 'Ι')
    .replace(/Ϋ/g, 'Υ')
    .replace(/Ά/g, 'Α')
    .replace(/Έ/g, 'Ε')
    .replace(/Ή/g, 'Η')
    .replace(/Ί/g, 'Ι')
    .replace(/Ό/g, 'Ο')
    .replace(/Ύ/g, 'Υ')
    .replace(/Ώ/g, 'Ω')
    .replace(/ς/g, 'Σ');
}

export function toGreekNumeral(n: number): string {
  if (n <= 0 || !Number.isInteger(n)) return '';
  if (n > 99999) return n.toString();

  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;

  const hundreds = Math.floor(remainder / 100) * 100;
  const tens = Math.floor((remainder % 100) / 10) * 10;
  const units = remainder % 10;

  const hMap: Record<number, string> = {
    100: 'ρ', 200: 'σ', 300: 'τ', 400: 'υ', 500: 'φ', 600: 'χ', 700: 'ψ', 800: 'ω', 900: 'ϡ'
  };
  const tMap: Record<number, string> = {
    10: 'ι', 20: 'κ', 30: 'λ', 40: 'μ', 50: 'ν', 60: 'ξ', 70: 'ο', 80: 'π', 90: 'ϟ'
  };
  const uMap: Record<number, string> = {
    1: 'α', 2: 'β', 3: 'γ', 4: 'δ', 5: 'ε', 6: 'ϛ', 7: 'ζ', 8: 'η', 9: 'θ'
  };

  let res = '';
  if (thousands > 0) {
    if (thousands <= 9) {
      res += '͵' + (uMap[thousands] || '');
    } else {
      res += '͵' + thousands;
    }
  }

  if (hundreds && hMap[hundreds]) res += hMap[hundreds];
  if (tens && tMap[tens]) res += tMap[tens];
  if (units && uMap[units]) res += uMap[units];

  if (res.length > 0) res += '´';
  return res;
}

export function computePythmen(n: number): number {
  if (n <= 0) return 0;
  let current = Math.abs(n);
  while (current > 9) {
    current = current
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return current;
}

export function computeMathProperties(n: number): MathProperties {
  const pythmen = computePythmen(n);
  const isEven = n % 2 === 0;

  let isPrime = n > 1;
  if (n <= 1) isPrime = false;
  else if (n <= 3) isPrime = true;
  else if (n % 2 === 0 || n % 3 === 0) isPrime = false;
  else {
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) {
        isPrime = false;
        break;
      }
    }
  }

  // Triangular number check: 8n + 1 is a square
  const disc = 8 * n + 1;
  const sDisc = Math.round(Math.sqrt(disc));
  const isTriangular = sDisc * sDisc === disc && (sDisc - 1) % 2 === 0;
  const triangularRoot = isTriangular ? (sDisc - 1) / 2 : undefined;

  // Square number check
  const sRoot = Math.round(Math.sqrt(n));
  const isSquare = sRoot * sRoot === n;
  const squareRoot = isSquare ? sRoot : undefined;

  const factors: number[] = [];
  for (let i = 1; i <= Math.min(n, 100); i++) {
    if (n % i === 0) factors.push(i);
  }

  return {
    pythmen,
    isPrime,
    isTriangular,
    triangularRoot,
    isSquare,
    squareRoot,
    isEven,
    factors
  };
}

export function calculateIsopsephy(
  rawInput: string,
  system: IsopsephySystem = IsopsephySystem.IONIAN
): CalculationResult {
  const cleanInput = rawInput.trim();
  if (!cleanInput) {
    return {
      finalValue: 0,
      wordBreakdowns: [],
      stepsExplanation: '',
      mathProps: computeMathProperties(0),
      greekNumeral: ''
    };
  }

  // Support mathematical expressions with + and -
  const isExpression = cleanInput.includes('+') || cleanInput.includes('-');
  
  if (isExpression) {
    // Parse expression tokens
    const tokens = cleanInput.split(/([+-])/).map(t => t.trim()).filter(Boolean);
    let total = 0;
    let currentOp = '+';
    const allBreakdowns: WordBreakdown[] = [];
    const explanationParts: string[] = [];

    for (const token of tokens) {
      if (token === '+' || token === '-') {
        currentOp = token;
      } else {
        const subResult = calculateSingleText(token, system);
        if (currentOp === '+') {
          total += subResult.total;
          explanationParts.push(`${token} (${subResult.total})`);
        } else {
          total -= subResult.total;
          explanationParts.push(`- ${token} (${subResult.total})`);
        }
        allBreakdowns.push(...subResult.wordBreakdowns);
      }
    }

    const finalVal = Math.max(0, total);
    return {
      finalValue: finalVal,
      wordBreakdowns: allBreakdowns,
      stepsExplanation: explanationParts.join(' ') + ` = ${finalVal}`,
      mathProps: computeMathProperties(finalVal),
      greekNumeral: toGreekNumeral(finalVal)
    };
  }

  const single = calculateSingleText(cleanInput, system);
  return {
    finalValue: single.total,
    wordBreakdowns: single.wordBreakdowns,
    stepsExplanation: single.wordBreakdowns.length > 1 
      ? single.wordBreakdowns.map(w => `${w.word} (${w.value})`).join(' + ') + ` = ${single.total}`
      : '',
    mathProps: computeMathProperties(single.total),
    greekNumeral: toGreekNumeral(single.total)
  };
}

function calculateSingleText(text: string, system: IsopsephySystem) {
  const words = text.split(/\s+/).filter(Boolean);
  const wordBreakdowns: WordBreakdown[] = [];
  let total = 0;

  for (const word of words) {
    const letters: LetterValue[] = [];
    let wordSum = 0;
    const norm = normalizeGreek(word);

    for (let i = 0; i < norm.length; i++) {
      const ch = norm[i];
      let val = 0;

      if (system === IsopsephySystem.IONIAN) {
        val = IONIAN_MAP[ch] || 0;
      } else if (system === IsopsephySystem.ORDINAL) {
        const code = ch.charCodeAt(0);
        if (code >= 913 && code <= 937) { // Α-Ω
          val = code - 912;
          if (ch > 'Σ') val--; // skip unused or final sigma
        }
      } else if (system === IsopsephySystem.ENGLISH_BASE6) {
        const code = ch.toUpperCase().charCodeAt(0);
        if (code >= 65 && code <= 90) {
          val = (code - 64) * 6;
        }
      } else if (system === IsopsephySystem.GREEK_MULT6) {
        const greekAlphabet = ['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'];
        const idx = greekAlphabet.indexOf(ch);
        if (idx !== -1) {
          val = (idx + 1) * 6;
        }
      }

      if (val > 0) {
        letters.push({ char: ch, value: val });
        wordSum += val;
      }
    }

    if (letters.length > 0) {
      wordBreakdowns.push({
        word,
        value: wordSum,
        letters
      });
      total += wordSum;
    }
  }

  return { total, wordBreakdowns };
}
