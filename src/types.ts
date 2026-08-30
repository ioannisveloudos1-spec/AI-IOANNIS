export type TabType = 
  | "calculator" 
  | "search" 
  | "online-finder"
  | "bridges" 
  | "anagrams" 
  | "grammatari"
  | "graph" 
  | "veloudion"
  | "cube-apollo"
  | "solar-square"
  | "game"
  | "stats" 
  | "archive" 
  | "guide";

export type IsopsephySystemKey =
  | "greek_standard"
  | "greek_mult1"
  | "greek_mult6"
  | "greek_no_spec_6"
  | "greek_no_spec_7"
  | "lat_mult1"
  | "lat_mult6"
  | "eng_standard";

export enum NumberingSystem {
  IONIAN = "IONIAN",
  GREEK_SIMPLE = "GREEK_SIMPLE",
  GREEK_MULT6 = "GREEK_MULT6",
  ENGLISH_SIMPLE = "ENGLISH_SIMPLE",
  ENGLISH_BASE6 = "ENGLISH_BASE6",
}

export interface IonicLetter {
  char: string;
  upper: string;
  lower: string;
  name: string;
  value: number;
  category: "monas" | "dekas" | "ekatontas";
  archaic?: boolean;
  greekNumeral: string;
  description: string;
}

export interface LetterBreakdown {
  char: string;
  originalChar: string;
  value: number;
}

export interface WordIsopsephy {
  rawWord: string;
  normalizedWord: string;
  value: number;
  letters: LetterBreakdown[];
  root: number; // Πυθμένας (1-9)
  count?: number;
  indexInText?: number;
}

export interface PhraseMatch {
  id: string;
  phrase: string;
  words: WordIsopsephy[];
  value: number;
  root: number;
  startIndex: number;
  endIndex: number;
  wordCount: number;
  saved?: boolean;
  rejected?: boolean;
}

export interface SentenceIsopsephyMatch {
  id: string;
  sentenceIndex: number;
  text: string;
  normalizedText: string;
  value: number;
  root: number;
  greekNumeral: string;
  words: WordIsopsephy[];
  wordCount: number;
  charCount: number;
  punctuation: string;
  startIndex: number;
  endIndex: number;
}

export interface SavedIsopsephyItem {
  id: string;
  text: string;
  normalized: string;
  value: number;
  root: number;
  greekNumeral: string;
  isPhrase: boolean;
  wordCount: number;
  sourceText?: string;
  notes?: string;
  category?: string;
  createdAt: string;
}

export interface GrammatariSavedRecord {
  id: string;
  title: string;
  sourcePhrase: string;
  sourceIsopsephy: number;
  sourcePythmen: number;
  minLen: number;
  maxLen: number;
  totalLetters: number;
  availableLetters: { letter: string; count: number }[];
  totalMatches: number;
  matchesByLength: Record<number, {
    word: string;
    length: number;
    isopsephy: number;
    pythmen: number;
    letterBreakdown: string;
  }[]>;
  notes?: string;
  createdAt: string;
}

export interface WordCombinationMatch {
  id: string;
  words: WordIsopsephy[];
  phrase: string;
  value: number;
  root: number;
  wordCount: number;
  indices: number[];
  isUniqueMode?: boolean;
}

export interface SeedWordCombinationMatch {
  id: string;
  seedPhrase: string;
  seedValue: number;
  textWords: WordIsopsephy[];
  textWordsValue: number;
  totalValue: number;
  totalRoot: number;
  fullEquation: string;
  fullPhrase: string;
  textWordCount: number;
  totalWordCount: number;
  indices: number[];
  isUniqueMode?: boolean;
}

export interface TextAnalysisStats {
  totalChars: number;
  totalGreekChars: number;
  totalWords: number;
  uniqueWords: number;
  totalSum: number;
  averageWordValue: number;
  medianWordValue: number;
  highestWord: WordIsopsephy | null;
  lowestWord: WordIsopsephy | null;
}

export interface UniqueWordStat {
  count: number;
  value: number;
  raw: string;
  root: number;
}

export interface TextAnalysisResult {
  stats: TextAnalysisStats;
  words: WordIsopsephy[];
  singleMatches: WordIsopsephy[];
  phraseMatches: PhraseMatch[];
  uniqueWordsMap: Map<string, UniqueWordStat>;
}

export interface PresetText {
  id: string;
  title: string;
  author: string;
  era: string;
  category: "classical" | "biblical" | "philosophical" | "poetry";
  text: string;
  description: string;
  suggestedTargets?: number[];
}
